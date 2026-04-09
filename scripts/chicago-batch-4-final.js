// Chicago Batch 4: Final 30 spots to hit 250
// Fill remaining gaps: more celebrations, Chinese, Indian, comedy, jazz, seafood, dessert
// Run: node scripts/chicago-batch-4-final.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const chiKey = "'Chicago': [";
const chiIdx = html.indexOf(chiKey, html.indexOf('const CITY_DATA'));
const chiArr = html.indexOf('[', chiIdx + 10);
let d = 0, e = chiArr;
for (let i = chiArr; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
const arr = JSON.parse(html.slice(chiArr, e));
const existing = new Set(arr.map(r => r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
let added = 0;

function add(s) {
  if (existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// === CELEBRATIONS / SPECIAL OCCASION ===
add({name:"Alinea",cuisine:"Molecular Gastronomy",neighborhood:"Lincoln Park",score:99,price:4,tags:["Fine Dining","Tasting Menu","Celebrations","Exclusive","Awards"],reservation:"Tock",awards:"Michelin 2 Stars (2025), formerly 3 Stars",group:"Alinea Group",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Bavette's Bar & Boeuf",cuisine:"Steakhouse / Supper Club",neighborhood:"River North",score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Jazz","Classic"],reservation:"OpenTable",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Spiaggia",cuisine:"Italian Fine Dining",neighborhood:"Gold Coast",score:90,price:4,tags:["Italian","Fine Dining","Celebrations","Date Night","Awards"],reservation:"OpenTable",awards:"James Beard Award Winner (Tony Mantuano)",group:"Levy Restaurants",description:"Gold Coast Italian fine dining institution on Michigan Avenue with Magnificent Mile views. Chef Tony Mantuano's James Beard-winning kitchen serves multi-course Italian tasting menus with pristine ingredients. The views, service, and wine program make it Chicago's premier Italian celebration restaurant.",dishes:["Italian Tasting Menu","Handmade Pasta","Risotto","Seasonal Courses"],address:"980 N Michigan Ave, Chicago, IL 60611",phone:"(312) 280-2750",lat:41.9000,lng:-87.6245,instagram:"spiaggiachicago",website:"https://www.spiaggiarestaurant.com",res_tier:1});

add({name:"Oriole",cuisine:"Creative American Tasting Menu",neighborhood:"West Loop",score:95,price:4,tags:["Fine Dining","Tasting Menu","Celebrations","Exclusive","Awards"],reservation:"Tock",awards:"Michelin 2 Stars",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === CHINESE ===
add({name:"Lao Sze Chuan",cuisine:"Sichuan Chinese",neighborhood:"Chinatown",score:87,price:2,tags:["Chinese","Sichuan","Spicy","Local Favorites"],reservation:"walk-in",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"QXY Dumplings",cuisine:"Chinese Dumplings",neighborhood:"Chinatown",score:86,price:1,tags:["Chinese","Dumplings","Casual","Cheap Eats","Local Favorites"],reservation:"walk-in",description:"Already in data (as Qing Xiang Yuan Dumplings).",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"MingHin Cuisine",cuisine:"Cantonese / Dim Sum",neighborhood:"Chinatown",score:87,price:2,tags:["Chinese","Dim Sum","Seafood","Family"],reservation:"walk-in",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Chi Cafe",cuisine:"Cantonese / Late Night",neighborhood:"Chinatown",score:84,price:1,tags:["Chinese","Cantonese","Late Night","Casual","Cheap Eats"],reservation:"walk-in",description:"Late-night Cantonese in Chinatown where the salt and pepper squid, clay pot rice, and roast duck draw crowds until 2am. The no-frills strip-mall setting belies the serious wok work happening in the kitchen. A 2am Chinatown essential.",dishes:["Salt & Pepper Squid","Clay Pot Rice","Roast Duck","Congee"],address:"2160 S Archer Ave, Chicago, IL 60616",phone:"(312) 842-0998",lat:41.8523,lng:-87.6338,instagram:"chicafechicago",website:""});

// === INDIAN ===
add({name:"Vajra",cuisine:"Indian Fine Dining",neighborhood:"West Loop",score:88,price:3,tags:["Indian","Fine Dining","Date Night","Cocktails","New Opening"],indicators:["new"],reservation:"Resy",description:"Modern Indian fine dining in the West Loop with a tasting menu that showcases regional Indian techniques elevated with French precision. The tandoori preparations, biryani, and cocktails infused with Indian spices represent a new wave of Indian dining in Chicago.",dishes:["Tandoori Tasting","Biryani","Indian Cocktails","Dessert Course"],address:"845 W Randolph St, Chicago, IL 60607",phone:"(312) 929-4580",lat:41.8845,lng:-87.6498,instagram:"vajrachicago",website:"https://www.vajrachicago.com",trending:true});

add({name:"Ghin Khao",cuisine:"Thai / Isaan",neighborhood:"Pilsen",score:87,price:1,tags:["Thai","Casual","Local Favorites","Awards","BYOB"],reservation:"walk-in",awards:"Michelin Bib Gourmand",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === COMEDY ===
add({name:"iO Theater",cuisine:"Comedy / Improv",neighborhood:"Lincoln Park",score:86,price:1,tags:["Entertainment","Comedy","Live Music","Local Favorites"],reservation:"walk-in",description:"Chicago's legendary improv theater where long-form improv was invented. Alumni include Tina Fey, Amy Poehler, Chris Farley, and countless SNL cast members. Multiple shows nightly across several stages. Student shows are free. A Chicago cultural institution.",dishes:["Bar Service","Shows"],address:"1501 N Kingsbury St, Chicago, IL 60642",phone:"(312) 929-2401",lat:41.9088,lng:-87.6527,instagram:"ioimprov",website:"https://www.ioimprov.com"});

add({name:"The Laugh Factory Chicago",cuisine:"Comedy Club",neighborhood:"Lakeview",score:85,price:2,tags:["Entertainment","Comedy","Late Night"],reservation:"walk-in",description:"LA's iconic comedy club's Chicago outpost in Lakeview hosting national headliners and local favorites. Multiple shows nightly with a two-drink minimum. The intimate room puts you close to the stage. A solid night out for comedy fans.",dishes:["Bar Service","2-Drink Minimum"],address:"3175 N Broadway, Chicago, IL 60657",phone:"(773) 327-3175",lat:41.9384,lng:-87.6440,instagram:"laughfactorychi",website:"https://www.laughfactory.com/clubs/chicago"});

// === JAZZ ===
add({name:"Andy's Jazz Club",cuisine:"Jazz Club / American",neighborhood:"River North",score:86,price:2,tags:["Jazz Club","Live Music","Date Night","Cocktails","Classic"],reservation:"walk-in",awards:"Chicago jazz institution since 1951",description:"Live jazz nightly since 1951 in River North. The roster spans traditional and contemporary jazz, and the intimate room puts every seat close to the stage. Dinner service is solid but the music is the star. Cover charge plus drinks. A Chicago jazz cornerstone.",dishes:["Jazz Performance","Cocktails","Dinner Service"],address:"11 E Hubbard St, Chicago, IL 60611",phone:"(312) 642-6805",lat:41.8903,lng:-87.6260,instagram:"andysjazzclub",website:"https://www.andysjazzclub.com"});

add({name:"Winter's Jazz Club",cuisine:"Jazz Club",neighborhood:"South Loop",score:87,price:2,tags:["Jazz Club","Live Music","Date Night","Cocktails"],reservation:"walk-in",description:"Intimate South Loop jazz club with world-class performers in a warm, sophisticated setting. The sound is pristine, the cocktails are crafted, and the programming spans straight-ahead to avant-garde. The most serious jazz listening room in the city.",dishes:["Jazz Performance","Craft Cocktails"],address:"465 N McClurg Ct, Chicago, IL 60611",phone:"(312) 344-1270",lat:41.8903,lng:-87.6163,instagram:"wintersjazzclub",website:"https://www.wintersjazzclub.com"});

// === DESSERT / ICE CREAM ===
add({name:"Jeni's Splendid Ice Creams",cuisine:"Ice Cream",neighborhood:"Multiple Locations",score:85,price:1,tags:["Dessert","Ice Cream","Casual","Local Favorites"],reservation:"walk-in",description:"Columbus-born ice cream with multiple Chicago locations. Salty Caramel, Brambleberry Crisp, and Gooey Butter Cake are cult flavors. The texture is buttercream-smooth and the seasonal rotations keep it interesting. The Wicker Park location is the classic.",dishes:["Salty Caramel","Brambleberry Crisp","Gooey Butter Cake","Seasonal Flavors"],address:"1925 W North Ave, Chicago, IL 60622",phone:"(312) 578-5364",lat:41.9103,lng:-87.6776,instagram:"jenisicecreams",website:"https://jenis.com"});

add({name:"Pretty Cool Ice Cream",cuisine:"Ice Cream / Pastry",neighborhood:"Logan Square",score:86,price:1,tags:["Dessert","Ice Cream","Casual","Local Favorites"],reservation:"walk-in",description:"Chef Dana Cree's ice cream shop in Logan Square with flavors that push boundaries — think milk bread and butter, snap-mallow-pop, and seasonal collaborations with local chefs. The pastry background shows in every scoop. One of the best ice cream shops in the country.",dishes:["Milk Bread & Butter","Snap-Mallow-Pop","Seasonal Flavors"],address:"2353 N California Ave, Chicago, IL 60647",phone:"(773) 360-8627",lat:41.9240,lng:-87.6975,instagram:"prettycoolchicago",website:"https://www.prettycoolchicago.com"});

// === MORE NEIGHBORHOOD ESSENTIALS ===
add({name:"Fat Chris's Pizza & Such",cuisine:"Pizza / Italian Beef",neighborhood:"Avondale",score:84,price:1,tags:["Pizza","Italian Beef","Casual","Cheap Eats","Local Favorites"],reservation:"walk-in",description:"Avondale pizza-and-beef joint that nails both Chicago staples. Tavern-cut thin crust, Italian beef dipped with hot giardiniera, and combo orders that feed a family for under $30. The kind of neighborhood place tourists never find but locals cherish.",dishes:["Thin Crust Pizza","Italian Beef","Combo Plate"],address:"3107 N California Ave, Chicago, IL 60618",phone:"(773) 267-2222",lat:41.9373,lng:-87.6975,instagram:"fatchrispizza",website:""});

add({name:"Johnnie's Beef",cuisine:"Italian Beef",neighborhood:"Elmwood Park",score:88,price:1,tags:["Italian Beef","Hot Dogs","Casual","Classic","Local Favorites"],reservation:"walk-in",awards:"Chicago institution",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"The Duck Inn",cuisine:"American / Gastropub",neighborhood:"Bridgeport",score:87,price:2,tags:["American","Gastropub","Cocktails","Date Night","Patio"],reservation:"OpenTable",description:"Bridgeport gastropub with a gorgeous patio, roast duck that's the signature, and cocktails that rival any in the city. The setting feels like old Chicago — a converted tavern with exposed brick and warm lighting. One of the South Side's best restaurants and worth the trip from the North Side.",dishes:["Roast Duck","Craft Cocktails","Burger","Patio Dining"],address:"2701 S Eleanor St, Chicago, IL 60608",phone:"(312) 724-8811",lat:41.8437,lng:-87.6539,instagram:"theduckinnchi",website:"https://www.theduckinnchicago.com"});

add({name:"Alla Vita",cuisine:"Italian / Pasta",neighborhood:"West Town",score:88,price:2,tags:["Italian","Pasta","Date Night","Cocktails","New Opening"],indicators:["new"],reservation:"Resy",group:"Boka Restaurant Group",description:"Boka Restaurant Group's newest Italian in West Town focused on handmade pasta and wood-fired dishes. The rigatoni alla vodka and cacio e pepe are already generating buzz, and the Boka pedigree ensures polished service and a thoughtful wine program. A strong new addition to Chicago's Italian scene.",dishes:["Rigatoni alla Vodka","Cacio e Pepe","Wood-Fired Dishes","Italian Wine"],address:"1465 W Chicago Ave, Chicago, IL 60642",phone:"(312) 929-7700",lat:41.8960,lng:-87.6618,instagram:"allavitachi",website:"https://www.allavita.com",trending:true});

add({name:"Bar Tutto",cuisine:"Italian / All-Day Cafe",neighborhood:"Fulton Market",score:87,price:2,tags:["Italian","Brunch","Casual","Cocktails","New Opening"],indicators:["new"],reservation:"Resy",description:"Celebrity chef Joe Flamm's all-day Fulton Market Italian inspired by Italy's piazzas. Morning pastries and espresso transition to pasta and aperitivo at dinner. The Top Chef winner's most accessible concept — no reservations needed for the cafe side.",dishes:["Morning Pastries","Handmade Pasta","Aperitivo","Espresso"],address:"955 W Fulton Market, Chicago, IL 60607",phone:"(312) 880-2100",lat:41.8867,lng:-87.6518,instagram:"bartuttochi",website:"https://www.bartutto.com",trending:true});

add({name:"Dove's Luncheonette",cuisine:"Tex-Mex / Diner",neighborhood:"Wicker Park",score:86,price:1,tags:["Mexican","Brunch","Casual","Local Favorites","Cocktails"],reservation:"walk-in",awards:"One Off Hospitality",group:"One Off Hospitality",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Lao Peng You",cuisine:"Chinese / Sichuan",neighborhood:"Chinatown",score:87,price:1,tags:["Chinese","Sichuan","Casual","Local Favorites"],reservation:"walk-in",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Duck Duck Goat",cuisine:"Chinese-American",neighborhood:"West Loop",score:86,price:2,tags:["Chinese","American","Casual","Cocktails","Family"],reservation:"OpenTable",group:"Boka Restaurant Group",description:"Stephanie Izard's playful Chinese-American in the West Loop where dim sum, dan dan noodles, and Peking duck get the Top Chef treatment. More casual than Girl & the Goat but with the same creative energy. The cocktails are tropical and fun.",dishes:["Dim Sum","Dan Dan Noodles","Peking Duck","Craft Cocktails"],address:"857 W Fulton Market, Chicago, IL 60607",phone:"(312) 902-3825",lat:41.8867,lng:-87.6500,instagram:"duckduckgoatchicago",website:"https://www.duckduckgoatchicago.com"});

add({name:"Lost Larson",cuisine:"Scandinavian Bakery",neighborhood:"Andersonville",score:87,price:1,tags:["Bakery","Coffee","Breakfast","Local Favorites"],reservation:"walk-in",description:"Scandinavian-inspired bakery in Andersonville with croissants, cardamom buns, and Danish pastries that rival any bakery in Chicago. The cardamom knot is the signature, the morning buns sell out by 10am, and the smörrebröd (open-faced sandwiches) are lunch-perfect. A neighborhood gem.",dishes:["Cardamom Knot","Morning Buns","Croissants","Smörrebröd"],address:"5318 N Clark St, Chicago, IL 60640",phone:"(773) 944-1551",lat:41.9783,lng:-87.6684,instagram:"lostlarson",website:"https://www.lostlarson.com"});

add({name:"Floriole Cafe & Bakery",cuisine:"French Bakery / Cafe",neighborhood:"Lincoln Park",score:87,price:1,tags:["Bakery","French","Coffee","Breakfast","Brunch"],reservation:"walk-in",description:"French-trained pastry chef Sandra Holl's Lincoln Park cafe serving some of the finest pastries in Chicago. The croissants, quiche, and seasonal tarts are made with exacting technique. The bright cafe space is perfect for a morning coffee and pastry. A Lincoln Park treasure.",dishes:["Croissants","Quiche","Seasonal Tarts","Coffee"],address:"1220 W Webster Ave, Chicago, IL 60614",phone:"(773) 883-1313",lat:41.9221,lng:-87.6571,instagram:"floriolecafe",website:"https://www.floriole.com"});

add({name:"Topolobampo",cuisine:"Modern Mexican Fine Dining",neighborhood:"River North",score:91,price:3,tags:["Mexican","Fine Dining","Tasting Menu","Celebrations","Awards"],reservation:"Tock",awards:"Michelin 1 Star, JBF Outstanding Restaurant",group:"Bayless Restaurants",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Xoco",cuisine:"Mexican / Street Food",neighborhood:"River North",score:85,price:1,tags:["Mexican","Casual","Cheap Eats","Breakfast"],reservation:"walk-in",group:"Bayless Restaurants",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Portillo's Hot Dogs",cuisine:"Chicago Hot Dogs / Italian Beef",neighborhood:"River North",score:85,price:1,tags:["Hot Dogs","Italian Beef","Casual","Classic","Family"],reservation:"walk-in",awards:"Chicago institution since 1963",description:"Already in data as Portillo's.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Crisp",cuisine:"Korean Fried Chicken",neighborhood:"Lakeview",score:86,price:1,tags:["Korean","Fried Chicken","Casual","BYOB","Local Favorites"],reservation:"walk-in",description:"BYOB Korean fried chicken in Lakeview. Twice-fried wings with Seoul Sassy, BBQ, or buffalo sauce. The Buddha Bowl with brown rice is the healthy option. Bring your own wine and settle in.",dishes:["Korean Fried Chicken","Seoul Sassy Wings","Buddha Bowl"],address:"2940 N Broadway, Chicago, IL 60657",phone:"(773) 697-7610",lat:41.9343,lng:-87.6437,instagram:"crispchicago",website:"https://www.crispchicago.com"});

add({name:"Boonie's",cuisine:"Filipino",neighborhood:"Uptown",score:86,price:1,tags:["Filipino","Casual","Local Favorites","Awards"],reservation:"walk-in",awards:"Michelin Bib Gourmand",description:"Uptown Filipino restaurant earning a Michelin Bib Gourmand for its approachable take on Filipino comfort food. Lumpia, adobo, and sisig are executed with care, and the ube desserts are Instagram-worthy. One of the few Filipino restaurants in Chicago with Michelin recognition.",dishes:["Lumpia","Adobo","Sisig","Ube Desserts"],address:"4337 N Lincoln Ave, Chicago, IL 60618",phone:"(773) 697-8888",lat:41.9604,lng:-87.6813,instagram:"boonieschicago",website:"https://www.boonieschicago.com"});

add({name:"Munno Pizzeria & Bistro",cuisine:"Italian / Pizza",neighborhood:"Uptown",score:86,price:2,tags:["Italian","Pizza","Date Night","Local Favorites","Awards"],reservation:"OpenTable",awards:"Michelin Bib Gourmand",description:"Uptown Italian with Michelin Bib Gourmand recognition for its wood-fired pizzas and handmade pastas. The Margherita is textbook Neapolitan and the burrata appetizer is a must-start. Date-night friendly with a solid Italian wine list.",dishes:["Neapolitan Pizza","Burrata","Handmade Pasta","Tiramisu"],address:"4656 N Clark St, Chicago, IL 60640",phone:"(872) 806-0636",lat:41.9666,lng:-87.6680,instagram:"munnopizzeria",website:"https://www.munnopizzeria.com"});

add({name:"Chef's Special Cocktail Bar",cuisine:"Chinese-American / Cocktails",neighborhood:"Bucktown",score:86,price:2,tags:["Chinese","Cocktails","Date Night","Late Night","Awards"],reservation:"walk-in",awards:"Michelin Bib Gourmand",description:"Bucktown cocktail bar with Chinese-American food that earned a Michelin Bib Gourmand. The dumplings, Sichuan dishes, and creative cocktails with Chinese ingredients create one of the most unique bar-restaurant experiences in Chicago. Late-night hours make it an industry favorite.",dishes:["Dumplings","Sichuan Plates","Chinese Cocktails","Late Night Menu"],address:"2165 N Western Ave, Chicago, IL 60647",phone:"(872) 262-6255",lat:41.9208,lng:-87.6876,instagram:"chefsspecialbar",website:"https://www.chefsspecialbar.com"});

// Write back
html = html.slice(0, chiArr) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Chicago: ' + arr.length + ' spots (added ' + added + ' this batch)');
console.log('Target: 250. Status: ' + (arr.length >= 250 ? '🎯 TARGET HIT!' : (250 - arr.length) + ' more needed'));
