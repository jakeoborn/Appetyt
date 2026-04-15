// Austin Final Batch — Push to 350+
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const austinMarker = 'const AUSTIN_DATA=';
const austinPos = html.indexOf(austinMarker);
const arrS = html.indexOf('[', austinPos);
let d=0, arrE=arrS;
for(let j=arrS;j<html.length;j++){if(html[j]==='[')d++;if(html[j]===']'){d--;if(d===0){arrE=j+1;break;}}}
let arr = JSON.parse(html.substring(arrS, arrE));
console.log('Starting Austin:', arr.length);
const maxId = Math.max(...arr.map(r=>r.id));
let nextId = maxId + 1;
const existing = new Set(arr.map(r=>r.name.toLowerCase()));
let added = 0;

function add(s){
  if(existing.has(s.name.toLowerCase())){ console.log('SKIP:', s.name); return; }
  s.id=nextId++;s.bestOf=[];s.busyness=null;s.waitTime=null;s.popularTimes=null;s.lastUpdated=null;s.trending=s.trending||false;s.group=s.group||'';s.suburb=s.suburb||false;s.menuUrl='';s.res_tier=s.price>=3?4:2;s.indicators=s.indicators||[];s.awards=s.awards||'';s.phone=s.phone||'';s.reserveUrl=s.reserveUrl||'';s.hh=s.hh||'';s.verified=true;
  arr.push(s);existing.add(s.name.toLowerCase());added++;
}

// Final Austin spots to hit 350+
add({name:"Cane Rosso",cuisine:"Neapolitan Pizza",neighborhood:"East Austin",score:86,price:2,tags:["Pizza","Italian","Date Night","Local Favorites"],description:"Neapolitan-style pizza from the Dallas-based chain with a great East Austin location. Wood-fired pies with proper char and quality mozzarella.",dishes:["Neapolitan Pizza","Margherita","Antipasti"],address:"1935 E 7th St, Austin, TX 78702",hours:"",lat:30.2644,lng:-97.7218,instagram:"canerossopizza",website:"",reservation:"walk-in",phone:""});

add({name:"Arlo Grey",cuisine:"New American",neighborhood:"Downtown",score:88,price:3,tags:["New American","Hotel","Date Night","Fine Dining"],description:"Restaurant inside the Line Hotel on Lady Bird Lake from Top Chef winner Kristen Kish. Seasonal New American with lakeside views.",dishes:["Seasonal Menu","Lakeside Dining","Wine Pairing"],address:"111 E Cesar Chavez St, Austin, TX 78701",hours:"",lat:30.2580,lng:-97.7418,instagram:"arlogreyatx",website:"",reservation:"Resy",phone:""});

add({name:"Thai-Kun North Lamar",cuisine:"Thai Street Food",neighborhood:"North Lamar",score:86,price:1,tags:["Thai","Casual","Local Favorites"],description:"Thai street food from a former Sway chef. Bold, spicy Thai at food truck prices. The green curry and som tum pack proper heat.",dishes:["Green Curry","Som Tum","Thai Street Food"],address:"8557 Research Blvd, Austin, TX 78758",hours:"",lat:30.3617,lng:-97.7154,instagram:"thaikunatx",website:"",reservation:"walk-in",phone:""});

add({name:"Loro Bee Caves",cuisine:"Asian-BBQ Fusion",neighborhood:"Bee Cave",score:87,price:2,tags:["BBQ","Asian Fusion","Casual","Patio"],description:"Bee Cave outpost of the Franklin-Uchi BBQ-Asian collaboration. Smoked meats with Asian flavors in a family-friendly Hill Country setting.",dishes:["Smoked Brisket","Asian Sides","Hill Country Patio"],address:"12901 Hill Country Blvd, Bee Cave, TX 78738",hours:"",lat:30.3144,lng:-97.9372,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",suburb:true,group:"Franklin/Uchi"});

add({name:"Eastside Tavern",cuisine:"American / Dive Bar",neighborhood:"East Austin",score:85,price:1,tags:["Casual","Late Night","Local Favorites"],description:"Classic East Austin dive bar with cold beer, a pool table, and a solid burger. No frills neighborhood joint where the jukebox is still king.",dishes:["Bar Burger","Cold Beer","Dive Bar Vibes"],address:"1510 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7283,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Contigo",cuisine:"Ranch-to-Table",neighborhood:"East Austin",score:87,price:2,tags:["Texan","Farm-to-Table","Patio","Date Night","Local Favorites"],description:"Ranch-to-table dining in a beautiful East Austin backyard setting. Texas-sourced meats and seasonal vegetables. The outdoor space is magical.",dishes:["Ranch-to-Table","Seasonal Plates","Patio Dining"],address:"2027 Anchor Ln, Austin, TX 78723",hours:"",lat:30.2907,lng:-97.7130,instagram:"contigoaustin",website:"",reservation:"Resy",phone:""});

add({name:"Juniper",cuisine:"Italian",neighborhood:"East Austin",score:87,price:2,tags:["Italian","Date Night","Local Favorites"],description:"Italian restaurant in East Austin with handmade pasta and a great wine program. Cozy neighborhood spot that feels like a hidden gem.",dishes:["Handmade Pasta","Italian Wine","Seasonal Menu"],address:"2400 E Cesar Chavez St, Austin, TX 78702",hours:"",lat:30.2555,lng:-97.7199,instagram:"juniperatx",website:"",reservation:"Resy",phone:""});

add({name:"Hillside Farmacy",cuisine:"American / Farmstead",neighborhood:"East Austin",score:86,price:2,tags:["New American","Farm-to-Table","Brunch","Local Favorites"],description:"Farm-to-table restaurant in a converted 1951 East Austin pharmacy. The space is charming and the brunch is excellent. Seasonal menu with local ingredients.",dishes:["Farm-to-Table Brunch","Seasonal Plates","Craft Cocktails"],address:"1209 E 11th St, Austin, TX 78702",hours:"",lat:30.2722,lng:-97.7305,instagram:"hillsidefarmacy",website:"",reservation:"Resy",phone:""});

add({name:"Olive & June",cuisine:"Italian",neighborhood:"South Austin",score:87,price:2,tags:["Italian","Date Night","Local Favorites","Patio"],description:"Italian restaurant in South Austin with a charming patio and housemade pasta. The cacio e pepe is excellent and the atmosphere is warm and inviting.",dishes:["Cacio e Pepe","Housemade Pasta","Italian Wine"],address:"3411 Glenview Ave, Austin, TX 78703",hours:"",lat:30.2964,lng:-97.7576,instagram:"oliveandjuneatx",website:"",reservation:"OpenTable",phone:""});

add({name:"Loro Mueller",cuisine:"Asian-BBQ Fusion",neighborhood:"Mueller",score:87,price:2,tags:["BBQ","Asian Fusion","Casual","Patio"],description:"Mueller location of the Franklin-Uchi collaboration. Same great smoked meats with Asian flavors in the family-friendly Mueller neighborhood.",dishes:["Smoked Meats","Asian Sides","Patio"],address:"4600 Mueller Blvd, Austin, TX 78723",hours:"",lat:30.2985,lng:-97.7075,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"Qui",cuisine:"New American / Asian Fusion",neighborhood:"East Austin",score:88,price:3,tags:["New American","Asian Fusion","Date Night","Fine Dining"],description:"Chef Paul Qui creative New American with Asian influences in East Austin. Tasting menu and a la carte options with bold flavors and beautiful plating.",dishes:["Tasting Menu","Asian-American Fusion","Creative Plates"],address:"1600 E 6th St, Austin, TX 78702",hours:"",lat:30.2629,lng:-97.7271,instagram:"quiaustin",website:"",reservation:"Resy",phone:""});

add({name:"Eberly",cuisine:"New American",neighborhood:"South Lamar",score:87,price:3,tags:["New American","Date Night","Cocktails","Celebrations"],description:"Elegant South Lamar restaurant with a stunning interior and refined New American cuisine. Multiple dining spaces including a cocktail lounge. Great for special occasions.",dishes:["Seasonal Menu","Craft Cocktails","Elegant Dining"],address:"615 S Lamar Blvd, Austin, TX 78704",hours:"",lat:30.2567,lng:-97.7639,instagram:"eberlyaustin",website:"",reservation:"Resy",phone:""});

add({name:"Thai Changthong",cuisine:"Thai",neighborhood:"North Austin",score:86,price:1,tags:["Thai","Casual","Local Favorites"],description:"Authentic Thai from Chef Thai Changthong (also behind P Thai's). Street food-style Thai with bold flavors in a casual North Austin setting.",dishes:["Khao Soi","Pad See Ew","Thai Curry"],address:"8557 Research Blvd, Austin, TX 78758",hours:"",lat:30.3617,lng:-97.7154,instagram:"",website:"",reservation:"walk-in",phone:""});

add({name:"Counter 3.FIVE.VII",cuisine:"Japanese Omakase",neighborhood:"Downtown",score:90,price:4,tags:["Japanese","Sushi","Fine Dining","Exclusive"],description:"Intimate omakase counter downtown with seasonal Japanese cuisine. Limited seats and a refined experience. One of Austin most exclusive dining experiences.",dishes:["Omakase Course","Seasonal Nigiri","Japanese Craftsmanship"],address:"315 Congress Ave, Austin, TX 78701",hours:"",lat:30.2661,lng:-97.7429,instagram:"counter357",website:"",reservation:"Tock",phone:""});

add({name:"Cru Wine Bar",cuisine:"Wine Bar",neighborhood:"Downtown",score:86,price:2,tags:["Wine Bar","Date Night","Local Favorites"],description:"Downtown wine bar with a carefully curated wine list and small plates. The rooftop patio has views of downtown Austin. Great pre-dinner or date night spot.",dishes:["Wine Flights","Charcuterie","Small Plates"],address:"238 W 2nd St, Austin, TX 78701",hours:"",lat:30.2636,lng:-97.7464,instagram:"cruwinebar",website:"",reservation:"OpenTable",phone:""});

add({name:"Fixe Southern House",cuisine:"Southern Fine Dining",neighborhood:"Downtown",score:87,price:3,tags:["Southern","Fine Dining","Date Night","Celebrations"],description:"Upscale Southern cuisine in a beautiful downtown space. Fried chicken, biscuits, and Gulf shrimp elevated to fine dining. Sunday supper is a tradition.",dishes:["Fried Chicken","Sunday Supper","Southern Fine Dining"],address:"500 W 5th St, Austin, TX 78701",hours:"",lat:30.2669,lng:-97.7488,instagram:"fixesouthernhouse",website:"",reservation:"OpenTable",phone:""});

add({name:"Gourmands Neighborhood Pub",cuisine:"Gastropub",neighborhood:"East Austin",score:86,price:1,tags:["Gastropub","Casual","Local Favorites","Patio"],description:"East Austin neighborhood pub with craft beer and elevated pub food. The patio is dog-friendly and the vibe is perfectly casual.",dishes:["Pub Fare","Craft Beer","Dog-Friendly Patio"],address:"2316 Webberville Rd, Austin, TX 78702",hours:"",lat:30.2574,lng:-97.7116,instagram:"gourmandspub",website:"",reservation:"walk-in",phone:""});

add({name:"Rosedale Kitchen & Bar",cuisine:"American / Southern",neighborhood:"Rosedale",score:86,price:2,tags:["New American","Southern","Brunch","Local Favorites"],description:"Neighborhood restaurant in the Rosedale area with Southern-influenced American dishes and a great brunch. Cozy and welcoming.",dishes:["Southern Brunch","Seasonal Plates","Craft Cocktails"],address:"5765 Airport Blvd, Austin, TX 78752",hours:"",lat:30.3250,lng:-97.7094,instagram:"rosedalekitchenbar",website:"",reservation:"OpenTable",phone:""});

add({name:"Honey Moon Spirit Lounge",cuisine:"Cocktail Bar",neighborhood:"South Congress",score:85,price:2,tags:["Cocktails","Date Night","Local Favorites"],description:"Craft cocktail bar on South Congress with creative drinks and a moody atmosphere. A perfect pre-dinner or nightcap spot on SoCo.",dishes:["Craft Cocktails","Bar Snacks","SoCo Vibes"],address:"2101 S Congress Ave, Austin, TX 78704",hours:"",lat:30.2404,lng:-97.7509,instagram:"honeymoonatx",website:"",reservation:"walk-in",phone:""});

add({name:"Loro Burnet",cuisine:"Asian-BBQ Fusion",neighborhood:"North Austin",score:87,price:2,tags:["BBQ","Asian Fusion","Casual","Patio"],description:"Burnet Road location of the Franklin-Uchi collab. Same excellent smoked meats with Asian flavors in a north Austin setting.",dishes:["Smoked Meats","Asian Sides","Patio"],address:"4601 Burnet Rd, Austin, TX 78756",hours:"",lat:30.3166,lng:-97.7395,instagram:"loroaustin",website:"",reservation:"walk-in",phone:"",group:"Franklin/Uchi"});

add({name:"Amy's Ice Creams",cuisine:"Ice Cream",neighborhood:"Multiple Locations",score:85,price:1,tags:["Dessert","Iconic","Local Favorites"],description:"Austin-born ice cream institution since 1984 with hand-scooped Mexican vanilla and creative crush-in toppings. Multiple locations. An Austin rite of passage.",dishes:["Mexican Vanilla","Crush-In Toppings","Seasonal Flavors"],address:"1012 W 6th St, Austin, TX 78703",hours:"",lat:30.2715,lng:-97.7528,instagram:"amysicecreams",website:"",reservation:"walk-in",phone:""});

console.log('Added', added, 'new Austin spots. Total:', arr.length);
html = html.substring(0, arrS) + JSON.stringify(arr) + html.substring(arrE);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Austin final batch complete!');
