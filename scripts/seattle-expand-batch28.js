// Seattle Batch 28 — Final 4 spots to reach 300.
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

add({name:"Glo's",cuisine:"Diner / Brunch",neighborhood:"Capitol Hill",score:87,price:1,tags:["Brunch","Breakfast","Diner","Iconic","Local Favorites","LGBTQ Friendly"],description:"Capitol Hill's beloved LGBTQ-owned diner since 1987 — eggs Benedict with legendary hollandaise, hash browns, and all-day breakfast that earns long lines and devoted regulars.",address:"1621 E Olive Way, Seattle, WA 98102",lat:47.6165,lng:-122.3215,instagram:"@glosseattle",website:"https://www.glosseattle.com",phone:"(206) 324-2577",hours:"Daily 8AM-3PM",reservation:"walk-in",indicators:["lgbtq-owned"]});

add({name:"Volunteer Park Cafe and Pantry",cuisine:"American / Cafe / Brunch",neighborhood:"Capitol Hill",score:86,price:2,tags:["Cafe","Brunch","Breakfast","Neighborhood Gem","Dog Friendly","Local Favorites"],description:"Beloved neighborhood café and pantry adjacent to Volunteer Park — seasonal brunch, excellent coffee, and local pantry goods in a warm community-oriented space.",address:"1501 17th Ave E, Seattle, WA 98112",lat:47.6324,lng:-122.3101,instagram:"@cafeandpantry",website:"https://www.volunteerpark.cafe",phone:"(206) 822-6566",hours:"Wed-Sun 8AM-5PM, Closed Mon-Tue",reservation:"walk-in"});

add({name:"Dreamland Bar and Diner",cuisine:"American / Diner / Bar",neighborhood:"Fremont",score:85,price:2,tags:["Brunch","Diner","Bar","Late Night","LGBTQ Friendly","Drag Brunch","Dog Friendly"],description:"Fremont all-day diner and bar with a massive patio, dance floor, and weekend drag brunch — elevated diner classics, killer cocktails, and the most welcoming energy in the neighborhood.",address:"3401 Evanston Ave N, Seattle, WA 98103",lat:47.6476,lng:-122.3511,instagram:"@dreamlandfremont",website:"https://www.dreamlandfremont.com",phone:"(206) 402-4902",hours:"Daily 9AM-11PM",reservation:"walk-in"});

add({name:"Outsider BBQ",cuisine:"BBQ / American",neighborhood:"Fremont",score:85,price:2,tags:["BBQ","American","Casual","Outdoor","Beer Garden","Local Favorites"],description:"Fremont outdoor BBQ joint with a beer garden — slow-smoked brisket, pulled pork, and ribs in a laid-back setting that draws lines on sunny Seattle weekends.",address:"4010 Leary Way NW, Seattle, WA 98107",lat:47.6541,lng:-122.3617,instagram:"@outsiderbbqseattle",website:"https://www.outsiderbbq.com",phone:"(206) 659-4573",hours:"Wed-Sun 12PM-9PM, Closed Mon-Tue",reservation:"walk-in"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 28 complete!');
