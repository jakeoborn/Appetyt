#!/usr/bin/env node
// Inject reelUrl fields into city restaurant data in index.html.
// City-scoped: each entry is applied only within its city's data array,
// so duplicate IDs across cities don't contaminate each other.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Map of city key → { id: url }
const cityReels = {
  NYC: {
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
    // Batch 2
    1006: 'https://www.youtube.com/shorts/Sf1NLQYFQxs',  // I Sodi
    1010: 'https://www.youtube.com/shorts/1LXCGdzbH2k',  // Katz's Delicatessen
    1015: 'https://www.youtube.com/shorts/FpE-RRT352w',  // 4 Charles Prime Rib
    1016: 'https://www.youtube.com/watch?v=pCddEgU0R8E',  // Di An Di
    1018: 'https://www.youtube.com/shorts/RCG20BN_9Fw',  // Russ & Daughters
    1019: 'https://www.youtube.com/watch?v=uEF9OvznrvQ',  // Dante
    1023: 'https://www.youtube.com/shorts/ZQJah0bi224',  // Gage & Tollner
    1024: 'https://www.youtube.com/shorts/8i_aL4RDsOw',  // Lucali
    1034: 'https://www.youtube.com/shorts/N3iugsySr80',  // Gabriel Kreuther
    1035: 'https://www.youtube.com/shorts/3DlKE-D9hT0',  // Daniel
    1036: 'https://www.youtube.com/shorts/t4Z2YDBCW10',  // Torrisi
    1037: 'https://www.youtube.com/shorts/KJJG0ZJHbkY',  // COTE Korean Steakhouse
    1038: 'https://www.youtube.com/shorts/x0TZP-w6pIU',  // Estela
    1039: 'https://www.youtube.com/shorts/dO2zc6euzxA',  // Semma
    1173: 'https://www.youtube.com/shorts/XO1KlfYuNxM',  // Jean-Georges
    1174: 'https://www.youtube.com/shorts/3r4eq744src',  // Masa
    1172: 'https://www.youtube.com/shorts/V3SA-ivUM7Y',  // Sushi Noz
    1177: 'https://www.youtube.com/shorts/CjsBJfo52kU',  // Chef's Table at Brooklyn Fare
    1180: 'https://www.youtube.com/shorts/tkWrc5YBf0I',  // Aska
    1182: 'https://www.youtube.com/shorts/MnCRRtc8bIE',  // Saga
  },
  DALLAS: {
    14:  'https://www.youtube.com/shorts/XwW3k1AL_rY',  // Cattleack Barbeque
    20:  'https://www.youtube.com/shorts/GyjpvjX73Yk',  // Mamani
    32:  'https://www.youtube.com/shorts/UBqv3P-l2EQ',  // Nobu Dallas
    49:  'https://www.youtube.com/shorts/_w0UWr-flpg',  // Nick & Sam's Steakhouse
    57:  'https://www.youtube.com/shorts/fJcIddADKOQ',  // Pecan Lodge
    84:  'https://www.youtube.com/shorts/cnUwc3LlDM4',  // Wicked Butcher
    86:  'https://www.youtube.com/shorts/sRxkeqH179Q',  // Georgie Dallas
    148: 'https://www.youtube.com/shorts/Hg-JeP6brro',  // Mister Charles
    205: 'https://www.youtube.com/shorts/IknMcE4hoIg',  // The Slow Bone
    289: 'https://www.youtube.com/shorts/10EC8VFlgW8',  // Sadelle's Dallas
    304: 'https://www.youtube.com/shorts/9rslnEYuYhY',  // Carbone Dallas
  },
  HOUSTON: {
    7001: 'https://www.youtube.com/shorts/6KRbxu5E_fg',  // March
    7002: 'https://www.youtube.com/shorts/Fi3CpUJjKaI',  // Tatemó
    7003: 'https://www.youtube.com/shorts/YpVuj186nTk',  // Le Jardinier Houston
    7005: 'https://www.youtube.com/shorts/3OdrQm8YzTU',  // Musaafer
    7006: 'https://www.youtube.com/shorts/lk1WYghH59o',  // CorkScrew BBQ
    7007: 'https://www.youtube.com/shorts/juM0gZcYOLc',  // Truth BBQ
    7009: 'https://www.youtube.com/shorts/WoiVF92G0fM',  // Nancy's Hustle
    7010: 'https://www.youtube.com/shorts/_me2Zh7kMQI',  // Uchi Houston
    7011: 'https://www.youtube.com/shorts/yFynf9R4u-E',  // Crawfish & Noodles
    7014: 'https://www.youtube.com/shorts/9oh9tV_KGRY',  // Theodore Rex
    7015: 'https://www.youtube.com/shorts/Pnsw9QsMjow',  // Xochi
    7016: 'https://www.youtube.com/shorts/0fx8cg_xCnc',  // Pappas Bros. Steakhouse
    7017: 'https://www.youtube.com/shorts/XMFV_0swYPc',  // Street to Kitchen
    7018: 'https://www.youtube.com/shorts/rqLYxp91dOE',  // Blood Bros. BBQ
    7022: 'https://www.youtube.com/shorts/RMI_S6KMRbI',  // Pinkerton's Barbecue
    7023: 'https://www.youtube.com/shorts/W1iF2FcpXzc',  // Coltivare
    7024: 'https://www.youtube.com/shorts/2UkiCqkJ9AI',  // Loro Houston
    7027: 'https://www.youtube.com/shorts/kF0E8OSArD4',  // Killen's BBQ
    7028: 'https://www.youtube.com/shorts/UJsJlEaUzR0',  // The Breakfast Klub
    7036: 'https://www.youtube.com/shorts/aulay7xjZbs',  // Nobie's
    7041: 'https://www.youtube.com/shorts/CYXH_qGA5aQ',  // Himalaya
    7118: 'https://www.youtube.com/shorts/-Ug_Yd1QWRk',  // ChòpnBlọk
    7149: 'https://www.youtube.com/shorts/Z2i9ZzuiE1I',  // Bludorn
    7161: 'https://www.youtube.com/shorts/D6GVXhhaJDU',  // Belly of the Beast
    7407: 'https://www.youtube.com/shorts/Ws1sCoEppvI',  // Bandista
  },
  CHICAGO: {
    1:     'https://www.youtube.com/shorts/6diUXTQIHM4',  // Alinea
    2:     'https://www.youtube.com/shorts/unBXS53lhbg',  // Smyth
    4:     'https://www.youtube.com/shorts/4ddv8r9TMS0',  // Oriole
    5:     'https://www.youtube.com/shorts/XTkwb2cFRWI',  // Girl & the Goat
    7:     'https://www.youtube.com/shorts/3WS9kflP8Gg',  // Kasama
    12:    'https://www.youtube.com/shorts/uVWf0uFn4KI',  // Pequod's Pizza
    20:    'https://www.youtube.com/shorts/3D3sYPb_oUE',  // Au Cheval
    21:    'https://www.youtube.com/shorts/3nn1GHLF2x0',  // Frontera Grill
    22:    'https://www.youtube.com/shorts/0Mcxzpk6h6I',  // Bavette's Bar & Boeuf
    36:    'https://www.youtube.com/shorts/Zk8slkKmbYw',  // Maple & Ash
    48:    'https://www.youtube.com/shorts/PNkFVM84T5I',  // Johnnie's Beef
    49:    'https://www.youtube.com/shorts/mAmA2BM2bWk',  // Birrieria Zaragoza
    63:    'https://www.youtube.com/shorts/bF9oscrpcgs',  // Indienne
    65:    'https://www.youtube.com/shorts/X1JF_pKqIN0',  // Boka Restaurant
    68:    'https://www.youtube.com/shorts/nmTuuuqp0zM',  // Momotaro
    69:    'https://www.youtube.com/shorts/Be7Xt2XEnxA',  // J.P. Graziano
    122:   'https://www.youtube.com/shorts/BB72rxpdIdY',  // Tzuco
    135:   'https://www.youtube.com/shorts/FVQUnBB6l98',  // North Pond
    152:   'https://www.youtube.com/shorts/WiYVeI9-nhI',  // Next Chicago
    154:   'https://www.youtube.com/shorts/PzMNTok-z1M',  // Mako Chicago
    155:   'https://www.youtube.com/shorts/4NOvxhzS1wc',  // Esmé Chicago
    255:   'https://www.youtube.com/shorts/17CRUddI8SM',  // Pizz'Amici
    12538: 'https://www.youtube.com/shorts/ZenrJ91vO_8',  // Ever
  },
  LA: {
    2003: 'https://www.youtube.com/shorts/0Cbz5E_0EQk',  // n/naka
    2004: 'https://www.youtube.com/shorts/5_b9Hf9wUdc',  // Providence LA
    2127: 'https://www.youtube.com/shorts/CvXJa8SJAig',  // Somni
    2128: 'https://www.youtube.com/shorts/H6zph1Aw98U',  // Hayato LA
    2006: 'https://www.youtube.com/shorts/LyrzTUrtGVo',  // Spago Beverly Hills
    2026: 'https://www.youtube.com/shorts/8_RNs-3d23E',  // Osteria Mozza
    2051: 'https://www.youtube.com/shorts/zXNZvH7w4pk',  // Restaurant Ki
    2129: 'https://www.youtube.com/shorts/6-MtRw_h9lY',  // Mélisse
    2132: 'https://www.youtube.com/shorts/s_OgN_RSKp0',  // Sushi Kaneyoshi
    2056: 'https://www.youtube.com/shorts/dypht2LOSds',  // Holbox LA
    2130: 'https://www.youtube.com/shorts/9PnUDRahqyM',  // Vespertine
    2134: 'https://www.youtube.com/shorts/rdU4aWg2EBw',  // Kato Restaurant LA
    2364: 'https://www.youtube.com/shorts/yz0JS2TF5lQ',  // CUT by Wolfgang Puck
    2474: 'https://www.youtube.com/shorts/cRh9b_hswjs',  // Matsuhisa Beverly Hills
    2534: 'https://www.youtube.com/shorts/H1wCP3NgYWc',  // Mírate
    2033: 'https://www.youtube.com/shorts/MGkX2sc2EmE',  // Anajak Thai Cuisine
    2088: 'https://www.youtube.com/shorts/LMaClbk9JMY',  // Chi Spacca
    2089: 'https://www.youtube.com/shorts/wqPWuvllPKE',  // Camphor LA
    2247: 'https://www.youtube.com/shorts/tJbogHt74yU',  // Langer's Delicatessen
    2341: 'https://www.youtube.com/shorts/_NF9IdlWAd8',  // Funke LA
    2360: 'https://www.youtube.com/shorts/_ds8LINEokQ',  // Mother Wolf LA
    2005: 'https://www.youtube.com/shorts/ByAJN1mJBsA',  // Republique LA
    2025: 'https://www.youtube.com/shorts/GNciKxF9GDc',  // Majordomo LA
    2030: 'https://www.youtube.com/shorts/r9R05dJ8Y8Y',  // Horses LA
    2224: 'https://www.youtube.com/shorts/A-l9ONJXogs',  // Jitlada Restaurant
    2337: 'https://www.youtube.com/shorts/vvOuOANsQOQ',  // Howlin' Ray's Pasadena
    2072: 'https://www.youtube.com/shorts/ZBTj9lzFDu0',  // Lielle LA
    2027: 'https://www.youtube.com/shorts/LxCuQqa9NiI',  // Sushi Park LA
  },
  AUSTIN: {
    5001: 'https://www.youtube.com/shorts/HkQK6qi9HM0',  // Franklin Barbecue
    5004: 'https://www.youtube.com/shorts/APgLCoKRBqw',  // Odd Duck
    5008: 'https://www.youtube.com/shorts/8lJDuX0lW5Y',  // la Barbecue
    5011: 'https://www.youtube.com/shorts/gbctFkkvttU',  // Nixta Taqueria
    5013: 'https://www.youtube.com/shorts/dM9fASYuynE',  // Kemuri Tatsu-ya
    5018: 'https://www.youtube.com/shorts/0OphI1lAAKk',  // Valentina's Tex Mex BBQ
    5022: 'https://www.youtube.com/shorts/9gMfIdAQdU0',  // Hestia
    5026: 'https://www.youtube.com/shorts/FdVwXoXNqBc',  // Barley Swine
    5032: 'https://www.youtube.com/shorts/XuWmL9IJZ-Y',  // Craft Omakase
    5033: 'https://www.youtube.com/shorts/Jnt14J2upQ8',  // InterStellar BBQ
    5035: 'https://www.youtube.com/shorts/XXWqNwBhKNk',  // Canje
    5038: 'https://www.youtube.com/shorts/EfEW8pOmMyk',  // Red Ash
    5039: 'https://www.youtube.com/shorts/ES8Ys_4mBb0',  // Veracruz All Natural
    5044: 'https://www.youtube.com/shorts/g1wdU1X_zeA',  // Parish Barbecue
    5056: 'https://www.youtube.com/shorts/xscqYu2UULg',  // LeRoy and Lewis Barbecue
    5057: 'https://www.youtube.com/shorts/jviyWQiW8DU',  // Distant Relatives
    5059: 'https://www.youtube.com/shorts/-i9LnIVhd90',  // Midnight Cowboy
    5064: 'https://www.youtube.com/shorts/SSPO07XaCiM',  // Jester King Brewery
    5087: 'https://www.youtube.com/shorts/dimBG2gEZhg',  // Stiles Switch BBQ
    5094: 'https://www.youtube.com/shorts/bPAWzmfYEPE',  // Foreign & Domestic
    5162: 'https://www.youtube.com/shorts/n-nwJJuaLI8',  // Black's Barbecue
    5163: 'https://www.youtube.com/shorts/DBX8eUUKzfY',  // Kreuz Market
    5465: 'https://www.youtube.com/shorts/LTI8aTw6xBU',  // Este
  },
};

// Find the byte range of a city's data array in the file
function getCityBounds(cityKey) {
  const needle = `const ${cityKey}_DATA=[`;
  const idx = content.indexOf(needle);
  if (idx === -1) return null;
  const arrStart = idx + content.slice(idx).indexOf('[');
  let depth = 0, i = arrStart;
  while (i < content.length) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') { depth--; if (depth === 0) break; }
    i++;
  }
  return { start: arrStart, end: i };
}

let totalAdded = 0, totalSkipped = 0, totalNotFound = 0;

for (const [cityKey, reelUrls] of Object.entries(cityReels)) {
  let cityAdded = 0;
  for (const [id, url] of Object.entries(reelUrls)) {
    // Re-compute bounds each iteration since insertions shift offsets
    const bounds = getCityBounds(cityKey);
    if (!bounds) { console.warn(`${cityKey}: array not found`); break; }

    const needle = `"id":${id},`;
    let pos = bounds.start;
    let found = false;
    while (pos < bounds.end) {
      const idx = content.indexOf(needle, pos);
      if (idx === -1 || idx > bounds.end) break;
      found = true;
      if (content.slice(idx, idx + 600).includes('"reelUrl"')) {
        totalSkipped++;
        break;
      }
      const insertAt = idx + needle.length;
      content = content.slice(0, insertAt) + `"reelUrl":"${url}",` + content.slice(insertAt);
      cityAdded++;
      totalAdded++;
      break;
    }
    if (!found) {
      console.warn(`${cityKey} id ${id}: NOT FOUND`);
      totalNotFound++;
    }
  }
  if (cityAdded) console.log(`${cityKey}: +${cityAdded}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nDone: ${totalAdded} added, ${totalSkipped} already set, ${totalNotFound} not found.`);
