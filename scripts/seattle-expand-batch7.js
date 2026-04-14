// Seattle Batch 7 — Cocktails, Wine Bars, Sushi, Thai
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

// === SUSHI ===
add({name:"Sushi Kashiba",cuisine:"Japanese / Sushi",neighborhood:"Pike Place Market",score:95,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Iconic","Critics Pick"],description:"Chef Shiro Kashiba's masterpiece next to Pike Place Market. The master who brought Edomae-style sushi to Seattle. Omakase experience at the bar is a Seattle bucket-list dining event. Three-time James Beard nominee.",dishes:["Omakase","Edomae Sushi","Nigiri"],address:"86 Pine St Ste 1, Seattle, WA 98101",lat:47.6099,lng:-122.3416,instagram:"sushikashiba",website:"https://sushikashiba.com",reservation:"OpenTable",phone:"(206) 441-8844",hours:"Mon,Wed-Thu,Sun 5PM-9PM, Fri-Sat 5PM-9:30PM"});

add({name:"Shiro's Sushi",cuisine:"Japanese / Sushi",neighborhood:"Belltown",score:91,price:3,tags:["Japanese","Sushi","Date Night","Iconic","Local Favorites"],description:"Belltown sushi institution opened 1994 by master sushi chef Shiro Kashiba — the first Edomae-style sushi restaurant in Seattle. Traditional omakase and impeccable nigiri craftsmanship.",dishes:["Omakase","Nigiri","Edomae Classics"],address:"2401 2nd Ave, Seattle, WA 98121",lat:47.6152,lng:-122.3432,instagram:"shirosseattle",website:"https://shiros.com",reservation:"OpenTable",phone:"(206) 443-9844"});

// === COCKTAIL BARS ===
add({name:"Canon",cuisine:"Cocktail Bar",neighborhood:"Capitol Hill",score:93,price:3,tags:["Cocktails","Date Night","Critics Pick","Iconic","Late Night"],description:"America's largest spirits collection at 4,000+ labels. Cocktail bar and liquid library with cult favorites like the Truffle Old Fashioned. Won World's Best Drink Selection at 2013 Tales of the Cocktail Spirited Awards.",dishes:["Truffle Old Fashioned","Rare Whiskey","Cask-Strength Cocktails"],address:"928 12th Ave, Seattle, WA 98122",lat:47.6094,lng:-122.3173,instagram:"canonseattle",website:"https://www.canonseattle.com",reservation:"walk-in",phone:"",hours:"Wed-Thu 5PM-12AM, Fri-Sat 5PM-2AM, Sun 5PM-12AM"});

add({name:"Rob Roy",cuisine:"Cocktail Bar",neighborhood:"Belltown",score:92,price:3,tags:["Cocktails","Date Night","Critics Pick","Iconic"],description:"Belltown classic cocktail lounge. 2023 James Beard Foundation recognition for Outstanding Bar. Technical excellence in mixology under beverage director Chris Elford. Elevated classics and thoughtful builds.",dishes:["Classic Cocktails","Signature Drinks","Rare Spirits"],address:"2332 2nd Ave, Seattle, WA 98121",lat:47.6140,lng:-122.3444,instagram:"robroyseattle",website:"http://www.robroyseattle.com",reservation:"walk-in",phone:"(206) 956-8423",awards:"James Beard Outstanding Bar 2023"});

add({name:"Liberty",cuisine:"Cocktail Bar / Sushi",neighborhood:"Capitol Hill",score:89,price:2,tags:["Cocktails","Sushi","Local Favorites","Late Night","Casual"],description:"Capitol Hill neighborhood bar on 15th Ave E since 2006. Owner Andrew Friedman's comfortable spot with 600+ bottles — mezcals to Japanese whiskies. Craft cocktails, sushi, and coffee all day.",dishes:["Craft Cocktails","Japanese Whisky","Sushi"],address:"517 15th Ave E, Seattle, WA 98112",lat:47.6230,lng:-122.3121,instagram:"libertybar",website:"https://www.libertybarseattle.com",reservation:"walk-in",phone:"(206) 323-9898",hours:"Daily 12PM-2AM"});

// === WINE BARS ===
add({name:"L'Oursin",cuisine:"French / Natural Wine",neighborhood:"Central District",score:91,price:3,tags:["French","Wine Bar","Date Night","Critics Pick","Local Favorites"],description:"Sepia-toned French spot at the crossroads of First Hill, Capitol Hill and Central District since 2016. Celebrates French and Northwest flavors alongside natural and biodynamic wines. Diverse natural wine list.",dishes:["French Classics","Natural Wines","Cheese & Charcuterie"],address:"1315 E Jefferson St, Seattle, WA 98122",lat:47.6096,lng:-122.3170,instagram:"loursinseattle",website:"https://www.loursinseattle.com",reservation:"Resy",phone:"(206) 485-7173",hours:"Sun-Thu 5PM-9PM, Fri-Sat 5PM-9:30PM"});

add({name:"Le Caviste",cuisine:"French / Wine Bar",neighborhood:"Denny Triangle",score:90,price:2,tags:["French","Wine Bar","Date Night","Local Favorites","Critics Pick"],description:"Denny Triangle French bistrot à vins since 2013. Consistently ranked among America's best wine bars. Extensive French wines by the glass and bottle, classic dishes — cheese, charcuterie, salads, poisson en papillote.",dishes:["French Wines","Cheese Board","Charcuterie"],address:"1919 7th Ave, Seattle, WA 98101",lat:47.6144,lng:-122.3353,instagram:"lecaviste",website:"http://lecavisteseattle.com",reservation:"walk-in",phone:"(206) 728-2657"});

// === THAI ===
add({name:"Kin Len Thai Night Bites",cuisine:"Thai",neighborhood:"Fremont",score:89,price:2,tags:["Thai","Date Night","Local Favorites","Critics Pick"],description:"Fremont Thai restaurant from Isarn Thai Soul Kitchen founders. Name means 'eat and play'. Energetic, colorful vibes with dishes like river prawn pad Thai and elevated Thai night-market favorites.",dishes:["River Prawn Pad Thai","Thai Night Market","Northern Thai Specials"],address:"3517 Fremont Ave N, Seattle, WA 98103",lat:47.6496,lng:-122.3504,instagram:"kinlenbar",website:"https://kin-len.com",reservation:"walk-in",phone:"(206) 582-1825"});

add({name:"Bangrak Market",cuisine:"Thai",neighborhood:"Belltown",score:88,price:2,tags:["Thai","Late Night","Local Favorites","Casual"],description:"Belltown Thai restaurant with a fun night-market atmosphere — plastic basket chandeliers and a faux market stall entrance. Bright, comforting Thai street food favorites and exotic drinks. Late-night food.",dishes:["Thai Street Food","Pad See Ew","Exotic Cocktails"],address:"2319 2nd Ave, Seattle, WA 98121",lat:47.6140,lng:-122.3435,instagram:"bangrakmarket",website:"https://www.bangrakmarket.com",reservation:"walk-in",phone:"(206) 735-7352"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 7 complete!');
