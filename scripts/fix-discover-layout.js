const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// 1. Remove the NYC top-right Guides button
// Find: ${hasActivities?`<div onclick=... Guides... & Weekends...</div>`:''}
const guidesBtnStart = html.indexOf('${hasActivities?`<div onclick="A.openActivitiesPage()" style="padding:8px');
if(guidesBtnStart > -1) {
  const guidesBtnEnd = html.indexOf("`:''}", guidesBtnStart);
  if(guidesBtnEnd > -1) {
    // Replace the whole conditional with empty
    html = html.substring(0, guidesBtnStart) + html.substring(guidesBtnEnd + 5);
    console.log('Removed top-right Guides button');
  }
}

// 2. Simplify the header back to non-flex layout since button is removed
html = html.replace(
  '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">',
  '<div style="margin-bottom:16px">'
);
// Remove the extra closing </div> that was for the flex container
// Actually the flex div closing is naturally handled — let's verify the structure works

// 3. Add the big gold card for NYC after the activities section (before Best Of)
// Find the end of the NYC activities section
const nycActEnd = html.indexOf("<!-- ACTIVITIES & GUIDES — compact link for non-NYC -->");
if(nycActEnd === -1) {
  const altEnd = html.indexOf("<!-- ACTIVITIES & GUIDES — gold card link -->");
  console.log('Alt marker found at:', altEnd);
}

// Actually the simplest fix: make the Dallas-style gold card show for BOTH cities
// Remove the hasActivities conditional around it
// Current: ${hasActivities ? `...NYC rows...` : `...Dallas gold card...`}
// Want: ${hasActivities ? `...NYC rows... + gold card` : `...gold card`}

// Find the gold card HTML
const goldCardStart = html.indexOf('onclick="A.openActivitiesPage()" style="background:linear-gradient');
if(goldCardStart > -1) {
  console.log('Gold card found at:', goldCardStart);
  // This card currently only shows for non-NYC cities
  // We need to ALSO show it for NYC after the activities rows

  // Find the end of the NYC activities section (before the else for non-NYC)
  const nycElse = html.lastIndexOf("` : `", goldCardStart);
  if(nycElse > -1) {
    // Insert the gold card HTML right before the ` : ` else
    const goldCardHTML = html.substring(
      html.lastIndexOf('<div class="discover-section"', goldCardStart),
      html.indexOf('</div>\n        `}', goldCardStart) + 6
    );
    console.log('Gold card HTML length:', goldCardHTML.length);

    // Insert a copy of the gold card at the end of the NYC section
    html = html.substring(0, nycElse) + '\n        ' + goldCardHTML + '\n        ' + html.substring(nycElse);
    console.log('Added gold card to NYC section');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done');
