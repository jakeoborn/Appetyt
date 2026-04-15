// Seattle Batch 22 — Queen Anne / Belltown / Pike Place / U District / Madison Valley / Capitol Hill fill
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

add({name:"The 5 Spot",cuisine:"American / Diner",neighborhood:"Queen Anne",score:85,price:2,tags:["American","Brunch","Casual","Family Friendly","Local Favorites","Iconic"],description:"Queen Anne neighborhood diner since 1989 with regional-American rotating menus that change every 2 months (think Brooklyn, Portland, New Orleans themes). Legendary Sunday brunch line. Sister to Coastal Kitchen (closed).",dishes:["Rotating Regional Menu","Sunday Brunch","Hash Plates"],address:"1502 Queen Anne Ave N, Seattle, WA 98109",lat:47.6383,lng:-122.3574,instagram:"5spotseattle",website:"https://5spotseattle.com",reservation:"walk-in",phone:"(206) 708-6678",hours:"Mon-Fri 8AM-8PM, Sat 7AM-8PM, Sun 7AM-4PM"});

add({name:"Macrina Bakery & Cafe",cuisine:"Bakery",neighborhood:"Belltown",score:90,price:1,tags:["Bakery/Coffee","Brunch","Iconic","Casual","Family Friendly","Local Favorites"],description:"Leslie Mackie's iconic Seattle bakery since 1993. Sourdough loaves, morning buns, Potato Bread. The Belltown cafe is the flagship — pastry counter and cozy seating.",dishes:["Morning Buns","Olivetta Loaf","Lemon-Blueberry Rolls"],address:"2408 1st Ave, Seattle, WA 98121",lat:47.6139,lng:-122.3469,instagram:"macrinabakery",website:"https://macrinabakery.com",reservation:"walk-in",phone:"(206) 448-4032",hours:"Daily 7AM-5PM",indicators:["women-owned"]});

add({name:"Piroshky Piroshky",cuisine:"Russian / Bakery",neighborhood:"Pike Place Market",score:90,price:1,tags:["Bakery/Coffee","Iconic","Tourist Essential","Casual","Quick Bite","Family Friendly"],description:"The line out the door at Pike Place — authentic hand-made Russian piroshky since 1992. Beef & onion, smoked salmon paté, apple cinnamon roll. A Seattle must-do.",dishes:["Beef & Onion Piroshky","Smoked Salmon Paté","Moscow Apple Roll"],address:"1908 Pike Pl, Seattle, WA 98101",lat:47.6095,lng:-122.3410,instagram:"piroshkybakery",website:"https://piroshkybakery.com",reservation:"walk-in",phone:"(206) 764-1000",hours:"Mon-Thu 8AM-6PM, Fri-Sun 8AM-7PM",awards:"Pike Place Institution since 1992"});

add({name:"Pho Than Brothers",cuisine:"Vietnamese",neighborhood:"University District",score:85,price:1,tags:["Vietnamese","Casual","Local Favorites","Iconic","Family Friendly"],description:"Seattle's long-running Vietnamese pho chain — complimentary cream puff before the pho arrives. Multiple locations across the city; U-Ave is a student favorite.",dishes:["Pho Dac Biet","Free Cream Puff","Rice Plates"],address:"4207 University Way NE, Seattle, WA 98105",lat:47.6616,lng:-122.3129,instagram:"",website:"https://thanbrothers.com",reservation:"walk-in",phone:"(206) 632-7272",hours:"Daily 10AM-9PM",indicators:["hole-in-wall"]});

add({name:"Cafe Flora",cuisine:"Vegetarian / Vegan",neighborhood:"Madison Valley",score:88,price:2,tags:["Vegetarian","Brunch","Date Night","Critics Pick","Local Favorites","Family Friendly","Patio"],description:"Seattle's iconic plant-based restaurant since 1991. Atrium dining room, seasonal vegetarian and vegan menus, weekend brunch. The Pacific Northwest's benchmark for destination vegetarian dining.",dishes:["Portobello Wellington","Vegan Pad Thai","Weekend Brunch"],address:"2901 E Madison St, Seattle, WA 98112",lat:47.6240,lng:-122.2952,instagram:"cafefloraveg",website:"https://florarestaurantgroup.com/restaurant/cafe-flora-seattle",reservation:"OpenTable",phone:"(206) 325-9100",hours:"Mon-Fri 9AM-9PM, Sat-Sun 8AM-2:30PM & 5PM-9PM",indicators:["vegetarian","women-owned"]});

add({name:"Tavolàta Capitol Hill",cuisine:"Italian",neighborhood:"Capitol Hill",score:89,price:3,tags:["Italian","Date Night","Critics Pick","Local Favorites","Celebrations"],description:"Ethan Stowell's second Tavolàta — Capitol Hill Pike-Pine corridor Italian pasta house. Hand-made rigatoni, gnocchi alla Romana, and a long communal table. Sister to Tavolata Belltown.",dishes:["Handmade Rigatoni","Gnocchi alla Romana","Communal Table"],address:"501 E Pike St, Seattle, WA 98122",lat:47.6140,lng:-122.3236,instagram:"tavolataseattle",website:"https://tavolata.com/restaurants/capitol-hill-ballard-avenue-seattle",reservation:"OpenTable",phone:"(206) 420-4920",hours:"Daily 5PM-10PM",group:"Ethan Stowell Restaurants"});

add({name:"Mr West Cafe Bar",cuisine:"Cafe / Wine Bar",neighborhood:"Downtown",score:86,price:2,tags:["Bakery/Coffee","Wine Bar","Brunch","Cocktails","Casual","Local Favorites"],description:"Downtown all-day cafe and wine bar near Paramount Theatre. Specialty coffee in the morning, sandwiches at lunch, wine and aperitivo by evening. Sister locations in U-Village and Bellevue.",dishes:["All-Day Cafe","Curated Wines","Aperitivo Hour"],address:"720 Olive Way Ste 103, Seattle, WA 98101",lat:47.6131,lng:-122.3321,instagram:"mrwestcafebar",website:"https://mrwestcafebar.com",reservation:"walk-in",phone:"(206) 900-9378",hours:"Mon-Fri 7AM-7PM, Sat-Sun 8AM-7PM"});

add({name:"Aviv Hummus Bar",cuisine:"Israeli / Middle Eastern",neighborhood:"Capitol Hill",score:88,price:2,tags:["Middle Eastern","Mediterranean","Casual","Local Favorites","Critics Pick","Vegetarian","Halal"],description:"Capitol Hill Israeli hummus bar since 2017 — fluffy pita, warm hummus bowls with mushroom/lamb/shakshuka toppings, and all-day falafel. A 15th Ave neighborhood essential.",dishes:["Hummus Bowl","Fresh-Baked Pita","Falafel Plate"],address:"107 15th Ave E, Seattle, WA 98112",lat:47.6188,lng:-122.3129,instagram:"avivhummusbar",website:"http://avivhummusbar.com",reservation:"walk-in",phone:"(206) 323-7483",hours:"Tue-Sun 11AM-3PM & 5PM-9PM, Closed Mon",indicators:["halal","vegetarian"]});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 22 complete!');
