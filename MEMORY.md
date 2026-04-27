# Dim Hour — Project Memory

_Last updated: 2026-04-27. Update this file at the end of every session._

---

## 🔴 TO-DO LIST (prioritized)

### High Priority
1. **San Antonio expansion** — Steps 2-7 needed (~400+ spots), only 82 currently
2. **SF expansion** — Steps 2-7 + 9-10 needed, only 73/150 target currently
3. **Miami/Charlotte Step 9** — Hotels, malls, parks, museums for Local tab

### SEO Punch List (bundle as one PR — all touch the page-build script)
4. **Strip `aggregateRating` from all per-page schema** — misuse = manual-action risk from Google
5. **Regenerate stale pages + add Miami / Charlotte / SF** — all three return 404; counts wrong sitewide
6. **Replace logo `og:image` with per-page hero photo** — every page emits `/icons/icon-512.png`
7. **Regenerate or remove stale `noscript` block** — hard-codes contradictory top-10 lists for bots

### Medium Priority
8. **Austin verify-coords** — IDs 5633 (Q Bola Cuban) and 5635 (The Rustic Table) have zero lat/lng
9. **Empty dishes** — Austin 106 empty, SLC 85 empty, LV 112 empty entries
10. **More bestOf coverage** — SF and Charlotte have no bestOf[] yet; other cities need more depth
11. **agent-browser cleanup Pass A** — retry ~85 "dead site" cards via real Chrome (recovers ~25%)
12. **agent-browser cleanup Pass B** — backfill empty photoUrls across all cities

### Lower Priority
13. **Photo quality** — 1,919 BAD photos, 3,387 SUSPECT flagged by audit
14. **HyperFrames videos** — 3 queued: brand piece → app walkthrough → per-city teaser template
15. **SEO extension** — neighborhood pages `/{city}/{neighborhood}/`, indicator pages, cuisine breadth
16. **Data split** — index.html (~6MB) → data/{city}.json (biggest performance win)
17. **Utility-class pass** — 1,204 inline styles → CSS classes
18. **Event delegation** — 399 onclick handlers → data-action pattern

---

## City Status (as of 2026-04-27)

| City | Spots | Status |
|------|------:|--------|
| NYC | 971 | ✅ Complete |
| Dallas | 727 | ✅ Complete |
| Houston | 575 | ✅ Complete |
| SLC | 569 | ✅ Complete |
| Chicago | 561 | ✅ Complete |
| LA | 533 | ✅ Complete |
| Austin | 536 | ✅ Complete |
| Seattle | 524 | ✅ Complete |
| San Diego | 522 | ✅ Complete |
| Phoenix | 510 | ✅ Complete |
| Las Vegas | 518 | ✅ Complete |
| Miami | ~250 | Needs Step 9 (hotels/malls/parks/museums) |
| Charlotte | ~253 | Needs Step 9 |
| San Antonio | 82 | Needs Steps 2-7, 9 |
| SF | 73 | Needs Steps 2-7, 9-10 (target: 150) |

---

## Key Standards (apply every session)

**Data integrity**
- Never use training data for facts that can be fetched live (phone, hours, address, URL, status)
- Every card field verified at create-time — leave blank rather than approximate
- Dishes = real menu items only, sourced from live menu page
- Coords via Nominatim; never guess lat/lng

**Photos**
- Quality gate: real interior/exterior/food shot — no logos, OG tiles, social-share images
- Reject filenames containing: `OG`, `og.jpg`, `og-image`, `social`, `share`, `profile-pic`, `logo`
- Prefer filenames with photographer credits or raw camera names (`DSC_`, `DSCF`, `IMG_`)
- Pipeline order: og:image → Nominatim-verify → Norman's quality gate → apply

**Card additions**
- ~8 batches × 8 cards per session; status check after batch 8
- When user points to a curated site listing venues, add most of them (the list is the vetting)
- New card format: full per-card bullet (Address / Coords / Cuisine|Price|Score / Tags / Web|IG / Res / Desc / Dishes / Group)

**Scripts**
- Match `VAR\s*=\s*\[` not bare `VAR` when appending cards (48 DALLAS_DATA refs, only 2 are real declarations)
- Use `'utf8'` encoding — never `'binary'` (mangles ñ, ü, °, em-dash)
- After adding a neighborhood, rebuild `canonical-neighborhoods.json`: `node scripts/build-canonical-neighborhoods.js`

**Deploy**
- GitHub Pages only — no Netlify. Backend → Supabase.
- Multiple agents editing index.html via OneDrive can silently revert commits — verify after push

**Scraping cost ladder**
- WebFetch (free) → agent-browser CLI (free, JS rendering) → Apify (paid, last resort)
- Don't bulk-verify via Apify/Firecrawl during city expansions

---

## Architecture Quick-Ref

- **Stack**: Vanilla HTML/CSS/JS SPA in `index.html` (~6MB, 22k+ lines) + Capacitor v6 iOS
- **Data**: All 15 city arrays inline in `index.html` — `NYC_DATA`, `DALLAS_DATA`, etc.
- **Pre-commit hook**: runs JS integrity → vocabulary → data validation → closed-restaurant check
- **Best Of**: `_deriveBestOfLists()` ~line 32831; eligibility = dish regex OR explicit `bestOf[]`; `bestOfBoost=30`; `skipBars:true` on food categories
- **Indicators**: exactly 10 IDs — vegetarian, black-owned, women-owned, lgbtq-friendly, hole-in-the-wall, halal, dive-bar, brewery, outdoor-only, byob
- **Design bar**: Linear/Vercel/Arc/Raycast caliber — restrained color, modern type, dark mode default
