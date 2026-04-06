const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Make Neighborhood Spotlight cards clickable — filter home tab by neighborhood
const neighborhoods = [
  {name:'East Village', emoji:'🎸'},
  {name:'West Village', emoji:'🌿'},
  {name:'Williamsburg', emoji:'🎨'},
  {name:'Lower East Side', emoji:'🎵'},
  {name:'SoHo', emoji:'👗'},
  {name:'Chinatown', emoji:'🥟'},
  {name:'Harlem', emoji:'🎷'},
  {name:'Bronx', emoji:'🐻'},
];

neighborhoods.forEach(n => {
  // Find the card div and add onclick + cursor
  const cardContent = `<div style="font-size:16px;margin-bottom:4px">${n.emoji}</div><div style="font-size:12px;font-weight:700;color:var(--text)">${n.name}</div>`;
  const oldCard = `<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px">${cardContent}`;
  const newCard = `<div onclick="S.neighborhood='${n.name}';A.tab('home')" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer">${cardContent}`;

  if(html.includes(oldCard)) {
    html = html.replace(oldCard, newCard);
    console.log('Made clickable:', n.name);
  }
});

// 2. Make Day Trip cards clickable — open Google search for the destination
const dayTrips = [
  {name:'Hudson Valley', query:'Hudson Valley NY day trip restaurants'},
  {name:'Montauk', query:'Montauk NY restaurants things to do'},
  {name:'New Haven', query:'New Haven CT pizza Frank Pepe Sally'},
  {name:'Philadelphia', query:'Philadelphia restaurants Zahav Reading Terminal'},
  {name:'Catskills', query:'Catskills NY restaurants hiking Phoenicia'},
];

dayTrips.forEach(t => {
  const nameDiv = `<div style="font-size:13px;font-weight:700;color:var(--text)">${t.name}</div>`;
  const oldTrip = `<div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">${nameDiv.replace(t.name, '').split('</div>')[0]}`;

  // Find by the destination name
  const tripIdx = html.indexOf(nameDiv, html.indexOf('Day Trips from NYC'));
  if(tripIdx > -1) {
    // Walk back to find the card opening div
    const cardStart = html.lastIndexOf('<div style="flex-shrink:0;width:160px', tripIdx);
    if(cardStart > -1) {
      const oldCardOpen = '<div style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">';
      const newCardOpen = `<div onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(t.query)}','_blank')" style="flex-shrink:0;width:160px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;cursor:pointer">`;
      // Only replace at this specific position
      html = html.substring(0, cardStart) + newCardOpen + html.substring(cardStart + oldCardOpen.length);
      console.log('Made clickable:', t.name);
    }
  }
});

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
