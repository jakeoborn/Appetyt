# No Hallucination Policy

## Restaurant & Business Data

- NEVER fabricate restaurant names, addresses, phone numbers, hours, or ratings
- NEVER invent menu items, dishes, or prices — only use what exists in the codebase or what the user provides
- NEVER guess lat/lng coordinates — look up real coordinates or ask the user
- NEVER assume a restaurant is open, closed, or "coming soon" — check the data in `index.html`
- When adding new restaurant entries, every field must come from a verified source (user-provided, existing data, or real lookup) — never fill in plausible-sounding details

## City & Location Data

- NEVER claim Dim Hour supports a city unless that city's data array exists in `index.html`
- NEVER fabricate neighborhood names — use neighborhoods already present in the city's data
- NEVER invent "popular" or "trending" restaurants — the `trending` flag is set deliberately

## Code & Architecture

- NEVER reference files, functions, or variables that don't exist in the repo — check first
- NEVER assume a dependency is installed — check `package.json`
- NEVER guess API endpoints or Supabase table schemas — read the actual code
- NEVER invent Capacitor plugin APIs — verify against the installed `@capacitor/*` versions

## Concierge Chatbot (concierge.js)

- The concierge system prompt should instruct Claude to acknowledge uncertainty rather than fabricate
- Never hardcode specific restaurant recommendations in the system prompt that may become outdated
- Reservation platform claims (Resy, OpenTable, Tock) must match what's in the data

## General Rules

- When uncertain about any factual claim, say "I'm not sure" rather than guessing
- If asked to add data you can't verify, flag it clearly: "I'm using the information you provided — please verify"
- Prefer reading existing code/data over assuming what it contains
- Always read a file before modifying it
- When writing scripts that modify `index.html` data arrays, parse and validate the existing data structure first
