// Add city-specific Weekend Guides content for Dallas, Houston, Chicago
// (Things to Do, Neighborhood Spotlight, Seasonal Picks, Day Trips, Insider Tips)
// These sections currently only exist for NYC. This adds them for the other 3 cities.
// Run: node scripts/add-city-weekend-content.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Find the NYC conditional closing: ` : ''}
// After it, insert Dallas, Houston, Chicago conditionals
const nycCondClose = html.indexOf("` : ''}", 2710000);
if (nycCondClose === -1) { console.error('NYC conditional close not found'); process.exit(1); }
const insertPos = nycCondClose + "` : ''}".length;

console.log('Inserting city content after NYC conditional at:', insertPos);

const dallasContent = `
\${(S.city||'Dallas')==='Dallas' ? \`
      <!-- DALLAS THINGS TO DO -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🎯 Things to Do</div>
        <div style="font-size:11px;color:var(--text2);margin:-4px 0 12px">Beyond restaurants — the best Dallas experiences</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏙️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Reunion Tower GeO-Deck</div><div style="font-size:10px;color:var(--text3)">470-ft panoramic views of the Dallas skyline. Best at sunset.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Dallas Museum of Art</div><div style="font-size:10px;color:var(--text3)">Free admission. 24,000+ works spanning 5,000 years. Arts District gem.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏈</div><div style="font-size:11px;font-weight:700;color:var(--text)">AT&T Stadium</div><div style="font-size:10px;color:var(--text3)">Cowboys, concerts, and FIFA World Cup 2026 semi-final venue.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌳</div><div style="font-size:11px;font-weight:700;color:var(--text)">Klyde Warren Park</div><div style="font-size:10px;color:var(--text3)">Food trucks, yoga, and free events on a deck park over a freeway.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🕯️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Sixth Floor Museum</div><div style="font-size:10px;color:var(--text3)">JFK assassination history in the former Texas School Book Depository.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🚃</div><div style="font-size:11px;font-weight:700;color:var(--text)">McKinney Ave Trolley</div><div style="font-size:10px;color:var(--text3)">Free vintage trolley through Uptown. Bar hop without driving.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏊</div><div style="font-size:11px;font-weight:700;color:var(--text)">White Rock Lake</div><div style="font-size:10px;color:var(--text3)">9.3-mile trail for running, biking, kayaking. Free parking.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌏</div><div style="font-size:11px;font-weight:700;color:var(--text)">Crow Museum of Asian Art</div><div style="font-size:10px;color:var(--text3)">Free museum with a serene sculpture garden in the Arts District.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
        </div>
      </div>
      <!-- DALLAS NEIGHBORHOOD SPOTLIGHT -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🏘️ Neighborhood Spotlight</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎸</div><div style="font-size:11px;font-weight:700;color:var(--text)">Deep Ellum</div><div style="font-size:10px;color:var(--text3)">Live music, street art, late-night tacos</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏙️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Uptown</div><div style="font-size:10px;color:var(--text3)">Rooftop bars, trolley, walkable scene</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Bishop Arts</div><div style="font-size:10px;color:var(--text3)">Eclectic boutiques, mezcal, murals</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🍺</div><div style="font-size:11px;font-weight:700;color:var(--text)">Lower Greenville</div><div style="font-size:10px;color:var(--text3)">Truck Yard, rooftops, dive bars</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🖼️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Design District</div><div style="font-size:10px;color:var(--text3)">Galleries, showrooms, upscale dining</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌿</div><div style="font-size:11px;font-weight:700;color:var(--text)">Oak Cliff</div><div style="font-size:10px;color:var(--text3)">Texas Theatre, taquerias, hidden gems</div></div>
        </div>
      </div>
      <!-- DALLAS SEASONAL PICKS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🗓️ Seasonal Picks</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🌸 Spring (Mar-May)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Dallas Blooms at the Arboretum (500K spring blooms). Ennis bluebonnet trails. Deep Ellum Arts Festival. Patio season opens citywide.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">☀️ Summer (Jun-Aug)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">FIFA World Cup 2026 at AT&T Stadium. Kaboom Town fireworks in Addison (July 3). White Rock Lake kayaking. Rooftop season peaks.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🍂 Fall (Sep-Nov)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">State Fair of Texas at Fair Park (Sep-Oct). Cowboys season opener. Restaurant week deals. Perfect patio weather returns.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">❄️ Winter (Dec-Feb)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Holiday at the Arboretum light show. NorthPark Center holiday displays. Dallas Restaurant Week (Jan). Perot Museum free first Tuesdays.</div></div>
        </div>
      </div>
      <!-- DALLAS DAY TRIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🚗 Day Trips from Dallas</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏠</div><div style="font-size:11px;font-weight:700;color:var(--text)">Waco</div><div style="font-size:10px;color:var(--text3)">1h 45m · Magnolia Market, Dr Pepper Museum, Balcones Distillery</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🦕</div><div style="font-size:11px;font-weight:700;color:var(--text)">Dinosaur Valley</div><div style="font-size:10px;color:var(--text3)">1h 30m · Real dino footprints in Glen Rose. Swim in the Paluxy River.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏖️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Lake Texoma</div><div style="font-size:10px;color:var(--text3)">1h 15m · Sandy beaches, boating, and fishing on the TX-OK border.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌺</div><div style="font-size:11px;font-weight:700;color:var(--text)">Ennis Bluebonnets</div><div style="font-size:10px;color:var(--text3)">45m · April only. 40 miles of bluebonnet trails through Texas Hill Country.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🛍️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Canton First Monday</div><div style="font-size:10px;color:var(--text3)">1h · World's biggest flea market. Monthly, 4 days before first Monday.</div></div>
        </div>
      </div>
      <!-- DALLAS INSIDER TIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">💡 Dallas Insider Tips</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🚃 The McKinney Ave Trolley is free and runs through Uptown. Perfect for a bar crawl without Uber.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🌮 Dallas Tex-Mex is its own cuisine. Don't compare it to Mexican food — appreciate it on its own terms.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🏈 Game day = full restaurants. Book ahead if Cowboys, Mavs, or Stars are playing.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🎨 The Arts District is 20 blocks — the largest in the US. DMA and Crow Museum are both free.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🥩 Dallas was built on cattle. The steakhouse culture is real — Town Hearth, Nick & Sam's, and Al Biernat's are institutions.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">☀️ Patios are open year-round. Texas winters are mild. Take advantage.</div>
        </div>
      </div>
\` : ''}`;

const houstonContent = `
\${(S.city)==='Houston' ? \`
      <!-- HOUSTON THINGS TO DO -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🎯 Things to Do</div>
        <div style="font-size:11px;color:var(--text2);margin:-4px 0 12px">Beyond restaurants — the best Houston experiences</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🚀</div><div style="font-size:11px;font-weight:700;color:var(--text)">Space Center Houston</div><div style="font-size:10px;color:var(--text3)">400+ artifacts, real rockets, and NASA mission control tours.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Museum District</div><div style="font-size:10px;color:var(--text3)">19 museums in 4 walkable zones. Many free on Thursdays.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free Thursdays</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🖼️</div><div style="font-size:11px;font-weight:700;color:var(--text)">The Menil Collection</div><div style="font-size:10px;color:var(--text3)">World-class art collection. Always free. Rothko Chapel next door.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌳</div><div style="font-size:11px;font-weight:700;color:var(--text)">Hermann Park</div><div style="font-size:10px;color:var(--text3)">445 acres with the Houston Zoo, Japanese Garden, and paddle boats.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free (zoo extra)</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌊</div><div style="font-size:11px;font-weight:700;color:var(--text)">Buffalo Bayou Park</div><div style="font-size:10px;color:var(--text3)">160 acres along the bayou. Kayaking, running trails, and bat colony at sunset.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🐘</div><div style="font-size:11px;font-weight:700;color:var(--text)">Houston Zoo</div><div style="font-size:10px;color:var(--text3)">6,000+ animals. New Galápagos exhibit with sea lions and sharks.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌿</div><div style="font-size:11px;font-weight:700;color:var(--text)">Discovery Green</div><div style="font-size:10px;color:var(--text3)">Downtown park with free concerts, kayaking, and ice skating in winter.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏀</div><div style="font-size:11px;font-weight:700;color:var(--text)">Toyota Center / NRG</div><div style="font-size:10px;color:var(--text3)">Rockets, Texans, and Astros. Game day dining scene is elite.</div></div>
        </div>
      </div>
      <!-- HOUSTON NEIGHBORHOOD SPOTLIGHT -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🏘️ Neighborhood Spotlight</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌈</div><div style="font-size:11px;font-weight:700;color:var(--text)">Montrose</div><div style="font-size:10px;color:var(--text3)">Cocktail bars, galleries, walkable vibes</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏙️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Heights</div><div style="font-size:10px;color:var(--text3)">Historic bungalows, brunch, antique shops</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🍜</div><div style="font-size:11px;font-weight:700;color:var(--text)">Chinatown / Bellaire</div><div style="font-size:10px;color:var(--text3)">Best Asian food in the South. Open late.</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Museum District</div><div style="font-size:10px;color:var(--text3)">19 museums, Hermann Park, Rice Village</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏟️</div><div style="font-size:11px;font-weight:700;color:var(--text)">EaDo</div><div style="font-size:10px;color:var(--text3)">Breweries, stadiums, rising food scene</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🛍️</div><div style="font-size:11px;font-weight:700;color:var(--text)">River Oaks</div><div style="font-size:10px;color:var(--text3)">Luxury dining, River Oaks District, old money</div></div>
        </div>
      </div>
      <!-- HOUSTON SEASONAL PICKS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🗓️ Seasonal Picks</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🌸 Spring (Mar-May)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Houston Rodeo at NRG (Feb-Mar). Bluebonnet season in Brenham. Patio weather before the heat arrives. Crawfish boils everywhere.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">☀️ Summer (Jun-Aug)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Galveston beach day trips. Indoor restaurants and museums to escape the heat. Astros baseball season. Late-night dining scene peaks.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🍂 Fall (Sep-Nov)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Houston Restaurant Weeks (Aug-Sep). Texans football starts. Art Car Weekend. Perfect outdoor dining weather finally returns.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">❄️ Winter (Dec-Feb)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Zoo Lights at Houston Zoo. Ice skating at Discovery Green. Mild winters — patio dining continues. Houston Livestock Show prep.</div></div>
        </div>
      </div>
      <!-- HOUSTON DAY TRIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🚗 Day Trips from Houston</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏖️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Galveston</div><div style="font-size:10px;color:var(--text3)">1h · Beaches, Strand Historic District, Bolivar Ferry dolphin watching.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🍦</div><div style="font-size:11px;font-weight:700;color:var(--text)">Brenham / Blue Bell</div><div style="font-size:10px;color:var(--text3)">1h · Blue Bell Creameries tour. Heart of bluebonnet country.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎡</div><div style="font-size:11px;font-weight:700;color:var(--text)">Kemah Boardwalk</div><div style="font-size:10px;color:var(--text3)">45m · Waterfront rides, seafood restaurants, and bay views.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">⛪</div><div style="font-size:11px;font-weight:700;color:var(--text)">Painted Churches</div><div style="font-size:10px;color:var(--text3)">1h 30m · Stunning painted churches in Schulenburg and surrounding towns.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🗽</div><div style="font-size:11px;font-weight:700;color:var(--text)">San Jacinto Monument</div><div style="font-size:10px;color:var(--text3)">30m · Where Texas won independence. Taller than the Washington Monument.</div></div>
        </div>
      </div>
      <!-- HOUSTON INSIDER TIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">💡 Houston Insider Tips</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🚗 Houston is a driving city. Uber or have a car — public transit is limited outside downtown.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🍜 Bellaire Blvd Chinatown is one of the best Asian food corridors in America. Go hungry.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🌍 Houston is the most diverse city in America. 70+ cuisines represented. Eat globally.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🎨 Thursday = free museum day. Many Museum District venues drop admission fees.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🦐 Crawfish season is Jan-May. Don't leave Houston without trying a proper boil.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">⭐ Houston has 6 Michelin-starred restaurants. The fine dining scene rivals any US city.</div>
        </div>
      </div>
\` : ''}`;

const chicagoContent = `
\${(S.city)==='Chicago' ? \`
      <!-- CHICAGO THINGS TO DO -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🎯 Things to Do</div>
        <div style="font-size:11px;color:var(--text2);margin:-4px 0 12px">Beyond restaurants — the best Chicago experiences</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">☁️</div><div style="font-size:11px;font-weight:700;color:var(--text)">The Bean (Cloud Gate)</div><div style="font-size:10px;color:var(--text3)">Millennium Park's iconic sculpture. Best photos at sunrise.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Art Institute of Chicago</div><div style="font-size:10px;color:var(--text3)">World-class collection. Free for IL residents on weekdays (limited).</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🚢</div><div style="font-size:11px;font-weight:700;color:var(--text)">Architecture River Cruise</div><div style="font-size:10px;color:var(--text3)">The #1 tour in Chicago. Learn the skyline from the river.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏙️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Skydeck / Willis Tower</div><div style="font-size:10px;color:var(--text3)">103rd floor glass ledge. Step out over Chicago — if you dare.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🦁</div><div style="font-size:11px;font-weight:700;color:var(--text)">Lincoln Park Zoo</div><div style="font-size:10px;color:var(--text3)">One of the last free zoos in America. Open 365 days a year.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🌳</div><div style="font-size:11px;font-weight:700;color:var(--text)">Lakefront Trail</div><div style="font-size:10px;color:var(--text3)">18 miles along Lake Michigan. Run, bike, or walk with skyline views.</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Free</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🏛️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Field Museum</div><div style="font-size:10px;color:var(--text3)">SUE the T. rex. Free Wednesdays for IL residents.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:16px;margin-bottom:4px">🎭</div><div style="font-size:11px;font-weight:700;color:var(--text)">Second City</div><div style="font-size:10px;color:var(--text3)">Where Tina Fey, Bill Murray, and Steve Carell started. Improv nightly.</div></div>
        </div>
      </div>
      <!-- CHICAGO NEIGHBORHOOD SPOTLIGHT -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🏘️ Neighborhood Spotlight</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🍽️</div><div style="font-size:11px;font-weight:700;color:var(--text)">West Loop</div><div style="font-size:10px;color:var(--text3)">Michelin mile, Fulton Market, chef-driven dining</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎸</div><div style="font-size:11px;font-weight:700;color:var(--text)">Wicker Park</div><div style="font-size:10px;color:var(--text3)">Indie shops, cocktail bars, creative energy</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🍸</div><div style="font-size:11px;font-weight:700;color:var(--text)">Logan Square</div><div style="font-size:10px;color:var(--text3)">Best cocktail bars in the city, taco joints</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏙️</div><div style="font-size:11px;font-weight:700;color:var(--text)">River North</div><div style="font-size:10px;color:var(--text3)">Steakhouses, clubs, rooftop bars</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎨</div><div style="font-size:11px;font-weight:700;color:var(--text)">Pilsen</div><div style="font-size:10px;color:var(--text3)">Murals, Mexican food, mezcalerías, art</div></div>
          <div style="min-width:150px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌿</div><div style="font-size:11px;font-weight:700;color:var(--text)">Lincoln Park</div><div style="font-size:10px;color:var(--text3)">Free zoo, classic bar crawls, DePaul energy</div></div>
        </div>
      </div>
      <!-- CHICAGO SEASONAL PICKS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🗓️ Seasonal Picks</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🌸 Spring (Mar-May)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Chicago Restaurant Week (Jan-Feb spillover). Architecture Biennial. Patio season starts. Lakefront Trail comes alive.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">☀️ Summer (Jun-Aug)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Chicago Blues Festival (Jun, free). Lollapalooza (Jul-Aug). Beach season on Lake Michigan. Rooftop bars peak. The best 3 months in any US city.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">🍂 Fall (Sep-Nov)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Chicago Jazz Festival (Sep, free). Bears & Bulls season starts. Architecture Open House. Perfect weather for neighborhood food crawls.</div></div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px"><div style="font-size:11px;font-weight:700;color:var(--gold)">❄️ Winter (Dec-Feb)</div><div style="font-size:10px;color:var(--text2);margin-top:4px">Millennium Park ice rink (free). Christkindlmarket at Daley Plaza. Chicago Restaurant Week. Cozy cocktail bar season.</div></div>
        </div>
      </div>
      <!-- CHICAGO DAY TRIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🚗 Day Trips from Chicago</div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch">
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏖️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Indiana Dunes</div><div style="font-size:10px;color:var(--text3)">50m · National park on Lake Michigan. 15 miles of shoreline, 50 miles of trails.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🏔️</div><div style="font-size:11px;font-weight:700;color:var(--text)">Starved Rock</div><div style="font-size:10px;color:var(--text3)">1h 40m · Sandstone canyons and waterfalls. Best hiking near Chicago.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌊</div><div style="font-size:11px;font-weight:700;color:var(--text)">New Buffalo, MI</div><div style="font-size:10px;color:var(--text3)">1h 15m · Beach town with west-facing sunset views on Lake Michigan.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🎢</div><div style="font-size:11px;font-weight:700;color:var(--text)">Six Flags Great America</div><div style="font-size:10px;color:var(--text3)">45m · 17 roller coasters in Gurnee. Kid-friendly to record-breaking.</div></div>
          <div style="min-width:180px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;flex-shrink:0"><div style="font-size:14px">🌸</div><div style="font-size:11px;font-weight:700;color:var(--text)">Rockford Gardens</div><div style="font-size:10px;color:var(--text3)">1h 40m · Anderson Japanese Gardens. City of Gardens.</div></div>
        </div>
      </div>
      <!-- CHICAGO INSIDER TIPS -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">💡 Chicago Insider Tips</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🌭 It's a Chicago dog — never put ketchup on it. Mustard, relish, onion, tomato, pickle, sport peppers, celery salt.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🍕 Deep dish is for tourists. Locals eat tavern-style thin crust, cut in squares. Try Pat's Pizza or Vito & Nick's.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🚇 The L train is efficient. Brown and Blue lines hit the best food neighborhoods.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🏛️ Free museum days rotate — Field Museum Wednesdays, Art Institute weekdays for IL residents.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">☀️ Chicago summer (Jun-Aug) is the best season of any US city. Beaches, festivals, rooftops. Plan around it.</div>
          <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text2);line-height:1.4">🍽️ West Loop / Fulton Market is Michelin Row. Walk Randolph St and eat at every block.</div>
        </div>
      </div>
\` : ''}`;

html = html.slice(0, insertPos) + dallasContent + houstonContent + chicagoContent + html.slice(insertPos);

fs.writeFileSync(file, html, 'utf8');
console.log('✅ Added city-specific weekend guide content for Dallas, Houston, and Chicago');
console.log('   - Things to Do (8 activities each)');
console.log('   - Neighborhood Spotlight (5-6 neighborhoods each)');
console.log('   - Seasonal Picks (4 seasons each)');
console.log('   - Day Trips (5 destinations each)');
console.log('   - Insider Tips (6 tips each)');
