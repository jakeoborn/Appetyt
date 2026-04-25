// Miami batch 1: append 8 verified cards to MIAMI_DATA on line 28445.
// Run with: node scripts/miami-batch-1.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
const LINE_NO = 28445; // 1-indexed
const PREFIX = 'const MIAMI_DATA=';

const DEFAULTS = {
  phone:'', bestOf:[], busyness:null, waitTime:null, popularTimes:null,
  lastUpdated:null, trending:false, group:'', suburb:false,
  reserveUrl:'', menuUrl:'', indicators:[], hh:'', awards:'', photoUrl:''
};

const NEW_CARDS = [
  {
    id:4115, name:"The Broken Shaker", cuisine:"Cocktail Bar",
    neighborhood:"Mid Beach", score:93, price:3,
    tags:["Cocktails","Iconic","Awards","Scene","Date Night","Hotel Bar","North America Top 50 Bar"],
    description:"James Beard Outstanding Bar winner tucked in the courtyard of the Freehand — Gabe Orta and Elad Zvi's tropical, herb-garden-fed cocktail program rebuilt the genre when it landed in 2012. Still the city's bartenders' bar.",
    dishes:["Daily Punch","Mezcal Sour","Negroni Sbagliato","Tropical Highball","27 Restaurant Snacks"],
    address:"2727 Indian Creek Dr, Miami Beach FL 33140", lat:25.8045, lng:-80.1263,
    website:"https://thefreehand.com/miami/eat-drink/the-broken-shaker", instagram:"@brokenshaker",
    hours:"Daily 5pm-3am", reservation:"walk-in",
    awards:"James Beard Outstanding Bar Program 2015, World's 50 Best Bars"
  },
  {
    id:4116, name:"The Living Room by Cipriani", cuisine:"Italian",
    neighborhood:"Brickell", score:89, price:4,
    tags:["Italian","Scene","Date Night","Cocktails","Hotel Restaurant","Brunch"],
    description:"The Cipriani family's first Miami venture — a velvet-and-mahogany salon serving the same Bellinis and Carpaccio that built the Venice original. Made for slow lunches that bleed into longer evenings.",
    dishes:["Beef Carpaccio","Tagliolini Gratinati","Baked Tagliolini with Ham","Bellini","Vanilla Meringue Cake"],
    address:"60 SW 13th St, Miami FL 33130", lat:25.7611, lng:-80.1945,
    website:"https://www.cipriani.com/restaurants/the-living-room",
    instagram:"@cipriani", hours:"Lunch & Dinner daily", reservation:"SevenRooms",
    photoUrl:"https://static.wixstatic.com/media/e82fdb_96afcdccceef40c28fbc0f357755d6c6~mv2.jpg/v1/fit/w_2500,h_1330,al_c/e82fdb_96afcdccceef40c28fbc0f357755d6c6~mv2.jpg"
  },
  {
    id:4117, name:"Daniel's Miami", cuisine:"Steakhouse / French",
    neighborhood:"Coral Gables", score:92, price:4,
    tags:["Steakhouse","French","Fine Dining","Date Night","Hotel Restaurant","Critics Pick"],
    description:"Daniel Boulud's first Florida restaurant — a French-American chophouse at the THesis Hotel that treats dry-aged beef with the same precision he brings to roast chicken. Old-school cart service, a serious cellar.",
    dishes:["Côte de Boeuf","DB Burger","Coq au Vin","Steak Tartare","Madame Daniel"],
    address:"1350 S Dixie Hwy, Coral Gables FL 33146", lat:25.7130, lng:-80.2783,
    website:"https://danielsmiami.com", instagram:"@danielsmiami",
    hours:"Dinner daily", reservation:"OpenTable"
  },
  {
    id:4118, name:"Slim's Bal Harbour", cuisine:"Steakhouse",
    neighborhood:"Bal Harbour", score:90, price:4,
    tags:["Steakhouse","Scene","Date Night","Cocktails","New"],
    description:"Michael Mina's Bal Harbour steakhouse, named for his nickname — a chrome-and-leather room set above the luxury concourse where the martinis are stirred tableside.",
    dishes:["Tomahawk for Two","Lobster Pot Pie","Maine Lobster Roll","Caviar Service","Slim's Wedge"],
    address:"9700 Collins Ave, Bal Harbour FL 33154", lat:25.8882, lng:-80.1250,
    website:"https://slimsbalharbour.com", instagram:"@slimsbalharbour",
    hours:"Dinner daily", reservation:"OpenTable"
  },
  {
    id:4119, name:"Pastis Miami", cuisine:"French Bistro",
    neighborhood:"Wynwood", score:91, price:3,
    tags:["French","Scene","Date Night","All-Day","Brunch","Critics Pick"],
    description:"Keith McNally's faithful Miami transplant of the Manhattan original — zinc bar, mosaic tile, steak frites for everyone. The first place in Wynwood that feels like it could've existed for fifty years.",
    dishes:["Steak Frites","Roast Chicken for Two","Pastis Burger","Trout Amandine","Île Flottante"],
    address:"380 NW 26th St, Miami FL 33127", lat:25.8011, lng:-80.2019,
    website:"https://pastismiami.com", instagram:"@pastis_miami",
    hours:"Brunch, Lunch & Dinner daily", reservation:"Resy"
  },
  {
    id:4120, name:"Jaguar Sun", cuisine:"Cocktail Bar / Pasta",
    neighborhood:"Downtown Miami", score:91, price:3,
    tags:["Cocktails","Pasta","Date Night","Critics Pick","Late Night","Local Favorites"],
    description:"Downtown's most quietly perfect bar — Carey Hynes' cocktails, Will Thompson's pasta, and a corridor of a room that looks designed for long single-malt confessions.",
    dishes:["Cacio e Pepe","Bucatini all'Amatriciana","Smashburger","Negroni Bianco","Mai Tai"],
    address:"230 NE 4th St, Miami FL 33132", lat:25.7776, lng:-80.1896,
    website:"https://jaguarsun.com", instagram:"@jaguarsunmiami",
    hours:"Dinner Tue-Sat", reservation:"Resy"
  },
  {
    id:4121, name:"Tâm Tâm", cuisine:"Vietnamese",
    neighborhood:"Brickell", score:89, price:2,
    tags:["Vietnamese","Critics Pick","Local Favorites","Casual","Date Night","Late Night"],
    description:"Will Thompson and Harrison Ramhofer's love letter to late-night Vietnamese cooking — fluorescent-cool, tile-floor, dishes that taste like they've been refined for a decade.",
    dishes:["Phở Bò","Tamarind Crab","Caramel Pork","Tâm Tâm Wings","Vietnamese Iced Coffee"],
    address:"259 SW 13th St, Miami FL 33130", lat:25.7617, lng:-80.1985,
    website:"https://tamtammiami.com", instagram:"@tamtammiami",
    hours:"Dinner Tue-Sat", reservation:"Resy"
  },
  {
    id:4122, name:"Carbone Vino", cuisine:"Italian Wine Bar",
    neighborhood:"Coral Gables", score:89, price:4,
    tags:["Italian","Wine Bar","Date Night","Scene","Critics Pick","New"],
    description:"Major Food Group's wine-bar counterpart to Carbone — the same red-sauce-and-tuxedos bravado, sized down to a marble counter and a list deep enough to end conversations.",
    dishes:["Veal Parm Sandwich","Tortellini in Brodo","Tomato & Stracciatella","Beef Carpaccio","Affogato"],
    address:"49 Alhambra Plaza, Coral Gables FL 33134", lat:25.7525, lng:-80.2557,
    website:"https://carbonevino.com", instagram:"@carbonevino",
    hours:"Dinner daily", reservation:"Resy"
  }
];

// Read file
const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const idx = LINE_NO - 1;
const line = lines[idx];

if (!line.startsWith(PREFIX)) {
  console.error(`Line ${LINE_NO} does not start with ${PREFIX}. Got: ${line.slice(0,80)}`);
  process.exit(1);
}

// Parse
const arrStart = line.indexOf('=[') + 1;
const arrEndMarker = line.lastIndexOf('];');
if (arrEndMarker < 0) { console.error('No closing ];'); process.exit(1); }
const arr = JSON.parse(line.slice(arrStart, arrEndMarker + 1));

console.log('Before:', arr.length, 'cards');

// Validate IDs don't collide
const existingIds = new Set(arr.map(c => c.id));
for (const c of NEW_CARDS) {
  if (existingIds.has(c.id)) {
    console.error('ID collision:', c.id, c.name);
    process.exit(1);
  }
}

// Validate names don't duplicate
const existingNames = new Set(arr.map(c => c.name.toLowerCase()));
for (const c of NEW_CARDS) {
  if (existingNames.has(c.name.toLowerCase())) {
    console.error('Name duplicate:', c.name);
    process.exit(1);
  }
}

// Merge defaults + card, preserving existing card field order
const SAMPLE_KEYS = Object.keys(arr[0]);

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of SAMPLE_KEYS) {
    out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  }
  // Add any card keys not in SAMPLE_KEYS (e.g. photoUrl wasn't in first card)
  for (const k of Object.keys(card)) {
    if (!(k in out)) out[k] = card[k];
  }
  return out;
});

const newArr = [...arr, ...merged];
console.log('After:', newArr.length, 'cards');

// Rebuild line
const newLine = `const MIAMI_DATA=${JSON.stringify(newArr)};`;
lines[idx] = newLine;

// Write
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', newArr.length - arr.length, 'new cards. New length:', newArr.length);
console.log('IDs added:', merged.map(c => c.id).join(','));
