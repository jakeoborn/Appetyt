const fs=require('fs');
const file=require('path').join(__dirname,'..','index.html');
let html=fs.readFileSync(file,'utf8');
const s=html.indexOf('const SEATTLE_DATA');
const a=html.indexOf('[',s);
let d=0,e=a;
for(let i=a;i<html.length;i++){if(html[i]==='[')d++;if(html[i]===']')d--;if(d===0){e=i+1;break}}
const arr=JSON.parse(html.slice(a,e));
const existing=new Set(arr.map(r=>r.name.toLowerCase()));
let nextId=Math.max(...arr.map(r=>r.id||0))+1;
const five=[
  {name:"Quality Athletics",cuisine:"American Pub",neighborhood:"Pioneer Square",score:82,price:2,tags:["Pub","Sports","Brunch","Pioneer Square"],description:"Pioneer Square sports-bar-meets-pub with an elevated menu, craft cocktails, and Sunday brunch. Perfect for Seahawks tailgates.",dishes:["Burger","Wings","Brunch","Craft Cocktails"],address:"121 S King St, Seattle, WA 98104",phone:"(206) 420-3586",lat:47.6002,lng:-122.3318,instagram:"qualityathletics",website:"https://qualityathletics.com"},
  {name:"Frankie & Jo's",cuisine:"Vegan Ice Cream",neighborhood:"Capitol Hill",score:87,price:1,tags:["Vegan","Ice Cream","Plant-Based","Critics Pick"],description:"Capitol Hill plant-based ice cream shop with creative flavors — chocolate date, salty caramel ash, gingered golden milk. Cult following for vegan and omnivore alike.",dishes:["Chocolate Date","Salty Caramel","Golden Milk","Oat Milk Base"],address:"1010 E Union St, Seattle, WA 98122",phone:"(206) 257-4535",lat:47.6145,lng:-122.3218,instagram:"frankieandjos",website:"https://frankieandjos.com"},
  {name:"Honeyhole Sandwiches",cuisine:"Sandwiches",neighborhood:"Capitol Hill",score:83,price:1,tags:["Sandwiches","Late Night","Local Favorites"],description:"Capitol Hill sandwich shop since 1998. The Gooey Louie (Philly-style cheesesteak) and Buddha Hole are cult favorites. Open late.",dishes:["Gooey Louie","Buddha Hole","Texas Toast","Sandwiches"],address:"703 E Pike St, Seattle, WA 98122",phone:"(206) 709-1399",lat:47.6143,lng:-122.3240,instagram:"honeyholesandwich",website:"https://honeyhole.com"},
  {name:"The Pie Bar",cuisine:"Pizza / Pie",neighborhood:"Capitol Hill",score:82,price:1,tags:["Pizza","Pie","Late Night"],description:"Capitol Hill pizza-and-pie bar. Savory pies by the slice, sweet pies in jars, and a cocktail menu. Open late for after-show cravings.",dishes:["Savory Pie","Sweet Pie Jars","Pizza","Cocktails"],address:"1361 E Olive Way, Seattle, WA 98122",phone:"",lat:47.6178,lng:-122.3195,instagram:"thepiebarseattle",website:""},
  {name:"Aerlume",cuisine:"Pacific Northwest",neighborhood:"Downtown Waterfront",score:86,price:4,tags:["PNW","Views","Date Night","Fine Dining"],description:"Waterfront Seattle PNW fine-dining with floor-to-ceiling Elliott Bay views. Seasonal menu, seafood focus, and a polished room perfect for special occasions.",dishes:["Fresh Catch","Seasonal Menu","Wine Pairings","Water Views"],address:"2040 Western Ave, Seattle, WA 98121",phone:"(206) 441-0969",lat:47.6128,lng:-122.3445,instagram:"aerlume",website:"https://aerlume.com",reservation:"OpenTable"},
];
let added=0;
five.forEach(sp=>{
  if(existing.has(sp.name.toLowerCase())){console.log('SKIP:',sp.name);return}
  arr.push({id:nextId++,name:sp.name,phone:sp.phone||'',cuisine:sp.cuisine,neighborhood:sp.neighborhood,score:sp.score,price:sp.price||0,tags:sp.tags,indicators:[],hh:'',reservation:sp.reservation||'walk-in',awards:'',description:sp.description,dishes:sp.dishes||[],address:sp.address,hours:'',lat:sp.lat,lng:sp.lng,bestOf:[],busyness:null,waitTime:null,popularTimes:null,lastUpdated:null,trending:false,group:'',instagram:sp.instagram||'',website:sp.website||'',suburb:false,reserveUrl:'',menuUrl:'',res_tier:3});
  existing.add(sp.name.toLowerCase());added++;console.log('ADDED:',sp.name);
});
html=html.slice(0,a)+JSON.stringify(arr)+html.slice(e);
fs.writeFileSync(file,html);
console.log('Seattle count:',arr.length);
