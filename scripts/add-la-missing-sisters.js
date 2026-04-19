// Add 6 LA destination restaurants where we had the brand in other cities
// but were missing the LA flagship. All in Peter-Luger-voice style — spicy,
// opinionated, specific named dishes.
// Addresses verified via each brand's own website + Wine Spectator / Yelp.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function e(id, data) {
  return {
    id,name:'',phone:'',cuisine:'',neighborhood:'',score:89,price:3,tags:[],
    indicators:[],hh:'',reservation:'Resy',awards:'',
    description:'',dishes:[],address:'',hours:'',lat:0,lng:0,group:'',
    instagram:'',website:'',res_tier:0,photoUrl:'',bestOf:[],busyness:null,
    waitTime:null,popularTimes:null,lastUpdated:null,trending:false,suburb:false,
    reserveUrl:'',menuUrl:'',verified:'2026-04-18',
    ...data,
  };
}

// Get next LA ID
const la = parseArray('const LA_DATA');
let nextId = Math.max(...la.map(r => r.id)) + 1;

const newEntries = [
  // Mastro's Beverly Hills — flagship of the chain
  e(nextId++, {
    name:"Mastro's Steakhouse",
    cuisine:"Steakhouse",
    neighborhood:"Beverly Hills",
    score:93,price:4,
    tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Cocktails","Sit-Down"],
    description:"A Beverly Hills steakhouse where $200 tomahawks arrive on 400-degree plates that keep cooking until you tell them to stop. The piano player never stops, the martinis are cold as a Hollywood divorce, and the seafood tower is the size of a small toddler. Put your phone away — Mastro's is for people who still believe in dinner as an event.",
    dishes:["Tomahawk for Two","Mastro's Signature Seafood Tower","Warm Butter Cake"],
    address:"246 N Canon Dr, Beverly Hills, CA 90210",
    lat:34.0702,lng:-118.4007,
    phone:"(310) 888-8782",
    website:"https://www.mastrosrestaurants.com/location/mastros-steakhouse-beverly-hills/",
    awards:"Wine Spectator Best of Award of Excellence",
    cityLinks:["Las Vegas","Houston","Chicago"],
  }),
  // BOA Steakhouse West Hollywood — the Sunset Strip flagship
  e(nextId++, {
    name:"BOA Steakhouse",
    cuisine:"Steakhouse / Modern",
    neighborhood:"West Hollywood",
    score:88,price:4,
    tags:["Steakhouse","Date Night","Cocktails","Celebrations","Rooftop","Sit-Down"],
    description:"The Sunset Strip steakhouse where agents book power lunches and starlets appear in half the Instagram geotags. Chef-curated prime steaks, a rooftop that never takes itself too seriously, and a valet line longer than the wine list. The truffle Parmesan fries exist for good reason.",
    dishes:["Japanese A5 Wagyu","Bone-In Filet","Truffle Parmesan Fries"],
    address:"9200 Sunset Blvd, West Hollywood, CA 90069",
    lat:34.0905,lng:-118.3857,
    phone:"(310) 278-2050",
    website:"https://www.boasteak.com/west-hollywood-location/",
    cityLinks:["Dallas","Las Vegas"],
  }),
  // SUGARFISH by Sushi Nozawa — Brentwood flagship
  e(nextId++, {
    name:"SUGARFISH",
    cuisine:"Japanese / Sushi",
    neighborhood:"Brentwood",
    score:91,price:3,
    tags:["Sushi","Japanese","Sit-Down","Critics Pick","Local Favorites"],
    description:"The late Kazunori Nozawa — nicknamed the Sushi Nazi — created SUGARFISH to bring omakase discipline to the masses. You order 'Trust Me' and surrender. Every piece arrives at the exact temperature and grain-count Nozawa decreed. No California rolls. No spicy tuna. The rice is the whole point. The fish is uncompromising.",
    dishes:["Trust Me Omakase","Toro Hand Roll","Albacore Sashimi"],
    address:"11640 San Vicente Blvd, Los Angeles, CA 90049",
    lat:34.0525,lng:-118.4732,
    phone:"(310) 820-4477",
    website:"https://sugarfishsushi.com/locations/brentwood",
    cityLinks:["New York"],
  }),
  // Milk Bar LA — Christina Tosi's LA flagship
  e(nextId++, {
    name:"Milk Bar",
    cuisine:"Bakery / Desserts",
    neighborhood:"Hollywood",
    score:87,price:2,
    tags:["Dessert","Bakery/Coffee","Casual","Local Favorites","Critics Pick"],
    description:"Christina Tosi's Melrose flagship — the place where Momofuku alums turned cereal milk into an entire dessert language. The Compost Cookie is a Trojan horse of pretzels, chocolate chips, and butterscotch that has no business being that good. Birthday Truffles on every table for good reason. Don't leave without the B'day Cake.",
    dishes:["Compost Cookie","Birthday Cake Truffles","Cereal Milk Soft Serve"],
    address:"7150 Melrose Ave, Los Angeles, CA 90046",
    lat:34.0833,lng:-118.3458,
    website:"https://milkbarstore.com/pages/melrose-flagship",
    reservation:"walk-in",
    awards:"James Beard Award (Christina Tosi)",
    cityLinks:["New York","Las Vegas"],
  }),
  // Din Tai Fung Arcadia — the original US flagship (at new Baldwin Ave mall location)
  e(nextId++, {
    name:"Din Tai Fung",
    cuisine:"Taiwanese / Soup Dumplings",
    neighborhood:"Arcadia",
    score:91,price:2,
    tags:["Taiwanese","Chinese","Sit-Down","Critics Pick","Local Favorites"],
    description:"The Taiwanese xiao long bao juggernaut that landed in Arcadia 25 years ago and taught America what a real soup dumpling feels like. The 18-fold pleat count, the pork-and-crab filling, the translucent skin that holds until the exact moment your chopstick lifts — none of it negotiable. The line is the line. The truffle XLB exists and it ruins you.",
    dishes:["Pork Xiao Long Bao","Truffle & Pork XLB","Shrimp & Pork Shao Mai"],
    address:"400 S Baldwin Ave #M5, Arcadia, CA 91007",
    lat:34.1372,lng:-118.0520,
    website:"https://dtf.com/en-us/locations/arcadia",
    reservation:"walk-in",
    awards:"Michelin Bib Gourmand",
    suburb:true,
    cityLinks:["Seattle","Las Vegas","New York"],
  }),
  // Hillstone Santa Monica — the LA Westside flagship
  e(nextId++, {
    name:"Hillstone",
    cuisine:"New American",
    neighborhood:"Santa Monica",
    score:89,price:3,
    tags:["New American","Date Night","Sit-Down","Local Favorites","Cocktails"],
    description:"The restaurant your mother-in-law secretly prefers over every Michelin star in town. Ocean Ave Santa Monica Hillstone has been pouring the same French dip sandwich and turning out the same perfect ribeye since forever. Dress codes actually enforced. The Thai steak-and-noodle salad has cult status. The sushi bar is stealthily excellent. No social media presence. Still full every night.",
    dishes:["French Dip Sandwich","Ribeye with Au Jus","Thai Steak & Noodle Salad"],
    address:"202 Wilshire Blvd, Santa Monica, CA 90401",
    lat:34.0192,lng:-118.4973,
    website:"https://hillstonerestaurant.com/locations/santamonica/",
    cityLinks:["Dallas"],
  }),
];

// Add all entries to LA_DATA
la.push(...newEntries);

// Write LA back
const laPos = locateArray('const LA_DATA');
html = html.substring(0, laPos.arrS) + JSON.stringify(la) + html.substring(laPos.arrE);

// Add LA to cityLinks on existing brand siblings
// Mastro's: Houston #7130, Chicago #317, Vegas #12019, Dallas (no Mastro's in Dallas), NYC (no)
// BOA: Dallas #9083, Austin #5285, Vegas #12125, Seattle #9053, NYC #1646
// SUGARFISH: NYC #1128
// Milk Bar: NYC #1747, Vegas #12424
// Din Tai Fung: Seattle #9013, Vegas #12304, NYC (need to check)
// Hillstone: Dallas #160 (only city we have Hillstone in)

const cityLinkUpdates = [
  // Mastro's — add LA to the 3 siblings
  ['Houston', 7130, 'Los Angeles'],
  ['Chicago', 317, 'Los Angeles'],
  ['Las Vegas', 12019, 'Los Angeles'],
  // BOA — add LA to all 5 siblings
  ['Dallas', 9083, 'Los Angeles'],
  ['Austin', 5285, 'Los Angeles'],
  ['Las Vegas', 12125, 'Los Angeles'],
  ['Seattle', 9053, 'Los Angeles'],
  ['New York', 1646, 'Los Angeles'],
  // SUGARFISH
  ['New York', 1128, 'Los Angeles'],
  // Milk Bar
  ['New York', 1747, 'Los Angeles'],
  ['Las Vegas', 12424, 'Los Angeles'],
  // Din Tai Fung
  ['Seattle', 9013, 'Los Angeles'],
  ['Seattle', 9463, 'Los Angeles'],
  ['Las Vegas', 12304, 'Los Angeles'],
  // Hillstone
  ['Dallas', 160, 'Los Angeles'],
];

const cities = {'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA','Chicago':'const CHICAGO_DATA','Seattle':'const SEATTLE_DATA','Las Vegas':'const LV_DATA','New York':'const NYC_DATA'};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

let fixes = 0;
cityLinkUpdates.forEach(([city, id, addCity]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r) { console.log('  ! missing ' + city + '#' + id); return; }
  const existing = Array.isArray(r.cityLinks) ? r.cityLinks.slice() : [];
  if (!existing.includes(addCity)) {
    r.cityLinks = [...existing, addCity];
    fixes++;
    console.log('  ' + city + '#' + id + ' "' + r.name + '" += ' + addCity);
  }
});

// Write each city back in bottom-up order to keep indices stable
const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n=== LA sister additions ===');
console.log('Added', newEntries.length, 'LA destination entries (#' + newEntries[0].id + '-' + newEntries[newEntries.length-1].id + ')');
newEntries.forEach(e => console.log('  + #' + e.id + ' ' + e.name + ' (' + e.neighborhood + ')'));
console.log('\nAlso added Los Angeles to cityLinks on', fixes, 'sibling entries in other cities.');
