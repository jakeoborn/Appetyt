const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const TODAY = '2026-04-25';

const NEW_CARDS = [
  {
    id:4209, name:"11th Street Diner", phone:"(305) 534-6373",
    cuisine:"Diner / All-Day American", neighborhood:"South Beach", score:86, price:2,
    tags:["Casual","Diner","All-Day","Late Night","Brunch","Local Favorites","Family Friendly","Breakfast"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Historic Miami Beach landmark; original 1948 Pennsylvania dining car",
    description:"Authentic 1948 Art Deco dining car relocated from Paterson, Pennsylvania and reopened on Washington Avenue in 1992. Open 24 hours Friday and Saturday, 7:30am-midnight other days — all-day breakfast, hot turkey sandwiches at 3am, and a stainless-steel counter that has held up four decades of South Beach.",
    dishes:["All-Day Breakfast","Hamburger and Fries","Milkshake","Twin Lobster Tails","Atlantic Salmon","Roasted Leg of Lamb","Surf and Turf"],
    address:"1065 Washington Ave, Miami Beach FL 33139", lat:25.7818, lng:-80.1323,
    website:"https://www.eleventhstreetdiner.com", instagram:"@11thstreetdiner",
    menuUrl:"", hours:"Sun-Thu 7:30am-11:55pm, Fri-Sat 24 hours",
    photoUrl:"", photos:[], bestOf:["#1 Best Late Night","#3 Best All-Day"]
  },
  {
    id:4210, name:"Threefold Cafe", phone:"(305) 704-8007",
    cuisine:"Australian / All-Day Café", neighborhood:"Coral Gables", score:88, price:2,
    tags:["Brunch","Bakery/Coffee","Casual","Local Favorites","Family Friendly","Date Night","Patio","Healthy"],
    indicators:["vegetarian"], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Eater Miami Best Coffee Shops",
    description:"Australian-inspired all-day café in Coral Gables founded by Nick Sharma and Teresa Hadid from Melbourne — flat whites pulled with locally-roasted beans, smashed-avocado toast on house-baked sourdough, and a back patio that anchors the Giralda Plaza dining scene. Helped reset Miami's brunch standard.",
    dishes:["Smashed Avocado Toast","Eggs Benedict","Buttermilk Pancakes","French Toast","Flat White","Cold Brew","Acai Bowl"],
    address:"141 Giralda Ave, Coral Gables FL 33134", lat:25.7514, lng:-80.2576,
    website:"https://www.threefoldcafe.com", instagram:"@threefoldcafe",
    menuUrl:"https://order.toasttab.com/online/threefold-giralda-141-giralda-avenue",
    hours:"Mon-Thu 7:30am-3pm, Fri-Sun 7:30am-4pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Brunch (Coral Gables)","#2 Best Coffee Shop"]
  },
  {
    id:4211, name:"Bulla Gastrobar Coral Gables", phone:"(305) 441-0107",
    cuisine:"Spanish Tapas", neighborhood:"Coral Gables", score:87, price:3,
    tags:["Spanish","Tapas","Brunch","Date Night","Casual","Patio","Happy Hour","Local Favorites"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"https://www.opentable.com/r/bulla-gastrobar-coral-gables", res_tier:5, verified:TODAY,
    awards:"Miami New Times Best Brunch (2024); OpenTable Diners' Choice 2024; Restaurants from Spain certified by ICEX",
    description:"Madrid-style gastrobar on Giralda Plaza — chef Daniel Bojorquez's tapas program from Madrid's Bulla group, certified by ICEX as authentic Spanish, and a patio that turns into the loudest weekend brunch in Coral Gables. Sangria pitchers, paella, and a tortilla española the city has been imitating for a decade.",
    dishes:["Patatas Bravas","Huevos Bulla","Chorizo Plate","Tortilla Española","Mediterranean Olives","Croquetas","Paella de Mariscos"],
    address:"2500 Ponce de Leon Blvd, Coral Gables FL 33134", lat:25.7485, lng:-80.2589,
    website:"https://www.bullagastrobar.com", instagram:"@bullagastrobar",
    menuUrl:"https://bullagastrobar.com/menus/coral-gables/",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun",
    photoUrl:"", photos:[], bestOf:["#1 Best Spanish Tapas","#2 Best Brunch"]
  },
  {
    id:4212, name:"Pisco y Nazca Doral", phone:"(786) 535-9154",
    cuisine:"Peruvian Ceviche / Gastrobar", neighborhood:"Doral", score:85, price:3,
    tags:["Peruvian","Ceviche","Brunch","Happy Hour","Date Night","Cocktails","Local Favorites","Casual"],
    indicators:[], hh:"",
    reservation:"OpenTable", reserveUrl:"https://www.opentable.com/r/pisco-y-nazca-doral", res_tier:5, verified:TODAY,
    awards:"",
    description:"Doral Peruvian gastrobar from the CIRSA group — open-kitchen ceviche bar, pisco-forward cocktail program, and a serious by-the-pour list of Peruvian wines. The spillover destination when West Miami's Lima diaspora wants familiar cooking on a Sunday brunch.",
    dishes:["Ceviche Clásico","Tiradito Nikkei","Lomo Saltado","Anticuchos de Corazón","Aji de Gallina","Pisco Sour","Churros con Manjar"],
    address:"8551 NW 53rd St #A101, Doral FL 33166", lat:25.8200, lng:-80.3367,
    website:"https://www.piscoynazca.com", instagram:"@piscoynazca",
    menuUrl:"https://piscoynazca.com/doral/menus/",
    hours:"Lunch & Dinner daily; Brunch Sat-Sun",
    photoUrl:"https://piscoynazca.com/wp-content/uploads/2020/02/ceviche-doral-300x300.jpg", photos:[],
    bestOf:["#1 Best Peruvian (West Miami)","#3 Best Happy Hour"]
  },
  {
    id:4213, name:"Vicky Bakery", phone:"(305) 552-7848",
    cuisine:"Cuban Bakery", neighborhood:"Westchester", score:86, price:1,
    tags:["Bakery/Coffee","Cuban","Casual","Family Friendly","Local Favorites","Breakfast","Dessert"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Family-owned since 1972 (third-generation operator)",
    description:"Family-owned Cuban bakery since 1972 — pastelito recipes passed down from abuelo to abuelito across three generations. The Westchester flagship is the canonical morning stop for guava-and-cheese, croquetas, and cafecito; the brand has since expanded across Florida.",
    dishes:["Pastelitos de Guayaba y Queso","Croquetas de Jamón","Cafecito","Pan con Bistec","Flan Pastelitos","Empanadas","Cuban Bread"],
    address:"11790 SW 8th St, Miami FL 33184", lat:25.7625, lng:-80.3197,
    website:"https://www.vickybakery.com", instagram:"@vickybakery",
    menuUrl:"https://www.vickybakery.com/our-menu/",
    hours:"Daily early morning to evening (verify per location)",
    photoUrl:"", photos:[], bestOf:["#1 Best Cuban Bakery (West Miami)"]
  },
  {
    id:4214, name:"Ms. Cheezious", phone:"(305) 989-4019",
    cuisine:"Grilled Cheese / Comfort Food", neighborhood:"Upper East Side", score:86, price:2,
    tags:["Casual","Local Favorites","Family Friendly","Comfort Food","Late Night","Viral"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Food Network Top 25 Food Trucks in the Country",
    description:"Brian Mullins' award-winning grilled-cheese empire — started as a 2010 food truck, named to Food Network's Top 25 Food Trucks in the Country before opening this 83rd Street brick-and-mortar location. Forty grilled-cheese variations and zero pretense.",
    dishes:["Grilled Blue & Bacon","BBQ Pulled Pork Melt","Crabby Cheese Melt","Southern Fried Chicken & Waffle Melt","Frito Pie Melt","S'Mores Melt","Patty Melt"],
    address:"533 NE 83rd St, Miami FL 33138", lat:25.8519, lng:-80.1855,
    website:"https://www.mscheezious.com", instagram:"@mscheezious",
    menuUrl:"http://www.mscheezious.shop/",
    hours:"Daily 11:30am-10:30pm",
    photoUrl:"", photos:[], bestOf:["#1 Best Grilled Cheese","#2 Best Late Night Casual"]
  },
  {
    id:4215, name:"Islas Canarias Restaurant", phone:"(305) 559-6666",
    cuisine:"Cuban", neighborhood:"Westchester", score:88, price:2,
    tags:["Cuban","Casual","Family Friendly","Local Favorites","Iconic","Breakfast","Brunch","All-Day"],
    indicators:[], hh:"",
    reservation:"walk-in", reserveUrl:"", res_tier:5, verified:TODAY,
    awards:"Family-owned since 1977; Miami Cuban institution",
    description:"Family-owned Westchester Cuban restaurant since 1977 — the croquetas are widely considered the city's gold standard, and the ventanita opens at 7am for cafecito traffic that hasn't slowed in nearly five decades. The yardstick locals use to judge any other Cuban place.",
    dishes:["Croquetas de Jamón","Cubano Sandwich","Vaca Frita","Lechón Asado","Picadillo","Cafecito","Tres Leches"],
    address:"13695 SW 26th St, Miami FL 33175", lat:25.7452, lng:-80.4159,
    website:"https://islascanariasrestaurant.com", instagram:"@islascanariasrestaurant",
    menuUrl:"",
    hours:"Sun-Thu 7:30am-10pm, Fri-Sat 7:30am-11pm; Ventanita from 7am",
    photoUrl:"", photos:[], bestOf:["#1 Best Croquetas","#2 Best Cuban Restaurant (West Miami)"]
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
