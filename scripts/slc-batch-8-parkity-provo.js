// SLC Batch 8: Final 19 - Park City + Provo focus
// Run: node scripts/slc-batch-8-parkity-provo.js

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
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:true,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
}

// === PARK CITY ===
add({name:"Twisted Fern",cuisine:"New American",neighborhood:"Park City (Prospector)",score:88,price:2,tags:["American","Date Night","Cocktails","Local Favorites"],reservation:"OpenTable",awards:"Local favorite, sister to Loma",description:"Off-Main Street Park City gem serving creative New American in an airy Scandinavian-style space. Nashville hot maitake sandwich and baked brie with persimmon chutney showcase inventive cooking at more reasonable Park City prices. A local favorite.",dishes:["Nashville Hot Maitake","Baked Brie","Seasonal Plates"],address:"1251 Kearns Blvd, Suite B1, Park City, UT 84060",phone:"(435) 731-8568",lat:40.6500,lng:-111.5050,instagram:"twistedfern",website:"https://www.twistedfern.com"});

add({name:"Hearth and Hill (Park City)",cuisine:"New American",neighborhood:"Park City",score:87,price:2,tags:["American","Brunch","Date Night","Cocktails","Après-Ski"],reservation:"OpenTable",awards:"Best Restaurant Park City (Salt Lake Magazine), Best of State 2025",description:"Park City's award-winning New American with the H&H Smash Burger, elote queso dip, and seasonal American plates. Casual enough for ski-day lunch, polished enough for date night. Multiple awards.",dishes:["H&H Smash Burger","Elote Queso","Seasonal Plates","Cocktails"],address:"1153 Center Dr, Park City, UT 84098",phone:"(435) 200-8840",lat:40.6580,lng:-111.5050,instagram:"hearthandhill",website:"https://hearth-hill.com/park-city/"});

add({name:"Tupelo",cuisine:"Southern / New American",neighborhood:"Park City",score:87,price:2,tags:["Southern","Brunch","Date Night","Local Favorites"],reservation:"OpenTable",description:"Park City Southern-influenced brunch and dinner with scratch-made biscuits, shrimp and grits, and creative cocktails. The brunch is the star. Located off Main Street in the Newpark area.",dishes:["Biscuits","Shrimp & Grits","Southern Brunch"],address:"508 Main St, Park City, UT 84060",phone:"(435) 615-7700",lat:40.6461,lng:-111.4980,instagram:"tupeloparkcity",website:"https://www.tupeloparkcity.com"});

add({name:"Blind Dog Restaurant",cuisine:"Asian Fusion / Sushi",neighborhood:"Park City (Prospector)",score:86,price:2,tags:["Asian Fusion","Sushi","Cocktails","Date Night"],reservation:"OpenTable",description:"Prospector area Asian fusion and sushi with creative rolls, fresh sashimi, and Pacific Rim-inspired plates. The cocktail program is solid and the atmosphere is casual-upscale. A Park City sushi standby.",dishes:["Sushi Rolls","Sashimi","Asian Fusion","Cocktails"],address:"1251 Kearns Blvd, Park City, UT 84060",phone:"(435) 655-0800",lat:40.6500,lng:-111.5050,instagram:"blinddogpc",website:"https://www.blinddogpc.com"});

add({name:"Silver Star Cafe",cuisine:"New American / Brunch",neighborhood:"Park City",score:86,price:2,tags:["American","Brunch","Casual","Patio","Local Favorites"],reservation:"walk-in",description:"Park City neighborhood cafe serving breakfast, lunch, and dinner with a locals-first vibe. The breakfast is hearty and the seasonal American dinner menu is refined. Away from the Main Street tourist crush.",dishes:["Brunch","Seasonal Dinner","Patio"],address:"1825 Three Kings Dr, Park City, UT 84060",phone:"(435) 655-3456",lat:40.6300,lng:-111.5100,instagram:"silverstarcafe",website:"https://www.thesilverstarcafe.com"});

add({name:"The Cabin",cuisine:"American / Comfort Food",neighborhood:"Park City (Canyons)",score:84,price:2,tags:["American","Casual","Family","Après-Ski"],description:"Canyons Village comfort food restaurant with burgers, mac and cheese, and craft beer. The lodge setting is cozy and the menu is perfect for après-ski fuel. Family-friendly with a casual energy.",dishes:["Burgers","Mac & Cheese","Craft Beer"],address:"4000 Canyons Resort Dr, Park City, UT 84098",phone:"(435) 615-8080",lat:40.6850,lng:-111.5560,instagram:"thecabinpc",website:"https://www.parkcitymountain.com"});

add({name:"Deer Valley Resort Dining",cuisine:"Fine Dining / Resort",neighborhood:"Deer Valley",score:88,price:4,tags:["Fine Dining","Celebrations","Après-Ski","Scenic"],reservation:"OpenTable",description:"Multiple dining options within Deer Valley Resort including the Silver Lake Lodge and Goldener Hirsch. Upscale mountain dining with valley views. The turkey chili at the lodges is a Deer Valley tradition. Ski-in/ski-out dining at its finest.",dishes:["Turkey Chili","Mountain Dining","Scenic Views"],address:"2250 Deer Valley Dr, Park City, UT 84060",phone:"(435) 649-1000",lat:40.6270,lng:-111.4780,instagram:"deervalleyresort",website:"https://www.deervalley.com"});

// === PROVO ===
add({name:"Golden Bees",cuisine:"Mediterranean / Brunch",neighborhood:"Downtown Provo",score:85,price:2,tags:["Mediterranean","Brunch","Date Night","Local Favorites"],reservation:"walk-in",description:"Downtown Provo Mediterranean restaurant with creative brunch and dinner. The shakshuka and Mediterranean plates have earned it a spot among Provo's top restaurants. Named for the Utah state symbol.",dishes:["Shakshuka","Mediterranean Plates","Brunch"],address:"5 W Center St, Provo, UT 84601",phone:"(801) 609-8888",lat:40.2330,lng:-111.6580,instagram:"goldenbeesprovo",website:"https://www.goldenbees.com"});

add({name:"The Mighty Baker",cuisine:"Bakery / Pastry",neighborhood:"Provo",score:84,price:1,tags:["Bakery","Breakfast","Coffee","Local Favorites"],description:"Provo bakery with sourdough, pastries, and morning coffee. The croissants and cinnamon rolls draw early morning crowds. Fresh-baked everything in a cozy space.",dishes:["Sourdough","Croissants","Cinnamon Rolls","Coffee"],address:"38 W Center St, Provo, UT 84601",phone:"(801) 607-2570",lat:40.2330,lng:-111.6600,instagram:"themightybaker",website:"https://www.themightybaker.com"});

add({name:"Slackwater (Provo)",cuisine:"Pizza / Craft Beer",neighborhood:"Provo (Riverwoods)",score:85,price:1,tags:["Pizza","Craft Beer","Casual","Family","Patio"],description:"Provo Riverwoods location of the popular Utah wood-fired pizza chain. The Margherita is excellent and the outdoor patio overlooks the canyon. Craft beer selection spans Utah breweries.",dishes:["Wood-Fired Pizza","Craft Beer","Patio"],address:"4801 N University Ave, Suite 610, Provo, UT 84604",phone:"(801) 375-5050",lat:40.2830,lng:-111.6580,instagram:"slackwater",website:"https://www.slackwaterpizza.com"});

add({name:"Guru's Cafe",cuisine:"Eclectic / Vegetarian",neighborhood:"Downtown Provo",score:83,price:1,tags:["Vegetarian","Casual","Local Favorites","Family","BYU"],description:"Downtown Provo cafe near BYU with an eclectic menu spanning wraps, bowls, and burritos with strong vegetarian options. A BYU student staple for over two decades. Affordable and creative.",dishes:["Wraps","Bowls","Burritos","Vegetarian Options"],address:"45 E Center St, Provo, UT 84601",phone:"(801) 375-4878",lat:40.2330,lng:-111.6570,instagram:"guruscafe",website:"https://www.guruscafe.com"});

add({name:"Wayla Thai",cuisine:"Thai",neighborhood:"Provo",score:84,price:1,tags:["Thai","Casual","Local Favorites"],description:"Provo Thai restaurant with pad thai, curries, and noodle soups at student-friendly prices. The green curry and pad see ew are standouts. BYOB-friendly.",dishes:["Pad Thai","Green Curry","Pad See Ew"],address:"270 W Center St, Provo, UT 84601",phone:"(801) 607-2256",lat:40.2330,lng:-111.6620,instagram:"waylathaiprovo",website:"https://www.waylathai.com"});

add({name:"Legends Grille at Sundance",cuisine:"American / Mountain Resort",neighborhood:"Sundance Resort",score:85,price:3,tags:["American","Scenic","Fine Dining","Après-Ski"],reservation:"OpenTable",description:"Robert Redford's Sundance Mountain Resort restaurant with Wasatch Range views and seasonal American cuisine. The mountain setting is unmatched in Utah Valley. Art on every wall, film history in the air.",dishes:["Mountain Dining","Seasonal American","Scenic Views"],address:"8841 N Alpine Loop Rd, Sundance, UT 84604",phone:"(866) 259-7468",lat:40.3930,lng:-111.5870,instagram:"sundanceresort",website:"https://www.sundanceresort.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('SLC: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
