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

// Palazzo
add({name:'Via Via Food Hall',cuisine:'Food Hall',neighborhood:'The Strip (The Palazzo)',score:85,price:2,tags:['Casual','Local Favorites','Family Friendly'],description:"Venetian's buzzy food hall with Howlin' Ray's hot chicken, Scarr's Pizza, Ivan Ramen, and Turkey and the Wolf.",address:'3325 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1218,lng:-115.1700,instagram:'@venetianlasvegas',website:'https://www.venetianlasvegas.com/dining/restaurants/via-via.html'});
add({name:'BOA Steakhouse',cuisine:'Steakhouse',neighborhood:'The Strip (The Palazzo)',score:87,price:4,tags:['Steakhouse','Fine Dining','Date Night','Cocktails'],description:'Bold modern steakhouse at The Palazzo with dry-aged prime cuts and lavish sides.',address:'3325 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1222,lng:-115.1701,instagram:'@boasteakhouse',website:''});
add({name:'Black Tap Vegas',cuisine:'Burgers / American',neighborhood:'The Strip (The Palazzo)',score:82,price:2,tags:['Casual','Viral','Family Friendly'],description:'Home of the legendary CrazyShake with canal-view patio, craft burgers, and over-the-top desserts.',address:'3325 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1220,lng:-115.1699,instagram:'@blacktapnyc',website:'https://www.blacktap.com/location/las-vegas/'});

// Paris Las Vegas
add({name:'Nobu at Paris',cuisine:'Japanese / Sushi',neighborhood:'The Strip (Paris Las Vegas)',score:90,price:4,tags:['Sushi','Fine Dining','Date Night','Cocktails'],description:"Chef Nobu Matsuhisa's world-renowned Japanese restaurant with black cod miso and yellowtail jalapeno.",address:'3655 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1128,lng:-115.1711,instagram:'@noburestaurants',website:'https://www.noburestaurants.com/las-vegas-paris/'});
add({name:'Cheri Rooftop',cuisine:'French / Rooftop',neighborhood:'The Strip (Paris Las Vegas)',score:84,price:3,tags:['Rooftop','French','Brunch','Cocktails','Scenic'],description:'Chic open-air rooftop at Paris Las Vegas with French-inspired cuisine, brunch, and Strip views.',address:'3655 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1126,lng:-115.1712,instagram:'@cherirooftop',website:'https://www.cherirooftop.com/'});
add({name:'The Bedford by Martha Stewart',cuisine:'American',neighborhood:'The Strip (Paris Las Vegas)',score:83,price:3,tags:['Casual','Brunch','Date Night','Celebrity Chef'],description:"Martha Stewart's first full-service restaurant evoking her Connecticut farmhouse with elevated American comfort food.",address:'3655 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1130,lng:-115.1710,instagram:'@bedfordbymarthastewart',website:''});

// Treasure Island
add({name:"Gilley's BBQ",cuisine:'BBQ / Honky-Tonk',neighborhood:'The Strip (Treasure Island)',score:79,price:2,tags:['BBQ','Live Music','Casual','Late Night'],description:'Texas-style saloon at Treasure Island with mechanical bull, live country, and slow-smoked meats.',address:'3300 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1247,lng:-115.1667,instagram:'@gilleyslasvegas',website:'https://gilleyslasvegas.com/'});

// Planet Hollywood
add({name:'Pampas Churrascaria',cuisine:'Brazilian Steakhouse',neighborhood:'The Strip (Planet Hollywood)',score:83,price:3,tags:['Steakhouse','Fine Dining','Celebrations'],description:'Brazilian rodizio-style steakhouse with tableside gaucho carvers and endless slow-roasted meats.',address:'3667 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1099,lng:-115.1713,instagram:'@pampasusa',website:''});

// Cromwell
add({name:'Bound by Salvatore Calabrese',cuisine:'Cocktail Bar',neighborhood:'The Strip (The Cromwell)',score:86,price:3,tags:['Cocktails','Bar','Date Night','Late Night','Exclusive'],description:'Intimate cocktail lounge at The Cromwell helmed by world-renowned mixologist Salvatore Calabrese.',address:'3595 S Las Vegas Blvd, Las Vegas, NV 89109',lat:36.1163,lng:-115.1715,instagram:'@boundlasvegas',website:''});

// Chinatown
add({name:'Chengdu Taste',cuisine:'Sichuan Chinese',neighborhood:'Chinatown',score:88,price:1,tags:['Chinese','Casual','Local Favorites','Late Night'],indicators:['hidden-gem'],description:'Beloved Sichuan restaurant with Chengdu-style dishes heavy on numbing mala spice and bold aromatics.',address:'3950 Schiff Dr, Las Vegas, NV 89103',lat:36.1248,lng:-115.1982,instagram:'@chengdutastelv',website:'https://www.chengdutastevegas.com/'});
add({name:'Shin Yakiniku',cuisine:'Japanese BBQ',neighborhood:'Chinatown',score:85,price:2,tags:['Japanese','BBQ','Casual','Date Night'],description:'Premium all-you-can-eat Japanese BBQ with quality wagyu cuts, sushi, and ramen in a polished setting.',address:'5865 Spring Mountain Rd Ste 145, Las Vegas, NV 89146',lat:36.1323,lng:-115.2178,instagram:'@shinyakinikulv',website:'https://shinyakiniku.com/'});
add({name:'Do Kkae Bi Kitchen',cuisine:'Korean',neighborhood:'Chinatown',score:79,price:1,tags:['Korean','Casual','Local Favorites','Late Night'],description:'New Chinatown Korean kitchen with affordable comfort foods, fried chicken, and street-food snacks.',address:'4480 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1350,lng:-115.2005,instagram:'@dokkaebi_kitchen_lv',website:''});

// Arts District
add({name:'Makers & Finders',cuisine:'Latin / Coffee Bar',neighborhood:'Arts District',score:84,price:1,tags:['Brunch','Bakery/Coffee','Casual','Local Favorites'],description:'Colombian-inspired coffee bar and brunch restaurant with specialty lattes and breakfast empanadas.',address:'1120 S Main St Ste 110, Las Vegas, NV 89104',lat:36.1579,lng:-115.1538,instagram:'@makerslv',website:'https://www.makerslv.com/'});
add({name:'Able Baker Brewing',cuisine:'Brewery / American',neighborhood:'Arts District',score:83,price:1,tags:['Casual','Late Night','Patio','Dog Friendly'],description:'Arts District craft brewery with 30+ taps and in-house kitchen serving banh mi and fried chicken sandwiches.',address:'1510 S Main St Ste 120, Las Vegas, NV 89104',lat:36.1541,lng:-115.1534,instagram:'@ablebakerbrewing',website:'https://www.ablebakerbrewing.com/'});
add({name:'Bad Beat Brewing',cuisine:'Brewery',neighborhood:'Arts District',score:81,price:1,tags:['Casual','Patio','Local Favorites'],description:'Las Vegas-born craft brewery in the Arts District with bold IPAs and seasonal releases.',address:'1421 S Main St, Las Vegas, NV 89104',lat:36.1548,lng:-115.1535,instagram:'@badbeatbrewing',website:'https://badbeatbrewing.com/'});
add({name:'Palate',cuisine:'New American',neighborhood:'Arts District',score:84,price:2,tags:['Date Night','Cocktails','Local Favorites'],description:'Contemporary bar and restaurant with modern Americana cuisine, curated wines, and handcrafted cocktails.',address:'1102 S Main St, Las Vegas, NV 89104',lat:36.1583,lng:-115.1540,instagram:'@palatelv',website:'https://www.palatelv.com/'});
add({name:'18bin',cuisine:'American / Bar',neighborhood:'Arts District',score:82,price:2,tags:['Cocktails','Patio','Brunch','Live Music'],description:'Spacious indoor-outdoor bar at Charleston and Art Way with craft cocktails, live entertainment, and brunch.',address:'107 E Charleston Blvd Ste 150, Las Vegas, NV 89104',lat:36.1524,lng:-115.1508,instagram:'@18binlv',website:'https://18binlv.com/'});

// Downtown / Fremont East
add({name:'Park on Fremont',cuisine:'Gastropub',neighborhood:'Downtown (Fremont East)',score:83,price:2,tags:['Casual','Patio','Late Night','Brunch'],description:'Fremont East beer garden and gastropub with a picket-fence patio, 100+ beers, and craft burgers.',address:'506 Fremont St, Las Vegas, NV 89101',lat:36.1680,lng:-115.1348,instagram:'@parkonfremont',website:'https://www.parkonfremont.com/'});
add({name:'Atomic Liquors',cuisine:'Bar / American',neighborhood:'Downtown (Fremont East)',score:82,price:1,tags:['Bar','Late Night','Local Favorites','Dive Bar'],indicators:['iconic'],description:'Las Vegas oldest freestanding bar since 1952, a Fremont East icon with 20 rotating drafts and classic dive atmosphere.',address:'917 Fremont St, Las Vegas, NV 89101',lat:36.1683,lng:-115.1305,instagram:'@atomicliquors',website:'https://atomic.vegas/'});
add({name:'7th & Carson',cuisine:'New American',neighborhood:'Downtown',score:85,price:2,tags:['Brunch','Cocktails','Date Night','Local Favorites'],description:'Neighborhood kitchen serving elevated American comfort food with a strong brunch program.',address:'616 E Carson Ave, Las Vegas, NV 89101',lat:36.1676,lng:-115.1322,instagram:'@7thandcarson',website:'https://www.7thandcarson.com/'});
add({name:'Taco Escobar',cuisine:'Mexican / Taqueria',neighborhood:'Downtown (Fremont East)',score:80,price:1,tags:['Mexican','Cocktails','Late Night','Casual'],description:'New Fremont East bar and taqueria with scratch-made tacos and cocktails.',address:'702 E Fremont St, Las Vegas, NV 89101',lat:36.1681,lng:-115.1315,instagram:'@tacoescobar_lv',website:'https://www.tacoescobarlv.com/'});

// Henderson
add({name:'Settebello Pizzeria',cuisine:'Neapolitan Pizza',neighborhood:'Henderson',score:87,price:2,tags:['Pizza','Italian','Casual','Local Favorites'],indicators:['hidden-gem'],description:'VPN-certified Neapolitan pizzeria using imported Italian ingredients and a blistering wood-fired oven.',address:'140 S Green Valley Pkwy #102, Henderson, NV 89012',lat:36.0256,lng:-115.0726,instagram:'@settebellohenderson',website:'https://www.settebello.net/las-vegas'});
add({name:'Lovelady Brewing',cuisine:'Brewery',neighborhood:'Henderson',score:82,price:1,tags:['Casual','Dog Friendly','Late Night','Local Favorites'],description:'Family-owned Henderson brewery on Water Street with 25+ years of expertise and a dog-friendly patio.',address:'20 S Water St, Henderson, NV 89015',lat:36.0381,lng:-114.9820,instagram:'@loveladybrewing',website:'https://www.loveladybrewing.com/'});
add({name:'CraftHaus Brewery',cuisine:'Brewery',neighborhood:'Henderson',score:83,price:1,tags:['Casual','Local Favorites'],description:'Henderson flagship taproom from one of Vegas most respected craft breweries.',address:'7350 Eastgate Rd Ste 110, Henderson, NV 89011',lat:36.0619,lng:-115.0274,instagram:'@crafthausbrewery',website:'https://www.crafthausbrewery.com/hendersonbrewery'});

// Summerlin
add({name:'Honey Salt',cuisine:'New American / Farm-to-Table',neighborhood:'Summerlin',score:88,price:3,tags:['Brunch','Date Night','Local Favorites'],indicators:['hidden-gem'],description:'Elizabeth Blau beloved Summerlin flagship with seasonal farm-table comfort food since 2012.',address:'1031 S Rampart Blvd, Las Vegas, NV 89145',lat:36.1488,lng:-115.3001,instagram:'@honeysalt',website:'https://honeysalt.com/'});
add({name:"Nittaya's Secret Kitchen",cuisine:'Thai',neighborhood:'Summerlin',score:87,price:2,tags:['Thai','Local Favorites','Date Night'],indicators:['hidden-gem'],description:'Summerlin top-rated Thai with chef-driven spicy green bean pork, drunken noodles, and a sommelier-selected wine list.',address:'8410 W Desert Inn Rd Ste 5, Las Vegas, NV 89117',lat:36.1292,lng:-115.2950,instagram:'@nittayassecretkitchen',website:'https://nittayassecretkitchen.com/'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
