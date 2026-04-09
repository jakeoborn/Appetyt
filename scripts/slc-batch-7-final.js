// SLC Batch 7: ABSOLUTE FINAL push to 250
// Run: node scripts/slc-batch-7-final.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const SLC_DATA=');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id||0))+1, added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase()))return;
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
}

// === ETHIOPIAN ===
add({name:"Mahider Ethiopian Restaurant",cuisine:"Ethiopian",neighborhood:"Downtown SLC",score:85,price:1,tags:["Ethiopian","African","Vegetarian","Casual"],description:"Downtown Ethiopian serving traditional dishes on injera. The veggie combo is vegan-friendly and the doro wat is rich. Communal eating with hands. One of SLC's few Ethiopian options.",dishes:["Doro Wat","Veggie Combo","Injera","Tibs"],address:"1465 S State St, Salt Lake City, UT 84115",phone:"(801) 975-1888",lat:40.7400,lng:-111.8880,instagram:"mahiderethiopian",website:"https://www.mahider.com"});

// === VEGAN / PLANT-BASED ===
add({name:"Monkeywrench",cuisine:"Vegan Ice Cream",neighborhood:"Downtown SLC",score:85,price:1,tags:["Vegan","Dessert","Ice Cream","Local Favorites"],description:"Downtown vegan ice cream shop with housemade flavors that are completely plant-based. Creative seasonal flavors rival any dairy ice cream in the city. A SLC original.",dishes:["Vegan Ice Cream","Seasonal Flavors","Sundaes"],address:"61 E 400 S, Salt Lake City, UT 84111",phone:"(801) 831-0777",lat:40.7610,lng:-111.8870,instagram:"monkeywrenchslc",website:"https://www.monkeywrenchicecream.com"});

add({name:"Lil Lotus",cuisine:"Vegan French Patisserie",neighborhood:"Sugar House",score:85,price:1,tags:["Vegan","Bakery","French","Dessert","Local Favorites"],description:"Classic French patisserie where everything is completely vegan. Croissants, tarts, and cakes that challenge your assumptions about plant-based baking. Sugar House's sweetest secret.",dishes:["Vegan Croissants","Tarts","Cakes","French Pastries"],address:"2120 S 700 E, Salt Lake City, UT 84106",phone:"(385) 335-0003",lat:40.7240,lng:-111.8700,instagram:"lillotusut",website:"https://www.lillotus.com"});

add({name:"Boltcutter Bar",cuisine:"Cocktails / Small Plates",neighborhood:"Granary District",score:86,price:2,tags:["Cocktails","Bar","Date Night","New Opening"],indicators:["new"],description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === STEAKHOUSE ===
add({name:"Ruth's Chris Steak House",cuisine:"Steakhouse",neighborhood:"Downtown SLC",score:87,price:4,tags:["Steakhouse","Fine Dining","Celebrations","Date Night"],reservation:"OpenTable",description:"National chain steakhouse in downtown SLC with sizzling butter-topped steaks. The USDA Prime filet and bone-in ribeye are classics. A reliable celebration steakhouse.",dishes:["Filet Mignon","Bone-In Ribeye","Lobster","Creamed Spinach"],address:"275 S West Temple, Salt Lake City, UT 84101",phone:"(801) 355-2600",lat:40.7640,lng:-111.8960,instagram:"ruthschrislsteak",website:"https://www.ruthschris.com"});

add({name:"Spencer's for Steaks & Chops",cuisine:"Steakhouse",neighborhood:"Downtown SLC",score:86,price:4,tags:["Steakhouse","Fine Dining","Celebrations","Classic","Hotel"],reservation:"OpenTable",description:"Hilton hotel steakhouse downtown with prime steaks, chops, and an old-school chophouse atmosphere. A SLC celebration staple for decades.",dishes:["Prime Steaks","Lamb Chops","Seafood","Classic Cocktails"],address:"255 S West Temple, Salt Lake City, UT 84101",phone:"(801) 238-4748",lat:40.7640,lng:-111.8960,instagram:"spencersslc",website:"https://www.spencersforsteaks.com"});

// === SUSHI ===
add({name:"Sapa Sushi Bar & Grill",cuisine:"Japanese / Sushi",neighborhood:"Downtown SLC",score:86,price:2,tags:["Japanese","Sushi","Date Night","Cocktails"],reservation:"OpenTable",description:"Already in batch 1.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Sushi by Bou SLC",cuisine:"Japanese Omakase",neighborhood:"Downtown SLC",score:87,price:3,tags:["Japanese","Omakase","Fine Dining","Date Night","New Opening"],indicators:["new"],reservation:"Resy",description:"NYC-based omakase concept opening its SLC outpost in 2026. Chef-guided tasting menus in a intimate counter setting. A new fine dining sushi option for the city.",dishes:["Omakase Course","Seasonal Nigiri","Sake"],address:"Downtown SLC",phone:"",lat:40.7660,lng:-111.8918,instagram:"sushibybou",website:"https://www.sushibybou.com",trending:true});

// === MORE PARK CITY ===
add({name:"Loma",cuisine:"Italian",neighborhood:"Main Street (Park City)",score:87,price:3,tags:["Italian","Fine Dining","Date Night"],reservation:"OpenTable",description:"Upscale Italian on lower Main Street from the Twisted Fern team. Authentic Italian cooking techniques with seasonal menus. Handmade pasta, grilled meats, and Italian wines in an elegant setting.",dishes:["Handmade Pasta","Grilled Meats","Italian Wine"],address:"341 Main St, Park City, UT 84060",phone:"(435) 200-9113",lat:40.6461,lng:-111.4980,instagram:"lomaparkcity",website:"https://www.lomaparkcity.com",suburb:true});

add({name:"The Eating Establishment",cuisine:"American / Breakfast",neighborhood:"Main Street (Park City)",score:84,price:1,tags:["Breakfast","Brunch","Classic","Family"],description:"Already in batch 2.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Chimayo",cuisine:"Southwestern / Mexican",neighborhood:"Park City",score:86,price:2,tags:["Southwestern","Mexican","Cocktails","Date Night"],reservation:"OpenTable",description:"Park City Southwestern restaurant with creative New Mexican cuisine, tequila-focused cocktails, and a vibrant atmosphere. The green chile dishes and margaritas are standouts.",dishes:["Green Chile","Enchiladas","Margaritas","Southwestern Plates"],address:"368 Main St, Park City, UT 84060",phone:"(435) 649-6222",lat:40.6461,lng:-111.4980,instagram:"chimayopc",website:"https://www.chimayorestaurant.com",suburb:true});

add({name:"No Name Saloon & Grill",cuisine:"Bar / Burgers",neighborhood:"Main Street (Park City)",score:84,price:1,tags:["Bar","Burgers","Casual","Après-Ski","Local Favorites"],description:"Park City Main Street institution — dive bar meets après-ski with buffalo burgers, cheap beer, and a no-frills attitude. The roof deck has mountain views. A Park City rite of passage.",dishes:["Buffalo Burger","Cheap Beer","Roof Deck"],address:"447 Main St, Park City, UT 84060",phone:"(435) 649-6667",lat:40.6461,lng:-111.4980,instagram:"nonamesaloon",website:"https://www.nonamesaloon.net",suburb:true});

add({name:"Sammy's Bistro",cuisine:"American / Bistro",neighborhood:"Park City",score:85,price:2,tags:["American","Casual","Brunch","Family"],description:"Park City neighborhood bistro with creative American fare and a popular brunch. Located off Main Street in a quieter area. Local favorite that's less touristy than the main drag.",dishes:["Brunch","Bistro Plates","Cocktails"],address:"1500 Ute Blvd, Suite 214, Park City, UT 84098",phone:"(435) 649-2469",lat:40.6580,lng:-111.5050,instagram:"sammysbistro",website:"https://www.sammysbistro.com",suburb:true});

// === MORE SLC NEIGHBORHOODS ===
add({name:"Kyoto Japanese Restaurant",cuisine:"Japanese / Traditional",neighborhood:"Downtown SLC",score:85,price:2,tags:["Japanese","Sushi","Classic","Local Favorites"],description:"Three-decade Japanese restaurant downtown serving classic staples — sushi, tempura, and udon. Reliable, traditional, and a quiet alternative to trendier spots.",dishes:["Sushi","Tempura","Udon","Teriyaki"],address:"1080 E 1300 S, Salt Lake City, UT 84105",phone:"(801) 487-3525",lat:40.7430,lng:-111.8630,instagram:"kyotorestaurantslc",website:"https://www.kyotoslc.com"});

add({name:"Scion Cider Bar (Avenues)",cuisine:"Cider Bar",neighborhood:"The Avenues",score:86,price:2,tags:["Cider","Wine Bar","Local Favorites","Awards"],description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"East Liberty Tap House",cuisine:"Gastropub / Craft Beer",neighborhood:"Liberty Park",score:84,price:1,tags:["Gastropub","Craft Beer","Casual","Patio"],description:"Liberty Park gastropub with 30+ craft taps and a covered patio overlooking the neighborhood. Solid pub food and a relaxed energy. A neighborhood anchor.",dishes:["Craft Beer","Pub Food","Patio"],address:"850 E 900 S, Salt Lake City, UT 84105",phone:"(801) 441-2845",lat:40.7530,lng:-111.8680,instagram:"eastlibertytaphouse",website:"https://www.eastlibertytaphouse.com"});

add({name:"Cucina Toscana",cuisine:"Italian / Tuscan",neighborhood:"Downtown SLC",score:87,price:3,tags:["Italian","Fine Dining","Date Night","Celebrations","Wine Bar"],reservation:"OpenTable",description:"Downtown Tuscan Italian with handmade pastas, osso buco, and an extensive Italian wine list. White tablecloth elegance in a historic downtown space. One of SLC's most polished Italian restaurants.",dishes:["Osso Buco","Handmade Pasta","Tuscan Wines","Tiramisu"],address:"282 S 300 W, Salt Lake City, UT 84101",phone:"(801) 328-3463",lat:40.7640,lng:-111.9000,instagram:"cucinatoscanaslc",website:"https://www.tfrg.net"});

add({name:"Takashi SLC",cuisine:"Japanese / Sushi",neighborhood:"Downtown SLC",score:96,price:3,tags:["Japanese","Sushi","Date Night","Critics Pick","Awards"],reservation:"walk-in",awards:"James Beard Semifinalist",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Garage on Beck",cuisine:"Cocktail Bar / Music",neighborhood:"North SLC",score:84,price:1,tags:["Bar","Live Music","Cocktails","Late Night"],description:"North SLC bar and live music venue in a converted garage. Craft cocktails, local bands, and a gritty, creative atmosphere. Part of SLC's growing live music scene beyond downtown.",dishes:["Craft Cocktails","Live Music","Late Night"],address:"1199 Beck St, Salt Lake City, UT 84103",phone:"(801) 521-3904",lat:40.7870,lng:-111.9000,instagram:"garageonbeck",website:"https://www.garageonbeck.com"});

add({name:"The Bayou",cuisine:"Cajun / Craft Beer",neighborhood:"Downtown SLC",score:85,price:2,tags:["Cajun","Craft Beer","Bar","Late Night","Local Favorites"],description:"Downtown Cajun restaurant and craft beer bar with 200+ beers and Louisiana-inspired dishes. Gumbo, po-boys, and jambalaya in a lively downtown setting. The deepest beer list in Utah.",dishes:["Gumbo","Po-Boys","Jambalaya","200+ Beers"],address:"645 S State St, Salt Lake City, UT 84111",phone:"(801) 961-8400",lat:40.7570,lng:-111.8880,instagram:"thebayouslc",website:"https://www.utahbayou.com"});

add({name:"Red Iguana 2",cuisine:"Mexican / Mole",neighborhood:"Westside SLC",score:89,price:1,tags:["Mexican","Mole","Local Favorites","Family"],description:"Second location of SLC's legendary Red Iguana, across the street from the original. Same legendary mole sauces, same Mata family recipes, shorter wait times. Seven house-made moles are the reason to go.",dishes:["Seven Moles","Tamales","Enchiladas","Chile Verde"],address:"866 W South Temple, Salt Lake City, UT 84104",phone:"(801) 214-6677",lat:40.7710,lng:-111.9100,instagram:"rediguana",website:"https://www.rediguana.com"});

add({name:"Sweet Lake Biscuits & Limeade",cuisine:"Biscuit Shop / Cafe",neighborhood:"Sugar House",score:84,price:1,tags:["Breakfast","Bakery","Casual","Local Favorites"],description:"Sugar House biscuit shop with handmade biscuit sandwiches and the signature housemade limeade. Southern biscuit tradition meets Utah energy. Weekend brunch draws lines.",dishes:["Biscuit Sandwiches","Limeade","Breakfast"],address:"1749 S 300 E, Salt Lake City, UT 84115",phone:"(801) 953-1978",lat:40.7400,lng:-111.8830,instagram:"sweetlakeslc",website:"https://www.sweetlake.com"});

add({name:"Stanza Italian Bistro",cuisine:"Italian",neighborhood:"Downtown SLC",score:85,price:2,tags:["Italian","Casual","Date Night"],description:"Downtown Italian bistro with handmade pastas and wood-fired pizzas in a comfortable, neighborhood-feel setting. A reliable Italian option near the theater district.",dishes:["Handmade Pasta","Wood-Fired Pizza","Italian Wine"],address:"454 E 300 S, Salt Lake City, UT 84111",phone:"(801) 746-4441",lat:40.7640,lng:-111.8800,instagram:"stanzaslc",website:"https://www.stanzaslc.com"});

add({name:"Bruges Waffles & Frites",cuisine:"Belgian / Waffles",neighborhood:"Downtown SLC",score:84,price:1,tags:["Belgian","Dessert","Casual","Local Favorites"],description:"Downtown Belgian waffle and frite shop with Liège waffles (pearl sugar, caramelized edges) and hand-cut twice-fried frites with creative sauces. A SLC original that's expanded to multiple locations.",dishes:["Liège Waffles","Belgian Frites","Dipping Sauces"],address:"336 W Broadway, Salt Lake City, UT 84101",phone:"(801) 363-4444",lat:40.7625,lng:-111.9000,instagram:"brugeswaffles",website:"https://www.brugeswaffles.com"});

add({name:"From Scratch",cuisine:"Italian / Fresh Pasta",neighborhood:"Downtown SLC",score:85,price:2,tags:["Italian","Pasta","Casual","Local Favorites"],description:"Downtown Italian focused on fresh-made pasta daily. The name says it all — everything is made from scratch. A pasta-lover's paradise at accessible prices.",dishes:["Fresh Pasta","Seasonal Sauces","Italian Wine"],address:"62 E Gallivan Ave, Salt Lake City, UT 84111",phone:"(801) 961-9000",lat:40.7640,lng:-111.8870,instagram:"fromscratchslc",website:"https://www.fromscratchslc.com"});

add({name:"Laziz Kitchen",cuisine:"Middle Eastern / Mediterranean",neighborhood:"Downtown SLC",score:86,price:1,tags:["Middle Eastern","Mediterranean","Casual","Local Favorites"],description:"Downtown Middle Eastern and Mediterranean with hummus, shawarma, and falafel. The za'atar fries and lamb dishes stand out. Affordable and flavorful.",dishes:["Shawarma","Hummus","Falafel","Za'atar Fries"],address:"912 S Jefferson St, Salt Lake City, UT 84101",phone:"(801) 441-3273",lat:40.7530,lng:-111.8930,instagram:"lazizkitchen",website:"https://www.lazizkitchen.com"});

add({name:"Mi Casa Tamales",cuisine:"Mexican / Tamales",neighborhood:"South Salt Lake",score:84,price:1,tags:["Mexican","Casual","Cheap Eats","Local Favorites"],description:"South Salt Lake tamale specialist with handmade tamales in a dozen varieties. Green chile chicken, red pork, and seasonal specials. Order by the dozen for takeout.",dishes:["Green Chile Chicken Tamale","Red Pork","Seasonal Tamales"],address:"2190 S State St, South Salt Lake, UT 84115",phone:"(801) 486-0220",lat:40.7220,lng:-111.8880,instagram:"micasatamales",website:"",suburb:true});

add({name:"Copper Common Bar",cuisine:"Cocktails / Gastropub",neighborhood:"Downtown SLC",score:88,price:2,tags:["Cocktails","Gastropub","Date Night","Awards"],reservation:"Resy",group:"C.O. Hospitality",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// === TOURIST ATTRACTIONS (fill gaps) ===
add({name:"Clark Planetarium",cuisine:"Museum",neighborhood:"Gateway",score:85,price:0,tags:["Museum","Tourist Attraction","Family","Free"],description:"Free-admission planetarium at The Gateway with space exhibits, IMAX theater, and a Hansen Dome Theatre. The exhibits are interactive and the IMAX shows are spectacular. Free general admission — only the theaters charge.",dishes:["Free Exhibits","IMAX","Dome Theatre","Space Exhibits"],address:"110 S 400 W, Salt Lake City, UT 84101",phone:"(385) 468-7827",lat:40.7670,lng:-111.9010,instagram:"clarkplanetarium",website:"https://www.clarkplanetarium.org"});

add({name:"Tracy Aviary & Botanical Garden",cuisine:"Tourist Attraction",neighborhood:"Liberty Park",score:84,price:1,tags:["Tourist Attraction","Outdoor","Family","Park"],description:"Aviary and botanical garden in Liberty Park with 400+ birds and beautiful gardens. The bird shows are educational and entertaining. Walking distance from downtown in one of SLC's most beloved parks.",dishes:["Bird Exhibits","Gardens","Bird Shows"],address:"589 E 1300 S, Salt Lake City, UT 84105",phone:"(801) 596-8500",lat:40.7430,lng:-111.8670,instagram:"tracyaviary",website:"https://www.tracyaviary.org"});

add({name:"Utah Museum of Fine Arts",cuisine:"Art Museum",neighborhood:"University of Utah",score:86,price:1,tags:["Museum","Art","Tourist Attraction"],description:"University of Utah campus museum with global art collections spanning 5,000 years. The building itself is architecturally striking. Free days for Utah residents. A cultural anchor on campus.",dishes:["Art Exhibitions","Free Utah Resident Days"],address:"410 Campus Center Dr, Salt Lake City, UT 84112",phone:"(801) 581-7332",lat:40.7620,lng:-111.8380,instagram:"umfaslc",website:"https://umfa.utah.edu"});

add({name:"Hogle Zoo",cuisine:"Tourist Attraction",neighborhood:"Emigration Canyon",score:85,price:2,tags:["Tourist Attraction","Family","Outdoor","Zoo"],description:"Salt Lake's 42-acre zoo at the mouth of Emigration Canyon with 800+ animals. The elephant encounter, great apes building, and the Lights Before Christmas holiday event are highlights. Family-friendly year-round.",dishes:["Zoo Exhibits","Elephant Encounter","Holiday Lights"],address:"2600 Sunnyside Ave, Salt Lake City, UT 84108",phone:"(801) 584-1700",lat:40.7520,lng:-111.8140,instagram:"hoglezoo",website:"https://www.hoglezoo.org"});

add({name:"Snowbird Ski & Summer Resort",cuisine:"Tourist Attraction",neighborhood:"Little Cottonwood Canyon",score:90,price:3,tags:["Tourist Attraction","Outdoor","Skiing","Scenic"],suburb:true,description:"World-class ski resort in Little Cottonwood Canyon, 25 minutes from downtown SLC. The Tram takes you to 11,000 feet for legendary powder skiing in winter and hiking/mountain biking in summer. Over 500 inches of annual snowfall.",dishes:["Skiing","Snowboarding","Tram Ride","Summer Hiking"],address:"9385 Snowbird Center Dr, Snowbird, UT 84092",phone:"(801) 933-2222",lat:40.5830,lng:-111.6560,instagram:"snowaborbird",website:"https://www.snowbird.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('SLC: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
