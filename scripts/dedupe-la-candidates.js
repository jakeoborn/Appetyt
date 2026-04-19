const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html","utf8");
const m = html.match(/const\s+LA_DATA\s*=\s*\[/);
const start = m.index + m[0].length - 1;
let depth = 0, i = start;
for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
const arr = (new Function("return " + html.slice(start, i+1)))();
const norm = s => (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
const cands = process.argv.slice(2);
cands.forEach(c => {
  const k = norm(c);
  const hit = arr.find(r => {
    const rk = norm(r.name);
    if (k.length < 5) return rk === k;
    return rk === k || (rk.length >= 5 && (rk.startsWith(k.slice(0,7)) || k.startsWith(rk.slice(0,7))));
  });
  console.log((hit?"DUP ":"NEW ") + c + (hit ? "  -> "+hit.name:""));
});
