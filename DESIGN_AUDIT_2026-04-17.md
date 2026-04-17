# Design Edit Pass — 2026-04-17

## Scope
Font legibility, spacing, faint/gray text, restaurant card consistency.

## FIXED IN THIS PASS

### Font size bumps (9 fixes)
Below 10px is meaningfully hard to read on a phone even with uppercase+tracking.
Bumped the following from **7–8px → 10px** (kept the label aesthetic via
heavier letter-spacing):

| File:line | Component | Before | After |
|---|---|---|---|
| index.html:952 | `.vp-code` (visit plan stop) | 7px + rgba(200,169,110,**.25**) | 10px + **.55** opacity |
| index.html:1011 | `.cp-hours-unit` (card preview) | 7px | 10px |
| index.html:17665-17677 | Trip stats "Days/Booked/Spent/Done" | 8px | 10px |
| index.html:17731-17732 | Trip day city/items badges | 8px | 10px |
| index.html:17763 | Trip status button | 8px | 10px (+ padding bump) |
| index.html:19935 / 20274 | "Score"/"Vibe" labels | 8px | 10px |
| index.html:21721 | Calendar "Explore" chip | 8px | 10px |
| index.html:22010-22016 | Trip calendar "ARRIVE/DEPART/ASHORE" | 8px | 10px |
| index.html:22023 | Calendar "TOP PICKS" | 8px + color #3a3228 | 10px + #5a4e38 |

### Faint/gray text fixes
- `.vp-code` opacity bumped from 25% → 55% (was nearly invisible on the scene)
- "TOP PICKS" text changed from #3a3228 to #5a4e38 — darker-on-gold combo was
  uncomfortable; new value still subtle but legible
- `--text3` was fixed yesterday (2.24:1 → 4.67:1 on card bg, passes AA)

### Already-clean areas
- Home feed restaurant cards (121 tested): **all consistent** — 0.8px border,
  11px padding, 12px radius, #11151f card bg, 14px font.
- Neighborhood Spotlight tiles (46 tested): **all consistent** — 1.6px border,
  12/14px padding, 12px radius, gold glow box-shadow.
- Low-opacity (0.1–0.4) usages: all verified as decorative — keyframe pulse
  animations or background emoji ornaments (🌊, ✦), none on body text.

## KNOWN BUT NOT FIXED HERE

### Card styling drift between contexts (deferred to #21 utility-class pass)
- Home cards: 0.8px border, 11px pad, no shadow
- Spotlight cards: 1.6px border, 12/14px pad, 8px gold glow
- Nightlife, Spotlight, Home each currently define these inline. Should become
  `.card-base` / `.card-elevated` / `.card-spotlight` in the utility pass.

### Score badge consistency (for future pass)
Score pill (the `95` on mini cards) appears in ≥5 contexts with slightly
different padding/weights. Once utility classes exist, unify via `.score-pill`.

### Tag pill consistency (for future pass)
Currently:
- Some tag pills: `rgba(200,169,110,.1)` bg + gold border
- Others: `var(--gold-dim)` bg
- Others: `var(--card2)` bg
Same visual goal, three implementations. Unify in `.tag-pill`.

## METRICS
- Inline styles in DOM: 1,204 (unchanged — addressing is utility-class pass job)
- 7–8px text found in labels/body: fixed **12** instances
- 7–8px decorative glyphs (✦, ▼ chevrons, calendar "D1/D2" indicators):
  intentionally kept at 8px because they're ornamental, not content
