// Add missing NYC museums & observatories (only ones NOT already in data)
// Existing NYC attractions include: Central Park, MET, High Line, Empire State,
// Grand Central, Times Square, Statue of Liberty, Coney Island, Top of the Rock,
// One World Observatory, Madison Square Garden, Radio City, Vessel, Wall St, etc.
// Missing: MoMA, Whitney, Guggenheim, Natural History, 9/11 Memorial, Intrepid,
// Summit One Vanderbilt, Bryant Park, Washington Square Park, Prospect Park, Chelsea Market
// Run: node scripts/add-attractions-nyc.js

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// NYC uses JS object notation (not pure JSON) — must find the array between specific markers
const cityDataMarker = 'NYC_DATA';
const start = html.indexOf('const ' + cityDataMarker);
if (start < 0) {
  console.error('Cannot find const', cityDataMarker, '- checking for alternate...');
  // Try alternate: 'New York' key in CITY_DATA
  const altMarker = html.indexOf("'New York':");
  if (altMarker < 0) { console.error('Cannot find NYC data'); process.exit(1); }
  console.log('Found NYC inline at', altMarker);
}

// Since NYC data is JS-object style not JSON, we have to be careful.
// Find the opening [ after NYC_DATA or 'New York':
let arrStart;
if (start >= 0) {
  arrStart = html.indexOf('[', start);
} else {
  arrStart = html.indexOf('[', html.indexOf("'New York':"));
}
if (arrStart < 0) { console.error('No array found'); process.exit(1); }

// Walk the brackets to find the matching end
let depth = 0, arrEnd = arrStart;
let inStr = false, strCh = '', esc = false;
for (let i = arrStart; i < html.length; i++) {
  const c = html[i];
  if (esc) { esc = false; continue; }
  if (c === '\\' && inStr) { esc = true; continue; }
  if (inStr) { if (c === strCh) inStr = false; continue; }
  if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
  if (c === '[') depth++;
  if (c === ']') { depth--; if (depth === 0) { arrEnd = i + 1; break; } }
}

// The array is JS object literal notation, not JSON. We will NOT reparse.
// Instead, we'll insert new entries as JS object literals right before the closing ].
// First, detect existing names by scanning the slice.
const slice = html.slice(arrStart, arrEnd);

// Extract existing names via a safe regex on `name:"..."` or `name:'...'`
const nameRe = /name:\s*(["'])([^"']+)\1/g;
const existing = new Set();
let m;
while ((m = nameRe.exec(slice)) !== null) existing.add(m[2].toLowerCase());
console.log('NYC current spots (names parsed):', existing.size);

// Also get max ID by scanning id:<num>
const idRe = /\bid:\s*(\d+)/g;
let maxId = 0;
while ((m = idRe.exec(slice)) !== null) { const n = parseInt(m[1], 10); if (n > maxId) maxId = n; }
console.log('Max id:', maxId);

const additions = [
  {name:"Museum of Modern Art (MoMA)",cuisine:"Art Museum",neighborhood:"Midtown",score:92,price:3,tags:["Museum","Art","Tourist Attraction","Iconic","Landmark"],description:"The most influential modern art museum in the world, home to Van Gogh's Starry Night, Monet's Water Lilies, Picasso's Demoiselles d'Avignon, and Warhol's Campbell's Soup Cans. Six floors of masterpieces. The sculpture garden is a mid-Manhattan oasis. Free Friday evenings via UNIQLO sponsorship.",dishes:["Permanent Collection","Sculpture Garden","Film Screenings","Free Fridays"],address:"11 W 53rd St, New York, NY 10019",phone:"(212) 708-9400",lat:40.7614,lng:-73.9776,instagram:"themuseumofmodernart",website:"https://www.moma.org"},
  {name:"Whitney Museum of American Art",cuisine:"Art Museum",neighborhood:"Meatpacking District",score:88,price:3,tags:["Museum","Art","Tourist Attraction"],description:"Renzo Piano-designed museum dedicated exclusively to 20th and 21st-century American art. Edward Hopper, Georgia O'Keeffe, Jasper Johns, Basquiat. The outdoor terraces offer Hudson River and High Line views. The Biennial remains the most influential contemporary art exhibition in America.",dishes:["American Art","Biennial","Outdoor Terraces","Hudson Views"],address:"99 Gansevoort St, New York, NY 10014",phone:"(212) 570-3600",lat:40.7396,lng:-74.0089,instagram:"whitneymuseum",website:"https://whitney.org"},
  {name:"Solomon R. Guggenheim Museum",cuisine:"Art Museum",neighborhood:"Upper East Side",score:89,price:3,tags:["Museum","Art","Tourist Attraction","Iconic","Landmark"],description:"Frank Lloyd Wright's spiraling white rotunda — one of the 20th century's most important architectural landmarks — housing modern and contemporary art. Walking down the continuous ramp past Kandinsky, Chagall, and Picasso is itself the experience. A masterpiece building full of masterpieces.",dishes:["Rotunda","Modern Art","Iconic Architecture"],address:"1071 5th Ave, New York, NY 10128",phone:"(212) 423-3500",lat:40.7830,lng:-73.9590,instagram:"guggenheim",website:"https://www.guggenheim.org"},
  {name:"American Museum of Natural History",cuisine:"Museum",neighborhood:"Upper West Side",score:90,price:3,tags:["Museum","Tourist Attraction","Family","Landmark"],description:"34 million specimens across 26 interconnected buildings. The iconic dinosaur halls, the blue whale in the Hall of Ocean Life, the Rose Center for Earth and Space (Hayden Planetarium), and the Gilder Center's immersive science experiences. A full day — easily. Central Park's west neighbor.",dishes:["Dinosaur Halls","Blue Whale","Hayden Planetarium","Gilder Center"],address:"200 Central Park West, New York, NY 10024",phone:"(212) 769-5100",lat:40.7813,lng:-73.9740,instagram:"amnh",website:"https://www.amnh.org"},
  {name:"9/11 Memorial & Museum",cuisine:"Museum",neighborhood:"Financial District",score:93,price:3,tags:["Museum","Tourist Attraction","Landmark","Historic","Memorial"],description:"The twin reflecting pools mark the footprints of the original towers; the names of every victim are inscribed in bronze around their edges. Below, the museum tells the full story with artifacts including the Last Column and the Survivor Staircase. The most emotionally powerful museum experience in New York.",dishes:["Reflecting Pools","Survivor Tree","Museum","Last Column"],address:"180 Greenwich St, New York, NY 10007",phone:"(212) 312-8800",lat:40.7115,lng:-74.0134,instagram:"911memorial",website:"https://www.911memorial.org"},
  {name:"Intrepid Sea, Air & Space Museum",cuisine:"Museum",neighborhood:"Hell's Kitchen",score:85,price:3,tags:["Museum","Tourist Attraction","Family","Historic"],description:"The aircraft carrier USS Intrepid docked on the Hudson, now a military and maritime museum. Board the space shuttle Enterprise, walk through the Concorde, tour the submarine Growler. Exhibits cover the Cold War, space exploration, and naval aviation. Great for families and history buffs.",dishes:["USS Intrepid","Space Shuttle Enterprise","Concorde","Submarine"],address:"Pier 86, W 46th St, New York, NY 10036",phone:"(212) 245-0072",lat:40.7647,lng:-74.0005,instagram:"intrepidmuseum",website:"https://intrepidmuseum.org"},
  {name:"Summit One Vanderbilt",cuisine:"Observation Deck",neighborhood:"Midtown East",score:89,price:4,tags:["Tourist Attraction","Views","Photo Op","Iconic"],description:"The newest and most immersive observation experience in NYC, rising 1,401 feet above Grand Central. Floor-to-ceiling mirrored rooms (Air), glass skyboxes extending over 42nd Street (Ledge), and the Ascent glass elevator on the exterior. The most Instagrammed observatory in the city.",dishes:["Air Mirrored Room","Ledge Skyboxes","Ascent Elevator","Bar 1401"],address:"45 E 42nd St, New York, NY 10017",phone:"(877) 678-6648",lat:40.7527,lng:-73.9787,instagram:"summitov",website:"https://summitov.com"},
  {name:"Rockefeller Center",cuisine:"Tourist Attraction",neighborhood:"Midtown",score:89,price:0,tags:["Tourist Attraction","Iconic","Landmark","Free","Seasonal","Photo Op"],description:"The Art Deco complex anchoring midtown: Christmas tree lighting, the Rink at Rockefeller Center in winter, Channel Gardens, Radio City next door, Prometheus statue, and 30 Rock. Home to NBC Studios and the Today Show plaza. The beating heart of Manhattan's holiday season.",dishes:["The Rink","Tree Lighting","Channel Gardens","Today Show Plaza"],address:"45 Rockefeller Plaza, New York, NY 10111",phone:"(212) 588-8601",lat:40.7587,lng:-73.9787,instagram:"rockefellercenter",website:"https://www.rockefellercenter.com"},
  {name:"Bryant Park",cuisine:"Tourist Attraction",neighborhood:"Midtown",score:87,price:0,tags:["Tourist Attraction","Park","Free","Seasonal","Iconic"],description:"9.6-acre park behind the NY Public Library, the epicenter of midtown's social life. Free summer movies, fall lawn games, winter Ice Skating + European-style Holiday Shops. Chess, ping-pong, petanque, reading room. One of the most programmed public spaces in the world.",dishes:["Free Movies","Winter Ice Rink","Holiday Shops","Chess Tables"],address:"Bryant Park, New York, NY 10018",phone:"(212) 768-4242",lat:40.7536,lng:-73.9832,instagram:"bryantparknyc",website:"https://bryantpark.org"},
  {name:"Washington Square Park",cuisine:"Tourist Attraction",neighborhood:"Greenwich Village",score:86,price:0,tags:["Tourist Attraction","Park","Free","Iconic","Landmark"],description:"Greenwich Village's living room, anchored by the iconic Washington Arch. Street musicians, chess players, NYU students, and dog-walkers orbit the central fountain. Best people-watching in NYC. The Halloween parade passes through every year. Free, open 24/7.",dishes:["Washington Arch","Fountain","Street Performers","Chess"],address:"Washington Square N, New York, NY 10012",phone:"",lat:40.7308,lng:-73.9973,instagram:"",website:"https://www.nycgovparks.org/parks/washington-square-park"},
  {name:"Prospect Park",cuisine:"Tourist Attraction",neighborhood:"Park Slope",score:88,price:0,tags:["Tourist Attraction","Park","Free","Outdoor","Family"],description:"Olmsted and Vaux's 526-acre Brooklyn masterpiece — the same team that designed Central Park, and the one they considered their finest work. Long Meadow, the Boathouse, the Brooklyn Botanic Garden (adjacent), the Zoo, Smorgasburg in season. Brooklyn's answer to Central Park, and many argue, its better.",dishes:["Long Meadow","Boathouse","Brooklyn Botanic Garden","Zoo"],address:"95 Prospect Park West, Brooklyn, NY 11215",phone:"(718) 965-8951",lat:40.6602,lng:-73.9690,instagram:"prospect_park",website:"https://www.prospectpark.org"},
  {name:"Chelsea Market",cuisine:"Tourist Attraction",neighborhood:"Chelsea",score:88,price:1,tags:["Tourist Attraction","Food Hall","Iconic","Landmark"],description:"The former Nabisco factory (where the Oreo was invented in 1912) turned into NYC's most iconic food hall. Los Tacos No. 1, Lobster Place, Miznon, Fat Witch, Jacques Torres. 35+ vendors, brick arches, industrial lighting. Connected to the High Line. Always packed, always worth it.",dishes:["Los Tacos No. 1","Lobster Place","Miznon","Food Hall"],address:"75 9th Ave, New York, NY 10011",phone:"(212) 652-2110",lat:40.7424,lng:-74.0061,instagram:"chelseamarketny",website:"https://www.chelseamarket.com"},
];

// Filter out anything already present
const toAdd = additions.filter(a => {
  if (existing.has(a.name.toLowerCase())) { console.log('  SKIP (exists):', a.name); return false; }
  return true;
});
if (!toAdd.length) { console.log('Nothing to add.'); process.exit(0); }

// Build the JS object literal entries (not JSON — keys unquoted to match NYC_DATA style)
// But to be safe, we'll write in JSON form — it's still valid JS.
let nextId = maxId + 1;
const entries = toAdd.map(a => {
  const obj = {
    id: nextId++, name: a.name, phone: a.phone || '', cuisine: a.cuisine,
    neighborhood: a.neighborhood, score: a.score, price: a.price || 0,
    tags: a.tags, indicators: [], hh: '', reservation: 'walk-in',
    awards: '', description: a.description, dishes: a.dishes || [],
    address: a.address, hours: '', lat: a.lat, lng: a.lng,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: false, group: '', instagram: a.instagram || '', website: a.website || '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: 5,
  };
  return JSON.stringify(obj);
}).join(',');

// Insert entries before the closing ]
// Find position of last non-whitespace char before arrEnd (the closing ])
let insertPos = arrEnd - 1; // position of ]
// Scan backward for non-whitespace
let before = insertPos - 1;
while (before > arrStart && /\s/.test(html[before])) before--;
const insertText = (html[before] === ',' || html[before] === '[') ? entries : ',' + entries;

html = html.slice(0, insertPos) + insertText + html.slice(insertPos);
fs.writeFileSync(file, html);
console.log(`\n✅ Added ${toAdd.length} NYC attractions.`);
toAdd.forEach(a => console.log('  ADDED:', a.name));
