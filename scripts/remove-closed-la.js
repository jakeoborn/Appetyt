// Remove 3 LA entries confirmed closed via LA Times 2025 closures article:
// - Cassia (Santa Monica) — closed Feb 2025, Rustic Canyon Family group
// - Birdie G's (Santa Monica) — closed Dec 2025, same group
// - Bar Chelou (Old Pasadena) — closed Feb 2025, Eaton fire fallout
// Source: latimes.com/food/story/2025-12-31/more-than-100-la-restaurant-closures-in-2025

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

const pos = locateArray('const LA_DATA');
const la = parseArray('const LA_DATA');

// Cassia #2087, Birdie G's #2091, Bar Chelou #2096
const removeIds = [2087, 2091, 2096];
const removed = la.filter(r => removeIds.includes(r.id));
const survivors = la.filter(r => !removeIds.includes(r.id));

html = html.substring(0, pos.arrS) + JSON.stringify(survivors) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Removed', removed.length, 'closed LA entries:');
removed.forEach(r => console.log('  #' + r.id + ' "' + r.name + '" (' + r.neighborhood + ')'));
console.log('LA_DATA:', la.length, '→', survivors.length);
