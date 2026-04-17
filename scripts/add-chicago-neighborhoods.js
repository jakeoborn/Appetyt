const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const CHICAGO_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
console.log('Chicago before:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let count = 0;

function add(s){
  const lower = s.name.toLowerCase();
  if(existing.has(lower)) { return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation='walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name);
}

// Fix: Merge "West Loop / Fulton Market" into "West Loop"
let merged = 0;
arr.forEach(r => {
  if(r.neighborhood === 'West Loop / Fulton Market') { r.neighborhood = 'West Loop'; merged++; }
});
if(merged) console.log('Merged', merged, 'West Loop / Fulton Market into West Loop');

// Devon Avenue
add({name:"Ghareeb Nawaz",cuisine:"Indian / Pakistani",neighborhood:"Devon Avenue",score:80,price:1,tags:["Casual","Local Favorites","Indian"],indicators:["hole-in-wall"],description:"Cash-only Devon institution with huge portions of Indian and Pakistani classics under $10.",address:"2032 W Devon Ave, Chicago, IL 60659",lat:41.9980,lng:-87.6875,instagram:"",website:""});
add({name:"Bundoo Khan",cuisine:"Pakistani BBQ",neighborhood:"Devon Avenue",score:83,price:2,tags:["Pakistani","BBQ","Local Favorites"],description:"Pakistani grill with whole chickens on spit and standout malai boti and beef rolls.",address:"2539 W Devon Ave, Chicago, IL 60659",lat:41.9980,lng:-87.6960,instagram:"@bundookhanchicago",website:"https://bundookhanchicago.com"});
add({name:"Annapurna Indian",cuisine:"Indian Vegetarian",neighborhood:"Devon Avenue",score:82,price:1,tags:["Vegetarian Friendly","Indian","Casual"],description:"Chicago oldest vegetarian Indian restaurant since 1982 with dosas, chaat, and thalis.",address:"2600 W Devon Ave, Chicago, IL 60659",lat:41.9980,lng:-87.6970,instagram:"@eatannapurna",website:"https://eatannapurna.com"});
add({name:"Sabri Nihari",cuisine:"Pakistani",neighborhood:"Devon Avenue",score:84,price:1,tags:["Casual","Local Favorites"],indicators:["hidden-gem"],description:"Long-running Devon stalwart for slow-cooked nihari and hearty Pakistani breakfast.",address:"2502 W Devon Ave, Chicago, IL 60659",lat:41.9980,lng:-87.6955,instagram:"",website:"https://sabrinihari.com"});

// Edgewater
add({name:"Sun Wah BBQ",cuisine:"Chinese BBQ",neighborhood:"Edgewater",score:88,price:2,tags:["Chinese","Local Favorites","Family Friendly","Critics Pick"],indicators:["iconic"],description:"Award-winning Hong Kong BBQ institution famous for whole Peking duck ceremony.",address:"5039 N Broadway, Chicago, IL 60640",lat:41.9740,lng:-87.6596,instagram:"@sunwahbbq",website:"https://sunwahbbq.com"});
add({name:"Ethiopian Diamond",cuisine:"Ethiopian",neighborhood:"Edgewater",score:82,price:2,tags:["Ethiopian","Vegetarian Friendly","Local Favorites"],description:"Family-run Ethiopian with slow-simmered stews and vegetarian platters for 25+ years.",address:"6120 N Broadway St, Chicago, IL 60660",lat:41.9933,lng:-87.6596,instagram:"@ethiopiandiamond",website:""});
add({name:"Little Bad Wolf",cuisine:"American / Bar",neighborhood:"Edgewater",score:84,price:2,tags:["Casual","Cocktails","Local Favorites"],description:"Edgewater bar with a cult-following burger rivaling Chicago best.",address:"1541 W Bryn Mawr Ave, Chicago, IL 60660",lat:41.9837,lng:-87.6696,instagram:"@littlebadwolfchicago",website:"https://littlebadwolfchicago.com"});

// Greektown
add({name:"Greek Islands Restaurant",cuisine:"Greek",neighborhood:"Greektown",score:84,price:2,tags:["Greek","Local Favorites","Family Friendly"],indicators:["iconic"],description:"Anchor of Greektown since 1971, famous for tableside flaming saganaki.",address:"200 S Halsted St, Chicago, IL 60661",lat:41.8786,lng:-87.6479,instagram:"",website:"https://greekislands.net"});
add({name:"Athena Restaurant",cuisine:"Greek",neighborhood:"Greektown",score:82,price:2,tags:["Greek","Patio","Family Friendly"],description:"Expansive taverna with retractable-roof patio and classic Greek dishes.",address:"212 S Halsted St, Chicago, IL 60661",lat:41.8784,lng:-87.6479,instagram:"@athenachicago",website:"https://athenachicago.com"});
add({name:"Artopolis Bakery",cuisine:"Greek Bakery",neighborhood:"Greektown",score:79,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Greektown beloved bakery with spanakopita, pastries, and Greek coffee.",address:"306 S Halsted St, Chicago, IL 60661",lat:41.8775,lng:-87.6479,instagram:"@artopolischicago",website:"https://artopolischicago.com"});

// Hermosa
add({name:"Tacotlan",cuisine:"Mexican / Tacos",neighborhood:"Hermosa",score:84,price:1,tags:["Mexican","Casual","Local Favorites"],indicators:["hidden-gem"],description:"Father-daughter taqueria credited with introducing quesabirria to Chicago.",address:"4312 W Fullerton Ave, Chicago, IL 60639",lat:41.9224,lng:-87.7288,instagram:"@tacotlantacos",website:"https://tacotlan.com"});
add({name:"Ponce Restaurant",cuisine:"Puerto Rican",neighborhood:"Hermosa",score:81,price:1,tags:["Casual","Family Friendly","Local Favorites"],description:"Family business serving Hermosa for 27+ years with jibaritos and mofongo.",address:"4313 W Fullerton Ave, Chicago, IL 60639",lat:41.9224,lng:-87.7289,instagram:"",website:"https://poncerestaurant.com"});

// Douglas Park
add({name:"EL Ideas",cuisine:"Contemporary American",neighborhood:"Douglas Park",score:88,price:4,tags:["Fine Dining","Date Night","Tasting Menu","Critics Pick"],indicators:["hidden-gem"],description:"Michelin one-star hidden in an industrial space with a boundary-pushing tasting menu.",address:"2419 W 14th St, Chicago, IL 60608",lat:41.8607,lng:-87.6917,instagram:"@elideaschi",website:"http://elideas.com"});
add({name:"Lagunitas Taproom",cuisine:"Brewery",neighborhood:"Douglas Park",score:82,price:2,tags:["Casual","Local Favorites","Patio"],description:"Chicago largest craft brewery with expansive taproom and bar food.",address:"2607 W 17th St, Chicago, IL 60608",lat:41.8574,lng:-87.6975,instagram:"@lagunitasbrewing",website:"https://lagunitas.com/taproom/chicago"});

// Elmwood Park
add({name:"Johnnie's Beef",cuisine:"Italian Beef",neighborhood:"Elmwood Park",score:87,price:1,tags:["Casual","Local Favorites"],indicators:["iconic"],description:"Legendary Italian beef stand since 1961, a pilgrimage for the perfect dipped sandwich.",address:"7500 W North Ave, Elmwood Park, IL 60707",lat:41.9089,lng:-87.8134,instagram:"",website:""});

// Fulton Market / West Loop additions
add({name:"il Carciofo",cuisine:"Italian / Roman",neighborhood:"West Loop",score:86,price:3,tags:["Italian","Date Night","Critics Pick"],indicators:["new-opening"],description:"Chef Joe Flamm Roman Italian showpiece with chef counter and wood-fired hearth.",address:"1045 W Fulton St, Chicago, IL 60607",lat:41.8868,lng:-87.6591,instagram:"@ilcarciofochicago",website:"https://ilcarciofochicago.com"});
add({name:"Osaka Nikkei",cuisine:"Peruvian-Japanese",neighborhood:"West Loop",score:85,price:3,tags:["Japanese","Date Night","Cocktails"],indicators:["new-opening"],description:"Peruvian-Japanese fusion with wasabi ceviche and asado gyudon.",address:"900 W Randolph St, Chicago, IL 60607",lat:41.8842,lng:-87.6558,instagram:"@osakanikkei",website:"https://osakanikkei.com"});

// Bridgeport
add({name:"Han 202",cuisine:"Chinese / French Fusion",neighborhood:"Bridgeport",score:86,price:2,tags:["Chinese","Date Night","Local Favorites"],indicators:["hidden-gem"],description:"Hidden gem since 2009 with $35 prix fixe Chinese-French dishes in a BYOB room.",address:"605 W 31st St, Chicago, IL 60616",lat:41.8379,lng:-87.6414,instagram:"@han202restaurant",website:"https://han202.com"});
add({name:"The Duck Inn",cuisine:"New American / Gastropub",neighborhood:"Bridgeport",score:87,price:3,tags:["Date Night","Cocktails","Critics Pick"],indicators:["hidden-gem"],description:"Michelin-recognized gastro-tavern in a pre-Prohibition building.",address:"2701 S Eleanor St, Chicago, IL 60608",lat:41.8450,lng:-87.6603,instagram:"@theduckinnchicago",website:"https://theduckinnchicago.com"});
add({name:"Phil's Pizza",cuisine:"Tavern-Style Pizza",neighborhood:"Bridgeport",score:84,price:1,tags:["Pizza","Casual","Local Favorites"],indicators:["hole-in-wall"],description:"Cash-only 1960 pizza parlor with greasy thin-crust tavern pies.",address:"1102 W 35th St, Chicago, IL 60609",lat:41.8308,lng:-87.6541,instagram:"",website:""});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Chicago total:', arr.length);
