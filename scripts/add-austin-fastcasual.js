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

// Breakfast Tacos
add({name:"Granny's Tacos",cuisine:'Mexican / Breakfast Tacos',neighborhood:'East Austin',score:85,price:1,tags:['Casual','Mexican','Brunch','Local Favorites'],indicators:['hole-in-wall'],description:'Beloved East Austin taco truck with scratch-made tacos, housemade salsas and mole, and a standout chilaquiles taco.',address:'1401 E 7th St, Austin, TX 78702',lat:30.2589,lng:-97.7176,instagram:'@grannystacosatx',website:'https://www.grannystacosatx.com'});
add({name:'El Primo',cuisine:'Mexican / Tacos',neighborhood:'South Austin',score:82,price:1,tags:['Casual','Mexican','Brunch','Local Favorites'],indicators:['hole-in-wall'],description:'No-frills South First taco trailer since 2004 with al pastor, barbacoa, and lengua breakfast tacos.',address:'2101 S 1st St, Austin, TX 78704',lat:30.2432,lng:-97.7596,instagram:'@elprimoatx',website:'https://www.elprimoatx.com'});
add({name:"Rosita's Al Pastor",cuisine:'Mexican / Tacos',neighborhood:'South Austin',score:83,price:1,tags:['Casual','Mexican','Local Favorites'],indicators:['hole-in-wall'],description:'Family-owned taco counter serving family recipes since 1985, celebrated for thick flour tortillas and al pastor.',address:'1801 E Riverside Dr, Austin, TX 78741',lat:30.2374,lng:-97.7224,instagram:'@rositasalpastor',website:''});

// Chicken
add({name:"Fresa's Chicken al Carbon",cuisine:'Mexican / Chicken',neighborhood:'North Lamar',score:84,price:2,tags:['Casual','Mexican','Local Favorites','Family Friendly'],indicators:[],description:'Austin-owned drive-thru counter serving wood-grilled locally sourced chicken, tacos, tortas, and aguas frescas.',address:'915 N Lamar Blvd, Austin, TX 78703',lat:30.2736,lng:-97.7538,instagram:'@fresaschicken',website:'https://www.fresaschicken.com'});
add({name:'Tumble 22',cuisine:'Hot Chicken',neighborhood:'North Austin',score:84,price:2,tags:['Casual','Local Favorites'],indicators:[],description:'Texas chicken joint hand-breading each piece and tumbling it exactly 22 times for a crave-worthy crust.',address:'7211 Burnet Rd, Austin, TX 78757',lat:30.3581,lng:-97.7378,instagram:'@tumble22hotchx',website:'https://tumble22.com'});
add({name:'Bird Bird Biscuit',cuisine:'Chicken / Biscuit Sandwiches',neighborhood:'East Austin',score:86,price:2,tags:['Casual','Brunch','Local Favorites'],indicators:['iconic'],description:'Neighborhood biscuit shop crafting towering buttermilk biscuit sandwiches loaded with fried chicken.',address:'2701 Manor Rd, Austin, TX 78722',lat:30.2744,lng:-97.7085,instagram:'@birdbirdbiscuit',website:'https://www.birdbirdbiscuit.com'});

// Poke / Bowls
add({name:'Poke-Poke',cuisine:'Poke / Hawaiian',neighborhood:'South Congress',score:84,price:2,tags:['Casual','Seafood','Healthy'],indicators:[],description:'One of the first mainland Hawaiian poke shops, rated best poke in Austin, with classic bowls plus ceviche.',address:'3100 S Congress Ave, Austin, TX 78704',lat:30.2292,lng:-97.7520,instagram:'@pokepokebowls',website:'https://poke-poke.com'});
add({name:'Flower Child',cuisine:'Healthy / Bowls / Salads',neighborhood:'Downtown',score:83,price:2,tags:['Casual','Healthy','Vegetarian Friendly'],indicators:[],description:'Feel-good fast casual with scratch-made grain bowls, salads, and wraps catering to vegan, paleo, and gluten-free diners.',address:'500 W 2nd St #133, Austin, TX 78701',lat:30.2638,lng:-97.7480,instagram:'@eatflowerchild',website:'https://www.iamaflowerchild.com'});

// Mediterranean
add({name:'Phoenician Resto Cafe',cuisine:'Mediterranean / Lebanese',neighborhood:'Downtown',score:83,price:2,tags:['Casual','Mediterranean','Local Favorites'],indicators:['hole-in-wall'],description:'Family-owned Lebanese counter with falafel, shawarma, and hummus with Halal meats and housemade sauces.',address:'2909 Guadalupe St Ste B, Austin, TX 78705',lat:30.2969,lng:-97.7407,instagram:'@phoenician_resto_cafe',website:'https://phoenicianrestocafe.net'});
add({name:'TX Shawarma',cuisine:'Mediterranean / Shawarma',neighborhood:'South Austin',score:82,price:1,tags:['Casual','Mediterranean','Local Favorites'],indicators:['hole-in-wall'],description:'No-frills South Austin Mediterranean counter praised for fast service and excellent falafel and shawarma wraps.',address:'601 W Live Oak St, Austin, TX 78704',lat:30.2407,lng:-97.7541,instagram:'@txshawarma',website:'https://www.txshawarma.com'});

// Mexican fast casual
add({name:"Cabo Bob's Burritos",cuisine:'Mexican / Burritos',neighborhood:'Downtown',score:80,price:1,tags:['Casual','Mexican','Local Favorites'],indicators:[],description:'Austin-born Baja-style build-your-own burrito and bowl counter with fresh ingredients and a devoted following.',address:'2828 Rio Grande St, Austin, TX 78705',lat:30.2937,lng:-97.7452,instagram:'@cabobobs',website:'https://cabobobs.com'});
add({name:'JewBoy Burgers',cuisine:'Burgers / Fast Casual',neighborhood:'North Austin',score:85,price:2,tags:['Casual','Local Favorites'],indicators:['hidden-gem'],description:'Austin original blending US-Mexico border and Jewish deli culture into smash-style burgers, burritos, and homemade latkes.',address:'5111 Airport Blvd, Austin, TX 78751',lat:30.3154,lng:-97.7103,instagram:'@jewboyburgers',website:'https://jewboyburgers.com'});

// Pizza by the slice
add({name:'Allday Pizza',cuisine:'Pizza / New York Style',neighborhood:'Hyde Park',score:84,price:2,tags:['Casual','Pizza','Local Favorites'],indicators:[],description:'Buzzy newcomer serving specialty New York-style slices with charred chewy crust and tangy sauce.',address:'4300 Speedway Ste 103, Austin, TX 78751',lat:30.3194,lng:-97.7292,instagram:'@alldaypizza',website:'https://allday.pizza'});
add({name:'Little Deli & Pizzeria',cuisine:'Deli / Pizza',neighborhood:'North Loop',score:83,price:2,tags:['Casual','Pizza','Local Favorites'],indicators:['iconic'],description:'Longtime Austin staple serving northeastern-style deli sandwiches and authentic New Jersey pizza for three decades.',address:'7101 Woodrow Ave, Austin, TX 78757',lat:30.3429,lng:-97.7253,instagram:'@littledeliandpizza',website:'https://littledeliandpizza.com'});

// Sandwiches / Delis
add({name:'Otherside Deli',cuisine:'Deli / Sandwiches',neighborhood:'North Loop',score:84,price:2,tags:['Casual','Local Favorites'],indicators:['hidden-gem'],description:'Food-truck-turned-brick-and-mortar New York deli making all pastrami, corned beef, and turkey in-house.',address:'1104 W 34th St, Austin, TX 78705',lat:30.3080,lng:-97.7454,instagram:'@othersidedeliatx',website:'https://www.othersidedeliatx.com'});
add({name:'Thundercloud Subs',cuisine:'Sandwiches / Subs',neighborhood:'South Lamar',score:78,price:1,tags:['Casual','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Austin institution since 1975 serving fresh-baked sub sandwiches with locally sourced meats across dozens of locations.',address:'2801 S Lamar Blvd, Austin, TX 78704',lat:30.2479,lng:-97.7748,instagram:'@thundercloudsubs',website:'https://thundercloud.com'});
add({name:'Knuckle Sandwich',cuisine:'Sandwiches / Italian',neighborhood:'South Austin',score:85,price:2,tags:['Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Chef-driven food trailer from Michelin-starred kitchen alums crafting elevated Italian-style sandwiches.',address:'440 E St Elmo Rd E-2, Austin, TX 78745',lat:30.2165,lng:-97.7617,instagram:'@knucklesandwich_atx',website:'https://www.knucklesandwichatx.com'});

// Asian fast casual
add({name:'Saigon On 7th',cuisine:'Vietnamese / Banh Mi',neighborhood:'East Austin',score:84,price:1,tags:['Casual','Vietnamese','Local Favorites'],indicators:['hole-in-wall'],description:'Voted Austin Best Banh Mi, serving mouthwatering banh mi and vermicelli bowls with authentic street food flavors.',address:'2601 E 7th St Ste 101, Austin, TX 78702',lat:30.2608,lng:-97.7145,instagram:'@saigonlevendeur',website:'https://saigon7th.square.site'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Austin total:', arr.length);
