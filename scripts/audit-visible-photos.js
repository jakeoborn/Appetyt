// Display-level photo audit: a card is OK if photoUrl OR photos[0] is a "good" url.
// Output: scripts/visible-photo-issues.json — only cards that render NO photo or a BAD photo.
const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

const BAD_PARTS = [
  'socialshare','social-share','social_share',
  'wordmark','word-mark',
  'og-image','og_image','ogimage',
  'meta-image','meta_image','metaimage',
  'matashare',
  '_logo','-logo','logo_','logo-','/logo.','logomark',
  'open-graph','open_graph','opengraph',
  'facebook-image','fb-share',
  'twitter-card','twitter_card',
];

function isBad(url) {
  if (!url) return 'empty';
  const l = url.toLowerCase();
  if (/squarespace\.com\/.*\/\d+\/?$/.test(l) && !/\.(png|jpg|jpeg|webp|gif)/i.test(l)) return 'empty-squarespace';
  for (const p of BAD_PARTS) if (l.includes(p)) return 'fn:' + p;
  if (l.includes('squarespace.com') && /\.png(\?|$)/.test(l)) return 'sq-png';
  if (l.includes('logo') && /\.(png|svg)(\?|$)/.test(l)) return 'logo-file';
  return null;
}

function findArrEnd(s, start) {
  let i = start, d = 0, inStr = false, esc = false;
  while (i < s.length) {
    const ch = s[i];
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = !inStr;
    else if (!inStr) {
      if (ch === '[') d++;
      else if (ch === ']') { d--; if (d === 0) return i; }
    }
    i++;
  }
  return -1;
}

function splitCards(txt) {
  const out = [];
  let j = 1, dj = 0, js = -1, ns = false, es = false;
  while (j < txt.length - 1) {
    const ch = txt[j];
    if (es) es = false;
    else if (ch === '\\') es = true;
    else if (ch === '"') ns = !ns;
    else if (!ns) {
      if (ch === '{') { if (dj === 0) js = j; dj++; }
      else if (ch === '}') { dj--; if (dj === 0) { out.push(txt.substring(js, j + 1)); js = -1; } }
    }
    j++;
  }
  return out;
}

const cityRe = /const\s+([A-Z][A-Z_]+?)_DATA\s*=\s*\[/g;
const cities = [];
let m;
while ((m = cityRe.exec(c)) !== null) {
  cities.push({ name: m[1], arrStart: c.indexOf('[', m.index + m[0].length - 1) });
}

const results = [];
const flagged = [];
for (const city of cities) {
  const end = findArrEnd(c, city.arrStart);
  if (end < 0) continue;
  const txt = c.substring(city.arrStart, end + 1);
  if (!/"id":\d+/.test(txt.substring(0, 2000))) continue;
  if (!/"photoUrl"|"photos"|"address"/.test(txt.substring(0, 5000))) continue;
  const cards = splitCards(txt);
  if (cards.length < 10) continue;

  let ok = 0, bad = 0, missing = 0;
  for (const card of cards) {
    if (!/"id":\d+/.test(card)) continue;
    const nm = card.match(/"name":"([^"\\]+)"/);
    const pu = card.match(/"photoUrl":"([^"]*)"/);
    const phs = card.match(/"photos":\["([^"]+)"/);
    const adr = card.match(/"address":"([^"\\]*)"/);
    const web = card.match(/"website":"([^"\\]*)"/);
    const purl = pu ? pu[1] : '';
    const p0 = phs ? phs[1] : '';
    const purlBad = isBad(purl);
    const p0Bad = isBad(p0);
    if (purl && !purlBad) { ok++; continue; }
    if (p0 && !p0Bad)     { ok++; continue; }
    const entry = {
      city: city.name,
      name: nm ? nm[1] : '?',
      address: adr ? adr[1] : '',
      website: web ? web[1] : '',
      photoUrl: purl,
      photoUrlReason: purlBad,
      photos0: p0,
      photos0Reason: p0Bad,
    };
    if (!purl && !p0) { missing++; entry.state = 'no-photo'; }
    else              { bad++;     entry.state = 'bad-photo'; }
    flagged.push(entry);
  }
  results.push({ city: city.name, total: cards.length, ok, bad, missing });
}

results.sort((a, b) => (b.bad + b.missing) - (a.bad + a.missing));
console.log('city            total    ok   bad  no-photo');
let T = 0, B = 0, M = 0, OK = 0;
for (const r of results) {
  console.log(
    r.city.padEnd(15),
    String(r.total).padStart(5),
    String(r.ok).padStart(5),
    String(r.bad).padStart(5),
    String(r.missing).padStart(8)
  );
  T += r.total; B += r.bad; M += r.missing; OK += r.ok;
}
console.log('---');
console.log(`TOTALS  total=${T}  ok=${OK}  bad=${B}  no-photo=${M}  (need-fix=${B + M}, ${Math.round((B + M) / T * 100)}%)`);
fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/visible-photo-issues.json', JSON.stringify(flagged, null, 2));
console.log('wrote scripts/visible-photo-issues.json (' + flagged.length + ' entries)');
