"""Renumber wave5 brunch insert IDs that collided with existing entries.

Strategy: for each (old_id, expected_name) pair, find ALL occurrences of
`"id":<old_id>` in index.html, identify the one whose entry contains the
expected_name (this is the new insert), and rewrite its id to a fresh value.

Sanity checks:
- Exactly 1 occurrence per (old_id, expected_name) match must exist before patch
- After patch, the old_id collision count decreases by 1, new_id appears once
"""
import re

PATH = 'index.html'

# (old_id, expected_name_substring) -> new_id
# Order matters: assign new ids sequentially starting at 15546.
NEW_ID_START = 15546
RENAMES = [
    (15525, 'insideOUT'),
    (15526, 'Henry Coronado'),
    (15527, 'Pony Room'),
    (12580, 'Eiffel Tower Restaurant'),
    (12581, 'Ocean Prime Las Vegas'),
    (5167,  "Elena's Mexican Restaurant"),
    (5168,  'Hilda and Jesse'),
    (5169,  "Little Original Joe's"),
    (5170,  'The Village Pub'),
    (2048,  "Carmine's"),
    (2049,  'Lips NYC'),
    (2050,  'Little Owl'),
    (2051,  'RH Rooftop'),
    (2052,  'Tavern on the Green'),
    (2053,  "Tony's Di Napoli"),
]

with open(PATH, 'r', encoding='utf-8') as f:
    c = f.read()

# Capture initial id count
initial_id_count = len(re.findall(r'"id":\d+', c))

new_id = NEW_ID_START
for (old_id, name_sub) in RENAMES:
    # Find every entry whose id is old_id, capture the name
    pat = re.compile(r'"id":' + str(old_id) + r'\b[^{}]{0,400}?"name":"([^"]+)"')
    matches = list(pat.finditer(c))
    targets = [m for m in matches if name_sub in m.group(1)]
    if len(targets) != 1:
        print(f'ABORT: old_id={old_id} name_sub={name_sub!r} matched {len(targets)} entries (expected 1). all names: {[m.group(1) for m in matches]}')
        raise SystemExit(1)
    m = targets[0]
    # Replace just the id portion within this match
    span_start = m.start()
    # The id appears at exactly the start of the match
    old_str = '"id":' + str(old_id)
    if c[span_start:span_start+len(old_str)] != old_str:
        print(f'ABORT: id position mismatch at {span_start} for old_id={old_id}')
        raise SystemExit(1)
    new_str = '"id":' + str(new_id)
    c = c[:span_start] + new_str + c[span_start+len(old_str):]
    print(f'  {old_id:6d} -> {new_id:6d}  ({m.group(1)})')
    new_id += 1

final_id_count = len(re.findall(r'"id":\d+', c))
print(f'\nid-field count: before={initial_id_count} after={final_id_count} (should be equal)')
if initial_id_count != final_id_count:
    print('ABORT: id count changed unexpectedly')
    raise SystemExit(1)

# Verify no collisions remain among the new ids
for nid in range(NEW_ID_START, new_id):
    n = len(re.findall(r'"id":' + str(nid) + r'\b', c))
    if n != 1:
        print(f'ABORT: new id {nid} appears {n} times (expected 1)')
        raise SystemExit(1)

# Verify each old colliding id now appears exactly once (the original kept it)
for (old_id, _) in RENAMES:
    n = len(re.findall(r'"id":' + str(old_id) + r'\b', c))
    if n != 1:
        print(f'ABORT: old id {old_id} appears {n} times after fix (expected 1)')
        raise SystemExit(1)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(c)
print('WROTE index.html')
