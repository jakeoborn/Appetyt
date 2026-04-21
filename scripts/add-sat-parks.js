// Insert 'san antonio' section into PARK_DATA in index.html.
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
if (/"san antonio"\s*:/m.test(block)) {
  console.log('SKIP: PARK_DATA already has "san antonio"');
  process.exit(0);
}

const satParks = [
  {
    id: 1,
    name: 'San Antonio River Walk',
    type: 'Urban River Park',
    emoji: '\uD83D\uDEA3',
    neighborhood: 'Downtown',
    address: '849 E Commerce St, San Antonio TX 78205',
    lat: 29.4246,
    lng: -98.4947,
    score: 96,
    hours: 'Daily 24 hours',
    admission: 'Free',
    website: 'https://www.thesanantonioriverwalk.com',
    about: "A 15-mile pedestrian network along the San Antonio River, one level below the downtown street grid and the #1 visitor attraction in Texas. The 1.5-mile downtown Horseshoe is lined with restaurants, hotels, and cypress trees; the Mission Reach south adds a bike and paddle path down to Mission Espada.",
    highlights: [
      { icon: '\uD83D\uDEA3', label: 'Downtown Horseshoe', note: 'The 1.5-mile loop lined with cafes and hotels' },
      { icon: '\uD83D\uDEE4\uFE0F', label: 'Mission Reach', note: '8-mile walk/bike south to the UNESCO missions' },
      { icon: '\uD83D\uDEA2', label: 'Rio San Antonio Cruises', note: 'Narrated 35-minute barge rides' },
      { icon: '\uD83C\uDF84', label: 'Holiday Lights', note: 'Nov\u2013Jan river is hung with lights \u2014 the city\u2019s biggest event' }
    ],
    tips: [
      'Start at the Commerce Bridge for the classic cypress-and-flagstone downtown stretch',
      'Rent a bike at the Pearl and ride the Mission Reach to Mission Espada',
      'Restaurants directly on the water charge a premium \u2014 step up one level for better value'
    ],
    bestFor: ['Landmark', 'Walking', 'Family', 'Date', 'Free Activity']
  },
  {
    id: 2,
    name: 'Brackenridge Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDFDE\uFE0F',
    neighborhood: 'Midtown',
    address: '3700 N St Mary\u2019s St, San Antonio TX 78212',
    lat: 29.4700,
    lng: -98.4666,
    score: 90,
    hours: 'Daily 5AM-11PM',
    admission: 'Free (attractions ticketed)',
    website: 'https://www.sanantonio.gov/ParksAndRec/Parks-Facilities/All-Parks-Facilities/Parks-Facilities-Details/ArtMID/14820/ArticleID/2548/Brackenridge-Park',
    about: "A 343-acre landmark park straddling the San Antonio River, established 1899 on land donated by George Brackenridge. Houses the San Antonio Zoo, the Japanese Tea Garden, Brackenridge Eagle miniature railway, the Witte Museum, and the Sunken Garden Theater \u2014 the city\u2019s original urban park.",
    highlights: [
      { icon: '\uD83E\uDD81', label: 'San Antonio Zoo', note: 'Inside the park \u2014 ticketed separately' },
      { icon: '\uD83C\uDF38', label: 'Japanese Tea Garden', note: 'Free to enter \u2014 a separate listing' },
      { icon: '\uD83D\uDE82', label: 'Brackenridge Eagle', note: 'Miniature railway loops the park' },
      { icon: '\uD83C\uDFAD', label: 'Sunken Garden Theater', note: 'Outdoor amphitheater in a former rock quarry' }
    ],
    tips: [
      'Japanese Tea Garden is free admission within Brackenridge',
      'Miniature railway runs on a 20-minute loop \u2014 family favorite',
      'Sunday morning Zoo entry is the quietest slot'
    ],
    bestFor: ['Family', 'Free Activity', 'Picnic', 'Kids', 'Historic']
  },
  {
    id: 3,
    name: 'Japanese Tea Garden',
    type: 'Tea Garden',
    emoji: '\uD83C\uDF38',
    neighborhood: 'Midtown / Brackenridge',
    address: '3853 N St Mary\u2019s St, San Antonio TX 78212',
    lat: 29.4685,
    lng: -98.4740,
    score: 91,
    hours: 'Daily sunrise-sunset',
    admission: 'Free',
    website: 'https://www.sanantonio.gov/ParksAndRec/Parks-Facilities/All-Parks-Facilities/Parks-Facilities-Details/ArtMID/14820/ArticleID/3036/Japanese-Tea-Garden',
    about: "A tea garden built 1917\u20131918 inside an abandoned cement quarry \u2014 Japanese immigrant artist Kimi Eizo Jingu and his family ran the Bamboo Room tearoom on site. Waterfalls, koi ponds, a 60-ft torii gate, and the original stonework sunken in the quarry floor make this one of the prettiest free stops in the city.",
    highlights: [
      { icon: '\u26E9\uFE0F', label: 'Historic Torii', note: '60-ft original wooden torii gate at the entry' },
      { icon: '\uD83E\uDDA4', label: 'Koi Ponds', note: 'Ponds and waterfalls in the former quarry pit' },
      { icon: '\u2615', label: 'Jingu House', note: 'Original 1918 tearoom still operating' }
    ],
    tips: [
      'Visit on a weekday morning for the quiet photography',
      'Waterfall view from the viewing pagoda is the shot',
      'Jingu House tea service runs brunch + afternoon'
    ],
    bestFor: ['Photography', 'Free Activity', 'Date', 'Family', 'Historic']
  },
  {
    id: 4,
    name: 'Hemisfair Park',
    type: 'Urban Park',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Downtown',
    address: '434 S Alamo St, San Antonio TX 78205',
    lat: 29.4232,
    lng: -98.4860,
    score: 84,
    hours: 'Daily 5AM-11PM',
    admission: 'Free',
    website: 'https://hemisfair.org',
    about: "Built for the 1968 HemisFair world exposition, now being redeveloped into a downtown green-space district. Holds the Tower of the Americas (600-ft observation tower, the fair\u2019s legacy landmark), Magik Theatre, the Institute of Texan Cultures, and the Yanaguana splash playground \u2014 arguably the best free downtown attraction for kids.",
    highlights: [
      { icon: '\uD83D\uDDFC', label: 'Tower of the Americas', note: '600-ft observation tower + revolving restaurant' },
      { icon: '\uD83D\uDEB0', label: 'Yanaguana Garden', note: 'Splash-pad and playground \u2014 free, shaded' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Institute of Texan Cultures', note: 'Texas ethnography museum on the park\u2019s east side' }
    ],
    tips: [
      'Yanaguana Garden is the best downtown playground \u2014 free all day',
      'Tower of the Americas observation deck is a separate ticket',
      'Park connects directly to the La Villita historic district and the Riverwalk'
    ],
    bestFor: ['Family', 'Free Activity', 'Kids', 'Views']
  },
  {
    id: 5,
    name: 'San Antonio Missions National Historical Park',
    type: 'National Historical Park',
    emoji: '\u26EA',
    neighborhood: 'South Side',
    address: '6701 San Jose Dr, San Antonio TX 78214',
    lat: 29.3599,
    lng: -98.4793,
    score: 95,
    hours: 'Daily 9AM-5PM (missions)',
    admission: 'Free',
    website: 'https://www.nps.gov/saan',
    about: "A UNESCO World Heritage Site (2015) linking four 18th-century Spanish mission churches \u2014 Concepci\u00F3n, San Jos\u00E9, San Juan, Espada \u2014 along an 8-mile stretch of the San Antonio River south of downtown. San Jos\u00E9 is the \u201CQueen of the Missions\u201D, the largest and most restored. The Alamo is the fifth mission, managed separately.",
    highlights: [
      { icon: '\uD83C\uDF0D', label: 'UNESCO World Heritage', note: 'Inscribed 2015 alongside the Alamo' },
      { icon: '\u26EA', label: 'Mission San Jos\u00E9', note: '\u201CQueen of the Missions\u201D \u2014 most complete' },
      { icon: '\uD83D\uDEB2', label: 'Mission Reach Trail', note: '8-mi paved bike path links all four' }
    ],
    tips: [
      'Rent a bike downtown and ride the Mission Reach path south to Espada',
      'Mariachi Mass at San Jos\u00E9 Sunday mornings is a city signature',
      'NPS Visitor Center at San Jos\u00E9 is the best orientation stop'
    ],
    bestFor: ['Historic', 'Free Activity', 'Family', 'Landmark', 'Cycling']
  },
  {
    id: 6,
    name: 'Phil Hardberger Park',
    type: 'Urban Nature Park',
    emoji: '\uD83C\uDF33',
    neighborhood: 'North Central',
    address: '8400 NW Military Hwy, San Antonio TX 78231',
    lat: 29.5515,
    lng: -98.5317,
    score: 85,
    hours: 'Daily 5AM-11PM',
    admission: 'Free',
    website: 'https://philhardbergerpark.org',
    about: "A 330-acre wooded nature park bisected by the Robert L. B. Tobin Land Bridge \u2014 a 150-ft wildlife-and-pedestrian land bridge opened 2020 that reconnected the two halves of the park. Oak savanna, 7 miles of trails, two dog parks, a prairie-restoration project, and nature-education facilities.",
    highlights: [
      { icon: '\uD83C\uDF09', label: 'Tobin Land Bridge', note: '150-ft wildlife land bridge \u2014 first of its kind in the U.S.' },
      { icon: '\uD83D\uDC15', label: 'Two Dog Parks', note: 'East and West park dog areas, fenced' },
      { icon: '\uD83D\uDEB6', label: '7 Miles of Trails', note: 'Natural-surface oak-savanna trails' }
    ],
    tips: [
      'Cross the Land Bridge at dawn for wildlife spotting',
      'East side entrance via NW Military has the Urban Ecology Center',
      'Weekend mornings are busy but trails absorb it'
    ],
    bestFor: ['Nature', 'Dog Walking', 'Family', 'Running', 'Free Activity']
  },
  {
    id: 7,
    name: 'Government Canyon State Natural Area',
    type: 'State Natural Area',
    emoji: '\uD83E\uDEA8',
    neighborhood: 'Northwest / Helotes',
    address: '12861 Galm Rd, San Antonio TX 78254',
    lat: 29.5492,
    lng: -98.7627,
    score: 87,
    hours: 'Fri-Sun sunrise-10PM (open days vary)',
    admission: '$6 adult',
    website: 'https://tpwd.texas.gov/state-parks/government-canyon',
    about: "An 8,600-acre state natural area on the Edwards Aquifer recharge zone \u2014 the city\u2019s drinking-water source. 40 miles of hiking and biking trails, 110-million-year-old dinosaur tracksite (visible on dry days), and some of the best semi-wild canyon hiking in the metro. Open Friday through Sunday only.",
    highlights: [
      { icon: '\uD83E\uDD95', label: 'Dinosaur Tracks', note: 'Exposed 110-million-year-old theropod and sauropod tracks' },
      { icon: '\uD83D\uDEB6', label: '40 Miles of Trails', note: 'Hiking + mountain biking through juniper-oak canyon' },
      { icon: '\uD83D\uDCA7', label: 'Edwards Aquifer Zone', note: 'Protected recharge zone \u2014 no swimming or dogs on some trails' }
    ],
    tips: [
      'Only open Fri\u2013Sun \u2014 check TPWD before driving',
      'Dinosaur tracks are visible only when the creek is dry',
      'Wildlife Loop is the easiest family hike'
    ],
    bestFor: ['Hiking', 'Nature', 'Mountain Biking', 'Family', 'Paleontology']
  },
  {
    id: 8,
    name: 'Friedrich Wilderness Park',
    type: 'Nature Preserve',
    emoji: '\u26F0\uFE0F',
    neighborhood: 'Far North / La Cantera',
    address: '21395 Milsa Dr, San Antonio TX 78256',
    lat: 29.6573,
    lng: -98.6268,
    score: 84,
    hours: 'Daily 7:30AM-7PM (seasonal)',
    admission: 'Free',
    website: 'https://www.sanantonio.gov/ParksAndRec/Parks-Facilities/All-Parks-Facilities/Parks-Facilities-Details/ArtMID/14820/ArticleID/2563/Friedrich-Wilderness-Park',
    about: "A 633-acre rugged hill-country preserve \u2014 the closest real Hill Country hiking inside the city limits. 10+ miles of natural-surface trails through live-oak and Ashe-juniper canyon, habitat for the endangered golden-cheeked warbler, and the Main Loop\u2019s panoramic city overlook.",
    highlights: [
      { icon: '\u26F0\uFE0F', label: 'Main Loop', note: '2.7 mi overlook loop \u2014 best city panorama in SA' },
      { icon: '\uD83D\uDC26', label: 'Golden-Cheeked Warbler', note: 'Endangered species habitat' },
      { icon: '\uD83C\uDF31', label: 'Hill Country Flora', note: 'Live oak + Ashe juniper canyon ecosystem' }
    ],
    tips: [
      'Close to La Cantera shopping \u2014 pair a morning hike with lunch',
      'Water Trail is the ADA-accessible option',
      'Mornings only in summer \u2014 little shade on exposed ridges'
    ],
    bestFor: ['Hiking', 'Nature', 'Birding', 'Free Activity', 'Views']
  },
  {
    id: 9,
    name: 'San Pedro Springs Park',
    type: 'Historic Urban Park',
    emoji: '\uD83C\uDFDB\uFE0F',
    neighborhood: 'Monte Vista',
    address: '2200 N Flores St, San Antonio TX 78212',
    lat: 29.4506,
    lng: -98.5014,
    score: 80,
    hours: 'Daily 5AM-11PM',
    admission: 'Free',
    website: 'https://www.sanantonio.gov/ParksAndRec/Parks-Facilities/All-Parks-Facilities/Parks-Facilities-Details/ArtMID/14820/ArticleID/2601/San-Pedro-Springs-Park',
    about: "Established 1729 \u2014 the second-oldest public park in the United States (only Boston Common is older). 46 acres around the San Pedro Springs, with a historic spring-fed swimming pool, century-old oaks, a library branch, and the old San Pedro Playhouse building anchoring the south end.",
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: '1729 Park', note: 'Second-oldest public park in the U.S.' },
      { icon: '\uD83C\uDFCA', label: 'Spring-Fed Pool', note: 'Historic natural-spring swimming pool \u2014 summer only' },
      { icon: '\uD83D\uDCDA', label: 'Library Branch', note: 'San Pedro Branch Library on-property' }
    ],
    tips: [
      'Pool season is Memorial Day\u2013Labor Day',
      'Sunday afternoons are family-picnic loaded',
      'Walk up N Flores to the historic Monte Vista district after'
    ],
    bestFor: ['Historic', 'Free Activity', 'Family', 'Swimming']
  },
  {
    id: 10,
    name: 'Natural Bridge Caverns',
    type: 'Commercial Cave / Adventure Park',
    emoji: '\uD83E\uDEA8',
    neighborhood: 'North Metro / Garden Ridge',
    address: '26495 Natural Bridge Caverns Rd, San Antonio TX 78266',
    lat: 29.6930,
    lng: -98.3436,
    score: 88,
    hours: 'Daily 9AM-4PM (tour schedule)',
    admission: 'Adult ~$30 per cave tour',
    website: 'https://naturalbridgecaverns.com',
    about: "The largest commercial cave system in Texas, discovered 1960 by four college students from St. Mary\u2019s University. Discovery Tour is the classic 75-minute walk through the most decorated chambers; Hidden Passages Tour hits the wilder back system. Above ground: ziplines, a ropes course, and a panning sluice for kids.",
    highlights: [
      { icon: '\uD83E\uDEA8', label: 'Discovery Tour', note: '75-minute walk through signature decorated chambers' },
      { icon: '\uD83E\uDEA2', label: 'Hidden Passages Tour', note: 'The wilder back-system tour \u2014 less-visited chambers' },
      { icon: '\uD83E\uDDD7', label: 'Ropes + Ziplines', note: 'Above-ground adventure-park add-ons' }
    ],
    tips: [
      'Cave is a constant 70\u00B0F year-round \u2014 welcome relief July\u2013August',
      'Book tours in advance \u2014 summer weekends sell out',
      'Pair with Natural Bridge Wildlife Ranch (drive-thru safari) next door'
    ],
    bestFor: ['Family', 'Adventure', 'Rainy Day', 'Day Trip']
  }
];

const body = JSON.stringify(satParks, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san antonio": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san antonio section into PARK_DATA with', satParks.length, 'entries.');
