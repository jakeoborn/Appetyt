const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../index.html","utf8");
const m = html.match(/const\s+PHX_DATA\s*=\s*\[/);
const start = m.index + m[0].length - 1;
let depth = 0, i = start;
for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
const arr = (new Function("return " + html.slice(start, i+1)))();
const norm = s => (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
const cands = [
  // coffee
  "Webe Coffee Roasters","Driftwood Coffee Co","Satellite Coffee Bar","Esso Coffeehouse","Lux Central",
  "Berdena's","Fourtillfour Cafe","Strip Mall","PIP Coffee + Clay","Harlem","dialog","Futuro","aftermarket.","Regroup Coffee","Wonderift",
  // iconic
  "Las 15 Salsas","Los Reyes De La Torta","Otro Cafe","Valentine","Glai Baan","Kabob Grill N Go","Sphinx Date Co","El Caprichoso",
  "Casa Corazon","Hai Noon","Pizzeria Bianco","El Horseshoe","Carolinas Mexican Food","Comedor Guadalajara","Little Miss BBQ","Hopes Fry Bread",
  // hot dogs
  "Lupitas Hot Dogs","La Pasadita Hot Dogs","El Sabroso","Nogales Hot Dogs","Fruitlandia","Condesa","Hot Dogs La Yaquesita","Mickys Hot Dogs","Don Nico"
];
cands.forEach(c => {
  const k = norm(c);
  const hit = arr.find(r => {
    const rk = norm(r.name);
    if (k.length < 5) return rk === k;
    return rk === k || (rk.length >= 5 && (rk.includes(k.slice(0,5)) || k.includes(rk.slice(0,5))));
  });
  console.log((hit ? "DUP " : "NEW ") + c + (hit ? "  ->  " + hit.name : ""));
});
