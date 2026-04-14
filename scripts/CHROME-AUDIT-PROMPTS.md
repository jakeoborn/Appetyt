# Dim Hour Chrome Audit Prompts

Copy and paste these prompts into your local `claude --chrome` session.
Run them one at a time. Each builds on the previous.

---

## Phase 1: Automated Link Check (run first, no Chrome needed)

```
Run node scripts/audit-links.js and show me the results. Fix any broken links you find in the DALLAS_DATA array in index.html.
```

---

## Phase 2: Data Accuracy Audit (Chrome)

### Batch audit — top restaurants first

```
Open the file index.html and extract the top 20 restaurants by score from DALLAS_DATA. For each one, Google "[restaurant name] Dallas" and verify: (1) Are they still open? (2) Is the address correct? (3) Are the hours accurate? (4) Is the phone number right? (5) Is the cuisine description accurate? Create a report of any discrepancies found. Work through them 5 at a time.
```

### Coming Soon restaurants

```
Open index.html and find all restaurants with indicator "coming-soon" in DALLAS_DATA. For each one, Google "[restaurant name] Dallas opening date" and verify: (1) Are they actually opening soon? (2) Is the opening date in _csOpenDates accurate? (3) Have any already opened? Report any that need updating.
```

---

## Phase 3: Reservation Platform Verification (Chrome)

```
Open index.html and find all restaurants that have a reservation field (Resy, Tock, OpenTable, etc) in DALLAS_DATA. Pick the first 20 and for each one: open their website or Google "[restaurant name] reservations" to verify which booking platform they actually use. Report any mismatches where our data says one platform but they actually use another.
```

---

## Phase 4: Visual QA (Chrome)

### All tabs

```
Open dimhour.com in Chrome. Take a screenshot of each main tab: Guide, Top 50, Local, Feed, Travel. For each tab, note any visual issues: broken layouts, overlapping text, missing gold borders, cards not rendering, blank sections.
```

### Restaurant detail view

```
Open dimhour.com, tap on the #1 ranked restaurant, and screenshot the full detail view. Check: score displays correctly, cuisine/neighborhood/price shows, reservation widget works, action buttons (Favorite/Visited/Save) are visible, Add to List button appears, notes section loads, tags display.
```

### Coming Soon cards

```
Open dimhour.com, go to the Local tab, scroll to the Coming Soon section. Screenshot the cards. Verify: countdown badges show correct days, gold borders display, View Restaurant button is visible, TBD cards show "Date TBD" badge.
```

### Filter chips

```
Open dimhour.com on the Guide tab. Screenshot the filter area. Click a few filter chips (cuisine, neighborhood, combo) and verify they filter correctly. Check that gold borders show on all chip types.
```

---

## Phase 5: User Flow Tests (Chrome)

### Search flow

```
Open dimhour.com. Type "date night" in the search bar and press Enter. Screenshot the results. Then type "happy hour" and press Enter. Then type "sushi" and press Enter. Verify results are relevant and clickable.
```

### Add to List flow

```
Open dimhour.com. Create a custom list: go to Feed tab, find the lists section, create a new list called "Test Audit List". Then go back to Guide tab, open any restaurant, scroll down to the "Add to List" button, tap it, and add it to "Test Audit List". Then go back to Feed and verify the restaurant appears in the list.
```

### Reservation flow

```
Open dimhour.com. Open a restaurant that uses Resy. In the reservation widget, change the date and time, then click "Find a Table on Resy". Verify it opens Resy with the correct restaurant. Go back and try one that uses OpenTable. Verify it opens OpenTable correctly.
```

---

## Phase 6: Full Data Sweep (Chrome, long-running)

```
Open index.html and extract ALL restaurants from DALLAS_DATA. Working in batches of 10, Google each restaurant name + "Dallas" and check if it's still open. Create a list of any that appear permanently closed, moved, or renamed. Save results to scripts/audit-report-closures.json.
```

---

## Tips

- If a prompt times out, ask Claude to "continue where you left off"
- For large batches, say "work through the next 10" to resume
- Say "save your findings so far" periodically so nothing is lost
- The link checker script (Phase 1) is fastest — run it first
