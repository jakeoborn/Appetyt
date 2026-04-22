// Take the first 10 issues per city, prioritizing 'bad-photo' over 'no-photo'.
// Output: scripts/photo-batch-current.json — the active batch ready to process.
const fs = require('fs');
const all = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/visible-photo-issues.json', 'utf8'));

const byCity = {};
for (const e of all) {
  (byCity[e.city] = byCity[e.city] || []).push(e);
}

const batch = [];
const summary = [];
for (const city of Object.keys(byCity).sort()) {
  const list = byCity[city];
  list.sort((a, b) => {
    if (a.state !== b.state) return a.state === 'bad-photo' ? -1 : 1;
    return 0;
  });
  const slice = list.slice(0, 10);
  batch.push(...slice);
  const bad = slice.filter(x => x.state === 'bad-photo').length;
  const noP = slice.filter(x => x.state === 'no-photo').length;
  const withSite = slice.filter(x => x.website).length;
  summary.push({ city, taking: slice.length, bad, noPhoto: noP, hasWebsite: withSite });
}

console.log('city            take   bad  no-photo  has-website');
for (const s of summary) {
  console.log(
    s.city.padEnd(15),
    String(s.taking).padStart(4),
    String(s.bad).padStart(5),
    String(s.noPhoto).padStart(8),
    String(s.hasWebsite).padStart(11)
  );
}
console.log('---');
console.log('batch size:', batch.length);

fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/photo-batch-current.json', JSON.stringify(batch, null, 2));
console.log('wrote scripts/photo-batch-current.json');
