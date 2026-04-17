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

// Park MGM
add({name:"Bavette's Steakhouse & Bar",cuisine:'Steakhouse',neighborhood:'The Strip (Park MGM)',score:91,price:4,tags:['Steakhouse','Fine Dining','Date Night','Celebrations','Critics Pick'],description:'Moody jazz-era supper-club steakhouse with prime dry-aged beef and a classic raw bar.',address:'3770 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1023,lng:-115.1731,instagram:'@bavettessteakhouse',website:'https://www.bavettessteakhouse.com/vegas/home'});
add({name:'Best Friend',cuisine:'Korean-Mexican Fusion',neighborhood:'The Strip (Park MGM)',score:89,price:3,tags:['Korean','Date Night','Cocktails','Critics Pick'],description:'Roy Choi raucous Korean-Mexican fusion with Kogi-DNA tacos, soju cocktails, and late-night energy.',address:'3770 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1023,lng:-115.1731,instagram:'@bestfriendvegas',website:'https://www.parkmgm.com/en/restaurants/best-friend.html'});
add({name:'Eataly Las Vegas',cuisine:'Italian / Market',neighborhood:'The Strip (Park MGM)',score:86,price:2,tags:['Italian','Casual','Family Friendly','Brunch'],description:'Italian marketplace and dining hall with fresh pasta, pizza, market counters, and a rooftop beer garden.',address:'3770 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1023,lng:-115.1731,instagram:'@eatalylasvegas',website:'https://www.eataly.com/us_en/stores/las-vegas'});

// Wynn/Encore
add({name:'Sinatra',cuisine:'Italian Fine Dining',neighborhood:'The Strip (Encore at Wynn)',score:90,price:4,tags:['Italian','Fine Dining','Date Night','Celebrations'],indicators:['iconic'],description:'Wynn Encore tribute to Ol Blue Eyes with classic Italian and personal Sinatra memorabilia.',address:'3131 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1268,lng:-115.1643,instagram:'@wynnlasvegas',website:''});
add({name:'La Cave Wine & Food Hideaway',cuisine:'Wine Bar / Small Plates',neighborhood:'The Strip (Wynn)',score:86,price:3,tags:['Wine Bar','Date Night','Cocktails','Casual','Patio'],description:'Wynn underground wine cave with artisan small plates and a curated global wine list.',address:'3131 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1268,lng:-115.1643,instagram:'@lacavelv',website:'https://www.lacavelv.com'});

// Caesars
add({name:'Bacchanal Buffet',cuisine:'Buffet / Global',neighborhood:'The Strip (Caesars Palace)',score:88,price:3,tags:['Casual','Brunch','Family Friendly'],indicators:['iconic'],description:'Vegas most celebrated buffet with 500+ dishes across nine live-action stations.',address:'3570 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1162,lng:-115.1745,instagram:'@caesarspalace',website:''});

// Bars/Lounges
add({name:'The Chandelier',cuisine:'Cocktail Bar / Lounge',neighborhood:'The Strip (The Cosmopolitan)',score:88,price:3,tags:['Cocktails','Bar','Date Night','Scenic','Late Night'],indicators:['iconic'],description:'Three-level bar inside a two-million crystal chandelier at the Cosmopolitan — home of the secret Verbena cocktail.',address:'3708 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1097,lng:-115.1731,instagram:'@cosmopolitanlv',website:''});
add({name:'Skyfall Lounge',cuisine:'Rooftop Bar',neighborhood:'The Strip (Mandalay Bay)',score:87,price:3,tags:['Rooftop','Cocktails','Scenic','Date Night','Late Night'],description:'64th-floor panoramic rooftop lounge at Delano with sweeping Strip views.',address:'3940 S Las Vegas Blvd, Las Vegas, NV 89119',lat:36.0926,lng:-115.1764,instagram:'@skyfalllv',website:''});
add({name:'Legacy Club',cuisine:'Rooftop Bar',neighborhood:'Downtown (Circa)',score:87,price:3,tags:['Rooftop','Cocktails','Scenic','Late Night','Celebrations'],description:'Circa Resort 60th-floor rooftop cocktail lounge with the highest outdoor terrace downtown.',address:'8 Fremont St, Las Vegas, NV 89101',lat:36.1699,lng:-115.1426,instagram:'@circalasvegas',website:''});
add({name:'Ghostbar',cuisine:'Rooftop Bar',neighborhood:'West of Strip',score:82,price:3,tags:['Rooftop','Cocktails','Scenic','Late Night','Nightlife'],description:'Palms Casino iconic 55th-floor rooftop bar with a glass-bottomed observation deck.',address:'4321 W Flamingo Rd, Las Vegas, NV 89103',lat:36.1155,lng:-115.2196,instagram:'@palmslasvegas',website:''});

// Chinatown
add({name:'Ichiza',cuisine:'Japanese Izakaya',neighborhood:'Chinatown',score:85,price:2,tags:['Japanese','Late Night','Local Favorites','Casual'],indicators:['hidden-gem'],description:'Legendary Chinatown late-night izakaya open until 5 AM with yakitori and drinking snacks.',address:'4355 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1266,lng:-115.2020,instagram:'@ichizalv',website:'https://ichizalv.com'});
add({name:'Kung Fu Thai & Chinese',cuisine:'Thai / Chinese',neighborhood:'Chinatown',score:79,price:1,tags:['Thai','Chinese','Casual','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Las Vegas oldest Thai-Chinese restaurant since 1973 with Polynesian cocktails and wok-fired classics.',address:'3505 S Valley View Blvd, Las Vegas, NV 89103',lat:36.1262,lng:-115.1972,instagram:'@kungfuplaza',website:'https://www.kungfuplaza.com'});
add({name:'Yui Edomae Sushi',cuisine:'Japanese / Omakase',neighborhood:'Chinatown',score:92,price:4,tags:['Sushi','Fine Dining','Date Night','Critics Pick'],indicators:['hidden-gem'],description:'Intimate Chinatown omakase counter with fish flown daily from Japan — traditional Edo-style nigiri.',address:'3460 Arville St, Las Vegas, NV 89102',lat:36.1259,lng:-115.1897,instagram:'@yuiedosushi',website:'https://www.yuisushi.com'});

// Off-strip
add({name:"Ferraro's Ristorante",cuisine:'Italian',neighborhood:'Paradise',score:88,price:3,tags:['Italian','Fine Dining','Date Night','Wine Bar','Local Favorites'],indicators:['iconic'],description:'Family-owned Italian institution since 1985 with housemade pastas and an extensive wine cellar.',address:'4480 Paradise Rd, Las Vegas, NV 89169',lat:36.1101,lng:-115.1480,instagram:'@ferraroslasvegas',website:'https://www.ferraroslasvegas.com'});
add({name:'Cleaver',cuisine:'Steakhouse / Cocktail Bar',neighborhood:'Paradise',score:89,price:4,tags:['Steakhouse','Cocktails','Date Night','Celebrations','Critics Pick'],description:'Butcher-focused steakhouse dry-aging in-house and pairing prime cuts with prohibition-era cocktails.',address:'3900 Paradise Rd, Las Vegas, NV 89169',lat:36.1097,lng:-115.1436,instagram:'@cleaverlv',website:'https://www.cleaverlasvegas.com'});
add({name:'Grand Lux Cafe',cuisine:'American / Global',neighborhood:'The Strip (The Venetian)',score:80,price:2,tags:['American','Casual','Brunch','Family Friendly','Late Night'],description:'Cheesecake Factory upscale sibling at the Venetian with an eclectic global all-day menu.',address:'3355 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1214,lng:-115.1686,instagram:'@grandluxcafe',website:'https://www.grandluxcafe.com'});
add({name:'Rosallie Le French Cafe',cuisine:'French / Bakery',neighborhood:'Spring Valley',score:83,price:2,tags:['French','Brunch','Bakery/Coffee','Casual','Local Favorites'],description:'Authentic French bakery-cafe with flaky croissants, galettes, and crepes.',address:'6090 S Rainbow Blvd, Las Vegas, NV 89118',lat:36.0697,lng:-115.2519,instagram:'@rosallielefrenchcafe',website:'https://rosallie.com/las-vegas'});
add({name:'Montecristo Cigar Bar',cuisine:'Cigar Bar / Lounge',neighborhood:'The Strip (Caesars Palace)',score:82,price:3,tags:['Cocktails','Late Night','Nightlife'],description:'Caesars Palace premium cigar lounge with a world-class humidor and craft cocktails.',address:'3570 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1162,lng:-115.1745,instagram:'@caesarspalace',website:''});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
