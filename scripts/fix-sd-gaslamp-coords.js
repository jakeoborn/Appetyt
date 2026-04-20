#!/usr/bin/env node
// Fix Nobu and Searsucker — Nominatim resolved to Escondido's Fifth Ave (far north) instead of Gaslamp
const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

// Nobu San Diego — 207 Fifth Ave, Gaslamp (Hard Rock Hotel)
// Real coords: ~32.7107, -117.1578
html = html.replace(
  /"name":"Nobu San Diego","cuisine":"Japanese \/ Peruvian-Japanese","neighborhood":"Gaslamp","score":88,"price":4,"tags":\[[^\]]*\],"indicators":\[\],"group":"Nobu \/ Nobu Matsuhisa","hh":"","reservation":"OpenTable","awards":"","description":"[^"]*","dishes":\[[^\]]*\],"address":"207 Fifth Ave, San Diego, CA 92101","phone":"","hours":"","lat":33\.1171924,"lng":-117\.0804328/,
  (m) => m.replace(`"lat":33.1171924,"lng":-117.0804328`, `"lat":32.7107,"lng":-117.1578`)
);

// Searsucker — 611 Fifth Ave, Gaslamp
// Real coords: ~32.7121, -117.1588
html = html.replace(
  /"name":"Searsucker","cuisine":"Modern American","neighborhood":"Gaslamp","score":83,"price":3,"tags":\[[^\]]*\],"indicators":\[\],"group":"","hh":"","reservation":"OpenTable","awards":"","description":"[^"]*","dishes":\[[^\]]*\],"address":"611 Fifth Ave, San Diego, CA 92101","phone":"","hours":"","lat":33\.1144854,"lng":-117\.0858847/,
  (m) => m.replace(`"lat":33.1144854,"lng":-117.0858847`, `"lat":32.7121,"lng":-117.1588`)
);

fs.writeFileSync(HTML_PATH, html, "utf8");

// Verify
const after = fs.readFileSync(HTML_PATH, "utf8");
const nobuOk = after.includes(`"address":"207 Fifth Ave, San Diego, CA 92101","phone":"","hours":"","lat":32.7107`);
const searsuckerOk = after.includes(`"address":"611 Fifth Ave, San Diego, CA 92101","phone":"","hours":"","lat":32.7121`);
console.log(`Nobu fixed: ${nobuOk}`);
console.log(`Searsucker fixed: ${searsuckerOk}`);
