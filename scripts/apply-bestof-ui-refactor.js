// One-shot atomic refactor applied on top of current index.html.
// Re-applies the Austin CITY_COORDS + Quick Pick by Vibe + hotel-nearby
// compactRowHTML changes that were reverted by a concurrent OneDrive-sync
// commit, and folds Dallas + New York into the shared _bestOfCityLists()
// pipeline so all Best Of surfaces use compactRowHTML.
//
// Safe to re-run (each replacement no-ops if the new form is already in place).

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'index.html');
let src = fs.readFileSync(FILE, 'utf8');
const before = src;
const changes = [];

function replace(label, needle, replacement) {
  if (src.indexOf(needle) === -1) {
    if (src.indexOf(replacement) !== -1) {
      changes.push(`- ${label}: already applied`);
      return;
    }
    throw new Error(`Could not find needle for: ${label}`);
  }
  if (src.split(needle).length - 1 > 1) {
    throw new Error(`Non-unique needle for: ${label}`);
  }
  src = src.replace(needle, replacement);
  changes.push(`+ ${label}: applied`);
}

// 1. Austin CITY_COORDS
replace(
  'Austin CITY_COORDS',
  `  'Dallas':[32.7767,-96.7970],'Houston':[29.7604,-95.3698],
  'New York':[40.7128,-74.0060],'Boston':[42.3601,-71.0589],'Philadelphia':[39.9526,-75.1652],`,
  `  'Dallas':[32.7767,-96.7970],'Houston':[29.7604,-95.3698],'Austin':[30.2672,-97.7431],
  'New York':[40.7128,-74.0060],'Boston':[42.3601,-71.0589],'Philadelphia':[39.9526,-75.1652],`
);

// 2. Quick Pick by Vibe -- per-city, dynamic name lookup
replace(
  'Quick Pick by Vibe per-city',
  `    let html = \`
      <div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:2px">🏨 \${city} Hotel Guide</div>
        <div style="font-size:12px;color:var(--text2)">\${hotels.length} curated picks · every budget</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px">
        <div class="u-eyebrow">Quick Pick by Vibe</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
          <div onclick="A.openHotel((S.city||'Dallas')==='New York'?1:(S.city==='Chicago'?1:(S.city==='Houston'?1:12)))" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">💍</div><div style="font-size:11px;font-weight:700;color:var(--text)">For a Proposal</div><div style="font-size:10px;color:var(--gold)">\${(S.city||'Dallas')==='New York'?'Aman New York':'Hotel St. Germain'}</div></div>
          <div onclick="A.openHotel((S.city||'Dallas')==='New York'?2:(S.city==='Chicago'?1:(S.city==='Houston'?1:1)))" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">👑</div><div style="font-size:11px;font-weight:700;color:var(--text)">Best Overall</div><div style="font-size:10px;color:var(--gold)">\${(S.city||'Dallas')==='New York'?'The Plaza':'Rosewood Mansion'}</div></div>
          <div onclick="A.openHotel((S.city||'Dallas')==='New York'?8:(S.city==='Chicago'?4:(S.city==='Houston'?3:5)))" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Cool Factor</div><div style="font-size:10px;color:var(--gold)">\${(S.city||'Dallas')==='New York'?'The Bowery Hotel':'The Joule'}</div></div>
          <div onclick="A.openHotel(13)" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">🌿</div><div style="font-size:11px;font-weight:700;color:var(--text)">Neighborhood Feel</div><div style="font-size:10px;color:var(--gold)">The Beeman</div></div>
        </div>
      </div>\`;`,
  `    const vibePicksByCity = {
      'New York':       {proposal:1,  overall:2, cool:8,  neighborhood:5},
      'Dallas':         {proposal:12, overall:1, cool:5,  neighborhood:13},
      'Chicago':        {proposal:1,  overall:6, cool:3,  neighborhood:7},
      'Houston':        {proposal:2,  overall:1, cool:3,  neighborhood:4},
      'Austin':         {proposal:7,  overall:6, cool:3,  neighborhood:15},
      'Los Angeles':    {proposal:2,  overall:1, cool:3,  neighborhood:4},
      'Las Vegas':      {proposal:3,  overall:1, cool:11, neighborhood:14},
      'Seattle':        {proposal:2,  overall:4, cool:3,  neighborhood:1},
      'Salt Lake City': {proposal:6,  overall:1, cool:3,  neighborhood:7},
    };
    const picks = vibePicksByCity[city] || vibePicksByCity['Dallas'];
    const pickName = (id, fallbackIdx) => (hotels.find(h=>h.id===id)?.name) || hotels[fallbackIdx]?.name || hotels[0]?.name || '';
    const proposalId = hotels.find(h=>h.id===picks.proposal) ? picks.proposal : hotels[0].id;
    const overallId  = hotels.find(h=>h.id===picks.overall)  ? picks.overall  : hotels[0].id;
    const coolId     = hotels.find(h=>h.id===picks.cool)     ? picks.cool     : (hotels[2]||hotels[0]).id;
    const nbhdId     = hotels.find(h=>h.id===picks.neighborhood) ? picks.neighborhood : (hotels[hotels.length-1]||hotels[0]).id;
    let html = \`
      <div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:2px">🏨 \${city} Hotel Guide</div>
        <div style="font-size:12px;color:var(--text2)">\${hotels.length} curated picks · every budget</div>
      </div>
      <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:16px">
        <div class="u-eyebrow">Quick Pick by Vibe</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
          <div onclick="A.openHotel(\${proposalId})" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">💍</div><div style="font-size:11px;font-weight:700;color:var(--text)">For a Proposal</div><div style="font-size:10px;color:var(--gold)">\${pickName(proposalId, 0)}</div></div>
          <div onclick="A.openHotel(\${overallId})" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">👑</div><div style="font-size:11px;font-weight:700;color:var(--text)">Best Overall</div><div style="font-size:10px;color:var(--gold)">\${pickName(overallId, 0)}</div></div>
          <div onclick="A.openHotel(\${coolId})" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Cool Factor</div><div style="font-size:10px;color:var(--gold)">\${pickName(coolId, 2)}</div></div>
          <div onclick="A.openHotel(\${nbhdId})" style="background:var(--card2);border:1.5px solid var(--gold);border-radius:10px;padding:9px;cursor:pointer;touch-action:manipulation;text-align:center"><div style="font-size:16px;margin-bottom:2px">🌿</div><div style="font-size:11px;font-weight:700;color:var(--text)">Neighborhood Feel</div><div style="font-size:10px;color:var(--gold)">\${pickName(nbhdId, hotels.length-1)}</div></div>
        </div>
      </div>\`;`
);

// 3. Hotel detail: Restaurants Nearby in Guide -- use compactRowHTML
replace(
  'Hotel nearby restaurants compactRowHTML',
  `      \${nearbyRests.length?\`
        <div style="margin-bottom:14px">
          <div class="u-eyebrow">Restaurants Nearby in Guide</div>
          \${nearbyRests.map(r=>'<div onclick="A.openDetail('+r.id+')" style="display:flex;align-items:center;justify-content:space-between;background:var(--card);border:1px solid var(--gold);border-radius:10px;padding:10px;margin-bottom:6px;cursor:pointer;touch-action:manipulation"><div><div style="font-size:13px;font-weight:700;color:var(--text)">'+r.name+'</div><div style="font-size:11px;color:var(--text2)">'+r.cuisine+' · '+r.neighborhood+'</div></div><div style="font-size:18px;font-weight:700;color:var(--gold)">'+r.score+'</div></div>').join('')}
        </div>\`:''
      }`,
  `      \${nearbyRests.length?\`
        <div style="margin-bottom:14px">
          <div class="u-eyebrow">Restaurants Nearby in Guide</div>
          \${nearbyRests.map((r,i)=>A.compactRowHTML(r, i+1)).join('')}
        </div>\`:''
      }`
);

// 4. bestOfCityHTML: remove inline Dallas fallback + NYC special-case
replace(
  'bestOfCityHTML simplify',
  `  bestOfCityHTML(){
    const city = S.city||'Dallas';
    if(city==='New York') return this.bestOfNYCHTML();
    const cityLists = this._bestOfCityLists()[city];
    if(cityLists) return this._renderBestOfLists(city, cityLists);
    const lists = [
      { title: 'Best Espresso Martini', emoji: '☕🍸', spots: [
        { name: 'The Charlotte', note: 'Dallas Observer 2025 winner -- frozen tequila espresso with cold foam' },
        { name: 'Fachini', note: 'Frothy, perfectly balanced -- the bar scene is electric' },
        { name: 'Catbird', note: 'Nitro espresso martini -- rooftop views at Thompson Hotel' },
        { name: 'Hudson House', note: 'Half-price ($7) during HH Mon-Fri 3-6PM' },
        { name: 'Bowen House', note: 'Swap vodka for tequila -- the bartender special' },
        { name: 'Frenchie', note: 'Frozen -- Ketel One, Baileys, Licor 43, cold brew' },
      ]},
      { title: 'Best Spicy Rigatoni / Vodka Pasta', emoji: '🍝🔥', spots: [
        { name: 'Carbone', note: 'THE Spicy Rigatoni Vodka -- the dish Dallas lines up for' },
        { name: 'Fachini', note: 'Rigatoni alla Vodka with Meatball -- handmade pasta program' },
        { name: 'il Bracco', note: 'Spicy Gemelli -- Preston Center staple' },
        { name: 'Nonna', note: 'Sunday Gravy pappardelle -- Bib Gourmand, Bishop Arts' },
        { name: 'The Charles', note: 'Spicy Creste Di Gallo -- Italian through a Texas lens' },
        { name: 'Lucia', note: 'Pork Sugo Pappardelle -- changes daily, always incredible' },
      ]},
      { title: 'Best Margarita', emoji: '🍹🧂', spots: [
        { name: 'Mi Cocina', note: 'Mambo Taxi -- THE Dallas margarita. A legend.' },
        { name: 'The Charlotte', note: 'Frozen mangonada, midnight hibiscus, blood orange margs' },
        { name: 'Revolver Taco Lounge', note: 'Liquarita ($45) -- 24oz with chamoy, sea salt, chile' },
        { name: 'Odelay Tex-Mex', note: 'Cadillac Moon -- Tres Generaciones, Grand Marnier, citrus' },
        { name: 'Las Palmas', note: '$6 Happy Hour Margarita -- Uptown patio institution' },
        { name: 'Te Deseo', note: 'Spicy Paloma + Te Deseo Margarita -- Day of the Dead vibes' },
      ]},
      { title: 'Best Burger', emoji: '🍔', spots: [
        { name: 'Burger Schmurger', note: 'Lakewood smash burger legend -- score 93, best burger in Dallas' },
        { name: 'Goodwin\\'s', note: 'D Magazine best burger -- chuck, brisket, short rib on cast iron' },
        { name: 'GoodFriend Beer Garden & Burger House', note: 'M Streets staple -- craft beer + legendary burgers' },
        { name: 'Son of a Butcher', note: 'Deep Ellum smashburger with a cult following' },
        { name: 'Rodeo Goat', note: 'Laredo (green chili, pepper jack) + 100 craft beers' },
        { name: 'Village Burger Bar', note: 'Park Cities gourmet burgers -- local favorite' },
      ]},
      { title: 'Best Pizza', emoji: '🍕', spots: [
        { name: 'Mister O1 Extraordinary Pizza', note: 'Score 91 -- Oak Lawn, extraordinary Neapolitan pies' },
        { name: 'Olivella\\'s Pizza and Wine', note: 'Lakewood gem -- authentic Neapolitan, great wine list' },
        { name: 'Partenope Ristorante', note: 'D Magazine #1 -- Naples-born pizzaiolo, best Neapolitan in TX' },
        { name: 'Cane Rosso', note: 'Neapolitan certified, wood-fired 900F. Honey Bastard is iconic' },
        { name: 'Zalat Pizza', note: 'Open until 2AM -- creative pies, Dallas original' },
        { name: 'Serious Pizza Deep Ellum', note: 'Massive slices, late-night Deep Ellum institution' },
      ]},
      { title: 'Best Tacos', emoji: '🌮', spots: [
        { name: 'Revolver Taco Lounge', note: 'Texas Monthly #4 -- pulpo al pastor, chef-driven Deep Ellum' },
        { name: 'Fuel City Tacos', note: '24/7, $2 tacos, gas station icon -- pilgrimage-worthy' },
        { name: 'El Carlos Elegante', note: 'Trinity Groves upscale Mexican -- score 91' },
        { name: 'Resident Taqueria', note: 'Critics pick -- redefining what a taco can be' },
        { name: 'Ruins', note: 'Oaxacan-inspired, Deep Ellum -- mezcal + elevated tacos' },
      ]},
      { title: 'Best Steak', emoji: '🥩', spots: [
        { name: 'Pappas Bros. Steakhouse', note: 'Dry-aged prime -- the gold standard in Dallas' },
        { name: 'Tango Room', note: 'Design District steakhouse + cocktail bar -- score 92' },
        { name: 'Chamberlain\\'s Steak and Fish', note: 'Addison institution -- classic fine dining, score 92' },
        { name: 'Knife Italian', note: 'John Tesar\\'s dry-aged program -- 240-day aged cuts' },
        { name: 'Al Biernat\\'s', note: 'Power lunch, celebrity sightings, impeccable service' },
        { name: 'Nick & Sam\\'s Steakhouse', note: 'Classic Dallas steakhouse -- live piano bar' },
      ]},
      { title: 'Best Brunch', emoji: '🥂', spots: [
        { name: 'Encina', note: 'Dallas Observer #1 -- iconic blue corn butterscotch pancakes' },
        { name: 'Breadwinners Cafe & Bakery', note: 'Birthplace of Dallas brunch -- Highland Park patio' },
        { name: 'The Charlotte', note: 'Dallas Observer pick -- new Knox-Henderson brunch standout' },
        { name: 'Ziziki\\'s', note: '$45 Champagne brunch -- Mediterranean twist, Knox-Henderson' },
        { name: 'Al Biernat\\'s', note: 'OpenTable Top 100 Brunch -- brioche French toast, chicken & waffles' },
      ]},
    ];

    return \`<div style="margin:20px 0 0;padding:0 0 20px">
      <div style="font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;padding:0 0 12px">🏆 Best Of \${S.city||'Dallas'}</div>
      \${lists.map(list=>\`
        <div style="margin-bottom:18px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">\${list.emoji} \${list.title}</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            \${list.spots.map((s,i)=>{
              const match=(()=>{const n=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');const sn=n(s.name);if(!sn)return null;const all=A.getRestaurants();return all.find(r=>n(r.name)===sn)||all.find(r=>{const rn=n(r.name);return rn && (rn.indexOf(sn)>-1 || sn.indexOf(rn)>-1)})||null})();
              const clickAttr=match?\`onclick="A.openDetail(\${match.id})" style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`:\`style="display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`;
              return \`<div \${clickAttr}>
                <div style="font-size:11px;font-weight:800;color:var(--gold);min-width:16px;margin-top:1px">\${i+1}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:700;color:var(--text)">\${s.name}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:1px">\${s.note}</div>
                </div>
                \${match?'<div style="font-size:11px;color:var(--text3);margin-top:2px;flex-shrink:0">›</div>':''}
              </div>\`;}).join('')}
          </div>
        </div>\`).join('')}
    </div>\`;
  },`,
  `  bestOfCityHTML(){
    const city = S.city||'Dallas';
    const cityLists = this._bestOfCityLists()[city];
    if(cityLists) return this._renderBestOfLists(city, cityLists);
    return \`<div style="margin:20px 0 0;padding:0 0 20px"><div style="font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;padding:0 0 12px">🏆 Best Of \${city}</div><div style="font-size:13px;color:var(--text2);padding:20px;text-align:center">Best Of guide coming soon for \${city}</div></div>\`;
  },`
);

// 5. Delete bestOfNYCHTML entirely
replace(
  'Delete bestOfNYCHTML',
  `  bestOfNYCHTML(){
    const lists = [
      { title: 'Best Pizza Slice', emoji: '🍕', spots: [
        { name: "L'Industrie Pizzeria", note: 'Williamsburg perfection -- burrata slice is legendary' },
        { name: 'Prince Street Pizza', note: 'The pepperoni square -- crispy cups of spicy goodness' },
        { name: "Joe's Pizza", note: 'The classic NYC slice -- thin, floppy, perfect fold' },
        { name: "Scarrs Pizza", note: 'LES -- hand-milled flour, old-school technique' },
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
              const match=(()=>{const n=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');const sn=n(s.name);if(!sn)return null;const all=A.getRestaurants();return all.find(r=>n(r.name)===sn)||all.find(r=>{const rn=n(r.name);return rn && (rn.indexOf(sn)>-1 || sn.indexOf(rn)>-1)})||null})();
              const clickAttr=match?\`onclick="A.openDetail(\${match.id})" style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`:\`style="display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`;
              return \`<div \${clickAttr}>
                <div style="font-size:11px;font-weight:800;color:var(--gold);min-width:16px;margin-top:1px">\${i+1}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:700;color:var(--text)">\${s.name}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:1px">\${s.note}</div>
                </div>
                \${match?'<div style="font-size:11px;color:var(--text3);margin-top:2px;flex-shrink:0">›</div>':''}
              </div>\`;}).join('')}
          </div>
        </div>\`).join('')}
    </div>\`;
  },

  expandResults(){`,
  `  expandResults(){`
);

// 6. Inject NYC + Dallas into _bestOfCityLists() (prepend before existing entries)
const NYC_DALLAS_LISTS = `      'New York': [
        { title: 'Best Pizza Slice', emoji: '🍕', spots: [
          { name: "L'Industrie Pizzeria", note: 'Williamsburg perfection -- burrata slice is legendary' },
          { name: 'Prince Street Pizza', note: 'The pepperoni square -- crispy cups of spicy goodness' },
          { name: "Joe's Pizza", note: 'The classic NYC slice -- thin, floppy, perfect fold' },
          { name: "Scarrs Pizza", note: 'LES -- hand-milled flour, old-school technique' },
          { name: "Mama's Too", note: 'UWS thick squares -- viral for a reason' },
          { name: 'Una Pizza Napoletana', note: '50 Top Pizza #1 in the world -- LES' },
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: 'Double Chicken Please', note: "World's 50 Best Bars -- LES innovation" },
          { name: 'Attaboy', note: 'No menu -- tell the bartender what you like' },
          { name: 'Death & Co', note: 'James Beard winner -- craft cocktail pioneer' },
          { name: 'Katana Kitten', note: 'Japanese highballs + shochu -- West Village' },
          { name: "Please Don't Tell", note: 'The OG speakeasy -- phone booth entrance through Crif Dogs' },
          { name: 'Existing Conditions', note: "Dave Arnold's cocktail lab -- clarified drinks, science" },
        ]},
        { title: 'Best Date Night', emoji: '💕', spots: [
          { name: 'Via Carota', note: 'West Village Italian -- the impossible reservation' },
          { name: 'One If By Land, Two If By Sea', note: 'Most romantic restaurant in NYC -- fireplace, carriage house' },
          { name: "Le Veau d'Or", note: 'Revived 1930s UES French bistro -- Frenchette team' },
          { name: 'Claud', note: 'Below-ground East Village wine bar -- chocolate cake is a must' },
          { name: 'The River Cafe', note: 'DUMBO waterfront -- Manhattan skyline views' },
          { name: 'Freemans', note: 'Hidden at the end of an alley on the LES' },
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: 'Clinton St. Baking Co.', note: 'The pancakes that started NYC brunch culture' },
          { name: 'Sunday in Brooklyn', note: 'Malted pancakes -- Williamsburg brunch destination' },
          { name: 'Balthazar', note: 'SoHo brasserie -- solo diners get champagne' },
          { name: 'Russ & Daughters Cafe', note: 'Smoked fish platters -- LES institution since 1914' },
          { name: 'Chez Ma Tante', note: "NYC's most Instagrammed pancakes -- Greenpoint" },
          { name: 'Win Son', note: "Taiwanese-American brunch -- fly's head, scallion pancakes" },
        ]},
        { title: 'Best Burger', emoji: '🍔', spots: [
          { name: 'Minetta Tavern', note: 'Black Label Burger -- dry-aged, the gold standard' },
          { name: 'Corner Bistro', note: 'West Village dive -- Bistro Burger, cash only' },
          { name: 'Hamburger America', note: "SoHo -- burger scholar George Motz's love letter" },
          { name: 'Red Hook Tavern', note: "Billy Durney's polished tavern burger" },
          { name: 'JG Melon', note: 'UES classic -- cottage cheese on the side' },
          { name: "P.J. Clarke's", note: 'Midtown institution since 1884 -- the Cadillac' },
        ]},
        { title: 'Best Late Night', emoji: '🌙', spots: [
          { name: 'Employees Only', note: 'West Village -- kitchen open until 3:30AM' },
          { name: "Lil' Frankie's", note: 'East Village Italian -- open until 2AM' },
          { name: 'Blue Ribbon Sushi', note: "SoHo -- chef's go-to after their shifts" },
          { name: 'The Odeon', note: 'Tribeca icon -- late night since 1980' },
          { name: 'Golden Diner', note: 'Chinatown -- egg sandwich available until 10PM' },
          { name: "Katz's Delicatessen", note: 'Open until 2:30AM Fri-Sat -- pastrami never sleeps' },
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
      ],
      'Dallas': [
        { title: 'Best Espresso Martini', emoji: '☕🍸', spots: [
          { name: 'The Charlotte', note: 'Dallas Observer 2025 winner -- frozen tequila espresso with cold foam' },
          { name: 'Fachini', note: 'Frothy, perfectly balanced -- the bar scene is electric' },
          { name: 'Catbird', note: 'Nitro espresso martini -- rooftop views at Thompson Hotel' },
          { name: 'Hudson House', note: 'Half-price ($7) during HH Mon-Fri 3-6PM' },
          { name: 'Bowen House', note: 'Swap vodka for tequila -- the bartender special' },
          { name: 'Frenchie', note: 'Frozen -- Ketel One, Baileys, Licor 43, cold brew' },
        ]},
        { title: 'Best Spicy Rigatoni / Vodka Pasta', emoji: '🍝🔥', spots: [
          { name: 'Carbone', note: 'THE Spicy Rigatoni Vodka -- the dish Dallas lines up for' },
          { name: 'Fachini', note: 'Rigatoni alla Vodka with Meatball -- handmade pasta program' },
          { name: 'il Bracco', note: 'Spicy Gemelli -- Preston Center staple' },
          { name: 'Nonna', note: 'Sunday Gravy pappardelle -- Bib Gourmand, Bishop Arts' },
          { name: 'The Charles', note: 'Spicy Creste Di Gallo -- Italian through a Texas lens' },
          { name: 'Lucia', note: 'Pork Sugo Pappardelle -- changes daily, always incredible' },
        ]},
        { title: 'Best Margarita', emoji: '🍹🧂', spots: [
          { name: 'Mi Cocina', note: 'Mambo Taxi -- THE Dallas margarita. A legend.' },
          { name: 'The Charlotte', note: 'Frozen mangonada, midnight hibiscus, blood orange margs' },
          { name: 'Revolver Taco Lounge', note: 'Liquarita ($45) -- 24oz with chamoy, sea salt, chile' },
          { name: 'Odelay Tex-Mex', note: 'Cadillac Moon -- Tres Generaciones, Grand Marnier, citrus' },
          { name: 'Las Palmas', note: '$6 Happy Hour Margarita -- Uptown patio institution' },
          { name: 'Te Deseo', note: 'Spicy Paloma + Te Deseo Margarita -- Day of the Dead vibes' },
        ]},
        { title: 'Best Burger', emoji: '🍔', spots: [
          { name: 'Burger Schmurger', note: 'Lakewood smash burger legend -- score 93, best burger in Dallas' },
          { name: "Goodwin's", note: 'D Magazine best burger -- chuck, brisket, short rib on cast iron' },
          { name: 'GoodFriend Beer Garden & Burger House', note: 'M Streets staple -- craft beer + legendary burgers' },
          { name: 'Son of a Butcher', note: 'Deep Ellum smashburger with a cult following' },
          { name: 'Rodeo Goat', note: 'Laredo (green chili, pepper jack) + 100 craft beers' },
          { name: 'Village Burger Bar', note: 'Park Cities gourmet burgers -- local favorite' },
        ]},
        { title: 'Best Pizza', emoji: '🍕', spots: [
          { name: 'Mister O1 Extraordinary Pizza', note: 'Score 91 -- Oak Lawn, extraordinary Neapolitan pies' },
          { name: "Olivella's Pizza and Wine", note: 'Lakewood gem -- authentic Neapolitan, great wine list' },
          { name: 'Partenope Ristorante', note: 'D Magazine #1 -- Naples-born pizzaiolo, best Neapolitan in TX' },
          { name: 'Cane Rosso', note: 'Neapolitan certified, wood-fired 900F. Honey Bastard is iconic' },
          { name: 'Zalat Pizza', note: 'Open until 2AM -- creative pies, Dallas original' },
          { name: 'Serious Pizza Deep Ellum', note: 'Massive slices, late-night Deep Ellum institution' },
        ]},
        { title: 'Best Tacos', emoji: '🌮', spots: [
          { name: 'Revolver Taco Lounge', note: 'Texas Monthly #4 -- pulpo al pastor, chef-driven Deep Ellum' },
          { name: 'Fuel City Tacos', note: '24/7, $2 tacos, gas station icon -- pilgrimage-worthy' },
          { name: 'El Carlos Elegante', note: 'Trinity Groves upscale Mexican -- score 91' },
          { name: 'Resident Taqueria', note: 'Critics pick -- redefining what a taco can be' },
          { name: 'Ruins', note: 'Oaxacan-inspired, Deep Ellum -- mezcal + elevated tacos' },
        ]},
        { title: 'Best Steak', emoji: '🥩', spots: [
          { name: 'Pappas Bros. Steakhouse', note: 'Dry-aged prime -- the gold standard in Dallas' },
          { name: 'Tango Room', note: 'Design District steakhouse + cocktail bar -- score 92' },
          { name: "Chamberlain's Steak and Fish", note: 'Addison institution -- classic fine dining, score 92' },
          { name: 'Knife Italian', note: "John Tesar's dry-aged program -- 240-day aged cuts" },
          { name: "Al Biernat's", note: 'Power lunch, celebrity sightings, impeccable service' },
          { name: "Nick & Sam's Steakhouse", note: 'Classic Dallas steakhouse -- live piano bar' },
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: 'Encina', note: 'Dallas Observer #1 -- iconic blue corn butterscotch pancakes' },
          { name: 'Breadwinners Cafe & Bakery', note: 'Birthplace of Dallas brunch -- Highland Park patio' },
          { name: 'The Charlotte', note: 'Dallas Observer pick -- new Knox-Henderson brunch standout' },
          { name: "Ziziki's", note: '$45 Champagne brunch -- Mediterranean twist, Knox-Henderson' },
          { name: "Al Biernat's", note: 'OpenTable Top 100 Brunch -- brioche French toast, chicken & waffles' },
        ]},
      ],
`;

const listsAnchor = `  _bestOfCityLists(){
    return {
      'Las Vegas': [`;
const listsAnchorNew = `  _bestOfCityLists(){
    return {
${NYC_DALLAS_LISTS}      'Las Vegas': [`;

if (src.indexOf(listsAnchor) !== -1) {
  src = src.replace(listsAnchor, listsAnchorNew);
  changes.push(`+ Inject NYC + Dallas into _bestOfCityLists: applied`);
} else if (src.indexOf(`      'New York': [
        { title: 'Best Pizza Slice', emoji: '🍕'`) !== -1) {
  changes.push(`- Inject NYC + Dallas into _bestOfCityLists: already applied`);
} else {
  throw new Error('Could not find _bestOfCityLists() anchor');
}

if (src === before) {
  console.log('No changes needed — file already reflects target state.');
} else {
  fs.writeFileSync(FILE, src, 'utf8');
  console.log('Wrote', FILE);
}
changes.forEach(c => console.log(c));
