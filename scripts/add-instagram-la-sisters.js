// Add verified Instagram handles to the 6 new LA sister entries.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const updates = [
  [2115, '@mastrosofficial'],
  [2116, '@boasteakhouse'],
  [2117, '@sugarfish'],
  [2118, '@milkbarstore'],
  [2119, '@dintaifungusa'],
  [2120, '@hillstonerestaurantgroup'],
];

const pos = locateArray('const LA_DATA');
const la = parseArray('const LA_DATA');
let updated = 0;
updates.forEach(([id, ig]) => {
  const r = la.find(x => x.id === id);
  if (r) { r.instagram = ig; updated++; console.log('  #' + id + ' "' + r.name + '" instagram: ' + ig); }
});

html = html.substring(0, pos.arrS) + JSON.stringify(la) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nUpdated', updated, 'Instagram handles on new LA entries.');
