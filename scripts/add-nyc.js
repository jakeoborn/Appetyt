// Add 25 new NYC restaurants from researched JSON
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");
const match = html.match(/const NYC_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);

const newData = JSON.parse(fs.readFileSync("scripts/nyc-new-restaurants.json", "utf8"));

// Add missing base fields to each entry
const base = {phone:"",bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:"",suburb:false,reserveUrl:"",menuUrl:""};
newData.forEach(r => {
  Object.keys(base).forEach(k => { if (!(k in r)) r[k] = base[k]; });
});

data.push(...newData);

// Deduplicate by name
const seen = new Set();
const deduped = [];
for (let i = data.length - 1; i >= 0; i--) {
  if (seen.has(data[i].name)) continue;
  seen.add(data[i].name);
  deduped.unshift(data[i]);
}

console.log("NYC: " + deduped.length + " restaurants (was " + (deduped.length - newData.length) + ", added " + newData.length + ")");

const serialized = JSON.stringify(deduped);
html = html.replace(match[0], "const NYC_DATA=" + serialized + ";");
fs.writeFileSync("index.html", html);
console.log("Done!");
