const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// =====================================================
// 1. ADD NYC EVENTS to CITY_EVENTS in openActivitiesPage
// =====================================================
const nycEvents = `
      'New York': [
        {emoji:'⚾',name:'New York Yankees at Yankee Stadium',date:'Apr-Oct 2026',type:'Sports',note:'The most storied franchise in sports history. 54,000 seats, Monument Park, and garlic fries. Take the 4 train to 161st St.',ticket:'https://www.mlb.com/yankees/tickets',venue:'Yankee Stadium, Bronx'},
        {emoji:'⚾',name:'New York Mets at Citi Field',date:'Apr-Oct 2026',type:'Sports',note:'Queens baseball with a passionate fanbase. Shake Shack inside the stadium. Take the 7 train to Mets-Willets Point.',ticket:'https://www.mlb.com/mets/tickets',venue:'Citi Field, Queens'},
        {emoji:'🏀',name:'New York Knicks at Madison Square Garden',date:'Oct 2026-Apr 2027',type:'Sports',note:'The Garden. The most famous arena in the world. The energy for a Knicks game is unmatched. Penn Station is directly below.',ticket:'https://www.nba.com/knicks/tickets',venue:'Madison Square Garden'},
        {emoji:'🏒',name:'New York Rangers at Madison Square Garden',date:'Oct 2026-Apr 2027',type:'Sports',note:'Rangers hockey at MSG. The horn, the energy, the Broadway blueshirts. Winter classic experience.',ticket:'https://www.nhl.com/rangers/tickets',venue:'Madison Square Garden'},
        {emoji:'🎭',name:'Broadway Shows',date:'Year-round',type:'Theater',note:'40+ theaters between 41st-54th. Hamilton, Wicked, Lion King, and hundreds more. TKTS booth at Times Square for same-day discount tickets.',ticket:'https://www.broadway.com',venue:'Theater District, Midtown'},
        {emoji:'🎵',name:'SummerStage in Central Park',date:'Jun-Sep 2026',type:'Concert',note:'Free outdoor concerts at Rumsey Playfield — major headliners spanning rock, hip-hop, Latin, and world music. The best free event in NYC.',ticket:'https://www.cityparksfoundation.org/summerstage',venue:'Central Park, Rumsey Playfield'},
        {emoji:'🎵',name:'Governors Ball Music Festival',date:'Jun 2026',type:'Festival',note:'NYC\\'s biggest music festival on Randall\\'s Island with major headliners across multiple stages. Three days of music, food, and art.',ticket:'https://www.governorsballmusicfestival.com',venue:'Randall\\'s Island Park'},
        {emoji:'🎆',name:'July 4th Macy\\'s Fireworks',date:'Jul 4, 2026',type:'Festival',note:'The biggest fireworks show in America over the East River. Best views from Brooklyn Bridge Park, FDR Drive, or a rooftop bar.',ticket:'',venue:'East River, NYC'},
        {emoji:'🎃',name:'Village Halloween Parade',date:'Oct 31, 2026',type:'Festival',note:'The largest Halloween celebration in America. 50,000+ costumed marchers on 6th Avenue from Spring St to 16th St. Free to watch.',ticket:'',venue:'6th Avenue, Greenwich Village'},
        {emoji:'🎄',name:'Rockefeller Center Tree Lighting',date:'Late Nov 2026',type:'Seasonal',note:'The iconic 75+ foot Christmas tree lighting kicks off the holiday season. Ice skating, Saks light show, and holiday markets nearby.',ticket:'',venue:'Rockefeller Center'},
        {emoji:'🏃',name:'NYC Marathon',date:'Nov 1, 2026',type:'Sports',note:'50,000 runners through all five boroughs. Watch from the Williamsburg Bridge, First Ave UES, or the Central Park finish.',ticket:'https://www.nyrr.org/tcsnycmarathon',venue:'All 5 boroughs, finish in Central Park'},
        {emoji:'🎾',name:'US Open Tennis',date:'Aug-Sep 2026',type:'Sports',note:'Grand Slam tennis at the USTA Billie Jean King National Tennis Center. The energy of night sessions at Arthur Ashe Stadium is electric.',ticket:'https://www.usopen.org/tickets',venue:'USTA, Flushing Meadows, Queens'},
        {emoji:'🗽',name:'NYC Restaurant Week',date:'Jan & Jul 2026',type:'Food',note:'$30 lunch and $45 dinner prix fixe at 600+ restaurants. The best way to try NYC\\'s top restaurants at a fraction of the price.',ticket:'https://www.nycgo.com/restaurant-week',venue:'Citywide'},
      ],`;

// Insert NYC events after the Dallas events array closing
html = html.replace(
  "      ]\n    };\n    const cityEvents = CITY_EVENTS[S.city] || [];",
  "      ],\n" + nycEvents + "\n    };\n    const cityEvents = CITY_EVENTS[S.city] || [];"
);
console.log('Added NYC events to Activities page');

// =====================================================
// 2. ADD NYC WEEKEND GUIDES to _getWeekendGuides
// =====================================================
const nycGuides = `
      'New York':[
        {id:'nyc-first-timer',creator:'Dim Hour Guide',handle:'@dimhour',platform:'Dim Hour',avatar:'🗽',title:'NYC First Timer Weekend',subtitle:'Hit the icons plus the hidden gems',days:[
          {label:'Friday Night',emoji:'🌙',slots:[
            {time:'6:00 PM',spot:'Walk the Brooklyn Bridge at sunset',id:1680,note:'Start in Manhattan, end in DUMBO — stunning views'},
            {time:'7:30 PM',spot:'Pizza at Juliana\\'s',id:1171,note:'Coal-fired perfection under the Brooklyn Bridge'},
            {time:'9:30 PM',spot:'Cocktails at Westlight',id:1469,note:'22nd floor rooftop — Manhattan skyline views'}
          ]},
          {label:'Saturday',emoji:'���️',slots:[
            {time:'9:00 AM',spot:'Bagels at Absolute Bagels',id:1344,note:'Hand-rolled, kettle-boiled. The real deal.'},
            {time:'10:30 AM',spot:'The Met Museum',id:null,note:'Start on the rooftop garden bar in summer'},
            {time:'1:00 PM',spot:'Lunch at Katz\\'s Delicatessen',id:1010,note:'Pastrami on rye. Cash at counter. No debate.'},
            {time:'3:00 PM',spot:'Walk the High Line',id:null,note:'Elevated park from Gansevoort to Hudson Yards'},
            {time:'7:00 PM',spot:'Dinner at Via Carota',id:1005,note:'West Village Italian — arrive early for walk-in'},
            {time:'10:00 PM',spot:'Cocktails at Death & Co',id:1605,note:'The bar that started the cocktail renaissance'}
          ]},
          {label:'Sunday',emoji:'🌅',slots:[
            {time:'10:00 AM',spot:'Brunch at Balthazar',id:1007,note:'SoHo brasserie — the quintessential NYC brunch'},
            {time:'12:30 PM',spot:'Walk through Central Park',id:null,note:'Bethesda Fountain, Bow Bridge, Strawberry Fields'},
            {time:'3:00 PM',spot:'Joe\\'s Pizza slice',id:1011,note:'The classic NYC fold-and-walk experience'},
            {time:'5:00 PM',spot:'Sunset from Top of the Rock',id:1675,note:'Best view of the Empire State Building'}
          ]}
        ]},
        {id:'nyc-foodies-deep-dive',creator:'Dim Hour Guide',handle:'@dimhour',platform:'Dim Hour',avatar:'🍽',title:'NYC Serious Foodie Weekend',subtitle:'Michelin stars, tasting menus & cult favorites',days:[
          {label:'Friday Night',emoji:'🌙',slots:[
            {time:'5:30 PM',spot:'Cocktails at Attaboy',id:1071,note:'No menu — tell the bartender what you like'},
            {time:'7:30 PM',spot:'Dinner at Dhamaka',id:1028,note:'Indian food like you\\'ve never had — fiery, bold, Michelin'},
            {time:'10:00 PM',spot:'Dessert at Lysée',id:1116,note:'Korean-French pastry genius — the Egg Soufflé'}
          ]},
          {label:'Saturday',emoji:'☀️',slots:[
            {time:'9:00 AM',spot:'Russ & Daughters',id:1018,note:'Smoked fish since 1914. Get the Super Heebster.'},
            {time:'11:00 AM',spot:'Smorgasburg',id:1670,note:'100+ vendors on the Williamsburg waterfront'},
            {time:'2:00 PM',spot:'Coffee at Devoción',id:1383,note:'Greenhouse coffee roastery in Williamsburg'},
            {time:'5:30 PM',spot:'Omakase at Sushi Nakazawa',id:1021,note:'Jiro-trained chef — book the counter'},
            {time:'9:00 PM',spot:'Drinks at Please Don\\'t Tell',id:1362,note:'Phone booth entrance inside Crif Dogs — the OG speakeasy'}
          ]},
          {label:'Sunday',emoji:'🌅',slots:[
            {time:'10:00 AM',spot:'Dim Sum at Nom Wah Tea Parlor',id:1053,note:'Chinatown\\'s oldest dim sum house — 100 years old'},
            {time:'1:00 PM',spot:'Chelsea Market food crawl',id:null,note:'Los Tacos No 1, Lobster Place, Li-Lac Chocolates'},
            {time:'4:00 PM',spot:'Apothéke for a nightcap',id:1584,note:'Chinatown speakeasy — bartenders in lab coats'}
          ]}
        ]}
      ],`;

// Insert after the last Dallas guide entry, before the closing of _getWeekendGuides
// Find the closing of Dallas guides array
const guidesIdx = html.indexOf("_getWeekendGuides(){");
const dalClosing = html.indexOf("      ]\n    };\n  },", guidesIdx);
if(dalClosing > -1) {
  html = html.substring(0, dalClosing + 7) + ",\n" + nycGuides + "\n    };\n  }," + html.substring(dalClosing + 17);
  console.log('Added NYC weekend guides');
} else {
  // Try alternate pattern
  const alt = html.indexOf("]\n    };\n  },\n\n  openWeekendGuide");
  if(alt > -1) {
    html = html.substring(0, alt + 1) + ",\n" + nycGuides + "\n    };\n  },\n\n  openWeekendGuide" + html.substring(alt + 17 + html.substring(alt + 1).indexOf("openWeekendGuide"));
    console.log('Added NYC weekend guides (alt pattern)');
  } else {
    console.log('WARNING: Could not find insertion point for NYC guides');
    // Brute force: find the return object closing
    const retClose = html.indexOf("};", html.indexOf("'Dallas':[", guidesIdx) + 5000);
    console.log('Guides return closes at:', retClose);
  }
}

// Also fix the "inspired by Dallas creators" text to be city-aware
html = html.replace(
  "Curated itineraries inspired by Dallas creators",
  "Curated itineraries inspired by ${S.city} creators"
);

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
