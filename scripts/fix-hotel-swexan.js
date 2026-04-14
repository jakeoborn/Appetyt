const fs=require('fs');
let h=fs.readFileSync('index.html','utf8');

// 1. Change Stillwell's and Babou's group from 'Hotel Swexan' to 'Harwood Hospitality Group' in DALLAS_DATA (JSON format)
const r1 = h.replace(
  /("name":"Stillwell's"[\s\S]*?)"group":"Hotel Swexan"/,
  '$1"group":"Harwood Hospitality Group"'
);
const r2 = r1.replace(
  /("name":"Babou's"[\s\S]*?)"group":"Hotel Swexan"/,
  '$1"group":"Harwood Hospitality Group"'
);
const changed = r2 !== h;
h = r2;
console.log('Group field changes:', changed ? 'applied' : 'NO CHANGE');

// 2. Remove Hotel Swexan enrichment from HOSPITALITY_GROUPS
const hsStart = h.indexOf(",\n    'Hotel Swexan':");
if (hsStart >= 0) {
  const objStart = h.indexOf('{', hsStart);
  let d = 0, inS = false, sC = '', esc = false, end = -1;
  for (let i = objStart; i < h.length; i++) {
    const c = h[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inS) { if (c === sC) inS = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inS = true; sC = c; continue; }
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) { end = i + 1; break; } }
  }
  if (end > 0) {
    h = h.substring(0, hsStart) + h.substring(end);
    console.log('Removed Hotel Swexan entry from HOSPITALITY_GROUPS');
  }
} else {
  console.log('Hotel Swexan entry not found in HOSPITALITY_GROUPS');
}

// 3. Add Stillwell's and Babou's to Harwood Hospitality Group's restaurants list if not already there
const hhIdx = h.indexOf("'Harwood Hospitality Group':{");
if (hhIdx >= 0) {
  const rIdx = h.indexOf("restaurants:[", hhIdx);
  if (rIdx >= 0) {
    const rEnd = h.indexOf(']', rIdx);
    const currentList = h.substring(rIdx + 13, rEnd);
    if (!currentList.includes("Stillwell")) {
      const insertion = ",'Stillwell\\'s','Babou\\'s'";
      h = h.substring(0, rEnd) + insertion + h.substring(rEnd);
      console.log('Added Stillwell\'s and Babou\'s to Harwood restaurants list');
    } else {
      console.log('Stillwell already in Harwood list');
    }
  }
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Done');
