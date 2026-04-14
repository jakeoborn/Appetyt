// Vegas Batch 6 — Chinatown / Spring Mountain corridor
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

add({name:"Aburiya Raku",cuisine:"Japanese / Robata Izakaya",neighborhood:"Chinatown",score:94,price:3,tags:["Japanese","Izakaya","Date Night","Late Night","Critics Pick","Iconic","Local Favorites"],description:"Chef Mitsuo Endo's Chinatown robata izakaya open until 1 AM — the iconic off-Strip Japanese destination for a decade+. Handmade tofu, charcoal-grilled skewers, and an extensive sake list. Phone reservations only — no online bookings.",dishes:["Handmade Tofu","Robata Skewers","Kobe Beef Toban"],address:"5030 Spring Mountain Rd Ste 2, Las Vegas, NV 89146",lat:36.1262,lng:-115.1966,instagram:"aburiyaraku",website:"https://www.raku-grill.com",reservation:"phone",phone:"(702) 367-3511",hours:"Mon-Sat 5PM-1AM, Closed Sun"});

add({name:"Sparrow + Wolf",cuisine:"New American",neighborhood:"Chinatown",score:93,price:3,tags:["New American","Date Night","Critics Pick","Local Favorites","Awards"],description:"Chef Brian Howard's Chinatown gem — 2026 James Beard Award Finalist for Best Chef: Southwest. Inventive globally-inspired cooking: Iberico jamon with cashew and mustard seed, golden tilefish pibil with charred lava beans. One of the best off-Strip restaurants in Vegas.",dishes:["Iberico Jamon","Golden Tilefish Pibil","Cacio e Pepe Dumplings"],address:"4480 Spring Mountain Rd Ste 100, Las Vegas, NV 89102",lat:36.1262,lng:-115.2045,instagram:"sparrowandwolflv",website:"https://sparrowandwolflv.com",reservation:"Resy",phone:"(702) 790-2147",awards:"James Beard Finalist 2026 - Best Chef: Southwest"});

add({name:"Shanghai Taste",cuisine:"Chinese / Shanghainese",neighborhood:"Chinatown",score:92,price:2,tags:["Chinese","Casual","Local Favorites","Critics Pick","Iconic"],description:"Undisputed local legend for soup dumplings. Tiny, no-reservations spot serving 3,000+ xiao long bao per day, plus sheng jian bao filled with steaming savory broth. Open kitchen shows the skill of the pasta chefs pleating dumplings in real time.",dishes:["Xiao Long Bao","Sheng Jian Bao","Shanghainese Dumplings"],address:"4266 W Spring Mountain Rd Ste 104A, Las Vegas, NV 89102",lat:36.1262,lng:-115.2010,instagram:"shanghaitastelv",website:"",reservation:"walk-in",phone:"(702) 570-6363",hours:"Daily 11AM-9PM"});

add({name:"Monta Japanese Noodle House",cuisine:"Japanese / Ramen",neighborhood:"Chinatown",score:91,price:2,tags:["Japanese","Ramen","Casual","Local Favorites","Late Night","Critics Pick"],description:"The original Chinatown ramen shop that started the Vegas ramen boom. Signature tonkotsu, bubbly gyoza, and simple classic Japanese noodle-house cooking since 2010. Lines wrap around the plaza daily.",dishes:["Tonkotsu Ramen","Gyoza","Char Siu Bowl"],address:"5030 Spring Mountain Rd Ste 6, Las Vegas, NV 89146",lat:36.1262,lng:-115.1966,instagram:"montaramenlv",website:"https://www.montaramen.com",reservation:"walk-in",phone:"(702) 367-4600",hours:"Daily 11:30AM-11PM, Fri-Sat till 1AM"});

add({name:"Kabuto Edomae Sushi",cuisine:"Japanese / Omakase",neighborhood:"Chinatown",score:94,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Critics Pick","Awards","Tasting Menu"],description:"Intimate 11-seat Edomae sushi counter in the Chinatown corridor — traditional Tokyo-style nigiri with aged fish and hand-pressed shari. Omakase only. Alongside Yui and Kame, one of the top three omakase experiences in Vegas.",dishes:["Edomae Omakase","Aged Fish","Seasonal Nigiri"],address:"5040 W Spring Mountain Rd Ste 4, Las Vegas, NV 89146",lat:36.1262,lng:-115.1967,instagram:"kabutolv",website:"https://www.kabutolv.com",reservation:"Resy",phone:"(702) 676-1044",hours:"Daily 5:30PM-9PM"});

add({name:"Ramen Sora",cuisine:"Japanese / Ramen",neighborhood:"Chinatown",score:89,price:2,tags:["Japanese","Ramen","Casual","Local Favorites"],description:"Sapporo-style Chinatown ramen specialist serving thick, hearty miso ramen and the Vegas-favorite Sora Special. Gyoza widely considered among the best in town. Bright, minimalist counter-style dining.",dishes:["Miso Ramen","Sora Special","Gyoza"],address:"4490 Spring Mountain Rd Ste 700, Las Vegas, NV 89102",lat:36.1262,lng:-115.2040,instagram:"ramensoralv.official",website:"https://www.ramensoralasvegas.com",reservation:"walk-in",phone:"(702) 685-1011"});

add({name:"Kung Fu Thai & Chinese",cuisine:"Thai / Chinese",neighborhood:"Chinatown",score:87,price:2,tags:["Thai","Chinese","Casual","Iconic","Local Favorites"],description:"The oldest Thai and Chinese restaurant in Las Vegas — family-owned since 1973. Anchors the Kung Fu Plaza at Valley View and Spring Mountain. Reliable Chinese-American staples and Thai classics spanning two full menus.",dishes:["Pad See Ew","Kung Pao Chicken","Pad Thai"],address:"3505 S Valley View Blvd, Las Vegas, NV 89103",lat:36.1275,lng:-115.1905,instagram:"kungfuplaza",website:"https://www.kungfuplaza.com",reservation:"walk-in",phone:"(702) 247-4120",hours:"Daily 11:30AM-9:30PM"});

add({name:"888 Korean BBQ",cuisine:"Korean / BBQ",neighborhood:"Chinatown",score:89,price:3,tags:["Korean","BBQ","Date Night","Local Favorites","Casual"],description:"Chinatown Korean BBQ specialist in the heart of Spring Mountain. Premium cuts — USDA Prime galbi, hanwoo, and long bone short ribs — cooked tableside over live charcoal. One of the top Korean BBQ rooms off-Strip.",dishes:["Galbi","Hanwoo","Bossam"],address:"4215 Spring Mountain Rd Ste B107, Las Vegas, NV 89102",lat:36.1262,lng:-115.2015,instagram:"888koreanbbqlv",website:"",reservation:"walk-in",phone:"(702) 463-9993"});

add({name:"Gangnam Asian BBQ Dining",cuisine:"Korean / Japanese BBQ",neighborhood:"Paradise",score:88,price:3,tags:["Korean","BBQ","Late Night","Local Favorites","Casual"],description:"Paradise Road premium AYCE Korean-Japanese BBQ — one of the buzziest late-night BBQ rooms in Vegas. Premium wagyu beef, pork belly, and seafood all-you-can-eat with tableside grilling until 2 AM.",dishes:["Premium AYCE","Wagyu","Pork Belly"],address:"4480 Paradise Rd Ste 600, Las Vegas, NV 89169",lat:36.1075,lng:-115.1524,instagram:"gangnambbqlv",website:"https://gan8nam.com",reservation:"walk-in",phone:"(702) 802-5508"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 6 complete!');
