// Concierge — Dim Hour's per-city restaurant chatbot via Claude Haiku 4.5.
//
// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy concierge
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Client: POST https://<project>.supabase.co/functions/v1/concierge
//   body: { device_id, city, messages: [{role, content}], restaurants?: [...], system?: string }
// Response: { reply: '...' }
//
// Rate limit: 30 messages / hour per device_id, via shared rate_limits table (feature='concierge').

const RATE_LIMIT_PER_HOUR = 30;
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

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

  const { device_id, city, messages, restaurants, system } = body || {};

  if (!device_id) return json({ error: 'device_id required' }, 400);
  if (!Array.isArray(messages) || !messages.length) return json({ error: 'messages required' }, 400);

  const rl = await checkRateLimit(device_id);
  if (rl.limited) {
    return json({
      error: 'rate_limit',
      message: `You've hit ${RATE_LIMIT_PER_HOUR}/hour. Try again at ${rl.nextAt}.`,
      next_at: rl.nextAt,
    }, 429);
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json({ error: 'server_misconfigured' }, 500);

  const sys = system || buildDefaultSystem(city, restaurants);

  let resp: Response;
  try {
    resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: sys,
        messages: messages.slice(-12).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: String(m.content || ''),
        })),
      }),
    });
  } catch (_err) {
    return json({ error: 'upstream_network', message: 'Could not reach Claude — try again.' }, 502);
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    const status = resp.status === 429 ? 503 : 502;
    return json({ error: 'upstream_error', upstream_status: resp.status, message: text.slice(0, 200) }, status);
  }

  const data = await resp.json().catch(() => null);
  const reply = data && data.content && data.content[0] && data.content[0].text || '';
  if (!reply) return json({ error: 'empty_response' }, 502);

  recordGeneration(device_id).catch(() => {});

  return json({ reply }, 200);
});

function buildDefaultSystem(city: string | undefined, restaurants: unknown) {
  const cityName = city || 'this city';
  const rs = Array.isArray(restaurants) && restaurants.length
    ? `\n\nRestaurants: ${JSON.stringify(restaurants).slice(0, 8000)}`
    : '';
  return `You are Dim Hour's AI concierge for ${cityName}. Be concise, specific, enthusiastic, with a spicy opinionated voice. Reference actual restaurants by name. Max 100 words.

This is an ongoing conversation — refer back to previously-discussed restaurants when relevant ("since you liked X, you'd probably also enjoy Y"). Track the user's taste across the conversation.

When recommending a restaurant, ALWAYS include a booking link at the end using this format:
- For Resy restaurants: [Reserve on Resy](https://www.google.com/search?q=site%3Aresy.com+%22RESTAURANT_NAME%22+CITY)
- For Tock restaurants: [Reserve on Tock](https://www.google.com/search?q=site%3Aexploretock.com+%22RESTAURANT_NAME%22+CITY)
- For OpenTable restaurants: [Reserve on OpenTable](https://www.google.com/search?q=site%3Aopentable.com+%22RESTAURANT_NAME%22+CITY)
- Also include: [Order on DoorDash](https://www.doordash.com/search/store/RESTAURANT_NAME/)

Use the restaurant's reservation field to pick the right platform. If empty, default to OpenTable.

Always wrap restaurant names in **bold** so the UI can pick them up for action buttons.${rs}`;
}

async function checkRateLimit(deviceId: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return { limited: false };
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  try {
    const res = await fetch(`${url}/rest/v1/rate_limits?device_id=eq.${encodeURIComponent(deviceId)}&feature=eq.concierge&generated_at=gte.${encodeURIComponent(since)}&select=generated_at&order=generated_at.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { limited: false };
    const rows = await res.json();
    if (rows.length < RATE_LIMIT_PER_HOUR) return { limited: false };
    const oldest = new Date(rows[0].generated_at);
    const nextAt = new Date(oldest.getTime() + 60 * 60 * 1000).toISOString();
    return { limited: true, nextAt };
  } catch {
    return { limited: false };
  }
}

async function recordGeneration(deviceId: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return;
  await fetch(`${url}/rest/v1/rate_limits`, {
    method: 'POST',
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify({ device_id: deviceId, feature: 'concierge' }),
  });
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: cors });
}
