#!/usr/bin/env node
// Austin replacements batch 1 — removes 3 confirmed-closed entries and
// adds 2 verified 2026 openings from the Eater Austin Spring 2026 list.
//
// Removals:
//  - Thai Kun (id 5101, 1600 S Congress) — closed Feb-Apr 2025 per
//    Austin Statesman; Eater Austin also reports both Thai Kun locations
//    closed.
//  - Counter 3.Five.VII (id 5202, 315 Congress Ave) — Yelp status
//    "CLOSED"; Sushi Junai took over the Congress Ave omakase space.
//  - Qui (id 5347, 1600 E 6th St) — closed Sept 2016 per Eater Austin;
//    space became Kuneho, then Kemuri Tatsu-ya (already in data id 5013).
//
// Adds (both on Eater Austin's Spring 2026 "Best New Restaurants" list):
//  - Kappo Kappo — French-Japanese omakase at Austin Proper Hotel by
//    twin chefs Gohei & Haru Kishi. 600 W 2nd St. kappokappo.com.
//  - Roya — upscale Persian by chef Amir Hajimaleki, opened Feb 2026.
//    7858 Shoal Creek Blvd Ste C. royaaustin.com.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const AUSTIN_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));

const start = arr.length;
const removeIds = new Set([5101, 5202, 5347]);
const removed = arr.filter(r => removeIds.has(r.id)).map(r => r.name);
const filtered = arr.filter(r => !removeIds.has(r.id));

const existingMax = Math.max(...filtered.map(r => r.id));
let nextId = existingMax + 1;

const adds = [
  {
    id: nextId++,
    name: 'Kappo Kappo',
    cuisine: 'French-Japanese Omakase',
    neighborhood: 'Downtown',
    score: 94,
    price: 4,
    tags: ['Fine Dining', 'Omakase', 'Date Night', 'Critics Pick', 'Hotel Restaurant', 'Chef Driven'],
    indicators: [],
    hh: '',
    reservation: 'OpenTable',
    awards: '',
    description: "French-Japanese omakase from twin chefs Gohei and Haru Kishi at the Austin Proper Hotel, with 25 seats built around a chef's counter. An 11-course tasting spotlights A5 wagyu and the day's market fish, plated with French technique and classical kappo sensibility. One of the most talked-about Austin openings of 2026.",
    dishes: ['Chef\u2019s Counter Tasting', 'A5 Wagyu Course', 'Seasonal Sashimi', 'Seasonal Handroll'],
    address: '600 W 2nd St, Austin, TX 78701',
    lat: 30.2638, lng: -97.7493,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true, group: 'Austin Proper Hotel',
    instagram: '@kappokappo_atx',
    website: 'https://www.kappokappo.com',
    reserveUrl: '', menuUrl: '',
    res_tier: 4, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Roya',
    cuisine: 'Persian',
    neighborhood: 'North Austin',
    score: 89,
    price: 3,
    tags: ['Date Night', 'Middle Eastern', 'Chef Driven', 'Critics Pick'],
    indicators: [],
    hh: '',
    reservation: 'OpenTable',
    awards: '',
    description: 'Upscale Persian concept from chef Amir Hajimaleki that opened in February 2026. The menu layers classical Persian rice work, kebabs, and stews with modern plating, tucked into a strip-center suite along Shoal Creek. Named for the Persian word for "dream."',
    dishes: ['Chelow Kebab', 'Fesenjan', 'Tahdig', 'Seasonal Saffron Rice'],
    address: '7858 Shoal Creek Blvd Ste C, Austin, TX 78757',
    lat: 30.3539, lng: -97.7374,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true, group: '',
    instagram: '@royaaustin',
    website: 'https://royaaustin.com',
    reserveUrl: '', menuUrl: '',
    res_tier: 3, suburb: false,
    verified: '2026-04-17',
  },
];

const final = [...filtered, ...adds];

console.log(`Removed (${removed.length}):`, removed);
console.log(`Added (${adds.length}):`, adds.map(a => `${a.id} ${a.name}`));
console.log(`AUSTIN count: ${start} → ${final.length}`);

html = before + JSON.stringify(final) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');
