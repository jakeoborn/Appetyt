"""Wave 6: Insert verified NYC/Miami/Austin entries from agent JSON outputs.

Sources:
  scripts/wave6a-nyc-backlog.json   (16 verified, 2 skipped, 2 manually dropped here)
  scripts/wave6b-nyc-newlist.json   (9 verified, 11 skipped)
  scripts/wave6c-miami-austin.json  (10 verified, 1 skipped)

Manual drops from 6a (insufficient evidence — flagged for user review):
  - "Felice Montague": agent admits no exact match for user's "montagus gusto"
  - "Salt + Charcoal":  user wrote "salt cure" — name doesn't match

Patches:
  - "Avra 33rd & Ninth" lat/lng (was 0,0): geocoded to 40.7520435, -73.998095

IDs assigned sequentially starting at NEW_ID_START=15561.
"""
import json as J
import re

PATH = 'index.html'
TODAY = '2026-04-30'
NEW_ID_START = 15561

DROP_NAMES = {'Felice Montague', 'Salt + Charcoal'}

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

before_count = content.count('"id":')
existing_ids = set(int(m.group(1)) for m in re.finditer(r'"id":(\d+)\b', content))
print(f'existing id refs: {before_count}, unique ids: {len(existing_ids)}, max: {max(existing_ids)}')


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return J.load(f)


a = load('scripts/wave6a-nyc-backlog.json')
b = load('scripts/wave6b-nyc-newlist.json')
c = load('scripts/wave6c-miami-austin.json')


def keep(rec):
    if rec.get('_skip'):
        return False
    if rec.get('name') in DROP_NAMES:
        return False
    return True


a_keep = [r for r in a if keep(r)]
b_keep = [r for r in b if keep(r)]
c_keep = [r for r in c if keep(r)]

# Patch missing lat/lng for Avra 33rd & Ninth
for r in b_keep:
    if r.get('name', '').startswith('Avra 33rd'):
        if not r.get('lat'):
            r['lat'] = 40.7520435
            r['lng'] = -73.998095
            print(f'patched lat/lng for {r["name"]}')

print(f'\n6a NYC backlog inserts:   {len(a_keep)}')
print(f'6b NYC new-list inserts:  {len(b_keep)}')
print(f'6c Miami+Austin inserts:  {len(c_keep)}')
print(f'TOTAL:                    {len(a_keep)+len(b_keep)+len(c_keep)}')

# Assign sequential ids
all_records = a_keep + b_keep + c_keep
next_id = NEW_ID_START
for r in all_records:
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


def normalize_score(v, default=78):
    if isinstance(v, int) and 60 <= v <= 99:
        return v
    return default


def build_entry(r, city):
    # Fall back gracefully on optional fields
    cuisine = r.get('cuisine', '') or ''
    neighborhood = r.get('neighborhood', '') or ''
    base_tags = []
    if cuisine:
        base_tags.append(cuisine)
    if neighborhood:
        base_tags.append(neighborhood)
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


# Group records by target array
nyc_objs = [build_entry(r, 'NYC') for r in (a_keep + b_keep)]
miami_objs = [build_entry(r, 'MIAMI') for r in c_keep if r.get('city_array') == 'MIAMI']
austin_objs = [build_entry(r, 'AUSTIN') for r in c_keep if r.get('city_array') == 'AUSTIN']

print(f'\nNYC objs:    {len(nyc_objs)}')
print(f'MIAMI objs:  {len(miami_objs)}')
print(f'AUSTIN objs: {len(austin_objs)}')

assert len(nyc_objs) + len(miami_objs) + len(austin_objs) == len(all_records), 'count mismatch'


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
    insertion = ',' + ','.join(blobs)
    return text[:close] + insertion + text[close:]


content = insert_into_array(content, r'(?:const|let|var)\s+NYC_DATA\s*=\s*\[', nyc_objs)
content = insert_into_array(content, r'(?:const|let|var)\s+MIAMI_DATA\s*=\s*\[', miami_objs)
content = insert_into_array(content, r'(?:const|let|var)\s+AUSTIN_DATA\s*=\s*\[', austin_objs)

after_count = content.count('"id":')
delta = after_count - before_count
expected = len(all_records)
print(f'\nid-field count: before={before_count} after={after_count} delta={delta} (expected {expected})')
if delta != expected:
    raise SystemExit('ABORT: id count delta does not match insert count')

# Verify each new id appears exactly once
for r in all_records:
    nid = r['_id']
    n = len(re.findall(r'"id":' + str(nid) + r'\b', content))
    if n != 1:
        raise SystemExit(f'ABORT: new id {nid} ({r["name"]}) appears {n} times')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('WROTE index.html')

# Final summary
print('\n=== inserted ids ===')
for r in all_records:
    print(f'  {r["_id"]:6d}  {r["name"]}')
