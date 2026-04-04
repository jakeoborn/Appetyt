const fs = require('fs');

// Fix Dallas neighborhood errors — cross-referenced addresses with actual Dallas neighborhoods
const fixes = {
  // User-reported: RH Rooftop and Ziziki's should be Knox-Henderson
  123: { neighborhood: "Knox-Henderson" },    // RH Rooftop - 3133 Knox St
  112: { neighborhood: "Knox-Henderson" },    // Ziziki's - 4514 Travis St
  153: { neighborhood: "Knox-Henderson" },    // Le Bilboquet - 4514 Travis St

  // Address is clearly in wrong neighborhood
  29:  { neighborhood: "Uptown" },            // Salty Donut - 2049 N Pearl St (not Bishop Arts)
  71:  { neighborhood: "Lower Greenville" },  // Ngon Vietnamese - 1907 Greenville Ave (not Oak Cliff)
  77:  { neighborhood: "Oak Cliff" },         // Beatrice - 1111 N Beckley Ave (not Knox Henderson)
  116: { neighborhood: "Bishop Arts" },       // Hugo's Seafood - 334 W Davis St (not Oak Lawn)
  137: { neighborhood: "Knox-Henderson" },    // The Charlotte - 2822 N Henderson Ave (not Design District)
  43:  { neighborhood: "Northwest Dallas" },  // Pappas Bros - 10477 Lombardy Ln (not Downtown)
  140: { neighborhood: "North Dallas" },      // Tacos El Metro - 3720 Walnut Hill Ln (not Oak Cliff)
  16:  { neighborhood: "Knox-Henderson" },    // Village Baking - 3219 Knox St (not Park Cities)
  143: { neighborhood: "Irving" },            // Kafi BBQ - 8140 N MacArthur Blvd, Irving (not Lower Greenville)
  132: { neighborhood: "Frisco" },            // Bharat Bhavan - 13355 Main St, Frisco (not Addison)
  134: { neighborhood: "Allen" },             // Vaqueros BBQ - 965 Garden Park Dr, Allen (not Oak Cliff)
  136: { neighborhood: "Frisco" },            // Heritage Table - 7110 Main St, Frisco (not Lower Greenville)
  138: { neighborhood: "Irving" },            // Sanjh - 5250 N O'Connor Blvd, Irving (not Richardson)
  157: { neighborhood: "Far North Dallas" },  // Cris and John - 6090 Campbell Rd (not Oak Cliff)
  234: { neighborhood: "Uptown" },            // Hopdoddy - 3227 McKinney Ave (not Plano)
  119: { neighborhood: "Highland Park" },     // Nonna - 4115 Lomo Alto Dr (not East Dallas)
  347: { neighborhood: "Knox-Henderson" },    // Pie Tap - 2708 N Henderson Ave (not Oak Cliff)
  366: { neighborhood: "Lower Greenville" },  // Fortune House - 2010 Greenville Ave (not Richardson)
  368: { neighborhood: "East Dallas / Lakewood" }, // Miya Chinese - 9540 Garland Rd (correct, fixing from Plano)
  370: { neighborhood: "Oak Lawn" },          // Oishii - 2525 Wycliff Ave (not Plano)
  367: { neighborhood: "West Village" },      // Maison Chinoise - 4152 Cole Ave (not Design District)
  324: { neighborhood: "NorthPark" },         // Pizza Leila - 8687 N Central Expy (not Bishop Arts)
  214: { neighborhood: "Deep Ellum" },        // Honor Bar - 2910 Main St (not Highland Park Village)
  149: { neighborhood: "Downtown Dallas" },   // Mirador - 1608 Elm St (not Northeast Dallas)
  90:  { neighborhood: "Bishop Arts" },       // Oddfellows - 316 W Seventh St (not Downtown)
  212: { neighborhood: "Trinity Groves" },    // Kate Weiser - 3011 Gulden Ln (not Arts District)
  349: { neighborhood: "Lower Greenville" },  // Greenville Ave Pizza - 1923 Greenville Ave
  378: { neighborhood: "East Dallas / Lakewood" }, // JuJu's Coffee - 6038 La Vista Dr (not Bishop Arts)
  381: { neighborhood: "East Dallas / Lakewood" }, // Cultivar Coffee - 1155 Peavy Rd (not Bishop Arts)
  382: { neighborhood: "Deep Ellum" },        // La Casita Coffee - 3309 Elm St (not Greenville)
  384: { neighborhood: "Farmers Branch" },    // Locals Craft Beer - 13050 Bee St (not Lower Greenville)
  388: { neighborhood: "Uptown" },            // Leela's Wine Bar - 2355 Olive St (not Lower Greenville)
  385: { neighborhood: "Preston Center" },    // Trova Wine - 4004 Villanova St (not Knox Henderson)
  386: { neighborhood: "East Dallas / Lakewood" }, // Bodega Wine Bar - 6434 E Mockingbird Ln (not Knox Henderson)
  411: { neighborhood: "Uptown" },            // Taqueria La Ventana - 1611 McKinney Ave (not Knox Henderson)
  423: { neighborhood: "Uptown" },            // East Hampton - 200 Crescent Ct (not Oak Lawn)
  435: { neighborhood: "SMU / University Park" }, // Olivella's - 3406 McFarlin Blvd (not East Dallas)
  436: { neighborhood: "McKinney" },          // Parlor Doughnuts - 5100 Stacy Rd, McKinney (not Knox Henderson)
  409: { neighborhood: "Oak Cliff" },         // Ella - 2306 W Clarendon Dr (not Far North Dallas)
  410: { neighborhood: "Frisco" },            // III Forks - 1303 Legacy Dr, Frisco (not Addison)
  416: { neighborhood: "Flower Mound" },      // Creamy Seoul - 1221 Flower Mound Rd (not Far North Dallas)
  393: { neighborhood: "Deep Ellum" },        // Ichigoh Ramen - 2724 Commerce St (not Carrollton)
  394: { neighborhood: "Richardson" },        // Moriya Shokudo - 1920 N Coit Rd (already Richardson, correct)
  396: { neighborhood: "Lower Greenville" },  // Gen Korean BBQ - 5500 Greenville Ave (not Carrollton)
  345: { neighborhood: "Deep Ellum" },        // Gus's Fried Chicken - 2904 Commerce St (not East Dallas)
  342: { neighborhood: "Deep Ellum" },        // Van Leeuwen - 2649 Main St (not Knox Henderson)
  341: { neighborhood: "Victory Park" },      // Jeni's Ice Creams - 2422 Victory Park Ln (not Knox Henderson)
  340: { neighborhood: "Lower Greenville" },  // Milk Cream - 1929 Greenville Ave (not Knox Henderson)
  111: { neighborhood: "Deep Ellum" },        // Emporium Pies - 2708 Main St (not Bishop Arts)
  210: { neighborhood: "West Dallas" },       // Ten Ramen - 1888 Sylvan Ave (not Knox Henderson)
  7:   { neighborhood: "Oak Lawn" },          // Sachet - 4270 Oak Lawn Ave (not Highland Park Village)
  32:  { neighborhood: "Uptown" },            // Nobu Dallas - 400 Crescent Ct (not Victory Park)
  268: { neighborhood: "Uptown" },            // Perry's Steakhouse - 2100 Olive St (not Plano)
  344: { neighborhood: "East Dallas / Lakewood" }, // Mochio Mochi - 5420 Ross Ave (not Carrollton)
  80:  { neighborhood: "West Village" },      // Hudson House - 3699 McKinney Ave (not Preston Hollow)
};

const html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const DALLAS_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}

const arr = JSON.parse(html.substring(arrStart, arrEnd));
let fixCount = 0;
for(const r of arr) {
  if(fixes[r.id]) {
    const old = r.neighborhood;
    r.neighborhood = fixes[r.id].neighborhood;
    console.log(`Fixed #${r.id} ${r.name}: "${old}" → "${r.neighborhood}"`);
    fixCount++;
  }
}
console.log(`\nTotal fixed: ${fixCount}`);

const newHtml = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', newHtml, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done.');
