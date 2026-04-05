const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// =====================================================
// 1. ADD ACTIVITIES & GUIDES SECTION on HOME TAB
//    Insert between restaurant results and Best Of
// =====================================================

const activitiesSection = `
    // Activities & Guides section - only show for NYC when no filters
    if(S.filter==='all' && !S.combo && S.indicators.size===0 && S.neighborhood==='all' && !S.searchQ && (S.city==='New York')){
      const activities = this.getRestaurants().filter(r=>r.cuisine==='Entertainment'||r.cuisine==='Food Market');
      const waterSpots = this.getRestaurants().filter(r=>(r.description||'').toLowerCase().match(/cruise|ferry|kayak|sail|schooner|harbor|boat|floating/));
      const rooftops = this.getRestaurants().filter(r=>(r.tags||[]).includes('Rooftop')).sort((a,b)=>b.score-a.score).slice(0,6);
      const liveMusic = this.getRestaurants().filter(r=>r.cuisine==='Live Music'||r.cuisine==='Jazz Club').sort((a,b)=>b.score-a.score).slice(0,6);
      const clubs = this.getRestaurants().filter(r=>r.cuisine==='Club').sort((a,b)=>b.score-a.score).slice(0,6);
      const comedy = this.getRestaurants().filter(r=>r.cuisine==='Comedy Club').sort((a,b)=>b.score-a.score).slice(0,4);
      const speakeasies = this.getRestaurants().filter(r=>(r.tags||[]).includes('Hole in the Wall')&&(r.tags||[]).includes('Exclusive')).sort((a,b)=>b.score-a.score).slice(0,6);

      const actMiniCard = (r) => \`<div onclick="A.openDetail(\${r.id})" style="flex-shrink:0;width:130px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;cursor:pointer;touch-action:manipulation">
        <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${r.name}</div>
        <div style="font-size:10px;color:var(--text3);margin-bottom:2px">\${r.neighborhood}</div>
        <div style="font-size:10px;color:var(--gold);font-weight:600">\${r.score}</div>
      </div>\`;

      const scrollRow = (items) => \`<div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">\${items.map(r=>actMiniCard(r)).join('')}</div>\`;

      html += \`<div style="margin:20px 0 0;padding:0 0 10px">
        <div style="font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;padding:0 0 14px">🗽 NYC Activities & Guides</div>

        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">🌆 Best Rooftops</div>
          \${scrollRow(rooftops)}
        </div>

        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">🚢 Water Tours & Sunset Cruises</div>
          \${scrollRow(waterSpots.slice(0,6))}
        </div>

        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">🎵 Live Music & Jazz</div>
          \${scrollRow(liveMusic)}
        </div>

        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">🪩 Clubs & Nightlife</div>
          \${scrollRow(clubs)}
        </div>

        \${comedy.length?\`<div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">😂 Comedy</div>
          \${scrollRow(comedy)}
        </div>\`:''}

        \${speakeasies.length?\`<div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">🔑 Speakeasies & Hidden Gems</div>
          \${scrollRow(speakeasies)}
        </div>\`:''}
      </div>\`;
    }
`;

// Insert BEFORE the Best Of section
html = html.replace(
  `    // Best Of Dallas section - only show when no active filters
    if(S.filter==='all' && !S.combo && S.indicators.size===0 && S.neighborhood==='all' && !S.searchQ){
      html += this.bestOfCityHTML();`,
  activitiesSection + `
    // Best Of section - only show when no active filters
    if(S.filter==='all' && !S.combo && S.indicators.size===0 && S.neighborhood==='all' && !S.searchQ){
      html += this.bestOfCityHTML();`
);

console.log('Added Activities & Guides section to home tab');

// =====================================================
// 2. MAKE NOTES COLLAPSIBLE on restaurant detail cards
//    Find the notes rendering and wrap in expandable div
// =====================================================
// The notes field appears in the restaurant detail view
// Let me find where user notes are rendered in the detail panel
const notesIdx = html.indexOf('userData.notes');
if(notesIdx > -1) {
  console.log('Notes reference found at offset', notesIdx);
} else {
  console.log('No userData.notes found - notes may use different field name');
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
