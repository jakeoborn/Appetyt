// Appetyt - Morning Cruise Briefing
// Runs daily at 8AM Caribbean (12:00 UTC) via netlify.toml schedule

const CRUISE_START = new Date('2026-03-21T00:00:00Z');

const PORTS = [
  {date:'2026-03-21',name:'San Juan',country:'Puerto Rico',flag:'🇵🇷',arrive:'6:30 AM',depart:'8:00 PM',hours:13.5,grad:'#5a0e0e,#2e0808',emoji:'🏛️',
   highlights:["La Factoria -- James Beard-winning cocktail bar","El Morro Fort -- 16th-century Spanish fortress","Old San Juan cobblestone walking tour -- free","Ocean Park Beach -- calm waters, away from crowds"]},
  {date:'2026-03-22',name:'Tortola',country:'British Virgin Islands',flag:'🇻🇬',arrive:'8:00 AM',depart:'5:00 PM',hours:9,grad:'#063a58,#022030',emoji:'🏄',
   highlights:["Jost Van Dyke day sail -- Foxy's Beach Bar & White Bay","The Indians snorkel -- best reef in the BVI","Cane Garden Bay -- swim and rum cocktails","Myett's Garden Grille beachfront lunch"]},
  {date:'2026-03-23',name:'At Sea',country:'Caribbean Sea',flag:'🌊',arrive:'',depart:'',hours:null,grad:'#0a1f3a,#050e1a',emoji:'🌊',
   highlights:["The Redemption Spa -- book ahead","Richard's Rooftop adults-only pool","Specialty dining at The Wake or Extra Virgin","Evening show at The Manor"]},
  {date:'2026-03-24',name:'Bridgetown',country:'Barbados',flag:'🇧🇧',arrive:'8:00 AM',depart:'8:00 PM',hours:12,grad:'#0e3a10,#072009',emoji:'🌴',
   highlights:["Mount Gay Rum Tour -- world's oldest distillery (1703)","Carlisle Bay snorkel -- sunken ships 5 min from port","Harbour Lights Beach Club -- rum punch & live music","Barbados Wildlife Reserve -- free-roaming green monkeys"]},
  {date:'2026-03-25',name:'Castries',country:'St. Lucia',flag:'🇱🇨',arrive:'8:00 AM',depart:'6:00 PM',hours:10,grad:'#1e1040,#100822',emoji:'🌋',
   highlights:["Sulphur Springs -- world's only drive-in volcano","Diamond Falls Botanical Garden & mineral baths","Piton Sail & Snorkel full-day tour","Coal Pot Restaurant -- waterfront Creole since 1966"]},
  {date:'2026-03-26',name:"St. John's",country:'Antigua',flag:'🇦🇬',arrive:'9:00 AM',depart:'8:00 PM',hours:11,grad:'#3a1e06,#200f03',emoji:'⛵',
   highlights:["Sheer Rocks -- cliffside dining above the Caribbean","Nelson's Dockyard -- UNESCO Heritage naval base","Dickenson Bay -- best white sand beach on the island","Cades Reef snorkel -- turtles and barracuda"]},
  {date:'2026-03-27',name:'Philipsburg',country:'St. Maarten',flag:'🇸🇽',arrive:'8:00 AM',depart:'5:00 PM',hours:9,grad:'#101038,#080820',emoji:'🛍️',
   highlights:["Maho Beach -- jumbo jets land 50ft overhead","Orient Bay Beach Club -- French Riviera vibes","Grand Case village -- gourmet capital of the Caribbean","Pinel Island ferry -- tiny paradise, 2-minute crossing"]},
  {date:'2026-03-28',name:'San Juan',country:'Puerto Rico (Debark)',flag:'🇵🇷',arrive:'6:30 AM',depart:'Debark',hours:null,grad:'#4a1a08,#260d04',emoji:'🏛️',
   highlights:["Kasalta Bakery -- mallorcas & cafe con leche (opens 6AM)","Last-minute Old San Juan shopping -- Ron del Barrilito rum","Allow 90 min minimum from port to SJU airport","Pre-book Uber -- very busy post-debark mornings"]},
];

function getTodayPort(overrideDate) {
  const dateStr = overrideDate || new Date().toISOString().split('T')[0];
  return PORTS.find(p => p.date === dateStr) || null;
}

function getDayNumber(overrideDate) {
  const d = overrideDate ? new Date(overrideDate+'T12:00:00Z') : new Date();
  return Math.floor((d - CRUISE_START) / (1000*60*60*24)) + 1;
}

async function getSubscribers() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/briefing_subscribers?active=eq.true&select=email,name`;
  const res = await fetch(url, {
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  return res.json();
}

async function generateBriefing(port, dayNum, recipientName) {
  const firstName = recipientName ? recipientName.split(' ')[0] : 'there';
  const isAtSea   = port.name === 'At Sea';
  const isDebark  = port.depart === 'Debark';

  let prompt;
  if (isAtSea) {
    prompt = `Write a warm morning message (under 120 words) for ${firstName} -- it's Day ${dayNum}, a sea day on their Caribbean cruise aboard Valiant Lady by Virgin Voyages. Suggest how to enjoy it. Warm, personal, no bullet points.`;
  } else if (isDebark) {
    prompt = `Write a warm farewell morning message (under 120 words) for ${firstName} -- it's debark day in San Juan. Include: breakfast at Kasalta Bakery, allow 90 min to SJU airport. End with a warm send-off. Personal tone.`;
  } else {
    prompt = `Write a personalised morning port briefing (under 180 words) for ${firstName} arriving in ${port.name}, ${port.country} -- Day ${dayNum} of their Caribbean cruise on Valiant Lady by Virgin Voyages.

Arriving ${port.arrive} - Departing ${port.depart} - ${port.hours} hours ashore
Top picks: ${port.highlights.join(' | ')}

Format: warm opening → one unmissable priority with a specific tip → suggested flow for the day → one practical reminder. No bullet points. Conversational and specific -- like advice from a well-travelled friend.`;
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
      system: "You are Appetyt's luxury travel concierge for a Virgin Voyages Caribbean cruise. Write warm, elegant, specific morning briefings. No markdown, no bullet points, no headers -- only conversational prose.",
      messages: [{role:'user', content: prompt}]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'Wishing you a wonderful day!';
}

function buildEmailHTML(port, dayNum, briefingText, recipientName) {
  const isAtSea  = port.name === 'At Sea';
  const isDebark = port.depart === 'Debark';
  const [g1, g2] = port.grad.split(',');
  const greeting = recipientName ? `Good morning, ${recipientName.split(' ')[0]}` : 'Good morning';
  const titleLine = isAtSea  ? 'A Day at Sea'
                  : isDebark ? `Final Morning - ${port.name}`
                  : `Day ${dayNum} - ${port.name}`;

  const timesHTML = (!isAtSea && !isDebark) ? `
    <table width="100%" cellpadding="0" cellspacing="6" style="margin:16px 0 0">
      <tr>
        <td width="33%" style="padding:0 3px 0 0">
          <div style="background:rgba(62,184,168,.12);border:1px solid rgba(62,184,168,.25);border-radius:10px;padding:10px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#3eb8a8;margin-bottom:4px">Arrive</div>
            <div style="font-size:15px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.arrive}</div>
          </div>
        </td>
        <td width="33%" style="padding:0 3px">
          <div style="background:rgba(212,117,106,.12);border:1px solid rgba(212,117,106,.25);border-radius:10px;padding:10px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#d4756a;margin-bottom:4px">Depart</div>
            <div style="font-size:15px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.depart}</div>
          </div>
        </td>
        <td width="33%" style="padding:0 0 0 3px">
          <div style="background:rgba(200,169,110,.12);border:1px solid rgba(200,169,110,.25);border-radius:10px;padding:10px 8px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#c8a96e;margin-bottom:4px">Ashore</div>
            <div style="font-size:15px;font-weight:600;color:#e8dfc8;font-family:Georgia,serif">${port.hours}h</div>
          </div>
        </td>
      </tr>
    </table>` : '';

  const highlightsHTML = (!isAtSea && !isDebark) ? `
    <div style="margin-top:20px;padding-top:18px;border-top:1px solid rgba(200,169,110,.08)">
      <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#3a3228;margin-bottom:12px">Top Highlights</div>
      ${port.highlights.map(h => `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px">
          <div style="width:4px;height:4px;min-width:4px;border-radius:50%;background:#c8a96e;margin-top:7px"></div>
          <div style="font-size:13px;color:#9a8e72;line-height:1.55">${h}</div>
        </div>`).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${greeting} -- ${port.name}</title></head>
<body style="margin:0;padding:0;background:#090c12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:20px 16px 48px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px">
  <tr><td style="background:linear-gradient(135deg,${g1},${g2});border-radius:18px 18px 0 0;padding:28px 24px 22px">
    <div style="font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(200,169,110,.65);margin-bottom:6px">Appetyt Travel - ${greeting}</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#ffffff;line-height:1.1;font-style:italic;margin-bottom:4px">${titleLine}</div>
    <div style="font-size:12px;color:rgba(255,255,255,.4)">${port.country} - Virgin Voyages Valiant Lady</div>
    ${timesHTML}
  </td></tr>
  <tr><td style="background:#11151f;border:1px solid rgba(200,169,110,.1);border-top:none;border-radius:0 0 18px 18px;padding:24px 24px 28px">
    <div style="font-size:14px;color:#9a8e72;line-height:1.8">${briefingText}</div>
    ${highlightsHTML}
    <div style="margin-top:24px;text-align:center">
      <a href="https://appetyt.app" style="display:inline-block;background:linear-gradient(135deg,#e2c98a,#9a6e28);color:#0a0600;font-size:13px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:12px">Open Port Guide in Appetyt →</a>
    </div>
    <div style="margin-top:22px;padding-top:18px;border-top:1px solid rgba(200,169,110,.06);text-align:center">
      <div style="font-size:11px;color:#3a3228">Appetyt - Southern Caribbean Cruise - Mar 21–28, 2026</div>
      <div style="font-size:10px;color:#2a2218;margin-top:3px">Virgin Voyages - Valiant Lady</div>
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

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
  return res.json();
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return {statusCode:200, headers, body:''};

  try {
    let testDate = null, testEmail = null;
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        testDate  = body.testDate  || null;
        testEmail = body.testEmail || null;
      } catch(e) {}
    }

    const port = getTodayPort(testDate);
    if (!port) {
      return {statusCode:200, headers, body: JSON.stringify({message:'No port today -- outside cruise window', date: testDate || new Date().toISOString().split('T')[0]})};
    }

    const dayNum = getDayNumber(testDate);

    let subscribers;
    if (testEmail) {
      subscribers = [{email: testEmail, name: null}];
    } else {
      subscribers = await getSubscribers();
    }

    if (!subscribers.length) {
      return {statusCode:200, headers, body: JSON.stringify({message:'No active subscribers'})};
    }

    const results = [];
    for (const sub of subscribers) {
      try {
        const briefingText = await generateBriefing(port, dayNum, sub.name);
        const isDebark = port.depart === 'Debark';
        const isAtSea  = port.name === 'At Sea';
        const subject  = isDebark ? `Safe Travels Home -- Final Morning`
                       : isAtSea  ? `Good Morning -- A Day at Sea`
                       : `${port.flag} Good Morning -- ${port.name}, ${port.country}`;
        const html = buildEmailHTML(port, dayNum, briefingText, sub.name);
        await sendEmail(sub.email, subject, html);
        results.push({email: sub.email, status:'sent', port: port.name});
      } catch(err) {
        console.error(`Failed for ${sub.email}:`, err.message);
        results.push({email: sub.email, status:'failed', error: err.message});
      }
    }

    return {statusCode:200, headers, body: JSON.stringify({success:true, port:port.name, day:dayNum, results})};

  } catch(err) {
    console.error('Morning brief error:', err);
    return {statusCode:500, headers, body: JSON.stringify({error: err.message, stack: err.stack?.split('\n').slice(0,3)})};
  }
};
