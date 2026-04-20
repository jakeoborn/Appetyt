const https = require('https');
const hotels = [
  { name: 'The Peninsula Beverly Hills',              query: '9882 S Santa Monica Blvd, Beverly Hills, CA 90212', trainLat: 34.0669, trainLng: -118.4176 },
  { name: 'Waldorf Astoria Beverly Hills',            query: '9850 Wilshire Blvd, Beverly Hills, CA 90210',       trainLat: 34.0671, trainLng: -118.4170 },
  { name: 'Four Seasons Los Angeles at Beverly Hills',query: '300 S Doheny Dr, Los Angeles, CA 90048',            trainLat: 34.0691, trainLng: -118.3938 },
  { name: 'Sunset Tower Hotel',                       query: '8358 Sunset Blvd, West Hollywood, CA 90069',        trainLat: 34.0960, trainLng: -118.3754 },
  { name: 'The Hollywood Roosevelt',                  query: '7000 Hollywood Blvd, Los Angeles, CA 90028',        trainLat: 34.1018, trainLng: -118.3410 },
  { name: 'Fairmont Miramar Hotel & Bungalows',       query: '101 Wilshire Blvd, Santa Monica, CA 90401',         trainLat: 34.0203, trainLng: -118.4997 },
  { name: 'The Langham Huntington, Pasadena',         query: '1401 S Oak Knoll Ave, Pasadena, CA 91106',          trainLat: 34.1373, trainLng: -118.1339 },
  { name: 'Hotel Figueroa',                           query: '939 S Figueroa St, Los Angeles, CA 90015',          trainLat: 34.0446, trainLng: -118.2661 },
  { name: 'Hotel Erwin Venice Beach',                 query: '1697 Pacific Ave, Venice, CA 90291',                trainLat: 33.9900, trainLng: -118.4702 },
  { name: 'Andaz West Hollywood',                     query: '8401 Sunset Blvd, West Hollywood, CA 90069',        trainLat: 34.0961, trainLng: -118.3770 }
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
  for (const p of hotels) {
    const g = await geocode(p.query);
    if (!g) { console.log('NOMINATIM FAIL:', p.name); continue; }
    const dKm = km(p.trainLat, p.trainLng, g.lat, g.lng);
    const inBox = g.lat >= 33.7 && g.lat <= 34.5 && g.lng >= -118.9 && g.lng <= -117.6;
    console.log(`${p.name.padEnd(46)} | train=${p.trainLat.toFixed(4)},${p.trainLng.toFixed(5)} | nom=${g.lat.toFixed(4)},${g.lng.toFixed(5)} | ${dKm.toFixed(2)}km ${inBox ? 'OK' : 'OOB'}`);
    await new Promise(r => setTimeout(r, 1100));
  }
})();
