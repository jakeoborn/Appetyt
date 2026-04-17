// SLC: Final 13 spots to reach 500
// Run: node scripts/slc-final-13.js
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

// 1. Bruges Waffles & Frites — verified SLC institution, multiple locations
add({name:"Bruges Waffles & Frites",cuisine:"Belgian",neighborhood:"Downtown SLC",score:85,price:1,tags:["Belgian","Casual","Local Favorites","Breakfast"],description:"Belgian Liege waffles and double-fried frites with house-made dipping sauces — a downtown SLC institution since 2009 with a loyal following.",dishes:["Liege Waffle","Belgian Frites","Dipping Sauces"],address:"336 W Broadway, Salt Lake City, UT 84101",phone:"(801) 363-4444",lat:40.7586,lng:-111.8970,instagram:"@brugesslc",website:"https://www.brugeswaffles.com",reservation:"walk-in",res_tier:1});

// 2. Caputo's Market & Deli — iconic SLC Italian deli/cheese shop
add({name:"Caputo's Market & Deli",cuisine:"Italian Deli / Specialty Market",neighborhood:"Downtown SLC",score:84,price:1,tags:["Deli","Local Favorites","Sandwiches","Specialty Market"],description:"SLC's beloved Italian deli and specialty food market since 1997 — world-class cheese counter, cured meats, and made-to-order sandwiches.",dishes:["Italian Sandwich","Cheese Selection","Charcuterie","Olive Oil"],address:"314 W 300 S, Salt Lake City, UT 84101",phone:"(801) 531-8669",lat:40.7562,lng:-111.8975,instagram:"@caputosmarket",website:"https://www.caputos.com",reservation:"walk-in",res_tier:1});

// 3. Even Stevens Sandwiches — popular SLC sandwich chain
add({name:"Even Stevens Sandwiches",cuisine:"Sandwiches",neighborhood:"Sugarhouse",score:80,price:1,tags:["Sandwiches","Casual","Local Favorites","Lunch"],description:"Creative sandwich shop with a buy-one-give-one charitable model — for every sandwich sold, one is donated to a local nonprofit partner.",dishes:["Signature Sandwiches","Soups","Chips"],address:"1570 S 1500 E, Salt Lake City, UT 84105",phone:"(801) 485-0320",lat:40.7239,lng:-111.8503,instagram:"@evenstevensslc",website:"https://www.evenstevens.com",reservation:"walk-in",res_tier:1});

// 4. Vessel Kitchen — upscale fast-casual SLC staple
add({name:"Vessel Kitchen",cuisine:"New American / Fast Casual",neighborhood:"Downtown SLC",score:82,price:1,tags:["Healthy","Fast Casual","Bowls","Lunch"],description:"Upscale fast-casual bowls, grain dishes, and salads built from locally sourced and seasonal ingredients — a reliable downtown lunch destination.",dishes:["Grain Bowls","Seasonal Salads","Protein Plates"],address:"155 S 200 W, Salt Lake City, UT 84101",phone:"(801) 656-5110",lat:40.7632,lng:-111.8953,instagram:"@vesselkitchen",website:"https://www.vesselkitchen.com",reservation:"walk-in",res_tier:1});

// 5. Cubby's — SLC comfort food staple
add({name:"Cubby's",cuisine:"American / Burgers",neighborhood:"Sugarhouse",score:80,price:1,tags:["Burgers","Comfort Food","Casual","Local Favorites"],description:"Sugarhouse comfort food institution known for smash burgers, loaded fries, and milkshakes — a neighborhood go-to with a devoted local following.",dishes:["Smash Burger","Loaded Fries","Milkshake"],address:"2153 S Highland Dr, Salt Lake City, UT 84106",phone:"(801) 467-7632",lat:40.7193,lng:-111.8583,instagram:"@cubbysslc",website:"https://www.cubbyslc.com",reservation:"walk-in",res_tier:1});

// 6. Dirty Bird — fried chicken and cocktails SLC
add({name:"Dirty Bird",cuisine:"Fried Chicken / Cocktails",neighborhood:"Downtown SLC",score:81,price:1,tags:["Fried Chicken","Casual","Cocktails","Late Night"],description:"Late-night fried chicken and cocktail bar downtown — creative sandwiches, tenders, and craft cocktails in a buzzy, no-reservations setting.",dishes:["Fried Chicken Sandwich","Chicken Tenders","Cocktails"],address:"39 W 300 S, Salt Lake City, UT 84101",phone:"(801) 532-6800",lat:40.7580,lng:-111.8918,instagram:"@dirtybirdslc",website:"https://www.dirtybirdslc.com",reservation:"walk-in",res_tier:1});

// 7. Blue Copper Coffee Room — beloved SLC specialty coffee
add({name:"Blue Copper Coffee Room",cuisine:"Coffee",neighborhood:"Downtown SLC",score:83,price:1,tags:["Coffee","Bakery/Coffee","Local Favorites","Breakfast"],description:"Specialty coffee roaster and cafe in a warm, industrial-chic space downtown — one of SLC's most beloved third-wave coffee destinations.",dishes:["Espresso","Pour Over","Pastries","Cold Brew"],address:"268 S State St, Salt Lake City, UT 84111",phone:"(801) 532-6969",lat:40.7611,lng:-111.8901,instagram:"@bluecoppercoffee",website:"https://www.bluecopper.com",reservation:"walk-in",res_tier:1});

// 8. Publik Coffee Roasters — award-winning SLC roaster
add({name:"Publik Coffee Roasters",cuisine:"Coffee",neighborhood:"Central 9th",score:84,price:1,tags:["Coffee","Local Favorites","Breakfast","Bakery/Coffee"],description:"Award-winning specialty roaster and cafe in SLC's Central 9th neighborhood — carefully sourced single-origins and a warm neighborhood hangout.",dishes:["Espresso","Filter Coffee","Pastries","Tea"],address:"975 S West Temple, Salt Lake City, UT 84101",phone:"(801) 355-3161",lat:40.7488,lng:-111.8962,instagram:"@publikcoffee",website:"https://www.publikcoffeeroasters.com",reservation:"walk-in",res_tier:1});

// 9. Three Pines Coffee — downtown specialty coffee
add({name:"Three Pines Coffee",cuisine:"Coffee",neighborhood:"Downtown SLC",score:82,price:1,tags:["Coffee","Bakery/Coffee","Local Favorites","Breakfast"],description:"Specialty coffee bar in downtown SLC featuring rotating single-origin espresso and filter options in a sleek, minimalist space.",dishes:["Espresso","Pour Over","Matcha","Pastries"],address:"55 W 200 S, Salt Lake City, UT 84101",phone:"",lat:40.7618,lng:-111.8938,instagram:"@threepinescoffee",website:"https://www.threepinescoffee.com",reservation:"walk-in",res_tier:1});

// 10. Fillings & Emulsions — acclaimed SLC pastry studio
add({name:"Fillings & Emulsions",cuisine:"Bakery / Pastry",neighborhood:"Sugarhouse",score:86,price:1,tags:["Bakery","Pastry","Local Favorites","Breakfast"],description:"Pastry studio and bakery from a James Beard semifinalist pastry chef — extraordinary croissants, entremets, and inventive seasonal pastries.",dishes:["Croissant","Entremet","Seasonal Pastries","Tarts"],address:"1475 S 900 E, Salt Lake City, UT 84105",phone:"(801) 487-8553",lat:40.7257,lng:-111.8681,instagram:"@fillingsandemulsions",website:"https://www.fillingsandemulsions.com",reservation:"walk-in",res_tier:1});

// 11. Eva's Bakery — downtown SLC French bakery
add({name:"Eva's Bakery",cuisine:"French Bakery / Cafe",neighborhood:"Downtown SLC",score:85,price:1,tags:["Bakery","Brunch","Breakfast","Local Favorites"],description:"Charming French-style bakery on Main Street — buttery croissants, quiches, and soups in a cozy cafe setting that pulls a devoted downtown crowd.",dishes:["Croissant","Quiche","Soups","Tartines"],address:"155 S Main St, Salt Lake City, UT 84111",phone:"(801) 355-3942",lat:40.7643,lng:-111.8907,instagram:"@evasbakeryslc",website:"https://www.evasbakeryslc.com",reservation:"walk-in",res_tier:1});

// 12. Les Madeleines — beloved SLC patisserie
add({name:"Les Madeleines",cuisine:"French Patisserie",neighborhood:"Downtown SLC",score:85,price:1,tags:["Bakery","Pastry","French","Local Favorites","Breakfast"],description:"French patisserie famous for its kouign-amann — a caramelized, buttery Breton pastry that earned national recognition and a devoted SLC following.",dishes:["Kouign-Amann","Macarons","Tarts","Cafe au Lait"],address:"216 E 500 S, Salt Lake City, UT 84111",phone:"(801) 355-2294",lat:40.7583,lng:-111.8836,instagram:"@lesmadeleinesslc",website:"https://www.lesmadeleines.com",reservation:"walk-in",res_tier:1});

// 13. Dolcetti Gelato — premier SLC gelato spot
add({name:"Dolcetti Gelato",cuisine:"Gelato / Ice Cream",neighborhood:"Sugarhouse",score:84,price:1,tags:["Dessert","Ice Cream","Local Favorites","Casual"],description:"Artisan gelato shop in Sugarhouse making small-batch Italian-style gelato and sorbetto from scratch daily — SLC's most beloved frozen dessert destination.",dishes:["Gelato","Sorbetto","Affogato","Seasonal Flavors"],address:"1616 S 900 E, Salt Lake City, UT 84105",phone:"(801) 485-3254",lat:40.7240,lng:-111.8681,instagram:"@dolcettigelato",website:"https://www.dolcettigelato.com",reservation:"walk-in",res_tier:1});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\nSLC total after additions:', arr.length);
console.log('Added', added, 'new spots');
