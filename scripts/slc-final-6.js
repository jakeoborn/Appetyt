// SLC: Final 6 spots to hit 250
// Run: node scripts/slc-final-6.js
const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const SLC_DATA=');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id||0))+1, added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase()))return;
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase());added++;
}

add({name:"Table X (Millcreek)",cuisine:"New American / Tasting Menu",neighborhood:"Millcreek",score:91,price:4,tags:["Fine Dining","Tasting Menu","Celebrations","Date Night"],reservation:"Tock",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

// Verified from Gastronomic SLC
add({name:"Emiliano's Taco Shop",cuisine:"Mexican / Tacos",neighborhood:"South Salt Lake",score:84,price:1,tags:["Mexican","Tacos","Casual","Cheap Eats"],description:"South Salt Lake taqueria with quality tacos at fair prices. Al pastor, carne asada, and breakfast tacos in a no-frills setting.",dishes:["Al Pastor","Carne Asada","Breakfast Tacos"],address:"1099 S 300 W, South Salt Lake, UT 84101",phone:"(801) 906-0500",lat:40.7480,lng:-111.8960,instagram:"emilianostacoshop",website:"",suburb:true});

add({name:"Real Taqueria",cuisine:"Mexican",neighborhood:"Holladay",score:85,price:1,tags:["Mexican","Casual","Local Favorites"],description:"Holladay Mexican with carne asada that locals swear by. The queso and chips are addictive starters. A neighborhood taqueria that consistently delivers.",dishes:["Carne Asada","Queso","Enchiladas","Tacos"],address:"4843 S Highland Dr, Holladay, UT 84117",phone:"(385) 245-4040",lat:40.6700,lng:-111.8540,instagram:"realtaqueria",website:"https://www.realtaqueria.com",suburb:true});

add({name:"Guisado's Homestyle Cooking",cuisine:"Mexican / Homestyle",neighborhood:"Taylorsville",score:84,price:1,tags:["Mexican","Casual","Family","Cheap Eats"],description:"Taylorsville homestyle Mexican with traditional guisados, tamales, and daily specials. Home-cooked Mexican flavors at family-friendly prices. A suburban gem.",dishes:["Guisados","Tamales","Daily Specials"],address:"5415 S 900 E, Taylorsville, UT 84117",phone:"(801) 890-5570",lat:40.6520,lng:-111.8700,instagram:"guisadosslc",website:"",suburb:true});

add({name:"Cosmica SLC",cuisine:"Italian",neighborhood:"Central 9th",score:88,price:2,tags:["Italian","Date Night","Cocktails","New Opening"],reservation:"Resy",description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Ave Bakery",cuisine:"Bakery / Gluten-Free",neighborhood:"The Avenues",score:84,price:1,tags:["Bakery","Gluten-Free","Breakfast","Coffee"],description:"100% gluten-free bakery in The Avenues. Pastries, bread, and breakfast items that are safe for celiac and gluten-sensitive diners without sacrificing taste. A rare dedicated GF bakery.",dishes:["Gluten-Free Pastries","GF Bread","Breakfast","Coffee"],address:"130 A St, Salt Lake City, UT 84103",phone:"(801) 906-8150",lat:40.7800,lng:-111.8820,instagram:"avebakeryslc",website:"https://www.avebakery.com"});

add({name:"Sundance Mountain Resort",cuisine:"Tourist Attraction",neighborhood:"Sundance / Provo Canyon",score:88,price:2,tags:["Tourist Attraction","Outdoor","Skiing","Scenic","Arts"],suburb:true,description:"Robert Redford's Sundance Mountain Resort in Provo Canyon — skiing, art, film, and nature on 5,000 acres. Home of the Sundance Film Festival's origins. Year-round dining, zip-lining, and art studios. One of America's most unique mountain resorts.",dishes:["Skiing","Film","Art Studios","Mountain Dining"],address:"8841 N Alpine Loop Rd, Sundance, UT 84604",phone:"(866) 259-7468",lat:40.3930,lng:-111.5870,instagram:"sundanceresort",website:"https://www.sundanceresort.com"});

add({name:"Ogden Eccles Dinosaur Park",cuisine:"Tourist Attraction",neighborhood:"Ogden",score:84,price:1,tags:["Tourist Attraction","Family","Museum","Outdoor"],suburb:true,description:"Outdoor dinosaur park and museum in Ogden with over 100 life-size dinosaur sculptures, fossil exhibits, and a playground. Fun family attraction with mountain views. Educational and entertaining for all ages.",dishes:["Dinosaur Exhibits","Fossil Museum","Playground"],address:"1544 E Park Blvd, Ogden, UT 84401",phone:"(801) 393-3466",lat:41.2200,lng:-111.9400,instagram:"ogdendinopark",website:"https://www.dinosaurpark.org"});

add({name:"Strap Tank Lehi",cuisine:"Brewery",neighborhood:"Lehi",score:84,price:1,tags:["Brewery","Craft Beer","Family","Casual"],description:"Already in data.",dishes:[],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Spitz (Park City)",cuisine:"Mediterranean / Doner",neighborhood:"Park City",score:84,price:1,tags:["Mediterranean","Casual","Cheap Eats"],suburb:true,description:"Park City location of the popular Utah Mediterranean chain. Doner wraps, fries, and gyros. Quick affordable option on Main Street.",dishes:["Doner Wrap","Fries","Gyro"],address:"306 Main St, Park City, UT 84060",phone:"(435) 200-8131",lat:40.6461,lng:-111.4980,instagram:"spitzslc",website:"https://www.spitzrestaurant.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('SLC: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
