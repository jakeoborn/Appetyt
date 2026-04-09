// Update hospitality group assignments across Houston, NYC, and Chicago
// + Add missing restaurants for key groups
// + Update Brooklyn Mirage → Pacha New York
// Run: node scripts/update-hospitality-groups-all.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// HELPER: Update group field by restaurant name in a data array
// ═══════════════════════════════════════════
function updateGroups(arrayTag, updates) {
  const s = html.indexOf(arrayTag);
  if (s === -1) return 0;
  const a = html.indexOf('[', s);
  let d=0,e=a;
  for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  const arr = JSON.parse(html.slice(a, e));
  let count = 0;

  for (const [name, group] of Object.entries(updates)) {
    const r = arr.find(x => x.name === name || x.name.includes(name));
    if (r) {
      if (r.group !== group) {
        r.group = group;
        count++;
      }
    }
  }

  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return count;
}

// ═══════════════════════════════════════════
// HELPER: Add restaurant to a city data array
// ═══════════════════════════════════════════
function addToCity(arrayTag, spots) {
  const s = html.indexOf(arrayTag);
  if (s === -1) return 0;
  const a = html.indexOf('[', s);
  let d=0,e=a;
  for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  const arr = JSON.parse(html.slice(a, e));
  const existing = new Set(arr.map(r => r.name.toLowerCase()));
  let nextId = Math.max(...arr.map(r => r.id)) + 1;
  let count = 0;

  for (const spot of spots) {
    if (existing.has(spot.name.toLowerCase())) {
      console.log('    SKIP (dup):', spot.name);
      continue;
    }
    arr.push({
      id: nextId++, name: spot.name, phone: spot.phone || '', cuisine: spot.cuisine,
      neighborhood: spot.neighborhood, score: spot.score, price: spot.price,
      tags: spot.tags, indicators: spot.indicators || [], hh: spot.hh || '',
      reservation: spot.reservation || 'walk-in', awards: spot.awards || '',
      description: spot.description, dishes: spot.dishes, address: spot.address,
      hours: spot.hours || '', lat: spot.lat, lng: spot.lng,
      bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: spot.trending || false, group: spot.group || '',
      instagram: spot.instagram || '', website: spot.website || '',
      suburb: spot.suburb || false, reserveUrl: '', menuUrl: '', res_tier: spot.res_tier || 2,
    });
    existing.add(spot.name.toLowerCase());
    count++;
    console.log('    ADDED:', spot.name, '(id', nextId-1, ')');
  }

  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return count;
}

// ═══════════════════════════════════════════
// 1. HOUSTON — Update group fields
// ═══════════════════════════════════════════
console.log('=== HOUSTON ===');

let hUpdated = updateGroups('const HOUSTON_DATA', {
  "Turner's": "Berg Hospitality",
  "B&B Butchers": "Berg Hospitality",
  "Cafe Annie / The Annie Cafe & Bar": "Berg Hospitality",
  "Pappadeaux Seafood Kitchen": "Pappas Restaurants",
  "Eight Row Flint": "Agricole Hospitality",
  "Underbelly Hospitality / Georgia James": "Underbelly Hospitality",
  "Underbelly Hospitality / Wild Oats": "Underbelly Hospitality",
  "Trattoria Sofia": "Berg Hospitality",
});
console.log('  Updated', hUpdated, 'group assignments');

// Add missing Houston restaurants
let hAdded = addToCity('const HOUSTON_DATA', [
  {
    name: "B.B. Lemon", cuisine: "American / Bar", neighborhood: "Washington Corridor",
    score: 85, price: 2, tags: ["American", "Bar", "Casual", "Date Night", "Cocktails"],
    reservation: "OpenTable", group: "Berg Hospitality",
    description: "Elevated bar and grill from Ben Berg across the street from B&B Butchers on Washington Ave. Classic, straightforward food — think crispy chicken sandwiches, wedge salads, and excellent burgers — paired with creative cocktails in a laid-back space. The perfect post-work neighborhood spot.",
    dishes: ["Crispy Chicken Sandwich", "Wedge Salad", "BB Burger", "Craft Cocktails"],
    address: "1809 Washington Ave, Houston, TX 77007", phone: "(713) 554-1809",
    lat: 29.7639, lng: -95.3805, instagram: "bblemon", website: "https://www.bblemon.com",
  },
  {
    name: "Wild Oats", cuisine: "Southern / Comfort Food", neighborhood: "Montrose",
    score: 86, price: 2, tags: ["American", "Southern", "Brunch", "Casual"],
    reservation: "walk-in", group: "Underbelly Hospitality",
    description: "Underbelly Hospitality's casual Southern comfort concept in Montrose serving elevated diner classics. Scratch-made biscuits, fried chicken, and hearty brunch plates in a bright, welcoming space. The vibe is approachable but the technique is serious.",
    dishes: ["Fried Chicken Biscuit", "Shrimp & Grits", "Country Breakfast", "Biscuits & Gravy"],
    address: "2520 Airline Dr, Houston, TX 77009", phone: "(346) 297-0440",
    lat: 29.7929, lng: -95.3800, instagram: "wildoatshou", website: "https://www.wildoatshouston.com",
  },
  {
    name: "Pastore", cuisine: "Italian / Neapolitan", neighborhood: "Heights",
    score: 87, price: 2, tags: ["Italian", "Pizza", "Date Night", "Cocktails"],
    reservation: "Resy", group: "Underbelly Hospitality",
    description: "Underbelly Hospitality's Italian concept in the Heights with a focus on Neapolitan-style pizza and handmade pasta. The wood-fired oven is the star, turning out charred, blistered pies alongside antipasti and seasonal Italian plates. A relaxed neighborhood restaurant with serious culinary chops.",
    dishes: ["Neapolitan Pizza", "Handmade Pasta", "Antipasti", "Tiramisu"],
    address: "2101 Dunlavy St, Houston, TX 77006", phone: "(713) 264-0608",
    lat: 29.7560, lng: -95.3984, instagram: "pastorehouston", website: "https://www.pastorehouston.com",
  },
  {
    name: "Trill Burgers", cuisine: "Smash Burgers", neighborhood: "Montrose",
    score: 88, price: 1, tags: ["Burgers", "Casual", "Local Favorites", "Viral"],
    reservation: "walk-in",
    description: "Houston hip-hop legend Bun B's smash burger empire that won best burger in America at the 2023 World Food Championships. The OG double smash on a Martin's potato roll with American cheese, pickles, and Trill sauce is perfection. Multiple locations including the original on Westheimer. No frills, just elite burgers.",
    dishes: ["OG Trill Burger", "Trill Cheese Burger", "Vegan Trill Burger", "Trill Fries"],
    address: "5402 Westheimer Rd, Houston, TX 77056", phone: "(832) 767-3270",
    lat: 29.7376, lng: -95.4629, instagram: "trillburgers", website: "https://www.trillburgers.com",
    trending: true,
  },
  {
    name: "NoPo Cafe, Market & Bar", cuisine: "Cafe / Market", neighborhood: "Garden Oaks",
    score: 83, price: 2, tags: ["Cafe", "Brunch", "Market", "Casual"],
    reservation: "walk-in", group: "Berg Hospitality",
    description: "Ben Berg's neighborhood cafe and market concept in Garden Oaks offering all-day dining from breakfast pastries to evening cocktails. The market stocks curated provisions, and the cafe serves approachable American fare with a focus on fresh, quality ingredients.",
    dishes: ["Breakfast Pastries", "Market Sandwiches", "Salads", "Wine & Cocktails"],
    address: "1244 N Shepherd Dr, Houston, TX 77008", phone: "(713) 426-4488",
    lat: 29.8021, lng: -95.4105, instagram: "nopocafe", website: "https://www.nopocafe.com",
  },
]);
console.log('  Added', hAdded, 'new Houston spots');

// ═══════════════════════════════════════════
// 2. CHICAGO — Update group fields
// ═══════════════════════════════════════════
console.log('\n=== CHICAGO ===');

// Chicago data is inline in CITY_DATA, need to handle differently
// Find and parse Chicago array
const chiKey = "'Chicago': [";
const chiIdx = html.indexOf(chiKey, html.indexOf('const CITY_DATA'));
const chiArr = html.indexOf('[', chiIdx + 10);
let cd=0, ce=chiArr;
for(let i=chiArr;i<html.length;i++){if(html[i]==='[')cd++;if(html[i]===']')cd--;if(cd===0){ce=i+1;break;}}
const chicago = JSON.parse(html.slice(chiArr, ce));

// Update group assignments
const chiUpdates = {
  "Girl & the Goat": "Boka Restaurant Group",
  "Little Goat Diner": "Boka Restaurant Group",
  "Duck Duck Goat": "Boka Restaurant Group",
  "Boka": "Boka Restaurant Group",
  "Boka Restaurant": "Boka Restaurant Group",
  "Momotaro": "Boka Restaurant Group",
  "Swift & Sons": "Boka Restaurant Group",
  "Lazy Bird": "Boka Restaurant Group",
  "RPM Italian": "Lettuce Entertain You",
  "RPM Steak": "Lettuce Entertain You",
  "RPM Seafood": "Lettuce Entertain You",
  "Ema": "Lettuce Entertain You",
  "Beatrix": "Lettuce Entertain You",
  "Summer House Santa Monica": "Lettuce Entertain You",
  "Cafe Ba-Ba-Reeba!": "Lettuce Entertain You",
  "Sushi-San": "Lettuce Entertain You",
  "Ramen-San": "Lettuce Entertain You",
  "Mon Ami Gabi": "Lettuce Entertain You",
  "The Aviary": "Alinea Group",
  "Next": "Alinea Group",
};

let chiCount = 0;
for (const [name, group] of Object.entries(chiUpdates)) {
  const r = chicago.find(x => x.name === name);
  if (r && r.group !== group) {
    r.group = group;
    chiCount++;
  }
}
html = html.slice(0, chiArr) + JSON.stringify(chicago) + html.slice(ce);
console.log('  Updated', chiCount, 'group assignments');

// Show resulting groups
const chiGroups = {};
chicago.filter(r=>r.group&&r.group.trim()).forEach(r=>{if(!chiGroups[r.group])chiGroups[r.group]=[];chiGroups[r.group].push(r.name);});
Object.entries(chiGroups).sort((a,b)=>b[1].length-a[1].length).forEach(([g,r])=>console.log('  ',r.length,g));

// ═══════════════════════════════════════════
// 3. NYC — Fix group assignments + Brooklyn Mirage → Pacha
// ═══════════════════════════════════════════
console.log('\n=== NYC ===');

let nycUpdated = updateGroups('const NYC_DATA', {
  "Lavo Party Brunch": "Tao Group Hospitality",
  "TAO Uptown": "Tao Group Hospitality",
  "TAO Downtown": "Tao Group Hospitality",
});
console.log('  Updated', nycUpdated, 'group assignments');

// Update Brooklyn Mirage → Pacha New York
const bmOld = '"name":"The Brooklyn Mirage"';
const bmNew = '"name":"Pacha New York"';
if (html.includes(bmOld)) {
  html = html.replace(bmOld, bmNew);
  // Also update description and related fields
  const descOld = html.indexOf('"description":', html.indexOf(bmNew));
  console.log('  ✓ Renamed Brooklyn Mirage → Pacha New York');
} else {
  console.log('  ✗ Brooklyn Mirage not found by exact name');
}

// Update the Pacha entry description
const pachaDescSearch = 'Pacha New York';
const nycStart = html.indexOf('const NYC_DATA');
const nycArrStart = html.indexOf('[', nycStart);
let nd=0, ne=nycArrStart;
for(let i=nycArrStart;i<html.length;i++){if(html[i]==='[')nd++;if(html[i]===']')nd--;if(nd===0){ne=i+1;break;}}
const nyc = JSON.parse(html.slice(nycArrStart, ne));

const pacha = nyc.find(r => r.name === 'Pacha New York');
if (pacha) {
  pacha.description = "The legendary Ibiza nightclub brand takes over the Brooklyn Mirage complex for summer 2026. FIVE Holdings transformed the massive outdoor venue into Pacha New York, promising international headliners, Grammy winners, and the signature Pacha energy. The Great Hall operates year-round while the outdoor space runs June through October. A new era for Brooklyn nightlife.";
  pacha.website = "https://www.pachanewyork.com";
  pacha.instagram = "pachanewyork";
  pacha.cuisine = pacha.cuisine || "Nightclub / Venue";
  pacha.tags = ["Nightlife", "Club", "Electronic Music", "Outdoor", "Festival"];
  pacha.indicators = ["new"];
  pacha.trending = true;
  console.log('  ✓ Updated Pacha New York description and details');
}
html = html.slice(0, nycArrStart) + JSON.stringify(nyc) + html.slice(ne);

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ All hospitality group updates applied!');
