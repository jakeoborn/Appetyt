/**
 * fetch-city-data.js — Dim Hour Restaurant Data Pipeline
 * ======================================================
 *
 * Fetches real restaurant data for 2026 FIFA World Cup host cities
 * using the Google Places API (New), then maps it to the Dim Hour schema.
 *
 * ── Prerequisites ──────────────────────────────────────────────────
 *
 * 1. Google Places API key
 *    - Go to https://console.cloud.google.com/
 *    - Create or select a project
 *    - Enable "Places API (New)" (the new version supports Text Search)
 *    - Create an API key under APIs & Services > Credentials
 *    - Restrict the key to "Places API (New)" for safety
 *
 * 2. Environment variables
 *    export GOOGLE_PLACES_API_KEY="your-key-here"
 *    # Optional — adds Yelp cross-referencing:
 *    export YELP_API_KEY="your-yelp-key"
 *
 * ── Usage ──────────────────────────────────────────────────────────
 *
 *   node scripts/fetch-city-data.js                  # fetch all 15 cities
 *   node scripts/fetch-city-data.js --city boston     # fetch one city
 *   node scripts/fetch-city-data.js --merge           # merge only (no fetch)
 *
 * ── Estimated API costs (as of 2025) ──────────────────────────────
 *
 *   Google Places Text Search (New):  $32 per 1,000 requests
 *   Google Places Details (New):      $17 per 1,000 requests (Basic)
 *   Per city: ~6 text searches + ~100 detail calls ≈ $1.90
 *   All 15 cities: ~$28-30
 *
 *   Yelp Fusion API: Free tier = 5,000 calls/day (no cost)
 *
 * ── Output ─────────────────────────────────────────────────────────
 *
 *   data/cities/[city-slug].json   — one file per city
 *   data/all-cities.json           — merged file for the app
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY || null;

const DATA_DIR = path.join(__dirname, '..', 'data', 'cities');
const MERGED_FILE = path.join(__dirname, '..', 'data', 'all-cities.json');

// Rate limiting
const GOOGLE_DELAY_MS = 200;   // 200ms between Google API calls (5 req/s)
const YELP_DELAY_MS = 100;

// ─── City Tiers ─────────────────────────────────────────────────────────────
// Tier 1 (major food cities): 500 restaurants — deep coverage across all neighborhoods
// Tier 2 (strong food scenes):  300 restaurants — solid coverage of key spots
// Tier 3 (emerging/smaller):    150 restaurants — curated best-of

// ─── World Cup 2026 Host Cities (excluding Dallas — already built out) ──────

const CITIES = [
  // Tier 1 — 500 restaurants
  { name: 'New York',              slug: 'new-york',        country: 'US', searchName: 'New York City',            lat: 40.7128, lng: -74.0060,   tier: 1, target: 500 },
  { name: 'Los Angeles',           slug: 'los-angeles',     country: 'US', searchName: 'Los Angeles',              lat: 34.0522, lng: -118.2437,  tier: 1, target: 500 },
  { name: 'Chicago',               slug: 'chicago',         country: 'US', searchName: 'Chicago',                  lat: 41.8781, lng: -87.6298,   tier: 1, target: 500 },
  { name: 'Mexico City',           slug: 'mexico-city',     country: 'MX', searchName: 'Mexico City',              lat: 19.4326, lng: -99.1332,   tier: 1, target: 500 },
  { name: 'Miami',                 slug: 'miami',           country: 'US', searchName: 'Miami',                    lat: 25.7617, lng: -80.1918,   tier: 1, target: 500 },
  { name: 'San Francisco Bay Area',slug: 'san-francisco',   country: 'US', searchName: 'San Francisco',            lat: 37.7749, lng: -122.4194,  tier: 1, target: 500 },
  { name: 'Toronto',               slug: 'toronto',         country: 'CA', searchName: 'Toronto',                  lat: 43.6532, lng: -79.3832,   tier: 1, target: 500 },

  // Tier 2 — 300 restaurants
  { name: 'Houston',               slug: 'houston',         country: 'US', searchName: 'Houston',                  lat: 29.7604, lng: -95.3698,   tier: 2, target: 300 },
  { name: 'Atlanta',               slug: 'atlanta',         country: 'US', searchName: 'Atlanta',                  lat: 33.7490, lng: -84.3880,   tier: 2, target: 300 },
  { name: 'Seattle',               slug: 'seattle',         country: 'US', searchName: 'Seattle',                  lat: 47.6062, lng: -122.3321,  tier: 2, target: 300 },
  { name: 'Philadelphia',          slug: 'philadelphia',    country: 'US', searchName: 'Philadelphia',             lat: 39.9526, lng: -75.1652,   tier: 2, target: 300 },
  { name: 'Boston',                slug: 'boston',           country: 'US', searchName: 'Boston',                   lat: 42.3601, lng: -71.0589,   tier: 2, target: 300 },
  { name: 'Vancouver',             slug: 'vancouver',       country: 'CA', searchName: 'Vancouver',                lat: 49.2827, lng: -123.1207,  tier: 2, target: 300 },

  // Tier 3 — 150 restaurants
  { name: 'Kansas City',           slug: 'kansas-city',     country: 'US', searchName: 'Kansas City',              lat: 39.0997, lng: -94.5786,   tier: 3, target: 150 },
  { name: 'Guadalajara',           slug: 'guadalajara',     country: 'MX', searchName: 'Guadalajara',              lat: 20.6597, lng: -103.3496,  tier: 3, target: 150 },
  { name: 'Monterrey',             slug: 'monterrey',       country: 'MX', searchName: 'Monterrey',                lat: 25.6866, lng: -100.3161,  tier: 3, target: 150 },
];

// Search queries per city — designed to surface restaurants featured in premium
// publications (Michelin, James Beard, Eater, Infatuation, Bon Appétit, NYT, etc.)
const SEARCH_TEMPLATES_BASE = [
  'best restaurants in {city}',
  'fine dining {city}',
  'michelin star restaurants {city}',
  'james beard award restaurants {city}',
  'best new restaurants {city} 2025 2026',
  'top rated restaurants {city}',
  'eater essential restaurants {city}',
  'infatuation best restaurants {city}',
  'best happy hour {city}',
  'best brunch {city}',
];

// Extra queries for tier 1 cities to reach 500
const SEARCH_TEMPLATES_TIER1 = [
  'best Italian restaurant {city}',
  'best Japanese restaurant {city}',
  'best Mexican restaurant {city}',
  'best seafood restaurant {city}',
  'best steakhouse {city}',
  'best sushi {city}',
  'best Thai restaurant {city}',
  'best Indian restaurant {city}',
  'best French restaurant {city}',
  'best Chinese restaurant {city}',
  'best Korean restaurant {city}',
  'best Mediterranean restaurant {city}',
  'best pizza {city}',
  'best BBQ {city}',
  'best taco {city}',
  'best cocktail bar food {city}',
  'best cheap eats {city}',
  'best rooftop restaurant {city}',
  'best date night restaurant {city}',
  'best neighborhood restaurant {city}',
  'hidden gem restaurant {city}',
  'best farm to table {city}',
  'best vegan restaurant {city}',
  'best late night food {city}',
  'bon appetit best restaurants {city}',
  'food and wine best restaurants {city}',
];

// ─── Utility helpers ────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Map Google Place types to a readable cuisine string.
 * Falls back to the first relevant type or "Restaurant".
 */
function mapCuisine(types, name) {
  const cuisineMap = {
    'american_restaurant': 'American',
    'italian_restaurant': 'Italian',
    'japanese_restaurant': 'Japanese',
    'mexican_restaurant': 'Mexican',
    'chinese_restaurant': 'Chinese',
    'french_restaurant': 'French',
    'thai_restaurant': 'Thai',
    'indian_restaurant': 'Indian',
    'korean_restaurant': 'Korean',
    'vietnamese_restaurant': 'Vietnamese',
    'mediterranean_restaurant': 'Mediterranean',
    'greek_restaurant': 'Greek',
    'spanish_restaurant': 'Spanish',
    'seafood_restaurant': 'Seafood',
    'steak_house': 'Steakhouse',
    'sushi_restaurant': 'Sushi',
    'barbecue_restaurant': 'BBQ',
    'pizza_restaurant': 'Pizza',
    'hamburger_restaurant': 'Burgers',
    'brunch_restaurant': 'Brunch',
    'breakfast_restaurant': 'Breakfast',
    'vegan_restaurant': 'Vegan',
    'vegetarian_restaurant': 'Vegetarian',
    'ramen_restaurant': 'Ramen',
    'turkish_restaurant': 'Turkish',
    'lebanese_restaurant': 'Lebanese',
    'brazilian_restaurant': 'Brazilian',
    'peruvian_restaurant': 'Peruvian',
    'ethiopian_restaurant': 'Ethiopian',
    'caribbean_restaurant': 'Caribbean',
  };

  if (!types) return 'Restaurant';
  for (const t of types) {
    if (cuisineMap[t]) return cuisineMap[t];
  }
  return 'Restaurant';
}

/**
 * Convert Google 1-5 rating to Dim Hour 80-99 score.
 * 4.0 -> ~86, 4.5 -> ~92, 5.0 -> 99
 */
function ratingToScore(rating) {
  if (!rating) return 82;
  // Map 3.5-5.0 to 80-99
  const clamped = Math.max(3.5, Math.min(5.0, rating));
  return Math.round(80 + ((clamped - 3.5) / 1.5) * 19);
}

/**
 * Map Google price_level (0-4) to Dim Hour price (1-4).
 */
function mapPrice(priceLevel) {
  if (priceLevel === undefined || priceLevel === null) return 2;
  return Math.max(1, Math.min(4, priceLevel || 1));
}

/**
 * Generate basic tags from Google data.
 * The enrich-data.js script will refine these later.
 */
function generateTags(place) {
  const tags = [];
  const types = place.types || [];
  const price = mapPrice(place.priceLevel);
  const rating = place.rating || 0;

  if (price >= 3) tags.push('Fine Dining');
  if (rating >= 4.6) tags.push('Critics Pick');
  if (rating >= 4.5 && place.userRatingCount > 500) tags.push('Local Favorites');
  if (price >= 4) tags.push('Exclusive');
  if (types.includes('bar')) tags.push('Bar');

  // Cuisine-based tags
  const cuisine = mapCuisine(types, place.displayName?.text);
  if (cuisine !== 'Restaurant') tags.push(cuisine);

  return [...new Set(tags)];
}

/**
 * Determine neighborhood from the formatted address.
 * Uses the part between the street number and the city name.
 */
function extractNeighborhood(address, cityName) {
  if (!address) return '';
  // For addresses like "123 Main St, Neighborhood, City, State ZIP"
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 3) {
    // Second-to-last part before city is often the neighborhood
    // but many addresses just have street, city, state — so guess
    const candidate = parts.length >= 4 ? parts[1] : '';
    if (candidate && !candidate.match(/\d{5}/) && candidate.toLowerCase() !== cityName.toLowerCase()) {
      return candidate;
    }
  }
  return '';
}

/**
 * Format opening hours from Google Places data.
 */
function formatHours(openingHours) {
  if (!openingHours || !openingHours.weekdayDescriptions) return '';
  // Return a compact version
  const days = openingHours.weekdayDescriptions;
  if (days.length === 0) return '';
  // Summarize: just return Mon-Sun hours
  return days.join('; ');
}

// ─── Google Places API (New) ────────────────────────────────────────────────

/**
 * Text Search using Google Places API (New).
 * Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */
async function googleTextSearch(query, locationBias) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const body = {
    textQuery: query,
    maxResultCount: 20,
    languageCode: 'en',
  };

  if (locationBias) {
    body.locationBias = {
      circle: {
        center: { latitude: locationBias.lat, longitude: locationBias.lng },
        radius: 30000.0  // 30 km radius
      }
    };
  }

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.userRatingCount',
    'places.priceLevel',
    'places.types',
    'places.websiteUri',
    'places.regularOpeningHours',
    'places.googleMapsUri',
    'places.businessStatus',
  ].join(',');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Text Search failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.places || [];
}

/**
 * Get additional details for a place (used if Text Search doesn't return enough).
 */
async function googlePlaceDetails(placeId) {
  const fieldMask = [
    'id',
    'displayName',
    'formattedAddress',
    'location',
    'rating',
    'userRatingCount',
    'priceLevel',
    'types',
    'websiteUri',
    'regularOpeningHours',
    'googleMapsUri',
    'editorialSummary',
    'reviews',
  ].join(',');

  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': fieldMask,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Place Details failed (${res.status}): ${err}`);
  }

  return res.json();
}

// ─── Yelp API (optional cross-reference) ────────────────────────────────────

/**
 * Search Yelp for a restaurant by name + city to get additional data.
 * Returns null if YELP_API_KEY is not set.
 */
async function yelpSearch(name, city) {
  if (!YELP_API_KEY) return null;

  const params = new URLSearchParams({
    term: name,
    location: city,
    categories: 'restaurants',
    limit: '1',
  });

  const url = `https://api.yelp.com/v3/businesses/search?${params}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${YELP_API_KEY}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.businesses?.[0] || null;
  } catch {
    return null;
  }
}

// ─── Main pipeline ──────────────────────────────────────────────────────────

/**
 * Map a Google Place object to the Dim Hour restaurant schema.
 */
function mapToDim HourSchema(place, id, cityConfig) {
  const name = place.displayName?.text || 'Unknown';
  const address = place.formattedAddress || '';
  const cuisine = mapCuisine(place.types, name);
  const neighborhood = extractNeighborhood(address, cityConfig.searchName);

  return {
    id,
    name,
    cuisine,
    neighborhood,
    score: ratingToScore(place.rating),
    price: mapPrice(place.priceLevel),
    tags: generateTags(place),
    indicators: [],
    hh: '',
    reservation: '',         // enrich-data.js will fill this
    awards: '',              // enrich-data.js will fill this
    description: place.editorialSummary?.text || '',  // enrich-data.js will improve this
    dishes: [],              // enrich-data.js will fill this
    address,
    hours: formatHours(place.regularOpeningHours),
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0,
    bestOf: [],
    busyness: null,
    waitTime: null,
    popularTimes: null,
    lastUpdated: new Date().toISOString(),
    trending: false,
    group: '',
    instagram: '',           // enrich-data.js will fill this
    suburb: false,
    // Extra metadata (used by enrich-data.js, stripped on merge)
    _googlePlaceId: place.id,
    _googleMapsUri: place.googleMapsUri || '',
    _googleRating: place.rating || null,
    _googleRatingCount: place.userRatingCount || 0,
    _website: place.websiteUri || '',
    _city: cityConfig.name,
    _citySlug: cityConfig.slug,
  };
}

/**
 * Fetch all restaurants for a single city.
 */
async function fetchCity(cityConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Fetching: ${cityConfig.name} (${cityConfig.country}) — Tier ${cityConfig.tier} (target: ${cityConfig.target})`);
  console.log(`${'='.repeat(60)}`);

  const target = cityConfig.target;
  const seenPlaceIds = new Set();
  const restaurants = [];
  let nextId = 1;

  // Build search list: base queries + tier 1 extras for big cities
  const searches = [...SEARCH_TEMPLATES_BASE];
  if (cityConfig.tier === 1) {
    searches.push(...SEARCH_TEMPLATES_TIER1);
  }

  for (const template of searches) {
    if (restaurants.length >= target) {
      console.log(`  Reached target (${restaurants.length}/${target} restaurants)`);
      break;
    }

    const query = template.replace('{city}', cityConfig.searchName);
    console.log(`  Search: "${query}"`);

    try {
      const places = await googleTextSearch(query, { lat: cityConfig.lat, lng: cityConfig.lng });
      console.log(`    Found ${places.length} results`);

      for (const place of places) {
        if (seenPlaceIds.has(place.id)) continue;
        seenPlaceIds.add(place.id);

        // ONLY operational restaurants
        if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') continue;
        if (!place.rating || place.rating < 3.8) continue;

        const types = place.types || [];
        const isRestaurant = types.some(t =>
          t.includes('restaurant') || t.includes('food') ||
          t === 'meal_delivery' || t === 'meal_takeaway' ||
          t === 'cafe' || t === 'bakery' || t === 'bar'
        );
        if (!isRestaurant) continue;

        const restaurant = mapToDim HourSchema(place, nextId++, cityConfig);
        restaurants.push(restaurant);

        // Cross-reference with Yelp if available
        if (YELP_API_KEY) {
          await sleep(YELP_DELAY_MS);
          const yelpData = await yelpSearch(restaurant.name, cityConfig.searchName);
          if (yelpData) {
            if (!restaurant.neighborhood && yelpData.location?.neighborhood) {
              restaurant.neighborhood = yelpData.location.neighborhood;
            }
            restaurant._yelpRating = yelpData.rating;
            restaurant._yelpReviewCount = yelpData.review_count;
            restaurant._yelpPrice = yelpData.price;
            restaurant._yelpCategories = (yelpData.categories || []).map(c => c.title);
          }
        }
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
    }

    await sleep(GOOGLE_DELAY_MS);
  }

  // Sort by score descending
  restaurants.sort((a, b) => b.score - a.score);

  // Re-assign IDs after sorting
  restaurants.forEach((r, i) => { r.id = i + 1; });

  console.log(`  Total: ${restaurants.length} restaurants for ${cityConfig.name}`);
  return restaurants;
}

/**
 * Save city data to JSON file.
 */
function saveCity(cityConfig, restaurants) {
  const filePath = path.join(DATA_DIR, `${cityConfig.slug}.json`);
  const payload = {
    city: cityConfig.name,
    slug: cityConfig.slug,
    country: cityConfig.country,
    center: { lat: cityConfig.lat, lng: cityConfig.lng },
    fetchedAt: new Date().toISOString(),
    count: restaurants.length,
    restaurants,
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  console.log(`  Saved: ${filePath}`);
}

/**
 * Merge all city JSON files into a single file for the app.
 * Strips internal metadata fields (those starting with _).
 */
function mergeAllCities() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  Merging all city data');
  console.log(`${'='.repeat(60)}`);

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const cityData = {};
  let totalCount = 0;

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const cityName = raw.city;

    // Strip internal metadata fields from each restaurant
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

  // Also generate a JS module that can be included in the app
  const jsPath = path.join(__dirname, '..', 'data', 'city-data.js');
  const jsContent = `// Auto-generated by fetch-city-data.js — ${new Date().toISOString()}
// Do not edit manually. Re-run the pipeline to update.
const CITY_DATA = ${JSON.stringify(cityData, null, 2)};

if (typeof module !== 'undefined') module.exports = CITY_DATA;
`;
  fs.writeFileSync(jsPath, jsContent);
  console.log(`  JS module: ${jsPath}`);
}

// ─── CLI entry point ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // --merge only
  if (args.includes('--merge')) {
    mergeAllCities();
    return;
  }

  // Validate API key
  if (!GOOGLE_API_KEY) {
    console.error('ERROR: GOOGLE_PLACES_API_KEY environment variable is not set.');
    console.error('');
    console.error('To get an API key:');
    console.error('  1. Go to https://console.cloud.google.com/');
    console.error('  2. Enable the "Places API (New)"');
    console.error('  3. Create an API key under APIs & Services > Credentials');
    console.error('  4. Run: export GOOGLE_PLACES_API_KEY="your-key"');
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(DATA_DIR, { recursive: true });

  // Determine which cities to fetch
  let citiesToFetch = CITIES;
  const cityArg = args.find((_, i) => args[i - 1] === '--city');
  if (cityArg) {
    const match = CITIES.filter(c =>
      c.slug === cityArg.toLowerCase() ||
      c.name.toLowerCase() === cityArg.toLowerCase() ||
      c.searchName.toLowerCase() === cityArg.toLowerCase()
    );
    if (match.length === 0) {
      console.error(`City not found: "${cityArg}"`);
      console.error('Available cities:', CITIES.map(c => c.slug).join(', '));
      process.exit(1);
    }
    citiesToFetch = match;
  }

  const totalTarget = citiesToFetch.reduce((sum, c) => sum + c.target, 0);
  console.log(`Dim Hour Data Pipeline — Fetching ${citiesToFetch.length} cities (${totalTarget} total restaurants)`);
  console.log(`Tier 1 (500): ${citiesToFetch.filter(c=>c.tier===1).map(c=>c.name).join(', ') || 'none'}`);
  console.log(`Tier 2 (300): ${citiesToFetch.filter(c=>c.tier===2).map(c=>c.name).join(', ') || 'none'}`);
  console.log(`Tier 3 (150): ${citiesToFetch.filter(c=>c.tier===3).map(c=>c.name).join(', ') || 'none'}\n`);

  // Fetch each city sequentially (to respect rate limits)
  for (const city of citiesToFetch) {
    try {
      const restaurants = await fetchCity(city);
      saveCity(city, restaurants);
    } catch (err) {
      console.error(`FATAL ERROR for ${city.name}: ${err.message}`);
      console.error(err.stack);
    }
  }

  // Merge all into one file
  mergeAllCities();

  console.log('\nDone! Next steps:');
  console.log('  1. Run: node scripts/enrich-data.js   (to add descriptions, dishes, awards)');
  console.log('  2. Review data in data/cities/*.json');
  console.log('  3. Merge into app: update index.html to load data/city-data.js');
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
