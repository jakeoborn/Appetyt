// For each card in photo-batch-current.json, fetch its website and extract
// ranked image candidates. Writes scripts/photo-candidates.json — small, structured.
//
// Heuristics (see PHOTO_QUALITY_BAR memory):
//   - Skip: logos, social-share, og-image, icons, SVG, stickers, very small dimensions
//   - Prefer: hero/slideshow images, gallery photos, large dimensions in URL
//   - Score by signal: filename hints, dimensions, host, position on page
const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const BATCH = JSON.parse(fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/photo-batch-current.json', 'utf8'));
const CITY = process.argv[2]; // optional filter
const cards = CITY ? BATCH.filter(c => c.city === CITY) : BATCH;

const BAD_SUBSTR = [
  'logo', 'wordmark', 'icon', 'social_share', 'social-share', 'socialshare',
  'og-image', 'ogimage', 'og_image', 'meta-image', 'metaimage',
  'twitter-card', 'fb-share', 'facebook-image', 'opengraph', 'open-graph',
  'placeholder', 'spothopper_logo', 'sticker', 'badge',
];
const BAD_EXT = ['.svg', '.gif'];

function looksBad(url) {
  const l = url.toLowerCase();
  for (const s of BAD_SUBSTR) if (l.includes(s)) return s;
  for (const e of BAD_EXT) if (l.endsWith(e) || l.includes(e + '?')) return 'ext:' + e;
  return null;
}

function score(url, alt, idx) {
  let s = 0;
  const l = url.toLowerCase();
  // Dimensions in URL = high signal it's a real photo
  const dims = l.match(/(\d{3,5})[xw_-](?:\d{3,5})/);
  if (dims) s += Math.min(parseInt(dims[1]) / 100, 30);
  // Big single dimension hints
  const big = l.match(/[_-](\d{4,5})[xw](\.|\?|$)/);
  if (big) s += Math.min(parseInt(big[1]) / 200, 20);
  // Squarespace content/v1 = hash-named user upload (good)
  if (l.includes('squarespace-cdn.com/content/v1/') && /[0-9a-f]{8}-[0-9a-f]{4}/.test(l)) s += 10;
  // Cloudinary fetch = often gallery photos
  if (l.includes('cloudinary.com/') && l.includes('/image/fetch/')) s += 8;
  // Bento media/images with hash but not logo
  if (l.includes('getbento.com/accounts/') && l.includes('/media/images/')) s += 6;
  // Filename hints
  const fnHints = ['interior', 'exterior', 'dining', 'food', 'menu', 'hero', 'slide', 'gallery', 'opening', 'dish'];
  for (const h of fnHints) if (l.includes(h)) s += 4;
  // Alt text hints
  const a = (alt || '').toLowerCase();
  for (const h of fnHints) if (a.includes(h)) s += 3;
  if (a.includes('photo') || a.includes('image')) s += 2;
  // Penalty for being later in page (footer images)
  s -= idx * 0.05;
  // Penalty for tiny w= param
  const wParam = l.match(/[?&]w=(\d+)/);
  if (wParam && parseInt(wParam[1]) < 600) s -= 5;
  return s;
}

function normalizeUrl(src, baseUrl) {
  if (!src) return null;
  src = src.trim();
  if (src.startsWith('data:')) return null;
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('/')) {
    try { const u = new URL(baseUrl); return u.origin + src; } catch { return null; }
  }
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  try { return new URL(src, baseUrl).href; } catch { return null; }
}

function fetchHtml(urlStr, redirects = 0) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(urlStr); } catch (e) { return reject(e); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Accept': 'text/html,*/*',
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 4) {
        const next = new URL(res.headers.location, urlStr).href;
        res.resume();
        return fetchHtml(next, redirects + 1).then(resolve, reject);
      }
      if (res.statusCode >= 400) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', d => { body += d; if (body.length > 2_000_000) { req.destroy(); resolve(body); } });
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
  });
}

function extractImages(html, baseUrl) {
  const out = [];
  // <img src= ...> and srcset
  const imgRe = /<img\b[^>]*?>/gi;
  let m, idx = 0;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const srcM = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const dataSrcM = tag.match(/\bdata-(?:src|original|lazy-src|image)\s*=\s*["']([^"']+)["']/i);
    const altM = tag.match(/\balt\s*=\s*["']([^"']*)["']/i);
    const src = (dataSrcM && dataSrcM[1]) || (srcM && srcM[1]);
    if (!src) { idx++; continue; }
    const url = normalizeUrl(src, baseUrl);
    if (!url) { idx++; continue; }
    if (looksBad(url)) { idx++; continue; }
    if (looksBad(altM && altM[1] || '')) { idx++; continue; }
    out.push({ url, alt: altM ? altM[1] : '', score: score(url, altM && altM[1], idx) });
    idx++;
  }
  // og:image as backup candidate
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (og) {
    const url = normalizeUrl(og[1], baseUrl);
    if (url && !looksBad(url)) out.push({ url, alt: 'og:image', score: 1 });
  }
  // Background-image inline styles
  const bgRe = /background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((m = bgRe.exec(html)) !== null) {
    const url = normalizeUrl(m[1], baseUrl);
    if (url && !looksBad(url)) out.push({ url, alt: 'css-bg', score: 5 });
  }
  // Dedupe by URL
  const seen = new Set();
  return out.filter(c => { if (seen.has(c.url)) return false; seen.add(c.url); return true; })
            .sort((a, b) => b.score - a.score);
}

async function processCard(card) {
  if (!card.website) return { ...card, candidates: [], error: 'no-website' };
  try {
    const html = await fetchHtml(card.website);
    const candidates = extractImages(html, card.website).slice(0, 5);
    return { city: card.city, name: card.name, address: card.address, website: card.website,
             currentPhotoUrl: card.photoUrl, currentPhotos0: card.photos0, state: card.state,
             candidates };
  } catch (e) {
    return { city: card.city, name: card.name, website: card.website,
             currentPhotoUrl: card.photoUrl, error: e.message, candidates: [] };
  }
}

(async () => {
  console.log('Processing', cards.length, 'cards', CITY ? `(filter=${CITY})` : '(all)');
  const results = [];
  // Light concurrency: 5 at a time
  const POOL = 5;
  let i = 0;
  while (i < cards.length) {
    const slice = cards.slice(i, i + POOL);
    const out = await Promise.all(slice.map(processCard));
    for (const r of out) {
      results.push(r);
      const top = r.candidates[0];
      const tag = r.error ? `ERR ${r.error}` : (top ? `top=${top.score.toFixed(1)} ${top.url.substring(0, 70)}` : 'no-candidates');
      console.log(`[${r.city}] ${r.name.padEnd(28).slice(0,28)}  ${tag}`);
    }
    i += POOL;
  }
  const outFile = CITY ? `scripts/photo-candidates-${CITY}.json` : 'scripts/photo-candidates.json';
  fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/' + outFile, JSON.stringify(results, null, 2));
  console.log('---');
  console.log('Wrote', outFile);
  const ok = results.filter(r => r.candidates && r.candidates.length).length;
  const err = results.filter(r => r.error).length;
  console.log(`Cards with candidates: ${ok}/${results.length}, errors: ${err}`);
})();
