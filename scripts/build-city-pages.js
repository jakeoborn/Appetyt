#!/usr/bin/env node
// Build static city pages with ALL restaurants for SEO crawlability
// Generates well-organized HTML pages grouped by neighborhood
// Run: node scripts/build-city-pages.js

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function parseArray(tag) {
  const s = indexHtml.indexOf(tag);
  if (s === -1) return [];
  const a = indexHtml.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < indexHtml.length; i++) { if (indexHtml[i] === '[') d++; if (indexHtml[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  const slice = indexHtml.slice(a, e);
  // Strict JSON first; fall back to JS-object literal (NYC_DATA uses unquoted keys).
  try { return JSON.parse(slice); } catch (e1) {
    try { return (new Function('return ' + slice))(); } catch (e2) { return []; }
  }
}

// Chicago is its own const now (CHICAGO_DATA); kept for backwards compat.
function parseChicago() { return parseArray('const CHICAGO_DATA'); }

const cities = [
  { name: 'New York City', slug: 'nyc', state: 'NY', data: parseArray('const NYC_DATA') },
  { name: 'Dallas', slug: 'dallas', state: 'TX', data: parseArray('const DALLAS_DATA') },
  { name: 'Houston', slug: 'houston', state: 'TX', data: parseArray('const HOUSTON_DATA') },
  { name: 'Austin', slug: 'austin', state: 'TX', data: parseArray('const AUSTIN_DATA') },
  { name: 'Chicago', slug: 'chicago', state: 'IL', data: parseChicago() },
  { name: 'Salt Lake City', slug: 'salt-lake-city', state: 'UT', data: parseArray('const SLC_DATA=') },
  { name: 'Seattle', slug: 'seattle', state: 'WA', data: parseArray('const SEATTLE_DATA') },
  { name: 'Las Vegas', slug: 'las-vegas', state: 'NV', data: parseArray('const LV_DATA') },
  { name: 'Los Angeles', slug: 'los-angeles', state: 'CA', data: parseArray('const LA_DATA') },
  { name: 'Miami', slug: 'miami', state: 'FL', data: parseArray('const MIAMI_DATA') },
  { name: 'Charlotte', slug: 'charlotte', state: 'NC', data: parseArray('const CHARLOTTE_DATA') },
  { name: 'San Francisco', slug: 'san-francisco', state: 'CA', data: parseArray('const SF_DATA') },
  { name: 'San Antonio', slug: 'san-antonio', state: 'TX', data: parseArray('const SANANTONIO_DATA') },
];

const allCityLinks = cities.map(c => ({ name: c.name, slug: c.slug }));

// Indicator pages — kept in sync with scripts/build-indicator-pages.js
const indicatorPages = [
  { slug: 'late-night',       title: 'Late Night',        icon: '🌙', match: ['late-night'] },
  { slug: 'hidden-gems',      title: 'Hidden Gems',       icon: '💎', match: ['hidden-gem'] },
  { slug: 'women-owned',      title: 'Women-Owned',       icon: '♀',  match: ['women-owned'] },
  { slug: 'black-owned',      title: 'Black-Owned',       icon: '✊', match: ['black-owned'] },
  { slug: 'halal',            title: 'Halal',             icon: '☪',  match: ['halal'] },
  { slug: 'lgbtq-friendly',   title: 'LGBTQ+ Friendly',   icon: '🏳‍🌈', match: ['lgbtq-friendly'] },
  { slug: 'dive-bars',        title: 'Dive Bars',         icon: '🍺', match: ['dive-bar'] },
  { slug: 'hole-in-the-wall', title: 'Hole-in-the-Wall',  icon: '🕳️', match: ['hole-in-the-wall', 'hole-in-wall'] },
];

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildCityPage(city) {
  const { name, slug, state, data } = city;
  if (!data.length) { console.log(`  Skipping ${name} — no data`); return; }

  const sorted = [...data].sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);

  // Group by neighborhood
  const byHood = {};
  data.forEach(r => {
    const hood = r.neighborhood || 'Other';
    if (!byHood[hood]) byHood[hood] = [];
    byHood[hood].push(r);
  });
  // Sort neighborhoods by average score, then alphabetically
  const hoodEntries = Object.entries(byHood)
    .map(([hood, spots]) => ({
      hood,
      spots: spots.sort((a, b) => b.score - a.score),
      avg: Math.round(spots.reduce((s, r) => s + r.score, 0) / spots.length),
      count: spots.length,
    }))
    .sort((a, b) => b.count - a.count);

  // Tag counts
  const tags = {};
  data.forEach(r => (r.tags || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
  const topTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 20);

  // Category highlights (top 5 each)
  const cats = {
    'Top Rated': sorted.slice(0, 10),
    'Fine Dining': data.filter(r => (r.tags || []).includes('Fine Dining')).sort((a, b) => b.score - a.score).slice(0, 8),
    'Date Night': data.filter(r => (r.tags || []).includes('Date Night')).sort((a, b) => b.score - a.score).slice(0, 8),
    'Brunch': data.filter(r => (r.tags || []).includes('Brunch')).sort((a, b) => b.score - a.score).slice(0, 8),
    'BBQ': data.filter(r => (r.tags || []).includes('BBQ')).sort((a, b) => b.score - a.score).slice(0, 8),
    'Bars & Cocktails': data.filter(r => (r.tags || []).some(t => /Cocktails|Bar|Brewery|Wine Bar/.test(t))).sort((a, b) => b.score - a.score).slice(0, 8),
  };

  // FAQ
  const faqs = [
    { q: `What are the best restaurants in ${name}?`, a: `Top restaurants in ${name} include ${top5.map(r => r.name).join(', ')}. Dim Hour curates ${data.length}+ ${name} restaurants with scores and reviews.` },
    { q: `What are the best brunch spots in ${name}?`, a: `Best brunch in ${name} includes ${(cats['Brunch'] || []).slice(0, 5).map(r => r.name).join(', ')}.` },
    { q: `What are the best date night restaurants in ${name}?`, a: `Top date night spots include ${(cats['Date Night'] || []).slice(0, 5).map(r => r.name).join(', ')}.` },
    { q: `How many restaurants does Dim Hour have in ${name}?`, a: `Dim Hour features ${data.length}+ curated restaurants in ${name}, organized by neighborhood, cuisine, and occasion.` },
  ];

  const otherCities = allCityLinks.filter(c => c.slug !== slug);

  // Indicator pages available for this city (3+ matching spots)
  const cityIndicators = indicatorPages
    .map(ind => ({ ...ind, count: data.filter(r => (r.indicators || []).some(i => ind.match.includes(i))).length }))
    .filter(ind => ind.count >= 3);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y37FGSEPXR"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Y37FGSEPXR');</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Restaurants in ${name} 2026 — ${data.length} Picks | Dim Hour</title>
<meta name="description" content="${data.length} restaurants in ${name}, scored and ranked. Fine dining, brunch, date night, bars — the full guide across ${hoodEntries.length} neighborhoods.">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="https://dimhour.com/${slug}/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dim Hour">
<meta property="og:title" content="Best Restaurants in ${name} 2026 — ${data.length} Picks | Dim Hour">
<meta property="og:description" content="${data.length} restaurants in ${name}, scored and ranked by neighborhood.">
<meta property="og:url" content="https://dimhour.com/${slug}/">

<meta property="og:image" content="${sorted.find(r => r.photoUrl) ? sorted.find(r => r.photoUrl).photoUrl : 'https://dimhour.com/icons/icon-512.png'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Best Restaurants in ${name} 2026 — ${data.length} Picks">
<meta name="twitter:description" content="${data.length} restaurants in ${name}, scored and ranked by Dim Hour.">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"Best Restaurants in ${name} 2026","description":"${data.length}+ curated restaurants in ${name}, scored and reviewed.","url":"https://dimhour.com/${slug}/","numberOfItems":${data.length},"itemListElement":[${top5.map((r, i) => `{"@type":"ListItem","position":${i + 1},"item":{"@type":"Restaurant","name":"${esc(r.name)}","servesCuisine":"${esc(r.cuisine)}","address":{"@type":"PostalAddress","addressLocality":"${name}","addressRegion":"${state}"}}}`).join(',')}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqs.map(f => `{"@type":"Question","name":"${esc(f.q)}","acceptedAnswer":{"@type":"Answer","text":"${esc(f.a)}"}}`).join(',')}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Dim Hour","item":"https://dimhour.com/"},{"@type":"ListItem","position":2,"name":"${name} Restaurants","item":"https://dimhour.com/${slug}/"}]}
</script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--gold:#c8a96e;--dark:#0a0d14;--card:#11151f;--text:#e8dfc8;--text2:#9a8e72;--text3:#5a4e38;--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--dark);color:var(--text);font-family:var(--sans);line-height:1.6;padding:0 16px}
.wrap{max-width:700px;margin:0 auto;padding:40px 0 60px}
h1{font-family:var(--serif);color:var(--gold);font-size:28px;margin-bottom:8px;font-style:italic}
h2{font-family:var(--serif);color:var(--gold);font-size:20px;margin:32px 0 12px;font-style:italic}
p{color:var(--text2);margin-bottom:16px;font-size:15px}
.subtitle{font-size:14px;color:var(--text2);margin-bottom:24px}
.cta{display:inline-block;background:var(--gold);color:var(--dark);padding:14px 32px;border-radius:28px;font-weight:700;text-decoration:none;font-size:15px;margin:16px 0;transition:opacity .2s}
.cta:hover{opacity:.85}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0}
.tag{background:rgba(200,169,110,.1);border:1px solid rgba(200,169,110,.25);color:var(--gold);padding:4px 12px;border-radius:16px;font-size:12px;text-decoration:none;font-weight:600}
.cat{background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:14px;padding:20px;margin-bottom:16px}
.cat h3{font-family:var(--serif);color:var(--gold);font-size:16px;margin-bottom:10px;font-style:italic}
.r{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(200,169,110,.06)}
.r:last-child{border:none}
.rn{font-weight:600;font-size:13px;color:var(--text)}
.rd{font-size:11px;color:var(--text2)}
.rs{color:var(--gold);font-weight:700;font-size:12px}
details{margin-bottom:12px}
details summary{cursor:pointer;background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:10px;padding:12px 16px;font-weight:700;color:var(--text);font-size:14px;list-style:none;display:flex;justify-content:space-between;align-items:center}
details summary::-webkit-details-marker{display:none}
details summary::after{content:'▸';color:var(--gold);font-size:16px;transition:transform .2s}
details[open] summary::after{transform:rotate(90deg)}
details[open] summary{border-radius:10px 10px 0 0;border-bottom:none}
.hood-list{background:var(--card);border:1px solid rgba(200,169,110,.15);border-top:none;border-radius:0 0 10px 10px;padding:8px 16px}
.hood-count{font-size:12px;color:var(--text3);font-weight:400}
a{color:var(--gold)}
.back{font-size:13px;color:var(--text2);text-decoration:none;display:inline-block;margin-bottom:20px}
.cities{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.city-link{background:var(--card);border:1px solid rgba(200,169,110,.2);padding:8px 16px;border-radius:10px;text-decoration:none;color:var(--text);font-size:13px;font-weight:600;transition:all .15s}
.city-link:hover{border-color:var(--gold);color:var(--gold)}
.stat{display:inline-block;background:rgba(200,169,110,.08);border:1px solid rgba(200,169,110,.2);padding:6px 14px;border-radius:20px;font-size:12px;color:var(--gold);font-weight:600;margin:4px}
</style>
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Dim Hour</a>
<h1>Best Restaurants in ${name}</h1>
<p class="subtitle">${data.length} restaurants · ${hoodEntries.length} neighborhoods · 2026</p>

<div style="margin:16px 0 24px">
<span class="stat">🍽️ ${data.length} Restaurants</span>
<span class="stat">📍 ${hoodEntries.length} Neighborhoods</span>
<span class="stat">⭐ Avg Score ${Math.round(data.reduce((s, r) => s + r.score, 0) / data.length)}</span>
</div>

<a href="https://dimhour.com" class="cta">🍽️ Open Interactive Guide</a>

<div class="tags">
${topTags.map(([t, c]) => `<span class="tag">${t} (${c})</span>`).join('\n')}
</div>

${Object.entries(cats).filter(([, items]) => items.length > 0).map(([cat, items]) => `
<div class="cat">
<h3>${cat}</h3>
${items.map(r => `<div class="r"><div><div class="rn">${esc(r.name)}</div><div class="rd">${esc(r.cuisine)} · ${esc(r.neighborhood)}</div></div><div class="rs">${r.score}</div></div>`).join('\n')}
</div>`).join('\n')}

<h2>All ${data.length} Restaurants by Neighborhood</h2>
<p>Every restaurant in ${name}, organized by neighborhood. Click to expand.</p>

${hoodEntries.map(({ hood, spots, count }) => `
<details>
<summary>${esc(hood)} <span class="hood-count">${count} spots</span></summary>
<div class="hood-list">
${spots.map(r => `<div class="r"><div><div class="rn">${esc(r.name)}</div><div class="rd">${esc(r.cuisine)}${r.awards ? ' · ' + esc(r.awards) : ''}</div></div><div class="rs">${r.score}</div></div>`).join('\n')}
</div>
</details>`).join('\n')}

<div style="text-align:center;margin:32px 0">
<a href="https://dimhour.com" class="cta">🍽️ Explore the Full Interactive Guide</a>
</div>

${cityIndicators.length ? `<h2>Browse ${name} by Identity</h2>
<div class="cities">
${cityIndicators.map(ind => `<a href="/${slug}/${ind.slug}/" class="city-link">${ind.icon} ${ind.title} (${ind.count})</a>`).join('\n')}
</div>` : ''}

<h2>Explore More Cities</h2>
<div class="cities">
${otherCities.map(c => `<a href="/${c.slug}/" class="city-link">${c.name}</a>`).join('\n')}
</div>

<p style="margin-top:32px;font-size:13px;color:var(--text3)">Dim Hour scores every restaurant on food, service, ambiance, and value. Every pick is verified. <a href="https://dimhour.com">Explore the full guide →</a></p>
</div>
</body>
</html>`;

  fs.mkdirSync(slug, { recursive: true });
  fs.writeFileSync(path.join(slug, 'index.html'), html);
  console.log(`  ✓ ${slug}/index.html — ${data.length} restaurants, ${hoodEntries.length} neighborhoods`);
}

console.log('Building city pages...\n');
cities.forEach(buildCityPage);
console.log('\n✅ All city pages built!');
