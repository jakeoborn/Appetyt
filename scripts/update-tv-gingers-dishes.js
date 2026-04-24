#!/usr/bin/env node
// Update Tiny Victories (id 453) + Ginger's (id 195) with specific
// cocktails (not "Beer & Wine" / "Bar Snacks" placeholders) and add
// menuUrl pointing to each venue's live menu.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const edits = [
  {
    name: 'Tiny Victories (id 453)',
    from: '"dishes":["Craft Classic Cocktails","Beer & Wine","Seasonal Drinks"]',
    to:   '"dishes":["Blu-Tang Clan","For Whom the Bell Pepper Tolls","Grandmasterrazz","Back Dat Cass Up","Espresso Martini"],"menuUrl":"https://tinyvictoriesoc.com"'
  },
  {
    name: "Ginger's (id 195)",
    from: '"dishes":["Classic Cocktails","Premium Spirits","Bar Snacks"]',
    to:   '"dishes":["Ginger\'s Old Fashioned","Ginger\'s Mule","Barrel-Aged Black Manhattan","Pornstar Martini","Ginger\'s Pie"],"menuUrl":"https://gingersdallas.com/menu/"'
  },
];

for (const e of edits) {
  const before = html.length;
  const count = html.split(e.from).length - 1;
  if (count === 0) {
    console.log(`SKIP ${e.name}: pattern not found`);
    continue;
  }
  html = html.split(e.from).join(e.to);
  console.log(`${e.name}: replaced ${count}× (expected 2: live + mirror)`);
}

fs.writeFileSync(FILE, html);
console.log('Done.');
