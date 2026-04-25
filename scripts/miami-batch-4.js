const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'index.html');
const PREFIX = 'const MIAMI_DATA=';

const NEW_CARDS = [
  {
    id:4139, name:"Tacombi Wynwood", phone:"(212) 290-2702",
    cuisine:"Mexican / Tacos", neighborhood:"Wynwood", score:88, price:2,
    tags:["Mexican","Tacos","Casual","All-Day","Local Favorites","Margaritas"],
    reservation:"Resy", awards:"",
    description:"The Yucatán-style taqueria that started in a VW combi van and grew into a small chain — the Wynwood location keeps the open-kitchen, blue-tile and cilantro-rice format that turned the brand into a Manhattan staple.",
    dishes:["Carne Asada Tacos","Pescado Veracruz","Esquites","Margarita","Horchata"],
    address:"30 NW 24th St, Miami FL 33127", lat:25.7998, lng:-80.1957,
    website:"https://tacombi.com/locations/wynwood-miami", instagram:"@tacombi",
    menuUrl:"https://tacombi.com/menus", hours:"Daily 11am-11pm"
  },
  {
    id:4140, name:"Treehouse Miami", phone:"(786) 318-1908",
    cuisine:"Nightclub", neighborhood:"South Beach", score:87, price:3,
    tags:["Nightclub","Underground","Late Night","DJ","House","Local Favorites"],
    reservation:"walk-in", awards:"",
    description:"South Beach's underground-house alternative to LIV/STORY — single-room sound system tuned for techno and disco, no bottle-service tax, the dance floor that the city's serious DJs head to after their gigs.",
    dishes:["Cocktails","Vodka Soda","Tequila","Mezcal","Beer"],
    address:"323 23rd St, Miami Beach FL 33139", lat:25.7991, lng:-80.1294,
    website:"https://treehousemia.com", instagram:"@treehousemia",
    hours:"Thu-Sun 11pm-5am"
  },
  {
    id:4141, name:"Bagatelle Miami", phone:"(305) 704-3500",
    cuisine:"French Mediterranean", neighborhood:"South Beach", score:87, price:4,
    tags:["French","Scene","Late Night","Brunch","Hotel Restaurant","Sceney"],
    reservation:"SevenRooms", awards:"",
    description:"The Saint-Tropez transplant that turned Sunday brunch in South Beach into a champagne-spraying daytime club — DJs by 1pm, table service by 2pm, and a menu of French-Med classics that's almost beside the point.",
    dishes:["Steak Tartare","Whole Branzino","Lobster Salad","Truffle Pizza","Tarte au Citron"],
    address:"2466 Collins Ave, Miami Beach FL 33140", lat:25.8007, lng:-80.1267,
    website:"https://bistrotbagatelle.com/miami", instagram:"@bagatellemiami",
    menuUrl:"https://bistrotbagatelle.com/miami/menu", hours:"Daily; Brunch Sat-Sun",
    photoUrl:"https://media.timeout.com/images/106117883/image.jpg"
  },
  {
    id:4142, name:"Bar Kaiju", phone:"(786) 953-7711",
    cuisine:"Cocktail Bar / Japanese", neighborhood:"Little River", score:90, price:3,
    tags:["Cocktails","Japanese","Critics Pick","Date Night","Hidden","Local Favorites"],
    reservation:"walk-in", awards:"",
    description:"Tucked behind a Japanese-grocery storefront in Little River — Anthony Sciortino's whisky-and-highball hideaway with arcade gameplay, vintage Tokyo records, and a cocktail menu that reads like a film-noir manifesto.",
    dishes:["Highball","Old Fashioned","Negroni","Sake Sour","Gyoza"],
    address:"7244 Biscayne Blvd, Miami FL 33138", lat:25.8420, lng:-80.1846,
    website:"https://barkaiju.com", instagram:"@bar.kaiju",
    hours:"Tue-Sun 6pm-2am"
  },
  {
    id:4143, name:"Mama Tried", phone:"(305) 985-4154",
    cuisine:"Late Night Bar", neighborhood:"Downtown Miami", score:86, price:2,
    tags:["Dive Bar","Late Night","Cocktails","Local Favorites","Music"],
    reservation:"walk-in", awards:"",
    description:"Downtown Miami's after-hours bar — open till 5am, a wood-paneled room with mid-tier cocktails and a jukebox, the place where every other bar's last call ends up.",
    dishes:["Margarita","Old Fashioned","Vodka Soda","Whiskey Highball","Mezcal Sour"],
    address:"56 NE 14th St, Miami FL 33132", lat:25.7884, lng:-80.1935,
    website:"https://mamatriedmiami.com", instagram:"@mamatriedmiami",
    hours:"Daily 6pm-5am"
  },
  {
    id:4144, name:"The Sylvester", phone:"(786) 360-1860",
    cuisine:"Cocktail Lounge", neighborhood:"Midtown Miami", score:84, price:2,
    tags:["Cocktails","Retro","Local Favorites","Date Night","Happy Hour"],
    reservation:"walk-in", awards:"",
    description:"Midtown's velvet-and-brass cocktail lounge — tiki-leaning frozen drinks, a bar program that takes Negronis seriously without overcharging, and the rare Miami room that feels like New York's East Village.",
    dishes:["Frozen Negroni","Painkiller","French 75","Old Fashioned","Charcuterie Board"],
    address:"2010 N Miami Ave, Miami FL 33127", lat:25.7958, lng:-80.1949,
    website:"https://thesylvestermiami.com", instagram:"@thesylvestermiami",
    hours:"Daily 5pm-2am"
  },
  {
    id:4145, name:"WALL Lounge", phone:"(305) 938-3130",
    cuisine:"Nightclub", neighborhood:"South Beach", score:88, price:4,
    tags:["Nightclub","Hotel Bar","Scene","Bottle Service","Late Night"],
    reservation:"SevenRooms", awards:"",
    description:"The W South Beach's intimate club — David Grutman's smaller-format dance floor with mosaic walls and house DJs, the antidote to LIV when you want a bottle without a 1,500-person room.",
    dishes:["Bottle Service","Champagne","Patrón","Don Julio","Belvedere"],
    address:"2201 Collins Ave, Miami Beach FL 33139", lat:25.7975, lng:-80.1272,
    website:"https://walllounge.com", instagram:"@walloungemiami",
    hours:"Wed/Fri/Sat 11pm-5am"
  },
  {
    id:4146, name:"Pubbelly Sushi Sunset Harbour", phone:"(305) 532-7555",
    cuisine:"Japanese / Sushi", neighborhood:"South Beach", score:88, price:3,
    tags:["Sushi","Japanese","Date Night","Local Favorites","Critics Pick"],
    reservation:"OpenTable", awards:"",
    description:"José Mendín's Sunset Harbour sushi room — the Pubbelly that started the local-sushi-bar movement in Miami before expanding to Aventura and beyond. Hot-rock sashimi, robatayaki, and rolls that still set the city's bar.",
    dishes:["Butter Crab Roll","Pulled Short Rib Roll","Hot Rock Sashimi","Foie Gras Maki","Yellowtail Truffle"],
    address:"1418 20th St, Miami Beach FL 33139", lat:25.7958, lng:-80.1296,
    website:"https://pubbellysushi.com", instagram:"@pubbellysushi",
    menuUrl:"https://pubbellysushi.com/menu/", hours:"Lunch & Dinner daily"
  },
  {
    id:4147, name:"Strawberry Moon", phone:"(786) 542-3600",
    cuisine:"Mediterranean / Pool Club", neighborhood:"South Beach", score:87, price:4,
    tags:["Pool Club","Mediterranean","Brunch","Scene","Hotel Restaurant","Outdoor"],
    reservation:"SevenRooms", awards:"",
    description:"The Goodtime Hotel's pool-deck Mediterranean restaurant — Pharrell and David Grutman's collaboration where rosé carts circle a pink-cabana pool and the kitchen sends out grilled branzino like it's still 1995 in Mykonos.",
    dishes:["Whole Grilled Branzino","Octopus a la Plancha","Watermelon Feta Salad","Rosé Spritz","Hummus & Pita"],
    address:"601 Washington Ave, Miami Beach FL 33139", lat:25.7763, lng:-80.1334,
    website:"https://thegoodtimehotel.com/strawberry-moon", instagram:"@strawberrymoon",
    menuUrl:"https://thegoodtimehotel.com/strawberry-moon/menu", hours:"Daily; Brunch Sat-Sun"
  },
  {
    id:4148, name:"Champagne Bar at The Surf Club", phone:"(305) 768-9440",
    cuisine:"Champagne Lounge", neighborhood:"Surfside", score:91, price:4,
    tags:["Champagne","Cocktails","Date Night","Hotel Bar","Iconic","Awards"],
    reservation:"SevenRooms", awards:"",
    description:"Inside Joseph Dirand's restored 1930 cabana club at the Four Seasons Surfside — the most architecturally serious bar in Miami, a marble-and-mirror temple where the by-the-glass champagne list reads like a vintage retrospective.",
    dishes:["Vintage Champagne","Negroni","Old Fashioned","Caviar Service","Smoked Salmon"],
    address:"9011 Collins Ave, Surfside FL 33154", lat:25.8779, lng:-80.1214,
    website:"https://www.fourseasons.com/surfside/dining/lounges/champagne_bar", instagram:"@thesurfclubmiami",
    hours:"Daily 4pm-12am"
  },
  {
    id:4149, name:"Joia Beach", phone:"(305) 615-1995",
    cuisine:"Mediterranean / Beach Club", neighborhood:"Watson Island", score:84, price:3,
    tags:["Beach Club","Mediterranean","Sunday","Outdoor","Views","Brunch"],
    reservation:"OpenTable", awards:"",
    description:"Watson Island's daytime Mediterranean beach club — sand-floor dining with a Miami-skyline view across Biscayne Bay, the kind of long Saturday lunch that ends with someone ordering a third bottle of rosé.",
    dishes:["Whole Grilled Fish","Joia Pizza","Burrata","Aperol Spritz","Ceviche"],
    address:"888 MacArthur Cswy, Miami FL 33132", lat:25.7874, lng:-80.1824,
    website:"https://joiabeach.com", instagram:"@joiabeachmiami",
    menuUrl:"https://joiabeach.com/menu", hours:"Daily 11am-11pm"
  },
  {
    id:4150, name:"World Famous House of Mac", phone:"(305) 770-1940",
    cuisine:"Soul Food", neighborhood:"Liberty City", score:85, price:2,
    tags:["Soul Food","Mac & Cheese","Casual","Local Favorites","Cultural"],
    reservation:"walk-in", awards:"",
    description:"Chef Derrick 'Mac Daddy' Williams' Liberty City soul-food counter — eleven varieties of mac & cheese, oxtail and turkey wings the way South Florida grandmothers make them, and a line that often starts before the doors open.",
    dishes:["Lobster Mac & Cheese","Oxtail","Smothered Turkey Wings","Collards","Sweet Potato Pie"],
    address:"5648 NW 5th Ave, Miami FL 33127", lat:25.8274, lng:-80.2041,
    website:"https://worldfamoushouseofmac.com", instagram:"@worldfamoushouseofmac",
    menuUrl:"https://worldfamoushouseofmac.com/menu", hours:"Tue-Sat 11am-9pm"
  },
  {
    id:4151, name:"Lagniappe", phone:"(305) 532-1717",
    cuisine:"Wine Bar", neighborhood:"Wynwood", score:86, price:2,
    tags:["Wine Bar","Live Music","Outdoor","Local Favorites","Date Night"],
    reservation:"walk-in", awards:"",
    description:"The Wynwood courtyard wine bar where charcuterie boards arrive on butcher paper and live jazz plays under string lights — Miami's New Orleans transplant, still the city's best low-key date night.",
    dishes:["Charcuterie Board","Cheese Board","Glass of Cab","Glass of Rosé","Truffle Mac"],
    address:"3425 NE 2nd Ave, Miami FL 33137", lat:25.8090, lng:-80.1910,
    website:"https://lagniappehouse.com", instagram:"@lagniappehouse",
    hours:"Daily 5pm-3am"
  },
  {
    id:4152, name:"Baby Jane", phone:"(305) 514-0055",
    cuisine:"Late Night Cocktail Bar / Asian", neighborhood:"Brickell", score:87, price:3,
    tags:["Late Night","Asian","Cocktails","Scene","Critics Pick","Hidden"],
    reservation:"Resy", awards:"",
    description:"The Brickell speakeasy that doubles as a late-night Pan-Asian dining room — pork-belly bao and lobster roll until 4am, an after-hours dance floor for the suit-and-heels crowd.",
    dishes:["Pork Belly Bao","Crispy Lobster Roll","Drunken Noodles","Mai Tai","Lychee Martini"],
    address:"247 SW 8th St, Miami FL 33130", lat:25.7666, lng:-80.1984,
    website:"https://babyjanemia.com", instagram:"@babyjanemia",
    hours:"Daily 5pm-5am",
    photoUrl:"https://media.timeout.com/images/103331256/image.jpg"
  },
  {
    id:4153, name:"Blackbird Ordinary", phone:"(305) 671-3307",
    cuisine:"Late Night Bar", neighborhood:"Brickell", score:84, price:2,
    tags:["Late Night","Cocktails","Live Music","Local Favorites","Dance Floor"],
    reservation:"walk-in", awards:"",
    description:"Brickell's longest-running independent bar — Daniel Toral's neighborhood institution where the cocktail program is sharper than the room suggests, and weeknights end on a small dance floor most cities would charge cover for.",
    dishes:["Cocktail of the Day","Old Fashioned","Cuban Mojito","Margarita","Bar Snacks"],
    address:"729 SW 1st Ave, Miami FL 33130", lat:25.7670, lng:-80.1958,
    website:"https://blackbirdordinary.com", instagram:"@blackbirdordinary",
    hours:"Daily 3pm-5am"
  },
  {
    id:4154, name:"Magie", phone:"(305) 714-3300",
    cuisine:"Wine Bar", neighborhood:"Little River", score:88, price:3,
    tags:["Wine Bar","Natural Wine","Critics Pick","Date Night","Local Favorites"],
    reservation:"Resy", awards:"",
    description:"Little River's natural-wine room from the Boia De team — a curated by-the-glass list that tilts toward small French and Italian growers, paired with a tight food menu of cured fish and seasonal vegetables.",
    dishes:["House Charcuterie","Tinned Fish Plate","Burrata & Stone Fruit","Glass of Pet-Nat","Crudo"],
    address:"7160 Biscayne Blvd, Miami FL 33138", lat:25.8407, lng:-80.1842,
    website:"https://magiemiami.com", instagram:"@magiemiami",
    hours:"Tue-Sat 5pm-12am"
  }
];

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let idx = -1;
for (let i = 0; i < lines.length; i++) if (lines[i].startsWith(PREFIX)) { idx = i; break; }
const line = lines[idx];
const start = line.indexOf('=[') + 1;
const end = line.lastIndexOf('];');
const arr = JSON.parse(line.slice(start, end + 1));
const existingIds = new Set(arr.map(c => c.id));
const existingNames = new Set(arr.map(c => c.name.toLowerCase()));
for (const c of NEW_CARDS) {
  if (existingIds.has(c.id)) { console.error('ID collision', c.id); process.exit(1); }
  if (existingNames.has(c.name.toLowerCase())) { console.error('Name dup', c.name); process.exit(1); }
}

const SAMPLE_KEYS = Object.keys(arr[0]);
const ALL_KEYS = [...SAMPLE_KEYS];
['photoUrl','menuUrl','awards'].forEach(k => { if (!ALL_KEYS.includes(k)) ALL_KEYS.push(k); });
const DEFAULTS = {phone:'',bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',suburb:false,reserveUrl:'',menuUrl:'',indicators:[],hh:'',awards:'',photoUrl:''};

const merged = NEW_CARDS.map(card => {
  const out = {};
  for (const k of ALL_KEYS) out[k] = (k in card) ? card[k] : (k in DEFAULTS ? DEFAULTS[k] : '');
  for (const k of Object.keys(card)) if (!(k in out)) out[k] = card[k];
  return out;
});

lines[idx] = `const MIAMI_DATA=${JSON.stringify([...arr, ...merged])};`;
fs.writeFileSync(FILE, lines.join('\n'), 'utf8');
console.log('Wrote', merged.length, 'cards. New total:', arr.length + merged.length);
console.log('IDs:', merged.map(c => c.id).join(','));
console.log('With photoUrl:', merged.filter(c => c.photoUrl).length);
