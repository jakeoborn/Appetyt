const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function parseArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const arrS = m.index + m[0].length - 1;
  let d = 0, arrE = arrS;
  for (let j = arrS; j < html.length; j++) {
    if (html[j] === '[') d++;
    if (html[j] === ']') { d--; if (d === 0) { arrE = j + 1; break; } }
  }
  try { return JSON.parse(html.substring(arrS, arrE)); }
  catch (e) {
    try { return new Function('return ' + html.substring(arrS, arrE))(); }
    catch (e2) { return []; }
  }
}

function isAttraction(r) {
  if (!r) return false;
  const cu = String(r.cuisine || '').toLowerCase();
  const tags = (r.tags || []).map(t => String(t).toLowerCase());
  const name = String(r.name || '').toLowerCase();
  const LANDMARK = /\b(radio city|madison square garden|carnegie hall|forest hills stadium|kennedy center|hollywood bowl|moulin rouge|apollo theater)\b/;
  if (LANDMARK.test(name)) return true;
  if (cu.match(/museum|gallery|attraction|landmark|theater|theatre|cinema|bowling|arcade|gaming|aquarium|zoo|entertainment|sightseeing|observation|botanical|tourist/)) return true;
  if (cu === 'park') return true;
  if (cu.match(/\bpark\b/) && !cu.match(/grill|kitchen|restaurant|bar|pub/)) return true;
  if (tags.some(t => /museum|park|landmark|attraction|aquarium|zoo|activity|entertainment|sightseeing|tourist/.test(t))) return true;
  return false;
}

const cities = {
  'Dallas': 'const DALLAS_DATA',
  'Houston': 'const HOUSTON_DATA',
  'Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA',
  'Salt Lake City': 'const SLC_DATA',
  'Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA',
  'New York': 'const NYC_DATA',
};

// Extract existing thingsToDo names per city so we can skip dupes
function extractExistingThingsToDoNames(cityKey) {
  const re = new RegExp(`'${cityKey}':\\s*\\{[\\s\\S]*?thingsToDo:\\s*\\[([\\s\\S]*?)\\],\\s*\\n\\s*neighborhoods`);
  const m = html.match(re);
  if (!m) return [];
  const body = m[1];
  const names = [];
  const nameRe = /name\s*:\s*'([^']+)'/g;
  let nm;
  while ((nm = nameRe.exec(body)) !== null) names.push(nm[1]);
  return names;
}

const report = {};
Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  const atts = data.filter(isAttraction);
  const existingNames = extractExistingThingsToDoNames(city);
  const existingLower = new Set(existingNames.map(s => s.toLowerCase().replace(/\s+/g, ' ').trim()));

  // Filter attractions not already in thingsToDo
  const candidates = atts.filter(a => {
    const n = String(a.name).toLowerCase().replace(/\s+/g, ' ').trim();
    // Also skip exact substring matches on either side
    for (const ex of existingLower) {
      if (n === ex) return false;
      if (n.includes(ex) || ex.includes(n)) return false;
    }
    return true;
  });

  // Sort by score desc
  candidates.sort((a, b) => (b.score || 0) - (a.score || 0));

  report[city] = {
    totalAttractions: atts.length,
    existingInThingsToDo: existingNames,
    candidateCount: candidates.length,
    candidates: candidates.map(c => ({
      id: c.id,
      name: c.name,
      cuisine: c.cuisine,
      neighborhood: c.neighborhood,
      score: c.score,
      tags: c.tags,
      address: c.address,
      website: c.website,
      description: (c.description || '').slice(0, 140),
    })),
  };
});

fs.writeFileSync('scripts/thingstodo-candidates.json', JSON.stringify(report, null, 2));

// Print summary
Object.entries(report).forEach(([city, info]) => {
  console.log(`\n=== ${city} ===`);
  console.log(`  ${info.totalAttractions} attractions in data, ${info.existingInThingsToDo.length} already in thingsToDo, ${info.candidateCount} candidates to add`);
  console.log(`  Top 12 by score:`);
  info.candidates.slice(0, 12).forEach(c => {
    console.log(`    ${c.score} ${c.name} [${c.cuisine}] (${c.neighborhood})`);
  });
});
