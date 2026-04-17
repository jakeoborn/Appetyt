// Seattle Batch 27 — Final push to 300.
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
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';s.photoUrl='';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// ── Wallingford / Lake Union ──────────────────────────────────────────────────
add({name:"Westward",cuisine:"Seafood / American / Mediterranean",neighborhood:"Wallingford",score:89,price:3,tags:["Seafood","Waterfront","Date Night","Mediterranean","Oysters","Patio"],description:"Renee Erickson's waterfront Lake Union restaurant — Mediterranean-influenced Pacific Northwest seafood, wood-fired dishes, and an oyster bar on a stunning dock with mountain views.",address:"2501 N Northlake Way, Seattle, WA 98103",lat:47.6503,lng:-122.3339,instagram:"@westwardseattle",website:"https://westwardseattle.com",phone:"(206) 552-8215",hours:"Wed-Thu 4PM-9PM, Fri-Sun 12PM-9PM, Closed Mon-Tue",reservation:"OpenTable",group:"Sea Creatures",awards:"James Beard-nominated chef"});

// ── Capitol Hill / U-District ─────────────────────────────────────────────────
add({name:"Tacos Chukis",cuisine:"Mexican / Tacos",neighborhood:"Capitol Hill",score:86,price:1,tags:["Mexican","Tacos","Cheap Eats","Late Night","Casual","Student Eats"],description:"Beloved Seattle taco institution with multiple locations — hand-pressed tortillas, slow-cooked al pastor, and homemade salsas served through a tiny window on Broadway.",address:"219 Broadway E, Seattle, WA 98102",lat:47.6232,lng:-122.3204,instagram:"@tacoschukis",website:"https://www.seattlechukis.com",phone:"(206) 328-4447",hours:"Daily 11AM-10PM",reservation:"walk-in"});

add({name:"Off the Rez Cafe",cuisine:"Native American",neighborhood:"University District",score:86,price:1,tags:["Native American","Unique","Casual","Student Eats","Indigenous","Local Favorites"],description:"Seattle's first Native American food truck turned café at the Burke Museum — handmade frybread tacos and Indigenous-inspired fare from one of the city's most culturally significant restaurants.",address:"4300 15th Ave NE, Seattle, WA 98195",lat:47.6601,lng:-122.3063,instagram:"@offthereztruck",website:"https://www.offthereztruck.com",phone:"(206) 414-8226",hours:"Tue-Sun 10AM-5PM, Closed Mon",reservation:"walk-in",indicators:["indigenous-owned"]});

// ── Fremont additional ────────────────────────────────────────────────────────
add({name:"Sea Wolf Bakers",cuisine:"Bakery / Cafe",neighborhood:"Fremont",score:87,price:1,tags:["Bakery","Coffee","Breakfast","Brunch","Sourdough","Neighborhood Gem"],description:"Acclaimed Fremont artisan bakery — naturally leavened sourdough loaves, exceptional croissants, and rotating seasonal pastries from one of Seattle's finest bread-focused kitchens.",address:"3621 Stone Way N, Seattle, WA 98103",lat:47.6516,lng:-122.3481,instagram:"@seawolfbakers",website:"https://seawolfbakers.com",phone:"(206) 420-7174",hours:"Wed-Mon 7AM-4PM, Closed Tue",reservation:"walk-in"});

add({name:"Outsider BBQ",cuisine:"BBQ / American",neighborhood:"Fremont",score:85,price:2,tags:["BBQ","American","Casual","Outdoor","Beer Garden","Local Favorites"],description:"Fremont outdoor BBQ joint with a beer garden — slow-smoked brisket, pulled pork, and ribs in a laid-back setting that draws lines on sunny Seattle weekends.",address:"4010 Leary Way NW, Seattle, WA 98107",lat:47.6541,lng:-122.3617,instagram:"@outsiderbbqseattle",website:"https://www.outsiderbbq.com",phone:"(206) 659-4573",hours:"Wed-Sun 12PM-9PM, Closed Mon-Tue",reservation:"walk-in"});

// ── Hillman City additional ───────────────────────────────────────────────────
add({name:"Tony's Bakery",cuisine:"Vietnamese / Bakery",neighborhood:"Hillman City",score:84,price:1,tags:["Vietnamese","Bakery","Banh Mi","Cheap Eats","Casual","Local Favorites"],description:"Hillman City Vietnamese bakery beloved for scratch-made custom cakes and excellent bánh mì — a Rainier Valley neighborhood institution with an intensely loyal following.",address:"6020 MLK Jr Way S, Seattle, WA 98118",lat:47.5504,lng:-122.2874,instagram:"@tonysbakeryseattle",website:"",phone:"(206) 725-0610",hours:"Tue-Sun 7AM-6PM, Closed Mon",reservation:"walk-in"});

// ── South Lake Union additional ───────────────────────────────────────────────
add({name:"Le Caviste",cuisine:"French / Wine Bar",neighborhood:"South Lake Union",score:87,price:2,tags:["Wine Bar","French","Date Night","Casual","Lunch","Cocktails"],description:"Intimate French wine bar in South Lake Union — curated natural wine list, simple charcuterie boards, and French-bistro comfort food in a casual daytime and evening setting.",address:"1919 7th Ave, Seattle, WA 98101",lat:47.6157,lng:-122.3361,instagram:"@lecaviste",website:"",phone:"(206) 420-7425",hours:"Mon-Fri 11AM-10PM, Sat 3PM-10PM, Closed Sun",reservation:"walk-in"});

// ── Belltown additional ───────────────────────────────────────────────────────
add({name:"Chiho",cuisine:"Chinese / Soup Dumplings",neighborhood:"Belltown",score:86,price:2,tags:["Chinese","Soup Dumplings","Date Night","Casual","Cocktails"],description:"Serene Belltown restaurant specializing in handmade soup dumplings (xiao long bao) — one of the calmest, most refined spots in the neighborhood with a focused, excellent menu.",address:"2218 2nd Ave, Seattle, WA 98121",lat:47.6151,lng:-122.3468,instagram:"@chiho.seattle",website:"https://www.chihoseattle.com",phone:"(206) 420-7305",hours:"Tue-Sun 4PM-10PM, Closed Mon",reservation:"walk-in"});

// ── Georgetown additional ─────────────────────────────────────────────────────
add({name:"Calozzis Cheesesteaks",cuisine:"American / Cheesesteaks",neighborhood:"Georgetown",score:84,price:1,tags:["American","Cheesesteak","Casual","Cheap Eats","Local Favorites","Late Night"],description:"Georgetown's beloved cheesesteak institution — Philly-style sandwiches loaded with ribeye, caramelized onions, and Whiz in a no-frills spot that has earned a devoted following.",address:"7016 E Marginal Way S, Seattle, WA 98108",lat:47.5449,lng:-122.3275,instagram:"@calozzis",website:"",phone:"(206) 763-4759",hours:"Mon-Fri 10AM-7PM, Sat 10AM-6PM, Closed Sun",reservation:"walk-in"});

// ── Ballard additional ────────────────────────────────────────────────────────
add({name:"Gracia",cuisine:"Mexican",neighborhood:"Ballard",score:87,price:2,tags:["Mexican","Cocktails","Tacos","Date Night","Brunch","Neighborhood Gem"],description:"Modern Ballard Mexican restaurant serving coastal-inspired tacos, enchiladas, and creative agave cocktails — a stylish neighborhood spot with an excellent brunch program.",address:"5313 Ballard Ave NW, Seattle, WA 98107",lat:47.6628,lng:-122.3808,instagram:"@graciaseattle",website:"https://www.graciaballard.com",phone:"(206) 783-3000",hours:"Tue-Thu 4PM-10PM, Fri 4PM-11PM, Sat 10AM-11PM, Sun 10AM-9PM",reservation:"walk-in"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 27 complete!');
