#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 11: Vegas Strip casino subzones.
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

const { a, e, arr } = readBlock(html, 'LV_DATA');
const maxId = Math.max(...arr.map(r => r.id || 0));
const before = arr.length;
const adds = [
  entry({ id: maxId + 1, name: 'The Colosseum at Caesars Palace', cuisine: 'Theater / Tourist Attraction', neighborhood: 'The Strip (Caesars Palace)', score: 92, tags: ['Theater','Tourist Attraction','Landmark','Iconic','Live Music'], description: '4,300-seat concert and residency theater that hosted Celine Dion\u2019s landmark run plus Adele, Rod Stewart, and Usher residencies. One of the Strip\u2019s definitive music venues.', address: '3570 S Las Vegas Blvd, Las Vegas, NV 89109', lat: 36.1168, lng: -115.1746 }),
  entry({ id: maxId + 2, name: 'Dolby Live', cuisine: 'Theater / Tourist Attraction', neighborhood: 'The Strip (Park MGM)', score: 90, tags: ['Theater','Tourist Attraction','Landmark','Iconic','Live Music'], description: '5,200-seat theater at Park MGM designed by Dolby for immersive sound. Home to Lady Gaga\u2019s Jazz & Piano residency and Bruno Mars\u2019s long-running Vegas shows.', address: '3770 S Las Vegas Blvd, Las Vegas, NV 89109', lat: 36.1028, lng: -115.1762 }),
  entry({ id: maxId + 3, name: 'MGM Grand Garden Arena', cuisine: 'Stadium / Landmark', neighborhood: 'The Strip (MGM Grand)', score: 89, tags: ['Landmark','Tourist Attraction','Entertainment','Iconic'], description: '16,800-seat arena inside MGM Grand \u2014 the original Vegas championship venue, site of legendary heavyweight title bouts, UFC PPVs, and top-tier concerts.', address: '3799 S Las Vegas Blvd, Las Vegas, NV 89109', lat: 36.1020, lng: -115.1700 }),
  entry({ id: maxId + 4, name: 'Zouk Nightclub', cuisine: 'Nightclub / Tourist Attraction', neighborhood: 'The Strip (Resorts World)', score: 88, tags: ['Tourist Attraction','Entertainment','Landmark','Iconic'], description: 'Singapore-import 30,000-sq-ft nightclub at Resorts World with a state-of-the-art sound system and a residency roster including Ti\u00ebsto and deadmau5.', address: '3000 S Las Vegas Blvd, Las Vegas, NV 89109', lat: 36.1356, lng: -115.1655 }),
  entry({ id: maxId + 5, name: 'The Park', cuisine: 'Park / Landmark', neighborhood: 'The Strip (Park MGM)', score: 85, tags: ['Park','Landmark','Tourist Attraction','Outdoor','Free','Photo Op'], description: 'Outdoor promenade between T-Mobile Arena and New York-New York, anchored by the 40-foot Bliss Dance sculpture. Public plaza with restaurants and shaded walking paths.', address: '3782 S Las Vegas Blvd, Las Vegas, NV 89109', lat: 36.1024, lng: -115.1770 }),
];
arr.push(...adds);
console.log('LV: +' + adds.length + ' (Strip casinos). ' + before + ' -> ' + arr.length);
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
