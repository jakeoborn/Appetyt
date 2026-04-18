#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 10 (final for this sprint).
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

// --- CHICAGO (Chinatown + Uptown) ---
{
  const { a, e, arr } = readBlock(html, 'CHICAGO_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Chinatown Gate',
      cuisine: 'Landmark',
      neighborhood: 'Chinatown',
      score: 84,
      tags: ['Landmark', 'Tourist Attraction', 'Historic', 'Photo Op', 'Iconic'],
      description: 'The arched red-and-gold gate at Wentworth and Cermak, dedicated 1975 \u2014 the ceremonial entrance to Chicago\u2019s Chinatown and one of the neighborhood\u2019s most-photographed landmarks.',
      address: 'Wentworth Ave & Cermak Rd, Chicago, IL 60616',
      lat: 41.8530,
      lng: -87.6320,
    }),
    entry({
      id: maxId + 2,
      name: 'Ping Tom Memorial Park',
      cuisine: 'Park',
      neighborhood: 'Chinatown',
      score: 85,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '17-acre riverfront park on a former rail yard \u2014 named for civic leader Ping Tom. Chinese-inspired pagoda, boathouse, and some of the best downtown skyline views from the Chicago River.',
      address: '1700 S Wentworth Ave, Chicago, IL 60616',
      lat: 41.8577,
      lng: -87.6366,
    }),
    entry({
      id: maxId + 3,
      name: 'Green Mill Jazz Club',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Uptown',
      score: 90,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Iconic', 'Live Music'],
      description: 'Al Capone\u2019s favorite speakeasy, still operating on North Broadway since 1907. The booth with the trap door behind the bar is still there. Jazz 7 nights a week and the longest-running poetry slam in America on Sundays.',
      address: '4802 N Broadway, Chicago, IL 60640',
      lat: 41.9691,
      lng: -87.6592,
    }),
    entry({
      id: maxId + 4,
      name: 'Aragon Ballroom',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Uptown',
      score: 86,
      tags: ['Theater', 'Landmark', 'Historic', 'Tourist Attraction', 'Live Music'],
      description: 'Moorish-style 1926 ballroom at 1106 W Lawrence \u2014 the anchor of Uptown\u2019s historic entertainment district. 4,500-capacity rock venue in a space originally built for big-band dancing.',
      address: '1106 W Lawrence Ave, Chicago, IL 60640',
      lat: 41.9692,
      lng: -87.6587,
    }),
    entry({
      id: maxId + 5,
      name: 'Uptown Theatre',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Uptown',
      score: 85,
      tags: ['Theater', 'Landmark', 'Historic', 'Tourist Attraction', 'Iconic'],
      description: 'Spanish Revival 1925 movie palace, 4,381 seats \u2014 one of the largest single-screen theaters ever built. Shuttered since 1981 but a designated Chicago Landmark and the subject of an ongoing preservation campaign.',
      address: '4816 N Broadway, Chicago, IL 60640',
      lat: 41.9693,
      lng: -87.6592,
    }),
  ];
  arr.push(...adds);
  console.log('CHICAGO: +' + adds.length + ' (Chinatown + Uptown). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- SEATTLE (West Seattle) ---
{
  const { a, e, arr } = readBlock(html, 'SEATTLE_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Alki Beach',
      cuisine: 'Landmark / Beach',
      neighborhood: 'West Seattle',
      score: 91,
      tags: ['Landmark', 'Tourist Attraction', 'Outdoor', 'Iconic', 'Photo Op'],
      description: '2.5-mile sandy beach along Elliott Bay, the historical birthplace of Seattle (the Denny Party landed here in 1851). Skyline-framing views, a smaller Statue of Liberty replica, and summertime volleyball and bonfires.',
      address: '1702 Alki Ave SW, Seattle, WA 98116',
      lat: 47.5798,
      lng: -122.4022,
    }),
    entry({
      id: maxId + 2,
      name: 'West Seattle Junction',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'West Seattle',
      score: 83,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping'],
      description: 'Historic commercial crossroads at California Avenue SW and SW Alaska Street. The Junction\u2019s hand-painted murals, indie shops, and the iconic \u201cOrigins\u201d sculpture anchor West Seattle\u2019s walkable retail spine.',
      address: 'California Ave SW & SW Alaska St, Seattle, WA 98116',
      lat: 47.5605,
      lng: -122.3860,
    }),
  ];
  arr.push(...adds);
  console.log('SEATTLE: +' + adds.length + ' (West Seattle). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- DALLAS (Plano) ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Legacy West',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'Plano',
      score: 85,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping'],
      description: 'Mixed-use live-work-play development on Legacy Drive \u2014 anchored by the global HQs of Toyota, JPMorgan, and Liberty Mutual. Upscale dining on Legacy Food Hall\u2019s open-air plaza, luxury retail, and a hotel district.',
      address: '5905 Legacy Dr, Plano, TX 75024',
      lat: 33.0796,
      lng: -96.8298,
    }),
    entry({
      id: maxId + 2,
      name: 'The Shops at Legacy',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'Plano',
      score: 82,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping'],
      description: 'Walkable European-village-style outdoor retail and dining destination, the original Legacy development (2001). Cobblestone streets, boutiques, a central fountain, and 20+ restaurants.',
      address: '5741 Legacy Dr, Plano, TX 75024',
      lat: 33.0782,
      lng: -96.8273,
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' (Plano). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (Katy) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Typhoon Texas Waterpark',
      cuisine: 'Water Park / Tourist Attraction',
      neighborhood: 'Katy',
      score: 85,
      tags: ['Tourist Attraction', 'Landmark', 'Family Friendly', 'Outdoor'],
      description: '25-acre family waterpark on the Katy Mills property \u2014 30+ slides, a wave pool, a lazy river, and a dedicated kids area. The Houston-area\u2019s biggest summer splash destination.',
      address: '555 Katy Fort Bend Rd, Katy, TX 77494',
      lat: 29.7927,
      lng: -95.8202,
    }),
    entry({
      id: maxId + 2,
      name: 'Katy Mills',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'Katy',
      score: 80,
      tags: ['Landmark', 'Tourist Attraction', 'Shopping', 'Family Friendly'],
      description: '1.3-million-square-foot outlet mall on the west side of Houston \u2014 the region\u2019s outlet anchor, with 175+ stores plus an AMC theater, American Girl Bistro, and Katy Mills Circle entertainment loop.',
      address: '5000 Katy Mills Cir, Katy, TX 77494',
      lat: 29.7876,
      lng: -95.8180,
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' (Katy). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
