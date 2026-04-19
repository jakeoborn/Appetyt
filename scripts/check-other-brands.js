const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function parseArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return [];const a=m.index+m[0].length-1;const b=stackFindClose(html,a);return JSON.parse(html.substring(a,b+1));}

const cities = {Dallas:'const DALLAS_DATA',Houston:'const HOUSTON_DATA',Austin:'const AUSTIN_DATA',Chicago:'const CHICAGO_DATA',SLC:'const SLC_DATA',LV:'const LV_DATA',Seattle:'const SEATTLE_DATA',NYC:'const NYC_DATA'};
function checkBrand(pattern) {
  console.log(`\n=== ${pattern} ===`);
  Object.entries(cities).forEach(([c, v]) => {
    const d = parseArray(v);
    const hits = d.filter(r => new RegExp(pattern, 'i').test(r.name));
    hits.forEach(h => {
      console.log(`  ${c} #${h.id} "${h.name}" [${h.cuisine}] web:${h.website||'(none)'}`);
      if (h.description) console.log(`    "${h.description.slice(0,150)}"`);
    });
  });
}
['^hamsa','^leo\\b','^ruins','^bar w'].forEach(checkBrand);
