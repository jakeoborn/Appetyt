#!/usr/bin/env node
// Coming Soon tab audit: add verified upcoming restaurant openings to cities
// that had zero coming-soon entries (Dallas had 13, Chicago 1, others 0).
// All verified via firecrawl_search 2026-04-17.
// Also updates Ugly Baby (NYC) — moving to new Williamsburg address, coming-soon.
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

function newCS(o) {
  return {
    id: o.id,
    name: o.name,
    phone: '',
    cuisine: o.cuisine,
    neighborhood: o.neighborhood,
    score: o.score,
    price: o.price || 3,
    tags: o.tags || [],
    indicators: ['coming-soon'],
    hh: '',
    reservation: '',
    awards: o.awards || '',
    description: o.description,
    dishes: [],
    address: o.address,
    hours: '',
    lat: o.lat,
    lng: o.lng,
    bestOf: [],
    group: o.group || '',
    instagram: o.instagram || '',
    website: o.website || '',
    suburb: false,
    res_tier: 2,
    verified: true,
    photoUrl: '',
  };
}

// --- HOUSTON ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  arr.push(newCS({
    id: maxId + 1,
    name: 'Kirkwood',
    cuisine: 'New American',
    neighborhood: 'Energy Corridor',
    score: 85,
    price: 3,
    tags: ['New American', 'Date Night', 'New Opening'],
    description: 'Mac Haik Restaurant Group\u2019s modern clubhouse-inspired American restaurant opening early 2026 inside Energy Tower II in the Energy Corridor. Balance of sophistication and warmth with a broad contemporary American menu. Adjacent pickleball and cocktail lounge concept in the same development.',
    address: '11720 Katy Freeway, Houston, TX 77079',
    lat: 29.7839,
    lng: -95.5744,
    instagram: '@kirkwoodhtx',
    website: 'https://www.kirkwoodrestaurant.com',
  }));
  console.log('HOUSTON: +Kirkwood id=' + (maxId + 1));
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- SEATTLE ---
{
  const { a, e, arr } = readBlock(html, 'SEATTLE_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  arr.push(newCS({
    id: maxId + 1,
    name: 'Baiana',
    cuisine: 'Brazilian',
    neighborhood: 'Downtown',
    score: 87,
    price: 3,
    tags: ['Brazilian', 'New Opening', 'Date Night'],
    description: 'Chef Emme Ribeiro Collins\u2019 Brazilian-inspired restaurant in Pike Place Market, drawing on her Bahian heritage and her parents\u2019 shuttered Seattle restaurant. Grand opening set for April 30, 2026. Coastal Brazilian flavors in a landmark Market storefront.',
    address: '1505 Pike Pl, Seattle, WA 98101',
    lat: 47.6097,
    lng: -122.3423,
  }));
  arr.push(newCS({
    id: maxId + 2,
    name: 'Bush Garden',
    cuisine: 'Japanese / Karaoke',
    neighborhood: 'Chinatown-International District',
    score: 85,
    price: 2,
    tags: ['Japanese', 'Karaoke', 'Local Favorites', 'New Opening'],
    description: 'Karen Akada Sakata\u2019s revitalized Bush Garden \u2014 a Seattle CID institution since 1954 \u2014 is reopening inside Uncle Bob\u2019s Place after years of delays. Japanese comfort food, a full bar, and the legacy karaoke room that made Bush Garden a Seattle late-night staple.',
    address: '417 8th Ave S, Seattle, WA 98104',
    lat: 47.5983,
    lng: -122.3263,
    website: 'https://www.bushgardenseattle.com',
  }));
  console.log('SEATTLE: +Baiana id=' + (maxId + 1) + ', +Bush Garden id=' + (maxId + 2));
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- CHICAGO ---
{
  const { a, e, arr } = readBlock(html, 'CHICAGO_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  arr.push(newCS({
    id: maxId + 1,
    name: 'The Hand & The Eye',
    cuisine: 'New American / Magic Venue',
    neighborhood: 'Streeterville',
    score: 86,
    price: 3,
    tags: ['New American', 'Date Night', 'New Opening'],
    description: 'Streeterville New American restaurant and immersive magic venue from the Rockwell Group, opening April 18, 2026 at the corner of East Ontario Street. Sister concept to the original Hand and Eye in NYC.',
    address: '100 E Ontario St, Chicago, IL 60611',
    lat: 41.8930,
    lng: -87.6238,
    instagram: 'thehandandtheeye',
    website: 'https://www.thehandandtheeye.com',
  }));
  console.log('CHICAGO: +The Hand & The Eye id=' + (maxId + 1));
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- NYC: update existing Ugly Baby entry to new Williamsburg address + coming-soon ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const ub = arr.find(r => r.name === 'Ugly Baby');
  let ubUpdated = false;
  if (ub) {
    ub.neighborhood = 'Williamsburg';
    ub.address = '364 Grand St, Brooklyn, NY 11211';
    ub.lat = 40.7136;
    ub.lng = -73.9579;
    ub.indicators = Array.from(new Set([...(ub.indicators || []), 'coming-soon']));
    ub.hours = '';
    ub.description = 'Sirichai Sreparplarn\u2019s ferociously spicy Thai restaurant is reopening in a bigger Williamsburg space at 364 Grand Street after shuttering its beloved Carroll Gardens original. A \u201cnew, wild take\u201d on the menu is promised; the rare Southern Thai dishes that made Ugly Baby one of NYC\u2019s most exciting kitchens remain the draw.';
    ubUpdated = true;
  }
  console.log('NYC: Ugly Baby updated=' + ubUpdated);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
