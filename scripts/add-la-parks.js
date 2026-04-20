// Insert 'los angeles' section into PARK_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

// Locate PARK_DATA and the closing brace of its object.
const declIdx = html.indexOf('const PARK_DATA =');
if (declIdx < 0) { console.error('PARK_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}
const parkDataBlock = html.slice(declIdx, closeIdx + 1);
if (/"los angeles"\s*:/m.test(parkDataBlock)) {
  console.log('SKIP: PARK_DATA already has "los angeles"');
  process.exit(0);
}

const laParks = [
  {
    id: 1,
    name: 'Griffith Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDFDE\uFE0F',
    neighborhood: 'Los Feliz / Hollywood Hills',
    address: '4730 Crystal Springs Dr, Los Angeles CA 90027',
    lat: 34.1344,
    lng: -118.3051,
    score: 98,
    hours: 'Daily 5AM-10:30PM (trails sunrise-sunset)',
    admission: 'Free',
    website: 'https://www.laparks.org/griffithpark',
    about: 'At 4,310 acres, one of the largest urban parks in North America. Home to Griffith Observatory, the Hollywood Sign, the LA Zoo, the Greek Theatre, the Autry Museum, and 53 miles of hiking trails.',
    highlights: [
      { icon: '\uD83C\uDF1F', label: 'Hollywood Sign Hikes', note: 'Best viewing trails — Mt. Hollywood, Brush Canyon, Cahuenga Peak' },
      { icon: '\uD83D\uDD2D', label: 'Griffith Observatory', note: 'Free planetarium + iconic city views' },
      { icon: '\uD83C\uDFAD', label: 'Greek Theatre', note: '5,900-seat outdoor amphitheater' },
      { icon: '\uD83E\uDD81', label: 'LA Zoo & Autry Museum', note: 'Both sit inside the park boundaries' },
      { icon: '\uD83D\uDC0E', label: 'Equestrian Trails', note: 'Sunset Ranch and multiple stables' }
    ],
    tips: [
      'Park at the Observatory early — the lot fills by 10 AM on weekends',
      'Brush Canyon / Canyon Dr trailhead is the closest legal Hollywood Sign route',
      'The Trails Cafe is the best hidden picnic spot'
    ],
    bestFor: ['Hiking', 'Views', 'Date', 'Family', 'Landmark']
  },
  {
    id: 2,
    name: 'Griffith Observatory',
    type: 'Observatory / Park',
    emoji: '\uD83D\uDD2D',
    neighborhood: 'Los Feliz',
    address: '2800 E Observatory Rd, Los Angeles CA 90027',
    lat: 34.1182,
    lng: -118.3003,
    score: 97,
    hours: 'Tue-Fri 12-10PM, Sat-Sun 10AM-10PM, Closed Mon',
    admission: 'Free admission; planetarium $10',
    website: 'https://griffithobservatory.org',
    about: 'Free public observatory on the south slope of Mt. Hollywood with some of the most iconic views of the Hollywood Sign and downtown LA. Art Deco landmark featured in Rebel Without a Cause and La La Land.',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Art Deco Landmark', note: '1935 building on Mount Hollywood' },
      { icon: '\uD83C\uDFAC', label: 'Rebel Without a Cause', note: 'James Dean memorial bust on the west lawn' },
      { icon: '\uD83C\uDF0C', label: 'Samuel Oschin Planetarium', note: 'Star shows on the dome — the only paid experience' },
      { icon: '\uD83D\uDCF8', label: 'Hollywood Sign View', note: "LA's classic panoramic photo spot" }
    ],
    tips: [
      'Sunset arrival = daylight + city-lights photos back to back',
      'Free parking fills quickly; use DASH Observatory shuttle from Sunset/Vermont',
      'The Zeiss telescope is free to use Tue-Sun evenings when skies are clear'
    ],
    bestFor: ['Views', 'Date Night', 'Family', 'Free Activity', 'Landmark']
  },
  {
    id: 3,
    name: 'Runyon Canyon Park',
    type: 'Hiking Park',
    emoji: '\uD83E\uDD7E',
    neighborhood: 'Hollywood Hills',
    address: '2000 N Fuller Ave, Los Angeles CA 90046',
    lat: 34.1054,
    lng: -118.3488,
    score: 93,
    hours: 'Daily sunrise-sunset',
    admission: 'Free',
    website: 'https://www.laparks.org/park/runyon-canyon',
    about: '160-acre city park in the Hollywood Hills known as the celebrity-spotting hiking trail. Two loop trails, 360-degree city and Hollywood Sign views, and one of the most dog-friendly parks in LA.',
    highlights: [
      { icon: '\uD83D\uDC15', label: 'Off-Leash Friendly', note: 'One of the few LA parks with large off-leash zones' },
      { icon: '\uD83C\uDF06', label: 'Clouds Rest Overlook', note: 'Downtown-to-ocean panorama at the peak' },
      { icon: '\u2B50', label: 'Celebrity Magnet', note: 'Morning regulars include names you recognize' }
    ],
    tips: [
      'Enter at the Fuller Ave gate for the easiest ascent; Mulholland side is steeper',
      'Avoid midday — no shade and 90F+ on the ridge',
      'Paid lot on Franklin is usually packed; try street parking on N Curson'
    ],
    bestFor: ['Hiking', 'Dog Walking', 'Views', 'Celebrity Spotting']
  },
  {
    id: 4,
    name: 'Elysian Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDF32',
    neighborhood: 'Elysian Park',
    address: '835 Academy Rd, Los Angeles CA 90012',
    lat: 34.0791,
    lng: -118.2353,
    score: 90,
    hours: 'Daily 5AM-10:30PM',
    admission: 'Free',
    website: 'https://www.laparks.org/park/elysian',
    about: "LA's oldest and second-largest city park, established in 1886. 600 acres of eucalyptus groves, trails, and picnic areas overlooking Downtown. Home to Dodger Stadium and Chavez Ravine.",
    highlights: [
      { icon: '\u26BE', label: 'Dodger Stadium', note: 'Inside the park since 1962' },
      { icon: '\uD83D\uDCDC', label: 'Founded 1886', note: "LA's oldest park" },
      { icon: '\uD83C\uDF07', label: 'Angels Point', note: 'Best skyline overlook in the park' }
    ],
    tips: [
      'Angels Point is a classic sunrise photo spot',
      'Park in Lot 15 and walk to Angels Point to skip Dodger-traffic streets',
      'Bishop Canyon trail is the shady summer route'
    ],
    bestFor: ['Hiking', 'Views', 'Picnic', 'Dodger Games', 'Free']
  },
  {
    id: 5,
    name: 'Echo Park Lake',
    type: 'Urban Park / Lake',
    emoji: '\uD83D\uDEA3',
    neighborhood: 'Echo Park',
    address: '751 Echo Park Ave, Los Angeles CA 90026',
    lat: 34.0733,
    lng: -118.2600,
    score: 89,
    hours: 'Daily 5AM-10:30PM',
    admission: 'Free (pedal boats ~$12/half hour)',
    website: 'https://www.laparks.org/park/echo-park',
    about: "A 29-acre park surrounding a man-made lake with one of LA's prettiest skyline views, a historic lotus bed, and swan-shaped pedal boats. Downtown sits framed by palm trees in the background.",
    highlights: [
      { icon: '\uD83E\uDEB7', label: 'Lotus Bed', note: 'One of the largest outside Asia — blooms mid-summer' },
      { icon: '\uD83E\uDDA2', label: 'Swan Boats', note: "Echo Park's photographed-every-weekend pedal boats" },
      { icon: '\uD83C\uDF06', label: 'Skyline View', note: 'Downtown LA framed by the lake' }
    ],
    tips: [
      'Sunrise is calmest — lotus and skyline photos without crowds',
      "The Lotus Festival every July is LA's oldest Asian-American festival",
      'Rent a boat on weekdays to avoid the line'
    ],
    bestFor: ['Date', 'Photos', 'Family', 'Relaxation']
  },
  {
    id: 6,
    name: 'Exposition Park',
    type: 'Museum Campus Park',
    emoji: '\uD83C\uDFDF\uFE0F',
    neighborhood: 'South LA / Exposition Park',
    address: '700 Exposition Park Dr, Los Angeles CA 90037',
    lat: 34.0160,
    lng: -118.2863,
    score: 92,
    hours: 'Daily dawn-dusk',
    admission: 'Free (individual museums have their own policies)',
    website: 'https://expositionpark.ca.gov',
    about: 'A 160-acre civic campus next to USC that holds the Natural History Museum, California Science Center (Space Shuttle Endeavour), California African American Museum, LA Memorial Coliseum, BMO Stadium, and a 7-acre Rose Garden.',
    highlights: [
      { icon: '\uD83C\uDFDF\uFE0F', label: 'LA Memorial Coliseum', note: 'Home of USC football and the 2028 Olympics' },
      { icon: '\uD83D\uDE80', label: 'Space Shuttle Endeavour', note: 'Inside the California Science Center (free)' },
      { icon: '\uD83C\uDF39', label: 'Rose Garden', note: '20,000 rose bushes, 200+ varieties' }
    ],
    tips: [
      'Do the Natural History Museum + Science Center as one free morning',
      'Metro E Line stops at Expo/Vermont and Expo Park/USC — skip parking',
      'Rose Garden peak bloom is March-April'
    ],
    bestFor: ['Museums', 'Family', 'Free Activity', 'Rainy Day']
  },
  {
    id: 7,
    name: 'Lake Hollywood Park',
    type: 'Viewpoint Park',
    emoji: '\uD83E\uDEA7',
    neighborhood: 'Hollywood Hills',
    address: '3160 Canyon Lake Dr, Los Angeles CA 90068',
    lat: 34.1278,
    lng: -118.3270,
    score: 86,
    hours: 'Daily 5AM-10:30PM',
    admission: 'Free',
    website: 'https://www.laparks.org/park/lake-hollywood',
    about: 'A small grassy park directly beneath the Hollywood Sign — widely considered the best photo of the sign from a legal, car-accessible spot. Dog-friendly and rarely crowded midweek.',
    highlights: [
      { icon: '\uD83E\uDEA7', label: 'Best Hollywood Sign View', note: 'Head-on, full-letter photo with no hiking' },
      { icon: '\uD83D\uDC15', label: 'Dog-Friendly', note: 'Off-leash hours posted onsite' }
    ],
    tips: [
      'Residential neighborhood — drive slow, park legally, be quiet',
      'Morning light (east) hits the sign face-on',
      'Tourist shuttles drop here — expect 5 minutes of crowd every arrival'
    ],
    bestFor: ['Photos', 'Quick Stop', 'Landmark']
  },
  {
    id: 8,
    name: 'Descanso Gardens',
    type: 'Botanical Garden',
    emoji: '\uD83C\uDF38',
    neighborhood: 'La Cañada Flintridge',
    address: '1418 Descanso Dr, La Cañada Flintridge CA 91011',
    lat: 34.2009,
    lng: -118.2064,
    score: 94,
    hours: 'Daily 9AM-5PM',
    admission: '$15 adult, $11 senior, $5 child',
    website: 'https://www.descansogardens.org',
    about: 'A 150-acre botanical garden in the San Gabriel foothills with one of the largest camellia forests in North America, a 5-acre rose garden, a Japanese garden, and a seasonal Enchanted: Forest of Light every winter.',
    highlights: [
      { icon: '\uD83C\uDF39', label: 'Rosarium', note: '5 acres, 3,000+ roses, peak April-May' },
      { icon: '\uD83C\uDF38', label: 'Camellia Forest', note: 'Largest in North America — blooms Jan-Mar' },
      { icon: '\uD83C\uDFEE', label: 'Japanese Garden', note: 'Teahouse and traditional pond' },
      { icon: '\uD83D\uDCA1', label: 'Enchanted: Forest of Light', note: 'Nov-Jan timed-entry light walk' }
    ],
    tips: [
      'Buy Enchanted tickets the day they drop — sells out',
      'Member morning hours start at 8 AM (quiet)',
      'Café Descanso is a surprisingly good weekday lunch'
    ],
    bestFor: ['Date', 'Family', 'Photos', 'Nature', 'Holiday Events']
  },
  {
    id: 9,
    name: 'Will Rogers State Historic Park',
    type: 'State Park',
    emoji: '\uD83C\uDFA0',
    neighborhood: 'Pacific Palisades',
    address: '1501 Will Rogers State Park Rd, Pacific Palisades CA 90272',
    lat: 34.0544,
    lng: -118.5131,
    score: 88,
    hours: 'Daily 8AM-sunset',
    admission: '$12 parking',
    website: 'https://www.parks.ca.gov/?page_id=626',
    about: "Cowboy-humorist Will Rogers' 359-acre ranch estate. Polo matches Saturdays April-Oct, his original 31-room ranch house, and the Inspiration Point loop trail with Pacific Ocean panoramas.",
    highlights: [
      { icon: '\uD83D\uDC34', label: 'Polo Matches', note: 'Free weekend polo, April-October' },
      { icon: '\uD83C\uDFE1', label: "Will Rogers' Ranch House", note: 'Original furniture and belongings' },
      { icon: '\uD83C\uDF0A', label: 'Inspiration Point Loop', note: '2 mi to ocean-view summit' }
    ],
    tips: [
      'Saturday polo is free and casual — bring a picnic',
      'Inspiration Point is better at sunset than sunrise (west-facing)',
      'Gate closes strictly at sunset — time the descent'
    ],
    bestFor: ['Hiking', 'Ocean Views', 'Family', 'Historic Site']
  },
  {
    id: 10,
    name: 'Kenneth Hahn State Recreation Area',
    type: 'Park',
    emoji: '\uD83C\uDF04',
    neighborhood: 'Baldwin Hills',
    address: '4100 S La Cienega Blvd, Los Angeles CA 90056',
    lat: 34.0096,
    lng: -118.3729,
    score: 85,
    hours: 'Daily 6AM-10PM',
    admission: '$6 parking',
    website: 'https://www.parks.ca.gov/?page_id=612',
    about: 'A 401-acre park on top of the Baldwin Hills with arguably the best 360° panorama in LA — downtown skyline, the Pacific, Palos Verdes, and on clear days all the way to Catalina. Fishing lake, Olympic playground, and the Baldwin Hills Scenic Overlook stairs.',
    highlights: [
      { icon: '\uD83C\uDF07', label: '360° LA Panorama', note: 'Downtown, ocean, Catalina on clear days' },
      { icon: '\uD83E\uDE9C', label: 'Baldwin Hills Stairs', note: '282 wooden steps — stadium-style workout' },
      { icon: '\uD83C\uDFA3', label: 'Fishing Lake', note: 'Stocked with catfish and trout' }
    ],
    tips: [
      'Go after rain for the clearest Catalina view',
      'The Scenic Overlook (top of the stairs) has its own small parking lot',
      'Avoid 4-6 PM weekdays — Jefferson-bound commuters jam La Cienega'
    ],
    bestFor: ['Views', 'Hiking', 'Workout', 'Fishing', 'Photos']
  }
];

// Render the array nicely, indented to fit existing PARK_DATA (2-space outer, 4-space inner).
const body = JSON.stringify(laParks, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "los angeles": ${body}\r\n`;

// Insert before the closing `}` of PARK_DATA.
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted los angeles section into PARK_DATA with', laParks.length, 'entries.');
