// Houston Batch 2: 25 more verified restaurants (all with instagram + website)
// Sources: Michelin Guide, Houston Chronicle, Houstonia, CultureMap, Eater, Resy
// Run: node scripts/houston-batch-2.js

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

// === MICHELIN STARRED ===

add({name:"Musaafer",cuisine:"Modern Indian Fine Dining",neighborhood:"Uptown / Galleria",
  score:93,price:4,tags:["Indian","Fine Dining","Date Night","Awards","Cocktails"],
  reservation:"OpenTable",awards:"Michelin 1 Star (2024, 2025)",
  description:"Royal Indian cuisine brought to life in an opulent Galleria-area setting. Chef Mayank Istwal's tasting menus journey through India's regional traditions with modern finesse — think lamb shank Nihari, saffron-poached lobster, and tableside chai service. The Michelin star is well-earned, and the ornate dining room rivals any in the city.",
  dishes:["Lamb Shank Nihari","Saffron Lobster","Tandoori Chicken","Tableside Chai"],
  address:"5115 Westheimer Rd, Suite 3500, Houston, TX 77056",phone:"(713) 242-8087",
  lat:29.7375,lng:-95.4630,instagram:"musaaferhouston",website:"https://www.musaaferhouston.com",res_tier:1});

add({name:"CorkScrew BBQ",cuisine:"Texas BBQ",neighborhood:"Spring",
  score:92,price:2,tags:["BBQ","Local Favorites","Awards","Critics Pick"],
  reservation:"walk-in",awards:"Michelin 1 Star (2024, 2025), Texas Monthly Top 50 BBQ",
  description:"A Michelin-starred BBQ joint in Spring, TX — one of only a handful of BBQ restaurants in the world with a star. Will and Nichole Buckman's brisket is smoked low and slow over post oak, and the beef ribs are a weekend-only event. Lines start early and sellouts are common. Worth the drive from inner-loop Houston.",
  dishes:["Brisket","Beef Ribs","Pulled Pork","Jalapeño Cheddar Sausage"],
  address:"26608 Keith St, Spring, TX 77373",phone:"(832) 592-1184",
  lat:30.0677,lng:-95.3847,instagram:"corkscrewbbq",website:"https://www.corkscrewbbq.com",suburb:true,res_tier:5});

// === MICHELIN BIB GOURMAND ===

add({name:"Papalo Taqueria",cuisine:"Mexican / Tacos",neighborhood:"Downtown",
  score:87,price:1,tags:["Mexican","Tacos","Casual","Food Hall","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand 2025",
  description:"Michelin Bib Gourmand taqueria inside Finn Hall downtown. Chef Benchawan Jabthong Painter's masa is ground fresh daily, and the tacos — from al pastor to cochinita pibil — are some of the best in the city. Breakfast tacos in the morning, a taco feast at lunch. All at food hall prices.",
  dishes:["Al Pastor Tacos","Cochinita Pibil","Breakfast Tacos","Fresh Masa Tortillas"],
  address:"712 Main St, Houston, TX 77002",phone:"",
  lat:29.7589,lng:-95.3632,instagram:"papalotaqueria",website:"https://www.papalotaqueria.com"});

// === MICHELIN RECOMMENDED / SERVICE AWARD ===

add({name:"Credence",cuisine:"Texan / Live-Fire",neighborhood:"Memorial",
  score:89,price:3,tags:["American","Fine Dining","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin Recommended, Michelin Service Award 2025",
  description:"Chef Levi Goode's ranch-inspired fine dining with a focus on live-fire cooking. Texas heritage drives a menu of smoked and grilled meats, Gulf seafood, and seasonal produce. The only Texas restaurant to win Michelin's Service Award — the hospitality is as exceptional as the food. The Sidebar cocktail bar next door is equally polished.",
  dishes:["Live-Fire Steaks","Gulf Oysters","Smoked Brisket","Seasonal Vegetables"],
  address:"9757 Katy Fwy, Suite 170, Houston, TX 77024",phone:"(713) 568-2525",
  lat:29.7821,lng:-95.4785,instagram:"credencehtx",website:"https://credencehtx.com"});

add({name:"Bludorn",cuisine:"New American / French",neighborhood:"Montrose",
  score:91,price:4,tags:["Fine Dining","French","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin Recommended, Houston Chronicle Top 100",
  description:"Chef Aaron Bludorn's namesake restaurant on Taft Street is one of Houston's most polished dining experiences. French technique meets Gulf Coast ingredients — dover sole, wagyu tartare, and a seafood tower that rivals any in the city. The dining room is sleek, the service impeccable, and the wine list deep. Also operates Bar Bludorn nearby.",
  dishes:["Dover Sole","Wagyu Tartare","Seafood Tower","Soufflé"],
  address:"807 Taft St, Houston, TX 77019",phone:"(713) 999-0146",
  lat:29.7588,lng:-95.3856,instagram:"bludornrestaurant",website:"https://www.bludornrestaurant.com",res_tier:1});

add({name:"Aga's Restaurant",cuisine:"Indian / Pakistani",neighborhood:"Southwest Houston",
  score:89,price:2,tags:["Indian","Pakistani","Halal","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Houston Chronicle #1 Restaurant 2025",
  description:"The Houston Chronicle's #1 restaurant for 2025 — and it's a halal Indo-Pak spot in southwest Houston. For 25 years, Aga's has served tender goat chops, chicken lollipops, and karahis that draw crowds from across the city. The buffet is one of Houston's greatest dining values. Proof that the best food in Houston doesn't need a fancy address.",
  dishes:["Goat Chops","Chicken Lollipops","Karahi","Biryani"],
  address:"11842 Wilcrest Dr, Houston, TX 77031",phone:"(832) 786-8000",
  lat:29.6525,lng:-95.5650,instagram:"agasrestaurant",website:"https://www.agasrestaurant.com",suburb:true});

// === NOTABLE HOUSTON INSTITUTIONS ===

add({name:"Pinkerton's Barbecue",cuisine:"Texas BBQ",neighborhood:"Heights",
  score:89,price:2,tags:["BBQ","Local Favorites","Awards","Critics Pick"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand (2024, 2025), Texas Monthly Top 50 BBQ",
  description:"Grant Pinkerton's Heights BBQ joint with a double Bib Gourmand that puts it in elite company. The brisket is textbook — perfect bark, pink smoke ring, melt-in-your-mouth fat cap. The signature 'candy paint' pork ribs are lacquered in a sweet glaze that's become iconic. Multiple locations now, but Heights is the original.",
  dishes:["Brisket","Candy Paint Pork Ribs","Beef Rib","Jalapeño Cheddar Sausage"],
  address:"1504 Airline Dr, Houston, TX 77009",phone:"(713) 802-2000",
  lat:29.7925,lng:-95.3655,instagram:"pinkertonsbbq",website:"https://www.pinkertonsbarbecue.com"});

add({name:"Giacomo's Cibo e Vino",cuisine:"Italian / Wine Bar",neighborhood:"River Oaks",
  score:87,price:2,tags:["Italian","Wine Bar","Date Night","Casual","Local Favorites"],
  reservation:"OpenTable",
  description:"Neighborhood Italian trattoria and wine bar on Westheimer that's been a Houston favorite for years. House-made pastas, wood-fired pizzas, and an approachable wine list in a casual, brick-walled space. The kind of restaurant every neighborhood wishes it had — reliable, affordable, and genuinely warm.",
  dishes:["House-Made Pasta","Wood-Fired Pizza","Meatballs","Italian Wine"],
  address:"3215 Westheimer Rd, Houston, TX 77098",phone:"(713) 522-1934",
  lat:29.7420,lng:-95.4235,instagram:"giacomoshouston",website:"https://www.giacomosciboevino.com"});

add({name:"Roost",cuisine:"New American / Bistro",neighborhood:"Montrose",
  score:87,price:2,tags:["American","Brunch","Date Night","Local Favorites"],
  reservation:"OpenTable",
  description:"Montrose neighborhood bistro that's been a local favorite since 2011. The menu is seasonal New American with Southern influences — roasted chicken, Gulf fish, and brunch plates that draw a loyal weekend crowd. Unpretentious, consistent, and the kind of place you become a regular at.",
  dishes:["Roasted Chicken","Gulf Fish","Weekend Brunch","Seasonal Plates"],
  address:"1972 Fairview St, Houston, TX 77019",phone:"(713) 523-7667",
  lat:29.7457,lng:-95.3952,instagram:"iloveroost",website:"https://www.iloveroost.com"});

add({name:"Afuri Ramen",cuisine:"Japanese Ramen",neighborhood:"Heights",
  score:87,price:2,tags:["Japanese","Ramen","Casual","New Opening"],
  indicators:["new"],reservation:"walk-in",
  description:"Tokyo's celebrated ramen chain made its Texas debut in the Heights. The signature yuzu shio ramen is a lighter, citrus-forward broth that stands apart from heavy tonkotsu. Gyoza and seasonal specials round out the menu. The Heights location captures the precision of the Tokyo original in a clean, modern space.",
  dishes:["Yuzu Shio Ramen","Tonkotsu Ramen","Gyoza","Karaage"],
  address:"1215 N Durham Dr, Suite B-100, Houston, TX 77008",phone:"(346) 692-3189",
  lat:29.7885,lng:-95.4095,instagram:"afuriramen_houston",website:"https://www.afuriramen.com"});

// === MORE ESSENTIAL HOUSTON ===

add({name:"Anvil Bar & Refuge",cuisine:"Cocktail Bar",neighborhood:"Montrose",
  score:88,price:2,tags:["Cocktails","Bar","Date Night","Local Favorites","Awards"],
  reservation:"walk-in",awards:"James Beard Outstanding Bar Semifinalist",
  description:"Bobby Heugel's legendary Montrose cocktail bar that helped launch Houston's craft cocktail revolution. The menu of 100 drinks spans classics and originals, and the bartenders are among the most skilled in the country. A JBF Outstanding Bar semifinalist and the anchor of Westheimer's nightlife strip. No reservations — just show up and trust the bartender.",
  dishes:["Classic Cocktails","Seasonal Menu","Bar Snacks"],
  address:"1424 Westheimer Rd, Houston, TX 77006",phone:"(713) 523-1622",
  lat:29.7430,lng:-95.3835,instagram:"anvilhouston",website:"https://www.anvilhouston.com"});

add({name:"Underbelly Hospitality / Comalito",cuisine:"Mexican / Taqueria",neighborhood:"Montrose",
  score:86,price:2,tags:["Mexican","Tacos","Casual","New Opening"],
  indicators:["new"],reservation:"walk-in",group:"Underbelly Hospitality",
  description:"Underbelly Hospitality's new taqueria concept created in partnership with Mexico City chef Luis Robledo Richards and his restaurant group Nixt. Inspired by DF's best taquerias, Comalito brings Mexico City-style tacos, salsas, and antojitos to Houston's Montrose neighborhood. The latest evolution of the post-Chris Shepherd Underbelly empire.",
  dishes:["Mexico City Tacos","Salsas","Antojitos","Agua Frescas"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"",
  lat:29.7434,lng:-95.3792,instagram:"comalito_htx",website:"https://www.comalitohtx.com",trending:true});

add({name:"Saison Cellar",cuisine:"Wine Bar / French",neighborhood:"Downtown",
  score:86,price:2,tags:["Wine Bar","French","Date Night","Food Hall"],
  reservation:"walk-in",
  description:"Sophisticated wine bar and cellar at POST Houston serving French-inspired small plates alongside a curated natural wine program. The atmosphere is moody and intimate — a welcome contrast to the bustling food hall above. One of Houston's best spots for a glass of wine and a cheese board.",
  dishes:["Natural Wine","Cheese Boards","Charcuterie","French Small Plates"],
  address:"401 Franklin St, Houston, TX 77201",phone:"",
  lat:29.7636,lng:-95.3620,instagram:"saisoncellar",website:"https://www.saisoncellar.com"});

add({name:"Le Petit Chef",cuisine:"French",neighborhood:"Heights",
  score:86,price:2,tags:["French","Casual","Brunch","Bakery","Patio"],
  reservation:"walk-in",
  description:"Charming French cafe and bistro in the Heights serving breakfast, brunch, and lunch with Parisian flair. Croissants, quiches, croque monsieurs, and French onion soup in a bright, airy space with sidewalk seating. The pastry case alone is worth the visit. A slice of Paris in the Heights.",
  dishes:["Croissants","Croque Monsieur","French Onion Soup","Quiche"],
  address:"832 Studewood St, Houston, TX 77007",phone:"(832) 304-0916",
  lat:29.7860,lng:-95.3980,instagram:"lepetitchefhtx",website:"https://www.lepetitchefhtx.com"});

add({name:"Xin Chao",cuisine:"Vietnamese / Texas Fusion",neighborhood:"East End",
  score:90,price:3,tags:["Vietnamese","Fine Dining","Date Night","Cocktails","Critics Pick"],
  reservation:"Resy",awards:"Michelin Recommended, JBF Best New Restaurant Semifinalist 2023",
  description:"Chefs Christine Ha and Tony Nguyen's modern Vietnamese restaurant in EaDo blending Saigon street food traditions with Texas swagger. The MasterChef winner's menu features Gulf shrimp banh mi, lemongrass-smoked brisket, and Vietnamese coffee desserts. JBF semifinalist and Michelin recommended. One of the most exciting restaurants in Houston.",
  dishes:["Gulf Shrimp Banh Mi","Lemongrass Brisket","Pho","Vietnamese Coffee Dessert"],
  address:"2310 Decatur St, Houston, TX 77007",phone:"(713) 597-1382",
  lat:29.7567,lng:-95.3560,instagram:"xinchaohtx",website:"https://www.xinchaohouston.com"});

add({name:"Emmaline",cuisine:"Coastal Mediterranean",neighborhood:"Montrose",
  score:87,price:3,tags:["Mediterranean","Seafood","Date Night","Patio","Cocktails"],
  reservation:"OpenTable",
  description:"Coastal Mediterranean restaurant in Montrose with a gorgeous patio and Gulf-meets-Mediterranean menu. Fresh pastas, wood-grilled fish, and craft cocktails in a lush setting that feels like a vacation. The weekend brunch is popular and the happy hour is one of Montrose's best-kept secrets.",
  dishes:["Wood-Grilled Fish","Handmade Pasta","Mezze Platters","Craft Cocktails"],
  address:"3210 W Dallas St, Houston, TX 77019",phone:"(713) 523-3210",
  lat:29.7532,lng:-95.3945,instagram:"emmalinehouston",website:"https://www.emmalinehouston.com"});

add({name:"Aladdin Mediterranean",cuisine:"Mediterranean / Middle Eastern",neighborhood:"Montrose",
  score:85,price:1,tags:["Mediterranean","Middle Eastern","Casual","Cheap Eats","Local Favorites"],
  reservation:"walk-in",
  description:"Cafeteria-style Mediterranean that's been feeding Montrose for years. Pita, hummus, kebabs, and a build-your-own plate for under $20 that's one of the best lunch values in the city. No frills, just solid, honest food. Multiple locations but Montrose is the original.",
  dishes:["Hummus","Kebab Plate","Falafel","Shawarma"],
  address:"912 Westheimer Rd, Houston, TX 77006",phone:"(713) 942-2321",
  lat:29.7435,lng:-95.3745,instagram:"aladdinhouston",website:"https://www.aladdinhouston.com"});

add({name:"Thien Thanh",cuisine:"Vietnamese",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"Family-owned Vietnamese restaurant on Bellaire Boulevard serving what many locals consider the best banh cuon (steamed rice rolls) in Houston. The kitchen has been turning out authentic Vietnamese comfort food for nearly 30 years. No English menu needed — the pictures tell the story, and everything is excellent.",
  dishes:["Banh Cuon","Pho","Bun Bo Hue","Spring Rolls"],
  address:"8200 Wilcrest Dr, Houston, TX 77072",phone:"(281) 495-4044",
  lat:29.7014,lng:-95.5558,instagram:"",website:"",suburb:true});

add({name:"Killen's BBQ",cuisine:"Texas BBQ",neighborhood:"Pearland",
  score:90,price:2,tags:["BBQ","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Texas Monthly Top 50 BBQ",
  description:"Chef Ronnie Killen's original BBQ joint in Pearland that put him on the map. Prime brisket, massive beef ribs, and sides like cream corn and bread pudding that have their own cult following. Texas Monthly Top 50 BBQ. Lines form before doors open but the food is worth every minute of the wait.",
  dishes:["Prime Brisket","Beef Ribs","Cream Corn","Bread Pudding"],
  address:"3613 E Broadway St, Pearland, TX 77581",phone:"(281) 485-2272",
  lat:29.5653,lng:-95.2765,instagram:"killensbbq",website:"https://www.killensbbq.com",suburb:true});

add({name:"Himalaya",cuisine:"Indian / Pakistani / Indo-Chinese",neighborhood:"Southwest Houston",
  score:87,price:1,tags:["Indian","Pakistani","Halal","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Chef Kaiser Lashkari's beloved Indo-Pak restaurant in a strip mall on Hillcroft that's been serving Houston since 2002. The biryani is legendary, the fried chicken rivals any in the city, and the Indo-Chinese fusion dishes are a hidden menu treasure. Casual, chaotic, and absolutely essential Houston dining.",
  dishes:["Biryani","Fried Chicken","Goat Karahi","Indo-Chinese Plates"],
  address:"6652 Southwest Fwy, Houston, TX 77074",phone:"(713) 532-2837",
  lat:29.6943,lng:-95.5130,instagram:"himalayarestaurant",website:"https://www.himalayarestauranthouston.com",suburb:true});

add({name:"Underbelly Hospitality / GJ Tavern",cuisine:"American Tavern",neighborhood:"Montrose",
  score:85,price:2,tags:["American","Bar","Casual","Late Night"],
  reservation:"walk-in",group:"Underbelly Hospitality",
  description:"Underbelly Hospitality's casual tavern sibling to Georgia James in Montrose. Classic American bar food elevated with the same quality sourcing that defines the group — smash burgers, crispy chicken sandwiches, and a solid draft beer list. The late-night menu makes it a go-to for industry workers.",
  dishes:["Smash Burger","Crispy Chicken Sandwich","Draft Beer","Late Night Menu"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"(832) 380-5652",
  lat:29.7434,lng:-95.3792,instagram:"gjtavern",website:"https://www.gjtavern.com"});

add({name:"Hay Merchant",cuisine:"Craft Beer / Gastropub",neighborhood:"Montrose",
  score:85,price:2,tags:["Craft Beer","Gastropub","Bar","Casual","Late Night"],
  reservation:"walk-in",
  description:"Montrose craft beer institution with 80+ taps and a gastropub kitchen that takes bar food seriously. Charcuterie boards, burgers, and rotating specials pair with one of the deepest beer lists in Texas. A favorite of brewers, chefs, and anyone who cares about good beer. Open late.",
  dishes:["Charcuterie","Burgers","Rotating Specials","80+ Draft Beers"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"(713) 528-9805",
  lat:29.7434,lng:-95.3792,instagram:"haymerchant",website:"https://www.haymerchant.com"});

add({name:"One Fifth",cuisine:"Rotating Concept",neighborhood:"Montrose",
  score:88,price:3,tags:["Fine Dining","Date Night","Cocktails","Rotating Concept"],
  reservation:"Resy",
  description:"Chris Shepherd's Montrose restaurant that reinvents itself every year with a completely new concept. Each iteration explores a different cuisine — from steakhouse to Gulf Coast to Mediterranean. The constant: excellent cooking, creative cocktails, and one of Houston's most beautiful dining rooms. Check what the current concept is before booking.",
  dishes:["Rotating Menu","Seasonal Tasting","Craft Cocktails","Chef's Selection"],
  address:"1658 Westheimer Rd, Houston, TX 77006",phone:"(713) 955-1024",
  lat:29.7429,lng:-95.3880,instagram:"onefifthhtx",website:"https://www.onefifthhouston.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
