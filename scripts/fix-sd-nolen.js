#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

// The Nolen Rooftop Bar is at 453 Sixth Ave, Gaslamp (Courtyard by Marriott)
// Nominatim resolved to Escondido; real coords: 32.7134, -117.1599
html = html.replace(
  /"name":"The Nolen Rooftop Bar"[^}]*?"lat":33\.1148047,"lng":-117\.0827592/,
  (m) => m.replace(`"lat":33.1148047,"lng":-117.0827592`, `"lat":32.7134,"lng":-117.1599`)
);

fs.writeFileSync(HTML_PATH, html, "utf8");
const ok = fs.readFileSync(HTML_PATH, "utf8").includes(`"name":"The Nolen Rooftop Bar"`) &&
           fs.readFileSync(HTML_PATH, "utf8").includes(`"lat":32.7134,"lng":-117.1599`);
console.log(`Nolen fixed: ${ok}`);
