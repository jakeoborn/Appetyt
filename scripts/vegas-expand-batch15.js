// Vegas Batch 15 — Chinatown Vietnamese/Thai + Red Rock + Venetian/Grand Canal Shoppes
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const LV_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Vegas:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

add({name:"Pho Kim Long",cuisine:"Vietnamese",neighborhood:"Chinatown",score:88,price:1,tags:["Vietnamese","Casual","Late Night","Local Favorites","Iconic"],description:"Chinatown Vietnamese institution on Spring Mountain Rd. Enormous portions of banh mi, pho, com tam, and bun bo hue at rock-bottom prices. One of the most beloved off-Strip Vietnamese spots in Vegas.",dishes:["Pho","Bun Bo Hue","Banh Mi"],address:"4029 W Spring Mountain Rd, Las Vegas, NV 89102",lat:36.1262,lng:-115.2025,instagram:"phokimlongvegas",website:"https://phokimlong.has.restaurant",reservation:"walk-in",phone:"(702) 220-3613"});

add({name:"Lotus of Siam",cuisine:"Thai",neighborhood:"East Las Vegas",score:92,price:3,tags:["Thai","Date Night","Iconic","Critics Pick","Awards","Local Favorites"],description:"Chef Saipin Chutima's legendary Thai restaurant — Gourmet magazine's 'single best Thai restaurant in North America.' James Beard Award-winning chef. Northern Thai specialties, nam prik noom, sai oua. The Flamingo flagship — an off-Strip pilgrimage spot.",dishes:["Khao Soi","Nam Prik Ong","Sai Oua"],address:"620 E Flamingo Rd, Las Vegas, NV 89119",lat:36.1154,lng:-115.1489,instagram:"lotusofsiamlv",website:"https://lotusofsiamlv.com",reservation:"OpenTable",phone:"(702) 735-3033",awards:"James Beard Award - Best Chef Southwest",hours:"Daily 11:30AM-10PM"});

add({name:"Lotus of Siam Red Rock",cuisine:"Thai",neighborhood:"Summerlin (Red Rock Resort)",score:91,price:3,tags:["Thai","Date Night","Local Favorites","Critics Pick"],description:"Second Vegas location of Saipin Chutima's James Beard-winning Thai flagship — inside Red Rock Casino Resort. Authentic northern Thai, extensive wine list, and lunch/dinner plus weekend brunch service.",dishes:["Khao Soi","Northern Thai","Wine Program"],address:"11011 W Charleston Blvd, Las Vegas, NV 89135",lat:36.1582,lng:-115.3363,instagram:"lotusofsiamlv",website:"https://lotusofsiamlv.com",reservation:"OpenTable",phone:"(702) 907-8888",group:"Lotus of Siam"});

add({name:"Weera Thai",cuisine:"Thai",neighborhood:"Chinatown",score:88,price:2,tags:["Thai","Casual","Local Favorites","Late Night"],description:"Multi-location Thai chain anchored by its Chinatown flagship on Spring Mountain. Authentic Thai street food with late-night hours. Known for drunken noodles, boat noodles, and crispy garlic pork.",dishes:["Drunken Noodles","Boat Noodles","Crispy Garlic Pork"],address:"4276 Spring Mountain Rd Ste C-105, Las Vegas, NV 89102",lat:36.1262,lng:-115.2070,instagram:"weerathailv",website:"https://weerathai.com",reservation:"walk-in",phone:"(702) 485-1688",hours:"Daily 11AM-10PM"});

// === RED ROCK / SUMMERLIN additions ===
add({name:"Blue Ribbon Sushi Bar & Grill",cuisine:"Japanese / Sushi",neighborhood:"Summerlin (Red Rock Resort)",score:89,price:3,tags:["Japanese","Sushi","Date Night","Local Favorites","Critics Pick"],description:"Acclaimed NYC-born sushi brand at Red Rock Resort. Creative sushi and Japanese-inspired flavors from the Bromberg Brothers. Great for Summerlin date nights — plus a solid social-hour menu.",dishes:["Blue Ribbon Roll","Sashimi Platter","Toro"],address:"11011 W Charleston Blvd, Las Vegas, NV 89135",lat:36.1582,lng:-115.3363,instagram:"blueribbonrestaurants",website:"https://redrockresort.com/eat-and-drink/blue-ribbon-sushi",reservation:"OpenTable",phone:"(702) 797-7517",hours:"Mon-Thu,Sun 11:30AM-9PM, Fri-Sat 11:30AM-11PM"});

add({name:"Osteria Fiorella",cuisine:"Italian",neighborhood:"Summerlin (Red Rock Resort)",score:89,price:3,tags:["Italian","Date Night","Local Favorites"],description:"Red Rock Resort's Italian trattoria blending Italian heritage with Las Vegas sensibility. Wood-fired pizzas, handmade pasta, and a Tuscan-influenced wine list. A dependable off-Strip Italian pick.",dishes:["Wood-Fired Pizza","Handmade Pasta","Tiramisu"],address:"11011 W Charleston Blvd, Las Vegas, NV 89135",lat:36.1582,lng:-115.3363,instagram:"redrockresort",website:"https://redrockresort.com/eat-and-drink/osteria-fiorella",reservation:"OpenTable",phone:"(702) 797-7777",hours:"Mon-Thu,Sun 4:30PM-9:30PM, Fri-Sat 4:30PM-10PM"});

// === VENETIAN / GRAND CANAL SHOPPES ===
add({name:"BOA Steakhouse",cuisine:"Steakhouse",neighborhood:"The Strip (Grand Canal Shoppes)",score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],description:"BOA Steakhouse's Strip location at Grand Canal Shoppes. Dry-aged prime steaks, tableside Caesar, and a refined Vegas take on the LA original. Sleek modern room and buzzy lounge scene.",dishes:["Tableside Caesar","Dry-Aged Prime","BOA Burger"],address:"3327 S Las Vegas Blvd Unit 2900, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"boasteakhouse",website:"https://boasteak.com",reservation:"OpenTable",phone:"(702) 733-7373",group:"Innovative Dining Group"});

add({name:"Canaletto",cuisine:"Italian",neighborhood:"The Strip (Grand Canal Shoppes)",score:87,price:3,tags:["Italian","Scenic","Date Night","Iconic"],description:"Authentic Italian overlooking St. Mark's Square with gondola views. Venetian-inspired dishes, handmade pasta, and regional Italian wines. One of the most photographed dining rooms on the Strip.",dishes:["Risotto","Osso Buco","Venetian Cicchetti"],address:"3377 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"canalettolv",website:"https://www.venetianlasvegas.com/dining/restaurants/canaletto.html",reservation:"OpenTable",phone:"(702) 733-0070",hours:"Daily 11AM-10PM"});

add({name:"CHICA",cuisine:"Latin American",neighborhood:"The Strip (Grand Canal Shoppes)",score:87,price:3,tags:["Latin","Date Night","Brunch","Local Favorites"],description:"Celebrity Chef Lorena Garcia's vibrant Latin American restaurant at Grand Canal Shoppes. Show-stopping dishes celebrating Colombian, Peruvian, Argentinian, and Venezuelan flavors. Weekend brunch is a Strip favorite.",dishes:["Lomo Saltado","Ceviche","Weekend Brunch"],address:"3377 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"chicarestaurants",website:"https://www.venetianlasvegas.com/dining/restaurants/chica.html",reservation:"OpenTable",phone:"(702) 805-8472"});

add({name:"Cañonita",cuisine:"Mexican",neighborhood:"The Strip (Grand Canal Shoppes)",score:86,price:2,tags:["Mexican","Scenic","Casual","Local Favorites"],description:"Authentic Mexican food and street tacos at the Grand Canal Shoppes. Hand-packed tortillas, house-made salsas, and a margarita program overlooking the canal. Casual Strip Mexican with great views.",dishes:["Street Tacos","Hand-Packed Tortillas","Margaritas"],address:"3377 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"canonita",website:"https://www.venetianlasvegas.com/dining/restaurants/canonita.html",reservation:"OpenTable",phone:"(702) 420-2561"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 15 complete!');
