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

// Batch 4: IDs 1061-1080
const upgrades = {
  1061: "The original Vanessa's on Eldridge Street has been feeding the Lower East Side cheap, excellent dumplings since forever. Pork and chive fried dumplings — crispy on the bottom, juicy inside — for a couple bucks. The sesame pancake is an under-ordered masterpiece. Cash only, no ambiance, fluorescent lights, and exactly what you want at midnight after three cocktails on the LES.",
  1062: "The pepperoni square at Prince Street Pizza is a religious experience. Thick, crispy-edged, topped with those tiny spicy pepperoni cups that pool with grease in the most beautiful way possible. The line on Prince Street is a constant — worth every minute. The regular slice is solid too, but you're here for that square. Cash only. One of the few pizza spots that actually deserves the viral hype.",
  1063: "Massimo Laveglia turned a tiny Williamsburg storefront into arguably the best slice shop in New York. The burrata slice is a thing of beauty — creamy, peppery, on a perfectly charred crust. The margherita is textbook. The line down South 2nd Street is obscene on weekends, but it moves fast. Multiple locations now, but the original Williamsburg shop has the magic. James Beard recognized.",
  1064: "Tacombi started as a VW bus in a Nolita garage and became a taco empire. The corn tortillas are made fresh, the al pastor is solid, and the frozen margaritas are dangerously easy to drink. It's not the most authentic Mexican in the city, but it's the most reliable — multiple locations, all consistently good. The Nolita flagship has the best energy. Great for groups.",
  1065: "The cart that started it all is at 53rd and 6th, and the line wraps around the block every night for a reason. Chicken and lamb over rice with that legendary white sauce and hot sauce combo — it's the platonic ideal of New York street food. The brick-and-mortar locations are fine, but the cart is the experience. Late-night, standing on a sidewalk, eating from a tin foil plate. Peak NYC.",
  1066: "SEY is where Brooklyn coffee nerds go to worship. Light roasts, meticulous sourcing, and a Bushwick warehouse space that feels like a Scandinavian design studio. The pour-over is exceptional, the espresso is precise, and the baristas actually know what they're talking about. Not the place for a sugar-loaded latte — this is coffee taken seriously. One of the best roasters in the country.",
  1067: "The greenhouse-like Williamsburg space is reason enough to visit — floor-to-ceiling plants, natural light, and the smell of fresh Colombian coffee from the moment you walk in. Devocion roasts single-origin beans from Colombia and serves them within weeks of harvest. The cortado is excellent, the cold brew is exceptional, and the space is one of the most beautiful coffee experiences in NYC.",
  1068: "Puerto Rican-owned, Williamsburg-roasted, and deeply committed to connecting coffee drinkers to the farmers who grow it. 787 Coffee serves exceptional single-origin Puerto Rican and Latin American beans in a no-frills East Village shop. The cortado is rich, the cold brew is smooth, and the mission is genuine. Supporting this spot feels as good as the coffee tastes.",
  1069: "A walk-up espresso window on East 7th Street that's been making some of the best espresso in the city since 2007. Tiny, cramped, no seats, and absolutely essential. The olive oil cake is legendary — order it with an espresso and stand on the sidewalk like a real New Yorker. The baristas are artists. This is specialty coffee before specialty coffee was a thing.",
  1070: "Copenhagen's La Cabra brought their obsessive light-roast philosophy to the Lower East Side, and the result is coffee that tastes like fruit, flowers, and precision. The space is minimal and Scandinavian-beautiful. The filter coffee is where they shine — each cup is a single origin brewed to exact specifications. Not for everyone, but for coffee purists, this is paradise.",
  1071: "No sign, no menu, no phone number. Tell the bartender what you like — sweet, boozy, citrusy, bitter — and they'll make you something extraordinary. Attaboy is the spiritual successor to Milk & Honey, the bar that launched New York's cocktail revolution. Eight seats, a cramped LES space, and some of the most talented bartenders in the world. Walk in, trust them, and prepare to be amazed.",
  1072: "The Dead Rabbit in FiDi won World's Best Bar and earned every word of it. Three floors — a taproom, a parlor, and a cocktail lounge — each with its own personality. The Irish coffee is the best in New York, the cocktail menu reads like a novel, and the bartenders are scholars. The FiDi location means it's packed with finance bros after 5 PM, but the quality never wavers.",
  1073: "Double Chicken Please on the LES earned a spot on the World's 50 Best Bars list by doing something nobody expected: making cocktails inspired by food pairings. The drinks are served in takeout containers, the bar snacks are elevated, and the creativity is relentless. Two floors — upstairs is cocktail lab, downstairs is lounge. One of the most innovative bar experiences on the planet right now.",
  1074: "A chill LES cocktail bar that feels like your cool friend's living room. The drinks are creative but not pretentious, the music is always right, and the space is small enough that every night feels like a private party. The mezcal cocktails are standout. One of those neighborhood bars that makes you wonder why every bar can't be this good. Walk in, grab a stool, stay for hours.",
  1075: "Bar Snack in the East Village is the bar that bartenders go to on their nights off. The drinks are inventive, the prices are fair, and the vibe is unpretentious. The menu changes frequently, and the bar snacks (yes, actual snacks) are surprisingly excellent. Small space, no reservations, and a crowd that actually knows how to drink. One of the best new-wave cocktail bars downtown.",
  1076: "A cocktail bar on the 64th floor of a Financial District skyscraper with views that make you forget you're in a bar. Overstory is one of the highest bars in NYC, and the cocktails match the altitude — creative, beautifully presented, and strong enough to justify the price. Sunset is the time to go. Reservations on Resy. Dress code enforced — this is not a casual rooftop.",
  1077: "A tiki bar hidden inside the Gage & Tollner building in Brooklyn, and it's one of the most fun drinking experiences in the city. Elaborate rum cocktails served in ceramic mugs, a tropical atmosphere that transports you 3,000 miles from Fulton Street, and bartenders who take tiki seriously. The drinks are strong, the garnishes are ridiculous, and the vibes are immaculate.",
  1078: "New York's oldest bar has been pouring ale since 1854. Lincoln drank here. Teddy Roosevelt drank here. The sawdust is still on the floor, the light ale and dark ale are still the only beers on tap, and the potbelly stove still heats the room. Cash only, no liquor, no cocktails, no wine. Just ale, cheese, crackers, and 170 years of New York history. Essential.",
  1079: "The free hot dogs alone make Rudy's the greatest dive bar in Hell's Kitchen. Cheap pitchers, a backyard with a pig statue, and a crowd that ranges from theater kids to construction workers to tourists who wandered in by accident. It's filthy, it's loud, it's cash only, and it's been this way since 1933. The hot dogs come from a crock pot behind the bar. They're free. Don't ask questions.",
  1080: "Jack's Wife Freda is the brunch spot that launched a thousand Instagram accounts. The shakshuka, the green shakshuka, and the rosewater waffle are all photogenic and actually delicious. Multiple locations now, but the SoHo original has the most energy. Walk-ins only, expect a wait on weekends, and the frozen Aperol Spritz is the unofficial drink of SoHo Saturday mornings.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 4: Upgraded', count, 'descriptions');

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
