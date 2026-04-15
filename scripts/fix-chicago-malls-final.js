const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Remove ALL chicago entries from MALL_DATA first
const mallIdx = html.indexOf('MALL_DATA');
let mallBlock = html.substring(mallIdx, mallIdx + 500000);

// Find and remove chicago entries
while (true) {
  const ci = mallBlock.indexOf("'chicago':");
  if (ci === -1) break;
  const as = mallBlock.indexOf('[', ci);
  let d=0, ae=as;
  for(let j=as;j<mallBlock.length;j++){if(mallBlock[j]==='[')d++;if(mallBlock[j]===']'){d--;if(d===0){ae=j+1;break;}}}
  // Remove including preceding comma
  let start = ci;
  for(let k=ci-1;k>=0;k--){if(mallBlock[k]===','){start=k;break;}if(mallBlock[k]==='{'){start=ci;break;}}
  mallBlock = mallBlock.substring(0, start) + mallBlock.substring(ae);
}

// Write back the cleaned mall block
html = html.substring(0, mallIdx) + mallBlock + html.substring(mallIdx + 500000);

// Now add the correct malls
const chicagoMalls = [
  {"id":1,"name":"Magnificent Mile","tagline":"Chicago Legendary Shopping Boulevard.","tier":"Luxury","neighborhood":"Streeterville","address":"N Michigan Ave, Chicago, IL 60611","lat":41.8950,"lng":-87.6246,"instagram":"","hours":"10AM-8PM","parking":"Garages","score":95,"emoji":"💎","vibe":"13 blocks of luxury retail.","about":"460+ stores. Nordstrom, Apple, Nike, Burberry flagships.","anchors":["Apple","Nike","Nordstrom"],"mustVisit":[{"name":"900 North Michigan","note":"Luxury boutiques"},{"name":"Water Tower Place","note":"8-story mall"}],"dining":[{"name":"Eataly","type":"Italian","note":"Food hall"}],"tips":["Holiday Lights Festival in November is spectacular"],"bestFor":["Luxury Shopping","Flagships","Tourists"],"awards":""},
  {"id":2,"name":"Water Tower Place","tagline":"8-Story Mall on Mag Mile.","tier":"Mid-Range","neighborhood":"Streeterville","address":"835 N Michigan Ave, Chicago, IL 60611","lat":41.8978,"lng":-87.6240,"instagram":"","hours":"Mon-Sat 10AM-8PM, Sun 11AM-6PM","parking":"Attached garage","score":88,"emoji":"🏬","vibe":"100+ stores over 8 floors.","about":"Enclosed vertical mall connected to the Ritz-Carlton. Macy's anchor.","anchors":["Macy's","LEGO Store"],"mustVisit":[{"name":"LEGO Store","note":"Interactive"},{"name":"Macy's","note":"Multi-floor"}],"dining":[{"name":"Food Court","type":"Various","note":"Level 7"}],"tips":["LEGO Store is great for kids","Rainy day essential"],"bestFor":["Rainy Day","Family","Mag Mile"],"awards":""},
  {"id":3,"name":"Wicker Park / Bucktown Shopping","tagline":"Indie Boutique Capital.","tier":"Specialty","neighborhood":"Wicker Park","address":"Milwaukee & North & Damen, Chicago, IL 60622","lat":41.9096,"lng":-87.6771,"instagram":"","hours":"11AM-7PM","parking":"Metered street","score":91,"emoji":"🎸","vibe":"Indie boutiques, vintage, records.","about":"Reckless Records, vintage shops, local designers at Milwaukee/North/Damen.","anchors":["Reckless Records","Kokorokoko"],"mustVisit":[{"name":"Reckless Records","note":"Legendary"},{"name":"Kokorokoko","note":"Curated vintage"}],"dining":[{"name":"Big Star","type":"Mexican","note":"Tacos and whiskey"}],"tips":["Division Street has the best boutiques","Saturday afternoon is best"],"bestFor":["Vintage","Indie","Records"],"awards":""},
  {"id":4,"name":"State Street Shopping","tagline":"That Great Street.","tier":"Mid-Range","neighborhood":"The Loop","address":"State St, Chicago, IL 60602","lat":41.8819,"lng":-87.6278,"instagram":"","hours":"10AM-8PM","parking":"Loop garages","score":87,"emoji":"🛍","vibe":"Chicago original retail corridor.","about":"Macy's (Marshall Field's) with famous clock and Tiffany ceiling. Block 37 and Revival Food Hall.","anchors":["Macy's","Block 37"],"mustVisit":[{"name":"Macy's","note":"Tiffany ceiling is stunning"},{"name":"Revival Food Hall","note":"Best Loop lunch"}],"dining":[{"name":"Revival Food Hall","type":"Food Hall","note":"Curated lunch"}],"tips":["Tiffany ceiling -- look up","Holiday windows tradition"],"bestFor":["Historic","Loop Access","Food Hall"],"awards":""},
  {"id":5,"name":"Chicago French Market","tagline":"Indoor European Market.","tier":"Market","neighborhood":"West Loop","address":"131 N Clinton St, Chicago, IL 60661","lat":41.8841,"lng":-87.6410,"instagram":"@chicagofrenchmarket","hours":"Mon-Sat 7:30AM-7:30PM","parking":"Nearby garages","score":88,"emoji":"🥖","vibe":"30+ vendors under Ogilvie station.","about":"Year-round indoor market. Cheese, charcuterie, wine, prepared foods.","anchors":["Pastoral","Fumare Meats"],"mustVisit":[{"name":"Pastoral","note":"Cheese and sandwiches"},{"name":"Vanille Patisserie","note":"French macarons"}],"dining":[{"name":"Pastoral","type":"Cheese","note":"Grilled cheese"},{"name":"Saigon Sisters","type":"Vietnamese","note":"Banh mi"}],"tips":["Best West Loop lunch","Go before noon"],"bestFor":["Lunch","Artisan Food","Commuter"],"awards":""}
];

// Find MALL_DATA end to insert
html = fs.readFileSync('index.html','utf8'); // Re-read to avoid corruption
const mIdx = html.indexOf('MALL_DATA');

// Remove existing chicago entries first
let search = html.substring(mIdx, mIdx + 500000);
while (true) {
  const cIdx = search.indexOf("'chicago':");
  if (cIdx === -1) break;
  const aStart = search.indexOf('[', cIdx);
  let dd=0, aEnd=aStart;
  for(let j=aStart;j<search.length;j++){if(search[j]==='[')dd++;if(search[j]===']'){dd--;if(dd===0){aEnd=j+1;break;}}}
  let entryStart = cIdx;
  for(let k=cIdx-1;k>=0;k--){if(search[k]===','){entryStart=k;break;}if(search[k]==='{'){break;}}
  const globalStart = mIdx + entryStart;
  const globalEnd = mIdx + aEnd;
  html = html.substring(0, globalStart) + html.substring(globalEnd);
  search = html.substring(mIdx, mIdx + 500000);
}

// Now add correct malls
const afterData = html.substring(mIdx + 20);
const nextConst = afterData.match(/\nconst [A-Z]/);
let dataObjEnd;
if (nextConst) {
  dataObjEnd = mIdx + 20 + nextConst.index;
  dataObjEnd = html.lastIndexOf('};', dataObjEnd) + 1;
} else {
  dataObjEnd = html.indexOf('};', mIdx + 1000) + 1;
}
html = html.substring(0, dataObjEnd - 1) + ",\n  'chicago': " + JSON.stringify(chicagoMalls) + "\n" + html.substring(dataObjEnd - 1);

fs.writeFileSync('index.html', html, 'utf8');

// Verify
html = fs.readFileSync('index.html','utf8');
const vIdx = html.indexOf('MALL_DATA');
const vSr = html.substring(vIdx, vIdx+500000);
const vCi = vSr.indexOf("'chicago':");
const vAs = vSr.indexOf('[', vCi);
let vd=0,vAe=vAs;
for(let j=vAs;j<vSr.length;j++){if(vSr[j]==='[')vd++;if(vSr[j]===']'){vd--;if(vd===0){vAe=j+1;break;}}}
const vArr = JSON.parse(vSr.substring(vAs, vAe));
console.log('Chicago malls fixed: ' + vArr.length + ' entries');
console.log('First: ' + vArr[0].name + ' (tier: ' + vArr[0].tier + ')');
