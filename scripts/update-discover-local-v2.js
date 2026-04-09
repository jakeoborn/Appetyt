// Fix: Add Houston & Chicago to CELEB_DATA and DINING_TRENDS
// (MALL_DATA + cityLabels already done in v1)
// Run: node scripts/update-discover-local-v2.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// 1. ADD HOUSTON & CHICAGO TO CELEB_DATA
// ═══════════════════════════════════════════
// Strategy: find the closing `};` of CELEB_DATA and insert before it

const celebStart = html.indexOf('const CELEB_DATA');
if (celebStart === -1) { console.error('CELEB_DATA not found'); process.exit(1); }
const celebBrace = html.indexOf('{', celebStart);
let depth = 0, celebEnd = celebBrace;
for (let i = celebBrace; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') depth--;
  if (depth === 0) { celebEnd = i; break; }
}

// Find the last '],' before celebEnd (end of Miami array)
const celebSection = html.substring(celebBrace, celebEnd);
const lastArrayClose = celebSection.lastIndexOf('],');
const insertPos = celebBrace + lastArrayClose + 2; // after the ],

const houstonChicagoCeleb = `
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

html = html.slice(0, insertPos) + houstonChicagoCeleb + html.slice(insertPos);
console.log('✓ Added Houston & Chicago to CELEB_DATA');

// ═══════════════════════════════════════════
// 2. ADD HOUSTON & CHICAGO TO DINING_TRENDS
// ═══════════════════════════════════════════
// Insert before 'default' key

const dtIdx = html.indexOf('const DINING_TRENDS');
const defaultIdx = html.indexOf("'default'", dtIdx);
// Find the start of this line (go back to previous newline)
let lineStart = defaultIdx;
while (lineStart > 0 && html[lineStart - 1] !== '\n') lineStart--;

const houstonChicagoTrends = `      'Houston': [
        {trend:'Michelin Recognition',desc:'Houston earned 6 Michelin-starred restaurants. Tatemó, March, and Le Jardinier lead the charge. The national spotlight is finally on Houston fine dining.',emoji:'⭐',spots:['Tatemó','March','Le Jardinier']},
        {trend:'Artisan Masa & Modern Mexican',desc:'From tacokase concepts to artisan masa tortillerías, Houston chefs are elevating Mexican cuisine beyond Tex-Mex. Zaranda and Luna Roja are leading the wave.',emoji:'🌮',spots:['Zaranda','Luna Roja','Tatemó']},
        {trend:'Vibe Dining & Tableside Theater',desc:'Fire dancers, flaming steaks, showy tableside presentations -- Houston diners want an experience, not just a meal. Turner\\'s and Mastro\\'s deliver the drama.',emoji:'🔥',spots:['Turner\\'s','Mastro\\'s','Georgia James']},
        {trend:'Immigrant Cuisine Celebration',desc:'Houston\\'s 70+ countries represented in restaurants make it America\\'s most diverse food city. Agnes and Sherman, Di An Pho, and Crawfish & Noodles showcase this.',emoji:'🌍',spots:['Agnes and Sherman','Di An Pho','Crawfish & Noodles']},
        {trend:'Live-Fire Cooking',desc:'Wood-fired, open-flame, and whole-animal programs are everywhere. Truth BBQ and Feges BBQ pushed the trend, now fine dining spots are building custom hearths.',emoji:'🪵',spots:['Truth BBQ','Georgia James','Feges BBQ']},
        {trend:'Smash Burger Wars',desc:'Bun B\\'s Trill Burgers won best burger in America and ignited a citywide smash burger arms race. New contenders pop up monthly.',emoji:'🍔',spots:['Trill Burgers','Rodeo Goat','Squable']},
      ],
      'Chicago': [
        {trend:'West Loop Dominance',desc:'The West Loop/Fulton Market corridor keeps attracting the biggest names. Girl & the Goat, Oriole, and Ever anchor the neighborhood. New openings arrive monthly.',emoji:'🏙️',spots:['Girl & the Goat','Oriole','Ever']},
        {trend:'Steakhouse Renaissance',desc:'Chicago\\'s steakhouse scene is having a moment. Adalina Prime, RPM Steak, and Divan are drawing celebrities alongside classics like Gibson\\'s.',emoji:'🥩',spots:['Adalina Prime','RPM Steak','Gibson\\'s']},
        {trend:'Ramen & Nikkei Fusion',desc:'Japanese-Peruvian Nikkei fusion and serious ramen are booming. Hokkaido Ramen Santouka just arrived in the West Loop.',emoji:'🍜',spots:['Ramen-San','Wasabi','Sushi-San']},
        {trend:'OpenTable Domination',desc:'Chicago jumped from 3 to 16 restaurants on OpenTable\\'s Top 100 list in a single year. The city is now a top-5 dining destination nationally.',emoji:'📈'},
        {trend:'Bakery & Pastry Boom',desc:'Lost Larson, Floriole, and Guillotine Bakery are leading a Parisian-style bakery boom across neighborhoods.',emoji:'🥐',spots:['Lost Larson','Floriole','Guillotine Bakery']},
        {trend:'Late Night Revival',desc:'Wicker Park and Logan Square are becoming late-night dining hubs again. Dive bars with serious kitchens after midnight.',emoji:'🌙'},
      ],
`;

html = html.slice(0, lineStart) + houstonChicagoTrends + html.slice(lineStart);
console.log('✓ Added Houston & Chicago to DINING_TRENDS');

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Discover & Local tabs updated for Houston & Chicago.');
