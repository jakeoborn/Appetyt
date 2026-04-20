// Address-gated backfill — the killer combination.
// For every card currently WITHOUT photos, search ALL 2300 dataset items
// using loose matching (exact-norm, loose-norm, ≥1-token) and gate with address match.
// Addr match = same zip OR same street-num+street-name-token.
// Because address is the final gatekeeper, we can loosen the name matcher far more
// without introducing false positives. Also retroactively audits the previous
// fuzzy-backfill (commit 32eb365) and clears 35 wrong-branch matches.

const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const MANIFEST_OUT = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/gallery-address-backfill-applied.json';

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

function stripSuffix(s) { return (s||'').split(/\s*[—\|–]\s*/)[0]; }
function norm(s) { return stripSuffix(s).toLowerCase().replace(/['’`]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim(); }
function looseNorm(s) { return norm(s).split(' ').filter(t => t && !NOISE.has(t)).join(' '); }
function sigTokens(s) { return norm(s).split(' ').filter(t => t.length >= 3 && !NOISE.has(t)); }
function filterP(urls) { return (urls||[]).filter(u => typeof u==='string' && u.includes('/p/AF1Qip')); }

function extractZip(addr) { const m=(addr||'').match(/\b(\d{5})(?:-\d{4})?\b/); return m?m[1]:null; }
function extractStreetKey(addr) {
  if(!addr) return null;
  const seg=addr.split(',')[0].trim();
  const m=seg.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
  if(!m) return null;
  const street=m[2].toLowerCase().replace(/[#,].*$/,'').replace(/\b(ste|suite|unit|apt)\s*\w+\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  return { num: m[1], tokens: street.split(' ').filter(t=>t.length>=3) };
}
function addressMatch(cardAddr, itemAddr) {
  if(!cardAddr||!itemAddr) return null;
  const cz=extractZip(cardAddr), iz=extractZip(itemAddr);
  if(cz && iz && cz===iz) return 'zip';
  const cs=extractStreetKey(cardAddr), is=extractStreetKey(itemAddr);
  if(cs && is && cs.num===is.num){
    const shared=cs.tokens.filter(t=>is.tokens.includes(t));
    if(shared.length>=1) return 'street';
  }
  return null;
}

function findArrBounds(content, constName) {
  const start=content.indexOf('const '+constName);
  if(start<0) return null;
  const arrStart=content.indexOf('[',start);
  let i=arrStart,depth=0,inStr=false,esc=false;
  while(i<content.length){const ch=content[i];if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch==='"')inStr=!inStr;else if(!inStr){if(ch==='[')depth++;else if(ch===']'){depth--;if(depth===0)return {arrStart,arrEnd:i}}}i++;}
  return null;
}
function findCardEnd(content,fromIdx){let d=0,inStr=false,esc=false,started=false;for(let i=fromIdx;i<content.length;i++){const ch=content[i];if(esc){esc=false;continue;}if(ch==='\\'){esc=true;continue;}if(ch==='"'){inStr=!inStr;continue;}if(inStr)continue;if(ch==='{'){d++;started=true;}else if(ch==='}'){d--;if(started&&d===0)return i;}}return -1;}

// Load datasets
const RAW_FILES=['sd','dallas','chunkA','chunkB1','chunkB2'];
const allItems=[];
for(const f of RAW_FILES){
  const arr=JSON.parse(fs.readFileSync(`scripts/apify-runs-raw/data-${f}.json`,'utf8'));
  for(const it of arr){if(!it||!it.title)continue;allItems.push({title:it.title,address:it.address||'',photos:filterP(it.imageUrls).slice(0,10)});}
}
const items = allItems.filter(it => it.photos.length > 0);
console.log(`Loaded ${allItems.length} items (${items.length} with /p/ photos)`);

// Index dataset items by cityConst (from address) for scoped search
function cityFromAddr(addr){const parts=(addr||'').split(',').map(s=>s.trim());if(parts.length<2)return '';return parts[parts.length-2].replace(/\s+\d{5}.*/,'').trim();}
function cityConstForAddr(addr){const c=cityFromAddr(addr);for(const[k,list]of Object.entries(CITY_ADDR))if(list.includes(c))return k;return null;}
const itemsByCity = {};
for (const it of items) {
  const cc = cityConstForAddr(it.address);
  if (!cc) continue;
  (itemsByCity[cc] = itemsByCity[cc] || []).push(it);
}

// Load the manifest of the previous fuzzy-backfill so we know what was applied (for audit/clear)
const prevManifest = JSON.parse(fs.readFileSync('scripts/gallery-fuzzy-backfill-applied.json','utf8'));
const prevEditLookup = new Map();
for (const e of prevManifest.edits) prevEditLookup.set(`${e.city}|${e.id}`, e);

// Scan all cards in all cities. For each card:
//   1. If it has photos[] from prev fuzzy backfill that doesn't address-match → CLEAR
//   2. If it has no photos → try to find an address-matching dataset item → ADD
let content = fs.readFileSync(PATH, 'utf8');
const manifest = { timestamp: new Date().toISOString(), cleared: 0, added: 0, addedBreakdown: {exact:0, loose:0, multiToken:0, singleToken:0}, perCity: {}, added_edits: [], cleared_edits: [] };

for (const cityConst of CITIES) {
  const bounds = findArrBounds(content, cityConst);
  if (!bounds) continue;
  manifest.perCity[cityConst] = { cleared: 0, added: 0, examined: 0, stillEmpty: 0 };

  // Collect all cards
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
    const am = cardText.match(/"address":"([^"]*)"/);
    const pm = cardText.match(/(,"photos":\[[^\]]*\])/);
    const hasPhotos = pm && /\[[^\]]+\]/.test(pm[1].match(/\[([^\]]*)\]/)[0]) && pm[1].includes('"');
    cards.push({ start: cardStart, end: cardEnd, name: nm?nm[1]:null, id: idm?Number(idm[1]):null, address: am?am[1]:'', photosText: pm?pm[1]:null, hasPhotos });
    scan = cardEnd+1;
  }

  const cityItems = itemsByCity[cityConst] || [];
  const cityItemsByLoose = new Map();
  for (const it of cityItems) { const k=looseNorm(it.title); if(k){ if(!cityItemsByLoose.has(k)) cityItemsByLoose.set(k, []); cityItemsByLoose.get(k).push(it); }}
  const usedTitles = new Set();

  // Pass 1: for each card, if previous fuzzy backfill edited it AND addresses don't match, clear
  // Pass 2: for each card with NO photos, aggressive search with address gate
  // Process cards in REVERSE order to preserve offsets during mutations
  const ops = [];
  for (let ci = cards.length - 1; ci >= 0; ci--) {
    const card = cards[ci];
    if (!card.id || !card.name) { continue; }
    manifest.perCity[cityConst].examined++;

    // Pass 1 check: was this in prev fuzzy manifest?
    const prev = prevEditLookup.get(`${cityConst}|${card.id}`);
    if (prev && card.hasPhotos) {
      const addrOk = addressMatch(card.address, prev.address);
      if (!addrOk) {
        // CLEAR — this photos[] was a wrong-branch match
        if (card.photosText) {
          ops.push({ kind: 'clear', cardStart: card.start, old: card.photosText, card });
          manifest.cleared_edits.push({ city: cityConst, id: card.id, name: card.name, cardAddr: card.address, wrongMatch: prev.datasetTitle, wrongAddr: prev.address });
          manifest.perCity[cityConst].cleared++; manifest.cleared++;
        }
        card.hasPhotos = false; // treat as empty for Pass 2
      }
    }

    // Pass 2: if card still empty, aggressive search
    if (card.hasPhotos) continue;
    if (!card.address) continue; // can't gate without address

    const cardLoose = looseNorm(card.name);
    const cardTokens = sigTokens(card.name);

    // Candidates, ordered by specificity. NO single-token matching — it produces false
    // positives at multi-tenant complexes (Caesars Palace, malls, etc.) even with zip match.
    const candPool = [];
    const cardFirst = cardTokens[0] || null; // card's primary/brand token
    if (cardLoose && cityItemsByLoose.has(cardLoose)) for (const it of cityItemsByLoose.get(cardLoose)) candPool.push({it,kind:'loose'});
    // Multi-token: ≥2 shared significant tokens AND exact first-sig-token equality (brand anchor).
    // Exact brand-token match prevents common-word collisions (e.g. "Little Italy Food Hall" vs
    // "Davanti Enoteca Little Italy" — both share "little italy" tokens but first-tokens differ).
    if (cardTokens.length >= 2 && cardFirst) {
      for (const it of cityItems) {
        const it_t = sigTokens(it.title);
        if (it_t[0] !== cardFirst) continue; // hard brand anchor
        const shared = cardTokens.filter(t => it_t.includes(t)).length;
        if (shared < 2) continue;
        candPool.push({it,kind:'multiToken'});
      }
    }

    // Dedupe while preserving order
    const seen = new Set();
    const cands = [];
    for (const c of candPool) { const k=c.it.title+'|'+c.it.address; if(!seen.has(k)){seen.add(k);cands.push(c);} }

    // Find first candidate that passes address gate AND isn't already used
    let pick = null;
    for (const c of cands) {
      if (usedTitles.has(c.it.title)) continue;
      const am = addressMatch(card.address, c.it.address);
      if (am) { pick = { ...c, addrReason: am }; break; }
    }

    if (pick) {
      usedTitles.add(pick.it.title);
      const insertion = ',"photos":'+JSON.stringify(pick.it.photos);
      ops.push({ kind: 'add', insertAt: card.end, text: insertion, card, pick });
      manifest.added_edits.push({ city: cityConst, id: card.id, name: card.name, cardAddr: card.address, datasetTitle: pick.it.title, datasetAddr: pick.it.address, count: pick.it.photos.length, photos: pick.it.photos, matchKind: pick.kind, addrReason: pick.addrReason });
      manifest.perCity[cityConst].added++; manifest.added++; manifest.addedBreakdown[pick.kind]++;
    } else {
      manifest.perCity[cityConst].stillEmpty++;
    }
  }

  // Apply ops (already in descending order since we iterated cards reverse)
  for (const op of ops) {
    if (op.kind === 'clear') {
      const idx = content.indexOf(op.old, op.cardStart);
      if (idx >= 0) content = content.substring(0, idx) + content.substring(idx + op.old.length);
    } else if (op.kind === 'add') {
      content = content.substring(0, op.insertAt) + op.text + content.substring(op.insertAt);
    }
  }
  console.log(cityConst.padEnd(16),
    '| cleared:', String(manifest.perCity[cityConst].cleared).padStart(3),
    '| added:', String(manifest.perCity[cityConst].added).padStart(4),
    '| stillEmpty:', String(manifest.perCity[cityConst].stillEmpty).padStart(4));
}

console.log('\n=== TOTALS ===');
console.log('Cleared (wrong-branch from prev fuzzy):', manifest.cleared);
console.log('Added (address-gated new matches):     ', manifest.added);
console.log('  loose:', manifest.addedBreakdown.loose, '| multiToken:', manifest.addedBreakdown.multiToken, '| singleToken:', manifest.addedBreakdown.singleToken);

const DRY_RUN = process.env.DRY_RUN === '1';
if (!DRY_RUN) {
  for (let t=0;t<3;t++){try{fs.writeFileSync(PATH, content, 'utf8');break;}catch(e){if(t===2)throw e;}}
  console.log('index.html UPDATED');
} else {
  console.log('[DRY RUN]');
}
fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Manifest at', MANIFEST_OUT);
