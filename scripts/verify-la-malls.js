const https = require('https');
const malls = [
  { name: 'Grand Central Market',         query: '317 S Broadway, Los Angeles, CA 90013',          trainLat: 34.0507, trainLng: -118.2495 },
  { name: 'The Original Farmers Market',  query: '6333 W 3rd St, Los Angeles, CA 90036',           trainLat: 34.0723, trainLng: -118.3589 },
  { name: 'Westfield Century City',       query: '10250 Santa Monica Blvd, Los Angeles, CA 90067', trainLat: 34.0590, trainLng: -118.4175 },
  { name: 'Santa Monica Place',           query: '395 Santa Monica Pl, Santa Monica, CA 90401',    trainLat: 34.0148, trainLng: -118.4989 },
  { name: 'The Americana at Brand',       query: '889 Americana Way, Glendale, CA 91210',          trainLat: 34.1465, trainLng: -118.2559 },
  { name: 'Beverly Center',               query: '8500 Beverly Blvd, Los Angeles, CA 90048',       trainLat: 34.0752, trainLng: -118.3768 },
  { name: 'Olvera Street',                query: '845 N Alameda St, Los Angeles, CA 90012',        trainLat: 34.0571, trainLng: -118.2375 }
];

const ua = 'DimHour/1.0 (dimhour.com)';
function geocode(q) {
  return new Promise(r => {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
    https.get(url, { headers: { 'User-Agent': ua } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { const j = JSON.parse(d); r(j[0] ? { lat: +j[0].lat, lng: +j[0].lon, dn: j[0].display_name } : null); }
        catch (e) { r(null); }
      });
    }).on('error', () => r(null));
  });
}
function km(a, b, c, d) { const r = 6371, p = Math.PI / 180, dLat = (c - a) * p, dLng = (d - b) * p, h = Math.sin(dLat / 2) ** 2 + Math.cos(a * p) * Math.cos(c * p) * Math.sin(dLng / 2) ** 2; return 2 * r * Math.asin(Math.sqrt(h)); }

(async () => {
  for (const p of malls) {
    const g = await geocode(p.query);
    if (!g) { console.log('NOMINATIM FAIL:', p.name); continue; }
    const dKm = km(p.trainLat, p.trainLng, g.lat, g.lng);
    const inBox = g.lat >= 33.7 && g.lat <= 34.5 && g.lng >= -118.9 && g.lng <= -117.6;
    console.log(`${p.name.padEnd(36)} | train=${p.trainLat.toFixed(4)},${p.trainLng.toFixed(5)} | nom=${g.lat.toFixed(4)},${g.lng.toFixed(5)} | ${dKm.toFixed(2)}km ${inBox ? 'OK' : 'OOB'}`);
    await new Promise(r => setTimeout(r, 1100));
  }
})();
