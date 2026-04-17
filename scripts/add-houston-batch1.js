const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const HOUSTON_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=s.trending||false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=s.phone||''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=s.hours||''; s.dishes=s.dishes||[];
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Clear Lake (6)
add({name:'Nobi Public House',cuisine:'Vietnamese-American Gastropub',neighborhood:'Clear Lake',score:86,price:2,tags:['Casual','Cocktails','Local Favorites','Asian Fusion'],indicators:[],description:'Beloved craft-beer pub that pivoted from a gas station into Clear Lake\'s go-to spot for bold Vietnamese-American fusion food.',address:'241 E Nasa Pkwy, Webster, TX 77598',lat:29.5496,lng:-95.1137,instagram:'@nobipub',website:'https://www.nobipub.com',reservation:'walk-in',photoUrl:''});
add({name:'Masa Sushi',cuisine:'Japanese / Sushi',neighborhood:'Clear Lake',score:84,price:2,tags:['Sushi','Date Night','Local Favorites'],indicators:[],description:'Neighborhood Japanese fusion staple on NASA Parkway with reliably fresh fish in a relaxed setting.',address:'977 Nasa Pkwy, Houston, TX 77058',lat:29.5579,lng:-95.0912,instagram:'@masasushitexas',website:'https://masasushitexas.com',reservation:'walk-in',photoUrl:''});
add({name:'Dumpling World',cuisine:'Chinese / Dumplings',neighborhood:'Clear Lake',score:85,price:1,tags:['Chinese','Casual','Dumplings','Local Favorites'],indicators:['hole-in-wall'],description:'Popular Houston dumpling chain serving hand-folded dumplings and noodle dishes to enthusiastic local crowds.',address:'16630 El Camino Real, Houston, TX 77062',lat:29.5772,lng:-95.1201,instagram:'@dumplingworldtx',website:'https://www.dumplingworldtx.com',reservation:'walk-in',photoUrl:''});
add({name:'Pappas Delta Blues Smokehouse',cuisine:'BBQ / Southern',neighborhood:'Clear Lake',score:80,price:2,tags:['BBQ','Casual','Family Friendly'],indicators:[],description:'NASA-area outpost of the Pappas family\'s blues-themed smokehouse serving slow-smoked brisket and ribs.',address:'1000 Nasa Pkwy, Houston, TX 77058',lat:29.5561,lng:-95.0932,instagram:'@pappasrestaurants',website:'https://www.pappas.com',reservation:'walk-in',photoUrl:''});
add({name:'Luna Restaurant & Bar',cuisine:'New American / Bar',neighborhood:'Clear Lake',score:84,price:2,tags:['Cocktails','Date Night','Local Favorites'],indicators:[],description:'Clear Lake neighborhood staple with an upscale-casual vibe, offering creative American plates and craft cocktails.',address:'18307 Egret Bay Blvd, Houston, TX 77058',lat:29.5641,lng:-95.1089,instagram:'@lunarestaurantbar',website:'https://www.lunarestaurantbar.com',reservation:'walk-in',photoUrl:''});

// La Porte (5 - skipping duplicate Gringo's)
add({name:'Monument Inn',cuisine:'Seafood',neighborhood:'La Porte',score:86,price:2,tags:['Seafood','Scenic','Local Favorites','Casual'],indicators:['iconic'],description:'Ship Channel institution since 1974 serving massive Gulf Coast seafood platters with sweeping water views.',address:'4406 Independence Pkwy S, La Porte, TX 77571',lat:29.6694,lng:-95.0355,instagram:'@monumentinn',website:'https://monumentinn.com',reservation:'walk-in',photoUrl:''});
add({name:'Main 101 Grill & Bar',cuisine:'New American',neighborhood:'La Porte',score:84,price:2,tags:['Date Night','Casual','Local Favorites'],indicators:[],description:'Polished New American bistro anchored in historic downtown La Porte.',address:'101 E Main St, La Porte, TX 77571',lat:29.6659,lng:-95.0201,instagram:'@main101grillbar',website:'https://www.main101.com',reservation:'walk-in',photoUrl:''});
add({name:'New Orleans Seafood Kitchen',cuisine:'Cajun / Seafood',neighborhood:'La Porte',score:82,price:2,tags:['Seafood','Cajun','Casual','Local Favorites'],indicators:[],description:'Casual Cajun-focused spot serving fried seafood platters and etouffee in a no-frills setting.',address:'324 W Main St, La Porte, TX 77571',lat:29.6660,lng:-95.0250,instagram:'@nosk_laporte',website:'https://www.neworleansseafoodkitchentx.com',reservation:'walk-in',photoUrl:''});
add({name:'Southern Komfort Kitchen',cuisine:'Southern / Soul Food',neighborhood:'La Porte',score:83,price:1,tags:['Southern','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'From-scratch Southern comfort kitchen with smothered pork chops, collard greens, and peach cobbler.',address:'1001 S Broadway St, La Porte, TX 77571',lat:29.6573,lng:-95.0188,instagram:'@southernkomfortkitchen',website:'https://www.thesouthernkomfortkitchen.com',reservation:'walk-in',photoUrl:''});
add({name:'El Toro Mexican Restaurant',cuisine:'Mexican',neighborhood:'La Porte',score:79,price:1,tags:['Mexican','Casual','Family Friendly','Local Favorites'],indicators:[],description:'Texas institution since 1960 with classic enchiladas, tamales, and house salsas.',address:'421 S Broadway St, La Porte, TX 77571',lat:29.6636,lng:-95.0193,instagram:'@eltorolaporte',website:'https://www.eltoro.com',reservation:'walk-in',photoUrl:''});

// Tomball (5 - Tejas already exists)
add({name:'Bonfire Grill',cuisine:'Pizza / American',neighborhood:'Tomball',score:85,price:2,tags:['Pizza','Cocktails','Local Favorites'],indicators:[],description:'Repurposed gas station firing Neapolitan-style pizzas from a wood-burning oven alongside craft cocktails.',address:'425 W Main St, Tomball, TX 77375',lat:30.0972,lng:-95.6195,instagram:'@bonfiregrilltx',website:'https://www.bonfiregrill.net',reservation:'walk-in',photoUrl:''});
add({name:'Graze Tomball',cuisine:'American / Comfort',neighborhood:'Tomball',score:86,price:2,tags:['Brunch','Casual','Local Favorites'],indicators:[],description:'Downtown Tomball charmer serving inventive American comfort food for lunch, dinner, and weekend brunch.',address:'208 N Elm St, Tomball, TX 77375',lat:30.0988,lng:-95.6147,instagram:'@graze.eatdrinkgather',website:'https://www.grazetomball.com',reservation:'walk-in',photoUrl:''});
add({name:'Che Gaucho',cuisine:'Argentine Steakhouse',neighborhood:'Tomball',score:87,price:3,tags:['Steakhouse','Date Night','Local Favorites'],indicators:['hidden-gem'],description:'Authentic Argentine steakhouse with wood-grilled skirt steaks and handmade empanadas on Main Street.',address:'611 W Main St, Tomball, TX 77375',lat:30.0969,lng:-95.6222,instagram:'@chegauchorestaurant',website:'https://chegauchorestaurant.com',reservation:'OpenTable',photoUrl:''});
add({name:'Goodson\'s Cafe',cuisine:'Southern / American',neighborhood:'Tomball',score:82,price:1,tags:['Southern','Casual','Family Friendly','Local Favorites'],indicators:['iconic'],description:'Tomball landmark since 1950 serving famous Chicken Fried Steak and homemade Banana Pudding.',address:'27931 State Hwy 249, Tomball, TX 77375',lat:30.0831,lng:-95.6197,instagram:'@goodsonscafe',website:'https://goodsonscafe.com',reservation:'walk-in',photoUrl:''});
add({name:'Tony\'s Italian Delicatessen',cuisine:'Italian Deli / Sandwiches',neighborhood:'Tomball',score:84,price:1,tags:['Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Family-owned Tomball deli ranked among the best sandwich shops in Texas with overstuffed Italian subs.',address:'24504 Kuykendahl Rd Ste 100, Tomball, TX 77389',lat:30.0588,lng:-95.5993,instagram:'@tonysitaliandelicatessen',website:'https://www.tonysitaliandelicatessen.com',reservation:'walk-in',photoUrl:''});

// West Houston (5 - Perry's likely exists)
add({name:'Lomonte\'s Italian',cuisine:'Italian',neighborhood:'West Houston',score:87,price:3,tags:['Italian','Date Night','Fine Dining','Cocktails'],indicators:['hidden-gem'],description:'Energy Corridor\'s most-reviewed Italian restaurant with handmade pasta, veal, and deep Italian wine list.',address:'14510 Grisby Rd, Houston, TX 77079',lat:29.7757,lng:-95.6276,instagram:'@lomontesitalian',website:'https://www.lomontes.com',reservation:'OpenTable',photoUrl:''});
add({name:'Resilience Viet Kitchen',cuisine:'Vietnamese',neighborhood:'West Houston',score:86,price:2,tags:['Vietnamese','Cocktails','Local Favorites'],indicators:[],description:'Stylish Vietnamese cuisine from the Pho Binh creators — pho, banh mi, and craft cocktails in the Energy Corridor.',address:'1140 Eldridge Pkwy S Ste 190, Houston, TX 77077',lat:29.7601,lng:-95.6439,instagram:'@resiliencehtx',website:'https://www.resiliencevietkitchen.com',reservation:'walk-in',photoUrl:''});
add({name:'Poblano\'s Mexican Grill',cuisine:'Mexican',neighborhood:'West Houston',score:81,price:2,tags:['Mexican','Casual','Brunch','Local Favorites'],indicators:[],description:'Neighborhood favorite in the Energy Corridor since 2007 with authentic Mexican dishes from breakfast burritos to shrimp a la diabla.',address:'1250 Eldridge Pkwy Ste 100, Houston, TX 77077',lat:29.7612,lng:-95.6418,instagram:'@poblanosmexgrill',website:'https://poblanosmexicangrill.net',reservation:'walk-in',photoUrl:''});
add({name:'Pecan Creek Grille',cuisine:'American / Brunch',neighborhood:'West Houston',score:83,price:2,tags:['Brunch','Casual','Local Favorites','Family Friendly'],indicators:[],description:'Local brunch staple celebrated for Chicken Fried Steak & Eggs and Huevos con Chorizo.',address:'1645 Eldridge Pkwy, Houston, TX 77077',lat:29.7648,lng:-95.6398,instagram:'@pecancreekgrille',website:'https://www.pecancreekgrille.com',reservation:'walk-in',photoUrl:''});

// Northwest Houston (5 - Perry's likely exists)
add({name:'Ba Mien Bistro',cuisine:'Vietnamese',neighborhood:'Northwest Houston',score:85,price:1,tags:['Vietnamese','Casual','Local Favorites'],indicators:['hidden-gem'],description:'Award-winning Vietnamese bistro presenting the distinct cuisines of all three regions of Vietnam in a chic setting.',address:'5102 FM 1960 Rd W, Houston, TX 77069',lat:29.9583,lng:-95.5247,instagram:'@bamienbistro',website:'https://bamienbistrotogo.com',reservation:'walk-in',photoUrl:''});
add({name:'Bluewater Seafood',cuisine:'Seafood',neighborhood:'Northwest Houston',score:84,price:2,tags:['Seafood','Casual','Local Favorites'],indicators:[],description:'30-year Houston seafood legacy bringing straight-from-the-dock Gulf catches to the Champions neighborhood.',address:'6107 FM 1960 W, Houston, TX 77069',lat:29.9591,lng:-95.5379,instagram:'@bluewaterseafood',website:'https://bluewaterseafoodonline.com',reservation:'walk-in',photoUrl:''});
add({name:'Cutten Kitchen',cuisine:'Southern / American',neighborhood:'Northwest Houston',score:83,price:2,tags:['Southern','Cocktails','Date Night','Local Favorites'],indicators:[],description:'Lively FM 1960 neighborhood spot blending bold Southern flavors with craft cocktails.',address:'6935 FM 1960 Rd W Ste D, Houston, TX 77069',lat:29.9594,lng:-95.5518,instagram:'@cuttenkitchen',website:'https://cuttenkitchen.com',reservation:'walk-in',photoUrl:''});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nHouston total:', arr.length);
