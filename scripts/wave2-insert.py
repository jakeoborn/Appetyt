"""Wave 2: insert 13 missing restaurant entries (8 Dallas + 5 NYC Brooklyn Bagel)."""
import re
import json as J

PATH = 'index.html'
TODAY = "2026-04-30"

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()


def entry(d):
    """Build entry dict in canonical field order matching existing schema."""
    return {
        "id": d["id"],
        "name": d["name"],
        "address": d["address"],
        "lat": d["lat"],
        "lng": d["lng"],
        "phone": d.get("phone", ""),
        "website": d.get("website", ""),
        "instagram": d.get("instagram", ""),
        "reservation": d.get("reservation", ""),
        "reserveUrl": "",
        "hours": d.get("hours", ""),
        "cuisine": d["cuisine"],
        "price": d["price"],
        "description": d["description"],
        "dishes": d.get("dishes", []),
        "score": d["score"],
        "neighborhood": d["neighborhood"],
        "tags": d["tags"],
        "indicators": [],
        "bestOf": [],
        "photos": [],
        "photoUrl": "",
        "trending": False,
        "verified": TODAY,
    }


dallas = [
    entry({
        "id": 9246, "name": "Uptown Dumpling",
        "address": "18101 Preston Rd #204c, Dallas, TX 75252",
        "lat": 32.998824, "lng": -96.797614,
        "phone": "(214) 238-6058",
        "website": "https://www.uptowndumpling.com",
        "instagram": "@uptowndumpling",
        "reservation": "Resy", "hours": "",
        "cuisine": "Modern Chinese", "price": 3,
        "description": "Handcrafted dumpling and Jiangnan-cuisine spot from UNESCO Intangible Culinary Heritage Ambassador Chef Hao, debuting in North Dallas with Peking duck and Wagyu xiao long bao. The LA Times called it an edible cultural white paper.",
        "dishes": ["Uptown Signature Roast Duck", "Wagyu and Black Truffle Xiao Long Bao", "Pork Soup Dumplings (Xiao Long Bao)", "Uptown Spicy Fish", "Kung Pao Shrimp"],
        "score": 86, "neighborhood": "Far North Dallas",
        "tags": ["Modern Chinese", "Soup Dumplings", "Dumplings", "Date Night", "Trending", "Far North Dallas"],
    }),
    entry({
        "id": 9247, "name": "Beans & Brews (East Dallas)",
        "address": "7532 E Grand Ave Ste B110, Dallas, TX 75214",
        "lat": 32.8099493, "lng": -96.7292992,
        "phone": "(214) 765-2491",
        "website": "https://www.beansandbrews.com/coffee-shops/dallas/",
        "instagram": "@beansandbrews",
        "reservation": "", "hours": "Mon-Fri 6am-6pm; Sat-Sun 7am-6pm",
        "cuisine": "Coffee", "price": 2,
        "description": "Utah-born high-altitude coffee chain's first Dallas shop, on East Grand near White Rock Lake. Espresso, lattes, and cold brews from beans roasted in Salt Lake City.",
        "dishes": [],
        "score": 78, "neighborhood": "East Dallas",
        "tags": ["Coffee", "Cafe", "Casual", "Counter Service", "East Dallas"],
    }),
    entry({
        "id": 9248, "name": "Local",
        "address": "2936 Elm St, Dallas, TX 75226",
        "lat": 32.7850392, "lng": -96.7812737,
        "phone": "(214) 752-7500",
        "website": "https://www.localdallas.com",
        "instagram": "@local_dallas",
        "reservation": "Resy", "hours": "Tue-Sat 5pm-close",
        "cuisine": "Modern American", "price": 3,
        "description": "Long-running Deep Ellum farm-to-table mainstay, open since 2003, with seasonal menus driven by relationships with local cheesemakers, ranchers, and breweries. The simplest, most honest ingredients available.",
        "dishes": [],
        "score": 87, "neighborhood": "Deep Ellum",
        "tags": ["Modern American", "Farm-to-Table", "Date Night", "Local Favorite", "Iconic", "Deep Ellum"],
    }),
    entry({
        "id": 9249, "name": "Hong Dumpling House",
        "address": "1901 Royal Ln Ste 105, Dallas, TX 75229",
        "lat": 32.8960763, "lng": -96.9138113,
        "phone": "(469) 399-0149",
        "website": "https://www.hongdumplinghouse.com",
        "instagram": "@hong_mandu_dallas",
        "reservation": "", "hours": "Mon-Sat 11am-8pm; closed Sun",
        "cuisine": "Korean", "price": 1,
        "description": "Far North Dallas Korean mandu spot that went viral on TikTok for its handmade kimchi, shrimp, and pork dumplings. Counter service, freezer-bag takeout, generous portions.",
        "dishes": ["Steamed Pork Dumplings", "Fried Pork Dumplings", "Kimchi Dumplings", "Shrimp Dumplings", "Squid Dumplings"],
        "score": 84, "neighborhood": "Far North Dallas",
        "tags": ["Dumplings", "Hidden Gem", "Quick Bites", "Counter Service", "Local Favorite", "Far North Dallas"],
    }),
    entry({
        "id": 9250, "name": "Montlake Cut",
        "address": "8220 Westchester Dr Ste B, Dallas, TX 75225",
        "lat": 32.8625314, "lng": -96.8064576,
        "phone": "(214) 739-8220",
        "website": "http://www.mlcdallas.com",
        "instagram": "",
        "reservation": "Resy", "hours": "Mon-Thu 5-9pm; Fri-Sat 5-10pm; closed Sun",
        "cuisine": "Seafood", "price": 3,
        "description": "Nick Badovinus's homage to his native Pacific Northwest, tucked into a Preston Center corner. Oysters, chowder, Dungeness crab, and a much-praised cheeseburger; Dallas Observer Best Seafood.",
        "dishes": ["Dungeness Crab and Avocado with Thousand Island", "King Crab Fried Rice", "Baked Dungeness and Parm Dip", "Cheeseburger", "Oysters on the Half Shell", "Clam Chowder"],
        "score": 89, "neighborhood": "Preston Center",
        "tags": ["Seafood", "Date Night", "Modern American", "Local Favorite", "Preston Center"],
    }),
    entry({
        "id": 9251, "name": "Empa Mundo",
        "address": "3977 N Belt Line Rd, Irving, TX 75038",
        "lat": 32.8738602, "lng": -96.991719,
        "phone": "(972) 746-4516",
        "website": "https://www.empamundo.com",
        "instagram": "@empa_mundo",
        "reservation": "", "hours": "Mon-Sat 10:30am-9pm; Sun 11am-8pm",
        "cuisine": "Argentinian", "price": 1,
        "description": "Buenos Aires native Raul Gordon's Las Colinas empanada shop, open since 2010 -- Yelp's Best in Irving four years running. Twice-as-large baked empanadas, both savory and sweet, cooked to order.",
        "dishes": [],
        "score": 80, "neighborhood": "Las Colinas",
        "tags": ["Argentinian", "Empanadas", "Casual", "Hidden Gem", "Quick Bites", "Counter Service", "Las Colinas"],
    }),
    entry({
        "id": 9252, "name": "The Bagel Lady",
        "address": "316 S Goliad St Ste 201, Rockwall, TX 75087",
        "lat": 32.9288622, "lng": -96.4601915,
        "phone": "(469) 769-1745",
        "website": "https://www.thebagellady.com",
        "instagram": "@thebagelladyrockwall",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 2,
        "description": "Rockwall bagel shop from owner Revi Menasche, who started baking after relocating from Fort Lauderdale to bring traditional boil-then-bake Jewish-style bagels to the East Dallas suburbs.",
        "dishes": [],
        "score": 79, "neighborhood": "Rockwall",
        "tags": ["Bagels", "Bakery", "Cafe", "Casual", "Quick Bites", "Counter Service", "Rockwall"],
    }),
    entry({
        "id": 9253, "name": "Veracruz Cafe",
        "address": "408 N Bishop Ave #107, Dallas, TX 75208",
        "lat": 32.7481947, "lng": -96.8281831,
        "phone": "(214) 948-4746",
        "website": "https://veracruzdallas.com",
        "instagram": "@veracruzcafe",
        "reservation": "OpenTable", "hours": "Sun-Thu 11am-9pm; Fri-Sat 11am-10pm",
        "cuisine": "Mexican", "price": 2,
        "description": "Bishop Arts Mexican spot drawing on Veracruz's coastal-Mesoamerican kitchen -- Mayan, Huasteco, and Aztec influences alongside Tex-Mex staples and seafood preparations from the port of Veracruz.",
        "dishes": ["Blue Corn Enchiladas", "Xalapa-Style Chile Rellenos", "Fish Tacos", "Quesabirria Tacos"],
        "score": 83, "neighborhood": "Bishop Arts",
        "tags": ["Mexican", "Local Favorite", "Casual", "Brunch", "Bishop Arts"],
    }),
]

nyc = [
    entry({
        "id": 2043, "name": "Brooklyn Bagel & Coffee Co. (Greenwich Village)",
        "address": "63 E 8th St, New York, NY 10003",
        "lat": 40.7310464, "lng": -73.9931939,
        "phone": "(212) 477-3070",
        "website": "https://bkbagel.com",
        "instagram": "@bkbagelny",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 1,
        "description": "Corporate Manhattan outpost of the Astoria-born hand-rolled, kettle-boiled bagel shop. Food Network's Best Bagel in NYC; cream-cheese tubs piled high to order.",
        "dishes": [],
        "score": 84, "neighborhood": "Greenwich Village",
        "tags": ["Bagels", "Cafe", "Coffee", "Casual", "Counter Service", "Quick Bites", "Greenwich Village"],
    }),
    entry({
        "id": 2044, "name": "Brooklyn Bagel & Coffee Co. (Chelsea)",
        "address": "286 8th Ave, New York, NY 10001",
        "lat": 40.7461544, "lng": -73.9975859,
        "phone": "(212) 924-2824",
        "website": "https://bkbagel.com",
        "instagram": "@bkbagelny",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 1,
        "description": "Chelsea licensee of the Astoria-founded bagel chain, on 8th Ave between 24th and 25th. Hand-rolled, kettle-boiled bagels and over-stuffed schmear sandwiches.",
        "dishes": [],
        "score": 84, "neighborhood": "Chelsea",
        "tags": ["Bagels", "Cafe", "Coffee", "Casual", "Counter Service", "Quick Bites", "Chelsea"],
    }),
    entry({
        "id": 2045, "name": "Brooklyn Bagel & Coffee Co. (Astoria-Ditmars)",
        "address": "35-09 Ditmars Blvd, Astoria, NY 11105",
        "lat": 40.7747031, "lng": -73.9084483,
        "phone": "(718) 932-8280",
        "website": "https://bkbagel.com",
        "instagram": "@bkbagelny",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 1,
        "description": "Astoria-Ditmars licensee of the original Brooklyn Bagel -- the brand's home turf, where the boiled-then-baked bagels and stacked schmear sandwiches built the reputation.",
        "dishes": [],
        "score": 85, "neighborhood": "Astoria",
        "tags": ["Bagels", "Cafe", "Coffee", "Casual", "Counter Service", "Quick Bites", "Astoria"],
    }),
    entry({
        "id": 2046, "name": "Brooklyn Bagel & Coffee Co. (Astoria-Broadway)",
        "address": "3505 Broadway, Astoria, NY 11106",
        "lat": 40.760478, "lng": -73.9218592,
        "phone": "(718) 204-0141",
        "website": "https://bkbagel.com",
        "instagram": "@bkbagelny",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 1,
        "description": "Astoria-Broadway storefront of the long-running hand-rolled, kettle-boiled bagel chain. Cream-cheese sandwiches built behind the counter to order.",
        "dishes": [],
        "score": 84, "neighborhood": "Astoria",
        "tags": ["Bagels", "Cafe", "Coffee", "Casual", "Counter Service", "Quick Bites", "Astoria"],
    }),
    entry({
        "id": 2047, "name": "Brooklyn Bagel & Coffee Co. (Astoria-30th Ave)",
        "address": "36-14 30th Ave, Astoria, NY 11103",
        "lat": 40.7679615, "lng": -73.9236669,
        "phone": "(718) 777-1121",
        "website": "https://bkbagel.com",
        "instagram": "@bkbagelny",
        "reservation": "", "hours": "",
        "cuisine": "Bagels", "price": 1,
        "description": "30th Avenue Astoria licensee of the Brooklyn Bagel chain, between 36th and 37th. The same hand-rolled, kettle-boiled bagels made famous in the neighborhood.",
        "dishes": [],
        "score": 84, "neighborhood": "Astoria",
        "tags": ["Bagels", "Cafe", "Coffee", "Casual", "Counter Service", "Quick Bites", "Astoria"],
    }),
]


def insert_before_close(text, marker_re, new_objs):
    m = re.search(marker_re, text)
    if not m:
        raise RuntimeError(f"marker not found: {marker_re}")
    start = m.end() - 1  # position of [
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
        raise RuntimeError("close ] not found")
    blobs = [J.dumps(o, ensure_ascii=False, separators=(',', ':')) for o in new_objs]
    insertion = ',' + ','.join(blobs)
    return text[:close] + insertion + text[close:]


before_count = content.count('"id":')
new_content = insert_before_close(content, r'(?:const|let|var)\s+DALLAS_DATA\s*=\s*\[', dallas)
new_content = insert_before_close(new_content, r'(?:const|let|var)\s+NYC_DATA\s*=\s*\[', nyc)
after_count = new_content.count('"id":')

# Verify each new id is present exactly once more than before
all_new_ids = [d["id"] for d in dallas] + [n["id"] for n in nyc]
ok = True
for nid in all_new_ids:
    pat = '"id":' + str(nid) + ','
    cnt = new_content.count(pat) - content.count(pat)
    if cnt != 1:
        print(f"  FAIL: id {nid} delta={cnt} (expected 1)")
        ok = False
    else:
        print(f"  OK   id {nid}")

print(f"id-field count: before={before_count} after={after_count} delta={after_count-before_count} (expected 13)")

if ok and (after_count - before_count) == 13:
    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("WROTE index.html")
else:
    print("ABORTED -- sanity failed, NO WRITE")
