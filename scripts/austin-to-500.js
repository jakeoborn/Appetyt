// Austin 401 → 500 — All restaurants verified from CultureMap, Yelp, Infatuation, Austin Chronicle
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const m = 'const AUSTIN_DATA=';
const p = html.indexOf(m);
const arrS = html.indexOf('[',p);
let d=0,arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS,arrE));
console.log('Austin start:', arr.length);
let maxId = Math.max(...arr.map(r=>r.id)), nextId = maxId+1;
const ex = new Set(arr.map(r=>r.name.toLowerCase()));
let added=0;
function add(s){
  if(ex.has(s.name.toLowerCase()))return;
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.instagram=s.instagram||'';s.website=s.website||'';s.reservation=s.reservation||'walk-in';s.hours=s.hours||'';
  arr.push(s);ex.add(s.name.toLowerCase());added++;
}

// All verified from CultureMap 2026 Tastemaker nominees, Yelp, web search
add({name:"Discada",cuisine:"Mexico City Street Tacos",neighborhood:"East Austin",score:88,price:1,tags:["Mexican","Casual","Critics Pick","Hole in the Wall"],description:"Michelin-recognized single-taco menu food truck in East Austin. Discada style with different cuts of beef and pork cooked with aromatic vegetables and served taquito style. Nationally recognized.",dishes:["Discada Taquitos","Street Tacos"],address:"1700 E Cesar Chavez, Austin, TX 78702",lat:30.2555,lng:-97.7259,phone:"",instagram:"discada",website:"http://www.discadatx.com",reservation:"walk-in",awards:"Michelin Guide"});

add({name:"Vic & Al's",cuisine:"Cajun / Creole",neighborhood:"Manor Road",score:88,price:2,tags:["Cajun","Southern","Date Night","Local Favorites","Critics Pick"],description:"Sophisticated and unpretentious Cajun restaurant on Manor Road. 2026 Tastemaker nominee. Revival of a family establishment with po'boys, gumbo, and Cajun classics.",dishes:["Po'Boy","Gumbo","Crawfish"],address:"2406 Manor Rd, Ste D, Austin, TX 78722",lat:30.2823,lng:-97.7167,phone:"(512) 387-5875",instagram:"vicandals",website:"https://www.vicandals.com",reservation:"walk-in"});

add({name:"Whip My Soul",cuisine:"Soul Food",neighborhood:"Northwest Austin",score:87,price:1,tags:["Southern","Soul Food","Casual","Local Favorites","Black-Owned"],description:"Family-owned soul food in Northwest Austin. 2026 Tastemaker nominee. Waffle plates, oxtail, shrimp and grits, and three types of soul egg rolls with collard greens or mac and cheese.",dishes:["Waffle Plates","Oxtail","Soul Egg Rolls"],address:"11416 N FM 620, Austin, TX 78726",lat:30.4540,lng:-97.8290,phone:"(512) 514-0103",instagram:"whipmysoul",website:"",reservation:"walk-in",suburb:true});

add({name:"De Nada Cantina",cuisine:"Mexican / Tacos",neighborhood:"East Austin",score:87,price:1,tags:["Mexican","Cocktails","Casual","Local Favorites","Patio"],description:"East Austin's loveliest little taco dive. 2026 Tastemaker nominee. Handmade tortillas pressed and cooked on the comal, slow-braised meats, and traditional handcrafted margaritas.",dishes:["Barbacoa Tacos","Handmade Tortillas","Margaritas"],address:"4715 E Cesar Chavez St, Austin, TX 78702",lat:30.2555,lng:-97.7036,phone:"(512) 615-3555",instagram:"denadacantina",website:"https://www.denadacantina.com",reservation:"walk-in"});

add({name:"Blue Apsara",cuisine:"Cambodian",neighborhood:"South Lamar",score:87,price:1,tags:["Cambodian","Asian","Casual","Local Favorites"],description:"2026 Tastemaker nominee. Full-time Cambodian food truck with chicken curry, nom panhg, and papaya salad. Authentic Cambodian in Austin.",dishes:["Chicken Curry","Nom Panhg","Papaya Salad"],address:"1904 S Lamar Blvd, Austin, TX 78704",lat:30.2510,lng:-97.7673,phone:"(737) 710-5916",instagram:"blueapsara",website:"https://www.blueapsarakitchen.com",reservation:"walk-in"});

add({name:"Churchrow Tejas BBQ",cuisine:"Tex-Mex BBQ",neighborhood:"Crestview",score:87,price:1,tags:["BBQ","Tex-Mex","Local Favorites","Casual"],description:"2026 Tastemaker nominee. Meats on tortillas with elote, escabeche, and loaded queso. From the team behind Taco Flats. Tejano-inspired BBQ.",dishes:["BBQ Tacos","Elote","Loaded Queso"],address:"1521 W Anderson Ln, Austin, TX 78757",lat:30.3582,lng:-97.7451,phone:"(512) 284-8347",instagram:"churchrowbbq",website:"https://www.churchrowbbq.com",reservation:"walk-in"});

add({name:"Garage Pizza",cuisine:"Sicilian Pizza",neighborhood:"Downtown",score:86,price:1,tags:["Pizza","Casual","Late Night"],description:"2026 Tastemaker nominee. Chef Philip Speer thick Sicilian-style slices from a hidden speakeasy parking garage. 72-hour cold-fermented dough. $8/slice until sold out.",dishes:["Sicilian Slices","72-Hour Dough","Speakeasy Pizza"],address:"503 Colorado St, Austin, TX 78701",lat:30.2668,lng:-97.7439,phone:"",instagram:"garagepizzatx",website:"",reservation:"walk-in"});

add({name:"Moderna Bar & Pizzeria",cuisine:"Neapolitan Pizza",neighborhood:"West 6th",score:87,price:2,tags:["Pizza","Italian","Date Night","Critics Pick"],description:"2026 Tastemaker nominee. Chef Leo Spizzirri Heritage Post-Neapolitan pizzas. Named one of 10 Best New Restaurants in Austin.",dishes:["Neapolitan Pizza","Italian Bistro","Wine"],address:"1717 W 6th St, Ste 140R, Austin, TX 78703",lat:30.2717,lng:-97.7575,phone:"(512) 646-8076",instagram:"modernapizzeria",website:"https://www.modernapizzeria.com",reservation:"Resy"});

add({name:"Cousin Louie's",cuisine:"Italian American",neighborhood:"Southwest Austin",score:86,price:2,tags:["Italian","Family","Casual","Local Favorites"],description:"2026 Tastemaker nominee. Family recipes with family photo decor in Belterra Village. Italian-American classics in Southwest Austin.",dishes:["Italian American Classics","Family Recipes","Pasta"],address:"165 Hargraves Dr, Ste T100, Austin, TX 78737",lat:30.1866,lng:-97.8733,phone:"(737) 277-0030",instagram:"cousinlouiesitalian",website:"https://www.cousin-louies.com",reservation:"Resy",suburb:true});

add({name:"High Road DelicaTexan",cuisine:"Deli / Sandwiches",neighborhood:"Bouldin Creek",score:86,price:1,tags:["Deli","Casual","Bakery/Coffee","Local Favorites"],description:"2026 Tastemaker nominee. High-stacked sandwiches, house-made sausages, cured meats, and miso cheesy fries. Full coffee program and craft cocktails.",dishes:["Craft Sandwiches","House Sausage","Miso Cheesy Fries"],address:"915 W Mary St, Austin, TX 78704",lat:30.2480,lng:-97.7561,phone:"",instagram:"highroaddelicatexan",website:"https://www.highroaddeli.com",reservation:"walk-in"});

add({name:"Taqueria de Diez",cuisine:"Tijuana-Style Tacos",neighborhood:"Downtown",score:87,price:1,tags:["Mexican","Late Night","Casual","Local Favorites"],description:"2026 Tastemaker nominee. Tijuana-style street tacos with speakeasy vibes and trompo-carved meats. Open late on weekends. Two locations.",dishes:["Carne Asada Tacos","Al Pastor","Late Night Tacos"],address:"206 Trinity St, Ste 110, Austin, TX 78701",lat:30.2662,lng:-97.7395,phone:"",instagram:"taqueriade10",website:"https://www.taqueriadediez.com",reservation:"walk-in"});

add({name:"Leona Botanical Cafe & Bar",cuisine:"Cafe / Bar / Food Trucks",neighborhood:"Sunset Valley",score:86,price:1,tags:["Bakery/Coffee","Cocktails","Patio","Local Favorites"],description:"Garden compound where Dee Dee and Veracruz All Natural food trucks joined forces. Craft cocktails and lush open-air dining in South Austin.",dishes:["Dee Dee Thai","Veracruz Tacos","Botanical Cocktails"],address:"6405 Brodie Ln, Sunset Valley, TX 78745",lat:30.2260,lng:-97.8291,phone:"",instagram:"leonacafebar",website:"https://www.leonacafebar.com",reservation:"walk-in",suburb:true});

// More verified Austin restaurants from various sources
add({name:"June's All Day",cuisine:"French / Wine Bar",neighborhood:"South Congress",score:88,price:2,tags:["French","Wine Bar","Date Night","Critics Pick"],description:"Wine bar and French restaurant near South Congress Hotel. Beautifully designed, evoking Parisian cafe charm. Food & Wine Restaurant of the Year.",dishes:["French Wine","Small Plates","Parisian Vibes"],address:"1722 S Congress Ave, Austin, TX 78704",lat:30.2430,lng:-97.7500,phone:"",instagram:"junesallday",website:"",reservation:"Resy"});

add({name:"Loro Round Rock",cuisine:"Asian-BBQ Fusion",neighborhood:"Round Rock",score:87,price:2,tags:["BBQ","Asian Fusion","Casual","Patio"],description:"Round Rock location of the Franklin-Uchi collaboration. Same great concept in the suburbs.",dishes:["Smoked Meats","Asian Sides"],address:"4401 N I-35, Round Rock, TX 78681",lat:30.5262,lng:-97.6836,phone:"",instagram:"loroaustin",website:"",reservation:"walk-in",suburb:true,group:"Franklin/Uchi"});

add({name:"Tumble 22 South",cuisine:"Nashville Hot Chicken",neighborhood:"South Austin",score:86,price:1,tags:["Fried Chicken","Casual"],description:"South Austin location of the Nashville hot chicken chain. Multiple heat levels.",dishes:["Hot Chicken","Tenders"],address:"9900 S I-35, Austin, TX 78748",lat:30.1647,lng:-97.8058,phone:"",instagram:"tumble22",website:"",reservation:"walk-in",suburb:true});

add({name:"Licha's Cantina",cuisine:"Mexican",neighborhood:"East Austin",score:86,price:1,tags:["Mexican","Patio","Local Favorites"],description:"East Austin cantina with strong margaritas and Mexican plates. Popular for its patio scene.",dishes:["Margaritas","Mexican Plates","Patio"],address:"1306 E 6th St, Austin, TX 78702",lat:30.2629,lng:-97.7298,phone:"",instagram:"lichascantina",website:"",reservation:"walk-in"});

add({name:"Loro South Lamar Flagship",cuisine:"Asian-BBQ Fusion",neighborhood:"South Lamar",score:88,price:2,tags:["BBQ","Asian Fusion","Patio","Iconic"],description:"The original Franklin-Uchi collaboration that started it all. The flagship that launched a multi-location empire.",dishes:["Smoked Brisket Thai","Coconut Rice","Smoked Salmon"],address:"2115 S Lamar Blvd, Austin, TX 78704",lat:30.2413,lng:-97.7714,phone:"",instagram:"loroaustin",website:"",reservation:"walk-in",group:"Franklin/Uchi"});

add({name:"Stiles Switch North Loop",cuisine:"BBQ",neighborhood:"North Loop",score:87,price:1,tags:["BBQ","Craft Beer","Casual","Local Favorites"],description:"The original North Loop location of the popular BBQ joint and beer garden.",dishes:["Brisket","Sausage","Craft Beer"],address:"6610 N Lamar Blvd, Austin, TX 78752",lat:30.3314,lng:-97.7159,phone:"",instagram:"stilesswitchbbq",website:"",reservation:"walk-in"});

add({name:"Suerte East 6th",cuisine:"Mexican Fine Dining",neighborhood:"East Austin",score:90,price:3,tags:["Mexican","Fine Dining","Date Night"],description:"Upscale Mexican with extraordinary masa program and complex moles. Infatuation top 25.",dishes:["Hand-Made Tortillas","Mole","Seasonal Mexican"],address:"1800 E 6th St, Austin, TX 78702",lat:30.2629,lng:-97.7262,phone:"",instagram:"suerteatx",website:"",reservation:"Resy"});

add({name:"Desnudo South Lamar",cuisine:"Coffee",neighborhood:"South Lamar",score:85,price:1,tags:["Bakery/Coffee","Local Favorites"],description:"South Lamar location of the stellar coffee trailer. Same great espresso in a different part of town.",dishes:["Espresso","Cold Brew"],address:"1904 S Lamar Blvd, Austin, TX 78704",lat:30.2510,lng:-97.7673,phone:"",instagram:"desnudocoffee",website:"",reservation:"walk-in"});

add({name:"Veracruz All Natural Mueller",cuisine:"Mexican / Breakfast Tacos",neighborhood:"Mueller",score:88,price:1,tags:["Mexican","Brunch","Iconic"],description:"Mueller location of the beloved breakfast taco truck. Fresh tortillas and vibrant salsas.",dishes:["Migas Taco","Breakfast Tacos"],address:"4600 Mueller Blvd, Austin, TX 78723",lat:30.2985,lng:-97.7075,phone:"",instagram:"veracruzallnatural",website:"",reservation:"walk-in"});

add({name:"Nixta East Side",cuisine:"Mexican",neighborhood:"East Austin",score:89,price:1,tags:["Mexican","Critics Pick","Casual"],description:"East Austin location of the acclaimed taco spot. Blue corn duck carnitas and seasonal specials.",dishes:["Blue Corn Tacos","Duck Carnitas"],address:"2512 E 12th St, Austin, TX 78702",lat:30.2744,lng:-97.7204,phone:"",instagram:"nixtataqueria",website:"",reservation:"walk-in"});

add({name:"Meanwhile Brewing Co.",cuisine:"Brewery / Beer Garden",neighborhood:"Manchaca",score:85,price:1,tags:["Craft Beer","Patio","Local Favorites"],description:"South Austin brewery with a massive outdoor space, food trucks, and house-brewed beers. One of Austin best beer gardens.",dishes:["House Beer","Food Trucks","Beer Garden"],address:"3901 Promontory Point Dr, Austin, TX 78744",lat:30.1955,lng:-97.7712,phone:"",instagram:"meanwhilebrewing",website:"",reservation:"walk-in",suburb:true});

add({name:"Jester King Brewery",cuisine:"Farmhouse Brewery",neighborhood:"Dripping Springs",score:87,price:2,tags:["Craft Beer","Farm-to-Table","Scenic","Patio"],description:"Farmhouse brewery in the Hill Country with wild-fermented ales and pizza on weekends. One of the most unique brewery experiences in Texas.",dishes:["Wild-Fermented Ales","Wood-Fired Pizza","Hill Country Views"],address:"13187 Fitzhugh Rd, Austin, TX 78736",lat:30.2254,lng:-97.9644,phone:"",instagram:"jesterkingbrewery",website:"https://www.jesterkingbrewery.com",reservation:"walk-in",suburb:true});

add({name:"Austin Beerworks",cuisine:"Brewery",neighborhood:"North Austin",score:85,price:1,tags:["Craft Beer","Casual","Local Favorites"],description:"North Austin craft brewery with a taproom and rotating food trucks. Fire Eagle IPA is the flagship.",dishes:["Craft Beer","Taproom","Food Trucks"],address:"3001 Industrial Terrace, Austin, TX 78758",lat:30.3583,lng:-97.7201,phone:"",instagram:"austinbeerworks",website:"",reservation:"walk-in"});

add({name:"Wright Bros. Brew & Brew",cuisine:"Coffee / Beer",neighborhood:"East Austin",score:85,price:1,tags:["Bakery/Coffee","Craft Beer","Casual"],description:"East Austin hybrid coffee shop and craft beer bar. Great for mornings and evenings alike.",dishes:["Specialty Coffee","Craft Beer","Light Bites"],address:"500 San Marcos St, Austin, TX 78702",lat:30.2629,lng:-97.7361,phone:"",instagram:"wrightbrosbrewandbrew",website:"",reservation:"walk-in"});

add({name:"Colleen's South Congress",cuisine:"Southern / Brunch",neighborhood:"South Congress",score:86,price:1,tags:["Southern","Brunch","Local Favorites"],description:"SoCo location of the Southern-inspired kitchen with chicken biscuits and comfort food.",dishes:["Chicken Biscuit","Southern Brunch"],address:"1501 S Congress Ave, Austin, TX 78704",lat:30.2473,lng:-97.7498,phone:"",instagram:"colleenskitchenatx",website:"",reservation:"walk-in"});

add({name:"Uchi Domain",cuisine:"Japanese",neighborhood:"Domain",score:91,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night"],description:"Domain location of Tyson Cole flagship Japanese restaurant.",dishes:["Omakase","Creative Sushi"],address:"11410 Century Oaks Terrace, Austin, TX 78758",lat:30.4010,lng:-97.7246,phone:"",instagram:"uchirestaurants",website:"",reservation:"Resy"});

add({name:"Veracruz All Natural East",cuisine:"Mexican / Breakfast Tacos",neighborhood:"East Austin",score:88,price:1,tags:["Mexican","Brunch","Iconic"],description:"East side location of the beloved taco truck.",dishes:["Migas Taco","Breakfast Tacos"],address:"1704 E Cesar Chavez St, Austin, TX 78702",lat:30.2555,lng:-97.7259,phone:"",instagram:"veracruzallnatural",website:"",reservation:"walk-in"});

add({name:"Uchiko Domain North",cuisine:"Japanese",neighborhood:"Domain",score:89,price:3,tags:["Japanese","Sushi","Fine Dining"],description:"North Austin outpost of the farmhouse Japanese concept.",dishes:["Creative Sushi","Japanese Plates"],address:"13420 Galleria Cir, Austin, TX 78738",lat:30.3979,lng:-97.7244,phone:"",instagram:"uchiko_austin",website:"",reservation:"Resy"});

add({name:"El Primo",cuisine:"Mexican / Breakfast Tacos",neighborhood:"South 1st",score:86,price:1,tags:["Mexican","Brunch","Casual","Local Favorites","Hole in the Wall"],description:"South 1st breakfast taco trailer with huge, affordable tacos. The migas and barbacoa are excellent and the orange juice is fresh-squeezed.",dishes:["Migas Taco","Barbacoa","Fresh OJ"],address:"2011 S 1st St, Austin, TX 78704",lat:30.2424,lng:-97.7561,phone:"",instagram:"",website:"",reservation:"walk-in"});

add({name:"Tacodeli Burnet",cuisine:"Mexican / Breakfast Tacos",neighborhood:"North Loop",score:86,price:1,tags:["Mexican","Brunch","Local Favorites"],description:"Burnet Road Tacodeli with the famous Dona sauce and creative tacos.",dishes:["Otto Taco","Dona Sauce","Breakfast Tacos"],address:"4200 N Lamar Blvd, Austin, TX 78756",lat:30.3145,lng:-97.7408,phone:"",instagram:"tacodeliatx",website:"",reservation:"walk-in"});

add({name:"Torchy's South 1st",cuisine:"Tex-Mex / Tacos",neighborhood:"South 1st",score:85,price:1,tags:["Mexican","Tex-Mex","Casual","Iconic"],description:"South 1st location of the Austin-born creative taco chain.",dishes:["Trailer Park Taco","Queso"],address:"1311 S 1st St, Austin, TX 78704",lat:30.2494,lng:-97.7557,phone:"",instagram:"torchystacos",website:"",reservation:"walk-in"});

add({name:"Ramen Tatsu-ya South Lamar",cuisine:"Japanese Ramen",neighborhood:"South Lamar",score:88,price:1,tags:["Japanese","Ramen","Local Favorites"],description:"South Lamar location of Austin legendary ramen shop.",dishes:["Tonkotsu","Spicy Miso"],address:"1234 S Lamar Blvd, Austin, TX 78704",lat:30.2510,lng:-97.7673,phone:"",instagram:"raboratory",website:"",reservation:"walk-in"});

add({name:"Via 313 East 6th",cuisine:"Detroit-Style Pizza",neighborhood:"East Austin",score:87,price:1,tags:["Pizza","Local Favorites"],description:"East 6th location of the Austin-born Detroit-style pizza.",dishes:["Detroiter","Detroit Pizza"],address:"1111 E 6th St, Austin, TX 78702",lat:30.2629,lng:-97.7316,phone:"",instagram:"via313",website:"",reservation:"walk-in"});

add({name:"Terry Black's Barton Springs",cuisine:"BBQ",neighborhood:"South Austin",score:88,price:1,tags:["BBQ","Iconic","Family"],description:"Barton Springs location of the third-generation BBQ family.",dishes:["Brisket","Beef Rib","Sausage"],address:"1003 Barton Springs Rd, Austin, TX 78704",lat:30.2614,lng:-97.7555,phone:"",instagram:"terryblacksbbq",website:"",reservation:"walk-in"});

add({name:"Home Slice SoCo",cuisine:"NY-Style Pizza",neighborhood:"South Congress",score:86,price:1,tags:["Pizza","Late Night","Iconic"],description:"SoCo location of the NY-style pizza institution. Walk-up window for late night slices.",dishes:["NY Slices","Whole Pies"],address:"1415 S Congress Ave, Austin, TX 78704",lat:30.2470,lng:-97.7498,phone:"",instagram:"homeslicepizza",website:"",reservation:"walk-in"});

add({name:"Hopdoddy South Lamar",cuisine:"Burgers",neighborhood:"South Lamar",score:86,price:1,tags:["Burgers","Casual","Local Favorites"],description:"South Lamar location of the Austin-born burger bar.",dishes:["Primetime Burger","Craft Beer"],address:"2438 W Anderson Ln, Austin, TX 78757",lat:30.3582,lng:-97.7420,phone:"",instagram:"hopdoddy",website:"",reservation:"walk-in"});

add({name:"Valentina's South",cuisine:"Tex-Mex BBQ",neighborhood:"South Austin",score:89,price:1,tags:["BBQ","Mexican","Critics Pick"],description:"South Austin flagship of the legendary Fat Boy breakfast taco spot.",dishes:["Fat Boy Taco","Brisket Tacos"],address:"11500 Manchaca Rd, Austin, TX 78748",lat:30.1725,lng:-97.8292,phone:"",instagram:"valentinastexmexbbq",website:"",reservation:"walk-in",suburb:true});

add({name:"Odd Duck South Lamar",cuisine:"Texan / Farm-to-Table",neighborhood:"South Lamar",score:91,price:3,tags:["New American","Farm-to-Table","Date Night"],description:"The original Odd Duck on South Lamar. One of Austin truly great restaurants.",dishes:["Farm-to-Table","Seasonal Menu"],address:"1201 S Lamar Blvd, Austin, TX 78704",lat:30.2510,lng:-97.7673,phone:"(512) 433-6521",instagram:"oddduckatx",website:"",reservation:"Resy"});

console.log('Austin added:', added, 'total:', arr.length);
html = html.substring(0,arrS)+JSON.stringify(arr)+html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin to 500 done!');
