// Fix all verified issues from Austin, SA, Houston, LA audit
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

// AUSTIN fixes - corrupted Instagram handles
fixCity("AUSTIN_DATA", [
  {name:"Suerte", set:{instagram:"@suerte_atx"}},
  {name:"Ramen Tatsu-ya", set:{instagram:"@ramen_tatsuya"}},
]);

// SAN ANTONIO fixes - wrong redirects, clear broken URLs
fixCity("SANANTONIO_DATA", [
  // WRONG: redirects to unrelated sites - clear the URL
  {name:"2M Smokehouse", set:{website:""}}, // redirects to thepenthouseny.com
  {name:"Sangria on the Burg", set:{website:""}}, // redirects to saucy-birds.com
  {name:"Shuck Shack", set:{website:""}}, // points to Florida chain
  // 404: site doesn't exist
  {name:"Tenko Ramen", set:{website:""}},
  // Broken redirect chain
  {name:"Ocho at Hotel Havana", set:{website:"https://www.bunkhousehotels.com/hotel-havana"}},
]);

// HOUSTON fixes
fixCity("HOUSTON_DATA", [
  {name:"Street to Kitchen", set:{website:""}}, // "coming soon" placeholder
]);

// LA fixes - corrupted Instagram handles + broken URLs
fixCity("LA_DATA", [
  {name:"Spago", set:{instagram:"@spagobeverlyhills"}},
  {name:"Musso & Frank Grill", set:{instagram:"@mussoandfrank"}},
  {name:"Gjelina", set:{instagram:"@gjelina"}},
  // 404 pages - clear broken URLs
  {name:"Catch LA", set:{website:""}},
  {name:"Sushi Ginza Onodera", set:{website:""}},
]);

fs.writeFileSync("index.html", html);
console.log("All fixes applied!");
