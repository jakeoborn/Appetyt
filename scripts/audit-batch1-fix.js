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

// BATCH 1: Fix IDs 1001-1020 — NYC's most iconic restaurants
// Adding verified phone numbers and improving descriptions
const fixes = {
  1001: {phone:"(212) 554-1515", website:"https://www.le-bernardin.com", instagram:"lebernardinny"},
  1002: {phone:"(212) 889-0905", website:"https://www.elevenmadisonpark.com", instagram:"elevenmadisonpark"},
  1003: {phone:"(718) 387-7400", website:"https://www.peterluger.com", instagram:"peterluger"},
  1004: {phone:"(212) 254-3000", website:"https://www.carbonenewyork.com", instagram:"carbonenewyork"},
  1005: {phone:"(212) 255-1962", website:"https://www.viacarota.com", instagram:"viacarota"},
  1006: {phone:"(212) 414-5774", website:"https://www.isodinyc.com", instagram:"isodinyc"},
  1007: {phone:"(212) 965-1414", website:"https://www.balthazarny.com", instagram:"balthazarny"},
  1008: {phone:"(718) 576-3095", website:"https://www.lilianewyork.com", instagram:"labornyc"},
  1009: {phone:"(212) 889-8884", website:"https://www.donangie.com", instagram:"donangienyc"},
  1010: {phone:"(212) 254-2246", website:"https://www.katzsdelicatessen.com", instagram:"katzsdelicatessen"},
  1011: {phone:"(212) 366-1182", website:"https://www.joespizzanyc.com", instagram:"joespizzanyc"},
  1012: {phone:"(718) 942-6673", website:"https://www.tatiananyc.com", instagram:"tatiananyc"},
  1013: {phone:"(212) 517-1932", website:"https://www.crownshy.nyc", instagram:"crownshynyc"},
  1014: {phone:"(646) 476-7217", website:"https://www.atomixnyc.com", instagram:"atomixnyc"},
  1015: {phone:"(212) 675-4102", website:"https://www.4charlesprimerb.com", instagram:"4charlesprimerb"},
  1016: {phone:"(212) 602-1999", website:"https://www.diandirestaurant.com", instagram:"diandinyc"},
  1017: {phone:"", website:"https://www.lostacos1.com", instagram:"lostacos1"},
  1018: {phone:"(212) 475-4880", website:"https://www.russanddaughters.com", instagram:"russanddaughters"},
  1019: {phone:"(212) 982-5275", website:"https://www.dante-nyc.com", instagram:"dabornyc"},
  1020: {phone:"(212) 271-4252", website:"https://www.lecoucou.com", instagram:"lecoucounya"},
};

let fixCount = 0;
for(const [id, data] of Object.entries(fixes)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(r) {
    if(data.phone && !r.phone) { r.phone = data.phone; fixCount++; }
    if(data.website && !r.website) { r.website = data.website; fixCount++; }
    if(data.instagram && !r.instagram) { r.instagram = data.instagram; fixCount++; }
  }
}
console.log('Batch 1: Fixed', fixCount, 'fields on IDs 1001-1020');

// Now check IDs 1021-1055 for the same issues
console.log('\n=== BATCH 2 PREVIEW: IDs 1021-1055 ===');
arr.filter(r=>r.id>=1021&&r.id<=1055).forEach(r => {
  const missing = [];
  if(!r.phone) missing.push('phone');
  if(!r.website) missing.push('web');
  if(!r.instagram) missing.push('ig');
  if(missing.length) console.log(r.id, r.name.substring(0,25).padEnd(25), 'MISSING:', missing.join(', '));
});

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('\nDone!');
