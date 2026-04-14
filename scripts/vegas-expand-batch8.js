// Vegas Batch 8 — Henderson / Green Valley / Lake Las Vegas
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

add({name:"Hank's Fine Steaks & Martinis",cuisine:"Steakhouse",neighborhood:"Henderson (Green Valley Ranch)",score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Local Favorites"],description:"Green Valley Ranch's fine-dining steakhouse with a classy piano bar. USDA Prime cuts, an extensive martini program, and half-price martinis at happy hour. A Henderson local benchmark for special occasions.",dishes:["Prime Steaks","Martinis","Piano Bar"],address:"2300 Paseo Verde Pkwy, Henderson, NV 89052",lat:36.0399,lng:-115.0577,instagram:"hankslv",website:"https://greenvalleyranch.com/eat-and-drink/hanks",reservation:"OpenTable",phone:"(702) 617-7515",suburb:true,hours:"Daily 5PM-11PM"});

add({name:"Bottiglia Cucina & Enoteca",cuisine:"Italian",neighborhood:"Henderson (Green Valley Ranch)",score:89,price:3,tags:["Italian","Date Night","Brunch","Local Favorites"],description:"Tuscan-inspired sophisticated rustic Italian at Green Valley Ranch. Robust wine list spanning Napa, Sonoma, Italy, and France. Weekend brunch is a Henderson destination.",dishes:["Handmade Pasta","Wood-Fired Italian","Weekend Brunch"],address:"2300 Paseo Verde Pkwy, Henderson, NV 89052",lat:36.0399,lng:-115.0577,instagram:"bottiglialv",website:"https://www.bottiglialv.com",reservation:"OpenTable",phone:"(702) 617-7191",suburb:true,hours:"Mon-Thu 4PM-9PM, Fri 4PM-10PM, Sat 10AM-10PM, Sun 10AM-9PM"});

add({name:"King's Fish House",cuisine:"Seafood",neighborhood:"Henderson (The District)",score:88,price:3,tags:["Seafood","Date Night","Local Favorites","Critics Pick"],description:"Henderson's seafood destination at The District at Green Valley Ranch since 2004. Live oyster bar, daily-changing catch list, sushi, lobster, and crab. A reliable Henderson local for off-Strip seafood.",dishes:["Live Oysters","Daily Catch","Lobster"],address:"2255 Village Walk Dr Ste 139, Henderson, NV 89052",lat:36.0427,lng:-115.0570,instagram:"kingsfishhouse",website:"https://www.kingsfishhouse.com/henderson",reservation:"OpenTable",phone:"(702) 835-8900",suburb:true,hours:"Mon,Sun 11AM-9PM, Tue-Sat 11AM-10PM"});

add({name:"Lucille's Smokehouse Bar-B-Que",cuisine:"BBQ / Southern",neighborhood:"Henderson (The District)",score:86,price:2,tags:["BBQ","Southern","Casual","Local Favorites","Brunch"],description:"Southern-style BBQ at The District at Green Valley Ranch. Slow-smoked ribs, brisket, pulled pork, and BBQ-style Sunday brunch. Generous portions — a consistent Henderson family favorite.",dishes:["Baby Back Ribs","Brisket","BBQ Brunch"],address:"2245 Village Walk Dr, Henderson, NV 89052",lat:36.0427,lng:-115.0570,instagram:"lucillesbbq",website:"https://lucillesbbq.com/locations/henderson",reservation:"walk-in",phone:"(702) 257-7427",suburb:true,hours:"Sun-Thu 11AM-10PM, Fri-Sat 11AM-11PM"});

add({name:"Todd's Unique Dining",cuisine:"New American / Seafood",neighborhood:"Henderson",score:91,price:3,tags:["New American","Seafood","Date Night","Critics Pick","Local Favorites"],description:"Chef Todd Clore's off-Strip Henderson destination — a Vegas valley favorite for 20+ years. Globally-inspired menu, sushi-grade seafood, and an intensely loyal local following. One of the highest-rated off-Strip restaurants in Vegas.",dishes:["Fresh Seafood","Seasonal Sushi","Creative Small Plates"],address:"4350 E Sunset Rd Ste 102, Henderson, NV 89014",lat:36.0639,lng:-115.0430,instagram:"todds_unique_dining",website:"https://toddsunique.com",reservation:"OpenTable",phone:"(702) 259-8633",suburb:true});

add({name:"Marssa Steak & Sushi",cuisine:"Steakhouse / Sushi",neighborhood:"Henderson (Lake Las Vegas)",score:89,price:4,tags:["Steakhouse","Sushi","Fine Dining","Date Night","Scenic","Celebrations"],description:"AAA Four-Diamond steak & sushi at The Westin Lake Las Vegas. Aged wagyu steaks, sushi program, and one of the most scenic water-view rooms in the Vegas valley. Great for anniversaries and romantic dinners.",dishes:["Wagyu","Sushi Bar","Aged Steaks"],address:"101 Montelago Blvd, Henderson, NV 89011",lat:36.1125,lng:-114.9419,instagram:"marssa.steak.sushi",website:"https://www.marssa-steak-and-sushi.com",reservation:"OpenTable",phone:"(702) 567-6125",suburb:true,hours:"Tue-Sat 5PM-9:30PM, Closed Mon-Sun",awards:"AAA Four Diamond"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 8 complete!');
