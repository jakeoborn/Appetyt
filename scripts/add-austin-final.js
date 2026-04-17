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
  s.reservation=s.reservation||'walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// STEAKHOUSES
add({name:"Bob's Steak & Chop House",cuisine:'Steakhouse',neighborhood:'Downtown',score:87,price:4,tags:['Steakhouse','Fine Dining','Date Night','Celebrations'],indicators:[],description:'Classic American chophouse known for prime-aged steaks and the signature glazed carrot side.',address:'301 Lavaca St, Austin, TX 78701',lat:30.2659,lng:-97.7460,instagram:'@bobssteakandchophouse',website:'https://www.bobs-steakandchop.com',reservation:'OpenTable'});
add({name:'III Forks',cuisine:'Steakhouse',neighborhood:'Downtown',score:87,price:4,tags:['Steakhouse','Fine Dining','Date Night','Seafood'],indicators:[],description:'Elegant downtown steakhouse for USDA prime beef and fresh cold-water lobster near 2nd Street District.',address:'111 Lavaca St, Austin, TX 78701',lat:30.2638,lng:-97.7461,instagram:'@iiiforks',website:'https://www.3forks.com',reservation:'OpenTable'});
add({name:"Fleming's Prime Steakhouse",cuisine:'Steakhouse',neighborhood:'North Austin',score:86,price:4,tags:['Steakhouse','Fine Dining','Date Night','Wine Bar'],indicators:[],description:'Polished national steakhouse with an extensive wine program and prime cuts at the Arboretum.',address:'10000 Research Blvd, Austin, TX 78759',lat:30.4006,lng:-97.7467,instagram:'@flemingssteakhouse',website:'https://www.flemingssteakhouse.com',reservation:'OpenTable'});
add({name:"Ruth's Chris Steak House",cuisine:'Steakhouse',neighborhood:'Downtown',score:86,price:4,tags:['Steakhouse','Fine Dining','Date Night','Celebrations'],indicators:[],description:'Iconic national steakhouse serving USDA prime beef sizzled in butter — a classic for business dinners.',address:'107 W 6th St, Austin, TX 78701',lat:30.2687,lng:-97.7443,instagram:'@ruthschrissteakhouse',website:'https://www.ruthschris.com',reservation:'OpenTable'});
add({name:'Austin Land & Cattle',cuisine:'Steakhouse',neighborhood:'North Lamar',score:85,price:3,tags:['Steakhouse','Local Favorites','Date Night','Casual'],indicators:['iconic'],description:'Austin only independent family-owned steakhouse at 12th and Lamar with hand-cut steaks and Texas hospitality.',address:'1205 N Lamar Blvd, Austin, TX 78703',lat:30.2757,lng:-97.7538,instagram:'@alcsteaks',website:'https://www.alcsteaks.com',reservation:'OpenTable'});
add({name:'Maie Day',cuisine:'Steakhouse / New American',neighborhood:'South Congress',score:88,price:3,tags:['Steakhouse','Date Night','Cocktails','Critics Pick','Patio'],indicators:['hidden-gem'],description:'Michelin-recommended casual steakhouse inside South Congress Hotel celebrating prime cuts and craft cocktails.',address:'1603 S Congress Ave, Austin, TX 78704',lat:30.2419,lng:-97.7497,instagram:'@maiedayatx',website:'https://www.maieday.com',reservation:'Resy'});
add({name:"Eddie V's Prime Seafood",cuisine:'Steakhouse / Seafood',neighborhood:'North Austin',score:87,price:4,tags:['Steakhouse','Seafood','Fine Dining','Date Night','Live Music'],indicators:[],description:'Austin-born upscale chophouse pairing prime steaks with fresh seafood and live jazz at the Arboretum.',address:'9400 Arboretum Blvd, Austin, TX 78759',lat:30.3998,lng:-97.7479,instagram:'@eddievs',website:'https://www.eddievs.com',reservation:'OpenTable'});
add({name:'Quality Seafood Market',cuisine:'Seafood / Steakhouse',neighborhood:'North Loop',score:85,price:2,tags:['Steakhouse','Seafood','Casual','Local Favorites'],indicators:['iconic'],description:'Austin institution since 1938 — a fish market and no-frills restaurant with Gulf Coast seafood and steaks.',address:'5621 Airport Blvd, Austin, TX 78751',lat:30.3225,lng:-97.7111,instagram:'@qualityseafoodmarket',website:'',reservation:'walk-in'});

// DIVE BARS
add({name:"Donn's Depot",cuisine:'Dive Bar / Honky-Tonk',neighborhood:'Downtown',score:84,price:1,tags:['Dive Bar','Live Music','Local Favorites','Late Night','Casual'],indicators:['iconic','dive-bar'],description:'America best dive bar — a train-depot honky-tonk with live country music nightly and famously cheap drinks.',address:'1600 W 5th St, Austin, TX 78703',lat:30.2741,lng:-97.7633,instagram:'@donnsdepot',website:'',reservation:'walk-in'});
add({name:'The Cloak Room',cuisine:'Dive Bar',neighborhood:'Downtown',score:83,price:1,tags:['Dive Bar','Local Favorites','Late Night','Casual'],indicators:['dive-bar'],description:'Subterranean dive beneath the Capitol — cash only, cheap beer, and 60+ years of political gossip.',address:'1300 Colorado St, Austin, TX 78701',lat:30.2773,lng:-97.7433,instagram:'',website:'',reservation:'walk-in'});
add({name:'Hole in the Wall',cuisine:'Dive Bar / Music Venue',neighborhood:'Downtown',score:84,price:1,tags:['Dive Bar','Live Music','Local Favorites','Late Night'],indicators:['iconic','dive-bar'],description:'Historic UT-adjacent dive bar since 1974 where countless Austin acts got their start with cheap pitchers and nightly bands.',address:'2538 Guadalupe St, Austin, TX 78705',lat:30.2900,lng:-97.7416,instagram:'@hitwaustin',website:'https://www.holeinthewallaustin.com',reservation:'walk-in'});
add({name:'Deep Eddy Cabaret',cuisine:'Dive Bar',neighborhood:'Downtown',score:83,price:1,tags:['Dive Bar','Local Favorites','Late Night','Casual'],indicators:['iconic','dive-bar'],description:'Austin oldest bar (est. 1951) named after the nearby swimming hole — classic jukebox dive with pool tables.',address:'2315 Lake Austin Blvd, Austin, TX 78703',lat:30.2778,lng:-97.7726,instagram:'@deepeddycabaret',website:'https://deepeddycabaret.com',reservation:'walk-in'});
add({name:"Ego's",cuisine:'Dive Bar / Karaoke',neighborhood:'South Congress',score:82,price:1,tags:['Dive Bar','Karaoke','Late Night','Local Favorites'],indicators:['dive-bar'],description:'Austin karaoke HQ since 1979 — underground dive hidden behind a gas station with free nightly karaoke.',address:'510 S Congress Ave, Austin, TX 78704',lat:30.2609,lng:-97.7497,instagram:'@egosbaratx',website:'',reservation:'walk-in'});
add({name:"Barfly's",cuisine:'Dive Bar',neighborhood:'North Loop',score:82,price:1,tags:['Dive Bar','Local Favorites','Late Night','Patio'],indicators:['dive-bar'],description:'Intimate North Austin dive with cheap drinks, robust jukebox, foosball, pool, and a friendly patio since 2001.',address:'5420 Airport Blvd, Austin, TX 78751',lat:30.3167,lng:-97.7142,instagram:'@barflysatx',website:'http://www.barflysaustin.com',reservation:'walk-in'});
add({name:'Grackle',cuisine:'Dive Bar',neighborhood:'East Austin',score:83,price:1,tags:['Dive Bar','Local Favorites','Late Night','Casual'],indicators:['dive-bar'],description:'Defiant Keep Austin Weird dive on the trendy East Side — jukebox, darts, pool table, and $3 beers.',address:'1700 E 2nd St, Austin, TX 78702',lat:30.2610,lng:-97.7207,instagram:'@thegrackle',website:'',reservation:'walk-in'});
add({name:'The Volstead Lounge',cuisine:'Dive Bar',neighborhood:'East Austin',score:82,price:1,tags:['Dive Bar','Late Night','Local Favorites','Patio'],indicators:['dive-bar'],description:'East 6th Street dive with a hidden back patio and cheap drinks bucking the street increasingly upscale trend.',address:'1500 E 6th St, Austin, TX 78702',lat:30.2629,lng:-97.7283,instagram:'@volsteadlounge',website:'',reservation:'walk-in'});

// DOG FRIENDLY
add({name:'Yard Bar',cuisine:'American / Dog Bar',neighborhood:'North Austin',score:86,price:2,tags:['Dog Friendly','Beer Garden','Patio','Casual','Local Favorites'],indicators:[],description:'Austin ultimate dog bar — massive fenced dog playground with picnic tables, craft beer, and food.',address:'6700 Burnet Rd, Austin, TX 78757',lat:30.3441,lng:-97.7400,instagram:'@yardbardogs',website:'https://yardbar.com',reservation:'walk-in'});
add({name:'Bouldin Acres',cuisine:'American / Food Trucks',neighborhood:'South Lamar',score:85,price:1,tags:['Dog Friendly','Patio','Casual','Local Favorites'],indicators:[],description:'Sprawling former car dealership turned dog-friendly outdoor dining compound with food trucks and a fenced dog park.',address:'2027 S Lamar Blvd, Austin, TX 78704',lat:30.2487,lng:-97.7671,instagram:'@bouldinacres',website:'',reservation:'walk-in'});
add({name:'Cosmic Coffee + Beer Garden',cuisine:'Coffee / Beer Garden',neighborhood:'South Austin',score:85,price:1,tags:['Dog Friendly','Beer Garden','Bakery/Coffee','Patio','Live Music','Local Favorites'],indicators:[],description:'South Austin cosmic outdoor compound with dog-friendly grounds, food trucks, and a laid-back vibe under heritage oaks.',address:'121 Pickle Rd, Austin, TX 78704',lat:30.2329,lng:-97.7655,instagram:'@cosmiccoffeeaustin',website:'',reservation:'walk-in'});
add({name:'Gourmands Neighborhood Pub',cuisine:'Gastropub',neighborhood:'East Austin',score:85,price:1,tags:['Dog Friendly','Casual','Patio','Local Favorites','Happy Hour'],indicators:[],description:'East Austin gastropub with a beloved dog-friendly patio, craft beer, and elevated pub food.',address:'2316 Webberville Rd, Austin, TX 78702',lat:30.2574,lng:-97.7116,instagram:'@gourmandspub',website:'',reservation:'walk-in'});

// SEAFOOD
add({name:'Salt Traders Coastal Cooking',cuisine:'Seafood',neighborhood:'West Austin',score:86,price:3,tags:['Seafood','Date Night','Local Favorites'],indicators:[],description:'Upscale coastal seafood inspired by Gulf Coast to New England flavors — fresh fish, oysters, and classics.',address:'1101 S MoPac Expy, Austin, TX 78746',lat:30.2699,lng:-97.8106,instagram:'@salttraders',website:'',reservation:'OpenTable'});
add({name:"Garbo's Lobster",cuisine:'Seafood / Lobster',neighborhood:'North Lamar',score:86,price:2,tags:['Seafood','Casual','Local Favorites'],indicators:['hidden-gem'],description:'Authentic New England lobster in Austin — fresh Maine lobster flown in daily with the Connecticut Roll a must-order.',address:'626 N Lamar Blvd, Austin, TX 78703',lat:30.2734,lng:-97.7542,instagram:'@garbosaustin',website:'',reservation:'walk-in'});

// ROOFTOP
add({name:'Azul Rooftop Bar',cuisine:'Cocktail Bar',neighborhood:'Downtown',score:85,price:3,tags:['Rooftop','Cocktails','Date Night','Scenic'],indicators:[],description:'Glamorous poolside rooftop bar 20 floors atop The Westin with breathtaking skyline views and upscale cocktails.',address:'310 E 5th St, Austin, TX 78701',lat:30.2662,lng:-97.7408,instagram:'@azulrooftop',website:'',reservation:'walk-in'});
add({name:'La Piscina at Austin Proper',cuisine:'Rooftop Mexican / Cocktails',neighborhood:'Downtown',score:87,price:3,tags:['Rooftop','Cocktails','Date Night','Mexican','Scenic'],indicators:[],description:'Fifth-floor poolside rooftop at Austin Proper Hotel with upscale coastal Mexican cuisine and sweeping downtown views.',address:'600 W 2nd St, Austin, TX 78701',lat:30.2638,lng:-97.7493,instagram:'@austinproper',website:'',reservation:'Resy'});

// BEER GARDENS
add({name:'Austin Beer Garden Brewing Co.',cuisine:'Brewery / Beer Garden',neighborhood:'South Austin',score:86,price:2,tags:['Beer Garden','Patio','Pizza','Live Music','Local Favorites','Dog Friendly'],indicators:['iconic'],description:'South Austin favorite brewery beer garden with communal picnic tables, house-brewed craft beers, and wood-fired pizza.',address:'1305 W Oltorf St, Austin, TX 78704',lat:30.2423,lng:-97.7640,instagram:'@theabgb',website:'https://theabgb.com',reservation:'walk-in'});
add({name:'Draught House Pub & Brewery',cuisine:'Brewery / Beer Garden',neighborhood:'North Loop',score:85,price:2,tags:['Beer Garden','Patio','Local Favorites','Dog Friendly','Casual'],indicators:[],description:'Allandale neighborhood brewery with a sprawling tree-shaded beer garden, 80+ taps, and a dog-friendly backyard patio.',address:'4112 Medical Pkwy, Austin, TX 78756',lat:30.3267,lng:-97.7390,instagram:'@draughthouse',website:'',reservation:'walk-in'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Austin total:', arr.length);
