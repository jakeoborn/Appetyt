// Houston Batch 3: Remaining Michelin restaurants + more essential spots
// All with verified instagram + website
// Run: node scripts/houston-batch-3.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const HOUSTON_DATA');
const a = html.indexOf('[', s);
let d=0, e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id)) + 1;
let added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,
    score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',
    reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,
    dishes:s.dishes,address:s.address,hours:s.hours||'',lat:s.lat,lng:s.lng,
    bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,
    trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',
    website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// === REMAINING MICHELIN RESTAURANTS ===

add({name:"Belly of the Beast",cuisine:"Modern Mexican-American",neighborhood:"Spring",
  score:92,price:3,tags:["Mexican","Fine Dining","Date Night","Awards","Critics Pick"],
  reservation:"Resy",awards:"Michelin Bib Gourmand, JBF Best Chef: Texas Winner 2025",
  description:"Chef Thomas Bille's Mexican-American fine dining in Spring earned him the 2025 James Beard Best Chef: Texas award. New American cuisine through a Mexican-American lens — think mole-braised short ribs, smoked quail, and seasonal produce from local farms. The Michelin Bib Gourmand confirms what Houston foodies already knew.",
  dishes:["Mole Short Ribs","Smoked Quail","Seasonal Tasting","House Tortillas"],
  address:"5200 FM 2920, Suite 180, Spring, TX 77388",phone:"(281) 466-2040",
  lat:30.0891,lng:-95.4317,instagram:"botbfood",website:"https://www.botbfood.com",suburb:true,res_tier:2});

add({name:"The Pit Room",cuisine:"Texas BBQ",neighborhood:"Montrose",
  score:88,price:2,tags:["BBQ","Local Favorites","Awards","Brunch"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Michelin Bib Gourmand BBQ in Montrose with brisket, sausage, and pulled pork that rival the best in the state. The breakfast tacos (served 7-10:30am) are a sleeper hit. The covered patio at The Patio next door is perfect for beers and live music. Two locations now, but Montrose on Richmond Ave is the original.",
  dishes:["Brisket","Pork Ribs","Breakfast Tacos","Pulled Pork"],
  address:"1201 Richmond Ave, Houston, TX 77006",phone:"(281) 888-1929",
  lat:29.7383,lng:-95.3870,instagram:"thepitroom",website:"https://thepitroombbq.com"});

add({name:"Rosemeyer Bar-B-Q",cuisine:"Texas BBQ",neighborhood:"Spring",
  score:87,price:2,tags:["BBQ","Local Favorites","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand 2025",
  description:"Jordan Rosemeyer's Michelin Bib Gourmand BBQ operation in Spring, open only Thursday through Saturday until sellout. The brisket is competition-grade, the ribs are peppery and perfectly rendered, and the sausage links are house-made. A small operation doing big things — arrive early or miss out.",
  dishes:["Brisket","Pork Ribs","House Sausage","Loaded Baked Potato"],
  address:"2111 Riley Fuzzel Rd, Spring, TX 77386",phone:"(281) 205-0625",
  lat:30.1022,lng:-95.4073,instagram:"rosemeyerbarbq",website:"https://rosemeyerbbq.square.site",suburb:true});

add({name:"Tejas Chocolate + Barbecue",cuisine:"BBQ / Chocolate",neighborhood:"Tomball",
  score:88,price:2,tags:["BBQ","Chocolate","Local Favorites","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand, Texas Monthly Top 50 BBQ",
  description:"A barbecue joint and artisan chocolate shop under one roof in Tomball. The BBQ is serious — oak-smoked brisket, ribs, and turkey — and then you finish with handcrafted chocolate truffles and bars. The combination sounds odd but works brilliantly. Michelin Bib Gourmand and Texas Monthly Top 50.",
  dishes:["Brisket","Ribs","Artisan Chocolate","Craft Truffles"],
  address:"200 N Elm St, Tomball, TX 77375",phone:"(832) 761-0670",
  lat:30.0972,lng:-95.6162,instagram:"tejaschocolate",website:"https://www.tejaschocolate.com",suburb:true});

add({name:"Baso",cuisine:"Basque / Japanese",neighborhood:"Heights",
  score:88,price:3,tags:["Spanish","Japanese","Fine Dining","Date Night","Cocktails"],
  reservation:"Resy",awards:"Michelin Recommended 2025",
  description:"Live-fire Basque-Japanese fusion in the Heights from an LA chef duo. The wood-burning hearth drives a menu that bridges San Sebastián and Tokyo — think grilled txuleta steaks, pintxos, and Japanese-influenced seafood. The Michelin nod validates one of Houston's most creative new restaurants.",
  dishes:["Txuleta Steak","Pintxos","Grilled Seafood","Basque Cheesecake"],
  address:"633a W 19th St, Houston, TX 77008",phone:"(979) 349-9051",
  lat:29.8015,lng:-95.3920,instagram:"basohtx",website:"https://www.basohtx.com"});

add({name:"Brisket & Rice",cuisine:"Texas BBQ / Vietnamese",neighborhood:"West Houston",
  score:87,price:1,tags:["BBQ","Vietnamese","Casual","Local Favorites","Critics Pick"],
  reservation:"walk-in",awards:"Michelin Recommended 2025",
  description:"Chef Hong Tran turned a backyard brisket hobby into a Michelin-recommended restaurant fusing Texas BBQ with Vietnamese flavors. Jasmine fried rice tossed with fried egg and Chinese sausage topped with prime brisket is the signature. A family operation that embodies Houston's immigrant food story.",
  dishes:["Brisket Fried Rice","Pho","Brisket Banh Mi","Loaded Fries"],
  address:"6166 Hwy 6 N, Houston, TX 77084",phone:"(713) 936-9575",
  lat:29.8192,lng:-95.6307,instagram:"brisketnrice",website:"https://brisketnrice.com",suburb:true});

add({name:"Hidden Omakase",cuisine:"Japanese Omakase",neighborhood:"Galleria",
  score:89,price:4,tags:["Japanese","Omakase","Fine Dining","Date Night","Exclusive"],
  reservation:"Resy",awards:"Michelin Recommended (2024, 2025)",
  description:"Intimate omakase counter in the Galleria area where Chef Niki Vongthong crafts 17-course experiences that blend traditional Edomae technique with creative seasonal touches. The space seats only 10, reservations open on Resy and sell out fast. Michelin recommended for two consecutive years.",
  dishes:["17-Course Omakase","Seasonal Nigiri","A5 Wagyu","Uni"],
  address:"5353 W Alabama St, Suite 102, Houston, TX 77056",phone:"(713) 496-2633",
  lat:29.7367,lng:-95.4613,instagram:"hiddenomakase",website:"https://www.hiddenomakase.com",res_tier:1});

add({name:"Hong Kong Food Street",cuisine:"Cantonese",neighborhood:"Katy",
  score:87,price:2,tags:["Chinese","Cantonese","Seafood","Critics Pick"],
  reservation:"OpenTable",awards:"Michelin Recommended 2025",
  description:"Authentic Cantonese cooking in Katy that earned a Michelin recommendation. The Peking duck, wonton noodles, and live seafood preparations are the real deal — this is Hong Kong transplanted to suburban Houston. Family-owned and operated with a dedication to traditional technique that the Michelin inspectors noticed.",
  dishes:["Peking Duck","Wonton Noodles","Chinese BBQ","Live Seafood"],
  address:"23015 Colonial Pkwy, Suite A101, Katy, TX 77493",phone:"(832) 212-8128",
  lat:29.7789,lng:-95.7581,instagram:"hkfs_tx",website:"https://www.hkfstx.com",suburb:true});

add({name:"J-Bar-M Barbecue",cuisine:"Texas BBQ",neighborhood:"EaDo",
  score:87,price:2,tags:["BBQ","Local Favorites","Awards","Community"],
  reservation:"walk-in",awards:"Michelin Recommended 2025",
  description:"EaDo BBQ joint that doubles as a community arts space. The brisket and ribs are Michelin-recommended, and the vibe is uniquely Houston — local art on the walls, events in the yard, and a pitmaster who treats barbecue as both craft and culture. One of the most interesting new BBQ spots in the city.",
  dishes:["Brisket","Pork Ribs","Sausage","Banana Pudding"],
  address:"2201 Leeland St, Houston, TX 77003",phone:"(713) 534-1024",
  lat:29.7462,lng:-95.3504,instagram:"jbarmbbq",website:"https://www.jbarmbbq.com"});

add({name:"Josephine's Gulf Coast Tradition",cuisine:"Gulf Coast Seafood",neighborhood:"Midtown",
  score:88,price:3,tags:["Seafood","Southern","Date Night","Cocktails"],
  reservation:"OpenTable",awards:"Michelin Recommended 2025",
  description:"Gulf Coast seafood tradition elevated in a polished Midtown setting. The menu celebrates the Texas Gulf — oysters, shrimp, snapper, and crab — prepared with Southern technique and local sourcing. The raw bar is excellent and the cocktails lean coastal. Michelin recommended in its first year.",
  dishes:["Gulf Oysters","Shrimp & Grits","Snapper","Crab Cakes"],
  address:"318 Gray St, Houston, TX 77002",phone:"(713) 527-8988",
  lat:29.7507,lng:-95.3712,instagram:"josephinesgulfcoast",website:"https://josephinesgulfcoasttradition.com"});

add({name:"Neo",cuisine:"Japanese Omakase",neighborhood:"Montrose",
  score:91,price:4,tags:["Japanese","Omakase","Fine Dining","Exclusive","Date Night"],
  reservation:"Resy",awards:"Michelin Recommended 2025",group:"Comma Hospitality",
  description:"The Ahmed brothers' intimate 10-seat omakase at Glass Cypress in Montrose. Chef's tasting menus blend East and West with sushi sourced from Japan's top markets alongside Texas Gulf catches. The most exclusive table in the Comma Hospitality portfolio. Michelin recommended and one of Houston's most coveted reservations.",
  dishes:["Omakase Tasting","Nigiri","Seasonal Sashimi","Japanese Whisky Pairing"],
  address:"1711 Indiana St, Houston, TX 77006",phone:"(832) 598-6222",
  lat:29.7456,lng:-95.3920,instagram:"neohtx",website:"https://www.glasscypress.com/explore/neo/",res_tier:1});

add({name:"Perseid",cuisine:"French-Gulf Coast",neighborhood:"Montrose",
  score:88,price:3,tags:["French","Seafood","Date Night","Hotel","Brunch"],
  reservation:"Resy",awards:"Michelin Recommended 2025",
  description:"Aaron Bludorn's second restaurant inside Hotel Saint Augustine in Montrose. French sensibility meets Gulf Coast ingredients — think bouillabaisse with Texas blue crab, steak frites with Creole butter, and a wine program curated for the Montrose crowd. The hotel setting adds polish without pretension. Michelin recommended in 2025.",
  dishes:["Bouillabaisse","Steak Frites","Crudo","Weekend Brunch"],
  address:"4110 Loretto Dr, Houston, TX 77006",phone:"(832) 915-2600",
  lat:29.7395,lng:-95.3920,instagram:"perseidhtx",website:"https://www.bunkhousehotels.com/hotel-saint-augustine/eat-drink/perseid"});

// === MORE ESSENTIAL HOUSTON (non-Michelin but critical) ===

add({name:"Underbelly Hospitality / Bar Bludorn",cuisine:"Wine Bar / Small Plates",neighborhood:"Memorial",
  score:87,price:3,tags:["Wine Bar","French","Date Night","Cocktails"],
  reservation:"Resy",awards:"Michelin Recommended 2025",
  description:"Aaron Bludorn's wine-focused companion to the main Bludorn restaurant. A more casual, intimate setting for natural wines, craft cocktails, and French-inspired small plates. The charcuterie and cheese selections are excellent and the bartenders know their way around a wine list. Michelin recommended alongside big brother.",
  dishes:["Natural Wine","Charcuterie","French Small Plates","Craft Cocktails"],
  address:"9061 Gaylord St, Houston, TX 77024",phone:"(713) 999-0146",
  lat:29.7725,lng:-95.4750,instagram:"barbludorn",website:"https://www.barbludorn.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
