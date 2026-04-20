const fs = require('fs');
const path = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
let content = fs.readFileSync(path, 'utf8');

const targets = [
  { name: 'Eleven Madison Park', newUrl: 'https://lh3.googleusercontent.com/p/AF1QipORpCE38GEBjvmFeP2fO3yrHfKLjVb_wswX-Y_N=w1920-h1080-k-no' },
  { name: 'Sushi Nakazawa',      newUrl: 'https://lh3.googleusercontent.com/p/AF1QipMyfYhibAoF8JYUTiKHGzpld3Ug9Oh4-5SkQ5MN=w1920-h1080-k-no' },
  { name: '4 Charles Prime Rib', newUrl: 'https://lh3.googleusercontent.com/p/AF1QipNnULJBcBysaxRjODuXb75cxPK7x8uZS8lzQ2Qz=w1920-h1080-k-no' },
  { name: 'The Corson Building', newUrl: 'https://lh3.googleusercontent.com/p/AF1QipNiNWej_NiTo5mYFdRRwHoeah3nVyF7eeqYW9wS=w1920-h1080-k-no' },
];

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let changes = 0;
for (const t of targets) {
  const nameRe = new RegExp('"name":"' + escapeRe(t.name) + '"', 'g');
  let m = nameRe.exec(content);
  if (!m) { console.log('NOT FOUND:', t.name); continue; }
  const windowEnd = Math.min(content.length, m.index + 6000);
  const photoUrlIdx = content.indexOf('"photoUrl":"', m.index);
  if (photoUrlIdx < 0 || photoUrlIdx > windowEnd) { console.log('NO photoUrl for', t.name); continue; }
  const valStart = photoUrlIdx + '"photoUrl":"'.length;
  const valEnd = content.indexOf('"', valStart);
  const oldVal = content.substring(valStart, valEnd);
  if (oldVal === t.newUrl) { console.log('UNCHANGED:', t.name); continue; }
  content = content.substring(0, valStart) + t.newUrl + content.substring(valEnd);
  console.log('SWAPPED:', t.name);
  console.log('  old:', oldVal.substring(0, 120));
  console.log('  new:', t.newUrl.substring(0, 120));
  changes++;
}

if (changes > 0) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('\nWrote', changes, 'change(s) to', path);
} else {
  console.log('\nNo changes written.');
}
