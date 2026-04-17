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

add({name:"Du-par's Restaurant & Bakery",cuisine:"American Diner",neighborhood:"Downtown",score:80,price:1,tags:["Brunch","Casual","Family Friendly","Late Night"],indicators:["iconic"],description:"Classic California diner at the Golden Gate Hotel with fresh-baked pies, pancakes, and 24-hour service.",address:"1 Fremont St, Las Vegas, NV 89101",lat:36.1716,lng:-115.1450,instagram:"@duparslv",website:""});
add({name:"Lola's Louisiana Kitchen",cuisine:"Cajun / Creole",neighborhood:"Downtown",score:87,price:2,tags:["Southern","Casual","Local Favorites","Family Friendly"],indicators:["hidden-gem"],description:"Authentic Cajun-Creole with jambalaya, crawfish etouffee, and bread pudding — a slice of New Orleans in Downtown Vegas.",address:"241 W Charleston Blvd, Las Vegas, NV 89102",lat:36.1578,lng:-115.1523,instagram:"@lolaslakitchen",website:"https://lolaslakitchen.com"});
add({name:"Tao Asian Bistro",cuisine:"Asian Fusion",neighborhood:"The Strip (The Venetian)",score:88,price:3,tags:["Asian Fusion","Date Night","Cocktails","Celebrations"],indicators:["iconic"],description:"The original Tao experience at The Venetian — Pan-Asian fine dining with the giant Buddha, sushi, and dim sum.",address:"3377 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1214,lng:-115.1686,instagram:"@taogroup",website:"https://taogroup.com/venues/tao-las-vegas/"});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
