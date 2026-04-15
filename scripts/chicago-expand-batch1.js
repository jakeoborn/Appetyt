// Chicago Expansion Batch 1 — ~15 verified restaurants
// Sources: Infatuation reviews, Timeout Chicago 2026, Resy 2025
// Each entry individually verified from source pages
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const chiMarker = "'Chicago':";
const chiIdx = html.indexOf(chiMarker, html.indexOf('CITY_DATA'));
const arrS = html.indexOf('[', chiIdx);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP (exists):', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// 1. Nadu — Infatuation 9.0, top-25 Chicago, South Indian
// Verified: address, phone, website from Infatuation review page
add({name:"Nadu",cuisine:"South Indian",neighborhood:"Lincoln Park",score:91,price:3,tags:["Indian","Critics Pick","Date Night","Local Favorites"],description:"South Indian restaurant in Lincoln Park rated 9.0 by the Infatuation -- the highest-rated Indian restaurant in Chicago. Features food from over 10 different regions of India with a five-course prix fixe at $55 and a la carte options. A new benchmark for Indian dining in the city.",dishes:["Dosa","Five-Course Prix Fixe","Regional Thali"],address:"2518 N Lincoln Ave, Chicago, IL 60614",hours:"",lat:41.9288,lng:-87.6484,instagram:"",website:"https://www.naduchicago.com",reservation:"Resy",phone:"(872) 315-2158"});

// 2. Pizz'Amici — Infatuation 9.1, highest-rated new restaurant 2025
// Verified: address, phone, website from Infatuation review page
add({name:"Pizz'Amici",cuisine:"Tavern-Style Pizza",neighborhood:"West Town",score:91,price:1,tags:["Pizza","Local Favorites","Casual","Critics Pick","Date Night"],description:"Tavern-style pizza in West Town rated 9.1 by the Infatuation -- the highest-rated new restaurant of 2025. Sets a new gold standard for tavern-style with an impressively thin and crackery crust with charred bottoms. Build-your-own pies plus meatballs and salads.",dishes:["Tavern-Style Pizza","Meatballs","Caesar Salad"],address:"1215 W Grand Ave, Chicago, IL 60642",hours:"",lat:41.8912,lng:-87.6592,instagram:"",website:"https://www.pizz-amici.com",reservation:"walk-in",phone:"(312) 285-2382"});

// 3. Obelix — Infatuation 9.1, from Le Bouchon team, French
// Verified: address, phone, website from Infatuation review page
add({name:"Obelix",cuisine:"French",neighborhood:"River North",score:91,price:3,tags:["French","Date Night","Celebrations","Critics Pick","Wine Bar"],description:"Upscale French restaurant in River North rated 9.1 by the Infatuation. From the team behind Bucktown staple Le Bouchon. Formal but not stuffy service with classic French technique. Great for date nights, special occasions, and drinking great wine.",dishes:["Steak Frites","Duck Confit","French Wine Selection"],address:"700 N Sedgwick St, Chicago, IL 60654",hours:"",lat:41.8944,lng:-87.6383,instagram:"",website:"https://www.obelixchicago.com",reservation:"Resy",phone:"(312) 877-5348"});

// 4. Maxwells Trading — Infatuation 9.0, West Loop fusion
// Verified: address, phone, website from Infatuation review page
add({name:"Maxwells Trading",cuisine:"American Fusion",neighborhood:"West Loop",score:90,price:2,tags:["New American","Date Night","Local Favorites","Critics Pick"],description:"West Loop restaurant rated 9.0 by the Infatuation serving everything from french onion dip to pasta to clay pot rice. Blends Italian, Thai, and Southern traditions with confidence. Griddle bread with french onion dip, Japanese sweet potato curry, and royal milk tiramisu are standouts.",dishes:["Griddle Bread","Clay Pot Rice","Royal Milk Tiramisu"],address:"1516 W Carroll Ave, Chicago, IL 60607",hours:"",lat:41.8876,lng:-87.6617,instagram:"",website:"https://www.maxwellstrading.com",reservation:"Resy",phone:"(312) 896-4110"});

// 5. Jeong — Infatuation 8.3, upscale Korean tasting menu
// Verified: address, website from Infatuation review page
add({name:"Jeong",cuisine:"Korean",neighborhood:"West Town",score:89,price:3,tags:["Korean","Fine Dining","Date Night","Exclusive"],description:"Upscale Korean restaurant in West Town with a $87 seven-course tasting menu and a la carte options. Salmon tartare with yuzu gastrique, seared scallop with clementine beurre blanc, and tteokbokki fried in schmaltz. Chicago only Japanese-Nordic-Korean fine dining fusion.",dishes:["Seven-Course Tasting Menu","Tteokbokki","Duck Breast"],address:"1460 W Chicago Ave, Chicago, IL 60642",hours:"",lat:41.8966,lng:-87.6627,instagram:"",website:"https://www.jeongchicago.com",reservation:"Tock",phone:""});

// 6. Mariscos San Pedro — Infatuation featured, Pilsen Mexican seafood
// Verified: address, phone, website from Infatuation review page
add({name:"Mariscos San Pedro",cuisine:"Mexican Seafood",neighborhood:"Pilsen",score:90,price:2,tags:["Seafood","Mexican","Local Favorites","Critics Pick"],description:"Wood-fired Mexican seafood in Pilsen with Hokkaido scallop aguachile cured in hibiscus and beet, soft shell crab taco in squid ink tempura, and tuna tostada with salsa macha. Housemade tortillas and blue corn macarons for dessert. One of the most creative kitchens in Pilsen.",dishes:["Scallop Aguachile","Soft Shell Crab Taco","Tuna Tostada"],address:"1227 W 18th St, Chicago, IL 60608",hours:"",lat:41.8579,lng:-87.6583,instagram:"",website:"https://www.mariscossanpedro.com",reservation:"Resy",phone:"(312) 953-1599"});

// 7. Xocome Antojeria — Infatuation top-25
// Verified: address, phone from Infatuation review page (corrected to 5200 S Archer)
add({name:"Xocome Antojeria",cuisine:"Mexican",neighborhood:"Archer Heights",score:89,price:1,tags:["Mexican","Local Favorites","Casual"],description:"Antojitos spot in Archer Heights from the Infatuation top-25 with unbelievable masa in blue or yellow varieties. Tacos with tender filet mignon asada, football-shaped tlacoyos, giant machete-sized quesadillas, and pambazo dipped in guajillo pepper sauce. Worth the trip south.",dishes:["Filet Mignon Tacos","Tlacoyos","Pambazo"],address:"5200 S Archer Ave, Chicago, IL 60632",hours:"",lat:41.8015,lng:-87.7242,instagram:"",website:"",reservation:"walk-in",phone:"(773) 498-6679"});

// 8. The Momo World — Infatuation 9.0, Nepali dumplings
// Verified: address, phone, website from Infatuation review page (corrected to 727 W Maxwell)
add({name:"The Momo World",cuisine:"Nepali",neighborhood:"University Village",score:89,price:1,tags:["Nepali","Local Favorites","Casual"],description:"Nepali dumpling spot in University Village rated 9.0 by the Infatuation. Counter-service with perfectly chewy steamed momos, jhol momo in tomato-based soup, sadeko momo with sesame sauce, and momo chaat fried with yogurt. Also serves sekuwa skewers and Himalayan biryani.",dishes:["Steamed Chicken Momo","Jhol Momo","Tandoori Momo"],address:"727 W Maxwell St, Chicago, IL 60607",hours:"",lat:41.8655,lng:-87.6471,instagram:"",website:"https://www.themomoworld.com",reservation:"walk-in",phone:"(312) 733-8637"});

// 9. JM Seafood — Infatuation 9.0, Chinese seafood Bridgeport
// Verified: address, phone from Infatuation review page (corrected to 3312 S Halsted)
add({name:"JM Seafood",cuisine:"Chinese Seafood",neighborhood:"Bridgeport",score:89,price:2,tags:["Chinese","Seafood","Local Favorites"],description:"Chinese seafood restaurant in Bridgeport rated 9.0 by the Infatuation. Twin lobster sticky rice with gingery lobster meat, salted egg yolk fried pumpkin, and fried salt and pepper soft-shell crab. Call ahead for the waitlist as tables fill fast.",dishes:["Twin Lobster Sticky Rice","Salted Egg Yolk Pumpkin","Soft-Shell Crab"],address:"3312 S Halsted St, Chicago, IL 60608",hours:"",lat:41.8335,lng:-87.6467,instagram:"",website:"",reservation:"walk-in",phone:"(312) 285-2688"});

// 10. Akahoshi Ramen — Infatuation featured, Logan Square ramen
// Verified: address, website from Infatuation review page (corrected to 2340 N California)
add({name:"Akahoshi Ramen",cuisine:"Japanese Ramen",neighborhood:"Logan Square",score:88,price:1,tags:["Japanese","Ramen","Local Favorites","Casual"],description:"Ramen shop in Logan Square with housemade noodles and meticulous attention to each bowl. The Akahoshi Miso features miso blend and lard that turn chicken broth into umami-packed soup. Also serves soupless tantanmen with Sichuan peppercorns and aburasoba with crispy garlic.",dishes:["Akahoshi Miso Ramen","Soupless Tantanmen","Aburasoba"],address:"2340 N California Ave, Chicago, IL 60647",hours:"",lat:41.9245,lng:-87.6976,instagram:"",website:"https://www.akahoshiramen.com",reservation:"walk-in",phone:""});

// 11. Atsumeru — Infatuation featured, Japanese-Nordic omakase
// Verified: address, website from Infatuation review page (corrected to 933 N Ashland)
add({name:"Atsumeru",cuisine:"Japanese-Nordic Fusion",neighborhood:"West Town",score:92,price:4,tags:["Japanese","Fine Dining","Exclusive","Date Night","Critics Pick"],description:"Chicago only Japanese-Nordic restaurant with 10-12 seafood-focused courses at $165 per person. Foie-filled krumkake with cloudberry jam, chawanmushi with trout and galangal, and binchotan-grilled mushrooms over sushi rice. Minimalist dining room with a basement lounge.",dishes:["Foie Krumkake","Chawanmushi","Omakase Course"],address:"933 N Ashland Ave, Chicago, IL 60622",hours:"",lat:41.8988,lng:-87.6679,instagram:"",website:"https://www.atsumerurestaurant.com",reservation:"Tock",phone:""});

// 12. Casa Yari — Infatuation featured, Latin American BYOB
// Verified: address from Infatuation review page (corrected to 3268 W Fullerton, Logan Square)
add({name:"Casa Yari",cuisine:"Latin American",neighborhood:"Logan Square",score:87,price:1,tags:["Latin American","Local Favorites","Casual","BYOB"],description:"Latin American BYOB in Logan Square with garlicky mountains of mashed plantain mofongo and vegan-friendly options using seitan or jackfruit. Walk-ins welcome, friendly service, and bring your own bottle makes this an affordable neighborhood gem.",dishes:["Mofongo","Flan","Vegan Jackfruit Entrees"],address:"3268 W Fullerton Ave, Chicago, IL 60647",hours:"",lat:41.9249,lng:-87.7108,instagram:"",website:"",reservation:"walk-in",phone:""});

// 13. Anelya — Timeout best-of 2026, from Parachute team, Ukrainian
// Verified: address, website from Infatuation review page
add({name:"Anelya",cuisine:"Ukrainian",neighborhood:"Avondale",score:90,price:2,tags:["Eastern European","Date Night","Critics Pick","Local Favorites"],description:"Modern Ukrainian from the Parachute team in Avondale. Trout roe tart with scallion cream cheese, halushki potato dumplings with braised short rib and huckleberries, and banosh cheesy mushroom grits. Whimsical space with flower-shaped light fixtures and smiling vegetable sculptures.",dishes:["Halushki","Trout Roe Tart","Banosh"],address:"3472 N Elston Ave, Chicago, IL 60618",hours:"",lat:41.9455,lng:-87.7078,instagram:"",website:"https://www.anelyarestaurant.com",reservation:"Resy",phone:"",group:"Parachute"});

// 14. Mirra — Infatuation 8.4, Mexican-Indian fusion, Michelin Bib Gourmand
// Verified: address, website from Infatuation review page
add({name:"Mirra",cuisine:"Mexican-Indian Fusion",neighborhood:"Bucktown",score:89,price:2,tags:["Mexican","Indian","Date Night","Critics Pick"],description:"Mexican-Indian fusion in Bucktown rated 8.4 by the Infatuation. Crispy scallop taco with green curry and roti shell, rasul roti quesadillas with chettinad curry, and lamb barbacoa biryani with basmati and mint sealed in roti. Bright and spicy food for groups who love heat.",dishes:["Scallop Taco","Roti Quesadillas","Lamb Barbacoa Biryani"],address:"1954 W Armitage Ave, Chicago, IL 60622",hours:"",lat:41.9176,lng:-87.6789,instagram:"",website:"https://www.mirrachicago.com",reservation:"Resy",phone:"",awards:"Michelin Bib Gourmand"});

// 15. Nettare — Infatuation 7.6, all-day cafe/bar/restaurant, affordable tasting menu
// Verified: address, website from Infatuation review page
add({name:"Nettare",cuisine:"American / Italian",neighborhood:"West Town",score:86,price:1,tags:["New American","Italian","Wine Bar","Local Favorites","Casual"],description:"All-day cafe, bar, restaurant, and liquor store in West Town. Grilled bread with sweet potato baba ganoush, crispy-skinned walleye, and a $65 tasting menu that is one of the best values in fine dining in Chicago. Seasonal cocktails with pear brandy and grappa.",dishes:["Tasting Menu","Crispy Walleye","Grilled Bread"],address:"1953 W Chicago Ave, Chicago, IL 60622",hours:"",lat:41.8967,lng:-87.6773,instagram:"",website:"https://www.barnettare.com",reservation:"walk-in",phone:""});

console.log('Added', added, 'new spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Chicago batch 1 complete!');
