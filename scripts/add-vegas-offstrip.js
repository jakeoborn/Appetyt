const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const LV_DATA=';
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

// Chinatown
add({name:'Weera Thai',cuisine:'Thai',neighborhood:'Chinatown',score:89,price:1,tags:['Thai','Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Authentic Isan northeastern Thai with roasted duck curry and stuffed chicken wings at strip-mall prices.',address:'4276 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1268,lng:-115.2006,instagram:'@weera_thai_lv',website:'https://www.weerathai.com'});
add({name:'Other Mama',cuisine:'Japanese / Seafood',neighborhood:'Chinatown',score:91,price:3,tags:['Japanese','Seafood','Cocktails','Date Night','Critics Pick'],indicators:['hidden-gem'],description:'Dan Krohmer raw bar meets izakaya — oysters, crudo, inventive seafood small plates, and excellent cocktails.',address:'3655 S Durango Dr, Las Vegas, NV 89147',lat:36.1052,lng:-115.2826,instagram:'@other_mama_lv',website:'https://www.othermamavegas.com'});
add({name:'Nakamura-Ya',cuisine:'Japanese / Ramen',neighborhood:'Chinatown',score:87,price:1,tags:['Japanese','Casual','Late Night','Local Favorites'],indicators:['hole-in-wall'],description:'Beloved Chinatown ramen shop run by a Japanese husband-and-wife team with rich tonkotsu and shoyu broths.',address:'5040 Spring Mountain Rd Ste 4, Las Vegas, NV 89146',lat:36.1267,lng:-115.2178,instagram:'@nakamurayalv',website:'https://nakamura-ya.com'});
add({name:'Monta Ramen',cuisine:'Japanese / Ramen',neighborhood:'Chinatown',score:86,price:1,tags:['Japanese','Casual','Local Favorites','Family Friendly'],indicators:[],description:'Hakata-style tonkotsu ramen institution with rich milky pork broth and thin noodles rivaling any ramen shop in Japan.',address:'5030 Spring Mountain Rd Ste 2, Las Vegas, NV 89146',lat:36.1267,lng:-115.2177,instagram:'@montaramen',website:'https://www.montaramen.com'});
add({name:'Honey Pig Korean BBQ',cuisine:'Korean BBQ',neighborhood:'Chinatown',score:86,price:2,tags:['Korean','BBQ','Late Night','Casual','Local Favorites'],description:'Popular Korean BBQ with marinated pork belly and galbi — open late and always packed with locals.',address:'4725 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1267,lng:-115.2100,instagram:'@honeypigbbq',website:'https://honeypigbbq.com'});
add({name:'Mekong',cuisine:'Vietnamese / Chinese',neighborhood:'Chinatown',score:83,price:1,tags:['Vietnamese','Chinese','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Long-running stalwart with clay pot catfish, crispy sizzling beef, and a sprawling lunch locals swear by.',address:'4765 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1267,lng:-115.2103,instagram:'',website:''});
add({name:'Fat Choy',cuisine:'Chinese American / Diner',neighborhood:'Chinatown',score:85,price:1,tags:['Chinese','Casual','Brunch','Late Night','Local Favorites'],indicators:['hidden-gem'],description:'Chinese-American diner by chef Justin Yu with spam fried rice and Chinese broccoli — open late.',address:'595 E Sahara Ave, Las Vegas, NV 89104',lat:36.1419,lng:-115.1399,instagram:'@fatchoylv',website:'https://fatchoylv.com'});
add({name:'SkinnyFATS',cuisine:'American / Healthy',neighborhood:'Chinatown',score:81,price:1,tags:['Casual','Healthy','Brunch','Local Favorites'],description:'Vegas-born fast-casual with a split menu — Skinny side for clean eating, FATS side for burgers.',address:'4095 W Sahara Ave, Las Vegas, NV 89102',lat:36.1419,lng:-115.1978,instagram:'@skinnyfats',website:'https://skinnyfats.com'});

// Arts District
add({name:'Bar Ginza',cuisine:'Japanese / Cocktail Bar',neighborhood:'Arts District',score:88,price:2,tags:['Cocktails','Bar','Japanese','Date Night','Local Favorites'],indicators:['hidden-gem'],description:'Tokyo-inspired gin and whiskey bar with house cocktails and small-batch Japanese spirits.',address:'1225 S Main St, Las Vegas, NV 89104',lat:36.1552,lng:-115.1535,instagram:'@barginzalv',website:'https://barginzalv.com'});
add({name:'Liquid Diet',cuisine:'Cocktail Bar',neighborhood:'Arts District',score:87,price:2,tags:['Cocktails','Bar','Date Night','Critics Pick'],indicators:['hidden-gem'],description:'Eater Best New Bar winner — culinary-inspired cocktails with precise technique.',address:'1214 S Main St, Las Vegas, NV 89104',lat:36.1554,lng:-115.1534,instagram:'@liquiddietlv',website:'https://liquiddietlv.com'});
add({name:'The Silver Stamp',cuisine:'Beer Bar',neighborhood:'Arts District',score:83,price:1,tags:['Bar','Casual','Local Favorites','Late Night'],description:'Arts District beer bar with rotating global taps and a neighborhood vibe.',address:'1217 S Main St, Las Vegas, NV 89104',lat:36.1553,lng:-115.1533,instagram:'@silverstamplv',website:'https://thesilverstamplv.com'});
add({name:'PublicUs',cuisine:'Cafe / Brunch',neighborhood:'Arts District',score:83,price:2,tags:['Brunch','Bakery/Coffee','Casual','Local Favorites'],description:'Arts District all-day cafe and community hub — serious espresso, seasonal brunch, and lingering encouraged.',address:'1126 Fremont St, Las Vegas, NV 89101',lat:36.1656,lng:-115.1393,instagram:'@publicuslv',website:'https://www.publicuslv.com'});

// Downtown
add({name:'The Laundry Room',cuisine:'Speakeasy / Cocktail Bar',neighborhood:'Downtown (Fremont East)',score:92,price:3,tags:['Cocktails','Bar','Date Night','Exclusive','Late Night'],indicators:['hidden-gem'],description:'22-seat reservation-only speakeasy beneath Commonwealth with bespoke cocktails.',address:'525 E Fremont St, Las Vegas, NV 89101',lat:36.1684,lng:-115.1308,instagram:'@thelaundryroom',website:'https://www.thelaundryroom.com'});
add({name:'Nocturno',cuisine:'Cocktail Bar / Latin',neighborhood:'Arts District',score:89,price:2,tags:['Cocktails','Bar','Date Night','Late Night','Critics Pick'],indicators:['hidden-gem'],description:'Mexico City-inspired cocktail bar redefining Vegas craft bars with Latin spirit history.',address:'1325 S Main St, Las Vegas, NV 89104',lat:36.1551,lng:-115.1541,instagram:'@nocturnolv',website:'https://www.nocturnolv.com'});
add({name:'Eat',cuisine:'Brunch / Cafe',neighborhood:'Downtown',score:84,price:1,tags:['Brunch','Casual','Local Favorites'],indicators:['iconic'],description:'Natalie Young beloved Downtown brunch cafe that helped spark the off-Strip dining renaissance.',address:'707 Carson Ave, Las Vegas, NV 89101',lat:36.1673,lng:-115.1395,instagram:'@eatdowntownlv',website:'https://eatlv.com'});

// Henderson
add({name:'Boom Bang',cuisine:'New American / Brasserie',neighborhood:'Henderson',score:87,price:3,tags:['Date Night','Cocktails','Critics Pick','Local Favorites'],indicators:['hidden-gem'],description:'Chef-owned Henderson brasserie with season-driven small plates — punches well above its strip-mall address.',address:'585 N Stephanie St Ste 110, Henderson, NV 89014',lat:36.0425,lng:-115.0612,instagram:'@boombangrestaurant',website:'https://boombangrestaurant.com'});
add({name:'Water Street Grill',cuisine:'American / Casual',neighborhood:'Henderson',score:82,price:2,tags:['Casual','Patio','Local Favorites','Late Night'],description:'Anchor of Downtown Henderson Water Street District with patio dining and craft beers.',address:'116 Water St, Henderson, NV 89015',lat:36.0381,lng:-114.9823,instagram:'@waterstreetgrilllv',website:'https://waterstreetgrill.com'});
add({name:'Beerhaus Henderson',cuisine:'Beer Hall',neighborhood:'Henderson',score:82,price:2,tags:['Bar','Casual','Patio','Live Music','Family Friendly'],description:'Sprawling indoor-outdoor beer hall on Water Street with 100+ beers and pinball machines.',address:'112 Water St, Henderson, NV 89015',lat:36.0382,lng:-115.0825,instagram:'@beerhaus',website:'https://beerhauslv.com'});

// Summerlin
add({name:'Al Solito Posto',cuisine:'Italian',neighborhood:'Summerlin',score:89,price:3,tags:['Italian','Date Night','Local Favorites','Critics Pick','Cocktails'],indicators:['hidden-gem'],description:'Chef James Trees Italian companion to Esther Kitchen at Tivoli Village with market-driven pasta.',address:'400 S Rampart Blvd Ste 110, Las Vegas, NV 89145',lat:36.1702,lng:-115.3170,instagram:'@alsolitoposto',website:'https://alsolitoposto.com'});
add({name:'Marufuku Ramen',cuisine:'Japanese / Ramen',neighborhood:'Summerlin (Downtown Summerlin)',score:87,price:2,tags:['Japanese','Casual','Family Friendly','Local Favorites'],description:'San Francisco Hakata tonkotsu ramen chain at Downtown Summerlin with creamy rich pork broth.',address:'1237 N Town Center Dr, Las Vegas, NV 89144',lat:36.1924,lng:-115.3354,instagram:'@marufukulv',website:'https://marufukuramen.com'});
add({name:'Grape Street Cafe',cuisine:'California Bistro / Wine Bar',neighborhood:'Summerlin (Downtown Summerlin)',score:85,price:2,tags:['Wine Bar','Brunch','Date Night','Patio','Local Favorites'],description:'Zagat-rated California bistro with Italian-Mediterranean flair and a great happy-hour patio.',address:'1313 N Town Center Dr, Las Vegas, NV 89144',lat:36.1923,lng:-115.3355,instagram:'@grapestreetlv',website:'https://grapestreetcafe.com'});

// Spring Valley
add({name:"Lola's Louisiana Kitchen",cuisine:'Cajun / Creole',neighborhood:'Spring Valley',score:87,price:2,tags:['Southern','Casual','Local Favorites','Family Friendly'],indicators:['hidden-gem'],description:'Cajun-Creole that feels like New Orleans — jambalaya, crawfish etouffee, and bread pudding with whiskey sauce.',address:'241 N Mojave Rd, Las Vegas, NV 89101',lat:36.1678,lng:-115.1233,instagram:'@lolaslakitchen',website:'https://lolaslakitchen.com'});
add({name:'Naked Fish',cuisine:'Japanese / Seafood',neighborhood:'Spring Valley',score:86,price:3,tags:['Japanese','Seafood','Date Night','Local Favorites'],description:'Moody Japanese seafood restaurant with some of the freshest fish in Vegas.',address:'3945 S Durango Dr, Las Vegas, NV 89147',lat:36.1075,lng:-115.2838,instagram:'@nakedfishlv',website:'https://www.nakedfishlv.com'});
add({name:'Cafe Breizh',cuisine:'French / Creperie',neighborhood:'Summerlin',score:85,price:2,tags:['French','Brunch','Casual','Local Favorites'],indicators:['hidden-gem'],description:'Airy French creperie with savory buckwheat galettes, sweet crepes, and cidre.',address:'8520 W Desert Inn Rd Ste 1, Las Vegas, NV 89117',lat:36.1382,lng:-115.2866,instagram:'@cafebreizh_lv',website:'https://cafebreizhlv.com'});
add({name:"Gaetano's Ristorante",cuisine:'Italian',neighborhood:'Spring Valley',score:85,price:3,tags:['Italian','Date Night','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Third-generation family Italian since 1977 with red-sauce classics and old-school hospitality.',address:'3675 S Rainbow Blvd, Las Vegas, NV 89103',lat:36.1081,lng:-115.2572,instagram:'@gaetanoristolv',website:'https://gaetanosristorante.com'});

// Near Strip
add({name:'Shokku Ramen',cuisine:'Japanese / Ramen',neighborhood:'Paradise',score:83,price:1,tags:['Japanese','Late Night','Casual','Local Favorites'],description:'24/7 ramen shop near the Strip beloved by service-industry workers — oxtail and surf and turf ramen at 4AM.',address:'3480 Paradise Rd, Las Vegas, NV 89169',lat:36.1213,lng:-115.1486,instagram:'@shokkuramen',website:'https://shokkuramen.com'});
add({name:'Hachi',cuisine:'Japanese / Yakitori',neighborhood:'Paradise',score:84,price:2,tags:['Japanese','Late Night','Casual','Critics Pick'],indicators:['hidden-gem'],description:'Late-night yakitori bar open until 2:30AM with binchotan-grilled skewers and Japanese whiskey highballs.',address:'4480 Paradise Rd Ste 2500, Las Vegas, NV 89169',lat:36.1153,lng:-115.1472,instagram:'@hachilv',website:'https://hachilv.com'});
add({name:'The Skull Bar',cuisine:'Speakeasy / Cocktail Bar',neighborhood:'Chinatown',score:86,price:2,tags:['Cocktails','Bar','Late Night','Local Favorites'],indicators:['hidden-gem'],description:'Hidden punk-rock speakeasy inside a taco shop — dark, moody, craft cocktails behind a facade.',address:'4145 S Durango Dr, Las Vegas, NV 89147',lat:36.1050,lng:-115.2840,instagram:'@skullbarlv',website:''});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
