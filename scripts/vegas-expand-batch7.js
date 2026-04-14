// Vegas Batch 7 — Summerlin fine dining & casual
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

add({name:"Echo & Rig Butcher & Steakhouse",cuisine:"Steakhouse / Butcher Shop",neighborhood:"Summerlin (Tivoli Village)",score:92,price:3,tags:["Steakhouse","Date Night","Local Favorites","Critics Pick","Iconic"],description:"Chef Sam Marvin's hybrid Tivoli Village butcher shop and modern steakhouse. Lesser-used cuts butchered in-house, dry-aged on display, and cooked to order. A Vegas local favorite — consistently ranked among the city's best steakhouses.",dishes:["Butcher's Cuts","Dry-Aged Steaks","Charred Carrots"],address:"440 S Rampart Blvd Ste 120, Las Vegas, NV 89145",lat:36.1487,lng:-115.2828,instagram:"echoandrig",website:"https://www.echoandrig.com/lasvegas",reservation:"OpenTable",phone:"(702) 489-3525",hours:"Mon-Thu 11AM-10PM, Fri 11AM-11PM, Sat 10AM-11PM, Sun 10AM-10PM"});

add({name:"Hearthstone Kitchen & Cellar",cuisine:"Rustic American",neighborhood:"Summerlin (Red Rock Resort)",score:89,price:3,tags:["New American","Date Night","Brunch","Local Favorites","Scenic"],description:"Clique Hospitality's rustic American restaurant at Red Rock Resort — reopened in early 2026 after a three-year hiatus. Two wood-burning ovens, elevated comfort food, and a strong local weekend brunch.",dishes:["Wood-Oven Pizza","Wood-Grilled Steaks","Weekend Brunch"],address:"11011 W Charleston Blvd, Las Vegas, NV 89135",lat:36.1582,lng:-115.3363,instagram:"hearthstonelv",website:"https://redrockresort.com/eat-and-drink/hearthstone-kitchen-cellar",reservation:"OpenTable",phone:"(702) 797-7344",hours:"Sun-Thu 4PM-9PM, Fri-Sat 4PM-10PM, Sat-Sun brunch 10AM-3PM"});

add({name:"T-Bones Chophouse",cuisine:"Steakhouse",neighborhood:"Summerlin (Red Rock Resort)",score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Local Favorites"],description:"Red Rock Resort's modern American chophouse — celebrating 18+ years. USDA Prime dry and wet-aged beef, grass-fed bison, premium wagyu, and a notable bone-in ribeye. One of Summerlin's top special-occasion rooms.",dishes:["Bone-In Ribeye","Grass-Fed Bison","Wagyu"],address:"11011 W Charleston Blvd, Las Vegas, NV 89135",lat:36.1582,lng:-115.3363,instagram:"redrockresort",website:"https://redrockresort.com/eat-and-drink/t-bones-chophouse",reservation:"OpenTable",phone:"(702) 797-7595",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-11PM"});

add({name:"Harlo Steakhouse & Bar",cuisine:"Steakhouse / Italian",neighborhood:"Summerlin (Downtown Summerlin)",score:90,price:3,tags:["Steakhouse","Italian","Date Night","Local Favorites","Critics Pick"],description:"Chef Gina Marinelli's elevated steak-and-Italian at Downtown Summerlin. Premium meat cuts alongside handmade pastas and an exceptional happy-hour menu. Warm, clubby room — an off-Strip favorite for Summerlin locals.",dishes:["Handmade Pasta","Prime Steaks","Happy Hour Menu"],address:"1720 Festival Plaza Dr, Las Vegas, NV 89135",lat:36.1910,lng:-115.3378,instagram:"harlosteak",website:"https://www.harlosteak.com/location/harlo",reservation:"OpenTable",phone:"(702) 333-0402",hours:"Sun-Thu 5PM-9PM, Fri-Sat 5PM-10PM"});

add({name:"Marufuku Ramen",cuisine:"Japanese / Ramen",neighborhood:"Summerlin (Downtown Summerlin)",score:88,price:2,tags:["Japanese","Ramen","Casual","Local Favorites"],description:"Authentic Hakata-style ramen — a San Francisco-born brand's second Vegas location. Rich tonkotsu broth made in-house, kushiyaki skewers, and Japanese small plates. Opened Downtown Summerlin in 2026.",dishes:["Hakata Tonkotsu","Kushiyaki","Gyoza"],address:"2010 Festival Plaza Dr, Las Vegas, NV 89135",lat:36.1910,lng:-115.3378,instagram:"marufukuramenlasvegas",website:"https://www.marufukuramen.com/summerlin",reservation:"walk-in",phone:"(725) 204-5711",hours:"Sun-Thu 11AM-9PM, Fri-Sat 11AM-10PM"});

add({name:"La Neta Cocina y Lounge",cuisine:"Modern Mexican",neighborhood:"Summerlin (Downtown Summerlin)",score:89,price:3,tags:["Mexican","Date Night","Cocktails","Critics Pick","Local Favorites"],description:"Upscale modern Mexican at Downtown Summerlin since 2021. Heirloom-corn tortillas, bold flavors, handcrafted cocktails, and a vibrant lounge scene. Elevated take on tacos and Mexican classics.",dishes:["Heirloom Corn Tacos","Handcrafted Cocktails","Tamales"],address:"1770 Festival Plaza Dr Ste 200, Las Vegas, NV 89135",lat:36.1910,lng:-115.3378,instagram:"lanetacocinalv",website:"https://www.lanetacocina.com",reservation:"OpenTable",phone:"(702) 329-9549",hours:"Mon-Thu 3PM-10PM, Fri-Sat 11AM-11PM, Sun 11AM-3PM/5PM-11PM"});

add({name:"Makers & Finders",cuisine:"Latin / Brunch / Coffee",neighborhood:"Summerlin (Downtown Summerlin)",score:88,price:2,tags:["Latin","Brunch","Bakery/Coffee","Local Favorites","Casual"],description:"Specialty coffee bar + Latin brunch from the Makers & Finders team (original in the Arts District). Arepas, Cuban sandwiches, pour-over coffee, and a vibrant café vibe in Downtown Summerlin.",dishes:["Arepas","Cuban Sandwich","Specialty Coffee"],address:"2120 Festival Plaza Dr Unit 140, Las Vegas, NV 89135",lat:36.1910,lng:-115.3378,instagram:"makersandfinders",website:"https://www.makerslv.com",reservation:"walk-in",phone:"(702) 586-8255",hours:"Mon-Sat 8AM-5PM, Sun 9AM-5PM",group:"Makers & Finders"});

add({name:"True Food Kitchen",cuisine:"Health-focused / New American",neighborhood:"Summerlin (Downtown Summerlin)",score:85,price:2,tags:["New American","Vegetarian","Brunch","Casual","Local Favorites"],description:"Dr. Andrew Weil-founded health-focused restaurant chain at Downtown Summerlin. Anti-inflammatory seasonal menu — Mediterranean bowls, wood-fired pizzas, and fresh juices. Go-to for wellness-minded Summerlin diners.",dishes:["Ancient Grains Bowl","Squash Pizza","Fresh Juices"],address:"10970 Rosemary Park Dr Ste 160, Las Vegas, NV 89135",lat:36.1910,lng:-115.3378,instagram:"truefoodkitchen",website:"https://www.truefoodkitchen.com/locations/summerlin",reservation:"OpenTable",phone:"(702) 863-1000",group:"True Food Kitchen"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 7 complete!');
