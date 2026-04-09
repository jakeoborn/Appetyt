// Fix critical audit issues:
// 1. Remove stub entries (lat/lng 0,0) — these are duplicates that got pushed with empty data
// 2. Fix Dallas card type issues (Truck Yard, Mutts)
// 3. Fix missing Chicago descriptions (Virtue, Ghin Khao)
// Run: node scripts/audit-fix-critical.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ═══════════════════════════════════════════
// 1. REMOVE HOUSTON STUB (The Pass & Provisions / Theodore Rex)
// ═══════════════════════════════════════════
{
  const s = html.indexOf('const HOUSTON_DATA');
  const a = html.indexOf('[', s);
  let d=0, e=a;
  for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  const arr = JSON.parse(html.slice(a, e));
  const before = arr.length;
  const filtered = arr.filter(r => !(r.lat === 0 && r.lng === 0));
  html = html.slice(0, a) + JSON.stringify(filtered) + html.slice(e);
  console.log(`Houston: Removed ${before - filtered.length} stub entries (${filtered.length} remaining)`);
}

// ═══════════════════════════════════════════
// 2. REMOVE CHICAGO STUBS + Fix descriptions
// ═══════════════════════════════════════════
{
  const chiKey = "'Chicago': [";
  const chiIdx = html.indexOf(chiKey, html.indexOf('const CITY_DATA'));
  const chiArr = html.indexOf('[', chiIdx + 10);
  let d=0, e=chiArr;
  for(let i=chiArr;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  const arr = JSON.parse(html.slice(chiArr, e));
  const before = arr.length;

  // Remove stubs
  const filtered = arr.filter(r => !(r.lat === 0 && r.lng === 0));
  console.log(`Chicago: Removed ${before - filtered.length} stub entries`);

  // Fix Virtue description + address
  const virtue = filtered.find(r => r.name.includes('Virtue'));
  if (virtue && virtue.description.length < 20) {
    virtue.description = "Chef Erick Williams' Southern restaurant in Hyde Park that earned a Michelin Bib Gourmand and multiple James Beard nominations. The menu honors African American culinary traditions with refined technique — braised short ribs, shrimp and grits, and a fried chicken that's among the best in Chicago. A South Side anchor.";
    virtue.dishes = ["Braised Short Ribs", "Shrimp & Grits", "Fried Chicken", "Cornbread"];
    virtue.address = "1462 E 53rd St, Chicago, IL 60615";
    virtue.phone = "(773) 947-8831";
    virtue.lat = 41.7994;
    virtue.lng = -87.5876;
    virtue.instagram = "virtuechicago";
    virtue.website = "https://www.virtuerestaurant.com";
    console.log('  Fixed Virtue description + address');
  }

  // Fix Ghin Khao
  const ghinkhao = filtered.find(r => r.name.includes('Ghin Khao'));
  if (ghinkhao && ghinkhao.description.length < 20) {
    ghinkhao.description = "Pilsen Thai restaurant that earned a Michelin Bib Gourmand for its deeply flavorful Isaan and central Thai cooking. The pad kra pao, papaya salad, and khao soi are among the best in the city. BYOB format keeps the value proposition even higher. One of Chicago's most authentic Thai experiences.";
    ghinkhao.dishes = ["Pad Kra Pao", "Papaya Salad", "Khao Soi", "Larb"];
    ghinkhao.address = "2128 W Cermak Rd, Chicago, IL 60608";
    ghinkhao.phone = "(773) 697-4466";
    ghinkhao.lat = 41.8521;
    ghinkhao.lng = -87.6804;
    ghinkhao.instagram = "ghinkhaochicago";
    ghinkhao.website = "https://www.ghinkhao.com";
    console.log('  Fixed Ghin Khao description + address');
  }

  // Fix Portillo's Hot Dogs stub
  const portillos = filtered.find(r => r.name.includes("Portillo's Hot Dogs"));
  if (portillos && (!portillos.address || portillos.address.length < 5)) {
    portillos.address = "100 W Ontario St, Chicago, IL 60654";
    portillos.phone = "(312) 587-8910";
    portillos.lat = 41.8930;
    portillos.lng = -87.6320;
    portillos.instagram = "portilloshotdogs";
    portillos.website = "https://www.portillos.com";
    console.log('  Fixed Portillos address');
  }

  // Fix QXY Dumplings stub
  const qxy = filtered.find(r => r.name === 'QXY Dumplings');
  if (qxy && (!qxy.address || qxy.address.length < 5)) {
    qxy.description = "Chinatown dumpling specialist serving handmade boiled dumplings, pot stickers, and noodles. The lamb dumplings and pork-chive are some of the best in Chicago. Cash-friendly prices and no-frills setting. Essential Chinatown eating.";
    qxy.dishes = ["Lamb Dumplings", "Pork-Chive Dumplings", "Pot Stickers", "Noodles"];
    qxy.address = "2002 S Wentworth Ave, Chicago, IL 60616";
    qxy.phone = "(312) 799-1118";
    qxy.lat = 41.8549;
    qxy.lng = -87.6319;
    qxy.instagram = "qxydumplings";
    qxy.website = "";
    console.log('  Fixed QXY Dumplings data');
  }

  html = html.slice(0, chiArr) + JSON.stringify(filtered) + html.slice(e);
  console.log(`Chicago: ${filtered.length} spots remaining`);
}

// ═══════════════════════════════════════════
// 3. FIX DALLAS CARD TYPE ISSUES
// ═══════════════════════════════════════════
{
  const s = html.indexOf('const DALLAS_DATA');
  const a = html.indexOf('[', s);
  let d=0, e=a;
  for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break;}}
  const arr = JSON.parse(html.slice(a, e));

  // Truck Yard should stay as restaurant (it's a food truck park with bars)
  const truckYard = arr.find(r => r.name === 'Truck Yard');
  if (truckYard) {
    truckYard.cuisine = "Food Truck Park / Bar";
    console.log('Dallas: Fixed Truck Yard cuisine');
  }

  // Mutts Canine Cantina should stay as restaurant (bar with dog park)
  const mutts = arr.find(r => r.name && r.name.includes('Mutts'));
  if (mutts) {
    mutts.cuisine = "American / Dog-Friendly Bar";
    console.log('Dallas: Fixed Mutts Canine Cantina cuisine');
  }

  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
}

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ All critical audit fixes applied');
