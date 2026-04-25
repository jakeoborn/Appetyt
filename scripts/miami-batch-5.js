const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4155, name:"Lost Weekend", phone:"(305) 672-1707",
    cuisine:"Dive Bar / Pool Hall", neighborhood:"South Beach", score:84, price:1,
    tags:["Dive Bar","Pool Hall","Late Night","Local Favorites","Casual"],
    reservation:"walk-in",
    description:"South Beach's pool-table dive on Española Way — cheap shots, jukebox heavy on punk and Springsteen, the place locals retreat to when Ocean Drive becomes intolerable.",
    dishes:["Bud Light","Well Whiskey","Jameson Shot","PBR","Bar Snacks"],
    address:"218 Espanola Way, Miami Beach FL 33139", lat:25.7869, lng:-80.1310,
    website:"https://lostweekendmb.com", instagram:"@lostweekendmb",
    hours:"Daily 4pm-5am"
  },
  {
    id:4156, name:"Watr at the 1 Rooftop", phone:"(305) 604-1000",
    cuisine:"Rooftop / Sushi", neighborhood:"South Beach", score:88, price:4,
    tags:["Rooftop","Sushi","Date Night","Views","Hotel Bar","Pool Club"],
    reservation:"OpenTable",
    description:"The 1 Hotel South Beach's open-air rooftop — Nikkei-Peruvian sushi and a Pacific-leaning cocktail menu served around the property's 18th-floor pool, with the most considered design of any Collins Avenue hotel restaurant.",
    dishes:["Watr Roll","Tuna Tiradito","Lobster Carbonara","Salt-Air Margarita","Yellowtail Crudo"],
    address:"2341 Collins Ave, Miami Beach FL 33139", lat:25.7991, lng:-80.1276,
    website:"https://www.1hotels.com/south-beach/dining/watr", instagram:"@watrmiami",
    menuUrl:"https://www.1hotels.com/south-beach/dining/watr/menus", hours:"Daily 11am-12am"
  },
  {
    id:4157, name:"Villa Azur", phone:"(305) 763-8688",
    cuisine:"French Riviera", neighborhood:"South Beach", score:86, price:4,
    tags:["French","Scene","Date Night","Late Night","Brunch","Cocktails"],
    reservation:"SevenRooms",
    description:"Saint-Tropez transplanted to 23rd Street — chandelier-lit garden patio, magnums of rosé poured tableside, and a French Riviera menu that's the social engine of South Beach Tuesdays.",
    dishes:["Whole Branzino","Truffle Risotto","Steak Tartare","Rosé Magnum","Tuna Tartare"],
    address:"309 23rd St, Miami Beach FL 33139", lat:25.7991, lng:-80.1292,
    website:"https://villaazurmiami.com", instagram:"@villaazurmiami",
    menuUrl:"https://villaazurmiami.com/menus", hours:"Daily; Brunch Sat-Sun"
  },
  {
    id:4158, name:"Mynt Lounge", phone:"(786) 615-1626",
    cuisine:"Nightclub / Lounge", neighborhood:"South Beach", score:83, price:4,
    tags:["Nightclub","Lounge","Late Night","Bottle Service","Scene"],
    reservation:"SevenRooms",
    description:"South Beach's longest-running upscale lounge since 2002 — the room where Miami nightlife was professionalized before LIV existed. Champagne service, Latin-leaning DJ rotation, the model many newer venues still copy.",
    dishes:["Bottle Service","Champagne","Patrón","Belvedere","Dom Pérignon"],
    address:"1921 Collins Ave, Miami Beach FL 33139", lat:25.7921, lng:-80.1292,
    website:"https://myntlounge.com", instagram:"@myntloungemiami",
    hours:"Thu/Fri/Sat 11pm-5am"
  },
  {
    id:4159, name:"Kill Your Idol", phone:"(305) 534-1818",
    cuisine:"Dive Bar", neighborhood:"South Beach", score:83, price:1,
    tags:["Dive Bar","Late Night","Local Favorites","Casual","Punk"],
    reservation:"walk-in",
    description:"Española Way punk dive — neon Marilyn Monroe sign, eight bucks for a beer-and-shot, the antidote to Ocean Drive bottle service two blocks east.",
    dishes:["Beer & Shot","Well Whiskey","PBR","Vodka Soda","Tequila"],
    address:"222 Espanola Way, Miami Beach FL 33139", lat:25.7870, lng:-80.1310,
    website:"https://www.killyouridol.com", instagram:"@killyouridolmiami",
    hours:"Daily 8pm-5am"
  },
  {
    id:4160, name:"Sugar at East Miami", phone:"(786) 805-4655",
    cuisine:"Rooftop Bar / Asian", neighborhood:"Brickell", score:90, price:3,
    tags:["Rooftop","Cocktails","Asian","Views","Date Night","Outdoor","Hotel Bar"],
    reservation:"OpenTable",
    description:"East Miami's 40th-floor rooftop garden — bonsai-bordered cocktail bar with steamed-bao snacks and a 360-degree skyline view of Brickell. The most photographed Brickell rooftop, justifiably.",
    dishes:["Pork Bao","Hong Kong Highball","Lychee Martini","Shumai","Negroni"],
    address:"788 Brickell Plaza, Miami FL 33131", lat:25.7666, lng:-80.1921,
    website:"https://www.east-miami.com/sugar", instagram:"@sugareastmiami",
    hours:"Daily 5pm-2am"
  },
  {
    id:4161, name:"Basement Miami", phone:"(305) 674-1717",
    cuisine:"Nightclub / Bowling", neighborhood:"South Beach", score:82, price:3,
    tags:["Nightclub","Bowling","Ice Skating","Hotel","Late Night","Scene"],
    reservation:"SevenRooms",
    description:"The SLS South Beach's underground entertainment complex — bowling lanes, an ice-skating rink, and a club room that turns full-throttle after midnight. The novelty of the format hasn't dulled.",
    dishes:["Bottle Service","Cocktails","Beer","Patrón","Dom Pérignon"],
    address:"1701 Collins Ave, Miami Beach FL 33139", lat:25.7926, lng:-80.1291,
    website:"https://basementmiami.com", instagram:"@basementmiami",
    hours:"Thu/Fri/Sat 11pm-5am"
  },
  {
    id:4162, name:"ZeyZey", phone:"(786) 631-3066",
    cuisine:"Music Venue / Mexican", neighborhood:"Little Haiti", score:88, price:2,
    tags:["Music Venue","Mexican","Late Night","Cocktails","Outdoor","Local Favorites"],
    reservation:"walk-in",
    description:"Little Haiti's open-air music venue — Mexican antojitos, mezcal-forward cocktails, and a calendar of cumbia, salsa, and ambient DJs. The rare Miami room where the music programming is the point.",
    dishes:["Al Pastor Tacos","Esquites","Mezcal Margarita","Mole Negro","Horchata"],
    address:"2530 NW 2nd Ave, Miami FL 33127", lat:25.8010, lng:-80.1992,
    website:"https://zeyzeymiami.com", instagram:"@zeyzeymiami",
    hours:"Wed-Sun 6pm-3am"
  },
  {
    id:4163, name:"Aromas del Peru", phone:"(305) 444-2474",
    cuisine:"Peruvian", neighborhood:"Coral Gables", score:86, price:2,
    tags:["Peruvian","Family Friendly","Local Favorites","Lunch","Ceviche"],
    reservation:"walk-in",
    description:"Coral Gables' Peruvian standby — proper ceviche done at-the-counter, lomo saltado plated for sharing, and a Pisco list deeper than the dining room suggests. A neighborhood staple since 1985.",
    dishes:["Ceviche Mixto","Lomo Saltado","Aji de Gallina","Anticuchos","Pisco Sour"],
    address:"286 Miracle Mile, Coral Gables FL 33134", lat:25.7492, lng:-80.2605,
    website:"https://aromasdelperurestaurant.com", instagram:"@aromasdelperurestaurant",
    hours:"Lunch & Dinner Tue-Sun"
  },
  {
    id:4164, name:"Dukunoo Jamaican Kitchen", phone:"(786) 477-9466",
    cuisine:"Jamaican", neighborhood:"Wynwood", score:85, price:2,
    tags:["Jamaican","Caribbean","Casual","Local Favorites","Outdoor"],
    reservation:"walk-in",
    description:"Wynwood's Jamaican kitchen — proper jerk chicken from a charcoal-burning drum smoker, oxtail stew, and rum punch on a string-lit patio. A genuine taste-of-Kingston in a neighborhood that increasingly imitates one.",
    dishes:["Jerk Chicken","Oxtail Stew","Curry Goat","Festival","Rum Punch"],
    address:"316 NW 24th St, Miami FL 33127", lat:25.7999, lng:-80.2006,
    website:"https://dukunoo.com", instagram:"@dukunoojkitchen",
    menuUrl:"https://dukunoo.com/menu", hours:"Lunch & Dinner Wed-Sun"
  },
  {
    id:4165, name:"Prime 54", phone:"(305) 514-0700",
    cuisine:"Steakhouse", neighborhood:"South Beach", score:87, price:4,
    tags:["Steakhouse","Date Night","Hotel Restaurant","Cocktails"],
    reservation:"OpenTable",
    description:"Myles Chefetz's South Beach chophouse — the smaller, less-tourist sibling to Prime 112 and Prime Italian, with a focused dry-aged beef program and a serious cellar oriented around Bordeaux.",
    dishes:["Dry-Aged Ribeye","Tomahawk","Lobster Tail","Caesar Salad","Truffle Mac & Cheese"],
    address:"1500 Collins Ave, Miami Beach FL 33139", lat:25.7875, lng:-80.1310,
    website:"https://prime54miami.com", instagram:"@prime54miami",
    hours:"Dinner daily"
  },
  {
    id:4166, name:"Gordon Ramsay Hell's Kitchen Miami", phone:"(786) 600-5500",
    cuisine:"Modern American", neighborhood:"Brickell", score:85, price:4,
    tags:["Modern American","Date Night","Celebrity Chef","Tasting Menu","Hotel Restaurant"],
    reservation:"OpenTable",
    description:"Caesars Republic Brickell's Hell's Kitchen — the TV-show-as-restaurant treatment, with the signature Beef Wellington, sticky toffee pudding, and dueling kitchen brigades visible through glass at the open pass.",
    dishes:["Beef Wellington","Pan-Seared Scallops","Sticky Toffee Pudding","Lobster Risotto","Crispy Skin Salmon"],
    address:"1015 SW 1st Ave, Miami FL 33130", lat:25.7664, lng:-80.1858,
    website:"https://www.gordonramsayrestaurants.com/hells-kitchen-miami", instagram:"@gordonramsayhellskitchen",
    menuUrl:"https://www.gordonramsayrestaurants.com/hells-kitchen-miami/menus", hours:"Lunch & Dinner daily"
  },
  {
    id:4167, name:"Bistro 8", phone:"(786) 360-2030",
    cuisine:"Mexican / Cuban", neighborhood:"Little Havana", score:84, price:2,
    tags:["Mexican","Cuban","Casual","Local Favorites","Brunch"],
    reservation:"walk-in",
    description:"Calle Ocho's Mexican-Cuban hybrid — chilaquiles and ropa vieja under the same roof, with strong cafecitos and a tequila-cubano playing list. Genuinely cross-cultural in a neighborhood that pretends to be.",
    dishes:["Chilaquiles","Ropa Vieja","Cuban Sandwich","Margarita","Tres Leches"],
    address:"2901 SW 8th St, Miami FL 33135", lat:25.7654, lng:-80.2412,
    website:"https://www.bistro8.miami", instagram:"@bistro8miami",
    hours:"Daily; Brunch Sat-Sun"
  },
  {
    id:4168, name:"Rao's Miami", phone:"(305) 695-3110",
    cuisine:"Italian / Red Sauce", neighborhood:"South Beach", score:90, price:4,
    tags:["Italian","Iconic","Hard Reservation","Date Night","Red Sauce","Critics Pick"],
    reservation:"resy-or-direct",
    description:"The Manhattan red-sauce shrine that finally accepted reservations — landed at the Loews South Beach in 2024 with the original lemon chicken, baked clams, and meatballs intact. Already the hardest reservation in Miami.",
    dishes:["Lemon Chicken","Meatballs","Baked Clams","Penne alla Vodka","Tiramisu"],
    address:"1601 Collins Ave, Miami Beach FL 33139", lat:25.7894, lng:-80.1293,
    website:"https://www.raosrestaurants.com/miami", instagram:"@raos_miami",
    hours:"Dinner daily"
  },
  {
    id:4169, name:"Palma", phone:"(305) 444-0888",
    cuisine:"Italian", neighborhood:"Coral Gables", score:88, price:3,
    tags:["Italian","Date Night","Outdoor","Critics Pick","Local Favorites"],
    reservation:"OpenTable",
    description:"Coral Gables' garden Italian — Roman-trained chef Giancarla Bodoni's twin-room restaurant with a banyan-shaded courtyard, hand-rolled pastas, and wood-oven pizzas with charred edges. The Gables' best date night.",
    dishes:["Cacio e Pepe","Spaghetti alle Vongole","Margherita","Tagliata","Tiramisu"],
    address:"116 Alhambra Cir, Coral Gables FL 33134", lat:25.7528, lng:-80.2574,
    website:"https://palmacoralgables.com", instagram:"@palmacoralgables",
    menuUrl:"https://palmacoralgables.com/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4170, name:"Otto & Pepe", phone:"(786) 580-5252",
    cuisine:"Italian Pasta Bar", neighborhood:"Wynwood", score:87, price:3,
    tags:["Italian","Pasta","Date Night","Critics Pick","Local Favorites"],
    reservation:"Resy",
    description:"Wynwood's small-plates pasta bar — Otto-Lima Pizzichini and Pepe Robbiati's twelve-seat counter dispatching agnolotti, spaghetti chitarra, and grandmother-recipe ragùs three pasta courses at a time.",
    dishes:["Agnolotti","Spaghetti alla Chitarra","Carbonara","Tagliatelle Ragù","Tiramisu"],
    address:"152 NW 24th St, Miami FL 33127", lat:25.7998, lng:-80.1980,
    website:"https://ottoepepemiami.com", instagram:"@ottoepepemiami",
    hours:"Dinner Tue-Sat"
  },
  {
    id:4171, name:"Tripping Animals Brewing Co.", phone:"(786) 309-5550",
    cuisine:"Brewery / Hazy IPAs", neighborhood:"Doral", score:88, price:2,
    tags:["Brewery","Hazy IPA","Casual","Outdoor","Local Favorites","Award Winner"],
    reservation:"walk-in",
    awards:"World Beer Cup medalist, RateBeer Top 100 US Breweries",
    description:"Doral's experimental hazy-IPA flagship — Nicolas Marquez's brewery has stacked World Beer Cup medals since 2019 with milkshake stouts, fruited goses, and DIPAs that can't sit on shelves.",
    dishes:["Hazy IPA Flight","Milkshake Stout","Fruit Gose","Smash Burger","Loaded Tots"],
    address:"2685 NW 105th Ave, Doral FL 33172", lat:25.7988, lng:-80.3669,
    website:"https://trippinganimals.com", instagram:"@trippinganimalsbrewing",
    hours:"Wed-Sun 12pm-12am"
  },
  {
    id:4172, name:"Ensenada", phone:"(786) 530-7717",
    cuisine:"Coastal Mexican", neighborhood:"MiMo", score:87, price:3,
    tags:["Mexican","Seafood","Critics Pick","Date Night","Outdoor","Local Favorites"],
    reservation:"Resy",
    description:"MiMo's Baja-style coastal Mexican — Brad Kilgore's protégés running the kitchen, charred-grouper tostadas, salsa macha that drinks itself, and an octopus al pastor that deserves the destination drive.",
    dishes:["Octopus al Pastor","Baja Fish Tacos","Aguachile Verde","Tuna Tostada","Tres Leches Pavlova"],
    address:"6001 Biscayne Blvd, Miami FL 33137", lat:25.8321, lng:-80.1839,
    website:"https://ensenadamiami.com", instagram:"@ensenadamia",
    menuUrl:"https://ensenadamiami.com/menu", hours:"Dinner Tue-Sun"
  },
  {
    id:4173, name:"Casa La Rubia Brewery & Pub", phone:"(786) 786-7282",
    cuisine:"Brewery / Latin Pub", neighborhood:"Wynwood", score:84, price:2,
    tags:["Brewery","Latin","Outdoor","Casual","Local Favorites"],
    reservation:"walk-in",
    description:"Wynwood's Spanish-style brewpub — house-made pilsners and saisons paired with empanadas, croquetas, and a Sunday paella that fills the patio. The brewery scene's most reliably food-forward room.",
    dishes:["Pilsner","Saison","Empanadas","Croquetas","Paella"],
    address:"100 NW 24th St, Miami FL 33127", lat:25.7998, lng:-80.1970,
    website:"https://casalarubiabrewery.com", instagram:"@casalarubiabrewery",
    hours:"Daily 12pm-12am"
  }
];

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));
const existingIds = new Set(arr.map(c => c.id));
const existingNames = new Set(arr.map(c => c.name.toLowerCase()));
for (const c of NEW_CARDS) {
  if (existingIds.has(c.id)) { console.error('ID collision', c.id); process.exit(1); }
  if (existingNames.has(c.name.toLowerCase())) { console.error('Name dup', c.name); process.exit(1); }
}

const SAMPLE_KEYS = Object.keys(arr[0]);
const ALL_KEYS = [...SAMPLE_KEYS];
['photoUrl','menuUrl','awards'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });
const DEFAULTS = {phone:'',bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',suburb:false,reserveUrl:'',menuUrl:'',indicators:[],hh:'',awards:'',photoUrl:''};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

lines[idx] = `const MIAMI_DATA=${JSON.stringify([...arr, ...merged])};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', merged.length, 'cards. New total:', arr.length + merged.length);
