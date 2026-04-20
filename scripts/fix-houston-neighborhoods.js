// Apply neighborhood relabel fixes for Houston cards surfaced by
// audit-houston-neighborhoods.js. Only HIGH-CONFIDENCE cases where zip
// code AND coordinates both indicate the same different neighborhood.
// Coord-bug cards (address consistent with label but coords at a
// different location) are listed separately for user review.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 7037, to: 'Spring Branch',       reason: 'Witte Rd 77055 + coords (29.79,-95.54) — Spring Branch' },
  { id: 7067, to: 'Chinatown / Bellaire',reason: 'Wilcrest Dr 77072 + coords (29.70,-95.57) — Alief/Westchase edge, nearest bucket is CB' },
  { id: 7111, to: 'West University',     reason: 'Morningside Dr 77005 + coords (29.72,-95.42) — West U' },
  { id: 7123, to: 'Chinatown / Bellaire',reason: 'S Rice Ave 77081 + coords (29.72,-95.47) — Gulfton/Bellaire' },
  { id: 7153, to: 'Heights',             reason: 'Airline Dr 77009 + coords (29.81,-95.38) — Heights-adjacent, nearest bucket' },
  { id: 7155, to: 'West University',     reason: '6750 Main St 77030 + coords (29.71,-95.40) — Medical Center/West U' },
  { id: 7177, to: 'Chinatown / Bellaire',reason: 'Bellaire Blvd 77401 + coords (29.71,-95.46) — Bellaire (in CB bucket)' },
  { id: 7192, to: 'West University',     reason: 'Kelvin Dr 77005 + coords (29.72,-95.42) — West U' },
  { id: 7247, to: 'West Houston',        reason: 'Westheimer 77042 + coords (29.74,-95.57) — Westchase' },
  { id: 7249, to: 'Midtown',             reason: 'Winbern St 77002 + coords (29.74,-95.38) — Midtown' },
  { id: 7300, to: 'Downtown',            reason: 'Milam St 77002 + coords (29.76,-95.37) — Downtown' },
  { id: 7319, to: 'Heights',             reason: 'White Oak Dr 77007 + coords (29.78,-95.39) — Heights/Washington' },
  { id: 7321, to: 'Memorial',            reason: 'Woodway Dr 77057 + coords (29.78,-95.56) — Tanglewood/Memorial edge' },
  { id: 7327, to: 'Chinatown / Bellaire',reason: 'Bellaire Blvd 77036 + coords (29.71,-95.55) — Chinatown' },
  { id: 7333, to: 'Upper Kirby',         reason: 'Richmond Ave 77098 + coords (29.73,-95.43) — Upper Kirby' },
  { id: 7335, to: 'Memorial',            reason: '9827 Katy Fwy 77024 + coords (29.78,-95.54) — Memorial (77024 is Memorial zip)' },
  { id: 7338, to: 'West Houston',        reason: '12151 Westheimer 77077 + coords (29.74,-95.60) — Westchase' },
  { id: 7357, to: 'Tomball',             reason: '27931 Tomball Pkwy, Tomball 77375 — Tomball (was mislabeled Spring)' },
  { id: 7362, to: 'Memorial',            reason: '963 Bunker Hill Rd 77024 + coords (29.78,-95.53) — Memorial' },
  { id: 7371, to: 'Chinatown / Bellaire',reason: '9110 Bellaire Blvd 77036 + coords (29.71,-95.54) — Chinatown' },
  { id: 7380, to: 'Galleria',            reason: '4 Riverway Dr 77056 + coords (29.76,-95.46) — Galleria/Post Oak' },
  { id: 7384, to: 'Memorial',            reason: '9766 Katy Fwy 77055 + coords (29.79,-95.54) — Memorial border of Spring Branch' },
  { id: 7389, to: 'Memorial',            reason: '14054 Memorial Dr 77079 + coords (29.77,-95.59) — Memorial West' },
  { id: 7399, to: 'River Oaks',          reason: '3422 Allen Pkwy 77019 + coords (29.76,-95.41) — River Oaks (was wrongly labeled Woodlands)' },
  { id: 7403, to: 'Chinatown / Bellaire',reason: 'Bissonnet St 77081 + coords (29.70,-95.49) — Gulfton area in CB' },
  { id: 7421, to: 'Chinatown / Bellaire',reason: '5655 Hillcroft 77036 + coords (29.72,-95.50) — Chinatown' },
  { id: 7450, to: 'Chinatown / Bellaire',reason: '5667 Hillcroft 77036 + coords (29.72,-95.50) — Chinatown' },
  { id: 7453, to: 'Chinatown / Bellaire',reason: '9896 Bellaire Blvd 77036 + coords (29.70,-95.55) — Chinatown' },
  { id: 7462, to: 'Spring Branch',       reason: '6917 Long Point Rd 77055 + coords (29.80,-95.47) — Spring Branch' },
  { id: 7477, to: 'EaDo',                reason: '304 Sampson St 77003 + coords (29.75,-95.34) — EaDo' },
  { id: 7494, to: 'Heights',             reason: '1100 W 23rd St 77008 + coords (29.81,-95.42) — Heights' },
  { id: 7496, to: 'East End',            reason: '719 Telephone Rd 77023 + coords (29.73,-95.33) — East End' },
  { id: 7500, to: 'Chinatown / Bellaire',reason: '6662 Southwest Fwy 77074 + coords (29.72,-95.50) — Sharpstown (CB bucket)' },
  { id: 7501, to: 'Chinatown / Bellaire',reason: '6632 Southwest Fwy 77074 + coords (29.72,-95.50) — Sharpstown (CB bucket)' },
  { id: 7505, to: 'West Houston',        reason: '11805 Westheimer 77077 + coords (29.74,-95.59) — Westchase' },
  { id: 7507, to: 'Memorial',            reason: '1824 Fountain View 77057 + coords (29.77,-95.56) — Tanglewood/Memorial' },
  { id: 7511, to: 'Chinatown / Bellaire',reason: '9393 Bellaire Blvd 77036 + coords (29.70,-95.55) — Chinatown' },
  { id: 7525, to: 'Midtown',             reason: '606 Dennis St 77006 + coords (29.75,-95.38) — Midtown' },
  { id: 7529, to: 'Midtown',             reason: '2900 Travis St 77006 + coords (29.74,-95.38) — Midtown/Montrose edge' },
  { id: 7548, to: 'Memorial',            reason: '6603 Westcott St 77007 + coords (29.78,-95.43) — Memorial' },
  { id: 7561, to: 'Heights',             reason: '101 Heights Blvd 77007 + coords (29.77,-95.40) — Heights (card name Killen\'s\\\'s Pearland is chain name, not location)' },
];

// Coord-bug cards — address is consistent with some neighborhood but stored
// lat/lng are clearly at a different location. Need verified coords from user.
const COORD_BUGS = [
  { id: 7065,  name: 'Indigo',                            issue: '517 Berry Rd 77022 — coords 29.84,-95.37 do not match address. 77022 is Independence Heights.' },
  { id: 7214,  name: "Harold's Restaurant",               issue: '350 W 19th St 77008 Heights — coords 29.74,-95.60 are in Westchase, not Heights.' },
  { id: 7227,  name: 'Bonchon',                           issue: '9896 Bellaire Blvd 77036 — coords 29.75,-95.37 are Downtown, should be Chinatown at ~29.70,-95.55' },
  { id: 7229,  name: 'The Woodlands Waterway District',   issue: 'The Woodlands 77380 — coords 29.76,-95.36 are Downtown, should be ~30.16,-95.46' },
  { id: 7303,  name: "Lucille's EaDo (Bludorn)",          issue: '2401 Leeland St 77003 — coords 29.77,-95.22 are in La Porte, should be ~29.75,-95.35' },
  { id: 7349,  name: 'Pho Ben',                           issue: '2800 Business Center Dr Pearland 77584 — coords 29.79,-95.41 are Heights, not Pearland' },
  { id: 7356,  name: 'Crisp Wine-Beer-Eatery',            issue: '2220 Timber Shadows Dr Kingwood 77339 — coords 29.81,-95.42 are Heights, should be Kingwood ~30.05,-95.19' },
  { id: 7378,  name: 'La Finca Restaurant Woodlands',     issue: '25701 I-45 N Spring 77380 — coords 29.74,-95.58 are Westchase, should be Spring ~30.05,-95.44' },
  { id: 7390,  name: 'B&B Butchers Katy',                 issue: '4801 N Shepherd Dr 77018 — coords 29.84,-95.41 are Oak Forest (not Katy). Card may belong under Heights/Oak Forest bucket.' },
  { id: 7393,  name: 'Zammitti Italian Katy',             issue: '2320 S Mason Rd Katy 77450 — coords 30.03,-95.17 are Humble/Atascocita, should be Katy ~29.77,-95.79' },
  { id: 7398,  name: "Chuy's The Woodlands",              issue: '19740 I-45 N Spring 77373 — coords 29.79,-95.54 are Memorial, should be Spring ~30.04,-95.42' },
  { id: 7401,  name: 'Cafe Adobe Woodlands',              issue: '1700 Research Forest Dr Woodlands 77380 — coords 29.54,-95.15 are Clear Lake, should be Woodlands ~30.16,-95.49' },
  { id: 7402,  name: "Robard's Steakhouse Woodlands",     issue: '2301 N Millbend Dr Woodlands 77380 — coords 29.78,-95.58 are Spring Branch, should be Woodlands ~30.16,-95.47' },
  { id: 7455,  name: 'Bodard Bistro',                     issue: '8338 Long Point Rd 77055 — coords 29.70,-95.58 are in Alief, should be Spring Branch ~29.79,-95.51' },
  { id: 7487,  name: 'Mensho Tokyo',                      issue: '1802 N Shepherd Dr 77008 — coords 29.70,-95.55 are in Alief, should be Heights ~29.80,-95.41' },
  { id: 7497,  name: "Tacos Dona Lena",                   issue: '7120 Harrisburg Blvd 77011 — coords 29.80,-95.43 are Memorial/Heights, should be East End ~29.73,-95.29' },
  { id: 7499,  name: "Dakao Restaurant & Bar",            issue: '3311 Milam St 77006 — coords 29.70,-95.59 are in Westchase, should be Montrose/Midtown ~29.73,-95.38' },
  { id: 7518,  name: 'Fogo de Chao Downtown',             issue: '600 Travis St 77002 — coords 29.74,-95.51 are Memorial, should be Downtown ~29.76,-95.37' },
  { id: 7521,  name: "Murray's",                          issue: '1000 Yale St 77008 — coords 29.75,-95.48 are Memorial, should be Heights ~29.79,-95.40' },
  { id: 7532,  name: 'Masa Sushi',                        issue: '977 Nasa Pkwy 77058 — coords 29.74,-95.54 are Memorial, should be Clear Lake ~29.55,-95.09' },
];

// Ambiguous / no good bucket — defer to user
const AMBIGUOUS = [
  { id: 7090,  name: 'Burns Original BBQ',   issue: '8307 De Priest St 77088 — Acres Homes area, not in any current Houston bucket' },
  { id: 7230,  name: "Gringo's Mexican Kitchen", issue: '12348 Gulf Fwy 77034 (labeled Friendswood) — Hobby/South Houston area, not in any current bucket' },
  { id: 7331,  name: "Danny's Chicken",      issue: '7046 W Fuqua St, Missouri City 77489 — Missouri City is a separate suburb not in the Houston bucket list' },
  { id: 7348,  name: 'Grazia Italian',       issue: '11215 Shadow Creek Pkwy, Pearland 77584 — West Pearland, just outside current Pearland bounds' },
];

function findCardSlice(html, id) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1; for (const a of anchors) { at = html.indexOf(a); if (at >= 0) break; }
  if (at < 0) return null;
  let depth = 0, start = -1;
  for (let i = at; i >= 0; i--) {
    if (html[i] === '}') depth++;
    else if (html[i] === '{') { if (!depth) { start = i; break; } depth--; }
  }
  if (start < 0) return null;
  depth = 0; let end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (!depth) { end = i; break; } }
  }
  return end > 0 ? { start, end } : null;
}

function run() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const applied = [], skipped = [];
  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id);
    if (!slice) { skipped.push({ ...fix, why: 'not found' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
  }
  fs.writeFileSync(indexPath, html);
  console.log('Houston neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('');
  console.log('COORD BUGS (need verified coords from user): ' + COORD_BUGS.length);
  for (const b of COORD_BUGS) console.log('  #' + b.id + '  ' + b.name + '  — ' + b.issue);
  console.log('');
  console.log('AMBIGUOUS (no good bucket): ' + AMBIGUOUS.length);
  for (const a of AMBIGUOUS) console.log('  #' + a.id + '  ' + a.name + '  — ' + a.issue);

  fs.writeFileSync(
    path.join(__dirname, 'houston-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, coord_bugs: COORD_BUGS, ambiguous: AMBIGUOUS }, null, 2)
  );
}

run();
