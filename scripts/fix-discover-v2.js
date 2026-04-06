const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Step 1: Fix the onclick escaping in activity detail (from previous fix)
html = html.replace(/onclick="A\.toggleList\(\\'favs\\'/g, "onclick=\"A.toggleList(&apos;favs&apos;");
html = html.replace(/onclick="A\.toggleList\(\\'visited\\'/g, "onclick=\"A.toggleList(&apos;visited&apos;");
html = html.replace(/onclick="A\.toggleList\(\\'want\\'/g, "onclick=\"A.toggleList(&apos;want&apos;");
console.log('Fixed onclick escaping');

// Step 2: Remove the small top-right Guides button from NYC
// Replace the header with flex layout back to simple layout
html = html.replace(
  `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div>
            <div style="font-size:16px;font-weight:800;color:var(--gold);margin-bottom:2px">✨ Discover \${S.city}</div>
            <div style="font-size:12px;color:var(--text2)">\${hasData ? restaurants.length+' verified restaurants' : 'Curating restaurants'}</div>
          </div>
          \${hasActivities?\`<div onclick="A.openActivitiesPage()" style="padding:8px 14px;border-radius:10px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);cursor:pointer;text-align:center">
            <div style="font-size:11px;font-weight:700;color:var(--gold)">📋 Guides</div>
            <div style="font-size:9px;color:var(--text3)">& Weekends</div>
          </div>\`:''}
        </div>`,
  `<div style="margin-bottom:16px">
            <div style="font-size:16px;font-weight:800;color:var(--gold);margin-bottom:2px">✨ Discover \${S.city}</div>
            <div style="font-size:12px;color:var(--text2)">\${hasData ? restaurants.length+' verified restaurants' : 'Curating restaurants'}</div>
        </div>`
);
console.log('Simplified header (removed top-right button)');

// Step 3: Add the gold card to the NYC section too
// Find the end of the NYC Weekend Guides section (right before the ` : ` else for non-NYC)
// The structure is: ${hasActivities ? `...NYC content...` : `...Dallas card...`}
// We need to add the gold card inside the NYC content, right before the backtick close

// Find the non-NYC fallback comment
const fallbackComment = '<!-- ACTIVITIES & GUIDES — compact link for non-NYC -->';
const fallbackIdx = html.indexOf(fallbackComment);
if(fallbackIdx > -1) {
  // The ` : ` is right before this comment
  // Insert the gold card at the END of the NYC section, before ` : `
  // Walk backwards from fallbackComment to find ` : \``
  const beforeFallback = html.lastIndexOf("` : `", fallbackIdx);
  if(beforeFallback > -1) {
    const goldCard = `
          <!-- Weekend Guides & Events gold card -->
          <div class="discover-section" style="margin-top:6px">
            <div onclick="A.openActivitiesPage()" style="background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:14px;padding:18px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;box-shadow:0 0 8px rgba(200,169,110,.2)">
              <div>
                <div style="font-size:16px;font-weight:800;color:var(--gold)">📋 Weekend Guides & Events</div>
                <div style="font-size:12px;color:var(--text2);margin-top:3px">Curated itineraries · Events · Insider tips</div>
              </div>
              <div style="font-size:22px;color:var(--gold)">›</div>
            </div>
          </div>
        `;
    html = html.substring(0, beforeFallback) + goldCard + html.substring(beforeFallback);
    console.log('Added gold card to NYC section');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
const ni=h2.indexOf('const NYC_DATA');const ns=h2.indexOf('[',ni);let nd=0,ne=ns;
for(let j=ns;j<h2.length;j++){if(h2[j]==='[')nd++;if(h2[j]===']'){nd--;if(nd===0){ne=j+1;break;}}}
try{const a=JSON.parse(h2.substring(ns,ne));console.log('NYC:',a.length);}catch(e){console.log('NYC ERR');}
console.log('Has toggleList escaped:', h2.includes("toggleList(\\'"));
console.log('Has &apos;:', h2.includes('toggleList(&apos;'));
console.log('Gold card count:', (h2.match(/Weekend Guides & Events/g)||[]).length);
console.log('Done!');
