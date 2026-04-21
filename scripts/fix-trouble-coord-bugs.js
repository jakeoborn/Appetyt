#!/usr/bin/env node
// Re-geocode the ~58 coord_bugs cards flagged by the 2026-04-20 neighborhood
// audit via Nominatim and apply the fix to index.html.
//
// Strategy per card:
//   1. Find the card inside its city's *_DATA = [...] range (brace-depth walk).
//   2. Extract the card's stored address (assumed correct per audit notes).
//   3. Query Nominatim with US bias.
//   4. Validate the new coord is inside the city's bbox AND within 30 mi
//      of bbox center. Reject obvious bad matches.
//   5. Replace the exact "lat":X,"lng":Y substring for that card.
//   6. Log per-card result (fixed / skipped / manual review).
//
// Honors Nominatim's 1 req/sec policy (1200ms delay between requests).
// Re-entrant: skips cards whose current coord is already inside the bbox AND
// within 5 mi of a matching address lookup (won't churn already-fixed ones).

const fs = require('fs');
const path = require('path');
const https = require('https');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const REPORT_PATH = path.join(__dirname, 'fix-trouble-coord-bugs-report.json');

// Map city-slug-in-JSON -> { dataVar, bbox [latMin,latMax,lngMin,lngMax], fullName }
const CITIES = {
  austin:   { dataVar: 'AUSTIN_DATA',   bbox: [30.00, 30.70, -98.20, -97.40], name: 'Austin, TX' },
  dallas:   { dataVar: 'DALLAS_DATA',   bbox: [32.40, 33.20, -97.50, -96.40], name: 'Dallas, TX' },
  houston:  { dataVar: 'HOUSTON_DATA',  bbox: [29.40, 30.20, -95.90, -94.90], name: 'Houston, TX' },
  la:       { dataVar: 'LA_DATA',       bbox: [33.50, 34.50, -118.80, -117.50], name: 'Los Angeles, CA' },
  nyc:      { dataVar: 'NYC_DATA',      bbox: [40.40, 41.10, -74.30, -73.60], name: 'New York, NY' },
  phx:      { dataVar: 'PHX_DATA',      bbox: [33.10, 34.10, -112.80, -111.30], name: 'Phoenix, AZ' },
  seattle:  { dataVar: 'SEATTLE_DATA',  bbox: [47.20, 48.00, -122.60, -121.80], name: 'Seattle, WA' },
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function nominatim(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'DimHourCoordFixer/1.0 (contact: jakeoborn@yahoo.com)' },
      timeout: 15000,
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (!Array.isArray(j) || !j.length) return resolve(null);
          resolve({ lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), display: j[0].display_name });
        } catch (e) { resolve(null); }
      });
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

function findDataSlice(html, varName) {
  const decl = varName + ' =';
  let declIdx = html.indexOf(decl);
  if (declIdx < 0) {
    declIdx = html.indexOf(varName + '=');
    if (declIdx < 0) return null;
  }
  const openIdx = html.indexOf('[', declIdx);
  if (openIdx < 0) return null;
  let depth = 0;
  for (let j = openIdx; j < html.length; j++) {
    const c = html[j];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return [openIdx, j]; }
  }
  return null;
}

// Find a card by id inside [sliceStart, sliceEnd). Each card is `{ ... "id": N, ... }`.
// Returns [cardStart, cardEnd] (inclusive of braces).
function findCardById(html, sliceStart, sliceEnd, id) {
  const idPattern = '"id":' + id + ',';
  let idx = html.indexOf(idPattern, sliceStart);
  if (idx < 0 || idx >= sliceEnd) {
    // try with space after colon
    const alt = '"id": ' + id + ',';
    idx = html.indexOf(alt, sliceStart);
    if (idx < 0 || idx >= sliceEnd) return null;
  }
  // Walk backward to find enclosing `{`.
  let depth = 0;
  let start = -1;
  for (let j = idx; j >= sliceStart; j--) {
    const c = html[j];
    if (c === '}') depth++;
    else if (c === '{') {
      if (depth === 0) { start = j; break; }
      depth--;
    }
  }
  if (start < 0) return null;
  // Walk forward from start to find matching `}`.
  depth = 0;
  for (let j = start; j < sliceEnd; j++) {
    const c = html[j];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return [start, j]; }
  }
  return null;
}

function extractField(cardSrc, field) {
  // Field pattern: "field":"value" or "field":value
  const re = new RegExp('"' + field + '":\\s*("((?:[^"\\\\]|\\\\.)*)"|(-?\\d+(?:\\.\\d+)?))');
  const m = cardSrc.match(re);
  if (!m) return null;
  if (m[2] !== undefined) return JSON.parse('"' + m[2] + '"');
  return parseFloat(m[3]);
}

function insideBbox(bbox, lat, lng) {
  return lat >= bbox[0] && lat <= bbox[1] && lng >= bbox[2] && lng <= bbox[3];
}

function haversineMiles(a, b, c, d) {
  const toRad = x => x * Math.PI / 180;
  const R = 3958.7613; // Earth radius in miles
  const dLat = toRad(c - a);
  const dLng = toRad(d - b);
  const h = Math.sin(dLat/2)**2 + Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function main() {
  const cityArg = (() => { const i = process.argv.indexOf('--city'); return i>=0 ? process.argv[i+1] : null; })();
  const dryRun = process.argv.includes('--dry-run');
  const maxArg = (() => { const i = process.argv.indexOf('--max'); return i>=0 ? +process.argv[i+1] : Infinity; })();

  let html = fs.readFileSync(HTML_PATH, 'utf8');
  const report = { fixed: [], skipped: [], no_geocode: [], card_not_found: [] };

  const citiesToProcess = cityArg ? [cityArg] : Object.keys(CITIES);
  let requests = 0;

  for (const citySlug of citiesToProcess) {
    const cfg = CITIES[citySlug];
    if (!cfg) { console.log('SKIP unknown city:', citySlug); continue; }

    const fixesPath = path.join(__dirname, citySlug + '-neighborhood-fixes-applied.json');
    if (!fs.existsSync(fixesPath)) { console.log('SKIP', citySlug, '— no fixes file'); continue; }
    const bugs = (JSON.parse(fs.readFileSync(fixesPath, 'utf8')).coord_bugs) || [];
    if (!bugs.length) { console.log('SKIP', citySlug, '— 0 coord_bugs'); continue; }

    const dataSlice = findDataSlice(html, cfg.dataVar);
    if (!dataSlice) { console.log('ERROR', citySlug, '— data var', cfg.dataVar, 'not found'); continue; }

    console.log(`\n=== ${citySlug} (${bugs.length} bugs) ===`);

    for (const bug of bugs) {
      if (requests >= maxArg) { console.log('  (--max reached)'); break; }

      const card = findCardById(html, dataSlice[0], dataSlice[1], bug.id);
      if (!card) {
        console.log(`  #${bug.id} ${bug.name} — CARD NOT FOUND in ${cfg.dataVar}`);
        report.card_not_found.push({ city: citySlug, id: bug.id, name: bug.name });
        continue;
      }
      const cardSrc = html.slice(card[0], card[1] + 1);
      const address = extractField(cardSrc, 'address');
      const curLat = extractField(cardSrc, 'lat');
      const curLng = extractField(cardSrc, 'lng');
      if (!address) {
        console.log(`  #${bug.id} ${bug.name} — NO ADDRESS`);
        report.skipped.push({ city: citySlug, id: bug.id, name: bug.name, reason: 'no address' });
        continue;
      }
      // Geocode. Try raw address first, then strip suite/unit suffixes, then last resort address-only.
      const cleanAddr = address
        .replace(/\s*(?:Ste|Suite|Unit|#)\s*[\w-]+(?=[,\s])/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      const queries = [`${address}, ${cfg.name}`];
      if (cleanAddr !== address) queries.push(`${cleanAddr}, ${cfg.name}`);
      queries.push(address);
      let hit = null;
      for (const q of queries) {
        await sleep(1200);
        requests++;
        hit = await nominatim(q);
        if (hit && insideBbox(cfg.bbox, hit.lat, hit.lng)) break;
        if (hit && !insideBbox(cfg.bbox, hit.lat, hit.lng)) { hit = null; continue; }
      }
      if (!hit) {
        console.log(`  #${bug.id} ${bug.name} — NOMINATIM MISS for "${address}"`);
        report.no_geocode.push({ city: citySlug, id: bug.id, name: bug.name, address });
        continue;
      }
      if (!insideBbox(cfg.bbox, hit.lat, hit.lng)) {
        console.log(`  #${bug.id} ${bug.name} — geocoded outside bbox (${hit.lat.toFixed(3)}, ${hit.lng.toFixed(3)}) — display: ${hit.display}`);
        report.no_geocode.push({ city: citySlug, id: bug.id, name: bug.name, address, geocoded: { lat: hit.lat, lng: hit.lng, display: hit.display }, reason: 'outside bbox' });
        continue;
      }
      // If geocoded location is close to current coord, it's already correct — skip.
      if (typeof curLat === 'number' && typeof curLng === 'number') {
        const miles = haversineMiles(curLat, curLng, hit.lat, hit.lng);
        if (miles < 1.0) {
          console.log(`  #${bug.id} ${bug.name} — already accurate (${miles.toFixed(2)} mi from geocode), skip`);
          report.skipped.push({ city: citySlug, id: bug.id, name: bug.name, reason: `current coord within ${miles.toFixed(2)} mi of geocode` });
          continue;
        }
      }
      // Replace lat/lng in cardSrc and splice into html.
      const newCardSrc = cardSrc
        .replace(/"lat":\s*-?\d+(\.\d+)?/, `"lat":${hit.lat}`)
        .replace(/"lng":\s*-?\d+(\.\d+)?/, `"lng":${hit.lng}`);
      if (newCardSrc === cardSrc) {
        console.log(`  #${bug.id} ${bug.name} — no replacement occurred (regex miss)`);
        report.skipped.push({ city: citySlug, id: bug.id, name: bug.name, reason: 'regex replace failed' });
        continue;
      }
      html = html.slice(0, card[0]) + newCardSrc + html.slice(card[1] + 1);
      console.log(`  #${bug.id} ${bug.name} — ${curLat?.toFixed(3)},${curLng?.toFixed(3)} -> ${hit.lat.toFixed(4)},${hit.lng.toFixed(4)}`);
      report.fixed.push({ city: citySlug, id: bug.id, name: bug.name, from: [curLat, curLng], to: [hit.lat, hit.lng], display: hit.display });
    }
  }

  if (!dryRun && report.fixed.length) {
    fs.writeFileSync(HTML_PATH, html);
    console.log(`\nWrote ${report.fixed.length} coord fixes to index.html`);
  } else if (dryRun) {
    console.log('\n(dry-run: index.html not written)');
  }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
  console.log(`Summary: fixed=${report.fixed.length}, skipped=${report.skipped.length}, no_geocode=${report.no_geocode.length}, card_not_found=${report.card_not_found.length}, nominatim_requests=${requests}`);
}

main().catch(e => { console.error(e); process.exit(1); });
