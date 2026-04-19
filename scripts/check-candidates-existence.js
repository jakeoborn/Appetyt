const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function parseArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return [];const a=m.index+m[0].length-1;const b=stackFindClose(html,a);return JSON.parse(html.substring(a,b+1));}

const austin = parseArray('const AUSTIN_DATA');
const slc = parseArray('const SLC_DATA');

console.log('Austin count:', austin.length, 'max id:', Math.max(...austin.map(r => r.id)));
console.log('SLC count:', slc.length, 'max id:', Math.max(...slc.map(r => r.id)));

const austinCandidates = ['Paprika ATX','Tzintzuntzan',"Rocco's Neighborhood Joint","Rocco's"];
const slcCandidates = ['Cosmica','Drunken Kitchen','Mar | Muntanya','Mar Muntanya','Mar-Muntanya','Beirut Cafe'];

console.log('\nAustin candidates already in data?');
austinCandidates.forEach(n => {
  const hit = austin.find(r => r.name.toLowerCase().includes(n.toLowerCase()));
  console.log(' ', n, '→', hit ? `EXISTS #${hit.id} "${hit.name}"` : 'new');
});
console.log('\nSLC candidates already in data?');
slcCandidates.forEach(n => {
  const hit = slc.find(r => r.name.toLowerCase().includes(n.toLowerCase()));
  console.log(' ', n, '→', hit ? `EXISTS #${hit.id} "${hit.name}"` : 'new');
});
