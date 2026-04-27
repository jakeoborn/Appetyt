# Dim Hour

Restaurant discovery app for iOS and web. Currently covers 7,200+ restaurants across 15 US cities (NYC, LA, Miami, Dallas, Austin, Chicago, Houston, Las Vegas, Seattle, SF, Charlotte, San Diego, Phoenix, Salt Lake City, San Antonio).

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (single-page app in `index.html`)
- **Mobile**: Capacitor v6 for iOS (app ID: `app.dimhour.ios`)
- **AI**: Anthropic Claude API for restaurant concierge chatbot ([concierge.js](concierge.js))
- **Hosting**: Static site at dimhour.com (GitHub Pages via [CNAME](CNAME))
- **CI/CD**: GitHub Actions ([.github/workflows/ios-build.yml](.github/workflows/ios-build.yml)) + CodeMagic ([codemagic.yaml](codemagic.yaml))

## Commands

```bash
npm run build          # Copy index.html → dist/
npm run cap:sync       # Build + sync to iOS project
npm run cap:open       # Open Xcode
npm run cap:build      # Build + sync + open Xcode
```

## Architecture

- `index.html` — Main app (single-file SPA, ~11.7MB unminified, includes inline city data)
- `concierge.js` — Netlify/Lambda function for Claude AI chatbot endpoint
- `sw.js` — Service Worker for offline PWA support
- `capacitor.config.ts` — iOS app configuration (Capacitor)
- `ios/` — Capacitor-generated iOS project (Xcode workspace)
- `scripts/` — Data ingestion + validation scripts (`add-*.js` for city batches, `validate-vocabulary.js`, `validate-data.js`, `check-js-integrity.js`, `fix-vocabulary-dupes.js`, `build-canonical-neighborhoods.js`)
- `hooks/pre-commit` — repo-tracked git hook (run `npm run setup` once to wire `core.hooksPath`); runs JS integrity + vocab validation, then `caliber refresh` if Caliber is installed
- `icons/` — PWA icons
- City SEO landing dirs: `dallas/`, `nyc/`, `chicago/`, `houston/`, `austin/`, `seattle/`, `las-vegas/`, `los-angeles/`, `salt-lake-city/`, `san-antonio/` (each has category subpages: `bbq/`, `brunch/`, `date-night/`, etc.). Miami, San Diego, Phoenix, Charlotte, SF have data but no static pages yet.

## Data Layout

Every city's restaurants are inline arrays in `index.html`, named `{CITY}_DATA`:
`NYC_DATA`, `DALLAS_DATA`, `HOUSTON_DATA`, `AUSTIN_DATA`, `CHICAGO_DATA`, `SLC_DATA`, `LV_DATA`, `SEATTLE_DATA`, `LA_DATA`, `MIAMI_DATA`, `SF_DATA`, `CHARLOTTE_DATA`, `PHX_DATA`, `SD_DATA`, `SANANTONIO_DATA`. Each entry follows the schema in [.claude/rules/data-integrity.md](.claude/rules/data-integrity.md). Editorial rankings live in the `bestOf` array on each entry (e.g. `["#1 Best Italian"]`). Canonical neighborhoods in [scripts/data/canonical-neighborhoods.json](scripts/data/canonical-neighborhoods.json).

## Key Patterns

- The app is a monolithic SPA — all UI logic is in `index.html`
- Data scripts in `scripts/` are standalone Node.js scripts for batch operations
- iOS builds use CocoaPods for Capacitor plugin dependencies
- The app uses Supabase for backend, OpenStreetMap for maps
- Dark theme with gold accents (`#c9a84c` primary, `#0a0d14` background)

## Accuracy & Anti-Hallucination Rules

- NEVER fabricate restaurant names, addresses, hours, coordinates, or menu items
- NEVER invent city support, neighborhoods, or trending status — check `index.html` data arrays
- NEVER guess lat/lng coordinates or reservation platforms — verify or ask
- When adding restaurant data, every field must come from verified sources — flag anything unverified
- When uncertain, say "I'm not sure" — never fill gaps with plausible-sounding guesses
- Always read existing code/data before modifying — never assume file contents
- See `.claude/rules/no-hallucination.md` and `.claude/rules/data-integrity.md` for full policies

## Coding Behavior Guidelines

Behavioral defaults to reduce common LLM mistakes. Adapted from [jakeoborn/andrej-karpathy-skills](https://github.com/jakeoborn/andrej-karpathy-skills). Bias toward caution; use judgment for trivial tasks.

1. **Think before coding.** State assumptions; ask if uncertain. Don't silently pick between interpretations.
2. **Simplicity first.** Minimum code that solves the problem. No speculative abstractions, no error handling for impossible cases. If 200 lines could be 50, rewrite.
3. **Surgical changes.** Touch only what the task requires. Match existing style. Mention adjacent dead code rather than deleting it. Every changed line should trace directly to the user's request.
4. **Goal-driven.** Convert tasks into verifiable success criteria before implementing — "fix the bug" → "write a failing test, make it pass."

## Conventions

- No test framework or linter currently configured
- Build is a simple file copy (`index.html` → `dist/`)
- Node.js >= 18 required
- Universal Links configured for `dimhour.com` domain

## Important Files

- [.github/workflows/ios-build.yml](.github/workflows/ios-build.yml) — iOS CI pipeline (requires Apple signing secrets)
- [codemagic.yaml](codemagic.yaml) — Alternative CI for TestFlight/App Store builds
- [manifest.json](manifest.json) — PWA manifest
- [privacy.html](privacy.html) — Privacy policy page

<!-- caliber:managed:pre-commit -->
## Before Committing

**IMPORTANT:** Before every git commit, you MUST ensure Caliber syncs agent configs with the latest code changes.

First, check if the pre-commit hook is already installed:
```bash
grep -q "caliber" .git/hooks/pre-commit 2>/dev/null && echo "hook-active" || echo "no-hook"
```

- If **hook-active**: the hook handles sync automatically — just commit normally. Tell the user: "Caliber will sync your agent configs automatically via the pre-commit hook."
- If **no-hook**: run Caliber manually before committing:
  1. Tell the user: "Caliber: Syncing agent configs with your latest changes..."
  2. Run: `caliber refresh && git add CLAUDE.md .claude/ .cursor/ .cursorrules .github/copilot-instructions.md .github/instructions/ AGENTS.md CALIBER_LEARNINGS.md .agents/ .opencode/ 2>/dev/null`
  3. After it completes, briefly tell the user what Caliber updated. Then proceed with the commit.

If `caliber` is not found, tell the user: "This project uses Caliber for agent config sync. Run /setup-caliber to get set up."
<!-- /caliber:managed:pre-commit -->

<!-- caliber:managed:learnings -->
## Session Learnings

Read `CALIBER_LEARNINGS.md` for patterns and anti-patterns learned from previous sessions.
These are auto-extracted from real tool usage — treat them as project-specific rules.
<!-- /caliber:managed:learnings -->

<!-- caliber:managed:sync -->
## Context Sync

This project uses [Caliber](https://github.com/caliber-ai-org/ai-setup) to keep AI agent configs in sync across Claude Code, Cursor, Copilot, and Codex.
Configs update automatically before each commit via `caliber refresh`.
If the pre-commit hook is not set up, run `/setup-caliber` to configure everything automatically.
<!-- /caliber:managed:sync -->
