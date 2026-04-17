const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function getArr(varName) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  if (p === -1) return [];
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  return JSON.parse(html.substring(s, e));
}

function saveArr(varName, arr) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
}

const cityVars = {
  'Dallas': 'const DALLAS_DATA',
  'Houston': 'const HOUSTON_DATA',
  'Austin': 'const AUSTIN_DATA',
  'Salt Lake City': 'const SLC_DATA',
  'Seattle': 'const SEATTLE_DATA',
  'Las Vegas': 'const LV_DATA',
};

const allCities = {};
Object.entries(cityVars).forEach(([city, varName]) => {
  allCities[city] = getArr(varName);
});

// Define cross-city restaurant groups
const crossCityGroups = [
  { name: 'Carbone', cities: ['Dallas', 'Las Vegas'] },
  { name: 'Nobu', cities: ['Dallas', 'Houston', 'Las Vegas'] },
  { name: 'True Food Kitchen', cities: ['Dallas', 'Austin', 'Houston', 'Las Vegas'] },
  { name: 'Hopdoddy', cities: ['Dallas', 'Austin', 'Houston'] },
  { name: 'Flower Child', cities: ['Dallas', 'Austin', 'Houston'] },
  { name: "Clark's Oyster Bar", cities: ['Dallas', 'Austin', 'Houston'] },
  { name: 'STK Steakhouse', cities: ['Dallas', 'Salt Lake City', 'Las Vegas'] },
  { name: 'The Rustic', cities: ['Dallas', 'Houston'] },
  { name: 'Pappas Bros. Steakhouse', cities: ['Dallas', 'Houston'] },
  { name: 'Pappadeaux Seafood Kitchen', cities: ['Dallas', 'Houston'] },
  { name: "Pappasito's Cantina", cities: ['Dallas', 'Houston'] },
  { name: 'Hudson House', cities: ['Dallas', 'Houston'] },
  { name: 'Rodeo Goat', cities: ['Dallas', 'Houston'] },
  { name: 'Catch', cities: ['Dallas', 'Las Vegas'] },
  { name: "Eddie V's", cities: ['Dallas', 'Austin'] },
  { name: "Ruth's Chris", cities: ['Dallas', 'Austin'] },
  { name: "Bob's Steak", cities: ['Dallas', 'Austin'] },
  { name: 'Din Tai Fung', cities: ['Seattle', 'Las Vegas'] },
  { name: 'Fogo de Chao', cities: ['Dallas', 'Houston'] },
  { name: 'Gordon Ramsay', cities: ['Las Vegas'] }, // Multiple concepts but all in Vegas
  { name: 'Shake Shack', cities: ['Dallas', 'Houston'] },
  { name: 'North Italia', cities: ['Dallas', 'Austin', 'Salt Lake City'] },
  { name: "Fleming's", cities: ['Austin', 'Salt Lake City'] },
  { name: "Grimaldi's", cities: ['Dallas', 'Las Vegas'] },
  { name: 'Velvet Taco', cities: ['Dallas', 'Houston'] },
  { name: 'Torchy\'s Tacos', cities: ['Dallas', 'Austin', 'Houston'] },
  { name: 'Ramen Tatsu-Ya', cities: ['Austin', 'Houston'] },
  { name: 'Uchi', cities: ['Dallas', 'Austin', 'Houston'] },
  { name: 'Uchiko', cities: ['Austin', 'Houston'] },
  { name: 'Loro', cities: ['Dallas', 'Austin', 'Houston'] },
  { name: "Perry's Steakhouse", cities: ['Dallas', 'Austin', 'Houston'] },
  { name: 'Pinthouse Pizza', cities: ['Austin'] }, // Only Austin
  { name: 'Settebello', cities: ['Salt Lake City', 'Las Vegas'] },
];

let linkCount = 0;

crossCityGroups.forEach(group => {
  if (group.cities.length < 2) return;

  group.cities.forEach(city => {
    const arr = allCities[city];
    if (!arr) return;

    // Find matching restaurant(s) in this city
    const matches = arr.filter(r => {
      const rName = r.name.toLowerCase();
      const gName = group.name.toLowerCase();
      return rName.includes(gName) || gName.includes(rName.split(' ')[0]);
    });

    if (!matches.length) return;

    // Get the primary entry (highest score)
    const primary = matches.sort((a, b) => b.score - a.score)[0];
    const otherCities = group.cities.filter(c => c !== city);

    if (!primary.cityLinks || JSON.stringify(primary.cityLinks.sort()) !== JSON.stringify(otherCities.sort())) {
      primary.cityLinks = otherCities;
      linkCount++;
    }
  });
});

// Save all cities back
Object.entries(cityVars).forEach(([city, varName]) => {
  saveArr(varName, allCities[city]);
});

fs.writeFileSync('index.html', html, 'utf8');

// Count results
let totalLinked = 0;
Object.entries(cityVars).forEach(([city, varName]) => {
  const arr = getArr(varName);
  const linked = arr.filter(r => r.cityLinks && r.cityLinks.length > 0).length;
  totalLinked += linked;
  console.log(`${city}: ${linked} cross-city linked`);
});
console.log(`\nTotal cross-city links: ${totalLinked} (updated ${linkCount} entries)`);
