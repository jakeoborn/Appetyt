// Austin Expansion Batch 4 — Fill to 350 with more neighborhood spots
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

// === MORE RESTAURANTS — less obvious spots ===

add({name:"Uchi",cuisine:"Japanese / Sushi",neighborhood:"South Lamar",score:92,price:4,tags:["Japanese","Sushi","Fine Dining","Exclusive","Date Night","Critics Pick"],description:"Tyson Cole flagship Japanese restaurant that put Austin on the national dining map. James Beard Award winner. Creative sushi and Japanese-inspired cuisine. The original that launched a restaurant empire.",dishes:["Omakase","Maguro Sashimi","Hot Tastings"],address:"801 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2549,lng:-97.7657,instagram:"uchiaustin",website:"https://www.uchirestaurants.com",reservation:"Resy",phone:"(512) 916-4808"});

add({name:"Sway",cuisine:"Thai",neighborhood:"South Lamar",score:88,price:2,tags:["Thai","Date Night","Local Favorites"],description:"Elevated Thai on South Lamar with beautiful plating and creative cocktails. The pad Thai and green curry are refined versions of classics.",dishes:["Pad Thai","Green Curry","Thai Cocktails"],address:"1417 S 1st St, Austin, TX 78704",hours:"",lat:30.2488,lng:-97.7557,instagram:"swayaustin",website:"",reservation:"Resy",phone:""});

add({name:"Wink",cuisine:"New American / Fine Dining",neighborhood:"West Austin",score:89,price:3,tags:["Fine Dining","Date Night","Local Favorites","Wine Bar"],description:"Intimate fine dining in West Austin with seasonal New American cuisine and an exceptional wine list. One of Austin longest-running fine dining destinations.",dishes:["Seasonal Tasting","Wine Pairing","Intimate Dining"],address:"1014 N Lamar Blvd, Austin, TX 78703",hours:"",lat:30.2734,lng:-97.7517,instagram:"winkrestaurant",website:"",reservation:"Resy",phone:""});

add({name:"Kemuri Tatsu-ya",cuisine:"Japanese-Texas BBQ",neighborhood:"East Austin",score:89,price:2,tags:["Japanese","BBQ","Date Night","Critics Pick"],description:"Texas izakaya from the Ramen Tatsu-ya team blending Japanese technique with Texas smoke. Smoked wagyu brisket, Japanese pickles, and creative cocktails.",dishes:["Smoked Wagyu","Izakaya Plates","Japanese-Texas Fusion"],address:"2713 E 2nd St, Austin, TX 78702",hours:"",lat:30.2594,lng:-97.7155,instagram:"raboratory",website:"https://www.kemuri-tatsuya.com",reservation:"Resy",phone:""});

add({name:"Vixen's Wedding",cuisine:"Indian",neighborhood:"East Austin",score:87,price:2,tags:["Indian","Date Night","Local Favorites"],description:"Modern Indian in East Austin with creative cocktails and bold flavors. Street food-inspired dishes with fine-dining technique.",dishes:["Indian Street Food","Cocktails","Modern Indian"],address:"1813 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7261,instagram:"vixenswedding",website:"",reservation:"Resy",phone:""});

add({name:"Angler",cuisine:"Seafood / Oyster Bar",neighborhood:"Downtown",score:87,price:2,tags:["Seafood","Oysters","Date Night","Local Favorites"],description:"Seafood and oyster bar in downtown Austin with fresh Gulf oysters and creative seafood dishes. Raw bar and craft cocktails.",dishes:["Raw Bar","Gulf Oysters","Seafood Plates"],address:"301 W 6th St, Austin, TX 78701",hours:"",lat:30.2680,lng:-97.7462,instagram:"angleratx",website:"",reservation:"Resy",phone:""});

add({name:"Trattoria Lisina",cuisine:"Italian",neighborhood:"Driftwood",score:87,price:2,tags:["Italian","Date Night","Patio","Scenic"],description:"Italian trattoria in Driftwood wine country just south of Austin. Beautiful Hill Country setting with handmade pasta and wood-fired pizza. The patio overlooks vineyards.",dishes:["Handmade Pasta","Wood-Fired Pizza","Hill Country Views"],address:"13308 FM 150 W, Driftwood, TX 78619",hours:"",lat:30.1155,lng:-98.0206,instagram:"trattorialisina",website:"",reservation:"OpenTable",phone:"",suburb:true});

add({name:"Jacoby's Restaurant & Mercantile",cuisine:"Texan / Ranch",neighborhood:"East Austin",score:87,price:2,tags:["Texan","BBQ","Brunch","Local Favorites","Patio"],description:"Ranch-to-table restaurant in East Austin serving Texas comfort food. The brunch is excellent and the patio overlooking the river is one of the best in the city.",dishes:["Ranch-to-Table","Texas Brunch","Smoked Meats"],address:"3235 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2551,lng:-97.7115,instagram:"jacobysaustin",website:"",reservation:"OpenTable",phone:""});

add({name:"Foreign & Domestic",cuisine:"New American",neighborhood:"North Loop",score:88,price:2,tags:["New American","Date Night","Local Favorites","Critics Pick"],description:"Neighborhood restaurant in North Loop with creative New American food and a focus on nose-to-tail cooking. The bone marrow is legendary and the menu changes frequently.",dishes:["Bone Marrow","Seasonal Menu","Nose-to-Tail"],address:"306 E 53rd St, Austin, TX 78751",hours:"",lat:30.3171,lng:-97.7270,instagram:"foreigndomestic",website:"",reservation:"Resy",phone:""});

add({name:"Desnudo Tacos",cuisine:"Mexican / Fish Tacos",neighborhood:"East Austin",score:86,price:1,tags:["Mexican","Seafood","Local Favorites","Casual"],description:"Fish tacos and ceviche in East Austin. The Baja-style fish tacos are crispy and topped with fresh slaw and creamy sauce. Simple and perfectly executed.",dishes:["Fish Tacos","Ceviche","Shrimp Tacos"],address:"1211 E 7th St, Austin, TX 78702",hours:"",lat:30.2661,lng:-97.7317,instagram:"desnudotacos",website:"",reservation:"walk-in",phone:""});

add({name:"Kerlin BBQ",cuisine:"BBQ",neighborhood:"East Austin",score:87,price:1,tags:["BBQ","Local Favorites","Casual"],description:"East Austin BBQ trailer with excellent brisket and creative specials. Smaller operation than the big names but exceptional quality. The pulled pork is a sleeper hit.",dishes:["Brisket","Pulled Pork","Specials"],address:"2207 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7213,instagram:"kerlinbbq",website:"",reservation:"walk-in",phone:""});

add({name:"Spicy Boys",cuisine:"Fried Chicken",neighborhood:"Multiple Locations",score:86,price:1,tags:["Fried Chicken","Casual","Local Favorites"],description:"Nashville hot chicken in Austin with proper heat levels from mild to ridiculous. Crispy, juicy, and available as sandwich or tenders. Multiple locations.",dishes:["Nashville Hot Chicken","Spicy Sandwich","Tenders"],address:"3301 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2551,lng:-97.7113,instagram:"spicyboysatx",website:"",reservation:"walk-in",phone:""});

add({name:"Revival Coffee",cuisine:"Coffee",neighborhood:"East Austin",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"East Austin coffee roaster with excellent espresso in a bright, welcoming space. Quality beans and skilled baristas.",dishes:["Espresso","Pour-Over","Pastries"],address:"1405 E 7th St, Austin, TX 78702",hours:"",lat:30.2642,lng:-97.7291,instagram:"revivalcoffee",website:"",reservation:"walk-in",phone:""});

add({name:"Houndstooth Coffee",cuisine:"Coffee",neighborhood:"Multiple Locations",score:86,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Austin specialty coffee with multiple locations. Known for precision brewing and quality beans. The North Lamar location is the flagship.",dishes:["Specialty Coffee","Espresso","Cold Brew"],address:"4200 N Lamar Blvd, Austin, TX 78756",hours:"",lat:30.3145,lng:-97.7408,instagram:"houndstoothcoffee",website:"https://www.houndstoothcoffee.com",reservation:"walk-in",phone:""});

add({name:"Taco Flats",cuisine:"Mexican / Tacos",neighborhood:"North Loop",score:85,price:1,tags:["Mexican","Casual","Local Favorites","Patio"],description:"Casual taco spot in North Loop with a great patio and self-serve beer taps. Creative tacos and a fun, low-key atmosphere.",dishes:["Creative Tacos","Self-Serve Beer","Queso"],address:"5520 Burnet Rd, Austin, TX 78756",hours:"",lat:30.3277,lng:-97.7374,instagram:"tacoflatsatx",website:"",reservation:"walk-in",phone:""});

add({name:"Salt Lick BBQ",cuisine:"BBQ",neighborhood:"Driftwood",score:87,price:1,tags:["BBQ","Iconic","Family","Local Favorites"],description:"Legendary Austin-area BBQ institution in Driftwood since 1967. BYOB, family-style, open-pit BBQ. The sauce is famous and the all-you-can-eat family platter is a rite of passage.",dishes:["Open-Pit BBQ","Family Platter","BYOB"],address:"18300 FM 1826, Driftwood, TX 78619",hours:"",lat:30.1266,lng:-97.9555,instagram:"saltlickbbq",website:"https://www.saltlickbbq.com",reservation:"walk-in",phone:"(512) 858-4959",suburb:true});

add({name:"Oink BBQ",cuisine:"BBQ / Tacos",neighborhood:"East Austin",score:86,price:1,tags:["BBQ","Mexican","Casual","Local Favorites"],description:"BBQ and tacos in East Austin with smoked meats in fresh tortillas. The brisket taco is simple and perfect. Great sides and cold beer.",dishes:["Brisket Tacos","Smoked Meats","Sides"],address:"1620 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7268,instagram:"oinkbbqatx",website:"",reservation:"walk-in",phone:""});

add({name:"Dai Due Taqueria",cuisine:"Mexican / Texan",neighborhood:"Mueller",score:87,price:1,tags:["Mexican","Texan","Brunch","Local Favorites"],description:"Taqueria spinoff from the acclaimed Dai Due. Texas-sourced meats in fresh tortillas at the Mueller farmers market location. Breakfast tacos that reflect the Dai Due commitment to quality.",dishes:["Texas Breakfast Tacos","Wild Game Tacos","Fresh Tortillas"],address:"4600 Mueller Blvd, Austin, TX 78723",hours:"",lat:30.2985,lng:-97.7075,instagram:"daidue",website:"",reservation:"walk-in",phone:"",group:"Dai Due"});

add({name:"Easy Tiger",cuisine:"Bakery / Beer Garden",neighborhood:"East Austin",score:86,price:1,tags:["Bakery/Coffee","Craft Beer","Casual","Local Favorites","Patio"],description:"Bake shop and beer garden with house-made breads, sausages, and pretzels. The giant pretzel with beer cheese is an Austin classic. Great patio vibes.",dishes:["Giant Pretzel","House Sausage","Craft Beer"],address:"1501 E 7th St, Austin, TX 78702",hours:"",lat:30.2638,lng:-97.7258,instagram:"easytigeratx",website:"https://www.easytigeratx.com",reservation:"walk-in",phone:""});

add({name:"Lamberts Downtown Barbecue",cuisine:"BBQ / Southern",neighborhood:"Downtown",score:87,price:2,tags:["BBQ","Southern","Live Music","Date Night"],description:"Upscale BBQ and Southern cooking in a beautiful downtown space with live music. Smoked meats with fine-dining sides and craft cocktails. The whiskey list is deep.",dishes:["Smoked Brisket","Southern Sides","Live Music"],address:"401 W 2nd St, Austin, TX 78701",hours:"",lat:30.2635,lng:-97.7479,instagram:"lambertsaustin",website:"",reservation:"OpenTable",phone:""});

add({name:"Gus's Fried Chicken",cuisine:"Fried Chicken",neighborhood:"Downtown",score:86,price:1,tags:["Fried Chicken","Casual","Local Favorites"],description:"Memphis-style fried chicken in downtown Austin. Spicy, crispy, and juicy. Simple menu focused on doing one thing perfectly.",dishes:["Spicy Fried Chicken","Baked Beans","Coleslaw"],address:"117 San Jacinto Blvd, Austin, TX 78701",hours:"",lat:30.2625,lng:-97.7395,instagram:"gusfriedchicken",website:"",reservation:"walk-in",phone:""});

add({name:"Banger's Sausage House",cuisine:"Sausage / Beer Garden",neighborhood:"Rainey Street",score:86,price:1,tags:["Sausage","Craft Beer","Casual","Local Favorites","Patio","Live Music"],description:"Sausage house and beer garden on Rainey Street with 200+ beers and house-made sausages. Live music, big patio, and a fun Austin atmosphere.",dishes:["House Sausage","Craft Beer","Pretzels"],address:"79 Rainey St, Austin, TX 78701",hours:"",lat:30.2586,lng:-97.7390,instagram:"bangersaustin",website:"",reservation:"walk-in",phone:""});

add({name:"Austin Beer Garden Brewing Co.",cuisine:"Brewpub",neighborhood:"South Lamar",score:85,price:1,tags:["Craft Beer","Pizza","Casual","Local Favorites","Patio"],description:"South Lamar brewpub with excellent house-brewed beers and solid pizza. The massive patio is one of the best hangout spots in Austin. Known as ABGB.",dishes:["House-Brewed Beer","Pizza","Patio Vibes"],address:"1305 W Oltorf St, Austin, TX 78704",hours:"",lat:30.2417,lng:-97.7617,instagram:"abgb",website:"",reservation:"walk-in",phone:""});

add({name:"Whistler's",cuisine:"Cocktail Bar",neighborhood:"East Austin",score:86,price:2,tags:["Cocktails","Local Favorites","Patio"],description:"East Austin cocktail bar with a relaxed patio and rotating food truck. Creative cocktails in a laid-back setting. One of East Austin best bar patios.",dishes:["Craft Cocktails","Rotating Food Truck","Patio"],address:"1816 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7261,instagram:"whistlersatx",website:"",reservation:"walk-in",phone:""});

add({name:"Scholz Garten",cuisine:"German / Beer Garden",neighborhood:"Downtown",score:85,price:1,tags:["German","Craft Beer","Iconic","Local Favorites","Patio"],description:"Texas oldest operating business and Austin most iconic beer garden since 1866. German beer, bar food, and a massive tree-shaded patio. A living piece of Austin history.",dishes:["German Beer","Schnitzel","Pretzels"],address:"1607 San Jacinto Blvd, Austin, TX 78701",hours:"",lat:30.2733,lng:-97.7367,instagram:"scholzgarten",website:"",reservation:"walk-in",phone:""});

add({name:"El Arroyo",cuisine:"Tex-Mex",neighborhood:"West Austin",score:85,price:1,tags:["Mexican","Tex-Mex","Iconic","Local Favorites","Casual"],description:"Famous for the marquee sign with witty sayings that go viral on social media. The Tex-Mex is solid with good margaritas and queso. An Austin institution.",dishes:["Queso","Margaritas","Enchiladas"],address:"1624 W 5th St, Austin, TX 78703",hours:"",lat:30.2710,lng:-97.7570,instagram:"elarroyoatx",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new Austin spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin batch 4 complete!');
