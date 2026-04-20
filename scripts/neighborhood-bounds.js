// Neighborhood bounding boxes for coord-vs-label audits.
// Format per city: { 'Neighborhood Name': [latMin, latMax, lngMin, lngMax] }
// A box is a conservative envelope of the actual neighborhood; cards whose
// (lat,lng) fall outside the box for their claimed neighborhood are outliers.
// Bounds are authored from observed data + public city/zip boundaries; pad
// each by ~0.002° (~200m) to tolerate geocoding jitter.

const NBH_BOUNDS = {
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
