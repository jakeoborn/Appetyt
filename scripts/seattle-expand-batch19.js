// Seattle Batch 19 — Capitol Hill / Belltown / Pike Place / Eastlake / West Seattle / Phinney fill
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

add({name:"Etta's Seafood",cuisine:"Seafood",neighborhood:"Pike Place Market",score:87,price:3,tags:["Seafood","Iconic","Brunch","Cocktails","Date Night","Local Favorites"],description:"Tom Douglas's Pike Place seafood staple — rub-with-love salmon, sustainable PNW seafood, and a legendary weekend brunch. A 1990s Seattle classic still going strong.",dishes:["Rub-with-Love Salmon","Weekend Brunch","Pacific Northwest Seafood"],address:"2020 Western Ave, Seattle, WA 98121",lat:47.6112,lng:-122.3437,instagram:"ettasseafood",website:"https://www.tomdouglas.com/location/ettas",reservation:"OpenTable",phone:"(206) 443-6000",hours:"Mon 3PM-8PM, Thu 3PM-9PM, Fri-Sat 12PM-9PM, Sun 12PM-8PM",group:"Tom Douglas Restaurants"});

add({name:"Bar Melusine",cuisine:"French / Seafood",neighborhood:"Capitol Hill",score:90,price:4,tags:["French","Seafood","Date Night","Critics Pick","Oysters","Celebrations","Wine Bar"],description:"Renee Erickson's Normandy/Brittany coastal French seafood room on Capitol Hill. Raw bar towers, plateau de fruits de mer, champagne focus, and maritime-inspired elegance.",dishes:["Plateau de Fruits de Mer","Raw Bar","Champagne List"],address:"1060 E Union St, Seattle, WA 98122",lat:47.6143,lng:-122.3188,instagram:"barmelusine",website:"https://www.barmelusine.com",reservation:"OpenTable",phone:"(206) 900-8808",hours:"Tue-Sat 5PM-10PM, Closed Sun-Mon",group:"Sea Creatures",indicators:["women-owned"]});

add({name:"Purple Cafe & Wine Bar",cuisine:"New American / Wine Bar",neighborhood:"Downtown",score:87,price:3,tags:["New American","Wine Bar","Date Night","Brunch","Local Favorites","Cocktails","Awards"],description:"Downtown wine-focused bistro with a 27-foot wine tower in the center of the dining room. 500+ bottle list, approachable PNW menu, and a bustling happy hour scene.",dishes:["27-Foot Wine Tower","500+ Bottle List","Weekend Brunch"],address:"1225 4th Ave, Seattle, WA 98101",lat:47.6075,lng:-122.3364,instagram:"purplecafeseattle",website:"https://www.purplecafe.com",reservation:"OpenTable",phone:"(206) 829-2280",hours:"Mon 11AM-9PM, Tue-Fri 11AM-10PM, Sat 11:30AM-10PM, Sun 11:30AM-9PM",awards:"Wine Spectator Best of Award of Excellence"});

add({name:"Saint Bread",cuisine:"Bakery",neighborhood:"University District",score:90,price:1,tags:["Bakery/Coffee","Brunch","Scenic","Critics Pick","Local Favorites","Casual","Patio"],description:"Portage Bay waterfront bakery by Kate Lewis and Kailee Bell — former boatyard converted into a community gathering space. Sourdough, morning buns, thoughtful sandwiches, and a covered dock patio.",dishes:["Sourdough Loaves","Morning Buns","Dock Patio"],address:"1421 NE Boat St, Seattle, WA 98105",lat:47.6505,lng:-122.3130,instagram:"saintbread",website:"https://www.saintbread.com",reservation:"walk-in",phone:"(206) 566-5195",hours:"Tue-Sat 7:30AM-6PM, Closed Sun-Mon",indicators:["women-owned"]});

add({name:"The Barking Dog Alehouse",cuisine:"Gastropub",neighborhood:"Phinney Ridge",score:85,price:2,tags:["Gastropub","Brewery","Casual","Family Friendly","Local Favorites","Brunch","Patio"],description:"Dog-friendly Phinney Ridge neighborhood pub with 20+ Pacific Northwest micro-crafts on tap. Tavern burger, Sunday brunch, kids' menu, and patio. A true neighborhood anchor.",dishes:["Tavern Burger","20+ Craft Beers","Sunday Brunch"],address:"705 NW 70th St, Seattle, WA 98117",lat:47.6797,lng:-122.3693,instagram:"barkingdogphinney",website:"https://thebarkingdogalehouse.com",reservation:"walk-in",phone:"(206) 782-2974",hours:"Daily 11AM-11PM"});

add({name:"Via Tribunali",cuisine:"Italian / Pizza",neighborhood:"Capitol Hill",score:87,price:2,tags:["Italian","Pizza","Date Night","Local Favorites","Casual","Late Night","Family Friendly"],description:"Authentic Neapolitan pizzeria since 2004 — AVPN-certified (Italian Pizza Association #226). Wood-fired in 90 seconds at 900°F. Multiple Seattle locations; Capitol Hill is the flagship.",dishes:["Margherita D.O.P.","Wood-Fired Neapolitan","AVPN Certified"],address:"913 E Pike St, Seattle, WA 98122",lat:47.6143,lng:-122.3181,instagram:"viatribunali",website:"https://www.viatribunali.com",reservation:"walk-in",phone:"(206) 322-9234",hours:"Sun-Thu 4PM-11PM, Fri-Sat 4PM-12AM",awards:"AVPN Certified Neapolitan Pizza"});

add({name:"Little Water Cantina",cuisine:"Mexican",neighborhood:"Eastlake",score:87,price:2,tags:["Mexican","Patio","Scenic","Date Night","Local Favorites","Critics Pick","Family Friendly"],description:"Waterfront Eastlake Mexican — enchiladas, tableside guac, and a huge patio on Lake Union. Scratch-made kitchen since 2011. A reliable neighborhood favorite.",dishes:["Tableside Guacamole","Lake Union Patio","Scratch Enchiladas"],address:"2865 Eastlake Ave E, Seattle, WA 98102",lat:47.6448,lng:-122.3240,instagram:"littlewatercantina",website:"https://littlewatercantina.com",reservation:"OpenTable",phone:"(206) 466-6171",hours:"Daily 11AM-10PM"});

add({name:"Jemil's Big Easy",cuisine:"Cajun / Creole",neighborhood:"West Seattle",score:88,price:2,tags:["Cajun","Creole","Southern","Casual","Local Favorites","Critics Pick"],description:"Award-winning Cajun-Creole pop-up turned brick-and-mortar in West Seattle. Gumbo, red beans and rice, muffuletta. Jemil Johnson's New Orleans-rooted scratch cooking.",dishes:["Gumbo","Red Beans & Rice","Muffuletta"],address:"5406 Delridge Way SW, Seattle, WA 98106",lat:47.5489,lng:-122.3599,instagram:"jemilsbigeasy",website:"https://www.jemilsbigeasy.food",reservation:"walk-in",phone:"(206) 518-8197",hours:"Thu-Sun 12PM-8PM, Closed Mon-Wed",indicators:["black-owned"]});

add({name:"Great State Burger",cuisine:"American / Burgers",neighborhood:"South Lake Union",score:85,price:1,tags:["Burgers","Casual","Quick Bite","Local Favorites","Family Friendly"],description:"Chef Brian O'Connor and Josh Henderson's Washington-proud smash-burger spot. Four Seattle locations; SLU on 7th Ave is the hub. Shake-style patty, house fries, local ingredients.",dishes:["Great Burger","Beer-Battered Fries","Chocolate Shakes"],address:"2041 7th Ave, Seattle, WA 98121",lat:47.6180,lng:-122.3397,instagram:"greatstateburger",website:"https://www.greatstateburger.com",reservation:"walk-in",phone:"(206) 775-7880",hours:"Daily 11AM-9PM"});

add({name:"Black Bottle",cuisine:"Gastropub / Small Plates",neighborhood:"Belltown",score:85,price:2,tags:["Gastropub","Cocktails","Casual","Date Night","Local Favorites","Late Night"],description:"Belltown gastrotavern since 2005 — shareable small plates, creative cocktails, and a lively 21+ bar. A dinner-to-late-night Belltown mainstay.",dishes:["Pan-Crisp Pork Belly","Creative Cocktails","Sharable Plates"],address:"2600 1st Ave, Seattle, WA 98121",lat:47.6144,lng:-122.3484,instagram:"blackbottleseattle",website:"https://www.blackbottleseattle.com",reservation:"Resy",phone:"(206) 441-1500",hours:"Mon-Thu 4PM-10PM, Fri-Sat 4PM-11PM, Closed Sun"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 19 complete!');
