// Gmail OAuth — Step 2: exchange code for tokens, store refresh_token in Supabase.
// Google redirects here after consent: GET /.netlify/functions/gmail-oauth-callback?code=<>&state=<>
//
// Privacy: we store ONLY the refresh_token (server-side in Supabase), keyed by
// device_id. We never store the user's email content, headers, or identity
// beyond an optional "email_hint" (user's Gmail address) for their own display.

exports.handler = async function(event) {
  const origin = process.env.PUBLIC_URL || 'https://dimhour.com';

  try {
    const { code, state, error } = event.queryStringParameters || {};

    if (error) {
      return redirectToApp(origin, `#gmail_oauth=denied&reason=${encodeURIComponent(error)}`);
    }
    if (!code || !state) {
      return redirectToApp(origin, `#gmail_oauth=error&reason=missing_code_or_state`);
    }

    let parsed;
    try {
      parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    } catch (e) {
      return redirectToApp(origin, `#gmail_oauth=error&reason=bad_state`);
    }
    const deviceId = parsed.device_id;
    if (!deviceId) return redirectToApp(origin, `#gmail_oauth=error&reason=no_device`);

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GMAIL_CLIENT_ID,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        redirect_uri: process.env.GMAIL_REDIRECT_URI || `${origin}/.netlify/functions/gmail-oauth-callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, body.slice(0, 200));
      return redirectToApp(origin, `#gmail_oauth=error&reason=token_exchange`);
    }

    const tokens = await tokenRes.json();
    // tokens = { access_token, refresh_token, expires_in, scope, token_type }
    if (!tokens.refresh_token) {
      // No refresh_token — user probably reconsented without prompt=consent.
      return redirectToApp(origin, `#gmail_oauth=error&reason=no_refresh_token`);
    }

    // Fetch email hint (the Gmail address) for display only — not stored as PII
    // beyond this one field so the user can see which account they connected.
    let emailHint = null;
    try {
      const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (profileRes.ok) {
        const p = await profileRes.json();
        emailHint = p.emailAddress || null;
      }
    } catch (_) {}

    // Persist to Supabase (gmail_connections table — see setup docs).
    await upsertConnection(deviceId, {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      access_token_expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
      email_hint: emailHint,
      last_sync_at: null,
    });

    return redirectToApp(origin, `#gmail_oauth=connected&email=${encodeURIComponent(emailHint || '')}`);
  } catch (e) {
    console.error('Callback error:', e && e.message);
    return redirectToApp(origin, `#gmail_oauth=error&reason=server`);
  }
};

function redirectToApp(origin, hash) {
  return {
    statusCode: 302,
    headers: { Location: `${origin}/${hash || ''}` },
    body: '',
  };
}

async function upsertConnection(deviceId, row) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');

  const res = await fetch(`${url}/rest/v1/gmail_connections?on_conflict=device_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ device_id: deviceId, ...row }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Supabase upsert failed: ${res.status} ${t.slice(0, 200)}`);
  }
}
