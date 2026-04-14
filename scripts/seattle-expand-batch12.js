// Seattle Batch 12 — Final 4 to hit 150
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

add({name:"Sushi by Scratch Restaurants",cuisine:"Japanese / Omakase",neighborhood:"Belltown",score:93,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Tasting Menu","Critics Pick","Celebrations"],description:"Intimate 10-seat omakase experience from Chef Phillip Frankland Lee. 17-course sushi tasting built on house-made soy sauces, sake, and hyper-seasonal fish. Hidden in Belltown — booked weeks out.",dishes:["17-Course Omakase","Edomae Nigiri","Seasonal Sake Pairing"],address:"2331 6th Ave, Seattle, WA 98121",lat:47.6162,lng:-122.3405,instagram:"sushibyscratchrestaurants",website:"https://www.sushibyscratchrestaurants.com/seattle",reservation:"Tock",phone:"(253) 237-6761"});

add({name:"Cafe Campagne",cuisine:"French / Bistro",neighborhood:"Pike Place Market",score:89,price:3,tags:["French","Date Night","Local Favorites","Iconic","Brunch"],description:"Classic Parisian cafe in Post Alley at Pike Place Market since 1994. Seattle's foremost classic French restaurant — steak frites, pot de crème, and croque madame. Beloved bistro with regional and national reputation.",dishes:["Steak Frites","Croque Madame","Pot de Crème"],address:"1600 Post Alley, Seattle, WA 98101",lat:47.6096,lng:-122.3414,instagram:"cafecampagneseattle",website:"https://cafecampagne.com",reservation:"OpenTable",phone:"(206) 728-2233",hours:"Mon-Fri 9AM-9PM, Sat 8AM-9PM, Sun 8AM-8PM"});

add({name:"Shiku Sushi",cuisine:"Japanese / Sushi",neighborhood:"Ballard",score:87,price:2,tags:["Japanese","Sushi","Date Night","Local Favorites"],description:"Authentic Japanese sushi and izakaya on Ballard Avenue since 2008. Traditional nigiri, creative rolls, and izakaya small plates. Neighborhood favorite for after-work sushi and sake.",dishes:["Nigiri","Creative Rolls","Izakaya Small Plates"],address:"5310 Ballard Ave NW, Seattle, WA 98107",lat:47.6673,lng:-122.3837,instagram:"shikusushiballard",website:"https://shikusushi.com",reservation:"OpenTable",phone:"(206) 588-2151"});

add({name:"Monsoon",cuisine:"Vietnamese",neighborhood:"Capitol Hill",score:90,price:3,tags:["Vietnamese","Date Night","Local Favorites","Iconic","Critics Pick"],description:"Capitol Hill contemporary Vietnamese cornerstone on 19th Ave E for 25+ years. Co-founders Eric and Sophie Banh's flagship — authentic Vietnamese with a modern twist. Bar, rooftop patio, and elevated regional dishes.",dishes:["Drunken Chicken","Clay Pot Catfish","Bánh Xèo"],address:"615 19th Ave E, Seattle, WA 98112",lat:47.6283,lng:-122.3074,instagram:"monsoonrestaurants",website:"https://www.monsoonrestaurants.com/seattle",reservation:"OpenTable",phone:"(206) 325-2111"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 12 complete!');
