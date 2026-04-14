// Seattle Batch 13 — Greenwood/Phinney Ridge + Madison Park fill-ins
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
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

add({name:"Nishino",cuisine:"Japanese / Sushi",neighborhood:"Madison Park",score:91,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Local Favorites","Critics Pick"],description:"Chef Tatsu Nishino's Madison Park sushi temple since 1995 — Seattle's benchmark for traditional Japanese sushi. Steps from the Washington Park Arboretum. Omakase counter or traditional sushi experience. The Nishino family has trained a generation of Seattle sushi chefs.",dishes:["Omakase","Traditional Sushi","Seasonal Specials"],address:"3130 E Madison St Ste 106, Seattle, WA 98112",lat:47.6332,lng:-122.2970,instagram:"nishinorestaurant",website:"https://nishinorestaurant.com",reservation:"OpenTable",phone:"(206) 322-5800",hours:"Wed-Sat 5PM-9PM, Sun 4:30PM-8:30PM, Closed Mon-Tue"});

add({name:"The Chicken Supply",cuisine:"Filipino / Fried Chicken",neighborhood:"Phinney Ridge",score:89,price:2,tags:["Filipino","Local Favorites","Critics Pick","Casual"],description:"Phinney Ridge Filipino fried chicken specialist from the former Opus Co. team. Entirely gluten-free menu — chicken skin crunches like potato chips, juicy white-meat cubes, and signature Filipino flavors. Seattle Times best fried chicken.",dishes:["Filipino Fried Chicken","Gluten-Free Sides","Chicken Rice Bowl"],address:"7410 Greenwood Ave N, Seattle, WA 98103",lat:47.6812,lng:-122.3555,instagram:"thechickensupply",website:"https://thechickensupply.com",reservation:"walk-in",phone:"(206) 257-4460",hours:"Wed-Sun 4PM-8PM, Closed Mon-Tue"});

add({name:"Ben's Bread Co.",cuisine:"Bakery",neighborhood:"Phinney Ridge",score:90,price:1,tags:["Bakery/Coffee","Local Favorites","Critics Pick","Casual"],description:"Chef Ben Lowell's Phinney Ridge bakery — crusty-fluffy sourdough, blue corn pound cake with lemon glaze, tangy English muffins, and Wednesday pizza nights. Beloved local morning destination with a second Greenwood outpost.",dishes:["Sourdough Bread","Blue Corn Pound Cake","Wednesday Pizza"],address:"216 N 70th St, Seattle, WA 98103",lat:47.6797,lng:-122.3558,instagram:"bensbread.co",website:"https://bensbread.com",reservation:"walk-in",phone:"(206) 420-7506",hours:"Daily 8AM-3PM, Wed 5:30PM-7:30PM pizza"});

add({name:"Yanni's Greek Restaurant",cuisine:"Greek",neighborhood:"Phinney Ridge / Greenwood",score:89,price:2,tags:["Greek","Mediterranean","Local Favorites","Date Night","Casual","Family Friendly"],description:"Family-owned Greek restaurant on Greenwood Ave since 1984. The Infatuation's favorite Greek spot in Seattle. Avgolemono soup, gyro platters, endless pita and dips. A Phinney Ridge neighborhood institution.",dishes:["Gyro Platter","Avgolemono Soup","Spanakopita"],address:"7419 Greenwood Ave N, Seattle, WA 98103",lat:47.6812,lng:-122.3555,instagram:"yannisgreek",website:"http://www.yannis-greek-restaurant.com",reservation:"walk-in",phone:"(206) 783-6945"});

add({name:"Halcyon Brewing Company",cuisine:"Brewpub",neighborhood:"Greenwood",score:87,price:2,tags:["Brewery","Casual","Local Favorites","Late Night","Family Friendly"],description:"Greenwood Ave brewpub with one of the neighborhood's best patios — murals, picnic tables, and elevated brewery food. Seattle dogs, dumplings, furikake-dusted fries, popcorn chicken, and crisp IPAs.",dishes:["Seattle Dogs","Furikake Fries","House IPAs"],address:"8564 Greenwood Ave N, Seattle, WA 98103",lat:47.6912,lng:-122.3555,instagram:"halcyonbrewingco",website:"https://www.halcyonbrewingco.com",reservation:"walk-in",phone:"(206) 457-4178"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 13 complete!');
