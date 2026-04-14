// Vegas Batch 11 — Mexican, tacos, BBQ, casual favorites
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

add({name:"Tacos El Gordo",cuisine:"Mexican / Tacos",neighborhood:"The Strip",score:91,price:1,tags:["Mexican","Casual","Late Night","Iconic","Local Favorites"],description:"No-frills Tijuana-style taquería on the Strip — Las Vegas's most beloved street tacos. Adobada spinning on the trompo, carne asada, lengua, and suadero on fresh corn tortillas. Open until 4 AM weekends — the post-club ritual.",dishes:["Adobada Taco","Carne Asada","Lengua"],address:"3041 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1317,lng:-115.1615,instagram:"tacoselgordolv",website:"https://tacoselgordobc.com",reservation:"walk-in",phone:"(702) 331-1160",hours:"Mon-Thu 10AM-2AM, Fri-Sat 10AM-4AM, Sun 10AM-2AM"});

add({name:"Tacotarian",cuisine:"Vegan Mexican",neighborhood:"Arts District",score:88,price:2,tags:["Mexican","Vegetarian","Casual","Local Favorites","Critics Pick"],description:"First vegan Mexican restaurant in the Arts District. Jackfruit tacos, vegan al pastor, and the famous 14-inch mega taco. Plant-based Mexican done so well carnivores keep coming back.",dishes:["Jackfruit Tacos","Vegan Al Pastor","Mega Taco"],address:"1130 S Casino Center Blvd Ste 170, Las Vegas, NV 89104",lat:36.1594,lng:-115.1525,instagram:"tacotarian",website:"https://eattacotarian.com",reservation:"walk-in",phone:"(725) 251-3853"});

add({name:"Casa Don Juan",cuisine:"Mexican",neighborhood:"Arts District (Main Street)",score:88,price:2,tags:["Mexican","Casual","Local Favorites","Iconic"],description:"Family-owned Main Street Mexican staple — authentic traditional recipes passed down through generations. Every dish prepared from scratch daily. A Downtown Las Vegas institution with multiple valley locations.",dishes:["Enchiladas","Chile Verde","Margaritas"],address:"1204 S Main St, Las Vegas, NV 89104",lat:36.1580,lng:-115.1525,instagram:"casadonjuanlv",website:"https://casadonjuanmain.com",reservation:"OpenTable",phone:"(702) 384-8070"});

add({name:"Lindo Michoacán",cuisine:"Mexican",neighborhood:"East Las Vegas",score:89,price:2,tags:["Mexican","Casual","Local Favorites","Iconic"],description:"Las Vegas family-owned Mexican institution since 1990. Four Vegas valley locations anchored by the original on Desert Inn. Authentic Michoacán-style regional Mexican with hand-made tortillas, moles, and celebratory table-side service.",dishes:["Carnitas","Mole Rojo","Chiles en Nogada"],address:"2655 E Desert Inn Rd, Las Vegas, NV 89121",lat:36.1300,lng:-115.1111,instagram:"lindomichoacanlv",website:"https://lindomichoacan.com",reservation:"OpenTable",phone:"(702) 735-6828",group:"Lindo Michoacán"});

add({name:"John Mull's Meats & Road Kill Grill",cuisine:"BBQ / Meat Market",neighborhood:"North Las Vegas",score:90,price:2,tags:["BBQ","Casual","Iconic","Local Favorites","Critics Pick"],description:"Iconic North Las Vegas BBQ joint + full butcher shop. Featured on Diners, Drive-Ins & Dives. Pulled pork, brisket, ribs, and 'road kill' cheeseburgers cooked on a massive wood smoker. Family-owned since 1956.",dishes:["Brisket","Pulled Pork","Road Kill Cheeseburger"],address:"3730 Thom Blvd, Las Vegas, NV 89130",lat:36.2254,lng:-115.2145,instagram:"johnmullsmeats",website:"https://johnmullsmeatcompany.com",reservation:"walk-in",phone:"(702) 645-1200",hours:"Mon-Sat 11AM-6PM, Closed Sun"});

add({name:"Rollin Smoke Barbeque",cuisine:"BBQ",neighborhood:"Paradise",score:87,price:2,tags:["BBQ","Casual","Late Night","Local Favorites"],description:"Original Vegas BBQ mini-chain on Highland Drive near the Strip, now with five locations including T-Mobile Arena and Allegiant Stadium. Smoky brisket, baby-back ribs, and Southern-style sides. Stadium-game favorite.",dishes:["Brisket","Baby Back Ribs","Pulled Pork"],address:"3185 S Highland Dr Ste 2, Las Vegas, NV 89109",lat:36.1323,lng:-115.1865,instagram:"rollinsmokebbq",website:"https://www.rollinsmokebarbeque.com",reservation:"walk-in",phone:"(702) 836-3621"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 11 complete!');
