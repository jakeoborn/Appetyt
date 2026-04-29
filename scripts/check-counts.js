'use strict';
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
function getData(city) {
  const pat = 'const ' + city + '_DATA\\s*=\\s*\\[';
  const m = html.match(new RegExp(pat));
  const s = m.index + m[0].length;
  let d=1, p=s;
  while (p < html.length && d > 0) { if (html[p]==='[') d++; else if (html[p]===']') d--; p++; }
  return eval('[' + html.slice(s, p-1) + ']');
}
['NYC','DALLAS','HOUSTON','CHICAGO','AUSTIN','LA'].forEach(city => {
  const data = getData(city);
  const maxId = Math.max(...data.map(r => r.id));
  console.log(city + ': count=' + data.length + ' maxId=' + maxId);
});
