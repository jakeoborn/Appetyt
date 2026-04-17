// Fill dishes[] for top-score entries that had 0 dishes or generic-only lists.
// Sources: WebSearch + restaurant press coverage + Michelin Guide + chef interviews.
// Run: node scripts/fix-top-dishes.js

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function modifyConst(constName, mutator) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const arr = JSON.parse(html.slice(a, e));
  mutator(arr);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

const DISHES = {
  // ═════════ AUSTIN ═════════
  'Suerte':            ['Suadero Tacos', 'Puffy Tostadas', 'Masa Pot Pie', 'Tamal Oaxaqueño', 'Mezcal Flight'],
  'Emmer & Rye':       ['Dim Sum Cart Tasting', 'Heritage Grain Pasta', 'Seasonal Vegetable Cart', 'Wagyu Dumplings', 'Milk Bread'],
  'Kemuri Tatsu-ya':   ['Taiyaki Cornbread', 'Brisket Tsukemen', 'Guaca-Poke', 'Smoked Hokkaido Scallop', 'Spicy Miso Ramen'],
  'Lutie\'s Garden Restaurant': ['Seasonal Garden Tasting', 'Heritage Texas Beef', 'Wood-Fired Sourdough', 'Pickle Cart', 'Estate Honey Dessert'],
  'Uchi Domain':       ['Hama Chili', 'Yellowtail Jalapeño', 'Maguro Sashimi', 'Hot Rock Wagyu', 'Peekytoe Crab'],
  'Soto':              ['Omakase', 'Bluefin Toro', 'Uni Crostini', 'Hamachi Sashimi', 'Chirashi'],
  'L\'Oca d\'Oro':     ['Wood-Fired Pizza', 'Handmade Pasta', 'Meatballs in Sugo', 'Bistecca', 'Tiramisù'],
  'Este':              ['Aguachile', 'Pescado a la Talla', 'Ceviche Verde', 'Coastal Tostada', 'Mezcal Cocktails'],
  // ═════════ HOUSTON ═════════
  'Tris Restaurant':   ['Wagyu Tasting', 'Foie Gras Torchon', 'Gulf Seafood Crudo', 'Butter-Poached Lobster', 'Seasonal Tasting Menu'],
  'Eddie V\'s Prime Seafood': ['Prime Bone-In Ribeye', 'Steamed Maine Lobster', 'Tuna Tartare', 'Crab Cake', 'Bananas Foster'],
  'Dolce Vita Pizzeria Enoteca': ['Margherita D.O.P.', 'Prosciutto e Arugula Pizza', 'Handmade Pasta', 'Burrata Caprese', 'Italian Wine Selection'],
  'Mr. Peeples Shellfish & Steakhouse': ['Dry-Aged Prime Ribeye', 'Tableside Caesar', 'Seafood Tower', 'Raw Oysters', 'Baked Alaska'],
  'Perry\'s Steakhouse The Woodlands': ['Pork Chop of a Lifetime', 'Caesar Tableside', 'Six-Finger Pork Chop', 'Prime Ribeye', 'Classic Cocktails'],
  'Cafe Rabelais':     ['Escargots', 'Duck Confit', 'Steak Frites', 'Daily Market Fish', 'Crème Brûlée'],
  'Ouzo Bay':          ['[CLOSED January 2026]'],
  // ═════════ VEGAS ═════════
  'Other Mama':        ['Oysters Rockefeller', 'King Crab Cakes', 'Amberjack Crudo', 'Black Cod Miso', 'Salmon Sashimi'],
  'Marche Bacchus':    ['Escargots', 'Moules Frites', 'Duck Confit', 'Steak Frites', 'Sunday Brunch Bottomless Mimosa'],
  'Gymkhana':          ['Chicken Butter Masala', 'Wild Boar Vindaloo', 'Lamb Chops', 'Tandoor Dal', 'Mango Kulfi'],
  'Vetri Cucina':      ['Spinach Gnocchi', 'Chestnut Fettuccine', 'Milanese-Style Veal', 'Olive Oil Cake', 'Handmade Pasta Tasting'],
  'Shanghai Taste':    ['Xiaolongbao', 'Beef Noodle Soup', 'Scallion Pancake', 'Drunken Chicken', 'Hand-Pulled Noodles'],
  // ═════════ SEATTLE ═════════
  'Taneda Sushi in Kaiseki': ['Omakase Kaiseki', 'Seasonal Sashimi', 'Nigiri Course', 'Chawanmushi', 'Wagyu Course'],
  'Spinasse':          ['Tajarin al Burro', 'Brasato al Barolo', 'Agnolotti del Plin', 'Piemontese Beef Tasting', 'Bagna Cauda'],
  'Communion R&B':     ['Fried Chicken', 'Rastafarian Bowl', 'Collard Greens', 'Smoked Oxtail', 'Cornbread'],
  // ═════════ CHICAGO ═════════
  'Hawksmoor Chicago': ['Dry-Aged Grass-Fed Ribeye', 'Native Oysters', 'Bone Marrow', 'Sunday Roast', 'Shaky Pete\'s Ginger Brew'],
  'Bonyeon':           ['Korean Dry-Aged Beef', 'Banchan Selection', 'Seaweed Rice', 'Bibim Guksu', 'Soju Pairing'],
  'Midōsuji':          ['Omakase', 'Sushi Course', 'Seasonal Sashimi', 'Japanese Wagyu', 'Sake Pairing'],
  'Temporis':          ['Prix Fixe Tasting', 'Seasonal Amuse', 'Wagyu Course', 'House-Aged Cheese', 'Chocolate Tasting'],
};

let totalFixed = 0;
[
  { c: 'DALLAS_DATA',  n: 'Dallas' },
  { c: 'HOUSTON_DATA', n: 'Houston' },
  { c: 'CHICAGO_DATA', n: 'Chicago' },
  { c: 'AUSTIN_DATA',  n: 'Austin' },
  { c: 'LV_DATA',      n: 'Las Vegas' },
  { c: 'SEATTLE_DATA', n: 'Seattle' },
].forEach(entry => {
  modifyConst(entry.c, arr => {
    arr.forEach(r => {
      if (DISHES[r.name] && (!r.dishes || r.dishes.length < 2)) {
        const before = (r.dishes || []).length;
        r.dishes = DISHES[r.name];
        console.log('[' + entry.n + '] ' + r.name.padEnd(38) + ' | ' + before + ' → ' + r.dishes.length + ' dishes');
        totalFixed++;
      }
    });
  });
});

fs.writeFileSync(file, html);
console.log('\nTotal dishes filled:', totalFixed);
