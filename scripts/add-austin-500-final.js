const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const AUSTIN_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let count = 0;

function add(s){
  const lower = s.name.toLowerCase();
  if(existing.has(lower)) { console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation='walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

add({name:"T-Loc's Sonoran Hot Dogs",cuisine:"Sonoran / Street Food",neighborhood:"North Loop",score:82,price:1,tags:["Casual","Local Favorites","Late Night"],indicators:["hole-in-wall"],description:"Bacon-wrapped Sonoran hot dogs named best in Texas by Food & Wine from a beloved trailer.",address:"5000 Burnet Rd, Austin, TX 78756",lat:30.3192,lng:-97.7356,instagram:"@tlocssonorahotdogs",website:"https://www.tlocs.com"});
add({name:"Ceviche7",cuisine:"Peruvian / Food Truck",neighborhood:"Downtown",score:83,price:2,tags:["Seafood","Casual","Local Favorites"],indicators:["hidden-gem"],description:"Upscale Peruvian food trailer with made-to-order ceviche — Yelp Top 100 Food Trucks 2025.",address:"502 W 30th St, Austin, TX 78705",lat:30.2950,lng:-97.7430,instagram:"@ceviche7",website:""});
add({name:"Jim's Smokehouse",cuisine:"Texas BBQ / Food Truck",neighborhood:"West Austin",score:85,price:1,tags:["BBQ","Casual","Local Favorites"],indicators:["hidden-gem"],description:"#2 best food truck in the US per Yelp 2025 with moist brisket and the Maui Waui taco.",address:"6900 Ranch Rd 620, Austin, TX 78732",lat:30.3900,lng:-97.8760,instagram:"@jimssmokehouseatx",website:"https://www.jimssmokehousebbq.com"});
add({name:"Bodhi Viet Vegan",cuisine:"Vietnamese / Vegan",neighborhood:"North Austin",score:78,price:1,tags:["Vegetarian Friendly","Casual","Local Favorites"],indicators:["hidden-gem"],description:"Nonprofit food truck run by Buddhist nuns with scratch-made Vietnamese vegan dishes.",address:"2301 W Parmer Ln, Austin, TX 78727",lat:30.4263,lng:-97.7560,instagram:"@bodhivietvegan",website:"https://www.bodhivietvegans.com"});
add({name:"Plaza Colombian Coffee Bar",cuisine:"Colombian Coffee / Cocktails",neighborhood:"South Austin",score:80,price:1,tags:["Bakery/Coffee","Cocktails","Live Music","Local Favorites"],description:"Colorful coffee bar and tiki cocktail lounge with Colombian beans and live salsa on weekends.",address:"3842 S Congress Ave, Austin, TX 78704",lat:30.2228,lng:-97.7506,instagram:"@plazacolombian",website:"https://www.plazacolombiancoffee.com"});
add({name:"Desnudo Coffee",cuisine:"Specialty Coffee",neighborhood:"East Austin",score:81,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Mission-driven Colombian specialty coffee trailer with exceptional espresso and pour-overs.",address:"2505 Webberville Rd, Austin, TX 78702",lat:30.2631,lng:-97.7138,instagram:"@desnudocoffee",website:"https://desnudocoffee.com"});
add({name:"CaPhe.in Coffee",cuisine:"Vietnamese Coffee",neighborhood:"Downtown",score:78,price:1,tags:["Bakery/Coffee","Casual"],indicators:["new-opening"],description:"Austin first Vietnamese phin-drip coffee bar near UT with authentic ca phe sua da.",address:"3016 Guadalupe St, Austin, TX 78705",lat:30.2905,lng:-97.7423,instagram:"@caphe.inaustin",website:""});
add({name:"Vacancy Brewing",cuisine:"Brewery",neighborhood:"South Austin",score:80,price:1,tags:["Casual","Patio","Dog Friendly","Local Favorites"],description:"Award-winning South Austin brewery known for Jet Lag pilsner, wood-fired pizza, and pet-friendly patio.",address:"415 E St Elmo Rd, Austin, TX 78745",lat:30.2177,lng:-97.7574,instagram:"@vacancybrewing",website:"https://www.vacancybrewing.com"});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);

// Also add 1 more Houston spot
const hm='const HOUSTON_DATA=';const hp=h.indexOf(hm);const hs=h.indexOf('[',hp);
d=0;let he=hs;for(let j=hs;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){he=j+1;break;}}}
let harr=JSON.parse(h.substring(hs,he));
const hex=new Set(harr.map(r=>r.name.toLowerCase()));
if(!hex.has("night heron")){
  const hmaxId=Math.max(...harr.map(r=>r.id));
  harr.push({id:hmaxId+1,name:"Night Heron",cuisine:"American / Cocktail Bar",neighborhood:"Montrose",score:85,price:2,
    tags:["Cocktails","Date Night","Patio","Local Favorites"],indicators:[],
    description:"Montrose neighborhood bar and restaurant with a lush garden patio and creative American small plates.",
    address:"1601 W Main St, Houston, TX 77006",lat:29.7469,lng:-95.3964,
    instagram:"@nightheronhtx",website:"",bestOf:[],busyness:null,waitTime:null,popularTimes:null,
    lastUpdated:null,trending:false,group:"",suburb:false,menuUrl:"",res_tier:2,
    awards:"",phone:"",reserveUrl:"",hh:"",verified:true,hours:"",dishes:[],reservation:"walk-in",photoUrl:""});
  console.log('Houston ADDED: Night Heron');
}
h=h.substring(0,hs)+JSON.stringify(harr)+h.substring(he);

fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAustin added:', count, '| Austin total:', arr.length);
console.log('Houston total:', harr.length);
