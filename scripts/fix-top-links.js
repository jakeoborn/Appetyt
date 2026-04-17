// Fill website + Instagram on top-score entries with missing links.
// All URLs/handles verified via WebSearch 2026-04-17.
// Also marks confirmed-closed entries with indicators: ['closed'].
// Run: node scripts/fix-top-links.js

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

// name → { website?, instagram?, closed? }
const FIXES = {
  // Austin
  'Otoko':              { website: 'https://otokoaustin.com', instagram: 'otokoaustin' },
  'Uchi Domain':        { website: 'https://uchiaustin.com', instagram: 'uchirestaurants' },
  // Houston
  'Sushi Horiuchi':     { website: 'https://resy.com/cities/houston-tx/venues/sushi-horiuchi', instagram: 'sushihoriuchi' },
  'Houston Museum District': { website: 'https://www.visithoustontexas.com/about-houston/neighborhoods/museum-district/', instagram: 'houmuse' },
  'B&B Butchers Katy':  { instagram: 'bbbutchers' }, // Same brand IG; "Katy" location existence is ambiguous
  'One Fifth':          { closed: true },              // Closed March 2020 per Chris Shepherd
  // SLC
  'Valter\'s Downtown': { website: 'https://www.valtersosteria.com', instagram: 'valtersosteria' },
  'RIME':               { website: 'https://rimedeervalley.com', instagram: 'rimedeervalley' },
  // Vegas
  'Shanghai Taste':     { website: 'https://www.shanghaitastelv.com', instagram: 'shanghai_taste' },
  'Gymkhana':           { website: 'https://gymkhanarestaurants.com/lasvegas', instagram: 'gymkhanalasvegas' },
  'Vetri Cucina':       { website: 'https://www.vetricucinalv.com', instagram: 'vetricucinalv' },
  'Aureole':            { closed: true },               // Replaced by Orla
  'Cantina Contramar':  { website: 'https://www.fontainebleaulasvegas.com/dining/cantina-contramar', instagram: 'contramar_lv' },
  // Seattle
  'Communion R&B':      { website: 'https://www.communionseattle.com', instagram: 'communionseattle' },
  'Un Bien':            { website: 'https://www.unbienseattle.com', instagram: 'unbienseattle' },
};

let linkFixed = 0, closedFlagged = 0;
[
  'DALLAS_DATA', 'HOUSTON_DATA', 'CHICAGO_DATA', 'AUSTIN_DATA',
  'SLC_DATA', 'LV_DATA', 'SEATTLE_DATA',
].forEach(c => {
  modifyConst(c, arr => {
    arr.forEach(r => {
      const fix = FIXES[r.name];
      if (!fix) return;
      if (fix.closed) {
        if (!r.indicators) r.indicators = [];
        if (!r.indicators.includes('closed')) {
          r.indicators.push('closed');
          console.log('[' + c.replace('_DATA','') + '] CLOSED: ' + r.name);
          closedFlagged++;
        }
        return;
      }
      if (fix.website && !r.website) { r.website = fix.website; console.log('[' + c.replace('_DATA','') + '] +website: ' + r.name + ' → ' + fix.website); linkFixed++; }
      if (fix.instagram && !r.instagram) { r.instagram = fix.instagram; console.log('[' + c.replace('_DATA','') + '] +IG: ' + r.name + ' → @' + fix.instagram); linkFixed++; }
    });
  });
});

fs.writeFileSync(file, html);
console.log('\nLink fills:', linkFixed, '| Closed flags:', closedFlagged);
