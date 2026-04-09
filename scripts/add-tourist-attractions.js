// Add tourist attractions / activities to Dallas and Houston
// These use activity card type (cuisine matches activity keywords)
// Also backfills Houston and Chicago back toward 250
// Run: node scripts/add-tourist-attractions.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

function addToCity(tag, spots, isInline) {
  let a, e;
  if (isInline) {
    const chiIdx = html.indexOf(tag, html.indexOf('const CITY_DATA'));
    a = html.indexOf('[', chiIdx + 10);
  } else {
    const s = html.indexOf(tag);
    a = html.indexOf('[', s);
  }
  let d = 0; e = a;
  for (let i = a; i < html.length; i++) { if (html[i] === '[') d++; if (html[i] === ']') d--; if (d === 0) { e = i + 1; break; } }
  const arr = JSON.parse(html.slice(a, e));
  const existing = new Set(arr.map(r => r.name.toLowerCase()));
  let nextId = Math.max(...arr.map(r => r.id || 0)) + 1;
  let added = 0;

  spots.forEach(s => {
    if (existing.has(s.name.toLowerCase())) return;
    arr.push({
      id: nextId++, name: s.name, phone: s.phone || '', cuisine: s.cuisine,
      neighborhood: s.neighborhood, score: s.score, price: s.price || 0,
      tags: s.tags, indicators: [], hh: '', reservation: 'walk-in',
      awards: s.awards || '', description: s.description, dishes: s.dishes || [],
      address: s.address, hours: s.hours || '', lat: s.lat, lng: s.lng,
      bestOf: [], busyness: null, waitTime: null, popularTimes: null, lastUpdated: null,
      trending: false, group: '', instagram: s.instagram || '', website: s.website || '',
      suburb: s.suburb || false, reserveUrl: '', menuUrl: '', res_tier: 5,
    });
    existing.add(s.name.toLowerCase());
    added++;
    console.log('  ADDED:', s.name);
  });

  html = html.slice(0, a) + JSON.stringify(arr) + html.slice(e);
  return { count: arr.length, added };
}

// ═══════════════════════════════════════════
// DALLAS TOURIST ATTRACTIONS
// ═══════════════════════════════════════════
console.log('=== DALLAS ===');
const dallasAttractions = [
  {name:"Reunion Tower GeO-Deck",cuisine:"Tourist Attraction",neighborhood:"Downtown Dallas",score:87,price:2,tags:["Tourist Attraction","Iconic","Photo Op","Views"],description:"470-foot observation tower with 360-degree panoramic views of the Dallas skyline. The GeO-Deck features interactive touch screens that identify landmarks. Best at sunset when the skyline glows gold. A Dallas icon visible from anywhere in the city.",dishes:["Observation Deck","Interactive Displays"],address:"300 Reunion Blvd E, Dallas, TX 75207",phone:"(214) 712-7040",lat:32.7755,lng:-96.8089,instagram:"reuniontower",website:"https://www.reuniontower.com"},
  {name:"The Sixth Floor Museum at Dealey Plaza",cuisine:"Museum",neighborhood:"Downtown Dallas",score:90,price:2,tags:["Museum","Tourist Attraction","Historic","Landmark"],description:"The museum documenting the assassination of President John F. Kennedy, housed in the former Texas School Book Depository. The sixth and seventh floors feature exhibits on JFK's life, presidency, and legacy. One of the most visited museums in Texas and a profoundly moving experience.",dishes:["Museum Exhibits","Audio Tour"],address:"411 Elm St, Dallas, TX 75202",phone:"(214) 747-6660",lat:32.7802,lng:-96.8083,instagram:"jfk_museum",website:"https://www.jfk.org"},
  {name:"Dallas Museum of Art",cuisine:"Art Museum",neighborhood:"Arts District",score:89,price:0,tags:["Museum","Tourist Attraction","Art","Free"],description:"Free-admission art museum in the largest arts district in the US with 24,000+ works spanning 5,000 years. From ancient Egyptian artifacts to contemporary installations, the DMA is world-class and completely free. Thursday late nights add live music and cocktails.",dishes:["Free Admission","Exhibitions","Late Night Thursdays"],address:"1717 N Harwood St, Dallas, TX 75201",phone:"(214) 922-1200",lat:32.7877,lng:-96.8009,instagram:"dikimusm_art",website:"https://www.dma.org"},
  {name:"Perot Museum of Nature and Science",cuisine:"Museum",neighborhood:"Downtown Dallas",score:88,price:2,tags:["Museum","Tourist Attraction","Family","Interactive"],description:"Thom Mayne-designed science museum in downtown with 11 permanent exhibit halls covering dinosaurs, space, sports, and engineering. The hands-on exhibits make it perfect for kids and adults. The T. rex skeleton and earthquake simulator are highlights.",dishes:["Interactive Exhibits","Planetarium"],address:"2201 N Field St, Dallas, TX 75201",phone:"(214) 428-5555",lat:32.7869,lng:-96.8067,instagram:"perotmuseum",website:"https://www.perotmuseum.org"},
  {name:"Dallas Arboretum and Botanical Garden",cuisine:"Tourist Attraction",neighborhood:"East Dallas / Lakewood",score:89,price:2,tags:["Tourist Attraction","Park","Outdoor","Family","Seasonal"],description:"66-acre botanical garden on the shores of White Rock Lake with seasonal displays including Dallas Blooms (500,000 spring flowers) and the nationally recognized Rory Meyers Children's Adventure Garden. The lake views and garden pavilions make it one of the most beautiful spots in Dallas.",dishes:["Gardens","Seasonal Displays","Children's Garden"],address:"8525 Garland Rd, Dallas, TX 75218",phone:"(214) 515-6615",lat:32.8232,lng:-96.7166,instagram:"dallasarboretum",website:"https://www.dallasarboretum.org"},
  {name:"AT&T Stadium",cuisine:"Sports Venue",neighborhood:"Arlington",score:88,price:3,tags:["Sports","Tourist Attraction","Entertainment","Celebrations"],suburb:true,description:"The $1.2 billion home of the Dallas Cowboys with the world's largest column-free interior and a massive retractable roof. Tours run daily. Also hosts concerts, college football, and will be a FIFA World Cup 2026 venue with more matches than any other host city. America's Stadium.",dishes:["Stadium Tours","Game Day","Concerts"],address:"1 AT&T Way, Arlington, TX 76011",phone:"(817) 892-4000",lat:32.7473,lng:-97.0945,instagram:"attstadium",website:"https://www.attstadium.com"},
  {name:"Klyde Warren Park",cuisine:"Tourist Attraction",neighborhood:"Arts District",score:87,price:0,tags:["Tourist Attraction","Park","Free","Family","Food Trucks"],description:"5.2-acre urban park built over a freeway connecting Uptown to the Arts District. Free yoga, food trucks, chess, bocce, and cultural programming daily. The park single-handedly connected two neighborhoods and became the heart of Dallas. Free and open daily.",dishes:["Free Events","Food Trucks","Yoga","Games"],address:"2012 Woodall Rodgers Fwy, Dallas, TX 75201",phone:"(214) 716-4500",lat:32.7893,lng:-96.8009,instagram:"klydewarrenpark",website:"https://www.klydewarrenpark.org"},
  {name:"Nasher Sculpture Center",cuisine:"Art Museum",neighborhood:"Arts District",score:88,price:1,tags:["Museum","Art","Tourist Attraction","Outdoor"],description:"Renzo Piano-designed museum housing one of the finest collections of modern and contemporary sculpture in the world. The outdoor garden is as spectacular as the indoor galleries. Free first Saturday of every month and free third Friday evenings. A quiet masterpiece in the Arts District.",dishes:["Sculpture Garden","Exhibitions","Free Days"],address:"2001 Flora St, Dallas, TX 75201",phone:"(214) 242-5100",lat:32.7880,lng:-96.7999,instagram:"nashersculpturecenter",website:"https://www.nashersculpturecenter.org"},
  {name:"Dallas Zoo",cuisine:"Tourist Attraction",neighborhood:"South Dallas",score:86,price:2,tags:["Tourist Attraction","Family","Outdoor","Zoo"],description:"106-acre zoo — the largest in Texas — with a renowned Giants of the Savanna habitat featuring elephants, giraffes, and lions in an African-inspired landscape. The Wilds of Africa exhibit and the new hippo habitat are highlights. Open 364 days a year.",dishes:["Zoo Exhibits","Animal Encounters"],address:"650 S R.L. Thornton Fwy, Dallas, TX 75203",phone:"(469) 554-7500",lat:32.7412,lng:-96.8155,instagram:"dallaszoo",website:"https://www.dallaszoo.com"},
  {name:"Crow Museum of Asian Art",cuisine:"Art Museum",neighborhood:"Arts District",score:87,price:0,tags:["Museum","Art","Tourist Attraction","Free"],description:"Free museum with one of the finest collections of Asian art in the Southwest. The tranquil sculpture garden provides a meditation-like escape from downtown. Part of UT Dallas. Always free, always beautiful, always peaceful.",dishes:["Free Admission","Asian Art","Sculpture Garden"],address:"2010 Flora St, Dallas, TX 75201",phone:"(214) 979-6430",lat:32.7882,lng:-96.7993,instagram:"crowmuseum",website:"https://www.crowmuseum.org"},
];
const dResult = addToCity('const DALLAS_DATA', dallasAttractions);
console.log(`Dallas: ${dResult.count} spots (added ${dResult.added})`);

// ═══════════════════════════════════════════
// HOUSTON TOURIST ATTRACTIONS
// ═══════════════════════════════════════════
console.log('\n=== HOUSTON ===');
const houstonAttractions = [
  {name:"Houston Museum of Fine Arts",cuisine:"Art Museum",neighborhood:"Museum District",score:90,price:2,tags:["Museum","Art","Tourist Attraction"],description:"The largest art museum in the Southwest with 70,000+ works across two buildings connected by an underground tunnel. From Impressionist masterpieces to contemporary installations. Free on Thursdays. The new Nancy and Rich Kinder Building is architecturally stunning.",dishes:["Free Thursdays","Exhibitions","Architecture"],address:"1001 Bissonnet St, Houston, TX 77005",phone:"(713) 639-7300",lat:29.7256,lng:-95.3906,instagram:"mabortexa",website:"https://www.mfah.org"},
  {name:"Houston Zoo",cuisine:"Tourist Attraction",neighborhood:"Museum District",score:88,price:2,tags:["Tourist Attraction","Family","Outdoor","Zoo"],description:"6,000+ animals on 55 acres in Hermann Park including the new Galápagos Islands exhibit with sea lions, giant tortoises, and sharks. Feed giraffes at McGovern Giraffe Landing or watch Asian elephants swim. One of the most visited zoos in the country.",dishes:["Zoo Exhibits","Galápagos Islands","Giraffe Feeding"],address:"6200 Hermann Park Dr, Houston, TX 77030",phone:"(713) 533-6500",lat:29.7143,lng:-95.3934,instagram:"houstonzoo",website:"https://www.houstonzoo.org"},
  {name:"The Menil Collection",cuisine:"Art Museum",neighborhood:"Montrose",score:91,price:0,tags:["Museum","Art","Tourist Attraction","Free"],description:"World-class art collection that is always free. Surrealist masterworks, Byzantine icons, and African art in a serene Renzo Piano building. The Rothko Chapel and Cy Twombly Gallery are adjacent. One of the great free museums in America.",dishes:["Free Admission","Surrealist Art","Rothko Chapel"],address:"1533 Sul Ross St, Houston, TX 77006",phone:"(713) 525-9400",lat:29.7372,lng:-95.3973,instagram:"menilcollection",website:"https://www.menil.org"},
  {name:"Downtown Aquarium",cuisine:"Tourist Attraction",neighborhood:"Downtown",score:84,price:2,tags:["Tourist Attraction","Family","Aquarium"],description:"300+ species of aquatic life in the heart of downtown Houston. Ride the train through the Shark Tunnel, feed stingrays, and see white tigers. The restaurant serves seafood with aquarium views. A fun family outing in the middle of the city.",dishes:["Aquarium","Shark Tunnel","Stingray Feeding"],address:"410 Bagby St, Houston, TX 77002",phone:"(713) 223-3474",lat:29.7636,lng:-95.3680,instagram:"aquariumrestaurants",website:"https://www.aquariumrestaurants.com/downtownaquariumhouston"},
  {name:"Hermann Park",cuisine:"Tourist Attraction",neighborhood:"Museum District",score:88,price:0,tags:["Tourist Attraction","Park","Free","Family","Outdoor"],description:"445-acre urban park with the Houston Zoo, Japanese Garden, Miller Outdoor Theatre (free performances), and pedal boats on McGovern Lake. A green oasis connecting the Museum District to Rice University. Free to enter, free performances all summer.",dishes:["Japanese Garden","Pedal Boats","Miller Theatre","Trails"],address:"6001 Fannin St, Houston, TX 77030",phone:"(713) 526-2183",lat:29.7221,lng:-95.3900,instagram:"hermannpark",website:"https://www.hermannpark.org"},
  {name:"Rothko Chapel",cuisine:"Tourist Attraction",neighborhood:"Montrose",score:89,price:0,tags:["Tourist Attraction","Art","Free","Landmark"],description:"Non-denominational chapel housing 14 monumental paintings by Mark Rothko. A meditative space for contemplation that transcends religion and art. Adjacent to the Menil Collection. Free, silent, and profoundly moving. One of Houston's most unique cultural treasures.",dishes:["Free","Meditation","Art"],address:"3900 Yupon St, Houston, TX 77006",phone:"(713) 524-9839",lat:29.7375,lng:-95.3966,instagram:"rothkochapel",website:"https://www.rothkochapel.org"},
  {name:"Children's Museum Houston",cuisine:"Museum",neighborhood:"Museum District",score:86,price:1,tags:["Museum","Family","Tourist Attraction","Interactive"],description:"Top-ranked children's museum with interactive exhibits on science, culture, and creativity. The Kidtropolis city where kids run the show, FlowWorks water play area, and Cyberchase exhibits make it a full-day adventure for families. Free Thursdays 5-8pm.",dishes:["Interactive Exhibits","Free Thursday Evenings"],address:"1500 Binz St, Houston, TX 77004",phone:"(713) 522-1138",lat:29.7223,lng:-95.3855,instagram:"cmhouston",website:"https://www.cmhouston.org"},
  {name:"Gerald D. Hines Waterwall Park",cuisine:"Tourist Attraction",neighborhood:"Uptown / Galleria",score:85,price:0,tags:["Tourist Attraction","Park","Free","Photo Op"],description:"64-foot semi-circular waterfall that's one of Houston's most iconic photo spots. 11,000 gallons of water cascade down the curved wall every minute. Surrounded by 186 oak trees in a peaceful park. Free, open daily, and impossibly photogenic.",dishes:["Free","Photo Op","Waterfall"],address:"2800 Post Oak Blvd, Houston, TX 77056",phone:"",lat:29.7356,lng:-95.4614,instagram:"",website:"https://www.uptown-houston.com/experience/parks/waterwall-park"},
];
const hResult = addToCity('const HOUSTON_DATA', houstonAttractions);
console.log(`Houston: ${hResult.count} spots (added ${hResult.added})`);

// ═══════════════════════════════════════════
// CHICAGO — Add a few more to backfill toward 250
// ═══════════════════════════════════════════
console.log('\n=== CHICAGO ===');
const chicagoAttractions = [
  {name:"Shedd Aquarium",cuisine:"Tourist Attraction",neighborhood:"Museum Campus",score:89,price:2,tags:["Tourist Attraction","Family","Aquarium","Museum"],description:"32,000+ animals from around the world on the Lake Michigan waterfront. The Oceanarium's beluga whales and dolphins are the stars, and the Caribbean reef exhibit is mesmerizing. Part of the Museum Campus alongside Field Museum and Adler Planetarium. Free Illinois resident days available.",dishes:["Aquarium","Beluga Whales","Caribbean Reef"],address:"1200 S DuSable Lake Shore Dr, Chicago, IL 60605",phone:"(312) 939-2438",lat:41.8676,lng:-87.6140,instagram:"shaboruaquarium",website:"https://www.sheddaquarium.org"},
  {name:"Museum of Science and Industry",cuisine:"Museum",neighborhood:"Hyde Park",score:89,price:2,tags:["Museum","Tourist Attraction","Family","Interactive"],description:"The largest science museum in the Western Hemisphere housed in the only surviving building from the 1893 World's Fair. Walk through a real U-505 German submarine, explore a coal mine, and see a full-size 727 aircraft. The Science Storms exhibit is spectacular.",dishes:["U-505 Submarine","Coal Mine","Science Exhibits"],address:"5700 S DuSable Lake Shore Dr, Chicago, IL 60637",phone:"(773) 684-1414",lat:41.7906,lng:-87.5831,instagram:"msaborichicago",website:"https://www.msichicago.org"},
  {name:"Adler Planetarium",cuisine:"Museum",neighborhood:"Museum Campus",score:87,price:2,tags:["Museum","Tourist Attraction","Family"],description:"America's first planetarium on the Museum Campus lakefront. Sky shows, space exhibitions, and the best skyline view in Chicago from the steps. The Grainger Sky Theater dome show is worth the admission alone. Part of the Museum Campus trio.",dishes:["Sky Shows","Space Exhibits","Skyline Views"],address:"1300 S DuSable Lake Shore Dr, Chicago, IL 60605",phone:"(312) 922-7827",lat:41.8663,lng:-87.6068,instagram:"adaborplanetarium",website:"https://www.adlerplanetarium.org"},
  {name:"Field Museum",cuisine:"Museum",neighborhood:"Museum Campus",score:90,price:2,tags:["Museum","Tourist Attraction","Family"],description:"Home to SUE the T. rex — the largest and most complete T. rex skeleton ever found. The ancient Egypt exhibit, Evolving Planet hall, and Máximo the titanosaur are world-class. Free Wednesdays for Illinois residents. Part of the Museum Campus lakefront trio.",dishes:["SUE the T. Rex","Ancient Egypt","Máximo"],address:"1400 S DuSable Lake Shore Dr, Chicago, IL 60605",phone:"(312) 922-9410",lat:41.8663,lng:-87.6170,instagram:"fieldmuseum",website:"https://www.fieldmuseum.org"},
];
const cResult = addToCity("'Chicago': [", chicagoAttractions, true);
console.log(`Chicago: ${cResult.count} spots (added ${cResult.added})`);

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ Tourist attractions added across all cities');
