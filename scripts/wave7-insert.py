"""Wave 7: 9 Miami + 4 NYC (Montagu's Gusto + Salt's Cure x3) + 1 LA (Corteza at Sendero)."""
import json as J
import re

PATH = 'index.html'
TODAY = '2026-04-30'
NEW_ID_START = 15596

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

before_count = content.count('"id":')
existing_ids = set(int(m.group(1)) for m in re.finditer(r'"id":(\d+)\b', content))
print(f'before: {before_count} id refs, max={max(existing_ids)}')

# Load Miami batch
with open('scripts/wave7-miami.json', 'r', encoding='utf-8') as f:
    miami_recs = J.load(f)
miami_recs = [r for r in miami_recs if not r.get('_skip')]

# Manual NYC + LA entries (verified via WebFetch this session)
nyc_recs = [
    {
        'name': "Montagu's Gusto",
        'address': '645 2nd Avenue, New York, NY 10016',
        'lat': 40.7457025, 'lng': -73.9755056,
        'phone': '(917) 261-4129',
        'website': 'https://mgustonyc.com/',
        'instagram': '@montagusgusto_',
        'reservation': 'walk-in',
        'reserveUrl': '',
        'hours': 'Mon-Thu 9:30am-9pm; Fri 9:30am-8pm; Sat 9:30am-5pm',
        'cuisine': 'Italian Deli',
        'price': 1,
        'description': 'Murray Hill global deli serving fresh Italian-leaning sandwiches and prepared foods alongside breakfast, lunch, and dinner menus.',
        'dishes': ['The Parm', 'Focaccia King', "Frank Sinatra's Style", 'Pancho Villa', 'Viva la Gusto'],
        'neighborhood': 'Murray Hill',
        'city_array': 'NYC',
    },
    {
        'name': "Breakfast by Salt's Cure (West Village)",
        'address': '27 1/2 Morton St, New York, NY 10014',
        'lat': 40.7311187, 'lng': -74.0044708,
        'phone': '',
        'website': 'https://www.breakfastbysaltscure.com/',
        'instagram': '@breakfastbysaltscure',
        'reservation': 'walk-in',
        'reserveUrl': '',
        'hours': 'Tue-Sun 8am-3pm',
        'cuisine': 'Breakfast',
        'price': 2,
        'description': "All-day breakfast outpost of Los Angeles' Salt's Cure, known for its signature oatmeal griddle cake and weekend lines on Morton Street in the West Village.",
        'dishes': ['Oatmeal Griddle Cake'],
        'neighborhood': 'West Village',
        'city_array': 'NYC',
    },
    {
        'name': "Breakfast by Salt's Cure (Prospect Heights)",
        'address': '581 Vanderbilt Ave, Brooklyn, NY 11238',
        'lat': 40.6803229, 'lng': -73.9676249,
        'phone': '',
        'website': 'https://www.breakfastbysaltscure.com/',
        'instagram': '@breakfastbysaltscure',
        'reservation': 'walk-in',
        'reserveUrl': '',
        'hours': 'Wed-Sun 8am-3pm',
        'cuisine': 'Breakfast',
        'price': 2,
        'description': "Brooklyn outpost of Los Angeles' Salt's Cure on Vanderbilt Avenue, serving the chain's signature oatmeal griddle cake and brunch staples.",
        'dishes': ['Oatmeal Griddle Cake'],
        'neighborhood': 'Prospect Heights',
        'city_array': 'NYC',
    },
    {
        'name': "Breakfast by Salt's Cure (Carroll Gardens)",
        'address': '368 Court St, Brooklyn, NY 11231',
        'lat': 40.6816684, 'lng': -73.99639,
        'phone': '',
        'website': 'https://www.breakfastbysaltscure.com/',
        'instagram': '@breakfastbysaltscure',
        'reservation': 'walk-in',
        'reserveUrl': '',
        'hours': 'Wed-Fri 8am-2pm; Sat-Sun 8am-3pm',
        'cuisine': 'Breakfast',
        'price': 2,
        'description': "Carroll Gardens spot on Court Street serving the LA-rooted Salt's Cure all-day breakfast menu and oatmeal griddle cake.",
        'dishes': ['Oatmeal Griddle Cake'],
        'neighborhood': 'Carroll Gardens',
        'city_array': 'NYC',
    },
]

la_recs = [
    {
        'name': 'Corteza at Sendero',
        'address': '900 W Olympic Blvd, Los Angeles, CA 90015',
        'lat': 34.0452978, 'lng': -118.2669619,
        'phone': '(213) 743-8824',
        'website': 'https://www.senderola.com/corteza',
        'instagram': '',
        'reservation': 'Resy',
        'reserveUrl': '',
        'hours': 'Tue-Sat 5pm-midnight; Sun-Mon closed',
        'cuisine': 'Latin American',
        'price': 3,
        'description': "Latin American coastal-market restaurant on the 24th floor of the Ritz-Carlton at L.A. LIVE, with skyline views, Mexican and Peruvian ceviche, and live music on Friday nights.",
        'dishes': ['Mexican Ceviche', 'Peruvian Ceviche', 'Seafood Stew', 'Arepas', 'Empanadas'],
        'neighborhood': 'Downtown',
        'city_array': 'LA',
    },
]

all_recs = miami_recs + nyc_recs + la_recs

# Assign sequential ids
next_id = NEW_ID_START
for r in all_recs:
    while next_id in existing_ids:
        next_id += 1
    r['_id'] = next_id
    existing_ids.add(next_id)
    next_id += 1


def normalize_price(v):
    if isinstance(v, int):
        return max(1, min(4, v))
    if isinstance(v, str):
        s = v.strip().replace('$', '')
        if s.isdigit():
            return max(1, min(4, int(s)))
        if v.count('$') in (1, 2, 3, 4):
            return v.count('$')
    return 2


def normalize_score(v, default=80):
    if isinstance(v, int) and 60 <= v <= 99:
        return v
    return default


def build_entry(r):
    cuisine = r.get('cuisine', '') or ''
    neighborhood = r.get('neighborhood', '') or ''
    base_tags = [t for t in [cuisine, neighborhood] if t]
    tags = r.get('tags') if isinstance(r.get('tags'), list) and r['tags'] else base_tags
    return {
        'id': r['_id'],
        'name': r['name'],
        'address': r.get('address', '') or '',
        'lat': r.get('lat', 0),
        'lng': r.get('lng', 0),
        'phone': r.get('phone', '') or '',
        'website': r.get('website', '') or '',
        'instagram': r.get('instagram', '') or '',
        'reservation': r.get('reservation', '') or '',
        'reserveUrl': r.get('reserveUrl', '') or '',
        'hours': r.get('hours', '') or '',
        'cuisine': cuisine,
        'price': normalize_price(r.get('price')),
        'description': r.get('description', '') or '',
        'dishes': r.get('dishes') if isinstance(r.get('dishes'), list) else [],
        'score': normalize_score(r.get('score')),
        'neighborhood': neighborhood,
        'tags': tags,
        'awards': r.get('awards', '') or '',
        'indicators': [],
        'bestOf': [],
        'photos': [],
        'photoUrl': '',
        'trending': False,
        'verified': TODAY,
    }


by_city = {'NYC': [], 'LA': [], 'MIAMI': []}
for r in all_recs:
    by_city[r.get('city_array', 'MIAMI')].append(build_entry(r))

for city, objs in by_city.items():
    print(f'  {city}: {len(objs)}')


def insert_into_array(text, marker_re, new_objs):
    if not new_objs:
        return text
    m = re.search(marker_re, text)
    if not m:
        raise RuntimeError(f'marker not found: {marker_re}')
    start = m.end() - 1
    depth = 0
    close = -1
    for i in range(start, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                close = i
                break
    if close < 0:
        raise RuntimeError('close ] not found')
    blobs = [J.dumps(o, ensure_ascii=False, separators=(',', ':')) for o in new_objs]
    return text[:close] + ',' + ','.join(blobs) + text[close:]


content = insert_into_array(content, r'(?:const|let|var)\s+MIAMI_DATA\s*=\s*\[', by_city['MIAMI'])
content = insert_into_array(content, r'(?:const|let|var)\s+NYC_DATA\s*=\s*\[', by_city['NYC'])
content = insert_into_array(content, r'(?:const|let|var)\s+LA_DATA\s*=\s*\[', by_city['LA'])

after_count = content.count('"id":')
delta = after_count - before_count
expected = len(all_recs)
print(f'\nid-field count: before={before_count} after={after_count} delta={delta} (expected {expected})')
if delta != expected:
    raise SystemExit('ABORT: count mismatch')

for r in all_recs:
    nid = r['_id']
    n = len(re.findall(r'"id":' + str(nid) + r'\b', content))
    if n != 1:
        raise SystemExit(f'ABORT: id {nid} ({r["name"]}) appears {n} times')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('WROTE index.html')

print('\n=== inserted ===')
for r in all_recs:
    print(f'  {r["_id"]:6d}  [{r.get("city_array","?"):5s}]  {r["name"]}')
