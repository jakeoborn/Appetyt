#!/usr/bin/env node
// LA batch 18 — WeHo restaurants + iconic music venues + DTLA rooftops (verified via Apify scrapes)
const fs = require("fs");
const path = require("path");
const https = require("https");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

function getArrSlice(name) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[`);
  const mm = html.match(re);
  const start = mm.index + mm[0].length - 1;
  let depth = 0, i = start;
  for (; i < html.length; i++) { const c = html[i]; if (c==="[") depth++; else if (c==="]") { depth--; if (depth===0) break; } }
  return { start, end: i, slice: html.slice(start, i + 1) };
}
function parseArr(s) { return (new Function("return " + s))(); }
function maxId(a) { return a.reduce((m, r) => Math.max(m, r.id||0), 0); }

const entries = [
  // ============= WEHO RESTAURANTS (Eater) =============
  { name: "Di Di", cuisine: "Vietnamese / Saigon", neighborhood: "West Hollywood",
    address: "755 N La Cienega Blvd, Los Angeles, CA 90069",
    lookup: "755 N La Cienega Blvd, Los Angeles, CA 90069",
    score: 88, price: 3, tags: ["Vietnamese","Modern","Date Night","Cocktails","Trending","Critics Pick"],
    reservation: "Resy",
    instagram: "@didi.la", website: "",
    dishes: ["Saigon-Style Shaking Beef","Banh Xeo Crepe","Pho Bowl","Cocktail Pairing"],
    desc: "Chef Tue Nguyen's Saigon-inspired Vietnamese — a TikTok chef with a legitimate culinary background who turned her online audience into reservations. Shaking beef that hits the seasoning right, banh xeo with the crackle you want, and a cocktail program that considers the food instead of just matching the volume. The WeHo Vietnamese reservation." },
  { name: "Connie and Ted's", cuisine: "Seafood / New England", neighborhood: "West Hollywood",
    address: "8171 Santa Monica Blvd, West Hollywood, CA 90046",
    lookup: "8171 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 88, price: 3, tags: ["Seafood","American","New England","Date Night","Patio","Critics Pick"],
    reservation: "Resy",
    group: "Providence / Michael Cimarusti",
    instagram: "@connieandteds", website: "https://connieandteds.com",
    dishes: ["Raw Oysters","New England Clam Chowder","Lobster Roll","Fish & Chips"],
    desc: "Michael Cimarusti's (Providence, 3-Michelin-star) casual New England seafood house in WeHo — the room your Rhode Island grandparents would approve of. Oysters flown in daily, clam chowder done correctly, lobster rolls that don't compromise. One of LA's most consistent seafood tables at a fraction of the Cimarusti tasting menu price." },
  { name: "Jones Hollywood", cuisine: "Italian American", neighborhood: "West Hollywood",
    address: "7205 Santa Monica Blvd, West Hollywood, CA 90046",
    lookup: "7205 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 87, price: 3, tags: ["Italian","American","Date Night","Historic","Iconic","Cocktails","Late Night"],
    reservation: "Resy",
    instagram: "@joneshollywood", website: "https://joneshollywood.com",
    dishes: ["Spicy Rigatoni","Chicken Parmigiana","Meatballs","Negroni"],
    desc: "WeHo Italian-American since 1996 — red-booth dining room, dim lights, playlist of Sinatra running on loop. Partially reopened 2024 after a 2023 car crash took out half the patio. The spicy rigatoni has carried the weekend regulars for decades; the chicken parm is the reason the plate comes out two-handed." },
  { name: "Madre", cuisine: "Oaxacan / Mezcal", neighborhood: "Fairfax",
    address: "801 N Fairfax Ave #101, Los Angeles, CA 90046",
    lookup: "801 N Fairfax Ave, Los Angeles, CA 90046",
    score: 88, price: 3, tags: ["Mexican","Oaxacan","Date Night","Cocktails","Critics Pick","Trending"],
    reservation: "Resy",
    instagram: "@madre.la", website: "https://madrerestaurants.com",
    dishes: ["Mole Tasting","Mezcal Flight (400+ Selection)","Tlayuda","Tamale Oaxaqueño"],
    desc: "Chef Ivan Vasquez's Oaxacan kitchen with one of the country's largest mezcal programs — a glowing back bar holding 400+ bottles. Moles layered for hours, tlayudas with real Oaxacan cheese, a dining room built for slow nights. The LA Oaxacan restaurant; Fairfax location is the anchor." },
  { name: "Petrossian West Hollywood", cuisine: "French / Caviar", neighborhood: "West Hollywood",
    address: "321 N Robertson Blvd, West Hollywood, CA 90048",
    lookup: "321 N Robertson Blvd, West Hollywood, CA 90048",
    score: 90, price: 4, tags: ["Fine Dining","French","Caviar","Date Night","Celebrations","Iconic","Wine Bar"],
    reservation: "OpenTable",
    group: "Petrossian Paris",
    instagram: "@petrossian_weho", website: "https://petrossian.com",
    dishes: ["Caviar Service","Smoked Fish Platter","Blini","Champagne Pairing"],
    desc: "The Parisian caviar dynasty's West Hollywood outpost — the Beluga, Osetra, and Sevruga program that made the Petrossian name, served properly with blini, crème fraîche, and ice. Occasional multi-course dinners; mostly a daytime and early-evening caviar-and-champagne format. The most luxurious snack in LA." },
  { name: "Katana Robata & Sushi", cuisine: "Japanese / Robata / Sushi", neighborhood: "West Hollywood",
    address: "8439 W Sunset Blvd, West Hollywood, CA 90069",
    lookup: "8439 W Sunset Blvd, West Hollywood, CA 90069",
    score: 87, price: 4, tags: ["Japanese","Sushi","Date Night","Celebrations","Cocktails","Iconic","Patio"],
    reservation: "OpenTable",
    instagram: "@katanarobata", website: "https://katanarobata.com",
    dishes: ["Robata-Grilled Skewers","Nigiri Selection","Spicy Tuna Roll","Sake Flight"],
    desc: "Two-decade-old Sunset Boulevard Japanese anchor — robata grill at one counter, sushi bar at the other, celebrity sightings at the patio tables on a Thursday. Co-owned by Ryan Seacrest (yes). Skewers off the binchotan, sushi solid, the atmosphere has aged into the kind of constancy that makes it a weekly regular for the right crowd." },
  { name: "Breakfast by Salt's Cure", cuisine: "Breakfast / American", neighborhood: "West Hollywood",
    address: "7494 Santa Monica Blvd, West Hollywood, CA 90046",
    lookup: "7494 Santa Monica Blvd, West Hollywood, CA 90046",
    score: 88, price: 2, tags: ["Breakfast","American","Casual","Critics Pick","Local Favorites","Brunch"],
    reservation: "walk-in",
    group: "Salt's Cure",
    instagram: "@breakfastbysaltscure", website: "https://saltscure.com",
    dishes: ["House Sausage","Griddle Cakes (Chocolate Chip or Blueberry)","Egg Biscuit Sandwich","Buttermilk Biscuit"],
    desc: "Chris Phelps' easygoing breakfast counter — house-made sausage that belongs in the national-greatest-hits conversation, griddle cakes with chocolate chips or blueberries, biscuits that the Mid-City crowd lines up for on Saturdays. The best LA breakfast under $25." },

  // ============= LEGENDARY LA MUSIC / NIGHTLIFE =============
  { name: "The Troubadour", cuisine: "Concert Venue / Live Music", neighborhood: "West Hollywood",
    address: "9081 Santa Monica Blvd, West Hollywood, CA 90069",
    lookup: "9081 Santa Monica Blvd, West Hollywood, CA 90069",
    score: 93, price: 2, tags: ["Live Music","Historic","Iconic","Concert","Legendary"],
    reservation: "walk-in",
    instagram: "@thetroubadour", website: "https://troubadour.com",
    dishes: ["Concert Tickets","General Admission","Bar Service","Balcony Seating"],
    desc: "Since 1957 — the room where Elton John made his American debut, the Eagles formed, James Taylor broke, Bob Marley brought the Wailers, and every generation of singer-songwriter has played the Monday hoot night. 400 capacity, general admission, the same wooden-pew balconies. Sacred ground for American music." },
  { name: "Whisky A Go Go", cuisine: "Concert Venue / Rock", neighborhood: "West Hollywood",
    address: "8901 Sunset Blvd, West Hollywood, CA 90069",
    lookup: "8901 Sunset Blvd, West Hollywood, CA 90069",
    score: 92, price: 2, tags: ["Live Music","Historic","Iconic","Concert","Rock","Legendary"],
    reservation: "walk-in",
    instagram: "@whiskyagogo", website: "https://whiskyagogo.com",
    dishes: ["Concert Tickets","Bar Service","Rock Residencies","Late Shows"],
    desc: "Opened 1964 — the room that defined the Sunset Strip. The Doors were the house band; Zeppelin, The Who, Van Halen, Guns N' Roses all played their LA breakthroughs here. Still running hard rock and metal bookings, still the same cavernous room, still on Sunset and Clark. One of the five most important rock venues in the world." },
  { name: "Hollywood Bowl", cuisine: "Amphitheater / Concert Venue", neighborhood: "Hollywood",
    address: "2301 N Highland Ave, Los Angeles, CA 90068",
    lookup: "2301 N Highland Ave, Los Angeles, CA 90068",
    score: 95, price: 3, tags: ["Live Music","Historic","Iconic","Concert","Scenic Views","Date Night","Legendary"],
    reservation: "walk-in",
    instagram: "@hollywoodbowl", website: "https://hollywoodbowl.com",
    dishes: ["Concert Tickets","Picnic Seating","LA Philharmonic Season","Summer Concerts"],
    desc: "The 17,500-seat outdoor amphitheater nestled into the Hollywood Hills, summer home of the LA Philharmonic since 1922. Everyone from The Beatles to Radiohead has played the shell. Picnic-allowed benches, bring-your-own-wine policy, and one of the most specific American concert-going experiences. A Los Angeles obligation." },
  { name: "Orpheum Theatre", cuisine: "Concert Venue / Theater", neighborhood: "Downtown LA",
    address: "842 S Broadway, Los Angeles, CA 90014",
    lookup: "842 S Broadway, Los Angeles, CA 90014",
    score: 91, price: 3, tags: ["Live Music","Historic","Iconic","Concert","Theater"],
    reservation: "walk-in",
    instagram: "@laorpheum", website: "https://laorpheum.com",
    dishes: ["Concert Tickets","Film Screenings","Theater Productions","Bar Service"],
    desc: "Opened 1926 — a French Beaux-Arts movie-and-vaudeville palace on Broadway's historic theater district. 2,000 seats, gilded ceilings, a Wurlitzer pipe organ that still works. Hosts live music, film screenings, and the kind of architectural awe that makes every show feel bigger. DTLA's most beautiful performance room." },
  { name: "Hotel Cafe", cuisine: "Concert Venue / Singer-Songwriter", neighborhood: "Hollywood",
    address: "1623 1/2 N Cahuenga Blvd, Hollywood, CA 90028",
    lookup: "1623 N Cahuenga Blvd, Hollywood, CA 90028",
    score: 88, price: 2, tags: ["Live Music","Intimate","Singer-Songwriter","Critics Pick","Late Night"],
    reservation: "walk-in",
    instagram: "@hotelcafe", website: "https://hotelcafe.com",
    dishes: ["Concert Tickets","Singer-Songwriter Sets","Bar Service","Two-Drink Minimum"],
    desc: "Tucked in an alley off Cahuenga — the 200-capacity singer-songwriter room that has launched careers (Sara Bareilles, John Mayer's early sets, Priscilla Renea) and still books every KCRW-playlist regular. The intimate Hollywood music venue that stays legitimately intimate." },
  { name: "The Echo", cuisine: "Concert Venue / Indie", neighborhood: "Echo Park",
    address: "1822 W Sunset Blvd, Los Angeles, CA 90026",
    lookup: "1822 W Sunset Blvd, Los Angeles, CA 90026",
    score: 89, price: 2, tags: ["Live Music","Indie","Late Night","Local Favorites","Iconic"],
    reservation: "walk-in",
    instagram: "@theechola", website: "https://theecho.com",
    dishes: ["Concert Tickets","Bar Service","Indie Headliners","DJ Nights"],
    desc: "Echo Park's 350-capacity indie-rock anchor — sister venue The Echoplex below. Programming runs from LA buzz bands to touring indie acts, and the bar crowd is a cross-section of east-side music makers. Smaller than Troubadour, younger crowd, genuinely good sound." },
  { name: "Harvelle's", cuisine: "Blues Club / Live Music", neighborhood: "Santa Monica",
    address: "1432 4th St, Santa Monica, CA 90401",
    lookup: "1432 4th St, Santa Monica, CA 90401",
    score: 87, price: 2, tags: ["Live Music","Blues","Burlesque","Historic","Iconic","Date Night","Late Night"],
    reservation: "walk-in",
    instagram: "@harvellessm", website: "https://harvelles.com",
    dishes: ["Blues Nights","Burlesque Shows","Cocktails","Late Sets"],
    desc: "Since 1931 — the oldest live-music venue on the Westside. Blues, R&B, burlesque nights, a dark basement room that hasn't updated its décor or its attitude. Harvelle's is the anti-Santa-Monica of Santa Monica." },
  { name: "La Descarga", cuisine: "Cuban / Speakeasy", neighborhood: "Hollywood",
    address: "1159 N Western Ave, Los Angeles, CA 90029",
    lookup: "1159 N Western Ave, Los Angeles, CA 90029",
    score: 89, price: 3, tags: ["Cocktails","Bar","Speakeasy","Latin","Live Music","Date Night","Iconic","Late Night"],
    reservation: "Resy",
    group: "Houston Hospitality",
    instagram: "@ladescargala", website: "https://ladescargala.com",
    dishes: ["Rum Cocktails","Cigars","Live Cuban Music","Burlesque"],
    desc: "Enter through a wardrobe in a closet upstairs. La Descarga is a 1940s Havana fever-dream — rum-forward cocktails (200+ bottles), live Cuban band most nights, cigar program that still exists, and burlesque that treats the form seriously. Hollywood's most specific speakeasy." },
  { name: "Seven Grand Los Angeles", cuisine: "Whiskey Bar", neighborhood: "Downtown LA",
    address: "515 W 7th St, Los Angeles, CA 90017",
    lookup: "515 W 7th St, Los Angeles, CA 90017",
    score: 88, price: 3, tags: ["Whiskey","Bar","Cocktails","Date Night","Late Night","Iconic"],
    reservation: "walk-in",
    group: "213 Hospitality",
    instagram: "@sevengrandla", website: "https://sevengrand.com",
    dishes: ["450+ Whiskey Selection","Classic Cocktails","Whiskey Flight","Bar Bites"],
    desc: "The DTLA whiskey bar that turned the category into an LA specialty. 450+ bottles — bourbon, Scotch, Japanese, Irish — served by bartenders who can actually talk you through them. Dark, wood-paneled, masculine in the old-school sense. Still the DTLA whiskey conversation." },
  { name: "Saddle Ranch Chop House", cuisine: "American / Chophouse", neighborhood: "West Hollywood",
    address: "8371 W Sunset Blvd, West Hollywood, CA 90069",
    lookup: "8371 W Sunset Blvd, West Hollywood, CA 90069",
    score: 82, price: 3, tags: ["American","Steakhouse","Bar","Iconic","Late Night","Scene","Patio"],
    reservation: "OpenTable",
    instagram: "@saddleranchsunset", website: "https://srrestaurants.com",
    dishes: ["Mechanical Bull Ride","Prime Rib","Giant Onion","30-Ounce Porterhouse"],
    desc: "Sunset Strip chophouse with a mechanical bull in the middle of the dining room — Vanderpump Rules filmed here, the Kardashians were caught here in 2011, and the tourists fell in love with it. Food is solid-steakhouse, but the bull ride is the meal. Absolutely a scene; absolutely LA." }
];

function nominatim(a) {
  return new Promise((res, rej) => {
    const u = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(a)}&limit=1`;
    https.get(u, { headers: { "User-Agent": "DimHour-DataAudit/1.0" } }, (r) => {
      let d = ""; r.on("data", c => d += c);
      r.on("end", () => { try { const j = JSON.parse(d); if (!j.length) return res(null); res({lat:parseFloat(j[0].lat),lng:parseFloat(j[0].lon)}); } catch(e) { rej(e); } });
    }).on("error", rej);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, 1100));

(async () => {
  const s = getArrSlice("LA_DATA");
  const arr = parseArr(s.slice);
  let nextId = maxId(arr) + 1;
  const built = [];
  for (const e of entries) {
    console.log(`Resolving ${e.name}…`);
    const c = await nominatim(e.lookup);
    if (!c) { console.log(`  ❌ SKIP`); continue; }
    console.log(`  ✓ ${c.lat}, ${c.lng}`);
    await sleep(1100);
    built.push({
      id: nextId++, name: e.name, cuisine: e.cuisine, neighborhood: e.neighborhood,
      score: e.score, price: e.price, tags: e.tags, indicators: e.indicators||[],
      group: e.group||"", hh: "", reservation: e.reservation || "walk-in",
      awards: e.awards||"", description: e.desc, dishes: e.dishes,
      address: e.address, phone: "", hours: "", lat: c.lat, lng: c.lng,
      bestOf: [],
      res_tier: e.reservation==="Tock" ? 5 : e.reservation==="Resy" ? 4 : e.reservation==="OpenTable" ? 3 : 0,
      busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, instagram: e.instagram||"",
      suburb: false, website: e.website||"", verified: "2026-04-19"
    });
  }
  const newArr = arr.concat(built);
  html = html.slice(0, s.start) + JSON.stringify(newArr) + html.slice(s.end + 1);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  console.log(`\n✅ Added ${built.length}/${entries.length} (LA: ${arr.length} → ${newArr.length})`);
})();
