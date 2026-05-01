"""Wave 4: tag the 18 matched records with OpenTable Top 100 Brunch 2026.

Disambiguates duplicate IDs (5006, 5019, 236, 5124 etc) by matching BOTH id and
address from the wave4-matches.json. For each target:
  - if "awards" is empty -> set to AWARD_TEXT
  - else if AWARD_TEXT not already present -> append " - " + AWARD_TEXT
  - bump "verified" to today
Atomic write: all 18 verified before single file write.
"""
import re
import json
from datetime import date

PATH = 'index.html'
AWARD_TEXT = 'OpenTable Top 100 Brunch 2026'
SEP = ' · '  # middle dot used elsewhere in dataset
TODAY = date.today().isoformat()

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

with open('scripts/wave4-matches.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

matches = data['matches']
print(f"Tagging {len(matches)} matches with: {AWARD_TEXT}")


def find_block(content, target_id, target_address):
    """Find the specific record block matching both id and address."""
    pat = re.compile(r'\{"id":' + str(target_id) + r',')
    for m in pat.finditer(content):
        start = m.start()
        depth = 1
        end = -1
        for i in range(m.end(), min(m.end() + 20000, len(content))):
            ch = content[i]
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end < 0:
            continue
        blk = content[start:end]
        addr_m = re.search(r'"address":"([^"]*)"', blk)
        if addr_m and addr_m.group(1) == target_address:
            return start, end, blk
    return None


# Build all updates first (atomic): list of (start, end, new_block)
updates = []
seen_ranges = set()

for mt in matches:
    rid = mt['match_id']
    addr = mt['match_address']
    found = find_block(content, rid, addr)
    if not found:
        raise SystemExit(f"NOT FOUND: id={rid} addr={addr}")
    start, end, blk = found
    if (start, end) in seen_ranges:
        raise SystemExit(f"DUPLICATE BLOCK: id={rid} addr={addr}")
    seen_ranges.add((start, end))

    # Read existing awards
    aw_m = re.search(r'"awards":"([^"]*)"', blk)
    if not aw_m:
        raise SystemExit(f"NO awards field in id={rid} {addr}")
    existing = aw_m.group(1)
    if AWARD_TEXT in existing:
        new_aw = existing
        skip = True
    elif existing.strip() == '':
        new_aw = AWARD_TEXT
        skip = False
    else:
        new_aw = existing + SEP + AWARD_TEXT
        skip = False

    new_blk = blk
    if not skip:
        new_blk = re.sub(
            r'"awards":"[^"]*"',
            '"awards":"' + new_aw + '"',
            new_blk,
            count=1,
        )
    # Bump verified date if field exists
    if re.search(r'"verified":"[^"]*"', new_blk):
        new_blk = re.sub(
            r'"verified":"[^"]*"',
            '"verified":"' + TODAY + '"',
            new_blk,
            count=1,
        )
    updates.append((start, end, new_blk, mt['match_name'], rid, existing, new_aw))

# Apply updates from end to start (preserve offsets)
updates_sorted = sorted(updates, key=lambda u: u[0], reverse=True)
new_content = content
for start, end, new_blk, _, _, _, _ in updates_sorted:
    new_content = new_content[:start] + new_blk + new_content[end:]

# Sanity: every match's award text now appears at least len(matches) times
count = new_content.count(AWARD_TEXT)
print(f"AWARD_TEXT appears {count} times in new content (expected >= {len(matches)})")
if count < len(matches):
    raise SystemExit("ABORTED: award count below expected")

# Print summary
for _, _, _, nm, rid, old, new in sorted(updates, key=lambda u: u[4]):
    status = 'ALREADY' if old == new else ('NEW' if old.strip() == '' else 'APPENDED')
    print(f"  [{status:8s}] id={rid:>6} | {nm:35s} | {old[:50]:50s} -> {new[:80]}")

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f"\nWROTE {PATH} -- {len(matches)} entries tagged")
