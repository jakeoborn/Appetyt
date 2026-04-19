// For entries without photoUrl that have a website, scrape the homepage
// and find the best image meeting tier-1 bar. Tries, in order:
// 1) og:image / og:image:secure_url
// 2) twitter:image / twitter:image:src
// 3) link rel="image_src"
// 4) First large <img> on the page with width >= 500 (by attribute or URL hint)
// 5) image_src from JSON-LD @type Restaurant
//
// Writes: scripts/apify-extra-photos-{city}.json
// Usage: node scripts/apify-fetch-extra-photos.js <CITY_VAR>

const fs = require('fs');

const cityVar = process.argv[2];
if (!cityVar) { console.error('Usage: node apify-fetch-extra-photos.js <CITY_VAR>'); process.exit(1); }
const cityShort = cityVar.replace('_DATA', '').toLowerCase();

const html = fs.readFileSync('index.html', 'utf8');

function extractArray(varDecl) {
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
      const slice = html.substring(start, i + 1);
      try { return JSON.parse(slice); } catch { return (new Function('return ' + slice))(); }
    }}
  }
}

function absolutize(url, base) {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  try { return new URL(url, base).toString(); } catch { return url; }
}

function isLikelyLogo(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg')) return true;
  return /[^a-z0-9]logo[^a-z0-9]|favicon|[^a-z0-9]icon[^a-z0-9]|brand[^a-z0-9]?mark|sprite|placeholder/.test(lower);
}

function extractAllCandidates(htmlStr, baseUrl) {
  const candidates = [];
  const seen = new Set();
  const push = (url, source) => {
    if (!url) return;
    const abs = absolutize(url, baseUrl);
    if (!/^https?:\/\//.test(abs)) return;
    if (seen.has(abs)) return;
    seen.add(abs);
    candidates.push({ url: abs, source });
  };
  // 1) og:image + og:image:secure_url (may have multiple)
  const ogRe = /<meta\s+(?:[^>]*?\s+)?(?:property|name)=["']og:image(?::secure_url)?["'][^>]*?content=["']([^"']+)["']/gi;
  let m;
  while ((m = ogRe.exec(htmlStr))) push(m[1], 'og:image');
  // 2) twitter:image / twitter:image:src
  const twRe = /<meta\s+(?:[^>]*?\s+)?(?:property|name)=["']twitter:image(?::src)?["'][^>]*?content=["']([^"']+)["']/gi;
  while ((m = twRe.exec(htmlStr))) push(m[1], 'twitter:image');
  // 3) link rel="image_src"
  const linkRe = /<link\s+(?:[^>]*?\s+)?rel=["']image_src["'][^>]*?href=["']([^"']+)["']/gi;
  while ((m = linkRe.exec(htmlStr))) push(m[1], 'link-image_src');
  // 4) JSON-LD image fields (Restaurant / Organization schemas often have a big image)
  const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = jsonLdRe.exec(htmlStr))) {
    try {
      const data = JSON.parse(m[1].trim());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const graph = item['@graph'] || [item];
        for (const node of graph) {
          if (node && node.image) {
            const imgs = Array.isArray(node.image) ? node.image : [node.image];
            for (const img of imgs) {
              if (typeof img === 'string') push(img, 'jsonld-image');
              else if (img && img.url) push(img.url, 'jsonld-image');
            }
          }
        }
      }
    } catch {}
  }
  // 5) First large <img> tags on the page (width attribute OR style width)
  const imgRe = /<img\s+([^>]+?)\/?>/gi;
  while ((m = imgRe.exec(htmlStr))) {
    const attrs = m[1];
    const srcM = attrs.match(/\ssrc=["']([^"']+)["']/i) || attrs.match(/\sdata-src=["']([^"']+)["']/i) || attrs.match(/\sdata-lazy-src=["']([^"']+)["']/i);
    if (!srcM) continue;
    const src = srcM[1];
    const widthM = attrs.match(/\swidth=["']?(\d+)/) || (attrs.match(/width:\s*(\d+)/i));
    const width = widthM ? parseInt(widthM[1], 10) : 0;
    // Only keep if width >= 500 OR URL hints at large (e.g. 1200w, 1500w, 1920, scaled, full)
    if (width >= 500 || /\b(12\d{2}|15\d{2}|19\d{2}|24\d{2})(w|x)?\b|scaled|full|large|hero/i.test(src)) {
      push(src, 'inline-img');
    }
  }
  // 6) srcset — pick the biggest in any <img srcset="...">
  const srcsetRe = /<(?:img|source)\s+[^>]*?srcset=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(htmlStr))) {
    const parts = m[1].split(',').map(s => s.trim());
    let biggestUrl = null, biggestW = 0;
    for (const p of parts) {
      const [u, w] = p.split(/\s+/);
      const width = parseInt((w || '').replace(/[^\d]/g, ''), 10) || 0;
      if (width > biggestW) { biggestW = width; biggestUrl = u; }
    }
    if (biggestUrl && biggestW >= 500) push(biggestUrl, 'srcset');
  }
  return candidates;
}

async function fetchImageDims(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { Range: 'bytes=0-32767', 'User-Agent': 'Mozilla/5.0 Appetyt/1.0' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok && res.status !== 206) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf[0] === 0xFF && buf[1] === 0xD8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xFF) { i++; continue; }
        const marker = buf[i + 1];
        if (marker >= 0xC0 && marker <= 0xC3) {
          return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
    if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
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
  if (isLikelyLogo(url)) return { ok: false, reason: 'logo_url_pattern' };
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 Appetyt/1.0' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, reason: 'http_' + res.status };
    const ct = res.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) return { ok: false, reason: 'not_image:' + ct.substring(0, 30) };
    const lenStr = res.headers.get('content-length');
    if (lenStr) {
      const len = parseInt(lenStr, 10);
      if (len > 0 && len < 50000) return { ok: false, reason: 'too_small_' + len };
      if (len > 15000000) return { ok: false, reason: 'too_large_' + len };
    }
    const dims = await fetchImageDims(url);
    if (dims && dims.w > 0 && dims.h > 0) {
      if (dims.w < 500 || dims.h < 350) return { ok: false, reason: `dims_${dims.w}x${dims.h}` };
      const ar = dims.w / dims.h;
      if (ar < 1.2) return { ok: false, reason: `ar${ar.toFixed(2)}_${dims.w}x${dims.h}` };
      if (ar > 2.3) return { ok: false, reason: `ar${ar.toFixed(2)}_${dims.w}x${dims.h}` };
    }
    return { ok: true, dims };
  } catch (e) { return { ok: false, reason: 'fetch_err:' + e.message.substring(0, 40) }; }
}

async function fetchWebsite(url) {
  try {
    const res = await fetch(url, {
      method: 'GET', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Appetyt/1.0)' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return { ok: false, error: 'http_' + res.status };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text') && !ct.includes('html')) return { ok: false, error: 'not_html' };
    const body = (await res.text()).slice(0, 250000);
    return { ok: true, html: body, finalUrl: res.url || url };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function findBestPhoto(website) {
  const w = await fetchWebsite(website);
  if (!w.ok) return { ok: false, reason: 'fetch_' + w.error };
  const candidates = extractAllCandidates(w.html, w.finalUrl);
  const tried = [];
  for (const c of candidates) {
    const t = await passesPhotoTest(c.url);
    if (t.ok) return { ok: true, url: c.url, source: c.source, dims: t.dims, tried };
    tried.push({ source: c.source, reason: t.reason, url: c.url.substring(0, 80) });
  }
  return { ok: false, reason: 'no_candidates_passed', tried: tried.slice(0, 5) };
}

async function main() {
  const data = extractArray(cityVar);
  const need = data.filter(r => r && r.id && r.website && r.website.startsWith('http') && !(r.photoUrl && /^https?:\/\//.test(r.photoUrl)));
  console.log(`${cityVar}: ${data.length} total, ${need.length} need photos + have website`);

  const results = [];
  const concurrency = 6;
  let idx = 0, done = 0;
  async function worker() {
    while (idx < need.length) {
      const i = idx++;
      const r = need[i];
      const result = await findBestPhoto(r.website);
      results.push({ id: r.id, name: r.name, website: r.website, ...result });
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${need.length} done (ok so far: ${results.filter(x=>x.ok).length})`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  results.sort((a, b) => a.id - b.id);

  const outPath = `scripts/apify-extra-photos-${cityShort}.json`;
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  const ok = results.filter(r => r.ok).length;
  console.log(`\nWrote ${results.length} to ${outPath}`);
  console.log(`  Found passing photo: ${ok}`);
  console.log(`  Source breakdown:`, results.filter(r => r.ok).reduce((a, r) => { a[r.source] = (a[r.source] || 0) + 1; return a; }, {}));
}

main();
