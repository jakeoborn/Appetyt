// Scrape og:image / largest-inline-img from each POI's website and attach as photoUrl.
// Works on HOTEL_DATA, MALL_DATA, PARK_DATA, MUSEUM_DATA (each shape: { cityLowercase: [...items] }).
// Writes results to scripts/apify-poi-photos-{type}.json  AND  updates index.html in place.
// Usage: node scripts/apify-fetch-poi-photos.js <DATA_VAR>
//   node scripts/apify-fetch-poi-photos.js HOTEL_DATA

const fs = require('fs');

const dataVar = process.argv[2];
if (!dataVar) { console.error('Usage: node apify-fetch-poi-photos.js <DATA_VAR>'); process.exit(1); }
const typeShort = dataVar.replace('_DATA', '').toLowerCase();

const html = fs.readFileSync('index.html', 'utf8');

function extractObjectSpan(varName) {
  // Finds `const VAR = {` and returns {start, end, obj}.
  const re = new RegExp('const ' + varName + '\\s*=\\s*\\{');
  const m = html.match(re);
  if (!m) throw new Error('not found: ' + varName);
  const start = m.index + m[0].length - 1; // position of the '{'
  let depth = 0, inStr = false, esc = false, sc = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (inStr) { if (ch === sc) { inStr = false; sc = null; } continue; }
    if (ch === '"' || ch === "'") { inStr = true; sc = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) {
      const slice = html.substring(start, i + 1);
      let obj;
      try { obj = JSON.parse(slice); } catch { obj = (new Function('return ' + slice))(); }
      return { start, end: i + 1, obj };
    } }
  }
  throw new Error('unclosed: ' + varName);
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

function extractCandidates(htmlStr, baseUrl) {
  const candidates = [];
  const seen = new Set();
  const push = (u, src) => {
    if (!u) return;
    const abs = absolutize(u, baseUrl);
    if (!/^https?:\/\//.test(abs)) return;
    if (seen.has(abs)) return;
    seen.add(abs);
    candidates.push({ url: abs, source: src });
  };
  const ogRe = /<meta\s+(?:[^>]*?\s+)?(?:property|name)=["']og:image(?::secure_url)?["'][^>]*?content=["']([^"']+)["']/gi;
  let m;
  while ((m = ogRe.exec(htmlStr))) push(m[1], 'og:image');
  const twRe = /<meta\s+(?:[^>]*?\s+)?(?:property|name)=["']twitter:image(?::src)?["'][^>]*?content=["']([^"']+)["']/gi;
  while ((m = twRe.exec(htmlStr))) push(m[1], 'twitter:image');
  const linkRe = /<link\s+(?:[^>]*?\s+)?rel=["']image_src["'][^>]*?href=["']([^"']+)["']/gi;
  while ((m = linkRe.exec(htmlStr))) push(m[1], 'link-image_src');
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
  const imgRe = /<img\s+([^>]+?)\/?>/gi;
  while ((m = imgRe.exec(htmlStr))) {
    const attrs = m[1];
    const srcM = attrs.match(/\ssrc=["']([^"']+)["']/i) || attrs.match(/\sdata-src=["']([^"']+)["']/i);
    if (!srcM) continue;
    const widthM = attrs.match(/\swidth=["']?(\d+)/);
    const w = widthM ? parseInt(widthM[1], 10) : 0;
    if (w >= 600 || /\b(12\d{2}|15\d{2}|19\d{2}|24\d{2})(w|x)?\b|scaled|full|large|hero|banner/i.test(srcM[1])) {
      push(srcM[1], 'inline-img');
    }
  }
  const srcsetRe = /<(?:img|source)\s+[^>]*?srcset=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(htmlStr))) {
    const parts = m[1].split(',').map(s => s.trim());
    let big = null, bigW = 0;
    for (const p of parts) {
      const [u, w] = p.split(/\s+/);
      const width = parseInt((w || '').replace(/[^\d]/g, ''), 10) || 0;
      if (width > bigW) { bigW = width; big = u; }
    }
    if (big && bigW >= 600) push(big, 'srcset');
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
        if (marker >= 0xC0 && marker <= 0xC3) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
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

async function passesTest(url) {
  if (!url) return false;
  if (isLikelyLogo(url)) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 Appetyt/1.0' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return false;
    const ct = res.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) return false;
    const lenStr = res.headers.get('content-length');
    if (lenStr) {
      const len = parseInt(lenStr, 10);
      if (len > 0 && len < 50000) return false;
      if (len > 15000000) return false;
    }
    const dims = await fetchImageDims(url);
    if (dims && dims.w > 0 && dims.h > 0) {
      if (dims.w < 500 || dims.h < 350) return false;
      const ar = dims.w / dims.h;
      if (ar < 1.2 || ar > 2.3) return false;
    }
    return true;
  } catch { return false; }
}

async function fetchBestPhoto(website) {
  try {
    const res = await fetch(website, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Appetyt/1.0)' }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text') && !ct.includes('html')) return null;
    const body = (await res.text()).slice(0, 250000);
    const candidates = extractCandidates(body, res.url || website);
    for (const c of candidates) {
      if (await passesTest(c.url)) return { url: c.url, source: c.source };
    }
    return null;
  } catch { return null; }
}

async function main() {
  const info = extractObjectSpan(dataVar);
  const obj = info.obj;
  const tasks = [];
  for (const city of Object.keys(obj)) {
    const items = obj[city];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item || !item.website || typeof item.website !== 'string' || !item.website.startsWith('http')) continue;
      if (item.photoUrl && /^https?:\/\//.test(item.photoUrl)) continue;
      tasks.push({ city, item });
    }
  }
  console.log(`${dataVar}: ${tasks.length} items need photos (have website, no photoUrl)`);

  const results = [];
  const concurrency = 6;
  let idx = 0, done = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      const { city, item } = tasks[i];
      const r = await fetchBestPhoto(item.website);
      if (r) {
        item.photoUrl = r.url;
        results.push({ city, id: item.id, name: item.name, source: r.source, url: r.url });
      }
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${tasks.length} (found ${results.length})`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log(`\nFound ${results.length} photos.`);
  fs.writeFileSync(`scripts/apify-poi-photos-${typeShort}.json`, JSON.stringify(results, null, 2));

  // Write back into index.html (preserve format — use JSON.stringify with line breaks like the original styles).
  const newSlice = JSON.stringify(obj, null, 2);
  const newHtml = html.substring(0, info.start) + newSlice + html.substring(info.end);
  fs.writeFileSync('index.html', newHtml);
  console.log(`Updated ${dataVar} in index.html with ${results.length} new photoUrls.`);
}

main().catch(e => { console.error(e); process.exit(1); });
