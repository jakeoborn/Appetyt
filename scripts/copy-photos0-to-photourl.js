// For every card in CITY_DATA consts with photos[0] valid but photoUrl missing/empty,
// copy photos[0] into photoUrl. Collects ALL edits across all cities, applies in one
// end-to-start pass so string rebuilds don't blow heap.

const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const MANIFEST = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/photourl-from-photos0-applied.json';

const CITIES = ['DALLAS_DATA','SD_DATA','PHX_DATA','LV_DATA','LA_DATA','SLC_DATA','AUSTIN_DATA','SEATTLE_DATA','CHICAGO_DATA','HOUSTON_DATA','NYC_DATA','SANANTONIO_DATA'];

function findArrBounds(content, constName) {
  const start = content.indexOf('const '+constName);
  if(start<0) return null;
  const arrStart = content.indexOf('[',start);
  let i=arrStart,depth=0,inStr=false,esc=false;
  while(i<content.length){const ch=content[i];if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch==='"')inStr=!inStr;else if(!inStr){if(ch==='[')depth++;else if(ch===']'){depth--;if(depth===0)return {arrStart,arrEnd:i}}}i++;}
  return null;
}
function findCardEnd(c,from){let d=0,s=false,e=false,t=false;for(let i=from;i<c.length;i++){const ch=c[i];if(e){e=false;continue;}if(ch==='\\'){e=true;continue;}if(ch==='"'){s=!s;continue;}if(s)continue;if(ch==='{'){d++;t=true;}else if(ch==='}'){d--;if(t&&d===0)return i;}}return -1;}

const content = fs.readFileSync(PATH,'utf8');
const manifest = { timestamp: new Date().toISOString(), perCity: {}, edits: [] };

// Collect ALL edits: either {type:'replace', start, end, text} or {type:'insert', at, text}
const allEdits = [];

for (const cityConst of CITIES) {
  const b = findArrBounds(content, cityConst);
  if (!b) continue;
  let added = 0, updated = 0;

  let scan = b.arrStart;
  while (scan < b.arrEnd) {
    let depth=0,inStr=false,esc=false,cardStart=-1;
    for (let k=scan;k<b.arrEnd;k++){const ch=content[k];if(esc){esc=false;continue;}if(ch==='\\'){esc=true;continue;}if(ch==='"'){inStr=!inStr;continue;}if(inStr)continue;if(ch==='{'&&depth===0){cardStart=k;break;}if(ch==='{')depth++;else if(ch==='}')depth--;}
    if (cardStart<0) break;
    const cardEnd = findCardEnd(content, cardStart);
    if (cardEnd<0||cardEnd>b.arrEnd) break;

    // Use substring only for short card text
    const cardText = content.substring(cardStart, cardEnd+1);

    const photosM = cardText.match(/"photos":\[([^\]]*)\]/);
    if (photosM) {
      const firstM = photosM[1].match(/"(https?:\/\/[^"]+)"/);
      if (firstM) {
        const photo0 = firstM[1];
        const photoUrlRegex = /"photoUrl":"([^"]*)"/;
        const photoUrlM = cardText.match(photoUrlRegex);
        const hasValid = photoUrlM && photoUrlM[1] && /^https?:\/\//.test(photoUrlM[1]);
        if (!hasValid) {
          if (photoUrlM) {
            // Replace the empty photoUrl field value with photo0
            const oldStr = '"photoUrl":"' + photoUrlM[1] + '"';
            const newStr = '"photoUrl":"' + photo0 + '"';
            const relIdx = cardText.indexOf(oldStr);
            if (relIdx >= 0) {
              allEdits.push({ type:'replace', start: cardStart + relIdx, end: cardStart + relIdx + oldStr.length, text: newStr, city: cityConst });
              updated++;
            }
          } else {
            // Insert new field just before closing brace
            allEdits.push({ type:'insert', at: cardEnd, text: ',"photoUrl":"' + photo0 + '"', city: cityConst });
            added++;
          }
        }
      }
    }
    scan = cardEnd + 1;
  }

  manifest.perCity[cityConst] = { added, updated };
  console.log(cityConst.padEnd(16), 'added:', String(added).padStart(4), 'updated:', String(updated).padStart(4));
}

// Apply all edits end-to-start in a single pass using array join
allEdits.sort((a,b) => {
  const pa = a.type === 'insert' ? a.at : a.start;
  const pb = b.type === 'insert' ? b.at : b.start;
  return pb - pa;
});

console.log('\nTotal edits to apply:', allEdits.length);

// Splice once using array of pieces — avoids N 11MB string copies that blow heap.
// Sort edits ascending position; build pieces = [content_before_edit1, edit1_text, content_between_edit1_and_edit2, edit2_text, ...]
const sortedAsc = [...allEdits].sort((a,b) => {
  const pa = a.type === 'insert' ? a.at : a.start;
  const pb = b.type === 'insert' ? b.at : b.start;
  return pa - pb;
});
const pieces = [];
let cursor = 0;
for (const edit of sortedAsc) {
  const editStart = edit.type === 'insert' ? edit.at : edit.start;
  const editEnd = edit.type === 'insert' ? edit.at : edit.end;
  pieces.push(content.substring(cursor, editStart));
  pieces.push(edit.text);
  cursor = editEnd;
}
pieces.push(content.substring(cursor));
const result = pieces.join('');

// Save
manifest.edits = allEdits.map(e => ({ city: e.city, type: e.type, text: e.text }));
const DRY = process.env.DRY_RUN === '1';
if (!DRY) {
  for (let t=0;t<3;t++){try{fs.writeFileSync(PATH, result, 'utf8');break;}catch(e){if(t===2)throw e;}}
  console.log('index.html WRITTEN ('+allEdits.length+' edits)');
} else {
  console.log('[DRY RUN — content would change by '+(result.length-content.length)+' chars]');
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Manifest at', MANIFEST);
