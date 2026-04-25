const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';
const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));

const queries = ['Deuce','Hideaway','Sweet Liberty','Beaker','Anderson','Treehouse','El Tucan','Gramps','Wood Tavern','Las Rosas','Boxelder','Lagniappe','Pubbelly','Esotico','Sweet Liberty'];
console.log('=== Cards matching dive-bar query terms ===');
for (const c of arr) {
  for (const q of queries) {
    if (c.name.toLowerCase().includes(q.toLowerCase())) {
      console.log(`  ${c.id} ${c.name} | tags=${JSON.stringify(c.tags||[])} | ind=${JSON.stringify(c.indicators||[])}`);
      break;
    }
  }
}
