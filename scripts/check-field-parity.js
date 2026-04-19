const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const cities={'Dallas':'const DALLAS_DATA','Austin':'const AUSTIN_DATA','Houston':'const HOUSTON_DATA','NYC':'const NYC_DATA','Seattle':'const SEATTLE_DATA','Chicago':'const CHICAGO_DATA','SLC':'const SLC_DATA','LV':'const LV_DATA','LA':'const LA_DATA'};
Object.entries(cities).forEach(([c,v])=>{
  const d=pa(v);
  const hasPhoto=d.filter(r=>'photoUrl' in r).length;
  const hasVerified=d.filter(r=>'verified' in r).length;
  const hasPhone=d.filter(r=>'phone' in r).length;
  const hasReserveUrl=d.filter(r=>'reserveUrl' in r).length;
  const hasRes_tier=d.filter(r=>'res_tier' in r).length;
  console.log(c.padEnd(8), 'total:' + d.length, '| photo:'+hasPhoto, 'verified:'+hasVerified, 'phone:'+hasPhone, 'reserveUrl:'+hasReserveUrl, 'res_tier:'+hasRes_tier);
});
