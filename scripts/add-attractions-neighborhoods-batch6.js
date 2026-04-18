#!/usr/bin/env node
// Per-neighborhood attractions gap-fill — batch 6.
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
    id: o.id, name: o.name, phone: '', cuisine: o.cuisine,
    neighborhood: o.neighborhood, score: o.score, price: o.price || 1,
    tags: o.tags, indicators: [], hh: '', reservation: 'walk-in',
    awards: '', description: o.description, dishes: [],
    address: o.address, hours: '', lat: o.lat, lng: o.lng,
    bestOf: [], group: '', instagram: '', website: o.website || '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 0,
    verified: true, photoUrl: '',
  };
}

// --- DALLAS (Addison) ---
{
  const { a, e, arr } = readBlock(html, 'DALLAS_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Addison Circle Park',
      cuisine: 'Park',
      neighborhood: 'Addison',
      score: 85,
      tags: ['Park', 'Tourist Attraction', 'Landmark', 'Outdoor', 'Family Friendly'],
      description: '10-acre urban park anchoring downtown Addison. Water gardens, public sculpture, and the host site of Kaboom Town (one of the largest Fourth-of-July fireworks shows in the country) and Taste Addison.',
      address: '4970 Addison Cir, Addison, TX 75001',
      lat: 32.9621,
      lng: -96.8283,
    }),
    entry({
      id: maxId + 2,
      name: 'Cavanaugh Flight Museum',
      cuisine: 'Museum',
      neighborhood: 'Addison',
      score: 84,
      tags: ['Museum', 'Landmark', 'Historic', 'Tourist Attraction', 'Family Friendly'],
      description: 'Private aviation museum at Addison Airport with a collection of airworthy World War II and Vietnam-era aircraft. Hands-on cockpit tours and annual air shows.',
      address: '4572 Claire Chennault Dr, Addison, TX 75001',
      lat: 32.9687,
      lng: -96.8385,
      phone: '(972) 380-8800',
      website: 'https://cavflight.org',
    }),
  ];
  arr.push(...adds);
  console.log('DALLAS: +' + adds.length + ' (Addison). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- HOUSTON (EaDo) ---
{
  const { a, e, arr } = readBlock(html, 'HOUSTON_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Shell Energy Stadium',
      cuisine: 'Stadium / Landmark',
      neighborhood: 'EaDo',
      score: 88,
      tags: ['Landmark', 'Tourist Attraction', 'Entertainment', 'Iconic', 'Family Friendly'],
      description: '22,000-seat soccer-specific stadium in East Downtown, home to the Houston Dynamo (MLS) and Houston Dash (NWSL). Opened 2012; the orange seats and skyline backdrop make it one of MLS\u2019s most-photographed venues.',
      address: '2200 Texas Ave, Houston, TX 77003',
      lat: 29.7524,
      lng: -95.3524,
      phone: '(713) 547-3000',
      website: 'https://www.houstondynamofc.com/shell-energy-stadium',
    }),
  ];
  arr.push(...adds);
  console.log('HOUSTON: +' + adds.length + ' (EaDo). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- NYC (Nolita) ---
{
  const { a, e, arr } = readBlock(html, 'NYC_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Basilica of St. Patrick\u2019s Old Cathedral',
      cuisine: 'Landmark / Historic Site',
      neighborhood: 'Nolita',
      score: 87,
      tags: ['Landmark', 'Historic', 'Tourist Attraction', 'Religious'],
      description: 'The original St. Patrick\u2019s Cathedral, completed 1815 \u2014 the seat of the Archdiocese of New York before the Fifth Avenue cathedral opened. Gothic Revival exterior, 200-year-old cemetery, and the catacomb tour that inspired scenes in The Godfather.',
      address: '263 Mulberry St, New York, NY 10012',
      lat: 40.7235,
      lng: -73.9951,
      phone: '(212) 226-8075',
      website: 'https://oldcathedral.org',
    }),
    entry({
      id: maxId + 2,
      name: 'Elizabeth Street Garden',
      cuisine: 'Park / Sculpture Garden',
      neighborhood: 'Nolita',
      score: 85,
      tags: ['Park', 'Landmark', 'Tourist Attraction', 'Arts', 'Outdoor'],
      description: 'Volunteer-run sculpture and community garden tucked between Prince and Spring Streets. Classical statuary, greenery, and a beloved community gathering spot \u2014 fought to stay open through repeated development attempts.',
      address: '209 Elizabeth St, New York, NY 10012',
      lat: 40.7227,
      lng: -73.9948,
      website: 'https://www.elizabethstreetgarden.com',
    }),
  ];
  arr.push(...adds);
  console.log('NYC: +' + adds.length + ' (Nolita). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// --- CHICAGO (Bucktown) ---
{
  const { a, e, arr } = readBlock(html, 'CHICAGO_DATA');
  const maxId = Math.max(...arr.map(r => r.id || 0));
  const before = arr.length;
  const adds = [
    entry({
      id: maxId + 1,
      name: 'Churchill Field Park',
      cuisine: 'Park',
      neighborhood: 'Bucktown',
      score: 80,
      tags: ['Park', 'Outdoor', 'Family Friendly'],
      description: 'Bucktown\u2019s beloved neighborhood park and dog park on Damen Avenue, directly beneath The 606 trail\u2019s busiest access point. Community events, a playground, and the gateway to Wicker Park.',
      address: '1825 N Damen Ave, Chicago, IL 60647',
      lat: 41.9144,
      lng: -87.6775,
    }),
  ];
  arr.push(...adds);
  console.log('CHICAGO: +' + adds.length + ' (Bucktown). ' + before + ' -> ' + arr.length);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
