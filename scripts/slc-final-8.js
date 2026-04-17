// SLC: 8 more spots to reach 500
// Run: node scripts/slc-final-8.js
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

// 1. Este Pizza — celebrated SLC pizzeria
add({name:"Este Pizza",cuisine:"Pizza",neighborhood:"9th & 9th",score:83,price:1,tags:["Pizza","Casual","Local Favorites","Vegan Friendly"],description:"New York-style pizza with a twist in the 9th & 9th neighborhood — lauded for creative topping combinations, a vegan-friendly menu, and consistently excellent slices.",dishes:["NY-Style Slices","Specialty Pies","Vegan Options","Salads"],address:"2148 S 900 E, Salt Lake City, UT 84106",phone:"(801) 485-2695",lat:40.7199,lng:-111.8681,instagram:"@estepizza",website:"https://www.estepizza.com",reservation:"walk-in",res_tier:1});

// 2. Meditrina — celebrated SLC tapas and wine bar
add({name:"Meditrina",cuisine:"Mediterranean Tapas",neighborhood:"Downtown SLC",score:85,price:2,tags:["Mediterranean","Tapas","Wine Bar","Date Night","Local Favorites"],description:"Wine-forward Mediterranean tapas bar in downtown SLC — an intimate spot for rotating small plates, charcuterie, and an outstanding natural wine selection.",dishes:["Tapas","Charcuterie","Natural Wine","Cheese Plates"],address:"1394 S West Temple, Salt Lake City, UT 84115",phone:"(801) 485-2055",lat:40.7258,lng:-111.8958,instagram:"@meditrinaslc",website:"https://www.meditrina.net",reservation:"walk-in",res_tier:2});

// 3. Wild Grape Bistro — neighborhood bistro SLC
add({name:"Wild Grape Bistro",cuisine:"New American / Bistro",neighborhood:"The Avenues",score:84,price:2,tags:["New American","Brunch","Date Night","Local Favorites","Patio"],description:"Charming neighborhood bistro in The Avenues with a seasonal farm-to-table menu — excellent weekend brunch and intimate dinner in a relaxed setting.",dishes:["Weekend Brunch","Seasonal Plates","Craft Cocktails","Salads"],address:"481 E South Temple, Salt Lake City, UT 84111",phone:"(801) 746-5565",lat:40.7706,lng:-111.8799,instagram:"@wildgrapebistro",website:"https://www.wildgrapebistro.com",reservation:"OpenTable",res_tier:2});

// 4. Popol Vuh — acclaimed Guatemalan-Mexican SLC restaurant
add({name:"Popol Vuh",cuisine:"Mexican / Guatemalan",neighborhood:"Downtown SLC",score:85,price:2,tags:["Mexican","Date Night","Local Favorites","Cocktails"],description:"Celebrated downtown restaurant drawing from Guatemalan and Mexican culinary traditions — inventive moles, fresh masa dishes, and a vibrant mezcal cocktail program.",dishes:["Mole","Masa Dishes","Mezcal Cocktails","Ceviche"],address:"153 E 200 S, Salt Lake City, UT 84111",phone:"(801) 532-1999",lat:40.7621,lng:-111.8849,instagram:"@popolvuhslc",website:"https://www.popolvuhrestaurant.com",reservation:"Resy",res_tier:3});

// 5. Pig and a Jelly Jar — beloved SLC brunch spot
add({name:"Pig and a Jelly Jar",cuisine:"American / Brunch",neighborhood:"Downtown SLC",score:83,price:1,tags:["Brunch","Comfort Food","Local Favorites","Casual","Breakfast"],description:"Southern-inspired brunch spot in downtown SLC famous for its chicken and waffles, biscuits and gravy, and all-day breakfast in a cozy, casual setting.",dishes:["Chicken and Waffles","Biscuits and Gravy","Eggs Benedict","Bloody Mary"],address:"401 W 200 S, Salt Lake City, UT 84101",phone:"(801) 906-7467",lat:40.7622,lng:-111.8989,instagram:"@pigandjellyjarsalt",website:"https://www.pigandalellyjar.com",reservation:"walk-in",res_tier:1});

// 6. Alamexo — upscale Mexican downtown SLC
add({name:"Alamexo",cuisine:"Mexican / Upscale",neighborhood:"Downtown SLC",score:84,price:2,tags:["Mexican","Date Night","Local Favorites","Cocktails"],description:"Upscale Mexican kitchen in downtown SLC with chef-driven interpretations of regional Mexican cuisine — quality tequila and mezcal program alongside fresh, vibrant dishes.",dishes:["Tacos","Ceviche","Margaritas","Enchiladas"],address:"268 S State St, Salt Lake City, UT 84111",phone:"(801) 779-4747",lat:40.7611,lng:-111.8901,instagram:"@alamexoslc",website:"https://www.alamexo.com",reservation:"walk-in",res_tier:2});

// 7. Oasis Cafe — long-running SLC vegetarian/vegan cafe
add({name:"Oasis Cafe",cuisine:"American / Vegetarian",neighborhood:"The Avenues",score:81,price:2,tags:["Vegetarian Friendly","Brunch","Patio","Local Favorites"],description:"Long-running all-day cafe in The Avenues with a courtyard patio, vegetarian-forward menu, and welcoming atmosphere — a Salt Lake brunch institution since 1984.",dishes:["Weekend Brunch","Vegetarian Plates","Eggs Benedict","Patio Seating"],address:"151 S 500 E, Salt Lake City, UT 84102",phone:"(801) 322-0404",lat:40.7606,lng:-111.8778,instagram:"@oasiscafeslc",website:"https://www.oasiscafeslc.com",reservation:"walk-in",res_tier:1});

// 8. Zest Kitchen & Bar — acclaimed SLC plant-based restaurant
add({name:"Zest Kitchen & Bar",cuisine:"Plant-Based / Vegan",neighborhood:"Downtown SLC",score:83,price:2,tags:["Vegan","Vegetarian Friendly","Cocktails","Date Night","Local Favorites"],description:"Downtown SLC's flagship plant-based restaurant and bar — creative vegan and vegetarian cuisine with a full craft cocktail program in a stylish, welcoming space.",dishes:["Plant-Based Mains","Vegan Charcuterie","Craft Cocktails","Seasonal Plates"],address:"275 S 200 W, Salt Lake City, UT 84101",phone:"(801) 433-0589",lat:40.7612,lng:-111.8953,instagram:"@zestkitchenandbar",website:"https://www.zestslc.com",reservation:"walk-in",res_tier:2});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\nSLC total after additions:', arr.length);
console.log('Added', added, 'new spots');
console.log(arr.length >= 500 ? 'TARGET HIT! 500 reached.' : 'Need ' + (500 - arr.length) + ' more');
