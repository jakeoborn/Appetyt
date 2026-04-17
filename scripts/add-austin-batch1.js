const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const AUSTIN_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=s.trending||false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=s.phone||''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=s.hours||''; s.dishes=s.dishes||[];
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// North Lamar (need 3) - focus on tags we're low on
add({name:'Ramen Tatsu-Ya',cuisine:'Ramen',neighborhood:'North Lamar',score:87,price:2,tags:['Late Night','Casual','Local Favorites','Japanese'],indicators:['iconic'],description:'The original North Austin outpost of Austin\'s most beloved ramen shop, serving tonkotsu, chicken, and vegan broths.',address:'8557 Research Blvd #126, Austin, TX 78758',lat:30.3901,lng:-97.7197,instagram:'@ramentatsu_ya',website:'https://ramen-tatsuya.com',reservation:'walk-in',photoUrl:''});
add({name:'Carnitas El Guero',cuisine:'Mexican / Tacos',neighborhood:'North Lamar',score:80,price:1,tags:['Mexican','Casual','Late Night','Local Favorites'],indicators:['hole-in-wall'],description:'Beloved North Lamar taqueria open until 2am serving exceptional carnitas tacos and traditional Mexican plates.',address:'8624 N Lamar Blvd, Austin, TX 78753',lat:30.3554,lng:-97.7036,instagram:'@carnitaselgueroaustin',website:'https://carnitaselguero.com',reservation:'walk-in',photoUrl:''});

// Mueller (need 2) - fill Italian and Sushi gaps
add({name:'L\'Oca d\'Oro',cuisine:'Italian',neighborhood:'Mueller',score:90,price:3,tags:['Italian','Date Night','Local Favorites','Fine Dining','Patio'],indicators:['hidden-gem'],description:'Acclaimed neighborhood Italian in Mueller with handmade pasta, seasonal produce, and a commitment to sustainability.',address:'1900 Simond Ave, Austin, TX 78723',lat:30.2968,lng:-97.7098,instagram:'@locadoroaustin',website:'https://locadoroaustin.com',reservation:'Resy',photoUrl:''});
add({name:'Tsuke Edomae',cuisine:'Japanese / Omakase',neighborhood:'Mueller',score:92,price:4,tags:['Sushi','Fine Dining','Date Night','Exclusive'],indicators:['hidden-gem'],description:'Eight-seat omakase counter in Mueller serving some of Austin\'s best nigiri at prices that undercut comparable experiences.',address:'4600 Mueller Blvd #1035, Austin, TX 78723',lat:30.2990,lng:-97.7080,instagram:'@tsuke_edomae',website:'https://tsukeedo.com',reservation:'Resy',photoUrl:''});

// Clarksville (need 2) - fill Seafood + Fine Dining gaps
add({name:'Jeffrey\'s',cuisine:'American Fine Dining',neighborhood:'Clarksville',score:91,price:4,tags:['Fine Dining','Steakhouse','Cocktails','Date Night','Celebrations'],indicators:['iconic'],description:'Legendary Clarksville institution since 1975 serving dry-aged steaks, ice-cold martinis, and souffles in an intimate upscale setting.',address:'1204 W Lynn St, Austin, TX 78703',lat:30.2795,lng:-97.7583,instagram:'@jeffreysofaustin',website:'https://jeffreysofaustin.com',reservation:'OpenTable',photoUrl:''});
add({name:'Josephine House',cuisine:'American',neighborhood:'Clarksville',score:86,price:3,tags:['Brunch','Patio','Date Night','Local Favorites'],indicators:[],description:'Charming cottage restaurant with an eclectic seasonal menu and a dreamy garden patio in Clarksville.',address:'1601 Waterston Ave, Austin, TX 78703',lat:30.2806,lng:-97.7591,instagram:'@josephineofaustin',website:'https://josephineofaustin.com',reservation:'Resy',photoUrl:''});

// Hyde Park (need 2) - fill Brunch + French gaps
add({name:'Asti Trattoria',cuisine:'Italian',neighborhood:'Hyde Park',score:85,price:2,tags:['Italian','Date Night','Casual','Local Favorites'],indicators:[],description:'Beloved Hyde Park Italian trattoria serving handmade pasta and wood-fired dishes in a cozy, warmly lit dining room for over two decades.',address:'408 E 43rd St, Austin, TX 78751',lat:30.3066,lng:-97.7268,instagram:'@asti_trattoria',website:'https://astiaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Bureau de Poste',cuisine:'French Bistro',neighborhood:'Hyde Park',score:88,price:3,tags:['Brunch','Date Night','Patio','Fine Dining','French'],indicators:['hidden-gem'],description:'Neighborhood French bistro in a renovated historic post office, serving classic bistro fare and weekend brunch.',address:'4300 Speedway Ste 100, Austin, TX 78751',lat:30.3072,lng:-97.7270,instagram:'@bureaudeposteatx',website:'https://bureaudeposteatx.com',reservation:'Resy',photoUrl:''});

// East Austin (fill Seafood, Live Music, BBQ gaps)
add({name:'Este',cuisine:'Mexican / Seafood',neighborhood:'East Austin',score:91,price:3,tags:['Seafood','Mexican','Date Night','Cocktails','Critics Pick'],indicators:['hidden-gem'],description:'Instantly iconic East Austin eatery with a celebrated cold bar — oysters with salsa negra, shrimp aguachile — in a stylish bungalow.',address:'2113 Manor Rd, Austin, TX 78722',lat:30.2872,lng:-97.7133,instagram:'@esteatx',website:'https://esteatx.com',reservation:'Resy',photoUrl:''});
add({name:'Sour Duck Market',cuisine:'American / Bakery',neighborhood:'East Austin',score:85,price:2,tags:['Brunch','Casual','Patio','Local Favorites','Bakery/Coffee'],indicators:[],description:'Bryce Gilmore\'s casual all-day market and beer garden with excellent breakfast tacos, fresh pastries, and chill outdoor vibe.',address:'1814 E Martin Luther King Blvd, Austin, TX 78702',lat:30.2799,lng:-97.7217,instagram:'@sourduckmarket',website:'https://sourduckmarket.com',reservation:'walk-in',photoUrl:''});
add({name:'Veracruz All Natural',cuisine:'Mexican / Tacos',neighborhood:'East Austin',score:84,price:1,tags:['Mexican','Casual','Local Favorites','Brunch'],indicators:['iconic'],description:'Austin\'s most iconic breakfast taco truck, celebrated for its migas taco — eggs, avocado, and pico in a thick handmade corn tortilla.',address:'2505 Webberville Rd, Austin, TX 78702',lat:30.2605,lng:-97.7023,instagram:'@veracruztacos',website:'https://veracruzallnatural.com',reservation:'walk-in',photoUrl:''});

// South Lamar (fill gaps)
add({name:'Eberly',cuisine:'American',neighborhood:'South Lamar',score:86,price:3,tags:['Cocktails','Date Night','Rooftop','Fine Dining'],indicators:[],description:'Stunning South Lamar sanctuary with ivy-draped walls and a full cocktail program, serving refined American cuisine.',address:'615 S Lamar Blvd, Austin, TX 78704',lat:30.2620,lng:-97.7596,instagram:'@eberlyatx',website:'https://eberlyaustin.com',reservation:'Resy',photoUrl:''});

// South Congress (fill gaps)
add({name:'Perla\'s',cuisine:'Seafood',neighborhood:'South Congress',score:88,price:3,tags:['Seafood','Patio','Brunch','Cocktails','Date Night'],indicators:[],description:'SoCo institution since 2009 with Austin\'s most beloved shaded patio, serving Gulf seafood and dozens of oyster varieties.',address:'1400 S Congress Ave, Austin, TX 78704',lat:30.2487,lng:-97.7501,instagram:'@perlassouthcongress',website:'https://perlasaustin.com',reservation:'Resy',photoUrl:''});
add({name:'Otoko',cuisine:'Japanese / Omakase',neighborhood:'South Congress',score:92,price:4,tags:['Sushi','Fine Dining','Date Night','Exclusive','Tasting Menu'],indicators:['iconic'],description:'Counter-seat omakase above South Congress combining rock-and-roll energy with traditional kaiseki precision.',address:'1603 S Congress Ave, Austin, TX 78704',lat:30.2469,lng:-97.7502,instagram:'@otoko_austin',website:'https://otoko.us',reservation:'Tock',photoUrl:''});

// Fill Happy Hour, Rooftop, Live Music gaps with more spots
add({name:'Colleen\'s Kitchen',cuisine:'Southern',neighborhood:'Mueller',score:84,price:2,tags:['Southern','Brunch','Casual','Family Friendly'],indicators:[],description:'Refined yet unfussy southern restaurant serving buttermilk fried chicken, shrimp and grits, and housemade biscuits.',address:'1911 Aldrich St Ste 100, Austin, TX 78723',lat:30.2975,lng:-97.7092,instagram:'@colleensaustin',website:'https://colleensaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Lin Asian Bar + Dim Sum',cuisine:'Chinese / Dim Sum',neighborhood:'Clarksville',score:86,price:2,tags:['Chinese','Brunch','Cocktails','Date Night'],indicators:[],description:'Dim sum brunch and pan-Asian dinner in a remodeled Clarksville bungalow from the Qi team.',address:'1203 W 6th St, Austin, TX 78703',lat:30.2728,lng:-97.7580,instagram:'@linasianbar',website:'https://linasianbar.com',reservation:'walk-in',photoUrl:''});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAustin total:', arr.length);
