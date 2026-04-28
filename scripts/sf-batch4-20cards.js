/**
 * SF Batch 4 — 20 new cards (IDs 5117–5136)
 * All data fetched from official websites by sub-agents.
 * Closures removed: Zarzuela, Mourad, 1300 on Fillmore (SFO), Cockscomb, Namu Stonepot.
 * Run: node scripts/sf-batch4-20cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../index.html');

const NEW_CARDS = [
  // ── JAPANTOWN ─────────────────────────────────────────────────────────────
  {
    id: 5117,
    name: "Marufuku Ramen",
    address: "1581 Webster St #235, San Francisco, CA 94115",
    lat: 37.7849, lng: -122.4316,
    phone: "415-872-9786",
    website: "marufukuramen.com",
    instagram: "@MarufukuRamenOfficial",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 11:30am–2pm, 5:30pm–9:30pm | Sat 11:30am–3pm, 5:30pm–9:30pm | Sun 11:30am–3pm, 5:30pm–9pm",
    cuisine: "Ramen",
    price: 2,
    description: "Authentic Hakata-style tonkotsu ramen in Japan Center's Kinokuniya mall — milky, umami-rich broth from long-simmered pork bones, ultra-thin artisanal noodles, and cha-shu from specially selected pork. One of the most faithful renditions of Fukuoka ramen in the Bay Area.",
    dishes: ["Hakata Tonkotsu Ramen (milky pork bone broth)", "Cha-shu (specially selected pork)", "Ultra-thin artisanal noodles", "Seasoned soft-boiled egg", "Seasonal ramen specials"],
    score: 87,
    neighborhood: "Japantown",
    tags: ["Ramen", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── PACIFIC HEIGHTS ───────────────────────────────────────────────────────
  {
    id: 5118,
    name: "Octavia",
    address: "1701 Octavia St, San Francisco, CA 94109",
    lat: 37.7879, lng: -122.4270,
    phone: "415-408-7507",
    website: "octavia-sf.com",
    instagram: "@sf_octavia",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sat 5pm–9:15pm | Closed Sun–Mon",
    cuisine: "California",
    price: 3,
    description: "Chef Melissa Perello's Michelin-starred sister to Frances: simple-yet-elevated California cuisine that celebrates excellent local ingredients with creative touches. Half Moon Bay black cod with braised turnip, Liberty Farm duck with morel mushroom — the kind of cooking that makes seasonal produce feel inevitable.",
    dishes: ["Half Moon Bay Black Cod with braised turnip and potato", "Liberty Farm Duck with morel mushroom and sugar snap pea", "Abatti Ranch Wagyu Picanha with purple cauliflower", "Ricotta Scarpinocc with fava leaf pesto", "Semolina Spaghetti with pork sausage and manila clams"],
    score: 92,
    neighborhood: "Pacific Heights",
    tags: ["Fine Dining", "Michelin Star", "Date Night", "California"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5119,
    name: "Harris' Restaurant",
    address: "2100 Van Ness Ave, San Francisco, CA 94109",
    lat: 37.7951, lng: -122.4229,
    phone: "(415) 673-1888",
    website: "harrisrestaurant.com",
    instagram: "@harrisrestaurantsf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Thu 5pm–9pm | Fri–Sat 5pm–10pm | Sun 5pm–9pm | Closed Mon",
    cuisine: "Steakhouse",
    price: 4,
    description: "A San Francisco fine-dining steakhouse institution since 1984 with nightly jazz and an award-winning wine list. Dry-aged Porterhouse, bone-in New York, and A5 Miyazaki Wagyu Ribeye in an elegant room on Van Ness that feels unchanged by decades of trends.",
    dishes: ["Dry-aged Porterhouse", "Bone-in New York steak", "A5 Japanese Miyazaki Wagyu Ribeye", "Maine Lobster", "Steak Diane"],
    score: 88,
    neighborhood: "Pacific Heights",
    tags: ["Fine Dining", "Date Night", "Historic", "Steakhouse"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── RUSSIAN HILL ──────────────────────────────────────────────────────────
  {
    id: 5120,
    name: "Frascati",
    address: "1901 Hyde St, San Francisco, CA 94109",
    lat: 37.7984, lng: -122.4190,
    phone: "(415) 928-1406",
    website: "frascatisf.com",
    instagram: "@frascatisf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Tue–Thu 5pm–9pm | Fri–Sat 5pm–9:30pm | Closed Sun–Mon",
    cuisine: "Italian",
    price: 3,
    description: "A seductive Mediterranean-style neighborhood restaurant on the Russian Hill cable car line, drawing from Italian, French, Spanish, and Californian influences. Fresh fettuccini Bolognese, Amatriciana with Calabrian chili, Maple Leaf duck with cherry jus — the best table on Hyde Street.",
    dishes: ["Fresh Fettuccini with Beef Bolognese", "Fresh Tagliatelle Amatriciana with pancetta and Calabrian chili", "Roasted Half Chicken with fingerling potatoes and lemon-oregano jus", "Maple Leaf Duck Breast with wild rice and cherry jus", "Grilled Fillet Mignon with creamy polenta"],
    score: 85,
    neighborhood: "Russian Hill",
    tags: ["Italian", "Date Night", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FINANCIAL DISTRICT ────────────────────────────────────────────────────
  {
    id: 5121,
    name: "Perbacco",
    address: "230 California St, San Francisco, CA 94111",
    lat: 37.7936, lng: -122.3993,
    phone: "415-955-0663",
    website: "perbaccosf.com",
    instagram: "@perbaccosf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Fri 11:30am–9pm | Sat 5:30pm–9pm | Closed Sun–Mon",
    cuisine: "Italian",
    price: 3,
    description: "Northern Italian restaurant in the Financial District bringing authentic Piemontese and Ligurian flavors — agnolotti dal plin with roasted meats, pappardelle with short rib ragù, hamachi crudo — to the city's most office-lunch-capable room. One of FiDi's most reliable fine-dining regulars.",
    dishes: ["Crudo: hamachi with cucumber-ginger juice and pickled shallots", "Pappardelle with slow-cooked short rib ragù", "Agnolotti dal Plin with roasted meats and vegetables", "Risotto with wild mushrooms and porcini crema", "Liberty Farm Duck Breast with roasted cauliflower"],
    score: 85,
    neighborhood: "Financial District",
    tags: ["Italian", "Date Night", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5122,
    name: "Pabu Izakaya",
    address: "101 California St, San Francisco, CA 94111",
    lat: 37.7929, lng: -122.3981,
    phone: "(415) 535-0184",
    website: "theminagroup.com",
    instagram: "@pabusf",
    reservation: "SevenRooms",
    reserveUrl: "",
    hours: "Mon–Fri lunch 11am–2pm | Mon–Sat dinner 4pm–9pm | Happy Hour 4pm–5:30pm | Closed Sun",
    cuisine: "Japanese",
    price: 3,
    description: "A contemporary izakaya from Chefs Michael Mina and the late Ken Tominaga, featuring jet-fresh seafood from Tokyo's Toyosu Market alongside robata-grilled meats and world-class sashimi. The tsukune, crispy chicken skin (kawa), and broiled black cod are the best arguments for a FiDi izakaya.",
    dishes: ["Ken's Roll (house signature)", "A5 Japanese Wagyu skewers (robata-grilled)", "Tsukune (chicken meatballs with jidori egg yolk)", "Crispy chicken skin (kawa)", "Broiled black cod"],
    score: 89,
    neighborhood: "Financial District",
    tags: ["Japanese", "Fine Dining", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── TENDERLOIN ────────────────────────────────────────────────────────────
  {
    id: 5123,
    name: "Saigon Sandwich",
    address: "560 Larkin St, San Francisco, CA 94102",
    lat: 37.7829, lng: -122.4172,
    phone: "415-474-5698",
    website: "saigonsandwich.com",
    instagram: "@saigon.sandwich",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Tue 7am–5:30pm | Wed–Sun 7am–6pm | Cash only",
    cuisine: "Vietnamese",
    price: 1,
    description: "The Tenderloin's legendary Vietnamese bánh mì counter — authentic, filling, and $5.50. Over 40 years of roast pork and roast chicken sandwiches, stuffed with pickled daikon and carrot, cilantro, jalapeño, and pâté on crusty French bread. Cash only, walk-in, line around the block at lunch.",
    dishes: ["Bánh Mì Thịt (Roast Pork, $5.50)", "Bánh Mì Gà (Roast Chicken, $5.50)", "Bánh Mì Thịt Chả Pate (Special Combination, $7.00)"],
    score: 86,
    neighborhood: "Tenderloin",
    tags: ["Vietnamese", "Local Favorites", "Hole in the Wall"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── SOMA ─────────────────────────────────────────────────────────────────
  {
    id: 5124,
    name: "Marlowe",
    address: "500 Brannan St, San Francisco, CA 94107",
    lat: 37.7783, lng: -122.3967,
    phone: "415-777-1413",
    website: "marlowesf.com",
    instagram: "@marlowesf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon 5pm–9pm | Tue–Thu 11:30am–9pm | Fri 11:30am–10pm | Sat brunch 10:30am–10pm | Sun brunch 10:30am–9pm",
    cuisine: "American",
    price: 2,
    description: "New American bistro in SoMa since 2010 where classic comfort food gets flavorful twists: the Marlowe Burger with caramelized onions, cheddar, and horseradish aioli is a SoMa landmark, and the pan-seared black cod over Dungeness crab risotto proves the kitchen handles seafood just as well.",
    dishes: ["Marlowe Burger (caramelized onions, cheddar, bacon, horseradish aioli)", "Pan Seared Black Cod with Dungeness Crab Risotto", "Grilled Brick Chicken with brussels sprouts", "Hamachi Crudo with harissa and pickled red onions", "Herb Crusted Lamb Ribs with fresno chili salsa verde"],
    score: 83,
    neighborhood: "SoMa",
    tags: ["American", "Brunch", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5125,
    name: "The Bird",
    address: "115 New Montgomery St, San Francisco, CA 94105",
    lat: 37.7872, lng: -122.4001,
    phone: "",
    website: "thebirdsf.com",
    instagram: "@thebirdsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Wed 10am–9pm | Thu–Fri 10am–9:30pm | Sat 11am–9:30pm | Sun 11am–9pm",
    cuisine: "American",
    price: 1,
    description: "SoMa's go-to fried chicken sandwich spot — quality ingredients at accessible pricing, a short menu done really well. The classic ($10.25) or spicy, chicken biscuit with tots, buffalo wings. Fast, satisfying, no pretension.",
    dishes: ["Fried Chicken Sandwich classic or spicy ($10.25)", "Chicken Biscuit with Tots", "Buffalo Wings", "Mango Habanero Wings"],
    score: 79,
    neighborhood: "SoMa",
    tags: ["Casual", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MISSION ───────────────────────────────────────────────────────────────
  {
    id: 5126,
    name: "Beretta",
    address: "1199 Valencia St, San Francisco, CA 94110",
    lat: 37.7539, lng: -122.4206,
    phone: "(415) 695-1199",
    website: "berettasf.com",
    instagram: "@berettasf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 5pm–12am | Fri 5pm–1am | Sat 11am–1am | Sun 11am–12am",
    cuisine: "Italian",
    price: 2,
    description: "Mission District's neighborhood pizza and cocktail bar — wood-fired Neapolitan pies until midnight, with one of the best cocktail programs on Valencia Street. A late-night staple that handles both the pizza and the negroni with equal seriousness.",
    dishes: ["Neapolitan wood-fired pizza (menu varies seasonally)", "Signature cocktails (negroni, spritz programs)", "Italian antipasti and starters", "Pasta preparations", "Weekend brunch menu"],
    score: 84,
    neighborhood: "Mission",
    tags: ["Italian", "Pizza", "Cocktails", "Late Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5127,
    name: "Dandelion Chocolate",
    address: "740 Valencia St, San Francisco, CA 94110",
    lat: 37.7610, lng: -122.4218,
    phone: "(415) 349-0942",
    website: "dandychoc.com",
    instagram: "@dandyChoc",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 9am–9pm",
    cuisine: "Cafe",
    price: 1,
    description: "Mission District's bean-to-bar chocolate factory and cafe: single-origin chocolate crafted on-site from sustainably sourced cacao, turned into drinking chocolate, truffles, and bars. The factory floor is visible from the tasting room, and the drinking chocolate — thick, barely sweet, deeply flavored — is one of the most interesting cups in the city.",
    dishes: ["Single-origin drinking chocolate", "House-made truffles and bonbons", "Single-origin chocolate bars (seasonal origins)", "Chocolate tasting flights", "Pastries with house chocolate"],
    score: 84,
    neighborhood: "Mission",
    tags: ["Cafe", "Local Favorites"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5128,
    name: "Craftsman and Wolves",
    address: "746 Valencia St, San Francisco, CA 94110",
    lat: 37.7610, lng: -122.4218,
    phone: "(415) 913-7713",
    website: "craftsman-wolves.com",
    instagram: "@craftsmanwolves",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 7:30am–3:30pm | Sat–Sun 8am–4pm",
    cuisine: "Bakery",
    price: 2,
    description: "Chef William Werner's French-inspired contemporary pâtisserie on Valencia Street, pursuing 'edible craftsmanship' through artisanal baked goods and modern aesthetics. The S'mores Pain Suisse (toasted marshmallow fluff, milk chocolate, graham crumble) is the Mission's best pastry case.",
    dishes: ["S'mores Pain Suisse (toasted marshmallow fluff, milk chocolate, graham)", "French Dip Pain Suisse (slow-roasted beef, au jus, horseradish cream)", "Rachel from the Block (pastrami, jalapeño slaw, gochujang remoulade)", "Chocolate shoyu caramel", "Avocado toast with poached egg and pea hummus"],
    score: 84,
    neighborhood: "Mission",
    tags: ["Bakery", "Local Favorites"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5129,
    name: "Taqueria Cancun",
    address: "2288 Mission St, San Francisco, CA 94110",
    lat: 37.7605, lng: -122.4194,
    phone: "(415) 252-9560",
    website: "taqueriacancunsf.net",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily (hours vary by location)",
    cuisine: "Mexican",
    price: 1,
    description: "A Mission District taqueria legend since 1991 — consistently ranked among SF's finest burrito makers across three locations. The O.M.G. Burrito Mojado and Super Burrito are the standard against which all other Mission burritos are measured.",
    dishes: ["O.M.G. Burrito Mojado", "Breakfast Burrito with Chorizo", "Super Burrito", "Alambres", "Al Pastor tacos"],
    score: 85,
    neighborhood: "Mission",
    tags: ["Mexican", "Local Favorites"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOE VALLEY ────────────────────────────────────────────────────────────
  {
    id: 5130,
    name: "Saru Sushi Bar",
    address: "3856 24th St, San Francisco, CA 94114",
    lat: 37.7518, lng: -122.4288,
    phone: "(415) 400-4510",
    website: "sarusushisf.com",
    instagram: "@sarusushibarsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Wed 5:30pm–9:30pm | Thu 12pm–2pm, 5:30pm–9:30pm | Fri–Sat 12pm–2pm, 5:30pm–10pm | Sun 12pm–2pm, 5:30pm–9:30pm | Closed Mon–Tue",
    cuisine: "Sushi",
    price: 3,
    description: "A minimalist sushi bar in Noe Valley operating in SF's oldest Japanese restaurant space since 2012 — walk-in only, no reservations. Spicy tuna on seaweed crackers, seared ankimo, halibut tartare with yuzu, and an omakase that takes the format seriously in a casual neighborhood room.",
    dishes: ["Spicy tuna and avocado seaweed cracker (tempura-fried)", "Seared ankimo with scallions", "Halibut tartare with yuzu", "California Roll", "Omakase (seasonal chef's selection)"],
    score: 85,
    neighborhood: "Noe Valley",
    tags: ["Sushi", "Date Night", "Local Favorites"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COW HOLLOW ────────────────────────────────────────────────────────────
  {
    id: 5131,
    name: "Wildseed",
    address: "2000 Union St, San Francisco, CA 94123",
    lat: 37.7976, lng: -122.4324,
    phone: "(415) 872-7350",
    website: "wildseedsf.com",
    instagram: "@wildseedsf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–9:30pm | Fri 11:30am–10:30pm | Sat 11am–10:30pm | Sun 11am–9:30pm",
    cuisine: "Plant-Based",
    price: 3,
    description: "100% plant-based fine dining on Union Street — 'Good For You. Good For The Planet. Good For The Soul.' Fresh, seasonal Northern California produce elevated to the level of a proper dining room: Neatball Masala with coconut masala, Mixed Grill for Two, mushroom pizza with truffled faba milk béchamel.",
    dishes: ["Neatball Masala with coconut masala ($23)", "Mixed Grill for Two ($43)", "Spicy Yellow Curry ($26)", "Mushroom Pizza with truffled faba milk béchamel ($26)", "Seasonal plant-based preparations"],
    score: 85,
    neighborhood: "Cow Hollow",
    tags: ["Plant-Based", "Date Night", "Brunch"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5132,
    name: "Roam Artisan Burgers",
    address: "1785 Union St, San Francisco, CA 94123",
    lat: 37.7978, lng: -122.4285,
    phone: "(415) 440-7626",
    website: "roamburgers.com",
    instagram: "@roam_burgers",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Sun–Thu 11am–9pm | Fri–Sat 11am–10pm",
    cuisine: "American",
    price: 1,
    description: "Craft burgers in Cow Hollow built on grass-fed beef, free-range turkey, and sustainable sourcing from local ranchers and farmers. The Heritage Burger (applewood smoked bacon, aged white cheddar, grilled onions, aioli) and the French n' Fries (brie, truffle Parmesan, avocado) keep the neighborhood tables full.",
    dishes: ["Heritage Burger (applewood bacon, aged white cheddar, grilled onions, aioli)", "French n' Fries (truffle Parmesan fries, brie, avocado)", "Sunny Side (pasture-raised egg, white cheddar, chili sauce)", "Classic Chicken Sandwich", "Farmers Market Salad (seasonal, local)"],
    score: 80,
    neighborhood: "Cow Hollow",
    tags: ["Casual", "Burgers", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── JACKSON SQUARE ────────────────────────────────────────────────────────
  {
    id: 5133,
    name: "Trestle",
    address: "531 Jackson St, San Francisco, CA 94133",
    lat: 37.7962, lng: -122.4045,
    phone: "(415) 772-0922",
    website: "trestlesf.com",
    instagram: "@trestle_sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Sun–Thu 5:30pm–9pm | Fri–Sat 5:30pm–10pm",
    cuisine: "California",
    price: 2,
    description: "Prix fixe California cuisine in Jackson Square: a four-course menu with a focus on seasonal pasta, built for neighborhood regulars who want something seriously good without the ceremony. Braised lamb rigatoni, saffron risotto with calamari, crispy skin salmon — the most value per dollar of any Jackson Square table.",
    dishes: ["Braised Lamb Rigatoni with fava leaf pesto", "Saffron Risotto with calamari", "Crispy Skin Salmon", "Ricotta Cake with candied pistachio", "Four-course prix fixe format"],
    score: 86,
    neighborhood: "Jackson Square",
    tags: ["California", "Date Night", "Prix Fixe"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── INNER RICHMOND ────────────────────────────────────────────────────────
  {
    id: 5134,
    name: "Fiorella",
    address: "2339 Clement St, San Francisco, CA 94121",
    lat: 37.7818, lng: -122.4845,
    phone: "(415) 340-3049",
    website: "fiorella-sf.com",
    instagram: "@fiorellaitalian",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Thu 5pm–9pm | Fri 5pm–9:30pm | Sat–Sun 11:30am–2:30pm, 5pm–9:30pm",
    cuisine: "Italian",
    price: 2,
    description: "Wood-fired pizza and handmade pasta neighborhood Italian restaurant with four San Francisco locations, operating since 2015. The Clement Street original remains the most neighborhood-feeling room — a wood-burning oven and fresh pasta program that the Inner Richmond relies on.",
    dishes: ["Wood-fired Neapolitan pizza (rotating specials at pizza bar)", "Handmade pasta with seasonal preparations", "Classic Italian antipasti", "Pizza margherita and seasonal toppings"],
    score: 82,
    neighborhood: "Inner Richmond",
    tags: ["Italian", "Pizza", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5135,
    name: "Noodle in a Haystack",
    address: "4601 Geary Blvd, San Francisco, CA 94118",
    lat: 37.7806, lng: -122.4687,
    phone: "",
    website: "noodleinhaystack.com",
    instagram: "@noodleinhaystack",
    reservation: "Tock",
    reserveUrl: "",
    hours: "By reservation only | Tock releases 2nd Sunday of each month at 9pm PT",
    cuisine: "Ramen",
    price: 3,
    description: "A hyper-intimate ramen tasting menu in the Richmond that the New York Times named one of the 50 best US restaurants (2023). Monthly rotating styles of innovative ramen — Michelin-recognized, with reservations released once monthly and seats gone within hours. The most important bowl of noodles in San Francisco.",
    dishes: ["Monthly rotating innovative ramen tasting menu", "Michelin-recognized ramen compositions", "Seasonal ramen styles crafted monthly", "Intimate counter experience (very limited seats)"],
    score: 94,
    neighborhood: "Inner Richmond",
    tags: ["Ramen", "Michelin Star", "Tasting Menu", "Critics Pick"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: true,
    verified: "2026-04-28"
  },

  // ── MID-MARKET / CIVIC CENTER ─────────────────────────────────────────────
  {
    id: 5136,
    name: "Villon Bar",
    address: "1100 Market St, San Francisco, CA 94102",
    lat: 37.7808, lng: -122.4125,
    phone: "(415) 735-7777",
    website: "properhotel.com/san-francisco/restaurants-bars/villon",
    instagram: "@sanfranciscoproper",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Daily (see hotel for current hours)",
    cuisine: "California",
    price: 3,
    description: "Kelly Wearstler-designed bar and seasonal farm-to-table restaurant at San Francisco Proper Hotel — California cuisine with global influences and a signature cocktail bar. The Proper Martini, Naked and Famous, and Black Star anchor one of the best-designed hotel bars in the city.",
    dishes: ["Savory Rice Porridge with Roasted Mushrooms", "Smoked Polenta with Cilantro Braised Pork", "Huevos Rancheros with Charred Avocado", "The Proper Martini", "Naked and Famous", "Black Star cocktail"],
    score: 83,
    neighborhood: "Mid-Market",
    tags: ["Cocktails", "California", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ── Insert logic ───────────────────────────────────────────────────────────
const html = fs.readFileSync(FILE, 'utf8');
const declarationPattern = /const SF_DATA\s*=\s*\[/g;
let match;
const positions = [];
while ((match = declarationPattern.exec(html)) !== null) positions.push(match.index);
if (!positions.length) { console.error('SF_DATA not found'); process.exit(1); }
console.log(`Found ${positions.length} SF_DATA declaration(s)`);

const cardJson = NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
const insertBlock = ',\n' + cardJson;
let output = html;
let offset = 0;

for (let i = positions.length - 1; i >= 0; i--) {
  const pos = positions[i] + offset;
  let depth = 0, inStr = false, escape = false, insertAt = -1;
  for (let j = pos; j < output.length; j++) {
    const ch = output[j];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inStr) { escape = true; continue; }
    if (ch === '"' && !escape) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) { insertAt = j; break; } }
  }
  if (insertAt === -1) { console.error('Could not find closing ]'); process.exit(1); }
  output = output.slice(0, insertAt) + insertBlock + '\n' + output.slice(insertAt);
  offset += insertBlock.length + 1;
}

const sfStart = output.indexOf('const SF_DATA');
const sfEnd = output.indexOf('];', sfStart);
const block = output.slice(sfStart, sfEnd);
const cardCount = [...block.matchAll(/"id":\d+/g)].length;
const expected = 116 + NEW_CARDS.length;
console.log(`SF card count after insert: ${cardCount} (expected ${expected})`);
if (cardCount !== expected) { console.error('Count mismatch'); process.exit(1); }

fs.writeFileSync(FILE, output, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SF cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);
