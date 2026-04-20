// Neighborhood bounding boxes for coord-vs-label audits.
// Format per city: { 'Neighborhood Name': [latMin, latMax, lngMin, lngMax] }
// A box is a conservative envelope of the actual neighborhood; cards whose
// (lat,lng) fall outside the box for their claimed neighborhood are outliers.
// Bounds are authored from observed data + public city/zip boundaries; pad
// each by ~0.002° (~200m) to tolerate geocoding jitter.

const NBH_BOUNDS = {
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
