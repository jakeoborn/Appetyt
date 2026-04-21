// Insert 'san antonio' section into MUSEUM_DATA in index.html.
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
if (/"san antonio"\s*:/m.test(block)) {
  console.log('SKIP: MUSEUM_DATA already has "san antonio"');
  process.exit(0);
}

const satMuseums = [
  {
    id: 1,
    name: 'The Alamo',
    type: 'Historic Mission / Memorial',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Downtown',
    address: '300 Alamo Plaza, San Antonio TX 78205',
    lat: 29.4260,
    lng: -98.4861,
    score: 95,
    hours: 'Daily 9AM-5:30PM',
    admission: 'Free (chapel); paid tours available',
    website: 'https://www.thealamo.org',
    about: "The 18th-century Spanish mission where in 1836 a garrison of ~200 Texian defenders \u2014 including William Travis, Jim Bowie, and Davy Crockett \u2014 died holding the Alamo against Santa Anna\u2019s army for 13 days. A UNESCO World Heritage Site, the state\u2019s most visited historic location, and the anchor of the downtown Alamo Plaza district.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Mission Church', note: 'The iconic 1744 chapel fa\u00E7ade' },
      { icon: '\uD83C\uDF0D', label: 'UNESCO World Heritage', note: 'Inscribed 2015 with San Antonio Missions' },
      { icon: '\uD83D\uDCDC', label: 'Long Barrack', note: 'Original mission convento \u2014 interpretive gallery' }
    ],
    tips: [
      'Chapel entry is free but requires a timed-entry reservation',
      'Audio tour and Battlefield Tour are ticketed add-ons \u2014 worth it',
      'Hats off inside the chapel'
    ],
    bestFor: ['Historic', 'Landmark', 'Family', 'Free Activity']
  },
  {
    id: 2,
    name: 'San Antonio Museum of Art (SAMA)',
    type: 'Encyclopedic Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Midtown / Pearl District',
    address: '200 W Jones Ave, San Antonio TX 78215',
    lat: 29.4380,
    lng: -98.4773,
    score: 90,
    hours: 'Tue-Sun 10AM-5PM (Fri to 9PM)',
    admission: 'Adult ~$20',
    website: 'https://www.samuseum.org',
    about: "Located in the restored 1884 Lone Star Brewery on the San Antonio River just south of the Pearl. Strong Latin American and Asian collections \u2014 the Nelson A. Rockefeller Latin American wing is among the best in the country \u2014 plus Mediterranean antiquities, American, and contemporary galleries.",
    highlights: [
      { icon: '\uD83C\uDFD7\uFE0F', label: 'Lone Star Brewery Building', note: '1884 brick brewery, restored 1981' },
      { icon: '\uD83C\uDFAD', label: 'Rockefeller Latin American Wing', note: 'Among the best Latin American art holdings in the U.S.' },
      { icon: '\uD83D\uDC34', label: 'Asian Galleries', note: 'Strong Chinese ceramics and East Asian holdings' }
    ],
    tips: [
      'River Walk Museum Reach passes directly by \u2014 arrive by water',
      'Free admission Tuesday 4\u20139 PM and Sunday 10 AM\u2013noon',
      'Pair with the Pearl for lunch \u2014 10-min river walk south'
    ],
    bestFor: ['Art', 'Rainy Day', 'Culture', 'Date']
  },
  {
    id: 3,
    name: 'McNay Art Museum',
    type: 'Modern Art Museum',
    emoji: '\uD83C\uDFA8',
    neighborhood: 'Alamo Heights / Olmos',
    address: '6000 N New Braunfels Ave, San Antonio TX 78209',
    lat: 29.4654,
    lng: -98.4512,
    score: 91,
    hours: 'Tue-Sun 10AM-4PM (Thu to 9PM)',
    admission: 'Adult ~$20',
    website: 'https://www.mcnayart.org',
    about: "The first modern art museum in Texas, opened 1954 in Marion Koogler McNay\u2019s 24-room 1929 Spanish Colonial Revival mansion. 24,000+ works spanning Post-Impressionism to contemporary \u2014 C\u00E9zanne, Gauguin, van Gogh, Picasso, Hopper \u2014 plus the Tobin Theatre Arts Collection.",
    highlights: [
      { icon: '\uD83C\uDFE1', label: '1929 Mansion', note: 'Spanish Colonial Revival home of the founder' },
      { icon: '\uD83C\uDFA8', label: 'Post-Impressionist Core', note: 'C\u00E9zanne, Gauguin, van Gogh \u2014 strong signature holdings' },
      { icon: '\uD83C\uDFAD', label: 'Tobin Theatre Arts', note: 'One of the most comprehensive theater-design collections' }
    ],
    tips: [
      'Sculpture gardens loop the mansion \u2014 allow extra time',
      'Free Thursdays 4\u20139 PM',
      'Quiet even on weekends \u2014 Alamo Heights is a residential neighborhood'
    ],
    bestFor: ['Art', 'Rainy Day', 'Date', 'Culture']
  },
  {
    id: 4,
    name: 'Witte Museum',
    type: 'Texas History & Nature Museum',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Midtown / Brackenridge',
    address: '3801 Broadway St, San Antonio TX 78209',
    lat: 29.4653,
    lng: -98.4661,
    score: 88,
    hours: 'Daily 10AM-5PM (Tue to 8PM)',
    admission: 'Adult ~$16',
    website: 'https://www.wittemuseum.org',
    about: "A South Texas natural history and culture museum founded 1926 \u2014 the state-leading institution on Texas paleontology, natural history, and ranching. Full dinosaur gallery with T. rex and Acrocanthosaurus casts, Texas Wild Gallery on Texas ecosystems, and the H-E-B Lantern\u2019s rotating exhibits.",
    highlights: [
      { icon: '\uD83E\uDD95', label: 'Dinosaur Gallery', note: 'T. rex + Acrocanthosaurus casts, Cretaceous Texas fossils' },
      { icon: '\uD83C\uDF35', label: 'Texas Wild Gallery', note: 'Comprehensive survey of Texas ecosystems' },
      { icon: '\uD83C\uDFAA', label: 'H-E-B Lantern', note: 'Rotating major touring exhibits' }
    ],
    tips: [
      'Free Tuesdays 3\u20138 PM',
      'Brackenridge Park\u2019s Japanese Tea Garden and Zoo are all walking distance',
      'Riverside patio overlooks the San Antonio River \u2014 best museum patio in town'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day', 'Science', 'History']
  },
  {
    id: 5,
    name: 'Briscoe Western Art Museum',
    type: 'Western Art Museum',
    emoji: '\uD83E\uDD20',
    neighborhood: 'Downtown',
    address: '210 W Market St, San Antonio TX 78205',
    lat: 29.4247,
    lng: -98.4912,
    score: 85,
    hours: 'Tue-Sun 10AM-5PM',
    admission: 'Adult ~$15 (Tue free)',
    website: 'https://www.briscoemuseum.org',
    about: "Opened 2013 in the restored 1930 Art Deco San Antonio Central Library building directly on the Riverwalk. Focused on Western art, history, and culture \u2014 strong holdings in bronzes and paintings of the American West, Texas Revolution artifacts (Santa Anna\u2019s sword, Alamo relics), and a 13-ft Remington bronze.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1930 Library Building', note: 'Art Deco landmark on the Riverwalk' },
      { icon: '\uD83D\uDDFF', label: 'Remington + Russell', note: 'Strong Frederic Remington and Charles M. Russell holdings' },
      { icon: '\uD83D\uDDE1\uFE0F', label: 'Texas Revolution Artifacts', note: 'Santa Anna\u2019s sword, Alamo relics' }
    ],
    tips: [
      'Free admission every Tuesday',
      'Walk a block to the Alamo after for a full Texas-history half-day',
      'Riverwalk entrance puts you directly at the museum door'
    ],
    bestFor: ['Art', 'History', 'Rainy Day', 'Culture']
  },
  {
    id: 6,
    name: 'Tower of the Americas',
    type: 'Observation Tower',
    emoji: '\uD83D\uDDFC',
    neighborhood: 'Downtown / Hemisfair',
    address: '739 E Cesar E Chavez Blvd, San Antonio TX 78205',
    lat: 29.4222,
    lng: -98.4803,
    score: 80,
    hours: 'Daily 10AM-10PM',
    admission: 'Adult ~$16 observation',
    website: 'https://www.toweroftheamericas.com',
    about: "A 750-ft observation tower built for the 1968 HemisFair world exposition \u2014 the defining silhouette of downtown San Antonio and the third-tallest observation tower in the U.S. when built. Observation deck, 4D Theater Ride, and the Chart House revolving restaurant at the top.",
    highlights: [
      { icon: '\uD83D\uDDFC', label: '750 ft', note: 'Third-tallest observation tower in the U.S. when built 1968' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Chart House', note: 'Revolving restaurant at the top' },
      { icon: '\uD83C\uDFAC', label: '4D Theater Ride', note: 'Motion-seat Texas-themed film experience' }
    ],
    tips: [
      'Sunset tickets sell out \u2014 book ahead',
      'Chart House reservation gets you observation access included',
      'Hemisfair playground below is a bonus family stop'
    ],
    bestFor: ['Views', 'Landmark', 'Family', 'Date']
  },
  {
    id: 7,
    name: 'Buckhorn Saloon & Texas Ranger Museum',
    type: 'Themed Saloon / Museum',
    emoji: '\uD83E\uDD18',
    neighborhood: 'Downtown',
    address: '318 E Houston St, San Antonio TX 78205',
    lat: 29.4272,
    lng: -98.4893,
    score: 78,
    hours: 'Daily 10AM-5PM',
    admission: 'Adult ~$24 (combo)',
    website: 'https://www.buckhornmuseum.com',
    about: "A Texas oddity \u2014 an 1881-founded saloon-turned-museum combined with a Texas Ranger museum, jammed with 500+ big-game heads and horns collected by founder Albert Friedrich (who accepted horns as currency for drinks). Working saloon still serves drinks; Texas Ranger wing is a separate ticket.",
    highlights: [
      { icon: '\uD83D\uDC0E', label: '500+ Mounts', note: 'Albert Friedrich\u2019s horns-as-currency collection' },
      { icon: '\u2606', label: 'Texas Ranger Museum', note: 'Combined attraction \u2014 Rangers through the centuries' },
      { icon: '\uD83C\uDF7A', label: 'Working Saloon', note: '1881 saloon still operates \u2014 a weird one-of-one' }
    ],
    tips: [
      'Buckhorn is unapologetically kitsch \u2014 set expectations',
      'Houston St location is a block from the River Walk',
      'Rangers Museum is the better of the two halves historically'
    ],
    bestFor: ['Unique', 'Kitsch', 'Family', 'Rainy Day']
  },
  {
    id: 8,
    name: 'The DoSeum',
    type: 'Children\u2019s Museum',
    emoji: '\uD83E\uDDF8',
    neighborhood: 'Alamo Heights',
    address: '2800 Broadway St, San Antonio TX 78209',
    lat: 29.4612,
    lng: -98.4678,
    score: 88,
    hours: 'Tue-Sun 9AM-5PM',
    admission: 'Adult / Child ~$17',
    website: 'https://www.thedoseum.org',
    about: "San Antonio\u2019s children\u2019s museum \u2014 a 65,000 sq ft interactive exhibit hall opened 2015 on Broadway, focused on STEAM (science, tech, engineering, arts, math). Signature exhibits: Little Town role-play city, Innovation Station maker space, and a large outdoor Big Outdoors play area.",
    highlights: [
      { icon: '\uD83D\uDC76', label: 'Little Town', note: 'Kid-scale role-play city \u2014 market, vet, H-E-B' },
      { icon: '\uD83D\uDD28', label: 'Innovation Station', note: 'Maker space with tools and build-challenges' },
      { icon: '\uD83C\uDF32', label: 'Big Outdoors', note: 'Outdoor nature-play zone' }
    ],
    tips: [
      'Best for ages 2\u201310',
      'Free third Tuesday evening each month 5\u20138 PM',
      'Paired with Witte Museum + zoo = full family day in Brackenridge corridor'
    ],
    bestFor: ['Family', 'Kids', 'Rainy Day']
  },
  {
    id: 9,
    name: 'Ruby City',
    type: 'Contemporary Art Museum',
    emoji: '\uD83D\uDC8E',
    neighborhood: 'Southtown / Lone Star',
    address: '150 Camp St, San Antonio TX 78204',
    lat: 29.4202,
    lng: -98.5010,
    score: 86,
    hours: 'Thu-Sun 10AM-5PM',
    admission: 'Free',
    website: 'https://rubycity.org',
    about: "A David Adjaye-designed crimson-red contemporary art center opened 2019. Founded on the collection of Linda Pace (co-founder of Pace Foods) \u2014 940+ contemporary works by 180 artists including Do Ho Suh, Cornelia Parker, and Joseph Havel. Free admission, small and carefully-curated.",
    highlights: [
      { icon: '\uD83C\uDFD7\uFE0F', label: 'Adjaye Building', note: 'David Adjaye crimson-red 2019 structure' },
      { icon: '\uD83C\uDFA8', label: 'Linda Pace Collection', note: '940+ contemporary works by 180 artists' },
      { icon: '\uD83C\uDFAB', label: 'Always Free', note: 'Permanent free admission' }
    ],
    tips: [
      'Small \u2014 45 minutes covers the full show',
      'Pair with Chris Park (the adjacent Pace-commissioned green space)',
      'Thursday evenings are the quietest visit window'
    ],
    bestFor: ['Art', 'Free Activity', 'Rainy Day', 'Date', 'Architecture']
  },
  {
    id: 10,
    name: 'Institute of Texan Cultures',
    type: 'Cultural Museum',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Downtown / Hemisfair',
    address: '801 E Cesar E Chavez Blvd, San Antonio TX 78205',
    lat: 29.4198,
    lng: -98.4806,
    score: 78,
    hours: 'Wed-Sun 10AM-5PM',
    admission: 'Adult ~$12',
    website: 'https://www.texancultures.com',
    about: "The state\u2019s official cultural-diversity museum, operated by the University of Texas at San Antonio since the 1968 HemisFair. Surveys the 30+ ethnic and cultural groups that built Texas \u2014 Spanish, Mexican, Native, African American, Czech, German, Chinese, Lebanese, Scots-Irish, Greek, and more.",
    highlights: [
      { icon: '\uD83C\uDF0D', label: '30+ Cultural Groups', note: 'Permanent dioramas on ethnic communities of Texas' },
      { icon: '\uD83C\uDFAA', label: 'Texas Folklife Festival', note: 'Annual on-property festival each June' }
    ],
    tips: [
      'Relocation planning underway \u2014 confirm current address at time of visit',
      'Hemisfair park and Tower of the Americas are walking distance',
      'Texas Folklife Festival (June) is the institute\u2019s biggest event'
    ],
    bestFor: ['Culture', 'History', 'Family', 'Rainy Day']
  }
];

const body = JSON.stringify(satMuseums, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san antonio": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san antonio section into MUSEUM_DATA with', satMuseums.length, 'entries.');
