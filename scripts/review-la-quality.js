const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const la = pa('const LA_DATA');

// Check: duplicates by normalized name
const byName = {};
la.forEach(r => {
  const k = String(r.name).toLowerCase().replace(/[^a-z]/g,'');
  if (!byName[k]) byName[k] = [];
  byName[k].push(r);
});
const dupes = Object.entries(byName).filter(([,v])=>v.length>=2);
console.log('=== DUPLICATES (same normalized name) ===');
dupes.forEach(([k,v]) => console.log(' ', k, '→', v.map(r=>`#${r.id} "${r.name}"`).join(' vs ')));
if (!dupes.length) console.log('  (none)');

// Check: missing critical fields
console.log('\n=== MISSING CRITICAL FIELDS ===');
la.forEach(r => {
  const missing = [];
  if (!r.name) missing.push('name');
  if (!r.cuisine) missing.push('cuisine');
  if (!r.neighborhood) missing.push('neighborhood');
  if (!r.address) missing.push('address');
  if (!r.lat || !r.lng) missing.push('coords');
  if (!r.description) missing.push('description');
  if (missing.length) console.log(`  #${r.id} "${r.name}" missing: ${missing.join(', ')}`);
});

// Check: coords in sensible LA metro range (lat 33.5-34.3, lng -119 to -117.5)
console.log('\n=== COORDS OUTSIDE LA METRO RANGE ===');
la.forEach(r => {
  if (r.lat === 0 && r.lng === 0) return;
  if (r.lat < 33.5 || r.lat > 34.3 || r.lng < -119 || r.lng > -117.5) {
    console.log(`  #${r.id} "${r.name}" ${r.neighborhood} coords ${r.lat},${r.lng}`);
  }
});

// Check: tags present
console.log('\n=== ENTRIES WITH NO TAGS ===');
la.forEach(r => {
  if (!r.tags || r.tags.length === 0) console.log(`  #${r.id} "${r.name}"`);
});

// Check: neighborhoods — how many unique?
const nbhds = new Set(la.map(r=>r.neighborhood).filter(Boolean));
console.log('\n=== NEIGHBORHOODS ===');
console.log('Unique count:', nbhds.size);
console.log([...nbhds].sort().join(', '));

// Summary
console.log('\n=== SUMMARY ===');
console.log('Total LA entries:', la.length);
console.log('Avg tags/entry:', (la.reduce((s,r)=>s+(r.tags||[]).length,0)/la.length).toFixed(1));
console.log('With website:', la.filter(r=>r.website).length);
console.log('With instagram:', la.filter(r=>r.instagram).length);
console.log('With awards:', la.filter(r=>r.awards).length);
console.log('Suburb flagged:', la.filter(r=>r.suburb).length);
