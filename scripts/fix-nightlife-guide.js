const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// Replace the entire openNightlifeGuide method with a clean version
const ngStart = h.indexOf('openNightlifeGuide(){');
const ruStart = h.indexOf('  renderUpcoming(){');

if(ngStart === -1 || ruStart === -1){
  console.log('Methods not found', ngStart, ruStart);
  process.exit(1);
}

// Build clean method using var html+= approach (no template literal escaping issues)
const cleanMethod = `openNightlifeGuide(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var city=S.city||'New York';
    var restaurants=this.getRestaurants();
    var cocktailBars=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/cocktail/i.test(t)})||(r.cuisine||'').toLowerCase().includes('cocktail')}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var clubs=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().match(/club|disco/)||(r.tags||[]).some(function(t){return/club/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var lateNight=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/late night/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var rooftops=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/rooftop/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var diveBars=restaurants.filter(function(r){return(r.indicators||[]).includes('dive-bar')||(r.tags||[]).some(function(t){return/dive/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var jazz=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().includes('jazz')||(r.tags||[]).some(function(t){return/jazz/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var liveMusic=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().includes('live music')||(r.tags||[]).some(function(t){return/live music/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var comedy=restaurants.filter(function(r){return(r.cuisine||'').toLowerCase().includes('comedy')||(r.tags||[]).some(function(t){return/comedy/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);
    var speakeasy=restaurants.filter(function(r){return(r.tags||[]).some(function(t){return/speakeasy|hidden|exclusive/i.test(t)})&&(r.tags||[]).some(function(t){return/cocktail|bar/i.test(t)})}).sort(function(a,b){return b.score-a.score}).slice(0,6);

    function cardRow(spots,emoji){
      return spots.map(function(r){
        return '<div onclick="A.openDetail('+r.id+');document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="flex-shrink:0;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px 12px;cursor:pointer;min-width:140px;max-width:160px"><div style="font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(emoji||'')+' '+r.name+'</div><div style="font-size:10px;color:var(--text3)">'+r.neighborhood+' \\u00b7 <span style="color:var(--gold)">'+r.score+'</span></div></div>';
      }).join('');
    }

    function sectionRow(title,emoji,spots){
      if(!spots.length) return '';
      return '<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">'+emoji+' '+title+'</div><div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">'+cardRow(spots,emoji)+'</div></div>';
    }

    var hoods = city==='New York' ? [
      {name:'Meatpacking District',emoji:'\\ud83e\\udea9',desc:'Clubs, rooftops, see-and-be-seen'},
      {name:'Lower East Side',emoji:'\\ud83c\\udfb5',desc:'Dive bars, live music, cocktails'},
      {name:'Williamsburg',emoji:'\\ud83c\\udfa8',desc:'Rooftops, warehouses, DJ sets'},
      {name:'West Village',emoji:'\\ud83c\\udfba',desc:'Jazz, cocktail bars, intimate'},
      {name:'East Village',emoji:'\\ud83c\\udfd9\\ufe0f',desc:'Dive bars, sake bars, late night'},
      {name:'Bushwick',emoji:'\\ud83c\\udf06',desc:'Warehouse parties, House of Yes'}
    ] : [];

    var html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-size:18px;font-weight:800;color:#b09ec9">\\ud83e\\udea9 '+city+' Nightlife Guide</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\\u2715</button></div>';

    if(hoods.length){
      html+='<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:8px">\\ud83d\\udccd Nightlife Neighborhoods</div>';
      html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      hoods.forEach(function(hood){
        html+='<div onclick="A.openNightlifeHood(&apos;'+hood.name+'&apos;)" style="background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:10px;cursor:pointer"><div style="font-size:12px;font-weight:700;color:var(--gold)">'+hood.emoji+' '+hood.name.split(' ')[0]+'</div><div style="font-size:10px;color:var(--text3)">'+hood.desc+'</div></div>';
      });
      html+='</div></div>';
    }

    html+=sectionRow('Best Cocktail Bars','\\ud83c\\udf78',cocktailBars);
    html+=sectionRow('Rooftop Bars','\\ud83c\\udf06',rooftops);
    html+=sectionRow('Clubs & Dancing','\\ud83e\\udea9',clubs);
    html+=sectionRow('Jazz Clubs','\\ud83c\\udfba',jazz);
    html+=sectionRow('Live Music Venues','\\ud83c\\udfb5',liveMusic);
    html+=sectionRow('Late Night Eats','\\ud83c\\udf19',lateNight);
    html+=sectionRow('Dive Bars','\\ud83c\\udf7a',diveBars);
    html+=sectionRow('Comedy Clubs','\\ud83d\\ude02',comedy);
    html+=sectionRow('Speakeasies & Hidden Bars','\\ud83d\\udd11',speakeasy);

    html+='<div style="background:linear-gradient(135deg,rgba(180,58,180,.1),rgba(100,20,120,.05));border:1px solid rgba(176,158,201,.25);border-radius:12px;padding:14px;margin-top:8px">';
    html+='<div style="font-size:13px;font-weight:700;color:#b09ec9;margin-bottom:6px">\\ud83d\\udca1 Pro Tips</div>';
    html+='<div style="font-size:11px;color:var(--text2);line-height:1.6">';
    html+='\\u2022 Most clubs are busiest Fri-Sat after 11 PM<br>';
    html+='\\u2022 Speakeasies often have no sign -- save the address<br>';
    html+='\\u2022 Many rooftops close in winter<br>';
    html+='\\u2022 Best cocktail bars: arrive before 9 PM<br>';
    html+='\\u2022 Jazz clubs often have a cover + drink minimum<br>';
    html+='\\u2022 Late night food: Chinatown, LES delis, slice shops until 4 AM';
    html+='</div></div>';

    html+='</div></div>';
    m.innerHTML=html;
    m.style.display='block';
  },

  `;

h = h.substring(0, ngStart) + cleanMethod + h.substring(ruStart);
fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Replaced openNightlifeGuide with clean version');
