// Vegas Batch 22 — more dayclubs
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

add({name:"Stadium Swim",cuisine:"Dayclub / Pool Amphitheater",neighborhood:"Downtown (Circa)",score:91,price:3,tags:["Dayclub","Scenic","Iconic","Casual","Celebrations"],description:"Circa's 6-pool, stadium-seating pool amphitheater — country's largest pool destination for sports lovers. 143-foot, 14-million-megapixel LED screen, 2 swim-up bars, 365 days a year. Open year-round with heated pools.",dishes:["6 Temperature-Controlled Pools","Mega LED Screen","2 Swim-Up Bars"],address:"8 Fremont St, Las Vegas, NV 89101",lat:36.1710,lng:-115.1450,instagram:"stadiumswim",website:"https://www.circalasvegas.com/stadium-swim",reservation:"phone",phone:"(702) 247-2258",hours:"Mon-Fri 9AM-7PM, Sat-Sun 8AM-9PM"});

add({name:"AYU Dayclub",cuisine:"Dayclub / Pool Party",neighborhood:"The Strip (Resorts World)",score:89,price:4,tags:["Dayclub","Celebrations","Cocktails","Scenic"],description:"Resorts World's tropical-themed dayclub with 17 cabanas, lush palms, and top EDM/hip-hop programming. Asian-inspired aesthetic with daybeds and a massive pool deck. Sister to Zouk Nightclub across the property.",dishes:["Tropical Pool","EDM Residencies","Private Cabanas"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"ayudayclub",website:"https://www.rwlasvegas.com/entertainment/ayu-dayclub",reservation:"phone",phone:"(702) 802-6460",group:"Zouk Group"});

add({name:"TAO Beach Dayclub",cuisine:"Dayclub / Pool Party",neighborhood:"The Strip (The Venetian)",score:88,price:4,tags:["Dayclub","Celebrations","Cocktails","Scenic"],description:"Venetian's tropical Southeast Asian-themed dayclub on the Pool Deck. Reopened fully renovated in 2022. Resort pool by day, full dayclub with DJ programming on weekends. Sister to TAO Nightclub and Tao Asian Bistro.",dishes:["Tropical Pool Deck","DJ Weekends","Pool Cabanas"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"taobeachdayclub",website:"https://taogroup.com/venues/tao-beach-dayclub-las-vegas",reservation:"phone",phone:"(702) 388-8588",group:"Tao Group Hospitality"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 22 complete!');
