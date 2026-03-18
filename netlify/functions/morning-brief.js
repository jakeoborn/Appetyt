// ══════════════════════════════════════════════════════════════════
// Appetyt · Morning Cruise Briefing — Multi-User Version
//
// HOW IT WORKS:
//   1. Users enter email in the Appetyt Profile tab → saves to Supabase
//   2. This function runs at 7AM daily (scheduled via netlify.toml)
//   3. Pulls all active subscribers from Supabase
//   4. Generates a personalised AI briefing for today's port
//   5. Emails everyone via Resend
//   6. USERS NEVER NEED AN API KEY — it's all server-side
//
// ENV VARS (set in Netlify dashboard — admin only):
//   ANTHROPIC_API_KEY   — your existing key
//   RESEND_API_KEY      — free at resend.com
//   SUPABASE_URL        — your Supabase project URL
//   SUPABASE_SERVICE_KEY — service role key (NOT anon key)
// ══════════════════════════════════════════════════════════════════

const CRUISE_START = new Date('2026-03-21T00:00:00Z');
const CRUISE_END   = new Date('2026-03-29T00:00:00Z');

const PORTS = [
  { date:'2026-03-21', name:'San Juan',    country:'Puerto Rico',           flag:'🇵🇷', arrive:'6:30 AM', depart:'8:00 PM', hours:13.5,
    grad:'#5a0e0e,#2e0808', emoji:'🏛️',
    highlights:['La Factoria cocktail bar (James Beard winner)','El Morro Fort — 16th-century Spanish fortress','Ocean Park Beach — calm waters away from crowds','Old San Juan cobblestone walking tour — free'] },
  { date:'2026-03-22', name:'Tortola',     country:'British Virgin Islands', flag:'🇻🇬', arrive:'8:00 AM', depart:'5:00 PM', hours:9,
    grad:'#063a58,#022030', emoji:'🏄',
    highlights:["Jost Van Dyke day sail — Foxy's Beach Bar & White Bay","Myett's Garden Grille at Cane Garden Bay","The Indians — best snorkel in the BVI","Cane Garden Bay swimming"] },
  { date:'2026-03-23', name:'At Sea',      country:'Caribbean Sea',          flag:'🌊', arrive:'', depart:'', hours:null,
    grad:'#0a1f3a,#050e1a', emoji:'🌊',
    highlights:['Spa day on board','Pool deck cocktails & sunbathing','Specialty dining reservations','Evening entertainment show'] },
  { date:'2026-03-24', name:'Bridgetown',  country:'Barbados',               flag:'🇧🇧', arrive:'8:00 AM', depart:'8:00 PM', hours:12,
    grad:'#0e3a10,#072009', emoji:'🌴',
    highlights:["Mount Gay Rum Tour — world's oldest distillery (1703)","Harbour Lights Beach Club — rum punches & live music","Carlisle Bay snorkelling — 5 min from port","Pelican Craft Centre local market"] },
  { date:'2026-03-25', name:'Castries',    country:'St. Lucia',              flag:'🇱🇨', arrive:'8:00 AM', depart:'6:00 PM', hours:10,
    grad:'#1e1040,#100822', emoji:'🌋',
    highlights:["Sulphur Springs — world's only drive-in volcano","Coal Pot Restaurant — waterfront Creole since 1966","Piton Sail & Snorkel full day tour","Diamond Falls Botanical Garden"] },
  { date:'2026-03-26', name:"St. John's",  country:'Antigua',                flag:'🇦🇬', arrive:'9:00 AM', depart:'8:00 PM', hours:11,
    grad:'#3a1e06,#200f03', emoji:'⛵',
    highlights:['Dickenson Bay — powdery white sand, 15 min from port','Sheer Rocks cliffside dining at sunset',"Nelson's Dockyard — UNESCO Heritage site","Cades Reef snorkel — best marine life"] },
  { date:'2026-03-27', name:'Philipsburg', country:'St. Maarten',            flag:'🇸🇽', arrive:'8:00 AM', depart:'5:00 PM', hours:9,
    grad:'#101038,#080820', emoji:'🛍️',
    highlights:['Maho Beach — jumbo jets land 50ft overhead','Front Street duty-free (no sales tax)','Orient Bay — French Riviera vibes','Le Pressoir French-Creole dining'] },
  { date:'2026-03-28', name:'San Juan',    country:'Puerto Rico (Debark)',   flag:'🇵🇷', arrive:'6:30 AM', depart:'Debark',  hours:null,
    grad:'#4a1a08,#260d04', emoji:'🏛️',
    highlights:['Kasalta Bakery — mallorcas & café con leche','Old San Juan last-minute shopping','Allow 90 min to SJU airport — very busy mornings'] },
];

// ── Get today's port ──────────────────────────────────────────────
function getTodayPort(overrideDate) {
  const dateStr = overrideDate || new Date().toISOString().split('T')[0];
  return PORTS.find(p => p.date === dateStr) || null;
}

function getDayNumber(overrideDate) {
  const d = overrideDate ? new Date(overrideDate) : new Date();
  return Math.floor((d - CRUISE_START) / (1000 * 60 * 60 * 24)) + 1;
}

// ── Get all subscribers from Supabase ────────────────────────────
async function getSubscribers() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/briefing_subscribers?active=eq.true&select=email,name`;
  const res = await fetch(url, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    }
  });
  if (!res.ok) throw new Error(`Supabase error: ${await res.text()}`);
  return await res.json();
}

// ── Generate AI briefing ──────────────────────────────────────────
async function generateBriefing(port, dayNum, recipientName) {
  const firstName = recipientName ? recipientName.split(' ')[0] : 'there';
  const isAtSea   = port.name === 'At Sea';
  const isDebark  = port.depart === 'Debark';

  let userPrompt;
  if (isAtSea) {
    userPrompt = `Write a warm, brief morning message (under 120 words) for ${firstName} — it's a sea day on their Caribbean cruise (Day ${dayNum}). Suggest 3 ways to enjoy a relaxed sea day. Warm, personal tone. No bullet points.`;
  } else if (isDebark) {
    userPrompt = `Write a warm farewell morning message (under 120 words) for ${firstName} — it's their final cruise morning, debarkation day in San Juan. Include: grab breakfast at Kasalta Bakery, allow 90 min to the airport. End with a warm send-off. Personal, not corporate.`;
  } else {
    userPrompt = `Write a personalised morning port briefing (under 180 words) for ${firstName} arriving in ${port.name}, ${port.country} today (Day ${dayNum} of their Caribbean cruise).

Details: Arriving ${port.arrive} · Departing ${port.depart} · ${port.hours} hours ashore
Top experiences: ${port.highlights.join(' / ')}

Structure: warm opening acknowledging the destination → one unmissable priority with a specific tip → a suggested flow for the day → one practical reminder (back by X, book ahead, etc.). 

No bullet points. Warm and specific — like advice from a friend who's been there.`;
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: 'You are Appetyt\'s luxury travel concierge. Write warm, elegant, specific morning briefings. No markdown, no bullet points, no headers. Conversational paragraphs only.',
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  const data = await res.json();
  return data.content?.[0]?.text || 'Wishing you a wonderful day ashore!';
}

// ── Build HTML email ──────────────────────────────────────────────
function buildEmailHTML(port, dayNum, briefingText, recipientName) {
  const isAtSea  = port.name === 'At Sea';
  const isDebark = port.depart === 'Debark';
  const [g1, g2] = port.grad.split(',');

  const titleLine = isAtSea  ? 'A Day at Sea 🌊'
                  : isDebark ? `${port.flag} Final Morning · ${port.name}`
                  : `${port.flag} Day ${dayNum} · ${port.name}`;

  const greeting = recipientName ? `Good morning, ${recipientName.split(' ')[0]}` : 'Good morning';

  const timesHTML = (!isAtSea && !isDebark) ? `
    <table width="100%" cellpadding="0" cellspacing="6" style="margin:20px 0 0">
      <tr>
        <td width="33%" style="padding:0 4px 0 0">
          <div style="background:rgba(62,184,168,0.12);border:1px solid rgba(62,184,168,0.25);border-radius:10px;padding:11px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#3eb8a8;margin-bottom:4px">🟢 Arrive</div>
            <div style="font-size:16px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.arrive}</div>
          </div>
        </td>
        <td width="33%" style="padding:0 4px">
          <div style="background:rgba(212,117,106,0.12);border:1px solid rgba(212,117,106,0.25);border-radius:10px;padding:11px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#d4756a;margin-bottom:4px">🔵 Depart</div>
            <div style="font-size:16px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.depart}</div>
          </div>
        </td>
        <td width="33%" style="padding:0 0 0 4px">
          <div style="background:rgba(200,169,110,0.12);border:1px solid rgba(200,169,110,0.25);border-radius:10px;padding:11px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#c8a96e;margin-bottom:4px">⏱ Ashore</div>
            <div style="font-size:16px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.hours}h</div>
          </div>
        </td>
      </tr>
    </table>` : '';

  const highlightsHTML = (!isAtSea && !isDebark) ? `
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(200,169,110,0.08)">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#3a3228;margin-bottom:14px">✦ Top Highlights</div>
      ${port.highlights.map(h => `
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:9px">
          <div style="width:4px;height:4px;min-width:4px;border-radius:50%;background:#c8a96e;margin-top:8px"></div>
          <div style="font-size:13px;color:#9a8e72;line-height:1.55">${h}</div>
        </div>`).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${greeting} — ${port.name}</title></head>
<body style="margin:0;padding:0;background:#090c12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#090c12">
<tr><td align="center" style="padding:24px 16px 48px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px">

  <!-- HERO -->
  <tr><td style="background:linear-gradient(135deg,${g1} 0%,${g2} 100%);border-radius:18px 18px 0 0;padding:32px 28px 26px">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(200,169,110,0.65);margin-bottom:7px">✦ Appetyt Travel · ${greeting}</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#ffffff;line-height:1.1;font-style:italic;margin-bottom:5px">${titleLine}</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.4)">${port.country || 'Caribbean Cruise · Virgin Voyages'}</div>
    ${timesHTML}
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:#11151f;border:1px solid rgba(200,169,110,0.1);border-top:none;border-radius:0 0 18px 18px;padding:26px 28px 30px">

    <!-- AI Briefing -->
    <div style="font-size:14px;color:#9a8e72;line-height:1.8;white-space:pre-wrap">${briefingText}</div>

    ${highlightsHTML}

    <!-- CTA -->
    <div style="margin-top:28px;text-align:center">
      <a href="https://appetyt.app" style="display:inline-block;background:linear-gradient(135deg,#e2c98a,#9a6e28);color:#0a0600;font-size:13px;font-weight:700;text-decoration:none;padding:14px 30px;border-radius:12px;letter-spacing:0.03em">
        Open Port Guide in Appetyt →
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:26px;padding-top:20px;border-top:1px solid rgba(200,169,110,0.06);text-align:center">
      <div style="font-size:11px;color:#3a3228">Appetyt · Caribbean Cruise · Mar 21–28, 2026</div>
      <div style="font-size:10px;color:#2a2218;margin-top:3px">Virgin Voyages · Scarlet Lady</div>
      <div style="margin-top:10px">
        <a href="https://appetyt.app?unsubscribe=true" style="font-size:10px;color:#2a2218;text-decoration:underline">Unsubscribe</a>
      </div>
    </div>

  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Send via Resend ───────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Appetyt Travel <travel@appetyt.app>',
      to: [to],
      subject,
      html
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error for ${to}: ${err}`);
  }
  return await res.json();
}

// ── Main handler ──────────────────────────────────────────────────
exports.handler = async (event) => {
  const isManual = event.httpMethod === 'POST';

  // CORS for manual test trigger from the app
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    // Parse optional test date / test email override
    let testDate = null, testEmail = null;
    if (isManual && event.body) {
      const body = JSON.parse(event.body);
      testDate  = body.testDate  || null;
      testEmail = body.testEmail || null;
    }

    // Get today's port
    const port = getTodayPort(testDate);
    if (!port && !testDate) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'No port today — outside cruise window' }) };
    }
    const activePort = port || PORTS[3]; // Default to Bridgetown for testing outside cruise
    const dayNum = getDayNumber(testDate);

    // Get subscribers — if testEmail provided, just use that one
    let subscribers;
    if (testEmail) {
      subscribers = [{ email: testEmail, name: null }];
    } else {
      subscribers = await getSubscribers();
    }

    if (!subscribers.length) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'No active subscribers' }) };
    }

    // Generate one briefing (same text for all, personalised by name in greeting)
    // For scale, could cache this and vary only the greeting
    const results = [];
    for (const sub of subscribers) {
      try {
        const briefingText = await generateBriefing(activePort, dayNum, sub.name);
        const isDebark = activePort.depart === 'Debark';
        const isAtSea  = activePort.name === 'At Sea';
        const subject  = isDebark ? `⚓ Safe Travels Home · Final Morning`
                        : isAtSea  ? `🌊 Good Morning · A Day at Sea`
                        : `${activePort.flag} Good Morning · ${activePort.name}, ${activePort.country}`;

        const html = buildEmailHTML(activePort, dayNum, briefingText, sub.name);
        await sendEmail(sub.email, subject, html);
        results.push({ email: sub.email, status: 'sent' });
      } catch (err) {
        console.error(`Failed for ${sub.email}:`, err.message);
        results.push({ email: sub.email, status: 'failed', error: err.message });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, port: activePort.name, day: dayNum, results })
    };

  } catch (err) {
    console.error('Morning brief error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
