// Insert 'los angeles' section into MUSEUM_DATA in index.html.
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
if (/"los angeles"\s*:/m.test(block)) {
  console.log('SKIP: MUSEUM_DATA already has "los angeles"');
  process.exit(0);
}

const laMuseums = [
  {
    id: 1,
    name: 'Getty Center',
    type: 'Art Museum',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Brentwood',
    address: '1200 Getty Center Dr, Los Angeles CA 90049',
    lat: 34.0770,
    lng: -118.4757,
    score: 98,
    hours: 'Tue-Fri, Sun 10AM-5:30PM, Sat 10AM-9PM, Closed Mon',
    admission: 'Free (parking $25; $15 after 3PM)',
    website: 'https://www.getty.edu/visit/center/',
    about: 'Richard Meier-designed travertine campus in the Brentwood hills, reached by a tram from the parking structure. Free admission to European paintings (Van Gogh Irises, Monet, Manet), photography, decorative arts, and the Robert Irwin Central Garden.',
    highlights: [
      { icon: '\uD83D\uDEE4\uFE0F', label: 'Tram to the Top', note: 'Free electric tram from parking to the hilltop campus' },
      { icon: '\uD83C\uDF37', label: 'Central Garden', note: 'Robert Irwin living sculpture — the museum itself' },
      { icon: '\uD83D\uDDBC\uFE0F', label: 'Irises by Van Gogh', note: 'The marquee painting in the West Pavilion' },
      { icon: '\uD83D\uDCF8', label: 'City Panorama', note: 'Best free LA view on the west side' }
    ],
    tips: [
      'Go after 3PM on Saturdays — cheaper parking + evening hours',
      'South Pavilion decorative arts rooms are often empty',
      'Cafe Garden Terrace is a real meal, not a snack bar'
    ],
    bestFor: ['Art Lovers', 'Date Night', 'Free Activity', 'Architecture', 'Views']
  },
  {
    id: 2,
    name: 'LACMA (Los Angeles County Museum of Art)',
    type: 'Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Miracle Mile',
    address: '5905 Wilshire Blvd, Los Angeles CA 90036',
    lat: 34.0645,
    lng: -118.3600,
    score: 97,
    hours: 'Mon, Tue, Thu 11AM-5PM, Fri 11AM-8PM, Sat-Sun 10AM-7PM, Closed Wed',
    admission: '$25 adult, $21 senior, free for LA County residents after 3PM M-F',
    website: 'https://www.lacma.org',
    about: "The largest art museum in the western United States — 147,000 works spanning ancient to contemporary. Home to Chris Burden's Urban Light (202 street lamps) and Michael Heizer's Levitated Mass (a 340-ton boulder suspended over a pedestrian slot).",
    highlights: [
      { icon: '\uD83D\uDCA1', label: 'Urban Light', note: '202 restored 1920s-30s LA street lamps — free to visit anytime' },
      { icon: '\uD83E\uDEA8', label: 'Levitated Mass', note: 'Michael Heizer — walk beneath a 340-ton granite boulder' },
      { icon: '\uD83C\uDFEF', label: 'Japanese Pavilion', note: 'Bruce Goff pagoda housing the Shin\u2019enkan collection' },
      { icon: '\uD83C\uDFAD', label: 'Live Jazz Fridays', note: 'Free outdoor jazz on the plaza, April-Nov' }
    ],
    tips: [
      'Urban Light is free and photogenic after dark — no ticket required',
      'LA County residents free after 3PM Mon-Fri with ID',
      'The Peter Zumthor replacement building is under construction — verify galleries open before going'
    ],
    bestFor: ['Art Lovers', 'Date Night', 'Photos', 'Culture', 'Free Moment']
  },
  {
    id: 3,
    name: 'The Broad',
    type: 'Contemporary Art Museum',
    emoji: '\uD83D\uDDBC\uFE0F',
    neighborhood: 'Downtown LA / Bunker Hill',
    address: '221 S Grand Ave, Los Angeles CA 90012',
    lat: 34.0543,
    lng: -118.2501,
    score: 96,
    hours: 'Tue-Wed 11AM-5PM, Thu-Fri 11AM-8PM, Sat 10AM-8PM, Sun 10AM-6PM, Closed Mon',
    admission: 'Free (timed reservation required; special exhibits ticketed)',
    website: 'https://www.thebroad.org',
    about: "Eli and Edythe Broad's 2,000-work contemporary collection — Koons, Basquiat, Kruger, Warhol, Kusama — inside Diller Scofidio + Renfro's honeycomb \"veil and vault\" building next to Disney Hall. Always free with reservation.",
    highlights: [
      { icon: '\u267E\uFE0F', label: 'Infinity Mirror Rooms', note: 'Yayoi Kusama — two rooms, reservation inside the museum' },
      { icon: '\uD83C\uDFA8', label: 'Koons & Basquiat', note: 'Balloon Dog (Blue), Tulips, and a deep Basquiat stack' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Diller Scofidio + Renfro', note: 'The exterior "veil" itself is a landmark' },
      { icon: '\uD83C\uDD93', label: 'Free Admission', note: 'Always free with a timed reservation' }
    ],
    tips: [
      'Book Infinity Room sign-up the moment you enter — separate from museum entry',
      'Walk-up standby line usually works if no online tickets',
      'Pair with Disney Hall across the street + Grand Central Market'
    ],
    bestFor: ['Art Lovers', 'Date Night', 'Photos', 'Free Activity']
  },
  {
    id: 4,
    name: 'Natural History Museum of Los Angeles County',
    type: 'Natural History Museum',
    emoji: '\uD83E\uDD95',
    neighborhood: 'Exposition Park',
    address: '900 Exposition Blvd, Los Angeles CA 90007',
    lat: 34.0184,
    lng: -118.2878,
    score: 94,
    hours: 'Daily 9:30AM-5PM',
    admission: '$18 adult, $15 senior/student, $8 child (free first Tuesday)',
    website: 'https://nhm.org',
    about: "The largest natural and historical museum in the western US, founded in 1913. 35 million specimens — the Dinosaur Hall with a T. rex growth series, the Gem and Mineral Hall, and the new NHM Commons glass entrance pavilion.",
    highlights: [
      { icon: '\uD83E\uDD96', label: 'Dinosaur Hall', note: 'Three T. rex skeletons at different growth stages' },
      { icon: '\uD83D\uDC8E', label: 'Gem and Mineral Hall', note: '2,000+ specimens, meteorites, and a walk-in gold vault' },
      { icon: '\uD83C\uDF3F', label: 'Nature Gardens', note: '3.5 acres of outdoor exhibit — butterfly pavilion seasonally' }
    ],
    tips: [
      'Free first Tuesday of the month (except July and August)',
      'Pair with the California Science Center across the lawn',
      'Metro E Line stops at Expo Park / USC — skip parking'
    ],
    bestFor: ['Family', 'Rainy Day', 'Science Kids', 'Museums', 'Culture']
  },
  {
    id: 5,
    name: 'California Science Center',
    type: 'Science Museum',
    emoji: '\uD83D\uDE80',
    neighborhood: 'Exposition Park',
    address: '700 Exposition Park Dr, Los Angeles CA 90037',
    lat: 34.0160,
    lng: -118.2863,
    score: 95,
    hours: 'Daily 10AM-5PM',
    admission: 'Free (special exhibits and IMAX ticketed)',
    website: 'https://californiasciencecenter.org',
    about: "The largest hands-on science museum in the western US and the permanent home of the Space Shuttle Endeavour. A second shuttle display (in vertical launch configuration) is under construction as part of the new Samuel Oschin Air and Space Center.",
    highlights: [
      { icon: '\uD83D\uDE80', label: 'Space Shuttle Endeavour', note: '25 missions flown; free timed reservation to enter' },
      { icon: '\uD83C\uDFA1', label: 'World of Life', note: 'From cell to ecosystem, for all ages' },
      { icon: '\uD83C\uDFAC', label: 'IMAX Theater', note: 'Seven-story screen — the largest in California' }
    ],
    tips: [
      'Free Endeavour timed reservation is required — grab day-of online',
      'Metro E Line drops you 2 minutes from the entrance',
      'Pair with the Natural History Museum for a free science afternoon'
    ],
    bestFor: ['Family', 'Free Activity', 'Science Kids', 'Rainy Day', 'Landmark']
  },
  {
    id: 6,
    name: 'Getty Villa',
    type: 'Antiquities Museum',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Pacific Palisades',
    address: '17985 Pacific Coast Hwy, Pacific Palisades CA 90272',
    lat: 34.0450,
    lng: -118.5650,
    score: 93,
    hours: 'Wed-Mon 10AM-5PM, Closed Tue',
    admission: 'Free (timed ticket required; parking $25, $15 after 3PM)',
    website: 'https://www.getty.edu/visit/villa/',
    about: 'A recreation of a 1st-century Roman seaside villa (the Villa dei Papiri at Herculaneum) on 64 acres above Pacific Coast Highway. Houses the Getty\u2019s Greek, Roman, and Etruscan antiquities — roughly 1,200 works on view at any time.',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Roman Villa Replica', note: 'Based on the Villa dei Papiri near Pompeii' },
      { icon: '\uD83C\uDFFA', label: 'Outer Peristyle', note: 'The most photographed pool-and-colonnade in California' },
      { icon: '\uD83C\uDFAD', label: 'Outdoor Theater', note: 'Summer Greek/Roman play series in the classical theater' }
    ],
    tips: [
      'Reserve the timed ticket — free but required even to enter the lot',
      'Go weekday mornings — PCH traffic turns evil by 3 PM',
      'Cafe is plein-air with ocean views — worth the stop'
    ],
    bestFor: ['Art Lovers', 'Architecture', 'Date Night', 'Free Activity', 'Photos']
  },
  {
    id: 7,
    name: 'Petersen Automotive Museum',
    type: 'Automotive Museum',
    emoji: '\uD83D\uDE97',
    neighborhood: 'Miracle Mile',
    address: '6060 Wilshire Blvd, Los Angeles CA 90036',
    lat: 34.0623,
    lng: -118.3612,
    score: 92,
    hours: 'Daily 10AM-5PM',
    admission: '$21 adult, $19 senior, $13 child; Vault Tour +$25',
    website: 'https://www.petersen.org',
    about: "A four-story automotive museum wrapped in 100 tons of red-ribbon stainless steel on Miracle Mile. 100+ cars on rotation — celebrity cars, Hollywood cars, motorsport, and the underground Vault with 250 additional vehicles viewable only by tour.",
    highlights: [
      { icon: '\uD83D\uDEE3\uFE0F', label: 'Hollywood Gallery', note: 'Movie cars — Bond, Batman, Fast & Furious, Back to the Future' },
      { icon: '\uD83D\uDD12', label: 'The Vault Tour', note: '250 cars beneath the museum — guided only' },
      { icon: '\uD83C\uDFC1', label: 'Motorsport Hall', note: 'F1, NASCAR, IndyCar rotating display' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Kohn Pedersen Fox Facade', note: 'The signature red steel ribbon wrap' }
    ],
    tips: [
      'Book the Vault Tour separately and in advance — often the highlight',
      'Same block as LACMA and the Academy Museum — easy three-stop day',
      'Free entry day on select holidays (check website)'
    ],
    bestFor: ['Car Lovers', 'Family', 'Date Night', 'Rainy Day', 'Date Kids']
  },
  {
    id: 8,
    name: 'Hammer Museum',
    type: 'Contemporary Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Westwood',
    address: '10899 Wilshire Blvd, Los Angeles CA 90024',
    lat: 34.0595,
    lng: -118.4438,
    score: 91,
    hours: 'Tue-Sun 11AM-6PM, Closed Mon',
    admission: 'Free',
    website: 'https://hammer.ucla.edu',
    about: 'UCLA\u2019s contemporary art museum — free admission, consistently strong rotating exhibitions, and the biennial Made in L.A. survey of emerging LA artists. Michael Maltzan-designed 2023 expansion modernized the galleries and courtyard.',
    highlights: [
      { icon: '\uD83C\uDD93', label: 'Always Free', note: 'UCLA-run — admission is free every day' },
      { icon: '\uD83C\uDFAD', label: 'Made in L.A. Biennial', note: 'LA\u2019s must-see emerging-artists survey every two years' },
      { icon: '\uD83C\uDF33', label: 'Courtyard', note: 'Hammer Courtyard programming — talks, screenings, concerts' }
    ],
    tips: [
      'Free validated parking for 3 hours in the museum garage',
      'Billy Wilder Theater screenings are free but sometimes ticketed',
      'Pair with a walk on Westwood Village or Wilshire Corridor'
    ],
    bestFor: ['Art Lovers', 'Free Activity', 'Date Night', 'Students']
  },
  {
    id: 9,
    name: 'MOCA Grand Avenue',
    type: 'Contemporary Art Museum',
    emoji: '\uD83E\uDDE9',
    neighborhood: 'Downtown LA / Bunker Hill',
    address: '250 S Grand Ave, Los Angeles CA 90012',
    lat: 34.0541,
    lng: -118.2501,
    score: 90,
    hours: 'Tue-Wed, Fri 11AM-5PM, Thu 11AM-8PM, Sat-Sun 11AM-6PM, Closed Mon',
    admission: 'Free (special exhibits may ticket)',
    website: 'https://www.moca.org',
    about: 'The Museum of Contemporary Art\u2019s flagship on Grand Avenue, in an Arata Isozaki-designed red sandstone building that opened in 1986. One of the largest post-1940s collections in the country — Rothko, Pollock, Rauschenberg, Warhol.',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Arata Isozaki Building', note: '1986 postmodern red sandstone landmark' },
      { icon: '\uD83C\uDFA8', label: 'Post-1940s Canon', note: 'Pollock, Rothko, Rauschenberg, Lichtenstein' },
      { icon: '\uD83C\uDD93', label: 'Free Admission', note: 'Permanent collection is always free' }
    ],
    tips: [
      'MOCA Geffen in Little Tokyo is a separate sibling location worth adding',
      'Best paired with The Broad two blocks north and Disney Hall between them',
      'Grand Park + Grand Central Market complete a perfect Bunker Hill day'
    ],
    bestFor: ['Art Lovers', 'Free Activity', 'Date Night', 'Culture']
  },
  {
    id: 10,
    name: 'Autry Museum of the American West',
    type: 'History / Culture Museum',
    emoji: '\uD83E\uDD20',
    neighborhood: 'Griffith Park',
    address: '4700 Western Heritage Way, Los Angeles CA 90027',
    lat: 34.1486,
    lng: -118.2813,
    score: 87,
    hours: 'Tue-Fri 10AM-4PM, Sat-Sun 10AM-5PM, Closed Mon',
    admission: '$18 adult, $14 senior/student, $8 child',
    website: 'https://theautry.org',
    about: 'Founded by singing cowboy Gene Autry in 1988 to tell the story of the American West — Indigenous, colonial, frontier, and Hollywood-cowboy. Holds the Southwest Museum of the American Indian collection, one of the largest in the US.',
    highlights: [
      { icon: '\uD83C\uDFC7', label: 'Gene Autry Legacy', note: 'Costumes, guitars, and film memorabilia from the singing cowboy' },
      { icon: '\uD83C\uDFF9', label: 'Southwest Museum Collection', note: 'One of the largest Native American art holdings in the country' },
      { icon: '\uD83C\uDFAC', label: 'Hollywood Westerns', note: 'Props and costumes from the golden age of movie Westerns' }
    ],
    tips: [
      'Inside Griffith Park — pair with the Zoo or Observatory',
      'Free second Tuesday of the month',
      'Crossroads West cafe is a quiet lunch spot if the Griffith lots are full'
    ],
    bestFor: ['Family', 'History Lovers', 'Culture', 'Kids', 'Free Moment']
  }
];

const body = JSON.stringify(laMuseums, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "los angeles": ${body}\r\n`;

const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted los angeles section into MUSEUM_DATA with', laMuseums.length, 'entries.');
