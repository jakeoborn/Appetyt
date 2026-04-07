const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Add Nightlife Guide card right after Weekend Guides card in Discover tab
const weekendGuideEnd = `</div>
        </div>

        \${hasActivities ? \``;
const weekendGuideIdx = html.indexOf(weekendGuideEnd);

if(weekendGuideIdx > -1){
  const nightlifeCard = `</div>
        </div>

        <!-- NIGHTLIFE GUIDE -->
        <div class="discover-section" style="margin-top:8px;margin-bottom:12px">
          <div onclick="A.openNightlifeGuide()" style="background:linear-gradient(145deg,rgba(180,58,180,.15),rgba(100,20,120,.1));border:2px solid #b09ec9;border-radius:14px;padding:18px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;box-shadow:0 0 8px rgba(176,158,201,.2)">
            <div>
              <div style="font-size:16px;font-weight:800;color:#b09ec9">🪩 Nightlife Guide</div>
              <div style="font-size:12px;color:var(--text2);margin-top:3px">Best clubs · Cocktail bars · Late night · Where the locals go</div>
            </div>
            <div style="font-size:22px;color:#b09ec9">›</div>
          </div>
        </div>

        \${hasActivities ? \``;
  html = html.replace(weekendGuideEnd, nightlifeCard);
  console.log('Added Nightlife Guide card to Discover tab');
} else {
  console.log('Could not find Weekend Guide insertion point');
}

// 2. Add openNightlifeGuide method
const renderUpcomingMarker = '  renderUpcoming(){';
const ruIdx = html.indexOf(renderUpcomingMarker);
if(ruIdx > -1 && !html.includes('openNightlifeGuide')){
  const nightlifeMethod = `  openNightlifeGuide(){
    const m = document.getElementById('event-detail-modal');
    if(!m) return;
    const city = S.city || 'New York';
    const restaurants = this.getRestaurants();

    // Get nightlife spots from our data
    const cocktailBars = restaurants.filter(r=>(r.tags||[]).some(t=>/cocktail/i.test(t))||(r.cuisine||'').toLowerCase().includes('cocktail')).sort((a,b)=>b.score-a.score).slice(0,6);
    const clubs = restaurants.filter(r=>(r.cuisine||'').toLowerCase().match(/club|disco/)||(r.tags||[]).some(t=>/club/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);
    const lateNight = restaurants.filter(r=>(r.tags||[]).some(t=>/late night/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);
    const rooftops = restaurants.filter(r=>(r.tags||[]).some(t=>/rooftop/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);
    const diveBars = restaurants.filter(r=>(r.indicators||[]).includes('dive-bar')||(r.tags||[]).some(t=>/dive/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);
    const jazz = restaurants.filter(r=>(r.cuisine||'').toLowerCase().includes('jazz')||(r.tags||[]).some(t=>/jazz/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);
    const liveMusic = restaurants.filter(r=>(r.cuisine||'').toLowerCase().includes('live music')||(r.tags||[]).some(t=>/live music/i.test(t))).sort((a,b)=>b.score-a.score).slice(0,6);

    const cardRow = (spots, emoji) => spots.map(r=>
      '<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="flex-shrink:0;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px 12px;cursor:pointer;min-width:140px;max-width:160px">'+
      '<div style="font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(emoji||'')+' '+r.name+'</div>'+
      '<div style="font-size:10px;color:var(--text3)">'+r.neighborhood+' · <span style="color:var(--gold)">'+r.score+'</span></div>'+
      '</div>'
    ).join('');

    const nycNeighborhoods = city === 'New York' ? '<div style="margin-bottom:16px">'+
      '<div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">📍 Nightlife Neighborhoods</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🪩 Meatpacking</div><div style="font-size:10px;color:var(--text3)">Clubs, rooftops, see-and-be-seen</div></div>'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🎵 Lower East Side</div><div style="font-size:10px;color:var(--text3)">Dive bars, live music, cocktails</div></div>'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🎨 Williamsburg</div><div style="font-size:10px;color:var(--text3)">Rooftops, warehouses, DJ sets</div></div>'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🎺 West Village</div><div style="font-size:10px;color:var(--text3)">Jazz, cocktail bars, intimate</div></div>'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🏙️ East Village</div><div style="font-size:10px;color:var(--text3)">Dive bars, sake bars, late night</div></div>'+
        '<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px"><div style="font-size:12px;font-weight:700;color:var(--gold)">🌆 Bushwick</div><div style="font-size:10px;color:var(--text3)">Warehouse parties, House of Yes</div></div>'+
      '</div></div>' : '';

    m.innerHTML = '<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=\\'none\\'">'+
      '<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
          '<div style="font-size:18px;font-weight:800;color:#b09ec9">🪩 '+city+' Nightlife Guide</div>'+
          '<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">✕</button>'+
        '</div>'+

        nycNeighborhoods +

        (cocktailBars.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🍸 Best Cocktail Bars</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(cocktailBars,'🍸')+'</div></div>':'')+
        (rooftops.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🌆 Rooftop Bars</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(rooftops,'🌆')+'</div></div>':'')+
        (clubs.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🪩 Clubs & Dancing</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(clubs,'🪩')+'</div></div>':'')+
        (jazz.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🎺 Jazz Clubs</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(jazz,'🎺')+'</div></div>':'')+
        (liveMusic.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🎵 Live Music Venues</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(liveMusic,'🎵')+'</div></div>':'')+
        (lateNight.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🌙 Late Night Eats</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(lateNight,'🌙')+'</div></div>':'')+
        (diveBars.length?'<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">🍺 Dive Bars</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(diveBars,'🍺')+'</div></div>':'')+

        '<div style="background:linear-gradient(135deg,rgba(180,58,180,.1),rgba(100,20,120,.05));border:1px solid rgba(176,158,201,.25);border-radius:12px;padding:14px;margin-top:8px">'+
          '<div style="font-size:13px;font-weight:700;color:#b09ec9;margin-bottom:6px">💡 Pro Tips</div>'+
          '<div style="font-size:11px;color:var(--text2);line-height:1.6">'+
            '• Most clubs and trendy bars are busiest Fri-Sat after 11 PM<br>'+
            '• Speakeasies often have no sign -- save the address<br>'+
            '• Many rooftop bars close in winter or switch to enclosed<br>'+
            '• The best cocktail bars take walk-ins but arrive before 9 PM<br>'+
            '• Jazz clubs often have a cover + drink minimum<br>'+
            '• Late night food: Chinatown, LES delis, slice shops open until 4 AM'+
          '</div>'+
        '</div>'+
      '</div></div>';
    m.style.display='block';
  },

  `;
  html = html.substring(0, ruIdx) + nightlifeMethod + html.substring(ruIdx);
  console.log('Added openNightlifeGuide method');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
