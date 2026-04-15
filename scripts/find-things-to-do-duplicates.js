// Find Entertainment-cuisine entries in city data arrays that duplicate CITY_EXTRAS thingsToDo names
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');

// Manually list CITY_EXTRAS thingsToDo names per city (from the verified data we just shipped)
const extras = {
  'Las Vegas': ['Fountains of Bellagio','Red Rock Canyon','The Sphere Exterior Shows','Area 15 + Meow Wolf','Fremont Street Experience','Valley of Fire State Park','Hoover Dam','Casino-Hopping on the Strip'],
  'New York': ['Little Island','SUMMIT One Vanderbilt','Brooklyn Bridge Walk','Staten Island Ferry','Edge Observation Deck','Governors Island','9/11 Memorial & Museum','Broadway'],
  'Dallas': ['Reunion Tower GeO-Deck','Dallas Museum of Art','AT&T Stadium','Klyde Warren Park','Sixth Floor Museum','McKinney Avenue Trolley','White Rock Lake','Dallas Arboretum'],
  'Houston': ['Space Center Houston','Museum District','The Menil Collection','Hermann Park','Buffalo Bayou Park','Houston Zoo','Discovery Green','Toyota Center + NRG Stadium'],
  'Chicago': ['Cloud Gate (The Bean)','Art Institute of Chicago','Chicago Architecture River Cruise','Skydeck at Willis Tower','Lincoln Park Zoo','Lakefront Trail','Field Museum','The Second City'],
  'Austin': ['Congress Ave Bridge Bats','Texas State Capitol','Barton Springs Pool','Zilker Park','South Congress (SoCo)','Blanton Museum of Art','Lady Bird Lake Trail','Mount Bonnell'],
  'Salt Lake City': ['Temple Square','Cottonwood Canyons','Great Salt Lake + Antelope Island','Park City + Deer Valley','Utah State Capitol','Natural History Museum of Utah','Red Butte Garden + Arboretum','Delta Center'],
  'Seattle': ['Space Needle','Pike Place Market','Chihuly Garden + Glass','Bainbridge Island Ferry','Kerry Park Viewpoint','Seattle Center','Seattle Underground Tour','Discovery Park']
};

const dataMarkers = {
  'Las Vegas': 'const LV_DATA=',
  'New York': 'const NYC_DATA = ',
  'Dallas': 'const DALLAS_DATA=',
  'Houston': 'const HOUSTON_DATA=',
  'Chicago': "'Chicago':[",
  'Austin': 'const AUSTIN_DATA=',
  'Salt Lake City': 'const SLC_DATA=',
  'Seattle': 'const SEATTLE_DATA='
};

function fuzzyMatch(a,b){
  a=a.toLowerCase().replace(/[^a-z0-9]/g,'');
  b=b.toLowerCase().replace(/[^a-z0-9]/g,'');
  return a===b || a.includes(b) || b.includes(a);
}

for(const city of Object.keys(extras)){
  const marker = dataMarkers[city];
  const idx = html.indexOf(marker);
  if(idx<0){ console.log(city,'- marker not found'); continue; }
  const arrStart = html.indexOf('[', idx);
  let depth=0, end=arrStart;
  for(let j=arrStart;j<html.length;j++){
    if(html[j]==='[')depth++;
    if(html[j]===']'){depth--; if(depth===0){end=j+1;break;}}
  }
  const slice = html.substring(arrStart, end);
  let arr;
  try{ arr = JSON.parse(slice); }
  catch(e){
    // NYC_DATA uses unquoted keys — not JSON parseable. Use regex fallback.
    console.log(city,'- non-JSON array, regex fallback');
    const matches = slice.match(/(?:name|"name"):\s*['"]([^'"]+)['"][^}]*?(?:cuisine|"cuisine"):\s*['"]Entertainment['"]/g) || [];
    const ents = matches.map(m=>(m.match(/(?:name|"name"):\s*['"]([^'"]+)['"]/)||[])[1]).filter(Boolean);
    const dups = ents.filter(name=>extras[city].some(e=>fuzzyMatch(name,e)));
    console.log(city,'(regex)','- dups:', dups.length ? dups : 'NONE');
    continue;
  }
  const ents = arr.filter(r=>r.cuisine==='Entertainment').map(r=>r.name);
  const dups = ents.filter(name=>extras[city].some(e=>fuzzyMatch(name,e)));
  console.log(city,'- Entertainment count:',ents.length,'- duplicates:',dups.length ? dups : 'NONE');
}
