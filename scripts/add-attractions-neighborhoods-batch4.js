#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 4.
// Targets Dallas Lower Greenville + Knox-Henderson + Park Cities;
// NYC Harlem; Austin South Lamar.
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
    awards: o.awards || '',
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

// --- DALLAS (Lower Greenville + Knox-Henderson + Park Cities) ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    // Lower Greenville
    entry({
      id: maxId + 1,
      name: 'Granada Theater',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Lower Greenville',
      score: 89,
      tags: ['Theater', 'Landmark', 'Historic', 'Tourist Attraction', 'Live Music'],
      description: 'Restored 1946 single-screen Art Deco movie palace turned flagship Lower Greenville live-music venue. Hosts 200+ touring acts a year; Sundown at Granada is the adjacent all-day restaurant/patio.',
      address: '3524 Greenville Ave, Dallas, TX 75206',
      lat: 32.8171,
      lng: -96.7707,
      website: 'https://granadatheater.com',
    }),
    // Knox-Henderson
    entry({
      id: maxId + 2,
      name: 'Katy Trail (Knox Entrance)',
      cuisine: 'Park / Trail',
      neighborhood: 'Knox-Henderson',
      score: 90,
      tags: ['Park', 'Tourist Attraction', 'Outdoor', 'Landmark', 'Family Friendly'],
      description: '3.5-mile urban rail-to-trail between Uptown and Knox Street. The Knox-Henderson trailhead at Abbott Avenue is the neighborhood\u2019s busiest, surrounded by the Weir\u2019s Plaza and Knox Street restaurants.',
      address: 'Abbott Ave & Katy Trail, Dallas, TX 75205',
      lat: 32.8175,
      lng: -96.7930,
    }),
    entry({
      id: maxId + 3,
      name: 'Cole Park',
      cuisine: 'Park',
      neighborhood: 'Knox-Henderson',
      score: 80,
      tags: ['Park', 'Outdoor', 'Family Friendly'],
      description: 'Six-acre residential park between Knox-Henderson and Uptown, with mature oaks, a playground, basketball courts, and the historic Cole Park Pavilion. Popular for neighborhood dog walks and picnics.',
      address: '4400 Bowser Ave, Dallas, TX 75219',
      lat: 32.8157,
      lng: -96.8023,
    }),
    // Park Cities
    entry({
      id: maxId + 4,
      name: 'Highland Park Village',
      cuisine: 'Landmark / Shopping District',
      neighborhood: 'Park Cities',
      score: 91,
      tags: ['Landmark', 'Tourist Attraction', 'Historic', 'Shopping'],
      description: 'The first self-contained shopping center in America (1931) and a National Historic Landmark. Spanish Colonial Revival architecture and luxury boutiques anchor this Park Cities icon.',
      address: '47 Highland Park Village, Dallas, TX 75205',
      lat: 32.8334,
      lng: -96.8020,
    }),
    entry({
      id: maxId + 5,
      name: 'Meadows Museum',
      cuisine: 'Museum',
      neighborhood: 'Park Cities',
      score: 91,
      tags: ['Museum', 'Arts', 'Tourist Attraction', 'Landmark'],
      description: 'One of the largest and most comprehensive collections of Spanish art outside Spain, on the SMU campus. Works by Velázquez, Goya, Picasso, and Miró across permanent and rotating exhibitions.',
      address: '5900 Bishop Blvd, Dallas, TX 75205',
      lat: 32.8434,
      lng: -96.7833,
      website: 'https://www.meadowsmuseumdallas.org',
    }),
    entry({
      id: maxId + 6,
      name: 'George W. Bush Presidential Center',
      cuisine: 'Museum',
      neighborhood: 'Park Cities',
      score: 89,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Presidential library and museum on the SMU campus, designed by Robert A.M. Stern. Permanent Decision Points Theater, a full-scale Oval Office replica, and a 15-acre Texas prairie landscape.',
      address: '2943 SMU Blvd, Dallas, TX 75205',
      lat: 32.8413,
      lng: -96.7785,
      website: 'https://www.bushcenter.org',
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' attractions (LG/Knox/Park Cities). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- NYC (Harlem) ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Apollo Theater',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Harlem',
      score: 95,
      tags: ['Theater', 'Landmark', 'Historic', 'Tourist Attraction', 'Iconic', 'Live Music'],
      description: 'Harlem\u2019s crown jewel and the cradle of Black American music \u2014 Ella Fitzgerald, James Brown, and countless others launched careers here at Amateur Night. The neon marquee on 125th Street is one of NYC\u2019s most photographed landmarks.',
      address: '253 W 125th St, New York, NY 10027',
      lat: 40.8103,
      lng: -73.9503,
      phone: '(212) 531-5300',
      website: 'https://www.apollotheater.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Studio Museum in Harlem',
      cuisine: 'Museum',
      neighborhood: 'Harlem',
      score: 90,
      tags: ['Museum', 'Tourist Attraction', 'Arts', 'Landmark'],
      description: 'Premier institution dedicated to artists of African descent. Reopened 2025 in a new David Adjaye-designed building on West 125th Street; the Artist-in-Residence program has launched the careers of Kehinde Wiley, Julie Mehretu, and many others.',
      address: '144 W 125th St, New York, NY 10027',
      lat: 40.8086,
      lng: -73.9487,
      phone: '(212) 864-4500',
      website: 'https://www.studiomuseum.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Morris-Jumel Mansion',
      cuisine: 'Landmark / Historic House',
      neighborhood: 'Harlem',
      score: 85,
      tags: ['Landmark', 'Historic', 'Museum', 'Tourist Attraction'],
      description: 'Manhattan\u2019s oldest remaining house (1765), where George Washington headquartered during the Battle of Harlem Heights. A hidden gem on a hill at the edge of Washington Heights with panoramic views.',
      address: '65 Jumel Terrace, New York, NY 10032',
      lat: 40.8343,
      lng: -73.9383,
    }),
  ];
  arr.push(...adds);
  console.log('NYC: +' + adds.length + ' attractions (Harlem). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- AUSTIN (South Lamar) ---
{
  const { a, e, arr } = readBlock(html, 'AUSTIN_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Alamo Drafthouse South Lamar',
      cuisine: 'Theater / Cinema',
      neighborhood: 'South Lamar',
      score: 89,
      tags: ['Theater', 'Cinema', 'Tourist Attraction', 'Landmark', 'Date Night'],
      description: 'Flagship South Austin location of the Austin-born Alamo Drafthouse chain. Nine screens, a craft cocktail bar (The Highball), and the strict-talking-and-texting policy that made the brand famous.',
      address: '1120 S Lamar Blvd, Austin, TX 78704',
      lat: 30.2541,
      lng: -97.7680,
      website: 'https://drafthouse.com/austin/theater/south-lamar',
    }),
    entry({
      id: maxId + 2,
      name: 'Zach Theatre',
      cuisine: 'Theater / Performing Arts',
      neighborhood: 'South Lamar',
      score: 86,
      tags: ['Theater', 'Arts', 'Landmark', 'Tourist Attraction'],
      description: 'Austin\u2019s oldest regional theater (founded 1932), on a six-acre campus at Lamar Boulevard and Riverside Drive. Three stages host Broadway-caliber musicals, new plays, and holiday programming like A Christmas Carol.',
      address: '1510 Toomey Rd, Austin, TX 78704',
      lat: 30.2612,
      lng: -97.7613,
      website: 'https://zachtheatre.org',
    }),
    entry({
      id: maxId + 3,
      name: 'I Love You So Much Mural',
      cuisine: 'Landmark / Public Art',
      neighborhood: 'South Lamar',
      score: 82,
      tags: ['Landmark', 'Public Art', 'Tourist Attraction', 'Photo Op'],
      description: 'The four-word love letter painted on the side of Jo\u2019s Coffee on South Congress (at the edge of South Lamar) is one of Austin\u2019s most photographed public artworks. Painted 2010 by musician Amy Cook.',
      address: '1300 S Congress Ave, Austin, TX 78704',
      lat: 30.2500,
      lng: -97.7508,
    }),
  ];
  arr.push(...adds);
  console.log('AUSTIN: +' + adds.length + ' attractions (South Lamar + South Congress edge). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
