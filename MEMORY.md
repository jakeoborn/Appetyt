# Dim Hour — Project Memory Index

## Status & Priorities (read first)
- [Project Status + To-Do](project_status.md) — City counts, pending tasks, recent commits (2026-04-27, most current)
- [Pending Master Index](project_dimhour_status.md) — 🔴 PENDING items: SEO punch list, HyperFrames queue, agent-browser cleanup passes, full city roadmap
- [Dim Hour Memory Updates](feedback_dimhour_memory.md) — Always update status memory at end of every Dim Hour session

## Architecture & Tech
- [Tech Stack & Architecture](project_architecture.md) — SPA structure, data patterns, pre-commit pipeline, key code locations
- [Dim Hour Design System](project_dimhour_design_system.md) — Trips dossier, Travel Cities-first, Calendar (Phase 2d), Gmail OAuth, bottom nav structure
- [index.html Structure Hazards](feedback_indexhtml_structure.md) — 22MB→11MB dedupe history; use acorn to verify before edits
- [Best Of System](best_of_system.md) — Algorithm, boosts, skipBars, city coverage, scripts/add-bestof-cities.js

## Card & Data Standards
- [Dallas Card Standard](feedback_dallas_card_standard.md) — Canonical reference for card quality (hh, indicators, deep links, bestOf, photos, hours, dishes)
- [Full Accurate Cards](feedback_full_accurate_cards.md) — Fully verified at create-time, no placeholders, quality > count
- [Real Data Not Training](feedback_real_data_not_training.md) — Phone/hours/menuUrl/dishes from live curl/WebFetch, not training data
- [New Card Format](feedback_new_card_format.md) — Full per-card bullet format for approval (Address/Coords/Cuisine|Price/Tags/Web|IG/Res/Desc/Dishes/Group)
- [Verified-Only Additions](feedback_verified_only.md) — Leave blank rather than approximate; never fill to hit a count
- [Specific Dishes Rule](feedback_specific_dishes.md) — Real menu items only; no "Beer & Wine" / "Bar Snacks" placeholders
- [menuUrl — Simple Version](feedback_menu_url_simple.md) — Live URL to venue's menu page, no screenshotted PDFs
- [Indicators Standard](feedback_indicators_standard.md) — Exactly 10 indicators (IDs: vegetarian, black-owned, women-owned, lgbtq-friendly, hole-in-the-wall, halal, dive-bar, brewery, outdoor-only, byob)
- [Reservation Link Preference](feedback_reservation_link_preference.md) — Use whatever platform the venue actually uses; accuracy beats consistency
- [Slow/Careful Cards](feedback_slow_careful_cards.md) — Audit-gate, Le Bernardin tier voice, no fabrication

## Photo Standards
- [Photo Quality Bar](feedback_photo_quality_bar.md) — Che Fico benchmark; reject OG/social/logo filenames; prefer photographer-credit filenames
- [Photo-Add Pipeline](feedback_photo_add_pipeline.md) — Fixed order: og:image → Nominatim-verify → Norman's quality gate → apply
- [Photo Auto-proceed](feedback_photo_autoproceed.md) — New cards: passes quality gate → proceed without per-card approval
- [Autonomy on Quality](feedback_autonomy_quality.md) — Photo passes + info verified → apply and proceed, no check-ins
- [Photo Review Gate](feedback_dimhour_photos.md) — Show proposed image before swapping any existing photo
- [Photo Render Fallback](feedback_photo_render_fallback.md) — Renderers use `photoUrl || photos[0] || emoji` chain
- [Photo Scrape Score Ceiling](feedback_photo_score_ceiling.md) — `--min-score 5` for auto-apply; score 4 leaks borderline; don't lower
- [MCP Photo Pipeline](feedback_mcp_photo_pipeline.md) — read-website-fast ~20% interior hit rate; use as verification, not bulk source

## Scraping & Cost Discipline
- [Scraping Tool Ladder](feedback_scraping_ladder.md) — WebFetch → fetch → agent-browser → Apify; `scripts/scrape-og-image.js` free-tier first
- [Apify + Firecrawl Budget](feedback_apify_budget.md) — Don't bulk-verify via Apify/Firecrawl during expansions
- [Apify Credit Discipline](feedback_apify_credits.md) — Check /users/me/limits before runs; prefer free website-scrape

## Data Operations
- [Insert-script CITY_DATA collision](feedback_insert_script_collision.md) — Match `VAR\s*=\s*\[` not bare `VAR`; ~48 DALLAS_DATA refs, only 2 are real declarations
- [UTF-8 in insert scripts](feedback_utf8_insert_scripts.md) — Use `'utf8'` for read+write; never `'binary'` (mangles ñ, ü, em-dash)
- [Neighborhood Audit Infrastructure](reference_neighborhood_audit.md) — 12-city bounding-box audit system in scripts/; re-run audit-<city>-neighborhoods.js
- [Audit Trouble Cases](project_audit_trouble_cases.md) — ~85 cards deferred (coord bugs, LV Strip phantom address, outer-metro no-bucket)
- [Best Of Dynamic](feedback_bestof_dynamic.md) — Best Of auto-derives from CITY_DATA; no hardcoded per-city lists

## Feedback & Process
- [Key Feedback](feedback_patterns.md) — Pre-commit hook, neighborhood rebuild, bar-filter signal, bestOf eligibility (2026-04-27)
- [Dim Hour Standards](feedback_dimhour_standards.md) — When updating data/cards/design, capture new convention in memory
- [8-Batch Cadence](feedback_8batch_cadence.md) — ~8 batches × 8 cards per session (~64 cards); status check after 8th batch
- [Website-List Inclusion](feedback_website_list_inclusion.md) — When user points to a curated site listing venues, add most of them
- [City Category Breadth](feedback_city_category_breadth.md) — Match Dallas/NYC filter mix: fine dining, fast casual, brunch, patio, breweries, cafés, food halls
- [Verify Hours/Prices on URL review](feedback_verify_hours_prices.md) — Spot-check hours/admission/prices when reviewing a website URL
- [OneDrive Revert Hazard](feedback_onedrive_revert.md) — Multiple agents editing index.html via OneDrive silently revert prior pushed commits; verify after push

## Deploy & Infrastructure
- [Dim Hour Deploy](feedback_dimhour_deploy.md) — GitHub-only (NOT Netlify). Backend → Supabase.
- [Dim Hour File Path](reference_dimhour_path.md) — Project always at `C:\Users\jakeo\OneDrive\Appetyt-temp`
- [Gmail OAuth Integration](project_gmail_integration.md) — Phase 3 reservation-sync; 4 Netlify functions + Supabase gmail_connections; Yahoo/iCloud not feasible
- [MCP Servers Installed](reference_mcp_servers.md) — 11 servers in `~/.claude.json`; uv + github-mcp-server at `~/.local/bin`
- [MCP Pending Install Plan](project_mcp_pending.md) — Next: joelio/stocky, temporal-cortex/mcp, mcp-gateway. Skip: stadiamaps, Brave, Exa, depwire
- [MCP Audit 2026-04-26](reference_mcp_audit_2026_04_26.md) — 10 project-scoped MCP servers eat ~25% baseline context
- [Parallel AI MCP](reference_parallel_ai_mcp.md) — free MCP server at search.parallel.ai/mcp; try before paid Apify/Firecrawl
- [Dim Hour SEO Infra](project_dimhour_seo_infra.md) — ~387 pre-rendered URLs (10 cities × 12 cuisines + sitemap + schema). Read BEFORE assuming SEO is greenfield
- [Dim Hour Scheduled Agents](project_dimhour_scheduled_agents.md) — 2 monthly routines + 1 one-time SF photo audit (2026-05-08, trig_013ZWrmnZP7yagaB454Y1Gtp)

## Design
- [Design Principles](feedback_design_principles.md) — World-class modern design (Linear/Vercel/Arc/Raycast), restrained color, dark mode default
- [Compact-Row UI](feedback_compact_row_ui.md) — `compactRowHTML`/`compactRowGenericHTML` app-wide card format; tier-1 photo bar; pinned-sections+filter-pills modal

## City Data Notes
- [Da Toscano Relocation](project_da_toscano_relocation.md) — NYC card id 2018 now Midtown/Iroquois (was Greenwich Village/Minetta Lane)
- [Robb50 Future-City Queue](project_robb50_future_cities.md) — 28 Robb Report Top 50 Bars queued for new cities; tag `"North America Top 50 Bar"` at creation
- Miami target 250 ✓ (2026-04-26) · Charlotte at 253 ✓ · SF at 73/150 after Batch 1 (target 150)

## Tools & Workflow
- [Karpathy Principles](feedback_karpathy_principles.md) — Think Before Coding · Simplicity First · Surgical Changes · Goal-Driven Execution
- [Task Delegation & Tool Preferences](feedback_task_delegation.md) — Subagent tiering (Haiku/Sonnet/Opus), depth-2 cap; fetch order: WebFetch → agent-browser → Apify
- [RTK Token Tooling](reference_rtk_token_tooling.md) — rtk CLI + drona23 rules in global ~/.claude/CLAUDE.md; prefix commands with `rtk`
- [Skills Install](reference_skills_install.md) — `npx skills add <org>/<repo>` or git clone; supabase-postgres-best-practices has 34 rule files
- [HyperFrames Setup](reference_hyperframes_setup.md) — Video project at `C:\Users\jakeo\Dim Hour\`; 5 skills cloned; `npx hyperframes lint` after every edit

## User Profile
- [User Profile — Jake](user_profile.md) — Founder/developer; batches tasks; strict no-hallucination; direct communication; multi-session parallel work

