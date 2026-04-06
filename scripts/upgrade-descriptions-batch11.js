const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));

// Batch 11: IDs 1220-1239 — Upscale casual & date night (Step 2)
const upgrades = {
  1220: "The Frenchette team brought a 1930s Upper East Side bistro back from the dead, and the revival is stunningly good. The $135 prix fixe features frog legs, mackerel in white wine sauce, and the namesake calf's head — unapologetic old-school French. The oeuf en gelee is a time machine. Reservations on OpenTable drop two weeks ahead and vanish. One of the most exciting restaurant resurrections in New York history.",
  1221: "Below-street-level East Village wine bar that became one of the most desirable casual spots in the city without ever raising its voice. The red shrimp sizzling in garlic oil is the signature, the half chicken is a sleeper hit, and the chocolate cake slab is non-negotiable dessert. The wine list is eclectic and affordable. The table under the stairs is the coveted people-watching seat. Book on Resy.",
  1222: "Harold Moore brought his beloved Commerce back from the dead, this time on the Upper East Side. The sweet potato tortelloni with hazelnuts is the hit that followed him, and the Parker House rolls in the bread basket are dangerous. The coconut cake is legendary — do not leave without it. Cinnamon rolls available for weekend pickup. The kind of chef-owned neighborhood spot every block deserves.",
  1223: "Grand Central Oyster Bar has occupied this vaulted, tiled basement since 1913, and the architecture alone is worth the trip. Twenty-five varieties of oysters on the half shell, pan roasts that warm your soul, and a New England clam chowder that sets the standard. Closed weekends, which is your loss and also the point — this is a power-lunch destination. The bar is the best seat in the house.",
  1224: "Alex Raij and Eder Montero's Chelsea Basque restaurant captures everything that makes San Sebastian dining magical. The bomba rice with shrimp, uni, and mushrooms is extraordinary. The octopus carpaccio, the boquerones, and the wood-fired peppers are all textbook pintxo bar perfection. The wine list is Iberian and goes deep. Ask about specials — gooseneck barnacles when in season are a revelation.",
  1225: "Georgian cuisine's breakout moment in New York, and Chama Mama delivers. The khachapuri — a boat of bread filled with molten cheese, butter, and a runny egg — is the dish that made this place famous. The charcoal kebabs and dumpling-like khinkali are both excellent. The Georgian wine list features varietals you've never heard of and will immediately want to drink more of. Three locations now.",
  1226: "The Unapologetic Foods team relocated Adda from Long Island City to the East Village, doubled the space, and won Eater's Best Comeback Award. The goat biryani is a sleeper hit, the butter chicken experience requires advance ordering and is worth the planning, and the vegetarian menu is genuinely exceptional. Chef Chintan Pandya doesn't do timid at any of his restaurants, and Adda is his most accessible.",
  1227: "Sunny Lee's Chinatown wine bar won Eater's Best Wine Bar award, and the banchan alone is worth the trip. Every dish is vegetable-forward and creative — even the house salad is extraordinary in her hands. The natural wine list is fun and affordable. After a glowing NYT review, Lee set aside more walk-in spots. The space is tiny, the flavors are huge, and the hospitality is genuinely warm.",
  1228: "April Bloomfield's triumphant return to New York after a complicated departure. The Fort Greene restaurant with Gabriel Stulman is her at the top of her game — the herb-butter roasted half chicken with Parmesan potatoes is reason enough to go to Brooklyn. The chicken liver mousse toast is rich and perfect. The spicy ginger cake for dessert is aggressively good. House wine is $9 a glass — a rare value.",
  1229: "Billy Durney's Red Hook tavern is the neighborhood restaurant everyone wishes was in their neighborhood. The burger is one of the best in Brooklyn — a thick, juicy, perfectly seared patty with melted American cheese. The oysters are fresh, the roast chicken is excellent, and the vibe is polished but unpretentious. Walk-ins welcome. The kind of place where a random Tuesday becomes special.",
  1230: "One of NYC's hottest new restaurants, and earning it honestly. Chef Chakriya Un and partner Alexander Chaparro transformed their Kreung Cambodia pop-up into a Crown Heights gem celebrating Khmer cuisine. The coconut corn, the fried squid with salted duck egg, and the crispy whole fish are all extraordinary. The space is tiny and colorful — every detail handmade by their community. Resy reservations are brutal.",
  1231: "Four Gramercy Tavern vets opened this Ridgewood restaurant, and it gets better with age. The house-made mortadella, the wood-fired polenta bread, and the war-style crispy potatoes are all outstanding. The dry-aged beef is butchered in-house. The limited double cheeseburgers sell out nightly — arrive before 6 PM if you want one. The natural wine list punches above Ridgewood's weight class.",
  1232: "Palestinian family-style dining in Brooklyn Heights from the team behind Ayat in Bay Ridge. The mansaf — lamb with fermented yogurt sauce over rice — is a showpiece that feeds the table. The ouzi beef and the flatbreads are both excellent. Great for groups at the last minute or reserved ahead. One of the most important Middle Eastern restaurants in Brooklyn. Halal.",
  1233: "The walk-in hand roll bar from the Sushi Noz team serves the same pristine fish at a fraction of the price. Temaki sets, a la carte nigiri, and omakase options ranging from under $100 to $155. No reservation needed — just walk in. The quality-to-price ratio is absurd for fish this good. The UES location is convenient and less scene-y than downtown sushi spots. Takeout on Uber Eats.",
  1234: "The most romantic restaurant in New York, and it has been for decades. A converted 1767 carriage house in the West Village with a fireplace, candlelight, and live piano that make every dinner feel like a proposal. The tasting menu is refined American, the beef Wellington is the showpiece, and the chocolate souffle requires a 20-minute wait that builds anticipation perfectly. Resy reservations essential.",
  1235: "Keith McNally's Greenwich Village bistro is home to the Black Label Burger — a dry-aged blend that is, by most accounts, the best burger in New York City. The bone marrow appetizer, the steak frites, and the dark mahogany interior all scream old-money downtown. Getting a table is still an exercise in persistence. The bar seats are first-come, first-served and worth the gamble. Brunch is excellent.",
  1236: "This NoHo Italian in a candlelit former antiques shop has been a date-night institution for over 25 years. The seasonal market-driven menu changes constantly, the whole branzino is outstanding, and the award-winning wine cellar in the basement holds rare bottles worth exploring. The rustic farmhouse atmosphere feels transported from Umbria. Reservations on Resy. The kind of restaurant that makes you fall in love.",
  1237: "Danny Meyer's 60th-floor restaurant at 28 Liberty Street has the most dramatic views in New York dining. Looking out at the Manhattan skyline from the Financial District while eating refined seasonal American food is a cinematic experience. The tasting menu is strong, the cocktails are excellent, and sunset through those windows will stop your conversation mid-sentence. Resy reservations.",
  1238: "Marie-Aude Rose's French cafe inside the Roman and Williams Guild design shop is one of the most beautiful restaurants in SoHo. The croque monsieur, the duck confit, and the madeleines are all classically French and beautifully executed. The space blends seamlessly with the design shop — every surface is gorgeous. All-day hours mean you can come for croissants and stay for dinner. A design-lover's dream.",
  1239: "Ed Szymanski's tiny West Village seafood restaurant serves some of the most elegant fish in Manhattan from a kitchen the size of a closet. The Dover sole, the lobster toast, and the chocolate pot de creme are all executed with Michelin-level precision. Twenty seats, no waste, and a waiting list that should tell you everything. Reservations on Resy are extremely limited. Worth the chase.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 11: Upgraded', count, 'descriptions');

let great = 0;
arr.forEach(r => {
  const len = (r.description||'').length;
  const sentences = (r.description||'').split(/[.!]/).filter(s=>s.trim().length>10).length;
  if(len >= 250 && sentences >= 4) great++;
});
console.log('Great descriptions:', great, '/', arr.length);

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
