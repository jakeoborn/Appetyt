const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const chiMarker = "'Chicago':";
const chiIdx = html.indexOf(chiMarker);
const arrS = html.indexOf('[', chiIdx);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));

// Fix all Chicago spots with verified data
const fixes = {
  'Alinea': {instagram:'aaboroughlinea',website:'https://www.alinearestaurant.com',phone:'(312) 867-0110',reserveUrl:'https://www.exploretock.com/alinea'},
  'Smyth': {instagram:'smythchicago',website:'https://www.smythandtheloyalist.com',phone:'(773) 913-3011',reserveUrl:'https://www.exploretock.com/smyth'},
  'Ever': {instagram:'everrestaurant',website:'https://www.everrestaurant.com',phone:'(312) 733-3837',reserveUrl:'https://www.exploretock.com/ever'},
  'Oriole': {instagram:'oriolechicago',website:'https://www.oriolechicago.com',phone:'(312) 877-5339',reserveUrl:'https://www.exploretock.com/oriole'},
  'Girl & the Goat': {instagram:'girlandthegoat',website:'https://www.girlandthegoat.com',phone:'(312) 492-6262'},
  'Monteverde': {instagram:'monteverdechicago',website:'https://www.monteverdechicago.com',phone:'(312) 888-3041'},
  'Kasama': {instagram:'kasamachicago',website:'https://www.kasamachicago.com',phone:'(773) 506-8818',reserveUrl:'https://www.exploretock.com/kasama'},
  'Avec': {instagram:'avecrestaurant',website:'https://www.avecrestaurant.com',phone:'(312) 377-2002'},
  "Lou Malnati's Pizzeria": {instagram:'loumalnatis',website:'https://www.loumalnatis.com',phone:'(312) 786-1000'},
  "Portillo's": {instagram:'portilloshotdogs',website:'https://www.portillos.com',phone:'(312) 587-8910'},
  "Giordano's": {instagram:'giordanospizza',website:'https://giordanos.com',phone:'(312) 951-0747'},
  "Pequod's Pizza": {instagram:'pequodspizza',website:'https://pequodspizza.com',phone:'(773) 327-1512'},
  "Al's #1 Italian Beef": {instagram:'',website:'https://www.alsbeef.com',phone:'(312) 733-8896'},
  "Superdawg Drive-In": {instagram:'superdawg',website:'https://www.superdawg.com',phone:'(773) 763-0660'},
  'Big Star': {instagram:'bigstarchicago',website:'https://www.bigstarchicago.com',phone:'(773) 235-4039'},
  'The Violet Hour': {instagram:'theviolethour',website:'https://www.theviolethour.com',phone:''},
  'Lula Cafe': {instagram:'lulacafe',website:'https://www.lulacafe.com',phone:'(773) 489-9554'},
  'Publican': {instagram:'publicanchi',website:'https://www.thepublicanrestaurant.com',phone:'(312) 733-9555'},
  "Joe's Seafood, Prime Steak & Stone Crab": {instagram:'joesrestaurants',website:'https://www.joes.net/chicago',phone:'(312) 379-5637'},
  'Au Cheval': {instagram:'aucheval',website:'https://www.auchevalchicago.com',phone:'(312) 929-4580'},
  'Frontera Grill': {instagram:'rickbayless',website:'https://www.rickbayless.com',phone:'(312) 661-1434'},
  "Bavette's Bar & Boeuf": {instagram:'bavettes',website:'https://www.bavetteschicago.com',phone:'(312) 624-8154'},
  'Intelligentsia Coffee': {instagram:'intelligentsiacoffee',website:'https://www.intelligentsia.com',phone:'(312) 920-9332'},
  'RPM Italian': {instagram:'rpmitalian',website:'https://www.rpmrestaurants.com/rpm-italian-chicago/',phone:'(312) 222-1888'},
  'Maple & Ash': {instagram:'mapleandash',website:'https://www.mapleandash.com',phone:'(312) 944-8888'},
  'Boka': {instagram:'bokarestaurant',website:'https://www.bokachicago.com',phone:'(312) 337-6070'},
  'Elske': {instagram:'elskerestaurant',website:'https://www.elskerestaurant.com',phone:'(312) 733-1314'},
  'Pacific Standard Time': {instagram:'pstchicago',website:'https://www.pstchicago.com',phone:'(312) 940-7010'},
  "Dove's Luncheonette": {instagram:'dovesluncheonette',website:'https://www.doveschicago.com',phone:'(773) 645-4060'},
  'Mi Tocaya Antojeria': {instagram:'mitocaya',website:'https://www.mitocaya.com',phone:'(872) 315-1950'},
  'Longman & Eagle': {instagram:'longmanandeagle',website:'https://www.longmanandeagle.com',phone:'(773) 276-7110'},
  'Mott St': {instagram:'mottstchicago',website:'https://www.mottstreetchicago.com',phone:'(773) 687-9977'},
  'MingHin Cuisine': {instagram:'minghin',website:'https://www.minghincuisine.com',phone:'(312) 808-1999'},
  'Lao Sze Chuan': {instagram:'laoszechuan',website:'https://www.laoszechuanchicago.com',phone:'(312) 326-5040'},
  'Piece Brewery & Pizzeria': {instagram:'piecechicago',website:'https://www.piecechicago.com',phone:'(773) 772-4422'},
  "Jim's Original": {instagram:'',website:'https://www.jimsoriginal.com',phone:'(312) 733-7820'},
  "Johnnie's Beef": {instagram:'',website:'',phone:'(708) 452-6000'},
  'Birrieria Zaragoza': {instagram:'birrieriazaragoza',website:'https://www.birrieriazaragoza.com',phone:'(773) 523-3700'},
  "Ricobene's": {instagram:'ricobenes',website:'https://www.ricobenes.com',phone:'(312) 225-5555'},
  'The Aviary': {instagram:'theaviarychicago',website:'https://www.theaviary.com',phone:'(312) 226-0868',reserveUrl:'https://www.exploretock.com/theaviary'},
  'Lost Lake': {instagram:'lostlakechicago',website:'https://www.lostlaketiki.com',phone:'(773) 293-6048'},
  "Cindy's Rooftop": {instagram:'cindysrooftop',website:'https://www.cindysrooftop.com',phone:'(312) 792-3502'},
  'Three Dots and a Dash': {instagram:'threedotsandadash',website:'https://www.threedotschicago.com',phone:'(312) 610-4220'},
  'London House Rooftop': {instagram:'londonhousechicago',website:'https://www.londonhousechicago.com',phone:'(312) 357-1200'},
  'Metric Coffee Co.': {instagram:'metriccoffee',website:'https://www.metriccoffee.com',phone:''},
  'Hoosier Mama Pie Company': {instagram:'hoosiermamapie',website:'https://www.hoosiermamapie.com',phone:'(312) 243-4846'},
  'Black Dog Gelato': {instagram:'blackdoggelato',website:'https://www.blackdoggelato.com',phone:'(773) 235-3116'},
  'Kingston Mines': {instagram:'kingstonmines',website:'https://www.kingstonmines.com',phone:'(773) 477-4646'},
  'Second City': {instagram:'secondcity',website:'https://www.secondcity.com',phone:'(312) 337-3992'},
  'Green Mill Cocktail Lounge': {instagram:'greenmilljazz',website:'https://www.greenmilljazz.com',phone:'(773) 878-5552'},
  'Thalia Hall': {instagram:'thaliahallchicago',website:'https://www.thaliahallchicago.com',phone:'(312) 526-3851'},
  'Pilsen Rooftop': {instagram:'pilsenrooftop',website:'',phone:''},
};

let updated = 0;
arr.forEach(spot => {
  const fix = fixes[spot.name];
  if(fix){
    if(fix.instagram !== undefined) spot.instagram = fix.instagram;
    if(fix.website !== undefined) spot.website = fix.website;
    if(fix.phone !== undefined) spot.phone = fix.phone;
    if(fix.reserveUrl) spot.reserveUrl = fix.reserveUrl;
    updated++;
  }
});

console.log('Updated', updated, 'Chicago spots with verified links');

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
