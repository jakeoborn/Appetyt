const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cities = ['Las Vegas','Dallas','New York','Houston','Austin','Chicago','Salt Lake City','Seattle'];
cities.forEach(city => {
  const re = new RegExp(`'${city}':\\s*\\{\\s*\\n\\s*thingsToDo:\\s*\\[([\\s\\S]*?)\\],\\s*\\n\\s*neighborhoods`);
  const m = html.match(re);
  if (!m) { console.log(city, 'NO MATCH'); return; }
  const body = m[1];
  const entries = body.match(/\{emoji:/g) || [];
  console.log(city + ':', entries.length, 'entries');
});
