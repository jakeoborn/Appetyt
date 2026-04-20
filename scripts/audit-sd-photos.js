const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

// San Diego uses SD_DATA per memory
const markers = ['const SD_DATA', 'const SANDIEGO_DATA', 'const SAN_DIEGO_DATA'];
let start = -1;
for (const mk of markers) {
  start = c.indexOf(mk);
  if (start >= 0) { console.log('Found marker:', mk, 'at', start); break; }
}
if (start < 0) { console.log('SD data array not found'); process.exit(1); }

const arrStart = c.indexOf('[', start);
let i = arrStart, depth = 0, inStr = false, esc = false, arrEnd = -1;
while (i < c.length) {
  const ch = c[i];
  if (esc) esc = false;
  else if (ch === '\\') esc = true;
  else if (ch === '"') inStr = !inStr;
  else if (!inStr) {
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
  }
  i++;
}
console.log('SD array spans', arrStart, '-', arrEnd, 'len', arrEnd - arrStart);
const sdText = c.substring(arrStart, arrEnd + 1);

const cards = [];
let j = 1, dj = 0, js = -1, jnStr = false, jesc = false;
while (j < sdText.length - 1) {
  const ch = sdText[j];
  if (jesc) jesc = false;
  else if (ch === '\\') jesc = true;
  else if (ch === '"') jnStr = !jnStr;
  else if (!jnStr) {
    if (ch === '{') { if (dj === 0) js = j; dj++; }
    else if (ch === '}') { dj--; if (dj === 0) { cards.push(sdText.substring(js, j+1)); js = -1; } }
  }
  j++;
}
console.log('SD cards:', cards.length);

let noPhotos = 0, shortPhotos = 0, goodPhotos = 0, noPhotoField = 0;
let hasWebsite = 0;
const noPhotoSample = [];
for (const card of cards) {
  const nm = card.match(/"name":"([^"]*)"/);
  const name = nm ? nm[1] : '?';
  if (/"website":"https?:/.test(card)) hasWebsite++;
  const ph = card.match(/"photos":\[([^\]]*)\]/);
  if (!ph) { noPhotoField++; if (noPhotoSample.length < 15) noPhotoSample.push(name); continue; }
  let arr; try { arr = JSON.parse('[' + ph[1] + ']'); } catch (e) { arr = []; }
  if (arr.length === 0) { noPhotos++; if (noPhotoSample.length < 15) noPhotoSample.push(name); }
  else if (arr.length < 3) shortPhotos++;
  else goodPhotos++;
}
console.log('\nSD photo coverage:');
console.log('  good (3+):', goodPhotos);
console.log('  short (1-2):', shortPhotos);
console.log('  empty photos[]:', noPhotos);
console.log('  no photos field:', noPhotoField);
console.log('  has website URL:', hasWebsite, 'of', cards.length);
console.log('\nFirst 15 without gallery:');
for (const n of noPhotoSample) console.log('  -', n);
