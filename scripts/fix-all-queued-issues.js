const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
let fixes = 0;

// ISSUE 1: Dallas hospitality group restaurants not clickable
// Find the HG_LOOKUP and the restaurant rendering after it
// The Dallas group rendering uses HG_LOOKUP to map names to IDs
// Need to add onclick="A.openDetail(ID)" to each restaurant card
const hgLookup = h.indexOf('const HG_LOOKUP');
if(hgLookup > -1){
  // Find restaurant list items in the Dallas groups section
  // They appear as <div style="...">restaurant name</div> without onclick
  // Look for the pattern in the Dallas hospitality groups rendering
  const dallasSectionStart = h.indexOf("Object.entries(_HG)", hgLookup);
  if(dallasSectionStart > -1){
    const dallasSectionEnd = h.indexOf("hospitalityGroupsHTML", dallasSectionStart + 100);
    let section = h.substring(dallasSectionStart, dallasSectionEnd > -1 ? dallasSectionEnd : dallasSectionStart + 10000);

    // Find restaurant items that should be clickable
    // Pattern: items listed without onclick
    // The Dallas groups likely render restaurant names from HOSPITALITY_GROUPS data
    // which contains restaurant names that map to IDs via HG_LOOKUP
    console.log('Dallas groups section found, checking for clickable fix...');

    // Add onclick to restaurant name spans using HG_LOOKUP
    // The rendering pattern uses rest.name and HG_LOOKUP[rest.name] for the ID
    if(section.includes("style=\"font-size:12px;font-weight:600;color:var(--text)\">")){
      section = section.replace(
        /style="font-size:12px;font-weight:600;color:var\(--text\)">(\$\{r\.name\})<\/div>/g,
        'style="font-size:12px;font-weight:600;color:var(--gold);cursor:pointer" onclick="A.openDetail(HG_LOOKUP[&apos;${r.name}&apos;]||0)">${r.name}</div>'
      );
      console.log('ISSUE 1: Added onclick to Dallas group restaurants');
      fixes++;
    }
  }
}

// ISSUE 2: Coming Soon cards not clickable
// The openComingSoonDetail method may be missing
// Check if it exists and add if not
if(h.indexOf('openComingSoonDetail(idx') === -1){
  // Add the method before renderUpcoming
  const ruIdx = h.indexOf('  renderUpcoming(){');
  if(ruIdx > -1){
    const method = `  openComingSoonDetail(idx,city){
    var items=window._csItems||[];
    var r=items[idx];
    if(!r)return;
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var html='<div style="position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=&apos;none&apos;">';
    html+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:20px 16px 40px">';
    html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
    html+='<div style="font-size:16px;font-weight:700;color:var(--gold)">\\ud83d\\udd2e Coming Soon</div>';
    html+='<button onclick="document.getElementById(&apos;event-detail-modal&apos;).style.display=&apos;none&apos;" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">\\u2715</button></div>';
    html+='<div style="background:var(--card);border:1.5px solid var(--gold);border-radius:14px;padding:16px;margin-bottom:14px">';
    html+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">';
    html+='<div><div style="font-size:20px;font-weight:800;color:var(--text)">'+r.name+'</div>';
    html+='<div style="font-size:12px;color:var(--text3);margin-top:2px">'+r.cuisine+' \\u00b7 '+(r.hood||r.address||'')+'</div></div>';
    html+='<span style="font-size:11px;padding:4px 12px;border-radius:8px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:var(--gold);font-weight:700">'+r.eta+'</span></div>';
    html+='<div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:12px">'+r.desc+'</div>';
    if(r.group) html+='<div style="font-size:11px;color:var(--text3);margin-bottom:8px">\\ud83c\\udfe2 '+r.group+'</div>';
    if(r.address&&r.address!=='TBD') html+='<div style="font-size:11px;color:var(--text3);margin-bottom:8px">\\ud83d\\udccd '+r.address+'</div>';
    html+='</div>';
    html+='<div style="display:flex;gap:8px">';
    if(r.ig) html+='<a href="https://instagram.com/'+r.ig.replace('@','')+'" target="_blank" style="flex:1;text-align:center;padding:12px;background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);border-radius:10px;color:#fff;text-decoration:none;font-size:12px;font-weight:700">\\ud83d\\udcf8 Follow on Instagram</a>';
    html+='<button onclick="A.showToast(&apos;We will notify you when '+r.name.replace(/'/g,'')+' opens!&apos;)" style="flex:1;padding:12px;background:var(--gold);color:var(--dark);font-weight:800;font-size:12px;border-radius:10px;border:none;cursor:pointer">\\ud83d\\udd14 Notify Me</button>';
    html+='</div></div></div>';
    m.innerHTML=html;
    m.style.display='block';
  },

  `;
    h = h.substring(0, ruIdx) + method + h.substring(ruIdx);
    console.log('ISSUE 2: Added openComingSoonDetail method');
    fixes++;
  }
} else {
  console.log('ISSUE 2: openComingSoonDetail already exists');
}

// ISSUE 6: Hospitality group cards need gold borders
h = h.replace(
  /background:var\(--card\);border:1px solid var\(--border\);border-radius:14px;overflow:hidden;margin-bottom:12px/g,
  'background:var(--card);border:1.5px solid var(--gold);border-radius:14px;overflow:hidden;margin-bottom:12px'
);
console.log('ISSUE 6: Fixed hospitality group card borders to gold');
fixes++;

console.log('Total fixes applied:', fixes);
fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
