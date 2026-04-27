#!/usr/bin/env node
// Add/update dishes and coordinates for specific entries.
// Only add dishes from verified sources (training knowledge of well-known restaurants,
// national chains, and famous local spots).
// Run: node scripts/add-dishes.js

const fs = require('fs');
const path = require('path');

// Format: { cityKey, id, dishes?, lat?, lng?, indicators? }
// indicators:[] clears the verify-coords flag once real coords are set
const UPDATES = [
  // ── Austin verify-coords fixes ─────────────────────────────────────────────
  { city: 'AUSTIN_DATA', id: 5633, lat: 30.5169, lng: -97.6859, indicators: [] },
  { city: 'AUSTIN_DATA', id: 5635, lat: 30.4871, lng: -97.6790, indicators: [] },

  // ── Austin empty dishes (well-known venues) ────────────────────────────────
  { city: 'AUSTIN_DATA', id: 5460,
    dishes: ['Tonkotsu', 'Spicy Tonkotsu', 'Tan Tan Men', 'Shoyu'] },            // Ramen Tatsu-Ya
  { city: 'AUSTIN_DATA', id: 5463,
    dishes: ['Croissant French Toast', 'Seasonal Salad', 'Weekend Brunch Cocktails'] }, // Josephine House
  { city: 'AUSTIN_DATA', id: 5482,
    dishes: ["Chef's Tasting Pasta", 'Seasonal Small Plates', 'Wine Pairing'] }, // Pasta|Bar Austin
  { city: 'AUSTIN_DATA', id: 5490,
    dishes: ['Bone-In Filet', 'Prime Ribeye', 'Giant Glazed Carrot'] },          // Bob's Steak & Chop House
  { city: 'AUSTIN_DATA', id: 5491,
    dishes: ['Prime Bone-In Ribeye', 'Fresh Oysters', 'Veal Chop'] },            // III Forks
  { city: 'AUSTIN_DATA', id: 5492,
    dishes: ['Prime Ribeye', 'Chilean Sea Bass', 'Lobster Tail'] },              // Fleming's
  { city: 'AUSTIN_DATA', id: 5493,
    dishes: ['USDA Prime Filet', 'Sizzling Filet', 'Lobster Mac & Cheese'] },   // Ruth's Chris
  { city: 'AUSTIN_DATA', id: 5506,
    dishes: ['Maine Lobster Roll', 'Lobster Bisque', 'New England Clam Chowder'] }, // Garbo's Lobster
  { city: 'AUSTIN_DATA', id: 5547,
    dishes: ['Pad Thai', 'Boat Noodles', 'Green Papaya Salad'] },                // Sway Thai

  // ── Las Vegas empty dishes (well-known venues) ────────────────────────────
  { city: 'LV_DATA', id: 12288,
    dishes: ['Fermented Black Bean Ceviche', 'Lobster Paella', 'Jamon Ibérico'] }, // Amador (José Andrés, Aria)
  { city: 'LV_DATA', id: 12296,
    dishes: ['Birria Tatemada', 'Carnitas', 'Tamales', 'Caldo de Res'] },        // Lindo Michoacan
  { city: 'LV_DATA', id: 12344,
    dishes: ['Cacio e Pepe', 'Handmade Rigatoni', 'Vitello Tonnato'] },          // Al Solito Posto (Venetian)
  { city: 'LV_DATA', id: 12357,
    dishes: ['Peking Duck', 'Dim Sum Cart', 'BBQ Char Siu Pork'] },              // Genting Palace (Resorts World)
  { city: 'LV_DATA', id: 12367,
    dishes: ['Matcha Parfait', 'Seasonal Fruit Cake', 'Japanese Soft Serve'] },  // Sweets Raku
  { city: 'LV_DATA', id: 12273,
    dishes: ['Margherita Pizza', 'Bufala Pizza', 'Tiramisu'] },                  // Settebello Pizzeria
  { city: 'LV_DATA', id: 12276,
    dishes: ['Pad See Ew', 'Drunken Noodles', 'Tom Kha Soup'] },                 // Nittaya's Secret Kitchen
  { city: 'LV_DATA', id: 12278,
    dishes: ['Lanzhou Beef Noodle', 'Pork Wontons', 'Dumplings'] },              // Shang Artisan Noodle
  { city: 'LV_DATA', id: 12284,
    dishes: ['Fried Chicken & Waffles', 'Biscuits & Jam', 'Deviled Eggs'] },    // Yardbird Southern Table
  { city: 'LV_DATA', id: 12389,
    dishes: ['Wood-Fired Pizza', 'House Rigatoni', 'Bruschetta Sampler'] },      // Monzu Italian Oven + Bar
  { city: 'LV_DATA', id: 12390,
    dishes: ['Lobster Ravioli', 'Osso Buco', 'Tiramisu'] },                      // Nora Italian Cuisine

  // ── SLC empty dishes (well-known venues) ──────────────────────────────────
  { city: 'SLC_DATA', id: 11485,
    dishes: ['Tagliatelle Bolognese', 'Handmade Gnocchi', 'Osso Buco'] },        // Veneto Ristorante
  { city: 'SLC_DATA', id: 11465,
    dishes: ['Duck Confit', 'French Onion Soup', 'Bouillabaisse'] },             // Roux SLC (French)
  { city: 'SLC_DATA', id: 11470,
    dishes: ['Dry-Aged Ribeye', 'Wagyu Burger', 'Bone Marrow'] },                // Hoof & Vine
  { city: 'SLC_DATA', id: 11525,
    dishes: ['Prime Ribeye', 'Chilean Sea Bass', 'Lobster Tail'] },              // Fleming's (national chain)
  { city: 'SLC_DATA', id: 11529,
    dishes: ['Wagyu Strip', 'Wagyu Sliders', 'Bone-In Ribeye'] },                // STK Steakhouse
  { city: 'SLC_DATA', id: 11472,
    dishes: ['Chef Omakase', 'Salmon Sashimi', 'Dragon Roll'] },                 // Miyazaki
  { city: 'SLC_DATA', id: 11490,
    dishes: ['Fried Chicken & Waffles', 'Mac & Cheese', 'Cornbread'] },          // Sauce Boss Southern Kitchen
  { city: 'SLC_DATA', id: 11463,
    dishes: ['Picanha (Top Sirloin)', 'Churrasco Rotisserie', 'Cheese Bread'] }, // Rodizio Grill (Brazilian chain)
];

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
let updated = 0;

// Parse a city array from html
function getCityBounds(cityKey) {
  const s = html.indexOf('const ' + cityKey);
  if (s < 0) return null;
  const a = html.indexOf('[', s);
  let depth = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') { depth--; if (depth === 0) { e = i + 1; break; } }
  }
  return { start: a, end: e };
}

// Find a single entry's brace bounds within html
function findEntryBounds(cityStart, cityEnd, id) {
  const slice = html.slice(cityStart, cityEnd);
  const idPat = new RegExp('"id":' + id + '[,}]');
  const m = idPat.exec(slice);
  if (!m) return null;

  let braceStart = cityStart + m.index;
  while (braceStart > cityStart && html[braceStart] !== '{') braceStart--;
  let depth = 0, braceEnd = braceStart;
  for (let i = braceStart; i < cityEnd; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') { depth--; if (depth === 0) { braceEnd = i; break; } }
  }
  return { start: braceStart, end: braceEnd };
}

// Group updates by city to avoid re-parsing repeatedly
const byCityId = {};
for (const u of UPDATES) {
  if (!byCityId[u.city]) byCityId[u.city] = [];
  byCityId[u.city].push(u);
}

for (const [cityKey, cityUpdates] of Object.entries(byCityId)) {
  let bounds = getCityBounds(cityKey);
  if (!bounds) { console.error('City not found: ' + cityKey); continue; }

  for (const u of cityUpdates) {
    bounds = getCityBounds(cityKey); // refresh after each html mutation
    const eb = findEntryBounds(bounds.start, bounds.end, u.id);
    if (!eb) { console.warn('  ⚠️  ' + cityKey + ' #' + u.id + ': not found'); continue; }

    let entry = html.slice(eb.start, eb.end + 1);

    if (u.dishes !== undefined) {
      const dishStr = JSON.stringify(u.dishes);
      const newEntry = entry.replace(/"dishes":\[[^\]]*\]/, '"dishes":' + dishStr);
      if (newEntry === entry) { console.warn('  ⚠️  ' + cityKey + ' #' + u.id + ': dishes field not found'); continue; }
      entry = newEntry;
    }
    if (u.lat !== undefined) {
      entry = entry.replace(/"lat":[0-9.\-]+/, '"lat":' + u.lat);
    }
    if (u.lng !== undefined) {
      entry = entry.replace(/"lng":[0-9.\-]+/, '"lng":' + u.lng);
    }
    if (u.indicators !== undefined) {
      entry = entry.replace(/"indicators":\[[^\]]*\]/, '"indicators":' + JSON.stringify(u.indicators));
    }

    html = html.slice(0, eb.start) + entry + html.slice(eb.end + 1);
    updated++;
    const what = [u.dishes ? 'dishes' : null, u.lat ? 'coords' : null, u.indicators !== undefined ? 'indicators' : null].filter(Boolean).join('+');
    console.log('  ✅ ' + cityKey + ' #' + u.id + ' [' + what + ']');
  }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('\nTotal: ' + updated + ' entries updated.');
