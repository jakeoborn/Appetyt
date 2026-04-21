#!/usr/bin/env node
// Re-geocode Miami + Charlotte entries via Nominatim and replace lat/lng
// when the geocoded result is inside the city bbox AND > 0.25 mi from the
// stored coord. Honors Nominatim's 1 req/sec policy (1200ms delay).
// Writes a report to scripts/verify-miami-charlotte-report.json.

const fs = require('fs');
const https = require('https');

const HTML_PATH = 'index.html';
const REPORT_PATH = 'scripts/verify-miami-charlotte-report.json';

const CITIES = {
  MIAMI_DATA:     { bbox: [25.40, 26.10, -80.60, -80.05], fullName: 'Miami, FL' },
  CHARLOTTE_DATA: { bbox: [35.00, 35.60, -81.10, -80.40], fullName: 'Charlotte, NC' },
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function nominatim(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'DimHourCoordVerifier/1.0 (contact: jakeoborn@yahoo.com)' },
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

function haversineMiles(a, b, c, d) {
  const toRad = x => x * Math.PI / 180;
  const R = 3958.7613;
  const dLat = toRad(c - a);
  const dLng = toRad(d - b);
  const h = Math.sin(dLat/2)**2 + Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function insideBbox(bbox, lat, lng) {
  return lat >= bbox[0] && lat <= bbox[1] && lng >= bbox[2] && lng <= bbox[3];
}

async function main() {
  let html = fs.readFileSync(HTML_PATH, 'utf8');
  const report = { updated: [], confirmed: [], no_geocode: [], outside_bbox: [] };
  let requests = 0;

  for (const [varName, cfg] of Object.entries(CITIES)) {
    const m = html.match(new RegExp(`const ${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
    if (!m) { console.log(`SKIP ${varName} — not found`); continue; }
    const arr = eval(m[1]);
    console.log(`\n=== ${varName} (${arr.length} entries) ===`);

    for (let i = 0; i < arr.length; i++) {
      const r = arr[i];
      if (!r.address) continue;

      // Try raw address, then strip Ste/Unit/# if needed.
      const cleanAddr = r.address
        .replace(/\s*(?:Ste|Suite|Unit|#)\s*[\w-]+(?=[,\s])/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      const queries = [r.address];
      if (cleanAddr !== r.address) queries.push(cleanAddr);

      let hit = null;
      for (const q of queries) {
        await sleep(1200);
        requests++;
        hit = await nominatim(q + ', ' + cfg.fullName);
        if (hit && insideBbox(cfg.bbox, hit.lat, hit.lng)) break;
        hit = null;
      }

      if (!hit) {
        console.log(`  #${r.id} ${r.name} — NOMINATIM MISS`);
        report.no_geocode.push({ var: varName, id: r.id, name: r.name, address: r.address });
        continue;
      }

      if (typeof r.lat === 'number' && typeof r.lng === 'number') {
        const miles = haversineMiles(r.lat, r.lng, hit.lat, hit.lng);
        if (miles < 0.25) {
          console.log(`  #${r.id} ${r.name} — confirmed (${miles.toFixed(3)} mi)`);
          report.confirmed.push({ var: varName, id: r.id, name: r.name, miles: +miles.toFixed(3) });
          continue;
        }
        console.log(`  #${r.id} ${r.name} — ${r.lat.toFixed(4)},${r.lng.toFixed(4)} -> ${hit.lat.toFixed(4)},${hit.lng.toFixed(4)} (${miles.toFixed(2)} mi off)`);
        arr[i] = { ...r, lat: hit.lat, lng: hit.lng };
        report.updated.push({ var: varName, id: r.id, name: r.name, from: [r.lat, r.lng], to: [hit.lat, hit.lng], miles: +miles.toFixed(3) });
      } else {
        arr[i] = { ...r, lat: hit.lat, lng: hit.lng };
        report.updated.push({ var: varName, id: r.id, name: r.name, from: null, to: [hit.lat, hit.lng] });
      }
    }

    // Re-serialize and replace in html.
    const newBlock = `const ${varName}=${JSON.stringify(arr)};`;
    html = html.replace(m[0], newBlock);
  }

  fs.writeFileSync(HTML_PATH, html);
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nSummary: updated=${report.updated.length}, confirmed=${report.confirmed.length}, no_geocode=${report.no_geocode.length}, outside_bbox=${report.outside_bbox.length}, requests=${requests}`);
}

main().catch(e => { console.error(e); process.exit(1); });
