// Fix Vegas Cosmopolitan data issues:
// 1) Remove duplicates: "X Las Vegas" variants of existing entries
// 2) Normalize neighborhood to "The Strip (The Cosmopolitan)"
// 3) Also remove "Egg Slut" vs "Eggslut" and similar spelling dupes
// 4) Add verified missing Cosmopolitan restaurants (The Henry, Blue Ribbon, Milk Bar, Holsteins, Red Plate, etc.)
// Run: node scripts/fix-vegas-cosmopolitan.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const s = html.indexOf('const LV_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
const arr = JSON.parse(html.slice(a, e));
console.log('Before:', arr.length);

// 1) Identify duplicates — same base name in Cosmopolitan
//    Keep the shorter name (original, not "X Las Vegas")
const keep = [];
const removed = [];
const seenBase = {};

// Normalize Cosmopolitan neighborhood names first
arr.forEach(r => {
  const nbhd = r.neighborhood || '';
  if (nbhd === 'The Strip (Cosmopolitan)') r.neighborhood = 'The Strip (The Cosmopolitan)';
});

// Build dup map
const cosmoRecords = arr.filter(r => (r.neighborhood||'').indexOf('Cosmopolitan') > -1);
const nameGroup = {};
cosmoRecords.forEach(r => {
  // Normalize name base: strip " Las Vegas", case-insensitive, collapse "Egg Slut" -> "Eggslut"
  let base = (r.name||'').toLowerCase();
  base = base.replace(/\s+las vegas$/,'').replace(/^egg\s+slut/,'eggslut').trim();
  if (!nameGroup[base]) nameGroup[base] = [];
  nameGroup[base].push(r);
});

const idsToRemove = new Set();
Object.keys(nameGroup).forEach(base => {
  const group = nameGroup[base];
  if (group.length <= 1) return;
  // Keep the shortest name; remove others
  group.sort((x, y) => x.name.length - y.name.length);
  const keeper = group[0];
  console.log('  DUP at Cosmopolitan:', group.map(r=>r.name).join(' / '), '-> keeping', keeper.name);
  for (let i = 1; i < group.length; i++) idsToRemove.add(group[i].id);
});

const deduped = arr.filter(r => !idsToRemove.has(r.id));
console.log('Removed', arr.length - deduped.length, 'duplicates');

// 2) Add verified missing Cosmopolitan restaurants
const existing = new Set(deduped.map(r => r.name.toLowerCase()));
let nextId = Math.max(...deduped.map(r => r.id || 0)) + 1;

const cosmoAdds = [
  {name:"The Henry",cuisine:"American Tavern",neighborhood:"The Strip (The Cosmopolitan)",score:83,price:2,tags:["American","All-Day","Brunch","Casual"],description:"24/7 modern American tavern at The Cosmopolitan serving breakfast, lunch, dinner, and late-night. Comfort food classics with a fresh twist — avocado toast, burgers, chicken-and-waffles. Open around the clock, making it a Cosmopolitan staple for any time of day.",dishes:["Chicken & Waffles","Burger","Avocado Toast","All-Day Breakfast"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7000",lat:36.1099,lng:-115.1729,instagram:"thehenrylv",website:"https://www.cosmopolitanlasvegas.com/restaurants/the-henry"},
  {name:"Blue Ribbon Sushi Bar & Grill",cuisine:"Japanese",neighborhood:"The Strip (The Cosmopolitan)",score:86,price:4,tags:["Japanese","Sushi","Late Night","Cocktails"],description:"The NYC sushi icon's Vegas outpost on the Cosmopolitan's 3rd floor. Wood-burning grill, extensive sashimi selection, and a late-night menu perfect for post-clubbing bites. The Buried Treasure (salmon roe over tuna tartare) is a signature.",dishes:["Buried Treasure","Oxtail Dumplings","Wood-Grilled Robata","Sushi Omakase"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-2000",lat:36.1099,lng:-115.1729,instagram:"blueribbonrestaurants",website:"https://www.blueribbonrestaurants.com/restaurants/blue-ribbon-sushi-bar-grill-las-vegas"},
  {name:"Milk Bar",cuisine:"Dessert",neighborhood:"The Strip (The Cosmopolitan)",score:85,price:1,tags:["Dessert","Bakery","Iconic","Ice Cream"],description:"Christina Tosi's dessert empire — Cereal Milk Soft Serve, Crack Pie (Milk Bar Pie), Compost Cookies, and Birthday Truffle. The Cosmopolitan outpost is open late and perfect for a sugary nightcap.",dishes:["Cereal Milk Soft Serve","Milk Bar Pie","Compost Cookie","Birthday Truffles"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7000",lat:36.1099,lng:-115.1729,instagram:"milkbarstore",website:"https://milkbarstore.com"},
  {name:"Holsteins Shakes and Buns",cuisine:"Burgers",neighborhood:"The Strip (The Cosmopolitan)",score:82,price:2,tags:["Burgers","Shakes","Casual","Family Friendly"],description:"Gourmet burgers and over-the-top boozy milkshakes at the Cosmopolitan. The Bam Bam Rita (burger with fried jalapeños) and the Cookie Monster shake (a sugar coma in a glass) are the signatures.",dishes:["Bam Bam Rita","Cookie Monster Shake","Truffle Burger","Loaded Fries"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7940",lat:36.1099,lng:-115.1729,instagram:"holsteinslv",website:"https://www.cosmopolitanlasvegas.com/restaurants/holsteins"},
  {name:"Red Plate",cuisine:"Chinese",neighborhood:"The Strip (The Cosmopolitan)",score:85,price:4,tags:["Chinese","Fine Dining","Dim Sum","View"],description:"Contemporary Chinese fine dining on the Cosmopolitan's top floor with floor-to-ceiling windows overlooking the Strip. Dim sum, Peking duck, and Cantonese classics elevated with modern presentation. A destination for Chinese New Year celebrations.",dishes:["Peking Duck","Dim Sum","Lobster Noodles","Steamed Fish"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7000",lat:36.1099,lng:-115.1729,instagram:"redplatelv",website:"https://www.cosmopolitanlasvegas.com/restaurants/red-plate"},
  {name:"Overlook Grill",cuisine:"American",neighborhood:"The Strip (The Cosmopolitan)",score:80,price:2,tags:["American","Pool","Casual","Daytime"],description:"Casual poolside dining at the Cosmopolitan's Boulevard Pool overlooking the Strip. Burgers, salads, and fresh catch with the Bellagio Fountains in view. The pool-area drinks and sun-soaked patio make it a summer-day favorite.",dishes:["Burgers","Poke Bowls","Pool Cocktails","Seared Ahi"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7940",lat:36.1099,lng:-115.1729,instagram:"",website:"https://www.cosmopolitanlasvegas.com/restaurants/overlook-grill"},
];
let added = 0;
cosmoAdds.forEach(sp => {
  if (existing.has(sp.name.toLowerCase())) { console.log('  SKIP (exists):', sp.name); return; }
  deduped.push({
    id: nextId++, name: sp.name, phone: sp.phone || '', cuisine: sp.cuisine,
    neighborhood: sp.neighborhood, score: sp.score, price: sp.price || 0,
    tags: sp.tags, indicators: [], hh: '', reservation: sp.reservation || 'OpenTable',
    awards: '', description: sp.description, dishes: sp.dishes || [],
    address: sp.address, hours: '', lat: sp.lat, lng: sp.lng,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '', instagram: sp.instagram || '', website: sp.website || '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 3,
  });
  existing.add(sp.name.toLowerCase());
  added++;
  console.log('  ADDED:', sp.name);
});

console.log('\nAfter:', deduped.length, '(removed', arr.length - deduped.length + idsToRemove.size - idsToRemove.size, ', added', added + ')');
console.log('Net change:', deduped.length - arr.length);

html = html.slice(0, a) + JSON.stringify(deduped) + html.slice(e);
fs.writeFileSync(file, html);
console.log('\n✅ Done.');
