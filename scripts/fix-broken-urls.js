// Clear all ENOTFOUND (truly broken) website URLs
// These are domains that don't exist — likely fabricated URLs
// Run: node scripts/fix-broken-urls.js

const fs = require('fs');
const report = JSON.parse(fs.readFileSync('scripts/broken-links-report.json', 'utf8'));
let html = fs.readFileSync('index.html', 'utf8');

// Get all ENOTFOUND URLs (domain doesn't exist)
const broken = report.issues
  .filter(i => i.type === 'website' && i.error && i.error.includes('ENOTFOUND'))
  .map(i => i.url);

console.log('ENOTFOUND URLs to clear:', broken.length);

let cleared = 0;
for (const url of broken) {
  const pattern = '"website":"' + url + '"';
  if (html.includes(pattern)) {
    html = html.replace(pattern, '"website":""');
    cleared++;
  }
}

// Also clear certificate expired URLs
const certBroken = report.issues
  .filter(i => i.type === 'website' && i.error && (i.error.includes('certificate') || i.error.includes('EPROTO')))
  .map(i => i.url);

console.log('Certificate/SSL URLs to clear:', certBroken.length);

let certCleared = 0;
for (const url of certBroken) {
  const pattern = '"website":"' + url + '"';
  if (html.includes(pattern)) {
    html = html.replace(pattern, '"website":""');
    certCleared++;
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nCleared', cleared, 'ENOTFOUND URLs');
console.log('Cleared', certCleared, 'certificate/SSL URLs');
console.log('Total cleared:', cleared + certCleared);
console.log('\nThese restaurants now have empty website fields.');
console.log('Correct URLs should be looked up and added in future sessions.');
