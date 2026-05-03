# Discover Tab Redesign — Dossier-as-Clock Handoff Spec

**Status:** Spec ✅ · Mock ✅ · Port 🔴 pending
**Branch:** `dark-luxury-v1`
**Target:** `index.html` `renderDiscover()` at line 37482, innerHTML write at line 37746
**Thesis:** *"Discover is a weekly Dossier, and tonight's issue is a clock."*

---

## How to use this spec

Reference this doc as authoritative for every visual, structural, and architectural decision. **Three of the four ownable angles already exist in code/brand** — the work is naming, promotion, and structural re-anchoring around TIME, not building from zero. Do not re-litigate locked decisions below.

Companion docs:
- `project_discover_redesign.md` (memory, thesis + research artifacts)
- `CARDS-REWRITE-SPEC.md` (the cards system this redesign rides on)
- Research: `C:\Users\jakeo\.lazyweb\design-research\dimhour-discover-tab-redesign-v2-2026-05-02\`

---

## 1. Locked decisions

### Spine (5 elements, in render order)

| # | Decision |
|---|---|
| D1 | **Issue masthead** at top: `THE DIMHOUR DOSSIER · Issue NN · Mon D YYYY`. Dossier-eyebrow class already exists. |
| D2 | **Tonight's Cover** (replaces page-title block): single editorial card framed as "the issue's cover," time-anchored copy, hero-tier photo, score+critic badge. |
| D3 | **Clocking now** strip beneath search bar: live-state pill row. Replaces "Hot Right Now" entirely. |
| D4 | **Hour Dial** sticky chips: `5pm · 7pm · 9pm · 11pm · 1am`. Re-renders body to that hour. Cuisine chips become secondary (collapse into `≡ All filters` chip). |
| D5 | **The Dim Hour 10**: 10 numbered ranking, score+critic badge on every entry. Hero/Featured/Standard tiering matches `compactRowHTML` (rank 1 hero, 2-5 featured, 6-10 standard). |
| D6 | **Tonight's Pairings**: ONE Smart Combo per visit, surfaced as a 3-stop Sequence card. Editorial copy: "Tonight's pairing: rooftop @ 7 → dinner @ 8:30 → nightcap @ 11". |
| D7 | **Same-surface map**: chip toggle on the same surface, NOT a separate tab. Defer to v2 — keep the current map entry-points until Sequence + Hour Dial ship. |

### Subtractions (in this order)

| # | Decision |
|---|---|
| S1 | Remove the page-title block at line 37748-37751 (`✨ Discover {city}`) — replaced by D1+D2. |
| S2 | Demote the **6 Explore Cards grid** (37754-37787): keep the 6 entry-points but move them BELOW the Dim Hour 10. Rename the grid eyebrow to "More from this issue" so they read as Dossier sub-departments, not a top-level menu. |
| S3 | Keep Neighborhood Spotlight (37789-37809) but move it BELOW Tonight's Pairings. It's a chapter, not a hero. |
| S4 | Keep `bestOfCityHTML()` (37812) but move it BELOW Neighborhood Spotlight. The Dim Hour 10 is now the headline ranking; bestOf is the long-tail index. |
| S5 | Keep Casino Resorts unchanged (Vegas-only conditional). |

### Ownable angles (the four)

| # | Decision |
|---|---|
| A1 | **Clocking now** is a verb Dim Hour owns. Strip format: `<span class="clk-pill">⏱ Clocking now</span> Happy Hour · 14 spots within 10 min`. |
| A2 | **Score+critic badge** is one composite unit: `97 · Michelin ★★ · J.Beard`. Reads `r.score` + `r.awards` (split on ` \| `, take credential half) + `r.bestOf` (priority chain Michelin > World's 50 > Beard > Eater 38 > Critics' Pick). Goes on every Dim Hour 10 entry AND the Cover. Single render helper. |
| A3 | **Dossier as recurring publication**: issue number = ISO weeks since 2025-W01. Date stamp = first day of current ISO week, formatted "May 2 2026". Persists across cities (not city-specific). |
| A4 | **Tonight's Pairings** = ONE pairing per session, picked from the 16-combo taxonomy (`SMART_COMBOS` if it exists, else hard-coded shortlist of `cocktail-bar → dinner → dessert/nightcap`). Each stop is a `compactRowHTML` row (Standard tier) with a time anchor in the eyebrow. |

### Hour Dial state

| # | Decision |
|---|---|
| H1 | New state: `A._hour` ∈ `{ 'now', '17', '19', '21', '23', '25' }`. `'now'` is default and resolves to local clock; numeric values are 24h. |
| H2 | `setHour(h)` mutates state and calls `renderDiscover()`. No deep-link / URL persistence in v1 (page-state only). |
| H3 | Hour-aware filters: `Clocking now` strip text + Cover Story copy + Dim Hour 10 sort key all read `A._hour`. The 10 list itself does NOT change order between hours in v1 (would require per-hour scoring). Only the Cover and Clocking strip change. |
| H4 | Hour Dial chip rail uses `.cw-section-header` style, sticky-positioned beneath the Issue masthead with a thin gold rule. |

### Sequence card (new component)

| # | Decision |
|---|---|
| Q1 | New CSS class `.dh-sequence` — single card that contains 3 mini-rows. NOT a variant of `compactRowHTML`. Stands alone. |
| Q2 | Visual: gold-leaf top border, italic Fraunces eyebrow `Tonight's Pairing`, 3 numbered stops (1,2,3) each with `time anchor · venue name · cuisine · 1-line note`, gold connector lines between stops. |
| Q3 | Tap target: each stop opens `A.openDetail(r.id)`. Whole card has no global tap (each stop is its own button). |
| Q4 | Pair-picking: priority order `r.tags includes 'Cocktail Bar' AND r.hh` for stop 1, top-scored Date-Night-tagged for stop 2, top-scored Dessert/Nightcap for stop 3. Fallback to top-3 by score if filters yield <3. |
| Q5 | Time anchors derived from `A._hour`: stop 1 = current hour, stop 2 = +1.5h, stop 3 = +3.5h. Display as `7:00 PM · ...`. |

### Score+critic badge (new helper)

| # | Decision |
|---|---|
| B1 | Helper: `A.scoreCritBadge(r)` returns HTML string. Single line, italic Fraunces for the score number, sans for the credential. |
| B2 | Format: `{score} · {credential}`. Multi-credential format: `{score} · Michelin ★★ · J.Beard`. Credentials separated by ` · ` (gold-soft middle dots). |
| B3 | Credential extraction priority chain (first match wins, cap at 2 credentials): Michelin star (any number) → World's 50 Best → James Beard → Eater 38 → Critics' Pick → Local critic award (from `r.awards` first segment). |
| B4 | If no credential available, return score-only pill (`{score}`). Never render an empty credential. |
| B5 | Used on: Cover Story (D2), every Dim Hour 10 entry (D5), each Sequence stop (Q3). |

### Architecture

| # | Decision |
|---|---|
| C1 | All work goes in `renderDiscover()` and a small set of helpers. No external file. |
| C2 | New CSS in a single `<style id="discover-redesign">` block, inserted near the existing `<style id="cards-rewrite">` block. |
| C3 | Render order: D1 → D2 → D3 → D4 → D5 → D6 → S3 (Neighborhood) → S4 (bestOf) → S2 (Explore Cards demoted) → S5 (Casinos). |
| C4 | acorn-verify gate before each commit (per CARDS-REWRITE-SPEC §6). |
| C5 | Two commits: (1) spec doc + masthead + Cover + Clocking strip + Hour Dial state, (2) Dim Hour 10 + Sequence card + score-critic badge + reorder. |

---

## 2. ASCII mock — full Discover stack

```
┌──────────────────────────────────────────────────────────────────┐
│  [search bar — unchanged, sticky top]                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  THE DIMHOUR DOSSIER · ISSUE 18 · MAY 2 2026          ← D1       │
│                                                                  │
│  Tonight in                                                      │
│  New York                                                        │
│  ◆ ◆ ◆                                                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  ⏱ Clocking now    Happy Hour · 14 spots within 10 min   →    │ ← D3
├──────────────────────────────────────────────────────────────────┤
│  [5pm]  [ 7pm ]  [9pm]  [11pm]  [1am]                    ← D4    │
│         ─────                                                    │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ THE 7PM COVER                                          ← D2  │ │
│ │ ┌──────────┐  By 9pm tonight, the bar at Le B will           │ │
│ │ │   ████   │  be 4-deep. The kitchen sends one dish:         │ │
│ │ │  ██████  │  the black bass à la nage.                       │ │
│ │ │   ████   │                                                  │ │
│ │ └──────────┘  Le Bernardin                                    │ │
│ │               99 · Michelin ★★★ · J.Beard          ← A2/B    │ │
│ └──────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│  THE DIM HOUR 10                                       ← D5      │
│  ─────────────────────────────────────                           │
│                                                                  │
│  01  ┌─────────┐  Carbone                                        │
│      │  ████   │  Italian · Greenwich Village                    │
│      └─────────┘  98 · J.Beard · Critics' Pick                   │
│                                                                  │
│  02  ┌─────────┐  Le Bernardin     ...                           │
│      ...                                                         │
│  ...                                                             │
│  10                                                              │
├──────────────────────────────────────────────────────────────────┤
│  TONIGHT'S PAIRING                                     ← D6      │
│  ─────────────────────────────────────                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ◆ rooftop @ 7  ──  ◆ dinner @ 8:30  ──  ◆ nightcap @ 11 │   │
│  │  ┌─────┐         ┌─────┐                ┌─────┐          │   │
│  │  │ 1   │ ──────→ │  2  │ ─────────────→ │ 3   │          │   │
│  │  │The  │         │Don   │                │Em.  │          │   │
│  │  │Crow │         │Angie │                │Cock │          │   │
│  │  │7pm  │         │8:30  │                │11pm │          │   │
│  │  └─────┘         └─────┘                └─────┘          │   │
│  └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│  🏘️ NEIGHBORHOOD SPOTLIGHT  (existing, unchanged)     ← S3       │
│  [...2-col grid...]                                              │
├──────────────────────────────────────────────────────────────────┤
│  THE BEST OF — INDEX  (was bestOfCityHTML)            ← S4       │
│  [...curated lists...]                                           │
├──────────────────────────────────────────────────────────────────┤
│  MORE FROM THIS ISSUE                                 ← S2       │
│  [Weekend Guides] [Events]    [Things to Do]                     │
│  [Nightlife]      [Celebs]    [Trends]                           │
├──────────────────────────────────────────────────────────────────┤
│  🎰 CASINO RESORTS  (Vegas only, unchanged)           ← S5       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Render order in `renderDiscover()` (final)

```js
document.getElementById('discover-content').innerHTML = `
  <div class="discover-stack" style="padding:14px 14px 100px">
    ${dossierMastheadHTML(S.city, A._hour)}                    // D1
    ${clockingNowHTML(restaurants, A._hour)}                   // D3
    ${hourDialHTML(A._hour)}                                   // D4 (sticky)
    ${tonightsCoverHTML(coverPick, A._hour)}                   // D2
    ${dimHour10HTML(top10, _tripIds)}                          // D5
    ${tonightsPairingHTML(pairing, A._hour)}                   // D6
    ${neighborhoodSpotlightHTML(...)}                          // S3 (existing)
    ${this.bestOfCityHTML()}                                   // S4 (existing, just relabeled)
    ${moreFromThisIssueHTML()}                                 // S2 (existing 6-up, demoted + relabeled)
    ${casinoResortsHTML()}                                     // S5 (Vegas only)
  </div>
`;
```

Each section header (D5, D6, S3, S4, S2) uses `.cw-section-header` with `<h2 class="cw-section-title">` matching the dossier voice.

---

## 4. Voice / copy rules

- Every section header answers **"when?"** before "what?" where possible.
- Use time-anchored copy: "Tonight", "By 9pm", "After dinner", "Late", "1am".
- Avoid pure cuisine/neighborhood framing at the top.
- Editorial voice: "Spotlight", "Just Added", "Tonight's Cover", "Tonight's Pairing", "The Dim Hour 10".
- **Do not** use "Best Overall / Best Casual / Best Date Night" bucket names at the top — they read as feature-list voice. (Bucket names persist inside `bestOfCityHTML()` since that's the long-tail index, not the headline.)

---

## 5. Anti-patterns

- Adding more chips/cards/colors instead of subtracting. Novelty is structural.
- Tinting categories (Date Night purple, etc.).
- Treating Map as a separate tab.
- Per-hour re-sorting of the Dim Hour 10 in v1 (deferred — only Cover + Clocking change).
- New emoji vocabulary. Use the gold-leaf / dossier vocabulary already in CSS.

---

## 6. Verification gate (per commit)

Before committing each of the two commits:

1. `node -e "const a=require('acorn'); /* parse 11 inline scripts in index.html */"` — must be 11/11 clean.
2. Smoke-render Discover for **NYC, Dallas, Houston, LA, Las Vegas** (Vegas tests S5 conditional).
3. No duplicate IDs introduced. `getElementById('discover-content')` still resolves.
4. Hour Dial state changes re-render without console errors.
5. Sequence card 3 stops all open `openDetail` correctly.

---

## 7. Open questions (for next session, do NOT block on)

- Should issue number reset annually (Issue 1 of 2027) or accumulate (Issue 105)? Default: accumulate, stamp year in dateline.
- Cover Story text source: hardcoded per-city for v1, or `r.description` first sentence? Default: `r.description` first sentence with time-anchor prefix.
- Pairing rotation: per-session (window load) or per-hour (changes when Hour Dial moves)? Default: per-hour. Memoize per `${city}|${hour}` key.
