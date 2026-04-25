// Audit photoUrls: download first ~16KB of each, parse PNG/JPEG/WebP dimensions,
// flag bad ones (square, too small, non-image), optionally remove.
//
// Usage:
//   node scripts/audit-photos.js                       # audit all photoUrls in current file
//   node scripts/audit-photos.js --new-only             # only audit photoUrls added since HEAD~1
//   node scripts/audit-photos.js --apply                # remove bad ones
//   node scripts/audit-photos.js --new-only --apply     # both

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const FILE = path.join(__dirname, '..', 'index.html');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const newOnly = args.includes('--new-only');

// ---------- parse all *_DATA from a given text ----------
function extractCardsByCity(text) {
  const lines = text.split('\n');
  const re = /^const\s+([A-Z][A-Z0-9_]*_DATA)\s*=\s*\[/;
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    const name = m[1];
    const firstLine = lines[i];
    const eqIdx = firstLine.indexOf('=');
    const bracketIdx = firstLine.indexOf('[', eqIdx);
    const lastBracketSemi = firstLine.lastIndexOf('];');
    let arr, endIdx, mode;
    if (lastBracketSemi >= 0 && lastBracketSemi > bracketIdx) {
      try {
        arr = JSON.parse(firstLine.slice(bracketIdx, lastBracketSemi + 1));
        endIdx = i;
        mode = 'single';
      } catch (e) { continue; }
    } else {
      let buf = firstLine.slice(bracketIdx);
      let j = i;
      let found = false;
      while (++j < lines.length) {
        buf += '\n' + lines[j];
        if (/\];/.test(lines[j])) {
          const tryEnd = buf.lastIndexOf('];');
          if (tryEnd >= 0) {
            try { arr = JSON.parse(buf.slice(0, tryEnd + 1)); endIdx = j; mode = 'multi'; found = true; break; }
            catch (e) { /* keep going */ }
          }
        }
      }
      if (!found) continue;
    }
    result.push({ city: name, lineIdx: i, endIdx, mode, arr });
  }
  // De-dupe (keep first instance of each city name — that's the live one)
  const seen = new Set();
  return result.filter(r => { if (seen.has(r.city)) return false; seen.add(r.city); return true; });
}

// ---------- image dimension parsers ----------
function parseDims(buf) {
  // PNG
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: 'png' };
  }
  // JPEG
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i < buf.length - 8) {
      if (buf[i] !== 0xFF) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0x00 || marker === 0xFF) { i++; continue; }
      // SOFn markers (excluding DHT 0xC4, JPG 0xC8, DAC 0xCC)
      if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
        if (i + 9 < buf.length) {
          return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), type: 'jpeg' };
        }
        return null;
      }
      if (i + 4 > buf.length) return null;
      const segLen = buf.readUInt16BE(i + 2);
      i += 2 + segLen;
    }
    return null;
  }
  // WebP
  if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const fourcc = buf.toString('ascii', 12, 16);
    if (fourcc === 'VP8 ') {
      const w = buf.readUInt16LE(26) & 0x3FFF;
      const h = buf.readUInt16LE(28) & 0x3FFF;
      return { w, h, type: 'webp-vp8' };
    }
    if (fourcc === 'VP8L') {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      const w = ((b1 & 0x3F) << 8 | b0) + 1;
      const h = ((b3 & 0x0F) << 10 | b2 << 2 | (b1 >> 6)) + 1;
      return { w, h, type: 'webp-vp8l' };
    }
    if (fourcc === 'VP8X') {
      const w = ((buf[26] << 16) | (buf[25] << 8) | buf[24]) + 1;
      const h = ((buf[29] << 16) | (buf[28] << 8) | buf[27]) + 1;
      return { w, h, type: 'webp-vp8x' };
    }
  }
  // GIF
  if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8), type: 'gif' };
  }
  // SVG (text-based, low-quality logo signal)
  if (buf.length > 5 && (buf.toString('ascii', 0, 5) === '<?xml' || buf.toString('ascii', 0, 4) === '<svg')) {
    return { w: 0, h: 0, type: 'svg' };
  }
  return null;
}

// ---------- fetch first 32KB ----------
function fetchHead(url) {
  return new Promise(resolve => {
    const safeUrl = url.replace(/(["`$\\])/g, '\\$1');
    const cmd = `curl -sL --max-time 12 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -r 0-32767 "${safeUrl}" -o -`;
    exec(cmd, { encoding: 'buffer', timeout: 15000, maxBuffer: 1e6 }, (err, stdout) => {
      if (err || !stdout || stdout.length === 0) {
        resolve({ ok: false, reason: 'fetch-fail', size: 0 });
        return;
      }
      resolve({ ok: true, buf: stdout, size: stdout.length });
    });
  });
}

// ---------- classify ----------
function classify(url, fetchResult) {
  if (!fetchResult.ok) return { verdict: 'BAD', reason: 'fetch-fail' };
  const buf = fetchResult.buf;
  // Check if it's HTML (404 page or redirect)
  const start = buf.toString('ascii', 0, Math.min(20, buf.length)).toLowerCase().trim();
  if (start.startsWith('<!doctype') || start.startsWith('<html') || start.startsWith('<?xml')) {
    return { verdict: 'BAD', reason: 'html-not-image' };
  }
  const dims = parseDims(buf);
  if (!dims) return { verdict: 'BAD', reason: 'unknown-format' };
  if (dims.type === 'svg') return { verdict: 'BAD', reason: 'svg-likely-logo' };
  // Tiny (icon) — under 200x200 is definitely an icon
  if (dims.w < 200 || dims.h < 200) return { verdict: 'BAD', reason: `tiny-${dims.w}x${dims.h}` };
  // Square (1:1) - likely logo
  if (dims.w === dims.h) return { verdict: 'BAD', reason: `square-${dims.w}x${dims.h}` };
  // Near-square (between 0.95 and 1.05 aspect) - logos often
  const aspect = dims.w / dims.h;
  if (aspect > 0.95 && aspect < 1.05) return { verdict: 'BAD', reason: `near-square-${dims.w}x${dims.h}` };
  // Too narrow (banners/icons) - very wide or very tall
  if (aspect > 4) return { verdict: 'BAD', reason: `too-wide-${dims.w}x${dims.h}` };
  if (aspect < 0.3) return { verdict: 'BAD', reason: `too-tall-${dims.w}x${dims.h}` };
  // Small (< 600x400) — likely thumbnail or icon
  if (dims.w < 600 && dims.h < 400) return { verdict: 'BAD', reason: `small-${dims.w}x${dims.h}` };
  // 1200x630 social-share precise
  if (dims.w === 1200 && dims.h === 630) return { verdict: 'BAD', reason: 'exact-1200x630-social' };
  // OK
  return { verdict: 'OK', reason: `${dims.w}x${dims.h} ${dims.type}` };
}

// ---------- main ----------
(async () => {
  const cur = extractCardsByCity(fs.readFileSync(FILE, 'utf8'));

  // Find URLs to audit
  let toAudit = []; // {city, id, name, photoUrl}
  if (newOnly) {
    const head1 = execSync('git show HEAD~1:index.html', { encoding: 'utf8', maxBuffer: 200e6 });
    const old = extractCardsByCity(head1);
    const oldByCityId = new Map();
    for (const c of old) for (const card of c.arr) {
      oldByCityId.set(`${c.city}:${card.id}`, card.photoUrl || '');
    }
    for (const c of cur) for (const card of c.arr) {
      if (!card.photoUrl) continue;
      const oldUrl = oldByCityId.get(`${c.city}:${card.id}`);
      if (oldUrl !== card.photoUrl) {
        toAudit.push({ city: c.city, id: card.id, name: card.name, photoUrl: card.photoUrl });
      }
    }
  } else {
    for (const c of cur) for (const card of c.arr) {
      if (card.photoUrl) toAudit.push({ city: c.city, id: card.id, name: card.name, photoUrl: card.photoUrl });
    }
  }

  console.log(`Auditing ${toAudit.length} photos${newOnly ? ' (new since HEAD~1)' : ''}...\n`);

  // Concurrent fetch
  const results = [];
  const CONCURRENCY = 12;
  let idx = 0;
  async function worker() {
    while (idx < toAudit.length) {
      const my = idx++;
      const item = toAudit[my];
      const r = await fetchHead(item.photoUrl);
      const verdict = classify(item.photoUrl, r);
      results[my] = { ...item, verdict };
      if ((my + 1) % 25 === 0) process.stderr.write(`\r${my+1}/${toAudit.length}`);
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, worker));
  process.stderr.write('\r' + ' '.repeat(40) + '\r');

  // Tally
  const bad = results.filter(r => r.verdict.verdict === 'BAD');
  const ok = results.filter(r => r.verdict.verdict === 'OK');
  console.log(`\nResult: ${ok.length} OK, ${bad.length} BAD\n`);

  // Group bad by reason
  const byReason = {};
  for (const b of bad) {
    const r = b.verdict.reason.replace(/-\d+x\d+$/, '-NxN');
    byReason[r] = (byReason[r] || 0) + 1;
  }
  console.log('Bad by reason:');
  Object.entries(byReason).sort((a,b)=>b[1]-a[1]).forEach(([r,n]) => console.log(`  ${n.toString().padStart(4)}  ${r}`));

  // List bad
  console.log('\nBAD photos:');
  for (const b of bad.slice(0, 100)) {
    console.log(` [${b.city}:${b.id}] ${b.name.padEnd(40)} ${b.verdict.reason.padEnd(28)} ${b.photoUrl.slice(0, 100)}`);
  }
  if (bad.length > 100) console.log(`... ${bad.length - 100} more`);

  // Apply removal
  if (apply && bad.length) {
    const fileText = fs.readFileSync(FILE, 'utf8');
    const lines = fileText.split('\n');
    const cur2 = extractCardsByCity(fileText);
    const cityIndex = new Map(cur2.map(c => [c.city, c]));
    const badByCity = new Map();
    for (const b of bad) {
      if (!badByCity.has(b.city)) badByCity.set(b.city, new Set());
      badByCity.get(b.city).add(b.id);
    }
    for (const [city, ids] of badByCity) {
      const c = cityIndex.get(city);
      if (!c) continue;
      for (const card of c.arr) {
        if (ids.has(card.id)) card.photoUrl = '';
      }
      const newLine = `const ${city}=${JSON.stringify(c.arr)};`;
      if (c.mode === 'single') lines[c.lineIdx] = newLine;
      else lines.splice(c.lineIdx, c.endIdx - c.lineIdx + 1, newLine);
    }
    fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
    console.log(`\nWROTE: cleared ${bad.length} bad photoUrls.`);
  } else if (apply) {
    console.log('\nNothing to remove.');
  } else {
    console.log('\n(dry-run; pass --apply to remove)');
  }
})();
