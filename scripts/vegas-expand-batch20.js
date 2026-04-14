// Vegas Batch 20 — Nightlife: major nightclubs + dayclubs + dive bars
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

// === STRIP NIGHTCLUBS ===
add({name:"XS Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (Encore at Wynn)",score:95,price:4,tags:["Nightclub","Late Night","Iconic","Celebrations","Cocktails"],description:"Forbes Travel Guide award-winning Encore nightclub — 40,000 sq ft of gold-accented excess wrapping around the Encore European Pool. Residencies from the world's top DJs. One of the highest-grossing nightclubs in America year after year.",dishes:["Top-Tier DJ Residencies","Indoor/Outdoor Dancing","Bottle Service"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"xslasvegas",website:"https://www.wynnlasvegas.com/nightlife/xs-nightclub",reservation:"phone",phone:"(702) 770-0097",group:"Wynn Nightlife"});

add({name:"Omnia Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (Caesars Palace)",score:93,price:4,tags:["Nightclub","Late Night","Iconic","Celebrations","Cocktails"],description:"75,000 sq ft multi-level Caesars Palace nightclub. Main room features a dynamic kinetic chandelier, ultra-lounge, and rooftop garden. Residencies from Calvin Harris, Steve Aoki, Zedd, and NGHTMRE.",dishes:["Dynamic Chandelier","Rooftop Garden","DJ Residencies"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"omnianightclub",website:"https://taogroup.com/venues/omnia-nightclub-las-vegas",reservation:"phone",phone:"(702) 785-6200",hours:"Tue, Thu-Sun 10:30PM-4AM",group:"Tao Group Hospitality"});

add({name:"Zouk Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (Resorts World)",score:92,price:4,tags:["Nightclub","Late Night","Celebrations","Cocktails"],description:"Resorts World's flagship nightclub with massive LED walls and wild ceiling lighting. Balanced programming of top 40 and EDM plus live performances from artists like Jack Harlow. Across from Wynn/Encore.",dishes:["LED Walls","Top 40 + EDM","Live Performances"],address:"3000 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"zouklv",website:"https://www.rwlasvegas.com/entertainment/zouk-nightclub",reservation:"phone",phone:"(702) 802-6460",group:"Zouk Group"});

add({name:"Marquee Nightclub",cuisine:"Nightclub / Dayclub",neighborhood:"The Strip (The Cosmopolitan)",score:91,price:4,tags:["Nightclub","Late Night","Iconic","Celebrations","Cocktails"],description:"60,000 sq ft Cosmopolitan multi-space nightclub from Tao Group — main room, Library lounge, Boom Box, plus the adjacent Marquee Dayclub pool complex. Open Wed, Fri, Sat, Sun nights.",dishes:["Main Room + Library","Marquee Dayclub Pool","EDM Residencies"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"marqueelasvegas",website:"https://taogroup.com/venues/marquee-nightclub-las-vegas",reservation:"phone",phone:"(702) 333-9000",group:"Tao Group Hospitality"});

add({name:"LIV Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (Fontainebleau)",score:90,price:4,tags:["Nightclub","Late Night","Celebrations","Cocktails"],description:"David Grutman's Miami-born LIV brand at Fontainebleau — two levels of VIP booths and bars overlooking a centralized stage with a massive video wall. Opened December 2023 with the Fontainebleau debut.",dishes:["Two-Level VIP","Video Wall Stage","EDM + Hip-Hop"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"livlv",website:"https://www.livnightclub.com/las-vegas",reservation:"phone",phone:"(702) 678-9000",hours:"Fri-Sat 10PM-4AM",group:"Groot Hospitality"});

add({name:"Hakkasan Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (MGM Grand)",score:89,price:4,tags:["Nightclub","Late Night","Iconic","Celebrations","Cocktails"],description:"One of the Strip's largest nightclubs — 80,000 sq ft across multiple levels at MGM Grand. Main room with world-class DJs plus The Studio — a separate 2-story clubhouse. Themed decor and dancers change nightly.",dishes:["80,000 Sq Ft","The Studio","Themed Nights"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"hakkasanvegas",website:"https://taogroup.com/venues/hakkasan-nightclub-las-vegas",reservation:"phone",phone:"(702) 891-3838",hours:"Wed (Studio) 10:30PM-Close, Thu-Sat 10:30PM-Close",group:"Tao Group Hospitality"});

add({name:"Drai's Nightclub",cuisine:"Nightclub",neighborhood:"The Strip (The Cromwell)",score:89,price:4,tags:["Nightclub","Late Night","Iconic","Celebrations","Cocktails","Hip Hop"],description:"Strip hip-hop nightclub destination inside The Cromwell — 11 stories above the Strip with 60,000 sq ft, 150+ VIP tables, eight pools, and 7,000 sq ft of LED screens. Hip-hop focused programming with A-list performers.",dishes:["Rooftop Pool Complex","Hip-Hop A-List","LED Screens"],address:"3595 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1159,lng:-115.1732,instagram:"draislv",website:"https://draisgroup.com/las-vegas",reservation:"phone",phone:"(702) 777-3800"});

// === STRIP DAYCLUBS ===
add({name:"Encore Beach Club",cuisine:"Dayclub / Pool Party",neighborhood:"The Strip (Encore at Wynn)",score:93,price:4,tags:["Dayclub","Late Night","Iconic","Celebrations","Cocktails","Scenic"],description:"Encore's three-tiered pool complex transforming into a daytime dance party Friday-Sunday. Private cabanas, plush daybeds, top DJ residencies. Opens 11 AM-noon, closes 5:30-6:30 PM. Sister venue to XS.",dishes:["Three-Tier Pool","Private Cabanas","EDM DJ Residencies"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"encorebeachclub",website:"https://www.wynnlasvegas.com/nightlife/encore-beach-pool",reservation:"phone",phone:"(702) 770-7300",hours:"Fri-Sun 11AM-6:30PM (seasonal)",group:"Wynn Nightlife"});

add({name:"Palm Tree Beach Club",cuisine:"Dayclub / Pool Party",neighborhood:"The Strip (MGM Grand)",score:89,price:4,tags:["Dayclub","Celebrations","Cocktails","Scenic"],description:"Opened May 2025 at MGM Grand's former Wet Republic space. Tao Group partnership with Palm Tree Crew Records (Kygo). Tropical island vibe with multiple pools and beachy programming. The Strip's newest dayclub destination.",dishes:["Tropical Pool Complex","Palm Tree Crew DJ Series","Beach Cabanas"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"palmtreebeachclub",website:"https://taogroup.com/venues/palm-tree-beach-club-las-vegas",reservation:"phone",phone:"(702) 891-3563",group:"Tao Group Hospitality"});

// === DIVE BARS / CLASSIC LOUNGES ===
add({name:"Atomic Liquors",cuisine:"Bar / Dive Bar",neighborhood:"Downtown (Fremont East)",score:90,price:1,tags:["Cocktails","Late Night","Iconic","Local Favorites","Casual"],description:"Las Vegas's oldest freestanding bar — opened April 17, 1954. Named for Atomic testing era when patrons watched mushroom clouds from the roof. The Kitchen at Atomic serves food. A Fremont East pilgrimage spot.",dishes:["Classic Cocktails","Beer & Whiskey","The Kitchen Menu"],address:"917 E Fremont St, Las Vegas, NV 89101",lat:36.1693,lng:-115.1375,instagram:"atomiclasvegas",website:"https://atomic.vegas",reservation:"walk-in",phone:"(702) 982-3000",hours:"Mon-Thu,Sun 12PM-2AM, Fri-Sat 12PM-3AM"});

add({name:"Dino's Lounge",cuisine:"Dive Bar / Karaoke",neighborhood:"Arts District",score:88,price:1,tags:["Cocktails","Late Night","Iconic","Local Favorites","Casual","Karaoke"],description:"'The Last Neighborhood Bar in Las Vegas' — Arts District dive bar since 1962. Legendary weekend karaoke, cheap drinks, stiff pours, and Vegas local character at its finest. Open 24/7.",dishes:["Weekend Karaoke","Cheap Drinks","Stiff Pours"],address:"1516 S Las Vegas Blvd, Las Vegas, NV 89104",lat:36.1548,lng:-115.1548,instagram:"dinosloungelv",website:"https://dinoslv.com",reservation:"walk-in",phone:"(702) 382-3894",hours:"Open 24/7"});

add({name:"Champagne's Cafe",cuisine:"Dive Bar / Karaoke",neighborhood:"East Las Vegas",score:87,price:1,tags:["Cocktails","Late Night","Iconic","Local Favorites","Casual","Karaoke"],description:"Las Vegas's oldest continuously operating bar — opened 1966 as Sundown Liquors. Classic red-flocked wallpaper, midcentury lounge vibe, nightly karaoke. The quintessential old-Vegas dive.",dishes:["Cheap Well Drinks","Nightly Karaoke","Midcentury Lounge"],address:"3557 S Maryland Pkwy, Las Vegas, NV 89169",lat:36.1285,lng:-115.1340,instagram:"champagnescafelv",website:"https://champagnescafe.vegas",reservation:"walk-in",phone:"(702) 737-1699",hours:"Open 24/7"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 20 complete!');
