// Audit descriptions on entries with locations[]>=2 for phrases that are
// specific to one location and should be generalized now that the card
// represents multiple locations.

const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function parseArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return [];
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  const src = html.substring(arrS, arrE);
  try { return JSON.parse(src); }
  catch (e) { try { return new Function('return ' + src)(); } catch (e2) { return []; } }
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

// Patterns that suggest a description is single-location specific.
// Each pattern is tested against the description in lowercase.
const suspiciousPatterns = [
  { label: 'singular "the location"', re: /the (downtown|uptown|east|west|north|south|ogden|provo|sugar house|park city|sandy|henderson|galleria|memorial|museum district|capitol hill|bellevue|belltown|fremont|pike place|heights|domain|mueller|south lamar|north lamar) location/i },
  { label: 'worth the drive', re: /worth the (drive|trip) (north|south|east|west|from|to|up)/i },
  { label: 'mentions one of its neighborhoods', re: null /* custom — filled per-entry */ },
  { label: 'in X downtown/neighborhood', re: /\bin (historic )?(downtown )?(ogden|provo|sandy|herriman|holladay|draper|park city|sugar house|south jordan|herriman|east austin|south lamar|north lamar|mueller|domain|the domain|bellevue|belltown|fremont|capitol hill|pike place|downtown|uptown|south congress|east side|westside|heights|galleria|katy|memorial|pearland|midtown|museum district)\b/i },
  { label: 'single-neighborhood call-out', re: /^[^.]*\b(ogden|provo|sandy|herriman|holladay|draper|park city|south jordan|east austin|south lamar|north lamar|mueller|the domain|bellevue|belltown|fremont|capitol hill|pike place|south congress|heights|galleria|katy|memorial|pearland|museum district)\b/i },
];

const flagged = [];

Object.entries(cities).forEach(([city, varName]) => {
  const data = parseArray(varName);
  data.forEach(r => {
    if (!Array.isArray(r.locations) || r.locations.length < 2) return;
    const desc = String(r.description || '').trim();
    if (!desc) return;

    // Build per-entry neighborhood mention checker: does desc mention any single
    // location-specific neighborhood from r.locations (by individual name) in a
    // singular way? We list all the neighborhoods of its locations[] and see
    // which appear in the description.
    const nbhdList = r.locations.map(l => String(l.neighborhood || l.name || '').trim()).filter(Boolean);
    const mentionedNbhds = nbhdList.filter(n => {
      const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('\\b' + esc + '\\b', 'i').test(desc);
    });

    const hits = [];
    suspiciousPatterns.forEach(p => {
      if (p.re && p.re.test(desc)) hits.push(p.label);
    });
    if (mentionedNbhds.length === 1 && nbhdList.length >= 2) {
      hits.push(`mentions only "${mentionedNbhds[0]}" of ${nbhdList.length} locations`);
    }

    if (hits.length) {
      flagged.push({
        city, id: r.id, name: r.name,
        locationCount: r.locations.length,
        neighborhoods: nbhdList,
        description: desc,
        flags: hits,
      });
    }
  });
});

fs.writeFileSync('scripts/merged-description-audit.json', JSON.stringify(flagged, null, 2));

console.log(`=== DESCRIPTION AUDIT: ${flagged.length} merged entries need review ===\n`);
flagged.forEach(f => {
  console.log(`${f.city}#${f.id} "${f.name}" (${f.locationCount} locs: ${f.neighborhoods.join(', ')})`);
  console.log(`  flags: ${f.flags.join(' | ')}`);
  console.log(`  desc: "${f.description}"`);
  console.log('');
});
