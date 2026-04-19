const fs=require('fs');let html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);const a=m.index+m[0].length-1;return {arrS:a,arrE:scf(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}
const slc = parseArray('const SLC_DATA');
const stk = slc.find(r => r.id === 11529);
if (!stk) { console.log('NOT FOUND'); process.exit(1); }
console.log('Before:', stk.name, 'cityLinks:', JSON.stringify(stk.cityLinks||[]));
const existing = Array.isArray(stk.cityLinks) ? stk.cityLinks : [];
const set = new Set(existing);
['New York','Chicago','Los Angeles'].forEach(c => set.add(c));
stk.cityLinks = [...set];
console.log('After:', stk.name, 'cityLinks:', JSON.stringify(stk.cityLinks));
const pos = locateArray('const SLC_DATA');
html = html.substring(0, pos.arrS) + JSON.stringify(slc) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated.');
