// Vegas Batch 4 — Sushi, Japanese, French brasserie, more Strip standouts
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

add({name:"Mizumi",cuisine:"Japanese",neighborhood:"The Strip (Wynn)",score:92,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Scenic"],description:"Wynn's Japanese fine-dining temple with waterfall views and a private teppanyaki room. Sushi bar, robata grill, and traditional Japanese menu by chef Devin Hashimoto. One of the most romantic Japanese tables on the Strip.",dishes:["Sushi Bar","Robata Grill","Teppanyaki"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/fine-dining/mizumi",reservation:"OpenTable",phone:"(702) 770-3320",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-10:30PM"});

add({name:"Morimoto",cuisine:"Japanese / Sushi",neighborhood:"The Strip (MGM Grand)",score:91,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Celebrations","Iconic"],description:"Iron Chef Masaharu Morimoto's flagship Vegas restaurant at MGM Grand. Innovative Japanese cuisine — Iberico-pork sous vide, signature duck-duck-goose, whole fish carved tableside. Dramatic open kitchen with an omakase counter.",dishes:["Duck Duck Goose","Omakase","Japanese A5 Wagyu"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"morimotolasvegas",website:"https://ironchefmorimoto.com/Restaurant/morimoto-las-vegas",reservation:"SevenRooms",phone:"(702) 891-3001",group:"Morimoto"});

add({name:"Wakuda",cuisine:"Japanese / Omakase",neighborhood:"The Strip (The Venetian)",score:94,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Celebrations","Critics Pick","Awards"],description:"Two-Michelin-star chef Tetsuya Wakuda's first U.S. restaurant at the Palazzo Lobby of The Venetian. Traditional-meets-modern Japanese cuisine, a private 10-seat omakase room, and one of the most design-forward dining rooms in Vegas.",dishes:["Omakase Counter","A5 Wagyu","Confit of Ocean Trout"],address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1217,lng:-115.1703,instagram:"wakudalasvegas",website:"https://www.wakudajapanese.com/location/wakuda-las-vegas",reservation:"Resy",phone:"(702) 665-8592",awards:"Tetsuya Wakuda — two Michelin stars"});

add({name:"Zuma",cuisine:"Japanese / Izakaya",neighborhood:"The Strip (The Cosmopolitan)",score:92,price:4,tags:["Japanese","Date Night","Celebrations","Critics Pick","Iconic"],description:"Global izakaya brand from chef Rainer Becker — Cosmopolitan Las Vegas outpost. Robata-grilled skewers, sushi, sashimi, and modern Japanese shared plates in a theatrical two-story dining room. Formula 1 and concert-week magnet.",dishes:["Robata Skewers","Sea Bream Sashimi","A5 Wagyu Hot Stone"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"zumarestaurant",website:"https://www.zumarestaurant.com/en/las-vegas",reservation:"OpenTable",phone:"(702) 698-2199",group:"Zuma"});

add({name:"Hakkasan",cuisine:"Chinese / Cantonese",neighborhood:"The Strip (MGM Grand)",score:89,price:4,tags:["Chinese","Fine Dining","Date Night","Late Night","Iconic"],description:"Global modern Cantonese brand at MGM Grand — award-winning Hakkasan cuisine with dim sum, crispy duck salad, and Peking duck. Connected to the legendary Hakkasan Nightclub, making it one of the hottest pre-party dinners on the Strip.",dishes:["Crispy Duck Salad","Peking Duck","Dim Sum Platter"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"hakkasanvegas",website:"https://hakkasan.com/las-vegas",reservation:"OpenTable",phone:"(702) 891-7888",group:"Tao Group Hospitality"});

add({name:"Bardot Brasserie",cuisine:"French / Brasserie",neighborhood:"The Strip (Aria)",score:92,price:3,tags:["French","Brunch","Date Night","Critics Pick","Local Favorites"],description:"Michael Mina's French brasserie at Aria since 2015 — classic Parisian brasserie cuisine with one of the best brunches in Vegas. Duck wings, escargots, steak frites, and the legendary French onion soup. Intricate Art Nouveau dining room.",dishes:["Duck Wings","Steak Frites","French Onion Soup"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",lat:36.1073,lng:-115.1760,instagram:"bardotbrasserie",website:"https://theminagroup.com/restaurants/bardot-brasserie",reservation:"OpenTable",phone:"(702) 590-8610",group:"Mina Group"});

add({name:"STK Steakhouse",cuisine:"Steakhouse",neighborhood:"The Strip (The Cosmopolitan)",score:87,price:4,tags:["Steakhouse","Date Night","Late Night","Cocktails","Iconic"],description:"Third-floor Cosmopolitan steakhouse from The ONE Group. DJ-driven scene, floor-to-ceiling Strip views, and Japanese A5 Wagyu alongside classic prime steaks. One of the buzziest dinner-into-late-night spots in Vegas.",dishes:["A5 Wagyu","Bone-In Filet","Truffle Fries"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"stksteakhouse",website:"https://stksteakhouse.com/en-us/location/las-vegas",reservation:"OpenTable",phone:"(702) 698-7990",group:"The ONE Group"});

add({name:"YUI Edomae Sushi",cuisine:"Japanese / Omakase",neighborhood:"Chinatown",score:95,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Awards","Tasting Menu"],description:"Widely considered the best omakase in Las Vegas — chef Gen Mizoguchi's traditional Edomae sushi counter off the Strip on Arville. 17-course omakase, fish flown in from Tokyo's Toyosu Market. Intimate, reservation-only.",dishes:["17-Course Omakase","Nigiri","Aged Fish"],address:"3460 Arville St Ste J, Las Vegas, NV 89102",lat:36.1280,lng:-115.2013,instagram:"yuiedomaesushi",website:"https://www.yuisushi.com",reservation:"Tock",phone:"(702) 483-0331"});

add({name:"Kame Omakase",cuisine:"Japanese / Omakase",neighborhood:"Chinatown",score:94,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Tasting Menu"],description:"Off-Strip omakase destination in the Spring Mountain / Chinatown corridor. Traditional edomae-style sushi in an intimate 10-seat room. Reservations book weeks out. Alongside Yui, widely considered the top omakase experience in Vegas.",dishes:["Multi-Course Omakase","Edomae Nigiri","Seasonal Tsumami"],address:"4355 Spring Mountain Rd Ste 108, Las Vegas, NV 89102",lat:36.1262,lng:-115.2012,instagram:"kameomakase",website:"https://www.kameomakase.com",reservation:"Tock",phone:"(725) 735-5286"});

add({name:"Kaiseki Yuzu",cuisine:"Japanese / Kaiseki",neighborhood:"Chinatown",score:93,price:4,tags:["Japanese","Fine Dining","Date Night","Critics Pick","Awards","Tasting Menu"],description:"Traditional Kyoto-style kaiseki off-Strip in the Chinatown corridor. Multi-course seasonal Japanese washoku tasting menu, handcrafted from washoku traditions. One of the only true kaiseki experiences in Las Vegas.",dishes:["Seasonal Kaiseki","Sashimi Course","Steamed Dishes"],address:"4450 W Sahara Ave Ste 105, Las Vegas, NV 89102",lat:36.1443,lng:-115.2026,instagram:"kaisekiyuzu",website:"https://www.kaisekiyuzu.com",reservation:"Tock",phone:"(702) 778-8889"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 4 complete!');
