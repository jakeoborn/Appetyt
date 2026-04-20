const https = require('https');
const museums = [
  { name: 'Getty Center',                                   query: '1200 Getty Center Dr, Los Angeles, CA 90049',          trainLat: 34.0779, trainLng: -118.4750 },
  { name: 'LACMA',                                          query: '5905 Wilshire Blvd, Los Angeles, CA 90036',           trainLat: 34.0637, trainLng: -118.3585 },
  { name: 'The Broad',                                      query: '221 S Grand Ave, Los Angeles, CA 90012',              trainLat: 34.0547, trainLng: -118.2504 },
  { name: 'Natural History Museum of LA County',            query: '900 Exposition Blvd, Los Angeles, CA 90007',          trainLat: 34.0174, trainLng: -118.2873 },
  { name: 'California Science Center',                      query: '700 Exposition Park Dr, Los Angeles, CA 90037',       trainLat: 34.0156, trainLng: -118.2858 },
  { name: 'Getty Villa',                                    query: '17985 Pacific Coast Hwy, Pacific Palisades, CA 90272',trainLat: 34.0456, trainLng: -118.5643 },
  { name: 'Petersen Automotive Museum',                     query: '6060 Wilshire Blvd, Los Angeles, CA 90036',           trainLat: 34.0624, trainLng: -118.3614 },
  { name: 'Hammer Museum',                                  query: '10899 Wilshire Blvd, Los Angeles, CA 90024',          trainLat: 34.0596, trainLng: -118.4441 },
  { name: 'MOCA Grand Avenue',                              query: '250 S Grand Ave, Los Angeles, CA 90012',              trainLat: 34.0534, trainLng: -118.2508 },
  { name: 'Autry Museum of the American West',              query: '4700 Western Heritage Way, Los Angeles, CA 90027',    trainLat: 34.1497, trainLng: -118.2859 }
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
  for (const p of museums) {
    const g = await geocode(p.query);
    if (!g) { console.log('NOMINATIM FAIL:', p.name); continue; }
    const dKm = km(p.trainLat, p.trainLng, g.lat, g.lng);
    const inBox = g.lat >= 33.7 && g.lat <= 34.5 && g.lng >= -118.9 && g.lng <= -117.6;
    console.log(`${p.name.padEnd(44)} | train=${p.trainLat.toFixed(4)},${p.trainLng.toFixed(5)} | nom=${g.lat.toFixed(4)},${g.lng.toFixed(5)} | ${dKm.toFixed(2)}km ${inBox ? 'OK' : 'OOB'}`);
    await new Promise(r => setTimeout(r, 1100));
  }
})();
