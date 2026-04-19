// Add TAO (Chicago + LA) and Super Peach by Momofuku (LA) — David Chang's LA flagship.
// Addresses verified from official websites (taogroup.com, westfield.com, momofuku.com).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function e(id, data) {
  return {
    id,name:'',phone:'',cuisine:'',neighborhood:'',score:88,price:4,tags:[],
    indicators:[],hh:'',reservation:'OpenTable',awards:'',
    description:'',dishes:[],address:'',hours:'',lat:0,lng:0,group:'',
    instagram:'',website:'',res_tier:0,photoUrl:'',bestOf:[],busyness:null,
    waitTime:null,popularTimes:null,lastUpdated:null,trending:false,suburb:false,
    reserveUrl:'',menuUrl:'',verified:'2026-04-18',
    ...data,
  };
}

const chicago = parseArray('const CHICAGO_DATA');
const la = parseArray('const LA_DATA');
const chiId = Math.max(...chicago.map(r => r.id)) + 1;
const laId1 = Math.max(...la.map(r => r.id)) + 1;
const laId2 = laId1 + 1;

const taoChi = e(chiId, {
  name: "TAO Chicago",
  cuisine: "Pan-Asian",
  neighborhood: "River North",
  score: 87, price: 4,
  tags: ["Asian","Date Night","Cocktails","Late Night","Celebrations","Sit-Down"],
  description: "The 25-year-old River North Pan-Asian palace with a 16-foot Buddha watching over a dining room that turns into a nightclub after 10pm. Crispy chicken lettuce wraps, satay of Chilean sea bass, a sushi program that's actually serious despite the thumping bassline. Not subtle. Never tried to be.",
  dishes: ["Crispy Chicken Lettuce Wraps","Satay of Chilean Sea Bass","Peking Duck"],
  address: "632 N Dearborn St, Chicago, IL 60654",
  lat: 41.8921, lng: -87.6294,
  phone: "(224) 888-0388",
  website: "https://taogroup.com/venues/tao-chicago/",
  instagram: "@taochicago",
  cityLinks: ["Las Vegas","New York","Los Angeles"],
});

const taoLA = e(laId1, {
  name: "TAO Los Angeles",
  cuisine: "Pan-Asian",
  neighborhood: "Hollywood",
  score: 86, price: 4,
  tags: ["Asian","Date Night","Cocktails","Late Night","Celebrations","Sit-Down"],
  description: "Two-level Hollywood spectacle — a 16-foot Buddha statue, a main dining room anchored in that Buddha's shadow, and a lounge that turns the whole thing up to 11 after dark. Crispy chicken lettuce wraps, satay, and enough sushi to justify the ticket. Dinner as theater.",
  dishes: ["Crispy Chicken Lettuce Wraps","Satay of Chilean Sea Bass","Maki Tasting"],
  address: "6421 Selma Ave, Los Angeles, CA 90028",
  lat: 34.1017, lng: -118.3291,
  phone: "(323) 593-7888",
  website: "https://taogroup.com/venues/tao-asian-bistro-los-angeles/",
  instagram: "@taolosangeles",
  cityLinks: ["Las Vegas","New York","Chicago"],
});

const superPeachLA = e(laId2, {
  name: "Super Peach by Momofuku",
  cuisine: "Modern Asian / Fast Casual",
  neighborhood: "Century City",
  score: 90, price: 3,
  tags: ["Asian","Sit-Down","Critics Pick","Trending","Date Night"],
  description: "David Chang's LA debut — 196 seats at Westfield Century City, designed by the same INC team that did Momofuku Noodle Bar in NYC. Fried chicken that earns the Momofuku name, bing with egg, and the spicy peach rice that inspired the whole concept. Mall address, destination food.",
  dishes: ["Momofuku Fried Chicken","Bing with Egg","Spicy Peach Rice"],
  address: "10250 Santa Monica Blvd, Los Angeles, CA 90067",
  lat: 34.0585, lng: -118.4184,
  phone: "(310) 553-5300",
  website: "https://www.momofuku.com/restaurants/super-peach",
  instagram: "@superpeachla",
  awards: "David Chang — James Beard Outstanding Chef 2013",
  trending: true,
  cityLinks: ["New York","Las Vegas"],
});

chicago.push(taoChi);
la.push(taoLA, superPeachLA);

const chicagoPos = locateArray('const CHICAGO_DATA');
const laPos = locateArray('const LA_DATA');

// Write bottom-up
const writes = [
  {pos: chicagoPos, data: chicago, varName: 'const CHICAGO_DATA'},
  {pos: laPos, data: la, varName: 'const LA_DATA'},
].sort((a,b) => b.pos.arrS - a.pos.arrS);
writes.forEach(w => {
  const freshPos = locateArray(w.varName);
  html = html.substring(0, freshPos.arrS) + JSON.stringify(w.data) + html.substring(freshPos.arrE);
});

// Now update cityLinks on existing TAO and Momofuku entries:
// - TAO Vegas: #12027, 12179, 12353 (3 entries)
// - TAO NYC: #1186, 1259
// - Momofuku NYC: #1533 (Noodle Bar), #1927 (check); and Majordomo LA #2025
// - Momofuku Vegas: #12187, 12518
const cities = {'Las Vegas':'const LV_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA'};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

const updates = [
  // TAO siblings — add Chicago + LA
  ['Las Vegas', 12027, 'TAO', ['Chicago','Los Angeles']],
  ['Las Vegas', 12179, 'TAO', ['Chicago','Los Angeles']],
  ['Las Vegas', 12353, 'TAO', ['Chicago','Los Angeles']],
  ['New York', 1186, 'TAO', ['Chicago','Los Angeles']],
  ['New York', 1259, 'TAO', ['Chicago','Los Angeles']],
];

let fixes = 0;
updates.forEach(([city, id, brandPrefix, toAdd]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r) { console.log('  ! missing ' + city + '#' + id); return; }
  // Word-boundary check: name must start with the brand word
  if (!new RegExp('^\\s*' + brandPrefix + '\\b', 'i').test(r.name)) {
    console.log('  ! skipping ' + city + '#' + id + ' "' + r.name + '" — name does not start with ' + brandPrefix);
    return;
  }
  const existing = Array.isArray(r.cityLinks) ? r.cityLinks.slice() : [];
  const set = new Set(existing);
  const added = [];
  toAdd.forEach(c => { if (!set.has(c)) { existing.push(c); added.push(c); } });
  if (added.length) {
    r.cityLinks = existing;
    fixes += added.length;
    console.log(`  ${city}#${id} "${r.name}" += ${added.join(', ')}`);
  }
});

// For Momofuku — only link to Momofuku-named entries (not Majordomo which is different brand)
const momoUpdates = [
  ['New York', 1533, 'Momofuku', ['Los Angeles']],  // Momofuku Noodle Bar
  ['Las Vegas', 12187, 'Momofuku', ['Los Angeles']],
  ['Las Vegas', 12518, 'Momofuku', ['Los Angeles']],
];
momoUpdates.forEach(([city, id, brandPrefix, toAdd]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r) { console.log('  ! missing ' + city + '#' + id); return; }
  if (!new RegExp('^\\s*' + brandPrefix + '\\b', 'i').test(r.name)) {
    console.log('  ! skipping ' + city + '#' + id + ' "' + r.name + '" — not Momofuku');
    return;
  }
  const existing = Array.isArray(r.cityLinks) ? r.cityLinks.slice() : [];
  const set = new Set(existing);
  const added = [];
  toAdd.forEach(c => { if (!set.has(c)) { existing.push(c); added.push(c); } });
  if (added.length) {
    r.cityLinks = existing;
    fixes += added.length;
    console.log(`  ${city}#${id} "${r.name}" += ${added.join(', ')}`);
  }
});

const ordered = Object.entries(cities).sort((a,b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});
ordered.forEach(([city, varName]) => {
  const pos = locateArray(varName);
  html = html.substring(0, pos.arrS) + JSON.stringify(perCity[city]) + html.substring(pos.arrE);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAdded:');
console.log('  Chicago #' + chiId + ' TAO Chicago (River North)');
console.log('  LA #' + laId1 + ' TAO Los Angeles (Hollywood)');
console.log('  LA #' + laId2 + ' Super Peach by Momofuku (Century City)');
console.log('\n' + fixes + ' cityLinks added to existing siblings.');
