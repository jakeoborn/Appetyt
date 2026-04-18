#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 3.
// Targets Austin East Austin, LV Downtown, LV Arts District, Chicago West Town,
// Houston Midtown. Verified via firecrawl_search 2026-04-17.
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

// --- AUSTIN (East Austin) ---
{
  const { a, e, arr } = readBlock(html, 'AUSTIN_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Texas State Cemetery',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'East Austin',
      score: 86,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Outdoor'],
      description: 'Final resting place of Texas\u2019 heroes, governors, and cultural figures including Stephen F. Austin. 22 acres of rolling oaks and monuments in the middle of East Austin, with a visitor center and self-guided walking tours.',
      address: '909 Navasota St, Austin, TX 78702',
      lat: 30.2686,
      lng: -97.7283,
    }),
    entry({
      id: maxId + 2,
      name: 'George Washington Carver Museum',
      cuisine: 'Museum',
      neighborhood: 'East Austin',
      score: 84,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction', 'Arts'],
      description: 'Museum, cultural, and genealogy center dedicated to African American history and art, in a Carnegie-era library building. Permanent and rotating exhibitions plus the Juneteenth parade jumping-off point.',
      address: '1165 Angelina St, Austin, TX 78702',
      lat: 30.2744,
      lng: -97.7275,
    }),
    entry({
      id: maxId + 3,
      name: 'French Legation State Historic Site',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'East Austin',
      score: 83,
      tags: ['Landmark', 'Historic', 'Museum', 'Tourist Attraction'],
      description: 'The 1841 home of Alphonse Dubois de Saligny, France\u2019s chargé d\u2019affaires to the Republic of Texas \u2014 the oldest frame building in Austin. Reopened by the Texas Historical Commission after a major preservation renovation.',
      address: '802 San Marcos St, Austin, TX 78702',
      lat: 30.2693,
      lng: -97.7301,
    }),
  ];
  arr.push(...adds);
  console.log('AUSTIN: +' + adds.length + ' (East Austin). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- LAS VEGAS (Downtown + Arts District) ---
{
  const { a, e, arr } = readBlock(html, 'LV_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'The Neon Museum',
      cuisine: 'Museum',
      neighborhood: 'Downtown',
      score: 90,
      tags: ['Museum', 'Tourist Attraction', 'Landmark', 'Historic', 'Iconic', 'Photo Op'],
      description: 'The \u201cBoneyard\u201d \u2014 an outdoor gallery of rescued mid-century Las Vegas neon signs, the city\u2019s visual memory. Day and night tours (including the immersive Brilliant! sound-and-light show) walk you through the Stardust, Moulin Rouge, and Sahara signs.',
      address: '770 Las Vegas Blvd N, Las Vegas, NV 89101',
      lat: 36.1770,
      lng: -115.1402,
      website: 'https://www.neonmuseum.org',
    }),
    entry({
      id: maxId + 2,
      name: 'The Mob Museum',
      cuisine: 'Museum',
      neighborhood: 'Downtown',
      score: 90,
      tags: ['Museum', 'Tourist Attraction', 'Historic', 'Landmark', 'Iconic'],
      description: 'National Museum of Organized Crime and Law Enforcement, inside the 1933 former federal courthouse that hosted a Kefauver Committee hearing. Three floors of exhibits plus a working speakeasy and distillery in the basement.',
      address: '300 Stewart Ave, Las Vegas, NV 89101',
      lat: 36.1725,
      lng: -115.1432,
      website: 'https://themobmuseum.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Fremont Street Experience',
      cuisine: 'Landmark / Tourist Attraction',
      neighborhood: 'Downtown',
      score: 88,
      tags: ['Landmark', 'Tourist Attraction', 'Entertainment', 'Iconic', 'Photo Op'],
      description: 'Five-block pedestrian mall beneath the Viva Vision canopy \u2014 a 1,500-foot LED ceiling that runs hourly light shows after dark. Zipline, free outdoor concerts, and the classic old-Vegas casino strip.',
      address: '425 Fremont St, Las Vegas, NV 89101',
      lat: 36.1705,
      lng: -115.1428,
      website: 'https://vegasexperience.com',
    }),
    entry({
      id: maxId + 4,
      name: 'The Arts Factory',
      cuisine: 'Gallery / Landmark',
      neighborhood: 'Arts District',
      score: 85,
      tags: ['Landmark', 'Gallery', 'Arts', 'Tourist Attraction'],
      description: 'The anchor building of the 18b Arts District \u2014 home to 30+ artist studios, galleries, retail, and 18Bin bar & restaurant. The hub of First Friday art walks every month.',
      address: '107 E Charleston Blvd, Las Vegas, NV 89104',
      lat: 36.1586,
      lng: -115.1484,
      website: 'https://www.theartsfactorylv.com',
    }),
  ];
  arr.push(...adds);
  console.log('LV: +' + adds.length + ' (Downtown + Arts District). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- CHICAGO (West Town / Wicker Park) ---
{
  const { a, e, arr } = readBlock(html, 'CHICAGO_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'The 606 (Bloomingdale Trail)',
      cuisine: 'Park / Trail',
      neighborhood: 'West Town',
      score: 89,
      tags: ['Park', 'Landmark', 'Tourist Attraction', 'Outdoor', 'Family Friendly'],
      description: '2.7-mile elevated rail-to-trail linear park connecting Bucktown, Wicker Park, Humboldt Park, and Logan Square. Opened 2015; art installations, native plantings, and the city\u2019s most-used bike commuter corridor north of the Loop.',
      address: '1801 N Ridgeway Ave, Chicago, IL 60647',
      lat: 41.9136,
      lng: -87.7202,
      website: 'https://www.the606.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Polish Museum of America',
      cuisine: 'Museum',
      neighborhood: 'West Town',
      score: 84,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'One of the oldest ethnic museums in the United States, founded 1935 in the Polish Roman Catholic Union of America headquarters on Noble Square. Folk-art, military, and the Paderewski Room with the pianist\u2019s personal effects.',
      address: '984 N Milwaukee Ave, Chicago, IL 60642',
      lat: 41.9013,
      lng: -87.6627,
      website: 'https://www.polishmuseumofamerica.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Flat Iron Arts Building',
      cuisine: 'Landmark / Arts',
      neighborhood: 'West Town',
      score: 82,
      tags: ['Landmark', 'Arts', 'Historic', 'Tourist Attraction'],
      description: 'Triangular 1913 building at the six-corners intersection of Milwaukee, Damen, and North \u2014 Wicker Park\u2019s physical and cultural anchor. 60+ artist studios across three floors plus open-studio nights for the public.',
      address: '1579 N Milwaukee Ave, Chicago, IL 60622',
      lat: 41.9097,
      lng: -87.6773,
    }),
  ];
  arr.push(...adds);
  console.log('CHICAGO: +' + adds.length + ' (West Town). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (Midtown) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Midtown Park',
      cuisine: 'Park',
      neighborhood: 'Midtown',
      score: 84,
      tags: ['Park', 'Landmark', 'Tourist Attraction', 'Outdoor', 'Family Friendly'],
      description: 'Midtown\u2019s signature urban oasis on Travis Street \u2014 a block-sized civic park with a performance pavilion, dog park, seasonal programming, and surrounding restaurants and retail.',
      address: '2811 Travis St, Houston, TX 77006',
      lat: 29.7418,
      lng: -95.3758,
    }),
    entry({
      id: maxId + 2,
      name: 'Bagby Park',
      cuisine: 'Park',
      neighborhood: 'Midtown',
      score: 80,
      tags: ['Park', 'Outdoor', 'Family Friendly'],
      description: 'Neighborhood lifestyle park between Bagby Street restaurants and residential Midtown. Shaded seating, a shade sail-covered lawn, and free Wi-Fi for outdoor work.',
      address: '508 Gray St, Houston, TX 77002',
      lat: 29.7470,
      lng: -95.3792,
    }),
    entry({
      id: maxId + 3,
      name: 'Baldwin Park',
      cuisine: 'Park',
      neighborhood: 'Midtown',
      score: 79,
      tags: ['Park', 'Outdoor', 'Family Friendly'],
      description: 'Compact Midtown green space along Crawford Street with urban forestry plantings under a long-running management plan. Mature live oaks and a quiet lunch spot for nearby office workers.',
      address: '1701 Elgin St, Houston, TX 77004',
      lat: 29.7393,
      lng: -95.3744,
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' (Midtown). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
