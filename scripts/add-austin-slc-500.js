const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function processCity(varName, spots) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
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
    sp.group = ''; sp.suburb = sp.suburb || false; sp.menuUrl = '';
    sp.res_tier = sp.price >= 3 ? 4 : 2; sp.indicators = sp.indicators || [];
    sp.awards = ''; sp.phone = ''; sp.reserveUrl = ''; sp.hh = '';
    sp.verified = true; sp.hours = ''; sp.dishes = sp.dishes || [];
    sp.reservation = 'walk-in'; sp.photoUrl = '';
    arr.push(sp); existing.add(lower); count++;
    console.log('  ADDED:', sp.name);
  });

  html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
  console.log(varName + ': +' + count + ' = ' + arr.length + ' total\n');
}

// AUSTIN (7)
console.log('=== AUSTIN ===');
processCity('const AUSTIN_DATA', [
  {name:"Paprika ATX",cuisine:"Mexican / Taqueria",neighborhood:"North Loop",score:84,price:1,tags:["Mexican","Casual","Local Favorites"],description:"Beloved food truck turned brick-and-mortar with confited brisket tacos and carnitas on handmade tortillas.",address:"6539 N Lamar Blvd, Austin, TX 78752",lat:30.3540,lng:-97.7298,instagram:"@paprikaatx",website:"https://paprikaatx.com"},
  {name:"Palomino Coffee",cuisine:"Coffee / Cafe",neighborhood:"East Austin",score:79,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Plant-filled Southwestern coffee shop with seasonal cardamom lattes — Austin most Instagrammed cafe.",address:"4136 E 12th St, Austin, TX 78721",lat:30.2687,lng:-97.6957,instagram:"@palominocoffee",website:"https://palominocoffee.com"},
  {name:"Soul Seoul Sol",cuisine:"Korean-Soul Fusion",neighborhood:"East Austin",score:81,price:1,tags:["Korean","Casual","Local Favorites"],indicators:["hidden-gem"],description:"East Austin food truck blending Southern soul food with Korean — wagyu Seoul burger and kimchi fries.",address:"979 Springdale Rd, Austin, TX 78702",lat:30.2715,lng:-97.7009,instagram:"@soulseoulsol",website:""},
  {name:"La Vi Coffee",cuisine:"Vietnamese Coffee",neighborhood:"Downtown",score:78,price:1,tags:["Bakery/Coffee","Casual"],indicators:["hidden-gem"],description:"Vietnamese coffee truck brewing salted caramel Viet lattes and traditional egg coffee.",address:"Downtown Austin, TX 78701",lat:30.2672,lng:-97.7431,instagram:"@lavicoffeeaustin",website:"https://lavicoffee.com"},
  {name:"Black Sheep Coffee",cuisine:"Specialty Coffee",neighborhood:"Downtown",score:77,price:1,tags:["Bakery/Coffee","Casual"],indicators:["new-opening"],description:"International specialty coffee brand with signature Robusta beans and ceremonial matcha.",address:"600 W 6th St, Austin, TX 78701",lat:30.2698,lng:-97.7501,instagram:"@blacksheepcoffee",website:"https://blacksheepcoffee.com"},
  {name:"Wanderlust Wine Co.",cuisine:"Wine Bar",neighborhood:"East Austin",score:82,price:2,tags:["Wine Bar","Date Night","Patio","Local Favorites"],description:"East Austin natural wine bar with a gorgeous patio and curated small-producer bottles.",address:"702 Shady Ln, Austin, TX 78702",lat:30.2710,lng:-97.7080,instagram:"@wanderlustwine",website:""},
  {name:"Rosita's Al Pastor East",cuisine:"Mexican / Tacos",neighborhood:"East Austin",score:82,price:1,tags:["Mexican","Casual","Local Favorites"],indicators:["hole-in-wall"],description:"Second East Austin location of the beloved family taqueria with thick flour tortillas since 1985.",address:"2101 E 7th St, Austin, TX 78702",lat:30.2600,lng:-97.7200,instagram:"",website:""},
]);

// SLC (14)
console.log('=== SLC ===');
processCity('const SLC_DATA', [
  {name:"Vongole Pasta",cuisine:"Italian / Pasta",neighborhood:"Sugar House",score:83,price:2,tags:["Italian","Wine Bar","Date Night","Local Favorites"],description:"Handmade pasta and wine destination in Sugar House with 50+ curated bottles.",address:"1405 E 2100 S, Salt Lake City, UT 84105",lat:40.7199,lng:-111.8469,instagram:"@vongolepastautah",website:"https://vongolepastautah.com"},
  {name:"Kiitos Brewing Sugar House",cuisine:"Brewery",neighborhood:"Sugar House",score:80,price:1,tags:["Casual","Local Favorites","Patio"],description:"SLC beloved brewery opened its Sugar House neighborhood bar in 2025.",address:"1533 S 1100 E, Salt Lake City, UT 84105",lat:40.7212,lng:-111.8590,instagram:"@kiitosbrewing",website:"https://kiitosbrewing.com"},
  {name:"Sugar House Station",cuisine:"Food Hall",neighborhood:"Sugar House",score:82,price:1,tags:["Casual","Family Friendly","Local Favorites"],description:"10,000 sq ft food hall with 11 stalls and five bar programs including Waterpocket Distillery.",address:"2100 S Highland Dr, Salt Lake City, UT 84106",lat:40.7200,lng:-111.8620,instagram:"@sugarhousestation",website:"https://sugarhousestation.com"},
  {name:"Kaneo",cuisine:"Mediterranean / Macedonian",neighborhood:"Park City",score:84,price:2,tags:["Mediterranean","Cocktails","Date Night"],description:"Warm Main Street destination celebrating Macedonian and Mediterranean flavors.",address:"508 Main St, Park City, UT 84060",lat:40.6443,lng:-111.4979,instagram:"@kaneo_pc",website:"https://kaneoonmain.com"},
  {name:"Brownstone 22",cuisine:"Cocktail Bar",neighborhood:"Downtown SLC",score:82,price:2,tags:["Cocktails","Bar","Date Night","Late Night"],indicators:["new-opening"],description:"Sister bar to James Beard finalist Felt Bar in a historic bank building with craft cocktails.",address:"22 E Broadway, Salt Lake City, UT 84111",lat:40.7602,lng:-111.8891,instagram:"@brownstone22slc",website:"https://brownstone22.com"},
  {name:"Pitada Brazil",cuisine:"Brazilian",neighborhood:"Provo",score:78,price:1,tags:["Casual","Local Favorites","Family Friendly"],indicators:["hidden-gem"],description:"Authentic Brazilian with family recipes at the best price-to-quality ratio in Utah Valley.",address:"785 W State St, Orem, UT 84057",lat:40.2994,lng:-111.7236,instagram:"@pitadabrazilorem",website:"https://pitadabrazil.com"},
  {name:"White Horse Spirits & Kitchen",cuisine:"American / Cocktail Bar",neighborhood:"Downtown SLC",score:83,price:2,tags:["Cocktails","Bar","Date Night","Late Night"],description:"Downtown craft cocktail bar and kitchen with an inventive seasonal menu.",address:"325 S Main St, Salt Lake City, UT 84111",lat:40.7600,lng:-111.8910,instagram:"@whitehorseslc",website:""},
  {name:"Laziz Kitchen",cuisine:"Middle Eastern / Mediterranean",neighborhood:"Downtown SLC",score:85,price:2,tags:["Middle Eastern","Casual","Local Favorites","Vegetarian Friendly"],indicators:["hidden-gem"],description:"Lebanese-Mediterranean kitchen beloved for falafel, shawarma, and house-baked pita.",address:"912 S Jefferson St, Salt Lake City, UT 84101",lat:40.7475,lng:-111.8935,instagram:"@lazizkitchen",website:""},
  {name:"Stoneground Italian Kitchen",cuisine:"Italian",neighborhood:"Provo",score:82,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Scratch-made Italian with housemade pasta and wood-fired pizzas in downtown Provo.",address:"249 W 100 N, Provo, UT 84601",lat:40.2360,lng:-111.6620,instagram:"@stonegroundslc",website:""},
  {name:"The Rose Establishment",cuisine:"Coffee / Brunch",neighborhood:"Downtown SLC",score:84,price:2,tags:["Bakery/Coffee","Brunch","Local Favorites"],indicators:["hidden-gem"],description:"Downtown SLC beloved all-day cafe with specialty coffee, pastries, and seasonal brunch.",address:"235 S 400 W, Salt Lake City, UT 84101",lat:40.7620,lng:-111.9010,instagram:"@theroseestablishment",website:""},
]);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
