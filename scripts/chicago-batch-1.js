// Chicago Batch 1: Missing Michelin-starred + key Bib Gourmand restaurants (25 spots)
// All verified. Chicago data is inline in CITY_DATA['Chicago']
// Run: node scripts/chicago-batch-1.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Parse Chicago data (inline in CITY_DATA)
const chiKey = "'Chicago': [";
const chiIdx = html.indexOf(chiKey, html.indexOf('const CITY_DATA'));
const chiArr = html.indexOf('[', chiIdx + 10);
let d = 0, e = chiArr;
for (let i = chiArr; i < html.length; i++) {
  if (html[i] === '[') d++;
  if (html[i] === ']') d--;
  if (d === 0) { e = i + 1; break; }
}
const arr = JSON.parse(html.slice(chiArr, e));
const existing = new Set(arr.map(r => r.name.toLowerCase()));
let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
if (nextId < 150) nextId = 150;
let added = 0;

function add(s) {
  if (existing.has(s.name.toLowerCase())) { console.log('SKIP:', s.name); return; }
  arr.push({
    id: nextId++, name: s.name, phone: s.phone || '', cuisine: s.cuisine,
    neighborhood: s.neighborhood, score: s.score, price: s.price,
    tags: s.tags, indicators: s.indicators || [], hh: '',
    reservation: s.reservation || 'walk-in', awards: s.awards || '',
    description: s.description, dishes: s.dishes, address: s.address,
    hours: s.hours || '', lat: s.lat, lng: s.lng,
    bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
    trending: s.trending || false, group: s.group || '',
    instagram: s.instagram || '', website: s.website || '',
    suburb: false, reserveUrl: '', menuUrl: '', res_tier: s.res_tier || 2,
  });
  existing.add(s.name.toLowerCase());
  added++;
  console.log('ADDED:', s.name);
}

// === MISSING MICHELIN STARRED (1-star) ===

add({name:"Schwa",cuisine:"Creative / Avant-Garde",neighborhood:"Wicker Park",
  score:94,price:4,tags:["Fine Dining","Tasting Menu","Date Night","Exclusive","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",group:"",
  description:"Michael Carlson's eccentric Wicker Park BYOB where punk rock energy meets Michelin precision. The tasting menu changes constantly, the chef works the entire line himself, and reservations are famously hard to get. No sommelier, no dress code, just wildly creative food in one of Chicago's most unconventional fine dining settings.",
  dishes:["Seasonal Tasting Menu","Creative Small Plates","BYOB"],
  address:"1466 N Ashland Ave, Chicago, IL 60622",phone:"(773) 252-1466",
  lat:41.9081,lng:-87.6683,instagram:"schwarestaurant",website:"https://www.schwarestaurant.com",res_tier:1});

add({name:"Sepia",cuisine:"American / French",neighborhood:"West Loop",
  score:91,price:3,tags:["Fine Dining","Date Night","Cocktails","Awards"],
  reservation:"OpenTable",awards:"Michelin 1 Star",
  description:"Andrew Zimmerman's seasonal American restaurant in a stunning 1890s print shop in the West Loop. The menu marries French technique with Midwestern ingredients — foie gras, duck, and pristine fish preparations. The cocktail program is one of the city's best and the space itself is architectural eye candy. Michelin-starred since 2011.",
  dishes:["Seasonal Tasting","Duck","Foie Gras","Craft Cocktails"],
  address:"123 N Jefferson St, Chicago, IL 60661",phone:"(312) 441-1920",
  lat:41.8842,lng:-87.6422,instagram:"sepiachicago",website:"https://www.sepiachicago.com"});

add({name:"Next",cuisine:"Rotating Theme",neighborhood:"West Loop / Fulton Market",
  score:93,price:4,tags:["Fine Dining","Tasting Menu","Date Night","Exclusive","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",group:"Alinea Group",
  description:"Grant Achatz's West Loop restaurant that reinvents itself completely every few months with a new theme, menu, and identity. Past themes have included Paris 1906, Childhood, and Thai street food. Tickets are sold in advance like a theater performance. One of the most ambitious restaurant concepts in the world.",
  dishes:["Theme-Based Tasting Menu","Rotating Cuisine","Wine Pairing"],
  address:"953 W Fulton Market, Chicago, IL 60607",phone:"(312) 226-0858",
  lat:41.8867,lng:-87.6517,instagram:"nextrestaurant",website:"https://www.nextrestaurant.com",res_tier:1});

add({name:"Moody Tongue",cuisine:"Brewpub / Fine Dining",neighborhood:"South Loop",
  score:90,price:3,tags:["Fine Dining","Brewery","Tasting Menu","Date Night","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",
  description:"The world's first Michelin-starred brewpub. Chef Jared Rouben pairs a multi-course tasting menu with house-brewed beers on the second floor, while the downstairs taproom serves more casual fare. The Shaved Black Truffle Pilsner is legendary. A completely unique Chicago dining experience that bridges craft beer and fine dining.",
  dishes:["Tasting Menu","Beer Pairing","Truffle Pilsner","Seasonal Plates"],
  address:"2515 S Wabash Ave, Chicago, IL 60616",phone:"(312) 600-5111",
  lat:41.8491,lng:-87.6254,instagram:"moodytongue",website:"https://www.moodytongue.com"});

add({name:"Mako",cuisine:"Japanese Omakase",neighborhood:"West Loop / Fulton Market",
  score:92,price:4,tags:["Japanese","Omakase","Fine Dining","Date Night","Exclusive","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",
  description:"Intimate West Loop omakase counter where chef B.K. Park crafts 15+ courses of pristine sushi and Japanese small plates. Fish is flown in from Tokyo's markets and each piece of nigiri is a study in precision. One of the hardest reservations in Chicago — book the moment tickets drop.",
  dishes:["Omakase Course","Nigiri","Seasonal Sashimi","Sake Pairing"],
  address:"731 W Lake St, Chicago, IL 60661",phone:"(312) 888-7500",
  lat:41.8855,lng:-87.6468,instagram:"makochicago",website:"https://www.makochicago.com",res_tier:1});

add({name:"Esmé",cuisine:"Creative American",neighborhood:"Lincoln Park",
  score:92,price:4,tags:["Fine Dining","Tasting Menu","Date Night","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",
  description:"Chef Jenner Tomaska's Lincoln Park tasting menu restaurant delivering deeply personal, technique-driven courses that draw from his Midwestern roots. Every detail is curated — from the handmade ceramics to the storytelling behind each dish. One of Chicago's most emotionally resonant fine dining experiences.",
  dishes:["Multi-Course Tasting","Seasonal Plates","Wine Pairing","Dessert Course"],
  address:"2200 N Clark St, Chicago, IL 60614",phone:"(312) 386-8999",
  lat:41.9211,lng:-87.6368,instagram:"esmechicago",website:"https://www.esmechicago.com",res_tier:1});

add({name:"Cariño",cuisine:"Modern Mexican",neighborhood:"Uptown",
  score:90,price:3,tags:["Mexican","Fine Dining","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin 1 Star",
  description:"Modern Mexican from chef Edgar Gonzalez in Uptown that earned a Michelin star with dishes rooted in his Guerrero heritage. Moles built from 30+ ingredients, hand-pressed tortillas, and a mezcal program that rivals any in the city. The intimate space and personal service make every visit feel like a discovery.",
  dishes:["Mole","Hand-Pressed Tortillas","Mezcal Flights","Seasonal Mexican"],
  address:"4862 N Broadway, Chicago, IL 60640",phone:"(773) 654-3647",
  lat:41.9714,lng:-87.6583,instagram:"carinochicago",website:"https://www.carinochicago.com"});

add({name:"EL Ideas",cuisine:"Creative / BYOB",neighborhood:"Douglas Park",
  score:90,price:3,tags:["Fine Dining","Tasting Menu","BYOB","Awards"],
  reservation:"Tock",awards:"Michelin 1 Star",
  description:"Chef Phillip Foss's iconoclastic BYOB tasting menu restaurant in Douglas Park. The open kitchen doubles as the dining room — guests sit at the counter and interact with the chefs through every course. BYOB means you pick the wine. The vibe is casual, the food is Michelin-starred, and nothing about it is conventional.",
  dishes:["Tasting Menu","Open Kitchen Counter","BYOB"],
  address:"2419 W 14th St, Chicago, IL 60608",phone:"(312) 226-8144",
  lat:41.8574,lng:-87.6847,instagram:"elideaschicago",website:"https://www.elideas.com"});

add({name:"Atelier",cuisine:"New American / European",neighborhood:"Lincoln Square",
  score:90,price:3,tags:["Fine Dining","Date Night","Tasting Menu","Awards"],
  reservation:"Resy",awards:"Michelin 1 Star",
  description:"Intimate Lincoln Square fine dining where chef Nathan Sears delivers seasonal tasting menus with European finesse. The neighborhood setting is quiet and personal, a contrast to the West Loop scene. Each course showcases exquisite technique and local sourcing. Michelin-starred and still under the radar for most Chicagoans.",
  dishes:["Seasonal Tasting Menu","European-Inspired Courses","Wine Pairing"],
  address:"4835 N Western Ave, Chicago, IL 60625",phone:"(773) 942-6522",
  lat:41.9710,lng:-87.6893,instagram:"atelierchicago",website:"https://www.atelierchicago.com"});

// === KEY BIB GOURMAND ===

add({name:"Daisies",cuisine:"Italian / Midwestern",neighborhood:"Logan Square",
  score:88,price:2,tags:["Italian","Pasta","Date Night","Local Favorites","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",group:"",
  description:"Chef Joe Frillman's Logan Square Italian where handmade pastas meet Midwestern produce. The seasonal menu changes with the farmers market, the bread program is excellent, and the natural wine list is well-curated. Michelin Bib Gourmand and a Logan Square anchor that epitomizes the neighborhood's food-first culture.",
  dishes:["Handmade Pasta","Seasonal Vegetables","Fresh Bread","Natural Wine"],
  address:"2523 N Milwaukee Ave, Chicago, IL 60647",phone:"(773) 661-1671",
  lat:41.9271,lng:-87.6978,instagram:"daisieschicago",website:"https://www.daisieschicago.com"});

add({name:"Gilt Bar",cuisine:"American / Gastropub",neighborhood:"River North",
  score:87,price:2,tags:["American","Cocktails","Date Night","Late Night","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"Subterranean River North gastropub with a speakeasy-era atmosphere, excellent cocktails, and a menu that punches above its weight class. The burger is legendary, the cocktails are old-school perfection, and the late-night scene draws the industry crowd. Michelin Bib Gourmand and one of Chicago's great bar-restaurants.",
  dishes:["Gilt Burger","Craft Cocktails","Charcuterie","Late Night Menu"],
  address:"230 W Kinzie St, Chicago, IL 60654",phone:"(312) 464-9544",
  lat:41.8892,lng:-87.6358,instagram:"giltbarchicago",website:"https://www.giltbarchicago.com"});

add({name:"Pleasant House Pub",cuisine:"British / Gastropub",neighborhood:"Pilsen",
  score:86,price:1,tags:["British","Gastropub","Pies","Casual","Local Favorites","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Pilsen gastropub specializing in British-style savory pies — Royal Steak & Ale, Chicken Balti, Kale & Mushroom — alongside craft beers and a cozy pub atmosphere. The meat pies are made from scratch daily and the pub vibe is genuinely warm. Michelin Bib Gourmand for excellent value. A Pilsen institution.",
  dishes:["Royal Steak & Ale Pie","Chicken Balti Pie","Fish & Chips","Craft Beer"],
  address:"2119 S Halsted St, Chicago, IL 60608",phone:"(773) 523-7437",
  lat:41.8540,lng:-87.6465,instagram:"pleasanthousepub",website:"https://www.pleasanthousepub.com"});

add({name:"Superkhana International",cuisine:"Indian / Creative",neighborhood:"Logan Square",
  score:87,price:2,tags:["Indian","Creative","Cocktails","Local Favorites","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"Logan Square's boundary-pushing Indian restaurant from the Lula Cafe alumni. The menu riffs on Indian street food with creative American touches — think samosa chaat with seasonal vegetables, tandoori chicken with unexpected sauces, and cocktails infused with Indian spices. Michelin Bib Gourmand and one of Chicago's most exciting Indian restaurants.",
  dishes:["Samosa Chaat","Tandoori Chicken","Indian Street Food","Spiced Cocktails"],
  address:"3059 W Diversey Ave, Chicago, IL 60647",phone:"(773) 661-9700",
  lat:41.9316,lng:-87.7047,instagram:"superkhanachi",website:"https://www.superkhanachicago.com"});

add({name:"Nadu",cuisine:"South Indian",neighborhood:"Lincoln Park",
  score:87,price:2,tags:["Indian","South Indian","Date Night","Awards","New Opening"],
  indicators:["new"],reservation:"Resy",awards:"Michelin Bib Gourmand 2025",
  description:"South Indian fine casual in Lincoln Park that earned a Michelin Bib Gourmand in its first year. Dosas, uttapam, and thali plates with technique that honors Tamil Nadu traditions. The rice and curry combos are deeply flavored and the cocktail program adds creative Indian-spiced drinks. A new Bib Gourmand standout.",
  dishes:["Dosas","Uttapam","Thali Plates","Indian Cocktails"],
  address:"2518 N Lincoln Ave, Chicago, IL 60614",phone:"(773) 360-8898",
  lat:41.9280,lng:-87.6494,instagram:"naduchicago",website:"https://www.naduchicago.com",trending:true});

add({name:"Mirra",cuisine:"Mexican Fusion",neighborhood:"Bucktown",
  score:87,price:2,tags:["Mexican","Fusion","Date Night","Cocktails","Awards","New Opening"],
  indicators:["new"],reservation:"Resy",awards:"Michelin Bib Gourmand 2025",
  description:"New Bucktown Mexican fusion that earned a Michelin Bib Gourmand in 2025. Creative dishes that bridge Mexican traditions with global technique — think mole with unexpected ingredients and tacos elevated to fine-casual heights. One of three new Bib Gourmands added to the Chicago guide this year.",
  dishes:["Creative Mole","Elevated Tacos","Mezcal Cocktails","Seasonal Mexican"],
  address:"1954 W Armitage Ave, Chicago, IL 60622",phone:"(773) 661-1500",
  lat:41.9176,lng:-87.6768,instagram:"mirrachicago",website:"https://www.mirrachicago.com",trending:true});

add({name:"Perilla",cuisine:"Korean-American",neighborhood:"West Town",
  score:87,price:2,tags:["Korean","American","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"Korean-American fusion in West Town where traditional Korean flavors meet American comfort food. Ssam, kimchi fried rice, and Korean fried chicken are elevated with careful technique, and the soju cocktails are creative. Michelin Bib Gourmand and part of Chicago's growing Korean dining scene.",
  dishes:["Ssam","Kimchi Fried Rice","Korean Fried Chicken","Soju Cocktails"],
  address:"401 N Milwaukee Ave, Chicago, IL 60654",phone:"(312) 877-5268",
  lat:41.8896,lng:-87.6522,instagram:"perillachicago",website:"https://www.perillachicago.com"});

add({name:"Taqueria Chingón",cuisine:"Mexican / Tacos",neighborhood:"Fulton Market",
  score:86,price:1,tags:["Mexican","Tacos","Casual","Late Night","Awards","New Opening"],
  indicators:["new"],reservation:"walk-in",awards:"Michelin Bib Gourmand 2025",
  description:"Moved from Bucktown to a bigger Fulton Market space and immediately earned a Michelin Bib Gourmand. The al pastor is carved from the trompo, the birria tacos are rich and messy, and the agua frescas are house-made. Late-night hours make it a post-bar essential. Chicago's best taqueria just leveled up.",
  dishes:["Al Pastor Tacos","Birria Tacos","Agua Frescas","Elote"],
  address:"817 W Fulton Market, Chicago, IL 60607",phone:"(773) 904-7377",
  lat:41.8867,lng:-87.6490,instagram:"taqueriachingon",website:"https://www.taqueriachingon.com",trending:true});

add({name:"Sochi",cuisine:"Vietnamese",neighborhood:"Lakeview",
  score:86,price:2,tags:["Vietnamese","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"Modern Vietnamese in Lakeview with pho, banh mi, and vermicelli bowls elevated with local ingredients and careful technique. The cocktails draw from Vietnamese flavors — lemongrass, tamarind, Thai basil — and the space is sleek and date-night worthy. Michelin Bib Gourmand and quietly excellent.",
  dishes:["Pho","Banh Mi","Vermicelli Bowls","Vietnamese Cocktails"],
  address:"1358 W Belmont Ave, Chicago, IL 60657",phone:"(773) 360-8122",
  lat:41.9396,lng:-87.6625,instagram:"sochichicago",website:"https://www.sochichicago.com"});

// === ESSENTIAL CHICAGO NOT YET IN DATA ===

add({name:"Gibson's Bar & Steakhouse",cuisine:"Steakhouse",neighborhood:"Gold Coast",
  score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Celebrations","Classic"],
  reservation:"OpenTable",awards:"Chicago institution since 1989",
  description:"The Gold Coast steakhouse where Chicago's power brokers, athletes, and celebrities have been cutting deals over dry-aged prime steaks since 1989. The W.R.'s Chicago Cut is the signature, the bar scene is legendary, and the people-watching is world-class. The most 'Chicago' steakhouse in the city.",
  dishes:["W.R.'s Chicago Cut","Bone-In Ribeye","Gibson's Martini","Key Lime Pie"],
  address:"1028 N Rush St, Chicago, IL 60611",phone:"(312) 266-8999",
  lat:41.9015,lng:-87.6283,instagram:"gibsonssteakhouse",website:"https://www.gibsonssteakhouse.com"});

add({name:"Joe's Seafood, Prime Steak & Stone Crab",cuisine:"Seafood / Steakhouse",neighborhood:"River North",
  score:88,price:4,tags:["Seafood","Steakhouse","Fine Dining","Date Night"],
  reservation:"OpenTable",awards:"Lettuce Entertain You concept",group:"Lettuce Entertain You",
  description:"LEYE's partnership with Miami's legendary Joe's Stone Crab, bringing the famous stone crab claws to River North alongside prime steaks and an extensive raw bar. The stone crab season (Oct-May) is the main event, but the menu is a full surf-and-turf experience year-round.",
  dishes:["Stone Crab Claws","Prime Steaks","Raw Bar","Key Lime Pie"],
  address:"60 E Grand Ave, Chicago, IL 60611",phone:"(312) 379-5637",
  lat:41.8916,lng:-87.6254,instagram:"joesseafoodchicago",website:"https://www.joes.net",res_tier:2});

add({name:"Sol de Mexico",cuisine:"Mexican / Regional",neighborhood:"Northwest Side",
  score:86,price:2,tags:["Mexican","Local Favorites","Casual","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Family-run regional Mexican on the Northwest Side that's been a Michelin Bib Gourmand for years. The moles are made from scratch with dozens of ingredients, the chiles rellenos are perfectly battered, and the Sunday pozole is a weekend tradition. One of Chicago's most authentic Mexican restaurants.",
  dishes:["Mole","Chiles Rellenos","Pozole","Enchiladas"],
  address:"3018 N Cicero Ave, Chicago, IL 60641",phone:"(773) 282-4119",
  lat:41.9349,lng:-87.7453,instagram:"soldemexicochicago",website:"https://www.soldemexicochicago.com"});

add({name:"Ciccio Mio",cuisine:"Italian-American",neighborhood:"River North",
  score:86,price:2,tags:["Italian","Casual","Date Night","Cocktails","Awards"],
  reservation:"Resy",awards:"Michelin Bib Gourmand",
  description:"River North Italian-American joint that nails the neighborhood trattoria vibe. Handmade pastas, meatballs, and a veal chop that draws regulars weekly. The cocktail list leans Italian with Negronis and spritzes. Michelin Bib Gourmand and the kind of dependable Italian spot every neighborhood needs.",
  dishes:["Handmade Pasta","Meatballs","Veal Chop","Negroni"],
  address:"226 W Kinzie St, Chicago, IL 60654",phone:"(312) 527-2800",
  lat:41.8892,lng:-87.6356,instagram:"cicciomiochicago",website:"https://www.cicciomiochicago.com"});

add({name:"Kie-Gol-Lanee",cuisine:"Mexican / Oaxacan",neighborhood:"Uptown",
  score:86,price:1,tags:["Mexican","Oaxacan","Mole","Casual","Awards"],
  reservation:"walk-in",awards:"Michelin Bib Gourmand",
  description:"Uptown Oaxacan restaurant where the mole negro takes three days to make. The tlayudas are enormous, the tamales are wrapped in banana leaf, and the mezcal selection is serious. Michelin Bib Gourmand and Chicago's best destination for Oaxacan regional cooking. A labor of love.",
  dishes:["Mole Negro","Tlayudas","Tamales","Mezcal"],
  address:"5004 N Sheridan Rd, Chicago, IL 60640",phone:"(773) 570-0845",
  lat:41.9728,lng:-87.6551,instagram:"kiegollanee",website:"https://www.kiegollanee.com"});

add({name:"Swift & Sons",cuisine:"Steakhouse",neighborhood:"Fulton Market",
  score:89,price:4,tags:["Steakhouse","Fine Dining","Date Night","Cocktails"],
  reservation:"OpenTable",awards:"Boka Restaurant Group",group:"Boka Restaurant Group",
  description:"Boka Restaurant Group's Fulton Market steakhouse that reinvents the genre with dry-aged prime cuts, a raw bar, and a cocktail program from the Aviary team. The space channels old-school Chicago stockyard glamour with modern polish. The prime rib for two is a showstopper.",
  dishes:["Dry-Aged Steaks","Prime Rib for Two","Raw Bar","Cocktails"],
  address:"1000 W Fulton Market, Chicago, IL 60607",phone:"(312) 733-9420",
  lat:41.8867,lng:-87.6534,instagram:"swiftandsonschicago",website:"https://www.swiftandsonschicago.com"});

// Write back
html = html.slice(0, chiArr) + JSON.stringify(arr) + html.slice(e);
fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Chicago: ' + arr.length + ' spots (added ' + added + ' this batch)');

// Show group counts
const groups = {};
arr.filter(r=>r.group&&r.group.trim()).forEach(r=>{if(!groups[r.group])groups[r.group]=[];groups[r.group].push(r.name);});
const multi = Object.entries(groups).filter(([k,v])=>v.length>=2).sort((a,b)=>b[1].length-a[1].length);
console.log('\nHospitality groups (2+):');
multi.forEach(([g,r])=>console.log('  '+r.length+' '+g));
