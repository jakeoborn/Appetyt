"""Wave 4: city-aware match of OpenTable Top 100 Brunch 2026 list to existing data.
Outputs JSON with matches/non-matches; does NOT modify index.html.
"""
import re
import json

PATH = 'index.html'
with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Full Top 100 list with normalized name + city/state. Skip Hawaii, Boston, NJ, NC,
# Ohio, Philly, TN, DC, VA, OC, Tampa/Naples/Orlando, NOLA -- not Dim Hour cities.
# Keep: Phoenix, LA, SD, SF Bay Area, Miami, Atlanta, Chicago, LV, NYC, Texas cities.
top100 = [
    # Phoenix (3)
    {"name": "Cafe Monarch", "city": "Phoenix", "state": "AZ"},
    {"name": "Rusconi's American Kitchen", "city": "Phoenix", "state": "AZ"},
    {"name": "thea Mediterranean Rooftop", "city": "Phoenix", "state": "AZ", "alt": ["thea", "Theta Mediterranean", "Global Ambassador"]},
    # LA (1)
    {"name": "AMMATOLI", "city": "Los Angeles", "state": "CA"},
    # SD (5)
    {"name": "Cesarina", "city": "San Diego", "state": "CA"},
    {"name": "insideOUT", "city": "San Diego", "state": "CA"},
    {"name": "Mister A's", "city": "San Diego", "state": "CA"},
    {"name": "The Henry", "city": "Coronado", "state": "CA", "alt": ["Henry Coronado"]},
    {"name": "The Pony Room", "city": "San Diego", "state": "CA"},
    # SF (7)
    {"name": "Dalida", "city": "San Francisco", "state": "CA"},
    {"name": "Elena's", "city": "San Francisco", "state": "CA"},
    {"name": "Foreign Cinema", "city": "San Francisco", "state": "CA"},
    {"name": "Hilda and Jesse", "city": "San Francisco", "state": "CA", "alt": ["Hilda & Jesse"]},
    {"name": "Little Original Joe's", "city": "San Francisco", "state": "CA"},
    {"name": "The Village Pub", "city": "Woodside", "state": "CA"},
    {"name": "Zuni Cafe", "city": "San Francisco", "state": "CA"},
    # Miami (1)
    {"name": "MILA", "city": "Miami", "state": "FL"},
    # Atlanta (4) - check if supported
    {"name": "Blue Ridge Grill", "city": "Atlanta", "state": "GA"},
    {"name": "Poor Calvin's", "city": "Atlanta", "state": "GA"},
    {"name": "Rumi's Kitchen", "city": "Atlanta", "state": "GA"},
    {"name": "The Chastain", "city": "Atlanta", "state": "GA"},
    # Chicago (10)
    {"name": "3 Arts Club Cafe", "city": "Chicago", "state": "IL", "alt": ["RH Chicago"]},
    {"name": "Cafe Ba-Ba-Reeba", "city": "Chicago", "state": "IL"},
    {"name": "Daisies", "city": "Chicago", "state": "IL"},
    {"name": "Duck Duck Goat", "city": "Chicago", "state": "IL"},
    {"name": "Le Colonial", "city": "Chicago", "state": "IL"},
    {"name": "Mon Ami Gabi", "city": "Chicago", "state": "IL"},
    {"name": "Mott Street", "city": "Chicago", "state": "IL"},
    {"name": "North Pond", "city": "Chicago", "state": "IL"},
    {"name": "Obelix", "city": "Chicago", "state": "IL"},
    {"name": "Robert's Pizza", "city": "Chicago", "state": "IL", "alt": ["Robert's Pizza and Dough"]},
    # Las Vegas (3)
    {"name": "Eiffel Tower", "city": "Las Vegas", "state": "NV"},
    {"name": "Esther's Kitchen", "city": "Las Vegas", "state": "NV"},
    {"name": "Ocean Prime", "city": "Las Vegas", "state": "NV"},
    # NYC (12)
    {"name": "Cafe Luxembourg", "city": "New York", "state": "NY"},
    {"name": "Carmine's", "city": "New York", "state": "NY", "alt": ["Carmine's 44th"]},
    {"name": "Del Vino Vineyards", "city": "Northport", "state": "NY"},
    {"name": "Gallaghers Steakhouse", "city": "New York", "state": "NY"},
    {"name": "Lips NYC", "city": "New York", "state": "NY", "alt": ["Lips"]},
    {"name": "Little Owl", "city": "New York", "state": "NY"},
    {"name": "Motek", "city": "New York", "state": "NY", "alt": ["Motek NY"]},
    {"name": "RH Rooftop Restaurant", "city": "New York", "state": "NY", "alt": ["RH New York", "RH Rooftop"]},
    {"name": "Tavern on the Green", "city": "New York", "state": "NY"},
    {"name": "The Northport Hotel", "city": "Northport", "state": "NY"},
    {"name": "The Odeon", "city": "New York", "state": "NY"},
    {"name": "Tony's Di Napoli", "city": "New York", "state": "NY", "alt": ["Tony's Di Napoli Midtown"]},
    # Texas (11)
    {"name": "Aba", "city": "Austin", "state": "TX"},
    {"name": "Al Biernat's", "city": "Dallas", "state": "TX", "alt": ["Al Biernat's Oak Lawn"]},
    {"name": "Cafe Pacific", "city": "Dallas", "state": "TX"},
    {"name": "Chama Gaucha", "city": "San Antonio", "state": "TX"},
    {"name": "Hudson House", "city": "Dallas", "state": "TX", "alt": ["Hudson House Lakewood"]},
    {"name": "Josephine House", "city": "Austin", "state": "TX"},
    {"name": "Le Jardinier", "city": "Houston", "state": "TX"},
    {"name": "Maximo", "city": "Houston", "state": "TX"},
    {"name": "Perla's Seafood and Oyster Bar", "city": "Austin", "state": "TX", "alt": ["Perla's"]},
    {"name": "Perry's Steakhouse", "city": "Dallas", "state": "TX", "alt": ["Perry's Steakhouse Park District", "Perry's Park District"]},
    {"name": "Suerte", "city": "Austin", "state": "TX"},
]

# Build full record map: id -> {name, address, neighborhood, city_inferred}
records = []
for m in re.finditer(r'\{"id":(\d+),', content):
    rid = int(m.group(1))
    start = m.start()
    depth = 1
    end = -1
    for i in range(m.end(), min(m.end() + 8000, len(content))):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    if end < 0:
        continue
    blk = content[start:end]
    nm_m = re.search(r'"name":"([^"]+)"', blk)
    addr_m = re.search(r'"address":"([^"]*)"', blk)
    if not nm_m or not addr_m:
        continue
    records.append({
        "id": rid,
        "name": nm_m.group(1),
        "address": addr_m.group(1),
        "block_start": start,
        "block_end": end,
    })

print(f"Loaded {len(records)} records from index.html")


def normalize(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return s.strip()


def name_match(needle, hay):
    n = normalize(needle)
    h = normalize(hay)
    if not n or not h:
        return False
    # Strict: needle must be present as a word boundary in haystack OR vice-versa
    if n == h:
        return True
    # Whole-word containment
    if (" " + n + " ") in (" " + h + " "):
        return True
    if (" " + h + " ") in (" " + n + " "):
        return True
    return False


def city_match(target_city, target_state, address):
    a = address.lower()
    s = target_state.lower()
    c = target_city.lower()
    return c in a and (", " + s in a or ", " + s.upper() in address)


matches = []
not_found_supported = []

for t in top100:
    candidates = []
    names_to_try = [t["name"]] + t.get("alt", [])
    for rec in records:
        for n in names_to_try:
            if name_match(n, rec["name"]) and city_match(t["city"], t["state"], rec["address"]):
                candidates.append(rec)
                break
    if candidates:
        matches.append({
            "target": t,
            "match_id": candidates[0]["id"],
            "match_name": candidates[0]["name"],
            "match_address": candidates[0]["address"],
            "candidates_count": len(candidates),
        })
    else:
        not_found_supported.append(t)

print(f"\nMATCHES ({len(matches)}):")
for m in matches:
    t = m["target"]
    print(f"  id={m['match_id']:>6} | {m['match_name']:40s} | needle='{t['name']}' ({t['city']}, {t['state']})")

print(f"\nNOT FOUND in supported cities ({len(not_found_supported)}):")
for t in not_found_supported:
    print(f"  - {t['name']:40s} | {t['city']}, {t['state']}")

with open('scripts/wave4-matches.json', 'w', encoding='utf-8') as f:
    json.dump({"matches": matches, "not_found": not_found_supported}, f, indent=2)
print("\nSaved scripts/wave4-matches.json")
