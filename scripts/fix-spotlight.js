const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Remove .slice(0,10) limit on topRestaurants
html = html.replace(
  /var topRestaurants = matches\.filter\(function\(r\)\{\s*var cu=\(r\.cuisine\|\|''\)\.toLowerCase\(\);\s*return !cu\.match\(\/bar\|cocktail\|lounge\|pub\|nightclub\|brewery\|tiki\|speakeasy\/\);\s*\}\)\.slice\(0,10\);/,
  `var topRestaurants = matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      var tags=(r.tags||[]);
      // Exclude bars, nightlife, museums, parks, tourist attractions
      if(cu.match(/bar|cocktail|lounge|pub|nightclub|brewery|tiki|speakeasy|mezcal/)) return false;
      if(cu.match(/museum|gallery|park|attraction|landmark|theater|cinema|bowling|arcade|gaming/)) return false;
      if(tags.some(function(t){return/museum|park|landmark|attraction/i.test(t)})) return false;
      return true;
    });`
);
console.log('Fixed topRestaurants filter (removed slice, excluded non-restaurants)');

// 2. Remove .slice(0,8) limit on bars
html = html.replace(
  /var bars = matches\.filter\(function\(r\)\{\s*var cu=\(r\.cuisine\|\|''\)\.toLowerCase\(\);\s*if\(cu\.match\(\/bar\|cocktail\|lounge\|pub\|wine bar\|whiskey\|brewery\|tiki\|speakeasy\|mezcal\/\)\) return true;\s*var tags=\(r\.tags\|\|\[\]\);\s*return tags\.some\(function\(t\)\{return\/cocktail\|bar\|speakeasy\|dive\/i\.test\(t\)\}\) && !cu\.match\(\/steak\|seafood\|italian\|french\|american\|mexican\|japanese\|sushi\|bbq\|pizza\/\);\s*\}\)\.slice\(0,8\);/,
  `var bars = matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      if(cu.match(/bar|cocktail|lounge|pub|wine bar|whiskey|brewery|tiki|speakeasy|mezcal|nightclub/)) return true;
      var tags=(r.tags||[]);
      return tags.some(function(t){return/cocktail|bar|speakeasy|dive|nightlife|nightclub/i.test(t)}) && !cu.match(/steak|seafood|italian|french|american|mexican|japanese|sushi|bbq|pizza/);
    });

    // Activities & Attractions
    var attractions = matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      var tags=(r.tags||[]);
      return cu.match(/museum|gallery|park|attraction|landmark|theater|cinema|bowling|arcade|gaming/) || tags.some(function(t){return/museum|park|landmark|attraction|Eat & Play/i.test(t)});
    });`
);
console.log('Fixed bars filter (removed slice, added attractions category)');

// 3. Upgrade tile styling — gold border + dim glow
const oldTile = `return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);border:1px solid var(--border);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'"`;
const newTile = `return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s" onmouseover="this.style.boxShadow=\\'0 0 18px rgba(232,201,122,.45)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.boxShadow=\\'0 0 8px rgba(200,169,110,.2)\\';this.style.transform=\\'\\'\\'"`;

// Find the tile function in openNeighborhoodSpotlight (there are multiple tile functions)
// The one we want is around line 11781
const spotlightTileIdx = html.indexOf('// Venue tile helper (same as nightlife)');
if(spotlightTileIdx > -1) {
  const tileStart = html.indexOf("return '<div onclick=", spotlightTileIdx);
  const tileOldEnd = html.indexOf("transition:border-color .15s\"", tileStart);
  if(tileStart > -1 && tileOldEnd > -1) {
    const oldStr = html.substring(tileStart, tileOldEnd + "transition:border-color .15s\"".length);
    // Check next chars for the hover handlers
    const hoverEnd = html.indexOf("'var(--border)'\"", tileOldEnd);
    if(hoverEnd > -1) {
      const fullOld = html.substring(tileStart, hoverEnd + "'var(--border)'\"".length);
      const fullNew = `return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s" onmouseover="this.style.boxShadow=\\'0 0 18px rgba(232,201,122,.45)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.boxShadow=\\'0 0 8px rgba(200,169,110,.2)\\';this.style.transform=\\'\\'\\'"`;
      html = html.replace(fullOld, fullNew);
      console.log('Upgraded spotlight tile styling with gold border + glow');
    }
  }
}

// 4. Add Attractions section after bars and upgrade Known For / Must Visit cards
// Find the insertion point after bars section
const barsSection = "// Best Bars & Nightlife";
const barsSectionIdx = html.indexOf(barsSection, html.indexOf('openNeighborhoodSpotlight'));
if(barsSectionIdx > -1) {
  // Find end of bars section
  const barsEndMarker = "// Known For";
  const barsEndIdx = html.indexOf(barsEndMarker, barsSectionIdx);
  if(barsEndIdx > -1) {
    // Insert attractions section before Known For
    const attractionsSection = `
    // Activities & Attractions
    if(attractions.length){
      h+='<div style="margin-bottom:24px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)"><span style="font-size:18px">\\ud83c\\udfaf</span><span style="font-size:14px;font-weight:800;color:var(--text)">Activities & Attractions</span><span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.15)">'+attractions.length+'</span></div>';
      h+='<div style="display:flex;flex-direction:column;gap:6px">';
      attractions.forEach(function(r,i){ h+=tile(r,i); });
      h+='</div></div>';
    }

    `;
    html = html.substring(0, barsEndIdx) + attractionsSection + html.substring(barsEndIdx);
    console.log('Added Activities & Attractions section');
  }
}

// 5. Upgrade Known For and Must Visit cards with gold treatment
html = html.replace(
  /h\+='<div style="margin-bottom:24px;padding:14px 16px;background:var\(--card\);border:1px solid var\(--border\);border-radius:12px">';\s*h\+='<div style="font-size:10px;color:var\(--gold\);text-transform:uppercase;letter-spacing:\.25em;font-weight:700;margin-bottom:8px">Known For<\/div>';/g,
  `h+='<div style="margin-bottom:24px;padding:14px 16px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Known For</div>';`
);

html = html.replace(
  /h\+='<div style="margin-bottom:24px;padding:14px 16px;background:var\(--card\);border:1px solid var\(--border\);border-radius:12px">';\s*h\+='<div style="font-size:10px;color:var\(--gold\);text-transform:uppercase;letter-spacing:\.25em;font-weight:700;margin-bottom:8px">Must Visit<\/div>';/g,
  `h+='<div style="margin-bottom:24px;padding:14px 16px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Must Visit</div>';`
);
console.log('Upgraded Known For / Must Visit cards with gold treatment');

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAll spotlight improvements applied!');
