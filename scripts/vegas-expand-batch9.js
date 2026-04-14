// Vegas Batch 9 — Cocktail bars, speakeasies, wine bars, supper clubs
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

add({name:"Herbs & Rye",cuisine:"Cocktail Bar / Steakhouse",neighborhood:"West of Strip",score:94,price:3,tags:["Cocktails","Steakhouse","Date Night","Late Night","Iconic","Critics Pick","Awards"],description:"Nectaly Mendoza's 2026-open-until-3AM cocktail temple on Sahara. Vintage cocktail recipes organized by era — Prohibition, Tiki, Golden Age, etc. Also a legit steakhouse and Italian kitchen. Multi-award-winning — one of America's best bars.",dishes:["Vintage Cocktails","Prime Steaks","Tuscan Flatbread"],address:"3713 W Sahara Ave, Las Vegas, NV 89102",lat:36.1437,lng:-115.1913,instagram:"herbsandrye",website:"https://www.herbsandrye.com",reservation:"OpenTable",phone:"(702) 982-8036",hours:"Mon-Sat 5PM-3AM"});

add({name:"Delilah",cuisine:"New American / Supper Club",neighborhood:"The Strip (Wynn)",score:93,price:4,tags:["New American","Cocktails","Date Night","Late Night","Iconic","Celebrations"],description:"h.wood Group's modern supper club at Wynn Tower Suites. Art Deco grandeur inspired by 1950s Vegas showrooms — brunch, dinner, live entertainment, and late-night scene all in one. Celebrity-magnet hottest table since opening.",dishes:["Chicken Tenders","Seafood Tower","Bananas Foster"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"delilahlasvegas",website:"https://www.wynnlasvegas.com/dining/fine-dining/delilah",reservation:"OpenTable",phone:"(702) 770-3300",group:"h.wood Group",hours:"Mon-Fri 5:30PM-2AM, Sat-Sun 10:30AM-2AM"});

add({name:"Ghost Donkey",cuisine:"Mexican / Mezcal Bar",neighborhood:"The Strip (The Cosmopolitan)",score:90,price:3,tags:["Cocktails","Mexican","Date Night","Late Night","Critics Pick"],description:"Hidden tequila-and-mezcal bar tucked behind Block 16 food court at the Cosmopolitan — look for the tiny donkey-shaped door. Pink-ceilinged mezcalería with 100+ agave spirits, signature truffle nachos, and pitch-perfect theatrical cocktails.",dishes:["Truffle Nachos","Mezcal Flights","Agave Cocktails"],address:"3708 S Las Vegas Blvd Level 2, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"ghostdonkey",website:"https://www.ghostdonkey.com/las-vegas",reservation:"walk-in",phone:"(702) 698-7000",hours:"Sun-Thu 4PM-12AM, Fri-Sat 4PM-2AM"});

add({name:"Frankie's Tiki Room",cuisine:"Tiki Bar",neighborhood:"Downtown",score:88,price:2,tags:["Cocktails","Late Night","Iconic","Casual"],description:"America's only 24/7 tiki bar on West Charleston. Polynesian vibes, signature tiki mugs for sale (Tiki Bandit, Bearded Clam), and some of the strongest rum drinks in Vegas. A Vegas institution since 2008.",dishes:["Tiki Bandit","Bearded Clam","Rum Flights"],address:"1712 W Charleston Blvd, Las Vegas, NV 89102",lat:36.1591,lng:-115.1647,instagram:"frankiestiki",website:"https://frankiestikiroom.com",reservation:"walk-in",phone:"(702) 385-3110",hours:"Open 24/7"});

add({name:"Oak & Ivy",cuisine:"Cocktail Bar / Whiskey",neighborhood:"Downtown (Container Park)",score:88,price:2,tags:["Cocktails","Local Favorites","Critics Pick","Casual"],description:"American craft whiskey and cocktail bar inside Downtown Container Park on Fremont East. Seasonal menu, house-made mixers and garnishes, and a deep whiskey list. A Downtown Vegas staple.",dishes:["Seasonal Cocktails","Whiskey Flights","House Bitters"],address:"707 Fremont St, Las Vegas, NV 89101",lat:36.1675,lng:-115.1382,instagram:"oakandivylv",website:"https://oakandivy.com",reservation:"walk-in",phone:"(702) 553-2549",hours:"Mon-Thu 3PM-11PM, Fri-Sat 12PM-1AM, Sun 12PM-11PM"});

add({name:"Vanderpump Cocktail Garden",cuisine:"Cocktail Bar / Lounge",neighborhood:"The Strip (Caesars Palace)",score:86,price:3,tags:["Cocktails","Date Night","Iconic","Late Night"],description:"Lisa Vanderpump's pink-drenched lounge at Caesars Palace between The Colosseum and Forum Shops. Instagrammable floral decor, Bravo-star crowd, and a 200+ bottle rosé program. Reality-TV-celebrity scene magnet.",dishes:["Rosé by the Bottle","Pink Cocktails","Caviar Service"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"vanderpumpcocktailgarden",website:"https://www.caesars.com/caesars-palace/things-to-do/nightlife/vanderpump",reservation:"OpenTable",phone:"(702) 731-7867",hours:"Mon-Wed 3PM-12AM, Thu 12PM-12AM, Fri 12PM-1AM, Sat 10AM-1AM, Sun 10AM-12AM"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 9 complete!');
