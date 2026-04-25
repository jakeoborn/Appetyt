const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4191, name:"Le Sirenuse Miami", phone:"(305) 768-9440",
    cuisine:"Italian / Amalfi", neighborhood:"Surfside", score:93, price:4,
    tags:["Italian","Fine Dining","Date Night","Hotel Restaurant","Critics Pick","Awards"],
    reservation:"SevenRooms",
    awards:"Forbes Travel Guide Five Stars (Hotel)",
    description:"The Positano legend's only outpost outside Italy — a coral-and-cream room at the Four Seasons Surf Club, with hand-rolled scialatielli, candy-pink linens, and Amalfi Coast wine pairings the rest of Miami can't match.",
    dishes:["Scialatielli alle Vongole","Tagliata di Manzo","Branzino al Sale","Linguine Astice","Delizia al Limone"],
    address:"9011 Collins Ave, Surfside FL 33154", lat:25.8779, lng:-80.1214,
    website:"https://www.fourseasons.com/surfside/dining/restaurants/le-sirenuse-miami", instagram:"@lesirenusemiami",
    hours:"Dinner Tue-Sun"
  },
  {
    id:4192, name:"The Bazaar by José Andrés", phone:"(786) 245-0826",
    cuisine:"Modern Spanish", neighborhood:"South Beach", score:90, price:4,
    tags:["Spanish","Fine Dining","Date Night","Scene","Tasting Menu","Hotel Restaurant","Cocktails"],
    reservation:"OpenTable",
    description:"José Andrés' tapas-as-theater room at the SLS South Beach — liquid olives, cotton-candy foie gras, and a 30-course tasting menu that put Andrés on the Miami map a decade ago. Still the city's strangest fine-dining choice.",
    dishes:["Liquid Olives","Cotton-Candy Foie Gras","Cubano Sandwich","Paella","Salt-Air Margarita"],
    address:"1701 Collins Ave, Miami Beach FL 33139", lat:25.7926, lng:-80.1291,
    website:"https://www.thebazaar.com/miami", instagram:"@thebazaarmiami",
    menuUrl:"https://www.thebazaar.com/miami/menu", hours:"Dinner daily"
  },
  {
    id:4193, name:"Edge Steak & Bar", phone:"(305) 381-3190",
    cuisine:"Steakhouse", neighborhood:"Brickell", score:87, price:4,
    tags:["Steakhouse","Date Night","Hotel Restaurant","Wine","Outdoor"],
    reservation:"OpenTable",
    description:"Four Seasons Brickell's poolside steakhouse — chef Aaron Brooks' tomahawks, dry-aged ribeyes, and a pool-deck patio that holds up against the bigger downtown chophouses.",
    dishes:["Tomahawk Ribeye","Dry-Aged NY Strip","Crab Cake","Steak Tartare","Key Lime Pie"],
    address:"1435 Brickell Ave, Miami FL 33131", lat:25.7589, lng:-80.1922,
    website:"https://www.fourseasons.com/miami/dining/restaurants/edge_steak_and_bar", instagram:"@edgesteakmiami",
    hours:"Dinner daily; Brunch Sun"
  },
  {
    id:4194, name:"Tre at Faena Hotel", phone:"(786) 655-5777",
    cuisine:"Italian", neighborhood:"Mid Beach", score:88, price:4,
    tags:["Italian","Fine Dining","Date Night","Hotel Restaurant","Scene"],
    reservation:"SevenRooms",
    description:"The Faena Hotel's gold-and-velvet Italian room — chef Mattia Pecchia's house-made pastas served under a Damien Hirst-painted ceiling, the most theatrical dining room on Collins Avenue.",
    dishes:["Tagliolini al Tartufo","Risotto Milanese","Branzino in Crosta","Veal Tonnato","Tiramisu"],
    address:"3201 Collins Ave, Miami Beach FL 33140", lat:25.8074, lng:-80.1231,
    website:"https://www.faena.com/miami-beach/dining/tre", instagram:"@faenahotelmiami",
    hours:"Dinner daily"
  },
  {
    id:4195, name:"Quinto La Huella", phone:"(305) 423-3700",
    cuisine:"Uruguayan / Wood-Fire", neighborhood:"Coconut Grove", score:90, price:4,
    tags:["Uruguayan","Wood-Fire","Date Night","Hotel Restaurant","Critics Pick","Outdoor"],
    reservation:"OpenTable",
    awards:"Latin America's 50 Best Restaurants (origin in Uruguay)",
    description:"The José Ignacio classic transplanted to the EAST Miami's Coconut Grove sister — wood-fire-only kitchen, blanched shrimp aguachiles, charred-octopus, and lengua-rare cuts in a beachside-cabin space ten minutes from anywhere.",
    dishes:["Wood-Fire Octopus","Charred Sweet Potato","Provoleta","Skirt Steak","Dulce de Leche"],
    address:"3251 Mary St, Miami FL 33133", lat:25.7309, lng:-80.2395,
    website:"https://www.quintolahuella.com/miami", instagram:"@quintolahuella",
    hours:"Dinner daily; Brunch Sat-Sun"
  },
  {
    id:4196, name:"Habitat at 1 Hotel South Beach", phone:"(305) 604-1000",
    cuisine:"Mediterranean / Seasonal", neighborhood:"South Beach", score:87, price:4,
    tags:["Mediterranean","Date Night","Hotel Restaurant","Outdoor","Brunch","Critics Pick"],
    reservation:"OpenTable",
    description:"Tom Aikens' ground-floor 1 Hotel restaurant — wood-and-coral interiors, foraged-vegetable plates, and a Mediterranean-leaning menu that takes provenance more seriously than most South Beach hotel kitchens.",
    dishes:["Bone Marrow & Toast","Whole Roasted Branzino","Heirloom Tomato","Wood-Grilled Octopus","Chocolate Tart"],
    address:"2341 Collins Ave, Miami Beach FL 33139", lat:25.7991, lng:-80.1276,
    website:"https://www.1hotels.com/south-beach/dining/habitat", instagram:"@habitatmiami",
    menuUrl:"https://www.1hotels.com/south-beach/dining/habitat/menus", hours:"Breakfast, Lunch & Dinner daily"
  },
  {
    id:4197, name:"Caffe Abbracci", phone:"(305) 441-0700",
    cuisine:"Italian", neighborhood:"Coral Gables", score:88, price:4,
    tags:["Italian","Date Night","Iconic","Local Favorites","Wine","Critics Pick"],
    reservation:"OpenTable",
    awards:"Wine Spectator Award of Excellence",
    description:"Nino Pernetti's Coral Gables institution since 1989 — old-school red-sauce-meets-Northern-Italian, an osso buco that hasn't changed in 30 years, and a regulars list that includes most of the Gables' law and finance crowd.",
    dishes:["Osso Buco","Lobster Ravioli","Rack of Lamb","Veal Saltimbocca","Tiramisu"],
    address:"318 Aragon Ave, Coral Gables FL 33134", lat:25.7501, lng:-80.2612,
    website:"https://caffeabbracci.com", instagram:"@caffeabbracci",
    hours:"Lunch & Dinner daily"
  },
  {
    id:4198, name:"Pascal's on Ponce", phone:"(305) 444-2024",
    cuisine:"French", neighborhood:"Coral Gables", score:90, price:4,
    tags:["French","Fine Dining","Date Night","Critics Pick","Wine","Awards"],
    reservation:"OpenTable",
    awards:"AAA Four Diamond, Wine Spectator Award of Excellence",
    description:"Pascal Oudin's Coral Gables French institution since 2000 — a 60-seat room executing classic technique with rotating game and seafood plates. The Gables' answer to whether haute cuisine can survive without theatrics.",
    dishes:["Foie Gras Torchon","Dover Sole","Roasted Squab","Beef Wellington","Crème Brûlée"],
    address:"2611 Ponce de Leon Blvd, Coral Gables FL 33134", lat:25.7476, lng:-80.2583,
    website:"https://pascalmiami.com", instagram:"@pascalsonponce",
    menuUrl:"https://pascalmiami.com/menu", hours:"Dinner Mon-Sat"
  },
  {
    id:4199, name:"Cibo Wine Bar", phone:"(305) 442-4925",
    cuisine:"Italian / Wine Bar", neighborhood:"Coral Gables", score:84, price:3,
    tags:["Italian","Wine Bar","Date Night","Outdoor","Local Favorites"],
    reservation:"OpenTable",
    description:"Coral Gables' polished Italian wine room — house-stretched mozzarella station at the door, an open kitchen, and a list of Italian regional bottles deeper than the chain-restaurant exterior suggests.",
    dishes:["Mozzarella alla Carrettiera","Carbonara","Truffle Pizza","Branzino","Tiramisu"],
    address:"45 Miracle Mile, Coral Gables FL 33134", lat:25.7500, lng:-80.2557,
    website:"https://cibowinebar.com/coral-gables", instagram:"@cibowinebar",
    menuUrl:"https://cibowinebar.com/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4200, name:"Della Test Kitchen", phone:"(786) 391-0758",
    cuisine:"Plant-Based / Casual", neighborhood:"Wynwood", score:84, price:2,
    tags:["Vegan","Plant-Based","Casual","Local Favorites","Counter","Outdoor"],
    reservation:"walk-in",
    description:"Wynwood's plant-based counter inside The Wynwood Yard — bowls, sandwiches, and a wraparound courtyard where the menu's lemon-pepper cauliflower bowl reliably outsells the meat alternatives down the street.",
    dishes:["Lemon Pepper Cauliflower Bowl","Mushroom Burger","Buddha Bowl","Açaí Bowl","Cold Brew"],
    address:"56 NW 29th St, Miami FL 33127", lat:25.8000, lng:-80.1994,
    website:"https://dellatestkitchen.com", instagram:"@dellatestkitchen",
    hours:"Lunch & Dinner daily"
  },
  {
    id:4201, name:"Beat Culture Brewing", phone:"(786) 391-7860",
    cuisine:"Brewery", neighborhood:"Wynwood", score:84, price:2,
    tags:["Brewery","IPA","Casual","Outdoor","Local Favorites"],
    reservation:"walk-in",
    description:"Wynwood's industrial-warehouse brewery — Aaron Allerheiligen's flagship hazy IPAs, a sour program, and a back patio that's the unofficial start of every Wynwood crawl.",
    dishes:["Hazy IPA","West Coast IPA","Sour","Stout","Pretzel"],
    address:"7250 NW 11th St, Miami FL 33126", lat:25.8001, lng:-80.1939,
    website:"https://beatculturebrewing.com", instagram:"@beatculturebrewing",
    hours:"Daily 12pm-12am"
  },
  {
    id:4202, name:"Veza Sur Brewing Co.", phone:"(786) 362-6300",
    cuisine:"Latin Brewery", neighborhood:"Wynwood", score:86, price:2,
    tags:["Brewery","Latin","Outdoor","Live Music","Local Favorites","Casual"],
    reservation:"walk-in",
    description:"AB-InBev's Wynwood Latin-American craft brewery — open-air biergarten, salsa nights every weekend, and a flagship Mango Bro IPA that is the loudest beer in the city for a reason.",
    dishes:["Mango Bro IPA","Latin Lager","Hefeweizen","Empanadas","Yuca Fries"],
    address:"55 NW 25th St, Miami FL 33127", lat:25.8011, lng:-80.1962,
    website:"https://vezasur.com", instagram:"@vezasurmiami",
    hours:"Daily 12pm-12am"
  },
  {
    id:4203, name:"J. Wakefield Brewing", phone:"(786) 254-7779",
    cuisine:"Brewery / Stouts", neighborhood:"Wynwood", score:90, price:2,
    tags:["Brewery","Stout","IPA","Cult","Award Winner","Casual"],
    reservation:"walk-in",
    awards:"World Beer Cup Gold (multiple), RateBeer Top 100",
    description:"Johnathan Wakefield's cult Wynwood brewery — pastry stouts, fruited Berliner Weisses, and barrel-aged imperial stouts that release-Saturday lines for. The Star Wars-themed taproom is a beer-nerd pilgrimage.",
    dishes:["DFPF Stout","Miami Madness","Florida Weisse","Pearly Whites","Patreon Series"],
    address:"120 NW 24th St, Miami FL 33127", lat:25.7995, lng:-80.1975,
    website:"https://jwakefieldbrewing.com", instagram:"@jwakefieldbrewing",
    hours:"Wed-Sun 4pm-12am"
  },
  {
    id:4204, name:"Greenstreet Cafe", phone:"(305) 444-0244",
    cuisine:"American Bistro", neighborhood:"Coconut Grove", score:84, price:2,
    tags:["Brunch","Cafe","Local Favorites","Outdoor","Family Friendly"],
    reservation:"walk-in",
    description:"The Coconut Grove sidewalk cafe that has anchored the corner of Main and Commodore for thirty years — all-day omelets, French-toast brunch, and a patio that's the neighborhood's de facto living room.",
    dishes:["Eggs Benedict","French Toast","Omelet","Cobb Salad","Bloody Mary"],
    address:"3540 Main Hwy, Coconut Grove FL 33133", lat:25.7185, lng:-80.2522,
    website:"https://greenstreetcafe.net", instagram:"@greenstreetcafe",
    hours:"Daily 8am-3am; Brunch all day"
  },
  {
    id:4205, name:"LoKal Burger & Beer", phone:"(305) 442-3377",
    cuisine:"Burgers", neighborhood:"Coconut Grove", score:86, price:2,
    tags:["Burgers","Beer","Casual","Local Favorites","Critics Pick"],
    reservation:"walk-in",
    description:"Matt Kuscher's Coconut Grove burger flagship — locally-sourced single-patty burgers, a 24-tap craft beer wall, and the rare Miami burger spot that competes with the grass-fed-and-aged-cheese Brooklyn standard.",
    dishes:["Frita Burger","Original Burger","Truffle Fries","Local IPA","Key Lime Pie"],
    address:"3190 Commodore Plaza, Coconut Grove FL 33133", lat:25.7278, lng:-80.2451,
    website:"https://lokalmiami.com", instagram:"@lokalburgers",
    menuUrl:"https://lokalmiami.com/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4206, name:"The Anderson", phone:"(305) 757-9105",
    cuisine:"Cocktail Bar", neighborhood:"MiMo", score:88, price:3,
    tags:["Cocktails","Late Night","Local Favorites","Outdoor","Critics Pick"],
    reservation:"walk-in",
    description:"MiMo's polished tropical bar — Will Thompson's pre-Jaguar Sun project, an open-air patio under twinkling lights, and a tiki-leaning cocktail program that put the neighborhood's drinking on the city map.",
    dishes:["Daiquiri","Negroni","Mai Tai","Mezcal Old Fashioned","Bar Snacks"],
    address:"709 NE 79th St, Miami FL 33138", lat:25.8480, lng:-80.1823,
    website:"https://theandersonmiami.com", instagram:"@theandersonmia",
    hours:"Tue-Sun 5pm-3am"
  },
  {
    id:4207, name:"Carpaccio at Bal Harbour Shops", phone:"(305) 867-7777",
    cuisine:"Italian", neighborhood:"Bal Harbour", score:86, price:4,
    tags:["Italian","Date Night","Mall","Lunch","Local Favorites"],
    reservation:"OpenTable",
    description:"The Bal Harbour Shops courtyard Italian — an open-air room next to the koi pond, the same beef carpaccio for thirty years, and a waitstaff that knows half the city by first name.",
    dishes:["Beef Carpaccio","Spaghetti alla Vongole","Branzino","Veal Milanese","Tiramisu"],
    address:"9700 Collins Ave, Bal Harbour FL 33154", lat:25.8882, lng:-80.1250,
    website:"https://carpacciobalharbour.com", instagram:"@carpacciobalharbour",
    menuUrl:"https://carpacciobalharbour.com/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4208, name:"Faena Theater", phone:"(786) 655-5742",
    cuisine:"Cabaret / Dinner Theater", neighborhood:"Mid Beach", score:88, price:4,
    tags:["Cabaret","Live Music","Date Night","Hotel Bar","Scene","Iconic"],
    reservation:"SevenRooms",
    description:"The Faena Hotel's gilded cabaret — Argentine tango, Buenos Aires-inspired burlesque, and small-plate Latin dining served at red velvet booths. The most theatrical date night in Miami, by design.",
    dishes:["Empanada Trio","Provoleta","Steak Skewers","Dulce de Leche Cheesecake","Negroni Sbagliato"],
    address:"3201 Collins Ave, Miami Beach FL 33140", lat:25.8074, lng:-80.1231,
    website:"https://www.faena.com/miami-beach/the-arts/faena-theater", instagram:"@faenahotelmiami",
    hours:"Show schedule varies"
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
