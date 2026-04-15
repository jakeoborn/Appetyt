// Seattle Batch 24 — Final push to 250. 7 verified spots.
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const SEATTLE_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Seattle:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

add({name:"Sushi by Scratch Restaurants Seattle",cuisine:"Japanese / Omakase",neighborhood:"South Lake Union",score:92,price:4,tags:["Sushi","Japanese","Fine Dining","Tasting Menu","Date Night","Celebrations","Critics Pick","Exclusive"],description:"Michelin-pedigree 10-seat omakase counter from the Sushi|Bar group. 17-course nigiri-focused tasting with single-origin sushi rice and hyper-curated fish. Hidden entrance, two seatings a night.",dishes:["17-Course Nigiri Omakase","Hidden-Entrance Counter","Sake Pairing"],address:"2331 6th Ave, Seattle, WA 98121",lat:47.6168,lng:-122.3406,instagram:"sushibyscratchrestaurants",website:"https://www.sushibyscratchrestaurants.com/seattle",reservation:"Tock",phone:"(253) 237-6761",hours:"Tue-Sat 5:30PM & 8:15PM seatings, Closed Sun-Mon",awards:"Sushi|Bar Group — sibling of Michelin-starred LA flagship"});

add({name:"The Triple Door",cuisine:"Asian Fusion / Supper Club",neighborhood:"Downtown",score:86,price:3,tags:["Asian Fusion","Live Music","Date Night","Cocktails","Iconic","Celebrations"],description:"Downtown dinner theater under the Showbox — pan-Asian small plates, craft cocktails, and live shows nightly in a 1920s vaudeville room. Mains and stage share the evening.",dishes:["Pan-Asian Small Plates","Live Music Nightly","Vaudeville Room"],address:"216 Union St, Seattle, WA 98101",lat:47.6088,lng:-122.3365,instagram:"thetripledoorseattle",website:"https://thetripledoor.net",reservation:"OpenTable",phone:"(206) 838-4333",hours:"Tue-Thu,Sun 4PM-9PM, Fri-Sat 4PM-10PM, Closed Mon"});

add({name:"Linda's Tavern",cuisine:"American / Bar",neighborhood:"Capitol Hill",score:85,price:1,tags:["American","Iconic","Late Night","Casual","Local Favorites","Cocktails","Brunch"],description:"Capitol Hill neighborhood tavern since 1994 — the last place Kurt Cobain was seen. Comfort-food menu, Bloody Mary brunches, and pure grunge-era Seattle atmosphere. A music-scene landmark.",dishes:["Tater Tots","Weekend Brunch","Classic Cheap Cocktails"],address:"707 E Pine St, Seattle, WA 98122",lat:47.6152,lng:-122.3222,instagram:"lindastavern",website:"https://www.lindastavern.com",reservation:"walk-in",phone:"(206) 325-1220",hours:"Daily 4PM-2AM",awards:"Seattle music-scene landmark since 1994",indicators:["dive-bar"]});

add({name:"Wild Ginger",cuisine:"Pan-Asian / Thai",neighborhood:"Downtown",score:88,price:3,tags:["Asian","Thai","Chinese","Date Night","Iconic","Celebrations","Local Favorites","Awards"],description:"Downtown pan-Asian destination since 1989 — satay bar, Burmese, Thai, and Chinese regional dishes. Second location in Bellevue. A Seattle benchmark for Asian fine dining with longevity.",dishes:["Satay Bar","Seven-Flavor Beef","Fragrant Duck"],address:"1401 3rd Ave, Seattle, WA 98101",lat:47.6092,lng:-122.3362,instagram:"wildgingerseattle",website:"https://www.wildginger.net",reservation:"OpenTable",phone:"(206) 623-4450",hours:"Mon-Thu 4PM-9PM, Fri-Sat 4PM-10PM, Sun 4PM-9PM",awards:"Wine Spectator Award of Excellence"});

add({name:"Ocho",cuisine:"Spanish / Tapas",neighborhood:"Ballard",score:87,price:2,tags:["Spanish","Tapas","Date Night","Late Night","Cocktails","Local Favorites","Critics Pick"],description:"Ballard Avenue Spanish tapas and sherry bar — open until 2 AM. Iberico charcuterie, Basque cider, a tightly edited sherry list, and a loyal neighborhood crowd.",dishes:["Iberico Charcuterie","Patatas Bravas","Sherry List"],address:"2325 NW Market St, Seattle, WA 98107",lat:47.6685,lng:-122.3841,instagram:"ochoballard",website:"https://www.ochoseattle.com",reservation:"walk-in",phone:"(206) 784-0699",hours:"Mon-Fri 4PM-2AM, Sat-Sun 11AM-2AM"});

add({name:"Sam Choy's Poke to the Max",cuisine:"Hawaiian / Poke",neighborhood:"Hillman City",score:87,price:1,tags:["Hawaiian","Asian","Casual","Local Favorites","Family Friendly","Quick Bite"],description:"Hawaiian chef Sam Choy's scratch poke institution. Grew from food truck to brick-and-mortar — ahi cubes over rice, spam musubi, kalua pork plates, and signature Poke Dogs.",dishes:["Ahi Poke Bowl","Spam Musubi","Kalua Pork Plate"],address:"5300 Rainier Ave S, Seattle, WA 98118",lat:47.5498,lng:-122.2709,instagram:"samchoyspoke",website:"https://www.samchoyspoke.com",reservation:"walk-in",phone:"(206) 208-7142",hours:"Mon-Sat 11AM-9PM, Sun 11AM-8PM"});

add({name:"Serafina",cuisine:"Italian",neighborhood:"Eastlake",score:88,price:3,tags:["Italian","Date Night","Iconic","Live Music","Local Favorites","Patio","Brunch"],description:"Eastlake Italian destination since 1991 — romantic courtyard patio, live jazz nightly, and a menu of rustic Italian classics from Susan Kaufman. Weekend brunch is a Seattle staple.",dishes:["Live Jazz Nightly","Courtyard Patio","House Pastas"],address:"2043 Eastlake Ave E, Seattle, WA 98102",lat:47.6430,lng:-122.3253,instagram:"serafinaseattle",website:"https://serafinaseattle.com",reservation:"OpenTable",phone:"(206) 323-0807",hours:"Tue-Sat 5PM-10PM, Sun 10AM-2PM & 5PM-9PM, Closed Mon",indicators:["women-owned"]});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 24 complete!');
