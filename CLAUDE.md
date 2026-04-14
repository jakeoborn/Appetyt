# Dim Hour

Restaurant discovery app for iOS and web. Helps users find the best restaurants across 248+ cities worldwide.

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

- `index.html` — Main app (single-file SPA, ~3.5MB minified)
- `concierge.js` — Netlify/Lambda function for Claude AI chatbot endpoint
- `sw.js` — Service Worker for offline PWA support
- `capacitor.config.ts` — iOS app configuration (Capacitor)
- `ios/` — Capacitor-generated iOS project (Xcode workspace)
- `scripts/` — Data ingestion scripts (city data, restaurant descriptions, audits)
- `icons/` — PWA icons

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

## Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Adapted from [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills). These bias toward caution over speed — use judgment on trivial tasks.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused; leave pre-existing dead code alone unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with a verification check for each step. Strong success criteria let you loop independently; weak ones ("make it work") require constant clarification.

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
