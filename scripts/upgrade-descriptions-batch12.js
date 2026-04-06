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

// Batch 12: IDs 1240-1266
const upgrades = {
  1240: "Major Food Group's Columbus Circle Italian is pure theater — tableside Caesar salads, a rigatoni that arrives in a cloud of steam, and a dining room designed to make everyone look important. The food is crowd-pleasing rather than revolutionary, but when you're splitting a wagyu carpaccio with friends at 10 PM and the music is loud, that's exactly what you want. The scene is the point. Resy reservations.",
  1241: "Ralph Lauren's private clubhouse on East 55th Street is the most aspirational restaurant in Midtown. The Polo Burger is one of the best in the city, the Cobb salad is impeccable, and the equestrian-themed room makes you feel like you're dining inside a Ralph Lauren ad — which is, of course, entirely the point. Getting a table requires patience and a Resy alarm. The bar is slightly more accessible.",
  1242: "The Frenchette team at Rockefeller Center serves the most accessible French food in Midtown — steak frites, oysters, and a happy hour that draws a well-dressed after-work crowd. The dining room buzzes with energy, the wine list is sharp and affordable, and the creme brulee is textbook. If you work in Midtown, this is your default. If you're visiting, it's better than anything near Times Square.",
  1243: "Keith McNally brought Pastis back from the dead in 2019, and the Meatpacking classic picked up exactly where it left off. The moules frites, the steak tartare, and the brunch French toast are all perfectly executed French bistro fare. The sidewalk tables are the best people-watching in the Meatpacking District. The fact that it feels unchanged after a decade away is either comforting or uncanny. Both.",
  1244: "Andrew Carmellini's Tribeca Italian inside the Greenwich Hotel is the kind of restaurant that makes you want to move downtown. The sheep's milk ricotta with honey is the iconic opener, the lamb Bolognese is rich and satisfying, and the brunch is one of the best in lower Manhattan. The bar is walk-in friendly and lively. Robert De Niro's hotel gets a lot right, and this restaurant is Exhibit A.",
  1245: "Nobu Matsuhisa's Financial District outpost serves the Japanese-Peruvian fusion that launched a global empire. The black cod miso is the dish that made Nobu famous — buttery, sweet, and caramelized to perfection. The yellowtail jalapeno and the rock shrimp tempura are equally essential. The space is massive and buzzy. It's not cheap, it's not quiet, and it's still one of the best splurges downtown.",
  1246: "Major Food Group's Midtown power restaurant in the iconic Seagram Building is American grandeur at its most theatrical. The tableside preparations — Dover sole, steak Diane, baked Alaska — are dinner as performance. The room is stunning, the cocktails are precise, and the clientele looks like a casting call for a prestige drama. Jackets suggested. Resy reservations. This is where grown-ups dine.",
  1247: "Michael Solomonov brought his Philly Israeli grill to a Williamsburg rooftop, and the result is one of the most fun restaurants in Brooklyn. The meal starts with a mezze spread that would be a complete dinner anywhere else, then moves to wood-fired meats and vegetables. The lamb skewers are outstanding. The rooftop setting with Manhattan views is electric on summer evenings. Resy.",
  1248: "Charlie Bird in SoHo set the template for the modern NYC wine bar — great pastas, a killer natural wine list, and a soundtrack curated like a DJ set. The farro salad with radishes and mint became iconic. The cacio e pepe is outstanding. The room is perpetually buzzy. It opened the door for a generation of food-and-wine spots that followed. The roast chicken for two is an under-ordered masterpiece.",
  1249: "Clare de Boer and Jess Shadbolt's SoHo townhouse restaurant is quietly one of the best in the city. The cooking is French-Italian with a restraint that lets perfect ingredients speak. The chicken for two and the trout amandine are both extraordinary. The seasonal vegetables are treated with more respect than most restaurants give their proteins. No flash, just substance. Resy.",
  1250: "The copper oven at Pasquale Jones produces some of the most blistered, beautiful pies in Manhattan — the clam pizza is worth canceling plans for. Nolita doesn't need another Italian spot, but this one justifies its existence with handmade pastas that rival places twice the price. Come hungry. The cacio e pepe pizza shouldn't work, but it absolutely does. Walk-ins at the bar.",
  1251: "Jody Williams's tiny West Village gastrothèque is the most charming restaurant in New York. French small plates, natural wines, and a candlelit space so intimate that strangers become friends by dessert. The croque monsieur is perfect, the steamed mussels are briny and delicious, and the chocolate mousse is a commitment worth making. No reservations — walk in and wait. Cash only.",
  1252: "Keith McNally's West Village Italian has a Tuscan farmhouse warmth that makes every visit feel like a family dinner in Florence. The brick chicken, the cacio e pepe, and the lemon ricotta pancakes at brunch are all outstanding. The patio is one of the best in the Village. The wine list is Italian and affordable. Sunday morning brunch here is one of the most pleasant rituals in New York.",
  1253: "The most iconic waterfront restaurant in New York. Dining at River Cafe under the Brooklyn Bridge with the Manhattan skyline blazing across the water is a cinematic experience that no photograph can capture. The tasting menu is refined American, the wine list is encyclopedic, and the chocolate marquise is legendary. Jacket required. Book for sunset. This is where you celebrate the big moments.",
  1254: "DUMBO Mediterranean with floor-to-ceiling windows framing the Manhattan Bridge — the kind of view that makes tourists and locals alike stop chewing to stare. The wood-grilled branzino, the lamb chops, and the hummus are all solid. Weekend brunch is excellent. The outdoor terrace in summer is one of the best dining patios in Brooklyn. Resy. The view does at least half the work, and the food holds up its end.",
  1255: "Jerald Head and Nhung Dao's Lower East Side Vietnamese restaurant started as a pop-up and became one of the most exciting restaurants downtown. The menu changes frequently — one night it's pho, another it's bun dau — and that unpredictability is the magic. The sister wine bar Lai Rai is next door. Plastic stools, uncomfortable seating, and food that makes none of that matter. Walk-in only.",
  1256: "Quality Branded's Midtown steakhouse does everything you want a modern steakhouse to do — great cuts, creative appetizers, and over-the-top desserts. The tuna tartare stacked like a tower is the showpiece starter. The prime rib is outstanding. The ice cream sundae for dessert is absurd in the best way. Buzzy, fun, and designed for groups who want to eat well without the stuffy white-tablecloth energy.",
  1257: "Stephen Starr turned a Chelsea warehouse into a 16,000-square-foot Asian temple with a 16-foot Buddha, communal tables, and a menu that spans dumplings to crispy calamari salad to lobster fried rice. It's theatrical, it's loud, and it's been packed since 2006. The edamame dumplings are the gateway, the short rib is the commitment, and the space itself is the star. Great for large groups.",
  1258: "The Meatpacking seafood restaurant with a rooftop, sushi bar, and a scene that operates more like a nightclub than a restaurant after 10 PM. The truffle sashimi is the Instagram hit, the Cantonese lobster is genuinely good, and the crowd is beautiful and knows it. Not the place for a quiet dinner. Absolutely the place for a birthday, a celebration, or a Tuesday night that becomes a story. Resy.",
  1259: "Tao's downtown Chelsea location is an 11,000-square-foot Asian mega-restaurant centered around a 16-foot Buddha and a menu that hits every Asian cuisine from sushi to Peking duck. The food is better than it has any right to be for a restaurant this size and this scene-driven. The miso black cod competes with Nobu. Late night the energy shifts to full nightclub. An experience more than a restaurant.",
  1260: "Lavo's Midtown Italian is where upscale dining meets nightlife. The one-pound meatball is the signature — an Instagram phenomenon before Instagram existed. The skirt steak is excellent, the shareable desserts are enormous, and after 10 PM on weekends, the dining room becomes a party. Not subtle, not quiet, and not apologizing for any of it. The brunch party on Saturdays is legendary.",
  1261: "Soho House's DUMBO Italian has the best waterfront views of the Manhattan Bridge from any restaurant table in Brooklyn. The handmade pastas are solid, the burrata is creamy, and the weekend brunch draws a well-dressed Brooklyn crowd. The outdoor terrace in summer is spectacular. It's a hotel restaurant that transcends hotel restaurant — the setting elevates everything on the plate.",
  1262: "Major Food Group's coastal Italian under the High Line is a glass-enclosed greenhouse serving Italian Riviera-inspired dishes with a garden party energy. The crudite tower is a showpiece, the lobster fra diavolo is rich and spicy, and the seasonal crudo changes daily. The brunch is lively. The connection to the High Line above makes it a perfect pit stop on a West Side walk.",
  1263: "A candlelit Serbian cafe in the East Village that feels like a secret from Belgrade. The cevapi (grilled sausages), the burek (flaky pastry), and the grilled lamb are all hearty, soulful, and cheap. The rakia selection is the most extensive in the city. The atmosphere is dark, romantic, and slightly bohemian. Open late, perfect for a date that starts weird and ends wonderfully. Resy.",
  1264: "The buzziest Italian-American in SoHo from the Nolita Hospitality crew. Rigatoni alla vodka, chicken parm, tiramisu — all the classics done with polish and energy. The sidewalk tables on Crosby Street are prime people-watching. The vibe is perpetually festive. Getting a table requires Resy speed and luck. When you're in, the experience delivers. It's the restaurant that makes SoHo feel alive.",
  1265: "The Torrisi team resurrected El Quijote inside the Chelsea Hotel, and the result drips with vintage glamour. Lobster, paella, garlic shrimp — Spanish classics served in a room that feels like a 1970s fever dream in the best way. The cocktails are strong, the energy is electric, and the late-night crowd makes this one of the most interesting scenes in Chelsea. Open late. Resy.",
  1266: "One of the best Sichuan restaurants in Manhattan, hiding near the Port Authority where nobody would think to look for great food. Chef Zhongqing Wang's steamed whole fish with ground pork, the tofu pudding with chile oil, and the spicy rabbit are all outstanding. The dishes arrive in playful serveware — birds, donkey carts. Cheap, authentic, and fiery. OpenTable. Eater 38 pick.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 12: Upgraded', count, 'descriptions');

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
