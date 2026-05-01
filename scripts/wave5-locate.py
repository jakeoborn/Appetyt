"""Locate which CITY_DATA array contains each of these existing IDs."""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

cities = ['SLC','SEATTLE','DALLAS','NYC','LA','AUSTIN','SANANTONIO','HOUSTON',
          'CHICAGO','PHX','SD','MIAMI','CHARLOTTE','LV','SF']

ranges = {}
for city in cities:
    pat = re.compile(r'const ' + city + r'_DATA\s*=\s*\[')
    mm = pat.search(c)
    if not mm:
        continue
    start = mm.end() - 1
    depth = 0
    end = -1
    for i in range(start, len(c)):
        ch = c[i]
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                end = i
                break
    ranges[city] = (start, end)

# Locate which city each id-of-interest lives in
ids_to_locate = {
    3208: 'Cafe Monarch',
    9214: 'théa Mediterranean Rooftop',
    23: "Al Biernat's",
    5078: 'Zuni Café',
    4086: 'Mila Restaurant',
    4031: 'Motek (Miami existing)',
    7268: 'Le Colonial (Houston existing)',
    7620: 'Chama Gaucha (Houston existing)',
}

# Find positions of each id in the file
for target_id, label in ids_to_locate.items():
    # Find the FIRST occurrence of this id in the city-context (id followed by name field)
    pat = re.compile(r'\"id\":' + str(target_id) + r'\b[^{}]{0,400}?\"name\":\"([^\"]+)\"')
    for m in pat.finditer(c):
        pos = m.start()
        for city, (s, e) in ranges.items():
            if s <= pos <= e:
                # Show address too
                seg = c[m.start():m.start()+1500]
                addr_m = re.search(r'\"address\":\"([^\"]+)\"', seg)
                addr = addr_m.group(1) if addr_m else '(?)'
                tags_m = re.search(r'\"tags\":\[([^\]]*)\]', seg)
                has_brunch_award = 'OpenTable Top 100 Brunch 2026' in (tags_m.group(1) if tags_m else '')
                print(f'id={target_id:5d} city={city:10s} name={m.group(1)!r}')
                print(f'              address={addr}')
                print(f'              has_brunch_2026_tag={has_brunch_award}')
                break
