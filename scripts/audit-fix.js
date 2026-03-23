#!/usr/bin/env node
/**
 * Comprehensive audit fix for DALLAS_DATA:
 * 1. Fix neighborhood field mismatches (based on actual addresses)
 * 2. Fix description mismatches (where desc mentions wrong neighborhood)
 * 3. Consolidate duplicate/variant neighborhood names
 * 4. Normalize tag casing (merge duplicates)
 * 5. Normalize indicator naming
 * 6. Replace vague "Suburbs" neighborhoods with actual city names
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// Extract DALLAS_DATA
const startIdx = content.indexOf('const DALLAS_DATA = [');
const arrStart = content.indexOf('[', startIdx);
let depth = 0, end = arrStart;
for (let i = arrStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  else if (content[i] === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}

const dataStr = content.substring(arrStart, end);
const data = (new Function('return ' + dataStr))();

console.log(`Loaded ${data.length} restaurants`);

let nhFixes = 0;
let descFixes = 0;
let tagFixes = 0;
let indicatorFixes = 0;

// ============================================================
// 1. FIX NEIGHBORHOOD FIELDS (address confirms desc is right)
// ============================================================
const neighborhoodFieldFixes = {
  9:   'Design District',      // Culinary Dropout: 1445 Turtle Creek Blvd, 75207
  83:  'Oak Lawn',             // Norman's Japanese: 2905 Maple Ave (on Oak Lawn)
  208: 'Deep Ellum',           // S&D Oyster Co: 2600 Main St, 75226
  298: 'Uptown',               // Mexican Sugar: 2355 Olive St (desc says Uptown)
  304: 'Design District',      // Carbone: 3121 Carlisle St
  297: 'Design District',      // Carbone Vino: 3131 Carlisle St
  400: 'Addison',              // La Parisienne: Belt Line Rd, Addison TX
  408: 'Preston Hollow',       // Centralé Italia: Preston Hollow Village
  409: 'Preston Hollow',       // Ella: Preston Hollow Village
  410: 'Addison',              // III Forks: Belt Line Rd, Addison TX
  418: 'Plano',                // Yearby's BBQ: Alma Dr, Plano TX
  453: 'Bishop Arts',          // Tiny Victories: 604 N Tyler (Bishop Arts area)
};

data.forEach(r => {
  if (neighborhoodFieldFixes[r.id]) {
    const oldNH = r.neighborhood;
    r.neighborhood = neighborhoodFieldFixes[r.id];
    console.log(`NH FIX: ${r.name} (${r.id}): "${oldNH}" → "${r.neighborhood}"`);
    nhFixes++;
  }
});

// ============================================================
// 2. FIX DESCRIPTIONS (where desc mentions wrong neighborhood)
// ============================================================
const descriptionFixes = [
  { id: 17, old: 'in the Design District', new: 'in the Harwood District' },
  { id: 27, old: 'Design District space', new: 'Uptown space' },
  { id: 33, old: 'in the heart of Uptown', new: 'near Mockingbird Station' },
  { id: 76, old: 'French bistro in Downtown Dallas', new: 'French bistro in Uptown' },
  { id: 81, old: 'upscale steakhouse in Downtown Dallas', new: 'upscale steakhouse on Lower Greenville' },
  { id: 82, old: 'restaurant and bar in Deep Ellum', new: 'restaurant and bar in Downtown Dallas' },
  { id: 100, old: 'coffee shop in Deep Ellum', new: 'coffee shop in Bishop Arts' },
  { id: 104, old: 'The vibrant Deep Ellum', new: 'The vibrant Farmers Branch' },
  { id: 119, old: 'restaurant in Deep Ellum', new: 'restaurant in the M Streets' },
  { id: 138, old: 'cuisine to Deep Ellum', new: 'cuisine to Richardson' },
  { id: 139, old: 'restaurant in Uptown', new: 'restaurant in Deep Ellum' },
  { id: 141, old: 'restaurant in Uptown', new: 'restaurant in Downtown Dallas' },
  { id: 154, old: 'in the heart of Uptown', new: 'near SMU' },
  { id: 214, old: 'gastropub in Downtown Dallas', new: 'gastropub in Deep Ellum' },
  { id: 215, old: 'dining to downtown Dallas', new: 'dining to Deep Ellum' },
  { id: 225, old: 'bar in Uptown Dallas', new: 'bar in the Design District' },
  { id: 238, old: '40-year Lower Greenville institution', new: '40-year Dallas institution (formerly Lower Greenville, now Maple Ave)' },
  { id: 273, old: 'Iconic Deep Ellum dive bar', new: 'Iconic Cedars dive bar' },
  { id: 314, old: 'North Dallas', new: 'DFW' },  // vague mention in desc
  { id: 336, old: 'Oak Cliff neighborhood spot', new: 'Deep Ellum neighborhood spot' },
  { id: 336, old: 'Bishop Arts energy', new: 'Deep Ellum energy' },
  { id: 419, old: 'Laid-back Uptown neighborhood bar', new: 'Laid-back Deep Ellum neighborhood bar' },
  { id: 423, old: 'A Knox-Henderson staple', new: 'An Oak Lawn staple' },
];

descriptionFixes.forEach(fix => {
  const r = data.find(x => x.id === fix.id);
  if (r && r.description && r.description.includes(fix.old)) {
    r.description = r.description.replace(fix.old, fix.new);
    console.log(`DESC FIX: ${r.name} (${fix.id}): "${fix.old}" → "${fix.new}"`);
    descFixes++;
  } else if (r) {
    console.log(`DESC FIX SKIPPED (not found): ${r.name} (${fix.id}): "${fix.old}"`);
  }
});

// ============================================================
// 3. CONSOLIDATE NEIGHBORHOOD NAMES
// ============================================================
const neighborhoodConsolidation = {
  'Henderson Ave': 'Knox Henderson',
  'Henderson': 'Knox Henderson',
  'Oak Cliff / Bishop Arts': 'Bishop Arts',
  'Bishop Arts / Oak Cliff': 'Bishop Arts',
  'Oak Cliff / Design District': 'Oak Cliff',
  'Lakewood / East Dallas': 'Lakewood',
  'East Dallas / Lakewood': 'Lakewood',
  'East Dallas / Lake Highlands': 'Lake Highlands',
  'East Dallas / M Streets': 'M Streets',
  'Deep Ellum / East Dallas': 'Deep Ellum',
  'Deep Ellum / Multiple Locations': 'Deep Ellum',
  'Oak Lawn / Uptown': 'Oak Lawn',
  'Knox Henderson / Uptown': 'Knox Henderson',
  'Knox Henderson / Uptown / Multiple': 'Knox Henderson',
  'Design District / Uptown': 'Design District',
  'Arlington / Uptown': 'Uptown',
  'Lower Greenville (Half Price Books)': 'Lower Greenville',
  'Lower Greenville / M Streets': 'Lower Greenville',
  'Highland Park / University Park': 'Park Cities',
  'Preston Hollow / North Dallas': 'Preston Hollow',
  'North Dallas / Preston': 'North Dallas',
  'Richardson / Far North Dallas': 'Richardson',
  'Plano / Far North Dallas': 'Plano',
  'Far North Dallas / Addison': 'Addison',
  'Plano / Allen': 'Plano',
  'Carrollton / Farmers Branch': 'Carrollton',
  'Grapevine / Arlington': 'Grapevine',
  'Dallas / Multiple Locations': 'Multiple Dallas Locations',
  'Multiple Locations': 'Multiple Dallas Locations',
  'Plano / Multiple DFW Locations': 'Plano',
  'Plano / Multiple Locations': 'Plano',
  'Uptown / Multiple Locations': 'Uptown',
  'Design District / Multiple Locations': 'Design District',
  'Legacy West (Plano)': 'Plano',
};

data.forEach(r => {
  if (neighborhoodConsolidation[r.neighborhood]) {
    const oldNH = r.neighborhood;
    r.neighborhood = neighborhoodConsolidation[r.neighborhood];
    console.log(`NH CONSOLIDATE: ${r.name} (${r.id}): "${oldNH}" → "${r.neighborhood}"`);
    nhFixes++;
  }
});

// Also fix remaining "Suburbs" entries not already fixed
data.forEach(r => {
  if (r.neighborhood === 'Suburbs' && r.address) {
    const addr = r.address.toLowerCase();
    if (addr.includes('addison')) r.neighborhood = 'Addison';
    else if (addr.includes('plano')) r.neighborhood = 'Plano';
    else if (addr.includes('frisco')) r.neighborhood = 'Frisco';
    else if (addr.includes('mckinney')) r.neighborhood = 'McKinney';
    else if (addr.includes('allen')) r.neighborhood = 'Allen';
    else if (addr.includes('richardson')) r.neighborhood = 'Richardson';
    if (r.neighborhood !== 'Suburbs') {
      console.log(`SUBURB FIX: ${r.name} (${r.id}): "Suburbs" → "${r.neighborhood}"`);
      nhFixes++;
    }
  }
});

// ============================================================
// 4. NORMALIZE TAGS (merge case duplicates)
// ============================================================
const tagNormalization = {
  'cocktails': 'Cocktails',
  'brunch': 'Brunch',
  'patio': 'Patio',
  'exclusive': 'Exclusive',
  'bbq': 'BBQ',
  'sports': 'Sports',
  'Viral / Influencer': 'Viral',
  'Hotel Dining': 'Hotel',
  'Kid Friendly': 'Family Friendly',
  'Permanently Closed': null,  // remove - handled by indicator
  'Coming Soon': null,         // remove - handled by indicator
};

data.forEach(r => {
  if (r.tags && Array.isArray(r.tags)) {
    const newTags = [];
    r.tags.forEach(tag => {
      if (tagNormalization.hasOwnProperty(tag)) {
        const normalized = tagNormalization[tag];
        if (normalized === null) {
          console.log(`TAG REMOVE: ${r.name} (${r.id}): removed "${tag}"`);
          tagFixes++;
          return;
        }
        if (!newTags.includes(normalized)) {
          console.log(`TAG FIX: ${r.name} (${r.id}): "${tag}" → "${normalized}"`);
          newTags.push(normalized);
          tagFixes++;
        }
      } else {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      }
    });
    r.tags = newTags;
  }
});

// ============================================================
// 5. NORMALIZE INDICATORS
// ============================================================
const indicatorNormalization = {
  'Hole in the Wall': 'hole-in-wall',
  'vegetarian-friendly': 'vegetarian',
  'permanently-closed': 'closed',
};

data.forEach(r => {
  if (r.indicators && Array.isArray(r.indicators)) {
    const newIndicators = [];
    r.indicators.forEach(ind => {
      if (indicatorNormalization.hasOwnProperty(ind)) {
        const normalized = indicatorNormalization[ind];
        if (!newIndicators.includes(normalized)) {
          console.log(`IND FIX: ${r.name} (${r.id}): "${ind}" → "${normalized}"`);
          newIndicators.push(normalized);
          indicatorFixes++;
        }
      } else {
        if (!newIndicators.includes(ind)) {
          newIndicators.push(ind);
        }
      }
    });
    r.indicators = newIndicators;
  }
});

// ============================================================
// WRITE BACK
// ============================================================
const newDataStr = JSON.stringify(data);
const newContent = content.substring(0, arrStart) + newDataStr + content.substring(end);
fs.writeFileSync(htmlPath, newContent, 'utf8');

console.log('\n=== SUMMARY ===');
console.log(`Neighborhood fixes: ${nhFixes}`);
console.log(`Description fixes: ${descFixes}`);
console.log(`Tag fixes: ${tagFixes}`);
console.log(`Indicator fixes: ${indicatorFixes}`);
console.log(`Total changes: ${nhFixes + descFixes + tagFixes + indicatorFixes}`);

// Post-fix audit
const neighborhoods2 = {};
data.forEach(r => { neighborhoods2[r.neighborhood] = (neighborhoods2[r.neighborhood] || 0) + 1; });
console.log(`\nNeighborhoods reduced from 91 to ${Object.keys(neighborhoods2).length}`);
console.log('\nUpdated neighborhood distribution:');
Object.entries(neighborhoods2).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${v} | ${k}`));
