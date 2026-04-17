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

add({name:"Eggslut Las Vegas",cuisine:"Breakfast / Fast Casual",neighborhood:"The Strip (The Cosmopolitan)",score:83,price:1,tags:["Brunch","Casual","Late Night"],description:"LA cult breakfast sandwich shop at the Cosmopolitan with the signature coddled egg over potato puree.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@eggslut",website:"https://www.eggslut.com"});
add({name:"Diablo's Cantina",cuisine:"Mexican / Bar",neighborhood:"The Strip",score:79,price:2,tags:["Mexican","Bar","Late Night","Casual","Patio"],description:"Strip-side Mexican cantina with strong margaritas, people-watching patio, and a party atmosphere open until 4 AM.",address:"3400 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1200,lng:-115.1700,instagram:"@diabloscantina",website:""});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
