const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find insertion point
const target = "document.getElementById('detail-name').textContent=r.name;";
const idx = html.indexOf(target);
if(idx === -1) { console.log('ERROR: target not found'); process.exit(1); }

// Build activity layout using string concatenation (no nested template literals)
const activityCode = `
    // --- Activity/Entertainment custom detail layout ---
    var _actCuisines=['Entertainment','Club','Live Music','Jazz Club','Comedy Club','Rooftop Bar','Food Market','Bar','Brewery','Wine Bar','Whiskey Bar'];
    var _isAct=_actCuisines.indexOf(r.cuisine)>-1||(r.cuisine||'').indexOf('Rooftop')>-1;
    if(_isAct){
      document.getElementById('detail-name').textContent=r.name;
      var _aH='<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'
        +'<div style="font-size:36px;font-weight:800;color:var(--gold)">'+r.score+'</div>'
        +'<div>'
          +'<div style="font-size:14px;font-weight:700;color:var(--text)">'+r.cuisine+'</div>'
          +'<div style="font-size:12px;color:var(--text2)">'+r.neighborhood+' \\u00b7 '+(r.price?'$'.repeat(r.price):'Free / Varies')+'</div>'
          +(r.awards?'<div style="font-size:11px;color:var(--gold);margin-top:2px">\\u{1F3C6} '+r.awards+'</div>':'')
        +'</div></div>'
        +'<div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px">'+r.description+'</div>';
      // Website & Instagram
      if(r.website||r.instagram){
        _aH+='<div style="display:flex;gap:8px;margin-bottom:12px">';
        if(r.website) _aH+='<a href="'+(r.website.startsWith('http')?r.website:'https://'+r.website)+'" target="_blank" style="flex:1;text-align:center;background:rgba(201,168,76,.15);border:1px solid var(--gold);border-radius:10px;padding:12px;color:var(--gold);text-decoration:none;font-size:13px;font-weight:700">\\u{1F310} Website</a>';
        if(r.instagram) _aH+='<a href="https://instagram.com/'+r.instagram.replace('@','')+'" target="_blank" style="flex:1;text-align:center;background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:12px;color:var(--text2);text-decoration:none;font-size:13px;font-weight:600">\\u{1F4F8} '+r.instagram+'</a>';
        _aH+='</div>';
      }
      // Get Directions button
      _aH+='<a href="https://www.google.com/maps/search/'+encodeURIComponent(r.name+' '+r.address)+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border-radius:12px;background:var(--gold);color:var(--dark);font-weight:800;font-size:14px;margin-bottom:12px;text-decoration:none">\\u{1F5FA}\\uFE0F Get Directions</a>';
      // What to Expect
      if(r.dishes&&r.dishes.length){
        _aH+='<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px">'
          +'<div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">\\u2728 What to Expect</div>'
          +'<div style="display:flex;flex-direction:column;gap:6px">';
        r.dishes.forEach(function(d){_aH+='<div style="font-size:12px;color:var(--text2);display:flex;align-items:center;gap:6px"><span style="color:var(--gold)">\\u2022</span> '+d+'</div>';});
        _aH+='</div></div>';
      }
      // Info card
      _aH+='<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px"><div style="display:grid;gap:10px">'
        +'<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">\\u{1F4CD} Address</div><div style="font-size:12px;color:var(--text2)">'+(r.address||r.neighborhood)+'</div></div>'
        +'<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">\\u{1F550} Hours</div><div style="font-size:12px;color:var(--text2)">'+(r.hours||'Check website')+'</div></div>'
        +(r.phone?'<div><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">\\u{1F4DE} Phone</div><a href="tel:'+r.phone+'" style="font-size:12px;color:var(--gold);text-decoration:none">'+r.phone+'</a></div>':'')
        +'</div></div>';
      // Tags
      _aH+='<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px">';
      (r.tags||[]).forEach(function(t){_aH+='<span style="font-size:10px;background:rgba(201,168,76,.1);color:var(--gold);padding:3px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.2);font-weight:600">'+t+'</span>';});
      _aH+='</div>';
      // Action buttons
      _aH+='<div style="display:flex;gap:8px;margin-bottom:14px">'
        +'<button class="r-btn'+(isFav?' on':'')+'" onclick="A.toggleList(\\'favs\\','+id+',this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">\\u2764\\uFE0F '+(isFav?'Saved':'Save')+'</button>'
        +'<button class="r-btn'+(isVisited?' on':'')+'" onclick="A.toggleList(\\'visited\\','+id+',this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">\\u2705 '+(isVisited?'Visited':'Been Here')+'</button>'
        +'<button class="r-btn'+(isWant?' on':'')+'" onclick="A.toggleList(\\'want\\','+id+',this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">\\u{1F516} '+(isWant?'Saved':'Want to Go')+'</button>'
        +'</div>';
      // Notes
      _aH+=buildNotesHTML(id);
      document.getElementById('detail-body').innerHTML=_aH;
      document.getElementById('detail').classList.add('open');
      document.getElementById('detail').scrollTop=0;
      return;
    }
    // --- End activity layout ---
`;

// Insert before the existing openDetail name assignment
html = html.substring(0, idx) + activityCode + '\n    ' + html.substring(idx);

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
console.log('Has _isAct:', h2.includes('_isAct'));
console.log('Has What to Expect:', h2.includes('What to Expect'));
const ni=h2.indexOf('const NYC_DATA');const ns=h2.indexOf('[',ni);let nd=0,ne=ns;
for(let j=ns;j<h2.length;j++){if(h2[j]==='[')nd++;if(h2[j]===']'){nd--;if(nd===0){ne=j+1;break;}}}
try{const a=JSON.parse(h2.substring(ns,ne));console.log('NYC:',a.length);}catch(e){console.log('NYC ERR');}
console.log('Done!');
