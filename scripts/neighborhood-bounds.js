// Neighborhood bounding boxes for coord-vs-label audits.
// Format per city: { 'Neighborhood Name': [latMin, latMax, lngMin, lngMax] }
// A box is a conservative envelope of the actual neighborhood; cards whose
// (lat,lng) fall outside the box for their claimed neighborhood are outliers.
// Bounds are authored from observed data + public city/zip boundaries; pad
// each by ~0.002° (~200m) to tolerate geocoding jitter.

const NBH_BOUNDS = {
  phx: {
    // Downtown / Central Phoenix core
    'Downtown Phoenix':       [33.430, 33.475, -112.100, -112.060],
    'Roosevelt Row':          [33.453, 33.475, -112.085, -112.062],
    'Heritage Square':        [33.445, 33.455, -112.072, -112.060],
    'Warehouse District':     [33.432, 33.450, -112.080, -112.062],
    'Grand Avenue':           [33.448, 33.470, -112.102, -112.078],
    'Garfield':               [33.445, 33.470, -112.072, -111.998],
    'Central Phoenix':        [33.465, 33.535, -112.090, -112.000],
    'Uptown':                 [33.495, 33.545, -112.090, -112.040],
    'Uptown Phoenix':         [33.515, 33.535, -112.115, -112.100],
    'Midtown':                [33.460, 33.515, -112.090, -112.062],
    'Melrose':                [33.480, 33.525, -112.090, -112.045],
    'Miracle Mile':           [33.460, 33.475, -112.058, -112.042],
    'Coronado':               [33.460, 33.530, -112.080, -112.035],

    // Biltmore / Arcadia
    'Biltmore':               [33.500, 33.535, -112.060, -111.978],
    'Arcadia':                [33.465, 33.520, -112.065, -111.960],
    'Near Sky Harbor':        [33.415, 33.445, -112.020, -111.965],

    // Paradise Valley
    'Paradise Valley':        [33.510, 33.595, -112.015, -111.915],

    // Scottsdale (treating "Scottsdale" as city-wide catchall)
    'Scottsdale':             [33.460, 33.745, -111.955, -111.810],
    'Old Town Scottsdale':    [33.485, 33.510, -111.938, -111.918],
    'Central Scottsdale':     [33.550, 33.600, -111.940, -111.900],
    'North Scottsdale':       [33.595, 33.730, -111.950, -111.820],

    // East Valley
    'Tempe':                  [33.385, 33.460, -111.970, -111.880],
    'Mesa':                   [33.375, 33.485, -111.895, -111.580],
    'Downtown Mesa':          [33.385, 33.415, -111.840, -111.795],
    'Mesa (Eastmark)':        [33.290, 33.340, -111.660, -111.590],
    'Mesa Asian District':    [33.400, 33.425, -111.885, -111.845],
    'Chandler':               [33.215, 33.360, -111.970, -111.820],
    'Gilbert':                [33.290, 33.395, -111.855, -111.700],
    'Ahwatukee':              [33.290, 33.385, -112.010, -111.945],
    'Wild Horse Pass':        [33.185, 33.275, -112.005, -111.980],

    // West Valley
    'West Phoenix':           [33.425, 33.575, -112.245, -112.095],
    'Glendale':               [33.520, 33.675, -112.265, -112.100],
    'Peoria':                 [33.560, 33.725, -112.295, -112.200],
    'Surprise':               [33.595, 33.655, -112.450, -112.290],

    // North fringe
    'North Phoenix':          [33.540, 33.730, -112.115, -111.945],
    'Cave Creek':             [33.818, 33.848, -111.975, -111.918],
    'Carefree':               [33.810, 33.845, -111.940, -111.900],

    // South
    'South Phoenix':          [33.355, 33.445, -112.115, -111.995],
    'East Phoenix':           [33.440, 33.500, -112.050, -111.948],
  },
  sd: {
    // Downtown / Gaslamp core
    'Gaslamp':                        [32.703, 32.720, -117.165, -117.148],
    'East Village':                   [32.703, 32.718, -117.165, -117.145],
    'Little Italy':                   [32.709, 32.732, -117.175, -117.160],
    'Downtown':                       [32.708, 32.722, -117.175, -117.148],
    'Downtown / Embarcadero':         [32.710, 32.730, -117.180, -117.168],
    'Marina':                         [32.705, 32.720, -117.175, -117.160],

    // Balboa Park / Hillcrest / Bankers Hill
    'Balboa Park':                    [32.725, 32.740, -117.158, -117.130],
    'Bankers Hill':                   [32.708, 32.748, -117.170, -117.155],
    'Hillcrest':                      [32.740, 32.755, -117.172, -117.142],
    'Mission Hills':                  [32.732, 32.755, -117.185, -117.165],
    'Mission Hills / Middletown':     [32.732, 32.755, -117.185, -117.165],

    // Mid-city / North Park / Kensington
    'North Park':                     [32.738, 32.765, -117.145, -117.110],
    'South Park':                     [32.715, 32.732, -117.138, -117.122],
    'University Heights':             [32.750, 32.765, -117.150, -117.130],
    'Normal Heights':                 [32.745, 32.765, -117.135, -117.100],
    'Kensington':                     [32.760, 32.770, -117.112, -117.100],
    'City Heights':                   [32.735, 32.752, -117.120, -117.088],
    'College Area':                   [32.752, 32.762, -117.100, -117.075],
    'Golden Hill':                    [32.713, 32.728, -117.150, -117.125],

    // Barrio Logan / Logan Heights
    'Barrio Logan':                   [32.692, 32.705, -117.150, -117.102],
    'Barrio Logan / Logan Heights':   [32.692, 32.708, -117.155, -117.102],

    // Old Town / Mission Valley
    'Old Town':                       [32.745, 32.760, -117.202, -117.188],
    'Mission Valley':                 [32.762, 32.778, -117.175, -117.135],
    'Linda Vista':                    [32.788, 32.802, -117.180, -117.168],

    // Point Loma / Harbor / Coastal
    'Point Loma':                     [32.715, 32.760, -117.245, -117.200],
    'Point Loma / Liberty Station':   [32.728, 32.748, -117.220, -117.205],
    'Harbor Island':                  [32.720, 32.730, -117.215, -117.185],
    'Shelter Island':                 [32.712, 32.726, -117.238, -117.220],
    'Ocean Beach':                    [32.738, 32.758, -117.258, -117.230],
    'Mission Beach':                  [32.765, 32.790, -117.260, -117.245],
    'Mission Bay':                    [32.760, 32.790, -117.248, -117.230],
    'Pacific Beach':                  [32.775, 32.812, -117.262, -117.205],
    'Bay Park':                       [32.810, 32.822, -117.225, -117.210],

    // La Jolla
    'La Jolla':                       [32.830, 32.860, -117.285, -117.250],
    'La Jolla Shores':                [32.848, 32.862, -117.263, -117.250],
    'La Jolla / UTC':                 [32.862, 32.880, -117.248, -117.205],
    'La Jolla / Torrey Pines':        [32.890, 32.905, -117.255, -117.235],
    'Bird Rock':                      [32.808, 32.835, -117.285, -117.265],
    'Bird Rock / La Jolla':           [32.808, 32.830, -117.278, -117.262],

    // Coronado / South Bay
    'Coronado':                       [32.670, 32.700, -117.185, -117.165],
    'Chula Vista':                    [32.620, 32.655, -117.100, -117.075],
    'Bonita':                         [32.655, 32.685, -117.045, -117.010],
    'Imperial Beach':                 [32.575, 32.595, -117.140, -117.125],

    // Kearny Mesa / Mira Mesa / inland north
    'Kearny Mesa':                    [32.805, 32.842, -117.175, -117.115],
    'Clairemont':                     [32.825, 32.860, -117.215, -117.170],
    'Miramar':                        [32.880, 32.900, -117.170, -117.145],
    'Mira Mesa':                      [32.895, 32.920, -117.215, -117.165],
    'Sorrento Valley / Mira Mesa':    [32.895, 32.915, -117.200, -117.180],
    'Mira Mesa / Scripps Ranch':      [32.905, 32.930, -117.125, -117.105],

    // North County coast
    'Del Mar':                        [32.918, 32.990, -117.275, -117.190],
    'Solana Beach':                   [32.975, 33.005, -117.282, -117.250],
    'Cardiff-by-the-Sea':             [33.005, 33.035, -117.295, -117.270],
    'Encinitas':                      [33.030, 33.055, -117.305, -117.285],
    'Leucadia / Encinitas':           [33.045, 33.080, -117.315, -117.255],
    'Carlsbad':                       [33.060, 33.170, -117.360, -117.260],
    'Oceanside':                      [33.170, 33.210, -117.390, -117.355],

    // North County inland
    'Carmel Valley':                  [32.950, 32.975, -117.200, -117.180],
    'Carmel Valley / Del Mar Heights':[32.915, 32.935, -117.245, -117.225],
    'Rancho Santa Fe':                [33.010, 33.030, -117.215, -117.195],
    'Rancho Bernardo':                [33.010, 33.040, -117.125, -117.040],
    'Poway':                          [32.960, 32.985, -117.045, -117.020],
    'Escondido':                      [33.080, 33.135, -117.130, -117.065],
    'Vista':                          [33.130, 33.160, -117.245, -117.220],
    'Ramona':                         [33.030, 33.055, -116.880, -116.850],

    // East County
    'La Mesa':                        [32.758, 32.785, -117.028, -117.000],
  },
  la: {
    // DTLA core
    'Downtown LA':          [34.030, 34.068, -118.270, -118.230],
    'Downtown':             [34.040, 34.060, -118.265, -118.240],
    'Arts District':        [34.028, 34.055, -118.245, -118.218],
    'Little Tokyo':         [34.045, 34.055, -118.248, -118.236],
    'Chinatown':            [34.055, 34.075, -118.245, -118.222],
    'Fashion District':     [34.028, 34.045, -118.262, -118.245],
    'Historic Filipinotown':[34.060, 34.075, -118.272, -118.252],

    // Central / mid-Wilshire / Fairfax
    'Koreatown':            [34.048, 34.080, -118.328, -118.285],
    'Mid-Wilshire':         [34.052, 34.082, -118.375, -118.295],
    'Miracle Mile':         [34.058, 34.075, -118.362, -118.340],
    'Mid-City':             [34.048, 34.065, -118.370, -118.335],
    'Fairfax':              [34.072, 34.092, -118.372, -118.342],
    'Beverly Grove':        [34.065, 34.090, -118.390, -118.305],
    'West Adams':           [34.018, 34.040, -118.368, -118.315],
    'Larchmont':            [34.070, 34.082, -118.328, -118.315],

    // East side
    'Hollywood':            [34.085, 34.115, -118.368, -118.295],
    'East Hollywood':       [34.075, 34.105, -118.315, -118.270],
    'Thai Town':            [34.095, 34.108, -118.325, -118.298],
    'Melrose':              [34.078, 34.090, -118.380, -118.320],
    'Melrose Hill':         [34.078, 34.092, -118.315, -118.300],
    'Silver Lake':          [34.075, 34.105, -118.292, -118.255],
    'Los Feliz':            [34.092, 34.140, -118.298, -118.260],
    'Echo Park':            [34.068, 34.092, -118.268, -118.238],
    'Virgil Village':       [34.078, 34.092, -118.295, -118.278],
    'Frogtown':             [34.095, 34.115, -118.262, -118.235],
    'Highland Park':        [34.100, 34.130, -118.215, -118.178],
    'Eagle Rock':           [34.115, 34.145, -118.232, -118.192],
    'Glassell Park':        [34.108, 34.128, -118.245, -118.212],
    'Cypress Park':         [34.078, 34.100, -118.240, -118.210],
    'Hermon':               [34.095, 34.115, -118.210, -118.180],
    'Lincoln Heights':      [34.060, 34.085, -118.228, -118.198],
    'East Los Angeles':     [34.018, 34.055, -118.195, -118.140],

    // Westlake / Central
    'Westlake':             [34.045, 34.070, -118.290, -118.255],

    // West side
    'West Hollywood':       [34.075, 34.105, -118.400, -118.343],
    'Beverly Hills':        [34.055, 34.090, -118.430, -118.375],
    'Century City':         [34.050, 34.070, -118.430, -118.408],
    'Westwood':             [34.050, 34.080, -118.460, -118.418],
    'Bel-Air':              [34.075, 34.100, -118.465, -118.425],
    'Brentwood':            [34.040, 34.075, -118.490, -118.455],
    'West LA':              [34.025, 34.062, -118.465, -118.420],
    'Palms':                [34.015, 34.038, -118.425, -118.395],
    'Mar Vista':            [33.985, 34.015, -118.450, -118.405],
    'Culver City':          [33.990, 34.045, -118.440, -118.375],
    'Pico-Robertson':       [34.045, 34.070, -118.410, -118.378],

    // Santa Monica / coastal
    'Santa Monica':         [33.990, 34.050, -118.515, -118.465],
    'Venice':                [33.970, 34.015, -118.498, -118.458],
    'Playa Vista':          [33.965, 33.988, -118.425, -118.398],

    // South / South Bay
    'South LA':             [33.975, 34.025, -118.325, -118.235],
    'Leimert Park':         [33.990, 34.015, -118.345, -118.320],
    'Vermont Square':       [33.990, 34.012, -118.325, -118.305],
    'Huntington Park':      [33.970, 34.000, -118.245, -118.200],
    'Inglewood':            [33.950, 33.990, -118.395, -118.335],
    'Manhattan Beach':      [33.870, 33.895, -118.425, -118.398],
    'Hermosa Beach':        [33.852, 33.878, -118.412, -118.392],
    'Long Beach':           [33.750, 33.810, -118.230, -118.100],
    'Torrance':             [33.815, 33.860, -118.370, -118.320],
    'Gardena':              [33.865, 33.898, -118.325, -118.282],
    'Rancho Palos Verdes':  [33.720, 33.765, -118.425, -118.362],
    'Norwalk':              [33.880, 33.920, -118.095, -118.040],

    // San Gabriel Valley
    'Pasadena':             [34.118, 34.180, -118.188, -118.055],
    'South Pasadena':       [34.098, 34.128, -118.175, -118.138],
    'Altadena':             [34.170, 34.215, -118.185, -118.095],
    'Arcadia':              [34.112, 34.150, -118.080, -118.018],
    'Alhambra':             [34.072, 34.105, -118.175, -118.105],
    'San Gabriel':          [34.078, 34.115, -118.118, -118.062],
    'Temple City':          [34.092, 34.115, -118.090, -118.035],
    'Monterey Park':        [34.048, 34.078, -118.150, -118.098],
    'Rosemead':             [34.058, 34.090, -118.102, -118.045],
    'El Monte':             [34.068, 34.112, -118.050, -117.982],
    'City of Industry':     [33.995, 34.025, -117.995, -117.915],
    'West Covina':          [34.048, 34.095, -117.955, -117.855],
    'Hacienda Heights':     [33.965, 34.012, -117.985, -117.925],
    'Glendale':             [34.128, 34.180, -118.280, -118.215],

    // Valley
    'Studio City':          [34.128, 34.158, -118.420, -118.370],
    'Sherman Oaks':         [34.138, 34.180, -118.475, -118.418],
    'Toluca Lake':          [34.138, 34.168, -118.378, -118.348],
    'Van Nuys':             [34.165, 34.215, -118.498, -118.430],
    'Encino':               [34.138, 34.185, -118.515, -118.480],
    'Valley Glen':          [34.175, 34.205, -118.435, -118.388],
    'Northridge':           [34.208, 34.265, -118.585, -118.518],
    'Granada Hills':        [34.252, 34.305, -118.545, -118.478],
    'Woodland Hills':       [34.152, 34.198, -118.625, -118.565],
    'Canoga Park':          [34.182, 34.232, -118.625, -118.582],
    'Winnetka':             [34.188, 34.235, -118.595, -118.558],

    // Outer
    'Malibu':               [34.015, 34.085, -118.820, -118.560],
    'Pico-Robertson':       [34.045, 34.070, -118.410, -118.378],
  },
  nyc: {
    // Lower Manhattan
    'Financial District':           [40.698, 40.718, -74.023, -73.995],
    'Tribeca':                      [40.712, 40.728, -74.018, -73.998],
    'SoHo':                         [40.718, 40.732, -74.008, -73.988],
    'NoHo':                         [40.724, 40.734, -74.002, -73.987],
    'Nolita':                       [40.716, 40.728, -74.000, -73.990],
    'Chinatown':                    [40.710, 40.722, -74.005, -73.988],
    'Lower East Side':              [40.708, 40.725, -73.995, -73.975],
    'West Village':                 [40.728, 40.745, -74.015, -73.993],
    'Greenwich Village':            [40.724, 40.740, -74.005, -73.980],
    'East Village':                 [40.718, 40.740, -73.998, -73.968],
    'Meatpacking District':         [40.735, 40.746, -74.012, -73.998],

    // Midtown zone
    'Chelsea':                      [40.738, 40.762, -74.012, -73.985],
    'Flatiron / NoMad':             [40.735, 40.755, -74.002, -73.978],
    'Gramercy':                     [40.732, 40.745, -73.992, -73.972],
    'Hudson Yards':                 [40.748, 40.765, -74.005, -73.988],
    "Hell's Kitchen":               [40.755, 40.775, -74.003, -73.983],
    'Midtown':                      [40.745, 40.775, -73.998, -73.962],
    'Midtown West':                 [40.748, 40.775, -74.002, -73.975],
    'Midtown East':                 [40.745, 40.772, -73.983, -73.955],
    'Central Park South':           [40.762, 40.775, -73.992, -73.968],

    // Uptown
    'Upper West Side':              [40.765, 40.808, -73.988, -73.958],
    'Lincoln Center':               [40.768, 40.778, -73.988, -73.975],
    'Upper East Side':              [40.758, 40.798, -73.985, -73.938],
    'Harlem':                       [40.795, 40.840, -73.962, -73.925],
    'East Harlem':                  [40.788, 40.810, -73.948, -73.925],
    'Roosevelt Island':             [40.745, 40.775, -73.965, -73.945],

    // Brooklyn
    'Brooklyn Heights':             [40.685, 40.705, -74.005, -73.988],
    'DUMBO':                        [40.698, 40.712, -74.002, -73.982],
    'Downtown Brooklyn':            [40.685, 40.702, -73.992, -73.972],
    'Fort Greene / Clinton Hill':   [40.678, 40.698, -73.982, -73.952],
    'Williamsburg':                 [40.698, 40.725, -73.972, -73.940],
    'East Williamsburg':            [40.700, 40.720, -73.945, -73.918],
    'Greenpoint':                   [40.717, 40.740, -73.962, -73.935],
    'Bushwick':                     [40.688, 40.712, -73.938, -73.905],
    'Bed-Stuy':                     [40.672, 40.698, -73.970, -73.918],
    'Crown Heights':                [40.658, 40.685, -73.965, -73.922],
    'Park Slope / Prospect Heights':[40.662, 40.688, -73.990, -73.962],
    'Carroll Gardens / Cobble Hill':[40.672, 40.695, -74.008, -73.982],
    'Red Hook':                     [40.668, 40.688, -74.022, -73.995],
    'Bay Ridge':                    [40.615, 40.645, -74.045, -74.015],
    'Coney Island / South Brooklyn':[40.568, 40.650, -74.015, -73.942],

    // Queens
    'Astoria':                      [40.755, 40.795, -73.935, -73.905],
    'Long Island City':             [40.735, 40.760, -73.965, -73.928],
    'Jackson Heights / Elmhurst':   [40.735, 40.765, -73.895, -73.865],
    'Flushing':                     [40.750, 40.775, -73.845, -73.818],
    'Ridgewood':                    [40.692, 40.718, -73.918, -73.890],
    'Queens':                       [40.700, 40.795, -73.960, -73.700], // broad catchall

    // Bronx / Staten
    'Bronx':                        [40.800, 40.925, -73.940, -73.770],
    'Staten Island':                [40.500, 40.660, -74.270, -74.050],
  },
  seattle: {
    // Downtown core
    'Downtown':                     [47.598, 47.620, -122.350, -122.325],
    'Belltown':                     [47.608, 47.622, -122.358, -122.338],
    'Pike Place Market':            [47.607, 47.614, -122.347, -122.338],
    'Pioneer Square':                [47.595, 47.605, -122.338, -122.315],
    'Chinatown-International District':[47.593, 47.605, -122.332, -122.312],
    'South Lake Union':             [47.615, 47.632, -122.345, -122.325],
    'Seattle Center':               [47.617, 47.628, -122.358, -122.342],
    'Downtown Waterfront':          [47.600, 47.618, -122.348, -122.335],
    'Waterfront':                   [47.600, 47.618, -122.358, -122.335],
    'SODO':                         [47.575, 47.600, -122.338, -122.320],

    // Capitol Hill / Central
    'Capitol Hill':                 [47.605, 47.640, -122.330, -122.298],
    'Central District':             [47.595, 47.622, -122.320, -122.288],
    'Eastlake':                     [47.628, 47.652, -122.332, -122.318],
    'Madrona':                      [47.605, 47.622, -122.298, -122.278],
    'Madison Valley':               [47.618, 47.632, -122.300, -122.280],

    // Queen Anne + N/W
    'Queen Anne':                   [47.620, 47.648, -122.378, -122.342],
    'Magnolia':                     [47.623, 47.668, -122.420, -122.375],

    // North Seattle
    'Ballard':                      [47.655, 47.695, -122.412, -122.368],
    'Fremont':                      [47.645, 47.665, -122.363, -122.335],
    'Wallingford':                  [47.645, 47.668, -122.350, -122.318],
    'Phinney Ridge':                [47.668, 47.695, -122.370, -122.343],
    'Greenwood':                    [47.688, 47.738, -122.365, -122.340],
    'Green Lake':                   [47.675, 47.695, -122.352, -122.328],
    'University District':          [47.650, 47.678, -122.325, -122.295],
    'University Village':           [47.658, 47.670, -122.308, -122.293],
    'Ravenna':                      [47.670, 47.685, -122.318, -122.295],
    'Wedgwood':                     [47.675, 47.698, -122.318, -122.295],
    'Maple Leaf':                   [47.705, 47.725, -122.325, -122.298],

    // South
    'Beacon Hill':                  [47.545, 47.600, -122.320, -122.285],
    'Georgetown':                   [47.540, 47.565, -122.338, -122.302],
    'Mount Baker':                  [47.560, 47.595, -122.300, -122.270],
    'Columbia City':                [47.548, 47.568, -122.298, -122.270],
    'Hillman City':                 [47.545, 47.560, -122.298, -122.278],
    'South Seattle':                [47.470, 47.515, -122.290, -122.200],
    'Tukwila':                      [47.455, 47.500, -122.310, -122.250],

    // West Seattle
    'West Seattle':                 [47.515, 47.605, -122.420, -122.315],
    'Alki Beach':                   [47.570, 47.590, -122.420, -122.395],

    // East side
    'Bellevue':                     [47.600, 47.665, -122.205, -122.170],
    'Kirkland':                     [47.665, 47.715, -122.225, -122.170],
    'Woodinville':                  [47.730, 47.770, -122.180, -122.120],

    // North suburbs
    'Lynnwood':                     [47.810, 47.860, -122.315, -122.265],
  },
  lv: {
    // Strip — casino-specific buckets (tight, ~200m each)
    'The Strip (Mandalay Bay)':     [36.088, 36.100, -115.180, -115.170],
    'The Strip (New York-New York)':[36.099, 36.107, -115.178, -115.171],
    'The Strip (Park MGM)':         [36.099, 36.108, -115.178, -115.170],
    'The Strip (MGM Grand)':        [36.099, 36.108, -115.175, -115.166],
    'The Strip (Showcase Mall)':    [36.099, 36.106, -115.175, -115.168],
    'The Strip (The Cosmopolitan)': [36.107, 36.113, -115.177, -115.170],
    'The Strip (Aria)':             [36.104, 36.115, -115.181, -115.168],
    'The Strip (Bellagio)':         [36.109, 36.116, -115.179, -115.170],
    'The Strip (Planet Hollywood)': [36.107, 36.112, -115.175, -115.167],
    'The Strip (Paris Las Vegas)':  [36.109, 36.113, -115.174, -115.168],
    'The Strip (Caesars Palace)':   [36.114, 36.120, -115.179, -115.169],
    'The Strip (The Cromwell)':     [36.113, 36.118, -115.175, -115.170],
    'The Strip (Grand Canal Shoppes)':[36.119, 36.124, -115.173, -115.167],
    'The Strip (The Palazzo)':      [36.119, 36.126, -115.174, -115.166],
    'The Strip (The Venetian)':     [36.119, 36.127, -115.174, -115.166],
    'The Strip (Treasure Island)':  [36.122, 36.128, -115.175, -115.168],
    'The Strip (The Mirage)':       [36.122, 36.127, -115.175, -115.168],
    'The Strip (Wynn)':             [36.124, 36.132, -115.170, -115.160],
    'The Strip (Encore at Wynn)':   [36.125, 36.131, -115.170, -115.162],
    'The Strip (Resorts World)':    [36.128, 36.137, -115.170, -115.160],
    'The Strip (Fontainebleau)':    [36.132, 36.146, -115.172, -115.158],
    'The Strip (The STRAT)':        [36.144, 36.150, -115.160, -115.152],
    'The Strip':                    [36.085, 36.165, -115.200, -115.155], // generic-strip catchall

    // Downtown area
    'Downtown':                     [36.160, 36.185, -115.160, -115.125],
    'Downtown (Fremont East)':      [36.163, 36.180, -115.150, -115.130],
    'Downtown (Circa)':             [36.165, 36.178, -115.155, -115.140],
    'Arts District':                [36.150, 36.168, -115.165, -115.140],

    // West of Strip / Chinatown / Spring Valley
    'Chinatown':                    [36.112, 36.130, -115.225, -115.180],
    'West of Strip':                [36.100, 36.165, -115.225, -115.175],
    'Off-Strip':                    [36.120, 36.145, -115.195, -115.160],
    'Spring Valley':                [36.055, 36.115, -115.320, -115.180],

    // Summerlin (west / far west)
    'Summerlin':                    [36.135, 36.230, -115.400, -115.260],
    'Summerlin (Downtown Summerlin)':[36.145, 36.200, -115.345, -115.280],
    'Summerlin (Red Rock Resort)':  [36.150, 36.165, -115.345, -115.285],

    // Henderson
    'Henderson':                    [35.980, 36.090, -115.150, -114.930],
    'Henderson (M Resort)':         [35.988, 36.010, -115.160, -115.140],

    // North
    'North Las Vegas':              [36.195, 36.295, -115.250, -115.060],
    'Paradise':                     [36.080, 36.145, -115.180, -115.110], // east of Strip (UNLV, airport area)

    // Separate city
    'Boulder City':                 [35.965, 36.025, -114.870, -114.720],
  },
  austin: {
    // Central core
    'Downtown':       [30.255, 30.285, -97.760, -97.730],
    '6th Street':     [30.262, 30.275, -97.748, -97.730],
    'Red River':      [30.262, 30.278, -97.740, -97.728],
    'Rainey Street':  [30.252, 30.268, -97.745, -97.735],
    'Clarksville':    [30.265, 30.288, -97.768, -97.740],
    'West Austin':    [30.270, 30.325, -97.810, -97.745],

    // South of the river
    'South Congress': [30.225, 30.265, -97.755, -97.725],
    'South 1st':      [30.230, 30.268, -97.770, -97.750],
    'South Lamar':    [30.215, 30.265, -97.790, -97.745],
    'Zilker':         [30.245, 30.275, -97.780, -97.735],
    'South Austin':   [30.150, 30.240, -97.830, -97.710], // broad catch-all south of Ladybird Lake

    // East
    'East Austin':    [30.240, 30.300, -97.735, -97.680],
    'Mueller':        [30.285, 30.330, -97.715, -97.690],

    // North
    'Hyde Park':      [30.295, 30.325, -97.740, -97.720],
    'North Loop':     [30.300, 30.330, -97.735, -97.700],
    'North Lamar':    [30.290, 30.380, -97.740, -97.695],
    'North Austin':   [30.330, 30.460, -97.730, -97.670],
    'Domain':         [30.395, 30.415, -97.735, -97.715],

    // Far south (separate town)
    'Lockhart':       [29.870, 29.895, -97.680, -97.660],
  },
  chicago: {
    // Central core
    'The Loop':             [41.872, 41.892, -87.650, -87.615],
    'River North':          [41.885, 41.905, -87.645, -87.620],
    'West Loop / Fulton Market': [41.875, 41.897, -87.675, -87.638],
    'Gold Coast':           [41.895, 41.913, -87.638, -87.618],
    'Streeterville':        [41.882, 41.902, -87.628, -87.605],
    'Old Town':             [41.900, 41.917, -87.648, -87.625],
    'Near South Side':      [41.855, 41.875, -87.650, -87.615],
    'South Loop':           [41.855, 41.895, -87.650, -87.600],
    'Museum Campus':        [41.858, 41.870, -87.625, -87.605],
    'Greektown':            [41.875, 41.888, -87.658, -87.638],
    'Maxwell Street':       [41.860, 41.872, -87.655, -87.638],
    'Little Italy / University Village': [41.858, 41.878, -87.680, -87.645],

    // North side
    'Lincoln Park':         [41.905, 41.935, -87.672, -87.628],
    'Lakeview / Wrigleyville': [41.930, 41.955, -87.680, -87.640],
    'Bucktown':             [41.908, 41.925, -87.685, -87.658],
    'Wicker Park':          [41.898, 41.925, -87.687, -87.660],
    'Ukrainian Village':    [41.893, 41.908, -87.685, -87.662],
    'West Town':            [41.892, 41.920, -87.685, -87.648],
    'Noble Square':         [41.893, 41.905, -87.678, -87.658],
    'Humboldt Park':        [41.892, 41.918, -87.725, -87.695],
    'Logan Square':         [41.918, 41.945, -87.728, -87.690],
    'Hermosa':              [41.912, 41.945, -87.745, -87.700],
    'Avondale':             [41.928, 41.955, -87.725, -87.695],
    'Irving Park':          [41.940, 41.965, -87.745, -87.695],
    'North Center':         [41.948, 41.972, -87.695, -87.662],
    'Ravenswood':           [41.955, 41.982, -87.695, -87.670],
    'Lincoln Square':       [41.950, 41.985, -87.712, -87.680],
    'Albany Park':          [41.962, 41.985, -87.735, -87.698],
    'Uptown':               [41.955, 41.982, -87.692, -87.642],
    'Edgewater':            [41.970, 42.005, -87.675, -87.648],
    'Andersonville':        [41.975, 41.995, -87.678, -87.660],
    'West Rogers Park':     [41.990, 42.018, -87.712, -87.658],
    'Devon Avenue':         [41.992, 42.008, -87.702, -87.680],

    // South side / Southwest
    'Pilsen':               [41.838, 41.862, -87.682, -87.635],
    'Little Village':       [41.832, 41.858, -87.730, -87.690],
    'Bridgeport':           [41.822, 41.852, -87.665, -87.625],
    'Chinatown':            [41.848, 41.862, -87.645, -87.625],
    'Bronzeville':          [41.815, 41.855, -87.635, -87.605], // incl. Kenwood edge (4400 S)
    'Hyde Park':            [41.785, 41.810, -87.610, -87.575],
    'Douglas Park':         [41.852, 41.870, -87.700, -87.680],
    'Chatham':              [41.735, 41.762, -87.628, -87.598],
    'Beverly':              [41.692, 41.725, -87.690, -87.660],
    'Englewood':            [41.770, 41.795, -87.660, -87.620],
    'Ashburn (South Side)': [41.735, 41.755, -87.740, -87.710],
    'Archer Heights':       [41.795, 41.812, -87.745, -87.712],
    'Pullman':              [41.682, 41.702, -87.618, -87.595],
    'South Deering':        [41.712, 41.735, -87.558, -87.530],
    'South Side':           [41.730, 41.775, -87.640, -87.600],

    // Outer / suburban
    'Norwood Park':         [41.988, 42.005, -87.800, -87.770],
    'Elmwood Park':         [41.900, 41.925, -87.828, -87.795],
    'River Grove':          [41.915, 41.935, -87.850, -87.825],
    'Niles (Suburban)':     [42.002, 42.020, -87.820, -87.790],
    'Northwest Side':       [41.920, 41.952, -87.760, -87.728],
  },
  houston: {
    // Inner Loop core
    'Downtown':             [29.745, 29.775, -95.385, -95.345],
    'Midtown':              [29.730, 29.762, -95.398, -95.355],
    'Montrose':             [29.720, 29.760, -95.410, -95.370],
    'Museum District':      [29.710, 29.745, -95.405, -95.370],
    'Heights':              [29.770, 29.820, -95.420, -95.375],
    'Washington Corridor':  [29.753, 29.790, -95.425, -95.375],
    'Washington':           [29.753, 29.790, -95.425, -95.375],
    'River Oaks':           [29.730, 29.775, -95.450, -95.395],
    'Upper Kirby':          [29.718, 29.755, -95.455, -95.405],
    'Galleria':             [29.720, 29.770, -95.480, -95.435],
    'Rice Village':         [29.705, 29.730, -95.430, -95.395],
    'West University':      [29.700, 29.735, -95.440, -95.400],
    'EaDo':                 [29.738, 29.775, -95.370, -95.335],
    'East End':             [29.720, 29.765, -95.365, -95.285],

    // Inner/mid west + north
    'Memorial':             [29.745, 29.800, -95.540, -95.445],
    'Spring Branch':        [29.770, 29.835, -95.565, -95.470],
    'Chinatown / Bellaire': [29.690, 29.735, -95.615, -95.440],
    'Southwest Houston':    [29.635, 29.715, -95.560, -95.430],
    'Northwest Houston':    [29.795, 29.965, -95.580, -95.455],
    'West Houston':         [29.745, 29.820, -95.670, -95.530],
    'Energy Corridor':      [29.765, 29.815, -95.625, -95.575],

    // Outer suburbs / separate cities
    'The Woodlands':        [30.095, 30.210, -95.555, -95.395],
    'Spring':               [30.025, 30.185, -95.510, -95.375],
    'Tomball':              [30.045, 30.115, -95.640, -95.575],
    'Katy':                 [29.745, 29.830, -95.840, -95.710],
    'Pearland':             [29.530, 29.610, -95.330, -95.245],
    'Clear Lake':           [29.525, 29.605, -95.185, -95.060],
    'Kemah':                [29.525, 29.560, -95.045, -95.005],
    'La Porte':             [29.645, 29.770, -95.105, -94.995],
    'Friendswood':          [29.500, 29.565, -95.245, -95.175],
    'IAH Airport':          [29.970, 30.010, -95.370, -95.320],
  },
  dallas: {
    // Core urban Dallas
    'Downtown Dallas':      [32.770, 32.795, -96.815, -96.790],
    'Uptown':               [32.788, 32.822, -96.815, -96.785],
    'Victory Park':         [32.783, 32.795, -96.815, -96.805],
    'Arts District':        [32.783, 32.795, -96.805, -96.793],
    'Harwood District':     [32.770, 32.800, -96.815, -96.785],
    'West Village':         [32.796, 32.812, -96.810, -96.793],
    'Deep Ellum':           [32.778, 32.795, -96.795, -96.765],
    'Cedars':               [32.760, 32.778, -96.815, -96.790],
    'Oak Lawn':             [32.790, 32.822, -96.828, -96.790],
    'Design District':      [32.775, 32.810, -96.845, -96.795],
    'Trinity Groves':       [32.760, 32.790, -96.885, -96.818],

    // East Dallas
    'Knox-Henderson':       [32.800, 32.835, -96.810, -96.770],
    'Lower Greenville':     [32.795, 32.855, -96.795, -96.765],
    'East Dallas / Lakewood':[32.795, 32.845, -96.770, -96.690],

    // Park Cities (HP + University Park + SMU area)
    'Highland Park':        [32.820, 32.852, -96.820, -96.795],
    'Park Cities':          [32.820, 32.875, -96.820, -96.765],

    // South Dallas / Oak Cliff
    'Bishop Arts':           [32.735, 32.760, -96.845, -96.820],
    'Oak Cliff':             [32.665, 32.775, -96.875, -96.800],

    // North Dallas corridor
    'North Dallas':         [32.860, 32.930, -96.855, -96.715],
    'Preston Hollow':       [32.855, 32.905, -96.835, -96.765],
    'Far North Dallas':     [32.905, 32.995, -96.855, -96.720],

    // Collar cities
    'Addison':              [32.935, 32.995, -96.860, -96.790],
    'Carrollton':           [32.935, 33.015, -96.925, -96.865],
    'Plano':                [32.995, 33.115, -96.845, -96.675],
    'Frisco':               [33.065, 33.170, -96.870, -96.750],
    'McKinney':             [33.060, 33.250, -96.885, -96.575],
    'Richardson':           [32.895, 32.990, -96.770, -96.625],
    'Irving / Las Colinas': [32.855, 32.940, -96.975, -96.930],
    'Flower Mound':         [33.005, 33.080, -97.200, -97.000],
    'Grapevine':            [32.920, 32.975, -97.110, -97.050],

    // Outer ring
    'Arlington / Mid-Cities':[32.680, 32.775, -97.190, -96.995],
    'Rockwall':             [32.870, 32.945, -96.490, -96.420],
    'Forney':               [32.730, 32.775, -96.490, -96.440],
  },
  slc: {
    // Core SLC grid
    'Downtown SLC':       [40.745, 40.790, -111.912, -111.875],
    'Central City':       [40.745, 40.770, -111.895, -111.870],
    'Central 9th':        [40.743, 40.752, -111.912, -111.883],
    'Granary District':   [40.745, 40.760, -111.910, -111.880],
    'Post District':      [40.752, 40.760, -111.905, -111.890],
    'Gateway':            [40.760, 40.778, -111.930, -111.898],
    'Westside SLC':       [40.695, 40.795, -111.990, -111.880], // incl. airport (NW)
    'Marmalade':          [40.775, 40.790, -111.905, -111.870],
    'The Avenues':        [40.768, 40.795, -111.895, -111.855],
    'Trolley Square':     [40.750, 40.762, -111.885, -111.865],
    '9th & 9th':          [40.745, 40.755, -111.870, -111.850],
    'Liberty Park':       [40.720, 40.755, -111.885, -111.855],
    'Sugar House':        [40.695, 40.755, -111.870, -111.815],
    'University':         [40.755, 40.775, -111.855, -111.810],
    'Emigration Canyon':  [40.745, 40.760, -111.825, -111.790],

    // Salt Lake County cities (bordering SLC)
    'South Salt Lake':    [40.695, 40.730, -111.910, -111.870],
    'Millcreek':          [40.680, 40.720, -111.890, -111.715], // incl. Millcreek Canyon
    'Holladay':           [40.630, 40.700, -111.870, -111.815],
    'Cottonwood Heights': [0,0,0,0], // see below — needs split for canyons
    'Murray':             [40.630, 40.690, -111.920, -111.870],
    'West Valley':        [40.680, 40.745, -112.050, -111.920],
    'Midvale':            [40.600, 40.650, -111.910, -111.870],
    'Sandy':              [40.545, 40.620, -111.900, -111.785],
    'Draper':             [40.505, 40.550, -111.890, -111.840],
    'South Jordan':       [40.540, 40.585, -112.010, -111.900],
    'Riverton':           [40.500, 40.535, -112.030, -111.960],

    // North of SLC (Davis County)
    'North Salt Lake':    [40.835, 40.890, -111.925, -111.870],
    'Bountiful':          [40.840, 40.905, -111.920, -111.860],
    'Farmington':         [40.965, 41.010, -111.920, -111.870],

    // Further afield (tracked as suburb:true but still labeled per city)
    'Ogden':              [41.180, 41.290, -112.010, -111.940],
    'Logan':              [41.715, 41.765, -111.870, -111.820],
    'Park City':          [40.600, 40.700, -111.570, -111.460],
    'Midway (Heber Valley)': [40.495, 40.535, -111.495, -111.440],
    // Provo bound is split: city proper (40.22-40.30) + Sundance Resort up
    // Provo Canyon (Alpine Loop) which is the canonical "Provo-area" bucket
    // for those 5 Sundance cards despite being ~15mi north on the Alpine Loop.
    'Provo':              [[40.215, 40.305, -111.740, -111.625], [40.385, 40.405, -111.595, -111.575]],
    'Lehi':               [40.370, 40.450, -111.940, -111.780],

    // Catchalls — skip strict box validation; just sanity-check state bounds
    'Suburban SLC':       null, // catchall
    'Westside SLC':       [40.695, 40.795, -111.990, -111.880], // incl. airport (NW) // keep
  }
};

// Cottonwood Heights has two disjoint pieces (valley floor + canyon resorts);
// use a multi-box override instead of one giant envelope.
NBH_BOUNDS.slc['Cottonwood Heights'] = [
  [40.600, 40.645, -111.870, -111.800], // city core
  [40.575, 40.620, -111.700, -111.580], // Big/Little Cottonwood + Brighton/Snowbird/Alta
];

// Utah overall sanity box — catches "labeled UT but coords in another state"
const STATE_BOX_UT = [36.9, 42.0, -114.1, -108.9];

function inBox(lat, lng, box) {
  return lat >= box[0] && lat <= box[1] && lng >= box[2] && lng <= box[3];
}

function inNeighborhood(lat, lng, city, neighborhood) {
  const table = NBH_BOUNDS[city];
  if (!table) return { ok: true, reason: 'no-bounds-for-city' };
  const entry = table[neighborhood];
  if (entry === undefined) return { ok: true, reason: 'no-bounds-for-neighborhood' };
  if (entry === null) return { ok: true, reason: 'catchall' };
  if (Array.isArray(entry[0])) {
    const matched = entry.some(box => inBox(lat, lng, box));
    return { ok: matched, reason: matched ? 'in-multi-box' : 'outside-all-boxes' };
  }
  return { ok: inBox(lat, lng, entry), reason: inBox(lat, lng, entry) ? 'in-box' : 'outside-box' };
}

module.exports = { NBH_BOUNDS, STATE_BOX_UT, inBox, inNeighborhood };
