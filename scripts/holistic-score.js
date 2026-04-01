const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
const match = html.match(/const DALLAS_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);

function holisticScore(r) {
  let score = 78; // base — a restaurant that made it into the app deserves 78+

  // === 1. MICHELIN & MAJOR AWARDS (up to +14) ===
  // These are the most significant differentiators
  const awards = (r.awards || "").toLowerCase();
  let michelinBonus = 0;
  if (awards.includes("3-star") || awards.includes("3 star")) michelinBonus = 14;
  else if (awards.includes("2-star") || awards.includes("2 star")) michelinBonus = 12;
  else if (awards.includes("michelin star") || awards.includes("1-star") || awards.includes("1 star")) michelinBonus = 10;
  else if (awards.includes("bib gourmand")) michelinBonus = 7;
  else if (awards.includes("michelin recommended") || awards.includes("michelin guide rec")) michelinBonus = 5;
  else if (awards.includes("michelin guide") && !awards.includes("recommended")) michelinBonus = 4;
  else if (awards.includes("five diamond") || awards.includes("five-diamond")) michelinBonus = 8;
  else if (awards.includes("four diamond")) michelinBonus = 3;
  score += michelinBonus;

  // === 2. JAMES BEARD & NATIONAL RECOGNITION (up to +4) ===
  let beardBonus = 0;
  if (awards.includes("james beard award winner") || awards.includes("james beard outstanding")) beardBonus = 4;
  else if (awards.includes("james beard finalist") || awards.includes("james beard best")) beardBonus = 3;
  else if (awards.includes("james beard semifinalist")) beardBonus = 2;
  else if (awards.includes("james beard")) beardBonus = 1;
  score += beardBonus;

  // === 3. LOCAL PRESS & CRITICAL ACCLAIM (up to +4) ===
  let pressBonus = 0;
  if (awards.includes("wine spectator")) pressBonus += 1;

  // Count distinct local press mentions
  let pressMentions = 0;
  if (awards.includes("d magazine")) pressMentions++;
  if (awards.includes("dallas observer")) pressMentions++;
  if (awards.includes("culturemap")) pressMentions++;
  if (awards.includes("eater")) pressMentions++;
  if (awards.includes("papercity")) pressMentions++;
  if (awards.includes("texas monthly")) pressMentions++;
  if (awards.includes("food & wine") || awards.includes("food and wine")) pressMentions++;
  pressBonus += Math.min(2, pressMentions); // cap at 2

  const tags = (r.tags || []).map(t => t.toLowerCase());
  if (tags.includes("critics pick")) pressBonus += 1;

  score += Math.min(4, pressBonus);

  // === 4. EDITORIAL RANKINGS (up to +3) ===
  const bestOf = r.bestOf || [];
  if (bestOf.some(b => b.includes("#1 Best Overall"))) score += 3;
  else if (bestOf.some(b => b.includes("#1"))) score += 2;
  else if (bestOf.length > 0) score += 1;

  // === 5. DINING EXPERIENCE TIER (up to +3) ===
  if (tags.includes("fine dining") || tags.includes("exclusive")) score += 2;
  if (tags.includes("omakase") || (r.cuisine && /tasting menu|omakase/i.test(r.cuisine))) score += 1;

  // === 6. RESERVATION DEMAND — a proxy for quality (up to +3) ===
  const resTier = r.res_tier || 0;
  if (resTier >= 5) score += 3;
  else if (resTier >= 4) score += 2;
  else if (resTier >= 3) score += 1;

  // === 7. CULTURAL IMPACT & COMMUNITY LOVE (up to +3) ===
  let communityBonus = 0;
  if (tags.includes("local favorites")) communityBonus += 1;
  if (tags.includes("awards") || tags.includes("best of")) communityBonus += 1;
  if (tags.includes("viral") || r.trending) communityBonus += 1;
  // Longevity bonus
  const desc = (r.description || "").toLowerCase();
  if (desc.match(/since 19[0-9][0-9]/) || desc.includes("institution") || desc.includes("decades")) communityBonus += 1;
  score += Math.min(3, communityBonus);

  // === 8. MENU DEPTH & CRAFT (up to +2) ===
  const dishes = r.dishes || [];
  if (dishes.length >= 4) score += 2;
  else if (dishes.length >= 2) score += 1;

  // === 9. VALUE SIGNALS (up to +1) ===
  if (r.hh || tags.includes("happy hour") || tags.includes("neighborhood gem")) score += 1;

  // Cap at 99, floor at 75
  return Math.min(99, Math.max(75, score));
}

// Compute all scores
const scored = data.map(r => ({
  name: r.name,
  old: r.score,
  new: holisticScore(r),
  diff: holisticScore(r) - r.score,
  awards: r.awards || "",
  cuisine: r.cuisine
}));

scored.sort((a, b) => b.new - a.new);

console.log("=== TOP 30 (holistic scores) ===");
scored.slice(0, 30).forEach(r => console.log(
  `${r.new} (was ${r.old}, ${r.diff >= 0 ? "+" : ""}${r.diff}) | ${r.name}${r.awards ? " | " + r.awards.substring(0, 60) : ""}`
));

console.log("\n=== BOTTOM 10 ===");
scored.slice(-10).forEach(r => console.log(
  `${r.new} (was ${r.old}, ${r.diff >= 0 ? "+" : ""}${r.diff}) | ${r.name}`
));

console.log("\n=== BIGGEST INCREASES (top 15) ===");
const increases = [...scored].sort((a, b) => b.diff - a.diff);
increases.slice(0, 15).forEach(r => console.log(
  `${r.old} -> ${r.new} (${r.diff >= 0 ? "+" : ""}${r.diff}) | ${r.name} | ${r.awards.substring(0, 50)}`
));

console.log("\n=== BIGGEST DECREASES (top 15) ===");
const decreases = [...scored].sort((a, b) => a.diff - b.diff);
decreases.slice(0, 15).forEach(r => console.log(
  `${r.old} -> ${r.new} (${r.diff >= 0 ? "+" : ""}${r.diff}) | ${r.name} | ${r.cuisine}`
));

console.log("\n=== SCORE DISTRIBUTION ===");
const dist = {};
scored.forEach(r => {
  const bucket = Math.floor(r.new / 5) * 5;
  dist[bucket] = (dist[bucket] || 0) + 1;
});
Object.keys(dist).sort((a, b) => a - b).forEach(k => console.log(`${k}-${parseInt(k) + 4}: ${dist[k]}`));
