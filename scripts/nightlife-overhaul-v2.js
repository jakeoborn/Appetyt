#!/usr/bin/env node
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// ============================================================
// STEP 1: Add _getNightlifeCities() before nightlifeHTML()
// ============================================================
const nhMarker = '  nightlifeHTML(){';
const nhIdx = html.indexOf(nhMarker);
if (nhIdx === -1) { console.error('nightlifeHTML not found'); process.exit(1); }

// Extract the cities array from inside nightlifeHTML
const cStart = html.indexOf('    const cities = [', nhIdx);
const cBracket = html.indexOf('[', cStart);
let d = 0, cEnd = cBracket;
for (let j = cBracket; j < html.length; j++) {
  if (html[j] === '[') d++;
  if (html[j] === ']') { d--; if (d === 0) { cEnd = j + 1; break; } }
}
const citiesArray = html.substring(cBracket, cEnd);

// Insert _getNightlifeCities before nightlifeHTML
const sharedFn = `  _getNightlifeCities(){\n    return ${citiesArray};\n  },\n\n`;
html = html.substring(0, nhIdx) + sharedFn + html.substring(nhIdx);
console.log('1. Inserted _getNightlifeCities()');

// ============================================================
// STEP 2: Replace cities array in nightlifeHTML with call
// ============================================================
const nhIdx2 = html.indexOf(nhMarker);
const cStart2 = html.indexOf('    const cities = [', nhIdx2);
// Find the semicolon after the closing bracket
const cSemicolon = html.indexOf('];', cStart2) + 2;
html = html.substring(0, cStart2) + '    const cities = this._getNightlifeCities();' + html.substring(cSemicolon);
console.log('2. Updated nightlifeHTML to use _getNightlifeCities()');

// ============================================================
// STEP 3: Replace openNightlifeHood + openNightlifeGuide
// ============================================================
const oldStart = html.indexOf('  openNightlifeHood(hood){');
// Find the end: "  },\n\n    openComingSoonDetail"
const comingSoon = '    openComingSoonDetail(idx,city){';
const oldEnd = html.indexOf(comingSoon);
if (oldStart === -1 || oldEnd === -1) {
  console.error('Could not find function boundaries:', oldStart, oldEnd);
  process.exit(1);
}

const newCode = `  openNightlifeGuide(){
    var m=document.getElementById('event-detail-modal');
    if(!m)return;
    var cities=this._getNightlifeCities();
    var uniqueCities=cities.filter(function(c,i,a){return c.vibe&&a.findIndex(function(x){return x.city===c.city})===i});
    var supported=['Las Vegas','New York','Dallas','Houston','Chicago','Austin','Salt Lake City','Seattle'];
    var selectedName=window._discoverNightlifeCity;
    if(!selectedName||!uniqueCities.find(function(c){return c.city===selectedName})){
      if(S.city&&uniqueCities.find(function(c){return c.city===S.city}))selectedName=S.city;
      else selectedName='New York';
    }
    var city=uniqueCities.find(function(c){return c.city===selectedName})||uniqueCities[0];
    var isSupported=supported.indexOf(city.city)>-1;
    var esc=function(s){return String(s).replace(/'/g,"\\\\'")};
    var chipOrder=uniqueCities.slice().sort(function(a,b){
      if(a.city===S.city)return -1;if(b.city===S.city)return 1;
      var ai=supported.indexOf(a.city)>-1,bi=supported.indexOf(b.city)>-1;
      if(ai&&!bi)return -1;if(!ai&&bi)return 1;
      return a.city.localeCompare(b.city);
    });
    var chipsHTML='<div style="display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:2px 0 6px;-webkit-overflow-scrolling:touch">';
    chipOrder.forEach(function(c){
      var active=c.city===city.city;
      var starred=supported.indexOf(c.city)>-1;
      chipsHTML+='<button onclick="A.setDiscoverNightlifeCity(\\''+esc(c.city)+'\\')" style="flex-shrink:0;display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;border:1.5px solid '+(active?'var(--gold)':'var(--border)')+';background:'+(active?'rgba(201,168,76,.15)':'var(--card2)')+';color:'+(active?'var(--gold)':'var(--text2)')+';font-size:12px;font-weight:'+(active?'800':'600')+';font-family:inherit;cursor:pointer;white-space:nowrap;transition:all .15s;touch-action:manipulation">'+c.flag+' '+c.city+(starred?' <span style=\\"font-size:9px;opacity:.7;color:var(--gold)\\">\\u2605</span>':'')+'</button>';
    });
    chipsHTML+='</div>';
    var nightlifeMatches=[];
    if(isSupported){
      var allR=(typeof CITY_DATA!=='undefined'&&CITY_DATA[city.city])?CITY_DATA[city.city]:[];
      var nlTags=['Cocktails','Cocktail Bar','Nightclub','Speakeasy','Late Night','Rooftop','Live Music','Dive Bar','Wine Bar','Whiskey Bar','Bar'];
      nightlifeMatches=allR.filter(function(r){
        var t=(r.tags||[]);
        if(t.some(function(x){return nlTags.indexOf(x)>-1}))return true;
        var cu=(r.cuisine||'').toLowerCase();
        return cu.indexOf('bar')>-1||cu.indexOf('cocktail')>-1||cu.indexOf('lounge')>-1||cu.indexOf('nightclub')>-1;
      }).sort(function(a,b){return(b.score||0)-(a.score||0)});
    }
    var teaser=(city.vibe.split('.')[0]||'').trim();
    var fullVibe=city.vibe;
    var firstChar=fullVibe.charAt(0);
    var restVibe=fullVibe.slice(1);
    var hero='<div style="position:relative;margin-bottom:24px;padding:20px 4px 4px;text-align:center">'
      +'<div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:72px;opacity:.10;line-height:1;filter:blur(1px);pointer-events:none">'+city.flag+'</div>'
      +'<div style="position:relative">'
      +'<div style="font-size:38px;line-height:1;margin-bottom:10px">'+city.flag+'</div>'
      +'<div style="font-family:var(--serif);font-style:italic;font-size:38px;font-weight:700;color:var(--text);letter-spacing:-.8px;line-height:1;margin-bottom:8px">'+city.city+'</div>'
      +'<div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.35em;margin-bottom:16px">'+city.country+'</div>'
      +'<div style="font-family:var(--serif);font-style:italic;font-size:15px;color:var(--gold);line-height:1.5;max-width:380px;margin:0 auto">&ldquo;'+teaser+'&rdquo;</div>'
      +'</div></div>';
    var scene='<div style="margin-bottom:28px">'
      +'<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;margin-bottom:14px;text-align:center;font-weight:700">\\u2014 The Scene \\u2014</div>'
      +'<div style="font-size:14px;color:var(--text2);line-height:1.75">'
      +'<span style="font-family:var(--serif);font-weight:700;font-size:44px;color:var(--gold);float:left;line-height:.85;margin:4px 10px -2px 0">'+firstChar+'</span>'+restVibe
      +'</div></div>';
    var move='<div style="margin:28px 0;padding:18px 20px;border-left:3px solid var(--gold);background:linear-gradient(90deg,rgba(201,168,76,.08) 0%,transparent 100%);border-radius:0 8px 8px 0">'
      +'<div style="font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;margin-bottom:8px;font-weight:700">The Move</div>'
      +'<div style="font-family:var(--serif);font-style:italic;font-size:16px;color:var(--text);line-height:1.55">'+city.mustDo+'</div></div>';
    var rooms='';
    if(city.bestBars&&city.bestBars.length){
      rooms='<div style="margin-bottom:28px">'
        +'<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;margin-bottom:14px;text-align:center;font-weight:700">\\u2014 Rooms Worth Finding \\u2014</div>'
        +'<div style="display:flex;flex-direction:column;gap:8px">';
      city.bestBars.forEach(function(bar,i){
        rooms+='<a href="https://www.google.com/search?q='+encodeURIComponent(bar+' '+city.city+' bar')+'" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:12px;text-decoration:none;transition:border-color .15s,transform .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\';this.style.transform=\\'\\'"><div style="font-family:var(--serif);font-style:italic;font-size:22px;font-weight:700;color:var(--gold);flex-shrink:0;width:24px;text-align:center;line-height:1">'+(i+1)+'</div><div style="flex:1;font-family:var(--serif);font-size:16px;color:var(--text);letter-spacing:-.2px;min-width:0">'+bar+'</div><div style="color:var(--text3);font-size:14px;flex-shrink:0">\\u2197</div></a>';
      });
      rooms+='</div></div>';
    }
    var distHTML='';
    if(city.districts&&city.districts.length){
      distHTML='<div style="margin-bottom:28px">'
        +'<div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;margin-bottom:14px;text-align:center;font-weight:700">\\u2014 Where the Night Lives \\u2014</div>'
        +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">';
      city.districts.forEach(function(d2){
        distHTML+='<a href="https://www.google.com/search?q='+encodeURIComponent(d2+' '+city.city+' nightlife bars')+'" target="_blank" rel="noopener" style="display:block;padding:13px 14px;background:var(--card);border:1px solid var(--border);border-radius:12px;text-decoration:none;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'"><div style="font-size:13px;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:4px">\\ud83d\\udccd '+d2+'</div><div style="font-size:10px;color:var(--text3)">Explore \\u2197</div></a>';
      });
      distHTML+='</div></div>';
    }
    var rules='<div style="margin-bottom:24px;padding:14px 16px;background:var(--card2);border:1px solid var(--border);border-radius:12px">'
      +'<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.32em;margin-bottom:10px;font-weight:700">Rules of Engagement</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:16px;font-size:12px">'
      +'<div><span style="color:var(--text3)">\\u23f0&nbsp;Closes</span> <b style="color:var(--text)">'+city.closingTime+'</b></div>'
      +'<div><span style="color:var(--text3)">\\ud83d\\udcb5&nbsp;Cover</span> <b style="color:var(--text)">'+city.cover+'</b></div>'
      +'<div><span style="color:var(--text3)">\\ud83d\\udcc5&nbsp;Peak</span> <b style="color:var(--text)">'+city.peak+'</b></div>'
      +'</div></div>';
    var insider=city.tip?'<div style="margin-bottom:28px;padding:14px 16px;border-left:3px solid var(--gold);background:rgba(201,168,76,.06);border-radius:0 8px 8px 0">'
      +'<div style="font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;font-weight:800;margin-bottom:6px">\\ud83d\\udca1 Insider</div>'
      +'<div style="font-size:12px;color:var(--text2);line-height:1.6">'+city.tip+'</div></div>':'';
    var dimHour='';
    if(isSupported&&nightlifeMatches.length>0){
      var topVenues=nightlifeMatches.slice(0,8);
      dimHour='<div style="margin-bottom:28px;padding-top:20px;border-top:1px solid var(--border)">'
        +'<div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:16px;gap:12px">'
        +'<div style="min-width:0"><div style="font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.32em;margin-bottom:6px;font-weight:800">\\u2605 In Dim Hour</div>'
        +'<div style="font-family:var(--serif);font-style:italic;font-size:22px;color:var(--text);letter-spacing:-.3px;line-height:1.1">Verified spots in '+city.city+'</div></div>'
        +'<div style="text-align:right;flex-shrink:0"><div style="font-size:28px;font-weight:800;color:var(--gold);line-height:1">'+nightlifeMatches.length+'</div>'
        +'<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.1em">spots</div></div></div>'
        +'<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:'+(nightlifeMatches.length>8?'12px':'0')+'">';
      topVenues.forEach(function(r){
        dimHour+='<div onclick="A.openDetail('+r.id+');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:flex;align-items:center;gap:10px;padding:11px 13px;background:var(--card);border:1px solid var(--border);border-radius:10px;cursor:pointer;touch-action:manipulation;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'">'
          +'<div style="flex:1;min-width:0"><div style="font-family:var(--serif);font-size:15px;color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.1px">'+r.name+'</div>'
          +'<div style="font-size:10px;color:var(--text3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(r.neighborhood||'')+(r.neighborhood&&r.cuisine?' \\u00b7 ':'')+(r.cuisine||'')+'</div></div>'
          +'<div style="font-size:14px;font-weight:800;color:var(--gold);flex-shrink:0">'+(r.score||'')+'</div>'
          +'<div style="color:var(--gold);font-size:15px;flex-shrink:0">\\u203a</div></div>';
      });
      dimHour+='</div>';
      if(nightlifeMatches.length>8){
        dimHour+='<button onclick="A.selectCity(\\''+esc(city.city)+'\\');A.tab(\\'restaurants\\');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="display:block;width:100%;background:var(--gold);color:var(--dark);font-weight:800;font-size:12px;padding:12px;border-radius:10px;border:none;cursor:pointer;font-family:inherit">See all '+nightlifeMatches.length+' spots in Dim Hour \\u2192</button>';
      }
      dimHour+='</div>';
    }else if(isSupported){
      dimHour='<div style="margin-bottom:24px;padding:16px;background:rgba(201,168,76,.05);border:1px dashed var(--gold);border-radius:12px;text-align:center">'
        +'<div style="font-size:10px;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.2em">\\u2605 Dim Hour Supports '+city.city+'</div>'
        +'<button onclick="A.selectCity(\\''+esc(city.city)+'\\');A.tab(\\'restaurants\\');document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="margin-top:10px;background:transparent;border:1px solid var(--gold);color:var(--gold);font-weight:700;font-size:11px;padding:7px 14px;border-radius:18px;cursor:pointer;font-family:inherit">Browse '+city.city+' restaurants \\u2192</button></div>';
    }
    var footerLink='<a href="'+(city.book||'https://ra.co')+'" target="_blank" rel="noopener" style="display:block;text-align:center;padding:14px 12px 8px;font-size:11px;color:var(--text3);text-decoration:none;border-top:1px solid var(--border)">\\ud83d\\udd17 Check events on Resident Advisor</a>';
    var modalHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:flex-end" onclick="if(event.target===this)this.style.display=\\'none\\'">';
    modalHTML+='<div style="background:var(--dark);border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto;position:relative">';
    modalHTML+='<div style="position:sticky;top:0;z-index:10;background:linear-gradient(180deg,rgba(10,13,20,.98),rgba(10,13,20,.94));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:14px 16px 10px">';
    modalHTML+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
    modalHTML+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);font-size:12px;font-weight:700;padding:7px 12px;border-radius:18px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;touch-action:manipulation">\\u2190 Back</button>';
    modalHTML+='<div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:800;color:var(--gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\\ud83e\\udea9 Nightlife Guide</div><div style="font-size:10px;color:var(--text3);margin-top:1px">Editorial city profiles \\u00b7 Where the locals go</div></div>';
    modalHTML+='<button onclick="document.getElementById(\\'event-detail-modal\\').style.display=\\'none\\'" style="background:var(--card2);border:1px solid var(--border);color:var(--text2);width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer;flex-shrink:0;touch-action:manipulation">\\u2715</button>';
    modalHTML+='</div>';
    modalHTML+=chipsHTML;
    modalHTML+='</div>';
    modalHTML+='<div style="padding:18px 16px 40px">';
    modalHTML+=hero+scene+move+rooms+distHTML+rules+insider+dimHour+footerLink;
    modalHTML+='</div></div></div>';
    m.innerHTML=modalHTML;
    m.style.display='block';
  },

  setDiscoverNightlifeCity(name){
    window._discoverNightlifeCity=name;
    this.openNightlifeGuide();
  },

`;

html = html.substring(0, oldStart) + newCode + html.substring(oldEnd);
console.log('3. Replaced openNightlifeHood + openNightlifeGuide with editorial version');
console.log('   setDiscoverNightlifeCity included:', html.indexOf('setDiscoverNightlifeCity') > -1);

// ============================================================
// STEP 4: Re-apply Mamani + Mister Charles fixes
// ============================================================
// Mamani
var mamaniIdx = html.indexOf('"id":20,"name":"Mamani"');
if (mamaniIdx !== -1) {
  var s = mamaniIdx; while (s > 0 && html[s] !== '{') s--;
  var dd = 0, e = s;
  for (var j = s; j < html.length; j++) { if (html[j] === '{') dd++; if (html[j] === '}') { dd--; if (dd === 0) { e = j + 1; break; } } }
  var obj = JSON.parse(html.substring(s, e));
  obj.dishes = ['Dover Sole Brown Butter','Veal Cordon Bleu','Paris-Brest','Dry-Aged Ribeye Gratin','Whole Duck'];
  obj.bestOf = ['#1 Best French','#1 Best Overall'];
  obj.hours = 'Mon-Thu 5pm-9:30pm, Fri-Sat 5pm-10pm';
  obj.tags = ['Exclusive','French','Viral','Critics Pick','Fine Dining','Date Night','Awards'];
  html = html.substring(0, s) + JSON.stringify(obj) + html.substring(e);
  console.log('4a. Fixed Mamani');
}
// Mamani secondary ref
html = html.replace("name:'Mamani',score:94,cuisine:'French / Riviera'", "name:'Mamani',score:98,cuisine:'French / Riviera'");
// Mister Charles
var mcIdx = html.indexOf('"name":"Mister Charles"');
if (mcIdx !== -1) {
  var s2 = mcIdx; while (s2 > 0 && html[s2] !== '{') s2--;
  var dd2 = 0, e2 = s2;
  for (var j2 = s2; j2 < html.length; j2++) { if (html[j2] === '{') dd2++; if (html[j2] === '}') { dd2--; if (dd2 === 0) { e2 = j2 + 1; break; } } }
  var obj2 = JSON.parse(html.substring(s2, e2));
  obj2.cuisine = 'French-Italian';
  obj2.tags = obj2.tags.filter(function(t){return t!=='Southern'&&t!=='American'});
  if (obj2.tags.indexOf('French') === -1) obj2.tags.push('French');
  if (obj2.tags.indexOf('Italian') === -1) obj2.tags.push('Italian');
  html = html.substring(0, s2) + JSON.stringify(obj2) + html.substring(e2);
  console.log('4b. Fixed Mister Charles');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('DONE');
