// Add Prince Street Pizza Dallas (Knox-Henderson location) + wire cityLinks
// both ways with NYC flagship.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

// Determine next Dallas ID
const dallas = parseArray('const DALLAS_DATA');
const nextId = Math.max(...dallas.map(r => r.id)) + 1;

const princeDallas = {
  id: nextId,
  name: "Prince Street Pizza",
  phone: "(469) 998-0894",
  cuisine: "Pizza / NY-Style Square Slice",
  neighborhood: "Knox-Henderson",
  score: 88,
  price: 2,
  tags: ["Pizza","Casual","Local Favorites","Critics Pick"],
  indicators: [],
  hh: "",
  reservation: "walk-in",
  awards: "",
  description: "NYC Nolita cult favorite expanded to Dallas — square Sicilian slices with pepperoni cups, crispy rim, and the same spicy spring Spicy Spring that made the original a line-out-the-door draw.",
  dishes: ["Spicy Spring (Pepperoni)","Soho Square","Mr. Pink (Pesto)"],
  address: "2820 N Henderson Ave, Dallas, TX 75206",
  hours: "",
  lat: 32.8161,
  lng: -96.7812,
  group: "",
  instagram: "@princestpizza",
  website: "https://locations.princestreetpizza.com/dallas-knox-henderson",
  res_tier: 0,
  photoUrl: "",
  bestOf: [],
  busyness: null,
  waitTime: null,
  popularTimes: null,
  lastUpdated: null,
  trending: true,
  suburb: false,
  reserveUrl: "",
  menuUrl: "",
  verified: "2026-04-18",
  cityLinks: ["New York"],
};

// Push Dallas entry
dallas.push(princeDallas);

// Write Dallas back (edit bottom-up to keep indices stable: write NYC update first
// since NYC is defined later in the file, we handle ordering carefully)
const dallasPos = locateArray('const DALLAS_DATA');

// Update NYC Prince Street Pizza (#1062) with cityLinks = [Dallas]
const nyc = parseArray('const NYC_DATA');
const nycPrince = nyc.find(r => r.id === 1062);
if (nycPrince) {
  const existing = Array.isArray(nycPrince.cityLinks) ? nycPrince.cityLinks : [];
  if (!existing.includes('Dallas')) {
    nycPrince.cityLinks = [...existing, 'Dallas'];
  }
}

// Write bottom-up: NYC is at higher offset than Dallas in the file, so write NYC first
const nycPos = locateArray('const NYC_DATA');
if (nycPos.arrS > dallasPos.arrS) {
  // NYC is later — write NYC first so Dallas offsets remain valid
  html = html.substring(0, nycPos.arrS) + JSON.stringify(nyc) + html.substring(nycPos.arrE);
  // Re-locate Dallas after NYC write (Dallas offsets unchanged since Dallas is earlier)
  const freshDallasPos = locateArray('const DALLAS_DATA');
  html = html.substring(0, freshDallasPos.arrS) + JSON.stringify(dallas) + html.substring(freshDallasPos.arrE);
} else {
  html = html.substring(0, dallasPos.arrS) + JSON.stringify(dallas) + html.substring(dallasPos.arrE);
  const freshNycPos = locateArray('const NYC_DATA');
  html = html.substring(0, freshNycPos.arrS) + JSON.stringify(nyc) + html.substring(freshNycPos.arrE);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added Dallas#' + nextId + ' "Prince Street Pizza" (Knox-Henderson)');
console.log('Linked NYC#1062 Prince Street Pizza ↔ Dallas#' + nextId);
