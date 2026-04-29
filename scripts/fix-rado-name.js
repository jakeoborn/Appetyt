'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

let html = fs.readFileSync(FILE, 'utf8');

// Find HOUSTON_DATA
const m = html.match(/const HOUSTON_DATA\s*=\s*\[/);
const startIdx = m.index + m[0].length;
let depth = 1, pos = startIdx;
while (pos < html.length && depth > 0) {
  if (html[pos] === '[') depth++;
  else if (html[pos] === ']') depth--;
  pos++;
}
const closeIdx = pos - 1;

let data = eval('[' + html.slice(startIdx, closeIdx) + ']');
const entry = data.find(r => r.id === 7110);
if (!entry) { console.error('id 7110 not found'); process.exit(1); }
console.log('Before:', entry.name, '|', entry.cuisine, '|', entry.neighborhood);

// Apply corrections verified from radomarket.com
entry.name        = "The Rado Market";
entry.cuisine     = "Café / Market";
entry.neighborhood = "Third Ward";
entry.tags        = ["Café", "Coffee", "Breakfast", "Brunch", "Market", "Third Ward", "Casual", "Local Favorites"];
entry.description = "A hybrid all-day café and neighborhood market in the Third Ward, housed beneath the historic Eldorado Ballroom and operated by Lucille's Hospitality Group. The kitchen serves a bistro-inspired menu of chef-driven sandwiches, salads, breakfast, and brunch alongside specialty coffee, retail beer and wine, and a market stocked with locally grown produce and goods from community entrepreneurs. Proceeds from produce sales fund the Lucille's 1913 Farming Initiative.";
entry.dishes      = ["Oxtail Smash Burger (oxtail patty, arugula, provolone, garlic aioli, tomato jam, pickled onions)", "Jerk Wings (housemade jerk spiced wings)", "Rado Hash (blackened chicken, potato hash, greens, 2 eggs)", "MKT Tacos (tacos of the day, white rice, black-eyed peas)", "Pound Cake Waffle (bananas, fresh berries, spiked syrup)", "BYOB (housemade biscuit, poblano gravy, green onions)", "Avocado Toast (smashed avocado, sliced tomatoes, egg your way, pico)"];
entry.hours       = "Tue–Sun 8am–4pm, Breakfast ends 11am, Fri–Sun Brunch all day, Mon closed";
entry.price       = 2;

console.log('After:', entry.name, '|', entry.cuisine, '|', entry.neighborhood);

const newBlock = data.map(c => JSON.stringify(c)).join(',\n');
html = html.slice(0, startIdx) + '\n' + newBlock + '\n' + html.slice(closeIdx);

// Verify
const m2 = html.match(/const HOUSTON_DATA\s*=\s*\[/);
const s2 = m2.index + m2[0].length;
let d2 = 1, p2 = s2;
while (p2 < html.length && d2 > 0) {
  if (html[p2] === '[') d2++;
  else if (html[p2] === ']') d2--;
  p2++;
}
const count = eval('[' + html.slice(s2, p2 - 1) + ']').length;
console.log('Houston count after fix:', count);

fs.writeFileSync(FILE, html, 'utf8');
console.log('✅ Done');
