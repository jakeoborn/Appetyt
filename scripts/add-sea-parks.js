// Insert 'seattle' section into PARK_DATA in index.html.
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
if (/"seattle"\s*:/m.test(block)) {
  console.log('SKIP: PARK_DATA already has "seattle"');
  process.exit(0);
}

const seaParks = [
  {
    id: 1,
    name: 'Discovery Park',
    type: 'Urban Wilderness Park',
    emoji: '\uD83C\uDF32',
    neighborhood: 'Magnolia',
    address: '3801 Discovery Park Blvd, Seattle WA 98199',
    lat: 47.6617,
    lng: -122.4336,
    score: 96,
    hours: 'Daily 4AM-11:30PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/discovery-park',
    about: "At 534 acres, the largest city park in Seattle \u2014 a mostly-wild Puget Sound headland on the former Fort Lawton military reservation. Two miles of tidal beach, old-growth and second-growth forest, meadow, and sweeping views of the Olympics and Mount Rainier from the South Bluff.",
    highlights: [
      { icon: '\uD83C\uDFDD\uFE0F', label: 'Loop Trail', note: '2.8 mi signature loop through forest + meadow + bluff' },
      { icon: '\uD83D\uDDFC', label: 'West Point Lighthouse', note: 'Tidal walk to the 1881 lighthouse at the point' },
      { icon: '\uD83D\uDC0B', label: 'Puget Sound Views', note: 'Resident orcas and seals visible from the bluffs' }
    ],
    tips: [
      'Park at the South Lot for the Loop Trail and South Bluff views',
      'West Point Lighthouse beach hike requires the separate beach-access permit (free, by lottery)',
      'Sunset from the South Bluff frames the Olympics'
    ],
    bestFor: ['Hiking', 'Views', 'Nature', 'Free Activity', 'Sunset']
  },
  {
    id: 2,
    name: 'Gas Works Park',
    type: 'Urban Park',
    emoji: '\u2699\uFE0F',
    neighborhood: 'Wallingford',
    address: '2101 N Northlake Way, Seattle WA 98103',
    lat: 47.6456,
    lng: -122.3344,
    score: 94,
    hours: 'Daily 6AM-10PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/gas-works-park',
    about: "A 20-acre park on the north end of Lake Union built on a former Seattle Gas Light Company plant \u2014 the rusted cracking-tower ruin preserved as industrial sculpture. Richard Haag's 1975 landscape is the textbook reuse of an urban brownfield, and Kite Hill holds the definitive skyline view south over the lake to downtown.",
    highlights: [
      { icon: '\u2699\uFE0F', label: 'Gas Plant Ruin', note: 'Preserved cracking towers \u2014 1906 industrial sculpture' },
      { icon: '\uD83C\uDFD9\uFE0F', label: 'Kite Hill', note: 'Textbook downtown Seattle skyline framed across Lake Union' },
      { icon: '\uD83C\uDF89', label: 'Fourth of July', note: 'Signature lakeside fireworks viewing spot' }
    ],
    tips: [
      'Burke-Gilman Trail passes the north edge \u2014 bike in from Fremont or UW',
      'Kite Hill is the July 4 fireworks epicenter \u2014 expect huge crowds',
      'Sunrise photographers stake out the east lawn for downtown backlighting'
    ],
    bestFor: ['Views', 'Photography', 'Free Activity', 'Picnic', 'Kids']
  },
  {
    id: 3,
    name: 'Olympic Sculpture Park',
    type: 'Outdoor Sculpture Park',
    emoji: '\uD83D\uDDFF',
    neighborhood: 'Belltown / Waterfront',
    address: '2901 Western Ave, Seattle WA 98121',
    lat: 47.6166,
    lng: -122.3554,
    score: 92,
    hours: 'Daily sunrise-sunset',
    admission: 'Free',
    website: 'https://www.seattleartmuseum.org/visit/olympic-sculpture-park',
    about: "A 9-acre waterfront outdoor extension of Seattle Art Museum \u2014 a reclaimed industrial site terraced from downtown down to the Puget Sound shoreline. Signature pieces include Alexander Calder\u2019s Eagle, Richard Serra\u2019s Wake, Louise Bourgeois\u2019 Father and Son, and Roxy Paine\u2019s Split. Free year-round.",
    highlights: [
      { icon: '\uD83E\uDD85', label: 'Calder\u2019s Eagle', note: 'The 39-ft red sculpture framing the Sound' },
      { icon: '\uD83C\uDF35', label: 'Serra\u2019s Wake', note: 'Four hulking weathering-steel plates' },
      { icon: '\uD83C\uDF0A', label: 'Waterfront Path', note: 'Connects to the Myrtle Edwards/Elliott Bay Trail north' }
    ],
    tips: [
      'Sunset frames the Calder against the Olympic Mountains',
      'PACCAR Pavilion rotates exhibits and screenings through the year',
      'Follow the waterfront path north 1 mi to Smith Cove for the full walk'
    ],
    bestFor: ['Art', 'Walking', 'Free Activity', 'Date', 'Views']
  },
  {
    id: 4,
    name: 'Kerry Park',
    type: 'City Overlook',
    emoji: '\uD83C\uDFD9\uFE0F',
    neighborhood: 'Queen Anne',
    address: '211 W Highland Dr, Seattle WA 98119',
    lat: 47.6294,
    lng: -122.3602,
    score: 90,
    hours: 'Daily 6AM-10PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/kerry-park',
    about: "The canonical Seattle skyline postcard. A tiny 1.25-acre overlook on the south slope of Queen Anne with the iconic frame \u2014 downtown skyline, Space Needle mid-frame, Mount Rainier as backdrop on a clear day. Doris Chase\u2019s 1971 Changing Form sculpture anchors the east end.",
    highlights: [
      { icon: '\uD83C\uDF04', label: 'Skyline View', note: 'The textbook Seattle postcard \u2014 Needle + downtown + Rainier' },
      { icon: '\uD83D\uDDFF', label: 'Changing Form', note: 'Doris Chase\u2019s 1971 steel sculpture' }
    ],
    tips: [
      'Sunrise light is warmer; sunset backlights the skyline and works too',
      'July 4 and New Year\u2019s fireworks draw crowds \u2014 arrive hours early',
      'Tight street parking; walk up from lower Queen Anne on sunny weekends'
    ],
    bestFor: ['Views', 'Photography', 'Free Activity', 'Date', 'Landmark']
  },
  {
    id: 5,
    name: 'Washington Park Arboretum',
    type: 'Arboretum',
    emoji: '\uD83C\uDF38',
    neighborhood: 'Montlake / Madison Park',
    address: '2300 Arboretum Dr E, Seattle WA 98112',
    lat: 47.6386,
    lng: -122.2954,
    score: 91,
    hours: 'Daily sunrise-sunset',
    admission: 'Free',
    website: 'https://botanicgardens.uw.edu/washington-park-arboretum',
    about: "230 acres of trees and plant collections between Lake Washington and Union Bay, jointly managed by UW and Seattle Parks. The Seattle Japanese Garden sits inside its south end (separate ticket), a flat paved path (the Arboretum Waterfront Trail) loops to Foster Island and the Lake Washington shoreline, and the Azalea Way bloom in late April is the arboretum\u2019s signature event.",
    highlights: [
      { icon: '\uD83C\uDF38', label: 'Azalea Way', note: 'Signature cherry/azalea bloom \u2014 late April' },
      { icon: '\u26E9\uFE0F', label: 'Japanese Garden', note: 'Separate-ticket garden at the south end' },
      { icon: '\uD83D\uDEB6', label: 'Waterfront Trail', note: 'Flat boardwalk loop to Foster Island' }
    ],
    tips: [
      'Azalea Way\u2019s bloom window is about 10 days in late April',
      'Park free along Arboretum Dr; the Visitor Center lot is smaller',
      'Japanese Garden requires a separate $10 ticket'
    ],
    bestFor: ['Nature', 'Family', 'Photography', 'Walking', 'Free Activity']
  },
  {
    id: 6,
    name: 'Green Lake Park',
    type: 'Urban Lake Park',
    emoji: '\uD83C\uDF33',
    neighborhood: 'Green Lake',
    address: '7201 E Green Lake Dr N, Seattle WA 98115',
    lat: 47.6805,
    lng: -122.3295,
    score: 88,
    hours: 'Daily 4AM-11:30PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/green-lake-park',
    about: "A 342-acre urban park around a 259-acre kettle lake. The 2.8-mile paved shoreline path is the most-used fitness loop in the city \u2014 runners, strollers, skaters. Also: lawn bowling, pitch and putt, a public community center, kayak and paddleboard rentals, and summer Evans Pool swimming.",
    highlights: [
      { icon: '\uD83D\uDEB6', label: '2.8 mi Shore Loop', note: 'The city\u2019s most-used running loop' },
      { icon: '\uD83D\uDEA3', label: 'Kayak + SUP Rentals', note: 'Summer rentals on the east shore' },
      { icon: '\u26F3', label: 'Pitch & Putt', note: 'Nine-hole short course inside the park' }
    ],
    tips: [
      'Weekday mornings before 8 AM are the calmest loop time',
      'Pitch and Putt is a $8 round \u2014 club rentals free',
      'Evans Pool (indoor) is the free community pool on the east side'
    ],
    bestFor: ['Running', 'Family', 'Watersports', 'Free Activity', 'Fitness']
  },
  {
    id: 7,
    name: 'Alki Beach Park',
    type: 'Beach',
    emoji: '\uD83C\uDFD6\uFE0F',
    neighborhood: 'West Seattle',
    address: '1702 Alki Ave SW, Seattle WA 98116',
    lat: 47.5791,
    lng: -122.4142,
    score: 87,
    hours: 'Daily 4AM-11:30PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/alki-beach-park',
    about: "A 2.5-mile paved beach promenade on West Seattle facing downtown and Elliott Bay \u2014 the closest thing Seattle has to Venice Beach. Landing place of the 1851 Denny Party (mini replica Statue of Liberty marks the spot), beach-volleyball courts, driftwood bonfire pits, and restaurant row along Alki Ave.",
    highlights: [
      { icon: '\uD83C\uDFD9\uFE0F', label: 'Downtown View', note: 'Skyline across Elliott Bay \u2014 closest Seattle postcard after Kerry' },
      { icon: '\uD83D\uDDFD', label: 'Statue of Liberty Replica', note: 'Mini Liberty on the prom at 61st' },
      { icon: '\uD83D\uDD25', label: 'Beach Fire Pits', note: 'First-come fire pits, summer evenings' }
    ],
    tips: [
      'West Seattle Water Taxi from downtown is the scenic arrival option',
      'Sunset is the Alki event \u2014 downtown backlit, Olympics ahead',
      'Marination Ma Kai and Salty\u2019s are the waterfront restaurant anchors'
    ],
    bestFor: ['Beach', 'Views', 'Sunset', 'Family', 'Casual']
  },
  {
    id: 8,
    name: 'Volunteer Park',
    type: 'Urban Park',
    emoji: '\uD83D\uDD73\uFE0F',
    neighborhood: 'Capitol Hill',
    address: '1247 15th Ave E, Seattle WA 98112',
    lat: 47.6300,
    lng: -122.3154,
    score: 87,
    hours: 'Daily 6AM-10PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/volunteer-park',
    about: "An Olmsted-designed 1905 park on Capitol Hill: a 75-foot brick water tower with a free observation deck, the Asian Art Museum (SAM outpost) in the Art Deco 1933 building, a conservatory greenhouse, a dahlia garden, and Isamu Noguchi\u2019s Black Sun sculpture framing the Space Needle.",
    highlights: [
      { icon: '\uD83D\uDD73\uFE0F', label: 'Noguchi Black Sun', note: 'Frames the Space Needle \u2014 iconic Capitol Hill photo' },
      { icon: '\uD83D\uDD06', label: 'Water Tower Overlook', note: 'Free 106-step climb to the observation deck' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Asian Art Museum', note: 'SAM\u2019s Asian collection in the 1933 Art Deco building' },
      { icon: '\uD83C\uDF37', label: 'Conservatory', note: '1912 Victorian-style greenhouse' }
    ],
    tips: [
      'Black Sun at sunset frames the Space Needle in hot orange light',
      'Conservatory is a dollar-donation visit \u2014 an underrated rainy-afternoon option',
      'Summer Volunteer Park concerts series runs July\u2013August'
    ],
    bestFor: ['Photography', 'Art', 'Walking', 'Free Activity', 'Views']
  },
  {
    id: 9,
    name: 'Seward Park',
    type: 'Peninsula Park',
    emoji: '\uD83C\uDF32',
    neighborhood: 'Seward Park',
    address: '5902 Lake Washington Blvd S, Seattle WA 98118',
    lat: 47.5504,
    lng: -122.2585,
    score: 86,
    hours: 'Daily 6AM-10PM',
    admission: 'Free',
    website: 'https://www.seattle.gov/parks/allparks/seward-park',
    about: "A 300-acre peninsula on Lake Washington holding 120 acres of old-growth forest \u2014 one of the last stands of old-growth in Seattle. 2.4-mile paved perimeter loop, interior trails through the big trees, a small beach, and a 1927 Clark-Gable\u2011era bathhouse now used by the Audubon Center.",
    highlights: [
      { icon: '\uD83C\uDF32', label: 'Old-Growth Forest', note: 'Rare urban old growth on the interior trails' },
      { icon: '\uD83D\uDEB6', label: '2.4 mi Loop', note: 'Flat paved shoreline walk' },
      { icon: '\uD83E\uDD85', label: 'Audubon Center', note: 'Nesting bald eagles on the peninsula most years' }
    ],
    tips: [
      'Weekday mornings are the quietest for the interior trails',
      'Torii Gate on the path is the Japanese-community memorial site',
      'Lake Washington swimming beach on the north end is lifeguarded summer'
    ],
    bestFor: ['Nature', 'Running', 'Free Activity', 'Family', 'Birding']
  },
  {
    id: 10,
    name: 'Golden Gardens Park',
    type: 'Beach',
    emoji: '\uD83C\uDF05',
    neighborhood: 'Ballard',
    address: '8498 Seaview Pl NW, Seattle WA 98117',
    lat: 47.6925,
    lng: -122.4023,
    score: 85,
    hours: 'Daily 4AM-11:30PM',
    admission: 'Free (fire pits first-come)',
    website: 'https://www.seattle.gov/parks/allparks/golden-gardens-park',
    about: "A 87-acre beach park at the north end of Ballard facing the Olympics across Puget Sound. Sandy beach, driftwood bonfire pits, a 100-slip marina on the north edge, and one of the best sunset viewing points in the city. Burke-Gilman Trail terminates nearby.",
    highlights: [
      { icon: '\uD83C\uDF05', label: 'Olympic Mountain Sunset', note: 'Direct west view across the Sound' },
      { icon: '\uD83D\uDD25', label: 'Bonfire Pits', note: 'First-come summer evening pits \u2014 arrive by 5 PM weekends' },
      { icon: '\uD83D\uDEA2', label: 'Marina', note: 'Shilshole Bay marina on the north edge' }
    ],
    tips: [
      'Bonfire pits fill fast Friday\u2013Sunday evenings \u2014 plan to arrive early',
      'Ray\u2019s Boathouse is the iconic waterfront restaurant next door',
      'Return to Ballard Locks on foot via the Burke-Gilman for the full loop'
    ],
    bestFor: ['Beach', 'Sunset', 'Family', 'Free Activity', 'Bonfire']
  }
];

const body = JSON.stringify(seaParks, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "seattle": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted seattle section into PARK_DATA with', seaParks.length, 'entries.');
