// Seattle Batch 10 — Rounding out with more verified spots
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

add({name:"The Whale Wins",cuisine:"New American / Wood-Fired",neighborhood:"Fremont",score:91,price:3,tags:["New American","Date Night","Critics Pick","Local Favorites"],description:"James Beard Award-winning chef Renee Erickson's wood-fired café on Stone Way. Features the best foods from local beaches, gardens, and farms. All-day table service in a bright, charming space.",dishes:["Wood-Fired Seafood","Seasonal Vegetables","Natural Wine"],address:"3506 Stone Way N, Seattle, WA 98103",lat:47.6502,lng:-122.3422,instagram:"thewhalewins",website:"https://thewhalewins.com",reservation:"Resy",phone:"(206) 632-9425",group:"Sea Creatures"});

add({name:"Tamarind Tree",cuisine:"Vietnamese",neighborhood:"Chinatown-International District",score:89,price:2,tags:["Vietnamese","Date Night","Local Favorites","Critics Pick"],description:"Provincial Vietnamese restaurant in the International District, tucked into a courtyard off South Jackson. Regional Vietnamese dishes beyond the typical pho — salty-sweet, herbaceous, and deeply traditional.",dishes:["Seven Courses of Beef","Banana Blossom Salad","Vietnamese Crepes"],address:"1036 S Jackson St, Seattle, WA 98104",lat:47.5991,lng:-122.3180,instagram:"tamarindtreeseattle",website:"https://tamarindtreerestaurant.com",reservation:"OpenTable",phone:"(206) 860-1404",hours:"Daily 11AM-9PM"});

add({name:"Mashiko",cuisine:"Japanese / Sushi",neighborhood:"West Seattle",score:89,price:3,tags:["Japanese","Sushi","Date Night","Local Favorites","Critics Pick"],description:"West Seattle Junction's pioneering sustainable sushi restaurant — committed to only sustainable seafood since 2009. 2024 James Beard semifinalist. Omakase and à la carte with conscientious sourcing.",dishes:["Sustainable Sushi","Omakase","Nigiri"],address:"4725 California Ave SW, Seattle, WA 98116",lat:47.5609,lng:-122.3864,instagram:"mashikorestaurant",website:"https://www.mashikorestaurant.com",reservation:"Tock",phone:"(206) 935-4339"});

add({name:"Aerlume",cuisine:"Pacific Northwest",neighborhood:"Downtown Waterfront",score:88,price:3,tags:["New American","Date Night","Scenic","Local Favorites"],description:"Perched on the hillside above Elliott Bay, steps from Pike Place Market. Pacific Northwest cuisine with sweeping waterfront views. Fire & Vine Hospitality. Great for sunset dinners.",dishes:["PNW Seafood","Wood-Grilled","Sunset Views"],address:"2003 Western Ave Ste C, Seattle, WA 98121",lat:47.6108,lng:-122.3429,instagram:"aerlumeseattle",website:"https://aerlumeseattle.com",reservation:"OpenTable",phone:"(206) 539-2200"});

add({name:"Lark",cuisine:"New American",neighborhood:"Capitol Hill",score:92,price:4,tags:["New American","Fine Dining","Date Night","Critics Pick","Iconic","Celebrations"],description:"Chef John Sundstrom's beloved Capitol Hill fine-dining destination for 20 years. James Beard Award-winning New American cuisine celebrating Pacific Northwest bounty in a luxurious, comfortable atmosphere.",dishes:["Tasting Menu","Seasonal Menu","PNW Bounty"],address:"952 E Seneca St, Seattle, WA 98122",lat:47.6097,lng:-122.3206,instagram:"larkseattle",website:"https://www.larkseattle.com",reservation:"OpenTable",phone:"(206) 323-5275",awards:"James Beard Award"});

add({name:"Frelard Tamales",cuisine:"Mexican",neighborhood:"Fremont",score:88,price:1,tags:["Mexican","Casual","Local Favorites","Critics Pick"],description:"Family and queer-owned Mexican restaurant specializing in handmade tamales. Expanded from a Green Lake walk-up window to a full Fremont brick-and-mortar in 2024. Verde chicken tamal is the standout.",dishes:["Verde Chicken Tamal","Pork Tamales","Mexican Sodas"],address:"106 N 36th St, Seattle, WA 98103",lat:47.6518,lng:-122.3551,instagram:"frelardtamales",website:"https://www.frelardtamales.com",reservation:"walk-in",phone:"(206) 523-6654",hours:"Daily 11AM-10PM"});

add({name:"Cortina",cuisine:"Italian",neighborhood:"Downtown",score:89,price:3,tags:["Italian","Date Night","Local Favorites"],description:"Ethan Stowell's refined yet approachable Italian restaurant in Two Union Square. House-made pasta and craft cocktails in the heart of downtown. Perfect for business dinners and date nights.",dishes:["House-Made Pasta","Craft Cocktails","Italian Classics"],address:"621 Union St, Seattle, WA 98101",lat:47.6105,lng:-122.3328,instagram:"ethanstowellrestaurants",website:"https://ethanstowellrestaurants.com/restaurants/cortina-union-square-seattle",reservation:"OpenTable",phone:"(206) 736-7888",group:"Ethan Stowell Restaurants"});

add({name:"Ba Bar",cuisine:"Vietnamese",neighborhood:"Capitol Hill",score:88,price:2,tags:["Vietnamese","Late Night","Local Favorites","Casual"],description:"Capitol Hill Vietnamese from Sophie and Eric Banh inspired by Saigon street food. Some of the best pho in town and a top selection of high-end spirits. Open late for post-party noodles.",dishes:["Pho","Banh Mi","Cocktails"],address:"550 12th Ave, Seattle, WA 98122",lat:47.6094,lng:-122.3173,instagram:"babarseattle",website:"https://www.babarseattle.com",reservation:"walk-in",phone:"(206) 328-2030"});

add({name:"Copine",cuisine:"French / New American",neighborhood:"Ballard",score:92,price:4,tags:["French","New American","Fine Dining","Date Night","Critics Pick","Celebrations"],description:"Elegant American-French spot in Ballard/Interbay. Chef Shaun McCrain offers a 4-course prix fixe menu marrying the current season with classical French techniques. Yelp Top 20 US Restaurants.",dishes:["4-Course Prix Fixe","French Classics","Seasonal Menu"],address:"6460 24th Ave NW, Seattle, WA 98107",lat:47.6761,lng:-122.3856,instagram:"copineseattle",website:"https://www.copineseattle.com",reservation:"Tock",phone:"(206) 258-2467"});

add({name:"The Harvest Vine",cuisine:"Spanish / Basque",neighborhood:"Madison Valley",score:90,price:3,tags:["Spanish","Date Night","Local Favorites","Critics Pick"],description:"Madison Valley neighborhood restaurant specializing in upscale Spanish and Basque tapas. Intimate, cozy setting with traditional Basque cuisine and quality ingredients. A Seattle favorite for over 20 years.",dishes:["Basque Tapas","Spanish Wines","Pintxos"],address:"2701 E Madison St, Seattle, WA 98112",lat:47.6331,lng:-122.3000,instagram:"theharvestvine",website:"https://www.harvestvine.com",reservation:"OpenTable",phone:"(206) 320-9771"});

add({name:"Rachel's Ginger Beer",cuisine:"Ginger Beer / Casual",neighborhood:"Pike Place Market",score:87,price:1,tags:["Casual","Local Favorites","Iconic","Tourist Essential"],description:"Handcrafted fresh ginger beer shop in Post Alley at Pike Place Market. Seattle original with creative ginger beer flavors, floats, and spiked versions. Bright storefront essential for market visits.",dishes:["Fresh Ginger Beer","Ginger Beer Floats","Spiked Mules"],address:"1530 Post Aly, Seattle, WA 98101",lat:47.6093,lng:-122.3416,instagram:"rachelsgingerbeer",website:"https://rachelsgingerbeer.com",reservation:"walk-in",phone:"(206) 467-4924"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 10 complete!');
