// Seattle Batch 6 — Pizza, Mexican, West Seattle, Georgetown, Columbia City, Beacon Hill
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

// === PIZZA ===
add({name:"Dino's Tomato Pie",cuisine:"Pizza / Italian",neighborhood:"Capitol Hill",score:89,price:2,tags:["Pizza","Date Night","Local Favorites","Critics Pick","Late Night"],description:"Throwback Capitol Hill pizzeria from Delancey's Brandon Pettit and Molly Wizenberg. New Jersey-style round and square pies with bright tomato sauce, top-notch toppings, charred crust. 21+, famous for vodka sauce and garlic knots.",dishes:["Square Sicilian Pie","Garlic Knots","Vodka Sauce Pizza"],address:"1524 E Olive Way, Seattle, WA 98122",lat:47.6183,lng:-122.3260,instagram:"dinostomatopie",website:"https://www.dinostomatopie.com",reservation:"walk-in",phone:"(206) 403-1742"});

add({name:"Windy City Pie",cuisine:"Chicago Pizza",neighborhood:"Phinney Ridge",score:90,price:2,tags:["Pizza","Date Night","Local Favorites","Critics Pick"],description:"Phinney Ridge specialist in Chicago-style deep-dish pizza. Grinds their own sausages, pickles sweet hot peppers in-house, serves delicious pies with salads and homemade garlic brioche.",dishes:["Deep Dish Pizza","House Sausage","Garlic Brioche"],address:"5918 Phinney Ave N, Seattle, WA 98103",lat:47.6723,lng:-122.3542,instagram:"windycitypie",website:"https://windycitypie.com",reservation:"walk-in",phone:"(206) 486-4743",hours:"Tue-Thu 4PM-9PM, Fri-Sat 12PM-10PM, Sun 12PM-9PM"});

add({name:"Serious Pie Downtown",cuisine:"Pizza / Italian",neighborhood:"Downtown",score:88,price:2,tags:["Pizza","Date Night","Local Favorites","Iconic"],description:"Tom Douglas's original pizzeria in downtown Seattle. Wood-fired, artisan pizzas with blistered crusts and seasonal toppings. One of the only places in Seattle slinging crisp Connecticut-style pies.",dishes:["Wood-Fired Pizza","Seasonal Pies","Artisan Crust"],address:"2001 4th Ave, Seattle, WA 98121",lat:47.6126,lng:-122.3411,instagram:"seriouspieseattle",website:"https://www.seriouspieseattle.com",reservation:"OpenTable",phone:"(206) 838-7388",group:"Tom Douglas"});

// === MEXICAN ===
add({name:"La Carta de Oaxaca",cuisine:"Mexican / Oaxacan",neighborhood:"Ballard",score:90,price:2,tags:["Mexican","Date Night","Local Favorites","Iconic","Critics Pick"],description:"Traditional cuisine and spirits of Oaxaca, Mexico on Ballard Avenue since December 2003. Authentic Oaxacan moles, handmade tortillas, and mezcal. A Seattle-Ballard institution.",dishes:["Mole Negro","Mezcal","Handmade Tortillas"],address:"5431 Ballard Ave NW, Seattle, WA 98107",lat:47.6680,lng:-122.3837,instagram:"lacartadeoaxaca",website:"https://seattlemeetsoaxaca.com",reservation:"walk-in",phone:"(206) 782-8722"});

add({name:"Tacos Chukis",cuisine:"Mexican / Tacos",neighborhood:"Capitol Hill",score:88,price:1,tags:["Mexican","Casual","Local Favorites","Critics Pick"],description:"Capitol Hill taqueria known for some of Seattle's best al pastor tacos. Small counter-service spot with an authentic feel, generous portions, and affordable prices. Multiple locations around Seattle.",dishes:["Al Pastor","Chukis Taco","Quesadilla"],address:"219 Broadway E, Seattle, WA 98102",lat:47.6197,lng:-122.3210,instagram:"tacoschukis",website:"https://www.seattlechukis.com",reservation:"walk-in",phone:"(206) 328-4447"});

// === WEST SEATTLE ===
add({name:"Marination Ma Kai",cuisine:"Hawaiian / Korean",neighborhood:"West Seattle",score:88,price:2,tags:["Hawaiian","Korean","Scenic","Casual","Local Favorites"],description:"Hawaiian-Korean fusion on Alki waterfront with stunning views of Elliott Bay and the Seattle skyline. Kalua pork sliders, Korean-style tacos, pork katsu sandwich. Casual counter service with patio.",dishes:["Kalua Pork Slider","Korean Tacos","Pork Katsu Sandwich"],address:"1660 Harbor Ave SW, Seattle, WA 98126",lat:47.5915,lng:-122.3776,instagram:"marinationmakai",website:"https://marinationmobile.com",reservation:"walk-in",phone:"(206) 328-8226"});

add({name:"Ma'ono Fried Chicken",cuisine:"Hawaiian / Fried Chicken",neighborhood:"West Seattle",score:89,price:2,tags:["Hawaiian","Casual","Local Favorites","Critics Pick"],description:"West Seattle destination for exceptional fried chicken with Hawaiian-inspired flavors. Whiskey program in the Benbow Room off the alley. Chef Mark Fuller's original location.",dishes:["Fried Chicken","Chicken Sandwich","Hawaiian Plates"],address:"4210 SW Admiral Way, Seattle, WA 98116",lat:47.5818,lng:-122.3831,instagram:"maonoseattle",website:"https://www.maonoseattle.com",reservation:"walk-in",phone:"(206) 730-8243",hours:"Mon-Sat 4PM-10PM"});

// === GEORGETOWN ===
add({name:"The Corson Building",cuisine:"New American / Farm-to-Table",neighborhood:"Georgetown",score:92,price:4,tags:["New American","Fine Dining","Date Night","Critics Pick","Celebrations"],description:"Legitimately special-occasion restaurant in a 1910 Italianate cottage in Georgetown. Chef Emily Crawford Dann invents seasonal, farm-to-table dishes. Intimate, chef-driven tasting menu experience.",dishes:["Seasonal Tasting Menu","Farm-to-Table","Chef's Menu"],address:"5609 Corson Ave S, Seattle, WA 98108",lat:47.5526,lng:-122.3203,instagram:"thecorsonbuilding",website:"https://www.thecorsonbuilding.com",reservation:"Resy",phone:"(206) 762-3330"});

add({name:"Deep Sea Sugar & Salt",cuisine:"Bakery / Layer Cakes",neighborhood:"Georgetown",score:91,price:2,tags:["Bakery/Coffee","Local Favorites","Critics Pick"],description:"Georgetown layer cake specialists with beautifully made cakes in flavor combinations like dark chocolate porter or earl grey with bergamot mascarpone cream. Moved from pop-up to brick-and-mortar shop.",dishes:["Dark Chocolate Porter Cake","Earl Grey Cake","Layer Cakes"],address:"6235 Airport Way S, Seattle, WA 98108",lat:47.5463,lng:-122.3257,instagram:"deepseasugarandsalt",website:"https://www.deepseasugarandsalt.com",reservation:"walk-in",phone:"(206) 588-1186"});

// === COLUMBIA CITY ===
add({name:"La Medusa",cuisine:"Sicilian / Italian",neighborhood:"Columbia City",score:89,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick"],description:"Southern Italian restaurant in the heart of Columbia City embodying the warmth of Sicilian home cooking. Specializes in homemade pasta and Sicilian dishes. Reservations recommended.",dishes:["Homemade Pasta","Sicilian Classics","Seasonal Menu"],address:"4857 Rainier Ave S, Seattle, WA 98118",lat:47.5591,lng:-122.2819,instagram:"lamedusaseattle",website:"https://www.lamedusarestaurant.com",reservation:"OpenTable",phone:"(206) 723-2192"});

// === BEACON HILL ===
add({name:"Homer",cuisine:"Mediterranean / Middle Eastern",neighborhood:"Beacon Hill",score:91,price:3,tags:["Mediterranean","Middle Eastern","Date Night","Critics Pick","Local Favorites"],description:"Beacon Hill neighborhood restaurant serving Middle Eastern and Mediterranean-inspired cuisine influenced by Pacific Northwest ingredients. Chef-driven seasonal menu in a warm neighborhood setting.",dishes:["Hummus","Seasonal Mezze","Mediterranean Mains"],address:"3013 Beacon Ave S, Seattle, WA 98144",lat:47.5789,lng:-122.3115,instagram:"restauranthomer",website:"https://www.restauranthomer.com",reservation:"Tock",phone:"(206) 785-6099",hours:"Tue-Sun 5PM-10PM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 6 complete!');
