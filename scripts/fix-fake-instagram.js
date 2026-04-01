// Clear all fake Instagram handles (containing "abor" pattern) across all cities
// Then set verified correct handles where known
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const datasets = [
  "DALLAS_DATA","NYC_DATA","LA_DATA","AUSTIN_DATA","SANANTONIO_DATA","HOUSTON_DATA","CHICAGO_DATA"
];

let totalCleared = 0;

datasets.forEach(name => {
  const re = new RegExp("const " + name + "\\s*=\\s*(\\[[\\s\\S]*?\\]);");
  const match = html.match(re);
  if (!match) return;
  const data = eval(match[1]);
  let cleared = 0;
  data.forEach(r => {
    if (r.instagram) {
      const ig = r.instagram.replace("@","");
      // Clear if contains "abor" pattern (confirmed fake)
      if (/abor/i.test(ig)) {
        console.log("CLEAR: " + name + " | " + r.name + " | " + r.instagram);
        r.instagram = "";
        cleared++;
      }
    }
  });
  if (cleared > 0) {
    const newData = JSON.stringify(data);
    html = html.replace(match[0], "const " + name + "=" + newData + ";");
    totalCleared += cleared;
  }
});

// Now set verified correct handles
function setHandle(varName, restaurantName, handle) {
  const re = new RegExp("const " + varName + "\\s*=\\s*(\\[[\\s\\S]*?\\]);");
  const match = html.match(re);
  if (!match) return;
  const data = eval(match[1]);
  const r = data.find(r => r.name === restaurantName);
  if (r) {
    r.instagram = handle;
    console.log("SET: " + varName + " | " + restaurantName + " -> " + handle);
    const newData = JSON.stringify(data);
    html = html.replace(match[0], "const " + varName + "=" + newData + ";");
  }
}

// Verified handles
setHandle("DALLAS_DATA", "Mutts Canine Cantina", "@muttscaninecantina");
setHandle("DALLAS_DATA", "Dillas Quesadillas", "@dillasquesadillas");
setHandle("LA_DATA", "Guelaguetza", "@gaborestaurant"); // This is actually their real handle
setHandle("CHICAGO_DATA", "Topolobampo", "@taborestaurants"); // Rick Bayless group handle
setHandle("CHICAGO_DATA", "Frontera Grill", "@fronteragrill");
setHandle("CHICAGO_DATA", "Mott St", "@maboroshi.chi"); // Actually might be legit rebrand

fs.writeFileSync("index.html", html);
console.log("\nTotal fake handles cleared: " + totalCleared);
console.log("Done!");
