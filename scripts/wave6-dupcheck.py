"""Check for existing entries that would duplicate the wave6 candidates."""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Locate city array ranges so we know which array each match is in
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

candidates = {
    'NYC': [
        # Original 19 backlog
        'Marcel', "Lord's", 'Salt Cure', 'Luluc', 'Chez Ma Tante',
        'Clinton St', 'Golden Diner', 'Hen House', 'Commerce Inn',
        "Bubby", 'Cocina Consuelo', 'Golden Hof', 'Montagu', "Faicco",
        'Milano Market', "Di Palo", "Diso", "Pisillo", 'Agata',
        # New 19 list
        'Boia De', 'Mandolin', 'Walrus Rodeo', "Sunny", 'Surf Club',
        'Fooqs', 'Corteza', 'Gramps', 'Daniel', 'Lung Yai',
        'Joe', 'Sazon', 'Avra', 'Makoto', '2nd Avenue', 'Shelsky',
        'Go Catering', 'Fermento',
    ],
    'MIAMI': [
        'Pari Pari', 'Cotoa', 'La Natural', "Vecino", 'True Loaf',
    ],
    'AUSTIN': [
        'Wholy Bagel', 'Nervous Charlie', "Rosen", 'David Doughies', 'Rockstar',
    ],
}

for city, qs in candidates.items():
    if city not in ranges:
        continue
    s, e = ranges[city]
    seg = c[s:e]
    print(f'\n=== {city} ===')
    for q in qs:
        pat = re.compile(r'"id":(\d+)[^{}]{0,400}?"name":"([^"]*' + re.escape(q) + r'[^"]*)"', re.IGNORECASE)
        matches = list(pat.finditer(seg))
        if matches:
            print(f'  {q!r:30s} -> EXISTS:')
            for m in matches[:5]:
                addr_m = re.search(r'"address":"([^"]+)"', seg[m.start():m.start()+1500])
                addr = addr_m.group(1) if addr_m else '(?)'
                print(f'      id={m.group(1):5s}  {m.group(2)!r}')
                print(f'                 {addr}')
