const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const SLC_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let count = 0;

const spots = [
  {name:"Melancholy Wine Lounge",cuisine:"Wine Bar",neighborhood:"Downtown SLC",score:84,price:2,tags:["Wine Bar","Cocktails","Date Night"],lat:40.7512,lng:-111.9008,instagram:"@melancholyslc",website:"https://melancholyslc.com",address:"556 S Gale St, Salt Lake City, UT 84101"},
  {name:"Carson Kitchen SLC",cuisine:"New American",neighborhood:"Downtown SLC",score:82,price:2,tags:["Casual","Cocktails","Happy Hour"],lat:40.7624,lng:-111.898,instagram:"@carsonkitchensaltlakecity",website:"https://carsonkitchen.com/slc",address:"241 W 200 S, Salt Lake City, UT 84101"},
  {name:"Flanker Kitchen",cuisine:"American / Sports Bar",neighborhood:"Gateway",score:79,price:2,tags:["Sports","Casual","Happy Hour"],lat:40.7677,lng:-111.9025,instagram:"@flankerslc",website:"https://flankerslc.com",address:"6 N Rio Grande St, Salt Lake City, UT 84101"},
  {name:"Felt Bar",cuisine:"New American",neighborhood:"Downtown SLC",score:86,price:3,tags:["Cocktails","Fine Dining","Date Night","Critics Pick"],lat:40.7605,lng:-111.8895,instagram:"@feltslc",website:"https://feltslc.com",address:"249 S Main St, Salt Lake City, UT 84111",awards:"James Beard Semifinalist 2026"},
  {name:"Cosmica",cuisine:"Italian / Natural Wine",neighborhood:"9th & 9th",score:90,price:3,tags:["Italian","Wine Bar","Date Night","Pizza","Critics Pick"],lat:40.7462,lng:-111.9048,instagram:"@cosmica.slc",website:"https://cosmicasaltlake.com",address:"945 S 300 W Ste 102, Salt Lake City, UT 84101",awards:"NYT Best Restaurants in America"},
  {name:"Water Witch Bar",cuisine:"Cocktail Bar",neighborhood:"9th & 9th",score:88,price:2,tags:["Cocktails","Bar","Date Night","Late Night","Critics Pick"],lat:40.7464,lng:-111.8958,instagram:"@waterwitchslc",website:"https://waterwitchbar.com",address:"163 W 900 S, Salt Lake City, UT 84101",awards:"James Beard Outstanding Bar Finalist 2025"},
  {name:"Veneto Ristorante",cuisine:"Italian Fine Dining",neighborhood:"9th & 9th",score:87,price:4,tags:["Italian","Fine Dining","Date Night","Tasting Menu"],lat:40.7465,lng:-111.8821,instagram:"@venetoslc",website:"https://venetoslc.com",address:"370 E 900 S, Salt Lake City, UT 84111"},
  {name:"Hearth and Hill",cuisine:"New American",neighborhood:"Sugar House",score:85,price:3,tags:["Brunch","Date Night","Local Favorites"],lat:40.7178,lng:-111.8627,instagram:"@hearth_and_hill",website:"https://hearth-hill.com",address:"2188 S Highland Dr, Salt Lake City, UT 84106"},
  {name:"SOMI Vietnamese Bistro",cuisine:"Vietnamese",neighborhood:"Sugar House",score:83,price:2,tags:["Vietnamese","Casual","Date Night"],lat:40.7213,lng:-111.8528,instagram:"@somislc",website:"https://somislc.com",address:"1215 E Wilmington Ave, Salt Lake City, UT 84106"},
  {name:"Avenues Proper",cuisine:"Brewpub",neighborhood:"The Avenues",score:83,price:2,tags:["Casual","Brunch","Happy Hour","Patio"],lat:40.7742,lng:-111.8783,instagram:"@avenues_proper",website:"https://properbrewingco.com",address:"376 8th Ave, Salt Lake City, UT 84103"},
  {name:"Le Depot Brasserie",cuisine:"French Brasserie",neighborhood:"Park City",score:89,price:4,tags:["French","Fine Dining","Date Night","Celebrations"],lat:40.6458,lng:-111.4975,instagram:"@ledepotpc",website:"https://ledepotpc.com",address:"660 Main St, Park City, UT 84060"},
  {name:"Firewood on Main",cuisine:"American / Wood-Fire",neighborhood:"Park City",score:87,price:4,tags:["Fine Dining","Date Night","Celebrations"],lat:40.6441,lng:-111.4984,instagram:"@firewoodonmain",website:"https://firewoodonmain.com",address:"306 Main St, Park City, UT 84060"},
  {name:"Tiburon Fine Dining",cuisine:"New American",neighborhood:"Sandy",score:88,price:4,tags:["Fine Dining","Date Night","Seafood","Steakhouse"],lat:40.5918,lng:-111.8683,instagram:"@tiburonutah",website:"https://tiburonfinedining.com",address:"8256 S 700 E, Sandy, UT 84070"},
  {name:"Sauce Boss Southern Kitchen",cuisine:"Southern / Soul Food",neighborhood:"Draper",score:85,price:2,tags:["Southern","Casual","Local Favorites"],lat:40.5212,lng:-111.8552,instagram:"@saucebosssouthernkitchenut",website:"https://saucebosssouthernkitchen.com",address:"877 E 12300 S, Draper, UT 84020"},
  {name:"Oak Wood Fire Kitchen",cuisine:"Pizza / American",neighborhood:"Draper",score:83,price:2,tags:["Pizza","Brunch","Casual","Patio"],lat:40.521,lng:-111.8565,instagram:"@oakwoodfirekitchen",website:"https://oakwoodfirekitchen.com",address:"715 E 12300 S, Draper, UT 84020"},
  {name:"Black Sheep Cafe",cuisine:"Native American / Southwestern",neighborhood:"Downtown Provo",score:87,price:2,tags:["Casual","Local Favorites","Date Night"],lat:40.2341,lng:-111.6593,instagram:"@provoblacksheep",website:"https://blacksheepcafe.com",address:"19 N University Ave, Provo, UT 84601"},
  {name:"Communal",cuisine:"Farm-to-Table",neighborhood:"Downtown Provo",score:86,price:3,tags:["Fine Dining","Date Night","Brunch"],lat:40.2358,lng:-111.659,instagram:"@communalrestaurant",website:"https://communalrestaurant.com",address:"102 N University Ave, Provo, UT 84601"},
  {name:"Bombay House",cuisine:"Indian",neighborhood:"Downtown Provo",score:84,price:2,tags:["Indian","Vegetarian Friendly","Casual"],lat:40.2393,lng:-111.6586,instagram:"@bombayhouseutah",website:"https://bombayhouse.com",address:"463 N University Ave, Provo, UT 84601"},
  {name:"Mr. Shabu",cuisine:"Japanese / Hot Pot",neighborhood:"Gateway",score:82,price:3,tags:["Japanese","Casual","Date Night"],lat:40.768,lng:-111.9012,instagram:"@mrshabuslc",website:"https://mrshabu.com",address:"30 N 400 W, Salt Lake City, UT 84101"},
  {name:"Matilda Park City",cuisine:"Italian / Pizza",neighborhood:"Park City",score:85,price:3,tags:["Pizza","Italian","Cocktails"],lat:40.6498,lng:-111.5059,instagram:"@matildaparkcity",website:"https://matildaparkcity.com",address:"1600 Snow Creek Dr, Park City, UT 84060"},
];

spots.forEach(sp => {
  if(existing.has(sp.name.toLowerCase())) { console.log('SKIP:', sp.name); return; }
  sp.id = nextId++;
  sp.bestOf = []; sp.busyness = null; sp.waitTime = null;
  sp.popularTimes = null; sp.lastUpdated = null; sp.trending = false;
  sp.group = ''; sp.suburb = false; sp.menuUrl = '';
  sp.res_tier = sp.price >= 3 ? 4 : 2;
  sp.indicators = sp.indicators || [];
  sp.awards = sp.awards || '';
  sp.phone = ''; sp.reserveUrl = ''; sp.hh = '';
  sp.verified = true; sp.hours = ''; sp.dishes = [];
  sp.reservation = 'walk-in'; sp.photoUrl = '';
  arr.push(sp); existing.add(sp.name.toLowerCase());
  count++;
  console.log('ADDED:', sp.name, '(id:', sp.id, ')');
});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| SLC total:', arr.length);
