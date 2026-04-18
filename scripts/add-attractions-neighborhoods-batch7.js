#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 7.
// Seattle Bellevue + South Lake Union + University District; Houston Memorial;
// NYC Park Slope / Prospect Heights.
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

// --- SEATTLE ---
{
  const { a, e, arr } = readBlock(html, 'SEATTLE_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    // Bellevue
    entry({
      id: maxId + 1,
      name: 'Bellevue Arts Museum',
      cuisine: 'Museum',
      neighborhood: 'Bellevue',
      score: 87,
      tags: ['Museum', 'Arts', 'Landmark', 'Tourist Attraction'],
      description: 'Steven Holl-designed contemporary art, craft, and design museum on Bellevue Way. Rotating exhibitions across three galleries and the annual BAM ARTSfair, one of the Pacific Northwest\u2019s largest outdoor art festivals.',
      address: '510 Bellevue Way NE, Bellevue, WA 98004',
      lat: 47.6175,
      lng: -122.2008,
      website: 'https://bellevuearts.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Bellevue Downtown Park',
      cuisine: 'Park',
      neighborhood: 'Bellevue',
      score: 86,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '21-acre urban oasis with a 240-foot waterfall cascade, a grand promenade, and a circular canal reflecting pool. The civic heart of downtown Bellevue and host of Snowflake Lane each December.',
      address: '10201 NE 4th St, Bellevue, WA 98004',
      lat: 47.6126,
      lng: -122.1995,
    }),
    // South Lake Union
    entry({
      id: maxId + 3,
      name: 'MOHAI (Museum of History & Industry)',
      cuisine: 'Museum',
      neighborhood: 'South Lake Union',
      score: 90,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Seattle\u2019s flagship history museum in the restored 1942 Naval Armory on Lake Union Park. Permanent exhibits on the Great Fire, the Boeing era, and Bezos Center for Innovation.',
      address: '860 Terry Ave N, Seattle, WA 98109',
      lat: 47.6275,
      lng: -122.3368,
      phone: '(206) 324-1126',
      website: 'https://mohai.org',
    }),
    entry({
      id: maxId + 4,
      name: 'Amazon Spheres',
      cuisine: 'Landmark / Tourist Attraction',
      neighborhood: 'South Lake Union',
      score: 88,
      tags: ['Landmark', 'Tourist Attraction', 'Iconic', 'Photo Op'],
      description: 'Three interconnected glass biodomes on Amazon\u2019s downtown campus housing 40,000+ plants from 30+ countries. The public Understory exhibit explains the biology; the domes are one of Seattle\u2019s most-photographed modern landmarks.',
      address: '2111 7th Ave, Seattle, WA 98121',
      lat: 47.6156,
      lng: -122.3390,
    }),
    entry({
      id: maxId + 5,
      name: 'Lake Union Park',
      cuisine: 'Park',
      neighborhood: 'South Lake Union',
      score: 86,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '12-acre waterfront park at the southern tip of Lake Union. Historic ships at the Center for Wooden Boats, seaplane views, and the launch point for many Seattle parades. MOHAI is on the south edge.',
      address: '860 Terry Ave N, Seattle, WA 98109',
      lat: 47.6276,
      lng: -122.3362,
    }),
    // University District
    entry({
      id: maxId + 6,
      name: 'Henry Art Gallery',
      cuisine: 'Museum',
      neighborhood: 'University District',
      score: 87,
      tags: ['Museum', 'Arts', 'Landmark', 'Tourist Attraction'],
      description: 'UW campus contemporary art museum, the first public art museum in Washington State (1927). James Turrell\u2019s Light Reign skyspace is the signature permanent installation; rotating exhibitions emphasize photography and video.',
      address: '15th Ave NE & NE 41st St, Seattle, WA 98195',
      lat: 47.6575,
      lng: -122.3128,
      phone: '(206) 543-2280',
      website: 'https://henryart.org',
    }),
    entry({
      id: maxId + 7,
      name: 'Burke Museum of Natural History and Culture',
      cuisine: 'Museum',
      neighborhood: 'University District',
      score: 88,
      tags: ['Museum', 'Landmark', 'Tourist Attraction', 'Family Friendly'],
      description: 'Washington\u2019s state museum of natural history and culture, reopened 2019 in a dramatic glass-fronted new building on the UW campus. Full dinosaur skeletons, Pacific Northwest Native art, and working labs visible to visitors.',
      address: '4303 Memorial Way NE, Seattle, WA 98195',
      lat: 47.6603,
      lng: -122.3111,
      phone: '(206) 543-5590',
      website: 'https://www.burkemuseum.org',
    }),
  ];
  arr.push(...adds);
  console.log('SEATTLE: +' + adds.length + ' (Bellevue + SLU + UDistrict). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (Memorial) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Memorial Park',
      cuisine: 'Park',
      neighborhood: 'Memorial',
      score: 93,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Iconic', 'Family Friendly'],
      description: 'One of the largest urban parks in the United States (1,500+ acres). Memorial Park Conservancy\u2019s 2022 Land Bridge reunited the park over Memorial Drive; the Seymour Lieberman Trail is Houston\u2019s busiest running loop.',
      address: '6501 Memorial Dr, Houston, TX 77007',
      lat: 29.7634,
      lng: -95.4405,
      website: 'https://www.memorialparkconservancy.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Houston Arboretum & Nature Center',
      cuisine: 'Park / Nature Preserve',
      neighborhood: 'Memorial',
      score: 86,
      tags: ['Park', 'Tourist Attraction', 'Outdoor', 'Family Friendly'],
      description: '155-acre nonprofit nature sanctuary on the edge of Memorial Park. Five miles of trails across restored prairie, wetlands, and forest; the Nature Center hosts guided bird walks and kids\u2019 nature programs.',
      address: '4501 Woodway Dr, Houston, TX 77024',
      lat: 29.7627,
      lng: -95.4491,
      website: 'https://houstonarboretum.org',
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' (Memorial). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- NYC (Park Slope / Prospect Heights) ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Prospect Park',
      cuisine: 'Park',
      neighborhood: 'Park Slope / Prospect Heights',
      score: 95,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Iconic', 'Family Friendly'],
      description: 'Brooklyn\u2019s 526-acre Olmsted and Vaux masterpiece \u2014 the team behind Central Park. The Long Meadow, the Ravine, Prospect Park Lake, and the LeFrak Center skating rink anchor Brooklyn\u2019s largest park.',
      address: '95 Prospect Park West, Brooklyn, NY 11215',
      lat: 40.6602,
      lng: -73.9690,
      website: 'https://www.prospectpark.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Brooklyn Museum',
      cuisine: 'Museum',
      neighborhood: 'Park Slope / Prospect Heights',
      score: 93,
      tags: ['Museum', 'Arts', 'Landmark', 'Tourist Attraction', 'Iconic'],
      description: 'Second-largest museum in New York City, with 1.5 million works across ancient Egyptian antiquities, Judy Chicago\u2019s Dinner Party, and a celebrated African art collection. First Saturdays are a free, late-night neighborhood institution.',
      address: '200 Eastern Pkwy, Brooklyn, NY 11238',
      lat: 40.6712,
      lng: -73.9636,
      phone: '(718) 638-5000',
      website: 'https://www.brooklynmuseum.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Brooklyn Botanic Garden',
      cuisine: 'Botanical Garden / Park',
      neighborhood: 'Park Slope / Prospect Heights',
      score: 92,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '52-acre botanical garden wedged between Prospect Park and the Brooklyn Museum. Cherry Esplanade Sakura Matsuri (spring), Shakespeare Garden, and the glass Steinhardt Conservatory \u2014 one of the city\u2019s great year-round escapes.',
      address: '990 Washington Ave, Brooklyn, NY 11238',
      lat: 40.6687,
      lng: -73.9626,
      website: 'https://www.bbg.org',
    }),
  ];
  arr.push(...adds);
  console.log('NYC: +' + adds.length + ' (Park Slope / Prospect Heights). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
