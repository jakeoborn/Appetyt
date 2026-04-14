// Seattle Batch 9 — Burgers, BBQ, Ethiopian, Indian, Italian, Late Night
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

add({name:"Li'l Woody's",cuisine:"Burgers",neighborhood:"Capitol Hill",score:87,price:1,tags:["Burgers","Casual","Local Favorites","Late Night"],description:"Capitol Hill burger institution on Pine Street. Fresh-ground beef burgers with creative weekly specials, hand-cut fries, and thick milkshakes. Seattle's beloved neighborhood burger stand.",dishes:["Cheeseburger","Milkshakes","Hand-Cut Fries"],address:"1211 Pine St, Seattle, WA 98101",lat:47.6146,lng:-122.3228,instagram:"lilwoodys",website:"https://www.lilwoodys.com",reservation:"walk-in",phone:"(206) 457-4148",hours:"Sun-Wed 11AM-9PM, Thu-Sat 11AM-11PM"});

add({name:"Ezell's Famous Chicken",cuisine:"Southern / Fried Chicken",neighborhood:"Central District",score:88,price:1,tags:["Southern","Fried Chicken","Local Favorites","Iconic","Casual"],description:"Central District fried chicken institution on 23rd Ave — Oprah Winfrey's famously favorite fried chicken. Family-owned since 1984 with crispy skin, juicy meat, and signature spice blend that made it nationally famous.",dishes:["Fried Chicken","Catfish","Sweet Potato Pie"],address:"501 23rd Ave, Seattle, WA 98122",lat:47.6063,lng:-122.3030,instagram:"ezellschicken",website:"https://ezellschicken.com",reservation:"walk-in",phone:"(206) 324-4141"});

add({name:"Katsu Burger",cuisine:"Japanese / Burgers",neighborhood:"Georgetown",score:86,price:1,tags:["Japanese","Burgers","Casual","Local Favorites"],description:"Georgetown fusion burger shop since 2011. Hand-formed, miso-seasoned Japanese breaded patties that are American-sized and fried to perfection. Black sesame milkshakes and nori-dusted fries.",dishes:["Katsu Burger","Black Sesame Shake","Nori Fries"],address:"6538 4th Ave S, Seattle, WA 98108",lat:47.5409,lng:-122.3244,instagram:"katsuburger",website:"https://www.katsuburger.com",reservation:"walk-in",phone:"(206) 762-0752",hours:"Daily 10:30AM-9PM"});

add({name:"Jack's BBQ",cuisine:"Texas BBQ",neighborhood:"SoDo",score:88,price:2,tags:["BBQ","Casual","Local Favorites","Critics Pick"],description:"Traditional Central Texas BBQ in SoDo/Georgetown since 2014. Low-and-slow dry rub brisket, ribs, and smoked meats with sauce on the side. Jack's dream to bring authentic Texas BBQ to Seattle.",dishes:["Brisket","Pork Ribs","Sausage"],address:"3924 Airport Way S, Seattle, WA 98108",lat:47.5739,lng:-122.3199,instagram:"jacksbbqseattle",website:"https://jacksbbq.com",reservation:"OpenTable",phone:"(206) 467-4038"});

add({name:"Cafe Selam",cuisine:"Ethiopian",neighborhood:"Central District",score:88,price:1,tags:["Ethiopian","Local Favorites","Critics Pick","Casual"],description:"Central District Ethiopian restaurant beloved for over 20 years. Family-run spot serving great injera, flavorful stews, and authentic Ethiopian coffee ceremony. Cherished community hub.",dishes:["Doro Wat","Beef Tibs","Vegetarian Combo"],address:"2715 E Cherry St Ste B, Seattle, WA 98122",lat:47.6079,lng:-122.2981,instagram:"cafeselam",website:"https://www.cafeselam.com",reservation:"walk-in",phone:"(206) 328-0404",hours:"Daily 10AM-9PM"});

add({name:"Annapurna Cafe",cuisine:"Indian / Nepalese / Tibetan",neighborhood:"Capitol Hill",score:87,price:2,tags:["Indian","Date Night","Local Favorites","Casual"],description:"Capitol Hill Himalayan restaurant in a distinctive basement space on Broadway. Authentic Indian, Tibetan, and Nepali cuisine including momos, thali, and curries. Yeti Bar upstairs for cocktails.",dishes:["Momos","Thali","Nepali Curries"],address:"1833 Broadway, Seattle, WA 98122",lat:47.6175,lng:-122.3213,instagram:"annapurnacafeseattle",website:"https://annapurnacafe.com",reservation:"OpenTable",phone:"(206) 320-7770"});

add({name:"Salumi",cuisine:"Italian / Deli",neighborhood:"Pioneer Square",score:90,price:2,tags:["Italian","Iconic","Local Favorites","Critics Pick","Casual"],description:"Pioneer Square artisan cured-meat shop and deli for over 20 years. Old-world techniques with modern thinking — famous porchetta sandwich, cured salumi, and Italian comfort. Founded by Armandino Batali.",dishes:["Porchetta Sandwich","Cured Salumi","Meatball Sub"],address:"404 Occidental Ave S, Seattle, WA 98104",lat:47.5996,lng:-122.3325,instagram:"salumideli",website:"https://salumideli.com",reservation:"walk-in",phone:"(206) 621-8772",hours:"Mon-Fri 10AM-6PM, Sat-Sun 10AM-3PM"});

add({name:"Staple & Fancy",cuisine:"Italian",neighborhood:"Ballard",score:91,price:3,tags:["Italian","Date Night","Critics Pick","Local Favorites"],description:"Ethan Stowell's Ballard Avenue flagship since 2010. Chef's Tasting Menu changes daily — four courses family-style with small plates, pasta, applewood-grilled entrees, and dessert. Historic Kolstrand Building.",dishes:["Chef's Tasting Menu","Handmade Pasta","Applewood-Grilled"],address:"4739 Ballard Ave NW, Seattle, WA 98107",lat:47.6662,lng:-122.3845,instagram:"ethanstowellrestaurants",website:"https://ethanstowellrestaurants.com/restaurants/staple-and-fancy-ballard-seattle",reservation:"OpenTable",phone:"(206) 789-1200",group:"Ethan Stowell Restaurants"});

add({name:"Tavolata",cuisine:"Italian / Pasta",neighborhood:"Belltown",score:89,price:3,tags:["Italian","Date Night","Local Favorites","Iconic"],description:"Ethan Stowell's second restaurant in Belltown since 2007. Fresh pasta made daily around a 30-foot communal table. Simple Italian cuisine in an urban setting — house-made pasta is the focal point.",dishes:["House-Made Pasta","Burrata","Italian Classics"],address:"2323 2nd Ave, Seattle, WA 98121",lat:47.6139,lng:-122.3439,instagram:"ethanstowellrestaurants",website:"https://tavolata.com/restaurants/belltown-second-avenue-seattle",reservation:"OpenTable",phone:"(206) 838-8008",group:"Ethan Stowell Restaurants"});

add({name:"Rocco's",cuisine:"Pizza / Bar",neighborhood:"Belltown",score:86,price:2,tags:["Pizza","Late Night","Casual","Local Favorites","Cocktails"],description:"Belltown pizzeria and craft bar open daily until 2AM. By-the-slice and whole pies, extensive whiskey and craft cocktail menu. One of Seattle's go-to late-night spots.",dishes:["Pizza by the Slice","Specialty Pies","Craft Cocktails"],address:"2312 2nd Ave, Seattle, WA 98121",lat:47.6139,lng:-122.3444,instagram:"roccos_seattle",website:"https://www.roccosseattle.com",reservation:"walk-in",phone:"(206) 397-4210",hours:"Daily 11AM-2AM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 9 complete!');
