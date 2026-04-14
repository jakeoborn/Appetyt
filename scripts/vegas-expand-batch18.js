// Vegas Batch 18 — Final 7 to hit 150
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

add({name:"El Segundo Sol",cuisine:"Mexican",neighborhood:"The Strip (Fashion Show Mall)",score:86,price:2,tags:["Mexican","Scenic","Local Favorites","Casual"],description:"Tulum-inspired coastal Mexican at Fashion Show Mall across from Wynn. 100+ specialty tequilas, signature margaritas, and year-round al-fresco patio. Reliable Strip-side Mexican with Strip views.",dishes:["Coastal Mexican","Tequila Flights","Margaritas"],address:"3200 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1316,lng:-115.1698,instagram:"elsegundosol",website:"https://www.elsegundosol.com",reservation:"OpenTable",phone:"(702) 258-1211",hours:"Daily 11AM-10PM"});

add({name:"Hofbräuhaus Las Vegas",cuisine:"German",neighborhood:"University/Hard Rock Area",score:86,price:2,tags:["Casual","Late Night","Live Music","Local Favorites","Iconic"],description:"Authentic Bavarian beer hall on Paradise Road — an officially-licensed Hofbräuhaus München replica since 2004. German beer on tap, pretzels, schnitzel, and daily live entertainment with traditional Bavarian oompah bands.",dishes:["Schnitzel","Bratwurst","Oktoberfest Lager"],address:"4510 Paradise Rd, Las Vegas, NV 89169",lat:36.1074,lng:-115.1521,instagram:"hofbrauhauslv",website:"https://www.hofbrauhauslasvegas.com",reservation:"OpenTable",phone:"(702) 853-2337",hours:"Sun-Thu 11AM-10PM, Fri-Sat 11AM-11PM"});

add({name:"Ferraro's Ristorante",cuisine:"Italian",neighborhood:"Paradise",score:90,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick","Iconic"],description:"Family-owned Paradise Road Italian institution since 1985. Traditional Italian cuisine — fresh pasta, pizza, seafood, and steaks. 15,000-bottle wine cellar. A 40-year Vegas off-Strip Italian benchmark.",dishes:["Fresh Pasta","Osso Buco","Tiramisu"],address:"4480 Paradise Rd, Las Vegas, NV 89169",lat:36.1074,lng:-115.1524,instagram:"ferrarosvegas",website:"https://www.ferraroslasvegas.com",reservation:"OpenTable",phone:"(702) 364-5300",hours:"Mon-Fri 11:30AM-3:30PM, Daily 4PM-10:30PM"});

add({name:"Piero's Italian Cuisine",cuisine:"Italian / Seafood",neighborhood:"Convention Center",score:89,price:4,tags:["Italian","Seafood","Fine Dining","Date Night","Celebrations","Iconic"],description:"Old-school Italian-Vegas institution near the Convention Center — family-owned since 1982. Classic Italian and seafood in an elegant 1980s-inspired setting. A perennial favorite for Las Vegas power dining.",dishes:["Veal Milanese","Osso Buco","Seafood"],address:"355 Convention Center Dr, Las Vegas, NV 89109",lat:36.1311,lng:-115.1610,instagram:"pieroslv",website:"https://pieroscuisine.com",reservation:"OpenTable",phone:"(702) 369-2305",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-11PM"});

add({name:"Battista's Hole in the Wall",cuisine:"Italian",neighborhood:"Linq Lane (Near Strip)",score:88,price:3,tags:["Italian","Date Night","Iconic","Local Favorites"],description:"A Vegas institution since 1970 — the original Italian 'hole in the wall' with unlimited house wine and a celebrity-signed-photo-lined dining room. Classic red-sauce Italian, strolling accordion player, and lasting Rat Pack-era charm.",dishes:["Spaghetti & Meatballs","Veal Parmigiana","Unlimited House Wine"],address:"4041 Linq Lane, Las Vegas, NV 89109",lat:36.1150,lng:-115.1721,instagram:"battistaslv",website:"https://battistaslasvegas.com",reservation:"OpenTable",phone:"(702) 732-1424",hours:"Sun-Thu 4:30PM-9:30PM, Fri-Sat 4:30PM-10PM"});

add({name:"Peppermill Restaurant & Fireside Lounge",cuisine:"Diner / American",neighborhood:"The Strip",score:85,price:2,tags:["Casual","Late Night","Iconic","Brunch","Cocktails"],description:"Legendary Las Vegas Strip diner since 1972 — between Wynn and Resorts World. Retro booths, enormous portions, 24-hour breakfast, and the legendary sunken fire-pit Fireside Lounge with huge fruity cocktails.",dishes:["Fruit Pancakes","Scorpion Cocktail","24-Hour Breakfast"],address:"2985 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1325,lng:-115.1629,instagram:"peppermilllv",website:"https://peppermilllasvegas.com",reservation:"walk-in",phone:"(702) 735-4177",hours:"Open 24/7"});

add({name:"Pinkbox Doughnuts",cuisine:"Bakery / Donuts",neighborhood:"Downtown",score:87,price:1,tags:["Bakery/Coffee","Casual","Local Favorites","Iconic"],description:"Iconic pink-boxed Vegas doughnut brand — downtown location inside the Plaza Hotel & Casino. Creative flavors, character doughnuts, and vegan options. A Vegas local favorite across 12+ valley locations.",dishes:["Specialty Doughnuts","Character Donuts","Vegan Options"],address:"1 S Main St, Las Vegas, NV 89101",lat:36.1706,lng:-115.1452,instagram:"pinkboxdoughnuts",website:"https://pinkboxdoughnuts.com",reservation:"walk-in",phone:"",group:"Pinkbox"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 18 complete!');
