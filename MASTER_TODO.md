# Dim Hour — Master To-Do List

_Last updated: 2026-04-27. Update this file at the end of every session._

---

## 🔴 CRITICAL (do before anything else)

### SEO — bundle as one PR (all touch the page-build script)
- [ ] **Strip `aggregateRating` from all per-page schema** — misuse of internal score = Google manual-action risk + rich-results suppression. Either remove entirely or re-frame as `Review` with `Author = Dim Hour`. Find via `grep -lr "aggregateRating" scripts/`
- [ ] **Regenerate stale pages + add Miami / Charlotte / SF** — sitemap lastmod = 2026-04-17; counts wrong sitewide ("665 Dallas" but data has 727); `/miami/`, `/charlotte/`, `/san-francisco/` all return 404
- [ ] **Replace logo `og:image` with per-page hero photo** — every page emits `/icons/icon-512.png`. Fix at build time: use #1 ranked venue's `photoUrl`; skip if empty
- [ ] **Regenerate or remove stale `noscript` block in root `index.html`** — hard-codes contradictory top-10 lists per city for bots (e.g. Mamani listed as "Modern Mexican, West Village" vs correct "French / Riviera, Uptown")

---

## 🟠 HIGH PRIORITY

### City Expansion
- [ ] **San Antonio** — Steps 2-7 needed (~400+ spots, only 82 currently). ID range 6001+
- [ ] **SF** — Steps 2-7 + 9-10 needed (target 150, currently 73). Next ID: 5074+
- [ ] **Miami Step 9** — Hotels, malls, parks, museums for Local tab (~250 cards done)
- [ ] **Charlotte Step 9** — Same as Miami (~253 cards done)

### Austin Cleanup
- [ ] **Round Rock geocode** — IDs 5633 (Q Bola Cuban, 351 W Palm Valley Blvd) and 5635 (The Rustic Table, 2400 S I-35 Frontage Rd Ste 160) have `lat:0, lng:0`. Retry Nominatim with full ZIP or alternative geocoder
- [ ] **Austin 7 remaining neighborhoods** (10 verified cards each, next ID 5636+):
  - Cedar Park · Dripping Springs · Westlake · Lake Travis · Driftwood · UT Campus · Great Hills

### Data Quality
- [ ] **Empty dishes** — Austin 106, SLC 85, LV 112 entries with no dishes. Pull from live menus
- [ ] **agent-browser Pass A** — retry ~85 "dead site" cards that WebFetch returned empty on. Agent-browser executes real JS and recovers ~25%. Target: `project_audit_trouble_cases.md` queue + any "skipped" cards from prior city sessions
- [ ] **agent-browser Pass B** — backfill empty `photoUrl` across all cities. SF has 24 known empties (IDs 5050-5073). Run Norman's quality gate; skip rather than lower the bar

---

## 🟡 MEDIUM PRIORITY

### Content
- [ ] **Curated lists for 11 cities** — Dallas shipped (8 themes). Build parallel sets for:
  1. NYC — "Unmarked Doors Lower Manhattan", "West Village Townhouse Dinners", "Koreatown After Midnight", "Michelin Under $50", "Sommelier-Led Natural Wine", "Rooftops with a View", "Old Four Seasons Exiles", "Employees Only Crew Reunion"
  2. LA — "Strip Mall Gems", "Old Hollywood Survivors", "Edendale Cocktail Spine", "Hidden at Grand Central Market", "Mariscos Trucks", "Arts District After Dark"
  3. Chicago — "West Loop Before Blackhawks", "Fulton Market Old-School", "Alinea Alumni", "Chinatown After 10pm", "Classic Chicago Since 19XX"
  4. Miami — "Wynwood Graffiti Bars", "Design District Date Night", "Little Havana After Midnight", "Omakase South of Fifth"
  5. Las Vegas — "Delilah Energy", "Omakase Row", "Off-Strip Locals Only", "Chinatown Late-Night", "Gas Station Steaks"
  6. Seattle — "Ballard Oyster Circuit", "Capitol Hill Cocktail Mile", "Post Alley Hideouts", "West Seattle Sunsets"
  7. Austin, Houston, SF, Phoenix, SLC, Charlotte — similar treatment
  - Rule: unique local angles only, NOT generic "Best Steakhouses". 6-8 lists × 5-8 IDs each. All IDs must exist in city `*_DATA`

- [ ] **More bestOf coverage** — SF and Charlotte have no `bestOf[]` yet. NYC/Houston/Miami good. Other cities have anchors but could use more depth per category

- [ ] **Robb Report Top 50 Bars queue** — 28 bars queued for future cities (Mexico City, Toronto, Vancouver, New Orleans, DC, etc.). Tag `"North America Top 50 Bar"` at card-creation time. See `project_robb50_future_cities.md`

### Scoring
- [ ] **Objective score recompute** — replace subjective scores with formula:
  ```
  base 70
  + 3 per quality tag (Michelin, James Beard, Critics Pick, Iconic, Historic, Chef-Driven, Award-Winning, Fine Dining, Local Favorites)
  + 2 × res_tier
  + 3 if bestOf[] non-empty
  + 2 if group non-empty
  + 2 if trending === true
  + 1 if reservation ∈ [Resy, OpenTable, Tock, SevenRooms]
  + (price - 2)
  clamped [60, 98]; only 3-Michelin-star or comparable = 99
  ```
  Decide: pilot on new cards first vs. one-shot recompute across all cities

### SEO Extension (after critical SEO items land)
- [ ] **Rewrite title/description templates** per voice rules in `.agents/product-marketing-context.md` — fix title casing, drop generic SEO-speak, remove false "Updated weekly" claim
- [ ] **Neighborhood pages** — `/{city}/{neighborhood}/` (~150 pages across 12 cities × ~12 neighborhoods). Data already in `CITY_NEIGHBORHOODS` dicts. Use `programmatic-seo` skill
- [ ] **Indicator pages** — `/{city}/{indicator}/` — 12 × 10 = 120 pages, all high-intent ("halal restaurants in nyc"). Indicators already on every card
- [ ] **Extend cuisine breadth** — add korean, vietnamese, ramen, indian, thai, vegan, pizza, tacos, seafood, dessert, coffee to the build script's cuisine dict

### Infrastructure
- [ ] **Gmail OAuth** — Phase 3 reservation-sync. 4 Netlify functions + Supabase `gmail_connections` table. Yahoo/iCloud not feasible. Outlook feasible via Graph API
- [ ] **MCP installs** — Next: `joelio/stocky` (photos), `temporal-cortex/mcp` (Outlook calendar), `mcp-gateway` (tool-bloat reduction)

---

## 🟢 LOWER PRIORITY (backlog)

### Media
- [ ] **HyperFrames videos** (project at `C:\Users\jakeo\Dim Hour\`):
  1. Brand identity piece — 15-20s Vignelli-tier title sequence with GSAP motion
  2. App walkthrough reel — 30-45s screen-capture Discover→Trip→Reservation flow via `website-to-hyperframes`
  3. Per-city teaser template — looped 10-15s curated-list showcase (programmatic, renders N city × M list combos)
  - Order: #1 → #2 → #3. Always run `npx hyperframes lint` after every edit

### Photo Quality
- [ ] **Photo audit** — 1,919 BAD photos, 3,387 SUSPECT. Re-run `scripts/audit-bad-photos.js`, then queue Apify for interior shots on worst offenders
- [ ] **Scheduled SF photo audit** — routine `trig_013ZWrmnZP7yagaB454Y1Gtp` fires 2026-05-08T15:00Z. Scope includes 24 empty photoUrls from Batch 1 (IDs 5050-5073)

### Tech Debt
- [ ] **Data split** — `index.html` (~6MB) → `data/{city}.json` files. Biggest performance win; biggest lift
- [ ] **Utility-class pass** — 1,204 inline styles → CSS classes
- [ ] **Event delegation** — 399 `onclick` handlers → `data-action` pattern
- [ ] **Dallas weekend guide bug** — `id:7` in guide references `Dakotas` but real Dakotas is id 9038; guide item should reference Sachet (Oak Lawn Mediterranean)

### UI / Design
- [ ] **UI design review** — run `design-an-interface` skill on target surface (Discover tab card grid + filter pills, or Trips dossier, or compact-row card) to get 3-5 alternate visual directions vs current Linear/Vercel caliber bar

---

## Recently Shipped (2026-04-27)

- `5473c35` — MEMORY.md added to repo
- `2fea8ed` — Fix verify-coords, fill empty dishes for Austin/LV/SLC (32 entries)
- `ad30d68` — Lists page: sub-tabs, tighter layout, mobile polish
- `057d42e` — Best Of: bestOfBoost 5→30, cuisineBlock, Dallas bestOf expansion
- `0ef2ecc` — San Diego bestOf anchors (12 entries)
- `056da41` — Seattle, Phoenix, LV bestOf anchors (26 entries)
- `a849dd0` — Chicago, LA, Austin, SLC bestOf anchors (54 entries)
- `809eaf0` — Best Of: skipBars filter + bestOf eligibility
