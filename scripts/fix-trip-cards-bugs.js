// Fix multiple bugs:
// 1. Saved restaurants not persisting (missing re-render after add)
// 2. "Add to trip" on Discover page
// 3. Activity vs restaurant card misclassification
// 4. NYC coming soon cards not clickable
// Run: node scripts/fix-trip-cards-bugs.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
let fixes = 0;

// ═══════════════════════════════════════════
// FIX 1: addRestaurant should re-render trips after saving
// ═══════════════════════════════════════════

const oldAddRest = `    this.restaurants.push(entry);
    this._saveLocal();
  },`;

const newAddRest = `    this.restaurants.push(entry);
    this._saveLocal();
    if(typeof A !== 'undefined' && A.renderTrips) A.renderTrips();
  },`;

if (html.includes(oldAddRest)) {
  html = html.replace(oldAddRest, newAddRest);
  console.log('✓ Fix 1: addRestaurant now calls renderTrips after save');
  fixes++;
} else {
  console.log('✗ Fix 1: addRestaurant pattern not found');
}

// ═══════════════════════════════════════════
// FIX 2: "Add to trip" on Discover — add toast + re-render
// The button already works but needs feedback. Ensure toast shows.
// ═══════════════════════════════════════════

// The button at line ~9106 calls TRIPS.addRestaurant then showToast
// Fix: Also add a visual indicator that it was added
const oldTripBtn = `TRIPS.addRestaurant(\${id},'\${r.name.replace(/'/g,"\\\\'")}','\${r.neighborhood||'Dallas'}');A.showToast('Added to '+TRIPS.current.name+' ✈️')`;
const newTripBtn = `TRIPS.addRestaurant(\${id},'\${r.name.replace(/'/g,"\\\\'")}','\${r.neighborhood||'Dallas'}');this.textContent='✅ Added';this.style.opacity='.5';A.showToast('Added to '+TRIPS.current.name+' ✈️')`;

if (html.includes(oldTripBtn)) {
  html = html.replace(oldTripBtn, newTripBtn);
  console.log('✓ Fix 2: Trip button now shows visual confirmation on Discover');
  fixes++;
} else {
  console.log('✗ Fix 2: Trip button pattern not found');
}

// ═══════════════════════════════════════════
// FIX 3: Activity vs Restaurant card classification
// Problem: Rooftops show as activity cards, museums as restaurant cards
// The _isAct check at detail level should:
//   - INCLUDE: Museum, Tourist Attraction, Entertainment, Comedy, Activity
//   - EXCLUDE: Rooftop Bar, Rooftop, any restaurant with Rooftop in name/cuisine
// ═══════════════════════════════════════════

// Fix the detail-level activity classification
const oldActCuisines = `var _actCuisines=['Entertainment','Club','Live Music','Jazz Club','Comedy Club','Rooftop Bar','Food Market','Bar','Brewery','Wine Bar','Whiskey Bar'];
    var _isAct=_actCuisines.indexOf(r.cuisine)>-1||(r.cuisine||'').indexOf('Rooftop')>-1;`;

const newActCuisines = `var _actCuisines=['Entertainment','Live Music','Jazz Club','Comedy Club','Museum','Art Museum','Tourist Attraction','Attraction','Activity','Venue','Nightclub','Nightclub / Venue','Theater','Performing Arts','Sports Venue'];
    var _isAct=_actCuisines.indexOf(r.cuisine)>-1||(r.type&&['Museum','Attraction','Activity'].indexOf(r.type)>-1);`;

if (html.includes(oldActCuisines)) {
  html = html.replace(oldActCuisines, newActCuisines);
  console.log('✓ Fix 3a: Activity card classification updated (detail view)');
  fixes++;
} else {
  console.log('✗ Fix 3a: _actCuisines pattern not found');
}

// Also fix the isActivity regex used for experience URLs
const oldIsActivity = `const isActivity = (r.cuisine||'').toLowerCase().match(/entertainment|club|jazz|comedy|live music|museum|activity/);`;
const newIsActivity = `const isActivity = (r.cuisine||'').toLowerCase().match(/entertainment|museum|tourist|attraction|activity|venue|nightclub|theater|performing arts|sports venue/)||(r.type&&/museum|attraction|activity/i.test(r.type));`;

if (html.includes(oldIsActivity)) {
  html = html.replace(oldIsActivity, newIsActivity);
  console.log('✓ Fix 3b: isActivity regex updated (experience URLs)');
  fixes++;
} else {
  console.log('✗ Fix 3b: isActivity regex not found');
}

// ═══════════════════════════════════════════
// FIX 4: NYC Coming Soon cards not clickable
// Problem: NYC coming soon onclick uses A.openComingSoonDetail(idx,'nyc')
//   but the function reads from window._csItems which is set by Dallas CS rendering
//   NYC items are in nycItems (local variable in template) — never stored globally
// Fix: Store nycItems in a global before rendering the cards
// ═══════════════════════════════════════════

const oldNycCS = `\${nycItems.map((r,idx)=>\`
          <div onclick="A.openComingSoonDetail(\${idx},'nyc')"`;

const newNycCS = `\${(window._nycCSItems=nycItems)&&nycItems.map((r,idx)=>\`
          <div onclick="A.openComingSoonDetail(\${idx},'nyc')"`;

if (html.includes(oldNycCS)) {
  html = html.replace(oldNycCS, newNycCS);
  console.log('✓ Fix 4a: NYC coming soon items now stored globally');
  fixes++;
} else {
  console.log('✗ Fix 4a: NYC CS items pattern not found');
}

// Also fix the openComingSoonDetail function to check NYC items
const oldCSDetail = `openComingSoonDetail(idx,city){
    var items=window._csItems||[];`;

const newCSDetail = `openComingSoonDetail(idx,city){
    var items=(city==='nyc'?window._nycCSItems:window._csItems)||[];`;

if (html.includes(oldCSDetail)) {
  html = html.replace(oldCSDetail, newCSDetail);
  console.log('✓ Fix 4b: openComingSoonDetail now checks NYC items array');
  fixes++;
} else {
  console.log('✗ Fix 4b: openComingSoonDetail pattern not found');
}

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Applied ' + fixes + ' fixes');
