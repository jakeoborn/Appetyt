// Vegas Batch 21 — Nightlife continued: speakeasies, supper clubs, cocktail lounges
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

add({name:"The Underground at The Mob Museum",cuisine:"Speakeasy / Distillery",neighborhood:"Downtown",score:91,price:2,tags:["Cocktails","Late Night","Iconic","Critics Pick","Casual"],description:"Underground Prohibition-era speakeasy and working distillery in the basement of The Mob Museum. Immersive history exhibit by day, cocktail bar by night. Distilled moonshine on-site. A Downtown Vegas essential.",dishes:["Prohibition Cocktails","House Moonshine","Speakeasy Menu"],address:"300 Stewart Ave, Las Vegas, NV 89101",lat:36.1726,lng:-115.1413,instagram:"themobmuseum",website:"https://themobmuseum.org/underground",reservation:"walk-in",phone:"(702) 229-2734",hours:"Sun-Thu 11AM-11PM, Fri-Sat 11AM-12AM"});

add({name:"The Mayfair Supper Club",cuisine:"Supper Club / New American",neighborhood:"The Strip (Bellagio)",score:92,price:4,tags:["New American","Supper Club","Date Night","Celebrations","Iconic","Live Music","Scenic"],description:"Bellagio's glamorous supper club overlooking the Fountains. Live musical performances every 15 minutes, choreographed with the fountain show. Multi-course dining, dancing, and entertainment all in one — a reimagined Vegas supper-club experience.",dishes:["Seafood Tower","Prime Steaks","Live Entertainment"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1129,lng:-115.1769,instagram:"themayfairlv",website:"https://themayfairlv.com",reservation:"SevenRooms",phone:"(702) 693-8876"});

add({name:"Skyfall Lounge",cuisine:"Cocktail Lounge",neighborhood:"The Strip (Delano at Mandalay Bay)",score:89,price:3,tags:["Cocktails","Date Night","Scenic","Late Night","Celebrations"],description:"64th-floor panoramic cocktail lounge atop Delano Las Vegas. Floor-to-ceiling windows with Strip and Luxor light-beam views, open-air terrace balcony, and live DJ programming. One of the Strip's top rooftop cocktail experiences.",dishes:["Panoramic Strip Views","Signature Cocktails","Small Plates"],address:"3940 S Las Vegas Blvd Fl 64, Las Vegas, NV 89119",lat:36.0925,lng:-115.1760,instagram:"skyfallvegas",website:"https://delanolasvegas.mgmresorts.com",reservation:"SevenRooms",phone:"(877) 632-5400",hours:"Sun-Thu 5PM-12AM, Fri-Sat 5PM-1AM"});

add({name:"Commonwealth",cuisine:"Cocktail Bar / Dance Bar",neighborhood:"Downtown (Fremont East)",score:89,price:2,tags:["Cocktails","Late Night","Local Favorites","Iconic","Casual"],description:"Downtown Fremont East's swanky two-story cocktail bar since 2012 — rooftop dance floor overlooking the Fremont Street Experience neon canopy. Home to The Laundry Room speakeasy (hidden entrance inside). Anchors the Downtown Las Vegas nightlife district.",dishes:["Craft Cocktails","Rooftop Dance Floor","Speakeasy Access"],address:"525 E Fremont St, Las Vegas, NV 89101",lat:36.1688,lng:-115.1411,instagram:"commonwealthlv",website:"https://www.commonwealthlv.com",reservation:"walk-in",phone:"(702) 445-6400",group:"Corner Bar Management"});

add({name:"The Sand Dollar Lounge",cuisine:"Live Music / Lounge",neighborhood:"Chinatown",score:89,price:1,tags:["Live Music","Cocktails","Late Night","Local Favorites","Casual"],description:"Spring Mountain Road live-music institution with FREE live music nightly 10 PM-2 AM. Blues, funk, rock, and jazz. Cocktails, pizza, gaming. Open 4 PM-4 AM daily. Quintessential locals' lounge.",dishes:["Live Music Nightly","Pizza","Classic Cocktails"],address:"3355 Spring Mountain Rd Ste 30, Las Vegas, NV 89102",lat:36.1257,lng:-115.1851,instagram:"thesanddollarlv",website:"https://thesanddollarlv.com",reservation:"walk-in",phone:"(702) 485-5401",hours:"Daily 4PM-4AM"});

add({name:"Mama Rabbit Mezcal + Tequila Bar",cuisine:"Mezcal / Tequila Bar",neighborhood:"The Strip (Park MGM)",score:89,price:3,tags:["Cocktails","Date Night","Live Music","Critics Pick","Late Night"],description:"Mezcalera Bricia Lopez's curated agave bar at Park MGM — America's largest collection of mezcals and tequilas. 4,400 sq ft with double-sided bar, roaming margarita carts, live entertainment, and Mexican small bites.",dishes:["Agave Spirits Selection","Mezcal Flights","Margarita Carts"],address:"3770 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1057,lng:-115.1758,instagram:"drinkmamarabbit",website:"https://drinkmamarabbitlv.com",reservation:"walk-in",phone:"(702) 730-7777"});

add({name:"Juniper Cocktail Lounge",cuisine:"Cocktail Lounge",neighborhood:"The Strip (Park MGM)",score:88,price:3,tags:["Cocktails","Date Night","Late Night","Critics Pick"],description:"Park MGM cocktail lounge with a gin-forward program — 150+ gins featured. Sunken 'conversation pit' seating, plush velvet, and serious craft cocktail menu. Elegant evening alternative to the casino noise.",dishes:["Gin-Forward Cocktails","150+ Gins","Elevated Bar Snacks"],address:"3770 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1057,lng:-115.1758,instagram:"junipercocktaillounge",website:"https://junipercocktaillv.com",reservation:"SevenRooms",phone:"(702) 730-7777",hours:"Thu,Sun 6PM-12AM, Fri-Sat 6PM-2AM, Closed Mon-Wed"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 21 complete!');
