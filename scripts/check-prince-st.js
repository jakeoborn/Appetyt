const fs=require('fs');const html=fs.readFileSync('index.html','utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const cities={'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA','Chicago':'const CHICAGO_DATA','SLC':'const SLC_DATA','Vegas':'const LV_DATA','Seattle':'const SEATTLE_DATA','NYC':'const NYC_DATA','LA':'const LA_DATA','Phoenix':'const PHX_DATA'};
Object.entries(cities).forEach(([c,v])=>{
  const d=pa(v);
  const hits = d.filter(r => /prince\s*st|prince\s*street/i.test(r.name));
  hits.forEach(h => console.log(c, '#'+h.id, '"'+h.name+'"', 'cuisine:'+h.cuisine, 'cityLinks:', JSON.stringify(h.cityLinks||[])));
});
