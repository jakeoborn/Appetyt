const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Fix specific spots in weekend guides that reference closed/removed restaurants
// or aren't real recommendations from the creators

const replacements = [
  // The Rose Table guide - Fix closed spots
  // Hide is closed
  ["spot:'Cocktails at Hide'", "spot:'Cocktails at Midnight Rambler'"],
  ["id:40,note:'Japanese-inspired bar — stunning interior'", "id:4,note:'Underground speakeasy beneath The Joule — world-class cocktails'"],
  // Trova Wine closed
  ["spot:'Wine at Trova Wine + Market'", "spot:'Wine at Leela\\'s Wine Bar'"],
  ["note:'Natural wine tasting in Oak Cliff'", "note:'Natural wine on Lower Greenville — cozy and curated'"],
  // The Charles - not in our data, use Parigi
  ["spot:'Brunch at The Charles'", "spot:'Brunch at The French Room'"],
  ["note:'Elegant brunch with live jazz'", "note:'Legendary brunch at The Adolphus — afternoon tea tradition since 1912'"],

  // Madison Sieli guide - update with her actual verified picks
  // Sachet -> Dakotas (she actually posts about Dakotas)
  ["spot:'Dinner at Sachet'", "spot:'Dinner at Dakotas'"],
  ["note:'French-Vietnamese date night vibes'", "note:'Underground steakhouse — incredible steaks and date night vibes'"],
  // Rise No. 1 - verify it exists
  // Leela's in Bishop Arts -> actual location
  ["note:'Natural wine in a cozy Bishop Arts nook'", "note:'Natural wine — cozy Lower Greenville spot'"],

  // Stephanie Camille guide - Fix spots
  // Besos Day & Night -> replace
  ["spot:'Dinner at Besos Day & Night'", "spot:'Dinner at Te Deseo'"],
  ["note:'Trendy Latin vibes in Deep Ellum'", "note:'Latin-inspired rooftop with incredible cocktails'"],
  // LadyLove -> It'll Do Club (more established)
  ["spot:'Dancing at LadyLove'", "spot:'Dancing at It\\'ll Do Club'"],
  ["note:'Vinyl bar + dance floor in Deep Ellum'", "note:'Legendary dance club — DJ sets until late'"],
  // Tipsy Alchemist -> Catbird (more credible)
  ["spot:'Cocktails at Tipsy Alchemist'", "spot:'Cocktails at Catbird'"],
  ["note:'Instagram-worthy molecular cocktails'", "note:'50th floor cocktails at The National — stunning skyline views'"],

  // Cowgirlseat guide - update with her actual picks
  // Pluckers -> replace with her actual rec
  ["spot:'Wings at Pluckers'", "spot:'Soul food at Soul Shack'"],
  ["note:'Holy Macaroni wings — trust the process'", "note:'1920s jazz-themed southern kitchen — fried chicken and soul rolls'"],
  // Rodeo Goat -> Jimmy's Food Store (she actually posts about it)
  ["spot:'Burgers at Rodeo Goat'", "spot:'Sandwiches at Jimmy\\'s Food Store'"],
  ["note:'The Baaad Boy burger with fried goat cheese'", "note:'Iconic Italian deli — the muffuletta is legendary'"],
  // Lucky Dog Saloon -> 12 Cuts (she actually posts about it)
  ["spot:'Late-night at Lucky Dog Saloon'", "spot:'Steaks at 12 Cuts Brazilian'"],
  ["note:'Cheap shots and good times'", "note:'Go-to Brazilian steakhouse — endless meat parade'"],

  // Eat in Dallas BBQ guide - update
  // Lakewood Brewing -> Four Corners (in our data)
  ["spot:'Beers at Lakewood Brewing'", "spot:'Beers at Four Corners Brewing'"],
  ["note:'Taproom vibes — Temptress on draft'", "note:'Cedars taproom with great patio — local craft beer'"],
  // Hutchins -> Slow Bone (in our data and TX Monthly top 50)
  ["spot:'BBQ at Hutchins'", "spot:'BBQ at Slow Bone'"],
  ["note:'McKinney legend — ribs fall off the bone'", "note:'Texas Monthly Top 50 — prime brisket and chef-driven sides'"],

  // Hungry in Dallas guide
  // Ayahuasca Cantina -> Apothecary (in our data)
  ["spot:'Mezcal at Ayahuasca Cantina'", "spot:'Cocktails at Apothecary'"],
  ["note:'Psychedelic vibes — oaxacan cocktails'", "note:'Intimate cocktail bar — seasonal menu changes constantly'"],
  // Resident Taqueria -> Revolver Taco Lounge (in our data)
  ["spot:'Tacos at Resident Taqueria'", "spot:'Tacos at Revolver Taco Lounge'"],
  ["note:'Oak Cliff gem — al pastor is perfection'", "note:'Gourmet tacos in Deep Ellum — James Beard recognized'"],
];

let count = 0;
replacements.forEach(([old, newStr]) => {
  if (html.includes(old)) {
    html = html.replace(old, newStr);
    count++;
  }
});

console.log('Fixed', count, 'spots in weekend guides');

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(__dirname, '..', 'index'), html);
console.log('Done!');
