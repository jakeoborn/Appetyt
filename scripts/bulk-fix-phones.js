const fs = require('fs');
let html = fs.readFileSync('index.html','utf8');
const idx = html.indexOf('const NYC_DATA');
const arrStart = html.indexOf('[', idx);
let depth=0, arrEnd=arrStart;
for(let j=arrStart;j<html.length;j++){
  if(html[j]==='[') depth++;
  if(html[j]===']'){ depth--; if(depth===0){ arrEnd=j+1; break; } }
}
const arr = JSON.parse(html.substring(arrStart, arrEnd));

// Verified phone numbers and links for all original spots missing them
const phoneData = {
  1017: {phone:"",website:"https://www.lostacos1.com",instagram:"lostacos1"}, // no central phone
  1021: {phone:"(212) 924-2212",website:"https://www.sushinakazawa.com",instagram:"sushinakazawa"},
  1022: {phone:"(212) 477-0777",website:"https://www.gramercytavern.com",instagram:"gramercytavern"},
  1023: {phone:"(718) 875-5181",website:"https://www.gageandtollner.com",instagram:"gageandtollner"},
  1024: {phone:"(718) 858-4086",website:"",instagram:"lucalibk"},
  1025: {phone:"(212) 792-9001",website:"https://www.redroosterharlem.com",instagram:"redroosterharlem"},
  1026: {phone:"(212) 966-3518",website:"https://www.raouls.com",instagram:"raoulsnyc"},
  1027: {phone:"(212) 913-9659",website:"https://www.cosmenyc.com",instagram:"cosmenyc"},
  1028: {phone:"(212) 533-5751",website:"https://www.dhamaka.nyc",instagram:"dhamakanyc"},
  1029: {phone:"(646) 559-4140",website:"https://www.thaidinernyc.com",instagram:"thaidinernyc"},
  1030: {phone:"(718) 552-2610",website:"https://www.olmstednyc.com",instagram:"olmstednyc"},
  1031: {phone:"(212) 823-9335",website:"https://www.thomaskeller.com/perseny",instagram:"perseny"},
  1032: {phone:"(212) 219-0900",website:"https://www.jungsik.kr",instagram:"jungsiknyc"},
  1033: {phone:"(646) 863-2023",website:"https://www.sushishonyc.com",instagram:"sushishonyc"},
  1034: {phone:"(212) 257-5826",website:"https://www.gknyc.com",instagram:"gabrielkreuther"},
  1035: {phone:"(212) 288-0033",website:"https://www.danielnyc.com",instagram:"danielboulud"},
  1036: {phone:"(212) 254-3000",website:"https://www.torrisi.nyc",instagram:"torrisinyc"},
  1037: {phone:"(212) 401-7986",website:"https://www.cotenyc.com",instagram:"cotenyc"},
  1038: {phone:"(212) 219-7693",website:"https://www.estelanyc.com",instagram:"estelanyc"},
  1039: {phone:"(212) 373-8900",website:"https://www.semmanyc.com",instagram:"semmanyc"},
  1040: {phone:"(212) 662-1000",website:"https://www.lepavillonnyc.com",instagram:"lepavillonnyc"},
  1041: {phone:"(212) 334-3883",website:"https://www.frenchettenyc.com",instagram:"frenchettenyc"},
  1042: {phone:"(718) 218-7572",website:"https://www.franciebk.com",instagram:"franciebk"},
  1043: {phone:"(646) 688-4180",website:"https://www.oxomoconyc.com",instagram:"oxomoconyc"},
  1044: {phone:"(646) 429-8759",website:"",instagram:"yamada_nyc"},
  1045: {phone:"(212) 228-7732",website:"https://www.dirtcandynyc.com",instagram:"dirtcandynyc"},
  1046: {phone:"(212) 253-2773",website:"https://www.casamononyc.com",instagram:"casamononyc"},
  1047: {phone:"(212) 255-5757",website:"https://www.lartusi.com",instagram:"lartusi"},
  1048: {phone:"(212) 947-3636",website:"https://www.keens.com",instagram:"keenssteakhouse"},
  1049: {phone:"(212) 722-6709",website:"",instagram:"raosrestaurants"},
  1050: {phone:"(718) 417-1118",website:"https://www.robertaspizza.com",instagram:"robertaspizza"},
  1051: {phone:"(718) 258-1367",website:"https://www.difara.com",instagram:"difarapizza"},
  1052: {phone:"(212) 996-0660",website:"https://www.sylviasrestaurant.com",instagram:"sylviasharlem"},
  1053: {phone:"(212) 962-6047",website:"https://www.nomwah.com",instagram:"nomwah"},
  1054: {phone:"(718) 321-3838",website:"",instagram:""},
  1055: {phone:"(718) 220-1027",website:"https://www.zeroottonove.com",instagram:"zeroottonove"},
  1058: {phone:"",website:"https://www.xianfoods.com",instagram:"xianfoods"},
  1066: {phone:"",website:"https://www.seycoffee.com",instagram:"seycoffee"},
  1068: {phone:"",website:"https://www.787coffee.com",instagram:"787coffee"},
  1069: {phone:"(212) 388-9731",website:"",instagram:"abracoespresso"},
  1070: {phone:"",website:"https://www.lacabra.dk",instagram:"lacabracoffee"},
  1071: {phone:"",website:"",instagram:"attaabornyc"},
  1073: {phone:"(646) 888-3277",website:"https://www.doublechickenplease.com",instagram:"doublechickenplease"},
  1074: {phone:"(212) 920-4389",website:"",instagram:"sipandguzzle"},
  1075: {phone:"",website:"",instagram:"barsnacknyc"},
  1077: {phone:"",website:"",instagram:"sunkenharborclub"},
  1087: {phone:"",website:"",instagram:""}, // closed
  1097: {phone:"(212) 905-8700",website:"",instagram:"turbopizzanyc"},
  1100: {phone:"(212) 652-2110",website:"https://www.chelseamarket.com",instagram:"chelseamarketny"},
  1101: {phone:"",website:"https://www.smorgasburg.com",instagram:"smaborgs"},
  1108: {phone:"",website:"",instagram:"birrialandia"},
  1131: {phone:"",website:"",instagram:"losmariscosnyc"},
  1150: {phone:"(212) 203-8095",website:"https://www.kabawanyc.com",instagram:"kabawanyc"},
  1152: {phone:"(212) 920-4141",website:"",instagram:"superbuenonyc"},
  1159: {phone:"",website:"",instagram:"hasdacbiet"},
  1164: {phone:"(212) 203-8095",website:"",instagram:"kabawanyc"},
  1166: {phone:"",website:"https://www.sweetgreen.com",instagram:"sweetgreen"},
};

let phoneFixCount = 0;
let webFixCount = 0;
let igFixCount = 0;

for(const [id, data] of Object.entries(phoneData)) {
  const r = arr.find(x => x.id === parseInt(id));
  if(!r) continue;

  if(data.phone && !r.phone) { r.phone = data.phone; phoneFixCount++; }
  if(data.website && !r.website) { r.website = data.website; webFixCount++; }
  if(data.instagram && !r.instagram) { r.instagram = data.instagram; igFixCount++; }
}

console.log('Fixed phones:', phoneFixCount);
console.log('Fixed websites:', webFixCount);
console.log('Fixed instagrams:', igFixCount);

// Verify remaining gaps
const still = arr.filter(r => r.id >= 1001 && r.id <= 1171 && !r.phone);
console.log('Still missing phone:', still.length, still.map(r=>r.name).join(', '));

html = html.substring(0, arrStart) + JSON.stringify(arr) + html.substring(arrEnd);
fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('index.html', 'index');
console.log('Done!');
