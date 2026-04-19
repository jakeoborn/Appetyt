// Revert cityLinks on specific pairs that are same-name but different places.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open) {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === '[') d++;
    else if (str[i] === ']') { d--; if (d === 0) return i; }
  }
  return -1;
}

function locateArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return null;
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  return { arrS, arrE };
}

function parseArray(varName) {
  const pos = locateArray(varName);
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

// (city, id, cityToRemoveFromCityLinks)
const UNLINK = [
  // Washington Square Park — different cities' different parks
  ['Chicago', 12551, 'New York'],
  ['New York', 1922, 'Chicago'],
  // The Park (Vegas casino outdoor area) vs The Park Cafe (SLC small diner)
  ['Salt Lake City', 11466, 'Las Vegas'],
  ['Las Vegas', 12544, 'Salt Lake City'],
  // OAK Draper (SLC) vs Oak (Seattle) — different concepts
  ['Salt Lake City', 11421, 'Seattle'],
  ['Seattle', 9237, 'Salt Lake City'],
  // Craft Kitchen (Vegas) vs Craft (NYC Colicchio) — Vegas "Craft Kitchen" is unrelated
  ['Las Vegas', 12257, 'New York'],
  ['New York', 1911, 'Las Vegas'],
  // Golden Steer — Vegas 1958 institution; NYC Golden Steer is a different unrelated steakhouse
  ['Las Vegas', 12245, 'New York'],
  ['New York', 1738, 'Las Vegas'],
];

const cities = {
  'Dallas': 'const DALLAS_DATA','Houston': 'const HOUSTON_DATA','Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA','Salt Lake City': 'const SLC_DATA','Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA','New York': 'const NYC_DATA',
};

const perCity = {};
Object.entries(cities).forEach(([c, v]) => { perCity[c] = parseArray(v); });

const removed = [];
UNLINK.forEach(([city, id, cityToRemove]) => {
  const data = perCity[city];
  if (!data) return;
  const r = data.find(x => x.id === id);
  if (!r || !Array.isArray(r.cityLinks)) return;
  const before = r.cityLinks.length;
  r.cityLinks = r.cityLinks.filter(c => c !== cityToRemove);
  if (r.cityLinks.length !== before) removed.push(`${city}#${id} "${r.name}": -${cityToRemove}`);
  if (r.cityLinks.length === 0) delete r.cityLinks;
});

const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log(`Unlinked ${removed.length} false-positive pairs:`);
removed.forEach(r => console.log('  ' + r));
