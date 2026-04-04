const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// --- Re-tag restaurants to correct neighborhoods ---
const retags = {
  // Move to West Village (from Uptown)
  'Malai Kitchen': 'West Village',
  'The Rustic': 'West Village',
  'Salum': 'West Village',
  'Sweetgreen': 'West Village',
  'Breadwinners Cafe & Bakery': 'West Village',
  'Ka Thai': 'West Village',
  'Standard Pour': 'West Village',
  'Mamani': 'West Village',
  'Two Hands': 'West Village',
  'The Bread Club': 'West Village',
  'Domodomo Ko': 'West Village',
  'Violet Crown Dallas': 'West Village',
  'San Martin Bakery': 'West Village',

  // Move to Oak Lawn (from Uptown)
  'Stoneleigh P': 'Oak Lawn',
  "Uncle Julio's": 'Oak Lawn',
  "Hattie B's Hot Chicken": 'Oak Lawn',
  "Javier's": 'Oak Lawn',
  'Mister O1 Extraordinary Pizza': 'Oak Lawn',

  // Consolidate East Dallas / Lakewood / M Streets / Fitzhugh
  'Rainbowcat': 'East Dallas / Lakewood',
  'Loro': 'East Dallas / Lakewood',
  "Campisi's Egyptian Restaurant": 'East Dallas / Lakewood',
  'Empire Baking Company': 'East Dallas / Lakewood',
  'Nonna': 'East Dallas / Lakewood',
  'E Bar Tex-Mex': 'East Dallas / Lakewood',
  'Pine Isle': 'East Dallas / Lakewood',
  "Gus's World Famous Fried Chicken": 'East Dallas / Lakewood',
  'Lakewood Landing': 'East Dallas / Lakewood',
  'GoodFriend Beer Garden & Burger House': 'East Dallas / Lakewood',
  'Full City Rooster': 'Cedars',  // 1810 S Akard is Cedars
  'Burger Schmurger': 'East Dallas / Lakewood',
  'Lounge Here': 'East Dallas / Lakewood',
  "Olivella's Pizza and Wine": 'East Dallas / Lakewood',
  'Saint Valentine': 'East Dallas / Lakewood',
  'La Viuda Negra': 'East Dallas / Lakewood',
  'Piada Italian Street Food': 'East Dallas / Lakewood',
  'The Corner Market': 'East Dallas / Lakewood',
  'Urbano Cafe': 'East Dallas / Lakewood',
  'Birdies Eastside': 'East Dallas / Lakewood',
  'Serritella Prime Italian': 'East Dallas / Lakewood',
  "Kalachandji's": 'East Dallas / Lakewood',
  'Gold Rush Cafe': 'East Dallas / Lakewood',
  'Jarams Donuts': 'East Dallas / Lakewood',
  'Hello Dumpling': 'East Dallas / Lakewood',
  'Medium Rare': 'East Dallas / Lakewood',
  'Waya Japanese Izakaya': 'East Dallas / Lakewood',

  // Fix mis-tagged
  'Molino Oloyo': 'Design District', // Stemmons Fwy
  'Turan Uyghur Kitchen': 'Plano',   // Coit Rd, Plano
  "Keller's Drive-In": 'North Dallas', // Harry Hines
  'Claremont Neighborhood Grill': 'Preston Hollow', // NW Hwy
  'Asian Mint': 'Oak Lawn', // 4246 Oak Lawn Ave

  // Cedars additions
  'Izkina': 'Cedars', // Botham Jean Blvd
  'The Dinner Detective': 'Cedars', // S Akard

  // Lake Highlands - already correct
};

let count = 0;
for (const [name, newNbhd] of Object.entries(retags)) {
  const nameStr = '"name":"' + name + '"';
  const idx = html.indexOf(nameStr);
  if (idx === -1) { console.log('NOT FOUND:', name); continue; }

  const entryStart = html.lastIndexOf('{', idx);
  const region = html.substring(entryStart, entryStart + 2000);
  const nbhdMatch = region.match(/"neighborhood":"([^"]*)"/);
  if (!nbhdMatch) { console.log('NO NBHD:', name); continue; }

  const oldNbhd = nbhdMatch[1];
  if (oldNbhd === newNbhd) { continue; } // already correct

  const oldStr = '"neighborhood":"' + oldNbhd + '"';
  const newStr = '"neighborhood":"' + newNbhd + '"';
  const absIdx = html.indexOf(oldStr, entryStart);
  if (absIdx === -1 || absIdx > entryStart + 2000) { console.log('NBHD STR NOT FOUND:', name); continue; }

  html = html.substring(0, absIdx) + newStr + html.substring(absIdx + oldStr.length);
  console.log(name + ': ' + oldNbhd + ' → ' + newNbhd);
  count++;
}

console.log('\nRe-tagged:', count, 'restaurants');

// --- Add neighborhood guide cards ---
// Find DALLAS_NEIGHBORHOODS object
const nbhdIdx = html.indexOf('DALLAS_NEIGHBORHOODS');
if (nbhdIdx === -1) { console.error('DALLAS_NEIGHBORHOODS not found'); process.exit(1); }

// Find the closing }; of the object
const objStart = html.indexOf('{', nbhdIdx);
let objDepth = 0, objEnd = objStart;
for (let i = objStart; i < html.length; i++) {
  if (html[i] === '{') objDepth++;
  if (html[i] === '}') { objDepth--; if (objDepth === 0) { objEnd = i; break; } }
}

// Check which neighborhoods already exist
const hasEastDallas = html.substring(objStart, objEnd).includes("'East Dallas");
const hasCedars = html.substring(objStart, objEnd).includes("'Cedars'");
const hasWestVillage = html.substring(objStart, objEnd).includes("'West Village'");
const hasLakeHighlands = html.substring(objStart, objEnd).includes("'Lake Highlands'");

const newNbhds = [];

if (!hasEastDallas) {
  newNbhds.push(`    'East Dallas / Lakewood':{emoji:'🏡',vibe:'The heart of residential Dallas dining. Lakewood, the M Streets, and Mockingbird corridor form a neighborhood restaurant scene that rivals any in the city. Less scene, more substance.',bestFor:'Neighborhood Gems, Brunch, Casual Date Night',knownFor:'Hello Dumpling, Lakewood Landing, GoodFriend, Jarams Donuts, Waya Izakaya',mustVisit:'Hello Dumpling, GoodFriend Beer Garden, Campisi\\'s, Lakewood Landing',tip:'Mockingbird east of 75 has a great cluster of shops and restaurants. Abrams Rd near Lakewood is the local breakfast strip.'}`);
}
if (!hasCedars) {
  newNbhds.push(`    'Cedars':{emoji:'🏗️',vibe:'South of downtown, the Cedars is Dallas emerging creative district. Former warehouses now house breweries, art spaces, and some of the city most exciting restaurants.',bestFor:'Craft Beer, Creative Dining, Art Scene',knownFor:'Written by the Seasons, Four Corners Brewing, Full City Rooster, Lee Harvey\\'s',mustVisit:'Written by the Seasons, Lee Harvey\\'s, Four Corners Brewing',tip:'Lee Harvey\\'s outdoor patio is one of the best dive bar patios in Dallas. Written by the Seasons is a must-book.'}`);
}
if (!hasWestVillage) {
  newNbhds.push(`    'West Village':{emoji:'🛍️',vibe:'Uptown walkable village with a European feel. Tree-lined streets, boutique shopping, and a dense concentration of restaurants and cafes. The McKinney Ave Trolley runs right through.',bestFor:'Brunch, Shopping + Dining, Casual',knownFor:'Malai Kitchen, The Rustic, Sweetgreen, San Martin Bakery, Violet Crown Cinema',mustVisit:'Malai Kitchen, Salum, The Rustic, Ka Thai',tip:'Park once and walk -- everything is within a few blocks. The McKinney Ave Trolley is free and connects to Uptown bars south.'}`);
}
if (!hasLakeHighlands) {
  newNbhds.push(`    'Lake Highlands':{emoji:'🌲',vibe:'Northeast Dallas neighborhood with a growing food and drink scene anchored by the Walnut Hill corridor. Local favorites, craft breweries, and the kind of neighborhood spots where regulars are the norm.',bestFor:'Neighborhood Dining, Craft Beer, Casual',knownFor:'Goldie\\'s, Vector Brewing, Mariano\\'s Hacienda',mustVisit:'Goldie\\'s, Vector Brewing',tip:'The Walnut Hill Ln corridor near Audelia has the best concentration. Goldie\\'s is worth the drive from anywhere in Dallas.'}`);
}

if (newNbhds.length > 0) {
  // Insert before closing brace
  const insertPoint = objEnd;
  const insertStr = ',\n' + newNbhds.join(',\n') + '\n';
  html = html.substring(0, insertPoint) + insertStr + html.substring(insertPoint);
  console.log('Added', newNbhds.length, 'new neighborhood guide cards');
}

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(__dirname, '..', 'index'), html);
console.log('Done!');
