const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// =====================================================
// 1. ADD NYC HOSPITALITY GROUPS
// =====================================================
// Add NYC groups after the existing Dallas groups, keyed by city
const nycGroups = `
    // NYC Hospitality Groups
    'Major Food Group':{
      score:95,founded:2012,concepts:8,flagship:'Carbone',michelinCount:3,
      description:'NYC\\'s most powerful restaurant empire. Carbone, Torrisi, The Grill, and The Pool define Manhattan fine dining. Masters of the reservation game and theatrical dining.',
      strengths:'Brand power, execution, theatricality, wine programs, culinary vision',
      weakness:'Price point limits accessibility -- most concepts are special occasion',
      restaurants:['Carbone','Torrisi','The Grill','Santina','Bad Roman','Sadelle\\'s','The Pool'],
      scoreBreakdown:{foodQuality:96,service:93,ambiance:96,value:65,consistency:92,innovation:94},
    },
    'Union Square Hospitality (Danny Meyer)':{
      score:93,founded:1985,concepts:10,flagship:'Gramercy Tavern',michelinCount:2,
      description:'Danny Meyer\\'s pioneering Enlightened Hospitality empire. From Gramercy Tavern to Shake Shack, USHG defined modern NYC dining culture and invented fast-casual.',
      strengths:'Service culture, consistency, warmth, hospitality philosophy, Michelin quality',
      weakness:'Some concepts have become so popular they feel institutional',
      restaurants:['Gramercy Tavern','The Modern','Manhatta','Daily Provisions','Ci Siamo'],
      scoreBreakdown:{foodQuality:92,service:98,ambiance:90,value:82,consistency:95,innovation:88},
    },
    'Keith McNally':{
      score:90,founded:1980,concepts:5,flagship:'Balthazar',michelinCount:0,
      description:'The king of NYC brasseries. Balthazar, Pastis, Minetta Tavern, and Morandi are cultural institutions -- more scene than restaurant, and that\\'s exactly the point.',
      strengths:'Atmosphere, cultural relevance, French brasserie mastery, celebrity magnetism',
      weakness:'Food is secondary to the scene -- you come for the energy, not innovation',
      restaurants:['Balthazar','Pastis','Minetta Tavern','Morandi','Le Rock'],
      scoreBreakdown:{foodQuality:86,service:85,ambiance:96,value:78,consistency:88,innovation:75},
    },
    'Unapologetic Foods':{
      score:92,founded:2019,concepts:5,flagship:'Dhamaka',michelinCount:1,
      description:'The most exciting restaurant group in NYC right now. Chintan Pandya\\'s Dhamaka, Semma, and Adda are redefining Indian cuisine in America with Michelin recognition.',
      strengths:'Chef-driven, bold flavors, critical acclaim, cultural authenticity',
      weakness:'Can be very spicy -- not for the faint of heart',
      restaurants:['Dhamaka','Semma','Adda','Dhamaka Kitchen','Rowdy Rooster'],
      scoreBreakdown:{foodQuality:95,service:86,ambiance:85,value:88,consistency:87,innovation:97},
    },
    'Rita Sodi & Jody Williams':{
      score:91,founded:2014,concepts:4,flagship:'Via Carota',michelinCount:0,
      description:'The Italian queens of the West Village. Via Carota is the most impossible reservation in NYC. Every concept feels like a neighborhood in Florence transplanted to Greenwich Village.',
      strengths:'Italian soul, ingredient quality, romantic atmosphere, neighborhood feel',
      weakness:'Nearly impossible reservations -- Via Carota walk-in wait can exceed 2 hours',
      restaurants:['Via Carota','I Sodi','Buvette','Bar Pisellino'],
      scoreBreakdown:{foodQuality:93,service:88,ambiance:94,value:80,consistency:90,innovation:82},
    },
    'Momofuku (David Chang)':{
      score:87,founded:2004,concepts:4,flagship:'Kabawa',michelinCount:0,
      description:'David Chang\\'s empire that changed American dining forever. Noodle Bar launched a thousand imitators. Kabawa is the exciting new chapter -- Caribbean fine dining in the East Village.',
      strengths:'Innovation, cultural impact, chef talent pipeline, media presence',
      weakness:'Some original concepts have lost their edge -- Kabawa is the fresh energy',
      restaurants:['Momofuku Noodle Bar','Momofuku Ssäm Bar','Kabawa','Bar Kabawa'],
      scoreBreakdown:{foodQuality:88,service:82,ambiance:83,value:78,consistency:80,innovation:95},
    },
    'NoHo Hospitality (Andrew Carmellini)':{
      score:88,founded:2010,concepts:5,flagship:'Locanda Verde',michelinCount:0,
      description:'Andrew Carmellini\\'s downtown empire. Locanda Verde, The Dutch, and Café Carmellini deliver polished Italian-American cooking across Tribeca and SoHo.',
      strengths:'Consistency, neighborhood fit, brunch, Italian-American comfort',
      weakness:'Can feel formulaic -- the group has a recognizable template',
      restaurants:['Locanda Verde','The Dutch','Lafayette','Café Carmellini'],
      scoreBreakdown:{foodQuality:87,service:87,ambiance:88,value:82,consistency:90,innovation:78},
    },
    'Quality Branded':{
      score:85,founded:2012,concepts:5,flagship:'Don Angie',michelinCount:0,
      description:'Behind Don Angie, Quality Meats, Quality Italian, and the new Bad Roman. The group excels at crowd-pleasing theatrical dining with strong cocktail programs.',
      strengths:'Theatrical presentations, cocktails, broad appeal, shareable plates',
      weakness:'Can lean into spectacle over substance -- portions are generous though',
      restaurants:['Don Angie','Quality Meats','Quality Italian','Bad Roman'],
      scoreBreakdown:{foodQuality:84,service:86,ambiance:88,value:80,consistency:85,innovation:82},
    },
`;

// Insert NYC groups before the closing brace of HOSPITALITY_GROUPS
html = html.replace(
  /('M Crowd Restaurant Group':\{[^}]+scoreBreakdown:\{[^}]+\},?\s*\},)\s*\};/,
  `$1\n${nycGroups}  };`
);

// =====================================================
// 2. MAKE bestOfDallasHTML CITY-AWARE
// =====================================================
// Replace the function name and add city check + NYC content
html = html.replace(
  `bestOfDallasHTML(){`,
  `bestOfCityHTML(){
    if((S.city||'Dallas')==='New York') return this.bestOfNYCHTML();`
);

// Update the call site
html = html.replace(
  `html += this.bestOfDallasHTML();`,
  `html += this.bestOfCityHTML();`
);

// Update the header to be city-aware
html = html.replace(
  `🏆 Best Of Dallas`,
  `🏆 Best Of \${S.city||'Dallas'}`
);

// =====================================================
// 3. ADD bestOfNYCHTML FUNCTION
// =====================================================
const nycBestOfFn = `
  bestOfNYCHTML(){
    const lists = [
      { title: 'Best Pizza Slice', emoji: '🍕', spots: [
        { name: "L'Industrie Pizzeria", note: 'Williamsburg perfection -- burrata slice is legendary' },
        { name: 'Prince Street Pizza', note: 'The pepperoni square -- crispy cups of spicy goodness' },
        { name: "Joe's Pizza", note: 'The classic NYC slice -- thin, floppy, perfect fold' },
        { name: "Scarr's Pizza", note: 'LES -- hand-milled flour, old-school technique' },
        { name: 'Mama\\'s Too', note: 'UWS thick squares -- viral for a reason' },
        { name: 'Una Pizza Napoletana', note: '50 Top Pizza #1 in the world -- LES' },
      ]},
      { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
        { name: 'Double Chicken Please', note: 'World\\'s 50 Best Bars -- LES innovation' },
        { name: 'Attaboy', note: 'No menu -- tell the bartender what you like' },
        { name: 'Death & Co', note: 'James Beard winner -- craft cocktail pioneer' },
        { name: 'Katana Kitten', note: 'Japanese highballs + shochu -- West Village' },
        { name: 'Please Don\\'t Tell', note: 'The OG speakeasy -- phone booth entrance through Crif Dogs' },
        { name: 'Existing Conditions', note: 'Dave Arnold\\'s cocktail lab -- clarified drinks, science' },
      ]},
      { title: 'Best Date Night', emoji: '💕', spots: [
        { name: 'Via Carota', note: 'West Village Italian -- the impossible reservation' },
        { name: 'One If By Land, Two If By Sea', note: 'Most romantic restaurant in NYC -- fireplace, carriage house' },
        { name: 'Le Veau d\\'Or', note: 'Revived 1930s UES French bistro -- Frenchette team' },
        { name: 'Claud', note: 'Below-ground East Village wine bar -- chocolate cake is a must' },
        { name: 'The River Cafe', note: 'DUMBO waterfront -- Manhattan skyline views' },
        { name: 'Freemans', note: 'Hidden at the end of an alley on the LES' },
      ]},
      { title: 'Best Brunch', emoji: '🥂', spots: [
        { name: 'Clinton St. Baking Co.', note: 'The pancakes that started NYC brunch culture' },
        { name: 'Sunday in Brooklyn', note: 'Malted pancakes -- Williamsburg brunch destination' },
        { name: 'Balthazar', note: 'SoHo brasserie -- solo diners get champagne' },
        { name: 'Russ & Daughters Cafe', note: 'Smoked fish platters -- LES institution since 1914' },
        { name: 'Chez Ma Tante', note: 'NYC\\'s most Instagrammed pancakes -- Greenpoint' },
        { name: 'Win Son', note: 'Taiwanese-American brunch -- fly\\'s head, scallion pancakes' },
      ]},
      { title: 'Best Burger', emoji: '🍔', spots: [
        { name: 'Minetta Tavern', note: 'Black Label Burger -- dry-aged, the gold standard' },
        { name: 'Corner Bistro', note: 'West Village dive -- Bistro Burger, cash only' },
        { name: 'Hamburger America', note: 'SoHo -- burger scholar George Motz\\'s love letter' },
        { name: 'Red Hook Tavern', note: 'Billy Durney\\'s polished tavern burger' },
        { name: "JG Melon", note: 'UES classic -- cottage cheese on the side' },
        { name: "P.J. Clarke\\'s", note: 'Midtown institution since 1884 -- the Cadillac' },
      ]},
      { title: 'Best Late Night', emoji: '🌙', spots: [
        { name: 'Employees Only', note: 'West Village -- kitchen open until 3:30AM' },
        { name: "Lil\\' Frankie\\'s", note: 'East Village Italian -- open until 2AM' },
        { name: 'Blue Ribbon Sushi', note: 'SoHo -- chef\\'s go-to after their shifts' },
        { name: 'The Odeon', note: 'Tribeca icon -- late night since 1980' },
        { name: 'Golden Diner', note: 'Chinatown -- egg sandwich available until 10PM' },
        { name: 'Katz\\'s Delicatessen', note: 'Open until 2:30AM Fri-Sat -- pastrami never sleeps' },
      ]},
      { title: 'Best Speakeasy / Hidden Gem', emoji: '🔑', spots: [
        { name: 'Bohemian', note: 'Referral-only Japanese -- no sign, no website, no phone' },
        { name: 'Apothéke', note: 'Chinatown -- bartenders in lab coats, Doyers St' },
        { name: 'The Back Room', note: 'Real Prohibition bar -- drinks in teacups, alley entrance' },
        { name: 'Decoy', note: 'Underground Peking duck bar beneath RedFarm' },
        { name: 'Tokyo Record Bar', note: '12 seats -- vinyl DJ + omakase dinner' },
        { name: 'Raines Law Room', note: 'Buzzer entry -- velvet couches, Flatiron' },
      ]},
      { title: 'Best Rooftop', emoji: '🌆', spots: [
        { name: 'Westlight', note: '22nd floor at William Vale -- 360° views, Williamsburg' },
        { name: 'Overstory', note: '64th floor FiDi -- one of the tallest bars in NYC' },
        { name: 'Saga', note: '63rd floor -- 2 Michelin stars + terrace cocktails' },
        { name: 'Le Bain', note: 'Standard Hotel Meatpacking -- rooftop pool + DJs' },
        { name: 'Bemelmans Bar', note: 'The Carlyle -- Art Deco, live jazz, Madeline murals' },
        { name: 'Bar Blondeau', note: 'Wythe Hotel -- sweeping Manhattan skyline' },
      ]},
    ];

    return \`<div style="margin:20px 0 0;padding:0 0 20px">
      <div style="font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;padding:0 0 12px">🏆 Best Of New York</div>
      \${lists.map(list=>\`
        <div style="margin-bottom:18px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">\${list.emoji} \${list.title}</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            \${list.spots.map((s,i)=>{
              const match=A.getRestaurants().find(r=>r.name.toLowerCase()===s.name.toLowerCase())||A.getRestaurants().find(r=>r.name.toLowerCase().includes(s.name.toLowerCase()));
              const clickAttr=match?\\\`onclick="A.openDetail(\${match.id})" style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\\\`:\\\`style="display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\\\`;
              return \\\`<div \${clickAttr}>
                <div style="font-size:11px;font-weight:800;color:var(--gold);min-width:16px;margin-top:1px">\${i+1}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:700;color:var(--text)">\${s.name}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:1px">\${s.note}</div>
                </div>
                \${match?'<div style="font-size:11px;color:var(--text3);margin-top:2px;flex-shrink:0">›</div>':''}
              </div>\\\`;}).join('')}
          </div>
        </div>\`).join('')}
    </div>\`;
  },
`;

// Insert the NYC function right after the bestOfCityHTML closing brace
// Find the closing of the Dallas bestOf function (ends with `</div>`;  },)
html = html.replace(
  /(\s*<\/div>`;\s*\},)\s*\n\s*expandResults/,
  `$1\n\n${nycBestOfFn}\n  expandResults`
);

// =====================================================
// 4. UPDATE BLACK-OWNED EMPTY STATE TO BE CITY-AWARE
// =====================================================
html = html.replace(
  `<b style="color:var(--gold)">On our radar for Dallas:</b><br>Nadia Cakes \\u00b7 Kitti\\'s Soul Food \\u00b7 The Social Oak \\u00b7 Miss Mamie\\'s`,
  `<b style="color:var(--gold)">On our radar for '+S.city+':</b><br>'+(S.city==='New York'?'Sylvia\\'s \\u00b7 Red Rooster \\u00b7 Amy Ruth\\'s \\u00b7 Melba\\'s \\u00b7 Sisters Caribbean':'Nadia Cakes \\u00b7 Kitti\\'s Soul Food \\u00b7 The Social Oak \\u00b7 Miss Mamie\\'s')+'`
);

// =====================================================
// 5. UPDATE EDITORIAL VALIDATION SIGNALS COMMENT
// =====================================================
html = html.replace(
  `// Source: D Magazine, Dallas Observer, Eater Dallas, The Infatuation,`,
  `// Source: D Magazine, Dallas Observer, Eater Dallas/NY, The Infatuation,`
);
html = html.replace(
  `//         Resy Hit List, PaperCity, Scout Guide, Dallas Sites 101`,
  `//         Resy Hit List, PaperCity, Scout Guide, TimeOut, Michelin Guide`
);

// Write
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done. Updated:');
console.log('- Added 8 NYC hospitality groups');
console.log('- Made bestOfDallasHTML city-aware (Dallas + NYC)');
console.log('- Added bestOfNYCHTML with 8 Best Of lists');
console.log('- Updated Black-owned empty state for NYC');
console.log('- Updated editorial source comments');
