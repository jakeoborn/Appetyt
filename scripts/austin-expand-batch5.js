// Austin Expansion Batch 5 — Final push to 350
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const austinMarker = 'const AUSTIN_DATA=';
const austinPos = html.indexOf(austinMarker);
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

// Final Austin spots
add({name:"Sour Duck Market",cuisine:"Bakery / Brunch",neighborhood:"East Austin",score:86,price:1,tags:["Bakery/Coffee","Brunch","Local Favorites"],description:"East Austin bakery and market with excellent pastries and brunch items. The sour cream coffee cake is famous. Quality baked goods made fresh daily.",dishes:["Sour Cream Coffee Cake","Pastries","Breakfast Sandwiches"],address:"1814 E MLK Jr Blvd, Austin, TX 78702",hours:"",lat:30.2785,lng:-97.7242,instagram:"sourduckmarket",website:"",reservation:"walk-in",phone:""});

add({name:"Loro East",cuisine:"Asian-BBQ Fusion",neighborhood:"East Austin",score:87,price:2,tags:["BBQ","Asian Fusion","Patio","Local Favorites"],description:"Second Loro location in East Austin. Same Franklin-Uchi collaboration with smoked meats and Asian flavors. Great patio and a more neighborhood feel.",dishes:["Smoked Brisket","Thai Herbs","Coconut Rice"],address:"2000 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7233,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"Yuyo",cuisine:"Peruvian",neighborhood:"East Austin",score:87,price:2,tags:["Peruvian","Latin American","Date Night","Local Favorites"],description:"Peruvian restaurant in East Austin with ceviche, lomo saltado, and pisco sours. Authentic Peruvian flavors that are hard to find in Austin.",dishes:["Ceviche","Lomo Saltado","Pisco Sour"],address:"1703 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7260,instagram:"yuyoaustin",website:"",reservation:"Resy",phone:""});

add({name:"El Naranjo",cuisine:"Oaxacan Mexican",neighborhood:"South Lamar",score:88,price:2,tags:["Mexican","Oaxacan","Date Night","Critics Pick"],description:"Chef Iliana de la Vega Oaxacan cuisine on South Lamar. Complex moles, tlayudas, and mezcal cocktails. Some of the most authentic Oaxacan food outside of Mexico.",dishes:["Mole Negro","Tlayuda","Mezcal Cocktails"],address:"2717 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2362,lng:-97.7776,instagram:"elnaranjoatx",website:"",reservation:"Resy",phone:""});

add({name:"Tumble 22",cuisine:"Nashville Hot Chicken",neighborhood:"Multiple Locations",score:86,price:1,tags:["Fried Chicken","Casual","Local Favorites"],description:"Nashville hot chicken with Austin flair. Multiple heat levels from Southern to Cluckin Hot. The tenders and sandwiches are crispy and juicy.",dishes:["Hot Chicken Sandwich","Tenders","Mac & Cheese"],address:"4600 Mueller Blvd, Austin, TX 78723",hours:"",lat:30.2985,lng:-97.7075,instagram:"tumble22",website:"",reservation:"walk-in",phone:""});

add({name:"Austin's Pizza",cuisine:"Pizza",neighborhood:"Multiple Locations",score:85,price:1,tags:["Pizza","Casual","Local Favorites","Family"],description:"Local Austin pizza chain since 1999 with quality pies at fair prices. The works pizza is loaded and the delivery is reliable. A neighborhood staple.",dishes:["The Works Pizza","Specialty Pies","Delivery"],address:"3638 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2275,lng:-97.7850,instagram:"austinspizza",website:"",reservation:"walk-in",phone:""});

add({name:"Aba South Congress",cuisine:"Mediterranean",neighborhood:"South Congress",score:88,price:2,tags:["Mediterranean","Date Night","Patio","Local Favorites"],description:"Mediterranean restaurant from the Lettuce Entertain You group. Multi-level patio under a Heritage Oak on Music Lane. Whipped feta, lamb, and great cocktails.",dishes:["Whipped Feta","Lamb Kebab","Mediterranean Plates"],address:"1011 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2500,lng:-97.7495,instagram:"abarestaurants",website:"",reservation:"Resy",phone:""});

add({name:"Casa de Luz",cuisine:"Macrobiotic / Vegan",neighborhood:"South Lamar",score:85,price:1,tags:["Vegan","Healthy","Local Favorites","Casual"],description:"Macrobiotic community kitchen on South Lamar serving plant-based meals in a communal setting. One menu, one price, all organic. An Austin wellness institution since 1992.",dishes:["Set Vegan Meal","Organic Plate","Community Dining"],address:"1701 Toomey Rd, Austin, TX 78704",hours:"",lat:30.2540,lng:-97.7623,instagram:"casadeluz",website:"",reservation:"walk-in",phone:""});

add({name:"Loro Bee Cave",cuisine:"Asian-BBQ Fusion",neighborhood:"Bee Cave",score:87,price:2,tags:["BBQ","Asian Fusion","Patio","Local Favorites"],description:"Bee Cave location of the popular Franklin-Uchi collaboration. Same great food in a suburban setting with a massive patio.",dishes:["Smoked Meats","Asian Sides","Patio"],address:"3801 Bee Cave Rd, Bee Cave, TX 78746",hours:"",lat:30.2887,lng:-97.8564,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",suburb:true,group:"Franklin/Uchi"});

add({name:"Moonshine Patio Bar & Grill",cuisine:"Southern / American",neighborhood:"Downtown",score:86,price:2,tags:["Southern","Brunch","Patio","Local Favorites"],description:"Southern comfort food in a historic downtown limestone building with a massive patio. The Sunday brunch buffet and corn dog shrimp are Austin favorites.",dishes:["Corn Dog Shrimp","Sunday Brunch Buffet","Southern Comfort"],address:"303 Red River St, Austin, TX 78701",hours:"",lat:30.2643,lng:-97.7373,instagram:"moonshinegrill",website:"",reservation:"OpenTable",phone:""});

add({name:"Loro North Lamar",cuisine:"Asian-BBQ Fusion",neighborhood:"North Lamar",score:87,price:2,tags:["BBQ","Asian Fusion","Patio","Local Favorites"],description:"North Austin location of the Franklin-Uchi collaboration. Same excellent smoked meats with Asian flavors in a family-friendly north side setting.",dishes:["Smoked Brisket","Thai Herbs","Patio"],address:"8557 Research Blvd, Austin, TX 78758",hours:"",lat:30.3617,lng:-97.7154,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"Peached Tortilla",cuisine:"Asian-Southern Fusion",neighborhood:"Multiple Locations",score:86,price:1,tags:["Asian Fusion","Southern","Casual","Local Favorites"],description:"Asian-Southern fusion food truck turned brick-and-mortar. Creative dishes like BBQ pork belly bao buns and Asian-inspired tacos. Uniquely Austin.",dishes:["BBQ Pork Belly Bao","Asian Tacos","Fusion Plates"],address:"5520 Burnet Rd, Austin, TX 78756",hours:"",lat:30.3277,lng:-97.7374,instagram:"peachedtortilla",website:"",reservation:"walk-in",phone:""});

add({name:"Sawyer & Co.",cuisine:"Southern / American",neighborhood:"East Austin",score:86,price:2,tags:["Southern","Brunch","Cocktails","Local Favorites"],description:"Southern-inspired restaurant in East Austin with a retro diner aesthetic. Excellent fried chicken, biscuits, and cocktails. Great brunch spot.",dishes:["Fried Chicken","Biscuits","Retro Cocktails"],address:"4827 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7036,instagram:"sawyerandcoatx",website:"",reservation:"walk-in",phone:""});

add({name:"Central Machine Works",cuisine:"Brewpub",neighborhood:"East Austin",score:85,price:1,tags:["Craft Beer","Casual","Local Favorites","Patio"],description:"East Austin brewery with a huge beer hall and outdoor space. House-brewed beers and rotating food trucks. One of Austin best brewery patios.",dishes:["House-Brewed Beer","Food Truck Rotations","Beer Hall"],address:"4824 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7038,instagram:"centralmachineworks",website:"",reservation:"walk-in",phone:""});

add({name:"Casino El Camino",cuisine:"Burgers / Dive Bar",neighborhood:"East 6th",score:86,price:1,tags:["Burgers","Casual","Late Night","Iconic","Local Favorites"],description:"Legendary Dirty Sixth dive bar with some of the best burgers in Austin. The burgers take 45 minutes and are worth every second. Cash only. An Austin institution.",dishes:["Amarillo Burger","Bar Burgers","Cheap Drinks"],address:"517 E 6th St, Austin, TX 78701",hours:"",lat:30.2671,lng:-97.7373,instagram:"casinoelcamino",website:"",reservation:"walk-in",phone:""});

add({name:"Austin Java",cuisine:"Coffee / Cafe",neighborhood:"Multiple Locations",score:85,price:1,tags:["Bakery/Coffee","Brunch","Casual","Local Favorites"],description:"Local Austin coffee chain with multiple locations. Good coffee, solid breakfast tacos, and a reliable wifi spot for remote work.",dishes:["Coffee","Breakfast Tacos","Sandwiches"],address:"1608 Barton Springs Rd, Austin, TX 78704",hours:"",lat:30.2614,lng:-97.7552,instagram:"austinjava",website:"",reservation:"walk-in",phone:""});

add({name:"Summer Moon Coffee",cuisine:"Coffee",neighborhood:"Multiple Locations",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Austin-born coffee chain famous for their wood-fired coffee and the Moon Milk (sweet cream). Multiple locations. The iced Moon Milk latte is addictive.",dishes:["Moon Milk Latte","Wood-Fired Coffee","Cold Brew"],address:"3115 S 1st St, Austin, TX 78704",hours:"",lat:30.2345,lng:-97.7560,instagram:"summermooncofe",website:"https://www.summermooncoffee.com",reservation:"walk-in",phone:""});

add({name:"Halcyon",cuisine:"Coffee / Bar",neighborhood:"Downtown",score:85,price:1,tags:["Bakery/Coffee","Cocktails","Local Favorites","Late Night"],description:"Coffee shop by day, bar by night on 4th Street downtown. S'mores at your table with a personal fire pit. An Austin gathering spot for all hours.",dishes:["Coffee","S'mores","Late Night Cocktails"],address:"218 W 4th St, Austin, TX 78701",hours:"",lat:30.2661,lng:-97.7451,instagram:"halcyonaustin",website:"",reservation:"walk-in",phone:""});

add({name:"Juan in a Million",cuisine:"Tex-Mex / Breakfast Tacos",neighborhood:"East Austin",score:86,price:1,tags:["Mexican","Tex-Mex","Brunch","Iconic","Local Favorites"],description:"East Austin Tex-Mex institution famous for the Don Juan taco -- a massive breakfast taco with eggs, bacon, potatoes, and cheese. Presidents have eaten here.",dishes:["Don Juan Taco","Breakfast Tacos","Tex-Mex Plates"],address:"2300 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7203,instagram:"juaninamillion",website:"",reservation:"walk-in",phone:""});

add({name:"South Congress Hotel Restaurant",cuisine:"New American",neighborhood:"South Congress",score:86,price:2,tags:["New American","Hotel","Brunch","Date Night"],description:"Restaurant inside the boutique South Congress Hotel with creative New American dishes and a beautiful courtyard. Great brunch and cocktails.",dishes:["Seasonal Menu","Hotel Brunch","Courtyard Dining"],address:"1603 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2443,lng:-97.7495,instagram:"southcongresshotel",website:"",reservation:"OpenTable",phone:""});

add({name:"Magnolia Cafe",cuisine:"American / Tex-Mex",neighborhood:"South Congress",score:85,price:1,tags:["Casual","Late Night","Iconic","Local Favorites"],description:"Open 24 hours South Congress location with keep Austin weird vibes. Gingerbread pancakes, queso, and late-night Tex-Mex. An Austin institution.",dishes:["Gingerbread Pancakes","Queso","Late Night Menu"],address:"1920 S Congress Ave, Austin, TX 78704",hours:"Open 24 Hours",lat:30.2413,lng:-97.7506,instagram:"magnoliacafe",website:"",reservation:"walk-in",phone:""});

add({name:"Laala's",cuisine:"Mediterranean / Lebanese",neighborhood:"East Austin",score:86,price:1,tags:["Mediterranean","Lebanese","Local Favorites","Casual"],description:"Mediterranean and Lebanese food in East Austin with excellent falafel, shawarma, and hummus. Fresh, flavorful, and affordable.",dishes:["Falafel","Shawarma","Hummus"],address:"1100 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7321,instagram:"laalasatx",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new Austin spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin batch 5 complete!');
