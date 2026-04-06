const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Remove the orphaned HTML: the ›, </div>, </div> between speakeasy row and gold card
// This is leftover from the old Weekend Guides link card removal
const orphan = `


            <div style="font-size:18px;color:var(--gold)">›</div>
          </div>
        </div>
        `;

const orphanIdx = html.indexOf(orphan);
if(orphanIdx > -1) {
  html = html.substring(0, orphanIdx) + '\n        ' + html.substring(orphanIdx + orphan.length);
  console.log('Removed orphaned HTML at', orphanIdx);
} else {
  // Try with \r\n
  const orphan2 = "\r\n\r\n          \r\n            <div style=\"font-size:18px;color:var(--gold)\">›</div>\r\n          </div>\r\n        </div>\r\n        ";
  const idx2 = html.indexOf(orphan2);
  if(idx2 > -1) {
    html = html.substring(0, idx2) + '\r\n        ' + html.substring(idx2 + orphan2.length);
    console.log('Removed orphaned HTML (CRLF) at', idx2);
  } else {
    // Try finding just the › div
    const arrowDiv = html.indexOf('<div style="font-size:18px;color:var(--gold)">›</div>');
    console.log('Arrow div at:', arrowDiv);
    if(arrowDiv > -1) {
      // Check context
      const before = html.substring(arrowDiv - 100, arrowDiv);
      const after = html.substring(arrowDiv, arrowDiv + 100);
      console.log('Before:', JSON.stringify(before.slice(-50)));
      console.log('After:', JSON.stringify(after.substring(0, 80)));

      // If preceded by empty lines (not part of a gold card), remove it and surrounding </div>s
      if(before.includes("Speakeasy") || before.trim().endsWith("''}")) {
        // Find the orphaned block
        let start = arrowDiv;
        while(start > 0 && html[start-1] !== '}') start--;
        let end = html.indexOf('<!-- Weekend Guides', arrowDiv);
        if(end === -1) end = arrowDiv + 100;
        html = html.substring(0, start) + '\n        ' + html.substring(end);
        console.log('Removed orphaned block');
      }
    }
  }
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');

// Verify
const h2 = fs.readFileSync('index.html','utf8');
const arrowCount = (h2.match(/font-size:18px;color:var\(--gold\)">›/g)||[]).length;
console.log('Arrow › count:', arrowCount, '(should be 1-2 for the gold cards)');

const ni=h2.indexOf('const NYC_DATA');const ns=h2.indexOf('[',ni);let nd=0,ne=ns;
for(let j=ns;j<h2.length;j++){if(h2[j]==='[')nd++;if(h2[j]===']'){nd--;if(nd===0){ne=j+1;break;}}}
try{const a=JSON.parse(h2.substring(ns,ne));console.log('NYC:',a.length);}catch(e){console.log('NYC ERR');}
console.log('Done');
