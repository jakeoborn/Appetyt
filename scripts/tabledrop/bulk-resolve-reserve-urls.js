#!/usr/bin/env node
/*
 * Bulk-resolve reserveUrl for cards without one by Firecrawl site-search.
 * Queries all 4 platforms in one search per card; picks the first URL that
 * matches a known venue-page pattern. Also surfaces platform mismatches
 * (stored reservation field disagreeing with what the venue actually uses).
 *
 * Usage:
 *   node scripts/tabledrop/bulk-resolve-reserve-urls.js <candidates.json> <output.json> [--city "New York"] [--limit N]
 *
 * Env:
 *   FIRECRAWL_API_KEY (falls back to hardcoded key from ~/.claude.json if not set)
 *
 * Output JSON shape:
 *   [{id, name, storedPlatform, resolvedPlatform, reserveUrl, confidence, allHits:[...]}]
 */
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-472784daf63046f58cad77c132750f38';
const ENDPOINT = 'https://api.firecrawl.dev/v1/search';

const args = process.argv.slice(2);
const inPath = args[0];
const outPath = args[1];
if (!inPath || !outPath) {
  console.error('Usage: node bulk-resolve-reserve-urls.js <candidates.json> <output.json> [--city "New York"] [--limit N] [--concurrency N]');
  process.exit(1);
}
const getFlag = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const CITY = getFlag('--city') || 'New York';
const LIMIT = parseInt(getFlag('--limit') || '0', 10);
const CONCURRENCY = parseInt(getFlag('--concurrency') || '4', 10);
const RESUME = args.includes('--resume');

// Per-city geo markers for filtering search hits.
// `include`: URL fragments that indicate a hit is in the target city (boost score).
// `exclude`: URL fragments that indicate a DIFFERENT city (hard-reject the hit).
// Resy and OpenTable both embed city info in slugs; Tock/SevenRooms are flatter.
// Kept intentionally broad — a slight excess of excludes is fine (only rejects obvious wrong-city hits).
const CITY_GEO_MARKERS = {
  'New York':       { include: ['new-york-ny', '/ny/', '-new-york', '-brooklyn', '-queens', '-bronx', '-staten-island', '-manhattan'],
                      exclude: ['woodstock-vt', 'hamptons-ny', '-boston', 'los-angeles', 'chicago-il', 'miami-fl', 'dc-', '-san-francisco', '-seattle', '-austin-tx', '-dallas', '-philadelphia', '-atlanta', '-las-vegas', '-houston', '-san-diego', '-phoenix', '-charlotte', '-salt-lake-city'] },
  'Dallas':         { include: ['-dallas', '/dal/', 'dallas-tx', '-fort-worth', '-plano', '-frisco', '-addison', '-irving-tx', '-arlington-tx'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-san-francisco', '-seattle', '-austin-tx', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Houston':        { include: ['-houston', '/hou/', 'houston-tx', '-sugar-land', '-the-woodlands', '-katy-tx', '-pearland'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Chicago':        { include: ['chicago-il', '-chicago', '/chi/', '-evanston-il', '-oak-park-il'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Austin':         { include: ['austin-tx', '-austin', '/atx/', '-round-rock', '-lakeway', '-cedar-park'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Salt Lake City': { include: ['salt-lake-city', 'slc-', '/slc/', '-park-city-ut', '-sandy-ut', '-holladay-ut', '-provo-ut', '-ogden-ut', '-midvale-ut'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas'] },
  'Las Vegas':      { include: ['las-vegas-nv', '/lv/', '-las-vegas', '-henderson-nv', '-summerlin', '-paradise-nv'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-salt-lake-city'] },
  'Seattle':        { include: ['seattle-wa', '-seattle', '/sea/', '-bellevue-wa', '-capitol-hill'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Los Angeles':    { include: ['los-angeles-ca', '-los-angeles', '/la/', '-santa-monica', '-beverly-hills', '-venice-ca', '-culver-city', '-west-hollywood', '-pasadena-ca'],
                      exclude: ['new-york', '-brooklyn', '/ny/', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'San Diego':      { include: ['san-diego-ca', '-san-diego', '/sd/', '-la-jolla', '-coronado', '-del-mar-ca'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-las-vegas', '-salt-lake-city', '-san-francisco'] },
  'Phoenix':        { include: ['phoenix-az', '-phoenix', '/phx/', '-scottsdale', '-tempe-az', '-mesa-az', '-chandler-az'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'San Antonio':    { include: ['san-antonio-tx', '-san-antonio', '/sat/'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Miami':          { include: ['miami-fl', '-miami', '/mia/', '-miami-beach', '-coral-gables', '-wynwood'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-charlotte', '-san-diego', '-las-vegas', '-salt-lake-city'] },
  'Charlotte':      { include: ['charlotte-nc', '-charlotte', '/clt/', '-southpark-charlotte', '-uptown-charlotte'],
                      exclude: ['new-york', '-brooklyn', '/ny/', '-los-angeles', 'chicago-il', '-miami', '-boston', '-seattle', '-austin-tx', '-dallas', '-houston', '-phoenix', '-san-diego', '-las-vegas', '-salt-lake-city'] },
};

// Venue-page URL patterns per platform.
// Each pattern returns the canonical URL substring when matched against a search hit.
const VENUE_PATTERNS = [
  {
    platform: 'Resy',
    test: (u) => /^https?:\/\/resy\.com\/cities\/[^/]+\/venues\/[^/?#]+\/?$/.test(u) ||
                 /^https?:\/\/resy\.com\/cities\/(?:ny|la|chi|sf|mia|sea|bos|hou|dc|atl)\/[^/?#]+\/?$/.test(u),
  },
  {
    platform: 'OpenTable',
    test: (u) => /^https?:\/\/(?:www\.)?opentable\.com\/r\/[a-z0-9-]+\/?$/.test(u),
  },
  {
    platform: 'Tock',
    // Tock venues: exploretock.com/<slug> — but exclude /search, /explore, /blog etc.
    test: (u) => /^https?:\/\/(?:www\.)?exploretock\.com\/[a-z0-9-]+\/?$/.test(u) &&
                 !/\/(search|explore|blog|about|careers|terms|privacy|help|venues)\/?$/.test(u),
  },
  {
    platform: 'SevenRooms',
    test: (u) => /^https?:\/\/(?:www\.|fp\.)?sevenrooms\.com\/(?:explore|reservations)\/[a-z0-9-]+/.test(u),
  },
];

function classifyUrl(u) {
  for (const p of VENUE_PATTERNS) if (p.test(u)) return p.platform;
  return null;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function firecrawlSearch(query, limit = 5, attempt = 0) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit }),
  });
  if (res.status === 429 && attempt < 4) {
    // Exponential backoff: 2s, 4s, 8s, 16s.
    await sleep(2000 * Math.pow(2, attempt));
    return firecrawlSearch(query, limit, attempt + 1);
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Firecrawl ' + res.status + ': ' + txt.slice(0, 200));
  }
  const json = await res.json();
  const arr = Array.isArray(json.data) ? json.data : (json.data?.web || json.web || []);
  return arr.filter(x => x && x.url);
}

// Primary query: site-restrict to ALL 4 platforms via OR. Google supports this.
function buildQuery(name, city) {
  const n = name.replace(/"/g, '');
  return `(site:resy.com OR site:opentable.com OR site:exploretock.com OR site:sevenrooms.com) "${n}" ${city}`;
}
function buildFallbackQuery(name, city, platform) {
  const n = name.replace(/"/g, '');
  const host = { Resy: 'resy.com', OpenTable: 'opentable.com', Tock: 'exploretock.com', SevenRooms: 'sevenrooms.com' }[platform] || 'resy.com';
  return `site:${host} "${n}" ${city}`;
}

function normalize(s) {
  let t = (s || '')
    .normalize('NFD')           // decompose: ô → o + combining-circumflex
    .replace(/[̀-ͯ]/g, '')  // strip combining marks
    .toLowerCase()
    .replace(/['‘’′`]/g, '')   // straight + curly apostrophes + prime
    .replace(/&|\+/g, 'and');  // & and + both mean "and" in restaurant names
  // Strip leading "the " — "The Fishery" and "Fishery" should match interchangeably.
  t = t.replace(/^the\s+/, '');
  return t.replace(/[^a-z0-9]+/g, '');
}

// Strip trailing -<city-slug> or -<number> suffixes from URL slugs so "juniper-and-ivy-san-diego"
// compares to "juniper-and-ivy". Returns the cleaned slug.
function cleanSlug(slug, city) {
  const citySlug = (city || '').toLowerCase().replace(/\s+/g, '-');
  // Try progressively more specific suffix removals.
  const suffixes = [
    '-' + citySlug,
    '-' + citySlug.replace(/-/g, ''),
    '-new-york', '-los-angeles', '-san-diego', '-san-francisco', '-san-antonio',
    '-dallas', '-houston', '-austin', '-chicago', '-phoenix', '-charlotte',
    '-seattle', '-miami', '-las-vegas', '-salt-lake-city', '-brooklyn', '-ny',
  ];
  let cleaned = slug.toLowerCase();
  for (const suf of suffixes) if (cleaned.endsWith(suf)) cleaned = cleaned.slice(0, -suf.length);
  cleaned = cleaned.replace(/-\d+$/, ''); // strip trailing -<digits> (opentable disambiguator)
  return cleaned;
}

async function resolveOne(card, city) {
  const hits = [];
  try {
    const primary = await firecrawlSearch(buildQuery(card.name, city), 5);
    for (const h of primary) {
      const plat = classifyUrl(h.url);
      if (plat) hits.push({ url: h.url, platform: plat, title: h.title, rank: hits.length });
    }
  } catch (e) { return { id: card.id, name: card.name, err: 'primary: ' + e.message }; }

  // If no hits on primary, try a series of targeted fallbacks. Many venue pages use
  // "Book Your <name>" as their Resy title; "r/<slug>" for OpenTable, etc. A second
  // search using that title phrasing often surfaces the canonical URL.
  if (!hits.length) {
    const fallbacks = [
      `(site:resy.com OR site:opentable.com OR site:exploretock.com OR site:sevenrooms.com) "Book Your ${card.name}"`,
      `(site:resy.com OR site:opentable.com OR site:exploretock.com OR site:sevenrooms.com) ${card.name.split(/\s+/)[0]} ${city} reservation`,
    ];
    for (const q of fallbacks) {
      try {
        const fb = await firecrawlSearch(q, 5);
        for (const h of fb) {
          const plat = classifyUrl(h.url);
          if (plat) hits.push({ url: h.url, platform: plat, title: h.title, rank: hits.length });
        }
      } catch (e) { /* ignore */ }
      if (hits.length) break;
    }
  }

  if (!hits.length) return { id: card.id, name: card.name, storedPlatform: card.platform, err: 'no-venue-hit' };

  const cityGeoMarkers = CITY_GEO_MARKERS[city] || { include: [], exclude: [] };

  const nn = normalize(card.name);
  let best = null;
  let bestScore = -1;
  for (const h of hits) {
    const rawSlug = h.url.replace(/\/?$/, '').split('/').pop();
    const slug = cleanSlug(rawSlug, city);
    const sn = normalize(slug);

    // Hard-reject URLs with clear wrong-city markers.
    if (cityGeoMarkers.exclude.some(x => h.url.toLowerCase().includes(x))) continue;

    let score = 0;
    if (sn === nn) score = 100;
    else if (sn.startsWith(nn)) score = 80;
    else if (sn.includes(nn)) score = 60;
    else if (nn.includes(sn) && sn.length >= 4) score = 40;
    else score = 20 - h.rank;

    // Prefer stored platform on ties.
    if (card.platform === h.platform) score += 5;
    // Geographic match boost.
    if (cityGeoMarkers.include.some(x => h.url.toLowerCase().includes(x))) score += 10;

    if (score > bestScore) { bestScore = score; best = h; }
  }
  if (!best) return { id: card.id, name: card.name, storedPlatform: card.platform, err: 'no-geo-match', allHits: hits.slice(0, 5) };

  return {
    id: card.id,
    name: card.name,
    storedPlatform: card.platform,
    resolvedPlatform: best.platform,
    reserveUrl: best.url,
    confidence: bestScore,
    mismatch: card.platform !== best.platform,
    allHits: hits.slice(0, 5),
  };
}

async function main() {
  const input = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  let cards = input;
  if (LIMIT > 0) cards = cards.slice(0, LIMIT);

  // Resume support: load existing output, skip ids that SUCCEEDED.
  // Entries with `.err` are retried on resume.
  let existing = [];
  if (RESUME && fs.existsSync(outPath)) {
    const prior = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const doneOk = new Set(prior.filter(r => !r.err && r.reserveUrl).map(r => r.id));
    existing = prior.filter(r => !r.err && r.reserveUrl);
    cards = cards.filter(c => !doneOk.has(c.id));
    console.log('Resume: ' + existing.length + ' successful already, ' + cards.length + ' to (re)process');
  }

  console.log('Resolving ' + cards.length + ' cards (concurrency: ' + CONCURRENCY + ')');
  const results = [...existing];
  let done = 0, errs = 0;

  // Simple parallel worker pool.
  const queue = [...cards];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const card = queue.shift();
      const r = await resolveOne(card, CITY).catch(e => ({ id: card.id, name: card.name, err: e.message }));
      results.push(r);
      done++;
      if (r.err) errs++;
      if (done % 10 === 0 || done === cards.length) {
        console.log(' ' + done + '/' + cards.length + ' (errs: ' + errs + ')');
        // Checkpoint.
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
      }
    }
  });
  await Promise.all(workers);

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  const hits = results.filter(r => r.reserveUrl);
  const mismatches = results.filter(r => r.mismatch);
  const fails = results.filter(r => r.err);
  console.log('\nDone. Total: ' + results.length + ' | Resolved: ' + hits.length + ' | Platform mismatches: ' + mismatches.length + ' | Failed: ' + fails.length);
  console.log('Wrote ' + outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
