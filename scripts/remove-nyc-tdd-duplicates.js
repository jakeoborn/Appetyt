// Remove 8 Entertainment-cuisine entries from NYC_DATA that duplicate CITY_EXTRAS thingsToDo.
// Uses brace-counting (NOT regex) to safely identify each entry's boundaries.
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

const namesToRemove = [
  'Little Island',
  'Edge Observation Deck',
  'SUMMIT One Vanderbilt',
  '9/11 Memorial & Museum',
  'Brooklyn Bridge Walk',
  'Staten Island Ferry',
  'Governors Island Ferry & Bike',
  'Broadway Theater District'
];

// Locate NYC_DATA bounds so we only operate within it
const nycMarker = 'const NYC_DATA = ';
const nycStart = html.indexOf(nycMarker);
if(nycStart < 0){ console.error('NYC_DATA not found'); process.exit(1); }
const nycArrStart = html.indexOf('[', nycStart);
let depth=0, nycArrEnd=nycArrStart;
for(let j=nycArrStart;j<html.length;j++){
  if(html[j]==='[')depth++;
  if(html[j]===']'){depth--; if(depth===0){nycArrEnd=j+1;break;}}
}
console.log('NYC_DATA range:', nycArrStart, '-', nycArrEnd, '(', nycArrEnd-nycArrStart, 'chars )');

let removed = 0;
let removedChars = 0;

for(const name of namesToRemove){
  // Find the entry by searching name:"X" within NYC_DATA range. After re-finds, range shifts.
  const refreshNycRange = ()=>{
    const ns = html.indexOf(nycMarker);
    const arrS = html.indexOf('[', ns);
    let d=0, e=arrS;
    for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){e=j+1;break;}}}
    return [arrS, e];
  };
  const [arrS, arrE] = refreshNycRange();
  const region = html.substring(arrS, arrE);
  // Find pattern `name:"NAME"` (escape special chars in NAME)
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const namePat = new RegExp('name:"' + escName + '"');
  const m = namePat.exec(region);
  if(!m){ console.log('NOT FOUND:', name); continue; }
  const nameAbsIdx = arrS + m.index;
  // Walk backward from nameAbsIdx to find the opening `{` of this entry
  let openIdx = -1;
  for(let i=nameAbsIdx; i>=arrS; i--){
    if(html[i]==='{'){
      openIdx = i;
      break;
    }
  }
  if(openIdx<0){ console.log('Open brace not found for:', name); continue; }
  // Walk forward from openIdx counting braces, ignoring chars inside strings
  let dep=0, closeIdx=-1, inStr=false, strCh='';
  for(let i=openIdx; i<arrE; i++){
    const c=html[i];
    if(inStr){
      if(c==='\\'){ i++; continue; }
      if(c===strCh) inStr=false;
      continue;
    }
    if(c==='"' || c==="'"){ inStr=true; strCh=c; continue; }
    if(c==='{') dep++;
    else if(c==='}'){ dep--; if(dep===0){ closeIdx=i; break; } }
  }
  if(closeIdx<0){ console.log('Close brace not found for:', name); continue; }
  // Include trailing `,` if present (so we don't leave a dangling comma)
  let endIdx = closeIdx + 1;
  if(html[endIdx] === ',') endIdx++;
  const entryLen = endIdx - openIdx;
  // Sanity check: entry should be < 5KB
  if(entryLen > 5000){
    console.log('SUSPICIOUS LENGTH for', name, '-', entryLen, 'chars. Skipping.');
    continue;
  }
  html = html.substring(0, openIdx) + html.substring(endIdx);
  removed++;
  removedChars += entryLen;
  console.log('Removed:', name, '(', entryLen, 'chars )');
}

console.log('\nTotal removed:', removed, '/ ', namesToRemove.length, '|', removedChars, 'chars total');
fs.writeFileSync('index.html', html, 'utf8');
