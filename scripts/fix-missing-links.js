const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
const match = html.match(/const DALLAS_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);

const fixes = {
  "The Reserve at The Highland": { website: "https://www.thehighlanddallas.com/dining", instagram: "@thereserveatthehighland" },
  "Meridian": { website: "https://thevillagedallas.com/dining/meridian", instagram: "@meridiandallas" },
  "Élephante": { website: "https://www.elephantedallas.com", instagram: "@elephantedallas" },
  "Clark's Oyster Bar": { website: "https://www.clarksoysterbar.com", instagram: "@clarksoysterbar" },
  "Corsaire": { website: "https://www.corsairedallas.com", instagram: "@corsairedallas" },
  "Molino Oloyo": { website: "https://www.molinooloyo.com", instagram: "@molinooloyo" },
  "Serritella Prime Italian": { website: "https://www.serritelladallas.com", instagram: "@serritelladallas" },
  "Punk Noir": { instagram: "@punknoirdallas" },
  "Sant Ambroeus": { website: "https://www.santambroeus.com", instagram: "@santambroeus" },
  "Brazamar": { instagram: "@brazamardallas" },
  "Neighborhood Sushi": { website: "https://www.neighborhoodsushi.com", instagram: "@neighborhoodsushi" },
  "Ospi": { instagram: "@ospidallas" },
  "Alara": { instagram: "@alaradallas" },
  "Night Rooster": { website: "https://www.nightroosterdallas.com", instagram: "@nightroosterdallas" },
  "Little Ruby's": { website: "https://www.littlerubys.com", instagram: "@littlerubys" },
  "Seegar's Deli": { instagram: "@seegarsdeli" },
  "Club Dada": { website: "https://www.clubdada.com", instagram: "@clubdadadallas" },
  "South Side Music Hall": { website: "https://www.southsidemh.com" },
  "Gilley's Dallas": { website: "https://www.gilleysdallas.com", instagram: "@gilleysdallas" },
  "Amplified Live": { website: "https://www.amplifiedlive.com", instagram: "@amplifiedlive" },
  "Highland Park Pharmacy": { instagram: "@highlandparkpharmacy" },
};

let updated = 0;
for (const [name, fix] of Object.entries(fixes)) {
  const r = data.find(r => r.name === name);
  if (!r) { console.log("NOT FOUND:", name); continue; }
  if (fix.website && !r.website) { r.website = fix.website; updated++; }
  if (fix.instagram && !r.instagram) { r.instagram = fix.instagram; updated++; }
  console.log("Fixed:", name);
}

const newData = JSON.stringify(data);
html = html.replace(match[0], "const DALLAS_DATA=" + newData + ";");
fs.writeFileSync("index.html", html);
console.log("\nTotal fields updated:", updated);
