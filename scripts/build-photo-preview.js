const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');

const BAD_FILENAME_PARTS = [
  'socialshare','social-share','social_share','wordmark','og-image','og_image','ogimage',
  'meta-image','meta_image','matashare','_logo','-logo','logo_','logo-','/logo.','logomark',
  'opengraph','open-graph','open_graph','facebook-image','fb-share','twitter-card','twitter_card',
];
function isBad(u) {
  if (!u) return true;
  const l = u.toLowerCase();
  if (/squarespace\.com\/.*\/\d+\/?$/.test(l) && !/\.(png|jpg|jpeg|webp|gif)/i.test(l)) return true;
  if (l.includes('squarespace.com') && /\.png(\?|$)/.test(l)) return true;
  for (const p of BAD_FILENAME_PARTS) if (l.includes(p)) return true;
  if (l.includes('logo') && /\.(png|svg)(\?|$)/.test(l)) return true;
  return false;
}
function isGood(u) {
  return /lh3\.googleusercontent\.com\/(p\/AF1Q|gps-cs-s\/|gps-proxy\/)/.test(u);
}

// Find cards where photoUrl is GOOD but photos[0] is BAD (these are our swaps)
const nameRe = /"name":"([^"\\]+)"/g;
const swaps = [];
let m;
while ((m = nameRe.exec(c)) !== null) {
  const w = c.substring(m.index, Math.min(c.length, m.index + 8000));
  const pu = w.match(/"photoUrl":"([^"]*)"/);
  const ph = w.match(/"photos":\[([^\]]*)\]/);
  if (!pu || !ph) continue;
  const between = w.substring(0, Math.min(w.indexOf('"photoUrl"'), w.indexOf('"photos":[')));
  if ((between.match(/"name":"[^"]+"/g) || []).length > 1) continue;
  const photoUrl = pu[1];
  let arr;
  try { arr = JSON.parse('[' + ph[1] + ']'); } catch (e) { continue; }
  if (arr.length < 1) continue;
  if (!isGood(photoUrl)) continue;
  if (!isBad(arr[0])) continue;
  swaps.push({ name: m[1], old: arr[0], new: photoUrl });
}

// Dedupe by name+old
const seen = new Set();
const uniq = [];
for (const s of swaps) {
  const k = s.name + '|' + s.old;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(s);
}
console.log('Detected swaps:', uniq.length);

// Sample 15 across the list
function pickSample(arr, n) {
  if (arr.length <= n) return arr.slice();
  const step = Math.floor(arr.length / n);
  const out = [];
  for (let i = 0; i < n; i++) out.push(arr[i * step]);
  return out;
}
const sample = pickSample(uniq, 15);

const rows = sample.map(s => `
<tr>
  <td><strong>${s.name}</strong></td>
  <td><img src="${s.old}" loading="lazy"><div class="cap">BEFORE (was photoUrl, now photos[0])</div></td>
  <td><img src="${s.new}" loading="lazy"><div class="cap">AFTER (new photoUrl)</div></td>
</tr>`).join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Photo swap preview</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background:#111; color:#eee; padding:20px; }
  h1 { color:#c8a96e; }
  table { border-collapse: collapse; width: 100%; }
  td { border: 1px solid #333; padding: 12px; vertical-align: top; width: 33%; }
  img { max-width: 100%; max-height: 260px; display:block; background:#222; }
  .cap { font-size: 11px; color: #888; margin-top: 6px; }
  .summary { background:#1a1a1a; padding:16px; border-radius:8px; margin-bottom:16px; }
</style></head><body>
<h1>Main photo swap preview</h1>
<div class="summary">
  <strong>Total detected swaps in current file:</strong> ${uniq.length}<br>
  <strong>Showing:</strong> evenly-spaced sample of ${sample.length} across the full list<br>
  <em>Left = old photoUrl (now preserved at photos[0]), Right = new photoUrl (promoted from photos[1])</em>
</div>
<table>
  <tr><th>Restaurant</th><th>Before</th><th>After</th></tr>
  ${rows}
</table>
</body></html>`;

fs.writeFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/scripts/photo-swap-preview.html', html);
console.log('Wrote scripts/photo-swap-preview.html');
