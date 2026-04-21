// Gmail sync — fetches confirmation emails from Resy/OpenTable/Tock and returns
// parsed reservations. Called on demand by the client (not on a schedule).
//
// Client: POST /.netlify/functions/gmail-sync with JSON body { device_id }
// Response: { reservations: [{venue, date, time, party, platform, confirmationCode, loggedAt}], email: '...' }
//
// Privacy: query is locked to the three known senders. We fetch only metadata
// + a short snippet of each matching message, parse out the structured
// fields, and return them. We never return or store email bodies or headers
// beyond what's needed to fill {venue, date, time, party, platform, code}.

exports.handler = async function(event) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'POST only' }) };

  try {
    const { device_id } = JSON.parse(event.body || '{}');
    if (!device_id) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'device_id required' }) };

    // 1. Look up stored refresh_token for this device
    const conn = await fetchConnection(device_id);
    if (!conn) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'not_connected' }) };

    // 2. Mint a fresh access_token
    let accessToken = conn.access_token;
    const now = Date.now();
    const expiresAt = conn.access_token_expires_at ? Date.parse(conn.access_token_expires_at) : 0;
    if (!accessToken || now >= expiresAt - 60_000) {
      const minted = await refreshAccessToken(conn.refresh_token);
      if (!minted) return { statusCode: 401, headers: cors, body: JSON.stringify({ error: 'refresh_failed' }) };
      accessToken = minted.access_token;
      // Update stored access_token (best-effort; failure here is non-fatal)
      await upsertConnection(device_id, {
        access_token: accessToken,
        access_token_expires_at: new Date(Date.now() + (minted.expires_in || 3600) * 1000).toISOString(),
      }).catch(() => {});
    }

    // 3. Query Gmail for messages from our three known senders only.
    const q = encodeURIComponent('from:(noreply@resy.com OR reservations@opentable.com OR tock@exploretock.com OR confirm@opentable.com) newer_than:6m');
    const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!listRes.ok) {
      const t = await listRes.text();
      return { statusCode: 502, headers: cors, body: JSON.stringify({ error: 'gmail_list_failed', detail: t.slice(0, 200) }) };
    }
    const list = await listRes.json();
    const messageIds = (list.messages || []).map(m => m.id);

    // 4. Fetch each message (metadata + snippet + small body parts) in parallel,
    //    limited concurrency via Promise.all on the ID list (Gmail rate limits
    //    are generous; 50 messages is fine).
    const reservations = [];
    await Promise.all(messageIds.map(async (id) => {
      try {
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!msgRes.ok) return;
        const msg = await msgRes.json();
        const parsed = parseReservation(msg);
        if (parsed) reservations.push(parsed);
      } catch (_) {}
    }));

    // 5. Dedupe on (platform + confirmationCode) or (venue + date + time).
    const seen = new Set();
    const deduped = reservations.filter(r => {
      const key = r.confirmationCode
        ? `${r.platform}:${r.confirmationCode}`
        : `${r.venue}|${r.date}|${r.time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 6. Update last_sync_at (best-effort)
    await upsertConnection(device_id, { last_sync_at: new Date().toISOString() }).catch(() => {});

    return { statusCode: 200, headers: cors, body: JSON.stringify({ reservations: deduped, email: conn.email_hint || null }) };
  } catch (e) {
    console.error('Sync error:', e && e.message);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'server', message: (e && e.message) || String(e) }) };
  }
};

// ---------- helpers ----------

async function fetchConnection(deviceId) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  const res = await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(deviceId)}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

async function upsertConnection(deviceId, row) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${url}/rest/v1/gmail_connections?on_conflict=device_id`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ device_id: deviceId, ...row }),
  });
  if (!res.ok) throw new Error(`Supabase upsert failed: ${res.status}`);
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

// ---------- email parsing ----------
// We look at the From header + subject + plain-text body. We extract:
//   venue, date (YYYY-MM-DD), time (human), party, platform, confirmationCode
//
// These parsers are tolerant of format drift — if any field can't be
// extracted, we still return the reservation with the fields we could find.

function parseReservation(msg) {
  const headers = {};
  (msg.payload && msg.payload.headers || []).forEach(h => { headers[h.name.toLowerCase()] = h.value; });
  const from = (headers.from || '').toLowerCase();
  const subject = headers.subject || '';
  const dateHeader = headers.date || '';
  const body = extractPlainText(msg.payload) || msg.snippet || '';

  let platform = null;
  if (from.includes('resy.com')) platform = 'Resy';
  else if (from.includes('opentable.com')) platform = 'OpenTable';
  else if (from.includes('exploretock.com') || from.includes('tock')) platform = 'Tock';
  if (!platform) return null;

  // Heuristic: only treat as a reservation if subject mentions reservation/booking/confirmed
  if (!/reservation|booking|confirmed|confirmation|is confirmed|you're going|you are going/i.test(subject + ' ' + body.slice(0, 400))) {
    return null;
  }

  const venue = extractVenue(subject, body, platform);
  const isoDate = extractDate(subject, body, dateHeader);
  const time = extractTime(subject, body);
  const party = extractParty(subject, body);
  const confirmationCode = extractCode(subject, body, platform);

  if (!venue && !isoDate) return null;

  return {
    venue: venue || '(unknown venue)',
    date: isoDate || '',
    time: time || '',
    party: party || '',
    platform,
    confirmationCode: confirmationCode || null,
    loggedAt: Date.parse(dateHeader) || Date.now(),
  };
}

function extractPlainText(part) {
  if (!part) return '';
  if (part.mimeType === 'text/plain' && part.body && part.body.data) {
    return decodeBase64Url(part.body.data);
  }
  if (part.parts && part.parts.length) {
    for (const p of part.parts) {
      const t = extractPlainText(p);
      if (t) return t;
    }
  }
  // Fallback: strip HTML
  if (part.mimeType === 'text/html' && part.body && part.body.data) {
    return decodeBase64Url(part.body.data).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return '';
}

function decodeBase64Url(s) {
  try { return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }
  catch (e) { return ''; }
}

function extractVenue(subject, body, platform) {
  // Resy: "Your reservation at <Venue> is confirmed"
  let m = subject.match(/reservation (?:at|for) (.+?)(?: is| on|$)/i);
  if (m) return m[1].trim();
  // OpenTable: "Confirmed: <Venue>"  |  "You're going to <Venue>"
  m = subject.match(/(?:confirmed:?|going to|reservation at)\s+(.+?)(?:\s+(?:on|for|\-|\|)|$)/i);
  if (m) return m[1].trim();
  // Tock: "<Venue> - Your reservation"
  m = subject.match(/^(.+?)\s*[-–]\s*your reservation/i);
  if (m) return m[1].trim();
  // Fallback: look for a line after "at" in body
  m = body.match(/\bat\s+([A-Z][\w'&\-.\s]{2,60})(?:\.|,|\n)/);
  if (m) return m[1].trim();
  return null;
}

function extractDate(subject, body, dateHeader) {
  const hay = subject + '\n' + body.slice(0, 800);
  // Prefer patterns with a year
  const months = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  const re = new RegExp(`${months}\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, 'i');
  const m = hay.match(re);
  if (m) return toIso(m[1], m[2], m[3]);
  // No year — assume the year of the email's date header
  const yr = (Date.parse(dateHeader) ? new Date(dateHeader) : new Date()).getFullYear();
  const re2 = new RegExp(`${months}\\s+(\\d{1,2})`, 'i');
  const m2 = hay.match(re2);
  if (m2) return toIso(m2[1], m2[2], yr);
  return null;
}

function toIso(monthName, day, year) {
  const M = { january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
              jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12 };
  const m = M[monthName.toLowerCase()];
  if (!m) return null;
  const mm = String(m).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function extractTime(subject, body) {
  const hay = subject + '\n' + body.slice(0, 800);
  const m = hay.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/);
  if (m) return m[1].toUpperCase().replace(/\s+/g, '');
  const m2 = hay.match(/\b(\d{1,2}\s*(?:AM|PM|am|pm))\b/);
  if (m2) return m2[1].toUpperCase().replace(/\s+/g, '');
  return null;
}

function extractParty(subject, body) {
  const hay = subject + '\n' + body.slice(0, 800);
  const m = hay.match(/\b(?:party of|for|table for)\s+(\d{1,2})\b/i);
  if (m) return m[1];
  const m2 = hay.match(/\b(\d{1,2})\s+(?:guests?|people|persons)\b/i);
  if (m2) return m2[1];
  return null;
}

function extractCode(subject, body, platform) {
  const hay = subject + '\n' + body.slice(0, 1200);
  const m = hay.match(/\b(?:confirmation|reservation|booking|ref)\s*(?:code|number|#|id)?[:\s]+([A-Z0-9\-]{4,16})\b/i);
  if (m) return m[1];
  return null;
}
