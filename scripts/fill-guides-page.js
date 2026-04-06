const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Fix page header
html = html.replace(
  'font-size:16px;font-weight:800;color:var(--gold)">Activities & Guides</div>',
  'font-size:16px;font-weight:800;color:var(--gold)">Weekend Guides & Events</div>'
);
html = html.replace(
  'font-size:16px;font-weight:800;color:var(--gold)">📋 Weekend Guides & Events</div>',
  'font-size:16px;font-weight:800;color:var(--gold)">📋 Weekend Guides & Events</div>'
);
console.log('Fixed page header');

// 2. Add neighborhood spotlight, seasonal picks, and day trips
// Insert before the closing </div> of the openActivitiesPage template
// Try multiple line ending patterns
let insertIdx = html.indexOf('    </div>`;\n  },\n\n  _getWeekendGuide');
if(insertIdx === -1) insertIdx = html.indexOf('    </div>`;\r\n  },\r\n\r\n  _getWeekendGuide');
if(insertIdx === -1) insertIdx = html.indexOf('</div>`;\r\n  },\r\n  _getWeekendGuide');
if(insertIdx === -1) {
  // Find by proximity
  const gwIdx = html.indexOf('_getWeekendGuide');
  // Walk backwards to find the closing template literal
  let pos = gwIdx;
  while(pos > 0 && html.substring(pos-10, pos) !== '    </div>') pos--;
  if(pos > 0) insertIdx = pos - 4;
}
console.log('Insertion point:', insertIdx);
if(insertIdx === -1) {
  console.log('ERROR: Could not find insertion point');
  process.exit(1);
}

const newContent = `
      <!-- NEIGHBORHOOD SPOTLIGHT -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🏘️ Neighborhood Spotlight</div>
        <div style="font-size:11px;color:var(--text2);margin:-4px 0 12px">Where to eat, drink, and explore</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎸</div><div style="font-size:12px;font-weight:700;color:var(--text)">East Village</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Punk meets Michelin</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Death & Co, Veselka, Momofuku</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌿</div><div style="font-size:12px;font-weight:700;color:var(--text)">West Village</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Cobblestones & date nights</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Via Carota, Dante, Buvette</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎨</div><div style="font-size:12px;font-weight:700;color:var(--text)">Williamsburg</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Brooklyn dining capital</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Peter Luger, Lilia, Smorgasburg</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎵</div><div style="font-size:12px;font-weight:700;color:var(--text)">Lower East Side</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Late night & speakeasies</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Attaboy, Beauty & Essex, Wildair</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">👗</div><div style="font-size:12px;font-weight:700;color:var(--text)">SoHo</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Brunch & shopping</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Balthazar, The Dutch, Charlie Bird</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🥟</div><div style="font-size:12px;font-weight:700;color:var(--text)">Chinatown</div><div style="font-size:10px;color:var(--gold);margin-top:2px">$5 meals & hidden bars</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Nom Wah, Apotheke, Joe Shanghai</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎷</div><div style="font-size:12px;font-weight:700;color:var(--text)">Harlem</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Soul food & jazz</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Red Rooster, Melba, Sylvia</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🐻</div><div style="font-size:12px;font-weight:700;color:var(--text)">Bronx</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Real Little Italy</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Roberto, Mike Deli, Full Moon</div></div>
        </div>
      </div>

      <!-- SEASONAL PICKS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🗓️ Seasonal Picks</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">🌸 Spring (Mar-May)</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5">Cherry blossoms at Riverside Park · Outdoor dining opens citywide · Smorgasburg returns · Governors Island ferry starts · Rooftop season begins</div>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">☀️ Summer (Jun-Aug)</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5">SummerStage free concerts · Governors Ball · Rockaway Beach · Free kayaking Pier 26 · Rooftop pools · Shakespeare in the Park · Bryant Park movies</div>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">🍂 Fall (Sep-Nov)</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5">NYC Restaurant Week · US Open · Village Halloween Parade · Hudson Valley foliage · NYC Marathon · Rockefeller tree lighting</div>
          </div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">
            <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">❄️ Winter (Dec-Feb)</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5">Holiday windows at Saks & Bergdorf · Bryant Park ice skating (free!) · Holiday markets · NY Botanical Garden train show · Broadway · Cozy cocktail bars</div>
          </div>
        </div>
      </div>

      <!-- DAY TRIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🚗 Day Trips from NYC</div>
        <div style="display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:4px">
          <div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-size:24px;margin-bottom:6px">🍂</div><div style="font-size:13px;font-weight:700;color:var(--text)">Hudson Valley</div><div style="font-size:10px;color:var(--gold);margin-top:2px">1.5hr drive</div><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.4">DIA Beacon, farm-to-table, wineries</div></div>
          <div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-size:24px;margin-bottom:6px">🏖️</div><div style="font-size:13px;font-weight:700;color:var(--text)">Montauk</div><div style="font-size:10px;color:var(--gold);margin-top:2px">2.5hr drive</div><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.4">Surf, lobster rolls, sunset</div></div>
          <div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-size:24px;margin-bottom:6px">🍕</div><div style="font-size:13px;font-weight:700;color:var(--text)">New Haven</div><div style="font-size:10px;color:var(--gold);margin-top:2px">1.5hr drive</div><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.4">Pizza pilgrimage: Pepe vs Sally</div></div>
          <div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-size:24px;margin-bottom:6px">🔔</div><div style="font-size:13px;font-weight:700;color:var(--text)">Philadelphia</div><div style="font-size:10px;color:var(--gold);margin-top:2px">2hr Amtrak</div><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.4">Zahav, Reading Terminal</div></div>
          <div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-size:24px;margin-bottom:6px">🏕️</div><div style="font-size:13px;font-weight:700;color:var(--text)">Catskills</div><div style="font-size:10px;color:var(--gold);margin-top:2px">2hr drive</div><div style="font-size:10px;color:var(--text3);margin-top:4px;line-height:1.4">Hiking, Phoenicia Diner, cabins</div></div>
        </div>
      </div>

      <!-- INSIDER TIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">💡 NYC Insider Tips</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🍕 Dollar slices are a right, not a privilege. Fold it. Walk with it.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🚇 Never stand on the left side of an escalator. Walk or be judged.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🍽️ Restaurant Week ($30 lunch / $45 dinner) happens twice a year — Jan & Jul.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🎭 TKTS booth sells same-day Broadway tickets at 50% off.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">⛴️ Staten Island Ferry is free with Statue of Liberty views. Bring a beer.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">☕ Skip Starbucks. NYC has 500+ independent coffee shops that are better.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🌙 The city that never sleeps actually does — most kitchens close by 11 PM.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">💳 Cash is still king at Chinatown, pizza counters, and dive bars.</div>
        </div>
      </div>
`;

html = html.substring(0, insertIdx) + newContent + html.substring(insertIdx);
console.log('Added 4 new sections: Neighborhoods, Seasonal, Day Trips, Insider Tips');

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
const ni=h2.indexOf('const NYC_DATA');const ns=h2.indexOf('[',ni);let nd=0,ne=ns;
for(let j=ns;j<h2.length;j++){if(h2[j]==='[')nd++;if(h2[j]===']'){nd--;if(nd===0){ne=j+1;break;}}}
try{const a=JSON.parse(h2.substring(ns,ne));console.log('NYC:',a.length);}catch(e){console.log('NYC ERR');}
console.log('Done!');
