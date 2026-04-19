// Fetch og:image (and twitter:image fallback) from each entry's website.
// Output: scripts/apify-og-images-{city}.json
// Usage: node scripts/apify-fetch-og-images.js <CITY_VAR>
//   node scripts/apify-fetch-og-images.js PHX_DATA

const fs = require('fs');

const cityVar = process.argv[2] || 'PHX_DATA';
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
  throw new Error('unclosed array: ' + varDecl);
}

function extractMetaImage(htmlStr) {
  const ogMatch = htmlStr.match(/<meta\s+(?:[^>]*?\s+)?(?:property|name)=["'](?:og:image|og:image:secure_url)["'][^>]*?content=["']([^"']+)["']/i)
                || htmlStr.match(/<meta\s+(?:[^>]*?\s+)?content=["']([^"']+)["'][^>]*?(?:property|name)=["'](?:og:image|og:image:secure_url)["']/i);
  if (ogMatch) return { url: ogMatch[1], source: 'og:image' };
  const twMatch = htmlStr.match(/<meta\s+(?:[^>]*?\s+)?(?:property|name)=["']twitter:image["'][^>]*?content=["']([^"']+)["']/i)
                || htmlStr.match(/<meta\s+(?:[^>]*?\s+)?content=["']([^"']+)["'][^>]*?(?:property|name)=["']twitter:image["']/i);
  if (twMatch) return { url: twMatch[1], source: 'twitter:image' };
  return null;
}

function absolutize(url, base) {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  try { return new URL(url, base).toString(); } catch { return url; }
}

async function fetchOg(website) {
  try {
    const res = await fetch(website, {
      method: 'GET', redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Appetyt/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, error: 'http_' + res.status };
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text') && !ct.includes('html')) return { ok: false, error: 'not_html' };
    const body = (await res.text()).slice(0, 100000);
    const meta = extractMetaImage(body);
    if (!meta) return { ok: false, error: 'no_meta_image' };
    return { ok: true, url: absolutize(meta.url, res.url || website), source: meta.source };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  const data = extractArray(cityVar);
  console.log(`${cityVar}: ${data.length} entries`);
  const withSites = data.filter(r => r && r.id && r.website && r.website.startsWith('http'));
  console.log(`With websites: ${withSites.length}`);

  const results = [];
  const concurrency = 8;
  let idx = 0;
  async function worker() {
    while (idx < withSites.length) {
      const i = idx++;
      const r = withSites[i];
      const og = await fetchOg(r.website);
      results.push({ id: r.id, name: r.name, website: r.website, ...og });
      if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${withSites.length} done`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  results.sort((a, b) => a.id - b.id);

  const outPath = `scripts/apify-og-images-${cityShort}.json`;
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  const ok = results.filter(r => r.ok).length;
  console.log(`\nWrote ${results.length} results to ${outPath}`);
  console.log(`  Found image:    ${ok}`);
  console.log(`  No image / err: ${results.length - ok}`);
}

main();
