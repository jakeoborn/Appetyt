const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Add "Things to Do" section before Neighborhood Spotlight on the Weekend Guides page
// These are activity spots from NYC_DATA that people should know about

const thingsToDoHTML = `
      <!-- THINGS TO DO -->
      <div style="margin-bottom:20px">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px">🎯 Things to Do</div>
        <div style="font-size:11px;color:var(--text2);margin:-4px 0 12px">Beyond restaurants — the best NYC experiences</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div onclick="A.openDetail(1671)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🏝</div><div style="font-size:12px;font-weight:700;color:var(--text)">Little Island</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Floating park on the Hudson</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Free · amphitheater · gardens</div></div>
          <div onclick="A.openDetail(1674)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🌆</div><div style="font-size:12px;font-weight:700;color:var(--text)">SUMMIT One Vanderbilt</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Immersive sky experience</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Mirrored rooms · glass sky boxes</div></div>
          <div onclick="A.openDetail(1680)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🌉</div><div style="font-size:12px;font-weight:700;color:var(--text)">Brooklyn Bridge Walk</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Iconic sunset walk</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Free · 1.1 miles · end in DUMBO</div></div>
          <div onclick="A.openDetail(1685)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🗽</div><div style="font-size:12px;font-weight:700;color:var(--text)">Staten Island Ferry</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Best free activity in NYC</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Free · Statue of Liberty views</div></div>
          <div onclick="A.openDetail(1673)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🏙</div><div style="font-size:12px;font-weight:700;color:var(--text)">Edge Observation Deck</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Highest outdoor deck in West</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Glass floor · champagne bar</div></div>
          <div onclick="A.openDetail(1714)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🚲</div><div style="font-size:12px;font-weight:700;color:var(--text)">Governors Island</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Car-free island escape</div><div style="font-size:9px;color:var(--text3);margin-top:4px">$4 ferry · bikes · art · slides</div></div>
          <div onclick="A.openDetail(1679)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🕯</div><div style="font-size:12px;font-weight:700;color:var(--text)">9/11 Memorial</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Moving memorial & museum</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Memorial free · museum $26</div></div>
          <div onclick="A.openDetail(1642)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🎭</div><div style="font-size:12px;font-weight:700;color:var(--text)">Sleep No More</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Immersive theater</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Masks · 100 rooms · 3 hours</div></div>
          <div onclick="A.openDetail(1684)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🎡</div><div style="font-size:12px;font-weight:700;color:var(--text)">Coney Island</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Boardwalk & rides</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Cyclone · Nathan's · beach</div></div>
          <div onclick="A.openDetail(1641)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🎨</div><div style="font-size:12px;font-weight:700;color:var(--text)">Meow Wolf</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Immersive art experience</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Surreal portals · interactive</div></div>
          <div onclick="A.openDetail(1712)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🚣</div><div style="font-size:12px;font-weight:700;color:var(--text)">Free Kayaking</div><div style="font-size:10px;color:var(--gold);margin-top:2px">Pier 26 on the Hudson</div><div style="font-size:9px;color:var(--text3);margin-top:4px">Free · weekends · walk-up</div></div>
          <div onclick="A.openDetail(1726)" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer"><div style="font-size:16px;margin-bottom:4px">🎭</div><div style="font-size:12px;font-weight:700;color:var(--text)">Broadway</div><div style="font-size:10px;color:var(--gold);margin-top:2px">40+ theaters</div><div style="font-size:9px;color:var(--text3);margin-top:4px">TKTS booth · 50% off same-day</div></div>
        </div>
      </div>

`;

// Insert before Neighborhood Spotlight
const insertBefore = '      <!-- NEIGHBORHOOD SPOTLIGHT -->';
const insertIdx = html.indexOf(insertBefore);
if (insertIdx > -1) {
  html = html.substring(0, insertIdx) + thingsToDoHTML + html.substring(insertIdx);
  console.log('Added Things to Do section');
} else {
  console.log('ERROR: Could not find insertion point');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
const ss=h2.indexOf('<script>',h2.indexOf('HOTEL_DATA')-100)+8;
const se=h2.indexOf('</script>',ss);
try{new Function('(function(){'+h2.substring(ss,se)+'})');console.log('COMPILES OK');}catch(e){console.log('ERROR:',e.message);}
console.log('Done!');
