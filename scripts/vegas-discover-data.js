// Vegas Discover — Add CITY_EVENTS, CITY_EXTRAS, WEEKEND_GUIDES entries
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// ================= CITY_EVENTS =================
const vegasEventsJS = `      'Las Vegas': [
        {emoji:'🏎️',name:'Las Vegas Grand Prix (F1)',date:'Nov 19-21, 2026',type:'Sports',note:'Formula 1 returns to the Strip -- 3.8-mile circuit goes right past Bellagio, Caesars, and Venetian. Race runs Saturday night. Entire Strip books out months ahead.',ticket:'https://www.f1lasvegasgp.com',venue:'Las Vegas Strip Circuit',capacity:'Up to 300,000',schedule:['Nov 19 Thu -- Practice sessions','Nov 20 Fri -- Qualifying + F1 Experiences','Nov 21 Sat -- Race Day (10PM local start)'],eat:['Carbone (Aria)','Papi Steak (Fontainebleau)','Bazaar Meat (Palazzo)'],park:'Strip shuts down extensively -- walk, tram, or monorail only. Uber prices surge 10x.'},
        {emoji:'🏒',name:'Vegas Golden Knights at T-Mobile Arena',date:'Oct 2026-Apr 2027',type:'Sports',note:'The best hockey environment in the NHL. The pre-game 'medieval knight' show is a bucket-list Vegas experience. Pre-game dinner at Bavette's.',ticket:'https://www.nhl.com/goldenknights/tickets',venue:'T-Mobile Arena',capacity:'17,500',schedule:['Oct 9 vs Anaheim Ducks (Home Opener)','Oct 25 vs Dallas Stars','Nov 19 vs Toronto Maple Leafs','Dec 18 vs Chicago Blackhawks','Jan 15 vs Colorado Avalanche','Feb 2 vs Boston Bruins'],eat:['Bavette's Steakhouse (Park MGM)','Rollin Smoke BBQ inside T-Mobile','Beerhaus in The Park'],park:'T-Mobile Arena valet or walk from Aria/MGM Grand'},
        {emoji:'🏈',name:'Las Vegas Raiders at Allegiant Stadium',date:'Sep 2026-Jan 2027',type:'Sports',note:'The Death Star. Best stadium food in the NFL. Pre-game tailgating at Pepsi/Lot D or a Strip dinner then Raider shuttle.',ticket:'https://www.raiders.com/tickets',venue:'Allegiant Stadium',capacity:'65,000',schedule:['Sep 13 vs LA Chargers (Home Opener)','Sep 28 vs Washington Commanders','Oct 19 vs Tennessee Titans','Nov 16 vs Dallas Cowboys','Dec 14 vs Denver Broncos (MNF)','Dec 28 vs New York Giants'],eat:['Rollin Smoke BBQ (Allegiant)','Pizza Rock Allegiant','Bazaar Meat pre-game'],park:'Raiders shuttle from Strip or Westgate lots -- driving not recommended'},
        {emoji:'🏀',name:'Las Vegas Aces at Michelob ULTRA Arena',date:'May-Oct 2026',type:'Sports',note:'Back-to-back WNBA champions. Electric atmosphere at the Mandalay Bay arena. Tickets way cheaper than NBA -- great night out.',ticket:'https://www.aces.wnba.com/tickets',venue:'Michelob ULTRA Arena (Mandalay Bay)',capacity:'12,000',schedule:['May 16 vs NY Liberty (Home Opener)','Jun 7 vs Phoenix Mercury','Jul 3 vs Seattle Storm','Aug 15 vs Connecticut Sun','Playoffs: Aug-Oct 2026'],eat:['STRIPSTEAK (Michael Mina, Mandalay Bay)','Fleur by Hubert Keller (Mandalay Bay)','Hofbräuhaus (2 mi away)'],park:'Mandalay Bay valet/self-park'},
        {emoji:'🎵',name:'The Sphere Residencies',date:'Year-round',type:'Concert',note:'Most immersive concert venue ever built. Residencies from The Eagles, Dead & Company, Kenny Chesney, Anyma, plus U2/Phish throwbacks occasionally.',ticket:'https://www.thespherevegas.com',venue:'The Sphere at the Venetian',capacity:'17,600',schedule:['Eagles residency - various dates 2026','Dead & Company - rotating residencies','Anyma - EDM immersive show','Postcard From Earth film daily'],eat:['Yardbird Table & Bar (Venetian)','Bouchon (Venetian)','Matteo's (Venetian)','Carbone Riviera (Bellagio)'],park:'Venetian valet or walk from Wynn/Treasure Island'},
        {emoji:'🎪',name:'Electric Daisy Carnival (EDC)',date:'May 15-17, 2026',type:'Festival',note:'Largest electronic dance music festival in North America -- 400,000+ attendees over three nights. At Las Vegas Motor Speedway. Entire Strip transforms for EDC Week.',ticket:'https://lasvegas.electricdaisycarnival.com',venue:'Las Vegas Motor Speedway',capacity:'400,000',schedule:['May 15 Fri -- Day 1','May 16 Sat -- Day 2','May 17 Sun -- Day 3 (biggest night)'],eat:['Pre-EDC dinner at Fuhu (Resorts World)','Wakuda for a pre-festival omakase','Post-fest breakfast at Peppermill (24/7)'],park:'Free shuttles from Strip -- driving not recommended. Arrive by 6 PM.'},
        {emoji:'♠️',name:'World Series of Poker',date:'May 27-Jul 16, 2026',type:'Tournament',note:'$10K Main Event is the Super Bowl of poker -- 10,000+ entrants, $80M+ prize pool. Horseshoe Las Vegas + Paris Las Vegas venues. Sweat the bubble bursting.',ticket:'https://www.wsop.com',venue:'Horseshoe Las Vegas + Paris Las Vegas',capacity:'Tens of thousands',schedule:['May 27 -- Opening tournaments','Jun 3-Jul 7 -- 100+ bracelet events','Jul 3-16 -- Main Event','Jul 12-16 -- Main Event Final Table'],eat:['Brasserie B (Caesars nearby)','Gordon Ramsay Hell\\'s Kitchen (Caesars)','Amalfi by Bobby Flay'],park:'Horseshoe/Paris valet -- book early during Main Event week'},
        {emoji:'🎸',name:'Life is Beautiful Festival',date:'Sep 25-27, 2026',type:'Festival',note:'Downtown Vegas street festival -- 180,000 attendees over 3 days, 80+ artists, 50+ chefs. Headliners, art installations, and Fremont East closes down.',ticket:'https://www.lifeisbeautiful.com',venue:'Downtown Las Vegas',capacity:'60,000/day',schedule:['Sep 25 Fri -- Day 1','Sep 26 Sat -- Day 2','Sep 27 Sun -- Day 3'],eat:['Esther\\'s Kitchen','Main St. Provisions','Carson Kitchen','Velveteen Rabbit'],park:'Arrive by Uber/ride-share -- Downtown street closures'},
        {emoji:'🐴',name:'National Finals Rodeo (NFR)',date:'Dec 3-12, 2026',type:'Sports',note:'Super Bowl of rodeo. 10 sold-out nights at Thomas & Mack Center. Entire city turns cowboy -- country music + rodeo parties nightly.',ticket:'https://www.nfrexperience.com',venue:'Thomas & Mack Center (UNLV)',capacity:'17,500',schedule:['Dec 3-12 -- 10 consecutive nights, 8 PM start','Downtown: NFR Rodeo Village at Fremont Street','Cowboy Christmas Gift Show daily 9-5'],eat:['Sinatra (Encore)','Spago (Bellagio)','John Mull\\'s Road Kill Grill'],park:'UNLV lots + shuttle -- book car service for events downtown'},
        {emoji:'💻',name:'CES (Consumer Electronics Show)',date:'Jan 6-9, 2026',type:'Convention',note:'Largest tech trade show in the world -- 180,000+ attendees. Every hotel room triples in price. 3,900+ exhibitors at LV Convention Center + Venetian Expo.',ticket:'https://www.ces.tech',venue:'LV Convention Center + Venetian Expo',capacity:'180,000',schedule:['Jan 6-9 -- Main exhibit days','Private press events and parties nightly across the Strip'],eat:['CUT by Wolfgang Puck (Palazzo)','Wakuda','Delilah','Bazaar Meat'],park:'Convention Center Loop (Tesla tunnel) or hotel shuttles'},
      ],
`;

// Find CITY_EVENTS and insert Vegas right after opening brace
let pos = html.indexOf("const CITY_EVENTS = {");
if (pos >= 0 && !html.includes("'Las Vegas': [\n        {emoji:'🏎️',name:'Las Vegas Grand Prix")) {
  const insertAt = html.indexOf('{', pos) + 2; // after '{\n'
  html = html.substring(0, insertAt) + vegasEventsJS + html.substring(insertAt);
  console.log('Added Las Vegas to CITY_EVENTS');
}

// ================= CITY_EXTRAS =================
const vegasExtrasJS = `      'Las Vegas': {
        thingsToDo: [
          {emoji:'⛲',name:'Fountains of Bellagio',desc:'Free choreographed water show on the Strip every 30 min (2PM-midnight). Best viewed from Hyde Lounge or the footbridge.',free:true},
          {emoji:'🔴',name:'Red Rock Canyon',desc:'17 miles from the Strip — 13-mile scenic drive through towering red sandstone cliffs with 30+ hiking trails.'},
          {emoji:'🎆',name:'The Sphere Exterior Shows',desc:'Free LED exterior displays on the world\\'s largest spherical screen. Best viewed from the Venetian pedestrian bridge.',free:true},
          {emoji:'🛸',name:'Area 15 + Meow Wolf',desc:'Entire immersive-art entertainment district. Omega Mart is the must-do; Sky Drop + AREA15 playground also inside.'},
          {emoji:'💡',name:'Fremont Street Experience',desc:'Downtown\\'s 5-block canopy of LED shows every hour + SlotZilla zipline over the crowds.',free:true},
          {emoji:'🏞',name:'Valley of Fire State Park',desc:'Nevada\\'s oldest state park — Mars-like red sandstone, petroglyphs, Fire Wave trail. 55 miles NE.'},
          {emoji:'🏗',name:'Hoover Dam',desc:'1930s engineering marvel 35 miles away. Tours go inside; bypass bridge walk gives the best photo angle.'},
          {emoji:'🎰',name:'Casino-Hopping on the Strip',desc:'Bellagio, Venetian, Caesars, Wynn, and Cosmopolitan each have their own free attractions — fountains, gondolas, fashion shows, art.',free:true}
        ],
        neighborhoods: [
          {emoji:'🎰',name:'The Strip',desc:'Mega-resorts, world-class dining, and every Vegas cliché done right'},
          {emoji:'🎭',name:'Downtown',desc:'Fremont Street Experience, Mob Museum, Neon Museum, Container Park'},
          {emoji:'🎨',name:'Arts District',desc:'Esther\\'s Kitchen, Velveteen Rabbit, craft breweries, First Friday art walks'},
          {emoji:'🥟',name:'Chinatown',desc:'Spring Mountain Road corridor — 248 restaurants, best Asian food in Vegas'},
          {emoji:'🏔',name:'Summerlin',desc:'Master-planned community, Red Rock Resort, Downtown Summerlin shops'},
          {emoji:'🌊',name:'Henderson',desc:'Lake Las Vegas resorts, Green Valley Ranch, quieter suburb vibe'}
        ],
        seasonal: [
          {emoji:'🌸',label:'Spring (Mar-May)',desc:'Perfect weather 60-85°F. EDC in May. World Series of Poker kicks off late May. Red Rock Canyon peak hiking season. Book pool cabanas early.'},
          {emoji:'☀️',label:'Summer (Jun-Aug)',desc:'100-115°F — peak pool party season. Mon-Thu is much cheaper. Day clubs at Marquee, Ayu Dayclub, Stadium Swim, Tao Beach dominate.'},
          {emoji:'🍂',label:'Fall (Sep-Nov)',desc:'Beautiful weather 70-85°F. Life is Beautiful festival (Sep). F1 Las Vegas Grand Prix (Nov). Raiders + Aces home games. Peak convention season.'},
          {emoji:'❄️',label:'Winter (Dec-Feb)',desc:'Cool 45-65°F. NFR rodeo (Dec). CES (Jan). Lee Canyon skiing at Mt Charleston. Mardi Gras-style New Year\\'s Eve on the Strip.'}
        ],
        dayTrips: [
          {emoji:'🔥',name:'Valley of Fire',distance:'55 mi',desc:'Nevada\\'s oldest state park — red sandstone formations, petroglyphs, Fire Wave trail'},
          {emoji:'🏗',name:'Hoover Dam',distance:'35 mi',desc:'Engineering marvel + Pat Tillman Memorial Bridge walk with canyon views'},
          {emoji:'🏔',name:'Mt Charleston',distance:'35 mi',desc:'Alpine forest escape — 30°F cooler, hiking, skiing (Dec-Apr)'},
          {emoji:'🌵',name:'Seven Magic Mountains',distance:'30 mi',desc:'30-ft neon stacked-stone art installation on I-15 — photo essential'},
          {emoji:'🚁',name:'Grand Canyon West',distance:'125 mi',desc:'Skywalk at the west rim — helicopter tours from Vegas make it a half-day trip'}
        ],
        tips: [
          '🎰 Casino floors are free to walk through — world-class people-watching at 4AM',
          '💵 Strip valet is usually free with a spend (dining, shopping, gaming)',
          '🚶 The Strip looks walkable on a map — it\\'s not. Each resort is massive; use the Deuce bus or monorail',
          '🏊 Most Strip pools are private to guests — but dayclubs like Marquee and Ayu sell passes',
          '🍽️ Reservations 4-8 weeks out for Carbone, Bazaar Meat, Mother Wolf, Delilah, Wakuda',
          '🌵 Summer temps are NO JOKE — dress in layers because resorts keep AC freezing',
          '🚕 Uber/Lyft is usually cheaper than taxi. Ride-share pickup at hotel Porte Cochere, not the valet line'
        ]
      },
`;

pos = html.indexOf('const CITY_EXTRAS = {');
if (pos >= 0 && !html.includes("'Las Vegas': {\n        thingsToDo: [")) {
  // CITY_EXTRAS is scoped inside a function. Find the opening { after the declaration.
  const insertAt = html.indexOf('{', pos) + 2;
  html = html.substring(0, insertAt) + vegasExtrasJS + html.substring(insertAt);
  console.log('Added Las Vegas to CITY_EXTRAS');
}

// ================= WEEKEND_GUIDES =================
const vegasGuidesJS = `      'Las Vegas':[
        {id:'vegas-first-timer',creator:'Vital Vegas',handle:'@vitalvegas',platform:'Instagram',avatar:'🎰',title:'The Quintessential Vegas Weekend',subtitle:'First-timer Strip hits + hidden local gems',days:[
          {label:'Friday',emoji:'🌙',slots:[
            {time:'3:00 PM',spot:'Check in at Bellagio',note:'Fountain-view room recommended'},
            {time:'5:00 PM',spot:'Fountains of Bellagio',note:'Free show every 15 min from the Strip-side plaza'},
            {time:'7:00 PM',spot:'Carbone Riviera at Bellagio',id:12005,note:'The hardest reservation on the Strip — spicy rigatoni essential'},
            {time:'10:00 PM',spot:'Delilah at Wynn',id:12128,note:'Modern supper club — live entertainment till 2AM'}
          ]},
          {label:'Saturday',emoji:'☀️',slots:[
            {time:'11:00 AM',spot:'Brunch at Bardot Brasserie',id:12037,note:'One of the best brunches in Vegas at Aria'},
            {time:'1:30 PM',spot:'The Sphere Exterior Walk',note:'Free exterior LED show — walk from Venetian to Sphere'},
            {time:'3:00 PM',spot:'Pool time at your hotel or Cosmopolitan Boulevard Pool',note:'Strip pools close ~6PM'},
            {time:'6:30 PM',spot:'Omakase at Wakuda',id:12032,note:'Two-Michelin-star chef Tetsuya Wakuda — book far ahead'},
            {time:'9:30 PM',spot:'Zuma or Tao for dinner-into-nightclub',id:12033,note:'Japanese izakaya with late-night energy'},
            {time:'11:30 PM',spot:'Cocktails at Canon or Velveteen Rabbit',note:'Skip the megaclubs for the best craft cocktail scene'}
          ]},
          {label:'Sunday',emoji:'🌅',slots:[
            {time:'9:30 AM',spot:'Drive to Red Rock Canyon',note:'17 mi from Strip — book timed entry in summer'},
            {time:'12:30 PM',spot:'Lotus of Siam for lunch',id:12084,note:'James Beard-winning Thai — perfect post-hike'},
            {time:'2:30 PM',spot:'Esther\\'s Kitchen in Arts District',id:12067,note:'Or Main St. Provisions nearby — cocktails + pasta'},
            {time:'4:30 PM',spot:'Fly home with leftovers from Capriotti\\'s or Pinkbox Doughnuts',note:'Pick up souvenirs from the Arts District or Downtown'}
          ]}
        ]}
      ],
`;

pos = html.indexOf('_getWeekendGuides()');
if (pos >= 0 && !html.includes("'Las Vegas':[\n        {id:'vegas-first-timer'")) {
  // Find the opening of the returned object inside _getWeekendGuides
  const retStart = html.indexOf('return {', pos);
  const insertAt = html.indexOf('{', retStart) + 2;
  html = html.substring(0, insertAt) + vegasGuidesJS + html.substring(insertAt);
  console.log('Added Las Vegas to WEEKEND_GUIDES');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
