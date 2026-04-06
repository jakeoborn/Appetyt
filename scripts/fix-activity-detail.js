const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find the detail body rendering in openDetail
// We need to add a check: if cuisine is "Entertainment", "Club", "Live Music",
// "Jazz Club", "Comedy Club", "Rooftop Bar", "Food Market" — show activity layout instead

// The key insertion point is right after:
// document.getElementById('detail-body').innerHTML=`
// We'll add a check that renders a completely different layout for activities

const detailBodyStart = html.indexOf("document.getElementById('detail-body').innerHTML=`");
const insertPoint = detailBodyStart;

// Find what comes before it to add our check
const beforeDetail = html.substring(insertPoint - 200, insertPoint);
console.log('Before detail body:', beforeDetail.substring(beforeDetail.length - 100));

// Strategy: Add a check before the innerHTML assignment
// If it's an activity/entertainment spot, render activity layout and return early

const activityCheck = `
    // Activity/Entertainment custom layout
    const _actCuisines = ['Entertainment','Club','Live Music','Jazz Club','Comedy Club','Rooftop Bar','Food Market','Bar','Brewery','Wine Bar','Whiskey Bar'];
    const _isActivity = _actCuisines.includes(r.cuisine) || r.cuisine.includes('Rooftop');

    if(_isActivity) {
      document.getElementById('detail-name').textContent=r.name;
      document.getElementById('detail-body').innerHTML=\`
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="font-size:36px;font-weight:800;color:var(--gold)">\${r.score}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--text)">\${r.cuisine}</div>
            <div style="font-size:12px;color:var(--text2)">\${r.neighborhood} · \${r.price?'$'.repeat(r.price):'Free/Varies'}</div>
            \${r.awards?\`<div style="font-size:11px;color:var(--gold);margin-top:2px">🏆 \${r.awards}</div>\`:''}
          </div>
        </div>

        <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px">\${r.description}</div>

        \${r.website||r.instagram?\`<div style="display:flex;gap:8px;margin-bottom:12px">
          \${r.website?\`<a href="\${r.website.startsWith('http')?r.website:'https://'+r.website}" target="_blank" style="flex:1;text-align:center;background:rgba(201,168,76,.15);border:1px solid var(--gold);border-radius:10px;padding:12px;color:var(--gold);text-decoration:none;font-size:13px;font-weight:700">🌐 Website</a>\`:''}
          \${r.instagram?\`<a href="https://instagram.com/\${r.instagram.replace('@','')}" target="_blank" style="flex:1;text-align:center;background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:12px;color:var(--text2);text-decoration:none;font-size:13px;font-weight:600">📸 \${r.instagram}</a>\`:''}
        </div>\`:''}

        <a href="https://www.google.com/maps/search/\${encodeURIComponent(r.name+' '+r.address)}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border-radius:12px;background:var(--gold);color:var(--dark);font-weight:800;font-size:14px;margin-bottom:12px;text-decoration:none">🗺️ Get Directions</a>

        \${r.dishes&&r.dishes.length?\`
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">✨ What to Expect</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            \${r.dishes.map(d=>\`<div style="font-size:12px;color:var(--text2);display:flex;align-items:center;gap:6px"><span style="color:var(--gold)">•</span> \${d}</div>\`).join('')}
          </div>
        </div>\`:''}

        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px">
          <div style="display:grid;gap:10px">
            <div>
              <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">📍 Address</div>
              <div style="font-size:12px;color:var(--text2)">\${r.address||r.neighborhood+', '+S.city}</div>
            </div>
            <div>
              <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">🕐 Hours</div>
              <div style="font-size:12px;color:var(--text2)">\${r.hours||'Check website for hours'}</div>
            </div>
            \${r.phone?\`<div>
              <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">📞 Phone</div>
              <a href="tel:\${r.phone}" style="font-size:12px;color:var(--gold);text-decoration:none">\${r.phone}</a>
            </div>\`:''}
          </div>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          \${(r.tags||[]).map(t=>\`<span style="font-size:10px;background:rgba(201,168,76,.1);color:var(--gold);padding:3px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.2);font-weight:600">\${t}</span>\`).join('')}
        </div>

        <!-- Action buttons -->
        <div style="display:flex;gap:8px;margin-bottom:14px">
          <button class="r-btn\${isFav?' on':''}" onclick="A.toggleList('favs',\${id},this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">❤️ \${isFav?'Saved':'Save'}</button>
          <button class="r-btn\${isVisited?' on':''}" onclick="A.toggleList('visited',\${id},this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">✅ \${isVisited?'Visited':'Been Here'}</button>
          <button class="r-btn\${isWant?' on':''}" onclick="A.toggleList('want',\${id},this)" style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--border);font-size:12px;cursor:pointer;font-family:inherit">🔖 \${isWant?'Saved':'Want to Go'}</button>
        </div>

        \${buildNotesHTML(id)}
      \`;
      document.getElementById('detail').classList.add('open');
      document.getElementById('detail').scrollTop=0;
      return;
    }

`;

// Insert the activity check BEFORE the existing detail body rendering
html = html.replace(
  "document.getElementById('detail-name').textContent=r.name;\n    document.getElementById('detail-body').innerHTML=`",
  activityCheck + "    document.getElementById('detail-name').textContent=r.name;\n    document.getElementById('detail-body').innerHTML=`"
);

console.log('Added activity detail layout');

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
console.log('Has _isActivity check:', h2.includes('_isActivity'));
const ni=h2.indexOf('const NYC_DATA');const ns=h2.indexOf('[',ni);let nd=0,ne=ns;
for(let j=ns;j<h2.length;j++){if(h2[j]==='[')nd++;if(h2[j]===']'){nd--;if(nd===0){ne=j+1;break;}}}
try{const a=JSON.parse(h2.substring(ns,ne));console.log('NYC:',a.length);}catch(e){console.log('NYC ERR');}
console.log('Done!');
