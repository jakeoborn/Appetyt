#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 14.
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

addTo('DALLAS_DATA', [
  { name: 'Kidd Springs Park', cuisine: 'Park', neighborhood: 'Oak Cliff', score: 80, tags: ['Park','Outdoor','Family Friendly'], description: 'Historic 16-acre Oak Cliff park with a Japanese-style garden, pond, community rec center, and wooded walking trails. A Dallas park-system landmark since 1913.', address: '711 W Canty St, Dallas, TX 75208', lat: 32.7441, lng: -96.8269 },
  { name: 'Dallas Zoo', cuisine: 'Zoo / Tourist Attraction', neighborhood: 'Oak Cliff', score: 88, tags: ['Zoo','Tourist Attraction','Landmark','Family Friendly'], description: 'Oldest and largest zoological park in Texas (1888), on 106 acres just south of downtown. The Giants of the Savanna habitat co-houses elephants, giraffes, and zebras in the same enclosure \u2014 a zoo first.', address: '650 S R L Thornton Fwy, Dallas, TX 75203', lat: 32.7423, lng: -96.8155 },
  { name: 'Margaret Hunt Hill Bridge', cuisine: 'Landmark', neighborhood: 'Trinity Groves', score: 90, tags: ['Landmark','Tourist Attraction','Iconic','Photo Op','Historic'], description: 'Santiago Calatrava-designed 400-foot-tall cable-stayed bridge over the Trinity River, opened 2012. The most photographed architectural icon in Dallas; the Trinity Groves restaurant park sits at its west foot.', address: 'Singleton Blvd & Beckley Ave, Dallas, TX 75212', lat: 32.7806, lng: -96.8190 },
]);

addTo('CHICAGO_DATA', [
  { name: 'Ukrainian National Museum of Chicago', cuisine: 'Museum', neighborhood: 'Ukrainian Village', score: 82, tags: ['Museum','Landmark','Historic','Tourist Attraction'], description: 'Permanent collection of Ukrainian fine and folk art, costumes, and history in the heart of Ukrainian Village. Founded 1952 \u2014 a cultural anchor for Chicago\u2019s Ukrainian diaspora.', address: '2249 W Superior St, Chicago, IL 60612', lat: 41.8955, lng: -87.6837 },
  { name: 'Museum Campus', cuisine: 'Park / Tourist Attraction', neighborhood: 'South Loop', score: 94, tags: ['Park','Tourist Attraction','Landmark','Iconic','Outdoor'], description: 'Lakefront campus grouping the Field Museum, Shedd Aquarium, and Adler Planetarium on 57 acres, with Soldier Field just south. The largest cluster of museums in any American park.', address: '1200 S Lake Shore Dr, Chicago, IL 60605', lat: 41.8663, lng: -87.6166 },
  { name: 'Soldier Field', cuisine: 'Stadium / Landmark', neighborhood: 'South Loop', score: 89, tags: ['Landmark','Tourist Attraction','Iconic','Historic'], description: 'Chicago Bears\u2019 home stadium since 1971, built 1924 on the Museum Campus. Neoclassical Doric colonnade is the oldest surviving NFL stadium structure; hosts major concerts and Chicago Fire FC.', address: '1410 S Museum Campus Dr, Chicago, IL 60605', lat: 41.8623, lng: -87.6167 },
]);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
