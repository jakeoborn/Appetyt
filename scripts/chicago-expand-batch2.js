// Chicago Expansion Batch 2 — ~15 verified restaurants
// Sources: Resy 2025 "Restaurants That Defined Chicago", Infatuation, Timeout, Yelp, web search verified
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const chiMarker = "'Chicago':";
const chiIdx = html.indexOf(chiMarker, html.indexOf('CITY_DATA'));
const arrS = html.indexOf('[', chiIdx);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP (exists):', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// 1. Dimmi Dimmi — Resy "Defined Chicago Dining 2025", Italian-American, Lincoln Park
// Verified: address, phone, website, hours from Yelp + dimmidimmiitalian.com
add({name:"Dimmi Dimmi",cuisine:"Italian American",neighborhood:"Lincoln Park",score:88,price:2,tags:["Italian","Pizza","Casual","Date Night","Family"],description:"Family-style Italian-American in Lincoln Park that Resy named one of the 10 restaurants that defined Chicago dining in 2025. Chef Matt Eckfeld serves tavern-style pizzas with contemporary twists in a 78-seat space. Took over the Tarantino space on Armitage and Seminary.",dishes:["Tavern-Style Pizza","Chicken Parm","Meatballs"],address:"1112 W Armitage Ave, Chicago, IL 60614",hours:"Tue-Thu 4PM-9PM, Fri-Sat 4PM-10PM, Sun 4PM-9PM, Lunch Thu-Sun 11AM-3PM",lat:41.9178,lng:-87.6563,instagram:"dimmidimmichi",website:"https://www.dimmidimmiitalian.com",reservation:"Resy",phone:"(773) 697-9829"});

// 2. Boonie's Filipino Restaurant — Resy "Defined Chicago 2025", Michelin Guide
// Verified: address, phone, website from Yelp + booniefoods.com
add({name:"Boonie's Filipino Restaurant",cuisine:"Filipino",neighborhood:"North Center",score:89,price:2,tags:["Filipino","Date Night","Critics Pick","Local Favorites"],description:"Modern Filipino restaurant in North Center that Resy named one of the 10 that defined Chicago dining in 2025. Chef Joseph Fontelera serves Filipino food in a charming brick-and-mortar space. Listed in the Michelin Guide. Reserve on Resy.",dishes:["Adobo","Lumpia","Filipino Tasting Menu"],address:"4337 N Western Ave, Chicago, IL 60618",hours:"",lat:41.9590,lng:-87.6887,instagram:"booniesfilipino",website:"https://www.booniefoods.com",reservation:"Resy",phone:"(708) 990-8886"});

// 3. YooYee — Resy "Defined Chicago 2025", Sichuan, Uptown
// Verified: address, phone, website from Yelp + yooyeechicago.com
add({name:"YooYee",cuisine:"Sichuan Chinese",neighborhood:"Uptown",score:88,price:1,tags:["Chinese","Sichuan","Local Favorites","Casual"],description:"Sichuan restaurant in Uptown that Resy named one of the 10 that defined Chicago dining in 2025. No reservations, walk-in only -- the bold Sichuan flavors and affordable prices make the wait worthwhile. Delivery and takeout also available.",dishes:["Mapo Tofu","Dan Dan Noodles","Kung Pao Chicken"],address:"4925 N Broadway, Chicago, IL 60640",hours:"",lat:41.9723,lng:-87.6591,instagram:"yooyeechicago",website:"https://www.yooyeechicago.com",reservation:"walk-in",phone:"(773) 754-0455"});

// 4. Beity — Resy "Defined Chicago 2025", Lebanese, West Loop
// Verified: address, phone, website from Yelp + beitychicago.com, Michelin Guide listed
add({name:"Beity",cuisine:"Lebanese",neighborhood:"West Loop",score:89,price:2,tags:["Lebanese","Middle Eastern","Date Night","Critics Pick"],description:"Lebanese restaurant in West Loop Fulton Market that Resy named one of the 10 that defined Chicago dining in 2025. Chef Ryan Fakih serves tasting and family-style menus with handmade ceramics. Listed in the Michelin Guide.",dishes:["Lebanese Tasting Menu","Mezze Spread","Handmade Flatbread"],address:"813 W Fulton St, Chicago, IL 60607",hours:"Tue-Thu, Sun 5PM-9:30PM, Fri-Sat 5PM-10PM",lat:41.8867,lng:-87.6474,instagram:"beitychicago",website:"https://www.beitychicago.com",reservation:"OpenTable",phone:"(773) 892-5549"});

// 5. void — Resy "Defined Chicago 2025", Italian-American, Avondale
// Verified: address, Instagram from Block Club Chicago + Resy blog
add({name:"void",cuisine:"Italian American",neighborhood:"Avondale",score:87,price:2,tags:["Italian","Casual","Local Favorites","Date Night"],description:"Italian-American spot in Avondale that Resy named one of the 10 that defined Chicago dining in 2025. Friends Pat Ray, Tyler Hudec, and Dani Kaplan serve pasta, meatballs, and focaccia all made in-house with locally sourced meats. No reservations, walk-ins only.",dishes:["Housemade Pasta","Meatballs","Focaccia"],address:"2937 N Milwaukee Ave, Chicago, IL 60618",hours:"Tue-Sat 5PM-10PM, Sun 5PM-9PM, Sun Brunch 10AM-2PM",lat:41.9340,lng:-87.7089,instagram:"void_chicago",website:"",reservation:"walk-in",phone:""});

// 6. Elia — Resy "Defined Chicago 2025", Turkish/Mediterranean, Wicker Park
// Verified: address, phone, website from Yelp + eliachicago.com
add({name:"Elia",cuisine:"Turkish / Mediterranean",neighborhood:"Wicker Park",score:88,price:2,tags:["Mediterranean","Turkish","Date Night","Cocktails"],description:"Modern Turkish and Mediterranean restaurant in Wicker Park that Resy named one of the 10 that defined Chicago dining in 2025. Chef Ozzy Yavuz serves authentic kebabs, flavorful mezes, fresh pita bread, and signature cocktails.",dishes:["Turkish Kebabs","Mezze Platter","Fresh Pita"],address:"1938 W Division St, Chicago, IL 60622",hours:"",lat:41.9032,lng:-87.6778,instagram:"eliachicago",website:"https://www.eliachicago.com",reservation:"OpenTable",phone:"(773) 770-3658"});

// 7. Sanders BBQ Supply Co. — Resy "Defined Chicago 2025", Beverly
// Verified: address, phone, website from Yelp + sandersbbqsupply.com
add({name:"Sanders BBQ Supply Co.",cuisine:"BBQ",neighborhood:"Beverly",score:88,price:1,tags:["BBQ","Local Favorites","Casual","Black-Owned"],description:"BBQ spot in Beverly that Resy named one of the 10 that defined Chicago dining in 2025. James Sanders and pitmaster Nick Kleutsch serve smoked meats to adoring fans. Counter-order, no reservations. A planned Hyde Park steakhouse spinoff is coming.",dishes:["Smoked Brisket","Pulled Pork","Ribs"],address:"1742 W 99th St, Chicago, IL 60643",hours:"Wed-Sun 11AM-9PM",lat:41.7137,lng:-87.6696,instagram:"sandersbbqsupplyco",website:"https://www.sandersbbqsupply.com",reservation:"walk-in",phone:"(773) 366-3241"});

// 8. Monster Ramen — Resy "Defined Chicago 2025", Logan Square
// Verified: address, phone, website from Infatuation review page
add({name:"Monster Ramen",cuisine:"Japanese Ramen",neighborhood:"Logan Square",score:88,price:1,tags:["Japanese","Ramen","Local Favorites","Casual"],description:"Ramen spot in Logan Square that Resy named one of the 10 that defined Chicago dining in 2025. Chef Katie Dong specializes in gyukotsu (beef bone) ramen with in-house noodles. The Monster bowl features beef jam, tender wagyu, and mushrooms with garlic miso tare.",dishes:["The Monster Ramen","Gyukotsu Shio","Gyoza"],address:"3435 W Fullerton Ave, Chicago, IL 60647",hours:"",lat:41.9249,lng:-87.7172,instagram:"monsterramenchicago",website:"https://www.monsterramenchicago.com",reservation:"walk-in",phone:"(312) 809-9978"});

// 9. Cafe Yaya — Resy "Defined Chicago 2025", Middle Eastern cafe + wine bar
// Verified: address, website, Instagram from Yelp + cafeyaya.com + Resy
add({name:"Cafe Yaya",cuisine:"Middle Eastern Cafe",neighborhood:"Lincoln Park",score:88,price:2,tags:["Middle Eastern","Bakery/Coffee","Brunch","Wine Bar","Date Night"],description:"All-day Middle Eastern cafe and wine bar in Lincoln Park that Resy named one of the 10 that defined Chicago dining in 2025. From Galit chef Zachary Engel. House-made pastries and coffee by day, Mediterranean and French-influenced menu with wines and cocktails by night.",dishes:["Za'atar Pastry","Shakshuka","Wine Selection"],address:"2431 N Lincoln Ave, Chicago, IL 60614",hours:"Tue-Thu 7:30AM-9PM, Fri 7:30AM-10PM, Sat 8AM-10PM, Sun 8AM-9PM",lat:41.9263,lng:-87.6496,instagram:"cafeyaya_chi",website:"https://www.cafeyaya.com",reservation:"Resy",phone:"",group:"Galit"});

// 10. Kumiko — James Beard Outstanding Bar 2025, West Loop
// Verified: address, phone, website from Yelp + barkumiko.com
add({name:"Kumiko",cuisine:"Japanese Bar / Dining",neighborhood:"West Loop",score:91,price:3,tags:["Cocktails","Japanese","Date Night","Critics Pick"],description:"Japanese dining bar in West Loop that won the 2025 James Beard Award for Outstanding Bar. Julia Momose serves elevated seasonal tasting menus with thoughtful drink pairings showcasing Japanese sake, shaken cocktails, and spirit-free options. Food and drink treated with equal importance.",dishes:["Seasonal Cocktail Tasting","Sake Selection","Japanese Small Plates"],address:"630 W Lake St, Chicago, IL 60661",hours:"",lat:41.8857,lng:-87.6440,instagram:"barkumiko",website:"https://www.barkumiko.com",reservation:"Resy",phone:"(312) 285-2912",awards:"James Beard Outstanding Bar 2025"});

// 11. Gus' Sip & Dip — Bon Appetit Best New Bars 2025, River North
// Verified: address, phone, website from Yelp + gussipanddip.com
add({name:"Gus' Sip & Dip",cuisine:"Cocktail Bar / Tavern",neighborhood:"River North",score:87,price:2,tags:["Cocktails","Casual","Local Favorites","Late Night"],description:"Classic tavern in River North named one of Bon Appetit Best New Bars in America in 2025. From Lettuce Entertain You. Kevin Beary cocktail program offers high-quality drinks at approachable prices paired with Chef Bob Broskey timeless tavern dishes. Walk-ins, first-come first-served.",dishes:["Craft Cocktails","Tavern Burger","Bar Snacks"],address:"51 W Hubbard St, Chicago, IL 60654",hours:"",lat:41.8897,lng:-87.6305,instagram:"gus_sipanddip",website:"https://www.gussipanddip.com",reservation:"walk-in",phone:"(312) 736-0163",group:"Lettuce Entertain You"});

// 12. Three Dots and a Dash — iconic tiki bar, River North
// Verified: address, phone, website from Yelp + threedotschicago.com
add({name:"Three Dots and a Dash",cuisine:"Tiki Bar",neighborhood:"River North",score:88,price:2,tags:["Cocktails","Date Night","Speakeasy","Iconic"],description:"Hidden tiki bar down a narrow River North alleyway with tropical cocktails mixed using fresh seasonal juices and housemade syrups. The moody island atmosphere and strong drinks have made this one of the most popular bars in Chicago. Entrance is a challenge to find -- look for the alley.",dishes:["Tiki Cocktails","Rum Punch","Tropical Small Plates"],address:"435 N Clark St, Chicago, IL 60654",hours:"",lat:41.8901,lng:-87.6312,instagram:"threedotschicago",website:"https://www.threedotschicago.com",reservation:"OpenTable",phone:"(312) 610-4220"});

// 13. Smyth — Three Michelin stars (upgraded 2025), West Loop
// Verified: address, phone, website from Michelin Guide + smythandtheloyalist.com
add({name:"Smyth",cuisine:"New American",neighborhood:"West Loop",score:97,price:4,tags:["Fine Dining","Critics Pick","Exclusive","Celebrations"],description:"Three-Michelin-star restaurant in West Loop from chefs John Shields and Karen Urie Shields. Upgraded to three stars in 2025. Tasting menu showcasing seasonal Midwestern ingredients with extraordinary technique. Located above The Loyalist, which serves the famous cheeseburger downstairs.",dishes:["Seasonal Tasting Menu","Midwestern Ingredients","Multi-Course Experience"],address:"177 N Ada St, Chicago, IL 60607",hours:"",lat:41.8847,lng:-87.6614,instagram:"smythchicago",website:"https://www.smythandtheloyalist.com",reservation:"Tock",phone:"(773) 913-3773",awards:"Three Michelin Stars"});

// 14. The Loyalist — basement burger spot below Smyth
// Verified: same address as Smyth, from smythandtheloyalist.com
add({name:"The Loyalist",cuisine:"American / Burger Bar",neighborhood:"West Loop",score:88,price:2,tags:["Burgers","Casual","Late Night","Local Favorites"],description:"Basement bar and burger spot below three-Michelin-star Smyth in the West Loop. Famous for the Loyalist Burger -- a double-patty smash burger that is regularly cited as one of the best burgers in Chicago. Dark, fun atmosphere with great cocktails.",dishes:["The Loyalist Burger","Cocktails","Bar Snacks"],address:"177 N Ada St, Chicago, IL 60607",hours:"",lat:41.8847,lng:-87.6614,instagram:"theloyalistchicago",website:"https://www.smythandtheloyalist.com",reservation:"Resy",phone:"(773) 913-3774",group:"Smyth"});

// 15. Xi'an Cuisine — Chinatown hand-pulled noodles
// Verified via web search, multiple sources
add({name:"Xi'an Cuisine",cuisine:"Chinese / Northwestern",neighborhood:"Chinatown",score:87,price:1,tags:["Chinese","Noodles","Local Favorites","Casual"],description:"Hand-pulled noodle shop in Chinatown specializing in Northwestern Chinese cuisine. The biang biang noodles are thick, chewy, and tossed in chili oil. The cumin lamb is fragrant and the lamb burger is juicy and spiced. One of the best noodle experiences in Chicago.",dishes:["Biang Biang Noodles","Cumin Lamb","Lamb Burger"],address:"225 W 26th St, Chicago, IL 60616",hours:"",lat:41.8442,lng:-87.6339,instagram:"",website:"",reservation:"walk-in",phone:"(312) 326-3171"});

console.log('Added', added, 'new spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Chicago batch 2 complete!');
