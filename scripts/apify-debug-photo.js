// Debug why a restaurant's photoUrl isn't the expected /p/ owner photo.
// Usage: node scripts/apify-debug-photo.js <city> <nameRegex>
const fs = require('fs');

const city = process.argv[2];
const nameRe = new RegExp(process.argv[3], 'i');

const apify = JSON.parse(fs.readFileSync(`scripts/apify-results-${city}.json`, 'utf8'));
const og = JSON.parse(fs.readFileSync(`scripts/apify-og-images-${city}.json`, 'utf8'));
const entry = apify.find(x => nameRe.test(x.title));
console.log('=== Apify result ===');
console.log('title:', entry?.title);
console.log('searchString:', entry?.searchString);
console.log('imageUrls[0-3]:');
(entry?.imageUrls || []).slice(0,4).forEach((u,i) => console.log(`  ${i}:`, u.substring(0,120)));

const ogMatch = og.find(x => nameRe.test(x.name));
console.log('\n=== OG result ===');
if (ogMatch) console.log(JSON.stringify(ogMatch, null, 2));
else console.log('no og match');

console.log('\n=== Running pickPhoto logic ===');

function isLikelyLogo(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg')) return true;
  return /[^a-z0-9]logo[^a-z0-9]|favicon|[^a-z0-9]icon[^a-z0-9]|brand[^a-z0-9]?mark|sprite|placeholder/.test(lower);
}

async function fetchImageDims(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { Range: 'bytes=0-32767' }, signal: AbortSignal.timeout(8000) });
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
  } catch (e) { return { err: e.message }; }
}

async function test(url) {
  const head = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(8000) });
  const ct = head.headers.get('content-type') || '';
  const len = head.headers.get('content-length');
  const isLogo = isLikelyLogo(url);
  const dims = await fetchImageDims(url);
  const ar = dims && dims.w && dims.h ? (dims.w / dims.h).toFixed(3) : '';
  console.log(`  URL: ${url.substring(0,100)}`);
  console.log(`  HEAD: ${head.status} | CT: ${ct} | Len: ${len} | Logo: ${isLogo} | Dims: ${JSON.stringify(dims)} | AR: ${ar}`);
  return { head, ct, len, isLogo, dims, ar };
}

(async () => {
  const ownerUrls = (entry?.imageUrls || []).filter(u => /\/p\/AF1Q/.test(u)).slice(0, 3);
  console.log(`Owner URLs (${ownerUrls.length}):`);
  for (const u of ownerUrls) await test(u);
  if (ogMatch && ogMatch.ok) {
    console.log('OG image:');
    await test(ogMatch.url);
  }
})();
