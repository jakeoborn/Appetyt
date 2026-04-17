const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find the openNightlifeHood function boundaries
const startMarker = '  openNightlifeHood(hood){';
const startIdx = html.indexOf(startMarker);
if(startIdx === -1){ console.log('ERROR: Could not find openNightlifeHood'); process.exit(1); }

// Find the end: next method at same indentation (2-space "  methodName(")
// The function ends with "  }," and then "  openNightlifeGuide()" starts
const endMarker = '\n  openNightlifeGuide()';
const endIdx = html.indexOf(endMarker, startIdx);
if(endIdx === -1){ console.log('ERROR: Could not find end marker'); process.exit(1); }

// The function text to replace is from startIdx to endIdx (exclusive)
const oldFunc = html.substring(startIdx, endIdx);
console.log('Found function from char', startIdx, 'to', endIdx, '(', oldFunc.length, 'chars)');
console.log('First 60 chars:', oldFunc.substring(0,60));
console.log('Last 60 chars:', oldFunc.substring(oldFunc.length-60));

const newFunc = `  openNightlifeHood(hood){
    var city=S.city||'Dallas';
    var allR=this.getRestaurants();
    var hoodLower=hood.toLowerCase();

    // Match nightlife spots to this neighborhood
    var nlTags=/cocktail|bar|late night|rooftop|club|jazz|live music|comedy|dive|speakeasy|nightlife|karaoke/i;
    var nlCuisine=/bar|cocktail|club|jazz|comedy|live music|wine|brewery|tiki|lounge|speakeasy|mezcal|nightclub|pub/i;
    var matches=allR.filter(function(r){
      var rn=(r.neighborhood||'').toLowerCase();
      if(!(rn===hoodLower||rn.indexOf(hoodLower)>-1||hoodLower.indexOf(rn)>-1)) return false;
      return (r.tags||[]).some(function(t){return nlTags.test(t)})||nlCuisine.test(r.cuisine||'');
    }).sort(function(a,b){return(b.score||0)-(a.score||0)});

    // Sub-categories
    var clubs=matches.filter(function(r){
      var cu=(r.cuisine||'').toLowerCase();
      return cu.match(/nightclub|club|disco/)||(r.tags||[]).some(function(t){return/nightlife|nightclub/i.test(t)});
    });
    var liveMusic=matches.filter(function(r){
      return(r.tags||[]).some(function(t){return/live music/i.test(t)})||(r.cuisine||'').toLowerCase().indexOf('live music')>-1;
    });
    var diveBars=matches.filter(function(r){
      return(r.indicators||[]).indexOf('dive-bar')>-1||(r.tags||[]).some(function(t){return/dive/i.test(t)})||(r.cuisine||'').toLowerCase().indexOf('dive')>-1;
    });

    // Coords
    var nbhCoords=(typeof NEIGHBORHOOD_COORDS!=='undefined'&&NEIGHBORHOOD_COORDS[hood])?NEIGHBORHOOD_COORDS[hood]:null;
    var cityCoords=(typeof CITY_COORDS!=='undefined'&&CITY_COORDS[city])?CITY_COORDS[city]:[32.78,-96.80];

    // Editorial data
    var cnData=(typeof CITY_NEIGHBORHOODS!=='undefined'&&CITY_NEIGHBORHOODS[hood])?CITY_NEIGHBORHOODS[hood]:null;
    var dallasNbhd=(typeof DALLAS_NEIGHBORHOODS!=='undefined'&&DALLAS_NEIGHBORHOODS[hood])?DALLAS_NEIGHBORHOODS[hood]:null;
    var nbhd=cnData||dallasNbhd;

    var hoodTips={
      'Meatpacking District':'The scene peaks Thu-Sat after 11 PM. Le Bain at The Standard is the anchor. Dress up -- door policies are real.',
      'Lower East Side':'The best dive-to-cocktail ratio in the city. Start at Welcome to the Johnsons (dive), graduate to Attaboy (cocktail), end at Beauty & Essex (speakeasy).',
      'Williamsburg':'Rooftops in summer (Westlight, Bar Blondeau), warehouses for parties (Elsewhere, Brooklyn Mirage). Bedford Ave for the crawl.',
      'West Village':'Jazz capital of America. Village Vanguard and Blue Note are legendary. Cocktails at Katana Kitten or Employees Only.',
      'East Village':'The most packed square mile of bars in NYC. Sake bars, dive bars, and late-night ramen. Death & Co started a revolution here.',
      'Bushwick':'Warehouse parties and DIY venues. House of Yes requires costumes for many events. Elsewhere has the best sound system in Brooklyn.',
      'Deep Ellum':'The epicenter of Dallas nightlife. Live music venues, craft cocktail bars, and late-night tacos line Elm and Main. Start at Midnight Rambler and bar hop down the strip.',
      'Uptown':'The dressed-up scene. Katy Trail Ice House for a casual start, then Standard Pour or Happiest Hour rooftop. McKinney Ave trolley connects the bars.',
      'Bishop Arts':'Eclectic and artsy. Start at Paradiso for mezcal, cocktails at Oddfellows, then Magnolias for late-night Tex-Mex. Walkable and low-key.',
      'Lower Greenville':'The Truck Yard is the anchor -- live music, treehouse bar, cheese steaks. HG Sply Co rooftop for sunset. Mix of dive bars and elevated cocktail spots.',
      'Knox-Henderson':'Upscale casual. Boogies and Sidecar Social anchor the strip. Great restaurant-to-bar pipeline. Less rowdy than Deep Ellum.',
      'Design District':'Late-night lounge vibes. Warehouse-turned-bars with a creative, well-dressed crowd.',
      'Oak Lawn':'Cedar Springs is Dallas\\'s LGBTQ+ nightlife hub. Bars, drag shows, and late-night energy on the strip. Round Up Saloon and JR\\'s Bar are the institutions.',
      'Victory Park':'Pre-game central for Mavericks and Stars fans. Happiest Hour rooftop is the anchor, with Nobu and Urban Italia for dinner before the arena.',
      'Montrose':'Houston\\'s most walkable nightlife strip. Start at Anvil Bar & Refuge for cocktails, hit Poison Girl for a dive.',
      'Washington Corridor':'High-energy bars and lounges. Wooster\\'s Garden, Johnny\\'s Gold Brick, and Better Luck Tomorrow.',
      'Midtown':'Houston\\'s most concentrated bar district. Little Woodrow\\'s, Dogwood, and Pub Fiction draw big weekend crowds.',
      'Heights':'The chill alternative. Eight Row Flint for patio mezcal, Bravery Chef Hall for late bites.',
      'EaDo':'East Downtown is Houston\\'s rising nightlife corridor. 8th Wonder Brewery anchors the scene.',
      'Wicker Park':'The creative heart of Chicago nightlife. Violet Hour for cocktails, Subterranean for live music, Big Star for late-night tacos.',
      'River North':'Bottle-service clubs, steakhouses, and rooftop bars. RPM for dinner, then PRYSM for dancing.',
      'Logan Square':'Craft cocktail paradise. Lost Lake for tiki, The Whistler for jazz and cocktails, Scofflaw for gin.',
      'West Loop':'Restaurant-forward nightlife. Girl & the Goat, cocktails at The Aviary, Lazy Bird. Fulton Market packed Thu-Sat.',
      'Lincoln Park':'Classic Chicago bar crawl territory. DeLux, Wrightwood Tap, and The J. Parker rooftop.',
      'Pilsen':'Art-driven nightlife with mezcaler\\u00edas, murals, and live music. Punch House, Dusek\\'s, and Thalia Hall.',
      '6th Street':'Dirty Sixth is college chaos; West 6th skews upscale. Roosevelt Room and Midnight Cowboy anchor the craft scene.',
      'Rainey Street':'Bungalow bars with massive patios -- Container Bar, Lustre Pearl, Icenhauer\\'s. Walk from bar to bar, no cover.',
      'East Austin':'Hotel Vegas for garage rock, The White Horse for honky-tonk, Whisler\\'s for cocktails. The coolest scene in the city.',
      'Red River Cultural District':'Austin\\'s live music backbone. Mohawk, Stubb\\'s, Empire Control Room, and Cheer Up Charlies.',
      'South Congress (SoCo)':'Continental Club for live music since 1955. Hotel San Jos\\u00e9 patio is the classic start.',
      'The Domain':'North Austin\\'s upscale outdoor nightlife. Rooftop bars and a dressier crowd.',
      'Downtown SLC':'Under Current and Repeal anchor the speakeasy crowd, Bar X and Beer Bar are the go-to hang.',
      'Sugar House':'Most walkable neighborhood crawl in SLC. Local, no tourist crowd.',
      '9th & 9th':'Tiny, chef-driven, grown-up. Where SLC\\'s restaurant industry eats on nights off.',
      'Main Street (Park City)':'Apr\\u00e8s-ski main drag. High West Saloon pours steps from the lift. During Sundance every door is a party.',
      'Granary District':'SLC\\'s brewery corridor. Fisher, Kiitos, Epic Brewing, and Water Witch cocktail temple.',
      'Capitol Hill':'The beating heart of Seattle nightlife. Pike/Pine corridor has the densest bar scene.',
      'Ballard':'Brewery crawl: Reuben\\'s, Stoup, Holy Mountain -- walkable taproom district.',
      'Fremont':'Quirky, craft beer, neighborhood pubs. The Troll under the bridge is the landmark.',
      'Belltown':'Cocktail bars and clubs anchor the downtown late-night scene.',
      'The Strip':'Mega-clubs like Hakkasan, XS, Omnia. Pool parties are daylife. Guest list or bottle service.',
      'Arts District':'Where locals drink. Velveteen Rabbit, Able Baker Brewing, First Friday art walks.',
      'Fremont Street':'Downtown\\'s LED canopy. SlotZilla zipline. Circa\\'s Stadium Swim rooftop.'
    };

    // Tile helper
    function tile(r,i){
      var priceStr=r.price?'$'.repeat(r.price):'';
      var hhBadge=(r.hh&&r.hh!=='')?'<span style="font-size:9px;color:var(--gold);background:rgba(201,168,76,.1);padding:1px 6px;border-radius:6px;border:1px solid rgba(201,168,76,.2)">\\ud83c\\udf78 HH</span>':'';
      return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s" onmouseover="this.style.boxShadow=\\'0 0 18px rgba(232,201,122,.45)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.boxShadow=\\'0 0 8px rgba(200,169,110,.2)\\';this.style.transform=\\'\\'"><div style="font-family:var(--serif);font-style:italic;font-size:18px;font-weight:700;color:var(--gold);flex-shrink:0;width:20px;text-align:center">'+(i+1)+'</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div><div style="font-size:10px;color:var(--text3);margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">'+(r.cuisine||'')+(priceStr?' \\u00b7 '+priceStr:'')+' '+hhBadge+'</div></div><div style="font-size:16px;font-weight:800;color:var(--gold);flex-shrink:0;background:rgba(201,168,76,.08);padding:4px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.15)">'+r.score+'</div></div>';
    }

    // Section helper
    function section(title,emoji,spots){
      if(!spots.length) return '';
      return '<div style="margin-bottom:24px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)"><span style="font-size:18px">'+emoji+'</span><span style="font-size:14px;font-weight:800;color:var(--text)">'+title+'</span><span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.15)">'+spots.length+'</span></div><div style="display:flex;flex-direction:column;gap:6px">'+spots.map(tile).join('')+'</div></div>';
    }

    var m=document.getElementById('event-detail-modal');
    if(!m)return;

    // Build modal — Spotlight style with map
    var h='<div style="position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=\\'none\\'">';
    h+='<div id="nl-hood-scroller" style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto;position:relative">';

    // Sticky header
    h+='<div style="position:sticky;top:0;z-index:10;background:linear-gradient(180deg,rgba(10,13,20,.98),rgba(10,13,20,.94));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:14px 16px 12px">';
    h+='<div style="display:flex;align-items:center;gap:10px">';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:700;padding:7px 12px;border-radius:18px;cursor:pointer;font-family:inherit;touch-action:manipulation">\\u2190 Back</button>';
    h+='<div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:800;color:var(--gold)">\\ud83e\\udea9 '+hood+' Nightlife</div><div style="font-size:10px;color:var(--text3);margin-top:2px">'+city+' \\u00b7 '+matches.length+' nightlife spots</div></div>';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0;touch-action:manipulation">\\u2715</button>';
    h+='</div></div>';

    // Body
    h+='<div style="padding:0 16px 40px">';

    // Map
    h+='<div id="nl-hood-map" style="height:220px;border-radius:0 0 12px 12px;margin-bottom:20px;background:var(--card);overflow:hidden"></div>';

    // The Scene
    var vibeText=nbhd?nbhd.vibe:'';
    if(vibeText){
      var firstChar=vibeText.charAt(0);
      var restText=vibeText.slice(1);
      h+='<div style="margin-bottom:24px">';
      if(nbhd&&nbhd.bestFor) h+='<div style="font-size:10px;color:var(--gold);margin-bottom:8px;font-weight:700">Best for: '+nbhd.bestFor+'</div>';
      h+='<div style="font-size:14px;color:var(--text2);line-height:1.75"><span style="font-family:var(--serif);font-weight:700;font-size:38px;color:var(--gold);float:left;line-height:.85;margin:4px 10px -2px 0">'+firstChar+'</span>'+restText+'</div>';
      h+='</div>';
    }

    // Insider Tip
    var tip=hoodTips[hood]||(nbhd&&nbhd.tip)||'';
    if(tip){
      h+='<div style="margin-bottom:24px;padding:14px 16px;border-left:3px solid var(--gold);background:rgba(201,168,76,.06);border-radius:0 8px 8px 0">';
      h+='<div style="font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;font-weight:800;margin-bottom:6px">\\ud83d\\udca1 Insider Tip</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+tip+'</div></div>';
    }

    // All Nightlife Spots
    if(matches.length){
      h+=section('All Nightlife Spots','\\ud83c\\udf78',matches.slice(0,12));
    } else {
      h+='<div style="background:var(--card);border:1px dashed var(--border);border-radius:12px;padding:20px;text-align:center;font-size:12px;color:var(--text3);line-height:1.5">No nightlife spots curated for this neighborhood yet \\u2014 check back as we expand.</div>';
    }

    // Sub-sections
    if(clubs.length) h+=section('Clubs & Dancing','\\ud83e\\udea9',clubs);
    if(liveMusic.length>1) h+=section('Live Music','\\ud83c\\udfb5',liveMusic);
    if(diveBars.length>1) h+=section('Dive Bars','\\ud83c\\udf7a',diveBars);

    // Known For & Must Visit
    if(nbhd&&nbhd.knownFor){
      h+='<div style="margin-bottom:24px;padding:14px 16px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Known For</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+nbhd.knownFor+'</div></div>';
    }
    if(nbhd&&nbhd.mustVisit){
      h+='<div style="margin-bottom:24px;padding:14px 16px;background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)">';
      h+='<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px">Must Visit</div>';
      h+='<div style="font-size:12px;color:var(--text2);line-height:1.6">'+nbhd.mustVisit+'</div></div>';
    }

    // Google Maps link
    h+='<a href="https://www.google.com/maps/search/'+encodeURIComponent(hood+' '+city+' bars nightlife')+'" target="_blank" rel="noopener" style="display:block;text-align:center;padding:14px 12px 8px;font-size:11px;color:var(--text3);text-decoration:none;border-top:1px solid var(--border)">\\ud83d\\uddfa\\ufe0f Open in Google Maps</a>';

    h+='</div></div></div>';
    m.innerHTML=h;
    m.style.display='block';

    // Initialize Leaflet map
    if(typeof L!=='undefined'){
      setTimeout(function(){
        var mapEl=document.getElementById('nl-hood-map');
        if(!mapEl)return;
        var center=nbhCoords||cityCoords;
        var zoom=nbhCoords?15:13;
        try{
          var nlMap=L.map(mapEl,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:true}).setView(center,zoom);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:18,subdomains:'abcd'}).addTo(nlMap);
          matches.forEach(function(r){
            if(!r.lat||!r.lng)return;
            var sc=r.score||50;
            var color=sc>=90?'#c9a84c':sc>=80?'#4c9a6a':sc>=70?'#4c7ac9':'#5a4e38';
            L.circleMarker([r.lat,r.lng],{radius:7,fillColor:color,color:'#0e0c09',weight:1.5,fillOpacity:.9}).addTo(nlMap).bindPopup('<div style="font-family:sans-serif;min-width:120px"><b>'+r.name+'</b><br><span style="color:#9e8e6e;font-size:11px">'+(r.cuisine||'')+'</span><br><span style="color:'+color+';font-weight:bold">'+sc+'</span><br><a href="#" onclick="event.preventDefault();A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="color:#c9a84c;font-size:11px;font-weight:bold">View \\u2192</a></div>');
          });
          var withCoords=matches.filter(function(r){return r.lat&&r.lng});
          if(withCoords.length>1){
            var bounds=L.latLngBounds(withCoords.map(function(r){return[r.lat,r.lng]}));
            nlMap.fitBounds(bounds,{padding:[30,30],maxZoom:16});
          }
        }catch(e){console.warn('Nightlife hood map error:',e)}
      },400);
    }
  },`;

html = html.substring(0, startIdx) + newFunc + html.substring(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: openNightlifeHood rewritten with Spotlight-style layout');
