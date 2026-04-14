// Vegas Batch 16 — more Venetian + Caesars Palace
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

// === VENETIAN ===
add({name:"COTE Korean Steakhouse",cuisine:"Korean / Steakhouse",neighborhood:"The Strip (The Venetian)",score:93,price:4,tags:["Korean","Steakhouse","Fine Dining","Date Night","Celebrations","Critics Pick","Awards"],description:"Michelin-starred Korean steakhouse — merging Korean grilling traditions with upscale American steakhouse elegance. Smokeless tableside grills, USDA Prime, dry-aged, and A5 Wagyu. Named 'Best Steakhouse in North America' by World's 101 Best Steak Restaurants.",dishes:["Butcher's Feast","A5 Wagyu","Dry-Aged Steaks"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"cote_vegas",website:"https://www.venetianlasvegas.com/dining/restaurants/cote.html",reservation:"Resy",phone:"(866) 659-9643",awards:"Michelin Star · Best Steakhouse in North America"});

add({name:"HaSalon",cuisine:"Mediterranean / Israeli",neighborhood:"The Strip (The Venetian)",score:90,price:4,tags:["Mediterranean","Date Night","Late Night","Critics Pick","Celebrations"],description:"Chef Eyal Shani's elevated Mediterranean-Israeli at The Venetian — Tel Aviv's culinary spirit in Vegas form. Show-stopping communal tables, nightly entertainment, and high-energy atmosphere that turns into party.",dishes:["Whole Branzino","Mediterranean Mezze","Fresh Bread Service"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"hasalonlv",website:"https://www.venetianlasvegas.com/dining/restaurants/hasalon.html",reservation:"Resy",phone:"(866) 659-9643",hours:"Tue-Thu 4:30PM-9:30PM, Fri-Sat 4:30PM-10:30PM, Sat Brunch 9AM-2PM"});

add({name:"Nomikai",cuisine:"Japanese / Sushi",neighborhood:"The Strip (The Venetian)",score:89,price:3,tags:["Japanese","Sushi","Date Night","Late Night","Critics Pick"],description:"Twin chefs Nick & Jun An's Japanese concept at The Venetian — casual Tokyo-inspired handroll counter up front plus a dimly-lit speakeasy with premium sushi and rare Japanese whisky. 2025 Silver Best Sushi.",dishes:["Handroll Counter","Speakeasy Sushi","Japanese Whisky"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"nomikailv",website:"https://www.venetianlasvegas.com/dining/restaurants/nomikai.html",reservation:"Resy",phone:"(702) 414-3474",hours:"Sun-Mon 11AM-10PM, Tue-Thu 11AM-11PM, Fri-Sat 11AM-1AM"});

add({name:"Gjelina",cuisine:"Californian / Mediterranean",neighborhood:"The Strip (The Venetian)",score:91,price:3,tags:["New American","Date Night","Brunch","Critics Pick","Local Favorites"],description:"Venice Beach cult favorite's third location at The Venetian. Produce-forward, locally sourced, sustainable cuisine. Wood-fired pizzas, house-made pastas, and vibrant vegetable plates. Michelin recognition at the LA original.",dishes:["Wood-Fired Pizza","Burrata","House-Made Pasta"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"gjelinalv",website:"https://www.venetianlasvegas.com/dining/restaurants/gjelina.html",reservation:"Resy",phone:"(702) 414-6333",hours:"Mon-Thu 11AM-10PM, Fri 11AM-11PM, Sat 9AM-11PM, Sun 9AM-10PM"});

add({name:"Matteo's Ristorante Italiano",cuisine:"Italian / Northern Italian",neighborhood:"The Strip (The Venetian)",score:88,price:3,tags:["Italian","Date Night","Local Favorites"],description:"Indulgent Northern Italian at The Venetian — locally sourced ingredients and traditional culinary techniques. Handmade pastas, veal Milanese, and approachable fine-dining Italian.",dishes:["Veal Milanese","Handmade Pasta","Northern Italian"],address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1217,lng:-115.1703,instagram:"matteoslv",website:"https://www.venetianlasvegas.com/dining/restaurants/matteos-ristorante-italiano.html",reservation:"OpenTable",phone:"(702) 414-1222"});

// === CAESARS PALACE ===
add({name:"Peter Luger Steak House",cuisine:"Steakhouse",neighborhood:"The Strip (Caesars Palace)",score:92,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Iconic","Critics Pick"],description:"Legendary Brooklyn steakhouse since 1887 — first-ever Las Vegas location at Caesars Palace. Signature dry-aged porterhouse, German fried potatoes, and the famous burger at lunch. A NYC classic arrives in Vegas.",dishes:["Porterhouse for Two","German Fried Potatoes","The Burger"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"peterluger",website:"https://www.caesars.com/caesars-palace/restaurants/peter-luger-steak-house",reservation:"OpenTable",phone:"(702) 731-7267"});

add({name:"Bacchanal Buffet",cuisine:"Buffet / Global",neighborhood:"The Strip (Caesars Palace)",score:87,price:3,tags:["Casual","Iconic","Brunch","Local Favorites"],description:"The largest buffet on the Las Vegas Strip — 250+ menu items across 10 kitchens with 9 chef-attended action stations. Global flavors, made-to-order dishes, and a legendary Vegas weekend buffet experience.",dishes:["Action Stations","Seafood Bar","Carving Stations"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"bacchanalbuffet",website:"https://www.caesars.com/caesars-palace/restaurants/bacchanal-buffet",reservation:"OpenTable",phone:"(702) 731-7928"});

add({name:"Brasserie B by Bobby Flay",cuisine:"French / Steakhouse",neighborhood:"The Strip (Caesars Palace)",score:88,price:4,tags:["French","Steakhouse","Brunch","Date Night","Critics Pick"],description:"Bobby Flay's Parisian-style steakhouse at Caesars Palace — French-inspired breakfast, lunch, and dinner. Steak frites, onion soup gratinée, crêpes Suzette. All-day dining done à la française.",dishes:["Steak Frites","Onion Soup Gratinée","Crêpes Suzette"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"brasseriebbobbyflay",website:"https://www.caesars.com/caesars-palace/restaurants/brasserie-b",reservation:"OpenTable",phone:"(866) 733-5827"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 16 complete!');
