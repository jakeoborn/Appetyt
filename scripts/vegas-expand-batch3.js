// Vegas Batch 3 — Strip Italian, Asian, Spanish, celebrity-chef diversity
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

add({name:"LAGO by Julian Serrano",cuisine:"Italian",neighborhood:"The Strip (Bellagio)",score:90,price:3,tags:["Italian","Date Night","Scenic","Critics Pick"],description:"Julian Serrano's modern Italian at Bellagio designed for sharing. Small-plate format with handmade pastas and wood-fired dishes, set against the iconic Fountains of Bellagio. Beautiful patio is one of the best Strip-view brunch tables in town.",dishes:["Handmade Pasta","Wood-Fired Pizza","Small Plates"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1129,lng:-115.1769,instagram:"lagolv",website:"https://www.bellagio.com/en/restaurants/lago.html",reservation:"OpenTable",phone:"(702) 693-8888"});

add({name:"Catch Las Vegas",cuisine:"Seafood / Asian",neighborhood:"The Strip (Aria)",score:90,price:4,tags:["Seafood","Date Night","Celebrations","Critics Pick"],description:"The Vegas outpost of NYC's Catch franchise at Aria — globally-inspired seafood, sushi, and steak with a celebrity-magnet Strip scene. Signature hit sandwich, truffle sashimi, and show-stopping desserts.",dishes:["Hit Sandwich","Truffle Sashimi","Crispy Shrimp"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",lat:36.1073,lng:-115.1760,instagram:"catchrestaurants",website:"https://www.catchrestaurants.com/location/catch-las-vegas",reservation:"SevenRooms",phone:"(702) 590-5757",group:"Catch Hospitality Group"});

add({name:"Jaleo by José Andrés",cuisine:"Spanish / Tapas",neighborhood:"The Strip (The Cosmopolitan)",score:91,price:3,tags:["Spanish","Date Night","Critics Pick","Iconic"],description:"José Andrés' Spanish tapas flagship at the Cosmopolitan. Paella grilled over an authentic Spanish wood fire — one of only three in the world — plus jamón ibérico, classic tapas, and sangria. Playful, theatrical, and always packed.",dishes:["Paella","Jamón Ibérico","Patatas Bravas"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"jaleorestaurants",website:"https://www.jaleo.com/las-vegas",reservation:"OpenTable",phone:"(702) 698-7950",hours:"Mon-Thu 5PM-10PM, Fri-Sat 4:30PM-11PM, Sun 5PM-10PM",group:"José Andrés Group"});

add({name:"Tao Asian Bistro",cuisine:"Pan-Asian",neighborhood:"The Strip (The Venetian)",score:88,price:3,tags:["Asian","Date Night","Late Night","Iconic","Celebrations"],description:"Iconic Tao Group Pan-Asian restaurant at the Venetian since 2005. Two-story dining room with a 20-foot Buddha statue, giant infinity pool, and the buzziest after-dinner scene on the Strip that transitions into Tao Nightclub.",dishes:["Satay of Chilean Sea Bass","Peking Duck","Wagyu Filet"],address:"3377 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1214,lng:-115.1686,instagram:"taogroup",website:"https://taogroup.com/venues/tao-asian-bistro-las-vegas",reservation:"OpenTable",phone:"(702) 388-8338",group:"Tao Group Hospitality"});

add({name:"Mott 32",cuisine:"Chinese",neighborhood:"The Strip (The Palazzo)",score:93,price:4,tags:["Chinese","Fine Dining","Date Night","Celebrations","Critics Pick","Awards"],description:"Hong Kong-born Mott 32's Vegas outpost at The Palazzo — one of the most awarded Chinese restaurant brands in the world. Iberico pork char siu, 42-day Peking duck, and dim sum at weekend brunch. Stunning Joyce Wang-designed interior.",dishes:["Iberico Char Siu","42-Day Peking Duck","Hand-Cut Dim Sum"],address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1217,lng:-115.1703,instagram:"mott32",website:"https://mott32.com/las-vegas",reservation:"SevenRooms",phone:"(702) 607-3232"});

add({name:"Yardbird Table & Bar",cuisine:"Southern",neighborhood:"The Strip (The Venetian)",score:90,price:3,tags:["Southern","Brunch","Local Favorites","Iconic"],description:"Southern comfort at scale — fried chicken, biscuits, and bourbon for 27+ hours of weekend service. Signature 'Mama's Chicken, Biscuits and Watermelon' dish, banana cream pie, and one of the Strip's most packed weekend brunches.",dishes:["Mama's Chicken Biscuits Watermelon","Fried Chicken","Banana Cream Pie"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"yardbirdlv",website:"https://www.venetianlasvegas.com/dining/restaurants/yardbird.html",reservation:"OpenTable",phone:"(702) 297-6541",hours:"Daily 7AM-11PM"});

add({name:"LAVO Italian",cuisine:"Italian",neighborhood:"The Strip (The Palazzo)",score:87,price:3,tags:["Italian","Date Night","Late Night","Iconic","Celebrations"],description:"Tao Group's Italian at The Palazzo — Mediterranean bath house-inspired design, coastal Italian cuisine, and handcrafted cocktails. Famous one-pound meatball, plus the legendary LAVO Sunday nightclub-brunch that transitions into late-night party.",dishes:["One-Pound Meatball","Chicken Parm","Italian Seafood"],address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1217,lng:-115.1703,instagram:"lavolv",website:"https://taogroup.com/venues/lavo-italian-restaurant-las-vegas",reservation:"OpenTable",phone:"(702) 791-1800",group:"Tao Group Hospitality"});

add({name:"Beauty & Essex",cuisine:"New American",neighborhood:"The Strip (The Cosmopolitan)",score:89,price:3,tags:["New American","Date Night","Late Night","Cocktails","Iconic"],description:"Tao Group's speakeasy-style Cosmopolitan restaurant — enter through a working pawn shop. Eclectic globally-inspired small plates, a gold-leafed dining room, and one of the best-hidden-in-plain-sight date nights in Vegas.",dishes:["Grilled Cheese Flight","Tuna Poke Wontons","Pretzel Croquettes"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"beautyandessexlv",website:"https://taogroup.com/venues/beauty-essex-las-vegas",reservation:"OpenTable",phone:"(702) 737-0707",group:"Tao Group Hospitality"});

add({name:"Giada",cuisine:"Italian / California",neighborhood:"The Strip (The Cromwell)",score:89,price:3,tags:["Italian","Brunch","Date Night","Scenic","Critics Pick"],description:"Giada De Laurentiis' first-ever restaurant at the Cromwell — California-accented Italian with panoramic views of the Bellagio fountains from the signature patio. Famous lemon spaghetti, Marsala-herb chicken meatballs, rosemary focaccia, and standout brunch.",dishes:["Lemon Spaghetti","Chicken Meatballs","Rosemary Focaccia"],address:"3595 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1159,lng:-115.1732,instagram:"giadavegas",website:"https://www.caesars.com/cromwell/restaurants/giada",reservation:"OpenTable",phone:"(702) 777-3799"});

add({name:"Sinatra",cuisine:"Italian",neighborhood:"The Strip (Encore at Wynn)",score:90,price:4,tags:["Italian","Fine Dining","Date Night","Celebrations","Iconic"],description:"Forbes Travel Guide-recognized Italian restaurant paying tribute to Old Blue Eyes at Encore. Sophisticated Italian cooking, the signature 'Ossobuco My Way' from Sinatra's personal recipe, and one of the most beautiful Italian dining rooms on the Strip.",dishes:["Ossobuco My Way","Lobster Spaghetti","Veal Milanese"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/fine-dining/sinatra",reservation:"OpenTable",phone:"(702) 770-5320",hours:"Sun-Thu 5PM-9:30PM, Fri-Sat 5PM-10PM",awards:"Forbes Travel Guide"});

add({name:"Sage",cuisine:"New American / Farm-to-Table",neighborhood:"The Strip (Aria)",score:91,price:4,tags:["New American","Fine Dining","Date Night","Cocktails","Critics Pick"],description:"Chef Shawn McClain's contemporary American farm-to-table at Aria. Open kitchen, seasonal menu, and one of the Strip's most respected cocktail programs. Signature foie gras 'custard brûlée' and a chef-driven late-night bar menu.",dishes:["Foie Gras Custard Brûlée","Kobe Beef Tartare","Seasonal Tasting"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",lat:36.1073,lng:-115.1760,instagram:"sagearia",website:"https://aria.mgmresorts.com/en/restaurants/sage.html",reservation:"OpenTable",phone:"(702) 590-7757"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 3 complete!');
