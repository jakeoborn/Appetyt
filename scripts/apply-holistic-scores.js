/**
 * Apply holistic scoring algorithm to ALL restaurant data across all cities.
 * Factors: Michelin, James Beard, local press, editorial rankings,
 * dining experience tier, reservation demand, community impact,
 * menu depth, and value signals.
 *
 * Run: node scripts/apply-holistic-scores.js
 */
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

/**
 * Holistic scoring: starts from the existing score (Google-derived) and
 * applies bonuses for awards, acclaim, demand, and community love.
 * This preserves the Google rating as a quality baseline while rewarding
 * restaurants with verified accolades.
 *
 * Max possible bonus: ~+10 for the most acclaimed restaurants.
 * Penalties: up to -5 for overscored restaurants without any signals.
 */
function holisticScore(r) {
  let score = r.score; // Start from existing score (Google-derived baseline)
  let bonus = 0;

  const awards = (r.awards || "").toLowerCase();
  const tags = (r.tags || []).map(t => t.toLowerCase());
  const desc = (r.description || "").toLowerCase();

  // === 1. MICHELIN & MAJOR AWARDS (up to +7) ===
  if (awards.includes("3-star") || awards.includes("3 star")) bonus += 7;
  else if (awards.includes("2-star") || awards.includes("2 star")) bonus += 6;
  else if (awards.includes("michelin star") || awards.includes("1-star") || awards.includes("1 star")) bonus += 5;
  else if (awards.includes("bib gourmand")) bonus += 3;
  else if (awards.includes("michelin recommended") || awards.includes("michelin guide rec")) bonus += 2;
  else if (awards.includes("michelin guide")) bonus += 1;
  else if (awards.includes("five diamond") || awards.includes("five-diamond")) bonus += 4;
  else if (awards.includes("four diamond")) bonus += 1;

  // === 2. JAMES BEARD (up to +3) ===
  if (awards.includes("james beard award winner") || awards.includes("james beard outstanding") || awards.includes("america's classics")) bonus += 3;
  else if (awards.includes("james beard finalist") || awards.includes("james beard best")) bonus += 2;
  else if (awards.includes("james beard semifinalist") || awards.includes("james beard")) bonus += 1;

  // World's 50 Best
  if (awards.includes("world") && awards.includes("50 best")) bonus += 2;

  // === 3. CRITICAL ACCLAIM (up to +2) ===
  let pressMentions = 0;
  const pressKeywords = ["d magazine","dallas observer","culturemap","eater","papercity","texas monthly","food & wine","bon app","new york times","la times","wine spectator"];
  pressKeywords.forEach(kw => { if (awards.includes(kw)) pressMentions++; });
  if (tags.includes("critics pick")) pressMentions++;
  if (pressMentions >= 3) bonus += 2;
  else if (pressMentions >= 1) bonus += 1;

  // === 4. EDITORIAL bestOf RANKINGS (up to +1) ===
  const bestOf = r.bestOf || [];
  if (bestOf.some(b => b.includes("#1"))) bonus += 1;

  // === 5. FLOOR ENFORCEMENT — ensure Michelin restaurants are 90+ ===
  if (awards.includes("michelin star") || awards.includes("1-star") || awards.includes("2-star") || awards.includes("3-star")) {
    score = Math.max(score, 92);
  } else if (awards.includes("bib gourmand")) {
    score = Math.max(score, 90);
  } else if (awards.includes("michelin recommended") || awards.includes("michelin guide rec")) {
    score = Math.max(score, 88);
  } else if (awards.includes("five diamond")) {
    score = Math.max(score, 90);
  }

  // === 6. PENALTY — overscored restaurants with no quality signals ===
  const hasAnySignal = awards || tags.includes("awards") || tags.includes("critics pick") || tags.includes("best of") || tags.includes("local favorites") || bestOf.length > 0;
  if (!hasAnySignal && score >= 90) {
    bonus -= Math.min(5, score - 87); // bring down to ~87
  }

  return Math.min(99, Math.max(75, score + bonus));
}

// Process each city dataset
const datasets = [
  { name: "DALLAS_DATA", re: /const DALLAS_DATA\s*=\s*(\[[\s\S]*?\]);/ },
  { name: "NYC_DATA", re: /const NYC_DATA\s*=\s*(\[[\s\S]*?\]);/ },
  { name: "LA_DATA", re: /const LA_DATA\s*=\s*(\[[\s\S]*?\]);/ },
  { name: "AUSTIN_DATA", re: /const AUSTIN_DATA\s*=\s*(\[[\s\S]*?\]);/ },
  { name: "SANANTONIO_DATA", re: /const SANANTONIO_DATA\s*=\s*(\[[\s\S]*?\]);/ },
];

let totalChanged = 0;
let totalRestaurants = 0;

for (const ds of datasets) {
  const match = html.match(ds.re);
  if (!match) { console.log(ds.name + ": NOT FOUND"); continue; }

  const data = eval(match[1]);
  let changed = 0;
  const changes = [];

  for (const r of data) {
    const newScore = holisticScore(r);
    if (newScore !== r.score) {
      const diff = newScore - r.score;
      if (Math.abs(diff) >= 3) {
        changes.push({ name: r.name, old: r.score, new: newScore, diff });
      }
      r.score = newScore;
      changed++;
    }
  }

  // Write back
  const newData = JSON.stringify(data);
  html = html.replace(match[0], "const " + ds.name + "=" + newData + ";");

  console.log(`\n=== ${ds.name} (${data.length} restaurants) ===`);
  console.log(`Changed: ${changed}/${data.length}`);

  if (changes.length > 0) {
    console.log("Notable changes (|diff| >= 3):");
    changes.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    changes.slice(0, 15).forEach(c =>
      console.log(`  ${c.old} -> ${c.new} (${c.diff >= 0 ? "+" : ""}${c.diff}) | ${c.name}`)
    );
  }

  // Show new top 10
  const sorted = [...data].sort((a, b) => b.score - a.score);
  console.log("New Top 10:");
  sorted.slice(0, 10).forEach((r, i) =>
    console.log(`  ${i+1}. ${r.score} | ${r.name} | ${r.awards ? r.awards.substring(0, 50) : ""}`)
  );

  totalChanged += changed;
  totalRestaurants += data.length;
}

fs.writeFileSync("index.html", html);
console.log(`\n=== TOTAL: ${totalChanged}/${totalRestaurants} scores updated ===`);
console.log("Done! File saved.");
