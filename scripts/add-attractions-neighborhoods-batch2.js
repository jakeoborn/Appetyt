#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 2.
// Targets Seattle Capitol Hill (upgrade), Houston Heights (upgrade),
// NYC Chinatown, Seattle CID, Chicago Gold Coast.
// All verified via firecrawl_search 2026-04-17.
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

// --- SEATTLE (Capitol Hill + CID) ---
{
  const { a, e, arr } = readBlock(html, 'SEATTLE_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    // Capitol Hill (upgrade from 1)
    entry({
      id: maxId + 1,
      name: 'Volunteer Park',
      cuisine: 'Park',
      neighborhood: 'Capitol Hill',
      score: 91,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '48-acre Olmsted-designed park on the north end of Capitol Hill, home to the Volunteer Park Conservatory, the Seattle Asian Art Museum, and the iconic 75-foot water tower observation deck with skyline views.',
      address: '1247 15th Ave E, Seattle, WA 98112',
      lat: 47.6301,
      lng: -122.3156,
    }),
    entry({
      id: maxId + 2,
      name: 'Seattle Asian Art Museum',
      cuisine: 'Museum',
      neighborhood: 'Capitol Hill',
      score: 88,
      tags: ['Museum', 'Tourist Attraction', 'Arts', 'Landmark'],
      description: 'Seattle Art Museum\u2019s Asian collection housed in an Art Deco landmark inside Volunteer Park. Reopened 2020 after a major renovation that expanded the galleries and added a conservation center.',
      address: '1400 E Prospect St, Seattle, WA 98112',
      lat: 47.6306,
      lng: -122.3144,
      website: 'https://seattleasianartmuseum.org',
    }),
    entry({
      id: maxId + 3,
      name: 'Cal Anderson Park',
      cuisine: 'Park',
      neighborhood: 'Capitol Hill',
      score: 84,
      tags: ['Park', 'Outdoor', 'Landmark', 'Family Friendly'],
      description: 'Capitol Hill\u2019s flagship public green space with a reflecting pool, a restored 1908 reservoir fountain, and the Bobby Morris Playfield. A daily gathering spot for locals and the historic center of Capitol Hill civic life.',
      address: '1635 11th Ave, Seattle, WA 98122',
      lat: 47.6184,
      lng: -122.3195,
    }),
    // Chinatown-International District (from 0)
    entry({
      id: maxId + 4,
      name: 'Wing Luke Museum',
      cuisine: 'Museum',
      neighborhood: 'Chinatown-International District',
      score: 90,
      tags: ['Museum', 'Tourist Attraction', 'Historic', 'Landmark'],
      description: 'Smithsonian-affiliated museum of the Asian Pacific American experience inside the landmark East Kong Yick building. Rotating exhibitions and guided neighborhood tours explore Seattle\u2019s immigration history.',
      address: '719 S King St, Seattle, WA 98104',
      lat: 47.5979,
      lng: -122.3237,
      website: 'https://www.wingluke.org',
    }),
    entry({
      id: maxId + 5,
      name: 'Hing Hay Park',
      cuisine: 'Park',
      neighborhood: 'Chinatown-International District',
      score: 84,
      tags: ['Park', 'Landmark', 'Tourist Attraction', 'Outdoor'],
      description: 'The CID\u2019s civic heart \u2014 a compact plaza anchored by a traditional Chinese grand pavilion and an LED-paneled stage. Hosts Lunar New Year celebrations, Night Market, and the annual dragon dance.',
      address: '423 Maynard Ave S, Seattle, WA 98104',
      lat: 47.5986,
      lng: -122.3237,
    }),
    entry({
      id: maxId + 6,
      name: 'Kobe Terrace Park',
      cuisine: 'Park',
      neighborhood: 'Chinatown-International District',
      score: 80,
      tags: ['Park', 'Outdoor', 'Landmark'],
      description: 'Hillside Japanese-style park named for Seattle\u2019s sister city Kobe. Rows of cherry trees, a 200-year-old stone lantern gifted by Kobe, and panoramic views over Pioneer Square.',
      address: '221 6th Ave S, Seattle, WA 98104',
      lat: 47.6013,
      lng: -122.3249,
    }),
  ];
  arr.push(...adds);
  console.log('SEATTLE: +' + adds.length + ' attractions (Capitol Hill + CID). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (Heights) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'The Heights Theater',
      cuisine: 'Theater / Landmark',
      neighborhood: 'Heights',
      score: 87,
      tags: ['Theater', 'Landmark', 'Historic', 'Arts', 'Tourist Attraction'],
      description: 'Built in the 1920s and restored in 2016 as a 19th-Street live music venue. Intimate standing-room room that has hosted acts from Whitney Rose to Drive-By Truckers.',
      address: '339 W 19th St, Houston, TX 77008',
      lat: 29.8025,
      lng: -95.4044,
      phone: '(214) 272-8346',
      website: 'https://theheightstheater.com',
    }),
    entry({
      id: maxId + 2,
      name: 'White Oak Music Hall',
      cuisine: 'Concert Venue / Landmark',
      neighborhood: 'Heights',
      score: 86,
      tags: ['Theater', 'Landmark', 'Arts', 'Tourist Attraction', 'Live Music'],
      description: 'Indoor/outdoor concert complex on the edge of the Heights. Two indoor stages plus a lawn amphitheater \u2014 one of Houston\u2019s most versatile independent live-music destinations.',
      address: '2915 N Main St, Houston, TX 77009',
      lat: 29.7869,
      lng: -95.3625,
    }),
    entry({
      id: maxId + 3,
      name: 'Heights Hike and Bike Trail',
      cuisine: 'Park / Trail',
      neighborhood: 'Heights',
      score: 82,
      tags: ['Park', 'Outdoor', 'Landmark', 'Family Friendly'],
      description: 'Converted MKT rail corridor that runs the length of the Heights, connecting to the White Oak Bayou and Downtown trails. The neighborhood\u2019s car-free spine for cyclists, runners, and dog-walkers.',
      address: 'Nicholson St & W 7th St, Houston, TX 77007',
      lat: 29.7794,
      lng: -95.4064,
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' attractions (Heights). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- NYC (Chinatown) ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Museum of Chinese in America',
      cuisine: 'Museum',
      neighborhood: 'Chinatown',
      score: 88,
      tags: ['Museum', 'Tourist Attraction', 'Historic', 'Landmark'],
      description: 'Maya Lin-designed museum documenting the history of the Chinese diaspora in the United States. Rotating exhibitions and an extensive archive; the main Centre Street location is the public face of the institution.',
      address: '215 Centre St, New York, NY 10013',
      lat: 40.7196,
      lng: -74.0002,
      phone: '(212) 619-4785',
      website: 'https://www.mocanyc.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Columbus Park',
      cuisine: 'Park',
      neighborhood: 'Chinatown',
      score: 84,
      tags: ['Park', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Historic public park carved out of the 19th-century Five Points slum. By day, the playground of choice for Chinatown grandparents \u2014 dominoes, tai chi, and the occasional pickup erhu concert.',
      address: '67 Mulberry St, New York, NY 10013',
      lat: 40.7156,
      lng: -74.0006,
    }),
    entry({
      id: maxId + 3,
      name: 'Museum at Eldridge Street',
      cuisine: 'Museum',
      neighborhood: 'Chinatown',
      score: 86,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Restored 1887 synagogue that served Eastern European Jewish immigrants on the Lower East Side\u2019s Chinatown border. A National Historic Landmark with an east rose window by Kiki Smith and Deborah Gans.',
      address: '12 Eldridge St, New York, NY 10002',
      lat: 40.7150,
      lng: -73.9933,
    }),
  ];
  arr.push(...adds);
  console.log('NYC: +' + adds.length + ' attractions (Chinatown). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- CHICAGO (Gold Coast) ---
{
  const { a, e, arr } = readBlock(html, 'CHICAGO_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'International Museum of Surgical Science',
      cuisine: 'Museum',
      neighborhood: 'Gold Coast',
      score: 84,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction'],
      description: 'Only museum in North America dedicated to surgery, housed in a 1917 Howard Van Doren Shaw mansion overlooking Lincoln Park. Antique instruments, an apothecary shop, and a Hall of Immortals.',
      address: '1524 N Lake Shore Dr, Chicago, IL 60610',
      lat: 41.9102,
      lng: -87.6266,
      phone: '(312) 642-6502',
      website: 'https://imss.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Charnley-Persky House',
      cuisine: 'Landmark / Historic House',
      neighborhood: 'Gold Coast',
      score: 85,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Architecture'],
      description: 'Adler & Sullivan 1891 residence with Frank Lloyd Wright\u2019s fingerprints as the young draftsman on the project. Chicago Landmark and the headquarters of the Society of Architectural Historians \u2014 tours Wednesdays and Saturdays.',
      address: '1365 N Astor St, Chicago, IL 60610',
      lat: 41.9085,
      lng: -87.6286,
    }),
    entry({
      id: maxId + 3,
      name: 'Washington Square Park',
      cuisine: 'Park',
      neighborhood: 'Gold Coast',
      score: 80,
      tags: ['Park', 'Landmark', 'Historic', 'Outdoor'],
      description: 'Oldest existing park in Chicago (1842) and a designated landmark district, once the city\u2019s premier soapbox forum \u2014 famously nicknamed \u201cBughouse Square.\u201d Four corner diagonals converge on a central fountain.',
      address: '901 N Clark St, Chicago, IL 60610',
      lat: 41.8987,
      lng: -87.6314,
    }),
  ];
  arr.push(...adds);
  console.log('CHICAGO: +' + adds.length + ' attractions (Gold Coast). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
