const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const cities = [
  ["DALLAS_DATA","Dallas"], ["HOUSTON_DATA","Houston"], ["AUSTIN_DATA","Austin"],
  ["SLC_DATA","SLC"], ["LV_DATA","Las Vegas"], ["SEATTLE_DATA","Seattle"],
  ["CHICAGO_DATA","Chicago"], ["NYC_DATA","NYC"], ["LA_DATA","LA"], ["PHX_DATA","Phoenix"]
];
const brands = ["Shake Shack", "Sweetgreen", "CAVA", "Amalfi"];

function getArr(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const m = html.match(re);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) {
    const c = html[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) break; }
  }
  const slice = html.slice(start, i + 1);
  try { return (new Function("return " + slice))(); }
  catch (e) { return null; }
}

const norm = s => s.toLowerCase().replace(/['']/g, "'").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

for (const brand of brands) {
  console.log("\n=== " + brand + " ===");
  const bnorm = norm(brand);
  for (const [key, label] of cities) {
    const arr = getArr(key);
    if (!arr) { console.log(label.padEnd(12), "NO-DATA"); continue; }
    const matches = arr.filter(r => {
      const nm = norm(r.name);
      return nm === bnorm || nm.startsWith(bnorm + " ") || nm.includes(" " + bnorm) || nm.startsWith(bnorm);
    });
    const flag = matches.length ? "HAS (" + matches.length + ")" : "MISSING";
    console.log(label.padEnd(12), flag);
    matches.forEach(m => console.log("  - #" + m.id, m.name, "—", m.neighborhood, "—", (m.cityLinks||[]).length, "cityLinks"));
  }
}
