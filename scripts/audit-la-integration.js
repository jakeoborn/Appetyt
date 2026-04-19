const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));if(!m)return null;const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const la = pa('const LA_DATA');
console.log('LA_DATA count:', la.length, 'max id:', Math.max(...la.map(r=>r.id)));
console.log('Sample names:', la.slice(0, 5).map(r=>r.name).join(', '));

// CITY_DATA mapping check
const cdStart = html.indexOf('const CITY_DATA');
if (cdStart !== -1) {
  const seg = html.substring(cdStart, cdStart + 5000);
  console.log('\nLos Angeles in CITY_DATA mapping?', /['"]Los Angeles['"]/.test(seg));
  console.log('LA_DATA referenced?', /LA_DATA/.test(seg));
  // Find the CITY_DATA keys
  const keys = seg.match(/['"]([^'"]+)['"]\s*:\s*[A-Z_]+_DATA/g);
  console.log('CITY_DATA keys:', keys);
} else {
  console.log('CITY_DATA not found');
}

// CITY_GROUPS
const cgStart = html.indexOf('const CITY_GROUPS');
const cgSeg = html.substring(cgStart, cgStart + 800);
console.log('\nCITY_GROUPS block:\n', cgSeg.substring(0, 500));

// Other integrations
console.log('\nCITY_COORDS includes Los Angeles?', /Los Angeles['"]\s*:\s*\[[\d.-]+,\s*[\d.-]+\]/.test(html));
console.log('CITY_EXTRAS has Los Angeles?', /'Los Angeles':\s*\{/.test(html));
