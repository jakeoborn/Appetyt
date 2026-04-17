#!/usr/bin/env node
// Batch 1: Add filter tabs to Things to Do page
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find the openThingsToDoPage function
const fnStart = html.indexOf('  openThingsToDoPage(){');
const fnEnd = html.indexOf('\n  _getWeekendGuides(){');
if (fnStart === -1 || fnEnd === -1) {
  console.error('Could not find boundaries:', fnStart, fnEnd);
  process.exit(1);
}

// Also need to add setThingsToDoTab method - insert it right after openThingsToDoPage
const newFn = `  openThingsToDoPage(initialTab){
    const el = document.getElementById('discover-content');
    if(!el) return;
    if(!A._CE){
      const prev = el.innerHTML;
      this.openActivitiesPage();
      el.innerHTML = prev;
    }
    const cityExtras = (A._CE && A._CE[S.city]) || null;
    window._thingsToDoCache = (cityExtras && cityExtras.thingsToDo) || [];
    window._seasonalCache = (cityExtras && cityExtras.seasonal) || [];
    window._dayTripsCache = (cityExtras && cityExtras.dayTrips) || [];

    var tab = initialTab || window._thingsToDoTab || 'activities';
    window._thingsToDoTab = tab;

    // Tab pill builder
    function tabPill(id, emoji, label, active){
      return '<button onclick="A.setThingsToDoTab(\\''+id+'\\')" style="flex:1;padding:10px 8px;border-radius:12px;border:1.5px solid '+(active?'var(--gold)':'var(--border)')+';background:'+(active?'rgba(201,168,76,.12)':'var(--card2)')+';color:'+(active?'var(--gold)':'var(--text2)')+';font-size:12px;font-weight:'+(active?'800':'600')+';font-family:inherit;cursor:pointer;touch-action:manipulation;transition:all .15s;white-space:nowrap">'+emoji+' '+label+'</button>';
    }

    // Tab bar
    var tabBar = '<div style="display:flex;gap:8px;margin-bottom:18px">'
      + tabPill('activities','🎯','Things to Do',tab==='activities')
      + tabPill('seasonal','🗓️','Seasonal',tab==='seasonal')
      + tabPill('daytrips','🚗','Day Trips',tab==='daytrips')
      + '</div>';

    // Content based on active tab
    var content = '';

    if(tab === 'activities'){
      if(cityExtras && cityExtras.thingsToDo && cityExtras.thingsToDo.length){
        content = cityExtras.thingsToDo.map(function(t,i){
          var hasTips = t.tips && t.tips.length;
          var hasEat = t.eat && t.eat.length;
          var signalBits = [];
          if(hasTips) signalBits.push('💡 '+t.tips.length+' tips');
          if(hasEat) signalBits.push('🍽 '+t.eat.length+' nearby');
          var leftSignal = signalBits.join(' · ');
          return '<div onclick="A.openThingToDoDetail('+i+')" style="display:block;background:var(--card);border:1.5px solid var(--gold);border-radius:12px;padding:13px;margin-bottom:8px;cursor:pointer;touch-action:manipulation;transition:border-color .15s,transform .15s" onmouseover="this.style.borderColor=\\'var(--gold2)\\';this.style.transform=\\'translateY(-1px)\\'" onmouseout="this.style.borderColor=\\'var(--gold)\\';this.style.transform=\\'\\'"><div style="display:flex;align-items:flex-start;gap:12px"><div style="font-size:28px;flex-shrink:0;line-height:1">'+t.emoji+'</div><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;line-height:1.3">'+t.name+'</div><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">'
            +(t.category?'<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:rgba(201,168,76,.1);color:var(--gold);font-weight:600">'+t.category+'</span>':'')
            +(t.free?'<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:rgba(76,154,106,.12);color:#4c9a6a;font-weight:700">FREE</span>':'')
            +(t.bestTime?'<span style="font-size:10px;color:var(--text3)">⏰ '+t.bestTime+'</span>':'')
            +(t.driveTime?'<span style="font-size:10px;color:var(--text3)">🚗 '+t.driveTime+'</span>':'')
            +'</div><div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:6px">'+t.desc+'</div><div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:10px;color:var(--text3)">'+leftSignal+'</span><span style="font-size:10px;color:var(--gold);font-weight:700;white-space:nowrap">Details →</span></div></div></div></div>';
        }).join('');
      } else {
        content = '<div style="background:var(--card);border:1px dashed var(--border);border-radius:12px;padding:24px;text-align:center;color:var(--text3);font-size:12px">No Things to Do data for '+S.city+' yet.</div>';
      }
    } else if(tab === 'seasonal'){
      if(cityExtras && cityExtras.seasonal && cityExtras.seasonal.length){
        content = '<div class="activity-card-list">' + cityExtras.seasonal.map(function(s,i){
          return '<div class="activity-card" onclick="A.openSeasonalPick('+i+')"><div class="activity-card-emoji">'+s.emoji+'</div><div class="activity-card-body"><div class="activity-card-top"><div class="activity-card-category">Season</div><div class="activity-card-title">'+s.label+'</div></div><div class="activity-card-desc">'+s.desc+'</div><div class="activity-card-meta">'
            +(s.highlights&&s.highlights.length?'<span class="activity-pill activity-pill-gold">🎉 '+s.highlights.length+' events</span>':'')
            +(s.tips&&s.tips.length?'<span class="activity-pill">💡 '+s.tips.length+' tips</span>':'')
            +(s.eat&&s.eat.length?'<span class="activity-pill">🍽 '+s.eat.length+' picks</span>':'')
            +'</div></div><div class="activity-card-chev">›</div></div>';
        }).join('') + '</div>';
      } else {
        content = '<div style="background:var(--card);border:1px dashed var(--border);border-radius:12px;padding:24px;text-align:center;color:var(--text3);font-size:12px">No seasonal data for '+S.city+' yet.</div>';
      }
    } else if(tab === 'daytrips'){
      if(cityExtras && cityExtras.dayTrips && cityExtras.dayTrips.length){
        content = '<div class="activity-card-list">' + cityExtras.dayTrips.map(function(d,i){
          return '<div class="activity-card" onclick="A.openDayTripDetail('+i+')"><div class="activity-card-emoji">'+d.emoji+'</div><div class="activity-card-body"><div class="activity-card-top"><div class="activity-card-category">Day Trip</div><div class="activity-card-title">'+d.name+'</div></div><div class="activity-card-desc">'+d.desc+'</div><div class="activity-card-meta">'
            +(d.distance?'<span class="activity-pill activity-pill-gold">📍 '+d.distance+'</span>':'')
            +(d.driveTime?'<span class="activity-pill">🚗 '+d.driveTime+'</span>':'')
            +(d.bestSeason?'<span class="activity-pill">📅 '+d.bestSeason+'</span>':'')
            +(d.tips&&d.tips.length?'<span class="activity-pill">💡 '+d.tips.length+' tips</span>':'')
            +'</div></div><div class="activity-card-chev">›</div></div>';
        }).join('') + '</div>';
      } else {
        content = '<div style="background:var(--card);border:1px dashed var(--border);border-radius:12px;padding:24px;text-align:center;color:var(--text3);font-size:12px">No day trip data for '+S.city+' yet.</div>';
      }
    }

    el.innerHTML = '<div style="padding:14px 14px 100px">'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">'
      + '<button onclick="A.renderDiscover()" style="background:none;border:none;color:var(--gold);font-size:20px;cursor:pointer">←</button>'
      + '<div><div style="font-size:16px;font-weight:800;color:var(--gold)">🎯 Things to Do</div>'
      + '<div style="font-size:11px;color:var(--text2)">'+S.city+'</div></div></div>'
      + tabBar + content + '</div>';
  },

  setThingsToDoTab(tab){
    window._thingsToDoTab = tab;
    this.openThingsToDoPage(tab);
  },

`;

html = html.substring(0, fnStart) + newFn + html.substring(fnEnd);
console.log('Replaced openThingsToDoPage with tabbed version + added setThingsToDoTab');

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE - Batch 1 complete');
