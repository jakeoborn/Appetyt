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

add({name:"Downtown Cocktail Room",cuisine:"Cocktail Bar",neighborhood:"Downtown",score:86,price:2,tags:["Cocktails","Bar","Date Night","Late Night"],indicators:["hidden-gem"],description:"Pioneer of Downtown Las Vegas cocktail culture — intimate, dimly lit bar with a sophisticated seasonal menu.",address:"111 Las Vegas Blvd S, Las Vegas, NV 89101",lat:36.1699,lng:-115.1428,instagram:"@dtcocktailroom",website:"https://www.downtowncocktailroom.com"});
add({name:"Golden Tiki",cuisine:"Tiki Bar",neighborhood:"Chinatown",score:84,price:2,tags:["Cocktails","Bar","Late Night","Local Favorites"],indicators:["hidden-gem"],description:"Vegas most immersive tiki bar with shipwrecked pirate theming and rum-forward tropical cocktails.",address:"3939 Spring Mountain Rd, Las Vegas, NV 89102",lat:36.1267,lng:-115.1880,instagram:"@goldentiki",website:"https://www.goldentiki.com"});
add({name:"DW Bistro",cuisine:"Jamaican-New Mexican Fusion",neighborhood:"Spring Valley",score:86,price:2,tags:["Casual","Date Night","Local Favorites","Critics Pick"],indicators:["hidden-gem"],description:"Beloved fusion of Jamaican jerk and New Mexican green chile in a cozy strip-mall setting.",address:"9175 W Flamingo Rd, Las Vegas, NV 89147",lat:36.1153,lng:-115.2958,instagram:"@dwbistro",website:"https://www.dwbistro.com"});
add({name:"Ellis Island BBQ",cuisine:"BBQ / Casino",neighborhood:"Paradise",score:82,price:1,tags:["BBQ","Casual","Late Night","Local Favorites"],indicators:["hole-in-wall","iconic"],description:"Legendary locals casino with the famous steak special and house-brewed craft beer behind the Strip.",address:"4178 Koval Ln, Las Vegas, NV 89109",lat:36.1141,lng:-115.1590,instagram:"@ellisislandlv",website:"https://www.ellisislandcasino.com"});
add({name:"Soulbelly BBQ",cuisine:"BBQ",neighborhood:"Arts District",score:87,price:2,tags:["BBQ","Casual","Local Favorites","Patio"],indicators:["hidden-gem"],description:"Bruce Kalman Arts District BBQ with Texas-style brisket and excellent craft beer selection.",address:"901 S Main St, Las Vegas, NV 89101",lat:36.1615,lng:-115.1530,instagram:"@soulbellylv",website:"https://soulbellybbq.com"});
add({name:"Cleo Las Vegas",cuisine:"Mediterranean",neighborhood:"The Strip (The Venetian)",score:86,price:3,tags:["Mediterranean","Date Night","Brunch","Patio","Cocktails"],description:"Mediterranean mezze-style sharing plates with wood-fired seafood and vibrant brunch party.",address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1208,lng:-115.1697,instagram:"@cleolasvegas",website:""});
add({name:"Marche Bacchus",cuisine:"French / Wine Bar",neighborhood:"Summerlin",score:90,price:3,tags:["French","Wine Bar","Date Night","Scenic","Patio"],indicators:["hidden-gem"],description:"Lake-view French bistro and wine shop in Desert Shores with one of Vegas most romantic patios.",address:"2620 Regatta Dr, Las Vegas, NV 89128",lat:36.1999,lng:-115.2688,instagram:"@marchebacchus",website:"https://marchebacchus.com"});
add({name:"Monzu Italian Oven + Bar",cuisine:"Italian",neighborhood:"Spring Valley",score:88,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick"],indicators:["hidden-gem"],description:"Sicilian-inspired neighborhood Italian with fresh pasta and wood-fired pizzas.",address:"6020 W Flamingo Rd, Las Vegas, NV 89103",lat:36.1153,lng:-115.2450,instagram:"@monzulv",website:"https://www.monzu.com"});
add({name:"Nora Italian Cuisine",cuisine:"Italian",neighborhood:"Spring Valley",score:88,price:3,tags:["Italian","Date Night","Local Favorites"],indicators:["hidden-gem"],description:"Beloved family-run Southern Italian with handmade pastas in a romantic off-Strip setting.",address:"5780 W Flamingo Rd, Las Vegas, NV 89103",lat:36.1153,lng:-115.2380,instagram:"@noraslv",website:"https://www.norasitaliancuisine.com"});
add({name:"Metro Pizza",cuisine:"Pizza",neighborhood:"Paradise",score:83,price:1,tags:["Pizza","Casual","Local Favorites","Family Friendly"],indicators:["iconic"],description:"Las Vegas original independent pizzeria since 1980 — New York style pizza loved for 45 years.",address:"1395 E Tropicana Ave, Las Vegas, NV 89119",lat:36.0993,lng:-115.1508,instagram:"@metropizzalv",website:"https://www.metropizza.com"});
add({name:"Hash House A Go Go",cuisine:"American / Brunch",neighborhood:"The Strip",score:82,price:2,tags:["Brunch","Casual","Family Friendly"],description:"Farm-to-counter concept known for massive twisted farm food portions — giant pancakes and sage fried chicken.",address:"3535 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1175,lng:-115.1708,instagram:"@hashhouse",website:"https://www.hashhouseagogo.com"});
add({name:"Egg Slut",cuisine:"Breakfast / Fast Casual",neighborhood:"The Strip (The Cosmopolitan)",score:83,price:1,tags:["Brunch","Casual","Late Night"],description:"LA cult breakfast sandwich shop at the Cosmopolitan with the signature coddled egg Slut.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@eggslut",website:"https://www.eggslut.com"});
add({name:"Mama Rabbit",cuisine:"Cocktail Bar / Mexican",neighborhood:"The Strip (Park MGM)",score:85,price:2,tags:["Cocktails","Bar","Late Night","Mexican"],description:"Park MGM agave-focused bar with 100+ mezcals and tequilas plus elevated Mexican bar bites.",address:"3770 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1023,lng:-115.1731,instagram:"@mamarabbitlv",website:""});
add({name:"Superfrico",cuisine:"Italian / Entertainment",neighborhood:"The Strip (The Cosmopolitan)",score:86,price:3,tags:["Italian","Live Music","Date Night","Late Night","Nightlife"],description:"Immersive Italian-American at the Cosmopolitan with live entertainment, art installations, and late-night energy.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@superfrico",website:""});
add({name:"Zuma Las Vegas",cuisine:"Japanese / Contemporary",neighborhood:"The Strip (The Cosmopolitan)",score:91,price:4,tags:["Japanese","Fine Dining","Date Night","Cocktails"],description:"World-renowned London-born contemporary Japanese izakaya at the Cosmopolitan with robata, sushi, and sake.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@zumarestaurant",website:"https://zumarestaurant.com/locations/las-vegas/"});
add({name:"Scarpetta Las Vegas",cuisine:"Italian",neighborhood:"The Strip (The Cosmopolitan)",score:89,price:4,tags:["Italian","Fine Dining","Date Night","Cocktails"],description:"Scott Conant Italian flagship known for iconic spaghetti with tomato and basil.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@scarpettalv",website:""});
add({name:"Jaleo Las Vegas",cuisine:"Spanish / Tapas",neighborhood:"The Strip (The Cosmopolitan)",score:88,price:3,tags:["Spanish","Date Night","Cocktails","Celebrations"],description:"Jose Andres award-winning Spanish tapas restaurant with paella, jamon, and a vibrant energy.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@jaborjaleo",website:""});
add({name:"Momofuku Las Vegas",cuisine:"Asian / Contemporary",neighborhood:"The Strip (The Cosmopolitan)",score:87,price:3,tags:["Asian Fusion","Date Night","Cocktails","Critics Pick"],description:"David Chang celebrated restaurant group at the Cosmopolitan with bold Asian-American cooking.",address:"3708 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1097,lng:-115.1731,instagram:"@momloveletter",website:""});
add({name:"Hakkasan Las Vegas",cuisine:"Chinese / Nightclub",neighborhood:"The Strip (MGM Grand)",score:89,price:4,tags:["Chinese","Nightlife","Fine Dining","Date Night","Celebrations"],description:"Michelin-starred Chinese restaurant and mega-nightclub spanning five floors at MGM Grand.",address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1713,instagram:"@haborhakkasan",website:""});
add({name:"Tom Colicchio Craftsteak",cuisine:"Steakhouse",neighborhood:"The Strip (MGM Grand)",score:87,price:4,tags:["Steakhouse","Fine Dining","Date Night"],description:"Top Chef judge Tom Colicchio farm-driven steakhouse at MGM Grand with prime cuts and seasonal sides.",address:"3799 S Las Vegas Blvd, Las Vegas, NV 89109",lat:36.1024,lng:-115.1713,instagram:"@tomcolicchio",website:""});
add({name:"Freed's Bakery",cuisine:"Bakery / Desserts",neighborhood:"Henderson",score:87,price:2,tags:["Bakery/Coffee","Family Friendly","Local Favorites"],indicators:["iconic"],description:"Las Vegas legendary bakery since 1959 — custom cakes and pastries for weddings, birthdays, and celebrations.",address:"9815 S Eastern Ave, Las Vegas, NV 89183",lat:36.0119,lng:-115.0775,instagram:"@freedsbakery",website:"https://freedsbakery.com"});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
