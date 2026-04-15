// Seattle Batch 20 — Downtown/Waterfront/Magnolia + Stoup Brewery + Ethiopian/Chinese/Persian
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

add({name:"Ben Paris",cuisine:"New American",neighborhood:"Downtown",score:86,price:2,tags:["New American","Date Night","Cocktails","Brunch","Local Favorites","Tourist Essential"],description:"State Hotel lobby restaurant steps from Pike Place. Named after a 1930s Seattle bookmaker; seasonal American menu, vintage-chic dining room, strong brunch.",dishes:["Ben Paris Burger","Weekend Brunch","Classic Cocktails"],address:"130 Pike St, Seattle, WA 98101",lat:47.6095,lng:-122.3395,instagram:"benparisseattle",website:"https://benparis.com",reservation:"OpenTable",phone:"(206) 513-7303",hours:"Daily 7AM-10PM"});

add({name:"Stoup Brewing",cuisine:"Brewery",neighborhood:"Ballard",score:89,price:1,tags:["Brewery","Casual","Local Favorites","Family Friendly","Patio"],description:"Family-friendly Ballard brewery in the neighborhood's brewery district. Rotating 20+ taps, huge beer garden, food trucks, and the award-winning Citra IPA. A Ballard Brewery District cornerstone.",dishes:["Citra IPA","20+ Rotating Taps","Food Truck Partners"],address:"1108 NW 52nd St, Seattle, WA 98107",lat:47.6665,lng:-122.3716,instagram:"stoupbrewing",website:"https://www.stoupbrewing.com",reservation:"walk-in",phone:"(206) 457-5524",hours:"Daily 12PM-10PM",indicators:["brewery"]});

add({name:"Terra Plata",cuisine:"New American / Farm-to-Table",neighborhood:"Capitol Hill (Melrose Market)",score:89,price:3,tags:["New American","Farm-to-Table","Date Night","Critics Pick","Patio","Local Favorites","Rooftop"],description:"Chef Tamara Murphy's farm-to-table Melrose Market anchor. Rooftop patio, wood-fired cooking, and hyper-seasonal Pacific Northwest menus. One of Capitol Hill's most beloved dining rooms.",dishes:["Wood-Fired Menu","Rooftop Patio","Seasonal Tasting"],address:"1501 Melrose Ave, Seattle, WA 98122",lat:47.6145,lng:-122.3281,instagram:"terraplataseattle",website:"https://www.terraplata.com",reservation:"OpenTable",phone:"(206) 325-1501",hours:"Tue-Sat 5PM-10PM, Sun 5PM-9PM, Closed Mon",indicators:["women-owned"]});

add({name:"Hattie's Hat",cuisine:"American / Bar",neighborhood:"Ballard",score:83,price:1,tags:["American","Iconic","Brunch","Late Night","Casual","Local Favorites","Cocktails"],description:"Ballard Avenue's 1904 saloon — one of Seattle's oldest continuously operating bars. Diner breakfast, burgers, stiff drinks. Pure historic Ballard character.",dishes:["All-Day Breakfast","Burgers","Bloody Marys"],address:"5231 Ballard Ave NW, Seattle, WA 98107",lat:47.6687,lng:-122.3830,instagram:"hattieshat",website:"https://hatties-hat.com",reservation:"walk-in",phone:"(206) 784-0175",hours:"Sun-Tue 10AM-12AM, Wed-Sat 10AM-2AM",awards:"Operating since 1904"});

add({name:"Le Pichet",cuisine:"French",neighborhood:"Pike Place Market",score:90,price:3,tags:["French","Date Night","Iconic","Critics Pick","Late Night","Local Favorites"],description:"32-seat Belltown French bistro since 2000. Roast chicken for two with 50-minute wait, charcuterie, traditional regional French wines. Pure Parisian neighborhood bistro energy.",dishes:["Roast Chicken for Two","Charcuterie Plate","Regional French Wines"],address:"1933 1st Ave, Seattle, WA 98101",lat:47.6108,lng:-122.3426,instagram:"lepichetseattle",website:"https://www.lepichetseattle.com",reservation:"walk-in",phone:"(206) 256-1499",hours:"Sun-Wed 10AM-9PM, Thu-Sat 10AM-10PM"});

add({name:"Palisade",cuisine:"Seafood / Pacific Northwest",neighborhood:"Magnolia",score:87,price:4,tags:["Seafood","Date Night","Scenic","Celebrations","Iconic","Brunch"],description:"Elliott Bay Marina destination seafood restaurant with dramatic waterfront views of downtown and the Olympics. 30+ years of special-occasion PNW seafood. Bridges the dining room over a lobster pool.",dishes:["Dungeness Crab","Seafood Tower","Skyline Views"],address:"2601 W Marina Pl, Seattle, WA 98199",lat:47.6319,lng:-122.3979,instagram:"palisaderestaurant",website:"https://www.palisaderestaurant.com",reservation:"OpenTable",phone:"(206) 285-1000",hours:"Mon-Fri 12PM-9PM, Sat 3PM-9PM, Sun 10:30AM-9PM"});

add({name:"Six Seven",cuisine:"Seafood / New American",neighborhood:"Belltown (Pier 67)",score:87,price:3,tags:["Seafood","Date Night","Scenic","Celebrations","Tourist Essential"],description:"Edgewater Hotel's signature waterfront restaurant on Pier 67 — over-the-water Elliott Bay views, Pacific Northwest seafood, and the famous Dungeness crab cakes. A classic Seattle hotel restaurant.",dishes:["Dungeness Crab Cakes","Over-Water Dining","PNW Seafood"],address:"2411 Alaskan Way Pier 67, Seattle, WA 98121",lat:47.6129,lng:-122.3525,instagram:"sixsevenrestaurant",website:"https://www.edgewaterhotel.com/dine/six-seven-restaurant",reservation:"OpenTable",phone:"(206) 269-4575",hours:"Daily 6:30AM-10PM"});

add({name:"The Fisherman's Restaurant & Bar",cuisine:"Seafood",neighborhood:"Downtown Waterfront",score:83,price:3,tags:["Seafood","Tourist Essential","Scenic","Family Friendly","Casual"],description:"Pier 57 waterfront seafood classic at Miner's Landing. Fresh Pacific Northwest fish, chowders, and view of Elliott Bay + Great Wheel. Tourist essential but genuine PNW seafood.",dishes:["Dungeness Crab","Clam Chowder","Fish & Chips"],address:"1301 Alaskan Way Pier 57, Seattle, WA 98101",lat:47.6058,lng:-122.3410,instagram:"fishermansseattle",website:"https://www.fishermansrestaurantseattle.com",reservation:"OpenTable",phone:"(206) 623-3500",hours:"Daily 11AM-10PM"});

add({name:"Chiho Bistro",cuisine:"Chinese / Noodles",neighborhood:"Belltown",score:86,price:2,tags:["Chinese","Noodles","Casual","Local Favorites","Critics Pick","Family Friendly"],description:"Belltown regional Chinese and Sichuan standout. Dim sum, hand-pulled noodles, chili wontons, and Szechuan mala boil. A Belltown sleeper-hit for serious Chinese dining.",dishes:["Hand-Pulled Noodles","Dim Sum","Sichuan Mala Boil"],address:"2330 2nd Ave, Seattle, WA 98121",lat:47.6149,lng:-122.3465,instagram:"chihobistro",website:"https://www.chihobistro.com",reservation:"OpenTable",phone:"(206) 782-8855",hours:"Mon-Thu 12PM-2:30PM & 4PM-10PM, Fri 12PM-2:30PM & 4PM-11PM, Sat 12PM-11PM, Sun 12PM-9PM"});

add({name:"Adey Abeba Ethiopian Restaurant",cuisine:"Ethiopian",neighborhood:"Central District",score:87,price:2,tags:["Ethiopian","African","Casual","Local Favorites","Family Friendly","Vegetarian"],description:"Family-owned Central District Ethiopian since 2005 — housed in a beautifully restored Victorian. Full coffee ceremonies, generous combo platters, strong vegetarian menu.",dishes:["Ethiopian Combo Platter","Coffee Ceremony","Vegetarian Feast"],address:"2123 E Union St, Seattle, WA 98122",lat:47.6147,lng:-122.3039,instagram:"adeyabebaseattle",website:"https://adeyabeba.net",reservation:"walk-in",phone:"(206) 322-1617",hours:"Mon-Sat 7AM-10PM, Closed Sun",indicators:["black-owned","women-owned","vegetarian"]});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 20 complete!');
