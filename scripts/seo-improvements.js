// SEO improvements:
// 1. Fix homepage meta tags + structured data
// 2. Create Austin + Salt Lake City landing pages
// 3. Update sitemap with new cities
// 4. Add noscript crawlable content to index.html
// Run: node scripts/seo-improvements.js

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════
// 1. FIX HOMEPAGE META TAGS
// ═══════════════════════════════════════════
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Upgrade title
indexHtml = indexHtml.replace(
  '<title>Appetyt</title>',
  '<title>Appetyt — Best Restaurants in NYC, Dallas, Austin, Chicago, Houston, Salt Lake City | 2026 Guide</title>'
);

// Upgrade meta description
indexHtml = indexHtml.replace(
  '<meta name="description" content="Appetyt — Discover the best restaurants in 248 cities worldwide.">',
  '<meta name="description" content="Discover the best restaurants in NYC, Dallas, Austin, Chicago, Houston, and Salt Lake City. 2,400+ curated restaurants with scores, reviews, and reservations. Your ultimate dining guide for 2026.">'
);

// Add Open Graph + Twitter + keywords after canonical
const ogTags = `
<meta name="keywords" content="best restaurants, restaurant guide, where to eat, NYC restaurants, Dallas restaurants, Austin restaurants, Chicago restaurants, Houston restaurants, Salt Lake City restaurants, brunch, fine dining, date night, happy hour, 2026">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Appetyt">
<meta property="og:title" content="Appetyt — Discover the Best Restaurants in 2,400+ Curated Spots">
<meta property="og:description" content="2,400+ restaurants scored and reviewed across NYC, Dallas, Austin, Chicago, Houston, and Salt Lake City. Find brunch, date night, happy hour, and fine dining spots.">
<meta property="og:url" content="https://appetyt.app/">
<meta property="og:image" content="https://appetyt.app/icons/icon-512.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Appetyt — Best Restaurants in NYC, Dallas, Austin, Chicago, Houston, SLC">
<meta name="twitter:description" content="2,400+ restaurants scored and reviewed. Your ultimate dining guide for 2026.">`;

if (!indexHtml.includes('og:type')) {
  indexHtml = indexHtml.replace(
    '<link rel="canonical" href="https://appetyt.app/">',
    '<link rel="canonical" href="https://appetyt.app/">' + ogTags
  );
  console.log('✓ Added Open Graph, Twitter, keywords meta tags to homepage');
}

// Add structured data for the homepage (WebSite + ItemList schema)
const homepageSchema = `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Appetyt","url":"https://appetyt.app/","description":"Discover the best restaurants across America. 2,400+ curated spots with scores, reviews, and reservations.","potentialAction":{"@type":"SearchAction","target":"https://appetyt.app/?q={search_term_string}","query-input":"required name=search_term_string"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ItemList","name":"Best Restaurant Cities on Appetyt","description":"Explore curated restaurant guides for top US cities","numberOfItems":6,"itemListElement":[
{"@type":"ListItem","position":1,"item":{"@type":"City","name":"New York City","url":"https://appetyt.app/nyc/"}},
{"@type":"ListItem","position":2,"item":{"@type":"City","name":"Dallas","url":"https://appetyt.app/dallas/"}},
{"@type":"ListItem","position":3,"item":{"@type":"City","name":"Houston","url":"https://appetyt.app/houston/"}},
{"@type":"ListItem","position":4,"item":{"@type":"City","name":"Chicago","url":"https://appetyt.app/chicago/"}},
{"@type":"ListItem","position":5,"item":{"@type":"City","name":"Austin","url":"https://appetyt.app/austin/"}},
{"@type":"ListItem","position":6,"item":{"@type":"City","name":"Salt Lake City","url":"https://appetyt.app/salt-lake-city/"}}
]}
</script>`;

if (!indexHtml.includes('WebSite')) {
  indexHtml = indexHtml.replace('</head>', homepageSchema + '\n</head>');
  console.log('✓ Added WebSite + ItemList structured data to homepage');
}

// Add noscript content for crawlers (real restaurant names Google can index)
const noscriptContent = `
<noscript>
<div style="max-width:700px;margin:0 auto;padding:40px 16px;font-family:sans-serif;color:#e8dfc8;background:#0a0d14">
<h1 style="color:#c8a96e;font-size:28px">Appetyt — Discover the Best Restaurants</h1>
<p>2,400+ curated restaurants across America's top dining cities.</p>
<h2 style="color:#c8a96e">Cities</h2>
<ul>
<li><a href="/nyc/" style="color:#c8a96e">New York City — 774 restaurants</a></li>
<li><a href="/dallas/" style="color:#c8a96e">Dallas — 608 restaurants</a></li>
<li><a href="/austin/" style="color:#c8a96e">Austin — 258 restaurants</a></li>
<li><a href="/houston/" style="color:#c8a96e">Houston — 257 restaurants</a></li>
<li><a href="/salt-lake-city/" style="color:#c8a96e">Salt Lake City / Park City — 254 restaurants</a></li>
<li><a href="/chicago/" style="color:#c8a96e">Chicago — 250 restaurants</a></li>
</ul>
<h2 style="color:#c8a96e">Popular Categories</h2>
<p>Fine Dining · Date Night · Brunch · Happy Hour · BBQ · Tacos · Sushi · Pizza · Cocktail Bars · Breweries · Rooftop · Patio · Live Music · Food Trucks</p>
<p>Download the app or browse online at <a href="https://appetyt.app" style="color:#c8a96e">appetyt.app</a></p>
</div>
</noscript>`;

if (!indexHtml.includes('<noscript>')) {
  indexHtml = indexHtml.replace('<div id="app">', noscriptContent + '\n<div id="app">');
  console.log('✓ Added noscript crawlable content with city links');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✓ Homepage SEO updated');

// ═══════════════════════════════════════════
// 2. CREATE AUSTIN LANDING PAGE
// ═══════════════════════════════════════════

// Parse Austin data for the landing page
const austinData = JSON.parse(indexHtml.slice(
  indexHtml.indexOf('[', indexHtml.indexOf('const AUSTIN_DATA')),
  (() => { let d=0,s=indexHtml.indexOf('[',indexHtml.indexOf('const AUSTIN_DATA')),e=s; for(let i=s;i<indexHtml.length;i++){if(indexHtml[i]==='[')d++;if(indexHtml[i]===']')d--;if(d===0){e=i+1;break;}} return e; })()
));

function createCityPage(city, slug, data, state) {
  const top5 = data.sort((a,b) => b.score - a.score).slice(0, 5);
  const tags = {};
  data.forEach(r => (r.tags||[]).forEach(t => { tags[t] = (tags[t]||0)+1; }));
  const topTags = Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,15);

  // Category groups
  const categories = {
    'Fine Dining': data.filter(r=>(r.tags||[]).includes('Fine Dining')).sort((a,b)=>b.score-a.score).slice(0,5),
    'Date Night': data.filter(r=>(r.tags||[]).includes('Date Night')).sort((a,b)=>b.score-a.score).slice(0,5),
    'Brunch': data.filter(r=>(r.tags||[]).includes('Brunch')).sort((a,b)=>b.score-a.score).slice(0,5),
    'Casual / Local Favorites': data.filter(r=>(r.tags||[]).includes('Local Favorites')&&(r.tags||[]).includes('Casual')).sort((a,b)=>b.score-a.score).slice(0,5),
    'BBQ': data.filter(r=>(r.tags||[]).includes('BBQ')).sort((a,b)=>b.score-a.score).slice(0,5),
    'Bars & Cocktails': data.filter(r=>(r.tags||[]).some(t=>/Cocktails|Bar|Brewery/.test(t))).sort((a,b)=>b.score-a.score).slice(0,5),
  };

  const faqQuestions = [
    {q:`What are the best restaurants in ${city}?`, a:`Top restaurants in ${city} include ${top5.map(r=>r.name+' ('+r.cuisine+', score '+r.score+')').join(', ')}. Appetyt curates ${data.length}+ ${city} restaurants with scores and reviews.`},
    {q:`What are the best brunch spots in ${city}?`, a:`Best brunch in ${city} includes ${(categories['Brunch']||[]).map(r=>r.name).join(', ')}. ${city} has ${data.filter(r=>(r.tags||[]).includes('Brunch')).length}+ restaurants with excellent brunch options.`},
    {q:`What are the best date night restaurants in ${city}?`, a:`Top date night spots in ${city} include ${(categories['Date Night']||[]).map(r=>r.name).join(', ')}. With ${data.filter(r=>(r.tags||[]).includes('Date Night')).length}+ date night options, ${city} is a top dining destination.`},
    {q:`What are the best BBQ restaurants in ${city}?`, a:`Best BBQ in ${city} includes ${(categories['BBQ']||[]).map(r=>r.name).join(', ')}. ${city} has ${data.filter(r=>(r.tags||[]).includes('BBQ')).length}+ BBQ spots scored and reviewed.`},
    {q:`What are the best bars and cocktail bars in ${city}?`, a:`Top bars in ${city} include ${(categories['Bars & Cocktails']||[]).map(r=>r.name).slice(0,5).join(', ')}. ${city} offers ${data.filter(r=>(r.tags||[]).some(t=>/Cocktails|Bar/.test(t))).length}+ bar and cocktail options.`},
  ];

  const otherCities = [
    {name:'New York City',slug:'nyc'},{name:'Dallas',slug:'dallas'},{name:'Houston',slug:'houston'},
    {name:'Chicago',slug:'chicago'},{name:'Austin',slug:'austin'},{name:'Salt Lake City',slug:'salt-lake-city'},
  ].filter(c => c.slug !== slug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y37FGSEPXR"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Y37FGSEPXR');</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Best Restaurants in ${city} 2026 | Brunch, Patio, Date Night | Appetyt</title>
<meta name="description" content="Discover the best restaurants in ${city} — top brunch spots, patio dining, date night, happy hour, and fine dining. Curated guide to ${data.length}+ ${city} restaurants with scores and reviews.">
<meta name="keywords" content="best restaurants ${city}, best brunch ${city}, best patio ${city}, best date night ${city}, best happy hour ${city}, fine dining ${city}, ${city} restaurant guide, where to eat ${city}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="https://appetyt.app/${slug}/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Appetyt">
<meta property="og:title" content="Best Restaurants in ${city} 2026 — Curated Guide">
<meta property="og:description" content="${data.length}+ ${city} restaurants scored and reviewed. Find the best brunch, patio, date night, and fine dining spots.">
<meta property="og:url" content="https://appetyt.app/${slug}/">
<meta property="og:image" content="https://appetyt.app/icons/icon-512.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Best Restaurants in ${city} 2026 — Curated Guide">
<meta name="twitter:description" content="${data.length}+ ${city} restaurants scored and reviewed. Find the best brunch, patio, date night, and fine dining spots.">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best Restaurants in ${city} 2026",
  "description": "Curated guide to the best restaurants in ${city}, scored and reviewed by Appetyt.",
  "url": "https://appetyt.app/${slug}/",
  "numberOfItems": ${data.length},
  "itemListElement": [
    ${top5.map((r,i) => `{"@type":"ListItem","position":${i+1},"item":{"@type":"Restaurant","name":"${r.name.replace(/"/g,'\\"')}","servesCuisine":"${r.cuisine}","address":{"@type":"PostalAddress","addressLocality":"${city}","addressRegion":"${state}"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"${r.score}","bestRating":"100"}}}`).join(',\n    ')}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${faqQuestions.map(f => `{"@type":"Question","name":"${f.q}","acceptedAnswer":{"@type":"Answer","text":"${f.a.replace(/"/g,'\\"')}"}}`).join(',\n    ')}
  ]
}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Appetyt","item":"https://appetyt.app/"},{"@type":"ListItem","position":2,"name":"${city} Restaurants","item":"https://appetyt.app/${slug}/"}]}
</script>
<style>
:root{--gold:#c8a96e;--dark:#0a0d14;--card:#11151f;--text:#e8dfc8;--text2:#9a8e72;--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--dark);color:var(--text);font-family:var(--sans);line-height:1.6;padding:0 16px}
.wrap{max-width:700px;margin:0 auto;padding:40px 0 60px}
h1{font-family:var(--serif);color:var(--gold);font-size:28px;margin-bottom:8px;font-style:italic}
h2{font-family:var(--serif);color:var(--gold);font-size:20px;margin:32px 0 12px;font-style:italic}
p{color:var(--text2);margin-bottom:16px;font-size:15px}
.subtitle{font-size:14px;color:var(--text2);margin-bottom:24px}
.cat{background:var(--card);border:1px solid rgba(200,169,110,.15);border-radius:14px;padding:20px;margin-bottom:16px}
.cat h3{font-family:var(--serif);color:var(--gold);font-size:16px;margin-bottom:10px;font-style:italic}
.r{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(200,169,110,.06)}
.r:last-child{border:none}
.rn{font-weight:600;font-size:14px;color:var(--text)}
.rd{font-size:12px;color:var(--text2)}
.rs{color:var(--gold);font-weight:700;font-size:13px}
.cta{display:inline-block;background:var(--gold);color:var(--dark);padding:14px 32px;border-radius:28px;font-weight:700;text-decoration:none;font-size:15px;margin-top:24px;transition:opacity .2s}
.cta:hover{opacity:.85}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0}
.tag{background:rgba(200,169,110,.1);border:1px solid rgba(200,169,110,.25);color:var(--gold);padding:4px 12px;border-radius:16px;font-size:12px;text-decoration:none;font-weight:600}
.tag:hover{background:rgba(200,169,110,.2)}
a{color:var(--gold)}
.back{font-size:13px;color:var(--text2);text-decoration:none;display:inline-block;margin-bottom:20px}
.cities{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.city-link{background:var(--card);border:1px solid rgba(200,169,110,.2);padding:8px 16px;border-radius:10px;text-decoration:none;color:var(--text);font-size:13px;font-weight:600;transition:all .15s}
.city-link:hover{border-color:var(--gold);color:var(--gold)}
</style>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
<div class="wrap">
<a href="/" class="back">← Back to Appetyt</a>
<h1>Best Restaurants in ${city} 2026</h1>
<p class="subtitle">${data.length}+ curated restaurants · Scored & reviewed · Updated weekly</p>
<a href="https://appetyt.app" class="cta">🍽️ Open Full Guide</a>

<div class="tags">
${topTags.map(([t,c]) => `<a href="https://appetyt.app" class="tag">${t} (${c})</a>`).join('\n')}
</div>

${Object.entries(categories).map(([cat, items]) => items.length > 0 ? `
<div class="cat">
<h3>${cat}</h3>
${items.map(r => `<div class="r"><div><div class="rn">${r.name}</div><div class="rd">${r.cuisine} · ${r.neighborhood}</div></div><div class="rs">${r.score}</div></div>`).join('\n')}
</div>` : '').join('\n')}

<h2>Explore More Cities</h2>
<div class="cities">
${otherCities.map(c => `<a href="/${c.slug}/" class="city-link">${c.name}</a>`).join('\n')}
</div>

<p style="margin-top:32px;font-size:13px;color:var(--text2)">Appetyt curates the best restaurants across America. Every restaurant is scored based on food quality, service, ambiance, and value. <a href="https://appetyt.app">Explore the full guide →</a></p>
</div>
</body>
</html>`;
}

// Parse SLC data
const slcStart = indexHtml.indexOf('const SLC_DATA=');
const slcArrStart = indexHtml.indexOf('[', slcStart);
let sd=0, se=slcArrStart;
for(let i=slcArrStart;i<indexHtml.length;i++){if(indexHtml[i]==='[')sd++;if(indexHtml[i]===']')sd--;if(sd===0){se=i+1;break;}}
const slcData = JSON.parse(indexHtml.slice(slcArrStart, se));

// Create Austin page
fs.mkdirSync('austin', { recursive: true });
fs.writeFileSync('austin/index.html', createCityPage('Austin', 'austin', austinData, 'TX'));
console.log('✓ Created austin/index.html landing page');

// Create Salt Lake City page
fs.mkdirSync('salt-lake-city', { recursive: true });
fs.writeFileSync('salt-lake-city/index.html', createCityPage('Salt Lake City', 'salt-lake-city', slcData, 'UT'));
console.log('✓ Created salt-lake-city/index.html landing page');

// ═══════════════════════════════════════════
// 3. UPDATE SITEMAP
// ═══════════════════════════════════════════
const today = new Date().toISOString().split('T')[0];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://appetyt.app/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://appetyt.app/dallas/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/nyc/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/chicago/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/houston/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/austin/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/salt-lake-city/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://appetyt.app/seattle/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://appetyt.app/los-angeles/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://appetyt.app/san-antonio/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('✓ Updated sitemap.xml with Austin + Salt Lake City');

// ═══════════════════════════════════════════
// 4. UPDATE EXISTING CITY PAGES WITH CROSS-LINKS
// ═══════════════════════════════════════════
const cityDirs = ['dallas','nyc','chicago','houston','los-angeles','seattle','san-antonio'];
for (const dir of cityDirs) {
  const filePath = path.join(dir, 'index.html');
  if (fs.existsSync(filePath)) {
    let cityHtml = fs.readFileSync(filePath, 'utf8');
    // Add Austin and SLC links if not already present
    if (!cityHtml.includes('austin') && cityHtml.includes('city-link')) {
      cityHtml = cityHtml.replace(
        '</div>\n\n<p style="margin-top:32px',
        `<a href="/austin/" class="city-link">Austin</a>\n<a href="/salt-lake-city/" class="city-link">Salt Lake City</a>\n</div>\n\n<p style="margin-top:32px`
      );
      fs.writeFileSync(filePath, cityHtml);
      console.log(`✓ Added Austin + SLC cross-links to ${dir}/index.html`);
    }
  }
}

console.log('\n✅ All SEO improvements applied!');
console.log('   - Homepage: title, meta, OG, Twitter, structured data, noscript content');
console.log('   - New pages: austin/index.html, salt-lake-city/index.html');
console.log('   - Sitemap: updated with all cities');
console.log('   - Cross-links: Austin + SLC added to existing city pages');
