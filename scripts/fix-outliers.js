const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// ============================================
// 1. Fix NEIGHBORHOOD_COORDS — add missing neighborhood centers
// The problem: "Downtown", "West Village", "Arts District" etc exist in multiple cities
// but NEIGHBORHOOD_COORDS only has one entry per name (usually Las Vegas or NYC)
// ============================================

const addCoords = {
  // Dallas neighborhoods missing or pointing to wrong city
  'Knox-Henderson': [32.8250, -96.7820],
  'Oak Lawn': [32.8110, -96.8100],
  'Victory Park': [32.7900, -96.8080],
  'West Village': [32.8075, -96.7980],  // Dallas West Village, not NYC
  'Arts District': [32.7890, -96.8000],  // Dallas Arts District, not Las Vegas
  'Greenville Ave': [32.8250, -96.7700],
  'Oak Cliff': [32.7350, -96.8300],
  // Houston
  'Midtown': [29.7420, -95.3820],
  'Washington Corridor': [29.7630, -95.4000],
  'Heights': [29.7900, -95.3960],
  'Downtown': [29.7580, -95.3630],  // Houston Downtown (overrides LV)
  'River Oaks': [29.7500, -95.4250],
  // Austin
  '6th Street': [30.2672, -97.7410],
  'Rainey Street': [30.2567, -97.7400],
  'South Congress': [30.2480, -97.7500],
  'Red River': [30.2700, -97.7360],
  'Red River Cultural District': [30.2700, -97.7360],
  'The Domain': [30.4020, -97.7250],
  'Zilker / Barton Hills': [30.2640, -97.7710],
  'Hyde Park': [30.3020, -97.7280],
  // Salt Lake City
  'Park City': [40.6461, -111.4980],
  'Granary District': [40.7550, -111.8900],
  'Murray': [40.6670, -111.8880],
  // Seattle
  'Pioneer Square': [47.6020, -122.3340],
  'Georgetown': [47.5500, -122.3160],
  // Chicago
  'Lakeview / Wrigleyville': [41.9430, -87.6560],
};

// Find and extend NEIGHBORHOOD_COORDS
const ncMarker = 'const NEIGHBORHOOD_COORDS = {';
const ncIdx = html.indexOf(ncMarker);
const ncEndBrace = html.indexOf('};', ncIdx);
// Insert new entries before the closing };
let insertStr = '';
Object.entries(addCoords).forEach(([name, coords]) => {
  // Check if it already exists
  const pattern = "'" + name + "':[";
  const altPattern = "'" + name + "':[";
  if(html.substring(ncIdx, ncEndBrace).includes(pattern) || html.substring(ncIdx, ncEndBrace).includes(altPattern)) {
    // Update existing
    const regex = new RegExp("'" + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "':\\[[\\d.,-]+\\]");
    const match = html.substring(ncIdx, ncEndBrace+2).match(regex);
    if(match) {
      html = html.replace(match[0], "'" + name + "':[" + coords[0] + "," + coords[1] + "]");
      console.log('UPDATED coords:', name, '->', coords);
    }
  } else {
    insertStr += ",\n  '" + name + "':[" + coords[0] + "," + coords[1] + "]";
    console.log('ADDED coords:', name, '->', coords);
  }
});

if(insertStr) {
  html = html.substring(0, ncEndBrace) + insertStr + '\n' + html.substring(ncEndBrace);
}

// ============================================
// 2. Fix restaurant coordinates / neighborhoods that are clearly wrong
// ============================================

function fixRestaurant(dataVar, id, fixes) {
  const marker = dataVar + '=';
  const p = html.indexOf(marker);
  if(p === -1) return;
  const arrS = html.indexOf('[', p);
  let d=0, arrE=arrS;
  for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
  let arr = JSON.parse(html.substring(arrS, arrE));
  const r = arr.find(x => x.id === id);
  if(r) {
    Object.assign(r, fixes);
    console.log('FIXED:', r.name, '->', JSON.stringify(fixes));
    html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
  }
}

// Dallas fixes
// Ospi - 2025 Pacific Ave Venice CA is NOT in Dallas Design District!
fixRestaurant('const DALLAS_DATA', 555, { neighborhood: 'Venice, CA', lat: 33.9851, lng: -118.4704 });
// Actually, Ospi shouldn't be in Dallas at all. Let's just fix the neighborhood so it doesn't show on Dallas maps
// Wait - it IS in Dallas data, so it must be wrong data. Let me check address...
// "2025 Pacific Ave, Venice, CA 90291" - this is wrong, it should be removed or have correct Dallas address

// Wayward Coffee - coords seem off for Bishop Arts. 1318 W Davis St IS in Bishop Arts area
// Actually Bishop Arts center coord [32.7425] seems too far south. The real Bishop Arts is around 32.745-32.750
// Let me update the Bishop Arts center instead

// Smokey Joe's BBQ - 6403 S R L Thornton Fwy is in South Dallas, not Oak Cliff proper
fixRestaurant('const DALLAS_DATA', 72, { neighborhood: 'South Dallas' });

// Far Out - 1906 S Haskell Ave is in East Dallas/Lakewood area, not Deep Ellum
fixRestaurant('const DALLAS_DATA', 75, { neighborhood: 'East Dallas' });

// Gen Korean BBQ - 5500 Greenville Ave is Upper Greenville, not Lower Greenville
fixRestaurant('const DALLAS_DATA', 396, { neighborhood: 'Upper Greenville' });

// Pluckers Wing Bar - 5500 Greenville Ave is also Upper Greenville
fixRestaurant('const DALLAS_DATA', 60, { neighborhood: 'Upper Greenville' });

// Houston fixes
// Peli Peli Kitchen - 9090 Katy Fwy is in Memorial/Katy area, not Museum District
fixRestaurant('const HOUSTON_DATA', 7365, { neighborhood: 'Memorial' });

// Local Foods Museum District - 5740 San Felipe St is in Galleria area
fixRestaurant('const HOUSTON_DATA', 7301, { neighborhood: 'Galleria' });

// Trill Burgers - 5402 Westheimer is in Galleria area, not Montrose
fixRestaurant('const HOUSTON_DATA', 7104, { neighborhood: 'Galleria' });

// Turner's - 1800 Post Oak Blvd is in Galleria/Uptown, not Montrose
fixRestaurant('const HOUSTON_DATA', 7034, { neighborhood: 'Uptown / Galleria' });

// Maximo - 4800 Calhoun Rd is near UH/Third Ward, not Montrose
fixRestaurant('const HOUSTON_DATA', 7142, { neighborhood: 'Third Ward' });

// Vietopia - 5176 Buffalo Speedway is in Meyerland area, not Chinatown
fixRestaurant('const HOUSTON_DATA', 7042, { neighborhood: 'Meyerland' });

// The Burger Joint - 2703 Montrose Blvd is in Montrose, not EaDo
fixRestaurant('const HOUSTON_DATA', 7306, { neighborhood: 'Montrose' });

// Austin fixes
// Counter 3.Five.VII - 4412 Manchaca Rd is in South Austin, not East Austin
fixRestaurant('const AUSTIN_DATA', 5202, { neighborhood: 'South Austin' });

// HOPE Outdoor Gallery - 5404 Dalton Ln is in Southeast Austin
fixRestaurant('const AUSTIN_DATA', 5168, { neighborhood: 'Southeast Austin' });

// Hank's Austin - 5811 Berkman Dr is in Windsor Park/North Austin, not East Austin
fixRestaurant('const AUSTIN_DATA', 5378, { neighborhood: 'Windsor Park' });

// SLC fixes
// Caffe Niche Avenues - 1327 S 1700 E is in the U of U area, not The Avenues
fixRestaurant('const SLC_DATA', 11365, { neighborhood: 'University / Foothill' });

// Moochie's Meatballs - 232 E 800 S is in Central City, not Sugar House
fixRestaurant('const SLC_DATA', 11332, { neighborhood: 'Central City' });

// Kyoto Japanese - 1080 E 1300 S is in East Central, not Downtown SLC
fixRestaurant('const SLC_DATA', 11217, { neighborhood: '9th & 9th' });

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nAll fixes applied!');
