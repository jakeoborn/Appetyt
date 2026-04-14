// Seattle Batch 11 — Final push to 150
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

add({name:"Nue",cuisine:"Global Street Food",neighborhood:"Capitol Hill",score:88,price:2,tags:["Global","Date Night","Local Favorites","Critics Pick"],description:"Capitol Hill's bold global street food since 2015. Authentic, hard-to-find dishes from around the world — Georgian khachapuri, shakshuka, and ever-rotating international plates. Celebrating 10+ years of experimentation.",dishes:["Khachapuri","Shakshuka","Global Tapas"],address:"1519 14th Ave, Seattle, WA 98122",lat:47.6144,lng:-122.3141,instagram:"nueseattle",website:"https://www.nueseattle.com",reservation:"OpenTable",phone:"(206) 257-0312"});

add({name:"Tomo",cuisine:"Japanese / New American",neighborhood:"White Center",score:93,price:3,tags:["Japanese","New American","Date Night","Critics Pick","Tasting Menu"],description:"White Center restaurant from former Canlis chef Brady Ishiwata Williams. Japanese-influenced à la carte — sweet potato with buckwheat honey, chawanmushi, cacio e pepe rice cakes, dry-aged steam burgers. 2022 James Beard semifinalist.",dishes:["Chawanmushi","Dry-Aged Steam Burger","Japanese-ish Plates"],address:"9811 16th Ave SW, Seattle, WA 98106",lat:47.5193,lng:-122.3513,instagram:"tomoseattle",website:"https://tomoseattle.com",reservation:"Resy",phone:"",awards:"James Beard Semifinalist 2022"});

add({name:"Off Alley",cuisine:"New American / Wine Bar",neighborhood:"Columbia City",score:93,price:3,tags:["New American","Wine Bar","Date Night","Critics Pick"],description:"Tiny 12-seat slender restaurant tucked between Columbia City buildings. Chef Evan Leichtling's daily chalkboard menu celebrates underappreciated organs and tiny fish. Hyper-seasonal, natural wines, zero pretense.",dishes:["Daily Chalkboard Menu","Offal","Natural Wines"],address:"4903 1/2 Rainier Ave S, Seattle, WA 98118",lat:47.5594,lng:-122.2818,instagram:"offalleyseattle",website:"https://www.offalleyseattle.com",reservation:"Resy",phone:"(206) 488-6170"});

add({name:"Cafe Munir",cuisine:"Lebanese / Mediterranean",neighborhood:"Ballard",score:89,price:2,tags:["Middle Eastern","Date Night","Local Favorites","Critics Pick"],description:"Loyal Heights Lebanese restaurant from Chef Rajah Gargour. Traditional mezze, flavorful stews, and authentic Arabic hospitality. A beloved intimate neighborhood spot.",dishes:["Mezze","Kibbeh","Arak"],address:"2408 NW 80th St, Seattle, WA 98117",lat:47.6851,lng:-122.3859,instagram:"cafemunirseattle",website:"",reservation:"walk-in",phone:"(206) 472-4150"});

add({name:"Poquitos",cuisine:"Mexican",neighborhood:"Capitol Hill",score:87,price:2,tags:["Mexican","Date Night","Local Favorites","Casual"],description:"Capitol Hill Mexican cantina on Pike with tequila- and mezcal-focused bar. Regional Mexican dishes, fresh guacamole, and one of the best happy hours on the hill. Large patio.",dishes:["Regional Mexican","Tequila Flight","Patio Margaritas"],address:"1000 E Pike St, Seattle, WA 98122",lat:47.6143,lng:-122.3195,instagram:"vivapoquitos",website:"https://www.vivapoquitos.com",reservation:"OpenTable",phone:"(206) 590-5039"});

add({name:"Sushi Kappo Tamura",cuisine:"Japanese / Sushi",neighborhood:"Eastlake",score:91,price:3,tags:["Japanese","Sushi","Date Night","Local Favorites","Critics Pick"],description:"Eastlake sushi temple opened 2010 by Taichi Kitamura and Steve Tamura. Local and seasonal Pacific Northwest ingredients in authentic Japanese style. Sustainable sourcing, impeccable omakase.",dishes:["Omakase","Local Seasonal Sushi","PNW Ingredients"],address:"2968 Eastlake Ave E, Seattle, WA 98102",lat:47.6486,lng:-122.3233,instagram:"sushikappotamura",website:"https://www.sushikappotamura.com",reservation:"OpenTable",phone:"(206) 547-0937"});

add({name:"Fogón Cocina Mexicana",cuisine:"Mexican",neighborhood:"Capitol Hill",score:87,price:2,tags:["Mexican","Late Night","Local Favorites","Casual"],description:"Capitol Hill Mexican kitchen on Pine featuring regional Mexican cuisine, house-made salsas, and a deep tequila/mezcal list. Warm, colorful space perfect for late-night eats.",dishes:["Enchiladas","Regional Mexican","Margaritas"],address:"600 E Pine St, Seattle, WA 98122",lat:47.6152,lng:-122.3208,instagram:"fogonseattle",website:"https://www.fogonseattle.com",reservation:"OpenTable",phone:"(206) 320-7777",hours:"Mon-Wed 11AM-10PM, Thu 11AM-11PM, Fri-Sat 11AM-12AM, Sun 11AM-10PM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 11 complete!');
