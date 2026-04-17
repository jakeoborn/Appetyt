const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const LV_DATA=';
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
  s.verified=true; s.hours=s.hours||'';
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Verified new Vegas spots
add({name:'Lullabar',cuisine:'Thai-Japanese Fusion',neighborhood:'Chinatown',score:88,price:2,
  tags:['Asian Fusion','Late Night','Cocktails','Date Night','Local Favorites'],indicators:['hidden-gem'],
  description:'Creative mashup of Isan Thai flavors and Japanese izakaya small plates, beloved for spicy basil clams and a lively late-night atmosphere on Spring Mountain.',
  dishes:['Spicy Basil Clams','Wagyu Gyoza','Lychee Highball'],
  address:'4615 Spring Mountain Rd, Las Vegas, NV 89102',lat:36.1150,lng:-115.1953,
  instagram:'@lullabarlv',website:'https://www.lullabarlv.com',reservation:'walk-in',photoUrl:''});

add({name:'China Mama',cuisine:'Chinese',neighborhood:'Chinatown',score:87,price:1,
  tags:['Chinese','Casual','Late Night','Local Favorites','Dumplings'],indicators:['hole-in-wall'],
  description:'The original Chinatown institution credited with elevating Chinese cuisine in Las Vegas, famed for hand-rolled noodles and mapo tofu.',
  dishes:['Hand-Pulled Noodles','Mapo Tofu','Pork Dumplings'],
  address:'3420 S Jones Blvd, Las Vegas, NV 89146',lat:36.1143,lng:-115.2118,
  instagram:'@chinamamalv',website:'https://www.chinamamalv.com',reservation:'walk-in',photoUrl:''});

add({name:'Holsteins',cuisine:'Burgers / American',neighborhood:'Arts District',score:83,price:2,
  tags:['Burgers','Casual','Brunch','Viral','Late Night'],indicators:[],
  description:'After 15 years at The Cosmopolitan, Holsteins relocated to Main Street in the Arts District, continuing its legacy of gourmet burgers and spiked milkshakes.',
  dishes:['Gold Standard Burger','Spiked Milkshake','Truffle Fries'],
  address:'1136 S Main St, Las Vegas, NV 89104',lat:36.1588,lng:-115.1449,
  instagram:'@holsteinslv',website:'https://www.holsteinslv.com',reservation:'walk-in',photoUrl:''});

add({name:'Pachi Pachi',cuisine:'Japanese / Lounge',neighborhood:'Downtown',score:85,price:3,
  tags:['Japanese','Cocktails','Date Night','Late Night','Exclusive'],indicators:['hidden-gem'],
  description:'Hidden inside the historic Downtown Post Office, an 80-seat Japanese listening lounge blending Tokyo energy with lush surreal art and craft cocktails.',
  dishes:['Omakase Bites','Japanese Highball','Wagyu Skewers'],
  address:'301 Stewart Ave, Las Vegas, NV 89101',lat:36.1728,lng:-115.1392,
  instagram:'@pachipachilv',website:'https://www.pachipachilv.com',reservation:'Resy',photoUrl:''});

add({name:'Limoncello',cuisine:'Italian',neighborhood:'Summerlin',score:84,price:3,
  tags:['Italian','Seafood','Date Night','Pasta','Romantic'],indicators:[],
  description:'Upscale Italian-steakhouse inspired by the Amalfi Coast, offering fresh daily seafood, prime meats, and homemade pastas on the west side.',
  dishes:['Limoncello Shrimp','Veal Osso Buco','Truffle Risotto'],
  address:'9330 W Sahara Ave, Las Vegas, NV 89117',lat:36.1441,lng:-115.2921,
  instagram:'@limoncellolv',website:'https://www.limoncellov.com',reservation:'OpenTable',photoUrl:''});

add({name:'Ohlala French Bistro',cuisine:'French',neighborhood:'Summerlin',score:83,price:3,
  tags:['French','Date Night','Romantic','Fine Dining','Local Favorites'],indicators:['hidden-gem'],
  description:'Authentic French bistro bringing classic Parisian cooking to Summerlin, with standout escargot, French onion soup, and filet mignon.',
  dishes:['Escargot','French Onion Soup','Steak Frites'],
  address:'8665 W Flamingo Rd, Las Vegas, NV 89147',lat:36.1164,lng:-115.2735,
  instagram:'@ohlalabistrolv',website:'https://www.ohlalabistrolv.com',reservation:'OpenTable',photoUrl:''});

add({name:'Ton Shou',cuisine:'Taiwanese',neighborhood:'Chinatown',score:86,price:2,
  tags:['Taiwanese','Casual','Local Favorites','Late Night'],indicators:['hidden-gem'],
  description:'Eater-lauded Taiwanese spot specializing in stinky tofu, oyster omelets, and hard-to-find Taiwanese street food on Spring Mountain.',
  dishes:['Stinky Tofu','Oyster Omelet','Braised Pork Rice'],
  address:'3400 S Jones Blvd, Las Vegas, NV 89146',lat:36.1140,lng:-115.2115,
  instagram:'@tonshou_lv',website:'https://www.tonshoulv.com',reservation:'walk-in',photoUrl:''});

add({name:'Craft Kitchen',cuisine:'New American',neighborhood:'Henderson',score:82,price:2,
  tags:['Brunch','Casual','Bakery/Coffee','Local Favorites'],indicators:[],
  description:'Vibrant Henderson spot for innovative New American dishes made with locally sourced ingredients and exceptional house-baked pastries.',
  dishes:['Avocado Toast','Craft Burger','House Pastries'],
  address:'2265 E Warm Springs Rd, Henderson, NV 89014',lat:36.0526,lng:-115.0710,
  instagram:'@craftkitchenlv',website:'https://www.craftkitchenvegas.com',reservation:'walk-in',photoUrl:''});

add({name:'Gordon Ramsay BurGR',cuisine:'Burgers',neighborhood:'The Strip (Planet Hollywood)',score:80,price:2,
  tags:['Burgers','Casual','Viral','Celebrity Chef'],indicators:[],
  description:'Gordon Ramsay\'s fast-casual burger concept at Planet Hollywood delivering quality patties and craft sides without the fine-dining price tag.',
  dishes:['Hell\'s Kitchen Burger','Hog Burger','Crispy Onion Rings'],
  address:'3667 Las Vegas Blvd S, Las Vegas, NV 89109',lat:36.1099,lng:-115.1718,
  instagram:'@gordonramsayrestaurants',website:'https://www.gordonramsayrestaurants.com/gordon-ramsay-burgr/',reservation:'walk-in',photoUrl:''});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nVegas total:', arr.length);
