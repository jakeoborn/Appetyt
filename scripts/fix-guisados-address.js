// Fix Guisado's Homestyle Cooking (#11253) — correct address provided
// by user: 2654 W 4700 S, Taylorsville, UT 84129. Previous entry had a
// phantom "5415 S 900 E, Taylorsville" address (block doesn't exist in
// Taylorsville) with coords at Redwood Rd. Correct coords from SLC's
// grid math: 4700 S = ~40.6697 lat; 2654 W = ~-111.9920 lng.
// Neighborhood moved Murray → West Valley (Taylorsville sits W of I-15,
// closer to West Valley bucket than Murray across I-15).

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const id = 11253;
const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
let at = -1; for (const a of anchors) { at = html.indexOf(a); if (at >= 0) break; }
if (at < 0) { console.log('not found'); process.exit(1); }

let depth = 0, start = -1;
for (let i = at; i >= 0; i--) {
  if (html[i] === '}') depth++;
  else if (html[i] === '{') { if (!depth) { start = i; break; } depth--; }
}
depth = 0; let end = -1;
for (let i = start; i < html.length; i++) {
  if (html[i] === '{') depth++;
  else if (html[i] === '}') { depth--; if (!depth) { end = i; break; } }
}
const obj = html.slice(start, end + 1);
console.log('BEFORE:');
const m1 = obj.match(/"address":"([^"]*)"/);
const m2 = obj.match(/"lat":([-\d.]+)/);
const m3 = obj.match(/"lng":([-\d.]+)/);
const m4 = obj.match(/"neighborhood":"([^"]*)"/);
console.log('  address: ' + (m1 && m1[1]));
console.log('  lat:     ' + (m2 && m2[1]));
console.log('  lng:     ' + (m3 && m3[1]));
console.log('  nbhd:    ' + (m4 && m4[1]));

let newObj = obj
  .replace(/"address":"[^"]*"/, '"address":"2654 W 4700 S, Taylorsville, UT 84129"')
  .replace(/"lat":[-\d.]+/, '"lat":40.6697')
  .replace(/"lng":[-\d.]+/, '"lng":-111.992')
  .replace(/"neighborhood":"[^"]*"/, '"neighborhood":"West Valley"');

html = html.slice(0, start) + newObj + html.slice(end + 1);
fs.writeFileSync(indexPath, html);

console.log('');
console.log('AFTER:');
const n1 = newObj.match(/"address":"([^"]*)"/);
const n2 = newObj.match(/"lat":([-\d.]+)/);
const n3 = newObj.match(/"lng":([-\d.]+)/);
const n4 = newObj.match(/"neighborhood":"([^"]*)"/);
console.log('  address: ' + (n1 && n1[1]));
console.log('  lat:     ' + (n2 && n2[1]));
console.log('  lng:     ' + (n3 && n3[1]));
console.log('  nbhd:    ' + (n4 && n4[1]));
