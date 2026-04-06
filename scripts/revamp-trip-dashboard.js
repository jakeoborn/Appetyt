const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Find renderTrips() and replace it entirely
const startMarker = '  renderTrips(){';
const startIdx = html.indexOf(startMarker);
if(startIdx === -1) { console.error('Could not find renderTrips()'); process.exit(1); }

// Find the end of renderTrips - it ends with "  }," followed by blank lines and extractTripFromPhoto
// Find the closing of renderTrips - "  }," before extractTripFromPhoto
const extractIdx = html.indexOf('  extractTripFromPhoto(file){', startIdx);
if(extractIdx === -1) { console.error('Could not find extractTripFromPhoto'); process.exit(1); }
// Walk backwards to find the end of renderTrips (the "}," line)
let endIdx = extractIdx;
while(endIdx > startIdx && html.substring(endIdx-4, endIdx) !== '  },') endIdx--;
if(endIdx <= startIdx) { console.error('Could not find renderTrips end brace'); process.exit(1); }
// endIdx now points right after "  },"
if(endIdx === -1) { console.error('Could not find end of renderTrips()'); process.exit(1); }

const newRenderTrips = `  renderTrips(){
    const el = document.getElementById('trips-content');
    if(!el) return;
    const trip = TRIPS.current;
    const deviceId = getDeviceId();

    if(!trip){
      // --- NO ACTIVE TRIP: Show create/join ---
      const tripHistory = JSON.parse(localStorage.getItem('appetyt_trip_history')||'[]');
      el.innerHTML = \`
        \${tripHistory.length ? \`
        <div style="margin-bottom:16px">
          <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;display:flex;align-items:center;gap:8px">📁 Past Trips <div style="flex:1;height:1px;background:rgba(200,169,110,.08)"></div></div>
          \${tripHistory.map((t,i)=>\`
            <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-size:12px;font-weight:700;color:var(--text)">\${t.name}</div>
                <div style="font-size:10px;color:var(--text3)">\${t.cities||''} \${t.endedAt?'· Ended '+t.endedAt:''}</div>
              </div>
              <button onclick="A.removeFromHistory(\${i})" style="background:none;border:none;color:var(--text3);font-size:14px;cursor:pointer">×</button>
            </div>\`).join('')}
        </div>\` : ''}
        <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px">
          <div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:12px">✈️ Create a New Trip</div>
          <input id="trip-name" placeholder="Trip name (e.g. NYC Food Crawl)" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:8px;font-family:inherit;outline:none">
          <input id="trip-cities" placeholder="Cities (e.g. New York, Paris)" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:8px;font-family:inherit;outline:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
            <div style="position:relative">
              <label style="position:absolute;top:4px;left:12px;font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;pointer-events:none">Start Date</label>
              <input id="trip-start" type="date" style="background:var(--card2);border:1px solid var(--border);color:var(--text);padding:18px 12px 6px;border-radius:10px;font-size:12px;font-family:inherit;outline:none;width:100%">
            </div>
            <div style="position:relative">
              <label style="position:absolute;top:4px;left:12px;font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;pointer-events:none">End Date</label>
              <input id="trip-end" type="date" style="background:var(--card2);border:1px solid var(--border);color:var(--text);padding:18px 12px 6px;border-radius:10px;font-size:12px;font-family:inherit;outline:none;width:100%">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
            <div>
              <div style="font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:5px">Trip Vibe</div>
              <select id="trip-vibe" class="planner-select" style="width:100%">
                <option value="Foodie Deep Dive">🍽️ Foodie</option>
                <option value="Date Night">💕 Date Night</option>
                <option value="Bar Crawl">🍸 Bar Crawl</option>
                <option value="Fine Dining">🎖️ Fine Dining</option>
                <option value="Budget Street Food">💰 Budget</option>
                <option value="Family">👨‍👩‍👧 Family</option>
              </select>
            </div>
            <div>
              <div style="font-size:9px;color:var(--text3);font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:5px">Budget</div>
              <input id="trip-budget" type="number" placeholder="$2,000" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;font-family:inherit;outline:none">
            </div>
          </div>
          <input id="trip-nickname" placeholder="Your name on this trip" style="width:100%;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:12px;font-family:inherit;outline:none">
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

    // --- ACTIVE TRIP DASHBOARD ---
    const reservations = TRIPS.reservations || [];
    const restaurants  = TRIPS.restaurants  || [];
    const bills        = TRIPS.bills        || [];
    const members      = TRIPS.members      || [];
    const itinerary    = TRIPS.itinerary    || [];
    const budget       = TRIPS.budget       || {total:0,spent:0};
    const checklist    = TRIPS.checklist    || [];
    const cities = Array.isArray(trip.cities) ? trip.cities : (trip.cities||'').split(',').map(x=>x.trim()).filter(Boolean);
    const settlements  = TRIPS.calcSettlements();
    const totalSpend   = bills.reduce((s,b)=>s+parseFloat(b.total||0),0);

    // Compute dashboard KPIs
    const allItems = itinerary.flatMap(d=>d.items);
    const totalItems = allItems.length;
    const bookedItems = allItems.filter(i=>i.status==='booked'||i.status==='visited').length;
    const visitedItems = allItems.filter(i=>i.status==='visited').length;
    const pctComplete = totalItems>0 ? Math.round((visitedItems/totalItems)*100) : 0;
    const checkDone = checklist.filter(c=>c.done).length;

    // Date calculations
    const now = new Date();
    const startDate = trip.start_date ? new Date(trip.start_date+'T00:00:00') : null;
    const endDate = trip.end_date ? new Date(trip.end_date+'T00:00:00') : null;
    let countdownText = '';
    if(startDate && now < startDate){
      const daysUntil = Math.ceil((startDate-now)/(1000*60*60*24));
      countdownText = daysUntil===1 ? 'Tomorrow!' : daysUntil + ' days away';
    } else if(startDate && endDate && now >= startDate && now <= endDate){
      const dayNum = Math.ceil((now-startDate)/(1000*60*60*24))+1;
      const totalDays = Math.ceil((endDate-startDate)/(1000*60*60*24))+1;
      countdownText = 'Day ' + dayNum + ' of ' + totalDays + ' -- enjoy!';
    } else if(endDate && now > endDate){
      countdownText = 'Trip completed';
    }
    const totalDays = itinerary.length || (startDate && endDate ? Math.ceil((endDate-startDate)/(1000*60*60*24))+1 : 0);

    // Progress ring SVG
    const ringPct = pctComplete;
    const ringDash = ringPct + ', 100';

    // Sub-tab state
    const tripTab = this._tripTab || 'timeline';

    el.innerHTML = \`
      <!-- DASHBOARD HEADER -->
      <div style="background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.03));border:1.5px solid rgba(201,168,76,.25);border-radius:16px;padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div style="font-size:9px;font-weight:700;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;margin-bottom:4px">ACTIVE TRIP</div>
            <div style="font-size:20px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${trip.name}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:3px">\${cities.join(' → ')}\${trip.start_date?' · '+trip.start_date+(trip.end_date?' → '+trip.end_date:''):''}</div>
            \${countdownText ? '<div style="font-size:11px;color:var(--gold2);margin-top:6px;font-weight:600">'+countdownText+'</div>' : ''}
          </div>
          <div style="position:relative;width:56px;height:56px;flex-shrink:0;margin-left:10px">
            <svg viewBox="0 0 36 36" style="width:56px;height:56px;transform:rotate(-90deg)">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(201,168,76,.15)" stroke-width="2.5"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-dasharray="\${ringDash}" stroke-linecap="round"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--gold)">\${ringPct}%</div>
          </div>
        </div>
        <!-- Trip code + members -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid rgba(201,168,76,.15)">
          <div style="display:flex;gap:4px;flex-wrap:wrap;flex:1">
            \${members.map(m=>'<span style="font-size:10px;color:'+(m.device_id===deviceId?'var(--gold)':'var(--text3)')+'">'+( m.avatar_emoji||'👤')+' '+m.nickname+'</span>').join('<span style="color:var(--border)"> · </span>')}
          </div>
          <div onclick="navigator.clipboard?.writeText('\${trip.code}');A.showToast('Code copied!')" style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:4px 10px;cursor:pointer;flex-shrink:0">
            <span style="font-size:12px;font-weight:800;color:var(--gold);letter-spacing:2px;font-family:monospace">\${trip.code}</span>
          </div>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px">
          <div style="font-size:20px;font-weight:800;color:var(--gold)">\${totalDays}</div>
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px">\${countdownText.includes('Day ')?'Total Days':'Days'}</div>
          <div style="height:3px;background:rgba(201,168,76,.1);border-radius:2px;margin-top:6px"><div style="height:100%;background:var(--gold);border-radius:2px;width:\${pctComplete}%"></div></div>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px">
          <div style="font-size:20px;font-weight:800;color:#4c9a6a">\${bookedItems}<span style="font-size:12px;color:var(--text3);font-weight:400">/\${totalItems}</span></div>
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px">Booked</div>
          <div style="height:3px;background:rgba(76,154,106,.1);border-radius:2px;margin-top:6px"><div style="height:100%;background:#4c9a6a;border-radius:2px;width:\${totalItems?Math.round(bookedItems/totalItems*100):0}%"></div></div>
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px">
          <div style="font-size:20px;font-weight:800;color:var(--gold)">$\${totalSpend.toFixed(0)}<span style="font-size:12px;color:var(--text3);font-weight:400">\${budget.total>0?'/$'+budget.total:''}</span></div>
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px">Spent</div>
          \${budget.total>0?'<div style="height:3px;background:rgba(201,168,76,.1);border-radius:2px;margin-top:6px"><div style="height:100%;background:var(--gold);border-radius:2px;width:'+Math.min(100,Math.round(totalSpend/budget.total*100))+'%"></div></div>':''}
        </div>
        <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px">
          <div style="font-size:20px;font-weight:800;color:#3eb8a8">\${visitedItems}<span style="font-size:12px;color:var(--text3);font-weight:400">/\${totalItems}</span></div>
          <div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px">Visited</div>
          <div style="height:3px;background:rgba(62,184,168,.1);border-radius:2px;margin-top:6px"><div style="height:100%;background:#3eb8a8;border-radius:2px;width:\${totalItems?Math.round(visitedItems/totalItems*100):0}%"></div></div>
        </div>
      </div>

      <!-- SUB-TABS -->
      <div style="display:flex;gap:0;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:14px">
        \${[
          {id:'timeline',icon:'📋',label:'Timeline'},
          {id:'dining',icon:'🍽️',label:'Dining'},
          {id:'budget',icon:'💰',label:'Budget'},
          {id:'info',icon:'⚙️',label:'Info'},
        ].map(t=>\`
          <button onclick="A._tripTab='\${t.id}';A.renderTrips()" style="flex:1;padding:10px 4px;border:none;cursor:pointer;font-family:inherit;font-size:10px;font-weight:700;text-align:center;background:\${tripTab===t.id?'rgba(201,168,76,.12)':'transparent'};color:\${tripTab===t.id?'var(--gold)':'var(--text3)'};\${tripTab===t.id?'box-shadow:inset 0 -2px 0 var(--gold)':''}">
            <div style="font-size:16px;margin-bottom:2px">\${t.icon}</div>\${t.label}
          </button>\`).join('')}
      </div>

      <!-- TAB: TIMELINE -->
      \${tripTab==='timeline' ? \`
        \${itinerary.length === 0 ? \`
          <div style="text-align:center;padding:30px 16px">
            <div style="font-size:32px;margin-bottom:8px">📅</div>
            <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px">No itinerary yet</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:14px;line-height:1.6">Get AI suggestions for restaurants and activities, then add them to your trip</div>
            <button onclick="A.tripAISuggestAll()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:13px;padding:12px 24px;border-radius:12px;border:none;cursor:pointer">✨ Get AI Suggestions</button>
          </div>
        \` : itinerary.map((day,di)=>{
          const statusColor = {planned:'var(--gold)',booked:'#4c9a6a',visited:'#3eb8a8'};
          const statusBg = {planned:'rgba(201,168,76,.1)',booked:'rgba(76,154,106,.1)',visited:'rgba(62,184,168,.1)'};
          const statusLabel = {planned:'PLANNED',booked:'BOOKED',visited:'VISITED'};
          const dateStr = day.date ? new Date(day.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) : '';
          return \`
          <div style="margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:28px;height:28px;border-radius:50%;background:rgba(201,168,76,.12);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--gold);flex-shrink:0">\${day.day}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:700;color:var(--text)">\${day.title}</div>
                <div style="font-size:10px;color:var(--text3)">\${dateStr}</div>
              </div>
              <button onclick="A.tripAddItemPrompt(\${di})" style="font-size:10px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,.25);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">+ Add</button>
            </div>
            \${day.items.length===0 ? '<div style="padding:10px;font-size:11px;color:var(--text3);background:var(--card);border-radius:10px;border:1px dashed var(--border);text-align:center;margin-left:36px">No plans yet -- tap + Add or use AI Suggest</div>' :
            day.items.map(item=>\`
              <div style="margin-left:36px;margin-bottom:6px;background:var(--card);border-left:3px solid \${statusColor[item.status]||'var(--gold)'};border-radius:0 10px 10px 0;padding:10px 12px;display:flex;align-items:center;gap:10px">
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    <span style="font-size:12px">\${item.type==='restaurant'?'🍽️':item.type==='activity'?'🎭':item.type==='bar'?'🍸':'📌'}</span>
                    <span style="font-size:12px;font-weight:700;color:var(--text)">\${item.name}</span>
                  </div>
                  <div style="font-size:10px;color:var(--text3)">\${[item.time,item.neighborhood,item.notes].filter(Boolean).join(' · ')}</div>
                </div>
                <button onclick="TRIPS.cycleItemStatus(\${di},'\\'\${item.id}\\'');A.renderTrips()" style="background:\${statusBg[item.status]};border:1px solid \${statusColor[item.status]};color:\${statusColor[item.status]};font-size:8px;font-weight:700;padding:3px 8px;border-radius:6px;cursor:pointer;white-space:nowrap;font-family:inherit;letter-spacing:.3px">\${statusLabel[item.status]||'PLANNED'}</button>
                <button onclick="TRIPS.removeItineraryItem(\${di},'\\'\${item.id}\\'');A.renderTrips()" style="background:none;border:none;color:var(--text3);font-size:14px;cursor:pointer;padding:0;flex-shrink:0">×</button>
              </div>
            \`).join('')}
            <button onclick="A.tripAISuggestDay(\${di})" style="margin-left:36px;margin-top:4px;font-size:10px;color:#3eb8a8;background:rgba(62,184,168,.06);border:1px solid rgba(62,184,168,.2);padding:5px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">🤖 AI Suggest for this day</button>
          </div>\`;
        }).join('')}
        <div id="trip-ai-day-suggestions" style="display:none;margin-top:10px"></div>
      \` : ''}

      <!-- TAB: DINING -->
      \${tripTab==='dining' ? \`
        <!-- Quick Actions -->
        <div style="display:flex;gap:6px;margin-bottom:14px;overflow-x:auto;scrollbar-width:none">
          <button onclick="A._tripDiningSub='search';A.renderTrips()" style="flex-shrink:0;padding:8px 14px;border-radius:10px;border:1px solid \${(this._tripDiningSub||'')==='search'?'var(--gold)':'var(--border)'};background:\${(this._tripDiningSub||'')==='search'?'rgba(201,168,76,.12)':'var(--card)'};color:\${(this._tripDiningSub||'')==='search'?'var(--gold)':'var(--text2)'};font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🔍 Find Restaurants</button>
          <button onclick="A._tripDiningSub='suggest';A.renderTrips()" style="flex-shrink:0;padding:8px 14px;border-radius:10px;border:1px solid \${(this._tripDiningSub||'')==='suggest'?'rgba(62,184,168,.4)':'var(--border)'};background:\${(this._tripDiningSub||'')==='suggest'?'rgba(62,184,168,.1)':'var(--card)'};color:\${(this._tripDiningSub||'')==='suggest'?'#3eb8a8':'var(--text2)'};font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">🤖 AI Suggest</button>
          <button onclick="A.openAddReservation('restaurant')" style="flex-shrink:0;padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text2);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">📅 Reservation</button>
        </div>

        <!-- Restaurant Search Panel -->
        \${(this._tripDiningSub||'')==='search' ? \`
        <div style="background:var(--card);border:1px solid rgba(201,168,76,.2);border-radius:12px;padding:14px;margin-bottom:14px">
          <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:8px">Search restaurants in your trip cities</div>
          <div style="display:flex;gap:6px;margin-bottom:10px">
            <input id="trip-search-input" placeholder="Search by name, cuisine, vibe..." style="flex:1;background:var(--card2);border:1px solid var(--border);color:var(--text);padding:9px 12px;border-radius:10px;font-size:13px;font-family:inherit;outline:none" onkeydown="if(event.key==='Enter')A.tripRestaurantSearch()">
            <button onclick="A.tripRestaurantSearch()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:13px;padding:9px 16px;border-radius:10px;border:none;cursor:pointer">Go</button>
          </div>
          <div id="trip-search-results"></div>
        </div>\` : ''}

        <!-- AI Suggestions Panel -->
        \${(this._tripDiningSub||'')==='suggest' ? \`
        <div style="background:linear-gradient(135deg,rgba(62,184,168,.06),rgba(62,184,168,.02));border:1px solid rgba(62,184,168,.2);border-radius:12px;padding:14px;margin-bottom:14px">
          <div style="font-size:12px;font-weight:700;color:#3eb8a8;margin-bottom:4px">🤖 AI Dining Suggestions</div>
          <div style="font-size:10px;color:var(--text3);margin-bottom:10px">Get picks based on your trip cities and vibe</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            \${['Best for our group','Date night spot','Casual dinner','Local must-try','Brunch spot','Late night eats','Splurge-worthy'].map(chip=>
              '<button onclick="A.tripAISuggest(\\''+chip.replace(/'/g,"\\\\'")+'\\')" style="font-size:10px;padding:5px 10px;border-radius:8px;border:1px solid rgba(62,184,168,.25);background:rgba(62,184,168,.06);color:#3eb8a8;cursor:pointer;font-family:inherit;font-weight:600">'+chip+'</button>'
            ).join('')}
          </div>
          <div id="trip-ai-suggestions" style="margin-top:10px"></div>
        </div>\` : ''}

        <!-- Restaurant Pipeline -->
        <div style="margin-bottom:14px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px">🍽️ Saved Restaurants (\${restaurants.length})</div>
          \${restaurants.length ? restaurants.map(r => {
            const votes = r.votes||{};
            const score = Object.values(votes).reduce((s,v)=>s+v,0);
            const myVote = votes[deviceId];
            return '<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px"><div style="display:flex;align-items:center;gap:10px"><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--text)">'+(r.restaurant_name||r.name)+'</div><div style="font-size:10px;color:var(--text3)">'+(r.city||'')+'</div></div><div style="display:flex;align-items:center;gap:3px"><button onclick="TRIPS.vote(\\''+r.id+'\\','+( myVote===1?0:1)+')" style="font-size:11px;background:'+(myVote===1?'rgba(76,154,110,.2)':'var(--card2)')+';border:1px solid '+(myVote===1?'#4c9a6e':'var(--border)')+';border-radius:6px;padding:3px 6px;cursor:pointer">👍</button><span style="font-size:10px;font-weight:700;color:'+(score>0?'#4c9a6e':score<0?'#c96b4c':'var(--text3)')+';min-width:16px;text-align:center">'+(score>0?'+':'')+score+'</span><button onclick="TRIPS.vote(\\''+r.id+'\\','+(myVote===-1?0:-1)+')" style="font-size:11px;background:'+(myVote===-1?'rgba(201,107,76,.2)':'var(--card2)')+';border:1px solid '+(myVote===-1?'#c96b4c':'var(--border)')+';border-radius:6px;padding:3px 6px;cursor:pointer">👎</button></div></div></div>';}).join('') : '<div style="text-align:center;padding:20px;font-size:12px;color:var(--text3)"><div style="font-size:24px;margin-bottom:6px">🍽️</div>Search above or browse the guide to save restaurants</div>'}
        </div>
      \` : ''}

      <!-- TAB: BUDGET -->
      \${tripTab==='budget' ? \`
        <!-- Budget Overview -->
        <div style="background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:16px;margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:700;color:var(--gold)">💰 Trip Budget</div>
            <button onclick="A.editTripBudget()" style="font-size:10px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,.25);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">Edit</button>
          </div>
          <div style="text-align:center;margin-bottom:12px">
            <div style="font-size:28px;font-weight:800;color:var(--gold)">$\${totalSpend.toFixed(0)}</div>
            \${budget.total>0 ? '<div style="font-size:12px;color:var(--text3);margin-top:2px">of $'+budget.total+' budget</div><div style="height:6px;background:rgba(201,168,76,.1);border-radius:3px;margin-top:8px;max-width:200px;margin-left:auto;margin-right:auto"><div style="height:100%;background:'+(totalSpend>budget.total?'#c96b4c':'var(--gold)')+';border-radius:3px;width:'+Math.min(100,Math.round(totalSpend/budget.total*100))+'%"></div></div><div style="font-size:10px;color:var(--text3);margin-top:4px">'+Math.round(totalSpend/budget.total*100)+'% used</div>' : '<div style="font-size:11px;color:var(--text3);margin-top:4px">No budget set</div>'}
          </div>
          \${members.length>1 ? '<div style="font-size:11px;color:var(--text3);text-align:center">$'+(totalSpend/members.length).toFixed(0)+'/person avg · '+bills.length+' bills</div>' : ''}
        </div>

        <!-- Settlements -->
        \${settlements.length > 0 ? \`
        <div style="background:linear-gradient(135deg,rgba(76,154,110,.08),rgba(76,154,110,.02));border:1px solid rgba(76,154,110,.2);border-radius:12px;padding:12px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:#4c9a6e;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">💸 Settle Up</div>
          \${settlements.map(s=>\`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0">
              <div style="font-size:12px;color:var(--text2)">
                <span style="font-weight:\${s.fromId===deviceId?'700':'400'};color:\${s.fromId===deviceId?'#c96b4c':'var(--text)'}">\${s.from}</span>
                <span style="color:var(--text3)"> → </span>
                <span style="font-weight:\${s.toId===deviceId?'700':'400'};color:\${s.toId===deviceId?'#4c9a6e':'var(--text)'}">\${s.to}</span>
              </div>
              <span style="font-size:13px;font-weight:800;color:var(--gold)">$\${s.amount.toFixed(2)}</span>
            </div>\`).join('')}
        </div>\` : ''}

        <!-- Bills List -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--text)">🧾 Bills</div>
          <button onclick="A.openTripBillModal()" style="background:var(--gold);color:var(--dark);font-weight:800;font-size:11px;padding:6px 14px;border-radius:8px;border:none;cursor:pointer">+ Add Bill</button>
        </div>
        \${bills.length===0 ? '<div style="text-align:center;padding:24px;font-size:12px;color:var(--text3)"><div style="font-size:28px;margin-bottom:8px">🧾</div>No bills yet. Add your first meal to start splitting costs.</div>' : bills.slice(0,15).map(b=>{
          const splitCount = (b.split_between||[]).length||1;
          const memberName = (did) => members.find(m=>m.device_id===did)?.nickname || 'Someone';
          return '<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between"><div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:var(--text)">'+b.restaurant+'</div><div style="font-size:10px;color:var(--text3)">'+ [b.city,b.date,memberName(b.paid_by)+' paid'].filter(Boolean).join(' · ')+'</div></div><div style="text-align:right;flex-shrink:0;margin-left:8px"><div style="font-size:13px;font-weight:800;color:var(--gold)">$'+parseFloat(b.total).toFixed(2)+'</div><div style="font-size:9px;color:var(--text3)">$'+(parseFloat(b.total)/splitCount).toFixed(0)+'/ea</div></div></div>';}).join('')}
      \` : ''}

      <!-- TAB: INFO -->
      \${tripTab==='info' ? \`
        <!-- Members -->
        <div style="margin-bottom:14px">
          <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:10px">👥 Crew (\${members.length})</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
            \${members.map(m=>\`
              <div style="background:var(--card);border:1px solid \${m.device_id===deviceId?'rgba(201,168,76,.3)':'var(--border)'};border-radius:12px;padding:8px 14px;display:flex;align-items:center;gap:8px">
                <span style="font-size:18px">\${m.avatar_emoji||'👤'}</span>
                <div>
                  <div style="font-size:12px;font-weight:700;color:\${m.device_id===deviceId?'var(--gold)':'var(--text)'}">\${m.nickname}\${m.device_id===deviceId?' (you)':''}</div>
                </div>
              </div>\`).join('')}
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="navigator.clipboard?.writeText('\${trip.code}');A.showToast('Code copied!')" style="flex:1;background:none;border:1px solid var(--border);color:var(--text2);font-size:11px;font-weight:700;padding:9px;border-radius:10px;cursor:pointer;font-family:inherit">📋 Copy Code</button>
            <button onclick="A.openShareModal()" style="flex:1;background:var(--gold);color:var(--dark);font-size:11px;font-weight:800;padding:9px;border-radius:10px;border:none;cursor:pointer;font-family:inherit">📤 Share</button>
          </div>
        </div>

        <!-- Checklist -->
        <div style="margin-bottom:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="font-size:14px;font-weight:700;color:var(--text)">✅ Checklist (\${checkDone}/\${checklist.length})</div>
            <button onclick="A.addTripChecklist()" style="font-size:10px;color:var(--gold);background:none;border:1px solid rgba(201,168,76,.25);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600">+ Add</button>
          </div>
          \${checklist.length ? checklist.map((c,ci)=>\`
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;\${ci<checklist.length-1?'border-bottom:1px solid var(--border)':''}">
              <button onclick="TRIPS.toggleChecklist(\${ci});A.renderTrips()" style="width:20px;height:20px;border-radius:6px;border:2px solid \${c.done?'#4c9a6a':'var(--border)'};background:\${c.done?'rgba(76,154,106,.15)':'transparent'};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;color:#4c9a6a">\${c.done?'✓':''}</button>
              <span style="font-size:12px;color:\${c.done?'var(--text3)':'var(--text)'};\${c.done?'text-decoration:line-through':''}; flex:1">\${c.text}</span>
              <button onclick="TRIPS.removeChecklistItem(\${ci});A.renderTrips()" style="background:none;border:none;color:var(--text3);font-size:12px;cursor:pointer">×</button>
            </div>\`).join('') : '<div style="padding:16px;font-size:11px;color:var(--text3);text-align:center">No checklist items yet</div>'}
        </div>

        <!-- End / Leave Trip -->
        <div style="display:flex;gap:8px;margin-top:14px">
          <button onclick="A.endTrip()" style="flex:1;background:none;border:1px solid rgba(201,168,76,.3);color:var(--gold2);font-size:11px;font-weight:700;padding:10px;border-radius:10px;cursor:pointer">✓ End Trip</button>
          <button onclick="A.leaveTrip()" style="flex:1;background:none;border:1px solid rgba(220,70,70,.2);color:var(--text3);font-size:11px;padding:10px;border-radius:10px;cursor:pointer">Leave Trip</button>
        </div>
      \` : ''}
    \`;
  },`;

// endIdx is right after "  }," - replace from startIdx to endIdx
html = html.substring(0, startIdx) + newRenderTrips + '\n' + html.substring(endIdx);

console.log('renderTrips replaced successfully');

// Now add the new dashboard helper methods after extractTripFromPhoto
// Find the end of extractTripFromPhoto
const afterExtractSearch = "if(btn) btn.style.opacity='1';";
let afterExtractIdx = html.indexOf(afterExtractSearch);
if(afterExtractIdx === -1) { console.error('Could not find extractTripFromPhoto end'); process.exit(1); }
// Find the closing "}," after this line
const closeBrace = html.indexOf('},', afterExtractIdx);
afterExtractIdx = closeBrace + 2; // point right after "},"

const newMethods = `
  // --- TRIP DASHBOARD HELPERS ---
  tripAddItemPrompt(dayIndex){
    const name = prompt('Item name (e.g. Carbone dinner):');
    if(!name) return;
    const type = prompt('Type: restaurant, activity, or bar','restaurant') || 'restaurant';
    const time = prompt('Time (e.g. 19:00):','') || '';
    TRIPS.addItineraryItem(dayIndex, {name, type, time, neighborhood:'', notes:'', cost:null});
    this.renderTrips();
  },

  addTripChecklist(){
    const text = prompt('Checklist item:');
    if(!text) return;
    TRIPS.addChecklistItem(text);
    this.renderTrips();
  },

  editTripBudget(){
    const val = prompt('Trip budget ($):', TRIPS.budget.total||'');
    if(val===null) return;
    TRIPS.setBudget(val);
    this.renderTrips();
  },

  tripAISuggestAll(){
    // Build itinerary from trip dates if empty
    const trip = TRIPS.current;
    if(!trip) return;
    if(TRIPS.itinerary.length===0 && trip.start_date && trip.end_date){
      TRIPS.buildItinerary(trip.start_date, trip.end_date);
    } else if(TRIPS.itinerary.length===0){
      TRIPS.itinerary = [{day:1,date:'',title:'Day 1',items:[]},{day:2,date:'',title:'Day 2',items:[]},{day:3,date:'',title:'Day 3',items:[]}];
      TRIPS._saveLocal();
    }
    // Get AI suggestions for each day
    this.tripAISuggestDay(0);
    this.renderTrips();
  },

  async tripAISuggestDay(dayIndex){
    const trip = TRIPS.current;
    if(!trip) return;
    const cities = Array.isArray(trip.cities) ? trip.cities : (trip.cities||'').split(',').map(x=>x.trim()).filter(Boolean);
    const city = cities[0] || 'New York';
    const day = TRIPS.itinerary[dayIndex];
    if(!day) return;

    // Try to get suggestions from our restaurant data first
    const allData = (city === 'New York' || city === 'NYC') ? (window.NYC_DATA||[]) : (city === 'Dallas' ? (window.DALLAS_DATA||[]) : []);
    if(allData.length > 0){
      // Smart suggestions based on time of day
      const breakfast = allData.filter(r=>(r.tags||[]).some(t=>/brunch|bakery|coffee/i.test(t))).sort((a,b)=>b.score-a.score);
      const lunch = allData.filter(r=>(r.tags||[]).some(t=>/casual|local/i.test(t))&&r.price<=2).sort((a,b)=>b.score-a.score);
      const dinner = allData.filter(r=>(r.tags||[]).some(t=>/date|fine|italian|japanese|french/i.test(t))).sort((a,b)=>b.score-a.score);
      const bars = allData.filter(r=>(r.tags||[]).some(t=>/cocktail|bar|late/i.test(t))||(r.cuisine||'').toLowerCase().includes('bar')).sort((a,b)=>b.score-a.score);

      // Pick unique suggestions not already in itinerary
      const existing = new Set(TRIPS.itinerary.flatMap(d=>d.items.map(i=>i.name.toLowerCase())));
      const pick = (arr) => arr.find(r=>!existing.has(r.name.toLowerCase()));

      const suggestions = [];
      const bPick = pick(breakfast);
      if(bPick) suggestions.push({name:bPick.name, type:'restaurant', time:'09:00', neighborhood:bPick.neighborhood||'', notes:bPick.cuisine+' · '+(bPick.dishes||[]).slice(0,2).join(', '), status:'planned'});
      const lPick = pick(lunch.filter(r=>r.name!==(bPick||{}).name));
      if(lPick) suggestions.push({name:lPick.name, type:'restaurant', time:'12:30', neighborhood:lPick.neighborhood||'', notes:lPick.cuisine+' · '+(lPick.dishes||[]).slice(0,2).join(', '), status:'planned'});
      const dPick = pick(dinner.filter(r=>r.name!==(bPick||{}).name && r.name!==(lPick||{}).name));
      if(dPick) suggestions.push({name:dPick.name, type:'restaurant', time:'19:30', neighborhood:dPick.neighborhood||'', notes:dPick.cuisine+' · '+(dPick.dishes||[]).slice(0,2).join(', '), status:'planned'});
      const barPick = pick(bars.filter(r=>![bPick,lPick,dPick].some(p=>p&&p.name===r.name)));
      if(barPick) suggestions.push({name:barPick.name, type:'bar', time:'21:30', neighborhood:barPick.neighborhood||'', notes:(barPick.dishes||[]).slice(0,2).join(', '), status:'planned'});

      // Show suggestions as selectable cards
      const el = document.getElementById('trip-ai-day-suggestions');
      if(el){
        el.style.display = 'block';
        el.innerHTML = '<div style="font-size:12px;font-weight:700;color:#3eb8a8;margin-bottom:8px">🤖 Suggestions for ' + day.title + '</div>' +
          suggestions.map((s,si) =>
            '<div onclick="A.acceptSuggestion('+dayIndex+','+si+')" style="background:var(--card);border:1px solid rgba(62,184,168,.2);border-radius:10px;padding:10px 12px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:10px">' +
              '<span style="font-size:16px">'+(s.type==='bar'?'🍸':'🍽️')+'</span>' +
              '<div style="flex:1"><div style="font-size:12px;font-weight:700;color:var(--text)">' + s.name + '</div>' +
              '<div style="font-size:10px;color:var(--text3)">' + s.time + ' · ' + s.neighborhood + '</div></div>' +
              '<span style="font-size:11px;color:#3eb8a8;font-weight:700">+ Add</span>' +
            '</div>'
          ).join('') +
          '<div style="font-size:10px;color:var(--text3);text-align:center;margin-top:6px">Tap to add to your itinerary</div>';
        // Store suggestions temporarily
        window._tripSuggestions = suggestions;
      }
    } else {
      this.showToast('AI suggestions work best for NYC and Dallas');
    }
  },

  acceptSuggestion(dayIndex, suggestionIndex){
    const suggestions = window._tripSuggestions || [];
    const s = suggestions[suggestionIndex];
    if(!s) return;
    TRIPS.addItineraryItem(dayIndex, {...s});
    suggestions.splice(suggestionIndex, 1);
    window._tripSuggestions = suggestions;
    this.showToast('Added ' + s.name);
    this.renderTrips();
  },`;

html = html.substring(0, afterExtractIdx) + '\n\n' + newMethods.trim() + '\n' + html.substring(afterExtractIdx);

console.log('Dashboard helper methods added');

// Update createTrip to build itinerary from dates
const createTripMarker = 'async createTrip(){';
const createTripIdx = html.indexOf(createTripMarker);
if(createTripIdx !== -1){
  // Find the line after TRIPS.create and TRIPS.load, add itinerary building
  const loadLine = 'await TRIPS.load(TRIPS.current.id);';
  const loadIdx = html.indexOf(loadLine, createTripIdx);
  if(loadIdx !== -1){
    const afterLoad = loadIdx + loadLine.length;
    const budgetInit = `
      // Build itinerary + budget from form
      const startD = document.getElementById('trip-start')?.value;
      const endD = document.getElementById('trip-end')?.value;
      const budgetVal = document.getElementById('trip-budget')?.value;
      if(startD && endD) TRIPS.buildItinerary(startD, endD);
      if(budgetVal) TRIPS.setBudget(budgetVal);
      this._tripTab = 'timeline';`;
    html = html.substring(0, afterLoad) + budgetInit + html.substring(afterLoad);
    console.log('createTrip updated with itinerary/budget init');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
