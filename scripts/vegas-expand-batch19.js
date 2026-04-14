// Vegas Batch 19 — Off-Strip, Henderson, brunch, bakeries, family favorites
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

// === HENDERSON / WATER STREET ===
add({name:"Juan's Flaming Fajitas & Cantina",cuisine:"Mexican",neighborhood:"Henderson (Water Street District)",score:88,price:2,tags:["Mexican","Date Night","Local Favorites","Iconic","Casual"],description:"Beloved Henderson Mexican restaurant on Water Street since 2013. Tableside sizzling fajitas, chile relleno, and carne asada tacos. Consistent 4.6 Yelp rating over 3,000+ reviews. Fried ice cream is a signature dessert.",dishes:["Flaming Fajitas","Chile Relleno","Fried Ice Cream"],address:"16 S Water St, Henderson, NV 89015",lat:36.0383,lng:-114.9815,instagram:"juansflamingfajitas",website:"https://juansflamingfajitas.com",reservation:"walk-in",phone:"(702) 476-4647",suburb:true,hours:"Daily 11AM-10PM"});

add({name:"Azzurra Cucina Italiana",cuisine:"Italian",neighborhood:"Henderson (Water Street District)",score:90,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick"],description:"Boutique Italian restaurant on Henderson's reimagined Water Street, opened 2023. Owned by local architect Windom Kimsey with Chef Alessandra Maderia. Well-prepared Italian classics — a hidden Nevada gem locals rave about.",dishes:["Handmade Pasta","Italian Classics","Seasonal Menu"],address:"322 S Water St, Henderson, NV 89015",lat:36.0351,lng:-114.9820,instagram:"azzurracucina",website:"https://www.azzurracucina.com",reservation:"OpenTable",phone:"(702) 268-7867",suburb:true,hours:"Mon-Sat 4PM-10PM, Closed Sun"});

// === SUMMERLIN / RAMPART ===
add({name:"Honey Salt",cuisine:"New American / Farm-to-Table",neighborhood:"Summerlin (Rampart)",score:89,price:3,tags:["New American","Brunch","Date Night","Critics Pick","Local Favorites","Family Friendly"],description:"Chef Elizabeth Blau and Kim Canteenwalla's Summerlin farm-to-table restaurant on Rampart. California-inspired dishes with seasonal, local ingredients. Weekend brunch with fluffy pancakes, avocado toast, and chilaquiles is a neighborhood favorite.",dishes:["Backyard Favorite Burger","Fluffy Pancakes","Skillet Chilaquiles"],address:"1031 S Rampart Blvd, Las Vegas, NV 89145",lat:36.1459,lng:-115.2848,instagram:"honeysaltlv",website:"https://honeysalt.com",reservation:"OpenTable",phone:"(702) 445-6100",suburb:true});

// === STRIP ===
add({name:"Mon Ami Gabi",cuisine:"French / Bistro",neighborhood:"The Strip (Paris Las Vegas)",score:89,price:3,tags:["French","Brunch","Date Night","Scenic","Iconic"],description:"Strip-side French bistro at the foot of the Paris Eiffel Tower, directly across from the Bellagio Fountains. Steak frites, moules frites, and one of the best patios on the Strip for people-watching. Sunlit dining room with classic brasserie vibes.",dishes:["Steak Frites","Moules Frites","Onion Soup Gratinée"],address:"3655 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1126,lng:-115.1719,instagram:"monamigabilv",website:"https://www.monamigabi.com/las-vegas",reservation:"OpenTable",phone:"(702) 944-4224",group:"Lettuce Entertain You"});

add({name:"Bouchon Bakery",cuisine:"French / Bakery",neighborhood:"The Strip (The Venetian)",score:90,price:1,tags:["Bakery/Coffee","French","Casual","Iconic","Local Favorites"],description:"Thomas Keller's French bakery at Grand Canal Shoppes since 2006. Classic Viennoiserie — croissants, pain au chocolat, macarons, tarts, and Equator Coffee custom-blended espresso drinks. The grab-and-go counterpart to Bouchon restaurant.",dishes:["Croissants","Pain au Chocolat","Macarons"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1207,lng:-115.1697,instagram:"thomaskellerrg",website:"https://thomaskeller.com/bouchonbakerylasvegas",reservation:"walk-in",phone:"(702) 414-6203",group:"Thomas Keller Restaurant Group",hours:"Daily 6AM-5PM"});

add({name:"Block 16 Urban Food Hall",cuisine:"Food Hall",neighborhood:"The Strip (The Cosmopolitan)",score:87,price:1,tags:["Casual","Late Night","Local Favorites","Iconic"],description:"The Cosmopolitan's urban food hall with top coast-to-coast concepts under one roof: District: Donuts Sliders Brew, Lardo, Pok Pok Wing, Tekka Bar, and more. Casual quick-bite alternative to the Cosmopolitan's fine-dining roster.",dishes:["District Donuts","Lardo Sandwiches","Pok Pok Wings"],address:"3708 S Las Vegas Blvd Level 2, Las Vegas, NV 89109",lat:36.1099,lng:-115.1738,instagram:"block16lv",website:"https://cosmopolitanlasvegas.mgmresorts.com",reservation:"walk-in",phone:"(702) 698-7000",hours:"Sun-Thu 7AM-10PM, Fri-Sat 7AM-12AM"});

// === DOWNTOWN ===
add({name:"Hash House A Go Go",cuisine:"American / Breakfast",neighborhood:"Downtown (Plaza Hotel)",score:86,price:2,tags:["Brunch","Casual","Local Favorites","Family Friendly","Iconic"],description:"Famous for 'twisted farm food' and massive-portion breakfasts. The Plaza downtown location is the original Vegas outpost. Tractor scrambles, sage-fried chicken benedicts, and plates that comically overflow.",dishes:["Tractor Scramble","Sage Fried Chicken Benedict","Flapjacks"],address:"1 S Main St, Las Vegas, NV 89101",lat:36.1706,lng:-115.1452,instagram:"hashhousegogo",website:"https://plaza.hashhouseagogo.com",reservation:"walk-in",phone:"(702) 386-2594"});

// === OFF-STRIP: EGGWORKS ===
add({name:"Egg Works",cuisine:"Breakfast / Brunch",neighborhood:"Green Valley (Sunset Rd)",score:85,price:1,tags:["Brunch","Casual","Local Favorites","Family Friendly"],description:"Las Vegas family-owned breakfast institution since 1988 (originally as The Egg & I). Multiple off-Strip locations. Enormous menu of eggs, pancakes, French toast, and skillets. A local go-to for weekend breakfast.",dishes:["Eggs Benedict","Pancakes","Breakfast Skillets"],address:"2490 E Sunset Rd, Las Vegas, NV 89120",lat:36.0722,lng:-115.1252,instagram:"eggworksfamilyrestaurants",website:"https://theeggworks.com",reservation:"walk-in",phone:"(702) 873-3447",suburb:true,hours:"Daily 6AM-2PM",group:"Egg Works"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 19 complete!');
