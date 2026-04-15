// Austin Expansion Batch 2 — Eater 38, Tastemakers, SoCo, East Austin, Food Trucks
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const austinMarker = 'const AUSTIN_DATA=';
const austinPos = html.indexOf(austinMarker);
if (austinPos === -1) { console.error('AUSTIN_DATA not found!'); process.exit(1); }
const arrS = html.indexOf('[', austinPos);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Austin:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// === EATER 38 ESSENTIAL ADDITIONS (Spring 2025) ===

add({name:"Intero",cuisine:"Italian",neighborhood:"East Austin",score:89,price:3,tags:["Italian","Fine Dining","Date Night","Critics Pick"],description:"Italian restaurant added to Eater 38 essential Austin list in spring 2025. Handmade pasta, house-cured meats, and Italian technique with Texas ingredients.",dishes:["Handmade Pasta","House-Cured Meats","Italian Wine"],address:"2612 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2551,lng:-97.7186,instagram:"interorestaurant",website:"",reservation:"Resy",phone:""});

add({name:"Red Ash",cuisine:"Italian Grill",neighborhood:"Downtown",score:88,price:3,tags:["Italian","Steakhouse","Date Night","Fine Dining"],description:"Italian grill added to Eater 38 essential Austin list in spring 2025. Wood-grilled steaks and Italian classics in a sophisticated downtown setting.",dishes:["Wood-Grilled Steak","Italian Classics","Handmade Pasta"],address:"303 Colorado St, Austin, TX 78701",hours:"",lat:30.2651,lng:-97.7446,instagram:"redashaustin",website:"",reservation:"OpenTable",phone:""});

add({name:"Épicerie",cuisine:"French Bakery & Bistro",neighborhood:"East Austin",score:87,price:2,tags:["French","Bakery/Coffee","Brunch","Local Favorites"],description:"Bakery and bistro added to Eater 38 essential Austin list in spring 2025. French pastries, sandwiches, and bistro fare in an East Austin neighborhood setting.",dishes:["French Pastries","Bistro Lunch","Weekend Brunch"],address:"2307 Hancock Dr, Austin, TX 78756",hours:"",lat:30.3064,lng:-97.7284,instagram:"epicerieaustin",website:"",reservation:"walk-in",phone:""});

add({name:"Uchiko",cuisine:"Japanese / Sushi",neighborhood:"North Lamar",score:91,price:3,tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick"],description:"Sushi classic added to Eater 38 in spring 2025. Tyson Cole farmhouse-style Japanese with creative sushi and hot dishes. Sister restaurant to Uchi. Michelin recognized.",dishes:["Omakase","Creative Sushi","Japanese Hot Dishes"],address:"4200 N Lamar Blvd, Austin, TX 78756",hours:"",lat:30.3145,lng:-97.7408,instagram:"uchiko_austin",website:"https://www.uchirestaurants.com/uchiko",reservation:"Resy",phone:"(512) 916-4808"});

// === TASTEMAKER AWARDS 2026 NOMINEES ===

add({name:"Fonda San Miguel",cuisine:"Mexican",neighborhood:"North Central",score:89,price:3,tags:["Mexican","Fine Dining","Date Night","Celebrations","Iconic"],description:"Tastemaker Awards 2026 nominee for Austin Restaurant of the Year. Interior Mexican cuisine in a gorgeous hacienda setting since 1975. The Sunday brunch buffet is legendary.",dishes:["Interior Mexican","Sunday Brunch Buffet","Mole"],address:"2330 W North Loop Blvd, Austin, TX 78756",hours:"",lat:30.3190,lng:-97.7451,instagram:"fondasanmiguel",website:"https://www.fondasanmiguel.com",reservation:"OpenTable",phone:"(512) 459-4121"});

add({name:"Fukumoto",cuisine:"Japanese",neighborhood:"East Austin",score:89,price:3,tags:["Japanese","Fine Dining","Date Night","Critics Pick"],description:"Tastemaker Awards 2026 nominee. Japanese omakase and izakaya in East Austin. Intimate counter dining with pristine fish and creative Japanese dishes.",dishes:["Omakase","Izakaya Plates","Sake Selection"],address:"514 Medina St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7278,instagram:"fukumotoaustin",website:"",reservation:"Resy",phone:""});

add({name:"Lao'd Bar",cuisine:"Laotian / Thai",neighborhood:"East Austin",score:87,price:1,tags:["Laotian","Thai","Local Favorites","Casual"],description:"Tastemaker Awards 2026 nominee. Laotian and Thai street food in a fun East Austin setting. Bold flavors and generous portions at great prices.",dishes:["Laotian Street Food","Larb","Sticky Rice"],address:"1501 E 7th St, Austin, TX 78702",hours:"",lat:30.2638,lng:-97.7258,instagram:"laodbar",website:"",reservation:"walk-in",phone:""});

add({name:"LeRoy and Lewis Barbecue",cuisine:"BBQ",neighborhood:"South Austin",score:90,price:2,tags:["BBQ","Local Favorites","Critics Pick"],description:"Tastemaker Awards 2026 nominee. Massive menu of smoked meats with creative preparations. Michelin recognized. Infatuation top 25. One of Austin most innovative BBQ operations.",dishes:["Smoked Brisket","Creative BBQ","Seasonal Specials"],address:"121 Pickle Rd, Austin, TX 78704",hours:"",lat:30.2382,lng:-97.7697,instagram:"leroyandlewis",website:"",reservation:"walk-in",phone:""});

// === SOUTH CONGRESS / ICONIC AUSTIN ===

add({name:"Aba Austin",cuisine:"Mediterranean",neighborhood:"South Congress",score:88,price:2,tags:["Mediterranean","Date Night","Patio","Local Favorites"],description:"Mediterranean cuisine on South Congress Music Lane. Multi-level outdoor patio and terrace under a 100+ year old Heritage Oak tree. One of the most talked about restaurants on SoCo.",dishes:["Hummus","Shakshuka","Mediterranean Mezze"],address:"1011 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2500,lng:-97.7495,instagram:"abarestaurants",website:"",reservation:"Resy",phone:""});

add({name:"Lucky Robot",cuisine:"Sushi / Asian",neighborhood:"South Congress",score:87,price:2,tags:["Japanese","Sushi","Sustainable","Local Favorites"],description:"Austin staple on South Congress focused on sustainable seafood. The chef has earned James Beard Foundation recognition. Creative sushi and Asian fusion.",dishes:["Sustainable Sushi","Asian Fusion","Craft Cocktails"],address:"1303 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2473,lng:-97.7498,instagram:"luckyrobotaustin",website:"",reservation:"Resy",phone:""});

add({name:"Jo's Coffee",cuisine:"Coffee",neighborhood:"South Congress",score:85,price:1,tags:["Bakery/Coffee","Iconic","Local Favorites"],description:"Home of the iconic 'I Love You So Much' mural on South Congress. Coffee, breakfast tacos, and people-watching make this an Austin essential stop.",dishes:["Coffee","Breakfast Tacos","Iced Turbo"],address:"1300 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2475,lng:-97.7496,instagram:"joscoffee",website:"https://www.joscoffee.com",reservation:"walk-in",phone:""});

add({name:"Veracruz All Natural",cuisine:"Mexican / Breakfast Tacos",neighborhood:"Multiple Locations",score:88,price:1,tags:["Mexican","Brunch","Local Favorites","Casual","Iconic"],description:"The breakfast taco that Austin runs on. Migas tacos with free-range eggs, fresh tortillas, and vibrant salsas. Multiple locations including East Austin and Mueller.",dishes:["Migas Taco","Breakfast Tacos","Fresh Salsa"],address:"1704 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7259,instagram:"veracruzallnatural",website:"",reservation:"walk-in",phone:""});

add({name:"Dee Dee",cuisine:"Northern Thai",neighborhood:"East Austin",score:87,price:1,tags:["Thai","Local Favorites","Casual"],description:"Northern Thai food truck turned Austin institution. Khao soi, boat noodles, and northern Thai curries with authentic flavors. Now part of Leona Botanical compound.",dishes:["Khao Soi","Boat Noodles","Thai Curry"],address:"2009 Manor Rd, Austin, TX 78722",hours:"",lat:30.2809,lng:-97.7210,instagram:"deedeeatx",website:"",reservation:"walk-in",phone:""});

add({name:"El Marisquero",cuisine:"Mexican Seafood",neighborhood:"East Austin",score:87,price:1,tags:["Mexican","Seafood","Local Favorites","Casual"],description:"Best aguachiles in Austin from this food truck. Excellent ceviche and massive fish tacos. Fresh, bold Mexican seafood at food truck prices.",dishes:["Aguachile","Ceviche","Fish Tacos"],address:"1911 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7237,instagram:"elmarisqueroatx",website:"",reservation:"walk-in",phone:""});

// === MORE ESSENTIAL AUSTIN ===

add({name:"Uchi",cuisine:"Japanese / Sushi",neighborhood:"South Lamar",score:92,price:4,tags:["Japanese","Sushi","Fine Dining","Exclusive","Date Night","Critics Pick"],description:"Tyson Cole flagship Japanese restaurant that put Austin on the national dining map. Creative sushi and Japanese-inspired cuisine. James Beard Award winner. The original.",dishes:["Omakase","Creative Sushi","Hot Tastings"],address:"801 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2549,lng:-97.7657,instagram:"uchiaustin",website:"https://www.uchirestaurants.com",reservation:"Resy",phone:"(512) 916-4808"});

add({name:"Launderette",cuisine:"New American",neighborhood:"East Austin",score:88,price:2,tags:["New American","Brunch","Date Night","Local Favorites"],description:"New American in a converted laundromat in East Austin. Creative brunch and dinner with a focus on fresh ingredients. The brunch is one of the best in the city.",dishes:["Brunch Plates","Seasonal Dinner","Pastries"],address:"2115 Holly St, Austin, TX 78702",hours:"",lat:30.2618,lng:-97.7229,instagram:"launderetteatx",website:"",reservation:"Resy",phone:""});

add({name:"Fresa's",cuisine:"Mexican / Wood-Grilled",neighborhood:"South 1st",score:87,price:1,tags:["Mexican","Casual","Local Favorites","Patio"],description:"Wood-grilled chicken and Mexican fare on South 1st. The charcoal-grilled chicken is the star, the patio is lively, and the margaritas are strong. Multiple locations.",dishes:["Wood-Grilled Chicken","Tacos","Margaritas"],address:"1703 S 1st St, Austin, TX 78704",hours:"",lat:30.2468,lng:-97.7557,instagram:"fresaschicken",website:"",reservation:"walk-in",phone:""});

add({name:"Elizabeth Street Cafe",cuisine:"Vietnamese / French Bakery",neighborhood:"South 1st",score:87,price:1,tags:["Vietnamese","French","Bakery/Coffee","Brunch","Local Favorites"],description:"Vietnamese-French fusion bakery and cafe on South 1st. Beautiful pastries, excellent pho, and banh mi in a gorgeous space. The macarons are exceptional.",dishes:["Pho","Banh Mi","French Macarons"],address:"1501 S 1st St, Austin, TX 78704",hours:"",lat:30.2488,lng:-97.7557,instagram:"elizabethstreetcafe",website:"",reservation:"walk-in",phone:""});

add({name:"Loro",cuisine:"Asian-BBQ Fusion",neighborhood:"South Lamar",score:88,price:2,tags:["BBQ","Asian Fusion","Patio","Local Favorites"],description:"Aaron Franklin and Tyson Cole collaboration fusing Texas BBQ with Asian flavors. Smoked brisket with Thai herbs, coconut rice, and massive patio. An Austin essential.",dishes:["Brisket with Thai Herbs","Coconut Rice","Smoked Salmon"],address:"2115 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2413,lng:-97.7714,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"Salty Sow",cuisine:"New American / Gastropub",neighborhood:"East Austin",score:87,price:2,tags:["New American","Gastropub","Brunch","Date Night","Patio"],description:"Neighborhood gastropub in East Austin with a huge patio and pig-focused menu. Deviled eggs, pork belly, and creative cocktails. Great for brunch and dinner.",dishes:["Deviled Eggs","Pork Belly","Gastropub Fare"],address:"1917 Manor Rd, Austin, TX 78722",hours:"",lat:30.2810,lng:-97.7222,instagram:"saltysow",website:"",reservation:"OpenTable",phone:""});

add({name:"Mattie's",cuisine:"Southern / American",neighborhood:"South Congress",score:87,price:2,tags:["Southern","Date Night","Patio","Celebrations"],description:"Southern-inspired dining in a stunning 1899 Victorian farmhouse on South Congress. The porch dining is romantic and the fried chicken is excellent. Great for special occasions.",dishes:["Fried Chicken","Southern Plates","Porch Cocktails"],address:"811 W Live Oak St, Austin, TX 78704",hours:"",lat:30.2538,lng:-97.7508,instagram:"mattiesaustin",website:"",reservation:"Resy",phone:""});

add({name:"Justine's Brasserie",cuisine:"French Brasserie",neighborhood:"East Austin",score:88,price:2,tags:["French","Date Night","Late Night","Local Favorites"],description:"Late-night French brasserie in East Austin with steak frites, escargot, and natural wine. The patio is magical and the late-night kitchen makes this an Austin date night legend.",dishes:["Steak Frites","Escargot","Late-Night Menu"],address:"4710 E 5th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7046,instagram:"justinesbrasserie",website:"",reservation:"Resy",phone:""});

add({name:"Oseyo",cuisine:"Korean Fine Dining",neighborhood:"East Austin",score:89,price:3,tags:["Korean","Fine Dining","Date Night","Critics Pick"],description:"Fine-dining Korean in East Austin with creative tasting menus that blend Korean tradition with Texas ingredients. One of Austin most exciting newer fine dining spots.",dishes:["Korean Tasting Menu","Creative Banchan","Korean-Texan Fusion"],address:"2009 Manor Rd, Austin, TX 78722",hours:"",lat:30.2809,lng:-97.7210,instagram:"oseyoaustin",website:"",reservation:"Resy",phone:""});

add({name:"Siti",cuisine:"Mediterranean / Fine Dining",neighborhood:"Downtown",score:88,price:3,tags:["Mediterranean","Fine Dining","Date Night","Critics Pick"],description:"2026 Tastemaker Chef of the Year nominee. Chic interior and artsy plating with Mediterranean-inspired dishes. One of Austin newest upscale dining destinations.",dishes:["Mediterranean Tasting","Artful Plates","Wine Pairing"],address:"310 Colorado St, Austin, TX 78701",hours:"",lat:30.2654,lng:-97.7445,instagram:"sitiaustin",website:"",reservation:"Resy",phone:""});

add({name:"Old Alley Hot Pot",cuisine:"Sichuan Hot Pot",neighborhood:"North Austin",score:86,price:2,tags:["Chinese","Sichuan","Local Favorites","Casual"],description:"Sichuan-style hot pot restaurant in North Austin from the Infatuation hit list. Build your own pot with quality ingredients and multiple spice levels.",dishes:["Sichuan Hot Pot","Build Your Own","Chinese Sides"],address:"2700 W Anderson Ln, Austin, TX 78757",hours:"",lat:30.3582,lng:-97.7420,instagram:"oldalleyhotpot",website:"",reservation:"walk-in",phone:""});

add({name:"Tzintzuntzan",cuisine:"Mexican",neighborhood:"North Loop",score:87,price:1,tags:["Mexican","Brunch","Local Favorites","Casual"],description:"Daytime spot from the owner of Fonda San Miguel in North Loop. Infatuation hit list. Casual Mexican with quality ingredients and the Fonda San Miguel pedigree.",dishes:["Breakfast Tacos","Chilaquiles","Mexican Brunch"],address:"5209 Airport Blvd, Austin, TX 78751",hours:"",lat:30.3150,lng:-97.7136,instagram:"tzintzuntzanatx",website:"",reservation:"walk-in",phone:""});

add({name:"Desnudo Coffee",cuisine:"Coffee",neighborhood:"Downtown",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Stellar coffee trailer on Congress Ave downtown. Infatuation hit list. Perfect espresso and cold brew from this tiny but mighty trailer. An Austin morning ritual.",dishes:["Espresso","Cold Brew","Simple Menu"],address:"501 Congress Ave, Austin, TX 78701",hours:"",lat:30.2668,lng:-97.7429,instagram:"desnudocoffee",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new Austin spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin batch 2 complete!');
