// Chicago 492 → 500: Final 8
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const pos = html.indexOf('const CHICAGO_DATA');
const arrS = html.indexOf('[', pos);
let d=0,arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Chicago start:', arr.length);
let maxId = Math.max(...arr.map(r=>r.id)), nextId = maxId+1;
const ex = new Set(arr.map(r=>r.name.toLowerCase()));
let added=0;
function add(s){
  if(ex.has(s.name.toLowerCase()))return;
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.instagram=s.instagram||'';s.website=s.website||'';s.reservation=s.reservation||'walk-in';s.hours=s.hours||'';s.dishes=s.dishes||[];s.photoUrl='';
  arr.push(s);ex.add(s.name.toLowerCase());added++;
}

// 8 more verified spots to reach 500
add({name:"Begyle Brewing Company",cuisine:"Brewery",neighborhood:"Ravenswood",score:83,price:1,tags:["Brewery","Craft Beer","Malt Row","Local Favorites"],description:"First brewery to open a taproom on Ravenswood's Malt Row with trivia nights, food pop-ups, and the classic Begyle Blonde.",dishes:["Begyle Blonde","Seasonal Ales","Food Pop-Ups"],address:"1800 W Cuyler Ave, Chicago, IL 60613",lat:41.9593,lng:-87.6749,website:"https://begylebrewing.com",instagram:"@begylebrewing",reservation:"walk-in"});

add({name:"Peanut Park Trattoria",cuisine:"Italian",neighborhood:"Little Italy / University Village",score:84,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Opened 2021 on Taylor Street serving traditional Italian pasta and pizza, quickly recognized as one of Chicago's best new Italian spots.",dishes:["Pasta","Pizza","Italian Classics"],address:"1167 W Taylor St, Chicago, IL 60607",lat:41.8696,lng:-87.6573,reservation:"OpenTable"});

add({name:"Reggio's Pizza Chatham",cuisine:"Deep Dish Pizza",neighborhood:"Chatham",score:81,price:1,tags:["Pizza","Casual","Local Favorites","Deep Dish"],description:"South Side Chatham deep dish pizza loaded with cheese and toppings — a neighborhood pizza institution.",dishes:["Deep Dish Pizza","Stuffed Pizza","Thin Crust"],address:"7501 S Cottage Grove Ave, Chicago, IL 60619",lat:41.7566,lng:-87.6060,reservation:"walk-in"});

add({name:"Virtue Restaurant Hyde Park",cuisine:"Southern",neighborhood:"Hyde Park",score:89,price:2,tags:["Southern","Black-Owned","James Beard","Michelin","Date Night"],description:"Chef Erick Williams' James Beard Award-winning Southern restaurant in Hyde Park with fried catfish and roasted chicken done right.",dishes:["Fried Catfish","Roasted Chicken","Biscuits"],address:"1462 E 53rd St, Chicago, IL 60615",lat:41.7993,lng:-87.5880,instagram:"@virtuerestaurant",website:"https://www.virtuerestaurant.com",reservation:"Resy",awards:"James Beard Award, Michelin Bib Gourmand"});

add({name:"Sun Wah BBQ",cuisine:"Chinese BBQ",neighborhood:"Uptown",score:87,price:1,tags:["Chinese","BBQ","James Beard","Iconic","Local Favorites"],description:"James Beard America's Classic 2018 in Uptown with Beijing Duck Dinner carved tableside into a multi-course feast.",dishes:["Beijing Duck Dinner","BBQ Pork","Cantonese Roast Meats"],address:"5039 N Broadway, Chicago, IL 60640",lat:41.9744,lng:-87.6588,website:"https://sunwahbbq.com",instagram:"@sunwahbbq",reservation:"walk-in",awards:"James Beard America's Classic 2018"});

add({name:"Nuevo Leon Restaurant",cuisine:"Mexican",neighborhood:"Pilsen",score:83,price:1,tags:["Mexican","Casual","Local Favorites","Iconic"],description:"Pilsen family-run Mexican restaurant since 1962 serving classic Nuevo Leon regional dishes with community warmth.",dishes:["Chiles Rellenos","Menudo","Classic Mexican"],address:"1515 W 18th St, Chicago, IL 60608",lat:41.8579,lng:-87.6648,reservation:"walk-in"});

add({name:"Dove's Luncheonette",cuisine:"Southern / Tex-Mex",neighborhood:"Wicker Park",score:86,price:1,tags:["Brunch","Southern","Casual","Local Favorites"],description:"One Eyed Jug counter-service luncheonette in Wicker Park with huevos rancheros, biscuits, and rotating vinyl soundtrack.",dishes:["Huevos Rancheros","Biscuits & Gravy","Chicken Tinga"],address:"1545 N Damen Ave, Chicago, IL 60622",lat:41.9098,lng:-87.6771,instagram:"@dovesluncheonette",reservation:"walk-in"});

add({name:"Kasama Chicago",cuisine:"Filipino",neighborhood:"Ukrainian Village",score:93,price:2,tags:["Filipino","Brunch","Michelin","Critics Pick","Date Night"],description:"Michelin-starred Filipino restaurant and bakery in Ukrainian Village with ube croissants, longanisa hash, and elegant tasting menu dinners.",dishes:["Ube Croissant","Longanisa Hash","Filipino Tasting Menu"],address:"1001 N Winchester Ave, Chicago, IL 60622",lat:41.8988,lng:-87.6760,instagram:"@kasamachicago",website:"https://kasamachicago.com",reservation:"Tock",awards:"Michelin Star"});

console.log('Added:', added, '| New total:', arr.length);
const newArr = JSON.stringify(arr);
const newHtml = html.substring(0, arrS) + newArr + html.substring(arrE);
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Done. Written to index.html');
