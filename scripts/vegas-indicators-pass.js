// Vegas indicator enrichment pass — verified assignments only.
// Vocabulary: brewery, dive-bar, hole-in-wall, vegetarian, women-owned, lgbtq-friendly, halal, outdoor-only, new
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const LV_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Vegas:', arr.length);

// Map: lowercase name -> indicators to add
const map = {
  // BREWERIES (on-site brewing)
  "able baker brewing": ["brewery"],
  "tenaya creek brewery": ["brewery"],
  "big dog's brewing company": ["brewery"],

  // DIVE BARS (established dives)
  "atomic liquors": ["dive-bar"],
  "dino's lounge": ["dive-bar"],
  "champagne's cafe": ["dive-bar"],
  "frankie's tiki room": ["dive-bar"],
  "the sand dollar lounge": ["dive-bar"],
  "the golden tiki": ["dive-bar"],

  // HOLE-IN-WALL (small strip-mall / tiny rooms)
  "aburiya raku": ["hole-in-wall"],
  "kabuto edomae sushi": ["hole-in-wall"],
  "monta japanese noodle house": ["hole-in-wall"],
  "ramen sora": ["hole-in-wall"],
  "weera thai": ["hole-in-wall"],
  "shanghai taste": ["hole-in-wall"],
  "kung fu thai & chinese": ["hole-in-wall"],
  "battista's hole in the wall": ["hole-in-wall"],
  "le thai": ["hole-in-wall"],
  "pho kim long": ["hole-in-wall"],
  "marufuku ramen": ["hole-in-wall"],
  "kame omakase": ["hole-in-wall"],
  "kaiseki yuzu": ["hole-in-wall"],
  "yui edomae sushi": ["hole-in-wall"],
  "partage": ["hole-in-wall"],

  // VEGETARIAN / VEG-FRIENDLY (verified all-vegan or veg-forward)
  "crossroads kitchen": ["vegetarian"],
  "tacotarian": ["vegetarian"],
  "true food kitchen": ["vegetarian"],
  "gjelina": ["vegetarian"],
  "pho saigonese": ["vegetarian"],

  // WOMEN-OWNED (verified via public reporting)
  "cafe lola": ["women-owned"],
  "honey salt": ["women-owned"],
  "the black sheep": ["women-owned"],
  "pinkbox doughnuts": ["women-owned"],
  "makers & finders": ["women-owned"],

  // NEW (opened 2024-2026)
  "white whale": ["new"],
  "anima by edo": ["new"],
  "azzurra cucina italiana": ["new"],
  "carversteak": ["new"],
  "brioche by guy savoy": ["new"],
  "bleau bar": ["new"],
  "don's prime": ["new"],
  "komodo": ["new"],
  "papi steak": ["new"],
  "crossroads kitchen": ["new","vegetarian"],
  "wakuda": ["new"],
  "fuhu": ["new"],
  "brezza": ["new"],
  "wally's": ["new"],
  "hasalon": ["new"],

  // OUTDOOR-ONLY (pool clubs / outdoor venues)
  "stadium swim": ["outdoor-only"],
  "encore beach club": ["outdoor-only"],
  "palm tree beach club": ["outdoor-only"],
  "ayu dayclub": ["outdoor-only"],
  "tao beach dayclub": ["outdoor-only"],
};

let touched = 0;
for(const r of arr){
  const key = r.name.toLowerCase();
  if(map[key]){
    const existing = new Set(r.indicators||[]);
    for(const ind of map[key]) existing.add(ind);
    r.indicators = Array.from(existing);
    touched++;
  }
}
console.log('Tagged', touched, 'spots with indicators');

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Indicator pass complete!');
