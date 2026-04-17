const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function getArr(varName) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  if (p === -1) return { arr: [], start: -1, end: -1 };
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  return { arr: JSON.parse(html.substring(s, e)), start: s, end: e };
}

function saveArr(varName, arr) {
  const { start, end } = getArr(varName);
  html = html.substring(0, start) + JSON.stringify(arr) + html.substring(end);
}

// === DALLAS ===
let dal = getArr('const DALLAS_DATA').arr;

// 1. Consolidate Velvet Taco (11 entries -> 1 with locations)
const vtEntries = dal.filter(r => r.name.toLowerCase().startsWith('velvet taco'));
if (vtEntries.length > 1) {
  const primary = vtEntries.sort((a, b) => b.score - a.score)[0];
  primary.name = 'Velvet Taco';
  primary.neighborhood = 'Multiple Locations';
  primary.locations = vtEntries.map(r => ({
    name: r.neighborhood,
    address: r.address
  }));
  // Remove all but primary
  const removeIds = new Set(vtEntries.filter(r => r.id !== primary.id).map(r => r.id));
  dal = dal.filter(r => !removeIds.has(r.id));
  console.log('Velvet Taco: consolidated ' + vtEntries.length + ' entries into 1 with ' + primary.locations.length + ' locations');
}

// 2. Update Hudson House with all 4 locations
const hh = dal.find(r => r.name === 'Hudson House');
if (hh) {
  hh.locations = [
    { name: 'West Village / Uptown', address: '3699 McKinney Ave Ste 200, Dallas, TX 75204' },
    { name: 'Highland Park / Lovers Lane', address: '4448 Lovers Ln, Dallas, TX 75225' },
    { name: 'Lakewood', address: '4040 Abrams Rd, Dallas, TX 75214' },
    { name: 'Preston Hollow', address: '11700 Preston Rd Ste 880, Dallas, TX 75230' }
  ];
  hh.neighborhood = 'Multiple Locations';
  console.log('Hudson House: updated with 4 locations');
}

// 3. Add cross-city links for restaurants that exist in multiple cities
// First, find cross-city restaurants
const crossCity = {
  'Din Tai Fung': ['Seattle', 'Las Vegas'],
  'Ramen Tatsu-Ya': ['Austin', 'Houston'],
  'Uchi': ['Austin', 'Houston', 'Dallas'],
  'Uchiko': ['Austin', 'Houston'],
  'Loro': ['Austin', 'Houston', 'Dallas'],
  'North Italia': ['Dallas', 'Austin', 'Salt Lake City'],
  'Perry\'s Steakhouse': ['Dallas', 'Austin', 'Houston'],
  'Nobu': ['Dallas', 'Las Vegas'],
  'Flower Child': ['Dallas', 'Austin'],
  'True Food Kitchen': ['Dallas', 'Austin'],
  'Fleming\'s Prime Steakhouse': ['Austin', 'Salt Lake City'],
  'Shake Shack': ['Dallas', 'Houston'],
  'P. Terry\'s': ['Austin'],
  'Torchy\'s Tacos': ['Dallas', 'Austin', 'Houston'],
  'Hopdoddy': ['Dallas', 'Austin'],
};

// Apply cityLinks to matching restaurants in each city
const allCities = {
  'Dallas': dal,
  'Houston': getArr('const HOUSTON_DATA').arr,
  'Austin': getArr('const AUSTIN_DATA').arr,
  'Salt Lake City': getArr('const SLC_DATA').arr,
  'Seattle': getArr('const SEATTLE_DATA').arr,
  'Las Vegas': getArr('const LV_DATA').arr,
};

Object.entries(crossCity).forEach(([name, cities]) => {
  cities.forEach(city => {
    const cityArr = allCities[city];
    if (!cityArr) return;
    const match = cityArr.find(r => r.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]) &&
      r.name.toLowerCase().includes(name.toLowerCase().split(' ').slice(-1)[0]));
    if (match) {
      const otherCities = cities.filter(c => c !== city);
      if (otherCities.length > 0) {
        match.cityLinks = otherCities;
        console.log(`${name} in ${city}: linked to ${otherCities.join(', ')}`);
      }
    }
  });
});

// Save all cities back
saveArr('const DALLAS_DATA', dal);
// Need to re-read html after Dallas save for subsequent cities
const hou = allCities['Houston'];
const aus = allCities['Austin'];
const slc = allCities['Salt Lake City'];
const sea = allCities['Seattle'];
const lv = allCities['Las Vegas'];

// Re-save each city (reading fresh positions each time)
function reSave(varName, arr) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
}

reSave('const DALLAS_DATA', dal);
reSave('const HOUSTON_DATA', hou);
reSave('const AUSTIN_DATA', aus);
reSave('const SLC_DATA', slc);
reSave('const SEATTLE_DATA', sea);
reSave('const LV_DATA', lv);

fs.writeFileSync('index.html', html, 'utf8');

// Final counts
console.log('\nFinal counts:');
['const DALLAS_DATA','const HOUSTON_DATA','const AUSTIN_DATA','const SLC_DATA','const SEATTLE_DATA','const LV_DATA'].forEach(v => {
  const { arr } = getArr(v);
  const multi = arr.filter(r => r.locations && r.locations.length > 0).length;
  const linked = arr.filter(r => r.cityLinks && r.cityLinks.length > 0).length;
  console.log(`  ${v.replace('const ','').replace('=','')}: ${arr.length} (${multi} multi-loc, ${linked} cross-city)`);
});
