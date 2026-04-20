#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function getArrSlice(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const mm = html.match(re);
  const start = mm.index + mm[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(s) { return (new Function("return " + s))(); }

const s = getArrSlice("SD_DATA");
const arr = parseArr(s.slice);
if (arr.some(r => r.name === "Peohe's")) { console.log("Already present"); process.exit(0); }
const nextId = arr.reduce((m, r) => Math.max(m, r.id||0), 0) + 1;

arr.push({
  id: nextId, name: "Peohe's", cuisine: "American / Seafood / Pacific Rim", neighborhood: "Coronado",
  score: 83, price: 4,
  tags: ["Fine Dining","American","Seafood","Pacific Rim","Date Night","Scenic Views","Celebrations","Iconic"],
  indicators: [], group: "Specialty Restaurants", hh: "", reservation: "OpenTable", awards: "",
  description: "Coronado Ferry Landing's Pacific Rim-seafood institution — a tropical atrium dining room with koi ponds, a view straight across the bay to downtown SD, and a special-occasion Coronado format that's been running for four decades.",
  dishes: ["Pacific Rim Seafood","Tropical Atrium","Skyline-Across-the-Bay Views","Ferry Landing Setting"],
  address: "1201 First St, Coronado, CA 92118",
  phone: "", hours: "",
  lat: 32.6935, lng: -117.1712,
  bestOf: [], res_tier: 3,
  busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
  trending: false,
  instagram: "@peohessd",
  suburb: false, website: "https://peohes.com", verified: "2026-04-19"
});

html = html.slice(0, s.start) + JSON.stringify(arr) + html.slice(s.end + 1);
fs.writeFileSync(HTML_PATH, html, "utf8");
console.log(`✅ Added Peohe's (SD: ${arr.length})`);
