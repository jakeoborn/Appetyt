"""Audit reservation field consistency across all city data.

Checks performed:
1. reserveUrl slug doesn't match name (most likely to catch wrong-link bugs)
2. reservation field is non-empty but reserveUrl is empty (medium severity)
3. reserveUrl is set but reservation field says walk-in or empty (high severity — like Copper 29 was reported)

Output: scripts/reservation-audit.json with categorized findings.
"""
import re
import json
import unicodedata

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()


def norm(s):
    """Normalize for comparison: lower, strip accents, only alnum."""
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'[^a-z0-9]', '', s.lower())


# Walk every entry across all city arrays. We rely on top-level ID positions —
# scan entire file for `{...}` objects that contain "id":, "name":, "reservation":.
# Use a coarse approach: split by '"id":' boundaries and reconstruct.
entries = []
# Find all id field positions then capture surrounding entry object via brace match
for m in re.finditer(r'"id":(\d+)\b', c):
    rid = int(m.group(1))
    # Walk left to find {
    i = m.start()
    while i > 0 and c[i] != '{':
        i -= 1
    if c[i] != '{':
        continue
    # Walk right with brace depth
    depth = 0
    j = i
    while j < len(c):
        if c[j] == '{':
            depth += 1
        elif c[j] == '}':
            depth -= 1
            if depth == 0:
                break
        j += 1
    if j >= len(c):
        continue
    seg = c[i:j+1]
    # Only consider entries with name+reservation (restaurant entries, not auxiliary)
    if '"name":' not in seg or '"reservation":' not in seg:
        continue
    name_m = re.search(r'"name":"([^"]*)"', seg)
    addr_m = re.search(r'"address":"([^"]*)"', seg)
    res_m = re.search(r'"reservation":"([^"]*)"', seg)
    url_m = re.search(r'"reserveUrl":"([^"]*)"', seg)
    web_m = re.search(r'"website":"([^"]*)"', seg)
    if not (name_m and res_m):
        continue
    entries.append({
        'id': rid,
        'name': name_m.group(1),
        'address': addr_m.group(1) if addr_m else '',
        'reservation': res_m.group(1) if res_m else '',
        'reserveUrl': url_m.group(1) if url_m else '',
        'website': web_m.group(1) if web_m else '',
    })

print(f'Total entries scanned: {len(entries)}')

# --- Bucket the findings ---
slug_mismatch = []
res_set_url_empty = []
url_set_res_walkin = []

for e in entries:
    name_norm = norm(e['name'])
    url = e['reserveUrl']
    res = e['reservation']

    # Bucket 3: reserveUrl set but reservation says walk-in or empty
    if url and res in ('walk-in', '', 'none'):
        url_set_res_walkin.append(e)

    # Bucket 1: name vs URL slug mismatch — only if URL is set and is Resy/OpenTable/Tock
    if url:
        m = re.search(r'(?:resy\.com|opentable\.com|exploretock\.com|sevenrooms\.com)/[^?#]*', url)
        if m:
            url_path = m.group(0).lower()
            slug = url_path.split('/')[-1]
            slug_norm = norm(slug)
            # Strip common chain-ish suffixes/prefixes
            slug_short = slug_norm[:20]
            name_short = name_norm[:20]
            # Mismatch: slug doesn't share a 6-char run with name
            shared = False
            for k in range(min(len(slug_norm), 30) - 5):
                if slug_norm[k:k+6] in name_norm:
                    shared = True
                    break
            if not shared:
                # Heuristic: also check inverse direction
                for k in range(min(len(name_norm), 30) - 5):
                    if name_norm[k:k+6] in slug_norm:
                        shared = True
                        break
            if not shared and len(name_norm) >= 6 and len(slug_norm) >= 6:
                slug_mismatch.append({
                    **e,
                    '_slug': slug,
                })

    # Bucket 2: reservation set to platform but reserveUrl empty (info — not a bug per se)
    if res in ('Resy', 'OpenTable', 'Tock', 'SevenRooms') and not url:
        res_set_url_empty.append(e)

print(f'\n=== High-severity (URL set, reservation=walk-in/empty): {len(url_set_res_walkin)} ===')
for e in url_set_res_walkin[:30]:
    print(f"  id={e['id']:5}  res={e['reservation']!r:10}  name={e['name'][:40]!r:42}  url={e['reserveUrl'][:70]}")
if len(url_set_res_walkin) > 30:
    print(f'  ... {len(url_set_res_walkin)-30} more')

print(f'\n=== Slug vs name mismatch: {len(slug_mismatch)} ===')
for e in slug_mismatch[:50]:
    print(f"  id={e['id']:5}  name={e['name'][:35]!r:37}  slug={e['_slug'][:50]!r}")
if len(slug_mismatch) > 50:
    print(f'  ... {len(slug_mismatch)-50} more')

print(f'\n=== Reservation platform set but reserveUrl empty (info): {len(res_set_url_empty)} ===')
print(f'  (info only — these have a platform listed but no direct booking URL)')

# Write full findings to JSON
out = {
    'url_set_res_walkin': url_set_res_walkin,
    'slug_mismatch': slug_mismatch,
    'res_set_url_empty_count': len(res_set_url_empty),
    'res_set_url_empty_sample': res_set_url_empty[:20],
}
with open('scripts/reservation-audit.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f'\nFull findings: scripts/reservation-audit.json')
