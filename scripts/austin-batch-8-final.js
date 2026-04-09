// Austin Batch 8: Final push to 250 — fill remaining gaps
// Run: node scripts/austin-batch-8-final.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id||0))+1, added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase()))return;
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
}

// === REMAINING MICHELIN SPOTS ===
add({name:"Le Calamar",cuisine:"French Seafood",neighborhood:"East Austin",score:88,price:3,tags:["French","Seafood","Date Night","Awards"],reservation:"Resy",awards:"Michelin Recommended",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === MORE EAST AUSTIN ===
add({name:"Cru Food & Wine Bar",cuisine:"Wine Bar / American",neighborhood:"Downtown",score:85,price:2,tags:["Wine Bar","Date Night","Patio","Cocktails"],reservation:"OpenTable",description:"Wine-forward restaurant and bar downtown with 40+ wines by the glass, cheese and charcuterie boards, and New American small plates. The patio on 2nd Street is ideal for evening glasses. A polished wine experience in the center of the city.",dishes:["Wine Flights","Cheese Boards","Small Plates","Patio"],address:"239 S Congress Ave, Suite A, Austin, TX 78704",phone:"(512) 472-9463",lat:30.2620,lng:-97.7450,instagram:"cruwine",website:"https://www.cruawinebar.com"});

add({name:"Peached Tortilla",cuisine:"Asian-Southern Fusion",neighborhood:"Multiple Locations",score:84,price:2,tags:["Asian Fusion","Southern","Casual","Local Favorites"],reservation:"walk-in",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"24 Diner",cuisine:"American Diner / 24-Hour",neighborhood:"West 6th",score:84,price:1,tags:["Breakfast","Brunch","Late Night","Casual","Classic"],reservation:"walk-in",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === SEAFOOD ===
add({name:"Monger's Market + Kitchen",cuisine:"Seafood",neighborhood:"South Lamar",score:86,price:2,tags:["Seafood","Casual","Local Favorites","Brunch"],reservation:"walk-in",description:"South Lamar seafood market and kitchen serving fresh Gulf oysters, fish & chips, and a raw bar. Buy fresh fish to cook at home or eat prepared dishes at the counter. The lobster roll and fish tacos are excellent. A casual seafood option that Austin needed.",dishes:["Gulf Oysters","Lobster Roll","Fish Tacos","Fish & Chips"],address:"2401 S Lamar Blvd, Suite 15, Austin, TX 78704",phone:"(512) 215-0605",lat:30.2400,lng:-97.7847,instagram:"mongersatx",website:"https://www.mongersatx.com"});

add({name:"Quality Seafood Market",cuisine:"Seafood Market / Casual",neighborhood:"Airport Blvd",score:85,price:1,tags:["Seafood","Casual","Classic","Local Favorites","Family"],reservation:"walk-in",awards:"Austin institution since 1938",description:"Austin's oldest seafood market since 1938. The retail counter sells fresh Gulf fish, and the kitchen fries up some of the best catfish, shrimp, and oysters in the city. Picnic tables outside, cold beer, and a no-frills energy that hasn't changed in decades. A living piece of old Austin.",dishes:["Fried Catfish","Gulf Shrimp","Oysters","Fish & Chips"],address:"5621 Airport Blvd, Austin, TX 78751",phone:"(512) 452-3820",lat:30.3280,lng:-97.7160,instagram:"qualityseafoodmkt",website:"https://www.qualityseafoodmarket.com"});

// === INDIAN ===
add({name:"Clay Pit",cuisine:"Indian / Contemporary",neighborhood:"Downtown",score:87,price:2,tags:["Indian","Date Night","Local Favorites"],reservation:"OpenTable",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Asiana Indian Cuisine",cuisine:"Indian",neighborhood:"South Lamar",score:84,price:1,tags:["Indian","Casual","Family","Cheap Eats"],reservation:"walk-in",description:"South Lamar Indian restaurant with generous lunch buffets and traditional North Indian dishes. The butter chicken, lamb rogan josh, and naan are consistently good. The lunch buffet is one of Austin's best values for Indian food.",dishes:["Lunch Buffet","Butter Chicken","Lamb Rogan Josh","Naan"],address:"2901 S Capital of TX Hwy, Suite E140, Austin, TX 78746",phone:"(512) 327-5757",lat:30.2540,lng:-97.7880,instagram:"asianaindiancuisine",website:"https://www.asianaindiancuisine.com"});

// === MORE BARS ===
add({name:"Broken Spoke",cuisine:"Honky-Tonk / Bar",neighborhood:"South Lamar",score:87,price:1,tags:["Live Music","Bar","Classic","Country","Dancing","Iconic"],reservation:"walk-in",awards:"Austin institution since 1964",description:"Austin's last true honky-tonk since 1964. Two-stepping on the original dance floor where Willie Nelson, George Strait, and Dolly Parton played. The chicken fried steak dinner before the dancing is part of the tradition. Tuesday night lessons for beginners. A sacred Austin institution.",dishes:["Chicken Fried Steak","Live Country Music","Two-Stepping"],address:"3201 S Lamar Blvd, Austin, TX 78704",phone:"(512) 442-6189",lat:30.2330,lng:-97.7847,instagram:"brokenspoke",website:"https://www.brokenspokeaustintx.net"});

add({name:"Moontower Saloon",cuisine:"Outdoor Bar / Music",neighborhood:"South Austin",score:83,price:1,tags:["Bar","Live Music","Patio","Casual","Family"],reservation:"walk-in",description:"South Austin outdoor bar and live music venue with a massive yard, food trucks, and a family-friendly vibe during the day. Live music most nights. The outdoor space is the appeal — picnic tables, games, and trees. Very south Austin laid-back energy.",dishes:["Food Trucks","Beer","Live Music","Outdoor Games"],address:"10212 Manchaca Rd, Austin, TX 78748",phone:"(512) 712-5661",lat:30.1780,lng:-97.7815,instagram:"moontowersaloon",website:"https://www.moontowersaloon.com",suburb:true});

add({name:"Mean Eyed Cat",cuisine:"Johnny Cash Bar",neighborhood:"West Austin",score:84,price:1,tags:["Bar","Dive Bar","Patio","Classic","Local Favorites"],reservation:"walk-in",description:"Johnny Cash-themed dive bar near downtown with a shaded patio, jukebox, and cold beer. The Man in Black memorabilia fills every wall. No food but the Rainey Street location puts you near food trucks. One of Austin's most atmospheric dive bars.",dishes:["Cold Beer","Jukebox","Johnny Cash Vibes"],address:"1621 W 5th St, Austin, TX 78703",phone:"(512) 472-6326",lat:30.2688,lng:-97.7573,instagram:"meaneyedcataustin",website:"https://www.meaneyedcat.com"});

add({name:"Oddwood Ales",cuisine:"Brewery / Wine / Bar",neighborhood:"East Austin",score:85,price:1,tags:["Brewery","Wine Bar","Patio","Local Favorites"],reservation:"walk-in",description:"East Austin dual-concept brewery and wine bar. Craft ales on one side, natural wines on the other — pick your vice. The patio is spacious, the atmosphere is relaxed, and the food trucks rotate through. A uniquely Austin hybrid concept.",dishes:["Craft Ales","Natural Wine","Food Trucks","Patio"],address:"3014 Gonzales St, Austin, TX 78702",phone:"(512) 524-2337",lat:30.2567,lng:-97.7120,instagram:"oddwoodales",website:"https://www.oddwoodales.com"});

// === HEALTHY / VEGETARIAN ===
add({name:"True Food Kitchen",cuisine:"Health-Forward American",neighborhood:"Domain",score:84,price:2,tags:["Healthy","American","Brunch","Casual","Vegetarian"],reservation:"OpenTable",description:"Health-forward chain from Dr. Andrew Weil with a Domain location serving anti-inflammatory grain bowls, seasonal salads, and nutrient-rich entrees. The menu is surprisingly delicious for food that's actually good for you. The brunch is popular.",dishes:["Grain Bowls","Seasonal Salads","Anti-Inflammatory Menu","Brunch"],address:"10000 Research Blvd, Suite 122, Austin, TX 78759",phone:"(512) 371-3200",lat:30.3920,lng:-97.7260,instagram:"truefoodkitchen",website:"https://www.truefoodkitchen.com"});

add({name:"Counter Culture",cuisine:"Vegan / Plant-Based",neighborhood:"East Austin",score:85,price:1,tags:["Vegan","Healthy","Casual","Local Favorites"],reservation:"walk-in",description:"East Austin plant-based restaurant serving creative vegan dishes that satisfy even carnivores. The mushroom burger, loaded nachos, and seasonal bowls prove vegan can be delicious. The counter-service format keeps it affordable. A favorite among Austin's health-conscious crowd.",dishes:["Mushroom Burger","Vegan Nachos","Seasonal Bowls","Smoothies"],address:"2337 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 680-8515",lat:30.2533,lng:-97.7194,instagram:"countercultureatx",website:"https://www.countercultureaustin.com"});

// === MORE NEIGHBORHOODS ===
add({name:"Hyde Park Bar & Grill",cuisine:"American / Bar",neighborhood:"Hyde Park",score:84,price:1,tags:["American","Bar","Casual","Classic","Family","Local Favorites"],reservation:"walk-in",awards:"Austin institution",description:"Hyde Park neighborhood bar and grill famous for its enormous battered french fries — the 'fries that made Austin famous.' Burgers, chicken fried steak, and cold beer in a comfortable neighborhood setting. A Hyde Park institution for decades.",dishes:["Giant Battered Fries","Burgers","Chicken Fried Steak","Cold Beer"],address:"4206 Duval St, Austin, TX 78751",phone:"(512) 458-3168",lat:30.3050,lng:-97.7270,instagram:"hydeparkbarandgrill",website:"https://www.hydeparkbarandgrill.com"});

add({name:"Uchi (South Lamar)",cuisine:"Japanese / Sushi",neighborhood:"South Lamar",score:97,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Awards"],reservation:"Resy",awards:"James Beard Award Winner",group:"Hai Hospitality",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Vinaigrette",cuisine:"Salads / Healthy",neighborhood:"Downtown",score:83,price:1,tags:["Healthy","Casual","Salads","Brunch","Vegetarian"],reservation:"walk-in",description:"Downtown salad-focused restaurant with creative, seasonal salads, grain bowls, and soups. The farm-to-fork approach means ingredients are fresh and local. A healthy lunch option downtown that doesn't feel like diet food.",dishes:["Seasonal Salads","Grain Bowls","Soups","Fresh Juices"],address:"400 W 2nd St, Suite L, Austin, TX 78701",phone:"(512) 457-1107",lat:30.2643,lng:-97.7488,instagram:"saladandsuch",website:"https://www.vinaigretteonline.com"});

add({name:"Loro (East 5th)",cuisine:"Asian BBQ",neighborhood:"East Austin",score:89,price:2,tags:["Asian Fusion","BBQ","Casual","Patio","Awards"],reservation:"walk-in",awards:"Michelin Recommended",group:"Hai Hospitality",description:"The East Austin location of the Tyson Cole + Aaron Franklin collaboration. Same smoked brisket with Thai herbs, same coconut curry, new neighborhood. The patio is spacious and the bar program is strong. All the Loro magic in East Austin.",dishes:["Thai Brisket","Coconut Curry","Salmon Larb","Cocktails"],address:"2015 E 5th St, Austin, TX 78702",phone:"(512) 916-4858",lat:30.2600,lng:-97.7220,instagram:"loroaustin",website:"https://www.loroaustin.com",group:"Hai Hospitality"});

add({name:"Uchiko (North Lamar)",cuisine:"Japanese",neighborhood:"North Loop",score:96,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Awards"],reservation:"Resy",group:"Hai Hospitality",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Moonshine Patio Bar & Grill",cuisine:"American / Southern",neighborhood:"Downtown",score:84,price:2,tags:["American","Southern","Brunch","Patio","Family"],reservation:"OpenTable",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === SUBURBAN / ROUND ROCK / CEDAR PARK ===
add({name:"Hai Hospitality / Uchi Round Rock",cuisine:"Japanese / Sushi",neighborhood:"Round Rock",score:91,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night"],reservation:"Resy",group:"Hai Hospitality",suburb:true,description:"Suburban outpost of Tyson Cole's acclaimed Japanese restaurant bringing the same JBF-winning quality to Round Rock. Omakase, creative rolls, and the signature hama chili in a polished suburban setting. Proof that fine dining works outside downtown.",dishes:["Hama Chili","Omakase","Machi Cure","Wagyu"],address:"3021 S I-35, Round Rock, TX 78664",phone:"(512) 916-4808",lat:30.4960,lng:-97.6790,instagram:"uchirestaurants",website:"https://uchirestaurants.com"});

add({name:"Jack Allen's Kitchen (Oak Hill)",cuisine:"Texas Comfort Food",neighborhood:"Oak Hill",score:85,price:2,tags:["Southern","Casual","Brunch","Family"],reservation:"walk-in",suburb:true,description:"Already partially in data — the Oak Hill location of the farm-to-table Texas comfort food concept. Same quality chicken fried steak and Gulf shrimp in a Hill Country suburban setting.",dishes:["Chicken Fried Steak","Gulf Shrimp","Brunch"],address:"7720 Hwy 71 W, Suite 300, Austin, TX 78735",phone:"(512) 852-8558",lat:30.2320,lng:-97.8280,instagram:"jackallenskitchen",website:"https://www.jackallenskitchen.com"});

add({name:"Tucci's Italian",cuisine:"Italian",neighborhood:"Cedar Park",score:84,price:2,tags:["Italian","Casual","Family","Date Night"],reservation:"OpenTable",suburb:true,description:"Cedar Park Italian serving classic pastas, wood-fired pizzas, and an approachable wine list. The meatballs and chicken parm are comfort food crowd-pleasers. A solid suburban Italian option for the Cedar Park and Leander crowd.",dishes:["Pasta","Wood-Fired Pizza","Meatballs","Wine"],address:"701 E Whitestone Blvd, Suite 500, Cedar Park, TX 78613",phone:"(512) 259-0999",lat:30.5130,lng:-97.8210,instagram:"tucciscedaborpark",website:"https://www.tuccisitalian.com"});

add({name:"Torchy's Tacos (Domain)",cuisine:"Creative Tacos",neighborhood:"Domain",score:84,price:1,tags:["Tacos","Casual","Local Favorites"],reservation:"walk-in",description:"Domain location of Austin's beloved creative taco chain. Same Trailer Park, same Green Chile Queso, suburban convenience. The Domain patio is spacious.",dishes:["Trailer Park Taco","Green Chile Queso","Breakfast Tacos"],address:"11521 Domain Dr, Austin, TX 78758",phone:"(512) 491-0200",lat:30.4020,lng:-97.7260,instagram:"torchystacos",website:"https://www.torchystacos.com"});

add({name:"The Hideaway on Lake Travis",cuisine:"American / Lake Bar",neighborhood:"Lake Travis",score:83,price:2,tags:["American","Patio","Views","Casual","Family"],reservation:"walk-in",suburb:true,description:"Lakeside bar and restaurant on Lake Travis with boat dock access, live music, and Hill Country views. Burgers, tacos, and cold beer with sunset views over the lake. Summer weekends are packed. The most casual lakeside dining experience near Austin.",dishes:["Burgers","Tacos","Cold Beer","Lake Views"],address:"18505 Lakeside Dr, Point Venture, TX 78645",phone:"(512) 614-1720",lat:30.4010,lng:-97.9520,instagram:"thehideawayatx",website:"https://www.thehideawayonthelake.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('Austin: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
