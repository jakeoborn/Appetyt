// Insert 'san antonio' section into MALL_DATA in index.html.
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
if (/"san antonio"\s*:/m.test(block)) {
  console.log('SKIP: MALL_DATA already has "san antonio"');
  process.exit(0);
}

const satMalls = [
  {
    id: 1,
    name: 'The Pearl',
    tagline: 'Historic brewery redeveloped into SA\u2019s premier food + retail district.',
    tier: 'Food + Retail District', emoji: '\uD83C\uDF7D\uFE0F',
    neighborhood: 'Pearl District',
    address: '303 Pearl Pkwy, San Antonio TX 78215',
    lat: 29.4406,
    lng: -98.4793,
    instagram: '@atpearl',
    hours: 'Daily, varies by vendor',
    parking: 'Free garages',
    score: 94,
    vibe: 'The city\u2019s best food destination \u2014 a 22-acre former brewery campus redeveloped into chef-driven restaurants, boutique retail, a Hotel Emma anchor, and a weekend farmers market on the San Antonio River.',
    about: "The 1883 Pearl Brewing Company campus, redeveloped starting 2007 into a 22-acre mixed-use district on the Museum Reach of the River Walk. Hotel Emma anchors, the Culinary Institute of America has its San Antonio campus inside, and ~15 restaurants (Cured, Supper, Botika, Bakery Lorraine) and boutique retailers fill the brick buildings around a central plaza.",
    anchors: ['Hotel Emma', 'Culinary Institute of America', 'Cured', 'Bakery Lorraine', 'Pearl Farmers Market'],
    mustVisit: [
      { name: 'Hotel Emma',        note: 'Luxury hotel anchoring the brewhouse' },
      { name: 'Pearl Farmers Market', note: 'Saturday + Sunday morning market on the plaza' },
      { name: 'Tenko Ramen',       note: 'Food-hall counter inside Bottling Dept' }
    ],
    dining: [
      { name: 'Cured',              type: 'Charcuterie',  note: 'Steve McHugh James Beard semifinalist \u2014 the Pearl\u2019s flagship' },
      { name: 'Supper at Hotel Emma', type: 'New American', note: 'Seasonal tasting-menu option inside the hotel' },
      { name: 'Botika',             type: 'Peruvian-Asian', note: 'Geronimo Lopez \u2014 Peruvian-Asian fusion' },
      { name: 'Bakery Lorraine',    type: 'Bakery',        note: 'Signature laminated croissants' }
    ],
    tips: [
      'Pearl Farmers Market Saturday 9 AM\u2013noon is the food-hub moment',
      'River Walk Museum Reach connects you directly to SAMA and downtown',
      'Hotel Emma\u2019s Sternewirth lobby bar is worth a drink on its own'
    ],
    bestFor: ['Foodie', 'Landmark', 'Walking', 'Date', 'Farmers Market'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1883 Brewery', note: '22-acre Pearl Brewing campus restoration' },
      { icon: '\uD83C\uDF7D\uFE0F', label: '15+ Restaurants', note: 'Chef-driven dining, no chains' },
      { icon: '\uD83E\uDD55', label: 'Farmers Market', note: 'Saturday + Sunday morning on the plaza' }
    ]
  },
  {
    id: 2,
    name: 'The Shops at La Cantera',
    tagline: 'Luxury open-air shopping in North San Antonio.',
    tier: 'Luxury Open-Air', emoji: '\uD83D\uDC51',
    neighborhood: 'La Cantera / Far North',
    address: '15900 La Cantera Pkwy, San Antonio TX 78256',
    lat: 29.6013,
    lng: -98.6129,
    instagram: '@shopslacantera',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots + garages',
    score: 90,
    vibe: 'San Antonio\u2019s flagship luxury shopping center \u2014 open-air main-street layout anchoring the city\u2019s only real luxury-retail district.',
    about: "A 1.3 million sq ft open-air lifestyle center opened 2005 in the La Cantera district. 155+ stores anchored by Neiman Marcus, Dillard\u2019s, Macy\u2019s, Nordstrom, and a large Apple Store. Luxury tenants include Louis Vuitton, Gucci, Tiffany, Kate Spade \u2014 the highest-end concentration in the SA metro.",
    anchors: ['Neiman Marcus', 'Nordstrom', 'Dillard\u2019s', 'Macy\u2019s', 'Louis Vuitton'],
    mustVisit: [
      { name: 'Louis Vuitton',    note: 'SA flagship' },
      { name: 'Apple',           note: 'Large flagship store' },
      { name: 'Neiman Marcus',    note: 'The metro\u2019s only Neiman Marcus' }
    ],
    dining: [
      { name: 'Perry\u2019s Steakhouse', type: 'Steakhouse', note: '' },
      { name: 'Kona Grill',            type: 'Sushi/American', note: '' },
      { name: 'The Cheesecake Factory', type: 'American', note: '' }
    ],
    tips: [
      'Pair a morning Friedrich Wilderness hike with lunch + shopping here',
      'Valet at the Neiman Marcus entry puts you closest to luxury row',
      'La Cantera Resort next door offers stay-and-shop packages'
    ],
    bestFor: ['Luxury Shopping', 'Walking', 'Date', 'Open-Air'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDC51', label: 'Neiman Marcus Anchor', note: 'The metro\u2019s only Neiman Marcus location' },
      { icon: '\uD83C\uDF3F', label: 'Open-Air Main Street', note: 'Walkable outdoor grid' }
    ]
  },
  {
    id: 3,
    name: 'The Rim',
    tagline: 'Big-box + restaurant power center anchored by Bass Pro Shops.',
    tier: 'Open-Air Power Center', emoji: '\uD83D\uDED2',
    neighborhood: 'La Cantera / Far North',
    address: '17503 La Cantera Pkwy, San Antonio TX 78257',
    lat: 29.6102,
    lng: -98.6242,
    instagram: '@rimatloop1604',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots',
    score: 80,
    vibe: 'Largest open-air power center in the metro \u2014 big-box anchors, chain-restaurant row, and the Rim\u2019s iconic Bass Pro Shops Outdoor World.',
    about: "A 1.5 million sq ft open-air shopping center at Loop 1604 and I-10, directly across from La Cantera. Super Target, Sam\u2019s Club, Best Buy, Palladium AMC Luxury Theatre, Bass Pro Shops Outdoor World, Dick\u2019s Sporting Goods, plus a restaurant row including Topgolf adjacent.",
    anchors: ['Bass Pro Shops', 'Super Target', 'Sam\u2019s Club', 'AMC Palladium', 'Dick\u2019s Sporting Goods'],
    mustVisit: [
      { name: 'Bass Pro Shops Outdoor World', note: 'Destination-scale outdoor retailer' },
      { name: 'AMC Palladium Luxury',         note: 'IMAX + Dolby screens' }
    ],
    dining: [
      { name: 'Perry\u2019s Steakhouse',     type: 'Steakhouse', note: '' },
      { name: 'Brio Tuscan Grille',          type: 'Italian', note: '' },
      { name: 'Topgolf',                      type: 'Driving Range/Entertainment', note: 'Adjacent' }
    ],
    tips: [
      'Pair AMC Palladium with dinner at Perry\u2019s for the full big-night-out loop',
      'Bass Pro has its own aquarium and waterfall inside \u2014 family stop',
      'Sister retail La Cantera is a 3-min drive'
    ],
    bestFor: ['Shopping', 'Family', 'Movies', 'Big-Box'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFA3', label: 'Bass Pro Flagship', note: 'Destination-scale outdoor retailer' },
      { icon: '\uD83C\uDFAC', label: 'AMC Palladium', note: 'Luxury-recliner multiplex' }
    ]
  },
  {
    id: 4,
    name: 'North Star Mall',
    tagline: 'Traditional enclosed mall known for the 40-ft cowboy boots out front.',
    tier: 'Enclosed Mall', emoji: '\uD83D\uDC62',
    neighborhood: 'North Central',
    address: '7400 San Pedro Ave, San Antonio TX 78216',
    lat: 29.5371,
    lng: -98.4944,
    instagram: '@northstarmall',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots',
    score: 78,
    vibe: 'The classic San Antonio enclosed mall \u2014 Dillard\u2019s, Macy\u2019s, JCPenney, H&M, and 40-foot fiberglass cowboy boots out front as the city\u2019s iconic mall sculpture.',
    about: "A 1.3 million sq ft enclosed mall opened 1960 \u2014 San Antonio\u2019s classic regional mall. Dillard\u2019s, Macy\u2019s, JCPenney, Forever 21, H&M, and an Apple Store. The Bob \u201CDaddy-O\u201D Wade-sculpted 40-ft fiberglass cowboy boots (1980) sit at the San Pedro entrance \u2014 the mall\u2019s defining landmark.",
    anchors: ['Dillard\u2019s', 'Macy\u2019s', 'JCPenney', 'Forever 21', 'H&M'],
    mustVisit: [
      { name: '40-ft Cowboy Boots', note: 'Bob Wade\u2019s 1980 fiberglass sculpture at the entrance' },
      { name: 'Apple',              note: 'Flagship-size store' }
    ],
    dining: [
      { name: 'The Cheesecake Factory', type: 'American', note: 'Outparcel' }
    ],
    tips: [
      'Cowboy-boots photo is a required SA tourist stop',
      'Central location \u2014 closest major mall to downtown',
      'Food court is serviceable but Pearl or La Cantera are better real meals'
    ],
    bestFor: ['Shopping', 'Landmark', 'Photos', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDC62', label: '40-ft Cowboy Boots', note: 'City-icon sculpture at the entrance' },
      { icon: '\uD83C\uDFEC', label: 'Classic Enclosed', note: '1960 mall \u2014 Dillard\u2019s, Macy\u2019s, JCPenney anchors' }
    ]
  },
  {
    id: 5,
    name: 'Shops at Rivercenter',
    tagline: 'Downtown mall connected to the Riverwalk and the Alamo.',
    tier: 'Urban Mall', emoji: '\uD83D\uDED2',
    neighborhood: 'Downtown',
    address: '849 E Commerce St, San Antonio TX 78205',
    lat: 29.4256,
    lng: -98.4819,
    instagram: '@shopsatrivercenter',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Paid garages',
    score: 75,
    vibe: 'Downtown\u2019s only enclosed shopping mall, directly on a branch of the River Walk \u2014 a tourist-convenient stop between the Alamo and the waterway.',
    about: "A 1.2 million sq ft downtown mall opened 1988 at the easternmost lagoon of the River Walk. Macy\u2019s as anchor, plus Dillard\u2019s, IMAX theater, H&M, and a food court. Convenient access to Alamo (two blocks north) and the downtown Riverwalk boat-cruise launches.",
    anchors: ['Macy\u2019s', 'Dillard\u2019s', 'IMAX Theater', 'H&M'],
    mustVisit: [
      { name: 'IMAX Theater',          note: 'Plays the \u201CAlamo: The Price of Freedom\u201D film regularly' },
      { name: 'Rivercenter Boat Launch', note: 'River Walk cruises depart from the mall lagoon' }
    ],
    dining: [
      { name: 'Food Court', type: 'Food Court', note: 'Downtown mid-day quick-serve option' }
    ],
    tips: [
      'Use for Riverwalk-cruise access + a quick Alamo walk',
      'Paid garage \u2014 validate with any purchase',
      'Dillard\u2019s and Macy\u2019s here are smaller than their North Star counterparts'
    ],
    bestFor: ['Convenience', 'Rainy Day', 'Downtown'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF09', label: 'Riverwalk Connection', note: 'Directly on the downtown Riverwalk lagoon' },
      { icon: '\uD83C\uDFAC', label: 'IMAX', note: 'Alamo film + features' }
    ]
  },
  {
    id: 6,
    name: 'Market Square (El Mercado)',
    tagline: 'Largest Mexican market in North America.',
    tier: 'Historic Market', emoji: '\uD83C\uDF36\uFE0F',
    neighborhood: 'Downtown / West Side',
    address: '514 W Commerce St, San Antonio TX 78207',
    lat: 29.4251,
    lng: -98.5019,
    instagram: '@marketsquaresa',
    hours: 'Daily 10AM-8PM (shops)',
    parking: 'Paid garage',
    score: 86,
    vibe: 'Three downtown blocks of Mexican shopping and food \u2014 80+ stalls in the enclosed El Mercado, plus the Farmers Market Plaza with shops and restaurants.',
    about: "The largest Mexican market in North America, three square blocks of outdoor plazas and indoor markets on the near West Side. Shops sell pottery, leather, silver, Mexican dresses, crafts. Mi Tierra Caf\u00E9 y Panader\u00Eda anchors the Farmers Market Plaza as a 24-hour institution.",
    anchors: ['El Mercado (indoor)', 'Farmers Market Plaza', 'Mi Tierra Caf\u00E9', 'Market Square Stage'],
    mustVisit: [
      { name: 'El Mercado',       note: 'Indoor market with 80+ stalls of crafts and food' },
      { name: 'Mi Tierra Caf\u00E9', note: '1941-founded Mexican bakery + restaurant, 24 hours' }
    ],
    dining: [
      { name: 'Mi Tierra Caf\u00E9 y Panader\u00EDa', type: 'Tex-Mex', note: '24-hour institution since 1941' },
      { name: 'La Margarita',     type: 'Tex-Mex', note: 'Sister restaurant of Mi Tierra' }
    ],
    tips: [
      'Mi Tierra is worth the stop for the 24-hour Tex-Mex and bakery at any hour',
      'Outdoor stage programs free music most weekends \u2014 ch\u00EDchicuilote Mexican folkl\u00F3rico on sundays',
      'Cinco de Mayo and Diez y Seis are Market Square\u2019s biggest days'
    ],
    bestFor: ['Culture', 'Walking', 'Free Activity', 'Tex-Mex', 'Landmark'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF36\uFE0F', label: 'Largest Mexican Market', note: 'In North America \u2014 3 downtown blocks' },
      { icon: '\uD83D\uDCB0', label: '80+ Stalls', note: 'Pottery, leather, silver, Mexican crafts' },
      { icon: '\u23F0', label: 'Mi Tierra 24 Hours', note: '1941-founded bakery + restaurant open around the clock' }
    ]
  },
  {
    id: 7,
    name: 'La Villita Historic Arts Village',
    tagline: 'Adobe-and-brick artisan village in the heart of downtown.',
    tier: 'Historic Arts District', emoji: '\uD83C\uDFA8',
    neighborhood: 'Downtown',
    address: '418 Villita St, San Antonio TX 78205',
    lat: 29.4235,
    lng: -98.4894,
    instagram: '@lavillitasanantonio',
    hours: 'Daily 10AM-6PM (varies by vendor)',
    parking: 'Street + downtown garages',
    score: 83,
    vibe: 'One of the oldest neighborhoods in San Antonio \u2014 now a block of adobe and brick buildings housing 25+ galleries and artisan shops directly on the Riverwalk.',
    about: "A restored 1830s neighborhood of 25+ artisan galleries, jewelers, and Native and Mexican craft shops. Originally the home to Spanish colonial soldiers serving the Alamo and later immigrant Germans. Directly on the Riverwalk between Hemisfair and the Alamo; hosts A Night In Old San Antonio (NIOSA) during Fiesta each April.",
    anchors: ['25+ artisan galleries', 'Little Church of La Villita', 'Arneson River Theatre'],
    mustVisit: [
      { name: 'Arneson River Theatre', note: '1941 WPA-built amphitheater with river between stage + seats' },
      { name: 'Little Church of La Villita', note: '1879 chapel still in active use' }
    ],
    dining: [
      { name: 'Fig Tree Restaurant',   type: 'New American', note: 'Inside La Villita' },
      { name: 'Little Rhein Steakhouse', type: 'Steakhouse', note: '1847 building' }
    ],
    tips: [
      'Directly on the Riverwalk \u2014 arrive by river cruise',
      'Fiesta\u2019s NIOSA four-night event each April is the biggest moment',
      'Galleries close earlier than restaurants \u2014 plan a daytime arts walk'
    ],
    bestFor: ['Art', 'Historic', 'Walking', 'Gallery Hop'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1830s Neighborhood', note: 'Among the oldest blocks in SA' },
      { icon: '\uD83C\uDFAD', label: 'Arneson River Theatre', note: 'WPA-built amphitheater with river between stage and seats' },
      { icon: '\uD83C\uDFA8', label: '25+ Galleries', note: 'Native and Mexican craft shops' }
    ]
  },
  {
    id: 8,
    name: 'Alamo Quarry Market',
    tagline: 'Open-air shopping in the 1880 cement-plant smokestacks.',
    tier: 'Open-Air Power Center', emoji: '\uD83C\uDFD7\uFE0F',
    neighborhood: 'Alamo Heights',
    address: '255 E Basse Rd, San Antonio TX 78209',
    lat: 29.4899,
    lng: -98.4720,
    instagram: '@alamoquarry',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free surface lots',
    score: 80,
    vibe: 'Open-air shopping center built inside the ruins of the Alamo Cement Company quarry \u2014 four 1880s kiln smokestacks still stand as the site\u2019s landmark.',
    about: "Built 1997 on the site of the 1880 Alamo Cement Company quarry \u2014 the four original kiln smokestacks are preserved as the property\u2019s landmark. Whole Foods, TJ Maxx, Old Navy, Barnes & Noble, Regal Cinemas, plus a full restaurant row and a large H-E-B Central Market outpost.",
    anchors: ['Whole Foods Market', 'Barnes & Noble', 'Regal Cinemas', 'Old Navy', 'TJ Maxx'],
    mustVisit: [
      { name: 'Kiln Smokestacks',    note: 'Four 1880s brick kiln stacks preserved at center of property' },
      { name: 'Barnes & Noble',       note: 'Full-concept flagship' }
    ],
    dining: [
      { name: 'Perry\u2019s Steakhouse', type: 'Steakhouse', note: '' },
      { name: 'The Lion & Rose British Pub', type: 'Gastropub', note: '' }
    ],
    tips: [
      'Central Alamo Heights location \u2014 closest to McNay and Witte',
      'Whole Foods + Central Market combo is the city\u2019s best grocery run',
      'Smokestacks light up at night'
    ],
    bestFor: ['Shopping', 'Family', 'Open-Air', 'Dining', 'Movies'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFD7\uFE0F', label: '1880 Cement Kilns', note: 'Four original smokestacks preserved on site' },
      { icon: '\uD83C\uDF3F', label: 'Open-Air', note: 'Whole Foods + TJ Maxx + Barnes & Noble anchors' }
    ]
  },
  {
    id: 9,
    name: 'Wonderland of the Americas',
    tagline: 'Oldest enclosed mall in San Antonio \u2014 eclectic mix of retail + services.',
    tier: 'Enclosed Mall', emoji: '\uD83C\uDFEC',
    neighborhood: 'Balcones Heights',
    address: '4522 Fredericksburg Rd, San Antonio TX 78201',
    lat: 29.5019,
    lng: -98.5509,
    instagram: '',
    hours: 'Mon-Sat 10AM-9PM, Sun 12PM-6PM',
    parking: 'Free surface lots',
    score: 70,
    vibe: 'San Antonio\u2019s oldest mall, a 1961 enclosed center that has pivoted from traditional anchors to a mix of small retailers, healthcare clinics, local eateries, and movie theater.',
    about: "Opened 1961 as Wonderland Shopping City \u2014 the first enclosed shopping mall in Texas. Repositioned over the decades as a mixed-use center with a 14-screen Santikos movie theater, Burlington, Ross, Wonderland Bowl, and clinics from Christus Santa Rosa. Historical footnote more than a shopping destination.",
    anchors: ['Santikos 14 Cinemas', 'Burlington', 'Ross', 'Wonderland Bowl'],
    mustVisit: [
      { name: 'Santikos Cinemas', note: '14-screen SA-founded chain' },
      { name: 'Wonderland Bowl',   note: 'Bowling alley inside the mall' }
    ],
    dining: [
      { name: 'Food Court', type: 'Food Court', note: '' }
    ],
    tips: [
      'Movie + bowling combo is the main current use case',
      'Historical interest only for the original Texas indoor-mall status',
      'West side location \u2014 pair with a Market Square visit'
    ],
    bestFor: ['Movies', 'Bowling', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFEC', label: '1961 Mall', note: 'First enclosed mall in Texas' },
      { icon: '\uD83C\uDFB3', label: 'Wonderland Bowl', note: 'In-mall bowling alley' }
    ]
  },
  {
    id: 10,
    name: 'Ingram Park Mall',
    tagline: 'Regional enclosed mall serving the West Side.',
    tier: 'Enclosed Mall', emoji: '\uD83C\uDFEC',
    neighborhood: 'West Side',
    address: '6301 NW Loop 410, San Antonio TX 78238',
    lat: 29.4984,
    lng: -98.6044,
    instagram: '@ingramparkmall',
    hours: 'Mon-Sat 10AM-9PM, Sun 12PM-6PM',
    parking: 'Free surface lots',
    score: 72,
    vibe: 'Mid-tier regional enclosed mall anchoring the West Side of San Antonio \u2014 Dillard\u2019s, Dick\u2019s Sporting Goods, JCPenney, and a Santikos multiplex.',
    about: "A 1.1 million sq ft enclosed regional mall opened 1979 at Loop 410 and Ingram Rd. Dillard\u2019s, JCPenney, Dick\u2019s Sporting Goods, Ross, and 100+ inline stores. Santikos Cinemark movie theater on the ring, plus the mall food court.",
    anchors: ['Dillard\u2019s', 'JCPenney', 'Dick\u2019s Sporting Goods', 'Ross'],
    mustVisit: [
      { name: 'Dick\u2019s Sporting Goods', note: '' },
      { name: 'Santikos Ingram',       note: 'On-property multiplex' }
    ],
    dining: [
      { name: 'Food Court', type: 'Food Court', note: '' }
    ],
    tips: [
      'Closest regional mall to the West Side',
      'Lakeside shopping feel \u2014 nothing flashy, everything working',
      'Pair a visit with Six Flags Fiesta Texas a few miles west'
    ],
    bestFor: ['Shopping', 'Family', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFEC', label: 'Regional West Side', note: 'Anchor for the West Side and Helotes' },
      { icon: '\uD83C\uDFAC', label: 'Santikos Cinema', note: 'On-property multiplex' }
    ]
  }
];

const body = JSON.stringify(satMalls, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san antonio": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san antonio section into MALL_DATA with', satMalls.length, 'entries.');
