#!/usr/bin/env node
// Add Trattoria La Strada with manual Gaslamp coords (Nominatim geocodes 702 5th Ave to Chula Vista)
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
function maxId(a) { return a.reduce((m, r) => Math.max(m, r.id||0), 0); }

const s = getArrSlice("SD_DATA");
const arr = parseArr(s.slice);
if (arr.some(r => r.name === "Trattoria La Strada")) { console.log("Already present"); process.exit(0); }
const nextId = arr.reduce((m, r) => Math.max(m, r.id||0), 0) + 1;

const entry = {
  id: nextId,
  name: "Trattoria La Strada",
  cuisine: "Italian",
  neighborhood: "Gaslamp",
  score: 85, price: 3,
  tags: ["Italian","Date Night","Patio","Iconic","Local Favorites"],
  indicators: [],
  group: "", hh: "", reservation: "OpenTable",
  awards: "",
  description: "Gaslamp's Tuscan-style trattoria since 1993 — a 5th Ave corner patio, osso buco, and a Gaslamp regular's dinner default when the 5th Ave crowd gets too loud. The Gaslamp Italian old-guard.",
  dishes: ["Osso Buco","House-Made Pasta","Gaslamp Patio Corner","Tuscan Program"],
  address: "702 Fifth Ave, San Diego, CA 92101",
  phone: "", hours: "",
  lat: 32.7126, lng: -117.1596,
  bestOf: [], res_tier: 3,
  busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
  trending: false,
  instagram: "@trattorialastradasd",
  suburb: false, website: "https://trattorialastrada.com", verified: "2026-04-19"
};

arr.push(entry);
html = html.slice(0, s.start) + JSON.stringify(arr) + html.slice(s.end + 1);
fs.writeFileSync(HTML_PATH, html, "utf8");
console.log(`✅ Added Trattoria La Strada (SD: ${arr.length})`);
