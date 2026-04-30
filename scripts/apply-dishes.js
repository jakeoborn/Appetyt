// apply-dishes.js — reads dishes-results-staging.json and patches index.html dishes fields
const fs = require('fs');
const path = require('path');

const stagingPath = path.join(__dirname, 'data', 'dishes-results-staging.json');
const htmlPath = path.join(__dirname, '..', 'index.html');

const staging = JSON.parse(fs.readFileSync(stagingPath, 'utf8'));

// Merge all batch results into a single id->dishes map, skipping failed batches
const allDishes = {};
for (const [batch, data] of Object.entries(staging)) {
  if (typeof data === 'string') {
    console.log(`Skipping ${batch}: ${data}`);
    continue;
  }
  for (const [id, dishes] of Object.entries(data)) {
    if (dishes.length > 0) {
      allDishes[id] = dishes;
    }
  }
}

console.log(`Loaded ${Object.keys(allDishes).length} IDs with non-empty dishes`);

let html = fs.readFileSync(htmlPath, 'utf8');
let updated = 0;
let notFound = 0;
let alreadyFilled = 0;

for (const [id, dishes] of Object.entries(allDishes)) {
  // Find "id":NNNN in the html (JSON format with quoted keys)
  const idMarker = `"id":${id},`;
  const idPos = html.indexOf(idMarker);
  if (idPos === -1) {
    console.log(`✗ ${id}: id marker not found`);
    notFound++;
    continue;
  }

  // Find "dishes":[ starting from the id position (within ~2000 chars)
  const searchFrom = idPos;
  const searchTo = Math.min(idPos + 2000, html.length);
  const slice = html.slice(searchFrom, searchTo);

  const dishesMarker = '"dishes":[';
  const relPos = slice.indexOf(dishesMarker);
  if (relPos === -1) {
    console.log(`✗ ${id}: dishes field not found near entry`);
    notFound++;
    continue;
  }

  const dishesStart = searchFrom + relPos; // position of "dishes":[
  const arrayStart = dishesStart + dishesMarker.length - 1; // position of [

  // Find the closing ] — dishes arrays have no nested arrays in this data
  const arrayEnd = html.indexOf(']', arrayStart);
  if (arrayEnd === -1) {
    console.log(`✗ ${id}: closing ] not found`);
    notFound++;
    continue;
  }

  const currentContent = html.slice(arrayStart + 1, arrayEnd).trim();
  if (currentContent.length > 0) {
    console.log(`~ ${id}: already has dishes (${currentContent.slice(0, 50)}...), skipping`);
    alreadyFilled++;
    continue;
  }

  const dishesJson = JSON.stringify(dishes);
  html = html.slice(0, arrayStart) + dishesJson + html.slice(arrayEnd + 1);
  updated++;
  console.log(`✓ ${id}: ${dishes.slice(0, 3).join(', ')}${dishes.length > 3 ? '...' : ''}`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`\nDone: ${updated} updated, ${alreadyFilled} already filled, ${notFound} not found`);
