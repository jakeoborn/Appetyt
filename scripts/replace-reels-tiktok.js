#!/usr/bin/env node
// Replace all YouTube URLs in reels arrays with TikTok URLs.
// Step 1: Strip all YouTube reels (clear to []).
// Step 2: Inject confirmed TikTok URLs per city/id.
// Restaurants with no confirmed TikTok URL are left with an empty reels array.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const cityReels = {
  NYC: {
    1001: 'https://www.tiktok.com/@highspeeddining/video/7076840327755140398',  // Le Bernardin
    1002: 'https://www.tiktok.com/@theviplist/video/7546758886724848926',  // Eleven Madison Park
    1003: 'https://www.tiktok.com/@jacksdiningroom/video/7559328484540140855',  // Peter Luger
    1004: 'https://www.tiktok.com/@docueatery/video/7002258965061061894',  // Carbone
    1005: 'https://www.tiktok.com/@king_kb_1998/video/7598712945798843679',  // Via Carota
    1006: 'https://www.tiktok.com/@beli_eats/video/7173075524779003182',  // I Sodi
    1007: 'https://www.tiktok.com/@newyorkturk/video/7587842328501488926',  // Balthazar
    1008: 'https://www.tiktok.com/@mattjames9191/video/7232058140684995882',  // Lilia
    1009: 'https://www.tiktok.com/@im.busy.eating/video/7060823368265698606',  // Don Angie
    1010: 'https://www.tiktok.com/@jacksdiningroom/video/7343375235887942954',  // Katz's Delicatessen
    1012: 'https://www.tiktok.com/@infatuation_nyc/video/7244215938986560814',  // Tatiana
    1013: 'https://www.tiktok.com/@itisjor/video/7068348898842070319',  // Crown Shy
    1014: 'https://www.tiktok.com/@kaitlyneats/video/7633088830655991071',  // Atomix
    1015: 'https://www.tiktok.com/@jacksdiningroom/video/7392340662324055342',  // 4 Charles Prime Rib
    1016: 'https://www.tiktok.com/@eater/video/7164817737892498731',  // Di An Di
    1033: 'https://www.tiktok.com/@thesushiguide/video/7429759214471449886',  // Sushi Sho
    1018: 'https://www.tiktok.com/@russanddaughters/video/7524434247617219853',  // Russ & Daughters
    1019: 'https://www.tiktok.com/@thehorsespurse/video/6878463529037417734',  // Dante
    1020: 'https://www.tiktok.com/@luiscarloszara/video/7139343040703040814',  // Le Coucou
    1021: 'https://www.tiktok.com/@theviplist/video/7168949168432549162',  // Sushi Nakazawa
    1022: 'https://www.tiktok.com/@kaitlyneats/video/7600574119473679629',  // Gramercy Tavern
    1023: 'https://www.tiktok.com/@kaitlyneats/video/7450969423155858711',  // Gage & Tollner
    1024: 'https://www.tiktok.com/@stoolpresidente/video/7116254836966034734',  // Lucali
    1027: 'https://www.tiktok.com/@beli_eats/video/7156762355936972078',  // Cosme
    1028: 'https://www.tiktok.com/@mutammara/video/7391499813679811886',  // Dhamaka
    1030: 'https://www.tiktok.com/@hayleemichalski/video/7342570908831305003',  // Olmsted
    1031: 'https://www.tiktok.com/@mister.lewis/video/7555348426058255646',  // Per Se
    1032: 'https://www.tiktok.com/@highspeeddining/video/7035660349940600111',  // Jungsik
    1034: 'https://www.tiktok.com/@eater/video/7082780004467264814',  // Gabriel Kreuther
    1035: 'https://www.tiktok.com/@highspeeddining/video/7262151983480524075',  // Daniel
    1036: 'https://www.tiktok.com/@jacksdiningroom/video/7375999619311881515',  // Torrisi
    1037: 'https://www.tiktok.com/@infatuation_nyc/video/7633813853578530061',  // COTE Korean Steakhouse
    1038: 'https://www.tiktok.com/@theviplist/video/6870966678730116358',  // Estela
    1039: 'https://www.tiktok.com/@jacksdiningroom/video/7449863305755118891',  // Semma
    1136: 'https://www.tiktok.com/@jacksdiningroom/video/7460266968269049131',  // Una Pizza Napoletana
    1172: 'https://www.tiktok.com/@sheneedsasnack/video/7211885840363179310',  // Sushi Noz
    1173: 'https://www.tiktok.com/@eater/video/7001122862849363205',  // Jean-Georges
    1174: 'https://www.tiktok.com/@highspeeddining/video/7549933052403748109',  // Masa
    1177: 'https://www.tiktok.com/@highspeeddining/video/7544762135725870349',  // Chef's Table at Brooklyn Fare
    1180: 'https://www.tiktok.com/@docueatery/video/7009042148179971333',  // Aska
    1182: 'https://www.tiktok.com/@rzavvv/video/7579384952362405151',  // Saga
    1276: 'https://www.tiktok.com/@jacksdiningroom/video/7473260544183618862',  // Golden Diner
    1328: 'https://www.tiktok.com/@jacksdiningroom/video/7373789333762985259',  // Charles Pan-Fried Chicken
    1453: 'https://www.tiktok.com/@jacksdiningroom/video/7421668535321005358',  // Hawksmoor
  },
  DALLAS: {
    14:  'https://www.tiktok.com/@blondeswhoeat/video/7238006235751075118',  // Cattleack Barbeque
    20:  'https://www.tiktok.com/@blondeswhoeat/video/7552997420053941535',  // Mamani
    32:  'https://www.tiktok.com/@hebaahmaddd/video/7436955229389835566',  // Nobu Dallas
    49:  'https://www.tiktok.com/@ricklox/video/7049172732604353798',  // Nick & Sam's Steakhouse
    57:  'https://www.tiktok.com/@jacksdiningroom/video/7421310696958233898',  // Pecan Lodge
    84:  'https://www.tiktok.com/@keith_lee125/video/7453714374478286126',  // Wicked Butcher
    86:  'https://www.tiktok.com/@georgie.dallas/video/7363986396920515883',  // Georgie Dallas
    148: 'https://www.tiktok.com/@jananayfeh/video/7458085476331769118',  // Mister Charles
    205: 'https://www.tiktok.com/@kevinsbbqjoints/video/7556990197066419487',  // The Slow Bone
    289: 'https://www.tiktok.com/@skylarindallas/video/7518466133771570463',  // Sadelle's Dallas
    304: 'https://www.tiktok.com/@darcymcqueenyyy/video/7431680700119731502',  // Carbone Dallas
    462: 'https://www.tiktok.com/@jacksdiningroom/video/7296979159283158315',  // Terry Black's Barbecue
  },
  CHICAGO: {
    1:     'https://www.tiktok.com/@highspeeddining/video/7061667136975949103',  // Alinea
    2:     'https://www.tiktok.com/@highspeeddining/video/7081414011400637742',  // Smyth
    4:     'https://www.tiktok.com/@highspeeddining/video/7058425771353869614',  // Oriole
    5:     'https://www.tiktok.com/@jacobdoesphilly/video/7382956437309279519',  // Girl & the Goat
    7:     'https://www.tiktok.com/@hellomynameisgabriel/video/7289111409772776746',  // Kasama
    12:    'https://www.tiktok.com/@markwiens/video/7419899166173809921',  // Pequod's Pizza
    20:    'https://www.tiktok.com/@highspeeddining/video/7076103095092055339',  // Au Cheval
    21:    'https://www.tiktok.com/@bbillnes/video/7603156711083396366',  // Frontera Grill
    22:    'https://www.tiktok.com/@alishaalejandra/video/7579290222333021454',  // Bavette's Bar & Boeuf
    36:    'https://www.tiktok.com/@joeparyseats/video/7566778718639672584',  // Maple & Ash
    48:    'https://www.tiktok.com/@markwiens/video/7293879662302743814',  // Johnnie's Beef
    49:    'https://www.tiktok.com/@choosechicago/video/7358871923645893930',  // Birrieria Zaragoza
    63:    'https://www.tiktok.com/@itskellygomez/video/7611735482711411982',  // Indienne
    65:    'https://www.tiktok.com/@foodwithibrahim/video/7563389199236336951',  // Boka Restaurant
    68:    'https://www.tiktok.com/@largebarstool/video/7577109994315795742',  // Momotaro
    69:    'https://www.tiktok.com/@kimmnowak/video/7493182725529275694',  // J.P. Graziano
    122:   'https://www.tiktok.com/@visualsbyjack/video/6944177304214064390',  // Tzuco
    135:   'https://www.tiktok.com/@highspeeddining/video/7066131575834086703',  // North Pond
    152:   'https://www.tiktok.com/@highspeeddining/video/7076552149760478507',  // Next Chicago
    154:   'https://www.tiktok.com/@foodgressing/video/7296204575369956613',  // Mako Chicago
    155:   'https://www.tiktok.com/@eater/video/7428676060985773354',  // Esmé Chicago
    255:   'https://www.tiktok.com/@stoolpresidente/video/7486260681612873003',  // Pizz'Amici
    12538: 'https://www.tiktok.com/@highspeeddining/video/7057980742336564527',  // Ever
  },
  LA: {
    2003: 'https://www.tiktok.com/@icedmatchamia/video/7513284683950476575',  // n/naka
    2004: 'https://www.tiktok.com/@highspeeddining/video/7450184482428177706',  // Providence
    2005: 'https://www.tiktok.com/@elisolanotravels/video/7214138257024552235',  // Republique
    2006: 'https://www.tiktok.com/@ricklox/video/6874344572873379078',  // Spago Beverly Hills
    2025: 'https://www.tiktok.com/@jacksdiningroom/video/7338196268197399854',  // Majordomo
    2026: 'https://www.tiktok.com/@jack.goldburg/video/7626842609884925215',  // Osteria Mozza
    2027: 'https://www.tiktok.com/@saintpaulw.pa/video/7297503574618049797',  // Sushi Park
    2030: 'https://www.tiktok.com/@jeremyjacobowitz/video/7558584162706410807',  // Horses
    2033: 'https://www.tiktok.com/@how.kev.eats/video/7492922309368352042',  // Anajak Thai
    2051: 'https://www.tiktok.com/@eatmorestars/video/7623946199145450766',  // Restaurant Ki
    2056: 'https://www.tiktok.com/@reinamorales1212/video/7539371463799786765',  // Holbox
    2072: 'https://www.tiktok.com/@chasing_michelins/video/7617534632032013582',  // Lielle
    2088: 'https://www.tiktok.com/@snackeatingsnacks/video/7443896518093901086',  // Chi Spacca
    2089: 'https://www.tiktok.com/@highspeeddining/video/7453216966392728875',  // Camphor
    2127: 'https://www.tiktok.com/@highspeeddining/video/7454691320708222254',  // Somni
    2128: 'https://www.tiktok.com/@hellojujulou/video/6957130227180948742',  // Hayato
    2129: 'https://www.tiktok.com/@dancychun/video/7529740389960453384',  // Mélisse
    2130: 'https://www.tiktok.com/@highspeeddining/video/7452347427186593070',  // Vespertine
    2132: 'https://www.tiktok.com/@highspeeddining/video/7448039970847264046',  // Sushi Kaneyoshi
    2134: 'https://www.tiktok.com/@highspeeddining/video/7611298185155267853',  // Kato
    2247: 'https://www.tiktok.com/@jacksdiningroom/video/7425737448140852523',  // Langer's Delicatessen
    2360: 'https://www.tiktok.com/@sayehsoltani/video/7383852784912878894',  // Mother Wolf
    2224: 'https://www.tiktok.com/@jitlada_la/video/7480837716112985374',  // Jitlada
    2337: 'https://www.tiktok.com/@vibewithchu/video/7185183639284534571',  // Howlin' Ray's
    2341: 'https://www.tiktok.com/@infatuation_la/video/7277307493380902187',  // Funke
    2364: 'https://www.tiktok.com/@wolfgangpuck/video/7056881155462925615',  // CUT by Wolfgang Puck
    2448: 'https://www.tiktok.com/@jacksdiningroom/video/7394946108004306222',  // Eggslut
    2474: 'https://www.tiktok.com/@sergelato/video/6965638410606316806',  // Matsuhisa
    2534: 'https://www.tiktok.com/@lisaeatsla/video/7489691745261948206',  // Mírate
  },
  AUSTIN: {
    5001: 'https://www.tiktok.com/@eatingwithtod/video/7433411227826638113',  // Franklin Barbecue
    5004: 'https://www.tiktok.com/@catherine_lockhart/video/7118091716099444010',  // Odd Duck
    5008: 'https://www.tiktok.com/@earningearth/video/7585710874673810719',  // la Barbecue
    5011: 'https://www.tiktok.com/@arnietex/video/7324490673749495083',  // Nixta Taqueria
    5013: 'https://www.tiktok.com/@phatvick/video/7432748010292923690',  // Kemuri Tatsu-ya
    5018: 'https://www.tiktok.com/@behindthefoodtv/video/7558835628574543117',  // Valentina's Tex Mex BBQ
    5022: 'https://www.tiktok.com/@luiscarloszara/video/7159314072876371246',  // Hestia
    5026: 'https://www.tiktok.com/@thehungrylonghorn/video/7576473561896996127',  // Barley Swine
    5032: 'https://www.tiktok.com/@512bites/video/7438358642568498478',  // Craft Omakase
    5033: 'https://www.tiktok.com/@waynedang/video/7280623636367576363',  // InterStellar BBQ
    5035: 'https://www.tiktok.com/@briancantstopeating/video/7551222106466422029',  // Canje
    5038: 'https://www.tiktok.com/@feedmi/video/7235818380660493614',  // Red Ash
    5039: 'https://www.tiktok.com/@ttaylorolsen/video/7565970774314569015',  // Veracruz All Natural
    5044: 'https://www.tiktok.com/@atxjulsey/video/7487035114405268779',  // Parish Barbecue
    5056: 'https://www.tiktok.com/@chefsivo/video/7477683041096273174',  // LeRoy & Lewis
    5057: 'https://www.tiktok.com/@soulfulbitesatx/video/7276189823180868906',  // Distant Relatives
    5059: 'https://www.tiktok.com/@shelbysorrel/video/7293949937799187758',  // Midnight Cowboy
    5064: 'https://www.tiktok.com/@jesterkingbrewery/video/7483211129771134238',  // Jester King Brewery
    5087: 'https://www.tiktok.com/@atxjulsey/video/7466997275433192750',  // Stiles Switch BBQ
    5163: 'https://www.tiktok.com/@kevinsbbqjoints/video/7571524434985553182',  // Kreuz Market
    5465: 'https://www.tiktok.com/@512bites/video/7171942462783704366',  // Este
  },
  HOUSTON: {
    7001: 'https://www.tiktok.com/@highspeeddining/video/7370296410148703531',  // March
    7002: 'https://www.tiktok.com/@jesus.aguilar.12/video/7630168752159526158',  // Tatemó
    7003: 'https://www.tiktok.com/@houstondiariestx/video/7628030693343481119',  // Le Jardinier Houston
    7005: 'https://www.tiktok.com/@aminasesthetic/video/7439881653700562222',  // Musaafer
    7006: 'https://www.tiktok.com/@waynedang/video/7570874223179074846',  // Corkscrew BBQ
    7007: 'https://www.tiktok.com/@soyelarturito/video/7455013387873914118',  // Truth BBQ
    7009: 'https://www.tiktok.com/@highspeeddining/video/7375552261994384683',  // Nancy's Hustle
    7010: 'https://www.tiktok.com/@highspeeddining/video/7334035239976586538',  // Uchi Houston
    7011: 'https://www.tiktok.com/@nickiemousee/video/7613554382067584287',  // Crawfish & Noodles
    7014: 'https://www.tiktok.com/@highspeeddining/video/7379580768382815534',  // Theodore Rex
    7015: 'https://www.tiktok.com/@htownres/video/7536770785592020255',  // Xochi
    7016: 'https://www.tiktok.com/@waynedang/video/7595732540648901919',  // Pappas Bros. Steakhouse
    7018: 'https://www.tiktok.com/@mr.chimetime/video/7250571076789423402',  // Blood Bros. BBQ
    7022: 'https://www.tiktok.com/@soyelarturito/video/7456499998440656134',  // Pinkerton's Barbecue
    7023: 'https://www.tiktok.com/@maggiesdigidiary/video/7521818821330488607',  // Coltivare
    7024: 'https://www.tiktok.com/@ericeats/video/7475776719475969322',  // Loro Houston
    7027: 'https://www.tiktok.com/@waynedang/video/7595359257868897567',  // Killen's BBQ
    7028: 'https://www.tiktok.com/@keith_lee125/video/7306290763636296990',  // The Breakfast Klub
    7036: 'https://www.tiktok.com/@shawnthefoodsheep/video/7495936691174231327',  // Nobie's
    7041: 'https://www.tiktok.com/@waynedang/video/7609770017604832542',  // Himalaya
    7118: 'https://www.tiktok.com/@shawnthefoodsheep/video/7568568647908691230',  // ChòpnBlọk
    7017: 'https://www.tiktok.com/@shawnthefoodsheep/video/7449540952185720094',  // Street to Kitchen
    7149: 'https://www.tiktok.com/@shawnthefoodsheep/video/7452037171642420511',  // Bludorn
    7161: 'https://www.tiktok.com/@shawnthefoodsheep/video/7463515995768999199',  // Belly of the Beast
    7407: 'https://www.tiktok.com/@houstonbucketlist/video/7188171685135191342',  // Bandista
  },
};

// Step 1: Strip all YouTube URLs from reels arrays
const beforeStrip = (content.match(/"reels":\[[^\]]*youtube[^\]]*\]/g) || []).length;
content = content.replace(/"reels":\[[^\]]*youtube[^\]]*\]/g, '"reels":[]');
console.log(`Stripped ${beforeStrip} YouTube reels arrays`);

// Find the byte range of a city's data array
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

// Step 2: Inject TikTok URLs
let totalAdded = 0, totalSkipped = 0, totalNotFound = 0;

for (const [cityKey, reelUrls] of Object.entries(cityReels)) {
  let cityAdded = 0;
  for (const [id, url] of Object.entries(reelUrls)) {
    const bounds = getCityBounds(cityKey);
    if (!bounds) { console.warn(`${cityKey}: array not found`); break; }

    const needle = `"id":${id},`;
    let pos = bounds.start;
    let found = false;
    while (pos < bounds.end) {
      const idx = content.indexOf(needle, pos);
      if (idx === -1 || idx > bounds.end) break;
      found = true;
      const win = content.slice(idx, idx + 1000);

      if (win.includes(url)) { totalSkipped++; break; }

      const reelsStart = win.indexOf('"reels":[');
      if (reelsStart !== -1) {
        const absStart = idx + reelsStart + '"reels":['.length;
        let depth2 = 1, j = absStart;
        while (j < content.length && depth2 > 0) {
          if (content[j] === '[') depth2++;
          else if (content[j] === ']') depth2--;
          j++;
        }
        const closeIdx = j - 1;
        const existingContent = content.slice(absStart, closeIdx).trim();
        const toInsert = existingContent === '' ? `"${url}"` : `,"${url}"`;
        content = content.slice(0, closeIdx) + toInsert + content.slice(closeIdx);
        cityAdded++; totalAdded++;
        break;
      }

      // No reels field yet — insert new array
      const insertAt = idx + needle.length;
      content = content.slice(0, insertAt) + `"reels":["${url}"],` + content.slice(insertAt);
      cityAdded++; totalAdded++;
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
