const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html","utf8");
function extract(name) {
  const m = html.match(new RegExp("const\\s+"+name+"\\s*=\\s*\\["));
  if (!m) return [];
  const start = m.index + m[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
  return (new Function("return " + html.slice(start, i+1)))();
}
const phx = extract("PHX_DATA");
const la = extract("LA_DATA");
const nPhx = {}, nLa = {};
phx.forEach(r => { if(r.neighborhood) nPhx[r.neighborhood] = (nPhx[r.neighborhood]||0)+1; });
la.forEach(r => { if(r.neighborhood) nLa[r.neighborhood] = (nLa[r.neighborhood]||0)+1; });
console.log("Phoenix neighborhoods (" + phx.length + " total):");
Object.keys(nPhx).sort().forEach(k => console.log("  " + k + " (" + nPhx[k] + ")"));
console.log("\nLA neighborhoods (" + la.length + " total):");
Object.keys(nLa).sort().forEach(k => console.log("  " + k + " (" + nLa[k] + ")"));
