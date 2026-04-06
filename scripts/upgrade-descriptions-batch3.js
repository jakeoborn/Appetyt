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

// Batch 3: IDs 1041-1060
const upgrades = {
  1041: "Lee Hanson and Riad Nasr left Balthazar and opened Frenchette in Tribeca, and immediately built one of the best French restaurants in America. The rotisserie chicken for two, the duck with olives, and the crudo are all impossibly good. The natural wine list is deep and affordable. Late-night kitchen open until midnight — this is where chefs eat after their own shifts.",
  1042: "A Williamsburg brasserie that earned a Michelin star by doing everything exactly right. The lobster ravioli, the souffle cake with seaweed butter, and the duck mortadella are all memorable. The space is gorgeous — exposed brick, candlelight, and a date-night energy that feels earned. Reservations on Resy. The bar seats are the best in the house.",
  1043: "Justin Bazdarich's Greenpoint Mexican restaurant earned a Michelin star with breezy tostadas, lamb barbacoa tacos, and a mole that took months to develop. The outdoor patio is one of the best in Brooklyn — string lights, margaritas, and a crowd that knows how to have a good time. Brunch is excellent but dinner is where it shines. Book on Resy.",
  1044: "Chef Isao Yamada's kaiseki counter inside the Canal Arcade in Chinatown is one of the most intimate dining experiences in New York. Ten courses for $295, focused on seasonal precision. He ran David Bouley's Brushstroke for years before opening this 12-seat counter. The fish courses are transcendent. Book through Resy — it fills up weeks ahead.",
  1045: "Amanda Cohen's Lower East Side vegetarian restaurant has a Michelin star and deserves two. The five-course tasting menu ($110) proves that vegetables can be just as exciting as any protein on Earth. The broccoli hot dog and the portobello mousse are both genius. This is not hippie food — this is world-class technique applied to plants. Every meat-eater should experience this at least once.",
  1046: "This Gramercy Spanish tapas bar from Andy Nusser has held a Michelin star for over a decade by doing one thing perfectly: small plates that make you forget you're not in Barcelona. The razor clams, the pork belly, and the chorizo are all outstanding. The wine list leans Iberian and goes deep. Sit at the bar for the best experience — it's intimate, lively, and the bartenders know everything.",
  1047: "The West Village Italian that every neighborhood wishes it had. The pastas are handmade, the wine list is all-Italian, and the cocktails are better than they need to be. The ricotta gnudi and the lamb ragu pappardelle are both outstanding. No reservations — walk-in only, and the wait can be brutal on weekends. But the bar seats turn over faster. Go early.",
  1048: "The last great bastion of the mutton chop. Keens has been operating in Midtown since 1885, and the ceiling is covered with the world's largest collection of churchwarden clay pipes. The porterhouse is enormous, the mutton chop is unlike anything you've eaten before, and the creamed spinach is the best in the city. Jackets suggested, reservations recommended, and history dripping from every wall.",
  1049: "You cannot get a table at Rao's. Not because it's booked — because the tables are owned. The same families have held the same tables for decades at this 115-year-old East Harlem Italian joint. If someone invites you, drop everything and go. The meatballs, the lemon chicken, and the veal parm are all perfect. This is the most exclusive restaurant in America, and it has nothing to do with a velvet rope.",
  1050: "Roberta's turned a Bushwick warehouse into a pizza empire and helped gentrify an entire neighborhood. Love it or resent it, the margherita pizza is still one of the best in Brooklyn. The backyard is massive, the vibe is effortlessly cool, and the Bee Sting (honey + sopressata) pizza is addictive. Walk-ins only, and the wait is longer on weekends. Go for lunch when it's calmer.",
  1051: "Dom DeMarco made every single pie by hand at his Midwood pizzeria for over 50 years. He's gone now, but his family carries on, and the regular slice — charred, oily, dripping with fresh mozzarella — remains one of the greatest foods in New York. The square slice with fresh tomato is equally legendary. Cash only, erratic hours, and a pilgrimage that pizza lovers take very seriously.",
  1052: "Sylvia Woods opened this Harlem restaurant in 1962 and it became the Queen of Soul Food. The fried chicken, the mac and cheese, the collard greens, and the cornbread are all exactly what they should be — rich, comforting, and deeply rooted in tradition. Sunday gospel brunch is a cultural experience that transcends food. Come hungry, leave changed. Cash only for counter service.",
  1053: "Chinatown's oldest dim sum parlor has been serving har gow and siu mai since 1920, and the renovation a few years back made it better without killing the soul. The original egg roll, the shrimp and snow pea leaf dumplings, and the pan-fried turnip cakes are all essential. Skip the weekend crowds — Tuesday lunch is the move. The new cocktail menu is surprisingly good.",
  1054: "The xiao long bao at this Flushing institution are the benchmark by which all New York soup dumplings are measured. Thin skins, scalding broth, and pork filling that's been perfected over decades. The line outside is a constant — bring a book or arrive at 11 AM sharp. Everything else on the menu is solid, but you're here for one thing. Order at least two baskets.",
  1055: "Roberto Paciullo brought Salernitan Italian cooking to Arthur Avenue in the Bronx, and the result is one of the most authentic Italian experiences in the five boroughs. Handmade pasta, wood-fired pizza, and a warmth that makes Manhattan Italian restaurants feel like theme parks. The pappardelle with wild boar ragu is transcendent. Skip Little Italy — this is the real deal.",
  1056: "The original Mamoun's has been slinging falafel on MacDougal Street since 1971, and it's still the best cheap eat in the Village. Crispy, herb-packed falafel in a warm pita for under $5. The shawarma is excellent, the hummus is creamy, and the hot sauce is not messing around. Cash only, no seats, and a line that moves fast. Post-bar fuel that's been saving New Yorkers for over 50 years.",
  1057: "Papaya juice and hot dogs at 3 AM — that's the Gray's Papaya experience, and it's been sustaining drunk New Yorkers since 1973. Two snappy all-beef franks and a tropical juice for the price of a subway ride. It's not gourmet, it's not Instagram-worthy, and it's one of the most essential New York food experiences that exists. The UES location on 86th is the flagship.",
  1058: "Jason Wang turned his father's Flushing food stall into a hand-pulled noodle empire spanning Manhattan, Brooklyn, and beyond. The spicy cumin lamb over hand-ripped noodles is the signature — chewy, fiery, and insanely cheap. The liang pi cold skin noodles are equally addictive. Multiple locations, no seats at most, and the best $10 you'll spend in the city. The lamb burger is an under-ordered gem.",
  1059: "Dollar slices have been a New York survival mechanism since the invention of poverty. 2 Bros perfected the model — hot cheese slices for a buck or two, served through a window to a constant stream of office workers, students, and tourists. It's not the best pizza in New York. It's not trying to be. It's the most honest pizza in New York. Multiple locations, all equally reliable.",
  1060: "Smash burgers done right in the East Village. Thin patties, crispy edges, American cheese melting into the meat — Smashed nails the formula. The onion burger is the move, and the fries are better than they need to be. No ambiance, no pretension, just very good burgers at fair prices. The line moves fast. One of the best casual lunch options in the neighborhood.",
};

let count = 0;
for(const [id, desc] of Object.entries(upgrades)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) { r.description = desc; count++; }
}
console.log('Batch 3: Upgraded', count, 'descriptions');

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
