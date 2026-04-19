// Hand-authored rewrites of 33 merged-primary descriptions that were written
// as single-location copy. Each new description preserves the original
// factual claims (chefs, awards, signature dishes, neighborhoods — now listed
// accurately) while removing phrasing that implies only one location exists.
//
// Rules applied:
//   - Drop "located in X", "X location of", "worth the drive from Y" framing.
//   - When listing neighborhoods, list the ACTUAL set in the entry's
//     locations[] (so no fabricated sites).
//   - Preserve chef names, awards, signature dishes verbatim where possible.

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function locateArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return null;
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  return { arrS, arrE };
}

function parseArray(varName) {
  const pos = locateArray(varName);
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); }
  catch (e) { return new Function('return ' + src)(); }
}

// keyed by "CITY#ID" → new description
const UPDATES = {
  // --- Dallas ---
  'Dallas#52': "Craft burger concept that originated in Fort Worth in 2012 (Shannon Wynne and Keith Schlabs) and expanded across North Texas. Known for creative burgers, a strong cocktail program, and an extensive craft beer list in a high-energy casual setting.",

  // --- Houston ---
  'Houston#7058': "Louisiana-style seafood chain known for fried shrimp, crawfish, and stuffed redfish. Large portions, lively atmosphere, and a reliable happy hour across multiple Houston-area locations.",
  'Houston#7077': "Classic Houston Vietnamese pho destination with rich, long-simmered broth and generous bowls. Family-run, consistent, and a Gulf Coast Vietnamese-community staple.",
  'Houston#7162': "Michelin Bib Gourmand Texas BBQ from pitmaster Bramwell Tripp — brisket, sausage, and pulled pork that rival the best in the state. The breakfast tacos (served 7-10:30am) are a sleeper hit. Multiple Houston locations.",
  'Houston#7202': "Austin's cult ramen export brought to Houston with rich, deeply flavored tonkotsu broth that's been simmering for 18+ hours. The OG Tonkotsu is the essential order, and the vegan options are surprisingly excellent. One of Houston's best bowls of ramen.",
  'Houston#7230': "Beloved Houston Tex-Mex chain with locations across greater Houston. The green chili queso is habit-forming, the fajitas are sizzling, and the margaritas are generously poured. A Texas original that's the go-to for families.",
  'Houston#7270': "Houston's South African restaurant bringing Cape Town flavor with a whimsical tree-in-the-dining-room interior. The menu draws from African, Dutch, and Malay influences — peri-peri chicken, bobotie, and big-game inspired plates.",
  'Houston#7274': "Aaron Lyons' local and sustainable cafe concept. Farm-to-table breakfast, lunch, and dinner with scratch-made biscuits, local eggs, and a seasonal menu that genuinely changes. A reliable family and brunch spot across multiple Houston-area locations.",
  'Houston#7275': "Houston's favorite patio burger. Mesquite-grilled prime burgers, dogs, and milkshakes — a local burger rite of passage. The Memorial Park location sits under giant live oaks and is the classic post-run spot.",

  // --- Austin ---
  'Austin#5016': "Austin all-day cafe in airy, plant-filled spaces serving inventive breakfast and brunch dishes with fresh, health-conscious ingredients.",
  'Austin#5095': "Austin coffee shop and beer garden with massive shaded patios, food truck lots, and live music. Morning coffee transitions to afternoon craft beer and evening cocktails. Multiple food trucks rotate through. The chickens wandering the lot are very Austin.",
  'Austin#5121': "Austin Korean restaurant bringing refined Korean flavors — bibimbap, Korean fried chicken, and banchan elevated with quality ingredients and careful technique. The cocktail program adds Korean-inspired drinks. One of Austin's best Korean dining experiences.",
  'Austin#5156': "Austin coffee shop in converted houses with massive shaded patios. Craft coffee, pastries, and light bites in peaceful garden settings. Free WiFi and plenty of shade — the local morning coffee ritual.",
  'Austin#5189': "Texas comfort food with a farm-to-table focus — chicken fried steak, Gulf shrimp, and biscuits from a chef who sources from Texas ranches. Multiple Austin-area locations serve the same quality. The brunch is hearty and the happy hour is a value. A Hill Country comfort food staple.",
  'Austin#5218': "Tyson Cole + Aaron Franklin's Asian-smokehouse collaboration — smoked brisket with Thai herbs, coconut curry, and a strong bar program. The original East Austin flagship launched the concept; now multiple locations across Austin. Michelin recognized.",
  'Austin#5244': "Tyson Cole's James Beard Award-winning Japanese restaurant — the hama chili, machi cure, and omakase are legendary. The original South Lamar location put Austin on the national fine dining map, with a second location at The Domain.",
  'Austin#5262': "One of the original Rainey Street bungalow bars that helped transform the neighborhood. Massive patio, cheap beer, and a casual party vibe. The OG Rainey Street experience that started it all.",
  'Austin#5460': "Austin's most beloved ramen shop, serving tonkotsu, chicken, and vegan broths across multiple Austin locations. Started the city's ramen scene and still the benchmark.",

  // --- Salt Lake City ---
  'Salt Lake City#11013': "Chef Viet Pham's Nashville-style hot chicken has become a Salt Lake sensation. Perfectly crispy fried chicken at customizable spice levels on a brioche bun, now across multiple SLC-area locations.",
  'Salt Lake City#11037': "Finnish-inspired craft brewery (kiitos means 'thank you' in Finnish) producing creative, small-batch beers. Known for experimental flavors and fruit-forward sours, with multiple SLC-area taprooms.",
  'Salt Lake City#11046': "The flagship restaurant of the Pago Restaurant Group, pioneering farm-to-table dining in SLC since 2009. Chef-driven seasonal menus highlight relationships with local farms and artisan producers. Two locations across Salt Lake.",
  'Salt Lake City#11065': "Chef Manoli Katsanevas' Greek and coastal Mediterranean restaurant — fresh seafood, lamb, and spreads in warm, neighborhood settings. Salt Lake Magazine dining award winner. The octopus and lamb chops are signatures.",
  'Salt Lake City#11123': "From the team behind Urban Hill (fine dining) — positioned between casual and upscale, perfect for weekend brunch, lunch, or date night. Seasonal American menu with craft cocktails across multiple Utah locations.",
  'Salt Lake City#11151': "Thai restaurant with multiple Salt Lake-area locations. Pad thai, curries, and noodle dishes at accessible prices. A solid neighborhood Thai option.",
  'Salt Lake City#11166': "The place to celebrate a big anniversary in Salt Lake City. Multi-course tasting menus with local ingredients and precise technique. The most intimate fine dining experience in the SLC metro.",
  'Salt Lake City#11190': "Wood-fired pizza and craft beer from a Utah brewpub chain. The Margherita is excellent and the beer selection spans Utah breweries. Multiple Salt Lake-area locations — the original Ogden taproom is the flagship.",
  'Salt Lake City#11359': "Well-regarded Thai kitchen with excellent reviews across multiple SLC-area locations. Authentic Thai curries and noodle dishes.",
  'Salt Lake City#11378': "Beloved Italian deli and market with multiple Utah locations. Same great muffuletta and specialty Italian products at each site.",

  // --- Seattle ---
  'Seattle#9103': "Tom Douglas's pizzeria — wood-fired, artisan pizzas with blistered crusts and seasonal toppings. One of the only places in Seattle slinging crisp Connecticut-style pies. Two locations across downtown Seattle.",
  'Seattle#9150': "Contemporary Vietnamese cornerstone for 25+ years. Co-founders Eric and Sophie Banh — authentic Vietnamese with a modern twist. Elevated regional dishes, bar program, and a loyal Seattle-area following. Capitol Hill flagship plus Bellevue.",
  'Seattle#9178': "Latin-Japanese fusion sushi near Pike Place Market. Creative rolls, sashimi, late-night lounge, and happy hour. A reliable Seattle sushi fix with a lively bar scene. Two Seattle locations.",
  'Seattle#9228': "Authentic hand-made Russian piroshky since 1992 — beef & onion, smoked salmon paté, apple cinnamon roll. The line out the door at Pike Place is legendary; a second Ballard location opens up some breathing room. A Seattle must-do.",
  'Seattle#9231': "Ethan Stowell's Italian pasta house — hand-made rigatoni, gnocchi alla Romana, and long communal tables. The Belltown original plus a Capitol Hill Pike-Pine sister location.",
  'Seattle#9247': "Pan-Asian destination since 1989 — satay bar, Burmese, Thai, and Chinese regional dishes. Downtown flagship plus a Bellevue second. A Seattle benchmark for Asian fine dining with longevity.",
  'Seattle#9386': "Xiaolongbao specialist with thin-skinned soup dumplings, pan-fried Q-bao pork buns, and handmade noodles. Originally Bellevue, now with a Chinatown-ID location — both are always busy.",
};

const cities = {
  'Dallas': 'const DALLAS_DATA',
  'Houston': 'const HOUSTON_DATA',
  'Austin': 'const AUSTIN_DATA',
  'Chicago': 'const CHICAGO_DATA',
  'Salt Lake City': 'const SLC_DATA',
  'Las Vegas': 'const LV_DATA',
  'Seattle': 'const SEATTLE_DATA',
  'New York': 'const NYC_DATA',
};

// Edit bottom-up so earlier positions stay valid
const ordered = Object.entries(cities).sort((a, b) => {
  const ia = locateArray(a[1]).arrS;
  const ib = locateArray(b[1]).arrS;
  return ib - ia;
});

const applied = [];
const missed = [];

ordered.forEach(([city, varName]) => {
  const data = parseArray(varName);
  let dirty = false;
  data.forEach(r => {
    const key = `${city}#${r.id}`;
    if (UPDATES[key]) {
      const old = r.description;
      r.description = UPDATES[key];
      applied.push({ city, id: r.id, name: r.name, old, next: r.description });
      dirty = true;
    }
  });
  if (dirty) {
    const pos = locateArray(varName);
    html = html.substring(0, pos.arrS) + JSON.stringify(data) + html.substring(pos.arrE);
  }
});

// Sanity: any UPDATES key never matched?
const appliedKeys = new Set(applied.map(a => `${a.city}#${a.id}`));
Object.keys(UPDATES).forEach(k => {
  if (!appliedKeys.has(k)) missed.push(k);
});

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('scripts/description-update-report.json', JSON.stringify({ applied, missed }, null, 2));

console.log(`Updated ${applied.length} descriptions${missed.length ? `; missed keys: ${missed.join(', ')}` : ''}`);
applied.forEach(a => console.log(`  ${a.city}#${a.id} "${a.name}"`));
