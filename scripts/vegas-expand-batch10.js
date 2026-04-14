// Vegas Batch 10 — Brunch, bakeries, coffee
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

add({name:"PublicUs",cuisine:"Coffee / Bakery / Brunch",neighborhood:"Downtown (Fremont East)",score:91,price:2,tags:["Bakery/Coffee","Brunch","Casual","Local Favorites","Critics Pick"],description:"Award-winning specialty coffee bar, artisan bakery, and breakfast & lunch restaurant in Fremont East. House-made sourdough, seasonal pastries, and a strong vegan-friendly menu. One of the best café-style brunch rooms in Vegas.",dishes:["Sourdough","Breakfast Sandwich","Pour-Over Coffee"],address:"1126 Fremont St, Las Vegas, NV 89101",lat:36.1689,lng:-115.1353,instagram:"publicuslv",website:"http://www.publicuslv.com",reservation:"walk-in",phone:"(702) 331-5500",hours:"Daily 7AM-3PM"});

add({name:"Eggslut",cuisine:"Breakfast / Sandwiches",neighborhood:"The Strip (The Cosmopolitan)",score:88,price:2,tags:["Brunch","Casual","Local Favorites","Iconic"],description:"LA-born Eggslut's Cosmopolitan outpost. The legendary 'Slut' — coddled egg over potato purée in a jar — plus famous Fairfax and Bacon-Egg-Cheese sandwiches on homemade brioche. Long morning lines are part of the experience.",dishes:["The Slut","Fairfax","Bacon Egg Cheese"],address:"3708 S Las Vegas Blvd Level 2, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"eggslutlv",website:"https://www.eggslut.com",reservation:"walk-in",phone:"(702) 698-2344",hours:"Mon-Thu 7AM-2PM, Fri-Sun 7AM-3PM"});

add({name:"Sunrise Coffee",cuisine:"Coffee / Vegan",neighborhood:"Paradise",score:89,price:2,tags:["Bakery/Coffee","Vegetarian","Local Favorites","Casual"],description:"Las Vegas' longest-running independent coffee shop. Organic fair-trade coffee roasted on-site, vegan & vegetarian food made from scratch, and an unmistakable local feel. Powered by Mothership Coffee Roasters.",dishes:["Organic Espresso","Vegan Pastries","Pour-Over"],address:"3130 E Sunset Rd Ste A, Las Vegas, NV 89120",lat:36.0715,lng:-115.1184,instagram:"sunrisecoffeelv",website:"http://www.sunrisecoffeelv.com",reservation:"walk-in",phone:"(702) 433-3304",hours:"Daily 6AM-6PM"});

add({name:"Vesta Coffee Roasters",cuisine:"Coffee / Roastery",neighborhood:"Arts District",score:90,price:2,tags:["Bakery/Coffee","Local Favorites","Critics Pick","Casual"],description:"Specialty coffee roastery in the Arts District with on-site roasting visible from the café floor. Single-origin espresso, seasonal pour-over menu, and multiple expanded Vegas valley locations. One of Vegas's best coffee programs.",dishes:["Single-Origin Espresso","Seasonal Pour-Over","House Roasts"],address:"1114 S Casino Center Blvd, Las Vegas, NV 89104",lat:36.1594,lng:-115.1522,instagram:"vestacoffee",website:"https://vestacoffee.com",reservation:"walk-in",phone:"(702) 685-1777",hours:"Daily 7AM-4PM"});

add({name:"Gäbi Coffee & Bakery",cuisine:"Korean Café / Bakery",neighborhood:"Chinatown",score:89,price:2,tags:["Bakery/Coffee","Date Night","Critics Pick","Casual","Iconic"],description:"Magical hidden 1920s-Korea-inspired Chinatown café. Antique door entrance, vintage Korean décor, and one of the most Instagram-worthy cafés in Vegas. Signature bingsu, Korean pastries, and specialty coffee until 10 PM.",dishes:["Bingsu","Korean Pastries","Specialty Lattes"],address:"5808 Spring Mountain Rd Ste 104, Las Vegas, NV 89146",lat:36.1262,lng:-115.2197,instagram:"gabicoffeebakery",website:"https://www.gabicafe.com",reservation:"walk-in",phone:"(702) 331-1144",hours:"Daily 8AM-10PM"});

add({name:"The Original Sunrise Cafe",cuisine:"Breakfast / Bagels",neighborhood:"Paradise",score:87,price:2,tags:["Brunch","Casual","Local Favorites"],description:"South Las Vegas bagel and breakfast specialist. Handmade bagels, classic American breakfast plates, and a devoted local following. No reservations — weekend waits of an hour+ are normal.",dishes:["Handmade Bagels","Breakfast Classics","Benedict"],address:"8975 S Eastern Ave Ste 6, Las Vegas, NV 89123",lat:36.0263,lng:-115.1192,instagram:"originalsunrisecafe",website:"https://www.originalsunrisecafe.com",reservation:"walk-in",phone:"(702) 257-8877",hours:"Mon-Fri 7:30AM-2PM, Sat-Sun 7:30AM-2:30PM"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 10 complete!');
