// Vegas Batch 13 — Fontainebleau collection
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const LV_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Vegas:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

add({name:"Papi Steak",cuisine:"Steakhouse",neighborhood:"The Strip (Fontainebleau)",score:91,price:4,tags:["Steakhouse","Fine Dining","Date Night","Late Night","Celebrations","Critics Pick","Iconic"],description:"David Grutman's over-the-top steakhouse at Fontainebleau — Golden Era Hollywood swagger with modern spectacle. Signature 32-oz Glatt Kosher Tomahawk and 55-oz Australian Wagyu 'Beef Case' arrive with theatrical tableside presentation. Nightly DJ.",dishes:["55oz Beef Case","Tomahawk","Tableside Theatrics"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"papisteaklv",website:"https://papisteak.com/lasvegas",reservation:"SevenRooms",phone:"(702) 998-3800",group:"Groot Hospitality",hours:"Sun-Thu 5:30PM-10:30PM, Fri-Sat 5:30PM-11:30PM"});

add({name:"Don's Prime",cuisine:"Steakhouse",neighborhood:"The Strip (Fontainebleau)",score:92,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Critics Pick"],description:"Fontainebleau's sophisticated award-winning chophouse — Golden Era Hollywood elegance meets prime cuts and Japanese Wagyu. Exclusive Cross Creek Wagyu grown in Colorado and served only here. Quiet, clubby, old-school.",dishes:["Cross Creek Wagyu","Dry-Aged Steaks","Martinis"],address:"2777 S Las Vegas Blvd LVL 1, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"donsprimelv",website:"https://www.fontainebleaulasvegas.com/dining/restaurants/dons-prime",reservation:"SevenRooms",phone:"(702) 678-9000",hours:"Daily 5PM-10PM"});

add({name:"Mother Wolf",cuisine:"Italian / Roman",neighborhood:"The Strip (Fontainebleau)",score:94,price:4,tags:["Italian","Fine Dining","Date Night","Celebrations","Critics Pick","Iconic"],description:"Chef Evan Funke's Roman-Italian flagship at Fontainebleau — widely considered the best new Strip Italian. La cucina Romana: hyper-seasonal handmade pastas, wafer-thin wood-fired pizzas, and the signature cacio e pepe. Grand Art Deco dining room.",dishes:["Cacio e Pepe","Rigatoni all'Amatriciana","Wood-Fired Pizza"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"motherwolflv",website:"https://motherwolflv.com",reservation:"SevenRooms",phone:"(702) 678-9170",hours:"Sun, Mon-Thu 5PM-9:30PM, Fri-Sat 4PM-10:30PM"});

add({name:"Komodo",cuisine:"Southeast Asian",neighborhood:"The Strip (Fontainebleau)",score:90,price:4,tags:["Asian","Date Night","Late Night","Celebrations","Iconic"],description:"David Grutman's Miami-born Southeast Asian at Fontainebleau. Bold flavors, high-energy scene, signature Szechuan short rib, and Peking duck. Music-driven late-night dinner party.",dishes:["Szechuan Short Rib","Peking Duck","Tuna Pizza"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"komodolv",website:"https://www.fontainebleaulasvegas.com/dining/restaurants/komodo",reservation:"SevenRooms",phone:"(702) 998-3100",group:"Groot Hospitality"});

add({name:"KYU",cuisine:"Wood-Fired / Asian",neighborhood:"The Strip (Fontainebleau)",score:91,price:3,tags:["Asian","Date Night","Critics Pick","Local Favorites","Awards"],description:"Miami-born wood-fired Asian at Fontainebleau — Desert Companion Magazine's Strip Restaurant of the Year 2024. Wood-fire focused cooking with Asian-inspired flavors. Signature stick-of-fire chicken, brussels sprouts, and short-rib tacos.",dishes:["Stick of Fire Chicken","Brussels Sprouts","Short Rib Tacos"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"kyurestaurants",website:"https://www.kyurestaurants.com/location/kyu-lasvegas",reservation:"OpenTable",phone:"(702) 678-7777",awards:"Desert Companion Strip Restaurant of the Year 2024"});

add({name:"Chyna Club",cuisine:"Chinese / Contemporary",neighborhood:"The Strip (Fontainebleau)",score:88,price:4,tags:["Chinese","Date Night","Critics Pick","Celebrations"],description:"Fontainebleau's reinvented modern Chinese — dim sum-style service with contemporary technique. Peking duck, XO short ribs, and elevated regional Chinese in a stunning two-story dining room with glass koi display.",dishes:["Peking Duck","XO Short Rib","Dim Sum"],address:"2777 S Las Vegas Blvd LVL 1, Las Vegas, NV 89109",lat:36.1436,lng:-115.1624,instagram:"chynaclublv",website:"https://www.fontainebleaulasvegas.com/dining/restaurants/chyna-club",reservation:"SevenRooms",phone:"(702) 678-9000",hours:"Wed-Sun 5:30PM-9:30PM, Closed Mon-Tue"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 13 complete!');
