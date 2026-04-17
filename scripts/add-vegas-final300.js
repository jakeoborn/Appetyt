const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const LV_DATA=';
const p = h.indexOf(m); const s = h.indexOf('[', p);
let d=0, e=s;
for(let j=s;j<h.length;j++){if(h[j]==='[')d++;if(h[j]===']'){d--;if(d===0){e=j+1;break;}}}
let arr = JSON.parse(h.substring(s, e));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let count = 0;

function add(s){
  const lower = s.name.toLowerCase();
  if(existing.has(lower)) { console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=''; s.dishes=s.dishes||[];
  s.reservation=s.reservation||'walk-in'; s.photoUrl='';
  arr.push(s); existing.add(lower); count++;
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

add({name:"Hwaro Korean BBQ",cuisine:"Korean BBQ",neighborhood:"Chinatown",score:86,price:2,tags:["Korean","BBQ","Late Night","Casual","Local Favorites"],description:"Chinatown beloved all-you-can-eat Korean BBQ with premium cuts and service until 2 AM.",address:"5030 Spring Mountain Rd Ste 3-5, Las Vegas, NV 89146",lat:36.1325,lng:-115.2148,instagram:"@hwaro.lv",website:"https://hwaro2.com"});
add({name:"888 Korean BBQ",cuisine:"Korean BBQ",neighborhood:"Chinatown",score:85,price:2,tags:["Korean","BBQ","Late Night","Casual","Family Friendly"],description:"Chinatown Plaza popular all-you-can-eat Korean BBQ open until midnight daily.",address:"4215 Spring Mountain Rd B107, Las Vegas, NV 89102",lat:36.1281,lng:-115.2007,instagram:"@888kbbq",website:"https://888koreanbbq.com"});
add({name:"Shang Artisan Noodle",cuisine:"Chinese / Noodles",neighborhood:"Chinatown",score:87,price:1,tags:["Chinese","Casual","Local Favorites","Family Friendly"],indicators:["hidden-gem"],description:"Vegas most-reviewed hand-pulled noodle shop with dan dan noodles and beef pancakes.",address:"4983 W Flamingo Rd Ste B, Las Vegas, NV 89103",lat:36.1150,lng:-115.2097,instagram:"@shangartisannoodle",website:"https://www.shangartisannoodle.com"});
add({name:"Milpa",cuisine:"Mexican / Cafe",neighborhood:"Spring Valley",score:84,price:1,tags:["Mexican","Brunch","Casual","Local Favorites"],description:"Spring Valley neighborhood Mexican cafe with all-day breakfast and fresh tortillas.",address:"4226 S Durango Dr Ste 101, Las Vegas, NV 89147",lat:36.0932,lng:-115.2728,instagram:"@milpa_lv",website:"https://milpalv.com"});
add({name:"Commonwealth",cuisine:"Cocktail Bar",neighborhood:"Downtown (Fremont East)",score:84,price:2,tags:["Cocktails","Bar","Late Night","Rooftop","Date Night"],description:"Fremont East anchor two-story cocktail bar with a rooftop dance floor and hidden speakeasy The Laundry Room.",address:"525 E Fremont St, Las Vegas, NV 89101",lat:36.1685,lng:-115.1306,instagram:"@commonwealthlv",website:"https://www.commonwealthlv.com"});
add({name:"Hugo's Cellar",cuisine:"American / Steakhouse",neighborhood:"Downtown",score:88,price:3,tags:["Steakhouse","Fine Dining","Date Night","Celebrations"],indicators:["iconic"],description:"Legendary below-street-level steakhouse inside Four Queens since 1976 with tableside Caesar salad and roses for the ladies.",address:"202 Fremont St, Las Vegas, NV 89101",lat:36.1707,lng:-115.1435,instagram:"@hugoscellar",website:"https://www.fourqueens.com/dining/hugos_cellar"});
add({name:"Hop Nuts Brewing",cuisine:"Brewery",neighborhood:"Arts District",score:83,price:1,tags:["Casual","Patio","Dog Friendly","Local Favorites"],description:"Original Arts District craft brewery since 2015 with 20 taps and 15 brewed in-house.",address:"1120 S Main St Ste 150, Las Vegas, NV 89104",lat:36.1580,lng:-115.1540,instagram:"@hopnutsbrewing",website:"https://hopnutsbrewing.com"});
add({name:"Banger Brewing",cuisine:"Brewery",neighborhood:"Downtown (Fremont East)",score:82,price:1,tags:["Casual","Local Favorites","Family Friendly"],description:"Las Vegas only brewery on Fremont Street with house-crafted beers open noon to midnight.",address:"450 Fremont St Ste 135, Las Vegas, NV 89101",lat:36.1699,lng:-115.1422,instagram:"@bangerbrewing",website:"https://bangerbrewing.com"});
add({name:"Vesta Coffee Roasters",cuisine:"Coffee",neighborhood:"Arts District",score:83,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Arts District specialty coffee roaster with single-origin pour-overs in a bright modern space.",address:"1114 S Casino Center Blvd Ste 1, Las Vegas, NV 89104",lat:36.1590,lng:-115.1490,instagram:"@vestacoffee",website:"https://www.vestacoffee.com"});
add({name:"Mothership Coffee Roasters",cuisine:"Coffee",neighborhood:"Downtown",score:82,price:1,tags:["Bakery/Coffee","Casual","Local Favorites"],description:"Downtown third-wave coffee roaster with excellent espresso and a community-focused vibe.",address:"412 Fremont St, Las Vegas, NV 89101",lat:36.1693,lng:-115.1400,instagram:"@mothershipcoffee",website:"https://mothershipcoffee.com"});
add({name:"Ping Pang Pong",cuisine:"Chinese / Dim Sum",neighborhood:"West of Strip",score:85,price:1,tags:["Chinese","Casual","Late Night","Local Favorites"],indicators:["hidden-gem"],description:"Travel + Leisure top-10 Chinese restaurant inside Gold Coast Casino with authentic dim sum open until 3 AM.",address:"4000 W Flamingo Rd, Las Vegas, NV 89103",lat:36.1165,lng:-115.1928,instagram:"@pingpangponglv",website:""});
add({name:"Yardbird Southern Table",cuisine:"Southern",neighborhood:"The Strip (The Venetian)",score:87,price:3,tags:["Southern","Brunch","Cocktails","Date Night"],description:"Miami import at The Venetian serving elevated Southern comfort food — fried chicken, biscuits, and bourbon.",address:"3355 Las Vegas Blvd S, Las Vegas, NV 89109",lat:36.1230,lng:-115.1695,instagram:"@yardbirdtable",website:"https://www.rfrg.com/restaurants/yardbird"});
add({name:"CRAFTkitchen Henderson",cuisine:"New American / Brunch",neighborhood:"Henderson",score:86,price:2,tags:["Brunch","Casual","Local Favorites","Family Friendly"],description:"Chef-owned Henderson cafe with locally sourced ingredients and outstanding all-day brunch.",address:"10940 S Eastern Ave Ste 107, Henderson, NV 89052",lat:36.0038,lng:-115.0774,instagram:"@craftkitchenlv",website:"https://www.craftkitchenlv.com"});
add({name:"Siegel's 1941",cuisine:"American / Diner",neighborhood:"Downtown",score:78,price:1,tags:["Casual","Late Night","Local Favorites"],indicators:["iconic"],description:"24-hour diner inside the historic El Cortez Hotel with classic comfort food and Bugsy Siegel memorabilia.",address:"600 E Fremont St, Las Vegas, NV 89101",lat:36.1692,lng:-115.1325,instagram:"@elcortezhotel",website:"https://elcortezhotelcasino.com/dining/siegels-1941"});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| Vegas total:', arr.length);
