const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}

const cities={Dallas:'const DALLAS_DATA',Houston:'const HOUSTON_DATA',Austin:'const AUSTIN_DATA',Chicago:'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',Seattle:'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',Phoenix:'const PHX_DATA'};
const perCity = {};
Object.entries(cities).forEach(([c,v]) => { perCity[c] = pa(v); });

// For each of my 6 new LA entries, verify each claimed cityLink has a real matching brand in that city
const la = perCity['Los Angeles'];
const myNew = la.filter(r => r.id >= 2115 && r.id <= 2120);

myNew.forEach(r => {
  console.log(`\n${r.name} (#${r.id}) cityLinks: [${(r.cityLinks||[]).join(', ')}]`);
  (r.cityLinks||[]).forEach(linkedCity => {
    const brandWord = r.name.toLowerCase().split(' ')[0].replace(/[^a-z]/g,'');
    const targetData = perCity[linkedCity];
    const matches = targetData.filter(x => {
      const xname = x.name.toLowerCase();
      // Require word boundary match on the first word of the LA name
      return new RegExp('\\b' + brandWord + '\\b').test(xname);
    });
    if (matches.length) {
      console.log(`  ${linkedCity}: ✓ found ${matches.length} match(es):`, matches.map(m => `#${m.id} "${m.name}"`).join(', '));
    } else {
      console.log(`  ${linkedCity}: ✗ NO MATCH — likely stale link`);
    }
  });
});
