const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function parseArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return [];const a=m.index+m[0].length-1;const b=stackFindClose(html,a);return JSON.parse(html.substring(a,b+1));}

const h = parseArray('const HOUSTON_DATA');
const s = parseArray('const SEATTLE_DATA');
const jh = h.find(r => /^joey/i.test(r.name));
const js = s.find(r => /^joey/i.test(r.name));
console.log('Houston:', jh && {name:jh.name, cuisine:jh.cuisine, website:jh.website, desc:jh.description?.slice(0,200)});
console.log('\nSeattle:', js && {name:js.name, cuisine:js.cuisine, website:js.website, desc:js.description?.slice(0,200)});
