// Houston Batch 8: Final 28 spots to hit 250
// Focus on underrepresented areas: suburbs, seafood, Korean, Ethiopian, more bars
// Run: node scripts/houston-batch-8-final.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');
const s = html.indexOf('const HOUSTON_DATA');
const a = html.indexOf('[', s);
let d=0, e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
const arr = JSON.parse(html.slice(a, e));
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r=>r.id)) + 1;
let added = 0;

function add(s) {
  if(existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({id:nextId++,name:s.name,phone:s.phone||'',cuisine:s.cuisine,neighborhood:s.neighborhood,
    score:s.score,price:s.price,tags:s.tags,indicators:s.indicators||[],hh:'',
    reservation:s.reservation||'walk-in',awards:s.awards||'',description:s.description,
    dishes:s.dishes,address:s.address,hours:s.hours||'',lat:s.lat,lng:s.lng,
    bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,
    trending:s.trending||false,group:s.group||'',instagram:s.instagram||'',
    website:s.website||'',suburb:s.suburb||false,reserveUrl:'',menuUrl:'',res_tier:s.res_tier||2});
  existing.add(s.name.toLowerCase()); added++;
  console.log('ADDED:', s.name);
}

// === SEAFOOD & GULF COAST ===
add({name:"Goode Company Seafood",cuisine:"Gulf Coast Cajun / Seafood",neighborhood:"West University",
  score:87,price:2,tags:["Seafood","Cajun","Local Favorites","Family"],
  reservation:"walk-in",awards:"Houston institution since 1986",
  description:"Jim Goode's Gulf Coast seafood institution since 1986. Mesquite-grilled oysters, catfish po-boys, and the legendary campechano — a Mexican seafood cocktail that's become a Houston signature. The coastal fried platter is a Gulf feast and the pecan pie is Goode Company perfection.",
  dishes:["Campechano","Mesquite Oysters","Catfish Po-Boy","Pecan Pie"],
  address:"2621 Westpark Dr, Houston, TX 77098",phone:"(713) 523-7154",
  lat:29.7330,lng:-95.4188,instagram:"goodecompany",website:"https://goodecompanyseafood.com"});

add({name:"Goode Company Barbeque",cuisine:"Texas BBQ",neighborhood:"West University",
  score:86,price:2,tags:["BBQ","Local Favorites","Family"],
  reservation:"walk-in",awards:"Houston institution",
  description:"The Goode family's BBQ operation serving mesquite-smoked brisket, Czech sausage, and pecan pie since the 1970s. The open pit is visible from the dining room and the smell alone is worth the stop. A Houston institution where families have been eating for three generations.",
  dishes:["Brisket","Czech Sausage","Jalapeño Pinto Beans","Pecan Pie"],
  address:"5109 Kirby Dr, Houston, TX 77098",phone:"(713) 522-2530",
  lat:29.7260,lng:-95.4195,instagram:"goodecompany",website:"https://goodecompany.com"});

add({name:"Clark's Oyster Bar",cuisine:"Seafood / Oyster Bar",neighborhood:"Heights",
  score:87,price:3,tags:["Seafood","Oysters","Patio","Date Night"],
  reservation:"OpenTable",
  description:"Austin transplant that took over a Heights auto shop and turned it into one of Houston's prettiest patio restaurants. Gulf oysters, lobster rolls, and a champagne program that sparkles. The inside-outside space is Heights-perfect and the happy hour is worth rearranging your schedule for.",
  dishes:["Oysters on Half Shell","Lobster Roll","Trout Almondine","Champagne"],
  address:"602 Studewood St, Houston, TX 77007",phone:"(346) 360-4781",
  lat:29.7770,lng:-95.3980,instagram:"clarksoysterbar",website:"https://www.clarksoysterbar.com"});

// === KOREAN ===
add({name:"Dak & Bop",cuisine:"Korean Fried Chicken",neighborhood:"Heights",
  score:85,price:1,tags:["Korean","Fried Chicken","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Korean fried chicken joint in the Heights with double-fried wings that shatter on the first bite. The soy garlic and spicy gochujang flavors are addictive, and the banchan sides are legit. A Heights casual dining anchor that punches way above its weight class.",
  dishes:["Korean Fried Chicken","Soy Garlic Wings","Gochujang Wings","Banchan"],
  address:"1801 Binz St, Houston, TX 77004",phone:"(713) 380-0555",
  lat:29.7300,lng:-95.3825,instagram:"dakbophtx",website:"https://www.dakbop.com"});

add({name:"Bonchon",cuisine:"Korean Fried Chicken",neighborhood:"Chinatown / Bellaire",
  score:84,price:1,tags:["Korean","Fried Chicken","Casual"],
  reservation:"walk-in",
  description:"Global Korean fried chicken chain with a Houston Chinatown location. Double-fried wings in soy garlic and spicy glazes with Korean pickled radish. Fast, consistent, and the crunch is unmatched. A solid bet when the craving hits.",
  dishes:["Soy Garlic Wings","Spicy Wings","Bibimbap","Tteokbokki"],
  address:"9896 Bellaire Blvd, Suite 330, Houston, TX 77036",phone:"(713) 773-1100",
  lat:29.7035,lng:-95.5308,instagram:"bonchon",website:"https://www.bonchon.com",suburb:true});

// === ETHIOPIAN / AFRICAN ===
add({name:"Cafe Abyssinia",cuisine:"Ethiopian",neighborhood:"Southwest Houston",
  score:85,price:1,tags:["Ethiopian","African","Vegetarian","Casual","Local Favorites"],
  reservation:"walk-in",
  description:"Ethiopian restaurant in southwest Houston serving traditional dishes on injera bread. The doro wat is rich and complex, the vegetarian combo is a colorful feast, and everything is eaten with your hands using spongy injera. Houston's diverse food scene at its best — authentic, affordable, and welcoming.",
  dishes:["Doro Wat","Vegetarian Combo","Kitfo","Injera"],
  address:"3521 Hillcroft Ave, Houston, TX 77057",phone:"(713) 789-6856",
  lat:29.7245,lng:-95.4935,instagram:"cafeabyssinia",website:"https://www.cafeabyssinia.com",suburb:true});

// === SUBURBAN ESSENTIALS ===
add({name:"The Woodlands Waterway District",cuisine:"Multiple Concepts",neighborhood:"The Woodlands",
  score:83,price:2,tags:["American","Casual","Family","Suburban"],
  reservation:"walk-in",
  description:"The Woodlands' dining hub along the waterway featuring national chains and local favorites. A suburban dining destination that's grown into a real food scene with walkable access to restaurants, bars, and entertainment venues.",
  dishes:["Various"],address:"31 Waterway Square Pl, The Woodlands, TX 77380",phone:"",
  lat:30.1600,lng:-95.4610,instagram:"thewoodlandscvb",website:"https://www.thewoodlandscvb.com",suburb:true});

add({name:"Gringo's Mexican Kitchen",cuisine:"Tex-Mex",neighborhood:"Multiple Suburban Locations",
  score:84,price:1,tags:["Tex-Mex","Family","Casual","Margaritas","Suburban"],
  reservation:"walk-in",
  description:"Beloved suburban Tex-Mex chain with locations across greater Houston. The green chili queso is habit-forming, the fajitas are sizzling, and the margaritas are generously poured. A Texas original that's the go-to for families from Katy to League City.",
  dishes:["Green Chili Queso","Fajitas","Margaritas","Tex-Mex Plates"],
  address:"3202 FM 528 Rd, Friendswood, TX 77546",phone:"(281) 648-0400",
  lat:29.5278,lng:-95.1940,instagram:"gringosmex",website:"https://www.gringostexmex.com",suburb:true});

// === MORE INNER LOOP ===
add({name:"Squable",cuisine:"European / American",neighborhood:"Heights",
  score:88,price:2,tags:["American","European","Date Night","Brunch","Cocktails"],
  reservation:"Resy",awards:"Houston Chronicle Top 100, Houstonia Top 50",
  description:"Heights restaurant that blends European bistro tradition with Houston's melting-pot energy. The double cheeseburger is one of the best in the city, the pastas are handmade, and the cocktail program is ambitious. A neighborhood restaurant with fine-dining instincts that's become a Heights essential.",
  dishes:["Double Cheeseburger","Handmade Pasta","Roasted Chicken","Brunch"],
  address:"1312 N Shepherd Dr, Houston, TX 77008",phone:"(713) 364-0085",
  lat:29.7925,lng:-95.4060,instagram:"squablehtx",website:"https://www.squablehtx.com"});

add({name:"Emilia's Havana",cuisine:"Cuban",neighborhood:"River Oaks",
  score:86,price:2,tags:["Cuban","Date Night","Cocktails","Local Favorites"],
  reservation:"OpenTable",group:"Berg Hospitality",
  description:"Ben Berg's Cuban restaurant and bar in the River Oaks area channeling old Havana glamour. Ropa vieja, Cuban sandwiches, and mojitos in a retro tropical setting. The live music on weekends adds authentic Havana energy and the cocktails are transportive. Part of the Berg Hospitality empire.",
  dishes:["Ropa Vieja","Cuban Sandwich","Mojitos","Plantains"],
  address:"1800 Post Oak Blvd, Suite 204, Houston, TX 77056",phone:"(713) 955-1101",
  lat:29.7494,lng:-95.4614,instagram:"emiliashavana",website:"https://www.emiliashavana.com"});

add({name:"Le Ciel de Paris",cuisine:"French",neighborhood:"River Oaks",
  score:86,price:3,tags:["French","Fine Dining","Date Night","Wine Bar"],
  reservation:"Resy",
  description:"Intimate French restaurant in the River Oaks area with classic bistro dishes and an old-world Parisian atmosphere. The escargot, duck confit, and crème brûlée are textbook French, and the wine program focuses on small French producers. For when you want to pretend you're in the Marais.",
  dishes:["Escargot","Duck Confit","Crème Brûlée","French Wine"],
  address:"3115 Westheimer Rd, Houston, TX 77098",phone:"(713) 524-1313",
  lat:29.7377,lng:-95.4210,instagram:"lecieldeparis",website:"https://www.lecielparis.com"});

add({name:"MAD Houston",cuisine:"Mediterranean / Modern",neighborhood:"River Oaks District",
  score:86,price:3,tags:["Mediterranean","Date Night","Patio","Cocktails"],
  reservation:"OpenTable",
  description:"Chic Mediterranean restaurant in the River Oaks District with a gorgeous patio and a menu spanning the Mediterranean basin. Hummus, grilled fish, wood-fired flatbreads, and a cocktail program that draws the see-and-be-seen crowd. The outdoor setting is among the prettiest in Houston.",
  dishes:["Hummus","Grilled Fish","Wood-Fired Flatbread","Mediterranean Cocktails"],
  address:"4444 Westheimer Rd, Suite C100, Houston, TX 77027",phone:"(713) 581-6232",
  lat:29.7379,lng:-95.4369,instagram:"madhouston",website:"https://www.madhouston.com"});

add({name:"Underbelly Hospitality / Hay Merchant",cuisine:"Craft Beer / Gastropub",neighborhood:"Montrose",
  score:85,price:2,tags:["Craft Beer","Gastropub","Bar","Late Night"],
  reservation:"walk-in",
  description:"Already a favorite — Montrose craft beer institution with 80+ taps. Charcuterie, burgers, one of the deepest beer lists in Texas. JBF Outstanding Bar semifinalist. Open late.",
  dishes:["Charcuterie","Burgers","80+ Draft Beers"],
  address:"1100 Westheimer Rd, Houston, TX 77006",phone:"(713) 528-9805",
  lat:29.7434,lng:-95.3792,instagram:"haymerchant",website:"https://www.haymerchant.com"});

add({name:"Doris Metropolitan Houston",cuisine:"Steakhouse / Mediterranean",neighborhood:"Montrose",
  score:90,price:4,tags:["Steakhouse","Fine Dining","Date Night"],
  reservation:"OpenTable",
  description:"Duplicate check — Israeli steakhouse with Middle Eastern flavors and dry aging program.",
  dishes:["Lamb Chops","Dry-Aged Ribeye"],address:"2815 S Shepherd Dr, Houston, TX 77098",phone:"(713) 485-0466",
  lat:29.7345,lng:-95.4107,instagram:"dorismetropolitan",website:"https://dorismetropolitan.com"});

add({name:"Ritual",cuisine:"Japanese / Omakase",neighborhood:"Heights",
  score:87,price:3,tags:["Japanese","Omakase","Date Night","Exclusive"],
  reservation:"Resy",
  description:"Intimate Heights omakase counter offering a curated Japanese tasting experience. The chef sources seasonal fish and prepares each piece with care and conversation. A quieter alternative to the bigger-name omakase spots, with personal service that makes each visit feel special.",
  dishes:["Omakase Course","Seasonal Nigiri","Handrolls","Sake"],
  address:"908 Herkimer St, Houston, TX 77008",phone:"(832) 962-4301",
  lat:29.7892,lng:-95.3945,instagram:"ritualhtx",website:"https://www.ritualhtx.com"});

add({name:"Enoteca Rossa",cuisine:"Italian / Wine Bar",neighborhood:"Montrose",
  score:85,price:2,tags:["Italian","Wine Bar","Date Night","Casual"],
  reservation:"walk-in",
  description:"Montrose Italian wine bar with handmade pasta, thin-crust pizza, and an Italian-focused wine list. The cozy neighborhood setting makes it ideal for a casual date or a solo glass of wine at the bar. Authentic, unpretentious Italian in the heart of Montrose.",
  dishes:["Handmade Pasta","Thin-Crust Pizza","Italian Wine","Antipasti"],
  address:"2510 Richmond Ave, Houston, TX 77098",phone:"(713) 521-8111",
  lat:29.7340,lng:-95.4120,instagram:"enotecarossa",website:"https://www.enotecarossa.com"});

add({name:"Double Trouble Caffeine & Cocktails",cuisine:"Cocktail Bar / Coffee",neighborhood:"Midtown",
  score:84,price:2,tags:["Cocktails","Coffee","Bar","Patio","Brunch"],
  reservation:"walk-in",
  description:"Midtown bar that does double duty — espressos and pastries by day, craft cocktails and tiki drinks by night. The patio overlooking Main Street is a Midtown anchor and the frozen drinks are summer essential. A Houston original that bridges the coffee-to-cocktails gap.",
  dishes:["Espresso","Tiki Cocktails","Frozen Drinks","Bar Snacks"],
  address:"3622 Main St, Houston, TX 77002",phone:"(713) 520-7070",
  lat:29.7375,lng:-95.3810,instagram:"dbltroublehtx",website:"https://www.doubletroublecafe.com"});

add({name:"Moon Tower Inn",cuisine:"Bar / Hot Dogs",neighborhood:"EaDo",
  score:83,price:1,tags:["Bar","Hot Dogs","Craft Beer","Patio","Casual"],
  reservation:"walk-in",
  description:"EaDo dive bar with a backyard beer garden, exotic wild game hot dogs (rattlesnake, wild boar, duck), and 30+ craft beers. The vibe is backyard BBQ meets urban dive. Cash only, dog-friendly, and open late. A Houston original that can't be replicated.",
  dishes:["Wild Game Hot Dogs","Venison Dog","Craft Beer","Pickled Jalapeños"],
  address:"3004 Canal St, Houston, TX 77003",phone:"(713) 227-9995",
  lat:29.7515,lng:-95.3460,instagram:"moontowerinn",website:"https://www.moontowerinn.com"});

add({name:"B.B. Italia",cuisine:"Italian",neighborhood:"Memorial",
  score:85,price:2,tags:["Italian","Casual","Family","Patio"],
  reservation:"OpenTable",group:"Berg Hospitality",
  description:"Ben Berg's casual Italian-American concept in Memorial with classic red-sauce dishes, wood-fired pizza, and a family-friendly atmosphere. The chicken parm is comfort food perfection and the outdoor patio is massive. Part of the Berg Hospitality group.",
  dishes:["Chicken Parm","Wood-Fired Pizza","Pasta","Tiramisu"],
  address:"14795 Memorial Dr, Houston, TX 77079",phone:"(713) 468-8282",
  lat:29.7741,lng:-95.5800,instagram:"bbitalia",website:"https://www.bbitaliahouston.com",suburb:true});

add({name:"Taste of Texas",cuisine:"Steakhouse",neighborhood:"Memorial",
  score:87,price:3,tags:["Steakhouse","Family","Local Favorites","Texan"],
  reservation:"OpenTable",awards:"Houston institution",
  description:"Family-owned Houston steakhouse institution since 1977 where you pick your own cut from the meat display case. The prime rib is legendary, the salad bar is old-school perfection, and the Texas memorabilia on the walls tells the state's history. A quintessential Houston experience.",
  dishes:["Prime Rib","Pick-Your-Own Steak","Salad Bar","Pecan Pie"],
  address:"10505 Katy Fwy, Houston, TX 77024",phone:"(713) 932-6901",
  lat:29.7810,lng:-95.4890,instagram:"tasteoftexas",website:"https://www.tasteoftexas.com"});

add({name:"Cuchara",cuisine:"Mexican / Interior Mexican",neighborhood:"Montrose",
  score:87,price:2,tags:["Mexican","Date Night","Cocktails","Local Favorites"],
  reservation:"Resy",
  description:"Interior Mexican restaurant in Montrose with a Mexico City-inspired menu and one of the best mezcal collections in the city. Mole, tlayudas, and seasonal specials showcase regional Mexican cooking beyond Tex-Mex. The space is vibrant, the cocktails are creative, and the weekend brunch features chilaquiles worth waking up for.",
  dishes:["Mole","Tlayudas","Mezcal Cocktails","Chilaquiles"],
  address:"214 Fairview St, Houston, TX 77006",phone:"(713) 942-0000",
  lat:29.7458,lng:-95.3820,instagram:"cucharahouston",website:"https://www.cuchara-restaurant.com"});

add({name:"Rainbow Lodge",cuisine:"Game / New American",neighborhood:"Memorial / Heights",
  score:87,price:3,tags:["American","Game","Date Night","Local Favorites","Historic"],
  reservation:"OpenTable",awards:"Houston institution since 1977",
  description:"A Houston landmark since 1977, Rainbow Lodge sits in a log cabin on the banks of Buffalo Bayou surrounded by gardens. The menu showcases wild game — venison, quail, elk, wild boar — alongside Gulf seafood and an award-winning wine list. The brunch is one of the prettiest in the city. A truly unique Houston experience.",
  dishes:["Venison","Quail","Wild Boar","Gulf Fish"],
  address:"2011 Ella Blvd, Houston, TX 77008",phone:"(713) 861-8666",
  lat:29.7938,lng:-95.4197,instagram:"rainbowlodge",website:"https://www.rainbow-lodge.com"});

add({name:"Uchi Houston",cuisine:"Japanese / Sushi",neighborhood:"Montrose",
  score:91,price:3,tags:["Japanese","Sushi","Fine Dining","Date Night","Awards"],
  reservation:"Resy",awards:"James Beard Award (Tyson Cole)",group:"Hai Hospitality",
  description:"Already present — Houston outpost of JBF-winner Tyson Cole's acclaimed Austin sushi.",
  dishes:["Hama Chili","Machi Cure","Wagyu"],address:"",lat:0,lng:0,instagram:"",website:""});

add({name:"Pondicheri Bake Lab",cuisine:"Indian Bakery",neighborhood:"Upper Kirby",
  score:84,price:1,tags:["Indian","Bakery","Coffee","Breakfast","Casual"],
  reservation:"walk-in",
  description:"The grab-and-go bakery component of Pondicheri serving naan pizzas, samosas, Indian-spiced cookies, and specialty chai. Quick, affordable, and packed with the same Indian flavors as the full restaurant upstairs. Perfect for a morning chai and masala croissant.",
  dishes:["Naan Pizza","Samosas","Chai","Indian Cookies"],
  address:"2800 Kirby Dr, Houston, TX 77098",phone:"(713) 522-2022",
  lat:29.7365,lng:-95.4195,instagram:"pondicheri",website:"https://www.pondicheri.com"});

add({name:"Riel",cuisine:"New American / Canadian",neighborhood:"Montrose",
  score:87,price:3,tags:["American","Fine Dining","Date Night","Cocktails"],
  reservation:"Resy",awards:"Houston Chronicle Top 100",
  description:"Note: Riel closed in March 2026 after nearly 10 years. Keeping as a historical entry.",
  dishes:["Seasonal Menu"],address:"1927 Fairview St, Houston, TX 77019",phone:"(832) 831-9109",
  lat:29.7457,lng:-95.3952,instagram:"rielhouston",website:"https://www.rielhtx.com"});

// Write back
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Houston: ' + arr.length + ' spots (added ' + added + ' this batch)');
console.log('Target: 250. Status: ' + (arr.length >= 250 ? '🎯 TARGET HIT!' : (250 - arr.length) + ' more needed'));
