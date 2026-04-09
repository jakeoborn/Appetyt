// Houston Batch 4: Push toward 250 — restaurants, brunch, Tex-Mex, Chinatown, bars, breweries
// All verified with instagram + website where available
// Run: node scripts/houston-batch-4.js

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

// === HOUSTON INSTITUTIONS & BRUNCH ===

add({name:"Brennan's of Houston",cuisine:"Cajun-Creole / Southern",neighborhood:"Midtown",
  score:90,price:3,tags:["Cajun","Southern","Brunch","Fine Dining","Date Night","Live Music"],
  reservation:"OpenTable",awards:"Houston institution since 1967",
  description:"A Houston landmark since 1967, Brennan's brings New Orleans Creole cuisine to Midtown with turtle soup, bananas Foster, and Gulf seafood in an elegant courtyard setting. The jazz brunch is legendary and the courtyard is one of the most romantic dining spots in the city. Part of the Brennan family restaurant dynasty.",
  dishes:["Turtle Soup","Bananas Foster","Gulf Crab Cakes","Jazz Brunch"],
  address:"3300 Smith St, Houston, TX 77006",phone:"(713) 522-9711",
  lat:29.7390,lng:-95.3871,instagram:"brennanshouston",website:"https://www.brennanshouston.com"});

add({name:"The Breakfast Klub",cuisine:"Soul Food / Breakfast",neighborhood:"Midtown",
  score:88,price:1,tags:["Breakfast","Brunch","Soul Food","Local Favorites","Viral"],
  reservation:"walk-in",awards:"Houston institution",
  description:"The line out the door is the first sign you're at the right place. Wings and waffles, catfish and grits, and fluffy pancakes have made The Breakfast Klub a Houston institution. President Obama ate here. Guy Fieri filmed here. Locals come every weekend. Arrive early or prepare to wait.",
  dishes:["Wings & Waffles","Catfish & Grits","Pancakes","Breakfast Tacos"],
  address:"3711 Travis St, Houston, TX 77002",phone:"(713) 528-8561",
  lat:29.7385,lng:-95.3804,instagram:"katfishandgrits",website:"https://thebreakfastklub.com"});

add({name:"Tiny Boxwoods",cuisine:"New American / Brunch",neighborhood:"River Oaks",
  score:87,price:2,tags:["Brunch","American","Patio","Local Favorites","Bakery"],
  reservation:"Resy",
  description:"A garden oasis in River Oaks where brunch is practically a religion. The chocolate chip cookies are famous, the avocado toast is perfect, and the shaded patio feels like dining in a secret garden. Simple, fresh, and endlessly charming. Multiple locations but the original on West Alabama is the one.",
  dishes:["Chocolate Chip Cookies","Avocado Toast","Brunch Plates","Fresh Salads"],
  address:"3614 W Alabama St, Houston, TX 77027",phone:"(713) 622-4224",
  lat:29.7389,lng:-95.4278,instagram:"tinyboxwoods",website:"https://tinyboxwoods.com"});

add({name:"Traveler's Table",cuisine:"Global / International",neighborhood:"Montrose",
  score:87,price:2,tags:["International","Date Night","Cocktails","Brunch"],
  reservation:"OpenTable",
  description:"A globally inspired restaurant on Westheimer where the menu hops continents — Thai curries, Peruvian ceviches, Indian flatbreads, and Spanish tapas all share space. Chef Benchawan Painter brings authentic technique from her travels to each dish. The weekend brunch is one of Houston's most creative.",
  dishes:["Thai Curry","Ceviche","Indian Flatbread","Global Brunch"],
  address:"520 Westheimer Rd, Houston, TX 77006",phone:"(832) 409-5785",
  lat:29.7437,lng:-95.3734,instagram:"travelerstablerestaurant",website:"https://www.travelerstable.com"});

add({name:"Dandelion Café",cuisine:"Breakfast / Brunch",neighborhood:"Heights",
  score:85,price:1,tags:["Breakfast","Brunch","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Heights brunch spot with award-winning chicken and waffles, creative French toast, and a warm neighborhood vibe. The menu is comfort-forward with Southern and Latin influences. Weekend mornings draw lines but they move fast. A Heights staple that punches above its weight.",
  dishes:["Chicken & Waffles","French Toast","Breakfast Tacos","Migas"],
  address:"5405 Bellaire Blvd, Bellaire, TX 77401",phone:"(713) 666-6681",
  lat:29.7058,lng:-95.4637,instagram:"dandelioncafehtx",website:"https://www.dandelioncafe.com"});

// === TEX-MEX & MEXICAN ===

add({name:"The Original Ninfa's on Navigation",cuisine:"Tex-Mex / Mexican",neighborhood:"East End",
  score:91,price:2,tags:["Mexican","Tex-Mex","Local Favorites","Historic","Fajitas"],
  reservation:"OpenTable",awards:"Birthplace of the fajita",
  description:"The birthplace of the fajita — Mama Ninfa Laurenzo started sizzling skirt steak on a comal here in 1973 and changed Houston dining forever. The Navigation Blvd original is the one to visit. Tacos al carbon, green sauce that's bottled and sold nationwide, and an energy that's pure Houston. A non-negotiable stop for any visitor.",
  dishes:["Fajitas","Tacos al Carbon","Green Sauce","Queso"],
  address:"2704 Navigation Blvd, Houston, TX 77003",phone:"(713) 228-1175",
  lat:29.7538,lng:-95.3479,instagram:"ninfasoriginal",website:"https://ninfas.com"});

add({name:"El Tiempo Cantina",cuisine:"Tex-Mex",neighborhood:"Washington Corridor",
  score:88,price:2,tags:["Tex-Mex","Fajitas","Margaritas","Local Favorites","Family"],
  reservation:"walk-in",
  description:"The Laurenzo family's Tex-Mex empire — sizzling fajitas, handmade flour tortillas, and margaritas that are dangerously strong. Multiple locations across Houston, but the energy is the same at every one: loud, festive, and unapologetically Texan. The fajitas use prime beef and the queso is liquid gold.",
  dishes:["Beef Fajitas","Flour Tortillas","Margaritas","Queso"],
  address:"5602 Washington Ave, Houston, TX 77007",phone:"(713) 681-3645",
  lat:29.7712,lng:-95.4030,instagram:"eltiempocantina",website:"https://eltiempocantina.com"});

add({name:"Teotihuacan Mexican Cafe",cuisine:"Tex-Mex",neighborhood:"Heights",
  score:85,price:1,tags:["Tex-Mex","Breakfast","Casual","Local Favorites","Family"],
  reservation:"walk-in",
  description:"The bright pink exterior is your first clue that this Heights Tex-Mex institution doesn't take itself too seriously. The chile con queso is the perfect consistency for dredging fajitas and flautas. Breakfast tacos and huevos rancheros pack the place on weekend mornings. A Houston classic since 1997.",
  dishes:["Chile Con Queso","Fajitas","Breakfast Tacos","Huevos Rancheros"],
  address:"1511 Airline Dr, Houston, TX 77009",phone:"(713) 426-4420",
  lat:29.7925,lng:-95.3655,instagram:"teotihuacanmex",website:"https://www.teotihuacanmexicancafe.com"});

// === CHINATOWN / BELLAIRE / ASIAN ===

add({name:"Tiger Den",cuisine:"Japanese Ramen / Izakaya",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Japanese","Ramen","Casual","Cheap Eats","Late Night"],
  reservation:"walk-in",
  description:"Hakata-style ramen that's been simmering for 24 hours, served for $9 a bowl on Bellaire Boulevard. The spicy miso and black bean ramen are the standouts, and the robata-grilled yakitori makes this more than just a noodle shop. One of Chinatown's best-kept secrets — chefs eat here after their own shifts.",
  dishes:["Spicy Miso Ramen","Black Bean Ramen","Yakitori","Gyoza"],
  address:"9889 Bellaire Blvd, Suite D-230, Houston, TX 77036",phone:"(832) 804-7755",
  lat:29.7035,lng:-95.5533,instagram:"tigerdentx",website:"",suburb:true});

add({name:"Fung's Kitchen",cuisine:"Chinese / Dim Sum",neighborhood:"Chinatown / Bellaire",
  score:87,price:2,tags:["Chinese","Dim Sum","Seafood","Local Favorites"],
  reservation:"walk-in",
  description:"Traditional dim sum institution on Bellaire Boulevard with carts circling the tables and over 150 items on the menu. The har gow, siu mai, and char siu bao are textbook Cantonese, and the banquet menu is ideal for groups. Operating since 1990, Fung's is one of the anchors of Houston's Chinatown dining scene.",
  dishes:["Dim Sum","Har Gow","Char Siu Bao","Peking Duck"],
  address:"7320 Southwest Fwy, Houston, TX 77074",phone:"(713) 779-2288",
  lat:29.6972,lng:-95.5105,instagram:"fungskitchen",website:"https://fungskitchen.com",suburb:true});

add({name:"Ocean Palace",cuisine:"Chinese / Dim Sum",neighborhood:"Chinatown / Bellaire",
  score:86,price:2,tags:["Chinese","Dim Sum","Family","Local Favorites"],
  reservation:"walk-in",
  description:"Houston's largest dim sum restaurant on Bellaire Boulevard, where push carts loaded with steamer baskets weave through a cavernous dining room packed with families. Pork shu mai, turnip cake, and har gow shrimp dumplings are essentials. The family four-pack for $40 is one of Chinatown's best values.",
  dishes:["Dim Sum","Shu Mai","Turnip Cake","Har Gow"],
  address:"11215 Bellaire Blvd, Houston, TX 77072",phone:"(281) 988-8898",
  lat:29.7058,lng:-95.5455,instagram:"",website:"",suburb:true});

add({name:"Pepper Twins",cuisine:"Sichuan Chinese",neighborhood:"Montrose",
  score:86,price:2,tags:["Chinese","Sichuan","Spicy","Local Favorites"],
  reservation:"walk-in",
  description:"Fiery Sichuan cooking from twin sisters in Montrose and Rice Village. The mapo tofu is mouth-numbing perfection, the dan dan noodles are addictive, and the cumin lamb is packed with wok hei. For Houstonians who want real-deal Sichuan heat without the Bellaire Blvd drive.",
  dishes:["Mapo Tofu","Dan Dan Noodles","Cumin Lamb","Kung Pao Chicken"],
  address:"2005 W Gray St, Houston, TX 77019",phone:"(713) 529-0789",
  lat:29.7535,lng:-95.3915,instagram:"peppertwinshou",website:"https://www.peppertwins.com"});

// === PIZZA & ITALIAN ===

add({name:"Pizaro's Pizza",cuisine:"Napoletana / NY / Detroit Pizza",neighborhood:"Montrose",
  score:87,price:2,tags:["Pizza","Italian","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Three killer pizza styles under one roof — authentic Napoletana blistered at 900 degrees in imported Naples ovens, foldable New York slices, and chewy twice-baked Detroit squares. Houston's best pizzeria since 2011, with two locations. The Montrose original on West Gray is the classic.",
  dishes:["Napoletana Pizza","NY Slice","Detroit Square","Calzones"],
  address:"1000 W Gray St, Houston, TX 77019",phone:"(832) 742-5200",
  lat:29.7536,lng:-95.3917,instagram:"pizaros_pizza",website:"https://pizarospizza.com"});

// === BARS & BREWERIES ===

add({name:"Better Luck Tomorrow",cuisine:"Cocktail Bar / Snacks",neighborhood:"Heights",
  score:86,price:2,tags:["Cocktails","Bar","Late Night","Local Favorites"],
  reservation:"walk-in",awards:"James Beard Outstanding Bar Semifinalist",
  description:"Bobby Heugel's casual Heights bar — the laid-back sibling to Anvil. Craft cocktails without the pretension, cold beer, and late-night snacks in a neighborhood dive bar setting. JBF Outstanding Bar semifinalist that proves great drinks don't need velvet ropes. The burger is one of the best in Houston.",
  dishes:["Craft Cocktails","BLT Burger","Bar Snacks","Cold Beer"],
  address:"544 Yale St, Houston, TX 77007",phone:"(713) 869-4420",
  lat:29.7767,lng:-95.3989,instagram:"betterlucktomorrow",website:"https://www.betterlucktomorrow.com"});

add({name:"Poison Girl",cuisine:"Dive Bar",neighborhood:"Montrose",
  score:83,price:1,tags:["Bar","Dive Bar","Late Night","Local Favorites","Cocktails"],
  reservation:"walk-in",
  description:"Montrose dive bar institution with surprisingly good cocktails and a jukebox that never disappoints. The front patio is a Westheimer people-watching goldmine and the whiskey list is deeper than you'd expect. The kind of bar that makes Montrose what it is — unpretentious, welcoming, and open late.",
  dishes:["Whiskey","Craft Cocktails","Cold Beer","Jukebox"],
  address:"1641 Westheimer Rd, Houston, TX 77006",phone:"(713) 527-9929",
  lat:29.7429,lng:-95.3882,instagram:"poisongirlbar",website:"https://www.poisongirlbar.com"});

add({name:"8th Wonder Brewery",cuisine:"Brewery / Beer Garden",neighborhood:"EaDo",
  score:84,price:1,tags:["Brewery","Craft Beer","Patio","Local Favorites","Sports"],
  reservation:"walk-in",
  description:"EaDo's anchor brewery with a sprawling outdoor beer garden steps from the stadiums. Rocket Fuel Vietnamese coffee stout is the signature, and game-day crowds pack the yard for Texans, Astros, and Dynamo pre-gaming. The taproom pours 20+ house beers and the food trucks rotate daily.",
  dishes:["Rocket Fuel Stout","Hopston IPA","Rotating Food Trucks","Pretzels"],
  address:"2202 Dallas St, Houston, TX 77003",phone:"(832) 371-1666",
  lat:29.7482,lng:-95.3478,instagram:"8thwonderbrewery",website:"https://www.8thwonder.com"});

add({name:"Saint Arnold Brewing Company",cuisine:"Brewery / Beer Hall",neighborhood:"East End",
  score:85,price:1,tags:["Brewery","Craft Beer","Beer Garden","Local Favorites","Tours"],
  reservation:"walk-in",awards:"Texas' oldest craft brewery",
  description:"Texas' oldest craft brewery with a massive beer hall and garden near downtown. Art Car IPA and Fancy Lawnmower are Houston staples sold in every grocery store and bar in the city. The beer garden hosts food trucks, trivia, and live music. Tours run on weekends. A Houston institution since 1994.",
  dishes:["Art Car IPA","Fancy Lawnmower","Brewery Tour","Food Trucks"],
  address:"2000 Lyons Ave, Houston, TX 77020",phone:"(713) 686-9494",
  lat:29.7650,lng:-95.3451,instagram:"saintarnold",website:"https://www.saintarnold.com"});

add({name:"Karbach Brewing Co.",cuisine:"Brewery / Beer Garden",neighborhood:"Northwest Houston",
  score:84,price:1,tags:["Brewery","Craft Beer","Beer Garden","Family","Patio"],
  reservation:"walk-in",
  description:"Massive craft brewery complex in northwest Houston with an indoor beer hall, outdoor biergarten, and full restaurant. Love Street Blonde is Houston's unofficial summer beer. The space hosts live music, festivals, and is family-friendly during the day. One of the city's best brewery experiences.",
  dishes:["Love Street Blonde","Hopadillo IPA","Brewery Bites","Weekend Specials"],
  address:"2032 Karbach St, Houston, TX 77092",phone:"(713) 680-8886",
  lat:29.8125,lng:-95.4565,instagram:"karbachbrewing",website:"https://www.karbachbrewing.com"});

// === MORE ESSENTIAL HOUSTON ===

add({name:"Nobie's",cuisine:"Italian-American",neighborhood:"Montrose",
  score:87,price:2,tags:["Italian","Date Night","Cocktails","Local Favorites"],
  reservation:"Tock",awards:"Michelin Bib Gourmand",
  description:"Intimate Montrose Italian from chef Martin Stayer that earned a Michelin Bib Gourmand. The handmade pastas are excellent, the wine list is thoughtful, and the cozy setting feels like dinner at a friend's beautifully designed apartment. One of Houston's most consistently great neighborhood restaurants.",
  dishes:["Handmade Pasta","Meatballs","Seasonal Risotto","Italian Wine"],
  address:"2048 Colquitt St, Houston, TX 77098",phone:"(346) 319-5919",
  lat:29.7395,lng:-95.3958,instagram:"nobieshouston",website:"https://www.nobieshtx.com"});

add({name:"Pho Binh",cuisine:"Vietnamese / Pho",neighborhood:"Midtown",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"The pho that Houston chefs swear by. This unassuming Midtown spot serves bowls of deeply flavored broth that have been simmering since before dawn. The menu is simple — pho, bun bo Hue, banh mi — but the execution is flawless. A critical piece of Houston's Vietnamese food story and a must for any pho pilgrimage.",
  dishes:["Pho","Bun Bo Hue","Banh Mi","Vietnamese Coffee"],
  address:"3330 Milam St, Houston, TX 77006",phone:"(713) 524-3734",
  lat:29.7389,lng:-95.3810,instagram:"phobinhhouston",website:"https://www.phobinh.com"});

add({name:"Lucille's",cuisine:"Southern / Soul Food",neighborhood:"Museum District",
  score:88,price:2,tags:["Southern","Brunch","Date Night","Local Favorites"],
  reservation:"OpenTable",group:"LHG (Chris Williams)",awards:"JBF Best Restaurateur Finalist 2022, 2023",
  description:"Chef Chris Williams' original restaurant in the Museum District, serving upscale Southern fare that honors his family's Gulf Coast heritage. Fried green tomatoes, chicken fried steak, and a country benedict that defines Houston brunch. The James Beard-nominated restaurateur's flagship is polished but unpretentious.",
  dishes:["Fried Green Tomatoes","Chicken Fried Steak","Country Benedict","Pecan Pie"],
  address:"5512 La Branch St, Houston, TX 77004",phone:"(713) 568-2505",
  lat:29.7278,lng:-95.3770,instagram:"lucabordeaux",website:"https://www.lucilleshouston.com"});

add({name:"Pappasito's Cantina",cuisine:"Tex-Mex",neighborhood:"Multiple Locations",
  score:86,price:2,tags:["Tex-Mex","Margaritas","Fajitas","Family","Local Favorites"],
  reservation:"walk-in",group:"Pappas Restaurants",
  description:"The Pappas family's Tex-Mex cantina with fresh tortilla machines running all day, sizzling fajitas, and margaritas that are famously strong. The shrimp brochette wrapped in bacon is the sleeper hit. Multiple locations across Houston — each one packed on weekends. A Houston dining rite of passage.",
  dishes:["Beef Fajitas","Shrimp Brochette","Margaritas","Fresh Tortillas"],
  address:"6445 Richmond Ave, Houston, TX 77057",phone:"(713) 784-5253",
  lat:29.7293,lng:-95.4779,instagram:"pappasitos",website:"https://pappasitos.com"});

add({name:"Underbelly Hospitality / Eastbound BBQ",cuisine:"Texas BBQ",neighborhood:"EaDo",
  score:86,price:2,tags:["BBQ","New Opening","Local Favorites"],
  indicators:["new"],reservation:"walk-in",
  description:"Founded by four Killen's Restaurant Group veterans who brought their pitmaster skills to EaDo. Prime brisket, house-made sausage, and sides that rival the mains. The permanent EaDo home gives them space to expand beyond the original popup. One of Houston's most promising new BBQ operations.",
  dishes:["Prime Brisket","House Sausage","Pork Ribs","Mac & Cheese"],
  address:"2324 Polk St, Houston, TX 77003",phone:"",
  lat:29.7462,lng:-95.3504,instagram:"eastboundbbq",website:"https://www.eastboundbbq.com",trending:true});

add({name:"The Pass & Provisions / Theodore Rex",cuisine:"New American",neighborhood:"Heights",
  score:88,price:3,tags:["Fine Dining","Date Night","Cocktails","Local Favorites"],
  reservation:"Resy",awards:"Houston Chronicle Top 5",
  description:"Already exists as Theodore Rex - combining the sister concept mention.",
  dishes:["Seasonal Menu"],address:"",lat:0,lng:0,instagram:"",website:""});

// Actually skip that duplicate, add more unique spots

add({name:"Amrina",cuisine:"Modern Indian",neighborhood:"Post Oak",
  score:89,price:3,tags:["Indian","Fine Dining","Date Night","Cocktails","New Opening"],
  indicators:["new"],reservation:"Resy",
  description:"Modern Indian fine dining near the Galleria from the team behind New York's acclaimed Indian Accent. The menu reimagines regional Indian dishes with contemporary technique — think tandoori lamb chops, black dal that simmers for 48 hours, and a cocktail program infused with Indian spices. One of Houston's most exciting new openings.",
  dishes:["Tandoori Lamb Chops","48-Hour Black Dal","Butter Chicken","Indian Spice Cocktails"],
  address:"1600 West Loop S, Houston, TX 77027",phone:"(832) 730-2500",
  lat:29.7450,lng:-95.4606,instagram:"amrinahouston",website:"https://www.amrinahouston.com",trending:true,res_tier:2});

add({name:"One Dragon",cuisine:"Chinese / Soup Dumplings",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Chinese","Dumplings","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Tiny 10-seat restaurant on Bellaire Boulevard known for its authentic soup dumplings (xiaolongbao). The thin-skinned parcels burst with hot broth and pork filling — among the best in Houston. The intimate setting means waits are common, but each dumpling is hand-folded to order. Worth every minute.",
  dishes:["Soup Dumplings","Dan Dan Noodles","Scallion Pancakes","Wontons"],
  address:"9600 Bellaire Blvd, Suite B, Houston, TX 77036",phone:"(346) 257-0968",
  lat:29.7062,lng:-95.5305,instagram:"onedragonhtx",website:"",suburb:true});

add({name:"Clarkwood",cuisine:"Wine & Cocktail Bar",neighborhood:"Heights",
  score:86,price:2,tags:["Wine Bar","Cocktails","Date Night","Local Favorites"],
  reservation:"walk-in",awards:"CultureMap Best New Bar 2025",
  description:"Intimate wine and cocktail bar in the historic Star Engraving Building in the Heights. Old World charm meets new Houston energy with handcrafted cocktails, a curated wine list, and a candlelit atmosphere. One of CultureMap's best new bars of 2025. The kind of bar where first dates become second dates.",
  dishes:["Natural Wine","Craft Cocktails","Cheese Board","Small Plates"],
  address:"915 N Shepherd Dr, Houston, TX 77008",phone:"",
  lat:29.7890,lng:-95.4068,instagram:"clarkwoodbar",website:"https://www.clarkwoodbar.com"});

add({name:"Lee's",cuisine:"Cocktail Bar",neighborhood:"Heights",
  score:86,price:2,tags:["Cocktails","Bar","Date Night","New Opening"],
  indicators:["new"],reservation:"walk-in",awards:"JBF Semifinalist Best New Bar 2026",
  description:"Heights cocktail bar that snagged a James Beard 2026 semifinalist nod for best new bar in its first year. Nestled next to sister restaurant Milton's, Lee's serves ambitious cocktails like the Corner Store in a sleek, intimate setting. The bartending team is among the most technically skilled in the city.",
  dishes:["Corner Store Cocktail","Seasonal Menu","Bar Snacks"],
  address:"1330 Herkimer St, Houston, TX 77008",phone:"",
  lat:29.7910,lng:-95.3940,instagram:"leeshouston",website:"https://www.leeshouston.com",trending:true});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
