// Insert 'phoenix' section into HOTEL_DATA in index.html.
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
if (/"phoenix"\s*:/m.test(block)) {
  console.log('SKIP: HOTEL_DATA already has "phoenix"');
  process.exit(0);
}

const phxHotels = [
  {
    id: 1,
    name: 'Arizona Biltmore, A Waldorf Astoria Resort',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Frank Lloyd Wright-inspired 1929 \u201CJewel of the Desert.\u201D',
    neighborhood: 'Biltmore',
    address: '2400 E Missouri Ave, Phoenix AZ 85016',
    lat: 33.5175, lng: -112.0261,
    instagram: '@arizonabiltmore',
    website: 'https://www.hilton.com/en/hotels/phxazwa-arizona-biltmore',
    priceRange: '$500-$2,500+/night',
    score: 96,
    awards: 'Historic Hotels of America | Waldorf Astoria',
    about: "Opened 1929 on Albert Chase McArthur\u2019s textile-block plans with Frank Lloyd Wright consulting \u2014 the canonical Arizona luxury resort. 39 acres, eight pools, the Adam Tihany-redesigned Wright Bar, and the Squaw Peak Gardens as host to generations of Phoenix power politics. Irving Berlin wrote \u201CWhite Christmas\u201D poolside here.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1929 Landmark', note: 'McArthur/Wright textile-block architecture' },
      { icon: '\uD83C\uDFCA', label: 'Eight Pools', note: 'Catalina pool has the iconic Wright tile mural' },
      { icon: '\uD83C\uDF78', label: 'Wright Bar', note: 'Re-opened 2022 after Tihany refresh \u2014 signature tequila program' },
      { icon: '\uD83C\uDFCC\uFE0F', label: 'Adobe & Links Golf', note: 'Two 18-hole courses on-property' }
    ],
    insiderTips: [
      'Paradise Wing rooms face the historic gardens \u2014 not the driveway',
      'Cabanas at Saguaro Pool book same-day only, early',
      'Sunday brunch at Wright\u2019s at the Biltmore is the Phoenix social-set standard'
    ],
    bestFor: ['Special Occasion', 'Historic Stay', 'Golf', 'Spa', 'Landmark']
  },
  {
    id: 2,
    name: 'Royal Palms Resort and Spa',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Mediterranean estate at the base of Camelback Mountain.',
    neighborhood: 'Arcadia / Camelback',
    address: '5200 E Camelback Rd, Phoenix AZ 85018',
    lat: 33.5078, lng: -111.9697,
    instagram: '@royalpalmsresort',
    website: 'https://www.royalpalmshotel.com',
    priceRange: '$450-$1,500+/night',
    score: 92,
    awards: 'Unbound Collection by Hyatt',
    about: "A 1929 Mediterranean estate built by Cunard Steamship exec Delos Willard Cooke, converted to resort use in 1948. 119 keys, hand-laid mosaic floors, T. Cook\u2019s flagship Italian dining room, and the quieter alternative to the Biltmore for the same Camelback-adjacent address.",
    highlights: [
      { icon: '\uD83D\uDC51', label: 'Estate Rooms', note: 'Villas with private courtyards and wood-burning fireplaces' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'T. Cook\u2019s', note: 'Italian-Mediterranean \u2014 one of Phoenix\u2019s best longstanding dining rooms' },
      { icon: '\uD83C\uDFDE\uFE0F', label: 'Camelback View', note: 'South flank of the mountain frames the pool' }
    ],
    insiderTips: [
      'Estate rooms and casitas are the ones to request; main-building rooms are smaller',
      'Sunday brunch at T. Cook\u2019s is beloved \u2014 reserve a week out',
      'Bocce ball court and Alegr\u00EDa Garden seating overlook the mountain'
    ],
    bestFor: ['Special Occasion', 'Spa', 'Historic Stay', 'Honeymoon']
  },
  {
    id: 3,
    name: 'The Phoenician, A Luxury Collection Resort',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Camelback-flanked 250-acre resort with championship golf and Forbes-rated spa.',
    neighborhood: 'Scottsdale / Camelback',
    address: '6000 E Camelback Rd, Scottsdale AZ 85251',
    lat: 33.5105, lng: -111.9544,
    instagram: '@thephoenician',
    website: 'https://www.thephoenician.com',
    priceRange: '$550-$3,000+/night',
    score: 94,
    awards: 'AAA Five Diamond | Forbes Five-Star Spa',
    about: "250 acres on the south flank of Camelback Mountain. 643 keys, nine pools (including a mother-of-pearl-tiled signature pool), a 27-hole championship golf course, a Forbes Five-Star spa, and J&G Steakhouse from the Vongerichten family as resident dining anchor.",
    highlights: [
      { icon: '\uD83C\uDFCC\uFE0F', label: '27-Hole Golf', note: 'Championship layout on the lower Camelback flank' },
      { icon: '\uD83E\uDDD6', label: 'Forbes Five-Star Spa', note: 'Indigenous-inspired 24,000 sq ft sanctuary' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'J&G Steakhouse', note: 'Jean-Georges Vongerichten\u2019s resident steakhouse' },
      { icon: '\uD83C\uDFCA', label: '9 Pools', note: 'Mother-of-pearl tiled signature pool' }
    ],
    insiderTips: [
      'Canyon Suites is the ultra-premium boutique wing with private check-in',
      'Cabanas at the Marquee adult pool book out by Thursday for weekends',
      'Ask for a Camelback Mountain-view room \u2014 worth the upcharge'
    ],
    bestFor: ['Special Occasion', 'Golf', 'Spa', 'Family', 'Honeymoon']
  },
  {
    id: 4,
    name: 'Omni Scottsdale Resort & Spa at Montelucia',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Andalusian-village resort in Paradise Valley.',
    neighborhood: 'Paradise Valley',
    address: '4949 E Lincoln Dr, Scottsdale AZ 85253',
    lat: 33.5324, lng: -111.9683,
    instagram: '@omnimontelucia',
    website: 'https://www.omnihotels.com/hotels/scottsdale-montelucia',
    priceRange: '$400-$1,500+/night',
    score: 90,
    awards: '',
    about: "A 293-key Andalusian-Moorish village on the Paradise Valley slope of Camelback Mountain. Resident dining from Prado by Beau MacMillan, five pools, and the cool-blue Joya Spa modeled on a Moroccan hammam. Opened 2008 under the Intercontinental flag; now Omni.",
    highlights: [
      { icon: '\uD83C\uDFE0', label: 'Andalusian Village', note: 'Stucco casitas, tile fountains, and courtyard medina' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Prado Restaurant', note: 'Beau MacMillan Mediterranean \u2014 signature dining' },
      { icon: '\uD83E\uDDD6', label: 'Joya Spa', note: 'Moroccan-hammam-inspired spa and pool deck' }
    ],
    insiderTips: [
      'Centro Pool is adults-only; Oasis Pool is family-friendly',
      'Ask for a Camelback-view room \u2014 premium wing',
      'Sanctuary Suites have two-room layouts for families'
    ],
    bestFor: ['Spa', 'Special Occasion', 'Family', 'Date']
  },
  {
    id: 5,
    name: 'Four Seasons Resort Scottsdale at Troon North',
    tier: 'Ultra Luxury', tierEmoji: '\uD83D\uDC51',
    tagline: 'Adobe casitas in the Sonoran foothills above Pinnacle Peak.',
    neighborhood: 'North Scottsdale / Troon',
    address: '10600 E Crescent Moon Dr, Scottsdale AZ 85262',
    lat: 33.7382, lng: -111.8583,
    instagram: '@fsscottsdale',
    website: 'https://www.fourseasons.com/scottsdale',
    priceRange: '$900-$3,000+/night',
    score: 95,
    awards: 'AAA Five Diamond',
    about: "210 free-standing adobe casitas on 40 acres at the base of Pinnacle Peak. Two Tom Weiskopf Troon North courses steps from the lobby, Talavera as the on-site steakhouse, and the darkest night skies of any Valley resort. Remote enough that the drive in itself is part of the stay.",
    highlights: [
      { icon: '\uD83C\uDFE0', label: 'Standalone Casitas', note: 'No connecting walls \u2014 210 adobe bungalows' },
      { icon: '\uD83C\uDFCC\uFE0F', label: 'Troon North Golf', note: 'Two championship Weiskopf courses steps from the lobby' },
      { icon: '\uD83C\uDF19', label: 'Dark-Sky Setting', note: 'Best stargazing of any Valley luxury resort' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Talavera', note: 'On-property steakhouse with Pinnacle Peak view' }
    ],
    insiderTips: [
      'Pinnacle Peak trail starts five minutes from the lobby \u2014 sunrise hike',
      'Saguaro Blossom packages run late-spring \u2014 cactus blooms are spectacular',
      'Late spring to early fall pricing drops sharply; shoulder-season sweet spot'
    ],
    bestFor: ['Special Occasion', 'Golf', 'Honeymoon', 'Privacy', 'Dark-Sky']
  },
  {
    id: 6,
    name: 'The Westin Kierland Resort & Spa',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Scottish-themed 27-hole golf resort anchoring Kierland Commons.',
    neighborhood: 'Kierland / North Scottsdale',
    address: '6902 E Greenway Pkwy, Scottsdale AZ 85254',
    lat: 33.6262, lng: -111.9283,
    instagram: '@westinkierland',
    website: 'https://www.marriott.com/hotels/travel/phxwk-the-westin-kierland-resort-and-spa',
    priceRange: '$350-$1,200+/night',
    score: 88,
    awards: '',
    about: "A 735-room resort anchoring Kierland Commons shopping \u2014 27 holes of Scottish-themed golf, a FlowRider surf park, bagpipers at sunset, and the tallest waterslide of any Valley resort. Family-leaning but with adult pool options, and the kind of scale that absorbs conventions without feeling overrun.",
    highlights: [
      { icon: '\uD83C\uDFCC\uFE0F', label: '27 Holes Golf', note: 'Links-style layout \u2014 greens fees open to non-guests' },
      { icon: '\uD83C\uDF0A', label: 'FlowRider', note: 'Stationary-wave surf simulator at the Adventure Water Park' },
      { icon: '\uD83E\uDD5B', label: 'Scotch Library', note: '200+ whiskeys; the bagpiper plays at sunset' }
    ],
    insiderTips: [
      'Adult pool is hidden behind the spa \u2014 the quieter option',
      'Kierland Commons and Scottsdale Quarter are a 5-minute walk',
      'FlowRider lessons sell out by 9 AM weekends'
    ],
    bestFor: ['Family', 'Golf', 'Value Luxury', 'Shopping']
  },
  {
    id: 7,
    name: 'Sanctuary Camelback Mountain, A Gurney\u2019s Resort',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Mid-century hideaway clinging to Camelback\u2019s north slope.',
    neighborhood: 'Paradise Valley / Camelback',
    address: '5700 E McDonald Dr, Paradise Valley AZ 85253',
    lat: 33.5318, lng: -111.9532,
    instagram: '@sanctuaryoncamelback',
    website: 'https://sanctuarycamelback.com',
    priceRange: '$600-$2,500+/night',
    score: 93,
    awards: 'Forbes Five-Star Spa',
    about: "53 acres on the north flank of Camelback Mountain, originally John Gardiner\u2019s tennis ranch from the 1960s. 109 casitas and mountain villas, the renowned elements restaurant (Beau MacMillan before his Montelucia move), an infinity pool above the Valley, and the Sanctuary Spa \u2014 Forbes Five-Star.",
    highlights: [
      { icon: '\uD83C\uDFDD\uFE0F', label: 'Casita Hillside', note: 'Mountain villas climb the Camelback north slope' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'elements', note: 'Signature Asian-accented American with a Camelback view' },
      { icon: '\uD83E\uDDD6', label: 'Sanctuary Spa', note: 'Forbes Five-Star spa with outdoor meditation garden' },
      { icon: '\uD83C\uDFCA', label: 'Infinity Pool', note: 'Bridges the canyon, faces west over PV' }
    ],
    insiderTips: [
      'Mountain Casita Suites with private plunge pools are the flagship room category',
      'Jade Bar\u2019s Sunday Swing brunch is iconic for the Valley luxury set',
      'Sunset from the infinity pool is the shot'
    ],
    bestFor: ['Honeymoon', 'Spa', 'Special Occasion', 'Date', 'Privacy']
  },
  {
    id: 8,
    name: 'Hermosa Inn',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Intimate 43-casita hacienda built by cowboy artist Lon Megargee.',
    neighborhood: 'Paradise Valley',
    address: '5532 N Palo Cristi Rd, Paradise Valley AZ 85253',
    lat: 33.5282, lng: -112.0014,
    instagram: '@hermosainn',
    website: 'https://www.hermosainn.com',
    priceRange: '$400-$1,200+/night',
    score: 91,
    awards: 'Relais & Ch\u00E2teaux',
    about: "A 43-casita hacienda inn built in the 1930s by Western cowboy artist Lon Megargee as his own home and studio. Adobe fireplaces, hand-hewn beams, and LON\u2019s as the resident restaurant \u2014 a consistent top Valley dining room. Among the smallest-scale luxury stays in the metro.",
    highlights: [
      { icon: '\uD83C\uDFE0', label: '43 Casitas Only', note: 'Small-scale, intimate alternative to the mega-resorts' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'LON\u2019s', note: 'Paradise Valley restaurant icon \u2014 patio is the reservation to secure' },
      { icon: '\uD83D\uDD25', label: 'Adobe Fireplaces', note: 'Wood-burning fireplaces in every casita' }
    ],
    insiderTips: [
      'LON\u2019s Last Drop Bar is the grown-up Paradise Valley cocktail stop',
      'Book early \u2014 the inn sells out Jan\u2013April and around Waste Management Open',
      'Pool deck is small; not a pool-day resort. Go for the intimacy.'
    ],
    bestFor: ['Special Occasion', 'Date', 'Privacy', 'Foodie', 'Historic Stay']
  },
  {
    id: 9,
    name: 'Mountain Shadows Resort Scottsdale',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Redesigned mid-century modernist resort between Mummy and Camelback.',
    neighborhood: 'Paradise Valley',
    address: '5445 E Lincoln Dr, Paradise Valley AZ 85253',
    lat: 33.5333, lng: -111.9613,
    instagram: '@mountainshadowsresort',
    website: 'https://www.mountainshadows.com',
    priceRange: '$400-$1,200+/night',
    score: 90,
    awards: '',
    about: "A 183-key mid-century-modern rebuild of the original 1959 Mountain Shadows on the same site between Mummy and Camelback mountains. Short-course golf (the country\u2019s best par-3 course per Golfweek), Hearth \u201961 restaurant, Rusty\u2019s cocktail bar, and clean-line design that reads Palm Springs more than Scottsdale.",
    highlights: [
      { icon: '\u26F3', label: 'The Short Course', note: '18-hole par-3 \u2014 Golfweek top par-3 layout in the country' },
      { icon: '\uD83C\uDFD7\uFE0F', label: 'Mid-Century Design', note: 'Allen + Philp rebuild stays true to the 1959 source' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Hearth \u201961', note: 'Hearth restaurant \u2014 wood-fired Sonoran-Cal' }
    ],
    insiderTips: [
      'Citrus Club rooftop bar is reserved for guests \u2014 sunset over Camelback',
      'Mid-level pool suites are upgraded over lobby-level rooms at modest cost',
      'Short Course plays fast \u2014 great hangover round'
    ],
    bestFor: ['Golf', 'Date', 'Special Occasion', 'Design Lover']
  },
  {
    id: 10,
    name: 'Boulders Resort & Spa',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Adobe casitas among 12-million-year-old granite boulders in Carefree.',
    neighborhood: 'Carefree',
    address: '34631 N Tom Darlington Dr, Carefree AZ 85377',
    lat: 33.8274, lng: -111.9211,
    instagram: '@bouldersresort',
    website: 'https://www.theboulders.com',
    priceRange: '$350-$1,500+/night',
    score: 89,
    awards: '',
    about: "A 1,300-acre resort 30 miles north of Phoenix, with 160 pueblo-style casitas tucked among exposed granite formations. 36 holes of Jay Morrish golf (South Course is the signature), a Golden Door Spa, and full dark-sky skies \u2014 the best stargazing of the regional luxury options.",
    highlights: [
      { icon: '\uD83C\uDFCC\uFE0F', label: '36 Holes Golf', note: 'Jay Morrish South and North courses' },
      { icon: '\uD83E\uDEA8', label: 'Boulder Formations', note: '12-million-year-old granite piles thread the property' },
      { icon: '\uD83C\uDF19', label: 'Dark Skies', note: 'Carefree\u2019s remote location delivers real stargazing' },
      { icon: '\uD83E\uDDD6', label: 'Golden Door Spa', note: '33,000 sq ft spa descended from the original Golden Door in California' }
    ],
    insiderTips: [
      'Golf + Spa packages typically beat a la carte pricing',
      'Carefree town plaza and Sundial are a 5-minute drive',
      'Discovery Rock \u2014 an open-sky boulder plateau \u2014 is the resort\u2019s quiet sunset spot'
    ],
    bestFor: ['Golf', 'Spa', 'Honeymoon', 'Privacy', 'Dark-Sky']
  },
  {
    id: 11,
    name: 'Hotel Valley Ho',
    tier: 'Boutique', tierEmoji: '\uD83C\uDF8E',
    tagline: 'Restored 1956 mid-century modernist hotel in Old Town Scottsdale.',
    neighborhood: 'Old Town Scottsdale',
    address: '6850 E Main St, Scottsdale AZ 85251',
    lat: 33.4927, lng: -111.9254,
    instagram: '@hotelvalleyho',
    website: 'https://www.hotelvalleyho.com',
    priceRange: '$300-$1,000+/night',
    score: 87,
    awards: 'National Register of Historic Places',
    about: "Architect Edward L. Varney\u2019s 1956 resort \u2014 a Hollywood getaway that hosted Marilyn Monroe, Tony Curtis, Natalie Wood \u2014 restored 2005 into its mid-century bones. Pool deck centered on the property, OH Pool cocktail scene, ZuZu diner with a Sputnik chandelier, and a walkable Old Town location that none of the mountain resorts have.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1956 Modernist', note: 'Edward Varney\u2019s original mid-century plan, faithfully restored' },
      { icon: '\uD83C\uDFCA', label: 'OH Pool Club', note: 'Weekend pool-party scene \u2014 DJs on the deck' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'ZuZu', note: 'Diner with Sputnik chandelier \u2014 anchor brunch spot' }
    ],
    insiderTips: [
      'Tower suites on the upper floors have the Camelback views',
      'Weekend pool scene gets loud \u2014 tower rooms insulate best',
      'Main Street galleries and Scottsdale Fashion Square are both walkable'
    ],
    bestFor: ['Design Lover', 'Couples', 'Historic Stay', 'Shopping', 'Walking']
  },
  {
    id: 12,
    name: 'Andaz Scottsdale Resort & Bungalows',
    tier: 'Luxury', tierEmoji: '\u2728',
    tagline: 'Mid-century-inspired bungalow resort at the base of Camelback.',
    neighborhood: 'Paradise Valley',
    address: '6114 N Scottsdale Rd, Paradise Valley AZ 85253',
    lat: 33.5235, lng: -111.9280,
    instagram: '@andazscottsdale',
    website: 'https://www.hyatt.com/andaz/phxas-andaz-scottsdale-resort-and-bungalows',
    priceRange: '$400-$1,500+/night',
    score: 88,
    awards: '',
    about: "201 bungalow-style keys across 23 acres on the former Doubletree Paradise Valley site, reimagined 2016 by Allen + Philp with a California mid-century sensibility. Weft & Warp as the on-site restaurant, Palo Verde Spa organized in private treatment houses, and consistent rotating art via a local-artist residency program.",
    highlights: [
      { icon: '\uD83C\uDFE1', label: 'Bungalow Layout', note: '201 rooms across standalone low-rise casitas' },
      { icon: '\uD83C\uDFA8', label: 'Artist Residency', note: 'Rotating local-artist installations and painted-on-property murals' },
      { icon: '\uD83E\uDDD6', label: 'Palo Verde Spa', note: 'Spa experience organized around private treatment houses' }
    ],
    insiderTips: [
      'Adults-only pool (Pool House) is the quieter of the three pools',
      'Bungalow 23 is the standalone 3-BR villa with private pool \u2014 group bookings',
      'Sip & Solve craft-cocktail classes Friday evenings for guests'
    ],
    bestFor: ['Date', 'Design Lover', 'Spa', 'Boutique', 'Couples']
  }
];

const body = JSON.stringify(phxHotels, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "phoenix": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted phoenix section into HOTEL_DATA with', phxHotels.length, 'entries.');
