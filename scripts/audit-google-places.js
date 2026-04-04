#!/usr/bin/env node
/**
 * Appetyt Google Places Auditor
 *
 * Verifies restaurant data against Google Places API.
 * Checks: address, phone, hours, website, lat/lng, open/closed status.
 *
 * Setup:
 *   1. Get a Google Places API key: https://console.cloud.google.com/apis/credentials
 *   2. Enable "Places API (New)" in your Google Cloud project
 *   3. Run: GOOGLE_PLACES_KEY=your_key node scripts/audit-google-places.js
 *
 * Options:
 *   --city=Dallas        City to audit (default: Dallas)
 *   --limit=50           Max restaurants to check (default: all)
 *   --offset=0           Skip first N restaurants
 *   --fix                Auto-fix mismatches in index.html
 *   --dry-run            Show what would change without writing (default)
 *   --report-only        Only generate the report JSON, skip fixes
 *
 * Output: scripts/audit-report-google-{city}.json
 */

const fs = require('fs');
const path = require('path');

// --- Config ---
const API_KEY = process.env.GOOGLE_PLACES_KEY;
if (!API_KEY) {
  console.error('ERROR: Set GOOGLE_PLACES_KEY environment variable.');
  console.error('Get one at: https://console.cloud.google.com/apis/credentials');
  console.error('Enable "Places API (New)" in your project.');
  console.error('\nUsage: GOOGLE_PLACES_KEY=your_key node scripts/audit-google-places.js');
  process.exit(1);
}

const args = process.argv.slice(2).reduce((o, a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  o[k] = v || true;
  return o;
}, {});

const CITY = args.city || 'Dallas';
const LIMIT = args.limit ? parseInt(args.limit) : Infinity;
const OFFSET = args.offset ? parseInt(args.offset) : 0;
const AUTO_FIX = args.fix === true;
const REPORT_ONLY = args['report-only'] === true;

// --- Load restaurant data ---
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Extract city data
const cityKey = CITY.toUpperCase() + '_DATA';
let restaurants;

// Find the array using bracket matching (most reliable for large inline arrays)
const startIdx = html.indexOf('const ' + cityKey + '=');
const altStart = html.indexOf('const ' + cityKey + ' =');
const idx = startIdx > -1 ? startIdx : altStart;
if (idx === -1) {
  console.error(`Could not find ${cityKey} in index.html`);
  process.exit(1);
}
const arrStart = html.indexOf('[', idx);
let depth = 0, arrEnd = arrStart;
for (let i = arrStart; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i + 1; break; } }
}
const arrStr = html.substring(arrStart, arrEnd);
try {
  restaurants = JSON.parse(arrStr);
} catch(e) {
  try { restaurants = eval(arrStr); }
  catch(e2) { console.error(`Could not parse ${cityKey}:`, e2.message); process.exit(1); }
}

const subset = restaurants.slice(OFFSET, OFFSET + LIMIT);
console.log(`\nAuditing ${subset.length} of ${restaurants.length} restaurants in ${CITY}`);
console.log(`Using Google Places API (New)\n`);

// --- Google Places API helpers ---
const PLACES_BASE = 'https://places.googleapis.com/v1/places';

async function searchPlace(name, address, city) {
  const query = `${name} ${city}`;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.businessStatus,places.regularOpeningHours,places.types,places.primaryType'
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: {
          center: { latitude: 32.78, longitude: -96.80 }, // Dallas center
          radius: 50000 // 50km covers DFW
        }
      },
      maxResultCount: 3
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Places API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.places || [];
}

function bestMatch(places, restaurantName) {
  if (!places.length) return null;

  // Score each result by name similarity
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = normalize(restaurantName);

  let best = places[0];
  let bestScore = 0;

  places.forEach(p => {
    const pName = normalize(p.displayName?.text || '');
    // Simple overlap score
    let score = 0;
    if (pName === target) score = 100;
    else if (pName.includes(target) || target.includes(pName)) score = 80;
    else {
      // Word overlap
      const tWords = target.match(/.{2,}/g) || [];
      const pWords = pName.match(/.{2,}/g) || [];
      score = tWords.filter(w => pName.includes(w)).length / Math.max(tWords.length, 1) * 60;
    }

    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  });

  return bestScore >= 20 ? best : null;
}

// --- Compare data ---
function compareData(ours, google) {
  const diffs = [];

  // Address
  if (google.formattedAddress) {
    const gAddr = google.formattedAddress.replace(/, USA$/, '');
    const oAddr = ours.address || '';
    // Normalize for comparison
    const normG = gAddr.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normO = oAddr.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normG !== normO && oAddr && !oAddr.includes('Multiple')) {
      diffs.push({
        field: 'address',
        ours: oAddr,
        google: gAddr,
        confidence: normO.includes(normG.slice(0, 15)) ? 'low' : 'high'
      });
    }
    if (!oAddr || /^(Uptown|Downtown|Deep Ellum|Design District|Preston Center|Oak Cliff|Bishop Arts|Knox|Multiple|Various)/i.test(oAddr)) {
      diffs.push({
        field: 'address',
        ours: oAddr || '(empty)',
        google: gAddr,
        confidence: 'high'
      });
    }
  }

  // Phone
  if (google.nationalPhoneNumber) {
    const gPhone = google.nationalPhoneNumber.replace(/\D/g, '');
    const oPhone = (ours.phone || '').replace(/\D/g, '');
    if (gPhone && oPhone && gPhone !== oPhone) {
      diffs.push({ field: 'phone', ours: ours.phone, google: google.nationalPhoneNumber, confidence: 'high' });
    }
    if (!oPhone && gPhone) {
      diffs.push({ field: 'phone', ours: '(missing)', google: google.nationalPhoneNumber, confidence: 'high' });
    }
  }

  // Website
  if (google.websiteUri) {
    const gWeb = google.websiteUri.replace(/\/$/, '').toLowerCase();
    const oWeb = (ours.website || '').replace(/\/$/, '').toLowerCase();
    if (!oWeb && gWeb) {
      diffs.push({ field: 'website', ours: '(missing)', google: google.websiteUri, confidence: 'medium' });
    }
  }

  // Coordinates
  if (google.location) {
    const gLat = google.location.latitude;
    const gLng = google.location.longitude;
    const oLat = ours.lat;
    const oLng = ours.lng;
    // Flag if more than ~200m off
    if (oLat && oLng) {
      const dist = Math.sqrt(Math.pow(gLat - oLat, 2) + Math.pow(gLng - oLng, 2));
      if (dist > 0.002) { // ~200m
        diffs.push({
          field: 'coordinates',
          ours: `${oLat}, ${oLng}`,
          google: `${gLat}, ${gLng}`,
          distance_deg: dist.toFixed(4),
          confidence: 'high'
        });
      }
    }
  }

  // Business status (closed?)
  if (google.businessStatus && google.businessStatus !== 'OPERATIONAL') {
    diffs.push({
      field: 'status',
      ours: 'listed as open',
      google: google.businessStatus,
      confidence: 'critical'
    });
  }

  // Hours
  if (google.regularOpeningHours?.weekdayDescriptions && !ours.hours) {
    const gHours = google.regularOpeningHours.weekdayDescriptions.join('; ');
    diffs.push({ field: 'hours', ours: '(missing)', google: gHours, confidence: 'medium' });
  }

  return diffs;
}

// --- Main ---
async function run() {
  const report = {
    city: CITY,
    audited: 0,
    apiErrors: 0,
    noMatch: [],
    closedOrMoved: [],
    addressMismatch: [],
    phoneMismatch: [],
    missingPhone: [],
    coordsMismatch: [],
    missingWebsite: [],
    missingHours: [],
    allDiffs: []
  };

  const BATCH_SIZE = 5;
  const DELAY_MS = 200; // Stay well under rate limits

  for (let i = 0; i < subset.length; i += BATCH_SIZE) {
    const batch = subset.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(batch.map(async (r) => {
      try {
        await new Promise(res => setTimeout(res, DELAY_MS * (batch.indexOf(r))));
        const places = await searchPlace(r.name, r.address, CITY);
        const match = bestMatch(places, r.name);

        if (!match) {
          return { restaurant: r, match: null, diffs: [] };
        }

        const diffs = compareData(r, match);
        return { restaurant: r, match, diffs };
      } catch (e) {
        report.apiErrors++;
        return { restaurant: r, error: e.message, diffs: [] };
      }
    }));

    results.forEach(({ restaurant: r, match, diffs, error }) => {
      report.audited++;

      if (error) {
        process.stdout.write('E');
        return;
      }

      if (!match) {
        report.noMatch.push({ id: r.id, name: r.name });
        process.stdout.write('?');
        return;
      }

      if (diffs.length === 0) {
        process.stdout.write('.');
        return;
      }

      process.stdout.write('X');

      const entry = {
        id: r.id,
        name: r.name,
        googleName: match.displayName?.text,
        diffs
      };
      report.allDiffs.push(entry);

      diffs.forEach(d => {
        if (d.field === 'status') report.closedOrMoved.push(entry);
        if (d.field === 'address') report.addressMismatch.push(entry);
        if (d.field === 'phone' && d.ours === '(missing)') report.missingPhone.push(entry);
        else if (d.field === 'phone') report.phoneMismatch.push(entry);
        if (d.field === 'coordinates') report.coordsMismatch.push(entry);
        if (d.field === 'website') report.missingWebsite.push(entry);
        if (d.field === 'hours') report.missingHours.push(entry);
      });
    });

    process.stdout.write(` [${Math.min(i + BATCH_SIZE, subset.length)}/${subset.length}]\n`);
  }

  // --- Summary ---
  console.log('\n\n=== GOOGLE PLACES AUDIT SUMMARY ===');
  console.log(`City: ${CITY}`);
  console.log(`Restaurants audited: ${report.audited}`);
  console.log(`API errors: ${report.apiErrors}`);
  console.log(`No Google match found: ${report.noMatch.length}`);
  console.log(`\nISSUES FOUND:`);
  console.log(`  Closed/Moved: ${report.closedOrMoved.length}`);
  console.log(`  Address mismatch: ${report.addressMismatch.length}`);
  console.log(`  Phone mismatch: ${report.phoneMismatch.length}`);
  console.log(`  Missing phone: ${report.missingPhone.length}`);
  console.log(`  Coordinates off: ${report.coordsMismatch.length}`);
  console.log(`  Missing website: ${report.missingWebsite.length}`);
  console.log(`  Missing hours: ${report.missingHours.length}`);

  // Show critical issues
  if (report.closedOrMoved.length) {
    console.log('\n--- CLOSED OR MOVED (CRITICAL) ---');
    report.closedOrMoved.forEach(e => {
      const d = e.diffs.find(d => d.field === 'status');
      console.log(`  ${e.name} (ID ${e.id}): ${d.google}`);
    });
  }

  if (report.addressMismatch.length) {
    console.log(`\n--- ADDRESS MISMATCHES (${report.addressMismatch.length}) ---`);
    report.addressMismatch.slice(0, 20).forEach(e => {
      const d = e.diffs.find(d => d.field === 'address');
      console.log(`  ${e.name} (ID ${e.id}):`);
      console.log(`    Ours:   ${d.ours}`);
      console.log(`    Google: ${d.google}`);
    });
    if (report.addressMismatch.length > 20) console.log(`  ... and ${report.addressMismatch.length - 20} more`);
  }

  if (report.coordsMismatch.length) {
    console.log(`\n--- COORDINATES OFF (${report.coordsMismatch.length}) ---`);
    report.coordsMismatch.slice(0, 10).forEach(e => {
      const d = e.diffs.find(d => d.field === 'coordinates');
      console.log(`  ${e.name} (ID ${e.id}): ours=${d.ours} → google=${d.google} (${d.distance_deg}°)`);
    });
  }

  // --- Save report ---
  const reportPath = path.join(__dirname, `audit-report-google-${CITY.toLowerCase()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report: ${reportPath}`);

  // --- Auto-fix ---
  if (AUTO_FIX && !REPORT_ONLY) {
    console.log('\n--- AUTO-FIXING ---');
    let fixCount = 0;
    let fixHtml = fs.readFileSync(indexPath, 'utf8');

    report.allDiffs.forEach(entry => {
      entry.diffs.forEach(d => {
        if (d.confidence !== 'high' && d.confidence !== 'critical') return;
        if (d.field === 'status') return; // Don't auto-remove restaurants

        const r = restaurants.find(x => x.id === entry.id);
        if (!r) return;

        if (d.field === 'address' && d.google) {
          const oldVal = JSON.stringify(r.address);
          const newVal = JSON.stringify(d.google);
          const pattern = `"id":${r.id},` + fixHtml.match(new RegExp(`"id":${r.id},[^}]*"address":${oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))?.[0];
          if (pattern) {
            fixHtml = fixHtml.replace(pattern, pattern.replace(`"address":${oldVal}`, `"address":${newVal}`));
            fixCount++;
          }
        }

        if (d.field === 'phone' && d.google) {
          if (d.ours === '(missing)') {
            // Add phone field — insert after address
            const addrStr = JSON.stringify(r.address);
            const insertAfter = `"address":${addrStr}`;
            const insertWith = `"address":${addrStr},"phone":"${d.google}"`;
            if (!r.phone && fixHtml.includes(insertAfter)) {
              fixHtml = fixHtml.replace(insertAfter, insertWith);
              fixCount++;
            }
          }
        }

        if (d.field === 'coordinates' && d.google) {
          const [gLat, gLng] = d.google.split(', ').map(Number);
          const oldCoords = `"lat":${r.lat},"lng":${r.lng}`;
          const newCoords = `"lat":${gLat},"lng":${gLng}`;
          if (fixHtml.includes(oldCoords)) {
            fixHtml = fixHtml.replace(oldCoords, newCoords);
            fixCount++;
          }
        }
      });
    });

    if (fixCount > 0) {
      fs.writeFileSync(indexPath, fixHtml);
      // Sync copy
      fs.writeFileSync(path.join(__dirname, '..', 'index'), fixHtml);
      console.log(`Applied ${fixCount} fixes to index.html (+ synced copies)`);
    } else {
      console.log('No high-confidence fixes to apply.');
    }
  }

  // --- Instructions for next city ---
  if (report.audited === subset.length) {
    console.log(`\n--- TO AUDIT ANOTHER CITY ---`);
    console.log(`GOOGLE_PLACES_KEY=${API_KEY.slice(0, 5)}... node scripts/audit-google-places.js --city=Austin`);
    console.log(`GOOGLE_PLACES_KEY=${API_KEY.slice(0, 5)}... node scripts/audit-google-places.js --city=NYC --limit=50`);
  }
}

run().catch(e => { console.error('\nFatal:', e.message); process.exit(1); });
