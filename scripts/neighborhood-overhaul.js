#!/usr/bin/env node
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// ============================================================
// STEP 1: Add NEIGHBORHOOD_COORDS before CITY_COORDS
// ============================================================
const cityCordsIdx = html.indexOf('const CITY_COORDS = {');
if (cityCordsIdx === -1) { console.error('CITY_COORDS not found'); process.exit(1); }

const COORDS_BLOCK = `const NEIGHBORHOOD_COORDS = {
  // Las Vegas
  'The Strip':[36.1147,-115.1728],'Downtown':[36.1699,-115.1424],'Arts District':[36.1590,-115.1536],
  'Chinatown':[36.1268,-115.1964],'Summerlin':[36.1527,-115.3280],'Henderson':[36.0397,-115.0028],
  // Dallas
  'Deep Ellum':[32.7834,-96.7836],'Uptown':[32.8018,-96.8005],'Bishop Arts':[32.7425,-96.8276],
  'Lower Greenville':[32.8144,-96.7695],'Design District':[32.7918,-96.8152],'Oak Cliff':[32.7288,-96.8332],
  // New York
  'East Village':[40.7265,-73.9815],'West Village':[40.7336,-74.0027],'Williamsburg':[40.7081,-73.9571],
  'Lower East Side':[40.7150,-73.9843],'SoHo':[40.7233,-74.0000],'Chinatown':[40.7158,-73.9970],
  // Houston
  'Montrose':[29.7439,-95.3903],'The Heights':[29.7907,-95.3963],'Chinatown / Bellaire':[29.7060,-95.5350],
  'Museum District':[29.7223,-95.3906],'EaDo':[29.7490,-95.3508],'River Oaks':[29.7505,-95.4230],
  // Austin
  'East Austin':[30.2622,-97.7237],'South Congress':[30.2467,-97.7503],'Downtown / 2nd Street':[30.2650,-97.7467],
  'Rainey Street':[30.2567,-97.7400],'Zilker / Barton Hills':[30.2638,-97.7713],'Hyde Park':[30.3020,-97.7283],
  // Chicago
  'West Loop':[41.8827,-87.6490],'Wicker Park':[41.9088,-87.6796],'Logan Square':[41.9231,-87.7085],
  'River North':[41.8920,-87.6318],'Pilsen':[41.8553,-87.6563],'Lincoln Park':[41.9214,-87.6513],
  // Salt Lake City
  'Downtown SLC':[40.7608,-111.8910],'9th & 9th':[40.7340,-111.8700],'Sugar House':[40.7222,-111.8560],
  'The Avenues':[40.7770,-111.8810],'Park City (Main Street)':[40.6461,-111.4980],'Millcreek':[40.6868,-111.8497],
  // Seattle
  'Capitol Hill':[47.6254,-122.3216],'Pike Place Market':[47.6097,-122.3422],'Ballard':[47.6686,-122.3847],
  'Fremont':[47.6510,-122.3505],'Chinatown-International District':[47.5981,-122.3255],'Belltown':[47.6150,-122.3470]
};

`;

html = html.substring(0, cityCordsIdx) + COORDS_BLOCK + html.substring(cityCordsIdx);
console.log('1. Added NEIGHBORHOOD_COORDS');

// ============================================================
// STEP 2: Rewrite openNeighborhoodSpotlight
// ============================================================
const fnStart = html.indexOf('  openNeighborhoodSpotlight(');
if (fnStart === -1) { console.error('openNeighborhoodSpotlight not found'); process.exit(1); }

// Find the end - next method at same indentation
const fnBody = html.substring(fnStart);
// Find the closing },\n pattern that ends this method
let braceDepth = 0;
let fnEnd = fnStart;
let inString = false;
let stringChar = '';
for (let i = fnStart; i < html.length; i++) {
  const c = html[i];
  if (inString) {
    if (c === '\\' && i+1 < html.length) { i++; continue; }
    if (c === stringChar) inString = false;
    continue;
  }
  if (c === "'" || c === '"' || c === '`') { inString = true; stringChar = c; continue; }
  if (c === '{') braceDepth++;
  if (c === '}') {
    braceDepth--;
    if (braceDepth === 0) {
      fnEnd = i + 1;
      // Skip the comma after }
      if (html[i+1] === ',') fnEnd = i + 2;
      break;
    }
  }
}

console.log('Found openNeighborhoodSpotlight from', fnStart, 'to', fnEnd);
console.log('Old function length:', fnEnd - fnStart);

const newFn = `  openNeighborhoodSpotlight(idx){
    var n = (window._nbhSpotCache||[])[idx];
    if(!n) return;
    var m = document.getElementById('event-detail-modal');
    if(!m) return;
    var city = S.city||'Dallas';
    var allR = this.getRestaurants();
    var nameLower = (n.name||'').toLowerCase();

    // Match restaurants to this neighborhood
    var matches = allR.filter(function(r){
      var rn = (r.neighborhood||'').toLowerCase();
      return rn===nameLower || rn.indexOf(nameLower)>-1 || nameLower.indexOf(rn)>-1;
    }).sort(function(a,b){return(b.score||0)-(a.score||0)});

    var topRestaurants = matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      return !cu.match(/bar|cocktail|lounge|pub|nightclub|brewery|tiki|speakeasy/);
    }).slice(0,10);

    var bars = matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      if(cu.match(/bar|cocktail|lounge|pub|wine bar|whiskey|brewery|tiki|speakeasy|mezcal/)) return true;
      var tags=(r.tags||[]);
      return tags.some(function(t){return/cocktail|bar|speakeasy|dive/i.test(t)}) && !cu.match(/steak|seafood|italian|french|american|mexican|japanese|sushi|bbq|pizza/);
    }).slice(0,8);

    // Get CITY_NEIGHBORHOODS data if available
    var cnData = (typeof CITY_NEIGHBORHOODS!=='undefined' && CITY_NEIGHBORHOODS[n.name]) ? CITY_NEIGHBORHOODS[n.name] : null;
    var dallasNbhd = (typeof DALLAS_NEIGHBORHOODS!=='undefined' && DALLAS_NEIGHBORHOODS[n.name]) ? DALLAS_NEIGHBORHOODS[n.name] : null;
    var nbhd = cnData || dallasNbhd;

    // Get neighborhood coordinates for map
    var nbhCoords = (typeof NEIGHBORHOOD_COORDS!=='undefined' && NEIGHBORHOOD_COORDS[n.name]) ? NEIGHBORHOOD_COORDS[n.name] : null;
    var cityCoords = (typeof CITY_COORDS!=='undefined' && CITY_COORDS[city]) ? CITY_COORDS[city] : [32.78,-96.80];

    // Get insider tip from nightlife hood tips
    var hoodTips = {
      'Deep Ellum':'Live music venues, craft cocktail bars, and late-night tacos line Elm and Main. Start at Midnight Rambler and bar hop down the strip.',
      'Uptown':'The dressed-up scene. McKinney Ave trolley connects the bars. Katy Trail Ice House for casual, Standard Pour or Happiest Hour rooftop for upscale.',
      'Bishop Arts':'Eclectic and artsy. Start at Paradiso for mezcal, cocktails at Oddfellows, then Magnolias for late-night Tex-Mex.',
      'Lower Greenville':'The Truck Yard is the anchor — live music, treehouse bar. HG Sply Co rooftop for sunset.',
      'Design District':'Late-night lounge vibes. Warehouse-turned-bars with a creative crowd.',
      'Oak Cliff':'Texas Theatre for films and concerts. The best taquerias in Dallas. Walkable on Jefferson Blvd.',
      'East Village':'The most packed square mile of bars in NYC. Sake bars, dive bars, and late-night ramen. Death & Co started a revolution here.',
      'West Village':'Jazz capital of America. Village Vanguard and Blue Note are legendary. Cocktails at Katana Kitten or Employees Only.',
      'Williamsburg':'Rooftops in summer, warehouses for parties. Bedford Ave for the bar crawl.',
      'Lower East Side':'The best dive-to-cocktail ratio in the city. Start at Welcome to the Johnsons, graduate to Attaboy, end at Beauty & Essex.',
      'SoHo':'Shopping by day, cocktails by night. Fanelli Cafe is the oldest bar. Balthazar for late-night French.',
      'Montrose':'Houston\\'s most walkable nightlife strip. Anvil Bar & Refuge for cocktails, Poison Girl for a dive.',
      'The Heights':'The chill alternative. Eight Row Flint for patio mezcal. Tree-lined streets and a relaxed pace.',
      'Museum District':'Museum-hop during the day, cocktails at Bludorn or Le Jardinier in the evening.',
      'EaDo':'East Downtown is Houston\\'s rising corridor. 8th Wonder Brewery anchors the scene.',
      'River Oaks':'Houston\\'s most affluent neighborhood. Ouzo Bay and Steak 48 for power dining.',
      'East Austin':'The creative hub. Hotel Vegas for garage rock, The White Horse for honky-tonk, Whisler\\'s for cocktails.',
      'South Congress':'Continental Club for live music since 1955. Hotel San Jose patio is the classic start.',
      'Rainey Street':'Bungalow bars with massive patios. Container Bar, Lustre Pearl, Icenhauer\\'s. Walk from bar to bar, no cover.',
      'West Loop':'Restaurant-forward nightlife. Girl & the Goat, cocktails at The Aviary, Lazy Bird. Fulton Market packed Thu-Sat.',
      'Wicker Park':'Violet Hour for cocktails, Subterranean for live music, Big Star for late-night tacos on the patio.',
      'Logan Square':'Craft cocktail paradise. Lost Lake for tiki, The Whistler for jazz, Scofflaw for gin.',
      'River North':'Bottle-service clubs, steakhouses, and rooftop bars. RPM for dinner, then PRYSM for dancing.',
      'Pilsen':'Art-driven nightlife with mezcalerias, murals, and live music. Punch House, Dusek\\'s, and Thalia Hall.',
      'Lincoln Park':'Classic Chicago bar crawl territory. DeLux, Wrightwood Tap, and The J. Parker rooftop.',
      'Capitol Hill':'The beating heart of Seattle nightlife. Pike/Pine corridor has the densest bar scene.',
      'Ballard':'Brewery crawl: Reuben\\'s, Stoup, Holy Mountain — walkable taproom district.',
      'Fremont':'Quirky, craft beer, neighborhood pubs. The Troll under the bridge is the landmark.',
      'Belltown':'Cocktail bars and clubs anchor the downtown late-night scene.',
      'Pike Place Market':'Tourist-heavy but magical before 9 AM. Post Alley has the hidden gems.',
      'The Strip':'Mega-clubs like Hakkasan, XS, Omnia require guest list or bottle service. Pool parties are daylife.',
      'Arts District':'Where locals drink. Velveteen Rabbit, Able Baker Brewing, First Friday art walks.',
      'Fremont Street':'Downtown\\'s 5-block canopy of LED shows. SlotZilla zipline. Circa\\'s Stadium Swim rooftop.',
      'Downtown SLC':'Utah\\'s most concentrated bar scene. Under Current, Bar X, Whiskey Street.',
      'Sugar House':'Most walkable neighborhood crawl in SLC. Local, no tourist crowd.',
      '9th & 9th':'Tiny, chef-driven, grown-up. Where SLC\\'s restaurant industry eats on nights off.'
    };

    // Venue tile helper (same as nightlife)
    function tile(r,i){
      var priceStr=r.price?'$'.repeat(r.price):'';
      return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);border:1px solid var(--border);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'"><div style="font-family:var(--serif);font-style:italic;font-size:18px;font-weight:700;color:var(--gold);flex-shrink:0;width:20px;text-align:center">'+(i+1)+'</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div><div style="font-size:10px;color:var(--text3);margin-top:2px">'+(r.cuisine||'')+(priceStr?' \\u00b7 '+priceStr:'')+'</div></div><div style="font-size:16px;font-weight:800;color:var(--gold);flex-shrink:0;background:rgba(201,168,76,.08);padding:4px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.15)">'+r.score+'</div></div>';
    }

    // Build modal
    var h='<div style="position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=\\'none\\'">';
    h+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto;position:relative">';

    // Header
    h+='<div style="position:sticky;top:0;z-index:10;background:linear-gradient(180deg,rgba(10,13,20,.98),rgba(10,13,20,.94));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:14px 16px 12px">';
    h+='<div style="display:flex;align-items:center;gap:10px">';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:700;padding:7px 12px;border-radius:18px;cursor:pointer;font-family:inherit;touch-action:manipulation">\\u2190 Back</button>';
    h+='<div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:800;color:var(--text)">'+(n.emoji||'\\ud83d\\udccd')+' '+n.name+'</div><div style="font-size:10px;color:var(--text3);margin-top:2px">'+city+' \\u00b7 '+matches.length+' spots in our guide</div></div>';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0;touch-action:manipulation">\\u2715</button>';
    h+='</div></div>';

    // Body
    h+='<div style="padding:0 16px 40px">';

    // Map
    h+='<div id="nbh-spot-map" style="height:220px;border-radius:0 0 12px 12px;margin-bottom:20px;background:var(--card);overflow:hidden"></div>';

    // The Scene (editorial description)
    var desc = n.desc || '';
    var vibeText = nbhd ? (nbhd.vibe || desc) : desc;
    if(vibeText){
      var firstChar=vibeText.charAt(0);
      var restText=vibeText.slice(1);
      h+='<div style="margin-bottom:24px">';
      if(nbhd && nbhd.bestFor) h+='<div style="font-size:10px;color:var(--gold);margin-bottom:8px;font-weight:700">Best for: '+nbhd.bestFor+'</div>';
      h+='<div style="font-size:14px;color:var(--text2);line-height:1.75"><span style="font-family:var(--serif);font-weight:700;font-size:38px;color:var(--gold);float:left;line-height:.85;margin:4px 10px -2px 0">'+firstChar+'</span>'+restText+'</div>';
      h+='</div>';
    }

    // Insider Tip
    var tip = hoodTips[n.name] || (nbhd && nbhd.tip) || '';
    if(tip){
      h+='<div style="margin-bottom:24px;padding:14px 16px;border-left:3px solid var(--gold);background:rgba(201,168,76,.06);border-radius:0 8px 8px 0">';
      h+='<div style="font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;font-weight:800;margin-bottom:6px">\\ud83d\\udca1 Insider Tip</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+tip+'</div></div>';
    }

    // Top Restaurants
    if(topRestaurants.length){
      h+='<div style="margin-bottom:24px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)"><span style="font-size:18px">\\ud83c\\udf7d\\ufe0f</span><span style="font-size:14px;font-weight:800;color:var(--text)">Top Restaurants</span><span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.15)">'+topRestaurants.length+'</span></div>';
      h+='<div style="display:flex;flex-direction:column;gap:6px">';
      topRestaurants.forEach(function(r,i){ h+=tile(r,i); });
      h+='</div></div>';
    }

    // Best Bars & Nightlife
    if(bars.length){
      h+='<div style="margin-bottom:24px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)"><span style="font-size:18px">\\ud83c\\udf78</span><span style="font-size:14px;font-weight:800;color:var(--text)">Bars & Nightlife</span><span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.15)">'+bars.length+'</span></div>';
      h+='<div style="display:flex;flex-direction:column;gap:6px">';
      bars.forEach(function(r,i){ h+=tile(r,i); });
      h+='</div></div>';
    }

    // Known For (from CITY_NEIGHBORHOODS)
    if(nbhd && nbhd.knownFor){
      h+='<div style="margin-bottom:24px;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:12px">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Known For</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+nbhd.knownFor+'</div></div>';
    }

    // Must Visit (from CITY_NEIGHBORHOODS)
    if(nbhd && nbhd.mustVisit){
      h+='<div style="margin-bottom:24px;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:12px">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Must Visit</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+nbhd.mustVisit+'</div></div>';
    }

    // Footer — Google Maps link
    h+='<a href="https://www.google.com/maps/search/'+encodeURIComponent(n.name+' '+city)+'" target="_blank" rel="noopener" style="display:block;text-align:center;padding:14px 12px 8px;font-size:11px;color:var(--text3);text-decoration:none;border-top:1px solid var(--border)">\\ud83d\\uddfa\\ufe0f Open in Google Maps</a>';

    h+='</div></div></div>';
    m.innerHTML=h;
    m.style.display='block';

    // Initialize Leaflet map after modal is visible
    if(typeof L!=='undefined'){
      setTimeout(function(){
        var mapEl=document.getElementById('nbh-spot-map');
        if(!mapEl)return;
        var center=nbhCoords||cityCoords;
        var zoom=nbhCoords?15:13;
        try{
          var nbhMap=L.map(mapEl,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:true}).setView(center,zoom);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:18,subdomains:'abcd'}).addTo(nbhMap);
          // Add restaurant markers
          matches.forEach(function(r){
            if(!r.lat||!r.lng)return;
            var sc=r.score||50;
            var color=sc>=90?'#c9a84c':sc>=80?'#4c9a6a':sc>=70?'#4c7ac9':'#5a4e38';
            L.circleMarker([r.lat,r.lng],{radius:7,fillColor:color,color:'#0e0c09',weight:1.5,fillOpacity:.9}).addTo(nbhMap).bindPopup('<div style="font-family:sans-serif;min-width:120px"><b>'+r.name+'</b><br><span style="color:#9e8e6e;font-size:11px">'+r.cuisine+'</span><br><span style="color:'+color+';font-weight:bold">'+sc+'</span><br><a href="#" onclick="event.preventDefault();A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="color:#c9a84c;font-size:11px;font-weight:bold">View \\u2192</a></div>');
          });
          // Fit bounds if we have markers
          var withCoords=matches.filter(function(r){return r.lat&&r.lng});
          if(withCoords.length>1){
            var bounds=L.latLngBounds(withCoords.map(function(r){return[r.lat,r.lng]}));
            nbhMap.fitBounds(bounds,{padding:[30,30],maxZoom:16});
          }
        }catch(e){console.warn('Neighborhood map error:',e)}
      },400);
    }
  },`;

html = html.substring(0, fnStart) + newFn + html.substring(fnEnd);
console.log('2. Replaced openNeighborhoodSpotlight with new version');

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
