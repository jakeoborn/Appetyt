// SLC Expansion Batch 2 — Targeting const SLC_DATA correctly
// Sources: Gastronomic SLC, Salt Lake Magazine, Infatuation, City Cast, Timeout, web search verified
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find SLC_DATA properly
const slcMarker = 'const SLC_DATA=';
const slcPos = html.indexOf(slcMarker);
if (slcPos === -1) { console.error('SLC_DATA not found!'); process.exit(1); }
const arrS = html.indexOf('[', slcPos);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting SLC:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// === SLC RESTAURANTS FROM VERIFIED SOURCES ===

// From Gastronomic SLC + Infatuation
add({name:"Manoli's",cuisine:"Mediterranean",neighborhood:"Downtown",score:89,price:2,tags:["Mediterranean","Date Night","Local Favorites","Tapas"],description:"Mediterranean-inspired small shareable meze made with fresh local ingredients. Charred octopus and yemista (smoked feta-stuffed piquillo peppers) are highlights. One of SLC most beloved restaurants.",dishes:["Charred Octopus","Yemista","Meze Spread"],address:"402 E 900 S, Salt Lake City, UT 84111",hours:"",lat:40.7479,lng:-111.8804,instagram:"manolisslc",website:"",reservation:"Resy",phone:""});

add({name:"Red Iguana",cuisine:"Mexican",neighborhood:"Downtown",score:88,price:1,tags:["Mexican","Local Favorites","Iconic","Family"],description:"Making some of the city best Mexican food since 1985. Famous for their extensive mole selection -- seven different moles available daily. Locations right by the airport make it an arrival or departure tradition.",dishes:["Mole Sampler","Chile Verde","Enchiladas"],address:"736 W North Temple, Salt Lake City, UT 84116",hours:"",lat:40.7716,lng:-111.9048,instagram:"rediguana",website:"https://www.rediguana.com",reservation:"walk-in",phone:"(801) 322-1489"});

add({name:"9-UP Night Market",cuisine:"Taiwanese",neighborhood:"South Salt Lake",score:87,price:1,tags:["Taiwanese","Asian","Casual","Local Favorites","Late Night"],description:"Taiwanese comfort food on the west side of South Salt Lake Chinatown Supermarket. Braised pork belly in burger-sized bao buns and rice bowls. A tribute to Taiwanese night market culture.",dishes:["Pork Belly Bao","Rice Bowls","Taiwanese Street Food"],address:"3390 S State St, South Salt Lake, UT 84115",hours:"",lat:40.6988,lng:-111.8881,instagram:"9upnightmarket",website:"",reservation:"walk-in",phone:""});

add({name:"Eva's Bakery",cuisine:"French Bakery",neighborhood:"Downtown",score:87,price:1,tags:["Bakery/Coffee","Brunch","Local Favorites"],description:"In the heart of SLC serving bread, French pastries, sandwiches, and more. The croissants are flaky and buttery, and the sandwiches on house-baked bread are excellent lunch options.",dishes:["Croissants","Sandwiches","French Pastries"],address:"155 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7639,lng:-111.8910,instagram:"evasbakeryslc",website:"https://www.evasbakery.net",reservation:"walk-in",phone:"(801) 355-3942"});

add({name:"Tulie Bakery",cuisine:"French Bakery",neighborhood:"9th and 9th",score:87,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Seasonal French pastries and fantastic pies. Known for exceptional Thanksgiving pies but excellent year-round. A neighborhood favorite in the 9th and 9th district.",dishes:["Seasonal Pies","Croissants","French Pastries"],address:"863 E 700 S, Salt Lake City, UT 84102",hours:"",lat:40.7515,lng:-111.8695,instagram:"tuliebakery",website:"",reservation:"walk-in",phone:"(801) 883-9590"});

add({name:"Water Witch",cuisine:"Cocktail Bar",neighborhood:"Central 9th",score:89,price:2,tags:["Cocktails","Date Night","Critics Pick"],description:"2025 James Beard Foundation finalist for Outstanding Bar Program. Compact cocktail bar in Central 9th with what many call the finest sake selection in SLC. Has raised the city reputation for exceptional mixology.",dishes:["Craft Cocktails","Sake Selection","Bar Snacks"],address:"163 W 900 S, Salt Lake City, UT 84101",hours:"",lat:40.7479,lng:-111.8923,instagram:"waterwitchbar",website:"https://www.waterwitchbar.com",reservation:"walk-in",phone:"",awards:"James Beard Outstanding Bar finalist 2025"});

add({name:"Repeal",cuisine:"Fine Dining / Jazz Bar",neighborhood:"Downtown",score:88,price:3,tags:["Cocktails","Fine Dining","Live Music","Date Night"],description:"Speakeasy-style jazz bar with refined small plates and handcrafted cocktails. Extensive whiskey collection with live jazz sets each evening. From the owners of Prohibition. 21+ only.",dishes:["Small Plates","Craft Cocktails","Whiskey Selection"],address:"365 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7610,lng:-111.8910,instagram:"repealslc",website:"",reservation:"Resy",phone:""});

add({name:"Rouser",cuisine:"New American / Wood-Fired",neighborhood:"Downtown",score:89,price:3,tags:["New American","Fine Dining","Date Night","Hotel"],description:"Located in the Asher Adams hotel with a wood-fired Josper grill. Refined New American with excellent steaks and seasonal dishes. One of SLC newest upscale dining destinations.",dishes:["Josper-Grilled Steak","Seasonal Menu","Hotel Dining"],address:"110 W 300 S, Salt Lake City, UT 84101",hours:"",lat:40.7631,lng:-111.8924,instagram:"rouserslc",website:"",reservation:"Resy",phone:""});

add({name:"Loki Coffee",cuisine:"Coffee",neighborhood:"Downtown",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Named CW Best Coffee Shop 2025. Specialty coffee from Idle Hands Roasting plus Asian-inspired pastries from Tomodachi bakery. Spacious interior with outlets at every table.",dishes:["Specialty Coffee","Asian Pastries","Pour Over"],address:"215 S State St, Salt Lake City, UT 84111",hours:"",lat:40.7630,lng:-111.8881,instagram:"lokicoffeeslc",website:"",reservation:"walk-in",phone:""});

add({name:"Cupla Coffee",cuisine:"Coffee / Bakery",neighborhood:"Downtown",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Run by identical twins Abigail and Bethany. Small batch roastery and bakery with a cozy atmosphere. One of SLC most charming coffee spots.",dishes:["Small Batch Coffee","Pastries","Espresso"],address:"53 W 200 S, Salt Lake City, UT 84101",hours:"",lat:40.7645,lng:-111.8916,instagram:"cuplacoffee",website:"",reservation:"walk-in",phone:""});

add({name:"Blind Rabbit Kitchen",cuisine:"Cocktail Bar / Restaurant",neighborhood:"Sugar House",score:86,price:2,tags:["Cocktails","New American","Date Night","Local Favorites"],description:"Sugar House newcomer that is a cocktail bar restaurant where craft cocktail lovers gather. Creative drinks and elevated bar food in a stylish space.",dishes:["Craft Cocktails","Elevated Bar Food","Small Plates"],address:"2148 S Highland Dr, Salt Lake City, UT 84106",hours:"",lat:40.7217,lng:-111.8609,instagram:"blindrabbitslc",website:"",reservation:"walk-in",phone:""});

// === PARK CITY ===

add({name:"Le Depot",cuisine:"French Brasserie",neighborhood:"Park City",score:89,price:3,tags:["French","Fine Dining","Date Night","Celebrations"],description:"Opened February 2025 from former Yuta chef Galen Zamarra inside Park City historic 1886 Union Pacific Depot. French classics like steak frites with bearnaise, coq au vin, and a Grande Fruit de Mer tower with oysters, clams, and lobster tail.",dishes:["Steak Frites","Coq au Vin","Fruit de Mer Tower"],address:"820 Bonanza Dr, Park City, UT 84060",hours:"",lat:40.6461,lng:-111.5008,instagram:"ledepotpc",website:"",reservation:"Resy",phone:""});

add({name:"Matilda",cuisine:"Italian / Pizza",neighborhood:"Park City",score:87,price:2,tags:["Italian","Pizza","Local Favorites","Casual"],description:"Instant hit with locals when it opened early 2025. Modern space with warm wood accents and an open kitchen centered around a Marra Forni pizza oven. Creative pizzas and Italian dishes.",dishes:["Wood-Fired Pizza","Italian Small Plates","Pasta"],address:"1612 Ute Blvd, Park City, UT 84098",hours:"",lat:40.6683,lng:-111.5049,instagram:"matildaparkcity",website:"",reservation:"OpenTable",phone:""});

add({name:"Riverhorse on Main",cuisine:"New American",neighborhood:"Park City",score:89,price:3,tags:["Fine Dining","Date Night","Celebrations","Iconic"],description:"Utah only restaurant with both the DiRoNA Award and Forbes Travel Guide Four-Star Rating plus AAA four-diamond award. Park City most celebrated fine dining destination on Historic Main Street.",dishes:["Elk Tenderloin","Pan-Seared Sea Bass","Seasonal Tasting"],address:"540 Main St, Park City, UT 84060",hours:"",lat:40.6461,lng:-111.4984,instagram:"riverhorseonmain",website:"https://www.riverhorseparkcity.com",reservation:"OpenTable",phone:"(435) 649-3536",awards:"DiRoNA, Forbes 4-Star, AAA 4-Diamond"});

add({name:"Firewood on Main",cuisine:"Wood-Fire American",neighborhood:"Park City",score:88,price:3,tags:["New American","Fine Dining","Date Night"],description:"Amazing woodfire-cooked entrees in five courses with fantastic dinner menu and ambiance on Park City Historic Main Street.",dishes:["Wood-Fired Entrees","Five-Course Dinner","Seasonal Menu"],address:"306 Main St, Park City, UT 84060",hours:"",lat:40.6453,lng:-111.4978,instagram:"firewoodonmain",website:"https://www.firewoodonmain.com",reservation:"OpenTable",phone:"(435) 252-9900"});

add({name:"Freshies",cuisine:"Seafood / Lobster Rolls",neighborhood:"Park City",score:86,price:2,tags:["Seafood","Casual","Local Favorites"],description:"Known for lobster rolls -- the Real Mainah Lobster Roll features a toasted New England bun with fresh lobster flown in daily, mayo, hot butter, and seasoning. Casual Park City staple.",dishes:["Lobster Roll","Fish Tacos","Clam Chowder"],address:"1465 Park Ave, Park City, UT 84060",hours:"",lat:40.6526,lng:-111.5027,instagram:"freshiespc",website:"",reservation:"walk-in",phone:"(435) 649-1909"});

add({name:"High West Saloon",cuisine:"American / Whiskey Bar",neighborhood:"Park City",score:87,price:2,tags:["American","Cocktails","Iconic","Local Favorites"],description:"Priority one if you only have time for one restaurant in Park City. Craft whiskey distillery and saloon on Historic Main Street. Great food, incredible whiskey flights, and a unique Park City experience.",dishes:["Whiskey Flights","Elk Burger","Bar Bites"],address:"703 Park Ave, Park City, UT 84060",hours:"",lat:40.6473,lng:-111.5001,instagram:"highwest",website:"https://www.highwest.com",reservation:"walk-in",phone:"(435) 649-8300"});

// === MORE SLC AREA ===

add({name:"Kyoto",cuisine:"Japanese",neighborhood:"Downtown",score:86,price:2,tags:["Japanese","Sushi","Local Favorites","Casual"],description:"Japanese restaurant with tempura, noodle soups, and a sushi bar. Multiple locations across SLC. Reliable and consistent Japanese fare.",dishes:["Sushi","Tempura","Udon"],address:"1080 E 1300 S, Salt Lake City, UT 84105",hours:"",lat:40.7389,lng:-111.8682,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Proper Burger",cuisine:"Burgers",neighborhood:"Downtown",score:85,price:1,tags:["Burgers","Casual","Local Favorites"],description:"12+ burger styles with vegan options in downtown SLC. Part of the Proper Brewing Co family. Great burgers at reasonable prices with craft beer on tap.",dishes:["Signature Burgers","Vegan Burger","Craft Beer"],address:"865 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7507,lng:-111.8910,instagram:"properburger",website:"",reservation:"walk-in",phone:""});

add({name:"Bruges Waffles & Frites",cuisine:"Belgian",neighborhood:"Downtown",score:86,price:1,tags:["Belgian","Casual","Local Favorites"],description:"Belgian waffles and frites (fries) with house-made dipping sauces. The Liege waffles are caramelized and perfect, and the frites are double-fried and crispy. A downtown SLC institution.",dishes:["Liege Waffle","Belgian Frites","Dipping Sauces"],address:"336 W Broadway, Salt Lake City, UT 84101",hours:"",lat:40.7585,lng:-111.8970,instagram:"brugesslc",website:"",reservation:"walk-in",phone:""});

add({name:"Enrico's Deli",cuisine:"Italian Deli / NYC-Style",neighborhood:"South Jordan",score:85,price:1,tags:["Italian","Casual","Local Favorites"],description:"Italian-NYC style deli with pizza by the slice and pastrami. The sandwiches are piled high and the pizza slices are properly foldable. Worth the drive south.",dishes:["Pastrami Sandwich","Pizza by Slice","Italian Sub"],address:"10581 S Redwood Rd, South Jordan, UT 84095",hours:"",lat:40.5579,lng:-111.9388,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Real Taqueria",cuisine:"Mexican",neighborhood:"Holladay",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"Carne asada specialist in Holladay. Authentic Mexican with excellent meats and fresh salsas. A neighborhood taqueria that locals love.",dishes:["Carne Asada","Street Tacos","Salsa Bar"],address:"4588 S Highland Dr, Holladay, UT 84117",hours:"",lat:40.6810,lng:-111.8609,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Guisado's Homestyle Cooking",cuisine:"Mexican",neighborhood:"Taylorsville",score:85,price:1,tags:["Mexican","Local Favorites","Casual","Family"],description:"Family-style Mexican cooking in Taylorsville with hearty portions and authentic recipes. Home-cooked flavors that remind you of abuela kitchen.",dishes:["Guisados","Tamales","Mexican Plate"],address:"5400 S Redwood Rd, Taylorsville, UT 84123",hours:"",lat:40.6506,lng:-111.9388,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Gossip Kitchen",cuisine:"New American",neighborhood:"Downtown",score:87,price:2,tags:["New American","Brunch","Local Favorites"],description:"Hot new restaurant in downtown SLC from the Yelp best-new list. Creative New American with strong brunch offerings.",dishes:["Brunch Plates","Creative American","Cocktails"],address:"155 E 200 S, Salt Lake City, UT 84111",hours:"",lat:40.7637,lng:-111.8856,instagram:"gossipkitchenslc",website:"",reservation:"Resy",phone:""});

add({name:"Engine Room",cuisine:"New American / Industrial",neighborhood:"Sugar House",score:87,price:2,tags:["New American","Date Night","Local Favorites"],description:"Hot new restaurant in the Sugar House area. Industrial-chic space with creative New American cooking.",dishes:["Seasonal Menu","Craft Cocktails","Small Plates"],address:"2207 S Highland Dr, Salt Lake City, UT 84106",hours:"",lat:40.7210,lng:-111.8609,instagram:"engineroomslc",website:"",reservation:"Resy",phone:""});

add({name:"Via Veneto Pizzarium",cuisine:"Roman Pizza",neighborhood:"Liberty Park",score:86,price:1,tags:["Pizza","Italian","Casual","Local Favorites"],description:"Roman-style pizza al taglio (by the cut) across from Liberty Park. Rectangular slices sold by weight -- a style rarely found in Utah. Fresh toppings and perfectly crispy crust.",dishes:["Pizza al Taglio","Roman-Style Slices","Italian Sodas"],address:"1056 E 900 S, Salt Lake City, UT 84105",hours:"",lat:40.7479,lng:-111.8687,instagram:"viaveneto.slc",website:"",reservation:"walk-in",phone:""});

add({name:"Mother",cuisine:"Coffee / Bar",neighborhood:"Marmalade",score:85,price:1,tags:["Bakery/Coffee","Cocktails","Local Favorites"],description:"Coffee shop by day, bar by night in the Marmalade neighborhood. Great vibes, good drinks, and a neighborhood hangout that transforms after dark.",dishes:["Specialty Coffee","Cocktails","Light Bites"],address:"470 N 300 W, Salt Lake City, UT 84103",hours:"",lat:40.7726,lng:-111.8970,instagram:"motherslc",website:"",reservation:"walk-in",phone:""});

add({name:"Salt Lake Roasting Co.",cuisine:"Coffee",neighborhood:"University",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Over 45 freshly roasted coffees plus handmade desserts, breakfast burritos, and acai bowls near the University of Utah. A long-standing SLC coffee institution.",dishes:["Roasted Coffee","Breakfast Burritos","Acai Bowls"],address:"320 E 400 S, Salt Lake City, UT 84111",hours:"",lat:40.7594,lng:-111.8814,instagram:"slcroasting",website:"",reservation:"walk-in",phone:""});

add({name:"Pie Party",cuisine:"Bakery / Pie Shop",neighborhood:"Sugar House",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"First brick-and-mortar location for pie and sweet treats in SLC. Creative pies and desserts that have built a devoted following.",dishes:["Seasonal Pies","Sweet Treats","Whole Pies"],address:"3130 S Highland Dr, Salt Lake City, UT 84106",hours:"",lat:40.6957,lng:-111.8609,instagram:"piepartyslc",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new SLC spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SLC batch 2 complete!');
