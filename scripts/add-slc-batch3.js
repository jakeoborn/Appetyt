const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const SLC_DATA=';
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
  s.group=s.group||''; s.suburb=false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation=s.reservation||'walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Downtown SLC
add({name:'Killa Nikkei',cuisine:'Peruvian-Japanese / Nikkei',neighborhood:'Downtown SLC',score:86,price:3,tags:['Sushi','Cocktails','Date Night','Seafood'],lat:40.7617,lng:-111.8838,instagram:'@killanikkei',website:'https://killanikkei.com',address:'279 E 300 S, Salt Lake City, UT 84111'});
add({name:'Eight Settlers Distillery',cuisine:'Distillery Bar / American',neighborhood:'Downtown SLC',score:79,price:2,tags:['Cocktails','Bar','Local Favorites'],indicators:['new-opening'],lat:40.7600,lng:-111.8905,instagram:'@eightsettlers',website:'https://eightsettlers.com',address:'215 S Main St, Salt Lake City, UT 84111'});

// Sugar House
add({name:'Pretty Bird Hot Chicken',cuisine:'Nashville Hot Chicken',neighborhood:'Sugar House',score:83,price:1,tags:['Casual','Local Favorites','Late Night'],indicators:['hole-in-wall'],lat:40.7175,lng:-111.8725,instagram:'@prettybirdchicken',website:'https://prettybirdchicken.com',address:'675 E 2100 S, Salt Lake City, UT 84106'});
add({name:"Feldman's Deli",cuisine:'Jewish Deli',neighborhood:'Sugar House',score:85,price:2,tags:['Brunch','Casual','Local Favorites'],indicators:['hidden-gem'],lat:40.7063,lng:-111.8480,instagram:'@feldmansdeli',website:'https://feldmansdeli.com',address:'2005 E 2700 S, Salt Lake City, UT 84109'});
add({name:'Sushi Groove',cuisine:'Japanese / Sushi',neighborhood:'Sugar House',score:82,price:2,tags:['Sushi','Casual','Date Night','Late Night'],lat:40.7079,lng:-111.8632,instagram:'@sushigrooveutah',website:'https://sushigrooveutah.com',address:'2910 S Highland Dr, Salt Lake City, UT 84106'});
add({name:'Little Saigon',cuisine:'Vietnamese',neighborhood:'Sugar House',score:81,price:1,tags:['Vietnamese','Casual','Local Favorites'],indicators:['hole-in-wall'],lat:40.7185,lng:-111.8665,instagram:'@littlesaigonut',website:'https://littlesaigonutah.com',address:'2021 Windsor St, Salt Lake City, UT 84105'});
add({name:'Muertos Cantina',cuisine:'Mexican',neighborhood:'Sugar House',score:82,price:2,tags:['Mexican','Cocktails','Casual','Local Favorites'],lat:40.7201,lng:-111.8635,instagram:'@delosmuertosrestaurant',website:'https://delosmuertos-mexican-restaurant.com',address:'1215 Wilmington Ave Ste 110, Salt Lake City, UT 84106'});
add({name:'Spitz Mediterranean',cuisine:'Mediterranean',neighborhood:'Sugar House',score:81,price:1,tags:['Mediterranean','Casual','Vegetarian Friendly','Local Favorites'],lat:40.7203,lng:-111.8640,instagram:'@spitzrestaurant',website:'https://spitz-restaurant.com',address:'1201 E Wilmington Ave, Salt Lake City, UT 84106'});
add({name:'Sara Thai Kitchen',cuisine:'Thai',neighborhood:'Sugar House',score:82,price:2,tags:['Thai','Casual','Local Favorites'],lat:40.7176,lng:-111.8764,instagram:'@sarathaikitchen',website:'https://sarathaikitchen.com',address:'609 E 2100 S, Salt Lake City, UT 84106'});

// 9th & 9th
add({name:"Blue Gene's",cuisine:'Cocktail Bar',neighborhood:'9th & 9th',score:80,price:2,tags:['Cocktails','Bar','Date Night','Late Night','Local Favorites'],lat:40.7593,lng:-111.8791,instagram:'@bluegenesslc',website:'https://bluegenesslc.com',address:'239 S 500 E, Salt Lake City, UT 84102'});

// Millcreek
add({name:'Table X',cuisine:'New American / Tasting Menu',neighborhood:'Millcreek',score:90,price:4,tags:['Fine Dining','Date Night','Tasting Menu','Critics Pick','Celebrations'],indicators:['iconic'],lat:40.6979,lng:-111.8590,instagram:'@tablexrestaurant',website:'https://tablexrestaurant.com',address:'1457 E 3350 S, Salt Lake City, UT 84106',awards:'Salt Lake Magazine Best Restaurant 2025'});
add({name:'Provisions',cuisine:'New American',neighborhood:'Millcreek',score:85,price:2,tags:['Brunch','Local Favorites','Casual'],lat:40.6980,lng:-111.8384,instagram:'@slcprovisions',website:'https://slcprovisions.com',address:'3364 S 2300 E, Salt Lake City, UT 84109'});
add({name:'Kin Sen Thai',cuisine:'Thai',neighborhood:'Millcreek',score:84,price:2,tags:['Thai','Casual','Local Favorites'],indicators:['hidden-gem'],lat:40.6985,lng:-111.8188,instagram:'@kinsen_thai',website:'https://kinsenthai.com',address:'3011 E 3300 S, Millcreek, UT 84109'});
add({name:'Gurkhas',cuisine:'Indian / Nepali',neighborhood:'Millcreek',score:83,price:2,tags:['Indian','Casual','Vegetarian Friendly','Local Favorites'],lat:40.6984,lng:-111.8186,instagram:'@gurkhasslc',website:'https://gurkhasutah.com',address:'3025 E 3300 S, Salt Lake City, UT 84109'});

// West Valley
add({name:'Fat Fish',cuisine:'Japanese / Vietnamese Fusion',neighborhood:'West Valley',score:82,price:2,tags:['Sushi','Casual','Local Favorites'],lat:40.6990,lng:-111.9275,instagram:'@fatfishslc',website:'https://fatfishslc.com',address:'1980 W 3500 S, West Valley City, UT 84119'});
add({name:'Shahrazad Market',cuisine:'Middle Eastern / Iranian',neighborhood:'West Valley',score:82,price:1,tags:['Middle Eastern','Casual','Local Favorites'],indicators:['hole-in-wall'],lat:40.7171,lng:-111.9197,instagram:'@shahrazad_slc',website:'http://shahrazadslc.com',address:'1615 W 2100 S, Salt Lake City, UT 84119'});

// Sandy
add({name:'La Caille',cuisine:'French Fine Dining',neighborhood:'Sandy',score:89,price:4,tags:['Fine Dining','French','Date Night','Romantic','Celebrations'],indicators:['iconic'],lat:40.5937,lng:-111.8094,instagram:'@lacaillerestaurant',website:'https://lacaille.com',address:'9565 Wasatch Blvd, Sandy, UT 84092'});
add({name:'Paradise Biryani Pointe',cuisine:'Indian',neighborhood:'Sandy',score:84,price:2,tags:['Indian','Casual','Local Favorites'],lat:40.5612,lng:-111.8735,instagram:'@paradisebiryanipointe',website:'https://paradisebiryanipointe.com',address:'10481 S 700 E, Sandy, UT 84070'});

// Provo
add({name:'Station 22 Cafe',cuisine:'American / Brunch',neighborhood:'Downtown Provo',score:81,price:1,tags:['Brunch','Casual','Southern','Local Favorites'],lat:40.2336,lng:-111.6605,instagram:'@stationtwentytwo',website:'https://station22cafe.com',address:'22 W Center St, Provo, UT 84601'});
add({name:"Hruska's Kolaches",cuisine:'Bakery / Czech',neighborhood:'Downtown Provo',score:82,price:1,tags:['Bakery/Coffee','Casual','Local Favorites','Family Friendly'],indicators:['hidden-gem'],lat:40.2335,lng:-111.6660,instagram:'@hruskaskolaches',website:'https://hruskaskolaches.com',address:'434 W Center St, Provo, UT 84601'});

// Park City
add({name:'Grappa Italian',cuisine:'Italian Fine Dining',neighborhood:'Park City',score:88,price:4,tags:['Italian','Fine Dining','Date Night','Celebrations'],indicators:['iconic'],lat:40.6448,lng:-111.4975,instagram:'@grappa_pc',website:'https://grapparestaurant.com',address:'151 Main St, Park City, UT 84060'});
add({name:'No Name Saloon',cuisine:'American Bar / Burgers',neighborhood:'Park City',score:78,price:1,tags:['Bar','Casual','Local Favorites','Late Night'],indicators:['iconic'],lat:40.6454,lng:-111.4978,instagram:'@nonamesaloonpc',website:'https://nonamesaloon.net',address:'447 Main St, Park City, UT 84060'});

// Murray
add({name:"Penny Ann's Cafe",cuisine:'American Diner',neighborhood:'Murray',score:80,price:1,tags:['Brunch','Casual','Family Friendly','Local Favorites'],lat:40.6488,lng:-111.8401,instagram:'@pennyannscafe',website:'https://pennyannscafe.com',address:'1810 E 5600 S, Murray, UT 84121'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| SLC total:', arr.length);
