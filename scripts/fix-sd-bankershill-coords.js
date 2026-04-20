#!/usr/bin/env node
// Fix Bankers Hill/Hillcrest coords — Nominatim hit Escondido or Gaslamp instead of real Bankers Hill 5th Ave
const fs = require("fs");
const path = require("path");
const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

// Martinis Above Fourth — 3940 Fourth Ave, Hillcrest. Real: ~32.7492, -117.1624
html = html.replace(
  /"name":"Martinis Above Fourth"[^}]*?"lat":33\.1128396,"lng":-117\.091204/,
  (m) => m.replace(`"lat":33.1128396,"lng":-117.091204`, `"lat":32.7492,"lng":-117.1624`)
);

// Extraordinary Desserts — 2929 Fifth Ave, Bankers Hill. Real: ~32.7433, -117.1615
html = html.replace(
  /"name":"Extraordinary Desserts"[^}]*?"lat":32\.7047632,"lng":-117\.1638766/,
  (m) => m.replace(`"lat":32.7047632,"lng":-117.1638766`, `"lat":32.7433,"lng":-117.1615`)
);

// Parc Bistro-Brasserie — 2760 Fifth Ave, Bankers Hill. Real: ~32.7399, -117.1615
html = html.replace(
  /"name":"Parc Bistro-Brasserie"[^}]*?"lat":32\.7047632,"lng":-117\.1638766/,
  (m) => m.replace(`"lat":32.7047632,"lng":-117.1638766`, `"lat":32.7399,"lng":-117.1615`)
);

fs.writeFileSync(HTML_PATH, html, "utf8");
const after = fs.readFileSync(HTML_PATH, "utf8");
console.log("Martinis fixed:", after.includes(`"name":"Martinis Above Fourth"`) && after.includes(`"lat":32.7492,"lng":-117.1624`));
console.log("Extraordinary fixed:", after.includes(`"name":"Extraordinary Desserts"`) && after.includes(`"lat":32.7433,"lng":-117.1615`));
console.log("Parc fixed:", after.includes(`"name":"Parc Bistro-Brasserie"`) && after.includes(`"lat":32.7399,"lng":-117.1615`));
