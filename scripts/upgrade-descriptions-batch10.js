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

// Batch 10: IDs 1192-1219 — remaining Michelin Step 1 additions
const upgrades = {
  1192: "One Michelin star for an Edomae omakase in Chelsea from the Sushi Noz team. Chef Junichi Matsuzaki serves a 15-course counter experience for $195 that's one of the best sushi values in the city at this level. Smaller and more intimate than the UES flagship. The fish sourcing is identical to big brother Noz. A serious omakase at a (relatively) accessible price.",
  1193: "One Michelin star for a 20-course omakase served twice nightly at a sleek Flatiron counter. Chef Shigeyuki Tsunoda's Noda is obsessive — the aged fish program rivals any in the city, and the supplemental uni course is worth every extra dollar. Reservations drop on Resy and sell out instantly. At $400, it competes with spots charging $600. The best value in high-end omakase.",
  1194: "One Michelin star for wood-fired Korean in Flatiron. Chef Hoyoung Kim grills everything over live fire and the results are smoky, primal, and deeply satisfying. The seven-course $140 tasting menu is one of the most affordable Michelin-starred meals in Manhattan. The mushroom course over charcoal is unforgettable. Resy reservations. A restaurant that feels like a campfire feast elevated to fine art.",
  1195: "One Michelin star for modern Korean in Flatiron. Chef Brian Kim's Oiji Mi serves a $150 five-course prix fixe that's elegant without being stuffy, plus an a la carte bar menu that might actually be the better way to eat here. The fried chicken is outrageously good. The gochujang butter steak is a sleeper hit. The bar seating is walk-in friendly. Resy for the dining room.",
  1196: "One Michelin star for a Korean tasting menu hidden inside Oiji Mi. Bom is the restaurant within a restaurant — $275 for a 12-course journey through chef Brian Kim's most ambitious Korean cooking. Seasonal banchan, wagyu, and a dessert course that would hold its own at any three-star restaurant. Intimate, creative, and the kind of dining experience that changes how you think about Korean food.",
  1197: "One Michelin star for Emilia-Romagna Italian that has Flatiron pasta lovers in a permanent state of devotion. Stefano Secchi's handmade tortellini in brodo, the tagliatelle al ragu, and the prosciutto di Parma are all extraordinary. The wait for a table is notorious — Resy releases go fast. The bartender's choice pasta at the bar is the insider move. One of the best Italian restaurants in New York.",
  1198: "One Michelin star for an intimate West Village omakase from chef Masatomo Soma, continuing the legacy of founder Yoshihiko Kousaka. The $270 bar omakase ($290 at table) is pristine Edomae sushi served with quiet precision. Fourteen seats. The kind of sushi experience where you lose track of time and courses blur together beautifully. Book on Resy. Bring someone you want to impress.",
  1199: "One Michelin star for Israeli cooking in Greenwich Village from Eyal Shani, the man behind a global empire of vibrant Mediterranean restaurants. The whole cauliflower is the showstopper — roasted until charred and caramelized, served whole. The lamb shoulder and the warm pita bread are both outstanding. The energy is festive, the portions are generous, and the cooking is joyful.",
  1200: "One Michelin star for a 14-seat counter hidden behind an art gallery in Greenwich Village. Brazilian chef Franco Sampogna serves a $245 tasting menu that fuses South American soul with French technique. The intimacy is the point — you're watching every dish come together inches from your face. One of the most unique dining experiences in New York. Book on Resy months ahead.",
  1201: "One Michelin star for Korean ramyun in the West Village — the first noodle shop in history to earn a star, and it earned it honestly. Chef Douglas Kim's bowls are deeply flavored, the broth is complex, and the handmade noodles have a chew that's addictive. The space is tiny, the wait is real, and every bowl feels like it was made specifically for you. Resy reservations.",
  1202: "One Michelin star for Dan Barber's farm-to-table vision in Greenwich Village. Family Meal at Blue Hill serves a $145 four-course family-style dinner with ingredients sourced from Stone Barns farm. The cooking is deceptively simple — seasonal vegetables that taste more like themselves than you thought possible. Weekend lunch ($85) is the accessible entry point. Resy reservations.",
  1203: "One Michelin star for East Village kaiseki from chef Takanori Akiyama. The $250 dinner tasting menu unfolds with the quiet precision of a Japanese tea ceremony — each course seasonal, each plate beautiful. The space is intimate and serene. This is not the flashy sushi spots of Midtown. This is Japanese cooking at its most meditative and precise. Book on Resy. Allow yourself to slow down.",
  1204: "One Michelin star for a 20-course omakase in NoHo at $500 per person. Tadashi Yoshida's restaurant, named for the Japanese town where his father was born, is one of the most ambitious sushi experiences in the city. The aged fish program is extraordinary. The rice is perfect. The counter seats 10. If you're going to spend $500 on sushi, this is where you should spend it.",
  1205: "One Michelin star for a 13-course yakitori tasting menu ($185) from chef Yoshiteru Ikegawa, who runs the legendary Torishiki in Tokyo. Every part of the chicken is grilled over binchōtan charcoal with reverence — heart, liver, skin, thigh, tail. The seasonal vegetable courses are equally impressive. NoHo location. Book on Resy. The most refined chicken dinner of your life.",
  1206: "One Michelin star for Asian-inflected American small plates in the East Village. Thomas Chen's Tuome has been quietly excellent for years — the Berkshire pork for two ($69) with crisp skin and spicy peanut noodle is the dish that defines the restaurant. The duck confit dumplings and the tuna tartare are both outstanding. Book on Resy. Underrated and underhyped.",
  1207: "One Michelin star for a sustainable omakase in the East Village. Bar Miller, sibling to Rosella, serves a 15-course $250 menu focused on responsibly sourced seafood. The philosophy is admirable and the cooking backs it up — every course reflects careful sourcing and skilled technique. The space is intimate and modern. A Michelin star earned the right way.",
  1208: "One Michelin star for a French-Japanese tasting menu in Greenpoint. Chef Yuu Shimano and executive chef Shuji Furukawa serve a $300 dinner that fuses Japanese precision with French luxury. The result is quietly stunning — dishes that look minimal and taste extraordinary. One of the most interesting new Michelin additions. Brooklyn fine dining at its most refined.",
  1209: "One Michelin star for French-Japanese fusion in Tribeca. Chef Mitsunobu Nagae serves a $255 tasting menu and $190 shorter option, plus a la carte. The Japanese inflections on classic French technique create dishes that feel both familiar and surprising. The Tribeca townhouse setting is elegant. OpenTable reservations. The kind of restaurant that serious food people whisper about.",
  1210: "One Michelin star earned at just 70 days old — the youngest restaurant ever to receive the honor. Chef Manabu Asanuma's kaiseki features soba made with flour from his parents' farm in Japan. The 10-12 course $295 tasting menu in Tribeca is personal, seasonal, and deeply connected to its roots. A beautiful story told through extraordinary food. Book on Resy.",
  1211: "One Michelin star for a seven-course American tasting menu ($112) on the Lower East Side. Chefs Sam Clonts and Raymond Trinh created one of the most affordable Michelin-starred experiences in the city. The cooking is creative, seasonal, and unpretentious. The LES location gives it a neighborhood energy that most tasting menu spots lack. Resy reservations. An absolute steal.",
  1212: "One Michelin star for Edomae-style sushi at a Tribeca counter. Chef Shion Uino's $400 omakase is focused and elegant — pristine fish, warm rice, and a quiet intensity that demands your full attention. The aged tuna and the kohada are consistently extraordinary. The space at 69 Leonard is intimate and serious. Resy reservations. For sushi purists only.",
  1213: "One Michelin star for Top Chef winner Budda Lo's Tribeca restaurant inside a Marky's Caviar shop. The 12-course $285 tasting menu features caviar in nearly every course, which sounds excessive until you taste it — each application is different and justified. Lo earned his star by being fearless and precise. The location inside a caviar shop is peak New York absurdity. Resy.",
  1214: "One Michelin star for Mexican fine dining in Chinatown from chef Fidel Caballero, who evolved his acclaimed pop-ups into a permanent restaurant. The $125 tasting menu features creative mole courses, duck taquiza, and a la carte options. The cooking is deeply personal and rooted in Mexican tradition. One of the most original restaurants in the city. Resy reservations.",
  1215: "One Michelin star for a Financial District omakase that offers both a $495 sushi bar experience and a $195 Italian-inspired Kappo at tables. Chef Kazushige Suzuki trained in both traditions, and the dual-concept approach is genuinely unique. The sushi is pristine. The Italian Kappo is playful. Choose your adventure. One of the most creative restaurant concepts in downtown Manhattan.",
  1216: "One Michelin star for eclectic New American cooking in Chinatown from chef Sam Lawrence, an Estela alum. The comte tart is a must-order, the seasonal fish is outstanding, and the a la carte menu is curated rather than overwhelming. Walk-in friendly. The Chatham Square location feels hidden and special. One of the freshest voices in the downtown dining scene.",
  1217: "One Michelin star for Edomae sushi in Williamsburg. Chef Cheng Lin serves two omakase options — a premium 18-course ($195) and the Gentei 19-course ($255). The fish is pristine, the rice is warm, and the intimate counter setting is pure focus. One of the best sushi values in Brooklyn at the Michelin level. Resy reservations. A quiet alternative to Manhattan's sushi temples.",
  1218: "One Michelin star for a natural wine bar that happens to serve some of the best food in Williamsburg. Chef Nick Curtola's constantly changing menu pairs creative small plates with an extraordinary selection of minimal-intervention wines. The Four Horsemen is a decade old and still commands lines. LCD Soundsystem's James Murphy is a co-owner. The most effortlessly cool restaurant in Brooklyn.",
  1219: "One Michelin star for a Korean tasting menu hidden in the back of a Long Island City provisions store. Hooni Kim's Meju serves a $235 menu that's intimate, creative, and deeply Korean. The banchan alone is worth the trip. Per Se alum Dae Kim consults. The strangest, most wonderful dining location in Queens — behind a shelf of kimchi jars. Resy reservations.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 10: Upgraded', count, 'descriptions');

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
