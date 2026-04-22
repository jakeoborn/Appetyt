#!/usr/bin/env node
// Backfill museum photos via the same pipeline as backfill-hotel-photos.js:
//   A. Entry's own website: og:image / twitter:image / itemprop=image / link rel=image_src / JSON-LD image
//   B. Wikipedia fallback: Wikimedia pageimages API (landmark museums)
//   Each candidate runs through Nominatim verify (website source only) +
//   Norman's-tier quality gate (>=500x350, AR 1.2-2.3, 50KB-15MB, not a logo).
// Usage: node backfill-museum-photos.js "san diego" [--apply] [--verbose]

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET_CITY = (process.argv[2] || '').toLowerCase();
const APPLY = process.argv.includes('--apply');
const APPLY_WIKI = process.argv.includes('--apply-wiki'); // also apply Source B (Wikipedia) wins
const VERBOSE = process.argv.includes('--verbose');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const REVIEW_DIR = path.join(__dirname, '..', 'museum-photo-reviews');

if (!TARGET_CITY) {
  console.error('Usage: node backfill-museum-photos.js "san diego" [--apply] [--verbose]');
  process.exit(1);
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
// Wikimedia policy requires identifying UA with contact: https://meta.wikimedia.org/wiki/User-Agent_policy
const WIKI_UA = 'Dimhour-PhotoBackfill/1.0 (https://dimhour.com; jakeoborn@yahoo.com) Node.js';

function pickUA(url) {
  const h = (() => { try { return new URL(url).hostname; } catch (_) { return ''; } })();
  if (/wikipedia\.org$|wikimedia\.org$/i.test(h)) return WIKI_UA;
  return UA;
}

function sleepMs(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchText(url, maxRedirects = 5, attempt = 0) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.get(u, { headers: { 'User-Agent': pickUA(url), 'Accept': 'text/html,*/*' }, timeout: 15000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          const next = new URL(res.headers.location, url).toString();
          res.resume();
          return resolve(fetchText(next, maxRedirects - 1, 0));
        }
        if (res.statusCode === 429 && attempt < 3) {
          res.resume();
          const wait = parseInt(res.headers['retry-after'] || '0', 10) * 1000 || (1500 * Math.pow(2, attempt));
          return sleepMs(wait).then(() => fetchText(url, maxRedirects, attempt + 1)).then(resolve);
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

async function headImage(url, maxRedirects = 5, attempt = 0) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.request(u, { method: 'HEAD', headers: { 'User-Agent': pickUA(url), 'Accept': 'image/*' }, timeout: 10000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          res.resume();
          return resolve(headImage(new URL(res.headers.location, url).toString(), maxRedirects - 1, 0));
        }
        if (res.statusCode === 429 && attempt < 3) {
          res.resume();
          const wait = parseInt(res.headers['retry-after'] || '0', 10) * 1000 || (1500 * Math.pow(2, attempt));
          return sleepMs(wait).then(() => headImage(url, maxRedirects, attempt + 1)).then(resolve);
        }
        resolve({ status: res.statusCode, type: res.headers['content-type'] || '', size: parseInt(res.headers['content-length'] || '0', 10) });
      });
      req.on('error', () => resolve({ status: 0, type: '', size: 0 }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, type: '', size: 0 }); });
      req.end();
    } catch (_) { resolve({ status: 0, type: '', size: 0 }); }
  });
}

async function fetchImage(url, maxRedirects = 5, attempt = 0) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.get(u, { headers: { 'User-Agent': pickUA(url), 'Accept': 'image/*' }, timeout: 15000 }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          res.resume();
          return resolve(fetchImage(new URL(res.headers.location, url).toString(), maxRedirects - 1, 0));
        }
        if (res.statusCode === 429 && attempt < 3) {
          res.resume();
          const wait = parseInt(res.headers['retry-after'] || '0', 10) * 1000 || (1500 * Math.pow(2, attempt));
          return sleepMs(wait).then(() => fetchImage(url, maxRedirects, attempt + 1)).then(resolve);
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
    } catch (_) { /* malformed JSON-LD skip */ }
  }

  if (cands.length === 0) {
    const imgRe = /<img[^>]+(?:src|data-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["'][^>]*>/gi;
    let im, count = 0;
    while ((im = imgRe.exec(html)) !== null && count < 10) {
      const src = im[1];
      if (/hero|banner|header|exterior|gallery|facade|building|atrium|lobby/i.test(src)) { push(src, 'img:hero'); count++; }
    }
  }

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

async function sourceWebsite(website) {
  if (!website || !/^https?:\/\//.test(website)) return [];
  const { body, finalUrl } = await fetchText(website);
  if (!body) return [];
  return collectCandidates(body, finalUrl || website);
}

// Strict gate: the Wikipedia article title MUST contain a museum-y noun
// AND share at least one distinctive (non-stopword) token with the museum name.
// Rejects: generic dictionary articles, articles about adjacent buildings,
// articles about things merely sharing a word with the museum.
function isWikipediaArticleAboutMuseum(museumName, articleTitle) {
  if (!articleTitle) return false;
  const bad = /shooting|attack|bombing|list of|history of|timeline of|massacre|tragedy|scandal|controversy|disaster|fire at|strike|war|riot|deaths at|incidents at|\(film\)|\(cocktail\)|\(song\)|\(album\)|\(novel\)|\(band\)|\(disambiguation\)|\(magazine\)|\(TV/i;
  if (bad.test(articleTitle)) return false;
  // Article title must contain a museum-y noun OR be an exact-name match for the venue.
  const museumNoun = /museum|gallery|collection|memorial|institute|aquarium|planetarium|observatory|garden|park|zoo|library|center|centre|house|hall|monument|dam|bridge|tower|sphere/i;
  if (!museumNoun.test(articleTitle)) {
    // Allow only if the article title is essentially the entry name (case-insensitive substring).
    const norm = (s) => s.toLowerCase().replace(/^the\s+/i, '').trim();
    if (!norm(articleTitle).includes(norm(museumName)) && !norm(museumName).includes(norm(articleTitle))) return false;
  }
  const stop = new Set(['museum', 'gallery', 'collection', 'center', 'centre', 'institute', 'foundation', 'house', 'hall', 'park', 'art', 'arts', 'science', 'history', 'natural', 'national', 'american', 'modern', 'contemporary', 'fine', 'the', 'a', 'an', 'at', 'in', 'on', 'of', 'and', '&', 'by', 'la', 'las', 'new', 'san', 'los']);
  const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t && !stop.has(t));
  const mTok = new Set(tokens(museumName));
  const aTok = tokens(articleTitle);
  if (mTok.size === 0) {
    // Museum name was all stop-words (e.g., "Museum of Modern Art"); fall back to substring match.
    return articleTitle.toLowerCase().includes(museumName.toLowerCase().replace(/^the\s+/i, ''));
  }
  const hit = aTok.filter((t) => mTok.has(t)).length;
  if (hit === 0) return false;
  // Require ALL distinctive museum tokens to appear in the article title.
  // Stops "Atomic Museum" matching "Atomic (cocktail)" since "(cocktail)" is also bad-pattern,
  // and stops single-token matches passing for short museum names like "Sphere".
  if (hit < mTok.size) return false;
  return true;
}

async function sourceWikipedia(name, city) {
  const q = encodeURIComponent(`${name} ${city} museum`);
  // Pull top-3 search results; we only want highly-relevant articles.
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&generator=search&gsrnamespace=0&gsrlimit=3&gsrsearch=${q}`;
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
      if (!isWikipediaArticleAboutMuseum(name, p.title)) continue;
      cands.push({ url: p.original.source, source: `wikipedia:${p.title}`, idx: p.index || 99 });
    }
    cands.sort((a, b) => a.idx - b.idx);
    return cands;
  } catch (_) { return []; }
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// Source C: Wikidata P18 (image) — vastly more reliable than Wikipedia pageimages because:
//   - the entity is location/type-anchored (verified Q-ID, P31 instance-of museum/landmark)
//   - P18 is editor-curated as the canonical photo of the entity (not a related building)
//   - returns Commons FilePath URL we can size-request via ?width=2000
// Workflow: wbsearchentities(name + city) -> top 3 Q-IDs -> wbgetentities(P18, P31, P625, P159) ->
// keep only entities whose P31 is museum-ish AND whose name matches AND have a P18.
const MUSEUM_INSTANCE_QIDS = new Set([
  'Q33506',    // museum
  'Q207694',   // art museum
  'Q1007870',  // art gallery
  'Q1568346',  // historic house museum
  'Q5193377',  // cultural property
  'Q2772772',  // monument
  'Q839954',   // archaeological site
  'Q1497364',  // building
  'Q1075',     // dam
  'Q12280',    // bridge
  'Q41176',    // skyscraper / tower
  'Q174782',   // public square
  'Q22698',    // park
  'Q23397',    // lake
  'Q570116',   // tourist attraction
  'Q4989906',  // monument (national)
  'Q11303',    // skyscraper
  'Q1370598',  // visitor center
  'Q588140',   // science museum
  'Q588962',   // botanical garden
  'Q43229',    // organization (broad - allow if name matches)
  'Q35854',    // memorial
  'Q838948',   // work of art
  'Q4438121',  // sports venue
  'Q47521',    // stadium
  'Q57821',    // fortification
  'Q16560',    // palace
  'Q23413',    // castle
  'Q860861',   // sculpture
  'Q39614',    // cemetery
  'Q41253',    // movie theater
  'Q57831',    // observatory
  'Q623578',   // amusement ride
  'Q42889',    // vehicle (ships in museums)
  'Q1107656',  // arena
  'Q14092',    // building complex
  'Q635846',   // amusement park
  'Q1445650',  // holiday house
  'Q31855',    // research institute
]);

function nameMatchesEntityLabel(museumName, label) {
  if (!label) return false;
  const norm = (s) => s.toLowerCase().replace(/^the\s+/i, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const m = norm(museumName), l = norm(label);
  if (l.includes(m) || m.includes(l)) return true;
  const stop = new Set(['museum', 'gallery', 'collection', 'center', 'centre', 'institute', 'house', 'hall', 'park', 'art', 'arts', 'science', 'history', 'natural', 'national', 'american', 'modern', 'contemporary', 'fine', 'the', 'a', 'an', 'at', 'in', 'on', 'of', 'and', 'by', 'la', 'las', 'new', 'san', 'los']);
  const tokens = (s) => s.split(' ').filter((t) => t && !stop.has(t));
  const mTok = new Set(tokens(m));
  const lTok = tokens(l);
  if (mTok.size === 0) return false;
  const hit = lTok.filter((t) => mTok.has(t)).length;
  return hit === mTok.size;
}

async function sourceWikidata(name, city, lat, lng) {
  // 1) search Wikidata for entities matching the museum name in the city
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=5&search=${encodeURIComponent(name)}`;
  const { body: searchBody } = await fetchText(searchUrl);
  if (!searchBody) return [];
  let qids = [];
  try {
    const sd = JSON.parse(searchBody);
    qids = (sd.search || []).map((s) => ({ qid: s.id, label: s.label, description: s.description }));
  } catch (_) { return []; }
  if (!qids.length) return [];

  // 2) fetch entity details for the top 5 candidates
  const ids = qids.map((q) => q.qid).join('|');
  const getUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${ids}&props=labels|descriptions|claims`;
  const { body: getBody } = await fetchText(getUrl);
  if (!getBody) return [];
  let entities = {};
  try { entities = JSON.parse(getBody).entities || {}; } catch (_) { return []; }

  const cands = [];
  for (const q of qids) {
    const ent = entities[q.qid];
    if (!ent || !ent.claims) continue;
    // P18 = image. P31 = instance of. P625 = coordinates. P17 = country.
    const p18 = ent.claims.P18;
    if (!p18 || !p18.length) continue;
    const p31 = ent.claims.P31 || [];
    const p31Qids = p31.map((c) => c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value && c.mainsnak.datavalue.value.id).filter(Boolean);
    const isMuseumInstance = p31Qids.some((id) => MUSEUM_INSTANCE_QIDS.has(id));
    // Verify name match against the entity's English label
    const entLabel = (ent.labels && ent.labels.en && ent.labels.en.value) || q.label;
    const labelMatches = nameMatchesEntityLabel(name, entLabel);
    if (!isMuseumInstance && !labelMatches) continue;
    if (!labelMatches) continue;
    // Verify location if we have coords
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const p625 = ent.claims.P625 && ent.claims.P625[0];
      if (p625 && p625.mainsnak && p625.mainsnak.datavalue && p625.mainsnak.datavalue.value) {
        const v = p625.mainsnak.datavalue.value;
        const dist = Math.hypot(v.latitude - lat, v.longitude - lng) * 69;
        if (dist > 5.0) continue; // entity is too far from the museum's claimed location
      }
    }
    // P18's value is a Commons filename
    const filename = p18[0].mainsnak && p18[0].mainsnak.datavalue && p18[0].mainsnak.datavalue.value;
    if (!filename) continue;
    const imgUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=2000`;
    cands.push({ url: imgUrl, source: `wikidata:${q.qid}:${entLabel}` });
  }
  return cands;
}

async function tryCandidates(cands, nom, log) {
  for (const cand of cands) {
    const gate = await qualityGate(cand.url);
    log.push(`    [${cand.source}] ${gate.ok ? 'PASS' : 'fail'} ${gate.ok ? `${gate.w}x${gate.h} ar${gate.ar} ${Math.round(gate.size / 1024)}kb` : gate.reason} - ${cand.url.slice(0, 120)}`);
    if (gate.ok) return { cand, gate };
  }
  return null;
}

async function main() {
  const txt = fs.readFileSync(INDEX_PATH, 'utf8');
  const dataStart = txt.indexOf('const MUSEUM_DATA = {');
  if (dataStart < 0) { console.error('MUSEUM_DATA not found'); process.exit(1); }
  let depth = 1, j = dataStart + 'const MUSEUM_DATA = '.length + 1;
  while (j < txt.length && depth > 0) { const c = txt[j]; if (c === '{') depth++; else if (c === '}') depth--; j++; if (depth === 0) break; }
  const dataBlock = txt.slice(dataStart, j);

  const cityHeader = `"${TARGET_CITY}":`;
  const cityIdx = dataBlock.indexOf(cityHeader);
  if (cityIdx < 0) { console.error(`City "${TARGET_CITY}" not found in MUSEUM_DATA`); process.exit(1); }
  let k = cityIdx;
  while (k < dataBlock.length && dataBlock[k] !== '[') k++;
  const arrStart = k;
  let bracketDepth = 1; k++;
  while (k < dataBlock.length && bracketDepth > 0) { if (dataBlock[k] === '[') bracketDepth++; else if (dataBlock[k] === ']') bracketDepth--; k++; if (bracketDepth === 0) break; }
  const arrEnd = k;
  const arrSlice = dataBlock.slice(arrStart, arrEnd);

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

    let winner = null;
    if (website && /^https?:\/\//.test(website)) {
      const nom = await nominatimVerify(name, address, lat, lng);
      await sleep(1100);
      if (nom.ok) {
        const webCands = await sourceWebsite(website);
        row.log.push(`  [A] website ${website} -> ${webCands.length} candidates`);
        winner = await tryCandidates(webCands, nom, row.log);
      } else {
        row.log.push(`  [A] website skipped - nominatim:${nom.reason} (will try Wikipedia)`);
      }
    } else {
      row.log.push(`  [A] website skipped - no-website`);
    }

    // Source C - Wikidata P18 (entity-anchored, P31 instance-of museum, P18 curated image)
    if (!winner) {
      const wdCands = await sourceWikidata(name, cityDisplayName, lat, lng);
      row.log.push(`  [C] wikidata -> ${wdCands.length} candidates (P31+name match)`);
      winner = await tryCandidates(wdCands, null, row.log);
    }

    if (!winner) {
      const wikiCands = await sourceWikipedia(name, cityDisplayName);
      row.log.push(`  [B] wikipedia -> ${wikiCands.length} candidates (strict name match)`);
      winner = await tryCandidates(wikiCands, null, row.log);
    }

    if (winner) {
      row.chosen = winner.cand;
      row.gate = winner.gate;
      // Source A (website+Nominatim) and Source C (Wikidata P18) are high-confidence -> auto-apply.
      // Source B (Wikipedia pageimages) needs human review -> default to "review" unless --apply-wiki.
      const isWiki = winner.cand.source && winner.cand.source.startsWith('wikipedia:');
      row.decision = isWiki ? 'review' : 'apply';
      row.reason = `ok:${winner.cand.source}:${winner.gate.w}x${winner.gate.h}-ar${winner.gate.ar}-${Math.round(winner.gate.size / 1024)}kb`;
    } else {
      row.decision = 'skip';
      row.reason = 'all-sources-failed';
    }
    report.push(row);
  }

  console.log(`\n=== ${TARGET_CITY} MUSEUM PHOTO BACKFILL ===`);
  for (const r of report) {
    console.log(`\n[${r.id}] ${r.name}`);
    console.log(`  DECISION: ${r.decision.toUpperCase()} - ${r.reason}`);
    if (r.chosen) console.log(`  photo: ${r.chosen.url}`);
    if (VERBOSE && r.log.length) r.log.forEach((l) => console.log(l));
  }
  const applyCount = report.filter(r => r.decision === 'apply').length;
  const reviewCount = report.filter(r => r.decision === 'review').length;
  const skipExisting = report.filter(r => r.reason === 'already-has-photoUrl').length;
  const failed = report.filter(r => r.reason === 'all-sources-failed').length;
  console.log(`\n=== Summary: apply=${applyCount}  review=${reviewCount}  already=${skipExisting}  failed=${failed}  total=${report.length} ===\n`);

  // Always write a review-list JSON so user can inspect Source B (Wikipedia) candidates.
  const reviewRows = report.filter(r => r.decision === 'review');
  if (reviewRows.length) {
    if (!fs.existsSync(REVIEW_DIR)) fs.mkdirSync(REVIEW_DIR, { recursive: true });
    const slug = TARGET_CITY.replace(/\s+/g, '-');
    const reviewPath = path.join(REVIEW_DIR, `${slug}.json`);
    fs.writeFileSync(reviewPath, JSON.stringify(reviewRows.map(r => ({
      id: r.id, name: r.name, address: r.address,
      proposed: r.chosen.url, source: r.chosen.source,
      dims: `${r.gate.w}x${r.gate.h}`, ar: r.gate.ar, kb: Math.round(r.gate.size / 1024)
    })), null, 2));
    console.log(`Wrote ${reviewRows.length} Wikipedia candidates to ${reviewPath} for user review.`);
    console.log(`After spot-check, re-run with --apply --apply-wiki to commit Wikipedia matches too.\n`);
  }

  if (!APPLY) {
    console.log('Dry-run. Re-run with --apply to write Source A photoUrls (and --apply-wiki for Wikipedia matches).');
    return;
  }

  const applyRows = report.filter(r => r.decision === 'apply' || (APPLY_WIKI && r.decision === 'review'));
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

  const newDataBlock = dataBlock.slice(0, arrStart) + newArrSlice + dataBlock.slice(arrEnd);
  const newTxt = txt.slice(0, dataStart) + newDataBlock + txt.slice(j);
  fs.writeFileSync(INDEX_PATH, newTxt);
  console.log(`\nApplied ${applyRows.length} photoUrl updates for ${TARGET_CITY} museums.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
