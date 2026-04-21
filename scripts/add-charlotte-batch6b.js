// Charlotte batch 6b — Burke Hospitality Group adds (Harper's, Mimosa Grill — high-confidence)
// + group-field updates on existing entries to assign the named hospitality-group ownership.
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const varName = 'CHARLOTTE_DATA';
const declStart = html.indexOf('const ' + varName + '=');
if (declStart < 0) { console.error(varName + ' not found'); process.exit(1); }
const open = html.indexOf('[', declStart);
let depth = 0, close = open;
for (let j = open; j < html.length; j++) {
  if (html[j] === '[') depth++;
  else if (html[j] === ']') { depth--; if (depth === 0) { close = j; break; } }
}
const sliceStart = open, sliceEnd = close + 1;
const data = eval(html.slice(sliceStart, sliceEnd));
const existingIds = data.map(r => r.id).filter(Number.isFinite);
let nextId = (existingIds.length ? Math.max(...existingIds) : 8000) + 1;

const base = { phone:'', bestOf:[], busyness:null, waitTime:null, popularTimes:null, lastUpdated:null, trending:false, suburb:false, reserveUrl:'', menuUrl:'' };

// ============ BURKE HOSPITALITY GROUP ADDS (high-confidence only) ============
const newRestaurants = [
  {...base,id:nextId++,name:"Harper's Restaurant — SouthPark",cuisine:"American",neighborhood:"SouthPark",score:84,price:3,tags:["American","Date Night","Local Favorites","Family Friendly","Iconic","Wood-Fired"],indicators:["iconic"],hh:"",reservation:"OpenTable",awards:"Burke Hospitality Group flagship",description:"Burke Hospitality's longstanding American restaurant in SouthPark — a wood-fired menu, BBQ baby-back ribs, and one of the most consistent neighborhood-anchor rooms in south Charlotte for over three decades.",dishes:["BBQ Baby Back Ribs","Wood-Fired Steak","Cedar Plank Salmon","Grilled Pizza"],address:"6518 Fairview Rd, Charlotte NC 28210",lat:35.1573,lng:-80.8413,website:"https://harpers.cafe",instagram:"@harpersclt",hours:"Lunch + Dinner daily, Brunch Sat-Sun",group:"Burke Hospitality"},
  {...base,id:nextId++,name:"Mimosa Grill",cuisine:"Southern / American",neighborhood:"Uptown",score:84,price:3,tags:["Southern","American","Date Night","Cocktails","Brunch","Local Favorites"],indicators:[],hh:"",reservation:"OpenTable",awards:"Burke Hospitality Group concept",description:"Burke Hospitality's Uptown Southern restaurant on South Tryon — a polished Southern menu, a brick courtyard patio, and a long-running role as one of Uptown's most consistent business-lunch rooms.",dishes:["Shrimp & Grits","Buttermilk Fried Chicken","Cornmeal Fried Oysters","Brunch Bottomless Mimosas"],address:"327 S Tryon St, Charlotte NC 28202",lat:35.2256,lng:-80.8425,website:"https://www.mimosagrill.com",instagram:"@mimosagrill",hours:"Lunch + Dinner daily, Brunch Sat-Sun",group:"Burke Hospitality"},
];

const existingNames = new Set(data.map(r => (r.name || '').toLowerCase()));
const added = newRestaurants.filter(r => !existingNames.has(r.name.toLowerCase()));
data.push(...added);

// ============ GROUP-FIELD UPDATES on existing entries ============
const groupAssignments = {
  // Rare Roots Hospitality
  'fin & fino':            'Rare Roots Hospitality',
  // FS Food Group (Frank Scibelli)
  'midwood smokehouse':    'FS Food Group',
  'mama ricotta\'s':       'FS Food Group',
  'soul gastrolounge':     'FS Food Group',
  'bossy beulah\'s chicken shack': 'FS Food Group',
  'yafo kitchen':          'FS Food Group',
  // Mac's Hospitality Group
  "mac's speed shop":      "Mac's Hospitality Group",
  // Moffett Restaurant Group
  'stagioni':              'Moffett Restaurant Group',
  'good food on montford': 'Moffett Restaurant Group',
  // Built on Hospitality
  'the goodyear house':    'Built on Hospitality',
  'folia':                 'Built on Hospitality',
  // 1957 Hospitality Group
  'the crunkleton':        '1957 Hospitality Group',
  "cheat's cheesesteaks":  '1957 Hospitality Group',
  // Tonidandel-Brown Restaurant Group
  'albertine':             'Tonidandel-Brown Restaurant Group',
  'supperland':            'Tonidandel-Brown Restaurant Group',
  "sophia's lounge":       'Tonidandel-Brown Restaurant Group',
  // Indigo Road Hospitality
  'indaco':                'Indigo Road Hospitality',
  'o-ku':                  'Indigo Road Hospitality',
  // 5th Street Group
  'la belle helene':       '5th Street Group',
  // Honeysuckle Hospitality / Sam Diminich
  'counter-':              'Counter (Sam Hart)',
  // Open Hospitality / Paul Verica
  'stanley':               'Stanley Hospitality (Paul Verica)',
  'sea level nc':          'Stanley Hospitality (Paul Verica)',
  'primefish cellar':      'Stanley Hospitality (Paul Verica)',
  'omakase experience by primefish': 'Stanley Hospitality (Paul Verica)',
};

let updated = 0;
for (const r of data) {
  const k = (r.name || '').toLowerCase();
  if (groupAssignments[k] && r.group !== groupAssignments[k]) {
    r.group = groupAssignments[k];
    updated++;
  }
}

console.log(`Charlotte: was ${data.length - added.length}, added ${added.length}, group-field updates: ${updated}`);
const serialized = JSON.stringify(data);
html = html.slice(0, sliceStart) + serialized + html.slice(sliceEnd);
fs.writeFileSync(HTML_PATH = 'index.html', html);
console.log('Total Charlotte entries:', data.length);
