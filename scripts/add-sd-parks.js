// Insert 'san diego' section into PARK_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

const declIdx = html.indexOf('const PARK_DATA =');
if (declIdx < 0) { console.error('PARK_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}
const block = html.slice(declIdx, closeIdx + 1);
if (/"san diego"\s*:/m.test(block)) {
  console.log('SKIP: PARK_DATA already has "san diego"');
  process.exit(0);
}

const sdParks = [
  {
    id: 1,
    name: 'Balboa Park',
    type: 'Urban Park / Museum Campus',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Balboa Park',
    address: '1549 El Prado, San Diego CA 92101',
    lat: 32.7341,
    lng: -117.1443,
    score: 98,
    hours: 'Park grounds open daily; museum hours vary',
    admission: 'Free to enter; individual museums ticketed',
    website: 'https://www.balboapark.org',
    about: "At 1,200 acres, one of the largest urban cultural parks in the United States. The 1915 Panama-California Exposition Spanish Colonial Revival architecture still defines El Prado, and the park holds 17 museums, the San Diego Zoo, the Old Globe Theatre, and Spreckels Organ Pavilion.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '17 Museums', note: 'Art, science, natural history, and cultural institutions along El Prado' },
      { icon: '\uD83E\uDD81', label: 'San Diego Zoo', note: 'Inside the park\u2019s north end' },
      { icon: '\uD83C\uDFAD', label: 'Old Globe Theatre', note: 'Tony-winning regional theatre — three stages' },
      { icon: '\uD83C\uDFB9', label: 'Spreckels Organ Pavilion', note: 'Largest outdoor pipe organ in the world; free Sunday concerts' }
    ],
    tips: [
      'Sunday mornings are the quietest time for El Prado photos',
      'The Balboa Park Explorer multi-museum pass pays off after two museums',
      'Park free along Park Blvd and walk in — central lots fill by 11 AM on weekends'
    ],
    bestFor: ['Museums', 'Family', 'Free Activity', 'Rainy Day', 'Architecture', 'Landmark']
  },
  {
    id: 2,
    name: 'Torrey Pines State Natural Reserve',
    type: 'State Reserve',
    emoji: '\uD83C\uDF32',
    neighborhood: 'La Jolla / Torrey Pines',
    address: '12600 N Torrey Pines Rd, La Jolla CA 92037',
    lat: 32.9220,
    lng: -117.2527,
    score: 97,
    hours: 'Daily 7:15AM-sunset',
    admission: 'Parking $10-$25 (no beach-lot cash; kiosk card only)',
    website: 'https://torreypine.org',
    about: 'A 2,000-acre coastal reserve protecting the rarest pine tree in the United States (Pinus torreyana) on sandstone cliffs between La Jolla and Del Mar. Eight miles of trails, Razor Point and Guy Fleming loops, and a descent to Black\u2019s Beach at the north end.',
    highlights: [
      { icon: '\uD83C\uDF32', label: 'Torrey Pines', note: 'Only wild population on the U.S. mainland' },
      { icon: '\uD83C\uDF0A', label: 'Razor Point Trail', note: 'Most dramatic cliff-top ocean view — 1.3 mi round trip' },
      { icon: '\uD83C\uDFDD\uFE0F', label: 'Beach Trail', note: '0.75 mi descent to the sand; steep back up' }
    ],
    tips: [
      'Park at the bottom lot and walk up to skip the line at the ranger kiosk',
      'Pets, food, and drinks (other than water) are banned inside the reserve',
      'Sunset from Yucca Point is the iconic SD coastal photo'
    ],
    bestFor: ['Hiking', 'Views', 'Photography', 'Nature', 'Date']
  },
  {
    id: 3,
    name: 'Sunset Cliffs Natural Park',
    type: 'Coastal Park',
    emoji: '\uD83C\uDF05',
    neighborhood: 'Point Loma',
    address: '1253 Sunset Cliffs Blvd, San Diego CA 92107',
    lat: 32.7168,
    lng: -117.2556,
    score: 95,
    hours: 'Daily dawn-10:30PM',
    admission: 'Free',
    website: 'https://www.sandiego.gov/park-and-recreation/parks/regional/sunsetcliffs',
    about: "68 acres of sandstone cliffs along the Pacific on the western edge of Point Loma. Untouched coastal bluffs, tidepools, hidden sea caves, and some of the most photographed sunsets in Southern California. No guardrails — the cliffs are the experience.",
    highlights: [
      { icon: '\uD83C\uDF05', label: 'Sunset Views', note: 'Classic SD west-facing sunset — arrive 30 min before' },
      { icon: '\uD83C\uDF0A', label: 'Sea Caves & Tidepools', note: 'Accessible at low tide near Ladera St' },
      { icon: '\uD83C\uDF34', label: 'Arch at Hill St', note: 'The natural sandstone arch, locals\u2019 photo spot' }
    ],
    tips: [
      'Check NOAA tide tables before attempting the tidepool descent',
      'The cliffs actively erode — stay back from the edge, especially after rain',
      'Park on Sunset Cliffs Blvd north of Ladera; south end fills first at sunset'
    ],
    bestFor: ['Sunset', 'Date', 'Photos', 'Free Activity', 'Ocean']
  },
  {
    id: 4,
    name: 'Mission Bay Park',
    type: 'Aquatic Park',
    emoji: '\uD83D\uDEA3',
    neighborhood: 'Mission Bay',
    address: '2688 E Mission Bay Dr, San Diego CA 92109',
    lat: 32.7764,
    lng: -117.2337,
    score: 92,
    hours: 'Daily 4AM-2AM',
    admission: 'Free (parking free)',
    website: 'https://www.sandiego.gov/park-and-recreation/parks/missionbay',
    about: "At 4,235 acres (27 of water), the largest man-made aquatic park in the country. Sailing, jet-skiing, kayaking, and paddle-boarding on the bay; 27 miles of waterfront paths; Fiesta Island off-leash dog park; and SeaWorld at the southwest corner.",
    highlights: [
      { icon: '\uD83D\uDEA3', label: '27 Water Miles', note: 'Largest man-made aquatic park in the U.S.' },
      { icon: '\uD83D\uDC15', label: 'Fiesta Island', note: 'Huge off-leash dog beach and fire-pit cove' },
      { icon: '\uD83C\uDFA2', label: 'SeaWorld', note: 'Sits at the park\u2019s southwest corner' },
      { icon: '\uD83D\uDEB4', label: 'Bayshore Bikeway', note: 'Flat, paved, 27 miles around the bay' }
    ],
    tips: [
      'De Anza Cove is the calmest swimming spot for kids',
      'Sunday morning paddleboard rentals on Santa Clara Point — arrive early',
      'Fiesta Island fire pits are first-come; Saturdays fill by noon'
    ],
    bestFor: ['Family', 'Watersports', 'Dog Walking', 'Picnic', 'Cycling']
  },
  {
    id: 5,
    name: 'Mission Trails Regional Park',
    type: 'Regional Park',
    emoji: '\u26F0\uFE0F',
    neighborhood: 'San Carlos',
    address: '1 Father Junipero Serra Trail, San Diego CA 92119',
    lat: 32.8275,
    lng: -117.0477,
    score: 91,
    hours: 'Daily sunrise-sunset (visitor center 9AM-5PM)',
    admission: 'Free',
    website: 'https://mtrp.org',
    about: "At 7,200 acres, the largest city-based regional park in California. Cowles Mountain — San Diego\u2019s highest point at 1,593 ft — is the headline hike; 60+ miles of trails, the Old Mission Dam historic site, and a full nature visitor center.",
    highlights: [
      { icon: '\u26F0\uFE0F', label: 'Cowles Mountain', note: 'SD\u2019s high point; 3 mi out-and-back with 360\u00B0 summit view' },
      { icon: '\uD83E\uDEA8', label: 'Old Mission Dam', note: '1803 padre-built dam — National Historic Landmark' },
      { icon: '\uD83D\uDC0D', label: 'Visitor Center', note: 'Excellent free natural history exhibits' }
    ],
    tips: [
      'Start Cowles Mountain at Barker Way for the quieter backside route',
      'Summer mornings only \u2014 unshaded and hot by 10 AM',
      'Kwaay Paay Peak is the hidden alternative summit \u2014 same views, 1/10 the crowd'
    ],
    bestFor: ['Hiking', 'Views', 'Fitness', 'Family', 'Free Activity']
  },
  {
    id: 6,
    name: 'La Jolla Cove',
    type: 'Marine Reserve / Beach',
    emoji: '\uD83E\uDDAD',
    neighborhood: 'La Jolla',
    address: '1100 Coast Blvd, La Jolla CA 92037',
    lat: 32.8506,
    lng: -117.2730,
    score: 94,
    hours: 'Daily 4AM-2AM',
    admission: 'Free',
    website: 'https://www.sandiego.gov/lifeguards/beaches/cove',
    about: "A small sandy cove carved into the La Jolla bluffs, part of the Matlahuayl State Marine Reserve. Sea lions and harbor seals haul out on the rocks, snorkeling is world-class inside the protected zone, and Ellen Browning Scripps Park sits directly above with picnic lawns and coast walk.",
    highlights: [
      { icon: '\uD83E\uDDAD', label: 'Sea Lions & Seals', note: 'Hauled out on the rocks most days; respect posted distances' },
      { icon: '\uD83E\uDD3F', label: 'Snorkeling', note: 'Inside the Marine Reserve \u2014 garibaldi, leopard sharks, rays' },
      { icon: '\uD83C\uDFDE\uFE0F', label: 'Scripps Park Above', note: 'Picnic lawns with coast walk west to Childrens Pool' }
    ],
    tips: [
      'Go at low tide for the clearest snorkeling and tidepool access',
      'Leopard-shark season runs June\u2013November \u2014 peaks August',
      'Village parking fills by 10 AM; try Prospect Street above the cove'
    ],
    bestFor: ['Beach', 'Snorkeling', 'Wildlife', 'Family', 'Photos']
  },
  {
    id: 7,
    name: 'Cabrillo National Monument',
    type: 'National Monument',
    emoji: '\uD83D\uDDFD',
    neighborhood: 'Point Loma',
    address: '1800 Cabrillo Memorial Dr, San Diego CA 92106',
    lat: 32.6722,
    lng: -117.2414,
    score: 90,
    hours: 'Daily 9AM-5PM',
    admission: '$20/vehicle (NPS annual pass honored)',
    website: 'https://www.nps.gov/cabr',
    about: "At the southern tip of Point Loma, a National Park Service site commemorating Juan Rodriguez Cabrillo\u2019s 1542 landing \u2014 the first European expedition on the U.S. west coast. Old Point Loma Lighthouse (1855), tidepools on the ocean side, and arguably the best 360\u00B0 view of San Diego Bay and the Coronado Bridge.",
    highlights: [
      { icon: '\uD83D\uDDFD', label: 'Cabrillo Statue', note: '1939 sandstone statue overlooking the bay' },
      { icon: '\uD83D\uDD26', label: 'Old Point Loma Lighthouse', note: 'Standing since 1855, open to walk through' },
      { icon: '\uD83D\uDC19', label: 'Tidepools', note: 'Low-tide windows reveal anemones, crabs, octopus' }
    ],
    tips: [
      'Coordinate the visit with NOAA low-tide tables for the tidepools',
      'Military base sits between downtown and the monument \u2014 no shortcuts',
      'Gray whale migration visible from shore mid-December through February'
    ],
    bestFor: ['Views', 'Historic Site', 'Family', 'Tidepools', 'Photos']
  },
  {
    id: 8,
    name: 'Coronado Central Beach',
    type: 'Beach',
    emoji: '\uD83C\uDFD6\uFE0F',
    neighborhood: 'Coronado',
    address: 'Ocean Blvd, Coronado CA 92118',
    lat: 32.6869,
    lng: -117.1831,
    score: 93,
    hours: 'Daily 4AM-2AM',
    admission: 'Free',
    website: 'https://www.coronado.ca.us/visitors/beach',
    about: "A wide, gold-flecked sand beach in front of the Hotel del Coronado \u2014 Dr. Beach has named it a Top 10 U.S. beach every year for a decade. The sand glitters because of its mica content, the surf is gentle, and the Hotel Del silhouette is the iconic Southern California postcard.",
    highlights: [
      { icon: '\u2728', label: 'Glittering Sand', note: 'Natural mica flecks shimmer in the sun' },
      { icon: '\uD83C\uDFE8', label: 'Hotel del Coronado', note: '1888 Victorian resort frames the south end' },
      { icon: '\uD83C\uDFC7', label: 'Gentle Surf', note: 'Consistently safe shore break \u2014 family favorite' }
    ],
    tips: [
      'Park on Ocean Blvd or in the metered spots along Orange Ave',
      'Walk to the south end for the iconic Hotel Del photo angle',
      'Dog Beach sits at the north end beyond the fenced Naval zone'
    ],
    bestFor: ['Beach', 'Family', 'Photos', 'Sunset', 'Swimming']
  },
  {
    id: 9,
    name: 'Presidio Park',
    type: 'Historic Park',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Old Town',
    address: '2811 Jackson St, San Diego CA 92110',
    lat: 32.7569,
    lng: -117.1972,
    score: 83,
    hours: 'Daily 4AM-10:30PM',
    admission: 'Free (museum ticketed)',
    website: 'https://www.sandiego.gov/park-and-recreation/parks/regional/presidio',
    about: "The birthplace of California. The 1769 Spanish presidio that launched European settlement on the U.S. west coast sat on this hilltop above Old Town. The Junipero Serra Museum (1929 Spanish Colonial Revival landmark) anchors the park; lawns, oak groves, and a sweeping view east to Mission Valley.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Junipero Serra Museum', note: '1929 landmark building, California history collection' },
      { icon: '\uD83D\uDCDC', label: 'Site of 1769 Presidio', note: 'First Spanish settlement in what is now California' },
      { icon: '\uD83D\uDD54', label: 'Mormon Battalion Monument', note: 'On the southwest slope' }
    ],
    tips: [
      'Walk down the back trail to Old Town in 10 minutes',
      'Sunset view of Mission Valley from the front lawn is overlooked',
      'Easter-week picnic tradition for local families \u2014 lot fills early'
    ],
    bestFor: ['Historic Site', 'Views', 'Free Activity', 'Picnic']
  },
  {
    id: 10,
    name: 'NTC Park at Liberty Station',
    type: 'Waterfront Park',
    emoji: '\uD83C\uDFDF\uFE0F',
    neighborhood: 'Point Loma / Liberty Station',
    address: '2455 Cushing Rd, San Diego CA 92106',
    lat: 32.7394,
    lng: -117.2142,
    score: 82,
    hours: 'Daily 6AM-10:30PM',
    admission: 'Free',
    website: 'https://www.sandiego.gov/park-and-recreation/parks/regional/ntcpark',
    about: "A 46-acre waterfront park at the former Naval Training Center, now part of Liberty Station. Wide open lawns facing the San Diego Bay boat channel, a playground, and a paved path along the water that connects to the Liberty Public Market and Arts District.",
    highlights: [
      { icon: '\uD83C\uDFDF\uFE0F', label: 'Bay-Front Lawns', note: 'Runway-flat lawns facing the boat channel' },
      { icon: '\uD83C\uDFEB', label: 'Arts District Next Door', note: '28 studios and galleries inside the historic barracks' },
      { icon: '\uD83C\uDF57', label: 'Liberty Public Market', note: '40 vendors \u2014 lunch walk from the lawn' }
    ],
    tips: [
      'Pair a Liberty Public Market lunch with a bay-front picnic',
      'Sunday farmers\u2019 market at the park edge 9 AM\u20131 PM',
      'Perfect flat run or stroller walk \u2014 zero elevation'
    ],
    bestFor: ['Family', 'Picnic', 'Running', 'Free Activity']
  }
];

const body = JSON.stringify(sdParks, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san diego": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san diego section into PARK_DATA with', sdParks.length, 'entries.');
