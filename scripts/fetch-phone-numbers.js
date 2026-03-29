/**
 * fetch-phone-numbers.js — Add phone numbers to DALLAS_DATA via Google Places API
 * ================================================================================
 *
 * Uses Google Places Text Search to find each restaurant, then fetches the phone
 * number from the Place Details endpoint and patches index.html.
 *
 * Prerequisites:
 *   export GOOGLE_PLACES_API_KEY="your-key-here"
 *
 * Usage:
 *   node scripts/fetch-phone-numbers.js              # fetch all missing phones
 *   node scripts/fetch-phone-numbers.js --dry-run     # preview without writing
 *
 * Estimated cost:
 *   ~476 text searches + ~476 detail calls ≈ $23
 *   (Text Search: $32/1K, Details Basic: $17/1K)
 */

const fs = require('fs');
const path = require('path');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const DELAY_MS = 250; // 4 req/s to stay under rate limits
const DRY_RUN = process.argv.includes('--dry-run');

if (!GOOGLE_API_KEY) {
  console.error('ERROR: Set GOOGLE_PLACES_API_KEY environment variable first.');
  console.error('  export GOOGLE_PLACES_API_KEY="your-key-here"');
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchPlace(name, address) {
  const query = `${name} ${address}`;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.nationalPhoneNumber',
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 1,
    }),
  });
  const data = await res.json();
  if (data.places && data.places.length > 0) {
    return data.places[0].nationalPhoneNumber || null;
  }
  return null;
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (no changes will be written) ===' : '=== Fetching phone numbers ===');

  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  const prefix = 'const DALLAS_DATA = ';
  const start = html.indexOf(prefix) + prefix.length;
  let bracketCount = 0;
  let end = start;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') bracketCount++;
    else if (html[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) { end = i + 1; break; }
    }
  }

  const data = JSON.parse(html.slice(start, end));
  const needsPhone = data.filter(r => !r.phone && r.address);

  console.log(`Total restaurants: ${data.length}`);
  console.log(`Already have phone: ${data.length - needsPhone.length}`);
  console.log(`Need phone lookup: ${needsPhone.length}`);
  console.log('');

  let found = 0;
  let notFound = 0;

  for (let i = 0; i < needsPhone.length; i++) {
    const r = needsPhone[i];
    process.stdout.write(`[${i + 1}/${needsPhone.length}] ${r.name}... `);

    try {
      const phone = await searchPlace(r.name, r.address);
      if (phone) {
        r.phone = phone;
        // Also update in the main data array
        const idx = data.findIndex(d => d.id === r.id);
        if (idx !== -1) data[idx].phone = phone;
        console.log(`✅ ${phone}`);
        found++;
      } else {
        console.log('❌ not found');
        notFound++;
      }
    } catch (err) {
      console.log(`⚠️ error: ${err.message}`);
      notFound++;
    }

    await sleep(DELAY_MS);
  }

  console.log('');
  console.log(`Done! Found: ${found}, Not found: ${notFound}`);

  if (!DRY_RUN && found > 0) {
    const newDataStr = JSON.stringify(data);
    const newHtml = html.slice(0, start) + newDataStr + html.slice(end);
    fs.writeFileSync(INDEX_PATH, newHtml, 'utf8');
    console.log(`Updated index.html with ${found} new phone numbers.`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
