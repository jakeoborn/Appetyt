// Austin Batch 1: Michelin-starred + key Bib Gourmand + BBQ essentials (25 spots)
// Austin currently has 55 spots, targeting 250
// Run: node scripts/austin-batch-1.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r => r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
let added = 0;

function add(s) {
  if (existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,
    score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',
    reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,
    dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,
    bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,
    trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',
    website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// === MICHELIN STARRED ===

add({name:"Hestia",cuisine:"Live-Fire Fine Dining",neighborhood:"Downtown",
  score:95,price:4,tags:["Fine Dining","Tasting Menu","Date Night","Awards","Celebrations"],
  reservation:"Resy",awards:"Michelin 1 Star, Michelin Green Star (sustainability)",group:"Emmer & Rye Hospitality",
  description:"Chef Kevin Fink's downtown live-fire restaurant where every dish passes through the custom-built wood-burning hearth. The tasting menu showcases Texas ingredients with primal cooking technique — think ember-roasted carrots, whole-animal preparations, and pastry chef Tavel Bristol-Joseph's legendary desserts. One of the first Michelin stars in Texas history.",
  dishes:["Live-Fire Tasting Menu","Ember-Roasted Vegetables","Pastry Course","Texas Wine Pairing"],
  address:"607 W 3rd St, Austin, TX 78701",phone:"(512) 333-0737",
  lat:30.2660,lng:-97.7510,instagram:"hestiaaustin",website:"https://www.hestiaaustin.com",res_tier:1});

add({name:"Barley Swine",cuisine:"New American Tasting Menu",neighborhood:"North Loop",
  score:93,price:3,tags:["Fine Dining","Tasting Menu","Date Night","Awards","Local Favorites"],
  reservation:"Resy",awards:"Michelin 1 Star",
  description:"Chef Bryce Gilmore's intimate North Loop tasting menu restaurant that earned a Michelin star with hyper-seasonal, ingredient-driven cooking. The multi-course menu changes constantly based on what's best from local farms. One of Austin's most consistently excellent restaurants since 2010. BYOB-friendly.",
  dishes:["Seasonal Tasting Menu","Local Farm Vegetables","Gulf Seafood","Dessert Course"],
  address:"6555 Burnet Rd, Suite 400, Austin, TX 78757",phone:"(512) 394-8150",
  lat:30.3365,lng:-97.7389,instagram:"barleyswine",website:"https://www.barleyswine.com"});

add({name:"Olamaie",cuisine:"Southern Fine Dining",neighborhood:"Downtown",
  score:93,price:3,tags:["Southern","Fine Dining","Date Night","Awards","Celebrations"],
  reservation:"Resy",awards:"Michelin 1 Star, JBF Best Chef Texas Finalist",
  description:"Chef Michael Fojtasek's refined Southern restaurant in a historic downtown bungalow. The biscuits are legendary — possibly the best in America. The menu draws from Southern tradition with modern technique, using Texas ingredients prepared with grace. The intimate bungalow setting makes every dinner feel personal. Michelin-starred and JBF-nominated.",
  dishes:["Famous Biscuits","Gulf Shrimp & Grits","Seasonal Southern Plates","Pecan Pie"],
  address:"1610 San Antonio St, Austin, TX 78701",phone:"(512) 474-2796",
  lat:30.2758,lng:-97.7472,instagram:"olamaieaustin",website:"https://www.olamaie.com",res_tier:1});

add({name:"Craft Omakase",cuisine:"Japanese Omakase",neighborhood:"East Austin",
  score:92,price:4,tags:["Japanese","Omakase","Fine Dining","Date Night","Exclusive","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",
  description:"Intimate 8-seat omakase counter in East Austin where chef crafts a 17+ course Japanese tasting experience. Fish sourced from Tokyo's markets alongside Gulf Coast catches. One of the hardest reservations in Austin — tickets drop on Tock and vanish. Michelin-starred sushi perfection.",
  dishes:["17-Course Omakase","Seasonal Nigiri","A5 Wagyu","Sake Pairing"],
  address:"1209 E 6th St, Austin, TX 78702",phone:"",
  lat:30.2631,lng:-97.7289,instagram:"craftomakase",website:"https://www.craftomakase.com",res_tier:1});

add({name:"InterStellar BBQ",cuisine:"Texas BBQ",neighborhood:"North Austin",
  score:92,price:2,tags:["BBQ","Awards","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin 1 Star, Texas Monthly Top 50 BBQ",
  description:"John Bates' Michelin-starred BBQ in north Austin — one of only a handful of BBQ joints in the world with a Michelin star. The brisket is competition-grade perfection, the pork ribs are candy-sweet, and the sides are made from scratch daily. Lines start hours before opening. Worth every minute.",
  dishes:["Brisket","Pork Ribs","Sausage","Cream Corn"],
  address:"12233 Ranch Rd 620 N, Suite 105, Austin, TX 78750",phone:"(512) 382-6248",
  lat:30.4260,lng:-97.8345,instagram:"interstellarbbq",website:"https://www.interstellarbbq.com",suburb:true});

add({name:"La Barbecue",cuisine:"Texas BBQ",neighborhood:"East Austin",
  score:93,price:2,tags:["BBQ","Awards","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin 1 Star, Texas Monthly Top 50 BBQ",
  description:"Pitmaster LeAnn Mueller's East Austin BBQ trailer-turned-brick-and-mortar with a Michelin star. The brisket is moist, peppery, and perfect. The El Sancho brisket taco is a cult classic. Mueller family BBQ royalty — her father Bobby Mueller taught Aaron Franklin. Lines are legendary but move fast.",
  dishes:["Brisket","El Sancho Taco","Pulled Pork","Sausage"],
  address:"2401 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 605-9696",
  lat:30.2548,lng:-97.7221,instagram:"labarbecue",website:"https://www.labarbecue.com"});

add({name:"LeRoy and Lewis Barbecue",cuisine:"New-School BBQ",neighborhood:"South Austin",
  score:91,price:2,tags:["BBQ","Awards","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin 1 Star",
  description:"Evan LeRoy's new-school BBQ that earned a Michelin star with creative preparations that go beyond traditional Texas BBQ. The beef cheeks, Wagyu tri-tip, and seasonal specials push BBQ into fine-dining territory while the brisket stays classic. The brick-and-mortar on Emerald Forest is the permanent home.",
  dishes:["Beef Cheeks","Wagyu Tri-Tip","Brisket","Seasonal Specials"],
  address:"5621 Emerald Forest Dr, Austin, TX 78745",phone:"(512) 945-9882",
  lat:30.2105,lng:-97.7815,instagram:"leroyandlewis",website:"https://leroyandlewisbbq.com"});

// === MICHELIN BIB GOURMAND ===

add({name:"Franklin Barbecue",cuisine:"Texas BBQ",neighborhood:"East Austin",
  score:97,price:2,tags:["BBQ","Iconic","Awards","Critics Pick","Tourist Attraction"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, James Beard Award Winner, Texas Monthly #1",
  description:"The most famous BBQ joint in America. Aaron Franklin's brisket — smoked low and slow over post oak — is the gold standard against which all other brisket is measured. The line starts at 6am for an 11am opening. Bring chairs, coolers, and patience. Worth it. James Beard Award for Best Chef and a cultural phenomenon.",
  dishes:["Brisket","Pork Ribs","Pulled Pork","Turkey"],
  address:"900 E 11th St, Austin, TX 78702",phone:"(512) 653-1187",
  lat:30.2701,lng:-97.7276,instagram:"franklinbbq",website:"https://franklinbbq.com"});

add({name:"Nixta Taqueria",cuisine:"Mexican / Nixtamal",neighborhood:"East Austin",
  score:91,price:1,tags:["Mexican","Tacos","Awards","Local Favorites","Cheap Eats"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, Michelin Green Star, JBF Semifinalist",
  description:"Chef Edgar Rico's East Austin taqueria built around house-nixtamalized corn. The blue corn duck confit taco and beet tostada are unlike anything else in Austin. Michelin Bib Gourmand AND Green Star for sustainability — the only taqueria in the world with both. Lines form early and sellouts happen.",
  dishes:["Duck Confit Taco","Beet Tostada","Blue Corn Tortillas","Seasonal Specials"],
  address:"2512 E 12th St, Austin, TX 78702",phone:"(512) 551-0390",
  lat:30.2729,lng:-97.7195,instagram:"nixtataqueria",website:"https://www.nixtataqueria.com"});

add({name:"Dai Due",cuisine:"Texas / Farm-to-Table",neighborhood:"East Austin",
  score:89,price:2,tags:["American","Farm-to-Table","Brunch","Awards","Local Favorites"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, Michelin Green Star",
  description:"Chef Jesse Griffiths' butcher shop and restaurant in East Austin celebrating Texas hunting, fishing, and foraging traditions. The menu is dictated by what's in season — wild boar, venison, Gulf fish — prepared with respect and skill. Double Michelin honoree (Bib Gourmand + Green Star). The brunch is outstanding.",
  dishes:["Wild Game Plates","Gulf Seafood","Butcher's Cut","Brunch"],
  address:"2406 Manor Rd, Austin, TX 78722",phone:"(512) 524-0688",
  lat:30.2757,lng:-97.7174,instagram:"daidue",website:"https://www.daidue.com"});

add({name:"Kemuri Tatsu-Ya",cuisine:"Japanese BBQ / Izakaya",neighborhood:"East Austin",
  score:90,price:2,tags:["Japanese","BBQ","Cocktails","Date Night","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",group:"Tatsu-Ya",
  description:"The Japanese-Texas BBQ mashup from the Tatsu-Ya team. Smoked brisket meets Japanese technique — think dashi-braised pork belly, smoked wagyu tataki, and the famous Tiger Cry brisket. The cocktail program is one of Austin's best. Michelin Bib Gourmand and utterly unique.",
  dishes:["Tiger Cry Brisket","Smoked Wagyu Tataki","Dashi Pork Belly","Japanese Cocktails"],
  address:"2713 E 2nd St, Austin, TX 78702",phone:"(512) 893-5561",
  lat:30.2574,lng:-97.7194,instagram:"kemuritatsuyaatx",website:"https://www.kemuritatsuyaatx.com"});

add({name:"Distant Relatives",cuisine:"African / BBQ Fusion",neighborhood:"East Austin",
  score:89,price:2,tags:["African","BBQ","Awards","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Chef Damien Brockway's celebration of African diaspora cuisine through the lens of Texas BBQ. Suya-spiced brisket, jollof rice, and smoked oxtail bridge Africa and Austin in every bite. Michelin Bib Gourmand and one of the most culturally important restaurants in the city.",
  dishes:["Suya Brisket","Jollof Rice","Smoked Oxtail","Plantains"],
  address:"4601 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 766-8458",
  lat:30.2519,lng:-97.7094,instagram:"distant_relatives_atx",website:"https://www.distantrelativesatx.com"});

add({name:"Cuantos Tacos",cuisine:"Mexican / Creative Tacos",neighborhood:"East Austin",
  score:87,price:1,tags:["Mexican","Tacos","Casual","Awards","Cheap Eats"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Creative East Austin taqueria with a Michelin Bib Gourmand that elevates the breakfast and lunch taco game. The birria taco, migas, and seasonal specials use quality ingredients in a casual counter-service setting. Proof that great tacos deserve Michelin recognition.",
  dishes:["Birria Tacos","Migas","Breakfast Tacos","Seasonal Specials"],
  address:"1108 E 12th St, Austin, TX 78702",phone:"(512) 520-0637",
  lat:30.2720,lng:-97.7303,instagram:"cuantostacos",website:"https://www.cuantostacos.com"});

add({name:"Parish Barbecue",cuisine:"Louisiana-Texas BBQ",neighborhood:"East Austin",
  score:88,price:2,tags:["BBQ","Southern","Awards","New Opening","Local Favorites"],
  indicators:["new"],reservation:"walk-in",awards:"Michelin Bib Gourmand 2025",
  description:"New Bib Gourmand winner merging Louisiana and Texas BBQ traditions. The boudin, smoked ribs, and daily specials draw lines behind Batch Craft Beer on East Cesar Chavez. The Cajun-Texas fusion is unique to Austin and already earning national attention.",
  dishes:["Boudin","Smoked Ribs","Brisket","Cajun Sides"],
  address:"3220 Manor Rd, Austin, TX 78723",phone:"",
  lat:30.2807,lng:-97.7094,instagram:"parishbbq",website:"https://www.parishbbq.com",trending:true});

add({name:"Mercado Sin Nombre",cuisine:"Mexican / Market",neighborhood:"East Austin",
  score:87,price:1,tags:["Mexican","Market","Casual","Awards","New Opening"],
  indicators:["new"],reservation:"walk-in",awards:"Michelin Bib Gourmand 2025",
  description:"New Bib Gourmand Mexican market-restaurant hybrid in East Austin serving tortas, tamales, and market plates with ingredients sourced from Texas farms and Mexican traditions. The freshness and care in every dish earned Michelin recognition in its first year.",
  dishes:["Tortas","Tamales","Market Plates","Agua Frescas"],
  address:"1108 E Cesar Chavez St, Austin, TX 78702",phone:"",
  lat:30.2533,lng:-97.7303,instagram:"mercadosinnombre",website:"https://www.mercadosinnombre.com",trending:true});

// === MICHELIN RECOMMENDED ===

add({name:"Odd Duck",cuisine:"New American / Farm-to-Table",neighborhood:"South Lamar",
  score:91,price:2,tags:["American","Farm-to-Table","Date Night","Awards","Cocktails"],
  reservation:"Resy",awards:"Michelin Recommended",
  description:"Chef Bryce Gilmore's South Lamar farm-to-table restaurant where the ever-changing menu showcases local ingredients in creative small plates. Started as a food trailer and grew into one of Austin's most beloved restaurants. The pork belly bites and seasonal vegetables are signatures. Michelin recommended.",
  dishes:["Pork Belly Bites","Seasonal Vegetables","Farm Plates","Craft Cocktails"],
  address:"1201 S Lamar Blvd, Austin, TX 78704",phone:"(512) 433-6521",
  lat:30.2517,lng:-97.7681,instagram:"oddduckaustin",website:"https://www.oddduckaustin.com"});

add({name:"Suerte",cuisine:"Mexican / Regional",neighborhood:"East Austin",
  score:90,price:2,tags:["Mexican","Date Night","Cocktails","Awards","Critics Pick"],
  reservation:"Resy",awards:"Michelin Recommended",
  description:"Contemporary Mexican in East Austin with a focus on regional Mexican cooking and nixtamal corn. The suadero tacos, yellow mole, and tableside guacamole are exceptional. The mezcal program is one of the best in Texas. Michelin recommended and consistently one of Austin's best restaurants.",
  dishes:["Suadero Tacos","Yellow Mole","Tableside Guacamole","Mezcal Flights"],
  address:"1800 E 6th St, Austin, TX 78702",phone:"(512) 953-0082",
  lat:30.2621,lng:-97.7240,instagram:"suerteaustin",website:"https://www.suerteatx.com"});

add({name:"Lenoir",cuisine:"Hot Weather Food",neighborhood:"South Austin",
  score:90,price:3,tags:["Fine Dining","Date Night","Wine Bar","Awards","Patio"],
  reservation:"Resy",awards:"Michelin Recommended, Michelin 1 Star (2024)",
  description:"Chef Todd Duplechan's intimate 'hot weather food' restaurant in South Austin with a magical wine garden patio. The seasonal menu draws from Gulf Coast, Mediterranean, and Southeast Asian traditions — all suited to Austin's climate. The wine garden is one of the most romantic dining spots in the city.",
  dishes:["Seasonal Hot Weather Menu","Wine Garden","Gulf Seafood","Dessert Course"],
  address:"1807 S 1st St, Austin, TX 78704",phone:"(512) 215-9778",
  lat:30.2453,lng:-97.7573,instagram:"lenoirrestaurant",website:"https://www.lenoirrestaurant.com"});

add({name:"Launderette",cuisine:"New American / Mediterranean",neighborhood:"East Austin",
  score:89,price:2,tags:["American","Brunch","Date Night","Patio","Awards"],
  reservation:"Resy",awards:"Michelin Recommended",
  description:"Rene Ortiz's East Austin restaurant in a converted laundromat with Michelin-recommended New American cooking. The weekend brunch is legendary — the green chili queso and ricotta hotcakes draw lines. Dinner is equally impressive with Mediterranean-leaning plates and a smart wine list.",
  dishes:["Green Chili Queso","Ricotta Hotcakes","Brunch","Dinner Plates"],
  address:"2115 Holly St, Austin, TX 78702",phone:"(512) 382-1599",
  lat:30.2565,lng:-97.7216,instagram:"laundetteaustin",website:"https://www.launderetteaustin.com"});

add({name:"Terry Black's Barbecue",cuisine:"Texas BBQ",neighborhood:"South Congress",
  score:89,price:2,tags:["BBQ","Local Favorites","Awards","Family"],
  reservation:"walk-in",awards:"Michelin Recommended, Texas Monthly Top 50 BBQ",
  description:"The Black family BBQ dynasty's Austin outpost on South Congress. Central Texas BBQ tradition — post-oak smoked brisket, sausage, and ribs — in a massive indoor-outdoor space. No multi-hour lines like Franklin, but the quality is Michelin-recommended. The moist brisket and jalapeño cheddar sausage are the moves.",
  dishes:["Moist Brisket","Jalapeño Cheddar Sausage","Beef Ribs","Mac & Cheese"],
  address:"1003 Barton Springs Rd, Austin, TX 78704",phone:"(512) 394-5899",
  lat:30.2604,lng:-97.7563,instagram:"terryblacksbbq",website:"https://www.terryblacksbbq.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Austin: ' + arr.length + ' spots (added ' + added + ' this batch)');
