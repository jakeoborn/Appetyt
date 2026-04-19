const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html","utf8");
function arrOf(name) {
  const re = new RegExp("const\\s+" + name + "\\s*=\\s*\\[");
  const m = html.match(re);
  if (!m) return [];
  const start = m.index + m[0].length - 1;
  let depth=0, i=start;
  for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
  return (new Function("return " + html.slice(start, i+1)))();
}
["DALLAS_DATA","NYC_DATA","LA_DATA"].forEach(n => {
  const hits = arrOf(n).filter(r => /avra/i.test(r.name||""));
  hits.forEach(h => console.log(n, "#" + h.id, h.name, "@", h.address));
});
