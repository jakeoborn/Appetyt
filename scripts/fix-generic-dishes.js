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

// Fix specific dishes for spots with generic entries
const dishFixes = {
  1075: {dishes:["Seasonal Cocktails","Olive Oil Washed Negroni","Anchovy Toast"], instagram:"barsnacknyc", website:"https://www.barsnacknyc.com"}, // Bar Snack
  1121: {dishes:["Spicy Wings","Tavern Burger","Loaded Nachos","Draft Beer Selection"]}, // Mustang Harry's
  1305: {dishes:["Hummus with Lamb","Spinach Pie","Mixed Nuts","Tabbouleh"]}, // Sahadi's
  1368: {dishes:["Rotating Craft Taps","Frozen Negroni","Food Pop-Up of the Day"]}, // Nowadays
  1369: {dishes:["Live Jazz Set","House Red Wine","BYOB (no corkage)"]}, // Smalls
  1370: {dishes:["Monday Night Set","Draft Beer","The Vanguard Experience"]}, // Village Vanguard
  1372: {dishes:["Improv Show","Harold Night","ASSSSCAT"]}, // UCB
  1379: {dishes:["Intimate Live Set","Craft Beer","Singer-Songwriter Night"]}, // Rockwood
  1380: {dishes:["Indie Rock Show","PBR Tallboy","Emerging Artist Night"]}, // Mercury Lounge
  1382: {dishes:["Trivia Night","Spelling Bee","Live Music (free)","Bingo"]}, // Pete's Candy Store
  1448: {dishes:["Pernil with Rice & Beans","Mofongo con Pollo","Mangu with Fried Cheese"]}, // Los Hermanos
  1468: {dishes:["Aperol Spritz","Manhattan Skyline View","Seasonal Cocktail"]}, // Bar Blondeau
  1469: {dishes:["Oysters on the Half","Sunset Old Fashioned","360-View Cocktail"]}, // Westlight
  1486: {dishes:["Smash Burger","Seasonal Pasta","Craft Old Fashioned"]}, // Leland
  1513: {dishes:["Smoked Pineapple Margarita","Skyline Negroni","Late Night DJ Set"]}, // Nubeluz
  1557: {dishes:["Al Pastor Taco","Frozen Paloma","Indie Band of the Night"]}, // Baby's All Right
  1561: {dishes:["Jazz Negroni","Rum Punch","Live Bebop Set"]}, // Ornithology
  1564: {dishes:["PBR Tallboy","Shot of Jameson","Metal Show (check lineup)"]}, // Saint Vitus
  1565: {dishes:["Harlem Mule","Live Jazz Set","Rum Old Fashioned"]}, // Harlem Nights
  1566: {dishes:["Techno Night","Underground DJ Set","Warehouse Party"]}, // Basement
  1569: {dishes:["Disco Lemonade","Themed Night","Plant-Filled Patio Drinks"]}, // Mood Ring
  1573: {dishes:["Sunset Spritz","Skyline Martini","Rooftop Snack Plate"]}, // The Ides
  1581: {dishes:["Live Blues Set","Bourbon Flight","Late Night Jam Session"]}, // Terra Blues
  1582: {dishes:["Rock & Funk Show","House Band Night","Cover Charge Cocktail"]}, // Cafe Wha
  1583: {dishes:["Afrobeat Night","Brazilian Jazz Set","World Music DJ"]}, // Nublu
  1594: {dishes:["Classic Cheeseburger","Pint of Ale","Whiskey Neat"]}, // Ear Inn
  1609: {dishes:["Garden Spritz","Gramercy Mule","String Light Negroni"]}, // Darling
  1612: {dishes:["Frozen Espresso Martini","Downtown Skyline View","Seasonal Punch"]}, // Highlight Room
  1613: {dishes:["Wellness Cocktail","Hudson River Spritz","Seasonal Tasting Flight"]}, // Electric Lemon
  1622: {dishes:["Immersive Experience","Burlesque Show","Secret Room Cocktail"]}, // The Stranger
  1623: {dishes:["Vinyl DJ Set","Natural Wine","Community Night"]}, // C'mon Everybody
  1624: {dishes:["Mechanical Bull Ride","Frozen Margarita","Honky-Tonk Dance"]}, // Desert 5 Spot
  1625: {dishes:["Standing Room Ticket","Craft Beer","Balcony View"]}, // Irving Plaza
  1626: {dishes:["Ballroom Show","Mezzanine Cocktail","Studio Session"]}, // Webster Hall
  1627: {dishes:["Experimental Set","Classical Crossover","Late Night Electronica"]}, // Le Poisson Rouge
  1628: {dishes:["Cabaret Dinner Show","Craft Cocktail","Artist Meet & Greet"]}, // Joe's Pub
  1629: {dishes:["Chamber Music Set","Avant-Garde Electronic","Warm Up DJ Series"]}, // National Sawdust
  1630: {dishes:["Southern Fried Chicken","Jazz Piano Set","Central Park View Cocktail"]}, // Dizzy's Club
  1631: {dishes:["Brazilian Jazz Night","Afrobeat Set","Basement Cocktail"]}, // Zinc Bar
  1632: {dishes:["Piano Trio Set","Rye Whiskey Cocktail","Intimate Jazz Evening"]}, // Mezzrow
  1633: {dishes:["Stand-Up Show","Surprise Drop-In Set","Dinner & Comedy Prix Fixe"]}, // The Stand
  1634: {dishes:["Headliner Set","Late Show","Two-Drink Minimum"]}, // NY Comedy Club
  1635: {dishes:["Netflix Special Taping","A-List Headliner","Full Dinner Menu"]}, // Carolines
  1637: {dishes:["Mezcal Negroni","Pisco Sour","Empanadas de Carne"]}, // Leyenda
  1639: {dishes:["Frozen Rum Punch","Patio Pina Colada","Backyard DJ Set"]}, // Donna
  1640: {dishes:["Classic Daiquiri","Rum Old Fashioned","Cuban Sandwich"]}, // BlackTail
  1647: {dishes:["VIP Table","Main Room DJ Set","Signature Marquee Cocktail"]}, // Marquee
  1648: {dishes:["100th Floor Cocktail","Glass Floor Experience","Skyline Champagne"]}, // Marquee Skydeck
  1649: {dishes:["Burlesque Performance","Bottle Service","Late Night Spectacle"]}, // The Box
  1650: {dishes:["Warehouse Rave","Art Exhibition","Underground DJ Set"]}, // Knockdown Center
  1651: {dishes:["Techno Night","Deep House Set","Warehouse Dance Floor"]}, // Nebula
  1652: {dishes:["Brooklyn Mirage Open Air","Kings Hall Indoor","Great Hall Concert"]}, // Avant Gardner
  1653: {dishes:["Brunch Pasta Course","Champagne Bottle","DJ Confetti Drop"]}, // Lavo Party Brunch
  1654: {dishes:["Penthouse Cocktail","Empire State View","Weekend DJ Set"]}, // PHD Terrace
  1655: {dishes:["Upstairs Lounge Cocktail","Downstairs Dance Floor","Celebrity DJ Night"]}, // Up&Down
  1656: {dishes:["Deep House Set","Funktion-One Experience","Sunken Dance Floor"]}, // Cielo
  1657: {dishes:["House Music Night","Disco Set","No-Frills Dance Party"]}, // Garage
  1658: {dishes:["Indie Rock Show","Craft Beer","550-Cap Intimate Set"]}, // Music Hall of Williamsburg
  1659: {dishes:["Vinyl Shopping","In-Store Performance","Album Release Event"]}, // Rough Trade
  1660: {dishes:["Latin Dance Night","Afrobeat Show","Caribbean Dinner & Music"]}, // SOB's
  1661: {dishes:["Beacon Show","Art Deco Interior","Concert Hall Experience"]}, // Beacon Theatre
  1662: {dishes:["Rockettes Show","Major Headliner","Art Deco Grandeur"]}, // Radio City
  1663: {dishes:["Steel Mill Concert","Craft Beer","Bowery Presents Booking"]}, // Brooklyn Steel
  1664: {dishes:["Warehouse Party","Immersive Event","Navy Yard DJ Night"]}, // Brooklyn Storehouse
  1665: {dishes:["Pool Party Cocktail","Basement Club Night","Rooftop Frozen Drink"]}, // Somewhere Nowhere
  1666: {dishes:["Underground Rave","Community Dance Night","Warehouse DJ Set"]}, // Superior Ingredients
  1667: {dishes:["Seasonal DJ Party","Art Installation","Under-Bridge Market"]}, // Under the K Bridge
};

let fixCount = 0;
for(const [id, data] of Object.entries(dishFixes)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) {
    if(data.dishes) { r.dishes = data.dishes; fixCount++; }
    if(data.instagram) r.instagram = data.instagram;
    if(data.website) r.website = data.website;
  }
}
console.log('Fixed dishes on', fixCount, 'spots');

// Also fix Bar Snack's missing links
const barSnack = arr.find(r => r.id === 1075);
if(barSnack) {
  console.log('Bar Snack — ig:', barSnack.instagram, 'web:', barSnack.website);
}

// Count remaining generic
const genericTerms = ['Craft Cocktails','Cocktails','Beer','Wine','Bar Snacks','Small Plates','Bar Menu','Concessions','Cover Charge','DJ Sets','Events','Views','VIP','Bottle Service','Event Space','BYOB','Free Concerts','Timed Tickets'];
let remaining = 0;
arr.forEach(r => {
  const dishes = r.dishes || [];
  const allGeneric = dishes.every(d => genericTerms.includes(d) || d.length < 8);
  if(allGeneric && dishes.length > 0) remaining++;
});
console.log('Remaining generic:', remaining);

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
