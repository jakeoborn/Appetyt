// Insert 'seattle' section into MALL_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
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
const block = html.slice(declIdx, closeIdx + 1);
if (/"seattle"\s*:/m.test(block)) {
  console.log('SKIP: MALL_DATA already has "seattle"');
  process.exit(0);
}

const seaMalls = [
  {
    id: 1,
    name: 'Pike Place Market',
    tagline: '1907 public market \u2014 fishmongers, flowers, produce, and the original Starbucks.',
    tier: 'Historic Public Market', emoji: '\uD83D\uDC1F',
    neighborhood: 'Downtown / Waterfront',
    address: '85 Pike St, Seattle WA 98101',
    lat: 47.6094,
    lng: -122.3403,
    instagram: '@pikeplacepublicmarket',
    hours: 'Daily 9AM-6PM (variable by vendor)',
    parking: 'Market garage, paid',
    score: 96,
    vibe: 'The soul of downtown Seattle \u2014 a 1907 public market still running as working fishmongers, farmers, craftspeople, and cooks, sprawled across nine acres down the Elliott Bay bluff.',
    about: "Founded 1907 and among the oldest continuously-operating farmers markets in the United States. 225+ year-round vendors, 70+ restaurants, and the original 1971 Starbucks at the Pike Place address. The fish-tossing at Pike Place Fish Market and the 550-lb Rachel the Pig mascot are the canonical stops.",
    anchors: ['Pike Place Fish Market', 'Rachel the Pig', 'Original Starbucks', 'Beecher\u2019s Handmade Cheese'],
    mustVisit: [
      { name: 'Pike Place Fish Market', note: 'Famous fish-tossing mongers' },
      { name: 'Original Starbucks',     note: '1971 flagship at 1912 Pike Pl' },
      { name: 'Beecher\u2019s',           note: 'Watch cheese being made through the window' },
      { name: 'Gum Wall',                note: 'Post Alley folk-art oddity' }
    ],
    dining: [
      { name: 'Pike Place Chowder',  type: 'Seafood',        note: 'Multi-year chowder cook-off champion' },
      { name: 'Matt\u2019s in the Market', type: 'Northwest',    note: 'Sixth-floor landmark with market view' },
      { name: 'Le Pichet',            type: 'French',         note: 'Bistro classic tucked a block away' },
      { name: 'Ellenos',              type: 'Ice Cream',      note: 'Greek yogurt lines of 20+ most days' }
    ],
    tips: [
      'Arrive before 10 AM \u2014 by noon, the main arcade is shoulder-to-shoulder',
      'The original Starbucks line can be 45 minutes \u2014 any other Starbucks is the same coffee',
      'Post Alley behind the main arcade is where the residents actually eat'
    ],
    bestFor: ['Landmark', 'Food Hall', 'Family', 'Walking', 'Must-Visit'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1907 Market', note: 'Oldest continuously-run farmers market in the U.S.' },
      { icon: '\uD83D\uDC1F', label: 'Fish-Tossing', note: 'Pike Place Fish Market daily show' },
      { icon: '\u2615', label: 'Original Starbucks', note: '1971 flagship still operating' },
      { icon: '\uD83C\uDF74', label: '70+ Eateries', note: 'Chowder, French bistro, ice cream, fresh doughnuts' }
    ]
  },
  {
    id: 2,
    name: 'University Village',
    tagline: 'Open-air lifestyle center next to UW \u2014 the city\u2019s most walkable shopping.',
    tier: 'Open-Air Lifestyle', emoji: '\uD83D\uDEB6',
    neighborhood: 'University District',
    address: '2623 NE University Village St, Seattle WA 98105',
    lat: 47.6633,
    lng: -122.2990,
    instagram: '@ushoppingcenter',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free surface + garages',
    score: 89,
    vibe: 'Seattle\u2019s flagship open-air lifestyle center \u2014 upscale national brands plus locally-beloved anchors, set next to the UW campus and Husky Stadium.',
    about: "A 1956-founded, thoroughly-updated open-air center of 60+ stores just off I-5 next to the UW campus. Apple, Crate & Barrel, Williams Sonoma, West Elm, and locally-beloved anchors like Ravenna\u2019s, Third Place Books, and a full Whole Foods. Dining heavy weight with Din Tai Fung and Joey.",
    anchors: ['Apple', 'Crate & Barrel', 'Williams Sonoma', 'Pottery Barn', 'Whole Foods Market'],
    mustVisit: [
      { name: 'Apple University Village', note: 'Flagship-size store' },
      { name: 'Crate & Barrel',           note: 'Full-concept flagship' },
      { name: 'Mrs. Cook\u2019s',           note: 'Seattle\u2019s iconic cookware specialist' }
    ],
    dining: [
      { name: 'Din Tai Fung',  type: 'Taiwanese',   note: 'Seattle flagship \u2014 constant lines' },
      { name: 'JOEY',          type: 'American',    note: 'Large patio' },
      { name: 'Blue C Sushi',  type: 'Conveyor',    note: '' }
    ],
    tips: [
      'Din Tai Fung line is 45 minutes most weekends \u2014 put your name in first, then shop',
      'Husky Stadium is a 10-minute walk',
      'Holiday lights in December are the most-Instagrammed in the city'
    ],
    bestFor: ['Walking', 'Shopping', 'Date', 'Dining', 'Family'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF3F', label: 'Open-Air', note: 'No indoor wing \u2014 grid of street-fronting shops' },
      { icon: '\uD83C\uDFA8', label: '60+ Retailers', note: 'Apple, Crate & Barrel, Anthropologie' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Din Tai Fung', note: 'The anchor restaurant draw' }
    ]
  },
  {
    id: 3,
    name: 'The Bellevue Collection (Bellevue Square)',
    tagline: 'Luxury enclosed mall anchoring downtown Bellevue.',
    tier: 'Luxury Mall', emoji: '\uD83D\uDC51',
    neighborhood: 'Downtown Bellevue',
    address: '575 Bellevue Square, Bellevue WA 98004',
    lat: 47.6166,
    lng: -122.2027,
    instagram: '@bellevuecollection',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free garages',
    score: 90,
    vibe: 'The region\u2019s dominant luxury mall, three-building \u2014 Bellevue Square, Bellevue Place, Lincoln Square \u2014 connected by sky bridges across downtown Bellevue.',
    about: "Bellevue Square opened 1946 as an open-air center and expanded 1981 into a fully-enclosed mall \u2014 the flagship of the Kemper Development Bellevue Collection. ~200 stores anchored by Nordstrom, Macy\u2019s, Apple, and Microsoft. Sky-bridge-connected to Lincoln Square (Westin Bellevue hotel, luxury residences) and Bellevue Place (Hyatt Regency).",
    anchors: ['Nordstrom', 'Macy\u2019s', 'Apple', 'Microsoft', 'Din Tai Fung'],
    mustVisit: [
      { name: 'Nordstrom',      note: 'Bellevue flagship' },
      { name: 'Microsoft Store', note: 'Microsoft corporate flagship \u2014 campus is nearby' },
      { name: 'Apple',          note: 'Large Bellevue Square flagship' }
    ],
    dining: [
      { name: 'Din Tai Fung',   type: 'Taiwanese',   note: 'Consistently busy \u2014 waits of 1-2 hours peak times' },
      { name: 'John Howie Steak', type: 'Steakhouse', note: 'In Lincoln Square' },
      { name: 'Daniel\u2019s Broiler', type: 'Steakhouse', note: 'Bellevue Place' }
    ],
    tips: [
      'Light rail from downtown Seattle now drops at Bellevue Downtown Station',
      'Sky-bridge-connect all three buildings \u2014 shop without going outside',
      'Hyatt Regency and Westin both attach \u2014 stay-and-shop weekend packages'
    ],
    bestFor: ['Luxury Shopping', 'Rainy Day', 'Family', 'Date'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDC51', label: 'Anchor Luxury', note: 'Nordstrom flagship + Microsoft Store + Apple' },
      { icon: '\uD83C\uDFE8', label: 'Three Connected Buildings', note: 'Sky-bridged with Lincoln Sq + Bellevue Pl' }
    ]
  },
  {
    id: 4,
    name: 'The Shops at The Bravern',
    tagline: 'Luxury-only retail plaza \u2014 Bellevue\u2019s Rodeo Drive.',
    tier: 'Luxury Open-Air', emoji: '\uD83D\uDC51',
    neighborhood: 'Downtown Bellevue',
    address: '11111 NE 8th St, Bellevue WA 98004',
    lat: 47.6154,
    lng: -122.1983,
    instagram: '@thebravern',
    hours: 'Mon-Sat 10AM-7PM, Sun 11AM-6PM',
    parking: 'Paid garage + valet',
    score: 87,
    vibe: 'Boutique luxury plaza built 2009 \u2014 only high-end brands, understated design. The Pacific Northwest\u2019s closest answer to Rodeo Drive.',
    about: "A purpose-built luxury shopping center opened 2009 next to the Bellevue Collection. 30+ upscale-only tenants \u2014 Louis Vuitton, Gucci, Herm\u00E8s, Burberry, Salvatore Ferragamo, Bottega Veneta \u2014 plus Westin Bellevue hotel overhead and John Howie Steak as dining anchor.",
    anchors: ['Louis Vuitton', 'Herm\u00E8s', 'Gucci', 'Burberry', 'Bottega Veneta'],
    mustVisit: [
      { name: 'Louis Vuitton',   note: 'Bellevue flagship' },
      { name: 'Herm\u00E8s',      note: '' },
      { name: 'Gucci',            note: '' }
    ],
    dining: [
      { name: 'John Howie Steak', type: 'Steakhouse', note: 'Premier Eastside steakhouse' },
      { name: 'Wild Ginger',       type: 'Pan-Asian', note: 'Bellevue branch of Seattle classic' }
    ],
    tips: [
      'Quieter alternative to Bellevue Square \u2014 no department stores',
      'Valet is recommended for a quick luxury-store errand',
      'Westin Bellevue overhead \u2014 stay-and-shop packages'
    ],
    bestFor: ['Luxury Shopping', 'Special Occasion', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDC51', label: 'Luxury-Only', note: 'No department-store anchors \u2014 boutique concentration' },
      { icon: '\uD83C\uDFE8', label: 'Westin Bellevue', note: 'Hotel overhead on the property' }
    ]
  },
  {
    id: 5,
    name: 'Pacific Place',
    tagline: 'Five-story downtown shopping center with Tiffany, Barnes & Noble, and an AMC.',
    tier: 'Urban Mall', emoji: '\uD83D\uDED2',
    neighborhood: 'Downtown Seattle',
    address: '600 Pine St, Seattle WA 98101',
    lat: 47.6127,
    lng: -122.3364,
    instagram: '@pacificplace',
    hours: 'Mon-Sat 10AM-8PM, Sun 11AM-6PM',
    parking: 'Pacific Place garage, paid',
    score: 80,
    vibe: 'Five-story atrium mall in downtown Seattle \u2014 sky-bridge-connected to Nordstrom flagship, Apple Store steps away, and the AMC Pacific Place 11 on the top floor.',
    about: "A 335,000 sq ft downtown Seattle mall opened 1998, five stories around a skylit atrium. Tiffany, Barnes & Noble, Coach, Ann Taylor, and the AMC Pacific Place 11 on the top floor. Sky bridge connects directly to Nordstrom\u2019s flagship downtown store across Pine St.",
    anchors: ['Tiffany & Co.', 'AMC Pacific Place 11', 'Barnes & Noble', 'Coach'],
    mustVisit: [
      { name: 'Tiffany & Co.',    note: 'Seattle flagship' },
      { name: 'AMC Pacific Place 11', note: 'Downtown multiplex' },
      { name: 'Nordstrom Flagship (sky-bridge)', note: 'Connected via 6th Ave sky bridge' }
    ],
    dining: [
      { name: 'Il Fornaio',      type: 'Italian',   note: '' },
      { name: 'Gordon Biersch',  type: 'Gastropub', note: '' }
    ],
    tips: [
      'Sky bridge to Nordstrom is the fast downtown errand combo',
      'AMC top floor is the easiest downtown multiplex',
      'Westlake light rail/monorail station steps away'
    ],
    bestFor: ['Shopping', 'Movies', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFAC', label: 'AMC Multiplex', note: '11-screen top-floor AMC' },
      { icon: '\uD83C\uDF09', label: 'Nordstrom Sky Bridge', note: 'Connected to Nordstrom flagship downtown' }
    ]
  },
  {
    id: 6,
    name: 'Westlake Center',
    tagline: 'Monorail-stop downtown mall at Pike and 5th Avenue.',
    tier: 'Urban Mall', emoji: '\uD83D\uDED2',
    neighborhood: 'Downtown Seattle',
    address: '400 Pine St, Seattle WA 98101',
    lat: 47.6116,
    lng: -122.3378,
    instagram: '',
    hours: 'Mon-Sat 9:30AM-8PM, Sun 11AM-6PM',
    parking: 'Paid garage',
    score: 75,
    vibe: 'Four-story compact mall at Westlake Square \u2014 the south terminus of the Seattle Monorail \u2014 and home to the Westlake light-rail station underneath.',
    about: "A 1988 downtown shopping center at the Westlake transit hub. Four retail floors, a food court on level 3, and the Seattle Monorail platform on the top floor running to the Space Needle at Seattle Center. Fisher Plaza directly in front hosts the city\u2019s Macy\u2019s Holiday Tree lighting and the downtown Ice Rink each winter.",
    anchors: ['Zara', 'Sephora', 'Rolex (Ben Bridge)', 'Seattle Monorail'],
    mustVisit: [
      { name: 'Seattle Monorail terminus', note: 'Top-floor platform to the Space Needle' },
      { name: 'Ben Bridge Jeweler', note: '1912-founded Seattle institution on the ground floor' }
    ],
    dining: [
      { name: 'Food Court',  type: 'Food Court', note: 'Level 3, international quick-service' }
    ],
    tips: [
      'Monorail to Seattle Center is a 2-minute ride \u2014 $3 each way',
      'Westlake Park plaza out front is the downtown public-event anchor',
      'Holiday ice rink and tree-lighting are the big winter moments'
    ],
    bestFor: ['Transit', 'Shopping', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDE9D', label: 'Monorail Terminus', note: 'Top-floor Monorail platform to Space Needle' },
      { icon: '\uD83D\uDEA2', label: 'Transit Hub', note: 'Light-rail underneath, buses surrounding' }
    ]
  },
  {
    id: 7,
    name: 'Westfield Southcenter',
    tagline: 'Washington\u2019s largest enclosed mall \u2014 flagship regional center south of the city.',
    tier: 'Enclosed Mall', emoji: '\uD83C\uDFEC',
    neighborhood: 'Tukwila / South Seattle',
    address: '2800 Southcenter Mall, Tukwila WA 98188',
    lat: 47.4595,
    lng: -122.2598,
    instagram: '@southcenter',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots + garages',
    score: 80,
    vibe: 'The biggest mall in Washington State \u2014 full-size Nordstrom, Macy\u2019s, JCPenney, and the largest Apple Store in the region. The regional default for big-day shopping.',
    about: "Built 1968 and repeatedly expanded into 1.7 million sq ft \u2014 the largest enclosed mall in Washington. ~230 stores plus full Cinemark AMC, plus big-box outparcels (Target, Dick\u2019s) in the surrounding Southcenter power-center district. Closest mall to SEA airport.",
    anchors: ['Nordstrom', 'Macy\u2019s', 'JCPenney', 'AMC Theatres'],
    mustVisit: [
      { name: 'Apple Southcenter', note: 'One of the larger Apple stores regionally' },
      { name: 'Nordstrom',         note: 'Full-size anchor' }
    ],
    dining: [
      { name: 'The Cheesecake Factory', type: 'American', note: 'Outparcel' },
      { name: 'Johnny Rockets',  type: 'Burgers',  note: '' }
    ],
    tips: [
      'Closest major mall to SEA airport \u2014 layover-stop option',
      'Surrounding Southcenter strip has Target, Costco, IKEA within 5 min',
      'Light rail does not go here \u2014 driving is the practical option'
    ],
    bestFor: ['Shopping', 'Family', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFEC', label: '1.7M Sq Ft', note: 'Largest mall in Washington State' },
      { icon: '\u2708\uFE0F', label: 'Near SEA Airport', note: 'Closest major mall to Sea-Tac' }
    ]
  },
  {
    id: 8,
    name: 'Melrose Market',
    tagline: 'Capitol Hill food hall + curated retail in a 1919 auto-row building.',
    tier: 'Food Hall', emoji: '\uD83C\uDF77',
    neighborhood: 'Capitol Hill',
    address: '1501 Melrose Ave, Seattle WA 98122',
    lat: 47.6149,
    lng: -122.3215,
    instagram: '@melrosemarketseattle',
    hours: 'Daily 10AM-10PM (varies by vendor)',
    parking: 'Street + small lot',
    score: 85,
    vibe: 'Boutique food hall in a restored 1919 auto-row brick building on Capitol Hill \u2014 cheese, butchery, wine, and Sitka & Spruce.',
    about: "A 2010-opened food hall in a three-part 1919 auto-row building on the Capitol Hill/First Hill boundary. Rotating ~dozen artisan vendors \u2014 Marigold & Mint flowers, Rain Shadow Meats butchery, Calf & Kid cheese, Bar Ferd\u2019nand wine bar. Flagship restaurant: Matt Dillon\u2019s Sitka & Spruce (a Seattle establishment pillar) across the courtyard.",
    anchors: ['Sitka & Spruce', 'Rain Shadow Meats', 'Calf & Kid', 'Bar Ferd\u2019nand'],
    mustVisit: [
      { name: 'Sitka & Spruce', note: 'Matt Dillon flagship \u2014 seasonal Northwest' },
      { name: 'Rain Shadow Meats', note: 'Whole-animal butchery and charcuterie' }
    ],
    dining: [
      { name: 'Sitka & Spruce',  type: 'New American', note: 'Matt Dillon\u2019s flagship \u2014 reservations ahead' },
      { name: 'Bar Ferd\u2019nand', type: 'Wine Bar',    note: 'Natural wine and plate-sharing' }
    ],
    tips: [
      'Sitka & Spruce books up; walk-in bar seats are the in',
      'Pair with a Capitol Hill walk \u2014 Elliott Bay Book Co. three blocks away',
      'Building is small; just drop in on the way through the neighborhood'
    ],
    bestFor: ['Foodie', 'Date', 'Rainy Day', 'Walking'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1919 Building', note: 'Restored auto-row brick building' },
      { icon: '\uD83E\uDDC0', label: 'Artisan Vendors', note: 'Butcher, cheesemonger, florist, wine bar' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Sitka & Spruce', note: 'Matt Dillon\u2019s flagship restaurant anchor' }
    ]
  },
  {
    id: 9,
    name: 'Ballard Farmers Market',
    tagline: 'Sunday-only farmers market on historic Ballard Ave.',
    tier: 'Farmers Market', emoji: '\uD83E\uDD55',
    neighborhood: 'Ballard',
    address: 'Ballard Ave NW & 22nd Ave NW, Seattle WA 98107',
    lat: 47.6674,
    lng: -122.3819,
    instagram: '@seattlefarmersmkts',
    hours: 'Sun 10AM-2PM year-round',
    parking: 'Street + garages',
    score: 88,
    vibe: 'The Sunday food ritual for North Seattle \u2014 farmers, cheesemakers, fishmongers, and hot-food trucks along a four-block stretch of historic Ballard Avenue.',
    about: "A Sunday-only, year-round farmers market running on a car-free four-block stretch of Ballard Ave NW. 70+ farms and vendors, strong hot-food lineup (Sid\u2019s Breakfast, Plaka Estiatorio flatbreads, empanadas and arepas), and Ballard\u2019s regular brick-and-mortar retailers stay open around the market.",
    anchors: ['Ballard Ave NW street grid', 'Skagit Valley farms'],
    mustVisit: [
      { name: 'Mt. Townsend Creamery', note: 'Olympic Peninsula artisan cheese' },
      { name: 'Calf & Kid at market', note: 'Cheese flight and sandwiches' }
    ],
    dining: [
      { name: 'Walrus and the Carpenter', type: 'Oyster Bar', note: 'Renee Erickson\u2019s flagship a block away' },
      { name: 'La Carta de Oaxaca',        type: 'Mexican',  note: 'Historic Ballard mole destination' }
    ],
    tips: [
      'Sunday brunch + market walk is the North Seattle standard',
      'Park east of 24th and walk in; Ballard Ave itself is pedestrian-only during market',
      'Walrus and the Carpenter takes walk-ins for a 4 PM bar seat'
    ],
    bestFor: ['Farmers Market', 'Foodie', 'Family', 'Sunday', 'Walking'],
    awards: '',
    highlights: [
      { icon: '\uD83E\uDD55', label: '70+ Vendors', note: 'Farmers, butchers, bakers, hot-food trucks' },
      { icon: '\uD83D\uDDD3\uFE0F', label: 'Sunday-Only', note: 'Year-round Sunday 10AM\u20132PM' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Historic Ballard Ave', note: 'Brick storefronts from Ballard\u2019s fishing-fleet era' }
    ]
  },
  {
    id: 10,
    name: 'Uwajimaya Village',
    tagline: 'Asian grocery + food hall anchoring Seattle\u2019s Chinatown-International District.',
    tier: 'Asian Market', emoji: '\uD83C\uDF5C',
    neighborhood: 'Chinatown-International District',
    address: '600 5th Ave S, Seattle WA 98104',
    lat: 47.5980,
    lng: -122.3265,
    instagram: '@uwajimaya',
    hours: 'Daily 8AM-9PM',
    parking: 'Free garage, underground',
    score: 86,
    vibe: 'The largest Asian grocery store in the Pacific Northwest \u2014 a full Pan-Asian food hall, bookshop, and gift shop anchoring Seattle\u2019s CID.',
    about: "Founded 1928, now a 67,000 sq ft flagship in a dedicated block at the edge of the International District. Complete Pan-Asian grocery (the region\u2019s most comprehensive), an in-store hot-food court with 8+ vendors (sushi, ramen, banh mi, Thai), Kinokuniya Bookstore (Japanese books + manga), and housewares.",
    anchors: ['Uwajimaya Grocery', 'Kinokuniya Bookstore', 'Food Court'],
    mustVisit: [
      { name: 'Kinokuniya Bookstore', note: 'Japan\u2019s largest bookstore chain \u2014 Seattle branch' },
      { name: 'Uwajimaya Food Court', note: 'Fresh sushi, ramen, banh mi, Thai' }
    ],
    dining: [
      { name: 'Food Court vendors', type: 'Pan-Asian', note: 'Multiple quick-serve vendors inside' },
      { name: 'Restaurants in the CID nearby', type: 'Various', note: 'Dim sum + bubble tea steps away on King St' }
    ],
    tips: [
      'Free underground parking with any purchase',
      'Pair with a walk through Hing Hay Park and the CID\u2019s historic streets',
      'Pan-Asian New Year events are a city highlight late January'
    ],
    bestFor: ['Grocery', 'Food Court', 'Family', 'Culture', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF5C', label: '67,000 sq ft Grocery', note: 'Largest Asian grocery in the Pacific Northwest' },
      { icon: '\uD83D\uDCD6', label: 'Kinokuniya', note: 'Japanese mega-bookstore inside' },
      { icon: '\uD83C\uDF63', label: 'Food Court', note: '8+ Pan-Asian vendors' }
    ]
  }
];

const body = JSON.stringify(seaMalls, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "seattle": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted seattle section into MALL_DATA with', seaMalls.length, 'entries.');
