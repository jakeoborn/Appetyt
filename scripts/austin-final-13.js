// Austin Final 13 spots to hit 250
// Run: node scripts/austin-final-13.js
const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id||0))+1, added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase()))return;
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:2});
  existing.add(s.name.toLowerCase());added++;
}

add({name:"Asiana Indian Cuisine",cuisine:"Indian",neighborhood:"South Lamar",score:84,price:1,tags:["Indian","Casual","Family","Cheap Eats"],description:"South Lamar Indian with generous lunch buffets and traditional North Indian dishes. Butter chicken, lamb rogan josh, and naan are consistently good.",dishes:["Lunch Buffet","Butter Chicken","Lamb Rogan Josh","Naan"],address:"2901 S Capital of TX Hwy, Suite E140, Austin, TX 78746",phone:"(512) 327-5757",lat:30.2540,lng:-97.7880,instagram:"asianaindiancuisine",website:"https://www.asianaindiancuisine.com"});

add({name:"Counter Culture",cuisine:"Vegan / Plant-Based",neighborhood:"East Austin",score:85,price:1,tags:["Vegan","Healthy","Casual","Local Favorites"],description:"East Austin plant-based restaurant serving creative vegan dishes. Mushroom burger, loaded nachos, and seasonal bowls that satisfy even carnivores.",dishes:["Mushroom Burger","Vegan Nachos","Seasonal Bowls"],address:"2337 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 680-8515",lat:30.2533,lng:-97.7194,instagram:"countercultureatx",website:"https://www.countercultureaustin.com"});

add({name:"Hyde Park Bar & Grill",cuisine:"American / Bar",neighborhood:"Hyde Park",score:84,price:1,tags:["American","Bar","Casual","Classic","Family"],description:"Hyde Park institution famous for enormous battered french fries. Burgers, chicken fried steak, and cold beer in a comfortable neighborhood setting since 1982.",dishes:["Giant Battered Fries","Burgers","Chicken Fried Steak"],address:"4206 Duval St, Austin, TX 78751",phone:"(512) 458-3168",lat:30.3050,lng:-97.7270,instagram:"hydeparkbarandgrill",website:"https://www.hydeparkbarandgrill.com"});

add({name:"Juan in a Million",cuisine:"Tex-Mex / Breakfast",neighborhood:"East Austin",score:86,price:1,tags:["Tex-Mex","Breakfast","Classic","Local Favorites"],description:"East Austin breakfast taco institution since 1980. The Don Juan is legendary — massive plate of eggs, bacon, potato, cheese, beans. Obama stopped here.",dishes:["The Don Juan","Breakfast Tacos","Migas"],address:"2300 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 472-3872",lat:30.2533,lng:-97.7194,instagram:"juaninamillion",website:"https://www.juaninamillion.com"});

add({name:"Thai Cuisine",cuisine:"Thai",neighborhood:"North Austin",score:85,price:1,tags:["Thai","Casual","Cheap Eats","Local Favorites"],description:"No-frills north Austin Thai serving authentic pad see ew, green curry, and tom kha gai. BYOB-friendly and affordable.",dishes:["Pad See Ew","Green Curry","Tom Kha Gai"],address:"4000 N Lamar Blvd, Suite 700, Austin, TX 78756",phone:"(512) 444-5559",lat:30.3100,lng:-97.7389,instagram:"thaicuisineatx",website:"https://www.thaicuisineatx.com"});

add({name:"Cisco's Restaurant Bakery",cuisine:"Tex-Mex / Bakery",neighborhood:"East Austin",score:85,price:1,tags:["Tex-Mex","Breakfast","Classic","Local Favorites"],awards:"Austin institution since 1950",description:"East Austin Tex-Mex since 1950. Migas, huevos rancheros, and pan dulce where politicians and workers share tables. LBJ ate here.",dishes:["Migas","Huevos Rancheros","Pan Dulce"],address:"1511 E 6th St, Austin, TX 78702",phone:"(512) 478-2420",lat:30.2626,lng:-97.7260,instagram:"ciscosrestaurant",website:""});

add({name:"Sandy's Hamburgers",cuisine:"Burgers / Drive-In",neighborhood:"Barton Springs",score:85,price:1,tags:["Burgers","Classic","Casual","Cheap Eats","Iconic"],awards:"Since 1946",description:"Retro drive-in on Barton Springs Road since 1946. Thin-patty burgers, hand-dipped frozen custard, and root beer floats. Post-swim tradition for 80 years.",dishes:["Thin-Patty Burger","Frozen Custard","Root Beer Float"],address:"603 Barton Springs Rd, Austin, TX 78704",phone:"(512) 478-6322",lat:30.2640,lng:-97.7590,instagram:"sandysfrozencustard",website:"https://www.sandyshamburgers.com"});

add({name:"Polvos Mexican Restaurant",cuisine:"Interior Mexican",neighborhood:"South 1st",score:85,price:1,tags:["Mexican","Casual","Patio","Margaritas"],description:"South First interior Mexican with massive patio and strong margaritas. Chiles rellenos, mole enchiladas, street corn. Packed every weekend.",dishes:["Chiles Rellenos","Mole Enchiladas","Street Corn","Margaritas"],address:"2004 S 1st St, Austin, TX 78704",phone:"(512) 441-5446",lat:30.2430,lng:-97.7566,instagram:"polvosaustin",website:"https://www.polvosmexicanfood.com"});

add({name:"Dan's Hamburgers",cuisine:"Burgers / Drive-Thru",neighborhood:"North Lamar",score:84,price:1,tags:["Burgers","Classic","Casual","Cheap Eats","Family"],description:"Austin original fast-food burger chain since 1973. Double-meat cheeseburger is simple, greasy perfection. Austin's answer to In-N-Out.",dishes:["Double Meat Cheeseburger","Fries","Milkshakes"],address:"5602 N Lamar Blvd, Austin, TX 78756",phone:"(512) 459-3239",lat:30.3270,lng:-97.7270,instagram:"danshamburgersatx",website:"https://www.danshamburgersatx.com"});

add({name:"La Patisserie",cuisine:"French Bakery",neighborhood:"South Congress",score:86,price:1,tags:["Bakery","French","Breakfast","Coffee"],description:"French bakery with croissants, macarons, and tarts rivaling any in Austin. Morning pastries sell out fast. Genuine technique.",dishes:["Croissants","Macarons","Quiche","French Tarts"],address:"1404 S Congress Ave, Austin, TX 78704",phone:"(512) 912-9100",lat:30.2496,lng:-97.7493,instagram:"lapatisserieatx",website:"https://www.lapatisserieatx.com"});

add({name:"Flitch Coffee",cuisine:"Specialty Coffee",neighborhood:"East Austin",score:85,price:1,tags:["Coffee","Casual","Local Favorites"],description:"East Austin specialty coffee trailer. The cortado is perfection and the seasonal specials are creative. Order and sit under the trees.",dishes:["Cortado","Espresso","Cold Brew"],address:"2700 E 12th St, Austin, TX 78702",phone:"",lat:30.2729,lng:-97.7170,instagram:"flitchcoffee",website:"https://www.flitchcoffee.com"});

add({name:"Lamberts Downtown Barbecue",cuisine:"Upscale BBQ",neighborhood:"2nd Street",score:87,price:2,tags:["BBQ","Southern","Live Music","Date Night","Cocktails"],reservation:"OpenTable",description:"Upscale BBQ on 2nd Street with live music and craft cocktails. Mesquite-smoked brisket and wild boar ribs elevate BBQ into date-night territory.",dishes:["Brisket","Wild Boar Ribs","Craft Cocktails","Live Music"],address:"401 W 2nd St, Austin, TX 78701",phone:"(512) 494-1500",lat:30.2643,lng:-97.7488,instagram:"lambertsaustin",website:"https://www.lambertsaustin.com"});

add({name:"Jack Allen's Kitchen (Westlake)",cuisine:"Texas Comfort Food",neighborhood:"Westlake",score:85,price:2,tags:["Southern","Casual","Brunch","Family"],suburb:true,description:"Westlake Hills location of the farm-to-table comfort food chain. Chicken fried steak, Gulf shrimp, and biscuits from Texas ranches. Great brunch.",dishes:["Chicken Fried Steak","Gulf Shrimp","Brunch"],address:"3600 N Capital of TX Hwy, Austin, TX 78746",phone:"(512) 351-5159",lat:30.3270,lng:-97.7930,instagram:"jackallenskitchen",website:"https://www.jackallenskitchen.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('Austin: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
