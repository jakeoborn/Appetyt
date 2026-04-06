const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const DALLAS_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));

const upgrades = {
  1: "David Uygur intimate Bishop Arts Italian is the kind of restaurant that makes you forget Dallas exists outside these four walls. The handmade pasta changes nightly based on what is perfect at the market, and the wait for a table can stretch weeks. Lucia earned a James Beard nomination and every single one of its 50 seats feels like a privilege. BYOB with no corkage -- bring something special.",
  6: "West Village Japanese that blurs the line between omakase discipline and neighborhood warmth. The sushi rice is textbook, the fish sourcing is meticulous, and chef Namo Nikkoubin runs the counter with the kind of quiet confidence that makes you trust every single bite. One of the most underrated Japanese restaurants in Dallas.",
  9: "Design District gastropub from Fox Restaurant Concepts with a sprawling patio, yard games, and a menu built for sharing. The injected pretzel bites with beer cheese are addictive, the fried chicken sandwich is a legitimate contender, and the craft beer list goes deep. It is aggressively fun in a way that somehow does not feel forced.",
  10: "Deep Ellum dive bar that leans hard into the honky-tonk aesthetic -- neon signs, whiskey shots, and a jukebox that skews country and classic rock. The burgers are better than they need to be for a place this sticky, and the patio is one of the best people-watching spots on Elm Street. Cash-friendly, no pretension, exactly what Deep Ellum should feel like.",
  16: "Knox-Henderson artisan bakery turning out some of the best croissants and sourdough in Dallas from a tiny storefront that smells like heaven. The morning buns sell out early, the chocolate croissants are flaky perfection, and the bread program supplies half the serious restaurants in town. Get there before 10 AM or accept your fate.",
  18: "Uptown all-day brasserie in The Ritz-Carlton that serves as the power-brunch capital of Dallas. The weekend brunch scene is a full production -- champagne, lobster frittatas, and a clientele dressed like they just left a board meeting. The dinner menu is solid New American with good steaks and seafood. The patio overlooking Uptown is prime real estate.",
  23: "Oak Lawn power steakhouse that has been the unofficial dining room of Dallas dealmakers since 1998. The 20oz prime bone-in ribeye is the signature, the martinis are ice-cold, and the wine list is a novel. Al Biernat himself still works the room most nights, and the regulars have their own tables. Old Dallas money eats here.",
  35: "West Village brunch institution with a line that wraps around the building every Saturday morning. The Belgian waffles with strawberries and cream are legendary, the eggs Benedict is reliable, and the mimosas flow with zero restraint. It is not reinventing brunch -- it is doing brunch exactly right in a neighborhood that takes its weekends seriously.",
  36: "Uptown Spanish tapas from chef Monica Greene that brings legit Iberian flavors to a neighborhood dominated by steaks and sushi. The patatas bravas have real kick, the croquetas are creamy and crisp, and the sangria is dangerously drinkable. The intimate space fills fast, especially on date nights.",
  41: "West Village Texas-sized restaurant and bar with a massive patio, live music stage, and a menu that skews elevated Southern comfort. Pat Green is an investor, which tells you everything about the vibe -- boots, whiskey, and brisket. The chicken-fried steak is as big as your head, and the cold beer on that patio on a Friday evening is peak Dallas.",
  42: "Deep Ellum burger chain that made its name with creative weekly specials -- think bison, elk, or wild boar alongside the classic smash burger. The sweet potato fries are excellent, and every location has its own weird personality. Multiple locations across DFW, but the Deep Ellum original has the most character.",
  57: "Deep Ellum BBQ institution that draws lines around the block and earns every minute of the wait. The beef rib is a caveman-sized showstopper, the brisket has a bark that shatters, and the banana pudding is legendary. Justin and Diane Fourton turned a farmers market stand into one of the most celebrated BBQ joints in Texas. Come early -- they sell out.",
  89: "Bishop Arts BBQ joint paying homage to the legendary Kreuz Market in Lockhart, Texas. No forks, no sauce (it is on the side), and meat served on butcher paper the way God intended. The brisket is excellent, the sausage links are snappy and juicy, and the sides are above average for a BBQ joint. Cash or card, open until they sell out.",
  90: "Bishop Arts all-day cafe that serves as the neighborhood living room -- morning coffee, weekend brunch, and late-night cocktails all under one roof. The patio is massive and dog-friendly, the chicken and waffles at brunch are excellent, and the vibe is perfectly East Dallas casual. One of the spots that made Bishop Arts a destination before everyone else caught on.",
  93: "Lower Greenville comfort food spot with a Southern-influenced menu that hits harder than it has any right to. The deviled eggs are the sleeper hit, the fried chicken is well-seasoned and juicy, and the cocktail list is surprisingly thoughtful. The kind of neighborhood restaurant every block in Dallas wishes it had.",
  97: "Downtown Dallas outpost of the national steakhouse chain that delivers exactly what you expect -- dry-aged steaks, towering shellfish platters, and an extensive wine list in a dark-wood dining room. The lobster bisque is a signature, and the Kona-crusted sirloin has a cult following. Expense-account dining done reliably well.",
  462: "Deep Ellum outpost of the legendary Austin BBQ family, and it holds its own against the original. The beef rib is a monster, the moist brisket is properly fatty and smoky, and the sides -- especially the creamed corn -- are above average. The space is massive with a huge patio and full bar, making it a better hang than most BBQ joints.",
  463: "NorthPark Center Italian food hall that brought the Eataly experience to Dallas with multiple dining counters, a marketplace of imported goods, and enough pasta to carb-load for a marathon. The fresh pasta counter is the highlight, the pizza is solid Neapolitan, and the gelato is the real deal. Come hungry and with time to wander.",
  464: "Uptown restaurant inside The Crescent Hotel from chef Eric Dreyer serving polished New American with global accents. The dining room is gorgeous -- all marble and warm lighting -- and the brunch is one of the best in Uptown. The cocktail program is inventive without being pretentious, and the rooftop has skyline views worth the trip alone.",
  465: "Uptown steakhouse that goes big in every way -- massive porterhouses, towering seafood towers, and a wine cellar that could fill a swimming pool. The bone-in ribeye is the power order, and the cheesecake the size of your head is the closer. Classic American steakhouse energy with a Dallas swagger that matches the Uptown address.",
  466: "West Village French restaurant built entirely around the souffle -- savory, sweet, and everything in between. The gruyere souffle is the signature, rising impossibly high from its ramekin, and the chocolate version is a legitimate dessert experience. The rest of the menu is solid French bistro, but you are here for the souffles and you know it.",
  469: "Uptown raw bar and seafood institution that has been shucking oysters and frying catfish since 1979. The fried shrimp po-boy is a Dallas classic, the gumbo is thick and proper, and the patio under the live oaks is one of the most charming spots in the city. Cash only for decades (they finally take cards), and the regulars have been coming since the Reagan administration.",
  471: "Oak Cliff taqueria from Andrew Savoie that treats the taco with the same reverence a sushi chef treats a piece of tuna. The breakfast tacos are some of the best in Dallas, the barbacoa is slow-cooked perfection, and the salsas are made fresh with real heat. A tiny space with huge flavor and the kind of thoughtfulness that elevates street food to art.",
  472: "West Village Thai-Vietnamese from Braden and Yasmin Wages that fills the gap between takeout pad Thai and fine dining. The Malaysian roti canai is a must, the drunken noodles have legitimate heat, and the Vietnamese pho is a faithful rendition. Multiple locations now, but the original West Village spot has the best energy.",
};

let updated = 0;
Object.entries(upgrades).forEach(([id, desc]) => {
  const spot = arr.find(r => r.id === parseInt(id));
  if(spot){
    spot.description = desc;
    updated++;
  }
});

console.log('Upgraded', updated, 'Dallas descriptions');
html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
