const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// =====================================================
// 1. UPDATE CRAFT AND CTRL ROOM STATUS
// =====================================================
// CRAFT → Opened
html = html.replace(
  `"name": "CRAFT Restaurant & Beer Market",
            "hood": "Preston Center",
            "address": "Preston Center, Dallas",
            "eta": "Early 2026",`,
  `"name": "CRAFT Restaurant & Beer Market",
            "hood": "Preston Center",
            "address": "Preston Center, Dallas",
            "eta": "Opened",`
);
console.log('Updated CRAFT to Opened');

// Ctrl Room → Opening This Week
html = html.replace(
  `"name": "Ctrl Room",
            "hood": "Deep Ellum",
            "address": "Deep Ellum",
            "eta": "April 2026",`,
  `"name": "Ctrl Room",
            "hood": "Deep Ellum",
            "address": "Deep Ellum, Dallas",
            "eta": "Opened",`
);
// Update the open date too
html = html.replace("'Ctrl Room':'2026-04-09'", "'Ctrl Room':'2026-04-05'");
console.log('Updated Ctrl Room to Opened');

// Also update Seegar's Deli — January 2026 was months ago, likely opened
html = html.replace(
  `"name": "Seegar's Deli",
            "hood": "Harwood District",
            "address": "1910 S Harwood St, Dallas",
            "eta": "January 2026",`,
  `"name": "Seegar's Deli",
            "hood": "Harwood District",
            "address": "1910 S Harwood St, Dallas",
            "eta": "Opened",`
);
console.log('Updated Seegar\'s Deli to Opened');

// Kilmac's — Early 2026 was months ago
html = html.replace(
  `"name": "Kilmac's",
            "hood": "Oak Cliff",
            "address": "814 W Davis St, Dallas",
            "eta": "Early 2026",`,
  `"name": "Kilmac's",
            "hood": "Oak Cliff",
            "address": "814 W Davis St, Dallas",
            "eta": "Opened",`
);
console.log('Updated Kilmac\'s to Opened');

// =====================================================
// 2. REVAMP THE COMING SOON RENDERING
// Replace the existing rendering with a cleaner, more elegant design
// =====================================================
const oldRendering = `    return \`
      <div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🔮 Coming Soon to \${S.city||'Dallas'}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Verified upcoming openings</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:12px">\${allCount} restaurants on the radar</div>
        <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:16px;padding-bottom:2px">
          \${filters.map(f=>\`<button onclick="A._csFilter='\${f.id}';A.renderLocal()" style="flex-shrink:0;padding:6px 12px;border-radius:20px;border:1px solid \${csFilter===f.id?'var(--gold)':'var(--border)'};background:\${csFilter===f.id?'var(--gold)':'var(--card2)'};color:\${csFilter===f.id?'var(--dark)':'var(--text2)'};font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">\${f.label} (\${f.count})</button>\`).join('')}
        </div>
      </div>`;

const newRendering = `    return \`
      <div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px">🔮 Coming Soon</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px">\${allCount} verified openings for \${S.city||'Dallas'}</div>
        <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:16px;padding-bottom:2px">
          \${filters.map(f=>\`<button onclick="A._csFilter='\${f.id}';A.renderLocal()" style="flex-shrink:0;padding:8px 14px;border-radius:20px;border:1.5px solid \${csFilter===f.id?'var(--gold)':'var(--border)'};background:\${csFilter===f.id?'rgba(201,168,76,.15)':'var(--card2)'};color:\${csFilter===f.id?'var(--gold)':'var(--text3)'};font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s">\${f.label} <span style="opacity:.6">·</span> \${f.count}</button>\`).join('')}
        </div>
      </div>`;

html = html.replace(oldRendering, newRendering);
console.log('Revamped header design');

// =====================================================
// 3. REVAMP THE TBD CARDS (items array entries)
// Make them cleaner with a more elegant card design
// =====================================================
const oldTbdCard = `  _csTbdCard(r,idx){
    return \``;
const newCardSearch = html.indexOf('_csTbdCard(r,idx){');

if(newCardSearch > -1) {
  // Read the current card function
  const fnStart = newCardSearch;
  const fnEnd = html.indexOf('\n  },\n', fnStart + 100);
  const oldFn = html.substring(fnStart, fnEnd + 5);

  const newFn = `_csTbdCard(r,idx){
    const isOpen = r.eta === 'Opened';
    return \`
      <div style="background:var(--card);border:1px solid \${isOpen?'rgba(76,154,106,.3)':'var(--border)'};border-radius:14px;margin-bottom:10px;overflow:hidden;transition:border-color .2s" onmouseenter="this.style.borderColor='var(--gold)'" onmouseleave="this.style.borderColor=\${isOpen?\"'rgba(76,154,106,.3)'\":\"'var(--border)'\"}">
        <div style="padding:14px 16px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">
            <div style="flex:1">
              <div style="font-size:15px;font-weight:800;color:var(--text);line-height:1.2">\${r.name}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:3px">\${r.cuisine} · \${r.hood}</div>
            </div>
            <div style="flex-shrink:0;padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700;letter-spacing:.03em;\${isOpen?'background:rgba(76,154,106,.12);color:#4c9a6a;border:1px solid rgba(76,154,106,.25)':'background:rgba(201,168,76,.1);color:var(--gold);border:1px solid rgba(201,168,76,.2)'}">
              \${isOpen?'✓ Now Open':r.eta}
            </div>
          </div>
          <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-bottom:8px">\${r.desc.split('.').slice(0,2).join('.')}.</div>
          <div style="display:flex;gap:6px;align-items:center">
            \${r.ig?\`<a href="https://instagram.com/\${r.ig.replace('@','')}" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;color:var(--text3);text-decoration:none;display:flex;align-items:center;gap:3px">📷 \${r.ig}</a>\`:''}
            \${r.group&&r.group!=='Independent'?\`<span style="font-size:9px;color:var(--text3);background:var(--card2);border:1px solid var(--border);padding:2px 8px;border-radius:6px">🏢 \${r.group}</span>\`:''}
          </div>
        </div>
      </div>\`;
  },`;

  html = html.substring(0, fnStart) + newFn + html.substring(fnEnd + 5);
  console.log('Revamped TBD card design');
}

// =====================================================
// 4. REVAMP THE CONFIRMED CARDS
// =====================================================
const confirmedCardSearch = html.indexOf('_csConfirmedCard(r,i,_csGetDate){');
if(confirmedCardSearch > -1) {
  const cfnStart = confirmedCardSearch;
  const cfnEnd = html.indexOf('\n  },\n', cfnStart + 100);
  const oldCFn = html.substring(cfnStart, cfnEnd + 5);

  const newCFn = `_csConfirmedCard(r,i,_csGetDate){
    const dateStr = _csGetDate(r.name);
    const isOpen = dateStr <= new Date().toISOString().split('T')[0];
    return \`
      <div onclick="A.openDetail(\${r.id})" style="background:var(--card);border:1px solid \${isOpen?'rgba(76,154,106,.3)':'rgba(201,168,76,.2)'};border-radius:14px;margin-bottom:10px;cursor:pointer;overflow:hidden;transition:border-color .2s" onmouseenter="this.style.borderColor='var(--gold)'" onmouseleave="this.style.borderColor=\${isOpen?\"'rgba(76,154,106,.3)'\": \"'rgba(201,168,76,.2)'\"}">
        <div style="padding:14px 16px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">
            <div style="flex:1">
              <div style="font-size:15px;font-weight:800;color:var(--text);line-height:1.2">\${r.name}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:3px">\${r.cuisine} · \${r.neighborhood}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <div style="font-size:18px;font-weight:700;color:var(--gold)">\${r.score}</div>
              <div style="padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;\${isOpen?'background:rgba(76,154,106,.12);color:#4c9a6a':'background:rgba(201,168,76,.1);color:var(--gold)'}">
                \${isOpen?'✓ Open':'Coming Soon'}
              </div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text2);line-height:1.5">\${(r.description||'').split('.').slice(0,2).join('.')}.</div>
        </div>
      </div>\`;
  },`;

  html = html.substring(0, cfnStart) + newCFn + html.substring(cfnEnd + 5);
  console.log('Revamped confirmed card design');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('\nDone!');
