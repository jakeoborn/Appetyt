const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const pos = locateArray('const LA_DATA');
const la = parseArray('const LA_DATA');
let fixed = 0;

const boa = la.find(r => r.id === 2116);
if (boa && Array.isArray(boa.cityLinks)) {
  const before = boa.cityLinks.length;
  boa.cityLinks = boa.cityLinks.filter(c => c !== 'Dallas');
  if (boa.cityLinks.length !== before) { fixed++; console.log('  BOA LA#2116 -Dallas (no Dallas BOA entry exists)'); }
}

const dtf = la.find(r => r.id === 2119);
if (dtf && Array.isArray(dtf.cityLinks)) {
  const before = dtf.cityLinks.length;
  dtf.cityLinks = dtf.cityLinks.filter(c => c !== 'New York');
  if (dtf.cityLinks.length !== before) { fixed++; console.log('  Din Tai Fung LA#2119 -New York (no NYC DTF entry exists)'); }
}

html = html.substring(0, pos.arrS) + JSON.stringify(la) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nFixed', fixed, 'bad cityLinks on new LA entries.');
