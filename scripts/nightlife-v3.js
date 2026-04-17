#!/usr/bin/env node
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find openNightlifeGuide boundaries
const fnStart = html.indexOf('  openNightlifeGuide(){');
const fnEndMarker = '  setDiscoverNightlifeCity(name){';
const fnEndIdx = html.indexOf(fnEndMarker);
// Find the end of setDiscoverNightlifeCity
const setDiscEnd = html.indexOf('},', fnEndIdx) + 2;
// Next function after that
const nextLine = html.indexOf('\n', setDiscEnd) + 1;

if (fnStart === -1 || fnEndIdx === -1) {
  console.error('Could not find function boundaries:', fnStart, fnEndIdx);
  process.exit(1);
}

console.log('Replacing from char', fnStart, 'to', nextLine);

const newCode = `  openNightlifeGuide(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var city=S.city||'Dallas';
    var restaurants=this.getRestaurants();

    // Category filters
    var cocktailBars=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/cocktail/i.test(t)})||(r.cuisine||'').toLowerCase().indexOf('cocktail')>-1||(r.cuisine||'').toLowerCase().indexOf('wine bar')>-1}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var clubs=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().match(/club|disco|nightclub/)||(r.tags||[]).some(function(t){return/club|dancing/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var rooftops=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/rooftop/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var jazz=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().indexOf('jazz')>-1||(r.tags||[]).some(function(t){return/jazz/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var liveMusic=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().indexOf('live music')>-1||(r.tags||[]).some(function(t){return/live music/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var lateNight=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/late night/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var diveBars=restaurants.filter(function(r){return(r.indicators||[]).indexOf('dive-bar')>-1||(r.tags||[]).some(function(t){return/dive/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);
    var speakeasy=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/speakeasy|hidden|exclusive/i.test(t)})&&(r.tags||[]).some(function(t){return/cocktail|bar/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,8);

    // Venue tile
    function tile(r,i){
      var priceStr=r.price?'$'.repeat(r.price):'';
      var hhBadge=(r.hh&&r.hh!=='')?'<span style="font-size:9px;color:var(--gold);background:rgba(201,168,76,.1);padding:1px 6px;border-radius:6px;border:1px solid rgba(201,168,76,.2)">\\ud83c\\udf78 HH</span>':'';
      return '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);border:1px solid var(--border);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s,transform .1s" onmouseover="this.style.borderColor=\\'var(--gold)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\';this.style.transform=\\'\\'"><div style="font-family:var(--serif);font-style:italic;font-size:18px;font-weight:700;color:var(--gold);flex-shrink:0;width:20px;text-align:center">'+(i+1)+'</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.name+'</div><div style="font-size:10px;color:var(--text3);margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">'+(r.neighborhood||'')+(priceStr?' \\u00b7 '+priceStr:'')+' '+hhBadge+'</div></div><div style="font-size:16px;font-weight:800;color:var(--gold);flex-shrink:0;background:rgba(201,168,76,.08);padding:4px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.15)">'+r.score+'</div></div>';
    }

    // Section builder
    function section(id,title,emoji,spots){
      if(!spots.length) return '';
      var inner=spots.map(tile).join('');
      return '<div id="nl-'+id+'" style="margin-bottom:24px;scroll-margin-top:70px">'
        +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)">'
        +'<span style="font-size:18px">'+emoji+'</span>'
        +'<span style="font-size:14px;font-weight:800;color:var(--text);letter-spacing:.01em">'+title+'</span>'
        +'<span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--gold);background:rgba(201,168,76,.08);padding:2px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.15)">'+spots.length+'</span>'
        +'</div>'
        +'<div style="display:flex;flex-direction:column;gap:6px">'+inner+'</div>'
        +'</div>';
    }

    // Neighborhoods
    var hoods={
      'New York':[
        {name:'Meatpacking District',emoji:'\\ud83e\\udea9',desc:'Clubs, rooftops, see-and-be-seen'},
        {name:'Lower East Side',emoji:'\\ud83c\\udfb5',desc:'Dive bars, live music, cocktails'},
        {name:'Williamsburg',emoji:'\\ud83c\\udfa8',desc:'Rooftops, warehouses, DJ sets'},
        {name:'West Village',emoji:'\\ud83c\\udfba',desc:'Jazz, cocktail bars, intimate'},
        {name:'East Village',emoji:'\\ud83c\\udfd9\\ufe0f',desc:'Dive bars, sake bars, late night'},
        {name:'Bushwick',emoji:'\\ud83c\\udf06',desc:'Warehouse parties, House of Yes'}
      ],
      'Dallas':[
        {name:'Deep Ellum',emoji:'\\ud83c\\udfb5',desc:'Live music, dive bars, late night'},
        {name:'Uptown',emoji:'\\ud83c\\udf78',desc:'Rooftop bars, cocktails, nightclubs'},
        {name:'Knox-Henderson',emoji:'\\ud83c\\udf7a',desc:'Craft cocktails, wine bars, lounges'},
        {name:'Bishop Arts',emoji:'\\ud83c\\udfa8',desc:'Cozy bars, live music, artsy vibes'},
        {name:'Design District',emoji:'\\ud83e\\udea9',desc:'Speakeasies, champagne bars, clubs'},
        {name:'Lower Greenville',emoji:'\\ud83c\\udf1d',desc:'Dive bars, tacos at 2 AM, karaoke'},
        {name:'Oak Lawn',emoji:'\\ud83c\\udf08',desc:'Cedar Springs strip, LGBTQ+ nightlife'},
        {name:'Victory Park',emoji:'\\ud83c\\udfc0',desc:'Pre-game bars, rooftops, late night'}
      ],
      'Houston':[
        {name:'Montrose',emoji:'\\ud83c\\udf08',desc:'Dive bars, cocktail lounges, eclectic'},
        {name:'Washington Corridor',emoji:'\\ud83c\\udfb5',desc:'High-energy bars and lounges'},
        {name:'Midtown',emoji:'\\ud83c\\udf7e',desc:'Bar crawl central, late night'},
        {name:'Heights',emoji:'\\ud83c\\udf7a',desc:'Craft beer, patio bars, laid back'},
        {name:'EaDo',emoji:'\\u26be',desc:'Breweries, game day, growing scene'}
      ],
      'Chicago':[
        {name:'Wicker Park',emoji:'\\ud83c\\udfa8',desc:'Cocktail bars, live music, late night'},
        {name:'River North',emoji:'\\ud83e\\udea9',desc:'Nightclubs, steakhouses, rooftops'},
        {name:'West Loop',emoji:'\\ud83c\\udf78',desc:'Craft cocktails, after-dinner drinks'},
        {name:'Logan Square',emoji:'\\ud83c\\udf1d',desc:'Tiki bars, dive bars, mezcal'},
        {name:'Lincoln Park',emoji:'\\ud83c\\udf7a',desc:'Classic bar crawl territory'},
        {name:'Pilsen',emoji:'\\ud83c\\udfa8',desc:'Mezcaler\\u00edas, murals, live music'}
      ],
      'Austin':[
        {name:'6th Street',emoji:'\\ud83c\\udf1d',desc:'Famous strip, rowdy bars, live music'},
        {name:'Rainey Street',emoji:'\\ud83c\\udf34',desc:'Bungalow bars, massive patios'},
        {name:'East Austin',emoji:'\\ud83c\\udfa8',desc:'Honky-tonk, craft cocktails, creative'},
        {name:'Red River',emoji:'\\ud83c\\udfb5',desc:'Live music backbone, SXSW showcases'},
        {name:'South Congress',emoji:'\\ud83c\\udfb6',desc:'Continental Club, late-night tacos'},
        {name:'The Domain',emoji:'\\ud83c\\udf06',desc:'Upscale outdoor, rooftop bars'}
      ],
      'Salt Lake City':[
        {name:'Downtown SLC',emoji:'\\ud83c\\udf78',desc:'Main St cocktail bars, speakeasies'},
        {name:'Sugar House',emoji:'\\ud83c\\udf7a',desc:'Walkable, breweries, local crowd'},
        {name:'9th & 9th',emoji:'\\ud83c\\udf1f',desc:'Chef-driven, grown-up, wine bars'},
        {name:'Main St (Park City)',emoji:'\\u26f7\\ufe0f',desc:'Apr\\u00e8s-ski, whiskey, Sundance'},
        {name:'Granary District',emoji:'\\ud83c\\udfed',desc:'Brewery corridor, cocktail temple'}
      ],
      'Seattle':[
        {name:'Capitol Hill',emoji:'\\ud83c\\udf08',desc:'LGBTQ+, dive bars, live music hub'},
        {name:'Ballard',emoji:'\\ud83c\\udf7a',desc:'Breweries, gastropubs, laid-back'},
        {name:'Fremont',emoji:'\\ud83c\\udfa8',desc:'Quirky, craft beer, neighborhood pubs'},
        {name:'Pioneer Square',emoji:'\\ud83c\\udfb5',desc:'Jazz, historic bars, late night'},
        {name:'Belltown',emoji:'\\ud83c\\udf78',desc:'Cocktail bars, clubs, downtown energy'},
        {name:'Georgetown',emoji:'\\ud83c\\udfed',desc:'Dive bars, breweries, underground'}
      ],
      'Las Vegas':[
        {name:'The Strip',emoji:'\\ud83c\\udfb0',desc:'Mega-clubs, celebrity DJs, pool parties'},
        {name:'Fremont Street',emoji:'\\ud83c\\udf1f',desc:'Downtown, Circa rooftop, old Vegas'},
        {name:'Arts District',emoji:'\\ud83c\\udfa8',desc:'Craft cocktails, breweries, locals'},
        {name:'Chinatown',emoji:'\\ud83c\\udf7a',desc:'Late-night eats, karaoke, dive bars'},
        {name:'Downtown/Circa',emoji:'\\ud83c\\udf06',desc:'Stadium Swim, rooftop pool, new energy'}
      ]
    };

    // Pro tips
    var tips={
      'New York':'\\u2022 Most clubs busiest Fri-Sat after 11 PM. Door policies are real in Meatpacking.<br>\\u2022 Speakeasies often have no sign \\u2014 save the address. Attaboy and PDT are legendary.<br>\\u2022 Best cocktail bars: arrive before 9 PM to avoid the wait.<br>\\u2022 Jazz clubs often have a cover + drink minimum.<br>\\u2022 Late night food: Chinatown, LES delis, and slice shops until 4 AM.',
      'Dallas':'\\u2022 Deep Ellum is busiest Fri-Sat after 10 PM. Uber or DART \\u2014 parking fills up fast.<br>\\u2022 Uptown bars along McKinney Ave are walkable. Trolley runs late on weekends.<br>\\u2022 Bishop Arts is the best neighborhood for a chill, walkable night out.<br>\\u2022 Best cocktail bars: Midnight Rambler, Atwater Alley, Apothecary. Arrive early.<br>\\u2022 Late night: tacos in Deep Ellum, Whataburger everywhere, Keller\\'s Drive-In.',
      'Houston':'\\u2022 Montrose is the most walkable bar strip \\u2014 Westheimer Rd from Anvil to Poison Girl.<br>\\u2022 Washington Corridor is high-energy but parking is a nightmare. Uber recommended.<br>\\u2022 Best cocktail bars: Anvil, Julep, Reserve 101. Arrive before 9 PM.<br>\\u2022 EaDo is growing fast near the stadiums \\u2014 great pre/post-game scene.<br>\\u2022 Late night: Chinatown (Bellaire Blvd) is open late. Tacos El Gordo + Whataburger.',
      'Chicago':'\\u2022 Wicker Park and Logan Square are the craft cocktail hubs. Division St is the main drag.<br>\\u2022 River North is bottle-service territory \\u2014 dress up and expect a door policy.<br>\\u2022 Best cocktail bars: The Violet Hour, Lost Lake, The Aviary. Reserve ahead.<br>\\u2022 Pilsen has the most culturally rich nightlife \\u2014 mezcaler\\u00edas and live music.<br>\\u2022 Late night: tacos in Pilsen, Jim\\'s Original on Maxwell, Portillo\\'s.',
      'Austin':'\\u2022 6th Street: Dirty Sixth is college chaos; West 6th skews upscale. Midnight Cowboy is hidden.<br>\\u2022 Rainey Street bungalow bars are walkable \\u2014 no cover, casual vibes, huge patios.<br>\\u2022 Red River Cultural District is the live music backbone \\u2014 Mohawk, Stubb\\'s, Empire.<br>\\u2022 White Horse on East 6th for honky-tonk two-stepping. Continental Club since 1955.<br>\\u2022 Late night: tacos everywhere. Veracruz All Natural, Torchy\\'s, or any East Austin truck.',
      'Salt Lake City':'\\u2022 Post-reform SLC is a legit cocktail city. Under Current and Bar X lead the way.<br>\\u2022 Sugar House is the most walkable neighborhood bar crawl \\u2014 local, no tourists.<br>\\u2022 Park City Main Street is the apr\\u00e8s-ski scene. High West Saloon pours steps from the lift.<br>\\u2022 Granary District has Fisher, Kiitos, and Epic Brewing within walking distance.<br>\\u2022 Utah liquor laws: bars serve until 1 AM. Beer is full-strength. Restaurants serve wine/spirits with food.',
      'Seattle':'\\u2022 Capitol Hill is the beating heart \\u2014 Pike/Pine corridor has the densest bar scene.<br>\\u2022 Ballard breweries: Reuben\\'s, Stoup, Holy Mountain \\u2014 walkable taproom crawl.<br>\\u2022 Pioneer Square for jazz \\u2014 Dimitriou\\'s Jazz Alley is the legendary venue.<br>\\u2022 Belltown clubs and cocktail bars are the downtown late-night anchor.<br>\\u2022 Last call is 2 AM everywhere. After-hours food: International District and Capitol Hill.',
      'Las Vegas':'\\u2022 Mega-clubs (Hakkasan, XS, Omnia) require guest list or bottle service. Arrive by 10:30 PM.<br>\\u2022 Fremont Street + Circa rooftop (Stadium Swim) is the new Downtown energy.<br>\\u2022 Arts District on Main St is where locals actually drink \\u2014 Velveteen Rabbit, Able Baker.<br>\\u2022 Pool parties (daylife) are a Vegas institution. Encore Beach Club and Wet Republic lead.<br>\\u2022 Late night: Chinatown on Spring Mountain Rd is open until 3-4 AM. Best late eats in the city.'
    };

    // Category jump chips
    var cats=[
      {id:'cocktails',label:'Bars',emoji:'\\ud83c\\udf78',count:cocktailBars.length},
      {id:'rooftops',label:'Rooftops',emoji:'\\ud83c\\udf06',count:rooftops.length},
      {id:'clubs',label:'Clubs',emoji:'\\ud83e\\udea9',count:clubs.length},
      {id:'jazz',label:'Jazz',emoji:'\\ud83c\\udfba',count:jazz.length},
      {id:'live',label:'Live Music',emoji:'\\ud83c\\udfb5',count:liveMusic.length},
      {id:'latenight',label:'Late Night',emoji:'\\ud83c\\udf19',count:lateNight.length},
      {id:'dives',label:'Dive Bars',emoji:'\\ud83c\\udf7a',count:diveBars.length},
      {id:'speakeasy',label:'Speakeasies',emoji:'\\ud83d\\udd11',count:speakeasy.length},
      {id:'hoods',label:'Hoods',emoji:'\\ud83d\\udccd',count:(hoods[city]||[]).length}
    ];

    // Build modal
    var h='<div style="position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=\\'none\\'">';
    h+='<div id="nightlife-scroller" style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto;position:relative">';

    // Sticky header
    h+='<div style="position:sticky;top:0;z-index:10;background:linear-gradient(180deg,rgba(10,13,20,.98),rgba(10,13,20,.94));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:14px 16px 10px">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:700;padding:7px 12px;border-radius:18px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;touch-action:manipulation">\\u2190 Back</button>';
    h+='<div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:800;color:var(--gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\\ud83e\\udea9 '+city+' Nightlife</div><div style="font-size:10px;color:var(--text3);margin-top:1px">Bars \\u00b7 Clubs \\u00b7 Where the locals go</div></div>';
    h+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0;touch-action:manipulation">\\u2715</button>';
    h+='</div>';

    // Category jump chips
    h+='<div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 0 2px;margin:0 -2px">';
    cats.forEach(function(c){
      var dim=c.count===0;
      h+='<button onclick="event.stopPropagation();var el=document.getElementById(\\'nl-'+c.id+'\\');if(el){el.scrollIntoView({behavior:\\'smooth\\',block:\\'start\\'})}" style="flex-shrink:0;background:'+(dim?'var(--card2)':'rgba(201,168,76,.08)')+';border:1px solid '+(dim?'var(--border)':'rgba(201,168,76,.2)')+';color:'+(dim?'var(--text3)':'var(--gold)')+';font-size:11px;font-weight:700;padding:6px 11px;border-radius:16px;cursor:pointer;white-space:nowrap;font-family:inherit;touch-action:manipulation">'+c.emoji+' '+c.label+(c.count?' <span style=\\"font-size:9px;opacity:.7\\">'+c.count+'</span>':'')+'</button>';
    });
    h+='</div></div>';

    // Body
    h+='<div style="padding:18px 16px 40px">';

    // Neighborhoods
    var cityHoods=hoods[city]||[];
    if(cityHoods.length){
      h+='<div id="nl-hoods" style="margin-bottom:24px;scroll-margin-top:70px">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)"><span style="font-size:18px">\\ud83d\\udccd</span><span style="font-size:14px;font-weight:800;color:var(--text)">Nightlife Neighborhoods</span></div>';
      h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      cityHoods.forEach(function(hood){
        h+='<div onclick="A.openNightlifeHood(\\''+hood.name.replace(/'/g,"\\\\\\'")+'\\');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'"><div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:3px">'+hood.emoji+' '+hood.name+'</div><div style="font-size:10px;color:var(--text3);line-height:1.4">'+hood.desc+'</div></div>';
      });
      h+='</div></div>';
    }

    // Category sections
    h+=section('cocktails','Best Bars & Cocktails','\\ud83c\\udf78',cocktailBars);
    h+=section('rooftops','Rooftop Bars','\\ud83c\\udf06',rooftops);
    h+=section('clubs','Clubs & Dancing','\\ud83e\\udea9',clubs);
    h+=section('jazz','Jazz Clubs','\\ud83c\\udfba',jazz);
    h+=section('live','Live Music Venues','\\ud83c\\udfb5',liveMusic);
    h+=section('latenight','Late Night Eats','\\ud83c\\udf19',lateNight);
    h+=section('dives','Dive Bars','\\ud83c\\udf7a',diveBars);
    h+=section('speakeasy','Speakeasies & Hidden Bars','\\ud83d\\udd11',speakeasy);

    // Pro tips
    var cityTips=tips[city]||'\\u2022 Most clubs are busiest Fri-Sat after 11 PM.<br>\\u2022 Best cocktail bars: arrive before 9 PM to avoid the wait.<br>\\u2022 Check the app for late-night spots open past midnight.';
    h+='<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-top:8px">';
    h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:16px">\\ud83d\\udca1</span><span style="font-size:13px;font-weight:800;color:var(--gold)">Pro Tips</span></div>';
    h+='<div style="font-size:11px;color:var(--text2);line-height:1.7">'+cityTips+'</div>';
    h+='</div>';

    h+='</div></div></div>';
    m.innerHTML=h;
    m.style.display='block';
  },

`;

html = html.substring(0, fnStart) + newCode + html.substring(nextLine);
console.log('Replaced openNightlifeGuide + setDiscoverNightlifeCity with v3 design');

// Verify setDiscoverNightlifeCity references are gone from the HTML onclick handlers
// (the Discover card just calls A.openNightlifeGuide() so that's fine)
console.log('setDiscoverNightlifeCity still referenced:', html.indexOf('setDiscoverNightlifeCity') > -1);

// We need openNightlifeHood back since the neighborhoods link to it
// Check if it exists
console.log('openNightlifeHood exists:', html.indexOf('openNightlifeHood') > -1);

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
