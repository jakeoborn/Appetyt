// Verify an address resolves to lat/lng via Nominatim (OpenStreetMap).
// Usage:   node scripts/verify-coords.js "246 N Canon Dr, Beverly Hills, CA 90210"
// Output:  JSON with {lat, lng, confidence, display_name, osm_type}
//
// No API key needed. Rate-limited: max 1 request/second per Nominatim ToS.
// Sets User-Agent per Nominatim requirements.

const address = process.argv.slice(2).join(' ').trim();
if (!address) {
  console.error('Usage: node scripts/verify-coords.js "<full address>"');
  process.exit(1);
}

const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
  q: address,
  format: 'json',
  addressdetails: '1',
  limit: '3',
  countrycodes: 'us',
});

(async () => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Dim-Hour/1.0 (dimhour.com) restaurant-data-verification',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      console.log(JSON.stringify({status:'error', httpStatus: res.status}));
      return;
    }
    const data = await res.json();
    if (!data.length) {
      console.log(JSON.stringify({status:'no-match', query: address}));
      return;
    }
    const best = data[0];
    const lat = parseFloat(best.lat);
    const lng = parseFloat(best.lon);
    const importance = parseFloat(best.importance || 0);
    const confidence = importance > 0.5 ? 'high' : importance > 0.2 ? 'medium' : 'low';
    console.log(JSON.stringify({
      status: 'ok',
      lat,
      lng,
      confidence,
      importance,
      display_name: best.display_name,
      osm_type: best.osm_type,
      class: best.class,
      type: best.type,
      alternatives: data.slice(1).map(d => ({lat:parseFloat(d.lat),lng:parseFloat(d.lon),display:d.display_name})),
    }, null, 2));
  } catch (e) {
    console.log(JSON.stringify({status:'error', message: e.message}));
  }
})();
