"""Wave 3: refresh Fond (id 76) hours, dishes, and description."""
import re

PATH = 'index.html'
with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'\{"id":76,', content)
if not m:
    raise SystemExit("id 76 not found")
start = m.start()
depth = 1
end = -1
for i in range(m.end(), len(content)):
    if content[i] == '{':
        depth += 1
    elif content[i] == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break

block = content[start:end]
nm = re.search(r'"name":"([^"]+)"', block).group(1)
if nm != "Fond":
    raise SystemExit(f"id 76 is {nm}, not Fond")

new_block = block

# 1. Hours - replace whole hours field via regex
new_block = re.sub(
    r'"hours":"[^"]*"',
    '"hours":"Mon 11am-2pm; Tue-Fri 11am-2pm and 5-9pm; closed Sat-Sun"',
    new_block,
    count=1,
)

# 2. Dishes - replace whole dishes array via regex
new_block = re.sub(
    r'"dishes":\[[^\]]*\]',
    '"dishes":["Detroit-Style Pizza (Brussel Crowe -- brussels sprouts and bacon)","Smoked Salmon Nicoise Salad","Chicky Parm","French-ish Ham and Salami Sandwich","House Breads"]',
    new_block,
    count=1,
)

# 3. Description - replace whole description field
new_desc_value = (
    "Chefs Jennie Kelley and Brandon Moore's fine-casual downtown spot at the base of Santander Tower -- "
    "French-inspired shared plates, Detroit-style pizzas, house breads, and a natural-wine program. "
    "An evolution of their pop-up Better Half Bistro."
)
new_block = re.sub(
    r'"description":"[^"]*"',
    '"description":"' + new_desc_value + '"',
    new_block,
    count=1,
)

# 4. Verified date
new_block = re.sub(r'"verified":"[^"]+"', '"verified":"2026-04-30"', new_block, count=1)

new_content = content[:start] + new_block + content[end:]

# Sanity
checks = [
    '"id":76,' in new_content,
    '"hours":"Mon 11am-2pm; Tue-Fri 11am-2pm and 5-9pm; closed Sat-Sun"' in new_content,
    'Brussel Crowe' in new_content,
    'Better Half Bistro' in new_content,
    '"verified":"2026-04-30"' in new_content,
]
print("Sanity checks:", checks)

if all(checks):
    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("WROTE -- Fond id=76 updated")
else:
    print("ABORTED -- sanity failed, NO WRITE")
