// Photo backfill: scan a *_DATA array, fetch og:image for cards with empty photoUrl,
// validate against Norman's quality gate, write back to index.html.
//
// Usage:
//   node scripts/photo-backfill.js <CITY_DATA> [--apply] [--limit=N]
//   node scripts/photo-backfill.js MIAMI_DATA               # dry-run
//   node scripts/photo-backfill.js MIAMI_DATA --apply       # write changes
//   node scripts/photo-backfill.js MIAMI_DATA --limit=20    # only first 20 empty

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FILE = path.join(__dirname, '..', 'index.html');

const args = process.argv.slice(2);
const target = args.find(a => /^[A-Z]+_DATA$/.test(a));
const apply = args.includes('--apply');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

if (!target) {
  console.error('Usage: node photo-backfill.js <CITY_DATA> [--apply] [--limit=N]');
  process.exit(1);
}

// ---------- helpers ----------
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

function getOgImage(url) {
  if (!url || !/^https?:\/\//.test(url)) return null;
  try {
    const safeUrl = url.replace(/(["`$\\])/g, '\\$1');
    const html = execSync(`curl -sL --max-time 12 -A "${UA}" "${safeUrl}"`, {
      timeout: 15000, maxBuffer: 8e6
    }).toString();
    const patterns = [
      /<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m && m[1]) return m[1];
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Norman's quality gate — reject branded social-share / og-image / logo / placeholder.
function passesQualityGate(imageUrl) {
  if (!imageUrl) return { ok: false, reason: 'no-url' };
  const fn = imageUrl.toLowerCase();

  // Hard reject filename patterns (all lowercased)
  const rejectFn = [
    '/og.jpg','/og.png','/og.webp',
    'og-image','og_image','/og-',
    '-og.jpg','-og.png','-og.webp','_og.','og.png','og.jpg',
    'opengraph','open-graph','open graph','open%20graph',
    'social-share','social_share','/share-image','share_image','/share.','-share.','-share-','_share-',
    '-facebook.','_facebook.','/facebook.','facebook-image','fb-share','fb_share',
    '-twitter.','_twitter.','twitter-image','tw-share',
    'profile-pic','profile_pic',
    '/logo.','logo.svg','logo.png','logo.jpg','logo.webp','logo-','logo_','logo+','_logo.','_logo-','_logo_',
    '-cleanlogo','cleanlogo','clean-logo','clean_logo',
    'wordmark','placeholder','default-image','default_image',
    'fallback','no-image','noimage','blank.jpg','blank.png',
    'icon-','-icon.','/icon.','favicon',
    'arrow','-arrow.','_arrow.','-arrow-','arrowright','arrowleft','arrow-right','arrow-left',
    'meta-image','meta_image','seo-image','seo_image',
    'thumbnail-default','default-thumb',
    'sharing-image','sharing_image',
    'preview-default','preview.png','preview.jpg',
    'michelin_','michelin-star','michelin_star','michelin-guide-star',
    'wine_spectator','wine-spectator','beard-award','james-beard','-award-','_award-','award-logo',
    'heart-gold','heart_gold','heart-icon','heart_icon',
    '/hero-icon','sprite','spinner','loader.gif',
    'badge-','_badge.','-badge.','/badge.',
    'circle-steer','circle_steer','-steer-','circlesteer',
    'logowording','logoword','logo-wording','logotype','logos.png','logos.jpg',
    'fun_fact','fun-fact','funfact','infographic',
    '-white.png','-white.jpg','-white.svg','_white.png','_white.svg','/white-logo','white-logo',
    '-black.png','-black.svg','/black-logo',
    'background.png','bg.png','bg-pattern','pattern.png',
    '/header.','/footer.','/divider.','-divider.',
  ];
  for (const p of rejectFn) if (fn.includes(p)) return { ok: false, reason: `reject:${p}` };

  // Reject canonical social-share dimensions
  if (/[_\-/]1200x630/.test(fn)) return { ok: false, reason: 'dims-1200x630' };
  if (/[_\-/]1200x1200/.test(fn)) return { ok: false, reason: 'dims-1200x1200-square' };
  // CDN comma-param syntax: width=1200,height=630 (Cloudflare, popmenu, etc.)
  if (/width=1200,height=630/.test(fn) || /w=1200,h=630/.test(fn)) return { ok: false, reason: 'cdn-1200x630' };
  if (/width=1200,height=1200/.test(fn) || /w=1200,h=1200/.test(fn)) return { ok: false, reason: 'cdn-1200x1200' };
  if (/[?&](?:w|width)=1200(?:&|$)/.test(fn) && /[?&](?:h|height)=630(?:&|$)/.test(fn)) return { ok: false, reason: 'dims-1200x630-query' };
  if (/[?&](?:w|width)=1200(?:&|$)/.test(fn) && /[?&](?:h|height)=1200(?:&|$)/.test(fn)) return { ok: false, reason: 'dims-1200x1200-query' };
  // Generic square dims often indicate logos (1500x1500, 1900x1900, 2000x2000, etc.)
  const sqMatch = fn.match(/[\.\-_/](\d{3,4})x\1[\.\-_/]/);
  if (sqMatch) return { ok: false, reason: `square-dims-${sqMatch[1]}x${sqMatch[1]}` };

  // Reject Resy generic social previews
  if (fn.includes('resy.com/images/social/')) return { ok: false, reason: 'resy-generic-social' };
  // Reject OpenTable generic
  if (fn.includes('opentable.com/img/shared')) return { ok: false, reason: 'opentable-generic' };

  // Pass if it has photographer-credit hints (heuristic boost; not required)
  // (we don't reject for absence)

  // Pass if dims encoded show >= 1000 width (wixstatic, sanity, cloudinary patterns)
  // Otherwise default-pass (we err on the side of accepting; user can review later).
  return { ok: true, reason: 'default-pass' };
}

// ---------- find target line(s) — supports single-line, "= [" with spaces, and multi-line ----------
const fileText = fs.readFileSync(FILE, 'utf8');
const lines = fileText.split('\n');
let lineIdx = -1;
const re = new RegExp(`^const\\s+${target}\\s*=\\s*\\[`);
for (let i = 0; i < lines.length; i++) {
  if (re.test(lines[i])) { lineIdx = i; break; }
}
if (lineIdx < 0) { console.error('Not found:', target); process.exit(1); }

let arr;
let mode; // 'single' or 'multi'
let endIdx; // last line index for multi-line

const firstLine = lines[lineIdx];
const eqIdx = firstLine.indexOf('=');
const bracketIdx = firstLine.indexOf('[', eqIdx);
const lastBracketSemi = firstLine.lastIndexOf('];');

if (lastBracketSemi >= 0 && lastBracketSemi > bracketIdx) {
  // single-line
  mode = 'single';
  arr = JSON.parse(firstLine.slice(bracketIdx, lastBracketSemi + 1));
  endIdx = lineIdx;
} else {
  // multi-line: scan forward for terminating "];"
  mode = 'multi';
  let buf = firstLine.slice(bracketIdx); // starts with '[' or '[{...'
  let i = lineIdx;
  let foundEnd = false;
  while (++i < lines.length) {
    buf += '\n' + lines[i];
    // check for line that contains "];" not inside a string
    if (/\];\s*$/.test(lines[i]) || lines[i].trim() === '];' || /\];/.test(lines[i])) {
      // Heuristic: try parsing each time we see "];"
      const tryEnd = buf.lastIndexOf('];');
      if (tryEnd >= 0) {
        try {
          arr = JSON.parse(buf.slice(0, tryEnd + 1));
          endIdx = i;
          foundEnd = true;
          break;
        } catch (e) { /* keep going */ }
      }
    }
  }
  if (!foundEnd) { console.error('Could not parse multi-line', target); process.exit(1); }
}

console.log(`${target} @ line ${lineIdx+1} (${mode}-line, ends ${endIdx+1}): ${arr.length} cards`);

// ---------- iterate ----------
const empties = arr.filter(c => !c.photoUrl);
console.log(`Cards with empty photoUrl: ${empties.length}`);
const todo = empties.slice(0, limit);
console.log(`Processing first ${todo.length}${limit < Infinity ? ` (limit=${limit})` : ''}\n`);

let ok = 0, skipNoSite = 0, skipFetch = 0, skipGate = 0;
const updates = [];

for (let i = 0; i < todo.length; i++) {
  const c = todo[i];
  const pad = `[${(i+1).toString().padStart(3)}/${todo.length}]`;
  if (!c.website) {
    console.log(`${pad} SKIP no-site  → ${c.name}`);
    skipNoSite++;
    continue;
  }
  const og = getOgImage(c.website);
  if (!og) {
    console.log(`${pad} SKIP no-og    → ${c.name}  (${c.website})`);
    skipFetch++;
    continue;
  }
  const gate = passesQualityGate(og);
  if (!gate.ok) {
    console.log(`${pad} REJECT ${gate.reason.padEnd(20)}→ ${c.name}\n             ${og.slice(0, 120)}`);
    skipGate++;
    continue;
  }
  console.log(`${pad} OK            → ${c.name}\n             ${og.slice(0, 120)}`);
  ok++;
  updates.push({ id: c.id, name: c.name, photoUrl: og });
}

console.log(`\nResult: ${ok} ok, ${skipNoSite} no-site, ${skipFetch} no-og, ${skipGate} gate-reject`);

// ---------- apply ----------
if (apply && updates.length) {
  const updateMap = new Map(updates.map(u => [u.id, u.photoUrl]));
  for (const card of arr) {
    if (updateMap.has(card.id)) {
      card.photoUrl = updateMap.get(card.id);
    }
  }
  if (mode === 'single') {
    const newLine = `const ${target}=${JSON.stringify(arr)};`;
    lines[lineIdx] = newLine;
  } else {
    // Replace all lines from lineIdx through endIdx with a single rewritten line
    const newLine = `const ${target}=${JSON.stringify(arr)};`;
    lines.splice(lineIdx, endIdx - lineIdx + 1, newLine);
  }
  fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
  console.log(`\nWROTE ${updates.length} photos to ${target} (line ${lineIdx+1})`);
} else if (apply) {
  console.log('\nNothing to apply.');
} else {
  console.log('\n(dry-run; pass --apply to write)');
}
