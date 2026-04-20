const fs = require('fs');
const content = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');
const names = ['Eleven Madison Park', 'Sushi Nakazawa', '4 Charles Prime Rib', 'The Corson Building', 'Corson Building'];

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function extractPhotos(window) {
  const photoUrlMatch = window.match(/"photoUrl":"([^"]*)"/);
  const photoUrl = photoUrlMatch ? photoUrlMatch[1] : null;
  const photosIdx = window.indexOf('"photos":[');
  let photos = null;
  if (photosIdx !== -1) {
    const start = photosIdx + '"photos":['.length;
    let i = start, inStr = false, esc = false;
    while (i < window.length) {
      const c = window[i];
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = !inStr;
      else if (!inStr && c === ']') break;
      i++;
    }
    const arrStr = '[' + window.substring(start, i) + ']';
    try { photos = JSON.parse(arrStr); } catch (e) { photos = arrStr; }
  }
  return { photoUrl, photos };
}

for (const n of names) {
  const re = new RegExp('"' + escapeRe(n) + '"', 'g');
  let m;
  while ((m = re.exec(content)) !== null) {
    const window = content.substring(m.index, Math.min(content.length, m.index + 6000));
    if (!window.includes('"photoUrl"')) continue;
    const lineNum = content.substring(0, m.index).split('\n').length;
    const { photoUrl, photos } = extractPhotos(window);
    console.log('=== ' + n + ' (line ' + lineNum + ', pos ' + m.index + ') ===');
    console.log('photoUrl:', photoUrl);
    if (Array.isArray(photos)) {
      photos.forEach((p, i) => console.log('  photos[' + i + ']:', p));
    } else if (photos) {
      console.log('photos (raw):', photos.substring(0, 500));
    } else {
      console.log('photos: (none)');
    }
    console.log();
  }
}
