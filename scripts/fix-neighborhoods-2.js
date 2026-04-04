const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const retags = {
  // === Tagged UPTOWN but wrong ===
  'Tatsu Dallas': 'Deep Ellum',           // 3309 Elm St - Deep Ellum
  'Eataly': 'NorthPark',                  // 8687 N Central Expy - NorthPark Center
  "Pappasito's Cantina": 'Northwest Dallas', // 10433 Lombardy Ln
  'Georgie': 'Knox Henderson',            // 4514 Travis St - Knox/Travis Walk
  "Bob's Steak & Chop House": 'Downtown Dallas', // 555 S Lamar - downtown
  'Velvet Taco': 'Deep Ellum',            // 2556 Elm St - Deep Ellum
  'Shinsei': 'Inwood Village',            // 7713 Inwood Rd
  "Drake's Hollywood": 'Inwood Village',  // 5007 W Lovers Ln
  "Barsotti's": 'Oak Lawn',              // 4208 Oak Lawn Ave
  'Zalat Pizza': 'Cedars',               // 1210 Botham Jean Blvd
  "Terilli's": 'Lower Greenville',       // 2815 Greenville Ave
  'Studio Movie Grill Dallas': 'North Dallas', // 11170 N Central Expy
  'Joey Dallas': 'NorthPark',            // 8687 N Central Expy
  'Coupes': 'Oak Lawn',                  // 4234 Oak Lawn Ave
  "Clark's Oyster Bar": 'Knox Henderson', // 4155 Buena Vista - Knox area
  'White Rhino Coffee': 'Downtown Dallas', // 1401 Elm St
  'Black Swan Saloon': 'Uptown',         // 1623 N Hall St - actually IS Uptown/State-Thomas

  // === Tagged DEEP ELLUM but wrong ===
  'La Rue Doughnuts': 'Trinity Groves',   // 3011 Gulden Ln
  'The Libertine': 'Lower Greenville',    // 2101 Greenville Ave
  'Crown Block': 'Downtown Dallas',       // 300 Reunion Blvd - Reunion Tower
  'Mot Hai Ba': 'East Dallas / Lakewood', // 6047 Lewis St - Lakewood
  'Merit Coffee': 'Oak Lawn',             // 4228 Oak Lawn Ave
  'Honor Bar Dallas': 'Highland Park Village', // near HP Village
  'Maman': 'Preston Center',             // 4004 Villanova St
  "Torchy's Tacos": 'Cedar Springs',     // 2305 Cedar Springs Rd
  "Stan's Blue Note": 'Lower Greenville', // 2908 Greenville Ave
  'Night Rooster Dallas': 'Design District', // 1000 N Riverfront Blvd
  "Lucky's Hot Chicken": 'East Dallas / Lakewood', // 4505 Gaston Ave
  'Fortunate Son': 'Garland',            // 500 Main St, Garland
  'Sky Rocket Burger': 'Far North Dallas', // 7877 Frankford Rd
  'The Meteor': 'Design District',        // 1970 Hi Line Dr
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
  if (oldNbhd === newNbhd) { continue; }

  const oldStr = '"neighborhood":"' + oldNbhd + '"';
  const newStr = '"neighborhood":"' + newNbhd + '"';
  const absIdx = html.indexOf(oldStr, entryStart);
  if (absIdx === -1 || absIdx > entryStart + 2000) { console.log('STR NOT FOUND:', name); continue; }

  html = html.substring(0, absIdx) + newStr + html.substring(absIdx + oldStr.length);
  console.log(name + ': ' + oldNbhd + ' → ' + newNbhd);
  count++;
}

console.log('\nRe-tagged:', count);

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(__dirname, '..', 'index'), html);
console.log('Done!');
