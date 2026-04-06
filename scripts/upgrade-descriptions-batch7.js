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

// Batch 7: IDs 1121-1140
const upgrades = {
  1121: "Bowery Ballroom is the gold standard for mid-size live music in New York. The 550-capacity room has perfect sightlines, outstanding sound, and a booking calendar that reads like a who's-who of indie and alternative music. The balcony is the best spot if you want to see everything. The downstairs bar has cheaper drinks. Every band you love played here before they got famous.",
  1122: "Birdland has been a Times Square jazz institution since 1949 — Charlie Parker, John Coltrane, and Thelonious Monk all played the original location. The current 44th Street space hosts world-class jazz nightly with a $20-40 cover and a full dinner menu. The Sunday Afro-Cuban night is legendary. Sit close to the stage — in a room this intimate, every seat is the best seat.",
  1123: "Union Hall in Park Slope combines a bocce court, a library lounge, a bar, and a basement live music venue into one of Brooklyn's most versatile hangout spots. The upstairs is perfect for casual drinks and bocce, the basement hosts indie bands and comedy. The backyard opens in summer. It shouldn't all work together, but it does. The kind of bar that becomes your default.",
  1124: "The Blue Note on West 3rd Street is the world's most famous jazz club, and the caliber of talent that passes through is staggering. Shows are ticketed with a food and drink minimum, and yes, the prices reflect the legacy. Late-night jam sessions (after midnight) are cheaper and often just as good as the headline shows. The room is intimate — every seat has a story.",
  1125: "Empanada Mama in Hell's Kitchen is open 24 hours and serves 40+ varieties of empanadas that range from classic beef to wild card options like cheeseburger and Nutella. At $3-4 each, ordering a dozen for the table is the move. The plantains are excellent, the sangria flows freely, and at 3 AM on a Saturday, this place is absolutely electric. Cash only. Essential late-night fuel.",
  1126: "Spicy Village on Forsyth Street in Chinatown serves the big tray chicken — a mountain of hand-pulled noodles topped with braised chicken in a fiery chili broth — and it's one of the most exciting dishes in downtown Manhattan. The cumin lamb noodles are equally devastating. Tiny space, no decor, BYOB, and food that obliterates everything within a five-block radius.",
  1127: "Sugarfish brought its LA omakase-for-the-people concept to NYC, and the Trust Me menu — where the chef decides — is one of the best sushi values in Manhattan. Warm rice, clean cuts, and nori that crackles. No substitutions, no California rolls, no complaints. Multiple locations now, but the Flatiron original has the most energy. The blue crab hand roll is the finale that makes people gasp.",
  1128: "A tiny East Village taqueria with a real trompo spinning behind the counter — actual al pastor, shaved to order, in a city where most 'al pastor' is a lie. The carne asada is excellent, the salsa verde is fiery, and the horchata is cool relief. Cash only, no seats, and a line that forms at dinnertime. This is the taco spot that homesick Mexicans in NYC actually eat at.",
  1129: "Wo Hop has been serving chow mein in a Chinatown basement since 1938. The fluorescent lights, the formica tables, and the menu of 200+ Chinese-American dishes are all unchanged. Come at 2 AM after a night out and order the egg foo young, the chow fun, and the pork fried rice. It's not elevated, it's not trendy, and it's one of the most honest restaurants in New York. Cash only.",
  1130: "The seafood taco sibling to Los Tacos No. 1 inside Chelsea Market. Ceviche tostadas piled high with shrimp, octopus, and fresh fish — bright, acidic, and perfect for a quick market lunch. The fish tacos are excellent, the shrimp taco is the sleeper hit, and the aguachile is fire. Same counter-service energy as the original, same line, same quality. No seats. Eat standing up.",
  1131: "Maison Premiere in Williamsburg turned an oyster bar into an event. Half-shell oysters, absinthe cocktails, and a Parisian-meets-New Orleans atmosphere that makes every visit feel like a special occasion. The happy hour ($1 oysters, 4-6 PM) is the best deal in Brooklyn. The garden is magical in summer. The bartenders wear suspenders and know more about absinthe than anyone should.",
  1132: "Jacob's Pickles on the Upper West Side serves buttermilk biscuits the size of your head, fried chicken that's legitimately excellent, and pickled everything. The portions are absurd — order the biscuit appetizer and reconsider your entree plans. Weekend brunch has a line that wraps around Amsterdam Avenue. The craft beer list is better than you'd expect. Come starving.",
  1133: "Totto Ramen on West 52nd Street serves paitan broth — a rich, creamy chicken ramen that's an alternative to the pork tonkotsu that dominates NYC ramen. The spicy ramen with extra garlic and extra noodles is the power order. No reservations, cash only, and a line that wraps around the block every single night. The wait is 30-60 minutes. It moves. Bring patience.",
  1134: "A hole-in-the-wall on 50th Street that's been serving the best cubano sandwich in Midtown for decades. The counter-service Dominican-Cuban lunch spot is packed with construction workers and office workers who know that the pernil, the rice and beans, and the platanos are all excellent and all under $10. Cash only, no English needed, and the kind of place that makes Midtown feel real.",
  1135: "Ai Fiori at the Langham hotel is Michael White's Michelin-starred Italian-French fusion, and the pasta program is world-class. The lobster creste di gallo and the black truffle tajarin are both extraordinary. The dining room is elegant without being stuffy, and the bar menu is one of the best Midtown lunch deals. One Michelin star. The wine list goes absurdly deep into Italian regions.",
  1136: "Marea on Central Park South serves some of the best Italian seafood in America. The fusilli with bone marrow and octopus is the signature — rich, bold, and unforgettable. The crudo is pristine, the view of Central Park is lovely, and the prices are what you'd expect for this address. One Michelin star. The bar is the best-kept secret — walk in for a seat and order the pastas.",
  1137: "Una Pizza Napoletana on the Lower East Side earned #1 pizza in the world from 50 Top Pizza, and Anthony Mangieri's obsessive approach to Neapolitan pizza-making justifies the ranking. Simple menu, perfect execution — just a handful of pies, no slices. The margherita is a masterclass in restraint. Expect a line, expect to wait, and expect to understand why people make pilgrimages for pizza.",
  1138: "JG Melon on the Upper East Side has been serving the best pub burger in New York since 1972. The cottage cheese on the side is non-negotiable — it's tradition. The Bloody Mary is excellent, the atmosphere is old-school UES tavern, and everyone from prep school kids to Vogue editors has a regular table. Cash only. No frills. Just one of the best burgers in the city, period.",
  1139: "Cafe Sabarsky inside the Neue Galerie is what happens when a museum cafe takes food as seriously as the art. Viennese cuisine — the schnitzel, the strudel, the Klimt-era atmosphere — in a wood-paneled room overlooking Central Park. The Sacher torte is the best in New York. Come for the art, stay for the coffee and linzer torte. Weekend brunch is civilized and beautiful.",
  1140: "Barney Greengrass on Amsterdam Avenue has been the Sturgeon King since 1908. The smoked fish — sturgeon, sable, nova — is carved by hand and served on bagels with cream cheese in a dining room that hasn't changed in decades. Scrambled eggs with nova is the power order. Sunday morning is the scene — UWS families, old-timers, and the occasional celebrity. Cash only upstairs.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 7: Upgraded', count, 'descriptions');

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
