// Insert 'phoenix' section into MALL_DATA in index.html.
// Idempotent: aborts if the key already exists.
const fs = require('fs');
const path = 'index.html';
const html = fs.readFileSync(path, 'utf8');

const declIdx = html.indexOf('const MALL_DATA =');
if (declIdx < 0) { console.error('MALL_DATA not found'); process.exit(1); }
const openIdx = html.indexOf('{', declIdx);
let depth = 0, closeIdx = openIdx;
for (let j = openIdx; j < html.length; j++) {
  const c = html[j];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { closeIdx = j; break; } }
}
const block = html.slice(declIdx, closeIdx + 1);
if (/"phoenix"\s*:/m.test(block)) {
  console.log('SKIP: MALL_DATA already has "phoenix"');
  process.exit(0);
}

const phxMalls = [
  {
    id: 1,
    name: 'Scottsdale Fashion Square',
    tagline: 'The Southwest\u2019s flagship luxury shopping center.',
    tier: 'Luxury Mall', emoji: '\uD83D\uDED2',
    neighborhood: 'Scottsdale',
    address: '7014 E Camelback Rd, Scottsdale AZ 85251',
    lat: 33.5026, lng: -111.9302,
    instagram: '@fashionsquare',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free garages; valet at west entry',
    score: 92,
    vibe: '2 million square feet of mall flagship, anchoring Scottsdale on Camelback \u2014 Louis Vuitton, Gucci, Dior, Neiman Marcus, plus the Luxury Wing with Herm\u00E8s, Chanel, and Saint Laurent.',
    about: "At 2 million sq ft, the largest mall in the Southwest and the flagship luxury destination of Arizona. Neiman Marcus, Nordstrom, Dillard\u2019s, and Macy\u2019s as traditional anchors; the Luxury Wing holds Herm\u00E8s, Chanel, Louis Vuitton, Gucci, Saint Laurent, Balenciaga, Dior, and Tiffany \u2014 the highest concentration of luxury tenants between LA and Dallas.",
    anchors: ['Neiman Marcus', 'Nordstrom', 'Dillard\u2019s', 'Macy\u2019s', 'Louis Vuitton', 'Herm\u00E8s'],
    mustVisit: [
      { name: 'Louis Vuitton',             note: 'Arizona flagship' },
      { name: 'Herm\u00E8s',                note: 'Inside the Luxury Wing' },
      { name: 'Apple Fashion Square',       note: 'Two-level flagship' },
      { name: 'The RH Gallery',             note: 'Full-service Restoration Hardware showroom' }
    ],
    dining: [
      { name: 'Toca Madera',     type: 'Mexican Steakhouse',  note: 'Noe Center outparcel \u2014 weekend scene' },
      { name: 'Ocean 44',        type: 'Seafood',             note: 'Mastro Restaurants flagship next door' },
      { name: 'Nobu',            type: 'Japanese',            note: 'Inside Fashion Square' }
    ],
    tips: [
      'Valet at the Caesar Chavez entrance gets you closest to the Luxury Wing',
      'Holiday season adds full-block pop-up art installations outside',
      'Happy Hour between 4\u20136 at Ocean 44 bar is the fast-and-loud cocktail option'
    ],
    bestFor: ['Luxury Shopping', 'Rainy Day', 'Date', 'Landmark'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDED2', label: '2 Million Sq Ft', note: 'Largest mall in the Southwest' },
      { icon: '\uD83D\uDC51', label: 'Luxury Wing', note: 'Herm\u00E8s, Chanel, LV, Dior, Gucci' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Neiman Marcus, Nordstrom, Dillard\u2019s, Macy\u2019s' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Dining', note: 'Nobu, Ocean 44, Toca Madera nearby' }
    ]
  },
  {
    id: 2,
    name: 'Biltmore Fashion Park',
    tagline: 'Open-air shopping plaza across from the Arizona Biltmore.',
    tier: 'Luxury Open-Air', emoji: '\uD83C\uDF3F',
    neighborhood: 'Biltmore',
    address: '2502 E Camelback Rd, Phoenix AZ 85016',
    lat: 33.5110, lng: -112.0257,
    instagram: '@biltmorefashionpark',
    hours: 'Mon-Sat 10AM-8PM, Sun 12PM-6PM',
    parking: 'Free surface lots; valet at main entry',
    score: 87,
    vibe: 'Open-air luxury plaza \u2014 quieter and more neighborhood than Fashion Square, with a garden-lined promenade and some of the Valley\u2019s best longstanding restaurants built into the perimeter.',
    about: "Built 1963 and successively updated \u2014 an open-air luxury plaza directly across Camelback from the Biltmore. Saks Fifth Avenue, Macy\u2019s, Gucci, Ralph Lauren, Apple, and Williams-Sonoma. Perimeter dining (Ocean Prime, Seasons 52, True Food, Steak 44 nearby) is some of the best mall-adjacent eating in the country.",
    anchors: ['Saks Fifth Avenue', 'Macy\u2019s', 'Gucci', 'Ralph Lauren', 'Apple'],
    mustVisit: [
      { name: 'Saks Fifth Avenue',   note: 'Arizona flagship' },
      { name: 'Gucci',               note: 'Signature store in the north arcade' },
      { name: 'Apple Biltmore',      note: 'Garden-facing flagship' },
      { name: 'Williams-Sonoma',     note: 'Full kitchen + home concept store' }
    ],
    dining: [
      { name: 'Ocean Prime',     type: 'Seafood/Steak', note: 'Cameron Mitchell perennial favorite' },
      { name: 'Seasons 52',      type: 'American',      note: 'Seasonally-driven menu' },
      { name: 'True Food Kitchen', type: 'Healthy',     note: 'The brand\u2019s original flagship \u2014 Dr. Weil concept' },
      { name: 'Steak 44',        type: 'Steakhouse',    note: 'Mastro Restaurants flagship \u2014 just across 24th St' }
    ],
    tips: [
      'Garden walk between Saks and Macy\u2019s is the quietest stroll',
      'Sunday afternoons are the calmest shopping window',
      'True Food Kitchen is the brand\u2019s original location \u2014 pilgrimage for fans'
    ],
    bestFor: ['Luxury Shopping', 'Open-Air', 'Date', 'Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF3F', label: 'Open-Air Plaza', note: 'Garden-lined promenade' },
      { icon: '\uD83D\uDC51', label: 'Anchor Luxury', note: 'Saks Fifth Avenue flagship' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Dining Ring', note: 'Ocean Prime, True Food, Steak 44' }
    ]
  },
  {
    id: 3,
    name: 'Kierland Commons',
    tagline: 'Walkable open-air main-street shopping in North Scottsdale.',
    tier: 'Open-Air Lifestyle', emoji: '\uD83D\uDEB6',
    neighborhood: 'Kierland / North Scottsdale',
    address: '15205 N Kierland Blvd, Scottsdale AZ 85254',
    lat: 33.6247, lng: -111.9282,
    instagram: '@kierlandcommons',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free street + garages',
    score: 88,
    vibe: 'Open-air \u201Cmain street\u201D lifestyle center built 2000 \u2014 crosswalked with Scottsdale Quarter, 80 stores plus fountain plazas and restaurant patios. No roof, no indoor wing.',
    about: "A 2000-built lifestyle center designed around a walkable main-street grid. ~80 retailers \u2014 Anthropologie, Apple, West Elm, lululemon, Tommy Bahama \u2014 with street-level patios for Searsucker, RA Sushi, and North Italia. Directly crosswalked with Scottsdale Quarter, forming the largest walkable retail district in the metro.",
    anchors: ['Anthropologie', 'Apple', 'West Elm', 'Crate & Barrel', 'Pottery Barn'],
    mustVisit: [
      { name: 'Apple Kierland',       note: 'Two-story North Scottsdale Apple' },
      { name: 'Anthropologie',        note: 'Full-concept home + clothing' },
      { name: 'Crate & Barrel',       note: 'Full-size flagship on the main plaza' }
    ],
    dining: [
      { name: 'North Italia',   type: 'Italian',   note: 'Fox Restaurant Concepts flagship \u2014 started here' },
      { name: 'Toby Keith\u2019s I Love This Bar', type: 'American', note: '' },
      { name: 'Eddie V\u2019s',    type: 'Seafood/Steak', note: 'Live jazz nightly' }
    ],
    tips: [
      'Walk across the crosswalk to Scottsdale Quarter for double the retail',
      'Westin Kierland Resort anchors the east side \u2014 bagpiper at sunset',
      'Greenway Pkwy parking garage is the fastest in-and-out'
    ],
    bestFor: ['Walking', 'Date', 'Open-Air', 'Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDEB6', label: 'Walkable Main Street', note: 'No indoor wing \u2014 all outdoor' },
      { icon: '\uD83C\uDFEB', label: '~80 Retailers', note: 'Apple, Anthropologie, West Elm, lululemon' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Dining Patios', note: 'North Italia started here' }
    ]
  },
  {
    id: 4,
    name: 'Scottsdale Quarter',
    tagline: 'Modern open-air luxury + lifestyle retail directly across from Kierland Commons.',
    tier: 'Open-Air Lifestyle', emoji: '\uD83D\uDED2',
    neighborhood: 'Kierland / North Scottsdale',
    address: '15257 N Scottsdale Rd, Scottsdale AZ 85254',
    lat: 33.6244, lng: -111.9252,
    instagram: '@scottsdalequarter',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free garages',
    score: 87,
    vibe: 'Modern-grid open-air center opened 2009 \u2014 walkable, patio-heavy, with a courtyard water feature and an iPic Theater as anchor. Sister to Kierland across Scottsdale Rd.',
    about: "A 2009 open-air lifestyle center opposite Kierland Commons with a more modern architectural vocabulary. Restoration Hardware\u2019s three-story Gallery, Lululemon flagship, Apple, iPic Theaters, and about 60 retailers distributed along a central quad with water features.",
    anchors: ['Restoration Hardware (3-story Gallery)', 'Apple', 'Lululemon', 'iPic Theaters'],
    mustVisit: [
      { name: 'RH Scottsdale',   note: 'Three-story Gallery with rooftop restaurant' },
      { name: 'Apple Scottsdale Quarter', note: 'Flagship location' },
      { name: 'Lululemon',        note: 'Flagship with workout studio' },
      { name: 'iPic Theaters',    note: 'Full-service luxury recliners + food' }
    ],
    dining: [
      { name: 'Dominick\u2019s Steakhouse', type: 'Steakhouse', note: 'Rooftop with skyline view' },
      { name: 'Fogo de Chao',         type: 'Brazilian',     note: 'Flagship-size location' },
      { name: 'Nobu (at RH Rooftop)',  type: 'Japanese-influenced', note: '' }
    ],
    tips: [
      'RH Rooftop Restaurant is a Scottsdale reservation must-grab',
      'Lululemon flagship hosts free Sunday yoga some months',
      'Cross to Kierland Commons for 80 more stores'
    ],
    bestFor: ['Walking', 'Luxury Shopping', 'Date', 'Dining', 'Movies'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFE1', label: 'RH Gallery', note: 'Three-story Restoration Hardware with rooftop dining' },
      { icon: '\uD83C\uDFAC', label: 'iPic Theater', note: 'Luxury-recliner cinema' },
      { icon: '\uD83C\uDF3F', label: 'Open-Air Quad', note: 'Walkable patio-heavy layout' }
    ]
  },
  {
    id: 5,
    name: 'Desert Ridge Marketplace',
    tagline: 'Northeast Valley\u2019s biggest open-air lifestyle center \u2014 shops + dining + theater.',
    tier: 'Open-Air Lifestyle', emoji: '\uD83C\uDFAC',
    neighborhood: 'North Phoenix / Desert Ridge',
    address: '21001 N Tatum Blvd, Phoenix AZ 85050',
    lat: 33.6786, lng: -111.9772,
    instagram: '@desertridgemarketplace',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free surface lots',
    score: 82,
    vibe: 'Open-air lifestyle center at Loop 101 \u2014 Amp\u2019d-up family energy, splash pad for kids, the East Valley\u2019s main Saturday-night movie-and-dinner combo.',
    about: "A 1.2 million sq ft open-air shopping and entertainment center at Loop 101 and Tatum. AMC 18-screen theater, Dave & Buster\u2019s, a central splash pad, plus anchors JCPenney, Target (outparcel), Ross, Marshalls, and a restaurant row with Kona Grill, Yard House, and Roy\u2019s.",
    anchors: ['JCPenney', 'AMC Theatres', 'Target (outparcel)', 'Dave & Buster\u2019s'],
    mustVisit: [
      { name: 'AMC Desert Ridge 18',   note: 'Big multiplex \u2014 Dolby and IMAX screens' },
      { name: 'Dave & Buster\u2019s',   note: 'Arcade + bar anchor' }
    ],
    dining: [
      { name: 'Kona Grill',        type: 'Sushi/American', note: '' },
      { name: 'Yard House',         type: 'Gastropub',      note: '160 beers on tap' },
      { name: 'Roy\u2019s',         type: 'Hawaiian Fusion', note: '' }
    ],
    tips: [
      'Splash pad runs warm months \u2014 a bonus for families',
      'Saturday-night movie + dinner is the standard East Valley use case',
      'Outparcel Target, HomeGoods, and Costco fill out the big-box needs'
    ],
    bestFor: ['Family', 'Movies', 'Casual Shopping', 'Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFAC', label: 'AMC 18-Screen', note: 'Dolby and IMAX on-site' },
      { icon: '\uD83D\uDC66', label: 'Family-Friendly', note: 'Splash pad + Dave & Buster\u2019s' }
    ]
  },
  {
    id: 6,
    name: 'Old Town Scottsdale',
    tagline: 'Historic arts district \u2014 galleries, Western shops, and Third Thursday ArtWalk.',
    tier: 'Historic District', emoji: '\uD83C\uDFA8',
    neighborhood: 'Old Town Scottsdale',
    address: '3939 N Brown Ave, Scottsdale AZ 85251',
    lat: 33.4942, lng: -111.9261,
    instagram: '@oldtownscottsdaleaz',
    hours: 'Shops daily 10AM-7PM (galleries vary)',
    parking: 'Free city garages',
    score: 88,
    vibe: 'Walkable arts-and-dining district that predates the Valley\u2019s mall culture \u2014 five distinct quarters (Fifth Avenue, Main Street Arts, Marshall Way, Stetson, Southbridge) with galleries, Western outfitters, and some of Scottsdale\u2019s oldest restaurants.',
    about: "Scottsdale\u2019s original downtown, laid out in the 1920s and re-themed with Spanish-mission facades in the 1950s. Five quarters \u2014 Main Street Arts District (gallery row), Fifth Avenue Shops (boutiques), Marshall Way Arts District (contemporary), Stetson (bars), and Southbridge (cocktail row) \u2014 anchored by Western Spirit Museum and SMoCA.",
    anchors: ['Western Spirit Museum', 'SMoCA', 'Old Adobe Mission', 'Scottsdale Civic Center'],
    mustVisit: [
      { name: 'Main Street Arts District', note: '40+ galleries \u2014 heart of Third Thursday ArtWalk' },
      { name: 'Saba\u2019s Western Store',  note: 'Since 1927 \u2014 original Scottsdale retail' },
      { name: 'The Sugar Bowl',            note: 'Since 1958 \u2014 iconic pink-wafer ice cream parlor' }
    ],
    dining: [
      { name: 'Citizen Public House', type: 'New American', note: '' },
      { name: 'The Mission',          type: 'Modern Mexican', note: '' },
      { name: 'Los Olivos',           type: 'Mexican',      note: 'Since 1946 \u2014 Barrios family institution' }
    ],
    tips: [
      'Third Thursday ArtWalk runs year-round 7\u20139 PM',
      'Park in Old Town Garage on 75th St for fastest gallery access',
      'Stetson alley gets nightlife-busy after 10 PM weekends'
    ],
    bestFor: ['Walking', 'Art', 'Historic', 'Dining', 'Gallery Hop'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFA8', label: '40+ Galleries', note: 'Main Street + Marshall Way Arts Districts' },
      { icon: '\uD83C\uDFAA', label: 'Third Thursday ArtWalk', note: 'Year-round 7\u20139 PM' },
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Museums', note: 'Western Spirit + SMoCA both in-district' }
    ]
  },
  {
    id: 7,
    name: 'Arrowhead Towne Center',
    tagline: 'The West Valley\u2019s largest enclosed mall.',
    tier: 'Enclosed Mall', emoji: '\uD83C\uDFEC',
    neighborhood: 'Glendale / West Valley',
    address: '7700 W Arrowhead Towne Center, Glendale AZ 85308',
    lat: 33.6385, lng: -112.2267,
    instagram: '@arrowheadtowne',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots',
    score: 78,
    vibe: 'The anchor enclosed mall for the entire West Valley \u2014 full-size Macy\u2019s and Dillard\u2019s, AMC multiplex, and food court scale that Scottsdale\u2019s malls don\u2019t bother with.',
    about: "A 1.1 million sq ft enclosed mall at Loop 101 and Bell Road \u2014 the West Valley\u2019s main regional center. Macy\u2019s, Dillard\u2019s, JCPenney, Dick\u2019s Sporting Goods as anchors, plus AMC 14-screen, a classic food court, and a full Apple Store.",
    anchors: ['Macy\u2019s', 'Dillard\u2019s', 'JCPenney', 'Dick\u2019s Sporting Goods', 'AMC'],
    mustVisit: [
      { name: 'Apple Arrowhead',   note: 'Only Apple Store in the West Valley' },
      { name: 'Macy\u2019s',       note: 'Full-size anchor' }
    ],
    dining: [
      { name: 'The Cheesecake Factory', type: 'American', note: 'Outparcel' },
      { name: 'Red Robin',              type: 'American', note: '' }
    ],
    tips: [
      'Arrowhead is the easiest place to \u201Cjust go to the mall\u201D in the West Valley',
      'AMC 14 tends to be quieter than the East Valley multiplexes',
      'Exit ring road to State Farm Stadium is 10 minutes for Cardinals game day'
    ],
    bestFor: ['Shopping', 'Family', 'Rainy Day'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFEC', label: '1.1 Million Sq Ft', note: 'Largest enclosed mall in the West Valley' },
      { icon: '\uD83C\uDFAC', label: 'AMC 14', note: 'On-site multiplex' }
    ]
  },
  {
    id: 8,
    name: 'Chandler Fashion Center',
    tagline: 'The East Valley\u2019s flagship enclosed mall.',
    tier: 'Enclosed Mall', emoji: '\uD83C\uDFEC',
    neighborhood: 'Chandler / East Valley',
    address: '3111 W Chandler Blvd, Chandler AZ 85226',
    lat: 33.3094, lng: -111.8857,
    instagram: '@chandlerfashion',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface lots + garages',
    score: 80,
    vibe: 'Macerich-run enclosed mall at Loop 101 and Chandler Blvd \u2014 the East Valley\u2019s go-to for Nordstrom, Dillard\u2019s, and Apple without the Scottsdale traffic.',
    about: "1.3 million sq ft enclosed mall \u2014 the flagship retail center for Chandler, Gilbert, and south Mesa. Nordstrom, Macy\u2019s, Dillard\u2019s, JCPenney, and Forever 21 as anchors, plus Apple, lululemon, and Bath & Body Works. Harkins Chandler Fashion 20 sits right on the property ring.",
    anchors: ['Nordstrom', 'Macy\u2019s', 'Dillard\u2019s', 'JCPenney', 'Harkins 20'],
    mustVisit: [
      { name: 'Nordstrom',    note: 'The East Valley flagship' },
      { name: 'Apple Chandler Fashion', note: 'Flagship-size store' },
      { name: 'lululemon',    note: '' }
    ],
    dining: [
      { name: 'Cheesecake Factory', type: 'American', note: 'Outparcel' },
      { name: 'Firebirds',           type: 'Steakhouse', note: '' }
    ],
    tips: [
      'Harkins Chandler Fashion 20 is the locals\u2019 multiplex \u2014 loaded Lobby',
      'Outparcel restaurants (Firebirds, Yard House) book fast Friday nights',
      'Loop 101/Chandler Blvd exit is quick in/out from downtown Phoenix'
    ],
    bestFor: ['Shopping', 'Family', 'Rainy Day', 'Movies'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFEC', label: 'Macerich Flagship', note: 'East Valley\u2019s main regional mall' },
      { icon: '\uD83C\uDFAC', label: 'Harkins 20', note: 'Major on-property multiplex' }
    ]
  },
  {
    id: 9,
    name: 'Tempe Marketplace',
    tagline: 'Open-air power-center shopping at Loop 101/202.',
    tier: 'Open-Air Power Center', emoji: '\uD83D\uDED2',
    neighborhood: 'Tempe',
    address: '2000 E Rio Salado Pkwy, Tempe AZ 85281',
    lat: 33.4307, lng: -111.9031,
    instagram: '@tempemarketplace',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free surface lots',
    score: 80,
    vibe: 'Huge open-air power center at the 101/202 junction \u2014 ASU student base, splash pad, live music at the District stage, and the East Valley\u2019s biggest concentration of chain retail.',
    about: "A 1.3 million sq ft open-air power center along the Loop 101, opened 2007 on a reclaimed landfill site. 130+ stores and restaurants across a main-street spine and The District entertainment stage. Anchors: Super Target, Harkins 16, JCPenney, Best Buy, and fitness studios.",
    anchors: ['Super Target', 'Harkins 16', 'JCPenney', 'Best Buy'],
    mustVisit: [
      { name: 'Harkins Tempe Marketplace 16', note: 'Main multiplex on the east side' },
      { name: 'Super Target',   note: 'Grocery + general merch one-stop' },
      { name: 'Ulta Beauty',    note: '' }
    ],
    dining: [
      { name: 'Firebirds',   type: 'Steakhouse', note: '' },
      { name: 'BJ\u2019s Restaurant & Brewhouse', type: 'American', note: '' },
      { name: 'In-N-Out',    type: 'Burgers',    note: 'Outparcel' }
    ],
    tips: [
      'The District stage hosts free weekend concerts most of the year',
      'Splash pad runs warm months \u2014 family-friendly default',
      'ASU light-rail stop at Rio Salado a few blocks west'
    ],
    bestFor: ['Shopping', 'Family', 'Movies', 'Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDED2', label: '130+ Stores', note: 'Main-street open-air layout' },
      { icon: '\uD83C\uDFA4', label: 'The District', note: 'Outdoor concert + event stage' }
    ]
  },
  {
    id: 10,
    name: 'SanTan Village',
    tagline: 'Gilbert\u2019s open-air lifestyle center \u2014 anchors + main-street dining.',
    tier: 'Open-Air Lifestyle', emoji: '\uD83C\uDF3F',
    neighborhood: 'Gilbert / Southeast Valley',
    address: '2218 E Williams Field Rd, Gilbert AZ 85295',
    lat: 33.3069, lng: -111.7424,
    instagram: '@santanvillage',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    parking: 'Free surface lots',
    score: 82,
    vibe: 'Open-air grid lifestyle center in Gilbert \u2014 main-street layout with Dillard\u2019s and Macy\u2019s anchors and a central fountain quad, the anchor retail of the fast-growing Southeast Valley.',
    about: "An open-air lifestyle center opened 2007 in the fast-growing town of Gilbert \u2014 the dominant regional retail for the Southeast Valley (Gilbert, Queen Creek, south Mesa). Dillard\u2019s, Macy\u2019s, and JCPenney as anchors, roughly 100 retailers, and an outdoor entertainment plaza with seasonal events.",
    anchors: ['Dillard\u2019s', 'Macy\u2019s', 'JCPenney', 'Dick\u2019s Sporting Goods'],
    mustVisit: [
      { name: 'Barnes & Noble',  note: 'Flagship-size bookstore' },
      { name: 'Dillard\u2019s',  note: 'Anchor \u2014 SanTan flagship' }
    ],
    dining: [
      { name: 'The Keg Steakhouse', type: 'Steakhouse', note: '' },
      { name: 'Kona Grill',          type: 'Sushi/American', note: '' },
      { name: 'Paradise Bakery',     type: 'Cafe',     note: '' }
    ],
    tips: [
      'Summer Friday-night concerts on the plaza most years',
      'Pair a visit with the Riparian Preserve at Water Ranch 15 min south',
      'Outparcel In-N-Out can have a 30-minute drive-thru on weekends'
    ],
    bestFor: ['Shopping', 'Family', 'Open-Air', 'Dining'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF3F', label: 'Open-Air Grid', note: 'Main-street walkable layout' },
      { icon: '\uD83C\uDFEC', label: '100+ Retailers', note: 'Gilbert / Southeast Valley anchor' }
    ]
  }
];

const body = JSON.stringify(phxMalls, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "phoenix": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted phoenix section into MALL_DATA with', phxMalls.length, 'entries.');
