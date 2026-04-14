// Add _bestOfCityLists() and _renderBestOfLists() methods with data for 6 cities
const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

const insertMethods = `
  _renderBestOfLists(city, lists){
    return \`<div style="margin:20px 0 0;padding:0 0 20px">
      <div style="font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;padding:0 0 12px">🏆 Best Of \${city}</div>
      \${lists.map(list=>\`
        <div style="margin-bottom:18px">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">\${list.emoji} \${list.title}</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            \${list.spots.map((s,i)=>{
              const match=A.getRestaurants().find(r=>r.name.toLowerCase()===s.name.toLowerCase())||A.getRestaurants().find(r=>r.name.toLowerCase().includes(s.name.toLowerCase()));
              const clickAttr=match?\`onclick="A.openDetail(\${match.id})" style="cursor:pointer;display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`:\`style="display:flex;align-items:flex-start;gap:8px;background:var(--card);border:1.5px solid var(--gold);border-radius:10px;padding:8px 10px"\`;
              return \`<div \${clickAttr}>
                <div style="font-size:11px;font-weight:800;color:var(--gold);min-width:16px;margin-top:1px">\${i+1}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:12px;font-weight:700;color:var(--text)">\${s.name}</div>
                  <div style="font-size:11px;color:var(--text2);margin-top:1px">\${s.note}</div>
                </div>
                \${match?'<div style="font-size:11px;color:var(--text3);margin-top:2px;flex-shrink:0">›</div>':''}
              </div>\`;}).join('')}
          </div>
        </div>\`).join('')}
    </div>\`;
  },

  _bestOfCityLists(){
    return {
      'Las Vegas': [
        { title: 'Best Steakhouse', emoji: '🥩', spots: [
          { name: "Bazaar Meat by José Andrés", note: "Theatrical Spanish steakhouse at The Palazzo — cotton-candy foie gras" },
          { name: "CUT by Wolfgang Puck", note: "Palazzo — A5 Wagyu and Austrian-inflected sides" },
          { name: "Carbone Riviera", note: "Bellagio — fountain views and tableside caesar" },
          { name: "Papi Steak", note: "Fontainebleau — 55oz Beef Case with tableside theater" },
          { name: "Bavette's Steakhouse & Bar", note: "Park MGM — dark, clubby, famous hash browns" },
          { name: "Carversteak", note: "Resorts World — dry-aged beef carved tableside" }
        ]},
        { title: 'Best Omakase', emoji: '🍣', spots: [
          { name: "Wakuda", note: "Palazzo — two-Michelin-star chef Tetsuya Wakuda's first US restaurant" },
          { name: "Sushi by Scratch Restaurants", note: "Belltown — intimate 10-seat 17-course experience" },
          { name: "YUI Edomae Sushi", note: "Chinatown — considered Vegas's best traditional Edomae omakase" },
          { name: "Kame Omakase", note: "Chinatown — 10-seat intimate room, weeks-out reservations" },
          { name: "Kabuto Edomae Sushi", note: "Chinatown — 11-seat aged-fish specialist" },
          { name: "Kaiseki Yuzu", note: "Chinatown — traditional Kyoto-style kaiseki multi-course" }
        ]},
        { title: 'Best Italian', emoji: '🍝', spots: [
          { name: "Mother Wolf", note: "Fontainebleau — Evan Funke's Roman pasta pilgrimage" },
          { name: "Carbone", note: "Aria — hardest reservation on the Strip, spicy rigatoni vodka" },
          { name: "Carbone Riviera", note: "Bellagio — lobster fettuccine at the fountains" },
          { name: "Esther's Kitchen", note: "Arts District — best off-Strip Italian, 8 sourdoughs" },
          { name: "Brezza", note: "Resorts World — Chef Nicole Brisson's coastal Italian" },
          { name: "Scarpetta", note: "Cosmopolitan — spaghetti tomato basil with fountain views" }
        ]},
        { title: 'Best Chinese', emoji: '🥟', spots: [
          { name: "Wing Lei", note: "Wynn — first Chinese restaurant in North America with a Michelin star" },
          { name: "Mott 32", note: "Palazzo — 42-day Peking duck, Iberico char siu" },
          { name: "Dough Zone Dumpling House", note: "Chinatown — Seattle/Vegas xiao long bao favorite" },
          { name: "Shanghai Taste", note: "Chinatown — 3,000+ soup dumplings daily" },
          { name: "Hakkasan", note: "MGM Grand — modern Cantonese + nightclub" },
          { name: "Chyna Club", note: "Fontainebleau — contemporary Chinese, glass koi display" }
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: "Herbs & Rye", note: "Off-Strip — vintage cocktail recipes by era, James Beard nominee" },
          { name: "Delilah", note: "Wynn — h.wood Group modern supper club with live entertainment" },
          { name: "Ghost Donkey", note: "Cosmopolitan — 100+ agave spirits behind a donkey door" },
          { name: "Velveteen Rabbit", note: "Arts District — pioneer of Vegas's craft cocktail scene" },
          { name: "Frankie's Tiki Room", note: "West of Strip — only 24/7 tiki bar in America" },
          { name: "Oak & Ivy", note: "Downtown Container Park — whiskey & cocktail focus" }
        ]},
        { title: 'Best Late Night', emoji: '🌙', spots: [
          { name: "Tacos El Gordo", note: "Strip — Tijuana-style adobada tacos until 4AM weekends" },
          { name: "Rocco's", note: "Belltown — pizza and cocktails until 2AM daily" },
          { name: "Peppermill Restaurant & Fireside Lounge", note: "Strip — 24/7 diner with sunken fire pit" },
          { name: "The Golden Tiki", note: "Chinatown — 24/7 tiki bar with rum drinks in coconuts" },
          { name: "Aburiya Raku", note: "Chinatown — robata izakaya until 1 AM Mon-Sat" },
          { name: "Ramen Danbo", note: "Capitol Hill — Fukuoka-style tonkotsu until 11PM daily" }
        ]},
        { title: 'Best Celebrity Chef', emoji: '🍳', spots: [
          { name: "Restaurant Guy Savoy", note: "Caesars Palace — two Michelin stars previously" },
          { name: "Joël Robuchon", note: "MGM Grand — only 3-Michelin-star ever awarded in Vegas" },
          { name: "Gordon Ramsay Hell's Kitchen", note: "Caesars Palace — signature Beef Wellington" },
          { name: "Nobu", note: "Caesars Palace — Matsuhisa's flagship at Nobu Hotel" },
          { name: "Morimoto", note: "MGM Grand — Iron Chef Masaharu Morimoto" },
          { name: "Spago", note: "Bellagio — Wolfgang Puck with fountain views" }
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: "Bardot Brasserie", note: "Aria — French brasserie with famous weekend brunch" },
          { name: "Yardbird Table & Bar", note: "Venetian — Southern comfort with 27+ hours of weekend service" },
          { name: "Giada", note: "Cromwell — fountain-view brunch from Giada De Laurentiis" },
          { name: "Eggslut", note: "Cosmopolitan — LA-born egg sandwich specialist" },
          { name: "Sunrise Coffee", note: "Paradise — longest-running independent coffee in Vegas" },
          { name: "Makers & Finders", note: "Arts District + Summerlin — Latin brunch and specialty coffee" }
        ]}
      ],
      'Seattle': [
        { title: 'Best Coffee', emoji: '☕', spots: [
          { name: "Milstead & Co.", note: "Fremont — Food & Wine 5/5 Coffee Snob Factor" },
          { name: "Anchorhead Coffee", note: "Downtown — Seattle's first bottled cold brew" },
          { name: "Storyville Coffee", note: "Pike Place — 2nd floor with waterfront views" },
          { name: "Vesta Coffee Roasters", note: "On-site roastery, seasonal pour-over" },
          { name: "Analog Coffee", note: "Capitol Hill — local favorite, cozy vibe" },
          { name: "Elm Coffee Roasters", note: "Pioneer Square — single-origin specialist" }
        ]},
        { title: 'Best Seafood', emoji: '🦞', spots: [
          { name: "The Walrus and the Carpenter", note: "Ballard — James Beard-winning oyster bar" },
          { name: "Taylor Shellfish Oyster Bar", note: "Capitol Hill — freshest oysters, 5 generations of shellfish farming" },
          { name: "Ray's Boathouse", note: "Shilshole — iconic waterfront PNW seafood" },
          { name: "Local Tide", note: "Fremont — Dungeness crab roll and shrimp toast" },
          { name: "Matt's in the Market", note: "Pike Place — top-floor seafood with Elliott Bay views" },
          { name: "Pike Place Chowder", note: "Pike Place — national-award-winning chowders" }
        ]},
        { title: 'Best Sushi & Japanese', emoji: '🍣', spots: [
          { name: "Sushi Kashiba", note: "Pike Place — Chef Shiro Kashiba's Edomae temple" },
          { name: "Shiro's Sushi", note: "Belltown — Seattle's first Edomae sushi restaurant (1994)" },
          { name: "Sushi Kappo Tamura", note: "Eastlake — seasonal PNW ingredients, sustainable sourcing" },
          { name: "Mashiko", note: "West Seattle Junction — sustainable-only sushi since 2009" },
          { name: "Kamonegi", note: "Fremont — handmade soba and seasonal tempura" },
          { name: "Maneki", note: "Chinatown-International District — Seattle's oldest Japanese (1904)" }
        ]},
        { title: 'Best Pizza', emoji: '🍕', spots: [
          { name: "Dino's Tomato Pie", note: "Capitol Hill — NJ-style round and square pies from Delancey team" },
          { name: "Windy City Pie", note: "Phinney Ridge — Chicago deep-dish with house sausage" },
          { name: "Delancey", note: "Ballard — award-winning wood-fired pies" },
          { name: "Tivoli", note: "Fremont — best pepperoni slice in town" },
          { name: "Serious Pie Downtown", note: "Downtown — Tom Douglas wood-fired classic" },
          { name: "Stoneburner", note: "Ballard — Italian meets PNW in the Hotel Ballard" }
        ]},
        { title: 'Best Date Night', emoji: '💕', spots: [
          { name: "Canlis", note: "Queen Anne — Seattle's fine-dining landmark since 1950" },
          { name: "Altura", note: "Capitol Hill — Italian tasting menu, weekly-changing" },
          { name: "Cascina Spinasse", note: "Capitol Hill — hand-rolled tajarin in butter and sage" },
          { name: "Copine", note: "Ballard — 4-course French prix fixe, Yelp Top 20 US" },
          { name: "Lark", note: "Capitol Hill — James Beard Award, 20+ years" },
          { name: "The Pink Door", note: "Pike Place — Italian with live cabaret since 1981" }
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: "Portage Bay Cafe", note: "South Lake Union — legendary organic breakfast bar" },
          { name: "Tilikum Place Cafe", note: "Belltown — famous Dutch baby pancake" },
          { name: "Oddfellows Cafe + Bar", note: "Capitol Hill — Pike/Pine living room" },
          { name: "Lowell's Restaurant", note: "Pike Place — three floors of water views since 1908" },
          { name: "Cafe Besalu", note: "Ballard — award-winning morning pastries" },
          { name: "Hamsa", note: "Wallingford — Palestinian breakfast sandwiches" }
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: "Canon", note: "Capitol Hill — America's largest spirits collection" },
          { name: "Rob Roy", note: "Belltown — 2023 James Beard Outstanding Bar" },
          { name: "L'Oursin", note: "Central District — natural wine and French cocktails" },
          { name: "Le Caviste", note: "Denny Triangle — consistently ranked America's best wine bar" },
          { name: "Liberty", note: "Capitol Hill — 600+ bottles of spirits, since 2006" },
          { name: "Radiator Whiskey", note: "Pike Place — 100+ whiskeys on the top floor" }
        ]},
        { title: 'Best Ramen & Asian', emoji: '🍜', spots: [
          { name: "Ramen Danbo", note: "Capitol Hill — Fukuoka-style Tonkotsu" },
          { name: "Ooink", note: "Capitol Hill — best broth on the Hill" },
          { name: "Biang Biang Noodles", note: "Capitol Hill — hand-pulled Xi'an noodles" },
          { name: "Dough Zone Dumpling House", note: "Chinatown — Q-Bao pork buns, XLB" },
          { name: "Pho Bac Sup Shop", note: "Chinatown-ID — iconic Vietnamese since 1982" },
          { name: "Mike's Noodle House", note: "Chinatown-ID — cash-only Cantonese wonton noodles" }
        ]}
      ],
      'Austin': [
        { title: 'Best BBQ', emoji: '🔥', spots: [
          { name: "Franklin Barbecue", note: "The BBQ pilgrimage — Kanye, Obama, Bourdain have all waited" },
          { name: "LeRoy and Lewis", note: "Food-truck-turned-brick-and-mortar, beef cheek barbacoa" },
          { name: "la Barbecue", note: "East side reliable — brisket with zero line stress" },
          { name: "Interstellar BBQ", note: "Round Rock — Texas Monthly Top 50" },
          { name: "Terry Black's Barbecue", note: "Lockhart royalty on Barton Springs" },
          { name: "Micklethwait Craft Meats", note: "East side trailer — beloved by locals" }
        ]},
        { title: 'Best Tacos', emoji: '🌮', spots: [
          { name: "Veracruz All Natural", note: "Migas taco is iconic — east side breakfast institution" },
          { name: "Suerte", note: "Heirloom-corn Mexican, James Beard semifinalist" },
          { name: "Comedor", note: "Downtown power Mexican from Philip Speer and Gabe Erales" },
          { name: "Nixta Taqueria", note: "East side — modern tacos with duck carnitas" },
          { name: "Joe's Bakery", note: "East Austin institution — breakfast tacos since 1962" },
          { name: "Torchy's Tacos", note: "Austin-born chain — Trailer Park taco fame" }
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: "Drink.Well.", note: "North Loop — neighborhood cocktail destination" },
          { name: "Midnight Cowboy", note: "Red River — reservation-only speakeasy" },
          { name: "Small Victory", note: "Downtown — intimate cocktail room" },
          { name: "Garage", note: "Downtown parking-garage cocktail hideaway" },
          { name: "Whisler's", note: "East Austin — mezcal temple upstairs" },
          { name: "Half Step", note: "Rainey Street — craft cocktails on the cocktail-district strip" }
        ]},
        { title: 'Best Date Night', emoji: '💕', spots: [
          { name: "Uchi Austin", note: "Tyson Cole flagship — James Beard Award winner" },
          { name: "Dai Due", note: "Butcher shop-restaurant, whole-animal farm-to-table" },
          { name: "Jeffrey's", note: "Clarksville since 1975 — LBJ-era Austin power dining" },
          { name: "Olamaie", note: "Modern Southern in an old Southern house" },
          { name: "Barley Swine", note: "Chef Bryce Gilmore tasting menu" },
          { name: "Justine's Brasserie", note: "French brasserie until 1:30 AM" }
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: "Launderette", note: "Converted laundromat with creative brunch" },
          { name: "Veracruz All Natural", note: "Migas taco brunch staple" },
          { name: "Sour Duck Market", note: "East side — house-made pastries" },
          { name: "June's All Day", note: "All-day café, South Congress" },
          { name: "Josephine House", note: "Clarksville brunch destination" },
          { name: "Kerbey Lane Cafe", note: "Austin breakfast institution — multiple locations" }
        ]},
        { title: 'Best Live Music Dinner', emoji: '🎸', spots: [
          { name: "Stubb's Bar-B-Q", note: "Red River — BBQ and legendary amphitheater" },
          { name: "The Continental Club", note: "South Congress — country and blues venue" },
          { name: "C-Boy's Heart & Soul", note: "South Congress — retro soul vibe" },
          { name: "The Saxon Pub", note: "South Austin — intimate live music bar" },
          { name: "Antone's Nightclub", note: "Downtown — Austin's 'Home of the Blues'" },
          { name: "Broken Spoke", note: "South Austin — old-school Texas dance hall" }
        ]}
      ],
      'Houston': [
        { title: 'Best Steakhouse', emoji: '🥩', spots: [
          { name: "Pappas Bros. Steakhouse", note: "Wine Spectator Grand Award — Houston classic" },
          { name: "Turner's", note: "Business elite power steakhouse" },
          { name: "Georgia James", note: "James Beard-nominated whole-animal chop house" },
          { name: "Killen's Steakhouse", note: "Pearland — Ronnie Killen's flagship" },
          { name: "Vic & Anthony's", note: "Downtown — old-school Texas steakhouse" },
          { name: "Taste of Texas", note: "Westside — Texas institution with live piano" }
        ]},
        { title: 'Best Mexican', emoji: '🌮', spots: [
          { name: "Tatemó", note: "Michelin-starred Mexican tasting menu" },
          { name: "Hugo's", note: "Montrose — Hugo Ortega's Oaxacan-influenced modern Mex" },
          { name: "Xochi", note: "Downtown — Hugo Ortega's Oaxacan showpiece" },
          { name: "El Big Bad", note: "Downtown — Latin street food and mezcal" },
          { name: "Pinkerton's Barbecue", note: "Heights — brisket tacos done right" },
          { name: "Ninfa's on Navigation", note: "Inventor of the fajita, Houston institution" }
        ]},
        { title: 'Best Brunch', emoji: '🥂', spots: [
          { name: "Backstreet Cafe", note: "Montrose — shady patio, Hugo Ortega's classic" },
          { name: "Common Bond", note: "Montrose — French bakery-café staple" },
          { name: "Tiny Boxwoods", note: "River Oaks — garden dining" },
          { name: "Xochi", note: "Downtown — Oaxacan brunch" },
          { name: "Brasserie 19", note: "River Oaks — French brasserie-style Sunday brunch" },
          { name: "Snooze", note: "Multiple — Denver-born pancake palace" }
        ]},
        { title: 'Best Fine Dining', emoji: '⭐', spots: [
          { name: "March", note: "Montrose — Michelin-starred Mediterranean tasting menu" },
          { name: "Le Jardinier", note: "Museum District — French-inspired elegance" },
          { name: "Tatemó", note: "Most exclusive Mexican tasting menu in Houston" },
          { name: "Nancy's Hustle", note: "East Downtown — farm-to-table small plates" },
          { name: "Uchi Houston", note: "Heights — Tyson Cole sushi pilgrimage" },
          { name: "Riel", note: "Montrose — Chef Ryan Lachaine contemporary Canadian-influenced" }
        ]},
        { title: 'Best Vietnamese', emoji: '🍜', spots: [
          { name: "Crawfish & Noodles", note: "Asiatown — viral Viet-Cajun crawfish boil" },
          { name: "Pho Binh", note: "East side — Houston pho institution" },
          { name: "Cafe TH", note: "East side — hidden Vietnamese gem, banh mi" },
          { name: "Les Ba'get", note: "Montrose — modern Viet street food" },
          { name: "Mi Tia Nga", note: "Asiatown — long-running Vietnamese favorite" },
          { name: "Xin Chao", note: "Spring — pho and Viet-Cajun crawfish" }
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: "Anvil Bar & Refuge", note: "Montrose — Bobby Heugel's seminal craft cocktail bar" },
          { name: "Julep", note: "Heights — whiskey temple with Southern influences" },
          { name: "The Pastry War", note: "Downtown — mezcal cantina" },
          { name: "Captain Foxheart's", note: "Downtown — rooftop cocktail hideaway" },
          { name: "Better Luck Tomorrow", note: "Heights — cocktail bar and elevated bar food" },
          { name: "Tongue Cut Sparrow", note: "Downtown — reservation-only speakeasy" }
        ]}
      ],
      'Chicago': [
        { title: 'Best Deep Dish', emoji: '🍕', spots: [
          { name: "Pequod's Pizza", note: "Lincoln Park — caramelized cheese crust is legendary" },
          { name: "Lou Malnati's", note: "Multiple — the Chicago chain with buttery crust" },
          { name: "Giordano's", note: "Multiple — stuffed deep dish pilgrimage" },
          { name: "Gino's East", note: "Multiple — original 1966 Chicago deep dish" },
          { name: "Art of Pizza", note: "Lakeview — Chicago's favorite stuffed pizza" },
          { name: "Bartoli's", note: "Roscoe Village — family-run deep dish favorite" }
        ]},
        { title: 'Best Steakhouse', emoji: '🥩', spots: [
          { name: "Bavette's Bar & Boeuf", note: "River North — Hogsalt Group's seminal steakhouse" },
          { name: "Gibsons", note: "Rush Street — Chicago power-dining classic" },
          { name: "RPM Steak", note: "River North — sexy modern steakhouse" },
          { name: "Maple & Ash", note: "Gold Coast — wood-fired prime cuts" },
          { name: "Swift & Sons", note: "Fulton Market — grand art deco steakhouse" },
          { name: "Chicago Cut Steakhouse", note: "River North — classic riverside steakhouse" }
        ]},
        { title: 'Best Italian', emoji: '🍝', spots: [
          { name: "Spiaggia", note: "Gold Coast — longtime fine-dining Italian" },
          { name: "The Bristol", note: "Bucktown — modern Italian comfort" },
          { name: "Piccolo Sogno", note: "River West — romantic Italian with garden patio" },
          { name: "Monteverde", note: "West Loop — Sarah Grueneberg's handmade pasta" },
          { name: "Pacific Standard Time", note: "West Loop — California-Italian from B. Hospitality" },
          { name: "Osteria Langhe", note: "Logan Square — Piedmontese specialist" }
        ]},
        { title: 'Best Fine Dining', emoji: '⭐', spots: [
          { name: "Alinea", note: "Lincoln Park — 3 Michelin stars, Grant Achatz molecular gastronomy" },
          { name: "Smyth", note: "West Loop — 2 Michelin stars, John & Karen Shields" },
          { name: "Oriole", note: "West Loop — 2 Michelin stars, Chef Noah Sandoval" },
          { name: "Ever", note: "West Loop — Curtis Duffy Michelin 2-star" },
          { name: "Topolobampo", note: "River North — Rick Bayless's fine-dining Mexican" },
          { name: "Next", note: "West Loop — Grant Achatz's rotating-menu concept" }
        ]},
        { title: 'Best Cocktail Bar', emoji: '🍸', spots: [
          { name: "The Aviary", note: "West Loop — Grant Achatz's cocktail art" },
          { name: "Kumiko", note: "West Loop — Japanese-inflected cocktails, James Beard winner" },
          { name: "The Violet Hour", note: "Wicker Park — 2015 America's Best Bar" },
          { name: "Billy Sunday", note: "Logan Square — Dave Wondrich library bar" },
          { name: "Three Dots and a Dash", note: "River North — tropical tiki hideaway" },
          { name: "Sparrow", note: "Gold Coast — Havana-inflected cocktail bar" }
        ]},
        { title: 'Best Breakfast/Brunch', emoji: '🥂', spots: [
          { name: "Lou Mitchell's", note: "Loop — Route 66 breakfast icon" },
          { name: "Ann Sather", note: "Lakeview — Swedish diner with cinnamon rolls" },
          { name: "Kanela Breakfast Club", note: "Multiple — beloved Greek-inflected brunch" },
          { name: "Bongo Room", note: "Wicker Park — chocolate tower French toast" },
          { name: "Milk Room", note: "Loop — micro-bar and pastry program" },
          { name: "Aba", note: "Fulton Market — Mediterranean brunch rooftop" }
        ]}
      ],
      'Salt Lake City': [
        { title: 'Best Farm-to-Table', emoji: '🌿', spots: [
          { name: "Log Haven", note: "Millcreek Canyon — log-cabin special-occasion classic" },
          { name: "Pago", note: "9th & 9th — seasonal farm-to-table pioneer" },
          { name: "Handle", note: "Park City — chef-driven small plates" },
          { name: "The Copper Onion", note: "Downtown — James Beard semifinalist" },
          { name: "HSL", note: "Downtown — seasonal tasting plates" },
          { name: "Stanza Italian Bistro", note: "Downtown — house pastas, local ingredients" }
        ]},
        { title: 'Best Sundance Restaurants', emoji: '🎬', spots: [
          { name: "Riverhorse on Main", note: "Park City — the Sundance celebrity canteen for decades" },
          { name: "Handle", note: "Park City — hardest Sundance reservation in Utah" },
          { name: "350 Main Brasserie", note: "Park City — hosts Sundance premiere dinners" },
          { name: "High West Distillery & Saloon", note: "Park City — only ski-in distillery in the world" },
          { name: "Chimayo", note: "Park City — Southwestern + Mexican fine dining" },
          { name: "Powder", note: "Park City — mountain-view fine dining at Waldorf Astoria" }
        ]},
        { title: 'Best Sushi', emoji: '🍣', spots: [
          { name: "Takashi", note: "Downtown — SLC's sushi institution" },
          { name: "Ichiban Sushi", note: "Downtown — locals' neighborhood sushi favorite" },
          { name: "Kyoto Japanese Restaurant", note: "Holladay — omakase with chef-driven menu" },
          { name: "Itto Sushi", note: "Sugar House — cozy neighborhood sushi" },
          { name: "Sapa Sushi Bar", note: "Downtown — pan-Asian sushi" },
          { name: "Tsunami Sushi", note: "Sugar House — large menu and late-night hours" }
        ]},
        { title: 'Best Breakfast/Brunch', emoji: '🥂', spots: [
          { name: "Eggs in the City", note: "Sugar House — classic SLC breakfast institution" },
          { name: "Finn's Cafe", note: "9th & 9th — Swedish pancakes and crepes" },
          { name: "Pig & A Jelly Jar", note: "9th & 9th — chicken & waffles destination" },
          { name: "Ruth's Diner", note: "Emigration Canyon — since 1930, mile-high biscuits" },
          { name: "Penny Ann's Cafe", note: "Downtown — award-winning breakfast institution" },
          { name: "Park Cafe", note: "Liberty Park — sunrise breakfast hangout" }
        ]},
        { title: 'Best Bar / Cocktails', emoji: '🍸', spots: [
          { name: "Water Witch", note: "Central 9th — acclaimed craft cocktail bar" },
          { name: "Bar-X", note: "Downtown — classic hotel bar revived" },
          { name: "Post Office Place", note: "Downtown — small-batch cocktail list" },
          { name: "White Horse", note: "Downtown — whiskey bar and eatery" },
          { name: "Beer Bar", note: "Downtown — craft beer + sausages (Ty Burrell-owned)" },
          { name: "Alibi", note: "Downtown — quiet cocktail speakeasy" }
        ]},
        { title: 'Best After-Ski', emoji: '🎿', spots: [
          { name: "High West Saloon", note: "Park City — whiskey after the slopes" },
          { name: "The Farm at Canyons", note: "Park City — slope-side dining" },
          { name: "Ruth's Diner", note: "Emigration — post-canyon comfort food" },
          { name: "Red Iguana", note: "Downtown — après-ski mole legend" },
          { name: "No Name Saloon", note: "Park City — burgers and beer" },
          { name: "Silver Star Cafe", note: "Park City — live music, mountain views" }
        ]}
      ]
    };
  },

`;

// Insert before bestOfNYCHTML()
const anchor = '  bestOfNYCHTML(){';
const idx = html.indexOf(anchor);
if (idx < 0) { console.error('Anchor not found'); process.exit(1); }
if (html.includes('  _bestOfCityLists(){')) {
  console.log('Already added');
  process.exit(0);
}
html = html.substring(0, idx) + insertMethods + html.substring(idx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Added _renderBestOfLists + _bestOfCityLists with 6 cities');
