#!/usr/bin/env node
// Build SEO category pages targeting high-volume search queries
// e.g. "best brunch in Dallas", "best BBQ in Austin", "best sushi NYC"
// Run: node scripts/build-category-pages.js

const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function parseArray(tag) {
  const s = indexHtml.indexOf(tag);
  if (s === -1) return [];
  const a = indexHtml.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < indexHtml.length; i++) { if (indexHtml[i] === '[') d++; if (indexHtml[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  try { return JSON.parse(indexHtml.slice(a, e)); } catch(e) { return []; }
}
function parseChicago() {
  const ci = indexHtml.indexOf("'Chicago': [", indexHtml.indexOf('const CITY_DATA'));
  if (ci === -1) return [];
  const ca = indexHtml.indexOf('[', ci + 10);
  let d = 0, e = ca;
  for (let i = ca; i < indexHtml.length; i++) { if (indexHtml[i] === '[') d++; if (indexHtml[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  try { return JSON.parse(indexHtml.slice(ca, e)); } catch(e) { return []; }
}

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const cities = [
  { name: 'New York City', short: 'NYC', slug: 'nyc', state: 'NY', data: parseArray('const NYC_DATA') },
  { name: 'Dallas', short: 'Dallas', slug: 'dallas', state: 'TX', data: parseArray('const DALLAS_DATA') },
  { name: 'Houston', short: 'Houston', slug: 'houston', state: 'TX', data: parseArray('const HOUSTON_DATA') },
  { name: 'Austin', short: 'Austin', slug: 'austin', state: 'TX', data: parseArray('const AUSTIN_DATA') },
  { name: 'Chicago', short: 'Chicago', slug: 'chicago', state: 'IL', data: parseChicago() },
  { name: 'Salt Lake City', short: 'Salt Lake City', slug: 'salt-lake-city', state: 'UT', data: parseArray('const SLC_DATA=') },
];

// Categories that match high-volume Google searches
const categories = [
  { tag: 'Brunch', slug: 'brunch', title: 'Brunch', icon: '🥞', searchTerm: 'best brunch' },
  { tag: 'Date Night', slug: 'date-night', title: 'Date Night', icon: '🕯️', searchTerm: 'best date night restaurants' },
  { tag: 'Fine Dining', slug: 'fine-dining', title: 'Fine Dining', icon: '🍽️', searchTerm: 'best fine dining' },
  { tag: 'BBQ', slug: 'bbq', title: 'BBQ', icon: '🔥', searchTerm: 'best BBQ' },
  { tag: 'Happy Hour', slug: 'happy-hour', title: 'Happy Hour', icon: '🍸', searchTerm: 'best happy hour' },
  { tag: 'Patio', slug: 'patio', title: 'Patio Dining', icon: '☀️', searchTerm: 'best patio restaurants' },
  { tags: ['Cocktails', 'Bar'], slug: 'bars', title: 'Bars & Cocktails', icon: '🍹', searchTerm: 'best cocktail bars' },
  { tags: ['Italian', 'Pizza'], slug: 'italian', title: 'Italian & Pizza', icon: '🍕', searchTerm: 'best Italian restaurants' },
  { tag: 'Mexican', slug: 'mexican', title: 'Mexican & Tex-Mex', icon: '🌮', searchTerm: 'best Mexican restaurants' },
  { tags: ['Japanese', 'Sushi'], slug: 'sushi', title: 'Sushi & Japanese', icon: '🍣', searchTerm: 'best sushi' },
  { tag: 'Casual', slug: 'casual', title: 'Casual Dining', icon: '😎', searchTerm: 'best casual restaurants' },
  { tags: ['Brewery', 'Craft Beer'], slug: 'breweries', title: 'Breweries & Craft Beer', icon: '🍺', searchTerm: 'best breweries' },
];

function filterByCategory(data, cat) {
  if (cat.tags) {
    return data.filter(r => (r.tags || []).some(t => cat.tags.some(ct => t.includes(ct)))).sort((a, b) => b.score - a.score);
  }
  return data.filter(r => (r.tags || []).includes(cat.tag)).sort((a, b) => b.score - a.score);
}

function buildCategoryPage(city, cat, spots) {
  const { name, short, slug: citySlug, state } = city;
  const top5 = spots.slice(0, 5);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y37FGSEPXR"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Y37FGSEPXR');</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cat.searchTerm} in ${name} 2026 | Top ${spots.length} Spots | Dim Hour</title>
<meta name="description" content="${cat.searchTerm} in ${name} — ${spots.length} curated ${cat.title.toLowerCase()} spots scored and reviewed. ${top5.map(r => r.name).join(', ')}, and more.">
<meta name="keywords" content="${cat.searchTerm} ${name}, ${cat.searchTerm} ${short}, ${cat.title.toLowerCase()} ${name}, where to eat ${name}, ${name} restaurant guide 2026">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="https://dimhour.com/${citySlug}/${cat.slug}/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dim Hour">
<meta property="og:title" content="${cat.searchTerm} in ${name} 2026 — Top ${spots.length} Spots">
<meta property="og:description" content="${spots.length} curated ${cat.title.toLowerCase()} spots in ${name}. ${top5.map(r => r.name).join(', ')}.">
<meta property="og:url" content="https://dimhour.com/${citySlug}/${cat.slug}/">
<meta property="og:image" content="https://dimhour.com/icons/icon-512.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"${cat.searchTerm} in ${name} 2026","description":"${spots.length} curated ${cat.title.toLowerCase()} spots in ${name}.","url":"https://dimhour.com/${citySlug}/${cat.slug}/","numberOfItems":${spots.length},"itemListElement":[${top5.map((r, i) => `{"@type":"ListItem","position":${i + 1},"item":{"@type":"Restaurant","name":"${esc(r.name)}","servesCuisine":"${esc(r.cuisine)}","address":{"@type":"PostalAddress","addressLocality":"${name}","addressRegion":"${state}"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"${r.score}","bestRating":"100"}}}`).join(',')}]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Dim Hour","item":"https://dimhour.com/"},{"@type":"ListItem","position":2,"name":"${name}","item":"https://dimhour.com/${citySlug}/"},{"@type":"ListItem","position":3,"name":"${cat.title}","item":"https://dimhour.com/${citySlug}/${cat.slug}/"}]}
</script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--gold:#c8a96e;--dark:#0a0d14;--card:#11151f;--text:#e8dfc8;--text2:#9a8e72;--text3:#5a4e38;--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--dark);color:var(--text);font-family:var(--sans);line-height:1.6;padding:0 16px}
.wrap{max-width:700px;margin:0 auto;padding:40px 0 60px}
h1{font-family:var(--serif);color:var(--gold);font-size:26px;margin-bottom:8px;font-style:italic}
h2{font-family:var(--serif);color:var(--gold);font-size:18px;margin:28px 0 12px;font-style:italic}
p{color:var(--text2);margin-bottom:16px;font-size:15px}
.cta{display:inline-block;background:var(--gold);color:var(--dark);padding:12px 28px;border-radius:28px;font-weight:700;text-decoration:none;font-size:14px;margin:16px 0;transition:opacity .2s}
.cta:hover{opacity:.85}
.rank{display:flex;align-items:flex-start;gap:12px;background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:12px;padding:16px;margin-bottom:10px}
.rank-num{font-family:var(--serif);font-size:24px;font-weight:700;color:var(--gold);min-width:28px;font-style:italic}
.rank-name{font-weight:700;font-size:15px;color:var(--text)}
.rank-meta{font-size:12px;color:var(--text2);margin-top:2px}
.rank-desc{font-size:13px;color:var(--text2);margin-top:6px;line-height:1.5}
.rank-score{font-size:20px;font-weight:700;color:var(--gold);margin-left:auto;flex-shrink:0}
.more{background:var(--card);border:1px solid rgba(200,169,110,.1);border-radius:10px;padding:8px 14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
.more-name{font-weight:600;font-size:13px;color:var(--text)}
.more-meta{font-size:11px;color:var(--text2)}
.more-score{color:var(--gold);font-weight:700;font-size:12px}
a{color:var(--gold)}
.back{font-size:13px;color:var(--text2);text-decoration:none;display:inline-block;margin-bottom:20px}
.cats{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0}
.cat-link{background:rgba(200,169,110,.1);border:1px solid rgba(200,169,110,.25);color:var(--gold);padding:4px 12px;border-radius:16px;font-size:12px;text-decoration:none;font-weight:600}
.cat-link:hover{background:rgba(200,169,110,.2)}
.cities{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.city-link{background:var(--card);border:1px solid rgba(200,169,110,.2);padding:6px 14px;border-radius:10px;text-decoration:none;color:var(--text);font-size:12px;font-weight:600}
.city-link:hover{border-color:var(--gold);color:var(--gold)}
</style>
</head>
<body>
<div class="wrap">
<a href="/${citySlug}/" class="back">← ${name} Restaurants</a>
<h1>${cat.icon} Best ${cat.title} in ${name}</h1>
<p>${spots.length} curated ${cat.title.toLowerCase()} spots, scored and reviewed for 2026.</p>
<a href="https://dimhour.com" class="cta">🍽️ Open Interactive Guide</a>

<h2>Top ${Math.min(10, spots.length)} ${cat.title} Spots</h2>

${spots.slice(0, 10).map((r, i) => `
<div class="rank">
<div class="rank-num">${i + 1}</div>
<div style="flex:1">
<div class="rank-name">${esc(r.name)}</div>
<div class="rank-meta">${esc(r.cuisine)} · ${esc(r.neighborhood)}${r.awards ? ' · ' + esc(r.awards) : ''}</div>
${r.description ? `<div class="rank-desc">${esc(r.description).substring(0, 200)}${r.description.length > 200 ? '...' : ''}</div>` : ''}
</div>
<div class="rank-score">${r.score}</div>
</div>`).join('\n')}

${spots.length > 10 ? `
<h2>All ${spots.length} ${cat.title} Spots in ${name}</h2>
${spots.slice(10).map(r => `
<div class="more">
<div><div class="more-name">${esc(r.name)}</div><div class="more-meta">${esc(r.cuisine)} · ${esc(r.neighborhood)}</div></div>
<div class="more-score">${r.score}</div>
</div>`).join('\n')}` : ''}

<div style="text-align:center;margin:28px 0">
<a href="https://dimhour.com" class="cta">🍽️ Explore All ${name} Restaurants</a>
</div>

<h2>More ${name} Categories</h2>
<div class="cats">
${categories.filter(c => c.slug !== cat.slug).map(c => `<a href="/${citySlug}/${c.slug}/" class="cat-link">${c.icon} ${c.title}</a>`).join('\n')}
</div>

<h2>${cat.title} in Other Cities</h2>
<div class="cities">
${cities.filter(c => c.slug !== citySlug).map(c => `<a href="/${c.slug}/${cat.slug}/" class="city-link">${c.short}</a>`).join('\n')}
</div>

<p style="margin-top:24px;font-size:12px;color:var(--text3)">Dim Hour curates the best restaurants across America. Updated weekly. <a href="https://dimhour.com">Full guide →</a> · <a href="/${citySlug}/">All ${name} restaurants →</a></p>
</div>
</body>
</html>`;
}

// Build all category pages
let totalPages = 0;
const sitemapUrls = [];

for (const city of cities) {
  for (const cat of categories) {
    const spots = filterByCategory(city.data, cat);
    if (spots.length < 3) continue; // Skip if too few results

    const dir = path.join(city.slug, cat.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildCategoryPage(city, cat, spots));
    sitemapUrls.push(`https://dimhour.com/${city.slug}/${cat.slug}/`);
    totalPages++;
  }
  console.log(`  ✓ ${city.name}: ${categories.length} category pages`);
}

// Update sitemap with category pages
const today = new Date().toISOString().split('T')[0];
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const closingTag = '</urlset>';
const newUrls = sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

sitemap = sitemap.replace(closingTag, newUrls + '\n' + closingTag);
fs.writeFileSync('sitemap.xml', sitemap);

console.log(`\n✅ Built ${totalPages} category pages across ${cities.length} cities`);
console.log(`   Sitemap updated with ${sitemapUrls.length} new URLs`);
console.log(`   Total sitemap URLs: ${9 + sitemapUrls.length}`);
