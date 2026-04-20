const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
for (const v of ['HOTEL_DATA', 'MALL_DATA', 'PARK_DATA', 'MUSEUM_DATA']) {
  const m = html.match(new RegExp('const ' + v + '\\s*=\\s*\\{'));
  const start = m.index + m[0].length - 1;
  let d = 0, inStr = false, esc = false, sc = null, end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (c === sc) { inStr = false; sc = null; } continue; }
    if (c === '"' || c === "'") { inStr = true; sc = c; continue; }
    if (c === '{') d++;
    if (c === '}') { d--; if (d === 0) { end = i + 1; break; } }
  }
  try {
    const obj = JSON.parse(html.substring(start, end));
    let photos = 0, items = 0;
    for (const city of Object.keys(obj)) { (obj[city] || []).forEach(it => { items++; if (it.photoUrl) photos++; }); }
    console.log(`${v}: parses OK, ${items} items, ${photos} with photoUrl`);
  } catch (e) { console.log(`${v}: PARSE ERROR ${e.message}`); }
}
