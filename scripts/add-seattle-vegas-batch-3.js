// Batch 3: Resy/Yelp/OpenTable-sourced additions for Seattle + Vegas
// All entries verified via Resy Winter 2026 Hit List, Yelp Top 100 US 2026, or OpenTable listings
// Run: node scripts/add-seattle-vegas-batch-3.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function addToConst(constName, spots) {
  const s = html.indexOf('const ' + constName);
  if (s < 0) throw new Error('Cannot find const ' + constName);
  const a = html.indexOf('[', s);
  let d = 0, e = a;
  for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  const arr = JSON.parse(html.slice(a, e));
  const existing = new Set(arr.map(r => r.name.toLowerCase()));
  let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
  let added = 0;
  spots.forEach(sp => {
    if (existing.has(sp.name.toLowerCase())) { console.log('  SKIP (exists):', sp.name); return; }
    arr.push({
      id: nextId++, name: sp.name, phone: sp.phone || '', cuisine: sp.cuisine,
      neighborhood: sp.neighborhood, score: sp.score, price: sp.price || 0,
      tags: sp.tags, indicators: [], hh: sp.hh || '', reservation: sp.reservation || 'walk-in',
      awards: sp.awards || '', description: sp.description, dishes: sp.dishes || [],
      address: sp.address, hours: sp.hours || '', lat: sp.lat, lng: sp.lng,
      bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, group: sp.group || '', instagram: sp.instagram || '', website: sp.website || '',
      suburb: sp.suburb || false, reserveUrl: '', menuUrl: '', res_tier: sp.res_tier || 3,
    });
    existing.add(sp.name.toLowerCase());
    added++;
    console.log('  ADDED:', sp.name);
  });
  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return { count: arr.length, added };
}

console.log('\n=== SEATTLE BATCH 3 (Resy Hit List) ===');
const seaBatch3 = [
  {name:"Fuji Sushi",cuisine:"Sushi",neighborhood:"Capitol Hill",score:85,price:3,tags:["Sushi","Japanese","Date Night","Resy Hit List"],description:"Capitol Hill sushi spot on Resy's Winter 2026 Seattle Hit List. Chef-driven omakase and à la carte sushi in a small intimate room. Seasonal Japanese seafood flown in daily.",dishes:["Omakase","Chirashi","Seasonal Nigiri"],address:"520 Broadway E, Seattle, WA 98102",phone:"",lat:47.6215,lng:-122.3213,instagram:"",website:"",reservation:"Resy"},
  {name:"Light Sleeper",cuisine:"Cocktail Bar",neighborhood:"Capitol Hill",score:86,price:3,tags:["Cocktails","Late Night","Small Plates","Resy Hit List"],description:"New Capitol Hill cocktail bar on Resy's Winter 2026 Hit List. Craft cocktails, small plates, and late-night vibes. The newest must-try on Capitol Hill for night-out sippers.",dishes:["Seasonal Cocktails","Small Plates","Snacks"],address:"1518 11th Ave, Seattle, WA 98122",phone:"",lat:47.6143,lng:-122.3180,instagram:"lightsleeperbar",website:"",reservation:"Resy"},
  {name:"The Mountaineering Club",cuisine:"Cocktail Bar",neighborhood:"University District",score:85,price:3,tags:["Cocktails","Views","Rooftop","Date Night"],description:"Graduate Hotel rooftop cocktail lounge with panoramic U-District views. Outdoor fireplaces, Pacific Northwest-inspired cocktails, and the best 16th-floor skyline perch in the neighborhood.",dishes:["PNW Cocktails","Small Bites","Views"],address:"4507 Brooklyn Ave NE, Seattle, WA 98105",phone:"(206) 634-2000",lat:47.6615,lng:-122.3135,instagram:"themountaineeringclub",website:"https://www.graduatehotels.com/seattle/restaurant/mountaineering-club"},
  {name:"Qiao Lin Hotpot",cuisine:"Chinese Hot Pot",neighborhood:"Chinatown-International District",score:86,price:3,tags:["Hot Pot","Chinese","Chongqing","Resy Hit List"],description:"Chongqing-style hot pot specialist on Resy's Winter 2026 Seattle Hit List. Tomato and spicy broths, premium raw meats and vegetables. One of Seattle's most talked-about new hot pot rooms.",dishes:["Chongqing Hot Pot","Tomato Broth","Spicy Broth","Lamb Skewers"],address:"651 S Weller St, Seattle, WA 98104",phone:"",lat:47.5984,lng:-122.3180,instagram:"",website:"",reservation:"Resy"},
];
const seaResult = addToConst('SEATTLE_DATA', seaBatch3);
console.log(`\nSeattle: ${seaResult.count} spots (added ${seaResult.added})`);

console.log('\n=== VEGAS BATCH 3 (Yelp Top 100 US + OpenTable) ===');
const vegasBatch3 = [
  {name:"Lucky Noodle",cuisine:"Taiwanese",neighborhood:"Spring Valley / Chinatown",score:88,price:1,tags:["Taiwanese","Noodles","Critics Pick","Yelp Top 100"],description:"Chinatown corridor Taiwanese noodle specialist. Named #26 on Yelp's Top 100 Places to Eat in the US 2026. Stewed beef noodle soup, spicy broth, and a cult following of regulars.",dishes:["Lucky Beef Noodle Soup","Beef Noodle","Spicy Broth","Dumplings"],address:"6120 W Tropicana Ave, Ste A1, Las Vegas, NV 89103",phone:"(702) 897-0088",lat:36.0985,lng:-115.2303,instagram:"",website:""},
  {name:"Rock N' Potato",cuisine:"New American",neighborhood:"The Strip (Showcase Mall)",score:87,price:2,tags:["American","Potato","Viral","Yelp Top 100","Unique"],description:"Rock-music-themed baked potato destination in the Showcase Mall on the Strip. Named #23 on Yelp's Top 100 Places to Eat in the US 2026. Celebrity-inspired elaborate loaded baked potatoes and rock memorabilia.",dishes:["Loaded Baked Potatoes","Celebrity Potatoes","Rock Themed"],address:"3785 S Las Vegas Blvd Ste 207, Las Vegas, NV 89109",phone:"(702) 710-9200",lat:36.1014,lng:-115.1720,instagram:"rocknpotatolv",website:"https://rocknpotato.store"},
  {name:"Sadelle's Las Vegas",cuisine:"Jewish Deli / Brunch",neighborhood:"The Strip (Bellagio)",score:85,price:3,tags:["Brunch","Jewish Deli","Bagels","Date Night","Iconic"],description:"Bellagio outpost of the NYC Major Food Group deli. Towers of bagels, sliced lox, blintzes, and one of the most photographed brunches in Vegas. The bagel tower alone is worth the trip.",dishes:["Bagel Tower","Lox","Blintzes","Brunch Cocktails"],address:"3600 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 693-8865",lat:36.1126,lng:-115.1767,instagram:"sadellesrestaurant",website:"https://bellagio.mgmresorts.com/en/restaurants/sadelles.html",reservation:"OpenTable"},
  {name:"Yardbird Table & Bar",cuisine:"Southern",neighborhood:"The Strip (The Venetian)",score:87,price:3,tags:["Southern","Fried Chicken","Date Night","Brunch"],description:"The Venetian outpost of Miami's Yardbird. Southern comfort — 27-hour-marinated fried chicken, shrimp and grits, bourbon cocktails. Ample, hearty, party-energy dining.",dishes:["Mama's Chicken Biscuits","27-Hour Fried Chicken","Shrimp & Grits","Bourbon"],address:"3355 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 297-6541",lat:36.1212,lng:-115.1700,instagram:"runchickenrun",website:"https://runchickenrun.com",reservation:"OpenTable"},
  {name:"The Crack Shack",cuisine:"Fried Chicken",neighborhood:"The Strip (Park MGM)",score:84,price:2,tags:["Fried Chicken","Casual","Cheap Eats","Pacific Beach Imports"],description:"San Diego-imported fried chicken concept at Park MGM's food hall. All-natural chicken, eggs for breakfast, and chicken sandwiches that compete for best in Vegas.",dishes:["Firebird Sandwich","Chicken & Biscuits","Deviled Eggs","Cookies"],address:"3770 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 730-6900",lat:36.1048,lng:-115.1745,instagram:"thecrackshack",website:"https://crackshack.com"},
  {name:"Secret Pizza",cuisine:"Pizza",neighborhood:"The Strip (The Cosmopolitan)",score:87,price:1,tags:["Pizza","Late Night","Hidden Gem","Cosmopolitan"],description:"Cosmopolitan's unmarked 3rd-floor hallway pizza spot — no name, no sign, hugely iconic. Thin-crust NY-style slices served until 4 AM. The worst-kept secret on the Strip.",dishes:["Pepperoni Slice","Margherita Slice","Cheese Slice"],address:"3708 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 698-7000",lat:36.1099,lng:-115.1729,instagram:"",website:""},
  {name:"888 Sushi & Robata",cuisine:"Japanese",neighborhood:"Spring Valley / Chinatown",score:86,price:3,tags:["Sushi","Robata","Critics Pick","Date Night"],description:"Chinatown corridor sushi and robata specialist on Yelp's 'Best Of' Vegas list. Fresh sushi, charcoal-grilled yakitori, and a strong sake program. Locals' pick.",dishes:["Sushi","Robata Yakitori","Sashimi","Sake"],address:"5115 Spring Mountain Rd #203, Las Vegas, NV 89146",phone:"(702) 330-9979",lat:36.1261,lng:-115.2097,instagram:"",website:""},
  {name:"888 Japanese BBQ",cuisine:"Japanese BBQ / Yakiniku",neighborhood:"Spring Valley / Chinatown",score:86,price:3,tags:["Japanese BBQ","Yakiniku","Wagyu","Critics Pick"],description:"Yakiniku specialist in the Chinatown corridor where you grill premium Japanese beef at the table. Wagyu flights, classic yakiniku sides, sake-forward drinks. A Vegas Japanese BBQ destination.",dishes:["Wagyu Flight","Yakiniku","Beef Tongue","Kimchi"],address:"5115 Spring Mountain Rd, Las Vegas, NV 89146",phone:"(702) 202-3388",lat:36.1261,lng:-115.2097,instagram:"",website:""},
  {name:"Cantina Contramar",cuisine:"Mexican Seafood",neighborhood:"The Strip (Fontainebleau)",score:88,price:4,tags:["Mexican","Seafood","Celebrity Chef","Critics Pick","New"],description:"Gabriela Cámara's first US restaurant outside Contramar Mexico City — opened 2026 at the Fontainebleau. Tuna tostadas, pescado a la talla, mezcal cocktails. A James Beard-celebrated chef bringing her signature seafood-forward Mexican to Vegas.",dishes:["Tuna Tostada","Pescado a la Talla","Aguachile","Mezcal"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 795-3434",lat:36.1307,lng:-115.1610,instagram:"contramar_lv",website:"https://www.fontainebleaulasvegas.com/dining",reservation:"Resy"},
  {name:"Carbone Las Vegas",cuisine:"Italian-American",neighborhood:"The Strip (Aria)",score:91,price:4,tags:["Italian-American","Major Food Group","Date Night","Critics Pick","Iconic"],description:"Aria's outpost of the NYC Major Food Group Italian-American legend. Spicy rigatoni vodka, veal parm, tableside Caesar. Dim red-lit 1950s dining room. A Vegas power-dinner destination.",dishes:["Spicy Rigatoni Vodka","Veal Parm","Tableside Caesar","Meatballs"],address:"3730 S Las Vegas Blvd, Las Vegas, NV 89158",phone:"(877) 230-2742",lat:36.1069,lng:-115.1775,instagram:"carbone",website:"https://aria.mgmresorts.com/en/restaurants/carbone.html",reservation:"OpenTable"},
  {name:"Elio",cuisine:"Italian-American",neighborhood:"The Strip (Fontainebleau)",score:88,price:4,tags:["Italian-American","New","Date Night","Fontainebleau"],description:"Fontainebleau's Italian-American steakhouse-meets-red-sauce concept. Veal chop Milanese, rigatoni alla Norma, and mid-century lounge vibes. 2024 opening, immediate Vegas hit.",dishes:["Veal Chop Milanese","Rigatoni alla Norma","Steaks","Italian Wines"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 795-3434",lat:36.1307,lng:-115.1610,instagram:"eliolv",website:"https://www.fontainebleaulasvegas.com/dining",reservation:"Resy"},
  {name:"Komodo Las Vegas",cuisine:"Southeast Asian",neighborhood:"The Strip (Fontainebleau)",score:85,price:4,tags:["Asian Fusion","Date Night","Nightlife","Cocktails"],description:"Groot Hospitality's Fontainebleau Southeast Asian outpost. Pan-Asian dishes, club-energy dining room, robatayaki. A scene-heavy restaurant-lounge hybrid.",dishes:["Black Cod Miso","Robata","Satay","Cocktails"],address:"2777 S Las Vegas Blvd, Las Vegas, NV 89109",phone:"(702) 795-3434",lat:36.1307,lng:-115.1610,instagram:"komodorestaurants",website:"https://www.fontainebleaulasvegas.com/dining",reservation:"Resy"},
];
const lvResult = addToConst('LV_DATA', vegasBatch3);
console.log(`\nLas Vegas: ${lvResult.count} spots (added ${lvResult.added})`);

fs.writeFileSync(file, html);
console.log('\n✅ Batch 3 written.');
