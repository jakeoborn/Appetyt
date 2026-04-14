// Vegas Batch 17 — Wynn / Encore fill-ins
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

add({name:"Sartiano's Italian Steakhouse",cuisine:"Italian / Steakhouse",neighborhood:"The Strip (Wynn)",score:91,price:4,tags:["Italian","Steakhouse","Fine Dining","Date Night","Celebrations","Critics Pick"],description:"NYC import Sartiano's Italian steakhouse at Wynn — adjacent to private members club Zero Bond, overlooking Wynn Golf Club. Modern Italian hits, dry-aged steaks, and a jet-set membership crowd. One of the newest Wynn openings.",dishes:["Dry-Aged Steaks","Pasta Bolognese","Veal Milanese"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"sartianoslv",website:"https://www.wynnlasvegas.com/dining/fine-dining/sartianos",reservation:"OpenTable",phone:"(702) 770-3463"});

add({name:"Tableau",cuisine:"New American / Brunch",neighborhood:"The Strip (Wynn Tower Suites)",score:89,price:3,tags:["New American","Brunch","Date Night","Local Favorites","Scenic"],description:"Wynn Tower Suites' daytime American restaurant with a lush garden conservatory and pool-view patio. Weekend brunch is one of the best on the Strip — market-fresh seasonal dishes from chef-driven kitchen.",dishes:["Belgian Waffles","Seared Salmon","Brunch Classics"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/fine-dining/tableau",reservation:"Resy",phone:"(702) 770-3330",hours:"Daily 7AM-3PM"});

add({name:"Wazuzu",cuisine:"Pan-Asian",neighborhood:"The Strip (Encore at Wynn)",score:86,price:3,tags:["Asian","Casual","Date Night","Local Favorites"],description:"Encore's Pan-Asian dining room steps from the Encore Esplanade. Chinese, Japanese, Thai, and Vietnamese-inspired dishes. Famous for the giant LED dragon sculpture and Peking duck.",dishes:["Peking Duck","Pan-Asian Noodles","Sushi"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wazuzu",website:"https://www.wynnlasvegas.com/dining/casual-dining/wazuzu",reservation:"OpenTable",phone:"(702) 770-5388"});

add({name:"Allegro",cuisine:"Italian",neighborhood:"The Strip (Wynn)",score:86,price:3,tags:["Italian","Casual","Local Favorites"],description:"Chef Enzo Febbraro's casual Italian at Wynn — over a quarter-million guests annually. Wood-fired pizzas, handmade pastas, lasagna Napoletana. Central Wynn location steps from the show theaters.",dishes:["Wood-Fired Pizza","Lasagna Napoletana","Handmade Pasta"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/casual-dining/allegro",reservation:"OpenTable",phone:"(702) 770-2040"});

add({name:"Red 8",cuisine:"Chinese / Cantonese",neighborhood:"The Strip (Wynn)",score:87,price:3,tags:["Chinese","Casual","Late Night","Local Favorites"],description:"Wynn's Asian restaurant on the casino floor — Cantonese noodle dishes, dim sum, vegetable dishes, and Hong Kong-style barbecue. Reliable mid-price Asian on the Strip.",dishes:["Cantonese Noodles","Dim Sum","Hong Kong BBQ"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/casual-dining/red-8",reservation:"walk-in",phone:"(702) 770-3380"});

add({name:"La Cave Wine & Food Hideaway",cuisine:"New American / Wine Bar",neighborhood:"The Strip (Wynn)",score:87,price:3,tags:["Wine Bar","Date Night","Local Favorites","Scenic"],description:"Wynn's intimate wine hideaway along Fairway Esplanade overlooking pool and gardens. Small plates ideal for sharing, accompanied by an extensive wine program. A quieter alternative to the Wynn flagship rooms.",dishes:["Small Plates","Wine Program","Pool-View Patio"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/casual-dining/la-cave",reservation:"OpenTable",phone:"(702) 770-7375"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 17 complete!');
