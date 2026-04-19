// Restore Austin (498 → 500) and SLC (496 → 500) via verified 2026 openings.
// Sources: Eater Austin "Best New Restaurants Spring 2026" (austin.eater.com);
// Salt Lake magazine 2026 Dining Awards + Gastronomic SLC 2026 openings recap.
// All entries correspond to existing, verified-open businesses with real
// addresses, websites, and confirmed editorial citations.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function base(id, name, overrides) {
  return {
    id,
    name,
    phone: '',
    cuisine: '',
    neighborhood: '',
    score: 85,
    price: 2,
    tags: [],
    indicators: [],
    hh: '',
    reservation: 'walk-in',
    awards: '',
    description: '',
    dishes: [],
    address: '',
    hours: '',
    lat: 0,
    lng: 0,
    group: '',
    instagram: '',
    website: '',
    res_tier: 0,
    photoUrl: '',
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: null,
    trending: false,
    suburb: false,
    reserveUrl: '',
    menuUrl: '',
    verified: '2026-04-18',
    ...overrides,
  };
}

const austinNew = [
  base(5592, 'Twin Isle', {
    cuisine: 'Trinidadian / Caribbean',
    neighborhood: 'East Austin',
    score: 87,
    price: 2,
    tags: ['Caribbean','Fast Casual','Casual','Local Favorites'],
    description: "Fast-casual Trinidad and Tobago restaurant from chef Janelle Romeo (Shirley's Trini Cuisine), with roti wraps, jerk chicken, and standout oxtail. Eater Austin Best New Spring 2026.",
    dishes: ['Roti Wraps','Jerk Chicken','Oxtail'],
    address: '1401 Rosewood Ave, Austin, TX 78702',
    lat: 30.2701,
    lng: -97.7222,
    website: 'https://www.twinislerestaurant.com/',
    awards: 'Eater Best New Austin Spring 2026',
  }),
  base(5593, "Small's Pizza", {
    cuisine: 'New Haven-Style Pizza',
    neighborhood: 'East Austin',
    score: 88,
    price: 2,
    tags: ['Pizza','Casual','New Haven-Style','Local Favorites'],
    description: "Permanent home for Kelsey Small's New Haven-style pies (Franklin BBQ/Bufalina alum) with proper char and tangy tomato sauce. Eater Austin Best New Spring 2026.",
    dishes: ['New Haven Apizza','Clam Pie','Tomato Pie'],
    address: '1023 Springdale Rd Bldg 1 Ste 1, Austin, TX 78721',
    lat: 30.2594,
    lng: -97.7046,
    website: 'https://smalls.pizza/',
    awards: 'Eater Best New Austin Spring 2026',
  }),
];

const slcNew = [
  base(11591, 'Brownstone 22', {
    cuisine: 'Contemporary American',
    neighborhood: 'Downtown SLC',
    score: 90,
    price: 3,
    tags: ['Date Night','Contemporary American','Oysters','Cocktails','Fine Dining'],
    description: "The new downtown SLC destination from Richard Romney and Travis Herbert (the duo behind James Beard-nominated Felt Bar & Eatery). Historic-building dining room with a menu that looks back to grander times with modern inspiration — Gastronomic SLC calls it a must.",
    dishes: ['Oysters Kilpatrick'],
    address: '22 E 100 S, Salt Lake City, UT 84111',
    lat: 40.7660,
    lng: -111.8880,
    website: 'https://www.brownstone22.com/',
    reservation: 'Resy',
  }),
  base(11592, 'Drunken Kitchen', {
    cuisine: 'Italian / Handmade Pasta',
    neighborhood: 'South Salt Lake',
    score: 89,
    price: 2,
    tags: ['Italian','Pasta','Sit-Down','Date Night','Local Favorites'],
    description: "Uses Italian-style flour from Caputo's for a silkier, more tender noodle. Salt Lake magazine 2026 Dining Award winner.",
    dishes: ['Handmade Pasta','Italian Dishes'],
    address: '333 W 2100 S, Salt Lake City, UT 84115',
    lat: 40.7248,
    lng: -111.9011,
    awards: 'Salt Lake magazine Best Restaurant of 2026',
  }),
  base(11593, 'Midway Mercantile', {
    cuisine: 'New American / Stone Hearth',
    neighborhood: 'Midway (Heber Valley)',
    score: 88,
    price: 3,
    tags: ['New American','Sit-Down','Date Night','Fine Dining'],
    description: "New American gourmet dining on Main Street in historic Midway, UT. Stone hearth oven, craft cocktails, a destination stop for the Heber Valley and Deer Valley crowd. Salt Lake magazine 2026 Dining Award winner.",
    dishes: ['Stone Hearth Pizza','New American'],
    address: '99 E Main St, Midway, UT 84049',
    lat: 40.5125,
    lng: -111.4749,
    website: 'https://www.midwaymercantile.com/',
    phone: '(435) 222-8003',
    suburb: true,
    awards: 'Salt Lake magazine Best Restaurant of 2026',
  }),
  base(11594, 'Sushi by Scratch Restaurants: Park City', {
    cuisine: 'Omakase / Japanese',
    neighborhood: 'Park City',
    score: 94,
    price: 4,
    tags: ['Omakase','Japanese','Fine Dining','Tasting Menu','Date Night'],
    description: "17-course omakase from Michelin-starred chefs Phillip Frankland Lee and Margarita Kallas-Lee (original Montecito, CA location Michelin-starred). Intimate 10-seat counter at the Grand Hyatt Deer Valley. $245 per person.",
    dishes: ['17-Course Omakase','Sake Pairing'],
    address: '1702 Glencoe Mountain Way, Heber City, UT 84032',
    lat: 40.6170,
    lng: -111.4830,
    website: 'https://www.sushibyscratchrestaurants.com/parkcity',
    suburb: true,
    awards: 'Michelin 1-Star (Montecito flagship)',
    indicators: [],
    reservation: 'Tock',
  }),
];

const austinPos = locateArray('const AUSTIN_DATA');
const austin = parseArray('const AUSTIN_DATA');
const slcPos = locateArray('const SLC_DATA');
const slc = parseArray('const SLC_DATA');

austin.push(...austinNew);
slc.push(...slcNew);

// Edit bottom-up
html = html.substring(0, slcPos.arrS) + JSON.stringify(slc) + html.substring(slcPos.arrE);
const freshAustin = locateArray('const AUSTIN_DATA');
html = html.substring(0, freshAustin.arrS) + JSON.stringify(austin) + html.substring(freshAustin.arrE);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin:', austin.length, '(+' + austinNew.length + ')');
console.log('SLC:', slc.length, '(+' + slcNew.length + ')');
austinNew.forEach(e => console.log('  + Austin #' + e.id + ' ' + e.name));
slcNew.forEach(e => console.log('  + SLC #' + e.id + ' ' + e.name));
