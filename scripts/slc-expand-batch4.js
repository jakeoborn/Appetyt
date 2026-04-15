// SLC Expansion Batch 4 — Brunch, Pizza, Mexican, More Neighborhoods
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

// === BRUNCH ===
add({name:"Sweet Lake Biscuits & Limeade",cuisine:"Southern Brunch",neighborhood:"Downtown",score:86,price:1,tags:["Brunch","Southern","Casual","Local Favorites"],description:"Famous for The Hoss -- a towering creation of biscuits, fried chicken, and sausage gravy. Southern-style brunch with fresh limeade that hits the spot. A SLC brunch institution.",dishes:["The Hoss","Biscuits & Gravy","Fresh Limeade"],address:"546 W 100 S, Salt Lake City, UT 84101",hours:"",lat:40.7670,lng:-111.9000,instagram:"sweetlakeslc",website:"",reservation:"walk-in",phone:""});

add({name:"Marmalade Brunch House",cuisine:"American Brunch",neighborhood:"Marmalade",score:86,price:1,tags:["Brunch","Local Favorites","Casual"],description:"Brunch house in the Marmalade neighborhood with creative morning dishes and strong coffee. A newer addition that has quickly become a local favorite.",dishes:["Brunch Plates","Eggs Benedict","Pancakes"],address:"361 N 300 W, Salt Lake City, UT 84103",hours:"",lat:40.7714,lng:-111.8970,instagram:"marmaladebrunch",website:"",reservation:"walk-in",phone:""});

add({name:"Hash Kitchen",cuisine:"American Brunch",neighborhood:"Downtown",score:85,price:1,tags:["Brunch","Casual","Local Favorites"],description:"Opened March 2025 with creative brunch dishes and a build-your-own Bloody Mary bar. Fun, colorful atmosphere with inventive breakfast and lunch options.",dishes:["Build-Your-Own Bloody Mary","Brunch Plates","Hash Bowls"],address:"50 W Broadway, Salt Lake City, UT 84101",hours:"",lat:40.7585,lng:-111.8905,instagram:"hashkitchen",website:"",reservation:"walk-in",phone:""});

add({name:"Sunday's Best",cuisine:"American Brunch",neighborhood:"Downtown",score:86,price:1,tags:["Brunch","Local Favorites","Casual"],description:"Opened July 2025 in downtown SLC focusing on elevated weekend brunch. Fresh pastries, creative egg dishes, and great coffee in a stylish space.",dishes:["Pastries","Creative Eggs","Specialty Coffee"],address:"222 S Main St, Salt Lake City, UT 84101",hours:"",lat:40.7628,lng:-111.8910,instagram:"sundaysbestslc",website:"",reservation:"walk-in",phone:""});

add({name:"Early Owl Cafe",cuisine:"Cafe / Breakfast",neighborhood:"Sugar House",score:85,price:1,tags:["Bakery/Coffee","Brunch","Casual","Local Favorites"],description:"Opened May 2025 in Sugar House. Early morning cafe with excellent breakfast sandwiches, pastries, and coffee. Perfect for an early start to the day.",dishes:["Breakfast Sandwiches","Pastries","Coffee"],address:"2100 S 1100 E, Salt Lake City, UT 84106",hours:"",lat:40.7217,lng:-111.8596,instagram:"earlyowlcafe",website:"",reservation:"walk-in",phone:""});

add({name:"Goat Head",cuisine:"Brunch / Cafe",neighborhood:"Downtown",score:86,price:1,tags:["Brunch","Casual","Local Favorites"],description:"A top brunch spot in downtown SLC with creative dishes and a fun atmosphere. One of the Yelp top-rated brunch options in the city.",dishes:["Brunch Specials","Creative Plates","Mimosas"],address:"325 S State St, Salt Lake City, UT 84111",hours:"",lat:40.7617,lng:-111.8881,instagram:"goatheadslc",website:"",reservation:"walk-in",phone:""});

// === PIZZA ===
add({name:"Settebello Pizzeria",cuisine:"Neapolitan Pizza",neighborhood:"Downtown",score:87,price:1,tags:["Pizza","Italian","Local Favorites","Casual"],description:"Quality Neapolitan-style pizza with thin-crust pies and perfect toppings. One of the highest-rated pizza spots in SLC with over 1,100 reviews.",dishes:["Margherita","Neapolitan Pizza","Antipasti"],address:"260 S 200 W, Salt Lake City, UT 84101",hours:"",lat:40.7635,lng:-111.8937,instagram:"settebello",website:"",reservation:"walk-in",phone:""});

add({name:"Bricks Corner",cuisine:"Detroit-Style Pizza",neighborhood:"Sugar House",score:87,price:1,tags:["Pizza","Local Favorites","Casual"],description:"Unique square Detroit-style pizza where each dense, chewy piece comes with its own lacy, crispy, cheesy edge. A different style that SLC has embraced.",dishes:["Detroit-Style Pizza","Cheesy Edge Slices","Dipping Sauce"],address:"1465 S 700 E, Salt Lake City, UT 84105",hours:"",lat:40.7396,lng:-111.8716,instagram:"brickscorner",website:"",reservation:"walk-in",phone:""});

add({name:"The Pie Pizzeria",cuisine:"Pizza",neighborhood:"University",score:86,price:1,tags:["Pizza","Casual","Iconic","Local Favorites","Late Night"],description:"Voted Utah Best Pizza for over 40 years. Underground pizza joint near the University of Utah with a collegiate atmosphere and generous toppings. Late-night friendly.",dishes:["Specialty Pizza","Classic Cheese","The Pie Supreme"],address:"1320 E 200 S, Salt Lake City, UT 84102",hours:"",lat:40.7637,lng:-111.8624,instagram:"thepiepizzeria",website:"https://www.thepie.com",reservation:"walk-in",phone:""});

add({name:"Pie Hole",cuisine:"Pizza",neighborhood:"Downtown",score:85,price:1,tags:["Pizza","Casual","Late Night","Local Favorites"],description:"Downtown pizza joint known for late-night hours and big thin slices. Classic and specialty pies of the day. A staple for after-bar pizza runs.",dishes:["Cheese Slice","Pepperoni Slice","Pie of the Day"],address:"344 S State St, Salt Lake City, UT 84111",hours:"",lat:40.7614,lng:-111.8881,instagram:"pieholeslc",website:"",reservation:"walk-in",phone:""});

add({name:"Central 9th Market",cuisine:"Pizza / Market",neighborhood:"Central 9th",score:86,price:1,tags:["Pizza","Local Favorites","Casual"],description:"Creates some of the best pizza in SLC with sourdough crust that is charred without being crispy. Mushroom Conserva pizza is a standout. Also a neighborhood market.",dishes:["Mushroom Conserva Pizza","Sourdough Pizza","Market Items"],address:"161 W 900 S, Salt Lake City, UT 84101",hours:"",lat:40.7479,lng:-111.8923,instagram:"central9thmarket",website:"",reservation:"walk-in",phone:""});

add({name:"OAK Wood Fire Kitchen",cuisine:"Wood-Fired Pizza",neighborhood:"Draper",score:86,price:2,tags:["Pizza","Date Night","Local Favorites"],description:"Suburban SLC gem with classic pepperoni pizza with hot honey and fun toppings. Squishy, fluffy crust that is a hybrid American-Neapolitan style. Worth the drive.",dishes:["Pepperoni with Hot Honey","Wood-Fired Pizza","Appetizers"],address:"11725 S 700 E, Draper, UT 84020",hours:"",lat:40.5269,lng:-111.8716,instagram:"oakwoodfirekitchen",website:"",reservation:"OpenTable",phone:"",suburb:true});

// === MEXICAN ===
add({name:"Chunga's",cuisine:"Mexican",neighborhood:"North Temple",score:87,price:1,tags:["Mexican","Local Favorites","Casual","Hole in the Wall"],description:"Known for the best al pastor in SLC -- rotisserie roasted and seasoned pork available in burritos, tacos, enchiladas, quesadillas, and nachos. A local legend.",dishes:["Al Pastor Tacos","Al Pastor Burrito","Nachos"],address:"180 S 900 W, Salt Lake City, UT 84104",hours:"",lat:40.7657,lng:-111.9110,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Chile-Tepin",cuisine:"Mexican",neighborhood:"West Valley",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"Highly-rated Mexican restaurant in the SLC area with authentic dishes and great salsa. A neighborhood favorite for years.",dishes:["Enchiladas","Tacos","Chile Relleno"],address:"307 W 200 S, Salt Lake City, UT 84101",hours:"",lat:40.7645,lng:-111.8958,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Blue Iguana",cuisine:"Mexican",neighborhood:"Downtown",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"Downtown Mexican restaurant with solid traditional dishes and good margaritas. A reliable option near the convention center.",dishes:["Enchiladas","Margaritas","Mexican Plate"],address:"165 S West Temple, Salt Lake City, UT 84101",hours:"",lat:40.7641,lng:-111.8914,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"El Paisa Grill",cuisine:"Mexican",neighborhood:"West Valley",score:86,price:1,tags:["Mexican","Local Favorites","Casual"],description:"West Valley Mexican with an excellent molcajete and authentic regional dishes. Worth the drive for the quality and authenticity.",dishes:["Molcajete","Tacos","Carne Asada"],address:"3534 S Redwood Rd, West Valley City, UT 84119",hours:"",lat:40.6988,lng:-111.9388,instagram:"",website:"",reservation:"walk-in",phone:"",suburb:true});

// === MORE RESTAURANTS ===
add({name:"Cafe Niche",cuisine:"New American",neighborhood:"9th & 9th",score:87,price:2,tags:["New American","Date Night","Brunch","Local Favorites"],description:"Neighborhood New American restaurant in the 9th and 9th area with seasonal menus and a strong brunch program. Cozy and consistently excellent.",dishes:["Seasonal Menu","Weekend Brunch","Small Plates"],address:"779 E 300 S, Salt Lake City, UT 84102",hours:"",lat:40.7594,lng:-111.8724,instagram:"cafeniche",website:"",reservation:"OpenTable",phone:""});

add({name:"Copper Onion",cuisine:"New American",neighborhood:"Downtown",score:88,price:2,tags:["New American","Date Night","Brunch","Local Favorites"],description:"A downtown SLC staple for New American dining. The burger is one of the best in the city, the brunch is excellent, and the cocktail program is strong.",dishes:["Copper Onion Burger","Brunch Plates","Seasonal Menu"],address:"111 E Broadway, Salt Lake City, UT 84111",hours:"",lat:40.7585,lng:-111.8873,instagram:"copperonion",website:"https://www.thecopperonion.com",reservation:"OpenTable",phone:"(801) 355-3282"});

add({name:"SLC Eatery",cuisine:"New American / Tapas",neighborhood:"Downtown",score:87,price:2,tags:["New American","Tapas","Date Night","Local Favorites"],description:"Small plates and tapas-style New American dining in downtown SLC. Creative dishes meant for sharing with a good cocktail program.",dishes:["Small Plates","Tapas","Craft Cocktails"],address:"1017 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7491,lng:-111.8910,instagram:"slceatery",website:"",reservation:"OpenTable",phone:""});

add({name:"Laziz Kitchen",cuisine:"Middle Eastern",neighborhood:"Downtown",score:87,price:1,tags:["Middle Eastern","Local Favorites","Casual"],description:"Fast-casual Middle Eastern kitchen in downtown SLC. Fresh falafel, shawarma, and bowls with quality ingredients. One of the best quick lunch options downtown.",dishes:["Falafel","Shawarma Bowl","Hummus"],address:"912 S Jefferson St, Salt Lake City, UT 84101",hours:"",lat:40.7495,lng:-111.8924,instagram:"lazizkitchen",website:"",reservation:"walk-in",phone:""});

add({name:"Mazza",cuisine:"Middle Eastern / Lebanese",neighborhood:"9th & 9th",score:87,price:2,tags:["Middle Eastern","Lebanese","Date Night","Local Favorites"],description:"Lebanese and Middle Eastern restaurant in the 9th and 9th area. Mazza has been serving authentic Middle Eastern cuisine for years with great meze spreads and kebabs.",dishes:["Meze Spread","Kebabs","Baklava"],address:"912 E 900 S, Salt Lake City, UT 84105",hours:"",lat:40.7479,lng:-111.8666,instagram:"mazzaslc",website:"",reservation:"OpenTable",phone:""});

add({name:"Table X",cuisine:"New American",neighborhood:"South Salt Lake",score:89,price:3,tags:["Fine Dining","Date Night","Farm-to-Table","Critics Pick"],description:"Farm-to-table fine dining with a bakery program that supplies bread to restaurants across the city. Seasonal tasting menus with local ingredients. One of SLC most ambitious restaurants.",dishes:["Seasonal Tasting Menu","House-Baked Bread","Farm-to-Table"],address:"1457 S 700 W, Salt Lake City, UT 84104",hours:"",lat:40.7396,lng:-111.9041,instagram:"tablexrestaurant",website:"",reservation:"Resy",phone:""});

add({name:"RIME",cuisine:"Steakhouse / Seafood",neighborhood:"Park City (Deer Valley)",score:90,price:4,tags:["Steakhouse","Seafood","Fine Dining","Celebrations","Scenic"],description:"Champagne sabering and commanding views at Deer Valley. A Park City fine dining destination with pristine steaks and seafood in a mountain setting.",dishes:["Champagne Sabering","Prime Steak","Fresh Seafood"],address:"2300 Deer Valley Dr, Park City, UT 84060",hours:"",lat:40.6253,lng:-111.4828,instagram:"rimeparkcity",website:"",reservation:"OpenTable",phone:""});

add({name:"Hearth and Hill Park City",cuisine:"New American",neighborhood:"Park City",score:87,price:2,tags:["New American","Brunch","Local Favorites"],description:"Park City location of the 2025 Best of State New American restaurant. Hearth-cooked dishes and seasonal ingredients in a warm mountain setting.",dishes:["Hearth-Cooked Meats","Brunch","Seasonal Menu"],address:"1153 Center Dr, Park City, UT 84098",hours:"",lat:40.6572,lng:-111.5016,instagram:"hearthandhill",website:"https://www.hearth-hill.com",reservation:"OpenTable",phone:""});

add({name:"Tupelo",cuisine:"New American",neighborhood:"Park City",score:87,price:2,tags:["New American","Brunch","Local Favorites"],description:"Park City restaurant recognized in Salt Lake Magazine dining awards. Creative New American with a strong brunch following.",dishes:["Brunch Plates","Seasonal Dinner","Local Ingredients"],address:"508 Main St, Park City, UT 84060",hours:"",lat:40.6459,lng:-111.4983,instagram:"tupeloparkcity",website:"",reservation:"OpenTable",phone:""});

add({name:"Handle",cuisine:"New American",neighborhood:"Park City",score:88,price:2,tags:["New American","Date Night","Local Favorites","Critics Pick"],description:"Park City restaurant recognized in Salt Lake Magazine dining awards. Creative small plates and cocktails on Historic Main Street.",dishes:["Small Plates","Craft Cocktails","Seasonal Menu"],address:"136 Heber Ave, Park City, UT 84060",hours:"",lat:40.6461,lng:-111.4991,instagram:"handleparkcity",website:"",reservation:"Resy",phone:""});

add({name:"Momomaru Hand Roll Sushi",cuisine:"Japanese Hand Rolls",neighborhood:"Downtown",score:86,price:2,tags:["Japanese","Sushi","Local Favorites"],description:"New hand roll sushi spot specializing in fresh hand rolls made to order. Soft-launched in early 2026 with limited seating. Quick, fresh, and well-executed.",dishes:["Hand Rolls","Sashimi","Miso Soup"],address:"51 S Main St, Salt Lake City, UT 84111",hours:"",lat:40.7668,lng:-111.8910,instagram:"momomaruslc",website:"",reservation:"walk-in",phone:""});

add({name:"TEN Coffee",cuisine:"Coffee",neighborhood:"Post District",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"New coffee shop opened 2026 at 636 S 200 W bringing LA vibes to SLC. Coffee, matcha, and bagel sandwiches in a stylish space.",dishes:["Specialty Coffee","Matcha","Bagel Sandwiches"],address:"636 S 200 W, Salt Lake City, UT 84101",hours:"",lat:40.7549,lng:-111.8937,instagram:"tencoffeeslc",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new SLC spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SLC batch 4 complete!');
