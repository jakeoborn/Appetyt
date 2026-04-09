// Houston Batch 7: Final push to 250 — fill neighborhood gaps, add remaining essentials
// Run: node scripts/houston-batch-7.js

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

// === REMAINING ESSENTIALS ===

add({name:"Killen's Barbecue",cuisine:"Texas BBQ",neighborhood:"Pearland",
  score:90,price:2,tags:["BBQ","Local Favorites","Awards","Critics Pick"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, Texas Monthly Top 50 BBQ",
  description:"Chef Ronnie Killen's original BBQ joint in Pearland that's been a Houston pilgrimage since opening. Prime brisket, massive beef ribs on weekends, and the cream corn that launched a thousand copycats. Michelin Bib Gourmand and Texas Monthly Top 50. Lines start forming hours before doors open.",
  dishes:["Prime Brisket","Beef Ribs","Cream Corn","Bread Pudding"],
  address:"3613 E Broadway St, Pearland, TX 77581",phone:"(281) 485-2272",
  lat:29.5653,lng:-95.2765,instagram:"killensbbq",website:"https://www.killensbbq.com",suburb:true});

add({name:"Himalaya",cuisine:"Indian / Pakistani / Indo-Chinese",neighborhood:"Southwest Houston",
  score:87,price:1,tags:["Indian","Pakistani","Halal","Casual","Local Favorites"],
  reservation:"walk-in",awards:"Houston Chronicle Top 100",
  description:"Chef Kaiser Lashkari's beloved Indo-Pak institution in a Hillcroft strip mall serving Houston since 2002. The biryani is legendary, the fried chicken rivals any in the city, and the Indo-Chinese fusion dishes are a hidden-menu treasure. James Beard semifinalist and a Houston Chronicle Top 100 staple. Essential Houston.",
  dishes:["Biryani","Fried Chicken","Goat Karahi","Indo-Chinese Plates"],
  address:"6652 Southwest Fwy, Houston, TX 77074",phone:"(713) 532-2837",
  lat:29.6943,lng:-95.5130,instagram:"himalayarestaurant",website:"https://www.himalayarestauranthouston.com",suburb:true});

add({name:"The Pit Room Breakfast",cuisine:"Texas BBQ / Breakfast Tacos",neighborhood:"Memorial",
  score:86,price:1,tags:["BBQ","Breakfast","Tacos","Casual"],
  reservation:"walk-in",
  description:"The Pit Room's second location on the Katy Freeway brings the same Bib Gourmand BBQ to west Houston plus morning breakfast tacos from 7-10:30am. Brisket egg and cheese on a fresh tortilla is the way to start a Texas morning.",
  dishes:["Brisket Breakfast Taco","Pulled Pork","Ribs","Mac & Cheese"],
  address:"10301 Katy Fwy, Houston, TX 77024",phone:"(346) 741-5550",
  lat:29.7821,lng:-95.4785,instagram:"thepitroom",website:"https://thepitroombbq.com"});

add({name:"Hay Merchant",cuisine:"Craft Beer / Gastropub",neighborhood:"Montrose",
  score:85,price:2,tags:["Craft Beer","Gastropub","Bar","Late Night","Local Favorites"],
  reservation:"walk-in",awards:"James Beard Outstanding Bar Semifinalist",
  description:"Montrose craft beer institution with 80+ taps and a gastropub kitchen that takes bar food seriously. Charcuterie, burgers, and rotating specials pair with one of the deepest beer lists in Texas. JBF Outstanding Bar semifinalist. A favorite of brewers, chefs, and anyone who cares about great beer.",
  dishes:["Charcuterie","Burgers","Rotating Specials","80+ Draft Beers"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"(713) 528-9805",
  lat:29.7434,lng:-95.3792,instagram:"haymerchant",website:"https://www.haymerchant.com"});

add({name:"One Fifth",cuisine:"Rotating Concept",neighborhood:"Montrose",
  score:88,price:3,tags:["Fine Dining","Date Night","Cocktails","Rotating Concept"],
  reservation:"Resy",
  description:"Chris Shepherd's Montrose restaurant that reinvents itself with a new concept periodically. Each iteration explores a different cuisine with the same excellent cooking, creative cocktails, and gorgeous dining room. Check what the current concept is before booking. Always surprising, always excellent.",
  dishes:["Rotating Menu","Seasonal Tasting","Craft Cocktails"],
  address:"1658 Westheimer Rd, Houston, TX 77006",phone:"(713) 955-1024",
  lat:29.7429,lng:-95.3880,instagram:"onefifthhtx",website:"https://www.onefifthhouston.com"});

add({name:"Better Luck Tomorrow",cuisine:"Cocktail Bar / Snacks",neighborhood:"Heights",
  score:86,price:2,tags:["Cocktails","Bar","Late Night","Local Favorites","Burgers"],
  reservation:"walk-in",awards:"JBF Outstanding Bar Semifinalist",
  description:"Bobby Heugel's casual Heights bar — Anvil's laid-back sibling. Craft cocktails without pretension, cold beer, and a burger that's among Houston's best in a neighborhood dive setting. JBF semifinalist that proves great drinks don't need velvet ropes.",
  dishes:["BLT Burger","Craft Cocktails","Cold Beer","Bar Snacks"],
  address:"544 Yale St, Houston, TX 77007",phone:"(713) 869-4420",
  lat:29.7767,lng:-95.3989,instagram:"betterlucktomorrow",website:"https://www.betterlucktomorrow.com"});

add({name:"Pepper Twins",cuisine:"Sichuan Chinese",neighborhood:"Montrose",
  score:86,price:2,tags:["Chinese","Sichuan","Spicy","Local Favorites"],
  reservation:"walk-in",
  description:"Twin sisters serving fiery Sichuan cooking in Montrose. The mapo tofu is mouth-numbing perfection, the dan dan noodles are addictive, and the cumin lamb is packed with wok hei. For Houstonians who want real Sichuan heat without the Bellaire Blvd drive.",
  dishes:["Mapo Tofu","Dan Dan Noodles","Cumin Lamb","Kung Pao Chicken"],
  address:"2005 W Gray St, Houston, TX 77019",phone:"(713) 529-0789",
  lat:29.7535,lng:-95.3915,instagram:"peppertwinshou",website:"https://www.peppertwins.com"});

add({name:"Tiger Den",cuisine:"Japanese Ramen / Izakaya",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Japanese","Ramen","Casual","Cheap Eats","Late Night"],
  reservation:"walk-in",
  description:"Hakata-style ramen simmered 24 hours for $9 a bowl on Bellaire. The spicy miso and black bean ramen stand out, and the robata yakitori is a must. Chefs eat here after their own shifts — that's all you need to know.",
  dishes:["Spicy Miso Ramen","Black Bean Ramen","Yakitori","Gyoza"],
  address:"9889 Bellaire Blvd, Suite D-230, Houston, TX 77036",phone:"(832) 804-7755",
  lat:29.7035,lng:-95.5533,instagram:"tigerdentx",website:"https://www.tigerdenramen.com",suburb:true});

add({name:"8th Wonder Brewery",cuisine:"Brewery / Beer Garden",neighborhood:"EaDo",
  score:84,price:1,tags:["Brewery","Craft Beer","Patio","Local Favorites","Sports"],
  reservation:"walk-in",
  description:"EaDo anchor brewery with a massive beer garden steps from the stadiums. Rocket Fuel Vietnamese coffee stout is the signature. Game-day crowds pack the yard for pre-gaming. 20+ house beers and rotating food trucks.",
  dishes:["Rocket Fuel Stout","Hopston IPA","Food Trucks","Pretzels"],
  address:"2202 Dallas St, Houston, TX 77003",phone:"(832) 371-1666",
  lat:29.7482,lng:-95.3478,instagram:"8thwonderbrewery",website:"https://www.8thwonder.com"});

add({name:"El Tiempo Cantina",cuisine:"Tex-Mex",neighborhood:"Richmond Ave",
  score:88,price:2,tags:["Tex-Mex","Fajitas","Margaritas","Local Favorites"],
  reservation:"walk-in",
  description:"The Laurenzo family's Tex-Mex empire — sizzling prime beef fajitas, handmade flour tortillas, and dangerously strong margaritas. Loud, festive, and unapologetically Texan. The queso is liquid gold.",
  dishes:["Beef Fajitas","Flour Tortillas","Margaritas","Queso"],
  address:"3130 Richmond Ave, Houston, TX 77098",phone:"(713) 807-1600",
  lat:29.7336,lng:-95.4253,instagram:"eltiempocantina",website:"https://eltiempocantina.com"});

add({name:"The Breakfast Klub",cuisine:"Soul Food / Breakfast",neighborhood:"Midtown",
  score:88,price:1,tags:["Breakfast","Brunch","Soul Food","Local Favorites","Viral"],
  reservation:"walk-in",
  description:"Wings and waffles, catfish and grits, and lines out the door. Obama ate here. Guy Fieri filmed here. Locals come every weekend. A Houston institution.",
  dishes:["Wings & Waffles","Catfish & Grits","Pancakes"],
  address:"3711 Travis St, Houston, TX 77002",phone:"(713) 528-8561",
  lat:29.7385,lng:-95.3804,instagram:"katfishandgrits",website:"https://thebreakfastklub.com"});

add({name:"Present Company",cuisine:"Cocktail Bar / Patio",neighborhood:"Montrose",
  score:84,price:2,tags:["Cocktails","Bar","Patio","Late Night","Local Favorites"],
  reservation:"walk-in",
  description:"Montrose bar with a massive patio and frozen cocktails. The frozen ranch water is legendary in summer. Late-night crowd skews young and social. Third stop on the Westheimer bar crawl.",
  dishes:["Frozen Ranch Water","Craft Cocktails","Bar Snacks"],
  address:"1318 Westheimer Rd, Houston, TX 77006",phone:"(832) 843-1162",
  lat:29.7432,lng:-95.3819,instagram:"presentcompanyhtx",website:"https://www.presentcompanyhtx.com"});

add({name:"Gatlin's BBQ",cuisine:"Texas BBQ",neighborhood:"Heights",
  score:88,price:2,tags:["BBQ","Local Favorites","Family"],
  reservation:"walk-in",awards:"Texas Monthly Top 50 BBQ",
  description:"Pitmaster Greg Gatlin's family BBQ in the Heights. Moist peppery brisket, fall-off-the-bone ribs, and homemade dirty rice. Texas Monthly Top 50 and a Houston institution.",
  dishes:["Brisket","Pork Ribs","Dirty Rice","Peach Cobbler"],
  address:"3510 Ella Blvd, Building C, Houston, TX 77018",phone:"(713) 869-4227",
  lat:29.8010,lng:-95.4235,instagram:"gatlinsbbq",website:"https://gatlinsbbq.com"});

add({name:"Feges BBQ",cuisine:"Texas BBQ / Modern",neighborhood:"Spring Branch",
  score:89,price:2,tags:["BBQ","Local Favorites","Critics Pick","Wine"],
  reservation:"walk-in",awards:"Texas Monthly Top 50 BBQ",
  description:"Patrick Feges and Erin Smith's modern BBQ pairing smoked meats with elevated sides, natural wine, and seasonal salads. Texas Monthly Top 50 with two locations.",
  dishes:["Brisket","Smoked Beet Salad","Boudin","Kolaches"],
  address:"8217 Long Point Rd, Houston, TX 77055",phone:"(346) 319-5339",
  lat:29.8050,lng:-95.4808,instagram:"fegesbbq",website:"https://fegesbbq.com"});

add({name:"Kata Robata",cuisine:"Japanese / Sushi",neighborhood:"Upper Kirby",
  score:89,price:3,tags:["Japanese","Sushi","Fine Dining","Date Night"],
  reservation:"Resy",awards:"Houston Chronicle Top 100",
  description:"Houston's premier sushi on Kirby Drive. Omakase is impeccable, robata grill is smoky perfection, and fish arrives from Tokyo's markets weekly. A Houston sushi institution.",
  dishes:["Omakase","Robata Grilled Items","Nigiri","Sake"],
  address:"3600 Kirby Dr, Suite H, Houston, TX 77098",phone:"(713) 526-8858",
  lat:29.7335,lng:-95.4195,instagram:"katarobata",website:"https://www.katarobata.com"});

add({name:"Nobie's",cuisine:"Italian-American",neighborhood:"Montrose",
  score:87,price:2,tags:["Italian","Date Night","Cocktails","Local Favorites"],
  reservation:"Tock",awards:"Michelin Bib Gourmand",
  description:"Intimate Montrose Italian with Michelin Bib Gourmand. Handmade pastas, thoughtful wines, cozy setting. Consistently great neighborhood dining.",
  dishes:["Handmade Pasta","Meatballs","Seasonal Risotto","Italian Wine"],
  address:"2048 Colquitt St, Houston, TX 77098",phone:"(346) 319-5919",
  lat:29.7395,lng:-95.3958,instagram:"nobieshouston",website:"https://www.nobieshtx.com"});

add({name:"Pho Binh",cuisine:"Vietnamese / Pho",neighborhood:"Midtown",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites","Cheap Eats"],
  reservation:"walk-in",
  description:"The pho Houston chefs swear by. Deep broth simmered since before dawn, simple menu, flawless execution. A critical piece of Houston's Vietnamese food story.",
  dishes:["Pho","Bun Bo Hue","Banh Mi","Vietnamese Coffee"],
  address:"3330 Milam St, Houston, TX 77006",phone:"(713) 524-3734",
  lat:29.7389,lng:-95.3810,instagram:"phobinhhouston",website:"https://www.phobinh.com"});

add({name:"Mala Sichuan Bistro",cuisine:"Sichuan Chinese",neighborhood:"Chinatown / Bellaire",
  score:88,price:2,tags:["Chinese","Sichuan","Spicy","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Michelin Bib Gourmand Sichuan with locations citywide. Mouth-numbing mapo tofu, addictive dan dan noodles, Houston-standard Sichuan.",
  dishes:["Mapo Tofu","Dan Dan Noodles","Dry-Fried Green Beans"],
  address:"9348 Bellaire Blvd, Houston, TX 77036",phone:"(713) 995-1889",
  lat:29.7035,lng:-95.5380,instagram:"malasichuanbistro",website:"https://www.malasichuan.com",suburb:true});

add({name:"Street to Kitchen",cuisine:"Thai",neighborhood:"East End",
  score:87,price:2,tags:["Thai","Awards","Cocktails"],
  reservation:"OpenTable",awards:"Michelin Bib Gourmand",
  description:"Michelin Bib Gourmand Thai bringing Bangkok street food to the East End. Pad kra pao, green curry, and Thai cocktails with Michelin-level technique.",
  dishes:["Pad Kra Pao","Green Curry","Som Tum","Thai Cocktails"],
  address:"3401 Harrisburg Blvd, Suite G, Houston, TX 77003",phone:"(281) 501-3435",
  lat:29.7487,lng:-95.3408,instagram:"streettokitchenhtx",website:"https://www.streettokitchen.vip"});

add({name:"Theodore Rex",cuisine:"New American / French",neighborhood:"Heights",
  score:93,price:3,tags:["Fine Dining","Date Night","Critics Pick"],
  reservation:"Resy",awards:"Houston Chronicle #5, Michelin Recommended",
  description:"Chef Justin Yu's French-leaning relaxed fine dining in the Heights. Gulf Coast ingredients, deep wine list, personal service. Houston institution for serious diners.",
  dishes:["Seasonal Tasting","Gulf Oysters","Handmade Pasta","Natural Wine"],
  address:"1302 Nance St, Houston, TX 77002",phone:"(832) 830-8592",
  lat:29.7678,lng:-95.3562,instagram:"theodore_rex_houston",website:"https://trexhouston.com"});

add({name:"Tacos Tierra Caliente",cuisine:"Street Tacos",neighborhood:"Montrose",
  score:87,price:1,tags:["Mexican","Tacos","Late Night","Cheap Eats"],
  reservation:"walk-in",
  description:"The iconic Montrose taco truck on West Alabama. Al pastor, barbacoa, and lengua on fresh corn tortillas with legendary green salsa. Open late, cash-friendly, non-negotiable Houston street food.",
  dishes:["Al Pastor Tacos","Barbacoa","Lengua","Green Salsa"],
  address:"2003 W Alabama St, Houston, TX 77098",phone:"(713) 584-9359",
  lat:29.7395,lng:-95.3935,instagram:"tacostierracalientetx",website:"https://www.tacostierracalientemx.com"});

add({name:"Tobiuo Sushi & Bar",cuisine:"Japanese / Sushi",neighborhood:"Katy",
  score:88,price:3,tags:["Japanese","Sushi","Date Night"],
  reservation:"OpenTable",
  description:"Destination sushi in Katy worth the drive. Pristine fish from Japan, creative rolls, ambitious cocktails.",
  dishes:["Omakase","Creative Rolls","Sashimi"],
  address:"23501 Cinco Ranch Blvd, Suite H130, Katy, TX 77494",phone:"(281) 394-7156",
  lat:29.7368,lng:-95.7637,instagram:"tobiuosushibar",website:"https://tobiuosushibar.com",suburb:true});

add({name:"Torchy's Tacos",cuisine:"Creative Tacos",neighborhood:"Heights",
  score:83,price:1,tags:["Tacos","Casual","Brunch"],
  reservation:"walk-in",
  description:"Austin-born creative tacos. Trailer Park (fried chicken, ranch) and Crossroads (brisket, cheddar) are cult classics. Queso is addictive.",
  dishes:["Trailer Park Taco","Green Chile Queso","Breakfast Tacos"],
  address:"350 W 19th St, Houston, TX 77008",phone:"(713) 595-8226",
  lat:29.8015,lng:-95.3919,instagram:"torchystacos",website:"https://www.torchystacos.com"});

add({name:"Nam Giao",cuisine:"Vietnamese / Hue Regional",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Vietnamese","Casual","Local Favorites"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Hidden gem specializing in Hue cuisine. Steamed rice cakes, bun bo Hue, and dishes that chefs consider essential Vietnamese dining in America. Michelin Bib Gourmand.",
  dishes:["Steamed Rice Cakes","Bun Bo Hue","Banh Beo"],
  address:"11108 Bellaire Blvd, Houston, TX 77072",phone:"(281) 988-5655",
  lat:29.7059,lng:-95.5455,instagram:"namgiaorestaurant",website:"",suburb:true});

add({name:"Anvil Bar & Refuge",cuisine:"Cocktail Bar",neighborhood:"Montrose",
  score:88,price:2,tags:["Cocktails","Bar","Date Night","Awards"],
  reservation:"walk-in",awards:"JBF Outstanding Bar Semifinalist",
  description:"Bobby Heugel's legendary Montrose cocktail bar that launched Houston's craft cocktail revolution. 100 drinks spanning classics and originals, world-class bartenders, JBF semifinalist. Anchor of Westheimer's nightlife. No reservations — trust the bartender.",
  dishes:["Classic Cocktails","Seasonal Menu","Bar Snacks"],
  address:"1424 Westheimer Rd, Houston, TX 77006",phone:"(713) 523-1622",
  lat:29.7430,lng:-95.3835,instagram:"anvilhouston",website:"https://www.anvilhouston.com"});

add({name:"Lucille's",cuisine:"Southern / Soul Food",neighborhood:"Museum District",
  score:88,price:2,tags:["Southern","Brunch","Date Night"],group:"LHG (Chris Williams)",
  reservation:"OpenTable",awards:"JBF Best Restaurateur Finalist",
  description:"Chef Chris Williams' Museum District Southern flagship. Fried green tomatoes, chicken fried steak, and the brunch that launched a hospitality empire. James Beard-nominated.",
  dishes:["Fried Green Tomatoes","Chicken Fried Steak","Country Benedict"],
  address:"5512 La Branch St, Houston, TX 77004",phone:"(713) 568-2505",
  lat:29.7278,lng:-95.3770,instagram:"lucilleshouston",website:"https://www.lucilleshouston.com"});

add({name:"Saigon Pagolac",cuisine:"Vietnamese",neighborhood:"Chinatown / Bellaire",
  score:86,price:1,tags:["Vietnamese","Casual","Cheap Eats"],
  reservation:"walk-in",
  description:"Seven-course beef tasting menu for under $20 per person. Bo 7 Mon takes you through beef seven ways in a Bellaire strip mall. A Houston institution for decades.",
  dishes:["Seven-Course Beef","Pho","Shaking Beef"],
  address:"9600 Bellaire Blvd, Suite 118, Houston, TX 77036",phone:"(713) 773-5578",
  lat:29.7062,lng:-95.5305,instagram:"",website:"",suburb:true});

add({name:"Roost",cuisine:"New American / Bistro",neighborhood:"Montrose",
  score:87,price:2,tags:["American","Brunch","Date Night"],
  reservation:"OpenTable",
  description:"Montrose neighborhood bistro since 2011. Seasonal New American, Southern influences, loyal weekend brunch crowd. Unpretentious and consistent.",
  dishes:["Roasted Chicken","Gulf Fish","Weekend Brunch"],
  address:"1972 Fairview St, Houston, TX 77019",phone:"(713) 523-7667",
  lat:29.7457,lng:-95.3952,instagram:"iloveroost",website:"https://www.iloveroost.com"});

add({name:"Oporto Fooding House",cuisine:"Portuguese",neighborhood:"Midtown",
  score:87,price:2,tags:["Portuguese","Seafood","Date Night","Wine Bar"],
  reservation:"OpenTable",
  description:"Portuguese seafood in Midtown. Shareable petiscos, piri-piri shrimp, Portuguese paella. Best port wine selection in the city.",
  dishes:["Portuguese Paella","Piri-Piri Shrimp","Petiscos"],
  address:"3833 Richmond Ave, Suite 100, Houston, TX 77027",phone:"(346) 227-7452",
  lat:29.7333,lng:-95.4359,instagram:"oportohouston",website:"https://www.oportohouston.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
console.log('Target: 250. Status: ' + (arr.length >= 250 ? '🎯 TARGET HIT!' : (250 - arr.length) + ' more needed'));
