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

// Batch 2: IDs 1021-1040
const upgrades = {
  1021: "Daisuke Nakazawa trained under Jiro Ono — yes, that Jiro — and his West Village omakase is one of the purest sushi experiences in America. Twenty-one courses of pristine Edomae-style nigiri at a 10-seat counter. The rice is the tell — warm, seasoned, and perfectly packed. Reservations are tough but the dining room prix fixe is slightly easier to book than the counter.",
  1022: "Danny Meyer's Gramercy Park institution has been quietly excellent for three decades. The front tavern is walk-in friendly with seasonal a la carte, and the back dining room serves a $175 tasting menu that rivals spots charging twice as much. Michael Anthony's vegetable-forward cooking is revelatory. Thursday nights the bar scene is electric — this is where NYC restaurant industry people actually eat.",
  1023: "A 130-year-old Brooklyn supper club resurrected from the dead, and the revival is stunningly good. Gas-lit chandeliers, leather banquettes, and a raw bar that feels like a time machine to Gilded Age New York. The baked clams, the steak Diane prepared tableside, and the old-fashioned cocktails are all perfect. Reservations are hard — try Tuesday or Wednesday for the best shot.",
  1024: "Mark Iacono's Carroll Gardens pizzeria serves exactly two things: whole pies and calzones. That's it. No slices, no appetizers, BYOB, cash only, and a line that wraps around the block every single night. The crust is thin, blistered, and extraordinary. Some say it's the best pizza in New York — the wait is 90 minutes minimum, and nobody who's been there would argue it isn't earned.",
  1025: "Marcus Samuelsson's Harlem landmark is part restaurant, part cultural institution, part community center. The fried chicken is legendary, the cornbread is addictive, and the weekend gospel brunch is a genuine NYC bucket-list experience. Live music, a stunning room, and the energy of 125th Street pouring in through the windows. No reservations for brunch — arrive by 10 AM or accept your fate.",
  1026: "This candlelit SoHo bistro has been seducing downtown New Yorkers since 1975 and hasn't changed its formula because it doesn't need to. The steak au poivre, the artichoke vinaigrette, and the dark mahogany interior are all frozen in the best possible version of 1970s New York. Late-night kitchen is open until 2 AM. The kind of place where you accidentally stay for four hours.",
  1027: "Enrique Olvera brought Mexico City's most innovative cooking to the Flatiron District, and the result is the most important Mexican restaurant in New York. The duck carnitas, the corn husk meringue, and the uni tostada are all mind-bending. The hustle for a table is real — Resy drops go in seconds. The mezcal program is world-class. This is not Tex-Mex. This is fine dining through a Mexican lens.",
  1028: "The most exciting Indian restaurant to open in New York in a generation. Chintan Pandya cooks regional Indian food that most Americans have never encountered — the fiery goat intestine stew, the whole catfish, and the biryani with goat brain are all acts of culinary bravery. One Michelin star, a James Beard Award, and lines out the door in the East Village. Not for the timid. Absolutely for the adventurous.",
  1029: "Thai meets American diner in the most delightful way possible. The khao soi French toast at brunch is unhinged genius, and the crab fried rice for dinner is the dish that made this place famous. Nolita is drowning in boring restaurants — Thai Diner is not one of them. The cocktail program punches way above its weight. Walk-ins only, and the wait is always worth it.",
  1030: "Greg Baxtrom's Prospect Heights restaurant grows half its ingredients in the backyard garden, and you can taste the obsession in every bite. The carrot crepe is the signature — so good it's been on the menu since opening. The tasting menu is creative without being pretentious, and the backyard is one of the best outdoor dining experiences in Brooklyn. Reservations on Resy drop weekly — book fast.",
  1031: "Thomas Keller's three-Michelin-star temple above Columbus Circle is the most expensive restaurant in New York, and for the right diner, it justifies every dollar. The nine-course tasting menu ($425) unfolds with surgical precision — the salmon cornets, the oysters and pearls, and the legendary butter-poached lobster are all flawless. This is not a casual dinner. This is a pilgrimage. Jackets required.",
  1032: "Jungsik Yim brought three Michelin stars to Tribeca with a Korean fine dining concept that nobody saw coming. The $325 tasting menu fuses Korean tradition with French technique — the result is food that looks like modern art and tastes like home. The dongchimi ice with octopus and the ganjang gejang are both revelatory. The most underrated three-star restaurant in New York.",
  1033: "Three Michelin stars at an eight-seat Edomae sushi counter in Midtown. Keiji Nakazawa, the sushi master behind Sushi Nakazawa, created a $450 omakase experience that just surpassed Per Se and Le Bernardin in the Michelin pantheon. The rice, the fish, the precision — everything is calibrated to perfection. Book months ahead. This is the hardest table in New York right now.",
  1034: "Gabriel Kreuther brings Alsatian warmth to a luxurious two-Michelin-star dining room across from Bryant Park. The tasting menu ($325) is a masterclass in French-Alsatian technique — the sturgeon and sauerkraut tart is the signature, and the duck with Gewurztraminer is outstanding. The bar room has a more accessible a la carte menu. One of the most underappreciated fine dining experiences in Midtown.",
  1035: "Daniel Boulud's Upper East Side flagship has defined French fine dining in America for three decades. The ornate dining room, the seasonal tasting menu, and the duck en croute are all legendary. One Michelin star that many argue deserves three. The bar at Daniel is one of the best-kept secrets in fine dining — walk in, sit down, and order the burger. Yes, Daniel has a burger. It's incredible.",
  1036: "Rich Torrisi's triumphant return to the kitchen in the landmark Puck Building on Mulberry Street. Italian-American food elevated to Michelin-star levels — the chicken parm, the lobster fra diavolo, and the Sunday gravy pasta are all executed with obsessive precision. Major Food Group's most personal project, and it shows. Reservations drop on Resy and vanish in seconds. Worth the chase.",
  1037: "The world's first Michelin-starred Korean BBQ, and it earns that star on every visit. Simon Kim created a Korean steakhouse where USDA Prime galbi meets a $1,000+ wine list, and somehow it all makes sense. The butcher's feast is the move — let the kitchen decide. The omakase-style counter seats are the best in the house. Flatiron location, impeccable service, and a buzz that never dies.",
  1038: "Ignacio Mattos's Nolita restaurant sits above Houston Street in a room that feels like a secret. The beef tartare with sunchokes, the ricotta dumplings, and the burrata with salsa verde are all deceptively simple and devastatingly good. One Michelin star, a James Beard nomination, and a natural wine list that goes deep. The bar seats are the best — walk in early and claim one.",
  1039: "The first Michelin-starred restaurant dedicated to South Indian cuisine in America. Chef Vijay Kumar's Semma in the West Village serves gunpowder dosa, Chettinad chicken, and uttapam that will recalibrate your entire understanding of Indian food. The Unapologetic Foods team (Dhamaka, Adda) doesn't do timid, and Semma is their most refined statement yet. Reservations on Resy.",
  1040: "Daniel Boulud's soaring seafood-and-vegetable restaurant in the One Vanderbilt skyscraper is one of the most beautiful dining rooms in New York. The six-course tasting menu ($205) focuses on pristine fish and vegetables with French technique. The glass-enclosed space feels like eating inside a terrarium. One Michelin star, and the lunch prix fixe is one of the best deals in fine dining.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 2: Upgraded', count, 'descriptions');

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
