// Seattle Batch 18 — U District + Central District + Pioneer Square + West Seattle + Kirkland fill-ins. Verified April 2026.
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const SEATTLE_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Seattle:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

add({name:"Agua Verde Cafe",cuisine:"Mexican",neighborhood:"University District",score:86,price:2,tags:["Mexican","Casual","Local Favorites","Scenic","Patio","Family Friendly"],description:"Lakeside Mexican cafe on Portage Bay with kayak rentals next door. Fish tacos, margaritas, and waterfront patio. A U-Dub weekend ritual since 1993.",dishes:["Fish Tacos","Margaritas","Waterfront Patio"],address:"1303 NE Boat St, Seattle, WA 98105",lat:47.6516,lng:-122.3144,instagram:"aguaverdecafe",website:"https://www.aguaverdecafe.com",reservation:"walk-in",phone:"(206) 545-8570",hours:"Daily 11AM-8PM"});

add({name:"Pam's Caribbean Kitchen",cuisine:"Trinidadian / Caribbean",neighborhood:"Wallingford",score:88,price:2,tags:["Caribbean","African","Casual","Local Favorites","Critics Pick","Family Friendly"],description:"Chef Pam Jacob's homestyle Trinidadian cooking since 2006. Roti wraps, jerk chicken, doubles, curry goat — a Seattle Caribbean anchor. Relocated to Wallingford after U District building was demolished.",dishes:["Doubles","Curry Goat Roti","Jerk Chicken"],address:"1715 N 45th St, Seattle, WA 98103",lat:47.6611,lng:-122.3356,instagram:"pamskitchenseattle",website:"https://pams-kitchen.com",reservation:"walk-in",phone:"(206) 696-7010",hours:"Wed 5PM-9PM, Thu 4PM-10PM, Fri 12PM-10PM, Sat 4PM-11PM, Sun 4PM-10PM, Closed Mon-Tue",indicators:["women-owned","black-owned"]});

add({name:"Damn the Weather",cuisine:"New American",neighborhood:"Pioneer Square",score:87,price:2,tags:["New American","Cocktails","Brunch","Late Night","Local Favorites","Critics Pick"],description:"Pioneer Square cocktail bar and New American kitchen. Excellent burger, seasonal small plates, serious cocktails. One of the neighborhood's most consistent late-night dinner stops.",dishes:["Damn Burger","Serious Cocktails","Seasonal Small Plates"],address:"116 1st Ave S, Seattle, WA 98104",lat:47.6012,lng:-122.3351,instagram:"damntheweather",website:"https://www.damntheweather.com",reservation:"OpenTable",phone:"(206) 946-1283",hours:"Mon-Thu 11AM-10PM, Fri-Sat 11AM-11PM, Sun 11AM-4PM"});

add({name:"Volterra Kirkland",cuisine:"Italian / Tuscan",neighborhood:"Kirkland",score:87,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick","Celebrations"],description:"Chef Don Curtiss's Tuscan-inspired Kirkland fine dining. Handmade pasta, wild boar tenderloin, and a thoughtful Italian wine list in downtown Kirkland. A longtime Eastside destination.",dishes:["Wild Boar Tenderloin","Handmade Pasta","Italian Wine List"],address:"121 Kirkland Ave, Kirkland, WA 98033",lat:47.6770,lng:-122.2095,instagram:"volterrakirkland",website:"https://volterrakirkland.com",reservation:"OpenTable",phone:"(425) 202-7201",hours:"Tue-Sat 5PM-9PM, Closed Sun-Mon",suburb:true});

add({name:"Fat's Chicken and Waffles",cuisine:"Southern",neighborhood:"Central District",score:88,price:2,tags:["Southern","Fried Chicken","Brunch","Casual","Local Favorites","Critics Pick","Family Friendly"],description:"Central District Southern soul-food spot. Fried chicken and waffles, catfish, hush puppies, and a warm block-pride vibe. Part of the CD's historic Black food legacy.",dishes:["Fried Chicken & Waffles","Catfish","Shrimp & Grits"],address:"2726 E Cherry St, Seattle, WA 98122",lat:47.6081,lng:-122.2965,instagram:"fatschickenandwaffles",website:"https://www.fatschickenandwaffles.com",reservation:"OpenTable",phone:"(206) 602-6863",hours:"Tue-Thu 11AM-9PM, Fri 11AM-10PM, Sat 9AM-3PM & 5PM-10PM, Sun 9AM-3PM & 5PM-9PM, Closed Mon",indicators:["black-owned"]});

add({name:"Smith",cuisine:"Gastropub / New American",neighborhood:"Capitol Hill",score:86,price:2,tags:["Gastropub","New American","Casual","Cocktails","Local Favorites","Brunch","Late Night"],description:"Capitol Hill 15th Ave gastropub with taxidermy-filled wood-paneled room. Smith Burger, sustainable pub food, and strong cocktails. A neighborhood mainstay with weekend brunch.",dishes:["Smith Burger","Sunday Roast","Brunch Bloody Marys"],address:"332 15th Ave E, Seattle, WA 98112",lat:47.6220,lng:-122.3123,instagram:"smithseattle",website:"https://smithseattle.com",reservation:"OpenTable",phone:"(206) 709-1900",hours:"Mon-Fri 4PM-10PM, Sat-Sun 10AM-2PM & 4PM-10PM"});

add({name:"Tat's Delicatessen",cuisine:"Deli / Sandwiches",neighborhood:"Pioneer Square",score:88,price:1,tags:["Sandwiches","Iconic","Casual","Local Favorites","Critics Pick"],description:"Pioneer Square East-Coast-style deli since 2004. Legit Philly cheesesteaks, hot subs, and the signature Tat'strami. Brined and smoked in-house. Seattle's East-Coast sandwich flag-bearer.",dishes:["Philly Cheesesteak","Tat'strami","House-Smoked Meats"],address:"159 Yesler Way, Seattle, WA 98104",lat:47.6020,lng:-122.3322,instagram:"tatsdeli",website:"https://www.tatsdeli.com",reservation:"walk-in",phone:"(206) 264-8287",hours:"Mon-Sat 10AM-4PM, Closed Sun"});

add({name:"Pegasus Pizza",cuisine:"Pizza",neighborhood:"West Seattle",score:85,price:2,tags:["Pizza","Casual","Local Favorites","Family Friendly","Patio","Iconic"],description:"West Seattle Junction pizza institution — family-run since 1985. Hand-tossed pizzas, pasta, and West Seattle neighborhood vibe. Moved from Alki to California Ave after 2016 remodel.",dishes:["Hand-Tossed Pizza","Meatball Sandwich","Family-Style Pasta"],address:"4520 California Ave SW, Seattle, WA 98116",lat:47.5620,lng:-122.3866,instagram:"pegasuspizzawestseattle",website:"https://pegasuspizza.com",reservation:"walk-in",phone:"(206) 932-4849",hours:"Mon-Thu,Sun 11AM-10PM, Fri-Sat 11AM-11PM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 18 complete!');
