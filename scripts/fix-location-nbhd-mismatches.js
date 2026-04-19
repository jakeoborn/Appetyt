const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open, openCh='[', closeCh=']') {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === openCh) d++;
    else if (str[i] === closeCh) { d--; if (d === 0) return i; }
  }
  return -1;
}

function locateArray(varName) {
  const re = new RegExp(varName + '\\s*=\\s*\\[');
  const m = html.match(re);
  if (!m) return null;
  const arrS = m.index + m[0].length - 1;
  const arrE = stackFindClose(html, arrS) + 1;
  return { arrS, arrE };
}

function parseArray(varName) {
  const pos = locateArray(varName);
  const src = html.substring(pos.arrS, pos.arrE);
  try { return JSON.parse(src); } catch { return new Function('return ' + src)(); }
}

// Fix 1: Slackwater (SLC #11190) — primary and locations[0] had neighborhood
// "North Salt Lake" but address is in Ogden. Correct to "Ogden".
// Fix 2: Velvet Taco (Dallas #1096) — locations[4] labeled "Arlington / Mid-Cities"
// but address is Fort Worth. Correct to "Fort Worth".

const slcPos = locateArray('const SLC_DATA');
const slcData = parseArray('const SLC_DATA');
const slack = slcData.find(r => r.id === 11190);
if (slack) {
  slack.neighborhood = 'Ogden';
  if (slack.locations && slack.locations[0]) {
    slack.locations[0].name = 'Ogden';
    slack.locations[0].neighborhood = 'Ogden';
  }
}
html = html.substring(0, slcPos.arrS) + JSON.stringify(slcData) + html.substring(slcPos.arrE);

// Re-locate after write
const dalPos = locateArray('const DALLAS_DATA');
const dalData = parseArray('const DALLAS_DATA');
const velvet = dalData.find(r => r.id === 1096);
if (velvet && velvet.locations && velvet.locations[4]) {
  const loc = velvet.locations[4];
  // Only correct if address really says Fort Worth
  if (/Fort Worth/i.test(loc.address || '')) {
    loc.name = 'Fort Worth';
    loc.neighborhood = 'Fort Worth';
  }
}
html = html.substring(0, dalPos.arrS) + JSON.stringify(dalData) + html.substring(dalPos.arrE);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed Slackwater (primary + loc 0 → Ogden) and Velvet Taco (loc 4 → Fort Worth).');
