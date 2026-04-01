const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
const match = html.match(/const DALLAS_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);

const maxId = Math.max(...data.map(r => r.id));
let nextId = maxId + 1;

function makeEntry(o) {
  return {
    id: nextId++, name:"", phone:"", cuisine:"", neighborhood:"", score:85, price:2,
    tags:[], indicators:[], hh:"", reservation:"walk-in", awards:"",
    description:"", dishes:[], address:"", hours:"",
    lat:0, lng:0, bestOf:[], busyness:null, waitTime:null,
    popularTimes:null, lastUpdated:null, trending:false, group:"",
    instagram:"", website:"", suburb:false, reserveUrl:"", menuUrl:"", res_tier:0,
    ...o
  };
}

// Coming soon restaurant cards
const comingSoon = [
  makeEntry({name:"Toca Madera",cuisine:"Modern Mexican Steakhouse",neighborhood:"East Quarter",score:90,price:4,tags:["Fine Dining","Mexican","Date Night","Cocktails","Exclusive"],indicators:["coming-soon"],reservation:"Resy",description:"Noble 33 sixth location. 13,221 sq ft, two bars, rooftop patio, private members speakeasy.",dishes:["Fire-Kissed Cauliflower","Wagyu Beef Tacos","Truffle Guacamole"],address:"2203 Commerce St, Dallas TX",lat:32.7813,lng:-96.7934,group:"Noble 33",instagram:"@tocamadera",website:"https://www.tocamadera.com",res_tier:4}),
  makeEntry({name:"Élephante",cuisine:"Coastal Italian",neighborhood:"Uptown",score:89,price:3,tags:["Italian","Date Night","Patio","Cocktails","Viral"],indicators:["coming-soon"],reservation:"Resy",description:"Coastal Italian from Wish You Were Here Group. 11,000 sq ft two-story at 23Springs.",dishes:["Burrata","Lobster Linguine","Branzino"],address:"2323 Cedar Springs Rd, Dallas TX",lat:32.8014,lng:-96.8012,group:"Wish You Were Here Group",instagram:"@elephantedallas",res_tier:3}),
  makeEntry({name:"Clark's Oyster Bar",cuisine:"Seafood / Raw Bar",neighborhood:"Uptown",score:90,price:3,tags:["Seafood","Oysters","Cocktails","Date Night","Brunch"],indicators:["coming-soon"],reservation:"Resy",description:"Austin seafood institution. Known for oysters, raw bar, and cult pan-roasted burgers.",dishes:["Raw Oysters","Pan-Roasted Burger","Lobster Roll"],address:"4155 Buena Vista St, Dallas TX",lat:32.8089,lng:-96.7985,instagram:"@clarksoysterbar",res_tier:3}),
  makeEntry({name:"Corsaire",cuisine:"Mediterranean",neighborhood:"Lower Greenville",score:88,price:3,tags:["Mediterranean","Date Night","Cocktails","Patio"],indicators:["coming-soon"],reservation:"Resy",description:"Mediterranean spice-trade concept from the Goodwins owners. North Africa, Spain, France, Turkey, Morocco.",dishes:["Spice-Trade Plates","Mezze","Grilled Lamb"],address:"3525 Greenville Ave, Dallas TX",lat:32.8284,lng:-96.7672,instagram:"@corsairedallas",res_tier:2}),
  makeEntry({name:"Molino Oloyo",cuisine:"Mexican Tasting Menu",neighborhood:"East Dallas",score:91,price:4,tags:["Fine Dining","Mexican","Exclusive","Date Night","Awards"],indicators:["coming-soon"],reservation:"Tock",description:"2023 James Beard semifinalist pop-up moving to permanent casita. Multi-course tasting menus and mezcaleria.",awards:"James Beard Semifinalist 2023",dishes:["Multi-Course Tasting","Mole Negro","Mezcal Cocktails"],address:"4422 Gaston Ave, Dallas TX",lat:32.7981,lng:-96.7713,instagram:"@molinooloyo",res_tier:4}),
  makeEntry({name:"Serritella Prime Italian",cuisine:"Italian Steakhouse",neighborhood:"East Dallas",score:90,price:4,tags:["Fine Dining","Italian","Steakhouse","Date Night","Speakeasy"],indicators:["coming-soon"],reservation:"Resy",description:"16,000 sq ft Italian steakhouse with hidden bar Cosa. Inspired by the Chicago original.",dishes:["Prime Steak","Handmade Pasta","Seafood Tower"],address:"1904 Skillman St, Dallas TX",lat:32.8015,lng:-96.7650,instagram:"@serritelladallas",res_tier:3}),
  makeEntry({name:"Punk Noir",cuisine:"Immersive Tasting Menu",neighborhood:"Turtle Creek",score:92,price:4,tags:["Fine Dining","Exclusive","Date Night","Awards"],indicators:["coming-soon"],reservation:"Tock",description:"20+ course immersive multi-room tasting from James Beard Award-winning chef RJ Cooper.",awards:"James Beard Award-winning Chef",dishes:["20-Course Tasting Menu"],address:"139 Turtle Creek Blvd, Dallas TX",lat:32.7993,lng:-96.8045,res_tier:5}),
  makeEntry({name:"Sant Ambroeus",cuisine:"Milanese / Italian",neighborhood:"Knox-Henderson",score:89,price:3,tags:["Italian","Brunch","Coffee","Date Night","Patio"],indicators:["coming-soon"],reservation:"Resy",description:"Italy-based contemporary Milanese dining. First Texas debut at The Knox Hotel.",dishes:["Risotto alla Milanese","Cotoletta","Tiramisu"],address:"4513 Travis St, Dallas TX",lat:32.8126,lng:-96.7935,group:"Sant Ambroeus Hospitality",instagram:"@santambroeus",res_tier:3}),
  makeEntry({name:"Brazamar",cuisine:"Mexican Grill",neighborhood:"Lower Greenville",score:86,price:2,tags:["Mexican","Casual","Cocktails","Patio"],indicators:["coming-soon"],description:"Mexican grill from the Chilangos group. Aguachile, tostadas, cocktails.",dishes:["Aguachile","Tostadas","Margaritas"],address:"3606 Greenville Ave, Dallas TX",lat:32.8290,lng:-96.7672,group:"Chilangos Group"}),
  makeEntry({name:"Neighborhood Sushi",cuisine:"Japanese / Sushi",neighborhood:"Uptown",score:87,price:3,tags:["Japanese","Sushi","Casual","Date Night"],indicators:["coming-soon"],reservation:"Resy",description:"Austin-born Japanese-inspired restaurant with Texas influences.",dishes:["Omakase","Creative Rolls","Sashimi"],address:"4216 Oak Lawn Ave, Dallas TX",lat:32.8070,lng:-96.8060,instagram:"@neighborhoodsushi",res_tier:2}),
  makeEntry({name:"La Lupita Taco & Mezcal",cuisine:"Mexican Taqueria & Mezcaleria",neighborhood:"Design District",score:88,price:2,tags:["Mexican","Cocktails","Live Music","Viral","Patio"],indicators:["coming-soon"],description:"Los Cabos taco destination. U.S. debut. 30-ft ceilings, mezzanine, live music stage.",dishes:["Tacos al Pastor","Mezcal Flights","Guacamole"],address:"1201 Oak Lawn Ave, Dallas TX",lat:32.7980,lng:-96.8130,group:"La Lupita Group",instagram:"@lalupitatacoandmezcal",website:"https://lalupitausa.com"}),
  makeEntry({name:"Ospi",cuisine:"Southern Italian",neighborhood:"Design District",score:87,price:3,tags:["Italian","Pizza","Date Night","Patio"],indicators:["coming-soon"],reservation:"Resy",description:"Southern Italian with Roman-style pizzas, seasonal pastas, sun-washed ambiance.",dishes:["Roman-Style Pizza","Seasonal Pasta","Burrata"],address:"Design District, Dallas TX",lat:32.7960,lng:-96.8150}),
  makeEntry({name:"Alara",cuisine:"Modern Mediterranean",neighborhood:"Design District",score:87,price:3,tags:["Mediterranean","Date Night","Cocktails"],indicators:["coming-soon"],reservation:"Resy",description:"Turkish-American chef Onur Akan. Modern Mediterranean with shareable plates and bold spices.",dishes:["Mezze Platter","Lamb Kofta","Turkish Coffee"],address:"Design District, Dallas TX",lat:32.7965,lng:-96.8140}),
];

// Already opened restaurants
const opened = [
  makeEntry({name:"Delilah Dallas",cuisine:"Supper Club / Steakhouse",neighborhood:"Design District",score:91,price:4,tags:["Fine Dining","Date Night","Late Night","Cocktails","Exclusive","Viral","Live Music","Celebrations"],reservation:"OpenTable",description:"LA-based 1920s supper club. 15,000 sq ft. Pink velvet booths, live jazz, dance troupe. No-photo policy.",dishes:["Hamachi Crudo","Roasted Lobster Mafaldine","Bone-In Texas Redfish","Wagyu Steak"],address:"1616 Hi Line Dr, Dallas TX 75207",hours:"Tue-Sun 5PM-1AM",lat:32.7875,lng:-96.8120,trending:true,group:"h.wood Group",instagram:"@delilah",website:"https://thedelilah.com",res_tier:5}),
  makeEntry({name:"Night Rooster",cuisine:"Modern Chinese Fine Dining",neighborhood:"Design District",score:90,price:3,tags:["Fine Dining","Asian","Date Night","Cocktails","New Opening"],reservation:"Resy",description:"Modern Chinese from Hooper Hospitality. Led by former Top Chef runner-up Chef Shirley Chung.",dishes:["Peking Duck","Xiao Long Bao","Wok-Fried Lobster"],address:"1000 N Riverfront Blvd, Dallas TX",hours:"Tue-Sun 5PM-11PM",lat:32.7900,lng:-96.8200,trending:true,group:"Hooper Hospitality Concepts",instagram:"@nightroosterdallas",res_tier:3}),
  makeEntry({name:"Little Ruby's",cuisine:"Australian All-Day Cafe",neighborhood:"Uptown",score:87,price:2,tags:["Brunch","Breakfast","Coffee","Casual","Patio"],description:"First location outside NYC. Australian-inspired all-day restaurant. Breakfast until 4PM.",dishes:["Avocado Toast","Ricotta Hotcakes","Grain Bowl","Flat White"],address:"2305 Cedar Springs Rd, Dallas TX",hours:"7AM-4PM daily",lat:32.8008,lng:-96.8015,group:"Wish You Were Here Group",instagram:"@littlerubys"}),
  makeEntry({name:"Seegar's Deli",cuisine:"Deli / All-Day Cafe",neighborhood:"Harwood District",score:85,price:2,tags:["Brunch","Lunch","Casual","Coffee"],description:"Nondenominational deli serving sandwiches on freshly baked bread.",dishes:["House Baked Bread Sandwiches","Soups","Salads"],address:"1910 S Harwood St, Dallas TX",lat:32.7790,lng:-96.7920}),
];

// Missing nightlife venues
const venues = [
  makeEntry({name:"The Factory in Deep Ellum",cuisine:"Live Music Venue",neighborhood:"Deep Ellum",score:90,price:2,tags:["Live Music","Nightlife","Bar","Celebrations"],description:"Premier live music venue in historic Ford plant turned WWII factory. 200-4,300 capacity. Concerts, boxing, gaming.",address:"2713 Canton St, Dallas TX 75226",hours:"Event nights",lat:32.7834,lng:-96.7823,instagram:"@thefactoryde",website:"https://www.thebombfactory.com"}),
  makeEntry({name:"Toyota Music Factory",cuisine:"Entertainment Complex",neighborhood:"Irving / Las Colinas",score:88,price:2,tags:["Live Music","Nightlife","Bar","Eat & Play"],description:"Major outdoor/indoor entertainment district in Las Colinas. The Pavilion hosts major tours. Surrounded by restaurants.",address:"316 W Las Colinas Blvd, Irving TX 75039",hours:"Event nights",lat:32.8774,lng:-96.9429,suburb:true,website:"https://www.toyotamusicfactory.com"}),
  makeEntry({name:"Club Dada",cuisine:"Live Music Bar",neighborhood:"Deep Ellum",score:87,price:1,tags:["Live Music","Nightlife","Dive Bar","Bar","Late Night"],description:"One of the oldest and most beloved clubs in Deep Ellum. Wide range of artists almost every night. Intimate indoor/outdoor.",address:"2720 Elm St, Dallas TX 75226",hours:"Nightly",lat:32.7838,lng:-96.7820,instagram:"@clubdadadallas"}),
  makeEntry({name:"House of Blues Dallas",cuisine:"Live Music Venue & Restaurant",neighborhood:"Downtown",score:89,price:2,tags:["Live Music","Nightlife","Bar","American","Brunch"],description:"Iconic music venue downtown. Multi-level concert hall, restaurant, bar. Sunday Gospel Brunch is a Dallas institution.",dishes:["Gospel Brunch","Southern Comfort Food"],address:"2200 N Lamar St, Dallas TX 75202",hours:"Event nights + restaurant",lat:32.7892,lng:-96.8084,website:"https://www.houseofblues.com/dallas"}),
  makeEntry({name:"Dos Equis Pavilion",cuisine:"Concert Venue",neighborhood:"Fair Park",score:87,price:2,tags:["Live Music","Nightlife","Celebrations"],description:"Major outdoor amphitheater at Fair Park. 20,000 capacity. Hosts the biggest national tours and festivals.",address:"1818 First Ave, Dallas TX 75210",hours:"Event nights",lat:32.7754,lng:-96.7595,website:"https://www.dfrocks.com"}),
  makeEntry({name:"South Side Music Hall",cuisine:"Live Music Venue",neighborhood:"South Lamar",score:86,price:2,tags:["Live Music","Nightlife","Bar"],description:"Mid-size concert venue in Gilley's Dallas complex. 800-1,200 capacity. Indie to hip-hop.",address:"1135 S Lamar St, Dallas TX 75215",hours:"Event nights",lat:32.7710,lng:-96.7990}),
  makeEntry({name:"Gilley's Dallas",cuisine:"Event Venue & Dance Hall",neighborhood:"South Lamar",score:86,price:2,tags:["Live Music","Nightlife","Bar","Celebrations"],description:"Massive event complex. Live music, private events, Texas-sized celebrations.",address:"1135 S Lamar St, Dallas TX 75215",hours:"Event nights",lat:32.7712,lng:-96.7988}),
  makeEntry({name:"Amplified Live",cuisine:"Live Music Venue",neighborhood:"Design District",score:88,price:2,tags:["Live Music","Nightlife","Bar","EDM"],description:"State-of-the-art 2,500 capacity venue. Top-tier sound and production. Electronic, hip-hop, indie acts.",address:"2804 Main St, Dallas TX 75226",hours:"Event nights",lat:32.7850,lng:-96.7840}),
];

data.push(...comingSoon, ...opened, ...venues);

// Deduplicate by name (keep last added = most recent data)
const seen = new Set();
const deduped = [];
for (let i = data.length - 1; i >= 0; i--) {
  if (seen.has(data[i].name)) continue;
  seen.add(data[i].name);
  deduped.unshift(data[i]);
}

console.log("Before dedup:", data.length, "After:", deduped.length);
console.log("Coming soon:", deduped.filter(r => (r.indicators||[]).includes("coming-soon")).length);
console.log("New venues:", venues.length);
console.log("New opened:", opened.length);

const newData = JSON.stringify(deduped);
html = html.replace(match[0], "const DALLAS_DATA=" + newData + ";");
fs.writeFileSync("index.html", html);
console.log("Done!");
