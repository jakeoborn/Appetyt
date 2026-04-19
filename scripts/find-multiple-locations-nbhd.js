const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const cities={Dallas:'const DALLAS_DATA',Houston:'const HOUSTON_DATA',Austin:'const AUSTIN_DATA',Chicago:'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA',Seattle:'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA',Phoenix:'const PHX_DATA'};
Object.entries(cities).forEach(([c,v])=>{
  const d=pa(v);
  const hits=d.filter(r=>/multiple locations/i.test(r.neighborhood||'')||/^unknown$|^other$|^misc$|^tbd$|^various$/i.test((r.neighborhood||'').trim()));
  if(hits.length){
    console.log(`${c}: ${hits.length} entries with generic neighborhood label`);
    hits.forEach(h=>console.log(`  #${h.id} "${h.name}" neighborhood="${h.neighborhood}" address="${h.address}"`));
  }
});
