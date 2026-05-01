"""Wave 5: OpenTable Top 100 Brunch 2026 follow-on.

1. UPDATE Copper Common (id 11048): walk-in -> Resy + reserveUrl
2. TAG 4 existing entries with 'OpenTable Top 100 Brunch 2026' award
3. INSERT 27 new verified brunch entries

Deferred for separate work: Motek NYC (no verified address), Ammatoli (Long Beach
geography), 4 Atlanta restaurants (city not supported), 2 Long Island NY entries.
"""
import json as J
import re

PATH = 'index.html'
TODAY = '2026-04-30'
AWARD = 'OpenTable Top 100 Brunch 2026'

with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()


def entry(d):
    return {
        'id': d['id'],
        'name': d['name'],
        'address': d['address'],
        'lat': d['lat'],
        'lng': d['lng'],
        'phone': d.get('phone', ''),
        'website': d.get('website', ''),
        'instagram': d.get('instagram', ''),
        'reservation': d.get('reservation', ''),
        'reserveUrl': d.get('reserveUrl', ''),
        'hours': d.get('hours', ''),
        'cuisine': d['cuisine'],
        'price': d['price'],
        'description': d['description'],
        'dishes': d.get('dishes', []),
        'score': d['score'],
        'neighborhood': d['neighborhood'],
        'tags': d['tags'],
        'awards': d.get('awards', AWARD),
        'indicators': [],
        'bestOf': [],
        'photos': [],
        'photoUrl': '',
        'trending': False,
        'verified': TODAY,
    }


# ---------- INSERTS ----------

phx = [
    entry({
        'id': 3520, 'name': "Rusconi's American Kitchen",
        'address': '10637 N Tatum Blvd Suite 101B, Phoenix, AZ 85028',
        'lat': 33.5825, 'lng': -111.9796,
        'phone': '(480) 483-0009',
        'website': 'http://rusconiskitchen.com',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/rusconis-american-kitchen',
        'hours': 'Brunch Sun 10am-2pm; Dinner Tue-Thu & Sun 5-9pm, Fri-Sat 5-10pm',
        'cuisine': 'Contemporary American', 'price': 3,
        'description': "Chef Michael Rusconi's neighborhood American kitchen in North Phoenix, celebrated for creative comfort food and a welcoming Sunday brunch. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 81, 'neighborhood': 'North Phoenix',
        'tags': ['Contemporary American', 'Brunch', AWARD, 'Chef-Driven', 'North Phoenix'],
    }),
    entry({
        'id': 3521, 'name': 'Thea Mediterranean Rooftop',
        'address': '4360 E Camelback Rd, Phoenix, AZ 85018',
        'lat': 33.5094911, 'lng': -111.9883067,
        'phone': '(480) 697-6201',
        'website': 'https://globalambassadorhotel.com/restaurants/thea',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/r/thea-phoenix?restref=1294264',
        'hours': 'Mon-Thu 4-10pm; Fri 4-10:45pm; Sat 12-10:45pm; Sun 12-10pm',
        'cuisine': 'Mediterranean', 'price': 3,
        'description': "Rooftop Mediterranean restaurant atop the Global Ambassador Hotel in the Arcadia neighborhood, offering sweeping Camelback Mountain views. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 86, 'neighborhood': 'Arcadia',
        'tags': ['Mediterranean', 'Brunch', AWARD, 'Rooftop', 'Hotel Restaurant', 'Views', 'Arcadia'],
    }),
]

sd = [
    entry({
        'id': 15525, 'name': 'insideOUT',
        'address': '1642 University Ave, San Diego, CA 92103',
        'lat': 32.7484962, 'lng': -117.1487968,
        'phone': '(619) 888-8623',
        'website': 'https://www.insideoutsd.com',
        'instagram': '@insideoutsd',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/insideout-san-diego?restref=1011736',
        'hours': 'Brunch Sat-Sun 10am-5pm; Dinner Tue-Thu 4-10:30pm, Fri-Sat 4pm-12am; closed Mon',
        'cuisine': 'California-Mediterranean', 'price': 3,
        'description': "Chef Johnny Duran's California-Mediterranean kitchen in Hillcrest with a dynamic brunch program rooted in fresh, seasonal ingredients. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 81, 'neighborhood': 'Hillcrest',
        'tags': ['California-Mediterranean', 'Brunch', AWARD, 'Chef-Driven', 'Hillcrest'],
    }),
    entry({
        'id': 15526, 'name': 'The Henry Coronado',
        'address': '1031 Orange Ave, Coronado, CA 92118',
        'lat': 32.685012, 'lng': -117.17932,
        'website': 'https://www.thehenryrestaurant.com',
        'instagram': '@thehenryrestaurant',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/the-henry-coronado',
        'hours': '',
        'cuisine': 'American', 'price': 3,
        'description': "Fox Restaurant Concepts' all-day American brasserie on Coronado Island's main thoroughfare, known for approachable comfort fare and lively weekend brunch. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 80, 'neighborhood': 'Coronado',
        'tags': ['American', 'Brunch', AWARD, 'All-Day Dining', 'Coronado'],
    }),
    entry({
        'id': 15527, 'name': 'The Pony Room',
        'address': '5921 Valencia Cir, Rancho Santa Fe, CA 92067',
        'lat': 32.9911414, 'lng': -117.1862517,
        'phone': '(858) 759-6246',
        'website': 'https://www.ranchovalencia.com/dining/the-pony-room',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/the-pony-room',
        'hours': 'Breakfast 7-11am; Lunch 11am-2pm; Dinner 4-9pm',
        'cuisine': 'Coastal Ranch', 'price': 4,
        'description': "Rustic-luxe dining room at Rancho Valencia Resort, serving coastal ranch cuisine with farm-fresh ingredients amid horse country surroundings. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 86, 'neighborhood': 'Rancho Santa Fe',
        'tags': ['Coastal Ranch', 'Brunch', AWARD, 'Resort Dining', 'Upscale', 'Rancho Santa Fe'],
    }),
]

austin = [
    entry({
        'id': 5700, 'name': 'Aba',
        'address': '1011 S Congress Ave Bldg 2 Suite 180, Austin, TX 78704',
        'lat': 30.2545, 'lng': -97.747756,
        'phone': '(737) 273-0199',
        'website': 'https://www.abarestaurants.com/austin',
        'instagram': '@abarestaurant',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/aba-austin',
        'hours': 'Brunch Sat-Sun 10am-3pm; Lunch Mon-Fri 11am-4pm; Dinner Mon-Thu 4-10pm, Fri 4-11pm, Sat 3-11pm, Sun 3-9pm',
        'cuisine': 'Mediterranean', 'price': 3,
        'description': "Lettuce Entertain You's sun-drenched Mediterranean restaurant on South Congress, led by Chef CJ Jacobson, celebrated for vibrant mezze and a lively weekend brunch. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 87, 'neighborhood': 'South Congress',
        'tags': ['Mediterranean', 'Brunch', AWARD, 'Mezze', 'South Congress'],
    }),
    entry({
        'id': 5701, 'name': 'Josephine House',
        'address': '1601 Waterston Ave, Austin, TX 78703',
        'lat': 30.2805739, 'lng': -97.7590331,
        'phone': '(512) 477-5584',
        'website': 'http://josephineofaustin.com',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/josephine-house',
        'hours': 'Daily 9am-2:30pm',
        'cuisine': 'American', 'price': 2,
        'description': "Beloved Clarksville cottage serving all-day breakfast and brunch in a charming historic home with garden seating. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 84, 'neighborhood': 'Clarksville',
        'tags': ['American', 'Brunch', AWARD, 'Breakfast', 'Patio', 'Clarksville'],
    }),
]

sanantonio = [
    entry({
        'id': 6086, 'name': 'Chama Gaucha Brazilian Steakhouse',
        'address': '18318 Sonterra Place, San Antonio, TX 78258',
        'lat': 29.6101222, 'lng': -98.4977818,
        'phone': '(210) 564-9400',
        'website': 'https://www.chamagaucha.com/san-antonio',
        'instagram': '@chamagaucha',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/chama-gaucha-san-antonio',
        'hours': 'Lunch Mon-Fri 11am-3:15pm; Dinner Mon-Thu 3:15-9:30pm, Fri 3:15-10pm, Sat 1:30-10pm, Sun 12-8:30pm',
        'cuisine': 'Brazilian Steakhouse', 'price': 4,
        'description': "Brazilian churrascaria in Stone Oak since 2008, featuring tableside carved meats, an expansive gourmet salad area, and Sunday brunch. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 83, 'neighborhood': 'Stone Oak',
        'tags': ['Brazilian Steakhouse', 'Brunch', AWARD, 'Churrasco', 'Stone Oak'],
    }),
]

chicago = [
    entry({
        'id': 15539, 'name': '3 Arts Club Cafe',
        'address': '1300 N Dearborn Pkwy, Chicago, IL 60610',
        'lat': 41.9059085, 'lng': -87.6304864,
        'phone': '(312) 475-9116',
        'website': 'https://rh.com/chicago/restaurants/3-arts-club-cafe/',
        'reservation': 'OpenTable',
        'hours': 'Mon-Sat 10am-8pm; Sun 11am-6pm',
        'cuisine': 'American', 'price': 3,
        'description': "3 Arts Club Cafe is set within the dramatic atrium of RH Chicago, a landmark 1914 beaux-arts building in the Gold Coast. Guests dine beneath a soaring skylit ceiling surrounded by fountains, sculpture, and lush greenery. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 82, 'neighborhood': 'Gold Coast',
        'tags': ['American', 'Brunch', AWARD, 'Date Night', 'Gold Coast'],
    }),
    entry({
        'id': 15540, 'name': 'Cafe Ba-Ba-Reeba!',
        'address': '2024 N Halsted St, Chicago, IL 60614',
        'lat': 41.9189763, 'lng': -87.6487203,
        'phone': '(773) 935-5000',
        'website': 'https://www.cafebabareeba.com/',
        'instagram': '@cafebabareeba',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/cafe-ba-ba-reeba-reservations-chicago',
        'hours': 'Mon-Thu 4-9pm; Fri 11:30am-11pm; Sat 10am-11pm; Sun 10am-9pm',
        'cuisine': 'Spanish', 'price': 2,
        'description': "Chicago's original tapas bar since 1985, serving authentic Spanish cuisine in a lively Lincoln Park setting. The menu is built for sharing, featuring pintxos, classic tapas, and paella. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Paella Mixta', 'Pulpo a la Gallega', 'Beef Tenderloin Toro', 'Patatas Bravas', 'Jamon Iberico de Bellota'],
        'score': 80, 'neighborhood': 'Lincoln Park',
        'tags': ['Spanish', 'Tapas', 'Brunch', AWARD, 'Group Dining', 'Lincoln Park'],
    }),
    entry({
        'id': 15541, 'name': 'Le Colonial (Chicago)',
        'address': '57 E Oak St, Chicago, IL 60611',
        'lat': 41.9006352, 'lng': -87.6260613,
        'phone': '(312) 255-0088',
        'website': 'https://www.lecolonial.com/chicago/',
        'instagram': '@lecolonial_restaurants',
        'reservation': 'OpenTable',
        'hours': 'Mon-Thu 12pm-10pm; Fri 12pm-11pm; Sat 11:30am-11pm; Sun 11:30am-10pm',
        'cuisine': 'Vietnamese', 'price': 3,
        'description': "Perched on Oak Street in Chicago's Gold Coast, Le Colonial exudes timeless sophistication with a palm-filled dining room and elegant bar. Executive Chef Quoc Luong features traditional Vietnamese recipes alongside contemporary dishes. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 84, 'neighborhood': 'Gold Coast',
        'tags': ['Vietnamese', 'French', 'Brunch', AWARD, 'Date Night', 'Gold Coast'],
    }),
    entry({
        'id': 15542, 'name': 'Mott Street',
        'address': '1401 N Ashland Ave, Chicago, IL 60622',
        'lat': 41.9071316, 'lng': -87.6672878,
        'phone': '(773) 687-9977',
        'website': 'https://www.mottstreetchicago.com/',
        'instagram': '@eatmottst',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/mott-street-reservations-chicago?restref=211456',
        'hours': 'Mon-Thu 5-9pm; Fri 5-10pm; Sat 10am-2pm, 4:30-10pm; Sun 10am-2pm, 4:30-9pm',
        'cuisine': 'Asian American', 'price': 2,
        'description': "Chef Edward Kim's Asian American kitchen in Wicker Park, drawing inspiration from Asian night markets and his Korean-American childhood. Pairs Eastern cooking techniques with Chicago ingredients for umami-laden, texturally exciting dishes. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 83, 'neighborhood': 'Wicker Park',
        'tags': ['Asian American', 'Korean', 'Brunch', AWARD, 'Michelin Bib Gourmand', 'Wicker Park'],
    }),
    entry({
        'id': 15543, 'name': 'North Pond',
        'address': '2610 N Cannon Dr, Chicago, IL 60614',
        'lat': 41.929797, 'lng': -87.6375066,
        'phone': '(773) 477-5845',
        'website': 'https://northpondrestaurant.com/',
        'instagram': '@northpondchi',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/north-pond-reservations-chicago?rtype=ism&restref=2796',
        'hours': 'Dinner Thu-Sun from 5:30pm; Brunch Sun from 10:30am',
        'cuisine': 'New American', 'price': 3,
        'description': "North Pond is a celebrated farm-to-table restaurant within Lincoln Park, overlooking the North Pond nature sanctuary. Seven-course tasting menu for dinner and three-course prix-fixe brunch on Sundays. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 87, 'neighborhood': 'Lincoln Park',
        'tags': ['New American', 'Farm-to-Table', 'Brunch', AWARD, 'Fine Dining', 'Lincoln Park'],
    }),
    entry({
        'id': 15544, 'name': 'Obelix',
        'address': '700 N Sedgwick St, Chicago, IL 60654',
        'lat': 41.8949375, 'lng': -87.6387433,
        'website': 'https://www.obelixchicago.com/',
        'instagram': '@obelixchicago',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/r/obelix-reservations-chicago?restref=1242919',
        'hours': 'Mon 11:30am-2:30pm; Thu-Fri 11:30am-2:30pm, 5-10pm; Sat-Sun 10:30am-2pm, 5-10pm; closed Tue-Wed',
        'cuisine': 'French', 'price': 3,
        'description': "Obelix is a French brasserie in River North, offering classic bistro cooking rooted in the traditions of French fine dining. Brunch is served Saturday and Sunday alongside lunch and dinner service, with a dedicated to-go pastry program. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 83, 'neighborhood': 'River North',
        'tags': ['French', 'Brasserie', 'Brunch', AWARD, 'Date Night', 'River North'],
    }),
    entry({
        'id': 15545, 'name': "Robert's Pizza and Dough Company",
        'address': '465 N McClurg Ct, Chicago, IL 60611',
        'lat': 41.8906336, 'lng': -87.617051,
        'phone': '(312) 265-1328',
        'website': 'https://robertspizza.com/',
        'instagram': '@robertspizzaco',
        'reservation': 'OpenTable',
        'hours': 'Mon-Thu 12pm-9pm; Fri 12pm-10pm; Sat 11am-10pm; Sun 11am-9pm; Brunch Sat-Sun 11am-2pm',
        'cuisine': 'Pizza', 'price': 2,
        'description': "Streeterville pizzeria celebrated for its brick-oven thin-crust artisan pizza, the result of a twenty-year quest to perfect the dough recipe. Sits along the Ogden Slip riverwalk with a patio and dock. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 78, 'neighborhood': 'Streeterville',
        'tags': ['Pizza', 'Brunch', AWARD, 'Waterfront', 'Streeterville'],
    }),
]

lv = [
    entry({
        'id': 12580, 'name': 'Eiffel Tower Restaurant',
        'address': '3655 S Las Vegas Blvd, Las Vegas, NV 89109',
        'lat': 36.112508, 'lng': -115.17222,
        'phone': '(702) 948-6937',
        'website': 'https://www.eiffeltowerrestaurant.com/',
        'instagram': '@eiffeltowerrestaurant',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/eiffel-tower',
        'hours': 'Brunch Fri-Sun 9am-1:30pm; Dinner daily 5-10pm',
        'cuisine': 'French', 'price': 4,
        'description': "Atop a half-scale replica of the Eiffel Tower at Paris Las Vegas, with sweeping views of the Bellagio Fountains and the Strip. Chef Bernard Joho's updated classic French cuisine is served as a three-course prix-fixe brunch ($59/person) Friday-Sunday. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['French Toast a la Creme Brulee', 'Lobster Eggs Benedict', 'Creme Brulee', 'Escargots a la Bourguignonne'],
        'score': 88, 'neighborhood': 'The Strip',
        'tags': ['French', 'Brunch', AWARD, 'Fine Dining', 'Views', 'The Strip'],
    }),
    entry({
        'id': 12581, 'name': 'Ocean Prime Las Vegas',
        'address': '3716 S Las Vegas Blvd 4th Floor, Las Vegas, NV 89158',
        'lat': 36.1088632, 'lng': -115.1741869,
        'phone': '(702) 529-4770',
        'website': 'https://www.ocean-prime.com/locations-menus/las-vegas/',
        'instagram': '@oceanprimelasvegas',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/r/ocean-prime-las-vegas-reservations-las-vegas?restref=1283131',
        'hours': 'Brunch Sat-Sun 12-3pm; Lunch Mon-Fri 11:30am-4pm; Dinner Mon-Thu 4-10pm, Fri 4-11pm, Sat 3-11pm, Sun 3-10pm',
        'cuisine': 'Seafood', 'price': 4,
        'description': "Cameron Mitchell Restaurants' flagship Ocean Prime, occupying 14,500 square feet on the fourth floor of 63 CityCenter at Las Vegas Boulevard and Harmon Avenue, with a 2,500-square-foot rooftop terrace. Weekend Jazz & Bubbles Brunch features live music and champagne. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Smoking Shellfish Tower', 'Jumbo Lump Crab Cake', 'Filet Mignon', 'Hamachi Crudo', 'Ten Layer Carrot Cake'],
        'score': 85, 'neighborhood': 'CityCenter',
        'tags': ['Seafood', 'Steakhouse', 'Brunch', AWARD, 'Fine Dining', 'CityCenter'],
    }),
]

sf = [
    entry({
        'id': 5167, 'name': "Elena's Mexican Restaurant",
        'address': '255 West Portal Ave, San Francisco, CA 94127',
        'lat': 37.738388, 'lng': -122.4683123,
        'website': 'https://www.elenasmexicansf.com',
        'instagram': '@elenasmexicansf',
        'reservation': 'OpenTable',
        'cuisine': 'Mexican', 'price': 2,
        'description': "Vibrant West Portal Mexican restaurant celebrating a family's love for authentic Mexican food combined with California-inspired elements. Known for handmade tortillas using masa from La Palma, rich pozole, and melty gobernador tacos. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Pozole', 'Gobernador Tacos', 'Esquites', 'Shredded Chicken Enchiladas', 'Chile Colorado'],
        'score': 83, 'neighborhood': 'West Portal',
        'tags': ['Mexican', 'Brunch', AWARD, 'West Portal'],
    }),
    entry({
        'id': 5168, 'name': 'Hilda and Jesse',
        'address': '701 Union St, San Francisco, CA 94133',
        'lat': 37.8001073, 'lng': -122.4109558,
        'website': 'https://hildaandjesse.com',
        'instagram': '@hildaandjesse',
        'reservation': 'OpenTable',
        'cuisine': 'Contemporary American', 'price': 3,
        'description': "Queer-owned, Michelin-starred brunch and dinner spot in North Beach from Chefs Ollie Liedags and Rachel Sillcocks. Born from popular Brunch for Dinner pop-ups, with playful fine-dining technique - buttermilk pancakes with cranberry maple syrup, steak and eggs, and an eclectic nightly $75 tasting menu. 1 Michelin Star. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Buttermilk Pancakes', 'Steak and Eggs', 'Avocado Sweet Potato Tempura Toast', "Chef's Adventure Tasting Menu"],
        'score': 88, 'neighborhood': 'North Beach',
        'tags': ['Contemporary American', 'Brunch', AWARD, 'Michelin Star', 'North Beach'],
    }),
    entry({
        'id': 5169, 'name': "Little Original Joe's",
        'address': '2301 Chestnut St, San Francisco, CA 94123',
        'lat': 37.7999572, 'lng': -122.4414872,
        'phone': '(415) 712-1895',
        'website': 'https://www.littleoriginaljoes.com',
        'instagram': '@littleoriginaljoes',
        'reservation': 'OpenTable',
        'hours': 'Mon-Thu 11:30am-10pm; Fri 11:30am-11pm; Sat 10:30am-11pm; Sun 10:30am-10pm',
        'cuisine': 'Italian-American', 'price': 2,
        'description': "Italian-American neighborhood eatery on Chestnut Street in the Marina, serving pizza, pasta, and parmigiana in a welcoming, casual atmosphere. A local institution drawing regulars for well-executed classics and warm hospitality. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Pizza', 'Zucchini Fries', 'Parmigiana', 'Pasta'],
        'score': 80, 'neighborhood': 'Marina',
        'tags': ['Italian-American', 'Brunch', AWARD, 'Marina'],
    }),
    entry({
        'id': 5170, 'name': 'The Village Pub',
        'address': '2967 Woodside Rd, Woodside, CA 94062',
        'lat': 37.4289517, 'lng': -122.251458,
        'website': 'https://www.villagepub.net',
        'reservation': 'OpenTable',
        'cuisine': 'Contemporary American', 'price': 3,
        'description': "Nestled in the heart of Woodside on the SF Peninsula, offering contemporary Californian cuisine rooted in French and Mediterranean traditions for over two decades. The seasonal menu is driven by a partnership with SMIP Ranch, a nearby organic farm. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Halibut', 'Herb Roast Jidori Chicken', 'Cauliflower Steak', 'Chocolate Souffle'],
        'score': 84, 'neighborhood': 'Woodside',
        'tags': ['Contemporary American', 'Brunch', AWARD, 'Woodside'],
    }),
]

nyc = [
    entry({
        'id': 2048, 'name': "Carmine's Italian Restaurant (Times Square)",
        'address': '200 W 44th St, New York, NY 10036',
        'lat': 40.7575108, 'lng': -73.9867126,
        'phone': '(212) 221-3800',
        'website': 'https://www.carminesnyc.com',
        'instagram': '@carminesnyc',
        'reservation': 'OpenTable',
        'hours': 'Mon-Thu 11:30am-11pm; Fri 11:30am-12am; Sat 11am-12am; Sun 11am-11pm',
        'cuisine': 'Italian', 'price': 2,
        'description': "Family-style Southern Italian restaurant from restaurateur Artie Cutler, serving Times Square since 1990. Enormous shareable platters of pasta, seafood, and meat designed to evoke an Italian-American wedding feast. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Chicken Parmigiana', 'Penne alla Vodka', 'Rigatoni with Sausage and Broccoli', 'Lasagna', 'Meatballs', 'Caesar Salad'],
        'score': 82, 'neighborhood': 'Times Square',
        'tags': ['Italian', 'Family-Style', 'Brunch', AWARD, 'Times Square'],
    }),
    entry({
        'id': 2049, 'name': 'Lips NYC',
        'address': '227 E 56th St, New York, NY 10022',
        'lat': 40.7593327, 'lng': -73.9668206,
        'website': 'https://www.lipsnyc.com',
        'instagram': '@lipsnyc',
        'reservation': 'OpenTable',
        'hours': 'Wed-Sun evenings; weekend brunch',
        'cuisine': 'American', 'price': 3,
        'description': "New York City's premier drag queen dinner and show palace for over 30 years, with nightly entertainment Wednesday-Sunday from rotating diva performers. Pairs grilled steaks, pasta, and salmon with a boozy weekend brunch that consistently sells out. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Grilled Steak', 'Grilled Salmon', 'Pasta', 'Chocolate Sin Dessert'],
        'score': 80, 'neighborhood': 'Midtown',
        'tags': ['American', 'Drag Show', 'Brunch', AWARD, 'Midtown'],
    }),
    entry({
        'id': 2050, 'name': 'Little Owl',
        'address': '90 Bedford St, New York, NY 10014',
        'lat': 40.7322791, 'lng': -74.0052939,
        'phone': '(212) 741-4695',
        'website': 'https://www.thelittleowlnyc.com',
        'instagram': '@littleowlnyc',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/the-little-owl-reservations-new-york?restref=8033',
        'hours': 'Brunch Sat-Sun 9am-2:30pm; Lunch Mon-Thu 11am-2:30pm, Fri 10am-2:30pm; Dinner daily 5-10pm',
        'cuisine': 'Mediterranean', 'price': 3,
        'description': "Chef Joey Campanaro's West Village corner spot of Bedford and Grove for nearly two decades, with bold Mediterranean cuisine rooted in his grandmother's recipes and seasonal local sourcing. Famous for the upbeat weekend brunch, Gravy Meatball Sliders, and a thick pork chop that became one of NYC's most iconic dishes. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Gravy Meatball Sliders', 'The Pork Chop & Butter Beans', 'Skirt Steak & Eggs', 'Lobster Bisque', 'Cinnamon Sugar Beignets', 'Whole Wheat Pancakes'],
        'score': 88, 'neighborhood': 'West Village',
        'tags': ['Mediterranean', 'Brunch', AWARD, 'West Village'],
    }),
    entry({
        'id': 2051, 'name': 'RH Rooftop Restaurant New York',
        'address': '9 Ninth Ave, New York, NY 10014',
        'lat': 40.7400703, 'lng': -74.0064799,
        'website': 'https://rh.com/category/galleries-restaurants/new-york/restaurant.jsp',
        'reservation': 'OpenTable',
        'cuisine': 'American', 'price': 3,
        'description': "On the fifth floor of the RH New York flagship in the Meatpacking District, a dramatically designed space with rows of crystal chandeliers, potted trees, and a soaring glass ceiling. Chef Brendan Sodikoff helms a menu of premium American fare. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Dry-Aged Rib-Eye Steak', 'RH Burger', 'Truffle Pappardelle', 'Warm Chocolate Chip Cookies'],
        'score': 78, 'neighborhood': 'Meatpacking District',
        'tags': ['American', 'Rooftop', 'Brunch', AWARD, 'Meatpacking District'],
    }),
    entry({
        'id': 2052, 'name': 'Tavern on the Green',
        'address': 'W 67th St & Central Park West, New York, NY 10023',
        'lat': 40.7721961, 'lng': -73.9775964,
        'phone': '(212) 877-8684',
        'website': 'https://www.tavernonthegreen.com',
        'instagram': '@tavernonthegreen',
        'reservation': 'OpenTable',
        'reserveUrl': 'https://www.opentable.com/tavern-on-the-green',
        'hours': 'Mon-Thu 11am-9pm; Fri 11am-10pm; Sat 9am-10pm; Sun 9am-9pm',
        'cuisine': 'American', 'price': 3,
        'description': "Originally designed by Calvert Vaux and built in 1870 to house the sheep of Central Park's Sheep Meadow, a celebrated NYC dining landmark since 1934. Executive Chef Bill Peet leads a hearty, rustic menu of jumbo lump crab cakes, dry-aged sirloin, and grilled lamb chops. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': ['Jumbo Lump Crab Cake', '28 Day Dry Aged Sirloin Steak', 'Grilled Lamb Chops', 'Maine Lobster Benedict', 'Seared Diver Sea Scallops', 'Chardonnay Braised Short Ribs'],
        'score': 85, 'neighborhood': 'Upper West Side',
        'tags': ['American', 'Brunch', AWARD, 'Iconic', 'Upper West Side', 'Central Park'],
    }),
    entry({
        'id': 2053, 'name': "Tony's Di Napoli (Times Square)",
        'address': '147 W 43rd St, New York, NY 10036',
        'lat': 40.7563915, 'lng': -73.9854253,
        'website': 'https://www.tonysdinapoli.com',
        'reservation': 'OpenTable',
        'cuisine': 'Italian', 'price': 2,
        'description': "Times Square Southern Italian institution serving family-style at the W 43rd Street location in the heart of midtown Manhattan. Convivial old-world Italian-American dining with generous shareable platters of pasta, seafood, and meat. Named to OpenTable's Top 100 Brunch 2026.",
        'dishes': [],
        'score': 79, 'neighborhood': 'Times Square',
        'tags': ['Italian', 'Family-Style', 'Brunch', AWARD, 'Times Square'],
    }),
]

# ---------- TAGS on existing entries (id + address match) ----------

tag_targets = [
    {'id': 3208, 'addr_substr': '6934 E 1st Ave', 'name': 'Cafe Monarch'},
    {'id': 23, 'addr_substr': '4217 Oak Lawn Ave', 'name': "Al Biernat's"},
    {'id': 5078, 'addr_substr': '1658 Market St', 'name': 'Zuni Cafe'},
    {'id': 4086, 'addr_substr': '1636 Meridian Ave', 'name': 'Mila Restaurant'},
]


def insert_into_array(text, marker_re, new_objs):
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


def find_entry_span_by_id_and_addr(text, target_id, addr_substr):
    """Return (start, end) span of the {...} object whose id matches and address contains addr_substr."""
    pat = re.compile(r'\{[^{}]*?\"id\":' + str(target_id) + r'\b[^{}]{0,3000}?\}', re.DOTALL)
    for m in pat.finditer(text):
        seg = m.group(0)
        addr_m = re.search(r'\"address\":\"([^\"]*)\"', seg)
        if addr_m and addr_substr in addr_m.group(1):
            return m.start(), m.end()
    return None, None


def add_award_tag(text, target_id, addr_substr):
    """Add AWARD to tags array AND set/append awards field, only on the entry matching id+address."""
    s, e = find_entry_span_by_id_and_addr(text, target_id, addr_substr)
    if s is None:
        return text, False, 'entry not found'
    seg = text[s:e]
    if AWARD in seg:
        return text, False, 'award already present'
    # Tag append
    tags_m = re.search(r'\"tags\":(\[[^\]]*\])', seg)
    if not tags_m:
        return text, False, 'tags field not found'
    try:
        tags = J.loads(tags_m.group(1))
    except Exception as ex:
        return text, False, f'tags parse error: {ex}'
    if AWARD not in tags:
        tags.append(AWARD)
    new_tags = '"tags":' + J.dumps(tags, ensure_ascii=False, separators=(',', ':'))
    new_seg = seg[:tags_m.start()] + new_tags + seg[tags_m.end():]
    # Awards field append
    awards_m = re.search(r'\"awards\":\"([^\"]*)\"', new_seg)
    if awards_m:
        cur = awards_m.group(1)
        if AWARD not in cur:
            new_val = (cur + '; ' + AWARD).strip('; ').strip() if cur else AWARD
            new_seg = new_seg[:awards_m.start()] + f'"awards":"{new_val}"' + new_seg[awards_m.end():]
    return text[:s] + new_seg + text[e:], True, 'ok'


# ---------- Copper Common update ----------

def update_copper_common(text):
    s, e = find_entry_span_by_id_and_addr(text, 11048, '111 E Broadway')
    if s is None:
        return text, False, 'Copper Common not found'
    seg = text[s:e]
    new_seg = re.sub(r'\"reservation\":\"walk-in\"', '"reservation":"Resy"', seg, count=1)
    new_seg = re.sub(r'\"reserveUrl\":\"\"', '"reserveUrl":"https://resy.com/cities/slc/copper-common"', new_seg, count=1)
    if new_seg == seg:
        return text, False, 'no change made'
    return text[:s] + new_seg + text[e:], True, 'ok'


# ---------- Apply ----------

before_count = content.count('"id":')

# 1. Copper Common
content, ok, msg = update_copper_common(content)
print(f'Copper Common update: ok={ok} msg={msg}')

# 2. Tag existing
for t in tag_targets:
    content, ok, msg = add_award_tag(content, t['id'], t['addr_substr'])
    print(f'Tag id={t["id"]:5d} ({t["name"]}): ok={ok} msg={msg}')

# 3. Insert new
inserts = [
    (r'(?:const|let|var)\s+PHX_DATA\s*=\s*\[', phx),
    (r'(?:const|let|var)\s+SD_DATA\s*=\s*\[', sd),
    (r'(?:const|let|var)\s+AUSTIN_DATA\s*=\s*\[', austin),
    (r'(?:const|let|var)\s+SANANTONIO_DATA\s*=\s*\[', sanantonio),
    (r'(?:const|let|var)\s+CHICAGO_DATA\s*=\s*\[', chicago),
    (r'(?:const|let|var)\s+LV_DATA\s*=\s*\[', lv),
    (r'(?:const|let|var)\s+SF_DATA\s*=\s*\[', sf),
    (r'(?:const|let|var)\s+NYC_DATA\s*=\s*\[', nyc),
]

all_new_ids = []
for marker, batch in inserts:
    content = insert_into_array(content, marker, batch)
    all_new_ids.extend([b['id'] for b in batch])

after_count = content.count('"id":')
delta = after_count - before_count
expected = sum(len(b) for _, b in inserts)
print(f'\nid-field count: before={before_count} after={after_count} delta={delta} (expected {expected})')

# Verify each new id present
problems = []
for nid in all_new_ids:
    cnt = content.count(f'"id":{nid},')
    if cnt < 1:
        problems.append(f'id {nid} missing')

if delta == expected and not problems:
    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print('WROTE index.html')
else:
    for p in problems:
        print(f'FAIL: {p}')
    print('ABORTED -- sanity failed, NO WRITE')
