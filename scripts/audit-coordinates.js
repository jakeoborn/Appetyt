#!/usr/bin/env node
// Audit lat/lng for every restaurant across all cities.
// Flags:
//   1. Coords outside the reasonable metro bounding box (real outliers on the map)
//   2. Coords exactly 0,0 or null (bad data)
//   3. Coords that are DEFAULT neighborhood centroids re-used for many entries
//      (looks like "we just pasted the casino address 15 times" — breaks the map)
// Run: node scripts/audit-coordinates.js

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

// Bounding boxes: [minLat, maxLat, minLng, maxLng]. Generous — cover suburbs.
const BBOX = {
  'DALLAS_DATA':   [32.40, 33.20, -97.50, -96.40],   // DFW metroplex
  'HOUSTON_DATA':  [29.40, 30.20, -95.90, -94.90],   // Houston + burbs + Katy
  'CHICAGO_DATA':  [41.40, 42.40, -88.30, -87.40],   // Chicagoland
  'AUSTIN_DATA':   [30.00, 30.70, -98.20, -97.40],   // Austin + round rock + cedar park
  'SLC_DATA':      [40.30, 41.20, -112.40, -111.40], // SLC metro incl Park City
  'LV_DATA':       [35.80, 36.40, -115.60, -114.70], // Vegas Valley + Hoover Dam
  'SEATTLE_DATA':  [47.20, 47.90, -122.60, -121.80], // Seattle + Bellevue + Woodinville
  'NYC_DATA':      [40.40, 41.10, -74.30, -73.60],   // Five boroughs + near suburbs
};

function readArray(constName) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const slice = html.slice(a, e);
  try { return JSON.parse(slice); } catch {
    try { return (new Function('return ' + slice))(); } catch { return null; }
  }
}

const CITIES = ['DALLAS_DATA', 'HOUSTON_DATA', 'CHICAGO_DATA', 'AUSTIN_DATA', 'SLC_DATA', 'LV_DATA', 'SEATTLE_DATA', 'NYC_DATA'];

const report = { total: 0, missing: 0, outOfBbox: 0, reusedCoords: 0, byCity: {}, outliers: [] };

CITIES.forEach(constName => {
  const arr = readArray(constName);
  if (!arr) { console.log('Skip:', constName, '(unable to parse)'); return; }
  const bbox = BBOX[constName];
  const city = constName.replace(/_DATA$/, '');
  report.byCity[city] = { total: arr.length, missing: 0, outOfBbox: 0, reusedCoords: 0, outlierSamples: [] };
  report.total += arr.length;

  // Group by exact coord to detect duplicates
  const coordGroups = {};
  arr.forEach(r => {
    if (typeof r.lat !== 'number' || typeof r.lng !== 'number' || r.lat === 0 && r.lng === 0) {
      report.byCity[city].missing++;
      report.missing++;
      return;
    }
    const key = r.lat.toFixed(4) + ',' + r.lng.toFixed(4);
    if (!coordGroups[key]) coordGroups[key] = [];
    coordGroups[key].push(r);
    // Out-of-bbox
    if (r.lat < bbox[0] || r.lat > bbox[1] || r.lng < bbox[2] || r.lng > bbox[3]) {
      report.byCity[city].outOfBbox++;
      report.outOfBbox++;
      if (report.byCity[city].outlierSamples.length < 8) {
        report.byCity[city].outlierSamples.push({
          id: r.id, name: r.name, neighborhood: r.neighborhood, lat: r.lat, lng: r.lng, address: r.address
        });
      }
    }
  });

  // Reused coords: 5+ entries sharing exact (to 4 decimals) coords
  const reusedGroups = Object.entries(coordGroups).filter(([, rs]) => rs.length >= 5);
  reusedGroups.forEach(([key, rs]) => {
    report.byCity[city].reusedCoords += rs.length;
    report.reusedCoords += rs.length;
  });
  if (reusedGroups.length) {
    report.byCity[city].reusedGroups = reusedGroups.slice(0, 4).map(([key, rs]) => ({
      coords: key,
      count: rs.length,
      sample: rs.slice(0, 4).map(r => r.name + ' | ' + r.neighborhood)
    }));
  }
});

// Print summary
console.log('='.repeat(60));
console.log('COORDINATE AUDIT — ' + report.total + ' total spots');
console.log('='.repeat(60));
console.log('Missing/zero coords:', report.missing);
console.log('Outside metro bbox:', report.outOfBbox);
console.log('Sharing exact coords (groups of 5+):', report.reusedCoords);
console.log();
Object.entries(report.byCity).forEach(([city, c]) => {
  const total = c.total;
  const issues = c.missing + c.outOfBbox;
  const pct = total ? ((issues / total) * 100).toFixed(1) : 0;
  console.log(city + ':');
  console.log('  ' + c.total + ' total | missing ' + c.missing + ' | outOfBbox ' + c.outOfBbox + ' (' + pct + '% issues)');
  if (c.outOfBbox > 0) {
    console.log('  OUTLIERS (first ' + c.outlierSamples.length + '):');
    c.outlierSamples.forEach(o => {
      console.log('    • ' + o.name + ' @ "' + o.neighborhood + '" → lat=' + o.lat + ',lng=' + o.lng + '  [id ' + o.id + ']');
      if (o.address) console.log('      addr: ' + o.address);
    });
  }
  if (c.reusedGroups) {
    console.log('  REUSED COORD CLUSTERS:');
    c.reusedGroups.forEach(g => {
      console.log('    • ' + g.coords + ' shared by ' + g.count + ' spots: ' + g.sample.join(' / ') + (g.count > 4 ? ' ...' : ''));
    });
  }
});

// Write raw report for further processing
fs.writeFileSync(path.join(__dirname, 'coordinate-audit-report.json'), JSON.stringify(report, null, 2));
console.log('\nFull JSON report written to scripts/coordinate-audit-report.json');
