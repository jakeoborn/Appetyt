const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function processCity(varName) {
  const marker = varName + '=';
  const p = html.indexOf(marker);
  if (p === -1) return;
  const arrS = html.indexOf('[', p);
  let d = 0, arrE = arrS;
  for (let j = arrS; j < html.length; j++) { if (html[j] === '[') d++; if (html[j] === ']') { d--; if (d === 0) { arrE = j + 1; break; } } }
  let arr = JSON.parse(html.substring(arrS, arrE));
  const before = arr.length;

  // === STEP 1: Define exact duplicates to remove (keep highest score) ===
  const dupeGroups = {};
  arr.forEach(r => {
    // Normalize name for grouping
    let key = r.name.toLowerCase()
      .replace(/['']/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    // Remove trailing location qualifiers like "(Domain)", "East", "North", "South", "Henderson", etc.
    // But keep distinct concepts like "Taqueria" or "Butcher"
    if (!dupeGroups[key]) dupeGroups[key] = [];
    dupeGroups[key].push(r);
  });

  // Find exact same-location duplicates
  const toRemove = new Set();
  Object.values(dupeGroups).forEach(group => {
    if (group.length <= 1) return;
    // Same name, same neighborhood = exact dupe, keep highest score
    const byNbhd = {};
    group.forEach(r => {
      const nbhd = (r.neighborhood || '').toLowerCase();
      if (!byNbhd[nbhd]) byNbhd[nbhd] = [];
      byNbhd[nbhd].push(r);
    });
    Object.values(byNbhd).forEach(sameLocGroup => {
      if (sameLocGroup.length <= 1) return;
      // Keep highest score, remove others
      sameLocGroup.sort((a, b) => b.score - a.score);
      for (let i = 1; i < sameLocGroup.length; i++) {
        toRemove.add(sameLocGroup[i].id);
        console.log(`  REMOVE dupe: id:${sameLocGroup[i].id} "${sameLocGroup[i].name}" (score:${sameLocGroup[i].score}, keep id:${sameLocGroup[0].id} score:${sameLocGroup[0].score})`);
      }
    });
  });

  // Also remove known near-duplicates with slightly different names
  const nearDupes = {
    // Austin
    "cafe no se": "cafe no sé",
    "quacks 43rd st bakery": "quack's 43rd street bakery",
    "banger's sausage house & beer garden": "bangers sausage house & beer garden",
    "banger sausage house": "bangers sausage house & beer garden",
    "empire control room & garage": "empire control room",
    "stiles switch bbq": "stiles switch bbq & brew",
    "stiles switch bbq north": "stiles switch bbq & brew",
    "terry black's barbecue": "terry black's bbq",
    "live oak brewing company": "live oak brewing",
    "spicy boys fried chicken": "spicy boys",
    "odd duck east": "odd duck",
    "bouldin creek cafe south": "bouldin creek cafe",
    // SLC
    "flanker kitchen + sports bar": "flanker kitchen + sporting club",
    "flanker kitchen": "flanker kitchen + sporting club",
    "felt bar": "felt bar & eatery",
    "le depot brasserie": "le depot",
    "no name saloon": "no name saloon & grill",
    "water witch bar": "water witch",
    "blue copper coffee room": "blue copper coffee",
    "hearth and hill": "hearth and hill (sugar house)",
    // Seattle
    "din tai fung university village": "din tai fung",
    "deep sea sugar and salt": "deep sea sugar & salt",
    "serious pie": "serious pie downtown",
    "ma'ono fried chicken": "ma'ono fried chicken & whisky",
    "sushi by scratch restaurants seattle": "sushi by scratch restaurants",
    "seastar restaurant and raw bar": "seastar restaurant & raw bar",
    // Vegas
    "boa steakhouse las vegas": "boa steakhouse",
    "nobu at paris las vegas": "nobu at paris",
    "black tap vegas": "black tap craft burgers & beer",
    "crafthaus brewery": "crafthaus brewery henderson",
    "gordon ramsay burgr": "gordon ramsay burger",
  };

  // Find the near-dupes by normalized name
  Object.entries(nearDupes).forEach(([dupeName, keepName]) => {
    const dupeEntry = arr.find(r => r.name.toLowerCase() === dupeName);
    const keepEntry = arr.find(r => r.name.toLowerCase() === keepName);
    if (dupeEntry && keepEntry && !toRemove.has(dupeEntry.id)) {
      toRemove.add(dupeEntry.id);
      console.log(`  REMOVE near-dupe: id:${dupeEntry.id} "${dupeEntry.name}" (keeping id:${keepEntry.id} "${keepEntry.name}")`);
    }
  });

  // Remove the duplicates
  arr = arr.filter(r => !toRemove.has(r.id));

  // === STEP 2: Add locations field to multi-location restaurants ===
  // Define multi-location mappings: primary ID -> array of {name, address, neighborhood}
  const multiLocations = {};

  // Find entries that are clearly multi-location variants
  const locPatterns = [
    { base: /^(ramen tatsu-ya)$/i, variants: /^ramen tatsu-ya/i },
    { base: /^(loro)$/i, variants: /^loro /i },
    { base: /^(velvet taco)$/i, variants: /^velvet taco/i },
    { base: /^(torchy's tacos)$/i, variants: /^torchy's tacos/i },
    { base: /^(veracruz all natural)$/i, variants: /^veracruz all natural/i },
    { base: /^(tumble 22)$/i, variants: /^tumble 22/i },
    { base: /^(easy tiger)$/i, variants: /^easy tiger/i },
    { base: /^(jack allen's kitchen)$/i, variants: /^jack allen's kitchen/i },
    { base: /^(lustre pearl)$/i, variants: /^lustre pearl/i },
    { base: /^(eldorado cafe)$/i, variants: /^eldorado cafe/i },
    { base: /^(cosmic coffee)$/i, variants: /^cosmic coffee/i },
    // SLC
    { base: /^(taqueria 27)$/i, variants: /^taqueria 27/i },
    { base: /^(tuk tuk)/i, variants: /^tuk tuk/i },
    { base: /^(oh mai)$/i, variants: /^oh mai/i },
    { base: /^(pretty bird)$/i, variants: /^pretty bird/i },
    { base: /^(hearth and hill)$/i, variants: /^hearth and hill/i },
    { base: /^(aroon thai)$/i, variants: /^aroon thai/i },
    { base: /^(saffron valley)$/i, variants: /^saffron valley/i },
    // Houston
    { base: /^(peli peli)$/i, variants: /^peli peli/i },
    { base: /^(perry's steakhouse)$/i, variants: /^perry's steakhouse/i },
    // Dallas
    { base: /^(hudson house)$/i, variants: /^hudson house/i },
    // Vegas
    { base: /^(lotus of siam)$/i, variants: /^lotus of siam/i },
    { base: /^(juan's flaming fajitas)$/i, variants: /^juan's flaming fajitas/i },
    { base: /^(cafe lola)$/i, variants: /^cafe lola/i },
  ];

  locPatterns.forEach(({ base, variants }) => {
    const primary = arr.find(r => base.test(r.name));
    if (!primary) return;
    const others = arr.filter(r => r.id !== primary.id && variants.test(r.name));
    if (!others.length) return;

    // Build locations array
    const locations = [{ name: primary.neighborhood, address: primary.address }];
    const removeIds = [];
    others.forEach(r => {
      locations.push({ name: r.neighborhood, address: r.address });
      removeIds.push(r.id);
      console.log(`  CONSOLIDATE: id:${r.id} "${r.name}" -> id:${primary.id} "${primary.name}" (adding location: ${r.neighborhood})`);
    });

    primary.locations = locations;
    // Remove the variant entries
    removeIds.forEach(id => {
      const idx = arr.findIndex(r => r.id === id);
      if (idx > -1) arr.splice(idx, 1);
    });
  });

  const after = arr.length;
  console.log(`\n${varName}: ${before} -> ${after} (removed ${before - after})\n`);

  html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
}

console.log('=== DEDUP + MULTI-LOCATION CLEANUP ===\n');
processCity('const AUSTIN_DATA');
processCity('const DALLAS_DATA');
processCity('const HOUSTON_DATA');
processCity('const SLC_DATA');
processCity('const SEATTLE_DATA');
processCity('const LV_DATA');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! All cities cleaned up.');
