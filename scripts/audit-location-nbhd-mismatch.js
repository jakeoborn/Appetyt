// Check each merged entry (primary + each locations[] slot) for cases where
// the neighborhood label conflicts with the actual city/suburb in the address.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function parseArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  const src = html.substring(arrS, arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

const cities = {
  'Dallas': 'const DALLAS_DATA','Houston': 'const HOUSTON_DATA','Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA','Salt Lake City': 'const SLC_DATA','Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA','New York': 'const NYC_DATA',
};

// Extract the "city, ST" portion from an address: last segment before 5-digit ZIP.
function extractAddressCity(addr) {
  if (!addr) return null;
  // Match "..., <CITY>, <ST> <ZIP>" or "..., <CITY>, <ST>"
  const m = String(addr).match(/,\s*([A-Za-z .'-]+?)\s*,\s*[A-Z]{2}\b/);
  return m ? m[1].trim() : null;
}

const issues = [];

Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  data.forEach(r => {
    if (!Array.isArray(r.locations) || r.locations.length < 2) return;
    r.locations.forEach((loc, i) => {
      const addrCity = extractAddressCity(loc.address);
      const nbhdLower = String(loc.neighborhood || loc.name || '').toLowerCase().trim();
      const addrCityLower = (addrCity || '').toLowerCase().trim();
      if (!addrCityLower || !nbhdLower) return;
      // Rules for mismatch:
      //  - if the address-city is a known distinct suburb and the neighborhood label
      //    doesn't contain that suburb, flag it.
      // Build list of suburbs that are commonly separate from main city:
      const KNOWN_SUBURBS = {
        'Salt Lake City': ['ogden','park city','provo','sandy','herriman','holladay','draper','west valley','north salt lake','south jordan','west jordan','bountiful','layton','murray','orem','lehi','cottonwood heights','south salt lake','millcreek'],
        'Houston': ['katy','pearland','sugar land','spring','the woodlands','kingwood','la porte','galveston','missouri city','bellaire'],
        'Dallas': ['plano','frisco','addison','arlington','irving','rockwall','fort worth','grapevine','mckinney','richardson','las colinas'],
        'Austin': ['round rock','cedar park','georgetown','pflugerville','west lake hills','bee cave','dripping springs','lakeway'],
        'Seattle': ['bellevue','redmond','kirkland','bothell','tacoma','issaquah','renton'],
        'Chicago': ['evanston','oak park','schaumburg','naperville'],
        'Las Vegas': ['henderson','boulder city','north las vegas','paradise','enterprise','summerlin'],
        'New York': ['brooklyn','queens','bronx','staten island','jersey city','hoboken','newark','long island city'],
      };
      const suburbs = KNOWN_SUBURBS[city] || [];
      const isDistinctSuburb = suburbs.some(s => addrCityLower.includes(s));
      if (isDistinctSuburb) {
        // Check if nbhd label names that suburb
        const suburbMatched = suburbs.find(s => addrCityLower.includes(s) && nbhdLower.includes(s));
        if (!suburbMatched) {
          issues.push({
            city, id: r.id, name: r.name,
            locationIdx: i,
            addressCity: addrCity,
            neighborhoodLabel: loc.neighborhood || loc.name,
            address: loc.address,
          });
        }
      }
    });
    // Also flag the primary entry's own r.neighborhood vs r.address mismatch
    const addrCity = extractAddressCity(r.address);
    const addrCityLower = (addrCity || '').toLowerCase().trim();
    const nbhdLower = String(r.neighborhood || '').toLowerCase().trim();
    if (addrCityLower && nbhdLower) {
      const KNOWN_SUBURBS = {
        'Salt Lake City': ['ogden','park city','provo','sandy','herriman','holladay','draper','west valley','north salt lake','south jordan','west jordan','bountiful','layton','murray','orem','lehi','cottonwood heights','south salt lake','millcreek'],
        'Houston': ['katy','pearland','sugar land','spring','the woodlands','kingwood','la porte','galveston','missouri city','bellaire'],
        'Dallas': ['plano','frisco','addison','arlington','irving','rockwall','fort worth','grapevine','mckinney','richardson','las colinas'],
        'Austin': ['round rock','cedar park','georgetown','pflugerville','west lake hills','bee cave','dripping springs','lakeway'],
        'Seattle': ['bellevue','redmond','kirkland','bothell','tacoma','issaquah','renton'],
        'Chicago': ['evanston','oak park','schaumburg','naperville'],
        'Las Vegas': ['henderson','boulder city','north las vegas','paradise','enterprise','summerlin'],
        'New York': ['brooklyn','queens','bronx','staten island','jersey city','hoboken','newark','long island city'],
      };
      const suburbs = KNOWN_SUBURBS[city] || [];
      const isDistinctSuburb = suburbs.some(s => addrCityLower.includes(s));
      if (isDistinctSuburb) {
        const suburbMatched = suburbs.find(s => addrCityLower.includes(s) && nbhdLower.includes(s));
        if (!suburbMatched) {
          issues.push({
            city, id: r.id, name: r.name,
            primaryEntry: true,
            addressCity: addrCity,
            neighborhoodLabel: r.neighborhood,
            address: r.address,
          });
        }
      }
    }
  });
});

fs.writeFileSync('scripts/location-nbhd-mismatch-audit.json', JSON.stringify(issues, null, 2));

console.log(`=== ADDRESS / NEIGHBORHOOD MISMATCHES: ${issues.length} ===\n`);
issues.forEach(i => {
  const where = i.primaryEntry ? 'PRIMARY' : `locations[${i.locationIdx}]`;
  console.log(`${i.city}#${i.id} "${i.name}" ${where}`);
  console.log(`  address: "${i.address}" (city-part: ${i.addressCity})`);
  console.log(`  neighborhood label: "${i.neighborhoodLabel}"`);
  console.log('');
});
