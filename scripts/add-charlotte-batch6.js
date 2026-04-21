// Charlotte batch 6 — Hospitality-group additions per user.
// Sources: user's named groups (Rare Roots, FS Food, Mac's, Moffett, Built on Hospitality,
// 1957 Hospitality, Tonidandel-Brown, Raydal) + scrape of theindigoroad.com,
// xeniahospitality.com, the5thstreetgroup.com.
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const varName = 'CHARLOTTE_DATA';
const declStart = html.indexOf('const ' + varName + '=');
if (declStart < 0) { console.error(varName + ' not found'); process.exit(1); }
const open = html.indexOf('[', declStart);
let depth = 0, close = open;
for (let j = open; j < html.length; j++) {
  if (html[j] === '[') depth++;
  else if (html[j] === ']') { depth--; if (depth === 0) { close = j; break; } }
}
const sliceStart = open, sliceEnd = close + 1;
const data = eval(html.slice(sliceStart, sliceEnd));
const existingIds = data.map(r => r.id).filter(Number.isFinite);
let nextId = (existingIds.length ? Math.max(...existingIds) : 8000) + 1;

const base = { phone:'', bestOf:[], busyness:null, waitTime:null, popularTimes:null, lastUpdated:null, trending:false, suburb:false, reserveUrl:'', menuUrl:'' };

const newRestaurants = [
  // ============ RARE ROOTS HOSPITALITY ============
  {...base,id:nextId++,name:"Dressler's Restaurant — Metropolitan",cuisine:"Steakhouse / American",neighborhood:"Midtown",score:88,price:4,tags:["Steakhouse","American","Date Night","Critics Pick","Cocktails","Iconic"],indicators:["iconic"],hh:"",reservation:"OpenTable",awards:"Rare Roots Hospitality flagship",description:"Rare Roots Hospitality's polished steakhouse-and-American flagship at the Metropolitan in Midtown — dry-aged steaks, an Atlantic seafood program, and one of the most consistent date-night rooms in the metro.",dishes:["Dry-Aged Ribeye","Crab Cake","Lobster Tail","Bread Pudding"],address:"1100 Metropolitan Ave Ste 100, Charlotte NC 28204",lat:35.2120,lng:-80.8330,website:"https://dresslersrestaurant.com",instagram:"@dresslersrestaurant",res_tier:4,hours:"Dinner daily, Brunch Sat-Sun",group:"Rare Roots Hospitality"},
  {...base,id:nextId++,name:"Chapter 6",cuisine:"Modern American",neighborhood:"South End",score:86,price:3,tags:["New American","Date Night","Cocktails","Critics Pick","Patio","Scene"],indicators:[],hh:"",reservation:"Resy",awards:"",description:"Rare Roots Hospitality's South End modern-American restaurant on Hawkins Street — open kitchen, a thoughtful seasonal menu, and a strong cocktail program in a buzzy room.",dishes:["Seasonal Menu","Wood-Fired Vegetables","Handmade Pasta","Signature Cocktails"],address:"2151 Hawkins St, Charlotte NC 28203",lat:35.2055,lng:-80.8617,website:"",instagram:"@chapter6clt",hours:"Dinner Tue-Sun",group:"Rare Roots Hospitality"},
  {...base,id:nextId++,name:"The Porter's House",cuisine:"Steakhouse / Chophouse",neighborhood:"Huntersville",score:85,price:4,tags:["Steakhouse","Date Night","Local Favorites","Cocktails","Suburb"],indicators:[],hh:"",reservation:"OpenTable",awards:"Rare Roots Hospitality",description:"Rare Roots' chophouse at Birkdale Village in Huntersville — prime cuts, a sushi program, and one of the north-metro's most consistent special-occasion rooms.",dishes:["Bone-In Ribeye","Sushi Platter","Crab Cake","Wedge Salad"],address:"16915 Birkdale Commons Pkwy, Huntersville NC 28078",lat:35.4322,lng:-80.8718,website:"",instagram:"@thepostershouse",res_tier:4,hours:"Dinner daily",group:"Rare Roots Hospitality",suburb:true},

  // ============ INDIGO ROAD HOSPITALITY ============
  {...base,id:nextId++,name:"Mizu",cuisine:"Japanese / Modern Asian",neighborhood:"SouthPark",score:86,price:4,tags:["Japanese","Sushi","Asian","Date Night","Critics Pick","Cocktails"],indicators:[],hh:"",reservation:"OpenTable",awards:"Indigo Road Hospitality concept",description:"Indigo Road Hospitality's modern-Asian concept in Phillips Place — robata-grilled skewers, a sushi-bar omakase option, and one of the more polished pan-Asian rooms in SouthPark.",dishes:["Sushi Bar Omakase","Robata Skewers","Wagyu Nigiri","Sake Flight"],address:"6809 Phillips Place Ct, Charlotte NC 28210",lat:35.1497,lng:-80.8324,website:"https://www.mizucharlotte.com",instagram:"@mizu.clt",res_tier:4,hours:"Dinner daily",group:"Indigo Road Hospitality"},
  {...base,id:nextId++,name:"Oak Steakhouse",cuisine:"Steakhouse",neighborhood:"Uptown",score:88,price:4,tags:["Steakhouse","Date Night","Critics Pick","Cocktails","Scene","Uptown"],indicators:[],hh:"",reservation:"OpenTable",awards:"Indigo Road Hospitality concept",description:"The Charleston-born Indigo Road steakhouse on North Tryon — wood-grilled prime cuts, a serious raw bar, and one of Uptown's most consistent business-dinner rooms.",dishes:["Bone-In Ribeye","Wood-Grilled Filet","Oysters Rockefeller","Hash Brown Cake"],address:"100 N Tryon St, Charlotte NC 28202",lat:35.2272,lng:-80.8425,website:"https://www.oaksteakhouserestaurant.com",instagram:"@oaksteakhouse",res_tier:4,hours:"Dinner daily",group:"Indigo Road Hospitality"},

  // ============ XENIA HOSPITALITY GROUP ============
  {...base,id:nextId++,name:"Ilios Noche",cuisine:"Mediterranean",neighborhood:"Ballantyne",score:84,price:3,tags:["Mediterranean","Date Night","Local Favorites","Patio","Family Friendly"],indicators:[],hh:"",reservation:"OpenTable",awards:"Xenia Hospitality concept",description:"Xenia Hospitality's Mediterranean restaurant on Providence Road in Ballantyne — a Greek-leaning seasonal menu, a wood-fired program, and one of the more polished date-night rooms in south Charlotte.",dishes:["Wood-Fired Whole Fish","Lamb Chops","Mezze Spread","Saganaki"],address:"11508 Providence Rd, Charlotte NC 28277",lat:35.0489,lng:-80.7929,website:"https://www.iliosnoche.com",instagram:"@iliosnoche",res_tier:4,hours:"Dinner daily",group:"Xenia Hospitality"},
  {...base,id:nextId++,name:"Ilios Crafted Greek — South End",cuisine:"Greek / Mediterranean",neighborhood:"South End",score:81,price:2,tags:["Greek","Mediterranean","Casual","Healthy","Family Friendly"],indicators:[],hh:"",reservation:"walk-in",awards:"Xenia Hospitality concept",description:"Xenia Hospitality's fast-casual Greek concept on South Church Street — gyros, build-your-own bowls, and a tight Mediterranean lunch model that has expanded across the metro.",dishes:["Gyro Wrap","Greek Bowl","Spanakopita","Baklava"],address:"1514 S Church St, Charlotte NC 28203",lat:35.2120,lng:-80.8552,website:"https://www.iliosgreek.com",instagram:"@iliosgreek",hours:"Lunch + Dinner daily",group:"Xenia Hospitality"},

  // ============ FS FOOD GROUP (FRANK SCIBELLI) ============
  {...base,id:nextId++,name:"Paco's Tacos and Tequila",cuisine:"Mexican / Tex-Mex",neighborhood:"SouthPark",score:84,price:2,tags:["Mexican","Tex-Mex","Casual","Family Friendly","Patio","Cocktails"],indicators:[],hh:"",reservation:"walk-in",awards:"FS Food Group (Frank Scibelli) concept",description:"Frank Scibelli's Mexican-tequila restaurant in SouthPark — a Tex-Mex-leaning menu, a long agave list, and one of the better casual patios in the SouthPark restaurant strip.",dishes:["Tableside Guacamole","Brisket Tacos","Margarita","Tres Leches"],address:"6401 Morrison Blvd Ste 9b, Charlotte NC 28211",lat:35.1525,lng:-80.8198,website:"https://pacostacosandtequila.com",instagram:"@pacostacosandtequila",hours:"Lunch + Dinner daily",group:"FS Food Group"},

  // ============ MAC'S HOSPITALITY GROUP ============
  {...base,id:nextId++,name:"SouthBound",cuisine:"Southern / Country",neighborhood:"South End",score:82,price:2,tags:["Southern","Country","Patio","Casual","Live Music","Local Favorites"],indicators:[],hh:"",reservation:"walk-in",awards:"Mac's Hospitality Group concept",description:"Mac's Hospitality Group's Southern restaurant and music venue on South Boulevard — country fare, a sprawling outdoor patio, and an attached live-music yard.",dishes:["Smoked Wings","Country Plate","Smash Burger","Bourbon Cocktails"],address:"2433 South Blvd, Charlotte NC 28203",lat:35.2017,lng:-80.8662,website:"",instagram:"@southboundclt",hours:"Lunch + Dinner daily",group:"Mac's Hospitality Group"},

  // ============ MOFFETT RESTAURANT GROUP (CHEF BRUCE MOFFETT) ============
  {...base,id:nextId++,name:"NC RED",cuisine:"Modern Southern",neighborhood:"Huntersville",score:85,price:3,tags:["Southern","New American","Date Night","Critics Pick","Cocktails","Suburb"],indicators:[],hh:"",reservation:"OpenTable",awards:"Moffett Restaurant Group (Chef Bruce Moffett) concept",description:"Chef Bruce Moffett's modern-Southern restaurant at Birkdale Village in Huntersville — a polished take on North Carolina ingredients, a strong cocktail program, and one of the north-metro's best new dining rooms.",dishes:["NC Trout","Wood-Fired Vegetables","Country Ham Plate","Bourbon Cocktails"],address:"16915 Birkdale Commons Pkwy, Huntersville NC 28078",lat:35.4322,lng:-80.8718,website:"https://ncredrestaurant.com",instagram:"@ncredrestaurant",hours:"Dinner Tue-Sun",group:"Moffett Restaurant Group",suburb:true},

  // ============ BUILT ON HOSPITALITY ============
  {...base,id:nextId++,name:"Old Town Kitchen & Cocktails",cuisine:"American",neighborhood:"Mooresville",score:84,price:3,tags:["American","Date Night","Cocktails","Patio","Local Favorites","Suburb"],indicators:[],hh:"",reservation:"OpenTable",awards:"Built on Hospitality concept",description:"Built on Hospitality's American restaurant in downtown Mooresville — a wood-fired menu, a long bar, and one of the better date-night rooms in the Lake Norman corridor.",dishes:["Wood-Fired Steak","Seasonal Pasta","Signature Cocktails","Whole Fish"],address:"130 N Main St, Mooresville NC 28115",lat:35.5843,lng:-80.8101,website:"",instagram:"@oldtownkitchen",hours:"Dinner Tue-Sun, Brunch Sat-Sun",group:"Built on Hospitality",suburb:true},
  {...base,id:nextId++,name:"Chief's",cuisine:"Coastal / Seafood",neighborhood:"Cornelius",score:84,price:3,tags:["Seafood","Coastal","Date Night","Patio","Local Favorites","Suburb"],indicators:[],hh:"",reservation:"OpenTable",awards:"Built on Hospitality concept",description:"Built on Hospitality's coastal seafood restaurant on Lake Norman — a New England-leaning menu, a serious raw bar, and one of the rare true coastal-style dining rooms in the Carolinas Piedmont.",dishes:["Lobster Roll","Oyster Selection","Whole Fish","Coastal Cocktails"],address:"19400 Jetton Rd Ste 100, Cornelius NC 28031",lat:35.4549,lng:-80.8816,website:"",instagram:"@chiefsclt",hours:"Dinner daily, Brunch Sat-Sun",group:"Built on Hospitality",suburb:true},

  // ============ 1957 HOSPITALITY GROUP ============
  {...base,id:nextId++,name:"Rosemont",cuisine:"Mediterranean",neighborhood:"Plaza Midwood",score:84,price:3,tags:["Mediterranean","Date Night","Patio","Critics Pick","Cocktails"],indicators:[],hh:"",reservation:"Resy",awards:"1957 Hospitality Group concept",description:"1957 Hospitality's Mediterranean restaurant on Central Avenue in Plaza Midwood — a wood-fired program, a thoughtful natural-leaning wine list, and a quieter patio than the Central Ave norm.",dishes:["Wood-Fired Lamb","Mezze Plate","Whole Fish","Mediterranean Cocktails"],address:"1721 Central Ave, Charlotte NC 28205",lat:35.2197,lng:-80.8155,website:"",instagram:"@rosemontclt",hours:"Dinner Tue-Sun",group:"1957 Hospitality Group"},

  // ============ RAYDAL HOSPITALITY GROUP ============
  {...base,id:nextId++,name:"Three Amigos",cuisine:"Mexican",neighborhood:"Concord",score:81,price:2,tags:["Mexican","Casual","Family Friendly","Local Favorites","Suburb","Group Friendly"],indicators:[],hh:"",reservation:"walk-in",awards:"Raydal Hospitality Group concept",description:"Raydal Hospitality's longstanding Mexican restaurant in Concord — a deep tequila program, fajita-and-margarita combos, and one of the longest-running family Mexican rooms in the north-metro corridor.",dishes:["Sizzling Fajitas","House Margarita","Three Amigos Platter","Tres Leches"],address:"1721 Concord Pkwy N, Concord NC 28025",lat:35.4153,lng:-80.6189,website:"https://3amigosrestaurant.com",instagram:"@3amigosrestaurant",hours:"Lunch + Dinner daily",group:"Raydal Hospitality",suburb:true},
];

const existingNames = new Set(data.map(r => (r.name || '').toLowerCase()));
const added = newRestaurants.filter(r => !existingNames.has(r.name.toLowerCase()));
const skipped = newRestaurants.length - added.length;
data.push(...added);

console.log(`Charlotte: was ${data.length - added.length}, added ${added.length}, skipped ${skipped} duplicate`);
const serialized = JSON.stringify(data);
html = html.slice(0, sliceStart) + serialized + html.slice(sliceEnd);
fs.writeFileSync('index.html', html);
console.log('Total Charlotte entries:', data.length);
