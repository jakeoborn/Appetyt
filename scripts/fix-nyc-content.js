// Fix: Wrap NYC-only sections (Things to Do, Day Trips, Insider Tips) in city conditional
// so they only show for New York, not Dallas/Chicago/Houston
// Run: node scripts/fix-nyc-content.js

const fs = require('fs');
const file = require('path').join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// Find the NYC-only block in the weekend guides/events page
const marker = '<!-- THINGS TO DO -->';
const markerIdx = html.indexOf(marker, 2700000);
if (markerIdx === -1) {
  console.log('Marker not found');
  process.exit(1);
}

// The template literal for this page closes with `;\r\n  },\r\n
// Find it after the marker
let templateCloseIdx = -1;
for (let i = markerIdx; i < markerIdx + 25000; i++) {
  if (html[i] === '`' && html.substring(i, i + 5).match(/`;\s/)) {
    templateCloseIdx = i;
    break;
  }
}
console.log('Template close at:', templateCloseIdx);

// The structure before the backtick is:
//   ...NYC content...</div>\r\n      </div>\r\n    </div>`;\r\n
// We want to wrap from <!-- THINGS TO DO --> to the </div> right before </div>`
// The last 3 </div>s close: NYC section, page content, page wrapper
// We want to wrap everything EXCEPT the last </div> (page wrapper close)

// Find the position right before the last </div> before the backtick
const beforeBacktick = html.substring(templateCloseIdx - 100, templateCloseIdx);
console.log('Before backtick:', JSON.stringify(beforeBacktick));

// The last </div>\r\n    </div>` pattern: the outer </div> is the page wrapper
// We need to find where the NYC content ends (before the last 2 closing divs)
// Let's find the last </div> chain before the backtick
// Pattern: </div>\r\n      </div>\r\n    </div>`
// The first </div> closes the last NYC section (Insider Tips)
// The second </div> closes the NYC container
// The third </div> closes the page wrapper
// We want to wrap: from marker to end of second </div>

// Actually, the simplest approach: wrap the entire block from marker to
// just before the closing </div>\r\n    </div>`
// by inserting ${ ... } template conditional

// Find the line before the marker to insert the opening conditional
const lineBeforeMarker = html.lastIndexOf('\n', markerIdx) + 1;
const indent = '      ';

// Find where NYC block ends - it's the content before the outermost </div>`
// The pattern is: ...content...</div>\r\n      </div>\r\n    </div>`
// We want to end the conditional after </div>\r\n      </div>
// and leave the final \r\n    </div>` unchanged

// Let's count backwards from the backtick
let pos = templateCloseIdx;
// Skip back past </div>
while (pos > 0 && html[pos - 1] !== '>') pos--;
const lastDivEnd = pos; // end of </div>
// Skip back past whitespace to find the previous </div>
pos = html.lastIndexOf('</div>', lastDivEnd - 7);
const secondLastDivEnd = pos + 6;
// And one more
pos = html.lastIndexOf('</div>', pos - 1);
const thirdLastDivEnd = pos + 6;

console.log('Last div ends at:', lastDivEnd, JSON.stringify(html.substring(lastDivEnd - 10, lastDivEnd)));
console.log('2nd last div at:', secondLastDivEnd, JSON.stringify(html.substring(secondLastDivEnd - 15, secondLastDivEnd)));
console.log('3rd last div at:', thirdLastDivEnd, JSON.stringify(html.substring(thirdLastDivEnd - 15, thirdLastDivEnd)));

// The NYC block should be from markerIdx to secondLastDivEnd
// (The last </div> is the page wrapper)
const nycBlock = html.substring(markerIdx, secondLastDivEnd);
console.log('\nNYC block: starts with', nycBlock.substring(0, 60));
console.log('NYC block: ends with', nycBlock.substring(nycBlock.length - 60));
console.log('NYC block length:', nycBlock.length);

// Replace: wrap in conditional
// We need to use ${...} inside a template literal, so we use the JS expression syntax
const wrapped = "${(S.city||'Dallas')==='New York' ? `" + nycBlock + "` : ''}";
html = html.slice(0, markerIdx) + wrapped + html.slice(secondLastDivEnd);

fs.writeFileSync(file, html, 'utf8');
console.log('\n✅ NYC content wrapped in city conditional - only shows for New York now');
