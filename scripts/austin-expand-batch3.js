// Austin Expansion Batch 3 — More neighborhood spots, bars, food trucks, cheap eats
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const austinMarker = 'const AUSTIN_DATA=';
const austinPos = html.indexOf(austinMarker);
if (austinPos === -1) { console.error('AUSTIN_DATA not found!'); process.exit(1); }
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

// === BARS & COCKTAILS ===

add({name:"Roosevelt Room",cuisine:"Cocktail Bar",neighborhood:"Downtown",score:88,price:2,tags:["Cocktails","Date Night","Speakeasy","Local Favorites"],description:"Sophisticated downtown cocktail bar that consistently makes national best-of lists. Classic and creative cocktails crafted with precision. Multi-level space with an intimate upstairs lounge.",dishes:["Classic Cocktails","Craft Originals","Bar Snacks"],address:"307 W 5th St, Austin, TX 78701",hours:"",lat:30.2669,lng:-97.7462,instagram:"rooseveltroom",website:"https://www.therooseveltroom.com",reservation:"walk-in",phone:""});

add({name:"Here Nor There",cuisine:"Cocktail Bar / Speakeasy",neighborhood:"East Austin",score:87,price:2,tags:["Cocktails","Speakeasy","Date Night"],description:"Hidden speakeasy in East Austin accessed through a secret entrance. Inventive cocktails and an intimate atmosphere. One of Austin most unique bar experiences.",dishes:["Inventive Cocktails","Speakeasy Experience","Small Plates"],address:"412 E 6th St, Austin, TX 78701",hours:"",lat:30.2671,lng:-97.7388,instagram:"herenorthereatx",website:"",reservation:"Resy",phone:""});

add({name:"Midnight Cowboy",cuisine:"Speakeasy",neighborhood:"Downtown",score:87,price:2,tags:["Cocktails","Speakeasy","Date Night","Iconic"],description:"Reservation-only speakeasy on Dirty Sixth housed in a former massage parlor. Ring the buzzer, give the password, and enter one of Austin most iconic cocktail bars.",dishes:["Reservation Cocktails","Speakeasy Experience","Curated Menu"],address:"313 E 6th St, Austin, TX 78701",hours:"",lat:30.2671,lng:-97.7397,instagram:"midnightcowboyatx",website:"",reservation:"Resy",phone:""});

add({name:"Watertrade",cuisine:"Japanese Whiskey Bar",neighborhood:"South Congress",score:87,price:3,tags:["Japanese","Cocktails","Date Night","Exclusive"],description:"Japanese whiskey bar hidden below Otoko on South Congress. Intimate space with an extensive Japanese whiskey collection and Japanese-inspired cocktails.",dishes:["Japanese Whiskey","Sake","Japanese Cocktails"],address:"1603 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2443,lng:-97.7495,instagram:"watertradeatx",website:"",reservation:"Resy",phone:""});

add({name:"Nickel City",cuisine:"Dive Bar",neighborhood:"East Austin",score:85,price:1,tags:["Casual","Late Night","Local Favorites"],description:"Cash-only dive bar in East Austin with cheap drinks and a jukebox. The kind of no-pretense bar that Austin was built on. Late night essential.",dishes:["Cheap Beer","Shot & Beer Combos","Jukebox"],address:"1133 E 11th St, Austin, TX 78702",hours:"",lat:30.2722,lng:-97.7282,instagram:"nickelcityatx",website:"",reservation:"walk-in",phone:""});

add({name:"Drink.Well",cuisine:"Gastropub / Cocktail Bar",neighborhood:"North Loop",score:86,price:2,tags:["Cocktails","Gastropub","Local Favorites"],description:"Neighborhood gastropub and cocktail bar in North Loop with elevated bar food and creative cocktails. Great happy hour and a neighborhood gathering spot.",dishes:["Craft Cocktails","Gastropub Fare","Happy Hour"],address:"207 E 53rd St, Austin, TX 78751",hours:"",lat:30.3171,lng:-97.7276,instagram:"drinkwellatx",website:"",reservation:"walk-in",phone:""});

// === BREAKFAST TACOS & BRUNCH ===

add({name:"Pueblo Viejo",cuisine:"Mexican / Breakfast Tacos",neighborhood:"East Austin",score:87,price:1,tags:["Mexican","Brunch","Local Favorites","Casual"],description:"One of Austin best breakfast taco trucks. The migas and barbacoa tacos are legendary and the salsa verde is perfect. Multiple locations across East Austin.",dishes:["Migas Taco","Barbacoa Taco","Breakfast Burritos"],address:"1200 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7303,instagram:"puebloviejoatx",website:"",reservation:"walk-in",phone:""});

add({name:"Tacodeli",cuisine:"Mexican / Breakfast Tacos",neighborhood:"Multiple Locations",score:86,price:1,tags:["Mexican","Brunch","Local Favorites","Casual"],description:"Austin breakfast taco chain with creative fillings and the famous Dona sauce. Multiple locations across the city. The Otto taco with bacon and avocado is a cult favorite.",dishes:["Otto Taco","Breakfast Tacos","Dona Sauce"],address:"1500 Spyglass Dr, Austin, TX 78746",hours:"",lat:30.2618,lng:-97.7847,instagram:"tacodeliatx",website:"https://www.tacodeli.com",reservation:"walk-in",phone:""});

add({name:"Counter Cafe",cuisine:"American Breakfast",neighborhood:"East Austin",score:86,price:1,tags:["Brunch","Casual","Local Favorites"],description:"East Austin breakfast and brunch spot with huge fluffy pancakes and classic American breakfast. The kind of place where everyone in the neighborhood shows up on Saturday morning.",dishes:["Fluffy Pancakes","Breakfast Plates","Coffee"],address:"626 N Lamar Blvd, Austin, TX 78703",hours:"",lat:30.2713,lng:-97.7517,instagram:"countercafeatx",website:"",reservation:"walk-in",phone:""});

add({name:"Kerbey Lane Cafe",cuisine:"American / Tex-Mex Brunch",neighborhood:"Multiple Locations",score:85,price:1,tags:["Brunch","Casual","Iconic","Local Favorites","Late Night"],description:"Austin brunch institution since 1980 with multiple locations. Open 24 hours at some locations. Queso, pancakes, and Tex-Mex brunch are staples. An Austin rite of passage.",dishes:["Queso","Pancakes","Tex-Mex Brunch"],address:"3704 Kerbey Ln, Austin, TX 78731",hours:"Open 24 Hours",lat:30.3082,lng:-97.7544,instagram:"kerbeylane",website:"https://www.kerbeylanecafe.com",reservation:"walk-in",phone:""});

add({name:"Bouldin Creek Cafe",cuisine:"Vegetarian / Brunch",neighborhood:"Bouldin Creek",score:86,price:1,tags:["Vegetarian","Brunch","Casual","Local Favorites"],description:"Vegetarian cafe and brunch spot in Bouldin Creek that has been an Austin institution for years. Creative veggie dishes and strong coffee in a laid-back space.",dishes:["Veggie Brunch","Migas","Fresh Juice"],address:"1900 S 1st St, Austin, TX 78704",hours:"",lat:30.2438,lng:-97.7557,instagram:"bouldincreekcafe",website:"",reservation:"walk-in",phone:""});

// === BAKERIES & COFFEE ===

add({name:"Quack's 43rd Street Bakery",cuisine:"Bakery / Cafe",neighborhood:"Hyde Park",score:86,price:1,tags:["Bakery/Coffee","Local Favorites","Casual"],description:"Hyde Park bakery institution with fresh pastries, cookies, and sandwiches. The gingerbread cookie is famous and the patio is a neighborhood hangout.",dishes:["Gingerbread Cookie","Pastries","Sandwiches"],address:"411 E 43rd St, Austin, TX 78751",hours:"",lat:30.3037,lng:-97.7293,instagram:"quacksbakery",website:"",reservation:"walk-in",phone:""});

add({name:"Flitch Coffee",cuisine:"Coffee",neighborhood:"East Austin",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"Tiny East Austin coffee trailer with excellent espresso and a loyal following. Simple menu, quality beans, and a shady patio. Part of the Grackle bar complex.",dishes:["Espresso","Cold Brew","Simple Menu"],address:"1700 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7260,instagram:"flitchcoffee",website:"",reservation:"walk-in",phone:""});

add({name:"Cenote",cuisine:"Coffee / Cafe",neighborhood:"East Austin",score:86,price:1,tags:["Bakery/Coffee","Brunch","Local Favorites","Patio"],description:"East Austin coffee shop and cafe with one of the best patios in the city. Great breakfast tacos, pastries, and coffee under massive oak trees.",dishes:["Coffee","Breakfast Tacos","Patio Dining"],address:"1010 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7339,instagram:"cenoteatx",website:"",reservation:"walk-in",phone:""});

add({name:"Figure 8 Coffee Purveyors",cuisine:"Coffee",neighborhood:"North Loop",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"North Loop coffee shop with excellent espresso and a sleek, minimalist space. One of Austin top specialty coffee spots with quality single-origin beans.",dishes:["Espresso","Pour-Over","Cold Brew"],address:"4807 Airport Blvd, Austin, TX 78751",hours:"",lat:30.3087,lng:-97.7153,instagram:"figure8coffee",website:"",reservation:"walk-in",phone:""});

// === MORE FOOD & RESTAURANTS ===

add({name:"Interstellar BBQ",cuisine:"BBQ",neighborhood:"Cedar Park",score:89,price:1,tags:["BBQ","Local Favorites","Critics Pick"],description:"Major BBQ destination in Cedar Park that draws people from across the state. Juicy brisket, peach-tea-glazed pork belly, and smoked turkey breast. Worth the drive north.",dishes:["Brisket","Peach-Tea Pork Belly","Smoked Turkey"],address:"15530 Ranch Rd 620 N, Austin, TX 78717",hours:"",lat:30.4855,lng:-97.8291,instagram:"interstellarbbq",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Torchy's Tacos",cuisine:"Tex-Mex / Tacos",neighborhood:"Multiple Locations",score:85,price:1,tags:["Mexican","Tex-Mex","Casual","Iconic","Local Favorites"],description:"Austin-born taco chain with creative tacos and the famous green chile queso. The Trailer Park taco (fried chicken, green chiles, queso) is the signature. Multiple locations.",dishes:["Trailer Park Taco","Green Chile Queso","Creative Tacos"],address:"1311 S 1st St, Austin, TX 78704",hours:"",lat:30.2494,lng:-97.7557,instagram:"torchystacos",website:"https://www.torchystacos.com",reservation:"walk-in",phone:""});

add({name:"Hopdoddy Burger Bar",cuisine:"Burgers",neighborhood:"South Congress",score:86,price:1,tags:["Burgers","Casual","Local Favorites"],description:"Austin-born burger bar on South Congress with quality ingredients and creative toppings. The Primetime burger with truffle aioli is a fan favorite. Great craft beer selection.",dishes:["Primetime Burger","Craft Beer","Truffle Fries"],address:"1400 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2471,lng:-97.7497,instagram:"hopdoddy",website:"https://www.hopdoddy.com",reservation:"walk-in",phone:""});

add({name:"Ramen Tatsu-ya",cuisine:"Japanese Ramen",neighborhood:"Multiple Locations",score:88,price:1,tags:["Japanese","Ramen","Local Favorites","Casual"],description:"Austin legendary ramen shop with some of the best ramen in Texas. The original tonkotsu broth is rich and deeply flavored. Lines are long but move fast. Multiple locations.",dishes:["Tonkotsu Ramen","Spicy Miso","Tsukemen"],address:"8557 Research Blvd #126, Austin, TX 78758",hours:"",lat:30.3617,lng:-97.7154,instagram:"raboratory",website:"https://www.ramen-tatsuya.com",reservation:"walk-in",phone:""});

add({name:"Terry Black's BBQ",cuisine:"BBQ",neighborhood:"South 1st",score:88,price:1,tags:["BBQ","Local Favorites","Iconic","Family"],description:"Third-generation BBQ family from Lockhart serving classic Central Texas BBQ on South 1st. Massive space with indoor and outdoor seating. The brisket and beef rib are excellent.",dishes:["Brisket","Beef Rib","Sausage"],address:"1003 Barton Springs Rd, Austin, TX 78704",hours:"",lat:30.2614,lng:-97.7555,instagram:"terryblacksbbq",website:"https://www.terryblacksbbq.com",reservation:"walk-in",phone:""});

add({name:"la Barbecue",cuisine:"BBQ",neighborhood:"East Austin",score:89,price:1,tags:["BBQ","Local Favorites","Critics Pick"],description:"Tastemaker Awards 2026 nominee. East Austin BBQ trailer serving some of the best brisket in the city. The beef rib on Saturdays is a must. Long lines, always worth it.",dishes:["Brisket","Beef Rib","Pulled Pork"],address:"2401 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7199,instagram:"labarbecue",website:"",reservation:"walk-in",phone:""});

add({name:"Micklethwait Craft Meats",cuisine:"BBQ",neighborhood:"East Austin",score:88,price:1,tags:["BBQ","Local Favorites","Casual"],description:"Craft BBQ trailer in East Austin with house-made sausages and creative sides. The jalapeño cheese sausage is a standout. Smaller operation but excellent quality.",dishes:["House Sausage","Brisket","Creative Sides"],address:"1309 Rosewood Ave, Austin, TX 78702",hours:"",lat:30.2693,lng:-97.7275,instagram:"micklethwait",website:"",reservation:"walk-in",phone:""});

add({name:"Thai Kun",cuisine:"Thai",neighborhood:"North Lamar",score:86,price:1,tags:["Thai","Casual","Local Favorites"],description:"Thai street food from former Sway chef. Bold, spicy Thai flavors at affordable prices. The pad Thai and papaya salad are excellent.",dishes:["Pad Thai","Papaya Salad","Thai Street Food"],address:"1501 E 7th St, Austin, TX 78702",hours:"",lat:30.2638,lng:-97.7258,instagram:"thaikunatx",website:"",reservation:"walk-in",phone:""});

add({name:"Pieous",cuisine:"Pizza / BBQ",neighborhood:"Dripping Springs",score:87,price:1,tags:["Pizza","BBQ","Local Favorites","Casual"],description:"Unique pizza-meets-BBQ concept in Dripping Springs just outside Austin. Wood-fired pizza AND smoked meats. The brisket pizza is a genius combination.",dishes:["Wood-Fired Pizza","Smoked Brisket","Brisket Pizza"],address:"12005 Hwy 290 W, Austin, TX 78737",hours:"",lat:30.1947,lng:-97.8933,instagram:"pieous",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Stiles Switch BBQ",cuisine:"BBQ",neighborhood:"North Loop",score:87,price:1,tags:["BBQ","Local Favorites","Casual"],description:"North Loop BBQ joint with quality meats and a craft beer garden. The brisket is consistently excellent and the sausage selection is creative. No long Franklin-level lines here.",dishes:["Brisket","House Sausage","Craft Beer"],address:"6610 N Lamar Blvd, Austin, TX 78752",hours:"",lat:30.3314,lng:-97.7159,instagram:"stilesswitchbbq",website:"",reservation:"walk-in",phone:""});

add({name:"Thai Fresh",cuisine:"Thai / Bakery",neighborhood:"South Lamar",score:86,price:1,tags:["Thai","Bakery/Coffee","Casual","Local Favorites"],description:"Thai restaurant with an attached bakery offering both savory Thai dishes and creative pastries. Cooking classes available. A unique Austin concept.",dishes:["Pad Thai","Thai Curry","Pastries"],address:"909 W Mary St, Austin, TX 78704",hours:"",lat:30.2495,lng:-97.7561,instagram:"thaifreshatx",website:"",reservation:"walk-in",phone:""});

add({name:"Via 313 Pizza",cuisine:"Detroit-Style Pizza",neighborhood:"Multiple Locations",score:87,price:1,tags:["Pizza","Local Favorites","Casual"],description:"Austin-born Detroit-style pizza with thick, crispy-edged pies and quality toppings. Multiple locations. The Detroiter with pepperoni and brick cheese is the signature.",dishes:["Detroiter","Detroit-Style Pizza","Salads"],address:"1111 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7316,instagram:"via313",website:"https://www.via313.com",reservation:"walk-in",phone:""});

add({name:"Valentina's Tex Mex BBQ",cuisine:"Tex-Mex BBQ",neighborhood:"South Austin",score:89,price:1,tags:["BBQ","Mexican","Tex-Mex","Local Favorites","Critics Pick"],description:"Tex-Mex meets BBQ in South Austin with breakfast tacos filled with smoked brisket and house-made tortillas. The Fat Boy breakfast taco is legendary. Lines are long but worth every minute.",dishes:["Fat Boy Taco","Brisket Tacos","Smoked Meats"],address:"11500 Manchaca Rd, Austin, TX 78748",hours:"",lat:30.1725,lng:-97.8292,instagram:"valentinastexmexbbq",website:"",reservation:"walk-in",phone:"",suburb:true});

add({name:"Home Slice Pizza",cuisine:"New York-Style Pizza",neighborhood:"South Congress",score:86,price:1,tags:["Pizza","Casual","Local Favorites","Late Night"],description:"New York-style pizza on South Congress with a walk-up window for late-night slices. Thin crust, proper fold, and good char. A SoCo institution.",dishes:["NY-Style Slice","Whole Pies","Late Night Slices"],address:"1415 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2470,lng:-97.7498,instagram:"homeslicepizza",website:"https://www.homeslicepizza.com",reservation:"walk-in",phone:""});

add({name:"Loro South Lamar",cuisine:"Asian-BBQ Fusion",neighborhood:"South Lamar",score:88,price:2,tags:["BBQ","Asian Fusion","Patio","Local Favorites"],description:"Original Aaron Franklin and Tyson Cole collaboration. Smoked brisket Thai herbs, coconut rice, and a massive patio. The smoked salmon is a revelation. An Austin essential.",dishes:["Brisket Thai Herbs","Coconut Rice","Smoked Salmon"],address:"2115 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2413,lng:-97.7714,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"1886 Cafe & Bakery",cuisine:"Cafe / Bakery",neighborhood:"Downtown",score:85,price:2,tags:["Bakery/Coffee","Brunch","Date Night"],description:"Cafe inside the historic Driskill Hotel downtown. Beautiful setting with pastries, brunch, and afternoon tea. A refined Austin experience.",dishes:["Pastries","Brunch","Afternoon Tea"],address:"604 Brazos St, Austin, TX 78701",hours:"",lat:30.2667,lng:-97.7411,instagram:"thedriskill",website:"",reservation:"walk-in",phone:""});

add({name:"Salt & Time",cuisine:"Butcher Shop / Restaurant",neighborhood:"East Austin",score:87,price:2,tags:["Charcuterie","Local Favorites","Date Night"],description:"Butcher shop and restaurant in East Austin with house-cured charcuterie, quality steaks, and a great brunch. The charcuterie boards are exceptional.",dishes:["Charcuterie Board","Steak","Brunch"],address:"1912 E 7th St, Austin, TX 78702",hours:"",lat:30.2644,lng:-97.7218,instagram:"saltandtime",website:"",reservation:"walk-in",phone:""});

add({name:"Geraldine's",cuisine:"New American",neighborhood:"Rainey Street",score:87,price:2,tags:["New American","Live Music","Date Night","Rooftop"],description:"Rooftop restaurant at Hotel Van Zandt on Rainey Street with live music and elevated New American cuisine. Great views of the Austin skyline.",dishes:["New American Plates","Live Music","Rooftop Views"],address:"605 Davis St, Austin, TX 78701",hours:"",lat:30.2583,lng:-97.7381,instagram:"geraldinesaustin",website:"",reservation:"OpenTable",phone:""});

add({name:"Matt's El Rancho",cuisine:"Tex-Mex",neighborhood:"South Lamar",score:86,price:1,tags:["Mexican","Tex-Mex","Iconic","Local Favorites","Family"],description:"Austin Tex-Mex institution since 1952 on South Lamar. Bob Armstrong dip (queso with guac, pico, and seasoned beef) was invented here. A family tradition for generations.",dishes:["Bob Armstrong Dip","Enchiladas","Classic Tex-Mex"],address:"2613 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2376,lng:-97.7760,instagram:"mattselrancho",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new Austin spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin batch 3 complete!');
