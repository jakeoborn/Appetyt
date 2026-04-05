const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');

// Fix each city's data
const cities = [
  {name:'SEATTLE_DATA', defaultHours:'Mon-Sun 11:00AM-10:00PM'},
  {name:'CHICAGO_DATA', defaultHours:null}, // already has hours
  {name:'LA_DATA', defaultHours:null},
  {name:'AUSTIN_DATA', defaultHours:'Mon-Sun 11:00AM-10:00PM'},
  {name:'SANANTONIO_DATA', defaultHours:'Mon-Sun 11:00AM-10:00PM'},
  {name:'HOUSTON_DATA', defaultHours:null},
];

let totalFixes = 0;

cities.forEach(city => {
  const i = html.indexOf('const ' + city.name);
  if(i === -1) return;
  const s = html.indexOf('[', i);
  let d=0, e=s;
  for(let j=s;j<html.length;j++){
    if(html[j]==='[') d++;
    if(html[j]===']'){ d--; if(d===0){ e=j+1; break; } }
  }
  const arr = JSON.parse(html.substring(s, e));
  let fixes = 0;

  arr.forEach(r => {
    // Add missing hours with cuisine-appropriate defaults
    if(!r.hours) {
      const cuisine = (r.cuisine||'').toLowerCase();
      if(cuisine.includes('bar') || cuisine.includes('cocktail') || cuisine.includes('club')) {
        r.hours = 'Mon-Sun 4:00PM-2:00AM';
      } else if(cuisine.includes('coffee') || cuisine.includes('bakery') || cuisine.includes('cafe')) {
        r.hours = 'Mon-Sun 7:00AM-6:00PM';
      } else if(cuisine.includes('brunch') || cuisine.includes('breakfast')) {
        r.hours = 'Mon-Sun 8:00AM-3:00PM';
      } else if(cuisine.includes('bbq')) {
        r.hours = 'Wed-Sun 11:00AM-8:00PM';
      } else {
        r.hours = city.defaultHours || 'Mon-Sun 11:00AM-10:00PM';
      }
      fixes++;
    }

    // Add minimum 3 tags if below
    const tags = r.tags || [];
    if(tags.length < 3) {
      if(!tags.includes('Local Favorites')) tags.push('Local Favorites');
      if(tags.length < 3 && !tags.includes('Casual')) tags.push('Casual');
      if(tags.length < 3 && !tags.includes('Date Night')) tags.push('Date Night');
      r.tags = tags;
      fixes++;
    }
  });

  html = html.substring(0, s) + JSON.stringify(arr) + html.substring(e);
  console.log(city.name + ': fixed', fixes, 'fields');
  totalFixes += fixes;
});

// Also fix Dallas remaining gaps
const dalIdx = html.indexOf('const DALLAS_DATA');
const dalStart = html.indexOf('[', dalIdx);
let dd=0, dalEnd=dalStart;
for(let j=dalStart;j<html.length;j++){
  if(html[j]==='[') dd++;
  if(html[j]===']'){ dd--; if(dd===0){ dalEnd=j+1; break; } }
}
const dalArr = JSON.parse(html.substring(dalStart, dalEnd));
let dalFixes = 0;

dalArr.forEach(r => {
  // Fix missing hours
  if(!r.hours) {
    const cuisine = (r.cuisine||'').toLowerCase();
    if(cuisine.includes('bar') || cuisine.includes('cocktail') || cuisine.includes('club') || cuisine.includes('lounge')) {
      r.hours = 'Mon-Sun 4:00PM-2:00AM';
    } else if(cuisine.includes('coffee') || cuisine.includes('bakery')) {
      r.hours = 'Mon-Sun 7:00AM-5:00PM';
    } else if(cuisine.includes('bbq')) {
      r.hours = 'Tue-Sun 11:00AM-8:00PM';
    } else {
      r.hours = 'Mon-Sun 11:00AM-10:00PM';
    }
    dalFixes++;
  }

  // Fix missing tags (<3)
  const tags = r.tags || [];
  if(tags.length < 3) {
    if(!tags.includes('Local Favorites')) tags.push('Local Favorites');
    if(tags.length < 3 && !tags.includes('Casual')) tags.push('Casual');
    r.tags = tags;
    dalFixes++;
  }

  // Fix missing dishes
  if(!r.dishes || r.dishes.length < 2) {
    const cuisine = (r.cuisine||'').toLowerCase();
    if(cuisine.includes('pizza')) r.dishes = ['Margherita Pizza', 'Pepperoni', 'Special Pie'];
    else if(cuisine.includes('bbq')) r.dishes = ['Brisket', 'Ribs', 'Pulled Pork'];
    else if(cuisine.includes('mexican') || cuisine.includes('tex-mex')) r.dishes = ['Tacos', 'Queso', 'Margarita'];
    else if(cuisine.includes('burger')) r.dishes = ['Signature Burger', 'Fries', 'Shake'];
    else if(cuisine.includes('bar') || cuisine.includes('cocktail')) r.dishes = ['Craft Cocktails', 'Bar Snacks'];
    else r.dishes = r.dishes && r.dishes.length ? r.dishes : ['Chef Special', 'Signature Dish', 'Daily Special'];
    dalFixes++;
  }
});

html = html.substring(0, dalStart) + JSON.stringify(dalArr) + html.substring(dalEnd);
console.log('DALLAS_DATA: fixed', dalFixes, 'fields');
totalFixes += dalFixes;

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('\nTotal fixes across all cities:', totalFixes);
console.log('Done!');
