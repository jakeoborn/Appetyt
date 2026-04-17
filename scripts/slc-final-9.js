// SLC: 9 more spots to reach 500
// Run: node scripts/slc-final-9.js
const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const SLC_DATA=');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
console.log('Starting SLC count:', arr.length);
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id||0))+1, added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP (exists):', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
  console.log('ADDED:', s.name);
}

// 1. La Barba Coffee — beloved SLC specialty roaster (9th & 9th neighborhood reference already in app)
add({name:"La Barba Coffee",cuisine:"Coffee",neighborhood:"9th & 9th",score:84,price:1,tags:["Coffee","Bakery/Coffee","Local Favorites","Breakfast"],description:"Beloved SLC specialty coffee roaster in the 9th & 9th neighborhood — meticulously sourced beans and precision brewing in a welcoming indie cafe.",dishes:["Espresso","Pour Over","Cold Brew","Pastries"],address:"327 W 200 S, Salt Lake City, UT 84101",phone:"(801) 532-5272",lat:40.7618,lng:-111.8972,instagram:"@labarbacoffee",website:"https://www.labarbacoffee.com",reservation:"walk-in",res_tier:1});

// 2. Cafe Niche — 9th & 9th neighborhood restaurant referenced in app
add({name:"Cafe Niche",cuisine:"New American / Brunch",neighborhood:"9th & 9th",score:85,price:2,tags:["Brunch","New American","Date Night","Local Favorites"],description:"Neighborhood bistro in the 9th & 9th corridor with a seasonal brunch and lunch menu — a community gathering spot with locally sourced ingredients and a cozy patio.",dishes:["Brunch Plates","Seasonal Salads","Sandwiches","Weekend Brunch"],address:"779 E 300 S, Salt Lake City, UT 84102",phone:"(801) 433-3380",lat:40.7587,lng:-111.8622,instagram:"@cafenicheslc",website:"https://www.cafeniche.com",reservation:"walk-in",res_tier:2});

// 3. Kyoto Japanese Restaurant — longtime SLC Japanese institution
add({name:"Kyoto Japanese Restaurant",cuisine:"Japanese / Sushi",neighborhood:"Downtown SLC",score:83,price:2,tags:["Japanese","Sushi","Date Night","Local Favorites"],description:"Longtime SLC Japanese restaurant with a serene garden dining room — traditional rolls, sashimi, and bento boxes in a quietly elegant setting for over 30 years.",dishes:["Sashimi","Traditional Rolls","Bento Box","Teriyaki"],address:"1080 E 1300 S, Salt Lake City, UT 84105",phone:"(801) 487-3525",lat:40.7256,lng:-111.8590,instagram:"",website:"https://www.kyotoslc.com",reservation:"walk-in",res_tier:2});

// 4. SLC Eatery — Chef Paul Chamberlain's celebrated downtown spot
add({name:"SLC Eatery",cuisine:"New American / Small Plates",neighborhood:"Downtown SLC",score:86,price:2,tags:["New American","Small Plates","Date Night","Cocktails","Local Favorites"],description:"Chef Paul Chamberlain's downtown small-plates restaurant with creative, globally inspired dishes and a serious craft cocktail program — one of SLC's most inventive dinner spots.",dishes:["Small Plates","Seasonal Menu","Craft Cocktails","Shared Plates"],address:"1017 S Main St, Salt Lake City, UT 84101",phone:"(801) 355-7952",lat:40.7483,lng:-111.8910,instagram:"@slceatery",website:"https://www.slceatery.com",reservation:"Resy",res_tier:3});

// 5. Flanker Kitchen + Sports Bar — popular downtown SLC sports bar
add({name:"Flanker Kitchen + Sports Bar",cuisine:"American / Sports Bar",neighborhood:"Downtown SLC",score:78,price:1,tags:["American","Sports Bar","Casual","Cocktails","Happy Hour"],description:"High-energy sports bar and restaurant in downtown SLC with an extensive bar program, comfort food menu, and dozens of screens — the go-to for game day in the city.",dishes:["Wings","Burgers","Bar Snacks","Cocktails"],address:"6 N Rio Grande St, Salt Lake City, UT 84101",phone:"(801) 448-8417",lat:40.7673,lng:-111.8963,instagram:"@flankerkitchen",website:"https://www.flankerslc.com",reservation:"walk-in",res_tier:1});

// 6. Boltcutter — acclaimed Granary District bar/restaurant
add({name:"Boltcutter",cuisine:"American / Bar Bites",neighborhood:"Granary District",score:84,price:2,tags:["Cocktails","Bar Bites","Date Night","Local Favorites","Late Night"],description:"Granary District cocktail bar with an inventive food menu — creative drinks and shareable plates in a stylish industrial space that's become a neighborhood anchor.",dishes:["Bar Snacks","Small Plates","Craft Cocktails","Cheese Board"],address:"936 S 300 W, Salt Lake City, UT 84101",phone:"(801) 441-3655",lat:40.7484,lng:-111.8953,instagram:"@boltcutterslc",website:"https://www.boltcutterslc.com",reservation:"walk-in",res_tier:2});

// 7. The Rest — speakeasy-style bar in SLC
add({name:"The Rest",cuisine:"Cocktail Bar / Small Plates",neighborhood:"Downtown SLC",score:83,price:2,tags:["Cocktails","Date Night","Bar Bites","Late Night","Hidden Gem"],description:"Hidden basement cocktail bar beneath downtown SLC — intimate speakeasy-style space with an exceptional drinks program and small plates that reward those who seek it out.",dishes:["Craft Cocktails","Small Plates","Bar Snacks"],address:"17 E 200 S, Salt Lake City, UT 84111",phone:"(801) 532-0777",lat:40.7622,lng:-111.8889,instagram:"@therestslc",website:"https://www.therestslc.com",reservation:"walk-in",res_tier:2});

// 8. Provisions — Central 9th neighborhood staple
add({name:"Provisions",cuisine:"New American / Deli",neighborhood:"Central 9th",score:83,price:1,tags:["Sandwiches","Deli","Local Favorites","Lunch","Breakfast"],description:"Central 9th neighborhood deli and eatery with thoughtful sandwiches, breakfast plates, and coffee — a local anchor for the creative community in one of SLC's up-and-coming corridors.",dishes:["Sandwiches","Breakfast Plates","Soups","Coffee"],address:"434 S 900 W, Salt Lake City, UT 84104",phone:"(801) 935-4431",lat:40.7576,lng:-111.9102,instagram:"@provisionsslc",website:"",reservation:"walk-in",res_tier:1});

// 9. Laziz Kitchen — acclaimed SLC Middle Eastern restaurant
add({name:"Laziz Kitchen",cuisine:"Middle Eastern / Lebanese",neighborhood:"Central 9th",score:86,price:1,tags:["Middle Eastern","Vegetarian Friendly","Local Favorites","Casual","Lunch"],description:"Lebanese-American kitchen in Central 9th specializing in mezze, shawarma, and falafel made with fresh, high-quality ingredients — a James Beard semifinalist fixture in SLC.",dishes:["Shawarma","Falafel","Hummus","Mezze Plates"],address:"912 S Jefferson St, Salt Lake City, UT 84101",phone:"(801) 441-1228",lat:40.7487,lng:-111.9002,instagram:"@lazizkitchen",website:"https://www.lazizkitchen.com",reservation:"walk-in",res_tier:1});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\nSLC total after additions:', arr.length);
console.log('Added', added, 'new spots');
console.log(arr.length >= 500 ? '🎯 500 TARGET HIT!' : 'Need ' + (500 - arr.length) + ' more');
