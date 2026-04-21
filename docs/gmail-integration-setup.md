# Gmail Integration Setup

Phase 3 of the Dim Hour reservation connections: auto-pull confirmations from
Resy, OpenTable, and Tock by reading the user's Gmail. Read-only. Privacy-first.

## What it does

1. User taps **Connect Gmail** in Profile → Reservation Connections.
2. Browser redirects to Google's consent screen for `gmail.readonly` scope only.
3. Google redirects back with a code; our callback exchanges it for a
   refresh token, which we store in Supabase keyed by device_id.
4. User taps **Sync reservations** (or auto-sync fires): Netlify function
   fetches only messages `from:(noreply@resy.com OR reservations@opentable.com OR tock@exploretock.com)`,
   parses out venue/date/time/party/platform/code, returns them to the
   client, which merges into `S.userData.reservations`.

**We never store** email bodies, headers, subjects, sender identities, or
any Gmail content outside the structured fields above. The OAuth scope is
the minimum required.

## One-time setup

### 1. Google Cloud project (5 min)

1. https://console.cloud.google.com → create project "Dim Hour"
2. Enable the **Gmail API** (APIs & Services → Library → search Gmail).
3. **OAuth consent screen**: External, app name "Dim Hour", user support
   email = your address, developer contact = your address.
   - Add scope: `https://www.googleapis.com/auth/gmail.readonly`
   - While unverified, add test users (your own Gmail) so you can sign in
     before Google's verification review.
4. **Credentials → Create Credentials → OAuth Client ID**
   - Application type: **Web application**
   - Name: "Dim Hour Web"
   - Authorized redirect URIs:
     - `https://dimhour.com/.netlify/functions/gmail-oauth-callback`
     - (optional, for local dev) `http://localhost:8888/.netlify/functions/gmail-oauth-callback`
5. Copy the **Client ID** and **Client secret**.

### 2. Netlify environment variables

In the Netlify dashboard → Site settings → Environment variables:

| Key | Value |
|---|---|
| `GMAIL_CLIENT_ID` | from Google Cloud |
| `GMAIL_CLIENT_SECRET` | from Google Cloud |
| `GMAIL_REDIRECT_URI` | `https://dimhour.com/.netlify/functions/gmail-oauth-callback` |
| `PUBLIC_URL` | `https://dimhour.com` |
| `SUPABASE_URL` | your existing Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (KEEP SECRET — do not commit) |

### 3. Supabase table

Run in Supabase SQL editor:

```sql
create table if not exists gmail_connections (
  device_id text primary key,
  refresh_token text not null,
  access_token text,
  access_token_expires_at timestamptz,
  email_hint text,
  last_sync_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table gmail_connections enable row level security;

-- Service role only — no public read/write.
-- (No policies defined: RLS denies by default; only service_role bypasses it.)
```

### 4. Privacy policy update

Add a section to `privacy.html`:

> ### Gmail integration (optional)
>
> If you connect your Gmail, Dim Hour uses Google's OAuth flow to request
> read-only access to your Gmail inbox. We use this access **only** to
> search for reservation confirmation emails sent by Resy, OpenTable, and
> Tock (from specific sender addresses: `noreply@resy.com`,
> `reservations@opentable.com`, `tock@exploretock.com`).
>
> From each matching email we extract only: restaurant/venue name,
> reservation date and time, party size, platform, and confirmation code.
> We do not store, transmit, copy, or share any other part of your inbox.
>
> You can disconnect at any time from Profile → Reservation Connections,
> or revoke access directly in your Google Account permissions
> (https://myaccount.google.com/permissions). Disconnecting deletes the
> refresh token we hold and immediately stops all future access.

## Publishing

1. Commit the netlify/functions files and deploy.
2. Complete the Google OAuth consent verification review (required to
   move from "Testing" to "Production" — until then, only test users
   can connect). This takes Google 1–3 weeks and requires a public
   privacy policy URL.

## Local testing

```bash
netlify dev        # runs functions at http://localhost:8888/.netlify/functions/*
```

In the Google Cloud OAuth client, add `http://localhost:8888/.netlify/functions/gmail-oauth-callback` to authorized redirect URIs, and temporarily set `GMAIL_REDIRECT_URI=http://localhost:8888/.netlify/functions/gmail-oauth-callback` in a `.env` file (gitignored).

## Known limitations

- Email parsing is heuristic. Format drift at any of the three platforms
  can break extraction; the parser is tolerant and returns partial data
  rather than failing, but rules in `gmail-sync.js` may need updates if
  a platform rewrites its confirmation template.
- First launch will only work for test users until Google verifies the
  OAuth consent screen.
- Gmail API quota is 1 billion units/day free — well beyond what we'd
  ever hit for user-triggered syncs.
