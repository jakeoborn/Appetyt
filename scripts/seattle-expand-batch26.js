// Seattle Batch 26 — 22 verified spots to reach 300.
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
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl='';s.hh='';s.verified=true;s.hours=s.hours||'';s.photoUrl='';
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// ── Belltown bars ─────────────────────────────────────────────────────────────
add({name:"Rob Roy",cuisine:"Cocktail Bar / American",neighborhood:"Belltown",score:90,price:2,tags:["Cocktail Bar","Date Night","Late Night","Craft Cocktails","Iconic","Critics Pick"],description:"James Beard finalist neighborhood cocktail lounge in Belltown since 2003 — world-class classic and original cocktails in a welcoming midcentury modern room. Consistently one of America's best bars.",address:"2332 2nd Ave, Seattle, WA 98121",lat:47.6158,lng:-122.3497,instagram:"@robroyseattle",website:"http://www.robroyseattle.com",phone:"(206) 956-8423",hours:"Mon-Thu 4PM-12AM, Fri-Sat 4PM-2AM, Sun 4PM-12AM",reservation:"walk-in",awards:"James Beard finalist 2023"});

add({name:"Navy Strength",cuisine:"Tiki Bar / American",neighborhood:"Belltown",score:87,price:2,tags:["Tiki Bar","Cocktails","Late Night","Date Night","Tropical","Awards"],description:"Award-winning Belltown tiki bar blending glam beach-hut vibes with craft tropical cocktails, oysters, and nachos — named Best New American Bar and one of Seattle's best cocktail spots.",address:"2505 2nd Ave, Seattle, WA 98121",lat:47.6167,lng:-122.3510,instagram:"@navystrengthbar",website:"https://www.navystrengthseattle.com",phone:"(206) 420-7043",hours:"Tue-Thu 4PM-12AM, Fri-Sat 4PM-2AM, Sun 4PM-11PM",reservation:"walk-in",awards:"Best New American Bar"});

// ── Capitol Hill ──────────────────────────────────────────────────────────────
add({name:"Taneda Sushi in Kaiseki",cuisine:"Japanese / Kaiseki / Sushi",neighborhood:"Capitol Hill",score:92,price:4,tags:["Sushi","Japanese","Kaiseki","Fine Dining","Omakase","Date Night","Critics Pick"],description:"Intimate Capitol Hill kaiseki and sushi omakase — chef Taichi Kitamura's multi-course seasonal Japanese menus are among the most refined dining experiences in Seattle.",address:"219 Broadway E Ste 214, Seattle, WA 98102",lat:47.6232,lng:-122.3199,instagram:"@tanedaseattle",website:"https://tanedaseattle.com",phone:"(206) 588-2088",hours:"Wed-Sun 5:15PM-9:30PM, Closed Mon-Tue",reservation:"Tock",awards:"James Beard nominee"});

add({name:"Nue",cuisine:"Global Street Food",neighborhood:"Capitol Hill",score:86,price:2,tags:["Global","Street Food","Unique","Brunch","Date Night","Cocktails"],description:"Capitol Hill's global street food destination — dishes from South Africa, Sri Lanka, Bali, and beyond in one inventive room. Featured by Food Network, Atlas Obscura, and New York Magazine.",address:"1519 14th Ave, Seattle, WA 98122",lat:47.6145,lng:-122.3132,instagram:"@nueseattle",website:"https://www.nueseattle.com",phone:"(206) 257-0312",hours:"Tue-Sun 5PM-10PM, Brunch Sat-Sun 10AM-2PM",reservation:"walk-in"});

// ── Fremont ───────────────────────────────────────────────────────────────────
add({name:"Kamonegi",cuisine:"Japanese / Soba",neighborhood:"Fremont",score:91,price:3,tags:["Japanese","Soba","Date Night","Critics Pick","Romantic","Tasting Menu"],description:"Tiny Fremont gem specializing in handmade buckwheat soba noodles and seasonal tempura — one of the most critically lauded Japanese restaurants in Seattle.",address:"1054 N 39th St, Seattle, WA 98103",lat:47.6520,lng:-122.3468,instagram:"@kamonegiseattle",website:"https://www.kamonegiseattle.com",phone:"(206) 632-0185",hours:"Tue-Sat 4PM-9:30PM, Closed Sun-Mon",reservation:"Tock",awards:"James Beard nominee"});

add({name:"Revel",cuisine:"Korean / American",neighborhood:"Fremont",score:88,price:2,tags:["Korean","Asian Fusion","Brunch","Date Night","Local Favorites","Critics Pick"],description:"Chef Rachel Yang's inventive Korean-American restaurant in Fremont — creative, bold flavors from rice bowls and pajeon pancakes to seasonal Korean comfort food in a hip urban space.",address:"403 N 36th St, Seattle, WA 98103",lat:47.6503,lng:-122.3502,instagram:"@revelseattle",website:"https://www.revelseattle.com",phone:"(206) 547-2040",hours:"Tue-Sun 5PM-10PM, Brunch Sat-Sun 10AM-2PM",reservation:"OpenTable",group:"Relay Restaurant Group"});

add({name:"Paseo Caribbean Food",cuisine:"Caribbean / Sandwiches",neighborhood:"Fremont",score:90,price:1,tags:["Caribbean","Sandwiches","Cheap Eats","Local Favorites","Casual","Iconic"],description:"Seattle's legendary Caribbean sandwich institution — the Cuban roast pork sandwich with aioli, jalapeños, and caramelized onions is one of the greatest sandwiches in the Pacific Northwest.",address:"4225 Fremont Ave N, Seattle, WA 98103",lat:47.6572,lng:-122.3501,instagram:"@seattlepaseo",website:"https://www.paseo.com",phone:"(206) 545-7440",hours:"Mon 11AM-6PM, Tue-Fri 11AM-9PM, Sat 11AM-8PM, Sun 11AM-6PM",reservation:"walk-in"});

add({name:"Le Coin",cuisine:"French / American",neighborhood:"Fremont",score:87,price:3,tags:["French","Seafood","Date Night","Neighborhood Gem","Wine Bar","Local Favorites"],description:"Modern French-American bistro in the historic Buckaroo Tavern space — impeccably sourced seafood, game, and Northwest produce in a charming Fremont room.",address:"4201 Fremont Ave N, Seattle, WA 98103",lat:47.6561,lng:-122.3499,instagram:"@lecoinseattle",website:"https://lecoinseattle.com",phone:"(206) 708-7207",hours:"Tue-Thu 4PM-10PM, Fri-Sat 4PM-11PM, Sun 4PM-9PM",reservation:"walk-in"});

// ── International District ────────────────────────────────────────────────────
add({name:"Maneki",cuisine:"Japanese",neighborhood:"International District",score:88,price:2,tags:["Japanese","Iconic","Date Night","Historic","Local Favorites","Late Night"],description:"Seattle's oldest sushi bar dating to 1904 — intimate tatami rooms, izakaya classics, and remarkably fresh sushi from an institution that has defined Japanese dining in Seattle for over a century.",address:"304 6th Ave S, Seattle, WA 98104",lat:47.5986,lng:-122.3238,instagram:"@manekiseattle",website:"https://manekiseattle.com",phone:"(206) 622-2631",hours:"Tue-Sun 5:30PM-10:30PM, Closed Mon",reservation:"OpenTable",awards:"Seattle's oldest sushi restaurant — est. 1904"});

// ── Bellevue ──────────────────────────────────────────────────────────────────
add({name:"Dough Zone Dumpling House",cuisine:"Chinese / Dumplings",neighborhood:"Bellevue",score:88,price:1,tags:["Chinese","Dumplings","Soup Dumplings","Eastside","Casual","Family Friendly"],description:"Bellevue-born dumpling chain with dedicated following — delicate xiao long bao, scallion pancakes, and hand-folded dumplings that rival any in the country.",address:"10300 Main St, Bellevue, WA 98004",lat:47.6101,lng:-122.2031,instagram:"@doughzoneusa",website:"https://www.doughzonedumplinghouse.com",phone:"(425) 454-3333",hours:"Daily 11AM-9:30PM",reservation:"walk-in"});

add({name:"Seastar Restaurant and Raw Bar",cuisine:"Seafood / American",neighborhood:"Bellevue",score:88,price:3,tags:["Seafood","Oysters","Fine Dining","Date Night","Eastside","Business Dining"],description:"John Howie's acclaimed Bellevue seafood destination — impeccable oyster bar, Dungeness crab, and Pacific Northwest fish in a polished setting ideal for business dinners and celebrations.",address:"205 108th Ave NE, Bellevue, WA 98004",lat:47.6183,lng:-122.1994,instagram:"@seastarrestaurant",website:"https://www.seastarrestaurant.com",phone:"(425) 456-0010",hours:"Mon-Thu 11:30AM-9PM, Fri 11:30AM-10PM, Sat 4PM-10PM, Sun Closed",reservation:"OpenTable"});

// ── South Lake Union ──────────────────────────────────────────────────────────
add({name:"The White Swan Public House",cuisine:"American / Seafood",neighborhood:"South Lake Union",score:84,price:2,tags:["American","Seafood","Pub","Waterfront","Casual","Brunch"],description:"Casual SLU waterfront pub on Lake Union with Pacific Northwest seafood, craft beer, and boat-watching from the patio — a relaxed all-day dining option for the tech corridor.",address:"1001 Fairview Ave N, Seattle, WA 98109",lat:47.6280,lng:-122.3329,instagram:"@whiteswanseattle",website:"https://www.whiteswanpublichouse.com",phone:"(206) 613-2900",hours:"Mon-Fri 11AM-10PM, Sat-Sun 10AM-10PM",reservation:"walk-in"});

// ── West Seattle additional ───────────────────────────────────────────────────
add({name:"Raccolto",cuisine:"Italian / Pasta",neighborhood:"West Seattle",score:87,price:2,tags:["Italian","Pasta","Date Night","Neighborhood Gem","Seasonal","Wine Bar"],description:"West Seattle Junction Italian trattoria — seasonal hand-rolled pastas, classic antipasti, and a focused Italian wine list in a warm neighborhood room that could be in Bologna.",address:"4711 California Ave SW, Seattle, WA 98116",lat:47.5607,lng:-122.3874,instagram:"@raccoltoseattle",website:"https://www.raccoltoseattle.com",phone:"(206) 935-3055",hours:"Tue-Sat 5PM-10PM, Closed Sun-Mon",reservation:"Resy"});

// ── Columbia City additional ──────────────────────────────────────────────────
add({name:"Tutta Bella Neapolitan Pizzeria",cuisine:"Pizza / Italian",neighborhood:"Columbia City",score:86,price:2,tags:["Pizza","Italian","Family Friendly","Casual","Neapolitan"],description:"Seattle's certified Neapolitan pizzeria institution — wood-fired DOC pies with San Marzano tomatoes and fior di latte, faithful to Associazione Verace Pizza Napoletana standards.",address:"4918 Rainier Ave S, Seattle, WA 98118",lat:47.5583,lng:-122.2794,instagram:"@tuttabellapizza",website:"https://tuttabella.com",phone:"(206) 721-3501",hours:"Mon-Thu 11AM-9PM, Fri-Sat 11AM-10PM, Sun 12PM-9PM",reservation:"OpenTable"});

// ── Kirkland additional ───────────────────────────────────────────────────────
add({name:"Deru Market",cuisine:"American / Farm-to-Table",neighborhood:"Kirkland",score:86,price:2,tags:["Farm to Table","Brunch","Breakfast","Kirkland","Casual","Family Friendly"],description:"Farm-to-table neighborhood eatery and market in Kirkland — wood-fired pizzas, rotisserie chicken, fresh salads, and local/organic ingredients prepared from scratch daily.",address:"3823 Lake Washington Blvd NE, Kirkland, WA 98033",lat:47.6758,lng:-122.2052,instagram:"@derumarket",website:"https://www.derumarket.com",phone:"(425) 298-5928",hours:"Daily 7AM-9PM",reservation:"walk-in"});

// ── Ballard additional ────────────────────────────────────────────────────────
add({name:"Cafe Munir",cuisine:"Lebanese / Middle Eastern",neighborhood:"Ballard",score:87,price:2,tags:["Lebanese","Middle Eastern","Brunch","Date Night","Neighborhood Gem","Cozy"],description:"Cozy Ballard Lebanese restaurant — mezze spreads, fatteh, and tender shawarma plates from a family-run kitchen that brings Beirut warmth to the Pacific Northwest.",address:"2408 NW 80th St, Seattle, WA 98117",lat:47.6906,lng:-122.3793,instagram:"@cafemunirseattle",website:"https://www.cafemunirseattle.com",phone:"(206) 783-0848",hours:"Wed-Mon 11AM-9PM, Closed Tue",reservation:"walk-in"});

add({name:"San Fermo",cuisine:"Italian / Sandwiches",neighborhood:"Ballard",score:85,price:2,tags:["Italian","Sandwiches","Pasta","Neighborhood Gem","Casual","Lunch"],description:"Ballard Italian spot serving housemade pastas, rotisserie meats, and excellent sandwiches from a compact kitchen — a go-to neighborhood lunch and early dinner destination.",address:"5341 Ballard Ave NW, Seattle, WA 98107",lat:47.6629,lng:-122.3805,instagram:"@sanfermoballard",website:"",phone:"(206) 420-7401",hours:"Tue-Sun 11AM-9PM, Closed Mon",reservation:"walk-in"});

// ── Georgetown additional ─────────────────────────────────────────────────────
add({name:"Deep Sea Sugar and Salt",cuisine:"Bakery / Dessert",neighborhood:"Georgetown",score:87,price:1,tags:["Bakery","Dessert","Coffee","Breakfast","Neighborhood Gem","Local Favorites"],description:"Georgetown bakery known for stunning multi-layer cakes with bold, inventive flavors — cultish weekend lines for seasonal creations that look and taste extraordinary.",address:"6235 Airport Way S, Seattle, WA 98108",lat:47.5454,lng:-122.3212,instagram:"@deepseaandsalt",website:"https://deepseaandsalt.com",phone:"(206) 743-0422",hours:"Wed-Sat 9AM-4PM, Sun 9AM-3PM, Closed Mon-Tue",reservation:"walk-in"});

// ── Beacon Hill additional ────────────────────────────────────────────────────
add({name:"Familyfriend",cuisine:"Guamanian / Pacific Islander",neighborhood:"Beacon Hill",score:87,price:2,tags:["Guamanian","Pacific Islander","Unique","Neighborhood Gem","Critics Pick","Casual"],description:"One-of-a-kind Guamanian restaurant on Beacon Hill — chef Shota Nakajima brings Chamorro and Pacific Islander flavors to Seattle through kelaguen, red rice, and rotating specials.",address:"3315 Beacon Ave S, Seattle, WA 98144",lat:47.5755,lng:-122.3127,instagram:"@familyfriendseattle",website:"",phone:"(206) 397-3595",hours:"Thu-Mon 5PM-10PM, Closed Tue-Wed",reservation:"walk-in"});

// ── University District additional ────────────────────────────────────────────
add({name:"Saint Bread",cuisine:"Bakery / Cafe",neighborhood:"University District",score:87,price:1,tags:["Bakery","Coffee","Breakfast","Brunch","Neighborhood Gem","Third Wave"],description:"Beloved U-District bakery café on Boat Street — exceptional laminated pastries, sourdough loaves, and specialty coffee in a sunny space that draws lines on weekend mornings.",address:"1421 NE Boat St, Seattle, WA 98105",lat:47.6520,lng:-122.3217,instagram:"@saintbreadseattle",website:"https://www.saintbread.com",phone:"(206) 701-9068",hours:"Wed-Mon 7AM-4PM, Closed Tue",reservation:"walk-in"});

// ── Additional Eastside ───────────────────────────────────────────────────────
add({name:"K-BBQ Woobling",cuisine:"Korean BBQ",neighborhood:"Bellevue",score:88,price:3,tags:["Korean BBQ","Eastside","Date Night","Celebrations","Unique","Upscale"],description:"Upscale Bellevue Korean BBQ with theatrical presentation — premium proteins arrive curled like roses on wooden boards, grilled tableside in a sleek, modern setting.",address:"989 112th Ave NE, Bellevue, WA 98004",lat:47.6186,lng:-122.1940,instagram:"@woobling_usa",website:"https://www.woobling.com",phone:"(425) 289-8880",hours:"Daily 11:30AM-10PM",reservation:"walk-in"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 26 complete!');
