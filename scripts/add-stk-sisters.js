// Add STK Steakhouse to NYC, Chicago, LA (we already have Dallas, SLC, Vegas).
// Addresses verified from stksteakhouse.com official pages.
// cityLinks use exact-word match (not fuzzy substring).

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function baseEntry(id, data) {
  return {
    id,name:'',phone:'',cuisine:'',neighborhood:'',score:87,price:4,tags:[],
    indicators:[],hh:'',reservation:'OpenTable',awards:'',
    description:'',dishes:[],address:'',hours:'',lat:0,lng:0,group:'',
    instagram:'',website:'',res_tier:0,photoUrl:'',bestOf:[],busyness:null,
    waitTime:null,popularTimes:null,lastUpdated:null,trending:false,suburb:false,
    reserveUrl:'',menuUrl:'',verified:'2026-04-18',
    ...data,
  };
}

// Sibling cityLinks: existing STK entries
// Dallas#1116, SLC#11529, Vegas#12041 (existing — verify by exact "STK Steakhouse" match)

// ========== NEW STK entries ==========
const nyc = parseArray('const NYC_DATA');
const chicago = parseArray('const CHICAGO_DATA');
const la = parseArray('const LA_DATA');

const nycId = Math.max(...nyc.map(r => r.id)) + 1;
const chiId = Math.max(...chicago.map(r => r.id)) + 1;
const laId = Math.max(...la.map(r => r.id)) + 1;

const stkNYC = baseEntry(nycId, {
  name: "STK Steakhouse",
  cuisine: "Steakhouse / Modern",
  neighborhood: "Meatpacking District",
  score: 86, price: 4,
  tags: ["Steakhouse","Date Night","Cocktails","Late Night","Celebrations","Sit-Down"],
  description: "The Meatpacking District steakhouse where a DJ spins through dinner service and the Lil' BRGs arrive on a tiny cutting board. STK turned the steakhouse into nightlife — USDA prime, truffle Parmesan fries, and a dining room that turns into a bar as the night thickens. Not where your grandfather had his 80th birthday. Where his granddaughter had hers.",
  dishes: ["Lil' BRGs","Bone-In NY Strip","Truffle Parmesan Fries"],
  address: "26 Little West 12th St, New York, NY 10014",
  lat: 40.7394, lng: -74.0059,
  phone: "(646) 624-2444",
  website: "https://stksteakhouse.com/en-us/location/nyc-downtown/",
  instagram: "@stksteakhouse",
  cityLinks: ["Dallas","Salt Lake City","Las Vegas"],
});

const stkChi = baseEntry(chiId, {
  name: "STK Steakhouse",
  cuisine: "Steakhouse / Modern",
  neighborhood: "River North",
  score: 85, price: 4,
  tags: ["Steakhouse","Date Night","Cocktails","Late Night","Sit-Down","Celebrations"],
  description: "River North's party steakhouse — DJs spin, Lil' BRGs slide out on cutting boards, and the truffle fries order themselves. A two-level dining room that's packed by 8pm and louder by 10pm. STK's whole thing is that a prime filet and a good night out aren't supposed to be mutually exclusive.",
  dishes: ["Lil' BRGs","Bone-In Filet","Truffle Parmesan Fries"],
  address: "9 W Kinzie St, Chicago, IL 60654",
  lat: 41.8892, lng: -87.6292,
  phone: "(312) 340-5636",
  website: "https://stksteakhouse.com/en-us/location/chicago/",
  instagram: "@stksteakhouse",
  cityLinks: ["Dallas","Salt Lake City","Las Vegas"],
});

const stkLA = baseEntry(laId, {
  name: "STK Steakhouse",
  cuisine: "Steakhouse / Modern",
  neighborhood: "Westwood",
  score: 85, price: 4,
  tags: ["Steakhouse","Date Night","Cocktails","Celebrations","Sit-Down"],
  description: "Westwood's high-energy steakhouse-lounge hybrid — UCLA on one side, Wilshire on the other, pulsing house music running through every course. The wagyu little burgers and the lobster mac are the non-negotiable openers. Come for dinner, stay for the DJ.",
  dishes: ["Lil' BRGs","Wagyu Steak","Lobster Mac & Cheese"],
  address: "1100 Glendon Ave, Los Angeles, CA 90024",
  lat: 34.0615, lng: -118.4447,
  phone: "(310) 659-3535",
  website: "https://stksteakhouse.com/en-us/location/los-angeles/",
  instagram: "@stksteakhouse",
  cityLinks: ["Dallas","Salt Lake City","Las Vegas"],
});

nyc.push(stkNYC);
chicago.push(stkChi);
la.push(stkLA);

// Write back (order doesn't matter since 3 separate arrays at distinct offsets)
const nycPos = locateArray('const NYC_DATA');
const chicagoPos = locateArray('const CHICAGO_DATA');
const laPos = locateArray('const LA_DATA');

// Need to edit bottom-up to preserve offsets. Determine order.
const writes = [
  [nycPos, nyc], [chicagoPos, chicago], [laPos, la]
].sort((a,b) => b[0].arrS - a[0].arrS);
writes.forEach(([pos, data]) => {
  const freshPos = locateArray(data === nyc ? 'const NYC_DATA' : data === chicago ? 'const CHICAGO_DATA' : 'const LA_DATA');
  html = html.substring(0, freshPos.arrS) + JSON.stringify(data) + html.substring(freshPos.arrE);
});

// Now update cityLinks on existing STK siblings: Dallas#1116, SLC#11529, Vegas#12041
// Need to add NYC, Chicago, LA to each.
const cities = {'Dallas':'const DALLAS_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA'};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = parseArray(v); });

const links = [
  ['Dallas', 1116, ['New York','Chicago','Los Angeles']],
  ['Salt Lake City', 11529, ['New York','Chicago','Los Angeles']],
  ['Las Vegas', 12041, ['New York','Chicago','Los Angeles']],
];

let linkFixes = 0;
links.forEach(([city, id, toAdd]) => {
  const r = perCity[city].find(x => x.id === id);
  if (!r || r.name !== 'STK Steakhouse') {
    console.log('  ! skipping', city, '#'+id, r ? ('name mismatch: "' + r.name + '"') : 'not found');
    return;
  }
  const existing = Array.isArray(r.cityLinks) ? r.cityLinks.slice() : [];
  const set = new Set(existing);
  const added = [];
  toAdd.forEach(c => { if (!set.has(c)) { existing.push(c); added.push(c); } });
  if (added.length) {
    r.cityLinks = existing;
    linkFixes += added.length;
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
console.log(`  NYC #${nycId} STK Steakhouse (Meatpacking)`);
console.log(`  Chicago #${chiId} STK Steakhouse (River North)`);
console.log(`  LA #${laId} STK Steakhouse (Westwood)`);
console.log(`\n${linkFixes} cityLinks added to Dallas/SLC/Vegas STK siblings.`);
