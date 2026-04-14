// Vegas Batch 14 — more Strip classics & new openings
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

add({name:"Cipriani",cuisine:"Italian / Venetian",neighborhood:"The Strip (Wynn Plaza)",score:91,price:4,tags:["Italian","Fine Dining","Date Night","Celebrations","Iconic"],description:"Italian institution brings classic glamour, impeccable service, and four-generation Venetian recipes to Wynn Plaza. World-famous Bellini, carpaccio alla Cipriani, and baked tagliolini. Gold-accented dining room.",dishes:["Bellini","Carpaccio alla Cipriani","Baked Tagliolini"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"cipriani",website:"https://www.cipriani.com/cipriani-las-vegas",reservation:"OpenTable",phone:"(702) 342-9600",hours:"Sun-Thu 11:30AM-11PM, Fri-Sat 11:30AM-11:30PM",group:"Cipriani"});

add({name:"Pisces",cuisine:"Mediterranean / Seafood",neighborhood:"The Strip (Wynn)",score:92,price:4,tags:["Seafood","Mediterranean","Fine Dining","Date Night","Scenic","Critics Pick"],description:"Chef Martin Heierling's Mediterranean seafood at Wynn Lake of Dreams — opened 2025. Serene split-level dining room with fish-skin-upholstered chairs overlooking the water. Caviar, crudo, dry-aged fish, and handmade pastas.",dishes:["Caviar & Crudo","Dry-Aged Fish","Seafood Platters"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"piscesatwynn",website:"https://www.wynnlasvegas.com/dining/fine-dining/pisces-bar-and-seafare",reservation:"OpenTable",phone:"(702) 770-3463",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-10:30PM"});

add({name:"Casa Playa",cuisine:"Coastal Mexican",neighborhood:"The Strip (Encore at Wynn)",score:91,price:4,tags:["Mexican","Fine Dining","Date Night","Critics Pick","Local Favorites"],description:"Chef Sarah Thompson's coastal Baja-California Mexican at Encore — Michelin-pedigree alumna of Marea and Cosme. Housemade masa program, wood-fire cooking, and fresh seafood. A Vegas fine-dining Mexican benchmark.",dishes:["Aguachile","Pescado Zarandeado","Handmade Tortillas"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"casaplaya.wynn",website:"https://www.wynnlasvegas.com/dining/fine-dining/casa-playa",reservation:"OpenTable",phone:"(702) 770-5340"});

add({name:"Brera Osteria",cuisine:"Italian",neighborhood:"The Strip (The Venetian)",score:89,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick"],description:"Chef Angelo Auriana's innovative Italian at Grand Canal Shoppes. Handmade pasta, wood-grilled fish and meats, and an extensive Italian regional wine list. Elegant room overlooking the canals.",dishes:["Handmade Pasta","Wood-Grilled Fish","Osso Buco"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"breraosteria",website:"https://www.venetianlasvegas.com/dining/restaurants/brera-osteria.html",reservation:"OpenTable",phone:"(702) 414-1227"});

add({name:"Mercato della Pescheria",cuisine:"Italian / Seafood",neighborhood:"The Strip (The Venetian)",score:87,price:3,tags:["Italian","Seafood","Scenic","Date Night","Local Favorites"],description:"Market-style Italian seafood in the Grand Canal Shoppes' St. Mark's Square. Fresh Crudo Raw station, Macelleria meat counter, and authentic Italian seafood dishes. Venetian-themed ambience with gondola views.",dishes:["Crudo Raw Bar","Whole Branzino","Seafood Risotto"],address:"3377 S Las Vegas Blvd Ste 2410, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"mercatodellapescheria",website:"https://www.mercatodellapescheria.com/las-vegas-locations/st-marks-square",reservation:"OpenTable",phone:"(702) 837-0390",hours:"Daily 11AM-10:30PM"});

add({name:"Bouchon",cuisine:"French / Bistro",neighborhood:"The Strip (The Venetian)",score:92,price:4,tags:["French","Date Night","Brunch","Celebrations","Iconic","Critics Pick"],description:"Thomas Keller's French bistro at The Venetian since 2004. Steak frites, roasted chicken, mussels marinière, and legendary weekend brunch. A Vegas fine-dining French classic — one of Keller's most successful concepts.",dishes:["Steak Frites","Roasted Chicken","Weekend Brunch"],address:"3355 S Las Vegas Blvd 10th Floor, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"thomaskellerrg",website:"https://thomaskeller.com/bouchonlasvegas",reservation:"OpenTable",phone:"(702) 414-6200",group:"Thomas Keller Restaurant Group"});

add({name:"Amalfi by Bobby Flay",cuisine:"Italian / Coastal",neighborhood:"The Strip (Caesars Palace)",score:88,price:4,tags:["Italian","Seafood","Date Night","Celebrations","Critics Pick"],description:"Bobby Flay's coastal-Italian seafood at Caesars Palace — market-style fishmonger display, handmade pasta, and Campania wine list. One of the hottest Strip openings of recent years.",dishes:["Whole Fish","Handmade Pasta","Crudo"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"amalfilasvegas",website:"https://www.caesars.com/caesars-palace/restaurants/amalfi-by-bobby-flay",reservation:"OpenTable",phone:"(702) 650-5965",hours:"Sun-Thu 4:30PM-10PM, Fri-Sat 4:30PM-11PM"});

add({name:"Brioche by Guy Savoy",cuisine:"French / Bakery",neighborhood:"The Strip (Caesars Palace)",score:88,price:2,tags:["Bakery/Coffee","French","Casual","Iconic","Late Night"],description:"Guy Savoy's 24-hour French grab-and-go bakery at Caesars Palace. Sweet and savory French pastries, espresso, and sandwiches crafted by the Michelin-starred chef's team. Open around the clock.",dishes:["Brioche","Croissants","Pain au Chocolat"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"briochebyguysavoy",website:"https://www.caesars.com/caesars-palace/restaurants/brioche-by-guy-savoy",reservation:"walk-in",phone:"(866) 227-5938",hours:"Open 24/7"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 14 complete!');
