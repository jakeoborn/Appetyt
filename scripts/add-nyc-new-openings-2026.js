const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));
const maxId = Math.max(...arr.map(r=>r.id));
const existingNames = new Set(arr.map(r=>r.name.toLowerCase()));
let nextId = maxId + 1;

// NYC New Openings 2025/2026 — verified from Eater Manhattan Heatmap March 2026
const newOpenings = [
  {id:nextId++,name:"Hwaro",phone:"(646) 329-5929",cuisine:"Korean",neighborhood:"Midtown",score:92,price:4,tags:["Fine Dining","Date Night","Tasting Menu","Exclusive","New Opening","Critics Pick"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Chef Sungchul Shim's most intimate project — a 22-seat marble counter inside his Times Square steakhouse Gui. 13-course Korean tasting menu built around a custom charcoal braiser. Foie gras with duck terrine, scallops with truffle makgeolli bearnaise. At $295, this is serious Korean fine dining.",dishes:["13-Course Tasting","Foie Gras","Charcoal-Grilled Wagyu"],address:"776 8th Ave, New York, NY 10036",hours:"Tue-Sat 5:30PM-10:00PM",lat:40.7601,lng:-73.9874,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"hwaronyc",website:"https://www.hwaronyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:5},
  {id:nextId++,name:"Double Knot",phone:"",cuisine:"Japanese",neighborhood:"Midtown",score:86,price:3,tags:["Date Night","Cocktails","Sushi","New Opening"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Philly's beloved Double Knot arrives at Rockefeller Center in a sprawling 12,000-sq-ft, bi-level space. Tuna tartare, robatayaki skewers, sushi, and sashimi with fishbowl views and private nooks. Michael Schulson's biggest NYC bet.",dishes:["Tuna Tartare","Robata Skewers","Sushi"],address:"1251 6th Ave, New York, NY 10020",hours:"Mon-Sun 5:00PM-11:00PM",lat:40.7594,lng:-73.9800,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"doubleknot",website:"https://www.doubleknotnyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Kjun",phone:"(347) 675-8026",cuisine:"Korean",neighborhood:"Midtown East",score:85,price:2,tags:["Local Favorites","Date Night","Cocktails","New Opening","Critics Pick"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026, Top Chef",description:"Korean Cajun restaurant that just expanded into a larger Murray Hill two-floor space. Chef Jae Jung's festive cooking — kimchi (try the okra and green tomato), sweet-savory blue crab curry, and galbi and grits. The most joyful collision of Korean and Southern cooking in NYC.",dishes:["Blue Crab Curry","Galbi & Grits","Kimchi Varieties"],address:"334 Lexington Ave, New York, NY 10016",hours:"Tue-Sun 5:00PM-10:30PM",lat:40.7471,lng:-73.9777,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"kjunnyc",website:"https://www.kjunnyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"Ambassadors Clubhouse",phone:"",cuisine:"Indian",neighborhood:"Flatiron / NoMad",score:87,price:3,tags:["Fine Dining","Date Night","Cocktails","New Opening","Critics Pick"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"London's Sethi siblings bring their celebrated Indian restaurant group to NoMad in a stunning 8,000-sq-ft space modeled after their grandfather's summer house. Papads, kebabs, biryani, and karahi dishes under executive chef Karan Mittal. The most anticipated Indian opening in NYC in years.",dishes:["Kebabs","Biryani","Papads & Chutneys"],address:"1245 Broadway, New York, NY 10001",hours:"Mon-Sun 5:30PM-11:00PM",lat:40.7449,lng:-73.9879,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"ambassadorsclubhouse",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Seahorse",phone:"(212) 219-8119",cuisine:"Seafood",neighborhood:"Flatiron / NoMad",score:86,price:3,tags:["Date Night","Cocktails","Seafood","New Opening"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Splashy seafood brasserie from Mercer Street Hospitality inside the revamped W Union Square. Rockwell Group design with scallop tiles and midnight-blue banquettes. Crudo, Dover sole, spicy lobster cavatelli, and a tableside dessert cart. Far better than a hotel restaurant has any right to be.",dishes:["Dover Sole","Spicy Lobster Cavatelli","Crudo"],address:"201 Park Ave S, New York, NY 10003",hours:"Mon-Sun 5:30PM-10:30PM",lat:40.7367,lng:-73.9885,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"seahorsenyc",website:"https://www.seahorsenyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Rulin",phone:"",cuisine:"Chinese",neighborhood:"Flatiron / NoMad",score:83,price:2,tags:["Local Favorites","Casual","New Opening"],indicators:[],hh:"",reservation:"walk-in",awards:"Eater Heatmap 2026",description:"Union Square expansion from Brooklyn's Noodle Lane team, specializing in pan-Chinese hand-pulled noodles. Lanzhou-style beef noodle soup, dan dan noodles, grilled skewers, and smashed cucumbers. Simple, soulful, and exactly what Union Square needed.",dishes:["Hand-Pulled Noodles","Dan Dan Noodles","Grilled Skewers"],address:"15 E 13th St, New York, NY 10003",hours:"Mon-Sun 11:30AM-10:00PM",lat:40.7344,lng:-73.9922,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"rulinnyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:3},
  {id:nextId++,name:"The Eighty Six",phone:"",cuisine:"Steakhouse",neighborhood:"West Village",score:87,price:3,tags:["Date Night","Cocktails","Steakhouse","Exclusive","New Opening"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Tilman Fertitta and Catch Hospitality Group take over the storied Chumley's space at 86 Bedford. 35-seat steakhouse with Rockwell Group design — velvet banquettes, geometric marble, literary nods. Smoked dirty martinis, 30-day dry-aged ribeyes, and a theatrical cheesesteak. Every seat is a front-row seat.",dishes:["Dry-Aged Ribeye","Oysters","Smoked Dirty Martini"],address:"86 Bedford St, New York, NY 10014",hours:"Tue-Sat 5:30PM-11:00PM",lat:40.7319,lng:-74.0039,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"Tao Group Hospitality",instagram:"the86nyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Golden Steer",phone:"",cuisine:"Steakhouse",neighborhood:"Greenwich Village",score:85,price:3,tags:["Date Night","Cocktails","Steakhouse","Celebrations","New Opening"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Legendary Vegas steakhouse's NYC debut in the One Fifth building. Old-school glam meets Greenwich Village with premium steaks, raw bar, bloody mary oyster shooters, and cherries jubilee lit tableside. The kind of restaurant where you dress up and feel like you're in a Scorsese film.",dishes:["Prime Steak","Cherries Jubilee","Raw Bar"],address:"1 5th Ave, New York, NY 10003",hours:"Mon-Sun 5:00PM-11:00PM",lat:40.7317,lng:-73.9966,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"goldensteerlv",website:"https://www.goldensteersteak.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Wild Cherry",phone:"",cuisine:"New American",neighborhood:"West Village",score:89,price:3,tags:["Date Night","Cocktails","Critics Pick","Exclusive","New Opening","Celebrations"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"The buzziest downtown opening of 2025 — Frenchette's Riad Nasr and Lee Hanson teamed up with A24 (the film studio behind Moonlight) at the Cherry Lane Theatre. Every seat is a good one for celebrity-spotting. Frogs legs Kiev, an excellent cheeseburger, and a tiny horseshoe bar where Bradley Cooper might be sitting next to you.",dishes:["Frogs Legs Kiev","Cheeseburger","Steak Frites"],address:"38 Commerce St, New York, NY 10014",hours:"Mon-Sun 5:30PM-12:00AM",lat:40.7322,lng:-74.0028,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"Frenchette (Lee Hanson & Riad Nasr)",instagram:"wildcherrynyc",website:"https://www.wildcherrynyc.com",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Or'esh",phone:"",cuisine:"Mediterranean",neighborhood:"SoHo",score:86,price:3,tags:["Date Night","Cocktails","New Opening"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Eastern Mediterranean from the Corner Store team (Catch Hospitality) with wood-fired cooking by chef Nadav Greenberg. Jerusalem bagels, chicken liver cigars, spicy spinach gomiti, and a 77-layer wagyu NY strip. Bold, ambitious, and very SoHo.",dishes:["Jerusalem Bagel","Wagyu Strip","Wood-Fired Dorade"],address:"450 W Broadway, New York, NY 10012",hours:"Mon-Sun 5:30PM-11:00PM",lat:40.7255,lng:-74.0005,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"oreshnyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Odo East Village",phone:"",cuisine:"Japanese",neighborhood:"East Village",score:87,price:3,tags:["Date Night","New Opening","Critics Pick","Cocktails"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"The casual sibling to 2-Michelin-starred Odo, offering what they call 'kaiseki izakaya' — an a la carte menu of Japanese raw, grilled, simmered, steamed, and fried dishes at an elegant counter. Uni donburi, rice-cracker fried chicken, and Japanese crab. Fine dining technique at izakaya prices.",dishes:["Uni Donburi","Fried Chicken","Japanese Crab"],address:"536 E 5th St, New York, NY 10009",hours:"Tue-Sun 5:30PM-10:30PM",lat:40.7248,lng:-73.9788,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"odoeastvillage",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Bufón",phone:"",cuisine:"Wine Bar",neighborhood:"Lower East Side",score:85,price:3,tags:["Date Night","Cocktails","New Opening","Seafood"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"Swanky LES follow-up to West Village wine bar Demo. Steak, seafood, and a raw bar with bluefin tuna carpaccio, grilled mackerel, and a robust natural wine selection from Jacob Nass. The kind of place where you order another bottle and stay until midnight.",dishes:["Bluefin Carpaccio","Steak","Natural Wine"],address:"78 Rivington St, New York, NY 10002",hours:"Tue-Sun 5:30PM-12:00AM",lat:40.7198,lng:-73.9865,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"bufonnyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
  {id:nextId++,name:"Bistrot Ha",phone:"",cuisine:"French-Vietnamese",neighborhood:"Lower East Side",score:88,price:3,tags:["Date Night","Critics Pick","New Opening","Exclusive","Cocktails"],indicators:[],hh:"",reservation:"Resy",awards:"Eater Heatmap 2026",description:"The hotly anticipated sibling to Ha's Snack Bar — bigger, with a real kitchen, and already the hardest reservation on the LES. French-Vietnamese dishes like fried yuba stuffed with crab, curried lobster, jazzed-up steak frites, and sweetbreads vol au vent. If Ha's was the prelude, this is the symphony.",dishes:["Crab Yuba","Curried Lobster","Steak Frites"],address:"137 Eldridge St, New York, NY 10002",hours:"Tue-Sat 5:30PM-11:00PM",lat:40.7193,lng:-73.9903,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:true,group:"",instagram:"bistrothanyc",website:"",suburb:false,reserveUrl:"",menuUrl:"",res_tier:4},
];

let addedCount = 0;
for(const spot of newOpenings) {
  if(!existingNames.has(spot.name.toLowerCase())) {
    arr.push(spot);
    existingNames.add(spot.name.toLowerCase());
    addedCount++;
  } else {
    console.log('SKIP:', spot.name);
  }
}
console.log('Added', addedCount, 'new 2025/2026 openings');
console.log('NYC total:', arr.length);

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);

// Also update the coming soon section for NYC to show these instead of placeholder
html = html.replace(
  `// City-aware coming soon
    if((S.city||'Dallas')!=='Dallas'){`,
  `// City-aware coming soon — NYC has real data now
    if((S.city||'Dallas')!=='Dallas' && (S.city||'Dallas')!=='New York'){`
);

// Add NYC coming soon handler that shows new openings
html = html.replace(
  `// City-aware coming soon — NYC has real data now
    if((S.city||'Dallas')!=='Dallas' && (S.city||'Dallas')!=='New York'){`,
  `// City-aware coming soon
    if((S.city||'Dallas')==='New York'){
      const nycNew = this.getRestaurants().filter(r=>(r.tags||[]).includes('New Opening')).sort((a,b)=>b.score-a.score);
      return \`<div style="margin-bottom:16px">
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-bottom:4px">🔮 New in New York</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px">\${nycNew.length} hot new openings</div>
        \${nycNew.map(r=>\`<div onclick="A.openDetail(\${r.id})" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer;touch-action:manipulation" onmouseenter="this.style.borderColor='var(--gold)'" onmouseleave="this.style.borderColor='var(--border)'">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700;color:var(--text)">\${r.name}</div>
              <div style="font-size:11px;color:var(--gold);margin-top:2px">\${r.cuisine} · \${r.neighborhood}</div>
              <div style="font-size:11px;color:var(--text2);margin-top:3px;line-height:1.4">\${(r.description||'').split('.')[0]}.</div>
            </div>
            <div style="font-size:18px;font-weight:700;color:var(--gold);margin-left:10px">\${r.score}</div>
          </div>
        </div>\`).join('')}
      </div>\`;
    }
    if((S.city||'Dallas')!=='Dallas' && (S.city||'Dallas')!=='New York'){`
);

console.log('Updated NYC coming soon to show real new openings');

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
