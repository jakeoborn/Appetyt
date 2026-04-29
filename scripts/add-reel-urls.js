#!/usr/bin/env node
// Inject reelUrl fields into NYC restaurant data in index.html

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const reelUrls = {
  // Batch 1 — original 20
  1001: 'https://www.youtube.com/shorts/zA54rMhEGOc',  // Le Bernardin
  1002: 'https://www.youtube.com/shorts/RSJ4YIeIHwg',  // Eleven Madison Park
  1003: 'https://www.youtube.com/shorts/PmRHjNkPjIo',  // Peter Luger
  1004: 'https://www.youtube.com/shorts/ivzIFlIcVyw',  // Carbone
  1005: 'https://www.youtube.com/shorts/Jlss29xXIWc',  // Via Carota
  1007: 'https://www.youtube.com/shorts/HyiyfjrKx0k',  // Balthazar
  1008: 'https://www.youtube.com/watch?v=V7KoE1UAWiE',  // Lilia
  1009: 'https://www.youtube.com/shorts/xvt76OYhob0',  // Don Angie
  1012: 'https://www.youtube.com/shorts/Q_hNbB0hW7k',  // Tatiana
  1013: 'https://www.youtube.com/shorts/6vdRO8i9wMM',  // Crown Shy
  1014: 'https://www.youtube.com/shorts/GBiWAOVCflg',  // Atomix
  1020: 'https://www.youtube.com/watch?v=C_8S5mCOAIk',  // Le Coucou
  1021: 'https://www.youtube.com/shorts/DtMKd8B6Jc4',  // Sushi Nakazawa
  1022: 'https://www.youtube.com/shorts/P17X2LdhDzE',  // Gramercy Tavern
  1027: 'https://www.youtube.com/shorts/ZAlTUSJxPAA',  // Cosme
  1028: 'https://www.youtube.com/shorts/s8eoZyeQI5U',  // Dhamaka
  1030: 'https://www.youtube.com/watch?v=Xj4-vF8QxqY',  // Olmsted
  1031: 'https://www.youtube.com/shorts/s6LK_DCUkDM',  // Per Se
  1032: 'https://www.youtube.com/shorts/uyCj-HYoMUY',  // Jungsik
  1033: 'https://www.youtube.com/watch?v=02ae_XUZIbI',  // Sushi Sho
  // Batch 2 — new
  1006:  'https://www.youtube.com/shorts/Sf1NLQYFQxs',  // I Sodi
  1010:  'https://www.youtube.com/shorts/1LXCGdzbH2k',  // Katz's Delicatessen
  1015:  'https://www.youtube.com/shorts/FpE-RRT352w',  // 4 Charles Prime Rib
  1016:  'https://www.youtube.com/watch?v=pCddEgU0R8E',  // Di An Di
  1018:  'https://www.youtube.com/shorts/RCG20BN_9Fw',  // Russ & Daughters
  1019:  'https://www.youtube.com/watch?v=uEF9OvznrvQ',  // Dante
  1023:  'https://www.youtube.com/shorts/ZQJah0bi224',  // Gage & Tollner
  1024:  'https://www.youtube.com/shorts/8i_aL4RDsOw',  // Lucali
  1034:  'https://www.youtube.com/shorts/N3iugsySr80',  // Gabriel Kreuther
  1035:  'https://www.youtube.com/shorts/3DlKE-D9hT0',  // Daniel
  1036:  'https://www.youtube.com/shorts/t4Z2YDBCW10',  // Torrisi
  1037:  'https://www.youtube.com/shorts/KJJG0ZJHbkY',  // COTE Korean Steakhouse
  1038:  'https://www.youtube.com/shorts/x0TZP-w6pIU',  // Estela
  1039:  'https://www.youtube.com/shorts/dO2zc6euzxA',  // Semma
  1173:  'https://www.youtube.com/shorts/XO1KlfYuNxM',  // Jean-Georges
  1174:  'https://www.youtube.com/shorts/3r4eq744src',  // Masa
  1172:  'https://www.youtube.com/shorts/V3SA-ivUM7Y',  // Sushi Noz
  1177:  'https://www.youtube.com/shorts/CjsBJfo52kU',  // Chef's Table at Brooklyn Fare
  1180:  'https://www.youtube.com/shorts/tkWrc5YBf0I',  // Aska
  1182:  'https://www.youtube.com/shorts/MnCRRtc8bIE',  // Saga
  // Dallas — Batch 1
  20:  'https://www.youtube.com/shorts/GyjpvjX73Yk',  // Mamani
  304: 'https://www.youtube.com/shorts/9rslnEYuYhY',  // Carbone Dallas
  148: 'https://www.youtube.com/shorts/Hg-JeP6brro',  // Mister Charles
  49:  'https://www.youtube.com/shorts/_w0UWr-flpg',  // Nick & Sam's Steakhouse
  14:  'https://www.youtube.com/shorts/XwW3k1AL_rY',  // Cattleack Barbeque
  57:  'https://www.youtube.com/shorts/fJcIddADKOQ',  // Pecan Lodge
  32:  'https://www.youtube.com/shorts/UBqv3P-l2EQ',  // Nobu Dallas
  84:  'https://www.youtube.com/shorts/cnUwc3LlDM4',  // Wicked Butcher
  205: 'https://www.youtube.com/shorts/IknMcE4hoIg',  // The Slow Bone
  289: 'https://www.youtube.com/shorts/10EC8VFlgW8',  // Sadelle's Dallas
  86:  'https://www.youtube.com/shorts/sRxkeqH179Q',  // Georgie Dallas
  // Houston — Batch 1
  7002: 'https://www.youtube.com/shorts/Fi3CpUJjKaI',  // Tatemó
  7001: 'https://www.youtube.com/shorts/6KRbxu5E_fg',  // March
  7003: 'https://www.youtube.com/shorts/YpVuj186nTk',  // Le Jardinier Houston
  7006: 'https://www.youtube.com/shorts/lk1WYghH59o',  // CorkScrew BBQ
  7005: 'https://www.youtube.com/shorts/3OdrQm8YzTU',  // Musaafer
  7007: 'https://www.youtube.com/shorts/juM0gZcYOLc',  // Truth BBQ
  7009: 'https://www.youtube.com/shorts/WoiVF92G0fM',  // Nancy's Hustle
  7010: 'https://www.youtube.com/shorts/_me2Zh7kMQI',  // Uchi Houston
  7027: 'https://www.youtube.com/shorts/kF0E8OSArD4',  // Killen's BBQ
  7014: 'https://www.youtube.com/shorts/9oh9tV_KGRY',  // Theodore Rex
  7015: 'https://www.youtube.com/shorts/Pnsw9QsMjow',  // Xochi
  7017: 'https://www.youtube.com/shorts/XMFV_0swYPc',  // Street to Kitchen
  7018: 'https://www.youtube.com/shorts/rqLYxp91dOE',  // Blood Bros. BBQ
  7016: 'https://www.youtube.com/shorts/0fx8cg_xCnc',  // Pappas Bros. Steakhouse
  7022: 'https://www.youtube.com/shorts/RMI_S6KMRbI',  // Pinkerton's Barbecue
  7161: 'https://www.youtube.com/shorts/D6GVXhhaJDU',  // Belly of the Beast
  7118: 'https://www.youtube.com/shorts/-Ug_Yd1QWRk',  // ChòpnBlọk
  7149: 'https://www.youtube.com/shorts/Z2i9ZzuiE1I',  // Bludorn
  7028: 'https://www.youtube.com/shorts/UJsJlEaUzR0',  // The Breakfast Klub
  7036: 'https://www.youtube.com/shorts/aulay7xjZbs',  // Nobie's
  7011: 'https://www.youtube.com/shorts/yFynf9R4u-E',  // Crawfish & Noodles
  7041: 'https://www.youtube.com/shorts/CYXH_qGA5aQ',  // Himalaya
  7023: 'https://www.youtube.com/shorts/W1iF2FcpXzc',  // Coltivare
  7024: 'https://www.youtube.com/shorts/2UkiCqkJ9AI',  // Loro Houston
  7407: 'https://www.youtube.com/shorts/Ws1sCoEppvI',  // Bandista
};

let updated = 0;
let skipped = 0;

for (const [id, url] of Object.entries(reelUrls)) {
  const pattern = new RegExp(`\\{"id":${id},`, 'g');
  let match;
  let found = false;

  while ((match = pattern.exec(content)) !== null) {
    const pos = match.index + match[0].length;
    const snippet = content.slice(pos, pos + 200);

    // Confirm it's a restaurant object (has "name": within next 200 chars)
    if (!snippet.includes('"name":')) continue;

    // Check if reelUrl already exists
    const objSnippet = content.slice(match.index, match.index + 1000);
    if (objSnippet.includes('"reelUrl"')) {
      console.log(`id ${id}: already has reelUrl, skipping`);
      skipped++;
      found = true;
      break;
    }

    // Insert reelUrl right after {"id":NNNN,
    content = content.slice(0, pos) + `"reelUrl":"${url}",` + content.slice(pos);
    updated++;
    found = true;
    console.log(`id ${id}: added reelUrl`);
    break;
  }

  if (!found) {
    console.warn(`id ${id}: NOT FOUND`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone: ${updated} added, ${skipped} already had reelUrl.`);
