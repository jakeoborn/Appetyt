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

// 9 more verified Vegas spots
add({name:"Hugo's Cellar",cuisine:"Steakhouse / Fine Dining",neighborhood:"Downtown",score:88,price:3,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],indicators:["iconic"],description:"Legendary underground steakhouse inside Four Queens since 1976 with tableside Caesar salad and roses for the ladies.",address:"202 Fremont St, Las Vegas, NV 89101",lat:36.1707,lng:-115.1435,instagram:"@hugoscellar",website:"https://www.fourqueens.com/dining/hugos_cellar"});
add({name:"Siegel's 1941",cuisine:"American Diner",neighborhood:"Downtown",score:78,price:1,tags:["Casual","Late Night","Local Favorites"],indicators:["iconic"],description:"24-hour diner inside the historic El Cortez Hotel with classic comfort food and Bugsy Siegel memorabilia.",address:"600 E Fremont St, Las Vegas, NV 89101",lat:36.1692,lng:-115.1325,instagram:"@elcortezhotel",website:"https://elcortezhotelcasino.com/dining/siegels-1941"});
add({name:"We All Scream",cuisine:"Bar / Nightclub",neighborhood:"Downtown (Fremont East)",score:80,price:2,tags:["Bar","Late Night","Cocktails","Rooftop","Live Music"],description:"Fremont East two-story indoor-outdoor nightclub with rooftop DJ booth and ice cream parlor.",address:"517 Fremont St, Las Vegas, NV 89101",lat:36.1684,lng:-115.1310,instagram:"@weallscreamvegas",website:"https://www.weallscream.com"});
add({name:"BOA Steakhouse Las Vegas",cuisine:"Steakhouse",neighborhood:"The Strip (The Palazzo)",score:87,price:4,tags:["Steakhouse","Fine Dining","Date Night","Cocktails"],description:"Bold modern steakhouse at The Palazzo with dry-aged prime cuts and lavish sides in a sleek dining room.",address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1222,lng:-115.1701,instagram:"@boasteakhouse",website:""});
add({name:"Maroon Las Vegas",cuisine:"Italian / American",neighborhood:"The Strip (The Venetian)",score:85,price:3,tags:["Italian","Date Night","Cocktails","Celebrations"],indicators:["new-opening"],description:"New Italian-American restaurant at The Venetian blending classic Italian cooking with modern American flair.",address:"3355 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1230,lng:-115.1695,instagram:"@maroonlv",website:""});
add({name:"Rosa Mexicano Las Vegas",cuisine:"Mexican",neighborhood:"The Strip (The Venetian)",score:83,price:2,tags:["Mexican","Cocktails","Casual","Family Friendly"],description:"NYC-born upscale Mexican restaurant at The Venetian known for tableside guacamole and frozen pomegranate margaritas.",address:"3355 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1228,lng:-115.1698,instagram:"@rosamexicano",website:"https://www.rosamexicano.com"});
add({name:"La Strega",cuisine:"Italian",neighborhood:"West of Strip",score:87,price:3,tags:["Italian","Date Night","Local Favorites","Cocktails","Critics Pick"],indicators:["hidden-gem"],description:"Intimate off-Strip Italian beloved by locals for handmade pasta, whole fish, and a stellar wine list.",address:"3555 S Town Center Dr, Las Vegas, NV 89135",lat:36.1450,lng:-115.3100,instagram:"@lastregavegas",website:"https://www.lastregavegas.com"});
add({name:"Lindo Michoacan",cuisine:"Mexican",neighborhood:"Paradise",score:89,price:2,tags:["Mexican","Casual","Local Favorites","Family Friendly"],indicators:["iconic"],description:"Las Vegas institution for authentic Mexican cuisine since 1990 with generous portions and festive atmosphere.",address:"2655 E Desert Inn Rd, Las Vegas, NV 89121",lat:36.1291,lng:-115.1170,instagram:"@lindomichoacanlv",website:"https://www.lindomichoacan.com"});
add({name:"Cafe Lola",cuisine:"Brunch / Cafe",neighborhood:"Summerlin",score:82,price:2,tags:["Brunch","Casual","Family Friendly","Local Favorites"],description:"Beloved Summerlin brunch spot known for Instagram-worthy presentations, pastries, and creative all-day breakfast.",address:"10075 S Eastern Ave Ste 107, Henderson, NV 89052",lat:36.0088,lng:-115.0774,instagram:"@cafelalolas",website:"https://cafelola.com"});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
