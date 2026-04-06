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

// Batch 5: IDs 1081-1100
const upgrades = {
  1081: "Egg Shop took a single concept — eggs — and built an entire cult around it. The egg sandwich on a brioche bun with sriracha mayo is one of the best breakfast sandwiches in the city. The avocado toast is better than it has any right to be. Nolita location is tiny, so expect a wait on weekends. Lunch bowls are underrated. Coffee is solid. The vibe is aggressively pleasant.",
  1082: "Sadelle's is what happens when Major Food Group opens a Jewish deli. The tower of smoked fish on a platter is absurdly photogenic and genuinely excellent. The bagels are made in-house, the sticky buns are legendary, and the dining room feels like a Hollywood set. Expensive for a deli? Absolutely. Worth it? Also absolutely. SoHo brunch at its most theatrical.",
  1083: "Brooks Headley left a Michelin-starred pastry chef gig to open a vegetarian burger joint in the East Village, and somehow it works perfectly. The Superiority Burger itself is a revelation — a tiny, smashed, crispy patty that converts carnivores. The wrap of the day changes constantly. The fries are outstanding. James Beard Award winner, Eater 38 staple, and one of the most joyful restaurants in NYC.",
  1084: "Banh mi for under $5 on Grand Street — crispy baguette, daikon and carrot, cilantro, jalapeno, and your choice of protein. The classic pork is the move. Cash only, no English menu needed, just point and eat. This is the Vietnamese sandwich shop that Chinatown expats argue about and tourists haven't found yet. The line is short and the sandwiches are extraordinary.",
  1085: "Thai Son on Baxter Street has been the Chinatown pho destination for decades. The broth is rich, deeply beefy, and simmered for hours. The rare beef pho is the standard order — the meat cooks in the bowl. Cheap, fast, and packed with locals at every meal. Not fancy, not trying to be. Just outstanding pho in a neighborhood that takes its noodle soup very seriously.",
  1086: "Shake Shack started as a hot dog cart in Madison Square Park and became the most successful fast-casual chain in America. The ShackBurger — Angus beef, American cheese, ShackSauce — is the benchmark. The crinkle-cut fries are excellent, the frozen custard is criminal, and the original Madison Square Park location still has the best energy. The line is part of the experience.",
  1087: "The Spotted Pig was one of the most important restaurants of the 2000s, and its legacy is complicated. April Bloomfield's gastropub in the West Village defined a generation of cooking before it closed amid controversy. The burger and the gnudi were legendary. The building on 11th Street is quiet now. Listed here as a historical reference — the restaurant is permanently closed.",
  1088: "Joe's Shanghai in Chinatown has been serving soup dumplings since before soup dumplings were cool. The pork and crab XLB are the classic order — thin skin, scalding broth, and a filling that's deeply savory. The dining room is chaotic, the service is brusque, and the communal tables mean you're sitting with strangers. This is Chinatown at its most authentic. Cash preferred.",
  1089: "This 24-hour Ukrainian diner on 2nd Avenue has been the East Village's emotional support restaurant since 1954. Pierogi, borscht, challah French toast, and a clientele that ranges from hungover NYU students to 80-year-old babushkas. The counter seats are the best in the house. Open 24 hours means it's always there for you — at brunch, at 3 AM, and every moment in between.",
  1090: "Cho Dang Gol on 35th Street serves Korean tofu stew (soondubu jjigae) that arrives bubbling like molten lava, and it's one of the most comforting meals in the city. The silky homemade tofu is the star, and you can customize the spice level. Koreatown is packed with options, but this one stands above for its purity and consistency. Lunch specials are an insane value.",
  1091: "Congee Village on the Bowery serves the kind of sprawling Chinese-American menu that requires 20 minutes to read. The congee is excellent — silky rice porridge with a dozen protein options. The salt and pepper shrimp, the scallion pancakes, and the hot pot options are all solid. Large groups, lazy susans, and a dining room that seats 300. This is Chinatown dining at its most festive.",
  1092: "A Moroccan-Mediterranean corner restaurant in the East Village that's been a neighborhood institution for over 30 years. The shakshuka, the lamb tagine, and the couscous are all excellent. The sidewalk tables on St. Marks are prime people-watching territory. Brunch is the scene — weekend mornings bring lines. The Moroccan mint tea is the best in the neighborhood.",
  1093: "Missy Robbins's pasta-focused sibling to Lilia in Williamsburg, and it might actually be the better restaurant. The cacio e pepe, the mafaldini, and the wood-fired focaccia are all stunning. The space is huge compared to Lilia, which means actually getting a table is possible. Reservations on Resy. The bar seats overlooking the open kitchen are the best in the house.",
  1094: "A Cantonese-Caribbean mashup in Bed-Stuy from Calvin Eng that earned critical raves and a Michelin nod. The chili crisp chicken, the jook with Chinese sausage, and the cocktails are all inventive and deeply personal. The space is small, the music is great, and the energy is pure Brooklyn. Reservations on Resy — book ahead, this place stays packed.",
  1095: "Scarr Pimentel hand-mills his own flour for the pizza dough at this LES slice shop, and you can taste the difference. The plain slice has a nutty, complex flavor that most pizzerias can't touch. The toppings are minimal because the crust IS the show. The late-night hours (open until 3 AM on weekends) make it essential post-bar fuel. Cash only, always a line, always worth it.",
  1096: "Yonah Schimmel has been baking knishes on Houston Street since 1910, and the recipe hasn't changed because it doesn't need to. The potato knish — golden, crispy, filled with creamy potato — is a New York institution. The kasha knish is for the adventurous. The shop itself is a time capsule, and eating a knish on the sidewalk outside is as New York as it gets.",
  1097: "Turbo Pizza on Spring Street makes a surprisingly good slice that flies under the radar compared to its SoHo neighbors. Quick, cheap, hot, and reliable — the kind of no-nonsense pizza shop that used to be on every corner and is slowly disappearing. The pepperoni is solid, the plain slice is better than average, and the location near the subway makes it a perfect grab-and-go.",
  1098: "The most legendary comedy club in America. Dave Chappelle, Amy Schumer, Chris Rock, and Jerry Seinfeld all do surprise drop-ins on random Tuesday nights. The shows are intimate, the cover is reasonable, and the energy of watching a comedian you saw on Netflix perform three feet from your face is unmatched. Book online — shows sell out. The MacDougal Street location is the original.",
  1099: "Levain Bakery started on West 74th Street with 6-ounce cookies that weigh more than some steaks. The chocolate chip walnut is the signature — gooey center, crispy edges, and a sugar rush that lasts hours. There are locations everywhere now, but the original UWS basement is the pilgrimage site. Arrive before noon on weekends or accept a 30-minute wait. Worth it. Obviously.",
  1100: "Chelsea Market is the food hall that invented the modern food hall. Built inside a former Nabisco factory where the Oreo was created, it now houses 35+ vendors including Los Tacos No. 1, The Lobster Place, and Li-Lac Chocolates. The High Line entrance is directly above. Weekday lunches are manageable; weekends are a zoo. Come hungry, leave happy, and stop at Doughnuttery for dessert.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 5: Upgraded', count, 'descriptions');

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
