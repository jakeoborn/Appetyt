const fs = require('fs');
const path = 'C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
const reportPath = 'C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/main-photo-audit.json';

const reasonFilter = process.argv[2] || 'all'; // 'empty' | 'empty-squarespace' | 'nonempty' | 'all'

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
let content = fs.readFileSync(path, 'utf8');

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let applied = 0, skipped = 0, notFound = 0;
const notFoundNames = [];

for (const r of report) {
  const reason = r.reason;
  if (reasonFilter === 'empty' && reason !== 'empty') continue;
  if (reasonFilter === 'empty-squarespace' && reason !== 'empty-squarespace') continue;
  if (reasonFilter === 'empty-only' && reason !== 'empty' && reason !== 'empty-squarespace') continue;
  if (reasonFilter === 'nonempty' && (reason === 'empty' || reason === 'empty-squarespace')) continue;

  // Find "name":"X" followed by "photoUrl":"CURRENTURL" in same card
  const nameRe = new RegExp('"name":"' + escapeRe(r.name) + '"', 'g');
  let m, foundAndApplied = false;
  while ((m = nameRe.exec(content)) !== null) {
    const win = content.substring(m.index, Math.min(content.length, m.index + 8000));
    const photoUrlTarget = '"photoUrl":"' + r.currentUrl + '"';
    const idxInWin = win.indexOf(photoUrlTarget);
    if (idxInWin < 0) continue;
    // Make sure this photoUrl belongs to THIS card (no intervening "name":"...")
    const between = win.substring(0, idxInWin);
    // Allow first match of "name" (the one we're at) — check no SECOND "name": appears before photoUrl
    const nameMatches = between.match(/"name":"[^"]+"/g) || [];
    if (nameMatches.length > 1) continue;
    const absStart = m.index + idxInWin;
    const absEnd = absStart + photoUrlTarget.length;
    const newChunk = '"photoUrl":"' + r.newUrl + '"';
    content = content.substring(0, absStart) + newChunk + content.substring(absEnd);
    applied++;
    foundAndApplied = true;
    break;
  }
  if (!foundAndApplied && r.currentUrl) {
    // Fallback: direct photoUrl substring match — only if it occurs exactly once in file
    const target = '"photoUrl":"' + r.currentUrl + '"';
    const first = content.indexOf(target);
    const second = first >= 0 ? content.indexOf(target, first + 1) : -1;
    if (first >= 0 && second < 0) {
      const newChunk = '"photoUrl":"' + r.newUrl + '"';
      content = content.substring(0, first) + newChunk + content.substring(first + target.length);
      applied++;
      foundAndApplied = true;
    }
  }
  if (!foundAndApplied) {
    notFound++;
    notFoundNames.push(r.name + ' (' + reason + ')');
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Applied:', applied);
console.log('Not found / already changed:', notFound);
if (notFoundNames.length && notFoundNames.length <= 30) {
  for (const n of notFoundNames) console.log('  -', n);
}
