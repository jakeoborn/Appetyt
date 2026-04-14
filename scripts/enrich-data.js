/**
 * enrich-data.js — Dim Hour Restaurant Data Enrichment
 * ====================================================
 *
 * Reads raw Google Places data from data/cities/ and uses the
 * Anthropic Claude API to enrich each restaurant with:
 *   - Curated description (specific, not generic)
 *   - Signature dishes (researched, not invented)
 *   - Award information (Michelin, James Beard, Eater, etc.)
 *   - Instagram handle
 *   - Reservation platform (Resy / Tock / OpenTable / walk-in)
 *   - Neighborhood (refined)
 *   - Tags (refined)
 *   - Indicators (dietary, ownership — vegetarian, women-owned, etc.)
 *
 * ── Prerequisites ──────────────────────────────────────────────────
 *
 *   export ANTHROPIC_API_KEY="sk-ant-..."
 *
 *   Get one at https://console.anthropic.com/
 *   Estimated cost: ~$0.10-0.20 per city (batched requests)
 *
 * ── Usage ──────────────────────────────────────────────────────────
 *
 *   node scripts/enrich-data.js                     # enrich all cities
 *   node scripts/enrich-data.js --city boston        # enrich one city
 *   node scripts/enrich-data.js --dry-run           # preview without saving
 *   node scripts/enrich-data.js --merge             # merge only after enrichment
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DATA_DIR = path.join(__dirname, '..', 'data', 'cities');
const MERGED_FILE = path.join(__dirname, '..', 'data', 'all-cities.json');

// Claude API settings
const CLAUDE_MODEL = 'claude-sonnet-4-6';
const BATCH_SIZE = 10;           // restaurants per Claude request
const CLAUDE_DELAY_MS = 1000;    // 1s between Claude calls
const MAX_RETRIES = 3;

// ─── System prompt for Claude ───────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a restaurant research assistant for Dim Hour, a premium dining guide app. Your job is to enrich restaurant data with REAL, VERIFIABLE information sourced from premium food publications and platforms.

YOUR SOURCES (prioritize in this order):
1. Michelin Guide — stars, Bib Gourmand, recommended
2. James Beard Foundation — awards, nominees, semifinalists
3. Eater — Essential restaurants lists, Eater 38, Heatmaps
4. The Infatuation — reviews and ratings
5. Bon Appétit — Hot 10, Best New Restaurants
6. New York Times / Food & Wine — critic reviews, best-of lists
7. Local publications — Dallas Morning News, LA Times Food, Chicago Tribune, etc.
8. Resy / OpenTable / Tock — reservation platform data
9. World's 50 Best / Latin America's 50 Best — rankings

CRITICAL RULES:
1. ONLY include facts you are confident are accurate from the sources above. If unsure, leave the field EMPTY — an empty field is always better than a guess.
2. NEVER invent dish names, chef names, awards, or Instagram handles.
3. NEVER use generic filler language. Banned phrases: "culinary gem", "must-visit", "hidden gem", "gastronomic", "a true", "one of the best", "exceptional", "extraordinary", "unparalleled". Write like an Eater or Infatuation reviewer — direct, opinionated, specific.
4. For descriptions: 2-3 sentences max. Lead with the chef's name if known. Reference specific cooking style, what makes this place different, and one concrete detail (a specific dish, the room, the vibe). Write as if recommending to a friend.
5. For dishes: ONLY list dishes you are confident the restaurant actually serves. If you don't know, return an empty array []. Never guess.
6. For awards: Include source and year. Format: "Michelin 1-star (2024); James Beard Semifinalist (2023)". Empty string if none known.
7. For Instagram: Only provide if confident. Format: "@handle". Empty string if unknown.
8. For reservation: "Resy", "Tock", "OpenTable", or "walk-in" ONLY if you know. Empty string if unknown.
9. For indicators: Only verifiable: "vegetarian", "women-owned", "black-owned", "lgbtq-owned", "sustainable", "outdoor-seating", "byob", "cash-only".
10. For neighborhood: Use the name locals actually use (e.g. "Bishop Arts" not "Oak Cliff", "West Village" not "Manhattan").

You will receive a batch of restaurants with their Google Places data. Return a JSON array with enrichment data for each.`;

// ─── Utility helpers ────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call the Anthropic Messages API.
 */
async function callClaude(messages, retryCount = 0) {
  const url = 'https://api.anthropic.com/v1/messages';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (res.status === 429 || res.status >= 500) {
      if (retryCount < MAX_RETRIES) {
        const wait = Math.pow(2, retryCount) * 2000;
        console.log(`    Rate limited / server error (${res.status}). Retrying in ${wait / 1000}s...`);
        await sleep(wait);
        return callClaude(messages, retryCount + 1);
      }
      throw new Error(`Claude API error after ${MAX_RETRIES} retries: ${res.status}`);
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    return text;
  } catch (err) {
    if (retryCount < MAX_RETRIES && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
      const wait = Math.pow(2, retryCount) * 2000;
      console.log(`    Network error. Retrying in ${wait / 1000}s...`);
      await sleep(wait);
      return callClaude(messages, retryCount + 1);
    }
    throw err;
  }
}

/**
 * Parse JSON from Claude's response, handling markdown code fences.
 */
function parseClaudeJSON(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
}

// ─── Enrichment logic ───────────────────────────────────────────────────────

/**
 * Build the prompt for a batch of restaurants.
 */
function buildEnrichmentPrompt(restaurants, cityName) {
  const batch = restaurants.map(r => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    address: r.address,
    googleRating: r._googleRating,
    googleRatingCount: r._googleRatingCount,
    website: r._website,
    currentDescription: r.description,
    currentNeighborhood: r.neighborhood,
  }));

  return `Here are ${batch.length} restaurants in ${cityName}. For each one, research and provide enrichment data.

Return a JSON array where each element has this structure:
{
  "id": <number — the restaurant's ID>,
  "description": "<string — 2-3 sentence description. Be specific: mention chef name, cooking style, signature elements, atmosphere. Do NOT be generic.>",
  "dishes": ["<dish 1>", "<dish 2>", "<dish 3>"],
  "awards": "<string — e.g. 'Michelin 1-star 2024; James Beard Semifinalist 2023' or empty string>",
  "instagram": "<string — e.g. '@restaurantname' or empty string>",
  "reservation": "<string — 'Resy', 'Tock', 'OpenTable', 'walk-in', or empty string>",
  "neighborhood": "<string — commonly known neighborhood name>",
  "tags": ["<additional tags to add — e.g. 'Date Night', 'Outdoor Dining', 'Late Night', 'Brunch'>"],
  "indicators": ["<e.g. 'vegetarian', 'women-owned', 'black-owned', 'sustainable', 'outdoor-seating'>"],
  "hh": "<string — happy hour details if known, e.g. 'Mon-Fri 4-6pm' or empty string>"
}

IMPORTANT: Only include information you are CONFIDENT is real and accurate. Empty strings and empty arrays are preferred over guesses.

Restaurants to enrich:
${JSON.stringify(batch, null, 2)}`;
}

/**
 * Enrich a batch of restaurants using Claude.
 */
async function enrichBatch(restaurants, cityName) {
  const prompt = buildEnrichmentPrompt(restaurants, cityName);

  const response = await callClaude([
    { role: 'user', content: prompt },
  ]);

  try {
    const enrichments = parseClaudeJSON(response);
    if (!Array.isArray(enrichments)) {
      throw new Error('Expected array response from Claude');
    }
    return enrichments;
  } catch (err) {
    console.error(`    Failed to parse Claude response: ${err.message}`);
    console.error(`    Raw response (first 500 chars): ${response.substring(0, 500)}`);
    return [];
  }
}

/**
 * Apply enrichment data to a restaurant object.
 */
function applyEnrichment(restaurant, enrichment) {
  if (!enrichment) return restaurant;

  // Description — only overwrite if enrichment provides a better one
  if (enrichment.description && enrichment.description.length > 20) {
    restaurant.description = enrichment.description;
  }

  // Dishes — only overwrite if enrichment provides real ones
  if (Array.isArray(enrichment.dishes) && enrichment.dishes.length > 0) {
    restaurant.dishes = enrichment.dishes.slice(0, 4);
  }

  // Awards
  if (enrichment.awards) {
    restaurant.awards = enrichment.awards;
    if (!restaurant.tags.includes('Awards') && enrichment.awards.length > 0) {
      restaurant.tags.push('Awards');
    }
  }

  // Instagram
  if (enrichment.instagram) {
    restaurant.instagram = enrichment.instagram;
  }

  // Reservation
  if (enrichment.reservation) {
    restaurant.reservation = enrichment.reservation;
  }

  // Neighborhood
  if (enrichment.neighborhood) {
    restaurant.neighborhood = enrichment.neighborhood;
  }

  // Additional tags (merge, deduplicate)
  if (Array.isArray(enrichment.tags)) {
    const existingTags = new Set(restaurant.tags.map(t => t.toLowerCase()));
    for (const tag of enrichment.tags) {
      if (!existingTags.has(tag.toLowerCase())) {
        restaurant.tags.push(tag);
        existingTags.add(tag.toLowerCase());
      }
    }
  }

  // Indicators
  if (Array.isArray(enrichment.indicators)) {
    const existingIndicators = new Set(restaurant.indicators);
    for (const ind of enrichment.indicators) {
      if (!existingIndicators.has(ind)) {
        restaurant.indicators.push(ind);
        existingIndicators.add(ind);
      }
    }
  }

  // Happy hour
  if (enrichment.hh) {
    restaurant.hh = enrichment.hh;
  }

  restaurant.lastUpdated = new Date().toISOString();

  return restaurant;
}

/**
 * Generate bestOf rankings for a city's restaurants.
 */
function generateBestOfRankings(restaurants) {
  // Group by cuisine
  const byCuisine = {};
  for (const r of restaurants) {
    if (!byCuisine[r.cuisine]) byCuisine[r.cuisine] = [];
    byCuisine[r.cuisine].push(r);
  }

  // Sort each group by score
  for (const cuisine of Object.keys(byCuisine)) {
    byCuisine[cuisine].sort((a, b) => b.score - a.score);
  }

  // Assign bestOf
  for (const [cuisine, group] of Object.entries(byCuisine)) {
    if (group.length < 2) continue; // Skip cuisines with only 1 entry
    group.forEach((r, i) => {
      if (i < 3) {
        const label = `#${i + 1} Best ${cuisine}`;
        if (!r.bestOf.includes(label)) r.bestOf.push(label);
      }
    });
  }

  // Overall ranking
  const sorted = [...restaurants].sort((a, b) => b.score - a.score);
  sorted.slice(0, 5).forEach((r, i) => {
    const label = `#${i + 1} Best Overall`;
    if (!r.bestOf.includes(label)) r.bestOf.unshift(label);
  });

  // Date Night ranking (based on tags + price)
  const dateNight = restaurants
    .filter(r => r.tags.includes('Date Night') || r.tags.includes('Fine Dining') || r.price >= 3)
    .sort((a, b) => b.score - a.score);
  dateNight.slice(0, 3).forEach((r, i) => {
    const label = `#${i + 1} Best Date Night`;
    if (!r.bestOf.includes(label)) r.bestOf.push(label);
  });

  return restaurants;
}

// ─── Merge function (same as in fetch-city-data.js) ─────────────────────────

function mergeAllCities() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  Merging all enriched city data');
  console.log(`${'='.repeat(60)}`);

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const cityData = {};
  let totalCount = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cityName = raw.city;

    // Strip internal metadata fields
    const cleaned = raw.restaurants.map(r => {
      const clean = {};
      for (const [key, val] of Object.entries(r)) {
        if (!key.startsWith('_')) {
          clean[key] = val;
        }
      }
      return clean;
    });

    cityData[cityName] = cleaned;
    totalCount += cleaned.length;
    console.log(`  ${cityName}: ${cleaned.length} restaurants`);
  }

  fs.writeFileSync(MERGED_FILE, JSON.stringify(cityData, null, 2));
  console.log(`\n  Merged ${totalCount} restaurants across ${files.length} cities`);
  console.log(`  Output: ${MERGED_FILE}`);

  // Also generate a JS module
  const jsPath = path.join(__dirname, '..', 'data', 'city-data.js');
  const jsContent = `// Auto-generated by enrich-data.js — ${new Date().toISOString()}
// Do not edit manually. Re-run the pipeline to update.
const CITY_DATA = ${JSON.stringify(cityData, null, 2)};

if (typeof module !== 'undefined') module.exports = CITY_DATA;
`;
  fs.writeFileSync(jsPath, jsContent);
  console.log(`  JS module: ${jsPath}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  // --merge only
  if (args.includes('--merge')) {
    mergeAllCities();
    return;
  }

  // Validate API key
  if (!ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('');
    console.error('Get one at https://console.anthropic.com/');
    console.error('Then run: export ANTHROPIC_API_KEY="sk-ant-..."');
    process.exit(1);
  }

  // Find city files to enrich
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`ERROR: No data directory found at ${DATA_DIR}`);
    console.error('Run fetch-city-data.js first to download restaurant data.');
    process.exit(1);
  }

  let files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  // Filter to specific city if requested
  const cityArg = args.find((_, i) => args[i - 1] === '--city');
  if (cityArg) {
    const slug = cityArg.toLowerCase().replace(/\s+/g, '-');
    files = files.filter(f => f.replace('.json', '') === slug);
    if (files.length === 0) {
      console.error(`No data file found for city: "${cityArg}"`);
      console.error('Available:', fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')).join(', '));
      process.exit(1);
    }
  }

  if (files.length === 0) {
    console.error('No city data files found. Run fetch-city-data.js first.');
    process.exit(1);
  }

  console.log(`Dim Hour Data Enrichment — Processing ${files.length} cities`);
  if (dryRun) console.log('(DRY RUN — no files will be saved)\n');
  else console.log('');

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const cityData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cityName = cityData.city;
    const restaurants = cityData.restaurants;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`  Enriching: ${cityName} (${restaurants.length} restaurants)`);
    console.log(`${'='.repeat(60)}`);

    // Process in batches
    for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
      const batch = restaurants.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(restaurants.length / BATCH_SIZE);

      console.log(`  Batch ${batchNum}/${totalBatches} (restaurants ${i + 1}-${i + batch.length})`);

      try {
        const enrichments = await enrichBatch(batch, cityName);

        // Match enrichments to restaurants by ID
        for (const enrichment of enrichments) {
          const restaurant = restaurants.find(r => r.id === enrichment.id);
          if (restaurant) {
            applyEnrichment(restaurant, enrichment);
          }
        }

        const enrichedCount = enrichments.length;
        console.log(`    Enriched ${enrichedCount}/${batch.length} restaurants`);
      } catch (err) {
        console.error(`    ERROR enriching batch: ${err.message}`);
      }

      // Rate limit between batches
      if (i + BATCH_SIZE < restaurants.length) {
        await sleep(CLAUDE_DELAY_MS);
      }
    }

    // Generate bestOf rankings
    generateBestOfRankings(restaurants);

    // Save enriched data
    if (!dryRun) {
      cityData.enrichedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(cityData, null, 2));
      console.log(`  Saved: ${filePath}`);
    } else {
      console.log(`  [DRY RUN] Would save: ${filePath}`);
      // Print a sample
      const sample = restaurants[0];
      console.log(`  Sample enriched restaurant:`);
      console.log(`    Name: ${sample.name}`);
      console.log(`    Description: ${sample.description}`);
      console.log(`    Dishes: ${JSON.stringify(sample.dishes)}`);
      console.log(`    Awards: ${sample.awards}`);
      console.log(`    Instagram: ${sample.instagram}`);
      console.log(`    Reservation: ${sample.reservation}`);
    }
  }

  // Merge all cities
  if (!dryRun) {
    mergeAllCities();
  }

  console.log('\nEnrichment complete!');
  console.log('Next steps:');
  console.log('  1. Review enriched data in data/cities/*.json');
  console.log('  2. Spot-check descriptions and dishes for accuracy');
  console.log('  3. Load data/city-data.js in the app');
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
