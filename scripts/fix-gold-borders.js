const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// 1. Fix NYC Coming Soon cards - make clickable with mock restaurant card
const oldNycOnclick = `onclick="\${r.ig?\`window.open('https://instagram.com/\${r.ig.replace('@','')}','_blank')\`:''}" style="background:var(--card);border:1.5px solid var(--gold);border-radius:12px;padding:14px;margin-bottom:8px;\${r.ig?'cursor:pointer':''}"`;
const newNycOnclick = `onclick="A.openComingSoonDetail(\${idx},'nyc')" style="background:var(--card);border:1.5px solid var(--gold);border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer"`;
if(h.includes(oldNycOnclick)){
  h = h.replace(oldNycOnclick, newNycOnclick);
  console.log('Fixed NYC Coming Soon onclick');
} else {
  console.log('NYC Coming Soon onclick not found (may already be fixed)');
}

// 2. Add openComingSoonDetail method if not exists
if(!h.includes('openComingSoonDetail')){
  const insertBefore = '  renderUpcoming(){';
  const idx = h.indexOf(insertBefore);
  if(idx > -1){
    const method = `  openComingSoonDetail(idx, city){
    const items = window._csItems || [];
    const r = items[idx];
    if(!r) return;
    const m = document.getElementById('event-detail-modal');
    if(!m) return;
    m.innerHTML = \`
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display='none'">
        <div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:20px 16px 40px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div style="font-size:16px;font-weight:700;color:var(--gold)">🔮 Coming Soon</div>
            <button onclick="document.getElementById('event-detail-modal').style.display='none'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">✕</button>
          </div>
          <!-- Mock Restaurant Card -->
          <div style="background:var(--card);border:1.5px solid var(--gold);border-radius:14px;padding:16px;margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <div style="font-size:20px;font-weight:800;color:var(--text)">\${r.name}</div>
                <div style="font-size:12px;color:var(--text3);margin-top:2px">\${r.cuisine} · \${r.hood||r.address||''}</div>
              </div>
              <span style="font-size:11px;padding:4px 12px;border-radius:8px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:var(--gold);font-weight:700">\${r.eta}</span>
            </div>
            <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:12px">\${r.desc}</div>
            \${r.group?'<div style="font-size:11px;color:var(--text3);margin-bottom:8px">🏢 '+r.group+'</div>':''}
            \${r.address&&r.address!=='TBD'?'<div style="font-size:11px;color:var(--text3);margin-bottom:8px">📍 '+r.address+'</div>':''}
          </div>
          <!-- Action Buttons -->
          <div style="display:flex;gap:8px;margin-bottom:10px">
            \${r.ig?'<a href="https://instagram.com/'+r.ig.replace('@','')+'" target="_blank" style="flex:1;text-align:center;padding:12px;background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);border-radius:10px;color:#fff;text-decoration:none;font-size:12px;font-weight:700">📸 Follow on Instagram</a>':''}
            <button onclick="A.showToast('We will notify you when '+\`\${r.name}\`+' opens!')" style="flex:1;padding:12px;background:var(--gold);color:var(--dark);font-weight:800;font-size:12px;border-radius:10px;border:none;cursor:pointer">🔔 Notify Me</button>
          </div>
        </div>
      </div>\`;
    m.style.display='block';
  },

  `;
    h = h.substring(0, idx) + method + h.substring(idx);
    console.log('Added openComingSoonDetail method');
  }
}

// 3. Make sure all local tab content cards have gold borders
// Park cards
h = h.replace(/background:var\(--card\);border:1px solid var\(--border\);border-radius:12px;padding:14px;margin-bottom:8px"/g,
  (m) => m.replace('border:1px solid var(--border)', 'border:1.5px solid var(--gold)'));

// Museum cards
h = h.replace(/background:var\(--card\);border:1px solid var\(--border\);border-radius:12px;padding:12px;margin-bottom:8px"/g,
  (m) => m.replace('border:1px solid var(--border)', 'border:1.5px solid var(--gold)'));

// Group cards
h = h.replace(/background:var\(--card\);border:1px solid var\(--border\);border-radius:14px;padding:14px;margin-bottom:10px"/g,
  (m) => m.replace('border:1px solid var(--border)', 'border:1.5px solid var(--gold)'));

console.log('Fixed remaining card borders');

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
