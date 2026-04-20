const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
for (const v of ['PARK_DATA', 'MALL_DATA', 'MUSEUM_DATA', 'HOTEL_DATA']) {
  const m = html.match(new RegExp('const ' + v + '\\s*=\\s*\\{'));
  if (!m) { console.log(v + ': not found'); continue; }
  const start = m.index + m[0].length - 1;
  let d = 0, inStr = false, esc = false, sc = null, end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (c === sc) { inStr = false; sc = null; } continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; sc = c; continue; }
    if (c === '{') d++;
    if (c === '}') { d--; if (d === 0) { end = i + 1; break; } }
  }
  const slice = html.substring(start, end);
  const photoCount = (slice.match(/"photoUrl"|photoUrl:/g) || []).length;
  try {
    JSON.parse(slice);
    console.log(`${v}: ${photoCount} photoUrl fields, parses as pure JSON`);
  } catch (e) {
    try {
      new Function('return ' + slice)();
      console.log(`${v}: ${photoCount} photoUrl fields, parses as JS literal (not pure JSON)`);
    } catch (e2) {
      console.log(`${v}: ${photoCount} photoUrl fields, BROKEN: ${e2.message.substring(0, 80)}`);
    }
  }
}
