// Houston Batch 5: Push to 250 — BBQ, brunch, bars, neighborhoods, new openings
// Run: node scripts/houston-batch-5.js

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

// === BBQ ===
add({name:"Gatlin's BBQ",cuisine:"Texas BBQ",neighborhood:"Heights",
  score:88,price:2,tags:["BBQ","Local Favorites","Family"],
  reservation:"walk-in",awards:"Texas Monthly Top 50 BBQ",
  description:"Pitmaster Greg Gatlin's family-owned BBQ joint in the Heights serving some of Houston's most consistent smoked meats. The brisket is moist and peppery, the ribs fall-off-the-bone tender, and the sides — especially the dirty rice and potato salad — are homemade perfection. Texas Monthly Top 50 and a Houston institution.",
  dishes:["Brisket","Pork Ribs","Dirty Rice","Peach Cobbler"],
  address:"3510 Ella Blvd, Building C, Houston, TX 77018",phone:"(713) 869-4227",
  lat:29.8010,lng:-95.4235,instagram:"gatlinsbbq",website:"https://gatlinsbbq.com"});

add({name:"Feges BBQ",cuisine:"Texas BBQ / Modern",neighborhood:"Spring Branch",
  score:89,price:2,tags:["BBQ","Local Favorites","Critics Pick","Wine"],
  reservation:"walk-in",awards:"Texas Monthly Top 50 BBQ",
  description:"Patrick Feges and Erin Smith's modern BBQ concept that pairs smoked meats with elevated sides, natural wine, and seasonal salads. The brisket is textbook, but the kolaches, boudin, and sides like smoked beet salad push BBQ into fine-casual territory. Two locations — Spring Branch is the sit-down spot.",
  dishes:["Brisket","Smoked Beet Salad","Boudin","Kolaches"],
  address:"8217 Long Point Rd, Houston, TX 77055",phone:"(346) 319-5339",
  lat:29.8050,lng:-95.4808,instagram:"fegesbbq",website:"https://fegesbbq.com"});

// === NEIGHBORHOOD FAVORITES ===
add({name:"Weights + Measures",cuisine:"New American / Bakery",neighborhood:"Midtown",
  score:87,price:2,tags:["American","Brunch","Bakery","Pizza","Cocktails"],
  reservation:"OpenTable",
  description:"All-day restaurant and bakery in a converted 1950s industrial warehouse in Midtown. From morning pastries and coffee to wood-fired pizza and craft cocktails at night, Weights + Measures covers every meal with style. The sourdough bread program is serious and the weekend brunch is one of Houston's best.",
  dishes:["Sourdough Bread","Wood-Fired Pizza","Brunch Plates","Pastries"],
  address:"2808 Caroline St, Houston, TX 77004",phone:"(713) 654-1970",
  lat:29.7388,lng:-95.3700,instagram:"weightsandmeasures",website:"https://weights-measures.com"});

add({name:"Liberty Kitchen & Oysterette",cuisine:"American / Seafood",neighborhood:"River Oaks",
  score:87,price:2,tags:["American","Seafood","Brunch","Patio","Family"],
  reservation:"OpenTable",
  description:"Chef Lance Fegen's New American restaurant and oyster bar with multiple locations across Houston. Gulf oysters, inventive sandwiches, and weekend brunch in a warm, neighborhood-friendly setting. The Treehouse location in Memorial has a spectacular patio. Liberty Kitchen defines Houston's casual fine dining.",
  dishes:["Gulf Oysters","Liberty Burger","Weekend Brunch","Seafood Plates"],
  address:"4224 San Felipe St, Houston, TX 77027",phone:"(713) 622-1010",
  lat:29.7479,lng:-95.4387,instagram:"libertykitcheneats",website:"https://www.libertykitchenoysterette.com"});

add({name:"Milton's",cuisine:"Italian-American / Trattoria",neighborhood:"Rice Village",
  score:87,price:2,tags:["Italian","Date Night","Cocktails","New Opening"],
  indicators:["new"],reservation:"Resy",
  description:"Italian-American trattoria in Rice Village from the team behind James Beard-nominated Lee's cocktail bar next door. Handmade pastas, wood-fired meats, and an Italian-leaning wine list in a sleek, modern space. The kind of neighborhood Italian everyone wishes they had — polished but unpretentious.",
  dishes:["Handmade Pasta","Wood-Fired Chicken","Italian Wine","Tiramisu"],
  address:"5117 Kelvin Dr, Suite 200, Houston, TX 77005",phone:"(713) 492-2490",
  lat:29.7196,lng:-95.4166,instagram:"miltonshtx",website:"https://miltonandlees.com/miltons/"});

add({name:"Boo's Burgers",cuisine:"Smash Burgers",neighborhood:"East End",
  score:85,price:1,tags:["Burgers","Casual","New Opening","Local Favorites"],
  indicators:["new"],reservation:"walk-in",awards:"Houstonia Top 10 New 2025",
  description:"Chef Joseph Boudreaux spent years doing popup smash burgers before landing this brick-and-mortar on Navigation. The patties are thin-smashed on a flat top, topped with fresh shredded lettuce, tomato, and shaved onion on a challah bun. Simple, perfect, and worth the trip to the East End.",
  dishes:["Smash Burgers","Fries","Milkshakes"],
  address:"2510 Navigation Blvd, Houston, TX 77003",phone:"(281) 692-5787",
  lat:29.7530,lng:-95.3480,instagram:"boosburgershtx",website:"https://www.boosburgers.com",trending:true});

// === BARS & WINE ===
add({name:"Postino Wine Cafe",cuisine:"Wine Bar / Cafe",neighborhood:"Heights",
  score:85,price:2,tags:["Wine Bar","Brunch","Casual","Patio","Happy Hour"],
  reservation:"walk-in",
  description:"Heights wine bar with one of the best happy hours in the city — $6 wines and beer pitchers before 5pm daily. Bruschetta boards, paninis, and salads pair perfectly with the approachable by-the-glass program. The patio on Yale Street is a Heights institution for after-work drinks.",
  dishes:["Bruschetta Board","Paninis","$6 Happy Hour Wine","Charcuterie"],
  address:"642 Yale St, Suite A, Houston, TX 77007",phone:"(346) 223-1111",
  lat:29.7767,lng:-95.3989,instagram:"postinowinecafe",website:"https://www.postino.com"});

add({name:"Johnny's Gold Brick",cuisine:"Cocktail Bar",neighborhood:"Heights",
  score:85,price:2,tags:["Cocktails","Bar","Date Night","Local Favorites"],
  reservation:"walk-in",
  description:"Intimate Heights cocktail bar that's been the neighborhood's go-to for well-made drinks since 2015. The bartenders know their craft, the atmosphere is warm and unhurried, and the space is small enough to feel like a secret. Perfect for a date or catching up with friends over expertly stirred old fashioneds.",
  dishes:["Old Fashioned","Seasonal Cocktails","Bar Snacks"],
  address:"2518 Yale St, Houston, TX 77008",phone:"(713) 864-2518",
  lat:29.7912,lng:-95.3989,instagram:"johnnysgoldbrick",website:"https://www.johnnysgoldbrick.com"});

add({name:"13 Celsius",cuisine:"Wine Bar",neighborhood:"Midtown",
  score:85,price:2,tags:["Wine Bar","Date Night","Patio","Local Favorites"],
  reservation:"walk-in",
  description:"Midtown wine bar in a converted house with an intimate patio that's perfect for dates and friend catch-ups. The wine list is well-curated and approachable, the cheese boards are generous, and the candle-lit atmosphere makes everything taste better. A Houston classic for wine lovers.",
  dishes:["Wine by the Glass","Cheese Boards","Charcuterie","Small Plates"],
  address:"3000 Caroline St, Houston, TX 77004",phone:"(713) 529-8466",
  lat:29.7370,lng:-95.3685,instagram:"13celsius",website:"https://www.13celsius.com"});

add({name:"Present Company",cuisine:"Cocktail Bar / Patio",neighborhood:"Montrose",
  score:84,price:2,tags:["Cocktails","Bar","Patio","Late Night","Local Favorites"],
  reservation:"walk-in",
  description:"Montrose neighborhood bar with a massive patio, frozen cocktails, and a come-as-you-are energy. The frozen ranch water is legendary in summer and the patio is one of the best outdoor drinking spots in the city. Late-night crowd skews young and social. The third stop on the Westheimer bar crawl.",
  dishes:["Frozen Ranch Water","Craft Cocktails","Bar Snacks"],
  address:"1318 Westheimer Rd, Houston, TX 77006",phone:"(832) 843-1162",
  lat:29.7432,lng:-95.3819,instagram:"presentcompanyhtx",website:"https://www.presentcompanyhtx.com"});

add({name:"Axelrad Beer Garden",cuisine:"Beer Garden / Bar",neighborhood:"Midtown",
  score:84,price:1,tags:["Craft Beer","Bar","Patio","Live Music","Local Favorites"],
  reservation:"walk-in",
  description:"Midtown beer garden with hammocks, a covered patio, food trucks, and a rotating tap list in a converted parking lot that shouldn't work but absolutely does. Free live music most nights, trivia on Tuesdays, and the most laid-back vibe in the neighborhood. Houston's unofficial backyard bar.",
  dishes:["Craft Beer","Food Trucks","Wine","Frozen Drinks"],
  address:"1517 Alabama St, Houston, TX 77004",phone:"(832) 271-9553",
  lat:29.7396,lng:-95.3762,instagram:"axelradbeergarden",website:"https://www.axelradbeergarden.com"});

add({name:"Heights Bier Garten",cuisine:"German / Beer Garden",neighborhood:"Heights",
  score:84,price:1,tags:["Beer Garden","German","Patio","Family","Sports"],
  reservation:"walk-in",
  description:"Dog-friendly Heights beer garden with picnic tables, sausages, pretzels, and 30+ craft beers on tap. The covered patio is packed on weekends for brunch and game days. Family-friendly during the day, social scene at night. One of the original Heights hangout spots.",
  dishes:["Bratwurst","Pretzels","Craft Beer","German Specials"],
  address:"1493 Heights Blvd, Houston, TX 77008",phone:"(713) 869-7665",
  lat:29.7870,lng:-95.3930,instagram:"heightsbiergarten",website:"https://www.heightsbiergarten.com"});

// === MORE ESSENTIAL RESTAURANTS ===
add({name:"Ramen Tatsu-Ya",cuisine:"Japanese Ramen",neighborhood:"Montrose",
  score:88,price:2,tags:["Japanese","Ramen","Casual","Late Night","Local Favorites"],
  reservation:"walk-in",
  description:"Austin's cult ramen hit brought to Montrose with rich, deeply flavored tonkotsu broth that's been simmering for 18+ hours. The OG Tonkotsu is the essential order, and the vegan options are surprisingly excellent. Lines form nightly and for good reason. The best bowl of ramen in Houston, full stop.",
  dishes:["OG Tonkotsu","Spicy Ramen","Vegan Ramen","Gyoza"],
  address:"1722 California St, Houston, TX 77006",phone:"(512) 466-5577",
  lat:29.7438,lng:-95.3765,instagram:"raboratory",website:"https://ramentatsuyahtx.com"});

add({name:"Mala Sichuan Bistro",cuisine:"Sichuan Chinese",neighborhood:"Chinatown / Bellaire",
  score:88,price:2,tags:["Chinese","Sichuan","Spicy","Local Favorites","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Michelin Bib Gourmand Sichuan restaurant with locations in Chinatown, Montrose, and Heights. The mapo tofu is mouth-numbing, the dry-fried green beans are addictive, and the dan dan noodles set the Houston standard. Multiple locations let you get your Sichuan fix wherever you are in the city.",
  dishes:["Mapo Tofu","Dan Dan Noodles","Dry-Fried Green Beans","Kung Pao Chicken"],
  address:"9348 Bellaire Blvd, Houston, TX 77036",phone:"(713) 995-1889",
  lat:29.7035,lng:-95.5380,instagram:"malasichuanbistro",website:"https://www.malasichuan.com",suburb:true});

add({name:"Street to Kitchen",cuisine:"Thai",neighborhood:"East End",
  score:87,price:2,tags:["Thai","Local Favorites","Awards","Cocktails"],
  reservation:"OpenTable",awards:"Michelin Bib Gourmand",
  description:"Michelin Bib Gourmand Thai restaurant in the East End bringing Bangkok street food flavors to a sit-down setting. The pad kra pao, green curry, and som tum are executed with technique that earned Michelin's attention. The cocktail program is Thai-inspired and excellent. A Houston essential.",
  dishes:["Pad Kra Pao","Green Curry","Som Tum","Thai Cocktails"],
  address:"3401 Harrisburg Blvd, Suite G, Houston, TX 77003",phone:"(281) 501-3435",
  lat:29.7487,lng:-95.3408,instagram:"streettokitchenhtx",website:"https://www.streettokitchen.vip"});

add({name:"Shokku Ramen",cuisine:"Japanese Ramen",neighborhood:"Heights",
  score:85,price:1,tags:["Japanese","Ramen","Casual","Late Night"],
  reservation:"walk-in",
  description:"Heights ramen shop with tonkotsu, miso, and shoyu bowls that rival the competition. The portions are generous, the broth is rich, and the crispy chicken bao buns are a must-order side. Late-night hours make it a favorite for the post-bar crowd. A solid neighborhood ramen anchor.",
  dishes:["Tonkotsu Ramen","Miso Ramen","Chicken Bao","Gyoza"],
  address:"933 Studewood St, Houston, TX 77008",phone:"(346) 318-2345",
  lat:29.7860,lng:-95.3980,instagram:"shokkuramen",website:"https://shokkuramen.com"});

add({name:"Conservatory",cuisine:"Food Hall / Beer Garden",neighborhood:"Downtown",
  score:83,price:1,tags:["Food Hall","Craft Beer","Casual","Downtown"],
  reservation:"walk-in",
  description:"Underground food hall and beer garden beneath downtown Houston. Multiple food vendors rotate alongside 60+ craft beers on tap in a subterranean space that feels like a European beer hall. The rotating lineup means there's always something new, and the central downtown location makes it a pre-event favorite.",
  dishes:["Rotating Food Vendors","60+ Craft Beers","Wine","Bar Snacks"],
  address:"1010 Prairie St, Houston, TX 77002",phone:"(713) 999-1515",
  lat:29.7562,lng:-95.3618,instagram:"conservatoryhtx",website:"https://www.conservatoryhtx.com"});

add({name:"Indianola",cuisine:"Modern Texan",neighborhood:"EaDo",
  score:87,price:2,tags:["American","Southern","Date Night","Cocktails"],
  reservation:"OpenTable",
  description:"Modern Texas food in EaDo where chef Bryan Caswell (before Latuli) built a temple to Gulf Coast ingredients. The menu celebrates Texas ranching, fishing, and farming traditions with refined technique. The dining room is gorgeous and the cocktail program is Gulf-inspired.",
  dishes:["Gulf Oysters","Smoked Brisket","Seasonal Fish","Texas Pecan Pie"],
  address:"1201 St Emanuel St, Houston, TX 77003",phone:"(832) 582-7202",
  lat:29.7476,lng:-95.3512,instagram:"indianolahtx",website:"https://www.indianolahtx.com"});

add({name:"Ramen Tatsu-Ya EaDo",cuisine:"Japanese Ramen",neighborhood:"EaDo",
  score:86,price:1,tags:["Japanese","Ramen","Casual"],
  reservation:"walk-in",
  description:"Second Houston location of Austin's cult ramen chain near the stadiums. Same 18-hour tonkotsu broth, same OG Tonkotsu bowl, perfect for pre/post-game dining in EaDo. The vegan options are excellent for non-meat eaters.",
  dishes:["OG Tonkotsu","Vegan Ramen","Gyoza"],
  address:"909 Texas Ave, Houston, TX 77002",phone:"",
  lat:29.7565,lng:-95.3600,instagram:"raboratory",website:"https://ramentatsuyahtx.com"});

add({name:"Bosscat Kitchen & Libations",cuisine:"American / Whiskey Bar",neighborhood:"Heights",
  score:85,price:2,tags:["American","Whiskey","Brunch","Cocktails"],
  reservation:"OpenTable",
  description:"Whiskey-obsessed American restaurant in the Heights with 300+ bottles behind the bar and a comfort food menu built around burgers, steaks, and brunch. The whiskey flights are the main event, and the weekend brunch draws a devoted crowd for chicken and waffles and boozy morning cocktails.",
  dishes:["Whiskey Flights","Burgers","Chicken & Waffles","Brunch Cocktails"],
  address:"1801 N Shepherd Dr, Houston, TX 77008",phone:"(713) 439-0151",
  lat:29.7960,lng:-95.4058,instagram:"bosscatkitchen",website:"https://www.bosscatkitchen.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
