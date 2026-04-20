const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

const CITIES = ['DALLAS','LA','SD','SLC','PHX','LV','NYC','SEATTLE','CHICAGO','AUSTIN','HOUSTON','SANANTONIO'];

function findArrBounds(constName) {
  const start = c.indexOf('const ' + constName + '_DATA');
  if (start < 0) return null;
  const arrStart = c.indexOf('[', start);
  let i = arrStart, depth = 0, inStr = false, esc = false;
  while (i < c.length) {
    const ch = c[i];
    if (esc) esc = false;
    else if (ch === '\\') esc = true;
    else if (ch === '"') inStr = !inStr;
    else if (!inStr) {
      if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return { arrStart, arrEnd: i }; }
    }
    i++;
  }
  return null;
}

function findCardEnd(fromIdx) {
  let d = 0, inStr = false, esc = false, started = false;
  for (let i = fromIdx; i < c.length; i++) {
    const ch = c[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') { d++; started = true; }
    else if (ch === '}') { d--; if (started && d === 0) return i; }
  }
  return -1;
}

const all = [];
const byCity = {};
for (const cty of CITIES) {
  const b = findArrBounds(cty);
  if (!b) { console.log(cty, 'NOT FOUND'); continue; }
  let scan = b.arrStart;
  let missing = 0, total = 0, short = 0;
  const cityList = [];
  while (scan < b.arrEnd) {
    let depth = 0, inStr = false, esc = false, cardStart = -1;
    for (let k = scan; k < b.arrEnd; k++) {
      const ch = c[k];
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{' && depth === 0) { cardStart = k; break; }
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (cardStart < 0) break;
    const cardEnd = findCardEnd(cardStart);
    if (cardEnd < 0 || cardEnd > b.arrEnd) break;
    const card = c.substring(cardStart, cardEnd + 1);
    total++;
    const nm = card.match(/"name":"([^"]*)"/);
    const addr = card.match(/"address":"([^"]*)"/);
    const idm = card.match(/"id":(\d+)/);
    const phm = card.match(/"photos":\[([^\]]*)\]/);
    let arr = []; if (phm) try { arr = JSON.parse('[' + phm[1] + ']'); } catch (e) {}
    if (arr.length === 0) {
      missing++;
      if (nm && addr && idm) {
        cityList.push({ city: cty, id: +idm[1], name: nm[1], address: addr[1] });
      }
    } else if (arr.length < 3) {
      short++;
    }
    scan = cardEnd + 1;
  }
  byCity[cty] = cityList.length;
  all.push(...cityList);
  console.log(cty.padEnd(14), 'total:', String(total).padStart(4), '| missing:', String(missing).padStart(4), '| scrape-queued:', String(cityList.length).padStart(4));
}

console.log('\nTOTAL MISSING QUEUED FOR SCRAPE:', all.length);

// Build Apify searchStringsArray format: "Restaurant Name, Address"
const searchStrings = all.map(r => `${r.name}, ${r.address}`);

fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/missing-cards-queue.json', JSON.stringify(all, null, 2));
fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/missing-search-strings.json', JSON.stringify(searchStrings, null, 2));
console.log('Wrote missing-cards-queue.json (', all.length, ') and missing-search-strings.json');
