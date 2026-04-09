// Houston Batch 1: 25 verified restaurants
// Sources: Houston Chronicle Top 100, Houstonia Top 50, CultureMap, Texas Monthly, Michelin Guide
// Run: node scripts/houston-batch-1.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const HOUSTON_DATA');
const a = html.indexOf('[', s);
let d=0, e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id)) + 1;
let added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,
    score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',
    reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,
    dishes:s.dishes,address:s.address,hours:s.hours||'',lat:s.lat,lng:s.lng,
    bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,
    trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',
    website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// 1. Theodore Rex - Houston Chronicle #5
add({name:"Theodore Rex",cuisine:"New American / French",neighborhood:"Heights",
  score:93,price:3,tags:["Fine Dining","Date Night","Critics Pick","Cocktails"],
  reservation:"Resy",awards:"Houston Chronicle #5, Michelin Recommended",
  description:"Chef Justin Yu's relaxed fine-dining restaurant in the Heights, evolved from the legendary Oxheart. French-leaning technique applied to Gulf Coast ingredients in a warm, unhurried setting. The seasonal menu changes constantly, the wine list is deep, and the service feels personal rather than performative. A Houston institution for chefs and serious diners.",
  dishes:["Seasonal Tasting Menu","Gulf Oysters","Handmade Pasta","Natural Wine"],
  address:"1302 Nance St, Houston, TX 77002",phone:"(832) 830-8592",
  lat:29.7678,lng:-95.3562,instagram:"theodore_rex_houston",website:"https://trexhouston.com",res_tier:2});

// 2. Katami - Houston Chronicle #2
add({name:"Katami",cuisine:"Japanese Omakase",neighborhood:"Montrose",
  score:95,price:4,tags:["Japanese","Omakase","Fine Dining","Date Night","Exclusive"],
  reservation:"Resy",awards:"Houston Chronicle #2",
  description:"Chef Manabu 'Hori' Horiuchi's intimate six-seat omakase counter in Montrose. Every piece of sushi is a masterclass in precision, sourcing fish from Tsukiji and the Gulf. The Houston Chronicle ranked it #2 in the city. At six seats, it's one of the hardest reservations in Houston — book the moment slots open.",
  dishes:["Omakase Course","Nigiri","Seasonal Sashimi","Japanese Wagyu"],
  address:"3617 S Shepherd Dr, Houston, TX 77098",phone:"(346) 305-3250",
  lat:29.7340,lng:-95.4107,instagram:"katamihouston",website:"https://www.katamihouston.com",res_tier:1});

// 3. Pépin
add({name:"Pépin",cuisine:"French Bistro",neighborhood:"Montrose",
  score:90,price:3,tags:["French","Brunch","Date Night","Hotel","Cocktails"],
  reservation:"Resy",awards:"Houstonia Top 10 New 2025",
  description:"Chef Aaron Bludorn's all-day French bistro inside the Hotel Saint Augustine near the Menil Collection. French culinary roots meet Texas Gulf Coast flavors — crawfish sausage with Creole sauce, coq au vin, and an impeccable wine program. The hotel setting adds a touch of glamour without pretension.",
  dishes:["Crawfish Sausage","Coq au Vin","Steak Frites","Croque Monsieur"],
  address:"1910 W Alabama St, Houston, TX 77098",phone:"(713) 955-2526",
  lat:29.7403,lng:-95.3948,instagram:"pepinhouston",website:"https://www.pepinhouston.com"});

// 4. State of Grace
add({name:"State of Grace",cuisine:"Southern / Texan",neighborhood:"River Oaks",
  score:89,price:3,tags:["Southern","Date Night","Cocktails","Brunch","Local Favorites"],
  reservation:"OpenTable",
  description:"Refined Southern dining on Westheimer that's been a River Oaks anchor for years. The menu honors Texas ranching heritage with dishes like chicken-fried quail and Gulf snapper alongside an oyster bar. The bar program is outstanding and the Sunday brunch is one of the best in the city.",
  dishes:["Chicken-Fried Quail","Gulf Snapper","Oyster Bar","Sunday Brunch"],
  address:"3258 Westheimer Rd, Houston, TX 77098",phone:"(832) 942-5080",
  lat:29.7372,lng:-95.4230,instagram:"stateofgracetx",website:"https://stateofgracetx.com"});

// 5. Pondicheri
add({name:"Pondicheri",cuisine:"Modern Indian",neighborhood:"Upper Kirby",
  score:88,price:2,tags:["Indian","Brunch","Casual","Local Favorites","Vegetarian"],
  reservation:"OpenTable",
  description:"Chef Anita Jaisinghani's modern Indian restaurant and bake lab on Kirby that's been a Houston staple for over a decade. The dosas are crispy, the curries are layered, and the weekend brunch draws crowds for masala omelets and chai French toast. The downstairs Bake Lab sells naan, cookies, and grab-and-go Indian comfort food.",
  dishes:["Dosas","Butter Chicken","Masala Omelet","Chai French Toast"],
  address:"2800 Kirby Dr, Suite B132, Houston, TX 77098",phone:"(713) 522-2022",
  lat:29.7365,lng:-95.4195,instagram:"pondicheri",website:"https://www.pondicheri.com"});

// 6. Blood Bros. BBQ
add({name:"Blood Bros. BBQ",cuisine:"Texas BBQ / Asian Fusion",neighborhood:"Bellaire",
  score:91,price:2,tags:["BBQ","Asian Fusion","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, Texas Monthly Top 50 BBQ",
  description:"The Quys and Robin Wong merge Texas BBQ tradition with Vietnamese and Chinese influences in Bellaire. Brisket is elite, but the curveballs — like Thai-inspired boudin and Chinese sausage-fried rice — are what make Blood Bros. special. Michelin Bib Gourmand and a Texas Monthly Top 50 BBQ pick. Lines are real on weekends.",
  dishes:["Brisket","Smoked Turkey","Boudin Kolaches","Fried Rice"],
  address:"5425 Bellaire Blvd, Bellaire, TX 77401",phone:"(713) 664-7776",
  lat:29.7058,lng:-95.4637,instagram:"bloodbrosbbq",website:"https://bloodbrosbbq.com",suburb:true});

// 7. Mastro's Steakhouse
add({name:"Mastro's Steakhouse",cuisine:"Steakhouse",neighborhood:"Uptown / Galleria",
  score:91,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Cocktails"],
  reservation:"OpenTable",
  description:"Upscale steakhouse inside The Post Oak Hotel in the Galleria area. USDA Prime steaks cooked in a 1,500-degree broiler, theatrical butter cake dessert, and live entertainment nightly. The see-and-be-seen crowd includes professional athletes and Galleria-area power players. One of the most glamorous steak experiences in Houston.",
  dishes:["Bone-In Ribeye","Butter Cake","Lobster Mashed Potatoes","Craft Cocktails"],
  address:"1600 West Loop S, Houston, TX 77027",phone:"(713) 993-2500",
  lat:29.7450,lng:-95.4606,instagram:"mastrosrestaurants",website:"https://www.mastrosrestaurants.com"});

// 8. Steak 48
add({name:"Steak 48",cuisine:"Steakhouse",neighborhood:"River Oaks",
  score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],
  reservation:"OpenTable",
  description:"Sleek, modern steakhouse in the River Oaks restaurant corridor. USDA Prime grass-fed steaks, an extensive raw bar, and a dimly lit, lounge-y atmosphere that feels more South Beach than Texas. The bone-in ribeye is the signature, and the service is attentive without being stuffy.",
  dishes:["Bone-In Ribeye","Wagyu Tartare","Seafood Tower","Truffle Mac & Cheese"],
  address:"4444 Westheimer Rd, Suite H100, Houston, TX 77027",phone:"(346) 440-4848",
  lat:29.7379,lng:-95.4369,instagram:"steak48",website:"https://www.steak48.com"});

// 9. Doris Metropolitan
add({name:"Doris Metropolitan",cuisine:"Steakhouse / Mediterranean",neighborhood:"Montrose",
  score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Mediterranean"],
  reservation:"OpenTable",
  description:"Israeli-born steakhouse that elevates the genre with Middle Eastern flavors and a dry-aging program visible from the dining room. The lamb chops are legendary, the hummus rivals any in the city, and the wine list is deep in Israeli and Mediterranean bottles. A steakhouse with actual personality.",
  dishes:["Lamb Chops","Dry-Aged Ribeye","Hummus","Baklava"],
  address:"2815 S Shepherd Dr, Houston, TX 77098",phone:"(713) 485-0466",
  lat:29.7345,lng:-95.4107,instagram:"dorismetropolitan",website:"https://dorismetropolitan.com"});

// 10. Da Gama
add({name:"Da Gama",cuisine:"Portuguese-Indian Fusion",neighborhood:"Heights",
  score:88,price:2,tags:["Indian","Portuguese","Date Night","Cocktails"],
  reservation:"OpenTable",awards:"Houstonia Top 10 New 2025",
  description:"Portuguese-Indian fusion in the MKT Heights development from Rick and Shiva Di Virgilio. Named after explorer Vasco da Gama, the menu bridges Goa and Lisbon with dishes like Goan fish curry and piri piri chicken with gunpowder fries. One of Houston's most inventive culinary mash-ups.",
  dishes:["Goan Fish Curry","Piri Piri Chicken","Gunpowder Fries","Custard Tarts"],
  address:"600 N Shepherd Dr, Suite 166, Houston, TX 77007",phone:"(281) 810-4247",
  lat:29.7746,lng:-95.4068,instagram:"dagamahtx",website:"https://www.dagamahtx.com"});

// 11. Oporto Fooding House
add({name:"Oporto Fooding House",cuisine:"Portuguese",neighborhood:"Midtown",
  score:87,price:2,tags:["Portuguese","Seafood","Date Night","Wine Bar"],
  reservation:"OpenTable",
  description:"Portugal meets Midtown at this seafood-forward restaurant celebrating bold coastal flavors. Shareable petiscos, mussels, piri-piri shrimp, and Portuguese paella in a vibrant, tile-accented space. The port wine selection is the best in the city. From the same team behind Da Gama.",
  dishes:["Portuguese Paella","Piri-Piri Shrimp","Petiscos","Port Wine"],
  address:"3833 Richmond Ave, Suite 100, Houston, TX 77027",phone:"(346) 227-7452",
  lat:29.7333,lng:-95.4359,instagram:"oportohouston",website:"https://www.oportohouston.com"});

// 12. CasaEma
add({name:"CasaEma",cuisine:"Mexican Bakery / Cafe",neighborhood:"Heights",
  score:88,price:1,tags:["Mexican","Bakery","Breakfast","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"JBF Semifinalist Outstanding Pastry Chef",
  description:"Stephanie Velasquez's Heights bakery and cafe where berlinesas, canela panqués, and conchas fly off the shelves. The James Beard-nominated pastry program honors Mexican baking traditions with modern flair. Savory standouts include suadero chilaquiles and carrot tacos. Lines form early on weekends.",
  dishes:["Berlinesas","Conchas","Suadero Chilaquiles","Carrot Tacos"],
  address:"1101 E 11th St, Houston, TX 77009",phone:"(832) 831-6041",
  lat:29.7898,lng:-95.3598,instagram:"casaema_",website:"https://www.casaema.com",trending:true});

// 13. Annam
add({name:"Annam",cuisine:"Vietnamese / French",neighborhood:"Autry Park",
  score:89,price:3,tags:["Vietnamese","French","Fine Dining","Date Night","New Opening"],
  indicators:["new"],reservation:"Resy",
  description:"Chef Chris Kinjo's sophisticated Vietnamese restaurant at Autry Park blending Saigon flavors with French technique. The fish head with fish sauce is for the adventurous, while lobster asparagus soup and shaking filet mignon offer refined elegance. A beautiful, European-inspired dining room elevates the experience.",
  dishes:["Fish Head with Fish Sauce","Lobster Asparagus Soup","Shaking Filet Mignon","Pho"],
  address:"480 Milvid St, Houston, TX 77006",phone:"(832) 981-3888",
  lat:29.7378,lng:-95.3950,instagram:"annamhouston",website:"https://www.annamhouston.com",trending:true});

// 14. Latuli
add({name:"Latuli",cuisine:"American / Gulf Coast",neighborhood:"Memorial",
  score:88,price:3,tags:["American","Seafood","Date Night","Local Favorites"],
  reservation:"Resy",awards:"Texas Monthly Best New Restaurants 2026",
  description:"Chef Bryan Caswell's triumphant return to Houston after years away. Gulf Coast-driven cooking with dishes like smoked redfish dip, roasted grouper with corn pudding, and heirloom tomato burrata. Caswell built his reputation at Reef and Revival Market — Latuli shows he hasn't lost a step. Texas Monthly best new list.",
  dishes:["Smoked Redfish Dip","Roasted Grouper","Heirloom Tomato Salad","Gulf Oysters"],
  address:"8900 Gaylord Dr, Houston, TX 77024",phone:"(832) 241-6144",
  lat:29.7725,lng:-95.4750,instagram:"latulihouston",website:"https://www.latuli.com"});

// 15. Mayahuel
add({name:"Mayahuel",cuisine:"Modern Mexican / Agave Bar",neighborhood:"Autry Park",
  score:87,price:3,tags:["Mexican","Cocktails","Date Night","New Opening"],
  indicators:["new"],reservation:"Resy",
  description:"Mexico City-inspired restaurant and agave bar at Autry Park from Culinary Khancepts and chef Luis Robledo Richards. The menu draws from DF's fondas and mezcalerias with mole, tlayudas, and an agave spirit list that rivals any in the state. The sophisticated space channels Mexico City's Roma Norte neighborhood.",
  dishes:["Mole","Tlayudas","Mezcal Cocktails","Agave Flights"],
  address:"811 Buffalo Park Dr, Suite 130, Houston, TX 77019",phone:"",
  lat:29.7550,lng:-95.3980,instagram:"mayahuelhtx",website:"https://www.mayahuelrestaurant.com",trending:true});

// 16. Handies Douzo
add({name:"Handies Douzo",cuisine:"Japanese Hand Rolls",neighborhood:"Montrose",
  score:86,price:1,tags:["Japanese","Sushi","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Houston's crispiest hand rolls at prices that feel like a steal. Three-roll sets under $20 make this the city's best sushi value. Multiple locations including Montrose and Heights keep the lines moving. The nori is toasted to order and the rice is warm — simple perfection.",
  dishes:["Hand Rolls","Spicy Tuna Roll","Salmon Roll","Miso Soup"],
  address:"1808 Westheimer Rd, Houston, TX 77098",phone:"(832) 649-7711",
  lat:29.7425,lng:-95.3855,instagram:"handiesdouzo",website:"https://www.handiesdouzo.com"});

// 17. Underbelly Burger
add({name:"Underbelly Burger",cuisine:"Burgers",neighborhood:"Heights",
  score:85,price:1,tags:["Burgers","Casual","Local Favorites"],
  reservation:"walk-in",group:"Underbelly Hospitality",
  description:"Underbelly Hospitality's smash burger concept with locations at the Houston Farmers Market and on Witte Rd. The double smash patty with American cheese on a potato bun is a contender for Houston's best burger. Fries are cut in-house and the shakes are thick. No-frills perfection.",
  dishes:["Double Smash Burger","Fries","Milkshakes","Patty Melt"],
  address:"2520 Airline Dr, Houston, TX 77009",phone:"(832) 582-5642",
  lat:29.7929,lng:-95.3800,instagram:"underbellyburger",website:"https://underbellyburger.com"});

// 18. Little's Oyster Bar
add({name:"Little's Oyster Bar",cuisine:"Seafood / Oyster Bar",neighborhood:"Galleria",
  score:89,price:3,tags:["Seafood","Oysters","Date Night","Fine Dining"],
  reservation:"OpenTable",awards:"Houston Chronicle #6",group:"Pappas Restaurants",
  description:"The Pappas family's upscale oyster bar and seafood restaurant near the Galleria. Fresh Gulf oysters, seafood towers, and refined fish preparations in an elegant setting. Houston Chronicle ranked it #6 in the city — proof that Pappas can compete at the highest level when they want to.",
  dishes:["Oyster Platter","Seafood Tower","Grilled Gulf Fish","Lobster Bisque"],
  address:"5000 Westheimer Rd, Suite 735, Houston, TX 77056",phone:"(713) 877-1190",
  lat:29.7389,lng:-95.4590,instagram:"littlesoysterbar",website:"https://www.littlesoysterbar.com"});

// 19. Camaraderie
add({name:"Camaraderie",cuisine:"New American / Shared Plates",neighborhood:"Heights",
  score:87,price:2,tags:["American","Date Night","Cocktails","Local Favorites","New Opening"],
  indicators:["new"],reservation:"Resy",awards:"Houstonia Top 10 New 2025",
  description:"Chef Shawn Gawle's 'fine-casual' restaurant in the Heights built around sharing. French technique underpins American flavors — Manchego cheese curls, carrot cavatelli, and dishes designed to pass around the table. The energy is convivial, the cocktails are creative, and the price point keeps it accessible.",
  dishes:["Manchego Cheese Curls","Carrot Cavatelli","Shared Plates","Craft Cocktails"],
  address:"550 Heights Blvd, Houston, TX 77007",phone:"(832) 831-6200",
  lat:29.7820,lng:-95.3890,instagram:"camaraderiehtx",website:"https://www.camaraderiehtx.com",trending:true});

// 20. Maximo
add({name:"Maximo",cuisine:"Progressive Mexican",neighborhood:"Montrose",
  score:87,price:3,tags:["Mexican","Fine Dining","Date Night","Cocktails"],
  reservation:"Resy",
  description:"Reborn in 2025 under 26-year-old exec chef Adrian Torres with a progressive Mexican menu that merges traditional technique with modern ambition. Shrimp-chorizo queso fundido and masa corn bread crowned with caviar and chicatana butter are the kind of dishes that make you rethink what Mexican fine dining can be.",
  dishes:["Queso Fundido","Masa Corn Bread with Caviar","Mole","Craft Margaritas"],
  address:"4800 Calhoun Rd, Houston, TX 77004",phone:"(832) 968-8085",
  lat:29.7231,lng:-95.3452,instagram:"maximohouston",website:"https://www.maximohouston.com"});

// 21. Killen's Steakhouse
add({name:"Killen's Steakhouse",cuisine:"Steakhouse",neighborhood:"Pearland",
  score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],
  reservation:"OpenTable",
  description:"Chef Ronnie Killen's destination steakhouse in Pearland, worth the drive from downtown. USDA Prime and Japanese Wagyu prepared by a pitmaster-turned-fine-dining chef. The 36oz tomahawk is legendary, and the cream corn has its own cult following. One of the great Texas steakhouses.",
  dishes:["Tomahawk Ribeye","Japanese Wagyu","Cream Corn","Lobster Tail"],
  address:"6425 Broadway St, Pearland, TX 77581",phone:"(281) 485-0844",
  lat:29.5660,lng:-95.2868,instagram:"killenssteakhouse",website:"https://www.killenssteakhouse.com",suburb:true});

// 22. Saigon Pagolac
add({name:"Saigon Pagolac",cuisine:"Vietnamese",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"The seven-course beef tasting menu for under $20 per person is one of Houston's greatest dining experiences at any price. Bo 7 Mon takes you through beef seven ways — from tartare to fondue to congee — in a no-frills Bellaire strip mall setting. A Houston institution for decades.",
  dishes:["Seven-Course Beef (Bo 7 Mon)","Pho","Shaking Beef","Rice Plates"],
  address:"9600 Bellaire Blvd, Suite 118, Houston, TX 77036",phone:"(713) 773-5578",
  lat:29.7062,lng:-95.5305,instagram:"",website:"",suburb:true});

// 23. Crawfish & Noodles
// Already exists - skip

// 23. Nam Giao
add({name:"Nam Giao",cuisine:"Vietnamese / Hue Regional",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"Hidden gem specializing in the regional cuisine of Huế, Vietnam's imperial capital. The steamed rice cakes filled with ground pork and dried shrimp are transcendent. Start with the sampler platter, order the bun bo Hue, and discover why chefs consider this one of the most important Vietnamese restaurants in America.",
  dishes:["Steamed Rice Cakes","Bun Bo Hue","Banh Beo","Grilled Pork"],
  address:"11108 Bellaire Blvd, Houston, TX 77072",phone:"(281) 988-5655",
  lat:29.7059,lng:-95.5455,instagram:"",website:"",suburb:true});

// 24. Phat Eatery
add({name:"Phat Eatery",cuisine:"Malaysian",neighborhood:"Katy Asian Town",
  score:88,price:2,tags:["Malaysian","Asian","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Houston Chronicle Top 100, JBF Semifinalist",
  description:"Chef Alex Au-Yeung's Malaysian restaurant in Katy Asian Town that put Katy on the Houston food map. Roti canai, Hainanese chicken rice, and char kway teow are executed with the kind of precision that earned JBF recognition. The laksa is among the best in the country. Worth the drive from inner-loop Houston.",
  dishes:["Roti Canai","Hainanese Chicken Rice","Laksa","Char Kway Teow"],
  address:"23119 Colonial Pkwy, Suite B1, Katy, TX 77449",phone:"(832) 437-4955",
  lat:29.7789,lng:-95.7581,instagram:"phateatery",website:"https://www.phateatery.com",suburb:true});

// 25. Rodeo Goat
add({name:"Rodeo Goat",cuisine:"Burgers / Craft Beer",neighborhood:"Washington Corridor",
  score:84,price:2,tags:["Burgers","Craft Beer","Casual","Patio","Sports Bar"],
  reservation:"walk-in",
  description:"Creative burgers and 100+ craft beers on tap in a sprawling Washington Ave space with a massive patio. The rotating seasonal burgers are inventive — think pimento cheese, fried green tomatoes, and brisket toppings. A Texas original that started in Fort Worth and brought its burger game to Houston.",
  dishes:["Specialty Burgers","Craft Beer","Sweet Potato Fries","Patio Drinks"],
  address:"2105 Washington Ave, Houston, TX 77007",phone:"(713) 360-6185",
  lat:29.7644,lng:-95.3795,instagram:"rodeogoat",website:"https://www.rodeogoat.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
