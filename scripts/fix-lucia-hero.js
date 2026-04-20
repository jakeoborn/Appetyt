// Promote Lucia (Dallas #1) photos[0] to photoUrl — user said the original
// hero photo is in the gallery at position 0, but the current list-card
// hero (photoUrl) is a different image. Unifies list-card and detail-view
// heroes to the same image.
const fs = require('fs');
const path = 'index.html';

function tryWrite(html, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try { fs.writeFileSync(path, html, 'utf8'); return; }
    catch (e) { if (i === retries - 1) throw e; const until = Date.now() + 500; while (Date.now() < until) {} }
  }
}

const html = fs.readFileSync(path, 'utf8');

// Find Lucia's object and extract current photoUrl + photos[0]
const re = /\{"id":1,"name":"Lucia"[\s\S]*?"photoUrl":"([^"]*)","photos":\["([^"]*)"/;
const m = html.match(re);
if (!m) { console.error('Lucia entry not found with photos[]'); process.exit(1); }
const oldPhotoUrl = m[1];
const firstPhoto = m[2];
if (oldPhotoUrl === firstPhoto) { console.log('photoUrl already matches photos[0] — no change.'); process.exit(0); }

console.log('Current photoUrl:', oldPhotoUrl.slice(0, 110));
console.log('Will set to photos[0]:', firstPhoto.slice(0, 110));

// Replace only the photoUrl value (first occurrence after Lucia's id)
const before = `"id":1,"name":"Lucia"`;
const idx = html.indexOf(before);
const segStart = idx;
const segEnd = html.indexOf('"photos":[', idx) + '"photos":['.length;
const segment = html.slice(segStart, segEnd);
const updatedSegment = segment.replace(`"photoUrl":"${oldPhotoUrl}"`, `"photoUrl":"${firstPhoto}"`);
if (updatedSegment === segment) { console.error('Replace failed — photoUrl string not found in Lucia segment.'); process.exit(1); }
const updated = html.slice(0, segStart) + updatedSegment + html.slice(segEnd);

tryWrite(updated);
console.log('Wrote', path);
