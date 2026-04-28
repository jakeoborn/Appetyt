# Dim Hour — Product Marketing Context

## Brand Voice Rules

Source: `scripts/brand-voice-exemplars.txt` (7 canonical descriptions across tonal tiers)

### What Dim Hour sounds like
- **Confident and opinionated.** Make a call. "The greatest porterhouse in the history of steak." Not "one of NYC's most popular steakhouses."
- **Specific, never generic.** Real names, real counts, real details. "657 restaurants in Dallas" not "hundreds of curated spots."
- **No corporate marketing-speak.** Drop: *curated guide*, *discover*, *scored and reviewed*, *top spots*, *best-in-class*.
- **Terse.** One strong sentence beats three weak ones. Cut adjectives that don't add information.
- **Insider tone.** Write like someone who has eaten everywhere and has opinions. Not like a review aggregator.

### What to avoid
- "Updated weekly" — false claim, remove everywhere
- "Curated spots" — sounds like a startup pitch
- "Top X Spots" — generic SEO-speak
- "Discover 500+ best restaurants" — passive and inflated
- Emoji stuffing in body text (CTAs are ok)
- "Scored and reviewed" — redundant; just say "scored and ranked"

---

## SEO Meta Templates

### City pages (`/{city}/`)
**Title:** `Best Restaurants in {City} 2026 — {N} Picks | Dim Hour`
**Description:** `{N} restaurants in {City}, scored and ranked. Fine dining, brunch, date night, bars — the full guide across {H} neighborhoods.`
**OG title:** `Best Restaurants in {City} 2026 — {N} Picks | Dim Hour`
**OG description:** `{N} restaurants in {City}, scored and ranked by neighborhood.`

### Category pages (`/{city}/{category}/`)
**Title:** `Best {Category} in {City} 2026 | {N} Picks | Dim Hour`
**Description:** `{N} {category} spots in {City}, scored and ranked. Top picks: {Name}, {Name}, {Name}.`
**OG title:** `Best {Category} in {City} 2026 — {N} Picks`
**OG description:** `{N} {category} spots in {City}. {Name}, {Name}, {Name}.`

### Neighborhood pages (`/{city}/{neighborhood}/`)
**Title:** `Best Restaurants in {Neighborhood}, {City} 2026 | {N} Picks | Dim Hour`
**Description:** `{N} restaurants in {Neighborhood}, {City}. {bestFor if set}. Top picks: {Name}, {Name}, {Name}.`
**OG title:** `Best Restaurants in {Neighborhood}, {City} 2026 — {N} Picks`
**OG description:** `{N} restaurants in {Neighborhood}. {First sentence of vibe if set}.`

---

## Footer copy (all page types)
Replace `"Dim Hour curates the best restaurants across America. Updated weekly."` with:
`"Dim Hour scores the best restaurants across America."`

---

## CTA copy
- Primary: `Explore the Full Guide →` (no emoji required; emoji ok in buttons)
- Avoid: "Open Interactive Guide" when linking from within the site

---

## Voice tiers (from exemplars)
| Score range | Tone |
|---|---|
| 95–99 | Declarative, historic, slightly reverent ("cash only, no reservations, greatest porterhouse in history") |
| 85–94 | Confident and specific, a bit theatrical ("Michelin-starred Korean BBQ that earns it on every visit") |
| 75–84 | Honest and self-aware ("not exciting food, but honest food") |
| <75 | Neutral, factual, no superlatives |
