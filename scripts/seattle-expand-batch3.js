// Seattle Batch 3 — Pike Place + Seafood + Coffee + Queen Anne/SLU
// All verified via Yelp/official sites
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

// === PIKE PLACE MARKET ===
add({name:"Matt's in the Market",cuisine:"New American / Seafood",neighborhood:"Pike Place Market",score:89,price:3,tags:["Seafood","New American","Date Night","Scenic","Local Favorites"],description:"Top-floor seafood with views of Elliott Bay and Pike Place Market. Small but mighty seasonal menu. Famous for fried catfish sandwich on the lunch menu for 20+ years.",dishes:["Fried Catfish Sandwich","Seasonal Seafood","Elliott Bay Views"],address:"94 Pike St Ste 32, Seattle, WA 98101",lat:47.6089,lng:-122.3406,instagram:"mattsinthemarket",website:"https://www.mattsinthemarket.com",reservation:"OpenTable",phone:"(206) 467-7909"});

add({name:"Beecher's Handmade Cheese",cuisine:"Cheese / Mac & Cheese",neighborhood:"Pike Place Market",score:88,price:1,tags:["Casual","Iconic","Local Favorites","Tourist Essential"],description:"Pike Place cheese maker with signature World's Best Mac & Cheese. Watch cheesemaking in real time through glass windows. Grilled cheese, tomato soup, and takeaway cheese.",dishes:["World's Best Mac & Cheese","Grilled Cheese","Flagship Cheese"],address:"1600 Pike Pl, Seattle, WA 98101",lat:47.6096,lng:-122.3419,instagram:"beechershandmadecheese",website:"https://beechershandmadecheese.com",reservation:"walk-in",phone:"(206) 956-1964",hours:"Mon-Thu 10AM-5PM, Fri-Sun 10AM-6PM"});

add({name:"Lowell's Restaurant",cuisine:"American / Seafood",neighborhood:"Pike Place Market",score:87,price:2,tags:["Seafood","Brunch","Iconic","Scenic","Casual"],description:"Pike Place Market institution since 1908. Three floors of water views with creamy clam chowder, rustic tuna melt, and fish tacos. Views of ferry boats and the Olympic Mountains.",dishes:["Clam Chowder","Tuna Melt","Fish Tacos"],address:"1519 Pike Pl, Seattle, WA 98101",lat:47.6089,lng:-122.3410,instagram:"lowellsseattle",website:"https://eatatlowells.com",reservation:"walk-in",phone:"(206) 622-2036",hours:"Mon-Thu 9AM-4PM, Fri-Sat 8AM-4:30PM, Sun 8AM-4PM"});

// === SEAFOOD ===
add({name:"Taylor Shellfish Oyster Bar",cuisine:"Oyster Bar / Seafood",neighborhood:"Capitol Hill (Melrose Market)",score:92,price:2,tags:["Seafood","Oysters","Critics Pick","Date Night","Local Favorites"],description:"Family-owned Taylor Shellfish Farms oyster bar at Melrose Market. Freshly shucked oysters consumed next to bubbling tanks. 5 generations of shellfish farming in Puget Sound.",dishes:["Freshly Shucked Oysters","Geoduck Sashimi","Dungeness Crab"],address:"1521 Melrose Ave, Seattle, WA 98122",lat:47.6148,lng:-122.3247,instagram:"taylorshellfish",website:"https://www.taylorshellfishfarms.com",reservation:"walk-in",phone:"(206) 501-4321"});

add({name:"Salty's on Alki Beach",cuisine:"Seafood",neighborhood:"West Seattle",score:88,price:3,tags:["Seafood","Brunch","Scenic","Date Night"],description:"Waterfront seafood restaurant on Alki Beach with stunning views of the Seattle skyline. Famous for Sunday brunch buffet and fresh Pacific Northwest seafood.",dishes:["Sunday Brunch Buffet","Fresh Seafood","Skyline Views"],address:"1936 Harbor Ave SW, Seattle, WA 98126",lat:47.5902,lng:-122.3783,instagram:"saltysseattle",website:"https://www.saltys.com",reservation:"OpenTable",phone:"(206) 937-1600"});

// === COFFEE SHOPS (Seattle specialty) ===
add({name:"Storyville Coffee",cuisine:"Coffee",neighborhood:"Pike Place Market",score:88,price:1,tags:["Bakery/Coffee","Scenic","Local Favorites","Iconic"],description:"2nd floor of historic Pike Place Market with outstanding views of the Seattle waterfront. Artfully prepared espresso drinks starting at 6:59 AM daily.",dishes:["Espresso","Pour-Over","Waterfront Views"],address:"94 Pike St, Seattle, WA 98101",lat:47.6090,lng:-122.3416,instagram:"storyvillecoffee",website:"https://storyville.com",reservation:"walk-in",phone:""});

add({name:"Milstead & Co.",cuisine:"Coffee",neighborhood:"Fremont",score:90,price:1,tags:["Bakery/Coffee","Local Favorites","Critics Pick"],description:"Founded 2011. One of Seattle's first multi-roaster cafes below the Aurora Bridge. Food and Wine 5/5 Coffee Snob Factor score -- the only Seattle shop to achieve this honor. Lake Union views.",dishes:["Multi-Roaster Selection","Espresso","Lake Views"],address:"754 N 34th St, Seattle, WA 98103",lat:47.6497,lng:-122.3492,instagram:"milsteadandco",website:"https://milsteadandco.com",reservation:"walk-in",phone:""});

add({name:"Anchorhead Coffee",cuisine:"Coffee",neighborhood:"Downtown",score:88,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Founded 2013 as Seattle's first bottled cold brew company. 2015 America's Best Espresso at Coffeefest Portland. Signature Brown Sugar Latte and famous 'quaffle' pastry.",dishes:["Brown Sugar Latte","Cold Brew","Quaffle"],address:"1600 7th Ave, Seattle, WA 98101",lat:47.6124,lng:-122.3356,instagram:"anchorheadcoffee",website:"https://anchorheadcoffee.com",reservation:"walk-in",phone:""});

add({name:"Elm Coffee Roasters",cuisine:"Coffee",neighborhood:"Pioneer Square",score:87,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Small-batch coffee in historic Pioneer Square with a minimalist approach and transparent sourcing. Known for perfectly brewed single-origin espresso and pour-overs.",dishes:["Single-Origin Espresso","Pour-Over","Small Batch Roasts"],address:"240 2nd Ave S, Seattle, WA 98104",lat:47.6019,lng:-122.3344,instagram:"elmcoffeeroasters",website:"https://elmcoffeeroasters.com",reservation:"walk-in",phone:""});

add({name:"Analog Coffee",cuisine:"Coffee",neighborhood:"Capitol Hill",score:86,price:1,tags:["Bakery/Coffee","Local Favorites","Casual"],description:"Cozy Capitol Hill café with an inviting vibe and ample seating. Perfect for casual meetups or solo work. Quality espresso in a charming space.",dishes:["Espresso","Pour-Over","Coffee Shop Vibes"],address:"235 Summit Ave E, Seattle, WA 98102",lat:47.6197,lng:-122.3224,instagram:"analogcoffee",website:"",reservation:"walk-in",phone:""});

// === QUEEN ANNE / SLU / BELLTOWN ===
add({name:"Paju",cuisine:"Korean",neighborhood:"South Lake Union",score:89,price:3,tags:["Korean","Date Night","Critics Pick","Local Favorites"],description:"Upscale Korean restaurant that moved from Queen Anne to South Lake Union. Widely considered the best Korean food in Seattle. Seasonal tasting menu.",dishes:["Korean Tasting Menu","Banchan","Modern Korean"],address:"513 Westlake Ave N, Seattle, WA 98109",lat:47.6240,lng:-122.3385,instagram:"pajuseattle",website:"",reservation:"Resy",phone:""});

add({name:"2120 Restaurant",cuisine:"New American",neighborhood:"South Lake Union",score:86,price:3,tags:["New American","Date Night","Cocktails","Scenic"],description:"Casual fine dining beside the Amazon Spheres in South Lake Union. Seasonal menus and craft cocktails in a modern space.",dishes:["Seasonal Menu","Craft Cocktails","Amazon Spheres Views"],address:"2120 6th Ave, Seattle, WA 98121",lat:47.6179,lng:-122.3389,instagram:"2120restaurant",website:"https://www.2120restaurant.com",reservation:"OpenTable",phone:""});

add({name:"Toulouse Petit",cuisine:"Creole / French",neighborhood:"Queen Anne",score:87,price:2,tags:["Creole","Brunch","Date Night","Late Night","Local Favorites"],description:"Queen Anne Creole and French Quarter-inspired bistro with seafood-focused dishes, great brunch, and late-night happy hour. Beloved neighborhood institution.",dishes:["Creole Classics","Happy Hour","Brunch"],address:"601 Queen Anne Ave N, Seattle, WA 98109",lat:47.6249,lng:-122.3565,instagram:"toulousepetit",website:"https://www.toulousepetit.com",reservation:"OpenTable",phone:"(206) 432-9069"});

// === ICONIC SEATTLE ===
add({name:"Radiator Whiskey",cuisine:"American / Whiskey Bar",neighborhood:"Pike Place Market",score:88,price:2,tags:["Whiskey","New American","Date Night","Late Night","Critics Pick"],description:"Chef Shannon Galusha's whiskey-focused spot on the top floor of the Corner Market at Pike Place. Shared plates, pig's head, and 100+ whiskeys.",dishes:["Pig's Head","Whiskey Selection","Shared Plates"],address:"94 Pike St Ste 30, Seattle, WA 98101",lat:47.6088,lng:-122.3406,instagram:"radiatorwhiskey",website:"https://www.radiatorwhiskey.com",reservation:"Resy",phone:""});

add({name:"Seatown Seabar",cuisine:"Seafood",neighborhood:"Pike Place Market",score:87,price:2,tags:["Seafood","Date Night","Local Favorites"],description:"One of Tom Douglas's restaurants at Pike Place Market. Great for sampling Seattle's local seafood. Known for incredible fishmonger's stew and coho salmon.",dishes:["Fishmonger's Stew","Coho Salmon","Local Seafood"],address:"2010 Western Ave, Seattle, WA 98121",lat:47.6108,lng:-122.3428,instagram:"seatownseabar",website:"",reservation:"OpenTable",phone:"",group:"Tom Douglas"});

add({name:"Dahlia Lounge",cuisine:"New American",neighborhood:"Downtown",score:88,price:3,tags:["New American","Date Night","Iconic","Local Favorites"],description:"Tom Douglas's flagship restaurant since 1989. Pacific Northwest cuisine, famous triple coconut cream pie, and crab cakes. A Seattle institution.",dishes:["Triple Coconut Cream Pie","Crab Cakes","Seasonal Menu"],address:"2001 4th Ave, Seattle, WA 98121",lat:47.6126,lng:-122.3411,instagram:"dahlialounge",website:"https://www.dahlialounge.com",reservation:"OpenTable",phone:"(206) 682-4142",group:"Tom Douglas"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 3 complete!');
