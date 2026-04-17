const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const DALLAS_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=s.phone||''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=s.hours||''; s.dishes=s.dishes||[];
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

add({
  name: "Cafe Dior by Dominique Crenn",
  cuisine: "French / Cafe",
  neighborhood: "Highland Park",
  score: 92, price: 4,
  tags: ["Fine Dining", "French", "Date Night", "Exclusive", "Cocktails", "Brunch", "Celebrations"],
  indicators: ["celebrity-chef", "new-opening"],
  description: "Three-Michelin-starred chef Dominique Crenn brings her culinary vision to Highland Park Village inside the Dior boutique. Afternoon tea, caviar service, and refined French dishes in a stunning fashion-house setting.",
  dishes: ["Salmon Marbella", "Caviar & Watercress Choux", "Afternoon Tea", "Pina Colada Baba au Rhum"],
  address: "58 Highland Park Village, Dallas, TX 75205",
  lat: 32.8336, lng: -96.8009,
  phone: "",
  instagram: "@cafediordallas",
  website: "https://www.cafediordallas.com/",
  reservation: "Resy", photoUrl: "",
  hours: "Mon-Sat 10AM-6PM, Sun 12PM-5PM",
  awards: "CultureMap Best New Restaurant Nominee 2026, Michelin 3-Star Chef"
});

add({
  name: "Little Blue Bistro",
  cuisine: "French Bistro / Wine Bar",
  neighborhood: "Bishop Arts",
  score: 88, price: 3,
  tags: ["French", "Wine Bar", "Date Night", "Cocktails", "Seafood", "Local Favorites", "Romantic"],
  indicators: ["hidden-gem", "new-opening"],
  description: "Charming French bistro and natural wine bar housed in a 1945 Bishop Arts cottage. Oysters, escargot, Caesar salad, and Wagyu pot roast in an intimate candlelit setting.",
  dishes: ["Escargot", "Oysters", "Caesar Salad", "Wagyu Pot Roast"],
  address: "320 W 8th St, Dallas, TX 75208",
  lat: 32.7448, lng: -96.8262,
  phone: "(214) 247-6454",
  instagram: "@littlebluedallas",
  website: "https://littlebluebistro.com/",
  reservation: "Resy", photoUrl: "",
  hours: "Wed-Sun 5PM-12AM",
  awards: "CultureMap Best New Restaurant Nominee 2026"
});

add({
  name: "Vaqueros Texas Bar-B-Q",
  cuisine: "BBQ / Mexican-Influenced",
  neighborhood: "Allen",
  score: 89, price: 2,
  tags: ["BBQ", "Mexican", "Casual", "Local Favorites", "Family Friendly", "Patio"],
  indicators: ["new-opening"],
  description: "Award-winning BBQ with Mexican influence at Watters Creek in Allen. Brisket, pork carnitas, birria tacos, apple-Gorgonzola slaw, and three-cheese mac from the celebrated food truck turned brick-and-mortar.",
  dishes: ["Brisket", "Birria Tacos", "Pork Carnitas", "Three-Cheese Mac"],
  address: "965 Garden Park Dr, Allen, TX 75013",
  lat: 33.1170, lng: -96.6693,
  phone: "(214) 531-3101",
  instagram: "@vaquerostxbbq",
  website: "https://vaquerostxbbq.com/",
  reservation: "walk-in", photoUrl: "",
  hours: "Sun-Thu 11AM-8PM, Fri-Sat 11AM-9PM",
  awards: "CultureMap Best New Restaurant Nominee 2026, Texas Monthly featured"
});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nDallas total:', arr.length);
