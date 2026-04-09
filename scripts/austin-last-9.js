// Austin: Last 9 unique spots to hit 250
// Run: node scripts/austin-last-9.js
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

// 1. Korean
add({name:"Korea House",cuisine:"Korean BBQ",neighborhood:"North Austin",score:85,price:2,tags:["Korean","BBQ","Casual","Local Favorites"],description:"North Austin Korean BBQ restaurant with tabletop grills, banchan spreads, and soju. The bulgogi and galbi are well-marinated and the all-you-can-eat option is great value for groups.",dishes:["Korean BBQ","Bulgogi","Galbi","Banchan"],address:"2700 W Anderson Ln, Suite 501, Austin, TX 78757",phone:"(512) 458-2477",lat:30.3480,lng:-97.7389,instagram:"koreahouseatx",website:"https://www.koreahouseaustin.com"});

// 2. Mediterranean
add({name:"Arpeggio Grill",cuisine:"Mediterranean / Turkish",neighborhood:"Great Hills",score:85,price:2,tags:["Mediterranean","Turkish","Casual","Family","Patio"],description:"Turkish and Mediterranean restaurant in Great Hills serving kebabs, hummus, and pide in a family-friendly setting. The lamb kebab platter is excellent and the patio is spacious. One of north Austin's best Mediterranean options.",dishes:["Lamb Kebab","Hummus","Pide","Turkish Tea"],address:"6619 Airport Blvd, Austin, TX 78752",phone:"(512) 419-0110",lat:30.3340,lng:-97.7100,instagram:"arpeggiogrill",website:"https://www.arpeggiogrill.com"});

// 3. Sushi
add({name:"Uchi (Lamar)",cuisine:"Japanese / Sushi",neighborhood:"South Lamar",score:97,price:4,tags:["Japanese","Sushi","Fine Dining","Date Night","Awards"],reservation:"Resy",awards:"James Beard Award",group:"Hai Hospitality",description:"The original Uchi on South Lamar — Tyson Cole's James Beard-winning Japanese restaurant in a converted bungalow. The hama chili, machi cure, and omakase are legendary. The restaurant that put Austin on the national fine dining map.",dishes:["Hama Chili","Machi Cure","Omakase","Wagyu"],address:"801 S Lamar Blvd, Austin, TX 78704",phone:"(512) 916-4808",lat:30.2556,lng:-97.7664,instagram:"uchiaustin",website:"https://uchirestaurants.com"});

// 4. Vietnamese
add({name:"Pho Please",cuisine:"Vietnamese / Pho",neighborhood:"North Austin",score:84,price:1,tags:["Vietnamese","Casual","Cheap Eats","Family"],description:"No-frills north Austin pho shop with rich, deeply flavored broth and generous portions. The rare beef pho and bun bo Hue are standouts. Cash-friendly and consistent. A solid everyday Vietnamese option.",dishes:["Pho","Bun Bo Hue","Banh Mi","Vietnamese Coffee"],address:"10901 N Lamar Blvd, Suite A114, Austin, TX 78753",phone:"(512) 339-1288",lat:30.3770,lng:-97.6930,instagram:"phoplease",website:"https://www.phopleaseatx.com"});

// 5. Celebration/Fine Dining
add({name:"Jeffrey's (Clarksville)",cuisine:"New American Fine Dining",neighborhood:"Clarksville",score:90,price:4,tags:["Fine Dining","Date Night","Celebrations","Classic","Awards"],reservation:"OpenTable",awards:"Michelin Recommended, since 1975",description:"Austin's original fine dining since 1975. Dry-aged steaks, French-inspired plates. The dessert cart is old-school perfection. Michelin recommended.",dishes:["Dry-Aged Steak","Seasonal Tasting","Dessert Cart"],address:"1204 W Lynn St, Austin, TX 78703",phone:"(512) 477-5584",lat:30.2798,lng:-97.7620,instagram:"jeffreysaustin",website:"https://www.jeffreysofaustin.com"});

// 6. BBQ
add({name:"Brown's Bar-B-Que",cuisine:"Texas BBQ",neighborhood:"South Lamar",score:85,price:1,tags:["BBQ","Casual","Food Truck","Cheap Eats"],description:"South Lamar BBQ trailer serving tender brisket, house sausage, and pulled pork at food truck prices. No long lines, consistent quality. The South Lamar alternative when you want quick, solid BBQ.",dishes:["Brisket","House Sausage","Pulled Pork"],address:"1901 S Lamar Blvd, Austin, TX 78704",phone:"",lat:30.2460,lng:-97.7847,instagram:"brownsbbq",website:"https://www.brownsbbq.com"});

// 7. Tex-Mex
add({name:"Mi Madre's",cuisine:"Tex-Mex",neighborhood:"East Austin",score:84,price:1,tags:["Tex-Mex","Breakfast","Casual","Classic","Local Favorites"],description:"East Austin Tex-Mex serving big plates and breakfast tacos since 1990. The enchilada plate and queso are crowd favorites. A neighborhood institution that keeps it real.",dishes:["Enchiladas","Queso","Breakfast Tacos","Migas"],address:"2201 Manor Rd, Austin, TX 78722",phone:"(512) 322-9721",lat:30.2757,lng:-97.7195,instagram:"mimadresaustin",website:"https://www.mimadresrestaurant.com"});

// 8. Ice Cream
add({name:"Lick Honest Ice Creams",cuisine:"Ice Cream",neighborhood:"South Congress",score:86,price:1,tags:["Dessert","Ice Cream","Local Favorites","Casual"],description:"Farm-to-cone ice cream with ingredients from Texas farms. Goat cheese thyme honey and dark chocolate olive oil are signatures. Multiple locations.",dishes:["Goat Cheese Thyme Honey","Dark Chocolate Olive Oil","Seasonal"],address:"1100 S Congress Ave, Austin, TX 78704",phone:"(512) 462-6600",lat:30.2530,lng:-97.7493,instagram:"lickicecreams",website:"https://www.ilikelick.com"});

// 9. More suburban
add({name:"Kreuz Market",cuisine:"Texas BBQ",neighborhood:"Lockhart",score:90,price:1,tags:["BBQ","Classic","Historic"],awards:"Texas Monthly Top 50, since 1900",suburb:true,description:"Lockhart BBQ cathedral since 1900 — shoulder clod, prime rib, sausage smoked over post oak in massive brick pits. No sauce needed. BBQ pilgrimage essential.",dishes:["Shoulder Clod","Prime Rib","Sausage","Pork Chops"],address:"619 N Colorado St, Lockhart, TX 78644",phone:"(512) 398-2361",lat:29.8860,lng:-97.6670,instagram:"kreuzmarket",website:"https://www.kreuzmarket.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('Austin: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
