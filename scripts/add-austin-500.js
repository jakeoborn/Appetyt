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

// Breweries
add({name:'St. Elmo Brewing Co.',cuisine:'Brewery',neighborhood:'South Austin',score:82,price:1,tags:['Casual','Patio','Live Music','Dog Friendly','Local Favorites'],indicators:[],description:'South Austin industrial-district brewery with a sprawling beer garden, food trucks, and rotating taps.',address:'440 E St Elmo Rd, Austin, TX 78745',lat:30.2197,lng:-97.7621,instagram:'@stelmobrew',website:'https://www.stelmobrew.com'});
add({name:'Independence Brewing Co.',cuisine:'Brewery',neighborhood:'South Austin',score:81,price:1,tags:['Casual','Patio','Dog Friendly','Local Favorites'],indicators:[],description:'Austin beloved independent craft brewery known for Bootlegger Brown Ale and a massive dog-friendly patio.',address:'3913 Todd Ln, Austin, TX 78744',lat:30.2135,lng:-97.7197,instagram:'@independencebrewing',website:'https://www.independencebrewing.com'});
add({name:'North by Northwest',cuisine:'Brewery / American',neighborhood:'Domain',score:76,price:2,tags:['Casual','Happy Hour','Family Friendly','Patio'],indicators:[],description:'North Austin brewpub with house-brewed beers, a broad American menu, and sprawling covered patio.',address:'10010 Capital of TX Hwy N, Austin, TX 78759',lat:30.3988,lng:-97.7399,instagram:'@nxnwbrewpub',website:'https://www.nxnw.com'});

// Tex-Mex classics
add({name:'Baby Acapulco',cuisine:'Tex-Mex',neighborhood:'Zilker',score:77,price:1,tags:['Mexican','Casual','Local Favorites','Cocktails'],indicators:['iconic'],description:'Austin Tex-Mex institution since 1963 with frozen margaritas, enchiladas, and queso in a festive setting.',address:'1628 Barton Springs Rd, Austin, TX 78704',lat:30.2585,lng:-97.7668,instagram:'@babyacapulco',website:'https://www.babyacapulco.com'});
add({name:"Trudy's Texas Star",cuisine:'Tex-Mex',neighborhood:'Downtown',score:76,price:1,tags:['Mexican','Casual','Brunch','Cocktails','Local Favorites'],indicators:['iconic'],description:'Long-running Austin staple best known for its Mexican Martini — a boozy, olive-garnished Austin invention.',address:'409 W 30th St, Austin, TX 78705',lat:30.2906,lng:-97.7413,instagram:'@trudystexasstar',website:'https://www.trudys.com'});

// Taco spots
add({name:"Tyson's Tacos",cuisine:'Tacos / Breakfast',neighborhood:'South Austin',score:80,price:1,tags:['Mexican','Casual','Brunch','Local Favorites'],indicators:['hole-in-wall'],description:'South Austin breakfast taco institution with a fierce cult following for perfectly executed morning tacos.',address:'4905 S 1st St, Austin, TX 78745',lat:30.2250,lng:-97.7762,instagram:'@tysonstacos',website:'https://www.tysonstacos.com'});
add({name:'Juan in a Million',cuisine:'Tex-Mex / Breakfast',neighborhood:'East Austin',score:84,price:1,tags:['Mexican','Casual','Brunch','Local Favorites'],indicators:['iconic'],description:'East Austin beloved breakfast taco institution famous for the Don Juan — massive taco stuffed with eggs, potato, bacon, cheese.',address:'2300 E Cesar Chavez St, Austin, TX 78702',lat:30.2577,lng:-97.7233,instagram:'@juaninamillion',website:'https://www.juaninamillion.com'});
add({name:"Joe's Bakery & Coffee Shop",cuisine:'Tex-Mex / Bakery',neighborhood:'East Austin',score:83,price:1,tags:['Mexican','Casual','Brunch','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Family-owned East Austin landmark since 1962 with legendary breakfast tacos, migas, and pan dulce.',address:'2305 E 7th St, Austin, TX 78702',lat:30.2599,lng:-97.7206,instagram:'@joesbakeryaustin',website:'https://www.joesbakeryaustin.com'});

// Vegan
add({name:"Arlo's",cuisine:'Vegan / Burgers',neighborhood:'South Congress',score:79,price:1,tags:['Vegetarian Friendly','Casual','Late Night','Local Favorites'],indicators:['hidden-gem'],description:'Austin most beloved vegan food truck with convincingly meaty smash burgers and chik-n sandwiches.',address:'1608 S Congress Ave, Austin, TX 78704',lat:30.2497,lng:-97.7503,instagram:'@arlosatx',website:'https://www.arlosatx.com'});

// Diners / brunch
add({name:'Counter Cafe',cuisine:'American Diner',neighborhood:'Downtown',score:78,price:1,tags:['Brunch','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Tiny beloved diner doing scratch breakfast and lunch with excellent pancakes in an intimate counter-only space.',address:'626 N Lamar Blvd, Austin, TX 78703',lat:30.2751,lng:-97.7572,instagram:'@countercafeatx',website:'https://www.countercafe.com'});

// Bakery / dessert
add({name:"Sugar Mama's Bakeshop",cuisine:'Bakery / Desserts',neighborhood:'South Congress',score:80,price:1,tags:['Casual','Local Favorites','Family Friendly'],indicators:[],description:'South Austin sweetheart bakery known for rotating cupcake flavors, layer cakes, and scratch-made baked goods.',address:'1905 S Congress Ave, Austin, TX 78704',lat:30.2448,lng:-97.7506,instagram:'@sugarmamasbakeshop',website:'https://www.sugarmamasbakeshop.com'});

// Entertainment
add({name:'Punch Bowl Social',cuisine:'American / Entertainment',neighborhood:'Domain',score:75,price:2,tags:['Bar','Late Night','Casual','Family Friendly'],indicators:[],description:'Massive entertainment complex at the Domain with bowling, karaoke, arcade games, craft cocktails, and American food.',address:'3205 Palm Way, Austin, TX 78758',lat:30.4019,lng:-97.7222,instagram:'@punchbowlsocial',website:'https://www.punchbowlsocial.com/location/austin'});

// Coffee
add({name:'Cherrywood Coffeehouse',cuisine:'Coffee / Cafe',neighborhood:'East Austin',score:78,price:1,tags:['Bakery/Coffee','Casual','Patio','Local Favorites'],indicators:[],description:'Neighborhood staple in Cherrywood with a shaded patio, solid breakfast tacos, and lived-in Austin coffee shop vibe.',address:'1400 E 38th 1/2 St, Austin, TX 78722',lat:30.2975,lng:-97.7199,instagram:'@cherrywoodcoffeehouse',website:'https://www.cherrywoodcoffeehouse.com'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Austin total:', arr.length);
