// Austin Batch 9: FINAL - last 26 spots
// Run: node scripts/austin-batch-9-final.js

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
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,score:s.score,price:s.price,tags:s.tags,indicators:[],hh:'',reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,dishes:s.dishes,address:s.address,hours:'',lat:s.lat,lng:s.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:2});
  existing.add(s.name.toLowerCase());added++;
}

add({name:"Arlo Grey",cuisine:"Italian-American",neighborhood:"Downtown",score:89,price:3,tags:["Italian","Fine Dining","Date Night","Lake Views","Awards"],reservation:"Resy",awards:"From Top Chef winner Kristen Kish",description:"Top Chef winner Kristen Kish's lakeside restaurant at The LINE Hotel. Handmade pastas, wood-grilled proteins, and Lady Bird Lake views. The most scenic fine dining in Austin.",dishes:["Handmade Pasta","Wood-Grilled Fish","Lake Views"],address:"111 E Cesar Chavez St, Austin, TX 78701",phone:"(512) 478-9611",lat:30.2610,lng:-97.7430,instagram:"arlogreyatx",website:"https://www.arlogreyaustin.com"});

add({name:"Tumble 22 Hot Chicken",cuisine:"Nashville Hot Chicken",neighborhood:"East Austin",score:85,price:1,tags:["Fried Chicken","Casual","Cheap Eats","Spicy"],description:"Austin Nashville hot chicken chain with spice levels from mild to dangerous. Scratch-made tenders, sandwiches, and sides. The spice is real above Medium.",dishes:["Hot Chicken Tenders","Sandwich","Mac & Cheese"],address:"1623 E 7th St, Austin, TX 78702",phone:"(512) 580-1844",lat:30.2626,lng:-97.7240,instagram:"tumble22",website:"https://www.tumble22.com"});

add({name:"Sawyer & Co.",cuisine:"Cajun-Southern",neighborhood:"East Austin",score:85,price:2,tags:["Southern","Cajun","Brunch","Patio"],description:"East Cesar Chavez Cajun-Southern with shrimp po-boys, gumbo, and beignets in a retro setting.",dishes:["Shrimp Po-Boy","Gumbo","Beignets"],address:"4827 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 572-6220",lat:30.2519,lng:-97.7000,instagram:"sawyerandco",website:"https://www.sawyerandco.com"});

add({name:"Fareground",cuisine:"Food Hall",neighborhood:"Downtown",score:84,price:2,tags:["Food Hall","Casual","Downtown","Lunch"],description:"Downtown food hall with ramen, tacos, poke, and more under one roof. Lunch crowd fills it weekdays.",dishes:["Multiple Vendors","Ramen","Tacos"],address:"111 Congress Ave, Austin, TX 78701",phone:"",lat:30.2650,lng:-97.7440,instagram:"faregroundatx",website:"https://www.faregroundaustin.com"});

add({name:"Slab BBQ",cuisine:"BBQ / Casual",neighborhood:"South Lamar",score:84,price:1,tags:["BBQ","Casual","Cheap Eats"],description:"South Lamar BBQ serving St. Louis ribs, brisket, and sausage at food-truck prices. Quick and affordable.",dishes:["St. Louis Ribs","Brisket","Sausage"],address:"1401 S Lamar Blvd, Austin, TX 78704",phone:"(512) 619-2277",lat:30.2500,lng:-97.7681,instagram:"slabbbq",website:"https://www.slabbbq.com"});

add({name:"Irene's",cuisine:"French-Texan",neighborhood:"North Austin",score:88,price:3,tags:["French","Date Night","New Opening"],reservation:"Resy",group:"McGuire Moorman Lambert",trending:true,description:"MML's latest — French-Texan fine dining at the Commodore Perry Estate. Classic bistro dishes in a grand setting.",dishes:["Steak Frites","French Onion Soup","Cocktails"],address:"4100 Red River St, Austin, TX 78751",phone:"(512) 580-0833",lat:30.3050,lng:-97.7270,instagram:"irenesaustin",website:"https://www.irenesaustin.com"});

add({name:"Cheer Up Charlies",cuisine:"Bar / Live Music",neighborhood:"Red River",score:84,price:1,tags:["Bar","Live Music","Nightlife","LGBTQ","Patio"],description:"LGBTQ-friendly Red River bar with outdoor stage, vegan food trucks, and queer dance parties. A cultural cornerstone.",dishes:["Vegan Food Trucks","Cocktails","Live Music"],address:"900 Red River St, Austin, TX 78701",phone:"(512) 431-2133",lat:30.2700,lng:-97.7360,instagram:"cheerupcharlies",website:"https://www.cheerupcharlies.com"});

add({name:"ACL Live at The Moody Theater",cuisine:"Entertainment",neighborhood:"Downtown",score:88,price:2,tags:["Entertainment","Live Music","Iconic"],description:"Home of Austin City Limits PBS show. The 2,750-seat theater hosts tapings and major touring acts. Bucket-list Austin music.",dishes:["Live Concerts","ACL Tapings"],address:"310 W Willie Nelson Blvd, Austin, TX 78701",phone:"(512) 225-7999",lat:30.2630,lng:-97.7470,instagram:"acllive",website:"https://www.acl-live.com"});

add({name:"Barton Creek Greenbelt",cuisine:"Tourist Attraction",neighborhood:"South Austin",score:89,price:0,tags:["Tourist Attraction","Outdoor","Hiking","Swimming","Free"],description:"7.9 miles of trails through limestone canyons with swimming holes, rock climbing, and biking. Sculpture Falls and Twin Falls are popular. Free to enter.",dishes:["Hiking","Swimming Holes","Rock Climbing"],address:"3755 Capital of TX Hwy, Austin, TX 78704",phone:"",lat:30.2440,lng:-97.7930,instagram:"bartoncreekgreenbelt",website:"https://www.austintexas.gov/department/barton-creek-greenbelt"});

add({name:"Austin FC at Q2 Stadium",cuisine:"Sports Venue",neighborhood:"North Austin",score:86,price:2,tags:["Sports","Entertainment","Tourist Attraction"],description:"Austin MLS soccer at purpose-built Q2 Stadium. Electric atmosphere with Verde Wall supporters. Game days are a new Austin tradition.",dishes:["Game Day","Tailgating"],address:"10414 McKalla Pl, Austin, TX 78758",phone:"(512) 842-2582",lat:30.3880,lng:-97.7190,instagram:"austinfc",website:"https://www.austinfc.com"});

add({name:"Mount Bonnell",cuisine:"Tourist Attraction",neighborhood:"West Austin",score:87,price:0,tags:["Tourist Attraction","Outdoor","Scenic","Free","Hiking"],description:"Highest point in Austin at 775 feet. 106 stone steps to panoramic views of Lake Austin and the Hill Country. Best at sunset. Free.",dishes:["Sunset Views","Hiking"],address:"3800 Mount Bonnell Rd, Austin, TX 78731",phone:"",lat:30.3210,lng:-97.7730,instagram:"mountbonnell",website:"https://www.austintexas.gov/department/mount-bonnell"});

add({name:"UT Tower & Campus",cuisine:"Tourist Attraction",neighborhood:"UT Campus",score:86,price:0,tags:["Tourist Attraction","Historic","Free","Landmark"],description:"Iconic UT Tower lit orange after Longhorn victories. Free campus tours, observation deck (reservations required), and 40 Acres of historic architecture.",dishes:["Tower Views","Campus Tour"],address:"110 Inner Campus Dr, Austin, TX 78705",phone:"(512) 471-3434",lat:30.2862,lng:-97.7394,instagram:"utaustin",website:"https://www.utexas.edu"});

add({name:"Monger's Market + Kitchen",cuisine:"Seafood",neighborhood:"South Lamar",score:86,price:2,tags:["Seafood","Casual","Local Favorites"],description:"South Lamar seafood market and kitchen. Gulf oysters, lobster rolls, fish tacos, and fresh fish to take home.",dishes:["Gulf Oysters","Lobster Roll","Fish Tacos"],address:"2401 S Lamar Blvd, Suite 15, Austin, TX 78704",phone:"(512) 215-0605",lat:30.2400,lng:-97.7847,instagram:"mongersatx",website:"https://www.mongersatx.com"});

add({name:"Quality Seafood Market",cuisine:"Seafood Market",neighborhood:"Airport Blvd",score:85,price:1,tags:["Seafood","Classic","Casual","Family"],awards:"Since 1938",description:"Austin's oldest seafood market since 1938. Fried catfish, Gulf shrimp, and oysters at picnic tables. Cold beer. Old Austin at its best.",dishes:["Fried Catfish","Gulf Shrimp","Oysters"],address:"5621 Airport Blvd, Austin, TX 78751",phone:"(512) 452-3820",lat:30.3280,lng:-97.7160,instagram:"qualityseafoodmkt",website:"https://www.qualityseafoodmarket.com"});

add({name:"Broken Spoke",cuisine:"Honky-Tonk",neighborhood:"South Lamar",score:87,price:1,tags:["Live Music","Bar","Classic","Country","Dancing","Iconic"],awards:"Since 1964",description:"Austin's last true honky-tonk since 1964. Two-stepping where Willie and Dolly played. Chicken fried steak before dancing. Tuesday lessons.",dishes:["Chicken Fried Steak","Live Country","Two-Stepping"],address:"3201 S Lamar Blvd, Austin, TX 78704",phone:"(512) 442-6189",lat:30.2330,lng:-97.7847,instagram:"brokenspoke",website:"https://www.brokenspokeaustintx.net"});

add({name:"Mean Eyed Cat",cuisine:"Dive Bar",neighborhood:"West Austin",score:84,price:1,tags:["Bar","Dive Bar","Classic","Local Favorites"],description:"Johnny Cash-themed dive bar with shaded patio, jukebox, cold beer, and Man in Black memorabilia everywhere.",dishes:["Cold Beer","Jukebox"],address:"1621 W 5th St, Austin, TX 78703",phone:"(512) 472-6326",lat:30.2688,lng:-97.7573,instagram:"meaneyedcataustin",website:"https://www.meaneyedcat.com"});

add({name:"Drink.Well",cuisine:"Cocktail Bar / Gastropub",neighborhood:"North Loop",score:87,price:2,tags:["Cocktails","Gastropub","Date Night"],description:"North Loop cocktail bar with creative drinks and elevated bar food. The Scotch egg is the signature.",dishes:["Scotch Egg","Craft Cocktails","Seasonal Menu"],address:"207 E 53rd St, Austin, TX 78751",phone:"(512) 614-6683",lat:30.3175,lng:-97.7270,instagram:"drinkwell",website:"https://www.drinkwellaustin.com"});

add({name:"Vixen's Wedding",cuisine:"Natural Wine Bar",neighborhood:"East Austin",score:86,price:2,tags:["Wine Bar","Date Night","Patio"],description:"East Austin natural wine bar with a sprawling patio. Tinned fish, cheese boards, and eclectic wines under string lights.",dishes:["Natural Wine","Tinned Fish","Cheese Boards"],address:"1813 E 6th St, Austin, TX 78702",phone:"(512) 814-0361",lat:30.2621,lng:-97.7240,instagram:"vixenswedding",website:"https://www.vixenswedding.com"});

add({name:"Scholz Garten",cuisine:"German Beer Garden",neighborhood:"Downtown",score:85,price:1,tags:["Beer Garden","German","Patio","Classic","Sports"],awards:"Since 1866",description:"Texas' oldest beer hall since 1866. German food, cold beer, massive patio, and UT game-day energy.",dishes:["Sausages","Pretzels","Beer"],address:"1607 San Jacinto Blvd, Austin, TX 78701",phone:"(512) 474-1958",lat:30.2720,lng:-97.7350,instagram:"scholzgarten",website:"https://www.scholzgarten.com"});

add({name:"Mohawk",cuisine:"Live Music Venue",neighborhood:"Red River",score:86,price:1,tags:["Live Music","Entertainment","Bar","Late Night"],description:"Red River venue with indoor/outdoor stages hosting indie, punk, and electronic. Rooftop patio with skyline views. SXSW staple.",dishes:["Live Music","Bar","Rooftop"],address:"912 Red River St, Austin, TX 78701",phone:"(512) 666-0877",lat:30.2700,lng:-97.7360,instagram:"mohawkaustin",website:"https://www.mohawkaustin.com"});

add({name:"The White Horse",cuisine:"Honky-Tonk",neighborhood:"East Austin",score:86,price:1,tags:["Live Music","Bar","Dive Bar","Late Night","Country"],description:"East Austin honky-tonk with live country and two-stepping. No cover most nights. Real country, real dancing. Open late.",dishes:["Cheap Beer","Live Country","Dancing"],address:"500 Comal St, Austin, TX 78702",phone:"(512) 553-6756",lat:30.2621,lng:-97.7270,instagram:"thewhitehorseaustin",website:"https://www.thewhitehorseaustin.com"});

add({name:"Oddwood Ales",cuisine:"Brewery / Wine Bar",neighborhood:"East Austin",score:85,price:1,tags:["Brewery","Wine Bar","Patio"],description:"Dual brewery and wine bar — craft ales on one side, natural wines on the other. Spacious patio with food trucks.",dishes:["Craft Ales","Natural Wine","Food Trucks"],address:"3014 Gonzales St, Austin, TX 78702",phone:"(512) 524-2337",lat:30.2567,lng:-97.7120,instagram:"oddwoodales",website:"https://www.oddwoodales.com"});

add({name:"Eberly",cuisine:"American / Southern Fine Dining",neighborhood:"South Lamar",score:88,price:3,tags:["American","Fine Dining","Date Night","Celebrations","Cocktails"],reservation:"OpenTable",group:"McGuire Moorman Lambert",description:"Multi-level South Lamar restaurant with grand bar, supper club, and cafe. Stunning architecture with high ceilings and marble. Steaks, seafood, and impressive cocktails.",dishes:["Steaks","Seafood","Cocktails"],address:"615 S Lamar Blvd, Suite A, Austin, TX 78704",phone:"(512) 916-9000",lat:30.2560,lng:-97.7681,instagram:"eberlyaustin",website:"https://www.eberlyaustin.com"});

add({name:"Cenote",cuisine:"Coffee / Cafe",neighborhood:"East Austin",score:85,price:1,tags:["Coffee","Casual","Patio"],description:"East Cesar Chavez coffee shop in a converted house with massive shaded patio. Morning coffee ritual, free WiFi.",dishes:["Specialty Coffee","Pastries","Patio"],address:"1010 E Cesar Chavez St, Austin, TX 78702",phone:"(512) 382-0204",lat:30.2533,lng:-97.7303,instagram:"cenoteatx",website:"https://www.cenoteaustin.com"});

add({name:"Jo's Coffee SoCo",cuisine:"Coffee / Iconic",neighborhood:"South Congress",score:84,price:1,tags:["Coffee","Casual","Iconic","Photo Op"],description:"The 'I love you so much' mural coffee shop on SoCo. Solid coffee, iced turbo, and world-class people-watching.",dishes:["Iced Turbo","Coffee","I Love You So Much Mural"],address:"1300 S Congress Ave, Austin, TX 78704",phone:"(512) 444-3800",lat:30.2492,lng:-97.7493,instagram:"joscoffeesocongress",website:"https://www.joscoffee.com"});

add({name:"The Driskill Bar",cuisine:"Hotel Bar / Historic",neighborhood:"Downtown",score:87,price:3,tags:["Cocktails","Hotel","Classic","Historic","Date Night"],awards:"Since 1886",description:"Bar inside Austin's most historic hotel since 1886. Cattle baron opulence with stained glass and mahogany. Where presidents and outlaws have drunk.",dishes:["Whiskey","Classic Cocktails","Live Music"],address:"604 Brazos St, Austin, TX 78701",phone:"(512) 439-1234",lat:30.2672,lng:-97.7418,instagram:"thedriskill",website:"https://www.driskillhotel.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('Austin: ' + arr.length + ' spots (added ' + added + ')');
console.log(arr.length >= 250 ? 'TARGET HIT!' : 'Need ' + (250 - arr.length) + ' more');
