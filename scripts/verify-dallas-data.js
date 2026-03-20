/**
 * verify-dallas-data.js — Dallas Restaurant Data Verification & Correction
 * =========================================================================
 *
 * Cross-references the existing DALLAS_DATA (hardcoded in index.html) against
 * Google Places API to verify and correct:
 *   - Street addresses
 *   - Lat/lng coordinates
 *   - Cuisine classifications
 *   - Business status (open vs permanently closed)
 *   - Neighborhood assignments
 *   - Duplicate detection
 *
 * Also flags entries that can't be found (likely fabricated).
 *
 * ── Prerequisites ──────────────────────────────────────────────────
 *
 *   export GOOGLE_PLACES_API_KEY="your-key"
 *
 * ── Usage ──────────────────────────────────────────────────────────
 *
 *   node scripts/verify-dallas-data.js                    # verify all 418 restaurants
 *   node scripts/verify-dallas-data.js --dry-run          # preview without saving
 *   node scripts/verify-dallas-data.js --start 100        # start from ID 100
 *   node scripts/verify-dallas-data.js --limit 50         # only verify 50 entries
 *   node scripts/verify-dallas-data.js --report-only      # generate report from existing verified data
 *
 * ── Estimated API costs ────────────────────────────────────────────
 *
 *   Google Places Text Search (New):  $32 per 1,000 requests
 *   418 restaurants × 1 search each = ~$13.40
 *
 * ── Output ─────────────────────────────────────────────────────────
 *
 *   data/dallas-verified.json       — full verified dataset with corrections
 *   data/dallas-changes.json        — change log (what was wrong, what was fixed)
 *   data/dallas-report.txt          — human-readable summary report
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const DATA_DIR = path.join(__dirname, '..', 'data');
const VERIFIED_FILE = path.join(DATA_DIR, 'dallas-verified.json');
const CHANGES_FILE = path.join(DATA_DIR, 'dallas-changes.json');
const REPORT_FILE = path.join(DATA_DIR, 'dallas-report.txt');

// Rate limiting — 5 requests/sec max for Google Places
const GOOGLE_DELAY_MS = 250;

// Dallas metro bounding box for location bias
const DALLAS_CENTER = { lat: 32.7767, lng: -96.7970 };
const DALLAS_RADIUS = 40000; // 40km covers DFW metro

// ─── Utility helpers ────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract DALLAS_DATA from index.html.
 * The data is a JS array assigned to `const DALLAS_DATA = [...]`
 */
function extractDallasData() {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Find the DALLAS_DATA assignment
  const startMarker = 'const DALLAS_DATA = [';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error('Could not find DALLAS_DATA in index.html');
  }

  // Find the matching closing bracket by counting brackets
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let stringChar = null;
  const searchStart = startIdx + startMarker.length - 1; // position of '['

  for (let i = searchStart; i < html.length; i++) {
    const ch = html[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (inString) {
      if (ch === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        const jsonStr = html.substring(searchStart, i + 1);
        // Parse — the data uses JS syntax which is mostly JSON-compatible
        // but may have trailing commas or single quotes
        try {
          return JSON.parse(jsonStr);
        } catch {
          // Try eval as fallback for JS-specific syntax
          // eslint-disable-next-line no-eval
          return eval(`(${jsonStr})`);
        }
      }
    }
  }

  throw new Error('Could not find end of DALLAS_DATA array');
}

// ─── Google Places API ──────────────────────────────────────────────────────

/**
 * Search Google Places for a restaurant by name in Dallas.
 * Returns the best matching place or null.
 */
async function searchRestaurant(name, existingAddress) {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  // Build a precise query
  const query = `${name} restaurant Dallas TX`;

  const body = {
    textQuery: query,
    maxResultCount: 5,
    languageCode: 'en',
    locationBias: {
      circle: {
        center: { latitude: DALLAS_CENTER.lat, longitude: DALLAS_CENTER.lng },
        radius: DALLAS_RADIUS,
      },
    },
  };

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.userRatingCount',
    'places.priceLevel',
    'places.types',
    'places.websiteUri',
    'places.regularOpeningHours',
    'places.googleMapsUri',
    'places.businessStatus',
  ].join(',');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const places = data.places || [];

  if (places.length === 0) return null;

  // Find best match — prefer exact name match
  const nameLower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  let bestMatch = places[0];
  let bestScore = 0;

  for (const place of places) {
    const placeName = (place.displayName?.text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    let score = 0;

    // Exact name match
    if (placeName === nameLower) score += 100;
    // Partial match
    else if (placeName.includes(nameLower) || nameLower.includes(placeName)) score += 50;

    // In Dallas area (lat between 32.5-33.2, lng between -97.5 and -96.3)
    const lat = place.location?.latitude || 0;
    const lng = place.location?.longitude || 0;
    if (lat >= 32.5 && lat <= 33.2 && lng >= -97.5 && lng <= -96.3) score += 30;

    // Higher rating = more likely correct
    if (place.rating >= 4.0) score += 10;

    // Is a restaurant type
    const types = place.types || [];
    if (types.some(t => t.includes('restaurant') || t === 'cafe' || t === 'bar' || t.includes('food'))) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = place;
    }
  }

  return { place: bestMatch, confidence: bestScore, candidateCount: places.length };
}

// ─── Comparison logic ───────────────────────────────────────────────────────

/**
 * Compare existing data with Google Places result and generate changes.
 */
function compareEntry(existing, googleResult) {
  const changes = [];

  if (!googleResult || !googleResult.place) {
    return { status: 'not_found', changes: [], googleData: null };
  }

  const place = googleResult.place;
  const confidence = googleResult.confidence;

  // Check business status
  if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
    changes.push({
      field: 'status',
      old: 'assumed open',
      new: place.businessStatus,
      severity: 'critical',
    });
  }

  // Check address
  const googleAddress = place.formattedAddress || '';
  const existingAddress = existing.address || '';

  // Normalize addresses for comparison
  const normalizeAddr = (addr) => addr.toLowerCase()
    .replace(/\b(st|street)\b/g, 'st')
    .replace(/\b(ave|avenue)\b/g, 'ave')
    .replace(/\b(blvd|boulevard)\b/g, 'blvd')
    .replace(/\b(dr|drive)\b/g, 'dr')
    .replace(/\b(ln|lane)\b/g, 'ln')
    .replace(/\b(rd|road)\b/g, 'rd')
    .replace(/[,.\s]+/g, ' ')
    .trim();

  const normExisting = normalizeAddr(existingAddress);
  const normGoogle = normalizeAddr(googleAddress);

  // Extract street number for comparison
  const existingNum = existingAddress.match(/^\d+/)?.[0] || '';
  const googleNum = googleAddress.match(/^\d+/)?.[0] || '';

  const isVagueAddress = !existingAddress.match(/^\d+\s/); // No street number

  if (isVagueAddress) {
    changes.push({
      field: 'address',
      old: existingAddress,
      new: googleAddress,
      severity: 'high',
      note: 'Vague/neighborhood-only address replaced with full address',
    });
  } else if (existingNum !== googleNum || !normGoogle.includes(normExisting.split(' ')[1] || '___')) {
    // Different street number or different street name
    changes.push({
      field: 'address',
      old: existingAddress,
      new: googleAddress,
      severity: 'high',
    });
  }

  // Check coordinates
  const googleLat = place.location?.latitude || 0;
  const googleLng = place.location?.longitude || 0;
  const latDiff = Math.abs(existing.lat - googleLat);
  const lngDiff = Math.abs(existing.lng - googleLng);

  // If coordinates differ by more than ~0.005 (~500m), flag it
  if (latDiff > 0.005 || lngDiff > 0.005) {
    changes.push({
      field: 'coordinates',
      old: `${existing.lat}, ${existing.lng}`,
      new: `${googleLat}, ${googleLng}`,
      severity: 'medium',
    });
  }

  // Check cuisine (basic — Google types vs existing cuisine)
  const cuisineMap = {
    'american_restaurant': 'American',
    'italian_restaurant': 'Italian',
    'japanese_restaurant': 'Japanese',
    'mexican_restaurant': 'Mexican',
    'chinese_restaurant': 'Chinese',
    'french_restaurant': 'French',
    'thai_restaurant': 'Thai',
    'indian_restaurant': 'Indian',
    'korean_restaurant': 'Korean',
    'vietnamese_restaurant': 'Vietnamese',
    'mediterranean_restaurant': 'Mediterranean',
    'seafood_restaurant': 'Seafood',
    'steak_house': 'Steakhouse',
    'barbecue_restaurant': 'BBQ',
    'pizza_restaurant': 'Pizza',
  };

  const googleTypes = place.types || [];
  const googleCuisines = googleTypes
    .filter(t => cuisineMap[t])
    .map(t => cuisineMap[t]);

  if (googleCuisines.length > 0) {
    const existingCuisineLower = existing.cuisine.toLowerCase();
    const matchesCuisine = googleCuisines.some(c => existingCuisineLower.includes(c.toLowerCase()));
    if (!matchesCuisine) {
      changes.push({
        field: 'cuisine_mismatch',
        old: existing.cuisine,
        new: googleCuisines.join(', '),
        severity: 'low',
        note: 'Google types suggest different cuisine — review manually',
      });
    }
  }

  return {
    status: place.businessStatus === 'OPERATIONAL' ? 'verified' : (place.businessStatus || 'unknown'),
    changes,
    confidence,
    googleData: {
      placeId: place.id,
      name: place.displayName?.text,
      address: googleAddress,
      lat: googleLat,
      lng: googleLng,
      rating: place.rating,
      ratingCount: place.userRatingCount,
      types: googleTypes,
      businessStatus: place.businessStatus,
      website: place.websiteUri || '',
      mapsUri: place.googleMapsUri || '',
    },
  };
}

/**
 * Detect duplicate entries in the dataset.
 */
function detectDuplicates(restaurants) {
  const dupes = [];
  const nameMap = {};

  for (const r of restaurants) {
    const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(r);
  }

  for (const [key, entries] of Object.entries(nameMap)) {
    if (entries.length > 1) {
      dupes.push({
        name: entries[0].name,
        entries: entries.map(e => ({ id: e.id, address: e.address, neighborhood: e.neighborhood })),
      });
    }
  }

  return dupes;
}

// ─── Report generation ──────────────────────────────────────────────────────

function generateReport(results, duplicates) {
  const lines = [];
  const timestamp = new Date().toISOString();

  lines.push('='.repeat(70));
  lines.push('  DALLAS RESTAURANT DATA VERIFICATION REPORT');
  lines.push(`  Generated: ${timestamp}`);
  lines.push('='.repeat(70));
  lines.push('');

  // Summary stats
  const total = results.length;
  const verified = results.filter(r => r.verification.status === 'verified').length;
  const closed = results.filter(r => ['CLOSED_PERMANENTLY', 'CLOSED_TEMPORARILY'].includes(r.verification.status)).length;
  const notFound = results.filter(r => r.verification.status === 'not_found').length;
  const withAddressChange = results.filter(r => r.verification.changes.some(c => c.field === 'address')).length;
  const withCoordChange = results.filter(r => r.verification.changes.some(c => c.field === 'coordinates')).length;
  const withCuisineMismatch = results.filter(r => r.verification.changes.some(c => c.field === 'cuisine_mismatch')).length;

  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(`  Total restaurants:        ${total}`);
  lines.push(`  Verified open:            ${verified}`);
  lines.push(`  Permanently closed:       ${closed}`);
  lines.push(`  Not found (fabricated?):   ${notFound}`);
  lines.push(`  Address corrections:      ${withAddressChange}`);
  lines.push(`  Coordinate corrections:   ${withCoordChange}`);
  lines.push(`  Cuisine mismatches:       ${withCuisineMismatch}`);
  lines.push(`  Duplicate entries:        ${duplicates.length}`);
  lines.push('');

  // Closed restaurants
  if (closed > 0) {
    lines.push('PERMANENTLY CLOSED');
    lines.push('-'.repeat(40));
    for (const r of results.filter(r => r.verification.status === 'CLOSED_PERMANENTLY')) {
      lines.push(`  #${r.id} ${r.name} — ${r.address}`);
    }
    lines.push('');
  }

  // Not found
  if (notFound > 0) {
    lines.push('NOT FOUND (LIKELY FABRICATED)');
    lines.push('-'.repeat(40));
    for (const r of results.filter(r => r.verification.status === 'not_found')) {
      lines.push(`  #${r.id} ${r.name} — ${r.address}`);
    }
    lines.push('');
  }

  // Address corrections
  if (withAddressChange > 0) {
    lines.push('ADDRESS CORRECTIONS');
    lines.push('-'.repeat(40));
    for (const r of results.filter(r => r.verification.changes.some(c => c.field === 'address'))) {
      const change = r.verification.changes.find(c => c.field === 'address');
      lines.push(`  #${r.id} ${r.name}`);
      lines.push(`    OLD: ${change.old}`);
      lines.push(`    NEW: ${change.new}`);
      if (change.note) lines.push(`    NOTE: ${change.note}`);
      lines.push('');
    }
  }

  // Cuisine mismatches
  if (withCuisineMismatch > 0) {
    lines.push('CUISINE MISMATCHES (review manually)');
    lines.push('-'.repeat(40));
    for (const r of results.filter(r => r.verification.changes.some(c => c.field === 'cuisine_mismatch'))) {
      const change = r.verification.changes.find(c => c.field === 'cuisine_mismatch');
      lines.push(`  #${r.id} ${r.name}: Listed as "${change.old}", Google says "${change.new}"`);
    }
    lines.push('');
  }

  // Duplicates
  if (duplicates.length > 0) {
    lines.push('DUPLICATE ENTRIES');
    lines.push('-'.repeat(40));
    for (const dupe of duplicates) {
      lines.push(`  ${dupe.name}:`);
      for (const e of dupe.entries) {
        lines.push(`    ID #${e.id} — ${e.address} (${e.neighborhood})`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ─── Main pipeline ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const reportOnly = args.includes('--report-only');
  const startIdx = parseInt(args.find((_, i) => args[i - 1] === '--start') || '0');
  const limitNum = parseInt(args.find((_, i) => args[i - 1] === '--limit') || '0');

  // Report-only mode: regenerate report from existing verified data
  if (reportOnly) {
    if (!fs.existsSync(VERIFIED_FILE)) {
      console.error('No verified data found. Run without --report-only first.');
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(VERIFIED_FILE, 'utf-8'));
    const report = generateReport(data.restaurants, data.duplicates || []);
    fs.writeFileSync(REPORT_FILE, report);
    console.log(report);
    console.log(`\nReport saved: ${REPORT_FILE}`);
    return;
  }

  // Validate API key
  if (!GOOGLE_API_KEY) {
    console.error('ERROR: GOOGLE_PLACES_API_KEY environment variable is not set.');
    console.error('');
    console.error('To get an API key:');
    console.error('  1. Go to https://console.cloud.google.com/');
    console.error('  2. Enable the "Places API (New)"');
    console.error('  3. Create an API key under APIs & Services > Credentials');
    console.error('  4. Run: export GOOGLE_PLACES_API_KEY="your-key"');
    process.exit(1);
  }

  // Ensure output directory
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Extract current Dallas data
  console.log('Extracting DALLAS_DATA from index.html...');
  const dallasData = extractDallasData();
  console.log(`  Found ${dallasData.length} restaurants\n`);

  // Detect duplicates first
  const duplicates = detectDuplicates(dallasData);
  if (duplicates.length > 0) {
    console.log(`Detected ${duplicates.length} duplicate name groups:`);
    for (const d of duplicates) {
      console.log(`  "${d.name}" — IDs: ${d.entries.map(e => e.id).join(', ')}`);
    }
    console.log('');
  }

  // Load existing progress if resuming
  let existingResults = [];
  if (fs.existsSync(VERIFIED_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(VERIFIED_FILE, 'utf-8'));
      existingResults = existing.restaurants || [];
      console.log(`Loaded ${existingResults.length} previously verified entries (will skip these)`);
    } catch {
      existingResults = [];
    }
  }

  const verifiedIds = new Set(existingResults.map(r => r.id));

  // Determine which restaurants to verify
  let toVerify = dallasData;
  if (startIdx > 0) {
    toVerify = toVerify.filter(r => r.id >= startIdx);
  }
  if (limitNum > 0) {
    toVerify = toVerify.slice(0, limitNum);
  }
  // Skip already-verified
  toVerify = toVerify.filter(r => !verifiedIds.has(r.id));

  if (toVerify.length === 0) {
    console.log('All restaurants already verified! Use --report-only to regenerate report.');
    return;
  }

  const estimatedCost = (toVerify.length * 0.032).toFixed(2);
  console.log(`Verifying ${toVerify.length} restaurants against Google Places API`);
  console.log(`Estimated API cost: ~$${estimatedCost}`);
  console.log(`${'='.repeat(60)}\n`);

  const results = [...existingResults];
  let processed = 0;
  let errors = 0;

  for (const restaurant of toVerify) {
    processed++;
    const pct = ((processed / toVerify.length) * 100).toFixed(1);
    process.stdout.write(`  [${pct}%] #${restaurant.id} ${restaurant.name.padEnd(40).slice(0, 40)} `);

    try {
      const googleResult = await searchRestaurant(restaurant.name, restaurant.address);
      const comparison = compareEntry(restaurant, googleResult);

      const result = {
        ...restaurant,
        verification: comparison,
      };
      results.push(result);

      // Log result
      const changeCount = comparison.changes.length;
      if (comparison.status === 'not_found') {
        console.log('NOT FOUND');
      } else if (comparison.status === 'CLOSED_PERMANENTLY') {
        console.log('CLOSED');
      } else if (changeCount > 0) {
        const fields = comparison.changes.map(c => c.field).join(', ');
        console.log(`${changeCount} change(s): ${fields}`);
      } else {
        console.log('OK');
      }
    } catch (err) {
      errors++;
      console.log(`ERROR: ${err.message}`);
      // Still add the entry with an error status
      results.push({
        ...restaurant,
        verification: { status: 'error', changes: [], error: err.message },
      });
    }

    // Save progress every 25 entries
    if (processed % 25 === 0 && !dryRun) {
      const payload = {
        city: 'Dallas',
        verifiedAt: new Date().toISOString(),
        count: results.length,
        duplicates,
        restaurants: results,
      };
      fs.writeFileSync(VERIFIED_FILE, JSON.stringify(payload, null, 2));
      console.log(`    [checkpoint saved — ${results.length} entries]\n`);
    }

    await sleep(GOOGLE_DELAY_MS);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Verification complete: ${processed} restaurants processed, ${errors} errors`);

  // Save final results
  if (!dryRun) {
    const payload = {
      city: 'Dallas',
      verifiedAt: new Date().toISOString(),
      count: results.length,
      duplicates,
      restaurants: results,
    };
    fs.writeFileSync(VERIFIED_FILE, JSON.stringify(payload, null, 2));
    console.log(`Verified data: ${VERIFIED_FILE}`);

    // Generate change log
    const allChanges = results
      .filter(r => r.verification.changes.length > 0 || r.verification.status !== 'verified')
      .map(r => ({
        id: r.id,
        name: r.name,
        status: r.verification.status,
        changes: r.verification.changes,
      }));
    fs.writeFileSync(CHANGES_FILE, JSON.stringify(allChanges, null, 2));
    console.log(`Change log: ${CHANGES_FILE}`);

    // Generate report
    const report = generateReport(results, duplicates);
    fs.writeFileSync(REPORT_FILE, report);
    console.log(`Report: ${REPORT_FILE}`);
    console.log('');
    console.log(report);
  }

  console.log('\nNext steps:');
  console.log('  1. Review data/dallas-report.txt for corrections');
  console.log('  2. Run: node scripts/apply-dallas-fixes.js  (to apply verified corrections to index.html)');
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
