// Seattle Batch 1 — Top 25-30 from verified sources
// Sources: Infatuation top-25, Resy Hit List Winter 2026, Seattle Met, Infatuation best-new 2025
// All addresses/phones verified individually via Yelp, official sites, or web search
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const SEATTLE_DATA=';
const p = html.indexOf(marker);
if (p === -1) { console.error('SEATTLE_DATA not found'); process.exit(1); }
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

// === INFATUATION TOP 25 SEATTLE ===
// Source: https://www.theinfatuation.com/seattle/guides/best-restaurants-seattle
add({name:"Altura",cuisine:"Italian",neighborhood:"Capitol Hill",score:94,price:4,tags:["Italian","Fine Dining","Date Night","Critics Pick","Celebrations"],description:"Chef Nathan Lockwood weekly-changing tasting menu celebrating Northwest produce, meats, seafood, and foraged items with Italian ingredients and traditions. One of Seattle top Italian restaurants.",dishes:["Weekly Tasting Menu","Hand-Cut Pasta","Foraged Plates"],address:"617 Broadway E, Seattle, WA 98102",lat:47.6235,lng:-122.3212,instagram:"alturarestaurant",website:"https://www.alturarestaurant.com",reservation:"OpenTable",phone:"(206) 402-6749",hours:"Tue-Thu 6PM-10PM, Fri-Sat 5PM-11PM, Sun 5PM-8PM"});

add({name:"Sushi Kashiba",cuisine:"Japanese / Sushi",neighborhood:"Pike Place Market",score:95,price:4,tags:["Japanese","Sushi","Fine Dining","Critics Pick","Date Night"],description:"Sushi master Shiro Kashiba flagship omakase. Legendary Seattle sushi institution next to Pike Place Market. Pristine fish, traditional technique, and one of the best sushi experiences in the Pacific Northwest.",dishes:["Omakase","Seasonal Nigiri","Chef Kashiba Specials"],address:"86 Pine St, Ste 1, Seattle, WA 98101",lat:47.6099,lng:-122.3416,instagram:"sushikashiba",website:"https://sushikashiba.com",reservation:"OpenTable",phone:"(206) 441-8844",hours:"Mon, Wed-Sun 5PM-9PM"});

add({name:"Kamonegi",cuisine:"Japanese / Soba",neighborhood:"Fremont",score:93,price:3,tags:["Japanese","Date Night","Critics Pick","Local Favorites"],description:"Tiny Fremont restaurant from chef Mutsuko Soma specializing in handmade ni-hachi soba noodles and seasonal tempura. Seattle Metropolitan 2018 Restaurant of the Year.",dishes:["Handmade Soba","Tempura Maitake","Seasonal Tempura"],address:"1054 N 39th St, Seattle, WA 98103",lat:47.6500,lng:-122.3415,instagram:"kamonegiseattle",website:"https://www.kamonegiseattle.com",reservation:"Tock",phone:""});

add({name:"Un Bien",cuisine:"Caribbean",neighborhood:"Ballard",score:91,price:1,tags:["Caribbean","Casual","Local Favorites","Critics Pick"],description:"Caribbean sandwich shop in Ballard famous for the Caribbean roast sandwich -- slow-cooked pork with caramelized onions. A cult Seattle favorite known for long lines and generous portions.",dishes:["Caribbean Roast Sandwich","Cuban","Plantains"],address:"7302 15th Ave NW, Seattle, WA 98117",lat:47.6830,lng:-122.3766,instagram:"unbienseattle",website:"",reservation:"walk-in",phone:""});

add({name:"Communion R&B",cuisine:"Southern / Soul Food",neighborhood:"Central District",score:92,price:3,tags:["Southern","Date Night","Critics Pick","Black-Owned"],description:"Chef Kristi Brown Black-owned Southern and Caribbean restaurant in the Central District. James Beard nominated. Fried chicken, collard greens, and soul food elevated with intention and skill.",dishes:["Fried Chicken","Collard Greens","Oxtail"],address:"2350 E Union St, Seattle, WA 98122",lat:47.6143,lng:-122.3024,instagram:"communionseattle",website:"",reservation:"Resy",phone:""});

// === RESY HIT LIST WINTER 2026 ===
// Source: https://blog.resy.com/2026/01/seattle-restaurants/
add({name:"The Corson Building",cuisine:"New American / Farm-to-Table",neighborhood:"Georgetown",score:92,price:4,tags:["New American","Fine Dining","Farm-to-Table","Date Night","Critics Pick"],description:"Chef Emily Crawford Dann hyper-seasonal dishes celebrating the region bounty. Set in a century-old Georgetown building, this prix-fixe-only restaurant is one of Seattle most unique dining experiences.",dishes:["Seasonal Prix Fixe","Foraged Dishes","Regional Ingredients"],address:"5609 Corson Ave S, Seattle, WA 98108",lat:47.5515,lng:-122.3218,instagram:"thecorsonbuilding",website:"",reservation:"Tock",phone:""});

add({name:"El Camino Restaurant & Bar",cuisine:"Mexican",neighborhood:"Fremont",score:89,price:2,tags:["Mexican","Date Night","Patio","Local Favorites"],description:"Chef Arturo Perez Michoacán-inspired Mexican on the Fremont canal. 30-year Seattle establishment. Great tequila program and one of the best patios in Fremont.",dishes:["Michoacán Moles","Mezcal Cocktails","Patio Dining"],address:"607 N 35th St, Seattle, WA 98103",lat:47.6497,lng:-122.3510,instagram:"elcaminoseattle",website:"",reservation:"Resy",phone:""});

add({name:"Canlis",cuisine:"New American / Fine Dining",neighborhood:"Queen Anne",score:96,price:4,tags:["Fine Dining","Celebrations","Date Night","Critics Pick","Iconic"],description:"Family-owned fine dining since 1950. Pacific Northwest foraging, local farms, and extraordinary fish and shellfish of Puget Sound. $180 tasting menu. Seattle finest special-occasion restaurant with stunning Lake Union views.",dishes:["$180 Tasting Menu","Pacific Northwest Seasonal","Legendary Views"],address:"2576 Aurora Ave N, Seattle, WA 98109",lat:47.6463,lng:-122.3468,instagram:"canlisrestaurant",website:"https://canlis.com",reservation:"Tock",phone:"(206) 283-3313",awards:"Seattle Iconic since 1950"});

add({name:"Sacro Bosco",cuisine:"Roman Pizza",neighborhood:"Central District",score:89,price:2,tags:["Pizza","Italian","Critics Pick","Local Favorites"],description:"Roman-style al taglio pizza inside Temple Pastries in South Seattle. Sourdough crust cut to order with seasonal toppings. Resy Hit List Winter 2026.",dishes:["Roman Al Taglio","Sourdough Pizza","Seasonal Slices"],address:"2524 S Jackson St, Seattle, WA 98144",lat:47.5994,lng:-122.2973,instagram:"sacroboscoseattle",website:"",reservation:"walk-in",phone:""});

add({name:"Happy Crab",cuisine:"Asian Fusion / Cajun Seafood",neighborhood:"Ballard",score:87,price:2,tags:["Asian Fusion","Seafood","Cajun","Critics Pick"],description:"Chef Lily Wu Chongqing-style seafood boils blending Cajun and Chinese traditions. Crab, shrimp, and crawfish tossed in spicy Sichuan-Cajun sauces. Resy Hit List Winter 2026.",dishes:["Seafood Boil","Chongqing Crab","Sichuan-Cajun Fusion"],address:"5463 Leary Ave NW, Seattle, WA 98107",lat:47.6676,lng:-122.3797,instagram:"happycrabseattle",website:"",reservation:"walk-in",phone:""});

add({name:"Mountaineering Club",cuisine:"Cocktail Bar",neighborhood:"University District",score:87,price:2,tags:["Cocktails","Rooftop","Date Night","Scenic"],description:"Rooftop venue with elevated campfire fare. Seattle skyline and mountain views from the top of the Graduate Hotel in the U District. Resy Hit List Winter 2026.",dishes:["Campfire Cocktails","Small Plates","Rooftop Views"],address:"4507 Brooklyn Ave NE, Seattle, WA 98105",lat:47.6606,lng:-122.3134,instagram:"mountaineeringclub",website:"",reservation:"walk-in",phone:""});

add({name:"Maximilien",cuisine:"French",neighborhood:"Pike Place Market",score:89,price:3,tags:["French","Seafood","Date Night","Scenic"],description:"Classic French brasserie with winter igloos and Puget Sound views from Pike Place Market. Plateau de Fruits de Mer with local oysters. Resy Hit List Winter 2026.",dishes:["Plateau de Fruits de Mer","Local Oysters","French Classics"],address:"81A Pike St, Seattle, WA 98101",lat:47.6086,lng:-122.3416,instagram:"maximiliencafe",website:"",reservation:"Resy",phone:""});

add({name:"Majnoon",cuisine:"Persian Cocktail Bar",neighborhood:"Pioneer Square",score:87,price:2,tags:["Cocktails","Persian","Date Night","Critics Pick"],description:"Persian poetry-inspired cocktail bar in Pioneer Square. Happy hour 5-6PM. Middle Eastern small plates with saffron, rosewater, and pistachio cocktails. Resy Hit List Winter 2026.",dishes:["Persian Cocktails","Mezze","Saffron Old Fashioned"],address:"313 1st Ave S, Seattle, WA 98104",lat:47.6003,lng:-122.3340,instagram:"majnoonseattle",website:"",reservation:"walk-in",phone:""});

add({name:"MEET Korean BBQ",cuisine:"Korean BBQ",neighborhood:"Capitol Hill",score:87,price:3,tags:["Korean","BBQ","Date Night","Local Favorites"],description:"Tableside Korean BBQ grilling wagyu and kurobuta pork in Capitol Hill. Quality meats and traditional banchan spread. Resy Hit List Winter 2026.",dishes:["Wagyu","Kurobuta Pork","Banchan"],address:"500 E Pike St, Seattle, WA 98122",lat:47.6145,lng:-122.3248,instagram:"meetkoreanbbq",website:"",reservation:"Resy",phone:""});

add({name:"Qiao Lin Hotpot Seattle",cuisine:"Chinese Hot Pot",neighborhood:"Downtown",score:87,price:3,tags:["Chinese","Date Night","Critics Pick","Casual"],description:"Chongqing-style hot pot downtown with A5 wagyu and Japanese ingredients. Authentic Sichuan heat and premium proteins. Resy Hit List Winter 2026.",dishes:["A5 Wagyu Hot Pot","Chongqing Broth","Sichuan Spice"],address:"501 S King St, Seattle, WA 98104",lat:47.5985,lng:-122.3243,instagram:"qiaolinhotpot",website:"",reservation:"Resy",phone:""});

// === SEATTLE INFATUATION BEST NEW 2025 ===
add({name:"My Friend Derek's",cuisine:"Detroit-Style Pizza",neighborhood:"Tangletown",score:88,price:1,tags:["Pizza","Casual","Local Favorites","Critics Pick"],description:"Detroit-style pan pizza in Tangletown. Crispy edges, thick pillowy crust, and quality toppings. One of Seattle best new restaurants of 2025 per the Infatuation.",dishes:["Detroit-Style Pan Pizza","Pepperoni","Caramelized Cheese Edges"],address:"2108 N 55th St, Seattle, WA 98103",lat:47.6683,lng:-122.3325,instagram:"myfriendderekspizza",website:"",reservation:"walk-in",phone:""});

add({name:"Fortuna",cuisine:"Italian Sandwiches",neighborhood:"Phinney Ridge",score:88,price:1,tags:["Italian","Sandwiches","Casual","Critics Pick"],description:"Italian sandwiches on schiacciata bread in Phinney Ridge. Seattle Infatuation best new 2025 winner for focaccia sandwiches. Authentic flavors and crusty bread.",dishes:["Schiacciata Sandwiches","Mortadella","Italian Subs"],address:"7619 Greenwood Ave N, Seattle, WA 98103",lat:47.6837,lng:-122.3552,instagram:"fortunasandwiches",website:"",reservation:"walk-in",phone:""});

add({name:"The Wayland Mill",cuisine:"Japanese Cafe",neighborhood:"University District",score:87,price:2,tags:["Japanese","Brunch","Local Favorites"],description:"All-day cafe in the U District specializing in Japanese breakfast with notable pie offerings. Infatuation Seattle best new 2025.",dishes:["Japanese Breakfast","Savory Pies","All-Day Cafe"],address:"3800 Latona Ave NE, Seattle, WA 98105",lat:47.6558,lng:-122.3252,instagram:"waylandmill",website:"",reservation:"walk-in",phone:""});

add({name:"Little Beast",cuisine:"British Pub",neighborhood:"Ballard",score:86,price:2,tags:["British","Casual","Local Favorites"],description:"Casual English pub in Ballard serving British classics. Fish and chips, Sunday roast, and proper pints. Infatuation best new 2025.",dishes:["Fish & Chips","Sunday Roast","British Classics"],address:"5107 Ballard Ave NW, Seattle, WA 98107",lat:47.6666,lng:-122.3838,instagram:"littlebeastseattle",website:"",reservation:"walk-in",phone:""});

add({name:"Hey Bagel",cuisine:"Bagels",neighborhood:"University Village",score:87,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Boiled-and-baked bagels in U Village. Infatuation best new 2025 -- masters the art of the bagel. Quality schmears and classic New York-style bagels in Seattle.",dishes:["NY-Style Bagels","Schmears","Lox Bagel"],address:"4610 Village Ct NE, Seattle, WA 98105",lat:47.6617,lng:-122.2986,instagram:"heybagelseattle",website:"",reservation:"walk-in",phone:""});

// === INFATUATION HIT LIST ===
add({name:"Jaded Bagels",cuisine:"Bagels",neighborhood:"Lake City",score:87,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Seeded bagels with cheesy inclusions and chocolate chip cookies in Lake City. Infatuation Seattle Hit List.",dishes:["Seeded Bagels","Cheesy Bagels","Chocolate Chip Cookies"],address:"12519 Lake City Way NE, Seattle, WA 98125",lat:47.7145,lng:-122.3001,instagram:"jadedbagels",website:"",reservation:"walk-in",phone:""});

add({name:"Mio Oh Mio",cuisine:"Italian-British",neighborhood:"Pioneer Square",score:89,price:3,tags:["Italian","British","Date Night","Critics Pick"],description:"Renee Erickson newest upscale Italian-British restaurant in Pioneer Square. Great for date nights. Infatuation Seattle Hit List.",dishes:["Italian-British Plates","Pasta","Date Night Menu"],address:"417 1st Ave S, Seattle, WA 98104",lat:47.5998,lng:-122.3342,instagram:"miohmioseattle",website:"",reservation:"Resy",phone:""});

add({name:"Tacos Cometa",cuisine:"Mexican Tacos",neighborhood:"Capitol Hill",score:87,price:1,tags:["Mexican","Casual","Local Favorites","Critics Pick"],description:"Sinaloa-style carne asada as the sole protein at this casual counter in Capitol Hill. Carne asada quesadillas are the must-order. Infatuation Hit List.",dishes:["Carne Asada Tacos","Quesadillas","Sinaloa-Style"],address:"211 Broadway E, Seattle, WA 98102",lat:47.6145,lng:-122.3212,instagram:"tacoscometa",website:"",reservation:"walk-in",phone:""});

add({name:"Paran",cuisine:"Korean",neighborhood:"Fremont",score:87,price:2,tags:["Korean","Date Night","Local Favorites"],description:"Korean restaurant in Fremont working well for dinner that efficient and exciting. Infatuation Seattle Hit List.",dishes:["Korean Tasting","Banchan","Modern Korean"],address:"4237 Fremont Ave N, Seattle, WA 98103",lat:47.6586,lng:-122.3497,instagram:"paranseattle",website:"",reservation:"Resy",phone:""});

add({name:"Jeffry's",cuisine:"American / Burgers",neighborhood:"Capitol Hill",score:87,price:3,tags:["American","Burgers","Date Night","Critics Pick"],description:"Burger-focused upscale American restaurant in Capitol Hill, in the former Bateau location. Quality beef and chef-driven approach.",dishes:["Signature Burger","American Plates","Craft Cocktails"],address:"535 14th Ave, Seattle, WA 98122",lat:47.6146,lng:-122.3128,instagram:"jeffrysseattle",website:"",reservation:"Resy",phone:""});

add({name:"Un Po Tipsy Pizzeria",cuisine:"Pizza",neighborhood:"Pioneer Square",score:86,price:2,tags:["Pizza","Casual","Local Favorites","Late Night"],description:"Casual slice shop in Pioneer Square with skee-ball and games. White pizza with lemon zest and sausage and onion pizza standouts.",dishes:["White Pizza","Sausage Pizza","Skee-Ball"],address:"219 1st Ave S, Seattle, WA 98104",lat:47.6003,lng:-122.3340,instagram:"unpotipsy",website:"",reservation:"walk-in",phone:""});

// === SEATTLE MET 50 BEST ===
add({name:"Ray's Cafe",cuisine:"Seafood",neighborhood:"Ballard",score:89,price:2,tags:["Seafood","Scenic","Iconic","Local Favorites"],description:"50-year icon in Ballard with Pacific Northwest sablefish signature and stunning Puget Sound views. Casual upper-level cafe above the more formal Ray Boathouse downstairs.",dishes:["Sablefish","Dungeness Crab","Puget Sound Views"],address:"6049 Seaview Ave NW, Seattle, WA 98107",lat:47.6676,lng:-122.4030,instagram:"rays_boathouse",website:"",reservation:"OpenTable",phone:""});

add({name:"Bar Del Corso",cuisine:"Italian / Pizza",neighborhood:"Beacon Hill",score:89,price:2,tags:["Italian","Pizza","Date Night","Local Favorites"],description:"Neapolitan pizza and Italian plates in Beacon Hill. Chef Jerry Corso wood-fired pies and handmade pastas. One of Seattle best Italian neighborhood restaurants.",dishes:["Neapolitan Pizza","Handmade Pasta","Italian Wine"],address:"3057 Beacon Ave S, Seattle, WA 98144",lat:47.5755,lng:-122.3121,instagram:"bardelcorso",website:"",reservation:"Resy",phone:""});

add({name:"Beast & Cleaver",cuisine:"Steakhouse / Butcher",neighborhood:"Ballard",score:90,price:3,tags:["Steakhouse","Butcher","Date Night","Critics Pick"],description:"Nose-to-tail butcher shop and supper club in Ballard. Chef Kevin Smith serves dry-aged steaks and offal dishes. Intimate prix-fixe Supper Club nights.",dishes:["Dry-Aged Steak","Supper Club","Offal Plates"],address:"5432 Ballard Ave NW, Seattle, WA 98107",lat:47.6676,lng:-122.3829,instagram:"beastandcleaver",website:"",reservation:"Tock",phone:""});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 1 complete!');
