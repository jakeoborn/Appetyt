const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find Chicago inline array in CITY_DATA
const marker = "const CHICAGO_DATA=";
const idx = html.indexOf(marker);
const arrS = html.indexOf('[', idx);
let d = 0, arrE = arrS;
for (let j = arrS; j < html.length; j++) {
  if (html[j] === '[') d++;
  if (html[j] === ']') { d--; if (d === 0) { arrE = j + 1; break; } }
}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Chicago before:', arr.length);

const maxId = Math.max(...arr.map(r => r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r => r.name.toLowerCase()));
let count = 0;

function add(s) {
  const lower = s.name.toLowerCase();
  if (existing.has(lower)) { console.log('SKIP:', s.name); return; }
  s.id = nextId++; s.bestOf = []; s.busyness = null; s.waitTime = null;
  s.popularTimes = null; s.lastUpdated = null; s.trending = false;
  s.group = s.group || ''; s.suburb = false; s.menuUrl = '';
  s.res_tier = s.price >= 3 ? 4 : 2; s.indicators = s.indicators || [];
  s.awards = s.awards || ''; s.phone = ''; s.reserveUrl = ''; s.hh = '';
  s.verified = true; s.hours = ''; s.dishes = s.dishes || [];
  s.reservation = s.reservation || 'walk-in'; s.photoUrl = '';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// West Loop / Fulton Market
add({name:"The Publican",cuisine:"American / Beer Hall",neighborhood:"West Loop",score:88,price:3,tags:["Brunch","Date Night","Local Favorites","Cocktails"],description:"Paul Kahan cathedral to beer, pork, and oysters in a stunning Belgian farmhouse-style hall.",address:"837 W Fulton Market, Chicago, IL 60607",lat:41.8866,lng:-87.6489,instagram:"@thepublicanchi",website:"https://thepublicanrestaurant.com"});
add({name:"Little Goat Diner",cuisine:"American Diner",neighborhood:"West Loop",score:82,price:2,tags:["Brunch","Casual","Local Favorites"],description:"Stephanie Izard funky all-day diner on Randolph Street with creative breakfast and comfort classics.",address:"820 W Randolph St, Chicago, IL 60607",lat:41.8840,lng:-87.6476,instagram:"@littlegoatchicago",website:"https://littlegoatchicago.com"});
add({name:"Taqueria Chingon",cuisine:"Mexican / Tacos",neighborhood:"West Loop",score:85,price:2,tags:["Mexican","Casual","Local Favorites"],description:"Vibrant casual taqueria on Fulton Market with tacos, cemitas, quesadillas, and churros.",address:"817 W Fulton Market, Chicago, IL 60607",lat:41.8865,lng:-87.6487,instagram:"@taqueriachingon",website:"https://taqueriachingon.com"});
add({name:"Metric Coffee",cuisine:"Coffee / Roaster",neighborhood:"West Loop",score:86,price:2,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Chicago independent roaster on Fulton Street championing direct-trade beans.",address:"2021 W Fulton St, Chicago, IL 60612",lat:41.8863,lng:-87.6756,instagram:"@metriccoffee",website:"https://metriccoffee.com"});
add({name:"Sawada Coffee",cuisine:"Coffee",neighborhood:"West Loop",score:85,price:2,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"World latte art champion Hiroshi Sawada stylish cafe known for Military Latte and matcha.",address:"112 N Green St, Chicago, IL 60607",lat:41.8846,lng:-87.6483,instagram:"@sawadacoffee",website:"https://sawadacoffee.com"});

// River North
add({name:"Bavette's Bar & Boeuf",cuisine:"French Steakhouse",neighborhood:"River North",score:91,price:4,tags:["Steakhouse","Cocktails","Date Night","Fine Dining"],indicators:["iconic"],description:"Moody candlelit French steakhouse known for dry-aged cuts, oysters, and impeccable classic cocktails.",address:"218 W Kinzie St, Chicago, IL 60654",lat:41.8889,lng:-87.6349,instagram:"@bavetteschicago",website:"https://bavetteschicago.com"});
add({name:"Gene & Georgetti",cuisine:"Italian American Steakhouse",neighborhood:"River North",score:84,price:4,tags:["Steakhouse","Local Favorites","Italian"],indicators:["iconic"],description:"Chicago oldest steakhouse since 1941 — family-run institution serving steaks and chops.",address:"500 N Franklin St, Chicago, IL 60654",lat:41.8909,lng:-87.6357,instagram:"@geneandgeorgetti",website:"https://geneandgeorgetti.com"});
add({name:"Three Dots and a Dash",cuisine:"Tiki Bar / Cocktails",neighborhood:"River North",score:89,price:3,tags:["Cocktails","Bar","Date Night","Late Night"],indicators:["hidden-gem"],description:"World-renowned subterranean tiki bar hidden down an alley with elaborate rum-forward cocktails.",address:"435 N Clark St, Chicago, IL 60654",lat:41.8903,lng:-87.6307,instagram:"@threedotsandadash",website:"https://threedotschicago.com"});
add({name:"The Drifter",cuisine:"Speakeasy / Cocktail Bar",neighborhood:"River North",score:87,price:3,tags:["Cocktails","Bar","Date Night","Late Night"],indicators:["hidden-gem"],description:"Tiny Prohibition-era speakeasy beneath the Green Door Tavern with craft cocktails and burlesque.",address:"676 N Orleans St, Chicago, IL 60654",lat:41.8935,lng:-87.6364,instagram:"@thedrifterchicago",website:"https://thedrifterchicago.com"});
add({name:"Mr. Beef on Orleans",cuisine:"Italian Beef",neighborhood:"River North",score:85,price:1,tags:["Casual","Local Favorites"],indicators:["iconic"],description:"The legendary Italian beef counter that inspired Hulu The Bear — dip it, dunk it, enjoy it.",address:"666 N Orleans St, Chicago, IL 60654",lat:41.8933,lng:-87.6363,instagram:"@mrbeefchicago",website:"https://theoriginalmrbeef.com"});
add({name:"Portillo's",cuisine:"Chicago Fast Casual",neighborhood:"River North",score:82,price:1,tags:["Casual","Local Favorites","Family Friendly"],indicators:["iconic"],description:"Chicago beloved fast-casual with juicy Italian beef, char-dogs, and cheese fries.",address:"100 W Ontario St, Chicago, IL 60654",lat:41.8932,lng:-87.6291,instagram:"@portilloshotdogs",website:"https://portillos.com"});
add({name:"Lou Malnati's Pizzeria",cuisine:"Deep Dish Pizza",neighborhood:"River North",score:88,price:2,tags:["Pizza","Local Favorites","Family Friendly"],indicators:["iconic"],description:"The gold standard of Chicago deep dish since 1971 — flaky butter crust and vine-ripened tomatoes.",address:"439 N Wells St, Chicago, IL 60654",lat:41.8906,lng:-87.6340,instagram:"@loumalnatis",website:"https://loumalnatis.com"});
add({name:"Hawksmoor Chicago",cuisine:"British Steakhouse",neighborhood:"River North",score:91,price:4,tags:["Steakhouse","Fine Dining","Date Night","Cocktails"],indicators:["new-opening"],description:"London beloved Hawksmoor in the historic LaSalle Power House with exceptional aged beef.",address:"226 W Kinzie St, Chicago, IL 60654",lat:41.8890,lng:-87.6351,instagram:"@hawksmoorchicago",website:"https://thehawksmoor.com/locations/chicago"});

// Lincoln Park
add({name:"Pequod's Pizza",cuisine:"Deep Dish Pizza",neighborhood:"Lincoln Park",score:90,price:2,tags:["Pizza","Local Favorites","Casual"],indicators:["iconic"],description:"Legendary deep dish with signature caramelized cheese crust baked into the pan since 1970.",address:"2207 N Clybourn Ave, Chicago, IL 60614",lat:41.9218,lng:-87.6645,instagram:"@pequodspizza",website:"https://pequodspizza.com"});

// Bucktown / Wicker Park
add({name:"Le Bouchon",cuisine:"French Bistro",neighborhood:"Bucktown",score:86,price:2,tags:["French","Date Night","Local Favorites","Romantic"],indicators:["hidden-gem"],description:"Charming family-run Lyonnais bistro serving pitch-perfect French comfort food for three decades.",address:"1958 N Damen Ave, Chicago, IL 60647",lat:41.9183,lng:-87.6779,instagram:"@lebouchonbucktown",website:"https://lebouchonchicago.com"});
add({name:"Taxim",cuisine:"Greek",neighborhood:"Wicker Park",score:87,price:3,tags:["Greek","Date Night","Wine Bar","Local Favorites"],description:"Sophisticated regional Greek with an exclusively Greek wine list.",address:"1558 N Milwaukee Ave, Chicago, IL 60622",lat:41.9082,lng:-87.6724,instagram:"@taximchicago",website:"https://taximchicago.com"});
add({name:"Pompette",cuisine:"French / Mediterranean",neighborhood:"Bucktown",score:85,price:3,tags:["French","Date Night","Local Favorites","Critics Pick"],indicators:["hidden-gem"],description:"Michelin Bib Gourmand Bucktown gem blending French with Mediterranean warmth.",address:"2036 N Western Ave, Chicago, IL 60647",lat:41.9195,lng:-87.6873,instagram:"@pompettechicago",website:"https://pompettechicago.com"});

// Logan Square
add({name:"Lost Lake",cuisine:"Tiki Bar / Cocktails",neighborhood:"Logan Square",score:88,price:2,tags:["Cocktails","Bar","Local Favorites","Late Night"],indicators:["hidden-gem"],description:"Beloved neighborhood tiki den with a thoughtful rum-forward cocktail program.",address:"3154 W Diversey Ave, Chicago, IL 60647",lat:41.9322,lng:-87.7062,instagram:"@lostlakechicago",website:"https://lostlakechicago.com"});
add({name:"Billy Sunday",cuisine:"Cocktail Bar",neighborhood:"Logan Square",score:88,price:2,tags:["Cocktails","Bar","Date Night","Local Favorites"],description:"Award-winning craft cocktail bar with a rotating seasonal menu.",address:"3143 W Logan Blvd, Chicago, IL 60647",lat:41.9290,lng:-87.7055,instagram:"@billysundaychi",website:"https://billysundaychicago.com"});
add({name:"Revolution Brewing",cuisine:"Brewery",neighborhood:"Logan Square",score:84,price:2,tags:["Casual","Local Favorites","Patio"],description:"Illinois largest independent brewery with Anti-Hero IPA and extensive seasonal releases.",address:"2323 N Milwaukee Ave, Chicago, IL 60647",lat:41.9252,lng:-87.6983,instagram:"@revbrewing",website:"https://revbrew.com"});

// Pilsen
add({name:"Carnitas Uruapan",cuisine:"Mexican / Carnitas",neighborhood:"Pilsen",score:86,price:1,tags:["Mexican","Casual","Local Favorites"],indicators:["iconic","hole-in-wall"],description:"No-frills Pilsen institution serving Chicago finest slow-cooked carnitas by the pound since the 1970s.",address:"1725 W 18th St, Chicago, IL 60608",lat:41.8578,lng:-87.6694,instagram:"@carnitasuruapan",website:"https://carnitasuruapan.com"});
add({name:"5 Rabanitos",cuisine:"Mexican / Taqueria",neighborhood:"Pilsen",score:84,price:1,tags:["Mexican","Brunch","Casual","Local Favorites"],description:"Colorful Pilsen taqueria with a sprawling menu of authentic Mexican specialties.",address:"1758 W 18th St, Chicago, IL 60608",lat:41.8578,lng:-87.6698,instagram:"@5rabanitos",website:"https://5rabanitos.com"});

// Chinatown
add({name:"MingHin Cuisine",cuisine:"Cantonese / Dim Sum",neighborhood:"Chinatown",score:87,price:2,tags:["Chinese","Brunch","Family Friendly","Local Favorites"],description:"Chicago most celebrated dim sum destination with all-day service and encyclopedic Cantonese menu.",address:"2168 S Archer Ave, Chicago, IL 60616",lat:41.8536,lng:-87.6325,instagram:"@minghincuisine",website:"https://minghincuisine.com"});

// Andersonville
add({name:"Hopleaf Bar",cuisine:"Belgian / Gastropub",neighborhood:"Andersonville",score:89,price:2,tags:["Casual","Cocktails","Local Favorites","Date Night"],indicators:["hidden-gem"],description:"Exceptional craft beer gastropub with 50+ Belgian and American taps and outstanding mussels.",address:"5148 N Clark St, Chicago, IL 60640",lat:41.9763,lng:-87.6693,instagram:"@hopleafbar",website:"https://hopleaf.com"});
add({name:"Half Acre Beer Company",cuisine:"Brewery",neighborhood:"Andersonville",score:85,price:2,tags:["Casual","Patio","Local Favorites"],description:"Chicago beloved independent craft brewery with a full taproom and beer garden.",address:"2050 W Balmoral Ave, Chicago, IL 60625",lat:41.9791,lng:-87.6793,instagram:"@halfacrebeer",website:"https://halfacrebeer.com"});
add({name:"Big Jones",cuisine:"Southern / Lowcountry",neighborhood:"Andersonville",score:85,price:2,tags:["Southern","Brunch","Local Favorites"],description:"Acclaimed Southern and Lowcountry restaurant with heirloom-focused brunch and dinner.",address:"5347 N Clark St, Chicago, IL 60640",lat:41.9793,lng:-87.6695,instagram:"@bigjoneschicago",website:"https://bigjones.com"});

// Gold Coast
add({name:"Gibsons Bar & Steakhouse",cuisine:"American Steakhouse",neighborhood:"Gold Coast",score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],indicators:["iconic"],description:"Gold Coast iconic power-dining steakhouse since 1989 with massive USDA prime cuts and legendary martinis.",address:"1028 N Rush St, Chicago, IL 60611",lat:41.9018,lng:-87.6282,instagram:"@gibsonssteakhouse",website:"https://gibsonssteakhouse.com"});

// Chicago Icons
add({name:"Al's #1 Italian Beef",cuisine:"Italian Beef",neighborhood:"Pilsen",score:86,price:1,tags:["Casual","Local Favorites"],indicators:["iconic"],description:"The original Italian beef stand on Taylor Street since 1938.",address:"1079 W Taylor St, Chicago, IL 60607",lat:41.8693,lng:-87.6576,instagram:"@alsbeef",website:"https://alsbeef.com"});
add({name:"Jim's Original",cuisine:"Maxwell Street Polish",neighborhood:"West Loop",score:84,price:1,tags:["Casual","Late Night","Local Favorites"],indicators:["iconic"],description:"Chicago legendary Maxwell Street stand for Polish sausage and pork chop sandwiches since 1939.",address:"1250 S Union Ave, Chicago, IL 60607",lat:41.8647,lng:-87.6504,instagram:"@jimsoriginalchicago",website:"https://jimsoriginal.com"});
add({name:"Superdawg Drive-In",cuisine:"Chicago Hot Dogs",neighborhood:"Norwood Park",score:88,price:1,tags:["Casual","Family Friendly","Local Favorites"],indicators:["iconic"],description:"Iconic 1948 drive-in with giant hot dog mascots serving classic Chicago-style hot dogs.",address:"6363 N Milwaukee Ave, Chicago, IL 60646",lat:41.9968,lng:-87.7869,instagram:"@superdawgdrivein",website:"https://superdawg.com"});
add({name:"Giordano's",cuisine:"Stuffed Deep Dish Pizza",neighborhood:"River North",score:83,price:2,tags:["Pizza","Family Friendly","Local Favorites"],indicators:["iconic"],description:"Chicago most iconic stuffed deep dish pizza since 1974 with a double-crusted cheese-packed pie.",address:"730 N Rush St, Chicago, IL 60611",lat:41.8965,lng:-87.6268,instagram:"@giordanos",website:"https://giordanos.com"});

// Lakeview
add({name:"Intelligentsia Coffee",cuisine:"Coffee / Specialty",neighborhood:"Lakeview",score:87,price:2,tags:["Bakery/Coffee","Local Favorites"],description:"Intelligentsia flagship Chicago coffeebar — a pioneer of the third-wave coffee movement.",address:"3123 N Broadway St, Chicago, IL 60657",lat:41.9402,lng:-87.6462,instagram:"@intelligentsiacoffee",website:"https://intelligentsia.com"});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAdded:', count, '| Chicago total:', arr.length);
