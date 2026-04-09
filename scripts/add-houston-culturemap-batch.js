// Add missing Houston restaurants from CultureMap, FAM Hospitality, JBF finalists, Comma Hospitality
// Run: node scripts/add-houston-culturemap-batch.js

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
  console.log('  ADDED:', spot.name);
}

// ═══════════════════════════════════════════
// JBF FINALISTS & AWARD WINNERS
// ═══════════════════════════════════════════
console.log('--- JBF / Award Winners ---');

add({
  name: "Agnes and Sherman", cuisine: "Asian American Diner", neighborhood: "Heights",
  score: 93, price: 2, tags: ["Asian Fusion", "Brunch", "Date Night", "Local Favorites", "Critics Pick"],
  reservation: "OpenTable", awards: "Texas Monthly Restaurant of the Year 2026, JBF Best New Restaurant Finalist 2026, Texas Monthly Best New Restaurant 2026",
  description: "Chef Nick Wong's genre-defying Asian American diner in the Heights, named after his parents. The menu weaves Houston's immigrant cuisines into diner classics — think scallion pancake waffles and French dip sandwiches with Taiwanese beef broth. Texas Monthly's Restaurant of the Year and a James Beard Best New Restaurant finalist. One of the most important restaurants to open in Houston in years.",
  dishes: ["Scallion Pancake Waffles", "Taiwanese French Dip", "Congee", "Sesame Noodles"],
  address: "250 W 19th St, Suite A, Houston, TX 77008", phone: "(713) 965-6088",
  lat: 29.8024, lng: -95.3920, instagram: "agnesandsherman", website: "https://www.agnesandsherman.com",
  trending: true, res_tier: 1,
});

add({
  name: "ChòpnBlọk", cuisine: "West African / Nigerian", neighborhood: "Montrose",
  score: 91, price: 2, tags: ["African", "Local Favorites", "Critics Pick", "Awards"],
  reservation: "OpenTable", awards: "Michelin Bib Gourmand, JBF Best Chef: Texas Finalist 2026, Esquire Best New Restaurant 2025, NYT Top 50",
  description: "Chef Ope Amosu's celebration of West African and Nigerian cuisine that earned a Michelin Bib Gourmand and landed on the New York Times' 50 best restaurants list. Born in Houston to Nigerian immigrants, Amosu plates jollof rice, suya-spiced meats, and egusi soup with the precision of fine dining and the warmth of a family kitchen. A JBF Best Chef finalist in 2026.",
  dishes: ["Jollof Rice", "Suya", "Puff Puff", "Egusi Soup"],
  address: "507 Westheimer Rd, Houston, TX 77006", phone: "(832) 962-4500",
  lat: 29.7430, lng: -95.3835, instagram: "chopnblok_", website: "https://chopnblok.co",
  trending: true, res_tier: 2,
});

add({
  name: "Jūn", cuisine: "New American", neighborhood: "Heights",
  score: 90, price: 3, tags: ["American", "Fine Dining", "Date Night", "Cocktails", "Critics Pick"],
  reservation: "OpenTable", awards: "JBF Best Chef: Texas Finalist 2026 (Evelyn Garcia & Henry Lu)",
  description: "Top Chef alum Evelyn Garcia and chef Henry Lu's refined New American restaurant in the Heights. The menu is technique-driven and seasonal, drawing from Garcia's Mexican-American heritage and Lu's Chinese roots. Their James Beard Best Chef nomination in 2026 cemented Jūn as one of Houston's most important new restaurants. The cocktail program matches the kitchen's ambition.",
  dishes: ["Seasonal Tasting Menu", "Handmade Pasta", "Gulf Seafood", "Craft Cocktails"],
  address: "420 E 20th St, Suite A, Houston, TX 77008", phone: "(832) 469-7664",
  lat: 29.8001, lng: -95.3850, instagram: "junhtx", website: "https://www.junbykin.com",
  res_tier: 2,
});

add({
  name: "Di An Pho", cuisine: "Vietnamese / Pho", neighborhood: "Chinatown / Bellaire",
  score: 89, price: 1, tags: ["Vietnamese", "Casual", "Local Favorites", "Critics Pick"],
  reservation: "walk-in", awards: "Texas Monthly Best New Restaurants 2026",
  description: "The name means 'go eat pho' in Vietnamese, and that's exactly what you should do at this Bellaire Boulevard standout. One of four Houston restaurants to make Texas Monthly's 2026 best new list. The pho is rich, deeply flavored, and made with obsessive care. The rest of the menu holds up too — bun bo Hue and banh mi are excellent.",
  dishes: ["Pho", "Bun Bo Hue", "Banh Mi", "Vietnamese Coffee"],
  address: "12934 Bellaire Blvd, Suite 108, Houston, TX 77072", phone: "(281) 896-0002",
  lat: 29.7058, lng: -95.5650, instagram: "dianphorestaurant", website: "",
  suburb: true,
});

// ═══════════════════════════════════════════
// COMMA HOSPITALITY (Neo, Kira, Oru)
// ═══════════════════════════════════════════
console.log('\n--- Comma Hospitality ---');

add({
  name: "Oru", cuisine: "Modern Japanese / Sushi", neighborhood: "Heights",
  score: 88, price: 3, tags: ["Japanese", "Sushi", "Date Night", "Cocktails", "New Opening"],
  indicators: ["new"], reservation: "Resy", group: "Comma Hospitality",
  description: "The newest concept from the team behind Neo and Kira, Oru centers on a 24-seat hinoki wood counter offering an à la carte Japanese experience. Unlike Neo's exclusive tasting menu, Oru invites guests to explore sushi, sashimi, and seasonal Japanese plates at their own pace. A refined alternative in Houston's growing omakase scene.",
  dishes: ["Sushi Omakase", "Sashimi", "Seasonal Japanese Plates", "Sake"],
  address: "746 W 24th St, Houston, TX 77008", phone: "",
  lat: 29.8055, lng: -95.3940, instagram: "oruhtx", website: "",
  trending: true, res_tier: 2,
});

add({
  name: "Kira", cuisine: "Japanese Hand Rolls / Vinyl Bar", neighborhood: "Upper Kirby",
  score: 87, price: 2, tags: ["Japanese", "Sushi", "Cocktails", "Late Night"],
  reservation: "Resy", group: "Comma Hospitality",
  description: "Inspired by Tokyo's jazz vinyl bars, Kira is a 15-seat counter serving hand rolls, temaki, and donburi alongside craft cocktails and rare vinyl spins. The Ahmed brothers' most accessible concept — no tasting menu required, just exceptional rice, fish, and atmosphere. The listening bar format is unique to Houston.",
  dishes: ["Hand Rolls", "Temaki", "Donburi", "Craft Cocktails"],
  address: "2800 Kirby Dr, Suite B128, Houston, TX 77098", phone: "(281) 759-2858",
  lat: 29.7365, lng: -95.4195, instagram: "kirahtx", website: "https://kirahtx.com",
});

// ═══════════════════════════════════════════
// FAM HOSPITALITY (Post Market concepts)
// ═══════════════════════════════════════════
console.log('\n--- FAM Hospitality (Post Market) ---');

add({
  name: "East Side King", cuisine: "Japanese Street Food", neighborhood: "Downtown",
  score: 85, price: 1, tags: ["Japanese", "Casual", "Food Hall", "Late Night"],
  reservation: "walk-in", group: "FAM Hospitality",
  description: "Chef Paul Qui's Austin-born Japanese street food concept at POST Houston food hall. Yakitori, ramen, bao buns, and izakaya-style small plates served fast and casual. The original Austin food trucks became a cult hit — the Houston outpost brings the same high-energy street food to downtown.",
  dishes: ["Beet Home Fries", "Bao Buns", "Yakitori", "Ramen"],
  address: "401 Franklin St, Suite 1360, Houston, TX 77201", phone: "",
  lat: 29.7636, lng: -95.3620, instagram: "eastsideking", website: "https://www.eskstreats.com",
});

add({
  name: "Thai Kun", cuisine: "Thai Street Food", neighborhood: "Downtown",
  score: 85, price: 1, tags: ["Thai", "Casual", "Food Hall"],
  reservation: "walk-in", group: "FAM Hospitality",
  awards: "Bon Appetit Top 10",
  description: "Bon Appetit Top 10-recognized Thai street food from the FAM Hospitality team at POST Houston. Pad thai, green curry, and larb are executed with care that belies the casual food hall setting. Thai Kun started as an Austin food truck and the flavors haven't lost a step in the transition to brick-and-mortar.",
  dishes: ["Pad Thai", "Green Curry", "Larb", "Thai Iced Tea"],
  address: "401 Franklin St, Suite 1225, Houston, TX 77201", phone: "",
  lat: 29.7636, lng: -95.3620, instagram: "thaikun_og", website: "",
});

add({
  name: "Soy Pinoy", cuisine: "Filipino", neighborhood: "Downtown",
  score: 84, price: 1, tags: ["Filipino", "Casual", "Food Hall"],
  reservation: "walk-in", group: "FAM Hospitality",
  description: "Filipino comfort food at POST Houston from the FAM Hospitality group. Adobo, sisig, lumpia, and ube desserts capture the flavors of the Philippines in a vibrant food hall setting. A rare opportunity to try authentic Filipino cooking in a casual, approachable format in downtown Houston.",
  dishes: ["Adobo", "Sisig", "Lumpia", "Ube Desserts"],
  address: "401 Franklin St, Suite 1230, Houston, TX 77201", phone: "",
  lat: 29.7636, lng: -95.3620, instagram: "soypinoy", website: "",
});

add({
  name: "Golfstrømmen", cuisine: "Sustainable Seafood", neighborhood: "Downtown",
  score: 86, price: 2, tags: ["Seafood", "Sustainable", "Food Hall", "Market"],
  reservation: "walk-in", group: "FAM Hospitality",
  description: "A sustainable seafood market and restaurant concept at POST Houston from FAM Hospitality. Named after the Gulf Stream, this concept serves responsibly sourced oysters, ceviche, and daily catch plates. The fish market component lets you take home what the chefs are cooking with. A unique hybrid concept in Houston's food hall scene.",
  dishes: ["Oysters", "Ceviche", "Daily Catch", "Seafood Market"],
  address: "401 Franklin St, Houston, TX 77201", phone: "",
  lat: 29.7636, lng: -95.3620, instagram: "golfstrommen", website: "",
});

// ═══════════════════════════════════════════
// OTHER NOTABLE MISSING SPOTS
// ═══════════════════════════════════════════
console.log('\n--- Other Notable ---');

add({
  name: "Candente", cuisine: "Tex-Mex", neighborhood: "Montrose",
  score: 87, price: 2, tags: ["Mexican", "Tex-Mex", "Brunch", "Patio", "Local Favorites", "Cocktails"],
  reservation: "walk-in", awards: "Michelin Recommended",
  description: "Handcrafted Tex-Mex with Michelin recognition in Montrose. Candente elevates the Houston Tex-Mex tradition with scratch-made tortillas, house-ground masa, and creative margaritas. Weekend brunch draws lines for chilaquiles and breakfast tacos. Expanding with a second location in Bellaire — a sign of just how beloved this spot has become.",
  dishes: ["Handmade Tortillas", "Chilaquiles", "Fajitas", "Margaritas"],
  address: "4306 Yoakum Blvd, Houston, TX 77006", phone: "(346) 867-1156",
  lat: 29.7385, lng: -95.3878, instagram: "candentehtx", website: "https://www.candentehtx.com",
  trending: true,
});

add({
  name: "Julep", cuisine: "Cocktail Bar / Southern", neighborhood: "Washington Corridor",
  score: 88, price: 2, tags: ["Cocktails", "Bar", "Southern", "Date Night", "Awards"],
  reservation: "walk-in", awards: "James Beard Outstanding Bar 2024, North America's 50 Best Bars #84",
  description: "Master bartender Alba Huerta's Southern-inspired cocktail bar on Washington Ave, now a decade strong and ranked among North America's best bars. The James Beard-winning program highlights Houston's global flavors through cocktails that draw from Latin, Asian, and Southern traditions. The julep itself comes in a dozen seasonal variations.",
  dishes: ["Seasonal Juleps", "Craft Cocktails", "Southern Bar Snacks"],
  address: "1919 Washington Ave, Houston, TX 77007", phone: "(713) 869-4383",
  lat: 29.7641, lng: -95.3750, instagram: "julephou", website: "https://www.julephouston.com",
});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');

console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ')');

// Show updated group counts
const groups = {};
arr.filter(r=>r.group&&r.group.trim()).forEach(r=>{if(!groups[r.group])groups[r.group]=[];groups[r.group].push(r.name);});
const multi = Object.entries(groups).filter(([k,v])=>v.length>=2).sort((a,b)=>b[1].length-a[1].length);
console.log('\nHospitality groups (2+):');
multi.forEach(([g,r])=>console.log('  '+r.length+' '+g));
