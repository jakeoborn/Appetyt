#!/usr/bin/env node
// Refactor: move DALLAS_NEIGHBORHOODS content into CITY_NEIGHBORHOODS.Dallas
// and remove all 5 special-case fallback references.
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// --- Step 1: Extract DALLAS_NEIGHBORHOODS inner content ---
const dnDeclIdx = html.indexOf('const DALLAS_NEIGHBORHOODS');
if (dnDeclIdx < 0) { console.error('DALLAS_NEIGHBORHOODS not found'); process.exit(1); }
const dnOpenIdx = html.indexOf('{', dnDeclIdx);
let depth = 0, dnCloseIdx = dnOpenIdx;
for (let i = dnOpenIdx; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') { depth--; if (depth === 0) { dnCloseIdx = i; break; } }
}
// Extract inner content (between { and })
const dnInner = html.slice(dnOpenIdx + 1, dnCloseIdx);
// Trim leading/trailing newlines only
const dnInnerTrimmed = dnInner.replace(/^\n+/, '\n').replace(/\n+$/, '\n');

// --- Step 2: Delete DALLAS_NEIGHBORHOODS declaration (include trailing ; and newline) ---
// Find end including `};` and possible trailing newline
let dnBlockEnd = dnCloseIdx + 1; // after closing }
// Skip optional `;`
if (html[dnBlockEnd] === ';') dnBlockEnd++;
// Skip one trailing newline
if (html[dnBlockEnd] === '\n') dnBlockEnd++;
// Walk back to include the leading "  const" whitespace and prior newline
let dnBlockStart = dnDeclIdx;
// Go back to start-of-line
while (dnBlockStart > 0 && html[dnBlockStart - 1] !== '\n') dnBlockStart--;
// Include the preceding newline too
if (dnBlockStart > 0 && html[dnBlockStart - 1] === '\n') dnBlockStart--;

// Capture the snippet we're about to delete (for logging)
const deletedBlock = html.slice(dnBlockStart, dnBlockEnd);

// --- Step 3: Insert Dallas into CITY_NEIGHBORHOODS before its closing }; ---
// Find CITY_NEIGHBORHOODS decl
const cnDeclIdx = html.indexOf('const CITY_NEIGHBORHOODS');
if (cnDeclIdx < 0) { console.error('CITY_NEIGHBORHOODS not found'); process.exit(1); }
const cnOpenIdx = html.indexOf('{', cnDeclIdx);
depth = 0;
let cnCloseIdx = cnOpenIdx;
for (let i = cnOpenIdx; i < html.length; i++) {
  if (html[i] === '{') depth++;
  if (html[i] === '}') { depth--; if (depth === 0) { cnCloseIdx = i; break; } }
}

// Build the Dallas insert. We want:
//   'Dallas': {
//     <content>
//   },
// with the same 4-space indentation convention used by surrounding keys.
// The existing pattern uses 2-space outer indent, 4-space inner indent.
const dallasInsert = "  'Dallas':{" + dnInnerTrimmed + "  },\n";

// Inject right before closing `}` of CITY_NEIGHBORHOODS. Preserve a newline.
// Work on the html with the deletion applied first (order matters because indices shift).
// Easier: do the insert on the string in one pass — do inserts and deletes relative to the original string carefully.

// Strategy: do the DELETE first (it's after the CITY_NEIGHBORHOODS object in file order), so CITY_NEIGHBORHOODS indices remain valid.
// After delete, re-find CITY_NEIGHBORHOODS close and insert.
html = html.slice(0, dnBlockStart) + html.slice(dnBlockEnd);

// Re-find CITY_NEIGHBORHOODS close (unchanged since delete was after it)
// cnCloseIdx is still valid in the new string because we only deleted content after it.
// Insert Dallas body just before the closing '}'.
html = html.slice(0, cnCloseIdx) + dallasInsert + html.slice(cnCloseIdx);

console.log('Step 1+2+3: DALLAS_NEIGHBORHOODS -> CITY_NEIGHBORHOODS.Dallas. Deleted ' + deletedBlock.length + ' chars.');

// --- Step 4: Update the 5 code references ---
const replacements = [
  {
    // L6165: const nd=DALLAS_NEIGHBORHOODS[n]||cityNbhd[n];
    find: 'const nd=DALLAS_NEIGHBORHOODS[n]||cityNbhd[n];',
    replace: 'const nd=cityNbhd[n];',
  },
  {
    // L8269: drop the dallas fallback and simplify var nbhd
    find: "    var dallasNbhd=(typeof DALLAS_NEIGHBORHOODS!=='undefined'&&DALLAS_NEIGHBORHOODS[hood])?DALLAS_NEIGHBORHOODS[hood]:null;\n    var nbhd=cnData||dallasNbhd;",
    replace: '    var nbhd=cnData;',
  },
  {
    // L8979-8981: the ternary merge block — collapse to just the CITY_NEIGHBORHOODS read.
    find: "          const cn = (S.city==='Dallas' && typeof DALLAS_NEIGHBORHOODS!=='undefined')\n            ? {...(CITY_NEIGHBORHOODS[S.city]||{}), ...DALLAS_NEIGHBORHOODS}\n            : (CITY_NEIGHBORHOODS[S.city]||{});",
    replace: "          const cn = CITY_NEIGHBORHOODS[S.city]||{};",
  },
  {
    // L10661-10662
    find: "    var dallasNbhd = (city==='Dallas' && typeof DALLAS_NEIGHBORHOODS!=='undefined' && DALLAS_NEIGHBORHOODS[n.name]) ? DALLAS_NEIGHBORHOODS[n.name] : null;\n    var nbhd = cnData || dallasNbhd;",
    replace: '    var nbhd = cnData;',
  },
  {
    // L11695: dallasNeighborhoods split
    find: "    const dallasNeighborhoods=S.city==='Dallas'?Object.keys(DALLAS_NEIGHBORHOODS):[];\n    // Merge all, deduplicate\n    const allNbhds=[...new Set([...dataNeighborhoods,...guideNeighborhoods,...dallasNeighborhoods])].sort();",
    replace: "    // Merge all, deduplicate\n    const allNbhds=[...new Set([...dataNeighborhoods,...guideNeighborhoods])].sort();",
  },
];

let replaced = 0;
replacements.forEach((r, i) => {
  const before = html.length;
  html = html.split(r.find).join(r.replace);
  if (html.length !== before) {
    replaced++;
    console.log('  [' + (i + 1) + '/' + replacements.length + '] applied');
  } else {
    console.log('  [' + (i + 1) + '/' + replacements.length + '] NOT FOUND: ' + r.find.slice(0, 80) + (r.find.length > 80 ? '...' : ''));
  }
});
console.log('Step 4: ' + replaced + '/' + replacements.length + ' code references updated.');

// --- Sanity check: no remaining DALLAS_NEIGHBORHOODS references ---
const leftover = html.split('DALLAS_NEIGHBORHOODS').length - 1;
console.log('Remaining DALLAS_NEIGHBORHOODS references in file: ' + leftover);

fs.writeFileSync(htmlPath, html);
console.log('\nindex.html written.');
