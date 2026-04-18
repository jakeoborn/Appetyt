#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 5.
// Targets Dallas Bishop Arts, Houston Chinatown/Bellaire, Houston River Oaks,
// Houston Upper Kirby, Austin Rainey Street.
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
    id: o.id,
    name: o.name,
    phone: '',
    cuisine: o.cuisine,
    neighborhood: o.neighborhood,
    score: o.score,
    price: o.price || 1,
    tags: o.tags,
    indicators: [],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: o.description,
    dishes: [],
    address: o.address,
    hours: '',
    lat: o.lat,
    lng: o.lng,
    bestOf: [],
    group: '',
    instagram: '',
    website: o.website || '',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 0,
    verified: true,
    photoUrl: '',
  };
}

// --- DALLAS (Bishop Arts) ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Bishop Arts District',
      cuisine: 'Landmark / Historic District',
      neighborhood: 'Bishop Arts',
      score: 93,
      tags: ['Landmark', 'Tourist Attraction', 'Historic', 'Shopping'],
      description: 'Walkable six-block Oak Cliff district with 60+ locally owned shops, restaurants, and galleries \u2014 Dallas\u2019 most concentrated collection of independent business. Anchored by the intersection of Bishop Avenue and 7th Street.',
      address: 'W 7th St & Bishop Ave, Dallas, TX 75208',
      lat: 32.7456,
      lng: -96.8282,
    }),
    entry({
      id: maxId + 2,
      name: 'The Kessler Theater',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Bishop Arts',
      score: 87,
      tags: ['Theater', 'Landmark', 'Historic', 'Tourist Attraction', 'Live Music'],
      description: 'Restored 1941 single-screen movie theater on West Davis Street, reborn in 2010 as a 500-capacity live-music venue. Americana, indie, and jazz bookings anchor Oak Cliff\u2019s arts calendar.',
      address: '1230 W Davis St, Dallas, TX 75208',
      lat: 32.7451,
      lng: -96.8349,
      website: 'https://thekessler.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Tyler Station',
      cuisine: 'Landmark / Market',
      neighborhood: 'Bishop Arts',
      score: 82,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping', 'Arts'],
      description: 'Adaptive-reuse warehouse complex at the Tyler/Vernon DART station, home to 20+ small makers, restaurants, and Oak Cliff Brewing. Monthly markets and live music pull crowds from across South Dallas.',
      address: '1300 S Polk St, Dallas, TX 75224',
      lat: 32.7371,
      lng: -96.8394,
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' (Bishop Arts). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (Chinatown/Bellaire + River Oaks + Upper Kirby) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    // Chinatown / Bellaire
    entry({
      id: maxId + 1,
      name: 'Hong Kong City Mall',
      cuisine: 'Landmark / Market',
      neighborhood: 'Chinatown / Bellaire',
      score: 85,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping', 'Market'],
      description: 'The anchor of Houston\u2019s New Chinatown on Bellaire Boulevard. 300,000-square-foot indoor mall with Asian grocery, bakeries, bubble tea, banquet restaurants, and the city\u2019s biggest Lunar New Year celebrations.',
      address: '11205 Bellaire Blvd, Houston, TX 77072',
      lat: 29.7060,
      lng: -95.5816,
      phone: '(281) 575-7886',
      website: 'https://hkcitymall.website',
    }),
    entry({
      id: maxId + 2,
      name: 'Teo Chew Temple',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'Chinatown / Bellaire',
      score: 82,
      tags: ['Landmark', 'Tourist Attraction', 'Historic'],
      description: 'Traditional Chinese temple on Turtlewood Drive with ornate carvings, incense courtyards, and a signature red-and-gold pavilion. Hosts Lunar New Year performances that draw thousands.',
      address: '10599 Turtlewood Ct, Houston, TX 77072',
      lat: 29.7039,
      lng: -95.5891,
    }),
    // River Oaks
    entry({
      id: maxId + 3,
      name: 'The River Oaks Theatre',
      cuisine: 'Theater / Cinema',
      neighborhood: 'River Oaks',
      score: 89,
      tags: ['Theater', 'Cinema', 'Landmark', 'Historic', 'Tourist Attraction', 'Iconic'],
      description: 'Historic 1939 Art Deco cinema on West Gray Street, saved from closure by Culinary Khancepts and reopened 2024 as a dine-in theater. Independent, art-house, and awards-season programming alongside classic Houston nostalgia.',
      address: '2009 W Gray St, Houston, TX 77019',
      lat: 29.7520,
      lng: -95.4142,
      phone: '(713) 496-3456',
      website: 'https://www.theriveroakstheatre.com',
    }),
    entry({
      id: maxId + 4,
      name: 'River Oaks Shopping Center',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'River Oaks',
      score: 82,
      tags: ['Landmark', 'Historic', 'Shopping', 'Tourist Attraction'],
      description: 'The oldest shopping center in Texas (1937), occupying the triangle between West Gray, Shepherd, and the Avalon. Art Deco storefronts, Avalon Diner, and dozens of neighborhood shops anchor old-money River Oaks.',
      address: 'W Gray St & S Shepherd Dr, Houston, TX 77019',
      lat: 29.7512,
      lng: -95.4132,
    }),
    // Upper Kirby
    entry({
      id: maxId + 5,
      name: 'Levy Park',
      cuisine: 'Park',
      neighborhood: 'Upper Kirby',
      score: 88,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: 'Six-acre reimagined neighborhood park that reopened 2017 with a treehouse, performance pavilion, dog park, and year-round programming. The cultural and social heart of Upper Kirby.',
      address: '3801 Eastside St, Houston, TX 77098',
      lat: 29.7368,
      lng: -95.4184,
      phone: '(713) 522-7275',
      website: 'https://levyparkhouston.org',
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' (Chinatown/Bellaire + River Oaks + Upper Kirby). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- AUSTIN (Rainey Street) ---
{
  const { a, e, arr } = readBlock(html, 'AUSTIN_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Rainey Street Historic District',
      cuisine: 'Landmark / Historic District',
      neighborhood: 'Rainey Street',
      score: 88,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Nightlife'],
      description: 'A block of early-20th-century bungalows on the south edge of Downtown, converted since 2008 into one of Austin\u2019s most concentrated bar and restaurant strips. The National Register historic district lends the nightlife real architectural character.',
      address: 'Rainey St & Driskill St, Austin, TX 78701',
      lat: 30.2602,
      lng: -97.7396,
    }),
    entry({
      id: maxId + 2,
      name: 'Waterloo Greenway',
      cuisine: 'Park / Trail',
      neighborhood: 'Rainey Street',
      score: 86,
      tags: ['Park', 'Landmark', 'Tourist Attraction', 'Outdoor'],
      description: '1.5-mile chain-of-parks along Waller Creek connecting Lady Bird Lake to 15th Street. The southern Waterloo Park reach \u2014 with the Moody Amphitheater \u2014 sits just east of Rainey.',
      address: '500 E 12th St, Austin, TX 78701',
      lat: 30.2740,
      lng: -97.7381,
      website: 'https://waterloogreenway.org',
    }),
  ];
  arr.push(...adds);
  console.log('AUSTIN: +' + adds.length + ' (Rainey Street). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
