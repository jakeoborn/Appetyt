#!/usr/bin/env node
// Add bestOf editorial rankings for cities that have zero bestOf data.
// Assignments are based on critical consensus: Michelin, James Beard,
// Eater, Infatuation, Bon Appétit, and longstanding local reputation.
// Run: node scripts/add-bestof-cities.js

const fs = require('fs');
const path = require('path');

const BESTOF = {
  CHICAGO_DATA: [
    { name: 'Alinea',                     bestOf: ['#1 Best Overall','#1 Best Tasting Menu','#1 Best Fine Dining'] },
    { name: 'Smyth',                       bestOf: ['#2 Best Tasting Menu','#2 Best Fine Dining'] },
    { name: 'Girl & the Goat',             bestOf: ['#1 Best New American','#1 Best Date Night'] },
    { name: 'Avec',                        bestOf: ['#2 Best Date Night','#1 Best Mediterranean'] },
    { name: 'Au Cheval',                   bestOf: ['#1 Best Burger','#1 Best Late Night'] },
    { name: "Pequod's Pizza",              bestOf: ['#1 Best Deep Dish Pizza'] },
    { name: "Lou Malnati's Pizzeria",      bestOf: ['#2 Best Deep Dish Pizza'] },
    { name: 'Topolobampo',                 bestOf: ['#1 Best Mexican Fine Dining','#3 Best Fine Dining'] },
    { name: 'Frontera Grill',              bestOf: ['#2 Best Mexican','#2 Best Brunch'] },
    { name: "Johnnie's Beef",              bestOf: ['#1 Best Italian Beef'] },
    { name: "Portillo's",                  bestOf: ['#2 Best Italian Beef','#1 Best Chicago Dog'] },
    { name: "Gene & Jude's",               bestOf: ['#2 Best Hot Dog'] },
    { name: 'Honey Butter Fried Chicken',  bestOf: ['#1 Best Fried Chicken'] },
    { name: "Bavette's Bar & Boeuf",       bestOf: ['#1 Best Steakhouse','#3 Best Date Night'] },
    { name: 'Gibsons Bar & Steakhouse',    bestOf: ['#2 Best Steakhouse'] },
    { name: 'The Violet Hour',             bestOf: ['#1 Best Cocktails'] },
    { name: 'Publican',                    bestOf: ['#1 Best Beer Hall','#1 Best Pork'] },
    { name: 'Parachute',                   bestOf: ['#1 Best Neighborhood','#1 Best Brunch'] },
    { name: 'RPM Italian',                 bestOf: ['#1 Best Italian','#2 Best Celebration'] },
    { name: 'Boka Restaurant',             bestOf: ['#4 Best Fine Dining','#4 Best Date Night'] },
  ],

  LA_DATA: [
    { name: 'n/naka',                           bestOf: ['#1 Best Omakase','#1 Best Fine Dining','#1 Best Overall'] },
    { name: 'Bestia',                           bestOf: ['#1 Best Italian','#1 Best Date Night'] },
    { name: 'Vespertine',                       bestOf: ['#2 Best Tasting Menu','#2 Best Fine Dining'] },
    { name: 'Spago',                            bestOf: ['#1 Best Classic LA','#3 Best Fine Dining'] },
    { name: 'Majordomo',                        bestOf: ['#1 Best New American','#2 Best Overall'] },
    { name: "Langer's Delicatessen-Restaurant", bestOf: ['#1 Best Pastrami','#1 Best Deli'] },
    { name: "Father's Office",                  bestOf: ['#1 Best Burger'] },
    { name: "Jon & Vinny's Fairfax",            bestOf: ['#1 Best Pasta','#1 Best Casual Italian'] },
    { name: "Howlin' Ray's",                    bestOf: ['#1 Best Fried Chicken','#1 Best Hot Chicken'] },
    { name: 'Republique',                       bestOf: ['#1 Best Brunch','#1 Best French'] },
    { name: 'SUGARFISH',                        bestOf: ['#1 Best Sushi (Casual)'] },
    { name: 'Osteria Mozza',                    bestOf: ['#2 Best Italian','#2 Best Date Night'] },
    { name: 'Guerrilla Tacos',                  bestOf: ['#1 Best Tacos','#1 Best Street Food'] },
  ],

  AUSTIN_DATA: [
    { name: 'Franklin Barbecue',      bestOf: ['#1 Best BBQ','#1 Best Overall','#1 Best Brisket'] },
    { name: 'Suerte',                  bestOf: ['#1 Best Mexican','#1 Best Tacos','#1 Best Date Night'] },
    { name: 'Hestia',                  bestOf: ['#1 Best Fine Dining','#2 Best Date Night','#2 Best Overall'] },
    { name: 'Emmer & Rye',             bestOf: ['#1 Best Tasting Menu','#3 Best Fine Dining'] },
    { name: 'Nixta Taqueria',          bestOf: ['#2 Best Tacos','#2 Best Mexican'] },
    { name: 'Uchi',                    bestOf: ['#1 Best Japanese','#1 Best Sushi','#3 Best Date Night'] },
    { name: 'Odd Duck',                bestOf: ['#1 Best New American'] },
    { name: 'la Barbecue',             bestOf: ['#2 Best BBQ','#2 Best Brisket'] },
    { name: "Valentina's Tex Mex BBQ", bestOf: ['#1 Best Breakfast Tacos','#3 Best BBQ'] },
    { name: 'Kemuri Tatsu-ya',         bestOf: ['#1 Best Japanese BBQ','#4 Best Overall'] },
    { name: 'Barley Swine',            bestOf: ['#4 Best Fine Dining','#3 Best New American'] },
  ],

  SLC_DATA: [
    { name: "Valter's Osteria", bestOf: ['#1 Best Italian','#1 Best Date Night','#1 Best Fine Dining'] },
    { name: 'Takashi',           bestOf: ['#1 Best Sushi','#1 Best Japanese'] },
    { name: 'Log Haven',         bestOf: ['#2 Best Fine Dining','#2 Best Date Night','#2 Best Overall'] },
    { name: 'Handle',            bestOf: ['#1 Best New American','#3 Best Date Night'] },
    { name: 'HSL',               bestOf: ['#2 Best New American','#3 Best Fine Dining'] },
    { name: 'Uchi',              bestOf: ['#1 Best Omakase','#3 Best Japanese'] },
    { name: 'Urban Hill',        bestOf: ['#4 Best Fine Dining','#1 Best Brunch'] },
    { name: 'Crown Burgers',     bestOf: ['#1 Best Pastrami Burger','#1 Best Burger'] },
    { name: 'Red Iguana',        bestOf: ['#1 Best Mexican','#1 Best Mole'] },
    { name: 'Riverhorse on Main',bestOf: ['#1 Best Park City Fine Dining','#1 Best Celebration'] },
  ],
};

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
let totalUpdated = 0;

for (const [cityKey, entries] of Object.entries(BESTOF)) {
  let updated = 0;
  const cityStart = html.indexOf('const ' + cityKey);
  if (cityStart < 0) { console.error('City not found: ' + cityKey); continue; }
  const arrStart = html.indexOf('[', cityStart);
  let depth = 0, arrEnd = arrStart;
  for (let i = arrStart; i < html.length; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i + 1; break; } }
  }

  for (const { name, bestOf } of entries) {
    const citySlice = html.slice(arrStart, arrEnd);
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp('"name":"' + escapedName + '"');
    const nameMatch = namePattern.exec(citySlice);
    if (!nameMatch) {
      console.warn(`  ⚠️  ${cityKey}: "${name}" not found`);
      continue;
    }

    const entryStart = arrStart + nameMatch.index;
    let braceStart = entryStart;
    while (braceStart > arrStart && html[braceStart] !== '{') braceStart--;
    let bd = 0, braceEnd = braceStart;
    for (let i = braceStart; i < arrEnd; i++) {
      if (html[i] === '{') bd++;
      if (html[i] === '}') { bd--; if (bd === 0) { braceEnd = i; break; } }
    }

    const entrySlice = html.slice(braceStart, braceEnd + 1);
    const bestOfStr = JSON.stringify(bestOf);
    const newSlice = entrySlice.replace(/"bestOf":\[[^\]]*\]/, '"bestOf":' + bestOfStr);

    if (newSlice === entrySlice) {
      console.warn(`  ⚠️  ${cityKey}: "${name}" bestOf field not found or unchanged`);
      continue;
    }

    html = html.slice(0, braceStart) + newSlice + html.slice(braceEnd + 1);
    // Recompute arrEnd after modification
    const lenDiff = newSlice.length - entrySlice.length;
    arrEnd += lenDiff;
    updated++;
    totalUpdated++;
    console.log(`  ✅ ${cityKey}: "${name}" → ${bestOfStr}`);
  }
  console.log(`${cityKey}: ${updated}/${entries.length} updated\n`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Total: ${totalUpdated} entries updated.`);
