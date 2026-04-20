// Neighborhood bounding boxes for coord-vs-label audits.
// Format per city: { 'Neighborhood Name': [latMin, latMax, lngMin, lngMax] }
// A box is a conservative envelope of the actual neighborhood; cards whose
// (lat,lng) fall outside the box for their claimed neighborhood are outliers.
// Bounds are authored from observed data + public city/zip boundaries; pad
// each by ~0.002° (~200m) to tolerate geocoding jitter.

const NBH_BOUNDS = {
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
