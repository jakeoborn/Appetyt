// Vibe-builder — generates a specialist-style trip itinerary via Claude Sonnet 4.6.
//
// Supabase Edge Function (Deno runtime). Deploy:
//   supabase functions deploy vibe-builder
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Client: POST https://<project>.supabase.co/functions/v1/vibe-builder
//   body: { device_id, destination, start_date, end_date, duration_days,
//           group, budget, style, loves, hates, limits, dim_hour_picks }
// Response: { brief: {...parsed JSON...}, raw: '...', parsed: bool, truncated: bool }
//
// Rate limit: 5 generations / hour per device_id, enforced via Supabase rate_limits table.

const RATE_LIMIT_PER_HOUR = 5;
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4000;

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

  const {
    device_id, destination, start_date, end_date, duration_days,
    group, budget, style, loves, hates, limits, dim_hour_picks,
  } = body || {};

  if (!device_id) return json({ error: 'device_id required' }, 400);
  if (!destination || !destination.trim()) return json({ error: 'destination required' }, 400);
  if (!start_date || !end_date) return json({ error: 'dates required' }, 400);

  const days = parseInt(duration_days) || daysBetween(start_date, end_date) || 3;

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

  const system = buildSystemPrompt({ destination, days, dim_hour_picks });
  const user = buildUserMessage({ destination, start_date, end_date, days, group, budget, style, loves, hates, limits });

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
        system,
        messages: [{ role: 'user', content: user }],
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
  const raw = data && data.content && data.content[0] && data.content[0].text || '';
  if (!raw) return json({ error: 'empty_response' }, 502);

  const stopReason = data && data.stop_reason;
  const parsed = tryParseBrief(raw);

  // Record successful generation in rate limit table (best-effort)
  recordGeneration(device_id).catch(() => {});

  return json({
    brief: parsed,
    raw,
    parsed: !!parsed,
    truncated: stopReason === 'max_tokens',
  }, 200);
});

// --- Prompt assembly --------------------------------------------------------

function buildSystemPrompt({ destination, days, dim_hour_picks }: { destination: string; days: number; dim_hour_picks?: string[] }) {
  const augmentBlock = (Array.isArray(dim_hour_picks) && dim_hour_picks.length)
    ? `\n\nDIM HOUR'S VETTED PICKS FOR ${destination.toUpperCase()} — these are independently curated, the real gems. Weave any that fit the user's vibe naturally into your day-by-day. You may also recommend other places you know well — treat the list below as suggestions, not constraints:\n${dim_hour_picks.slice(0, 20).join(', ')}.`
    : '';

  return `You are a Dim Hour travel specialist who knows ${destination} from firsthand experience — not from guides. You're the well-connected local friend: warm, confident, opinionated, specific. You know which restaurants need reservations weeks ahead, which markets are tourist traps, which neighborhoods come alive after 10pm.

You're building a trip that fits how this person actually travels — not a generic tourist itinerary. Be specific: name actual places, neighborhoods, dishes. Realistic travel times between locations. No fluff, no hedging, no "you might enjoy" — make the call.${augmentBlock}

OUTPUT FORMAT — return ONLY valid JSON, no prose around it. Schema:
{
  "cities": ["primary destination name(s)"],
  "days": [
    {
      "day": 1,
      "city": "City name for this day (if multi-region trip)",
      "title": "Short evocative day title",
      "morning":   [{"name":"Place","neighborhood":"Hood","time":"09:30","note":"Why here, what to order, the move."}],
      "afternoon": [{"name":"Place","neighborhood":"Hood","time":"14:00","note":"..."}],
      "evening":   [{"name":"Place","neighborhood":"Hood","time":"20:00","note":"..."}]
    }
  ],
  "bookInAdvance": [{"name":"Place or activity","leadTime":"e.g. 3 weeks","why":"Why book this far out"}],
  "hiddenGems": [{"name":"Place","neighborhood":"Hood","why":"Specific reason it's missed by tourists"}],
  "moneyPerDay": {"food": "$80-120", "transit": "$15", "activities": "$30", "lodging": "$200", "total": "$325-365"},
  "avoid": [{"name":"Overhyped place","why":"Specific reason it's not worth it for this traveler"}]
}

Rules:
- Generate exactly ${days} day(s).
- 1-3 items per timeslot — not exhaustive lists. Curate hard.
- "note" fields should be 1-2 sentences max, specific and opinionated.
- For multi-region trips, allocate days sensibly considering transit time and put the city in "city" field.
- "hiddenGems" must be 3 things actual tourists genuinely miss — not just lesser-known restaurants.
- "avoid" must be 2-3 overhyped places that aren't worth this traveler's time, given their style.
- Return ONLY the JSON object. No markdown fences, no commentary.`;
}

function buildUserMessage({ destination, start_date, end_date, days, group, budget, style, loves, hates, limits }: any) {
  const lines = [
    `Destination: ${destination}`,
    `Dates: ${start_date} → ${end_date} (${days} day${days !== 1 ? 's' : ''})`,
  ];
  if (group) lines.push(`Group: ${group}`);
  if (budget) lines.push(`Budget: ${budget}`);
  if (style) lines.push(`Travel style: ${style}`);
  if (loves) lines.push(`Things I love: ${loves}`);
  if (hates) lines.push(`Things I hate: ${hates}`);
  if (limits) lines.push(`Physical limitations: ${limits}`);
  lines.push('', 'Build me the trip.');
  return lines.join('\n');
}

// --- JSON parsing with tolerant fallback ------------------------------------

function tryParseBrief(text: string) {
  if (!text) return null;
  try { return JSON.parse(text); } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch {}
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

// --- Rate limiting via Supabase --------------------------------------------

async function checkRateLimit(deviceId: string) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return { limited: false };
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  try {
    const res = await fetch(`${url}/rest/v1/rate_limits?device_id=eq.${encodeURIComponent(deviceId)}&feature=eq.vibe&generated_at=gte.${encodeURIComponent(since)}&select=generated_at&order=generated_at.asc`, {
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
    body: JSON.stringify({ device_id: deviceId, feature: 'vibe' }),
  });
}

// --- Helpers ----------------------------------------------------------------

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: cors });
}

function daysBetween(startStr: string, endStr: string) {
  if (!startStr || !endStr) return null;
  const s = Date.parse(startStr + 'T00:00:00');
  const e = Date.parse(endStr + 'T00:00:00');
  if (isNaN(s) || isNaN(e)) return null;
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
}
