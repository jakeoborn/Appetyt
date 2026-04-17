const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const AUSTIN_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let count = 0;

function add(s){
  const lower = s.name.toLowerCase();
  if(existing.has(lower)) { console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation='walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Food trucks
add({name:'Dee Dee',cuisine:'Thai / Food Truck',neighborhood:'South Austin',score:85,price:1,tags:['Casual','Thai','Local Favorites'],indicators:['hidden-gem'],description:'Husband-and-wife trailer serving bold Northeastern Thai street food rooted in the Thai countryside.',address:'4204 Menchaca Rd, Austin, TX 78704',lat:30.2316,lng:-97.7881,instagram:'@deedeeatx',website:'https://deedeeatx.com'});
add({name:'Spicy Boys Fried Chicken',cuisine:'Fried Chicken / Food Truck',neighborhood:'South Austin',score:83,price:1,tags:['Casual','Local Favorites','Late Night'],indicators:['hole-in-wall'],description:'Pan-Asian-inspired hot chicken trailer at St. Elmo Brewing Co. with fiery wings and creative sauces.',address:'440 E St Elmo Rd, Austin, TX 78745',lat:30.2155,lng:-97.7624,instagram:'@spicyboyschicken',website:'https://spicyboyschicken.com'});

// Coffee
add({name:'Cuvee Coffee',cuisine:'Specialty Coffee',neighborhood:'East Austin',score:82,price:1,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:[],description:'Austin roaster since 1998 and pioneer of nitro cold brew, serving craft coffee alongside beer and wine.',address:'2000 E 6th St, Austin, TX 78702',lat:30.2635,lng:-97.7218,instagram:'@cuveecoffee',website:'https://cuveecoffee.com'});
add({name:'Fleet Coffee',cuisine:'Specialty Coffee',neighborhood:'East Austin',score:81,price:1,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:['hidden-gem'],description:'Tiny triangular East Austin cafe known for inventive espresso drinks and meticulously sourced rotating coffee.',address:'2427 Webberville Rd, Austin, TX 78702',lat:30.2627,lng:-97.7144,instagram:'@fleetcoffeeco',website:'https://fleetcoffee.com'});
add({name:"Barrett's Coffee",cuisine:'Specialty Coffee',neighborhood:'North Loop',score:80,price:1,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:[],description:'Neighborhood roaster serving exceptional single-origin brews in a warm, unhurried setting.',address:'713 W St Johns Ave, Austin, TX 78752',lat:30.3237,lng:-97.7414,instagram:'@barrettscoffee',website:'https://barrettscoffee.com'});
add({name:'Spokesman Coffee',cuisine:'Specialty Coffee',neighborhood:'South Austin',score:80,price:1,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:[],description:'South Austin specialty roaster known for precision brewing and a relaxed, bike-friendly atmosphere.',address:'440 E St Elmo Rd, Austin, TX 78745',lat:30.2155,lng:-97.7624,instagram:'@spokesmancoffee',website:'https://spokesmancoffee.com'});

// Ice cream
add({name:'Lick Honest Ice Creams',cuisine:'Ice Cream / Dessert',neighborhood:'South Lamar',score:84,price:1,tags:['Casual','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Austin beloved local creamery crafting seasonal scoops from Texas-sourced ingredients like goat cheese and thyme.',address:'1100 S Lamar Blvd, Austin, TX 78704',lat:30.2583,lng:-97.7561,instagram:'@lickhonesticecreams',website:'https://ilikelick.com'});

// Breweries
add({name:'Live Oak Brewing Company',cuisine:'Brewery',neighborhood:'South Austin',score:84,price:1,tags:['Casual','Patio','Dog Friendly','Local Favorites'],indicators:['iconic'],description:'Austin oldest craft brewery on 22 pastoral acres, celebrated for traditional German-style lagers.',address:'1615 Crozier Ln, Del Valle, TX 78617',lat:30.1845,lng:-97.6712,instagram:'@liveoakbrewing',website:'https://liveoakbrewing.com'});
add({name:'Austin Beerworks',cuisine:'Brewery',neighborhood:'North Austin',score:82,price:1,tags:['Casual','Dog Friendly','Family Friendly','Local Favorites'],indicators:[],description:'Quality-obsessed Austin brewery with spacious taproom, dog runs, a playground, and bold hop-forward beers.',address:'3001 Industrial Ter, Austin, TX 78758',lat:30.3698,lng:-97.7148,instagram:'@austinbeerworks',website:'https://austinbeerworks.com'});

// Tex-Mex classics
add({name:"Matt's El Rancho",cuisine:'Tex-Mex',neighborhood:'South Lamar',score:85,price:2,tags:['Mexican','Local Favorites','Family Friendly','Casual'],indicators:['iconic'],description:'Austin most storied Tex-Mex institution since 1952, famous for Bob Famous Queso and sizzling fajitas.',address:'2613 S Lamar Blvd, Austin, TX 78704',lat:30.2421,lng:-97.7734,instagram:'@mattselrancho',website:'https://mattselrancho.com'});
add({name:"Guero's Taco Bar",cuisine:'Tex-Mex',neighborhood:'South Congress',score:84,price:2,tags:['Mexican','Live Music','Patio','Local Favorites'],indicators:['iconic'],description:'Funky South Congress landmark with oak garden patio, live music, and 30-plus years of beloved Tex-Mex.',address:'1412 S Congress Ave, Austin, TX 78704',lat:30.2497,lng:-97.7497,instagram:'@guerostacobar',website:'https://gueros.com'});
add({name:"Chuy's",cuisine:'Tex-Mex',neighborhood:'Zilker',score:82,price:2,tags:['Mexican','Casual','Family Friendly','Local Favorites'],indicators:['iconic'],description:'The kitschy original on Barton Springs Road where the queso flows with green chili and ranchero upgrades.',address:'1728 Barton Springs Rd, Austin, TX 78704',lat:30.2622,lng:-97.7665,instagram:'@chuystexmex',website:'https://chuys.com'});

// Late night / diners
add({name:'24 Diner',cuisine:'American Diner',neighborhood:'Downtown',score:79,price:1,tags:['Late Night','Casual','Local Favorites','Brunch'],indicators:[],description:'Austin go-to upscale diner open 24 hours Thursday through Saturday with scratch-made comfort food.',address:'600 N Lamar Blvd, Austin, TX 78703',lat:30.2747,lng:-97.7534,instagram:'@24dineratx',website:'https://24diner.com'});

// More bars/venues
add({name:'Violet Crown Social Club',cuisine:'Bar / Pizza',neighborhood:'East Austin',score:79,price:1,tags:['Bar','Late Night','Casual','Local Favorites','Pizza'],indicators:[],description:'East-side lounge famous for Orange Whip cocktails, rotating taps, and Detroit-style pizza from Via 313.',address:'1111 E 6th St, Austin, TX 78702',lat:30.2626,lng:-97.7313,instagram:'@violet.crown.social.club',website:'https://violetcrownsocialclub.com'});

// South Congress spots
add({name:'Cafe No Se',cuisine:'Cafe / Brunch',neighborhood:'South Congress',score:82,price:2,tags:['Brunch','Cocktails','Casual','Date Night'],indicators:[],description:'Sunny corner cafe inside South Congress Hotel with seasonal brunch, housemade pastries, and craft cocktails.',address:'1603 S Congress Ave, Austin, TX 78704',lat:30.2479,lng:-97.7494,instagram:'@cafenoseatx',website:'https://southcongresshotel.com/eat-drink'});
add({name:'Manana',cuisine:'Coffee / Bakery',neighborhood:'South Congress',score:80,price:1,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:[],description:'South Congress Hotel grab-and-go coffee and bake shop with specialty matcha, seasonal paletas, and breakfast tacos.',address:'1603 S Congress Ave, Austin, TX 78704',lat:30.2479,lng:-97.7494,instagram:'@mananatx',website:'https://southcongresshotel.com/eat-drink'});

// Paperboy
add({name:'Paperboy',cuisine:'Breakfast / Brunch',neighborhood:'East Austin',score:83,price:1,tags:['Brunch','Casual','Local Favorites','Patio'],indicators:[],description:'Beloved East Austin all-day brunch spot with seasonal Texas hash and fluffy pancakes.',address:'1203 E 11th St, Austin, TX 78702',lat:30.2706,lng:-97.7268,instagram:'@eat.paperboy',website:'https://eatpaperboy.com'});

// Zilker area
add({name:'The Picnic',cuisine:'Food Truck Park',neighborhood:'Zilker',score:80,price:1,tags:['Casual','Family Friendly','Patio','Local Favorites'],indicators:[],description:'Austin premier food trailer park one block from Zilker Park with rotating acclaimed trucks under shaded pavilions.',address:'1720 Barton Springs Rd, Austin, TX 78704',lat:30.2622,lng:-97.7689,instagram:'@picnicaustin',website:'https://thepicnicaustin.com'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Austin total:', arr.length);
