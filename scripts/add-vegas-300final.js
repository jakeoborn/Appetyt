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

// New 2026 Strip openings
add({name:"Gymkhana",cuisine:"Indian Fine Dining",neighborhood:"The Strip (Aria)",score:92,price:4,tags:["Indian","Fine Dining","Date Night","Cocktails","Celebrations"],indicators:["new-opening","celebrity-chef"],description:"Two-Michelin-starred London restaurant making its US debut at ARIA with bold, spice-driven Indian club cuisine and tandoori masala lamb chops.",address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",lat:36.1072,lng:-115.1765,instagram:"@gymkhanavegas",website:"",reservation:"Resy"});
add({name:"Cantina Contramar",cuisine:"Mexican / Seafood",neighborhood:"The Strip (Fontainebleau)",score:90,price:3,tags:["Mexican","Seafood","Date Night","Cocktails","Celebrity Chef"],indicators:["new-opening"],description:"Acclaimed chef Gabriela Camara brings her iconic Mexico City seafood-driven cooking to the Fontainebleau Las Vegas.",address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1355,lng:-115.1677,instagram:"@cantinacontramar",website:"",reservation:"Resy"});
add({name:"The Mayfair Supper Club",cuisine:"American / Supper Club",neighborhood:"The Strip (Bellagio)",score:88,price:4,tags:["Fine Dining","Live Music","Date Night","Celebrations","Late Night"],indicators:[],description:"Dinner-and-a-show experience at the Bellagio blending old-school glamour with modern Las Vegas showmanship.",address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1133,lng:-115.1763,instagram:"@themayfairlv",website:"",reservation:"OpenTable"});

// Off-strip gems
add({name:"Amador",cuisine:"Latin American / Tapas",neighborhood:"Chinatown",score:89,price:3,tags:["Latin American","Date Night","Cocktails","Critics Pick","Local Favorites"],indicators:["hidden-gem"],description:"Casual Latin-leaning evolution from the EDO team in Chinatown — the most impressive off-Strip dining experience in Vegas.",address:"3400 S Jones Blvd, Las Vegas, NV 89146",lat:36.1140,lng:-115.2118,instagram:"@amador_lv",website:""});

// Henderson / suburban
add({name:"Juan's Flaming Fajitas Centennial",cuisine:"Mexican / Tex-Mex",neighborhood:"North Las Vegas",score:81,price:2,tags:["Mexican","Casual","Family Friendly","Cocktails"],description:"North Las Vegas outpost of the beloved flaming-fajitas cantina with table-side sizzle and 200+ tequilas.",address:"7360 N Aliante Pkwy, North Las Vegas, NV 89084",lat:36.2820,lng:-115.1410,instagram:"@juansflamingfajitascantina",website:"https://juansflamingfajitas.com",suburb:true});
add({name:"Elia Authentic Greek Taverna",cuisine:"Greek / Mediterranean",neighborhood:"Spring Valley",score:87,price:2,tags:["Greek","Seafood","Date Night","Local Favorites"],indicators:["hidden-gem"],description:"Family-run Greek taverna with tableside loukaniko, grilled whole fish, and house-made spanakopita.",address:"8615 W Sahara Ave, Las Vegas, NV 89117",lat:36.1437,lng:-115.2892,instagram:"@eliaauthenticgreek",website:"https://elialv.com"});
add({name:"The Black Sheep",cuisine:"Vietnamese / Fusion",neighborhood:"Spring Valley",score:91,price:2,tags:["Vietnamese","Cocktails","Date Night","Critics Pick","Local Favorites"],indicators:["hidden-gem"],description:"Chef-driven Vietnamese fusion widely considered one of the best neighborhood restaurants in Las Vegas.",address:"8680 W Warm Springs Rd Ste 150, Las Vegas, NV 89148",lat:36.0460,lng:-115.2700,instagram:"@theblacksheeplv",website:"https://www.theblacksheeplv.com"});
add({name:"Herbs & Rye",cuisine:"Cocktail Bar / Steakhouse",neighborhood:"West of Strip",score:94,price:2,tags:["Cocktails","Bar","Date Night","Late Night","Steakhouse"],indicators:["iconic"],description:"One of America best cocktail bars with pre-Prohibition classics, hidden speakeasy vibes, and half-price happy hour steaks.",address:"3713 W Sahara Ave, Las Vegas, NV 89102",lat:36.1445,lng:-115.1898,instagram:"@herbsandrye",website:"https://herbsandrye.com"});

// More Strip spots
add({name:"Nobu at Paris Las Vegas",cuisine:"Japanese / Sushi",neighborhood:"The Strip (Paris Las Vegas)",score:90,price:4,tags:["Sushi","Fine Dining","Date Night","Celebrity Chef"],description:"Chef Nobu Matsuhisa world-renowned Japanese restaurant with black cod miso and yellowtail jalapeno.",address:"3655 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1128,lng:-115.1711,instagram:"@noburestaurants",website:"https://www.noburestaurants.com/las-vegas-paris/"});
add({name:"Cheri Rooftop",cuisine:"French / Rooftop",neighborhood:"The Strip (Paris Las Vegas)",score:84,price:3,tags:["Rooftop","French","Brunch","Cocktails","Scenic"],description:"Chic open-air rooftop at Paris Las Vegas with French cuisine, brunch, and sweeping Strip views.",address:"3655 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1126,lng:-115.1712,instagram:"@cherirooftop",website:"https://www.cherirooftop.com/"});
add({name:"The Bedford by Martha Stewart",cuisine:"American / Farmhouse",neighborhood:"The Strip (Paris Las Vegas)",score:83,price:3,tags:["Casual","Brunch","Date Night","Celebrity Chef"],description:"Martha Stewart first restaurant evoking her Connecticut farmhouse with elevated American comfort food and garden cocktails.",address:"3655 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1130,lng:-115.1710,instagram:"@bedfordbymarthastewart",website:""});
add({name:"Pampas Churrascaria",cuisine:"Brazilian Steakhouse",neighborhood:"The Strip (Planet Hollywood)",score:83,price:3,tags:["Steakhouse","Fine Dining","Celebrations"],description:"Brazilian rodizio-style steakhouse with tableside gaucho carvers and endless slow-roasted meats.",address:"3667 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1099,lng:-115.1713,instagram:"@pampasusa",website:""});
add({name:"Bound by Salvatore Calabrese",cuisine:"Cocktail Bar",neighborhood:"The Strip (The Cromwell)",score:86,price:3,tags:["Cocktails","Bar","Date Night","Late Night","Exclusive"],description:"Intimate cocktail lounge at The Cromwell from world-renowned mixologist Salvatore Calabrese.",address:"3595 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1163,lng:-115.1715,instagram:"@boundlasvegas",website:""});
add({name:"Via Via Food Hall",cuisine:"Food Hall",neighborhood:"The Strip (The Venetian)",score:85,price:2,tags:["Casual","Family Friendly","Local Favorites"],description:"Venetian buzzy food hall with Howlin Rays hot chicken, Scarrs Pizza, Ivan Ramen, and Turkey and the Wolf.",address:"3325 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1218,lng:-115.1700,instagram:"@venetianlasvegas",website:""});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
