const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const DALLAS_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP (exists):', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=s.trending||false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=s.phone||''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=s.hours||'';
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Deep Ellum / Downtown
add({
  name:'Midnight Rambler',
  cuisine:'Cocktail Bar / Speakeasy',
  neighborhood:'Downtown',
  score:93,
  price:3,
  tags:['Cocktails','Date Night','Late Night','Speakeasy','Hotel Bar','Critics Pick','Exclusive'],
  indicators:[],
  description:'Subterranean cocktail lounge beneath The Joule hotel with art-deco interiors, mirrored walls, and one of the best cocktail programs in Texas. The bartenders here are serious about their craft — expect neo-classic cocktails with house-made syrups and obscure spirits.',
  dishes:['Old Fashioned','Dealers Choice','Midnight Rambler Martini'],
  address:'1530 Main St, Dallas, TX 75201',
  lat:32.7819,
  lng:-96.7977,
  instagram:'@midnightramblerbar',
  website:'https://midnightramblerbar.com/',
  reservation:'OpenTable',
  photoUrl:'',
  hours:'Tue-Wed 5PM-12AM, Thu-Sat 5PM-2AM',
  phone:'(214) 261-4601'
});

add({
  name:'Ghost Donkey',
  cuisine:'Mezcal & Tequila Bar',
  neighborhood:'Deep Ellum',
  score:88,
  price:2,
  tags:['Cocktails','Late Night','Mexican','Date Night','Local Favorites'],
  indicators:[],
  description:'Vibrant mezcal and tequila bar from the NYC original, now in Deep Ellum. The cocktail list leans agave-forward with creative twists — think smoked pineapple margaritas and mezcal negronis. The energy is festive and the small bites are solid.',
  dishes:['Mezcal Flight','Ghost Donkey Margarita','Elote'],
  address:'2625 Main St, Dallas, TX 75226',
  lat:32.7836,
  lng:-96.7784,
  instagram:'@ghostdonkeydallas',
  website:'https://www.ghostdonkeydallas.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Wed-Sat 5PM-2AM, Sun 5PM-12AM',
  phone:'(469) 837-2562'
});

// Uptown
add({
  name:'Bar Colette',
  cuisine:'Cocktail Bar / Sushi',
  neighborhood:'Uptown',
  score:92,
  price:3,
  tags:['Cocktails','Date Night','Sushi','Fine Dining','Critics Pick','Exclusive'],
  indicators:[],
  description:'James Beard-nominated cocktail bar in West Village with inventive drinks from bar director Ruben Rolon and playful modern sushi from chef Kaz Mabuchi. The intimate, elegant space draws a well-dressed crowd and the infused spirits program is exceptional.',
  dishes:['Omakase Cocktail','Spicy Tuna Crispy Rice','Wagyu Tataki'],
  address:'3699 McKinney Ave Ste 306, Dallas, TX 75204',
  lat:32.8084,
  lng:-96.7998,
  instagram:'@bar_colette',
  website:'https://www.barcolette.com/',
  reservation:'Resy',
  photoUrl:'',
  hours:'Tue-Sat 5PM-12AM',
  phone:'(214) 377-4809',
  awards:'James Beard Semifinalist Best New Bar 2025'
});

// Knox-Henderson
add({
  name:'Candleroom',
  cuisine:'Nightclub / Lounge',
  neighborhood:'Knox-Henderson',
  score:84,
  price:2,
  tags:['Nightlife','Late Night','Cocktails','Date Night','Celebrations','Live Music'],
  indicators:[],
  description:'Intimate 3,000 square-foot nightclub on Henderson Avenue since 2003. State-of-the-art sound and lighting in a converted historic retail space. The dance floor gets packed Fridays and Saturdays with DJs spinning hip-hop, Top 40, and house.',
  dishes:[],
  address:'5039 Willis Ave, Dallas, TX 75206',
  lat:32.8295,
  lng:-96.7712,
  instagram:'@candleroom',
  website:'https://www.candleroomdallas.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Fri-Sat 10PM-2AM',
  phone:'(214) 370-4155'
});

// Oak Lawn / Cedar Springs — LGBTQ+ nightlife anchors
add({
  name:"JR's Bar & Grill",
  cuisine:'Bar & Grill / LGBTQ+ Bar',
  neighborhood:'Oak Lawn',
  score:86,
  price:1,
  tags:['Bar','LGBTQ','Late Night','Local Favorites','Karaoke','Patio','Live Music'],
  indicators:[],
  description:"Texas's most iconic LGBTQ+ bar since 1980, anchoring the Cedar Springs strip. Three full bars across two levels, a legendary upstairs patio for people-watching, and a rotating calendar of drag shows, karaoke, and themed nights. An institution.",
  dishes:[],
  address:'3923 Cedar Springs Rd, Dallas, TX 75219',
  lat:32.8124,
  lng:-96.8105,
  instagram:'@jrsdallas',
  website:'https://jrsdallas.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Mon 12PM-1AM, Tue-Thu 11AM-1AM, Fri-Sat 11AM-2AM, Sun 12PM-1AM',
  phone:'(214) 528-1004'
});

add({
  name:"Sue Ellen's",
  cuisine:'Bar & Live Music / LGBTQ+ Bar',
  neighborhood:'Oak Lawn',
  score:85,
  price:1,
  tags:['Bar','LGBTQ','Live Music','Late Night','Local Favorites','Celebrations'],
  indicators:[],
  description:"Texas's oldest lesbian bar and one of the last in the country. Two floors — live music and concerts downstairs, dancing and games upstairs. The crowd is diverse across gender and age, and the weekend lineup of DJs and performers keeps the energy high.",
  dishes:[],
  address:'3911 Cedar Springs Rd Ste B, Dallas, TX 75219',
  lat:32.8122,
  lng:-96.8104,
  instagram:'@sueellensdallas',
  website:'https://sueellensdallas.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Wed-Fri 5PM-2AM, Sat-Sun 3PM-2AM',
  phone:''
});

add({
  name:'Station 4 (S4)',
  cuisine:'Nightclub / LGBTQ+ Club',
  neighborhood:'Oak Lawn',
  score:87,
  price:2,
  tags:['Nightlife','LGBTQ','Late Night','Live Music','Celebrations','Cocktails'],
  indicators:[],
  description:"Massive 24,000+ square-foot LGBTQ+ mega-club at the corner of Cedar Springs and Throckmorton. Multiple bars, a huge dance floor with pro-level sound and lighting, patio spaces, and the legendary Rose Room — Dallas's premier drag venue. The anchor of the Cedar Springs strip.",
  dishes:[],
  address:'3911 Cedar Springs Rd, Dallas, TX 75219',
  lat:32.8122,
  lng:-96.8103,
  instagram:'@s4dallas',
  website:'https://station4dallas.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Wed 8PM-4AM, Thu-Sun 9PM-4AM',
  phone:''
});

add({
  name:'CRUSH',
  cuisine:'Nightclub / LGBTQ+ Club',
  neighborhood:'Oak Lawn',
  score:86,
  price:2,
  tags:['Nightlife','LGBTQ','Late Night','Cocktails','Celebrations','Live Music'],
  indicators:[],
  description:"The newest addition to Cedar Springs, earning D Magazine's Best New Gay Bar. Disco balls, elaborate themed decor, and a weekly lineup of drag shows, Drag Race viewing parties, and karaoke. The soundtrack blends house, disco, pop, and classic throwbacks.",
  dishes:[],
  address:'2914 Oak Lawn Ave, Dallas, TX 75219',
  lat:32.8106,
  lng:-96.8092,
  instagram:'@crushdtx',
  website:'https://crushdtx.com/',
  reservation:'walk-in',
  photoUrl:'',
  hours:'Tue-Sat 7PM-2AM, Sun 4PM-2AM',
  phone:'(945) 312-0900'
});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nTotal Dallas spots:', arr.length);
