// Audit all Michelin-starred and high-score restaurants for data accuracy
// Flags restaurants where description might be fabricated
// Run: node scripts/audit-michelin-accuracy.js

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function parseArray(tag) {
  const s = html.indexOf(tag); if (s === -1) return [];
  const a = html.indexOf('[', s); let d=0, e=a;
  for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  try { return JSON.parse(html.slice(a,e)); } catch(e) { return []; }
}
function parseChicago() {
  const ci = html.indexOf("'Chicago': [", html.indexOf('const CITY_DATA'));
  if(ci===-1)return[];const ca=html.indexOf('[',ci+10);let d=0,e=ca;
  for(let i=ca;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  try{return JSON.parse(html.slice(ca,e));}catch(e){return[];}
}

const cities = {
  'Dallas': parseArray('const DALLAS_DATA'),
  'NYC': parseArray('const NYC_DATA'),
  'Houston': parseArray('const HOUSTON_DATA'),
  'Austin': parseArray('const AUSTIN_DATA'),
  'Chicago': parseChicago(),
  'SLC': parseArray('const SLC_DATA='),
};

// Check all restaurants with score >= 93 or awards containing "Michelin"
console.log('=== HIGH-SCORE & MICHELIN RESTAURANT AUDIT ===\n');

for (const [cityName, data] of Object.entries(cities)) {
  const flagged = data.filter(r =>
    r.score >= 95 ||
    (r.awards && r.awards.toLowerCase().includes('michelin')) ||
    (r.awards && r.awards.toLowerCase().includes('james beard'))
  );

  if (flagged.length === 0) continue;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${cityName} — ${flagged.length} flagged for review`);
  console.log(`${'='.repeat(50)}`);

  flagged.sort((a,b) => b.score - a.score).forEach(r => {
    // Flag potential issues
    const issues = [];

    // Check for generic/suspicious chef names
    if (r.description && r.description.match(/Chef [A-Z][a-z]+ [A-Z][a-z]+/) && !r.awards) {
      issues.push('VERIFY chef name');
    }

    // Check if description mentions specific awards not in awards field
    if (r.description && r.description.toLowerCase().includes('michelin') && !r.awards) {
      issues.push('Description mentions Michelin but awards field empty');
    }

    // Check for very short descriptions
    if (r.description && r.description.length < 50) {
      issues.push('Very short description');
    }

    // Check for suspiciously specific claims
    if (r.description && r.description.match(/\d+-course|\d+ seats?|since \d{4}/)) {
      issues.push('VERIFY specific claims (seats, courses, year)');
    }

    console.log(`\n  ${r.name} (score: ${r.score})`);
    console.log(`  Cuisine: ${r.cuisine}`);
    console.log(`  Neighborhood: ${r.neighborhood}`);
    console.log(`  Awards: ${r.awards || 'none'}`);
    console.log(`  Description: ${(r.description || '').substring(0, 120)}...`);
    if (issues.length) {
      console.log(`  ⚠️  ${issues.join(' | ')}`);
    }
  });
}
