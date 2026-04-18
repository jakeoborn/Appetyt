#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 12.
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

function entry(o) {
  return {
    id: o.id, name: o.name, phone: '', cuisine: o.cuisine,
    neighborhood: o.neighborhood, score: o.score, price: 1,
    tags: o.tags, indicators: [], hh: '', reservation: 'walk-in',
    awards: '', description: o.description, dishes: [],
    address: o.address, hours: '', lat: o.lat, lng: o.lng,
    bestOf: [], group: '', instagram: '', website: '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 0,
    verified: true, photoUrl: '',
  };
}

function addTo(constName, adds) {
  const { a, e: end, arr } = readBlock(html, constName);
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  arr.push(...adds.map((o, i) => entry(Object.assign({}, o, { id: maxId + i + 1 }))));
  console.log(constName + ': +' + adds.length + ' (' + before + ' -> ' + arr.length + ')');
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(end);
}

// Vegas Chinatown + Fremont East
addTo('LV_DATA', [
  { name: 'Chinatown Plaza', cuisine: 'Landmark / Shopping District', neighborhood: 'Chinatown', score: 84, tags: ['Landmark','Tourist Attraction','Shopping','Market'], description: 'The first commercial development on Spring Mountain Road (1995), anchored by a 24-foot Xi\u2019an terracotta warrior replica and a Monkey King statue. The symbolic heart of Vegas Chinatown.', address: '4255 Spring Mountain Rd, Las Vegas, NV 89102', lat: 36.1253, lng: -115.1987 },
  { name: 'Downtown Container Park', cuisine: 'Landmark / Tourist Attraction', neighborhood: 'Downtown (Fremont East)', score: 86, tags: ['Landmark','Tourist Attraction','Shopping','Entertainment','Family Friendly'], description: 'Open-air retail park built from repurposed shipping containers on Fremont East, fronted by a 40-foot fire-breathing praying mantis sculpture. Small-business boutiques and live-music stage.', address: '707 Fremont St, Las Vegas, NV 89101', lat: 36.1698, lng: -115.1380 },
  { name: 'Atomic Liquors', cuisine: 'Landmark / Historic Site', neighborhood: 'Downtown (Fremont East)', score: 85, tags: ['Landmark','Tourist Attraction','Historic','Iconic'], description: 'Las Vegas\u2019 oldest freestanding bar (1952), where locals watched atomic test blasts from the roof. Sinatra and the Rat Pack drank here; the neighborhood\u2019s living-memory landmark.', address: '917 Fremont St, Las Vegas, NV 89101', lat: 36.1698, lng: -115.1367 },
]);

// Seattle Central District + Beacon Hill
addTo('SEATTLE_DATA', [
  { name: 'Northwest African American Museum', cuisine: 'Museum', neighborhood: 'Central District', score: 86, tags: ['Museum','Landmark','Historic','Tourist Attraction'], description: 'Museum of Black history and culture in the Pacific Northwest, in the former Colman School. Rotating exhibitions on Seattle\u2019s jazz legacy, Central District civil-rights history, and African-diaspora art.', address: '2300 S Massachusetts St, Seattle, WA 98144', lat: 47.5906, lng: -122.3036 },
  { name: 'Jimi Hendrix Park', cuisine: 'Park', neighborhood: 'Central District', score: 84, tags: ['Park','Landmark','Tourist Attraction','Outdoor','Iconic'], description: '2.5-acre park dedicated to the Seattle-born guitarist, with a purple audio-wave public-art installation and the Hendrix timeline walkway. Adjacent to the NAAM.', address: '2400 S Massachusetts St, Seattle, WA 98144', lat: 47.5900, lng: -122.3023 },
  { name: 'Kubota Garden', cuisine: 'Botanical Garden / Park', neighborhood: 'Beacon Hill', score: 89, tags: ['Park','Landmark','Tourist Attraction','Outdoor','Free'], description: '20-acre historic Japanese garden designed by Fujitaro Kubota beginning in 1927. Free admission, a stone landscape, a restored necklace of ponds, and mature maples that blaze in October.', address: '9817 55th Ave S, Seattle, WA 98118', lat: 47.5197, lng: -122.2653 },
]);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
