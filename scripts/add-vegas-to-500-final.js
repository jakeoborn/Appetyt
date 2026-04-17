// Final 16+ Vegas to hit 500
// Run: node scripts/add-vegas-to-500-final.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function addToConst(constName, spots) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  const arr = JSON.parse(html.slice(a, e));
  const existing = new Set(arr.map(r => r.name.toLowerCase()));
  let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
  let added = 0;
  spots.forEach(sp => {
    if (existing.has(sp.name.toLowerCase())) { console.log('  SKIP:', sp.name); return; }
    arr.push({
      id: nextId++, name: sp.name, phone: sp.phone || '', cuisine: sp.cuisine,
      neighborhood: sp.neighborhood, score: sp.score, price: sp.price || 0,
      tags: sp.tags, indicators: [], hh: sp.hh || '', reservation: sp.reservation || 'walk-in',
      awards: sp.awards || '', description: sp.description, dishes: sp.dishes || [],
      address: sp.address, hours: sp.hours || '', lat: sp.lat, lng: sp.lng,
      bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, group: sp.group || '', instagram: sp.instagram || '', website: sp.website || '',
      suburb: sp.suburb || false, reserveUrl: '', menuUrl: '', res_tier: sp.res_tier || 3,
    });
    existing.add(sp.name.toLowerCase());
    added++;
    console.log('  ADDED:', sp.name);
  });
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return { count: arr.length, added };
}

console.log('=== VEGAS → 500 ===');
const batch = [
  // Pinkbox — local donut chain
  {name:"Pinkbox Doughnuts Fremont",cuisine:"Donuts / Bakery",neighborhood:"Downtown / Fremont East",score:85,price:1,tags:["Donuts","Late Night","24 Hour","Instagram"],description:"24-hour Vegas donut chain with creative flavors — Homer Simpson, Tiger Blood, PB&J Jelly — and a Fremont East flagship that's a downtown late-night anchor.",dishes:["Homer Simpson","Tiger Blood","PB&J Jelly","Apple Fritter"],address:"450 Fremont St #125, Las Vegas, NV 89101",phone:"(702) 910-6000",lat:36.1697,lng:-115.1420,instagram:"pinkboxdoughnuts",website:"https://pinkboxdoughnuts.com"},
  // Cappuccino hotspot
  {name:"Sunrise Coffee",cuisine:"Coffee",neighborhood:"East Strip / Paradise",score:84,price:1,tags:["Coffee","Vegan","Local Favorites"],description:"Off-Strip vegan-friendly coffee shop with specialty espresso drinks, plant-based pastries, and a cozy studying-friendly interior. Beloved Vegas local spot.",dishes:["Espresso","Vegan Pastries","Oat Milk Latte","Cold Brew"],address:"3130 E Sunset Rd #130, Las Vegas, NV 89120",phone:"(702) 433-3304",lat:36.0730,lng:-115.1110,instagram:"sunrisecoffeelv",website:"https://sunrisecoffeelv.com"},
  // Specific Strip gaps
  {name:"China Tang",cuisine:"Chinese",neighborhood:"The Strip (MGM Grand)",score:86,price:4,tags:["Chinese","Dim Sum","Date Night","Elegant"],description:"MGM Grand's elegant Cantonese-Shanghainese restaurant. Hand-made dim sum, Peking duck, and a lacquered-wood 1930s Shanghai aesthetic. Upscale Chinese cuisine.",dishes:["Peking Duck","Dim Sum","Lobster Noodles","Shanghainese Soup Dumplings"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 891-7777",lat:36.1025,lng:-115.1700,instagram:"chinatang_lv",website:"https://mgmgrand.mgmresorts.com/en/restaurants/china-tang.html",reservation:"OpenTable"},
  {name:"Craftsteak",cuisine:"Steakhouse",neighborhood:"The Strip (MGM Grand)",score:86,price:4,tags:["Steakhouse","Date Night","Tom Colicchio","Wine"],description:"Tom Colicchio's MGM Grand steakhouse. Multi-farm sourced beef, a serious wine program, and a minimalist sleek dining room. Quiet alternative to flashier steakhouses.",dishes:["Dry-Aged Steaks","Grass-Fed Options","Wine Pairings"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 891-7318",lat:36.1025,lng:-115.1700,instagram:"craftsteak",website:"https://mgmgrand.mgmresorts.com/en/restaurants/craftsteak.html",reservation:"OpenTable"},
  {name:"Mastro's Ocean Club",cuisine:"Seafood Steakhouse",neighborhood:"The Strip (Aria / Crystals)",score:88,price:4,tags:["Seafood","Steakhouse","Date Night","Views"],description:"Crystals at Aria seafood-and-steakhouse inside a multi-story glass tree house structure. Tower of seafood, prime steaks, floor-to-ceiling windows over CityCenter. A Vegas special-occasion favorite.",dishes:["Seafood Tower","Butter Cake","Prime Steaks","Lobster Mashed Potatoes"],address:"3720 S Las Vegas Blvd, Las Vegas, NV 89158",phone:"(702) 798-7115",lat:36.1069,lng:-115.1775,instagram:"mastrosoceanclub",website:"https://www.mastrosrestaurants.com/mastros-las-vegas-ocean-club",reservation:"OpenTable"},
  {name:"Javier's Aria",cuisine:"Mexican",neighborhood:"The Strip (Aria)",score:83,price:3,tags:["Mexican","Cocktails","Iconic","Date Night"],description:"The original Javier's concept at Aria. Upscale Mexican with mole, tableside guac, and sizzling fajitas. A Vegas Mexican dining mainstay.",dishes:["Mole","Enchiladas Suizas","Tableside Guacamole","Margaritas"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",phone:"(702) 590-3637",lat:36.1069,lng:-115.1775,instagram:"javiersrestaurant",website:""},
  {name:"Tom Colicchio's Heritage Steak",cuisine:"Steakhouse",neighborhood:"The Strip (The Mirage)",score:85,price:4,tags:["Steakhouse","Celebrity Chef","Date Night","Wood-Fired"],description:"Tom Colicchio's wood-fire-focused steakhouse at the Mirage. Dry-aged prime, heritage beef, and a classic-with-a-twist approach. Unfussy, ingredient-driven.",dishes:["Dry-Aged Prime","Wood-Fired Fish","Heritage Beef","Wine"],address:"3400 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 791-7111",lat:36.1215,lng:-115.1740,instagram:"tomcolicchio",website:"https://mirage.mgmresorts.com/en/restaurants/tom-colicchios-heritage-steak.html"},
  {name:"Lotus of Siam Summerlin",cuisine:"Thai",neighborhood:"Summerlin",score:92,price:3,tags:["Thai","Critics Pick","Iconic","Date Night"],suburb:true,description:"Second location of the legendary Lotus of Siam — named the best Thai restaurant in North America. Northern Thai dishes, killer wine list, and a Summerlin Strip-adjacent location.",dishes:["Khao Soi","Crispy Rice Sausage","Drunken Noodles","Mango Sticky Rice"],address:"620 E Flamingo Rd, Las Vegas, NV 89119",phone:"(702) 735-3033",lat:36.1148,lng:-115.1490,instagram:"lotusofsiam",website:"https://lotusofsiamlv.com",reservation:"OpenTable"},
  // More Chinatown/Spring Valley
  {name:"Chengdu Taste",cuisine:"Sichuan",neighborhood:"Spring Valley / Chinatown",score:89,price:2,tags:["Sichuan","Spicy","Critics Pick","Authentic"],description:"California import of the Sichuan specialist. Mapo tofu, boiled fish in spicy broth, dan dan noodles. One of the most authentic Sichuan spots in Vegas.",dishes:["Toothpick Lamb","Mapo Tofu","Boiled Fish in Spicy Broth","Dan Dan"],address:"3400 S Jones Blvd #2B, Las Vegas, NV 89146",phone:"(702) 437-3888",lat:36.1270,lng:-115.2214,instagram:"chengdutaste",website:""},
  {name:"Niu-Gu Noodle House",cuisine:"Taiwanese",neighborhood:"Spring Valley / Chinatown",score:85,price:1,tags:["Taiwanese","Noodles","Beef Noodle","Casual"],description:"Chinatown corridor Taiwanese beef-noodle-soup specialist. Hand-pulled noodles, peppery braised beef, and dumpling sides. Quick, authentic, no fuss.",dishes:["Beef Noodle Soup","Hand-Pulled Noodles","Dumplings","Scallion Pancake"],address:"3850 E Sunset Rd, Las Vegas, NV 89120",phone:"(702) 233-8818",lat:36.0730,lng:-115.0950,instagram:"",website:""},
  {name:"House of Gyros Chinatown",cuisine:"Greek",neighborhood:"Spring Valley / Chinatown",score:82,price:1,tags:["Greek","Gyros","Late Night","Casual"],description:"Chinatown Greek counter with hand-sliced gyros, spanakopita, and house-made tzatziki. Open until 3 AM on weekends. A Vegas late-night favorite.",dishes:["Lamb Gyro","Pork Souvlaki","Spanakopita","Tzatziki"],address:"4325 W Flamingo Rd, Las Vegas, NV 89103",phone:"(702) 364-9000",lat:36.1150,lng:-115.2097,instagram:"",website:""},
  // Henderson more
  {name:"Lola's A Louisiana Kitchen",cuisine:"Cajun / Creole",neighborhood:"Henderson",score:84,price:2,tags:["Cajun","Creole","Family Friendly","Casual"],suburb:true,description:"Henderson Louisiana-style kitchen serving authentic gumbo, jambalaya, po-boys, and beignets. Housemade hot sauce on every table. NOLA comfort in the desert.",dishes:["Gumbo","Jambalaya","Po-Boys","Beignets"],address:"241 W Charleston Blvd, Las Vegas, NV 89102",phone:"(702) 871-7777",lat:36.1600,lng:-115.1600,instagram:"lolaslouisianakitchen",website:"https://lolaslouisianakitchen.com"},
  {name:"Brennan's of Las Vegas",cuisine:"Creole",neighborhood:"Henderson",score:84,price:3,tags:["Creole","Brunch","Date Night","NOLA"],suburb:true,description:"Vegas outpost of the famed New Orleans Brennan's. Bananas Foster born here, served tableside. Classic Creole brunch and dinner.",dishes:["Bananas Foster","Eggs Hussarde","Shrimp Creole","Turtle Soup"],address:"1180 S Rampart Blvd, Las Vegas, NV 89145",phone:"(702) 869-2251",lat:36.1450,lng:-115.2879,instagram:"brennans_lv",website:""},
  // Iconic fast-casual
  {name:"Pizza Rock",cuisine:"Pizza",neighborhood:"Downtown / Fremont Street",score:85,price:2,tags:["Pizza","Late Night","Live Music","Downtown"],description:"Downtown Pizza Rock from Tony Gemignani — 11-time World Pizza Champion. Four pizza ovens making six styles. Rock aesthetic, live music, and some of Vegas's best pizza.",dishes:["Cal-Italia","New York Slice","Cast Iron Detroit","Rosa Siciliana"],address:"201 N 3rd St, Las Vegas, NV 89101",phone:"(702) 385-0838",lat:36.1707,lng:-115.1440,instagram:"pizzarocklv",website:"https://pizzarocklv.com"},
  // Café bites
  {name:"Ada's Food + Wine",cuisine:"European",neighborhood:"Downtown / Tivoli Village",score:84,price:3,tags:["European","Wine","Brunch","Date Night"],suburb:true,description:"Tivoli Village European restaurant with French-and-Italian-leaning small plates, a serious wine list, and a flower-filled patio. Crowd-pleasing weekend brunch.",dishes:["Beet Carpaccio","Duck Confit","Brunch","Wine Flights"],address:"400 S Rampart Blvd #120, Las Vegas, NV 89145",phone:"(702) 818-1800",lat:36.1450,lng:-115.2879,instagram:"adasfoodandwine",website:""},
  // Brunch scene
  {name:"Mr. Mamas Breakfast & Lunch",cuisine:"Breakfast",neighborhood:"Summerlin",score:84,price:1,tags:["Breakfast","Brunch","Local Favorites","Casual"],suburb:true,description:"Summerlin weekend-waits breakfast institution. Huge menu, Greek skillet, Monte Cristo, and generous portions. A locals' weekend tradition.",dishes:["Greek Skillet","Monte Cristo","Chicken Fried Steak","Pancakes"],address:"2030 Village Center Cir #140, Las Vegas, NV 89134",phone:"(702) 477-4224",lat:36.1610,lng:-115.3260,instagram:"",website:""},
  // Last two
  {name:"BLVD Creamery",cuisine:"Ice Cream",neighborhood:"The Strip (The Cosmopolitan)",score:82,price:1,tags:["Ice Cream","Dessert","Late Night","Family Friendly"],description:"Cosmopolitan artisan ice cream counter with rotating seasonal flavors, house-made waffle cones, and late-night hours after the Chelsea shows.",dishes:["Artisan Ice Cream","Waffle Cones","Sundaes","Milkshakes"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7000",lat:36.1099,lng:-115.1729,instagram:"",website:""},
  {name:"Momofuku Noodle Bar Las Vegas",cuisine:"Asian / Ramen",neighborhood:"The Strip (The Cosmopolitan)",score:86,price:3,tags:["Ramen","Asian Fusion","Late Night","David Chang"],description:"David Chang's Momofuku Noodle Bar at Cosmopolitan. Pork buns, ramen, shrimp buns, and the famous 'special fried rice'. More casual than the main Momofuku room.",dishes:["Pork Buns","Ramen","Special Fried Rice","Shrimp Buns"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-2663",lat:36.1099,lng:-115.1729,instagram:"momofuku",website:"https://noodlebar-lv.momofuku.com",reservation:"Resy"},
];
const result = addToConst('LV_DATA', batch);
console.log(`\nLas Vegas: ${result.count} spots (added ${result.added})`);
fs.writeFileSync(file, html);
console.log('\n✅ Done.');
