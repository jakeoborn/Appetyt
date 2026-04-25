const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4174, name:"Le Jardinier Miami", phone:"(305) 521-2526",
    cuisine:"French / Vegetable-Forward", neighborhood:"Design District", score:94, price:4,
    tags:["French","Fine Dining","Michelin Star","Date Night","Critics Pick","Vegetable-Forward","Awards"],
    reservation:"OpenTable",
    awards:"Michelin One Star (multiple years)",
    description:"Alain Verzeroli's vegetable-forward French restaurant in the Design District — Michelin-starred since 2022, a glass-and-greenery room engineered around farm-driven plates and one of the most considered wine pairings in the city.",
    dishes:["Garden Bouquet","Roasted Carrots","Branzino","Black Truffle Risotto","Chocolate Soufflé"],
    address:"151 NE 41st St, Miami FL 33137", lat:25.8148, lng:-80.1920,
    website:"https://lejardinier.com/miami", instagram:"@lejardinier",
    menuUrl:"https://lejardinier.com/miami/menu", hours:"Lunch & Dinner Tue-Sat"
  },
  {
    id:4175, name:"Hutong Miami", phone:"(305) 779-0211",
    cuisine:"Northern Chinese", neighborhood:"Brickell", score:90, price:4,
    tags:["Chinese","Date Night","Scene","Hotel Restaurant","Cocktails","Critics Pick"],
    reservation:"OpenTable",
    description:"London's Aqua Restaurant Group transplanted to Brickell — Northern Chinese cooking served in a black-marble room with a tableside Peking duck program and one of the best dim-sum lunches in Miami.",
    dishes:["Peking Duck","Red Lantern Soft-Shell Crab","Dim Sum","Mapo Tofu","Lychee Martini"],
    address:"1100 Brickell Bay Dr, Miami FL 33131", lat:25.7633, lng:-80.1905,
    website:"https://hutong.co.uk/miami", instagram:"@hutongmiami",
    menuUrl:"https://hutong.co.uk/miami/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4176, name:"La Mar by Gastón Acurio", phone:"(305) 913-8358",
    cuisine:"Peruvian / Nikkei", neighborhood:"Brickell Key", score:91, price:4,
    tags:["Peruvian","Nikkei","Fine Dining","Date Night","Views","Hotel Restaurant","Critics Pick"],
    reservation:"OpenTable",
    awards:"Forbes Travel Guide, Wine Spectator Award of Excellence",
    description:"Gastón Acurio's Brickell Key flagship at the Mandarin Oriental — bayside terrace overlooking the Brickell skyline, ceviches and tiraditos that turned Miami onto serious Peruvian cooking.",
    dishes:["Ceviche Clásico","Tiradito Nikkei","Anticuchos","Lomo Saltado","Pisco Sour"],
    address:"500 Brickell Key Dr, Miami FL 33131", lat:25.7651, lng:-80.1855,
    website:"https://www.mandarinoriental.com/miami/brickell-key/fine-dining/restaurants/peruvian-cuisine/la-mar", instagram:"@lamarmiami",
    hours:"Lunch & Dinner daily"
  },
  {
    id:4177, name:"Toro Toro Miami", phone:"(305) 372-4710",
    cuisine:"Pan-Latin Steakhouse", neighborhood:"Downtown Miami", score:88, price:4,
    tags:["Latin","Steakhouse","Date Night","Brunch","Hotel Restaurant","Cocktails"],
    reservation:"OpenTable",
    description:"Richard Sandoval's Pan-Latin steakhouse at the InterContinental — wood-fire-grilled cuts paired with ceviches and empanadas, a bottomless rum brunch, and a serious cellar of South American reds.",
    dishes:["Tomahawk Asado","Trio of Empanadas","Octopus Anticuchos","Picanha","Tres Leches"],
    address:"100 Chopin Plaza, Miami FL 33131", lat:25.7724, lng:-80.1853,
    website:"https://www.richardsandoval.com/torotoromiami", instagram:"@torotoromiami",
    menuUrl:"https://www.richardsandoval.com/torotoromiami/menu", hours:"Lunch & Dinner daily; Brunch Sat-Sun"
  },
  {
    id:4178, name:"Plant Food + Wine", phone:"(305) 814-5365",
    cuisine:"Plant-Based", neighborhood:"Wynwood", score:88, price:3,
    tags:["Vegan","Plant-Based","Date Night","Critics Pick","Wine","Outdoor"],
    reservation:"Resy",
    description:"Matthew Kenney's plant-based Wynwood restaurant — raw-vegan lasagna, kelp noodles, almond mozzarella, and a natural-wine list that takes the cooking seriously enough to disarm the carnivores.",
    dishes:["Kelp Noodle Cacio e Pepe","Heirloom Tomato Lasagna","Mushroom Carpaccio","Coconut Yogurt","Raw Tiramisu"],
    address:"105 NE 24th St, Miami FL 33137", lat:25.8001, lng:-80.1928,
    website:"https://plantfoodandwine.com/miami", instagram:"@plantfoodandwine",
    menuUrl:"https://plantfoodandwine.com/miami/menu", hours:"Dinner Tue-Sun"
  },
  {
    id:4179, name:"Fiola Miami", phone:"(305) 912-2639",
    cuisine:"Italian", neighborhood:"Coral Gables", score:91, price:4,
    tags:["Italian","Fine Dining","Date Night","Critics Pick","Awards","Hotel Restaurant"],
    reservation:"OpenTable",
    awards:"Forbes Travel Guide Four Stars, Wine Spectator Best of Award",
    description:"Fabio Trabocchi's Coral Gables Italian — the Washington-DC star expanded south with the same lobster-ravioli-and-rare-Barolo program. The Gables' most ambitious tasting-menu room.",
    dishes:["Lobster Ravioli","Branzino al Sale","Tagliolini al Tartufo","Tomahawk Veal Chop","Tiramisu Fiola"],
    address:"1655 SW 22nd St, Coral Gables FL 33145", lat:25.7498, lng:-80.2548,
    website:"https://www.fiolamiami.com", instagram:"@fiolamiami",
    menuUrl:"https://www.fiolamiami.com/menus", hours:"Dinner Tue-Sat"
  },
  {
    id:4180, name:"Chotto Matte Wynwood", phone:"(305) 503-9740",
    cuisine:"Nikkei (Japanese-Peruvian)", neighborhood:"Wynwood", score:88, price:4,
    tags:["Japanese","Peruvian","Nikkei","Date Night","Scene","Cocktails"],
    reservation:"Resy",
    description:"London's Nikkei standard-bearer in Wynwood — robatayaki, sushi, and tiraditos under a graffiti ceiling, a 25-foot bar, and a cocktail program that takes pisco-and-yuzu seriously.",
    dishes:["Robata Lamb Cutlets","Tuna Tiradito","Salmon Maki","Wagyu Sushi","Pisco Sour"],
    address:"1666 NW 1st Ct, Miami FL 33136", lat:25.7911, lng:-80.1977,
    website:"https://chotto-matte.com/miami", instagram:"@chottomattemia",
    menuUrl:"https://chotto-matte.com/miami/menu", hours:"Dinner daily; Brunch Sat-Sun"
  },
  {
    id:4181, name:"The Salty Donut", phone:"(305) 925-8126",
    cuisine:"Bakery / Donuts", neighborhood:"Wynwood", score:90, price:1,
    tags:["Bakery","Donuts","Coffee","Casual","Local Favorites","Critics Pick"],
    reservation:"walk-in",
    awards:"James Beard Foundation Outstanding Bakery semifinalist",
    description:"Andy Rodriguez and Amanda Pizarro's brioche-donut shop that grew from a Wynwood pop-up to a multi-state operation — the maple-bacon and traditional-glazed are still the canonical orders.",
    dishes:["Maple Bacon Donut","Traditional Glazed","Brown Butter & Salt","Guava & Cheese","Cold Brew"],
    address:"50 NW 24th St, Miami FL 33127", lat:25.7996, lng:-80.1959,
    website:"https://saltydonut.com", instagram:"@thesaltydonut",
    menuUrl:"https://saltydonut.com/menu", hours:"Daily 7am-9pm"
  },
  {
    id:4182, name:"Madruga Bakery", phone:"(786) 631-2236",
    cuisine:"Bakery / Coffee", neighborhood:"South Miami", score:88, price:2,
    tags:["Bakery","Pastry","Coffee","Local Favorites","Critics Pick","Brunch"],
    reservation:"walk-in",
    awards:"Eater Miami Restaurant of the Year (Bakery)",
    description:"Naomi Harris and Ross Goldberg's South Miami bakery — natural-leaven bread, kouign-amann, and a small but precise sandwich menu that has Coral Gables and Coconut Grove driving south for the croissants.",
    dishes:["Kouign-Amann","Country Loaf","Egg Sandwich","Almond Croissant","Cortado"],
    address:"5780 Sunset Dr, South Miami FL 33143", lat:25.7034, lng:-80.3085,
    website:"https://madrugabakery.com", instagram:"@madrugabakery",
    hours:"Tue-Sun 7am-3pm"
  },
  {
    id:4183, name:"Pinch Kitchen", phone:"(786) 953-7008",
    cuisine:"American / Bistro", neighborhood:"MiMo", score:87, price:3,
    tags:["American","Brunch","Local Favorites","Critics Pick","Date Night","Outdoor"],
    reservation:"Resy",
    description:"Rene Reyes' tight, 30-seat MiMo bistro — short-rib eggs benedict, fried-chicken sandwiches, and a regularly-rotating dinner menu that quietly became one of the city's most reliable critics' picks.",
    dishes:["Short-Rib Benedict","Fried Chicken Sandwich","Burger","Crispy Skin Branzino","Bourbon Pecan Pie"],
    address:"5505 NE 2nd Ave, Miami FL 33137", lat:25.8264, lng:-80.1916,
    website:"https://pinchmiami.com", instagram:"@pinchmiami",
    menuUrl:"https://pinchmiami.com/menu", hours:"Brunch & Dinner Wed-Sun"
  },
  {
    id:4184, name:"Doce Provisions", phone:"(305) 631-2229",
    cuisine:"Cuban / American", neighborhood:"Little Havana", score:86, price:2,
    tags:["Cuban","American","Brunch","Local Favorites","Critics Pick","Casual"],
    reservation:"Resy",
    description:"Lisetty Llampallas' Cuban-American mash-up on Calle Ocho — pork-belly Cubans, plantain-crusted snapper, and the rum cocktail program that finally made the neighborhood drinkable for the under-50 set.",
    dishes:["Pork Belly Cubano","Plantain-Crusted Snapper","Truffle Croquetas","Picadillo Tacos","Tres Leches"],
    address:"541 SW 12th Ave, Miami FL 33130", lat:25.7679, lng:-80.2144,
    website:"https://doceprovisions.com", instagram:"@doceprovisions",
    menuUrl:"https://doceprovisions.com/menu", hours:"Brunch & Dinner Wed-Sun"
  },
  {
    id:4185, name:"Bayshore Club Coconut Grove", phone:"(305) 537-7700",
    cuisine:"American / Waterfront", neighborhood:"Coconut Grove", score:85, price:3,
    tags:["Waterfront","American","Date Night","Outdoor","Brunch","Views"],
    reservation:"OpenTable",
    description:"The Coconut Grove Sailing Club building reborn as a waterfront American restaurant — Pan-Latin small plates, raw bar, and a wraparound deck that is the neighborhood's most picturesque sunset spot.",
    dishes:["Whole Snapper","Raw Bar Tower","Aji Tuna Crudo","Lobster Roll","Key Lime Pie"],
    address:"3501 Pan American Dr, Miami FL 33133", lat:25.7293, lng:-80.2357,
    website:"https://bayshoreclubmiami.com", instagram:"@bayshoreclubmiami",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun"
  },
  {
    id:4186, name:"The Citadel", phone:"(305) 351-5000",
    cuisine:"Food Hall", neighborhood:"Little Haiti", score:84, price:2,
    tags:["Food Hall","Casual","Local Favorites","Brunch","Cocktails"],
    reservation:"walk-in",
    description:"Little Haiti's adaptive-reuse food hall — a single roof over 16 stalls including Hometown BBQ, Pueblo Bowls, La Santa Taqueria, and a rooftop bar that wakes the neighborhood every Friday.",
    dishes:["Brisket Plate","Açaí Bowl","Carnitas Tacos","Espresso Martini","Roof Cocktails"],
    address:"8300 NE 2nd Ave, Miami FL 33138", lat:25.8523, lng:-80.1931,
    website:"https://thecitadelmiami.com", instagram:"@thecitadelmiami",
    hours:"Daily 10am-12am"
  },
  {
    id:4187, name:"Buya Ramen", phone:"(786) 615-5031",
    cuisine:"Japanese Ramen", neighborhood:"Wynwood", score:86, price:2,
    tags:["Japanese","Ramen","Casual","Local Favorites","Late Night"],
    reservation:"walk-in",
    description:"Wynwood ramen counter — proper tonkotsu broth, hand-pulled noodles, and a soft-yolk ajitama that holds up against the larger New York and LA shops. The closest Miami has to a Sapporo izakaya.",
    dishes:["Tonkotsu Ramen","Spicy Miso","Karaage","Pork Buns","Sapporo Draft"],
    address:"2700 N Miami Ave, Miami FL 33127", lat:25.8028, lng:-80.1954,
    website:"https://buyaramen.com", instagram:"@buyaramenmiami",
    menuUrl:"https://buyaramen.com/menu", hours:"Lunch & Dinner daily"
  },
  {
    id:4188, name:"Tigertail + Mary", phone:"(305) 442-1818",
    cuisine:"Modern American", neighborhood:"South Miami", score:85, price:3,
    tags:["Modern American","Brunch","Local Favorites","Date Night","Outdoor","Critics Pick"],
    reservation:"Resy",
    description:"Steven Ferdman and Lisetty Llampallas' South Miami restaurant — an ivy-covered patio doing burrata and stone-fruit salads in summer, oysters and confit-duck in fall. The neighborhood's most thoughtful seasonal kitchen.",
    dishes:["Burrata & Peach","Confit Duck","Oysters","Brick Chicken","Pavlova"],
    address:"5829 SW 73rd St, South Miami FL 33143", lat:25.7037, lng:-80.2878,
    website:"https://tigertailandmary.com", instagram:"@tigertailandmary",
    menuUrl:"https://tigertailandmary.com/menu", hours:"Brunch & Dinner Wed-Sun"
  },
  {
    id:4189, name:"Krüs Kitchen", phone:"(305) 397-8553",
    cuisine:"Mediterranean / Wood-Fire", neighborhood:"Wynwood", score:86, price:3,
    tags:["Mediterranean","Wood-Fire","Date Night","Brunch","Critics Pick","Outdoor"],
    reservation:"OpenTable",
    description:"Wynwood's Mediterranean-meets-Mexican wood-oven restaurant — chef Felipe Bolaños' hardwood-grilled meats, charred-cabbage steaks, and seasonal pastas. A grown-up alternative in a neighborhood crowded with influencer rooms.",
    dishes:["Charred Cabbage Steak","Wood-Grilled Branzino","Squid Ink Pasta","Bone-In Pork Chop","Olive Oil Cake"],
    address:"3252 NE 1st Ave, Miami FL 33137", lat:25.8073, lng:-80.1934,
    website:"https://kruskitchen.com", instagram:"@kruskitchen",
    menuUrl:"https://kruskitchen.com/menu", hours:"Brunch & Dinner Wed-Sun"
  },
  {
    id:4190, name:"Toscana Divino", phone:"(305) 371-2767",
    cuisine:"Italian / Tuscan", neighborhood:"Brickell", score:88, price:4,
    tags:["Italian","Date Night","Critics Pick","Wine","Hotel Restaurant"],
    reservation:"OpenTable",
    awards:"Wine Spectator Award of Excellence",
    description:"Andrea Curto-Randazzo's Tuscan room in Brickell — handmade pici, bistecca-alla-Fiorentina cut tableside, and a Super-Tuscan list that earned the Wine Spectator nod. The Florentine Brickell wants you to think it deserves.",
    dishes:["Pici al Cinghiale","Bistecca alla Fiorentina","Burrata","Truffle Risotto","Cantucci"],
    address:"3585 NE 1st Ave, Miami FL 33137", lat:25.8091, lng:-80.1926,
    website:"https://toscanadivino.com", instagram:"@toscanadivinomia",
    menuUrl:"https://toscanadivino.com/menu", hours:"Dinner daily"
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
