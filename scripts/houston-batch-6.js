// Houston Batch 6: Final push to 250
// Run: node scripts/houston-batch-6.js

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

// === SUSHI & JAPANESE ===
add({name:"Kata Robata",cuisine:"Japanese / Sushi",neighborhood:"Upper Kirby",
  score:89,price:3,tags:["Japanese","Sushi","Fine Dining","Date Night","Local Favorites"],
  reservation:"Resy",awards:"Houston Chronicle Top 100",
  description:"Houston's premier sushi destination on Kirby Drive with a devoted following. The omakase is impeccable, the robata grill turns out smoky perfection, and the sake list is the deepest in the city. Chef Manabu Hori's dedication to sourcing means fish arrives from Tokyo's Tsukiji market weekly. A Houston sushi institution.",
  dishes:["Omakase","Robata Grilled Items","Nigiri","Sake Flights"],
  address:"3600 Kirby Dr, Suite H, Houston, TX 77098",phone:"(713) 526-8858",
  lat:29.7335,lng:-95.4195,instagram:"katarobata",website:"https://www.katarobata.com"});

add({name:"Tobiuo Sushi & Bar",cuisine:"Japanese / Sushi",neighborhood:"Katy",
  score:88,price:3,tags:["Japanese","Sushi","Date Night","Cocktails"],
  reservation:"OpenTable",awards:"Texas Monthly recommended",
  description:"Destination sushi in Katy that's worth the drive from inner-loop Houston. The omakase features pristine fish flown in from Japan, creative rolls, and an innovative cocktail program. Chef Rocky Ro brings fine-dining precision to suburban Cinco Ranch. The bar program is surprisingly ambitious.",
  dishes:["Omakase","Creative Rolls","Sashimi","Japanese Cocktails"],
  address:"23501 Cinco Ranch Blvd, Suite H130, Katy, TX 77494",phone:"(281) 394-7156",
  lat:29.7368,lng:-95.7637,instagram:"tobiuosushibar",website:"https://tobiuosushibar.com",suburb:true});

// === DELIS, BAKERIES, CAFES ===
add({name:"Kenny & Ziggy's",cuisine:"New York Deli",neighborhood:"Uptown / Galleria",
  score:87,price:2,tags:["Deli","Breakfast","Brunch","Local Favorites","Family"],
  reservation:"walk-in",
  description:"Houston's answer to a New York Jewish deli since 1999. Pastrami stacked high, matzo ball soup, cheesecake, and sandwiches named after celebrities. The corned beef rivals anything on the Upper East Side and the weekend brunch lines are a testament to its cult following. A Houston original.",
  dishes:["Pastrami Sandwich","Matzo Ball Soup","Cheesecake","Breakfast Plates"],
  address:"1743 Post Oak Blvd, Houston, TX 77056",phone:"(713) 871-8883",
  lat:29.7450,lng:-95.4614,instagram:"kennyandziggys",website:"https://www.kennyandziggys.com"});

add({name:"Common Bond Bistro & Bakery",cuisine:"Bakery / French Bistro",neighborhood:"Montrose",
  score:87,price:2,tags:["Bakery","Brunch","Coffee","French","Local Favorites"],
  reservation:"walk-in",
  description:"Houston's premier bakery and bistro with locations in Montrose, Heights, and the Medical Center. The croissants are buttery perfection, the sourdough is city-best, and the bistro menu covers brunch through dinner. The Montrose original on Westheimer is the one with the full bistro experience.",
  dishes:["Croissants","Sourdough Bread","Quiche","Bistro Brunch"],
  address:"1706 Westheimer Rd, Houston, TX 77098",phone:"(713) 529-3535",
  lat:29.7428,lng:-95.3855,instagram:"commonbondbistroandbakery",website:"https://www.commonbondcafe.com"});

add({name:"Local Foods",cuisine:"American / Farm-to-Table",neighborhood:"Upper Kirby",
  score:85,price:2,tags:["American","Casual","Healthy","Brunch","Local Favorites"],
  reservation:"walk-in",
  description:"Farm-to-table comfort food using ingredients sourced from Texas farms and ranches. The salads are enormous, the sandwiches are stuffed, and the daily specials showcase whatever's freshest from the market. Multiple Houston locations serve the health-conscious lunch crowd. A Houston-born concept that does casual right.",
  dishes:["Market Salads","Turkey Burger","Seasonal Sandwiches","Fresh Juices"],
  address:"2424 Dunstan Rd, Houston, TX 77005",phone:"(713) 521-7800",
  lat:29.7168,lng:-95.4135,instagram:"localfoodshouston",website:"https://www.houstonlocalfoods.com"});

// === TACOS & CASUAL MEXICAN ===
add({name:"Tacos Tierra Caliente",cuisine:"Street Tacos",neighborhood:"Montrose",
  score:87,price:1,tags:["Mexican","Tacos","Late Night","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"The iconic Montrose taco truck parked on West Alabama that's been feeding the late-night crowd for years. Al pastor, barbacoa, and lengua on fresh corn tortillas with green salsa that has its own cult following. Open late, cash-friendly, and the definition of Houston street food. Non-negotiable.",
  dishes:["Al Pastor Tacos","Barbacoa","Lengua","Green Salsa"],
  address:"2003 W Alabama St, Houston, TX 77098",phone:"(713) 584-9359",
  lat:29.7395,lng:-95.3935,instagram:"tacostierracalientetx",website:"https://www.tacostierracalientemx.com"});

add({name:"Torchy's Tacos",cuisine:"Creative Tacos",neighborhood:"Multiple Locations",
  score:83,price:1,tags:["Tacos","Casual","Local Favorites","Brunch"],
  reservation:"walk-in",
  description:"Austin-born creative taco chain with multiple Houston locations. The Trailer Park (fried chicken, green chiles, ranch) and Crossroads (smoked brisket, cheddar) are cult classics. The queso is dangerously addictive and the breakfast tacos are weekend essential. A Texas institution now in every Houston neighborhood.",
  dishes:["Trailer Park Taco","Crossroads","Green Chile Queso","Breakfast Tacos"],
  address:"350 W 19th St, Houston, TX 77008",phone:"(713) 595-8226",
  lat:29.8015,lng:-95.3919,instagram:"torchystacos",website:"https://www.torchystacos.com"});

// === GREEK, MEDITERRANEAN ===
add({name:"Helen Greek Food and Wine",cuisine:"Modern Greek",neighborhood:"Rice Village",
  score:88,price:2,tags:["Greek","Mediterranean","Date Night","Wine Bar","Local Favorites"],
  reservation:"Resy",awards:"Houston Chronicle Top 100",
  description:"Houston's first modern Greek restaurant, blending traditional taverna dishes with Gulf Coast ingredients. The whole branzino, lamb chops, and spanakopita are textbook, and the all-Greek wine list is one of the most interesting in the city. Chef William Wright's menu is both approachable and ambitious.",
  dishes:["Whole Branzino","Lamb Chops","Spanakopita","Greek Wine"],
  address:"2429 Rice Blvd, Houston, TX 77005",phone:"(713) 526-4400",
  lat:29.7158,lng:-95.4108,instagram:"helengreekfoodandwine",website:"https://www.helengreekfoodandwine.com"});

// === MORE ESSENTIAL HOUSTON ===
add({name:"FM Kitchen & Bar",cuisine:"American / Bar Food",neighborhood:"Washington Corridor",
  score:85,price:2,tags:["American","Bar","Burgers","Patio","Local Favorites"],
  reservation:"walk-in",
  description:"Washington Corridor bar and grill where the burger is one of the best in Houston — fresh-ground patty, Martin's potato roll, perfectly melted American cheese. The outdoor area is packed on weekends and the bar stocks local craft beers alongside strong margaritas. Neighborhood comfort food done right.",
  dishes:["FM Burger","Fried Chicken Sandwich","Margaritas","Bar Snacks"],
  address:"1112 Shepherd Dr, Houston, TX 77007",phone:"(713) 802-1860",
  lat:29.7710,lng:-95.4018,instagram:"fmkitchenbar",website:"https://www.fmkitchenandbar.com"});

add({name:"Decatur Bar & Pop-Up Factory",cuisine:"American / Pop-Up",neighborhood:"Heights",
  score:84,price:2,tags:["American","Bar","Patio","Pop-Up","Local Favorites"],
  reservation:"walk-in",
  description:"Heights bar with a rotating pop-up restaurant concept that brings different chefs and cuisines through the kitchen every few months. The bar program is solid, the covered patio is Heights-perfect, and the pop-up format keeps things fresh. Check Instagram for the current kitchen takeover.",
  dishes:["Rotating Pop-Up Menu","Craft Cocktails","Bar Snacks"],
  address:"2310 Decatur St, Houston, TX 77007",phone:"(346) 571-3915",
  lat:29.7567,lng:-95.3560,instagram:"decaturbar",website:"https://www.decaturbar.com"});

add({name:"Harold's Restaurant",cuisine:"Southern / Soul Food",neighborhood:"Heights",
  score:86,price:2,tags:["Southern","Brunch","Local Favorites","Family"],
  reservation:"walk-in",
  description:"Heights Southern restaurant from chef Antoine Ware serving upscale soul food with genuine warmth. Fried catfish, smothered pork chops, and a brunch that rivals Lucille's. The space is bright and welcoming, and the service makes you feel like family. A Houston gem that deserves more national attention.",
  dishes:["Fried Catfish","Smothered Pork Chops","Brunch Plates","Peach Cobbler"],
  address:"350 W 19th St, Suite 7, Houston, TX 77008",phone:"(713) 360-6204",
  lat:29.8015,lng:-95.3919,instagram:"haroldshouston",website:"https://www.haroldsrestaurant.com"});

add({name:"Ostia",cuisine:"Italian / Neapolitan",neighborhood:"Montrose",
  score:87,price:2,tags:["Italian","Pizza","Date Night","Cocktails"],
  reservation:"OpenTable",
  description:"Wood-fired Neapolitan pizzas and hearth-roasted Italian dishes in Montrose. The pizzas are blistered and bubbly, the roast chicken with salsa verde is a signature, and the Italian wine list is thoughtful. A neighborhood favorite that balances rustic Italian comfort with contemporary Houston energy.",
  dishes:["Neapolitan Pizza","Roast Chicken","Handmade Pasta","Italian Wine"],
  address:"2032 Dunlavy St, Houston, TX 77006",phone:"(832) 564-7441",
  lat:29.7455,lng:-95.3984,instagram:"ostiahtx",website:"https://www.ostiahtx.com"});

add({name:"La Lucha",cuisine:"Gulf Coast / Southern",neighborhood:"Heights",
  score:88,price:2,tags:["Southern","Seafood","Cocktails","New Opening"],
  indicators:["new"],reservation:"Resy",awards:"Houstonia Top 10 New 2025",
  description:"Houston-born chef Ford Fry's honky-tonk-inspired restaurant channeling San Jacinto Inn memories. The menu is built around Gulf oysters, peel-and-eat shrimp, and fried chicken in a retro roadhouse setting. The cocktails are strong, the neon signs are bright, and the energy is pure Texas. Named one of Houston's best new restaurants of 2025.",
  dishes:["Gulf Oysters","Fried Chicken","Peel-and-Eat Shrimp","Margaritas"],
  address:"1801 N Shepherd Dr, Suite C, Houston, TX 77008",phone:"(346) 360-4760",
  lat:29.7960,lng:-95.4058,instagram:"laluchahtx",website:"https://www.laluchahtx.com",trending:true});

add({name:"Soma Sushi",cuisine:"Japanese / Sushi",neighborhood:"Heights",
  score:86,price:2,tags:["Japanese","Sushi","Casual","Date Night"],
  reservation:"Resy",
  description:"Modern Heights sushi bar with creative rolls, fresh nigiri, and a hip atmosphere. The fish quality is excellent for the price point and the cocktail menu adds Tokyo-inspired drinks to the mix. A go-to for Heights residents who want solid sushi without the Kirby Drive drive.",
  dishes:["Nigiri","Creative Rolls","Sake","Japanese Cocktails"],
  address:"4820 Washington Ave, Houston, TX 77007",phone:"(832) 831-6510",
  lat:29.7690,lng:-95.4005,instagram:"somasushihtx",website:"https://www.somasushihtx.com"});

add({name:"Chardon",cuisine:"French",neighborhood:"Heights",
  score:87,price:3,tags:["French","Fine Dining","Date Night","Wine Bar","New Opening"],
  indicators:["new"],reservation:"Resy",awards:"CultureMap Tastemaker Nominee 2026",
  description:"Intimate French restaurant in the Heights from chef Laurent Trontin. Classic bistro dishes with modern flair — steak tartare, duck confit, bouillabaisse — in a moody, candlelit space. The wine program leans old-world French and the service is polished. A CultureMap Tastemaker nominee in its first year.",
  dishes:["Steak Tartare","Duck Confit","Bouillabaisse","French Wine"],
  address:"1537 N Shepherd Dr, Houston, TX 77008",phone:"(832) 869-3332",
  lat:29.7935,lng:-95.4058,instagram:"chardonhtx",website:"https://www.chardonhtx.com",trending:true});

add({name:"Uchi Houston",cuisine:"Japanese / Sushi",neighborhood:"Montrose",
  score:91,price:3,tags:["Japanese","Sushi","Fine Dining","Date Night","Awards"],
  reservation:"Resy",awards:"James Beard Award Winner (Tyson Cole)",group:"Hai Hospitality",
  description:"Already in data - skipping",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// This one should skip as duplicate

add({name:"Underbelly Hospitality / Monteverde",cuisine:"Italian",neighborhood:"Montrose",
  score:86,price:2,tags:["Italian","Pasta","Date Night","New Opening"],
  indicators:["new"],reservation:"Resy",group:"Underbelly Hospitality",
  description:"Underbelly Hospitality's newest concept bringing handmade pasta and Italian small plates to Montrose. A more casual, pasta-focused complement to the group's protein-heavy offerings. The rigatoni and seasonal risottos are the stars, and the natural wine program fits the neighborhood perfectly.",
  dishes:["Handmade Rigatoni","Seasonal Risotto","Antipasti","Natural Wine"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"",
  lat:29.7434,lng:-95.3792,instagram:"monteverde_htx",website:"https://www.underbellyburger.com",trending:true});

add({name:"Whataburger",cuisine:"Fast Food / Burgers",neighborhood:"Multiple Locations",
  score:82,price:1,tags:["Burgers","Fast Food","Late Night","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"Texas' beloved fast food chain and a Houston cultural institution. The Honey Butter Chicken Biscuit is breakfast perfection, the Patty Melt is a 2am essential, and the spicy ketchup has its own fan base. With locations on nearly every major Houston street, Whataburger is as Houston as NASA and humidity.",
  dishes:["Patty Melt","Honey Butter Chicken Biscuit","Whataburger","Spicy Ketchup"],
  address:"Multiple Locations",phone:"",
  lat:29.7604,lng:-95.3698,instagram:"whataburger",website:"https://www.whataburger.com"});

add({name:"Ninfa's Uptown",cuisine:"Tex-Mex / Mexican",neighborhood:"Uptown / Galleria",
  score:88,price:2,tags:["Mexican","Tex-Mex","Fajitas","Local Favorites"],
  reservation:"OpenTable",
  description:"The uptown outpost of Houston's legendary Ninfa's — same killer fajitas and green sauce, different neighborhood. The Galleria-area location brings Mama Ninfa's legacy to the Uptown crowd with a polished setting and full bar. The tacos al carbon and queso are just as good as Navigation.",
  dishes:["Fajitas","Tacos al Carbon","Green Sauce","Queso"],
  address:"1700 Post Oak Blvd, Suite 1-190, Houston, TX 77056",phone:"(346) 335-2404",
  lat:29.7494,lng:-95.4614,instagram:"ninfasoriginal",website:"https://ninfas.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
console.log('Target was 250. Progress: ' + (arr.length >= 250 ? '🎯 TARGET HIT!' : (250 - arr.length) + ' more needed'));
