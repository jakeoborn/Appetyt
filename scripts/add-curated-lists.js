// Inject Dim Hour Curated Lists feature:
//   1. New `_getCuratedLists()` method on A — returns city-keyed data
//   2. New `openCuratedList(key,listId)` method on A — opens detail modal
//   3. New "Dim Hour Curated" section in renderLists() above the 3 system lists
// Applies to BOTH copies of each block (two copies of A live in index.html).

const fs=require('fs');
const path='C:/Users/jakeo/OneDrive/Appetyt-temp/index.html';
let h=fs.readFileSync(path,'utf8');

// ─── 1. Build _getCuratedLists block ───
const curatedBlock = `  _getCuratedLists(){
    return {
      'Dallas':[
        {id:'dal-unmarked-doors',emoji:'🚪',title:'Unmarked Doors',subtitle:'Speakeasies & hidden entrances',items:[
          {id:4,note:'Underground cocktail room beneath The Joule — enter off the alley, no sign.'},
          {id:9038,note:'Downtown underground steakhouse — ring the buzzer, walk the stairs down.'},
          {id:243,note:'Japanese speakeasy tucked above Musume — reservation + password required.'},
          {id:437,note:'Cocktails inside an unmarked Uptown townhouse on Hall Street.'},
          {id:452,note:'East Dallas cocktail den — discreet signage, velvet Clint Eastwood painting inside.'},
          {id:195,note:'Quiet downtown cocktail room with no street sign — upstairs from the retail block.'}
        ]},
        {id:'dal-fuel-city-feelings',emoji:'🛻',title:'Fuel City Feelings',subtitle:'Gas stations, trailers & converted garages',items:[
          {id:55,note:'The original gas-station taco. Fill up your car, then fill up on $2 brisket tacos.'},
          {id:25,note:'Treehouse beer garden built around a Lower Greenville trailer-park lot.'},
          {id:9215,note:'East Dallas saloon in a former Eastbound & Down space — \\'70s Western fit-out.'},
          {id:274,note:'Trailer-park-themed Deep Ellum dive — yes, there is a swimming pool.'},
          {id:52,note:'Design District burger joint inside an industrial warehouse bay.'},
          {id:24,note:'Massive ice-house patio along the old Katy rail corridor.'}
        ]},
        {id:'dal-knox-cocktail-mile',emoji:'🍸',title:'Knox-Henderson Cocktail Mile',subtitle:'Single-street bar crawl up Henderson Ave',items:[
          {id:153,note:'Scene-y French café with the best people-watching terrace on Henderson.'},
          {id:96,note:'Late-night French bistro — espresso martinis flow until 1am.'},
          {id:148,note:'French-Italian newcomer with a tight negroni program.'},
          {id:123,note:'RH Rooftop — gilded conservatory dining with crystal chandeliers.'},
          {id:9068,note:'Latin American small plates + tequila-forward cocktails.'},
          {id:9069,note:'Canadian-import gastropub with a huge street patio and cheap beer.'},
          {id:9076,note:'Tex-Mex with the best house margarita on Henderson.'}
        ]},
        {id:'dal-counter-only',emoji:'👨‍🍳',title:"Chef's Counter Only",subtitle:'Seats at the pass — omakase & tasting menus',items:[
          {id:2,note:'Tatsu Ocho\\'s 12-course omakase in Deep Ellum — two seatings a night.'},
          {id:6,note:'Edomae sushi counter above West Village — weekly fish from Toyosu.'},
          {id:133,note:'Korean-Japanese omakase — Domodomo\\'s first counter outside NYC.'},
          {id:139,note:'Park Cities yakitori omakase — 17 courses of live-fire skewers.'},
          {id:68,note:'Regional Mexican tasting menu — Purépecha heritage from Chef Anastacia.'},
          {id:74,note:'Arts District sushi counter — 12-course Edomae from Chef Kozy.'},
          {id:9186,note:'Lower Greenville handroll counter — build-your-own set + a short omakase.'}
        ]},
        {id:'dal-old-money-park-cities',emoji:'💎',title:'Old Money Park Cities',subtitle:'Highland Park & University Park classics',items:[
          {id:9107,note:'Highland Park Village since 1980 — fried lobster tail, Dover sole, tableside Caesar.'},
          {id:79,note:'Park Cities Italian mainstay — the ladies-who-lunch crown jewel.'},
          {id:114,note:'The original Javier\\'s: Mexico City fine dining, waiters in white jackets.'},
          {id:119,note:'Highland Park Village Italian — the truffled tagliatelle never leaves the menu.'},
          {id:5,note:'Frenchie — all-day café on Mockingbird Lane, pastries from 7am.'},
          {id:100,note:'Rise No 1 — the original Park Cities soufflé bistro.'},
          {id:110,note:'Empire Baking — neighborhood bakery for brioche and birthday cakes since 1996.'}
        ]},
        {id:'dal-open-past-1am',emoji:'🌙',title:'Open Past 1am',subtitle:'The real late-night eats map',items:[
          {id:4,note:'Until 2am Tue-Sun — the city\\'s late-night craft cocktail anchor.'},
          {id:12,note:'Until 2am — downtown listening bar, vinyl-only after midnight.'},
          {id:22,note:'Until 2am daily — Victory Park rooftop, full kitchen till close.'},
          {id:38,note:'Until 2am daily — Deep Ellum live music + burgers + pitcher-of-Shiner culture.'},
          {id:9074,note:'Until 2am daily — Korean gaming bar + karaoke in Carrollton.'},
          {id:9053,note:'Until 2am daily — Las Colinas lounge (fine dining cuts at 9pm).'},
          {id:167,note:'Until 2am Wed-Sun — Harwood District Latin rooftop.'}
        ]},
        {id:'dal-pre-game-victory',emoji:'🏀',title:'Pre-Game in Victory Park',subtitle:'Walkable dining before American Airlines Center',items:[
          {id:22,note:'Three-story rooftop a block from AAC — the obvious pre-game.'},
          {id:41,note:'Live Texas country + beer + steak in Uptown — 12-min walk to tipoff.'},
          {id:24,note:'Katy Trail patio — walk the trail straight to Victory Plaza.'},
          {id:13,note:'Uchi\\'s modern Japanese counter — 10 min from AAC by Uber.'},
          {id:32,note:'Nobu Dallas — Uptown date-night pre-game.'},
          {id:18,note:'The Henry\\'s all-day American — ahi poke and a martini before tipoff.'}
        ]},
        {id:'dal-rooftops',emoji:'🌆',title:'Rooftops Over Dallas',subtitle:'Up-high dining with skyline views',items:[
          {id:47,note:'Crown Block — 560 feet up Reunion Tower, full 360° skyline.'},
          {id:9227,note:'SĒR Steak — 27th floor of the Hilton Anatole, Design District panorama.'},
          {id:123,note:'RH Rooftop — open-air glass conservatory on Knox Street.'},
          {id:149,note:'Mirador — Forty Five Ten downtown rooftop, cocktails over Main Street.'},
          {id:167,note:'Te Deseo — Harwood District Latin rooftop.'},
          {id:22,note:'Happiest Hour — three-story patio, largest rooftop in Victory Park.'},
          {id:117,note:'Pesca — Trinity Groves rooftop with skyline views across the Trinity.'}
        ]}
      ]
    };
  },
`;

// Install _getCuratedLists just before each _getWeekendGuides definition.
// Count weekend-guide hooks before, install, count after.
const wgHook = /(  _getWeekendGuides\(\)\{)/g;
const before = (h.match(wgHook)||[]).length;
if (before !== 2){ console.error('Expected 2 _getWeekendGuides defs, got', before); process.exit(1); }
h = h.replace(wgHook, curatedBlock + '$1');
console.log('installed _getCuratedLists before both _getWeekendGuides copies');

// ─── 2. Install openCuratedList method just after each _getWeekendGuides closing `},` ───
// A simpler insertion point: right after \`  _getWeekendGuides(){...}\` — we rely on \`_activityDetailHTML\` coming right after.
// We'll inject the method just before \`_activityDetailHTML(item,headerTitle,opts){\`.

const openCuratedBlock = `  openCuratedList(cityKey,listId){
    const lists=(this._getCuratedLists()||{})[cityKey]||[];
    const list=lists.find(l=>l.id===listId);
    if(!list)return;
    const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const byId={};this.getRestaurants().forEach(r=>{byId[r.id]=r;});
    Object.keys(CITY_DATA||{}).forEach(k=>{(CITY_DATA[k]||[]).forEach(r=>{if(!byId[r.id])byId[r.id]=r;});});
    const rows=(list.items||[]).map(it=>{
      const r=byId[it.id];
      const name=r?r.name:'(missing)';
      const meta=r?[r.neighborhood,r.cuisine].filter(Boolean).join(' · '):'';
      const photo=r&&r.photoUrl?\`background-image:url('\${esc(r.photoUrl)}');background-size:cover;background-position:center\`:'background:linear-gradient(135deg,rgba(200,169,110,0.14),rgba(200,169,110,0.02));display:flex;align-items:center;justify-content:center;font-size:22px';
      const ph=r&&r.photoUrl?'':'🍽';
      const onclick=r?\`onclick="document.getElementById('curated-modal').style.display='none';A.openDetail(\${r.id})"\`:'';
      return \`<div \${onclick} style="display:flex;gap:12px;padding:12px;margin-bottom:10px;background:rgba(10,13,20,0.5);border:0.5px solid rgba(200,169,110,0.18);border-radius:12px;cursor:pointer">
        <div style="width:72px;height:72px;border-radius:10px;flex-shrink:0;\${photo}">\${ph}</div>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--serif);font-style:italic;font-weight:700;font-size:16px;color:var(--text);letter-spacing:-0.015em;line-height:1.15">\${esc(name)}</div>
          <div style="margin-top:3px;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);font-weight:600">\${esc(meta)}</div>
          <div style="margin-top:6px;font-size:12.5px;color:var(--text2);line-height:1.4">\${esc(it.note||'')}</div>
        </div>
      </div>\`;
    }).join('');
    let modal=document.getElementById('curated-modal');
    if(!modal){modal=document.createElement('div');modal.id='curated-modal';document.body.appendChild(modal);}
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:2000;display:flex;align-items:flex-end';
    modal.onclick=function(e){if(e.target===modal)modal.style.display='none';};
    modal.innerHTML=\`<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:20px 16px 40px;position:relative">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 30% at 50% 0%,rgba(232,201,122,.08),transparent 60%);pointer-events:none;border-radius:20px 20px 0 0"></div>
      <div style="position:relative;z-index:1">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:42px;height:42px;border-radius:10px;background:rgba(200,169,110,0.12);border:0.5px solid rgba(200,169,110,0.35);display:flex;align-items:center;justify-content:center;font-size:22px">\${esc(list.emoji||'📋')}</div>
            <div>
              <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">Dim Hour Curated · \${esc(cityKey)}</div>
              <div style="font-family:var(--serif);font-style:italic;font-weight:700;font-size:22px;color:var(--gold2);letter-spacing:-0.02em;line-height:1.05;margin-top:2px">\${esc(list.title)}</div>
            </div>
          </div>
          <button onclick="document.getElementById('curated-modal').style.display='none'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer">✕</button>
        </div>
        <div style="margin:6px 0 14px;font-size:12.5px;color:var(--text2);line-height:1.45">\${esc(list.subtitle||'')}</div>
        \${rows}
      </div>
    </div>\`;
  },
`;

const actRe=/(  _activityDetailHTML\(item,headerTitle,opts\)\{)/g;
const actBefore=(h.match(actRe)||[]).length;
if (actBefore !== 2){ console.error('Expected 2 _activityDetailHTML defs, got', actBefore); process.exit(1); }
h = h.replace(actRe, openCuratedBlock + '$1');
console.log('installed openCuratedList before both _activityDetailHTML copies');

// ─── 3. Modify renderLists to insert Curated section ───
// Anchor: the line `<div class="dh-lists-span" style="margin-top:22px;margin-bottom:10px">` followed by
//         `<div style="...">My Lists · 3 system</div>`
// We'll inject a new block BEFORE that anchor.
const renderAnchor = /(\s*<div class="dh-lists-span" style="margin-top:22px;margin-bottom:10px">\s*<div style="font-family:var\(--sans\);font-size:9px;letter-spacing:0\.26em;text-transform:uppercase;color:var\(--gold\);font-weight:600">My Lists · 3 system<\/div>)/g;

const anchorCount=(h.match(renderAnchor)||[]).length;
if (anchorCount !== 2){ console.error('Expected 2 renderLists "My Lists · 3 system" anchors, got', anchorCount); process.exit(1); }

const curatedSectionTemplate = `

      \${(() => {
        const curatedByCity = this._getCuratedLists()||{};
        const cityKey = (typeof S!=='undefined' && S.city) ? S.city : '';
        const cityLists = curatedByCity[cityKey] || [];
        if (!cityLists.length) return '';
        const header = \`
          <div class="dh-lists-span" style="margin-top:22px;margin-bottom:10px">
            <div style="font-family:var(--sans);font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:var(--gold);font-weight:600">Dim Hour Curated · \${cityKey} · \${cityLists.length}</div>
            <div style="font-family:var(--serif);font-style:italic;font-weight:700;font-size:22px;color:var(--text);letter-spacing:-0.015em;margin-top:4px">Hand-picked by our editors</div>
          </div>\`;
        const cards = cityLists.map(list => {
          const items = (list.items||[]).map(it => byId[it.id]).filter(Boolean).sort(sortByScore);
          const action = \`<button onclick="event.stopPropagation();A.openCuratedList(\${JSON.stringify(cityKey)},'\${list.id}')" style="font-size:10px;color:var(--gold);background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);padding:4px 10px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0">Open →</button>\`;
          return \`<div onclick="A.openCuratedList(\${JSON.stringify(cityKey)},'\${list.id}')" style="cursor:pointer">\${listCard({ emoji:list.emoji||'📋', tone:'gold', title:list.title, subtitle:list.subtitle||'', items, empty:'', action })}</div>\`;
        }).join('');
        return header + cards;
      })()}
`;

h = h.replace(renderAnchor, curatedSectionTemplate + '$1');
console.log('injected Curated section into both renderLists copies');

fs.writeFileSync(path, h);
console.log('\nWrote index.html.');
