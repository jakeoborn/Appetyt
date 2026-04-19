# Data Verification Tools

Two free-API tools for verifying restaurant data before adding new entries or
after reports of outdated data. Neither requires an API key.

## 1. `verify-coords.js` — Address → lat/lng

Uses **Nominatim** (OpenStreetMap's free public geocoder). Rate-limited to
1 request/second per Nominatim ToS. User-Agent is set per their requirements.

### Usage

```bash
node scripts/verify-coords.js "246 N Canon Dr, Beverly Hills, CA 90210"
```

### Output

```json
{
  "status": "ok",
  "lat": 34.0688014,
  "lng": -118.398793,
  "confidence": "low",
  "display_name": "Mastro's Steakhouse, 246, North Canon Drive, Beverly Hills...",
  "class": "amenity",
  "type": "restaurant"
}
```

**Note on confidence:** Nominatim's `importance` score is often low for
restaurants (it's Wikipedia-link-based). What matters is that `display_name`
actually matches your intended restaurant at that address. If it says
"Mastro's Steakhouse, 246, North Canon Drive" you've got the right place.

### When to run

- After writing a new restaurant entry, before committing.
- Bulk: feed a CSV of `(name, address)` pairs through a loop.
- Rate-limit with `sleep 1.5` between calls.

## 2. `check-open.js` — Is restaurant still operating?

Fetches the restaurant's website, scans for closure phrases in the HTML, and
returns a status.

### Usage

```bash
node scripts/check-open.js "Cassia" "https://cassiala.com"
```

### Output

```json
{
  "name": "Cassia",
  "website": "https://cassiala.com",
  "status": "closed",
  "httpStatus": 200,
  "title": "Cassia – Santa Monica, Calif.",
  "signals": ["pattern-match: \"Permanently Closed\""]
}
```

### Status values

- **`open`** — website returns 2xx/3xx and HTML contains no closure phrases.
  **Still not a guarantee** — restaurants sometimes stay up long after
  closing. Strong signal, not proof.
- **`closed`** — website explicitly says "permanently closed", "it is with a
  heavy heart", "thank you for X years", etc. High confidence.
- **`uncertain`** — website broken (4xx/5xx), timed out, or unreachable.
  Could mean the business closed OR just a bad moment. Worth a manual check.

### Closure patterns matched

- `permanently closed`
- `closed (for good | permanently | our doors)`
- `our last day`, `final service`
- `it is with a heavy heart`
- `thank you for X years`, `X great years`, `X memories`
- `has closed`, `closing our doors`
- `after N years … closed / shutting`
- `we are no longer open / serving / operating`
- `bidding (you) farewell`

### When to run

- Before adding a new restaurant — make sure it's still open.
- After user reports a stale entry.
- Batch-audit all entries periodically:
  ```bash
  # Example: audit every entry in a city with a website
  node scripts/audit-links.js  # existing — does a broader HTTP sweep
  ```

## Workflow

When adding a new restaurant:

1. Get the address and website from the source article.
2. `node scripts/check-open.js "Name" "https://site"` — bail if closed.
3. `node scripts/verify-coords.js "full address"` — use the returned lat/lng.
4. Write the entry and commit.

When a user reports something wrong:

1. `node scripts/check-open.js` on the reported entry's website.
2. If closed, remove the entry + fix any cityLinks that referenced it.
3. If open, check the reported field (address, phone, etc.) separately.
