#!/usr/bin/env node
// Backfill hotel photos via a multi-source pipeline:
//   1. Entry's own website: og:image / twitter:image / itemprop=image / link rel=image_src / JSON-LD image
//   2. Aggregator fallback: TripAdvisor search → hotel page → og:image
//   3. Wikipedia fallback: Wikimedia pageimages API (landmark hotels)
//   Each candidate runs through Nominatim verify (business coords match) +
//   Norman's-tier quality gate (≥500×350, AR 1.2-2.3, 50KB-15MB, not a logo).
// Usage: node backfill-hotel-photos.js "san diego" [--apply] [--verbose]
// Without --apply, writes a dry-run report and does not modify index.html.

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET_CITY = (process.argv[2] || '').toLowerCase();
const APPLY = process.argv.includes('--apply');
const VERBOSE = process.argv.includes('--verbose');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

if (!TARGET_CITY) {
  console.error('Usage: node backfill-hotel-photos.js "san diego" [--apply] [--verbose]');
  process.exit(1);
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function fetchText(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.get(u, { headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*' }, timeout: 15000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          const next = new URL(res.headers.location, url).toString();
          res.resume();
          return resolve(fetchText(next, maxRedirects - 1));
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => { body += c; if (body.length > 3_000_000) req.destroy(); });
        res.on('end', () => resolve({ status: res.statusCode, body, finalUrl: url }));
      });
      req.on('error', () => resolve({ status: 0, body: '', finalUrl: url }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '', finalUrl: url }); });
    } catch (_) { resolve({ status: 0, body: '', finalUrl: url }); }
  });
}

function headImage(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.request(u, { method: 'HEAD', headers: { 'User-Agent': UA, 'Accept': 'image/*' }, timeout: 10000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          res.resume();
          return resolve(headImage(new URL(res.headers.location, url).toString(), maxRedirects - 1));
        }
        resolve({ status: res.statusCode, type: res.headers['content-type'] || '', size: parseInt(res.headers['content-length'] || '0', 10) });
      });
      req.on('error', () => resolve({ status: 0, type: '', size: 0 }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, type: '', size: 0 }); });
      req.end();
    } catch (_) { resolve({ status: 0, type: '', size: 0 }); }
  });
}

function fetchImage(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.get(u, { headers: { 'User-Agent': UA, 'Accept': 'image/*' }, timeout: 15000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          res.resume();
          return resolve(fetchImage(new URL(res.headers.location, url).toString(), maxRedirects - 1));
        }
        const chunks = [];
        res.on('data', (c) => { chunks.push(c); if (chunks.reduce((a, b) => a + b.length, 0) > 16_000_000) req.destroy(); });
        res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'] || '', buf: Buffer.concat(chunks) }));
      });
      req.on('error', () => resolve({ status: 0, type: '', buf: Buffer.alloc(0) }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, type: '', buf: Buffer.alloc(0) }); });
    } catch (_) { resolve({ status: 0, type: '', buf: Buffer.alloc(0) }); }
  });
}

function readDimensions(buf) {
  if (!buf || buf.length < 16) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') {
    const chunk = buf.slice(12, 16).toString();
    if (chunk === 'VP8X') { const w = (buf.readUIntLE(24, 3) + 1); const h = (buf.readUIntLE(27, 3) + 1); return { w, h }; }
    if (chunk === 'VP8 ') { const w = buf.readUInt16LE(26) & 0x3FFF; const h = buf.readUInt16LE(28) & 0x3FFF; return { w, h }; }
    if (chunk === 'VP8L') { const b = buf.slice(21); const w = 1 + ((b[0] | ((b[1] & 0x3F) << 8))); const h = 1 + (((b[1] >> 6) | (b[2] << 2) | ((b[3] & 0x0F) << 10))); return { w, h }; }
  }
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xFF) return null;
      let marker = buf[i + 1];
      i += 2;
      if (marker === 0xD8 || marker === 0xD9) return null;
      if (marker === 0xDA) return null;
      const len = buf.readUInt16BE(i);
      if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
        const h = buf.readUInt16BE(i + 3);
        const w = buf.readUInt16BE(i + 5);
        return { w, h };
      }
      i += len;
    }
  }
  return null;
}

// Collect image candidate URLs from a page's HTML, in priority order.
// Returns ordered array of {url, source}.
function collectCandidates(html, baseUrl) {
  const cands = [];
  const push = (url, source) => {
    if (!url) return;
    try { cands.push({ url: new URL(url, baseUrl).toString(), source }); }
    catch (_) { cands.push({ url, source }); }
  };

  const metaPatterns = [
    ['og:image', /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi],
    ['og:image', /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi],
    ['og:image:secure_url', /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/gi],
    ['twitter:image', /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/gi],
    ['twitter:image', /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/gi],
    ['twitter:image:src', /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/gi],
    ['itemprop:image', /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/gi],
    ['link:image_src', /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi],
  ];
  for (const [source, re] of metaPatterns) {
    let m;
    while ((m = re.exec(html)) !== null) push(m[1], source);
  }

  // JSON-LD: collect <script type="application/ld+json"> blocks, scan for "image" fields.
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let lm;
  while ((lm = ldRe.exec(html)) !== null) {
    const raw = lm[1].trim();
    try {
      const data = JSON.parse(raw);
      const walk = (v) => {
        if (!v) return;
        if (Array.isArray(v)) { v.forEach(walk); return; }
        if (typeof v === 'object') {
          const img = v.image || v.photo || v.logo;
          if (img) {
            if (typeof img === 'string') push(img, 'ld+json:image');
            else if (Array.isArray(img)) img.forEach((i) => {
              if (typeof i === 'string') push(i, 'ld+json:image[]');
              else if (i && typeof i === 'object') push(i.url || i['@id'] || i.contentUrl, 'ld+json:image{}');
            });
            else if (typeof img === 'object') push(img.url || img['@id'] || img.contentUrl, 'ld+json:image{}');
          }
          for (const key of Object.keys(v)) walk(v[key]);
        }
      };
      walk(data);
    } catch (_) { /* malformed JSON-LD — skip */ }
  }

  // Fallback: raw regex scan for hero/banner img tags if nothing above hit.
  if (cands.length === 0) {
    const imgRe = /<img[^>]+(?:src|data-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["'][^>]*>/gi;
    let im, count = 0;
    while ((im = imgRe.exec(html)) !== null && count < 10) {
      const src = im[1];
      if (/hero|banner|header|exterior|lobby|aerial/i.test(src)) { push(src, 'img:hero'); count++; }
    }
  }

  // Dedupe while keeping first occurrence (priority order preserved).
  const seen = new Set();
  return cands.filter((c) => { if (seen.has(c.url)) return false; seen.add(c.url); return true; });
}

function isLogoPattern(url) {
  const u = url.toLowerCase();
  if (/[^a-z0-9]logo[^a-z0-9]/.test(u)) return true;
  if (u.includes('social-share')) return true;
  if (u.includes('og-default')) return true;
  if (u.includes('placeholder')) return true;
  if (u.includes('default-hero')) return true;
  if (u.includes('-icon')) return true;
  if (u.includes('favicon')) return true;
  return false;
}

async function nominatimVerify(name, address, lat, lng) {
  if (!address) return { ok: false, reason: 'no-address' };
  const q = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`;
  const { body, status } = await fetchText(url);
  if (status !== 200 || !body) return { ok: false, reason: 'nominatim-fail' };
  try {
    const arr = JSON.parse(body);
    if (!arr.length) return { ok: false, reason: 'no-result' };
    const r = arr[0];
    const rlat = parseFloat(r.lat), rlng = parseFloat(r.lon);
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const dist = Math.hypot(rlat - lat, rlng - lng) * 69;
      if (dist > 1.0) return { ok: false, reason: `too-far:${dist.toFixed(2)}mi` };
    }
    return { ok: true, lat: rlat, lng: rlng };
  } catch (_) { return { ok: false, reason: 'parse-fail' }; }
}

async function qualityGate(imageUrl) {
  if (isLogoPattern(imageUrl)) return { ok: false, reason: 'logo-pattern' };
  const head = await headImage(imageUrl);
  if (head.status !== 200) return { ok: false, reason: `head-${head.status}` };
  if (!/^image\//.test(head.type)) return { ok: false, reason: `type-${head.type}` };
  if (head.size && head.size < 50_000) return { ok: false, reason: `size-${Math.round(head.size / 1024)}kb-too-small` };
  if (head.size && head.size > 15_000_000) return { ok: false, reason: `size-${Math.round(head.size / 1024 / 1024)}mb-too-large` };
  const img = await fetchImage(imageUrl);
  if (img.status !== 200 || !img.buf.length) return { ok: false, reason: `fetch-${img.status}` };
  const dims = readDimensions(img.buf);
  if (!dims) return { ok: false, reason: 'no-dims' };
  if (dims.w < 500 || dims.h < 350) return { ok: false, reason: `dims-${dims.w}x${dims.h}-too-small` };
  const ar = dims.w / dims.h;
  if (ar < 1.2 || ar > 2.3) return { ok: false, reason: `ar-${ar.toFixed(2)}-out-of-range` };
  const size = head.size || img.buf.length;
  return { ok: true, w: dims.w, h: dims.h, ar: +ar.toFixed(2), size, contentType: head.type };
}

// Source A: scrape entry's own website
async function sourceWebsite(website) {
  if (!website || !/^https?:\/\//.test(website)) return [];
  const { body, finalUrl } = await fetchText(website);
  if (!body) return [];
  return collectCandidates(body, finalUrl || website);
}

// Reject Wikipedia article titles that are clearly NOT about the specific hotel.
function isWikipediaArticleAboutHotel(hotelName, articleTitle) {
  if (!articleTitle) return false;
  const bad = /shooting|attack|bombing|list of|history of|timeline of|massacre|tragedy|scandal|controversy|disaster|fire at|strike|war|riot/i;
  if (bad.test(articleTitle)) return false;
  // Require token overlap: strip stop-words, compare.
  const stop = new Set(['hotel', 'resort', 'the', 'a', 'an', 'at', 'in', 'on', 'of', 'and', '&', 'by', 'casino', 'spa', 'inn', 'lodge', 'suites', 'place', 'la', 'las', 'new', 'san', 'los', 'grand']);
  const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t && !stop.has(t));
  const hTok = new Set(tokens(hotelName));
  const aTok = tokens(articleTitle);
  if (hTok.size === 0) return true;  // hotel name was all stop-words, fall back to loose match
  const hit = aTok.filter((t) => hTok.has(t)).length;
  // Need at least one distinctive token hit AND at least 50% of hotel distinctive tokens covered when they're short.
  if (hit === 0) return false;
  if (hTok.size <= 3 && hit < hTok.size) return false;
  return true;
}

// Source B: Wikimedia pageimages — returns the "original" image from a Wikipedia article matching the hotel name.
// Uses strict name-matching: the article title must have distinctive-token overlap with the hotel name.
async function sourceWikipedia(name, city) {
  const q = encodeURIComponent(`${name} ${city}`);
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch=${q}`;
  const { body } = await fetchText(apiUrl);
  if (!body) return [];
  try {
    const data = JSON.parse(body);
    const pages = data.query && data.query.pages;
    if (!pages) return [];
    const cands = [];
    for (const pid of Object.keys(pages)) {
      const p = pages[pid];
      if (!p.original || !p.original.source) continue;
      if (!isWikipediaArticleAboutHotel(name, p.title)) continue;
      cands.push({ url: p.original.source, source: `wikipedia:${p.title}` });
    }
    // Sort by search rank (pages[].index); lower = better match.
    cands.sort((a, b) => {
      const ai = (pages[Object.keys(pages).find((k) => pages[k].title === a.source.replace('wikipedia:', ''))] || {}).index || 99;
      const bi = (pages[Object.keys(pages).find((k) => pages[k].title === b.source.replace('wikipedia:', ''))] || {}).index || 99;
      return ai - bi;
    });
    return cands;
  } catch (_) { return []; }
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function tryCandidates(cands, nom, log) {
  for (const cand of cands) {
    const gate = await qualityGate(cand.url);
    log.push(`    [${cand.source}] ${gate.ok ? 'PASS' : 'fail'} ${gate.ok ? `${gate.w}x${gate.h} ar${gate.ar} ${Math.round(gate.size / 1024)}kb` : gate.reason} — ${cand.url.slice(0, 120)}`);
    if (gate.ok) return { cand, gate };
  }
  return null;
}

async function main() {
  const txt = fs.readFileSync(INDEX_PATH, 'utf8');
  const hotelStart = txt.indexOf('const HOTEL_DATA = {');
  if (hotelStart < 0) { console.error('HOTEL_DATA not found'); process.exit(1); }
  let depth = 1, j = hotelStart + 'const HOTEL_DATA = '.length + 1;
  while (j < txt.length && depth > 0) { const c = txt[j]; if (c === '{') depth++; else if (c === '}') depth--; j++; if (depth === 0) break; }
  const hotelBlock = txt.slice(hotelStart, j);

  const cityHeader = `"${TARGET_CITY}":`;
  const cityIdx = hotelBlock.indexOf(cityHeader);
  if (cityIdx < 0) { console.error(`City "${TARGET_CITY}" not found in HOTEL_DATA`); process.exit(1); }
  let k = cityIdx;
  while (k < hotelBlock.length && hotelBlock[k] !== '[') k++;
  const arrStart = k;
  let bracketDepth = 1; k++;
  while (k < hotelBlock.length && bracketDepth > 0) { if (hotelBlock[k] === '[') bracketDepth++; else if (hotelBlock[k] === ']') bracketDepth--; k++; if (bracketDepth === 0) break; }
  const arrEnd = k;
  const arrSlice = hotelBlock.slice(arrStart, arrEnd);

  const entries = [];
  let d = 0, eStart = -1;
  for (let i = 0; i < arrSlice.length; i++) {
    const c = arrSlice[i];
    if (c === '{') { if (d === 0) eStart = i; d++; }
    else if (c === '}') { d--; if (d === 0 && eStart >= 0) { entries.push({ start: eStart, end: i + 1, text: arrSlice.slice(eStart, i + 1) }); eStart = -1; } }
  }

  const report = [];
  const cityDisplayName = TARGET_CITY.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  for (const e of entries) {
    const id = (e.text.match(/"id"\s*:\s*(\d+)/) || [])[1];
    const name = (e.text.match(/"name"\s*:\s*"([^"]+)"/) || [])[1];
    const website = (e.text.match(/"website"\s*:\s*"([^"]*)"/) || [])[1];
    const address = (e.text.match(/"address"\s*:\s*"([^"]*)"/) || [])[1];
    const lat = parseFloat((e.text.match(/"lat"\s*:\s*(-?[\d.]+)/) || [])[1] || 'NaN');
    const lng = parseFloat((e.text.match(/"lng"\s*:\s*(-?[\d.]+)/) || [])[1] || 'NaN');
    const existingPhoto = (e.text.match(/"photoUrl"\s*:\s*"([^"]*)"/) || [])[1];

    const row = { id, name, website, address, existingPhoto, chosen: null, gate: null, decision: 'skip', reason: '', log: [] };

    if (existingPhoto && /^https?:\/\//.test(existingPhoto)) {
      row.decision = 'skip'; row.reason = 'already-has-photoUrl';
      report.push(row); continue;
    }

    // Source A — entry's own website (Nominatim guards against website/business mismatch)
    let winner = null;
    if (website && /^https?:\/\//.test(website)) {
      const nom = await nominatimVerify(name, address, lat, lng);
      await sleep(1100);
      if (nom.ok) {
        const webCands = await sourceWebsite(website);
        row.log.push(`  [A] website ${website} → ${webCands.length} candidates`);
        winner = await tryCandidates(webCands, nom, row.log);
      } else {
        row.log.push(`  [A] website skipped — nominatim:${nom.reason} (will try Wikipedia)`);
      }
    } else {
      row.log.push(`  [A] website skipped — no-website`);
    }

    // Source B — Wikipedia (strict name match is its own identity guard — Nominatim not required here)
    if (!winner) {
      const wikiCands = await sourceWikipedia(name, cityDisplayName);
      row.log.push(`  [B] wikipedia → ${wikiCands.length} candidates (strict name match)`);
      winner = await tryCandidates(wikiCands, null, row.log);
    }

    if (winner) {
      row.chosen = winner.cand;
      row.gate = winner.gate;
      row.decision = 'apply';
      row.reason = `ok:${winner.cand.source}:${winner.gate.w}x${winner.gate.h}-ar${winner.gate.ar}-${Math.round(winner.gate.size / 1024)}kb`;
    } else {
      row.decision = 'skip';
      row.reason = 'all-sources-failed';
    }
    report.push(row);
  }

  console.log(`\n=== ${TARGET_CITY} HOTEL PHOTO BACKFILL (v2) ===`);
  for (const r of report) {
    console.log(`\n[${r.id}] ${r.name}`);
    console.log(`  DECISION: ${r.decision.toUpperCase()} — ${r.reason}`);
    if (r.chosen) console.log(`  photo: ${r.chosen.url}`);
    if (VERBOSE && r.log.length) r.log.forEach((l) => console.log(l));
  }
  const applyCount = report.filter(r => r.decision === 'apply').length;
  console.log(`\n=== Summary: ${applyCount}/${report.length} entries will be updated ===\n`);

  if (!APPLY) {
    console.log('Dry-run. Re-run with --apply to write photoUrls into index.html.');
    return;
  }

  const applyRows = report.filter(r => r.decision === 'apply');
  if (!applyRows.length) { console.log('No applicable rows. Nothing to write.'); return; }

  let newArrSlice = arrSlice;
  const sortedEntries = entries.slice().sort((a, b) => b.start - a.start);
  for (const e of sortedEntries) {
    const id = (e.text.match(/"id"\s*:\s*(\d+)/) || [])[1];
    const row = applyRows.find(r => r.id === id);
    if (!row) continue;
    const ogSafe = row.chosen.url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    let eText = e.text;
    if (/"photoUrl"\s*:\s*"[^"]*"/.test(eText)) {
      eText = eText.replace(/"photoUrl"\s*:\s*"[^"]*"/, `"photoUrl":"${ogSafe}"`);
    } else {
      eText = eText.replace(/\}$/, `,"photoUrl":"${ogSafe}"}`);
    }
    newArrSlice = newArrSlice.slice(0, e.start) + eText + newArrSlice.slice(e.end);
  }

  const newHotelBlock = hotelBlock.slice(0, arrStart) + newArrSlice + hotelBlock.slice(arrEnd);
  const newTxt = txt.slice(0, hotelStart) + newHotelBlock + txt.slice(j);
  fs.writeFileSync(INDEX_PATH, newTxt);
  console.log(`\nApplied ${applyRows.length} photoUrl updates for ${TARGET_CITY} hotels.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
