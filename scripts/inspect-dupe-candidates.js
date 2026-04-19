const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function scf(s,o){let d=0;for(let i=o;i<s.length;i++){if(s[i]==='[')d++;else if(s[i]===']'){d--;if(!d)return i;}}return -1;}
function pa(v){const m=html.match(new RegExp(v+'\\s*=\\s*\\['));const a=m.index+m[0].length-1;return JSON.parse(html.substring(a,scf(html,a)+1));}
const cities={'Dallas':'const DALLAS_DATA','Houston':'const HOUSTON_DATA','Austin':'const AUSTIN_DATA','Chicago':'const CHICAGO_DATA','Salt Lake City':'const SLC_DATA','Las Vegas':'const LV_DATA','Seattle':'const SEATTLE_DATA','New York':'const NYC_DATA','Los Angeles':'const LA_DATA','Phoenix':'const PHX_DATA'};
const lookups = [
  ['Austin',[5054,5331]],['Austin',[5080,5545]],
  ['Chicago',[18,461]],['Chicago',[66,168]],
  ['Salt Lake City',[11057,11552]],['Salt Lake City',[11129,11591]],['Salt Lake City',[11227,11567]],
  ['Las Vegas',[12054,12326]],['Las Vegas',[12232,12453]],['Las Vegas',[12340,12458]],['Las Vegas',[12425,12501]],
  ['Seattle',[9034,9397]],['Seattle',[9199,9378]],['Seattle',[9226,9338]],
  ['New York',[1095,1810]],['New York',[1546,1891]],
];
lookups.forEach(([city, ids]) => {
  const d = pa(cities[city]);
  console.log('\n=== ' + city + ' #' + ids.join(' + #') + ' ===');
  ids.forEach(id => {
    const r = d.find(x => x.id === id);
    if (!r) { console.log('  #'+id+' NOT FOUND'); return; }
    console.log('  #'+id+' "'+r.name+'" ('+r.neighborhood+') $'+r.price+' score:'+r.score);
    console.log('    addr: '+ (r.address||'(none)'));
    console.log('    desc: "'+ (r.description||'').slice(0,200) +'"');
  });
});
