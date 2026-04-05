const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));

// =====================================================
// NEIGHBORHOOD CONSOLIDATION MAP
// Merge 85 → ~35 meaningful neighborhoods
// =====================================================
const mergeMap = {
  // Spelling fixes
  'NoLita': 'Nolita',
  'NoLIta': 'Nolita',
  'TriBeCa': 'Tribeca',

  // Manhattan merges
  'Little Italy': 'Nolita',
  'Chelsea Market': 'Chelsea',
  'Central Park South': 'Upper West Side',
  'Columbus Circle': 'Upper West Side',
  'Lincoln Center': 'Upper West Side',
  'Morningside Heights': 'Upper West Side',
  'Koreatown': 'Midtown',
  'Times Square': 'Midtown',
  'Murray Hill': 'Midtown East',
  'Gramercy': 'Flatiron / NoMad',
  'NoMad': 'Flatiron / NoMad',
  'Union Square': 'Flatiron / NoMad',
  'Washington Square': 'Greenwich Village',
  'East Harlem': 'Harlem',
  'Washington Heights': 'Harlem / Upper Manhattan',
  'Liberty Island': 'Financial District',
  'Brooklyn Bridge': 'Financial District',

  // Brooklyn merges
  'East Williamsburg': 'Williamsburg',
  'Downtown Brooklyn': 'Brooklyn Heights',
  'Boerum Hill': 'Brooklyn Heights',
  'Brooklyn Bridge Park': 'DUMBO',
  'Cobble Hill': 'Carroll Gardens / Cobble Hill',
  'Carroll Gardens': 'Carroll Gardens / Cobble Hill',
  'Prospect Heights': 'Park Slope / Prospect Heights',
  'Park Slope': 'Park Slope / Prospect Heights',
  'Fort Greene': 'Fort Greene / Clinton Hill',
  'Clinton Hill': 'Fort Greene / Clinton Hill',
  'Brighton Beach': 'Coney Island / South Brooklyn',
  'Coney Island': 'Coney Island / South Brooklyn',
  'Bay Ridge': 'Coney Island / South Brooklyn',
  'Gravesend': 'Coney Island / South Brooklyn',
  'Midwood': 'Coney Island / South Brooklyn',
  'Sunset Park': 'Coney Island / South Brooklyn',
  'Brooklyn Navy Yard': 'Brooklyn Navy Yard',

  // Queens merges
  'Elmhurst': 'Jackson Heights / Elmhurst',
  'Jackson Heights': 'Jackson Heights / Elmhurst',
  'Woodside': 'Queens',
  'Maspeth': 'Queens',
  'Forest Hills': 'Queens',
  'Rockaway Beach': 'Queens',
  'Roosevelt Island': 'Midtown East',

  // Bronx merges
  'Belmont': 'Bronx',
  'Arthur Avenue, Bronx': 'Bronx',
  'Mott Haven': 'Bronx',

  // Cleanup
  'Multiple Locations': 'Multiple Locations',
  'Multiple Stops': 'Multiple Locations',
  'New York Harbor': 'Financial District',
};

let fixes = 0;
for(const r of arr) {
  if(mergeMap[r.neighborhood]) {
    r.neighborhood = mergeMap[r.neighborhood];
    fixes++;
  }
}
console.log('Consolidated', fixes, 'neighborhood assignments');

// Count final neighborhoods
const nbhd = {};
arr.forEach(r => { nbhd[r.neighborhood] = (nbhd[r.neighborhood]||0) + 1; });
const sorted = Object.entries(nbhd).sort((a,b)=>b[1]-a[1]);
console.log('Neighborhoods reduced from 85 to', sorted.length);
console.log('');
sorted.forEach(([n,c]) => console.log(c.toString().padStart(4), n));

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);

// =====================================================
// ADD NYC NEIGHBORHOOD DESCRIPTIONS
// These appear in the neighborhood picker/guide
// =====================================================
// Check if NYC_NEIGHBORHOODS or similar exists
const existingNbhds = html.indexOf("'Lower East Side':{emoji:");
if(existingNbhds > -1) {
  console.log('\nNeighborhood descriptions already exist at offset', existingNbhds);
} else {
  console.log('\nNo neighborhood descriptions found - would need to add');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('\nDone!');
