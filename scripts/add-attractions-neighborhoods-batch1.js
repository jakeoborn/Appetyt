#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 1.
// Targets 5 zero-attraction neighborhoods with highest total spots:
// NYC West Village (52), NYC Lower East Side (51), SLC Sugar House (50),
// Seattle Fremont (29), Dallas Uptown (64). All landmarks/parks/museums
// verified via firecrawl_search 2026-04-17 and will be picked up by
// A.classify() as 'attractions' via their cuisine/tags.
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
    instagram: o.instagram || '',
    website: o.website || '',
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    res_tier: 0,
    verified: true,
    photoUrl: '',
  };
}

// --- NYC ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Stonewall Inn National Monument',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'West Village',
      score: 92,
      price: 1,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'LGBTQ+', 'National Monument'],
      description: 'Birthplace of the modern LGBTQ+ rights movement. The 1969 Stonewall Uprising transformed this Greenwich Village bar into a pilgrimage site; designated a National Monument in 2016. The adjacent Christopher Park forms the monument\u2019s core.',
      address: '53 Christopher St, New York, NY 10014',
      lat: 40.7337,
      lng: -74.0025,
      website: 'https://thestonewallinnnyc.com',
    }),
    entry({
      id: maxId + 2,
      name: 'Cherry Lane Theatre',
      cuisine: 'Theater / Landmark',
      neighborhood: 'West Village',
      score: 86,
      price: 2,
      tags: ['Theater', 'Landmark', 'Historic', 'Arts'],
      description: 'New York City\u2019s oldest continuously running off-Broadway theater, founded 1924 on a quiet West Village mews. Tucked on Commerce Street, the 179-seat space has premiered work by Sam Shepard, Samuel Beckett, and Edward Albee.',
      address: '38 Commerce St, New York, NY 10014',
      lat: 40.7312,
      lng: -74.0051,
    }),
    entry({
      id: maxId + 3,
      name: 'Tenement Museum',
      cuisine: 'Museum',
      neighborhood: 'Lower East Side',
      score: 93,
      price: 2,
      tags: ['Museum', 'Historic', 'Tourist Attraction', 'Landmark'],
      description: 'Preserved tenement buildings at 97 and 103 Orchard Street telling the stories of the immigrant families who lived there between the 1860s and 1980s. Guided tours walk through recreated apartments and the working-class neighborhoods they shaped.',
      address: '103 Orchard St, New York, NY 10002',
      lat: 40.7186,
      lng: -73.9903,
      website: 'https://www.tenement.org',
    }),
    entry({
      id: maxId + 4,
      name: 'New Museum',
      cuisine: 'Museum',
      neighborhood: 'Lower East Side',
      score: 90,
      price: 2,
      tags: ['Museum', 'Tourist Attraction', 'Contemporary Art', 'Arts'],
      description: 'Manhattan\u2019s only museum dedicated exclusively to contemporary art, founded 1977. The Sejima + Ryue Nishizawa / SANAA-designed Bowery building is itself a landmark of 21st-century architecture. Rotating shows highlight emerging international artists.',
      address: '235 Bowery, New York, NY 10002',
      lat: 40.7226,
      lng: -73.9928,
      website: 'https://www.newmuseum.org',
    }),
    entry({
      id: maxId + 5,
      name: 'Essex Market',
      cuisine: 'Market / Landmark',
      neighborhood: 'Lower East Side',
      score: 87,
      price: 1,
      tags: ['Landmark', 'Tourist Attraction', 'Market', 'Historic'],
      description: 'Historic public market founded 1940 under Mayor La Guardia, reborn in 2019 inside Essex Crossing. A vendor hall of specialty grocers, butchers, and prepared-food stalls reflecting the Lower East Side\u2019s immigrant food traditions.',
      address: '88 Essex St, New York, NY 10002',
      lat: 40.7185,
      lng: -73.9878,
      website: 'https://www.essexmarket.nyc',
    }),
  ];
  arr.push(...adds);
  console.log('NYC: +' + adds.length + ' attractions (West Village + LES). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- SLC ---
{
  const { a, e, arr } = readBlock(html, 'SLC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Sugar House Park',
      cuisine: 'Park',
      neighborhood: 'Sugar House',
      score: 88,
      tags: ['Park', 'Tourist Attraction', 'Outdoor', 'Family Friendly'],
      description: 'The 110-acre crown jewel of the Sugar House neighborhood, on the site of the former Utah State Prison. A favorite for 4th of July fireworks, sledding on Fairmont Hill in winter, and lakeside picnics year-round.',
      address: '1330 E 2100 S, Salt Lake City, UT 84106',
      lat: 40.7229,
      lng: -111.8522,
    }),
    entry({
      id: maxId + 2,
      name: 'Hidden Hollow',
      cuisine: 'Park / Nature Preserve',
      neighborhood: 'Sugar House',
      score: 84,
      tags: ['Park', 'Landmark', 'Outdoor'],
      description: 'A restored riparian nature preserve along Parleys Creek, tucked between Sugarmont Drive and the Sugar House commercial district. Boardwalks and native plantings make this a pocket-sized escape from the surrounding city.',
      address: '1052 E 2100 S, Salt Lake City, UT 84106',
      lat: 40.7228,
      lng: -111.8594,
    }),
    entry({
      id: maxId + 3,
      name: 'Fairmont Park',
      cuisine: 'Park',
      neighborhood: 'Sugar House',
      score: 83,
      tags: ['Park', 'Outdoor', 'Family Friendly'],
      description: 'A 28-acre neighborhood park with an aquatic center, skatepark, ball fields, and access to the Parleys Trail. A favorite local gathering spot on the south side of Sugar House.',
      address: '1040 E Sugarmont Dr, Salt Lake City, UT 84106',
      lat: 40.7207,
      lng: -111.8599,
    }),
  ];
  arr.push(...adds);
  console.log('SLC: +' + adds.length + ' attractions (Sugar House). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- SEATTLE ---
{
  const { a, e, arr } = readBlock(html, 'SEATTLE_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Fremont Troll',
      cuisine: 'Landmark / Public Art',
      neighborhood: 'Fremont',
      score: 91,
      tags: ['Landmark', 'Tourist Attraction', 'Public Art', 'Photo Op', 'Iconic'],
      description: 'Eighteen-foot cement troll clutching a Volkswagen Beetle beneath the north end of the Aurora Bridge, installed 1990 by four local artists. One of Seattle\u2019s most iconic and most-photographed landmarks.',
      address: '3405 Troll Ave N, Seattle, WA 98103',
      lat: 47.6510,
      lng: -122.3473,
    }),
    entry({
      id: maxId + 2,
      name: 'Fremont Bridge',
      cuisine: 'Landmark',
      neighborhood: 'Fremont',
      score: 86,
      tags: ['Landmark', 'Tourist Attraction', 'Historic'],
      description: 'Bascule drawbridge over the Lake Washington Ship Canal, opened 1917 and still one of the most frequently opened drawbridges in the United States. Its blue-and-orange paint scheme is a neighborhood signature.',
      address: 'Fremont Ave N, Seattle, WA 98103',
      lat: 47.6476,
      lng: -122.3498,
    }),
    entry({
      id: maxId + 3,
      name: 'Waiting for the Interurban',
      cuisine: 'Landmark / Public Art',
      neighborhood: 'Fremont',
      score: 84,
      tags: ['Landmark', 'Public Art', 'Photo Op'],
      description: 'Beloved 1979 aluminum sculpture of six people and a dog waiting for a long-vanished streetcar line. Locals decorate it for holidays, birthdays, and current events \u2014 the most-dressed-up piece of public art in Seattle.',
      address: 'N 34th St & Fremont Ave N, Seattle, WA 98103',
      lat: 47.6492,
      lng: -122.3509,
    }),
  ];
  arr.push(...adds);
  console.log('SEATTLE: +' + adds.length + ' attractions (Fremont). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- DALLAS ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Klyde Warren Park',
      cuisine: 'Park',
      neighborhood: 'Uptown',
      score: 92,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Family Friendly', 'Outdoor'],
      description: '5.2-acre deck park built over the Woodall Rodgers Freeway, opened 2012 to knit Uptown and the Arts District back together. Food trucks, a performance pavilion, and free programming every day of the week.',
      address: '2012 Woodall Rodgers Fwy, Dallas, TX 75201',
      lat: 32.7894,
      lng: -96.8019,
      website: 'https://www.klydewarrenpark.org',
    }),
    entry({
      id: maxId + 2,
      name: 'McKinney Avenue Trolley (M-Line)',
      cuisine: 'Landmark / Tourist Attraction',
      neighborhood: 'Uptown',
      score: 85,
      tags: ['Landmark', 'Tourist Attraction', 'Historic', 'Transportation'],
      description: 'Free heritage streetcar line running restored vintage trolleys between Uptown and the Dallas Arts District. A 4.6-mile loop that doubles as a living museum of early-20th-century rail cars.',
      address: '3153 Oak Grove Ave, Dallas, TX 75204',
      lat: 32.7997,
      lng: -96.8027,
      website: 'https://mata.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Reverchon Park',
      cuisine: 'Park',
      neighborhood: 'Uptown',
      score: 83,
      tags: ['Park', 'Outdoor', 'Landmark'],
      description: '46-acre park at the western edge of Uptown along the Trinity Strand Trail, named for pioneer botanist Julien Reverchon. Mature oaks, a baseball stadium, and the gateway to the Katy Trail.',
      address: '3505 Maple Ave, Dallas, TX 75219',
      lat: 32.8003,
      lng: -96.8103,
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' attractions (Uptown). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
