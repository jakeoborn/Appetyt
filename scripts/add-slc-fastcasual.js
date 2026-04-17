const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const SLC_DATA=';
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

add({name:'Zao Asian Cafe',cuisine:'Asian Fusion / Bowls',neighborhood:'Downtown SLC',score:80,price:1,tags:['Casual','Asian Fusion','Healthy','Local Favorites'],lat:40.7544,lng:-111.8710,instagram:'@zaoasiancafe',website:'https://www.zaoasiancafe.com',address:'639 E 400 S, Salt Lake City, UT 84102'});
add({name:'Hanaya Poke',cuisine:'Poke / Hawaiian',neighborhood:'Sugar House',score:82,price:2,tags:['Casual','Seafood','Healthy'],lat:40.7204,lng:-111.8739,instagram:'@hanayapokeslc',website:'https://www.hanayapokeslc.com',address:'675 E 2100 S, Salt Lake City, UT 84106'});
add({name:'LemonShark Poke',cuisine:'Poke / Hawaiian',neighborhood:'Downtown SLC',score:81,price:2,tags:['Casual','Seafood','Healthy'],lat:40.7607,lng:-111.8905,instagram:'@lemonsharkpoke',website:'https://lemonsharkpoke.com/saltlakecity',address:'6 E Broadway, Salt Lake City, UT 84111'});
add({name:'Savage Fish Poke',cuisine:'Poke / Hawaiian',neighborhood:'Millcreek',score:83,price:2,tags:['Casual','Seafood','Local Favorites'],indicators:['hidden-gem'],lat:40.7000,lng:-111.8609,instagram:'@savagefishpoke',website:'https://savagefishpoke.com',address:'970 E 3300 S, Millcreek, UT 84106'});
add({name:'Arempas',cuisine:'Venezuelan / Arepas',neighborhood:'Downtown SLC',score:84,price:1,tags:['Casual','Latin American','Late Night','Local Favorites'],indicators:['hidden-gem'],lat:40.7575,lng:-111.8911,instagram:'@arempasut',website:'https://www.arempas.com',address:'350 S State St, Salt Lake City, UT 84111'});
add({name:'Atomic Biscuit',cuisine:'Southern / Biscuits',neighborhood:'9th & 9th',score:82,price:1,tags:['Casual','Brunch','Southern','Local Favorites'],lat:40.7467,lng:-111.8793,instagram:'@atomicbiscuitslc',website:'https://www.atomicbiscuits.com',address:'401 E 900 S, Salt Lake City, UT 84111'});
add({name:'Tamarind',cuisine:'Vietnamese',neighborhood:'Downtown SLC',score:81,price:1,tags:['Casual','Vietnamese','Healthy','Local Favorites'],lat:40.7601,lng:-111.8910,instagram:'@tamarindslc',website:'https://www.tamarindslc.com',address:'120 S Main St, Salt Lake City, UT 84101'});
add({name:'ROCTACO',cuisine:'Mexican / Fusion Tacos',neighborhood:'Downtown SLC',score:82,price:1,tags:['Casual','Mexican','Late Night','Local Favorites'],lat:40.7590,lng:-111.8951,instagram:'@roc.taco',website:'https://www.roctaco.com',address:'248 S Edison St, Salt Lake City, UT 84111'});
add({name:'HallPass',cuisine:'Food Hall',neighborhood:'Gateway',score:80,price:2,tags:['Casual','Local Favorites','Family Friendly'],lat:40.7597,lng:-111.9010,instagram:'@hallpassslc',website:'https://www.hallpassslc.com',address:'153 S Rio Grande St, Salt Lake City, UT 84101'});
add({name:'Honest Eatery',cuisine:'Acai / Healthy Bowls',neighborhood:'Downtown SLC',score:78,price:2,tags:['Casual','Healthy','Brunch'],lat:40.7591,lng:-111.8914,instagram:'@eatathonest',website:'https://eatathonest.com',address:'115 S Regent St, Salt Lake City, UT 84111'});
add({name:'Meen Kine Poke & Grindz',cuisine:'Hawaiian / Poke',neighborhood:'Downtown SLC',score:80,price:1,tags:['Casual','Seafood','Local Favorites'],indicators:['hole-in-wall'],lat:40.7668,lng:-111.9101,instagram:'@meenkinepokegrinds',website:'https://www.meenkinepokeandgrindz.com',address:'23 N 900 W, Salt Lake City, UT 84116'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| SLC total:', arr.length);
