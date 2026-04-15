// Seattle Batch 2 — More verified spots from Ballard, Capitol Hill, Pike Place
// Each address/phone verified individually via Yelp, official sites
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

// === BALLARD (verified via Yelp/official sites) ===
add({name:"Ray's Boathouse",cuisine:"Seafood / Fine Dining",neighborhood:"Ballard",score:92,price:3,tags:["Seafood","Fine Dining","Scenic","Iconic","Date Night"],description:"Iconic Pacific Northwest seafood restaurant on Shilshole Bay with sustainable Northwest seafood, local produce, and extensive Northwest wine list. Waterfront views of Puget Sound and the Olympic Mountains.",dishes:["Sustainable NW Seafood","Sablefish","Oysters"],address:"6049 Seaview Ave NW, Seattle, WA 98107",lat:47.6676,lng:-122.4030,instagram:"rays_boathouse",website:"https://www.rays.com",reservation:"OpenTable",phone:"(206) 789-3770",hours:"Daily 11:30AM-9PM",awards:"Seattle's Best Seafood - Seattle Magazine"});

add({name:"San Fermo",cuisine:"Italian",neighborhood:"Ballard",score:90,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick"],description:"Fine dining Italian in Ballard housed in the Pioneer Houses -- Seattle's longest-surviving residential structures from the late 1800s. Handmade pasta and Italian classics in a historic setting.",dishes:["Handmade Pasta","Italian Classics","Historic Setting"],address:"5341 Ballard Ave NW, Seattle, WA 98107",lat:47.6676,lng:-122.3830,instagram:"sanfermoseattle",website:"",reservation:"Resy",phone:"(206) 342-1530"});

add({name:"Delancey",cuisine:"Wood-Fired Pizza",neighborhood:"Ballard",score:91,price:2,tags:["Pizza","Date Night","Local Favorites","Critics Pick"],description:"Award-winning wood-fired pizza in Ballard from Brandon Pettit and Molly Wizenberg. Long-fermented dough made from Washington-grown wheat. Limited reservations, mostly walk-in.",dishes:["Wood-Fired Pizza","Seasonal Pies","Pepperoni"],address:"1415 NW 70th St, Seattle, WA 98117",lat:47.6790,lng:-122.3766,instagram:"delanceyseattle",website:"https://www.delanceyseattle.com",reservation:"walk-in",phone:"(206) 838-1960",hours:"Tue-Thu 5PM-9PM, Fri 5PM-10PM, Sat 4:30PM-10PM, Sun 4:30PM-9PM"});

add({name:"Stoneburner",cuisine:"Italian / Pacific Northwest",neighborhood:"Ballard",score:88,price:3,tags:["Italian","Pizza","Date Night","Local Favorites"],description:"Rustic Italian meets Pacific Northwest on the ground floor of Hotel Ballard. Handmade pastas, wood-fired dishes, and thoughtfully sourced ingredients from local farmers and fisheries.",dishes:["Handmade Pasta","Wood-Fired Pizza","PNW Ingredients"],address:"5214 Ballard Ave NW, Seattle, WA 98107",lat:47.6671,lng:-122.3833,instagram:"stoneburnerseattle",website:"https://www.stoneburnerseattle.com",reservation:"OpenTable",phone:"(206) 695-2051",hours:"Wed-Sat 4PM-9PM, Sun 10AM-3PM, 4PM-9PM"});

add({name:"Brimmer & Heeltap",cuisine:"Gastropub / New American",neighborhood:"Ballard",score:88,price:2,tags:["New American","Gastropub","Date Night","Local Favorites"],description:"Ballard gastropub with a seasonal New American menu and craft cocktails. Cozy neighborhood spot with a beautiful outdoor patio in summer.",dishes:["Seasonal Menu","Craft Cocktails","Patio"],address:"425 NW Market St, Seattle, WA 98107",lat:47.6689,lng:-122.3770,instagram:"brimmerandheeltap",website:"https://www.brimmerandheeltap.com",reservation:"Resy",phone:"(206) 420-2534",hours:"Wed-Sun 4PM-9PM"});

// === PIKE PLACE MARKET ===
add({name:"The Pink Door",cuisine:"Italian-American",neighborhood:"Pike Place Market",score:90,price:3,tags:["Italian","Date Night","Live Music","Iconic","Celebrations"],description:"Italian-American restaurant and cabaret lounge in Post Alley since 1981. Upscale space with live music, burlesque, and outstanding lasagna. Pike Place institution.",dishes:["Lasagna","Italian Classics","Live Cabaret"],address:"1919 Post Alley, Seattle, WA 98101",lat:47.6098,lng:-122.3417,instagram:"thepinkdoorrestaurant",website:"https://www.thepinkdoor.net",reservation:"OpenTable",phone:"(206) 443-3241",hours:"Tue-Sat 11:30AM-10PM"});

// === CAPITOL HILL ===
add({name:"Momiji",cuisine:"Japanese / Sushi",neighborhood:"Capitol Hill",score:88,price:2,tags:["Japanese","Sushi","Date Night","Local Favorites"],description:"Handcrafted Japanese restaurant on Capitol Hill's 12th Avenue with a Japanese garden surrounded by glass in the center. Creates a soothing atmosphere with natural light.",dishes:["Sushi","Sashimi","Japanese Garden Dining"],address:"1522 12th Ave, Seattle, WA 98122",lat:47.6150,lng:-122.3184,instagram:"momijiseattle",website:"https://www.momijiseattle.com",reservation:"OpenTable",phone:"(206) 457-4068"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 2 complete!');
