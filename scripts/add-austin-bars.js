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

// Dirty 6th Street
add({name:"Maggie Mae's",cuisine:'Bar / Live Music',neighborhood:'Downtown',score:79,price:1,tags:['Live Music','Bar','Late Night','Nightlife','Casual','Happy Hour'],indicators:[],description:"Multi-floor venue with a legendary balcony overlooking 6th Street, hosting live music throughout the year.",address:'323 E 6th St, Austin, TX 78701',lat:30.2676,lng:-97.7393,instagram:'@maggiemaesaustin',website:'https://maggiemaesaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Firehouse Hostel Lounge',cuisine:'Cocktail Bar / Speakeasy',neighborhood:'Downtown',score:83,price:2,tags:['Cocktails','Bar','Late Night','Date Night','Speakeasy'],indicators:['hidden-gem'],description:"Hidden speakeasy accessed through a secret bookshelf inside a historic firehouse building.",address:'605 Brazos St, Austin, TX 78701',lat:30.2672,lng:-97.7361,instagram:'@firehousehostel',website:'https://firehousehostel.com',reservation:'walk-in',photoUrl:''});
add({name:'The Dead Rabbit Austin',cuisine:'Cocktail Bar / Irish Pub',neighborhood:'Downtown',score:86,price:2,tags:['Cocktails','Bar','Late Night','Date Night','Happy Hour'],indicators:[],description:"Austin outpost of the award-winning NYC Irish pub with expertly crafted cocktails, fish and chips, and Irish coffee.",address:'204 E 6th St, Austin, TX 78701',lat:30.2675,lng:-97.7404,instagram:'@deadrabbitnyc',website:'https://deadrabbitbar.com',reservation:'walk-in',photoUrl:''});
add({name:'Marlow',cuisine:'Cocktail Bar',neighborhood:'Downtown',score:84,price:2,tags:['Cocktails','Bar','Date Night','Patio','Local Favorites'],indicators:['hidden-gem'],description:"Stylish bar overlooking Waller Creek with inventive riffs on classic cocktails and excellent presentation.",address:'700 E 6th St, Austin, TX 78701',lat:30.2672,lng:-97.7351,instagram:'@marlowatx',website:'https://marlowatx.com',reservation:'walk-in',photoUrl:''});
add({name:"Pete's Dueling Piano Bar",cuisine:'Bar / Entertainment',neighborhood:'Downtown',score:80,price:2,tags:['Live Music','Bar','Nightlife','Late Night','Casual'],indicators:[],description:"High-energy dueling piano bar where talented pianists take requests and keep the crowd singing all night.",address:'421 E 6th St, Austin, TX 78701',lat:30.2676,lng:-97.7385,instagram:'@petesduelingpianos',website:'https://petesduelingpiano.com',reservation:'walk-in',photoUrl:''});

// West 6th Street
add({name:'POP Champagne Lounge',cuisine:'Champagne Bar / Cocktails',neighborhood:'Downtown',score:85,price:3,tags:['Cocktails','Bar','Date Night','Nightlife','Happy Hour','Exclusive'],indicators:['hidden-gem'],description:"Austin's only dedicated champagne lounge offering upscale bubbles and refined cocktails.",address:'301 W 6th St, Austin, TX 78701',lat:30.2700,lng:-97.7475,instagram:'@popatx',website:'https://popatx.com',reservation:'walk-in',photoUrl:''});
add({name:'Devil May Care',cuisine:'Cocktail Bar',neighborhood:'Downtown',score:83,price:2,tags:['Cocktails','Bar','Date Night','Late Night','Nightlife'],indicators:[],description:"Moody underground cocktail bar on West 6th with craft spirits and an intimate atmosphere.",address:'512 W 6th St, Austin, TX 78701',lat:30.2703,lng:-97.7495,instagram:'@devilmaycareaustintx',website:'https://devilmaycareaustintx.com',reservation:'walk-in',photoUrl:''});

// Rainey Street
add({name:"Banger's Sausage House & Beer Garden",cuisine:'German / Beer Garden',neighborhood:'Rainey Street',score:88,price:2,tags:['Beer Garden','Patio','Live Music','Dog Friendly','Local Favorites','Casual'],indicators:['iconic'],description:"Rainey Street institution with 200+ beers on draft, house-made sausages, one of Austin's largest patios, and live music.",address:'79 Rainey St, Austin, TX 78701',lat:30.2569,lng:-97.7399,instagram:'@bangersaustin',website:'https://bangersaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Half Step',cuisine:'Cocktail Bar',neighborhood:'Rainey Street',score:89,price:2,tags:['Cocktails','Bar','Patio','Date Night','Local Favorites','Happy Hour'],indicators:['hidden-gem'],description:"Dimly lit bungalow with a large patio, consistently one of Austin's best cocktail bars with skilled bartenders.",address:'75 1/2 Rainey St, Austin, TX 78701',lat:30.2570,lng:-97.7398,instagram:'@halfstepatx',website:'https://halfstepatx.com',reservation:'walk-in',photoUrl:''});
add({name:'Lucille Patio Lounge',cuisine:'Cocktail Bar',neighborhood:'Rainey Street',score:84,price:2,tags:['Cocktails','Bar','Patio','Date Night','Dog Friendly'],indicators:[],description:"Upscale bungalow with hammocks, handcrafted cocktails, and a dog-friendly patio strung with twinkling lights.",address:'77 Rainey St, Austin, TX 78701',lat:30.2570,lng:-97.7399,instagram:'@lucilleaustin',website:'https://lucilleaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Clive Bar',cuisine:'Cocktail Bar',neighborhood:'Rainey Street',score:83,price:2,tags:['Cocktails','Bar','Rooftop','Patio','Nightlife','Late Night'],indicators:[],description:"Multi-level Rainey Street bar combining a historic bungalow with modern upper floors and elevated views.",address:'609 Davis St, Austin, TX 78701',lat:30.2568,lng:-97.7396,instagram:'@clivebar',website:'https://clivebar.com',reservation:'walk-in',photoUrl:''});

// Red River Cultural District
add({name:'Empire Control Room & Garage',cuisine:'Live Music Venue / Bar',neighborhood:'Downtown',score:83,price:2,tags:['Live Music','Bar','Nightlife','Late Night','Casual'],indicators:[],description:"Former auto shop turned cutting-edge club hosting hip-hop, soul, EDM across multiple indoor and outdoor spaces.",address:'606 E 7th St, Austin, TX 78701',lat:30.2681,lng:-97.7357,instagram:'@empirecontrolroom',website:'https://empirecontrolroom.com',reservation:'walk-in',photoUrl:''});

// East 6th Street
add({name:"Whisler's",cuisine:'Cocktail Bar / Mezcal',neighborhood:'East Austin',score:88,price:2,tags:['Cocktails','Bar','Patio','Happy Hour','Local Favorites','Date Night'],indicators:['hidden-gem'],description:"East 6th cornerstone with an all-mezcal bar upstairs and one of Austin's best happy hours drawing devoted locals.",address:'1816 E 6th St, Austin, TX 78702',lat:30.2620,lng:-97.7201,instagram:'@whislersatx',website:'https://whislersatx.com',reservation:'walk-in',photoUrl:''});
add({name:'The White Horse',cuisine:'Honky-Tonk / Bar',neighborhood:'East Austin',score:86,price:1,tags:['Live Music','Bar','Late Night','Local Favorites','Casual','Nightlife'],indicators:['iconic'],description:"Beloved East Austin honky-tonk with live country and roots music nightly, a diverse crowd, and a packed dance floor.",address:'500 Comal St, Austin, TX 78702',lat:30.2624,lng:-97.7254,instagram:'@thewhitehorseaustin',website:'https://thewhitehorseaustin.com',reservation:'walk-in',photoUrl:''});
add({name:'Daydreamer',cuisine:'Cocktail Bar',neighborhood:'East Austin',score:85,price:2,tags:['Cocktails','Bar','Date Night','Happy Hour','Local Favorites'],indicators:['hidden-gem'],description:"Caviar, champagne, and martini-themed bar with a dedicated Ramos gin fizz machine and approachable upscale vibe.",address:'1708 E 6th St, Austin, TX 78702',lat:30.2621,lng:-97.7213,instagram:'@daydreameratx',website:'https://daydreameratx.com',reservation:'walk-in',photoUrl:''});
add({name:'Lazarus Brewing Co.',cuisine:'Brewery / Beer Garden',neighborhood:'East Austin',score:83,price:1,tags:['Beer Garden','Bar','Patio','Dog Friendly','Casual','Happy Hour'],indicators:[],description:"East Austin brewery with a solid rotating tap list and a shady patio ideal for day drinking.",address:'1902 E 6th St, Austin, TX 78702',lat:30.2619,lng:-97.7196,instagram:'@lazarusbrewing',website:'https://lazarusbrewing.com',reservation:'walk-in',photoUrl:''});
add({name:"Kitty Cohen's",cuisine:'Bar / Pool Bar',neighborhood:'East Austin',score:81,price:2,tags:['Bar','Patio','Live Music','Cocktails','Dog Friendly','Casual'],indicators:[],description:"Quirky pool bar with pink flamingo wallpaper, live Sunday music, and creative cocktails in a retro East Austin setting.",address:'2211 Webberville Rd, Austin, TX 78702',lat:30.2622,lng:-97.7148,instagram:'@kittycohens',website:'https://kittycohens.com',reservation:'walk-in',photoUrl:''});
add({name:'Shangri-La',cuisine:'Dive Bar',neighborhood:'East Austin',score:78,price:1,tags:['Bar','Patio','Dive Bar','Happy Hour','Local Favorites','Casual'],indicators:['dive-bar'],description:"Original East Side dive bar with cheap drinks, a huge outdoor patio, and a late-running happy hour.",address:'1016 E 6th St, Austin, TX 78702',lat:30.2625,lng:-97.7279,instagram:'@shangrila_austin',website:'https://shangrilaaustintx.com',reservation:'walk-in',photoUrl:''});
add({name:'Zilker Brewing Company',cuisine:'Brewery / Beer Garden',neighborhood:'East Austin',score:84,price:2,tags:['Beer Garden','Bar','Patio','Dog Friendly','Casual','Local Favorites'],indicators:[],description:"Craft brewery with Texas-inspired beers, a dog-friendly taproom, and a laid-back outdoor patio.",address:'1701 E 6th St, Austin, TX 78702',lat:30.2621,lng:-97.7246,instagram:'@zilkerbeer',website:'https://zilkerbeer.com',reservation:'walk-in',photoUrl:''});

// Beer Gardens
add({name:'Lustre Pearl East',cuisine:'Bar / Beer Garden',neighborhood:'East Austin',score:80,price:1,tags:['Bar','Patio','Beer Garden','Dog Friendly','Casual','Local Favorites'],indicators:[],description:"Relocated original Rainey Street bungalow transplanted to East Austin with even more outdoor space and backyard bar energy.",address:'114 Linden St, Austin, TX 78702',lat:30.2615,lng:-97.7235,instagram:'@lustrepearleast',website:'https://lustrepearl.com',reservation:'walk-in',photoUrl:''});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAustin total:', arr.length);
