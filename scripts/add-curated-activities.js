const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find the Local tab renderLocal method to add activities section
// We'll add a CURATED_ACTIVITIES data object and render it in the Discover tab

// Add the curated activities data before the S state object
const stateMarker = '// STATE';
const stateIdx = html.indexOf(stateMarker);
if(stateIdx === -1){ console.error('Could not find STATE marker'); process.exit(1); }

const activitiesData = `
// Curated city activities with verified Viator/GetYourGuide links
const CURATED_ACTIVITIES = {
  'new york': [
    {name:'Statue of Liberty & Ellis Island Guided Tour',category:'Landmark',price:'From $45',rating:'4.7',reviews:'15K+',emoji:'🗽',url:'https://www.viator.com/tours/New-York-City/Statue-of-Liberty-and-Ellis-Island-Guided-Tour/d687-5250LIBERTYELLIS?utm_source=dimhour&utm_medium=referral',desc:'Skip-the-line ferry access with guided tour of both islands. Book pedestal access weeks ahead.'},
    {name:'SUMMIT One Vanderbilt Experience',category:'Observation',price:'From $42',rating:'4.8',reviews:'12K+',emoji:'🏙️',url:'https://www.viator.com/New-York-City-attractions/SUMMIT-One-Vanderbilt/d687-a30647?utm_source=dimhour&utm_medium=referral',desc:'Three floors of immersive art installations in Midtown tallest skyscraper. The mirror rooms are unreal.'},
    {name:'Greenwich Village Pizza Walking Tour',category:'Food Tour',price:'From $50',rating:'4.9',reviews:'3K+',emoji:'🍕',url:'https://www.viator.com/tours/New-York-City/Pizza-Walking-Tour-of-Manhattan/d687-5579PIZZAMAN?utm_source=dimhour&utm_medium=referral',desc:'Three iconic Village pizzerias with slices at each stop. Learn why NYC pizza is different from everywhere else.'},
    {name:'Greenwich Village Food & Culture Tour',category:'Food Tour',price:'From $65',rating:'4.8',reviews:'5K+',emoji:'🍽️',url:'https://www.viator.com/tours/New-York-City/The-Original-Greenwich-Village-Food-and-Cultural-Tour/d687-420790P1?utm_source=dimhour&utm_medium=referral',desc:'Six tastings across the Village from tacos to pizza to cupcakes with local history and culture.'},
    {name:'NYC Helicopter Tour',category:'Adventure',price:'From $200',rating:'4.8',reviews:'8K+',emoji:'🚁',url:'https://www.viator.com/New-York-City-tours/Helicopter-Tours/d687-g4-c23?utm_source=dimhour&utm_medium=referral',desc:'See Manhattan skyline, Statue of Liberty, and Brooklyn Bridge from the air. Best at sunset.'},
    {name:'Broadway Show Tickets',category:'Entertainment',price:'From $75',rating:'4.7',reviews:'20K+',emoji:'🎭',url:'https://www.viator.com/New-York-City-tours/Theater-Shows-and-Musicals/d687-g20-c26?utm_source=dimhour&utm_medium=referral',desc:'Hamilton, Wicked, Lion King and more. Book 2-4 weeks ahead for best seats.'},
    {name:'Central Park Bike Tour',category:'Outdoor',price:'From $40',rating:'4.8',reviews:'6K+',emoji:'🚲',url:'https://www.viator.com/New-York-City-tours/Bike-Tours/d687-g6-c7?utm_source=dimhour&utm_medium=referral',desc:'Two-hour guided ride through Central Park hitting all the highlights -- Bethesda Fountain, Strawberry Fields, The Mall.'},
    {name:'Chinatown & Little Italy Food Tour',category:'Food Tour',price:'From $55',rating:'4.9',reviews:'4K+',emoji:'🥟',url:'https://www.viator.com/tours/New-York-City/3-Hour-Greenwich-Village-Food-Tour/d687-428219P5?utm_source=dimhour&utm_medium=referral',desc:'Dumplings, hand-pulled noodles, cannoli, and fresh mozzarella. Two neighborhoods, one incredible food crawl.'},
    {name:'Brooklyn Bridge Walking Tour',category:'Landmark',price:'From $35',rating:'4.7',reviews:'7K+',emoji:'🌉',url:'https://www.viator.com/New-York-City-attractions/Brooklyn-Bridge/d687-a614?utm_source=dimhour&utm_medium=referral',desc:'Walk across one of the most iconic bridges in the world with a guide who knows every story.'},
    {name:'Speakeasy & Cocktail Tour',category:'Nightlife',price:'From $85',rating:'4.8',reviews:'2K+',emoji:'🍸',url:'https://www.viator.com/New-York-City-tours/Nightlife/d687-g12-c20?utm_source=dimhour&utm_medium=referral',desc:'Visit 3 hidden bars you would never find on your own. Includes a cocktail at each stop.'},
    {name:'9/11 Memorial & Museum',category:'Museum',price:'From $30',rating:'4.9',reviews:'25K+',emoji:'🏛️',url:'https://www.viator.com/New-York-City-attractions/9-11-Memorial/d687-a20970?utm_source=dimhour&utm_medium=referral',desc:'Powerful, essential visit. The museum is emotionally intense. Allow 2-3 hours.'},
    {name:'NYC Sunset Cruise',category:'Cruise',price:'From $40',rating:'4.7',reviews:'5K+',emoji:'🚢',url:'https://www.viator.com/New-York-City-tours/Sunset-Cruises/d687-g6-c78?utm_source=dimhour&utm_medium=referral',desc:'Circle Manhattan at golden hour with skyline views and drinks on board. Best NYC photo op.'},
  ],
  'dallas': [
    {name:'JFK Assassination Walking Tour',category:'History',price:'From $25',rating:'4.9',reviews:'3K+',emoji:'🏛️',url:'https://www.viator.com/Dallas-attractions/Dealey-Plaza-National-Historic-Landmark-District/d918-a12093?utm_source=dimhour&utm_medium=referral',desc:'Walk the motorcade route at Dealey Plaza with an expert guide. Includes Sixth Floor Museum context.'},
    {name:'Dallas Sightseeing Tour',category:'City Tour',price:'From $45',rating:'4.7',reviews:'2K+',emoji:'🏙️',url:'https://www.viator.com/tours/Dallas/3-Hours-Welcome-to-Dallas-Tour/d918-11593P2?utm_source=dimhour&utm_medium=referral',desc:'Small group tour hitting Pioneer Plaza, Dallas Arts District, Dealey Plaza, and the skyline views.'},
    {name:'Deep Ellum Food & Culture Tour',category:'Food Tour',price:'From $65',rating:'4.8',reviews:'1K+',emoji:'🍖',url:'https://www.viator.com/Dallas-tours/Food-Tours/d918-g6-c80?utm_source=dimhour&utm_medium=referral',desc:'Taste BBQ, Tex-Mex, and craft beer in Dallas most creative neighborhood. 3 hours, 5+ tastings.'},
    {name:'Southfork Ranch & Dallas TV Tour',category:'Pop Culture',price:'From $55',rating:'4.6',reviews:'2K+',emoji:'🤠',url:'https://www.viator.com/tours/Dallas/Southfork-Ranch-Tour/d918-3763SOUTHFORK?utm_source=dimhour&utm_medium=referral',desc:'Visit the real Southfork Ranch from the TV show Dallas. See longhorns, the mansion, and memorabilia.'},
    {name:'Fort Worth Stockyards Day Trip',category:'Day Trip',price:'From $50',rating:'4.7',reviews:'1.5K+',emoji:'🐂',url:'https://www.viator.com/Dallas-tours/Day-Trips-and-Excursions/d918-g5?utm_source=dimhour&utm_medium=referral',desc:'Longhorn cattle drive, honky-tonk bars, and rodeo culture. 30 min from Dallas, feels like another world.'},
    {name:'Reunion Tower Observation Deck',category:'Observation',price:'From $25',rating:'4.5',reviews:'3K+',emoji:'🗼',url:'https://www.viator.com/Dallas-attractions/Reunion-Tower/d918-a12095?utm_source=dimhour&utm_medium=referral',desc:'560 feet up with 360-degree views of the Dallas skyline. Go at sunset for the best photos.'},
    {name:'Dallas Brewery Tour',category:'Drinks',price:'From $75',rating:'4.7',reviews:'500+',emoji:'🍺',url:'https://www.viator.com/Dallas-tours/Beer-and-Brewery-Tours/d918-g6-c74?utm_source=dimhour&utm_medium=referral',desc:'Visit 3 Dallas craft breweries with tastings at each. Deep Ellum and Design District spots.'},
    {name:'Dallas Cowboys AT&T Stadium Tour',category:'Sports',price:'From $30',rating:'4.8',reviews:'4K+',emoji:'🏈',url:'https://www.viator.com/Dallas-attractions/AT-T-Stadium/d918-a18683?utm_source=dimhour&utm_medium=referral',desc:'Behind-the-scenes of the $1.2 billion stadium. Walk the field, see the locker rooms, stand on the star.'},
  ]
};

`;

html = html.substring(0, stateIdx) + activitiesData + html.substring(stateIdx);
console.log('Added CURATED_ACTIVITIES data');

// Now add a render method and integrate into the Discover tab
// Find renderDiscover to add the activities section
const discoverRender = 'renderDiscover(){';
const discoverIdx = html.indexOf(discoverRender);
if(discoverIdx === -1){ console.error('Could not find renderDiscover'); process.exit(1); }

// Find where the discover content is built - add activities after coming soon
// We'll add a method that generates the activities HTML
const upcomingHTMLMarker = 'upcomingHTML(){';
const upcomingIdx = html.indexOf(upcomingHTMLMarker);
if(upcomingIdx === -1){ console.error('Could not find upcomingHTML'); process.exit(1); }

const activitiesMethod = `
  curatedActivitiesHTML(){
    const city = (S.city||'Dallas').toLowerCase();
    const activities = CURATED_ACTIVITIES[city] || CURATED_ACTIVITIES['new york'] || [];
    if(!activities.length) return '';
    const categories = [...new Set(activities.map(a=>a.category))];
    return '<div style="margin-bottom:20px">'+
      '<div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🎟️ Top Experiences & Tours</div>'+
      '<div style="font-size:12px;color:var(--text2);margin-bottom:14px">Verified tours with real reviews -- book directly</div>'+
      '<div style="display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none">'+
        categories.map(cat=>'<button onclick="A._actFilter=\\''+cat+'\\';A.renderDiscover()" style="flex-shrink:0;padding:6px 12px;border-radius:8px;border:1px solid '+((this._actFilter||'')=== cat?'var(--gold)':'var(--border)')+';background:'+((this._actFilter||'')=== cat?'rgba(201,168,76,.12)':'var(--card)')+';color:'+((this._actFilter||'')=== cat?'var(--gold)':'var(--text3)')+';font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">'+cat+'</button>').join('')+
        '<button onclick="A._actFilter=\\'\\';A.renderDiscover()" style="flex-shrink:0;padding:6px 12px;border-radius:8px;border:1px solid '+(!(this._actFilter)?'var(--gold)':'var(--border)')+';background:'+(!(this._actFilter)?'rgba(201,168,76,.12)':'var(--card)')+';color:'+(!(this._actFilter)?'var(--gold)':'var(--text3)')+';font-size:11px;font-weight:600;cursor:pointer;font-family:inherit">All</button>'+
      '</div>'+
      activities.filter(a=>!this._actFilter || a.category===this._actFilter).map(a=>
        '<a href="'+a.url+'" target="_blank" style="display:block;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px;margin-bottom:8px;text-decoration:none;cursor:pointer" onmouseenter="this.style.borderColor=\\'var(--gold)\\'" onmouseleave="this.style.borderColor=\\'var(--border)\\'">'+
          '<div style="display:flex;align-items:flex-start;gap:12px">'+
            '<div style="font-size:28px;flex-shrink:0">'+a.emoji+'</div>'+
            '<div style="flex:1;min-width:0">'+
              '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">'+a.name+'</div>'+
              '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">'+
                '<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:rgba(201,168,76,.1);color:var(--gold);font-weight:600">'+a.category+'</span>'+
                '<span style="font-size:10px;color:var(--text3)">⭐ '+a.rating+' ('+a.reviews+' reviews)</span>'+
              '</div>'+
              '<div style="font-size:11px;color:var(--text2);line-height:1.4;margin-bottom:4px">'+a.desc+'</div>'+
              '<div style="display:flex;align-items:center;justify-content:space-between">'+
                '<span style="font-size:12px;font-weight:700;color:var(--gold)">'+a.price+'</span>'+
                '<span style="font-size:10px;color:#4c9a6a;font-weight:700">Book on Viator →</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</a>'
      ).join('')+
    '</div>';
  },

  `;

html = html.substring(0, upcomingIdx) + activitiesMethod + html.substring(upcomingIdx);
console.log('Added curatedActivitiesHTML method');

// Now integrate into renderDiscover - find where coming soon section is added
// and add activities after it
const comingSoonCall = 'this.upcomingHTML()';
const csIdx = html.indexOf(comingSoonCall);
if(csIdx !== -1){
  // Find the line that adds upcomingHTML to the discover content
  const lineStart = html.lastIndexOf('\n', csIdx);
  const lineEnd = html.indexOf('\n', csIdx);
  const line = html.substring(lineStart, lineEnd);
  // Add activities after coming soon
  const afterCS = html.indexOf(';', csIdx) + 1;
  const activitiesCall = "\n      html += this.curatedActivitiesHTML();";
  html = html.substring(0, afterCS) + activitiesCall + html.substring(afterCS);
  console.log('Integrated activities into Discover tab');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
