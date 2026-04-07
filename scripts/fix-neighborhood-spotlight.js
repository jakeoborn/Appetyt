const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// Replace neighborhood spotlight onclick handlers to use setNeighborhood
// which triggers the rich detail card
const hoods = ['East Village','West Village','Williamsburg','Lower East Side','SoHo','Chinatown','Harlem','Bronx'];

hoods.forEach(hood => {
  const old = "S.neighborhood='" + hood + "';A.tab('home')";
  const newClick = "A.setNeighborhood('" + hood + "');A.tab('home')";
  if(h.includes(old)){
    h = h.replace(old, newClick);
    console.log('Fixed:', hood);
  }
});

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done');
