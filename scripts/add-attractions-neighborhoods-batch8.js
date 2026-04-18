#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 8: Vegas heavy.
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
    id: o.id, name: o.name, phone: o.phone || '', cuisine: o.cuisine,
    neighborhood: o.neighborhood, score: o.score, price: o.price || 1,
    tags: o.tags, indicators: [], hh: '', reservation: 'walk-in',
    awards: '', description: o.description, dishes: [],
    address: o.address, hours: '', lat: o.lat, lng: o.lng,
    bestOf: [], group: '', instagram: '', website: o.website || '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 0,
    verified: true, photoUrl: '',
  };
}

const { a, e, arr } = readBlock(html, 'LV_DATA');
const maxId = Math.max(...arr.map(r => r.id || 0));
const before = arr.length;

const adds = [
  // The Strip (Bellagio)
  entry({
    id: maxId + 1,
    name: 'Fountains of Bellagio',
    cuisine: 'Landmark / Tourist Attraction',
    neighborhood: 'The Strip (Bellagio)',
    score: 95,
    tags: ['Landmark', 'Tourist Attraction', 'Iconic', 'Photo Op', 'Free'],
    description: 'Choreographed water show on the 8-acre Bellagio lake, running every 15-30 minutes afternoon into the night. The most iconic free attraction on the Strip.',
    address: '3600 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1126,
    lng: -115.1767,
  }),
  entry({
    id: maxId + 2,
    name: 'Bellagio Conservatory & Botanical Gardens',
    cuisine: 'Botanical Garden / Landmark',
    neighborhood: 'The Strip (Bellagio)',
    score: 92,
    tags: ['Landmark', 'Tourist Attraction', 'Iconic', 'Free', 'Photo Op'],
    description: 'Seasonal floral installations \u2014 rotating 5x a year across Chinese New Year, Spring, Summer, Autumn, and Holiday themes. Massive hand-built displays inside the Bellagio lobby, always free to visit.',
    address: '3600 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1128,
    lng: -115.1767,
  }),
  entry({
    id: maxId + 3,
    name: 'Bellagio Gallery of Fine Art',
    cuisine: 'Museum',
    neighborhood: 'The Strip (Bellagio)',
    score: 85,
    tags: ['Museum', 'Arts', 'Tourist Attraction', 'Landmark'],
    description: 'Intimate gallery inside the Bellagio hosting rotating curated exhibitions of major artists \u2014 past shows include Warhol, Picasso, and Monet. The Strip\u2019s only serious fine-art venue.',
    address: '3600 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1128,
    lng: -115.1767,
  }),
  // The Strip (Venetian)
  entry({
    id: maxId + 4,
    name: 'Gondola Rides at The Venetian',
    cuisine: 'Landmark / Tourist Attraction',
    neighborhood: 'The Strip (The Venetian)',
    score: 88,
    tags: ['Landmark', 'Tourist Attraction', 'Iconic', 'Photo Op'],
    description: 'Indoor and outdoor gondola rides on the Grand Canal replica, poled by singing gondoliers. The most distinctive experience at the Venetian and one of the Strip\u2019s signature photo stops.',
    address: '3355 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1212,
    lng: -115.1704,
    website: 'https://www.venetianlasvegas.com/resort/attractions/gondola-rides.html',
  }),
  entry({
    id: maxId + 5,
    name: 'Madame Tussauds Las Vegas',
    cuisine: 'Museum / Tourist Attraction',
    neighborhood: 'The Strip (The Venetian)',
    score: 82,
    tags: ['Museum', 'Tourist Attraction', 'Family Friendly', 'Photo Op'],
    description: 'Wax museum inside the Venetian with 100+ lifelike figures of celebrities, athletes, and historical figures. Marvel superhero wing and Las Vegas legends tableaus.',
    address: '3377 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1210,
    lng: -115.1705,
    website: 'https://www.madametussauds.com/las-vegas/',
  }),
  // The Strip (Wynn)
  entry({
    id: maxId + 6,
    name: 'Lake of Dreams',
    cuisine: 'Landmark / Tourist Attraction',
    neighborhood: 'The Strip (Wynn)',
    score: 86,
    tags: ['Landmark', 'Tourist Attraction', 'Photo Op', 'Iconic'],
    description: 'Steve Wynn\u2019s signature lake-and-mountain backdrop behind the Wynn, with a nightly 3D light-and-music show visible from the Lakeside Restaurant and the Parasol Up & Down bars. Free to view with resort access.',
    address: '3131 S Las Vegas Blvd, Las Vegas, NV 89109',
    lat: 36.1268,
    lng: -115.1663,
  }),
  // The Strip (Mandalay Bay)
  entry({
    id: maxId + 7,
    name: 'Shark Reef Aquarium',
    cuisine: 'Aquarium / Tourist Attraction',
    neighborhood: 'The Strip (Mandalay Bay)',
    score: 88,
    tags: ['Aquarium', 'Tourist Attraction', 'Landmark', 'Family Friendly'],
    description: '1.6-million-gallon aquarium inside Mandalay Bay with 2,000+ marine animals including sharks, sea turtles, stingrays, and a walk-through tunnel. One of the Strip\u2019s top family attractions.',
    address: '3950 S Las Vegas Blvd, Las Vegas, NV 89119',
    lat: 36.0927,
    lng: -115.1755,
    phone: '(702) 632-4555',
  }),
  // Henderson
  entry({
    id: maxId + 8,
    name: 'Lion Habitat Ranch',
    cuisine: 'Zoo / Tourist Attraction',
    neighborhood: 'Henderson',
    score: 87,
    tags: ['Zoo', 'Tourist Attraction', 'Landmark', 'Family Friendly'],
    description: 'Retirement sanctuary for MGM Grand\u2019s former lions, now home to 40+ rescued big cats. Giraffe feeding encounters and a weekend-only visit window make it one of Henderson\u2019s most distinctive attractions.',
    address: '382 Bruner Ave, Henderson, NV 89044',
    lat: 35.9879,
    lng: -115.1243,
    phone: '(702) 595-6666',
    website: 'https://www.lionhabitatranch.org',
  }),
  entry({
    id: maxId + 9,
    name: 'Lake Las Vegas',
    cuisine: 'Landmark / Tourist Attraction',
    neighborhood: 'Henderson',
    score: 86,
    tags: ['Landmark', 'Tourist Attraction', 'Outdoor'],
    description: '320-acre private lake resort community in Henderson. MonteLago Village, Hilton Lake Las Vegas Resort, paddle sports, and the Reflection Bay Golf Club anchor the shoreline.',
    address: 'Lake Las Vegas Pkwy, Henderson, NV 89011',
    lat: 36.0983,
    lng: -114.9443,
  }),
];

arr.push(...adds);
console.log('LV: +' + adds.length + ' (Bellagio + Venetian + Wynn + Mandalay Bay + Henderson). ' + before + ' -> ' + arr.length);
html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
