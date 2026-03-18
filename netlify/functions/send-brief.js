exports.handler = async (event) => {
  const h = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
  if(event.httpMethod==='OPTIONS') return {statusCode:200,headers:h,body:''};
  let body={};
  try{body=event.body?JSON.parse(event.body):{};}catch(e){}

  // ── SUBSCRIBE ──────────────────────────────────────────────────
  if(body.subscribe){
    try{
      const res=await fetch(process.env.SUPABASE_URL+'/rest/v1/briefing_subscribers',{
        method:'POST',
        headers:{'apikey':process.env.SUPABASE_SERVICE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'},
        body:JSON.stringify({email:body.email,name:body.name||null,active:true,updated_at:new Date().toISOString()})
      });
      if(!res.ok){const t=await res.text();return{statusCode:500,headers:h,body:JSON.stringify({error:t})};}
      return{statusCode:200,headers:h,body:JSON.stringify({subscribed:true,email:body.email})};
    }catch(err){return{statusCode:500,headers:h,body:JSON.stringify({error:err.message})};}
  }

  // ── SEND BRIEF ─────────────────────────────────────────────────
  const PORTS={
    '2026-03-21':{name:'San Juan',country:'Puerto Rico',arrive:'6:30 AM',depart:'8:00 PM',hours:13.5,picks:['La Factoria cocktail bar','El Morro Fort','Old San Juan walking tour','Ocean Park Beach']},
    '2026-03-22':{name:'Tortola',country:'British Virgin Islands',arrive:'8:00 AM',depart:'5:00 PM',hours:9,picks:["Jost Van Dyke sail to Foxy's","The Indians snorkel","Cane Garden Bay","Myett's Garden Grille"]},
    '2026-03-23':{name:'At Sea',country:'Caribbean Sea',arrive:'',depart:'',hours:null,picks:['Redemption Spa','Rooftop pool','Specialty dining at The Wake','Evening show at The Manor']},
    '2026-03-24':{name:'Bridgetown',country:'Barbados',arrive:'8:00 AM',depart:'8:00 PM',hours:12,picks:["Mount Gay Rum Tour (1703)",'Carlisle Bay snorkel','Harbour Lights Beach Club','Barbados Wildlife Reserve']},
    '2026-03-25':{name:'Castries',country:'St. Lucia',arrive:'8:00 AM',depart:'6:00 PM',hours:10,picks:['Sulphur Springs drive-in volcano','Diamond Falls Botanical Garden','Piton Sail and Snorkel','Coal Pot Restaurant']},
    '2026-03-26':{name:"St. John's",country:'Antigua',arrive:'9:00 AM',depart:'8:00 PM',hours:11,picks:["Sheer Rocks cliffside dining","Nelson's Dockyard UNESCO","Dickenson Bay beach",'Cades Reef snorkel']},
    '2026-03-27':{name:'Philipsburg',country:'St. Maarten',arrive:'8:00 AM',depart:'5:00 PM',hours:9,picks:['Maho Beach plane watching','Orient Bay Beach Club','Grand Case gourmet village','Pinel Island day trip']},
    '2026-03-28':{name:'San Juan',country:'Puerto Rico - Debark',arrive:'6:30 AM',depart:'Debark',hours:null,picks:['Kasalta Bakery mallorcas (opens 6AM)','Old San Juan shopping','Allow 90 min to SJU airport','Pre-book Uber']},
  };

  const dateStr=body.testDate||new Date().toISOString().split('T')[0];
  const port=PORTS[dateStr];
  if(!port) return{statusCode:200,headers:h,body:JSON.stringify({message:'Outside cruise window',date:dateStr})};

  const dayNum=Math.floor((new Date(dateStr+'T12:00:00Z')-new Date('2026-03-21T00:00:00Z'))/86400000)+1;
  const isAtSea=port.name==='At Sea';
  const isDebark=port.depart==='Debark';

  let subs;
  if(body.testEmail){subs=[{email:body.testEmail,name:'Jacob'}];}
  else{
    const r=await fetch(process.env.SUPABASE_URL+'/rest/v1/briefing_subscribers?active=eq.true&select=email,name',{
      headers:{'apikey':process.env.SUPABASE_SERVICE_KEY,'Authorization':'Bearer '+process.env.SUPABASE_SERVICE_KEY}
    });
    subs=await r.json();
  }

  if(!subs.length) return{statusCode:200,headers:h,body:JSON.stringify({message:'No subscribers'})};

  const results=[];
  for(const sub of subs){
    try{
      const name=sub.name?sub.name.split(' ')[0]:'there';
      const prompt=isAtSea
        ?'Write a warm morning message (under 100 words) for '+name+' on sea day '+dayNum+' aboard Valiant Lady, Virgin Voyages Caribbean cruise. Suggest how to enjoy it. Conversational, no bullet points.'
        :isDebark
        ?'Write a warm farewell message (under 100 words) for '+name+' debark day in San Juan. Mention Kasalta Bakery and allow 90 min to SJU airport. Warm send-off. No bullet points.'
        :'Write a morning port briefing (under 150 words) for '+name+' arriving in '+port.name+', '+port.country+' - Day '+dayNum+' on Valiant Lady. '+port.arrive+' to '+port.depart+', '+port.hours+' hours ashore. Top picks: '+port.picks.join(', ')+'. Warm opening, one unmissable tip, day flow, practical reminder. Conversational prose, no lists.';

      const ai=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:280,system:"You are Appetyt's luxury travel concierge for a Virgin Voyages cruise. Warm, elegant, specific prose. No markdown, no lists.",messages:[{role:'user',content:prompt}]})
      });
      if(!ai.ok) throw new Error('AI '+ai.status);
      const briefing=(await ai.json()).content?.[0]?.text||'Wishing you a wonderful day!';

      const subject=isDebark?'Safe Travels Home - Final Morning':isAtSea?'Good Morning - A Day at Sea':'Good Morning - '+port.name;
      const html='<html><body style="font-family:sans-serif;background:#090c12;padding:20px;max-width:480px;margin:0 auto"><div style="background:#11151f;border-radius:16px;overflow:hidden"><div style="background:linear-gradient(135deg,#1a0808,#0a0515);padding:22px"><div style="font-size:10px;letter-spacing:.12em;color:rgba(200,169,110,.6);margin-bottom:5px">APPETYT TRAVEL</div><div style="font-size:22px;font-weight:600;font-style:italic;color:#fff">Day '+dayNum+' - '+port.name+'</div><div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:2px">'+port.country+' - Valiant Lady</div>'
        +(!isAtSea&&!isDebark?'<div style="display:flex;gap:8px;margin-top:12px"><div style="flex:1;background:rgba(62,184,168,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#3eb8a8;margin-bottom:2px">ARRIVE</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.arrive+'</div></div><div style="flex:1;background:rgba(212,117,106,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#d4756a;margin-bottom:2px">DEPART</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.depart+'</div></div><div style="flex:1;background:rgba(200,169,110,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#c8a96e;margin-bottom:2px">ASHORE</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.hours+'h</div></div></div>':'')
        +'</div><div style="padding:18px"><div style="font-size:14px;line-height:1.8;color:#9a8e72;margin-bottom:16px">'+briefing+'</div><a href="https://appetyt.app" style="display:block;background:linear-gradient(135deg,#e2c98a,#9a6e28);color:#0a0600;text-align:center;padding:11px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px">Open Port Guide in Appetyt</a></div></div></body></html>';

      const email=await fetch('https://api.resend.com/emails',{
        method:'POST',
        headers:{'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({from:'Appetyt Travel <travel@appetyt.app>',to:[sub.email],subject,html})
      });
      if(!email.ok) throw new Error('Resend '+(await email.text()).slice(0,80));
      results.push({email:sub.email,status:'sent'});
    }catch(err){results.push({email:sub.email,status:'failed',error:err.message});}
  }

  return{statusCode:200,headers:h,body:JSON.stringify({success:true,port:port.name,day:dayNum,results})};
};