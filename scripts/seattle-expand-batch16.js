// Seattle Batch 16 — Low-coverage neighborhood fills + Pike Place depth
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

add({name:"Willmott's Ghost",cuisine:"Italian / Pizza",neighborhood:"Denny Triangle",score:89,price:3,tags:["Italian","Pizza","Date Night","Critics Pick","Iconic","Patio"],description:"Chef Renee Erickson's Roman-style pizza and aperitivo bar at the base of the Amazon Spheres. Roman pizza al taglio, seasonal antipasti, and beautifully designed plant-filled space.",dishes:["Roman Pizza al Taglio","Aperitivo Cocktails","Seasonal Antipasti"],address:"1001 6th Ave, Seattle, WA 98101",lat:47.6153,lng:-122.3383,instagram:"willmottsghost",website:"https://willmottsghost.com",reservation:"OpenTable",phone:"(206) 371-1159",hours:"Mon-Fri 11AM-10PM, Sat-Sun 11AM-10PM",group:"Sea Creatures"});

add({name:"Xi'an Noodles",cuisine:"Chinese / Noodles",neighborhood:"University District",score:88,price:1,tags:["Chinese","Noodles","Casual","Local Favorites","Critics Pick","Family Friendly"],description:"Hand-pulled Biang Biang Noodles specialist — Xi'an-style wide belt noodles with cumin lamb, tangy spicy chili sauces, and hand-pulled dumplings. Fast, inexpensive, and consistently excellent.",dishes:["Biang Biang Noodles","Cumin Lamb","Hand-Pulled Dumplings"],address:"5259 University Way NE, Seattle, WA 98105",lat:47.6669,lng:-122.3125,instagram:"xiannoodlesseattle",website:"https://xiannoodles.com",reservation:"walk-in",phone:"(206) 522-8888",hours:"Daily 11AM-9PM",indicators:["hole-in-wall"]});

add({name:"Chiang's Gourmet",cuisine:"Chinese / Dim Sum",neighborhood:"Lake City",score:86,price:2,tags:["Chinese","Dim Sum","Family Friendly","Casual","Local Favorites","Vegetarian"],description:"Lake City Chinese institution — daily dim sum until 2:30 PM and a massive Sichuan-Taiwanese dinner menu. A longtime neighborhood favorite far from the crowd.",dishes:["Dim Sum Carts","Salt & Pepper Shrimp","Dry-Fried Green Beans"],address:"7845 Lake City Way NE, Seattle, WA 98115",lat:47.6871,lng:-122.3016,instagram:"chiangsgourmet",website:"http://www.chiangs-gourmet.com",reservation:"walk-in",phone:"(206) 527-8888",hours:"Mon,Wed-Thu 11:30AM-9PM, Fri 11:30AM-9:30PM, Sat 10:30AM-9:30PM, Sun 10:30AM-9PM, Closed Tue"});

add({name:"Il Bistro",cuisine:"Italian",neighborhood:"Pike Place Market",score:88,price:3,tags:["Italian","Date Night","Iconic","Late Night","Cocktails","Tourist Essential"],description:"Cobblestone-alley romantic Italian at Pike Place since 1975. Candlelit dining room, handmade pasta, a 300-bottle Italian wine list, and signature martinis. Open late until 2 AM.",dishes:["Rack of Lamb","Handmade Pasta","Il Bistro Martini"],address:"93 Pike St Ste A, Seattle, WA 98101",lat:47.6097,lng:-122.3422,instagram:"pikeplaceilbistro",website:"https://www.ilbistro.net",reservation:"OpenTable",phone:"(206) 682-3049",hours:"Daily 5PM-2AM"});

add({name:"The Athenian Seafood Restaurant & Bar",cuisine:"Seafood / American",neighborhood:"Pike Place Market",score:83,price:2,tags:["Seafood","Iconic","Tourist Essential","Casual","Family Friendly","Local Favorites"],description:"Pike Place Market's historic 1909 restaurant — the diner from Sleepless in Seattle. Pacific Northwest seafood, fish and chips, and one of the best bay-view dining rooms in the city.",dishes:["Pan-Fried Oysters","Fish & Chips","Sleepless in Seattle Booth"],address:"1517 Pike Pl, Seattle, WA 98101",lat:47.6089,lng:-122.3405,instagram:"athenianseafood",website:"https://athenianseattle.com",reservation:"OpenTable",phone:"(206) 624-7166",hours:"Daily 10AM-8PM",awards:"Operating at Pike Place since 1909"});

add({name:"Ballard Pizza Company",cuisine:"Pizza / Italian",neighborhood:"Ballard",score:86,price:2,tags:["Pizza","Italian","Casual","Local Favorites","Family Friendly","Happy Hour"],description:"Ethan Stowell's Ballard pizzeria — Roman-style pizza by the slice or whole, craft beer, and a lively neighborhood vibe on Ballard Ave. Sister locations in Frelard and Woodinville.",dishes:["Roman-Style Pizza","Craft Beer Selection","Happy Hour Slices"],address:"5205 Ballard Ave NW, Seattle, WA 98107",lat:47.6684,lng:-122.3827,instagram:"ballardpizzaco",website:"https://ballardpizzacompany.com",reservation:"walk-in",phone:"(206) 946-9960",hours:"Mon-Thu 4PM-9PM, Fri 4PM-12AM, Sat 11AM-12AM, Sun 11AM-9PM",group:"Ethan Stowell Restaurants"});

add({name:"Japonessa Sushi Cocina",cuisine:"Japanese / Sushi",neighborhood:"Downtown",score:86,price:3,tags:["Sushi","Japanese","Date Night","Late Night","Cocktails","Local Favorites","Tourist Essential"],description:"Latin-Japanese fusion sushi next to Pike Place Market. Creative rolls, sashimi, late-night lounge, and happy hour. A reliable Seattle downtown sushi fix with a lively bar scene.",dishes:["Bella Vista Roll","Pike Place Roll","Late-Night Sushi"],address:"1400 1st Ave, Seattle, WA 98101",lat:47.6082,lng:-122.3395,instagram:"japonessasushicocina",website:"https://seattle.japonessa.com",reservation:"OpenTable",phone:"(206) 971-7979",hours:"Sun-Thu 11AM-11PM, Fri-Sat 11AM-12AM"});

add({name:"Queen Bee Cafe",cuisine:"Cafe / Brunch",neighborhood:"Clyde Hill",score:84,price:2,tags:["Brunch","Bakery/Coffee","Casual","Local Favorites","Family Friendly","Patio"],description:"Woman-founded Eastside cafe on Clyde Hill. Honey-focused treats, breakfast sandwiches, scones, and proceeds support a foster-care grant program. Sister Kirkland location.",dishes:["Honey Sticky Buns","Breakfast Sandwiches","Daily Scones"],address:"8805 Points Dr NE, Clyde Hill, WA 98004",lat:47.6341,lng:-122.2180,instagram:"queenbeecafes",website:"https://www.queenbeecafe.com",reservation:"walk-in",phone:"(425) 362-6178",hours:"Daily 7AM-2PM",indicators:["women-owned"],suburb:true});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 16 complete!');
