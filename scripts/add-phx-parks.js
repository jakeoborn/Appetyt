// Insert 'phoenix' section into PARK_DATA in index.html.
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
if (/"phoenix"\s*:/m.test(block)) {
  console.log('SKIP: PARK_DATA already has "phoenix"');
  process.exit(0);
}

const phxParks = [
  {
    id: 1,
    name: 'Camelback Mountain (Echo Canyon Trailhead)',
    type: 'Mountain Preserve',
    emoji: '\uD83C\uDFD4\uFE0F',
    neighborhood: 'Paradise Valley / Camelback',
    address: '4925 E McDonald Dr, Phoenix AZ 85018',
    lat: 33.5172,
    lng: -111.9591,
    score: 96,
    hours: 'Daily sunrise-sunset',
    admission: 'Free (lot fills by 7AM weekends)',
    website: 'https://www.phoenix.gov/parks/trails/locations/camelback-mountain',
    about: "At 2,704 feet, the tallest peak in the Phoenix city skyline and the defining silhouette of the metro. Echo Canyon is the short, brutal west approach \u2014 1.2 miles one-way, 1,300 feet up, with scramble sections. Cholla Trail (east side) is the longer, less vertical alternative.",
    highlights: [
      { icon: '\u26F0\uFE0F', label: 'Echo Canyon Trail', note: '1.2 mi / 1,300 ft \u2014 scramble sections with handrails' },
      { icon: '\uD83D\uDDFB', label: 'Cholla Trail', note: '1.5 mi east-side alternative \u2014 less scramble' },
      { icon: '\uD83C\uDFD9\uFE0F', label: 'Summit Views', note: '360\u00B0 over the Valley \u2014 downtown, PV, South Mountain' }
    ],
    tips: [
      'Start before sunrise in summer \u2014 rescues spike after 9 AM once the rock heats',
      'Parking lot often closes by 7 AM weekends \u2014 Uber or bike in',
      'Bring twice the water you think you need; no shade, no refills on trail'
    ],
    bestFor: ['Hiking', 'Views', 'Fitness', 'Landmark', 'Sunrise']
  },
  {
    id: 2,
    name: 'Papago Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDFDE\uFE0F',
    neighborhood: 'Papago / Tempe Border',
    address: '625 N Galvin Pkwy, Phoenix AZ 85008',
    lat: 33.4568,
    lng: -111.9500,
    score: 92,
    hours: 'Daily 5AM-11PM',
    admission: 'Free',
    website: 'https://www.phoenix.gov/parks/parks/alphabetical/p-parks/papago',
    about: "A 1,200-acre red-sandstone park between Phoenix and Tempe holding Hole-in-the-Rock, the Desert Botanical Garden, the Phoenix Zoo, a municipal golf course, fishing lagoons, and the Tomb of Governor Hunt. The buttes are the most recognizable natural feature inside the city limits.",
    highlights: [
      { icon: '\uD83E\uDEA8', label: 'Hole-in-the-Rock', note: 'Short walk-up to the signature sandstone aperture' },
      { icon: '\uD83C\uDF35', label: 'Desert Botanical Garden', note: 'On-property, ticketed separately' },
      { icon: '\uD83E\uDD81', label: 'Phoenix Zoo', note: 'Inside the park boundary' },
      { icon: '\uD83C\uDFCC\uFE0F', label: 'Papago Golf Course', note: 'Classic municipal layout along the buttes' }
    ],
    tips: [
      'Hole-in-the-Rock is best at sunset \u2014 the aperture frames west-facing light',
      'Park at the Hunt\u2019s Tomb lot for the quietest summit scramble',
      'Fishing lagoons are stocked \u2014 valid AZ license required'
    ],
    bestFor: ['Family', 'Free Activity', 'Hiking', 'Photos', 'Picnic']
  },
  {
    id: 3,
    name: 'South Mountain Park and Preserve',
    type: 'Mountain Preserve',
    emoji: '\u26F0\uFE0F',
    neighborhood: 'South Phoenix',
    address: '10919 S Central Ave, Phoenix AZ 85042',
    lat: 33.3631,
    lng: -112.0482,
    score: 93,
    hours: 'Daily 5AM-7PM (summer) / 5AM-9PM',
    admission: 'Free',
    website: 'https://www.phoenix.gov/parks/trails/locations/south-mountain',
    about: "At 16,000+ acres, among the largest municipal parks in the country. 58 miles of trails, the summit drive up to Dobbins Lookout (2,330 ft) for the classic Valley overview, and the Mystery Castle at the foot of the range.",
    highlights: [
      { icon: '\uD83C\uDFD4\uFE0F', label: '16,000+ Acres', note: 'Among the largest city parks in the U.S.' },
      { icon: '\uD83D\uDE97', label: 'Dobbins Lookout Drive', note: '5.5 mi paved summit drive to the 2,330 ft overlook' },
      { icon: '\uD83E\uDD7E', label: '58 Miles of Trails', note: 'Mormon Trail, Hidden Valley, National Trail traverse' }
    ],
    tips: [
      'Dobbins Lookout at sunset is the postcard Valley view',
      'Hidden Valley loop (via Mormon Trail) hits the Fat Man\u2019s Pass slot',
      'Summer closes gates at 7 PM \u2014 plan descent before dusk'
    ],
    bestFor: ['Hiking', 'Views', 'Cycling', 'Free Activity', 'Sunset']
  },
  {
    id: 4,
    name: 'Desert Botanical Garden',
    type: 'Botanical Garden',
    emoji: '\uD83C\uDF35',
    neighborhood: 'Papago',
    address: '1201 N Galvin Pkwy, Phoenix AZ 85008',
    lat: 33.4620,
    lng: -111.9437,
    score: 95,
    hours: 'Daily 8AM-8PM (hours seasonal)',
    admission: 'Adult ~$30, Child ~$15 (check site)',
    website: 'https://dbg.org',
    about: "A 140-acre living museum of the Sonoran Desert in the shadow of the Papago buttes. 50,000 plants across five thematic trails, one of the world\u2019s most important cactus collections, and the annual Las Noches de las Luminarias lighting through December.",
    highlights: [
      { icon: '\uD83C\uDF35', label: '50,000 Plants', note: '4,379 species across five themed trails' },
      { icon: '\uD83D\uDD4D', label: 'Desert Discovery Loop', note: 'Flagship 0.33 mi ADA loop through signature cacti' },
      { icon: '\uD83C\uDF1F', label: 'Las Noches de las Luminarias', note: 'December luminaria lighting \u2014 tickets sell months out' },
      { icon: '\uD83D\uDD8C\uFE0F', label: 'Rotating Art', note: 'Chihuly and Bruce Munro installations have anchored past seasons' }
    ],
    tips: [
      'Visit at opening or after 5 PM in summer \u2014 trails are unshaded',
      'The Butterfly Pavilion is spring (Mar-May) and fall (Sep-Nov) only',
      'Members entrance avoids the peak-hour ticket line'
    ],
    bestFor: ['Nature', 'Family', 'Photography', 'Date', 'Landmark']
  },
  {
    id: 5,
    name: 'Piestewa Peak / Phoenix Mountains Preserve',
    type: 'Mountain Preserve',
    emoji: '\u26F0\uFE0F',
    neighborhood: 'North Phoenix',
    address: '2701 E Squaw Peak Dr, Phoenix AZ 85016',
    lat: 33.5430,
    lng: -112.0218,
    score: 90,
    hours: 'Daily 5AM-7PM (summer) / 5AM-9PM',
    admission: 'Free',
    website: 'https://www.phoenix.gov/parks/trails/locations/piestewa-peak',
    about: "At 2,610 feet, the second-highest peak inside Phoenix and the locals\u2019 weekly cardio hike. Summit Trail #300 is 1.2 miles one-way with 1,200 feet of gain. Renamed in 2003 from Squaw Peak in honor of Lori Ann Piestewa, the first Native American woman killed in combat serving the U.S. military.",
    highlights: [
      { icon: '\u26F0\uFE0F', label: 'Summit Trail #300', note: '1.2 mi / 1,200 ft \u2014 the canonical Phoenix hike' },
      { icon: '\uD83C\uDFD9\uFE0F', label: 'Valley Views', note: 'Camelback to the south, downtown to the SW' },
      { icon: '\uD83D\uDEB6', label: 'Circumference Trail', note: '3.7 mi loop at the base for a cooler option' }
    ],
    tips: [
      'Full lot most weekends by 7 AM \u2014 park at Freestone lot and walk in',
      'Summit Trail is steep from the start, no easing in',
      'Circumference Trail is the cooler summer alternative'
    ],
    bestFor: ['Hiking', 'Fitness', 'Views', 'Sunrise', 'Free Activity']
  },
  {
    id: 6,
    name: 'McDowell Sonoran Preserve (Gateway Trailhead)',
    type: 'Desert Preserve',
    emoji: '\uD83C\uDF35',
    neighborhood: 'North Scottsdale',
    address: '18333 N Thompson Peak Pkwy, Scottsdale AZ 85255',
    lat: 33.6494,
    lng: -111.8527,
    score: 92,
    hours: 'Daily sunrise-sunset',
    admission: 'Free',
    website: 'https://www.scottsdaleaz.gov/preserve',
    about: "At 30,000+ acres, the largest urban preserve in the country, protecting a swath of the McDowell Mountains on Scottsdale\u2019s north edge. Gateway Trailhead is the flagship trailhead \u2014 Bajada Loop and Gateway Loop are the two signature entries, with Tom\u2019s Thumb on the east side as the top technical destination.",
    highlights: [
      { icon: '\uD83C\uDF35', label: '30,000+ Acres', note: 'Largest urban preserve in the United States' },
      { icon: '\uD83E\uDEA8', label: 'Tom\u2019s Thumb', note: 'Granite finger summit \u2014 4 mi / 1,200 ft from the Thumb trailhead' },
      { icon: '\uD83D\uDEB4', label: 'Bajada Loop', note: '1.9 mi Gateway loop suitable for most fitness levels' }
    ],
    tips: [
      'Summer hikes start before sunrise; return to trailhead before 9 AM',
      'Tom\u2019s Thumb trailhead is separate from Gateway \u2014 check which route before driving',
      'Sunday Nature Guide walks depart Gateway at 8 AM most of the year'
    ],
    bestFor: ['Hiking', 'Views', 'Nature', 'Fitness', 'Free Activity']
  },
  {
    id: 7,
    name: 'Riparian Preserve at Water Ranch',
    type: 'Wildlife Preserve',
    emoji: '\uD83E\uDD86',
    neighborhood: 'Gilbert',
    address: '2757 E Guadalupe Rd, Gilbert AZ 85234',
    lat: 33.3634,
    lng: -111.7337,
    score: 88,
    hours: 'Daily sunrise-10PM',
    admission: 'Free',
    website: 'https://www.gilbertaz.gov/departments/parks-and-recreation/riparian-preserve-at-water-ranch',
    about: "110 acres of reclaimed-water wetlands in suburban Gilbert \u2014 among the top birding sites in Arizona. 4.5 miles of level paths loop around seven recharge basins where 298 species have been sighted. Also holds a public astronomy observatory operated by the Phoenix Astronomical Society.",
    highlights: [
      { icon: '\uD83E\uDD86', label: '298 Bird Species', note: 'Night-herons, avocets, stilts, pelicans in season' },
      { icon: '\uD83D\uDD2D', label: 'Gilbert Observatory', note: 'Public Saturday-night viewings (weather permitting)' },
      { icon: '\uD83D\uDEB6', label: '4.5 mi of Trails', note: 'Flat, stroller-friendly loops around seven basins' }
    ],
    tips: [
      'Dawn and dusk are the active birding windows',
      'The ponds rotate through filling/draining cycles \u2014 one may be empty',
      'Observatory nights posted monthly on the Astronomical Society site'
    ],
    bestFor: ['Nature', 'Family', 'Free Activity', 'Photography', 'Running']
  },
  {
    id: 8,
    name: 'Tempe Town Lake / Tempe Beach Park',
    type: 'Urban Lake Park',
    emoji: '\uD83D\uDEA3',
    neighborhood: 'Tempe',
    address: '620 N Mill Ave, Tempe AZ 85281',
    lat: 33.4304,
    lng: -111.9350,
    score: 86,
    hours: 'Park daily 5:30AM-10PM',
    admission: 'Free (rentals ticketed)',
    website: 'https://www.tempe.gov/government/community-services/parks/tempe-beach-park-and-tempe-town-lake',
    about: "A 2-mile urban lake on a rubberized-dam segment of the Salt River, framed by ASU and Hayden Butte. Kayak and paddleboard rentals, Tempe Beach Park concerts, the Sun Devil Energy Bridge, and two signature seasonal events \u2014 the Ironman Arizona swim and the Fantasy of Lights boat parade.",
    highlights: [
      { icon: '\uD83D\uDEA3', label: 'Kayak/Paddleboard', note: 'Rentals on the south bank most of the year' },
      { icon: '\uD83C\uDFDF\uFE0F', label: 'Tempe Beach Park', note: 'Waterfront lawns \u2014 Innings Festival, Fourth of July' },
      { icon: '\uD83C\uDF09', label: 'Hayden Butte / A Mountain', note: 'Short climb right at the south end' }
    ],
    tips: [
      'Park at Hayden Butte lot for combined lake + butte hike',
      'Mill Avenue bars and ASU campus are a five-minute walk from the south bank',
      'Fantasy of Lights parade (early December) is the best free winter event'
    ],
    bestFor: ['Watersports', 'Family', 'Free Activity', 'Running', 'Events']
  },
  {
    id: 9,
    name: 'Encanto Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDFDE\uFE0F',
    neighborhood: 'Central Phoenix',
    address: '2605 N 15th Ave, Phoenix AZ 85007',
    lat: 33.4737,
    lng: -112.0900,
    score: 82,
    hours: 'Daily 6AM-10PM',
    admission: 'Free (Enchanted Island rides ticketed)',
    website: 'https://www.phoenix.gov/parks/parks/alphabetical/e-parks/encanto',
    about: "A 222-acre classic urban park a mile from downtown \u2014 lagoon with paddle boats, an 18-hole municipal golf course, a nine-hole short course, and the century-old Enchanted Island amusement park (\u201850s-era carousel, kiddie coaster, train). Surrounded by the Encanto-Palmcroft historic district of Spanish and Tudor Revival homes.",
    highlights: [
      { icon: '\uD83D\uDEB6', label: 'Lagoon & Paddle Boats', note: 'Classic island-loop paddle boat ride' },
      { icon: '\uD83C\uDFA1', label: 'Enchanted Island', note: 'Vintage amusement park inside the park' },
      { icon: '\u26F3', label: 'Encanto Golf', note: '18-hole municipal + nine-hole executive' }
    ],
    tips: [
      'Walk the surrounding Encanto-Palmcroft district for the \u201920s\u2013\u201940s architecture',
      'Enchanted Island hours are limited Sep\u2013May \u2014 check before visiting',
      'Weekends get crowded by 11 AM \u2014 arrive early for parking'
    ],
    bestFor: ['Family', 'Free Activity', 'Picnic', 'Golf']
  },
  {
    id: 10,
    name: 'Lost Dutchman State Park',
    type: 'State Park',
    emoji: '\uD83C\uDFD4\uFE0F',
    neighborhood: 'Apache Junction (East Valley)',
    address: '6109 N Apache Trail, Apache Junction AZ 85119',
    lat: 33.4611,
    lng: -111.4786,
    score: 89,
    hours: 'Daily sunrise-sunset',
    admission: '$10/vehicle',
    website: 'https://azstateparks.com/lost-dutchman',
    about: "320 acres at the western base of the Superstition Mountains, 40 miles east of downtown. Trailhead for Siphon Draw and the Flatiron scramble \u2014 the definitive serious Phoenix-area day hike \u2014 plus gentler Treasure Loop and Discovery trails. The park and surrounding wilderness take their name from the Lost Dutchman\u2019s gold mine legend.",
    highlights: [
      { icon: '\uD83E\uDEA8', label: 'Flatiron Scramble', note: 'Via Siphon Draw \u2014 6 mi / 2,800 ft, class 3 terrain near the top' },
      { icon: '\uD83C\uDF35', label: 'Treasure Loop', note: '2.4 mi family loop with Superstition wall views' },
      { icon: '\u26FA', label: 'Campground', note: '138 sites, electric hookups, reservable year-round' }
    ],
    tips: [
      'Flatiron is not a beginner hike \u2014 bring gloves for the slab section',
      'Spring wildflower bloom (March) is the park\u2019s peak season',
      'Pair with lunch or pie in nearby Apache Junction old town'
    ],
    bestFor: ['Hiking', 'Camping', 'Nature', 'Day Trip', 'Views']
  }
];

const body = JSON.stringify(phxParks, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "phoenix": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted phoenix section into PARK_DATA with', phxParks.length, 'entries.');
