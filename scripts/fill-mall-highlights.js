#!/usr/bin/env node
// Populate `highlights` on all MALL_DATA entries (0/52 currently have them)
// by deriving {icon,label,note} tuples from each entry's existing verified
// fields: anchors, mustVisit, dining, tips, parking, awards, bestFor, vibe.
// No new data — just resurfaces the verified content from each entry as
// 4-5 scannable bullets, matching the PARK_DATA / MUSEUM_DATA pattern used
// for Dallas Museum of Art etc.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// --- Locate MALL_DATA object ---
const declIdx = html.indexOf('const MALL_DATA');
if (declIdx < 0) { console.error('MALL_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let i = openIdx; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') { depth--; if (depth === 0) { closeIdx = i + 1; break; } }
}
const before = html.slice(0, openIdx);
const after = html.slice(closeIdx);
const obj = (new Function('return ' + html.slice(openIdx, closeIdx)))();

// Tier-based icon for first "what is it" bullet.
function tierIcon(tier) {
  const t = String(tier || '').toLowerCase();
  if (t === 'luxury') return '\ud83d\udc8e';      // 💎
  if (t === 'market') return '\ud83d\udecd';      // 🛍 (approx market)
  if (t === 'mid') return '\ud83d\udecd';         // 🛍
  if (t === 'outlet') return '\ud83c\udff7';      // 🏷
  return '\ud83c\udfec';                          // 🏬 store
}

// Map a bestFor tag to an emoji.
function bestForIcon(s) {
  const x = String(s || '').toLowerCase();
  if (/food|dining|restaurant/.test(x)) return '\ud83c\udf7d';      // 🍽
  if (/art|gallery|museum|cultur/.test(x)) return '\ud83c\udfa8';    // 🎨
  if (/luxury|designer/.test(x)) return '\ud83d\udc8e';             // 💎
  if (/family|kids/.test(x)) return '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67'; // 👨‍👩‍👧
  if (/date|romantic/.test(x)) return '\ud83d\udc91';               // 💑
  if (/rainy|indoor/.test(x)) return '\u2614';                       // ☔
  if (/tourist|visit/.test(x)) return '\ud83d\udccd';               // 📍
  if (/holiday|christmas/.test(x)) return '\ud83c\udf84';            // 🎄
  if (/fitness|yoga|run/.test(x)) return '\ud83c\udfc3';             // 🏃
  return '\u2728';                                                    // ✨
}

function buildHighlights(entry) {
  const out = [];

  // 1. What-it-is bullet from tier + tagline/vibe.
  const lead = entry.tagline || entry.vibe;
  if (lead) {
    out.push({ icon: tierIcon(entry.tier), label: entry.tier || 'Destination', note: String(lead).replace(/^"+|"+$/g, '') });
  }

  // 2. Top anchor (retail pull) if present.
  if (Array.isArray(entry.anchors) && entry.anchors.length) {
    const list = entry.anchors.slice(0, 3).join(', ');
    out.push({ icon: '\ud83c\udfec', label: 'Anchors', note: list });
  }

  // 3. First must-visit shop.
  if (Array.isArray(entry.mustVisit) && entry.mustVisit.length) {
    const m = entry.mustVisit[0];
    if (m && m.name) out.push({ icon: '\u2b50', label: m.name, note: m.note || '' });
  }

  // 4. First dining pick.
  if (Array.isArray(entry.dining) && entry.dining.length) {
    const d = entry.dining[0];
    if (d && d.name) {
      const suffix = d.type ? ' (' + d.type + ')' : '';
      out.push({ icon: '\ud83c\udf7d', label: d.name + suffix, note: d.note || '' });
    }
  }

  // 5. Parking / access tip.
  if (entry.parking) {
    out.push({ icon: '\ud83d\ude97', label: 'Parking', note: entry.parking });
  }

  // 6. If still fewer than 4, add an awards line or a bestFor anchor.
  if (out.length < 4 && entry.awards) {
    out.push({ icon: '\ud83c\udfc6', label: 'Recognition', note: entry.awards });
  }
  if (out.length < 4 && Array.isArray(entry.bestFor) && entry.bestFor.length) {
    const bf = entry.bestFor[0];
    out.push({ icon: bestForIcon(bf), label: 'Best For', note: entry.bestFor.slice(0, 3).join(', ') });
  }

  // Cap at 5.
  return out.slice(0, 5);
}

let filled = 0, skipped = 0;
Object.keys(obj).forEach(city => {
  const arr = obj[city];
  if (!Array.isArray(arr)) return;
  arr.forEach(r => {
    if (Array.isArray(r.highlights) && r.highlights.length > 0) { skipped++; return; }
    const hi = buildHighlights(r);
    if (hi.length >= 2) {
      r.highlights = hi;
      filled++;
    }
  });
});

console.log('MALL_DATA highlights filled: ' + filled + ' (skipped=' + skipped + ')');

// Re-emit. Use 2-space indent for readability on the object overall.
html = before + JSON.stringify(obj) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');
