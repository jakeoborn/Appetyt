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
const maxId = Math.max(...arr.map(r=>r.id));
console.log('Starting:', arr.length, 'restaurants, max ID:', maxId);

// =====================================================
// 1. ADD MISSING HOSPITALITY GROUP RESTAURANTS + MORE ROOFTOPS
// =====================================================
let nextId = maxId + 1;
const newSpots = [
  // Missing hospitality group restaurants
  {id:nextId++,name:"The Pool",phone:"(212) 375-9002",cuisine:"Seafood",neighborhood:"Midtown East",score:91,price:3,tags:["Fine Dining","Date Night","Celebrations","Cocktails","Seafood"],indicators:[],hh:"",reservation:"Resy",awards:"",description:"Major Food Group's stunning seafood restaurant in the iconic Seagram Building, with a centerpiece pool, seasonal fish, and one of NYC's most glamorous rooms",dishes:["Dover Sole","Lobster","Seasonal Fish"],address:"99 E 52nd St, New York, NY 10022",hours:"Mon-Sat 5:00PM-10:30PM",lat:40.7586,lng:-73.9718,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"Major Food Group",instagram:"thepoolny",website:"https://www.thepoolnewyork.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Quality Italian",phone:"(212) 390-1111",cuisine:"Italian",neighborhood:"Midtown West",score:85,price:3,tags:["Date Night","Cocktails","Celebrations","Italian","Steakhouse"],indicators:[],hh:"",reservation:"OpenTable",awards:"",description:"Quality Branded's theatrical Midtown Italian with giant chicken parm, shareable plates, and a lively scene near Columbus Circle",dishes:["Chicken Parm for Two","Quality Burger","Meatball"],address:"57 W 57th St, New York, NY 10019",hours:"Mon-Sun 11:30AM-11:00PM",lat:40.7646,lng:-73.9754,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"Quality Branded",instagram:"qualityitalian",website:"https://www.qualityitalian.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},

  // MORE ROOFTOP BARS (to get from 35 to 50+)
  {id:nextId++,name:"Zona de Cuba",phone:"(212) 966-6992",cuisine:"Rooftop Bar",neighborhood:"SoHo",score:82,price:2,tags:["Rooftop","Cocktails","Late Night","Patio","Live Music"],indicators:[],hh:"",reservation:"walk-in",awards:"Eater Best Rooftop",description:"Cuban-themed SoHo rooftop with live Latin music, salsa dancing, mojitos, and a vibrant tropical atmosphere",dishes:["Mojitos","Cuban Sandwiches","Salsa Dancing"],address:"140 Sullivan St, New York, NY 10012",hours:"Mon-Sun 4:00PM-2:00AM",lat:40.7269,lng:-74.0005,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"zonadecuba",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"The Heights Bar & Grill",phone:"(212) 866-7035",cuisine:"Rooftop Bar",neighborhood:"Morningside Heights",score:80,price:1,tags:["Rooftop","Casual","Local Favorites","Patio","Happy Hour","Sports"],indicators:[],hh:"4-7 PM weekdays",reservation:"walk-in",awards:"Eater Best Rooftop",description:"Casual Morningside Heights rooftop with Manhattan views, cheap drinks, a sports bar vibe, and Columbia University crowds",dishes:["Burgers","Wings","Draft Beer"],address:"2867 Broadway, New York, NY 10025",hours:"Mon-Sun 11:00AM-1:00AM",lat:40.8046,lng:-73.9674,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"theheightsbar",website:"https://www.theheightsbarandgrill.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:2},
  {id:nextId++,name:"Cantina Rooftop",phone:"(212) 957-1700",cuisine:"Rooftop Bar",neighborhood:"Hell's Kitchen",score:81,price:2,tags:["Rooftop","Cocktails","Patio","Mexican","Happy Hour"],indicators:[],hh:"4-7 PM daily",reservation:"walk-in",awards:"",description:"Hell's Kitchen rooftop Mexican with frozen margaritas, tacos, and Times Square-adjacent skyline views",dishes:["Frozen Margaritas","Tacos","Guacamole"],address:"605 W 48th St, New York, NY 10036",hours:"Mon-Sun 12:00PM-12:00AM",lat:40.7634,lng:-73.9939,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"cantinarooftop",website:"https://www.cantinarooftop.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Rooftop Reds",phone:"(917) 261-8282",cuisine:"Rooftop Bar",neighborhood:"Brooklyn Navy Yard",score:82,price:2,tags:["Rooftop","Cocktails","Patio","Date Night","Dog Friendly"],indicators:["pet-friendly"],hh:"",reservation:"walk-in",awards:"",description:"Only rooftop vineyard in NYC — a working winery on the Brooklyn Navy Yard roof with wine tastings, skyline views, and seasonal events",dishes:["Wine Tastings","Cheese Plates","Seasonal Events"],address:"Brooklyn Navy Yard, Building 275, Brooklyn, NY 11205",hours:"Thu-Sun 12:00PM-9:00PM (seasonal)",lat:40.7001,lng:-73.9716,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"rooftopreds",website:"https://www.rooftopreds.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Mr. Purple",phone:"(212) 237-1790",cuisine:"Rooftop Bar",neighborhood:"Lower East Side",score:82,price:2,tags:["Rooftop","Cocktails","Late Night","Date Night","Patio"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Rooftop bar and pool at Hotel Indigo LES with downtown skyline views, DJ sets, and a hip LES crowd",dishes:["Cocktails","Small Plates","Pool"],address:"180 Orchard St, New York, NY 10002",hours:"Mon-Sun 4:00PM-2:00AM",lat:40.7207,lng:-73.9882,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"mrpurplenyc",website:"https://www.mrpurplenyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Refinery Rooftop",phone:"(646) 664-0372",cuisine:"Rooftop Bar",neighborhood:"Midtown",score:81,price:2,tags:["Rooftop","Cocktails","Patio","Date Night"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Retractable glass-roofed bar atop the Refinery Hotel in the Garment District with Empire State views and year-round cocktails",dishes:["Cocktails","Wine","Bar Menu"],address:"63 W 38th St, New York, NY 10018",hours:"Mon-Sun 4:00PM-1:00AM",lat:40.7520,lng:-73.9860,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"refineryrooftop",website:"https://www.refineryrooftop.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Roof at Park South",phone:"(212) 204-5222",cuisine:"Rooftop Bar",neighborhood:"NoMad",score:82,price:2,tags:["Rooftop","Cocktails","Date Night","Patio"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Intimate NoMad rooftop with string lights, greenery, and craft cocktails at the Park South Hotel",dishes:["Craft Cocktails","Small Plates"],address:"125 E 27th St, New York, NY 10016",hours:"Mon-Sun 4:00PM-12:00AM",lat:40.7423,lng:-73.9837,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"roofparksouth",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Azul on the Rooftop",phone:"(212) 461-2023",cuisine:"Rooftop Bar",neighborhood:"Midtown",score:81,price:2,tags:["Rooftop","Cocktails","Patio","Mexican"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Colorful Midtown Mexican rooftop at the Hotel Hugo with frozen margaritas, Mexican street food, and a festive party atmosphere",dishes:["Margaritas","Street Tacos","Guacamole"],address:"525 Greenwich St, New York, NY 10013",hours:"Mon-Sun 12:00PM-12:00AM",lat:40.7264,lng:-74.0079,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"azulrooftop",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"The Roof at PUBLIC",phone:"(212) 735-6000",cuisine:"Rooftop Bar",neighborhood:"Lower East Side",score:83,price:2,tags:["Rooftop","Cocktails","Date Night","Patio","Exclusive"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Ian Schrager's rooftop at the PUBLIC hotel on the LES with panoramic views, a hip crowd, and DJ sets on weekends",dishes:["Craft Cocktails","Small Plates","DJ Sets"],address:"215 Chrystie St, New York, NY 10002",hours:"Mon-Sun 4:00PM-1:00AM",lat:40.7220,lng:-73.9928,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"publichotels",website:"https://www.publichotels.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Vida Verde",phone:"(212) 461-4088",cuisine:"Rooftop Bar",neighborhood:"NoMad",score:81,price:2,tags:["Rooftop","Cocktails","Patio","Mexican","Happy Hour"],indicators:[],hh:"4-6 PM weekdays",reservation:"walk-in",awards:"",description:"Mexican rooftop bar in NoMad with mezcal cocktails, tacos al pastor, and a lively after-work crowd",dishes:["Mezcal Cocktails","Tacos","Elote"],address:"4 W 31st St, New York, NY 10001",hours:"Mon-Sun 12:00PM-12:00AM",lat:40.7468,lng:-73.9880,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"vidaverdenyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Salon de Ning",phone:"(212) 956-2888",cuisine:"Rooftop Bar",neighborhood:"Midtown",score:83,price:2,tags:["Rooftop","Cocktails","Date Night","Exclusive","Hotel"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"Sophisticated rooftop terrace at The Peninsula hotel with two outdoor terraces, panoramic 5th Ave views, and refined Asian-inspired cocktails",dishes:["Craft Cocktails","Champagne","Small Plates"],address:"700 5th Ave, New York, NY 10019",hours:"Mon-Sun 5:00PM-1:00AM",lat:40.7614,lng:-73.9754,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"thepeninsulanyk",website:"https://www.peninsula.com/en/new-york/hotel-fine-dining/salon-de-ning",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Castell Rooftop Lounge",phone:"(212) 380-1307",cuisine:"Rooftop Bar",neighborhood:"Midtown",score:81,price:2,tags:["Rooftop","Cocktails","Patio","Late Night"],indicators:[],hh:"",reservation:"walk-in",awards:"",description:"AC Hotel rooftop near Times Square with retractable glass roof, year-round service, and a European lounge vibe",dishes:["Cocktails","Wine","Tapas"],address:"260 W 40th St, New York, NY 10018",hours:"Mon-Sun 4:00PM-1:00AM",lat:40.7564,lng:-73.9900,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",instagram:"castellrooftop",website:"https://www.castellrooftop.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
];

const existingNames = new Set(arr.map(r=>r.name.toLowerCase()));
let addedCount = 0;
for(const spot of newSpots) {
  if(!existingNames.has(spot.name.toLowerCase())) {
    arr.push(spot);
    existingNames.add(spot.name.toLowerCase());
    addedCount++;
  } else {
    console.log('SKIP:', spot.name);
  }
}
console.log('Added', addedCount, 'new spots');

// =====================================================
// 2. MASS TAG UPDATE — Fix underpopulated tags
// =====================================================
let tagFixes = 0;

for(const r of arr) {
  const tags = r.tags || [];
  const name = r.name.toLowerCase();
  const cuisine = (r.cuisine||'').toLowerCase();
  const desc = (r.description||'').toLowerCase();
  const addTag = (tag) => { if(!tags.includes(tag)) { tags.push(tag); tagFixes++; } };

  // ROOFTOP — add to any spot with 'rooftop' in name/description
  if((name.includes('rooftop') || desc.includes('rooftop') || desc.includes('roof')) && !tags.includes('Rooftop')) addTag('Rooftop');

  // HOTEL — add to hotel bars and restaurants inside hotels
  if(desc.includes('hotel') && (desc.includes('bar') || desc.includes('lobby') || desc.includes('lounge') || desc.includes('rooftop'))) addTag('Hotel');

  // SPORTS — add to sports bars and venues
  if(desc.includes('sports bar') || desc.includes('game day') || name.includes('sports')) addTag('Sports');

  // HAPPY HOUR — add to spots that mention HH or have hh field
  if(r.hh && r.hh.length > 0) addTag('Happy Hour');

  // DOG FRIENDLY — add based on description or patio spots
  if(desc.includes('dog-friendly') || desc.includes('dog friendly') || desc.includes('dog run') || desc.includes('pet-friendly')) addTag('Dog Friendly');

  // SUSHI — add to Japanese/sushi spots
  if(cuisine.includes('sushi') || (cuisine.includes('japanese') && (desc.includes('sushi') || desc.includes('omakase') || desc.includes('nigiri')))) addTag('Sushi');

  // BBQ — add to BBQ spots
  if(cuisine.includes('bbq') || desc.includes('barbecue') || desc.includes('bbq') || desc.includes('brisket') || desc.includes('smoked')) addTag('BBQ');

  // STEAKHOUSE — add to steakhouse spots
  if(cuisine.includes('steakhouse') || desc.includes('steakhouse') || desc.includes('prime cuts') || desc.includes('dry-aged')) addTag('Steakhouse');

  // ITALIAN — add to Italian spots
  if(cuisine.includes('italian') && !cuisine.includes('asian')) addTag('Italian');

  // MEXICAN — add to Mexican spots
  if(cuisine.includes('mexican') || cuisine.includes('tex-mex') || desc.includes('tacos') || desc.includes('margarita')) addTag('Mexican');

  // FAMILY FRIENDLY — add to appropriate casual spots
  if(desc.includes('family') || desc.includes('kid') || desc.includes('children') || desc.includes('playground')) addTag('Family Friendly');

  // PATIO — add to outdoor spots
  if(desc.includes('patio') || desc.includes('outdoor') || desc.includes('garden') || desc.includes('backyard') || desc.includes('sidewalk')) addTag('Patio');

  r.tags = tags;
}
console.log('Applied', tagFixes, 'tag additions');

// =====================================================
// 3. MASS INDICATOR UPDATE — Fix underpopulated indicators
// =====================================================
let indFixes = 0;

for(const r of arr) {
  const inds = r.indicators || [];
  const desc = (r.description||'').toLowerCase();
  const name = r.name.toLowerCase();
  const tags = r.tags || [];
  const addInd = (ind) => { if(!inds.includes(ind)) { inds.push(ind); indFixes++; } };

  // HOLE-IN-THE-WALL
  if(tags.includes('Hole in the Wall') && !inds.includes('hole-in-the-wall')) addInd('hole-in-the-wall');
  if(desc.includes('tiny') || desc.includes('no-frills') || desc.includes('hole-in-the-wall') || desc.includes('counter-service') || desc.includes('cash only')) addInd('hole-in-the-wall');

  // DIVE-BAR
  if(desc.includes('dive bar') || desc.includes('dive') || desc.includes('grimy') || desc.includes('cheap drinks') || desc.includes('cheap beer')) addInd('dive-bar');

  // VEGETARIAN
  if(desc.includes('vegan') || desc.includes('plant-based') || desc.includes('vegetarian') || desc.includes('all-vegan')) addInd('vegetarian');

  // OUTDOOR-SEATING (patio/rooftop/garden)
  if(tags.includes('Patio') || tags.includes('Rooftop') || desc.includes('patio') || desc.includes('garden') || desc.includes('outdoor') || desc.includes('terrace') || desc.includes('backyard')) addInd('outdoor-seating');

  // PET-FRIENDLY
  if(tags.includes('Dog Friendly') || desc.includes('dog-friendly') || desc.includes('dog friendly') || desc.includes('pet-friendly')) addInd('pet-friendly');

  // LATE-NIGHT (open past midnight)
  if(r.hours && (r.hours.includes('2:00AM') || r.hours.includes('3:00AM') || r.hours.includes('4:00AM') || r.hours.includes('5:00AM') || r.hours.includes('6:00AM') || r.hours.includes('24 hours'))) addInd('late-night');

  // WOMEN-OWNED
  if(desc.includes('her ') && desc.includes('restaurant') || desc.includes('she ') || desc.includes('women-owned')) {
    // Only add if clearly woman-led based on description
  }

  r.indicators = inds;
}
console.log('Applied', indFixes, 'indicator additions');

// =====================================================
// 4. SET GROUP FIELD for hospitality group restaurants
// =====================================================
const groupMap = {
  'Carbone': 'Major Food Group',
  'Torrisi': 'Major Food Group',
  'The Grill': 'Major Food Group',
  'The Pool': 'Major Food Group',
  'Santina': 'Major Food Group',
  'Bad Roman': 'Major Food Group',
  "Sadelle's": 'Major Food Group',
  'Gramercy Tavern': 'Union Square Hospitality (Danny Meyer)',
  'The Modern': 'Union Square Hospitality (Danny Meyer)',
  'Manhatta': 'Union Square Hospitality (Danny Meyer)',
  'Ci Siamo': 'Union Square Hospitality (Danny Meyer)',
  'Balthazar': 'Keith McNally',
  'Pastis': 'Keith McNally',
  'Minetta Tavern': 'Keith McNally',
  'Morandi': 'Keith McNally',
  'Le Rock': 'Keith McNally',
  'Dhamaka': 'Unapologetic Foods',
  'Semma': 'Unapologetic Foods',
  'Adda': 'Unapologetic Foods',
  'Via Carota': 'Rita Sodi & Jody Williams',
  'I Sodi': 'Rita Sodi & Jody Williams',
  'Buvette': 'Rita Sodi & Jody Williams',
  'Bar Pisellino': 'Rita Sodi & Jody Williams',
  'Momofuku Noodle Bar': 'Momofuku (David Chang)',
  'Momofuku Ssäm Bar': 'Momofuku (David Chang)',
  'Kabawa': 'Momofuku (David Chang)',
  'Bar Kabawa': 'Momofuku (David Chang)',
  'Locanda Verde': 'NoHo Hospitality (Andrew Carmellini)',
  'The Dutch': 'NoHo Hospitality (Andrew Carmellini)',
  'Café Carmellini': 'NoHo Hospitality (Andrew Carmellini)',
  'Don Angie': 'Quality Branded',
  'Quality Meats': 'Quality Branded',
  'Quality Italian': 'Quality Branded',
  'Tao Downtown': 'Tao Group Hospitality',
  'Lavo Italian Restaurant': 'Tao Group Hospitality',
  'Marquee New York': 'Tao Group Hospitality',
  'Beauty & Essex': 'Tao Group Hospitality',
  'Catch': 'Tao Group Hospitality',
  'Marquee Skydeck at Edge': 'Tao Group Hospitality',
  'Le Coucou': 'Stephen Starr',
  'Buddakan': 'Stephen Starr',
  'Estela': 'Ignacio Mattos',
  'Jean-Georges': 'Jean-Georges Vongerichten',
  'ABCV': 'Jean-Georges Vongerichten',
  'ABC Kitchen': 'Jean-Georges Vongerichten',
  'Lilia': 'Missy Robbins',
  'Misi': 'Missy Robbins',
  'COTE Korean Steakhouse': 'Simon Kim (COTE)',
  'Atoboy': 'Simon Kim (COTE)',
  'Atomix': 'Ellia & Junghyun Park (Atomix)',
  'Hometown Bar-B-Que': 'Billy Durney',
  'Red Hook Tavern': 'Billy Durney',
  'Frenchette': 'Frenchette (Lee Hanson & Riad Nasr)',
  "Le Veau d'Or": 'Frenchette (Lee Hanson & Riad Nasr)',
  'Olmsted': 'Olmsted Hospitality (Greg Baxtrom)',
  'Sailor': 'Gabriel Stulman',
};

let groupFixes = 0;
for(const r of arr) {
  if(groupMap[r.name] && r.group !== groupMap[r.name]) {
    r.group = groupMap[r.name];
    groupFixes++;
  }
}
console.log('Set group field on', groupFixes, 'restaurants');

// =====================================================
// WRITE
// =====================================================
html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Final stats
const finalTagCounts = {};
arr.forEach(r=>(r.tags||[]).forEach(t=>{finalTagCounts[t]=(finalTagCounts[t]||0)+1;}));
const finalIndCounts = {};
arr.forEach(r=>(r.indicators||[]).forEach(i=>{finalIndCounts[i]=(finalIndCounts[i]||0)+1;}));

console.log('\n=== FINAL TAG COUNTS ===');
Object.entries(finalTagCounts).sort((a,b)=>b[1]-a[1]).forEach(([t,c])=>console.log(t+':', c));
console.log('\n=== FINAL INDICATOR COUNTS ===');
Object.entries(finalIndCounts).sort((a,b)=>b[1]-a[1]).forEach(([i,c])=>console.log(i+':', c));
console.log('\nFinal restaurant count:', arr.length);
console.log('Done!');
