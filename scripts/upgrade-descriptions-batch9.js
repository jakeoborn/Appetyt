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

// Batch 9: IDs 1172-1191 — Michelin-starred restaurants (Step 1 additions)
const upgrades = {
  1172: "Two Michelin stars and a $550 omakase that's worth selling furniture for. Nozomu Abe's Upper East Side sushi temple serves Edomae-style nigiri with fish aged using techniques that most American sushi chefs haven't even heard of. Fourteen seats, no distractions, and rice so perfectly seasoned it haunts your dreams. Book on Tock months ahead. Weekday lunch seatings are slightly easier to score.",
  1173: "Jean-Georges Vongerichten's Columbus Circle flagship has two Michelin stars and Central Park views that make every dinner feel like a movie. The egg caviar is one of the most famous dishes in fine dining history. The vegetarian tasting menu rivals the main one — a rarity at this level. Lunch prix fixe is one of the great steals in New York fine dining. The bar is walk-in friendly and excellent.",
  1174: "The most expensive restaurant in America, and Masayoshi Takayama makes zero apologies. The $750+ omakase at the counter is Japanese minimalism taken to its logical extreme — pristine fish, perfect rice, and silence that borders on meditation. Recently dropped from three to two Michelin stars, which somehow makes it feel more human. If you can afford it once, you should experience it once.",
  1175: "Danny Meyer's restaurant inside MoMA has two Michelin stars and a dining room that feels like eating inside a work of modern art. Chef Thomas Allan's tasting menu ($275) is refined without being fussy, and the three-course lunch prix fixe ($115) is one of the best midday deals in Midtown. The bar room has lighter fare and views of the sculpture garden. Book on SevenRooms.",
  1176: "Two Michelin stars for Scandinavian fine dining that most New Yorkers still haven't tried, which is their loss. Emma Bengtsson's tasting menu ($305) features Arctic char, gravlax, and dishes that taste like a Nordic forest in the best possible way. The a la carte lunch is the accessible entry point. The dining room on 55th Street is serene and beautiful. One of Midtown's most underrated restaurants.",
  1177: "Two Michelin stars earned inside a grocery store — and that's not even the weirdest part. Chef's Table at Brooklyn Fare moved from Brooklyn to Midtown West, seats 18, and charges $360 for a tasting menu that spans French, Japanese, and whatever Max Natmessnig feels like cooking that night. No phones allowed during service. The most intense fine dining experience in New York that nobody talks about.",
  1178: "Two Michelin stars for kaiseki that redefines what Japanese fine dining can be in America. Hiroki Odo's Flatiron counter serves lunch ($150) and dinner ($270) that blend traditional kaiseki structure with modern innovation. The soba course is made from scratch — the flour, the technique, the care. Intimate, meditative, and genuinely transporting. Book on Resy well ahead.",
  1179: "Two Michelin stars for a 13-course tasting menu ($368) from the original chef behind Chef's Table at Brooklyn Fare. Cesar Ramirez works the counter personally in this sleek Soho space, and every course is a precision strike of seafood and technique. The man has been cooking at this level for over a decade. One of the most consistently excellent fine dining experiences in New York.",
  1180: "Two Michelin stars and a spot on the World's 50 Best Restaurants list. Fredrik Berselius's Nordic tasting menu in Williamsburg uses foraged ingredients, fermentation, and Scandinavian restraint to create dishes that look like landscapes and taste like nothing else in the city. The $325 dinner is 12-14 courses of quiet brilliance. Saturday lunch is available. The space is serene and architecturally stunning.",
  1181: "Two Michelin stars on the 16th floor of a Koreatown building, and the views are the least impressive thing about it. Chang-ho Shin's Seoul import serves a minimalist 12-course Korean tasting menu ($220) that's unlike any Korean dining experience in America. The ingredients are flown from Korea. The technique is obsessive. The jump from one to two stars in 2025 was overdue.",
  1182: "Two Michelin stars on the 63rd floor of 70 Pine Street in the Financial District, with pre-dinner cocktails on a terrace that has the most jaw-dropping views in New York dining. Charlie Mitchell's $298 tasting menu is ambitious and seasonal. The late James Kent built something special here, and the team honors his legacy with every course. The elevator ride alone is worth the trip.",
  1183: "Two Michelin stars for avant-garde cooking that pushes every boundary. Atera's Tribeca tasting menu ($325) is the kind of meal where you're not always sure what you're eating, but you know it's extraordinary. The non-alcoholic pairing ($138) is genuinely innovative. This is food as intellectual provocation — not for everyone, but for the adventurous, it's essential.",
  1184: "One Michelin star for a French tasting menu on the Upper West Side, which is not a sentence anyone expected to write. Christophe Bellanca's intimate restaurant serves $175-$255 menus that are classically French and genuinely excellent. The neighborhood location means it's easier to book than downtown Michelin spots. The wine pairings are thoughtful. A UWS gem hiding in plain sight.",
  1185: "Daniel Boulud's Upper East Side French restaurant earned a Michelin star with a four-part menu that's secretly one of the best values in upscale Manhattan dining. The la saison section changes with the market, the tradition section honors French classics, and the voyage section pulls from global influences. Brunch is outstanding. The wine list is encyclopedic. Romain Paumier runs a beautiful kitchen.",
  1186: "One Michelin star for Chinese fine dining that's unlike anything in Chinatown. Chef Boulun Yao honors his late grandmother from Xi'an with a $165 tasting menu that spans Shanghai, Chengdu, Guangzhou, and beyond. The technique is haute French, the soul is deeply Chinese. Hell's Kitchen location, Resy reservations. One of the most emotionally resonant tasting menus in the city.",
  1187: "One Michelin star for Korean skewers that sound simple and taste transcendent. Chef Sungchul Shim's Hell's Kitchen restaurant serves a $145 tasting menu built around his custom charcoal grill. Each skewer is a study in restraint and seasoning. The sister restaurant Mari is next door. Together they form the most creative Korean cooking in midtown. Book on Resy.",
  1188: "One Michelin star for Korean hand rolls, which is a category that didn't exist before Sungchul Shim invented it. The $145 tasting menu at this Hell's Kitchen sibling to Kochi features hand rolls, skewers, and seasonal courses that blur the line between Japanese and Korean technique. Smaller and more intimate than Kochi. OpenTable reservations. A genuine original.",
  1189: "One Michelin star for a subterranean omakase hidden near Grand Central Terminal. Chef George Ruan serves lunch ($295) and dinner ($410) at a sleek counter tucked beneath One Vanderbilt. The fish is pristine, the pacing is relaxed, and the underground setting gives it a speakeasy energy. One of the best new omakase spots in Midtown. Book on Resy well ahead.",
  1190: "One Michelin star for a Korean seafood tasting menu inside a Koreatown subway station entrance — only in New York. Per Se alum Dae Kim runs the kitchen, and the 10-course $245 menu is creative, seafood-forward, and deeply Korean. The space is intimate and moody. Bobby Kwak and Joseph Ko (Baekjeong) are behind it. One of the most unique dining locations in the city.",
  1191: "One Michelin star for tempura that's elevated to an art form. Kazushige Suzuki's Murray Hill restaurant serves a $295 dinner omakase and $168 lunch focused entirely on the Japanese art of frying. Each piece is a study in temperature, timing, and the crispiest batter you've ever tasted. The seasonal vegetables are as impressive as the seafood. OpenTable reservations. Refined, quiet, essential.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 9: Upgraded', count, 'descriptions');

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
