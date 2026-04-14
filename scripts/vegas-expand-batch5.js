// Vegas Batch 5 — Downtown, Arts District, Fremont East
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

add({name:"Esther's Kitchen",cuisine:"Italian",neighborhood:"Arts District",score:92,price:3,tags:["Italian","Date Night","Local Favorites","Critics Pick","Iconic"],description:"James Harris' Arts District Italian that anchored the neighborhood revival. Seasonal hand-cut pastas, eight varieties of sourdough bread, and a beloved Sunday sugo. Widely considered the best off-Strip Italian in Vegas.",dishes:["Handmade Pasta","Sourdough Breads","Sunday Sugo"],address:"1131 S Main St, Las Vegas, NV 89104",lat:36.1594,lng:-115.1525,instagram:"estherskitchenlv",website:"https://www.estherslv.com",reservation:"OpenTable",phone:"(702) 570-7864",hours:"Mon-Fri 11AM-3PM, 5PM-11PM; Sat-Sun 10AM-3PM, 5PM-11PM"});

add({name:"Main St. Provisions",cuisine:"New American / Steak & Seafood",neighborhood:"Arts District",score:90,price:3,tags:["New American","Date Night","Critics Pick","Local Favorites"],description:"Refined steak and seafood in the heart of the Arts District from chef Kim Owens. Hospitality-driven with an emphasis on wood-fired mains, an excellent raw bar, and one of the Arts District's best happy hours.",dishes:["Wood-Fired Steak","Seasonal Seafood","Raw Bar"],address:"1214 S Main St, Las Vegas, NV 89104",lat:36.1580,lng:-115.1520,instagram:"mainstprov",website:"https://www.mainstprovisions.com",reservation:"OpenTable",phone:"(702) 457-0111",hours:"Mon-Fri 4:30PM-10PM, Sat 4PM-10PM"});

add({name:"Carson Kitchen",cuisine:"New American",neighborhood:"Downtown",score:89,price:3,tags:["New American","Date Night","Brunch","Local Favorites","Iconic"],description:"Late chef Kerry Simon's downtown neighborhood gastropub in the historic John E. Carson Hotel. Bacon jam, devil eggs, and one of the pioneering restaurants of Downtown Vegas' revitalization. Rooftop bar upstairs.",dishes:["Bacon Jam","Devil Eggs","Glazed Donut Bread Pudding"],address:"124 S 6th St Ste 100, Las Vegas, NV 89101",lat:36.1679,lng:-115.1407,instagram:"carsonkitchen",website:"https://www.carsonkitchen.com",reservation:"OpenTable",phone:"(702) 473-9523"});

add({name:"7th & Carson",cuisine:"New American",neighborhood:"Downtown",score:87,price:2,tags:["New American","Brunch","Casual","Local Favorites"],description:"Downtown kitchen & bar at 7th and Carson since 2017. Shareable plates, thoughtful cocktails, and a gorgeous garden patio that's one of the best downtown al fresco brunch rooms in Vegas.",dishes:["Shareable Plates","Patio Brunch","Cocktails"],address:"616 E Carson Ave Ste 110, Las Vegas, NV 89101",lat:36.1661,lng:-115.1428,instagram:"7thandcarson",website:"https://www.7thandcarson.com",reservation:"walk-in",phone:"(702) 868-3355",hours:"Mon-Sat 9AM-8PM, Sun 9AM-5PM"});

add({name:"Able Baker Brewing",cuisine:"Brewpub / American",neighborhood:"Arts District",score:87,price:2,tags:["Brewery","Casual","Local Favorites","Brunch"],description:"Arts District brewpub with 30+ house and guest taps, wine, and craft cocktails. Pub fare elevated — pork banh mi, crispy fish tacos, and Mexican-style hot dogs. Heart of the Arts District brewing corridor.",dishes:["House IPAs","Pork Banh Mi","Mexican Hot Dogs"],address:"1510 S Main St Ste 120, Las Vegas, NV 89104",lat:36.1555,lng:-115.1528,instagram:"ablebaker.brewing",website:"https://www.ablebakerbrewing.com",reservation:"walk-in",phone:"(702) 479-6355",hours:"Mon-Thu 11:30AM-11PM, Fri-Sat 11:30AM-1AM, Sun 11:30AM-11PM"});

add({name:"Good Pie",cuisine:"Pizza",neighborhood:"Arts District",score:88,price:2,tags:["Pizza","Casual","Local Favorites","Critics Pick"],description:"Award-winning Brooklyn-style pizzeria and bar in the Arts District. Authentic Grandma pies, Brooklyn, Detroit, and Sicilian styles. Casual walk-up window plus a full dining room for cocktails and sangria.",dishes:["Grandma Pie","Detroit Square","Sicilian Slice"],address:"1212 S Main St, Las Vegas, NV 89104",lat:36.1580,lng:-115.1522,instagram:"goodpielv",website:"https://www.goodpie.com",reservation:"walk-in",phone:"(702) 844-2700",hours:"Mon-Thu 11AM-10PM, Fri-Sat 11AM-11PM, Sun 11AM-10PM"});

add({name:"Pizza Rock",cuisine:"Pizza",neighborhood:"Downtown",score:88,price:2,tags:["Pizza","Casual","Late Night","Iconic","Local Favorites"],description:"13-time World Pizza Champion Tony Gemignani's downtown flagship at Downtown Grand. Multiple authentic pizza styles — Napoletana, New York, Romana, Sicilian, Detroit, Grandma, and California — cooked in purpose-built ovens for each style.",dishes:["Margherita DOC","New York Slice","Romana"],address:"201 N 3rd St, Las Vegas, NV 89101",lat:36.1707,lng:-115.1422,instagram:"pizzarocklv",website:"https://pizzarocklasvegas.com",reservation:"walk-in",phone:"(702) 385-0838",group:"Tony Gemignani"});

add({name:"Le Thai",cuisine:"Thai",neighborhood:"Downtown (Fremont East)",score:89,price:2,tags:["Thai","Casual","Local Favorites","Critics Pick"],description:"Fremont East's beloved family-owned Thai restaurant. Famous three-color curry, crispy fried rice, and the legendary 'short rib fried rice.' One of the anchors of the Fremont East district since 2010.",dishes:["Short Rib Fried Rice","Three-Color Curry","Khao Soi"],address:"523 Fremont St, Las Vegas, NV 89101",lat:36.1695,lng:-115.1411,instagram:"lethaivegas",website:"https://lethaivegas.com",reservation:"walk-in",phone:"(702) 778-0888",hours:"Mon-Thu 11AM-10PM, Fri-Sat 11AM-11PM, Sun 4PM-10PM"});

add({name:"Velveteen Rabbit",cuisine:"Cocktail Bar",neighborhood:"Arts District",score:90,price:2,tags:["Cocktails","Date Night","Late Night","Local Favorites","Critics Pick"],description:"Sister-owned craft cocktail bar in the Arts District on Main Street — one of the pioneering bars of the neighborhood revival. Eclectic, ever-changing creative cocktail menu. Low-lit, theatrical, and always packed.",dishes:["Craft Cocktails","Local Beer","Sorbet Cocktails"],address:"1218 S Main St, Las Vegas, NV 89104",lat:36.1580,lng:-115.1522,instagram:"velveteenrabbitlv",website:"https://velveteenrabbitlv.com",reservation:"walk-in",phone:"(702) 685-9645",hours:"Mon-Thu 5PM-12AM, Fri-Sat 5PM-2AM, Sun 5PM-12AM"});

add({name:"The Golden Tiki",cuisine:"Tiki Bar",neighborhood:"Chinatown",score:87,price:2,tags:["Cocktails","Late Night","Iconic","Local Favorites"],description:"24/7 tiki bar institution on Spring Mountain Road in Chinatown. Animatronic shrunken heads, fishing nets, rum drinks served in coconuts, and one of the most beloved after-hours spots in Vegas. Never closes.",dishes:["Tiki Cocktails","Rum Drinks","Coconut Cocktails"],address:"3939 Spring Mountain Rd, Las Vegas, NV 89102",lat:36.1262,lng:-115.1929,instagram:"thegoldentiki",website:"https://www.thegoldentiki.com",reservation:"walk-in",phone:"(702) 222-3196",hours:"Open 24/7"});

console.log('Added', added, 'new Vegas spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Vegas batch 5 complete!');
