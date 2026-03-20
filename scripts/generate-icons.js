/**
 * generate-icons.js — Generate App Icons from SVG
 * =================================================
 *
 * Converts icons/icon.svg into all required PNG sizes for:
 *   - iOS App Store (1024x1024)
 *   - iOS app icons (180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20)
 *   - PWA manifest (512, 192)
 *   - Favicon (32, 16)
 *
 * ── Prerequisites ──────────────────────────────────────────────────
 *
 *   npm install sharp    (or: npx sharp available by default in many setups)
 *
 * ── Usage ──────────────────────────────────────────────────────────
 *
 *   node scripts/generate-icons.js
 *
 * ── Output ─────────────────────────────────────────────────────────
 *
 *   icons/icon-{size}.png for each size
 *   icons/AppIcon.appiconset/Contents.json (Xcode asset catalog)
 */

const fs = require('fs');
const path = require('path');

// All required icon sizes
const SIZES = [
  // App Store
  { size: 1024, name: 'app-store', note: 'App Store listing (required)' },
  // iOS app icons
  { size: 180, name: 'icon-180', note: 'iPhone @3x (60pt)' },
  { size: 167, name: 'icon-167', note: 'iPad Pro @2x (83.5pt)' },
  { size: 152, name: 'icon-152', note: 'iPad @2x (76pt)' },
  { size: 120, name: 'icon-120', note: 'iPhone @2x (60pt) / iPhone @3x (40pt)' },
  { size: 87, name: 'icon-87', note: 'iPhone @3x (29pt)' },
  { size: 80, name: 'icon-80', note: 'iPad @2x (40pt) / iPhone @2x (40pt)' },
  { size: 76, name: 'icon-76', note: 'iPad @1x (76pt)' },
  { size: 60, name: 'icon-60', note: 'iPhone @1x (60pt)' },
  { size: 58, name: 'icon-58', note: 'iPhone @2x (29pt)' },
  { size: 40, name: 'icon-40', note: 'iPhone @1x (40pt)' },
  { size: 29, name: 'icon-29', note: 'iPhone @1x (29pt)' },
  { size: 20, name: 'icon-20', note: 'iPhone @1x (20pt)' },
  // PWA
  { size: 512, name: 'icon-512', note: 'PWA manifest (512)' },
  { size: 192, name: 'icon-192', note: 'PWA manifest (192)' },
  // Favicon
  { size: 32, name: 'favicon-32', note: 'Favicon @2x' },
  { size: 16, name: 'favicon-16', note: 'Favicon @1x' },
];

const ICONS_DIR = path.join(__dirname, '..', 'icons');
const SVG_PATH = path.join(ICONS_DIR, 'icon.svg');

async function main() {
  // Check for sharp
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('ERROR: "sharp" package not installed.');
    console.error('');
    console.error('Install it with:');
    console.error('  npm install sharp');
    console.error('');
    console.error('Or generate PNGs manually from icons/icon.svg using any SVG editor.');
    console.error('Required sizes:');
    for (const s of SIZES) {
      console.log(`  ${s.size}x${s.size} → icons/${s.name}.png (${s.note})`);
    }
    process.exit(1);
  }

  // Read SVG
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`SVG not found: ${SVG_PATH}`);
    process.exit(1);
  }
  const svgBuffer = fs.readFileSync(SVG_PATH);

  console.log('Generating icons from icons/icon.svg...\n');

  for (const { size, name, note } of SIZES) {
    const outPath = path.join(ICONS_DIR, `${name}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`  ${size}x${size}  →  ${name}.png  (${note})`);
  }

  // Generate Xcode AppIcon.appiconset/Contents.json for Capacitor
  const appIconDir = path.join(ICONS_DIR, 'AppIcon.appiconset');
  fs.mkdirSync(appIconDir, { recursive: true });

  // Copy the 1024 icon for the asset catalog
  fs.copyFileSync(
    path.join(ICONS_DIR, 'app-store.png'),
    path.join(appIconDir, 'app-store-1024.png')
  );

  const contents = {
    images: [
      { size: '1024x1024', idiom: 'universal', filename: 'app-store-1024.png', platform: 'ios', scale: '1x' },
    ],
    info: { version: 1, author: 'generate-icons.js' },
  };
  fs.writeFileSync(
    path.join(appIconDir, 'Contents.json'),
    JSON.stringify(contents, null, 2)
  );

  console.log(`\n  Xcode asset catalog → icons/AppIcon.appiconset/Contents.json`);
  console.log(`\nDone! ${SIZES.length} icons generated.`);
  console.log('\nTo use in the app:');
  console.log('  - PWA icons are at icons/icon-192.png and icons/icon-512.png');
  console.log('  - Apple touch icon is at icons/icon-180.png');
  console.log('  - Xcode asset catalog is at icons/AppIcon.appiconset/');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
