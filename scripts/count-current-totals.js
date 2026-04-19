const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function parseArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return [];const a=m.index+m[0].length-1;const b=stackFindClose(html,a);return JSON.parse(html.substring(a,b+1));}
const cities = {Dallas:'const DALLAS_DATA',Houston:'const HOUSTON_DATA',Austin:'const AUSTIN_DATA',Chicago:'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',Seattle:'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA'};
let total = 0;
Object.entries(cities).forEach(([c,v])=>{const d=parseArray(v);console.log(c+':',d.length);total+=d.length;});
console.log('TOTAL:', total);
