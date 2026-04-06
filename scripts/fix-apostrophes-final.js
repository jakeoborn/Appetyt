const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// Targeted fixes for known unescaped apostrophes
// These break JS because they're inside single-quoted strings

const replacements = [
  // Line 3659: knownFor
  ["knownFor:'Katz's Deli,", "knownFor:'Katz\\'s Deli,"],
  // Line 3672: mustVisit
  ["mustVisit:'Time Out Market, Juliana's Pizza,", "mustVisit:'Time Out Market, Juliana\\'s Pizza,"],
  // Line 3675: knownFor
  ["knownFor:'Zabar's, Absolute Bagels", "knownFor:'Zabar\\'s, Absolute Bagels"],
  ["mustVisit:'Zabar's,", "mustVisit:'Zabar\\'s,"],
  ["knownFor:'Jacob's Pickles'", "knownFor:'Jacob\\'s Pickles'"],
  ["mustVisit:'Zabar's, Absolute Bagels, Jacob's Pickles'", "mustVisit:'Zabar\\'s, Absolute Bagels, Jacob\\'s Pickles'"],
  // Line 3673: knownFor
  ["knownFor:'Le Bain, Catch, The Standard, Whitney Museum'", "knownFor:'Le Bain, Catch, The Standard, Whitney Museum'"], // no issue
  // Line 3668: Harlem
  ["knownFor:'Apollo Theater, Sylvia's,", "knownFor:'Apollo Theater, Sylvia\\'s,"],
  ["mustVisit:'Sylvia's, Red Rooster, Melba's,", "mustVisit:'Sylvia\\'s, Red Rooster, Melba\\'s,"],
  ["tip:'Sunday gospel brunch at Sylvia's is", "tip:'Sunday gospel brunch at Sylvia\\'s is"],
  // Line 3671: Greenpoint
  ["mustVisit:'Chez Ma Tante, Peter Pan Donut, Paulie Gee's'", "mustVisit:'Chez Ma Tante, Peter Pan Donut, Paulie Gee\\'s'"],
  // Line 3679: Nolita
  ["knownFor:'Prince St Pizza, Rubirosa, Elizabeth St boutiques'", "knownFor:'Prince St Pizza, Rubirosa, Elizabeth St boutiques'"], // ok
  ["mustVisit:'Prince Street Pizza, Rubirosa, Eileen's Cheesecake'", "mustVisit:'Prince Street Pizza, Rubirosa, Eileen\\'s Cheesecake'"],
  // Line 3680: NoHo
  ["mustVisit:'Babbo, Il Buco, Bohemian (referral-only), Borgo'", "mustVisit:'Babbo, Il Buco, Bohemian (referral-only), Borgo'"], // ok
  // Line 3681: FiDi
  ["knownFor:'One World Trade, Brooklyn Bridge, Pier 17, Stone Street'", "knownFor:'One World Trade, Brooklyn Bridge, Pier 17, Stone Street'"], // ok
  // Line 3682: Brooklyn Heights
  ["knownFor:'Brooklyn Promenade, brownstones, Sahadi's'", "knownFor:'Brooklyn Promenade, brownstones, Sahadi\\'s'"],
  ["mustVisit:'Sahadi's, Al Badawi, Confidant'", "mustVisit:'Sahadi\\'s, Al Badawi, Confidant'"],
  // Line 3685: Bushwick
  ["knownFor:'Street murals, House of Yes, Roberta's, Elsewhere'", "knownFor:'Street murals, House of Yes, Roberta\\'s, Elsewhere'"],
  ["mustVisit:'House of Yes, Roberta's, Bunna Cafe, Elsewhere'", "mustVisit:'House of Yes, Roberta\\'s, Bunna Cafe, Elsewhere'"],
  // Line 3686: Carroll Gardens
  ["mustVisit:'Lucali, Frankies 457, Clover Club, Long Island Bar'", "mustVisit:'Lucali, Frankies 457, Clover Club, Long Island Bar'"], // ok
  // Line 3687: Red Hook
  ["mustVisit:'Hometown BBQ, Red Hook Tavern, Brooklyn Crab, Sunny's Bar'", "mustVisit:'Hometown BBQ, Red Hook Tavern, Brooklyn Crab, Sunny\\'s Bar'"],
  ["tip:'Sunny's Bar has live bluegrass on Saturdays. One of NYC's oldest.'", "tip:'Sunny\\'s Bar has live bluegrass on Saturdays. One of NYC\\'s oldest.'"],
  // Line 3689: Midtown East
  ["knownFor:'Grand Central, Chrysler Building, St. Regis, UN'", "knownFor:'Grand Central, Chrysler Building, St. Regis, UN'"], // ok
  // Line 3690: Midtown West
  ["knownFor:'Broadway, Carnegie Hall, Marquee, MSG'", "knownFor:'Broadway, Carnegie Hall, Marquee, MSG'"], // ok
  ["tip:'Keens has the world's largest pipe collection. Get the mutton chop.'", "tip:'Keens has the world\\'s largest pipe collection. Get the mutton chop.'"],
  // Bronx
  ["mustVisit:'Roberto's, Zero Otto Nove, La Morada, Bronx Zoo, NY Botanical Garden'", "mustVisit:'Roberto\\'s, Zero Otto Nove, La Morada, Bronx Zoo, NY Botanical Garden'"],
  ["tip:'Arthur Avenue is the real Little Italy -- skip Manhattan's tourist version.", "tip:'Arthur Avenue is the real Little Italy -- skip Manhattan\\'s tourist version."],
  ["tip:'Arthur Avenue is the real Little Italy -- skip Manhattan's tourist version. Get fresh mozzarella at Casa Della Mozzarella and a meal at Roberto's.'", "tip:'Arthur Avenue is the real Little Italy -- skip Manhattan\\'s tourist version. Get fresh mozzarella at Casa Della Mozzarella and a meal at Roberto\\'s.'"],
  // Coney Island
  ["mustVisit:'Nathan's Famous, Totonno's Pizza, L&B Spumoni Gardens'", "mustVisit:'Nathan\\'s Famous, Totonno\\'s Pizza, L&B Spumoni Gardens'"],
  // Jackson Heights
  ["knownFor:'Roosevelt Ave food corridor, diversity, Jackson Diner'", "knownFor:'Roosevelt Ave food corridor, diversity, Jackson Diner'"], // ok
  // Flushing
  ["tip:'New World Mall basement food court is the most authentic Chinese food experience in NYC.'", "tip:'New World Mall basement food court is the most authentic Chinese food experience in NYC.'"], // ok
  // Bed-Stuy
  ["knownFor:'Brownstone architecture, Peaches, Dough Doughnuts'", "knownFor:'Brownstone architecture, Peaches, Dough Doughnuts'"], // ok
  ["mustVisit:'Dough, A&A Bake Doubles, C's", "mustVisit:'Dough, A&A Bake Doubles, C\\'"],
  // Fort Greene
  ["knownFor:'BAM, Fort Greene Park, DeKalb Market Hall'", "knownFor:'BAM, Fort Greene Park, DeKalb Market Hall'"], // ok
  // Crown Heights
  ["knownFor:'Brooklyn Botanic Garden, Brooklyn Museum, West Indian Day Parade'", "knownFor:'Brooklyn Botanic Garden, Brooklyn Museum, West Indian Day Parade'"], // ok
  // Staten Island
  ["mustVisit:'Staten Island Ferry (free!), Enoteca Maria, Denino's Pizza'", "mustVisit:'Staten Island Ferry (free!), Enoteca Maria, Denino\\'s Pizza'"],
  ["tip:'The Staten Island Ferry is the best free activity in NYC -- Statue of Liberty views both ways.'", "tip:'The Staten Island Ferry is the best free activity in NYC -- Statue of Liberty views both ways.'"], // ok
  // Hell's Kitchen
  ["tip:'9th Ave between 42nd-56th beats anything near Times Square.'", "tip:'9th Ave between 42nd-56th beats anything near Times Square.'"], // ok
  // East Village
  ["knownFor:'St Marks Place, Death & Co, Veselka, ramen shops'", "knownFor:'St Marks Place, Death & Co, Veselka, ramen shops'"], // ok
  // SoHo
  ["knownFor:'Balthazar, cobblestones, luxury shopping, galleries'", "knownFor:'Balthazar, cobblestones, luxury shopping, galleries'"], // ok
  ["mustVisit:'Balthazar, The Dutch, Charlie Bird, Fanelli's'", "mustVisit:'Balthazar, The Dutch, Charlie Bird, Fanelli\\'s'"],
  ["tip:'Weekdays are much calmer than weekends. Fanelli's is one of NYC's oldest bars.'", "tip:'Weekdays are much calmer than weekends. Fanelli\\'s is one of NYC\\'s oldest bars.'"],
];

let fixCount = 0;
replacements.forEach(([from, to]) => {
  if(from === to) return; // skip identical
  if(h.includes(from)) {
    h = h.replace(from, to);
    fixCount++;
  }
});

console.log('Applied', fixCount, 'apostrophe fixes');

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify: check for remaining unescaped apostrophes in NYC neighborhoods
const cnStart = h.indexOf("'New York':{", h.indexOf('CITY_NEIGHBORHOODS'));
const cnEnd = h.indexOf("'Los Angeles':", cnStart);
const section = h.substring(cnStart, cnEnd);

// Count apostrophes that are not escaped
let issues = 0;
for(let i = 1; i < section.length - 1; i++) {
  if(section[i] === "'" && section[i-1] !== '\\') {
    const after = section.substring(i+1, i+4);
    const before = section[i-1];
    if(/[a-zA-Z]/.test(before) && /^[a-z]/.test(after)) {
      const ctx = section.substring(Math.max(0,i-20), i+20);
      console.log('REMAINING ISSUE at pos', i, ':', ctx);
      issues++;
    }
  }
}
console.log('Remaining issues:', issues);
console.log('Done!');
