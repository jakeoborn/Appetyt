// Fix verified issues from NYC + Chicago audit
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

function fixCity(varName, fixes) {
  const re = new RegExp("const " + varName + "\\s*=\\s*(\\[[\\s\\S]*?\\]);");
  const match = html.match(re);
  if (!match) { console.log(varName + " NOT FOUND"); return; }
  const data = eval(match[1]);
  let changed = 0;
  for (const fix of fixes) {
    const r = data.find(r => r.name === fix.name);
    if (!r) { console.log("  NOT FOUND: " + fix.name); continue; }
    for (const [k, v] of Object.entries(fix.set)) {
      if (r[k] !== v) { r[k] = v; changed++; }
    }
    console.log("  Fixed: " + fix.name);
  }
  const newData = JSON.stringify(data);
  html = html.replace(match[0], "const " + varName + "=" + newData + ";");
  console.log(varName + ": " + changed + " fields fixed\n");
}

// NYC fixes
fixCity("NYC_DATA", [
  // Wrong Instagram handles (fake placeholders)
  {name:"Peter Luger Steak House", set:{instagram:"@peterlugersteakhouse"}},
  {name:"Dante", set:{instagram:"@dantenewyorkcity"}},
  {name:"Gabriel Kreuther", set:{instagram:"@gabrielkreuther"}},
  {name:"4 Charles Prime Rib", set:{instagram:"@nycprimerib"}},
  {name:"Lilia", set:{instagram:"@lilianewyork"}},
  // Broken websites - clear them so we don't link to 403s
  {name:"Di An Di", set:{website:""}},
  {name:"Sushi Sho", set:{website:""}},
  {name:"Nan Xiang Xiao Long Bao", set:{website:""}},
]);

// Chicago fixes
fixCity("CHICAGO_DATA", [
  // Wrong Instagram handle
  {name:"Alinea", set:{instagram:"@thealineagroup"}},
  // Outdated URLs - update to current domains
  {name:"Topolobampo", set:{website:"https://topolochicago.com"}},
  {name:"Frontera Grill", set:{website:"https://www.fronteragrill.com"}},
  // Fix RPM Italian broken URL
  {name:"RPM Italian", set:{website:"https://www.rpmrestaurants.com"}},
]);

fs.writeFileSync("index.html", html);
console.log("All fixes applied!");
