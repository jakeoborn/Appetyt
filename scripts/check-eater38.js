'use strict';
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function getData(city) {
  const pat = 'const ' + city + '_DATA\\s*=\\s*\\[';
  const m = html.match(new RegExp(pat));
  const s = m.index + m[0].length;
  let d=1, p=s;
  while (p < html.length && d > 0) {
    if (html[p] === '[') d++;
    else if (html[p] === ']') d--;
    p++;
  }
  return eval('[' + html.slice(s, p-1) + ']');
}

function norm(s) {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')     // strip accent combining chars
    .replace(/['''‘’]/g, '')   // strip apostrophes (don't keep them)
    .replace(/&/g, 'and')               // & → and
    .replace(/\s+/g, ' ')               // collapse whitespace
    .trim();
}

function check(city, list) {
  const data = getData(city);
  const names = data.map(r => norm(r.name));
  const maxId = Math.max(...data.map(r => r.id));
  const missing = list.filter(n => {
    const k = norm(n);
    const words = k.split(/\s+/).filter(w => w.length > 3);
    return !names.some(x => words.slice(0, 2).every(w => x.includes(w)));
  });
  console.log(city + ' maxId:' + maxId + ' | missing ' + missing.length + '/' + list.length);
  if (missing.length) console.log('  ' + missing.join('\n  '));
}

const nyc = ['La Pirana Lechonera','Charles Pan-Fried Chicken','Noz Market','Cafe Commerce','Abuqir','Le Veau dOr','Gallaghers Steakhouse','Le Bernardin','Sky Pavilion','Grand Central Oyster Bar','Nepali Bhanchha Ghar','Hyderabadi Zaiqa','Zaab Zaab','Borgo','Chama Mama','Via Carota','Claud','Hamburger America','Adda','Superiority Burger','Kabawa','Balthazar','Carnitas Ramirez','Una Pizza Napoletana','File Gumbo Bar','Lilia','Mam','Lei','Sunns','Ernestos','The Four Horsemen','Golden Diner','LIndustrie Pizzeria','Rolos','Al Badawi','Red Hook Tavern','Bong'];
const dallas = ['The Chumley House','61 Osteria','Walloons Restaurant','Smoke N Ash BBQ','Sanjh Restaurant','Ari Korean BBQ','Roots Southern Table','Cenzos Pizza','Lucia','Bushi Bushi','Uchiko Plano','Taco y Vino','Restaurant Beatrice','The Heritage Table','El Carlos Elegante','Tango Room','Billy Can Can','Nuri Steakhouse','Written by the Seasons','Rudys Chicken','Royal China','Starship Bagel','Namo','Mirador','Partenope Ristorante','Green Point Seafood','El Come Taco','Terry Blacks Barbecue','Gemma Restaurant','Tatsu Dallas','Mikes Chicken','Ngon Vietnamese Kitchen','Quarter Acre','Goodwins','Via Triozzi','Meridian Restaurant','Mot Hai Ba','Harvest at the Masonic'];
const houston = ['Ishtia','Viola Agnes','Navy Blue','Le Jardinier','Cochinita','Candente','The Rado Market','BCN Taste','Nobies','Hidden Omakase','Littles Oyster Bar','Musaafer','Kira','Craft Pita','Street to Kitchen','Tiny Champions','Koffeteria','Huynh Restaurant','Josephines','Xochi','Katami','ChopnBlok','Theodore Rex','Truth BBQ','Mala Sichuan Bistro','Phat Eatery','Feges BBQ','Squable','Baso','Casa Ema','Jun','Brisket Rice','Belly of the Beast','Amrina','March','Corkscrew BBQ','Agas Restaurant','Nancys Hustle'];
const chicago = ['Sanders BBQ Supply','Calumet Fisheries','Carnitas Uruapan','Virtue Restaurant','Harolds Chicken Shack','The Duck Inn','HaiSous Vietnamese Kitchen','Olivers','Mannys Cafeteria','Monteverde','Smyth','Oriole','Rose Mary','Maxwells Trading','Frontera Grill','Pizz Amici','Asador Bastian','Kasama','Johnnies Beef','Alinea','Kyoten','Hermosa Restaurant','Mirra','Esme','Taqueria Chingon','Akahoshi Ramen','Chubby Boys','Galit','Daisies','Nadu','Lula Cafe','Mi Tocaya Antojeria','Redhot Ranch','Milli by Metric','Santa Masa Tamaleria','Del Sur Bakery','Carino','Birrieria Zaragoza'];
const austin = ['Himalaya Kosheli','Usta Kababgy','House of Three Gorges','Korea House','Bufalina Due','Paprika ATX','Fonda San Miguel','Foreign Domestic','Kome','Allday Pizza','Uchiko','P Thais Khao Man Gai','Crown Anchor Pub','KG BBQ','Dai Due','Este','Jeffreys','Olamaie','Fabrik','Birdies','Nixta Taqueria','Ensenada ATX','Better Half Coffee','Franklin Barbecue','Laod Bar','Veracruz All Natural','Canje','Joes Bakery','Dee Dee','Mercado Sin Nombre','Odd Duck','La Barbecue','Intero','Justines','Bouldin Creek Cafe','Amys Ice Creams','LeRoy Lewis','Distant Relatives'];

check('NYC', nyc);
check('DALLAS', dallas);
check('HOUSTON', houston);
check('CHICAGO', chicago);
check('AUSTIN', austin);
