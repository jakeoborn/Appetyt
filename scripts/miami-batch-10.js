const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const TODAY = '2026-04-25';

const NEW_CARDS = [
  {
    id:4224, name:"Wynwood Brewing Company", phone:"(833) 996-9663",
    cuisine:"Brewery / Beer Hall", neighborhood:"Wynwood", score:88, price:2,
    tags:["Brewery","Casual","Family Friendly","Local Favorites","Outdoor","Dog Friendly","Awards","Patio"],
    indicators:["brewery"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Great American Beer Festival Gold Medal 2014 (Pop's Porter); Miami's first craft production brewery",
    description:"Luis Brignoni and his father's Puerto Rican-rooted Wynwood brewery — Miami's first craft production brewery, 18+ taps, an open garage-door taproom with picnic tables, and a beer program that picked up the city's first GABF gold for Pop's Porter. Family-friendly afternoons; brewery indicator confirmed.",
    dishes:["La Rubia Blonde Ale","Laces IPA","Pop's Porter","Father Francisco","Caribbean Sour","Coquí-To"],
    address:"565 NW 24th St, Miami FL 33127", lat:25.8002, lng:-80.2044,
    website:"https://www.wynwoodbrewing.com", instagram:"@wynwoodbrewing",
    menuUrl:"https://www.wynwoodbrewing.com/beers",
    hours:"Daily 12pm-late",
    photoUrl:"", photos:[], bestOf:["#1 Best Brewery (Wynwood)","#2 Best Local Beer"]
  },
  {
    id:4225, name:"Azucar Ice Cream Company", phone:"(305) 381-0369",
    cuisine:"Ice Cream / Cuban", neighborhood:"Little Havana", score:88, price:1,
    tags:["Dessert","Casual","Family Friendly","Local Favorites","Cuban","Iconic","All-Day"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Featured Best Of Miami; National media coverage",
    description:"Suzy Batlle's Calle Ocho ice cream institution — Cuban-American flavors made on premises with locally-sourced ingredients, including the famous Abuela Maria (vanilla ice cream, guava, cream cheese, marie biscuits). The pastel-pink shop has anchored the Calle Ocho dessert run since 2011.",
    dishes:["Abuela Maria","Café con Leche","Mantecado","Mamey","Avocado","Plátano Maduro"],
    address:"1503 SW 8th St, Miami FL 33135", lat:25.7658, lng:-80.2197,
    website:"https://www.azucaricecream.com", instagram:"@azucaricecreamco",
    menuUrl:"https://azucaricecream.com/menu/miami-flavors",
    hours:"Daily 11am-10pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Ice Cream","#1 Best Dessert (Calle Ocho)"]
  },
  {
    id:4226, name:"Tap 42 Coral Gables", phone:"(786) 391-1566",
    cuisine:"American Gastropub / Craft Beer", neighborhood:"Coral Gables", score:84, price:3,
    tags:["Casual","American","Brunch","Happy Hour","Sports Bar","Patio","Family Friendly","Local Favorites"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"https://www.opentable.com/r/tap-42-coral-gables", res_tier:5, verified:TODAY,
    awards:"South Florida Business Journal 'Best Restaurant in South Florida'",
    description:"Coral Gables outpost of the Tap42 mini-chain — 42 craft taps, a brunch program with bottomless mimosas, and a Giralda Plaza patio that anchors the casual end of the street. Game-day fixture for the Gables office crowd.",
    dishes:["Korean BBQ Wings","Burger","Avocado Toast","Bottomless Mimosas","Brussels Sprouts","Truffle Mac"],
    address:"301 Giralda Ave, Coral Gables FL 33134", lat:25.7513, lng:-80.2614,
    website:"https://www.tap42.com/locations/coral-gables", instagram:"@tap42",
    menuUrl:"https://tap42.com/menus/coral-gables/",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#2 Best Sports Bar (CG)","#3 Best Brunch (CG)"]
  },
  {
    id:4227, name:"The Local Craft Food & Drink", phone:"(305) 648-5687",
    cuisine:"Craft Beer / American Gastropub", neighborhood:"Coral Gables", score:85, price:2,
    tags:["Casual","Craft Beer","Happy Hour","Local Favorites","Brunch","Burgers","Patio","Family Friendly"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Coral Gables' neighborhood craft-beer-and-burgers gastropub — 30+ rotating taps focused on Florida breweries, half-pound smashburger, and a back patio that fills with happy-hour office traffic. The Gables version of a serious neighborhood pub.",
    dishes:["Local Smashburger","Truffle Fries","Buffalo Cauliflower","Pork Belly Tacos","Beer Flight","Brunch Bowl"],
    address:"150 Giralda Ave, Coral Gables FL 33134", lat:25.7511, lng:-80.2578,
    website:"https://www.thelocalmiami.com", instagram:"@thelocalcoralgables",
    hours:"Daily 11:30am-12am; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#3 Best Burger (CG)"]
  },
  {
    id:4228, name:"Oasis Wynwood", phone:"(305) 615-1995",
    cuisine:"Outdoor Music & Food Hall", neighborhood:"Wynwood", score:86, price:2,
    tags:["Eat & Play","Live Music","Outdoor","Casual","Family Friendly","Patio","Dog Friendly","Local Favorites"],
    indicators:["outdoor-only"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Wynwood's open-air food hall and music venue — six rotating food kiosks, a center-stage music programming calendar (cumbia to indie), and an artificial-grass courtyard that blurs outdoor restaurant and weekend block party.",
    dishes:["Tacos","Pizza","Smash Burger","Latin Cocktails","Açaí Bowl","Local Beer"],
    address:"2335 N Miami Ave, Miami FL 33127", lat:25.8018, lng:-80.1949,
    website:"https://oasiswynwood.com", instagram:"@oasiswynwood",
    hours:"Wed-Sun 11am-late",
    photoUrl:"", photos:[], bestOf:["#1 Best Eat & Play (Wynwood)","#2 Best Outdoor"]
  },
  {
    id:4229, name:"Daddy Dough Donuts", phone:"(305) 538-7825",
    cuisine:"Donuts / Coffee", neighborhood:"Downtown Miami", score:84, price:1,
    tags:["Dessert","Bakery/Coffee","Casual","Family Friendly","Local Favorites","Breakfast"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"Downtown Miami's brioche-dough donut shop — small-batch yeast and cake donuts with seasonal glazes (passionfruit-pistachio, dulce de leche, key lime), plus a serious cold-brew program. The cult morning stop on the way to the Brickell tower offices.",
    dishes:["Glazed Donut","Maple Bacon","Passionfruit-Pistachio","Dulce de Leche","Cold Brew","Cortado"],
    address:"100 NE 11th St, Miami FL 33132", lat:25.7846, lng:-80.1921,
    website:"https://www.daddydoughnuts.com", instagram:"@daddydough_miami",
    hours:"Daily 7am-7pm",
    photoUrl:"", photos:[], bestOf:["#2 Best Donuts","#3 Best Dessert"]
  },
  {
    id:4230, name:"Mister O1 Extraordinary Pizza Design District", phone:"(786) 360-2299",
    cuisine:"Italian Pizza", neighborhood:"Design District", score:88, price:2,
    tags:["Pizza","Italian","Casual","Family Friendly","Brunch","Local Favorites","Late Night","Patio"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Eater Best Pizza in Miami",
    description:"Renato Viola's Design District location of the cult Mister O1 — wood-fired Star pizza (six points pulled from the dough), Naples-trained crust, and seasonal toppings that don't drift off the formula. The pizza Miamians actually drive across town for.",
    dishes:["Star Sofia","Star Luca","Mister O1 Pizza","Burrata Salad","Star Filomena","Tiramisu"],
    address:"10 NE 41st St, Miami FL 33137", lat:25.8140, lng:-80.1952,
    website:"https://www.mistero1.com", instagram:"@mistero1pizza",
    menuUrl:"https://www.mistero1.com/menu",
    hours:"Lunch & Dinner daily",
    photoUrl:"", photos:[], bestOf:["#1 Best Pizza (Design District)","#2 Best Pizza (Miami)"]
  },
  {
    id:4231, name:"Miami Beach Pizza", phone:"(305) 538-3838",
    cuisine:"NY Pizza / Casual", neighborhood:"South Beach", score:82, price:1,
    tags:["Pizza","Casual","Family Friendly","Late Night","Local Favorites","Hole in the Wall"],
    indicators:["hole-in-the-wall"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"",
    description:"South Beach's no-frills NY-style pizza counter on Alton Road — by-the-slice all day, a stretched dough that hangs over its plate, and a 4am closing window that has fueled a generation of post-LIV taxi rides.",
    dishes:["Cheese Slice","Pepperoni Slice","Sicilian Slice","Garlic Knots","Stromboli","Calzone"],
    address:"1622 Alton Rd, Miami Beach FL 33139", lat:25.7898, lng:-80.1414,
    website:"https://www.miami-beach-pizza.com", instagram:"@miamibeachpizza",
    hours:"Daily 11am-4am",
    photoUrl:"", photos:[], bestOf:["#3 Best NY Pizza","#1 Best Late Night Slice"]
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
['photoUrl','menuUrl','awards','indicators','hh','reservation','reserveUrl','res_tier','verified','bestOf','photos'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });
const DEFAULTS = {phone:'',bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',suburb:false,reserveUrl:'',menuUrl:'',indicators:[],hh:'',awards:'',photoUrl:'',photos:[],res_tier:0,verified:''};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

lines[idx] = `const MIAMI_DATA=${JSON.stringify([...arr, ...merged])};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', merged.length, 'cards. New total:', arr.length + merged.length);
