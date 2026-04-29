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
  SF: {
    5001: 'https://www.tiktok.com/@infatuation_sf/video/7375327968400297259',  // Quince
    5002: 'https://www.tiktok.com/@infatuation_sf/video/7261725856169463082',  // Lazy Bear
    5003: 'https://www.tiktok.com/@highspeeddining/video/7040503862163459375',  // Birdsong
    5004: 'https://www.tiktok.com/@highspeeddining/video/7312232308319407406',  // Angler
    5005: 'https://www.tiktok.com/@highspeeddining/video/7313320562414210346',  // Kokkari Estiatorio
    5006: 'https://www.tiktok.com/@thefirstdatedude/video/7470224872271236398',  // Foreign Cinema
    5007: 'https://www.tiktok.com/@celinerrzz/video/7223238689269337387',  // Flour + Water
    5008: 'https://www.tiktok.com/@celinerrzz/video/7421764618076425502',  // Che Fico
    5009: 'https://www.tiktok.com/@eatwithseth/video/7225039605437877550',  // Bar Crenn
    5010: 'https://www.tiktok.com/@highspeeddining/video/7311852426938551594',  // Cotogna
    5011: 'https://www.tiktok.com/@chumperjreats/video/7263513602873888046',  // Rintaro
    5012: 'https://www.tiktok.com/@highspeeddining/video/7042020674105560366',  // Spruce
    5015: 'https://www.tiktok.com/@the.weekend.abroad/video/7518608827772652855',  // Wayfare Tavern
    5016: 'https://www.tiktok.com/@austin.klar/video/7445436390810340654',  // Park Tavern
    5017: 'https://www.tiktok.com/@chumperjreats/video/7126589163071147310',  // Ernest
    5018: 'https://www.tiktok.com/@loganraehill/video/7128496041220918571',  // La Mar Cebicheria
    5019: 'https://www.tiktok.com/@sfstandard/video/7299488057248714030',  // Dalida
    5020: 'https://www.tiktok.com/@millie.lai/video/7436105789078539551',  // Lolinda
    5021: 'https://www.tiktok.com/@janiedevours/video/7439103363507146026',  // Nari
    5023: 'https://www.tiktok.com/@fashionbyally/video/7279221415625116970',  // Bar Sprezzatura
    5025: 'https://www.tiktok.com/@miriamhershman/video/7349365322551495978',  // Piccino
    5026: 'https://www.tiktok.com/@emilyinnew.york/video/7222851736866917678',  // Penny Roma
    5027: 'https://www.tiktok.com/@jacksdiningroom/video/7197925503171398955',  // Waterbar
    5029: 'https://www.tiktok.com/@andrewtourssf/video/7292446147703033131',  // Chotto Matte
    5031: 'https://www.tiktok.com/@infatuation_sf/video/7449552114977623327',  // Tiya
    5033: 'https://www.tiktok.com/@andrewtourssf/video/7250212250634505515',  // Arcana
    5034: 'https://www.tiktok.com/@laurenwickham/video/7363824786037837086',  // Itria
    5035: 'https://www.tiktok.com/@sutonashari/video/7204901185030016302',  // Ungrafted
    5036: 'https://www.tiktok.com/@travelwithtraut/video/7129544038520261931',  // Sorrel
    5037: 'https://www.tiktok.com/@harborviewsf/video/7262459657044708651',  // Harborview
    5038: 'https://www.tiktok.com/@sherryeatworld/video/7341257387224911135',  // Niku Steakhouse
    5039: 'https://www.tiktok.com/@allie.eats/video/6989023967570955525',  // Fang
    5040: 'https://www.tiktok.com/@charweeezy/video/7232446720787909931',  // Izzy's Steakhouse
    5041: 'https://www.tiktok.com/@sherryeatworld/video/7326786472076610862',  // ABV
    5044: 'https://www.tiktok.com/@unionsquaresf_/video/7256890727135710506',  // Pacific Cocktail Haven
    5046: 'https://www.tiktok.com/@onlyinsf/video/7332649930747645215',  // The Alembic
    5047: 'https://www.tiktok.com/@sherryeatworld/video/7304135767968812318',  // The Progress
    5048: 'https://www.tiktok.com/@yourglobalfoodiebff/video/7538654243868265759',  // Sohn
    5049: 'https://www.tiktok.com/@danielluriesf/video/7560776174260047135',  // Via Aurelia
    5050: 'https://www.tiktok.com/@sipwithash/video/7233271468841405742',  // Smuggler's Cove
    5051: 'https://www.tiktok.com/@whimsysoul/video/7322225632946048299',  // Bourbon & Branch
    5052: 'https://www.tiktok.com/@sipnsavorsd/video/7255058989891767595',  // Pagan Idol
    5053: 'https://www.tiktok.com/@heatherr.eats/video/7429378804738542879',  // Local Edition
    5054: 'https://www.tiktok.com/@janiedevours/video/7437798124401331502',  // Tonga Room & Hurricane Bar
    5055: 'https://www.tiktok.com/@12darialove/video/7250303778904231210',  // The Buena Vista Cafe
    5056: 'https://www.tiktok.com/@kimmconn/video/7269058164904037634',  // Vesuvio Cafe
    5058: 'https://www.tiktok.com/@katwalksf/video/7343870636881677611',  // Li Po Cocktail Lounge
    5060: 'https://www.tiktok.com/@andrewtourssf/video/7398626230649638187',  // Cold Drinks Bar at China Live
    5062: 'https://www.tiktok.com/@blackfoodietravelguy/video/7227892242214669611',  // Last Rites
    5065: 'https://www.tiktok.com/@girlies_in_sf/video/7355920259318041899',  // Tartine Manufactory
    5066: 'https://www.tiktok.com/@mattandomar/video/7526667881187167518',  // Verjus
    5067: 'https://www.tiktok.com/@melindasheckells/video/7332174736119680298',  // Starlite
    5068: 'https://www.tiktok.com/@sfburneraccount/video/7581359413571669303',  // Zam Zam
    5070: 'https://www.tiktok.com/@thefirstdatedude/video/7261981289421770030',  // Cavaña
    5072: 'https://www.tiktok.com/@sideofstef/video/7353777522967956779',  // Causwells
    5073: 'https://www.tiktok.com/@jessevicario/video/7373000018355096878',  // Novela
    5075: 'https://www.tiktok.com/@snackateriansf/video/7293546783962074411',  // Anchor Oyster Bar
    5076: 'https://www.tiktok.com/@andrewtourssf/video/7288845611934240030',  // Starbelly
    5078: 'https://www.tiktok.com/@luiscarloszara/video/7572705063299271967',  // Zuni Café
    5079: 'https://www.tiktok.com/@robcwillis/video/7103731270286314798',  // Rich Table
    5081: 'https://www.tiktok.com/@absinthe.sf/video/7575951423548951822',  // Absinthe Brasserie & Bar
    5082: 'https://www.tiktok.com/@hungere.for.diy/video/7379865998482099499',  // Burma Superstar
    5083: 'https://www.tiktok.com/@oneminreviews/video/7600929471549410590',  // Pizzetta 211
    5085: 'https://www.tiktok.com/@yourglobalfoodiebff/video/7479601979946323231',  // Chapeau!
    5087: 'https://www.tiktok.com/@sophiaxwhatever/video/7420663445852359982',  // Acquerello
    5088: 'https://www.tiktok.com/@ricklox/video/7311942740374293803',  // Swan Oyster Depot
    5089: 'https://www.tiktok.com/@highspeeddining/video/7316304750377487658',  // Gary Danko
    5091: 'https://www.tiktok.com/@noevalleybakery/video/7106930210171571502',  // Noe Valley Bakery
    5093: 'https://www.tiktok.com/@robcwillis/video/7087770256965373227',  // The Front Porch
    5094: 'https://www.tiktok.com/@ashyizzle/video/7026818434860190981',  // Prubechu
    5095: 'https://www.tiktok.com/@highspeeddining/video/7317424061519318314',  // Atelier Crenn
    5096: 'https://www.tiktok.com/@andreweatsinsf/video/7379758349488819499',  // State Bird Provisions
    5099: 'https://www.tiktok.com/@laurenwickham/video/7336278281336999198',  // A16
    5101: 'https://www.tiktok.com/@carbdashians_sf/video/7324170741002423594',  // Bix
    5102: 'https://www.tiktok.com/@allie.eats/video/7501030128005172522',  // Yank Sing
    5103: 'https://www.tiktok.com/@yourglobalfoodiebff/video/7441979128288480558',  // Z & Y Restaurant
    5105: 'https://www.tiktok.com/@itssaramorgan/video/7472986470853250347',  // Delfina
    5106: 'https://www.tiktok.com/@realphdfoodie/video/7439898245914053931',  // Chez Maman
    5112: 'https://www.tiktok.com/@highspeeddining/video/7312616652393385262',  // Saison
    5113: 'https://www.tiktok.com/@sherryeatworld/video/7528202337827998990',  // Benu
    5114: 'https://www.tiktok.com/@ligier/video/7214249599303830826',  // Sons & Daughters
    5115: 'https://www.tiktok.com/@coffee.finds/video/7348707460430990635',  // The Interval at Long Now
    5116: 'https://www.tiktok.com/@hogislandoysterco/video/7492258785088572714',  // Hog Island Oyster Co.
    5117: 'https://www.tiktok.com/@marufukuramen/video/7607477955018689805',  // Marufuku Ramen
    5118: 'https://www.tiktok.com/@cynthiamhuang/video/7124456741118577966',  // Octavia
    5120: 'https://www.tiktok.com/@fkachef/video/7098844551124651306',  // Frascati
    5121: 'https://www.tiktok.com/@sophiaxwhatever/video/7143805930566618411',  // Perbacco
    5122: 'https://www.tiktok.com/@fashionbyally/video/7234727751754943790',  // Pabu Izakaya
    5123: 'https://www.tiktok.com/@food.with.karm/video/7240312744602324270',  // Saigon Sandwich
    5126: 'https://www.tiktok.com/@andreweatsinsf/video/7535966488461724942',  // Beretta
    5127: 'https://www.tiktok.com/@onlyinsf/video/7315150754753432875',  // Dandelion Chocolate
    5128: 'https://www.tiktok.com/@millie.lai/video/7436842411546004766',  // Craftsman and Wolves
    5129: 'https://www.tiktok.com/@eatingwithrobert/video/7343003211365698848',  // Taqueria Cancun
    5130: 'https://www.tiktok.com/@shirleyluong/video/7432822461839707422',  // Saru Sushi Bar
    5131: 'https://www.tiktok.com/@marincountyvegan/video/7307301211298876715',  // Wildseed
    5132: 'https://www.tiktok.com/@roam_burgers/video/7122899815922437418',  // Roam Artisan Burgers
    5133: 'https://www.tiktok.com/@jackiewirt/video/7492128114659691807',  // Trestle
    5134: 'https://www.tiktok.com/@allie.eats/video/7221688219824327979',  // Fiorella
    5135: 'https://www.tiktok.com/@infatuation_sf/video/7341217819952024874',  // Noodle in a Haystack
    5137: 'https://www.tiktok.com/@iamchristymac/video/7524785846403304717',  // Thanh Long
    5139: 'https://www.tiktok.com/@infatuation_sf/video/7320414422038531359',  // San Tung
    5140: 'https://www.tiktok.com/@charweeezy/video/7104847904933743915',  // Dragon Beaux
    5141: 'https://www.tiktok.com/@foodwithmichel/video/7130080133880237354',  // PPQ Dungeness Island
    5143: 'https://www.tiktok.com/@fashionbyally/video/7522503215280033038',  // 7 Adams
    5144: 'https://www.tiktok.com/@nikandsarina/video/7560450336863866143',  // Bourbon Steak
    5146: 'https://www.tiktok.com/@tundemodupee/video/7277614050660617518',  // The Vault Garden
    5147: 'https://www.tiktok.com/@sherryeatworld/video/7298214805544897834',  // La Connessa
    5148: 'https://www.tiktok.com/@tablesidepizza/video/7298111835885309230',  // Flour + Water Pizzeria
    5149: 'https://www.tiktok.com/@infatuation_sf/video/7277731905078824234',  // Flour + Water Pasta Shop
    5150: 'https://www.tiktok.com/@citygirlatm/video/7436987775519411499',  // Morella
    5153: 'https://www.tiktok.com/@charweeezy/video/7242466702921846058',  // International Smoke
    5155: 'https://www.tiktok.com/@citygirlatm/video/7438846056760298798',  // Local Edition
    5156: 'https://www.tiktok.com/@andreweatsinsf/video/7338143525063773471',  // The Pawn Shop
    5157: 'https://www.tiktok.com/@booziebrunch/video/7501361485843631403',  // Rise Over Run
    5158: 'https://www.tiktok.com/@eileenis/video/7457675803908803886',  // Flores
    5159: 'https://www.tiktok.com/@andrewtourssf/video/7320676178858118443',  // Left Door
    5164: 'https://www.tiktok.com/@infatuation_sf/video/7361234883852635423',  // Bar Jambroni
  },
  SANANTONIO: {
    6001: 'https://www.tiktok.com/@rosamariasmith/video/7515224295166184750',  // Mixtli
    6002: 'https://www.tiktok.com/@visitsanantonio/video/7242771937947143467',  // 2M Smokehouse
    6004: 'https://www.tiktok.com/@bollywoodnand27/video/7205662051577089326',  // Botika
    6006: 'https://www.tiktok.com/@arnietex/video/7264227026200972590',  // Mi Tierra Cafe & Bakery
    6007: 'https://www.tiktok.com/@eatmigos/video/7270273180504329518',  // La Gloria
    6008: 'https://www.tiktok.com/@sanantoniofoodie/video/7160370499871132971',  // Southerleigh Fine Food & Brewery
    6009: 'https://www.tiktok.com/@esquiretavernsa/video/7179652177294658858',  // The Esquire Tavern
    6012: 'https://www.tiktok.com/@tristacastillo/video/7205946616380034350',  // Battalion
    6014: 'https://www.tiktok.com/@satxhealthyfoodie/video/7239415409525525806',  // Best Quality Daughter
    6015: 'https://www.tiktok.com/@sanantoniofoodie/video/7260157264592686382',  // Sangria on the Burg
    6016: 'https://www.tiktok.com/@treyschowdown/video/7233763557370793258',  // 2Bros BBQ Market
    6017: 'https://www.tiktok.com/@fiestybtclassy/video/7227068712489176363',  // Biga on the Banks
    6018: 'https://www.tiktok.com/@sanantoniofoodie/video/7436866348036181278',  // Bliss
    6019: 'https://www.tiktok.com/@moysayzeats/video/7069573184374197547',  // Dough Pizzeria Napoletana
    6021: 'https://www.tiktok.com/@1blessedjourney/video/7218014232598662442',  // Silo Elevated Cuisine
    6023: 'https://www.tiktok.com/@historicpearl/video/7151892557478481198',  // Supper at Hotel Emma
    6025: 'https://www.tiktok.com/@satxhealthyfoodie/video/7229720582470880554',  // Paloma Blanca
    6029: 'https://www.tiktok.com/@sanantoniofoodie/video/7408686635036052779',  // Curry Boys BBQ
    6031: 'https://www.tiktok.com/@sanantoniofoodie/video/7198273504972934446',  // Rosario's Mexican Cafe y Cantina
    6032: 'https://www.tiktok.com/@thefoodiewithabooty/video/7467760878293650731',  // Southerleigh Haute South
    6033: 'https://www.tiktok.com/@faithroberts210/video/7286273383560482090',  // Ocho at Hotel Havana
    6034: 'https://www.tiktok.com/@california_texan/video/7447378012053703982',  // Sternewirth at Hotel Emma
    6035: 'https://www.tiktok.com/@lonestarlatina/video/7496312468378012974',  // Two Bros BBQ Market
    6037: 'https://www.tiktok.com/@sanantoniofoodie/video/7462530623144643886',  // Toro Kitchen + Bar
    6038: 'https://www.tiktok.com/@lapanaderia1/video/7472799839328259371',  // La Panaderia
    6041: 'https://www.tiktok.com/@leslieemzz/video/7340683828475759903',  // Burgerteca
    6044: 'https://www.tiktok.com/@sanantoniofoodie/video/7484365138674388255',  // Carnitas Lonja
    6050: 'https://www.tiktok.com/@thetacotackler/video/7302446295527050538',  // Garcia's Mexican Food
    6052: 'https://www.tiktok.com/@visitsanantonio/video/7283722025300921631',  // Boudro's on the Riverwalk
    6064: 'https://www.tiktok.com/@hbic_favfinds/video/7544492232787742007',  // Cured at Pearl
    6065: 'https://www.tiktok.com/@chefkelsey/video/7155532561433906475',  // Boiler House Texas Grill & Wine Garden
    6067: 'https://www.tiktok.com/@satxhealthyfoodie/video/7248636255037115694',  // Down on Grayson at Pearl
    6068: 'https://www.tiktok.com/@sanantoniofoodie/video/7273925151912250667',  // Cappy's Restaurant
    6069: 'https://www.tiktok.com/@sanantoniofoodie/video/6905059432690928901',  // Paloma Blanca Mexican Cuisine
    6074: 'https://www.tiktok.com/@eldereats/video/7211289209586404650',  // Sam's Burger Joint
    6077: 'https://www.tiktok.com/@loulous.cocina/video/7147455255112895790',  // Magnolia Pancake Haus
    6079: 'https://www.tiktok.com/@nayahnatre/video/7248417345402768686',  // La Fogata
    6080: 'https://www.tiktok.com/@robbyctv/video/6960065274028494085',  // The County Line BBQ
    6082: 'https://www.tiktok.com/@sanantoniofoodie/video/7382644470673575211',  // Aldaco's Mexican Cuisine
    6084: 'https://www.tiktok.com/@sanantoniofoodie/video/7094754539345120558',  // Dashi Sichuan Kitchen + Bar
    6085: 'https://www.tiktok.com/@satexasfoodies/video/7194610064957721899',  // Piatti Ristorante & Bar
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
