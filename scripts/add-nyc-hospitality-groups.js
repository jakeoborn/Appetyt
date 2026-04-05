const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Add more NYC hospitality groups to HOSPITALITY_GROUPS
// These go alongside the existing ones I added before
const newGroups = `
    'Tao Group Hospitality':{
      score:84,founded:2000,concepts:15,flagship:'Tao Downtown',michelinCount:0,
      description:'One of the largest nightlife and restaurant empires in NYC. Behind Tao, Lavo, Marquee, Beauty & Essex, Catch, and The Highlight Room. Masters of the scene-driven mega-venue.',
      strengths:'Scale, nightlife integration, celebrity draw, brand recognition, global reach',
      weakness:'Spectacle over substance -- food is secondary to the experience at most venues',
      restaurants:['Tao Downtown','Lavo Italian Restaurant','Marquee New York','Beauty & Essex','Catch','Marquee Skydeck at Edge'],
      scoreBreakdown:{foodQuality:78,service:80,ambiance:92,value:70,consistency:82,innovation:76},
    },
    'Stephen Starr':{
      score:87,founded:1995,concepts:5,flagship:'Le Coucou',michelinCount:1,
      description:'Philly-born restaurateur who commands NYC fine dining with Le Coucou and Buddakan. Every concept is a visual spectacle with serious culinary chops behind it.',
      strengths:'Design vision, Michelin quality, theatrical spaces, broad appeal',
      weakness:'Some concepts prioritize design over warmth',
      restaurants:['Le Coucou','Buddakan','Morimoto'],
      scoreBreakdown:{foodQuality:90,service:86,ambiance:95,value:75,consistency:87,innovation:85},
    },
    'Ignacio Mattos':{
      score:91,founded:2013,concepts:4,flagship:'Estela',michelinCount:1,
      description:'Uruguayan-born chef behind some of NYC\\'s most critically acclaimed restaurants. Estela, Flora Bar, and Lodi are all must-visits for serious food lovers.',
      strengths:'Creative vision, ingredient quality, critical acclaim, effortless cool',
      weakness:'Small portfolio -- intimate scale limits accessibility',
      restaurants:['Estela','Altro Paradiso'],
      scoreBreakdown:{foodQuality:94,service:86,ambiance:90,value:80,consistency:88,innovation:92},
    },
    'Gabriel Stulman':{
      score:86,founded:2010,concepts:5,flagship:'Sailor',michelinCount:0,
      description:'West Village restaurateur known for charming neighborhood spots. Now behind Sailor in Fort Greene with April Bloomfield, plus Fairfax and Joseph Leonard.',
      strengths:'Neighborhood warmth, charm, consistent quality, service',
      weakness:'Conservative approach -- not pushing culinary boundaries',
      restaurants:['Sailor','Bar Pisellino'],
      scoreBreakdown:{foodQuality:85,service:88,ambiance:89,value:82,consistency:90,innovation:75},
    },
    'Missy Robbins':{
      score:90,founded:2016,concepts:2,flagship:'Lilia',michelinCount:0,
      description:'Former A Voce chef Missy Robbins built two of Brooklyn\\'s most beloved Italian restaurants. Lilia is a decade-old icon that still commands lines.',
      strengths:'Pasta mastery, Italian soul, Brooklyn identity, ingredient sourcing',
      weakness:'Only two restaurants -- impossible reservations at both',
      restaurants:['Lilia','Misi'],
      scoreBreakdown:{foodQuality:95,service:87,ambiance:88,value:78,consistency:92,innovation:85},
    },
    'Olmsted Hospitality (Greg Baxtrom)':{
      score:89,founded:2016,concepts:2,flagship:'Olmsted',michelinCount:0,
      description:'Greg Baxtrom\\'s Prospect Heights duo -- Olmsted (garden restaurant) and Maison Yaki (Japanese grill). Inventive, seasonal, and deeply personal cooking.',
      strengths:'Creativity, garden-to-table, seasonal innovation, Brooklyn charm',
      weakness:'Very small group -- limited reach',
      restaurants:['Olmsted'],
      scoreBreakdown:{foodQuality:93,service:87,ambiance:90,value:82,consistency:87,innovation:94},
    },
    'Jean-Georges Vongerichten':{
      score:90,founded:1991,concepts:8,flagship:'Jean-Georges',michelinCount:2,
      description:'One of the most prolific chefs in the world with restaurants spanning 4 continents. NYC flagships include the 2-Michelin-star Jean-Georges, ABCV, and The Mark.',
      strengths:'Michelin pedigree, global vision, consistency at scale, vegetable mastery',
      weakness:'Empire is so large some concepts feel less personal',
      restaurants:['Jean-Georges','ABCV','ABC Kitchen','The Mark'],
      scoreBreakdown:{foodQuality:92,service:90,ambiance:88,value:75,consistency:88,innovation:90},
    },
    'Simon Kim (COTE)':{
      score:89,founded:2017,concepts:3,flagship:'COTE Korean Steakhouse',michelinCount:1,
      description:'Korean-American restaurateur behind Michelin-starred COTE and the acclaimed Atoboy. Redefining Korean dining in America with precision and creativity.',
      strengths:'Korean innovation, steakhouse excellence, Michelin quality, wine program',
      weakness:'High price point -- COTE is a splurge',
      restaurants:['COTE Korean Steakhouse','Atoboy'],
      scoreBreakdown:{foodQuality:93,service:89,ambiance:91,value:72,consistency:90,innovation:92},
    },
    'Ellia & Junghyun Park (Atomix)':{
      score:94,founded:2016,concepts:2,flagship:'Atomix',michelinCount:2,
      description:'The most acclaimed Korean fine dining in America. Atomix (2 Michelin stars) is a 14-seat counter experience ranked among the World\\'s 50 Best Restaurants.',
      strengths:'World-class, Korean fine dining innovation, intimate scale, awards',
      weakness:'14 seats at Atomix means near-impossible reservations',
      restaurants:['Atomix'],
      scoreBreakdown:{foodQuality:98,service:95,ambiance:92,value:75,consistency:95,innovation:98},
    },
    'Billy Durney':{
      score:86,founded:2015,concepts:3,flagship:'Hometown Bar-B-Que',michelinCount:0,
      description:'Red Hook pitmaster turned restaurateur behind Hometown Bar-B-Que, Red Hook Tavern, and the upcoming expansion. Texas BBQ meets Brooklyn craft.',
      strengths:'BBQ mastery, neighborhood loyalty, quality across casual and upscale',
      weakness:'Small portfolio concentrated in Red Hook',
      restaurants:['Hometown Bar-B-Que','Red Hook Tavern'],
      scoreBreakdown:{foodQuality:90,service:84,ambiance:82,value:88,consistency:87,innovation:78},
    },
    'Frenchette (Lee Hanson & Riad Nasr)':{
      score:90,founded:2018,concepts:3,flagship:'Frenchette',michelinCount:0,
      description:'The duo behind Frenchette, Le Rock, and the revived Le Veau d\\'Or. Masters of the French brasserie form, bringing genuine Parisian energy to NYC.',
      strengths:'French mastery, atmosphere, wine programs, buzzy energy',
      weakness:'Hard to get into all three -- demand exceeds supply',
      restaurants:['Frenchette','Le Rock','Le Veau d\\'Or'],
      scoreBreakdown:{foodQuality:92,service:87,ambiance:94,value:80,consistency:88,innovation:85},
    },
`;

// Find the end of existing NYC groups and insert before closing brace
// The groups are inside HOSPITALITY_GROUPS = { ... };
// I need to add after the last existing group before the closing };
const hgCloseIdx = html.indexOf('};', html.indexOf("'Quality Branded'"));
if(hgCloseIdx === -1) {
  console.log('ERROR: Could not find HOSPITALITY_GROUPS closing');
  process.exit(1);
}

// Check if these groups already exist
const existsCheck = ['Tao Group', 'Stephen Starr', 'Ignacio Mattos', 'Missy Robbins'];
const alreadyExist = existsCheck.filter(g => html.includes("'" + g));
if(alreadyExist.length > 0) {
  console.log('Some groups already exist:', alreadyExist.join(', '));
  console.log('Skipping to avoid duplicates');
} else {
  html = html.substring(0, hgCloseIdx) + newGroups + '  ' + html.substring(hgCloseIdx);
  console.log('Added 11 more NYC hospitality groups');
}

// Also update the nycGroupNames array in hospitalityGroupsHTML to include new groups
html = html.replace(
  "const nycGroupNames = ['Major Food Group','Union Square Hospitality (Danny Meyer)','Keith McNally','Unapologetic Foods','Rita Sodi & Jody Williams','Momofuku (David Chang)','NoHo Hospitality (Andrew Carmellini)','Quality Branded'];",
  "const nycGroupNames = ['Major Food Group','Union Square Hospitality (Danny Meyer)','Keith McNally','Unapologetic Foods','Rita Sodi & Jody Williams','Momofuku (David Chang)','NoHo Hospitality (Andrew Carmellini)','Quality Branded','Tao Group Hospitality','Stephen Starr','Ignacio Mattos','Gabriel Stulman','Missy Robbins','Jean-Georges Vongerichten','Simon Kim (COTE)','Ellia & Junghyun Park (Atomix)','Billy Durney','Frenchette (Lee Hanson & Riad Nasr)','Olmsted Hospitality (Greg Baxtrom)'];"
);
console.log('Updated nycGroupNames to include all 19 groups');

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done.');
