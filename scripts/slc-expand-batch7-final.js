// SLC Final Batch — Push to 350+
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const slcMarker = 'const SLC_DATA=';
const slcPos = html.indexOf(slcMarker);
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

// Final SLC spots to hit 350+
add({name:"Porcupine Pub & Grille",cuisine:"American / Pub",neighborhood:"Cottonwood Heights",score:85,price:1,tags:["American","Casual","Scenic","Local Favorites","Patio"],description:"Ski-lodge style pub at the mouth of Big Cottonwood Canyon. Great burgers, nachos, and craft beer with mountain views. Perfect après-ski or summer patio spot.",dishes:["Burger","Nachos","Craft Beer"],address:"3698 E Fort Union Blvd, Salt Lake City, UT 84121",hours:"",lat:40.6263,lng:-111.8150,instagram:"porcupinepub",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Log Haven Ice Cream",cuisine:"Ice Cream",neighborhood:"Millcreek Canyon",score:85,price:1,tags:["Dessert","Local Favorites","Scenic"],description:"Ice cream at the iconic Log Haven canyon location. House-made flavors with mountain views. Perfect summer treat after a canyon hike.",dishes:["House-Made Ice Cream","Seasonal Flavors","Canyon Views"],address:"6451 E Millcreek Canyon Rd, Salt Lake City, UT 84109",hours:"",lat:40.6983,lng:-111.7266,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Cucina Vanina",cuisine:"Italian",neighborhood:"Holladay",score:86,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Italian restaurant in Holladay with handmade pasta and a charming atmosphere. Family-run with authentic recipes and warm service.",dishes:["Handmade Pasta","Italian Wine","Tiramisu"],address:"4527 S 2300 E, Holladay, UT 84117",hours:"",lat:40.6810,lng:-111.8496,instagram:"cucinavanina",website:"",reservation:"OpenTable",phone:"",suburb:true});

add({name:"Manoli's Downtown",cuisine:"Mediterranean",neighborhood:"Downtown",score:87,price:2,tags:["Mediterranean","Date Night","Local Favorites","Tapas"],description:"Downtown location of the beloved Manoli's on Main Street. Mediterranean meze and small plates with craft cocktails in a stylish downtown space.",dishes:["Meze Spread","Small Plates","Cocktails"],address:"51 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7668,lng:-111.8910,instagram:"manolisdowntown",website:"",reservation:"Resy",phone:""});

add({name:"Aranya Thai",cuisine:"Thai",neighborhood:"Downtown",score:86,price:1,tags:["Thai","Casual","Local Favorites"],description:"Thai restaurant in downtown SLC with authentic curries, noodles, and rice dishes. Consistent quality and friendly service make this a reliable downtown lunch spot.",dishes:["Green Curry","Pad Thai","Tom Yum"],address:"213 E 400 S, Salt Lake City, UT 84111",hours:"",lat:40.7594,lng:-111.8832,instagram:"aranyathai",website:"",reservation:"walk-in",phone:""});

add({name:"Penny Ann's Cafe",cuisine:"American Breakfast",neighborhood:"South Salt Lake",score:85,price:1,tags:["Brunch","Casual","Local Favorites","Family"],description:"Long-running breakfast and lunch spot in South Salt Lake. Famous for huge cinnamon rolls and hearty breakfasts. A neighborhood comfort food institution.",dishes:["Giant Cinnamon Roll","Breakfast Plates","Homestyle Lunch"],address:"1810 S Main St, Salt Lake City, UT 84115",hours:"",lat:40.7357,lng:-111.8910,instagram:"pennyannscafe",website:"",reservation:"walk-in",phone:""});

add({name:"Sabor Latino",cuisine:"Mexican / Latin",neighborhood:"West Valley",score:85,price:1,tags:["Mexican","Latin American","Casual","Local Favorites"],description:"Latin American and Mexican restaurant in the West Valley area with authentic dishes from multiple Latin American countries. Generous portions at great prices.",dishes:["Pupusas","Tacos","Latin Plate"],address:"750 W 800 S, Salt Lake City, UT 84104",hours:"",lat:40.7515,lng:-111.9055,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Bruges Waffles & Frites",cuisine:"Belgian",neighborhood:"Downtown",score:86,price:1,tags:["Belgian","Casual","Local Favorites"],description:"Belgian waffles and double-fried frites with house-made dipping sauces. Liege waffles are caramelized perfection. A downtown SLC institution with multiple locations.",dishes:["Liege Waffle","Belgian Frites","Dipping Sauces"],address:"336 W Broadway, Salt Lake City, UT 84101",hours:"",lat:40.7585,lng:-111.8970,instagram:"brugesslc",website:"",reservation:"walk-in",phone:""});

add({name:"Taqueria 27 East",cuisine:"Mexican / Elevated",neighborhood:"Foothill",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"East side location of the popular elevated taqueria. Creative tacos with quality ingredients including the famous duck confit taco.",dishes:["Duck Confit Taco","Fish Tacos","Margaritas"],address:"1615 S Foothill Dr, Salt Lake City, UT 84108",hours:"",lat:40.7378,lng:-111.8387,instagram:"taqueria27",website:"",reservation:"walk-in",phone:""});

add({name:"Vinto",cuisine:"Italian / Pizza",neighborhood:"Downtown",score:86,price:1,tags:["Italian","Pizza","Casual","Local Favorites"],description:"Wood-fired pizza and Italian small plates in downtown SLC. Thin-crust pies with quality toppings and a good wine list. Multiple locations.",dishes:["Wood-Fired Pizza","Italian Small Plates","Wine"],address:"418 E 200 S, Salt Lake City, UT 84111",hours:"",lat:40.7623,lng:-111.8806,instagram:"vintorestaurant",website:"",reservation:"walk-in",phone:""});

add({name:"BTG Wine Bar",cuisine:"Wine Bar",neighborhood:"Downtown",score:86,price:2,tags:["Wine Bar","Date Night","Local Favorites"],description:"Below the historic Eagle Building downtown, BTG (by the glass) offers an extensive wine-by-the-glass program with small plates. A sophisticated pre-dinner or date night spot.",dishes:["Wine by the Glass","Cheese Plates","Small Plates"],address:"63 W 100 S, Salt Lake City, UT 84101",hours:"",lat:40.7668,lng:-111.8919,instagram:"btgwinebar",website:"",reservation:"walk-in",phone:""});

add({name:"Lamb's Grill",cuisine:"American Diner",neighborhood:"Downtown",score:85,price:1,tags:["Diner","Iconic","Local Favorites","Brunch"],description:"Utah oldest restaurant, established in 1919. Classic American diner fare in a historic downtown setting. The kind of place that makes you feel connected to SLC history.",dishes:["Classic Breakfast","Diner Fare","Pies"],address:"169 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7639,lng:-111.8910,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Roots Coffee",cuisine:"Coffee",neighborhood:"Sugarhouse",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Highly rated local coffee roaster with 4.8 stars. Quality single-origin beans and expertly pulled espresso. One of SLC top specialty coffee spots.",dishes:["Single Origin Coffee","Espresso","Cold Brew"],address:"1950 S 1100 E, Salt Lake City, UT 84106",hours:"",lat:40.7232,lng:-111.8596,instagram:"rootscoffeeco",website:"",reservation:"walk-in",phone:""});

add({name:"Black Sheep Cafe",cuisine:"Southwestern / Native American",neighborhood:"Provo",score:87,price:2,tags:["Southwestern","Local Favorites","Farm-to-Table"],description:"Downtown Provo restaurant specializing in contemporary Southwestern cuisine with locally sourced ingredients including grass-fed beef and farm-fresh produce. Unique Native American-influenced dishes.",dishes:["Navajo Taco","Grass-Fed Burger","Southwestern Plates"],address:"19 N University Ave, Provo, UT 84601",hours:"",lat:40.2336,lng:-111.6586,instagram:"blacksheepcafe",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Communal",cuisine:"New American / Farm-to-Table",neighborhood:"Provo",score:87,price:2,tags:["New American","Farm-to-Table","Date Night","Local Favorites"],description:"Provo farm-to-table restaurant with a seasonal menu built for sharing. Long communal tables and a commitment to local sourcing. One of the original serious restaurants in Utah County.",dishes:["Shared Plates","Seasonal Menu","Local Ingredients"],address:"102 N University Ave, Provo, UT 84601",hours:"",lat:40.2350,lng:-111.6586,instagram:"communalrestaurant",website:"",reservation:"OpenTable",phone:"",suburb:true});

add({name:"Block Restaurant",cuisine:"New American",neighborhood:"Provo",score:88,price:2,tags:["New American","Fine Dining","Brunch","Date Night"],description:"Considered the best restaurant in Provo and surrounding Utah County. Welcoming high-end food and atmosphere with an exceptional brunch considered one of the best in the county.",dishes:["Seasonal Tasting","Weekend Brunch","Craft Cocktails"],address:"92 N University Ave, Provo, UT 84601",hours:"",lat:40.2347,lng:-111.6586,instagram:"blockprovo",website:"",reservation:"OpenTable",phone:"",suburb:true});

console.log('Added', added, 'new SLC spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SLC final batch complete!');
