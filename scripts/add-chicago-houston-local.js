const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Add Chicago hotels to HOTEL_DATA
const hotelIdx = html.indexOf('const HOTEL_DATA = {');
const hotelClose = html.indexOf('};', hotelIdx);

// Check if chicago already exists
if(!html.substring(hotelIdx, hotelClose).includes("'chicago'")){
  const chicagoHotels = `
  'chicago': [
    {"id":1,"tier":"Ultra Luxury","tierEmoji":"👑","name":"The Peninsula Chicago","tagline":"Michigan Avenue Perfection.","neighborhood":"Streeterville","address":"108 E Superior St, Chicago, IL 60611","lat":41.8969,"lng":-87.6250,"instagram":"@thepeninsula","website":"https://www.peninsula.com/en/chicago","priceRange":"$500-$1,500+/night","score":97,"awards":"Forbes Five-Star","about":"339-room Magnificent Mile landmark with the best service in Chicago. Rooftop pool with skyline views, Shanghai Terrace for Chinese fine dining, and technology so advanced every room has a bedside tablet controlling everything.","highlights":[{"icon":"🏊","label":"Rooftop Pool","note":"Stunning pool with Michigan Ave views"},{"icon":"🍽","label":"Shanghai Terrace","note":"Best hotel Chinese restaurant in the US"},{"icon":"📍","label":"Mag Mile","note":"Steps from Michigan Avenue shopping"}],"insiderTips":["The rooftop pool is one of the best in Chicago","Shanghai Terrace dim sum is worth a visit even if not a guest","Request a lake-view room on a high floor"],"bestFor":["Luxury","Business","Mag Mile","Romance"]},
    {"id":2,"tier":"Luxury","tierEmoji":"⭐","name":"The Langham Chicago","tagline":"Mies van der Rohe Masterpiece.","neighborhood":"River North","address":"330 N Wabash Ave, Chicago, IL 60611","lat":41.8893,"lng":-87.6268,"instagram":"@langaborchicago","website":"https://www.langhamhotels.com/en/the-langham/chicago","priceRange":"$350-$800/night","score":95,"awards":"Forbes Five-Star","about":"316-room hotel inside the legendary IBM Tower designed by Mies van der Rohe. Floor-to-ceiling windows, a world-class spa, Travelle restaurant, and architectural significance that makes every stay feel historic.","highlights":[{"icon":"🏛","label":"Mies Building","note":"Inside the iconic IBM Tower"},{"icon":"💆","label":"Chuan Spa","note":"Traditional Chinese wellness spa"},{"icon":"🍽","label":"Travelle","note":"Mediterranean restaurant with river views"}],"insiderTips":["The building itself is a masterpiece -- appreciate the architecture","River-facing rooms have stunning Chicago River views","The spa is one of the best in the Midwest"],"bestFor":["Architecture","Business","Spa","River Views"]},
    {"id":3,"tier":"Boutique","tierEmoji":"🏨","name":"Soho House Chicago","tagline":"Members Club Meets Hotel.","neighborhood":"West Loop","address":"113-125 N Green St, Chicago, IL 60607","lat":41.8845,"lng":-87.6488,"instagram":"@sohohousechicago","website":"https://www.sohohouse.com/houses/soho-house-chicago","priceRange":"$250-$500/night","score":91,"awards":"","about":"40-room hotel inside the Soho House members club in a converted belt factory in the West Loop. Rooftop pool, screening room, and access to the club restaurant and bars. The creative industry HQ of Chicago.","highlights":[{"icon":"🏊","label":"Rooftop Pool","note":"Heated year-round with skyline views"},{"icon":"🎬","label":"Screening Room","note":"Private cinema for guests"},{"icon":"📍","label":"West Loop","note":"Heart of Chicago dining scene"}],"insiderTips":["Non-members can stay at the hotel and access all facilities","The rooftop is heated year-round -- even in winter","Walk to Girl & the Goat and Monteverde in 5 minutes"],"bestFor":["Creative Scene","West Loop","Rooftop","Young Professionals"]},
    {"id":4,"tier":"Boutique","tierEmoji":"🏨","name":"The Hoxton Chicago","tagline":"East London Cool in Fulton Market.","neighborhood":"West Loop","address":"200 N Green St, Chicago, IL 60607","lat":41.8860,"lng":-87.6488,"instagram":"@thehoxton","website":"https://www.thehoxton.com/chicago","priceRange":"$180-$400/night","score":89,"awards":"","about":"182-room hotel in Fulton Market with Cira restaurant, a gorgeous lobby bar, and rooms starting surprisingly cheap for the location. East London sensibility meets Chicago industrial chic.","highlights":[{"icon":"🍽","label":"Cira","note":"Mediterranean restaurant and bar"},{"icon":"📍","label":"Fulton Market","note":"Chicago hottest dining neighborhood"},{"icon":"💰","label":"Value","note":"Great rates for the location"}],"insiderTips":["The lobby bar is one of the best hangouts in Fulton Market","Rooms are small but beautifully designed","Walk to Randolph Street restaurants in 2 minutes"],"bestFor":["Fulton Market","Value","Design","Young Travelers"]},
    {"id":5,"tier":"Mid-Range","tierEmoji":"💰","name":"Virgin Hotels Chicago","tagline":"Richard Branson Disrupts Hotels.","neighborhood":"The Loop","address":"203 N Wabash Ave, Chicago, IL 60601","lat":41.8867,"lng":-87.6264,"instagram":"@virginhotelschi","website":"https://virginhotels.com/chicago","priceRange":"$180-$350/night","score":88,"awards":"","about":"250-room hotel with a rooftop pool and bar, Cerise lounge, and the irreverent Virgin brand energy. The two-room chamber design (bedroom + dressing room with sliding door) is genuinely clever. Free wifi, no resort fees.","highlights":[{"icon":"🏊","label":"Rooftop Pool","note":"Pool + Cerise rooftop bar"},{"icon":"💰","label":"No Fees","note":"No resort fees, free wifi, fair minibar"},{"icon":"📍","label":"The Loop","note":"Steps from Millennium Park and the riverwalk"}],"insiderTips":["The Cerise rooftop is open to non-guests and is great for sunset drinks","No resort fees is genuinely refreshing","The slider between bedroom and dressing room is surprisingly useful"],"bestFor":["Value","Loop Location","Rooftop","Solo Travel"]}
  ],`;
  html = html.substring(0, hotelClose) + chicagoHotels + '\n' + html.substring(hotelClose);
  console.log('Added Chicago hotels');
}

// 2. Add Houston hotels
if(!html.substring(hotelIdx, html.indexOf('};', hotelIdx+10)).includes("'houston'")){
  const hotelClose2 = html.indexOf('};', hotelIdx);
  const houstonHotels = `
  'houston': [
    {"id":1,"tier":"Luxury","tierEmoji":"⭐","name":"Hotel Granduca Houston","tagline":"Italian Villa in the Galleria.","neighborhood":"Galleria / Uptown","address":"1080 Uptown Park Blvd, Houston, TX 77056","lat":29.7503,"lng":-95.4611,"instagram":"@hotelgranducahouston","website":"https://www.granducahouston.com","priceRange":"$300-$700/night","score":93,"awards":"Forbes Five-Star","about":"122-room Italian Renaissance-style hotel with Ristorante Cavour, a stunning courtyard, and the kind of old-world elegance that is increasingly rare. The Galleria location is perfect for shopping and upscale dining.","highlights":[{"icon":"🍽","label":"Ristorante Cavour","note":"Refined Italian dining"},{"icon":"🏛","label":"Architecture","note":"Italian Renaissance courtyard"},{"icon":"📍","label":"Galleria","note":"Steps from upscale shopping"}],"insiderTips":["The courtyard is one of the most beautiful spaces in Houston","Ristorante Cavour Sunday brunch is excellent","Walk to Pappas Bros Steakhouse in 5 minutes"],"bestFor":["Romance","Italian Elegance","Galleria","Business"]},
    {"id":2,"tier":"Boutique","tierEmoji":"🏨","name":"Hotel ZaZa Houston","tagline":"Boutique Luxury in the Museum District.","neighborhood":"Museum District","address":"5701 Main St, Houston, TX 77005","lat":29.7260,"lng":-95.3869,"instagram":"@hotelzaza","website":"https://www.hotelzaza.com/houston","priceRange":"$250-$600/night","score":90,"awards":"","about":"315-room boutique hotel in the Museum District with themed concept suites, a gorgeous pool, and Monarch restaurant. Each concept suite has its own wild personality. Walking distance to MFAH and Hermann Park.","highlights":[{"icon":"🏊","label":"Pool","note":"Stunning resort-style pool"},{"icon":"🎨","label":"Concept Suites","note":"Individually themed suites"},{"icon":"📍","label":"Museum District","note":"Walk to MFAH and Hermann Park"}],"insiderTips":["The concept suites are worth the splurge -- each one is unique","The pool scene on weekends is very Houston","Walk to the Menil Collection in 10 minutes"],"bestFor":["Museum District","Pool","Unique Rooms","Date Night"]},
    {"id":3,"tier":"Mid-Range","tierEmoji":"💰","name":"The Lancaster Hotel","tagline":"Historic Theater District Gem.","neighborhood":"Downtown","address":"701 Texas Ave, Houston, TX 77002","lat":29.7584,"lng":-95.3613,"instagram":"@lancastertx","website":"https://www.thelancaster.com","priceRange":"$150-$300/night","score":87,"awards":"","about":"93-room historic hotel in the Theater District since 1926. Intimate, elegant, and perfectly located for shows at the Alley Theatre and Wortham Center. The kind of small luxury hotel Houston needs more of.","highlights":[{"icon":"🎭","label":"Theater District","note":"Steps from Alley Theatre and Wortham Center"},{"icon":"🏛","label":"Historic","note":"Landmark since 1926"},{"icon":"📍","label":"Downtown","note":"Walk to Discovery Green and Toyota Center"}],"insiderTips":["Perfect for theater nights -- dinner at Xochi then a show","The building history is fascinating -- ask at the front desk","One of the few walkable hotel experiences in Houston"],"bestFor":["Theater","History","Downtown","Intimate"]}
  ],`;
  html = html.substring(0, hotelClose2) + houstonHotels + '\n' + html.substring(hotelClose2);
  console.log('Added Houston hotels');
}

// 3. Add Chicago and Houston parks
const parkIdx = html.indexOf('const PARK_DATA = {');
if(parkIdx > -1){
  const parkClose = html.indexOf('};', parkIdx);
  let parkInsert = '';
  if(!html.substring(parkIdx, parkClose).includes("'chicago'")){
    parkInsert += `
  'chicago': [
    {name:"Millennium Park",desc:"24.5 acres of world-class public art including The Bean, Jay Pritzker Pavilion, and Crown Fountain. Free concerts all summer.",address:"201 E Randolph St",hours:"6AM-11PM daily",free:true},
    {name:"Lincoln Park",desc:"1,200 acres along the lakefront with the free zoo, North Avenue Beach, and miles of running trails. Chicago backyard.",address:"N Stockton Dr",hours:"6AM-11PM",free:true},
    {name:"Grant Park",desc:"The front yard of Chicago -- Buckingham Fountain, the Art Institute, and host of Lollapalooza every summer.",address:"337 E Randolph St",hours:"6AM-11PM",free:true},
    {name:"Chicago Riverwalk",desc:"1.25 miles of waterfront with wine bars, kayak rentals, and restaurants. The best free walk in the city.",address:"Chicago Riverwalk",hours:"6AM-11PM",free:true},
    {name:"Maggie Daley Park",desc:"Massive playground, rock climbing wall, ice skating ribbon in winter, and mini golf. The best park for families.",address:"337 E Randolph St",hours:"6AM-11PM",free:true}
  ],`;
    console.log('Added Chicago parks');
  }
  if(!html.substring(parkIdx, parkClose).includes("'houston'")){
    parkInsert += `
  'houston': [
    {name:"Buffalo Bayou Park",desc:"160 acres along the bayou with walking trails, kayak rentals, dog park, and skyline views. Houston Central Park.",address:"1800 Allen Pkwy",hours:"6AM-11PM",free:true},
    {name:"Hermann Park",desc:"445 acres with the Houston Zoo, Japanese Garden, Miller Outdoor Theatre (free shows), and pedal boats.",address:"6001 Fannin St",hours:"6AM-11PM",free:true},
    {name:"Discovery Green",desc:"12-acre downtown park with a lake, restaurants, free concerts, and ice skating in winter.",address:"1500 McKinney St",hours:"6AM-11PM",free:true},
    {name:"Memorial Park",desc:"1,500 acres of trails, golf course, tennis center, and running paths. The largest urban park in Texas.",address:"6501 Memorial Dr",hours:"6AM-10PM",free:true}
  ],`;
    console.log('Added Houston parks');
  }
  if(parkInsert) html = html.substring(0, parkClose) + parkInsert + '\n' + html.substring(parkClose);
}

// 4. Add Chicago and Houston museums
const museumIdx = html.indexOf('const MUSEUM_DATA = {');
if(museumIdx > -1){
  const museumClose = html.indexOf('};', museumIdx);
  let museumInsert = '';
  if(!html.substring(museumIdx, museumClose).includes("'chicago'")){
    museumInsert += `
  'chicago': [
    {name:"Art Institute of Chicago",desc:"One of the oldest and largest art museums in the world. Nighthawks, American Gothic, A Sunday on La Grande Jatte.",address:"111 S Michigan Ave",hours:"11AM-5PM, Thu 8PM",price:"$35",website:"https://www.artic.edu"},
    {name:"Field Museum",desc:"World-class natural history museum with SUE the T-Rex, Egyptian mummies, and 40 million artifacts.",address:"1400 S DuSable Lake Shore Dr",hours:"9AM-5PM",price:"$30",website:"https://www.fieldmuseum.org"},
    {name:"Museum of Science and Industry",desc:"The largest science museum in the Western Hemisphere. The U-505 submarine and coal mine tour are unforgettable.",address:"5700 S DuSable Lake Shore Dr",hours:"9:30AM-4PM",price:"$22",website:"https://www.msichicago.org"},
    {name:"Shedd Aquarium",desc:"One of the largest aquariums in the world on the lakefront. Beluga whales, dolphins, and the Caribbean reef.",address:"1200 S DuSable Lake Shore Dr",hours:"9AM-5PM",price:"$40",website:"https://www.sheddaquarium.org"},
    {name:"Museum of Contemporary Art",desc:"MCA Chicago showcases cutting-edge contemporary art in a stunning Streeterville building.",address:"220 E Chicago Ave",hours:"10AM-9PM Tue, 10AM-5PM Wed-Sun",price:"$15",website:"https://mcachicago.org"}
  ],`;
    console.log('Added Chicago museums');
  }
  if(!html.substring(museumIdx, museumClose).includes("'houston'")){
    museumInsert += `
  'houston': [
    {name:"Museum of Fine Arts Houston",desc:"One of the largest art museums in the US with 70,000+ works. The Cullinan Hall by Mies van der Rohe is architectural perfection.",address:"1001 Bissonnet St",hours:"10AM-5PM, Thu 9PM",price:"$25",website:"https://www.mfah.org"},
    {name:"The Menil Collection",desc:"Free world-class art museum with works by Picasso, Warhol, and Magritte in a Renzo Piano building. One of the best free museums in America.",address:"1533 Sul Ross St",hours:"11AM-7PM Wed-Sun",price:"Free",website:"https://www.menil.org"},
    {name:"Houston Museum of Natural Science",desc:"Dinosaur hall, gem vault, planetarium, and a butterfly center. One of the most popular museums in the US.",address:"5555 Hermann Park Dr",hours:"9AM-5PM",price:"$25",website:"https://www.hmns.org"},
    {name:"Space Center Houston",desc:"Official NASA visitor center. Touch a moon rock, see Mission Control, tour real NASA facilities.",address:"1601 E NASA Pkwy",hours:"10AM-5PM",price:"$30",website:"https://spacecenter.org"}
  ],`;
    console.log('Added Houston museums');
  }
  if(museumInsert) html = html.substring(0, museumClose) + museumInsert + '\n' + html.substring(museumClose);
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
