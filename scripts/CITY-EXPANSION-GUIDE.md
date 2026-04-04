# City Expansion Guide — 500 Restaurants Per City

Run these prompts in `claude --chrome` session. Work one city at a time.
After each batch, commit and push so you don't lose progress.

---

## Target Distribution (matching Dallas)

| Metric | Target % | Per 500 |
|--------|---------|---------|
| Score 90-100 | 16% | ~80 |
| Score 80-89 | 79% | ~395 |
| Score 75-79 | 5% | ~25 |
| Price $ | 19% | ~95 |
| Price $$ | 46% | ~230 |
| Price $$$ | 26% | ~130 |
| Price $$$$ | 9% | ~45 |
| Walk-in | 57% | ~285 |
| OpenTable | 21% | ~105 |
| Resy | 15% | ~75 |
| Tock/Other | 7% | ~35 |

### Cuisine Mix Target (~500 total)
- American/New American: ~60
- Mexican/Latin: ~40
- Italian: ~35
- Japanese/Sushi/Ramen: ~30
- Steakhouse: ~20
- BBQ: ~20
- Seafood: ~15
- French: ~15
- Chinese: ~15
- Thai/Vietnamese/Asian: ~20
- Indian: ~10
- Mediterranean/Greek: ~15
- Pizza: ~15
- Burgers: ~15
- Coffee/Bakery/Cafe: ~25
- Bars/Cocktail Bars: ~25
- Brewery/Taproom: ~15
- Brunch spots: ~15
- Fast Casual (bowls, salads, etc): ~20
- Food Trucks/Stands: ~10
- Entertainment (bowling, golf, cinema): ~10
- Desserts/Ice Cream: ~10
- Southern/Soul Food: ~10
- Korean: ~10
- Tex-Mex/Regional: ~15
- Other/Specialty: ~30

### Tag Mix (restaurants can have multiple)
- Local Favorites: ~55%
- Casual: ~55%
- Date Night: ~47%
- Cocktails: ~40%
- Late Night: ~30%
- Happy Hour: ~30%
- Patio: ~30%
- Brunch: ~20%
- Fine Dining: ~18%
- Celebrations: ~13%
- Critics Pick: ~12%
- Live Music: ~11%
- Dog Friendly: ~9%
- Viral: ~9%
- Awards: ~7%
- Eat & Play: ~6%
- Exclusive: ~6%
- Hole in the Wall: ~5%
- Healthy: ~4%
- Rooftop: ~4%

---

## City-Specific Info

### NYC (ID range: 1001-1999, currently 55)
**Neighborhoods:** Manhattan (SoHo, West Village, East Village, Greenwich Village, Chelsea, Flatiron, NoMad, Midtown, Upper East Side, Upper West Side, Lower East Side, Tribeca, NoHo, Nolita, Hell's Kitchen, Financial District, Harlem, Washington Heights, Chinatown, Little Italy, Koreatown, Murray Hill, Gramercy), Brooklyn (Williamsburg, DUMBO, Park Slope, Bushwick, Crown Heights, Greenpoint, Fort Greene, Bed-Stuy, Cobble Hill, Carroll Gardens, Prospect Heights, Red Hook, Bay Ridge), Queens (Astoria, Flushing, Jackson Heights, Long Island City, Forest Hills), Bronx (Arthur Ave, Mott Haven), Staten Island

### Austin (ID range: 2001-2999, currently 55)
**Neighborhoods:** Downtown, East Austin, South Congress (SoCo), South Lamar, Rainey Street, 6th Street, West 6th, Clarksville, Zilker, Barton Springs, Mueller, Domain, North Loop, Hyde Park, Campus/UT, Manor Road, East Cesar Chavez, Holly, St. Elmo, South 1st, Anderson Lane, Burnet Road, Bouldin Creek, Travis Heights, Westlake, Bee Cave, Cedar Park, Round Rock, Pflugerville

### Chicago (ID range: 8001-8999, currently 25)
**Neighborhoods:** River North, West Loop, Lincoln Park, Wicker Park, Logan Square, Pilsen, Chinatown, Andersonville, Bucktown, Old Town, Gold Coast, Streeterville, South Loop, Ukrainian Village, Humboldt Park, Ravenswood, Lakeview, Lincoln Square, Bridgeport, Hyde Park, Uptown, Rogers Park, Albany Park, Avondale, Fulton Market

### LA (ID range: 3001-3999, currently 29)
**Neighborhoods:** Hollywood, West Hollywood, Silver Lake, Echo Park, Los Feliz, Downtown LA (DTLA), Arts District, Koreatown, Little Tokyo, Beverly Hills, Santa Monica, Venice, Culver City, Highland Park, Eagle Rock, Pasadena, Glendale, Burbank, Manhattan Beach, Hermosa Beach, Mar Vista, Sawtelle, Westwood, Century City, Fairfax, Mid-Wilshire, Thai Town, Atwater Village, El Segundo, Malibu, Brentwood, Pacific Palisades

### Seattle (ID range: 4001-4999, currently 25)
**Neighborhoods:** Capitol Hill, Pike Place, Ballard, Fremont, Queen Anne, Georgetown, Columbia City, Beacon Hill, International District, Pioneer Square, South Lake Union, Wallingford, University District, Ravenna, Green Lake, Phinney Ridge, Madison Park, West Seattle, White Center, Bellevue, Kirkland, Redmond, Bothell

### San Antonio (ID range: 5001-5999, currently 47)
**Neighborhoods:** River Walk, Pearl District, Southtown/King William, Downtown, Alamo Heights, Monte Vista, Stone Oak, The Rim, La Cantera, Olmos Park, Tobin Hill, Government Hill, Beacon Hill, Dignowity Hill, Deco District, Medical Center, Helotes, Boerne, New Braunfels, Bulverde

### Houston (ID range: 6001-6999, currently 25)
**Neighborhoods:** Montrose, Heights, Midtown, Downtown, River Oaks, West University, Rice Village, Upper Kirby, Galleria, Memorial, EaDo (East Downtown), Third Ward, Museum District, Washington Ave, Spring Branch, Katy, Sugar Land, Bellaire, Chinatown (Bellaire Blvd), Clear Lake, The Woodlands, Cypress, Pearland, Energy Corridor

---

## Chrome Session Prompts

### STEP 0: Setup (run once per city)

```
Read index.html and tell me the current count and ID range for [CITY]_DATA. Also check what the highest existing ID is so we know where to start adding new ones.
```

### STEP 1: Fine Dining & Award Winners (~45 restaurants, score 90-98, $$$$-$$$)

```
I need to add restaurants to [CITY]_DATA in index.html. We currently have [X] and need 500.

Google "best fine dining [city] 2025", "Michelin star [city]", "James Beard [city] restaurants", and "best tasting menu [city]".

Find 45 real restaurants that are fine dining / award-winning / tasting menu level. For each one, get the real name, address, phone, hours, website, Instagram, cuisine, neighborhood, and reservation platform (check if they use Resy, Tock, or OpenTable).

Format each as a JSON object matching this exact schema:
{"id":NEXT_ID,"name":"","phone":"","cuisine":"","neighborhood":"","score":XX,"price":4,"tags":["Fine Dining","Date Night","Celebrations","Exclusive"],"indicators":[],"hh":"","reservation":"Resy","awards":"","description":"","dishes":["","",""],"address":"","hours":"","lat":0,"lng":0,"bestOf":[],"busyness":null,"waitTime":null,"popularTimes":null,"lastUpdated":null,"trending":false,"group":"","instagram":"","website":"","suburb":false,"reserveUrl":"","menuUrl":"","res_tier":5}

Scores should range 90-98. Price mostly $$$$ with some $$$. All should have reservations (Resy/Tock/OpenTable).

Add them to [CITY]_DATA in index.html. Start at ID [NEXT_ID].
After adding, copy index.html to index and netlify/functions/index.
```

### STEP 2: Upscale Casual & Date Night (~80 restaurants, score 84-92, $$$)

```
Continue expanding [CITY]_DATA. Google "best date night restaurants [city]", "best upscale casual [city]", "best cocktail bars [city]", and "best new restaurants [city] 2025".

Find 80 real restaurants that are upscale-casual, great for dates, cocktail-forward, or trendy new openings. Mix of: Italian, Japanese, seafood, steakhouse, wine bars, cocktail bars, modern American, French bistro, etc.

Same JSON format. Scores 84-92. Price $$$. Tags should include mix of: Date Night, Cocktails, Local Favorites, Patio, Late Night, Happy Hour. Reservation: mix of Resy, OpenTable, and walk-in.

Start at the next available ID after what you just added.
```

### STEP 3: Solid Neighborhood Spots (~120 restaurants, score 80-88, $$)

```
Continue expanding [CITY]_DATA. Google "best [neighborhood] restaurants [city]" for each major neighborhood listed below. Also search "best casual restaurants [city]", "best lunch spots [city]", "hidden gems [city] food".

Neighborhoods to cover: [PASTE FROM CITY-SPECIFIC LIST ABOVE]

Find 120 real neighborhood restaurants — the solid everyday places locals love. Mix of: Mexican, Thai, Vietnamese, Chinese, Indian, pizza, burgers, gastropubs, delis, brunch spots, etc.

Scores 80-88. Price $$. Tags: mostly Local Favorites, Casual, some Happy Hour, Patio, Brunch, Dog Friendly. Reservation: mostly walk-in with some OpenTable.
```

### STEP 4: Cheap Eats & Fast Casual (~95 restaurants, score 75-85, $)

```
Continue expanding [CITY]_DATA. Google "best cheap eats [city]", "best food trucks [city]", "best tacos [city]", "best pizza slice [city]", "best breakfast [city] under $15", "best fast casual [city]", "best street food [city]".

Find 95 real budget-friendly spots: taco stands, food trucks, fast casual chains (local ones), diners, bagel shops, donut shops, pho spots, dumpling spots, bodega sandwiches, halal carts, etc.

Scores 75-85. Price $. Tags: Casual, Local Favorites, Hole in the Wall, some Viral. Reservation: all walk-in. Include indicators like hole-in-wall, vegetarian where applicable.
```

### STEP 5: Bars, Breweries & Entertainment (~60 restaurants, score 78-86, $-$$)

```
Continue expanding [CITY]_DATA. Google "best bars [city]", "best breweries [city]", "best dive bars [city]", "best rooftop bars [city]", "best live music venues [city]", "best sports bars [city]", "best comedy clubs [city]", "best entertainment venues [city]".

Find 60 real bars, breweries, dive bars, cocktail lounges, live music venues, entertainment spots. Mix of upscale cocktail bars ($$$) and dive bars/breweries ($-$$).

Scores 78-86. Tags: Late Night, Cocktails, Live Music, Eat & Play, Dog Friendly, Sports. Reservation: mostly walk-in.
```

### STEP 6: Coffee, Bakeries & Brunch (~50 restaurants, score 78-88, $-$$)

```
Continue expanding [CITY]_DATA. Google "best coffee shops [city]", "best bakeries [city]", "best brunch [city]", "best breakfast [city]", "best dessert [city]".

Find 50 real coffee shops, bakeries, brunch spots, dessert places. The morning/weekend crowd favorites.

Scores 78-88. Price $-$$. Tags: Brunch, Bakery/Coffee, Casual, Local Favorites, Patio. Reservation: walk-in.
```

### STEP 7: Specialty & Regional (~50 restaurants, score 80-90, $$-$$$)

```
Continue expanding [CITY]_DATA. Google "best [city-specific cuisine] [city]" — for example NYC: "best pizza NYC", "best bagels NYC", "best dim sum NYC". Austin: "best BBQ Austin", "best breakfast tacos Austin". Chicago: "best deep dish Chicago", "best hot dog Chicago".

Also search: "best vegetarian [city]", "best vegan [city]", "best halal [city]", "best kosher [city]".

Find 50 restaurants that represent the city's unique food identity and dietary-specific spots.

Scores 80-90. Price $$-$$$. Include indicators: vegetarian, halal, etc. where applicable.
```

### STEP 8: Verify & Audit

```
Run: GOOGLE_PLACES_KEY=your_key node scripts/audit-google-places.js --city=[CITY] --fix

This will verify all the new restaurants against Google Places API and auto-fix any address/phone/coordinate issues.

Then check the count:
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const i=h.indexOf('const [CITY]_DATA=');const s=h.indexOf('[',i);let d=0,e=s;for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}console.log(JSON.parse(h.substring(s,e)).length+' restaurants')"

Target: 500. If under, repeat the step that's most lacking.
```

### STEP 9: Commit & Move to Next City

```
Copy index.html to index and netlify/functions/index. Then:
git add index.html index netlify/functions/index
git commit -m "Expand [CITY] restaurant data to 500 — full dining scene coverage"
git push -u origin claude/fix-local-tab-scroll-V7wuv
```

---

## Order of Cities (by current gap)

1. **NYC** (55 → 500) — biggest market, most critical
2. **LA** (29 → 500)
3. **Chicago** (25 → 500)
4. **Houston** (25 → 500)
5. **Seattle** (25 → 500)
6. **Austin** (55 → 500)
7. **San Antonio** (47 → 500)

---

## Quick Reference: ID Ranges

| City | ID Start | ID End |
|------|----------|--------|
| Dallas | 1 | 999 |
| NYC | 1001 | 1999 |
| Austin | 2001 | 2999 |
| LA | 3001 | 3999 |
| Seattle | 4001 | 4999 |
| San Antonio | 5001 | 5999 |
| Houston | 6001 | 6999 |
| Chicago | 8001 | 8999 |
