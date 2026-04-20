// Append 10 additional LA hotels to HOTEL_DATA['los angeles'] in index.html.
// Idempotent: skips entries whose name already exists.
const fs = require('fs');
const vm = require('vm');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

// Locate the HOTEL_DATA block and its "los angeles" array inside.
const declIdx = html.indexOf('const HOTEL_DATA =');
if (declIdx < 0) { console.error('HOTEL_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}

// Parse existing HOTEL_DATA to find current LA id set.
function extract(name, src) {
  const idx = src.indexOf('const ' + name + ' =');
  let i = src.indexOf('{', idx);
  let depth = 0, end = i;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = j + 1; break; } }
  }
  return 'var ' + name + ' = ' + src.slice(i, end) + ';';
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(extract('HOTEL_DATA', html), ctx);
const existing = ctx.HOTEL_DATA['los angeles'] || [];
const existingNames = new Set(existing.map(h => h.name));
const maxId = existing.reduce((m, h) => Math.max(m, h.id || 0), 0);

const newHotels = [
  {
    name: 'The Peninsula Beverly Hills',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Forbes Five-Star restraint on Little Santa Monica.',
    neighborhood: 'Beverly Hills',
    address: '9882 S Santa Monica Blvd, Beverly Hills CA 90212',
    lat: 34.0679, lng: -118.4083,
    instagram: '@peninsulabh',
    website: 'https://www.peninsula.com/en/beverly-hills/5-star-luxury-hotel-beverly-hills',
    priceRange: '$900-$3,500+/night',
    score: 97,
    awards: 'Forbes Five-Star | AAA Five Diamond',
    about: 'The only California hotel to hold both Forbes Five-Star and AAA Five Diamond every year since opening (1991). Rooftop pool with city views, the Roof Garden restaurant, and the only Rolls-Royce house car fleet in Los Angeles.',
    highlights: [
      { icon: '\uD83C\uDF79', label: 'The Bar', note: 'Classic dark-wood power bar off the lobby' },
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'Private cabanas, 60s supper-club energy' },
      { icon: '\uD83C\uDFAF', label: 'Afternoon Tea', note: 'The Living Room — a pre-show ritual' }
    ],
    insiderTips: [
      'Request a Deluxe Spa Suite — private balcony facing the hills',
      'The pool deck serves lunch — book by 10 AM for a cabana',
      'House Rolls-Royce makes short Beverly Hills trips complimentary'
    ],
    bestFor: ['Special Occasion', 'Power Lunch', 'Afternoon Tea', 'Honeymoon']
  },
  {
    name: 'Waldorf Astoria Beverly Hills',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Art Deco tower with the best rooftop pool in Beverly Hills.',
    neighborhood: 'Beverly Hills',
    address: '9850 Wilshire Blvd, Beverly Hills CA 90210',
    lat: 34.0666, lng: -118.4116,
    instagram: '@waldorfastoriabh',
    website: 'https://www.hilton.com/en/hotels/laxwawa-waldorf-astoria-beverly-hills/',
    priceRange: '$800-$3,500+/night',
    score: 95,
    awards: 'Forbes Five-Star | AAA Five Diamond',
    about: 'Contemporary Art Deco tower that opened at Wilshire and Santa Monica in 2017. 170 rooms, Jean-Georges Beverly Hills on property, and a 12th-floor rooftop pool looking north to the hills.',
    highlights: [
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'One of the only true rooftop pools in Beverly Hills' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Jean-Georges Beverly Hills', note: 'Jean-Georges Vongerichten on the ground floor' },
      { icon: '\uD83E\uDDD6', label: 'La Prairie Spa', note: 'Exclusive La Prairie spa menu' }
    ],
    insiderTips: [
      'Corner rooms face both Wilshire and Santa Monica — city-view upgrade',
      'Book the rooftop pool in the morning — sun ducks behind the tower by 3 PM',
      'Jean-Georges lunch is a quieter way in than dinner'
    ],
    bestFor: ['Special Occasion', 'Proposal', 'Power Dining', 'Rooftop']
  },
  {
    name: 'Four Seasons Los Angeles at Beverly Hills',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'The award-season bunker off Doheny.',
    neighborhood: 'Beverly Grove',
    address: '300 S Doheny Dr, Los Angeles CA 90048',
    lat: 34.0730, lng: -118.3892,
    instagram: '@fsbeverlywilshire',
    website: 'https://www.fourseasons.com/losangeles/',
    priceRange: '$700-$2,500+/night',
    score: 94,
    awards: 'Forbes Five-Star',
    about: 'The classic award-season hotel — studios book out floors during Oscar campaigns. Lush garden pool, Culina Ristorante, and a spa that\u2019s been a quiet industry favorite since 1987.',
    highlights: [
      { icon: '\uD83C\uDFC6', label: 'Awards Season HQ', note: 'Studios camp here during Oscar campaigns' },
      { icon: '\uD83C\uDFCA', label: 'Garden Pool', note: 'Cabanas tucked in a tropical courtyard' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Culina Ristorante', note: 'Italian power breakfast and lunch' }
    ],
    insiderTips: [
      'Request a Pool Cabana Suite for direct garden access',
      'Windows restaurant Sunday brunch is a quiet insider favorite',
      'Walk two blocks east for The Grove and Beverly Center'
    ],
    bestFor: ['Awards Season', 'Family', 'Business', 'Long Stay']
  },
  {
    name: 'Sunset Tower Hotel',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'The Tower Bar — where Vanity Fair Oscar night really happens.',
    neighborhood: 'West Hollywood',
    address: '8358 Sunset Blvd, West Hollywood CA 90069',
    lat: 34.0951, lng: -118.3721,
    instagram: '@sunsettowerhotel',
    website: 'https://www.sunsettowerhotel.com',
    priceRange: '$500-$1,800+/night',
    score: 93,
    awards: 'Vanity Fair Oscar Party host',
    about: 'The 1931 Art Deco tower on the Sunset Strip — Howard Hughes, John Wayne, Marilyn Monroe all had long stays. Jeff Klein\u2019s 2004 revival made it the most reservation-required Oscar-week spot in LA.',
    highlights: [
      { icon: '\uD83C\uDF78', label: 'The Tower Bar', note: 'Former Bugsy Siegel apartment; Vanity Fair Oscar Party spillover' },
      { icon: '\uD83C\uDFDB\uFE0F', label: '1931 Art Deco', note: 'Original Sunset Strip high-rise landmark' },
      { icon: '\uD83C\uDFCA', label: 'Pool Terrace', note: '15th-floor pool with city-to-ocean views' }
    ],
    insiderTips: [
      "Dimitri at the piano most nights — classic old-Hollywood soundtrack",
      'Tower Bar reservations open 2 weeks out at 10 AM sharp',
      'Corner 1-bedroom suites face the Hollywood Hills and downtown'
    ],
    bestFor: ['Date Night', 'Oscar Week', 'Celebrity Spotting', 'Historic Stay']
  },
  {
    name: 'The Hollywood Roosevelt',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'First Oscars host (1929) with a David Hockney pool.',
    neighborhood: 'Hollywood',
    address: '7000 Hollywood Blvd, Los Angeles CA 90028',
    lat: 34.1009, lng: -118.3418,
    instagram: '@thehollywoodroosevelt',
    website: 'https://www.thehollywoodroosevelt.com',
    priceRange: '$300-$900+/night',
    score: 90,
    awards: 'National Register of Historic Places',
    about: 'The 1927 Hollywood icon across from the Chinese Theatre that hosted the first-ever Academy Awards in 1929. Tropicana Pool painted by David Hockney, the Spare Room upstairs speakeasy, and a rooftop suite where Marilyn Monroe lived for two years.',
    highlights: [
      { icon: '\uD83C\uDFC6', label: 'First Oscars, 1929', note: 'Blossom Ballroom hosted the inaugural Academy Awards' },
      { icon: '\uD83C\uDFCA', label: 'Hockney Pool', note: 'David Hockney painted the bottom — sunset swim is iconic' },
      { icon: '\uD83C\uDFB3', label: 'The Spare Room', note: 'Upstairs speakeasy with vintage bowling alley' }
    ],
    insiderTips: [
      'Cabana Rooms open straight to the pool deck — loud at night',
      'Tropicana pool is where the original Gaga-Cooper "Shallow" party moments happened',
      '25 Degrees burger bar is the late-night reliable'
    ],
    bestFor: ['Historic Stay', 'Pool', 'Nightlife', 'Hollywood Landmark']
  },
  {
    name: 'Fairmont Miramar Hotel & Bungalows',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Ocean-view bungalows under a 100-year-old Moreton Bay fig.',
    neighborhood: 'Santa Monica',
    address: '101 Wilshire Blvd, Santa Monica CA 90401',
    lat: 34.0180, lng: -118.5016,
    instagram: '@miramarhotel',
    website: 'https://www.fairmont.com/santa-monica/',
    priceRange: '$450-$1,800+/night',
    score: 92,
    awards: 'Forbes Four-Star',
    about: 'Originally the 1921 mansion of railroad baron John P. Jones — since 1938, a hotel with Greta Garbo\u2019s bungalow still available. Oldest Moreton Bay fig in LA stands at the entrance. Bungalows, a Mansion Wing, and a Tower with ocean-view suites.',
    highlights: [
      { icon: '\uD83C\uDF33', label: '100-Year-Old Fig', note: 'Landmark Moreton Bay fig at the entrance' },
      { icon: '\uD83C\uDFE1', label: 'Private Bungalows', note: "Greta Garbo's bungalow is still bookable" },
      { icon: '\uD83C\uDF0A', label: 'Ocean-View Tower', note: 'Upper tower rooms face the Santa Monica Pier' }
    ],
    insiderTips: [
      'Bungalow 16 is the quietest — tucked behind the pool',
      'Bungalow Kitchen for Mediterranean on the terrace',
      'Two blocks from Santa Monica Pier and Third Street Promenade'
    ],
    bestFor: ['Beach', 'Bungalow', 'Historic Stay', 'Family']
  },
  {
    name: 'The Langham Huntington, Pasadena',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: "Old California at The Terrace — 23 acres and a Tiffany ceiling.",
    neighborhood: 'Pasadena',
    address: '1401 S Oak Knoll Ave, Pasadena CA 91106',
    lat: 34.1223, lng: -118.1338,
    instagram: '@langhampasadena',
    website: 'https://www.langhamhotels.com/en/the-langham/pasadena/',
    priceRange: '$400-$1,200+/night',
    score: 92,
    awards: 'Forbes Four-Star',
    about: 'A 23-acre 1907 estate tucked into residential Pasadena with a Tiffany stained-glass ceiling over the lobby staircase. The Terrace patio is one of the most under-the-radar special-occasion restaurants in greater LA.',
    highlights: [
      { icon: '\uD83D\uDC8E', label: 'Tiffany Ceiling', note: 'Original 1907 Tiffany stained-glass above the lobby stair' },
      { icon: '\uD83C\uDF33', label: '23-Acre Estate', note: 'Gardens, pool, tennis — quieter than Beverly Hills equivalents' },
      { icon: '\uD83C\uDF70', label: 'Afternoon Tea', note: 'The Tap Room tea service — a Pasadena ritual since the 1920s' }
    ],
    insiderTips: [
      'Cottage Suites have private gardens — best for a long weekend',
      'The Terrace brunch is one of LA\u2019s best-kept restaurant secrets',
      '15 minutes to the Huntington Library — stay here, visit there'
    ],
    bestFor: ['Quiet Escape', 'Tea', 'Family', 'Special Occasion']
  },
  {
    name: 'Hotel Figueroa',
    tier: 'Boutique', tierEmoji: '\uD83C\uDFA8',
    tagline: "1926 Spanish Colonial that was once a YWCA for women travelers.",
    neighborhood: 'Downtown LA / South Park',
    address: '939 S Figueroa St, Los Angeles CA 90015',
    lat: 34.0455, lng: -118.2641,
    instagram: '@hotelfigueroa',
    website: 'https://www.hotelfigueroa.com',
    priceRange: '$250-$700+/night',
    score: 88,
    awards: '',
    about: 'A 1926 Spanish Colonial icon across from LA Live that opened as a YWCA-run hotel for women traveling alone. 2018 renovation restored the original tilework and added Cafe Fig and the rooftop pool. Walking distance to Crypto.com Arena and the Convention Center.',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Spanish Colonial', note: '1926 hand-painted tile and wrought-iron lobby' },
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'Palm-fringed with downtown skyline views' },
      { icon: '\uD83C\uDF77', label: 'Bar Figueroa', note: 'The 30-foot mahogany bar from the original 1926 build' }
    ],
    insiderTips: [
      'Request a renovated room in the original wing — best tile + windows',
      'Walk to Crypto.com Arena in 4 minutes',
      'Sunday brunch at Cafe Fig is good and rarely booked'
    ],
    bestFor: ['Concerts', 'Events', 'Historic Stay', 'Design Lovers']
  },
  {
    name: 'Hotel Erwin Venice Beach',
    tier: 'Mid-Range', tierEmoji: '\uD83C\uDFDD\uFE0F',
    tagline: 'Rooftop cocktails right above the Venice boardwalk.',
    neighborhood: 'Venice',
    address: '1697 Pacific Ave, Venice CA 90291',
    lat: 33.9869, lng: -118.4725,
    instagram: '@hotelerwin',
    website: 'https://www.hotelerwin.com',
    priceRange: '$200-$500+/night',
    score: 85,
    awards: '',
    about: 'A boutique beach hotel one block from the Venice boardwalk with a High rooftop lounge and direct access to Muscle Beach, Abbot Kinney, and the canals. Casual, colorful, and one of the most walkable beach stays in LA.',
    highlights: [
      { icon: '\uD83C\uDFD6\uFE0F', label: 'Boardwalk Block', note: '1 block to Venice boardwalk, bike path, Muscle Beach' },
      { icon: '\uD83C\uDF79', label: 'High Rooftop Lounge', note: 'Sunset cocktails over the Pacific' },
      { icon: '\uD83D\uDEB2', label: 'Free Bikes', note: 'Use the house bikes to ride Venice to Santa Monica' }
    ],
    insiderTips: [
      'Ocean-view rooms on upper floors — boardwalk noise is the tradeoff',
      'Walk to Abbot Kinney in 8 minutes via Brooks Ave',
      'Free bikes get you from Venice Pier to Santa Monica Pier in 15'
    ],
    bestFor: ['Beach', 'Friends Trip', 'Walkable', 'Sunset Drinks']
  },
  {
    name: 'Andaz West Hollywood',
    tier: 'Mid-Range', tierEmoji: '\uD83C\uDFDD\uFE0F',
    tagline: 'The former "Riot Hyatt" where Led Zeppelin rode motorcycles in the halls.',
    neighborhood: 'West Hollywood',
    address: '8401 Sunset Blvd, West Hollywood CA 90069',
    lat: 34.0954, lng: -118.3732,
    instagram: '@andazwesthollywood',
    website: 'https://www.hyatt.com/en-US/hotel/california/andaz-west-hollywood/laxaz',
    priceRange: '$250-$600+/night',
    score: 87,
    awards: '',
    about: 'Originally the 1963 Continental Hyatt House — nicknamed the "Riot Hyatt" during its 70s run with Led Zeppelin, The Who, and The Doors. Now a modern Andaz with a rooftop pool and bar that still looks straight down the Sunset Strip.',
    highlights: [
      { icon: '\uD83C\uDFB8', label: 'Riot Hyatt Legacy', note: 'Led Zeppelin and The Who notorious 1970s residency' },
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'Pool bar with straight Strip views' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Riot House Restaurant', note: 'Elevated American on the ground floor' }
    ],
    insiderTips: [
      'Strip-facing rooms on floors 10+ = best views, worst noise',
      '2 minutes walk to Sunset Tower, Chateau Marmont, The Roxy',
      'Free house wine at 5-6 PM in the lobby'
    ],
    bestFor: ['Music History', 'Rooftop', 'Walkable Sunset Strip', 'Design']
  }
];

const toAdd = newHotels.filter(h => !existingNames.has(h.name)).map((h, i) => ({ id: maxId + i + 1, ...h }));
if (!toAdd.length) { console.log('No new hotels to add.'); process.exit(0); }

// Find the "los angeles": [ ... ] array inside HOTEL_DATA.
const laKey = '"los angeles":';
const keyIdx = html.indexOf(laKey, declIdx);
if (keyIdx < 0 || keyIdx > closeIdx) { console.error('"los angeles" key not found inside HOTEL_DATA'); process.exit(1); }
const arrStart = html.indexOf('[', keyIdx);
let adepth = 0, arrEnd = arrStart;
for (let j = arrStart; j < html.length; j++) {
  const c = html[j];
  if (c === '[') adepth++;
  else if (c === ']') { adepth--; if (adepth === 0) { arrEnd = j; break; } }
}

// Build insertion text: for each new hotel, produce ",\n    {...}" matching surrounding indent.
const snippet = toAdd
  .map(h => ',\r\n    ' + JSON.stringify(h, null, 2).split('\n').join('\n    '))
  .join('');

// Insert just before the closing `]`
const before = html.slice(0, arrEnd);
const after = html.slice(arrEnd);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + snippet + '\r\n  ' + after;

fs.writeFileSync(path, newHtml);
console.log('Appended', toAdd.length, 'hotels to HOTEL_DATA["los angeles"]:');
for (const h of toAdd) console.log('  id=' + h.id + ' | ' + h.tier + ' | ' + h.name);
