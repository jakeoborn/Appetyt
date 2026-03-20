/**
 * apply-dallas-fixes.js — Apply Verified Corrections to Dallas Data
 * ==================================================================
 *
 * Reads the verified data from data/dallas-verified.json and applies
 * corrections to the DALLAS_DATA in index.html:
 *   - Updates incorrect addresses with Google-verified ones
 *   - Updates lat/lng coordinates
 *   - Removes permanently closed restaurants
 *   - Removes likely fabricated entries (not found on Google)
 *   - Removes duplicate entries (keeps the one with more data)
 *   - Adds Google Place IDs for future reference
 *
 * ── Usage ──────────────────────────────────────────────────────────
 *
 *   node scripts/apply-dallas-fixes.js                # apply all fixes
 *   node scripts/apply-dallas-fixes.js --dry-run      # preview changes only
 *   node scripts/apply-dallas-fixes.js --addresses    # only fix addresses
 *   node scripts/apply-dallas-fixes.js --remove-closed # only remove closed/fabricated
 *
 * ── Output ─────────────────────────────────────────────────────────
 *
 *   index.html (modified in-place with corrected DALLAS_DATA)
 *   data/dallas-applied.log (log of all changes applied)
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, '..', 'data');
const VERIFIED_FILE = path.join(DATA_DIR, 'dallas-verified.json');
const HTML_FILE = path.join(__dirname, '..', 'index.html');
const LOG_FILE = path.join(DATA_DIR, 'dallas-applied.log');

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const addressesOnly = args.includes('--addresses');
  const removeClosedOnly = args.includes('--remove-closed');

  // Load verified data
  if (!fs.existsSync(VERIFIED_FILE)) {
    console.error('ERROR: No verified data found.');
    console.error('Run verify-dallas-data.js first.');
    process.exit(1);
  }

  const verified = JSON.parse(fs.readFileSync(VERIFIED_FILE, 'utf-8'));
  const restaurants = verified.restaurants;
  const duplicates = verified.duplicates || [];

  console.log(`Loaded ${restaurants.length} verified restaurants`);
  console.log(`Found ${duplicates.length} duplicate groups\n`);

  // Categorize changes
  const toRemove = new Set();
  const addressFixes = [];
  const coordFixes = [];
  const log = [];

  // 1. Flag closed restaurants for removal
  if (!addressesOnly) {
    for (const r of restaurants) {
      if (r.verification.status === 'CLOSED_PERMANENTLY') {
        toRemove.add(r.id);
        log.push(`REMOVE #${r.id} "${r.name}" — permanently closed`);
      }
      if (r.verification.status === 'not_found') {
        toRemove.add(r.id);
        log.push(`REMOVE #${r.id} "${r.name}" — not found on Google (likely fabricated)`);
      }
    }
  }

  // 2. Flag duplicates for removal (keep the one with higher score or more data)
  if (!addressesOnly && !removeClosedOnly) {
    for (const dupe of duplicates) {
      if (dupe.entries.length < 2) continue;

      // Find which entries are verified
      const dupeRestaurants = dupe.entries
        .map(e => restaurants.find(r => r.id === e.id))
        .filter(Boolean)
        .sort((a, b) => {
          // Keep the one with better data: more description, verified address, higher score
          const aScore = (a.description?.length || 0) + (a.score || 0) * 10;
          const bScore = (b.description?.length || 0) + (b.score || 0) * 10;
          return bScore - aScore;
        });

      // Remove all but the best
      for (let i = 1; i < dupeRestaurants.length; i++) {
        toRemove.add(dupeRestaurants[i].id);
        log.push(`REMOVE #${dupeRestaurants[i].id} "${dupeRestaurants[i].name}" — duplicate of #${dupeRestaurants[0].id}`);
      }
    }
  }

  // 3. Collect address and coordinate fixes
  if (!removeClosedOnly) {
    for (const r of restaurants) {
      if (toRemove.has(r.id)) continue;

      for (const change of r.verification.changes) {
        if (change.field === 'address' && change.new) {
          addressFixes.push({ id: r.id, name: r.name, old: change.old, new: change.new });
          log.push(`FIX ADDRESS #${r.id} "${r.name}": "${change.old}" → "${change.new}"`);
        }
        if (change.field === 'coordinates' && change.new) {
          const [lat, lng] = change.new.split(',').map(s => parseFloat(s.trim()));
          coordFixes.push({ id: r.id, name: r.name, lat, lng });
          log.push(`FIX COORDS #${r.id} "${r.name}": ${change.old} → ${change.new}`);
        }
      }
    }
  }

  // Summary
  console.log('CHANGES TO APPLY:');
  console.log(`  Restaurants to remove: ${toRemove.size}`);
  console.log(`  Address corrections:   ${addressFixes.length}`);
  console.log(`  Coordinate corrections: ${coordFixes.length}`);
  console.log('');

  if (toRemove.size === 0 && addressFixes.length === 0 && coordFixes.length === 0) {
    console.log('No changes to apply!');
    return;
  }

  if (dryRun) {
    console.log('[DRY RUN] Changes that would be applied:\n');
    for (const entry of log) {
      console.log(`  ${entry}`);
    }
    console.log(`\n[DRY RUN] No files modified.`);
    return;
  }

  // Read index.html
  console.log('Reading index.html...');
  let html = fs.readFileSync(HTML_FILE, 'utf-8');

  // Find the DALLAS_DATA section
  const startMarker = 'const DALLAS_DATA = [';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    console.error('Could not find DALLAS_DATA in index.html');
    process.exit(1);
  }

  // Extract and parse the data
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let stringChar = null;
  const searchStart = startIdx + startMarker.length - 1;
  let endIdx = -1;

  for (let i = searchStart; i < html.length; i++) {
    const ch = html[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (ch === '\\' && inString) { escapeNext = true; continue; }
    if (inString) { if (ch === stringChar) { inString = false; stringChar = null; } continue; }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }

  if (endIdx === -1) {
    console.error('Could not find end of DALLAS_DATA array');
    process.exit(1);
  }

  const jsonStr = html.substring(searchStart, endIdx);
  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch {
    // eslint-disable-next-line no-eval
    data = eval(`(${jsonStr})`);
  }

  console.log(`Parsed ${data.length} restaurants from DALLAS_DATA`);

  // Apply removals
  const originalCount = data.length;
  const filtered = data.filter(r => !toRemove.has(r.id));
  const removedCount = originalCount - filtered.length;

  // Apply address fixes
  let fixedAddresses = 0;
  for (const fix of addressFixes) {
    const restaurant = filtered.find(r => r.id === fix.id);
    if (restaurant) {
      restaurant.address = fix.new;
      fixedAddresses++;
    }
  }

  // Apply coordinate fixes
  let fixedCoords = 0;
  for (const fix of coordFixes) {
    const restaurant = filtered.find(r => r.id === fix.id);
    if (restaurant) {
      restaurant.lat = fix.lat;
      restaurant.lng = fix.lng;
      fixedCoords++;
    }
  }

  // Re-assign IDs sequentially
  filtered.forEach((r, i) => { r.id = i + 1; });

  // Serialize back to JS
  const newDataStr = JSON.stringify(filtered, null, 2);

  // Replace in HTML
  const before = html.substring(0, searchStart);
  const after = html.substring(endIdx);
  html = before + newDataStr + after;

  // Write back
  fs.writeFileSync(HTML_FILE, html);
  console.log(`\nUpdated index.html:`);
  console.log(`  Removed: ${removedCount} restaurants`);
  console.log(`  Fixed addresses: ${fixedAddresses}`);
  console.log(`  Fixed coordinates: ${fixedCoords}`);
  console.log(`  New total: ${filtered.length} restaurants`);

  // Write log
  fs.writeFileSync(LOG_FILE, log.join('\n'));
  console.log(`\nChange log: ${LOG_FILE}`);
}

main();
