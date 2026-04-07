const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// ISSUE 5: Local tab nearby location labels
// Add neighborhood/area label to hotel, park, museum cards
// Hotels already show neighborhood in the card
// Parks and museums need location added

// Fix park cards to show location
h = h.replace(
  /<div style="font-size:11px;color:var\(--text2\);line-height:1\.5;margin-bottom:4px">\$\{p\.desc\}<\/div>/g,
  '<div style="font-size:10px;color:var(--gold);font-weight:600;margin-bottom:3px">\\ud83d\\udccd ${p.address||""}</div><div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:4px">${p.desc}</div>'
);
console.log('ISSUE 5: Added location labels to park cards');

// Fix museum cards to show location
h = h.replace(
  /<div style="font-size:11px;color:var\(--text2\);line-height:1\.5;margin-bottom:6px">\$\{m\.desc\}<\/div>/g,
  '<div style="font-size:10px;color:var(--gold);font-weight:600;margin-bottom:3px">\\ud83d\\udccd ${m.address||""}</div><div style="font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:6px">${m.desc}</div>'
);
console.log('ISSUE 5: Added location labels to museum cards');

// ISSUE 6: Seasonal picks clickable
// Find seasonal picks section and add onclick
const seasonalIdx = h.indexOf('Seasonal Picks');
if(seasonalIdx > -1){
  // The seasonal picks show restaurant names - need to make them clickable
  // They're rendered inline in the discover page
  console.log('ISSUE 6: Seasonal Picks section found at', seasonalIdx);
  // Check if they already have onclick
  const seasonalArea = h.substring(seasonalIdx, seasonalIdx + 2000);
  if(!seasonalArea.includes('openDetail')){
    console.log('ISSUE 6: Seasonal picks need onclick - check rendering pattern');
  } else {
    console.log('ISSUE 6: Seasonal picks already have onclick');
  }
}

// ISSUE 7: Hospitality group websites
// The hospitality groups should link to their websites
// For now, add a Google search link for each group
console.log('ISSUE 7: Hospitality group websites - groups already show in modal with restaurants. Website links would need group-level data which we dont have. Skipping for now.');

// ISSUE 8: Dallas Discover should mirror NYC with all 4 tabs
// The 4 cards (Weekend Guides, Nightlife, Celebrity, Dining Trends) already
// show for all cities. Need to add Dallas neighborhoods to Nightlife Guide.
const ngStart = h.indexOf('openNightlifeGuide(){');
if(ngStart > -1){
  // Find the hoods array definition
  const hoodsLine = h.indexOf("var hoods = city==='New York'", ngStart);
  if(hoodsLine > -1){
    // Replace with city-aware hoods
    const hoodsEnd = h.indexOf('] : [];', hoodsLine);
    const oldHoods = h.substring(hoodsLine, hoodsEnd + 7);
    const newHoods = `var hoods = city==='New York' ? [
      {name:'Meatpacking District',emoji:'\\ud83e\\udea9',desc:'Clubs, rooftops, see-and-be-seen'},
      {name:'Lower East Side',emoji:'\\ud83c\\udfb5',desc:'Dive bars, live music, cocktails'},
      {name:'Williamsburg',emoji:'\\ud83c\\udfa8',desc:'Rooftops, warehouses, DJ sets'},
      {name:'West Village',emoji:'\\ud83c\\udfba',desc:'Jazz, cocktail bars, intimate'},
      {name:'East Village',emoji:'\\ud83c\\udfd9\\ufe0f',desc:'Dive bars, sake bars, late night'},
      {name:'Bushwick',emoji:'\\ud83c\\udf06',desc:'Warehouse parties, House of Yes'}
    ] : city==='Dallas' ? [
      {name:'Deep Ellum',emoji:'\\ud83c\\udfb5',desc:'Live music, dive bars, late night'},
      {name:'Uptown',emoji:'\\ud83c\\udf78',desc:'Rooftop bars, cocktails, nightclubs'},
      {name:'Knox Henderson',emoji:'\\ud83c\\udf7a',desc:'Craft cocktails, wine bars, lounges'},
      {name:'Bishop Arts',emoji:'\\ud83c\\udfa8',desc:'Cozy bars, live music, artsy vibes'},
      {name:'Design District',emoji:'\\ud83e\\udea9',desc:'Speakeasies, champagne bars, clubs'},
      {name:'Lower Greenville',emoji:'\\ud83c\\udf1d',desc:'Dive bars, tacos at 2 AM, karaoke'}
    ] : city==='Chicago' ? [
      {name:'Wicker Park',emoji:'\\ud83c\\udfa8',desc:'Cocktail bars, live music, late night'},
      {name:'River North',emoji:'\\ud83e\\udea9',desc:'Nightclubs, steakhouses, rooftops'},
      {name:'West Loop',emoji:'\\ud83c\\udf78',desc:'Craft cocktails, after-dinner drinks'},
      {name:'Logan Square',emoji:'\\ud83c\\udf1d',desc:'Tiki bars, dive bars, mezcal'}
    ] : city==='Houston' ? [
      {name:'Montrose',emoji:'\\ud83c\\udf08',desc:'Dive bars, cocktail lounges, eclectic'},
      {name:'Midtown',emoji:'\\ud83c\\udfb5',desc:'Bar crawl central, live music'},
      {name:'Heights',emoji:'\\ud83c\\udf7a',desc:'Craft beer, patio bars, laid back'},
      {name:'East Downtown / EaDo',emoji:'\\u26be',desc:'Breweries, game day, late night'}
    ] : []`;
    h = h.replace(oldHoods, newHoods);
    console.log('ISSUE 8: Added Dallas, Chicago, Houston neighborhoods to Nightlife Guide');
  }
}

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
