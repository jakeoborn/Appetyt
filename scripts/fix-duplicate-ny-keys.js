const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// The problem: each data structure has TWO 'new york' keys.
// Our new data was inserted BEFORE dallas, but old data exists AFTER dallas.
// JS uses the LAST key, so old data wins. We need to remove the old duplicates.

function removeDuplicateNYKey(html, dataName) {
  const dataIdx = html.indexOf('const ' + dataName);

  // Find the FIRST 'new york' (our new data)
  const firstNY = html.indexOf("'new york':", dataIdx);

  // Find the SECOND 'new york' (old data to remove)
  const secondNY = html.indexOf("'new york':", firstNY + 100);

  // Make sure secondNY is still within this data structure
  // Find the end of this data structure (the };)
  const nextConst = html.indexOf('\nconst ', dataIdx + 10);

  if(secondNY === -1 || secondNY > nextConst) {
    console.log(dataName + ': only one new york key, OK');
    return html;
  }

  console.log(dataName + ': found duplicate new york at offset', secondNY);

  // Find the array for the second 'new york' key
  const arrStart = html.indexOf('[', secondNY);
  let depth = 0, arrEnd = arrStart;
  for(let j = arrStart; j < html.length; j++) {
    if(html[j] === '[') depth++;
    if(html[j] === ']') { depth--; if(depth === 0) { arrEnd = j + 1; break; } }
  }

  // Check what's in this old array
  try {
    const oldArr = JSON.parse(html.substring(arrStart, arrEnd));
    console.log('  Old array has', oldArr.length, 'items:', oldArr.map(x=>x.name).slice(0,5).join(', '));
  } catch(e) {
    console.log('  Could not parse old array');
  }

  // Remove the duplicate: from "'new york': [...]" including the trailing comma
  // We need to remove from the 'new york' key to the end of its array + comma
  let removeEnd = arrEnd;
  // Skip any trailing comma and whitespace
  while(removeEnd < html.length && (html[removeEnd] === ',' || html[removeEnd] === ' ' || html[removeEnd] === '\n' || html[removeEnd] === '\r')) {
    removeEnd++;
  }

  // Also need to handle the leading comma before 'new york'
  let removeStart = secondNY;
  // Walk backwards to find and include the leading comma
  let ptr = removeStart - 1;
  while(ptr > 0 && (html[ptr] === ' ' || html[ptr] === '\n' || html[ptr] === '\r' || html[ptr] === ',')) {
    if(html[ptr] === ',') { removeStart = ptr; break; }
    ptr--;
  }

  const removed = html.substring(removeStart, removeEnd);
  console.log('  Removing', removed.length, 'chars');

  html = html.substring(0, removeStart) + html.substring(removeEnd);

  // Verify only one 'new york' remains
  const newDataIdx = html.indexOf('const ' + dataName);
  const newNextConst = html.indexOf('\nconst ', newDataIdx + 10);
  const chunk = html.substring(newDataIdx, newNextConst > 0 ? newNextConst : newDataIdx + 500000);
  const remaining = (chunk.match(/'new york'/g) || []).length;
  console.log('  Remaining new york keys:', remaining);

  return html;
}

html = removeDuplicateNYKey(html, 'HOTEL_DATA');
html = removeDuplicateNYKey(html, 'MALL_DATA');
html = removeDuplicateNYKey(html, 'PARK_DATA');
html = removeDuplicateNYKey(html, 'MUSEUM_DATA');

// Verify final counts
console.log('\n=== VERIFICATION ===');
['HOTEL_DATA','MALL_DATA','PARK_DATA','MUSEUM_DATA'].forEach(name => {
  const idx = html.indexOf('const ' + name);
  const nyIdx = html.indexOf("'new york':", idx);
  if(nyIdx === -1) { console.log(name + ': NO new york!'); return; }
  const arrStart = html.indexOf('[', nyIdx);
  let depth=0, arrEnd=arrStart;
  for(let j=arrStart;j<html.length;j++){
    if(html[j]==='[') depth++;
    if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
  }
  try {
    const arr = JSON.parse(html.substring(arrStart, arrEnd));
    console.log(name + '[new york]:', arr.length, 'items');
  } catch(e) {
    console.log(name + '[new york]: PARSE ERROR');
  }
});

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('\nDone!');
