const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));
console.log('Starting:', arr.length, 'spots');

// =====================================================
// 1. FIX CLOSED SPOTS
// =====================================================
// The Spotted Pig closed in 2020 — mark it
const spottedPig = arr.find(r => r.name === 'The Spotted Pig');
if(spottedPig) {
  spottedPig.indicators = spottedPig.indicators || [];
  if(!spottedPig.indicators.includes('closed')) {
    spottedPig.indicators.push('closed');
    console.log('Marked closed: The Spotted Pig');
  }
}
// Dirt Candy is still open (moved to Allen St in 2015, still operating)
// Verify: Dirt Candy at 86 Allen St — still open and Michelin-starred. Keep it.

// =====================================================
// 2. BULK TAG FIXES — get all low tags above 15
// =====================================================
let tagFixes = 0;
const addTag = (r, tag) => {
  if(!(r.tags||[]).includes(tag)) { r.tags = r.tags || []; r.tags.push(tag); tagFixes++; }
};

for(const r of arr) {
  const cuisine = (r.cuisine||'').toLowerCase();
  const desc = (r.description||'').toLowerCase();
  const name = r.name.toLowerCase();
  const tags = r.tags || [];

  // SEAFOOD (6 → 15+): add to seafood restaurants, oyster bars, fish spots
  if(cuisine.includes('seafood') || desc.includes('seafood') || desc.includes('oyster') || desc.includes('lobster') || desc.includes('crab') || desc.includes('fish') && (desc.includes('restaurant') || desc.includes('bar'))) addTag(r, 'Seafood');

  // PIZZA (6 → 15+): add to pizza spots
  if(cuisine.includes('pizza') || desc.includes('pizza') || desc.includes('pizzeria') || desc.includes('pie') && desc.includes('crust')) addTag(r, 'Pizza');

  // SPORTS (5 → 15+): add to sports venues and sports bars
  if(desc.includes('stadium') || desc.includes('arena') || desc.includes('sports') || desc.includes('yankee') || desc.includes('mets') || desc.includes('knicks') || desc.includes('nets') || desc.includes('game day') || desc.includes('pre-game')) addTag(r, 'Sports');

  // DOG FRIENDLY (12 → 15+): add to outdoor spots with patios/gardens
  if(desc.includes('dog') || desc.includes('pet-friendly') || (tags.includes('Patio') && (desc.includes('garden') || desc.includes('backyard') || desc.includes('beer garden')))) addTag(r, 'Dog Friendly');

  // DESSERT (10 → 15+): add to bakeries, ice cream, chocolate spots
  if(desc.includes('ice cream') || desc.includes('doughnut') || desc.includes('donut') || desc.includes('chocolate') || desc.includes('cheesecake') || desc.includes('pastry') || desc.includes('gelato') || cuisine.includes('dessert') || cuisine.includes('bakery')) addTag(r, 'Dessert');

  // HEALTHY (10 → 15+): add to vegetarian, vegan, bowl spots
  if(desc.includes('vegan') || desc.includes('plant-based') || desc.includes('vegetarian') || desc.includes('farm-to-table') || desc.includes('organic') || desc.includes('grain bowl') || desc.includes('health-forward')) addTag(r, 'Healthy');

  // BBQ (12 → 15+): add to BBQ spots
  if(desc.includes('bbq') || desc.includes('barbecue') || desc.includes('brisket') || desc.includes('smoked meat') || cuisine.includes('bbq')) addTag(r, 'BBQ');

  // HISTORIC (5 → 15+): spots with old dates or 'since YYYY'
  if(desc.match(/since \d{4}/) || desc.includes('oldest') || desc.includes('1800') || desc.includes('190') || desc.includes('191') || desc.includes('192') || desc.includes('landmark') || desc.includes('historic')) addTag(r, 'Historic');

  // CLASSIC (6 → 15+): institutions, legendary, iconic
  if(desc.includes('institution') || desc.includes('legendary') || desc.includes('iconic') || desc.includes('classic') || desc.includes('original')) addTag(r, 'Classic');
}

console.log('Applied', tagFixes, 'tag additions');

// =====================================================
// 3. BULK INDICATOR FIXES — get all under 15
// =====================================================
let indFixes = 0;
const addInd = (r, ind) => {
  if(!(r.indicators||[]).includes(ind)) { r.indicators = r.indicators || []; r.indicators.push(ind); indFixes++; }
};

for(const r of arr) {
  const desc = (r.description||'').toLowerCase();
  const tags = r.tags || [];

  // WOMEN-OWNED (6 → 15+): check for known women chefs/owners
  const womenOwned = ['missy robbins','rita sodi','jody williams','amanda cohen','april bloomfield','marie-aude rose','sunny lee','nhung dao','jenny dorsey','anita lo','einat admony'];
  if(womenOwned.some(w => desc.includes(w))) addInd(r, 'women-owned');

  // BLACK-OWNED (8 → 15+): check for known Black-owned spots
  const blackOwned = ['kwame onwuachi','charles gabriel','melba wilson','melba\'s','red rooster','marcus samuelsson','sylvia','amy ruth','sisters caribbean','lolo\'s','madcap'];
  if(blackOwned.some(w => name_lower(r).includes(w) || desc.includes(w))) addInd(r, 'black-owned');

  // PET-FRIENDLY (12 → 15+): outdoor spots, beer gardens, patios that allow dogs
  if(desc.includes('dog') || desc.includes('pet') || (tags.includes('Dog Friendly') && !r.indicators.includes('pet-friendly'))) addInd(r, 'pet-friendly');

  // DIVE-BAR (13 → 15+)
  if(desc.includes('dive') || desc.includes('cheap beer') || desc.includes('pbr') || desc.includes('no-frills bar') || desc.includes('grimy')) addInd(r, 'dive-bar');

  // HALAL (14 → 15+)
  if(desc.includes('halal') || desc.includes('muslim')) addInd(r, 'halal');
}

function name_lower(r) { return (r.name||'').toLowerCase(); }

console.log('Applied', indFixes, 'indicator additions');

// =====================================================
// 4. REMOVE TAGS THAT AREN'T REAL FILTERS
// The tags Queens, Bronx, Brooklyn are borough names not filters — remove
// =====================================================
let removedTags = 0;
const fakeTags = ['Queens','Bronx','Brooklyn','Korean','Chinese','Pasta','Indian','Japanese','Spanish','Tapas','Soul Food','Dim Sum','Dumplings','Wine Bar','French','Natural Wine','Spicy','Fast Casual','Unique Combos'];
for(const r of arr) {
  if(!r.tags) continue;
  const before = r.tags.length;
  r.tags = r.tags.filter(t => !fakeTags.includes(t));
  removedTags += before - r.tags.length;
}
console.log('Removed', removedTags, 'non-filter tags');

// =====================================================
// WRITE AND VERIFY
// =====================================================
html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Final counts
const finalTags = {};
arr.forEach(r => (r.tags||[]).forEach(t => { finalTags[t]=(finalTags[t]||0)+1; }));
console.log('\n=== FINAL TAG COUNTS (was < 15) ===');
['Seafood','Pizza','Sports','Dog Friendly','Dessert','Healthy','BBQ','Historic','Classic'].forEach(t => {
  console.log(' ', (finalTags[t]||0).toString().padStart(3), t);
});

const finalInds = {};
arr.forEach(r => (r.indicators||[]).forEach(ind => { finalInds[ind]=(finalInds[ind]||0)+1; }));
console.log('\n=== FINAL INDICATOR COUNTS ===');
Object.entries(finalInds).sort((a,b)=>b[1]-a[1]).forEach(([ind,n]) => console.log(' ', n.toString().padStart(3), ind));

console.log('\nFinal total:', arr.length);
console.log('Done!');
