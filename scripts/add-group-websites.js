const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// Add website and instagram to each hospitality group
const groupData = {
  'Harwood Hospitality Group': {website:'https://www.harwoodhospitality.com',instagram:'harwooddistrict'},
  'Vandelay Hospitality': {website:'https://www.vandelayhospitality.com',instagram:'vandelayhospitality'},
  'Duro Hospitality': {website:'https://www.durohospitality.com',instagram:'durohospitality'},
  'Travis Street Hospitality': {website:'https://www.travisstreethospitality.com',instagram:'travisstreethospitality'},
  'FB Society': {website:'https://www.fbsociety.com',instagram:'fbsociety'},
  'Milkshake Concepts': {website:'https://www.milkshakeconcepts.com',instagram:'milkshakeconcepts'},
  'Fox Restaurant Concepts': {website:'https://www.foxrc.com',instagram:'foxrestaurantconcepts'},
  'Major Food Group': {website:'https://www.majorfoodgroup.com',instagram:'majorfoodgroup'},
  'M Crowd Restaurant Group': {website:'https://www.mcrowdrestaurantgroup.com',instagram:'mcrowdrestaurants'},
  // NYC Groups
  'Union Square Hospitality (Danny Meyer)': {website:'https://www.ushgnyc.com',instagram:'ushgnyc'},
  'Keith McNally': {website:'',instagram:'keithmcnally'},
  'Unapologetic Foods': {website:'https://www.unapologeticfoods.com',instagram:'unapologeticfoods'},
  'Momofuku (David Chang)': {website:'https://www.momofuku.com',instagram:'momofuku'},
  'NoHo Hospitality (Andrew Carmellini)': {website:'https://www.nohohospitality.com',instagram:'nohohospitality'},
  'Quality Branded': {website:'https://www.qualitybranded.com',instagram:'qualitybranded'},
  'Tao Group Hospitality': {website:'https://www.taogroup.com',instagram:'taogrouphospitality'},
  'Stephen Starr': {website:'https://www.starr-restaurants.com',instagram:'starrrestaurants'},
  'Jean-Georges Vongerichten': {website:'https://www.jean-georges.com',instagram:'jgvongerichten'},
  'Simon Kim (COTE)': {website:'https://www.cotekoreansteakhouse.com',instagram:'cotenyc'},
  'One Off Hospitality': {website:'https://www.oneoffhospitality.com',instagram:'oneoffhospitality'},
};

// Find each group in HOSPITALITY_GROUPS and add website/instagram
let updated = 0;
Object.entries(groupData).forEach(([name, data]) => {
  // Find the group entry
  const groupKey = "'"+name+"':";
  const idx = h.indexOf(groupKey);
  if(idx === -1) return;

  // Find the closing } of this group's object
  const objStart = h.indexOf('{', idx);
  let depth = 0;
  let objEnd = objStart;
  for(let i = objStart; i < h.length; i++){
    if(h[i] === '{') depth++;
    if(h[i] === '}') { depth--; if(depth === 0) { objEnd = i; break; } }
  }

  // Check if website already exists
  const groupObj = h.substring(objStart, objEnd);
  if(groupObj.includes('website:')) return;

  // Insert website and instagram before the closing }
  const insert = (data.website ? ",\n      website:'"+data.website+"'" : '') +
                 (data.instagram ? ",\n      instagram:'"+data.instagram+"'" : '');
  h = h.substring(0, objEnd) + insert + h.substring(objEnd);
  updated++;
});

console.log('Added website/instagram to', updated, 'hospitality groups');

// Now update the hospitality groups HTML rendering to show website links
// Find the group card rendering in hospitalityGroupsHTML
// For the dynamic (non-Dallas) view, add website link to group header
const dynamicGroupHeader = h.indexOf("${rests.length} concepts in ${S.city}");
if(dynamicGroupHeader > -1){
  // Add a "Visit Website" link after the concepts count
  const afterCount = h.indexOf('</div>', dynamicGroupHeader);
  // Actually let's add it to the group header div
  console.log('Dynamic group header found - will add website link in rendering');
}

// For the Dallas HOSPITALITY_GROUPS rendering, update the card to include website
// Find where Dallas groups are rendered
const dallasGroupRender = h.indexOf("Object.entries(_HG)");
if(dallasGroupRender > -1){
  const renderArea = h.substring(dallasGroupRender, dallasGroupRender + 3000);
  // Find where group header is rendered and add website link
  const headerEnd = renderArea.indexOf("${_HG[name].description}");
  if(headerEnd > -1){
    console.log('Dallas group rendering found');
  }
}

// Simpler approach: add a website button at the bottom of each group card
// in both dynamic and static rendering
// For dynamic groups, add after the restaurant list
const dynamicGroupEnd = `</div>
          </div>`;
const dynamicGroupEndIdx = h.indexOf(dynamicGroupEnd, h.indexOf('multiGroups.map'));
if(dynamicGroupEndIdx > -1){
  // Find the exact pattern for the restaurant list closing
  // Add a website link row after restaurants
  console.log('Will add website links to group cards');
}

fs.writeFileSync('index.html', h, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done');
