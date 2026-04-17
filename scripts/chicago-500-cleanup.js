// Chicago: remove duplicate Virtue entry and add 3 more to reach 500
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const pos = html.indexOf('const CHICAGO_DATA');
const arrS = html.indexOf('[', pos);
let d=0,arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
// Remove the duplicate (keep original id 113 "Virtue Hyde Park", remove id 540 "Virtue Restaurant Hyde Park")
let before = arr.length;
arr = arr.filter(r => r.id !== 540);
console.log('Removed duplicate. Before:', before, 'After:', arr.length);

let maxId = Math.max(...arr.map(r=>r.id)), nextId = maxId+1;
const ex = new Set(arr.map(r=>r.name.toLowerCase()));
let added=0;
function add(s){
  if(ex.has(s.name.toLowerCase()))return;
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.instagram=s.instagram||'';s.website=s.website||'';s.reservation=s.reservation||'walk-in';s.hours=s.hours||'';s.dishes=s.dishes||[];s.photoUrl='';
  arr.push(s);ex.add(s.name.toLowerCase());added++;
}

add({name:"Via Lima",cuisine:"Peruvian",neighborhood:"North Center",score:84,price:1,tags:["Peruvian","Casual","Local Favorites","Latin"],description:"North Center Peruvian with ceviche, lomo saltado, and aji de gallina drawing regulars from across the city.",dishes:["Ceviche","Lomo Saltado","Aji de Gallina"],address:"4024 N Western Ave, Chicago, IL 60618",lat:41.9537,lng:-87.6879,reservation:"walk-in"});

add({name:"North Center Prime",cuisine:"Steakhouse",neighborhood:"North Center",score:85,price:3,tags:["Steakhouse","Date Night","Local Favorites"],description:"Neighborhood steakhouse in North Center with hand-cut prime steaks, fresh seafood, and elevated sides.",dishes:["Prime Ribeye","Fresh Seafood","Elevated Sides"],address:"4244 N Lincoln Ave, Chicago, IL 60618",lat:41.9574,lng:-87.6830,reservation:"OpenTable"});

add({name:"Nuevo Chicago",cuisine:"Kosher / International",neighborhood:"West Rogers Park",score:80,price:1,tags:["Kosher","International","Casual","Local Favorites"],description:"West Rogers Park kosher restaurant with American-Chinese-Middle Eastern dishes for the Devon Avenue community.",dishes:["Kosher Plates","International Dishes","Chulent"],address:"2858 W Devon Ave, Chicago, IL 60659",lat:41.9971,lng:-87.6990,reservation:"walk-in"});

console.log('Added:', added, '| New total:', arr.length);
const newArr = JSON.stringify(arr);
const newHtml = html.substring(0, arrS) + newArr + html.substring(arrE);
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Done. Written to index.html');
