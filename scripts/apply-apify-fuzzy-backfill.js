// Fuzzy recovery pass — Bucket A from the no-match analysis.
// Reuses the 5 raw datasets, loosens the title matcher:
//   1) loose-norm match (strip noise tokens + city suffix) within same city
//   2) token-subset match (≥2 significant tokens ≥4 chars) within same city
// Keeps /p/-only filter. City disambiguation via address.

const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const MANIFEST_PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/gallery-fuzzy-backfill-applied.json';

const CITY_ADDR = {
  DALLAS_DATA:['Dallas','Plano','Carrollton','Addison','Frisco','Richardson','Irving','Garland','Mesquite','Grand Prairie','Allen','McKinney','Rowlett','Farmers Branch','University Park','Highland Park','Lewisville','Flower Mound','Coppell','Euless'],
  SD_DATA:['San Diego','La Jolla','Del Mar','Coronado','Carlsbad','Encinitas','Oceanside','Poway','Solana Beach','Escondido','Chula Vista','Cardiff','La Mesa','Bonita','Imperial Beach','Rancho Santa Fe','Leucadia','Ramona','Vista','4S Ranch','Rancho Bernardo','Lemon Grove','Santee','El Cajon'],
  PHX_DATA:['Phoenix','Scottsdale','Tempe','Mesa','Chandler','Gilbert','Glendale','Peoria','Surprise','Paradise Valley','Fountain Hills','Ahwatukee','Goodyear','Avondale','Queen Creek','Cave Creek','Carefree','Sun City','Litchfield Park','Anthem'],
  LV_DATA:['Las Vegas','Henderson','Paradise','North Las Vegas','Summerlin','Boulder City'],
  LA_DATA:['Los Angeles','Beverly Hills','Santa Monica','West Hollywood','Pasadena','Culver City','Venice','Hollywood','Burbank','Hawthorne','Glendale','Long Beach','Alhambra','Marina Del Rey','Marina del Rey','El Segundo','Inglewood','Studio City','Sherman Oaks','North Hollywood','Torrance','Manhattan Beach','Hermosa Beach','Redondo Beach','Highland Park','Echo Park','Silver Lake','Arcadia','Monterey Park','San Gabriel'],
  SLC_DATA:['Salt Lake City','Park City','Provo','South Salt Lake','Midvale','Murray','Sandy','West Valley City','West Jordan','Holladay','Millcreek','Cottonwood Heights','Draper','Lehi','American Fork'],
  AUSTIN_DATA:['Austin','Round Rock','Cedar Park','Pflugerville','Georgetown','Bee Cave','Westlake','Lakeway'],
  SEATTLE_DATA:['Seattle','Bellevue','Kirkland','Redmond','Renton','Tukwila','Mercer Island','Shoreline'],
  CHICAGO_DATA:['Chicago','Evanston','Oak Park','Skokie','Cicero','Berwyn','Wilmette','Winnetka'],
  HOUSTON_DATA:['Houston','Sugar Land','The Woodlands','Katy','Pearland','Missouri City','Bellaire','West University Place','Spring','Humble'],
  NYC_DATA:['New York','Brooklyn','Manhattan','Queens','Bronx','Staten Island','Astoria','Long Island City','Flushing','Jersey City','Hoboken'],
  SANANTONIO_DATA:['San Antonio','Alamo Heights','Helotes','Leon Valley','Windcrest','Schertz','Boerne'],
};
const CITIES = Object.keys(CITY_ADDR);

const NOISE = new Set(['the','restaurant','cafe','grill','bar','kitchen','and','co','company','eatery','house','pub','lounge','steakhouse','pizzeria','bistro','brewery','brewing','lv','las','vegas','phoenix','phx','sd','san','diego','la','los','angeles','dallas','austin','slc','seattle','chicago','houston','nyc','new','york','sa','antonio']);

// Strip neighborhood/qualifier suffixes from card names. Cards often end with " — Neighborhood" or " | Branch".
// Keeping only the primary business name prevents matching on the neighborhood tokens alone.
function stripSuffix(s) {
  if (!s) return '';
  return s.split(/\s*[—\|–]\s*/)[0];
}
function norm(s) { return stripSuffix(s||'').toLowerCase().replace(/['’`]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim(); }
function looseNorm(s) {
  return norm(s).split(' ').filter(t => t && !NOISE.has(t)).join(' ');
}
function sigTokens(s) { return norm(s).split(' ').filter(t => t.length >= 4 && !NOISE.has(t)); }

function cityFromAddress(addr) {
  if (!addr) return '';
  const parts = addr.split(',').map(s => s.trim());
  if (parts.length < 2) return '';
  return parts[parts.length - 2].replace(/\s+\d{5}.*/, '').trim();
}
function cityConstForAddress(addr) {
  const c = cityFromAddress(addr);
  if (!c) return null;
  for (const [k, list] of Object.entries(CITY_ADDR)) if (list.includes(c)) return k;
  return null;
}
function filterP(urls) { return (urls||[]).filter(u => typeof u==='string' && u.includes('/p/AF1Qip')); }

function findArrBounds(content, constName) {
  const start = content.indexOf('const '+constName);
  if(start<0) return null;
  const arrStart = content.indexOf('[',start);
  let i=arrStart,depth=0,inStr=false,esc=false;
  while(i<content.length){const ch=content[i];if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch==='"')inStr=!inStr;else if(!inStr){if(ch==='[')depth++;else if(ch===']'){depth--;if(depth===0)return {arrStart,arrEnd:i}}}i++;}
  return null;
}
function findCardEnd(content,fromIdx){let d=0,inStr=false,esc=false,started=false;for(let i=fromIdx;i<content.length;i++){const ch=content[i];if(esc){esc=false;continue;}if(ch==='\\'){esc=true;continue;}if(ch==='"'){inStr=!inStr;continue;}if(inStr)continue;if(ch==='{'){d++;started=true;}else if(ch==='}'){d--;if(started&&d===0)return i;}}return -1;}

// Load datasets with /p/-filtered photos, build per-city index keyed by (exact-norm, loose-norm)
const RAW_FILES = ['sd','dallas','chunkA','chunkB1','chunkB2'];
const itemsByCityAndNorm = {}; // cityConst → Map(norm → [items])
const itemsByCityAndLoose = {}; // cityConst → Map(loose → [items])
const itemsByCity = {};        // cityConst → [items]  (for token matching)
let totalLoaded=0, totalFilteredZero=0;

for (const f of RAW_FILES) {
  const arr = JSON.parse(fs.readFileSync(`C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/apify-runs-raw/data-${f}.json`,'utf8'));
  for (const it of arr) {
    if (!it || !it.title) continue;
    const photos = filterP(it.imageUrls);
    totalLoaded++;
    if (photos.length === 0) { totalFilteredZero++; continue; }
    const cityConst = cityConstForAddress(it.address||'');
    if (!cityConst) continue;
    const rec = { title: it.title, address: it.address||'', photos: photos.slice(0,10), cityConst };
    if (!itemsByCity[cityConst]) { itemsByCity[cityConst] = []; itemsByCityAndNorm[cityConst] = new Map(); itemsByCityAndLoose[cityConst] = new Map(); }
    itemsByCity[cityConst].push(rec);
    const nk = norm(it.title);
    if (nk) {
      if (!itemsByCityAndNorm[cityConst].has(nk)) itemsByCityAndNorm[cityConst].set(nk, []);
      itemsByCityAndNorm[cityConst].get(nk).push(rec);
    }
    const lk = looseNorm(it.title);
    if (lk) {
      if (!itemsByCityAndLoose[cityConst].has(lk)) itemsByCityAndLoose[cityConst].set(lk, []);
      itemsByCityAndLoose[cityConst].get(lk).push(rec);
    }
  }
}
console.log(`Loaded ${totalLoaded} items total. ${totalFilteredZero} dropped (no /p/ photos).`);
console.log(`Items bucketed by city:`, Object.fromEntries(CITIES.map(c => [c, (itemsByCity[c]||[]).length])));

let content = fs.readFileSync(PATH,'utf8');
const manifest = { timestamp: new Date().toISOString(), filter: '/p/ only + fuzzy match (loose-norm + token-subset)', source: '5 Apify partial runs 2026-04-20 — Bucket A fuzzy recovery', edits: [], perCity: {}, missed: [] };

for (const cityConst of CITIES) {
  const bounds = findArrBounds(content, cityConst);
  if (!bounds) continue;
  const cards = [];
  let scan = bounds.arrStart;
  while (scan < bounds.arrEnd) {
    let depth=0,inStr=false,esc=false,cardStart=-1;
    for (let k=scan;k<bounds.arrEnd;k++){const ch=content[k];if(esc){esc=false;continue;}if(ch==='\\'){esc=true;continue;}if(ch==='"'){inStr=!inStr;continue;}if(inStr)continue;if(ch==='{'&&depth===0){cardStart=k;break;}if(ch==='{')depth++;else if(ch==='}')depth--;}
    if (cardStart<0) break;
    const cardEnd = findCardEnd(content, cardStart);
    if (cardEnd<0||cardEnd>bounds.arrEnd) break;
    const cardText = content.substring(cardStart, cardEnd+1);
    const nm = cardText.match(/"name":"([^"]*)"/);
    const idm = cardText.match(/"id":(\d+)/);
    const pm = cardText.match(/"photos":\[([^\]]*)\]/);
    const hasPhotos = pm && pm[1].trim().length > 0;
    cards.push({ start: cardStart, end: cardEnd, name: nm?nm[1]:null, id: idm?Number(idm[1]):null, hasPhotos });
    scan = cardEnd+1;
  }

  // Build a per-city used-set so one dataset item isn't assigned to multiple cards
  const usedTitles = new Set();
  const cityItems = itemsByCity[cityConst] || [];
  const byNorm = itemsByCityAndNorm[cityConst] || new Map();
  const byLoose = itemsByCityAndLoose[cityConst] || new Map();

  // Precompute dataset item tokens within city
  const itemTokens = cityItems.map(it => ({ it, tokens: sigTokens(it.title) }));

  const insertions = [];
  let applied=0, skipped=0, noMatch=0;
  let matchKind = { loose:0, token:0 };
  for (const card of cards) {
    if (card.hasPhotos) { skipped++; continue; }
    if (!card.name) { noMatch++; continue; }

    const nn = norm(card.name), ln = looseNorm(card.name);

    // 1) skip if already would have matched exact (handled by previous backfill)
    let pick = null, kind = null;
    // 2) loose match (only if unique after removing already-used)
    if (ln && byLoose.has(ln)) {
      const candidates = byLoose.get(ln).filter(r => !usedTitles.has(r.title));
      if (candidates.length === 1) { pick = candidates[0]; kind = 'loose'; }
    }
    // 3) token-subset match — ≥2 shared significant tokens AND substring containment of looseNorm in either direction
    if (!pick) {
      const ct = sigTokens(card.name);
      if (ct.length >= 1) {
        let best=null, bestScore=0, bestTie=false;
        for (const { it, tokens } of itemTokens) {
          if (usedTitles.has(it.title)) continue;
          const shared = ct.filter(t => tokens.includes(t)).length;
          const minReq = Math.max(2, Math.min(ct.length, tokens.length));  // need ≥2, up to min length
          if (shared < 2) continue;
          // Additionally require that the loose-norms are substrings of each other (prefix/suffix/addons)
          const il = looseNorm(it.title);
          const substrOk = il && ln && (il.includes(ln) || ln.includes(il));
          if (!substrOk) continue;
          if (shared > bestScore) { best = it; bestScore = shared; bestTie=false; }
          else if (shared === bestScore) bestTie = true;
        }
        if (best && !bestTie) { pick = best; kind = 'token'; }
      }
    }

    if (!pick) { noMatch++; continue; }
    usedTitles.add(pick.title);
    matchKind[kind]++;
    insertions.push({ at: card.end, text: ',"photos":'+JSON.stringify(pick.photos), cardId: card.id, name: card.name, datasetTitle: pick.title, address: pick.address, count: pick.photos.length, photos: pick.photos, kind });
    applied++;
  }

  insertions.sort((a,b) => b.at - a.at);
  for (const ins of insertions) {
    content = content.substring(0, ins.at) + ins.text + content.substring(ins.at);
    manifest.edits.push({ city: cityConst, id: ins.cardId, name: ins.name, datasetTitle: ins.datasetTitle, address: ins.address, count: ins.count, photos: ins.photos, kind: ins.kind });
  }

  manifest.perCity[cityConst] = { cardsScanned: cards.length, applied, alreadyHadPhotos: skipped, noMatch, loose: matchKind.loose, token: matchKind.token };
  console.log(cityConst.padEnd(16),
    'cards:', String(cards.length).padStart(4),
    '| applied:', String(applied).padStart(4),
    '(loose:', String(matchKind.loose).padStart(3),
    'token:', String(matchKind.token).padStart(3) + ')',
    '| already:', String(skipped).padStart(4),
    '| noMatch:', String(noMatch).padStart(4));
}

const DRY_RUN = process.env.DRY_RUN === '1';
if (!DRY_RUN) {
  for (let tries = 0; tries < 3; tries++) {
    try { fs.writeFileSync(PATH, content, 'utf8'); break; }
    catch (e) { if (tries === 2) throw e; console.log('write retry', tries+1, e.message); }
  }
  console.log('index.html WRITTEN');
} else {
  console.log('[DRY RUN — index.html untouched]');
}
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log('\nTOTAL APPLIED:', manifest.edits.length);
console.log('Manifest at', MANIFEST_PATH);
