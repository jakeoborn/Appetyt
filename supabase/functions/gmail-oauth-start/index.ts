// Gmail OAuth — Step 1: start the consent flow.
//
// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy gmail-oauth-start --no-verify-jwt
//   supabase secrets set GMAIL_CLIENT_ID=... GMAIL_REDIRECT_URI=... PUBLIC_URL=https://dimhour.com
//
// Client calls: GET /functions/v1/gmail-oauth-start?device_id=<id>
// Returns 302 redirect to Google's consent screen.
//
// Privacy: scope is `gmail.readonly`. device_id round-trips via OAuth `state`
// so the callback can associate the granted token with the calling device.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers: cors });

  const url = new URL(req.url);
  const origin = Deno.env.get('PUBLIC_URL') || 'https://dimhour.com';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const clientId = Deno.env.get('GMAIL_CLIENT_ID');
  const redirectUri = Deno.env.get('GMAIL_REDIRECT_URI')
    || `${supabaseUrl}/functions/v1/gmail-oauth-callback`;

  if (!clientId) {
    return json({ error: 'GMAIL_CLIENT_ID not configured' }, 500);
  }

  const deviceId = url.searchParams.get('device_id') || '';
  if (!deviceId) {
    return json({ error: 'device_id query param required' }, 400);
  }

  const state = b64url(JSON.stringify({ device_id: deviceId, issued_at: Date.now() }));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });

  return new Response('', {
    status: 302,
    headers: {
      ...cors,
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    },
  });
});

function b64url(s: string) {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
