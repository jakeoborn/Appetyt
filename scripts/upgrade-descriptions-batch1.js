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

// Batch 1: IDs 1001-1020 — NYC's most iconic restaurants
// Spicy, opinionated, informative, 3-4 sentences each
const upgrades = {
  1001: "Eric Ripert's Midtown seafood temple has held three Michelin stars for over a decade, and there's a reason nobody argues about it. The thinly pounded yellowfin tuna and the barely cooked lobster are acts of restraint that most chefs can't pull off. The $350 tasting menu is worth every cent — this is what happens when a chef perfects the same discipline for 30 years. Dress code enforced, reservations essential, and yes, the vegetarian tasting menu is genuinely extraordinary.",
  1002: "Daniel Humm's Madison Square Park monument to ambition reopened with meat back on the menu after a controversial all-vegan pivot. Love it or debate it, EMP remains one of the most technically precise dining experiences on Earth. The $365 tasting menu unfolds over three hours in a landmarked Art Deco dining room. Three Michelin stars, and every course reminds you why.",
  1003: "Cash only, no reservations for parties under 4, waiters who've been there longer than you've been alive, and the greatest porterhouse in the history of steak. Peter Luger has been slinging dry-aged beef in Williamsburg since 1887 and couldn't care less about your Yelp review. The German fried potatoes and creamed spinach are non-negotiable sides. Get the tomato and onion salad — it has no right being that good at a steakhouse.",
  1004: "The most theatrical Italian restaurant in America. The tuxedoed waiters, the Sinatra soundtrack, the spicy rigatoni vodka that launched a thousand Instagram reels — Carbone is dinner as performance art. Major Food Group turned a Little Italy red-sauce joint into a $400 experience, and somehow it's worth it. Getting a reservation is harder than getting into Harvard. The veal parm is the size of your head.",
  1005: "The most impossible walk-in in New York. Jody Williams and Rita Sodi's West Village Italian has been packed to the rafters for a decade, and the cacio e pepe still makes grown adults weep. Seasonal vegetables from their own farm, handmade pastas, and fritto misto that hits like a flavor bomb. No reservations — show up at 5 PM, put your name down, and pray. It's worth every minute of the wait.",
  1006: "Rita Sodi's tiny West Village Italian has 30 seats, zero pretension, and pasta that will make you reconsider everything you thought you knew about Italian food. The cacio e pepe is legendary, the seasonal risotto changes daily, and the wait for a table is brutal but earned. If Via Carota is the loud sister, I Sodi is the quiet genius. Book on Resy the moment reservations drop.",
  1007: "Keith McNally's SoHo brasserie has been the center of New York dining gravity since 1997 and shows no signs of slowing down. The steak frites are perfect, the raw bar is impeccable, and the bread basket alone justifies the trip. Sunday brunch is a religious experience — solo diners reportedly get a complimentary glass of champagne. The people-watching is better than most museums.",
  1008: "Missy Robbins turned a Williamsburg warehouse into one of the five best Italian restaurants in America. The mafaldini with pink peppercorn is the dish that put her on the map, and the agnolotti will haunt your dreams. A decade in and still commanding two-hour waits — that's not hype, that's earned. Walk-in only at the bar — arrive at 5 PM sharp or regret it.",
  1009: "Don Angie took the red-sauce Italian joint and turned it inside out. The pinwheel lasagna is an architectural marvel, the chrysanthemum bread is absurdly good, and the cherry pepper rigatoni could convert a carb-phobe. Angie Rito and Scott Tacinelli built the most creative Italian restaurant in the city without ever losing the soul of a neighborhood joint. Reservations are brutal — Resy drops go fast.",
  1010: "Since 1888, Katz's has been hand-carving pastrami that makes every other deli in the country look like an amateur hour. The sandwich is $28, it's the size of a small child, and it's worth every penny. Cash at the counter (do NOT lose your ticket), waiter service if you sit down. The neon sign, the hanging salamis, the immortal scene from When Harry Met Sally — this isn't just a deli, it's a monument.",
  1011: "The greatest slice in New York, and anyone who disagrees hasn't been paying attention. Thin, floppy, perfectly charred, always fresh out of the oven — Joe's has been the benchmark since 1975. The line wraps around Carmine Street on weekend nights, and it moves fast. Fold it, walk with it, drip grease on your shoes. That's the correct way to eat pizza in this city. $3.75 and change your life.",
  1012: "Kwame Onwuachi's Brighton Beach masterpiece earned a James Beard Award and three Michelin stars, and somehow it's still underrated. The suya-spiced steak, the jollof rice, and the shrimp cocktail reimagined through an Afro-Caribbean lens — this is the most important restaurant in New York right now. Live music on the boardwalk, a wine list that slaps, and a chef who is rewriting American fine dining. Book immediately.",
  1013: "The Art Deco dining room at 70 Pine Street is jaw-dropping, and the food matches the architecture. Gruyere fritters with chile and lime are the best thing you'll eat this week. Crown Shy operates in that rare sweet spot — fine dining technique without fine dining pretension. The late James Kent built something special here, and his team continues to honor it. Walk-ins welcome at the bar.",
  1014: "Fourteen seats. Two Michelin stars. A Korean fine dining experience ranked among the World's 50 Best Restaurants. Ellia and Junghyun Park's Atomix serves a $450 tasting menu at a wooden counter that will redefine what you think Korean food can be. Every course is a precision strike. Reservations drop months ahead and sell out in seconds — set an alarm. This is once-in-a-lifetime dining.",
  1015: "A West Village steakhouse so exclusive it doesn't need a sign. 4 Charles Prime Rib serves dry-aged prime rib, martinis, and Dover sole in a candlelit townhouse that feels like a private club. The cocktails are stiff, the sides are classic, and the vibe is 1960s New York power dinner. Reservations are nearly impossible — Resy releases drop fast. Dress up. This place demands it.",
  1016: "Vietnamese-inspired cooking in a retro-diner setting that somehow became one of Brooklyn's most beloved restaurants. The rice noodle salad and the lemongrass chicken are outstanding, but it's the energy — young, creative, unpretentious — that makes Di An Di special. Weekend brunch is packed for good reason. The coconut iced coffee is mandatory.",
  1017: "The best tacos in Midtown, possibly in Manhattan, definitely at Chelsea Market. Handmade corn tortillas, perfectly seasoned adobo pork, carne asada that hits every note, and a nopal taco that'll convert vegetarians. The line is always 20 deep and it always moves fast. No seats, no frills, no nonsense — just tacos done exactly right. Multiple locations now, but Chelsea Market is the original energy.",
  1018: "The appetizing shop that invented the genre. Since 1914, four generations of the Russ family have been slicing smoked fish, spreading cream cheese, and making New Yorkers feel like they belong. The Super Heebster is the greatest sandwich in the city — gaspe nova, wasabi-infused flying fish roe, cream cheese, on a bagel. No substitutions, no arguments. The LES storefront is sacred ground.",
  1019: "Voted World's Best Bar in 2019, and the negroni menu alone justifies the title. Dante transformed from a century-old Italian cafe into the cocktail epicenter of Greenwich Village without losing an ounce of charm. The Aperol Spritz is the best in the city, the food menu is surprisingly excellent, and the MacDougal Street sidewalk seating is peak New York. All-day hours mean you can start at lunch and never leave.",
  1020: "Daniel Rose and Stephen Starr's SoHo French restaurant occupies one of the most beautiful dining rooms in New York — soaring ceilings, massive flower arrangements, and a hush that makes every dinner feel like an occasion. The duck, the sweetbreads, and the tarte tatin are all exceptional. One Michelin star that deserves two. The prix fixe lunch is one of the best deals in fine dining anywhere. Book the banquette.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Upgraded', count, 'descriptions');

// Show quality check
let great = 0;
arr.forEach(r => {
  const len = (r.description||'').length;
  const sentences = (r.description||'').split(/[.!]/).filter(s=>s.trim().length>10).length;
  if(len >= 250 && sentences >= 4) great++;
});
console.log('Great descriptions (250+ chars, 4+ sentences):', great, '/', arr.length);

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
