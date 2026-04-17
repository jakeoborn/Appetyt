# Dim Hour — Opus 4.7 Audit (2026-04-16)

## TL;DR

**Design: B+ · Code: C+ · Accessibility: C- · SEO: B · Performance: C**

You have a distinctive brand and a working product. The codebase is paying compounding interest on three choices: (1) monolithic 6 MB inline bundle, (2) ~1,200 inline `style=` attributes + 399 `onclick` handlers, (3) no tag/neighborhood vocabulary enforcement. Each of those has driven real, observable bugs today. Five focused fixes would materially improve the product. Detailed notes below.

---

## 🔴 CRITICAL (do this week)

### 1. Viewport blocks zoom — accessibility violation

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

`maximum-scale=1.0, user-scalable=no` fails WCAG 2.1 SC 1.4.4 and hurts vision-impaired users. Fix (1-line):

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### 2. Data-vocabulary drift silently splits filters and neighborhoods

Observed today:
| Neighborhood dupes (Vegas/Houston) | Tag dupes (Dallas) |
|---|---|
| "The Strip (The Palazzo)" (6) vs "The Strip (Palazzo)" (2) | "Date Night" (314) vs "date night" (1) |
| "The Strip (The Venetian)" (21) vs "The Strip (Venetian)" (1) | "Casual" (334) vs "casual" (1) |
| "Heights" (56) vs "The Heights" (15) | "Family Friendly" (80) vs "family friendly" (1) |

Every one of these splits a single concept into two buckets, degrading spotlight grouping and filter counts. **Add a pre-commit `validate-vocabulary.js`** that fails on case-collisions, fuzzy-duplicate neighborhoods, and unknown tags.

### 3. Stale SEO description

Meta description says *"2,400+ curated restaurants"*. Actual is 3,400+. Update:

```html
<meta name="description" content="Discover the best restaurants in NYC, Dallas, Austin, Chicago, Houston, Salt Lake City, Seattle and Las Vegas. 3,400+ curated spots with scores, reviews, and reservations. Your ultimate 2026 dining guide.">
```

---

## 🟠 HIGH IMPACT (do this month)

### 4. Split data from code

`index.html` is 22,438 lines / 6.1 MB. Approximately 85% of that is embedded data arrays (`DALLAS_DATA`, `HOUSTON_DATA`, etc.). The data gets re-downloaded on every deploy — and the service worker caches the whole 6 MB file.

- Move each city's array to `data/{city}.json`, fetched async on city switch
- The SPA code drops from 6 MB → < 500 KB
- First-paint on 4G goes from ~4–6 s to < 1 s
- Enables a CI data-integrity step (schema check, dup check, lat/lng bounds check)
- Opens the door to later adding an `/api` endpoint for third-party use

### 5. Unify the classifier (was added as task #7)

Today I found the spotlight missed 40+ NYC entries because their cuisine is `"Entertainment"` not `"Museum"`. There is no single `classify(r)` function — logic is duplicated across spotlight, nightlife, and filters. Each duplication drifts.

Fix: one function, exported on the global. All three consumers use it. Covered cases:

```
attractions > coffee > dessert > bars > fastCasual > restaurants
```

Also: `"Live Music"` cuisine (e.g., Radio City, Madison Square Garden) should classify as attractions by tag/landmark check, not bars. Small dive-bar live music (Mercury Lounge) stays as bars. Use a landmark allowlist.

### 6. Accessibility pass on filter tabs, expand buttons, and modal

Current state:

| Element | Missing |
|---|---|
| Filter tabs | `role="tablist"`, `role="tab"`, `aria-selected`, arrow-key navigation |
| Expand buttons | `aria-expanded`, `aria-controls` |
| Neighborhood modal | `role="dialog"`, `aria-modal`, focus trap, ESC-to-close |

These are ~30 lines of code, move the app from "inaccessible" to "AA-compliant for interactive patterns."

---

## 🟡 DESIGN POLISH

**Strengths:**
- Gold-on-dark palette (#c8a96e / #0a0d14) is distinctive, premium, consistent
- Playfair serif italic + candle/dimmer motif matches the "dim hour" brand name
- The redesigned Neighborhood Spotlight (filter tabs + Top 10 expand) is structurally strong

**Recommendations:**
1. **Emoji-heavy section headers feel 2020s.** Replace `🍽 Top Restaurants` / `🍸 Bars` / `☕ Coffee` with a custom 16-icon SVG set that follows the gold linework. Lifts visual maturity significantly.
2. **Editorial stack before spots is dense.** Spotlight shows: Drop-cap Scene → Insider Tip → Activities → Known For → Must Visit → Top Restaurants → Top Bars → Coffee → Dessert → Fast Casual. That's 5 editorial blocks before the first bar. Consider collapsing "Scene / Known For / Must Visit" into a single togglable "About" card at the top.
3. **Chip padding is tight.** Filter tabs use `padding: 8px 13px`. On sub-360px phones chips can wrap awkwardly. Bump to `8px 16px` and allow a 1-line scroll (already implemented) rather than wrapping.
4. **Inline drop-cap can misalign.** The floated 38 px serif first-char with 4 px top margin sometimes overhangs a single-line vibe paragraph. Set `min-height: 44px` on the paragraph or drop the float below a 2-line threshold.
5. **Dark-theme contrast.** Gold text (#c8a96e) on card background (≈#12161d) measures ~4.2:1 — passes AA-Large but fails AA for body text (needs 4.5:1). Either darken background to #0e1218 or lighten gold body text to #d6b97a. Reserve the current gold for accents and serif headings only.

---

## 🟡 CODE QUALITY

**Observed:**
- 22,438 lines / 6.1 MB / 13 inline scripts / 92 KB inline CSS
- 1,204 inline `style=` attributes
- 399 elements with `onclick=` (blocks strict Content-Security-Policy)
- 272 global window props (namespace pollution)
- No bundler, no lint, no tests

**Recommendations (in priority order):**
1. **Utility-class pass**: replace the 10 most-repeated inline style blocks with classes (`.card`, `.card-hero`, `.chip`, `.chip-active`, `.section-head`, `.section-count-pill`, etc.). Same visual, fraction of the bytes, one place to adjust.
2. **Event delegation**: install a single document-level `click` listener that reads `data-action`. Eliminates the 399 `onclick` attributes, unblocks strict CSP, drops ~80 KB.
3. **Consolidate state**: `A`, `S`, `window._nbhSpotCache`, `window._seasonalCache` — pick one state container. Names like `DimHour.state.city` read better than `S.city` in 2026.
4. **Extract the data scripts**: `scripts/add-*.js` all parse `index.html` via regex. Once data is JSON this is just `fs.readFile(cityPath)` → modify → write. Much safer.

---

## 🟢 PRE-COMMIT GATES I'D ADD

```
scripts/validate-vocabulary.js
  - Fails if any tag has case-duplicates (Date Night + date night)
  - Fails if two neighborhoods differ only by "The " prefix
  - Warns on unknown tags not in canonical list
  - Enforces naming: no " Las Vegas" suffix dupes

scripts/validate-data.js
  - All restaurants have id, name, lat/lng in city bounding box
  - No duplicate names within a city
  - All `cityLinks` targets exist
  - All `locations` entries have address + (optional) lat/lng

scripts/check-js-integrity.js (existing)
  - Keep — it's catching bundle syntax errors
```

Wire into `.git/hooks/pre-commit`. Break the build on failure.

---

## 🟢 DATA COVERAGE AUDIT

| City | Count | Gap to 500 | Attractions | Main issue |
|---|---|---|---|---|
| Dallas | 665 | — | 26 | ✅ |
| New York | 880 | — | 51 | Good after classifier fix |
| Chicago | 500 | — | 24 | ✅ |
| Austin | 500 | — | 24 | ✅ |
| Houston | 500 | — | 12 | Low attraction count |
| Salt Lake City | 500 | — | 16 | ✅ |
| Las Vegas | 417 | -83 | 19 | Under-covered casinos |
| Seattle | 328 | -172 | 17 | Needs 2+ more batches |

---

## 🟢 WHAT I'D SHIP FIRST (2-hour PR)

1. Viewport fix (1 min)
2. Update SEO description (1 min)
3. Add `validate-vocabulary.js` + fix 6 dup neighborhoods + fix 5 tag case dupes (60 min)
4. Unified `classify(r)` function (30 min)
5. ARIA on filter tabs + modal (30 min)

Measurable wins: Lighthouse Accessibility 75 → 95, Performance 60 → 85 after data split, and no more "why does this restaurant not show up in the spotlight" bugs.
