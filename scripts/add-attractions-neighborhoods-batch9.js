#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 9.
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

// --- SLC (9th & 9th + South Salt Lake) ---
{
  const { a, e, arr } = readBlock(html, 'SLC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Tower Theatre',
      cuisine: 'Theater / Cinema',
      neighborhood: '9th & 9th',
      score: 86,
      tags: ['Theater', 'Cinema', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'One of Salt Lake\u2019s two independent film theaters, run by the Salt Lake Film Society. The 1928 Art Deco single-screen is the beating heart of the 9th & 9th district \u2014 revival screenings, festivals, and the city\u2019s art-house programming.',
      address: '876 E 900 S, Salt Lake City, UT 84105',
      lat: 40.7495,
      lng: -111.8680,
    }),
    entry({
      id: maxId + 2,
      name: '9th and 9th Sculpture (Monument to Children)',
      cuisine: 'Landmark / Public Art',
      neighborhood: '9th & 9th',
      score: 79,
      tags: ['Landmark', 'Public Art', 'Photo Op', 'Tourist Attraction'],
      description: 'Stephen Goldsmith\u2019s 1995 bronze sculpture at the corner of 900 East and 900 South \u2014 the neighborhood\u2019s namesake landmark. Figures of children at play on a small stone plaza under a mature tree.',
      address: '900 E & 900 S, Salt Lake City, UT 84105',
      lat: 40.7495,
      lng: -111.8687,
    }),
    entry({
      id: maxId + 3,
      name: 'Columbus Center',
      cuisine: 'Landmark / Recreation Center',
      neighborhood: 'South Salt Lake',
      score: 78,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Family Friendly'],
      description: 'Century-old Spanish Revival former schoolhouse turned recreation center and art space. A South Salt Lake civic landmark listed on the National Register of Historic Places.',
      address: '2531 S 400 E, South Salt Lake, UT 84115',
      lat: 40.6974,
      lng: -111.8855,
    }),
  ];
  arr.push(...adds);
  console.log('SLC: +' + adds.length + ' (9th & 9th + South Salt Lake). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- AUSTIN (North Loop) ---
{
  const { a, e, arr } = readBlock(html, 'AUSTIN_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Breakaway Records',
      cuisine: 'Landmark / Record Store',
      neighborhood: 'North Loop',
      score: 80,
      tags: ['Landmark', 'Tourist Attraction', 'Music', 'Shopping'],
      description: 'All-vinyl record shop in a 1950s strip center on North Loop \u2014 the neighborhood\u2019s anchor and a frequent stop on Austin music pilgrimages. 60,000+ titles across soul, garage, jazz, and country.',
      address: '211 W North Loop Blvd, Austin, TX 78751',
      lat: 30.3195,
      lng: -97.7297,
      website: 'https://breakawayrecordshop.com',
    }),
    entry({
      id: maxId + 2,
      name: 'Monkeywrench Books',
      cuisine: 'Landmark / Bookstore',
      neighborhood: 'North Loop',
      score: 78,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping'],
      description: 'All-volunteer collectively-run radical bookstore on North Loop Boulevard, operating since 2002. Zines, anarchist history, and local-press literature \u2014 a genuine North Loop indie institution.',
      address: '110 E North Loop Blvd, Austin, TX 78751',
      lat: 30.3196,
      lng: -97.7286,
    }),
  ];
  arr.push(...adds);
  console.log('AUSTIN: +' + adds.length + ' (North Loop). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- DALLAS (Harwood District) ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Harwood District',
      cuisine: 'Landmark / Master-Planned District',
      neighborhood: 'Harwood District',
      score: 83,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping'],
      description: '19-city-block master-planned neighborhood developed by Harwood International, bridging Uptown and Downtown. European-inspired architecture, sculpture gardens, and a dense cluster of upscale restaurants and rooftop bars.',
      address: 'Harwood St & Woodall Rodgers, Dallas, TX 75201',
      lat: 32.7886,
      lng: -96.8033,
      website: 'https://harwooddistrict.com',
    }),
    entry({
      id: maxId + 2,
      name: 'Saint Ann Court',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'Harwood District',
      score: 80,
      tags: ['Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Restored 1927 Spanish Colonial Revival school building at the corner of Harry Hines and Olive. Now anchors the Saint Ann Restaurant & Bar and the Harwood District\u2019s cultural programming.',
      address: '2501 N Harwood St, Dallas, TX 75201',
      lat: 32.7951,
      lng: -96.8029,
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' (Harwood District). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- LV (Paradise — Sphere) ---
{
  const { a, e, arr } = readBlock(html, 'LV_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Sphere',
      cuisine: 'Landmark / Tourist Attraction',
      neighborhood: 'Paradise',
      score: 95,
      tags: ['Landmark', 'Tourist Attraction', 'Iconic', 'Photo Op', 'Entertainment'],
      description: 'The $2.3B Madison Square Garden Sphere, opened 2023 \u2014 the largest spherical structure in the world, wrapped in 580,000 sq ft of programmable LED exterior. Immersive film experiences like Postcard from Earth and The Wizard of Oz, plus U2 and Eagles residencies inside.',
      address: '255 Sands Ave, Las Vegas, NV 89169',
      lat: 36.1215,
      lng: -115.1631,
      phone: '(725) 258-0001',
      website: 'https://www.thespherevegas.com',
    }),
    entry({
      id: maxId + 2,
      name: 'UNLV Campus',
      cuisine: 'Landmark / University',
      neighborhood: 'Paradise',
      score: 82,
      tags: ['Landmark', 'Tourist Attraction', 'Outdoor'],
      description: 'University of Nevada, Las Vegas \u2014 anchor of the Paradise neighborhood. 358-acre campus with the Marjorie Barrick Museum of Art, the Lied Library, Thomas & Mack Center (basketball), and the flash-flood-tested desert xeriscape quad.',
      address: '4505 S Maryland Pkwy, Las Vegas, NV 89154',
      lat: 36.1071,
      lng: -115.1432,
      website: 'https://www.unlv.edu',
    }),
  ];
  arr.push(...adds);
  console.log('LV: +' + adds.length + ' (Paradise). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
