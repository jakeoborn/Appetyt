"""Fix reservation-field bugs found by reservation-audit.py.

Group A — change reservation walk-in -> Resy (URL clearly shows Resy is accepted):
  1005 Via Carota, 1216 Bridges, 1461 Coqodaq

Group B — clear reserveUrl (URL slug is 'search', wrong link):
  1028 Dhamaka, 1737 The Eighty Six, 5144 Bourbon Steak

Group C — clear reserveUrl (Toast takeout URL, not a reservation; entries are walk-in):
  15588 Wholy Bagel - William Cannon, 15589 Wholy Bagel - Far West,
  15592 Rosen's Bagel Co - Burnet Road, 15593 Rosen's Bagel Co - Republic Square,
  15594 David Doughie's Bagelry, 15595 Rockstar Bagels

Tourist-attraction entries (Empire State, MET, Wrigley, etc.) keep their ticket URLs.
"""
import re

PATH = 'index.html'

with open(PATH, 'r', encoding='utf-8') as f:
    c = f.read()


def find_entry(text, target_id):
    pat = re.compile(r'\{[^{}]*?"id":' + str(target_id) + r'\b[^{}]{0,3000}\}', re.DOTALL)
    m = pat.search(text)
    return (m.start(), m.end()) if m else (None, None)


def patch(text, target_id, mutator):
    s, e = find_entry(text, target_id)
    if s is None:
        return text, False, 'not found'
    seg = text[s:e]
    new_seg, ok, msg = mutator(seg)
    if not ok:
        return text, False, msg
    return text[:s] + new_seg + text[e:], True, msg


def set_reservation_resy(seg):
    new = re.sub(r'"reservation":"walk-in"', '"reservation":"Resy"', seg, count=1)
    if new == seg:
        return seg, False, 'reservation field not walk-in'
    return new, True, 'set Resy'


def clear_reserve_url(seg):
    new = re.sub(r'"reserveUrl":"[^"]*"', '"reserveUrl":""', seg, count=1)
    if new == seg:
        return seg, False, 'reserveUrl already empty'
    return new, True, 'cleared'


# Group A
GROUP_A = [(1005, 'Via Carota'), (1216, 'Bridges'), (1461, 'Coqodaq')]
for tid, name in GROUP_A:
    c, ok, msg = patch(c, tid, set_reservation_resy)
    print(f'  A  id={tid:5}  {name:25s}  ok={ok}  {msg}')

# Group B
GROUP_B = [(1028, 'Dhamaka'), (1737, 'The Eighty Six'), (5144, 'Bourbon Steak')]
for tid, name in GROUP_B:
    c, ok, msg = patch(c, tid, clear_reserve_url)
    print(f'  B  id={tid:5}  {name:25s}  ok={ok}  {msg}')

# Group C
GROUP_C = [
    (15588, 'Wholy Bagel - William Cannon'),
    (15589, 'Wholy Bagel - Far West'),
    (15592, "Rosen's Bagel Co - Burnet Road"),
    (15593, "Rosen's Bagel Co - Republic Square"),
    (15594, "David Doughie's Bagelry"),
    (15595, 'Rockstar Bagels'),
]
for tid, name in GROUP_C:
    c, ok, msg = patch(c, tid, clear_reserve_url)
    print(f'  C  id={tid:5}  {name:35s}  ok={ok}  {msg}')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(c)
print('\nWROTE index.html')
