// Seattle Batch 15 — Low-filter boosters (Ethiopian, Persian, Brewery, BBQ, Indian, Turkish, Caribbean)
// + neighborhood fill. Verified April 2026.
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

add({name:"Meskel Ethiopian Restaurant",cuisine:"Ethiopian",neighborhood:"Central District",score:87,price:2,tags:["Ethiopian","African","Casual","Local Favorites","Critics Pick","Vegetarian"],description:"Central District staple since 1995 serving traditional injera-and-stews platters. Kitfo, doro wat, generous vegetarian platters, and a warm family-run dining room. One of Seattle's longest-running Ethiopian restaurants.",dishes:["Combo Platter","Kitfo","Doro Wat"],address:"2605 E Cherry St, Seattle, WA 98122",lat:47.6092,lng:-122.2988,instagram:"meskel206",website:"https://meskelethiopian.com",reservation:"walk-in",phone:"(206) 860-1724",hours:"Tue-Sun 12PM-10:30PM, Closed Mon",indicators:["women-owned","vegetarian"]});

add({name:"Persepolis Grill",cuisine:"Persian",neighborhood:"University District",score:86,price:2,tags:["Persian","Middle Eastern","Casual","Local Favorites","Family Friendly","Halal"],description:"U District authentic Persian kabob house — flame-grilled koobideh, saffron rice, and house-made doogh. Halal kitchen, homestyle Iranian cooking. A U-Dub grad-student pilgrimage spot.",dishes:["Koobideh Kabob","Saffron Rice","Ghormeh Sabzi"],address:"5517 University Way NE, Seattle, WA 98105",lat:47.6692,lng:-122.3130,instagram:"persepolisgrill",website:"https://www.persepolis-grill.com",reservation:"walk-in",phone:"(206) 524-3434",hours:"Sun-Thu 11AM-9PM, Fri-Sat 11AM-10PM",indicators:["halal"]});

add({name:"Fremont Brewing",cuisine:"Brewery",neighborhood:"Fremont",score:90,price:1,tags:["Brewery","Casual","Local Favorites","Family Friendly","Patio","Iconic"],description:"Seattle's legendary Fremont beer garden. Interurban IPA, Lush IPA, Bourbon Abominable. Dog-friendly, family-friendly year-round beer garden. Sister taproom in Ballard.",dishes:["Interurban IPA","Lush IPA","Bourbon Abominable"],address:"1050 N 34th St, Seattle, WA 98103",lat:47.6484,lng:-122.3357,instagram:"fremontbrewing",website:"https://www.fremontbrewing.com",reservation:"walk-in",phone:"(206) 420-2407",hours:"Daily 11AM-9PM",indicators:["brewery"]});

add({name:"Reuben's Brews",cuisine:"Brewery",neighborhood:"Ballard",score:89,price:1,tags:["Brewery","Casual","Local Favorites","Family Friendly","Patio","Awards"],description:"Ballard family-run award-winning brewery. Multiple GABF medals, Hazealicious IPA, crisps, pilsners, and a patio beer garden. A Ballard cornerstone.",dishes:["Hazealicious IPA","Award-Winning Pilsner","Barrel-Aged Stouts"],address:"5010 14th Ave NW, Seattle, WA 98107",lat:47.6642,lng:-122.3677,instagram:"reubensbrews",website:"https://reubensbrews.com",reservation:"walk-in",phone:"(206) 784-2859",hours:"Daily 11AM-10PM",awards:"Multiple GABF Medals",indicators:["brewery"]});

add({name:"Holy Mountain Brewing",cuisine:"Brewery",neighborhood:"Interbay",score:91,price:2,tags:["Brewery","Critics Pick","Local Favorites","Casual","Date Night"],description:"Cult-status Seattle brewery focusing on barrel-aged sours, saisons, and hop-forward lagers. Interbay taproom is 21+ with rotating drafts and bottle shop. One of the most respected craft breweries in the Pacific Northwest.",dishes:["Barrel-Aged Sours","Belgian Saisons","Hop-Forward Lagers"],address:"1421 Elliott Ave W, Seattle, WA 98119",lat:47.6340,lng:-122.3813,instagram:"holymountainbrewing",website:"https://holymountainbrewing.com",reservation:"walk-in",phone:"(206) 457-5279",hours:"Mon-Thu 2PM-9PM, Fri 12PM-9PM, Sat-Sun 12PM-9PM",indicators:["brewery"]});

add({name:"Cafe Turko",cuisine:"Turkish / Mediterranean",neighborhood:"Fremont",score:87,price:2,tags:["Middle Eastern","Mediterranean","Casual","Date Night","Local Favorites","Halal","Vegetarian","Family Friendly"],description:"Fremont family-run Turkish cafe — halal kabobs, meze spreads, Turkish coffee, and extensive vegetarian/vegan options. Warm colorful dining room and hospitable service.",dishes:["Iskender Kebab","Meze Platter","Turkish Coffee"],address:"750 N 34th St, Seattle, WA 98103",lat:47.6484,lng:-122.3415,instagram:"cafeturko",website:"https://cafeturko.com",reservation:"OpenTable",phone:"(206) 284-9954",hours:"Tue-Thu,Sun 11AM-9PM, Fri 11AM-9:30PM, Sat 10AM-9:30PM, Closed Mon",indicators:["halal","vegetarian"]});

add({name:"Jack's BBQ",cuisine:"BBQ / Texas",neighborhood:"SoDo",score:88,price:2,tags:["BBQ","Southern","Casual","Local Favorites","Critics Pick","Family Friendly"],description:"Central-Texas BBQ HQ in SoDo. House-smoked brisket, beef ribs, and sausage. Authentic Lockhart-style and Seattle's go-to Texas BBQ. Second location in South Lake Union.",dishes:["Smoked Brisket","Beef Ribs","Texas Sausage"],address:"3924 Airport Way S, Seattle, WA 98108",lat:47.5767,lng:-122.3156,instagram:"jacksbbqseattle",website:"https://jacksbbq.com/sodo",reservation:"walk-in",phone:"(206) 467-4038",hours:"Mon-Fri 7AM-10AM & 11AM-8PM (Fri til 9), Sat 10AM-9PM, Sun 10AM-8PM"});

add({name:"Roti Cuisine of India",cuisine:"Indian",neighborhood:"South Lake Union",score:87,price:2,tags:["Indian","Casual","Local Favorites","Family Friendly","Vegetarian","Halal"],description:"SLU modern Indian — tandoor classics, biryanis, and a big vegetarian menu. Sister location in Lower Queen Anne. A reliable go-to for SLU office crowd lunches and weekend curries.",dishes:["Chicken Tikka Masala","Lamb Biryani","Vegetarian Platter"],address:"501 Fairview Ave N Ste 121, Seattle, WA 98109",lat:47.6231,lng:-122.3360,instagram:"rotiindiancuisine",website:"https://www.rotirestaurantseattle.com",reservation:"OpenTable",phone:"(206) 216-7684",hours:"Daily 11AM-9:30PM",indicators:["halal","vegetarian"]});

add({name:"Dick's Drive-In",cuisine:"American / Burgers",neighborhood:"Capitol Hill",score:87,price:1,tags:["Burgers","Iconic","Late Night","Casual","Tourist Essential","Family Friendly","Local Favorites"],description:"Seattle's iconic burger drive-in since 1954 — the Capitol Hill location across from the light rail station. The Deluxe, fries, and hand-dipped shakes. A Seattle rite of passage.",dishes:["The Deluxe","Hand-Dipped Shakes","Fries"],address:"115 Broadway E, Seattle, WA 98102",lat:47.6183,lng:-122.3210,instagram:"dicksdrivein",website:"https://ddir.com/locations/broadway",reservation:"walk-in",phone:"(206) 323-1300",hours:"Daily 10:30AM-2AM",awards:"Seattle Icon — operating since 1954"});

add({name:"Paseo",cuisine:"Caribbean / Cuban",neighborhood:"Fremont",score:89,price:1,tags:["Caribbean","Sandwiches","Iconic","Casual","Local Favorites","Critics Pick"],description:"Seattle's legendary Cuban-Caribbean sandwich joint. The Caribbean Roast sandwich — slow-roasted pork shoulder, caramelized onions, pickled jalapeños on a crusty baguette. A Seattle bucket-list sandwich.",dishes:["Caribbean Roast","Mojito Shrimp","Caramelized Onions"],address:"4225 Fremont Ave N, Seattle, WA 98103",lat:47.6580,lng:-122.3499,instagram:"seattlepaseo",website:"http://seattlepaseo.com",reservation:"walk-in",phone:"(206) 545-7440",hours:"Mon,Sun 11AM-6PM, Tue-Fri 11AM-9PM, Sat 11AM-8PM"});

add({name:"Kathmandu Momocha",cuisine:"Nepali / Himalayan",neighborhood:"South Lake Union",score:87,price:2,tags:["Asian","Dumplings","Casual","Local Favorites","Critics Pick","Vegetarian"],description:"Nepali momo house with SLU, Capitol Hill, and Queen Anne locations. Hand-pleated steamed and chili momos, Himalayan thukpa noodles, and thali platters. One of Seattle's best dumpling destinations.",dishes:["Steamed Momos","Jhol Momos","Himalayan Thali"],address:"200 Westlake Ave N, Seattle, WA 98109",lat:47.6192,lng:-122.3389,instagram:"kathmandumomocha",website:"https://katmandumomocha.com",reservation:"walk-in",phone:"(206) 397-4170",hours:"Mon-Sun 11AM-9PM",indicators:["vegetarian"]});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 15 complete!');
