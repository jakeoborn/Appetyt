const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

// Find Dallas data: look for DALLAS_DATA const
const marker = 'const DALLAS_DATA';
const start = c.indexOf(marker);
if (start < 0) { console.log('DALLAS_DATA not found, trying other markers...'); process.exit(1); }
// Find the closing `];` of the array
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
console.log('DALLAS_DATA array spans chars', arrStart, '-', arrEnd, '(len', arrEnd - arrStart, ')');

const dallasText = c.substring(arrStart, arrEnd + 1);

// Iterate cards (top-level {...} objects in the array)
const cards = [];
let j = 1, dj = 0, js = -1, jnStr = false, jesc = false;
while (j < dallasText.length - 1) {
  const ch = dallasText[j];
  if (jesc) jesc = false;
  else if (ch === '\\') jesc = true;
  else if (ch === '"') jnStr = !jnStr;
  else if (!jnStr) {
    if (ch === '{') { if (dj === 0) js = j; dj++; }
    else if (ch === '}') { dj--; if (dj === 0) { cards.push(dallasText.substring(js, j+1)); js = -1; } }
  }
  j++;
}

console.log('Dallas cards found:', cards.length);

let noPhotos = 0, shortPhotos = 0, goodPhotos = 0, noPhotoField = 0;
const noPhotoList = [], shortPhotoList = [];
for (const card of cards) {
  const nameMatch = card.match(/"name":"([^"]*)"/);
  const name = nameMatch ? nameMatch[1] : '(unknown)';
  const photosMatch = card.match(/"photos":\[([^\]]*)\]/);
  if (!photosMatch) {
    noPhotoField++;
    noPhotoList.push(name);
    continue;
  }
  const arrStr = '[' + photosMatch[1] + ']';
  let arr;
  try { arr = JSON.parse(arrStr); } catch (e) { arr = []; }
  if (arr.length === 0) { noPhotos++; noPhotoList.push(name); }
  else if (arr.length < 3) { shortPhotos++; shortPhotoList.push(name + ' (' + arr.length + ')'); }
  else goodPhotos++;
}

console.log();
console.log('Photo coverage:');
console.log('  good (3+ photos):', goodPhotos);
console.log('  short (1-2 photos):', shortPhotos);
console.log('  empty photos array:', noPhotos);
console.log('  no photos field at all:', noPhotoField);
console.log();
console.log('First 20 without photos:');
for (const n of noPhotoList.slice(0, 20)) console.log('  -', n);
