#!/usr/bin/env node
// Apply checkpointed coord-fixes from fix-low-precision-coords-progress.json to index.html.
// Safe to re-run - idempotent per entry (writes only if old lat/lng pattern still matches).
const fs = require("fs");
const path = require("path");

const HTML = path.join(__dirname, "..", "index.html");
const PROGRESS = path.join(__dirname, "fix-low-precision-coords-progress.json");

const progress = JSON.parse(fs.readFileSync(PROGRESS, "utf8"));
const fixed = progress.fixed;

let html = fs.readFileSync(HTML, "utf8");
let applied = 0, alreadyApplied = 0, notFound = 0, ambiguous = 0;

for (const [key, f] of Object.entries(fixed)) {
  const [fromLat, fromLng] = f.from;
  const [toLat, toLng] = f.to;
  if (fromLat === toLat && fromLng === toLng) { alreadyApplied++; continue; }

  const oldPatternStr = `"lat":${fromLat},"lng":${fromLng}`;
  const newPatternStr = `"lat":${toLat},"lng":${toLng}`;

  // Check current state via exact substring. If new-coord already present, skip.
  const newIdx = html.indexOf(newPatternStr);
  if (newIdx !== -1 && html.indexOf(oldPatternStr) === -1) { alreadyApplied++; continue; }

  // Count occurrences of old pattern - if >1, this is ambiguous without name-anchor.
  const occurrences = html.split(oldPatternStr).length - 1;
  if (occurrences === 0) { notFound++; continue; }
  if (occurrences === 1) {
    html = html.replace(oldPatternStr, newPatternStr);
    applied++;
    continue;
  }
  ambiguous++;
}

fs.writeFileSync(HTML, html, "utf8");
console.log(`Applied: ${applied}`);
console.log(`Already applied (no-op): ${alreadyApplied}`);
console.log(`Not found (coord changed since checkpoint): ${notFound}`);
console.log(`Ambiguous (multi-match, skipped for safety): ${ambiguous}`);
console.log(`Total in progress.json: ${Object.keys(fixed).length}`);
