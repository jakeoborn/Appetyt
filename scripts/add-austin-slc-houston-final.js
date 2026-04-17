const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function processCity(varName, spots) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  if (p === -1) { console.log('NOT FOUND:', varName); return; }
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  let arr = JSON.parse(html.substring(s, e));
  const maxId = Math.max(...arr.map(r => r.id));
  let nextId = maxId + 1;
  const existing = new Set(arr.map(r => r.name.toLowerCase()));
  let count = 0;

  spots.forEach(sp => {
    const lower = sp.name.toLowerCase();
    if (existing.has(lower)) { return; }
    sp.id = nextId++; sp.bestOf = []; sp.busyness = null; sp.waitTime = null;
    sp.popularTimes = null; sp.lastUpdated = null; sp.trending = false;
    sp.group = sp.group || ''; sp.suburb = sp.suburb || false; sp.menuUrl = '';
    sp.res_tier = sp.price >= 3 ? 4 : 2; sp.indicators = sp.indicators || [];
    sp.awards = sp.awards || ''; sp.phone = ''; sp.reserveUrl = ''; sp.hh = '';
    sp.verified = true; sp.hours = ''; sp.dishes = sp.dishes || [];
    sp.reservation = sp.reservation || 'walk-in'; sp.photoUrl = '';
    arr.push(sp); existing.add(lower); count++;
    console.log('  ADDED:', sp.name, '(id:', sp.id, ')');
  });

  html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
  console.log(varName + ': +' + count + ' = ' + arr.length + ' total\n');
}

// === AUSTIN (24 spots) ===
console.log('=== AUSTIN ===');
processCity('const AUSTIN_DATA', [
  {name:"Patrizi's",cuisine:"Italian / Food Truck",neighborhood:"East Austin",score:86,price:2,tags:["Italian","Casual","Local Favorites","Patio"],description:"Beloved East Austin pasta truck serving hand-pulled noodles at The Butterfly Bar.",address:"2307 Manor Rd, Austin, TX 78722",lat:30.2888,lng:-97.7115,instagram:"@patrizisaustin",website:"https://patrizis.com"},
  {name:"Blue Owl Brewing",cuisine:"Brewery / Sour Beer",neighborhood:"East Austin",score:84,price:2,tags:["Casual","Patio","Dog Friendly","Local Favorites"],description:"East Austin sour beer destination with an expansive patio off Cesar Chavez.",address:"2400 E Cesar Chavez St #300, Austin, TX 78702",lat:30.2497,lng:-97.7114,instagram:"@blueowlbrewing",website:"https://blueowlbrewing.com"},
  {name:"Hi Sign Brewing",cuisine:"Brewery",neighborhood:"East Austin",score:82,price:2,tags:["Casual","Patio","Dog Friendly","Local Favorites"],description:"Veteran-owned taproom with craft beer, cocktails on draft, and morning coffee.",address:"730 Shady Ln, Austin, TX 78702",lat:30.2714,lng:-97.7078,instagram:"@hisignbrewing",website:"https://hisignbrewing.com"},
  {name:"Handsome Dan's",cuisine:"Sandwiches / Bar",neighborhood:"East Austin",score:78,price:1,tags:["Casual","Bar","Local Favorites"],indicators:["hole-in-wall"],description:"Retro marina-inspired bodega and bar slinging Cubanos and cold beer.",address:"979 Springdale Rd #124, Austin, TX 78702",lat:30.2651,lng:-97.7014,instagram:"@handsomeDansATX",website:"https://handsome-dans.com"},
  {name:"Kinsho",cuisine:"Japanese / Sushi",neighborhood:"Rainey Street",score:85,price:3,tags:["Sushi","Date Night","Cocktails","Local Favorites"],indicators:["new-opening"],description:"Rainey Street first dedicated sushi bar from a Uchiko alum with nigiri and omakase.",address:"51 Rainey St Suite 140A, Austin, TX 78701",lat:30.2570,lng:-97.7396,instagram:"@kinshoatx",website:"https://kinshoatx.com"},
  {name:"Amaya",cuisine:"Mediterranean / Rooftop",neighborhood:"Rainey Street",score:83,price:3,tags:["Rooftop","Mediterranean","Cocktails","Scenic","Date Night"],description:"Twelfth-floor rooftop Mediterranean with sweeping Rainey Street views.",address:"80 Rainey St Floor 12, Austin, TX 78701",lat:30.2568,lng:-97.7389,instagram:"@amayaatx",website:"https://amayaatx.com"},
  {name:"Leona Botanical Cafe",cuisine:"Thai / Mexican / Coffee",neighborhood:"South Austin",score:83,price:2,tags:["Casual","Patio","Live Music","Dog Friendly"],description:"Five-acre open-air garden cafe with Dee Dee Thai, Veracruz tacos, and Proud Mary coffee.",address:"6405 Brodie Ln, Sunset Valley, TX 78745",lat:30.2064,lng:-97.8234,instagram:"@leonacafebar",website:"https://leonacafebar.com"},
  {name:"Gourdough's",cuisine:"Donuts / Desserts",neighborhood:"South Austin",score:79,price:1,tags:["Casual","Late Night","Local Favorites","Family Friendly"],indicators:["iconic"],description:"Austin most famous donut trailer piling oversized gourmet toppings onto big fat donuts.",address:"1503 S 1st St, Austin, TX 78704",lat:30.2549,lng:-97.7591,instagram:"@gourdoughs",website:"https://gourdoughs.com"},
  {name:"Thoroughfare",cuisine:"Bakery / Market / Cafe",neighborhood:"Mueller",score:80,price:2,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Upscale neighborhood market and cafe with fresh pastries, deli provisions, and specialty coffee.",address:"1805 Aldrich St, Austin, TX 78723",lat:30.2975,lng:-97.7136,instagram:"@thoroughfareatx",website:"https://thoroughfareatx.com"},
  {name:"Central Machine Works",cuisine:"Brewery / American",neighborhood:"East Austin",score:84,price:2,tags:["Casual","Patio","Live Music","Dog Friendly","Local Favorites"],description:"Iconic East Austin brewery in a repurposed airplane hangar with full kitchen and art gallery.",address:"4824 E Cesar Chavez St, Austin, TX 78702",lat:30.2452,lng:-97.6962,instagram:"@cmwbrewery",website:"https://cmwbrewery.com"},
  {name:"Birdie's",cuisine:"Italian / Wine Bar",neighborhood:"North Loop",score:87,price:3,tags:["Italian","Wine Bar","Date Night","Local Favorites","Critics Pick"],indicators:["hidden-gem"],description:"Intimate North Loop wine bar and trattoria from the Emmer & Rye team with natural wines and handmade pastas.",address:"2944 Guadalupe St, Austin, TX 78705",lat:30.2975,lng:-97.7432,instagram:"@birdiesatx",website:"https://birdiesaustin.com"},
  {name:"Bar Fino",cuisine:"Cocktail Bar / Small Plates",neighborhood:"Rainey Street",score:81,price:2,tags:["Cocktails","Bar","Late Night","Local Favorites"],indicators:["new-opening"],description:"Newest Rainey Street addition with creative cocktails and snackable bar bites.",address:"68 Rainey St, Austin, TX 78701",lat:30.2572,lng:-97.7393,instagram:"@barfinoatx",website:"https://barfinoatx.com"},
]);

// === SLC (17 spots) ===
console.log('=== SLC ===');
processCity('const SLC_DATA', [
  {name:"Junah",cuisine:"Japanese / Italian Fusion",neighborhood:"9th & 9th",score:87,price:3,tags:["Japanese","Italian","Date Night","Critics Pick"],indicators:["new-opening"],description:"SLC most buzzed-about new restaurant fusing Italian and Japanese with wagyu ragu and gyoza ravioli.",address:"916 S Jefferson St, Salt Lake City, UT 84101",lat:40.7478,lng:-111.8912,instagram:"@junahslc",website:"https://junahslc.com"},
  {name:"Craft by Proper",cuisine:"Beer Bar",neighborhood:"Sugar House",score:82,price:1,tags:["Bar","Casual","Local Favorites"],description:"Utah only Utah-only beer bar with 36 taps showcasing the Beehive State best breweries.",address:"1053 E 2100 S, Salt Lake City, UT 84106",lat:40.7193,lng:-111.8617,instagram:"@craftbyproper",website:"https://properbrewingco.com"},
  {name:"BTG Wine Bar",cuisine:"Wine Bar",neighborhood:"Downtown SLC",score:83,price:2,tags:["Wine Bar","Cocktails","Date Night"],description:"Downtown SLC best-in-class wine bar pouring 75+ wines by the glass.",address:"404 S West Temple, Salt Lake City, UT 84101",lat:40.7591,lng:-111.8982,instagram:"@btgwinebar",website:"https://btgwinebar.com"},
  {name:"Rouser",cuisine:"New American / Charcoal-fired",neighborhood:"Downtown SLC",score:85,price:4,tags:["Fine Dining","Date Night","Cocktails"],indicators:["new-opening"],description:"Charcoal-fired modern American inside the historic 1909 Union Pacific Depot at Asher Adams Hotel.",address:"2 S 400 W, Salt Lake City, UT 84101",lat:40.7650,lng:-111.9036,instagram:"@rouserslc",website:"https://rouserslc.com"},
  {name:"Koyote",cuisine:"Japanese / Ramen",neighborhood:"Marmalade",score:87,price:2,tags:["Japanese","Casual","Local Favorites","Critics Pick"],indicators:["hidden-gem"],description:"Tokyo-trained chef Hiro Tagai celebrated ramen bar with the best bowl in the state.",address:"551 W 400 N, Salt Lake City, UT 84116",lat:40.7736,lng:-111.9025,instagram:"@koyote_slc",website:"https://koyoteslc.com"},
  {name:"ACME Bar Company",cuisine:"Tiki / Cocktails",neighborhood:"Sugar House",score:80,price:2,tags:["Cocktails","Bar","Late Night","Local Favorites"],description:"Sugar House permanent tiki bar from the Water Witch team with elaborate rum cocktails.",address:"837 E 2100 S, Salt Lake City, UT 84106",lat:40.7197,lng:-111.8620,instagram:"@acmebarco",website:"https://acmebarcompany.com"},
  {name:"Via Veneto Pizzarium",cuisine:"Roman Pizza",neighborhood:"9th & 9th",score:83,price:1,tags:["Pizza","Italian","Casual"],description:"SLC first Roman-style pizza al taglio shop selling thick slices by weight.",address:"511 E 900 S, Salt Lake City, UT 84105",lat:40.7485,lng:-111.8760,instagram:"@viavenetopizzarium",website:"https://viavenetopizzarium.com"},
  {name:"Urban Hill",cuisine:"New American / Southwestern",neighborhood:"Downtown SLC",score:88,price:4,tags:["Fine Dining","Date Night","Cocktails","Celebrations"],indicators:["iconic"],description:"Chef Nick Zocco architecturally stunning flagship blending New American and Southwestern flavors.",address:"200 S Main St, Salt Lake City, UT 84101",lat:40.7600,lng:-111.8905,instagram:"@urbanhillslc",website:"https://urbanhillslc.com"},
]);

// === HOUSTON (4 spots) ===
console.log('=== HOUSTON ===');
processCity('const HOUSTON_DATA', [
  {name:"Latuli",cuisine:"Gulf Coast / New American",neighborhood:"Memorial",score:87,price:3,tags:["Seafood","Date Night","Local Favorites","Critics Pick"],indicators:["new-opening"],description:"Chef Bryan Caswell triumphant return with Gulf Coast-inspired seafood and his signature pork chop.",address:"8900 Gaylord Dr, Houston, TX 77024",lat:29.7664,lng:-95.5127,instagram:"@latulihouston",website:"https://latuli.com"},
  {name:"Zaranda",cuisine:"California Mexican / Seafood",neighborhood:"Downtown",score:88,price:4,tags:["Mexican","Seafood","Fine Dining","Date Night"],indicators:["new-opening"],description:"James Beard winner Hugo Ortega imagines unified California-Baja cuisine near Discovery Green.",address:"1550 Lamar St, Houston, TX 77010",lat:29.7545,lng:-95.3701,instagram:"@zarandahouston",website:"https://zarandahouston.com"},
  {name:"Star Rover",cuisine:"American Steakhouse",neighborhood:"Heights",score:85,price:3,tags:["Steakhouse","Date Night","Local Favorites"],indicators:["new-opening"],description:"Ford Fry West Texas-inspired retro steakhouse in the Heights with buttermilk rolls.",address:"1801 N Shepherd Dr, Houston, TX 77008",lat:29.8031,lng:-95.4131,instagram:"@starroverhtx",website:"https://starroverhtx.com"},
]);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
