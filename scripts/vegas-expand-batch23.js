// Vegas Batch 23 — more iconic bars + cocktail lounges
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

add({name:"The Chandelier",cuisine:"Cocktail Bar / Lounge",neighborhood:"The Strip (The Cosmopolitan)",score:92,price:3,tags:["Cocktails","Date Night","Late Night","Iconic","Celebrations"],description:"Three-story chandelier lounge at the heart of The Cosmopolitan — 2 million crystal strands. Each level has its own cocktail program and vibe: Level 1 casino bar, Level 1.5 craft cocktails, Level 2 DJ lounge. Open 24/7. A Vegas visual landmark.",dishes:["Crystal Chandelier Bar","3 Levels of Cocktails","24/7 Service"],address:"3708 S Las Vegas Blvd Lvls 1, 1.5, 2, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"thechandelierlv",website:"https://cosmopolitanlasvegas.mgmresorts.com",reservation:"walk-in",phone:"(702) 698-7000",hours:"Open 24/7"});

add({name:"Bleau Bar",cuisine:"Cocktail Bar / Lobby Bar",neighborhood:"The Strip (Fontainebleau)",score:89,price:3,tags:["Cocktails","Date Night","Late Night","Iconic","Cigars"],description:"Fontainebleau's signature lobby bar — beneath a towering chandelier of thousands of crystal bowties. Expert craft cocktails, premium spirits, and a cigar program. 24/7 operation in the heart of Fontainebleau's Miami-inspired lobby.",dishes:["Crystal Bowtie Chandelier","Classic + Innovative Cocktails","Cigars"],address:"2777 S Las Vegas Blvd Lvl 1, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"fontainebleaulv",website:"https://www.fontainebleaulasvegas.com/nightlife/all-nightlife/bleau-bar",reservation:"walk-in",phone:"(702) 678-9000",hours:"Open 24/7"});

add({name:"White Whale",cuisine:"Cocktail Bar",neighborhood:"Downtown",score:88,price:2,tags:["Cocktails","Date Night","Late Night","Local Favorites","Casual"],description:"Craft cocktail lounge that opened October 2024 in the former Downtown Cocktail Room space on Las Vegas Blvd S. Fresh-squeezed juices, house-made syrups, premium spirits. Intimate lounge-style — Downtown's newest grown-up cocktail hideaway.",dishes:["Craft Cocktails","House-Made Syrups","Intimate Lounge"],address:"111 S Las Vegas Blvd, Las Vegas, NV 89101",lat:36.1683,lng:-115.1450,instagram:"whitewhale.lv",website:"https://www.whitewhalelv.com",reservation:"walk-in",phone:"(725) 206-5879",hours:"Mon-Sun 4PM-2AM"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 23 complete!');
