const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');

// Parse Vegas-specific blocks I recently added
function testBlock(name, startMarker, endMarker){
  const s=h.indexOf(startMarker);
  if(s<0){ console.log(name+': marker not found'); return; }
  const e=h.indexOf(endMarker,s);
  if(e<0){ console.log(name+': end marker not found'); return; }
  const block=h.substring(s,e);
  // Try to eval as a statement
  try {
    // Wrap as object property assignment
    new Function('var x='+block.replace(/^[^{\[]*/,'')+';');
    console.log(name+': OK');
  } catch(err){
    console.log(name+': SYNTAX ERROR -',err.message.substring(0,200));
    // Show context
    const m=err.message.match(/position\s+(\d+)/);
    if(m){
      const pos=parseInt(m[1]);
      console.log('  Context at pos '+pos+':',JSON.stringify(block.substring(Math.max(0,pos-100),pos+100)));
    }
  }
}

// Test full index.html script extracted as one JS parse
// Get the main bundle script (the big one)
const scripts=[...h.matchAll(/<script(?:[^>]*?)>([\s\S]*?)<\/script>/g)];
scripts.forEach((m,i)=>{
  const tag=m[0].match(/<script[^>]*>/)[0];
  if(tag.includes('src=')) return;
  const body=m[1];
  if(body.length<100) return;
  try {
    new Function(body);
    console.log('Script #'+i+' ('+body.length+' chars): OK');
  } catch(err){
    console.log('Script #'+i+' ('+body.length+' chars): ERROR');
    console.log('  Message:',err.message);
    // Try to find line number
    const posMatch=err.message.match(/at\s+.*?:(\d+)/);
    if(posMatch){
      const ln=parseInt(posMatch[1]);
      const lines=body.split('\n');
      console.log('  Line '+ln+' context:');
      for(let j=Math.max(0,ln-2);j<Math.min(lines.length,ln+3);j++){
        console.log('    '+(j+1)+':',lines[j].substring(0,200));
      }
    }
  }
});
