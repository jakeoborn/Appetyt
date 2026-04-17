#!/usr/bin/env node
// Add 7 high-profile SLC restaurants surfaced by the best-of navigation
// audit as missing from SLC_DATA. All entries verified via
// firecrawl_search. Once added, the corresponding best-of arrows wire up
// automatically via the normalized-name matcher.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const s = html.indexOf('const SLC_DATA');
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
    name: 'Powder',
    cuisine: 'New American / Mountain Cuisine',
    neighborhood: 'Park City',
    score: 92,
    price: 4,
    tags: ['Fine Dining', 'Date Night', 'Hotel Restaurant', 'Scenic Views', 'Critics Pick'],
    indicators: [],
    hh: '', reservation: 'OpenTable', awards: '',
    description: "Signature restaurant at Waldorf Astoria Park City with elevated modern American mountain cuisine, wall-to-wall windows looking out over the Canyons, and a meticulous wine program. A staple of the Sundance Film Festival celebrity-dinner circuit.",
    dishes: ['Seasonal Tasting Menu', 'A5 Wagyu', 'Utah Trout', 'Market Crudo'],
    address: '2100 Frostwood Blvd, Park City, UT 84098',
    lat: 40.685, lng: -111.555,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: 'Waldorf Astoria',
    instagram: '@waldorfastoriaparkcity', website: 'https://www.hilton.com/en/hotels/slcpcwa-waldorf-astoria-park-city/dining/powder/',
    reserveUrl: '', menuUrl: '', res_tier: 4, suburb: true,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Ichiban Sushi',
    cuisine: 'Japanese / Sushi',
    neighborhood: 'South Salt Lake',
    score: 86,
    price: 2,
    tags: ['Sushi', 'Japanese', 'Local Favorites', 'Casual'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Longtime neighborhood sushi favorite on State Street in South Salt Lake. Generous rolls, approachable nigiri, and a reliable weeknight dinner spot that locals have kept coming back to for years.",
    dishes: ['Ichiban Roll', 'Rainbow Roll', 'Nigiri Flight', 'Tempura'],
    address: '3424 S State St, Salt Lake City, UT 84115',
    lat: 40.6988, lng: -111.8881,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@ichibansushislc', website: 'https://www.ichibansushislc.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Itto Sushi',
    cuisine: 'Japanese / Sushi',
    neighborhood: 'Downtown SLC',
    score: 86,
    price: 2,
    tags: ['Sushi', 'Japanese', 'Lunch', 'Casual', 'Local Favorites'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Downtown Japanese spot with a short sushi menu that locals rate above the price tag. Lunch specials are a bargain, and the weekday 11 AM opening makes it a go-to for a quick sit-down downtown bite.",
    dishes: ['Chef\u2019s Nigiri', 'Rainbow Roll', 'Spicy Tuna Roll', 'Lunch Bento'],
    address: '12 W Broadway, Salt Lake City, UT 84101',
    lat: 40.7608, lng: -111.892,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@ittoutah', website: 'https://ittoutah.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: "Finn's Cafe",
    cuisine: 'Norwegian / Breakfast',
    neighborhood: 'Sugar House',
    score: 87,
    price: 2,
    tags: ['Brunch', 'Breakfast', 'Local Favorites', 'Family'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Sugar House neighborhood institution with warm Norwegian floral decor and a tight, beloved breakfast-and-brunch lineup. Cash-tight service, but the aebleskivers and Scandinavian pancakes keep the dining room full on weekends.",
    dishes: ['Aebleskivers', 'Norwegian Pancakes', 'Benedict', 'Huevos Rancheros'],
    address: '1624 S 1100 E, Salt Lake City, UT 84105',
    lat: 40.738, lng: -111.862,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@finnscafeslc', website: 'https://www.finnscafe.net',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Post Office Place',
    cuisine: 'Cocktail Bar / Southeast Asian',
    neighborhood: 'Downtown SLC',
    score: 89,
    price: 3,
    tags: ['Cocktails', 'Date Night', 'Bar', 'Critics Pick'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Sister bar to Takashi tucked into the old post office building on Market Street, serving world-trip cocktails and Southeast Asian small plates. One of the most reliably well-made cocktail programs in Salt Lake.",
    dishes: ['Thai Fried Chicken', 'Bao Buns', 'Beef Tartare', 'Signature Cocktails'],
    address: '16 W Market St, Salt Lake City, UT 84101',
    lat: 40.7604, lng: -111.8915,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@postofficeplace', website: 'https://www.popslc.com',
    reserveUrl: '', menuUrl: '', res_tier: 2, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'Beer Bar',
    cuisine: 'Bar / Brats',
    neighborhood: 'Downtown SLC',
    score: 86,
    price: 1,
    tags: ['Bar', 'Local Favorites', 'Late Night', 'Casual'],
    indicators: [],
    hh: '', reservation: 'Walk-in', awards: '',
    description: "Downtown beer hall from the Bar X team next door, with a 140+ craft beer list and a brat-and-poutine menu. Long wooden benches, patio that fills up after 6, and one of the most democratic downtown SLC drinking rooms.",
    dishes: ['Brat Flight', 'Poutine', 'Pretzel', 'Local Utah Drafts'],
    address: '161 E 200 S, Salt Lake City, UT 84111',
    lat: 40.7643, lng: -111.885,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '',
    instagram: '@beerbarslc', website: 'https://beerbarslc.com',
    reserveUrl: '', menuUrl: '', res_tier: 1, suburb: false,
    verified: '2026-04-17',
  },
  {
    id: nextId++,
    name: 'The Farm at Canyons',
    cuisine: 'New American / Bistro',
    neighborhood: 'Park City',
    score: 87,
    price: 3,
    tags: ['Apres Ski', 'Date Night', 'Scenic Views', 'Hotel Restaurant', 'Local Favorites'],
    indicators: [],
    hh: '', reservation: 'OpenTable', awards: '',
    description: "Bistro-style dining at the base of the Red Pine Gondola in Canyons Village, showcasing modern American cuisine and a robust Utah-friendly wine and craft beer list. The go-to sit-down meal on the Canyons side of Park City Mountain.",
    dishes: ['Bison Short Rib', 'Harvest Salad', 'Brown Butter Cod', 'Flatbreads'],
    address: '4000 Canyons Resort Dr, Park City, UT 84098',
    lat: 40.685, lng: -111.555,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: 'Park City Mountain Resort',
    instagram: '@parkcitymtn', website: 'https://www.parkcitymountain.com/explore-the-resort/during-your-stay/dining/the-farm-restaurant.aspx',
    reserveUrl: '', menuUrl: '', res_tier: 3, suburb: true,
    verified: '2026-04-17',
  },
];

const final = [...arr, ...adds];

console.log(`Added (${adds.length}):`, adds.map(a => `${a.id} ${a.name}`));
console.log(`SLC count: ${start} → ${final.length}`);

html = before + JSON.stringify(final) + after;
fs.writeFileSync(htmlPath, html);
console.log('index.html written.');
