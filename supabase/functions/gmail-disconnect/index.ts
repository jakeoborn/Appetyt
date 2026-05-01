// Gmail disconnect — revoke the token with Google and delete the stored
// connection from Supabase.
//
// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy gmail-disconnect
//
// Client: POST /functions/v1/gmail-disconnect   body: { device_id }

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
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return json({ error: 'server_misconfigured' }, 500);

    const lookup = await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(device_id)}&select=refresh_token`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = lookup.ok ? await lookup.json() : [];
    const refreshToken = rows[0] && rows[0].refresh_token;

    if (refreshToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } catch (_) {}
    }

    await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(device_id)}`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=minimal' },
    });

    return json({ disconnected: true }, 200);
  } catch (e) {
    console.error('Disconnect error:', e instanceof Error ? e.message : String(e));
    return json({ error: 'server' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: cors });
}
