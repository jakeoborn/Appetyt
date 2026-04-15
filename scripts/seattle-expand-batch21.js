// Seattle Batch 21 — Chinatown / Pioneer Square / Wallingford / SLU / Renton / Georgetown fill + Indian/Vegan/Ice Cream
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

add({name:"Chengdu Memory",cuisine:"Chinese / Hot Pot",neighborhood:"Chinatown-International District",score:87,price:2,tags:["Chinese","Asian","Date Night","Critics Pick","Local Favorites","Family Friendly"],description:"Sichuan hot-pot and regional Chinese specialist on Jackson St. Mouth-numbing mala broths, hand-pulled noodles, and generous tableside spice. A CID favorite.",dishes:["Sichuan Hot Pot","Mala Broth","Dan Dan Noodles"],address:"520 S Jackson St, Seattle, WA 98104",lat:47.5988,lng:-122.3275,instagram:"chengdumemoryseattle",website:"https://www.chengdumemory.com",reservation:"walk-in",phone:"(206) 624-6289",hours:"Daily 11AM-10PM"});

add({name:"Musashi's",cuisine:"Japanese / Sushi",neighborhood:"Wallingford",score:85,price:2,tags:["Sushi","Japanese","Casual","Local Favorites","Family Friendly"],description:"Long-running Wallingford value sushi — generous rolls, fresh nigiri, and a loyal neighborhood following. Walk-in only; often a small wait.",dishes:["Rainbow Roll","Affordable Nigiri","Chirashi Bowl"],address:"1400 N 45th St, Seattle, WA 98103",lat:47.6613,lng:-122.3397,instagram:"musashissushi",website:"https://www.musashis-sushi.com",reservation:"walk-in",phone:"(206) 633-0212",hours:"Daily 11:30AM-2:30PM & 5PM-9PM",indicators:["hole-in-wall"]});

add({name:"Caffè Umbria",cuisine:"Italian / Cafe",neighborhood:"Pioneer Square",score:86,price:1,tags:["Italian","Bakery/Coffee","Casual","Family Friendly","Local Favorites","Patio"],description:"Authentic Italian caffè on Occidental Square. Single-origin espresso from Umbria, fresh panini, gelato, and Italian wine. A Pioneer Square coffee-lover's pilgrimage.",dishes:["Umbria Espresso","Caprese Panini","Italian Gelato"],address:"320 Occidental Ave S, Seattle, WA 98104",lat:47.5995,lng:-122.3326,instagram:"caffeumbria",website:"https://caffeumbria.com",reservation:"walk-in",phone:"(206) 624-5847",hours:"Mon-Fri 7AM-5PM, Sat 7AM-4PM, Sun 8AM-4PM"});

add({name:"Bar Harbor",cuisine:"Seafood / Wine Bar",neighborhood:"South Lake Union",score:86,price:3,tags:["Seafood","Wine Bar","Cocktails","Date Night","Oysters","Local Favorites"],description:"SLU curated wine, craft beer, and Atlantic-Northeast-inspired seafood bar. Oysters, lobster rolls, and one of the neighborhood's top cocktail menus.",dishes:["Lobster Roll","Oyster Selection","Curated Wine List"],address:"400 Fairview Ave N, Seattle, WA 98109",lat:47.6237,lng:-122.3361,instagram:"barharborseattle",website:"http://www.barharborbar.com",reservation:"OpenTable",phone:"(206) 922-3288",hours:"Mon-Fri 3PM-10PM, Sat-Sun 11AM-10PM"});

add({name:"Pabla Indian Cuisine",cuisine:"Indian / Vegetarian",neighborhood:"Renton",score:86,price:2,tags:["Indian","Vegetarian","Casual","Local Favorites","Family Friendly"],description:"Kosher-certified pure vegetarian Indian since 1998. Punjabi-leaning menu, everything vegan-friendly on request, and one of the area's most respected veg restaurants.",dishes:["Punjabi Thali","Vegetarian Buffet","Kosher-Certified Menu"],address:"364 Renton Ctr Way SW Ste C60, Renton, WA 98057",lat:47.4798,lng:-122.2203,instagram:"pablaindiancuisine",website:"https://www.pablaindian.com",reservation:"OpenTable",phone:"(425) 228-4625",hours:"Mon,Wed-Sun 11AM-2:30PM & 5PM-9PM, Closed Tue",indicators:["vegetarian"],suburb:true});

add({name:"Rondo Japanese Kitchen",cuisine:"Japanese / Izakaya",neighborhood:"Capitol Hill",score:88,price:3,tags:["Japanese","Sushi","Izakaya","Date Night","Critics Pick","Late Night","Cocktails"],description:"Broadway Capitol Hill Japanese izakaya with an ambitious tapas-style menu and excellent sake list. Oysters, sushi, yakitori — elevated neighborhood izakaya.",dishes:["Omakase Sushi","Yakitori","Sake List"],address:"224 Broadway E, Seattle, WA 98102",lat:47.6195,lng:-122.3211,instagram:"rondoseattle",website:"https://www.rondojapanesekitchen.com",reservation:"Tock",phone:"(206) 588-2051",hours:"Tue-Sun 5PM-11PM, Closed Mon"});

add({name:"Molly Moon's Homemade Ice Cream",cuisine:"Ice Cream / Dessert",neighborhood:"Wallingford",score:90,price:1,tags:["Dessert","Bakery/Coffee","Iconic","Casual","Family Friendly","Local Favorites"],description:"Seattle's iconic ice cream shop — opened 2008 as the original Wallingford scoop. Salted caramel, Scout Mint, rotating seasonal flavors. A locally beloved sustainability-first institution.",dishes:["Salted Caramel","Scout Mint","Seasonal Rotating Flavors"],address:"1622 1/2 N 45th St, Seattle, WA 98103",lat:47.6614,lng:-122.3345,instagram:"mollymoonicecream",website:"https://www.mollymoon.com",reservation:"walk-in",phone:"(206) 294-4389",hours:"Mon-Thu 12PM-10PM, Fri-Sat 12PM-11PM, Sun 12PM-10PM",indicators:["women-owned"]});

add({name:"Hello Em Việt Coffee & Roastery",cuisine:"Vietnamese / Coffee",neighborhood:"Chinatown-International District",score:89,price:1,tags:["Vietnamese","Bakery/Coffee","Casual","Local Favorites","Critics Pick"],description:"Little Saigon Vietnamese specialty coffee roastery. Cà phê sữa đá, pandan lattes, and banh mi. Woman-owned, community-rooted, and nationally acclaimed since 2021.",dishes:["Vietnamese Iced Coffee","Pandan Latte","Banh Mi"],address:"1227 S Weller St, Seattle, WA 98144",lat:47.5991,lng:-122.3178,instagram:"helloemcoffee",website:"https://www.helloem.coffee",reservation:"walk-in",phone:"(206) 323-4387",hours:"Daily 8AM-4PM",indicators:["women-owned"]});

add({name:"Georgetown Liquor Company",cuisine:"Vegan / American",neighborhood:"Georgetown",score:86,price:2,tags:["Vegetarian","American","Casual","Local Favorites","Late Night","Cocktails"],description:"100% vegan bar and restaurant in historic Georgetown. Video-game/pop-culture themed menu, huge craft beer list, and creative cocktails. A 15+ year Georgetown anchor.",dishes:["Vegan Cheesesteak","Video Game Themed Plates","Craft Beer Selection"],address:"5501 Airport Way S Ste B, Seattle, WA 98108",lat:47.5510,lng:-122.3190,instagram:"georgetownliquor",website:"https://glcseattle.com",reservation:"walk-in",phone:"(206) 402-5367",hours:"Mon 11AM-8PM, Tue-Fri 11AM-10PM, Sat 10AM-10PM, Sun 10AM-8PM",indicators:["vegetarian"]});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 21 complete!');
