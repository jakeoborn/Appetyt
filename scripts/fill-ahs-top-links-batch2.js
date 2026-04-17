#!/usr/bin/env node
// Top-score link backfill — batch 2 for Austin + Houston + SLC.
// All fills verified via firecrawl_search 2026-04-17.
// Per-city IG convention: Austin/Houston/SLC use @-prefixed handles.
// Also removes One Fifth (Houston id ~unknown) — concept ended 2020 and
// morphed into Pastore; its rotating iteration is no longer operating.
const fs = require('fs');
const path = require('path');

function readBlock(html, constName) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  return { a, e, arr: JSON.parse(html.slice(a, e)) };
}

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// ---------- AUSTIN ----------
const aUSTIN = {
  // key = name match (first entry with matching name that's missing the field gets filled)
  'Uchi ko North': { website: 'https://uchiko.uchirestaurants.com' },
  'Uchiko Domain North': { website: 'https://uchiko.uchirestaurants.com' },
  'Fonda San Miguel Brunch': { website: 'https://www.fondasanmiguel.com' },
  'Nixta East Side': { website: 'https://www.nixtataqueria.com' },
  'Nixta South': { website: 'https://www.nixtataqueria.com', instagram: '@nixtataqueria' },
  'Barley Swine North': { website: 'https://www.barleyswine.com', instagram: '@barleyswine' },
  'Paprika ATX': { instagram: '@paprikaatx' },
  'Konbini': { website: 'https://www.papercut.bar/konbini' },
  'Loro South Lamar': { website: 'https://www.loroeats.com/locations/austin/south-lamar' },
  'Loro North Lamar': { website: 'https://www.loroeats.com' },
  'Loro Bee Caves': { website: 'https://www.loroeats.com' },
  'Loro Mueller': { website: 'https://www.loroeats.com' },
  'Loro Burnet': { website: 'https://www.loroeats.com' },
  'Aba South Congress': { website: 'https://www.abarestaurants.com/austin' },
  'Oseyo North': { website: 'https://www.oseyoaustin.com' },
  'June\u2019s All Day': { website: 'https://junesallday.com' },
  "June's All Day": { website: 'https://junesallday.com' },
  'June\u2019s SoCo': { website: 'https://junesallday.com', instagram: '@junesallday' },
  "June's SoCo": { website: 'https://junesallday.com', instagram: '@junesallday' },
};

// ---------- HOUSTON ----------
const hOUSTON = {
  'Oheya by Uchi': { website: 'https://uchi.uchirestaurants.com/location/omakase-houston/oheya/' },
  'Di An Pho': { instagram: '@dianphorestaurant' },
  'Eddie V\u2019s Prime Seafood': { instagram: '@eddievs_' },
  "Eddie V's Prime Seafood": { instagram: '@eddievs_' },
  'Cafe Rabelais': { instagram: '@caferabelais' },
  'Café Rabelais': { instagram: '@caferabelais' },
  'Tiger Den': { instagram: '@tigerdentx' },
  '5Kinokawa': { website: 'https://www.5kinokawa.com' },
};

// Closure removals for Houston (One Fifth rotating concept closed 2020).
const HOUSTON_REMOVE_NAMES = ['One Fifth'];

// ---------- SLC ----------
const sLC = {
  'Crown Burgers': { instagram: '@crownburgersut', website: 'https://www.crown-burgers.com' },
  'Lone Star Taqueria': { website: 'https://www.lstaq.com' },
  'Boba World': { website: 'https://bobaworldut.com' },
  'Nohm': { website: 'https://www.barnohm.com' },
  'Pago Downtown': { website: 'https://pagoslc.com' },
  'Copper Onion Broadway': { website: 'https://www.thecopperonion.com', instagram: '@thecopperonion' },
};

// Apply a fills map against an array. Returns counts.
function applyFills(arr, map) {
  let filled = 0, skipped = 0;
  const unmatched = new Set(Object.keys(map));
  arr.forEach(r => {
    const patch = map[r.name];
    if (!patch) return;
    unmatched.delete(r.name);
    if (patch.website !== undefined) {
      if (!r.website || !String(r.website).trim()) { r.website = patch.website; filled++; }
      else skipped++;
    }
    if (patch.instagram !== undefined) {
      if (!r.instagram || !String(r.instagram).trim()) { r.instagram = patch.instagram; filled++; }
      else skipped++;
    }
  });
  return { filled, skipped, unmatched: Array.from(unmatched) };
}

// ---------- AUSTIN ----------
{
  const { a, e, arr } = readBlock(html, 'AUSTIN_DATA');
  const { filled, skipped, unmatched } = applyFills(arr, aUSTIN);
  console.log('AUSTIN filled=' + filled + ' skipped=' + skipped + ' unmatched=' + unmatched.join('|'));
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// ---------- HOUSTON ----------
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const startLen = arr.length;
  const removed = [];
  const filtered = arr.filter(r => {
    if (HOUSTON_REMOVE_NAMES.includes(r.name)) { removed.push({ id: r.id, name: r.name, score: r.score }); return false; }
    return true;
  });
  const { filled, skipped, unmatched } = applyFills(filtered, hOUSTON);
  console.log('HOUSTON removed=' + removed.length + ' filled=' + filled + ' skipped=' + skipped + ' unmatched=' + unmatched.join('|') + ' count ' + startLen + ' -> ' + filtered.length);
  removed.forEach(r => console.log('  REMOVED id=' + r.id + ' [' + r.score + '] ' + r.name));
  html = html.slice(0, a) + JSON.stringify(filtered) + html.slice(e);
}

// ---------- SLC ----------
{
  const { a, e, arr } = readBlock(html, 'SLC_DATA');
  const { filled, skipped, unmatched } = applyFills(arr, sLC);
  console.log('SLC filled=' + filled + ' skipped=' + skipped + ' unmatched=' + unmatched.join('|'));
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
