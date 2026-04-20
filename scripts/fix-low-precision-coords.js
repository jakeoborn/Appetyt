#!/usr/bin/env node
// Re-geocode every low-precision (≤3 decimal) coord via Nominatim and update
// index.html in place. Honors Nominatim's 1 req/sec policy.
//
// Strategy per entry:
//   1. Build query — use the existing address if it looks structured (has digits + city/state),
//      else fall back to "name, neighborhood, city, state".
//   2. Query Nominatim with US country bias.
//   3. Validate the new coord is inside the metro bbox AND within 8 mi of the old coord
//      (sanity — placeholder coords are usually rough, not totally wrong).
//   4. If valid, replace the exact "lat":X,"lng":Y substring in index.html.
//   5. If not valid, log to manual-review file.
//
// Resumable: writes progress to scripts/fix-low-precision-coords-progress.json after each
// success. Re-running skips entries already fixed (by id+city).
//
// Usage:
//   node scripts/fix-low-precision-coords.js               # fix everything
//   node scripts/fix-low-precision-coords.js --city Dallas # one city
//   node scripts/fix-low-precision-coords.js --max 50      # cap N entries (testing)

const fs = require('fs');
const path = require('path');
const https = require('https');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const REPORT_PATH = path.join(__dirname, 'coord-precision-report.json');
const PROGRESS_PATH = path.join(__dirname, 'fix-low-precision-coords-progress.json');
const MANUAL_PATH = path.join(__dirname, 'fix-low-precision-coords-manual-review.json');
const LOG_PATH = path.join(__dirname, 'fix-low-precision-coords.log');

const argCity = (() => { const i = process.argv.indexOf('--city'); return i>=0 ? process.argv[i+1] : null; })();
const argMax  = (() => { const i = process.argv.indexOf('--max');  return i>=0 ? +process.argv[i+1] : Infinity; })();

// City bounding boxes (used to validate Nominatim results stay sane)
const CITY_BBOX = {
  DALLAS:   [32.40, 33.20, -97.50, -96.40],
  HOUSTON:  [29.40, 30.20, -95.90, -94.90],
  CHICAGO:  [41.40, 42.40, -88.30, -87.40],
  AUSTIN:   [30.00, 30.70, -98.20, -97.40],
  SLC:      [40.30, 41.40, -112.40, -111.40],
  LV:       [35.80, 36.40, -115.60, -114.70],
  SEATTLE:  [47.20, 48.00, -122.60, -121.80],
  NYC:      [40.40, 41.10, -74.30, -73.60],
  LA:       [33.50, 34.50, -118.80, -117.50],
  PHX:      [33.10, 34.10, -112.80, -111.30],
  SD:       [32.40, 33.40, -117.40, -116.50],
  MIAMI:    [25.50, 26.40, -80.50, -79.90],
  CHARLOTTE:[35.00, 35.60, -81.00, -80.40],
};

const CITY_FULL_NAME = {
  DALLAS:'Dallas, TX', HOUSTON:'Houston, TX', CHICAGO:'Chicago, IL', AUSTIN:'Austin, TX',
  SLC:'Salt Lake City, UT', LV:'Las Vegas, NV', SEATTLE:'Seattle, WA', NYC:'New York, NY',
  LA:'Los Angeles, CA', PHX:'Phoenix, AZ', SD:'San Diego, CA', MIAMI:'Miami, FL', CHARLOTTE:'Charlotte, NC',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function nominatim(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(query);
  return new Promise((resolve, reject) => {
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

function inBbox(lat, lng, bbox) {
  return lat >= bbox[0] && lat <= bbox[1] && lng >= bbox[2] && lng <= bbox[3];
}

function haversineMi(a, b) {
  const R = 3958.8;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(b[0]-a[0]);
  const dLng = toRad(b[1]-a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1)*Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function stripSuite(addr) {
  // Nominatim often fails when an address has " ste 100" / " #200" / " apt 4B" / " suite 305" / " floor 5"
  return addr
    .replace(/,?\s*(ste|suite|#|apt|unit|fl|floor|bldg|building)[\s.]*[a-z0-9-]+/ig, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildQueries(entry) {
  const cityFull = CITY_FULL_NAME[entry.city] || '';
  const addr = (entry.address || '').trim();
  const queries = [];
  if (/\d/.test(addr) && /,\s*[A-Z]{2}/.test(addr)) {
    queries.push(addr);
    const stripped = stripSuite(addr);
    if (stripped !== addr) queries.push(stripped);
  }
  // Fallback: name + neighborhood + city
  const parts = [entry.name];
  if (entry.neighborhood && !/multiple|various/i.test(entry.neighborhood)) parts.push(entry.neighborhood);
  if (cityFull) parts.push(cityFull);
  queries.push(parts.join(', '));
  // Final fallback: name + city only (helps for chains)
  if (cityFull) queries.push(`${entry.name}, ${cityFull}`);
  // De-dupe
  return [...new Set(queries)];
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_PATH)) return { fixed: {}, manual: [] };
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
}

function saveProgress(p) { fs.writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2)); }

function log(line) {
  fs.appendFileSync(LOG_PATH, line + '\n');
  console.log(line);
}

(async () => {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('Run scripts/audit-coord-precision.js first');
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  let entries = report.lowPrecision;
  if (argCity) {
    const c = argCity.toUpperCase();
    entries = entries.filter(e => e.city === c);
  }

  const progress = loadProgress();
  const manual = progress.manual || [];
  const fixed = progress.fixed || {};
  const todo = entries.filter(e => !fixed[`${e.city}:${e.id}`]);

  log(`\n=== fix-low-precision-coords run @ ${new Date().toISOString()} ===`);
  log(`Total candidates: ${entries.length} | Already fixed: ${Object.keys(fixed).length} | Todo: ${todo.length}`);
  if (argCity) log(`City filter: ${argCity}`);

  let html = fs.readFileSync(HTML_PATH, 'utf8');
  let processed = 0, updated = 0, skipped = 0, failed = 0;

  for (const e of todo) {
    if (processed >= argMax) break;
    processed++;
    const bbox = CITY_BBOX[e.city];
    const queries = buildQueries(e);
    let result = null, usedQuery = null;
    for (const q of queries) {
      result = await nominatim(q);
      await sleep(1100);
      if (result && inBbox(result.lat, result.lng, bbox)) { usedQuery = q; break; }
      result = null; // discard out-of-bbox attempts
    }

    if (!result) {
      failed++;
      manual.push({ ...e, reason: 'nominatim no result (all fallbacks)', queries });
      log(`[${processed}/${todo.length}] ✗ NO RESULT: [${e.city}] ${e.name}`);
      continue;
    }
    const query = usedQuery;
    const dist = haversineMi([e.lat, e.lng], [result.lat, result.lng]);
    if (dist > 8) {
      failed++;
      manual.push({ ...e, reason: 'far from old coord', query, got: result, distMi: +dist.toFixed(2) });
      log(`[${processed}/${todo.length}] ✗ FAR (${dist.toFixed(1)}mi): [${e.city}] ${e.name} → ${result.lat},${result.lng}`);
      continue;
    }

    // Replace coord in html. Need exact substring match to be safe.
    const oldStr = `"lat":${e.lat},"lng":${e.lng}`;
    const newStr = `"lat":${result.lat.toFixed(7)},"lng":${result.lng.toFixed(7)}`;
    const occurrences = html.split(oldStr).length - 1;
    if (occurrences === 0) {
      skipped++;
      manual.push({ ...e, reason: 'coord string not found in html', query, got: result });
      log(`[${processed}/${todo.length}] ⊘ NOT IN HTML: [${e.city}] ${e.name} (${oldStr})`);
      continue;
    }
    if (occurrences > 1) {
      // Need surrounding context to disambiguate. Use the entry's name as anchor.
      const nameAnchor = `"name":"${e.name.replace(/"/g, '\\"')}"`;
      const re = new RegExp(`(${nameAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*?)"lat":${e.lat.toString().replace(/\./g,'\\.')},"lng":${e.lng.toString().replace(/\./g,'\\.')}`);
      const m = re.exec(html);
      if (!m) {
        skipped++;
        manual.push({ ...e, reason: 'coord ambiguous (multiple matches, name anchor missed)', query, got: result });
        log(`[${processed}/${todo.length}] ⊘ AMBIGUOUS: [${e.city}] ${e.name}`);
        continue;
      }
      html = html.slice(0, m.index) + m[1] + newStr + html.slice(m.index + m[0].length);
    } else {
      html = html.replace(oldStr, newStr);
    }

    fixed[`${e.city}:${e.id}`] = { from: [e.lat, e.lng], to: [result.lat, result.lng], distMi: +dist.toFixed(3), display: result.display };
    updated++;
    log(`[${processed}/${todo.length}] ✓ FIXED: [${e.city}] ${e.name} ${e.lat},${e.lng} → ${result.lat.toFixed(6)},${result.lng.toFixed(6)} (${dist.toFixed(2)}mi)`);

    // Persist after every 25 fixes (in case of crash, save html + progress)
    if (updated % 25 === 0) {
      fs.writeFileSync(HTML_PATH, html);
      saveProgress({ fixed, manual });
    }
  }

  fs.writeFileSync(HTML_PATH, html);
  saveProgress({ fixed, manual });
  fs.writeFileSync(MANUAL_PATH, JSON.stringify(manual, null, 2));

  log(`\n=== DONE ===`);
  log(`Processed: ${processed} | Updated: ${updated} | Failed/skipped: ${failed+skipped}`);
  log(`Manual review queue: ${manual.length} → ${MANUAL_PATH}`);
})();
