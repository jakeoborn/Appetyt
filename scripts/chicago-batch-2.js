// Chicago Batch 2: 25 essential neighborhood restaurants, pizza, bars, new openings
// Run: node scripts/chicago-batch-2.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const chiKey = "'Chicago': [";
const chiIdx = html.indexOf(chiKey, html.indexOf('const CITY_DATA'));
const chiArr = html.indexOf('[', chiIdx + 10);
let d = 0, e = chiArr;
for (let i = chiArr; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') d--;
  if (d === 0) { e = i + 1; break; }
}
const arr = JSON.parse(html.slice(chiArr, e));
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
    website:s.website||'',suburb:false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// === LOGAN SQUARE / BUCKTOWN ===
add({name:"Andros Taverna",cuisine:"Modern Greek",neighborhood:"Logan Square",
  score:89,price:2,tags:["Greek","Date Night","Cocktails","Local Favorites"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"Modern Greek taverna in Logan Square earning rave reviews and a Michelin Bib Gourmand. The lamb shoulder, whole fish, and saganaki are authentic but refined. The patio is one of the best in the neighborhood and the Greek wine list is a revelation. A Logan Square essential.",
  dishes:["Lamb Shoulder","Whole Fish","Saganaki","Greek Wine"],
  address:"2542 N Milwaukee Ave, Chicago, IL 60647",phone:"(773) 360-7781",
  lat:41.9275,lng:-87.6982,instagram:"androstaverna",website:"https://www.androstaverna.com"});

add({name:"Lardon",cuisine:"Deli / Charcuterie",neighborhood:"Logan Square",
  score:86,price:1,tags:["Deli","Breakfast","Casual","Local Favorites","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Logan Square deli and charcuterie shop that earned a Michelin Bib Gourmand for its house-cured meats, sandwiches, and breakfast plates. The pastrami is cured in-house, the egg sandwiches are perfect, and the grab-and-go provisions make it a neighborhood anchor. From the team behind Union and Meadowlark.",
  dishes:["House Pastrami","Egg Sandwich","Charcuterie","Provisions"],
  address:"2200 N California Ave, Chicago, IL 60647",phone:"(773) 360-8736",
  lat:41.9213,lng:-87.6975,instagram:"lardonchicago",website:"https://www.lardonchicago.com"});

add({name:"Scofflaw",cuisine:"Cocktail Bar / Gastropub",neighborhood:"Logan Square",
  score:86,price:2,tags:["Cocktails","Bar","Gastropub","Late Night","Local Favorites"],
  reservation:"walk-in",
  description:"Logan Square gin bar and gastropub with a deep cocktail menu, rotating craft beer, and kitchen food that goes way beyond bar snacks. The Scofflaw burger is legendary and the gin collection is the most serious in Chicago. A neighborhood institution for the cocktail-obsessed.",
  dishes:["Scofflaw Burger","Gin Cocktails","Bar Snacks","Craft Beer"],
  address:"3201 W Armitage Ave, Chicago, IL 60647",phone:"(773) 252-9700",
  lat:41.9173,lng:-87.7068,instagram:"scofflawbar",website:"https://www.scofflawchicago.com"});

// === WICKER PARK ===
add({name:"Mindy's Bakery",cuisine:"Bakery / Pastry",neighborhood:"Wicker Park",
  score:87,price:1,tags:["Bakery","Breakfast","Coffee","Local Favorites"],
  reservation:"walk-in",awards:"James Beard Award Winner (Mindy Segal)",
  description:"James Beard Award-winning pastry chef Mindy Segal's bakery in Wicker Park. The Hot Chocolate cookie is iconic, the croissants are buttery perfection, and the seasonal pies have their own cult following. Originally Hot Chocolate, now reborn as a bakery-first concept. A Wicker Park sweet-tooth essential.",
  dishes:["Hot Chocolate Cookie","Croissants","Seasonal Pies","Coffee"],
  address:"1747 N Damen Ave, Chicago, IL 60647",phone:"(773) 489-1747",
  lat:41.9126,lng:-87.6769,instagram:"mindysbakery",website:"https://www.mindysbakery.com"});

add({name:"Smoke Daddy",cuisine:"BBQ / Live Music",neighborhood:"Wicker Park",
  score:84,price:2,tags:["BBQ","Live Music","Bar","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Wicker Park BBQ joint with live blues and jazz nightly. Pulled pork, ribs, and brisket in a honky-tonk atmosphere where the music is as good as the food. The patio is packed in summer and the whiskey list is deep. Chicago's best combination of BBQ and live music.",
  dishes:["Pulled Pork","Ribs","Brisket","Live Music"],
  address:"1804 W Division St, Chicago, IL 60622",phone:"(773) 772-6656",
  lat:41.9029,lng:-87.6741,instagram:"smokedaddychi",website:"https://www.smokedaddychicago.com"});

// === PILSEN ===
add({name:"S.K.Y.",cuisine:"Creative Asian-American",neighborhood:"Pilsen",
  score:89,price:3,tags:["Asian Fusion","Date Night","Cocktails","Critics Pick"],
  reservation:"Resy",awards:"Michelin Recommended",
  description:"Already in data — checking.",
  dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Taqueria Los Comales",cuisine:"Mexican / Tacos",neighborhood:"Pilsen",
  score:84,price:1,tags:["Mexican","Tacos","Casual","Cheap Eats","Local Favorites"],
  reservation:"walk-in",
  description:"Pilsen taqueria that's been the neighborhood's go-to for decades. Al pastor carved from the trompo, birria tacos, and breakfast burritos that fuel the morning commute. Cash-friendly, no-frills, and the green salsa is fire. The kind of taqueria every neighborhood deserves.",
  dishes:["Al Pastor","Birria Tacos","Breakfast Burritos","Green Salsa"],
  address:"3141 W 26th St, Chicago, IL 60623",phone:"(773) 277-3312",
  lat:41.8441,lng:-87.7058,instagram:"taquerialoscomales",website:""});

// === RIVER NORTH / GOLD COAST ===
add({name:"RPM Seafood",cuisine:"Seafood",neighborhood:"River North",
  score:88,price:3,tags:["Seafood","Fine Dining","Date Night","River Views"],
  reservation:"OpenTable",group:"Lettuce Entertain You",
  description:"LEYE's seafood showcase on the Chicago River with floor-to-ceiling windows and pristine fish preparations. The raw bar is excellent, the lobster risotto is a signature, and the river views make every table feel like a celebration. Part of the RPM restaurant family from Giuliana and Bill Rancic.",
  dishes:["Raw Bar","Lobster Risotto","Grilled Fish","River Views"],
  address:"317 N Clark St, Chicago, IL 60654",phone:"(312) 280-4776",
  lat:41.8882,lng:-87.6314,instagram:"rpmseafood",website:"https://www.rpmrestaurants.com/rpm-seafood",res_tier:2});

add({name:"Maple & Ash",cuisine:"Steakhouse / Seafood",neighborhood:"Gold Coast",
  score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],
  reservation:"OpenTable",
  description:"Already in data — skip check.",
  dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Adalina Prime",cuisine:"Steakhouse / Italian",neighborhood:"West Loop",
  score:90,price:4,tags:["Steakhouse","Italian","Date Night","Celebrities"],
  reservation:"OpenTable",
  description:"West Loop steakhouse from Top Chef alum Soo Ahn that's become the celebrity dinner spot in Chicago. Alex Bregman, Stephen Curry, and Uma Thurman have all been spotted here. The dry-aged steaks and Italian-inspired sides blend two of Chicago's strongest dining traditions. The most buzzy opening of 2024.",
  dishes:["Dry-Aged Steaks","Italian Sides","Raw Bar","Cocktails"],
  address:"1120 W Fulton Market, Chicago, IL 60607",phone:"(312) 667-0877",
  lat:41.8867,lng:-87.6555,instagram:"adalinaprime",website:"https://www.adalinaprime.com",trending:true});

// === SOUTH SIDE / HYDE PARK ===
add({name:"Virtue Restaurant & Bar",cuisine:"Southern",neighborhood:"Hyde Park",
  score:88,price:2,tags:["Southern","Date Night","Cocktails","Local Favorites","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand, JBF Best Chef Midwest Nominee",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Vito & Nick's",cuisine:"Tavern-Style Pizza",neighborhood:"Ashburn (South Side)",
  score:88,price:1,tags:["Pizza","Casual","Classic","Local Favorites"],
  reservation:"walk-in",awards:"Chicago institution since 1950s",
  description:"The platonic ideal of Chicago tavern-style pizza since the 1950s. Cracker-thin crust cut in squares, quality mozzarella, and fennel-spiced sausage. The South Side location requires a pilgrimage from downtown but locals insist this defines authentic Chicago tavern-style. No deep dish debate here — this IS Chicago pizza.",
  dishes:["Tavern-Style Pizza","Sausage Pizza","Thin Crust"],
  address:"8433 S Pulaski Rd, Chicago, IL 60652",phone:"(773) 735-2050",
  lat:41.7400,lng:-87.7208,instagram:"vitoandnicks",website:"https://www.vitoandnicks.com"});

add({name:"Pat's Pizza",cuisine:"Tavern-Style Pizza",neighborhood:"Lincoln Park",
  score:87,price:1,tags:["Pizza","Casual","Classic","Local Favorites"],
  reservation:"walk-in",awards:"Chicago institution since 1950",
  description:"Opened in 1950 and still serving what pizza experts call the gold standard of tavern-style. Thin, crispy, generously topped with quality mozzarella and cut in squares as God intended. The Lincoln Park location is the original. If you only eat one thin-crust in Chicago, make it Pat's.",
  dishes:["Tavern-Style Pizza","Sausage","Cheese Pizza"],
  address:"2679 N Lincoln Ave, Chicago, IL 60614",phone:"(773) 248-0168",
  lat:41.9294,lng:-87.6497,instagram:"patspizza",website:"https://www.patspizzachicago.com"});

// === BARS & COCKTAILS ===
add({name:"The Aviary",cuisine:"Cocktail Lounge",neighborhood:"West Loop / Fulton Market",
  score:91,price:3,tags:["Cocktails","Fine Dining","Date Night","Exclusive"],
  reservation:"Tock",awards:"World's 50 Best Bars",group:"Alinea Group",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Kumiko",cuisine:"Japanese Cocktail Bar",neighborhood:"West Loop",
  score:89,price:3,tags:["Cocktails","Japanese","Bar","Date Night"],
  reservation:"Resy",awards:"World's 50 Best Bars, James Beard Semifinalist",
  description:"Julia Momosé's Japanese-inspired cocktail bar in the West Loop serving drinks rooted in seasonal Japanese philosophy. Each cocktail is a meditation on balance and technique, served in custom glassware. JBF semifinalist and consistently ranked among the world's best bars. The omakase cocktail experience is transformative.",
  dishes:["Seasonal Cocktails","Omakase Cocktail Pairing","Japanese Bar Snacks"],
  address:"630 W Lake St, Chicago, IL 60661",phone:"(312) 285-2912",
  lat:41.8856,lng:-87.6440,instagram:"barkumiko",website:"https://www.barkumiko.com"});

add({name:"The Whistler",cuisine:"Cocktail Bar / Gallery",neighborhood:"Logan Square",
  score:87,price:2,tags:["Cocktails","Bar","Live Music","Art Gallery","Local Favorites"],
  reservation:"walk-in",
  description:"Logan Square cocktail bar, art gallery, and live music venue rolled into one. The drinks are creative and affordable, the DJs spin jazz and electronic, and the rotating art shows give you something to look at between sips. The quintessential Logan Square bar experience.",
  dishes:["Craft Cocktails","Art Gallery","Live Music","Bar Snacks"],
  address:"2421 N Milwaukee Ave, Chicago, IL 60647",phone:"(773) 227-3530",
  lat:41.9260,lng:-87.6967,instagram:"thewhistlerbar",website:"https://www.whistlerchicago.com"});

// === NEW OPENINGS & TRENDING ===
add({name:"Gingie",cuisine:"American / Shared Plates",neighborhood:"River North",
  score:87,price:2,tags:["American","Date Night","Cocktails","New Opening"],
  indicators:["new"],reservation:"Resy",group:"Boka Restaurant Group",
  description:"Boka Restaurant Group's newest concept in River North replacing GT Prime. Chef Brian Lockwood's 150-seat restaurant centers on shareable American plates — from raw bar to wood-fired meats — in a buzzy, social setting. The Boka team's track record (Girl & the Goat, Swift & Sons) makes this a safe bet.",
  dishes:["Shared Plates","Raw Bar","Wood-Fired Meats","Cocktails"],
  address:"707 N Wells St, Chicago, IL 60654",phone:"(312) 600-6776",
  lat:41.8942,lng:-87.6343,instagram:"gingiechicago",website:"https://www.gingiechicago.com",trending:true});

add({name:"The Alston",cuisine:"Steakhouse / Fine Dining",neighborhood:"Gold Coast",
  score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Exclusive","New Opening"],
  indicators:["new"],reservation:"Tock",
  description:"Ultra-luxe Gold Coast steakhouse from the Esmé team. The duck press is the signature theatrical dish, and chef Jenner Tomaska brings the same Michelin-starred technique to premium steaks. The most opulent new steakhouse opening in Chicago — expect white tablecloths, proper service, and prices to match.",
  dishes:["Duck Press","Prime Steaks","Seafood Tower","Fine Dining"],
  address:"27 E Delaware Pl, Chicago, IL 60611",phone:"(312) 202-6464",
  lat:41.8992,lng:-87.6268,instagram:"thealstonchicago",website:"https://www.thealstonchicago.com",trending:true,res_tier:1});

add({name:"Hokkaido Ramen Santouka",cuisine:"Japanese Ramen",neighborhood:"West Loop",
  score:86,price:1,tags:["Japanese","Ramen","Casual","New Opening"],
  indicators:["new"],reservation:"walk-in",
  description:"Tokyo ramen institution makes its West Loop debut with signature shio tonkotsu broth, Shio, Shoyu, and Miso bowls alongside karaage and gyoza. The broth is simmered for 20+ hours using Hokkaido-sourced ingredients. A serious ramen addition to Chicago's Japanese food scene.",
  dishes:["Shio Ramen","Tonkotsu","Gyoza","Karaage"],
  address:"210 N Green St, Chicago, IL 60607",phone:"(312) 890-1122",
  lat:41.8860,lng:-87.6489,instagram:"santouka_usa",website:"https://www.santouka-usa.com",trending:true});

add({name:"Kasama",cuisine:"Filipino / Fine Dining",neighborhood:"West Town",
  score:94,price:3,tags:["Filipino","Fine Dining","Bakery","Brunch","Awards"],
  reservation:"Tock",awards:"Michelin 2 Stars (2025), first Filipino Michelin-starred restaurant in the US",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === MORE ESSENTIALS ===
add({name:"Girl & the Goat",cuisine:"New American / Eclectic",neighborhood:"West Loop",
  score:91,price:3,tags:["American","Date Night","Cocktails","Awards","Local Favorites"],
  reservation:"Resy",awards:"Michelin Bib Gourmand, Top Chef Winner (Stephanie Izard)",group:"Boka Restaurant Group",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Portillo's",cuisine:"Chicago Fast Food / Hot Dogs",neighborhood:"Multiple Locations",
  score:84,price:1,tags:["Hot Dogs","Burgers","Italian Beef","Fast Food","Local Favorites"],
  reservation:"walk-in",awards:"Chicago institution since 1963",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"RPM Italian",cuisine:"Italian",neighborhood:"River North",
  score:89,price:3,tags:["Italian","Date Night","Fine Dining","Celebrities"],
  reservation:"OpenTable",group:"Lettuce Entertain You",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Little Goat Diner",cuisine:"American Diner",neighborhood:"West Loop",
  score:86,price:1,tags:["American","Brunch","Casual","Local Favorites"],
  reservation:"walk-in",group:"Boka Restaurant Group",
  description:"Stephanie Izard's casual West Loop diner serving elevated comfort food — fat Elvis waffles, goat sloppy joes, and Izard's signature playful flavors in a retro diner setting. The breakfast menu is available all day and the bakery counter sells addictive cookies and pastries. Girl & the Goat's fun younger sibling.",
  dishes:["Fat Elvis Waffles","Goat Sloppy Joe","Breakfast All Day","Bakery Counter"],
  address:"820 W Randolph St, Chicago, IL 60607",phone:"(312) 888-3455",
  lat:41.8845,lng:-87.6484,instagram:"littlegoatchicago",website:"https://www.littlegoatchicago.com"});

add({name:"Frontera Grill",cuisine:"Regional Mexican",neighborhood:"River North",
  score:89,price:2,tags:["Mexican","Local Favorites","Awards","Casual"],
  reservation:"walk-in",awards:"James Beard Outstanding Restaurant",group:"Bayless Restaurants",
  description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// Write back
html = html.slice(0, chiArr) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Chicago: ' + arr.length + ' spots (added ' + added + ' this batch)');
