// Find brands that exist in ONE city's data but are known to have sister locations
// in other cities we cover. Manual curated list of well-known multi-city brands
// to check against our data.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}

const cities = {
  'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA',
  'Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',
  'Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',
  'Phoenix':'const PHX_DATA',
};

const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = pa(v); });

// Curated list of well-known multi-city chef-driven or destination chains.
// For each brand, list the cities where they're known to have locations.
// If our data has it in only some of those cities, the others are "missing sisters".
const KNOWN_BRANDS = [
  // Chef-driven upscale chains (typically get separate cards + cityLinks)
  { brand: 'Carbone', aliases: ['Carbone'], known: ['New York','Las Vegas','Dallas','Miami'] },
  { brand: 'Nobu', aliases: ['Nobu', 'Nobu Malibu', 'Nobu Downtown'], known: ['New York','Las Vegas','Dallas','Houston','Los Angeles','Miami','Malibu','Chicago'] },
  { brand: 'Peter Luger', aliases: ['Peter Luger'], known: ['New York','Las Vegas'] },
  { brand: 'COTE', aliases: ['COTE'], known: ['New York','Las Vegas','Miami','Singapore'] },
  { brand: 'Le Jardinier', aliases: ['Le Jardinier'], known: ['New York','Miami','Houston'] },
  { brand: 'Scarpetta', aliases: ['Scarpetta'], known: ['New York','Las Vegas','Miami'] },
  { brand: 'Beauty & Essex', aliases: ['Beauty & Essex','Beauty and Essex'], known: ['New York','Las Vegas'] },
  { brand: 'Catch', aliases: ['Catch LA','Catch'], known: ['Los Angeles','New York','Las Vegas'] },
  { brand: 'STK', aliases: ['STK Steakhouse'], known: ['New York','Las Vegas','Dallas','Chicago','Los Angeles'] },
  { brand: 'TAO', aliases: ['TAO','Tao'], known: ['New York','Las Vegas','Chicago','Los Angeles'] },
  { brand: 'LAVO', aliases: ['LAVO','Lavo'], known: ['New York','Las Vegas'] },
  // Casual chains worth linking
  { brand: 'Shake Shack', aliases: ['Shake Shack'], known: ['New York','Dallas','Houston','Austin','Los Angeles','Chicago','Las Vegas'] },
  { brand: 'Sweetgreen', aliases: ['Sweetgreen'], known: ['New York','Dallas','Houston','Austin','Los Angeles','Chicago'] },
  { brand: 'CAVA', aliases: ['CAVA'], known: ['New York','Dallas','Austin','Houston','Los Angeles','Chicago'] },
  { brand: 'Milk Bar', aliases: ['Milk Bar'], known: ['New York','Las Vegas','Los Angeles'] },
  { brand: "Katz's Delicatessen", aliases: ["Katz's"], known: ['New York'] },
  { brand: "Joe's Stone Crab", aliases: ["Joe's Stone Crab"], known: ['Las Vegas','Chicago'] },
  { brand: 'Ippudo', aliases: ['Ippudo'], known: ['New York'] },
  { brand: 'Momofuku Noodle Bar', aliases: ['Momofuku'], known: ['New York','Las Vegas','Los Angeles'] },
  { brand: 'Hillstone', aliases: ['Hillstone'], known: ['New York','Dallas','Houston','Los Angeles'] },
  { brand: 'Din Tai Fung', aliases: ['Din Tai Fung'], known: ['Los Angeles','Seattle','New York','Las Vegas'] },
  { brand: 'Boa Steakhouse', aliases: ['BOA','Boa Steakhouse'], known: ['Los Angeles','Las Vegas'] },
  { brand: 'Craig\'s', aliases: ["Craig's"], known: ['Los Angeles','Las Vegas'] },
  { brand: 'E Baldi', aliases: ['E. Baldi','Baldi'], known: ['Los Angeles'] },
  { brand: 'Uchi', aliases: ['Uchi','Uchiko'], known: ['Austin','Dallas','Houston','Miami','Phoenix'] },
  { brand: 'Loro', aliases: ['Loro'], known: ['Austin','Dallas','Houston'] },
  // Celebrity chef brands
  { brand: 'Bobby Flay', aliases: ['Amalfi','Mesa Grill','Bobby Flay Steak'], known: ['New York','Las Vegas'] },
  { brand: 'Gordon Ramsay Hell\'s Kitchen', aliases: ["Hell's Kitchen"], known: ['Las Vegas','Miami','Dubai'] },
  { brand: 'Wolfgang Puck Spago', aliases: ['Spago'], known: ['Los Angeles','Las Vegas'] },
  { brand: 'Mastro\'s', aliases: ["Mastro's"], known: ['Los Angeles','Las Vegas','New York','Chicago','Houston','Dallas','Scottsdale'] },
  { brand: 'BLT Prime/Steak', aliases: ['BLT Prime','BLT Steak'], known: ['New York','Las Vegas'] },
  { brand: 'SUGARFISH', aliases: ['Sugarfish','SUGARFISH'], known: ['Los Angeles','New York'] },
  { brand: 'Kazu Nori', aliases: ['KazuNori','Kazu Nori'], known: ['Los Angeles','New York'] },
  { brand: 'Pirate\'s Alley', aliases: [], known: [] }, // placeholder to handle syntax
];

// Check if name matches any alias (case-insensitive contains)
function matchesBrand(name, aliases) {
  const n = String(name || '').toLowerCase();
  return aliases.some(a => n.includes(a.toLowerCase())) && aliases.length > 0;
}

KNOWN_BRANDS.forEach(({ brand, aliases, known }) => {
  if (!Array.isArray(aliases) || !aliases.length) return;
  // Find brand in each of our covered cities
  const foundIn = [];
  Object.entries(perCity).forEach(([city, data]) => {
    const hits = data.filter(r => matchesBrand(r.name, aliases));
    if (hits.length) foundIn.push({ city, hits });
  });
  // Missing sisters = known cities that overlap with our coverage but we don't have
  const ourKnownCoverage = known.filter(c => perCity[c]);
  const foundCities = new Set(foundIn.map(x => x.city));
  const missingInOurCoverage = ourKnownCoverage.filter(c => !foundCities.has(c));
  if (missingInOurCoverage.length && foundIn.length) {
    console.log(`\n=== ${brand} ===`);
    console.log('  Have in:', foundIn.map(x => `${x.city}#${x.hits.map(h => h.id).join(',')}`).join('; '));
    console.log('  Missing sisters in:', missingInOurCoverage.join(', '));
  }
});
