// Gmail disconnect — revoke the token with Google and delete the stored
// connection from Supabase.
// Client: POST /.netlify/functions/gmail-disconnect with JSON body { device_id }

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

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1. Look up the refresh_token so we can revoke it with Google
    const lookup = await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(device_id)}&select=refresh_token`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = lookup.ok ? await lookup.json() : [];
    const refreshToken = rows[0] && rows[0].refresh_token;

    // 2. Revoke with Google (best-effort — user can also revoke from their Google Account)
    if (refreshToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } catch (_) {}
    }

    // 3. Delete the stored row
    await fetch(`${url}/rest/v1/gmail_connections?device_id=eq.${encodeURIComponent(device_id)}`, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=minimal' },
    });

    return { statusCode: 200, headers: cors, body: JSON.stringify({ disconnected: true }) };
  } catch (e) {
    console.error('Disconnect error:', e && e.message);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'server' }) };
  }
};
