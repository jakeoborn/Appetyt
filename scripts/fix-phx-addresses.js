#!/usr/bin/env node
// Fix 2 Phoenix address errors caught in Apify audit:
//   UnderTow: 3620 → 3626 E Indian School Rd
//   Century Grand: 3139 → 3626 E Indian School Rd
// Both venues are part of the Barter & Shake complex at 3626 E Indian School Rd, Phoenix, AZ 85018.
const fs = require("fs");
const path = require("path");
const https = require("https");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function nominatim(a) {
  return new Promise((res, rej) => {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
    https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (r) => {
      let d = ""; r.on("data", c => d += c);
      r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({lat:parseFloat(j[0].lat),lng:parseFloat(j[0].lon)}); } catch(e) { rej(e); } });
    }).on("error", rej);
  });
}

(async () => {
  const newAddr = "3626 E Indian School Rd, Phoenix, AZ 85018";
  const coords = await nominatim(newAddr);
  console.log(`Correct coords for ${newAddr}: ${coords.lat}, ${coords.lng}`);

  // Fix UnderTow — was 3620, now 3626
  html = html.replace(
    /"address":"3620 E Indian School Rd, Phoenix, AZ 85018"/g,
    `"address":"${newAddr}"`
  );

  // Fix Century Grand — was 3139 E Indian School Rd, Phoenix, AZ 85016
  html = html.replace(
    /"address":"3139 E Indian School Rd, Phoenix, AZ 85016"/g,
    `"address":"${newAddr}"`
  );

  // Also fix coords for both entries (they share the same new address)
  // UnderTow's old coords need updating, Century Grand's too
  // Use regex to find entries by name and update lat/lng
  const namesToFix = ["Undertow", "Century Grand"];
  namesToFix.forEach(name => {
    const re = new RegExp(`("name":"${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"[^{]*?)"lat":-?\\d+\\.\\d+,"lng":-?\\d+\\.\\d+`, 'g');
    html = html.replace(re, `$1"lat":${coords.lat},"lng":${coords.lng}`);
  });

  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log("✅ UnderTow + Century Grand addresses corrected to 3626 E Indian School Rd");
})();
