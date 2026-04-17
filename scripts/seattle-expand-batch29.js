// Seattle Batch 29 — Final spot to reach 300.
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const SEATTLE_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Seattle:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';s.photoUrl='';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// Kamonegi was already there — use Lupo Fremont which is verified
add({name:"Lupo",cuisine:"Pizza / Italian",neighborhood:"Fremont",score:86,price:2,tags:["Pizza","Italian","Neighborhood Gem","Date Night","Casual","Local Favorites"],description:"Fremont neighborhood pizzeria with wood-fired pies — thin-crust Roman-style pizzas with quality toppings and an easy-going atmosphere that has made it a local favorite.",address:"4303 Fremont Ave N, Seattle, WA 98103",lat:47.6565,lng:-122.3500,instagram:"@luposeattle",website:"",phone:"(206) 466-9220",hours:"Tue-Sun 4PM-10PM, Closed Mon",reservation:"walk-in"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 29 complete!');
