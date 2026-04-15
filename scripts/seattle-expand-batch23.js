// Seattle Batch 23 — Final push: Fremont, Capitol Hill, Beacon Hill, Waterfront, Belltown
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

add({name:"Uneeda Burger",cuisine:"American / Burgers",neighborhood:"Fremont",score:87,price:2,tags:["Burgers","Casual","Local Favorites","Family Friendly","Patio"],description:"Fremont scratch-kitchen burger joint since 2010. Beef, bison, chicken, lamb, elk, and plant-based patties. House buns, hand-cut fries, milkshakes. One of Seattle's best gourmet burgers.",dishes:["Uneeda Burger","Bison Burger","Hand-Cut Fries"],address:"4302 Fremont Ave N, Seattle, WA 98103",lat:47.6602,lng:-122.3499,instagram:"uneedaburger",website:"https://uneedaburger.com",reservation:"walk-in",phone:"(206) 547-2600",hours:"Daily 11AM-9PM"});

add({name:"Sam's Tavern",cuisine:"American / Burgers",neighborhood:"Capitol Hill",score:84,price:2,tags:["Burgers","Casual","Late Night","Local Favorites","Cocktails"],description:"Capitol Hill Pike-Pine corridor burger tavern with hydraulic glass garage doors. Sam Burger, wings, wings challenge, loud fun energy. SLU sister location.",dishes:["Sam Burger","Wings Challenge","Craft Cocktails"],address:"1024 E Pike St, Seattle, WA 98122",lat:47.6141,lng:-122.3190,instagram:"samstavern",website:"http://samstavernseattle.com",reservation:"walk-in",phone:"(206) 397-3344",hours:"Tue-Thu 3PM-10PM, Fri-Sat 11AM-2AM, Sun 11AM-12AM, Closed Mon"});

add({name:"Quinn's Pub",cuisine:"Gastropub",neighborhood:"Capitol Hill",score:86,price:2,tags:["Gastropub","American","Casual","Date Night","Local Favorites","Late Night"],description:"Capitol Hill Pike Street gastropub — wild game focus (elk, boar, venison), charcuterie, and a serious beer list. A 2010s-era Seattle gastropub that's still going strong.",dishes:["Wild Boar Sloppy Joe","Charcuterie Plate","Elk Burger"],address:"1001 E Pike St, Seattle, WA 98122",lat:47.6140,lng:-122.3193,instagram:"quinnspubseattle",website:"https://www.quinnspubseattle.com",reservation:"OpenTable",phone:"(206) 325-7711",hours:"Wed-Thu,Sun 4PM-9PM, Fri-Sat 4PM-1AM, Closed Mon-Tue"});

add({name:"Oak",cuisine:"American / Burgers",neighborhood:"Beacon Hill",score:85,price:2,tags:["Burgers","Gastropub","Casual","Family Friendly","Local Favorites","Vegetarian"],description:"Beacon Hill neighborhood burger bar and cocktail room. All-natural burgers, vegetarian/vegan options, and a kid-friendly early dining crowd with late-night bar energy.",dishes:["Oak Burger","Vegan Burger","Craft Cocktails"],address:"3019 Beacon Ave S, Seattle, WA 98144",lat:47.5799,lng:-122.3118,instagram:"oakseattle",website:"https://oak-seattle.com",reservation:"walk-in",phone:"(206) 535-7070",hours:"Daily 4PM-1AM"});

add({name:"Navy Strength",cuisine:"Tiki Bar",neighborhood:"Belltown",score:89,price:3,tags:["Cocktails","Iconic","Date Night","Critics Pick","Late Night","Local Favorites"],description:"Belltown tropical/tiki cocktail destination from Anu Apte and Chris Elford. Inventive tropical drinks, creative small plates, and a rotating cocktail menu. A James Beard-semifinalist bar.",dishes:["Tropical Tiki Cocktails","Nachos","Rotating Drink Menu"],address:"2505 2nd Ave Ste 102, Seattle, WA 98121",lat:47.6146,lng:-122.3470,instagram:"navystrengthseattle",website:"https://www.navystrengthseattle.com",reservation:"Resy",phone:"(206) 420-7043",hours:"Tue-Sat 5PM-12AM, Closed Sun-Mon",awards:"James Beard Semifinalist — Outstanding Bar",indicators:["women-owned"]});

add({name:"Pecado Bueno",cuisine:"Mexican",neighborhood:"Fremont",score:85,price:2,tags:["Mexican","Casual","Local Favorites","Family Friendly","Happy Hour"],description:"Fremont neighborhood Mexican with house-made tortillas and a big tequila/mezcal list. Tacos, burritos, margaritas. Sister location in Eastlake. Community-rooted, frequently fundraises.",dishes:["Carnitas Tacos","Margaritas","House Guacamole"],address:"4307 Fremont Ave N, Seattle, WA 98103",lat:47.6603,lng:-122.3499,instagram:"pecadobueno",website:"https://pecadobueno.com",reservation:"walk-in",phone:"(206) 457-8837",hours:"Daily 11AM-10PM"});

add({name:"Elliott's Oyster House",cuisine:"Seafood / Oysters",neighborhood:"Downtown Waterfront",score:89,price:4,tags:["Seafood","Oysters","Iconic","Date Night","Celebrations","Tourist Essential","Awards"],description:"Pier 56 oyster destination since 1975 — 20+ varieties of Pacific Northwest oysters, Dungeness crab, and a commanding Elliott Bay view. Seattle's longest-running fine seafood house.",dishes:["20+ Oyster Varieties","Dungeness Crab","Pier 56 Views"],address:"1201 Alaskan Way Pier 56, Seattle, WA 98101",lat:47.6053,lng:-122.3405,instagram:"elliottsoysterhouse",website:"https://www.elliottsoysterhouse.com",reservation:"OpenTable",phone:"(206) 623-4340",hours:"Mon-Thu,Sun 11AM-9PM, Fri-Sat 11AM-10PM",awards:"Wine Spectator Best of Award of Excellence"});

add({name:"Ivar's Acres of Clams",cuisine:"Seafood",neighborhood:"Downtown Waterfront",score:85,price:2,tags:["Seafood","Iconic","Tourist Essential","Casual","Family Friendly","Scenic"],description:"Ivar's iconic Pier 54 seafood restaurant since 1938. Clam chowder, fish & chips, and the beloved tradition of feeding the seagulls (and getting splatted). Pure Seattle heritage.",dishes:["Ivar's Clam Chowder","Fish & Chips","Feed the Seagulls"],address:"1001 Alaskan Way Pier 54, Seattle, WA 98104",lat:47.6034,lng:-122.3383,instagram:"ivarsrestaurants",website:"https://www.ivars.com/acres",reservation:"OpenTable",phone:"(206) 624-6852",hours:"Mon-Fri 11AM-8PM, Sat-Sun 11AM-9PM",awards:"Seattle Institution since 1938"});

add({name:"Lola",cuisine:"Greek / Mediterranean",neighborhood:"Belltown",score:88,price:3,tags:["Greek","Mediterranean","Brunch","Date Night","Iconic","Local Favorites","Critics Pick"],description:"Tom Douglas's Greek-inspired Belltown dining room at Hotel Andra since 2004. Dolmades, wood-grilled lamb, legendary Sunday donuts brunch. An underrated Belltown gem.",dishes:["Sunday Donut Brunch","Wood-Grilled Lamb","Dolmades"],address:"2000 4th Ave, Seattle, WA 98121",lat:47.6134,lng:-122.3389,instagram:"lolaseattle",website:"https://www.lolaseattle.com",reservation:"OpenTable",phone:"(206) 441-1430",hours:"Daily 7AM-10PM",group:"Tom Douglas Restaurants"});

add({name:"FOB Poke Bar",cuisine:"Poke / Hawaiian",neighborhood:"Belltown",score:86,price:2,tags:["Hawaiian","Asian","Casual","Quick Bite","Local Favorites","Family Friendly","Vegetarian"],description:"FOB Poke Bar pioneered Seattle's poke boom. Custom bowls with premium tuna, salmon, and creative toppings. Flagship Belltown, plus Capitol Hill outpost.",dishes:["Classic Ahi Bowl","Spicy Salmon","Custom Poke Bowls"],address:"220 Blanchard St, Seattle, WA 98121",lat:47.6147,lng:-122.3471,instagram:"fobpokebar",website:"https://fobpokebar.com",reservation:"walk-in",phone:"(206) 728-9888",hours:"Daily 11AM-9PM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 23 complete!');
