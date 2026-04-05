const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Replace _csTbdCard with cleaner design
const tbdStart = html.indexOf('  _csTbdCard(r, idx){');
const tbdEnd = html.indexOf('\n  },\n', tbdStart) + 5;

const newTbd = `  _csTbdCard(r, idx){
    var isOpen=r.eta==='Opened'||r.eta.toLowerCase().includes('opened');
    var safeName=r.name.replace(/'/g,"&#39;");
    var igLink=r.ig?'<a href="https://instagram.com/'+r.ig.replace('@','')+'" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;color:var(--text3);text-decoration:none">\\u{1F4F7} '+r.ig+'</a>':'';
    var groupBadge=r.group&&r.group!=='Independent'?'<span style="font-size:9px;color:var(--text3);background:var(--card2);border:1px solid var(--border);padding:2px 8px;border-radius:6px">\\u{1F3E2} '+r.group+'</span>':'';
    var notified=(S.userData.reminders||[]).includes(r.name);
    return '<div style="background:var(--card);border:1px solid '+(isOpen?'rgba(76,154,106,.3)':'var(--border)')+';border-radius:14px;margin-bottom:10px;overflow:hidden">'
      +'<div style="padding:14px 16px">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">'
          +'<div style="flex:1">'
            +'<div style="font-size:15px;font-weight:800;color:var(--text);line-height:1.2">'+r.name+'</div>'
            +'<div style="font-size:11px;color:var(--text3);margin-top:3px">'+r.cuisine+' \\u00b7 '+r.hood+'</div>'
          +'</div>'
          +'<div style="flex-shrink:0;padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700;letter-spacing:.03em;'+(isOpen?'background:rgba(76,154,106,.12);color:#4c9a6a;border:1px solid rgba(76,154,106,.25)':'background:rgba(201,168,76,.1);color:var(--gold);border:1px solid rgba(201,168,76,.2)')+'">'
            +(isOpen?'\\u2713 Now Open':r.eta)
          +'</div>'
        +'</div>'
        +'<div style="font-size:12px;color:var(--text2);line-height:1.5;margin-bottom:8px">'+r.desc.split('.').slice(0,2).join('.')+'.</div>'
        +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
          +igLink
          +groupBadge
          +'<button onclick="event.stopPropagation();A.toggleNotifyMe(\\''+safeName+'\\')" class="notify-me-btn'+(notified?' notified':'')+'" style="margin-left:auto;padding:4px 10px;font-size:10px;border-radius:8px;border:1px solid var(--border);background:var(--card2);color:var(--text3);cursor:pointer;font-family:inherit">'+(notified?'\\u2705 Notified':'\\u{1F514} Notify Me')+'</button>'
        +'</div>'
      +'</div>'
    +'</div>';
  },`;

html = html.substring(0, tbdStart) + newTbd + html.substring(tbdEnd);
console.log('Replaced TBD card with cleaner design');

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
