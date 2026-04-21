// Cross-city chain audit — find which CLT scrape chains are present in other cities but missing from CLT (or vice versa)
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const cityVars = ['DALLAS_DATA','HOUSTON_DATA','AUSTIN_DATA','NYC_DATA','LA_DATA','PHX_DATA','SD_DATA','SANANTONIO_DATA','SEATTLE_DATA','CHICAGO_DATA','LV_DATA','MIAMI_DATA','CHARLOTTE_DATA','SLC_DATA'];

function loadArr(name) {
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*(\\[[\\s\\S]*?\\]);');
  const m = html.match(re);
  if (!m) return null;
  // Find balanced bracket
  const start = html.indexOf('[', html.indexOf('const ' + name));
  let depth = 0, end = start;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  try { return eval(html.slice(start, end + 1)); } catch (e) { return null; }
}

const all = {};
for (const v of cityVars) {
  const a = loadArr(v);
  all[v] = a || [];
}

// Chains we care about — pulled from the Charlotte source scrapes
const chains = [
  'Cava','Velvet Taco','Shake Shack','North Italia','Hawkers Asian','O-Ku',"Indaco",
  'Superica','Sixty Vines','Culinary Dropout','Salty Donut','Snooze','Ruby Sunshine',
  'Matador','Naked Farmer','Flower Child',"Jeni's Splendid",'Foxcroft','Capital Grille',
  "Del Frisco","Honeysuckle Gelato",'Botiwalla','Boxcar Bett','Papi Queso','Crunkleton',
  'Buho','Cloud Bar','Merchant & Trade','Idlewild','Substrate','Lorem Ipsum',
  "Henrietta",'Charlotte Beer Garden','Hi-Wire','Wooden Robot','Triple C',
  'PIE.ZAA','Pinky',"Brooks","Mama Ricotta",'Cabo Fish','Brigid',"Rí Rá","Ri Ra",
  'Mac\'s Speed Shop','Pure Pizza','Sunflour','Yafo','Capishe','Ink N',"Cowbell",
  'Dandelion Market','D9 Brewing','Sabor Latin','Hawthorne','Leroy Fox',
  'Soul Gastrolounge','Crepe Cellar','Bardo','Bossy Beulah','Bang Bang',
  'Selwyn Pub',"Café Monte","Reid's Fine Foods",'Nuvole','Halcyon',
  'Yummi Banh Mi',"Ru San",'Living Kitchen','Bistro La Bon',
  'Crave Dessert','The Cellar at Duckworth','Cotton Room','Middle C',
  'PARA','Folia','Catalu','Catalú','Dram & Draught','STIR','Stable Hand',
  'Frenchy','Humbug','Copperhead','Super Abari','Moosehead','Tutti Gelato',
  'Wheatberry','Golden Cow','Argon','Spinello','Fontana Di Vino',
  'Yume Sushi','Sushi Taku','Seoul Food Meat','Salted Melon',"Cheat's Cheesesteaks",
  'The Waterman','SouthBound','Trolley Barn','Nickyo','La Capital MX',
  "Let's Meat",'Lincoln Street','Monday Night Garden','Not Just Coffee',
  "Poppy's Bagels",'Rai Lay Thai','The Rose Honky Tonk','Small Bar South End',
  'Tremont','The Union','Free Range Brewery','The Queen and Glass',
  'Tacos El Flacko','United House of Prayer','HopFly','Hoppin','Izzy',
  'Two Scoops Creamery','Crave Dessert',"Salty Donut",
  // already-in-CLT chains worth checking other cities for:
  "Salud Cerveceria",'Botiwalla',"Honeysuckle"
];

const seen = new Set();
const uniqChains = chains.filter(c => { const k = c.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

const presence = {};
for (const c of uniqChains) {
  const cl = c.toLowerCase();
  presence[c] = [];
  for (const v of cityVars) {
    const arr = all[v];
    if (arr.some(r => (r.name || '').toLowerCase().includes(cl))) {
      presence[c].push(v.replace('_DATA', ''));
    }
  }
}

console.log('=== CHAIN PRESENCE MATRIX ===');
console.log('(chain → cities where it appears in our data)\n');

const inMultiple = [];
const inOneOnly = [];
const inNone = [];
for (const [c, cities] of Object.entries(presence)) {
  if (cities.length >= 2) inMultiple.push([c, cities]);
  else if (cities.length === 1) inOneOnly.push([c, cities]);
  else inNone.push(c);
}

console.log('--- Present in 2+ cities (definitely a chain we accept) ---');
for (const [c, cities] of inMultiple) console.log('  '+c+' → '+cities.join(', '));

console.log('\n--- Present in only 1 city (may be missing locations elsewhere) ---');
for (const [c, cities] of inOneOnly) console.log('  '+c+' → '+cities.join(', '));

console.log('\n--- Present in 0 cities (still to evaluate) ---');
console.log('  Count:',inNone.length);
console.log('  ',inNone.slice(0,40).join(' | '));

console.log('\n=== City card totals ===');
for (const v of cityVars) console.log('  '+v.replace('_DATA','')+'='+all[v].length);
