// For every card whose photoUrl matches our "bad" heuristic (logo/social-share/og-image/etc),
// replace it with the first GOOD photo from the same card's photos[] array.
// Skip if no good photo exists.
//
// Set DRY_RUN=1 to preview without writing.
const fs = require('fs');
const PATH = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const MANIFEST = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/replace-bad-photourls-applied.json';
const DRY = process.env.DRY_RUN === '1';

const CITIES = ['DALLAS_DATA','SD_DATA','PHX_DATA','LV_DATA','LA_DATA','SLC_DATA','AUSTIN_DATA','SEATTLE_DATA','CHICAGO_DATA','HOUSTON_DATA','NYC_DATA','SANANTONIO_DATA','MIAMI_DATA','CHARLOTTE_DATA'];

const BAD_PARTS = [
  'socialshare','social-share','social_share',
  'wordmark','word-mark',
  'og-image','og_image','ogimage',
  'meta-image','meta_image','metaimage',
  'matashare',
  '_logo','-logo','logo_','logo-','/logo.','logomark',
  'open-graph','open_graph','opengraph',
  'facebook-image','fb-share',
  'twitter-card','twitter_card',
];

function isBad(url) {
  if (!url) return 'empty';
  const l = url.toLowerCase();
  if (/squarespace\.com\/.*\/\d+\/?$/.test(l) && !/\.(png|jpg|jpeg|webp|gif)/i.test(l)) return 'empty-squarespace';
  for (const p of BAD_PARTS) if (l.includes(p)) return 'fn:' + p;
  if (l.includes('squarespace.com') && /\.png(\?|$)/.test(l)) return 'sq-png';
  if (l.includes('logo') && /\.(png|svg)(\?|$)/.test(l)) return 'logo-file';
  return null;
}

function findArrBounds(content, constName) {
  const start = content.indexOf('const ' + constName);
  if (start < 0) return null;
  const arrStart = content.indexOf('[', start);
  let i = arrStart, depth = 0, inStr = false, esc = false;
  while (i < content.length) {
    const ch = content[i];
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

function findCardEnd(c, from) {
  let d = 0, s = false, e = false, t = false;
  for (let i = from; i < c.length; i++) {
    const ch = c[i];
    if (e) { e = false; continue; }
    if (ch === '\\') { e = true; continue; }
    if (ch === '"') { s = !s; continue; }
    if (s) continue;
    if (ch === '{') { d++; t = true; }
    else if (ch === '}') { d--; if (t && d === 0) return i; }
  }
  return -1;
}

function extractPhotos(card) {
  const m = card.match(/"photos":\[([^\]]*)\]/);
  if (!m) return [];
  const urls = [];
  const re = /"(https?:\/\/[^"]+)"/g;
  let mm;
  while ((mm = re.exec(m[1])) !== null) urls.push(mm[1]);
  return urls;
}

const content = fs.readFileSync(PATH, 'utf8');
const allEdits = [];
const log = { perCity: {}, swaps: [] };

for (const cityConst of CITIES) {
  const b = findArrBounds(content, cityConst);
  if (!b) continue;
  let replaced = 0, badNoFix = 0, scanned = 0;

  let scan = b.arrStart;
  while (scan < b.arrEnd) {
    let depth = 0, inStr = false, esc = false, cardStart = -1;
    for (let k = scan; k < b.arrEnd; k++) {
      const ch = content[k];
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{' && depth === 0) { cardStart = k; break; }
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (cardStart < 0) break;
    const cardEnd = findCardEnd(content, cardStart);
    if (cardEnd < 0 || cardEnd > b.arrEnd) break;
    scanned++;

    const cardText = content.substring(cardStart, cardEnd + 1);
    const purlRe = /"photoUrl":"([^"]*)"/;
    const purlM = cardText.match(purlRe);
    if (purlM) {
      const purl = purlM[1];
      const badReason = isBad(purl);
      if (badReason && purl) {
        // Find good replacement in photos[]
        const photos = extractPhotos(cardText);
        const good = photos.find(u => !isBad(u));
        const nameM = cardText.match(/"name":"([^"]*)"/);
        if (good) {
          const oldStr = '"photoUrl":"' + purl + '"';
          const newStr = '"photoUrl":"' + good + '"';
          const relIdx = cardText.indexOf(oldStr);
          if (relIdx >= 0) {
            allEdits.push({ type: 'replace', start: cardStart + relIdx, end: cardStart + relIdx + oldStr.length, text: newStr });
            log.swaps.push({ city: cityConst, name: nameM ? nameM[1] : '?', reason: badReason, oldUrl: purl, newUrl: good });
            replaced++;
          }
        } else {
          badNoFix++;
        }
      }
    }
    scan = cardEnd + 1;
  }
  log.perCity[cityConst] = { scanned, replaced, badNoFix };
  console.log(cityConst.padEnd(16), 'scanned:', String(scanned).padStart(4),
    'replaced:', String(replaced).padStart(4),
    'bad-no-fix:', String(badNoFix).padStart(4));
}

console.log('\nTotal edits:', allEdits.length);
if (allEdits.length === 0) {
  console.log('Nothing to do.');
  process.exit(0);
}

const sortedAsc = [...allEdits].sort((a, b) => a.start - b.start);
const pieces = [];
let cursor = 0;
for (const edit of sortedAsc) {
  pieces.push(content.substring(cursor, edit.start));
  pieces.push(edit.text);
  cursor = edit.end;
}
pieces.push(content.substring(cursor));
const result = pieces.join('');

if (DRY) {
  console.log('[DRY RUN — content would change by ' + (result.length - content.length) + ' chars]');
} else {
  for (let t = 0; t < 3; t++) { try { fs.writeFileSync(PATH, result, 'utf8'); break; } catch (e) { if (t === 2) throw e; } }
  console.log('index.html WRITTEN (' + allEdits.length + ' edits)');
}
fs.writeFileSync(MANIFEST, JSON.stringify(log, null, 2), 'utf8');
console.log('Manifest at', MANIFEST);
