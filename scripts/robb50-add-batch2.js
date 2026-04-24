#!/usr/bin/env node
// Add Kind Regards, The Blond, Amber Room to NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

const CARDS = [
  {
    id: 2002,
    name: 'Kind Regards',
    phone: '',
    cuisine: 'Cocktail Bar',
    neighborhood: 'Lower East Side',
    score: 89,
    price: 3,
    tags: ['Cocktails', 'Late Night', 'Date Night', 'Scene', 'Nightlife'],
    indicators: [],
    hh: '',
    reservation: 'OpenTable',
    awards: '',
    description: "A two-story cocktail lounge in the former Cake Shop space on Ludlow Street — upstairs lounge-forward room with banquette seating and a long bar; downstairs a darker, late-night party with DJs running to close. Bottle service available, wine-focused table pairings, and a seasonal cocktail program. Open Tuesday through Sunday from 8pm.",
    dishes: ['Seasonal cocktails', 'Wine by the glass', 'Bottle service'],
    address: '152 Ludlow St, New York, NY 10002',
    hours: 'Tue-Sun 8pm-4am',
    lat: 40.7208163,
    lng: -73.9877831,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: '',
    instagram: '@kindregardsnyc',
    website: 'https://kindregardsnyc.com',
    suburb: false,
    reserveUrl: 'https://www.opentable.com/r/kind-regards-new-york',
    menuUrl: '',
    res_tier: 3,
    photos: [],
    photoUrl: 'https://images.squarespace-cdn.com/content/v1/633cdbf4680c930ad783c46b/472bf984-22bc-40a8-8722-189f01c3907c/Downstairs+Night.jpg',
    verified: '2026-04-23',
  },
  {
    id: 2003,
    name: 'the blond',
    phone: '(212) 235-1111',
    cuisine: 'Cocktail Bar / Hotel Lounge',
    neighborhood: 'SoHo',
    score: 90,
    price: 4,
    tags: ['Cocktails', 'Scene', 'Date Night', 'Luxury', 'Nightlife', 'Late Night'],
    indicators: [],
    hh: '',
    reservation: 'SevenRooms',
    awards: '',
    description: "The cocktail lounge inside 11 Howard, the Space Copenhagen-designed boutique hotel from Aby Rosen. Arched windows face Howard Street; dark woods, subdued colors, low lighting, and gold accents set a seductive tone. Bar-bites come courtesy of next-door Le Coucou, and rotating seasonal cocktail lists pair with the room's changing mood — open and workable by day, sensual and DJ-driven by night. After 10pm, entry is by reservation, and two disco balls glow red over the dance floor. A longtime fashion-set haunt.",
    dishes: ['Seasonal cocktails', "Le Coucou-crafted bar bites", 'Dirty Blond cocktail'],
    address: '11 Howard St, New York, NY 10013',
    hours: 'Mon-Tue 5pm-12am; Wed 5pm-1am; Thu-Sat 5pm-4am; closed Sun',
    lat: 40.7192288,
    lng: -74.0001891,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false,
    group: '11 Howard',
    instagram: '@11_howard',
    website: 'https://www.11howard.com/the-blond',
    suburb: false,
    reserveUrl: 'https://www.sevenrooms.com/direct/reservation-request/theblond/table',
    bookingInfo: 'Walk-in before 10pm; after 10pm entry is reservation-only.',
    menuUrl: '',
    res_tier: 4,
    photos: [],
    photoUrl: 'https://lirp.cdn-website.com/8c555b24/dms3rep/multi/opt/990x800-11how-06-rgb-v1-1920w.jpeg',
    verified: '2026-04-23',
  },
  {
    id: 2004,
    name: 'Amber Room',
    phone: '',
    cuisine: 'Nightclub / Lounge',
    neighborhood: 'Flatiron',
    score: 87,
    price: 4,
    tags: ['Nightlife', 'Dance Club', 'Late Night', 'Scene', 'Cocktails', 'Luxury'],
    indicators: [],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: "An upscale 55 West 21st lounge that has quickly become a NYFW and celebrity hotspot — host to a Met Gala after-party, the NYFW closing party, and Carlos Alcaraz's 2024 US Open closing celebration. Plush furniture and a wide-open floor plan seat up to 150 with 400 standing and a VIP PDR for 50. Four-am liquor license; table service for large events, DJs, and brand activations. J Balvin, Rosalía, Odell Beckham, Fat Joe, and Flo Rida are on the regulars list.",
    dishes: ['Bottle service', 'Cocktails'],
    address: '55 W 21st St, New York, NY 10010',
    hours: 'Event-based — check IG for schedule',
    lat: 40.7413895,
    lng: -73.9929254,
    bestOf: [],
    busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: true,
    group: '',
    instagram: '@amberroomnyc',
    website: 'https://www.amberroomnyc.com',
    suburb: false,
    reserveUrl: 'https://www.amberroomnyc.com/events',
    menuUrl: '',
    res_tier: 5,
    photos: [],
    photoUrl: 'https://img.partyslate.com/companies-cover-image/59121/image-c8a31dd6-7e56-4ece-a791-74d76d2fa8a0.jpg?tr=w-1920',
    verified: '2026-04-23',
  },
];

let html = fs.readFileSync(HTML_PATH, 'utf8');
const startLen = html.length;

let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
if (nycStart < 0) throw new Error('NYC_DATA not found');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}
let arrText = html.slice(arrOpen, arrClose);

for (const card of CARDS) {
  const idRe = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + card.id + '(?=[,}\\s])');
  if (idRe.test(arrText)) { console.error('id ' + card.id + ' already present — skipping ' + card.name); continue; }
  if (arrText.includes('"name":"' + card.name + '"')) { console.error(card.name + ' already present — skipping'); continue; }
  const serialized = JSON.stringify(card);
  const lastCloseBrace = arrText.lastIndexOf('}');
  arrText = arrText.slice(0, lastCloseBrace + 1) + ',' + serialized + arrText.slice(lastCloseBrace + 1);
  console.log('+ ' + card.name + ' (id=' + card.id + ')');
}

const newHtml = html.slice(0, arrOpen) + arrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('File delta: +' + (newHtml.length - startLen) + ' bytes');
