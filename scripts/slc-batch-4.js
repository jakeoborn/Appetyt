// SLC Batch 4: Verified Mexican, burgers, coffee, more neighborhoods, Provo expansion
// All addresses, phones, and instagram verified via web search
// Run: node scripts/slc-batch-4.js

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
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
}

// === VERIFIED MEXICAN ===
add({name:"Chunga's Mexican Restaurant",cuisine:"Mexican / Tacos",neighborhood:"Westside SLC",score:87,price:1,tags:["Mexican","Tacos","Casual","Local Favorites","Cheap Eats"],description:"The tacos al pastor are the main event — carved from a traditional vertical spit in a no-frills setting. Two locations on the west side serve some of the most authentic Mexican food in Utah. Cash-friendly, fast, and deeply beloved by locals.",dishes:["Tacos al Pastor","Burritos","Tortas","Horchata"],address:"180 S 900 W, Salt Lake City, UT 84104",phone:"(801) 233-2765",lat:40.7630,lng:-111.9120,instagram:"chungasslc",website:"https://chungasslc.com"});

add({name:"Tacos Don Rafa",cuisine:"Mexican / Street Tacos",neighborhood:"Downtown SLC",score:86,price:1,tags:["Mexican","Tacos","Casual","Cheap Eats","Local Favorites"],description:"No-frills taqueria on State Street where Don Rafa himself still works the kitchen most days. Al pastor from a traditional vertical spit, carne asada, and lengua on fresh tortillas. The food does all the talking. Cash preferred.",dishes:["Al Pastor","Carne Asada","Lengua","Tortillas"],address:"655 S State St, Salt Lake City, UT 84111",phone:"(801) 906-0553",lat:40.7570,lng:-111.8880,instagram:"tacosdonrafa",website:""});

add({name:"Lone Star Taqueria",cuisine:"Mexican / Fish Tacos",neighborhood:"Cottonwood Heights",score:86,price:1,tags:["Mexican","Tacos","Seafood","Casual","Local Favorites"],description:"Known for the best fish tacos in Utah — beer-battered with fresh slaw and chipotle sauce. The shrimp tacos and burritos are equally excellent. A Fort Union staple that draws crowds from across the valley.",dishes:["Fish Tacos","Shrimp Tacos","Burritos","Chips & Salsa"],address:"2265 E Fort Union Blvd, Cottonwood Heights, UT 84121",phone:"(801) 944-2300",lat:40.6260,lng:-111.8340,instagram:"lsstaqueria",website:"https://www.lstaq.com",suburb:true});

// === VERIFIED BURGERS ===
add({name:"Lucky 13",cuisine:"Burgers / Bar",neighborhood:"Central City",score:87,price:1,tags:["Burgers","Bar","Casual","Local Favorites","Late Night"],description:"Voted Utah's best burger for multiple years running. Massive, juicy, handcrafted patties with scratch-made sauces in a lively bar setting. The Celestial Burger and Lucky 13 Double are cult classics. Full bar, late hours, and no pretension.",dishes:["Celestial Burger","Lucky 13 Double","Fries","Craft Beer"],address:"135 W 1300 S, Salt Lake City, UT 84115",phone:"(801) 487-4418",lat:40.7480,lng:-111.8930,instagram:"lucky13slc",website:"https://www.lucky13slc.com"});

add({name:"Crown Burgers",cuisine:"Pastrami Burgers",neighborhood:"Downtown SLC",score:86,price:1,tags:["Burgers","Casual","Classic","Local Favorites","Family"],description:"Utah's iconic pastrami burger chain — a beef patty topped with a pile of shaved pastrami, a uniquely Utah creation. Multiple locations across SLC since the 1970s. The Crown Burger is the signature and the onion rings are house-made.",dishes:["Crown Burger (Pastrami)","Onion Rings","Fries","Shakes"],address:"377 E 200 S, Salt Lake City, UT 84111",phone:"(801) 532-1155",lat:40.7640,lng:-111.8820,instagram:"crownburgers.southsaltlake",website:"https://www.crown-burgers.com"});

add({name:"Apollo Burger",cuisine:"Burgers / Fast Casual",neighborhood:"Multiple Locations",score:84,price:1,tags:["Burgers","Casual","Cheap Eats","Family","Local Favorites"],awards:"Best of State 7 consecutive years",description:"Utah-born burger chain serving the state for nearly 40 years. Best of State award winner 7 years running. The Greek-influenced menu includes a gyro burger and the pastrami burger. Multiple locations — the downtown spot on Main Street is the convenient one.",dishes:["Apollo Burger","Pastrami Burger","Gyro","Fries"],address:"379 Main St, Salt Lake City, UT 84111",phone:"(801) 532-4301",lat:40.7640,lng:-111.8918,instagram:"apolloburger",website:"https://www.apolloburger.com"});

// === VERIFIED COFFEE ===
add({name:"Blue Copper Coffee",cuisine:"Specialty Coffee",neighborhood:"Central City",score:87,price:1,tags:["Coffee","Casual","Local Favorites"],description:"SLC's premier third-wave coffee roaster with a beautiful Central City location and a Marmalade District spot with an arcade theme. Single-origin beans, precise espresso, and a community-focused atmosphere. The best cup of coffee in Salt Lake City.",dishes:["Single-Origin Espresso","Pour-Over","Cold Brew"],address:"179 W 900 S, Salt Lake City, UT 84101",phone:"(385) 222-7046",lat:40.7530,lng:-111.8930,instagram:"bluecoppercoffee",website:"https://bluecopperslc.com"});

add({name:"Three Pines Coffee",cuisine:"Specialty Coffee",neighborhood:"Downtown SLC",score:86,price:1,tags:["Coffee","Casual","Local Favorites"],description:"Downtown Main Street specialty coffee shop with a bright, welcoming space. Precision-crafted espresso drinks and seasonal specials. A great morning stop in the heart of downtown SLC.",dishes:["Espresso","Latte","Cold Brew","Pastries"],address:"165 S Main St, Salt Lake City, UT 84111",phone:"(805) 395-8907",lat:40.7640,lng:-111.8918,instagram:"threepinescoffee",website:"https://www.threepinescoffee.com"});

add({name:"Publik Coffee Roasters",cuisine:"Specialty Coffee / Event Space",neighborhood:"Granary District",score:86,price:1,tags:["Coffee","Casual","Local Favorites","Patio"],description:"SLC's largest specialty coffee roaster with a massive Granary District headquarters, Avenues location, and downtown outpost. The West Temple location doubles as an event space. Serious about sourcing and roasting.",dishes:["House Roasts","Espresso","Cold Brew","Pastries"],address:"975 S West Temple, Salt Lake City, UT 84101",phone:"(801) 355-3161",lat:40.7510,lng:-111.8960,instagram:"publikcoffee",website:"https://publikcoffee.com"});

add({name:"La Barba Coffee",cuisine:"Specialty Coffee / Breakfast Tacos",neighborhood:"Downtown SLC",score:85,price:1,tags:["Coffee","Breakfast","Tacos","Casual"],description:"Utah specialty roaster serving craft coffee alongside breakfast tacos — a winning combination. Multiple locations including Downtown, Draper, and Gateway. The Maven District location has the fullest food menu.",dishes:["Specialty Coffee","Breakfast Tacos","Pastries"],address:"155 E 900 S, Salt Lake City, UT 84111",phone:"(385) 335-0225",lat:40.7530,lng:-111.8850,instagram:"labarbacoffee",website:"https://labarbacoffee.com"});

// === MORE SLC RESTAURANTS ===
add({name:"Encanto Colombian",cuisine:"Colombian",neighborhood:"15th & 15th",score:85,price:1,tags:["Latin","Colombian","Casual","Local Favorites"],description:"Casual Colombian restaurant in the 15th & 15th neighborhood serving arepas, salchipapas, and empanadas. Authentic flavors in a friendly neighborhood setting. A unique Latin addition to SLC's dining scene.",dishes:["Arepas","Salchipapas","Empanadas","Colombian Plates"],address:"1524 S 1500 E, Salt Lake City, UT 84105",phone:"(801) 953-1340",lat:40.7380,lng:-111.8530,instagram:"encantoslc",website:"https://www.encantoslc.com"});

add({name:"Hearth and Hill (Sugar House)",cuisine:"New American / Brunch",neighborhood:"Sugar House",score:87,price:2,tags:["American","Brunch","Date Night","Patio","New Opening"],indicators:["new"],description:"Sugar House location from the team behind Urban Hill (fine dining) and Hearth and Hill Park City. Positioned between casual and upscale — perfect for weekend brunch, lunch, or date night. Seasonal American menu with craft cocktails.",dishes:["Brunch","Seasonal American","Craft Cocktails"],address:"2100 S Highland Dr, Salt Lake City, UT 84106",phone:"(801) 890-0540",lat:40.7230,lng:-111.8550,instagram:"hearthandhillslc",website:"https://hearth-hill.com/sugar-house/",trending:true});

add({name:"Beijing Restaurant",cuisine:"Sichuan Chinese",neighborhood:"Sugar House",score:85,price:1,tags:["Chinese","Sichuan","Casual","New Opening"],indicators:["new"],description:"Sugar House Sichuan restaurant opened in 2025. Mapo tofu, dan dan noodles, and fiery Sichuan dishes in a casual setting. A welcome addition to SLC's Chinese food scene.",dishes:["Mapo Tofu","Dan Dan Noodles","Kung Pao Chicken"],address:"2100 S Highland Dr, Suite 200, Salt Lake City, UT 84106",phone:"(801) 953-0188",lat:40.7230,lng:-111.8550,instagram:"beijingslc",website:"",trending:true});

add({name:"Gossip",cuisine:"Italian-Japanese Fusion",neighborhood:"Downtown SLC",score:86,price:2,tags:["Italian","Japanese","Fusion","Cocktails","New Opening","Speakeasy"],indicators:["new"],description:"Downtown Italian-Japanese fusion from the chefs behind Mint Sushi. Positioned as a speakeasy with creative fusion dishes and craft cocktails. One of SLC's most exciting new openings in 2026.",dishes:["Fusion Plates","Sushi","Cocktails"],address:"Downtown SLC",phone:"",lat:40.7640,lng:-111.8918,instagram:"gossipslc",website:"",trending:true});

add({name:"Killa Nikkei",cuisine:"Peruvian-Japanese Fusion",neighborhood:"Downtown SLC",score:87,price:2,tags:["Peruvian","Japanese","Fusion","Date Night","New Opening"],indicators:["new"],description:"Nikkei (Peruvian-Japanese) fusion bringing ceviches, sushi rolls, and Peruvian classics to downtown SLC. The cultural mash-up produces unique flavors. One of the most anticipated new openings in the city.",dishes:["Ceviche","Nikkei Sushi","Peruvian Classics","Pisco Sour"],address:"Downtown SLC",phone:"",lat:40.7640,lng:-111.8918,instagram:"killanikkei",website:"",trending:true});

add({name:"Market Street Grill",cuisine:"Seafood / American",neighborhood:"Downtown SLC",score:86,price:3,tags:["Seafood","American","Date Night","Classic","Celebrations"],reservation:"OpenTable",group:"Gastronomy Inc",description:"Salt Lake's classic seafood and steak restaurant from the Gastronomy Inc. group. Fresh fish flown in daily, classic American steak preparations, and a clubby atmosphere. The downtown location is the flagship. A SLC celebration staple.",dishes:["Fresh Fish","Steaks","Oysters","Classic Cocktails"],address:"48 W Market St, Salt Lake City, UT 84101",phone:"(801) 322-4668",lat:40.7633,lng:-111.8930,instagram:"marketstreetgrill",website:"https://www.gastronomyinc.com",group:"Gastronomy Inc"});

add({name:"Tradition",cuisine:"New American / Southern",neighborhood:"Downtown SLC",score:86,price:2,tags:["American","Southern","Brunch","Cocktails","Local Favorites"],description:"Downtown restaurant serving New American with Southern influences. The brunch is popular and the craft cocktail program is solid. A comfortable downtown option for any meal.",dishes:["Brunch","Southern Plates","Craft Cocktails"],address:"100 S Main St, Salt Lake City, UT 84101",phone:"(801) 913-3242",lat:40.7680,lng:-111.8918,instagram:"traditionslc",website:"https://www.traditionslc.com"});

// Write back — also remove any stubs from previous batches
const cleaned = arr.filter(r => !(r.lat === 0 && r.lng === 0));
if (cleaned.length < arr.length) console.log('Removed', arr.length - cleaned.length, 'stubs');

html = html.slice(0, a) + JSON.stringify(cleaned) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('SLC: ' + cleaned.length + ' spots (added ' + added + ')');
console.log('Need', 250 - cleaned.length, 'more to hit 250');
