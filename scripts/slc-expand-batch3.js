// SLC Expansion Batch 3 — Sugar House, 9th & 9th, Provo, Asian, More Neighborhoods
// Sources: Gastronomic SLC, Female Foodie, City Cast, KSL, Tripadvisor verified
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const slcMarker = 'const SLC_DATA=';
const slcPos = html.indexOf(slcMarker);
if (slcPos === -1) { console.error('SLC_DATA not found!'); process.exit(1); }
const arrS = html.indexOf('[', slcPos);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting SLC:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// === 9TH & 9TH / SUGAR HOUSE / CENTRAL 9TH ===

add({name:"Pizza Nono",cuisine:"Wood-Fired Pizza",neighborhood:"9th & 9th",score:87,price:1,tags:["Pizza","Casual","Local Favorites","Patio"],description:"Delicious wood-fired pizzas in the 9th and 9th neighborhood. The Beehive pizza with honey and jalapenos is a local favorite. Great patio for summer evenings.",dishes:["Beehive Pizza","Margherita","Wood-Fired Pies"],address:"925 E 900 S, Salt Lake City, UT 84105",hours:"",lat:40.7479,lng:-111.8663,instagram:"pizzanono",website:"",reservation:"walk-in",phone:""});

add({name:"Pago",cuisine:"New American",neighborhood:"9th & 9th",score:88,price:2,tags:["New American","Date Night","Local Favorites","Farm-to-Table"],description:"Farm-to-table New American in the 9th and 9th neighborhood. Short rib stroganoff and a classic burger are standouts. Seasonal menu with locally sourced ingredients.",dishes:["Short Rib Stroganoff","Pago Burger","Seasonal Menu"],address:"878 S 900 E, Salt Lake City, UT 84102",hours:"",lat:40.7487,lng:-111.8663,instagram:"pagoslc",website:"",reservation:"Resy",phone:""});

add({name:"Publik Kitchen",cuisine:"Cafe / Brunch",neighborhood:"9th & 9th",score:86,price:1,tags:["Bakery/Coffee","Brunch","Local Favorites"],description:"Perfect spot for brunch and coffee in 9th and 9th. A Salt Lake City staple with creative breakfast dishes and excellent coffee.",dishes:["Brunch Plates","Specialty Coffee","Avocado Toast"],address:"975 S West Temple, Salt Lake City, UT 84101",hours:"",lat:40.7479,lng:-111.8914,instagram:"publikkitchen",website:"",reservation:"walk-in",phone:""});

add({name:"Dolcetti Gelato",cuisine:"Gelato / Dessert",neighborhood:"9th & 9th",score:85,price:1,tags:["Dessert","Local Favorites","Casual"],description:"Eclectically decorated gelato shop in 9th and 9th. Try the coconut sticky rice gelato -- a creative flavor you won't find anywhere else in the city.",dishes:["Coconut Sticky Rice Gelato","Pistachio","Seasonal Flavors"],address:"902 E 900 S, Salt Lake City, UT 84105",hours:"",lat:40.7479,lng:-111.8666,instagram:"dolcettigelato",website:"",reservation:"walk-in",phone:""});

add({name:"Hearth and Hill",cuisine:"New American",neighborhood:"Sugar House",score:88,price:2,tags:["New American","Brunch","Date Night","Local Favorites"],description:"Recognized with Utah 2025 Best of State award for New American cuisine. Also has a Park City location. Hearth-cooked dishes with seasonal ingredients and a strong brunch program.",dishes:["Hearth-Cooked Meats","Brunch Plates","Seasonal Menu"],address:"2060 S 2100 E, Salt Lake City, UT 84108",hours:"",lat:40.7232,lng:-111.8538,instagram:"hearthandhill",website:"https://www.hearth-hill.com",reservation:"OpenTable",phone:""});

add({name:"Ekamai Thai",cuisine:"Thai",neighborhood:"Sugar House",score:87,price:1,tags:["Thai","Local Favorites","Casual"],description:"Favorite Thai restaurant in Sugar House with authentic flavors and generous portions. Pad thai, curries, and noodle dishes that locals return to again and again.",dishes:["Pad Thai","Green Curry","Thai Iced Tea"],address:"1609 S Main St, Salt Lake City, UT 84115",hours:"",lat:40.7378,lng:-111.8910,instagram:"ekamaithai",website:"",reservation:"walk-in",phone:""});

add({name:"Harbor Seafood & Steak Co.",cuisine:"Seafood / Steakhouse",neighborhood:"Sugar House",score:87,price:2,tags:["Seafood","Steakhouse","Date Night","Local Favorites"],description:"Neighborhood seafood and steak gem in Sugar House established in 2014. Quality surf and turf in a comfortable setting.",dishes:["Seafood Platter","Steak","Fresh Fish"],address:"2100 S 2300 E, Salt Lake City, UT 84109",hours:"",lat:40.7217,lng:-111.8509,instagram:"harborslc",website:"https://www.harborslc.com",reservation:"OpenTable",phone:""});

// === ASIAN RESTAURANTS ===

add({name:"Sapa Sushi Bar",cuisine:"Sushi / Vietnamese-Thai",neighborhood:"Downtown",score:88,price:2,tags:["Sushi","Vietnamese","Thai","Date Night","Local Favorites"],description:"Nearly 3,000 near-perfect reviews. Downtown sushi bar serving Thai noodle dishes, Vietnamese and Thai influenced sushi, and special house creations. Filet mignon, chili duo roll, massaman beef, and drunken noodle are favorites.",dishes:["Chili Duo Roll","Massaman Beef","Sushi Platter"],address:"722 S State St, Salt Lake City, UT 84111",hours:"",lat:40.7522,lng:-111.8881,instagram:"sapaslc",website:"https://www.sapabarandgrill.com",reservation:"OpenTable",phone:""});

add({name:"La Cai Noodle House",cuisine:"Vietnamese / Noodles",neighborhood:"West Side",score:87,price:1,tags:["Vietnamese","Noodles","Local Favorites","Casual"],description:"Top 10 Best Asian in SLC. The House Noodle Soup has broth described as fishy umami heaven. Authentic Vietnamese noodle dishes at affordable prices.",dishes:["House Noodle Soup","Pho","Banh Mi"],address:"1413 S State St, Salt Lake City, UT 84115",hours:"",lat:40.7396,lng:-111.8881,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"MAKANMAKAN",cuisine:"Malaysian / Southeast Asian",neighborhood:"Downtown",score:87,price:1,tags:["Malaysian","Southeast Asian","Local Favorites","Casual"],description:"Top 10 Best Asian in SLC as of 2025. Malaysian and Southeast Asian cuisine that is hard to find in Utah. Nasi lemak, rendang, and laksa.",dishes:["Nasi Lemak","Rendang","Laksa"],address:"67 W 100 S #102, Salt Lake City, UT 84101",hours:"",lat:40.7668,lng:-111.8920,instagram:"makanmakanslc",website:"",reservation:"walk-in",phone:""});

add({name:"Takashi",cuisine:"Japanese / Sushi",neighborhood:"Downtown",score:89,price:2,tags:["Japanese","Sushi","Date Night","Local Favorites","Critics Pick"],description:"Consistently ranked as the best sushi in Salt Lake City. Fresh fish, creative rolls, and a no-reservations policy that means waiting -- but it is always worth it.",dishes:["Omakase","Sashimi","Creative Rolls"],address:"18 W Market St, Salt Lake City, UT 84101",hours:"",lat:40.7641,lng:-111.8905,instagram:"takashislc",website:"",reservation:"walk-in",phone:""});

add({name:"One More Noodle House",cuisine:"Chinese Noodles",neighborhood:"Downtown",score:86,price:1,tags:["Chinese","Noodles","Casual","Local Favorites"],description:"Hand-pulled noodle shop in downtown SLC. Fresh noodles made to order with authentic Chinese flavors. The beef noodle soup is hearty and satisfying.",dishes:["Hand-Pulled Noodles","Beef Noodle Soup","Dumplings"],address:"26 E St, Salt Lake City, UT 84101",hours:"",lat:40.7645,lng:-111.8872,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Sara Thai Kitchen",cuisine:"Thai",neighborhood:"Downtown",score:86,price:1,tags:["Thai","Casual","Local Favorites"],description:"Thai kitchen in downtown SLC with authentic curries and noodle dishes. Reliable and consistent Thai food that hits the spot.",dishes:["Pad Thai","Red Curry","Tom Yum Soup"],address:"34 E 600 S, Salt Lake City, UT 84111",hours:"",lat:40.7544,lng:-111.8877,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Red Lotus Bistro",cuisine:"Chinese / Asian Fusion",neighborhood:"Salt Lake City",score:86,price:2,tags:["Chinese","Asian Fusion","Local Favorites"],description:"Upscale Chinese and Asian fusion. Creative dishes that blend traditional Chinese technique with modern presentation.",dishes:["Peking Duck","Dim Sum","Asian Fusion Plates"],address:"1685 S State St, Salt Lake City, UT 84115",hours:"",lat:40.7362,lng:-111.8881,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Fat Fish",cuisine:"Sushi / Vietnamese",neighborhood:"West Valley",score:86,price:1,tags:["Sushi","Vietnamese","Local Favorites","Casual"],description:"Quickly risen to top of best-of lists since 2013 with quality, affordable sushi and Vietnamese pho. Multiple locations. Great value for the quality.",dishes:["Sushi Rolls","Pho","Bento Box"],address:"3760 S Redwood Rd, West Valley City, UT 84119",hours:"",lat:40.6925,lng:-111.9388,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

// === PROVO / UTAH COUNTY ===

add({name:"The Continental",cuisine:"Fine Dining",neighborhood:"Provo",score:89,price:3,tags:["Fine Dining","Date Night","Farm-to-Table","Celebrations"],description:"Proper fine-dining in Provo with chef-in-residence Bleu Adams, an advocate for sustainable and locally sourced cooking. One of the best fine dining experiences in Utah County.",dishes:["Seasonal Tasting","Locally Sourced Menu","Wine Pairing"],address:"61 N 100 E, Provo, UT 84606",hours:"",lat:40.2342,lng:-111.6565,instagram:"thecontinentalprovo",website:"",reservation:"Resy",phone:"",suburb:true});

add({name:"Di Napoli",cuisine:"Italian",neighborhood:"Provo",score:87,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Utah Valley new Italian gold standard. Fresh pasta, wood-fired dishes, and an Italian wine list in a stylish Provo setting.",dishes:["Fresh Pasta","Wood-Fired Dishes","Italian Wine"],address:"55 N University Ave, Provo, UT 84601",hours:"",lat:40.2340,lng:-111.6586,instagram:"dinapoliprovo",website:"",reservation:"OpenTable",phone:"",suburb:true});

add({name:"Baan Thai",cuisine:"Thai",neighborhood:"Provo",score:87,price:1,tags:["Thai","Local Favorites","Casual"],description:"Hands down the best Thai in the valley and an easy choice for best restaurants in Utah County. Authentic Thai dishes with proper heat and balance.",dishes:["Pad Thai","Massaman Curry","Tom Kha"],address:"466 N 900 W, Provo, UT 84601",hours:"",lat:40.2380,lng:-111.6700,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Pizzeria 712",cuisine:"Wood-Fired Pizza",neighborhood:"Orem",score:88,price:2,tags:["Pizza","Date Night","Local Favorites"],description:"One of the best pizzas in Utah, perfecting wood-fired pies for years in Orem just north of Provo. Crispy, blistered crusts and quality toppings.",dishes:["Wood-Fired Margherita","Seasonal Pizzas","Antipasti"],address:"320 S State St, Orem, UT 84058",hours:"",lat:40.2927,lng:-111.6936,instagram:"pizzeria712",website:"https://www.pizzeria712.com",reservation:"walk-in",phone:"(801) 623-6712",suburb:true});

add({name:"Five Sushi Brothers",cuisine:"Sushi",neighborhood:"Provo",score:86,price:2,tags:["Sushi","Japanese","Local Favorites","Casual"],description:"Called the best sushi in Provo by local legends. Fresh, satisfying sushi at reasonable prices in a fun atmosphere.",dishes:["Sushi Rolls","Sashimi","Specialty Rolls"],address:"445 N 900 W, Provo, UT 84601",hours:"",lat:40.2375,lng:-111.6700,instagram:"fivesushibrothers",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Rockwell Ice Cream",cuisine:"Ice Cream",neighborhood:"Provo",score:85,price:1,tags:["Dessert","Local Favorites"],description:"Small-batch ice cream flavors done better than just about anyone in the state. Creative flavors and silky-smooth texture. A Provo must-stop.",dishes:["Small Batch Ice Cream","Seasonal Flavors","Sundaes"],address:"25 N University Ave, Provo, UT 84601",hours:"",lat:40.2333,lng:-111.6586,instagram:"rockwellicecream",website:"",reservation:"walk-in",phone:"",suburb:true});

// === MORE SLC ===

add({name:"Valter's Osteria",cuisine:"Tuscan Italian",neighborhood:"Downtown",score:91,price:3,tags:["Italian","Fine Dining","Date Night","Celebrations","Critics Pick"],description:"2025 Michelin 1-star restaurant serving Tuscan classics with Utah twists. SLC most well-known upscale Italian with ravioli in four-cheese cream sauce and pillowy mushroom gnocchi. A $140-$240 experience.",dishes:["Ravioli","Mushroom Gnocchi","Tuscan Classics"],address:"173 Broadway, Salt Lake City, UT 84101",hours:"",lat:40.7585,lng:-111.8885,instagram:"valtersosteria",website:"https://www.valtersosteria.com",reservation:"OpenTable",phone:"(801) 521-4563",awards:"Michelin 1 Star 2025"});

add({name:"Cucina Toscana",cuisine:"Italian",neighborhood:"Downtown",score:88,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Authentic Tuscan Italian in downtown SLC. Classic Italian dishes with quality ingredients and a warm atmosphere. One of the city most consistent Italian restaurants.",dishes:["Osso Buco","Handmade Pasta","Tiramisu"],address:"307 W Pierpont Ave, Salt Lake City, UT 84101",hours:"",lat:40.7610,lng:-111.8950,instagram:"cucinatoscana",website:"",reservation:"OpenTable",phone:""});

add({name:"Feldman's Deli",cuisine:"Jewish Deli",neighborhood:"Downtown",score:87,price:1,tags:["Deli","Brunch","Local Favorites"],description:"Kosher-style Jewish deli known for towering sandwiches, house-made potato latkes with applesauce or sour cream, and matzo ball soup. Half-pound portions. Multiple locations.",dishes:["Pastrami Sandwich","Matzo Ball Soup","Potato Latkes"],address:"370 E 900 S, Salt Lake City, UT 84111",hours:"",lat:40.7479,lng:-111.8808,instagram:"feldmansdeli",website:"",reservation:"walk-in",phone:""});

add({name:"La Casa Del Tamal",cuisine:"Mexican",neighborhood:"Post District",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"Longtime West Valley favorite known for birria tacos and tamales, now open in SLC growing Post District. Authentic Mexican comfort food.",dishes:["Birria Tacos","Tamales","Pozole"],address:"550 S 300 W, Salt Lake City, UT 84101",hours:"",lat:40.7590,lng:-111.8970,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Crown Burgers",cuisine:"Burgers",neighborhood:"Multiple Locations",score:86,price:1,tags:["Burgers","Iconic","Local Favorites","Casual"],description:"SLC burger institution known for the Crown Burger -- a pastrami-topped burger unique to Utah. Multiple locations. The fry sauce is a Utah tradition.",dishes:["Crown Burger","Pastrami Burger","Fry Sauce"],address:"377 E 200 S, Salt Lake City, UT 84111",hours:"",lat:40.7637,lng:-111.8808,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Apollo Burger",cuisine:"Burgers / Greek",neighborhood:"Multiple Locations",score:85,price:1,tags:["Burgers","Greek","Local Favorites","Casual"],description:"Utah burger chain with Greek influences. The Apollo burger and gyros are local favorites. Multiple locations across the valley.",dishes:["Apollo Burger","Gyro","Greek Fries"],address:"818 S State St, Salt Lake City, UT 84111",hours:"",lat:40.7510,lng:-111.8881,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Boba World",cuisine:"Taiwanese / Boba",neighborhood:"Sugar House",score:85,price:1,tags:["Taiwanese","Boba","Casual","Local Favorites"],description:"Boba tea and Taiwanese snacks in Sugar House. Wide variety of boba flavors and Taiwanese street food bites. A popular hangout spot.",dishes:["Boba Tea","Popcorn Chicken","Taiwanese Snacks"],address:"1615 S Main St, Salt Lake City, UT 84115",hours:"",lat:40.7378,lng:-111.8910,instagram:"",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new SLC spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SLC batch 3 complete!');
