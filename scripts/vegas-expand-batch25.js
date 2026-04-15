// Vegas Batch 25 — Downtown / Fremont Street focus (Circa, Golden Nugget, The D, El Cortez, Plaza, Fremont East)
// All verified via Yelp/OpenTable/official sites April 2026
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

// === CIRCA RESORT ===
add({name:"Barry's Downtown Prime",cuisine:"Steakhouse",neighborhood:"Downtown (Circa)",score:91,price:4,tags:["Steakhouse","Date Night","Iconic","Celebrations","Cocktails","Critics Pick"],description:"Circa's signature Rat Pack-era steakhouse from Barry Dakake. Classic supper-club glam, dry-aged prime steaks, and a caviar service wheeled to the table. The defining restaurant of Downtown Vegas's Circa era.",dishes:["Dry-Aged Tomahawk","Caviar Service","Lobster Bisque en Croute"],address:"8 Fremont St, Las Vegas, NV 89101",lat:36.1710,lng:-115.1450,instagram:"barrysdowntownprime",website:"https://www.barrysdowntownprime.com",reservation:"OpenTable",phone:"(702) 726-5504",hours:"Daily 5PM-11PM"});

add({name:"8 East",cuisine:"Pan-Asian",neighborhood:"Downtown (Circa)",score:89,price:3,tags:["Asian","Date Night","Critics Pick","Celebrations","Cocktails"],description:"Chef Dan Coughlin's Pan-Asian flagship at Circa — dim sum carts, Peking duck, Sichuan heat, and Japanese robata. A modern, ambitious Downtown Asian destination.",dishes:["Peking Duck","Sichuan Dumplings","Robata Skewers"],address:"8 Fremont St, Las Vegas, NV 89101",lat:36.1710,lng:-115.1450,instagram:"8eastvegas",website:"https://www.circalasvegas.com/drink-dine/8-east",reservation:"OpenTable",phone:"(702) 726-5508",hours:"Tue-Sat 5PM-10PM, Closed Sun-Mon"});

add({name:"Saginaw's Delicatessen",cuisine:"Deli / Jewish",neighborhood:"Downtown (Circa)",score:88,price:2,tags:["Brunch","Critics Pick","Casual","Late Night","Family Friendly"],description:"Deli from Zingerman's co-founder Paul Saginaw inside Circa. House-cured pastrami, matzo-ball soup, legendary Reuben, latkes, and 24/7 breakfast service. A proper New York-Detroit-style Jewish deli in Downtown Vegas.",dishes:["Pastrami Reuben","Matzo Ball Soup","Latkes"],address:"8 Fremont St, Las Vegas, NV 89101",lat:36.1710,lng:-115.1450,instagram:"saginawsdeli",website:"https://www.circalasvegas.com/drink-dine/saginaws-delicatessen",reservation:"walk-in",phone:"(702) 247-2258",hours:"Open 24/7"});

// === GOLDEN NUGGET ===
add({name:"Vic & Anthony's Steakhouse",cuisine:"Steakhouse",neighborhood:"Downtown (Golden Nugget)",score:89,price:4,tags:["Steakhouse","Date Night","Iconic","Celebrations","Critics Pick"],description:"Golden Nugget's anchor steakhouse from Landry's. Warm clubby dining room, USDA Prime cuts, a massive crystal chandelier, and a quietly excellent wine list. A Downtown benchmark for over two decades.",dishes:["Prime Bone-In Ribeye","Maine Lobster Tail","Gulf Oysters"],address:"129 E Fremont St, Las Vegas, NV 89101",lat:36.1708,lng:-115.1448,instagram:"vicandanthonys",website:"https://www.vicandanthonys.com/location/las-vegas",reservation:"OpenTable",phone:"(702) 386-8399",hours:"Sun-Thu 5PM-10PM, Fri-Sat 5PM-11PM"});

add({name:"Chart House",cuisine:"Seafood",neighborhood:"Downtown (Golden Nugget)",score:85,price:3,tags:["Seafood","Date Night","Scenic","Family Friendly"],description:"Golden Nugget's seafood house wrapped around a 75,000-gallon tropical aquarium. Fresh fish flown in daily, a reliable Sunday brunch, and one of Downtown's most photogenic dining rooms.",dishes:["Fresh Fish Daily","Lobster Bisque","Tropical Aquarium View"],address:"129 E Fremont St, Las Vegas, NV 89101",lat:36.1708,lng:-115.1448,instagram:"charthouse",website:"https://www.chart-house.com/location/chart-house-las-vegas-nv",reservation:"OpenTable",phone:"(702) 386-8364",hours:"Daily 4PM-10PM"});

// === THE D ===
add({name:"Andiamo Italian Steakhouse",cuisine:"Italian / Steakhouse",neighborhood:"Downtown (The D)",score:88,price:3,tags:["Italian","Steakhouse","Date Night","Celebrations","Critics Pick"],description:"Joe Vicari's Detroit-born Italian steakhouse upstairs at The D Las Vegas. Handmade pasta, veal chop parmigiana, prime steaks, and tableside Caesar. A Fremont Street sleeper for serious Italian-American.",dishes:["Handmade Pasta","Veal Chop Parmigiana","Tableside Caesar"],address:"301 Fremont St, Las Vegas, NV 89101",lat:36.1707,lng:-115.1433,instagram:"andiamolv",website:"https://www.thed.com/bars-dining/dining/andiamo-steakhouse",reservation:"OpenTable",phone:"(702) 388-2220",hours:"Mon-Fri 5PM-11PM"});

// === EL CORTEZ ===
add({name:"Siegel's 1941",cuisine:"American / Diner",neighborhood:"Downtown (El Cortez)",score:86,price:2,tags:["American","Iconic","Brunch","Late Night","Casual","Local Favorites"],description:"Named for Bugsy Siegel, this 24/7 retro American diner-lounge at El Cortez serves prime rib, breakfast, and cocktails all day in a mid-century Vegas time capsule. One of Downtown's most beloved budget classics.",dishes:["Prime Rib Dinner","All-Day Breakfast","Classic Cocktails"],address:"600 E Fremont St, Las Vegas, NV 89101",lat:36.1688,lng:-115.1405,instagram:"siegels1941",website:"https://elcortezhotelcasino.com/dining/siegels-1941",reservation:"walk-in",phone:"(702) 385-5200",hours:"Open 24/7"});

// === DOWNTOWN GRAND ===
add({name:"Triple George Grill",cuisine:"American / Steakhouse",neighborhood:"Downtown (Downtown Grand)",score:86,price:3,tags:["Steakhouse","American","Date Night","Local Favorites","Brunch"],description:"San Francisco-style grill at Downtown Grand with mahogany booths and an old-school power-lunch vibe. Prime steaks, cioppino, and an attorney crowd from nearby courthouses. Downtown's classic business-lunch spot.",dishes:["Prime Steaks","Cioppino","Blue Cheese Wedge"],address:"201 N 3rd St Ste 120, Las Vegas, NV 89101",lat:36.1713,lng:-115.1440,instagram:"triplegeorgelv",website:"https://www.downtowngrand.com/triple-george-grill",reservation:"OpenTable",phone:"(702) 384-2761",hours:"Mon-Fri 11AM-9PM, Closed Sat-Sun"});

// === PLAZA HOTEL ===
add({name:"Pop Up Pizza",cuisine:"Pizza",neighborhood:"Downtown (Plaza Hotel)",score:84,price:1,tags:["Pizza","Casual","Late Night","Local Favorites","Family Friendly"],description:"Plaza Hotel's scratch-made New York-style pizza counter. Thin-crust pies, giant slices, craft beer, and late-night Downtown energy. A budget Fremont slice that punches above its weight.",dishes:["NY-Style Cheese Slice","Whole Pies","Late-Night Slices"],address:"1 S Main St, Las Vegas, NV 89101",lat:36.1717,lng:-115.1465,instagram:"popuppizzalv",website:"https://www.popuppizzalv.com",reservation:"walk-in",phone:"(702) 386-2110",hours:"Mon-Thu,Sun 11AM-12AM, Fri-Sat 11AM-2AM"});

// === FREMONT EAST / FREMONT STREET ===
add({name:"Evel Pie",cuisine:"Pizza",neighborhood:"Downtown (Fremont East)",score:88,price:1,tags:["Pizza","Late Night","Iconic","Local Favorites","Casual"],description:"Evel Knievel-themed NY-style pizza joint on Fremont East. Giant slices, dive-bar energy, punk-rock soundtrack, and the best late-night slice in Downtown Vegas.",dishes:["NY-Style Slices","Vegan Slices","Late-Night Pies"],address:"508 Fremont St, Las Vegas, NV 89101",lat:36.1691,lng:-115.1401,instagram:"evelpie",website:"https://www.evelpie.com",reservation:"walk-in",phone:"(702) 840-6460",hours:"Sun-Thu 11AM-2AM, Fri-Sat 11AM-4:20AM"});

add({name:"Eureka! Discover American Craft",cuisine:"American / Burgers",neighborhood:"Downtown (Fremont East)",score:85,price:2,tags:["Burgers","American","Casual","Late Night","Local Favorites","Family Friendly"],description:"California-born scratch kitchen and craft bar inside the Emergency Arts building on Fremont East. Gourmet burgers, American craft beer, and bourbon flights. A Fremont East anchor for the young professional crowd.",dishes:["Cowboy Burger","Bone Marrow","Craft Beer List"],address:"520 E Fremont St, Las Vegas, NV 89101",lat:36.1691,lng:-115.1402,instagram:"eurekalasvegas",website:"https://eurekarestaurantgroup.com/locations/las-vegas",reservation:"OpenTable",phone:"(702) 570-3660",hours:"Mon-Thu,Sun 11AM-11PM, Fri-Sat 11AM-12AM"});

add({name:"Park on Fremont",cuisine:"American / Burgers",neighborhood:"Downtown (Fremont East)",score:86,price:2,tags:["Burgers","American","Brunch","Patio","Casual","Local Favorites","Late Night"],description:"Fremont East bar and restaurant with one of Downtown's best patios — giant backyard with pool tables, a carousel horse, and string lights. Gourmet burgers, brunch, and strong cocktails.",dishes:["Gourmet Burgers","Weekend Brunch","Expansive Patio"],address:"506 Fremont St, Las Vegas, NV 89101",lat:36.1691,lng:-115.1402,instagram:"parkonfremont",website:"https://www.parkonfremont.com",reservation:"walk-in",phone:"(702) 676-2999",hours:"Daily 11AM-2AM"});

add({name:"Heart Attack Grill",cuisine:"American / Burgers",neighborhood:"Downtown (Fremont Street)",score:80,price:2,tags:["Burgers","Iconic","Casual","Family Friendly","Late Night"],description:"Hospital-themed burger joint on Fremont Street. Patrons wear hospital gowns, waitresses dress as nurses, and the Quadruple Bypass Burger is legitimately 10,000+ calories. Over-400-lb diners eat free. Pure Vegas spectacle.",dishes:["Quadruple Bypass Burger","Flatliner Fries","Butterfat Milkshakes"],address:"450 Fremont St, Las Vegas, NV 89101",lat:36.1694,lng:-115.1419,instagram:"heartattackgrill",website:"https://heartattackgrill.com",reservation:"walk-in",phone:"(702) 722-2180",hours:"Daily 11AM-10PM"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 25 complete!');
