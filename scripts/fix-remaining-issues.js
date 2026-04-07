const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// ISSUE 3: Fix Dining Trends to have clickable restaurant links
// Replace the openDiningTrends method with one that includes restaurant matching
const dtStart = h.indexOf('  openDiningTrends(){');
const dtEnd = h.indexOf('  openNightlifeHood(hood){');
if(dtStart > -1 && dtEnd > -1){
  const newMethod = `  openDiningTrends(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var city=S.city||'New York';
    var restaurants=this.getRestaurants();
    var trends={
      'New York':[{emoji:"\\ud83c\\udf55",trend:"Neo-Pizza Renaissance",desc:"NYC pizza golden age.",spots:["Una Pizza Napoletana","Lucali","Prince Street Pizza"]},{emoji:"\\ud83c\\udf2e",trend:"Elevated Taco Culture",desc:"Tacos from street food to fine dining.",spots:["Los Tacos No. 1","Cosme","Oxomoco"]},{emoji:"\\ud83c\\udf31",trend:"Plant-Forward Fine Dining",desc:"EMP went vegan. Dirt Candy has a Michelin star.",spots:["Eleven Madison Park","Dirt Candy","ABCV"]},{emoji:"\\ud83d\\udd25",trend:"Live Fire Everything",desc:"Open-flame cooking is the hottest technique.",spots:["Frenchette","St. Anselm"]},{emoji:"\\ud83e\\udd5f",trend:"Asian Fusion 2.0",desc:"Korean, Filipino, Japanese influences everywhere.",spots:["Kasama","Dhamaka","COTE Korean Steakhouse"]},{emoji:"\\ud83c\\udf78",trend:"Cocktail Renaissance",desc:"NYC leads the world in craft cocktails.",spots:["Double Chicken Please","Attaboy","Katana Kitten"]}],
      'Dallas':[{emoji:"\\ud83c\\udf56",trend:"BBQ Goes Upscale",desc:"Terry Blacks brought Austin energy.",spots:["Terry Black's Barbecue","Pecan Lodge","Cattleack Barbeque"]},{emoji:"\\ud83c\\udf2e",trend:"Interior Mexican Surge",desc:"Beyond Tex-Mex: Oaxacan moles, Yucatan cochinita.",spots:["Xochi","Resident Taqueria"]},{emoji:"\\ud83c\\udf78",trend:"Cocktail Bar Boom",desc:"Dallas scene rivals NYC.",spots:["Midnight Rambler","Saint Valentine","Clifton Club"]}],
      'default':[{emoji:"\\ud83c\\udf0d",trend:"Global Flavors",desc:"Cuisines from every continent converging.",spots:[]}]
    };
    var data=trends[city]||trends['default'];
    var html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-size:18px;font-weight:800;color:#e06b3c">\\ud83d\\udd25 '+city+' Dining Trends</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\\u2715</button></div>';
    data.forEach(function(t){
      html+='<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:12px;overflow:hidden;margin-bottom:10px">';
      html+='<div style="background:linear-gradient(135deg,rgba(224,107,60,.07),rgba(224,107,60,.02));padding:12px;border-bottom:1px solid var(--border)">';
      html+='<div style="display:flex;align-items:center;gap:10px"><span style="font-size:24px">'+t.emoji+'</span>';
      html+='<div style="font-size:14px;font-weight:800;color:var(--text)">'+t.trend+'</div>';
      html+='<span style="margin-left:auto;font-size:9px;font-weight:800;color:var(--gold);background:rgba(201,168,76,.12);padding:2px 8px;border-radius:6px;border:1px solid rgba(201,168,76,.25)">TRENDING</span></div></div>';
      html+='<div style="padding:10px 12px"><div style="font-size:11px;color:var(--text2);line-height:1.6;margin-bottom:8px">'+t.desc+'</div>';
      if(t.spots && t.spots.length){
        html+='<div style="display:flex;flex-wrap:wrap;gap:4px">';
        t.spots.forEach(function(s){
          var match=restaurants.find(function(r){return r.name===s||r.name.includes(s)||s.includes(r.name);});
          if(match){
            html+='<span onclick="event.stopPropagation();A.openDetail('+match.id+');document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="font-size:10px;background:rgba(201,168,76,.08);color:var(--gold);padding:3px 9px;border-radius:12px;border:1px solid rgba(201,168,76,.2);cursor:pointer;font-weight:600">'+s+' \\u2192</span>';
          } else {
            html+='<span style="font-size:10px;background:var(--card2);color:var(--text3);padding:3px 8px;border-radius:12px;border:1px solid var(--border)">'+s+'</span>';
          }
        });
        html+='</div>';
      }
      html+='</div></div>';
    });
    html+='</div></div>';
    m.innerHTML=html;
    m.style.display='block';
  },

  `;
  h = h.substring(0, dtStart) + newMethod + h.substring(dtEnd);
  console.log('ISSUE 3: Fixed Dining Trends with clickable restaurant links');
}

// ISSUE 4: More celebrity hotspots
// Update the openCelebHotspots method with more spots
const csStart = h.indexOf('  openCelebHotspots(){');
const csEnd = h.indexOf('  openDiningTrends(){');
if(csStart > -1 && csEnd > -1){
  const newCeleb = `  openCelebHotspots(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var city=S.city||'New York';
    var celebs={
      'Dallas':[
        {name:"Al Biernats",note:"Power lunch -- Mark Cuban, Jerry Jones, Troy Aikman regulars",who:"\\ud83c\\udfc8 Cowboys \\u00b7 \\ud83c\\udfc0 Mavs ownership",icon:"\\ud83e\\udd69"},
        {name:"Carbone",note:"Major Food Group hottest table -- A-list on game nights",who:"\\ud83c\\udf1f A-List \\u00b7 \\ud83c\\udfc0 NBA players",icon:"\\ud83c\\udf5d"},
        {name:"Nick and Sams",note:"Cowboys postgame favorite -- private dining for team dinners",who:"\\ud83c\\udfc8 Dallas Cowboys",icon:"\\ud83e\\udd69"},
        {name:"Town Hearth",note:"Exotic cars in the dining room, VIP bottle service",who:"\\ud83c\\udfc8 NFL \\u00b7 \\ud83c\\udfa4 Music industry",icon:"\\ud83c\\udf56"},
        {name:"Nobu Dallas",note:"Visiting NBA teams and Hollywood celebrities at the Crescent",who:"\\ud83c\\udfc0 Visiting NBA \\u00b7 \\ud83c\\udfac Hollywood",icon:"\\ud83c\\udf63"},
        {name:"Midnight Rambler",note:"Underground cocktail bar -- athletes and musicians after hours",who:"\\ud83c\\udfa4 Musicians \\u00b7 \\ud83c\\udfc0 Athletes",icon:"\\ud83c\\udf79"},
        {name:"Delilah Dallas",note:"Late-night scene attracts athletes, influencers, celebrities",who:"\\ud83c\\udfc0 NBA \\u00b7 \\ud83d\\udcf1 Influencers",icon:"\\ud83c\\udf78"},
        {name:"The Mansion on Turtle Creek",note:"Old-money Dallas power dining -- where deals get done",who:"\\ud83d\\udcbc Business elite \\u00b7 \\ud83c\\udfc8 Ownership",icon:"\\ud83c\\udff0"},
        {name:"Javiers",note:"Legendary Dallas scene -- celebrities, socialites, cigar lounge",who:"\\ud83c\\udf1f Dallas society \\u00b7 \\ud83c\\udfac Celebs",icon:"\\ud83c\\udf2e"},
        {name:"Fearings",note:"Hotel restaurant at The Ritz -- visiting teams, celebrity chefs",who:"\\ud83c\\udfc0 Visiting teams \\u00b7 \\ud83c\\udf73 Chefs",icon:"\\ud83e\\udd20"},
        {name:"Catch Dallas",note:"Rooftop seafood scene -- Instagram influencers and athletes",who:"\\ud83d\\udcf1 Influencers \\u00b7 \\ud83c\\udfc8 Athletes",icon:"\\ud83e\\udd9e"},
        {name:"Sadelles",note:"NYC import -- hardest brunch reservation in Highland Park",who:"\\ud83c\\udf1f Highland Park society",icon:"\\ud83e\\udd5e"}
      ],
      'New York':[
        {name:"Carbone",note:"Hardest reservation in NYC -- Jay-Z, Drake, Kim K regulars",who:"\\ud83c\\udf1f A-List \\u00b7 \\ud83c\\udfa4 Music royalty",icon:"\\ud83c\\udf5d"},
        {name:"Raos",note:"115-year-old institution. Tables passed down like family heirlooms.",who:"\\ud83c\\udf1f NYC elite \\u00b7 \\ud83c\\udfac Hollywood",icon:"\\ud83c\\udf5d"},
        {name:"Polo Bar",note:"Ralph Lauren private club feel -- models, media moguls, old money",who:"\\ud83d\\udcbc Fashion \\u00b7 \\ud83d\\udcfa Media moguls",icon:"\\ud83e\\udd43"},
        {name:"The Grill",note:"Power lunch in the former Four Seasons space. Wall Street titans.",who:"\\ud83d\\udcbc Wall Street \\u00b7 \\ud83c\\udfdb\\ufe0f Power brokers",icon:"\\ud83e\\udd69"},
        {name:"Nobu Downtown",note:"De Niro landmark -- global celebrities and visiting athletes",who:"\\ud83c\\udfac Hollywood \\u00b7 \\ud83c\\udfc0 NBA stars",icon:"\\ud83c\\udf63"},
        {name:"TAO Downtown",note:"Massive nightclub-restaurant -- celebrities, athletes, models",who:"\\ud83c\\udfc0 NBA \\u00b7 \\ud83c\\udfa4 Music \\u00b7 \\ud83d\\udcf1 Influencers",icon:"\\ud83c\\udf5c"},
        {name:"Catch",note:"Meatpacking rooftop -- paparazzi camp outside nightly",who:"\\ud83d\\udcf1 Influencers \\u00b7 \\ud83c\\udfac Reality TV",icon:"\\ud83e\\udd9e"},
        {name:"Peter Luger",note:"Cash only. Jay-Z filmed here. Porterhouse unmatched.",who:"\\ud83c\\udfc0 Brooklyn Nets \\u00b7 \\ud83c\\udfa4 Hip-hop",icon:"\\ud83e\\udd69"},
        {name:"Balthazar",note:"Keith McNally SoHo institution -- fashion week HQ since 1997",who:"\\ud83d\\udc57 Fashion \\u00b7 \\ud83c\\udfac Film industry",icon:"\\ud83e\\udd50"},
        {name:"Eleven Madison Park",note:"Three Michelin stars -- tech billionaires, celebrities, foodies",who:"\\ud83d\\udcbb Tech \\u00b7 \\ud83c\\udf1f Foodies",icon:"\\ud83c\\udf31"},
        {name:"Lucali",note:"Jay-Z and Beyonce favorite pizza. No reservations. Cash only.",who:"\\ud83c\\udfa4 Jay-Z & Beyonce \\u00b7 \\ud83c\\udf1f A-List",icon:"\\ud83c\\udf55"},
        {name:"Le Bernardin",note:"Eric Ripert three Michelin star seafood -- celebrity chef dining",who:"\\ud83c\\udf73 Celebrity chefs \\u00b7 \\ud83c\\udf1f Foodies",icon:"\\ud83e\\udd9e"},
        {name:"Bemelmans Bar at The Carlyle",note:"Live jazz, Madeline murals -- presidents and royalty",who:"\\ud83c\\udfdb\\ufe0f Presidents \\u00b7 \\ud83d\\udc51 Royalty",icon:"\\ud83c\\udf78"},
        {name:"Via Carota",note:"West Village Italian -- fashion editors, models, celebrities",who:"\\ud83d\\udc57 Fashion \\u00b7 \\ud83c\\udfac Film",icon:"\\ud83c\\udf5d"},
        {name:"Sant Ambroeus",note:"Milanese cafe -- unofficial fashion industry canteen",who:"\\ud83d\\udc57 Fashion \\u00b7 \\ud83d\\udcbc Media",icon:"\\u2615"}
      ]
    };
    var data=celebs[city]||celebs['New York']||[];
    var html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-size:18px;font-weight:800;color:var(--gold)">\\ud83c\\udf1f '+city+' Celebrity Hotspots</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\\u2715</button></div>';
    html+='<div style="font-size:11px;color:var(--text3);margin-bottom:14px">Where celebrities, athletes, and power players eat in '+city+'</div>';
    data.forEach(function(c){
      html+='<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:12px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px">';
      html+='<div style="font-size:28px;flex-shrink:0">'+c.icon+'</div>';
      html+='<div><div style="font-size:14px;font-weight:700;color:var(--text)">'+c.name+'</div>';
      html+='<div style="font-size:11px;color:var(--text2);margin-top:2px">'+c.note+'</div>';
      html+='<div style="font-size:10px;color:var(--gold);margin-top:3px;font-weight:600">'+c.who+'</div></div></div>';
    });
    html+='</div></div>';
    m.innerHTML=html;
    m.style.display='block';
  },

  `;
  h = h.substring(0, csStart) + newCeleb + h.substring(csEnd);
  console.log('ISSUE 4: Updated Celebrity Hotspots with more spots (NYC: 15, Dallas: 12)');
}

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
