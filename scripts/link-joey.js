const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;const b=stackFindClose(html,a);return{arrS:a,arrE:b+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const h = parseArray('const HOUSTON_DATA');
const s = parseArray('const SEATTLE_DATA');
const jh = h.find(r => r.id === 7519);
const js = s.find(r => r.id === 9376);
if (jh) { jh.cityLinks = Array.from(new Set([...(jh.cityLinks||[]), 'Seattle'])); }
if (js) { js.cityLinks = Array.from(new Set([...(js.cityLinks||[]), 'Houston'])); }

const sPos = locateArray('const SEATTLE_DATA');
html = html.substring(0, sPos.arrS) + JSON.stringify(s) + html.substring(sPos.arrE);
const hPos = locateArray('const HOUSTON_DATA');
html = html.substring(0, hPos.arrS) + JSON.stringify(h) + html.substring(hPos.arrE);

fs.writeFileSync('index.html', html, 'utf8');
console.log('JOEY linked:');
console.log('  Houston#7519:', jh.cityLinks);
console.log('  Seattle#9376:', js.cityLinks);
