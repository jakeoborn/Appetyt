# Data Integrity Rules

## Restaurant Data Schema

All restaurant entries in `index.html` follow this structure. Do not add fields that don't exist or omit required fields:

```javascript
{
  id: number,           // Sequential, unique — find max existing ID first
  name: string,         // Real, verified business name
  phone: string,        // Real phone number or empty string
  cuisine: string,      // Cuisine type
  neighborhood: string, // Must match existing neighborhoods in the city
  score: number,        // 0-100 quality score
  price: number,        // 1-4 price tier
  tags: string[],       // From existing tag vocabulary in the app
  indicators: string[], // e.g. ["coming-soon"] — use sparingly
  hh: string,           // Happy hour info or empty
  reservation: string,  // "walk-in", "Resy", "OpenTable", "Tock", or empty
  awards: string,       // Only verified awards
  description: string,  // Factual description of the restaurant
  dishes: string[],     // Real menu items only
  address: string,      // Full verified address
  hours: string,        // Real hours or empty
  lat: number,          // Real latitude — never guess
  lng: number,          // Real longitude — never guess
  group: string,        // Restaurant group if applicable
  instagram: string,    // Real handle or empty
  website: string,      // Real URL or empty
  res_tier: number,     // 0-5 reservation difficulty
  photoUrl: string      // URL to venue photo (Google Places, Supabase, or empty)
}
```

## Data Modification Scripts

- Scripts in `scripts/` read and write `index.html` directly via regex/eval
- Always back up or validate before overwriting data
- Use `makeEntry()` pattern with spread operator — provide only known fields
- Never bulk-generate restaurant entries with made-up details
- When the user provides a list of restaurants, confirm which fields are verified vs. need lookup

## Audit & Quality

- Scripts like `audit-*.js` and `fix-*.js` exist for data quality — use similar patterns
- JSON files in `scripts/` (e.g., `dallas-audit-issues.json`) track known data problems
- Cross-reference new data against existing entries to avoid duplicates
