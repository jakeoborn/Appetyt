// Seattle Batch 5 — Bakeries, Brunch, Ramen, Breweries
// All verified via Yelp/official sites/Infatuation
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

// === BAKERIES ===
add({name:"Bakery Nouveau",cuisine:"Bakery / French",neighborhood:"West Seattle",score:92,price:1,tags:["Bakery/Coffee","Iconic","Local Favorites","Critics Pick"],description:"Award-winning French bakery opened 2006 by pastry chef William Leaman, gold medal captain of Bread Bakers Guild Team USA at 2005 Coupe du Monde. Famous twice-baked croissants, macarons, and artisan breads.",dishes:["Twice-Baked Croissant","Macarons","Artisan Breads"],address:"4737 California Ave SW, Seattle, WA 98116",lat:47.5613,lng:-122.3866,instagram:"bakerynouveau",website:"https://bakerynouveau.com",reservation:"walk-in",phone:"(206) 923-0534"});

add({name:"Sea Wolf Bakers",cuisine:"Bakery",neighborhood:"Fremont",score:91,price:1,tags:["Bakery/Coffee","Local Favorites","Critics Pick"],description:"Fremont sourdough bakery featured in Food & Wine's '100 Best Bakeries in America.' Chocolate chip cookie balances brown butter, dark chocolate, oats, and sea salt. Artisan breads and pastries.",dishes:["Chocolate Chip Cookie","Sourdough","Morning Buns"],address:"3617 Stone Way N, Seattle, WA 98103",lat:47.6503,lng:-122.3421,instagram:"seawolfbakers",website:"https://www.seawolfbakers.com",reservation:"walk-in",phone:"(206) 360-0001",hours:"Daily 7AM-6PM"});

add({name:"Temple Pastries",cuisine:"Bakery / Pastries",neighborhood:"Central District",score:90,price:1,tags:["Bakery/Coffee","Local Favorites","Critics Pick"],description:"Central District bakery renowned for flaky, buttery croissants and cruffins. Star of the show is a variety of filled croissants — flavors vary daily. Chef-driven pastry program.",dishes:["Cruffins","Filled Croissants","Kouign-Amann"],address:"2524 S Jackson St, Seattle, WA 98144",lat:47.5994,lng:-122.2989,instagram:"temple_pastries",website:"https://templepastries.com",reservation:"walk-in",phone:"(206) 408-4131",hours:"Mon-Fri 7AM-3PM"});

add({name:"Fuji Bakery",cuisine:"Japanese-French Bakery",neighborhood:"Chinatown-International District",score:89,price:1,tags:["Bakery/Coffee","Japanese","Local Favorites"],description:"Japanese-French bakery in the International District specializing in handcrafted pure butter croissants and French pastries with Asian fusion flavors. Known for anpan, matcha pastries, and strawberry shortcake.",dishes:["Anpan","Matcha Croissant","Japanese Strawberry Shortcake"],address:"526 S King St, Seattle, WA 98104",lat:47.5986,lng:-122.3253,instagram:"fujibakery",website:"https://www.fujibakeryinc.com",reservation:"walk-in",phone:"(206) 623-4050"});

// === BRUNCH ===
add({name:"Portage Bay Cafe",cuisine:"Breakfast / Brunch",neighborhood:"South Lake Union",score:88,price:2,tags:["Brunch","New American","Local Favorites","Casual"],description:"SLU brunch spot since 2008 committed to organic, local, sustainable ingredients. Legendary 'breakfast bar' with fresh fruits, nuts, and syrups for pancakes and waffles. Fluffy pancakes with seasonal berries.",dishes:["Breakfast Bar","Pancakes","Eggs Benedict"],address:"391 Terry Ave N, Seattle, WA 98109",lat:47.6192,lng:-122.3374,instagram:"portagebaycafe",website:"https://www.portagebaycafe.com",reservation:"OpenTable",phone:"(206) 462-6400"});

add({name:"Oddfellows Cafe + Bar",cuisine:"New American / Brunch",neighborhood:"Capitol Hill",score:87,price:2,tags:["Brunch","New American","Local Favorites","Casual"],description:"The Pike/Pine corridor's 'living room' in the Oddfellows Building. Eclectic essence of Seattle with rustic-urban vibe. Excellent coffee program, elevated breakfast dishes, all-day cafe into cocktail bar.",dishes:["Brunch Menu","Elevated Breakfast","Cocktails"],address:"1525 10th Ave, Seattle, WA 98122",lat:47.6143,lng:-122.3198,instagram:"oddfellowscafe",website:"https://www.oddfellowscafe.com",reservation:"OpenTable",phone:"(206) 672-2121"});

add({name:"Tilikum Place Cafe",cuisine:"New American / Brunch",neighborhood:"Belltown",score:89,price:2,tags:["Brunch","New American","Local Favorites","Critics Pick"],description:"Belltown gem known for Dutch baby pancakes — giant baked pancakes puffed in cast iron skillets. Classic topped with powdered sugar, lemon, and maple syrup. Family-friendly with attentive service.",dishes:["Dutch Baby","Brunch Classics","Seasonal Menu"],address:"407 Cedar St, Seattle, WA 98121",lat:47.6180,lng:-122.3476,instagram:"tilikumplacecafe",website:"https://www.tilikumplacecafe.com",reservation:"OpenTable",phone:"(206) 282-4830",hours:"Thu-Fri 10AM-2PM, 5PM-9PM, Sat 9AM-2PM, 5PM-9PM, Sun 9AM-2PM"});

// === RAMEN ===
add({name:"Ramen Danbo",cuisine:"Japanese / Ramen",neighborhood:"Capitol Hill",score:89,price:2,tags:["Japanese","Ramen","Local Favorites","Casual"],description:"Fukuoka-style Tonkotsu ramen in Capitol Hill. Customizable bowls with rich pork broth — one of Seattle's most popular ramen spots with long lines daily but fast table turnover. Vegan options available.",dishes:["Tonkotsu Ramen","Classic Ramen","Customizable Bowls"],address:"1222 E Pine St Ste A, Seattle, WA 98122",lat:47.6154,lng:-122.3161,instagram:"ramendanbo_usa",website:"https://ramendanbo.com",reservation:"walk-in",phone:"(206) 566-5479",hours:"Daily 11AM-11PM"});

add({name:"Ooink",cuisine:"Japanese / Ramen",neighborhood:"Capitol Hill",score:88,price:2,tags:["Japanese","Ramen","Local Favorites","Critics Pick","Casual"],description:"Capitol Hill ramen shop in Harvard Market celebrating 5+ years. Broth has the most depth and flavor on Capitol Hill. Chef-driven with seasonal specials and curated menu of rich tonkotsu bowls.",dishes:["Tonkotsu Ramen","Seasonal Ramen","Kurobuta Don"],address:"1416 Harvard Ave, Seattle, WA 98122",lat:47.6148,lng:-122.3214,instagram:"ooinkramen",website:"https://www.ooinkramen.com",reservation:"walk-in",phone:"(206) 568-7669",hours:"Mon-Thu 11:30AM-9PM, Fri-Sat 11:30AM-11PM, Sun 11:30AM-9PM"});

// === BREWERIES ===
add({name:"Fremont Brewing",cuisine:"Brewery / Beer Garden",neighborhood:"Fremont",score:90,price:1,tags:["Brewery","Casual","Local Favorites","Iconic"],description:"Family-owned craft brewery founded 2009 with iconic Urban Beer Garden. Lush IPA and Sky Kraken pale ale are fan favorites. Community hub in Fremont with kid and dog-friendly outdoor seating.",dishes:["Lush IPA","Sky Kraken Pale","Fresh Beer"],address:"1050 N 34th St, Seattle, WA 98103",lat:47.6492,lng:-122.3384,instagram:"fremontbrewing",website:"https://www.fremontbrewing.com",reservation:"walk-in",phone:"(206) 420-2407",hours:"Daily 11AM-9PM"});

add({name:"Reuben's Brews",cuisine:"Brewery / Brewpub",neighborhood:"Ballard",score:90,price:2,tags:["Brewery","Local Favorites","Casual","Critics Pick"],description:"Award-winning Ballard brewery with hundreds of medals at national and international competitions. 28 rotating taps, scratch-made American pub fare, family and dog-friendly patio. Hazy IPAs, lagers, barrel-aged beers.",dishes:["Hazy IPA","Barrel-Aged Beers","Pub Fare"],address:"5010 14th Ave NW, Seattle, WA 98107",lat:47.6663,lng:-122.3680,instagram:"reubensbrews",website:"https://reubensbrews.com",reservation:"walk-in",phone:"(206) 784-2859",hours:"Daily 11AM-10PM"});

add({name:"Holy Mountain Brewing",cuisine:"Brewery",neighborhood:"Interbay",score:91,price:2,tags:["Brewery","Critics Pick","Local Favorites"],description:"Interbay brewery celebrated for distinctive farmhouse ales, old-world styles, barrel-aged ales, and mixed fermentations. National recognition for innovative, complex beers you just don't see elsewhere.",dishes:["Farmhouse Ales","Barrel-Aged","Mixed Fermentation"],address:"1421 Elliott Ave W, Seattle, WA 98119",lat:47.6309,lng:-122.3728,instagram:"holymountainbrewing",website:"https://holymountainbrewing.com",reservation:"walk-in",phone:"(206) 457-5279"});

console.log('Added', added, 'new Seattle spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Seattle batch 5 complete!');
