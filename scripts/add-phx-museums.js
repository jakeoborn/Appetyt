// Insert 'phoenix' section into MUSEUM_DATA in index.html.
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
if (/"phoenix"\s*:/m.test(block)) {
  console.log('SKIP: MUSEUM_DATA already has "phoenix"');
  process.exit(0);
}

const phxMuseums = [
  {
    id: 1,
    name: 'Heard Museum',
    type: 'Native American Art & Culture',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Midtown Phoenix',
    address: '2301 N Central Ave, Phoenix AZ 85004',
    lat: 33.4726,
    lng: -112.0736,
    score: 95,
    hours: 'Tue-Sun 10AM-4PM',
    admission: 'Adult ~$25, Senior ~$22, Child ~$15',
    website: 'https://heard.org',
    about: "Founded 1929, one of the most important museums of Native American art and culture in the country. The signature Home exhibit surveys Southwestern nations in their own voices, and the Barry Goldwater katsina doll collection is the anchor object holding. Hosts the Heard Museum Guild Indian Fair & Market each March.",
    highlights: [
      { icon: '\uD83C\uDFA8', label: 'HOME Exhibit', note: 'Signature survey of Southwestern Native nations and artists' },
      { icon: '\uD83D\uDDFF', label: 'Goldwater Katsina Collection', note: 'Barry Goldwater\u2019s 400-doll gift \u2014 the anchor' },
      { icon: '\uD83C\uDFAA', label: 'Indian Fair & Market', note: 'Early-March weekend \u2014 600+ artists, tickets early' }
    ],
    tips: [
      'Courtyard and Cafe make a full morning without rushing the galleries',
      'First Friday monthly \u2014 free evening admission 4\u20139 PM',
      'Museum Shop is the Valley\u2019s best source for authentic contemporary Native jewelry'
    ],
    bestFor: ['Art', 'History', 'Culture', 'Rainy Day', 'Landmark']
  },
  {
    id: 2,
    name: 'Phoenix Art Museum',
    type: 'Encyclopedic Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Midtown Phoenix',
    address: '1625 N Central Ave, Phoenix AZ 85004',
    lat: 33.4657,
    lng: -112.0739,
    score: 92,
    hours: 'Wed-Sun 10AM-5PM (Wed to 9PM)',
    admission: 'Adult ~$25, Student ~$18, Child free under 6',
    website: 'https://phxart.org',
    about: "The largest art museum in the Southwest \u2014 285,000 sq ft across American, European, Asian, Latin American, Western, and contemporary galleries plus a standing exhibit of Yayoi Kusama\u2019s Infinity Mirror Room. The Center for Creative Photography works here on rotation with UArizona.",
    highlights: [
      { icon: '\uD83E\uDE9E', label: 'Infinity Mirrors', note: 'Kusama\u2019s You Who Are Getting Obliterated \u2014 timed entry' },
      { icon: '\uD83C\uDFA8', label: 'Western Galleries', note: 'Remington, Moran, Maynard Dixon' },
      { icon: '\uD83D\uDC57', label: 'Fashion & Design', note: 'One of the few encyclopedic fashion collections in the U.S.' }
    ],
    tips: [
      'Wed evenings are pay-what-you-wish 3\u20139 PM',
      'Kusama Infinity Room requires a separate timed-entry sticker at the front desk',
      'Combine with Heard Museum next door for a full Midtown art day'
    ],
    bestFor: ['Art', 'Rainy Day', 'Date', 'Culture']
  },
  {
    id: 3,
    name: 'Musical Instrument Museum (MIM)',
    type: 'Music Museum',
    emoji: '\uD83C\uDFB6',
    neighborhood: 'North Phoenix',
    address: '4725 E Mayo Blvd, Phoenix AZ 85050',
    lat: 33.6702,
    lng: -111.9742,
    score: 96,
    hours: 'Daily 9AM-5PM',
    admission: 'Adult ~$25, Child ~$15',
    website: 'https://mim.org',
    about: "The largest musical instrument museum in the world. 8,000+ instruments from every country on Earth displayed with wireless audio-video headsets that auto-trigger native music at each gallery. Separate Artist Gallery (John Lennon, Elvis, Taylor Swift) and a 299-seat theater that draws working-musician nightly performances.",
    highlights: [
      { icon: '\uD83C\uDF0D', label: '8,000+ Instruments', note: 'Every country on Earth \u2014 the wireless audio auto-plays as you approach' },
      { icon: '\uD83C\uDFA4', label: 'Artist Gallery', note: 'Lennon\u2019s Steinway, Elvis\u2019s Martin, Taylor Swift\u2019s guitar' },
      { icon: '\uD83C\uDFAD', label: 'MIM Music Theater', note: '299-seat intimate hall \u2014 world-class touring acts nightly' }
    ],
    tips: [
      'Plan a half-day minimum \u2014 the audio loops are addictive',
      'Experience Gallery lets visitors play harps, theremins, gongs, gamelan',
      'Theater tickets often available day-of for smaller touring acts'
    ],
    bestFor: ['Music', 'Family', 'Rainy Day', 'Culture', 'Unique']
  },
  {
    id: 4,
    name: 'Phoenix Zoo',
    type: 'Zoo',
    emoji: '\uD83E\uDD81',
    neighborhood: 'Papago',
    address: '455 N Galvin Pkwy, Phoenix AZ 85008',
    lat: 33.4519,
    lng: -111.9475,
    score: 90,
    hours: 'Daily 9AM-5PM (hours seasonal)',
    admission: 'Adult ~$30, Child ~$20',
    website: 'https://phoenixzoo.org',
    about: "The largest privately-owned, non-profit zoo in the U.S. \u2014 125 acres inside Papago Park holding 3,000+ animals across 400+ species. Best known as the zoo that saved the Arabian oryx from extinction through its Operation Oryx captive-breeding program in the 1960s.",
    highlights: [
      { icon: '\uD83E\uDD81', label: '3,000+ Animals', note: '400+ species across 125 acres' },
      { icon: '\uD83E\uDD8C', label: 'Arabian Oryx', note: 'The zoo\u2019s historic species-rescue success story' },
      { icon: '\uD83C\uDF84', label: 'ZooLights', note: 'November\u2013January evening lights walk \u2014 tickets in advance' }
    ],
    tips: [
      'Summer gates open 7 AM \u2014 beat the heat',
      'ZooLights is the zoo\u2019s biggest event \u2014 book weekend nights far ahead',
      'Papago Park trails and Desert Botanical are a 10-minute walk away'
    ],
    bestFor: ['Family', 'Day Trip', 'Photos']
  },
  {
    id: 5,
    name: "S'edav Va'aki Museum (formerly Pueblo Grande)",
    type: 'Archaeological Site',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'South Phoenix',
    address: '4619 E Washington St, Phoenix AZ 85034',
    lat: 33.4457,
    lng: -111.9935,
    score: 85,
    hours: 'Tue-Sat 9AM-4:45PM',
    admission: 'Adult ~$6, Child ~$3',
    website: 'https://pueblogrande.org',
    about: "A 1,500-year-old Hohokam village and platform mound \u2014 the last surviving piece of a canal-and-village system that once covered much of the Salt River Valley. National Historic Landmark. Renamed in 2023 from Pueblo Grande to S'edav Va'aki (\u201CMiddle Big House\u201D) in the O'odham language in consultation with descendant communities.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Hohokam Platform Mound', note: 'Original 1,500-year-old ceremonial site' },
      { icon: '\uD83D\uDCDC', label: 'National Historic Landmark', note: 'Federally recognized archaeological preserve' },
      { icon: '\uD83D\uDD8C\uFE0F', label: 'Interpretive Trail', note: 'Reconstructed pit house and ballcourt along a 2/3 mi loop' }
    ],
    tips: [
      'Full site tour takes 60\u201390 minutes',
      'Pairs well with a canal-path bike ride \u2014 the same Hohokam system still supplies Phoenix',
      'Exhibits are indoor \u2014 good rainy/hot-afternoon choice'
    ],
    bestFor: ['History', 'Culture', 'Rainy Day', 'Free Parking']
  },
  {
    id: 6,
    name: 'Children\u2019s Museum of Phoenix',
    type: 'Children\u2019s Museum',
    emoji: '\uD83E\uDDF8',
    neighborhood: 'Downtown Phoenix',
    address: '215 N 7th St, Phoenix AZ 85034',
    lat: 33.4520,
    lng: -112.0641,
    score: 88,
    hours: 'Tue-Sun 9AM-4PM',
    admission: 'Adult / Child ~$18 (under 1 free)',
    website: 'https://childrensmuseumofphoenix.org',
    about: "A three-story interactive children\u2019s museum in the restored 1913 Monroe School downtown. 300+ play-based exhibits \u2014 the three-story Schuff-Perini Climber, a Noodle Forest of suspended pool noodles, a Pit Stop tricycle garage, and a market/kitchen role-play suite. Best under age 10.",
    highlights: [
      { icon: '\uD83E\uDDD7', label: 'Schuff-Perini Climber', note: 'Three-story signature climbing structure' },
      { icon: '\uD83C\uDF5D', label: 'Noodle Forest', note: 'Thousands of suspended pool noodles \u2014 the Instagram shot' },
      { icon: '\uD83D\uDEB2', label: 'Pit Stop', note: 'Working tricycle garage with tools and tires' }
    ],
    tips: [
      'Best for ages 0\u20137; older kids may age out quickly',
      'Mornings less crowded than afternoons most days',
      'Free admission first Friday evening 5\u20139 PM each month'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day']
  },
  {
    id: 7,
    name: 'Taliesin West',
    type: 'Architecture Landmark',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'North Scottsdale',
    address: '12621 N Frank Lloyd Wright Blvd, Scottsdale AZ 85259',
    lat: 33.6069,
    lng: -111.8455,
    score: 94,
    hours: 'Daily 9AM-4PM (tour schedule varies)',
    admission: 'Tours from ~$42 adult',
    website: 'https://franklloydwright.org/taliesin-west',
    about: "Frank Lloyd Wright\u2019s desert winter home, studio, and architecture school \u2014 built by Wright and his apprentices starting 1937. A UNESCO World Heritage site since 2019 and still the headquarters of the Frank Lloyd Wright Foundation. Visits are guided tours only.",
    highlights: [
      { icon: '\uD83C\uDF0D', label: 'UNESCO World Heritage', note: 'Inscribed 2019 as part of The 20th-Century Architecture of FLW' },
      { icon: '\uD83D\uDDFF', label: 'Organic Architecture', note: 'Wright\u2019s canonical desert masonry + redwood + canvas' },
      { icon: '\uD83D\uDCDA', label: 'Drafting Studio', note: 'The working school where Wright taught his apprentices' }
    ],
    tips: [
      'Tours sell out weekends \u2014 book in advance',
      'Insights Tour (90 min) is the best overview; specialty photography tours quarterly',
      'October\u2013April is the comfortable-visit window; summer tours are dawn-only'
    ],
    bestFor: ['Architecture', 'History', 'Culture', 'Landmark', 'Date']
  },
  {
    id: 8,
    name: 'Scottsdale Museum of Contemporary Art (SMoCA)',
    type: 'Contemporary Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Old Town Scottsdale',
    address: '7374 E Second St, Scottsdale AZ 85251',
    lat: 33.4921,
    lng: -111.9254,
    score: 84,
    hours: 'Wed-Sun 12PM-5PM',
    admission: 'Adult ~$12 (Thu free)',
    website: 'https://smoca.org',
    about: "A compact contemporary-art museum inside Scottsdale Civic Center \u2014 five galleries of rotating contemporary, architecture, and design exhibitions, anchored by James Turrell\u2019s Knight Rise skyspace installed in the west courtyard. Part of the Scottsdale Arts trio with the Performing Arts Center and Scottsdale Public Art.",
    highlights: [
      { icon: '\uD83C\uDF11', label: 'Turrell Knight Rise', note: 'Permanent James Turrell skyspace \u2014 best at sunset' },
      { icon: '\uD83C\uDFAD', label: 'Rotating Exhibits', note: '5 galleries of contemporary, architecture, design' },
      { icon: '\uD83D\uDCC5', label: 'Free Thursdays', note: 'Free admission every Thursday' }
    ],
    tips: [
      'Knight Rise is open-ceiling \u2014 time visit to the skyspace\u2019s posted sunset window',
      'Walk to Old Town galleries after the museum for a full arts afternoon',
      'Third Thursday ArtWalk (year-round) centers on adjacent Main Street galleries'
    ],
    bestFor: ['Art', 'Date', 'Culture', 'Free Thursday']
  },
  {
    id: 9,
    name: 'Arizona Science Center',
    type: 'Science Museum',
    emoji: '\uD83D\uDD2D',
    neighborhood: 'Downtown Phoenix',
    address: '600 E Washington St, Phoenix AZ 85004',
    lat: 33.4499,
    lng: -112.0651,
    score: 86,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$25, Child ~$20',
    website: 'https://azscience.org',
    about: "An Antoine Predock-designed 120,000 sq ft science center at Heritage and Science Park downtown. 350+ hands-on exhibits across five levels, the Dorrance Planetarium, the 5-story Irene P. Flinn Theater (giant-screen films), and a CreatorSpace maker studio.",
    highlights: [
      { icon: '\uD83E\uDDEA', label: '350+ Hands-On Exhibits', note: 'Five levels of interactive science' },
      { icon: '\uD83C\uDF0C', label: 'Dorrance Planetarium', note: 'Dome shows running most days' },
      { icon: '\uD83C\uDFAC', label: 'Giant-Screen Theater', note: '5-story Irene P. Flinn \u2014 nature and space documentaries' }
    ],
    tips: [
      'Combo tickets with planetarium + theater are a better deal than single add-ons',
      'Summer Camp-In sleepovers run monthly \u2014 popular birthday gift',
      'Across the courtyard from Heritage Square\u2019s Rosson House for a full downtown day'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day', 'Education']
  },
  {
    id: 10,
    name: "Western Spirit: Scottsdale's Museum of the West",
    type: 'Western Art & History',
    emoji: '\uD83E\uDD20',
    neighborhood: 'Old Town Scottsdale',
    address: '3830 N Marshall Way, Scottsdale AZ 85251',
    lat: 33.4947,
    lng: -111.9260,
    score: 87,
    hours: 'Tue-Sun 9:30AM-5PM',
    admission: 'Adult ~$19',
    website: 'https://westernspirit.org',
    about: "A Smithsonian Affiliate opened 2015 in Old Town Scottsdale \u2014 43,000 sq ft of rotating galleries on the American West: cowboy art, Native American art, Western film, rodeo history, and the landscape painters. Houses the Abe Hays Arizona Collection and a permanent saddle gallery.",
    highlights: [
      { icon: '\uD83D\uDCD6', label: 'Smithsonian Affiliate', note: 'Rotating Smithsonian-linked exhibits' },
      { icon: '\uD83C\uDFDE\uFE0F', label: 'Western Landscapes', note: 'Moran, Remington, Russell \u2014 classic Western canon' },
      { icon: '\uD83E\uDD20', label: 'Abe Hays Arizona Collection', note: 'Spurs, saddles, frontier firearms, branding irons' }
    ],
    tips: [
      'Pairs naturally with SMoCA two blocks away for a full Old Town museum morning',
      'Gallery tours daily at 11 AM',
      'Third Thursday ArtWalk passes directly outside'
    ],
    bestFor: ['Art', 'History', 'Culture', 'Rainy Day']
  }
];

const body = JSON.stringify(phxMuseums, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "phoenix": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted phoenix section into MUSEUM_DATA with', phxMuseums.length, 'entries.');
