#!/usr/bin/env node
// Build static neighborhood pages: /{city}/{neighborhood}/
// Targets high-intent local searches like "restaurants in West Village NYC"
// Run: node scripts/build-neighborhood-pages.js

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function parseArray(tag) {
  const s = indexHtml.indexOf(tag);
  if (s === -1) return [];
  const a = indexHtml.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < indexHtml.length; i++) {
    if (indexHtml[i] === '[') d++;
    if (indexHtml[i] === ']') d--;
    if (d === 0) { e = i + 1; break; }
  }
  const slice = indexHtml.slice(a, e);
  try { return JSON.parse(slice); } catch (e1) {
    try { return (new Function('return ' + slice))(); } catch (e2) { return []; }
  }
}

function parseObject(tag) {
  const s = indexHtml.indexOf(tag);
  if (s === -1) return {};
  const a = indexHtml.indexOf('{', s);
  let d = 0, e = a;
  for (let i = a; i < indexHtml.length; i++) {
    if (indexHtml[i] === '{') d++;
    if (indexHtml[i] === '}') d--;
    if (d === 0) { e = i + 1; break; }
  }
  try { return (new Function('return ' + indexHtml.slice(a, e)))(); } catch (e2) { return {}; }
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function neighborhoodSlug(name) {
  return name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\/\\]/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// City config: CITY_NEIGHBORHOODS key → build metadata
const cityConfig = {
  'New York':      { slug: 'nyc',            dataTag: 'const NYC_DATA',        name: 'New York City', state: 'NY' },
  'Dallas':        { slug: 'dallas',         dataTag: 'const DALLAS_DATA',     name: 'Dallas',        state: 'TX' },
  'Houston':       { slug: 'houston',        dataTag: 'const HOUSTON_DATA',    name: 'Houston',       state: 'TX' },
  'Austin':        { slug: 'austin',         dataTag: 'const AUSTIN_DATA',     name: 'Austin',        state: 'TX' },
  'Chicago':       { slug: 'chicago',        dataTag: 'const CHICAGO_DATA',    name: 'Chicago',       state: 'IL' },
  'Salt Lake City':{ slug: 'salt-lake-city', dataTag: 'const SLC_DATA=',       name: 'Salt Lake City',state: 'UT' },
  'Seattle':       { slug: 'seattle',        dataTag: 'const SEATTLE_DATA',    name: 'Seattle',       state: 'WA' },
  'Las Vegas':     { slug: 'las-vegas',      dataTag: 'const LV_DATA',         name: 'Las Vegas',     state: 'NV' },
  'Los Angeles':   { slug: 'los-angeles',    dataTag: 'const LA_DATA',         name: 'Los Angeles',   state: 'CA' },
  'Miami':         { slug: 'miami',          dataTag: 'const MIAMI_DATA',      name: 'Miami',         state: 'FL' },
};

const cityNeighborhoods = parseObject('const CITY_NEIGHBORHOODS');

const sitemapUrls = [];
let totalPages = 0;

for (const [cityKey, hoodMap] of Object.entries(cityNeighborhoods)) {
  const cfg = cityConfig[cityKey];
  if (!cfg) { console.log(`  Skipping ${cityKey} — no city config`); continue; }

  const cityData = parseArray(cfg.dataTag);
  if (!cityData.length) { console.log(`  Skipping ${cfg.name} — no data`); continue; }

  const hoodNames = Object.keys(hoodMap);

  for (const hoodName of hoodNames) {
    const hoodInfo = hoodMap[hoodName];
    const hoodSlug = neighborhoodSlug(hoodName);
    const spots = cityData
      .filter(r => r.neighborhood === hoodName)
      .sort((a, b) => b.score - a.score);

    if (spots.length < 3) continue; // skip stub neighborhoods

    const top5 = spots.slice(0, 5);

    // Tag counts for this neighborhood
    const tags = {};
    spots.forEach(r => (r.tags || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
    const topTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 12);

    // Other neighborhoods in same city for nav
    const otherHoods = hoodNames
      .filter(h => h !== hoodName && cityData.filter(r => r.neighborhood === h).length >= 3)
      .slice(0, 12);

    const ogImage = top5.find(r => r.photoUrl)?.photoUrl || 'https://dimhour.com/icons/icon-512.png';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y37FGSEPXR"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Y37FGSEPXR');</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Restaurants in ${esc(hoodName)}, ${esc(cfg.name)} 2026 | ${spots.length} Picks | Dim Hour</title>
<meta name="description" content="${spots.length} restaurants in ${esc(hoodName)}, ${esc(cfg.name)}. ${hoodInfo.bestFor ? esc(hoodInfo.bestFor) + '. ' : ''}Top picks: ${esc(top5.slice(0,3).map(r=>r.name).join(', '))}.">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="https://dimhour.com/${cfg.slug}/${hoodSlug}/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dim Hour">
<meta property="og:title" content="Best Restaurants in ${esc(hoodName)}, ${esc(cfg.name)} 2026 — ${spots.length} Picks">
<meta property="og:description" content="${spots.length} restaurants in ${esc(hoodName)}. ${hoodInfo.vibe ? esc(hoodInfo.vibe.split('.')[0]) + '.' : ''}">
<meta property="og:url" content="https://dimhour.com/${cfg.slug}/${hoodSlug}/">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"Best Restaurants in ${esc(hoodName)}, ${esc(cfg.name)}","description":"${esc(spots.length + ' curated restaurants in ' + hoodName + ', ' + cfg.name + '.')}","url":"https://dimhour.com/${cfg.slug}/${hoodSlug}/","numberOfItems":${spots.length},"itemListElement":[${top5.map((r,i)=>`{"@type":"ListItem","position":${i+1},"item":{"@type":"Restaurant","name":"${esc(r.name)}","servesCuisine":"${esc(r.cuisine)}","address":{"@type":"PostalAddress","addressLocality":"${esc(hoodName)}","addressRegion":"${cfg.state}"}}}`).join(',')}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Dim Hour","item":"https://dimhour.com/"},{"@type":"ListItem","position":2,"name":"${esc(cfg.name)}","item":"https://dimhour.com/${cfg.slug}/"},{"@type":"ListItem","position":3,"name":"${esc(hoodName)}","item":"https://dimhour.com/${cfg.slug}/${hoodSlug}/"}]}
</script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--gold:#c8a96e;--dark:#0a0d14;--card:#11151f;--text:#e8dfc8;--text2:#9a8e72;--text3:#5a4e38;--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--dark);color:var(--text);font-family:var(--sans);line-height:1.6;padding:0 16px}
.wrap{max-width:700px;margin:0 auto;padding:40px 0 60px}
h1{font-family:var(--serif);color:var(--gold);font-size:26px;margin-bottom:8px;font-style:italic}
h2{font-family:var(--serif);color:var(--gold);font-size:18px;margin:28px 0 12px;font-style:italic}
p{color:var(--text2);margin-bottom:12px;font-size:15px}
.vibe{background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:12px;padding:16px 20px;margin:16px 0 24px}
.vibe p{margin:0 0 8px;font-size:14px}
.vibe p:last-child{margin:0}
.vibe strong{color:var(--text)}
.tip{background:rgba(200,169,110,.06);border-left:3px solid var(--gold);padding:10px 14px;border-radius:0 8px 8px 0;margin:16px 0}
.tip p{margin:0;font-size:13px;font-style:italic}
.cta{display:inline-block;background:var(--gold);color:var(--dark);padding:12px 28px;border-radius:28px;font-weight:700;text-decoration:none;font-size:14px;margin:16px 0;transition:opacity .2s}
.cta:hover{opacity:.85}
.rank{display:flex;align-items:flex-start;gap:12px;background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:12px;padding:16px;margin-bottom:10px}
.rank-num{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--gold);min-width:26px;font-style:italic}
.rank-name{font-weight:700;font-size:15px;color:var(--text)}
.rank-meta{font-size:12px;color:var(--text2);margin-top:2px}
.rank-desc{font-size:13px;color:var(--text2);margin-top:6px;line-height:1.5}
.rank-score{font-size:20px;font-weight:700;color:var(--gold);margin-left:auto;flex-shrink:0}
.more{background:var(--card);border:1px solid rgba(200,169,110,.1);border-radius:10px;padding:8px 14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
.more-name{font-weight:600;font-size:13px;color:var(--text)}
.more-meta{font-size:11px;color:var(--text2)}
.more-score{color:var(--gold);font-weight:700;font-size:12px}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.tag{background:rgba(200,169,110,.1);border:1px solid rgba(200,169,110,.25);color:var(--gold);padding:3px 10px;border-radius:14px;font-size:12px;font-weight:600}
.stat{display:inline-block;background:rgba(200,169,110,.08);border:1px solid rgba(200,169,110,.2);padding:5px 12px;border-radius:18px;font-size:12px;color:var(--gold);font-weight:600;margin:3px}
a{color:var(--gold)}
.back{font-size:13px;color:var(--text2);text-decoration:none;display:inline-block;margin-bottom:20px}
.hoods{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.hood-link{background:var(--card);border:1px solid rgba(200,169,110,.2);padding:6px 14px;border-radius:10px;text-decoration:none;color:var(--text);font-size:12px;font-weight:600;transition:all .15s}
.hood-link:hover{border-color:var(--gold);color:var(--gold)}
</style>
</head>
<body>
<div class="wrap">
<a href="/${cfg.slug}/" class="back">← All ${esc(cfg.name)} Restaurants</a>
<h1>${esc(hoodInfo.emoji || '📍')} ${esc(hoodName)}, ${esc(cfg.name)}</h1>
<p class="subtitle">${spots.length} restaurants · 2026</p>

<div style="margin:12px 0 20px">
<span class="stat">🍽️ ${spots.length} Restaurants</span>
${hoodInfo.bestFor ? `<span class="stat">✨ ${esc(hoodInfo.bestFor)}</span>` : ''}
</div>

<div class="vibe">
${hoodInfo.vibe ? `<p>${esc(hoodInfo.vibe)}</p>` : ''}
${hoodInfo.knownFor ? `<p><strong>Known for:</strong> ${esc(hoodInfo.knownFor)}</p>` : ''}
${hoodInfo.mustVisit ? `<p><strong>Don't miss:</strong> ${esc(hoodInfo.mustVisit)}</p>` : ''}
</div>

${hoodInfo.tip ? `<div class="tip"><p>💡 ${esc(hoodInfo.tip)}</p></div>` : ''}

<a href="https://dimhour.com" class="cta">🍽️ Open Interactive Guide</a>

<h2>Top ${Math.min(10, spots.length)} in ${esc(hoodName)}</h2>

${spots.slice(0, 10).map((r, i) => `
<div class="rank">
<div class="rank-num">${i + 1}</div>
<div style="flex:1">
<div class="rank-name">${esc(r.name)}</div>
<div class="rank-meta">${esc(r.cuisine)}${r.awards ? ' · ' + esc(r.awards) : ''}</div>
${r.description ? `<div class="rank-desc">${esc(r.description).substring(0, 180)}${r.description.length > 180 ? '...' : ''}</div>` : ''}
</div>
<div class="rank-score">${r.score}</div>
</div>`).join('\n')}

${spots.length > 10 ? `
<h2>All ${spots.length} Restaurants in ${esc(hoodName)}</h2>
${spots.slice(10).map(r => `
<div class="more">
<div><div class="more-name">${esc(r.name)}</div><div class="more-meta">${esc(r.cuisine)}</div></div>
<div class="more-score">${r.score}</div>
</div>`).join('\n')}` : ''}

<div style="text-align:center;margin:28px 0">
<a href="https://dimhour.com" class="cta">🍽️ Explore Full ${esc(cfg.name)} Guide</a>
</div>

${topTags.length > 0 ? `
<div class="tags">
${topTags.map(([t, c]) => `<span class="tag">${esc(t)} (${c})</span>`).join('\n')}
</div>` : ''}

<h2>More ${esc(cfg.name)} Neighborhoods</h2>
<div class="hoods">
${otherHoods.map(h => `<a href="/${cfg.slug}/${neighborhoodSlug(h)}/" class="hood-link">${esc(hoodMap[h]?.emoji || '📍')} ${esc(h)}</a>`).join('\n')}
</div>

<p style="margin-top:24px;font-size:12px;color:var(--text3)">Dim Hour scores the best restaurants across America. <a href="https://dimhour.com">Full guide →</a> · <a href="/${cfg.slug}/">All ${esc(cfg.name)} restaurants →</a></p>
</div>
</body>
</html>`;

    const dir = path.join(cfg.slug, hoodSlug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    sitemapUrls.push(`https://dimhour.com/${cfg.slug}/${hoodSlug}/`);
    totalPages++;
  }

  console.log(`  ✓ ${cfg.name}: ${Object.keys(hoodMap).length} neighborhoods processed`);
}

// Append to sitemap
const today = new Date().toISOString().split('T')[0];
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const closingTag = '</urlset>';
const newUrls = sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

sitemap = sitemap.replace(closingTag, newUrls + '\n' + closingTag);
fs.writeFileSync('sitemap.xml', sitemap);

console.log(`\n✅ Built ${totalPages} neighborhood pages across ${Object.keys(cityNeighborhoods).length} cities`);
console.log(`   Sitemap updated with ${sitemapUrls.length} new URLs`);
