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

// Batch 6: IDs 1101-1120
const upgrades = {
  1101: "Brooklyn's legendary open-air food market returns every weekend with 100+ vendors from around the world. Ramen burgers, Thai rolled ice cream, arepas, and paella — all eaten standing up on the Williamsburg waterfront with the Manhattan skyline behind you. Saturday is the main event. Arrive by noon before the best vendors sell out. The original and still the best outdoor food market in America.",
  1102: "Amy Ruth's has been the Harlem soul food queen since 1998. The chicken and waffles named after Al Sharpton, the smothered pork chops, and the mac and cheese are all deeply satisfying. Celebrity names on every dish — order the Obama (chicken and waffles) and feel patriotic. Sunday brunch is packed with after-church crowds, and the energy is contagious. Come hungry, leave blessed.",
  1103: "Melba Wilson opened her Harlem restaurant in 2005 and immediately became a neighborhood institution. The fried chicken is legendary — crunchy, juicy, and seasoned with something that defies explanation. The eggnog waffles are a brunch must. The red velvet waffles are absurd in the best way. Melba herself is often in the house, greeting every table like family. That's not PR — that's real.",
  1104: "Marcus Samuelsson's underground supper club beneath Red Rooster serves live jazz, elevated cocktails, and Southern-inspired small plates in a sultry basement setting. The fried chicken sliders and the cornbread are outstanding. Thursday through Saturday nights bring the best jazz acts in Harlem. It's the kind of place where a random Tuesday becomes the best night of your week.",
  1105: "Sisters Caribbean in Crown Heights serves home-cooked Trinidadian food with the kind of warmth that makes you feel like you're eating at your auntie's house. The roti is outstanding, the curry chicken is deeply spiced, and the portions are enormous. Cash only, counter service, and a neighborhood crowd that treats this place like a second kitchen. One of the most genuine restaurants in Brooklyn.",
  1106: "Chongqing Lao Zao on Prince Street serves some of the most authentic Sichuan food in Manhattan. The boiled fish in chili oil is a towering bowl of fire, numbing peppercorns, and tender whitefish that will change your pain tolerance. The dry pot and the dan dan noodles are equally devastating. Not for the faint of heart — the spice levels here are not negotiable.",
  1107: "White Bear in Flushing makes wontons that are so good, people take the 7 train to the end of the line specifically for them. The No. 6 — wontons in chili oil — is the essential order. Red oil, tingling Sichuan peppercorns, and dumplings with paper-thin skins. The menu is tiny, the space is tinier, and the flavors are enormous. Cash only, $6 for a life-changing meal.",
  1108: "The birria taco that conquered New York started from a cart in Jackson Heights and became a city-wide phenomenon. Birria-Landia's consomme-dipped, cheese-crusted tacos are messy, rich, and borderline addictive. The red broth for dipping is essential — don't skip it. Weekend nights draw massive lines. Multiple locations now, but the Roosevelt Avenue cart is where the legend began.",
  1109: "Dera on the LES is a Pakistani hole-in-the-wall that serves some of the most flavorful food in downtown Manhattan for under $10. The chicken biryani is fragrant and generous, the nihari is deeply spiced, and the naan is fresh from the tandoor. No ambiance, fluorescent lights, and communal tables — exactly the kind of place where great food happens. Cash preferred.",
  1110: "Saraghina in Bed-Stuy serves Neapolitan pizza in a sun-drenched room with a garden out back that feels like a Sicilian courtyard. The margherita is beautifully blistered, the antipasti are seasonal, and the weekend brunch is one of the best in Brooklyn. The neighborhood has changed around it, but Saraghina remains the heart of Bed-Stuy dining. Walk-ins welcome, reservations for groups.",
  1111: "A&A Bake in Bed-Stuy has been making Trinidadian doubles since 2002 — deep-fried flatbreads stuffed with curried chickpeas, topped with tamarind and pepper sauce. They won a James Beard America's Classics Award, which is the food equivalent of a lifetime achievement Oscar. Under $3 per doubles. Cash only. The roti is also exceptional. One of the most important cheap eats in New York.",
  1112: "Haenyeo in Park Slope is a Korean-American restaurant from the chef behind Oiji, and it's one of the most interesting Korean restaurants in Brooklyn. The seafood pancake, the fried chicken, and the bibim noodles are all excellent. The name means 'sea women' — a tribute to Korean female divers. The brunch menu is outstanding, and the cocktail program goes deep into soju territory.",
  1113: "Winner in Williamsburg is the kind of neighborhood spot every block deserves — unpretentious, consistently excellent, and always full of people who actually live nearby. The roast chicken, the pasta, and the wine list are all above average for a place with no attitude. Weekend brunch is lively. The backyard is lovely in summer. Reservations on Resy, but walk-ins work on weeknights.",
  1114: "Dominique Ansel changed the world with the Cronut in 2013, and the SoHo bakery is still drawing lines over a decade later. But the real stars are the DKA (Dominique's Kouign Amann), the cookie shot, and the frozen s'more. Every pastry is an engineering marvel wrapped in butter. Come early on weekends — the Cronut sells out by 10 AM. The savory items at lunch are underrated.",
  1115: "Lysee is Dominique Ansel's Korean-French patisserie, and the Egg Souffle — a cloud-like meringue dome over a warm egg yolk center — might be the most beautiful pastry in New York. The yuzu tart, the black sesame croissant, and the hojicha latte are all exquisite. The space is tiny and pink. This is where French technique meets Korean flavors in the most delightful way possible.",
  1116: "Veniero's has been making Italian pastries on East 11th Street since 1894, and the cannoli, the sfogliatelle, and the ricotta cheesecake are all exactly as good as they should be after 130 years of practice. The display case is overwhelming — rows of cookies, cakes, and pastries behind curved glass. The espresso is strong. The vibe is old New York at its most charming.",
  1117: "Mah-Ze-Dahr in the West Village makes one thing better than almost anyone in the city: brioche. The brioche doughnuts are impossibly light, and the black-and-white cookie is the best version of a New York classic you'll find anywhere. The banana bread is a cult item. Small shop, no seats, and a line that wraps around Greenwich Avenue on Saturday mornings.",
  1118: "Van Leeuwen started from a yellow truck in 2008 and became New York's favorite artisan ice cream brand. The Earl Grey, the honeycomb, and the vegan options are all outstanding. The shops are cute, the flavors rotate seasonally, and the quality of the dairy is genuinely noticeable. Multiple locations across the city. The salted caramel is the gateway flavor.",
  1119: "Morgenstern's in the LES takes ice cream to absurd, beautiful heights. Flavors like burnt sage, black coconut ash, and Vietnamese coffee push the boundaries of what frozen dairy can be. Nicholas Morgenstern is a mad scientist with a scoop. The banana split is an architectural marvel. The tasting flights let you try six flavors without commitment. One of the most creative dessert shops in America.",
  1120: "Mustang Harry's near Penn Station is the kind of sports bar that actually serves good food — a rarity in the wasteland of Midtown pub grub. Big screens, draft beer, and a pre-game energy on Knicks and Rangers nights. The burger is above average, the wings are solid, and the location near MSG makes it the default pre-event gathering spot. Not fancy, not trying to be. Exactly what it should be.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 6: Upgraded', count, 'descriptions');

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
