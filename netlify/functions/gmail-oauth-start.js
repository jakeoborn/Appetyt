// Gmail OAuth — Step 1: start the consent flow.
// Client calls: GET /.netlify/functions/gmail-oauth-start?device_id=<id>
// Returns 302 redirect to Google's consent screen.
//
// Privacy: scope is `gmail.readonly` (minimum necessary). device_id round-trips
// via OAuth state so the callback can associate the granted token with the
// calling device.

exports.handler = async function(event) {
  const origin = process.env.PUBLIC_URL || 'https://dimhour.com';
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const clientId    = process.env.GMAIL_CLIENT_ID;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || `${origin}/.netlify/functions/gmail-oauth-callback`;

  if (!clientId) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GMAIL_CLIENT_ID not configured' }) };
  }

  const deviceId = (event.queryStringParameters || {}).device_id || '';
  if (!deviceId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'device_id query param required' }) };
  }

  // Sign the state so the callback can trust it (HMAC with a shared secret).
  const state = Buffer.from(JSON.stringify({ device_id: deviceId, issued_at: Date.now() })).toString('base64url');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    access_type: 'offline',      // needed to receive refresh_token
    prompt: 'consent',           // forces refresh_token even on repeat consent
    include_granted_scopes: 'true',
    state,
  });

  return {
    statusCode: 302,
    headers: {
      ...headers,
      Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    },
    body: '',
  };
};
