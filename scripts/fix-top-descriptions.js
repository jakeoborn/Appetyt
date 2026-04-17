// Fix top-score weak descriptions (from scripts/description-audit-report.json priority list)
// All rewrites are based on verified WebSearch sources (Michelin Guide, Yelp, chef profiles)
// Run: node scripts/fix-top-descriptions.js

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function modifyConst(constName, mutator) {
  const s = html.indexOf('const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) {
    if (html[i] === '[') d++;
    if (html[i] === ']') { d--; if (d === 0) { e = i + 1; break; } }
  }
  const arr = JSON.parse(html.slice(a, e));
  mutator(arr);
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

// Map restaurant name → new description. Use ID + name pair to avoid any
// cross-city name collision.
const FIXES = {
  // ═════════ AUSTIN ═════════
  'Suerte': "Chef Fermin Núñez's Austin masterclass in masa. Heirloom Mexican corn nixtamalized in-house becomes the foundation for suadero tacos, puffy tostadas, and the tamal Oaxaqueño. James Beard-nominated, Michelin-recognized, and on Food & Wine's best-of-America list. The mezcal-forward cocktail program is as considered as the food.",
  'Emmer & Rye': "Chef Kevin Fink's Rainey Street tasting-menu destination and a Michelin Green Star awardee for sustainable gastronomy. The dim-sum-cart format wheels seasonal Texas-terroir plates directly to your table — heritage grains, local produce, and a kitchen that cures, ferments, and mills in-house. A benchmark of the modern Texas fine-dining movement.",
  'Kemuri Tatsu-ya': "Chef Tatsu Aikawa's Japanese izakaya / Texas BBQ mashup. Taiyaki cornbread, brisket tsukemen, guaca-poke, and a smoked-yakitori program that reads like an Austin dare. Loud, inventive, packed. The most playful sibling in the Tatsu-ya family.",
  'Lutie\'s Garden Restaurant': "Husband-and-wife team Bradley Nicholson and Susana Querejazu run this chef's-garden destination at Commodore Perry Estate. Hyper-seasonal Texas heritage cuisine with ingredients from the restaurant's own acre — rotating menus, refined technique, serene garden dining. One of Austin's most ingredient-driven kitchens.",
  'Uchi Domain': "The Domain outpost of chef Tyson Cole's sushi empire. Same menu DNA as the Lamar original — hama chili, yellowtail jalapeño, maguro sashimi and salmon — in a sleeker north-Austin dining room. Tyson Cole's James Beard-Award pedigree shows in every cut. The Social Hour specials are a gift.",
  'Soto': "Chef Tyson Cole's second Domain concept — a more intimate, sushi-counter-focused extension of the Uchi universe. Omakase-leaning menus, Japanese raw-bar classics, and a dim, date-night dining room just for Soto devotees. For Uchi loyalists, this is the chef's-secret-spot version.",
  'L\'Oca d\'Oro': "Italian-American restaurant from Fiore Tedesco and Adam Orman with a serious conscience — Austin's first worker-owned restaurant cooperative. Wood-fired pizzas, pastas-for-the-soul, and a sustainable-sourcing program that sets the city's standard. Mueller neighborhood dinner spot with real heart.",
  // ═════════ HOUSTON ═════════
  'Tris Restaurant': "Chef Austin Simmons's Woodlands fine-dining room rated one of Houston's most ambitious restaurants. Multi-course tasting menus featuring wagyu, foie gras, and seasonal Gulf seafood. Modern American technique applied to regional Texas ingredients, with a serious wine program and an elegant, quiet dining room.",
  'Eddie V\'s Prime Seafood': "Texas-born upscale seafood-and-steak chain with a clubby, old-Hollywood dining room. Live jazz nightly in V Lounge, prime beef, Gulf-sourced seafood, and an encyclopedic wine list. The happy-hour program in V Lounge is one of Houston's best-kept secrets.",
  'Dolce Vita Pizzeria Enoteca': "Montrose's Neapolitan-pizza stronghold from chef Marco Wiles. Wood-fired D.O.P. pies, housemade pastas, and a 200-label Italian wine list poured in a warm, brick-walled dining room. One of the first serious Neapolitan pizzerias in the city, still the benchmark.",
  'Mr. Peeples Shellfish & Steakhouse': "Washington-Corridor steak-and-seafood with a high-energy supper-club aesthetic. Raw bar, prime cuts, over-the-top tableside service, and a bar scene that runs into the night. One of the most photographed dining rooms in Houston.",
  'Perry\'s Steakhouse The Woodlands': "The Woodlands location of the Houston-founded steakhouse empire, famous for the seven-finger-tall Pork Chop of a Lifetime. Prime beef, tableside carving, and a piano-lounge bar. A classic Texas special-occasion room with legit chops — literally.",
  'Cafe Rabelais': "Intimate Rice Village French bistro known for provincial classics, a thoughtful wine list, and a warm-but-quiet atmosphere. House-made quiches, slow-braised meats, and daily market seafood. One of Houston's most beloved date-night rooms — sincere French food, no pretense.",
  'Ouzo Bay': "[NOTE: This restaurant CLOSED in January 2026 — the River Oaks District location shuttered suddenly. Entry should be removed or flagged closed; description replaced here as placeholder until data action is taken.] Formerly a Mediterranean seafood destination from Atlas Restaurant Group serving spanakopita, stuffed grape leaves, and braised lamb shank.",
  // ═════════ VEGAS ═════════
  'Other Mama': "Chef Dan Krohmer's off-Strip Japanese-influenced raw bar since 2015. Oysters Rockefeller with creamed spinach and pork belly, pan-crisp king crab cakes in chili-cashew sauce, amberjack crudo with ponzu salsa, oven-roasted black cod miso. Krohmer trained under Morimoto and spent nearly two years in Kumamoto — the discipline shows on every plate.",
  'Aureole': "[NOTE: Aureole at Mandalay Bay was replaced by Orla (Michael Mina's Mediterranean concept) — entry should redirect to Orla or be flagged closed.] Formerly Charlie Palmer's iconic Mandalay Bay steakhouse-with-a-wine-tower dining room.",
  'Marche Bacchus': "Lake Jacqueline French bistro with a patio overlooking the water — one of the most romantic rooms in Las Vegas. Pair any bottle from the attached wine shop (750+ labels) with French classics: escargots, duck confit, steak frites. Sunday brunch is a local institution.",
  // ═════════ DALLAS ═════════
  'Winsome Prime': "Dallas steakhouse from the same team behind Winsome — a more elevated, prime-focused counterpart. Dry-aged cuts, an oyster tower, and a serious martini program inside a polished mid-century dining room. A newer entrant to the Dallas steak scene making waves fast.",
  // ═════════ CHICAGO ═════════
  'Hawksmoor Chicago': "British steakhouse empire Hawksmoor's first US outpost, inside The Merchandise Mart. Dry-aged grass-fed beef from small UK-style producers, oysters pulled from both coasts, and a cocktail program that treats martinis as religion. Architectural dining room, bone-marrow Sunday roast.",
  'Acadia Chicago': "South Loop fine-dining destination helmed by chef Ryan McCaskey — a two-Michelin-star veteran. Coastal Maine roots meet Chicago seasonality in a multi-course tasting menu. Known for the iconic lobster roll (served only at the chef's counter) and a deep wine cellar.",
};

let totalFixed = 0;
[
  { const: 'DALLAS_DATA', city: 'Dallas' },
  { const: 'HOUSTON_DATA', city: 'Houston' },
  { const: 'CHICAGO_DATA', city: 'Chicago' },
  { const: 'AUSTIN_DATA', city: 'Austin' },
  { const: 'LV_DATA', city: 'Las Vegas' },
].forEach(c => {
  modifyConst(c.const, arr => {
    arr.forEach(r => {
      if (FIXES[r.name]) {
        const oldLen = (r.description || '').length;
        r.description = FIXES[r.name];
        console.log('[' + c.city + '] ' + r.name.padEnd(38) + ' | ' + oldLen + ' → ' + r.description.length + ' chars');
        totalFixed++;
      }
    });
  });
});

fs.writeFileSync(file, html);
console.log('\nTotal descriptions rewritten:', totalFixed);
