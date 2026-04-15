// Add enriched HOSPITALITY_GROUPS for Austin, Houston, Chicago, SLC
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find the end of HOSPITALITY_GROUPS object
const hgIdx = html.indexOf('HOSPITALITY_GROUPS');
// Find the closing };
let braceCount = 0, hgEnd = hgIdx, started = false;
for (let i = hgIdx; i < html.length; i++) {
  if (html[i] === '{') { braceCount++; started = true; }
  if (html[i] === '}') { braceCount--; if (started && braceCount === 0) { hgEnd = i; break; } }
}

// Check what's already there
const existingBlock = html.substring(hgIdx, hgEnd);
console.log('Existing HOSPITALITY_GROUPS ends at:', hgEnd);

// Add new groups before the closing }
const newGroups = `
    // === AUSTIN GROUPS ===
    'Hai Hospitality':{
      score:93,
      founded:2003,
      concepts:8,
      flagship:'Uchi Austin',
      michelinCount:1,
      description:'Tyson Cole\\'s James Beard Award-winning restaurant group. Uchi put Austin on the national dining map and spawned Uchiko, Loro (with Aaron Franklin), and expansion to Houston, Dallas, Denver, and soon SLC.',
      strengths:'Creative Japanese cuisine, consistency across locations, iconic branding',
      weakness:'Expansion dilutes exclusivity -- some newer locations feel less special',
      restaurants:['Uchi Austin','Uchiko','Loro','Uchi Houston','Uchi Dallas','Uchi Denver'],
      scoreBreakdown:{foodQuality:96,service:92,ambiance:90,value:85,consistency:90,innovation:97},
      website:'https://www.uchirestaurants.com',
      instagram:'uchirestaurants'},
    'Tatsu-Ya':{
      score:90,
      founded:2012,
      concepts:5,
      flagship:'Ramen Tatsu-Ya',
      michelinCount:0,
      description:'Tatsu Aikawa\\'s Austin ramen empire. Started with Ramen Tatsu-Ya and expanded to DipDipDip (hot pot), Kemuri (izakaya), Tiki (tropical), and Chubby Spice (Indian). Every concept is different but connected by Japanese DNA.',
      strengths:'Bold flavors, creative concepts, cult following, excellent broth',
      weakness:'Long waits, no reservations at most locations',
      restaurants:['Ramen Tatsu-Ya','Kemuri Tatsu-Ya','DipDipDip Tatsu-Ya','Tiki Tatsu-Ya'],
      scoreBreakdown:{foodQuality:92,service:82,ambiance:86,value:88,consistency:88,innovation:94},
      website:'https://www.ramen-tatsuya.com',
      instagram:'raboratory'},
    'McGuire Moorman Lambert':{
      score:89,
      founded:2009,
      concepts:8,
      flagship:'Jeffrey\\'s',
      michelinCount:0,
      description:'Larry McGuire, Tom Moorman, and Liz Lambert\\'s group behind some of Austin\\'s most beloved restaurants and hotels. Jeffrey\\'s, Clark\\'s, Perla\\'s, Josephine House, Elizabeth Street Cafe, and hotel properties.',
      strengths:'Gorgeous design, neighborhood feel, consistent quality, hospitality',
      weakness:'Premium pricing, hard to get reservations at peak times',
      restaurants:['Jeffrey\\'s','Perla\\'s','Clark\\'s Oyster Bar','Josephine House','Elizabeth Street Cafe','June\\'s All Day'],
      scoreBreakdown:{foodQuality:90,service:90,ambiance:94,value:80,consistency:88,innovation:85},
      website:'',
      instagram:''},
    // === HOUSTON GROUPS ===
    'Underbelly Hospitality':{
      score:91,
      founded:2012,
      concepts:9,
      flagship:'Georgia James',
      michelinCount:0,
      description:'Chris Shepherd\\'s Houston empire celebrating the city\\'s diversity. James Beard Award winner. Georgia James (steakhouse), Wild Oats (Gulf Coast), Pastore (Italian), and multiple other concepts.',
      strengths:'Celebrates Houston\\'s diverse food culture, chef-driven, community-focused',
      weakness:'Shepherd\\'s attention spread across many concepts',
      restaurants:['Georgia James','Wild Oats','Pastore','Underbelly Burger','Comalito','GJ Tavern'],
      scoreBreakdown:{foodQuality:93,service:88,ambiance:86,value:85,consistency:86,innovation:94},
      website:'https://www.underbellyhospitality.com',
      instagram:'underbellyhospitality'},
    'Berg Hospitality':{
      score:88,
      founded:2006,
      concepts:9,
      flagship:'B&B Butchers & Restaurant',
      michelinCount:0,
      description:'Benjamin Berg\\'s Houston group spanning steakhouses, Italian, Cuban, and cafes. B&B Butchers is the flagship with dry-aged beef and a rooftop bar.',
      strengths:'Polished execution, strong steak program, broad range of concepts',
      weakness:'More corporate feel than chef-driven groups',
      restaurants:['B&B Butchers & Restaurant','Turner\\'s','Trattoria Sofia','The Annie Cafe','B.B. Lemon','NoPo Cafe'],
      scoreBreakdown:{foodQuality:88,service:90,ambiance:88,value:82,consistency:88,innovation:78},
      website:'https://www.berghospitality.com',
      instagram:'berghospitality'},
    'H Town Restaurant Group':{
      score:92,
      founded:1993,
      concepts:6,
      flagship:'Hugo\\'s',
      michelinCount:0,
      description:'Chef Hugo Ortega and Tracy Vaught\\'s Houston restaurant empire. Hugo\\'s (regional Mexican), Xochi (Oaxacan), Caracol (coastal Mexican), and Backstreet Cafe. James Beard nominated multiple times.',
      strengths:'Deeply authentic Mexican regional cuisine, James Beard-level quality, Ortega\\'s mastery',
      weakness:'Premium pricing for Mexican food -- some diners expect lower prices',
      restaurants:['Hugo\\'s','Xochi','Caracol','Backstreet Cafe','Urbe'],
      scoreBreakdown:{foodQuality:95,service:90,ambiance:88,value:82,consistency:90,innovation:92},
      website:'',
      instagram:'hugosrestaurant'},
    'Goodnight Hospitality':{
      score:91,
      founded:2018,
      concepts:4,
      flagship:'March',
      michelinCount:0,
      description:'Felipe Riccio and Grant Cooper\\'s Montrose-based group. March (seasonal Italian) and Rosie Cannonball (Italian-American) are both among Houston\\'s best restaurants. Montrose Cheese & Wine rounds out the portfolio.',
      strengths:'Exceptional Italian food, Montrose neighborhood appeal, intimate spaces',
      weakness:'Small group, limited availability',
      restaurants:['March','Rosie Cannonball','The Marigold Club','Montrose Cheese & Wine'],
      scoreBreakdown:{foodQuality:94,service:90,ambiance:92,value:84,consistency:90,innovation:88},
      website:'https://www.goodnighthospitality.com',
      instagram:'goodnighthospitality'},
    'Pappas Restaurants':{
      score:86,
      founded:1967,
      concepts:10,
      flagship:'Pappas Bros. Steakhouse',
      michelinCount:0,
      description:'The Pappas family\\'s Houston restaurant empire since 1967. From Pappadeaux (Cajun seafood) to Pappas Bros. Steakhouse. Massive scale across Texas with consistent quality.',
      strengths:'Scale, consistency, value for quality, family legacy',
      weakness:'Corporate feel, not chef-driven',
      restaurants:['Pappas Bros. Steakhouse','Pappadeaux Seafood Kitchen','Pappasito\\'s Cantina','Pappas Burger'],
      scoreBreakdown:{foodQuality:84,service:86,ambiance:82,value:90,consistency:92,innovation:68},
      website:'https://www.pappas.com',
      instagram:'pappasrestaurants'},
    // === CHICAGO GROUPS ===
    'Lettuce Entertain You':{
      score:87,
      founded:1971,
      concepts:60,
      flagship:'RPM Italian',
      michelinCount:0,
      description:'Rich Melman\\'s legendary Chicago restaurant empire with 60+ concepts. RPM Italian, RPM Steak, Shaw\\'s Crab House, Summer House, Aba, and many more. The most influential restaurant group in Chicago\\'s history.',
      strengths:'Incredible range, polished service model, scalable concepts, reliable quality',
      weakness:'Volume means some concepts feel formulaic -- very corporate approach',
      restaurants:['RPM Italian','RPM Steak','Shaw\\'s Crab House','Aba','Beatrix','Summer House','Cafe Ba-Ba-Reeba!','Ema'],
      scoreBreakdown:{foodQuality:86,service:90,ambiance:88,value:84,consistency:92,innovation:80},
      website:'https://www.lettuce.com',
      instagram:'lettuceentertainyou'},
    'Boka Restaurant Group':{
      score:90,
      founded:2003,
      concepts:15,
      flagship:'Girl & the Goat',
      michelinCount:2,
      description:'Kevin Boehm and Rob Katz group that propelled Top Chef winners to restaurant stardom. Girl & the Goat (Stephanie Izard), Boka (Michelin star), Momotaro, Swift & Sons. The most chef-forward group in Chicago.',
      strengths:'Chef partnerships, creative freedom, Michelin quality, diverse concepts',
      weakness:'High-profile chefs mean premium prices across the board',
      restaurants:['Girl & the Goat','Boka','Momotaro','Swift & Sons','Gingie','Little Goat Diner','Cabra','Duck Duck Goat'],
      scoreBreakdown:{foodQuality:92,service:88,ambiance:90,value:80,consistency:86,innovation:94},
      website:'https://www.bokagrp.com',
      instagram:'bokarestaurantgroup'},
    'Alinea Group':{
      score:97,
      founded:2005,
      concepts:4,
      flagship:'Alinea',
      michelinCount:5,
      description:'Grant Achatz and Nick Kokonas\\' revolutionary group. Alinea (3 Michelin stars), Next (rotating concept, 1 star), The Aviary (cocktails), Roister (casual). Changed American fine dining forever. Tock reservation system born here.',
      strengths:'Innovation, Michelin dominance, theatrical experiences, industry influence',
      weakness:'Extremely expensive, not accessible for everyday dining',
      restaurants:['Alinea','Next','The Aviary','Roister'],
      scoreBreakdown:{foodQuality:99,service:95,ambiance:96,value:65,consistency:95,innovation:99},
      website:'https://www.thealineagroup.com',
      instagram:'thealineagroup'},
    'One Off Hospitality':{
      score:90,
      founded:2003,
      concepts:6,
      flagship:'The Publican',
      michelinCount:0,
      description:'Paul Kahan, Donnie Madia, and Eduard Seitan\\'s group. The Publican, Avec, Big Star, and Publican Quality Meats. James Beard Award winners. Farm-driven, ingredient-focused, neighborhood restaurants.',
      strengths:'Farm relationships, ingredient quality, neighborhood integration, Kahan\\'s vision',
      weakness:'Some spots showing their age, inconsistent during busy periods',
      restaurants:['The Publican','Avec','Big Star','Publican Quality Meats','Dove\\'s Luncheonette'],
      scoreBreakdown:{foodQuality:92,service:86,ambiance:88,value:86,consistency:86,innovation:90},
      website:'https://www.oneoffhospitality.com',
      instagram:'oneoffhospitality'},
    'Hogsalt Hospitality':{
      score:91,
      founded:2011,
      concepts:8,
      flagship:'Bavette\\'s Bar & Boeuf',
      michelinCount:0,
      description:'Brendan Sodikoff\\'s high-design group. Bavette\\'s (steakhouse), Au Cheval (burgers), Small Cheval, The Drifter (underground bar). Known for dark, moody, photogenic spaces and cult-status food.',
      strengths:'Design aesthetic, cult following, Au Cheval burger, atmospheric spaces',
      weakness:'Style over substance debates, long waits at Au Cheval',
      restaurants:['Bavette\\'s Bar & Boeuf','Au Cheval','Small Cheval','The Drifter','Green Street Smoked Meats'],
      scoreBreakdown:{foodQuality:90,service:84,ambiance:96,value:78,consistency:84,innovation:90},
      website:'',
      instagram:'hogsalt'},
    // === SLC GROUPS ===
    'Handle Hospitality':{
      score:91,
      founded:2016,
      concepts:3,
      flagship:'HSL',
      michelinCount:0,
      description:'Chef Briar Handly\\'s SLC group. HSL won the 2025 James Beard Best Chef: Southwest. Handle in Park City is an acclaimed small-plates restaurant. The standard-bearer for fine dining in Utah.',
      strengths:'James Beard quality, live-fire expertise, local sourcing, Park City + SLC presence',
      weakness:'Small group, limited concepts',
      restaurants:['HSL','Handle','HSL East'],
      scoreBreakdown:{foodQuality:94,service:90,ambiance:88,value:82,consistency:90,innovation:90},
      website:'https://www.hslrestaurant.com',
      instagram:'hslrestaurant'},
    'C.O. Hospitality':{
      score:89,
      founded:2009,
      concepts:3,
      flagship:'The Copper Onion',
      michelinCount:0,
      description:'Ryan Lowder\\'s SLC group. The Copper Onion is one of the most beloved restaurants in SLC with an excellent burger and seasonal menu. Copper Common is the companion cocktail bar.',
      strengths:'Neighborhood feel, excellent brunch, cocktail program, consistency',
      weakness:'Small group, limited expansion',
      restaurants:['The Copper Onion','Copper Common'],
      scoreBreakdown:{foodQuality:90,service:88,ambiance:86,value:86,consistency:90,innovation:82},
      website:'https://www.thecopperonion.com',
      instagram:'copperonion'},
    'Pago Restaurant Group':{
      score:88,
      founded:2009,
      concepts:3,
      flagship:'Pago',
      michelinCount:0,
      description:'Scott and Kelli Evans\\' SLC group focused on local sourcing and farm-to-table. Pago, Finca, and Hub & Spoke Diner span from fine dining to casual brunch.',
      strengths:'Farm-to-table commitment, local sourcing, 9th & 9th neighborhood feel',
      weakness:'Small scale, less polished than larger groups',
      restaurants:['Pago','Finca','Hub & Spoke Diner'],
      scoreBreakdown:{foodQuality:90,service:86,ambiance:84,value:84,consistency:86,innovation:86},
      website:'',
      instagram:'pagoslc'}`;

// Insert before the closing }
html = html.substring(0, hgEnd) + ',' + newGroups + '\n' + html.substring(hgEnd);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added hospitality groups for Austin, Houston, Chicago, SLC');

// Verify
html = fs.readFileSync('index.html', 'utf8');
const verifyHg = html.indexOf('HOSPITALITY_GROUPS');
const verifyBlock = html.substring(verifyHg, verifyHg + 100000);
const allKeys = verifyBlock.match(/'[^']+'\s*:\s*\{/g) || [];
console.log('Total HOSPITALITY_GROUPS:', allKeys.length);
