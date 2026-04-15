// Add Coming Soon data for Austin, Houston, SLC
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find insertion point - right before the non-Dallas catch-all
const catchAll = html.indexOf("if((S.city||'Dallas')!=='Dallas'){");
if (catchAll === -1) { console.error('Catch-all not found!'); process.exit(1); }

// Build Coming Soon blocks for each city
const austinCS = `
    if((S.city||'Dallas')==='Austin'){
      const austinItems = [
        {name:"Uchi Salt Lake City",hood:"Downtown SLC",address:"TBD Downtown",eta:"2026",cuisine:"Japanese / Sushi",desc:"Tyson Cole acclaimed Japanese restaurant expanding to Salt Lake City. Expected to bring the same creative sushi and Japanese-inspired cuisine that made the Austin original a national sensation.",group:"Hai Hospitality",ig:"@uchirestaurants"},
        {name:"The Mackenzie Club",hood:"Downtown",address:"TBD Downtown Austin",eta:"2026",cuisine:"Members Club / Restaurant",desc:"Private members club and restaurant coming to downtown Austin with fine dining, cocktails, and social programming.",group:"Independent",ig:""},
        {name:"Local Foods Austin",hood:"North Lamar",address:"3800 N Lamar Blvd, Austin",eta:"Late Spring 2026",cuisine:"Farm-Focused Casual",desc:"Houston-based farm-focused restaurant expanding to Austin. Fresh sandwiches, salads, and seasonal plates with beer and wine. Founded by Martin Berson of Snap Kitchen.",group:"Local Foods",ig:"@localfoods"},
        {name:"Lenoir Wine Bar",hood:"South 1st",address:"1805 S 1st St, Austin",eta:"Spring 2026",cuisine:"Spanish Wine Bar",desc:"From Todd Duplechan and Jessica Maher of Lenoir. A neighbourhood bar serving Spanish drinks and bites on South 1st Street.",group:"Lenoir",ig:"@lenoiratx"},
        {name:"East Austin Oyster House",hood:"East Austin",address:"2502 E Cesar Chavez St, Austin",eta:"Early 2026",cuisine:"Seafood / Oyster Bar",desc:"East Coast oysters from Maine, chilled martinis, and raw bar selections in a coastal-inspired East Austin setting.",group:"Independent",ig:""}
      ];
      window._csItems = austinItems;
      return \`<div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🔮 Coming Soon to Austin</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px">Verified upcoming openings</div>
      </div>
      \${austinItems.map((r,i)=>\`<div style="background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-size:15px;font-weight:800;color:var(--text)">\${r.name}</div>
            <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:2px">\${r.hood} · \${r.cuisine}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:4px">\${r.desc}</div>
          </div>
          <div style="flex-shrink:0;margin-left:10px;text-align:right">
            <div style="font-size:10px;color:var(--gold);font-weight:700;background:rgba(201,168,76,.15);padding:3px 8px;border-radius:8px">\${r.eta}</div>
          </div>
        </div>
      </div>\`).join('')}\`;
    }
`;

const houstonCS = `
    if((S.city||'Dallas')==='Houston'){
      const houstonItems = [
        {name:"Carlo",hood:"Montrose",address:"TBD Montrose",eta:"2026",cuisine:"Fast-Casual Italian",desc:"Charles Clark bringing a fast-casual Italian concept to Montrose with handmade pastas at accessible prices.",group:"Clark Hospitality",ig:""},
        {name:"Casa Carlo",hood:"Montrose",address:"TBD Montrose",eta:"2026",cuisine:"Italian Fine Dining",desc:"The fine-dining sister to Carlo, offering handmade pastas and seafood inspired by Southern Italy. From Charles Clark.",group:"Clark Hospitality",ig:""},
        {name:"Eastbound Barbecue",hood:"EaDo",address:"TBD EaDo",eta:"2026",cuisine:"Texas BBQ Fusion",desc:"Four Killen's Restaurant Group veterans bringing fusion-y riffs on Texas BBQ classics to EaDo. Creative takes on smoked meats.",group:"Independent",ig:""},
        {name:"Toga Izakaya",hood:"Harlow District",address:"Harlow District, Houston",eta:"Opened April 2026",cuisine:"Japanese Izakaya",desc:"NOW OPEN. New izakaya from Comma Hospitality focusing on grilled items and bar food paired with sake, Japanese beer, and cocktails.",group:"Comma Hospitality",ig:""},
        {name:"Exilio",hood:"Harlow District",address:"Harlow District, Houston",eta:"Opened 2026",cuisine:"Latin Fusion",desc:"NOW OPEN. A mashup of Latin flavors from Mexico, Central and South America, the Caribbean, and Spain in the Harlow District.",group:"Independent",ig:""},
        {name:"Taste of Gold by Simone Biles",hood:"IAH Airport",address:"George Bush Intercontinental Airport",eta:"Opened 2026",cuisine:"American",desc:"NOW OPEN. Olympic gymnast and Houston hometown hero Simone Biles debuts her first restaurant at IAH, inspired by her travels around the world.",group:"Independent",ig:"@simonebiles"}
      ];
      window._csItems = houstonItems;
      return \`<div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🔮 Coming Soon to Houston</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px">Verified upcoming openings</div>
      </div>
      \${houstonItems.map((r,i)=>\`<div style="background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-size:15px;font-weight:800;color:var(--text)">\${r.name}</div>
            <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:2px">\${r.hood} · \${r.cuisine}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:4px">\${r.desc}</div>
          </div>
          <div style="flex-shrink:0;margin-left:10px;text-align:right">
            <div style="font-size:10px;color:var(--gold);font-weight:700;background:rgba(201,168,76,.15);padding:3px 8px;border-radius:8px">\${r.eta}</div>
          </div>
        </div>
      </div>\`).join('')}\`;
    }
`;

const slcCS = `
    if((S.city||'Dallas')==='Salt Lake City'){
      const slcItems = [
        {name:"Uchi Salt Lake City",hood:"Downtown SLC",address:"TBD Downtown SLC",eta:"2026",cuisine:"Japanese / Sushi",desc:"Tyson Cole James Beard-winning Japanese restaurant expanding from Austin to SLC. Creative sushi and Japanese-inspired cuisine. One of Utah most anticipated openings.",group:"Hai Hospitality",ig:"@uchirestaurants"},
        {name:"Sweetgreen",hood:"Sugar House",address:"Sugar House, SLC",eta:"2026",cuisine:"Health-Focused Salads",desc:"The LA-based salad chain making its Utah debut in Sugar House. Seasonal salads, grain bowls, and warm plates with locally sourced ingredients.",group:"Sweetgreen",ig:"@sweetgreen"},
        {name:"Taste of Red Iguana Daybreak",hood:"Daybreak",address:"Daybreak, South Jordan",eta:"Spring 2026",cuisine:"Mexican",desc:"Casual version of one of SLC most storied Mexican restaurants opening a Daybreak outpost. Same award-winning moles and family recipes.",group:"Red Iguana",ig:"@rediguana"},
        {name:"Sushi by Bou Downtown",hood:"Downtown (Peery Hotel)",address:"Peery Hotel, Downtown SLC",eta:"Opened 2026",cuisine:"Japanese Omakase",desc:"NOW OPEN. New York-based omakase concept now open in Downtown SLC Peery Hotel. 12-seat counter with 30-minute omakase experiences.",group:"Sushi by Bou",ig:"@sushibybou"},
        {name:"The Brick",hood:"800 East",address:"800 East, SLC",eta:"Opened 2026",cuisine:"Spanish-Italian-Mexican-American",desc:"NOW OPEN. Menu influenced by Spanish, Italian, Mexican and American cuisines in a cozy 800 East setting.",group:"Independent",ig:""}
      ];
      window._csItems = slcItems;
      return \`<div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🔮 Coming Soon to Salt Lake City</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px">Verified upcoming openings</div>
      </div>
      \${slcItems.map((r,i)=>\`<div style="background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <div style="font-size:15px;font-weight:800;color:var(--text)">\${r.name}</div>
            <div style="font-size:11px;color:var(--gold);font-weight:600;margin-top:2px">\${r.hood} · \${r.cuisine}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:4px">\${r.desc}</div>
          </div>
          <div style="flex-shrink:0;margin-left:10px;text-align:right">
            <div style="font-size:10px;color:var(--gold);font-weight:700;background:rgba(201,168,76,.15);padding:3px 8px;border-radius:8px">\${r.eta}</div>
          </div>
        </div>
      </div>\`).join('')}\`;
    }
`;

// Insert all three blocks before the catch-all
const insertStr = austinCS + houstonCS + slcCS + '\n    ';
html = html.substring(0, catchAll) + insertStr + html.substring(catchAll);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added Coming Soon for Austin (5 items), Houston (6 items), SLC (5 items)');
console.log('Done!');
