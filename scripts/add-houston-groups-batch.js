// Add Houston hospitality group restaurants:
// Goodnight Hospitality, ALIFE Hospitality, LHG (Chris Williams), The Big Vibe Group
// + Update March group field
// Run: node scripts/add-houston-groups-batch.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const s = html.indexOf('const HOUSTON_DATA');
const a = html.indexOf('[', s);
let d=0, e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id)) + 1;
let added = 0;

// Update March group
const march = arr.find(r=>r.name==='March');
if(march) { march.group = 'Goodnight Hospitality'; console.log('Updated March -> Goodnight Hospitality'); }

// Update Lucille's group
const lucilles = arr.find(r=>r.name.toLowerCase().includes('lucille'));
if(lucilles && !lucilles.group) { lucilles.group = 'LHG (Chris Williams)'; console.log('Updated '+lucilles.name+' -> LHG'); }

function add(spot) {
  if(existing.has(spot.name.toLowerCase())) { console.log('  SKIP:', spot.name); return; }
  arr.push({
    id: nextId++, name: spot.name, phone: spot.phone||'', cuisine: spot.cuisine,
    neighborhood: spot.neighborhood, score: spot.score, price: spot.price,
    tags: spot.tags, indicators: spot.indicators||[], hh: '', reservation: spot.reservation||'walk-in',
    awards: spot.awards||'', description: spot.description, dishes: spot.dishes,
    address: spot.address, hours: spot.hours||'', lat: spot.lat, lng: spot.lng,
    bestOf:[], busyness:null, waitTime:null, popularTimes:null, lastUpdated:null,
    trending: spot.trending||false, group: spot.group||'',
    instagram: spot.instagram||'', website: spot.website||'',
    suburb:false, reserveUrl:'', menuUrl:'', res_tier: spot.res_tier||2,
  });
  existing.add(spot.name.toLowerCase());
  added++;
  console.log('  ADDED:', spot.name, '('+nextId-1+')');
}

// ═══════════════════════════════════════════
// GOODNIGHT HOSPITALITY
// ═══════════════════════════════════════════
console.log('\n--- Goodnight Hospitality ---');

add({
  name: "Rosie Cannonball", cuisine: "European / Wood-Fired", neighborhood: "Montrose",
  score: 90, price: 3, tags: ["European", "Date Night", "Wine Bar", "Cocktails", "Fire"],
  reservation: "Resy", group: "Goodnight Hospitality",
  awards: "Michelin Bib Gourmand 2024, JBF Semifinalist Outstanding Wine Program 2020",
  description: "Wood-fired European comfort food in a lively Montrose space from the Goodnight Hospitality team. The open flame is the star, charring everything from pizzas to whole fish. June Rodil's wine program is one of the best in Texas and earned a James Beard nod. Vogue named it one of America's most anticipated restaurants when it opened.",
  dishes: ["Wood-Fired Pizza", "Whole Roasted Fish", "Burrata", "Handmade Pasta"],
  address: "1620 Westheimer Rd, Houston, TX 77006", phone: "(832) 380-3637",
  lat: 29.7428, lng: -95.3876, instagram: "rosiecannonball", website: "https://www.rosiecannonball.com",
  res_tier: 2,
});

add({
  name: "The Marigold Club", cuisine: "French / British", neighborhood: "Montrose",
  score: 89, price: 3, tags: ["French", "Fine Dining", "Date Night", "Cocktails", "New Opening"],
  indicators: ["new"], reservation: "OpenTable", group: "Goodnight Hospitality",
  awards: "Michelin Recommended 2025",
  description: "Goodnight Hospitality's newest jewel blends classic French cuisine with the opulence of Mayfair London in a stunning 160-seat Montrose space. Rich green velvet ceilings, plush banquettes, and chef Austin Waiter's refined menu make this one of Houston's most beautiful new dining rooms. Brunch on weekends is equally polished.",
  dishes: ["French Onion Soup", "Steak Frites", "Dover Sole", "Crème Brûlée"],
  address: "2531 Kuester St, Houston, TX 77006", phone: "(832) 781-1901",
  lat: 29.7437, lng: -95.3904, instagram: "marigoldclubhtx", website: "https://themarigoldclub.com",
  trending: true, res_tier: 2,
});

add({
  name: "Montrose Cheese & Wine", cuisine: "Cheese & Wine Shop", neighborhood: "Montrose",
  score: 84, price: 2, tags: ["Wine Bar", "Cheese", "Casual", "Local Favorites", "Retail"],
  reservation: "walk-in", group: "Goodnight Hospitality",
  description: "The retail arm of the Goodnight Hospitality empire on Westheimer, offering a curated selection of artisan cheeses, natural wines, and specialty provisions. Master Sommelier June Rodil's wine picks are reason enough to visit. Grab a cheese board and a bottle to take home, or stay for a glass at the bar.",
  dishes: ["Cheese Boards", "Natural Wine by the Glass", "Charcuterie", "Provisions"],
  address: "1618 Westheimer Rd, Houston, TX 77006", phone: "(832) 380-3650",
  lat: 29.7428, lng: -95.3875, instagram: "montrosecheeseandwine", website: "https://montrosecheeseandwine.com",
});

// ═══════════════════════════════════════════
// LHG (CHRIS WILLIAMS)
// ═══════════════════════════════════════════
console.log('\n--- LHG (Chris Williams) ---');

add({
  name: "Late August", cuisine: "Afro-Asian", neighborhood: "Midtown",
  score: 89, price: 3, tags: ["Asian Fusion", "Fine Dining", "Date Night", "Cocktails"],
  reservation: "Resy", group: "LHG (Chris Williams)",
  awards: "Michelin Recommended 2024, 2025, JBF Best Restaurateur Finalist 2022, 2023",
  description: "Chef Chris Williams' exploration of Afro-Asian flavors in a refined Midtown setting. The menu bridges African diaspora ingredients with Asian technique — think miso-glazed catfish and curry-spiced collard greens. Williams is a two-time James Beard Best Restaurateur finalist and the restaurant earned Michelin recognition in its first two years.",
  dishes: ["Miso-Glazed Catfish", "Curry Collard Greens", "Five-Spice Short Rib", "Coconut Cake"],
  address: "300 Main St, Houston, TX 77002", phone: "(713) 234-0908",
  lat: 29.7526, lng: -95.3634, instagram: "lateaugusthtx", website: "https://www.lateaugusthtx.com",
  res_tier: 2,
});

add({
  name: "Rado Coffee", cuisine: "Cafe / Coffee", neighborhood: "Third Ward",
  score: 82, price: 1, tags: ["Coffee", "Cafe", "Breakfast", "Casual", "Local Favorites"],
  reservation: "walk-in", group: "LHG (Chris Williams)",
  description: "LHG's all-day Third Ward cafe serving specialty coffee, pastries, and light bites alongside an art-forward atmosphere. Next door to the Hogan Brown Gallery, Rado anchors the group's community presence in one of Houston's most historic neighborhoods. A cultural hub as much as a coffee shop.",
  dishes: ["Specialty Coffee", "Pastries", "Light Bites", "Cold Brew"],
  address: "3333 Elgin St, Houston, TX 77004", phone: "",
  lat: 29.7339, lng: -95.3516, instagram: "radocoffee", website: "https://www.radocoffee.com",
});

// ═══════════════════════════════════════════
// THE BIG VIBE GROUP
// ═══════════════════════════════════════════
console.log('\n--- The Big Vibe Group ---');

add({
  name: "Coppa Osteria", cuisine: "Italian", neighborhood: "Heights",
  score: 87, price: 2, tags: ["Italian", "Pasta", "Date Night", "Local Favorites"],
  reservation: "OpenTable", group: "The Big Vibe Group",
  description: "Heights Italian where handmade pasta and pizza dough take top billing. The Big Vibe Group's flagship rustic Italian concept has been a neighborhood anchor for years, with many of its chefs staying for a decade or more. The consistency shows in every plate of cacio e pepe and perfectly charred Margherita.",
  dishes: ["Handmade Pasta", "Wood-Fired Pizza", "Cacio e Pepe", "Tiramisu"],
  address: "5210 Morningside Dr, Houston, TX 77005", phone: "(713) 522-3535",
  lat: 29.7246, lng: -95.4157, instagram: "coppaosteria", website: "https://www.coppaosteria.com",
});

add({
  name: "Flora Mexican Kitchen", cuisine: "Modern Mexican", neighborhood: "Upper Kirby",
  score: 86, price: 2, tags: ["Mexican", "Brunch", "Date Night", "Cocktails", "Patio"],
  reservation: "OpenTable", group: "The Big Vibe Group",
  description: "Contemporary Mexican from the Big Vibe Group marrying Mexican and Texan sensibilities. Chef Estuardo Gomez's menu goes beyond Tex-Mex with dishes like mole-braised short ribs and street corn esquites alongside creative margaritas. The brunch draws a crowd for chilaquiles and huevos rancheros.",
  dishes: ["Mole Short Ribs", "Chilaquiles", "Street Corn", "Margaritas"],
  address: "3422 Allen Pkwy, Houston, TX 77019", phone: "(713) 600-1361",
  lat: 29.7600, lng: -95.3980, instagram: "floramexicankitchen", website: "https://www.floramexicankitchen.com",
});

add({
  name: "Graffiti Raw", cuisine: "Seafood / Coastal", neighborhood: "Montrose",
  score: 85, price: 2, tags: ["Seafood", "Brunch", "Patio", "Cocktails", "Casual"],
  reservation: "OpenTable", group: "The Big Vibe Group",
  description: "Coastal vibes in Montrose designed to mirror your favorite beachside city. The Big Vibe Group's seafood concept serves ceviche, poke, raw bar plates, and tropical cocktails in a bright, airy space. The all-day menu transitions from acai bowls at brunch to oyster platters at happy hour.",
  dishes: ["Ceviche", "Poke Bowls", "Raw Bar", "Tropical Cocktails"],
  address: "2412 Washington Ave, Houston, TX 77007", phone: "(832) 405-0500",
  lat: 29.7648, lng: -95.3807, instagram: "graffitiraw", website: "https://www.graffitiraw.com",
});

add({
  name: "Gratify", cuisine: "American / Brunch", neighborhood: "River Oaks",
  score: 85, price: 2, tags: ["American", "Brunch", "Date Night", "Patio", "Cocktails"],
  reservation: "OpenTable", group: "The Big Vibe Group",
  description: "The Big Vibe Group's polished American concept in River Oaks, combining elevated brunch and dinner service with craft cocktails and a see-and-be-seen patio. Weekend brunch is the star, but the dinner menu holds its own with steaks, seafood, and seasonal plates.",
  dishes: ["Brunch Plates", "Steak Frites", "Cocktails", "Seasonal Specials"],
  address: "4607 Washington Ave, Houston, TX 77007", phone: "(832) 831-5500",
  lat: 29.7676, lng: -95.4010, instagram: "gratifyhtx", website: "https://www.gratifyhouston.com",
});

// ═══════════════════════════════════════════
// ALIFE HOSPITALITY GROUP (nightlife/bar focused)
// ═══════════════════════════════════════════
console.log('\n--- ALIFE Hospitality Group ---');

add({
  name: "Prospect Park", cuisine: "American / Sports Bar", neighborhood: "Upper Kirby",
  score: 83, price: 2, tags: ["American", "Sports Bar", "Patio", "Brunch", "Late Night"],
  reservation: "walk-in", group: "ALIFE Hospitality Group",
  description: "ALIFE Hospitality's flagship sports bar and restaurant in Upper Kirby with a massive patio, big screens, and elevated bar food. The weekend brunch is one of Houston's most popular, and game days pack the house for Texans, Rockets, and Astros watch parties.",
  dishes: ["Wings", "Burgers", "Brunch Plates", "Craft Beer"],
  address: "3101 Sage Rd, Houston, TX 77056", phone: "(713) 417-7799",
  lat: 29.7415, lng: -95.4520, instagram: "prospectparkhtx", website: "https://www.prospectparkhouston.com",
});

add({
  name: "FRNDS", cuisine: "American / Lounge", neighborhood: "Galleria",
  score: 82, price: 2, tags: ["Lounge", "Cocktails", "Late Night", "Nightlife"],
  reservation: "walk-in", group: "ALIFE Hospitality Group",
  description: "ALIFE's upscale restaurant and lounge concept near the Galleria. Sleek interiors, craft cocktails, and a menu that transitions from dinner into late-night vibes. Part of ALIFE's portfolio that has made them one of Houston's most prominent nightlife groups.",
  dishes: ["Small Plates", "Craft Cocktails", "Late Night Menu"],
  address: "5085 Westheimer Rd, Houston, TX 77056", phone: "(832) 696-2870",
  lat: 29.7389, lng: -95.4614, instagram: "frndshouston", website: "https://alifehospitalitygroup.com",
});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');

console.log('\n✅ Houston: '+arr.length+' spots (added '+added+')');
console.log('\nHospitality groups:');
const groups = {};
arr.filter(r=>r.group&&r.group.trim()).forEach(r=>{if(!groups[r.group])groups[r.group]=[];groups[r.group].push(r.name);});
Object.entries(groups).filter(([k,v])=>v.length>=2).sort((a,b)=>b[1].length-a[1].length)
  .forEach(([g,r])=>console.log('  '+r.length+' '+g));
