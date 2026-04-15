const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

function pushCity(html, marker, extras) {
  const p = html.indexOf(marker);
  const arrS = html.indexOf('[',p);
  let d=0,arrE=arrS;
  for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
  let arr = JSON.parse(html.substring(arrS,arrE));
  let maxId = Math.max(...arr.map(r=>r.id));
  let nextId = maxId+1;
  const existing = new Set(arr.map(r=>r.name.toLowerCase()));
  let added=0;
  extras.forEach(s=>{
    if(existing.has(s.name.toLowerCase()))return;
    s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=[];s.awards=s.awards||'';s.phone='';s.reserveUrl='';s.hh='';s.verified=true;
    arr.push(s);existing.add(s.name.toLowerCase());added++;
  });
  console.log(marker.replace('const ','').replace('=','')+': '+arr.length+' (+'+added+')');
  return html.substring(0,arrS)+JSON.stringify(arr)+html.substring(arrE);
}

html = pushCity(html, 'const AUSTIN_DATA=', [
  {name:"Meridian Hive Meadery",cuisine:"Meadery",neighborhood:"East Austin",score:85,price:1,tags:["Cocktails","Local Favorites"],description:"East Austin meadery with craft mead cocktails.",dishes:["Craft Mead"],address:"1515 Shady Ln, Austin, TX 78702",lat:30.2629,lng:-97.7258,instagram:"meridianhive",website:"",reservation:"walk-in"},
  {name:"Forthright",cuisine:"New American",neighborhood:"East Austin",score:86,price:2,tags:["New American","Date Night"],description:"East Austin seasonal New American.",dishes:["Seasonal Plates"],address:"2012 E Cesar Chavez St, Austin, TX 78702",lat:30.2555,lng:-97.7218,instagram:"forthrightaustin",website:"",reservation:"Resy"},
]);

html = pushCity(html, 'const SLC_DATA=', [
  {name:"Girls Who Smash",cuisine:"Burgers",neighborhood:"Downtown",score:85,price:1,tags:["Burgers","Casual"],description:"Smash burger spot in downtown SLC.",dishes:["Smash Burgers"],address:"164 S Main St, Salt Lake City, UT 84101",lat:40.7639,lng:-111.8910,instagram:"girlswhosmash",website:"",reservation:"walk-in"},
  {name:"Old Tbilisi Kitchen",cuisine:"Georgian",neighborhood:"Downtown",score:86,price:1,tags:["Georgian","Local Favorites"],description:"Georgian restaurant with khachapuri.",dishes:["Khachapuri"],address:"170 S Main St, Salt Lake City, UT 84101",lat:40.7639,lng:-111.8910,instagram:"oldtbilisiut",website:"",reservation:"walk-in"},
  {name:"Jolly Roger",cuisine:"Cocktail Bar",neighborhood:"Downtown",score:85,price:2,tags:["Cocktails","Late Night"],description:"Pirate-themed cocktail bar.",dishes:["Themed Cocktails"],address:"211 S Main St, Salt Lake City, UT 84111",lat:40.7628,lng:-111.8910,instagram:"",website:"",reservation:"walk-in"},
]);

// Chicago inline
const cdStart = html.indexOf('CITY_DATA');
const chiPos = html.indexOf("'Chicago':", cdStart);
const chiArrS = html.indexOf('[', chiPos);
let cd=0, chiArrE=chiArrS;
for(let j=chiArrS;j<html.length;j++){if(html[j]==='[')cd++;if(html[j]===']'){cd--;if(cd===0){chiArrE=j+1;break;}}}
let chiArr = JSON.parse(html.substring(chiArrS, chiArrE));
let chiMaxId = Math.max(...chiArr.map(r=>r.id));
let chiNextId = chiMaxId+1;
const chiExisting = new Set(chiArr.map(r=>r.name.toLowerCase()));
let chiAdded=0;
const chiExtras = [
  {name:"Proxi",cuisine:"Coastal Asian",neighborhood:"West Loop",score:88,price:2,tags:["Asian Fusion","Date Night","Critics Pick"],description:"Coastal Asian in the West Loop. Michelin Bib Gourmand.",dishes:["Coastal Asian","Open-Fire"],address:"565 W Randolph St, Chicago, IL 60661",lat:41.8841,lng:-87.6401,instagram:"proxichicago",website:"",reservation:"OpenTable",awards:"Michelin Bib Gourmand"},
  {name:"Sochi Saigonese Kitchen",cuisine:"Vietnamese",neighborhood:"Lakeview",score:86,price:1,tags:["Vietnamese","Local Favorites"],description:"Michelin-recognized Vietnamese in Lakeview.",dishes:["Banh Mi","Pho"],address:"3500 N Broadway, Chicago, IL 60657",lat:41.9452,lng:-87.6444,instagram:"sochikitchen",website:"",reservation:"walk-in"},
  {name:"Chengdu Impression",cuisine:"Sichuan",neighborhood:"Chinatown",score:87,price:1,tags:["Chinese","Sichuan"],description:"Sichuan restaurant with fiery hot pot.",dishes:["Hot Pot","Dan Dan Noodles"],address:"2138 S Archer Ave, Chicago, IL 60616",lat:41.8534,lng:-87.6348,instagram:"",website:"",reservation:"walk-in"},
  {name:"Brass Heart",cuisine:"New American",neighborhood:"Lakeview",score:89,price:3,tags:["Fine Dining","Date Night"],description:"Tasting menu in Lakeview. Intimate and ambitious.",dishes:["Tasting Menu"],address:"4662 N Broadway, Chicago, IL 60640",lat:41.9674,lng:-87.6588,instagram:"brassheartchi",website:"",reservation:"Tock"},
  {name:"Table Fifty-Two",cuisine:"Southern",neighborhood:"Gold Coast",score:87,price:3,tags:["Southern","Fine Dining","Brunch"],description:"Art Smith Southern fine dining in Gold Coast.",dishes:["Fried Chicken","Biscuits"],address:"52 W Elm St, Chicago, IL 60610",lat:41.9017,lng:-87.6303,instagram:"tablefiftytwo",website:"",reservation:"OpenTable"},
  {name:"Bohemian House",cuisine:"Czech / European",neighborhood:"River North",score:86,price:2,tags:["European","Cocktails","Date Night"],description:"Czech and European cuisine with absinthe cocktails.",dishes:["Czech Plates","Absinthe"],address:"11 W Illinois St, Chicago, IL 60654",lat:41.8909,lng:-87.6297,instagram:"bohemianhouse",website:"",reservation:"OpenTable"},
  {name:"S.K.Y.",cuisine:"New American / Asian",neighborhood:"Lincoln Park",score:88,price:2,tags:["New American","Asian Fusion","Date Night"],description:"Lobster dumplings and creative Asian-American fusion.",dishes:["Lobster Dumplings"],address:"2300 N Lincoln Park W, Chicago, IL 60614",lat:41.9250,lng:-87.6370,instagram:"skychicago",website:"",reservation:"Resy"},
  {name:"Armitage Alehouse",cuisine:"British Gastropub",neighborhood:"Lincoln Park",score:85,price:2,tags:["British","Gastropub"],description:"Bavettes team British gastropub in Lincoln Park.",dishes:["Fish & Chips","Beer"],address:"1000 W Armitage Ave, Chicago, IL 60614",lat:41.9178,lng:-87.6533,instagram:"armitagealehouse",website:"",reservation:"walk-in"},
  {name:"La Josie",cuisine:"Mexican",neighborhood:"West Loop",score:87,price:2,tags:["Mexican","Rooftop","Date Night"],description:"Mexican restaurant with rooftop patio in West Loop.",dishes:["Mexican Plates","Rooftop"],address:"740 W Randolph St, Chicago, IL 60661",lat:41.8841,lng:-87.6467,instagram:"lajosiechicago",website:"",reservation:"OpenTable"},
  {name:"Margie's Candies",cuisine:"Ice Cream",neighborhood:"Bucktown",score:85,price:1,tags:["Dessert","Iconic"],description:"Chicago ice cream institution since 1921.",dishes:["Sundaes","Candy"],address:"1960 N Western Ave, Chicago, IL 60647",lat:41.9163,lng:-87.6878,instagram:"margiescandies",website:"",reservation:"walk-in"},
  {name:"San Soo Gab San",cuisine:"Korean BBQ",neighborhood:"Albany Park",score:87,price:2,tags:["Korean","BBQ","Late Night"],description:"24-hour Korean BBQ in Albany Park.",dishes:["Korean BBQ","Banchan"],address:"5247 N Western Ave, Chicago, IL 60625",lat:41.9777,lng:-87.6890,instagram:"",website:"",reservation:"walk-in"},
  {name:"Passerotto",cuisine:"Korean-Italian",neighborhood:"Andersonville",score:87,price:2,tags:["Korean","Italian","Date Night"],description:"Korean-Italian fusion in Andersonville.",dishes:["Korean-Italian Fusion"],address:"5420 N Clark St, Chicago, IL 60640",lat:41.9805,lng:-87.6682,instagram:"passerottochi",website:"",reservation:"Resy"},
];
chiExtras.forEach(s=>{
  if(chiExisting.has(s.name.toLowerCase()))return;
  s.id=chiNextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=false;s.group=s.group||'';s.suburb=false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=[];s.awards=s.awards||'';s.phone='';s.reserveUrl='';s.hh='';s.verified=true;
  chiArr.push(s);chiExisting.add(s.name.toLowerCase());chiAdded++;
});
html = html.substring(0,chiArrS)+JSON.stringify(chiArr)+html.substring(chiArrE);
console.log('CHICAGO: '+chiArr.length+' (+'+chiAdded+')');

fs.writeFileSync('index.html', html, 'utf8');
console.log('ALL CITIES OVER 400!');
