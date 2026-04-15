// Remove clear duplicate entries across all cities
// Strategy: for near-dupes with same name root + same neighborhood, keep the one with more data
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function dedupeCity(html, marker, city) {
  const p = html.indexOf(marker);
  if (p === -1) return html;
  const arrS = html.indexOf('[', p);
  let d = 0, arrE = arrS;
  for (let j = arrS; j < html.length; j++) {
    if (html[j] === '[') d++;
    if (html[j] === ']') { d--; if (d === 0) { arrE = j + 1; break; } }
  }
  let arr = JSON.parse(html.substring(arrS, arrE));
  const before = arr.length;

  // Build a map of normalized names to entries
  const normalize = (n) => n.toLowerCase().replace(/[''`]/g, "'").replace(/[^a-z0-9' ]/g, '').trim();

  // Specific duplicate pairs to merge (keep first, remove second)
  const removals = new Set();

  for (let i = 0; i < arr.length; i++) {
    if (removals.has(arr[i].id)) continue;
    for (let j = i + 1; j < arr.length; j++) {
      if (removals.has(arr[j].id)) continue;

      const a = normalize(arr[i].name);
      const b = normalize(arr[j].name);

      // Check if one name contains the other (like "Odd Duck" vs "Odd Duck South Lamar")
      const aContainsB = a.includes(b) || b.includes(a);
      // Check if names are very similar (first 8 chars match)
      const similarStart = a.substring(0, 8) === b.substring(0, 8);

      if (aContainsB || (similarStart && a.length > 5)) {
        // Check same neighborhood or similar address
        const sameHood = arr[i].neighborhood === arr[j].neighborhood;
        const sameAddr = arr[i].address && arr[j].address &&
          arr[i].address.replace(/[^a-z0-9]/gi, '').substring(0, 15) === arr[j].address.replace(/[^a-z0-9]/gi, '').substring(0, 15);

        if (sameHood || sameAddr) {
          // Keep the one with more complete data (longer description, more fields filled)
          const scoreA = (arr[i].description || '').length + (arr[i].phone ? 10 : 0) + (arr[i].website ? 10 : 0) + (arr[i].instagram ? 10 : 0);
          const scoreB = (arr[j].description || '').length + (arr[j].phone ? 10 : 0) + (arr[j].website ? 10 : 0) + (arr[j].instagram ? 10 : 0);

          if (scoreA >= scoreB) {
            removals.add(arr[j].id);
          } else {
            removals.add(arr[i].id);
          }
        }
      }
    }
  }

  if (removals.size > 0) {
    arr = arr.filter(r => !removals.has(r.id));
    const globalStart = p + (arrS - p);
    html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
    console.log(city + ': removed ' + removals.size + ' duplicates (' + before + ' → ' + arr.length + ')');
  } else {
    console.log(city + ': no duplicates to remove (' + before + ' entries)');
  }
  return html;
}

html = dedupeCity(html, 'const SLC_DATA=', 'SLC');
html = dedupeCity(html, 'const AUSTIN_DATA=', 'Austin');
html = dedupeCity(html, 'const HOUSTON_DATA=', 'Houston');
html = dedupeCity(html, 'const DALLAS_DATA=', 'Dallas');

// Chicago inline
const cdStart = html.indexOf('CITY_DATA');
const chiPos = html.indexOf("'Chicago':", cdStart);
const chiArrS = html.indexOf('[', chiPos);
let cd = 0, chiArrE = chiArrS;
for (let j = chiArrS; j < html.length; j++) {
  if (html[j] === '[') cd++;
  if (html[j] === ']') { cd--; if (cd === 0) { chiArrE = j + 1; break; } }
}
let chiArr = JSON.parse(html.substring(chiArrS, chiArrE));
const chiBefore = chiArr.length;
const normalize = (n) => n.toLowerCase().replace(/[''`]/g, "'").replace(/[^a-z0-9' ]/g, '').trim();
const chiRemovals = new Set();

for (let i = 0; i < chiArr.length; i++) {
  if (chiRemovals.has(chiArr[i].id)) continue;
  for (let j = i + 1; j < chiArr.length; j++) {
    if (chiRemovals.has(chiArr[j].id)) continue;
    const a = normalize(chiArr[i].name);
    const b = normalize(chiArr[j].name);
    const aContainsB = a.includes(b) || b.includes(a);
    const similarStart = a.substring(0, 8) === b.substring(0, 8);
    if (aContainsB || (similarStart && a.length > 5)) {
      const sameHood = chiArr[i].neighborhood === chiArr[j].neighborhood;
      const sameAddr = chiArr[i].address && chiArr[j].address &&
        chiArr[i].address.replace(/[^a-z0-9]/gi, '').substring(0, 15) === chiArr[j].address.replace(/[^a-z0-9]/gi, '').substring(0, 15);
      if (sameHood || sameAddr) {
        const scoreA = (chiArr[i].description || '').length + (chiArr[i].phone ? 10 : 0) + (chiArr[i].website ? 10 : 0);
        const scoreB = (chiArr[j].description || '').length + (chiArr[j].phone ? 10 : 0) + (chiArr[j].website ? 10 : 0);
        if (scoreA >= scoreB) chiRemovals.add(chiArr[j].id);
        else chiRemovals.add(chiArr[i].id);
      }
    }
  }
}
if (chiRemovals.size > 0) {
  chiArr = chiArr.filter(r => !chiRemovals.has(r.id));
  html = html.substring(0, chiArrS) + JSON.stringify(chiArr) + html.substring(chiArrE);
  console.log('Chicago: removed ' + chiRemovals.size + ' duplicates (' + chiBefore + ' → ' + chiArr.length + ')');
} else {
  console.log('Chicago: no duplicates to remove (' + chiBefore + ')');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDone!');
