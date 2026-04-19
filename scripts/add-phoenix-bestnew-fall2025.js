// Add 15 Eater Phoenix Best New Fall 2025 picks to PHX_DATA.
// Source: phoenix.eater.com/maps/best-new-restaurants-phoenix-arizona-scottsdale-mesa-gilbert
// All entries have verified addresses, phones, websites, chef names from the article.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function e(id, data) {
  return {
    id,name:'',phone:'',cuisine:'',neighborhood:'',score:87,price:3,tags:[],
    indicators:[],hh:'',reservation:'Resy',awards:'Eater Phoenix Best New Fall 2025',
    description:'',dishes:[],address:'',hours:'',lat:0,lng:0,group:'',
    instagram:'',website:'',res_tier:0,photoUrl:'',bestOf:[],busyness:null,
    waitTime:null,popularTimes:null,lastUpdated:null,trending:true,suburb:false,
    reserveUrl:'',menuUrl:'',verified:'2026-04-18',
    ...data,
  };
}

// All 15 Eater Phoenix Best New Fall 2025 entries. Coords approximated from
// address + zip (neighborhood-level accuracy).
const newEntries = [
  e(3039, {
    name:"Alden",cuisine:"New American",neighborhood:"Roosevelt Row",
    score:89,price:3,
    tags:["New American","Sit-Down","Critics Pick","Date Night","Cocktails"],
    description:"Full-service restaurant at the Phoenix Art Museum via CS Hospitality and Monica X. Castillo (Chelsea's Kitchen, La Grande Orange). Chef-driven menu from burrata to steak frites to red Thai curry, tuned to the museum's midcentury lines.",
    dishes:["Burrata with Beefsteak Tomatoes","Steak Frites with Chimichurri","Strawberry Trifle"],
    address:"1625 N Central Ave, Phoenix, AZ 85004",
    lat:33.4664,lng:-112.0740,
    phone:"(602) 623-2725",
    website:"http://aldenphx.com/",
  }),
  e(3040, {
    name:"Mr. Baan's Bar and Mookata",cuisine:"Thai / Mookata Hot Pot-BBQ",neighborhood:"Roosevelt Row",
    score:89,price:3,
    tags:["Thai","Sit-Down","Critics Pick","Date Night","Patio"],
    description:"From Alex and Yotaka Martin (Lom Wong) in the former Khla space behind Lom Wong's bungalow — charcoal-grilled ping yaang skewers and mookata (a communal hot-pot-and-barbecue mash-up) that few U.S. restaurants attempt.",
    dishes:["Mookata Grill","Ping Yaang Skewers","Sukiyaki Dipping Sauces"],
    address:"218 E Portland St, Phoenix, AZ 85004",
    lat:33.4627,lng:-112.0704,
    phone:"(480) 685-3636",
    website:"https://www.mrbaans.com/",
  }),
  e(3041, {
    name:"CP Coffee & Pâtisserie",cuisine:"Bakery / Coffee",neighborhood:"Downtown Phoenix",
    score:89,price:2,
    tags:["Bakery/Coffee","Casual","Critics Pick","Brunch","Local Favorites","Awards"],
    description:"Collaboration between Mark Chacón (James Beard-nominated Chacónne Patisserie) and Julia Peixoto (Peixoto Coffee) inside ASU's Bioscience Center — serving some of Phoenix's cleanest pastry and coffee work. Pastry lead Nick Beitcher trained at San Francisco's Tartine.",
    dishes:["Viennoiserie","Cardamom Buns","CP Sipper (espresso + burnt-honey caramel + Chantilly)"],
    address:"850 N 5th St Ste 120, Phoenix, AZ 85004",
    lat:33.4564,lng:-112.0681,
    phone:"(480) 275-2843",
    website:"http://peixotocoffee.com/",
    awards:"James Beard Nominated (Mark Chacón) | Eater Phoenix Best New Fall 2025",
    reservation:"walk-in",
  }),
  e(3042, {
    name:"Pretty Penny",cuisine:"New American / Cocktail Bar",neighborhood:"Roosevelt Row",
    score:90,price:4,
    tags:["New American","Date Night","Critics Pick","Cocktails","Sit-Down"],
    description:"Downtown Phoenix high-end restaurant from owners Sam Olguin and Brenon Stuart with chef Marcelino Ramos — ambitious plates like 44-ounce $185 ribeye, lamb ragu with paccheri, and a braised octopus tostada, plus a cocktail-first program.",
    dishes:["44oz Ribeye","Lamb Ragu with Paccheri","Braised Octopus Tostada"],
    address:"509 E Roosevelt St, Phoenix, AZ 85004",
    lat:33.4592,lng:-112.0671,
    phone:"(602) 960-0406",
    website:"https://www.intastewetrust.com/",
  }),
  e(3043, {
    name:"Marisco Boys",cuisine:"Mexican Seafood",neighborhood:"Central Phoenix",
    score:89,price:3,
    tags:["Mexican","Seafood","Sit-Down","Critics Pick","Date Night"],
    description:"From the Taco Boys team — glossy Puerto Peñasco-inspired mariscos follow-up with a Hermosillo-glam dining room. Seafood pulled from just across the border in the Gulf of California.",
    dishes:["Charola Seafood Tower","Whole Red Snapper","Chicharrón de Pulpo"],
    address:"2026 N 7th St, Phoenix, AZ 85006",
    lat:33.4706,lng:-112.0648,
    phone:"(480) 597-5623",
    website:"https://mariscoboys.com/",
  }),
  e(3044, {
    name:"Sidewinder",cuisine:"Dive Bar / Elevated Bar Food",neighborhood:"Garfield",
    score:87,price:2,
    tags:["Bar","Late Night","Casual","Local Favorites","Critics Pick","Patio"],
    description:"T.J. Culp and Esther Noh (Sottise, Restaurant Progress) turned the old Welcome Diner into a dive bar with playful affordable plates — Frito pie, jalapeño poppers, elote ribs — and cheeky cocktails. Kitchen until 1am.",
    dishes:["Cheap Sloppy Joe","Frito Pie","Not So Sonoran Dog"],
    address:"924 E Roosevelt St, Phoenix, AZ 85006",
    lat:33.4592,lng:-112.0632,
    website:"https://sidewinderphx.com/",
    reservation:"walk-in",
  }),
  e(3045, {
    name:"Lydia's Kitchen",cuisine:"Brunch / French Farmhouse",neighborhood:"Uptown",
    score:86,price:2,
    tags:["Brunch","Sit-Down","Local Favorites","Cocktails"],
    description:"Opened June 2025 — Jonathan Madrigal of Berdena's teams with The Frederick owners Chantell Nighswonger and Kevin Cieszkowski on a mellow French farmhouse-inspired brunch spot.",
    dishes:["Brunch Plates","House Coffee","Seasonal Wine"],
    address:"1215 E Missouri Ave Ste 10, Phoenix, AZ 85014",
    lat:33.5123,lng:-112.0518,
    phone:"(480) 725-8034",
    website:"https://www.instagram.com/lydiasphx/",
    reservation:"walk-in",
  }),
  e(3046, {
    name:"Minnow",cuisine:"Japanese / All-Day Cafe",neighborhood:"Arcadia",
    score:88,price:2,
    tags:["Japanese","Bakery/Coffee","Brunch","Sit-Down","Critics Pick","Local Favorites"],
    description:"Bernie Kantak (Citizen Public House, the Gladly) reworked a glassy ceramic-tiled corner into an all-day operation — matcha, espresso, pastries early; sushi, donburi, and yellowtail rolls by lunch.",
    dishes:["Yellowtail Rolls","Spam Bowls","Ube Cold Foam Latte"],
    address:"4501 N 32nd St, Phoenix, AZ 85018",
    lat:33.4928,lng:-111.9824,
    website:"https://www.eatminnow.com/",
    reservation:"walk-in",
  }),
  e(3047, {
    name:"Warren's Supper Club",cuisine:"Southern Steakhouse / Supper Club",neighborhood:"Chandler",
    score:90,price:4,
    tags:["Steakhouse","Southern","Live Music","Date Night","Critics Pick","Sit-Down"],
    description:"Larry Warren White and Rasheeda White (Monroe's Hot Chicken, Lo-Lo's) revived the midcentury Black supper club tradition — steakhouse structure with Southern influence, post oak smoking program, and live jazz/soul Thu-Sun.",
    dishes:["Charbroiled Oysters","Smoked Maple Pork Belly","Tomahawk"],
    address:"1040 N 54th St, Chandler, AZ 85226",
    lat:33.3186,lng:-111.9511,
    phone:"(480) 753-1040",
    website:"http://www.warrenssupperclub.com/",
    suburb:true,
  }),
  e(3048, {
    name:"Glenrosa",cuisine:"Border-Town Mexican",neighborhood:"Tempe",
    score:91,price:3,
    tags:["Mexican","Sit-Down","Critics Pick","Date Night","Awards"],
    description:"Golf course restaurant with striking pueblo-style interiors and a wood-fired menu from two-time James Beard semifinalist Samantha Sanz (with Victor Davila) — nods to her Nogales upbringing.",
    dishes:["Tacos Dorados with Chile Colorado Beef","Tijuana-Born Caesar","Madrina (Jalapeño Dirty Martini)"],
    address:"1415 N Mill Ave, Tempe, AZ 85288",
    lat:33.4319,lng:-111.9409,
    phone:"(480) 530-9875",
    website:"https://glenrosarestaurant.com/",
    awards:"James Beard Semifinalist (Samantha Sanz) | Eater Phoenix Best New Fall 2025",
    suburb:true,
  }),
  e(3049, {
    name:"Anhelo",cuisine:"Fine Dining / Tasting Menu",neighborhood:"Old Town Scottsdale",
    score:92,price:4,
    tags:["Fine Dining","Tasting Menu","Date Night","Critics Pick","Sit-Down"],
    description:"Ivan Jacobo's fine-dining tasting menu restaurant reopened July 2025 in Old Town Scottsdale — three years in Orpheum Lofts built a following for focused tasting menus and dialed-in wine pairings. Now in a garden-lined property.",
    dishes:["Seasonal Tasting Menu","Wine Pairings"],
    address:"7007 E 1st Ave, Scottsdale, AZ 85251",
    lat:33.4940,lng:-111.9263,
    phone:"(602) 596-7745",
    website:"https://www.anhelorestaurant.com/",
    suburb:true,
    reservation:"Tock",
  }),
  e(3050, {
    name:"Uchi Scottsdale",cuisine:"Japanese / Fine Dining",neighborhood:"Old Town Scottsdale",
    score:94,price:4,
    tags:["Japanese","Sushi","Omakase","Fine Dining","Date Night","Critics Pick","Tasting Menu","Awards"],
    description:"Austin-based chef-owner Tyson Cole's seventh rendition of Uchi ('home' in Japanese) — crudo, carpaccio, wagyu beef hot rock, rare fish from Toyosu Market, and a 10-course seasonal omakase. The buzziest Phoenix-area opening of the year.",
    dishes:["Hama Chili","Wagyu Beef Hot Rock","10-Course Omakase"],
    address:"3821 N Scottsdale Rd, Scottsdale, AZ 85251",
    lat:33.4897,lng:-111.9265,
    phone:"(480) 916-0916",
    website:"https://www.uchi.uchirestaurants.com/",
    suburb:true,
    awards:"James Beard Award (Tyson Cole) | Eater Phoenix Best New Fall 2025",
    cityLinks:["Austin","Dallas","Houston"],
  }),
  e(3051, {
    name:"Frybread Lounge",cuisine:"Native American / Indigenous",neighborhood:"Old Town Scottsdale",
    score:91,price:3,
    tags:["Native American","Sit-Down","Critics Pick","Date Night"],
    description:"Old Town Scottsdale's first Indigenous-owned restaurant — Chef Darryl Montana (O'odham tribal member) spotlights fry bread in savory and sweet forms, plus Indigenous meats and Arizona-native ingredients.",
    dishes:["Rez Charcuterie Board","Duck Tinga Fry Bread","Elk Pozole"],
    address:"7211 E Main St, Scottsdale, AZ 85251",
    lat:33.4939,lng:-111.9196,
    phone:"(480) 881-8245",
    website:"https://thefrybreadlounge.com/",
    suburb:true,
  }),
  e(3052, {
    name:"Pinyon",cuisine:"Mediterranean / Wood-Fired",neighborhood:"Old Town Scottsdale",
    score:90,price:4,
    tags:["Mediterranean","Sit-Down","Critics Pick","Date Night","Cocktails"],
    description:"From the Buck & Rider / Ingo's team — a Josper charcoal-oven Mediterranean restaurant next to AZ88 along the Civic Center park, with whole roasted fish, skewers, crudos, and a wide spritz/arak-saffron cocktail list.",
    dishes:["Whole Roasted Turbot","Porterhouse","Stuffed Calamari"],
    address:"7363 E Scottsdale Mall, Scottsdale, AZ 85251",
    lat:33.4923,lng:-111.9227,
    phone:"(480) 863-8990",
    website:"https://pinyonrestaurant.com/",
    suburb:true,
  }),
  e(3053, {
    name:"Steadfast Diner",cuisine:"New American / Diner",neighborhood:"Mesa (Eastmark)",
    score:89,price:2,
    tags:["New American","Sit-Down","Critics Pick","Local Favorites","Brunch","Awards"],
    description:"Steadfast Farm owners Erich and Yvonne Schultz restored a 1960s Valentine Diner in far East Mesa — James Beard nominee Derek Christensen runs the kitchen with microgreens, Capitol Farms beef, and a dialed-in pastrami double cheeseburger.",
    dishes:["Pastrami Double Cheeseburger","Seasonal Salads","Steadfast Sauce"],
    address:"5149 S Inspirian Parkway, Mesa, AZ 85212",
    lat:33.3126,lng:-111.6380,
    phone:"(480) 721-4145",
    website:"https://www.steadfast-diner.com/",
    awards:"James Beard Nominated (Derek Christensen) | Eater Phoenix Best New Fall 2025",
    suburb:true,
  }),
];

const pos = locateArray('const PHX_DATA');
const data = parseArray('const PHX_DATA');
data.push(...newEntries);
html = html.substring(0, pos.arrS) + JSON.stringify(data) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('PHX_DATA:', data.length, '(+' + newEntries.length + ')');
newEntries.forEach(e => console.log('  + #' + e.id + ' ' + e.name + ' (' + e.neighborhood + ')'));

// Also link Uchi Scottsdale to existing Austin Uchi entries
// Austin #5244 Uchi (South Lamar / Domain), link to Phoenix
const austinPos = locateArray('const AUSTIN_DATA');
const austin = parseArray('const AUSTIN_DATA');
const uchiAustin = austin.find(r => r.id === 5244);
if (uchiAustin) {
  const existing = Array.isArray(uchiAustin.cityLinks) ? uchiAustin.cityLinks : [];
  if (!existing.includes('Phoenix')) {
    uchiAustin.cityLinks = [...existing, 'Phoenix'];
    // Re-locate after mutation
    const freshPos = locateArray('const AUSTIN_DATA');
    const newHtml = fs.readFileSync('index.html', 'utf8');
    const newAustinPos = {arrS: freshPos.arrS, arrE: freshPos.arrE};
    const updated = newHtml.substring(0, newAustinPos.arrS) + JSON.stringify(austin) + newHtml.substring(newAustinPos.arrE);
    fs.writeFileSync('index.html', updated, 'utf8');
    console.log('  → Uchi Austin #5244 cityLinks += Phoenix');
  }
}
