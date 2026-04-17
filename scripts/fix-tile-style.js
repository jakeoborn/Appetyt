const fs = require('fs');
let h = fs.readFileSync('index.html','utf8');

// 1. Upgrade spotlight tile — gold border + dim glow
const old1 = `background:var(--card);border:1px solid var(--border);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s" onmouseover="this.style.borderColor=\\'var(--gold)\\'" onmouseout="this.style.borderColor=\\'var(--border)\\'"`;
const new1 = `background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s" onmouseover="this.style.boxShadow=\\'0 0 18px rgba(232,201,122,.45)\\';this.style.transform=\\'translateX(2px)\\'" onmouseout="this.style.boxShadow=\\'0 0 8px rgba(200,169,110,.2)\\';this.style.transform=\\'\\'\\'"`;

if(h.includes(old1)){
  h = h.replace(old1, new1);
  console.log('1. Upgraded spotlight tile gold border + glow');
} else {
  console.log('1. FAILED - pattern not found, trying alternate...');
  // Try with different escape pattern
  const old1b = "background:var(--card);border:1px solid var(--border);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color .15s\" onmouseover=\"this.style.borderColor=\\'var(--gold)\\'\" onmouseout=\"this.style.borderColor=\\'var(--border)\\'\"";
  if(h.includes(old1b)){
    const new1b = "background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s\" onmouseover=\"this.style.boxShadow=\\'0 0 18px rgba(232,201,122,.45)\\';this.style.transform=\\'translateX(2px)\\'\" onmouseout=\"this.style.boxShadow=\\'0 0 8px rgba(200,169,110,.2)\\';this.style.transform=\\'\\'\\'\"";
    h = h.replace(old1b, new1b);
    console.log('1. Upgraded with alternate escaping');
  } else {
    // Last resort: use regex
    const re = /background:var\(--card\);border:1px solid var\(--border\);border-radius:12px;cursor:pointer;touch-action:manipulation;transition:border-color \.15s" onmouseover="this\.style\.borderColor=\\'var\(--gold\)\\'" onmouseout="this\.style\.borderColor=\\'var\(--border\)\\'"/;
    if(re.test(h)){
      h = h.replace(re, 'background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;cursor:pointer;touch-action:manipulation;box-shadow:0 0 8px rgba(200,169,110,.2);transition:box-shadow .2s,transform .1s" onmouseover="this.style.boxShadow=\\\'0 0 18px rgba(232,201,122,.45)\\\';this.style.transform=\\\'translateX(2px)\\\'" onmouseout="this.style.boxShadow=\\\'0 0 8px rgba(200,169,110,.2)\\\';this.style.transform=\\\'\\\'"');
      console.log('1. Upgraded via regex');
    } else {
      console.log('1. ALL PATTERNS FAILED');
      // Debug: show the actual chars
      const fnIdx = h.indexOf('// Venue tile helper (same as nightlife)');
      const chunk = h.substring(fnIdx, fnIdx+800);
      const borderIdx = chunk.indexOf('border:1px');
      if(borderIdx > -1) {
        const sample = chunk.substring(borderIdx, borderIdx+200);
        console.log('Actual text around border:', JSON.stringify(sample));
      }
    }
  }
}

// 2. Upgrade Known For card — gold treatment
const oldKF = "background:var(--card);border:1px solid var(--border);border-radius:12px\">';\n      h+='<div style=\"font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px\">Known For</div>';";
if(h.includes(oldKF)){
  h = h.replace(oldKF, "background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)\">';\n      h+='<div style=\"font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px\">Known For</div>';");
  console.log('2. Upgraded Known For card');
} else {
  console.log('2. Known For pattern not found');
}

// 3. Upgrade Must Visit card — gold treatment
const oldMV = "background:var(--card);border:1px solid var(--border);border-radius:12px\">';\n      h+='<div style=\"font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px\">Must Visit</div>';";
if(h.includes(oldMV)){
  h = h.replace(oldMV, "background:linear-gradient(145deg,var(--card2),var(--card));border:2px solid var(--gold);border-radius:12px;box-shadow:0 0 8px rgba(200,169,110,.2)\">';\n      h+='<div style=\"font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.25em;font-weight:700;margin-bottom:8px\">Must Visit</div>';");
  console.log('3. Upgraded Must Visit card');
} else {
  console.log('3. Must Visit pattern not found');
}

// 4. Improve readability - change gray text3 to text2 in venue description line
// The cuisine/price line uses color:var(--text3) which is hard to read
// Change to var(--text2) for better contrast
const oldDesc = "font-size:10px;color:var(--text3);margin-top:2px\">'+(r.cuisine||'')";
const fnStart = h.indexOf('// Venue tile helper (same as nightlife)');
const descIdx = h.indexOf(oldDesc, fnStart);
if(descIdx > -1 && descIdx < fnStart + 800){
  h = h.substring(0, descIdx) + "font-size:10px;color:var(--text2);margin-top:2px\">'+(r.cuisine||'')" + h.substring(descIdx + oldDesc.length);
  console.log('4. Improved tile text readability (text3 -> text2)');
} else {
  console.log('4. Text readability pattern not found at', descIdx);
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('\nDone');
