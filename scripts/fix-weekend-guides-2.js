const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Revert the changes I made to real spots -- put them back
const reverts = [
  // Stephanie Camille guide - put back real spots
  ["spot:'Dinner at Te Deseo'", "spot:'Dinner at Besos Day & Night'"],
  ["note:'Latin-inspired rooftop with incredible cocktails'", "note:'Trendy Latin vibes in Deep Ellum'"],
  ["spot:'Dancing at It\\'ll Do Club'", "spot:'Dancing at LadyLove'"],
  ["note:'Legendary dance club — DJ sets until late'", "note:'Vinyl bar + dance floor in Deep Ellum'"],
  ["spot:'Cocktails at Catbird'", "spot:'Cocktails at Tipsy Alchemist'"],
  ["note:'50th floor cocktails at The National — stunning skyline views'", "note:'Instagram-worthy molecular cocktails'"],

  // Cowgirlseat guide - put back real spots
  ["spot:'Soul food at Soul Shack'", "spot:'Wings at Pluckers'"],
  ["note:'1920s jazz-themed southern kitchen — fried chicken and soul rolls'", "note:'Holy Macaroni wings — trust the process'"],
  ["spot:'Sandwiches at Jimmy\\'s Food Store'", "spot:'Burgers at Rodeo Goat'"],
  ["note:'Iconic Italian deli — the muffuletta is legendary'", "note:'The Baaad Boy burger with fried goat cheese'"],
  ["spot:'Steaks at 12 Cuts Brazilian'", "spot:'Late-night at Lucky Dog Saloon'"],
  ["note:'Go-to Brazilian steakhouse — endless meat parade'", "note:'Cheap shots and good times'"],

  // Hungry in Dallas - put back Ayahuasca
  ["spot:'Cocktails at Apothecary'", "spot:'Mezcal at Ayahuasca Cantina'"],
  ["note:'Intimate cocktail bar — seasonal menu changes constantly'", "note:'Psychedelic vibes — oaxacan cocktails'"],
];

let count = 0;
reverts.forEach(([old, newStr]) => {
  if (html.includes(old)) {
    html = html.replace(old, newStr);
    count++;
  }
});
console.log('Reverted', count, 'spots back to original');

// Now add Tipsy Alchemist to DALLAS_DATA since it's not there
const ids = [...html.matchAll(/"id":(\d+)/g)].map(m => parseInt(m[1]));
const maxId = Math.max(...ids);

const dIdx = html.indexOf('const DALLAS_DATA=') > -1 ? html.indexOf('const DALLAS_DATA=') : html.indexOf('const DALLAS_DATA =');
const arrStart = html.indexOf('[', dIdx);
let depth = 0, arrEnd = arrStart;
for (let i = arrStart; i < html.length; i++) {
  if (html[i] === '[') depth++;
  if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}

const tipsyAlchemist = {
  id: maxId + 1,
  name: "Tipsy Alchemist",
  phone: "(469) 620-0865",
  cuisine: "Molecular Cocktail Bar",
  neighborhood: "Uptown",
  score: 84,
  price: 3,
  tags: ["Cocktails", "Late Night", "Date Night", "Viral", "Celebrations"],
  indicators: [],
  hh: "",
  reservation: "walk-in",
  awards: "",
  description: "Instagram's favorite molecular cocktail bar. Smoking drinks, fog-filled globes, and theatrical presentations that are designed to be filmed. The cocktails are genuinely creative -- not just gimmicks. Perfect for birthdays, bachelorettes, and anyone who wants their drink to put on a show.",
  dishes: ["Smoking Old Fashioned", "Bubble Cocktail", "Fog Globe"],
  address: "2101 Cedar Springs Rd, Dallas, TX 75201",
  website: "https://www.thetipsyalchemist.com",
  instagram: "https://www.instagram.com/tipsyalchemist",
  reserveUrl: "",
  hours: "Wed-Sun 7PM-2AM",
  group: "",
  lat: 32.7976,
  lng: -96.8058
};

html = html.substring(0, arrEnd) + ',' + JSON.stringify(tipsyAlchemist) + html.substring(arrEnd);
console.log('Added Tipsy Alchemist (ID ' + (maxId + 1) + ')');

fs.writeFileSync(indexPath, html);
fs.writeFileSync(path.join(__dirname, '..', 'index'), html);
console.log('Done!');
