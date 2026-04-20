#!/usr/bin/env node
// Set up San Diego as 11th city in Dim Hour:
//   - Create SD_DATA empty array before CITY_DATA
//   - Register 'San Diego' in CITY_DATA, CITY_GROUPS (🌴 US West), CITY_EMOJI, CITY_COORDS
//   - SD is NOT a 2026 FIFA WC host city (skip WC_HOSTS)
const fs = require("fs");
const path = require("path");

const HTML_PATH = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(HTML_PATH, "utf8");

// 1. Insert SD_DATA empty array right before CITY_DATA
const sdDataInsert = `const SD_DATA=[];\n\n`;
html = html.replace(
  /const CITY_DATA = \{/,
  sdDataInsert + `const CITY_DATA = {`
);

// 2. Add San Diego to CITY_DATA map (insert after 'Phoenix': PHX_DATA line)
html = html.replace(
  /('Phoenix': PHX_DATA,)/,
  `$1\n  'San Diego': SD_DATA,`
);

// 3. Add to CITY_GROUPS under 🌴 US West (with LA)
html = html.replace(
  /'🌴 US West':\['Los Angeles'\],/,
  `'🌴 US West':['Los Angeles','San Diego'],`
);

// 4. Add to CITY_COORDS (San Diego downtown: 32.7157, -117.1611)
html = html.replace(
  /(const CITY_COORDS = \{[^}]*?)(\};)/,
  (match, open, close) => open + `,\n  'San Diego':[32.7157,-117.1611]\n` + close
);

// 5. Add to CITY_EMOJI (🌊 wave) — need to find CITY_EMOJI definition
html = html.replace(
  /const CITY_EMOJI = \{/,
  `const CITY_EMOJI = {'San Diego':'🌊',`
);

fs.writeFileSync(HTML_PATH, html, "utf8");
console.log("✅ San Diego registered in CITY_DATA + CITY_GROUPS + CITY_COORDS + CITY_EMOJI");
console.log("   SD_DATA = [] ready for entries");
