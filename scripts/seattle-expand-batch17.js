// Seattle Batch 17 — Low-filter boosters (Cambodian, Korean, BBQ) + neighborhood depth (CID, Capitol Hill, Belltown, Wallingford)
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

add({name:"Harry's Fine Foods",cuisine:"New American",neighborhood:"Capitol Hill",score:87,price:3,tags:["New American","Brunch","Date Night","Local Favorites","Critics Pick"],description:"Capitol Hill neighborhood restaurant specializing in seasonal Pacific Northwest ingredients. Warm woody dining room, strong brunch, and Northwest-focused wine list. A reliable Capitol Hill standby.",dishes:["Northwest Seasonal Menu","Weekend Brunch","Thoughtful Wine List"],address:"601 Bellevue Ave E, Seattle, WA 98102",lat:47.6224,lng:-122.3244,instagram:"harrysfinefoods",website:"https://www.harrysfinefoods.com",reservation:"Tock",phone:"(206) 432-9285",hours:"Wed-Sun 8AM-3PM & 5PM-9PM, Closed Mon-Tue"});

add({name:"Marjorie",cuisine:"New American / Global",neighborhood:"Capitol Hill",score:89,price:3,tags:["New American","Global","Date Night","Critics Pick","Local Favorites"],description:"Chef Donna Moodie's globally inspired Capitol Hill institution — 15+ years of Caribbean, Mediterranean, and Southern-accented Pacific Northwest cooking. A quiet classic.",dishes:["Plantain Fritters","Sorghum Fried Chicken","Global Small Plates"],address:"2301 E Union St Ste P, Seattle, WA 98122",lat:47.6155,lng:-122.3029,instagram:"marjorieseattle",website:"https://www.marjorierestaurant.com",reservation:"OpenTable",phone:"(206) 441-9842",hours:"Tue-Sat 5PM-10PM, Closed Sun-Mon",indicators:["women-owned","black-owned"]});

add({name:"Single Shot",cuisine:"New American",neighborhood:"Capitol Hill",score:86,price:3,tags:["New American","Brunch","Date Night","Cocktails","Local Favorites","Patio"],description:"Intimate Capitol Hill restaurant and bar — cozy wooden dining room, seasonal menu, quiet cocktails, and a loyal neighborhood following. Weekend brunch staple.",dishes:["Weekend Brunch","Seasonal Small Plates","Classic Cocktails"],address:"611 Summit Ave E, Seattle, WA 98102",lat:47.6230,lng:-122.3250,instagram:"singleshotseattle",website:"http://singleshotseattle.com",reservation:"OpenTable",phone:"(206) 420-2238",hours:"Wed-Sun 5PM-10PM, Sat-Sun 10AM-2PM, Closed Mon-Tue"});

add({name:"Palace Kitchen",cuisine:"New American",neighborhood:"Belltown",score:88,price:3,tags:["New American","Iconic","Late Night","Cocktails","Date Night","Critics Pick","Local Favorites"],description:"Tom Douglas's late-night Belltown brasserie since 1996 — open-kitchen wood-grill, applewood burgers, and a zinc bar until midnight. A Seattle dining institution.",dishes:["Applewood Grill","Late-Night Cheeseburger","Palace Cocktails"],address:"2030 5th Ave, Seattle, WA 98121",lat:47.6141,lng:-122.3404,instagram:"palacekitchen",website:"https://www.palacekitchen.com",reservation:"OpenTable",phone:"(206) 441-2888",hours:"Tue-Sat 5PM-12AM, Closed Sun-Mon",group:"Tom Douglas Restaurants"});

add({name:"Bizzarro Italian Cafe",cuisine:"Italian",neighborhood:"Wallingford",score:87,price:2,tags:["Italian","Date Night","Iconic","Local Favorites","Casual","Family Friendly"],description:"Quirky Wallingford Italian — upside-down chairs hanging from the ceiling, candle-wax dripping, and legit Italian-American cooking. A Seattle date-night eccentric since 1989.",dishes:["House-Made Pasta","Upside-Down Chairs","Classic Italian"],address:"1307 N 46th St, Seattle, WA 98103",lat:47.6613,lng:-122.3405,instagram:"bizzarroitaliancafe",website:"https://www.bizzarroitaliancafe.com",reservation:"OpenTable",phone:"(206) 632-7277",hours:"Daily 5PM-9PM"});

add({name:"Biscuit Bitch",cuisine:"Southern / Brunch",neighborhood:"Belltown",score:86,price:2,tags:["Southern","Brunch","Casual","Iconic","Local Favorites","Family Friendly"],description:"Seattle's cheeky cult-favorite biscuit-and-gravy joint. Buttermilk biscuits, smothered gravy, hashes, and all-caps Southern energy. Multiple locations; Belltown is a classic.",dishes:["Hot Mess Biscuit","Bitchwitch","Sausage Gravy"],address:"2303 3rd Ave, Seattle, WA 98121",lat:47.6147,lng:-122.3443,instagram:"biscuit_bitch",website:"https://biscuitbitch.square.site",reservation:"walk-in",phone:"(206) 728-2219",hours:"Mon-Fri 7AM-2PM, Sat-Sun 8AM-3PM",indicators:["women-owned"]});

add({name:"Kau Kau Barbeque",cuisine:"Chinese / BBQ",neighborhood:"Chinatown-International District",score:88,price:1,tags:["Chinese","BBQ","Iconic","Local Favorites","Casual","Family Friendly"],description:"Seattle's legendary Chinese BBQ since 1974 — lacquered ducks hanging in the window, BBQ pork, and shiny-skin roast duck to go or eat in. A CID rite of passage.",dishes:["BBQ Pork","Roast Duck","Hong Kong-Style BBQ"],address:"656 S King St, Seattle, WA 98104",lat:47.5989,lng:-122.3247,instagram:"kaukaubbqseattle",website:"https://kaukaubbq.com",reservation:"walk-in",phone:"(206) 399-9414",hours:"Mon,Wed-Sun 10AM-8PM, Closed Tue",indicators:["hole-in-wall"]});

add({name:"Phnom Penh Noodle House",cuisine:"Cambodian",neighborhood:"Chinatown-International District",score:89,price:1,tags:["Asian","Noodles","Family Friendly","Local Favorites","Critics Pick","Casual"],description:"Family-run Cambodian institution — reopened 2020 after 30+ year run. Phnom Penh noodle soup, loc lac beef, and the Siv family's heirloom recipes. A treasured CID return story.",dishes:["Phnom Penh Noodle Soup","Loc Lac Beef","Cambodian Heirloom Recipes"],address:"913 S Jackson St Ste A, Seattle, WA 98104",lat:47.5988,lng:-122.3216,instagram:"phnompenhnoodlehouse",website:"http://www.phnompenhnoodlehouse.com",reservation:"walk-in",phone:"(206) 785-6936",hours:"Mon-Tue,Thu-Fri 11AM-8PM, Closed Wed,Sat-Sun",indicators:["women-owned","hole-in-wall"]});

add({name:"Chan Seattle",cuisine:"Korean / New American",neighborhood:"Downtown",score:87,price:3,tags:["Korean","Asian","Date Night","Cocktails","Critics Pick","Local Favorites"],description:"Chef Heong Soon Park's elevated modern Korean. Bulgogi sliders, kimchi fried rice, seasonal banchan, and a stylish bar. Sits just inside the Paramount Hotel downtown.",dishes:["Bulgogi Sliders","Kimchi Fried Rice","Korean Small Plates"],address:"724 Pine St, Seattle, WA 98101",lat:47.6131,lng:-122.3306,instagram:"chanseattle",website:"https://chanseattle.com",reservation:"OpenTable",phone:"(425) 658-2626",hours:"Tue-Thu 4PM-9PM, Fri-Sat 4PM-10PM, Closed Sun-Mon"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 17 complete!');
