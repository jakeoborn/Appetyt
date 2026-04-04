const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// --- Add Family Friendly tag to appropriate restaurants ---
const familyFriendly = [
  'Birdies Eastside', 'Birdies Golf Lounge', 'Katy Trail Ice House', 'Truck Yard',
  'Meso Maya', 'Breadwinners Cafe & Bakery', "Norma's Cafe", 'Fogo de Chao',
  'El Fenix', "Uncle Julio's", "Torchy's Tacos", 'Taco Deli', "Campisi's Egyptian Restaurant",
  'Shake Shack', 'The Cheesecake Factory', "Raising Cane's", 'Twisted Root Burger Co.',
  "Dave's Hot Chicken", 'Liberty Burger', 'Burger House', "Keller's Drive-In",
  'Hello Dumpling', 'Pappadeaux Seafood Kitchen', "Pappasito's Cantina",
  'Pappas Bros. Steakhouse', 'Blue Mesa Grill', 'Hopdoddy Burger Bar',
  'Pie Tap Pizza Workshop', "Torchy's Tacos", 'Serious Pizza Deep Ellum',
  'Eataly', 'Village Baking Co.', 'The Salty Donut', 'La Rue Doughnuts',
  "Jeni's Splendid Ice Creams", 'Van Leeuwen Ice Cream', 'Milk Cream',
  'Melt Ice Creams', 'Howdy Homemade Ice Cream', 'Jarams Donuts',
  'Le Bon Temps', 'Botolino Gelato Artigianale', 'Emporium Pies',
  'Bird Bakery', 'Crispy Cones', 'Le Reve Patisserie',
  'Mike\'s Chicken', 'Chicken N Pickle', 'PopStroke', 'Puttery',
  'BowlGames Dallas', 'Electric Shuffle', 'Punch Bowl Social',
  "Fadi's Mediterranean Grill", 'True Food Kitchen', 'Joey Dallas',
  'North Italia', 'Cava', 'Sweetgreen', 'Snappy Salads',
  'Mexican Sugar', "Mo' Bettahs Hawaiian", 'Beto & Son',
  'Stock & Barrel', 'GoodFriend Beer Garden & Burger House',
  "Norma's Cafe", 'Ida Claire', 'Sundown at Granada',
  'Moreish Donuts', 'Detour Doughnuts', 'San Martin Bakery',
  'Urban Donut & Coffee', 'Voodoo Doughnut',
];

let tagCount = 0;
for (const name of [...new Set(familyFriendly)]) {
  const nameStr = '"name":"' + name + '"';
  const idx = html.indexOf(nameStr);
  if (idx === -1) continue;

  const entryStart = html.lastIndexOf('{', idx);
  const region = html.substring(entryStart, entryStart + 2000);

  if (region.includes('"Family Friendly"') || region.includes('"Family"')) continue;

  const tagsIdx = region.indexOf('"tags":[');
  if (tagsIdx === -1) continue;

  const absTagsStart = entryStart + tagsIdx + 7;
  const closeBracket = html.indexOf(']', absTagsStart);

  html = html.substring(0, closeBracket) + ',"Family Friendly"' + html.substring(closeBracket);
  tagCount++;
}
console.log('Tagged Family Friendly:', tagCount);

// --- Upgrade thin descriptions ---
const descUpgrades = {
  'Sassetta': "Modern Italian in the Harwood District from the team behind Wheelhouse. The handmade pasta is exceptional, the wood-fired pizzas rival anything in Dallas, and the dreamy tree-lit patio is one of the most romantic outdoor dining spaces in the city. A Harwood essential.",
  'HG Sply Co.': "Rooftop restaurant with panoramic Greenville Avenue views and a menu focused on whole-ingredient cooking. The sunset happy hour is legendary -- $6 ranch waters on the roof with the Dallas skyline turning gold. Weekend brunch gets packed for good reason.",
  'Mamani': "Chef Carlos Rivera's ambitious modern Mexican fine dining. Earned a Michelin star in 2025 for extraordinary mole tasting menus and inventive cocktails. Each course tells a story rooted in Mexican tradition but reimagined with precision. A serious statement restaurant.",
  'The Skellig': "Authentic Irish pub on Lower Greenville with proper pints, shepherd's pie, and a welcoming neighborhood atmosphere. Named after the Skellig Islands off Ireland's coast. The kind of pub where locals settle in for hours and tourists stumble upon magic.",
  'Club Dada': "One of the oldest and most beloved live music clubs in Deep Ellum since 1985. Eclectic booking ranges from indie to hip-hop to punk. Intimate room, strong drinks, and the kind of authentic Deep Ellum energy that's increasingly rare.",
  'Rainbowcat': "Chef Misti Norris's stunning fusion of Vietnamese technique with French precision inside Saint Valentine bar. The pho au jus and five-spice duck are extraordinary. An intimate, reservation-only counter experience that earned serious James Beard attention.",
  'Happiest Hour': "Multi-level rooftop bar across from American Airlines Center. Best pre-game spot in Dallas with skyline views, giant Jenga, and a crowd that ranges from Mavs fans to bachelorette parties. The frozen ranch waters keep flowing.",
  'Katy Trail Ice House': "The legendary Uptown patio institution -- 40,000 sq ft of outdoor space along the Katy Trail. Dallas's quintessential post-run or pre-game hangout. Cold beer, burgers, live music, and more dogs than a park. An Uptown rite of passage.",
  'Plomo': "Mezcal-forward Mexican cocktail bar with elevated street food in a dark, moody space. The mezcal and tequila list is one of the deepest in Dallas, and the bartenders know how to use it. Elotes, queso fundido, and late-night vibes.",
  "Jonathon's Oak Cliff": "James Beard-nominated Jonathon Erdeljac's soulful Oak Cliff neighborhood anchor. Extraordinary brunch that draws crowds from across Dallas. The fried chicken biscuit is legendary, the vibes are warm, and the cooking has serious soul.",
  'The Corner Market': "Beloved East Dallas neighborhood spot known for their legendary breakfast burrito that's achieved cult status. Fast, affordable, and consistently excellent. Cash-friendly prices and the kind of regulars who've been coming for years.",
  'Truck Yard': "Eclectic food truck park with a massive patio, treehouse bar, and rotating vendors. One of Dallas's most unique outdoor experiences -- part beer garden, part food hall, part backyard party. The cheese steak truck is a perennial favorite.",
  'Even Coast': "Coastal-driven seafood with a refined but unfussy approach. Excellent raw bar, pristine whole fish, and creative cocktails in the Harwood District. The kind of restaurant that lets the ingredients do the talking. An underrated gem.",
  'Roundup Saloon': "Iconic Dallas LGBTQ+ country western bar on Cedar Springs since 1980. Line dancing lessons, live music, two-stepping, and a welcoming atmosphere that's made it a Dallas institution. Thursday night is legendary. Everyone's welcome on the dance floor.",
  'Tatsu Dallas': "Intimate 20-seat omakase from Chef Tatsuya Sekiguchi. Twenty-plus courses of pristine nigiri and sashimi, each piece a masterclass in technique. The most exclusive table in Dallas -- reservations drop on Tock and vanish instantly. Worth every effort to book.",
  'Written by the Seasons': "Justin Holt's 20-course tasting menu in a converted Cedars warehouse. Hyper-local and hyper-seasonal -- every ingredient sourced within 150 miles of Dallas. One of the most ambitious restaurants in Texas and a James Beard finalist. Book well ahead.",
  'Sachet': "Elegant Mediterranean from the team behind Knife. Whole fish, mezze spreads, and wood-fired dishes in a stunning Oak Lawn space. One of Dallas's most beautiful patios and a wine list that leans into the region. Perfect for a long, lingering dinner.",
  'Birdies Eastside': "Neighborhood hangout on Mockingbird near Casa Linda with solid bar food, craft cocktails, and a dog-friendly, kid-friendly patio. Smash burgers, wings, and a rotating tap list. The kind of place where families and friend groups coexist perfectly.",
  'Piada Italian Street Food': "Build-your-own Italian street food -- piadas (Italian wraps), pasta bowls, and chopped salads. Fast-casual done right with fresh ingredients and bold flavors. Great lunch option near Casa Linda that the whole family can agree on.",
  'East Hampton Sandwich Co.': "Vandelay Hospitality's beloved sandwich concept serving elevated deli-style sandwiches with premium ingredients. The lobster roll and turkey avocado are standouts. Multiple locations, consistent quality, and the kind of lunch spot you crave repeatedly.",
  'Maple & Motor': "No-frills burger joint with a cult following and a famously simple menu -- burgers, hot dogs, fries, that's it. Cash only, no substitutions, closed Sundays. The Duncanville-smash patty has earned its legendary status. Don't overthink it.",
  'The Finch': "Neighborhood bar from Milkshake Concepts with a solid cocktail program, approachable menu, and a Henderson Ave crowd that skews fun without being chaotic. The patio is great, the wings are underrated, and happy hour is well-priced.",
  "Eno's Pizza Tavern": "Bishop Arts neighborhood staple since 2008. Thin-crust wood-fired pies, an extensive craft beer list, and the kind of unpretentious neighborhood energy that Bishop Arts was built on. The white pizza with truffle oil is a regular's secret.",
  'Cafe Lucca': "Uptown Italian newcomer bringing handmade pasta, wood-fired dishes, and sophisticated cocktails in a warm, approachable space. The rigatoni bolognese and burrata are early standouts. Feels like it's been here for years despite being new.",
  'Herby\'s Burgers': "DJ Sober's retro smashburger joint in Elmwood. The OG Smash with secret sauce has a cult following, the fries are hand-cut, and the milkshakes are thick enough to stand a straw in. Tiny space, big flavors, no pretension.",
  'Midnight Rambler': "The speakeasy beneath The Joule Hotel where finding the hidden entrance became a TikTok challenge. World-class cocktails in an Art Deco underground room with a DJ booth and velvet banquettes. Dallas's most atmospheric bar -- dress up and commit to the vibe.",
  'La Salsa Verde Taqueria': "The most authentic Mexican tacos in DFW since 2010. Legendary tacos de cabeza and birria that draw crowds from across the metroplex. Multiple locations, unfailingly consistent, and the kind of taqueria that makes you question every other taco you've eaten.",
};

let descCount = 0;
for (const [name, desc] of Object.entries(descUpgrades)) {
  const nameStr = '"name":"' + name + '"';
  const idx = html.indexOf(nameStr);
  if (idx === -1) { console.log('NOT FOUND:', name); continue; }

  const entryStart = html.lastIndexOf('{', idx);
  const region = html.substring(entryStart, entryStart + 2000);
  const descMatch = region.match(/"description":"([^"]*)"/);
  if (!descMatch) continue;

  const oldDesc = '"description":"' + descMatch[1] + '"';
  const escapedDesc = desc.replace(/"/g, '\\"');
  const newDesc = '"description":"' + escapedDesc + '"';

  const absIdx = html.indexOf(oldDesc, entryStart);
  if (absIdx === -1) continue;

  html = html.substring(0, absIdx) + newDesc + html.substring(absIdx + oldDesc.length);
  descCount++;
}
console.log('Upgraded descriptions:', descCount);

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(__dirname, '..', 'index'), html);
console.log('Done!');
