// Vegas Batch 12 — Resorts World & gap-fill Strip casual
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

// === RESORTS WORLD ===
add({name:"Wally's",cuisine:"New American / Wine Bar",neighborhood:"The Strip (Resorts World)",score:90,price:3,tags:["New American","Wine Bar","Date Night","Local Favorites","Critics Pick"],description:"Iconic Southern California wine brand's first Vegas location at Resorts World. Hybrid restaurant, wine bar, and 8,000-label gourmet market. 100+ wines by the glass, elite caviar program, and a menu spanning from salmon toast to seared foie gras.",dishes:["Caviar Service","Charcuterie Boards","Seared Foie Gras"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"wallyslasvegas",website:"https://www.wallywine.com/lasvegas",reservation:"OpenTable",phone:"(702) 676-6966",group:"Wally's"});

add({name:"Brezza",cuisine:"Italian / Coastal",neighborhood:"The Strip (Resorts World)",score:91,price:4,tags:["Italian","Date Night","Celebrations","Critics Pick"],description:"Chef Nicole Brisson's elevated coastal Italian at Resorts World. Handmade pasta, dry-aged steaks, wood-fired seafood, and one of the best Italian wine programs on the Strip. Beautiful sun-drenched dining room.",dishes:["Handmade Pasta","Dry-Aged Steak","Coastal Italian"],address:"3000 S Las Vegas Blvd Ste 115, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"brezzalv",website:"https://brezzaitalian.com",reservation:"OpenTable",phone:"(702) 676-6014"});

add({name:"Fuhu",cuisine:"Pan-Asian",neighborhood:"The Strip (Resorts World)",score:90,price:3,tags:["Asian","Date Night","Late Night","Critics Pick"],description:"Zouk Group's Pan-Asian flagship at Resorts World. Peking duck, hand-pulled noodles, and live-action dim sum. Dramatic LED-installation dining room transitions to late-night party scene.",dishes:["Peking Duck","Dim Sum","Hand-Pulled Noodles"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"fuhulv",website:"https://www.rwlasvegas.com/dining/fuhu",reservation:"OpenTable",phone:"(702) 676-7740",group:"Zouk Group"});

add({name:"Carversteak",cuisine:"Steakhouse",neighborhood:"The Strip (Resorts World)",score:91,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Critics Pick"],description:"Resorts World's marquee steakhouse. Dry-aged prime beef cut and carved tableside in a dramatic contemporary dining room with onyx and brass accents. One of the most talked-about new Strip steakhouses.",dishes:["Tableside-Carved Prime","Dry-Aged Beef","Caviar"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"carversteak",website:"https://carversteak.com",reservation:"OpenTable",phone:"(702) 550-2333"});

add({name:"Crossroads Kitchen",cuisine:"Plant-Based / Vegan",neighborhood:"The Strip (Resorts World)",score:91,price:4,tags:["Vegetarian","Fine Dining","Date Night","Critics Pick","Brunch"],description:"Chef Tal Ronnen's fine-dining plant-based flagship at Resorts World since 2022. Upscale décor, cocktail program, and Sunday vegan brunch buffet. The premier 100% plant-based fine-dining room in the country.",dishes:["Lasagna Bolognese","Artichoke Oysters","Sunday Brunch Buffet"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"crossroadskitchen",website:"https://www.crossroadslasvegas.com",reservation:"OpenTable",phone:"(702) 676-7978"});

// === STRIP FILL-INS ===
add({name:"Fleur by Hubert Keller",cuisine:"French / Mediterranean",neighborhood:"The Strip (Mandalay Bay)",score:89,price:3,tags:["French","Date Night","Critics Pick","Local Favorites"],description:"Top Chef Masters winner Hubert Keller's Mandalay Bay restaurant. French cuisine with Mediterranean accents — tapas-style small plates, iconic burger, and an elegant lounge setting. A Vegas mainstay for decades.",dishes:["Fleur Burger","Tapas Plates","Mediterranean"],address:"3950 S Las Vegas Blvd, Las Vegas, NV 89119",lat:36.0925,lng:-115.1760,instagram:"fleurlasvegas",website:"https://www.mandalaybay.mgmresorts.com/en/restaurants/fleur.html",reservation:"OpenTable",phone:"(702) 632-9400"});

add({name:"Gordon Ramsay Pub & Grill",cuisine:"British Pub",neighborhood:"The Strip (Caesars Palace)",score:87,price:2,tags:["British","Casual","Late Night","Iconic"],description:"Gordon Ramsay's authentic English pub at Caesars Palace. Elevated British pub fare — bangers and mash, fish and chips, shepherd's pie. Craft beer list and late-night hours. No dress code.",dishes:["Fish and Chips","Bangers and Mash","Shepherd's Pie"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"gordonramsaypubandgrill",website:"https://www.gordonramsayrestaurants.com/en/us/gordon-ramsay-pub-and-grill/las-vegas",reservation:"OpenTable",phone:"(702) 731-7410",group:"Gordon Ramsay Restaurants",hours:"Sun-Thu 11AM-11PM, Fri-Sat 11AM-12AM"});

add({name:"Gordon Ramsay Burger",cuisine:"Burgers",neighborhood:"The Strip (Planet Hollywood)",score:86,price:2,tags:["Burgers","Casual","Late Night","Iconic"],description:"Gordon Ramsay's burger flagship at Planet Hollywood. Strip-side patio overlooking the Strip. Creative burger menu including the Hell's Kitchen Burger and signature Farmhouse Burger. Daily until 1 AM.",dishes:["Hell's Kitchen Burger","Farmhouse Burger","Sticky Toffee Pudding"],address:"3667 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1089,lng:-115.1726,instagram:"gordonramsayburger",website:"https://www.gordonramsayrestaurants.com/en/us/gordon-ramsay-burger/las-vegas",reservation:"walk-in",phone:"(702) 785-5462",group:"Gordon Ramsay Restaurants",hours:"Daily 10AM-1AM"});

add({name:"Beerhaus",cuisine:"American / Beer Hall",neighborhood:"The Strip (The Park)",score:84,price:2,tags:["Casual","Local Favorites","Late Night"],description:"Community-style American beer hall in The Park between New York-New York and Park MGM. 30+ craft beers on tap, elevated bar bites, live music, and an outdoor patio on the Strip's newest pedestrian corridor.",dishes:["Craft Beer","Bar Snacks","Burgers"],address:"3782 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1054,lng:-115.1760,instagram:"beerhauslv",website:"",reservation:"walk-in",phone:"(702) 692-2337",hours:"Sun-Thu 11AM-10PM, Fri-Sat 11AM-11PM"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 12 complete!');
