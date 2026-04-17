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
  // Strict duplicate check
  const lower = s.name.toLowerCase();
  if(existing.has(lower)) { return; }
  // Also check partial matches for multi-location spots
  const first2 = lower.split(' ').slice(0,2).join(' ');
  const partialMatch = arr.find(r => r.name.toLowerCase() === lower || r.name.toLowerCase().startsWith(first2+'(') || r.name.toLowerCase().startsWith(first2+' ('));
  if(partialMatch && !s.name.includes('(')) { console.log('SKIP (partial):', s.name, '~', partialMatch.name); return; }

  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation=s.reservation||'walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Only genuinely new spots from the research
add({name:'Mercado Sin Nombre',cuisine:'Mexican / Coffee',neighborhood:'East Austin',score:88,price:1,tags:['Mexican','Bakery/Coffee','Casual','Critics Pick','Local Favorites'],indicators:['hidden-gem'],description:'Michelin Bib Gourmand East Austin cafe focused on Mexican heirloom corn dishes and specialty Mexican coffee.',address:'408 N Pleasant Valley Rd, Austin, TX 78702',lat:30.2658,lng:-97.7121,instagram:'@mercadosinnombre',website:'https://mercadosinnombre.com'});
add({name:'La Santa Barbacha',cuisine:'Mexican / Barbacoa',neighborhood:'East Austin',score:87,price:1,tags:['Mexican','Casual','Local Favorites','Brunch'],indicators:['hole-in-wall'],description:'Michelin Bib Gourmand sibling-run barbacoa food truck rooted in Central Mexican tradition, open early mornings.',address:'2806 Manor Rd, Austin, TX 78722',lat:30.2857,lng:-97.7115,instagram:'@lasantabarbacha',website:'https://lasantabarbacha.com'});
add({name:'Fish Shop',cuisine:'Seafood',neighborhood:'East Austin',score:87,price:3,tags:['Seafood','Date Night','Local Favorites','Critics Pick'],indicators:['new-opening'],description:'Texas Monthly best new restaurant serving Dungeness crab cocktail, halibut crudo, and Gulf oysters on East 6th.',address:'1401 E 6th St Ste 201, Austin, TX 78702',lat:30.2624,lng:-97.7209,instagram:'@fishshopatx',website:'https://fishshopatx.com'});
add({name:'Siti',cuisine:'Southeast Asian',neighborhood:'East Austin',score:86,price:3,tags:['Asian Fusion','Date Night','Local Favorites','Critics Pick'],indicators:['new-opening'],description:'Michelin-recommended restaurant celebrating cuisines of Singapore, Malaysia, Indonesia, Thailand, and the Philippines.',address:'1123 E 11th St, Austin, TX 78702',lat:30.2745,lng:-97.7283,instagram:'@sitiatx',website:'https://sitiatx.com'});
add({name:'Pasta|Bar Austin',cuisine:'Italian / Tasting Menu',neighborhood:'East Austin',score:88,price:4,tags:['Italian','Fine Dining','Date Night','Exclusive','Tasting Menu'],indicators:['hidden-gem'],description:'Michelin-recommended hidden tasting-menu pasta bar tucked inside the Corazon building on East 6th.',address:'1017 E 6th St, Austin, TX 78702',lat:30.2626,lng:-97.7225,instagram:'@pastabaraustin',website:'https://pastabaraustin.com'});
add({name:'Fabrik',cuisine:'Plant-Based Fine Dining',neighborhood:'East Austin',score:87,price:4,tags:['Vegetarian Friendly','Fine Dining','Date Night','Tasting Menu'],indicators:['hidden-gem'],description:'Austin first 100% plant-based micro tasting restaurant with locally sourced seasonal produce-driven menus.',address:'1701 E MLK Jr Blvd Ste 102, Austin, TX 78702',lat:30.2787,lng:-97.7215,instagram:'@fabrikatx',website:'https://fabrikatx.com'});
add({name:'Poeta',cuisine:'Italian',neighborhood:'East Austin',score:89,price:3,tags:['Italian','Date Night','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Michelin-recommended Italian featuring approachable, ingredient-driven Texas-sourced pasta dishes.',address:'1108 E 6th St, Austin, TX 78702',lat:30.2626,lng:-97.7242,instagram:'@poetarestaurant',website:'https://poetarestaurant.com'});
add({name:'Meanwhile Brewing Co.',cuisine:'Brewery / Beer Garden',neighborhood:'South Austin',score:82,price:2,tags:['Beer Garden','Patio','Live Music','Dog Friendly','Casual'],indicators:[],description:'Beloved East Austin brewery and sprawling outdoor beer garden hosting food trucks and live music events.',address:'3901 Promontory Point Dr, Austin, TX 78744',lat:30.2242,lng:-97.7489,instagram:'@meanwhilebeer',website:'https://meanwhilebeer.com'});
add({name:'Briscuits',cuisine:'BBQ',neighborhood:'South Austin',score:87,price:2,tags:['BBQ','Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Michelin Bib Gourmand BBQ food truck at Radio Coffee known for precisely smoked brisket and creative sides.',address:'4204 Menchaca Rd, Austin, TX 78704',lat:30.2315,lng:-97.7877,instagram:'@briscuits512',website:'https://briscuits.com'});
add({name:'Radio Coffee & Beer',cuisine:'Coffee / Bar',neighborhood:'South Austin',score:83,price:1,tags:['Bakery/Coffee','Live Music','Patio','Dog Friendly','Casual'],indicators:['iconic'],description:'Austin Chronicle Best Coffee Shop winner with espresso, craft beer, food trucks, and live music on Menchaca.',address:'4204 Manchaca Rd, Austin, TX 78704',lat:30.2315,lng:-97.7877,instagram:'@radiocoffeeandbeer',website:'https://radiocoffeeandbeer.com'});
add({name:'Paperboy South',cuisine:'Breakfast / Brunch',neighborhood:'South Lamar',score:84,price:2,tags:['Brunch','Casual','Cocktails','Local Favorites'],indicators:[],description:'South Lamar outpost of beloved breakfast staple with scratch biscuit sandwiches, pancakes, and cocktails.',address:'1401 S Lamar Blvd, Austin, TX 78704',lat:30.2557,lng:-97.7623,instagram:'@paperboyaustin',website:'https://paperboyaustin.com'});
add({name:'Blue Apsara',cuisine:'Cambodian',neighborhood:'South Lamar',score:85,price:2,tags:['Asian Fusion','Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Authentic Cambodian food truck at Frond Plant Shop, a CultureMap Tastemaker Award nominee.',address:'1904 S Lamar Blvd, Austin, TX 78704',lat:30.2514,lng:-97.7648,instagram:'@blueapsarakitchen',website:'https://blueapsarakitchen.com'});
add({name:'Bouldin Creek Cafe',cuisine:'Vegetarian / Cafe',neighborhood:'South Austin',score:81,price:1,tags:['Vegetarian Friendly','Brunch','Casual','Local Favorites','Patio'],indicators:['iconic'],description:'Independent woman-owned vegetarian cafe with scratch-made comfort food and handcrafted coffee since 2000.',address:'1900 S 1st St, Austin, TX 78704',lat:30.2515,lng:-97.7545,instagram:'@bouldincreekcafeatx',website:'https://bouldincreekcafe.com'});
add({name:'Here Nor There',cuisine:'Cocktail Bar',neighborhood:'Downtown',score:91,price:3,tags:['Cocktails','Bar','Date Night','Late Night','Exclusive'],indicators:['hidden-gem'],description:'World 50 Best-listed hidden cocktail lounge beneath an alleyway beside the Driskill Hotel with daily-changing door code.',address:'612 Brazos St, Austin, TX 78701',lat:30.2683,lng:-97.7395,instagram:'@hntaustin',website:'https://hntaustin.com'});
add({name:'Houndstooth Coffee',cuisine:'Specialty Coffee',neighborhood:'Downtown',score:85,price:2,tags:['Bakery/Coffee','Casual','Local Favorites'],indicators:[],description:'Flagship specialty coffee in the Frost Bank Tower with single-origin pour-overs and perfect cappuccinos.',address:'401 Congress Ave Ste 100C, Austin, TX 78701',lat:30.2680,lng:-97.7433,instagram:'@houndstoothcoffee',website:'https://houndstoothcoffee.com'});
add({name:'Epoch Coffee',cuisine:'Coffee / Cafe',neighborhood:'North Loop',score:80,price:1,tags:['Bakery/Coffee','Late Night','Casual','Local Favorites'],indicators:['iconic'],description:'Austin beloved near-24-hour coffee house on North Loop, a neighborhood institution for students and night-owls since 2005.',address:'221 W North Loop Blvd, Austin, TX 78751',lat:30.3186,lng:-97.7246,instagram:'@epochcoffee',website:'https://epochcoffee.com'});
add({name:'Saxon Pub',cuisine:'Bar / Live Music',neighborhood:'South Lamar',score:80,price:1,tags:['Live Music','Bar','Local Favorites','Late Night','Casual'],indicators:['iconic'],description:'Austin live music institution since 1990 hosting 22,000+ performances in an intimate South Lamar venue.',address:'1320 S Lamar Blvd, Austin, TX 78704',lat:30.2543,lng:-97.7622,instagram:'@thesaxonpub',website:'https://thesaxonpub.com'});
add({name:'Ramen Del Barrio',cuisine:'Ramen / Mexican-Japanese',neighborhood:'North Austin',score:87,price:1,tags:['Japanese','Mexican','Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Michelin Bib Gourmand Mexican-Japanese ramen shop featured on Diners, Drive-Ins and Dives.',address:'5420 Airport Blvd, Austin, TX 78751',lat:30.3218,lng:-97.7141,instagram:'@ramen_del_barrio',website:'https://ramendelbarrio.com'});
add({name:'Oddwood Brewing',cuisine:'Brewery / Pizza',neighborhood:'East Austin',score:82,price:2,tags:['Beer Garden','Pizza','Casual','Patio','Dog Friendly'],indicators:[],description:'East Austin neighborhood brewery on Manor Rd pairing craft ales with bar-style pizzas.',address:'3108 Manor Rd, Austin, TX 78723',lat:30.2868,lng:-97.7054,instagram:'@oddwoodbrewing',website:'https://oddwoodbrewing.com'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Austin total:', arr.length);
