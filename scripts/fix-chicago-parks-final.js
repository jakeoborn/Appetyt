// Fix Chicago PARK_DATA — has duplicate entries, one with malls data, one with museums data
// Need to remove both and replace with actual parks
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

const parkIdx = html.indexOf('PARK_DATA');

// Find BOTH chicago entries and remove them
function removeChicagoEntry(html, startFrom) {
  const parkIdx = html.indexOf('PARK_DATA');
  const parkBlock = html.substring(parkIdx);
  const chiIdx = parkBlock.indexOf("'chicago':", startFrom);
  if (chiIdx === -1) return {html, found: false};

  const arrStart = parkBlock.indexOf('[', chiIdx);
  let d = 0, arrEnd = arrStart;
  for (let j = arrStart; j < parkBlock.length; j++) {
    if (parkBlock[j] === '[') d++;
    if (parkBlock[j] === ']') { d--; if (d === 0) { arrEnd = j + 1; break; } }
  }

  // Find the comma before this entry
  let entryStart = chiIdx;
  // Walk backward to find the comma or newline before
  for (let k = chiIdx - 1; k >= 0; k--) {
    if (parkBlock[k] === ',') { entryStart = k; break; }
    if (parkBlock[k] === '{') { entryStart = chiIdx; break; }
  }

  const globalEntryStart = parkIdx + entryStart;
  const globalArrEnd = parkIdx + arrEnd;

  html = html.substring(0, globalEntryStart) + html.substring(globalArrEnd);
  return {html, found: true};
}

// Remove all chicago entries (there are 2)
let result = removeChicagoEntry(html, 0);
html = result.html;
console.log('Removed first chicago entry:', result.found);

result = removeChicagoEntry(html, 0);
html = result.html;
console.log('Removed second chicago entry:', result.found);

// Verify no more chicago entries
const checkPark = html.substring(html.indexOf('PARK_DATA'), html.indexOf('PARK_DATA') + 200000);
const remaining = checkPark.indexOf("'chicago':");
console.log('Remaining chicago entries:', remaining === -1 ? 'none ✅' : 'FOUND at ' + remaining);

// Now add correct chicago parks
const chicagoParks = [
  {"id":1,"name":"Millennium Park","type":"Public Art / Urban Park","emoji":"🎭","neighborhood":"The Loop","address":"201 E Randolph St, Chicago, IL 60602","lat":41.8826,"lng":-87.6226,"score":97,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"24.5 acres of world-class public art including Cloud Gate (The Bean), Jay Pritzker Pavilion, Crown Fountain, and Lurie Garden.","highlights":[{"icon":"🫘","label":"Cloud Gate","note":"Most photographed spot in Chicago"},{"icon":"🎵","label":"Pritzker Pavilion","note":"Free concerts all summer"},{"icon":"⛲","label":"Crown Fountain","note":"50-ft glass towers"},{"icon":"🌺","label":"Lurie Garden","note":"Stunning perennial garden"}],"tips":["The Bean at sunrise is empty and magical","Summer concerts are free"],"bestFor":["Free","Photography","Concerts","Tourists"]},
  {"id":2,"name":"Lincoln Park","type":"Urban Park / Zoo","emoji":"🌳","neighborhood":"Lincoln Park","address":"N Stockton Dr, Chicago, IL 60614","lat":41.9280,"lng":-87.6340,"score":95,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"1,200 acres along the lakefront with the free Lincoln Park Zoo, North Avenue Beach, conservatory, and miles of trails.","highlights":[{"icon":"🦁","label":"Lincoln Park Zoo","note":"Free zoo"},{"icon":"🏖","label":"North Avenue Beach","note":"Best beach with skyline views"},{"icon":"🌿","label":"Conservatory","note":"Free tropical plants"},{"icon":"🏃","label":"Lakefront Trail","note":"Running along Lake Michigan"}],"tips":["The zoo is always free","North Avenue Beach volleyball is a scene"],"bestFor":["Free Zoo","Beach","Running","Families"]},
  {"id":3,"name":"Grant Park","type":"Urban Park / Festivals","emoji":"🎸","neighborhood":"The Loop","address":"337 E Randolph St, Chicago, IL 60601","lat":41.8746,"lng":-87.6198,"score":92,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"Buckingham Fountain, Art Institute, and host of Lollapalooza. 319 acres of lakefront green.","highlights":[{"icon":"⛲","label":"Buckingham Fountain","note":"Light shows May-October"},{"icon":"🎸","label":"Lollapalooza","note":"August music festival"},{"icon":"🏛","label":"Art Institute","note":"World-class museum"},{"icon":"🌅","label":"Lakefront","note":"Lake Michigan paths"}],"tips":["Buckingham light shows at dusk are free","Walk to Museum Campus"],"bestFor":["Lollapalooza","Fountain","Lakefront","Tourists"]},
  {"id":4,"name":"Chicago Riverwalk","type":"Waterfront Trail","emoji":"🌊","neighborhood":"Downtown","address":"Chicago Riverwalk, Chicago, IL 60601","lat":41.8878,"lng":-87.6270,"score":93,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"1.25 miles of waterfront with wine bars, kayaks, restaurants, and architecture tours.","highlights":[{"icon":"🍷","label":"Wine Bars","note":"City Winery"},{"icon":"🚣","label":"Kayaks","note":"Paddle through downtown"},{"icon":"🏗","label":"Architecture","note":"Legendary buildings"},{"icon":"🍽","label":"Dining","note":"Waterfront restaurants"}],"tips":["Architecture boat tour is the best tour in Chicago","Kayak through skyscraper canyon"],"bestFor":["Free Walk","Architecture","Kayaking","Dining"]},
  {"id":5,"name":"Maggie Daley Park","type":"Family Park","emoji":"🎢","neighborhood":"The Loop","address":"337 E Randolph St, Chicago, IL 60601","lat":41.8826,"lng":-87.6186,"score":91,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"Massive playground, climbing walls, ice skating ribbon, and mini golf. Connected to Millennium Park.","highlights":[{"icon":"🧗","label":"Climbing Walls","note":"Free outdoor climbing"},{"icon":"⛸","label":"Skating Ribbon","note":"Quarter-mile ribbon in winter"},{"icon":"🎢","label":"Play Garden","note":"Massive playground"},{"icon":"⛳","label":"Mini Golf","note":"18 holes in summer"}],"tips":["Skating ribbon is more fun than a rink","Climbing walls are free"],"bestFor":["Families","Ice Skating","Climbing","Playground"]},
  {"id":6,"name":"606 Trail","type":"Elevated Trail","emoji":"🚴","neighborhood":"Bucktown / Logan Square","address":"1805 N Ridgeway Ave, Chicago, IL 60647","lat":41.9145,"lng":-87.7200,"score":89,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"2.7-mile elevated trail on a converted rail line. Chicago answer to the High Line.","highlights":[{"icon":"🚴","label":"2.7-Mile Trail","note":"Elevated biking and running"},{"icon":"🌅","label":"Sunset","note":"Faces west for sunsets"},{"icon":"🏘","label":"Neighborhoods","note":"Bucktown to Humboldt Park"}],"tips":["Best at sunset","Connects cool neighborhoods"],"bestFor":["Running","Biking","Sunset","Neighborhoods"]},
  {"id":7,"name":"North Avenue Beach","type":"Beach","emoji":"🏖","neighborhood":"Lincoln Park","address":"1600 N Lake Shore Dr, Chicago, IL 60614","lat":41.9120,"lng":-87.6265,"score":90,"hours":"Daily 6AM-11PM","admission":"Free","website":"","about":"Chicago most popular beach with skyline views, volleyball, and Castaways bar.","highlights":[{"icon":"🏐","label":"Volleyball","note":"Sand courts"},{"icon":"🌃","label":"Skyline","note":"Iconic skyline from sand"},{"icon":"🏊","label":"Swimming","note":"Lake Michigan summer"},{"icon":"🍺","label":"Castaways","note":"Beach bar"}],"tips":["Best skyline view from the beach","Castaways is the summer hangout"],"bestFor":["Beach","Skyline","Volleyball","Summer"]},
  {"id":8,"name":"Museum Campus","type":"Lakefront / Museums","emoji":"🏛","neighborhood":"South Loop","address":"1400 S DuSable Lake Shore Dr, Chicago, IL 60605","lat":41.8672,"lng":-87.6140,"score":94,"hours":"Always open","admission":"Free (museums separate)","website":"","about":"Lakefront connecting Field Museum, Shedd Aquarium, and Adler Planetarium.","highlights":[{"icon":"🦕","label":"Field Museum","note":"SUE the T. Rex"},{"icon":"🐠","label":"Shedd Aquarium","note":"World largest"},{"icon":"🌌","label":"Adler Planetarium","note":"America first"},{"icon":"📸","label":"Skyline","note":"Best photo from Adler tip"}],"tips":["Walk to Adler tip for the best skyline photo","CityPASS for discounts"],"bestFor":["Museums","Skyline Photos","Lakefront","Full Day"]}
];

// Add back as a proper entry
const parkDataIdx = html.indexOf('PARK_DATA');
const afterData = html.substring(parkDataIdx + 20);
const nextConst = afterData.match(/\nconst [A-Z]/);
let dataObjEnd;
if (nextConst) {
  dataObjEnd = parkDataIdx + 20 + nextConst.index;
  dataObjEnd = html.lastIndexOf('};', dataObjEnd) + 1;
} else {
  dataObjEnd = html.indexOf('};', parkDataIdx + 1000) + 1;
}
const insertPoint = dataObjEnd - 1;
html = html.substring(0, insertPoint) + ",\n  'chicago': " + JSON.stringify(chicagoParks) + "\n" + html.substring(insertPoint);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Chicago parks properly added: 8 entries');

// Final verify
html = fs.readFileSync('index.html', 'utf8');
const verifyIdx = html.indexOf('PARK_DATA');
const verifySr = html.substring(verifyIdx, verifyIdx + 200000);
const verifyCi = verifySr.indexOf("'chicago':");
const verifyAs = verifySr.indexOf('[', verifyCi);
let vd=0, verifyAe=verifyAs;
for(let j=verifyAs;j<verifySr.length;j++){if(verifySr[j]==='[')vd++;if(verifySr[j]===']'){vd--;if(vd===0){verifyAe=j+1;break;}}}
const verifyArr = JSON.parse(verifySr.substring(verifyAs, verifyAe));
console.log('Verified: ' + verifyArr.length + ' parks, first is: ' + verifyArr[0].name);
