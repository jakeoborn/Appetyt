#!/usr/bin/env node
// Add 6 high-profile Chicago restaurants surfaced by the best-of
// navigation audit as missing from CHICAGO_DATA. Milk Room was
// replaced inline in the best-of list (it's primarily a cocktail
// bar, was miscategorized as brunch, and has been transitional /
// sporadic hours per their own IG).
//
// Chicago IG convention in data: no "@" prefix.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const CHICAGO_DATA');
const a = html.indexOf('[', s);
let d = 0, e = a;
for (let i = a; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
}
const before = html.slice(0, a);
const after = html.slice(e);
const arr = JSON.parse(html.slice(a, e));
const start = arr.length;
const maxId = Math.max(...arr.map(r => r.id));
let nextId = maxId + 1;

const adds = [
  {
    id: nextId++,
    name: 'Art of Pizza',
    cuisine: 'Pizza / Deep Dish',
    neighborhood: 'Lakeview',
    score: 87,
    price: 2,
    tags: ['Pizza', 'Deep Dish', 'Local Favorites', 'Casual'],
    indicators: [], hh: '', reservation: 'Walk-in', awards: '',
    description: "Lakeview deep-dish specialist that the Chicago Tribune has named the city's #1. Hefty, stuffed, caramelized crust — a purist destination with far less tourist baggage than the Loop chains.",
    dishes: ['Deep Dish by the Slice', 'Stuffed Pizza', 'Thin Crust', 'Pasta'],
    address: '3033 N Ashland Ave, Chicago, IL 60657',
    lat: 41.935, lng: -87.669,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: 'artofpizzachicago', website: 'http://www.artofpizzachicago.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: "Bartoli's Pizzeria",
    cuisine: 'Pizza / Deep Dish',
    neighborhood: 'Lakeview',
    score: 87,
    price: 2,
    tags: ['Pizza', 'Deep Dish', 'Casual', 'Local Favorites'],
    indicators: [], hh: '', reservation: 'Walk-in', awards: '',
    description: "Roscoe Village deep-dish destination rooted in a family recipe from Chicago's old Gonnella Brothers Pizzeria. The signature Quattro Carni is the deep-dish pilgrimage.",
    dishes: ['Quattro Carni Deep Dish', 'Spinach Pie', 'Thin Crust', 'Italian Salad'],
    address: '1955 W Addison St, Chicago, IL 60613',
    lat: 41.947, lng: -87.677,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: "Bartoli's",
    instagram: 'bartolispizzeria', website: 'https://www.bartolispizzeria.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Chicago Cut Steakhouse',
    cuisine: 'Steakhouse',
    neighborhood: 'River North',
    score: 90,
    price: 4,
    tags: ['Steakhouse', 'Date Night', 'Power Lunch', 'River Views', 'Critics Pick'],
    indicators: [], hh: '', reservation: 'OpenTable', awards: '',
    description: "River-front steakhouse with dry-aged USDA Prime cut in-house and a wall of windows facing the Chicago River. Business-lunch and celebration mainstay, heavy wine program, deep cocktail list.",
    dishes: ['Dry-Aged Ribeye', 'Bone-In Filet', 'Wedge Salad', 'Hash Browns'],
    address: '300 N LaSalle Dr, Chicago, IL 60654',
    lat: 41.887, lng: -87.632,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: 'chicagocut', website: 'https://www.chicagocutsteakhouse.com',
    reserveUrl: '', menuUrl: '', res_tier: 4, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Sparrow',
    cuisine: 'Cocktail Bar',
    neighborhood: 'Gold Coast',
    score: 89,
    price: 3,
    tags: ['Cocktails', 'Date Night', 'Bar', 'Late Night'],
    indicators: [], hh: '', reservation: 'Walk-in', awards: '',
    description: "Gold Coast tropical cocktail lounge from Footman Hospitality with a painted tin ceiling, velvet seating, and a rum-and-tiki-leaning menu that still keeps martini-pedigree glassware on its shelves.",
    dishes: ['Tiki Flights', 'Classic Daiquiri', 'Martini', 'Small Plates'],
    address: '12 W Elm St, Chicago, IL 60610',
    lat: 41.905, lng: -87.629,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: 'Footman Hospitality',
    instagram: 'sparrowchicago', website: 'https://www.sparrowchicago.com',
    reserveUrl: '', menuUrl: '', res_tier: 2, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Ann Sather',
    cuisine: 'Swedish / American Diner',
    neighborhood: 'Lakeview',
    score: 87,
    price: 2,
    tags: ['Brunch', 'Breakfast', 'Local Favorites', 'Family', 'Iconic'],
    indicators: [], hh: '', reservation: 'Walk-in', awards: '',
    description: "Swedish-American diner institution since 1945, anchored by the legendary cinnamon rolls and Belmont-Avenue staff photography. Breakfast on Sunday is part of Chicago's civic furniture.",
    dishes: ['Famous Cinnamon Rolls', 'Swedish Pancakes', 'Lingonberry Crepes', 'Swedish Meatballs'],
    address: '909 W Belmont Ave, Chicago, IL 60657',
    lat: 41.939, lng: -87.65,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: "Ann Sather",
    instagram: 'annsatherchicago', website: 'http://www.annsather.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Kanela Breakfast Club',
    cuisine: 'Breakfast / Greek-American',
    neighborhood: 'Andersonville',
    score: 86,
    price: 2,
    tags: ['Brunch', 'Breakfast', 'Local Favorites', 'Casual'],
    indicators: [], hh: '', reservation: 'Walk-in', awards: '',
    description: "Greek-American breakfast chain rooted in Chicago, with a short-stack-forward menu and a Nutella-banana French toast that feels like the calling card. Multiple city locations — Andersonville is the anchor.",
    dishes: ['Nutella Banana French Toast', 'Red Velvet Pancakes', 'Greek Omelet', 'Loukoumades'],
    address: '5413 N Clark St, Chicago, IL 60640',
    lat: 41.9805, lng: -87.6682,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: 'Kanela Breakfast Club',
    instagram: 'kanelabreakfastclub', website: 'https://kanelabreakfastclub.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
];

const final = [...arr, ...adds];
console.log(`Added (${adds.length}):`, adds.map(a => `${a.id} ${a.name}`));
console.log(`CHICAGO count: ${start} → ${final.length}`);
html = before + JSON.stringify(final) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');
