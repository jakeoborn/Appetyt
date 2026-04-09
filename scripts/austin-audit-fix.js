// Austin audit fix: Remove stubs (0,0), remove duplicates, add missing bars/breweries/patios
// Run: node scripts/austin-audit-fix.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
let arr = JSON.parse(html.slice(a, e));

const before = arr.length;

// 1. REMOVE STUBS (lat/lng 0,0)
arr = arr.filter(r => !(r.lat === 0 && r.lng === 0));
console.log('Removed', before - arr.length, 'stub entries');

// 2. REMOVE DUPLICATES (keep first occurrence)
const seen = new Set();
arr = arr.filter(r => {
  const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seen.has(key)) { console.log('Removed duplicate:', r.name); return false; }
  seen.add(key);
  return true;
});

console.log('After cleanup:', arr.length, 'spots');
const needed = 250 - arr.length;
console.log('Need', needed, 'new spots to backfill to 250');

// 3. ADD MISSING BARS / BREWERIES / PATIOS
let nextId = Math.max(...arr.map(r=>r.id||0))+1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase()))return;
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:2});
  existing.add(s.name.toLowerCase());added++;
}

// === BARS / BREWERIES / COCKTAILS / PATIOS AUSTIN IS FAMOUS FOR ===

add({name:"The ABGB (Austin Beer Garden Brewing Co.)",cuisine:"Brewery / Beer Garden / Pizza",neighborhood:"South Lamar",score:87,price:1,tags:["Brewery","Beer Garden","Pizza","Patio","Live Music","Local Favorites"],description:"South Lamar brewery with a massive beer garden, house-brewed craft beer, and excellent thin-crust pizza. Live music most weekends. The Rocket 100 pilsner and Industry lager are Austin staples. The patio is one of the best outdoor drinking spaces in the city.",dishes:["Rocket 100 Pilsner","Industry Lager","Thin-Crust Pizza","Pretzel"],address:"1305 W Oltorf St, Austin, TX 78704",phone:"(512) 298-2242",lat:30.2400,lng:-97.7681,instagram:"theabgb",website:"https://www.theabgb.com"});

add({name:"Meanwhile Brewing Co.",cuisine:"Brewery / Beer Garden",neighborhood:"South Austin",score:86,price:1,tags:["Brewery","Beer Garden","Patio","Live Music","Family","Local Favorites"],description:"Sprawling South Austin brewery with a massive outdoor space, food trucks, live music, and family-friendly vibes. The beer garden has shade structures, games, and enough room for the whole neighborhood. House beers are solid and the atmosphere is peak Austin relaxed.",dishes:["House Craft Beer","Food Trucks","Patio","Live Music"],address:"3901 Promontory Point Dr, Austin, TX 78744",phone:"(512) 358-0294",lat:30.2120,lng:-97.7480,instagram:"meanwhilebrewing",website:"https://www.meanwhilebrewing.com"});

add({name:"Hold Out Brewing",cuisine:"Brewery / Beer Garden",neighborhood:"East Austin",score:86,price:1,tags:["Brewery","Beer Garden","Patio","Local Favorites"],description:"East Austin brewery with a gorgeous outdoor space and house-brewed lagers, IPAs, and seasonal releases. The patio has shade trees, picnic tables, and food truck pop-ups. A newer addition to East Austin's brewery scene with excellent beer quality.",dishes:["Craft Lagers","Hazy IPAs","Food Trucks","Patio"],address:"1208 W 4th St, Austin, TX 78703",phone:"(512) 541-1768",lat:30.2670,lng:-97.7530,instagram:"holdoutbrewing",website:"https://www.holdoutbrewing.com"});

add({name:"Hops & Grain Brewery",cuisine:"Brewery / Taproom",neighborhood:"East Austin",score:85,price:1,tags:["Brewery","Craft Beer","Patio","Local Favorites"],description:"East Austin brewery focused on sessionable, well-crafted beers. The Pale Dog pale ale and Alt-eration are neighborhood favorites. The taproom is intimate and the outdoor space is dog-friendly. One of East Austin's original craft breweries.",dishes:["Pale Dog Pale Ale","Alt-eration","Seasonal Releases"],address:"507 Calles St, Suite 101, Austin, TX 78702",phone:"(512) 914-2467",lat:30.2560,lng:-97.7194,instagram:"hopsandgrain",website:"https://www.hopsandgrain.com"});

add({name:"Live Oak Brewing",cuisine:"Brewery / Beer Hall",neighborhood:"Southeast Austin",score:87,price:1,tags:["Brewery","Beer Garden","German","Patio","Local Favorites"],description:"Austin's premier German-style lager brewery with a massive beer hall and Biergarten. The HefeWeizen, Pilz, and Big Bark amber are brewed with German precision. The outdoor space is enormous with a playground, live music stage, and food trucks. The most European brewery vibe in Austin.",dishes:["HefeWeizen","Pilz","Big Bark Amber","Pretzels"],address:"1615 Crozier Ln, Del Valle, TX 78617",phone:"(512) 385-2299",lat:30.2020,lng:-97.7000,instagram:"liveoakbrewing",website:"https://www.liveoakbrewing.com",suburb:true});

add({name:"Celis Brewery",cuisine:"Brewery / Taproom",neighborhood:"North Austin",score:85,price:1,tags:["Brewery","Craft Beer","Patio","Belgian","Family"],description:"Revived Belgian-style brewery founded by the late Pierre Celis, father of Texas craft beer. The Celis White (witbier) is the flagship and one of America's original craft beers. The north Austin taproom has a spacious patio and food trucks.",dishes:["Celis White","Grand Cru","Raspberry","Food Trucks"],address:"10001 Metric Blvd, Austin, TX 78758",phone:"(512) 832-0084",lat:30.3800,lng:-97.7189,instagram:"celisbrewery",website:"https://www.celisbeers.com"});

add({name:"Revelry Kitchen + Bar",cuisine:"American / Cocktail Bar",neighborhood:"East Austin",score:85,price:2,tags:["American","Cocktails","Patio","Brunch","Date Night"],description:"East Cesar Chavez restaurant and bar with creative cocktails and elevated American fare on a patio overlooking the East Austin streetscape. Brunch, lunch, and dinner with a bar program that rivals dedicated cocktail bars.",dishes:["Craft Cocktails","Brunch","American Plates","Patio"],address:"1410 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 520-3696",lat:30.2533,lng:-97.7283,instagram:"revelryatx",website:"https://www.revelrykitchenandbar.com"});

add({name:"Easy Tiger Bake Shop & Beer Garden",cuisine:"Bakery / Beer Garden",neighborhood:"Downtown",score:86,price:1,tags:["Bakery","Beer Garden","Patio","Craft Beer","Casual","Local Favorites"],description:"Downtown bakery and beer garden with house-baked pretzels, sausages, and a long list of craft beers. The underground patio along Waller Creek is one of Downtown Austin's best-kept secrets. The soft pretzel alone is worth the visit.",dishes:["Soft Pretzels","House Sausages","Craft Beer","Baked Goods"],address:"709 E 6th St, Austin, TX 78701",phone:"(512) 614-4972",lat:30.2668,lng:-97.7360,instagram:"easytiger",website:"https://www.easytigeraustin.com"});

add({name:"Freedmen's Bar",cuisine:"BBQ / Cocktail Bar",neighborhood:"West Campus",score:86,price:2,tags:["BBQ","Cocktails","Bar","Patio","Date Night","Local Favorites"],description:"West Campus BBQ and cocktail bar in a historic Freedmen's Town building. Smoked meats pair with a serious cocktail program in one of Austin's most atmospheric settings. The patio is shaded and the whiskey list is deep.",dishes:["Smoked Brisket","Craft Cocktails","Whiskey Flights","Patio"],address:"2402 San Gabriel St, Austin, TX 78705",phone:"(512) 220-0953",lat:30.2830,lng:-97.7470,instagram:"freedmensbar",website:"https://www.freedmensbar.com"});

add({name:"The Hightower",cuisine:"Cocktail Bar / Music",neighborhood:"East Austin",score:85,price:2,tags:["Cocktails","Bar","Live Music","Patio","Late Night"],description:"East 7th cocktail bar with a rooftop patio, live music downstairs, and craft drinks that draw East Austin's creative crowd. The rooftop view of downtown is excellent at sunset. Live DJs and bands most weekends.",dishes:["Craft Cocktails","Rooftop Patio","Live Music","Late Night"],address:"1209 E 7th St, Austin, TX 78702",phone:"(512) 524-3040",lat:30.2631,lng:-97.7289,instagram:"thehightoweratx",website:"https://www.thehightoweratx.com"});

add({name:"Kitty Cohen's",cuisine:"Bar / Beer Garden",neighborhood:"East Austin",score:84,price:1,tags:["Bar","Beer Garden","Patio","Late Night","Local Favorites"],description:"East Austin bar with a desert-themed outdoor space — string lights, cacti, and frozen drinks. The palm springs aesthetic is fun and photogenic. Frozen cocktails, cheap beer, and a come-as-you-are attitude. A perfect East Austin summer bar.",dishes:["Frozen Cocktails","Beer","Patio","Desert Vibes"],address:"2211 Webberville Rd, Austin, TX 78702",phone:"(512) 522-4023",lat:30.2626,lng:-97.7130,instagram:"kittycohensatx",website:"https://www.kittycohens.com"});

add({name:"Lustre Pearl",cuisine:"Bar / Patio",neighborhood:"Rainey Street",score:84,price:1,tags:["Bar","Patio","Late Night","Nightlife","Local Favorites"],description:"One of the original Rainey Street bungalow bars that helped transform the neighborhood. Massive patio, cheap beer, and a casual party vibe. Lustre Pearl is the OG Rainey Street experience that started it all.",dishes:["Cheap Beer","Cocktails","Patio"],address:"97 Rainey St, Austin, TX 78701",phone:"(512) 469-0400",lat:30.2576,lng:-97.7406,instagram:"lustrepearl",website:"https://www.lustrepearl.com"});

add({name:"Hotel Vegas",cuisine:"Bar / Live Music Venue",neighborhood:"East Austin",score:85,price:1,tags:["Live Music","Bar","Late Night","Nightlife","Local Favorites"],description:"East 6th bar and live music venue that's become the epicenter of Austin's indie music scene. Multiple stages, a patio with volley taco food truck, and booking that consistently brings the best local and touring acts. The spiritual successor to the old East 6th DIY scene.",dishes:["Live Music","Cheap Beer","Volley Tacos","Late Night"],address:"1502 E 6th St, Austin, TX 78702",phone:"(512) 524-1584",lat:30.2626,lng:-97.7260,instagram:"hotelvegasatx",website:"https://www.hotelvegasaustin.com"});

add({name:"Violet Crown Social Club",cuisine:"Bar / Patio",neighborhood:"East Austin",score:84,price:1,tags:["Bar","Patio","Late Night","Local Favorites"],description:"East 6th patio bar with a huge outdoor space, food trucks, and a laid-back vibe that embodies East Austin. No pretension, just cold beer, games, and good people. The kind of bar where you lose track of time.",dishes:["Cold Beer","Food Trucks","Patio","Games"],address:"1111 E 6th St, Austin, TX 78702",phone:"(512) 524-2772",lat:30.2631,lng:-97.7303,instagram:"violetcrownsocialclub",website:"https://www.violetcrownsocialclub.com"});

add({name:"Spokesman",cuisine:"Coffee / Bar",neighborhood:"East Austin",score:84,price:1,tags:["Coffee","Bar","Patio","Casual","Local Favorites"],description:"East Austin day-to-night spot — craft coffee in the morning, cocktails and beer at night. The shaded patio with picnic tables is the draw. Food trucks park outside regularly. A laid-back East Austin neighborhood anchor.",dishes:["Craft Coffee","Beer","Cocktails","Food Trucks"],address:"1617 E 6th St, Austin, TX 78702",phone:"(512) 580-0775",lat:30.2626,lng:-97.7260,instagram:"spokesmanatx",website:"https://www.spokesmanatx.com"});

add({name:"Sahara Lounge",cuisine:"Bar / Live Music / World Music",neighborhood:"East Austin",score:84,price:1,tags:["Live Music","Bar","Dive Bar","World Music","Late Night"],description:"East Austin dive bar with world music, Ethiopian food, and one of the most eclectic booking calendars in the city. Afrobeat, reggae, funk, and jazz in a no-frills space. The Saturday night African Dance Party is legendary. Cheap beer, global vibes.",dishes:["Ethiopian Food","Cold Beer","World Music","Dancing"],address:"1413 Webberville Rd, Austin, TX 78721",phone:"(512) 927-0700",lat:30.2640,lng:-97.7150,instagram:"saharaloungeatx",website:"https://www.saharalounge.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\nAustin after fix:', arr.length, 'spots (added', added, 'new bars/breweries/patios)');
console.log(arr.length >= 250 ? 'TARGET MAINTAINED!' : 'Need ' + (250 - arr.length) + ' more');
