// Seattle Batch 4 — Fremont, Wallingford, International District/Chinatown
// All verified individually via Yelp/official sites/Infatuation/Seattle Met
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

// === FREMONT ===
add({name:"Kamonegi",cuisine:"Japanese / Soba",neighborhood:"Fremont",score:92,price:3,tags:["Japanese","Date Night","Critics Pick","Local Favorites"],description:"Tiny Fremont restaurant specializing in handmade ni-hachi soba noodles and seasonal tempura. Chef Mutsuko Soma's intimate soba-focused spot is perfect for a special night out. Fresh sea urchin and marinated ikura are standouts.",dishes:["Handmade Soba","Seasonal Tempura","Sea Urchin"],address:"1054 N 39th St, Seattle, WA 98103",lat:47.6516,lng:-122.3439,instagram:"kamonegiseattle",website:"https://www.kamonegiseattle.com",reservation:"Tock",phone:"(206) 632-0185",hours:"Tue-Sat 4PM-9:30PM"});

add({name:"Local Tide",cuisine:"Seafood",neighborhood:"Fremont",score:91,price:2,tags:["Seafood","Local Favorites","Critics Pick","Casual"],description:"Fremont seafood spot known for innovative Pacific Northwest dishes. Highlights range from pork fat-laced shrimp toast to a mayo-y Dungeness crab roll. Casual counter service with creative daily specials.",dishes:["Dungeness Crab Roll","Shrimp Toast","Daily Seafood Specials"],address:"401 N 36th St Suite 103, Seattle, WA 98103",lat:47.6519,lng:-122.3539,instagram:"localtide",website:"https://www.localtide.com",reservation:"walk-in",phone:"(206) 420-4685",hours:"Tue-Sat 11AM-8PM, Sun 11AM-4PM"});

add({name:"Fremont Bowl",cuisine:"Japanese / Donburi",neighborhood:"Fremont",score:88,price:2,tags:["Japanese","Casual","Local Favorites"],description:"Japanese homestyle comfort food specializing in donburi rice bowls. Consistently tender salmon and zuke maguro on top of rice. A Fremont neighborhood staple with seafood, marinated meats, and vegetarian options.",dishes:["Salmon Donburi","Zuke Maguro","Chirashi Bowl"],address:"4258 Fremont Ave N, Seattle, WA 98103",lat:47.6577,lng:-122.3501,instagram:"fremontbowl",website:"https://fremontbowl.com",reservation:"walk-in",phone:"(206) 504-3095"});

add({name:"Tivoli",cuisine:"Pizza / Italian",neighborhood:"Fremont",score:88,price:1,tags:["Pizza","Casual","Local Favorites","Critics Pick"],description:"Neighborhood Italian-American pizzeria in Fremont making what many call the best slice of pepperoni pizza in town. Collaboration between the folks behind Post Alley Pizza and Saint Bread. Pizza and sandwiches.",dishes:["Pepperoni Slice","Italian Sandwiches","Sicilian Pizza"],address:"730 N 34th St, Seattle, WA 98103",lat:47.6496,lng:-122.3485,instagram:"tivoli.in.seattle",website:"https://www.tivoliseattle.com",reservation:"walk-in",phone:"(206) 535-6054",hours:"Mon-Fri 11:30AM-9PM, Sat 5PM-9PM, Sun 3PM-8PM"});

// === WALLINGFORD ===
add({name:"Atoma",cuisine:"New American / Vegetarian",neighborhood:"Wallingford",score:91,price:3,tags:["New American","Vegetarian","Date Night","Critics Pick","Local Favorites"],description:"Chef-driven restaurant in a sage-walled craftsman space in Wallingford. Fine-dining feel but fun, with creative vegetarian dishes leading the way. Seasonal menu in a welcoming space.",dishes:["Seasonal Vegetarian","Creative Tasting","Chef's Menu"],address:"1411 N 45th St, Seattle, WA 98103",lat:47.6612,lng:-122.3392,instagram:"atoma_seattle",website:"https://www.atomaseattle.com",reservation:"Resy",phone:"(206) 420-1041"});

add({name:"Hamsa",cuisine:"Palestinian / Middle Eastern",neighborhood:"Wallingford",score:89,price:2,tags:["Middle Eastern","Local Favorites","Critics Pick","Casual"],description:"Palestinian counter in Wallingford specializing in sandwiches with za'atar-dusted akawi, char-smooched beef kufta, and crisp falafel patties. Underrepresented cuisine in Seattle done right.",dishes:["Akawi Sandwich","Beef Kufta","Falafel"],address:"2313 N 45th St, Seattle, WA 98103",lat:47.6613,lng:-122.3325,instagram:"hamsa.seattle",website:"https://hamsa.toast.site",reservation:"walk-in",phone:"(206) 773-9230",hours:"Mon-Thu 10AM-8PM, Fri-Sun 9AM-9PM"});

add({name:"Sisi Kay Thai Eatery & Bar",cuisine:"Thai",neighborhood:"Wallingford",score:87,price:2,tags:["Thai","Local Favorites","Casual"],description:"Two-story Wallingford Thai restaurant (formerly May Restaurant) with punchy noodles and thick, vibrant curries. Roasted duck curry is an instant mood-booster. Run by the same family for over a decade.",dishes:["Roasted Duck Curry","Pad See Ew","Thai Noodles"],address:"1612 N 45th St, Seattle, WA 98103",lat:47.6613,lng:-122.3379,instagram:"sisikaythai",website:"https://sisikayseattle.com",reservation:"walk-in",phone:"(206) 659-4382",hours:"Mon-Fri 11AM-9:30PM, Sat 12PM-10PM, Sun 12PM-9:30PM"});

// === INTERNATIONAL DISTRICT / CHINATOWN ===
add({name:"Tai Tung",cuisine:"Chinese / Cantonese",neighborhood:"Chinatown-International District",score:87,price:1,tags:["Chinese","Iconic","Local Favorites","Casual"],description:"Seattle's oldest Chinese restaurant, opened in 1935. Bruce Lee's favorite spot when he lived in Seattle. Family-style wonton soup, almond chicken, and classic Cantonese-American comfort food run by the Chan family since 1979.",dishes:["Wonton Soup","Almond Chicken","Bruce Lee's Favorites"],address:"655 S King St, Seattle, WA 98104",lat:47.5984,lng:-122.3233,instagram:"",website:"https://www.taitungrestaurant.com",reservation:"walk-in",phone:"(206) 622-7372"});

add({name:"Maneki",cuisine:"Japanese / Sushi",neighborhood:"Chinatown-International District",score:89,price:2,tags:["Japanese","Sushi","Iconic","Local Favorites","Date Night"],description:"Seattle's oldest Japanese restaurant, opened in 1904 — the first sushi bar in the city. Originally built in Nihonmachi to resemble a Japanese castle. Traditional Japanese cuisine in the CID for over 120 years.",dishes:["Sushi","Japanese Classics","Historic Dining"],address:"304 6th Ave S, Seattle, WA 98104",lat:47.5997,lng:-122.3261,instagram:"manekiseattle",website:"https://manekiseattle.com",reservation:"OpenTable",phone:"",hours:"Tue-Sun 4:30PM-8PM"});

add({name:"Dough Zone Dumpling House",cuisine:"Chinese / Dumplings",neighborhood:"Chinatown-International District",score:89,price:2,tags:["Chinese","Dumplings","Local Favorites","Casual"],description:"Small Seattle-based chain serious about xiao long bao, buns, and noodles. Signature Q-bao pork buns seared in a pan are a must-order, alongside juicy soup dumplings and lacy pot stickers. Rooted in Washington since 2014.",dishes:["Q-Bao Pork Buns","Xiao Long Bao","Pot Stickers"],address:"504 5th Ave S #109, Seattle, WA 98104",lat:47.5988,lng:-122.3266,instagram:"doughzone",website:"https://www.doughzonedumplinghouse.com",reservation:"walk-in",phone:"(206) 285-9999"});

add({name:"Pho Bac Sup Shop",cuisine:"Vietnamese",neighborhood:"Chinatown-International District",score:89,price:1,tags:["Vietnamese","Local Favorites","Critics Pick","Casual"],description:"Iconic Vietnamese pho shop from the Pham family (circa 1982). Red A-frame building on Jackson with a constant cloud of broth steam and very happy-sounding slurps. The best place for restorative hot pho in Seattle.",dishes:["Beef Pho","Oxtail Pho","Vietnamese Classics"],address:"1240 S Jackson St, Seattle, WA 98144",lat:47.5991,lng:-122.3140,instagram:"phobacseattle",website:"https://www.thephobac.com",reservation:"walk-in",phone:"(206) 568-0882",hours:"Daily 10AM-9PM"});

add({name:"Mike's Noodle House",cuisine:"Cantonese / Chinese",neighborhood:"Chinatown-International District",score:88,price:1,tags:["Chinese","Local Favorites","Casual","Critics Pick"],description:"Authentic Cantonese noodle house in Chinatown-International District. Wonton noodle soup called 'perfection' by Seattle Magazine. Cash only. Congee, dumplings, egg noodles, and youtiao — old-school Hong Kong-style comfort.",dishes:["Wonton Noodle Soup","Congee","Beef Brisket Noodles"],address:"418 Maynard Ave S, Seattle, WA 98104",lat:47.5981,lng:-122.3263,instagram:"",website:"https://mikesnoodlehouse.ca",reservation:"walk-in",phone:"(206) 389-7099"});

add({name:"Jade Garden",cuisine:"Chinese / Dim Sum",neighborhood:"Chinatown-International District",score:86,price:2,tags:["Chinese","Dim Sum","Local Favorites","Brunch"],description:"Leading dim sum restaurant in the International District serving authentic Hong Kong-style dim sum at affordable prices. Cart service available. Locals' go-to for weekend dim sum brunch.",dishes:["Dim Sum","Har Gow","Shumai"],address:"424 7th Ave S, Seattle, WA 98104",lat:47.5988,lng:-122.3245,instagram:"",website:"",reservation:"walk-in",phone:"(206) 622-8181",hours:"Daily 9:30AM-7PM"});

add({name:"Biang Biang Noodles",cuisine:"Chinese / Xi'an",neighborhood:"Capitol Hill",score:87,price:2,tags:["Chinese","Noodles","Local Favorites","Casual"],description:"Hand-pulled Xi'an biang biang noodles on East Pike. Wide belt noodles with chili oil and spicy cumin lamb. Authentic Northwestern Chinese cuisine in Capitol Hill.",dishes:["Biang Biang Noodles","Spicy Cumin Lamb","Hand-Pulled Noodles"],address:"601 E Pike St, Unit 100, Seattle, WA 98122",lat:47.6143,lng:-122.3215,instagram:"biangbiangnoodles_sea",website:"https://www.biangbiangnoodles.com",reservation:"walk-in",phone:"(206) 809-8999",hours:"Daily 11:30AM-9PM"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 4 complete!');
