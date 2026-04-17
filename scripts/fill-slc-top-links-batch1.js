#!/usr/bin/env node
// SLC top-score link backfill — batch 1.
// Fills verified official websites/Instagram on high-score SLC entries that
// had missing links. Each entry verified via firecrawl_search.
//
// Also fixes Tin Angel's incorrect IG (@tinangelslc was not a real handle —
// the official cafe IG is @tinangelcafe, confirmed on instagram.com).
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const SLC_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));

// id → { website?, instagram? }
const fills = {
  11357: { website: 'https://francksfood.com' },                       // Franck's
  11266: { website: 'https://tuliebakery.com' },                        // Tulie Bakery
  11457: { website: 'https://tablexrestaurant.com',
           instagram: '@tablexrestaurant' },                            // Table X South
  11336: { website: 'https://caputos.com' },                            // Caputo's Deli
  11011: { instagram: '@lucky13slc' },                                  // Lucky 13
  11329: { website: 'https://www.bambara-slc.com' },                    // Bambara
  11310: { website: 'https://www.slceatery.com' },                      // SLC Eatery
  11338: { website: 'https://www.saffronvalley.com' },                  // Saffron Valley
  11333: { instagram: '@tinangelcafe' },                                // Tin Angel (fix wrong handle)
};

let filled = 0, skipped = 0, fixed = 0;
arr.forEach(r => {
  const f = fills[r.id];
  if (!f) return;
  let touched = false;
  if (f.website && !(r.website && String(r.website).trim())) {
    r.website = f.website;
    filled++;
    touched = true;
  }
  if (f.instagram) {
    const cur = String(r.instagram || '').trim();
    if (!cur) {
      r.instagram = f.instagram;
      filled++;
      touched = true;
    } else if (cur !== f.instagram && r.id === 11333) {
      // Tin Angel — explicitly override wrong handle.
      r.instagram = f.instagram;
      fixed++;
      touched = true;
    }
  }
  if (!touched) skipped++;
});

console.log(`Fills applied: ${filled}`);
console.log(`Wrong IG corrected: ${fixed}`);
console.log(`Skipped (already set): ${skipped}`);

html = before + JSON.stringify(arr) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');
