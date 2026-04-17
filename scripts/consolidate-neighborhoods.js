const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function processCity(varName, renames) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  if (p === -1) return 0;
  const s = html.indexOf('[', p);
  let d = 0, e = s;
  for (let j = s; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { e = j + 1; break; } } }
  let arr = JSON.parse(html.substring(s, e));
  let count = 0;
  arr.forEach(r => {
    const n = r.neighborhood || '';
    if (renames[n]) {
      r.neighborhood = renames[n];
      count++;
    }
  });
  if (count > 0) {
    html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
  }
  return count;
}

// DALLAS — minimal fixes
const dallasRenames = {
  'South Dallas': 'Oak Cliff',
  'East Dallas': 'East Dallas / Lakewood',
  'Upper Greenville': 'Lower Greenville',
  'Venice, CA': 'Design District',  // Ospi
};
let c = processCity('const DALLAS_DATA', dallasRenames);
console.log('Dallas:', c, 'renamed');

// HOUSTON — consolidate tiny urban neighborhoods
const houstonRenames = {
  'Second Ward': 'East End',
  'Bellaire': 'Chinatown / Bellaire',
  'Uptown / Galleria': 'Galleria',
  'Uptown/Galleria': 'Galleria',
  'Meyerland': 'Southwest Houston',
  'Buffalo Bayou Park': 'Midtown',
  'Greenway Plaza': 'Upper Kirby',
  'Acres Homes': 'Heights',
  'Garden Oaks': 'Heights',
  'Katy Asian Town': 'Katy',
  'Post Oak': 'Galleria',
  'River Oaks District': 'River Oaks',
  'Multiple Suburban Locations': 'Multiple Locations',
  'Lindale Park': 'Heights',
  'Shady Acres': 'Heights',
  'Sharpstown': 'Southwest Houston',
  'Hillcroft': 'Southwest Houston',
  'Navigation District': 'East End',
  'Autry Park': 'Upper Kirby',
  'Greater Heights': 'Heights',
  'Alief': 'Southwest Houston',
  'Third Ward': 'Museum District',
  'Northside Village': 'Heights',
  'Mahatma Gandhi District': 'Midtown',
  'Chinatown/Bellaire': 'Chinatown / Bellaire',
};
c = processCity('const HOUSTON_DATA', houstonRenames);
console.log('Houston:', c, 'renamed');

// AUSTIN — consolidate Loro locations, tiny neighborhoods
const austinRenames = {
  'Warehouse District': 'Downtown',
  'Old West Austin': 'Clarksville',
  'Dirty Sixth': 'Downtown',
  'Burnet Road': 'North Loop',
  '2nd Street': 'Downtown',
  'Airport Blvd': 'East Austin',
  'Great Hills': 'North Austin',
  'West Campus': 'Downtown',
  'Austin': 'East Austin',
  'East 6th': 'East Austin',
  'Bee Cave': 'West Austin',
  'West Lake Hills': 'West Austin',
  'Windsor Park': 'North Austin',
  'North Central': 'North Austin',
  'Lakeway': 'West Austin',
  'Seaholm': 'Downtown',
  'Lake Austin': 'West Austin',
  'Crestview': 'North Loop',
  'West 6th': 'Downtown',
  'Sunset Valley': 'South Austin',
  'Cherrywood': 'East Austin',
  'Georgetown': 'North Austin',
  'Driftwood': 'South Austin',
  'Rosedale': 'North Loop',
  'Allandale': 'North Loop',
  'Dripping Springs': 'South Austin',
  'Central Austin': 'North Loop',
  'Southwest Austin': 'South Austin',
  'Lake Travis': 'West Austin',
  'Southeast Austin': 'South Austin',
  'Westlake': 'West Austin',
  'Manor Road': 'East Austin',
  'Northwest Austin': 'North Austin',
  'Bouldin Creek': 'South 1st',
  'Red River': 'Downtown',
  'Round Rock': 'North Austin',
  'Lockhart': 'South Austin',
  'UT Campus': 'Downtown',
  'Barton Springs': 'Zilker',
  'Cedar Park': 'North Austin',
};
c = processCity('const AUSTIN_DATA', austinRenames);
console.log('Austin:', c, 'renamed');

// SLC — consolidate heavily
const slcRenames = {
  'Millcreek Canyon': 'Millcreek',
  'Woods Cross': 'North Salt Lake',
  'Fairpark / Marmalade': 'Downtown SLC',
  'Big Cottonwood Canyon': 'Cottonwood',
  'Provo / BYU': 'Provo',
  'Antelope Island': 'North Salt Lake',
  'Salt Lake City Airport': 'Downtown SLC',
  'SLC Airport': 'Downtown SLC',
  'Downtown SLC (Peery Hotel)': 'Downtown SLC',
  'North SLC': 'Downtown SLC',
  'Park City (Canyons)': 'Park City',
  'Provo (Riverwoods)': 'Provo',
  'Sundance Resort': 'Sundance / Provo Canyon',
  'Kimball Junction': 'Park City',
  '9th and 9th': '9th & 9th',
  'West Side': 'Westside SLC',
  'Salt Lake City': 'Downtown SLC',
  'Capitol Hill': 'The Avenues',
  'Foothill': 'University',
  'Sugarhouse': 'Sugar House',
  'Sandy (Little Cottonwood Canyon)': 'Sandy',
  'Niles (Suburban)': 'Suburban SLC',
  'University / Foothill': 'University',
  'Chinatown': 'Westside SLC',
  'Deer Valley': 'Park City',
  'Orem': 'Provo',
  'Little Cottonwood Canyon': 'Cottonwood',
  '15th & 15th': '9th & 9th',
  'Taylorsville': 'Murray',
  'Lehi': 'Suburban SLC',
  'Ogden': 'North Salt Lake',
  'Park City (Prospector)': 'Park City',
  'Park City (Deer Valley)': 'Park City',
  'Avenues': 'The Avenues',
  'Park City (Main Street)': 'Park City',
  'Main Street (Park City)': 'Park City',
  'Main Street': 'Park City',
};
c = processCity('const SLC_DATA', slcRenames);
console.log('SLC:', c, 'renamed');

// SEATTLE — consolidate small neighborhoods
const seattleRenames = {
  'Tangletown': 'Wallingford',
  'Interbay': 'Queen Anne',
  'SoDo': 'Georgetown',
  'White Center': 'West Seattle',
  'Madison Park': 'Central District',
  'Phinney Ridge / Greenwood': 'Phinney Ridge',
  'Greenwood': 'Phinney Ridge',
  'Denny Triangle': 'South Lake Union',
  'Clyde Hill': 'Bellevue',
  'Magnolia': 'Queen Anne',
  'Belltown (Pier 67)': 'Belltown',
  'Renton': 'South Seattle',
  'Hillman City': 'Beacon Hill',
  'Lake City': 'University District',
  'Capitol Hill (Melrose Market)': 'Capitol Hill',
  'Columbia City': 'Beacon Hill',
  'Madison Valley': 'Central District',
};
c = processCity('const SEATTLE_DATA', seattleRenames);
console.log('Seattle:', c, 'renamed');

// VEGAS — consolidate non-hotel tiny neighborhoods (keep hotel-specific Strip ones)
const vegasRenames = {
  'The Strip (Crystals)': 'The Strip (Aria)',
  'The Strip (Wynn Plaza)': 'The Strip (Wynn)',
  'The Strip (Wynn Tower Suites)': 'The Strip (Wynn)',
  'The Strip (Fashion Show Mall)': 'The Strip',
  'The Strip (Luxor)': 'The Strip (Mandalay Bay)',
  'The Strip (Delano at Mandalay Bay)': 'The Strip (Mandalay Bay)',
  'The Strip (Mandalay Place)': 'The Strip (Mandalay Bay)',
  'The Strip (The Park)': 'The Strip (Park MGM)',
  'The Strip (Flamingo)': 'The Strip (Caesars Palace)',
  'University/Hard Rock Area': 'Paradise',
  'Convention Center': 'Paradise',
  'Linq Lane (Near Strip)': 'The Strip',
  'Downtown (Four Queens)': 'Downtown',
  'Downtown (The D)': 'Downtown',
  'Downtown (El Cortez)': 'Downtown (Fremont East)',
  'Downtown (Downtown Grand)': 'Downtown',
  'Downtown (Fremont Street)': 'Downtown',
  'Downtown (Container Park)': 'Downtown (Fremont East)',
  'Arts District (Main Street)': 'Arts District',
  'Paradise (Virgin Hotels)': 'Paradise',
  'Desert Shores': 'Summerlin',
  'Summerlin (Tivoli Village)': 'Summerlin (Downtown Summerlin)',
  'Summerlin (Rampart)': 'Summerlin',
  'Southeast Las Vegas': 'Henderson',
  'Green Valley (Sunset Rd)': 'Henderson',
  'Henderson (Lake Las Vegas)': 'Henderson',
  'Henderson (The District)': 'Henderson',
  'Henderson (Water Street District)': 'Henderson',
  'Henderson (Green Valley Ranch)': 'Henderson',
  'Near Strip': 'Paradise',
  'West of Strip (Palms)': 'West of Strip',
  'Town Square': 'Paradise',
  'Downtown (Golden Nugget)': 'Downtown',
  'Downtown (Plaza Hotel)': 'Downtown',
  'North Las Vegas': 'North Las Vegas',
  'East Las Vegas': 'Paradise',
};
c = processCity('const LV_DATA', vegasRenames);
console.log('Vegas:', c, 'renamed');

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDone! All neighborhoods consolidated.');
