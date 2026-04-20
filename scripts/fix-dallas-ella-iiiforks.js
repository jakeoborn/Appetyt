// Dallas data corrections per user 2026-04-20:
//   Ella (#409) — CLOSED. Remove card entirely.
//   III Forks (#410) — correct address is "5100 Belt Line Rd Suite 800,
//     Dallas, TX 75254" (not Addison TX). Coords updated to 32.9515,
//     -96.8218 (near Belt Line & Inwood). Neighborhood stays "Addison"
//     (informal bucket for 75254 venues near the Addison border).

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

function findCardSlice(html, id) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1; for (const a of anchors) { at = html.indexOf(a); if (at >= 0) break; }
  if (at < 0) return null;
  let depth = 0, start = -1;
  for (let i = at; i >= 0; i--) {
    if (html[i] === '}') depth++;
    else if (html[i] === '{') { if (!depth) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0; let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (!depth) { end = i; break; } }
  }
  return end > 0 ? { start, end } : null;
}

// 1) III Forks fix
const iiiSlice = findCardSlice(html, 410);
if (!iiiSlice) { console.error('III Forks not found'); process.exit(1); }
let iiiObj = html.slice(iiiSlice.start, iiiSlice.end + 1);
const iiiBefore = {
  addr: (iiiObj.match(/"address":"([^"]*)"/) || [])[1],
  lat: (iiiObj.match(/"lat":([-\d.]+)/) || [])[1],
  lng: (iiiObj.match(/"lng":([-\d.]+)/) || [])[1],
  nbh: (iiiObj.match(/"neighborhood":"([^"]*)"/) || [])[1],
};
let iiiNew = iiiObj
  .replace(/"address":"[^"]*"/, '"address":"5100 Belt Line Rd Suite 800, Dallas, TX 75254"')
  .replace(/"lat":[-\d.]+/, '"lat":32.9515')
  .replace(/"lng":[-\d.]+/, '"lng":-96.8218');
html = html.slice(0, iiiSlice.start) + iiiNew + html.slice(iiiSlice.end + 1);

console.log('III Forks #410:');
console.log('  BEFORE  addr=' + iiiBefore.addr + '  lat=' + iiiBefore.lat + '  lng=' + iiiBefore.lng + '  nbh=' + iiiBefore.nbh);
console.log('  AFTER   addr=5100 Belt Line Rd Suite 800, Dallas, TX 75254  lat=32.9515  lng=-96.8218  nbh=' + iiiBefore.nbh);

// 2) Ella deletion — remove card object AND its surrounding comma.
// After III Forks mutation above, ID offsets within the string shifted;
// re-read to locate Ella fresh.
const ellaSlice = findCardSlice(html, 409);
if (!ellaSlice) { console.error('Ella not found'); process.exit(1); }
const ellaObj = html.slice(ellaSlice.start, ellaSlice.end + 1);
const ellaName = (ellaObj.match(/"name":"([^"]*)"/) || [])[1];
console.log('');
console.log('Ella #409: deleting card "' + ellaName + '" (closed)');

// Determine comma to remove: prefer the trailing comma after the object.
// If this is the last element, remove the preceding comma instead.
let delStart = ellaSlice.start, delEnd = ellaSlice.end + 1;
if (html[delEnd] === ',') {
  delEnd++; // trailing comma
} else if (html[delStart - 1] === ',') {
  delStart--; // leading comma (last element)
}
html = html.slice(0, delStart) + html.slice(delEnd);

fs.writeFileSync(indexPath, html);
console.log('  removed ' + (delEnd - delStart) + ' chars');

// Verify
const html2 = fs.readFileSync(indexPath, 'utf8');
const stillThere = html2.indexOf('"id":409,') >= 0 || html2.indexOf('"id":409}') >= 0;
console.log('');
console.log('Verify: Ella #409 present in file? ' + stillThere);
