const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');
const m = 'const SLC_DATA=';
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

// Lehi / American Fork (5)
add({name:'Taqueria 27 Lehi',cuisine:'Mexican',neighborhood:'Lehi',score:84,price:2,tags:['Mexican','Casual','Happy Hour','Local Favorites'],lat:40.4125,lng:-111.9057,instagram:'@taqueria27',website:'https://www.taqueria27.com',address:'1688 W Traverse Pkwy, Lehi, UT 84043',suburb:true});
add({name:'Via 313 Lehi',cuisine:'Pizza',neighborhood:'Lehi',score:82,price:2,tags:['Pizza','Casual','Family Friendly'],lat:40.3919,lng:-111.8441,instagram:'@via313',website:'https://www.via313.com',address:'1085 E Main St, Lehi, UT 84043',suburb:true});
add({name:'Sol Agave American Fork',cuisine:'Mexican',neighborhood:'Lehi',score:85,price:2,tags:['Mexican','Cocktails','Happy Hour','Local Favorites'],lat:40.3772,lng:-111.8011,instagram:'@solagave.af',website:'https://www.solagave.com',address:'591 W 100 S, American Fork, UT 84003',suburb:true});
add({name:'Ocotillo Prime',cuisine:'Steakhouse',neighborhood:'Lehi',score:84,price:3,tags:['Steakhouse','Date Night','Cocktails','Happy Hour'],lat:40.4305,lng:-111.9001,instagram:'@ocotilloprime',website:'https://www.ocotilloprime.com',address:'2801 N Thanksgiving Way, Lehi, UT 84043',suburb:true});
add({name:'Kitchen Eighty-Eight',cuisine:'New American',neighborhood:'Lehi',score:83,price:2,tags:['Brunch','Casual','Local Favorites','Family Friendly'],lat:40.4318,lng:-111.8998,instagram:'@kitchen88lehi',website:'https://www.kitchen88.com',address:'3200 N Thanksgiving Way, Lehi, UT 84043',suburb:true});

// Ogden (5)
add({name:'Table Twenty Five',cuisine:'New American',neighborhood:'Ogden',score:88,price:3,tags:['Fine Dining','Date Night','Brunch','Critics Pick','Local Favorites'],indicators:['iconic'],lat:41.2211,lng:-111.9753,instagram:'@table25ogden',website:'https://www.table25ogden.com',address:'195 Historic 25th St, Ogden, UT 84401',awards:'Salt Lake Magazine Best Restaurant 2025'});
add({name:'Tona Sushi Bar & Grill',cuisine:'Japanese / Sushi',neighborhood:'Ogden',score:86,price:3,tags:['Sushi','Date Night','Critics Pick','Local Favorites'],lat:41.2210,lng:-111.9761,instagram:'@tonasushi',website:'https://www.tonarestaurant.com',address:'210 25th St, Ogden, UT 84401'});
add({name:'Roosters Brewing Co.',cuisine:'Brewery / American',neighborhood:'Ogden',score:82,price:2,tags:['Casual','Live Music','Family Friendly','Local Favorites','Happy Hour'],lat:41.2213,lng:-111.9745,instagram:'@roostersbrewing',website:'https://www.roostersbrewingco.com',address:'253 Historic 25th St, Ogden, UT 84401'});
add({name:"Stella's on 25th",cuisine:'Italian',neighborhood:'Ogden',score:83,price:2,tags:['Italian','Pizza','Date Night','Local Favorites'],lat:41.2211,lng:-111.9757,instagram:'@stellason25th',website:'https://www.stellason25th.com',address:'225 25th St, Ogden, UT 84401'});
add({name:"Weller's Bistro",cuisine:'German / European',neighborhood:'Ogden',score:82,price:2,tags:['Casual','Cocktails','Happy Hour','Local Favorites'],lat:41.2208,lng:-111.9710,instagram:'@wellersbistro',website:'https://www.wellersbistro.com',address:'455 25th St, Ogden, UT 84401'});

// Logan (3)
add({name:'Le Nonne',cuisine:'Italian Fine Dining',neighborhood:'Logan',score:86,price:3,tags:['Italian','Fine Dining','Date Night','Romantic'],indicators:['hidden-gem'],lat:41.7359,lng:-111.8326,instagram:'@le__nonne',website:'https://www.lenonne.com',address:'129 N 100 E, Logan, UT 84321'});
add({name:'Cafe Sabor',cuisine:'Mexican / Latin',neighborhood:'Logan',score:81,price:1,tags:['Mexican','Casual','Local Favorites'],lat:41.7346,lng:-111.8538,instagram:'@cafesabor',website:'https://www.cafesabor.com',address:'600 W Center St, Logan, UT 84321'});
add({name:'Cooks Underground',cuisine:'American / Burgers',neighborhood:'Logan',score:80,price:1,tags:['Casual','Late Night','Local Favorites'],indicators:['hole-in-wall'],lat:41.7349,lng:-111.8337,instagram:'@cooksunderground',website:'https://www.cooksunderground.com',address:'64 Federal Ave, Logan, UT 84321'});

// Bountiful / Farmington (3)
add({name:'Joy Luck Restaurant',cuisine:'Chinese',neighborhood:'Bountiful',score:83,price:2,tags:['Chinese','Family Friendly','Local Favorites'],lat:40.8639,lng:-111.8910,instagram:'@joyluckrestaurant',website:'https://www.joyluckrestaurant.com',address:'566 W 1350 S, Bountiful, UT 84010',suburb:true});
add({name:'Twigs Bistro & Martini Bar',cuisine:'New American',neighborhood:'Farmington',score:82,price:2,tags:['Cocktails','Happy Hour','Date Night','Family Friendly'],lat:40.9820,lng:-111.8919,instagram:'@twigsbistro',website:'https://www.twigsbistro.com',address:'155 N E Promontory, Farmington, UT 84025',suburb:true});
add({name:'Royal India Bountiful',cuisine:'Indian',neighborhood:'Bountiful',score:80,price:2,tags:['Indian','Casual','Family Friendly','Local Favorites'],lat:40.8507,lng:-111.8901,instagram:'@royalindiaslc',website:'https://www.royalindiabountiful.com',address:'467 W 2600 S, Bountiful, UT 84010',suburb:true});

// Riverton / Herriman (3)
add({name:'North Italia Riverton',cuisine:'Italian',neighborhood:'Riverton',score:84,price:2,tags:['Italian','Date Night','Cocktails','Happy Hour'],lat:40.5217,lng:-111.9745,instagram:'@northitalia',website:'https://www.northitalia.com',address:'13303 S Teal Ridge Way, Riverton, UT 84096',suburb:true});
add({name:'Saffron Circle',cuisine:'Indian',neighborhood:'Riverton',score:83,price:2,tags:['Indian','Date Night','Cocktails','Local Favorites'],lat:40.5199,lng:-111.9801,instagram:'@saffronvalleyslc',website:'https://www.saffronvalley.com',address:'4594 W Partridgehill Ln, Riverton, UT 84096',suburb:true});
add({name:'Slackwater Herriman',cuisine:'Pizza / Craft Beer',neighborhood:'Herriman',score:82,price:2,tags:['Pizza','Casual','Family Friendly'],lat:40.5159,lng:-112.0335,instagram:'@slackwaterherriman',website:'https://www.slackwaterpub.com',address:'5197 Denali Park Dr, Herriman, UT 84096',suburb:true});

// Gateway (2 new — Flanker already exists)
add({name:"Fleming's Prime Steakhouse SLC",cuisine:'Steakhouse',neighborhood:'Gateway',score:86,price:4,tags:['Steakhouse','Fine Dining','Happy Hour','Date Night','Celebrations'],lat:40.7683,lng:-111.9041,instagram:'@flemingssteakhouse',website:'https://www.flemingssteakhouse.com',address:'20 S 400 W, Salt Lake City, UT 84101'});
add({name:'Seabird Bar & Vinyl Room',cuisine:'Cocktail Bar / Seafood',neighborhood:'Gateway',score:80,price:2,tags:['Cocktails','Seafood','Live Music','Rooftop','Date Night'],lat:40.7680,lng:-111.9033,instagram:'@seabirdutah',website:'https://www.seabirdutah.com',address:'7 S Rio Grande St, Salt Lake City, UT 84101'});

// University area (2)
add({name:"'mina Ristorante Siciliano",cuisine:'Sicilian / Italian',neighborhood:'University',score:85,price:2,tags:['Italian','Date Night','Cocktails','Local Favorites'],indicators:['new-opening'],lat:40.7499,lng:-111.8775,instagram:'@mina.ristorante.slc',website:'https://www.minaslc.com',address:'439 E 900 S, Salt Lake City, UT 84111'});
add({name:'HandoSake Sushi',cuisine:'Japanese / Hand Roll Bar',neighborhood:'Downtown SLC',score:84,price:2,tags:['Sushi','Casual','Late Night','Local Favorites'],lat:40.7620,lng:-111.8909,instagram:'@handosake',website:'https://www.handosake.com',address:'222 S Main St, Salt Lake City, UT 84101'});

// Marmalade (1 - Marmalade Brunch House already exists)
add({name:'Repeal',cuisine:'Cocktail Bar / Jazz',neighborhood:'Marmalade',score:83,price:2,tags:['Cocktails','Live Music','Date Night','Late Night'],indicators:['hidden-gem'],lat:40.7636,lng:-111.8882,instagram:'@repealutah',website:'https://www.repealutah.com',address:'19 E 200 S, Salt Lake City, UT 84111'});

// Downtown SLC fill gaps (4)
add({name:'STK Steakhouse SLC',cuisine:'Steakhouse',neighborhood:'Downtown SLC',score:86,price:4,tags:['Steakhouse','Cocktails','Happy Hour','Date Night','Live Music','Nightlife'],lat:40.7645,lng:-111.9018,instagram:'@stksteakhouse',website:'https://www.stksteakhouse.com',address:'111 S 300 W, Salt Lake City, UT 84101'});
add({name:'Van Ryder',cuisine:'Rooftop Bar / American',neighborhood:'Downtown SLC',score:84,price:3,tags:['Rooftop','Cocktails','Date Night','Scenic','Happy Hour'],lat:40.7646,lng:-111.9017,instagram:'@vanryderslc',website:'https://www.vanrydersaltlake.com',address:'131 S 300 W, Salt Lake City, UT 84101'});
add({name:'Lake Effect',cuisine:'Cocktail Bar / Latin',neighborhood:'Downtown SLC',score:83,price:2,tags:['Cocktails','Live Music','Late Night','Date Night'],lat:40.7637,lng:-111.8956,instagram:'@lakeeffectslc',website:'https://www.lakeeffectslc.com',address:'155 W 200 S, Salt Lake City, UT 84101'});
add({name:'Mar Muntanya',cuisine:'Spanish / Rooftop',neighborhood:'Downtown SLC',score:87,price:3,tags:['Rooftop','Spanish','Seafood','Date Night','Cocktails','Scenic'],indicators:['hidden-gem'],lat:40.7617,lng:-111.8928,instagram:'@marmuntanyaslc',website:'https://www.mar-muntanya.com',address:'170 S W Temple, Salt Lake City, UT 84101'});

h = h.substring(0, s) + JSON.stringify(arr) + h.substring(e);
fs.writeFileSync('index.html', h, 'utf8');
console.log('\nAdded:', count, '| SLC total:', arr.length);
