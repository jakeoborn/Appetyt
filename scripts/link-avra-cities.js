#!/usr/bin/env node
// Link Avra Dallas ↔ Avra Beverly Hills with cityLinks
const fs = require("fs");
const path = require("path");
const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function updateCityLinks(id, newLinks) {
  const re = new RegExp(`("id":${id}\\b[^}]*?"cityLinks":)\\[[^\\]]*\\]`);
  if (re.test(html)) {
    html = html.replace(re, `$1${JSON.stringify(newLinks)}`);
    console.log(`  updated cityLinks on #${id} -> ${JSON.stringify(newLinks)}`);
    return true;
  }
  const re2 = new RegExp(`(\\{[^{}]*"id":${id}\\b[^{}]*?)\\}`);
  if (re2.test(html)) {
    html = html.replace(re2, `$1,"cityLinks":${JSON.stringify(newLinks)}}`);
    console.log(`  added cityLinks to #${id} -> ${JSON.stringify(newLinks)}`);
    return true;
  }
  return false;
}

// Avra Dallas #156 → link to Los Angeles
updateCityLinks(156, ["Los Angeles"]);
// Avra Beverly Hills #2235 → link to Dallas
updateCityLinks(2235, ["Dallas"]);

fs.writeFileSync(HTML_PATH, html, "utf8");
console.log("✅ Avra Dallas ↔ LA cityLinks set");
