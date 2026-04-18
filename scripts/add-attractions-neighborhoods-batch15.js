#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 15 (final of this run).
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

addTo('SLC_DATA', [
  { name: 'Memory Grove Park', cuisine: 'Park', neighborhood: 'The Avenues', score: 84, tags: ['Park','Landmark','Historic','Tourist Attraction','Outdoor'], description: 'Utah\u2019s memorial park to WWI, WWII, Korean, and Vietnam War dead, tucked into a ravine on the north edge of City Creek Canyon. Wooded trails, the stone Greek Revival Memorial House, and the gateway to City Creek.', address: '485 N Canyon Rd, Salt Lake City, UT 84103', lat: 40.7773, lng: -111.8829 },
  { name: 'Salt Lake City Cemetery', cuisine: 'Landmark / Historic Site', neighborhood: 'The Avenues', score: 80, tags: ['Landmark','Historic','Outdoor'], description: 'One of the largest city-owned cemeteries in the United States (1848) \u2014 250 acres on the bench above the Avenues, with graves of Brigham Young and Mormon pioneers. Arboretum-quality tree canopy and valley views.', address: '200 N St, Salt Lake City, UT 84103', lat: 40.7799, lng: -111.8627 },
]);

addTo('AUSTIN_DATA', [
  { name: 'Elisabet Ney Museum', cuisine: 'Museum', neighborhood: 'Hyde Park', score: 83, tags: ['Museum','Landmark','Historic','Tourist Attraction'], description: 'Former studio of German-American sculptor Elisabet Ney, preserved in its 1890s limestone castle. Rotating exhibitions and a sculpture collection including Ney\u2019s commissions for the Texas State Capitol.', address: '304 E 44th St, Austin, TX 78751', lat: 30.3067, lng: -97.7283 },
]);

addTo('NYC_DATA', [
  { name: 'Brooklyn Academy of Music (BAM)', cuisine: 'Theater / Landmark', neighborhood: 'Fort Greene / Clinton Hill', score: 91, tags: ['Theater','Landmark','Historic','Tourist Attraction','Iconic','Arts'], description: 'America\u2019s oldest continuously operating performing-arts center (1861), anchored by the landmark 1908 Peter Jay Sharp Building. The annual Next Wave Festival is a global contemporary-performance showcase.', address: '30 Lafayette Ave, Brooklyn, NY 11217', lat: 40.6865, lng: -73.9783 },
  { name: 'BRIC House', cuisine: 'Theater / Arts', neighborhood: 'Fort Greene / Clinton Hill', score: 82, tags: ['Theater','Arts','Landmark','Tourist Attraction'], description: 'Nonprofit performing-arts and media center in Fort Greene \u2014 the producer of the Celebrate Brooklyn! summer concert series at Prospect Park Bandshell. Free contemporary-art exhibitions in the Stoop gallery year-round.', address: '647 Fulton St, Brooklyn, NY 11217', lat: 40.6870, lng: -73.9779 },
]);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
