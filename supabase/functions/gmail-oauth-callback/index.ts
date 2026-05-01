// Gmail OAuth — Step 2: exchange code for tokens, store refresh_token in Supabase.
//
// Supabase Edge Function (Deno). Deploy:
//   supabase functions deploy gmail-oauth-callback --no-verify-jwt
//   supabase secrets set GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... GMAIL_REDIRECT_URI=...
//
// Google redirects here after consent: GET /functions/v1/gmail-oauth-callback?code=<>&state=<>
//
// Privacy: only the refresh_token is persisted (server-side in Supabase),
// keyed by device_id. We never store email content, headers, or identity
// beyond an optional email_hint (the user's Gmail address) for their own UI.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers: cors });

  const origin = Deno.env.get('PUBLIC_URL') || 'https://dimhour.com';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) return redirectToApp(origin, `#gmail_oauth=denied&reason=${encodeURIComponent(error)}`);
    if (!code || !state) return redirectToApp(origin, `#gmail_oauth=error&reason=missing_code_or_state`);

    let parsed: any;
    try {
      parsed = JSON.parse(fromB64url(state));
    } catch {
      return redirectToApp(origin, `#gmail_oauth=error&reason=bad_state`);
    }
    const deviceId = parsed && parsed.device_id;
    if (!deviceId) return redirectToApp(origin, `#gmail_oauth=error&reason=no_device`);

    const redirectUri = Deno.env.get('GMAIL_REDIRECT_URI')
      || `${supabaseUrl}/functions/v1/gmail-oauth-callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GMAIL_CLIENT_ID') || '',
        client_secret: Deno.env.get('GMAIL_CLIENT_SECRET') || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, body.slice(0, 200));
      return redirectToApp(origin, `#gmail_oauth=error&reason=token_exchange`);
    }

    const tokens = await tokenRes.json();
    if (!tokens.refresh_token) {
      return redirectToApp(origin, `#gmail_oauth=error&reason=no_refresh_token`);
    }

    let emailHint: string | null = null;
    try {
      const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (profileRes.ok) {
        const p = await profileRes.json();
        emailHint = p.emailAddress || null;
      }
    } catch (_) {}

    await upsertConnection(deviceId, {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      access_token_expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
      email_hint: emailHint,
      last_sync_at: null,
    });

    return redirectToApp(origin, `#gmail_oauth=connected&email=${encodeURIComponent(emailHint || '')}`);
  } catch (e) {
    console.error('Callback error:', e instanceof Error ? e.message : String(e));
    return redirectToApp(origin, `#gmail_oauth=error&reason=server`);
  }
});

function redirectToApp(origin: string, hash: string) {
  return new Response('', {
    status: 302,
    headers: { ...cors, Location: `${origin}/${hash || ''}` },
  });
}

async function upsertConnection(deviceId: string, row: Record<string, unknown>) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
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

function fromB64url(s: string) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  return atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
}
