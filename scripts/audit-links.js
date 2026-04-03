#!/usr/bin/env node
/**
 * Appetyt Restaurant Link Auditor
 * Run: node scripts/audit-links.js
 *
 * Checks all restaurant URLs (website, Instagram, reserveUrl) for broken links.
 * Outputs a report of failures to scripts/audit-report-links.json
 */

const fs = require('fs');
const path = require('path');

// Extract DALLAS_DATA from index.html
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/const DALLAS_DATA\s*=\s*(\[[\s\S]*?\]);\s*(?:const|let|var|\/\/)/);
if (!match) { console.error('Could not find DALLAS_DATA'); process.exit(1); }

let restaurants;
try {
  restaurants = eval(match[1]);
} catch(e) {
  console.error('Could not parse DALLAS_DATA:', e.message);
  process.exit(1);
}

console.log(`Found ${restaurants.length} restaurants. Checking links...\n`);

const results = { total: restaurants.length, checked: 0, broken: [], noWebsite: [], noPhone: [], noAddress: [], noHours: [] };

// Check for missing data
restaurants.forEach(r => {
  if (!r.website) results.noWebsite.push({ id: r.id, name: r.name });
  if (!r.phone) results.noPhone.push({ id: r.id, name: r.name });
  if (!r.address) results.noAddress.push({ id: r.id, name: r.name });
  if (!r.hours) results.noHours.push({ id: r.id, name: r.name });
});

// Collect all URLs to check
const urlChecks = [];
restaurants.forEach(r => {
  if (r.website) {
    const url = r.website.startsWith('http') ? r.website : 'https://' + r.website;
    urlChecks.push({ id: r.id, name: r.name, field: 'website', url });
  }
  if (r.instagram) {
    const handle = r.instagram.replace('@', '');
    urlChecks.push({ id: r.id, name: r.name, field: 'instagram', url: `https://instagram.com/${handle}` });
  }
  if (r.reserveUrl) {
    urlChecks.push({ id: r.id, name: r.name, field: 'reserveUrl', url: r.reserveUrl });
  }
});

console.log(`Checking ${urlChecks.length} URLs...\n`);

// Rate-limited fetch with timeout
async function checkUrl(item) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(item.url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AppetytAudit/1.0)' }
    });
    clearTimeout(timeout);
    if (res.status >= 400) {
      return { ...item, status: res.status, error: `HTTP ${res.status}` };
    }
    return null; // OK
  } catch(e) {
    clearTimeout(timeout);
    // Try GET if HEAD fails
    try {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 10000);
      const res2 = await fetch(item.url, {
        method: 'GET',
        signal: controller2.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AppetytAudit/1.0)' }
      });
      clearTimeout(timeout2);
      if (res2.status >= 400) {
        return { ...item, status: res2.status, error: `HTTP ${res2.status}` };
      }
      return null; // OK on GET
    } catch(e2) {
      return { ...item, status: 0, error: e2.message || 'Connection failed' };
    }
  }
}

// Process in batches of 10
async function run() {
  const batchSize = 10;
  let completed = 0;

  for (let i = 0; i < urlChecks.length; i += batchSize) {
    const batch = urlChecks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkUrl));
    batchResults.forEach(r => { if (r) results.broken.push(r); });
    completed += batch.length;
    process.stdout.write(`\r  Checked ${completed}/${urlChecks.length} URLs | ${results.broken.length} broken`);
  }

  results.checked = urlChecks.length;
  console.log('\n');

  // Summary
  console.log('=== AUDIT SUMMARY ===');
  console.log(`Total restaurants: ${results.total}`);
  console.log(`URLs checked: ${results.checked}`);
  console.log(`Broken links: ${results.broken.length}`);
  console.log(`Missing website: ${results.noWebsite.length}`);
  console.log(`Missing phone: ${results.noPhone.length}`);
  console.log(`Missing address: ${results.noAddress.length}`);
  console.log(`Missing hours: ${results.noHours.length}`);

  if (results.broken.length) {
    console.log('\n--- BROKEN LINKS ---');
    results.broken.forEach(b => {
      console.log(`  ${b.name} [${b.field}] ${b.url} => ${b.error}`);
    });
  }

  if (results.noWebsite.length) {
    console.log(`\n--- NO WEBSITE (${results.noWebsite.length}) ---`);
    results.noWebsite.slice(0, 20).forEach(r => console.log(`  ${r.name}`));
    if (results.noWebsite.length > 20) console.log(`  ... and ${results.noWebsite.length - 20} more`);
  }

  // Save full report
  const reportPath = path.join(__dirname, 'audit-report-links.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report saved to: ${reportPath}`);
}

run().catch(e => console.error(e));
