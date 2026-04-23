#!/usr/bin/env node
// Add 7 missing NYC cards surfaced by TableDrop audit (2026-04-23).
// All addresses verified via Nominatim; score/price/tags from venue profiles.
// Idempotent: skips an id if already present in NYC_DATA.
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', '..', 'index.html');

const NEW_CARDS = [
  {
    id: 1987,
    name: "Le Café Louis Vuitton",
    phone: "(212) 581-2300",
    cuisine: "French Café",
    neighborhood: "Midtown East",
    score: 87,
    price: 4,
    tags: ["Brunch", "Dessert", "Date Night", "Scene", "Luxury"],
    indicators: ["trending"],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Luxury French café on the fourth floor of Louis Vuitton's 57th Street flagship. Pastry chef Maxime Frédéric (formerly of Cheval Blanc Paris) leads the kitchen; the menu spans brunch, afternoon tea, and French-flair snacking in a couture-styled dining room.",
    dishes: ["Afternoon Tea", "Pastries", "Brunch"],
    address: "6 E 57th St, Floor 4, New York, NY 10022",
    hours: "",
    lat: 40.7624493,
    lng: -73.9734192,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: true,
    group: "",
    instagram: "",
    website: "https://lecafelvnyc.com",
    suburb: false,
    reserveUrl: "https://resy.com/cities/ny/le-cafe-louis-vuitton",
    bookingInfo: "Opens 28 days ahead at midnight ET on Resy.",
    menuUrl: "",
    res_tier: 4,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1988,
    name: "Rezdôra",
    phone: "(646) 692-9095",
    cuisine: "Modern Italian",
    neighborhood: "Flatiron / NoMad",
    score: 94,
    price: 3,
    tags: ["Italian", "Pasta", "Tasting Menu", "Michelin", "Date Night"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "Michelin Star (2021-2024), NYT 3-Star",
    description: "Michelin-starred Emilia-Romagna pasta destination from Chef Stefano Secchi and partner David Switzer. Fresh pasta made daily in an open kitchen; the \"Nine Nonnas\" tasting menu traverses the grandmother recipes of the region.",
    dishes: ["Tortellini en Brodo", "Nine Nonnas Tasting Menu", "Cappelletti"],
    address: "27 E 20th St, New York, NY 10003",
    hours: "",
    lat: 40.7390943,
    lng: -73.9893691,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "@rezdoranyc",
    website: "https://www.rezdora.nyc",
    suburb: false,
    reserveUrl: "https://resy.com/cities/ny/rezdora",
    bookingInfo: "Opens 30 days ahead at midnight ET on Resy. Midnight releases go fast.",
    menuUrl: "",
    res_tier: 5,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1989,
    name: "Kisa",
    phone: "(646) 866-8622",
    cuisine: "Korean",
    neighborhood: "Lower East Side",
    score: 88,
    price: 2,
    tags: ["Korean", "Casual", "Minimalist"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Minimalist Korean diner on Allen Street channeling the kisa sikdang tradition — the taxi-driver-focused canteens of Korea. Compact menu of daily banchan-anchored sets above the F train.",
    dishes: ["Bulgogi", "Soondubu Jjigae", "Bibim Guksu"],
    address: "205 Allen St, New York, NY 10002",
    hours: "",
    lat: 40.722836,
    lng: -73.9889877,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: true,
    group: "",
    instagram: "",
    website: "https://www.kisaus.com",
    suburb: false,
    reserveUrl: "https://resy.com/cities/ny/kisa",
    bookingInfo: "",
    menuUrl: "",
    res_tier: 4,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1990,
    name: "Jean's",
    phone: "(570) 867-0517",
    cuisine: "New American",
    neighborhood: "NoHo",
    score: 85,
    price: 3,
    tags: ["New American", "Late Night", "Scene", "Date Night", "Cocktails"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Late-night New American bistro on Lafayette, open until 4am Thursday through Saturday. Scene-forward NoHo newcomer with cocktails that keep the room running past midnight.",
    dishes: ["Seasonal Plates", "Cocktails"],
    address: "415 Lafayette St, New York, NY 10003",
    hours: "Tue-Wed 5:30pm-10pm; Thu-Sat 5:30pm-4am",
    lat: 40.7285059,
    lng: -73.9922411,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "",
    website: "https://www.jeans.nyc",
    suburb: false,
    reserveUrl: "https://resy.com/cities/new-york-ny/venues/jeans",
    bookingInfo: "",
    menuUrl: "",
    res_tier: 3,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1991,
    name: "Ramen By Ra",
    phone: "",
    cuisine: "Ramen",
    neighborhood: "East Village",
    score: 83,
    price: 2,
    tags: ["Ramen", "Japanese", "Casual"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Black and female-owned ramen shop on East 1st Street. Asa-ramen tradition (Japanese morning ramen) with Southern culinary influences; two-week reservation blocks released twice monthly.",
    dishes: ["Shoyu Ramen", "Tonkotsu Ramen"],
    address: "70 E 1st St, New York, NY 10003",
    hours: "",
    lat: 40.7235541,
    lng: -73.9887978,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "",
    website: "https://www.ramenbyra.com",
    suburb: false,
    reserveUrl: "https://resy.com/cities/new-york-ny/venues/ramen-by-ra",
    bookingInfo: "Two-week blocks released twice monthly on Resy.",
    menuUrl: "",
    res_tier: 3,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1992,
    name: "I Cavallini",
    phone: "",
    cuisine: "Italian",
    neighborhood: "Williamsburg",
    score: 88,
    price: 3,
    tags: ["Italian", "Natural Wine", "Wine Bar", "Date Night"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Italian small-plates and natural wine bar from the team behind Michelin-starred, James Beard-winning Four Horsemen — located directly across Grand Street from the original. Cozy Williamsburg counterpoint to its wine-bar sibling.",
    dishes: ["Italian Small Plates", "Natural Wine"],
    address: "284 Grand St, Brooklyn, NY 11211",
    hours: "",
    lat: 40.7129501,
    lng: -73.9578552,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: true,
    group: "The Four Horsemen",
    instagram: "",
    website: "https://www.icavallinibk.com",
    suburb: false,
    reserveUrl: "https://resy.com/cities/new-york-ny/venues/i-cavallini",
    bookingInfo: "",
    menuUrl: "",
    res_tier: 4,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
  {
    id: 1993,
    name: "Theodora",
    phone: "(929) 692-6360",
    cuisine: "Mediterranean",
    neighborhood: "Fort Greene / Clinton Hill",
    score: 88,
    price: 3,
    tags: ["Mediterranean", "Middle Eastern", "Date Night", "Brunch"],
    indicators: [],
    hh: "",
    reservation: "Resy",
    awards: "",
    description: "Mediterranean restaurant on Greene Avenue from Chef/Owner Tomer Blechman — same team as the beloved Miss Ada down the street. Seasonal mezze, wood-fire cooking, and a polished neighborhood-restaurant feel.",
    dishes: ["Hummus", "Wood-Fired Mezze", "Fish of the Day"],
    address: "7 Greene Ave, Brooklyn, NY 11238",
    hours: "",
    lat: 40.6860012,
    lng: -73.9730376,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    group: "",
    instagram: "",
    website: "https://www.theodoranyc.com",
    suburb: false,
    reserveUrl: "https://resy.com/cities/new-york-ny/venues/theodora",
    bookingInfo: "",
    menuUrl: "",
    res_tier: 4,
    photos: [],
    photoUrl: "",
    verified: "2026-04-23"
  },
];

let html = fs.readFileSync(HTML_PATH, 'utf8');

let nycStart = html.indexOf('const NYC_DATA=');
if (nycStart < 0) nycStart = html.indexOf('const NYC_DATA =');
if (nycStart < 0) throw new Error('NYC_DATA not found');
const arrOpen = html.indexOf('[', nycStart);
let depth = 0, arrClose = arrOpen;
for (let i = arrOpen; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrClose = i + 1; break; } }
}

const arrText = html.slice(arrOpen, arrClose);

// Idempotency: don't re-insert cards whose id is already in NYC_DATA.
const alreadyIn = new Set();
for (const c of NEW_CARDS) {
  const re = new RegExp('(?:"id"|\\bid)\\s*:\\s*' + c.id + '(?=[,}\\s])');
  if (re.test(arrText)) alreadyIn.add(c.id);
}
const cardsToInsert = NEW_CARDS.filter(c => !alreadyIn.has(c.id));

console.log('Inserting', cardsToInsert.length, 'of', NEW_CARDS.length, 'cards (skipping', [...alreadyIn].join(',') || 'none', 'already present)');

if (!cardsToInsert.length) {
  console.log('Nothing to do.');
  process.exit(0);
}

// Serialize each card as a JS object literal, matching the existing format.
function serialize(c) {
  return JSON.stringify(c);
}

const serialized = cardsToInsert.map(serialize).join(',\n');

// Insert before the closing `]` of NYC_DATA. Need to preserve last existing card's
// trailing content. Find last `}` inside the array and insert `,<serialized>` after it.
const lastCloseBrace = arrText.lastIndexOf('}');
if (lastCloseBrace < 0) throw new Error('Could not find last card close brace');

const before = arrText.slice(0, lastCloseBrace + 1);
const after  = arrText.slice(lastCloseBrace + 1); // typically just `]`
const newArrText = before + ',\n' + serialized + after;

const newHtml = html.slice(0, arrOpen) + newArrText + html.slice(arrClose);
fs.writeFileSync(HTML_PATH, newHtml);
console.log('Wrote index.html (+' + (newHtml.length - html.length) + ' bytes)');
console.log('Inserted ids:', cardsToInsert.map(c => c.id).join(','));
