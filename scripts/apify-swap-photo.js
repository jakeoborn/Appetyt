// Manually swap a restaurant's photoUrl to a specific index from raw Apify imageUrls.
// Usage: node scripts/apify-swap-photo.js <city> <restaurantNameRegex> <imageUrlIdx>
//   node scripts/apify-swap-photo.js dallas georgie 2
const fs = require('fs');

const city = process.argv[2];
const nameRe = new RegExp(process.argv[3], 'i');
const idx = parseInt(process.argv[4], 10);

const apify = JSON.parse(fs.readFileSync(`scripts/apify-results-${city}.json`, 'utf8'));
const entry = apify.find(x => nameRe.test(x.title));
if (!entry) { console.error('Not found in apify results'); process.exit(1); }
const newUrl = (entry.imageUrls || [])[idx];
if (!newUrl) { console.error('No imageUrl at idx', idx); process.exit(1); }
console.log('Match:', entry.title);
console.log('New photoUrl idx', idx + ':', newUrl.substring(0, 160));

const html = fs.readFileSync('index.html', 'utf8');
const varName = { dallas: 'DALLAS_DATA', phx: 'PHX_DATA', la: 'LA_DATA' }[city];
const re = new RegExp('const ' + varName + '\\s*=\\s*\\[');
const m = html.match(re);
const start = m.index + m[0].length - 1;
let d = 0, inStr = false, esc = false, sc = null, end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (esc) { esc = false; continue; }
  if (c === '\\' && inStr) { esc = true; continue; }
  if (inStr) { if (c === sc) { inStr = false; sc = null; } continue; }
  if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
  if (c === '[') d++;
  if (c === ']') { d--; if (!d) { end = i + 1; break; } }
}
const arr = JSON.parse(html.substring(start, end));
const current = arr.find(r => nameRe.test(r.name || ''));
if (!current) { console.error('Not found in', varName); process.exit(1); }
console.log('Current photoUrl:', (current.photoUrl || '').substring(0, 160));
current.photoUrl = newUrl;
const newHtml = html.substring(0, start) + JSON.stringify(arr) + html.substring(end);
fs.writeFileSync('index.html', newHtml);
console.log('Swapped.');
