// Gmail sync — fetches confirmation emails from Resy/OpenTable/Tock and
// returns parsed reservations. Called on demand by the client.
//
// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy gmail-sync
//   supabase secrets set GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=...
//
// Client: POST /functions/v1/gmail-sync   body: { device_id }
// Response: { reservations: [{venue,date,time,party,platform,confirmationCode,loggedAt}], email }
//
// Privacy: query is locked to three known senders. We extract structured
// fields only and never return or store full email bodies.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  let body: any;
  try { body = await req.json(); }
  catch { return json({ error: 'invalid_json' }, 400); }

  const { device_id } = body || {};
  if (!device_id) return json({ error: 'device_id required' }, 400);

  try {
    const conn = await fetchConnection(device_id);
    if (!conn) return json({ error: 'not_connected' }, 404);

    let accessToken = conn.access_token;
    const now = Date.now();
    const expiresAt = conn.access_token_expires_at ? Date.parse(conn.access_token_expires_at) : 0;
    if (!accessToken || now >= expiresAt - 60_000) {
      const minted = await refreshAccessToken(conn.refresh_token);
      if (!minted) return json({ error: 'refresh_failed' }, 401);
      accessToken = minted.access_token;
      await upsertConnection(device_id, {
        access_token: accessToken,
        access_token_expires_at: new Date(Date.now() + (minted.expires_in || 3600) * 1000).toISOString(),
      }).catch(() => {});
    }

    const q = encodeURIComponent('from:(noreply@resy.com OR reservations@opentable.com OR tock@exploretock.com OR confirm@opentable.com) newer_than:6m');
    const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!listRes.ok) {
      const t = await listRes.text();
      return json({ error: 'gmail_list_failed', detail: t.slice(0, 200) }, 502);
    }
    const list = await listRes.json();
    const messageIds: string[] = (list.messages || []).map((m: any) => m.id);

    const reservations: any[] = [];
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

    const seen = new Set<string>();
    const deduped = reservations.filter((r) => {
      const key = r.confirmationCode
        ? `${r.platform}:${r.confirmationCode}`
        : `${r.venue}|${r.date}|${r.time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    await upsertConnection(device_id, { last_sync_at: new Date().toISOString() }).catch(() => {});

    return json({ reservations: deduped, email: conn.email_hint || null }, 200);
  } catch (e) {
    console.error('Sync error:', e instanceof Error ? e.message : String(e));
    return json({ error: 'server', message: e instanceof Error ? e.message : String(e) }, 500);
  }
});

// ---------- helpers ----------

async function fetchConnection(deviceId: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing');
  const res = await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(deviceId)}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

async function upsertConnection(deviceId: string, row: Record<string, unknown>) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase env vars missing');
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

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GMAIL_CLIENT_ID') || '',
      client_secret: Deno.env.get('GMAIL_CLIENT_SECRET') || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;
  return res.json();
}

// ---------- email parsing ----------

function parseReservation(msg: any) {
  const headers: Record<string, string> = {};
  ((msg.payload && msg.payload.headers) || []).forEach((h: any) => { headers[h.name.toLowerCase()] = h.value; });
  const from = (headers.from || '').toLowerCase();
  const subject = headers.subject || '';
  const dateHeader = headers.date || '';
  const body = extractPlainText(msg.payload) || msg.snippet || '';

  let platform: string | null = null;
  if (from.includes('resy.com')) platform = 'Resy';
  else if (from.includes('opentable.com')) platform = 'OpenTable';
  else if (from.includes('exploretock.com') || from.includes('tock')) platform = 'Tock';
  if (!platform) return null;

  if (!/reservation|booking|confirmed|confirmation|is confirmed|you're going|you are going/i.test(subject + ' ' + body.slice(0, 400))) {
    return null;
  }

  const venue = extractVenue(subject, body);
  const isoDate = extractDate(subject, body, dateHeader);
  const time = extractTime(subject, body);
  const party = extractParty(subject, body);
  const confirmationCode = extractCode(subject, body);

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

function extractPlainText(part: any): string {
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
  if (part.mimeType === 'text/html' && part.body && part.body.data) {
    return decodeBase64Url(part.body.data).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return '';
}

function decodeBase64Url(s: string) {
  try {
    const pad = '='.repeat((4 - (s.length % 4)) % 4);
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  } catch { return ''; }
}

function extractVenue(subject: string, body: string) {
  let m = subject.match(/reservation (?:at|for) (.+?)(?: is| on|$)/i);
  if (m) return m[1].trim();
  m = subject.match(/(?:confirmed:?|going to|reservation at)\s+(.+?)(?:\s+(?:on|for|\-|\|)|$)/i);
  if (m) return m[1].trim();
  m = subject.match(/^(.+?)\s*[-–]\s*your reservation/i);
  if (m) return m[1].trim();
  m = body.match(/\bat\s+([A-Z][\w'&\-.\s]{2,60})(?:\.|,|\n)/);
  if (m) return m[1].trim();
  return null;
}

function extractDate(subject: string, body: string, dateHeader: string) {
  const hay = subject + '\n' + body.slice(0, 800);
  const months = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  const re = new RegExp(`${months}\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, 'i');
  const m = hay.match(re);
  if (m) return toIso(m[1], m[2], m[3]);
  const yr = (Date.parse(dateHeader) ? new Date(dateHeader) : new Date()).getFullYear();
  const re2 = new RegExp(`${months}\\s+(\\d{1,2})`, 'i');
  const m2 = hay.match(re2);
  if (m2) return toIso(m2[1], m2[2], String(yr));
  return null;
}

function toIso(monthName: string, day: string, year: string | number) {
  const M: Record<string, number> = {
    january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
    jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12,
  };
  const m = M[monthName.toLowerCase()];
  if (!m) return null;
  const mm = String(m).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function extractTime(subject: string, body: string) {
  const hay = subject + '\n' + body.slice(0, 800);
  const m = hay.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/);
  if (m) return m[1].toUpperCase().replace(/\s+/g, '');
  const m2 = hay.match(/\b(\d{1,2}\s*(?:AM|PM|am|pm))\b/);
  if (m2) return m2[1].toUpperCase().replace(/\s+/g, '');
  return null;
}

function extractParty(subject: string, body: string) {
  const hay = subject + '\n' + body.slice(0, 800);
  const m = hay.match(/\b(?:party of|for|table for)\s+(\d{1,2})\b/i);
  if (m) return m[1];
  const m2 = hay.match(/\b(\d{1,2})\s+(?:guests?|people|persons)\b/i);
  if (m2) return m2[1];
  return null;
}

function extractCode(subject: string, body: string) {
  const hay = subject + '\n' + body.slice(0, 1200);
  const m = hay.match(/\b(?:confirmation|reservation|booking|ref)\s*(?:code|number|#|id)?[:\s]+([A-Z0-9\-]{4,16})\b/i);
  if (m) return m[1];
  return null;
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: cors });
}
