const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// Remove broken methods and replace with clean ones
const celebStart = h.indexOf('openCelebHotspots(){');
const nightlifeHoodStart = h.indexOf('openNightlifeHood(hood){');

if(celebStart === -1 || nightlifeHoodStart === -1){
  console.log('Methods not found');
  process.exit(1);
}

const cleanMethods = `openCelebHotspots(){
    const m=document.getElementById('event-detail-modal');
    if(!m)return;
    const city=S.city||'New York';
    const celebs={
      'Dallas':[{name:"Al Biernats",note:"Power lunch -- Mark Cuban, Jerry Jones",who:"Cowboys, Mavs",icon:"\u{1F969}"},{name:"Carbone",note:"A-list celebrities on game nights",who:"A-List, NBA",icon:"\u{1F35D}"},{name:"Nick and Sams",note:"Cowboys postgame favorite",who:"Dallas Cowboys",icon:"\u{1F969}"},{name:"Nobu Dallas",note:"Visiting NBA teams and Hollywood",who:"NBA, Hollywood",icon:"\u{1F363}"},{name:"Midnight Rambler",note:"Underground bar -- athletes after hours",who:"Musicians, Athletes",icon:"\u{1F379}"}],
      'New York':[{name:"Carbone",note:"Hardest reservation in NYC -- Jay-Z, Drake",who:"A-List, Music royalty",icon:"\u{1F35D}"},{name:"Raos",note:"Tables passed down like heirlooms",who:"NYC elite, Hollywood",icon:"\u{1F35D}"},{name:"Polo Bar",note:"Ralph Lauren -- models, media moguls",who:"Fashion, Media",icon:"\u{1F943}"},{name:"Nobu Downtown",note:"De Niro landmark -- global celebrities",who:"Hollywood, NBA",icon:"\u{1F363}"},{name:"TAO Downtown",note:"Celebrities, athletes, models",who:"NBA, Music, Influencers",icon:"\u{1F35C}"},{name:"Catch",note:"Paparazzi camp outside",who:"Influencers, Reality TV",icon:"\u{1F99E}"},{name:"Peter Luger",note:"Cash only. Jay-Z filmed here.",who:"Brooklyn Nets, Hip-hop",icon:"\u{1F969}"}]
    };
    const data=celebs[city]||celebs['New York']||[];
    let html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-size:18px;font-weight:800;color:var(--gold)">\u{1F31F} '+city+' Celebrity Hotspots</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\u2715</button></div>';
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

  openDiningTrends(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var city=S.city||'New York';
    var trends={
      'New York':[{emoji:"\u{1F355}",trend:"Neo-Pizza Renaissance",desc:"NYC pizza golden age. Una Pizza Napoletana, Lucali, and newcomers pushing the craft to new heights."},{emoji:"\u{1F32E}",trend:"Elevated Taco Culture",desc:"Tacos went from street food to fine dining. Los Tacos No. 1 leads the casual game."},{emoji:"\u{1F331}",trend:"Plant-Forward Fine Dining",desc:"EMP went vegan. Dirt Candy has a Michelin star. Vegetables are the new protein."},{emoji:"\u{1F525}",trend:"Live Fire Everything",desc:"Open-flame cooking is the hottest technique. Wood-fired, charcoal-grilled, ember-roasted."},{emoji:"\u{1F95F}",trend:"Asian Fusion 2.0",desc:"Korean, Filipino, Japanese influences everywhere -- respectful cross-pollination."}],
      'Dallas':[{emoji:"\u{1F356}",trend:"BBQ Goes Upscale",desc:"Terry Blacks brought Austin energy. Craft cocktails with prime brisket."},{emoji:"\u{1F32E}",trend:"Interior Mexican Surge",desc:"Beyond Tex-Mex: Oaxacan moles, Yucatan cochinita, Mexico City street food."},{emoji:"\u{1F378}",trend:"Cocktail Bar Boom",desc:"Dallas cocktail scene rivals NYC. Speakeasies and mezcal bars."}],
      'default':[{emoji:"\u{1F30D}",trend:"Global Flavors",desc:"Cuisines from every continent converging in American cities."}]
    };
    var data=trends[city]||trends['default'];
    var html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-size:18px;font-weight:800;color:#e06b3c">\u{1F525} '+city+' Dining Trends</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\u2715</button></div>';
    data.forEach(function(t){
      html+='<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:12px;overflow:hidden;margin-bottom:10px">';
      html+='<div style="background:linear-gradient(135deg,rgba(224,107,60,.07),rgba(224,107,60,.02));padding:12px;border-bottom:1px solid var(--border)">';
      html+='<div style="display:flex;align-items:center;gap:10px"><span style="font-size:24px">'+t.emoji+'</span>';
      html+='<div style="font-size:14px;font-weight:800;color:var(--text)">'+t.trend+'</div>';
      html+='<span style="margin-left:auto;font-size:9px;font-weight:800;color:var(--gold);background:rgba(201,168,76,.12);padding:2px 8px;border-radius:6px;border:1px solid rgba(201,168,76,.25)">TRENDING</span></div></div>';
      html+='<div style="padding:10px 12px"><div style="font-size:11px;color:var(--text2);line-height:1.6">'+t.desc+'</div></div></div>';
    });
    html+='</div></div>';
    m.innerHTML=html;
    m.style.display='block';
  },

  `;

h = h.substring(0, celebStart) + cleanMethods + h.substring(nightlifeHoodStart);
fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Replaced celeb and dining methods with clean versions');
