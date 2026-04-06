const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find renderTrips boundaries
const startMarker = '  renderTrips(){';
const startIdx = html.indexOf(startMarker);
const nextMethod = html.indexOf('  extractTripFromPhoto(file){', startIdx);
let endIdx = nextMethod;
while(endIdx > startIdx && html.substring(endIdx-4, endIdx) !== '  },') endIdx--;

console.log('Replacing renderTrips:', startIdx, '->', endIdx, '('+( endIdx-startIdx)+' chars)');

const newRenderTrips = `  renderTrips(){
    const el = document.getElementById('trips-content');
    if(!el) return;
    const trip = TRIPS.current;
    const deviceId = getDeviceId();

    // --- NO ACTIVE TRIP: Create/Join ---
    if(!trip){
      const tripHistory = JSON.parse(localStorage.getItem('appetyt_trip_history')||'[]');
      el.innerHTML = \`
        \${tripHistory.length ? \`<div style="margin-bottom:16px">
          <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">📁 Past Trips</div>
          \${tripHistory.map((t,i)=>\`<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between">
            <div><div style="font-size:12px;font-weight:700;color:var(--text)">\${t.name}</div><div style="font-size:10px;color:var(--text3)">\${t.cities||''} \${t.endedAt?'· Ended '+t.endedAt:''}</div></div>
            <button onclick="A.removeFromHistory(\${i})" style="background:none;border:none;color:var(--text3);font-size:14px;cursor:pointer">×</button>
          </div>\`).join('')}
        </div>\` : ''}
        <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:12px">✈️ Create a New Trip</div>
          <input id="trip-name" placeholder="Trip name (e.g. NYC Food Crawl)" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:8px;font-family:inherit;outline:none">
          <input id="trip-cities" placeholder="Cities (e.g. New York, Paris)" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:8px;font-family:inherit;outline:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
            <div style="position:relative"><label style="position:absolute;top:4px;left:12px;font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;pointer-events:none">Start</label>
              <input id="trip-start" type="date" style="background:var(--card2);border:1px solid var(--border);color:var(--text);padding:18px 12px 6px;border-radius:10px;font-size:12px;font-family:inherit;outline:none;width:100%"></div>
            <div style="position:relative"><label style="position:absolute;top:4px;left:12px;font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;pointer-events:none">End</label>
              <input id="trip-end" type="date" style="background:var(--card2);border:1px solid var(--border);color:var(--text);padding:18px 12px 6px;border-radius:10px;font-size:12px;font-family:inherit;outline:none;width:100%"></div>
          </div>
          <input id="trip-nickname" placeholder="Your name" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:12px;font-family:inherit;outline:none">
          <button onclick="A.createTrip()" style="width:100%;background:var(--gold);color:var(--dark);font-weight:800;font-size:14px;padding:13px;border-radius:12px;border:none;cursor:pointer">Create Trip →</button>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px">
          <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:12px">🔗 Join a Trip</div>
          <input id="trip-join-nickname" placeholder="Your name" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:8px;font-family:inherit;outline:none">
          <div style="display:flex;gap:8px">
            <input id="trip-code" placeholder="ENTER CODE" maxlength="6" style="flex:1;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:18px;text-transform:uppercase;letter-spacing:4px;font-family:monospace;text-align:center;outline:none">
            <button onclick="A.joinTrip()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:13px;padding:10px 18px;border-radius:10px;border:none;cursor:pointer">Join</button>
          </div>
        </div>\`;
      return;
    }

    // --- ACTIVE TRIP: CONCIERGE DASHBOARD ---
    const reservations = TRIPS.reservations || [];
    const restaurants  = TRIPS.restaurants  || [];
    const bills        = TRIPS.bills        || [];
    const members      = TRIPS.members      || [];
    const itinerary    = TRIPS.itinerary    || [];
    const budget       = TRIPS.budget       || {total:0,spent:0};
    const checklist    = TRIPS.checklist    || [];
    const cities = Array.isArray(trip.cities) ? trip.cities : (trip.cities||trip.city||'').split(',').map(x=>x.trim()).filter(Boolean);
    const totalSpend   = bills.reduce((s,b)=>s+parseFloat(b.total||0),0);

    // KPIs
    const allItems = itinerary.flatMap(d=>d.items);
    const totalItems = allItems.length;
    const bookedItems = allItems.filter(i=>i.status==='booked'||i.status==='visited').length;
    const visitedItems = allItems.filter(i=>i.status==='visited').length;
    const pctComplete = totalItems>0 ? Math.round((visitedItems/totalItems)*100) : 0;

    // Date calculations
    const now = new Date();
    const startDate = trip.start_date ? new Date(trip.start_date+'T00:00:00') : null;
    const endDate = trip.end_date ? new Date(trip.end_date+'T00:00:00') : null;
    let countdownText = '';
    let todayDayIdx = 0;
    if(startDate && now < startDate){
      const daysUntil = Math.ceil((startDate-now)/(1000*60*60*24));
      countdownText = daysUntil===1 ? 'Tomorrow!' : daysUntil + ' days away';
    } else if(startDate && endDate && now >= startDate && now <= endDate){
      todayDayIdx = Math.floor((now-startDate)/(1000*60*60*24));
      const totalDays = Math.ceil((endDate-startDate)/(1000*60*60*24))+1;
      countdownText = 'Day ' + (todayDayIdx+1) + ' of ' + totalDays;
    } else if(endDate && now > endDate){
      countdownText = 'Trip completed';
    }
    const totalDays = itinerary.length;
    const selectedDay = Math.min(this._selectedDay||todayDayIdx, Math.max(0,itinerary.length-1));
    const ringDash = pctComplete + ', 100';
    const tripTab = this._tripTab || 'today';

    // "What's Next" logic
    const todayItems = itinerary[selectedDay]?.items || [];
    const nowMins = now.getHours()*60+now.getMinutes();
    let nextItem = null;
    todayItems.forEach(item => {
      if(item.status==='visited') return;
      if(!item.time) { if(!nextItem) nextItem=item; return; }
      const [h,m] = item.time.split(':').map(Number);
      if(h*60+(m||0) >= nowMins && !nextItem) nextItem = item;
    });
    if(!nextItem && todayItems.length) nextItem = todayItems.find(i=>i.status!=='visited') || null;

    const fmtTime = (t) => { if(!t) return ''; const [h,m]=t.split(':').map(Number); return (h%12||12)+':'+(m<10?'0':'')+m+(h>=12?' PM':' AM'); };

    el.innerHTML = \`
      <!-- SALESFORCE HEADER -->
      <div style="background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.03));border:1.5px solid rgba(201,168,76,.25);border-radius:16px;padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div style="font-size:9px;font-weight:700;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;margin-bottom:4px">ACTIVE TRIP</div>
            <div style="font-size:20px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${trip.name}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:3px">\${cities.join(' → ')}\${trip.start_date?' · '+trip.start_date+(trip.end_date?' → '+trip.end_date:''):''}</div>
            \${countdownText ? '<div style="font-size:11px;color:var(--gold2);margin-top:6px;font-weight:600">'+countdownText+'</div>' : ''}
          </div>
          <div style="position:relative;width:52px;height:52px;flex-shrink:0;margin-left:10px">
            <svg viewBox="0 0 36 36" style="width:52px;height:52px;transform:rotate(-90deg)"><circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(201,168,76,.15)" stroke-width="2.5"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-dasharray="\${ringDash}" stroke-linecap="round"/></svg>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--gold)">\${pctComplete}%</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid rgba(201,168,76,.15)">
          <div style="display:flex;gap:4px;flex-wrap:wrap;flex:1">\${members.map(m=>'<span style="font-size:10px;color:'+(m.device_id===deviceId?'var(--gold)':'var(--text3)')+'">'+( m.avatar_emoji||'👤')+' '+m.nickname+'</span>').join('<span style="color:var(--border)"> · </span>')}</div>
          <div onclick="navigator.clipboard?.writeText('\${trip.code}');A.showToast('Code copied!')" style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:4px 10px;cursor:pointer;flex-shrink:0"><span style="font-size:12px;font-weight:800;color:var(--gold);letter-spacing:2px;font-family:monospace">\${trip.code}</span></div>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:12px">
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:18px;font-weight:800;color:var(--gold)">\${totalDays}</div>
          <div style="font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.3px">Days</div>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:18px;font-weight:800;color:#4c9a6a">\${bookedItems}</div>
          <div style="font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.3px">Booked</div>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:18px;font-weight:800;color:var(--gold)">$\${totalSpend.toFixed(0)}</div>
          <div style="font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.3px">Spent</div>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center">
          <div style="font-size:18px;font-weight:800;color:#3eb8a8">\${visitedItems}</div>
          <div style="font-size:8px;color:var(--text3);text-transform:uppercase;letter-spacing:.3px">Done</div>
        </div>
      </div>

      <!-- WHAT'S NEXT CONCIERGE CARD -->
      \${nextItem ? \`
      <div style="background:linear-gradient(135deg,rgba(62,184,168,.08),rgba(62,184,168,.02));border:1.5px solid rgba(62,184,168,.25);border-radius:14px;padding:14px;margin-bottom:12px">
        <div style="font-size:9px;font-weight:700;letter-spacing:.14em;color:#3eb8a8;text-transform:uppercase;margin-bottom:8px">COMING UP</div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:42px;border-radius:12px;background:rgba(62,184,168,.12);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">\${nextItem.type==='restaurant'?'🍽️':nextItem.type==='bar'?'🍸':nextItem.type==='activity'?'🎭':'📌'}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:700;color:var(--text)">\${nextItem.name}\${nextItem.time?' · '+fmtTime(nextItem.time):''}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px">\${[nextItem.neighborhood,nextItem.notes].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <a href="https://www.google.com/maps/search/\${encodeURIComponent(nextItem.name+' '+cities[0])}" target="_blank" style="flex:1;text-align:center;padding:8px;background:rgba(62,184,168,.1);border:1px solid rgba(62,184,168,.2);border-radius:8px;color:#3eb8a8;font-size:11px;font-weight:700;text-decoration:none">📍 Directions</a>
          <button onclick="TRIPS.cycleItemStatus(\${selectedDay},&quot;\${nextItem.id}&quot;);A.renderTrips()" style="flex:1;padding:8px;background:rgba(76,154,106,.1);border:1px solid rgba(76,154,106,.2);border-radius:8px;color:#4c9a6a;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">✓ Mark Visited</button>
        </div>
      </div>\` : itinerary.length>0 ? \`
      <div style="background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;text-align:center">
        <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">\${nowMins<720?'Good morning!':'Good evening!'} Your \${nowMins<720?'morning':nowMins<1020?'afternoon':'evening'} is open</div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
          <button onclick="A.tripFind('dinner')" style="padding:8px 14px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:10px;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🍽️ Find Dinner</button>
          <button onclick="A.tripFind('drinks')" style="padding:8px 14px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:10px;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🍸 Cocktail Bar</button>
          <button onclick="A.tripFind('activity')" style="padding:8px 14px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:10px;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🎭 Something Fun</button>
        </div>
      </div>\` : ''}

      <!-- CONCIERGE TABS -->
      <div style="display:flex;gap:0;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:12px">
        \${[{id:'today',icon:'📅',label:'Today'},{id:'find',icon:'🔍',label:'Find'},{id:'budget',icon:'💰',label:'Budget'},{id:'info',icon:'⚙️',label:'Info'}].map(t=>\`
          <button onclick="A._tripTab='\${t.id}';A.renderTrips()" style="flex:1;padding:9px 4px;border:none;cursor:pointer;font-family:inherit;font-size:10px;font-weight:700;text-align:center;background:\${tripTab===t.id?'rgba(201,168,76,.12)':'transparent'};color:\${tripTab===t.id?'var(--gold)':'var(--text3)'};\${tripTab===t.id?'box-shadow:inset 0 -2px 0 var(--gold)':''}"><div style="font-size:14px;margin-bottom:1px">\${t.icon}</div>\${t.label}</button>\`).join('')}
      </div>

      <!-- TAB: TODAY -->
      \${tripTab==='today' ? \`
        \${itinerary.length === 0 ? \`
          <div style="text-align:center;padding:24px 16px">
            <div style="font-size:32px;margin-bottom:8px">📅</div>
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px">No itinerary yet</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Let the concierge build your trip</div>
            <button onclick="A.tripAISuggestAll()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:13px;padding:12px 24px;border-radius:12px;border:none;cursor:pointer">✨ Build My Itinerary</button>
          </div>
        \` : \`
          <!-- Day Selector Pills -->
          <div style="display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none;padding:2px 0">
            \${itinerary.map((day,di)=>{
              const isSelected = di===selectedDay;
              const dateLabel = day.date ? new Date(day.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) : '';
              const itemCount = day.items.length;
              return \`<button onclick="A._selectedDay=\${di};A.renderTrips()" style="flex-shrink:0;padding:8px 14px;border-radius:10px;border:2px solid \${isSelected?'var(--gold)':'var(--border)'};background:\${isSelected?'rgba(201,168,76,.12)':'var(--card)'};cursor:pointer;font-family:inherit;text-align:left;min-width:80px">
                <div style="font-size:11px;font-weight:700;color:\${isSelected?'var(--gold)':'var(--text)'}">Day \${day.day}</div>
                <div style="font-size:9px;color:var(--text3);margin-top:1px">\${dateLabel}</div>
                \${itemCount?'<div style="font-size:8px;color:var(--text3);margin-top:2px">'+itemCount+' items</div>':''}
              </button>\`;
            }).join('')}
          </div>

          <!-- Selected Day Items -->
          <div style="margin-bottom:8px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div style="font-size:13px;font-weight:700;color:var(--text)">\${itinerary[selectedDay]?.title||'Day '+(selectedDay+1)}</div>
              <button onclick="A.tripAddItemPrompt(\${selectedDay})" style="font-size:10px;color:var(--gold);background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);padding:5px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:700">+ Add</button>
            </div>
            \${(itinerary[selectedDay]?.items||[]).length === 0 ?
              '<div style="padding:20px;text-align:center;background:var(--card);border:1px dashed var(--border);border-radius:12px"><div style="font-size:11px;color:var(--text3);margin-bottom:10px">No plans yet for this day</div><div style="display:flex;gap:6px;justify-content:center"><button onclick="A.tripAISuggestDay('+selectedDay+')" style="padding:7px 14px;background:rgba(62,184,168,.08);border:1px solid rgba(62,184,168,.2);border-radius:8px;color:#3eb8a8;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🤖 AI Suggest</button><button onclick="A.tripAddItemPrompt('+selectedDay+')" style="padding:7px 14px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:8px;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+ Add Manually</button></div></div>'
            : (itinerary[selectedDay]?.items||[]).map(item=>{
              const statusColor = {planned:'var(--gold)',booked:'#4c9a6a',visited:'#3eb8a8'}[item.status]||'var(--gold)';
              const statusBg = {planned:'rgba(201,168,76,.08)',booked:'rgba(76,154,106,.08)',visited:'rgba(62,184,168,.08)'}[item.status]||'rgba(201,168,76,.08)';
              const statusLabel = {planned:'PLANNED',booked:'BOOKED',visited:'VISITED'}[item.status]||'PLANNED';
              const emoji = item.type==='restaurant'?'🍽️':item.type==='bar'?'🍸':item.type==='activity'?'🎭':'📌';
              return \`<div style="background:var(--card);border-left:3px solid \${statusColor};border-radius:0 12px 12px 0;padding:12px;margin-bottom:6px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                      <span style="font-size:13px">\${emoji}</span>
                      <span style="font-size:13px;font-weight:700;color:var(--text)">\${item.name}</span>
                      \${item.time?'<span style="font-size:10px;color:var(--text3)">'+fmtTime(item.time)+'</span>':''}
                    </div>
                    <div style="font-size:10px;color:var(--text3)">\${[item.neighborhood,item.notes].filter(Boolean).join(' · ')}</div>
                  </div>
                  <button onclick="TRIPS.cycleItemStatus(\${selectedDay},&quot;\${item.id}&quot;);A.renderTrips()" style="background:\${statusBg};border:1px solid \${statusColor};color:\${statusColor};font-size:8px;font-weight:700;padding:4px 8px;border-radius:6px;cursor:pointer;white-space:nowrap;font-family:inherit;letter-spacing:.3px">\${statusLabel}</button>
                </div>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <a href="https://www.google.com/maps/search/\${encodeURIComponent(item.name+' '+(cities[0]||''))}" target="_blank" style="font-size:10px;color:var(--text3);text-decoration:none;padding:4px 8px;background:var(--card2);border-radius:6px">📍 Map</a>
                  <button onclick="TRIPS.removeItineraryItem(\${selectedDay},&quot;\${item.id}&quot;);A.renderTrips()" style="font-size:10px;color:var(--text3);background:var(--card2);border:none;border-radius:6px;padding:4px 8px;cursor:pointer;font-family:inherit">✕ Remove</button>
                </div>
              </div>\`;
            }).join('')}
          </div>
          <div style="display:flex;gap:6px">
            <button onclick="A.tripAISuggestDay(\${selectedDay})" style="flex:1;padding:10px;background:rgba(62,184,168,.06);border:1px solid rgba(62,184,168,.2);border-radius:10px;color:#3eb8a8;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🤖 AI Suggest</button>
            <button onclick="A.tripAddItemPrompt(\${selectedDay})" style="flex:1;padding:10px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:10px;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+ Add Item</button>
            <button onclick="A.emailItinerary()" style="padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--text3);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">📧</button>
          </div>
        \`}
      \` : ''}

      <!-- TAB: FIND -->
      \${tripTab==='find' ? \`
        <div style="margin-bottom:12px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">What are you looking for?</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            \${[['🍽️ Dinner','dinner'],['🥂 Brunch','brunch'],['🍸 Drinks','drinks'],['☕ Coffee','coffee'],['🍕 Pizza','pizza'],['🎭 Activity','activity'],['🌆 Rooftop','rooftop'],['💕 Date Night','date-night']].map(([label,cat])=>
              '<button onclick="A.tripFind(\\''+cat+'\\')" style="padding:8px 14px;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">'+label+'</button>'
            ).join('')}
          </div>
          <div style="display:flex;gap:6px;margin-bottom:10px">
            <input id="trip-find-search" placeholder="Search restaurants, cuisines, neighborhoods..." style="flex:1;background:var(--card);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:10px;font-size:13px;font-family:inherit;outline:none" onkeydown="if(event.key==='Enter')A.tripFind(this.value)">
            <button onclick="A.tripFind(document.getElementById('trip-find-search').value)" style="background:var(--gold);color:var(--dark);font-weight:800;padding:10px 16px;border-radius:10px;border:none;cursor:pointer;font-size:13px">Go</button>
          </div>
        </div>
        <div id="trip-find-results"></div>
        \${restaurants.length ? \`
          <div style="margin-top:14px">
            <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">📌 Saved (\${restaurants.length})</div>
            \${restaurants.map(r=>'<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:8px 12px;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between"><div style="font-size:12px;font-weight:700;color:var(--text)">'+(r.restaurant_name||r.name)+'</div><button onclick="A.addGuideItemToDay('+selectedDay+','+(r.restaurant_id||0)+')" style="font-size:9px;color:#4c9a6a;background:rgba(76,154,106,.08);border:1px solid rgba(76,154,106,.2);padding:3px 8px;border-radius:6px;cursor:pointer;font-family:inherit;font-weight:600">+ Day '+(selectedDay+1)+'</button></div>').join('')}
          </div>\` : ''}
      \` : ''}

      <!-- TAB: BUDGET -->
      \${tripTab==='budget' ? \`
        <div style="background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:var(--gold)">$\${totalSpend.toFixed(0)}</div>
          \${budget.total>0 ? '<div style="font-size:12px;color:var(--text3);margin-top:2px">of $'+budget.total+' budget</div><div style="height:6px;background:rgba(201,168,76,.1);border-radius:3px;margin-top:8px;max-width:200px;margin-left:auto;margin-right:auto"><div style="height:100%;background:'+(totalSpend>budget.total?'#c96b4c':'var(--gold)')+';border-radius:3px;width:'+Math.min(100,Math.round(totalSpend/budget.total*100))+'%"></div></div>' : '<div style="font-size:11px;color:var(--text3);margin-top:4px">No budget set</div>'}
          <button onclick="A.editTripBudget()" style="margin-top:8px;font-size:10px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,.25);padding:4px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">Edit Budget</button>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">🧾 Bills</div>
          <button onclick="A.openTripBillModal()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:11px;padding:6px 14px;border-radius:8px;border:none;cursor:pointer">+ Add Bill</button>
        </div>
        \${bills.length===0 ? '<div style="text-align:center;padding:20px;font-size:12px;color:var(--text3)">No bills yet</div>' : bills.slice(0,15).map(b=>{
          const splitCount = (b.split_between||[]).length||1;
          return '<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between"><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:var(--text)">'+b.restaurant+'</div><div style="font-size:10px;color:var(--text3)">'+(b.date||'')+'</div></div><div style="font-size:13px;font-weight:800;color:var(--gold)">$'+parseFloat(b.total).toFixed(0)+'</div></div>';}).join('')}
      \` : ''}

      <!-- TAB: INFO -->
      \${tripTab==='info' ? \`
        <div style="margin-bottom:14px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">👥 Crew</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
            \${members.map(m=>\`<div style="background:var(--card);border:1px solid \${m.device_id===deviceId?'rgba(201,168,76,.3)':'var(--border)'};border-radius:10px;padding:6px 12px;display:flex;align-items:center;gap:6px"><span style="font-size:16px">\${m.avatar_emoji||'👤'}</span><span style="font-size:11px;font-weight:700;color:\${m.device_id===deviceId?'var(--gold)':'var(--text)'}">\${m.nickname}\${m.device_id===deviceId?' (you)':''}</span></div>\`).join('')}
          </div>
          <div style="display:flex;gap:6px;margin-bottom:14px">
            <button onclick="navigator.clipboard?.writeText('\${trip.code}');A.showToast('Code copied!')" style="flex:1;background:none;border:1px solid var(--border);color:var(--text2);font-size:11px;font-weight:700;padding:9px;border-radius:10px;cursor:pointer;font-family:inherit">📋 Copy Code</button>
            <button onclick="A.emailItinerary()" style="flex:1;background:var(--gold);color:var(--dark);font-size:11px;font-weight:800;padding:9px;border-radius:10px;border:none;cursor:pointer;font-family:inherit">📧 Email Plan</button>
          </div>
        </div>
        <div style="margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div style="font-size:13px;font-weight:700;color:var(--text)">✅ Checklist</div>
            <button onclick="A.addTripChecklist()" style="font-size:10px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,.25);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">+ Add</button>
          </div>
          \${checklist.length ? checklist.map((c,ci)=>\`
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;\${ci<checklist.length-1?'border-bottom:1px solid var(--border)':''}">
              <button onclick="TRIPS.toggleChecklist(\${ci});A.renderTrips()" style="width:18px;height:18px;border-radius:5px;border:2px solid \${c.done?'#4c9a6a':'var(--border)'};background:\${c.done?'rgba(76,154,106,.15)':'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;color:#4c9a6a">\${c.done?'✓':''}</button>
              <span style="font-size:11px;color:\${c.done?'var(--text3)':'var(--text)'};\${c.done?'text-decoration:line-through':''}; flex:1">\${c.text}</span>
              <button onclick="TRIPS.removeChecklistItem(\${ci});A.renderTrips()" style="background:none;border:none;color:var(--text3);font-size:11px;cursor:pointer">×</button>
            </div>\`).join('') : '<div style="padding:12px;font-size:11px;color:var(--text3);text-align:center">No checklist items</div>'}
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="A.endTrip()" style="flex:1;background:none;border:1px solid rgba(201,168,76,.3);color:var(--gold2);font-size:11px;font-weight:700;padding:10px;border-radius:10px;cursor:pointer">✓ End Trip</button>
          <button onclick="A.leaveTrip()" style="flex:1;background:none;border:1px solid rgba(220,70,70,.2);color:var(--text3);font-size:11px;padding:10px;border-radius:10px;cursor:pointer">Leave Trip</button>
        </div>
      \` : ''}
    \`;
  },

  // Concierge "Find" - smart category search
  tripFind(category){
    this._tripTab='find';
    this.renderTrips();
    // After render, run the search
    setTimeout(()=>{
      const trip=TRIPS.current;
      const cities=Array.isArray(trip?.cities)?trip.cities:(trip?.cities||trip?.city||'').split(',').map(x=>x.trim()).filter(Boolean);
      const city=cities[0]||S.city||'New York';
      const allData=(city==='New York'||city==='NYC')?(typeof NYC_DATA!=='undefined'?NYC_DATA:[]):(city==='Dallas'?(typeof DALLAS_DATA!=='undefined'?DALLAS_DATA:[]):[]);
      const cat=category.toLowerCase();
      let results=[];
      if(cat==='dinner') results=allData.filter(r=>r.score>=85&&(r.tags||[]).some(t=>/date|fine|italian|japanese|french|seafood/i.test(t)));
      else if(cat==='brunch') results=allData.filter(r=>(r.tags||[]).some(t=>/brunch/i.test(t)));
      else if(cat==='drinks'||cat==='cocktails') results=allData.filter(r=>(r.tags||[]).some(t=>/cocktail|bar|late/i.test(t))||(r.cuisine||'').toLowerCase().includes('bar'));
      else if(cat==='coffee') results=allData.filter(r=>(r.cuisine||'').toLowerCase().includes('coffee')||(r.tags||[]).some(t=>/coffee|bakery/i.test(t)));
      else if(cat==='pizza') results=allData.filter(r=>(r.cuisine||'').toLowerCase().includes('pizza'));
      else if(cat==='activity') results=allData.filter(r=>(r.cuisine||'').toLowerCase().match(/entertainment|club|jazz|comedy|live music/));
      else if(cat==='rooftop') results=allData.filter(r=>(r.tags||[]).some(t=>/rooftop/i.test(t)));
      else if(cat==='date-night') results=allData.filter(r=>(r.tags||[]).some(t=>/date/i.test(t)));
      else results=allData.filter(r=>{const hay=[r.name,r.cuisine,r.neighborhood,...(r.tags||[]),...(r.dishes||[])].join(' ').toLowerCase();return hay.includes(cat);});
      const existing=new Set(TRIPS.itinerary.flatMap(d=>d.items.map(i=>i.name.toLowerCase())));
      results=results.filter(r=>!existing.has(r.name.toLowerCase())).sort((a,b)=>b.score-a.score).slice(0,8);
      const el=document.getElementById('trip-find-results');
      const selDay=this._selectedDay||0;
      if(el){
        el.innerHTML=results.length?results.map(r=>'<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:6px;display:flex;align-items:center;gap:10px"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:13px;font-weight:700;color:var(--text)">'+r.name+'</span><span style="font-size:11px;font-weight:700;color:var(--gold)">'+r.score+'</span></div><div style="font-size:10px;color:var(--text3)">'+r.cuisine+' · '+r.neighborhood+'</div>'+(r.dishes?'<div style="font-size:10px;color:var(--text2);margin-top:2px">Try: '+r.dishes.slice(0,2).join(', ')+'</div>':'')+'</div><button onclick="A.addGuideItemToDay('+selDay+','+r.id+')" style="background:rgba(76,154,106,.1);border:1px solid rgba(76,154,106,.2);color:#4c9a6a;font-size:10px;font-weight:700;padding:6px 10px;border-radius:8px;cursor:pointer;flex-shrink:0;font-family:inherit;white-space:nowrap">+ Day '+(selDay+1)+'</button></div>').join(''):'<div style="padding:16px;text-align:center;font-size:12px;color:var(--text3)">No results for "'+category+'"</div>';
      }
    },50);
  },`;

html = html.substring(0, startIdx) + newRenderTrips + '\n' + html.substring(endIdx);

console.log('renderTrips rewritten with concierge approach');
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
