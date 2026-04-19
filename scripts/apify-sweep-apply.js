// Apply Apify sweep results to index.html for one city.
// Reads:
//   scripts/apify-results-{city}.json   (raw Apify dataset)
//   scripts/apify-og-images-{city}.json (og:image fetches)
// Writes:
//   index.html                           (entries updated in-place, IDs preserved)
//   scripts/apify-sweep-diffs/{city}.json
//   scripts/apify-sweep-flags.json       (appended)
//   scripts/apify-sweep-log.jsonl        (appended)
//   scripts/apify-sweep-state.json       (updated)
//
// Usage: node scripts/apify-sweep-apply.js <CITY_VAR> [--dry-run]
//   node scripts/apify-sweep-apply.js PHX_DATA --dry-run
//   node scripts/apify-sweep-apply.js PHX_DATA

const fs = require('fs');
const path = require('path');

const cityVar = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!cityVar) { console.error('Usage: node apply.js <CITY_VAR> [--dry-run]'); process.exit(1); }
const cityShort = cityVar.replace('_DATA', '').toLowerCase();

const HTML_FILE = 'index.html';
const APIFY_FILE = `scripts/apify-results-${cityShort}.json`;
const OG_FILE = `scripts/apify-og-images-${cityShort}.json`;
const DIFFS_DIR = 'scripts/apify-sweep-diffs';
const DIFF_FILE = path.join(DIFFS_DIR, `${cityShort}.json`);
const FLAGS_FILE = 'scripts/apify-sweep-flags.json';
const LOG_FILE = 'scripts/apify-sweep-log.jsonl';
const STATE_FILE = 'scripts/apify-sweep-state.json';

const CITY_BBOX = {
  PHX: { lat: [33.0, 34.2], lng: [-113.0, -111.4] },
  DALLAS: { lat: [32.5, 33.3], lng: [-97.3, -96.4] },
  HOUSTON: { lat: [29.4, 30.2], lng: [-95.9, -94.9] },
  AUSTIN: { lat: [30.0, 30.7], lng: [-98.1, -97.4] },
  CHICAGO: { lat: [41.6, 42.1], lng: [-88.0, -87.4] },
  SLC: { lat: [40.4, 40.9], lng: [-112.2, -111.6] },
  LV: { lat: [35.9, 36.4], lng: [-115.5, -114.9] },
  SEATTLE: { lat: [47.4, 47.8], lng: [-122.5, -122.0] },
  NYC: { lat: [40.4, 40.95], lng: [-74.3, -73.6] },
  LA: { lat: [33.6, 34.4], lng: [-118.7, -117.9] },
};

function isLikelyLogo(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg')) return true;
  // "logo" surrounded by any non-alphanumeric (handles /, _, -, +, %20, etc.)
  return /[^a-z0-9]logo[^a-z0-9]|favicon|[^a-z0-9]icon[^a-z0-9]|brand[^a-z0-9]?mark|sprite|placeholder/.test(lower);
}

function normalizeUrl(u) {
  if (!u) return '';
  return String(u).toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\?utm_source=\w+/, '')
    .replace(/\/+$/, '');
}

function isValidUrl(u) {
  if (!u || typeof u !== 'string') return false;
  if (!/^https?:\/\//.test(u)) return false;
  if (/javascript:/i.test(u)) return false;
  try { new URL(u); return true; } catch { return false; }
}

function isValidCoord(lat, lng, bbox) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (!isFinite(lat) || !isFinite(lng)) return false;
  if (!bbox) return true;
  return lat >= bbox.lat[0] && lat <= bbox.lat[1] && lng >= bbox.lng[0] && lng <= bbox.lng[1];
}

function normalizePhone(p) {
  if (!p) return '';
  const digits = String(p).replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  return String(p);
}

function instagramHandle(url) {
  if (!url) return '';
  const m = String(url).match(/instagram\.com\/([A-Za-z0-9_.]+)/);
  return m ? '@' + m[1] : '';
}

async function fetchImageDims(url) {
  // Download first 32KB to read image dimensions from JPG/PNG/WEBP headers.
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { Range: 'bytes=0-32767' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 206) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    // JPEG
    if (buf[0] === 0xFF && buf[1] === 0xD8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xFF) { i++; continue; }
        const marker = buf[i + 1];
        if (marker >= 0xC0 && marker <= 0xC3) {
          const h = buf.readUInt16BE(i + 5);
          const w = buf.readUInt16BE(i + 7);
          return { w, h };
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    // WEBP VP8
    if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
      // try VP8X/VP8/VP8L
      if (buf[12] === 0x56 && buf[13] === 0x50 && buf[14] === 0x38 && buf[15] === 0x20) {
        const w = (buf.readUInt16LE(26) & 0x3FFF) + 1;
        const h = (buf.readUInt16LE(28) & 0x3FFF) + 1;
        return { w, h };
      }
    }
    return null;
  } catch { return null; }
}

async function passesPhotoTest(url) {
  if (!url) return { ok: false, reason: 'empty' };
  if (!isValidUrl(url)) return { ok: false, reason: 'invalid_url' };
  if (isLikelyLogo(url)) return { ok: false, reason: 'logo_url_pattern' };
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, reason: 'http_' + res.status };
    const ct = res.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) return { ok: false, reason: 'not_image:' + ct };
    const lenStr = res.headers.get('content-length');
    if (lenStr) {
      const len = parseInt(lenStr, 10);
      if (len > 0 && len < 50000) return { ok: false, reason: 'too_small_' + len };
      if (len > 15000000) return { ok: false, reason: 'too_large_' + len };
    }
    // Aspect ratio check: reject near-square (likely logo) and very narrow images.
    const dims = await fetchImageDims(url);
    if (dims && dims.w > 0 && dims.h > 0) {
      if (dims.w < 400 || dims.h < 300) return { ok: false, reason: `too_small_${dims.w}x${dims.h}` };
      const ar = dims.w / dims.h;
      if (ar > 0.88 && ar < 1.12) return { ok: false, reason: `near_square_${dims.w}x${dims.h}` };
      if (ar < 0.5 || ar > 2.5) return { ok: false, reason: `extreme_ratio_${dims.w}x${dims.h}` };
    }
    return { ok: true };
  } catch (e) { return { ok: false, reason: 'fetch_err:' + e.message }; }
}

async function pickPhoto(ogResult, apifyImageUrls) {
  // Build candidate list with up to 3 owner photos + 3 curated (not just first of each).
  const candidates = [];
  if (ogResult && ogResult.ok) candidates.push({ url: ogResult.url, source: 'og:image' });
  const owners = (apifyImageUrls || []).filter(u => /\/p\/AF1Q/.test(u)).slice(0, 3);
  for (const u of owners) candidates.push({ url: u, source: 'google-owner' });
  const curated = (apifyImageUrls || []).filter(u => /\/gps-cs-s\//.test(u)).slice(0, 3);
  for (const u of curated) candidates.push({ url: u, source: 'google-curated' });
  const tried = [];
  for (const c of candidates) {
    const t = await passesPhotoTest(c.url);
    if (t.ok) return { ...c, tried };
    tried.push({ source: c.source, reason: t.reason });
  }
  return { url: null, source: null, tried };
}

function extractArrayInfo(html, varDecl) {
  const re = new RegExp('const ' + varDecl + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) throw new Error('not found: ' + varDecl);
  const start = m.index + m[0].length - 1;
  let depth = 0, inStr = false, esc = false, sc = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (ch === sc) { inStr = false; sc = null; } continue; }
    if (ch === '"' || ch === "'") { inStr = true; sc = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) {
      const end = i + 1;
      const slice = html.substring(start, end);
      let arr;
      try { arr = JSON.parse(slice); } catch { arr = (new Function('return ' + slice))(); }
      return { start, end, arr };
    }}
  }
  throw new Error('unclosed array: ' + varDecl);
}

function appendJsonl(file, obj) {
  fs.appendFileSync(file, JSON.stringify(obj) + '\n');
}

function loadJson(file, def) {
  if (!fs.existsSync(file)) return def;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function buildQueryToId(queriesPath) {
  // Stable: query-string -> id, via the snapshot from extract step.
  if (!fs.existsSync(queriesPath)) return null;
  const q = JSON.parse(fs.readFileSync(queriesPath, 'utf8'));
  const map = new Map();
  q.queries.forEach((qs, i) => { if (q.snapshot[i]) map.set(qs, q.snapshot[i].id); });
  return map;
}

function buildNameToId(entries) {
  const map = new Map();
  for (const r of entries) {
    if (!r || !r.id || !r.name) continue;
    map.set(r.name.toLowerCase().trim(), r.id);
  }
  return map;
}

function buildOgIndex(ogResults) {
  const map = new Map();
  for (const r of ogResults) map.set(r.id, r);
  return map;
}

async function diffEntry(current, apify, ogResult, bbox) {
  const changes = {};
  const flags = [];
  const conflicts = {};

  // phone
  const apifyPhone = apify.phone ? normalizePhone(apify.phone) : '';
  if (apifyPhone) {
    const cur = (current.phone || '').trim();
    if (!cur) changes.phone = apifyPhone;
    else if (normalizePhone(cur) !== apifyPhone) {
      conflicts.phone = { current: cur, apify: apifyPhone };
    }
  }

  // website: backfill empty; upgrade http→https if normalized matches; conflict only if domains/paths differ
  const apifyWebsite = apify.website && isValidUrl(apify.website) ? apify.website.replace(/\?utm_source=google/, '') : '';
  if (apifyWebsite) {
    const cur = (current.website || '').trim();
    if (!cur) {
      changes.website = apifyWebsite;
    } else if (normalizeUrl(cur) === normalizeUrl(apifyWebsite)) {
      // Same effective URL. Upgrade http→https if applicable; otherwise leave alone.
      if (cur.startsWith('http://') && apifyWebsite.startsWith('https://')) {
        changes.website = apifyWebsite;
      }
    } else {
      conflicts.website = { current: cur, apify: apifyWebsite };
    }
  }

  // instagram backfill (never overwrite per Q2)
  const apifyIg = (apify.instagrams && apify.instagrams[0]) ? instagramHandle(apify.instagrams[0]) : '';
  if (apifyIg) {
    const cur = (current.instagram || '').trim();
    if (!cur) changes.instagram = apifyIg;
    else if (cur.toLowerCase() !== apifyIg.toLowerCase()) {
      conflicts.instagram = { current: cur, apify: apifyIg };
    }
  }

  // coords (apply when delta >= 0.005 deg per Q3)
  if (apify.location && isValidCoord(apify.location.lat, apify.location.lng, bbox)) {
    const dLat = Math.abs((current.lat || 0) - apify.location.lat);
    const dLng = Math.abs((current.lng || 0) - apify.location.lng);
    if (dLat >= 0.005 || dLng >= 0.005) {
      changes.lat = apify.location.lat;
      changes.lng = apify.location.lng;
    }
  }

  // address typo (auto-fix small diffs per Q4 — char-level diff <= 4 chars)
  if (apify.address && current.address && apify.address !== current.address) {
    const a = current.address.toLowerCase().replace(/[^a-z0-9]/g, '');
    const b = apify.address.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (a !== b) {
      const lenDiff = Math.abs(a.length - b.length);
      if (lenDiff <= 4) {
        changes.address = apify.address;
      } else {
        conflicts.address = { current: current.address, apify: apify.address };
      }
    }
  }

  // closure (Q4: requires double-confirm via fallback later — flag for now)
  if (apify.permanentlyClosed === true) {
    flags.push({ type: 'closure_candidate', message: 'Apify reports permanentlyClosed=true; needs manual confirm' });
  }

  // photo (async — only set if at least one candidate passes the quality test)
  const photoChoice = await pickPhoto(ogResult, apify.imageUrls || []);
  if (photoChoice.url) {
    if (current.photoUrl !== photoChoice.url) {
      changes.photoUrl = photoChoice.url;
      changes._photoSource = photoChoice.source;
      if (photoChoice.tried.length) changes._photoTriedFirst = photoChoice.tried;
    }
  } else {
    // No candidate passed. Clear photoUrl if we previously set a bad one; otherwise leave empty.
    if (current.photoUrl) {
      changes.photoUrl = '';
      changes._photoSource = 'none_passed_test';
      changes._photoTriedAll = photoChoice.tried;
    } else {
      flags.push({ type: 'no_photo_passed_test', message: 'All photo candidates failed quality test', tried: photoChoice.tried });
    }
  }

  return { changes, conflicts, flags };
}

async function main() {
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  if (!fs.existsSync(APIFY_FILE)) { console.error(`Missing ${APIFY_FILE}`); process.exit(1); }
  if (!fs.existsSync(OG_FILE))    { console.error(`Missing ${OG_FILE}`); process.exit(1); }
  const apifyResults = JSON.parse(fs.readFileSync(APIFY_FILE, 'utf8'));
  const ogResults = JSON.parse(fs.readFileSync(OG_FILE, 'utf8'));
  if (!fs.existsSync(DIFFS_DIR)) fs.mkdirSync(DIFFS_DIR, { recursive: true });

  const info = extractArrayInfo(html, cityVar);
  console.log(`${cityVar}: ${info.arr.length} entries in source`);
  console.log(`Apify results: ${apifyResults.length}`);
  console.log(`OG image results: ${ogResults.length}`);

  const queriesPath = `scripts/apify-${cityShort}-queries.json`;
  const queryToId = buildQueryToId(queriesPath);
  const nameToId = buildNameToId(info.arr);
  const idToEntry = new Map(info.arr.filter(r => r && r.id).map(r => [r.id, r]));
  const ogIndex = buildOgIndex(ogResults);
  const bbox = CITY_BBOX[cityVar.replace('_DATA', '')];

  const diffs = [];
  const allFlags = [];
  let matched = 0, unmatched = [];

  // Process entries with concurrency to keep HEAD-checks fast
  const tasks = [];
  for (const ap of apifyResults) {
    let id = queryToId ? queryToId.get(ap.searchString) : null;
    if (!id && ap.title) id = nameToId.get(String(ap.title).toLowerCase().trim());
    const entry = id ? idToEntry.get(id) : null;
    if (!entry) { unmatched.push(ap.searchString || ap.title); continue; }
    matched++;
    const og = ogIndex.get(entry.id) || null;
    tasks.push({ entry, ap, og });
  }
  // Last-chance pass: entries with NO Apify match but with og:image — try og:image alone
  const apifyEntryIds = new Set(tasks.map(t => t.entry.id));
  for (const ogr of ogResults) {
    if (apifyEntryIds.has(ogr.id)) continue;
    if (!ogr.ok) continue;
    const entry = idToEntry.get(ogr.id);
    if (!entry) continue;
    tasks.push({ entry, ap: { searchString: '__og_only__', imageUrls: [] }, og: ogr });
  }
  console.log(`Matched ${tasks.length} entries; running diff with photo HEAD-checks (concurrency 8)...`);
  const concurrency = 8;
  let idx = 0, done = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      const { entry, ap, og } = tasks[i];
      const { changes, conflicts, flags } = await diffEntry(entry, ap, og, bbox);
      if (Object.keys(changes).length || Object.keys(conflicts).length || flags.length) {
        diffs.push({ id: entry.id, name: entry.name, changes, conflicts, flags });
        for (const f of flags) allFlags.push({ city: cityShort, id: entry.id, name: entry.name, ...f });
      }
      done++;
      if (done % 20 === 0) console.log(`  ${done}/${tasks.length} processed`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  diffs.sort((a, b) => a.id - b.id);

  // Summary
  const summary = {
    city: cityShort,
    apify_total: apifyResults.length,
    apify_matched: matched,
    apify_unmatched: unmatched.length,
    diffs_count: diffs.length,
    fields_changed: {
      photoUrl:  diffs.filter(d => d.changes.photoUrl).length,
      phone:     diffs.filter(d => d.changes.phone).length,
      website:   diffs.filter(d => d.changes.website).length,
      instagram: diffs.filter(d => d.changes.instagram).length,
      coords:    diffs.filter(d => d.changes.lat).length,
      address:   diffs.filter(d => d.changes.address).length,
    },
    photo_sources: diffs.reduce((acc, d) => {
      if (d.changes._photoSource) acc[d.changes._photoSource] = (acc[d.changes._photoSource]||0) + 1;
      return acc;
    }, {}),
    conflicts: {
      phone:     diffs.filter(d => d.conflicts.phone).length,
      website:   diffs.filter(d => d.conflicts.website).length,
      instagram: diffs.filter(d => d.conflicts.instagram).length,
      address:   diffs.filter(d => d.conflicts.address).length,
    },
    flags: allFlags.length,
  };

  fs.writeFileSync(DIFF_FILE, JSON.stringify({ summary, diffs, unmatched }, null, 2));
  console.log('\nSummary:');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nDiff written to ${DIFF_FILE}`);

  if (dryRun) { console.log('\n[DRY RUN] No changes applied to index.html.'); return; }

  // Apply: modify entries in memory, serialize back single-line (PHX format), substitute span
  let applied = 0;
  for (const d of diffs) {
    const entry = info.arr.find(r => r && r.id === d.id);
    if (!entry) continue;
    for (const [k, v] of Object.entries(d.changes)) {
      if (k.startsWith('_')) continue;
      entry[k] = v;
      applied++;
    }
  }
  const newSlice = JSON.stringify(info.arr);
  const newHtml = html.substring(0, info.start) + newSlice + html.substring(info.end);
  fs.writeFileSync(HTML_FILE, newHtml);
  console.log(`\nApplied ${applied} field changes across ${diffs.length} entries to index.html`);

  // Append to flags + log + state
  const existingFlags = loadJson(FLAGS_FILE, []);
  fs.writeFileSync(FLAGS_FILE, JSON.stringify(existingFlags.concat(allFlags), null, 2));

  for (const d of diffs) appendJsonl(LOG_FILE, { ts: new Date().toISOString(), city: cityShort, ...d });

  const state = loadJson(STATE_FILE, { cities: {}, total_changes: 0 });
  state.cities[cityShort] = { applied_at: new Date().toISOString(), entries_changed: diffs.length, fields_changed: applied };
  state.total_changes = (state.total_changes || 0) + applied;
  state.last_updated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
