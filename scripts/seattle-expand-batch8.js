// Seattle Batch 8 — Fine Dining, Steakhouses, Italian, Filipino, Malaysian
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

add({name:"Canlis",cuisine:"Pacific Northwest / Fine Dining",neighborhood:"Queen Anne",score:96,price:4,tags:["Fine Dining","New American","Date Night","Celebrations","Iconic","Critics Pick","Scenic"],description:"Seattle's family-owned fine dining landmark since 1950. Sweeping views of Lake Union, formal service, and one of the world's most celebrated wine cellars. Tasting menu with 28-day grass-fed Black Angus from Gleason Ranch.",dishes:["Tasting Menu","Peter Canlis Prawns","Wagyu"],address:"2576 Aurora Ave N, Seattle, WA 98109",lat:47.6462,lng:-122.3471,instagram:"canlisrestaurant",website:"https://canlis.com",reservation:"Tock",phone:"(206) 283-3313",awards:"Wine Spectator Grand Award"});

add({name:"Metropolitan Grill",cuisine:"Steakhouse",neighborhood:"Downtown",score:91,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Iconic"],description:"Seattle landmark steakhouse in the historic Marion Building since 1983. USDA Prime cuts to exclusive Japanese A-5 Wagyu, expertly prepared with unmatched hospitality. Award-winning wine list.",dishes:["USDA Prime Steak","A-5 Wagyu","Classic Cocktails"],address:"820 2nd Ave, Seattle, WA 98104",lat:47.6028,lng:-122.3329,instagram:"metgrill",website:"https://www.themetropolitangrill.com",reservation:"OpenTable",phone:"(206) 624-3287"});

add({name:"El Gaucho Seattle",cuisine:"Steakhouse",neighborhood:"Belltown",score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Iconic","Late Night"],description:"Belltown Union Stables landmark steakhouse. 28-day dry-aged Niman Ranch Prime Certified Angus Beef on charcoal grill in open exhibition kitchen. Dim lighting, flaming skewers, celebrity sightings.",dishes:["Dry-Aged Ribeye","Bananas Foster","Charcoal-Grilled Steak"],address:"2200 Western Ave, Seattle, WA 98121",lat:47.6134,lng:-122.3474,instagram:"elgauchosteakhouse",website:"https://elgaucho.com/seattle",reservation:"OpenTable",phone:"(206) 728-1337",hours:"Tue-Sat 4PM-10PM",group:"El Gaucho"});

add({name:"Cascina Spinasse",cuisine:"Italian / Piedmontese",neighborhood:"Capitol Hill",score:94,price:3,tags:["Italian","Date Night","Critics Pick","Local Favorites","Iconic"],description:"Capitol Hill Piedmontese trattoria since 2008 with communal seating and handmade pasta. Seattle's most celebrated single dish: hand-rolled tajarin with butter and sage. Wine list focused on Barolo and Barbaresco.",dishes:["Tajarin with Butter & Sage","Handmade Pasta","Piedmontese Classics"],address:"1531 14th Ave, Seattle, WA 98122",lat:47.6145,lng:-122.3139,instagram:"spinasseseattle",website:"https://spinasse.com",reservation:"OpenTable",phone:"(206) 251-7673",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-11PM"});

add({name:"Altura",cuisine:"Italian / Tasting Menu",neighborhood:"Capitol Hill",score:94,price:4,tags:["Italian","Fine Dining","Date Night","Critics Pick","Celebrations","Tasting Menu"],description:"Chef Nathan Lockwood's Italian-focused tasting menu on Broadway. Weekly-changing menu celebrating hyper-seasonal Pacific Northwest products with specialty Italian ingredients. All guests seated at once for a shared meal.",dishes:["Multi-Course Tasting","Seasonal Pasta","Italian Fine Dining"],address:"617 Broadway E, Seattle, WA 98102",lat:47.6233,lng:-122.3209,instagram:"alturarestaurant",website:"https://alturarestaurant.com",reservation:"Tock",phone:"(206) 402-6749",hours:"Tue-Thu 6PM-10PM, Fri-Sat 5PM-11PM, Sun 5PM-8PM"});

add({name:"Musang",cuisine:"Filipino",neighborhood:"Beacon Hill",score:92,price:3,tags:["Filipino","Date Night","Critics Pick","Local Favorites","Iconic"],description:"Beacon Hill Filipino restaurant from Chef Melissa Miranda (Food & Wine Best New Chef 2022, James Beard nominee 2021). Intimate dishes inspired by her childhood — squid ink pancit, pinakbet, short rib kare-kare. Seattle Met Restaurant of the Year 2020.",dishes:["Squid Ink Pancit","Short Rib Kare-Kare","Pinakbet"],address:"2524 Beacon Ave S, Seattle, WA 98144",lat:47.5838,lng:-122.3117,instagram:"musangseattle",website:"https://www.musangseattle.com",reservation:"Resy",phone:"(206) 708-6871",awards:"Seattle Met Restaurant of the Year 2020"});

add({name:"Kedai Makan",cuisine:"Malaysian",neighborhood:"Capitol Hill",score:89,price:2,tags:["Malaysian","Local Favorites","Critics Pick","Casual"],description:"Capitol Hill Malaysian restaurant and bar inspired by Malaysian street food. Rich curries, roti canai, nasi lemak, and char kway teow — some of the most exciting Southeast Asian food in Seattle.",dishes:["Nasi Lemak","Char Kway Teow","Roti Canai"],address:"1449 E Pine St, Seattle, WA 98122",lat:47.6153,lng:-122.3160,instagram:"kedaimakan",website:"https://www.kedaimakansea.com",reservation:"walk-in",phone:"(206) 735-3675"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 8 complete!');
