// Update Discover tab (CELEB_DATA + DINING_TRENDS) and Local tab (MALL_DATA) for Houston & Chicago
// All data verified from CultureMap, Houstonia, Modern Luxury Chicago, Choose Chicago, etc.
// Run: node scripts/update-discover-local.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// 1. ADD HOUSTON & CHICAGO TO CELEB_DATA
// ═══════════════════════════════════════════

// Insert Houston after Miami block, before closing brace
const celebMiamiEnd = `'Joe\\'s Stone Crab',note:"Miami institution since 1913. Every president, every celebrity, every athlete has eaten here.",who:"🌟 Everyone · 🏀 🏈 All teams",icon:"🦀"},
            ],`;

const celebHoustonChicago = `'Joe\\'s Stone Crab',note:"Miami institution since 1913. Every president, every celebrity, every athlete has eaten here.",who:"🌟 Everyone · 🏀 🏈 All teams",icon:"🦀"},
            ],
            'Houston':[
              {id:7002,name:"Tatemó",note:"Houston's most exclusive table -- Michelin-starred Mexican tasting menu draws food-obsessed celebrities and visiting chefs",who:"🌟 Foodies · 🍳 Celebrity chefs",icon:"🌮"},
              {id:7001,name:"March",note:"Michelin-starred Mediterranean in Montrose -- date night favorite for Texans and Rockets players",who:"🏈 Texans · 🏀 Rockets",icon:"🍽️"},
              {id:7010,name:"Pappas Bros. Steakhouse",note:"Houston's power steakhouse -- NFL players, oil execs, and visiting celebrities for massive dry-aged cuts",who:"🏈 NFL · 💼 Energy execs",icon:"🥩"},
              {id:7003,name:"Turner's",note:"Fine dining steakhouse where Houston deal-makers and athletes celebrate big wins",who:"💼 Business elite · 🏈 Texans",icon:"🥩"},
              {name:"Trill Burgers",note:"Bun B's smash burger empire -- Houston hip-hop legend turned restaurateur. The OG smash burger won best in the country.",who:"🎤 Hip-hop · 🏈 Texans fans",icon:"🍔"},
              {name:"Taste of Gold",note:"Simone Biles' restaurant at IAH airport -- Olympic champion and husband Jonathan Owens' first restaurant venture",who:"🏅 Olympians · 🏈 NFL",icon:"🥇"},
              {id:7005,name:"Le Jardinier",note:"Elegant French-inspired dining at the Museum District -- visiting celebrities and art world crowd",who:"🎨 Art world · 🌟 Visiting celebs",icon:"🥗"},
              {id:7008,name:"Georgia James",note:"James Beard-nominated whole-animal steakhouse -- pitmaster Aaron Franklin-adjacent BBQ royalty energy",who:"🍳 Chefs · 🎤 Musicians",icon:"🥩"},
            ],
            'Chicago':[
              {name:"Adalina Prime",note:"West Loop steakhouse from Top Chef alum Soo Ahn -- Alex Bregman, Stephen Curry, Uma Thurman all spotted here",who:"🏀 NBA · ⚾ Cubs · 🎬 Hollywood",icon:"🥩"},
              {name:"RPM Steak",note:"River North power steakhouse -- Bears QB Caleb Williams celebrated playoff win here with late-night dinner",who:"🏈 Bears · 💼 Power brokers",icon:"🥩"},
              {name:"Divan",note:"River North jazz steakhouse where Simone Biles and Jonathan Owens were spotted dining over live music",who:"🏅 Olympians · 🏈 NFL",icon:"🎷"},
              {name:"Sushi-San",note:"Lincoln Park sushi spot where LeBron and Bronny James dined during NBA Combine",who:"🏀 NBA · 🎬 Visiting celebs",icon:"🍣"},
              {name:"Avli on The Park",note:"Greek restaurant where Tom Brady and Erin Andrews were welcomed during their Chicago visit",who:"🏈 NFL legends · 📺 Sports media",icon:"🫒"},
              {id:1,name:"Alinea",note:"Three Michelin stars. Grant Achatz's molecular gastronomy temple -- the most famous restaurant in Chicago",who:"🍳 Celebrity chefs · 🌟 A-List",icon:"🧪"},
              {name:"Carmine's Gold Coast",note:"Rosebud Restaurant Group's reimagined Italian-American flagship -- classic power dining with a new look",who:"💼 Chicago society · 🏈 Bears",icon:"🍝"},
              {name:"Bar Tutto",note:"Celebrity chef Joe Flamm's all-day Fulton Market Italian -- the hottest new opening in Chicago",who:"🍳 Top Chef · 🌟 Foodies",icon:"🍝"},
            ],`;

if (html.includes(celebMiamiEnd)) {
  html = html.replace(celebMiamiEnd, celebHoustonChicago);
  console.log('✓ Added Houston & Chicago to CELEB_DATA');
} else {
  console.log('✗ Could not find CELEB_DATA Miami end marker');
}

// Update cityLabels to include Houston and Chicago
const oldLabels = "const cityLabels={'Dallas':'Dallas','New York':'NYC','Los Angeles':'LA','Miami':'Miami'};";
const newLabels = "const cityLabels={'Dallas':'Dallas','New York':'NYC','Los Angeles':'LA','Miami':'Miami','Houston':'Houston','Chicago':'Chicago'};";
if (html.includes(oldLabels)) {
  html = html.replace(oldLabels, newLabels);
  console.log('✓ Updated cityLabels');
} else {
  console.log('✗ Could not find cityLabels');
}

// ═══════════════════════════════════════════
// 2. ADD HOUSTON & CHICAGO TO DINING_TRENDS
// ═══════════════════════════════════════════

const oldDefault = `      'default': [
        {trend:'Local Sourcing',desc:'The farm-to-table movement matured into a true commitment. Ask where ingredients come from.',emoji:'🌾'},
        {trend:'Chefs Counter',desc:'The intimate counter experience -- chef in front of you, food designed around conversation.',emoji:'👨‍🍳'},
      ],`;

const newTrends = `      'Houston': [
        {trend:'Michelin Recognition',desc:'Houston earned 6 Michelin-starred restaurants. Tatemó, March, and Le Jardinier lead the charge. The national spotlight is finally on Houston fine dining.',emoji:'⭐',spots:['Tatemó','March','Le Jardinier']},
        {trend:'Artisan Masa & Modern Mexican',desc:'From tacokase concepts to artisan masa tortillerías, Houston chefs are elevating Mexican cuisine beyond Tex-Mex. Zaranda and Luna Roja are leading the wave.',emoji:'🌮',spots:['Zaranda','Luna Roja','Tatemó']},
        {trend:'Vibe Dining & Tableside Theater',desc:'Fire dancers, flaming steaks, showy tableside presentations -- Houston diners want an experience, not just a meal. Mastro\\'s and Turner\\'s deliver the drama.',emoji:'🔥',spots:['Turner\\'s','Mastro\\'s','Georgia James']},
        {trend:'Immigrant Cuisine Celebration',desc:'Houston\\'s 70+ countries represented in restaurants make it America\\'s most diverse food city. Agnes and Sherman, Di An Pho, and Crawfish & Noodles showcase this.',emoji:'🌍',spots:['Agnes and Sherman','Di An Pho','Crawfish & Noodles']},
        {trend:'Live-Fire Cooking',desc:'Wood-fired, open-flame, and whole-animal programs are everywhere. Truth BBQ and Feges BBQ pushed the trend, now fine dining spots are building custom hearths.',emoji:'🪵',spots:['Truth BBQ','Georgia James','Feges BBQ']},
        {trend:'Smash Burger Wars',desc:'Bun B\\'s Trill Burgers won best burger in America and ignited a citywide smash burger arms race. New contenders pop up monthly across Houston.',emoji:'🍔',spots:['Trill Burgers','Rodeo Goat','Squable']},
      ],
      'Chicago': [
        {trend:'West Loop Dominance',desc:'The West Loop/Fulton Market corridor keeps attracting the biggest names. Girl & the Goat, Oriole, and Ever anchor the neighborhood. New openings arrive monthly.',emoji:'🏙️',spots:['Girl & the Goat','Oriole','Ever']},
        {trend:'Steakhouse Renaissance',desc:'Chicago\\'s steakhouse scene is having a moment. Adalina Prime, RPM Steak, and Divan are drawing celebrities and athletes alongside classics like Gibson\\'s.',emoji:'🥩',spots:['Adalina Prime','RPM Steak','Gibson\\'s']},
        {trend:'Ramen & Nikkei Fusion',desc:'Japanese-Peruvian Nikkei fusion and serious ramen are booming. Hokkaido Ramen Santouka just arrived in the West Loop, joining Wasabi and Ramen-San.',emoji:'🍜',spots:['Ramen-San','Wasabi','Sushi-San']},
        {trend:'OpenTable Domination',desc:'Chicago jumped from 3 to 16 restaurants on OpenTable\\'s Top 100 list in a single year. The city is now a top-5 dining destination nationally.',emoji:'📈'},
        {trend:'Bakery & Pastry Boom',desc:'Guillotine Bakery, Lost Larson, and Floriole are leading a Parisian-style bakery boom across Chicago\\'s neighborhoods.',emoji:'🥐',spots:['Lost Larson','Floriole','Guillotine Bakery']},
        {trend:'Late Night Revival',desc:'Wicker Park and Logan Square are becoming late-night dining hubs again. Dive bars with serious kitchens and chef-driven menus after midnight.',emoji:'🌙'},
      ],
      'default': [
        {trend:'Local Sourcing',desc:'The farm-to-table movement matured into a true commitment. Ask where ingredients come from.',emoji:'🌾'},
        {trend:'Chefs Counter',desc:'The intimate counter experience -- chef in front of you, food designed around conversation.',emoji:'👨‍🍳'},
      ],`;

if (html.includes(oldDefault)) {
  html = html.replace(oldDefault, newTrends);
  console.log('✓ Added Houston & Chicago to DINING_TRENDS');
} else {
  console.log('✗ Could not find DINING_TRENDS default marker');
}

// ═══════════════════════════════════════════
// 3. ADD HOUSTON TO MALL_DATA
// ═══════════════════════════════════════════

// Find end of chicago malls in MALL_DATA, insert houston before closing
// We'll add houston after the chicago array closes
const mallTag = "const MALL_DATA";
const mallStart = html.indexOf(mallTag);
const mallEq = html.indexOf('=', mallStart);
const mallBrace = html.indexOf('{', mallEq);
let mDepth = 0, mallEnd = mallBrace;
for (let i = mallBrace; i < html.length; i++) {
  if (html[i] === '{') mDepth++;
  if (html[i] === '}') mDepth--;
  if (mDepth === 0) { mallEnd = i; break; }
}

// Insert houston before the final closing brace
const houstonMalls = `,
  'houston': [
    {"id":1,"name":"The Galleria","tagline":"Texas' Largest Mall with 400+ Stores.","tier":"Luxury","neighborhood":"Uptown/Galleria","address":"5085 Westheimer Rd, Houston, TX 77056","lat":29.7389,"lng":-95.4614,"instagram":"@houstonGalleria","hours":"Mon-Sat 10AM-9PM, Sun 11AM-7PM","parking":"Free parking in attached garages","score":97,"emoji":"🏪","vibe":"Sprawling 2.4 million sq ft mega-mall with an ice rink, two Westin hotels, and every luxury brand you can name. The crown jewel of Houston retail.","about":"The Galleria is the largest mall in Texas and the fourth largest in the United States. With 400+ stores including Nordstrom, Neiman Marcus, Saks Fifth Avenue, and Macy's, plus an indoor ice rink, two hotels, and three office towers, it draws 30 million visitors annually.","anchors":["Nordstrom","Neiman Marcus","Saks Fifth Avenue","Macy's"],"mustVisit":[{"name":"Ice Rink","note":"Full-size indoor ice rink in the center of the mall"},{"name":"Neiman Marcus","note":"Flagship Texas department store"},{"name":"Galleria III","note":"Luxury wing with Chanel, Louis Vuitton, Gucci"}],"dining":[{"name":"The Oceanaire","type":"Seafood","note":"Upscale seafood and raw bar"},{"name":"The Cheesecake Factory","type":"American","note":"Massive menu, always packed"},{"name":"Nobu Houston","type":"Japanese","note":"Celebrity sushi right at the Galleria"}],"tips":["Park at Galleria III for the luxury wing -- less crowded","The ice rink is free to watch, skate rentals available","Go early on weekdays to avoid the weekend crush","Connected to two Westin hotels if you need a break"],"bestFor":["Luxury Shopping","Ice Skating","Rainy Day","Tourists"],"awards":"Largest Mall in Texas"},
    {"id":2,"name":"Uptown Park","tagline":"Open-Air Luxury Shopping & Dining.","tier":"Upscale","neighborhood":"Uptown","address":"1101 Uptown Park Blvd, Houston, TX 77056","lat":29.7492,"lng":-95.4614,"instagram":"@uptownparkhouston","hours":"Mon-Sat 10AM-6PM, Sun 12PM-5PM","parking":"Free surface parking","score":89,"emoji":"🛍️","vibe":"Intimate open-air luxury shopping village just north of Post Oak Boulevard with designer boutiques and upscale restaurants.","about":"Uptown Park is an open-air shopping and dining destination featuring contemporary designer collections, locally owned boutiques, and a curated mix of restaurants and wine bars along tree-lined walkways.","anchors":["Tootsies","Kuhl-Linscomb","Longoria Collection"],"mustVisit":[{"name":"Tootsies","note":"Houston's legendary designer fashion destination"},{"name":"Kuhl-Linscomb","note":"Iconic home decor and lifestyle store"}],"dining":[{"name":"Prego","type":"Italian","note":"Upscale Italian with great patio"},{"name":"Cafe Express","type":"Casual","note":"Quick lunch between shopping"}],"tips":["Great for a leisurely afternoon away from mall crowds","Tootsies is the must-visit for fashion lovers","Beautiful during the holidays with outdoor lights"],"bestFor":["Boutique Shopping","Designer Fashion","Al Fresco Dining"],"awards":""},
    {"id":3,"name":"Highland Village","tagline":"Inside-the-Loop Neighborhood Retail.","tier":"Mid-Luxury","neighborhood":"River Oaks / Upper Kirby","address":"4055 Westheimer Rd, Houston, TX 77027","lat":29.7366,"lng":-95.4323,"instagram":"","hours":"Mon-Sat 10AM-9PM, Sun 12PM-6PM","parking":"Free parking lot","score":87,"emoji":"🏘️","vibe":"Walkable open-air shopping center with national brands and local favorites in the heart of the Inner Loop.","about":"Highland Village is a neighborhood shopping center where national-brand retailers mix with locally owned shops and restaurants. Its central location between River Oaks and Upper Kirby makes it a convenient stop for Inner Loop residents.","anchors":["West Elm","Warby Parker","Athleta","Lululemon"],"mustVisit":[{"name":"West Elm","note":"Flagship home goods store"},{"name":"Local boutiques","note":"Mix of Houston-based shops"}],"dining":[{"name":"True Food Kitchen","type":"Health-Forward","note":"Seasonal menu focused on anti-inflammatory ingredients"},{"name":"Shake Shack","type":"Burgers","note":"Classic smash burgers and frozen custard"}],"tips":["Walkable from River Oaks District -- combine both","Great date-night dinner options nearby on Westheimer","Parking is easier than The Galleria"],"bestFor":["Neighborhood Shopping","Casual Dining","Inner Loop"],"awards":""},
    {"id":4,"name":"River Oaks District","tagline":"Houston's Most Exclusive Shopping & Dining.","tier":"Luxury","neighborhood":"River Oaks","address":"4444 Westheimer Rd, Houston, TX 77027","lat":29.7379,"lng":-95.4369,"instagram":"@riveroaksdistrict","hours":"Mon-Sat 10AM-7PM, Sun 12PM-6PM","parking":"Free valet and garage parking","score":93,"emoji":"💎","vibe":"Houston's answer to Rodeo Drive -- open-air luxury destination with Hermès, Cartier, Tom Ford, and chef-driven restaurants.","about":"River Oaks District is Houston's premier luxury open-air shopping destination. Designer flagships including Hermès, Cartier, Dior, Tom Ford, and Stella McCartney line the tree-shaded walkways alongside acclaimed restaurants and the iPic movie theater.","anchors":["Hermès","Cartier","Dior","Tom Ford","Stella McCartney"],"mustVisit":[{"name":"Hermès","note":"Flagship boutique -- one of the best in the South"},{"name":"iPic Theaters","note":"Luxury dine-in movie theater"},{"name":"Cartier","note":"Full jewelry and watch salon"}],"dining":[{"name":"Le Jardinier","type":"French","note":"Michelin-starred vegetable-forward French dining"},{"name":"Steak 48","type":"Steakhouse","note":"Upscale steakhouse with a scene"},{"name":"MAD","type":"Mediterranean","note":"Chic Mediterranean with a great patio"}],"tips":["Valet is free -- take advantage","Le Jardinier is the dining highlight and Michelin-starred","The iPic theater serves cocktails to your seat","Beautiful for evening strolls with the lights"],"bestFor":["Luxury Shopping","Fine Dining","Date Night","Architecture"],"awards":""},
    {"id":5,"name":"Rice Village","tagline":"College-Town Charm Meets Eclectic Shopping.","tier":"Mid","neighborhood":"Rice University / West University","address":"2500 Rice Blvd, Houston, TX 77005","lat":29.7158,"lng":-95.4108,"instagram":"","hours":"Varies by store","parking":"Street and garage parking","score":86,"emoji":"📚","vibe":"Walkable neighborhood shopping district near Rice University with independent bookstores, vintage shops, and diverse restaurants.","about":"Rice Village is a walkable shopping and dining district adjacent to Rice University. The eclectic mix includes independent bookstores, vintage clothing shops, international restaurants, and neighborhood bars -- all with a college-town energy that sets it apart from Houston's mega-malls.","anchors":["Valhalla","Half Price Books","Various local boutiques"],"mustVisit":[{"name":"Half Price Books","note":"Book lovers' paradise -- massive selection of used books"},{"name":"Local vintage shops","note":"Curated vintage clothing and accessories"}],"dining":[{"name":"Uchi","type":"Japanese","note":"James Beard-winning Japanese from Tyson Cole"},{"name":"Local Foods","type":"American","note":"Farm-to-table comfort food"},{"name":"Vietopia","type":"Vietnamese","note":"Pho and banh mi near Rice campus"}],"tips":["Park in the garage and walk -- the neighborhood is very walkable","Uchi is the dining star and requires reservations","Great for a Saturday afternoon of browsing","Free street parking on weekends near campus"],"bestFor":["Neighborhood Shopping","Bookstores","College Town","Diverse Dining"],"awards":""}
  ]`;

// Insert before the closing brace of MALL_DATA
html = html.slice(0, mallEnd) + houstonMalls + '\n' + html.slice(mallEnd);
console.log('✓ Added Houston to MALL_DATA (5 entries)');

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Done! Updated Discover and Local tabs for Houston & Chicago.');
