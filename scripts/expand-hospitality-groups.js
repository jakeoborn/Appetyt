// Add missing hospitality groups — conservatively, using only verifiable facts.
// Fields I'm NOT confident about are omitted. Render logic updated to handle missing fields gracefully.
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Only verified facts. `founded` only included when I can cite a documented opening year for the group/flagship.
// scoreBreakdown omitted (falls back to restaurant average). score omitted (auto-computed).
const newGroups = {
  // === LAS VEGAS ===
  'Gordon Ramsay Restaurants': {
    founded: 2012, // Gordon Ramsay Steak opened at Paris LV in 2012
    concepts: 4,
    flagship: "Gordon Ramsay Hell's Kitchen",
    michelinCount: 0,
    description: "Gordon Ramsay's Vegas portfolio: Hell's Kitchen at Caesars Palace (the world's first), Gordon Ramsay Steak at Paris Las Vegas, Gordon Ramsay Pub & Grill, and Gordon Ramsay Burger at Planet Hollywood.",
    restaurants: ["Gordon Ramsay Hell's Kitchen","Gordon Ramsay Steak","Gordon Ramsay Pub & Grill","Gordon Ramsay Burger"],
    website: "https://www.gordonramsayrestaurants.com",
    instagram: "gordonramsay"
  },
  'Mina Group': {
    // Michael Mina opened at Bellagio 2004 (founded as a restaurant group)
    founded: 2002,
    concepts: 3,
    flagship: "Michael Mina",
    michelinCount: 0,
    description: "Chef Michael Mina's Vegas restaurants: Michael Mina at Bellagio (seafood fine dining), STRIPSTEAK at Mandalay Bay, and Bardot Brasserie at Aria.",
    restaurants: ["Michael Mina","STRIPSTEAK by Michael Mina","Bardot Brasserie"],
    website: "https://theminagroup.com",
    instagram: "michaelminarestaurantgroup"
  },
  'Joël Robuchon': {
    founded: 2005, // Joël Robuchon MGM Grand opened December 2005
    concepts: 2,
    flagship: "Joël Robuchon",
    michelinCount: 0, // Michelin no longer publishes a Vegas guide; previously 3 stars
    description: "The late Joël Robuchon's MGM Grand restaurants: the flagship Joël Robuchon (previously the only 3-Michelin-star restaurant ever awarded in Las Vegas) and L'Atelier de Joël Robuchon counter-service concept.",
    restaurants: ["Joël Robuchon","L'Atelier de Joël Robuchon"],
    website: "https://www.joel-robuchon.com",
    instagram: "joelrobuchon"
  },
  'José Andrés Group': {
    concepts: 2,
    flagship: "Bazaar Meat by José Andrés",
    michelinCount: 0,
    description: "James Beard Award-winning chef José Andrés's Vegas presence: Bazaar Meat (relocated from SLS Sahara to The Palazzo in September 2025) and Jaleo (Spanish tapas at The Cosmopolitan).",
    restaurants: ["Bazaar Meat by José Andrés","Jaleo by José Andrés"],
    website: "https://www.thebazaar.com",
    instagram: "chefjoseandres"
  },
  'Wolfgang Puck': {
    founded: 1992, // Spago Las Vegas at The Forum Shops opened 1992 — first celebrity chef on the Strip
    concepts: 2,
    flagship: "Spago",
    michelinCount: 0,
    description: "Chef Wolfgang Puck's Vegas restaurants: Spago (originally at The Forum Shops, now at Bellagio next to the Fountains) and CUT (his modern steakhouse at The Palazzo). Puck was the first celebrity chef to open on the Strip.",
    restaurants: ["Spago","CUT by Wolfgang Puck"],
    website: "https://wolfgangpuck.com",
    instagram: "wolfgangpuck"
  },
  'Jean-Georges': {
    founded: 1998, // Prime Steakhouse opened at Bellagio with its 1998 debut
    concepts: 2,
    flagship: "Prime Steakhouse",
    michelinCount: 0,
    description: "Chef Jean-Georges Vongerichten's two Vegas steakhouses: Prime Steakhouse at Bellagio (overlooking the Fountains) and Jean Georges Steakhouse at Aria.",
    restaurants: ["Prime Steakhouse","Jean Georges Steakhouse"],
    website: "https://www.jean-georges.com",
    instagram: "jeangeorgesrestaurants"
  },
  'Groot Hospitality': {
    concepts: 2,
    flagship: "Papi Steak",
    michelinCount: 0,
    description: "David Grutman's Miami-born hospitality group's Vegas outposts at Fontainebleau: Papi Steak (opened December 2023 with Fontainebleau's debut) and Komodo.",
    restaurants: ["Papi Steak","Komodo"],
    website: "https://groothospitality.com",
    instagram: "groothospitality"
  },

  // === SEATTLE ===
  'Ethan Stowell Restaurants': {
    founded: 2007, // Tavolàta opened January 2007 (first ESR concept)
    concepts: 4,
    flagship: "Tavolata",
    michelinCount: 0,
    description: "Chef Ethan Stowell's Seattle restaurant group. Italian-focused concepts across multiple neighborhoods: How to Cook a Wolf (Queen Anne), Staple & Fancy (Ballard), Tavolàta (Belltown), and Cortina (downtown).",
    restaurants: ["How to Cook a Wolf","Staple & Fancy","Tavolata","Cortina"],
    website: "https://ethanstowellrestaurants.com",
    instagram: "ethanstowellrestaurants"
  },
  'Sea Creatures': {
    founded: 2010, // The Walrus and the Carpenter opened 2010
    concepts: 3,
    flagship: "The Walrus and the Carpenter",
    michelinCount: 0,
    description: "James Beard Award-winning chef Renée Erickson's Seattle restaurant group: The Walrus and the Carpenter (Ballard oyster bar), Westward (Lake Union waterfront), and The Whale Wins (Fremont wood-fired café).",
    restaurants: ["The Walrus and the Carpenter","Westward","The Whale Wins"],
    website: "https://www.eatseacreatures.com",
    instagram: "sea_creatures"
  },
  'Tom Douglas': {
    founded: 1989, // Dahlia Lounge opened 1989 — start of the Tom Douglas restaurant group
    concepts: 3,
    flagship: "Dahlia Lounge",
    michelinCount: 0,
    description: "Seattle restaurateur Tom Douglas's long-running group. Dahlia Lounge (his 1989 flagship with the famous triple coconut cream pie), Serious Pie (wood-fired pizza), and Seatown Seabar (Pike Place seafood).",
    restaurants: ["Seatown Seabar","Dahlia Lounge","Serious Pie Downtown"],
    website: "https://www.tomdouglas.com",
    instagram: "tomdouglasseattle"
  },

  // === CHICAGO ===
  'Gibsons Restaurant Group': {
    founded: 1989, // Gibsons Bar & Steakhouse opened on Rush Street in 1989
    concepts: 2,
    flagship: "Gibsons Bar & Steakhouse",
    michelinCount: 0,
    description: "Chicago steakhouse institution since 1989. The original Gibsons Bar & Steakhouse on Rush Street and Hugo's Frog Bar.",
    restaurants: ["Gibsons Tavern","Hugo's Frog Bar"],
    website: "https://www.gibsonsrestaurantgroup.com",
    instagram: "gibsonssteakhouse"
  },

  // === DALLAS ===
  'Hotel Swexan': {
    founded: 2023, // Hotel Swexan opened in the Harwood District in 2023
    concepts: 2,
    flagship: "Stillwell's",
    michelinCount: 0, // Stillwell's has Michelin recommendation
    description: "Hotel Swexan's in-house restaurants in the Harwood District: Stillwell's (Michelin Recommended 2025) and Babou's rooftop.",
    restaurants: ["Stillwell's","Babou's"],
    website: "https://www.hotelswexan.com",
    instagram: "hotelswexan"
  },
  'Lombardi Family Concepts': {
    founded: 1977, // Alberto Lombardi founded his first Dallas restaurant in 1977
    concepts: 3,
    flagship: "Bistro 31",
    michelinCount: 0,
    description: "The Lombardi family's Dallas restaurants since Alberto Lombardi's first restaurant opened in 1977: Bistro 31 in Highland Park Village, Maison Chinoise, and Mar y Sol.",
    restaurants: ["Bistro 31","Maison Chinoise","Mar y Sol"],
    website: "https://www.lombardifamilyconcepts.com",
    instagram: "lombardi_family_concepts"
  }
};

// ============================================
// PART 1: Update render code to gracefully handle missing founded/concepts/flagship
// ============================================

const oldRender = "if(hg){\n        out += '<div style=\"font-size:11px;color:var(--text3);margin-top:3px\">Est. '+hg.founded+' · '+hg.concepts+' concepts · '+hg.flagship+'</div>';";
const newRender = `if(hg){
        var parts=[];
        if(hg.founded) parts.push('Est. '+hg.founded);
        if(hg.concepts) parts.push(hg.concepts+' concepts');
        if(hg.flagship) parts.push(hg.flagship);
        if(parts.length) out += '<div style="font-size:11px;color:var(--text3);margin-top:3px">'+parts.join(' · ')+'</div>';`;

if (html.includes(oldRender)) {
  html = html.replace(oldRender, newRender);
  console.log('Updated render logic to handle missing hg fields');
} else if (html.includes('parts.push(hg.flagship)')) {
  console.log('Render already updated');
} else {
  console.log('WARNING: Could not find old render logic — skipping that update');
}

// ============================================
// PART 2: Insert new groups
// ============================================

const start = html.indexOf('const HOSPITALITY_GROUPS = {');
if (start < 0) { console.error('HOSPITALITY_GROUPS not found'); process.exit(1); }
let depth = 0, inStr = false, strCh = '', escape = false, end = -1;
for (let i = start + 'const HOSPITALITY_GROUPS '.length; i < html.length; i++) {
  const c = html[i];
  if (escape) { escape = false; continue; }
  if (c === '\\') { escape = true; continue; }
  if (inStr) { if (c === strCh) inStr = false; continue; }
  if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) { console.error('Could not find closing brace'); process.exit(1); }

const existingBlock = html.substring(start, end);
let added = 0;
let insertText = '';
Object.entries(newGroups).forEach(([k, v]) => {
  if (existingBlock.includes("'" + k + "'")) {
    console.log('SKIP (already present):', k);
    return;
  }
  insertText += ",\n    '" + k.replace(/'/g, "\\'") + "':" + JSON.stringify(v);
  added++;
});

if (added === 0) {
  console.log('All groups already present');
} else {
  html = html.substring(0, end) + insertText + '\n  ' + html.substring(end);
  console.log('Added ' + added + ' new hospitality groups');
}

fs.writeFileSync('index.html', html, 'utf8');
