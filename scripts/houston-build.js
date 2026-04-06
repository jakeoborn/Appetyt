const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Get existing HOUSTON_DATA
const hdIdx = html.indexOf('const HOUSTON_DATA');
const arrS = html.indexOf('[', hdIdx);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let houstonArr = JSON.parse(html.substring(arrS, arrE));
console.log('Existing Houston spots:', houstonArr.length);

// 2. Add more restaurants + attractions
const maxId = Math.max(...houstonArr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(houstonArr.map(r=>r.name.toLowerCase()));

const newSpots = [
  // RESTAURANTS
  {name:"Pappas Bros. Steakhouse",cuisine:"Steakhouse",neighborhood:"Galleria",score:93,price:4,tags:["Steakhouse","Date Night","Fine Dining","Celebrations"],description:"The best steakhouse in Houston and a genuine contender for best in Texas. The dry-aged prime cuts are impeccable, the lobster bisque is a starter that could be a main, and the old-school clubhouse atmosphere makes every dinner feel like an event. The Pappas family takes steak very seriously.",dishes:["Dry-Aged Prime Bone-In Ribeye","Lobster Bisque","Creamed Spinach"],address:"5839 Westheimer Rd, Houston, TX 77057",lat:29.7367,lng:-95.4888,instagram:"pappasbros",website:"https://www.pappasbros.com",reservation:"OpenTable",hh:""},
  {name:"Underbelly Hospitality / Georgia James",cuisine:"Texas BBQ / Whole Animal",neighborhood:"East Downtown / EaDo",score:94,price:3,tags:["BBQ","Critics Pick","Local Favorites","Date Night"],description:"Chris Shepherd whole-animal BBQ restaurant that might be the most important restaurant in Houston. The prime brisket is smoked over Texas post oak and served with a simplicity that lets the craft speak for itself. Georgia James earned a James Beard Award and redefined what Houston BBQ could be.",dishes:["Prime Brisket","Beef Ribs","Smoked Sausage"],address:"1100 W Dallas St, Houston, TX 77019",lat:29.7575,lng:-95.3776,instagram:"georgiajamesbbq",website:"https://www.georgiajamesbbq.com",reservation:"Resy",hh:"",awards:"James Beard Award"},
  {name:"Xochi",cuisine:"Oaxacan Mexican",neighborhood:"Downtown",score:93,price:3,tags:["Mexican","Fine Dining","Critics Pick","Date Night"],description:"Hugo Ortega love letter to Oaxacan cuisine inside the Marriott Marquis, and it is one of the most important Mexican restaurants in America. The mole negro takes days to make and tastes like it. The chocolate desserts are world-class. Houston has no better ambassador for the depth of Mexican regional cooking.",dishes:["Mole Negro","Cacao Nib Crusted Lamb","Chocolate Dessert Tasting"],address:"1777 Walker St, Houston, TX 77010",lat:29.7528,lng:-95.3585,instagram:"xochihouston",website:"https://www.xochihouston.com",reservation:"OpenTable",hh:"",awards:"James Beard Semifinalist"},
  {name:"Killen's BBQ",cuisine:"Texas BBQ",neighborhood:"Pearland",score:95,price:1,tags:["BBQ","Local Favorites","Iconic","Hole in the Wall"],indicators:["hole-in-the-wall"],description:"Ronnie Killen turned a Pearland strip mall into one of the most celebrated BBQ joints in Texas. The beef ribs are massive, mahogany-barked monuments to the craft. The brisket is prime and the burnt ends are life-changing. Worth every minute of the line, which can stretch past two hours on weekends.",dishes:["Beef Ribs","Prime Brisket","Burnt Ends"],address:"3613 E Broadway St, Pearland, TX 77581",lat:29.5583,lng:-95.2728,instagram:"killensbbq",website:"https://www.killensbbq.com",reservation:"walk-in",hh:"",suburb:true},
  {name:"Uchi Houston",cuisine:"Japanese",neighborhood:"Montrose",score:94,price:3,tags:["Japanese","Sushi","Date Night","Fine Dining","Critics Pick"],description:"Tyson Cole Austin-born Japanese sensation brought to Montrose and it fits perfectly. The cool Montrose bungalow setting, omakase-level fish quality, and creative hot and cold tastings make it the best Japanese restaurant in Houston. The maguro sashimi with goat cheese and Asian pear is a signature.",dishes:["Maguro Sashimi","Hama Chili","Wagyu Tataki"],address:"904 Westheimer Rd, Houston, TX 77006",lat:29.7447,lng:-95.3887,instagram:"uchihouston",website:"https://www.uchirestaurants.com/uchi/houston",reservation:"Resy",hh:""},
  {name:"Nancy's Hustle",cuisine:"New American",neighborhood:"East Downtown / EaDo",score:92,price:2,tags:["Date Night","Local Favorites","Critics Pick","Casual"],description:"The neighborhood restaurant Houston has been waiting for -- unpretentious, inventive, and genuinely cool. The grilled bread with whipped ricotta is the most ordered dish in EaDo, the pasta changes nightly, and the natural wine list is one of the best in the city. Walk-ins only, which adds to the magic.",dishes:["Grilled Bread with Ricotta","Handmade Pasta","Charred Carrots"],address:"2704 Polk St, Houston, TX 77003",lat:29.7440,lng:-95.3517,instagram:"nancyshustle",website:"https://www.nancyshustle.com",reservation:"walk-in",hh:""},
  {name:"The Breakfast Klub",cuisine:"Southern Breakfast",neighborhood:"Midtown",score:90,price:1,tags:["Brunch","Local Favorites","Iconic","Casual"],description:"The most famous breakfast spot in Houston with a line that wraps around the building every weekend morning. The chicken and waffles are legendary -- the wings are perfectly crispy and the waffle is fluffy perfection. Katfish and grits is the sleeper order. The vibe is pure Houston community energy.",dishes:["Chicken and Waffles","Katfish and Grits","Wings and Waffles"],address:"3711 Travis St, Houston, TX 77002",lat:29.7440,lng:-95.3816,instagram:"thebreakfastklub",website:"https://www.thebreakfastklub.com",reservation:"walk-in",hh:""},
  {name:"Truth BBQ",cuisine:"Texas BBQ",neighborhood:"Heights",score:93,price:1,tags:["BBQ","Local Favorites","Critics Pick"],description:"Leonard Botello brought his Brenham BBQ operation to the Heights and immediately became one of the best BBQ joints in Houston. The brisket has a clean smoke ring and buttery texture, the ribs are competition-quality, and the banana pudding is transcendent. Opens at 11 and sells out daily.",dishes:["Prime Brisket","Pork Ribs","Banana Pudding"],address:"110 S Heights Blvd, Houston, TX 77007",lat:29.7714,lng:-95.3973,instagram:"truthbbq",website:"https://www.truthbbq.com",reservation:"walk-in",hh:""},
  {name:"Hay Merchant",cuisine:"Craft Beer / Gastropub",neighborhood:"Montrose",score:88,price:2,tags:["Casual","Local Favorites","Cocktails","Late Night"],description:"Chris Shepherd craft beer bar with 80 taps and a kitchen that takes bar food as seriously as fine dining. The burger is one of the best in Houston, the fried chicken is excellent, and the beer selection is the deepest in the city. The kind of bar where chefs eat after their shifts.",dishes:["Hay Merchant Burger","Fried Chicken","Poutine"],address:"1100 Westheimer Rd, Houston, TX 77006",lat:29.7450,lng:-95.3888,instagram:"haymerchant",website:"https://www.haymerchant.com",reservation:"walk-in",hh:""},
  {name:"Le Jardinier",cuisine:"French",neighborhood:"Museum District",score:91,price:3,tags:["French","Fine Dining","Date Night","Patio"],description:"Alain Verzeroli vegetable-forward French restaurant inside the Museum of Fine Arts Houston. The produce is treated with the reverence most restaurants reserve for wagyu, and the garden terrace is one of the most elegant dining settings in the city. A Michelin-level experience in Houston museum district.",dishes:["Seasonal Vegetable Tasting","Dover Sole","Garden Terrace Lunch"],address:"1180 Main St, Houston, TX 77002",lat:29.7246,lng:-95.3888,instagram:"lejardinierhouston",website:"https://www.lejardinier-houston.com",reservation:"Resy",hh:""},

  // TOURIST ATTRACTIONS
  {name:"Space Center Houston",cuisine:"Tourist Attraction",neighborhood:"Clear Lake",score:95,price:2,tags:["Tourist Attraction","Museum","Iconic","Family"],description:"The official visitor center of NASA Johnson Space Center and the only place on Earth where you can touch a real moon rock, see the actual Apollo 17 command module, and tour Mission Control. The tram tour to the real NASA facilities is the highlight. Allow a full day -- there is more here than you expect.",dishes:["Tram Tour to NASA","Apollo 17 Capsule","Moon Rock Touch"],address:"1601 E NASA Pkwy, Houston, TX 77058",lat:29.5519,lng:-95.0981,instagram:"spacecenterhou",website:"https://spacecenter.org",reservation:"walk-in",hh:"",reserveUrl:"https://spacecenter.org/tickets/",suburb:true},
  {name:"Houston Museum District",cuisine:"Tourist Attraction",neighborhood:"Museum District",score:93,price:1,tags:["Tourist Attraction","Museum","Art","Free"],description:"19 museums in a walkable district including the Museum of Fine Arts, Natural Science Museum, and the Menil Collection (free!). The Menil is one of the best free art museums in America. The MFAH Cullinan Hall is architecturally stunning. Houston punches way above its weight in culture.",dishes:["Menil Collection (Free)","Museum of Fine Arts","Natural Science Museum"],address:"Museum District, Houston, TX 77004",lat:29.7224,lng:-95.3901,instagram:"houstonmuseumdistrict",website:"https://www.houmuse.org",reservation:"walk-in",hh:"",reserveUrl:""},
  {name:"Buffalo Bayou Park",cuisine:"Tourist Attraction",neighborhood:"Montrose",score:90,price:1,tags:["Tourist Attraction","Park","Outdoor","Free"],description:"160 acres of urban parkland along the bayou with walking trails, kayak rentals, a dog park, and skyline views. The Johnny Steele Dog Park is one of the best in the country. Rent a kayak or take a sunset bike ride on the trails. Houston version of Central Park, but with better weather.",dishes:["Kayak Rental","Sunset Bike Ride","Johnny Steele Dog Park"],address:"1800 Allen Pkwy, Houston, TX 77019",lat:29.7620,lng:-95.3795,instagram:"buffalobayou",website:"https://buffalobayou.org",reservation:"walk-in",hh:"",reserveUrl:""},
  {name:"San Jacinto Monument",cuisine:"Tourist Attraction",neighborhood:"La Porte",score:87,price:1,tags:["Tourist Attraction","Landmark","Historic"],description:"The tallest monument column in the world -- 15 feet taller than the Washington Monument -- marking the site of the decisive 1836 battle for Texas independence. The observation deck has views for miles. The Battleship Texas sits adjacent (currently under restoration). A Texas history pilgrimage.",dishes:["Observation Deck","Battleground Tour","Museum"],address:"1 Monument Cir, La Porte, TX 77571",lat:29.7499,lng:-95.0810,instagram:"sanjacmonument",website:"https://www.sanjacinto-museum.org",reservation:"walk-in",hh:"",reserveUrl:"",suburb:true},
];

let added = 0;
newSpots.forEach(spot => {
  if(!existing.has(spot.name.toLowerCase())){
    spot.id = nextId++;
    spot.bestOf = spot.bestOf || [];
    spot.busyness = null;
    spot.waitTime = null;
    spot.popularTimes = null;
    spot.lastUpdated = null;
    spot.trending = false;
    spot.group = spot.group || '';
    spot.suburb = spot.suburb || false;
    spot.menuUrl = '';
    spot.res_tier = spot.price >= 3 ? 4 : 2;
    spot.indicators = spot.indicators || [];
    spot.awards = spot.awards || '';
    spot.phone = spot.phone || '';
    spot.reserveUrl = spot.reserveUrl || '';
    houstonArr.push(spot);
    added++;
  }
});
console.log('Added', added, 'new Houston spots. Total:', houstonArr.length);

// Write updated HOUSTON_DATA back
html = html.substring(0, arrS) + JSON.stringify(houstonArr) + html.substring(arrE);

// 3. Wire Houston into CITY_DATA
const cdIdx = html.indexOf("const CITY_DATA");
const cdClose = html.indexOf('};', cdIdx);
if(!html.substring(cdIdx, cdClose).includes("'Houston'")){
  const insertPoint = cdClose;
  html = html.substring(0, insertPoint) + "  'Houston': HOUSTON_DATA,\n" + html.substring(insertPoint);
  console.log('Wired Houston into CITY_DATA');
} else {
  console.log('Houston already in CITY_DATA');
}

// 4. Add Houston neighborhoods
const nhIdx = html.indexOf("const CITY_NEIGHBORHOODS = {");
if(nhIdx > -1 && !html.substring(nhIdx, nhIdx + 5000).includes("'Houston'")){
  const nhClose = html.indexOf('};', nhIdx);
  const houstonNeighborhoods = `
  'Houston':{
    'Montrose':{emoji:'🌈',vibe:'Houston most eclectic neighborhood -- vintage shops, third-wave coffee, dive bars, and some of the city best restaurants all on the same block.',bestFor:'Date Night, Cocktails, Casual, Brunch',knownFor:'Uchi Houston, Hay Merchant, Menil Collection, Westheimer Road',mustVisit:'Uchi, Nancy\\'s Hustle, Hay Merchant, Anvil Bar',tip:'Westheimer Road from Montrose to Shepherd is the main drag. Park once and walk.'},
    'Heights':{emoji:'🏡',vibe:'19th Street and White Oak have transformed into Houston walkable dining district. Bungalows and craftsman homes with chef-driven restaurants.',bestFor:'Brunch, Local Faves, Patio',knownFor:'19th Street shops, White Oak Music Hall, bungalow bars',mustVisit:'Truth BBQ, Coltivare, Revival Market, Eight Row Flint',tip:'Eight Row Flint does frozen margaritas and smoked meat tacos under a tin roof -- the most Houston patio experience possible.'},
    'East Downtown / EaDo':{emoji:'⚾',vibe:'The warehouse district around Minute Maid Park that has become Houston hottest dining corridor. Former industrial, now packed with chef-driven concepts.',bestFor:'BBQ, New American, Late Night',knownFor:'Georgia James, Nancy\\'s Hustle, 8th Wonder Brewery, Minute Maid Park',mustVisit:'Georgia James, Nancy\\'s Hustle, Rodeo Goat',tip:'Game day EaDo is electric. Nancy\\'s Hustle is walk-in only -- go early on weekdays.'},
    'Museum District':{emoji:'🎨',vibe:'19 museums in a walkable district with tree-lined streets and some of Houston most refined dining. Culture meets cuisine.',bestFor:'Museums, Fine Dining, Brunch',knownFor:'MFAH, Menil Collection, Natural Science Museum, Hermann Park',mustVisit:'Le Jardinier, Lucille\\'s, The Dunlavy',tip:'The Menil Collection is free and world-class. Le Jardinier terrace lunch is the most civilized meal in Houston.'},
    'Downtown':{emoji:'🏙️',vibe:'Houston central business district with theaters, sports venues, and an underground tunnel system connecting 95 blocks of restaurants and shops.',bestFor:'Steakhouses, Theater, Sports',knownFor:'Theater District, Minute Maid Park, Toyota Center, tunnels',mustVisit:'Xochi, Vic and Anthony\\'s, Potente',tip:'The downtown tunnel system has dozens of lunch spots that only office workers know about. Enter from any major building lobby.'},
    'Galleria':{emoji:'🛍️',vibe:'Houston upscale shopping and dining corridor anchored by the Galleria mall. Steakhouses, international cuisine, and the city best hotel bars.',bestFor:'Steakhouses, Shopping, Hotel Bars',knownFor:'The Galleria, Pappas Bros, Post Oak Blvd',mustVisit:'Pappas Bros Steakhouse, Nobu Houston, B&B Butchers',tip:'Post Oak Blvd is Houston answer to Rodeo Drive. Pappas Bros might be the best steakhouse in Texas.'},
    'Chinatown / Bellaire':{emoji:'🏮',vibe:'The largest and most authentic Chinatown in the American South. Vietnamese, Chinese, Korean, and pan-Asian restaurants that rival any coast.',bestFor:'Chinese, Vietnamese, Dim Sum, Cheap Eats',knownFor:'Bellaire Blvd, Crawfish & Noodles, dim sum halls',mustVisit:'Crawfish & Noodles, Mala Sichuan, Pho Saigon, Tiger Den',tip:'Bellaire Blvd from Beltway 8 to Gessner is 5 miles of Asian restaurants. Crawfish & Noodles Viet-Cajun crawfish changed Houston food forever.'},
  },`;
  html = html.substring(0, nhClose) + houstonNeighborhoods + '\n' + html.substring(nhClose);
  console.log('Added Houston neighborhoods');
}

// 5. Add Houston to CURATED_ACTIVITIES
const actIdx = html.indexOf("const CURATED_ACTIVITIES = {");
if(actIdx > -1 && !html.substring(actIdx, actIdx + 10000).includes("'houston'")){
  const actClose = html.indexOf('};', actIdx);
  const houstonActivities = `
  'houston': [
    {name:'Space Center Houston',category:'Museum',price:'From $30',rating:'4.7',reviews:'20K+',emoji:'🚀',url:'https://www.viator.com/Houston-attractions/Space-Center-Houston/d765-a12122?utm_source=appetyt&utm_medium=referral',desc:'Touch a moon rock, see Mission Control, tour NASA. Allow a full day.'},
    {name:'Houston Museum District Pass',category:'Museum',price:'From $25',rating:'4.8',reviews:'5K+',emoji:'🎨',url:'https://www.viator.com/Houston-tours/Museum-Tickets-and-Passes/d765-g25?utm_source=appetyt&utm_medium=referral',desc:'19 museums including MFAH and Natural Science. The Menil Collection is free.'},
    {name:'Houston Food Tour',category:'Food Tour',price:'From $65',rating:'4.8',reviews:'2K+',emoji:'🍖',url:'https://www.viator.com/Houston-tours/Food-Tours/d765-g6-c80?utm_source=appetyt&utm_medium=referral',desc:'BBQ, Tex-Mex, Vietnamese, and Gulf Coast seafood. Houston is America most diverse food city.'},
    {name:'Buffalo Bayou Kayak Tour',category:'Outdoor',price:'From $35',rating:'4.6',reviews:'1K+',emoji:'🛶',url:'https://www.viator.com/Houston-tours/Kayaking-Tours/d765-g61?utm_source=appetyt&utm_medium=referral',desc:'Paddle through downtown Houston on the bayou. Sunset tours are magical with skyline reflections.'},
    {name:'Galveston Island Day Trip',category:'Day Trip',price:'From $50',rating:'4.5',reviews:'3K+',emoji:'🏖️',url:'https://www.viator.com/Houston-tours/Day-Trips-and-Excursions/d765-g5?utm_source=appetyt&utm_medium=referral',desc:'Beach, Strand historic district, and seafood. 50 miles from Houston. The closest beach to the city.'},
    {name:'Houston Astros Game at Minute Maid Park',category:'Sports',price:'From $25',rating:'4.8',reviews:'10K+',emoji:'⚾',url:'https://www.viator.com/Houston-attractions/Minute-Maid-Park/d765-a17791?utm_source=appetyt&utm_medium=referral',desc:'Retractable roof stadium with a train on the outfield wall. The 2022 World Champs play here.'},
  ],`;
  html = html.substring(0, actClose) + houstonActivities + '\n' + html.substring(actClose);
  console.log('Added Houston curated activities');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Houston build complete!');
