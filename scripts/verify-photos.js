const fs = require('fs');
const c = fs.readFileSync('C:/Users/jakeo/OneDrive/Appetyt-temp/index.html', 'utf8');
const names = ['Archipelago','Musang',"Dick's Drive-In",'Tivoli','Mashiko','Poquitos','Feast','Range','Galleria','Multiple Locations','Pieous','FRNDS','The Chandelier','Bleau Bar'];
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
for (const n of names) {
  const re = new RegExp('"name":"' + esc(n) + '"', 'g');
  let m, first = true;
  while ((m = re.exec(c)) !== null) {
    const w = c.substring(m.index, m.index + 4000);
    const pu = w.match(/"photoUrl":"([^"]*)"/);
    if (first) {
      console.log(n, '=>', pu ? pu[1].substring(0, 110) : 'NONE');
      first = false;
    }
  }
}
