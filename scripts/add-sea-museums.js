// Insert 'seattle' section into MUSEUM_DATA in index.html.
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
if (/"seattle"\s*:/m.test(block)) {
  console.log('SKIP: MUSEUM_DATA already has "seattle"');
  process.exit(0);
}

const seaMuseums = [
  {
    id: 1,
    name: 'Space Needle',
    type: 'Observatory / Landmark',
    emoji: '\uD83D\uDDFC',
    neighborhood: 'Seattle Center / Lower Queen Anne',
    address: '400 Broad St, Seattle WA 98109',
    lat: 47.6205,
    lng: -122.3493,
    score: 94,
    hours: 'Daily 10AM-9PM (hours seasonal)',
    admission: 'Adult ~$35-$40',
    website: 'https://www.spaceneedle.com',
    about: "Built 1962 for the Century 21 World\u2019s Fair, 605 feet tall and the defining silhouette of the Seattle skyline. The 2018 Century Project renovation added the all-glass Loupe rotating floor, open-air benches, and floor-to-ceiling glass walls on the observation deck. Skyline view of downtown, Elliott Bay, and Mount Rainier on a clear day.",
    highlights: [
      { icon: '\uD83D\uDDFC', label: '605 ft Tower', note: 'Defining Seattle landmark since 1962' },
      { icon: '\uD83E\uDE9F', label: 'Loupe Glass Floor', note: 'The world\u2019s first rotating glass floor \u2014 downstairs level' },
      { icon: '\uD83D\uDEAA', label: 'Open-Air Benches', note: 'Leaning glass walls on the upper observation deck' }
    ],
    tips: [
      'Sunset timed tickets are the premium slot \u2014 book a week out',
      'CityPass bundle is the standard cost-save if visiting 3+ attractions',
      'Pair with Chihuly Garden and MoPOP \u2014 all at Seattle Center'
    ],
    bestFor: ['Landmark', 'Views', 'Family', 'Date', 'Photos']
  },
  {
    id: 2,
    name: 'Chihuly Garden and Glass',
    type: 'Art Installation',
    emoji: '\uD83C\uDF38',
    neighborhood: 'Seattle Center / Lower Queen Anne',
    address: '305 Harrison St, Seattle WA 98109',
    lat: 47.6206,
    lng: -122.3497,
    score: 94,
    hours: 'Daily 10AM-7PM (hours seasonal)',
    admission: 'Adult ~$35',
    website: 'https://www.chihulygardenandglass.com',
    about: "A permanent Dale Chihuly exhibit at the base of the Space Needle \u2014 eight gallery rooms, a 100-foot glass Glasshouse sculpture, and an outdoor garden threading glass installations through living plants. Opened 2012 as the most comprehensive public showcase of Chihuly\u2019s work anywhere.",
    highlights: [
      { icon: '\uD83C\uDF3A', label: 'Glasshouse', note: '100-ft suspended glass sculpture \u2014 centerpiece' },
      { icon: '\uD83C\uDF38', label: 'Sealife & Persian Ceiling', note: 'Signature gallery rooms' },
      { icon: '\uD83C\uDF33', label: 'Outdoor Garden', note: 'Glass-threaded living garden with Space Needle overhead' }
    ],
    tips: [
      'Go after dark for the illuminated glass experience',
      'Combo ticket with Space Needle saves meaningfully',
      'Glass-blowing demonstrations run most afternoons'
    ],
    bestFor: ['Art', 'Date', 'Family', 'Rainy Day', 'Landmark']
  },
  {
    id: 3,
    name: 'Museum of Pop Culture (MoPOP)',
    type: 'Pop Culture Museum',
    emoji: '\uD83C\uDFB8',
    neighborhood: 'Seattle Center / Lower Queen Anne',
    address: '325 5th Ave N, Seattle WA 98109',
    lat: 47.6216,
    lng: -122.3481,
    score: 90,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$32',
    website: 'https://www.mopop.org',
    about: "A Frank Gehry-designed (2000) museum of pop culture \u2014 music, science fiction, horror, gaming. Paul Allen\u2019s Jimi Hendrix and Nirvana artifacts anchor the music galleries; rotating sci-fi, fantasy, and horror exhibits fill the upper floors. Sound Lab includes private rooms to play drums and guitars with Hendrix and Cobain samples.",
    highlights: [
      { icon: '\uD83C\uDFD7\uFE0F', label: 'Gehry Building', note: '2000 sculptural aluminum-and-steel exterior' },
      { icon: '\uD83C\uDFB8', label: 'Hendrix + Nirvana Galleries', note: 'Paul Allen\u2019s personal collection forms the music core' },
      { icon: '\uD83D\uDC7E', label: 'Sci-Fi + Horror Wings', note: 'Rotating genre exhibits \u2014 Star Trek, Alien, Stephen King' }
    ],
    tips: [
      'Plan 2\u20133 hours minimum; the interactive Sound Lab adds time',
      'Sky Church 40-ft LED screen runs signature short films between programs',
      'Monorail from Westlake drops right at the front door'
    ],
    bestFor: ['Music', 'Family', 'Pop Culture', 'Rainy Day', 'Architecture']
  },
  {
    id: 4,
    name: 'Seattle Art Museum (SAM)',
    type: 'Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Downtown Seattle',
    address: '1300 1st Ave, Seattle WA 98101',
    lat: 47.6079,
    lng: -122.3381,
    score: 91,
    hours: 'Wed-Sun 10AM-5PM (Thu to 9PM)',
    admission: 'Adult ~$33',
    website: 'https://www.seattleartmuseum.org',
    about: "Seattle\u2019s flagship art museum \u2014 Robert Venturi\u2019s 1991 downtown building (REI-adjacent, Hammering Man out front), a strong Northwest Coast Native collection, Porcelain Room, and modern/contemporary galleries. The Asian Art Museum in Volunteer Park and the free Olympic Sculpture Park are sister sites.",
    highlights: [
      { icon: '\uD83D\uDD28', label: 'Hammering Man', note: 'Jonathan Borofsky\u2019s 48-ft kinetic sculpture out front' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Northwest Coast Native Art', note: 'Among the strongest public collections of its kind' },
      { icon: '\uD83C\uDFEE', label: 'Porcelain Room', note: 'Signature display of 1,000+ porcelain pieces' }
    ],
    tips: [
      'Free First Thursdays once a month \u2014 expect crowds',
      'SAM ticket includes same-week entry to Asian Art Museum',
      'Olympic Sculpture Park (free, always) is 0.8 mi north on the waterfront'
    ],
    bestFor: ['Art', 'Rainy Day', 'Date', 'Culture']
  },
  {
    id: 5,
    name: 'Pacific Science Center',
    type: 'Science Museum',
    emoji: '\uD83D\uDD2D',
    neighborhood: 'Seattle Center / Lower Queen Anne',
    address: '200 2nd Ave N, Seattle WA 98109',
    lat: 47.6203,
    lng: -122.3508,
    score: 86,
    hours: 'Thu-Mon 10AM-5PM',
    admission: 'Adult ~$25',
    website: 'https://www.pacificsciencecenter.org',
    about: "Designed by Seattle-born Minoru Yamasaki for the 1962 World\u2019s Fair (same architect as the original WTC towers), a landmark arched-courtyard science center next to the Space Needle. Tropical Butterfly House, planetarium, laser dome, IMAX, two-story animatronic dinosaur exhibit, and rotating touring exhibits.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Yamasaki Arches', note: 'Iconic Gothic-inspired white arches from the 1962 Fair' },
      { icon: '\uD83E\uDD8B', label: 'Tropical Butterfly House', note: 'Year-round indoor tropical habitat' },
      { icon: '\uD83C\uDFAC', label: 'IMAX + Laser Dome', note: 'Two theaters \u2014 laser dome hosts late-night music shows' }
    ],
    tips: [
      'Laser Dome late-night music shows are a Seattle tradition',
      'Butterfly House is a five-minute visit but a hit with kids',
      'Combo ticket with Space Needle and Chihuly saves meaningfully'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day', 'Education']
  },
  {
    id: 6,
    name: 'Museum of Flight',
    type: 'Aviation Museum',
    emoji: '\u2708\uFE0F',
    neighborhood: 'Tukwila / Boeing Field',
    address: '9404 E Marginal Way S, Seattle WA 98108',
    lat: 47.5187,
    lng: -122.2975,
    score: 92,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$28',
    website: 'https://www.museumofflight.org',
    about: "Among the largest independent air-and-space museums in the world \u2014 175+ aircraft and spacecraft on Boeing Field south of downtown. Full Air Force One (the original Boeing 707), a Concorde, the NASA Space Shuttle Trainer, a WWII-era Boeing assembly plant (the Red Barn), and the full Boeing 747 prototype.",
    highlights: [
      { icon: '\uD83D\uDEE9\uFE0F', label: '175+ Aircraft', note: 'Concorde, 747 prototype, WWII fighters, SR-71 Blackbird' },
      { icon: '\uD83C\uDDFA\uD83C\uDDF8', label: 'Air Force One', note: 'Original Kennedy/Johnson-era Boeing 707' },
      { icon: '\uD83D\uDE80', label: 'Space Shuttle Trainer', note: 'NASA Full Fuselage Trainer \u2014 boardable' }
    ],
    tips: [
      'Plan 4+ hours \u2014 this is the biggest museum day in Seattle',
      'Free first Thursday each month 5\u20139 PM',
      'Outdoor Aviation Pavilion has the largest fighters and commercial jets'
    ],
    bestFor: ['Aviation', 'Family', 'History', 'Rainy Day']
  },
  {
    id: 7,
    name: 'Burke Museum of Natural History and Culture',
    type: 'Natural History Museum',
    emoji: '\uD83E\uDD95',
    neighborhood: 'University District',
    address: '4300 15th Ave NE, Seattle WA 98105',
    lat: 47.6605,
    lng: -122.3108,
    score: 88,
    hours: 'Tue-Sun 10AM-5PM',
    admission: 'Adult ~$22',
    website: 'https://www.burkemuseum.org',
    about: "Washington State\u2019s official natural history and culture museum \u2014 rebuilt 2019 into a transparent new building on the UW campus where visitors watch researchers working in labs visible from the galleries. Strong Pacific Northwest fossil, Tsimshian/Coast Salish, and ornithology collections.",
    highlights: [
      { icon: '\uD83E\uDD95', label: 'Tyrannosaurus Rex', note: 'Most complete T. rex skull found in Montana \u2014 on display' },
      { icon: '\uD83D\uDD2C', label: 'Visible Labs', note: 'Glass walls let visitors watch working scientists' },
      { icon: '\uD83D\uDCDC', label: 'Coast Salish + Tsimshian Collections', note: 'Strong Native Northwest Coast holdings' }
    ],
    tips: [
      'Campus parking lots are the easiest weekend option',
      'Pair with a UW campus walk \u2014 Suzzallo Library and quad nearby',
      'First Thursdays free admission'
    ],
    bestFor: ['Family', 'Science', 'Culture', 'Rainy Day']
  },
  {
    id: 8,
    name: 'Frye Art Museum',
    type: 'Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'First Hill',
    address: '704 Terry Ave, Seattle WA 98104',
    lat: 47.6038,
    lng: -122.3213,
    score: 83,
    hours: 'Tue-Sun 11AM-5PM',
    admission: 'Free',
    website: 'https://fryemuseum.org',
    about: "A compact First Hill art museum \u2014 always free \u2014 founded 1952 with the Charles and Emma Frye collection of 19th-century European representational painting, with a rotating contemporary program that often pushes boundaries against the founders\u2019 collection.",
    highlights: [
      { icon: '\uD83C\uDFA8', label: 'Always Free', note: 'Permanent free admission' },
      { icon: '\uD83D\uDDBC\uFE0F', label: '19th-Century European Core', note: 'Originating collection of academic painting' },
      { icon: '\uD83C\uDF1F', label: 'Rotating Contemporary', note: 'Strong-voiced contemporary programming' }
    ],
    tips: [
      'Free \u2014 low-commitment 45-minute stop',
      'Pair with a First Hill walking tour (Sorrento Hotel, St. James Cathedral)',
      'Cafe Frye is a quiet neighborhood lunch'
    ],
    bestFor: ['Art', 'Free Activity', 'Rainy Day', 'Date']
  },
  {
    id: 9,
    name: 'National Nordic Museum',
    type: 'Cultural Museum',
    emoji: '\uD83C\uDDF3\uD83C\uDDF4',
    neighborhood: 'Ballard',
    address: '2655 NW Market St, Seattle WA 98107',
    lat: 47.6654,
    lng: -122.3826,
    score: 84,
    hours: 'Tue-Sun 10AM-5PM',
    admission: 'Adult ~$18',
    website: 'https://nordicmuseum.org',
    about: "Nation\u2019s only museum dedicated to the five Nordic countries \u2014 Finland, Sweden, Norway, Denmark, Iceland. Current 57,000 sq ft Ballard building opened 2018. Permanent exhibits on Nordic American immigration (Ballard was the Norwegian fishing-fleet hub), Nordic design, and rotating cultural exhibits.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '57,000 sq ft', note: 'Only U.S. museum dedicated to the Nordic region' },
      { icon: '\uD83D\uDC72', label: 'Immigration History', note: 'Strong Ballard Norwegian fishing-fleet narrative' },
      { icon: '\uD83E\uDE91', label: 'Nordic Design', note: 'Permanent design collection and rotating exhibits' }
    ],
    tips: [
      'Pair with a Ballard day (Locks, Farmers Market, breweries)',
      'Cafe serves Nordic open-face sandwiches and Finnish pulla',
      'Gift shop stocks authentic Marimekko and Iittala'
    ],
    bestFor: ['Culture', 'History', 'Rainy Day', 'Family']
  },
  {
    id: 10,
    name: 'Seattle Aquarium',
    type: 'Aquarium',
    emoji: '\uD83D\uDC20',
    neighborhood: 'Downtown / Waterfront',
    address: '1483 Alaskan Way, Pier 59, Seattle WA 98101',
    lat: 47.6076,
    lng: -122.3424,
    score: 86,
    hours: 'Daily 9:30AM-6PM',
    admission: 'Adult ~$40',
    website: 'https://www.seattleaquarium.org',
    about: "A Pacific-focused aquarium on Pier 59 at the downtown waterfront, founded 1977. Underwater Dome (a 400,000-gallon circular tank), sea otter and river otter habitats, tide-pool touch tanks, and a new Ocean Pavilion (2024) expanding coral-reef displays dramatically.",
    highlights: [
      { icon: '\uD83C\uDF0A', label: 'Underwater Dome', note: 'Walk-around 400,000-gallon tank with local Puget Sound species' },
      { icon: '\uD83E\uDDA6', label: 'Sea Otter Habitat', note: 'Charismatic daily feedings' },
      { icon: '\uD83D\uDC22', label: 'Ocean Pavilion', note: '2024 expansion doubled the aquarium \u2014 coral reef + Indo-Pacific' }
    ],
    tips: [
      'Combo with Pike Place Market walk \u2014 steps from each other',
      'Timed-entry tickets recommended on summer weekends',
      'Sea otter feedings usually 11:30 AM and 3:30 PM \u2014 confirm on arrival'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day', 'Landmark']
  }
];

const body = JSON.stringify(seaMuseums, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "seattle": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted seattle section into MUSEUM_DATA with', seaMuseums.length, 'entries.');
