// Clear website field on Miami cards with confirmed dead URLs
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const dead = require('./data/miami-url-dead.json');
const deadIds = new Set(dead.map(d => d.id));

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));

let cleared = 0;
const audit = [];
for (const c of arr) {
  if (deadIds.has(c.id) && c.website) {
    audit.push({id:c.id, name:c.name, was:c.website});
    c.website = '';
    cleared++;
  }
}

lines[idx] = `const MIAMI_DATA=${JSON.stringify(arr)};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
fs.writeFileSync(path.join(__dirname,'data','miami-cleared-urls.json'), JSON.stringify(audit, null, 2));

console.log(`Cleared website on ${cleared} cards`);
console.log(`Audit log → scripts/data/miami-cleared-urls.json`);
