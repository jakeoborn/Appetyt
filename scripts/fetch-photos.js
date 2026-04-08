/**
 * Fetch restaurant photos from Google Places API
 *
 * Usage:
 *   GOOGLE_API_KEY=your_key node scripts/fetch-photos.js [--city Dallas] [--limit 50] [--dry-run]
 *
 * What it does:
 *   1. Reads restaurant data from index.html
 *   2. For each restaurant without a photoUrl, looks it up on Google Places
 *   3. Grabs the best available photo URL
 *   4. Writes the photoUrl back into index.html
 *
 * The Google Places Photo API returns real venue photos uploaded by businesses
 * and Google Maps users. Cost: ~$7 per 1,000 lookups (first $200/month free).
 *
 * To get a Google API key:
 *   1. Go to https://console.cloud.google.com/
 *   2. Create a project (or use existing)
 *   3. Enable "Places API (New)"
 *   4. Create an API key under Credentials
 *   5. Run: GOOGLE_API_KEY=AIza... node scripts/fetch-photos.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_API_KEY;
const args = process.argv.slice(2);
const cityFlag = args.includes('--city') ? args[args.indexOf('--city') + 1] : null;
const limitFlag = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 50;
const dryRun = args.includes('--dry-run');

if (!API_KEY) {
  console.error('\n  Missing GOOGLE_API_KEY environment variable.\n');
  console.error('  Usage: GOOGLE_API_KEY=your_key node scripts/fetch-photos.js [--city Dallas] [--limit 50] [--dry-run]\n');
  console.error('  Get a key at: https://console.cloud.google.com/apis/credentials\n');
  process.exit(1);
}

// Detect all city data arrays in index.html
function detectCities(html) {
  const re = /const\s+([A-Z_]+)_DATA\s*=\s*\[/g;
  const cities = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    cities.push(m[1]);
  }
  return cities;
}

// Extract restaurant data array for a city
function extractData(html, cityKey) {
  const re = new RegExp(`const\\s+${cityKey}_DATA\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
  const m = html.match(re);
  if (!m) return [];
  try { return eval(m[1]); } catch { return []; }
}

// Google Places: Text Search to find a place
async function findPlace(name, address) {
  const query = `${name} ${address}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) return null;
  return data.results[0];
}

// Google Places: Get photo URL from photo reference
function getPhotoUrl(photoReference, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${API_KEY}`;
}

// Rate limiter — stay under Google's QPS limits
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const allCities = detectCities(html);
  console.log(`\n  Found ${allCities.length} cities in index.html`);

  // Filter to requested city or all
  const targetCities = cityFlag
    ? allCities.filter(c => c.toLowerCase().includes(cityFlag.toLowerCase()))
    : allCities;

  if (!targetCities.length) {
    console.error(`  No city matching "${cityFlag}" found. Available: ${allCities.join(', ')}`);
    process.exit(1);
  }

  console.log(`  Processing: ${targetCities.join(', ')}`);
  console.log(`  Limit: ${limitFlag} restaurants`);
  console.log(`  Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE (will update index.html)'}\n`);

  let processed = 0;
  let found = 0;
  let skipped = 0;
  const updates = []; // {id, name, photoUrl}

  for (const cityKey of targetCities) {
    const restaurants = extractData(html, cityKey);
    console.log(`  ${cityKey}: ${restaurants.length} restaurants`);

    for (const r of restaurants) {
      if (processed >= limitFlag) break;

      // Skip if already has a photo
      if (r.photoUrl) {
        skipped++;
        continue;
      }

      // Skip non-restaurant entries (activities, attractions)
      if ((r.indicators || []).includes('activity') || (r.indicators || []).includes('attraction')) {
        skipped++;
        continue;
      }

      console.log(`    [${processed + 1}/${limitFlag}] ${r.name} — ${r.address || r.neighborhood}...`);

      try {
        const place = await findPlace(r.name, r.address || `${r.neighborhood}, ${cityFlag || 'Dallas'}`);

        if (place && place.photos && place.photos.length > 0) {
          const photoUrl = getPhotoUrl(place.photos[0].photo_reference);
          updates.push({ id: r.id, name: r.name, photoUrl, cityKey });
          found++;
          console.log(`      ✓ Photo found`);
        } else {
          console.log(`      ✗ No photos available`);
        }
      } catch (err) {
        console.log(`      ✗ Error: ${err.message}`);
      }

      processed++;
      await sleep(200); // Rate limit: 5 requests/sec
    }
    if (processed >= limitFlag) break;
  }

  console.log(`\n  Results: ${found} photos found, ${processed} looked up, ${skipped} skipped`);

  if (dryRun) {
    console.log('\n  DRY RUN — no files modified. Remove --dry-run to apply.\n');
    if (updates.length) {
      console.log('  Would update:');
      updates.forEach(u => console.log(`    - ${u.name}: ${u.photoUrl.slice(0, 80)}...`));
    }
    return;
  }

  if (!updates.length) {
    console.log('  No updates to apply.\n');
    return;
  }

  // Write photoUrl into each restaurant entry in index.html
  console.log(`\n  Writing ${updates.length} photo URLs to index.html...`);

  for (const u of updates) {
    // Find the restaurant entry by id and inject photoUrl
    // Match pattern: id:123, or id: 123, followed by restaurant fields
    const idPattern = new RegExp(`(id:\\s*${u.id},\\s*name:"[^"]*")`);
    const match = html.match(idPattern);
    if (match) {
      // Add photoUrl after the website field if it exists, otherwise after instagram
      const websitePattern = new RegExp(`(id:\\s*${u.id},[\\s\\S]*?)(,\\s*res_tier:\\s*\\d+)`);
      const wm = html.match(websitePattern);
      if (wm) {
        html = html.replace(
          wm[0],
          `${wm[1]},photoUrl:"${u.photoUrl}"${wm[2]}`
        );
        console.log(`    ✓ ${u.name}`);
      }
    }
  }

  fs.writeFileSync(htmlPath, html);
  console.log(`\n  Done! ${updates.length} restaurants updated with photos.\n`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
