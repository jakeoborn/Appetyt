// Kick off a single Apify compass/crawler-google-places run for one city.
// Reads queries from scripts/apify-{city}-queries.json.
// Requires APIFY_TOKEN env var.
// Output: prints runId. Async — returns immediately.
//
// Usage: APIFY_TOKEN=xxx node scripts/apify-run-city.js <cityShort>
//   APIFY_TOKEN=xxx node scripts/apify-run-city.js houston

const fs = require('fs');
const city = process.argv[2];
const token = process.env.APIFY_TOKEN;
if (!city || !token) { console.error('Usage: APIFY_TOKEN=xxx node apify-run-city.js <city>'); process.exit(1); }

const queries = JSON.parse(fs.readFileSync(`scripts/apify-${city}-queries.json`, 'utf8')).queries;
const CITY_LOCATION = {
  houston: 'Houston, Texas, USA',
  austin: 'Austin, Texas, USA',
  chicago: 'Chicago, Illinois, USA',
  slc: 'Salt Lake City, Utah, USA',
  lv: 'Las Vegas, Nevada, USA',
  seattle: 'Seattle, Washington, USA',
  nyc: 'New York City, USA',
  dallas: 'Dallas, Texas, USA',
  phx: 'Phoenix, Arizona, USA',
  la: 'Los Angeles, California, USA',
};

const input = {
  searchStringsArray: queries,
  locationQuery: CITY_LOCATION[city],
  maxCrawledPlacesPerSearch: 1,
  searchMatching: 'all',
  scrapePlaceDetailPage: true,
  maxImages: 10,
  scrapeContacts: true,
  countryCode: 'us',
  language: 'en',
};

async function main() {
  console.log(`Starting ${city}: ${queries.length} queries...`);
  const res = await fetch(`https://api.apify.com/v2/acts/compass~crawler-google-places/runs?token=${token}&memory=4096&timeout=3600`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (data.data?.id) {
    console.log(`${city} runId: ${data.data.id}`);
    console.log(`${city} datasetId: ${data.data.defaultDatasetId}`);
    // Save run info
    const runs = fs.existsSync('scripts/apify-runs.json') ? JSON.parse(fs.readFileSync('scripts/apify-runs.json', 'utf8')) : {};
    runs[city] = { runId: data.data.id, datasetId: data.data.defaultDatasetId, startedAt: data.data.startedAt, status: data.data.status };
    fs.writeFileSync('scripts/apify-runs.json', JSON.stringify(runs, null, 2));
  } else {
    console.error(`${city} FAIL:`, JSON.stringify(data).substring(0, 300));
    process.exit(1);
  }
}
main().catch(e => { console.error(e.message); process.exit(1); });
