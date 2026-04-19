// Add 12 Michelin LA Bib Gourmand icons with addresses verified against each
// restaurant's public website / widely-cited editorial coverage (Eater LA,
// Infatuation, LA Times, restaurant's own website). Only restaurants with
// addresses I can cite confidently are included.
//
// Source: Michelin Guide LA 2025 Bib Gourmand list
// (guide.michelin.com/us/en/california/us-los-angeles/restaurants/bib-gourmand)

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

function stackFindClose(str, open){let d=0;for(let i=open;i<str.length;i++){if(str[i]==='[')d++;else if(str[i]===']'){d--;if(!d)return i;}}return -1;}
function locateArray(v){const re=new RegExp(v+'\\s*=\\s*\\[');const m=html.match(re);if(!m)return null;const a=m.index+m[0].length-1;return {arrS:a,arrE:stackFindClose(html,a)+1};}
function parseArray(v){const p=locateArray(v);return JSON.parse(html.substring(p.arrS,p.arrE));}

function entry(id, data) {
  return {
    id,name:'',phone:'',cuisine:'',neighborhood:'',score:88,price:2,tags:[],
    indicators:[],hh:'',reservation:'Resy',awards:'Michelin Bib Gourmand 2025',
    description:'',dishes:[],address:'',hours:'',lat:0,lng:0,group:'',
    instagram:'',website:'',res_tier:0,photoUrl:'',bestOf:[],busyness:null,
    waitTime:null,popularTimes:null,lastUpdated:null,trending:false,suburb:false,
    reserveUrl:'',menuUrl:'',verified:'2026-04-18',
    ...data,
  };
}

const newEntries = [
  entry(2103, {
    name:"Jon & Vinny's",
    cuisine:"Italian-American",
    neighborhood:"Fairfax",
    score:90,price:2,
    tags:["Italian","Brunch","Sit-Down","Critics Pick","Local Favorites"],
    description:"Jon Shook and Vinny Dotolo's beloved all-day Italian-American spot — LA's default for Spicy Fusilli with vodka sauce, wood-fired pizzas, and the infamous reservation chase.",
    dishes:["Spicy Fusilli","Meatball Parm","Margherita Pizza"],
    address:"412 N Fairfax Ave, Los Angeles, CA 90036",
    lat:34.0783,lng:-118.3613,
    website:"https://www.jonandvinnys.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2104, {
    name:"Kismet",
    cuisine:"Middle Eastern / Californian",
    neighborhood:"Los Feliz",
    score:89,price:3,
    tags:["Middle Eastern","Sit-Down","Critics Pick","Date Night","Brunch"],
    description:"Chefs Sarah Hymanson and Sara Kramer's produce-forward California take on Middle Eastern cuisine in a sun-drenched Los Feliz dining room.",
    dishes:["Manti","Rotisserie Chicken","Kibbeh"],
    address:"4648 Hollywood Blvd, Los Angeles, CA 90027",
    lat:34.1005,lng:-118.2935,
    website:"https://kismetlosangeles.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2105, {
    name:"Pine & Crane",
    cuisine:"Taiwanese",
    neighborhood:"Silver Lake",
    score:89,price:2,
    tags:["Chinese","Taiwanese","Sit-Down","Critics Pick","Local Favorites"],
    description:"Silver Lake's beloved Taiwanese counter-service gem from Vivian Ku, built around family recipes — dan dan noodles, beef rolls, and exacting three-cup chicken.",
    dishes:["Dan Dan Noodles","Three-Cup Chicken","Beef Roll"],
    address:"1521 Griffith Park Blvd, Los Angeles, CA 90026",
    lat:34.0922,lng:-118.2647,
    website:"https://pineandcrane.com/",
    awards:"Michelin Bib Gourmand 2025",
    reservation:"walk-in",
  }),
  entry(2106, {
    name:"Pizzana Brentwood",
    cuisine:"Neapolitan Pizza",
    neighborhood:"Brentwood",
    score:89,price:3,
    tags:["Pizza","Italian","Sit-Down","Critics Pick","Local Favorites"],
    description:"Daniele Uditi's slow-dough Neapolitan-ish pies in the original Brentwood location, co-owned by Chris O'Donnell and the Jedlovec family.",
    dishes:["Pacchetti","Cacio e Pepe Pizza","Baby Kale Salad"],
    address:"11712 San Vicente Blvd, Los Angeles, CA 90049",
    lat:34.0569,lng:-118.4738,
    website:"https://www.pizzana.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2107, {
    name:"Tsubaki",
    cuisine:"Japanese / Izakaya",
    neighborhood:"Echo Park",
    score:90,price:3,
    tags:["Japanese","Izakaya","Sit-Down","Critics Pick","Date Night"],
    description:"Chef Charles Namba and Courtney Kaplan's Echo Park izakaya — focused seasonal small plates, exacting sake program, refined comfort.",
    dishes:["Kanpachi Crudo","Saikyo Miso Black Cod","Chawanmushi"],
    address:"1356 Allison Ave, Los Angeles, CA 90026",
    lat:34.0697,lng:-118.2618,
    website:"https://www.tsubakila.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2108, {
    name:"The Factory Kitchen",
    cuisine:"Italian / Handmade Pasta",
    neighborhood:"Arts District",
    score:89,price:3,
    tags:["Italian","Pasta","Sit-Down","Critics Pick","Date Night"],
    description:"Angelo Auriana's Northern Italian handmade pasta destination in the Arts District — fresh daily pastas in a former cold storage warehouse.",
    dishes:["Mandilli di Seta","Focaccina Calda","Casonsei"],
    address:"1300 Factory Pl #101, Los Angeles, CA 90013",
    lat:34.0353,lng:-118.2342,
    website:"https://www.thefactorykitchen.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2109, {
    name:"Pizzeria Bianco Los Angeles",
    cuisine:"Pizza",
    neighborhood:"Downtown LA",
    score:91,price:2,
    tags:["Pizza","Italian","Sit-Down","Critics Pick","Local Favorites"],
    description:"James Beard Award-winning pizza master Chris Bianco's LA outpost at ROW DTLA — the same legendary Phoenix pies (Rosa, Wiseguy, Sonny Boy) plus select pastas.",
    dishes:["Rosa Pizza","Wiseguy Pizza","Sonny Boy Pizza"],
    address:"777 S Alameda St #120, Los Angeles, CA 90021",
    lat:34.0335,lng:-118.2325,
    website:"https://pizzeriabianco.com/pages/los-angeles",
    awards:"Michelin Bib Gourmand 2025 | James Beard Outstanding Chef",
  }),
  entry(2110, {
    name:"Moo's Craft Barbecue",
    cuisine:"Central Texas BBQ",
    neighborhood:"Lincoln Heights",
    score:90,price:2,
    tags:["BBQ","Casual","Critics Pick","Local Favorites"],
    description:"Andrew and Michelle Muñoz's Central Texas-style BBQ in Lincoln Heights — oak-smoked brisket, jalapeño cheddar sausage, and weekend-only specials.",
    dishes:["Brisket","Jalapeño Cheddar Sausage","Pulled Pork"],
    address:"2118 N Broadway, Los Angeles, CA 90031",
    lat:34.0752,lng:-118.2116,
    website:"https://www.mooscraftbarbecue.com/",
    awards:"Michelin Bib Gourmand 2025",
    reservation:"walk-in",
  }),
  entry(2111, {
    name:"Chengdu Taste",
    cuisine:"Sichuan Chinese",
    neighborhood:"Alhambra",
    score:88,price:2,
    tags:["Chinese","Sichuan","Sit-Down","Critics Pick","Local Favorites"],
    description:"The San Gabriel Valley's defining Sichuan restaurant — numbing mapo tofu, toothpick lamb, and boiled fish in chile oil that launched Chef Tony Xu's empire.",
    dishes:["Mapo Tofu","Toothpick Lamb","Boiled Fish in Chili Oil"],
    address:"828 W Valley Blvd, Alhambra, CA 91803",
    lat:34.0937,lng:-118.1395,
    website:"https://chengdutastes.com/",
    awards:"Michelin Bib Gourmand 2025",
    suburb:true,
  }),
  entry(2112, {
    name:"Sichuan Impression",
    cuisine:"Sichuan Chinese",
    neighborhood:"Alhambra",
    score:88,price:2,
    tags:["Chinese","Sichuan","Sit-Down","Critics Pick","Local Favorites"],
    description:"Alhambra Sichuan specialist alongside Chengdu Taste — hot water fish, dan dan noodles, and regional street-food snacks executed at a high level.",
    dishes:["Hot Water Fish","Dan Dan Noodles","Fuqi Feipian"],
    address:"23 W Valley Blvd, Alhambra, CA 91801",
    lat:34.0933,lng:-118.1243,
    website:"https://www.sichuanimpression.com/",
    awards:"Michelin Bib Gourmand 2025",
    suburb:true,
  }),
  entry(2113, {
    name:"Maccheroni Republic",
    cuisine:"Italian",
    neighborhood:"Downtown LA",
    score:87,price:2,
    tags:["Italian","Sit-Down","Local Favorites","Patio"],
    description:"Downtown LA Southern Italian staple — hand-cut pastas, a leafy patio, and consistently excellent prices for the quality.",
    dishes:["Pappardelle al Cinghiale","Ossobuco","Risotto al Bicolore"],
    address:"332 S Broadway, Los Angeles, CA 90013",
    lat:34.0507,lng:-118.2500,
    website:"http://www.maccheronirepublic.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
  entry(2114, {
    name:"Chifa",
    cuisine:"Chinese-Peruvian",
    neighborhood:"Eagle Rock",
    score:89,price:3,
    tags:["Latin American","Chinese","Sit-Down","Critics Pick","Date Night"],
    description:"Chefs Walter Manzke and John Liu's Chinese-Peruvian fusion in Eagle Rock — rooted in Peru's Chifa tradition, wok-fired noodles and Peruvian ceviches.",
    dishes:["Lomo Saltado","Aeropuerto Fried Rice","Ceviche Chifa"],
    address:"5200 York Blvd, Los Angeles, CA 90042",
    lat:34.1240,lng:-118.1936,
    website:"https://www.chifala.com/",
    awards:"Michelin Bib Gourmand 2025",
  }),
];

const pos = locateArray('const LA_DATA');
const data = parseArray('const LA_DATA');
data.push(...newEntries);
html = html.substring(0, pos.arrS) + JSON.stringify(data) + html.substring(pos.arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('LA_DATA:', data.length, '(+' + newEntries.length + ')');
newEntries.forEach(e => console.log('  + #' + e.id + ' ' + e.name + ' (' + e.neighborhood + ')'));
