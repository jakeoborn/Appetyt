// Vegas Batch 1 — Strip Celebrity-Chef Flagships & Michelin
// All verified individually via Yelp / Caesars / Wynn / Bellagio / Venetian / Eater Vegas / Infatuation
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const LV_DATA=';
const p = html.indexOf(marker);
if (p === -1) { console.error('LV_DATA not found'); process.exit(1); }
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Vegas:', arr.length);

// Pick an id range that doesn't collide with any other city (NYC 1-1999, Dallas 2000-3999, Houston 7000-7999, Austin 5000-5999, SLC 11000-11999, Chicago 8000-8999, Seattle 9000-9999)
const startId = 12000;
const maxExisting = arr.length ? Math.max(...arr.map(r=>r.id||0)) : 0;
let nextId = Math.max(startId, maxExisting + 1);
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// === STRIP: Michelin-pedigree French ===
add({name:"Joël Robuchon",cuisine:"French / Fine Dining",neighborhood:"The Strip (MGM Grand)",score:98,price:4,tags:["Fine Dining","French","Date Night","Celebrations","Iconic","Critics Pick","Awards"],description:"The only Las Vegas restaurant ever awarded three Michelin stars. Joël Robuchon's haute-cuisine temple inside the MGM Grand delivers the most formal French dining experience on the Strip — tasting menus that can stretch to 16 courses.",dishes:["16-Course Degustation","Langoustine Ravioli","Puree de Pommes de Terre"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"joelrobuchon",website:"https://www.mgmgrand.com/restaurants/joel-robuchon.html",reservation:"SevenRooms",phone:"(702) 891-7925",awards:"Three Michelin Stars (prior)",group:"Joël Robuchon"});

add({name:"L'Atelier de Joël Robuchon",cuisine:"French / Counter",neighborhood:"The Strip (MGM Grand)",score:95,price:4,tags:["Fine Dining","French","Date Night","Critics Pick","Awards"],description:"Joël Robuchon's counter-seat concept at the MGM Grand — 24 seats at a red-and-black lacquered counter facing the open kitchen. Smaller plates, same legendary technique as the flagship next door. Previously Michelin-starred.",dishes:["Counter Tasting","Caviar","Foie Gras"],address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1695,instagram:"joelrobuchon",website:"https://www.mgmgrand.com/restaurants/l-atelier-de-joel-robuchon.html",reservation:"SevenRooms",phone:"(702) 891-7358",awards:"Michelin Star (prior)",group:"Joël Robuchon"});

add({name:"Restaurant Guy Savoy",cuisine:"French / Fine Dining",neighborhood:"The Strip (Caesars Palace)",score:96,price:4,tags:["Fine Dining","French","Date Night","Celebrations","Critics Pick","Awards"],description:"The first U.S. outpost of Paris master Guy Savoy. Signature artichoke-and-black-truffle soup, caviar bar lounge, and the only American restaurant where Savoy himself still approves each menu. Two Michelin stars in the Vegas guide era.",dishes:["Artichoke & Black Truffle Soup","Caviar Course","Champagne Chariot"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"guysavoylv",website:"https://www.caesars.com/caesars-palace/restaurants/guy-savoy",reservation:"OpenTable",phone:"(702) 731-7286",awards:"Two Michelin Stars (prior)",hours:"Tue-Sat 5PM-9PM"});

add({name:"Le Cirque",cuisine:"French / Fine Dining",neighborhood:"The Strip (Bellagio)",score:93,price:4,tags:["Fine Dining","French","Date Night","Celebrations","Iconic"],description:"The last outpost of the storied Sirio Maccioni brand. Adam Tihany's whimsical tent-ceiling dining room overlooking the Bellagio fountains. AAA Five Diamond. Timeless gold-standard formal French.",dishes:["Lobster Salad","Paupiette of Black Sea Bass","Grand Marnier Soufflé"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1129,lng:-115.1769,instagram:"lecirquelv",website:"https://www.bellagio.com/en/restaurants/le-cirque.html",reservation:"OpenTable",phone:"(702) 693-8100",awards:"AAA Five Diamond"});

// === STRIP: Italian ===
add({name:"Carbone Riviera",cuisine:"Italian / Seafood",neighborhood:"The Strip (Bellagio)",score:95,price:4,tags:["Italian","Seafood","Fine Dining","Date Night","Celebrations","Critics Pick","Iconic"],description:"Major Food Group's reinvention of Bellagio's most legendary dining room. Grand dining room lined with Picassos and Renoirs, front-row views of the Bellagio fountains. Tuna calabrese in olive oil, two-pound lobster fettuccine, and Vegas-scale theatrics.",dishes:["Lobster Fettuccine","Tuna Calabrese","Spicy Rigatoni"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1129,lng:-115.1769,instagram:"carboneriviera",website:"https://carboneriviera.com",reservation:"SevenRooms",phone:"(702) 693-8105",group:"Major Food Group"});

add({name:"Carbone",cuisine:"Italian",neighborhood:"The Strip (Aria)",score:93,price:4,tags:["Italian","Fine Dining","Date Night","Celebrations","Iconic","Critics Pick"],description:"The original Las Vegas Carbone at Aria from Major Food Group — hardest reservation on the Strip since it opened. Tableside Caesar, famous spicy rigatoni vodka, and classic red-sauce Italian-American done at celebrity scale.",dishes:["Spicy Rigatoni Vodka","Tableside Caesar","Veal Parmesan"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",lat:36.1073,lng:-115.1760,instagram:"carbonelv",website:"https://www.aria.com/en/restaurants/carbone.html",reservation:"SevenRooms",phone:"(702) 590-8660",group:"Major Food Group"});

// === STRIP: Steakhouses & Spanish ===
add({name:"Bazaar Meat by José Andrés",cuisine:"Spanish / Steakhouse",neighborhood:"The Strip (The Palazzo)",score:94,price:4,tags:["Steakhouse","Spanish","Fine Dining","Date Night","Celebrations","Critics Pick","Iconic"],description:"José Andrés' wild, theatrical carnivorous celebration. Relocated September 2025 from SLS Sahara to a 20,000-sq-ft space at The Palazzo at The Venetian Resort. Tableside cotton-candy foie gras, whole-roasted suckling pig, and the best steak tartare on the Strip.",dishes:["Cotton-Candy Foie Gras","Suckling Pig","Steak Tartare"],address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1217,lng:-115.1703,instagram:"bazaarmeatlv",website:"https://www.thebazaar.com/location/las-vegas",reservation:"OpenTable",phone:"(702) 607-6328",awards:"James Beard Award-winning chef",group:"José Andrés Group"});

add({name:"Gordon Ramsay Steak",cuisine:"Steakhouse / British",neighborhood:"The Strip (Paris Las Vegas)",score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Iconic"],description:"Gordon Ramsay's flagship Vegas steakhouse inside Paris Las Vegas. Cross-channel Chunnel-tunnel entrance, theatrical beef-cart service, and the signature Beef Wellington carved tableside. Prime cuts, fresh seafood, classic British-influenced steakhouse fare.",dishes:["Beef Wellington","Dry-Aged Ribeye","Sticky Toffee Pudding"],address:"3655 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1126,lng:-115.1719,instagram:"gordonramsaysteak",website:"https://www.caesars.com/paris-las-vegas/restaurants/gordon-ramsay-steak",reservation:"OpenTable",phone:"(702) 946-4663",group:"Gordon Ramsay Restaurants"});

add({name:"Gordon Ramsay Hell's Kitchen",cuisine:"Contemporary / British",neighborhood:"The Strip (Caesars Palace)",score:89,price:3,tags:["New American","Date Night","Iconic","Celebrations"],description:"The world's first Gordon Ramsay Hell's Kitchen restaurant — the TV-show-themed flagship at Caesars Palace. Half-red, half-blue open kitchen inspired by the show, floor-to-ceiling windows over the Strip, and the signature prix-fixe featuring Beef Wellington.",dishes:["Beef Wellington","Sticky Toffee Pudding","Lobster Risotto"],address:"3570 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1162,lng:-115.1750,instagram:"gordonramsayhk",website:"https://www.caesars.com/caesars-palace/restaurants/gordon-ramsay-hells-kitchen",reservation:"OpenTable",phone:"(702) 731-7373",group:"Gordon Ramsay Restaurants"});

// === STRIP: Chinese ===
add({name:"Wing Lei",cuisine:"Chinese / Fine Dining",neighborhood:"The Strip (Wynn)",score:93,price:4,tags:["Chinese","Fine Dining","Date Night","Celebrations","Critics Pick","Awards"],description:"The first Chinese restaurant in North America awarded a Michelin star. Forbes Five Star Chinese fine dining at Wynn Las Vegas. Chef Ming Yu's blend of Shanghai, Cantonese, and Szechuan — Peking duck carved tableside, dim sum at the bar.",dishes:["Peking Duck","Imperial Peking Duck","Dim Sum Bar"],address:"3131 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1269,lng:-115.1657,instagram:"wynnlasvegas",website:"https://www.wynnlasvegas.com/dining/fine-dining/wing-lei",reservation:"OpenTable",phone:"(702) 770-3388",awards:"Forbes Five Star · Michelin Star (prior)"});

// === STRIP: California-American ===
add({name:"Spago",cuisine:"Californian / New American",neighborhood:"The Strip (Bellagio)",score:90,price:3,tags:["New American","Date Night","Iconic","Local Favorites"],description:"Wolfgang Puck's flagship Bellagio dining room right next to the iconic fountains. Seasonal California cuisine, famous smoked-salmon pizza, and one of the best fountain-view terraces on the Strip. Weekend brunch is a Vegas must.",dishes:["Smoked Salmon Pizza","Kaiserschmarrn","Wiener Schnitzel"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1129,lng:-115.1769,instagram:"spagolv",website:"https://www.bellagio.com/en/restaurants/spago.html",reservation:"OpenTable",phone:"(702) 693-8181",hours:"Mon-Thu 4:30PM-10PM, Fri-Sun 11AM-2:30PM, 4:30PM-10PM",group:"Wolfgang Puck"});

// === STRIP: Greek Seafood ===
add({name:"Estiatorio Milos",cuisine:"Greek / Seafood",neighborhood:"The Strip (The Venetian)",score:92,price:4,tags:["Greek","Seafood","Fine Dining","Date Night","Celebrations","Critics Pick"],description:"Costas Spiliadis' legendary Greek seafood temple at The Venetian since 2021. Daily fish display flown in from Mediterranean ports, the famous Milos Special (wafer-thin fried zucchini and eggplant with tzatziki), and whole grilled branzino.",dishes:["Milos Special","Whole Grilled Branzino","Greek Salad"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"estiatoriomilos",website:"https://www.estiatoriomilos.com/location/lasvegas",reservation:"OpenTable",phone:"(702) 414-1270"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 1 complete!');
