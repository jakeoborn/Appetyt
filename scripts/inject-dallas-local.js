// Inject Dallas local data from live site export into local index.html
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/jakeo/Downloads/dallas-local-data.json', 'utf8'));
let html = fs.readFileSync('index.html', 'utf8');

console.log('Dallas data: hotels=' + data.hotels.length + ', malls=' + data.malls.length + ', parks=' + data.parks.length + ', museums=' + data.museums.length);

function insertCityData(html, dataName, cityKey, cityData) {
  const dataIdx = html.indexOf(dataName);

  // Check if this city already exists
  const searchRange = html.substring(dataIdx, dataIdx + 500000);
  const existingCity = searchRange.indexOf("'" + cityKey + "':");
  if (existingCity > -1) {
    console.log(dataName + ' ' + cityKey + ': already exists, replacing...');
    // Find and replace the existing array
    const arrStart = searchRange.indexOf('[', existingCity);
    let d=0, arrEnd=arrStart;
    for(let j=arrStart;j<searchRange.length;j++){
      if(searchRange[j]==='[')d++;
      if(searchRange[j]===']'){d--;if(d===0){arrEnd=j+1;break;}}
    }
    const globalStart = dataIdx + arrStart;
    const globalEnd = dataIdx + arrEnd;
    html = html.substring(0, globalStart) + JSON.stringify(cityData) + html.substring(globalEnd);
    console.log(dataName + ' ' + cityKey + ': replaced with ' + cityData.length + ' entries');
    return html;
  }

  // City doesn't exist, add it
  const afterData = html.substring(dataIdx + dataName.length + 10);
  const nextConstMatch = afterData.match(/\nconst [A-Z]/);
  let dataObjEnd;
  if (nextConstMatch) {
    dataObjEnd = dataIdx + dataName.length + 10 + nextConstMatch.index;
    dataObjEnd = html.lastIndexOf('};', dataObjEnd) + 1;
  } else {
    dataObjEnd = html.indexOf('};', dataIdx + 1000) + 1;
  }
  const insertPoint = dataObjEnd - 1;
  const insertStr = ",\n  '" + cityKey + "': " + JSON.stringify(cityData);
  html = html.substring(0, insertPoint) + insertStr + "\n" + html.substring(insertPoint);
  console.log(dataName + ' ' + cityKey + ': added ' + cityData.length + ' entries');
  return html;
}

html = insertCityData(html, 'HOTEL_DATA', 'dallas', data.hotels);
html = insertCityData(html, 'MALL_DATA', 'dallas', data.malls);
html = insertCityData(html, 'PARK_DATA', 'dallas', data.parks);
html = insertCityData(html, 'MUSEUM_DATA', 'dallas', data.museums);

fs.writeFileSync('index.html', html, 'utf8');
console.log('\nDallas local data synced from live site!');

// Verify
html = fs.readFileSync('index.html', 'utf8');
['HOTEL_DATA','MALL_DATA','PARK_DATA','MUSEUM_DATA'].forEach(name => {
  const idx = html.indexOf(name);
  const sr = html.substring(idx, idx + 500000);
  const ci = sr.indexOf("'dallas'");
  if (ci > -1) {
    try {
      const as = sr.indexOf('[', ci);
      let d=0,ae=as;
      for(let j=as;j<sr.length;j++){if(sr[j]==='[')d++;if(sr[j]===']'){d--;if(d===0){ae=j+1;break;}}}
      const arr = JSON.parse(sr.substring(as, ae));
      console.log(name + ' dallas: ' + arr.length + ' ✅');
    } catch(e) { console.log(name + ' dallas: PARSE ERROR ❌'); }
  } else { console.log(name + ' dallas: NOT FOUND ❌'); }
});
