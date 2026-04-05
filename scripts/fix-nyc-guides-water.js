const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// =====================================================
// 1. FIX ROAD TRIPS — insert NYC trips after the array opening
// =====================================================
const nycTrips = [
  `{title:'NYC → Hudson Valley',emoji:'🍂',distance:'90 mi · 1.5hr',desc:'Wine country, farm-to-table dining, and stunning Hudson River views -- New York\\'s most scenic day trip.',cities:['New York','Cold Spring','Beacon','Hudson'],stops:['DIA Beacon (massive modern art museum)','Cold Spring village for antique shopping','Fish & Game in Hudson for dinner'],food:'DIA Beacon cafe, Valley restaurant, Fish & Game, Kitty\\'s Market',tip:'Fall foliage season (October) is peak. Take Metro-North from Grand Central for a car-free option.',tags:['Hudson Valley','Art','Farm-to-Table']}`,
  `{title:'NYC → Montauk',emoji:'🏖',distance:'120 mi · 2.5hr',desc:'The end of Long Island -- surf culture, lobster rolls, and the most beautiful beaches on the East Coast.',cities:['New York','Hamptons','Montauk'],stops:['Nick & Toni\\'s in East Hampton','Ditch Plains beach for surfing','Duryea\\'s Lobster Deck at sunset'],food:'Duryea\\'s, The Lobster Roll (LUNCH), Crow\\'s Nest, Ruschmeyer\\'s',tip:'Take the LIRR Cannonball express in summer -- faster than driving. Duryea\\'s sunset is unforgettable.',tags:['Beach','Seafood','Summer']}`,
  `{title:'NYC → Philadelphia',emoji:'🔔',distance:'95 mi · 2hr',desc:'Two great food cities connected by one Amtrak ride. Philly\\'s food scene has exploded.',cities:['New York','Philadelphia'],stops:['Reading Terminal Market','Zahav for modern Israeli','Federal Donuts for fried chicken and donuts'],food:'Zahav, Vernick Fish, Kalaya Thai, Pat\\'s vs Geno\\'s cheesesteak debate',tip:'Take Amtrak -- 90 minutes center to center. Reading Terminal Market is essential.',tags:['Food City','Day Trip','Amtrak']}`,
  `{title:'NYC → New Haven Pizza Trail',emoji:'🍕',distance:'80 mi · 1.5hr',desc:'The holy grail of American pizza -- New Haven\\'s coal-fired apizza is a pilgrimage for any pizza lover.',cities:['New York','New Haven'],stops:['Frank Pepe\\'s for the original white clam pie','Sally\\'s Apizza for comparison','Modern Apizza for the Italian Bomb'],food:'Frank Pepe\\'s, Sally\\'s Apizza, Modern Apizza, BAR for late night',tip:'Go on a weekday to avoid 2-hour waits. Do Pepe\\'s AND Sally\\'s -- the rivalry is real and both are incredible.',tags:['Pizza','Day Trip','Iconic']}`,
  `{title:'NYC → Catskills',emoji:'🏕',distance:'115 mi · 2hr',desc:'Mountains, hiking, and a booming farm-to-table scene -- NYC\\'s weekend escape for nature and great food.',cities:['New York','Woodstock','Phoenicia','Livingston Manor'],stops:['Silvia in Woodstock for Italian dinner','Peekamoose Restaurant in Big Indian','Catskill Brewery in Livingston Manor'],food:'Silvia, Peekamoose, The Arnold House, Phoenicia Diner',tip:'Phoenicia Diner is the ultimate brunch stop. Book a cabin on Airbnb and make it a weekend.',tags:['Mountains','Nature','Weekend Getaway']}`,
];

// Insert after 'const ROAD_TRIPS = ['
const rtIdx = html.indexOf('const ROAD_TRIPS = [');
const insertPoint = rtIdx + 'const ROAD_TRIPS = ['.length;
html = html.substring(0, insertPoint) + '\n  ' + nycTrips.join(',\n  ') + ',' + html.substring(insertPoint);
console.log('Added', nycTrips.length, 'NYC road trips');

// =====================================================
// 2. FIX TRAVEL PLANS — insert NYC travel plans
// =====================================================
const nycPlans = [
  `{title:'NYC Bachelorette Weekend',duration:'3 Days',cities:['New York'],desc:'Rooftop cocktails at Westlight, brunch at Sunday in Brooklyn, dinner at Carbone, dancing at Marquee.',tags:['NYC','Celebration','Nightlife']}`,
  `{title:'NYC First Timer Guide',duration:'4 Days',cities:['New York'],desc:'Walk the Brooklyn Bridge, pizza at Joe\\'s, Met Museum, cocktails at Death & Co, Broadway show, Chinatown dim sum.',tags:['NYC','Tourists','Iconic']}`,
  `{title:'NYC Foodies Weekend',duration:'3 Days',cities:['New York'],desc:'Russ & Daughters for brunch, Dhamaka for dinner, Death & Co for cocktails, Smorgasburg Saturday, and a Michelin tasting menu.',tags:['NYC','Fine Dining','Food']}`,
  `{title:'NYC Jazz & Cocktails',duration:'2 Days',cities:['New York'],desc:'Village Vanguard for a set, cocktails at Attaboy, Smalls Jazz Club late night, brunch at Balthazar.',tags:['NYC','Jazz','Cocktails']}`,
];

const tpIdx = html.indexOf('const TRAVEL_PLANS = [');
const tpInsert = tpIdx + 'const TRAVEL_PLANS = ['.length;
html = html.substring(0, tpInsert) + '\n  ' + nycPlans.join(',\n  ') + ',' + html.substring(tpInsert);
console.log('Added', nycPlans.length, 'NYC travel plans');

// =====================================================
// 3. ADD WATER TOURS, SUNSET CRUISES, HARBOR ACTIVITIES to NYC_DATA
// =====================================================
const nycIdx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', nycIdx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));
const maxId = Math.max(...arr.map(r=>r.id));
const existingNames = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = maxId + 1;

const waterActivities = [
  {id:nextId++,name:"Circle Line Sightseeing Cruises",phone:"(212) 563-3200",cuisine:"Entertainment",neighborhood:"Midtown West",score:84,price:2,tags:["Date Night","Local Favorites","Casual","Patio"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"NYC's classic harbor cruise since 1945 — full island circumnavigation, sunset cruises, and holiday specials with Statue of Liberty and skyline views from the water",dishes:["Sunset Cruise","Full Island Cruise","Harbor Lights"],address:"Pier 83, W 42nd St, New York, NY 10036",hours:"Cruises daily, times vary by season",lat:40.7627,lng:-73.9993,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"circlelineny",website:"https://www.circleline.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Classic Harbor Line",phone:"(212) 627-1825",cuisine:"Entertainment",neighborhood:"Chelsea",score:85,price:2,tags:["Date Night","Cocktails","Exclusive","Patio","Celebrations"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Elegant yacht cruises on vintage 1920s-style schooners and yachts with wine, cheese, and craft cocktail options — the most romantic way to see the NYC skyline",dishes:["Wine & Cheese Cruise","Sunset Sail","Brunch Cruise"],address:"Chelsea Piers, Pier 62, New York, NY 10011",hours:"Cruises daily, schedule varies",lat:40.7461,lng:-74.0084,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"classichaborline",website:"https://www.sail-nyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Manhattan by Sail",phone:"(212) 619-6900",cuisine:"Entertainment",neighborhood:"Financial District",score:84,price:2,tags:["Date Night","Cocktails","Patio","Celebrations"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Sail NYC harbor on a historic 1885 schooner with BYOB sunset sails, craft beer sails, and daytime Statue of Liberty cruises from Pier 6 Brooklyn Bridge Park",dishes:["BYOB Sunset Sail","Craft Beer Sail","Day Sail"],address:"Pier 6, Brooklyn Bridge Park, Brooklyn, NY 11201",hours:"Sails daily Apr-Nov",lat:40.6937,lng:-73.9993,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"manhattanbysail",website:"https://www.manhattanbysail.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"NYC Ferry",phone:"",cuisine:"Entertainment",neighborhood:"Multiple Stops",score:83,price:1,tags:["Local Favorites","Casual","Patio","Date Night"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"NYC's commuter ferry system doubles as a scenic waterfront experience — $4 rides with stunning skyline views connecting Manhattan, Brooklyn, Queens, and the Bronx",dishes:["$4 Rides","Snack Bar","Multiple Routes"],address:"Multiple stops (Wall St, DUMBO, Williamsburg, Astoria, etc)",hours:"Daily, routes vary",lat:40.7024,lng:-73.9967,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"nycferry",website:"https://www.ferry.nyc",suburb:false,reserveUrl:"",menuUrl:"",res_tier:2},
  {id:nextId++,name:"Bateaux New York Dinner Cruise",phone:"(866) 817-3463",cuisine:"Entertainment",neighborhood:"Chelsea",score:82,price:3,tags:["Date Night","Fine Dining","Celebrations","Cocktails","Exclusive"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Glass-enclosed luxury dinner cruise around Manhattan with a 3-course prix fixe menu, live music, and floor-to-ceiling views of the skyline from the water",dishes:["3-Course Dinner","Live Music","Champagne"],address:"Chelsea Piers, Pier 61, New York, NY 10011",hours:"Dinner cruises nightly",lat:40.7461,lng:-74.0084,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"babornyc",website:"https://www.bateauxnewyork.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Hornblower Cruises",phone:"(646) 576-4060",cuisine:"Entertainment",neighborhood:"Financial District",score:82,price:2,tags:["Date Night","Cocktails","Celebrations","Patio","Brunch"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Harbor cruises from Pier 15 with brunch, lunch, dinner, and cocktail sail options — live DJ sets on evening cruises with Statue of Liberty views",dishes:["Brunch Cruise","Cocktail Cruise","Dinner Cruise"],address:"Pier 15, 78 South St, New York, NY 10038",hours:"Cruises daily",lat:40.7061,lng:-74.0030,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"cityexperiences",website:"https://www.cityexperiences.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Pilot Brooklyn",phone:"(718) 786-5506",cuisine:"Bar",neighborhood:"Brooklyn Bridge Park",score:84,price:2,tags:["Cocktails","Date Night","Patio","Local Favorites"],indicators:["outdoor-seating"],hh:"",reservation:"walk-in",awards:"",description:"Floating oyster bar on a vintage 1924 pilot boat docked in Brooklyn Bridge Park — craft cocktails, fresh oysters, and Manhattan skyline views from the deck",dishes:["Oysters","Craft Cocktails","Seafood"],address:"Pier 6, Brooklyn Bridge Park, Brooklyn, NY 11201",hours:"Thu-Sun 4:00PM-10:00PM (seasonal)",lat:40.6937,lng:-73.9993,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"pilotbrooklyn",website:"https://www.pilotbrooklyn.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Grand Banks",phone:"(212) 660-6312",cuisine:"Bar",neighborhood:"Tribeca",score:85,price:2,tags:["Cocktails","Date Night","Patio","Seafood","Local Favorites"],indicators:["outdoor-seating"],hh:"",reservation:"walk-in",awards:"",description:"Oyster bar and cocktail lounge on a 1942 wooden schooner docked at Pier 25 in Tribeca — one of NYC's most unique outdoor drinking experiences",dishes:["Oysters","Lobster Roll","Rosé"],address:"Pier 25, Hudson River Park, New York, NY 10013",hours:"Mon-Sun 12:00PM-11:00PM (seasonal May-Oct)",lat:40.7205,lng:-74.0137,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"grandbanksnyc",website:"https://www.grandbanks.org",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Manhattan Kayak + SUP",phone:"(212) 924-1788",cuisine:"Entertainment",neighborhood:"Chelsea",score:82,price:1,tags:["Eat & Play","Casual","Local Favorites","Patio"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Kayak and stand-up paddleboard rentals on the Hudson River at Pier 84 — paddle past the Intrepid with the Midtown skyline as your backdrop",dishes:["Kayak Rental","SUP Rental","Sunset Paddle"],address:"Pier 84, 555 12th Ave, New York, NY 10036",hours:"Daily 9AM-7PM (seasonal)",lat:40.7650,lng:-73.9997,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"manhattankayak",website:"https://www.manhattankayak.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:2},
  {id:nextId++,name:"Free Kayaking at Pier 26",phone:"",cuisine:"Entertainment",neighborhood:"Tribeca",score:83,price:1,tags:["Local Favorites","Casual","Patio"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"FREE walk-up kayaking on the Hudson River at Pier 26 — no experience needed, life jackets provided, 20-minute sessions with skyline views. The best free activity in NYC.",dishes:["Free Kayaking","Walk-Up","20-Min Sessions"],address:"Pier 26, Hudson River Park, New York, NY 10013",hours:"Sat-Sun 9AM-4PM, select weekdays (seasonal May-Oct)",lat:40.7210,lng:-74.0133,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"downtownboathouse",website:"https://www.downtownboathouse.org",suburb:false,reserveUrl:"",menuUrl:"",res_tier:1},
  {id:nextId++,name:"The River Cafe Sunset",phone:"(718) 522-5200",cuisine:"New American",neighborhood:"DUMBO",score:90,price:3,tags:["Date Night","Celebrations","Fine Dining","Cocktails","Patio"],indicators:["outdoor-seating"],hh:"",reservation:"OpenTable",awards:"",description:"The most romantic sunset view in NYC — dine waterside under the Brooklyn Bridge watching the Manhattan skyline light up. Book a window table for golden hour.",dishes:["Tasting Menu","Lobster","Chocolate Marquise"],address:"1 Water St, Brooklyn, NY 11201",hours:"Mon-Sat 5:30PM-10PM; Sun 11AM-2PM, 5:30PM-10PM",lat:40.7017,lng:-73.9932,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"rivercafebk",website:"https://www.rivercafe.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Governors Island Ferry & Bike",phone:"",cuisine:"Entertainment",neighborhood:"New York Harbor",score:86,price:1,tags:["Eat & Play","Casual","Local Favorites","Patio","Dog Friendly"],indicators:["outdoor-seating","pet-friendly"],hh:"",reservation:"walk-in",awards:"",description:"Take the 7-minute ferry to a car-free island, rent bikes, explore art installations, ride slides on The Hills, and picnic with Statue of Liberty views — $4 roundtrip",dishes:["Bike Rental","The Hills","Art Installations"],address:"Battery Maritime Building, 10 South St, New York, NY 10004",hours:"Ferries daily 10AM-6PM (May-Oct)",lat:40.7013,lng:-74.0130,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"governorsisland",website:"https://www.govisland.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:2},
];

let addedCount = 0;
for(const spot of waterActivities) {
  if(!existingNames.has(spot.name.toLowerCase())) {
    arr.push(spot);
    existingNames.add(spot.name.toLowerCase());
    addedCount++;
  } else {
    console.log('SKIP:', spot.name);
  }
}
console.log('Added', addedCount, 'water/sunset/harbor activities');
console.log('NYC total:', arr.length);

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
