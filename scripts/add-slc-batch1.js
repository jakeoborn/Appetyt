const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const marker = 'const SLC_DATA=';
const p = html.indexOf(marker);
const arrS = html.indexOf('[', p);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++; s.bestOf=[]; s.busyness=null; s.waitTime=null;
  s.popularTimes=null; s.lastUpdated=null; s.trending=s.trending||false;
  s.group=s.group||''; s.suburb=s.suburb||false; s.menuUrl='';
  s.res_tier=s.price>=3?4:2; s.indicators=s.indicators||[];
  s.awards=s.awards||''; s.phone=s.phone||''; s.reserveUrl=''; s.hh='';
  s.verified=true; s.hours=s.hours||''; s.dishes=s.dishes||[];
  arr.push(s); existing.add(s.name.toLowerCase());
  console.log('ADDED:', s.name, '(id:', s.id, ')');
}

// Sundance / Provo Canyon
add({name:'The Tree Room',cuisine:'New American Fine Dining',neighborhood:'Sundance / Provo Canyon',score:89,price:4,tags:['Fine Dining','Date Night','Scenic','Celebrations','Romantic'],indicators:['iconic'],description:'Forbes Four-Star fine dining at Sundance Mountain Resort with seasonal mountain cuisine in a stunning art-filled setting.',address:'8841 N Alpine Loop Rd, Sundance, UT 84604',lat:40.3914,lng:-111.5883,instagram:'@sundanceresort',website:'https://www.sundanceresort.com/dining/tree-room/',reservation:'OpenTable',photoUrl:''});
add({name:'Foundry Grill',cuisine:'American',neighborhood:'Sundance / Provo Canyon',score:82,price:3,tags:['Brunch','Casual','Family Friendly','Scenic'],indicators:[],description:'Casual all-day dining at Sundance Resort with locally inspired fare and famous Sunday brunch.',address:'8841 N Alpine Loop Rd, Sundance, UT 84604',lat:40.3914,lng:-111.5883,instagram:'@sundanceresort',website:'https://www.sundanceresort.com/dining/foundry-grill/',reservation:'walk-in',photoUrl:''});
add({name:'Owl Bar',cuisine:'American Bar',neighborhood:'Sundance / Provo Canyon',score:78,price:2,tags:['Bar','Live Music','Cocktails','Late Night'],indicators:['iconic'],description:'Historic saloon at Sundance with live music weekends, craft cocktails, and a legendary Butch Cassidy-era back bar.',address:'8841 N Alpine Loop Rd, Sundance, UT 84604',lat:40.3914,lng:-111.5883,instagram:'@sundanceresort',website:'https://www.sundanceresort.com/dining/owl-bar/',reservation:'walk-in',photoUrl:''});

// Trolley Square
add({name:'Rodizio Grill',cuisine:'Brazilian Steakhouse',neighborhood:'Trolley Square',score:84,price:3,tags:['Steakhouse','Celebrations','Date Night','Fine Dining'],indicators:[],description:'Authentic Brazilian churrascaria in historic Trolley Square with unlimited tableside-carved rotisserie meats.',address:'600 S 700 E Fl 2, Salt Lake City, UT 84102',lat:40.7534,lng:-111.8738,instagram:'@rodiziogrillslc',website:'https://www.rodiziogrill.com/salt-lake-city/',reservation:'OpenTable',photoUrl:''});
add({name:'Desert Edge Brewery',cuisine:'Brewpub',neighborhood:'Trolley Square',score:80,price:2,tags:['Casual','Local Favorites','Patio','Happy Hour'],indicators:[],description:'SLC original craft brewery since 1972 inside landmark Trolley Square with house-brewed beers.',address:'273 Trolley Square, Salt Lake City, UT 84102',lat:40.7536,lng:-111.8741,instagram:'@desertedgebrewery',website:'https://desertedgebrewery.com/',reservation:'walk-in',photoUrl:''});
add({name:'Roux SLC',cuisine:'French Fusion',neighborhood:'Trolley Square',score:86,price:3,tags:['French','Date Night','Brunch','Fine Dining','Local Favorites'],indicators:['hidden-gem'],description:'Chef-driven French fusion with seasonal, locally sourced dishes in a cozy intimate setting.',address:'515 E 300 S, Salt Lake City, UT 84102',lat:40.7597,lng:-111.8757,instagram:'@roux.restaurant',website:'https://www.rouxslc.com/',reservation:'OpenTable',photoUrl:''});
add({name:'East Liberty Tap House',cuisine:'New American / Pub',neighborhood:'Trolley Square',score:80,price:2,tags:['Casual','Happy Hour','Local Favorites'],indicators:[],description:'Modern tavern with curated craft beers and elevated pub bites near Trolley Square.',address:'850 E 900 S, Salt Lake City, UT 84105',lat:40.7459,lng:-111.8663,instagram:'@eastlibertytaphouse',website:'https://www.eastlibertytaphouse.com',reservation:'walk-in',photoUrl:''});

// Liberty Park
add({name:'The Park Cafe',cuisine:'Breakfast / Brunch',neighborhood:'Liberty Park',score:83,price:1,tags:['Brunch','Casual','Local Favorites','Family Friendly'],indicators:['iconic'],description:'Beloved SLC breakfast institution since 1982 with famously generous portions steps from Liberty Park.',address:'604 E 1300 S, Salt Lake City, UT 84105',lat:40.7378,lng:-111.8737,instagram:'@theparkcafeslc',website:'https://theparkcafeslc.com/',reservation:'walk-in',photoUrl:''});
add({name:'Hub & Spoke Diner',cuisine:'New American / Diner',neighborhood:'Liberty Park',score:84,price:2,tags:['Brunch','Cocktails','Casual','Local Favorites'],indicators:[],description:'Modern diner near Liberty Park with creative brunch, craft cocktails, and famous boozy milkshakes.',address:'1291 S 1100 E, Salt Lake City, UT 84105',lat:40.7390,lng:-111.8638,instagram:'@hubandspokediner',website:'https://www.hubandspokediner.com/',reservation:'walk-in',photoUrl:''});
add({name:'Publik Kitchen',cuisine:'Cafe / American',neighborhood:'Liberty Park',score:79,price:2,tags:['Bakery/Coffee','Brunch','Casual','Local Favorites'],indicators:[],description:'Popular cafe near Liberty Park known for expertly crafted coffee and hearty brunch fare.',address:'975 E 900 S, Salt Lake City, UT 84105',lat:40.7453,lng:-111.8634,instagram:'@publikkitchen',website:'https://www.publikkitchen.com/',reservation:'walk-in',photoUrl:''});

// Cottonwood
add({name:'Porcupine Pub & Grille',cuisine:'American / Brewpub',neighborhood:'Cottonwood',score:81,price:2,tags:['Casual','Patio','Family Friendly','Local Favorites'],indicators:[],description:'Beloved spot at the mouth of Big Cottonwood Canyon since 1998 for craft beers and pub food.',address:'3698 Fort Union Blvd, Cottonwood Heights, UT 84121',lat:40.6195,lng:-111.8138,instagram:'@porcupinepub',website:'https://porcupinepub.com/',reservation:'walk-in',photoUrl:''});
add({name:'Saola Restaurant',cuisine:'Asian Fusion',neighborhood:'Cottonwood',score:85,price:3,tags:['Asian Fusion','Cocktails','Date Night','Local Favorites'],indicators:['hidden-gem'],description:'Stylish Asian fusion at the base of the Cottonwood Canyons.',address:'7307 Canyon Centre Pkwy, Cottonwood Heights, UT 84121',lat:40.6198,lng:-111.8132,instagram:'@saolaeats',website:'https://saolaeats.com/',reservation:'OpenTable',photoUrl:''});
add({name:'Lone Star Taqueria',cuisine:'Mexican / Tacos',neighborhood:'Cottonwood',score:82,price:1,tags:['Mexican','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Long-running local favorite serving famous fish tacos beloved by canyon-goers.',address:'2265 E Fort Union Blvd, Cottonwood Heights, UT 84121',lat:40.6172,lng:-111.7965,instagram:'@lonestartaqueria',website:'https://www.lstaq.com/',reservation:'walk-in',photoUrl:''});
add({name:'Zaferan Cafe',cuisine:'Middle Eastern / Iranian',neighborhood:'Cottonwood',score:84,price:2,tags:['Middle Eastern','Date Night','Local Favorites','Vegetarian Friendly'],indicators:['hidden-gem'],description:'Authentic Iranian cuisine with saffron-infused dishes, fragrant rice, and slow-cooked kebabs.',address:'7835 Highland Dr, Cottonwood Heights, UT 84121',lat:40.6311,lng:-111.8058,instagram:'@zaferancafe',website:'https://www.zaferancafe.com/',reservation:'walk-in',photoUrl:''});

// Midvale
add({name:'Bohemian Brewery',cuisine:'Czech / Brewpub',neighborhood:'Midvale',score:82,price:2,tags:['Casual','Local Favorites','Happy Hour','Patio'],indicators:[],description:'Utah only Czech-style craft brewery with authentic Bohemian lagers alongside schnitzel and goulash.',address:'94 E Fort Union Blvd, Midvale, UT 84047',lat:40.6215,lng:-111.8901,instagram:'@bohemianbrewery',website:'http://www.bohemianbrewery.com/',reservation:'walk-in',photoUrl:''});
add({name:'Hoof & Vine',cuisine:'Steakhouse',neighborhood:'Midvale',score:86,price:3,tags:['Steakhouse','Date Night','Fine Dining','Cocktails'],indicators:[],description:'Modern steakhouse serving premium cuts with an extensive wine list.',address:'7680 S Union Park Ave, Midvale, UT 84047',lat:40.6178,lng:-111.8685,instagram:'@hoofandvine',website:'https://www.hoofandvine.com/',reservation:'OpenTable',photoUrl:''});
add({name:'Del Barrio Cafe',cuisine:'Mexican / Yucatan',neighborhood:'Midvale',score:83,price:1,tags:['Mexican','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Celebrated taqueria known for Yucatan-style cochinita pibil tacos and vibrant street food.',address:'7676 S State St, Midvale, UT 84047',lat:40.6181,lng:-111.8898,instagram:'@delbarriocafe',website:'https://www.delbarriocafe.com/',reservation:'walk-in',photoUrl:''});
add({name:'Miyazaki',cuisine:'Japanese / Sushi',neighborhood:'Midvale',score:85,price:2,tags:['Sushi','Date Night','Local Favorites','Cocktails'],indicators:[],description:'Premium Japanese dining with traditional nigiri, creative maki, and ramen.',address:'6223 S State St Ste 4, Murray, UT 84107',lat:40.6478,lng:-111.8901,instagram:'@miyazakislc',website:'https://www.miyazakislc.com/',reservation:'walk-in',photoUrl:''});

// Murray
add({name:'Tea Rose Diner',cuisine:'Thai',neighborhood:'Murray',score:84,price:1,tags:['Thai','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Murray top-rated restaurant, a family-run Thai gem serving deeply authentic dishes.',address:'65 E 5th Ave, Murray, UT 84107',lat:40.6628,lng:-111.8893,instagram:'@tearosediner',website:'https://tearosediner.square.site/',reservation:'walk-in',photoUrl:''});
add({name:'Aroon Thai Kitchen',cuisine:'Thai',neighborhood:'Murray',score:86,price:1,tags:['Thai','Casual','Local Favorites','Critics Pick'],indicators:['hidden-gem'],description:'Highest Google-rated restaurant in Murray at 4.9 stars with authentic Thai noodles and curries.',address:'548 W 4500 S, Murray, UT 84123',lat:40.6534,lng:-111.9021,instagram:'@aroonthaikitchen',website:'https://www.aroonthaikitchen.com/',reservation:'walk-in',photoUrl:''});

// South Jordan
add({name:'The Angry Korean',cuisine:'Korean / Fusion',neighborhood:'South Jordan',score:85,price:2,tags:['Korean','Cocktails','Date Night','Local Favorites'],indicators:['hidden-gem'],description:'Standout Korean from Michelin-trained chefs blending authentic Korean tradition with American fusion.',address:'11587 S District Main Dr, South Jordan, UT 84095',lat:40.5578,lng:-111.9358,instagram:'@theangrykorean',website:'https://www.theangrykorean.com',reservation:'walk-in',photoUrl:''});
add({name:'Porch Restaurant',cuisine:'Southern American',neighborhood:'South Jordan',score:83,price:2,tags:['Southern','Casual','Family Friendly','Local Favorites'],indicators:[],description:'Comfort food on Daybreak SoDa Row with fried chicken, meatloaf, and Utah trout.',address:'11274 Kestrel Rise Rd G, South Jordan, UT 84009',lat:40.5541,lng:-111.9542,instagram:'@porchutah',website:'https://www.porchutah.com/',reservation:'walk-in',photoUrl:''});
add({name:'Saffron Valley',cuisine:'Indian Street Food',neighborhood:'South Jordan',score:83,price:2,tags:['Indian','Casual','Vegetarian Friendly','Local Favorites'],indicators:[],description:'Indian street food with vibrant regional specialties from dosas and chaat to kebabs.',address:'1098 W South Jordan Pkwy, South Jordan, UT 84095',lat:40.5601,lng:-111.9318,instagram:'@thesaffrongroup',website:'https://www.saffronvalley.com/',reservation:'walk-in',photoUrl:''});

// North Salt Lake
add({name:'Our Kitchen Cafe',cuisine:'Breakfast / Brunch',neighborhood:'North Salt Lake',score:83,price:1,tags:['Brunch','Casual','Local Favorites','Family Friendly'],indicators:[],description:'Top-rated North Salt Lake breakfast cafe with homestyle cooking.',address:'985 N Redwood Rd, North Salt Lake, UT 84054',lat:40.8453,lng:-111.9108,instagram:'@ourkitchencafensl',website:'https://www.ourkitchencafe.com/',reservation:'walk-in',photoUrl:''});

// Marmalade
add({name:'Marmalade Brunch House',cuisine:'Breakfast / Brunch',neighborhood:'Marmalade',score:81,price:2,tags:['Brunch','Cocktails','Casual','Local Favorites'],indicators:[],description:'Vibrant brunch spot with photogenic plates and creative cocktails since 2023.',address:'535 N 300 W, Salt Lake City, UT 84103',lat:40.7804,lng:-111.9018,instagram:'@marmalade.brunchhouse',website:'https://marmaladebrunchhouse.com/',reservation:'walk-in',photoUrl:''});

// West Valley
add({name:"Tuk Tuk's",cuisine:'Thai / Lao',neighborhood:'West Valley',score:84,price:1,tags:['Thai','Casual','Local Favorites'],indicators:['hole-in-wall'],description:'Authentic Thai and Lao with in-house sauces, renowned for creamy curries and bold noodle dishes.',address:'2222 W 3500 S B7, West Valley City, UT 84119',lat:40.7008,lng:-111.9398,instagram:'@tuktuks.ut',website:'https://tuktuks-slc.com/',reservation:'walk-in',photoUrl:''});
add({name:"Paulino's Contigo Peru",cuisine:'Peruvian',neighborhood:'West Valley',score:83,price:2,tags:['Peruvian','Casual','Local Favorites'],indicators:['hidden-gem'],description:'One of Utah only authentic Peruvian restaurants with lomo saltado and fresh ceviches.',address:'3411 S Redwood Rd, West Valley City, UT 84119',lat:40.7005,lng:-111.9458,instagram:'@paulinoscontigoperu',website:'',reservation:'walk-in',photoUrl:''});

html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('\nSLC total:', arr.length);
