// Unify hospitality groups rendering for all cities
// Replaces the dual Dallas/NYC vs dynamic approach with one unified path
// Run: node scripts/unify-hospitality-groups.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Find the hospitalityGroupsHTML function
const funcStart = html.indexOf('hospitalityGroupsHTML(){');
if (funcStart === -1) { console.error('Function not found'); process.exit(1); }

// Find the end of this function - look for the next method at the same indent level
// The function ends with `  },` before the next method
// Find the closing `},` that ends the function
// We need to find the matching closing brace
const bodyStart = html.indexOf('{', funcStart + 'hospitalityGroupsHTML('.length);

// Find the next function definition at same level: `\n\n  render` or similar
// The function ends with `\n  },\n` pattern before the next method
// Find end: the `},` right before renderBillsSub
const billsIdx = html.indexOf('renderBillsSub', funcStart + 100);
const endMarker = html.lastIndexOf('},', billsIdx);
const endPos = endMarker + 2;

console.log('Function from:', funcStart, 'to:', endPos);
console.log('Current length:', endPos - funcStart, 'chars');

// Build the new unified function
const newFunc = `hospitalityGroupsHTML(){
    // Unified hospitality groups for ALL cities
    const restaurants = this.getRestaurants();
    const city = S.city || 'Dallas';

    // Build groups dynamically from restaurant data
    const groupMap = {};
    restaurants.filter(r => r.group && r.group.trim()).forEach(r => {
      if(!groupMap[r.group]) groupMap[r.group] = [];
      groupMap[r.group].push(r);
    });

    // Only show groups with 2+ restaurants
    const multiGroups = Object.entries(groupMap).filter(([k,v]) => v.length >= 2).sort((a,b) => {
      // Sort by HOSPITALITY_GROUPS score if available, otherwise by avg restaurant score
      const hgA = HOSPITALITY_GROUPS[a[0]];
      const hgB = HOSPITALITY_GROUPS[b[0]];
      const scoreA = hgA ? hgA.score : a[1].reduce((s,r) => s+r.score, 0) / a[1].length;
      const scoreB = hgB ? hgB.score : b[1].reduce((s,r) => s+r.score, 0) / b[1].length;
      return scoreB - scoreA;
    });

    if(multiGroups.length === 0) return '<div class="empty-state"><div class="empty-icon">🏢</div><div class="empty-title">Hospitality Groups</div><div class="empty-desc">Group data coming soon for '+city+'</div></div>';

    const barColor = sc => sc>=90?'var(--gold)':sc>=80?'#4c9a6a':'var(--text3)';
    const bar = (label, sc) => \`
      <div style="margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="font-size:10px;color:var(--text3)">\${label}</span>
          <span style="font-size:10px;font-weight:700;color:\${barColor(sc)}">\${sc}</span>
        </div>
        <div style="height:4px;background:var(--border);border-radius:2px">
          <div style="width:\${sc}%;height:100%;background:\${barColor(sc)};border-radius:2px;transition:width .4s ease"></div>
        </div>
      </div>\`;

    return \`
      <div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px">🏢 \${city} Hospitality Groups</div>
        <div style="font-size:12px;color:var(--text3)">Multi-concept restaurant groups operating in \${city}</div>
      </div>
      \${multiGroups.map(([name, rests]) => {
        const hg = HOSPITALITY_GROUPS[name];
        const avg = hg ? hg.score : Math.round(rests.reduce((s,r) => s+r.score, 0) / rests.length);
        const oc = avg>=90?'var(--gold)':avg>=80?'#4c9a6a':'#9e8e6e';
        const sb = hg ? hg.scoreBreakdown : null;

        return \\\`
        <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:14px">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));padding:14px 14px 11px;border-bottom:1px solid var(--border)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">
              <div style="flex:1">
                <div style="font-size:15px;font-weight:700;color:var(--text);line-height:1.2">\\\${name}</div>
                <div style="font-size:11px;color:var(--text3);margin-top:3px">\\\${hg ? 'Est. '+hg.founded+' · '+hg.concepts+' concepts · '+hg.flagship : rests.length+' concepts in '+city}</div>
                \\\${hg&&hg.michelinCount>0?\\\\\\\`<div style="font-size:10px;color:var(--gold);margin-top:2px">⭐ \\\\\\\${hg.michelinCount} Michelin Recommended</div>\\\\\\\`:''}
                \\\${hg&&hg.website?\\\\\\\`<a href="\\\\\\\${hg.website}" target="_blank" style="font-size:10px;color:var(--gold);text-decoration:none;margin-top:3px;display:block">🌐 Website →</a>\\\\\\\`:''}
              </div>
              <div style="text-align:center;flex-shrink:0">
                <div style="font-size:28px;font-weight:700;color:\\\${oc};line-height:1">\\\${avg}</div>
                <div style="font-size:9px;color:var(--text3)">\\\${hg ? 'Overall' : 'avg score'}</div>
              </div>
            </div>
          </div>
          <!-- Body -->
          <div style="padding:12px 14px">
            \\\${hg ? '<div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:12px">'+hg.description+'</div>' : ''}
            \\\${sb ? '<div style="margin-bottom:12px">'+bar('Food Quality',sb.foodQuality)+bar('Service',sb.service)+bar('Ambiance',sb.ambiance)+bar('Value',sb.value)+bar('Consistency',sb.consistency)+bar('Innovation',sb.innovation)+'</div>' : ''}
            \\\${hg ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px"><div style="padding:8px 10px;background:rgba(76,154,110,.07);border-radius:8px;border:1px solid rgba(76,154,110,.2)"><div style="font-size:9px;font-weight:800;color:#4c9a6e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">✅ Strengths</div><div style="font-size:10px;color:var(--text2);line-height:1.4">'+hg.strengths+'</div></div><div style="padding:8px 10px;background:rgba(201,107,76,.07);border-radius:8px;border:1px solid rgba(201,107,76,.2)"><div style="font-size:9px;font-weight:800;color:#c96b4c;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">👀 Watch</div><div style="font-size:10px;color:var(--text2);line-height:1.4">'+hg.weakness+'</div></div></div>' : ''}
            <!-- Restaurants -->
            <div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">Concepts</div>
            <div style="display:flex;flex-direction:column;gap:0">
              \\\${rests.sort((a,b) => b.score - a.score).map(r => \\\\\\\`
                <div onclick="A.openDetail(\\\\\\\${r.id})" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">
                  <div>
                    <div style="font-size:13px;font-weight:600;color:var(--text)">\\\\\\\${r.name}</div>
                    <div style="font-size:11px;color:var(--text2)">\\\\\\\${r.cuisine} · \\\\\\\${r.neighborhood}</div>
                  </div>
                  <div style="font-size:16px;font-weight:700;color:var(--gold)">\\\\\\\${r.score}</div>
                </div>
              \\\\\\\`).join('')}
            </div>
          </div>
        </div>\\\`;
      }).join('')}\`;
  },`;

// This template literal nesting is getting too complex. Let me use a different approach.
// I'll write the function as a string and replace it directly.

console.log('Template approach too complex, using direct string replacement...');

// Instead, let me just modify the existing function to unify the paths
// The key change: remove the Dallas-only predefined path and make ALL cities
// use the dynamic approach, but enhanced with HOSPITALITY_GROUPS data when available

const oldFunc = html.substring(funcStart, endPos);

// Write the new function using concatenation (no nested template literals)
const replacement = `hospitalityGroupsHTML(){
    const restaurants = this.getRestaurants();
    const city = S.city || 'Dallas';

    // Build groups dynamically from restaurant data for ALL cities
    const groupMap = {};
    restaurants.filter(r => r.group && r.group.trim()).forEach(r => {
      if(!groupMap[r.group]) groupMap[r.group] = [];
      groupMap[r.group].push(r);
    });

    // Only show groups with 2+ restaurants
    const multiGroups = Object.entries(groupMap).filter(([k,v]) => v.length >= 2).sort((a,b) => {
      const hgA = HOSPITALITY_GROUPS[a[0]];
      const hgB = HOSPITALITY_GROUPS[b[0]];
      const scoreA = hgA ? hgA.score : a[1].reduce((s,r) => s+r.score, 0) / a[1].length;
      const scoreB = hgB ? hgB.score : b[1].reduce((s,r) => s+r.score, 0) / b[1].length;
      return scoreB - scoreA;
    });

    if(multiGroups.length === 0) return '<div class="empty-state"><div class="empty-icon">🏢</div><div class="empty-title">Hospitality Groups</div><div class="empty-desc">Group data coming soon for '+city+'</div></div>';

    const barColor = function(sc){ return sc>=90?'var(--gold)':sc>=80?'#4c9a6a':'var(--text3)'; };
    const bar = function(label, sc){
      return '<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;margin-bottom:2px"><span style="font-size:10px;color:var(--text3)">'+label+'</span><span style="font-size:10px;font-weight:700;color:'+barColor(sc)+'">'+sc+'</span></div><div style="height:4px;background:var(--border);border-radius:2px"><div style="width:'+sc+'%;height:100%;background:'+barColor(sc)+';border-radius:2px;transition:width .4s ease"></div></div></div>';
    };

    var out = '<div style="margin-bottom:16px"><div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px">🏢 '+city+' Hospitality Groups</div><div style="font-size:12px;color:var(--text3)">Multi-concept restaurant groups operating in '+city+'</div></div>';

    multiGroups.forEach(function(entry){
      var name = entry[0];
      var rests = entry[1];
      var hg = HOSPITALITY_GROUPS[name];
      var avg = hg ? hg.score : Math.round(rests.reduce(function(s,r){return s+r.score;},0) / rests.length);
      var oc = avg>=90?'var(--gold)':avg>=80?'#4c9a6a':'#9e8e6e';
      var sb = hg ? hg.scoreBreakdown : null;

      out += '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:14px">';
      // Header
      out += '<div style="background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));padding:14px 14px 11px;border-bottom:1px solid var(--border)">';
      out += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px">';
      out += '<div style="flex:1">';
      out += '<div style="font-size:15px;font-weight:700;color:var(--text);line-height:1.2">'+name+'</div>';
      if(hg){
        out += '<div style="font-size:11px;color:var(--text3);margin-top:3px">Est. '+hg.founded+' · '+hg.concepts+' concepts · '+hg.flagship+'</div>';
        if(hg.michelinCount>0) out += '<div style="font-size:10px;color:var(--gold);margin-top:2px">⭐ '+hg.michelinCount+' Michelin Recommended</div>';
        if(hg.website) out += '<a href="'+hg.website+'" target="_blank" style="font-size:10px;color:var(--gold);text-decoration:none;margin-top:3px;display:block">🌐 Website →</a>';
      } else {
        out += '<div style="font-size:11px;color:var(--text3);margin-top:3px">'+rests.length+' concepts in '+city+'</div>';
      }
      out += '</div>';
      out += '<div style="text-align:center;flex-shrink:0"><div style="font-size:28px;font-weight:700;color:'+oc+';line-height:1">'+avg+'</div><div style="font-size:9px;color:var(--text3)">'+(hg?'Overall':'avg score')+'</div></div>';
      out += '</div></div>';

      // Body
      out += '<div style="padding:12px 14px">';
      if(hg) out += '<div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:12px">'+hg.description+'</div>';
      if(sb){
        out += '<div style="margin-bottom:12px">';
        out += bar('Food Quality',sb.foodQuality)+bar('Service',sb.service)+bar('Ambiance',sb.ambiance)+bar('Value',sb.value)+bar('Consistency',sb.consistency)+bar('Innovation',sb.innovation);
        out += '</div>';
      }
      if(hg){
        out += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">';
        out += '<div style="padding:8px 10px;background:rgba(76,154,110,.07);border-radius:8px;border:1px solid rgba(76,154,110,.2)"><div style="font-size:9px;font-weight:800;color:#4c9a6e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">✅ Strengths</div><div style="font-size:10px;color:var(--text2);line-height:1.4">'+hg.strengths+'</div></div>';
        out += '<div style="padding:8px 10px;background:rgba(201,107,76,.07);border-radius:8px;border:1px solid rgba(201,107,76,.2)"><div style="font-size:9px;font-weight:800;color:#c96b4c;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">👀 Watch</div><div style="font-size:10px;color:var(--text2);line-height:1.4">'+hg.weakness+'</div></div>';
        out += '</div>';
      }
      // Concepts (always show from actual restaurant data)
      out += '<div style="font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">Concepts</div>';
      rests.sort(function(a,b){return b.score-a.score;}).forEach(function(r){
        out += '<div onclick="A.openDetail('+r.id+')" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">';
        out += '<div><div style="font-size:13px;font-weight:600;color:var(--text)">'+r.name+'</div>';
        out += '<div style="font-size:11px;color:var(--text2)">'+r.cuisine+' · '+r.neighborhood+'</div></div>';
        out += '<div style="font-size:16px;font-weight:700;color:var(--gold)">'+r.score+'</div>';
        out += '</div>';
      });
      out += '</div></div>';
    });

    return out;
  },`;

html = html.slice(0, funcStart) + replacement + html.slice(endPos);

fs.writeFileSync(file, html, 'utf8');
console.log('✅ Unified hospitalityGroupsHTML for all cities');
console.log('   - All cities now use dynamic group building from restaurant data');
console.log('   - Rich metadata (scores, descriptions, strengths) shown when available in HOSPITALITY_GROUPS');
console.log('   - Same card template for Dallas, NYC, Houston, Chicago, etc.');
