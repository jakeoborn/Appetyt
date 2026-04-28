/**
 * SF Batch 2 — 32 new cards (IDs 5074–5105)
 * Neighborhoods: Castro, NoPa, Hayes Valley, Fillmore, Inner Richmond,
 * Presidio Heights, Nob Hill, Polk Gulch, Outer Sunset, Noe Valley,
 * Bernal Heights, Mission, Cow Hollow, Marina, Jackson Square,
 * Embarcadero, Chinatown
 *
 * All addresses Nominatim-verified. All data from venue official sites.
 * Run: node scripts/sf-batch2-32cards.js
 */

'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../index.html');

// ── New cards ──────────────────────────────────────────────────────────────
const NEW_CARDS = [
  // ── CASTRO ────────────────────────────────────────────────────────────────
  {
    id: 5074,
    name: "Frances",
    address: "3870 17th St, San Francisco, CA 94114",
    lat: 37.7628, lng: -122.4322,
    phone: "(415) 621-3870",
    website: "frances-sf.com",
    instagram: "",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sat 5:15pm–9:15pm | Closed Sun–Mon",
    cuisine: "California",
    price: 3,
    description: "Chef Melissa Perello's Michelin-starred Castro hideaway celebrates seasonal California cuisine with regional farm ingredients. Housemade sourdough arrives warm with Straus butter; the daily-changing menu runs from Pacific oysters with passion fruit to squid ink spaghetti with local uni. Refined without pretense, exactly the neighborhood fine-dining model the city keeps trying to replicate.",
    dishes: ["Housemade sourdough with Straus butter", "Pacific oyster with passion fruit and lime", "Squid ink spaghetti with local uni", "Mt. Lassen trout", "Chef's Tasting Menu $95"],
    score: 92,
    neighborhood: "Castro",
    tags: ["Fine Dining", "Date Night", "Michelin Star"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5075,
    name: "Anchor Oyster Bar",
    address: "579 Castro St, San Francisco, CA 94114",
    lat: 37.7598, lng: -122.4347,
    phone: "(415) 431-3990",
    website: "",
    instagram: "@anchoroysterbar",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Sat 11:30am–10pm | Sun 4pm–9:30pm",
    cuisine: "Seafood",
    price: 2,
    description: "A Castro institution since 1977, operated by Roseann Grimm for its entire lifespan. Fresh raw oysters, Dungeness crab, and housemade cioppino at a simple counter — no website, no reservations, no pretension. The Dungeness crab on sesame bun is the neighborhood's most unpretentious luxury.",
    dishes: ["Fresh raw oysters (East & West Coast)", "Dungeness crab burger on sesame bun", "Cioppino with mussels and crab", "Crab cakes with tartare", "Boston clam chowder"],
    score: 87,
    neighborhood: "Castro",
    tags: ["Seafood", "Local Favorites"],
    indicators: ["lgbtq-friendly", "hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5076,
    name: "Starbelly",
    address: "3583 16th St, San Francisco, CA 94114",
    lat: 37.7641, lng: -122.4326,
    phone: "(415) 252-7500",
    website: "starbellysf.com",
    instagram: "@starbellysf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–9pm | Fri 11:30am–10pm | Sat 10am–10pm | Sun 10am–9pm",
    cuisine: "American",
    price: 2,
    description: "The Castro's living room: California comfort food on a heated patio one block off Noe. Potato pizzas with nduja and fingerings, a proper Starbelly Manhattan, brunch every weekend — the kind of casual that doesn't try too hard and lands perfectly.",
    dishes: ["Potato pizza with nduja, fingerlings, mozzarella", "Italian sausage & Taleggio pizza", "Roasted half chicken with mashed potatoes", "Starbelly Manhattan", "Starbelly Paloma"],
    score: 81,
    neighborhood: "Castro",
    tags: ["Brunch", "Patio"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOPA ──────────────────────────────────────────────────────────────────
  {
    id: 5077,
    name: "Nopa",
    address: "560 Divisadero St, San Francisco, CA 94117",
    lat: 37.7746, lng: -122.4379,
    phone: "(415) 864-8643",
    website: "nopasf.com",
    instagram: "@nopasf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Sun 5pm–9:30pm | Mon–Thu 5:30pm–10pm | Fri–Sat 5:30pm–11pm",
    cuisine: "American",
    price: 2,
    description: "North of the Panhandle's anchor restaurant: a former bank vault turned wood-fired gathering place where the daily-changing menu means the kitchen is always working. Organic, local, late — Nopa serves until 11pm on weekends, making it the city's go-to after everything else has closed. The wood-fired cheeseburger and pork chop are perennial benchmarks.",
    dishes: ["Wood-fired cheeseburger with pickled onions and fries", "Wood-grilled pork chop with stonefruit mostarda", "Fried chicken (wood-fired)", "Pappardelle Bolognese", "Flatbread with house-smoked bacon"],
    score: 89,
    neighborhood: "NoPa",
    tags: ["Late Night", "Local Favorites", "James Beard Nominated"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── HAYES VALLEY ──────────────────────────────────────────────────────────
  {
    id: 5078,
    name: "Zuni Café",
    address: "1658 Market St, San Francisco, CA 94102",
    lat: 37.7736, lng: -122.4216,
    phone: "(415) 552-2522",
    website: "zunicafe.com",
    instagram: "@zunicafe",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sun 11am–4pm, 5pm–9:30pm | Closed Mon",
    cuisine: "American",
    price: 3,
    description: "San Francisco's most iconic restaurant, full stop. Since 1979, Zuni's brick-oven roasted chicken with bread salad — dry-brined for days, carved tableside — is the dish every chef in the city knows by heart. James Beard Award winner (2003, 2018), a sprawling corner space where the long zinc bar, copper pots, and shellfish-heavy raw bar feel timeless.",
    dishes: ["Brick-oven roast chicken with bread salad (whole, carved tableside)", "Scrambled eggs with Dungeness crab and crème fraîche", "Oyster and shellfish menu (all day)", "Daily specials rotating twice daily"],
    score: 93,
    neighborhood: "Hayes Valley",
    tags: ["Iconic", "Historic", "James Beard Award", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5079,
    name: "Rich Table",
    address: "199 Gough St, San Francisco, CA 94102",
    lat: 37.7749, lng: -122.4227,
    phone: "(415) 355-9085",
    website: "richtablesf.com",
    instagram: "@richtable",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Daily 5pm–10pm (last seating)",
    cuisine: "California",
    price: 3,
    description: "Chefs Evan and Sarah Rich built their Michelin-starred Hayes Valley restaurant on the premise that food should be surprising but never alienating. The sardine chips with horseradish crème fraîche and porcini doughnuts with raclette have become SF cult objects. Eleven bar walk-in seats for last-minute luck.",
    dishes: ["Sardine chips with horseradish crème fraîche", "Porcini doughnuts with raclette dipping sauce", "Aged beef dumplings with spicy chili crunch", "Sea urchin pasta", "Rib eye grilled over charcoal with crab latkes"],
    score: 91,
    neighborhood: "Hayes Valley",
    tags: ["Fine Dining", "Date Night", "Michelin Star"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5080,
    name: "SPQR",
    address: "1911 Fillmore St, San Francisco, CA 94115",
    lat: 37.7873, lng: -122.4338,
    phone: "(415) 771-7779",
    website: "spqrsf.com",
    instagram: "@spqrsf",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon–Sun 5pm–9pm | Wed–Thu also: $62 5-course pasta tasting",
    cuisine: "Italian",
    price: 3,
    description: "Ten-time Michelin-starred Italian led by Chef Matthew Accarrino (Food & Wine Best New Chef 2014). Northern California meets the northern Mediterranean: precise pasta, exceptional amaro list, and a Wednesday–Thursday 5-course pasta tasting that's become one of the city's best deals at $62.",
    dishes: ["5-course pasta tasting menu (Wed–Thu, $62)", "4-course dinner menu ($102)", "À la carte pasta preparations", "Seasonal antipasti", "Northern Mediterranean-inspired mains"],
    score: 91,
    neighborhood: "Fillmore",
    tags: ["Fine Dining", "Italian", "Michelin Star", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5081,
    name: "Absinthe Brasserie & Bar",
    address: "398 Hayes St, San Francisco, CA 94102",
    lat: 37.7770, lng: -122.4229,
    phone: "(415) 551-1590",
    website: "absinthe.com",
    instagram: "@absinthesf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Wed–Fri 11:30am–10pm | Sat 11am–10pm | Sun 11am–9pm | Closed Mon–Tue",
    cuisine: "French",
    price: 3,
    description: "A Hayes Valley cornerstone since 1998 with turn-of-the-century French décor and a brasserie menu that takes both the steak frites and the cocktail list seriously. The Death in the Afternoon (Prosecco, Absinthe Verte) and La Louisiane (rye, Benedictine) are among the best classic-format drinks in the city.",
    dishes: ["Steak Frites: 10oz NY Strip with green peppercorn butter ($49)", "Petrale sole Meunière with capers and potato purée ($37)", "Black truffle cheeseburger ($29)", "Death in the Afternoon (Prosecco, Absinthe Verte)", "La Louisiane (rye, vermouth, Benedictine, bitters)"],
    score: 84,
    neighborhood: "Hayes Valley",
    tags: ["French", "Cocktails", "Historic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── INNER RICHMOND ────────────────────────────────────────────────────────
  {
    id: 5082,
    name: "Burma Superstar",
    address: "309 Clement St, San Francisco, CA 94118",
    lat: 37.7829, lng: -122.4626,
    phone: "(415) 387-2147",
    website: "burmasuperstar.com",
    instagram: "@burmasuperstarsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–2:30pm, 5pm–9pm | Fri–Sat 11:30am–3:30pm, 5pm–9:30pm | Sun 11:30am–3pm, 5pm–9pm",
    cuisine: "Burmese",
    price: 1,
    description: "The restaurant that introduced Burmese food to the Bay Area, and the place that still defines it. Since 1992, the tea leaf salad — fermented leaves, crispy nuts, chickpeas, sesame, fried garlic — has been a gateway dish for an entire generation of SF diners. Notoriously long waits are worth every minute.",
    dishes: ["Tea Leaf Salad with fermented tea leaves, crispy nuts, sesame", "Rainbow Salad", "Oh Noh Kauswer (Burmese curry)", "Mohinga fish noodle soup"],
    score: 88,
    neighborhood: "Inner Richmond",
    tags: ["Local Favorites", "Hole in the Wall"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5083,
    name: "Pizzetta 211",
    address: "211 23rd Ave, San Francisco, CA 94121",
    lat: 37.7837, lng: -122.4830,
    phone: "415-379-9880",
    website: "pizzetta211.com",
    instagram: "@pizzetta211",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–2:30pm, 5pm–9pm | Fri 11:30am–2:30pm, 5pm–9:30pm | Sat 11:30am–9:30pm | Sun 11:30am–9pm",
    cuisine: "Pizza",
    price: 2,
    description: "Fourteen seats, a wood-fired oven, and a biweekly-rotating menu built entirely around what's best at the farmers' market. Pizzetta 211 is one of the Outer Richmond's most beloved institutions: no reservations, thin crust charred just right, toppings so restrained they trust the ingredients completely.",
    dishes: ["Farm egg with bacon, English peas, mint ($21)", "Broccoli rapini with roasted garlic and crescenza ($20)", "Soppressata with braised artichokes and pecorino ($20)", "Weekly rotating seasonal pies"],
    score: 86,
    neighborhood: "Inner Richmond",
    tags: ["Local Favorites", "Pizza"],
    indicators: ["hole-in-the-wall", "vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5084,
    name: "Aziza",
    address: "5800 Geary Blvd, San Francisco, CA 94121",
    lat: 37.7804, lng: -122.4817,
    phone: "(415) 682-4196",
    website: "azizasf.com",
    instagram: "@azizasf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Wed–Fri 5pm–10pm | Sat–Sun brunch 10:30am–1:30pm, dinner 5pm–10pm | Closed Mon–Tue",
    cuisine: "Moroccan",
    price: 3,
    description: "The first Moroccan restaurant in the US to earn a Michelin star (2010). Chef Mourad Lahlou weaves California's seasonal larder into North African spice and technique: basteeya in golden phyllo, saffron Cornish hen with preserved Meyer lemon, braised lamb shank with honey-kumquat and cinnamon couscous. The Inner Richmond's finest dining room.",
    dishes: ["Basteeya: golden phyllo with chicken and spiced almonds", "Saffron Cornish hen with preserved Meyer lemon and pink olives", "Braised lamb shank with honey-kumquat, cinnamon couscous", "Weekend brunch menu"],
    score: 91,
    neighborhood: "Inner Richmond",
    tags: ["Fine Dining", "Michelin Star", "Date Night"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5085,
    name: "Chapeau!",
    address: "126 Clement St, San Francisco, CA 94118",
    lat: 37.7834, lng: -122.4607,
    phone: "(415) 750-9787",
    website: "chapeausf.com",
    instagram: "@chapeau.sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Wed–Sun 5pm–9pm | Closed Mon–Tue",
    cuisine: "French",
    price: 3,
    description: "Chef Philippe Gardelle's Parisian bistro on Clement Street since 1996 — the neighborhood's most authentic taste of France. Escargots, coq au vin, cassoulet, and crème brûlée executed with the confidence of someone who has cooked this menu thousands of times and still means every plate.",
    dishes: ["Escargots", "Cassoulet", "Coq au Vin", "Filet Mignon", "Crème Brûlée"],
    score: 86,
    neighborhood: "Inner Richmond",
    tags: ["French", "Date Night", "Historic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── PRESIDIO HEIGHTS ──────────────────────────────────────────────────────
  {
    id: 5086,
    name: "Sociale",
    address: "3665 Sacramento St, San Francisco, CA 94118",
    lat: 37.7870, lng: -122.4530,
    phone: "(415) 921-3200",
    website: "sfsociale.com",
    instagram: "@sociale_sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Wed 5pm–9pm | Thu–Fri 12pm–2:30pm, 5pm–9pm | Sat 5pm–9pm | Closed Sun",
    cuisine: "Italian",
    price: 3,
    description: "Northern Italian trattoria in Presidio Heights where housemade pastas and seasonal braises anchor a weekly-rotating menu. A hidden garden patio in the city's quietest upscale neighborhood, with a living wine list of food-driven selections that change with the same frequency as the kitchen.",
    dishes: ["Pappardelle with braised duck, porcini, peas, truffle ($33)", "Burrata with snap peas and grilled focaccia ($21)", "Rotating seasonal pork preparation ($48)", "Daily housemade pasta specials"],
    score: 83,
    neighborhood: "Presidio Heights",
    tags: ["Italian", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOB HILL / POLK GULCH ─────────────────────────────────────────────────
  {
    id: 5087,
    name: "Acquerello",
    address: "1722 Sacramento St, San Francisco, CA 94109",
    lat: 37.7917, lng: -122.4215,
    phone: "415-567-5432",
    website: "acquerellosf.com",
    instagram: "@acquerellosf",
    reservation: "Tock",
    reserveUrl: "",
    hours: "Tue–Thu 5:30pm–9:30pm | Fri–Sat 5:30pm–9:45pm | Closed Sun–Mon",
    cuisine: "Italian",
    price: 4,
    description: "Two-Michelin-starred Italian fine dining since 1989 — San Francisco's oldest continuously Michelin-starred restaurant. Chef-owner Suzette Gresham's multi-course compositions honor Piemontese tradition with contemporary restraint: Hokkaido scallop with rhubarb and fennel, glazed beets with smoked ricotta, the kind of precision that makes every detail feel inevitable.",
    dishes: ["Hokkaido scallop with rhubarb, green strawberry, fennel", "Glazed baby beets with smoked ricotta tart", "3, 4, or 5-course prix-fixe compositions", "Housemade pasta preparations", "Seasonal Italian tasting menu"],
    score: 95,
    neighborhood: "Nob Hill",
    tags: ["Fine Dining", "Michelin Star", "Date Night", "Historic"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5088,
    name: "Swan Oyster Depot",
    address: "1517 Polk St, San Francisco, CA 94109",
    lat: 37.7910, lng: -122.4209,
    phone: "(415) 673-1101",
    website: "",
    instagram: "",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Sat 8am–2:30pm | Closed Sun | Cash only",
    cuisine: "Seafood",
    price: 2,
    description: "An 18-seat counter on Polk Street since 1912 — James Beard America's Classics Award winner that hasn't changed its formula in over a century. No website, no reservations, cash only, line forms at 7:45am. Dungeness crab (October–May), raw oysters, and Crab Louie in the most honest room in San Francisco.",
    dishes: ["Raw oysters (daily selection, East & West Coast)", "Crab Louie with sweet Dungeness meat in lemony mayo", "Dungeness crab (seasonal, Oct–May)", "Combo sashimi", "House clam chowder"],
    score: 94,
    neighborhood: "Polk Gulch",
    tags: ["Seafood", "Historic", "Iconic", "James Beard Award", "Local Favorites"],
    indicators: ["hole-in-the-wall"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── FISHERMAN'S WHARF ─────────────────────────────────────────────────────
  {
    id: 5089,
    name: "Gary Danko",
    address: "800 North Point St, San Francisco, CA 94109",
    lat: 37.8058, lng: -122.4206,
    phone: "415-749-2060",
    website: "garydanko.com",
    instagram: "@garydankosf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Thu–Mon 5pm–10pm | Closed Tue–Wed",
    cuisine: "Fine Dining",
    price: 4,
    description: "The city's most polished formal dining room: a Michelin-starred contemporary French-American institution near Fisherman's Wharf since 1999. Chef Gary Danko's evolving tasting menu — the elaborate cheese trolley, the perfectly seared lobster, the chocolate soufflé — defines what San Francisco's special-occasion dining aspires to be.",
    dishes: ["Roast Maine lobster with white corn, tarragon, chanterelles", "Pancetta-wrapped frog legs with garlic purée", "Seared Ahi tuna with avocado, nori, enoki mushrooms", "Chocolate soufflé", "Warm Louisiana butter cake with vanilla bean ice cream"],
    score: 93,
    neighborhood: "Fisherman's Wharf",
    tags: ["Fine Dining", "Michelin Star", "Date Night", "James Beard Award"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── OUTER SUNSET ──────────────────────────────────────────────────────────
  {
    id: 5090,
    name: "Outerlands",
    address: "4001 Judah St, San Francisco, CA 94122",
    lat: 37.7604, lng: -122.5050,
    phone: "(415) 661-6140",
    website: "outerlandssf.com",
    instagram: "@outerlands",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Mon 5pm–9pm | Tue–Thu 5pm–9pm | Fri 5pm–9:30pm | Sat 4:30pm–9:30pm, brunch 9:30am–2pm | Sun 4:30pm–9pm, brunch 9:30am–2pm",
    cuisine: "American",
    price: 2,
    description: "A gathering place on the city's salty western edge — locally sourced, organic fare in a warm driftwood-lined room one block from the Pacific. The SF Chronicle called their burger one of the best in the city; the fresh bread boules, served straight from the oven at 5pm, are the Outer Sunset's best smell. Weekend brunch walks in first-come.",
    dishes: ["Outerlands Burger on house-made potato brioche with hand-cut fries", "Fresh bread boules (Wed–Sun from 5pm)", "Rotating seasonal organic proteins and vegetables", "Weekend brunch classics"],
    score: 86,
    neighborhood: "Outer Sunset",
    tags: ["Brunch", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── NOE VALLEY ────────────────────────────────────────────────────────────
  {
    id: 5091,
    name: "Noe Valley Bakery",
    address: "4073 24th St, San Francisco, CA 94114",
    lat: 37.7512, lng: -122.4334,
    phone: "(415) 550-1405",
    website: "noevalleybakery.com",
    instagram: "@noevalleybakery",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Daily 7am–7pm (weekdays) | 7am–6pm (weekends)",
    cuisine: "Bakery",
    price: 1,
    description: "A San Francisco Legacy Business and Noe Valley institution since 1995. The almond croissants have a devoted following; the seasonal pies — apple, mixed berry, strawberry rhubarb — are the neighborhood's go-to celebration dessert. Small, warm, and deeply rooted in the blocks around it.",
    dishes: ["Almond croissants", "Apple pie", "Mixed berry pie", "Strawberry rhubarb pie", "Mini pie assortment box"],
    score: 80,
    neighborhood: "Noe Valley",
    tags: ["Bakery", "Local Favorites"],
    indicators: ["vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5092,
    name: "Firefly",
    address: "4288 24th St, San Francisco, CA 94114",
    lat: 37.7511, lng: -122.4382,
    phone: "(415) 821-7652",
    website: "fireflysf.com",
    instagram: "@fireflyrestaurant",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Tue–Sat 5:30pm–8:30pm | Closed Sun–Mon",
    cuisine: "American",
    price: 2,
    description: "Noe Valley's most enduring neighborhood restaurant: LGBTQ-owned, seasonal, and quietly excellent for over two decades. Chef Brad Levy's menu ranges from fried heritage chicken with mashed potatoes and biscuit to Moqueca Baiana of rockfish and shrimp, the kind of cooking that makes a neighborhood feel like a community.",
    dishes: ["Fried heritage chicken with mashed potatoes, gravy, buttermilk biscuit", "Gulf shrimp and cheddar grits cake with shishito and bacon", "Furikake-crusted ocean trout with tahini-miso glass noodles", "Moqueca Baiana of rockfish, shrimp, scallops", "Okra and kale gumbo z'herbes with sweet potato fritters"],
    score: 85,
    neighborhood: "Noe Valley",
    tags: ["Local Favorites", "Date Night"],
    indicators: ["lgbtq-friendly"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── BERNAL HEIGHTS ────────────────────────────────────────────────────────
  {
    id: 5093,
    name: "The Front Porch",
    address: "65 29th St, San Francisco, CA 94110",
    lat: 37.7438, lng: -122.4220,
    phone: "(415) 695-7800",
    website: "thefrontporchsf.com",
    instagram: "@thefrontporchsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri 5:30pm–9:30pm | Sat–Sun brunch 9:30am–2:30pm, dinner 5:30pm–9:30pm",
    cuisine: "Southern",
    price: 2,
    description: "Bernal Heights' Southern comfort anchor since 2006 — fried chicken done right, Gulf shrimp and grits, a molasses-brined pork chop. Founded by Josey White and Kevin Cline with 'Southern Mission Hospitality' as the operating principle. Weekend brunch with chicken & waffles is a neighborhood institution.",
    dishes: ["Fried chicken (4-piece or 10-piece bucket)", "Chicken & waffles", "Gulf shrimp and cheddar grits", "Molasses-brined pork chop with smashed yukon and sautéed cabbage", "Burger with creole fries"],
    score: 83,
    neighborhood: "Bernal Heights",
    tags: ["Brunch", "Local Favorites", "Southern"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MISSION (additional) ──────────────────────────────────────────────────
  {
    id: 5094,
    name: "Prubechu",
    address: "2224 Mission St, San Francisco, CA 94110",
    lat: 37.7613, lng: -122.4195,
    phone: "(415) 853-0671",
    website: "prubechu.com",
    instagram: "@prubechusf",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Wed–Sat 12pm–3pm, 5pm–9:30pm | Sun 11am–3pm | Closed Mon–Tue",
    cuisine: "Chamorro",
    price: 2,
    description: "From Guam with love: Chef Shawn Naputi's celebration of Chamorro cuisine is the only place in San Francisco — and one of a handful in the country — serving this distinct Pacific Island tradition. Ko'ko' wings dry-spiced and fried; tinaktak of coconut-braised beef with hand-made egg noodles; kelaguen ceviche'd in lemon and coconut. Wholly original.",
    dishes: ["Ko'ko' Wings (dry-spiced fried chicken, lemon fina'denne')", "Crispy Rainbow Trout Eskabeche", "Tinaktak (coconut-braised beef, hand-made egg noodles)", "Gulf Shrimp Kelaguen & Coconut Titiyas", "Chicken Kelaguen & Coconut Titiyas"],
    score: 88,
    neighborhood: "Mission",
    tags: ["Chef-Driven", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COW HOLLOW / PACIFIC HEIGHTS ──────────────────────────────────────────
  {
    id: 5095,
    name: "Atelier Crenn",
    address: "3127 Fillmore St, San Francisco, CA 94123",
    lat: 37.7983, lng: -122.4358,
    phone: "(415) 440-0460",
    website: "ateliercrenn.com",
    instagram: "@atelier.crenn",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sat 5pm–8:30pm | Closed Sun–Mon",
    cuisine: "Fine Dining",
    price: 4,
    description: "Three Michelin stars. Chef Dominique Crenn — the first female chef in the US to earn two Michelin stars, then three — serves a poetic, pescatarian-forward tasting menu in San Francisco's most artistically intentional dining room. The first plastic-free certified restaurant in the US. Every course is a considered statement.",
    dishes: ["Seasonal pescatarian tasting menu", "Vegetable-centric compositions", "Sustainably sourced seafood preparations", "Artisan cheese course", "Patisserie from the Crenn kitchen"],
    score: 98,
    neighborhood: "Cow Hollow",
    tags: ["Fine Dining", "Michelin Star", "Date Night", "Women-Owned"],
    indicators: ["women-owned", "vegetarian"],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── LOWER PACIFIC HEIGHTS / FILLMORE ──────────────────────────────────────
  {
    id: 5096,
    name: "State Bird Provisions",
    address: "1529 Fillmore St, San Francisco, CA 94115",
    lat: 37.7837, lng: -122.4329,
    phone: "(415) 795-1272",
    website: "statebirdsf.com",
    instagram: "@statebirdprovisions",
    reservation: "Resy",
    reserveUrl: "",
    hours: "Sun–Thu 5:30pm–10pm | Fri–Sat 5:30pm–10:30pm",
    cuisine: "American",
    price: 3,
    description: "The restaurant that redefined modern American dining with a Michelin star and a format borrowed from dim sum: small plates arrive on carts and trays, you point at what looks good. Chefs Stuart Brioza and Nicole Krasinski's fried quail, octopus pancakes, and beef tongue pastrami are SF institutions. The most fun a Michelin-starred room can be.",
    dishes: ["Fried quail (buttermilk, paprika, pepita batter)", "Octopus pancakes", "Red trout with hazelnut-mandarin-garum vinaigrette", "Beef tongue pastrami with capers and parmesan", "Fried rice variations (rotating)"],
    score: 93,
    neighborhood: "Fillmore",
    tags: ["Fine Dining", "Michelin Star", "James Beard Award", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5097,
    name: "The Snug",
    address: "2301 Fillmore St, San Francisco, CA 94115",
    lat: 37.7909, lng: -122.4344,
    phone: "",
    website: "thesnugsf.com",
    instagram: "@thesnugsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon 4pm–10pm | Tue–Thu 4pm–11pm | Fri 4pm–12am | Sat 12pm–12am | Sun 12pm–10pm",
    cuisine: "Cocktails",
    price: 2,
    description: "Cocktail-forward Upper Fillmore bar that prioritizes walk-in energy over reservations. Seasonal drinks — Agretti, Buzz Button, Prickly Pear — with Taco Primo Cali-Mex bites via QR code. The neighborhood's most convivial room for an evening that hasn't started yet.",
    dishes: ["Agretti cocktail", "Buzz Button seasonal cocktail", "Prickly Pear cocktail", "Taco Primo bites (Cali-Mex, ordered via QR code)"],
    score: 80,
    neighborhood: "Pacific Heights",
    tags: ["Cocktails", "Late Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MARINA ────────────────────────────────────────────────────────────────
  {
    id: 5098,
    name: "Tacolicious",
    address: "2250 Chestnut St, San Francisco, CA 94123",
    lat: 37.8004, lng: -122.4406,
    phone: "(415) 582-1584",
    website: "tacolicious.com",
    instagram: "@tacolicious",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 11:30am–9:30pm | Fri–Sat 11am–11pm | Sun 11am–9pm | Happy Hour weekdays 3:30–5:30pm",
    cuisine: "Mexican",
    price: 1,
    description: "Marina's beloved neighborhood taqueria built on housemade organic corn tortillas, antibiotic-free meats, and Rancho Gordo heirloom beans. The Shot-and-a-Beer Braised Chicken taco and Vampiro (griddled pepper jack, carne asada) are why the Chestnut Street corner always has a line for the heated parklet.",
    dishes: ["Shot-and-a-Beer Braised Chicken taco", "Coca-Cola Braised Carnitas taco", "Vampiro (griddled pepper jack, carne asada, habanero salsa)", "Baja Fried Fish (cumin crema, cabbage, pickled red onion)", "Margarita De La Casa"],
    score: 81,
    neighborhood: "Marina",
    tags: ["Mexican", "Casual", "Happy Hour"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },
  {
    id: 5099,
    name: "A16",
    address: "2355 Chestnut St, San Francisco, CA 94123",
    lat: 37.8000, lng: -122.4421,
    phone: "415-598-2252",
    website: "a16pizza.com",
    instagram: "@a16sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Thu 5pm–9:30pm | Fri–Sat 12pm–10pm | Sun 12pm–9:30pm",
    cuisine: "Italian",
    price: 2,
    description: "Named for the Italian motorway that links Puglia and Campania, A16 has held Michelin Bib Gourmand status and a James Beard Award for wine since 2004. The wood-fired Vera Pizza Napoletana (V.P.N. certified) is among the best in the city, and the Italian wine program — focused on southern Italy's best bottles — is why winemakers eat here when they're in town.",
    dishes: ["Margherita pizza (V.P.N. certified)", "Salsiccia pizza", "Vesuvio pizza (tomato, soppressata, scamorza, chili)", "Braised meatballs", "Artigiana Burrata"],
    score: 88,
    neighborhood: "Marina",
    tags: ["Italian", "Pizza", "Michelin Bib", "James Beard Award"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── COW HOLLOW ────────────────────────────────────────────────────────────
  {
    id: 5100,
    name: "Rose's Cafe",
    address: "2298 Union St, San Francisco, CA 94123",
    lat: 37.7971, lng: -122.4370,
    phone: "(415) 775-2200",
    website: "rosescafesf.com",
    instagram: "@rosescafesf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Tue 9am–3pm | Wed–Sun 9am–4pm, 5pm–9pm",
    cuisine: "Italian",
    price: 2,
    description: "Cow Hollow's European corner cafe since 1997 — a sun-drenched Union Street room where the patio is always full and the menu is exactly the Italian-California simplicity the neighborhood deserves. Breakfast pizzas, daily-changing housemade pasta, and the kind of unpretentious cooking that makes a neighborhood feel complete.",
    dishes: ["Breakfast pizzas", "Housemade pasta (daily-changing specials)", "Seasonal dinner preparations", "Brunch classics (omelets, French toast)", "Italian-California seasonal menu"],
    score: 80,
    neighborhood: "Cow Hollow",
    tags: ["Italian", "Brunch", "Patio"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── JACKSON SQUARE ────────────────────────────────────────────────────────
  {
    id: 5101,
    name: "Bix",
    address: "56 Gold St, San Francisco, CA 94133",
    lat: 37.7969, lng: -122.4029,
    phone: "415-433-6300",
    website: "bixrestaurant.com",
    instagram: "@bixsf",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon–Fri bar from 4:30pm, dining from 5:30pm | Sat–Sun dining from 5pm",
    cuisine: "American",
    price: 3,
    description: "Through an alley in the old Barbary Coast, Bix's neon sign and two-story supper-club room feel like a 1940s San Francisco that never quite ended. White-jacketed service, live jazz nightly, modern American seasonal menus — Dungeness Crab Tagliatelle, Petrale Sole, American Wagyu. Phone reservations only. One of the city's most atmospheric rooms.",
    dishes: ["Dungeness Crab Tagliatelle", "Petrale Sole Meunière", "Pan Seared Ora King Salmon", "Duck Hash à la Bix", "American Wagyu New York", "Deviled Eggs with truffles"],
    score: 89,
    neighborhood: "Jackson Square",
    tags: ["Date Night", "Cocktails", "Historic", "Iconic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── EMBARCADERO / SOMA ────────────────────────────────────────────────────
  {
    id: 5102,
    name: "Yank Sing",
    address: "101 Spear St, San Francisco, CA 94105",
    lat: 37.7924, lng: -122.3936,
    phone: "415-781-1111",
    website: "yanksing.com",
    instagram: "@yanksing",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Fri 11am–3pm | Sat–Sun 10am–3pm | Closed Mon",
    cuisine: "Dim Sum",
    price: 2,
    description: "Third-generation family-owned dim sum (founded 1958) — a James Beard America's Classics Award winner and Michelin Bib Gourmand. Over 100 rotating dishes arrive from traditional pushcarts in a contemporary Rincon Center dining room: Peking duck carved tableside, XLB soup dumplings, har gao. The most polished dim sum experience in Northern California.",
    dishes: ["Peking Duck with lacquered skin and fluffy buns", "Char Siu Bao (sweet-savory pork buns)", "Pork Xiao Long Bao (soup dumplings)", "Har Gao (shrimp dumplings)", "100+ rotating dim sum varieties"],
    score: 90,
    neighborhood: "Embarcadero",
    tags: ["Dim Sum", "Michelin Bib", "James Beard Award", "Historic"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── CHINATOWN ─────────────────────────────────────────────────────────────
  {
    id: 5103,
    name: "Z & Y Restaurant",
    address: "655 Jackson St, San Francisco, CA 94133",
    lat: 37.7959, lng: -122.4060,
    phone: "415-981-8988",
    website: "zandyrestaurant.com",
    instagram: "@zandyrestaurant",
    reservation: "walk-in",
    reserveUrl: "",
    hours: "Mon, Wed–Sun 11:30am–3pm, 4:30pm–9pm | Closed Tue",
    cuisine: "Sichuan",
    price: 2,
    description: "Chef Lijun Han's award-winning Sichuan restaurant in Chinatown — Michelin Bib Gourmand since 2012. Chef Han previously served as Executive Chef at the Chinese Consulate-General and cooked for two Chinese presidents. The Fish Filet with Flaming Chili Oil is the dish that made the reputation; the tea smoked duck and kung pao chicken are the benchmarks.",
    dishes: ["Fish Filet with Flaming Chili Oil (house signature)", "Tea Smoked Duck", "Kung Pao Chicken", "Tan Tan Noodles", "Salt & Pepper Crab"],
    score: 87,
    neighborhood: "Chinatown",
    tags: ["Michelin Bib", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── POLK GULCH ────────────────────────────────────────────────────────────
  {
    id: 5104,
    name: "Sorella",
    address: "1760 Polk St, San Francisco, CA 94109",
    lat: 37.7931, lng: -122.4209,
    phone: "415-359-1212",
    website: "sorellasf.com",
    instagram: "@sorella_sf",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Tue–Sat 5pm–9pm | Closed Sun–Mon",
    cuisine: "Italian",
    price: 2,
    description: "The casual sister concept from the Acquerello team (two-Michelin-star), opened 2021. Venetian-style cicchetti at the bar, proper Italian pastas and mains in the dining room — the kind of relaxed Italian that the city's most accomplished kitchen does as a love letter to neighborhood eating.",
    dishes: ["Cicchetti: arancini, meatballs, fried pizzetta", "Lasagna", "Spaghetti", "Rotating Italian bar snacks", "Seasonal Italian mains"],
    score: 83,
    neighborhood: "Polk Gulch",
    tags: ["Italian", "Cocktails", "Date Night"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  },

  // ── MISSION (additional) ──────────────────────────────────────────────────
  {
    id: 5105,
    name: "Delfina",
    address: "3621 18th St, San Francisco, CA 94110",
    lat: 37.7614, lng: -122.4243,
    phone: "415-552-4055",
    website: "delfinasf.com",
    instagram: "@delfinarestaurant",
    reservation: "OpenTable",
    reserveUrl: "",
    hours: "Mon–Sat 5:15pm–10pm | Sun 5pm–9pm",
    cuisine: "Italian",
    price: 3,
    description: "Mission District's Michelin-starred Italian anchor: Craig and Anne Stoll's daily-changing seasonal menu has been one of the city's most consistent pleasures since 1998. The pasta is the foundation — simple, seasonal, and made with the kind of care that makes a $28 tagliatelle feel like the right choice. Sister to Pizzeria Delfina next door.",
    dishes: ["Daily-changing seasonal pasta (menu at delfinasf.com)", "Seasonal Italian antipasti", "Wood-roasted mains", "Handmade pasta preparations", "Italian-California wine list"],
    score: 88,
    neighborhood: "Mission",
    tags: ["Italian", "Michelin Star", "Date Night", "Local Favorites"],
    indicators: [],
    bestOf: [],
    photos: [],
    photoUrl: "",
    trending: false,
    verified: "2026-04-28"
  }
];

// ── Insert script ──────────────────────────────────────────────────────────
const html = fs.readFileSync(FILE, 'utf8');

// Find the SF_DATA declaration (both copies — the app has two)
const declarationPattern = /const SF_DATA\s*=\s*\[/g;
let match;
const positions = [];
while ((match = declarationPattern.exec(html)) !== null) {
  positions.push(match.index);
}

if (positions.length === 0) {
  console.error('ERROR: SF_DATA declaration not found');
  process.exit(1);
}
console.log(`Found ${positions.length} SF_DATA declaration(s) at positions: ${positions.join(', ')}`);

// Find the end of each SF_DATA block and insert before the closing ];
// We insert as a batch after the last existing card in each block
let output = html;
let offset = 0;

const cardJson = NEW_CARDS.map(c => '  ' + JSON.stringify(c)).join(',\n');
const insertBlock = ',\n' + cardJson;

// Process each declaration from last to first to preserve offsets
for (let i = positions.length - 1; i >= 0; i--) {
  const pos = positions[i] + offset;
  // Find the closing ]; of this SF_DATA array
  // Walk from the declaration forward, tracking bracket depth
  let depth = 0;
  let inStr = false;
  let escape = false;
  let insertAt = -1;

  for (let j = pos; j < output.length; j++) {
    const ch = output[j];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inStr) { escape = true; continue; }
    if (ch === '"' && !escape) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        insertAt = j;
        break;
      }
    }
  }

  if (insertAt === -1) {
    console.error(`ERROR: Could not find closing ] for SF_DATA at position ${positions[i]}`);
    process.exit(1);
  }

  output = output.slice(0, insertAt) + insertBlock + '\n' + output.slice(insertAt);
  offset += insertBlock.length + 1;
}

// Integrity check: count SF cards in output
const sfStart = output.indexOf('const SF_DATA');
const sfEnd = output.indexOf('];', sfStart);
const block = output.slice(sfStart, sfEnd);
const cardCount = [...block.matchAll(/"id":\d+/g)].length;
console.log(`SF card count after insert: ${cardCount} (expected ${73 + NEW_CARDS.length})`);

if (cardCount !== 73 + NEW_CARDS.length) {
  console.error('ERROR: Card count mismatch — aborting write');
  process.exit(1);
}

fs.writeFileSync(FILE, output, 'utf8');
console.log(`✅ Wrote ${NEW_CARDS.length} new SF cards (IDs ${NEW_CARDS[0].id}–${NEW_CARDS[NEW_CARDS.length-1].id})`);
console.log('New neighborhoods added: Castro, NoPa, Hayes Valley, Fillmore, Inner Richmond, Presidio Heights, Nob Hill, Polk Gulch, Outer Sunset, Noe Valley, Bernal Heights, Cow Hollow, Marina, Jackson Square, Embarcadero, Chinatown');
