// Insert 'san diego' section into HOTEL_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

const declIdx = html.indexOf('const HOTEL_DATA =');
if (declIdx < 0) { console.error('HOTEL_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}
const block = html.slice(declIdx, closeIdx + 1);
if (/"san diego"\s*:/m.test(block)) {
  console.log('SKIP: HOTEL_DATA already has "san diego"');
  process.exit(0);
}

const sdHotels = [
  {
    id: 1,
    name: 'Hotel del Coronado',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: '1888 Victorian beach resort \u2014 the SD postcard.',
    neighborhood: 'Coronado',
    address: '1500 Orange Ave, Coronado CA 92118',
    lat: 32.6808, lng: -117.1786,
    instagram: '@hoteldel',
    website: 'https://hoteldel.com',
    priceRange: '$550-$3,000+/night',
    score: 96,
    awards: 'National Historic Landmark | Curio Collection by Hilton',
    about: "The Gilded Age queen of Coronado \u2014 opened 1888, among the largest wooden resorts in the world, directly on the glittering Coronado sand. A Charles Lindbergh stop, a Thomas Edison project (one of the first electric hotels), and the setting for Some Like It Hot.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'National Historic Landmark', note: '1888 Victorian; largest all-wood structure on West Coast' },
      { icon: '\uD83C\uDFD6\uFE0F', label: 'Coronado Beach', note: 'Dr. Beach Top-10 glittering sand directly on-property' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Serea', note: 'Ocean-side seafood anchor restaurant' },
      { icon: '\uD83C\uDFAC', label: 'Some Like It Hot (1959)', note: 'The film\u2019s Florida resort \u2014 actually filmed here' }
    ],
    insiderTips: [
      'Request a Victorian Beach Village room \u2014 original tower, not the 1970s addition',
      'Sunday brunch at Crown Room is a multi-generation SD tradition',
      'Walk Orange Ave north to Coronado Village for alternative dinner spots'
    ],
    bestFor: ['Special Occasion', 'Family', 'Beach', 'Historic Stay', 'Landmark']
  },
  {
    id: 2,
    name: 'Fairmont Grand Del Mar',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Forbes Five-Star Mediterranean palace in Carmel Valley.',
    neighborhood: 'Carmel Valley',
    address: '5300 Grand Del Mar Ct, San Diego CA 92130',
    lat: 32.9502, lng: -117.2092,
    instagram: '@fairmontgranddelmar',
    website: 'https://www.fairmont.com/san-diego',
    priceRange: '$800-$3,500+/night',
    score: 97,
    awards: 'Forbes Five-Star | AAA Five Diamond',
    about: "A 249-room Renaissance-Tuscan estate tucked into Los Penasquitos Canyon Preserve. A Tom Fazio-designed golf course, the Forbes Five-Star Addison (SD\u2019s only 3-Michelin-star restaurant), a 21,000 sq ft spa, and 80 miles of canyon trails begin at the property line.",
    highlights: [
      { icon: '\u2B50', label: 'Addison (3 Michelin Stars)', note: 'William Bradley\u2019s tasting-menu destination' },
      { icon: '\u26F3', label: 'Fazio Golf Course', note: 'Tom Fazio\u2019s canyon-routed 18 \u2014 resort-exclusive' },
      { icon: '\uD83E\uDDD6', label: '21,000 sq ft Spa', note: 'Forbes Five-Star spa with Roman-style pool' }
    ],
    insiderTips: [
      'Book Addison months ahead \u2014 seatings open at 9 AM 30 days out',
      'Canyon-view suites face the preserve; fairway-view face the 18th',
      'Villa Vantaggio is the resort\u2019s standalone 4-bedroom residence rental'
    ],
    bestFor: ['Special Occasion', 'Golf', 'Spa', 'Honeymoon', 'Michelin']
  },
  {
    id: 3,
    name: 'Rancho Valencia Resort & Spa',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Hacienda-style hideaway in Rancho Santa Fe.',
    neighborhood: 'Rancho Santa Fe',
    address: '5921 Valencia Cir, Rancho Santa Fe CA 92067',
    lat: 32.9845, lng: -117.2253,
    instagram: '@ranchovalencia',
    website: 'https://www.ranchovalencia.com',
    priceRange: '$1,000-$5,000+/night',
    score: 96,
    awards: 'Forbes Five-Star | Relais & Chateaux',
    about: "45 acres of lemon groves and bougainvillea in horse-country Rancho Santa Fe. Only 49 casita suites \u2014 every one with a private patio or outdoor soaking tub \u2014 18 tennis courts, a destination spa, and The Pony Room, a Relais & Chateaux member.",
    highlights: [
      { icon: '\uD83C\uDFE1', label: '49 Private Casitas', note: 'Every room has a private outdoor tub or patio' },
      { icon: '\uD83C\uDFBE', label: '18 Tennis Courts', note: 'Highest-ranked tennis resort on the West Coast' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'The Pony Room', note: 'Relais & Chateaux dining room' }
    ],
    insiderTips: [
      'A private-tub casita is non-negotiable \u2014 request one at booking',
      'Weekend tennis clinics are genuinely elite-level instruction',
      'Drive to the Del Mar racetrack in 10 minutes for summer racing'
    ],
    bestFor: ['Honeymoon', 'Couples', 'Tennis', 'Spa', 'Privacy']
  },
  {
    id: 4,
    name: 'The Lodge at Torrey Pines',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Craftsman lodge on the 18th green at Torrey Pines.',
    neighborhood: 'La Jolla / Torrey Pines',
    address: '11480 N Torrey Pines Rd, La Jolla CA 92037',
    lat: 32.8906, lng: -117.2515,
    instagram: '@lodgetorreypines',
    website: 'https://www.lodgetorreypines.com',
    priceRange: '$550-$2,000+/night',
    score: 93,
    awards: 'AAA Five Diamond',
    about: "A Greene-and-Greene-inspired California Craftsman lodge overlooking the 18th green of Torrey Pines Golf Course \u2014 host of the 2008 and 2021 U.S. Opens. 169 rooms, A.R. Valentien (farm-to-table anchor), and the Torrey Pines State Reserve trails begin across the road.",
    highlights: [
      { icon: '\u26F3', label: '18th Green of Torrey Pines', note: 'Two U.S. Opens (2008, 2021); resort golf rates available' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Craftsman Lodge Architecture', note: 'Greene-and-Greene-inspired woodwork and art' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'A.R. Valentien', note: 'Farm-to-table anchor; Sunday brunch is legendary' }
    ],
    insiderTips: [
      'Lodge guests get preferred Torrey Pines golf tee times',
      'Torrey Pines State Reserve trailhead is a 5-minute walk',
      'Request an 18th-green view room \u2014 Ocean Course finishes right outside'
    ],
    bestFor: ['Golf', 'Couples', 'Special Occasion', 'Spa']
  },
  {
    id: 5,
    name: "L'Auberge Del Mar",
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Village-center beach retreat two blocks from the sand.',
    neighborhood: 'Del Mar',
    address: '1540 Camino Del Mar, Del Mar CA 92014',
    lat: 32.9591, lng: -117.2646,
    instagram: '@laubergedelmar',
    website: 'https://www.laubergedelmar.com',
    priceRange: '$500-$1,800+/night',
    score: 90,
    awards: 'AAA Four Diamond',
    about: "A 121-room village-style resort sitting at the heart of Del Mar, two short blocks from the Pacific and one block from the Del Mar Racetrack. Kitchen 1540 (its farm-to-table anchor), a heated pool facing the ocean, and a coastal clifftop path that starts at the property.",
    highlights: [
      { icon: '\uD83C\uDFD6\uFE0F', label: 'Two Blocks to Sand', note: 'Shortest walk to Del Mar Beach of any luxury hotel' },
      { icon: '\uD83C\uDFC7', label: 'Del Mar Racetrack', note: 'One block to the summer racing scene' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Kitchen 1540', note: 'Farm-to-table coastal dining' }
    ],
    insiderTips: [
      'Summer racing season (mid-July to early Sept) is the signature window',
      'Ocean-view rooms are worth the upgrade \u2014 top-floor gets the full Pacific',
      'Walk to Del Mar Plaza for alternate dinners \u2014 Jake\u2019s Del Mar and Americana'
    ],
    bestFor: ['Beach', 'Couples', 'Racing Season', 'Village Stay']
  },
  {
    id: 6,
    name: 'Pendry San Diego',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Gaslamp design-hotel flagship of the Pendry brand.',
    neighborhood: 'Gaslamp',
    address: '550 J St, San Diego CA 92101',
    lat: 32.7105, lng: -117.1580,
    instagram: '@pendrysd',
    website: 'https://www.pendry.com/san-diego',
    priceRange: '$450-$1,800+/night',
    score: 92,
    awards: 'Conde Nast Traveler Hot List debut',
    about: "Montage Hotels\u2019 lifestyle flagship in the Gaslamp Quarter \u2014 317 rooms, seven bars and restaurants, and the Lionfish rooftop pool deck. Design-forward public spaces, Provisional (all-day cafe), and the Fairweather rooftop tiki bar all on-property.",
    highlights: [
      { icon: '\uD83C\uDF78', label: '7 Bars & Restaurants', note: 'Lionfish, Provisional, Fairweather, Oak & Hive' },
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'Central Gaslamp open-air deck' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Lionfish', note: 'Coastal seafood \u2014 Gaslamp scene restaurant' }
    ],
    insiderTips: [
      'Fairweather tiki bar doubles the fun of a Gaslamp night out',
      'Request a south-facing room high up \u2014 Petco Park + bay view',
      'Walk to Petco Park in 5 minutes for Padres games'
    ],
    bestFor: ['Design', 'Gaslamp Nightlife', 'Couples', 'Baseball']
  },
  {
    id: 7,
    name: 'Park Hyatt Aviara',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'North County resort overlooking Batiquitos Lagoon.',
    neighborhood: 'Carlsbad',
    address: '7100 Aviara Resort Dr, Carlsbad CA 92011',
    lat: 33.0974, lng: -117.2911,
    instagram: '@parkhyattaviara',
    website: 'https://www.hyatt.com/park-hyatt/sandp',
    priceRange: '$500-$1,800+/night',
    score: 92,
    awards: 'AAA Five Diamond',
    about: "329 rooms on a 200-acre Carlsbad hilltop facing Batiquitos Lagoon and the Pacific. The only Arnold Palmer-designed course in San Diego County, a Forbes-rated spa, and the Carlsbad Flower Fields are a 10-minute drive away.",
    highlights: [
      { icon: '\u26F3', label: 'Arnold Palmer Course', note: 'Only Palmer design in SD County \u2014 ocean-view finishing holes' },
      { icon: '\uD83E\uDDD6', label: 'Forbes-Rated Spa', note: 'California coast-inspired treatments' },
      { icon: '\uD83C\uDF38', label: 'Carlsbad Flower Fields', note: '10-minute drive; peak bloom March-May' }
    ],
    insiderTips: [
      'Lagoon-view rooms beat the fairway side for the sunset',
      'Kid\'s Club is one of the best in SD \u2014 full-day drop-off available',
      'Palmer course walk-on tee times occasionally open at dusk'
    ],
    bestFor: ['Golf', 'Family', 'Spa', 'North County']
  },
  {
    id: 8,
    name: 'La Valencia Hotel',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Pink Lady of La Jolla \u2014 a 1926 village landmark.',
    neighborhood: 'La Jolla',
    address: '1132 Prospect St, La Jolla CA 92037',
    lat: 32.8496, lng: -117.2740,
    instagram: '@lavalenciahotel',
    website: 'https://www.lavalencia.com',
    priceRange: '$450-$2,000+/night',
    score: 90,
    awards: 'National Register of Historic Places',
    about: "The pink Mediterranean landmark of La Jolla Village \u2014 opened 1926 as a movie-star hideaway for Charlie Chaplin, Greta Garbo, and Groucho Marx. 114 rooms, The Med (ocean-view patio), and the La Jolla Cove a short walk down the hill.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1926 Landmark', note: 'National Register building; the pink icon of La Jolla' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'The Med', note: 'Ocean-view Mediterranean patio \u2014 sunset anchor' },
      { icon: '\uD83C\uDFAD', label: 'Whaling Bar History', note: 'The writers\u2019 bar \u2014 Dr. Seuss regulars\u2019 table' }
    ],
    insiderTips: [
      'Ocean-view suites on the north side face the cove and sunset',
      'The Med terrace doesn\'t take reservations for sunset \u2014 arrive by 5 PM',
      'Walk down Coast Blvd to La Jolla Cove in 5 minutes'
    ],
    bestFor: ['Historic Stay', 'Couples', 'La Jolla Village', 'Sunset']
  },
  {
    id: 9,
    name: 'The US Grant',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: '1910 Beaux-Arts landmark on Broadway.',
    neighborhood: 'Downtown',
    address: '326 Broadway, San Diego CA 92101',
    lat: 32.7165, lng: -117.1604,
    instagram: '@usgranthotel',
    website: 'https://www.marriott.com/en-us/hotels/sanlc-the-us-grant',
    priceRange: '$350-$1,200+/night',
    score: 88,
    awards: 'National Register of Historic Places | Luxury Collection',
    about: "Built in 1910 by Ulysses S. Grant Jr. as a memorial to his father, a Beaux-Arts Broadway landmark that has hosted 14 U.S. presidents. 270 rooms in the Luxury Collection portfolio; Grant Grill on the lobby level is a century-old power-lunch room.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1910 Beaux-Arts', note: 'National Register; 14 U.S. presidents hosted' },
      { icon: '\uD83C\uDF78', label: 'Grant Grill', note: 'Century-old downtown power-lunch room' },
      { icon: '\uD83D\uDCBC', label: 'Luxury Collection', note: 'Marriott\u2019s historic-trophy brand' }
    ],
    insiderTips: [
      'Grant Grill happy hour in the library-style bar is a quiet insider ritual',
      'Walk to Gaslamp in 3 minutes and Horton Plaza shops in 1',
      'Presidential Suite is on the 11th floor \u2014 restored 1920s detail'
    ],
    bestFor: ['Historic Stay', 'Business', 'Walkable Downtown', 'Power Lunch']
  },
  {
    id: 10,
    name: 'Manchester Grand Hyatt San Diego',
    tier: 'Upscale', tierEmoji: '\u2B50',
    tagline: 'Tallest waterfront hotel in California \u2014 bayfront convention anchor.',
    neighborhood: 'Downtown / Embarcadero',
    address: '1 Market Pl, San Diego CA 92101',
    lat: 32.7080, lng: -117.1691,
    instagram: '@manchestergrandhyatt',
    website: 'https://www.hyatt.com/hyatt-regency/sandrgh',
    priceRange: '$300-$900/night',
    score: 86,
    awards: '',
    about: "Two towers on the Embarcadero waterfront with 1,628 rooms \u2014 the tallest waterfront hotel in California. Top of the Hyatt (40th-floor bar), direct access to Seaport Village, and connected to the San Diego Convention Center by skybridge.",
    highlights: [
      { icon: '\uD83C\uDF0C', label: 'Top of the Hyatt', note: 'SD\u2019s highest bar \u2014 40th floor panorama' },
      { icon: '\uD83C\uDFDE\uFE0F', label: 'Seaport Village Access', note: 'Directly next door' },
      { icon: '\uD83C\uDFE2', label: 'Convention Center Skybridge', note: 'Connected to SDCC without stepping outside' }
    ],
    insiderTips: [
      'Request a corner room in the Harbor Tower for Coronado Bridge views',
      'Top of the Hyatt opens at 5 PM \u2014 arrive early for sunset window seats',
      'Walk 10 minutes to Little Italy via the Embarcadero path'
    ],
    bestFor: ['Business', 'Convention', 'Views', 'Waterfront']
  },
  {
    id: 11,
    name: 'Mission Pacific Hotel',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Top Gun Maverick house \u2014 Oceanside\u2019s design resort.',
    neighborhood: 'Oceanside',
    address: '201 N Myers St, Oceanside CA 92054',
    lat: 33.1941, lng: -117.3813,
    instagram: '@missionpacifichotel',
    website: 'https://missionpacifichotel.com',
    priceRange: '$400-$1,500+/night',
    score: 89,
    awards: 'Marriott Tribute Portfolio',
    about: "A 161-room design resort directly across from the Oceanside Pier \u2014 the property includes the restored 1887 Top Gun House where Goose\u2019s cottage scene from Top Gun was filmed, now a High/Low cafe. Rooftop pool with pier and ocean views, Valle next door (Michelin 2-star).",
    highlights: [
      { icon: '\uD83C\uDFE1', label: 'Top Gun House (1887)', note: 'Restored Victorian cottage on-property, now a cafe' },
      { icon: '\uD83C\uDFCA', label: 'Rooftop Pool', note: 'Pier and Pacific views \u2014 best in North County' },
      { icon: '\u2B50', label: 'Valle (2 Michelin Stars)', note: 'Chef Roberto Alcocer next door' }
    ],
    insiderTips: [
      'Book a pier-facing room \u2014 Oceanside Pier is the view',
      'Valle books 60 days out at 9 AM \u2014 set a calendar reminder',
      'Walk the pier at dawn for the classic Oceanside sunrise surfer shot'
    ],
    bestFor: ['Design', 'Couples', 'North County', 'Michelin']
  },
  {
    id: 12,
    name: 'Kona Kai Resort',
    tier: 'Upscale', tierEmoji: '\u2B50',
    tagline: 'Shelter Island waterfront resort with marina pier.',
    neighborhood: 'Shelter Island',
    address: '1551 Shelter Island Dr, San Diego CA 92106',
    lat: 32.7131, lng: -117.2304,
    instagram: '@konakairesort',
    website: 'https://www.resortkonakai.com',
    priceRange: '$300-$800/night',
    score: 84,
    awards: 'Noble House Hotels & Resorts',
    about: "The only true waterfront resort on Shelter Island \u2014 129 rooms, a private beach on the bay, a marina-adjacent pool, and SUP/kayak rentals off the property pier. Views of the downtown skyline across the bay.",
    highlights: [
      { icon: '\uD83C\uDFDD\uFE0F', label: 'Private Bay Beach', note: 'Calm water \u2014 kids swim, adults paddleboard' },
      { icon: '\uD83C\uDFCA', label: 'Pool & Marina Pier', note: 'Skyline view across San Diego Bay' },
      { icon: '\uD83C\uDFA3', label: 'Sportfishing Charters', note: 'Depart from Shelter Island marina next door' }
    ],
    insiderTips: [
      'Marina-view rooms face downtown \u2014 best sunset skyline shot',
      'SUP rentals off the property pier are cheaper than Mission Bay',
      'Point Loma Seafoods is a 5-minute drive for takeaway'
    ],
    bestFor: ['Family', 'Watersports', 'Value Waterfront']
  }
];

const body = JSON.stringify(sdHotels, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san diego": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san diego section into HOTEL_DATA with', sdHotels.length, 'entries.');
