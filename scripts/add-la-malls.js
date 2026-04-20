// Append 7 additional LA malls + markets to MALL_DATA['los angeles'].
const fs = require('fs');
const vm = require('vm');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

const declIdx = html.indexOf('const MALL_DATA =');
if (declIdx < 0) { console.error('MALL_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}

function extract(name, src) {
  const idx = src.indexOf('const ' + name + ' =');
  let i = src.indexOf('{', idx);
  let d = 0, e = i;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '{') d++;
    else if (c === '}') { d--; if (d === 0) { e = j + 1; break; } }
  }
  return 'var ' + name + ' = ' + src.slice(i, e) + ';';
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(extract('MALL_DATA', html), ctx);
const existing = ctx.MALL_DATA['los angeles'] || [];
const existingNames = new Set(existing.map(m => m.name));
const maxId = existing.reduce((m, h) => Math.max(m, h.id || 0), 0);

const newMalls = [
  {
    name: 'Grand Central Market',
    tagline: "LA's oldest public market — 30 vendors under one 1917 roof.",
    tier: 'Market', emoji: '\uD83C\uDFEA',
    neighborhood: 'Downtown LA',
    address: '317 S Broadway, Los Angeles CA 90013',
    lat: 34.0508, lng: -118.2489,
    instagram: '@grandcentralmarket',
    hours: 'Daily 8AM-9PM',
    parking: 'Angels Flight lot across the street; validation with purchase',
    score: 96,
    vibe: 'A 1917 downtown food hall with 30+ vendors spanning cheap-eats to chef-driven, beneath the neon ceiling everyone photographs.',
    about: 'The oldest public market in Los Angeles, operating since 1917 at the base of Bunker Hill. Eggslut, Sticky Rice, Madcapra, Tacos Tumbras a Tomas, and the neon signage that turned the ceiling into an Instagram set piece. Directly across from the Angels Flight funicular.',
    anchors: ['Eggslut', 'Sticky Rice', 'McConnell\u2019s', 'Madcapra', 'Horse Thief BBQ'],
    mustVisit: [
      { name: 'Eggslut',           note: 'The Fairfax egg sandwich that built the brand' },
      { name: 'Sticky Rice',       note: 'Northern Thai soups and curries' },
      { name: 'Madcapra',          note: 'Falafel sandwiches that won LA Times' },
      { name: 'McConnell\u2019s',  note: 'Santa Barbara ice cream scoops' },
      { name: 'Horse Thief BBQ',   note: 'Central Texas brisket on the south terrace' }
    ],
    dining: [
      { name: 'Eggslut',    type: 'Breakfast Sandwiches', note: 'Line forms before 10 AM on weekends' },
      { name: 'G&B Coffee', type: 'Coffee',               note: 'Pioneer of the almond-macadamia latte' },
      { name: 'Sari Sari',  type: 'Filipino',             note: 'Adobo, silog plates, halo-halo' }
    ],
    tips: [
      'Arrive before 11 AM for Eggslut or expect a 45-minute line',
      'Exit on Hill St. side for the Angels Flight funicular — $1 each way',
      'Walk one block to The Broad, two to Disney Hall'
    ],
    bestFor: ['Food Hall', 'Quick Lunch', 'Tourists', 'Rainy Day'],
    awards: 'LA Historic-Cultural Monument #146',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Market',   note: '30+ vendors under a 1917 ceiling' },
      { icon: '\uD83C\uDFEC', label: 'Anchors',  note: 'Eggslut, Sticky Rice, McConnell\u2019s, Madcapra' },
      { icon: '\u2B50',       label: 'Eggslut', note: 'Fairfax egg sandwich — the original' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Angels Flight lot across Broadway — validated' }
    ]
  },
  {
    name: 'The Original Farmers Market',
    tagline: '1934 open-air market at 3rd & Fairfax, next to The Grove.',
    tier: 'Market', emoji: '\uD83C\uDF4A',
    neighborhood: 'Fairfax',
    address: '6333 W 3rd St, Los Angeles CA 90036',
    lat: 34.0719, lng: -118.3604,
    instagram: '@farmersmarketla',
    hours: 'Mon-Fri 9AM-9PM, Sat 9AM-8PM, Sun 10AM-7PM',
    parking: '3-hour free with validation',
    score: 93,
    vibe: 'Open-air 1934 market where Angelenos have been eating Magee\u2019s corned beef, Bob\u2019s donuts, and Du-par\u2019s pancakes for three generations.',
    about: 'An open-air farmer\u2019s market founded in 1934 on a former dairy farm. 100+ stalls plus 25 restaurants — Loteria Grill, Pampas Grill, Singapore\u2019s Banana Leaf — and the Free Trolley to The Grove across Third Street. The original white clock tower is an LA landmark.',
    anchors: ['Du-par\u2019s', 'Magee\u2019s Kitchen', 'Loteria Grill', 'Bob\u2019s Coffee & Donuts', 'Pampas Grill'],
    mustVisit: [
      { name: 'Magee\u2019s Kitchen',        note: 'Corned beef & potato knish since 1934' },
      { name: 'Bob\u2019s Coffee & Donuts',  note: 'Sold out by noon — come early' },
      { name: 'Loteria Grill',               note: 'Mexico City-style tacos, mole, aguas frescas' },
      { name: 'Pampas Grill',                note: 'Brazilian churrasco by the pound' }
    ],
    dining: [
      { name: 'Du-par\u2019s',        type: 'American Diner', note: '24-hour pancakes at the corner' },
      { name: 'Singapore\u2019s Banana Leaf', type: 'Malaysian',       note: 'Laksa and roti canai' },
      { name: 'Phil\u2019s Deli',      type: 'Jewish Deli',     note: 'Pastrami sandwich and matzo ball soup' }
    ],
    tips: [
      'Free trolley every 10 minutes to The Grove — combine both',
      'Parking free 3 hours with validation — ride the trolley to extend',
      'Tuesday farmers market adds produce stalls outside the main hall'
    ],
    bestFor: ['Food Hall', 'Historic', 'Family', 'Tourists', 'Breakfast'],
    awards: 'LA Historic-Cultural Monument #543',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Market', note: '100+ stalls, 25 restaurants since 1934' },
      { icon: '\uD83C\uDFAF', label: 'Free Trolley', note: 'Every 10 min to The Grove across 3rd St' },
      { icon: '\uD83C\uDF69', label: 'Bob\u2019s Donuts', note: 'Sold out by noon — worth the early stop' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: '3 hours free with validation' }
    ]
  },
  {
    name: 'Westfield Century City',
    tagline: "West LA's premier open-air upscale mall — reinvented 2017.",
    tier: 'Upscale Mall', emoji: '\uD83D\uDECD\uFE0F',
    neighborhood: 'Century City',
    address: '10250 Santa Monica Blvd, Los Angeles CA 90067',
    lat: 34.0599, lng: -118.4194,
    instagram: '@westfieldcenturycity',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: '2 hours free; 4 hours with AMC or Eataly validation',
    score: 93,
    vibe: 'Open-air luxury mall with Nordstrom, Bloomingdale\u2019s, and Macy\u2019s flagships plus Eataly LA and an AMC dine-in theater.',
    about: 'A 1.3-million-square-foot open-air shopping center that underwent a $1 billion renovation in 2017. Nordstrom, Bloomingdale\u2019s, Macy\u2019s, Eataly\u2019s first LA location, Amazon Books (first physical store in LA), and an AMC Dine-In 15 theater. One of the only shopping malls in LA where you want to actually linger outside.',
    anchors: ['Nordstrom', 'Bloomingdale\u2019s', 'Macy\u2019s', 'Eataly', 'AMC Dine-In 15'],
    mustVisit: [
      { name: 'Eataly LA',       note: "First LA Eataly — stand-up Neapolitan slice bar upstairs" },
      { name: 'Shake Shack',     note: 'Outdoor tables on the Atrium Plaza' },
      { name: 'Sugarfish',       note: 'Counter service in the food court' }
    ],
    dining: [
      { name: 'Eataly',            type: 'Italian Food Hall', note: 'Three floors — market, pasta, pizza, wine bar' },
      { name: 'Javier\u2019s',      type: 'Mexican',           note: 'The hidden business-dinner corner' },
      { name: 'Tocaya Modern Mexican', type: 'Mexican Casual', note: 'Healthy bowls and tacos' }
    ],
    tips: [
      'Atrium Plaza (between Nordstrom and Macy\u2019s) has the best outdoor seating',
      'Eataly\u2019s rooftop Terra restaurant has Century City skyline views',
      'AMC Dine-In is a date-night go-to — recliner + food to the seat'
    ],
    bestFor: ['Luxury Shopping', 'Date', 'Dining', 'Cinema', 'Weekday Lunch'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Mall',    note: '1.3M sq ft open-air, renovated 2017' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Nordstrom, Bloomingdale\u2019s, Macy\u2019s' },
      { icon: '\uD83C\uDF5D', label: 'Eataly',  note: 'First LA location, three floors' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: '2 hours free, 4 with validation' }
    ]
  },
  {
    name: 'Santa Monica Place',
    tagline: 'Ocean-view flagship at the foot of the Promenade.',
    tier: 'Upscale Mall', emoji: '\uD83C\uDFD6\uFE0F',
    neighborhood: 'Santa Monica',
    address: '395 Santa Monica Place, Santa Monica CA 90401',
    lat: 34.0151, lng: -118.4927,
    instagram: '@santamonicaplace',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-8PM',
    parking: '90 min free; 2 hours evenings & weekends',
    score: 90,
    vibe: 'Three-level open-air mall at the south end of the Third Street Promenade, with Nordstrom and Bloomingdale\u2019s.',
    about: 'The three-level open-air mall anchoring the south end of the Third Street Promenade in Santa Monica. Nordstrom, Bloomingdale\u2019s, Tesla showroom, and the rooftop Market & Dining Deck with Pacific Ocean views.',
    anchors: ['Nordstrom', 'Bloomingdale\u2019s', 'Tesla'],
    mustVisit: [
      { name: 'The Market & Dining Deck', note: 'Rooftop food-hall balcony with ocean views' },
      { name: 'Sonoma Wine Garden',       note: 'Rooftop wine bar — sunset crowd' }
    ],
    dining: [
      { name: 'Sonoma Wine Garden', type: 'Wine Bar', note: 'Rooftop, California wine list' },
      { name: 'True Food Kitchen',  type: 'Healthy',  note: 'Sam Fox concept, seasonal bowls' },
      { name: 'Ozumo',              type: 'Japanese', note: 'Rooftop sushi with a view of the Pier' }
    ],
    tips: [
      'Rooftop Dining Deck is the move — ocean breeze + view',
      'Walk out the north end directly onto the Third Street Promenade',
      'Santa Monica Pier is a 5-minute walk south'
    ],
    bestFor: ['Beach Day', 'Shopping', 'Tourists', 'Rooftop Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Mall', note: '3-level open-air on the Promenade' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Nordstrom, Bloomingdale\u2019s' },
      { icon: '\uD83C\uDF0A', label: 'Rooftop View', note: 'Pacific Ocean dining deck' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: '90 min free (2 hrs eves/weekends)' }
    ]
  },
  {
    name: 'The Americana at Brand',
    tagline: "Rick Caruso's Glendale sister to The Grove.",
    tier: 'Outdoor Mall', emoji: '\uD83D\uDC92',
    neighborhood: 'Glendale',
    address: '889 Americana Way, Glendale CA 91210',
    lat: 34.1435, lng: -118.2556,
    instagram: '@americanaatbrand',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-8PM',
    parking: '2 hours free',
    score: 88,
    vibe: 'Caruso\u2019s second outdoor mall — dancing fountain, trolley, and a small main street spine with Nordstrom, Tiffany, and Barnes & Noble.',
    about: 'Rick Caruso\u2019s follow-up to The Grove, opened in Glendale in 2008. Dancing fountain set to music, open-air trolley, Americana Walk spine, and a residential tower overhead. Nordstrom, Tiffany, Apple, Rolex, and a Barnes & Noble two floors tall.',
    anchors: ['Nordstrom', 'Tiffany & Co.', 'Apple', 'Barnes & Noble'],
    mustVisit: [
      { name: 'Dancing Fountain',   note: 'Full fountain show on the hour, 10 AM-10 PM' },
      { name: 'Caruso Trolley',     note: 'Free ride up and down the main spine' },
      { name: 'Barnes & Noble',     note: 'Two-floor anchor in an era when bookstores are closing' }
    ],
    dining: [
      { name: 'Katsuya',            type: 'Japanese', note: 'Robata, sushi, black cod miso' },
      { name: 'Cheesecake Factory', type: 'American', note: 'A Caruso staple' }
    ],
    tips: [
      'Fountain shows on the hour — 9 PM is the most atmospheric',
      'Galleria shopping center next door doubles the stores',
      '10 min walk to Porto\u2019s Bakery Glendale — legendary line but worth it'
    ],
    bestFor: ['Family', 'Strollers', 'Fountain Show', 'Luxury Shopping'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Mall',       note: 'Outdoor "main street" center, 2008' },
      { icon: '\uD83C\uDFEC', label: 'Anchors',     note: 'Nordstrom, Tiffany, Apple, Barnes & Noble' },
      { icon: '\u26F2',       label: 'Fountain',    note: 'Dancing fountain on the hour' },
      { icon: '\uD83D\uDE8E', label: 'Trolley',     note: 'Free Caruso trolley along the spine' }
    ]
  },
  {
    name: 'Beverly Center',
    tagline: 'Multi-level luxury mall between Beverly Hills and West Hollywood.',
    tier: 'Upscale Mall', emoji: '\uD83D\uDECD\uFE0F',
    neighborhood: 'Beverly Grove',
    address: '8500 Beverly Blvd, Los Angeles CA 90048',
    lat: 34.0757, lng: -118.3770,
    instagram: '@beverlycenter',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-8PM',
    parking: '2 hours free',
    score: 85,
    vibe: 'Eight-level indoor mall with Bloomingdale\u2019s and Macy\u2019s anchors, a 2018 Massimiliano Fuksas renovation, and one of the only high-end food halls in LA.',
    about: 'The flagship Beverly Center, opened 1982 and renovated by Massimiliano Fuksas in 2018. Bloomingdale\u2019s and Macy\u2019s anchor an eight-level shopping center, with The Street food hall featuring Eggslut, Farmhouse, and Yardbird.',
    anchors: ['Bloomingdale\u2019s', 'Macy\u2019s', 'XXI Forever', 'H&M'],
    mustVisit: [
      { name: 'The Street food hall', note: 'Eggslut, Farmhouse, Yardbird Table & Bar' },
      { name: 'Cal Mare',             note: 'Michael Mina Italian seafood' }
    ],
    dining: [
      { name: 'Yardbird Southern Table', type: 'Southern', note: 'Nashville hot chicken + shrimp and grits' },
      { name: 'Cal Mare',                type: 'Italian',   note: 'Michael Mina coastal Italian' },
      { name: 'Eggslut',                 type: 'Breakfast', note: 'No-line alternative to Grand Central Market' }
    ],
    tips: [
      'Indoor = summer heat refuge on the 100° Fairfax days',
      'Exit on La Cienega to walk to Cedars-Sinai or the Beverly Hills hotels',
      'The Street food hall closes earlier than the stores — 9 PM'
    ],
    bestFor: ['Luxury Shopping', 'Food Hall', 'Rainy Day', 'Summer AC'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Mall',    note: '8 levels, 2018 Fuksas renovation' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Bloomingdale\u2019s, Macy\u2019s' },
      { icon: '\uD83C\uDF72', label: 'The Street', note: 'Food hall with Eggslut, Yardbird, Farmhouse' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: '2 hours free' }
    ]
  },
  {
    name: 'Olvera Street (El Pueblo de Los Angeles)',
    tagline: "LA's oldest street — a living Mexican marketplace since 1930.",
    tier: 'Historic Market', emoji: '\uD83C\uDF2E',
    neighborhood: 'Downtown LA / El Pueblo',
    address: '845 N Alameda St, Los Angeles CA 90012',
    lat: 34.0573, lng: -118.2374,
    instagram: '@olverastreetla',
    hours: 'Daily 10AM-7PM (vendor hours vary)',
    parking: 'Paid lots on Alameda; Metro B/D/L at Union Station across the street',
    score: 89,
    vibe: 'A block-long Mexican marketplace of artisan stalls, mariachi, and taquerias in the historic birthplace of Los Angeles, across from Union Station.',
    about: 'Olvera Street sits inside El Pueblo de Los Angeles Historical Monument — the original 1781 plaza where the city was founded. Restored as a Mexican marketplace in 1930, it now holds the Avila Adobe (LA\u2019s oldest standing house, 1818), a block of artisan stalls, taquerias, and weekly mariachi and Ballet Folklorico performances.',
    anchors: ['Avila Adobe', 'La Golondrina Cafe', 'Cielito Lindo', 'Mister Churros'],
    mustVisit: [
      { name: 'Avila Adobe',       note: "LA's oldest standing house — free museum" },
      { name: 'Cielito Lindo',     note: 'Taquitos with avocado sauce since 1934' },
      { name: 'Mister Churros',    note: 'Churros made to order on the street' }
    ],
    dining: [
      { name: 'La Golondrina Cafe', type: 'Mexican',      note: 'Opened 1930 inside the 1855 Pelanconi House' },
      { name: 'Cielito Lindo',      type: 'Taquitos',     note: 'Walk-up window, cash only' }
    ],
    tips: [
      'Cross Alameda to Union Station — architectural landmark, free to walk inside',
      'Weekend mariachi at the plaza starts around noon',
      'Walk 10 min to Chinatown or the LA State Historic Park'
    ],
    bestFor: ['Historic', 'Culture', 'Tourists', 'Family', 'Free Activity'],
    awards: 'LA Historic-Cultural Monument #100',
    highlights: [
      { icon: '\uD83D\uDCDC', label: 'Historic', note: "LA's oldest street, Mexican marketplace since 1930" },
      { icon: '\uD83C\uDFE0', label: 'Avila Adobe', note: "LA's oldest standing house — free museum" },
      { icon: '\uD83C\uDF2E', label: 'Cielito Lindo', note: 'Taquitos with avocado sauce since 1934' },
      { icon: '\uD83D\uDE87', label: 'Transit', note: 'Metro B/D/L at Union Station across the street' }
    ]
  }
];

const toAdd = newMalls.filter(m => !existingNames.has(m.name)).map((m, i) => ({ id: maxId + i + 1, ...m }));
if (!toAdd.length) { console.log('Nothing new to add.'); process.exit(0); }

// Locate the "los angeles": [ ... ] array inside MALL_DATA.
const laKey = '"los angeles":';
const keyIdx = html.indexOf(laKey, declIdx);
if (keyIdx < 0 || keyIdx > closeIdx) { console.error('"los angeles" key not found inside MALL_DATA'); process.exit(1); }
const arrStart = html.indexOf('[', keyIdx);
let adepth = 0, arrEnd = arrStart;
for (let j = arrStart; j < html.length; j++) {
  const c = html[j];
  if (c === '[') adepth++;
  else if (c === ']') { adepth--; if (adepth === 0) { arrEnd = j; break; } }
}

const snippet = toAdd
  .map(h => ',\r\n    ' + JSON.stringify(h, null, 2).split('\n').join('\n    '))
  .join('');

const before = html.slice(0, arrEnd);
const after = html.slice(arrEnd);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + snippet + '\r\n  ' + after;

fs.writeFileSync(path, newHtml);
console.log('Appended', toAdd.length, 'malls/markets to MALL_DATA["los angeles"]:');
for (const h of toAdd) console.log('  id=' + h.id + ' | ' + h.tier + ' | ' + h.name);
