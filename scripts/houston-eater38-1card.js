'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

// Viola & Agnes' Neo Soul Café — confirmed missing from HOUSTON_DATA (max id 7670)
// All other 6 Eater 38 "missing" restaurants already exist (apostrophe bug in check-eater38.js)
// Verified: website neosoulfood.org, NYT 2024 "50 Favorite Places", Eater 38 Houston
const NEW_CARD = {
  id: 7671,
  name: "Viola & Agnes' Neo Soul Café",
  address: "3659 NASA Pkwy, Seabrook, TX 77586",
  lat: 29.5642372, lng: -95.0457871,
  phone: "(281) 326-2226", website: "neosoulfood.org", instagram: "viola_agnes_cafe",
  reservation: "walk-in", reserveUrl: "",
  hours: "Tue–Sat 11am–8pm, Sun 11am–4pm, Mon closed",
  cuisine: "Soul Food",
  price: 2,
  description: "A neo-soul food café in Seabrook near NASA named for chef Aaron Davis's Louisiana grandmothers. Davis channels New Orleans at every turn — gumbo built with blue crab, andouille, and okra; crispy catfish with remoulade and chili honey; chicken and waffles with a Cajun-brined bird over a buttermilk vanilla waffle. The room is small, the signage is easy to miss, and the cooking has earned a spot on the New York Times' 2024 '50 Favorite Places in America' list and a perennial seat on the Eater 38 Houston.",
  dishes: [
    "Gumbo (chicken, andouille, blue crab, okra, filé, boiled egg, rice)",
    "Crispy Fried Louisiana Catfish (cornmeal crust, remoulade, chili honey sauce)",
    "Chicken & Waffles (Cajun-brined breast, buttermilk vanilla waffle, pecan praline option)",
    "NOLA BBQ Shrimp and Grits (gulf shrimp, mushrooms, Cajun butter sauce, Gambinos French Bread)",
    "NOLA Hot Chicken Sandwich (cayenne-cane syrup sauce, jalapeño blueberry coleslaw)",
    "Sausage and Smoked Bacon Creole Stew (andouille, red Cajun gravy, cornbread)"
  ],
  score: 88,
  neighborhood: "Clear Lake",
  tags: ["Soul Food", "Cajun", "Creole", "Brunch", "Lunch", "Casual", "Clear Lake", "Seabrook", "Local Favorites"],
  indicators: [], bestOf: [], photos: [], photoUrl: "", trending: false, verified: "2026-04-29"
};

let html = fs.readFileSync(FILE, 'utf8');

// Find HOUSTON_DATA declaration (exactly 1)
const declarations = [];
let rx = /const HOUSTON_DATA\s*=\s*\[/g, match;
while ((match = rx.exec(html)) !== null) declarations.push(match.index);
console.log(`Found ${declarations.length} HOUSTON_DATA declaration(s)`);
if (declarations.length !== 1) { console.error('Expected exactly 1 declaration'); process.exit(1); }

const declIdx = declarations[0];
const startIdx = declIdx + html.slice(declIdx).match(/const HOUSTON_DATA\s*=\s*\[/)[0].length;

let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

let prevCount;
try { prevCount = eval('[' + html.slice(startIdx, closeIdx) + ']').length; }
catch (e) { console.error('Parse error reading existing data:', e.message); process.exit(1); }
console.log(`Current Houston card count: ${prevCount}`);

// Verify no duplicate id or name
const existing = eval('[' + html.slice(startIdx, closeIdx) + ']');
const dupeId = existing.find(r => r.id === NEW_CARD.id);
const dupeName = existing.find(r => r.name.toLowerCase().includes('viola') && r.name.toLowerCase().includes('agnes'));
if (dupeId) { console.error(`ID ${NEW_CARD.id} already exists: ${dupeId.name}`); process.exit(1); }
if (dupeName) { console.error(`Restaurant already exists: ${dupeName.name} (id ${dupeName.id})`); process.exit(1); }
console.log('No duplicates found — safe to insert');

const insertBlock = ',\n  ' + JSON.stringify(NEW_CARD);
html = html.slice(0, closeIdx) + insertBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const HOUSTON_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
let newCount;
try { newCount = eval('[' + html.slice(s2, p2 - 1) + ']').length; }
catch (e) { console.error('Parse error after insert:', e.message); process.exit(1); }

if (newCount !== prevCount + 1) { console.error(`Count mismatch: got ${newCount}, expected ${prevCount + 1}`); process.exit(1); }
console.log(`Houston card count after insert: ${newCount} (expected ${prevCount + 1})`);

fs.writeFileSync(FILE, html, 'utf8');
console.log(`✅ Added: "${NEW_CARD.name}" (id ${NEW_CARD.id})`);
