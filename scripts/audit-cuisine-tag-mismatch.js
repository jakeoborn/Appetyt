// Audit: find restaurants where a tag implies a cuisine that conflicts with the primary cuisine field.
// E.g. Mamani cuisine="French / Riviera" but tags=["Mexican"] → mismatch.
const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');

// Cuisine-like tags that should match the cuisine field if present
const cuisineTags = [
  'Mexican','Italian','French','Japanese','Chinese','Thai','Indian','Korean',
  'Vietnamese','Spanish','Greek','Turkish','Lebanese','Mediterranean','American',
  'Southern','Cajun','British','Irish','German','Peruvian','Argentine','Brazilian',
  'Ethiopian','Moroccan','Persian','Nepali','Filipino','Hawaiian','Caribbean',
  'Cuban','Colombian','Venezuelan','Salvadoran','Tex-Mex','BBQ','Steakhouse',
  'Seafood','Sushi','Pizza','Ramen','Dim Sum','Tapas'
];
const cuisineTagsLower = cuisineTags.map(t=>t.toLowerCase());

// Parse all JSON city arrays
const markers = {
  'Dallas': 'const DALLAS_DATA=',
  'Las Vegas': 'const LV_DATA=',
  'Houston': 'const HOUSTON_DATA=',
  'Austin': 'const AUSTIN_DATA=',
  'Salt Lake City': 'const SLC_DATA=',
  'Seattle': 'const SEATTLE_DATA=',
};

function extractArray(marker){
  const idx = html.indexOf(marker);
  if(idx<0) return null;
  const arrStart = html.indexOf('[', idx);
  let depth=0, end=arrStart;
  for(let j=arrStart;j<html.length;j++){
    if(html[j]==='[') depth++;
    if(html[j]===']'){depth--; if(depth===0){end=j+1;break;}}
  }
  try{ return JSON.parse(html.substring(arrStart, end)); }
  catch(e){ return null; }
}

// NYC_DATA is non-JSON (unquoted keys) — use regex
function extractNYC(){
  const marker = 'const NYC_DATA = ';
  const idx = html.indexOf(marker);
  if(idx<0) return [];
  const arrStart = html.indexOf('[', idx);
  let depth=0, end=arrStart;
  for(let j=arrStart;j<html.length;j++){
    if(html[j]==='[') depth++;
    if(html[j]===']'){depth--; if(depth===0){end=j+1;break;}}
  }
  const slice = html.substring(arrStart, end);
  // Extract name + cuisine + tags via regex
  const entries = [];
  const re = /\{[^}]*?name:\s*"([^"]+)"[^}]*?cuisine:\s*"([^"]+)"[^}]*?tags:\s*\[([^\]]*)\]/g;
  let m;
  while((m=re.exec(slice))!==null){
    const name = m[1];
    const cuisine = m[2];
    const tagsStr = m[3];
    const tags = tagsStr.match(/"([^"]+)"/g);
    entries.push({name, cuisine, tags: tags ? tags.map(t=>t.replace(/"/g,'')) : []});
  }
  return entries;
}

// Chicago is inline in CITY_DATA
function extractChicago(){
  const marker = "'Chicago':[";
  const idx = html.indexOf(marker);
  if(idx<0) return null;
  const arrStart = html.indexOf('[', idx);
  let depth=0, end=arrStart;
  for(let j=arrStart;j<html.length;j++){
    if(html[j]==='[') depth++;
    if(html[j]===']'){depth--; if(depth===0){end=j+1;break;}}
  }
  try{ return JSON.parse(html.substring(arrStart, end)); }
  catch(e){ return null; }
}

let issues = [];

function audit(city, data){
  if(!data||!data.length) return;
  data.forEach(r => {
    const tags = (r.tags||[]).map(t=>t.toLowerCase());
    const cuisine = (r.cuisine||'').toLowerCase();
    tags.forEach(tag => {
      const tagIdx = cuisineTagsLower.indexOf(tag);
      if(tagIdx === -1) return; // not a cuisine-like tag
      const tagName = cuisineTags[tagIdx];
      // Check if cuisine contains this tag (flexible: "French / Riviera" contains "French")
      if(!cuisine.includes(tag)){
        // Exception: fusion / pan-asian / etc
        if(cuisine.includes('fusion') || cuisine.includes('pan-') || cuisine.includes('eclectic')) return;
        issues.push({city, name:r.name, cuisine:r.cuisine, conflictTag:tagName, allTags:(r.tags||[]).join(', ')});
      }
    });
  });
}

for(const [city, marker] of Object.entries(markers)){
  const data = extractArray(marker);
  if(data) audit(city, data);
  else console.log(city, '- could not parse');
}

const nycData = extractNYC();
audit('New York', nycData);

const chiData = extractChicago();
if(chiData) audit('Chicago', chiData);

console.log(`\n=== CUISINE/TAG MISMATCH AUDIT ===`);
console.log(`Found ${issues.length} potential mismatches:\n`);
issues.forEach(i => {
  console.log(`${i.city} | ${i.name}`);
  console.log(`  Cuisine: "${i.cuisine}"`);
  console.log(`  Conflict tag: "${i.conflictTag}"`);
  console.log(`  All tags: ${i.allTags}`);
  console.log('');
});
