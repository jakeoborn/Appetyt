// Pick 20 top-score dry-run entries (2 per city) for Apify Google Places sweep.
// Output: scripts/apify-sweep-picks.json
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open) {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '[') d++;
    else if (str[i] === ']') { d--; if (!d) return i; }
  }
  return -1;
}

function parseArray(v) {
  const re = new RegExp(v + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const a = m.index + m[0].length - 1;
  const b = stackFindClose(html, a);
  // Try JSON.parse first (strict), fall back to Function eval for JS object literal (NYC_DATA uses unquoted keys).
  const slice = html.substring(a, b + 1);
  try { return JSON.parse(slice); }
  catch (e) { return (new Function('return ' + slice))(); }
}

const cities = [
  { city: 'Dallas', state: 'TX', varName: 'const DALLAS_DATA' },
  { city: 'Houston', state: 'TX', varName: 'const HOUSTON_DATA' },
  { city: 'Austin', state: 'TX', varName: 'const AUSTIN_DATA' },
  { city: 'Chicago', state: 'IL', varName: 'const CHICAGO_DATA' },
  { city: 'Salt Lake City', state: 'UT', varName: 'const SLC_DATA' },
  { city: 'Las Vegas', state: 'NV', varName: 'const LV_DATA' },
  { city: 'Seattle', state: 'WA', varName: 'const SEATTLE_DATA' },
  { city: 'New York', state: 'NY', varName: 'const NYC_DATA' },
  { city: 'Los Angeles', state: 'CA', varName: 'const LA_DATA' },
  { city: 'Phoenix', state: 'AZ', varName: 'const PHX_DATA' }
];

const picks = [];
for (const c of cities) {
  const data = parseArray(c.varName);
  // Require address to be a real match candidate; skip entries with empty address.
  const candidates = data
    .filter(r => r && r.name && r.address && typeof r.score === 'number')
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  // Pick 2 top-score entries. Avoid picking duplicates if any.
  const chosen = candidates.slice(0, 2);
  for (const r of chosen) {
    picks.push({
      id: r.id,
      name: r.name,
      address: r.address,
      city: c.city,
      state: c.state,
      current: {
        phone: r.phone || '',
        website: r.website || '',
        instagram: r.instagram || '',
        lat: r.lat,
        lng: r.lng,
        photoUrl: r.photoUrl || '',
        score: r.score
      }
    });
  }
}

fs.writeFileSync('scripts/apify-sweep-picks.json', JSON.stringify(picks, null, 2));
console.log('Wrote', picks.length, 'picks to scripts/apify-sweep-picks.json');
picks.forEach((p, i) => console.log(`  ${i+1}. [${p.city}] ${p.name} — id ${p.id} (score ${p.current.score})`));
