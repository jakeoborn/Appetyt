// Insert 'san diego' section into MUSEUM_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

const declIdx = html.indexOf('const MUSEUM_DATA =');
if (declIdx < 0) { console.error('MUSEUM_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}
const block = html.slice(declIdx, closeIdx + 1);
if (/"san diego"\s*:/m.test(block)) {
  console.log('SKIP: MUSEUM_DATA already has "san diego"');
  process.exit(0);
}

const sdMuseums = [
  {
    id: 1,
    name: 'San Diego Zoo',
    type: 'Zoo',
    emoji: '\uD83E\uDD81',
    neighborhood: 'Balboa Park',
    address: '2920 Zoo Dr, San Diego CA 92101',
    lat: 32.7353,
    lng: -117.1490,
    score: 98,
    hours: 'Daily 9AM-6PM (hours seasonal)',
    admission: 'Adult ~$72, Child ~$62 (check site)',
    website: 'https://zoo.sandiegozoo.org',
    about: "Founded 1916, one of the most famous zoos in the world and a pioneer of open-habitat exhibit design. 3,500+ animals across 650 species on 100 acres inside Balboa Park \u2014 giant pandas (historic exhibit), koalas, polar bears, and the Skyfari aerial tram across the canyons.",
    highlights: [
      { icon: '\uD83E\uDD81', label: '3,500+ Animals', note: '650 species across 100 acres' },
      { icon: '\uD83D\uDE81', label: 'Skyfari Tram', note: 'Aerial gondola across the canyons \u2014 best overview' },
      { icon: '\uD83D\uDC28', label: 'Koalas & Giant Pandas', note: 'Historic flagship exhibits' },
      { icon: '\uD83D\uDC3B\u200D\u2744\uFE0F', label: 'Polar Bear Plunge', note: 'One of the zoo\u2019s signature habitats' }
    ],
    tips: [
      'Arrive at 9 AM \u2014 animals are most active in the cool morning hours',
      'Ride the Skyfari first for a full layout before walking the canyons',
      'The 2-park combo ticket adds the Safari Park in Escondido'
    ],
    bestFor: ['Family', 'Day Trip', 'Photography', 'Landmark']
  },
  {
    id: 2,
    name: 'USS Midway Museum',
    type: 'Military / Maritime Museum',
    emoji: '\u2708\uFE0F',
    neighborhood: 'Downtown / Embarcadero',
    address: '910 N Harbor Dr, San Diego CA 92101',
    lat: 32.7137,
    lng: -117.1751,
    score: 96,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$34, Senior ~$29, Child ~$24',
    website: 'https://www.midway.org',
    about: "The longest-serving U.S. Navy aircraft carrier of the 20th century, commissioned 1945 and decommissioned 1992, permanently moored at Navy Pier downtown. 60+ exhibits, 29 restored aircraft on the flight deck and hangar bay, and a self-guided audio tour narrated by Midway veterans.",
    highlights: [
      { icon: '\u2708\uFE0F', label: '29 Restored Aircraft', note: 'Flight deck walk-arounds \u2014 F-14, A-6, SH-60' },
      { icon: '\uD83C\uDFAE', label: 'Flight Simulators', note: 'Paid add-ons \u2014 Top Gun Air Combat 360' },
      { icon: '\uD83C\uDFA7', label: 'Audio Tour', note: 'Narrated by sailors who served on Midway' }
    ],
    tips: [
      'Plan 3 hours minimum \u2014 you will run long',
      'Arrive at opening for the flight deck before the sun peaks',
      'The Unconditional Surrender sculpture sits directly behind the ship'
    ],
    bestFor: ['History', 'Family', 'Aviation Buffs', 'Rainy Day', 'Landmark']
  },
  {
    id: 3,
    name: 'Maritime Museum of San Diego',
    type: 'Maritime Museum',
    emoji: '\u26F5',
    neighborhood: 'Downtown / Embarcadero',
    address: '1492 N Harbor Dr, San Diego CA 92101',
    lat: 32.7208,
    lng: -117.1741,
    score: 92,
    hours: 'Daily 10AM-8PM (hours seasonal)',
    admission: 'Adult ~$24, Senior ~$21, Child ~$10',
    website: 'https://sdmaritime.org',
    about: "One of the largest collections of historic vessels in the United States, anchored by the Star of India (1863) \u2014 the world\u2019s oldest active sailing ship. Also Berkeley (1898 ferry), HMS Surprise (replica frigate used in Master and Commander), a Soviet-era B-39 submarine, and USS Dolphin research submarine.",
    highlights: [
      { icon: '\u2B50', label: 'Star of India (1863)', note: 'Oldest active sailing ship in the world' },
      { icon: '\uD83C\uDFAC', label: 'HMS Surprise', note: 'Replica used in Master and Commander' },
      { icon: '\uD83D\uDEA2', label: 'B-39 Soviet Submarine', note: 'Walk through a Cold War attack sub' }
    ],
    tips: [
      'The 4-hour sail on the Californian tall ship is a weekend insider ticket',
      'Tickets valid all day \u2014 split into two visits if needed',
      'Sits directly next to the USS Midway \u2014 pair them on one day'
    ],
    bestFor: ['History', 'Family', 'Maritime Buffs', 'Photography']
  },
  {
    id: 4,
    name: 'San Diego Museum of Art',
    type: 'Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Balboa Park',
    address: '1450 El Prado, San Diego CA 92101',
    lat: 32.7316,
    lng: -117.1497,
    score: 90,
    hours: 'Mon-Tue, Thu-Sat 10AM-5PM, Sun 12-5PM, Closed Wed',
    admission: 'Adult ~$20, Senior ~$15, Child Free',
    website: 'https://www.sdmart.org',
    about: "The region\u2019s flagship fine-art museum, founded 1926, housed in a Plateresque 1926 building on El Prado. Strong Spanish Old Masters collection (El Greco, Goya, Ribera), Italian Renaissance, South Asian painting, and a consistent rotation of traveling shows in the special-exhibition wing.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1926 Plateresque Facade', note: 'Anchors the west end of El Prado' },
      { icon: '\uD83D\uDDBC\uFE0F', label: 'Spanish Old Masters', note: 'El Greco, Goya, Ribera, Zurbaran' },
      { icon: '\uD83D\uDCD6', label: 'South Asian Collection', note: 'One of the stronger holdings on the West Coast' }
    ],
    tips: [
      'Free admission on Culture Pass days through the SD Library',
      'May Gray / June Gloom mornings are the quietest visit window',
      'Combine with Mingei and Timken next door for a one-block museum afternoon'
    ],
    bestFor: ['Art Lovers', 'Rainy Day', 'Date Night', 'Architecture']
  },
  {
    id: 5,
    name: 'San Diego Natural History Museum (theNAT)',
    type: 'Natural History Museum',
    emoji: '\uD83E\uDD95',
    neighborhood: 'Balboa Park',
    address: '1788 El Prado, San Diego CA 92101',
    lat: 32.7308,
    lng: -117.1480,
    score: 89,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$23, Senior ~$21, Child ~$14',
    website: 'https://www.sdnhm.org',
    about: "Founded 1874 \u2014 the oldest scientific institution in Southern California. 7.5 million specimens, the Coast to Cactus in Southern California gallery, a full-size fin whale skeleton in the atrium, and the 3D giant-screen theater.",
    highlights: [
      { icon: '\uD83D\uDC0B', label: 'Fin Whale Skeleton', note: 'Full-size articulated skeleton in the entry atrium' },
      { icon: '\uD83C\uDF35', label: 'Coast to Cactus Gallery', note: 'Southern California ecosystems done well' },
      { icon: '\uD83C\uDFA5', label: '3D Giant Screen Theater', note: 'Nature films on the biggest screen in town' }
    ],
    tips: [
      'The fossil lab is visible from the public floor \u2014 best time is Tuesday',
      'Pair with Fleet Science Center and SD Air & Space for a full Balboa science day',
      'Family 4-packs available at discount via the website'
    ],
    bestFor: ['Family', 'Science', 'Rainy Day', 'Kids']
  },
  {
    id: 6,
    name: 'Fleet Science Center',
    type: 'Science Museum',
    emoji: '\uD83D\uDD2D',
    neighborhood: 'Balboa Park',
    address: '1875 El Prado, San Diego CA 92101',
    lat: 32.7317,
    lng: -117.1467,
    score: 88,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$24, Child ~$21 (includes one IMAX film)',
    website: 'https://www.rhfleet.org',
    about: "A hands-on science museum founded 1973, home to the first IMAX Dome theater in the world. 100+ interactive exhibits for all ages, a full planetarium, and rotating special exhibits on topics from AI to zoology.",
    highlights: [
      { icon: '\uD83C\uDF0C', label: 'IMAX Dome Theater', note: 'First in the world \u2014 planetarium + film venue' },
      { icon: '\uD83D\uDD2C', label: '100+ Interactive Exhibits', note: 'Hands-on focus for kids and adults' },
      { icon: '\uD83E\uDDE0', label: 'Rotating Special Shows', note: 'National-caliber traveling exhibits' }
    ],
    tips: [
      'Kids 5 and under get in free with a paid adult',
      'IMAX ticket is included with admission \u2014 pick a film on arrival',
      'Thursday evening adult hours \u201421+ only, cocktails flow'
    ],
    bestFor: ['Family', 'Kids', 'Science', 'Rainy Day']
  },
  {
    id: 7,
    name: 'San Diego Air & Space Museum',
    type: 'Aviation Museum',
    emoji: '\uD83D\uDE80',
    neighborhood: 'Balboa Park',
    address: '2001 Pan American Plaza, San Diego CA 92101',
    lat: 32.7254,
    lng: -117.1483,
    score: 87,
    hours: 'Daily 10AM-4:30PM',
    admission: 'Adult ~$24, Senior ~$21, Child ~$13',
    website: 'https://sandiegoairandspace.org',
    about: "Housed in the circular 1935 Ford Building at the south end of Balboa Park. 70+ aircraft and spacecraft, a Spirit of St. Louis replica built by the original Ryan Aeronautical team, Apollo 9 command module, and an SR-71 Blackbird.",
    highlights: [
      { icon: '\uD83D\uDEF0\uFE0F', label: 'Apollo 9 Command Module', note: 'Actual flown spacecraft' },
      { icon: '\u2708\uFE0F', label: 'SR-71 Blackbird', note: 'Full-scale on display' },
      { icon: '\uD83D\uDCDC', label: 'Spirit of St. Louis Replica', note: 'Built by original Ryan Aeronautical team' }
    ],
    tips: [
      'Free admission first Tuesday of every month for SD County residents',
      'Active-duty military and immediate family always free',
      'Combine with Model Railroad Museum next door for rainy days'
    ],
    bestFor: ['Aviation Buffs', 'Family', 'History', 'Rainy Day']
  },
  {
    id: 8,
    name: 'Museum of Us',
    type: 'Anthropology Museum',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Balboa Park',
    address: '1350 El Prado, San Diego CA 92101',
    lat: 32.7312,
    lng: -117.1502,
    score: 85,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$20, Senior ~$17, Child ~$12 (California Tower extra)',
    website: 'https://museumofus.org',
    about: "Anthropology museum inside the 1915 California Building \u2014 the Spanish Colonial Revival centerpiece of Balboa Park. Founded 1915, rebranded in 2020. Exhibits on ancient Egypt, the Maya, Kumeyaay cultural heritage, and a climb up the California Tower for the park\u2019s best view.",
    highlights: [
      { icon: '\uD83D\uDD14', label: 'California Tower Climb', note: '125 steps \u2014 360\u00B0 view of the park and downtown' },
      { icon: '\uD83D\uDC41\uFE0F', label: 'Ancient Egypt Gallery', note: 'Real mummies and funerary artifacts' },
      { icon: '\uD83C\uDFDB\uFE0F', label: '1915 Building', note: 'Spanish Colonial Revival icon \u2014 park centerpiece' }
    ],
    tips: [
      'Book the California Tower climb separately \u2014 timed entry, 40 min total',
      'Museum entry includes the Maya gallery in the basement',
      'Free admission on Third Tuesdays for SD County residents'
    ],
    bestFor: ['History', 'Architecture', 'Views', 'Family']
  },
  {
    id: 9,
    name: 'Birch Aquarium at Scripps',
    type: 'Aquarium',
    emoji: '\uD83D\uDC20',
    neighborhood: 'La Jolla',
    address: '2300 Expedition Way, La Jolla CA 92037',
    lat: 32.8661,
    lng: -117.2542,
    score: 91,
    hours: 'Daily 9AM-5PM',
    admission: 'Adult ~$25, Child ~$20',
    website: 'https://aquarium.ucsd.edu',
    about: "The public outreach center of Scripps Institution of Oceanography (UC San Diego). Perched on a La Jolla cliff with an unmatched view of the Pacific, 60+ tanks focused on the marine life of the California coast and Pacific \u2014 leopard sharks, seahorses, and a two-story giant kelp forest.",
    highlights: [
      { icon: '\uD83D\uDC20', label: '2-Story Kelp Forest', note: 'SoCal giant-kelp ecosystem in a glass column' },
      { icon: '\uD83E\uDD88', label: 'Leopard Shark Encounter', note: 'Wade-in tank open seasonally' },
      { icon: '\uD83C\uDF0A', label: 'Cliff-Top Patio', note: 'One of the best ocean views from any museum in CA' }
    ],
    tips: [
      'Save ~$5 on advance online timed-entry tickets',
      'Gray-whale season tie-in shows December through March',
      'Free parking in the lower lot after 4 PM'
    ],
    bestFor: ['Family', 'Kids', 'Views', 'Ocean', 'Rainy Day']
  },
  {
    id: 10,
    name: 'Mingei International Museum',
    type: 'Folk Art & Craft Museum',
    emoji: '\uD83C\uDFFA',
    neighborhood: 'Balboa Park',
    address: '1439 El Prado, San Diego CA 92101',
    lat: 32.7300,
    lng: -117.1511,
    score: 86,
    hours: 'Tue-Sun 10AM-5PM, Closed Mon',
    admission: 'Adult ~$15 (Thursdays free admission)',
    website: 'https://mingei.org',
    about: "The only museum of its kind on the U.S. west coast \u2014 dedicated to folk art, craft, and design of all cultures. Reopened 2021 after a $55 million renovation; Japanese ceramics, textiles, American quilts, and a courtyard cafe (Artifact) that is genuinely good.",
    highlights: [
      { icon: '\uD83C\uDFFA', label: 'Folk Art & Craft', note: 'Japanese ceramics, textiles, furniture, quilts' },
      { icon: '\uD83C\uDFDB\uFE0F', label: '$55M Renovation (2021)', note: 'New daylighting, gallery grid, rooftop terrace' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Artifact at Mingei', note: 'Surprisingly strong courtyard cafe' }
    ],
    tips: [
      'Thursday admission is free \u2014 pair with the Old Globe for a cultural night',
      'The gift shop is an underrated SD ceramics-and-craft source',
      'Rooftop terrace is open during member events'
    ],
    bestFor: ['Art Lovers', 'Date', 'Rainy Day', 'Architecture']
  }
];

const body = JSON.stringify(sdMuseums, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san diego": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san diego section into MUSEUM_DATA with', sdMuseums.length, 'entries.');
