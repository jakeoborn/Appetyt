#!/usr/bin/env node
// Audit all Instagram handles and website URLs across all cities
// Tests each link and reports broken ones
// Run: node scripts/audit-links.js
// Output: scripts/broken-links-report.json

const fs = require('fs');
const https = require('https');
const http = require('http');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function parseArray(tag) {
  const s = indexHtml.indexOf(tag); if (s === -1) return [];
  const a = indexHtml.indexOf('[', s); let d = 0, e = a;
  for (let i = a; i < indexHtml.length; i++) { if (indexHtml[i] === '[') d++; if (indexHtml[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  try { return JSON.parse(indexHtml.slice(a, e)); } catch(e) { return []; }
}
function parseChicago() {
  const ci = indexHtml.indexOf("'Chicago': [", indexHtml.indexOf('const CITY_DATA'));
  if (ci === -1) return [];
  const ca = indexHtml.indexOf('[', ci + 10); let d = 0, e = ca;
  for (let i = ca; i < indexHtml.length; i++) { if (indexHtml[i] === '[') d++; if (indexHtml[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  try { return JSON.parse(indexHtml.slice(ca, e)); } catch(e) { return []; }
}

const cities = [
  { name: 'Dallas', data: parseArray('const DALLAS_DATA') },
  { name: 'NYC', data: parseArray('const NYC_DATA') },
  { name: 'Houston', data: parseArray('const HOUSTON_DATA') },
  { name: 'Austin', data: parseArray('const AUSTIN_DATA') },
  { name: 'Chicago', data: parseChicago() },
  { name: 'SLC', data: parseArray('const SLC_DATA=') },
];

function checkUrl(url, timeout = 8000) {
  return new Promise((resolve) => {
    try {
      const mod = url.startsWith('https') ? https : http;
      const req = mod.get(url, { timeout, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Dim HourAudit/1.0)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ status: res.statusCode, redirect: res.headers.location, ok: true });
        } else {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
        }
        res.resume();
      });
      req.on('error', (err) => resolve({ status: 0, error: err.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout', ok: false }); });
    } catch(e) {
      resolve({ status: 0, error: e.message, ok: false });
    }
  });
}

async function auditCity(cityName, data) {
  const issues = [];
  let igChecked = 0, igBroken = 0, webChecked = 0, webBroken = 0;

  for (let idx = 0; idx < data.length; idx++) {
    const r = data[idx];
    if (idx % 50 === 0 && idx > 0) {
      process.stdout.write(`  ...${idx}/${data.length}\n`);
    }

    // Check Website (faster, less rate-limited than Instagram)
    const web = (r.website || '').trim();
    if (web && web.length > 5 && web.startsWith('http')) {
      const result = await checkUrl(web);
      webChecked++;
      if (!result.ok) {
        webBroken++;
        issues.push({
          type: 'website',
          name: r.name,
          score: r.score,
          url: web,
          status: result.status,
          error: result.error || '',
        });
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Instagram check — sample top 50 per city (IG rate limits aggressively)
  const igSample = data.filter(r => r.instagram && r.instagram.replace('@','').trim().length > 1)
    .sort((a,b) => b.score - a.score)
    .slice(0, 50);

  for (const r of igSample) {
    const ig = r.instagram.replace('@', '').trim();
    const igUrl = `https://www.instagram.com/${ig}/`;
    const result = await checkUrl(igUrl);
    igChecked++;
    if (!result.ok && result.status !== 0) { // ignore timeouts for IG (rate limiting)
      igBroken++;
      issues.push({
        type: 'instagram',
        name: r.name,
        score: r.score,
        handle: ig,
        url: igUrl,
        status: result.status,
        error: result.error || '',
      });
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return { cityName, total: data.length, igChecked, igBroken, webChecked, webBroken, issues };
}

async function main() {
  console.log('=== DIM HOUR LINK AUDIT ===\n');
  console.log('Testing website URLs for all restaurants + Instagram for top 50 per city...\n');

  const allResults = [];
  let totalIssues = 0;

  for (const city of cities) {
    console.log(`Checking ${city.name} (${city.data.length} restaurants)...`);
    const result = await auditCity(city.name, city.data);
    allResults.push(result);
    totalIssues += result.issues.length;

    console.log(`  Website: ${result.webChecked} checked, ${result.webBroken} broken`);
    console.log(`  Instagram: ${result.igChecked} checked, ${result.igBroken} broken`);
    if (result.issues.length > 0) {
      result.issues.slice(0, 10).forEach(i => {
        console.log(`    ${i.type}: ${i.name} (${i.score}) — ${i.url} [${i.status || i.error}]`);
      });
      if (result.issues.length > 10) console.log(`    ... and ${result.issues.length - 10} more`);
    }
    console.log('');
  }

  const report = {
    date: new Date().toISOString(),
    summary: {
      totalRestaurants: cities.reduce((s, c) => s + c.data.length, 0),
      totalIssues,
      byCity: allResults.map(r => ({
        city: r.cityName, total: r.total,
        igChecked: r.igChecked, igBroken: r.igBroken,
        webChecked: r.webChecked, webBroken: r.webBroken,
      })),
    },
    issues: allResults.flatMap(r => r.issues),
  };

  fs.writeFileSync('scripts/broken-links-report.json', JSON.stringify(report, null, 2));
  console.log('=== SUMMARY ===');
  console.log(`Total restaurants: ${report.summary.totalRestaurants}`);
  console.log(`Total broken links: ${totalIssues}`);
  console.log(`Report: scripts/broken-links-report.json`);
}

main().catch(console.error);
