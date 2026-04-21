#!/usr/bin/env node
const fs = require('fs');
const https = require('https');
const HTML_PATH = 'index.html';
const REPORT_PATH = 'scripts/verify-chi-expand-batch1-report.json';
const MIN_ID = 12569;
const BBOX = [41.64, 42.05, -87.95, -87.52];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function nominatim(query) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'DimHourCoordVerifier/1.0 (jakeoborn@yahoo.com)' }, timeout: 15000 }, res => {
      let body = ''; res.on('data', c => body += c);
      res.on('end', () => { try { const j = JSON.parse(body); if (!Array.isArray(j) || !j.length) return resolve(null); resolve({ lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon), display: j[0].display_name }); } catch (e) { resolve(null); } });
    });
    req.on('timeout', () => { req.destroy(); resolve(null); }); req.on('error', () => resolve(null));
  });
}

function hav(a, b, c, d) { const toRad = x => x * Math.PI / 180; const R = 3958.7613; const dLat = toRad(c - a), dLng = toRad(d - b); const h = Math.sin(dLat/2)**2 + Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLng/2)**2; return 2 * R * Math.asin(Math.sqrt(h)); }
const inBbox = (b, lat, lng) => lat >= b[0] && lat <= b[1] && lng >= b[2] && lng <= b[3];

async function main() {
  let html = fs.readFileSync(HTML_PATH, 'utf8');
  const declStart = html.indexOf('const CHICAGO_DATA=');
  const open = html.indexOf('[', declStart);
  let depth = 0, close = open;
  for (let j = open; j < html.length; j++) { if (html[j] === '[') depth++; else if (html[j] === ']') { depth--; if (depth === 0) { close = j; break; } } }
  const sliceStart = open, sliceEnd = close + 1;
  const arr = eval(html.slice(sliceStart, sliceEnd));
  const targets = arr.filter(r => r.id >= MIN_ID && r.address);
  console.log(`Verifying ${targets.length} CHI expand-batch-1 entries (id >= ${MIN_ID})`);
  const report = { updated: [], confirmed: [], no_geocode: [], outside_bbox: [] };

  for (let i = 0; i < targets.length; i++) {
    const r = targets[i];
    const cleanAddr = r.address.replace(/\s*(?:Ste|Suite|Unit|Fl|#|Lower)\s*[\w-]+(?=[,\s])/i, '').replace(/\s+/g, ' ').trim();
    const queries = [r.address];
    if (cleanAddr !== r.address) queries.push(cleanAddr);
    let hit = null;
    for (const q of queries) { await sleep(1200); hit = await nominatim(q); if (hit) break; }
    if (!hit) { console.log(`  ${i+1}/${targets.length} ❌ no geocode  ${r.name}`); report.no_geocode.push({ id: r.id, name: r.name, address: r.address }); continue; }
    if (!inBbox(BBOX, hit.lat, hit.lng)) { console.log(`  ${i+1}/${targets.length} ⚠ outside bbox  ${r.name}`); report.outside_bbox.push({ id: r.id, name: r.name, address: r.address, returned: hit }); continue; }
    const dist = hav(r.lat, r.lng, hit.lat, hit.lng);
    if (dist > 0.3) { console.log(`  ${i+1}/${targets.length} ✏ updated ${dist.toFixed(2)}mi  ${r.name}`); report.updated.push({ id: r.id, name: r.name, dist_mi: dist, from: [r.lat, r.lng], to: [hit.lat, hit.lng] }); r.lat = hit.lat; r.lng = hit.lng; }
    else { console.log(`  ${i+1}/${targets.length} ✓ confirmed ${dist.toFixed(2)}mi  ${r.name}`); report.confirmed.push({ id: r.id, name: r.name, dist_mi: dist }); }
  }

  const serialized = JSON.stringify(arr);
  html = html.slice(0, sliceStart) + serialized + html.slice(sliceEnd);
  fs.writeFileSync(HTML_PATH, html);
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(''); console.log('=== Summary ===');
  console.log(`  confirmed:    ${report.confirmed.length}`); console.log(`  updated:      ${report.updated.length}`); console.log(`  no_geocode:   ${report.no_geocode.length}`); console.log(`  outside_bbox: ${report.outside_bbox.length}`);
}
main().catch(e => { console.error(e); process.exit(1); });
