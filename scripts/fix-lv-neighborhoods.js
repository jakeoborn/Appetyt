// Las Vegas neighborhood relabel fixes. Scoped to LV_DATA only.
//
// NOTE: LV audit surfaced a lot of likely address/coord corruption
// (famous Strip restaurants with addresses in Summerlin/NLV that
// don't match the venue's real location). Those are NOT auto-fixed
// here — they need user verification. Only clear cases where stored
// address is self-consistent with its zip and clearly a non-labeled
// bucket are relabeled.

const fs = require('fs');
const path = require('path');

const FIXES = [
  { id: 12089, to: 'Henderson',        reason: 'Sunrise Cafe: 8975 S Eastern Ave 89123 — Henderson zip (not Paradise)' },
  { id: 12321, to: 'Summerlin',        reason: 'Kai Sushi: 7450 W Lake Mead Blvd 89128 — Summerlin/Centennial zip' },
  { id: 12328, to: 'Henderson',        reason: 'Cleaver: 300 S Water St, Henderson 89015 — Henderson addr' },
  { id: 12329, to: 'Spring Valley',    reason: 'Other Mama: 3655 S Durango Dr 89147 + coords (36.10,-115.28) — Spring Valley' },
  { id: 12396, to: 'North Las Vegas',  reason: "Leticia's Cocina: 4949 N Rancho Dr 89130 + coords (36.25,-115.24) — NLV" },
  { id: 12397, to: 'Summerlin',        reason: 'Brewed Awakenings: 9580 W Sahara 89117 — Summerlin zip' },
  { id: 12403, to: 'Summerlin',        reason: "Du-par's: 9090 Alta Dr 89145 — Summerlin zip (not Downtown)" },
  { id: 12496, to: 'Summerlin',        reason: "Grimaldi's: 750 S Rampart Blvd 89145 — Summerlin zip" },
  { id: 12511, to: 'Downtown',         reason: 'Niu-Gu: 12 E Ogden Ave 89101 + coords (36.17,-115.14) — Downtown' },
];

// Likely data corruption — card name indicates a specific Strip casino
// restaurant but address is in a different suburban area. Needs user
// verification of correct address + coords.
const DATA_CORRUPTION = [
  { id: 12000, name: 'Joël Robuchon',                issue: 'card name = MGM Grand restaurant, but addr "2620 Regatta Dr 89128" is Summerlin' },
  { id: 12154, name: 'Bouchon Bakery',               issue: 'card name = Venetian venue, but addr "9440 W Sahara 89117" is Summerlin' },
  { id: 12239, name: "Hussong's Cantina",            issue: 'labeled Mandalay Bay, but coord 36.16,-115.29 is far from Mandalay Bay (~36.09,-115.18)' },
  { id: 12267, name: 'Shin Yakiniku',                issue: 'addr 5865 Spring Mountain 89146 (Chinatown) but coord 36.22,-115.33 is Summerlin' },
  { id: 12277, name: 'Hwaro Korean BBQ',             issue: 'addr 5030 Spring Mountain 89146 but coord 36.15,-115.30 is Summerlin' },
  { id: 12295, name: 'La Strega',                    issue: 'addr 3555 S Town Center Dr 89135 (Summerlin) labeled "West of Strip"' },
  { id: 12320, name: 'Smokeshow Barbeque',           issue: 'addr Henderson 89002 but coord 36.17,-115.25 is NW Vegas, not Henderson' },
  { id: 12366, name: 'Pin Kaow Thai',                issue: 'addr 3620 Spring Mountain 89102 but coord 36.20,-115.24 does not match' },
  { id: 12371, name: "Roberto's Taco Shop",          issue: 'addr 10030 W Cheyenne 89129 (Summerlin/NW) labeled Paradise' },
  { id: 12375, name: 'Paymon Mediterranean',         issue: 'addr 8380 W Sahara 89117 (Summerlin) labeled Paradise' },
  { id: 12378, name: 'Distrito Federal',             issue: 'addr 8400 W Sahara 89117 (Summerlin) labeled Paradise' },
  { id: 12402, name: "Izzy's Bagels",                issue: 'addr 1431 S Main St (Arts District) but coord 36.20,-115.28 is far away' },
  { id: 12438, name: 'Charlie Palmer Steak',         issue: 'famous Four Seasons/Mandalay Bay venue, but addr "6250 Rio Vista 89130" is NLV' },
  { id: 12442, name: 'Lakeside',                     issue: 'Wynn Las Vegas venue, but addr "2620 Regatta Dr 89128" is Summerlin (same addr as Joël Robuchon card)' },
  { id: 12451, name: 'Yonaka Modern Japanese',       issue: 'addr 8400 Farm Rd 89131 (NW) labeled Chinatown — needs review' },
  { id: 12454, name: 'District One',                 issue: 'addr 3400 S Jones Blvd 89146 (Chinatown) but coord 36.24,-115.23 is NLV' },
  { id: 12461, name: 'Picasso',                      issue: 'Bellagio venue, but addr "222 Emerald Vista Way 89144" is Summerlin' },
  { id: 12468, name: '888 Sushi & Robata',           issue: 'addr 5115 Spring Mountain 89146 (Chinatown) but coord 36.24,-115.25 is NLV' },
  { id: 12472, name: 'Therapy',                      issue: 'addr 518 Fremont St 89101 (Downtown) but coord 36.22,-115.26 is NW' },
  { id: 12495, name: 'Todd English P.U.B.',          issue: 'Aria venue, but addr "6374 W Lake Mead 89108" is NLV' },
  { id: 12506, name: 'Pinkbox Doughnuts Fremont',    issue: 'addr 450 Fremont St (Downtown) but coord 36.20,-115.26 is NW' },
  { id: 12510, name: 'Lotus of Siam Summerlin',      issue: 'addr 620 E Flamingo (Paradise) but coord 36.30,-115.28 is NLV' },
  { id: 12216, name: 'Mr BBQ',                       issue: 'addr 5770 Centennial Center 89149 (NW suburbs) labeled Chinatown' },
  { id: 12217, name: 'Pho Saigonese',                issue: 'addr 6710 N Hualapai Way 89149 (far NW) labeled Chinatown' },
  { id: 12230, name: 'Metro Pizza',                  issue: 'addr 6720 Sky Pointe Dr 89131 (far NW) labeled Paradise' },
  { id: 12297, name: 'Sumo Omakase',                 issue: 'addr 7160 N Durango 89149 (far NW) labeled Chinatown' },
  { id: 12352, name: 'The Skull Bar',                issue: 'addr 6430 N Durango 89149 (far NW) labeled Chinatown' },
  { id: 12365, name: 'Ohjah Japanese Steakhouse',    issue: 'addr 4055 Spring Mountain (Chinatown) but coord 36.30,-115.29 is far NW' },
  { id: 12350, name: 'Shokku Ramen',                 issue: 'addr 3480 Paradise Rd (Paradise) but coord 36.16,-115.23 is far NW' },
  { id: 12512, name: 'House of Gyros Chinatown',     issue: 'labeled Chinatown, likely address or coord corruption' },
];

function findCityRange(html) {
  const patterns = ['const LV_DATA=[', 'const LV_DATA =['];
  let start = -1;
  for (const p of patterns) { const i = html.indexOf(p); if (i >= 0) { start = i + p.length - 1; break; } }
  if (start < 0) throw new Error('LV_DATA not found');
  let depth = 0, end = -1;
  for (let i = start; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') { depth--; if (!depth) { end = i; break; } }
  }
  return { start, end };
}

function findCardSlice(html, id, cityRange) {
  const anchors = ['"id":' + id + ',', '"id":' + id + '}'];
  let at = -1;
  for (const a of anchors) {
    const i = html.indexOf(a, cityRange.start);
    if (i >= 0 && i < cityRange.end) { at = i; break; }
  }
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
  let cityRange = findCityRange(html);
  const applied = [], skipped = [];
  for (const fix of FIXES) {
    const slice = findCardSlice(html, fix.id, cityRange);
    if (!slice) { skipped.push({ ...fix, why: 'not found in LV_DATA' }); continue; }
    const obj = html.slice(slice.start, slice.end + 1);
    const m = obj.match(/"neighborhood":"([^"]*)"/);
    if (!m) { skipped.push({ ...fix, why: 'no neighborhood field' }); continue; }
    if (m[1] === fix.to) { skipped.push({ ...fix, why: 'already ' + fix.to }); continue; }
    const newObj = obj.replace('"neighborhood":"' + m[1] + '"', '"neighborhood":"' + fix.to + '"');
    html = html.slice(0, slice.start) + newObj + html.slice(slice.end + 1);
    applied.push({ id: fix.id, from: m[1], to: fix.to, reason: fix.reason });
    cityRange = findCityRange(html);
  }
  fs.writeFileSync(indexPath, html);
  console.log('LV neighborhood fixes');
  console.log('  applied: ' + applied.length + '  skipped: ' + skipped.length);
  for (const a of applied) console.log('  #' + a.id + '  ' + a.from + ' → ' + a.to);
  for (const s of skipped) console.log('  SKIP #' + s.id + '  ' + s.why);
  console.log('');
  console.log('DATA CORRUPTION (addr/coord mismatch — need user verification): ' + DATA_CORRUPTION.length);
  for (const b of DATA_CORRUPTION) console.log('  #' + b.id + '  ' + b.name + ' — ' + b.issue);

  fs.writeFileSync(
    path.join(__dirname, 'lv-neighborhood-fixes-applied.json'),
    JSON.stringify({ applied, skipped, data_corruption: DATA_CORRUPTION }, null, 2)
  );
}

run();
