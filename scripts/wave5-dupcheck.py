"""Check for potential duplicates among wave5 brunch additions."""
import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

candidates = [
    "Cafe Monarch", "Rusconi", "thea", "théa", "insideOUT", "Henry Coronado", "Pony Room",
    "Aba", "Josephine House", "Al Biernat", "Chama Gaucha",
    "3 Arts Club", "Ba-Ba-Reeba", "Le Colonial", "Mott Street", "North Pond",
    "Obelix", "Robert", "Eiffel Tower", "Ocean Prime",
    "Elena", "Hilda", "Little Original Joe", "Village Pub", "Zuni",
    "Ammatoli", "Ammatolí",
    "MILA",
    "Carmine", "Lips NYC", "Little Owl", "Motek", "RH Rooftop", "Tavern on the Green", "Tony",
]

for q in candidates:
    matches = []
    pat = r'\"id\":(\d+)[^{}]{0,400}?\"name\":\"([^\"]*' + re.escape(q) + r'[^\"]*)\"'
    for m in re.finditer(pat, c, re.IGNORECASE):
        matches.append((m.group(1), m.group(2)))
    if matches:
        print(f'{q:25s} -> {matches[:8]}{"..." if len(matches) > 8 else ""}')
