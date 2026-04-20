// Insert 'san diego' section into MALL_DATA in index.html.
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
if (/"san diego"\s*:/m.test(block)) {
  console.log('SKIP: MALL_DATA already has "san diego"');
  process.exit(0);
}

const sdMalls = [
  {
    id: 1,
    name: 'Liberty Public Market',
    tagline: 'Barracks-turned-food-hall at Liberty Station \u2014 30+ vendors under one roof.',
    tier: 'Market', emoji: '\uD83C\uDFEA',
    neighborhood: 'Point Loma / Liberty Station',
    address: '2820 Historic Decatur Rd, San Diego CA 92106',
    lat: 32.7398, lng: -117.2118,
    instagram: '@libertypublicmarket',
    hours: 'Daily 7AM-9PM',
    parking: 'Free surface lot at Liberty Station',
    score: 93,
    vibe: 'A 1920s Naval commissary converted in 2016 into SD\u2019s best food hall \u2014 vendor-driven, family-friendly, and the anchor of the Liberty Station rebuild.',
    about: "Opened 2016 inside the restored commissary of the former Naval Training Center. 30+ independent vendors \u2014 Cecilia\u2019s Taqueria, Mess Hall Kitchen, Fully Loaded (juice + bowls), Pop Pie Co., Wicked Maine Lobster. Outdoor beer garden, live music most weekends, and a park and waterfront across the courtyard.",
    anchors: ['Cecilia\u2019s Taqueria', 'Mess Hall', 'Pop Pie Co.', 'Wicked Maine Lobster', 'Mastiff Sausage Company'],
    mustVisit: [
      { name: 'Cecilia\u2019s Taqueria',       note: 'Family-run Mexican \u2014 the food-hall anchor' },
      { name: 'Pop Pie Co.',                  note: 'Savory pies from the brother-team behind The Crack Shack' },
      { name: 'Wicked Maine Lobster',         note: 'New England rolls in SoCal' },
      { name: 'Mastiff Sausage Company',      note: 'Scratch-made sausages and beer pairings' }
    ],
    dining: [
      { name: 'The Patio Marketplace',  type: 'Cocktail Bar',  note: 'Craft cocktails in the covered patio' },
      { name: 'Mess Hall',              type: 'American',      note: 'Full-service anchor with an airy dining room' },
      { name: 'West Pac Noodle Bar',    type: 'Ramen',         note: 'Pho, ramen, and bao \u2014 consistent fan favorite' }
    ],
    tips: [
      'Park at the north lot for the closest walk to the commissary door',
      'Saturday morning farmers market sets up in the outdoor courtyard',
      'Walk over to the Arts District (28 studios in the historic barracks)'
    ],
    bestFor: ['Food Hall', 'Family', 'Casual Lunch', 'Date', 'Free Activity'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Market',  note: '30+ independent vendors under one 1920s roof' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Cecilia\u2019s, Pop Pie, Mastiff, Mess Hall' },
      { icon: '\uD83C\uDF7A', label: 'Beer Garden', note: 'Outdoor courtyard with live music most weekends' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface lot at Liberty Station' }
    ]
  },
  {
    id: 2,
    name: 'Little Italy Mercato',
    tagline: 'Saturday farmers market along Date Street \u2014 200+ vendors.',
    tier: 'Farmers Market', emoji: '\uD83C\uDF4A',
    neighborhood: 'Little Italy',
    address: 'W Date St & Kettner Blvd, San Diego CA 92101',
    lat: 32.7240, lng: -117.1686,
    instagram: '@littleitalymercato',
    hours: 'Sat 8AM-2PM, Wed 9:30AM-1:30PM',
    parking: 'Street + public garages on Kettner/India',
    score: 92,
    vibe: 'The biggest certified farmers market in San Diego \u2014 six full blocks of growers, bakers, butchers, flowers, and hot food along Date Street every Saturday morning.',
    about: "Saturdays on Date Street shut down for six blocks of the largest certified farmers market in SD. 200+ vendors \u2014 produce, flowers, breads, cheeses, olive oil, butchers, hot food stalls \u2014 and weekday bagel, pastry, and coffee grabs from the Little Italy Food Hall two blocks away on Wednesday mornings.",
    anchors: ['Little Italy Food Hall', 'Bread & Cie', 'Sadie Rose Baking Co.', 'Suzies Farm'],
    mustVisit: [
      { name: 'Sadie Rose Baking',      note: 'Artisan sourdoughs \u2014 country loaves and baguettes' },
      { name: 'Suzies Farm',            note: 'Imperial Beach organic farm \u2014 produce anchor' },
      { name: 'Bread & Cie',            note: 'San Diego bakery classic \u2014 rye, olive breads' }
    ],
    dining: [
      { name: 'Little Italy Food Hall', type: 'Food Hall',     note: '6 vendors \u2014 open daily, two blocks away' },
      { name: 'Pappalecco',             type: 'Italian Caf\u00E9', note: 'Gelato, panini, breakfast cornetti \u2014 walk-over' },
      { name: 'Filippi\u2019s Pizza Grotto', type: 'Italian',   note: 'Since 1950 \u2014 classic deli + red-sauce house' }
    ],
    tips: [
      'Arrive by 9 AM \u2014 best produce, shortest lines',
      'Bring a cooler if you drive in from North or East County \u2014 sun warms up quickly',
      'Piazza della Famiglia (two blocks south) has weekend events after the market'
    ],
    bestFor: ['Farmers Market', 'Saturday Morning', 'Produce', 'Family', 'Walkable'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDF45', label: 'Market',  note: '200+ vendors across six Date St blocks' },
      { icon: '\uD83C\uDF5E', label: 'Anchors', note: 'Sadie Rose, Suzies Farm, Bread & Cie' },
      { icon: '\uD83D\uDD52', label: 'Wed Mini', note: 'Wednesday morning abbreviated market' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Street + Kettner/India public garages' }
    ]
  },
  {
    id: 3,
    name: 'Seaport Village',
    tagline: 'Waterfront retail village on the Embarcadero since 1980.',
    tier: 'Waterfront Village', emoji: '\u2693',
    neighborhood: 'Downtown / Embarcadero',
    address: '849 W Harbor Dr, San Diego CA 92101',
    lat: 32.7103, lng: -117.1718,
    instagram: '@seaportvillage',
    hours: 'Daily 10AM-9PM (shop hours vary)',
    parking: 'Seaport Village garages \u2014 validation varies',
    score: 82,
    vibe: 'A 14-acre waterfront village of 50+ shops and restaurants sitting right on the San Diego Bay boardwalk \u2014 tourist-forward but genuinely scenic and walkable.',
    about: "Opened 1980 on 14 acres of Embarcadero waterfront. 50+ specialty shops and restaurants in New England-style buildings, an operating 1895 Looff Carousel imported from Coney Island, and a continuous bayfront boardwalk connecting to Manchester Grand Hyatt and the Broadway Pier. Slated for a phased redevelopment; still open in current form.",
    anchors: ['Upstart Crow Bookstore', 'The Fudge Factory', 'Looff Carousel', 'San Pasqual Winery'],
    mustVisit: [
      { name: 'Upstart Crow Bookstore', note: 'Indie bookstore-cafe since 1979' },
      { name: 'Looff Carousel (1895)',  note: 'Original Coney Island carousel, hand-carved horses' },
      { name: 'Edgewater Grill',        note: 'Bayfront patio \u2014 mid-walk lunch stop' }
    ],
    dining: [
      { name: 'Edgewater Grill',  type: 'American',      note: 'Bayfront patio seating' },
      { name: 'The Fish Market',  type: 'Seafood',       note: 'Classic SD seafood institution' },
      { name: 'Puesto (nearby)',  type: 'Mexican',       note: 'Short walk north \u2014 mezcal and tacos' }
    ],
    tips: [
      'Walk the boardwalk north to USS Midway and Maritime Museum \u2014 15 minutes',
      'Feed the ducks at the West Pond (kids love it)',
      'Parking validates at some shops; confirm before you commit to a garage'
    ],
    bestFor: ['Tourists', 'Family', 'Waterfront', 'Casual Lunch'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDEA2', label: 'Waterfront', note: '14 acres on the SD Bay boardwalk' },
      { icon: '\uD83C\uDFA0', label: '1895 Looff Carousel', note: 'Original from Coney Island' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Upstart Crow, Edgewater Grill, Fish Market' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Seaport garages \u2014 validation varies' }
    ]
  },
  {
    id: 4,
    name: 'Fashion Valley Mall',
    tagline: 'SD\u2019s flagship upscale mall \u2014 Neiman Marcus + Nordstrom + Bloomingdale\u2019s.',
    tier: 'Upscale Mall', emoji: '\uD83D\uDECD\uFE0F',
    neighborhood: 'Mission Valley',
    address: '7007 Friars Rd, San Diego CA 92108',
    lat: 32.7684, lng: -117.1694,
    instagram: '@fashionvalley',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface + garage',
    score: 91,
    vibe: 'Open-air upscale mall with an anchor wall no other SD center can match \u2014 Neiman\u2019s, Nordstrom, Bloomingdale\u2019s, Macy\u2019s, plus the Apple flagship for the region.',
    about: "A 1,718,000 sq ft open-air center opened 1969 and steadily upgraded. Neiman Marcus, Nordstrom, Bloomingdale\u2019s, Macy\u2019s, Apple flagship, Hermes, Gucci, Prada, Louis Vuitton. Cheesecake Factory, True Food Kitchen, and Bazille (Nordstrom in-store). AMC 18 theater with dine-in on-property.",
    anchors: ['Neiman Marcus', 'Nordstrom', 'Bloomingdale\u2019s', 'Macy\u2019s', 'Apple', 'AMC 18'],
    mustVisit: [
      { name: 'Apple Fashion Valley',  note: 'San Diego flagship Apple Store' },
      { name: 'Neiman Marcus',         note: 'Only Neiman\u2019s in San Diego' },
      { name: 'Tesla',                 note: 'Full showroom + service' }
    ],
    dining: [
      { name: 'True Food Kitchen',     type: 'Californian',     note: 'Healthy-leaning Californian plates' },
      { name: 'The Cheesecake Factory', type: 'American',       note: 'Lot-level entrance \u2014 full wait on weekends' },
      { name: 'Bazille (inside Nordstrom)', type: 'American Bistro', note: 'Quiet lunch inside Nordstrom' }
    ],
    tips: [
      'Park in the Neiman Marcus garage \u2014 emptiest on weekends',
      'Trolley Green Line stops at Fashion Valley station \u2014 skip the freeway',
      'AMC 18 dine-in is the date-night play after dinner'
    ],
    bestFor: ['Luxury Shopping', 'Weekend Outing', 'Tech', 'Family'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Mall', note: '1.7M sq ft open-air' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Neiman\u2019s, Nordstrom, Bloomingdale\u2019s, Macy\u2019s' },
      { icon: '\uD83D\uDCF1', label: 'Apple Flagship', note: 'Regional SD flagship' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface + garage' }
    ]
  },
  {
    id: 5,
    name: 'Westfield UTC',
    tagline: 'Open-air La Jolla mall with ice rink + trolley station.',
    tier: 'Upscale Mall', emoji: '\uD83D\uDECD\uFE0F',
    neighborhood: 'La Jolla / UTC',
    address: '4545 La Jolla Village Dr, San Diego CA 92122',
    lat: 32.8712, lng: -117.2225,
    instagram: '@westfielducsd',
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    parking: 'Free surface + garages',
    score: 90,
    vibe: 'North SD\u2019s flagship shopping destination \u2014 open-air, recently expanded, with Nordstrom, Macy\u2019s, an ice rink, and the Blue Line trolley at the front door.',
    about: "1.3M sq ft open-air center in La Jolla, fully redeveloped 2017 with a $1B expansion. Nordstrom, Macy\u2019s, Apple, Microsoft, Tesla, Arhaus, Ice Town rink, and a wide central dining plaza. Blue Line trolley UTC Station at the property edge (SDSU / Downtown direct).",
    anchors: ['Nordstrom', 'Macy\u2019s', 'Apple', 'Microsoft', 'Tesla', 'Ice Town'],
    mustVisit: [
      { name: 'Ice Town',              note: 'Outdoor-feel ice rink open daily, seasonal pricing' },
      { name: 'Apple UTC',             note: 'Redesigned 2017 flagship' },
      { name: 'Industrious UTC',       note: 'Coworking tucked into the mall \u2014 day passes work' }
    ],
    dining: [
      { name: 'Shake Shack',           type: 'Burgers',         note: 'Central plaza outdoor seating' },
      { name: 'True Food Kitchen',     type: 'Californian',     note: 'Andrew Weil\u2019s healthy chain' },
      { name: 'Eddie V\u2019s Prime Seafood', type: 'Steak & Seafood', note: 'Business-dinner anchor' }
    ],
    tips: [
      'Blue Line trolley from downtown to UTC Station \u2014 free parking at Santee P&R',
      'Weekend mornings are the quietest hour at Ice Town',
      'Seasonal Snow Town in winter \u2014 family winter-fair alternative to the coast'
    ],
    bestFor: ['Shopping', 'Family', 'Weekend', 'Ice Skating'],
    awards: '',
    highlights: [
      { icon: '\uD83D\uDECD\uFE0F', label: 'Mall', note: '1.3M sq ft, fully redeveloped 2017' },
      { icon: '\u26F8\uFE0F', label: 'Ice Town', note: 'Outdoor-feel ice rink on-property' },
      { icon: '\uD83D\uDE88', label: 'Blue Line Trolley', note: 'UTC Station at the property edge' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface + garages' }
    ]
  },
  {
    id: 6,
    name: 'Del Mar Highlands Town Center',
    tagline: 'North County open-air lifestyle center \u2014 community hub for Carmel Valley.',
    tier: 'Lifestyle Center', emoji: '\uD83C\uDFDD\uFE0F',
    neighborhood: 'Carmel Valley',
    address: '12925 El Camino Real, San Diego CA 92130',
    lat: 32.9505, lng: -117.2296,
    instagram: '@delmarhighlands',
    hours: 'Daily 10AM-9PM (dining later)',
    parking: 'Free surface + garage',
    score: 85,
    vibe: 'Open-air lifestyle center with a tree-lined piazza, Cinepolis luxury cinema, and a rotating farmers market \u2014 Carmel Valley\u2019s de-facto downtown.',
    about: "Recently redeveloped open-air center in Carmel Valley, 40+ shops and restaurants around a pedestrian piazza. Cinepolis Luxury Cinemas, SENDAI (Japanese BBQ), Jeune et Jolie is two miles away in Carlsbad but the Del Mar locals start here. Thursday farmers market in the central plaza.",
    anchors: ['Cinepolis Luxury Cinemas', 'Jimbo\u2019s Naturally', 'Nothing Bundt Cakes', 'Gelson\u2019s'],
    mustVisit: [
      { name: 'SENDAI Japanese BBQ',       note: 'Tabletop yakiniku \u2014 the North County\u2019s best' },
      { name: 'Cinepolis Luxury Cinemas',  note: 'Reclining seats + in-seat food service' },
      { name: 'Jimbo\u2019s Naturally',    note: 'Flagship organic grocer in Carmel Valley' }
    ],
    dining: [
      { name: 'SENDAI',                type: 'Japanese BBQ',    note: 'Tabletop grill \u2014 reservations needed' },
      { name: 'Lola 55 Tacos',         type: 'Mexican',         note: 'Tijuana-style tacos \u2014 Del Mar outpost' },
      { name: 'Sur la Table',          type: 'Retail + Classes', note: 'Cooking classes on-site' }
    ],
    tips: [
      'Thursday 3-7 PM farmers market in the central piazza',
      'Cinepolis weekday matinees are cheapest and quietest',
      'Walk to One Paseo across Del Mar Heights Rd for a second wave of restaurants'
    ],
    bestFor: ['Lifestyle Shopping', 'Family', 'North County', 'Dinner + Movie'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDD\uFE0F', label: 'Open-Air', note: 'Pedestrian piazza at the center' },
      { icon: '\uD83C\uDFAC', label: 'Cinepolis', note: 'Luxury reclining cinema' },
      { icon: '\uD83C\uDF45', label: 'Thursday Market', note: 'Farmers market 3-7 PM' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface + garage' }
    ]
  },
  {
    id: 7,
    name: 'One Paseo',
    tagline: 'Mixed-use Carmel Valley destination \u2014 dining, retail, residential.',
    tier: 'Lifestyle Center', emoji: '\uD83C\uDFD9\uFE0F',
    neighborhood: 'Carmel Valley',
    address: '3725 Paseo Place, San Diego CA 92130',
    lat: 32.9433, lng: -117.2330,
    instagram: '@onepaseosd',
    hours: 'Daily 10AM-10PM (dining later)',
    parking: 'Free garage with validation',
    score: 86,
    vibe: 'Kilroy Realty\u2019s mixed-use flagship at Del Mar Heights & El Camino \u2014 a genuine pedestrian center with SD\u2019s most-loved restaurants under one roof.',
    about: "Opened 2019, Kilroy Realty\u2019s 23-acre mixed-use center at Del Mar Heights Rd and El Camino Real. 95,000 sq ft of retail, 175,000 sq ft of office, 608 residences, and a dining lineup stacked with SD headliners \u2014 Cava, Shake Shack, Salt & Straw, International Smoke (Ayesha Curry), CH Projects\u2019 Great Maple.",
    anchors: ['International Smoke', 'Great Maple', 'Salt & Straw', 'Shake Shack', 'Kindred Spirits'],
    mustVisit: [
      { name: 'International Smoke',  note: 'Ayesha & Stephen Curry\u2019s smoked-meats restaurant' },
      { name: 'Great Maple',          note: 'CH Projects all-day diner \u2014 maple bacon donut' },
      { name: 'Salt & Straw',         note: 'Portland ice cream outpost' }
    ],
    dining: [
      { name: 'Cava',                 type: 'Mediterranean',    note: 'Fast-casual bowls' },
      { name: 'Mendocino Farms',      type: 'Sandwiches',       note: 'Craft sandwiches + salads' },
      { name: 'Caffe Luxxe',          type: 'Coffee',           note: 'LA-based specialty coffee' }
    ],
    tips: [
      'Park in the garage \u2014 validated with any restaurant receipt',
      'Live music in the plaza most Friday evenings in summer',
      'Walk across Del Mar Heights Rd to Del Mar Highlands for double dining options'
    ],
    bestFor: ['Dining', 'Date Night', 'Mixed-Use', 'Weekend'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFD9\uFE0F', label: 'Mixed-Use', note: '23 acres \u2014 retail + office + residences' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Dining', note: 'International Smoke, Great Maple, Salt & Straw' },
      { icon: '\uD83C\uDFB6', label: 'Summer Music', note: 'Friday evening live music' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free garage with validation' }
    ]
  },
  {
    id: 8,
    name: 'Carlsbad Premium Outlets',
    tagline: 'North County outlet mall \u2014 Simon Premium brand.',
    tier: 'Outlet Mall', emoji: '\uD83C\uDFF7\uFE0F',
    neighborhood: 'Carlsbad',
    address: '5620 Paseo Del Norte, Carlsbad CA 92008',
    lat: 33.1252, lng: -117.3227,
    instagram: '@premiumoutlets',
    hours: 'Mon-Sat 10AM-9PM, Sun 10AM-8PM',
    parking: 'Free surface',
    score: 80,
    vibe: 'Open-air Simon Premium outlet with 90+ name-brand stores \u2014 Coach, Kate Spade, Polo Ralph Lauren \u2014 off I-5 next to Legoland.',
    about: "Simon Premium Outlets property with 90+ designer and brand outlets in an open-air format. Coach, Kate Spade, Polo Ralph Lauren, Michael Kors, Tommy Hilfiger, Under Armour. Sits off I-5 at Palomar Airport Rd, directly across from Legoland California.",
    anchors: ['Coach', 'Kate Spade', 'Polo Ralph Lauren', 'Michael Kors', 'Under Armour'],
    mustVisit: [
      { name: 'Coach',                note: 'Outlet pricing on current + past season' },
      { name: 'Polo Ralph Lauren',    note: 'One of the larger outlet locations in SD County' },
      { name: 'Under Armour',         note: 'Athletic outlet pricing' }
    ],
    dining: [
      { name: 'Ruby\u2019s Diner',    type: 'American Diner',  note: 'Retro SoCal diner \u2014 kid-friendly' },
      { name: 'Panera Bread',         type: 'Fast-Casual',     note: 'Quick lunch break' }
    ],
    tips: [
      'Combine with Legoland or The Crossings golf for a North County day',
      'Sign up for the VIP Shopper Club online \u2014 printable coupon book on arrival',
      'Black Friday + Labor Day are the deepest-markdown weekends'
    ],
    bestFor: ['Outlet Shopping', 'Family', 'North County', 'Tourist'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFF7\uFE0F', label: 'Outlets', note: '90+ designer + brand outlets' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Coach, Kate Spade, Polo, Under Armour' },
      { icon: '\uD83C\uDFA0', label: 'Legoland Adjacent', note: 'Directly across from Legoland CA' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface' }
    ]
  },
  {
    id: 9,
    name: 'Las Americas Premium Outlets',
    tagline: 'Border-adjacent Simon Premium outlet \u2014 125+ brands.',
    tier: 'Outlet Mall', emoji: '\uD83C\uDFF7\uFE0F',
    neighborhood: 'San Ysidro',
    address: '4211 Camino de la Plaza, San Diego CA 92173',
    lat: 32.5522, lng: -117.0424,
    instagram: '@premiumoutlets',
    hours: 'Mon-Sat 10AM-9PM, Sun 10AM-8PM',
    parking: 'Free surface',
    score: 82,
    vibe: 'Simon Premium outlet sitting a block from the Mexico border \u2014 125+ brands, international shopper magnet, busiest outlet in the SD region.',
    about: "Simon Premium Outlets on the U.S.-Mexico border in San Ysidro, directly north of the San Ysidro Port of Entry. 125+ brands \u2014 Nike, Adidas, Levi\u2019s, Puma, Polo Ralph Lauren, Tommy Hilfiger, Calvin Klein, Bose. The busiest outlet in the region; a steady cross-border shopper base is the reason.",
    anchors: ['Nike', 'Adidas', 'Levi\u2019s', 'Polo Ralph Lauren', 'Tommy Hilfiger'],
    mustVisit: [
      { name: 'Nike Factory Store',   note: 'One of the largest Nike outlets on the West Coast' },
      { name: 'Adidas Outlet',        note: 'Strong athletic inventory' },
      { name: 'Levi\u2019s Outlet',   note: '501s at outlet pricing' }
    ],
    dining: [
      { name: 'Shake Shack',          type: 'Burgers',         note: 'Border-area outpost' },
      { name: 'Starbucks',            type: 'Coffee',          note: 'Outlet-plaza location' }
    ],
    tips: [
      'Best early Sunday morning \u2014 cross-border lines shortest',
      'Plaza Las Americas Trolley stop is one block away \u2014 arrive by transit',
      'Tax-free purchase-paperwork for Mexican visitors available at customer service'
    ],
    bestFor: ['Outlet Shopping', 'Athletic', 'Border Day-Trip'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFF7\uFE0F', label: 'Outlets', note: '125+ brands' },
      { icon: '\uD83C\uDFEC', label: 'Anchors', note: 'Nike, Adidas, Levi\u2019s, Polo' },
      { icon: '\uD83C\uDF0E', label: 'Border-Adjacent', note: 'One block from San Ysidro Port of Entry' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Free surface' }
    ]
  },
  {
    id: 10,
    name: 'The Headquarters at Seaport',
    tagline: 'Former SD Police HQ \u2014 now boutique dining + retail on the water.',
    tier: 'Dining & Retail District', emoji: '\uD83D\uDC6E',
    neighborhood: 'Downtown / Embarcadero',
    address: '789 W Harbor Dr, San Diego CA 92101',
    lat: 32.7094, lng: -117.1736,
    instagram: '@theheadquartersatseaport',
    hours: 'Daily 10AM-10PM (dining later)',
    parking: 'Validation available at adjacent garages',
    score: 82,
    vibe: 'The restored 1939 San Diego Police HQ building \u2014 open cells preserved as photo ops, now a boutique dining-and-retail courtyard between Seaport Village and USS Midway.',
    about: "Historic 1939 San Diego Police headquarters restored and reopened 2013 as a boutique dining-and-retail destination. 25 shops and restaurants laid out around a central open-air courtyard. Eddie V\u2019s Prime Seafood, Puesto, Seasons 52, and the preserved police-cell photo walk in the west corridor.",
    anchors: ['Eddie V\u2019s Prime Seafood', 'Puesto', 'Seasons 52', 'Cheesecake Factory'],
    mustVisit: [
      { name: 'Eddie V\u2019s Prime Seafood',  note: 'Waterfront fine-dining anchor \u2014 jazz trio nightly' },
      { name: 'Puesto',                        note: 'Design-forward Mexican \u2014 crispy melted-cheese tacos' },
      { name: 'The Cell Block',                note: 'Preserved police cells \u2014 free photo walk in the corridor' }
    ],
    dining: [
      { name: 'Eddie V\u2019s',       type: 'Seafood & Steak',  note: 'Nightly jazz; business-dinner anchor' },
      { name: 'Puesto',                type: 'Mexican',          note: 'Tijuana-style tacos done upscale' },
      { name: 'Seasons 52',            type: 'American',         note: 'Seasonal menu \u2014 calorie-counted' }
    ],
    tips: [
      'Walk the bayfront path from Seaport Village next door \u2014 connected',
      'Cell block corridor photo is free and overlooked',
      'Puesto books fast on weekends \u2014 set a Resy alert 30 days out'
    ],
    bestFor: ['Dining', 'Waterfront', 'Date', 'Historic'],
    awards: '',
    highlights: [
      { icon: '\uD83C\uDFDB\uFE0F', label: 'Historic', note: '1939 SDPD headquarters restored 2013' },
      { icon: '\uD83C\uDF7D\uFE0F', label: 'Dining', note: 'Eddie V\u2019s, Puesto, Seasons 52' },
      { icon: '\uD83D\uDEA2', label: 'Waterfront', note: 'Directly between Seaport Village + USS Midway' },
      { icon: '\uD83D\uDE97', label: 'Parking', note: 'Adjacent garage validation' }
    ]
  }
];

const body = JSON.stringify(sdMalls, null, 2)
  .split('\n')
  .map((l, i) => (i === 0 ? l : '  ' + l))
  .join('\n');

const insertion = `,\r\n  "san diego": ${body}\r\n`;
const before = html.slice(0, closeIdx);
const after = html.slice(closeIdx);
const trimmedBefore = before.replace(/\s+$/, '');
const newHtml = trimmedBefore + insertion + after;

fs.writeFileSync(path, newHtml);
console.log('Inserted san diego section into MALL_DATA with', sdMalls.length, 'entries.');
