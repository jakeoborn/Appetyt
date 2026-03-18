// Appetyt Morning Brief — Netlify Function
// Handles: POST subscribe, POST test brief, scheduled daily briefing

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return {statusCode:200,headers,body:''};

  try {
    let body = {};
    if (event.body) {
      try { body = JSON.parse(event.body); } catch(e) {}
    }

    // ── SUBSCRIBE ────────────────────────────────────────────────
    if (body.subscribe) {
      const { email, name } = body;
      if (!email) return {statusCode:400,headers,body:JSON.stringify({error:'Email required'})};

      const res = await fetch(process.env.SUPABASE_URL+'/rest/v1/briefing_subscribers', {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({email, name: name||null, active:true, updated_at: new Date().toISOString()})
      });

      if (!res.ok) {
        const err = await res.text();
        return {statusCode:500,headers,body:JSON.stringify({error:'DB error: '+err.slice(0,100)})};
      }
      return {statusCode:200,headers,body:JSON.stringify({subscribed:true, email})};
    }

    // ── SEND BRIEF ───────────────────────────────────────────────
    const PORTS = {
      '2026-03-21':{name:'San Juan',country:'Puerto Rico',flag:'PR',arrive:'6:30 AM',depart:'8:00 PM',hours:13.5,highlights:['La Factoria cocktail bar - James Beard winner','El Morro Fort - 16th-century Spanish fortress','Old San Juan walking tour - free','Ocean Park Beach - calm waters']},
      '2026-03-22':{name:'Tortola',country:'British Virgin Islands',flag:'BVI',arrive:'8:00 AM',depart:'5:00 PM',hours:9,highlights:["Jost Van Dyke day sail to Foxy's Beach Bar","The Indians snorkel - best reef in BVI","Cane Garden Bay swimming and rum cocktails","Myett's Garden Grille beachfront lunch"]},
      '2026-03-23':{name:'At Sea',country:'Caribbean Sea',flag:'SEA',arrive:'',depart:'',hours:null,highlights:["The Redemption Spa - book ahead","Richard's Rooftop adults-only pool","Specialty dining at The Wake","Evening entertainment at The Manor"]},
      '2026-03-24':{name:'Bridgetown',country:'Barbados',flag:'BB',arrive:'8:00 AM',depart:'8:00 PM',hours:12,highlights:["Mount Gay Rum Tour - world's oldest distillery (1703)",'Carlisle Bay snorkel - sunken ships 5 min from port','Harbour Lights Beach Club - rum punch and live music','Barbados Wildlife Reserve - free-roaming green monkeys']},
      '2026-03-25':{name:'Castries',country:'St. Lucia',flag:'SLU',arrive:'8:00 AM',depart:'6:00 PM',hours:10,highlights:["Sulphur Springs - world's only drive-in volcano","Diamond Falls Botanical Garden and mineral baths",'Piton Sail and Snorkel full-day tour','Coal Pot Restaurant - waterfront Creole since 1966']},
      '2026-03-26':{name:"St. John's",country:'Antigua',flag:'AG',arrive:'9:00 AM',depart:'8:00 PM',hours:11,highlights:["Sheer Rocks cliffside dining above the Caribbean","Nelson's Dockyard - UNESCO Heritage site","Dickenson Bay - best white sand beach on the island",'Cades Reef snorkel - turtles and barracuda']},
      '2026-03-27':{name:'Philipsburg',country:'St. Maarten',flag:'SXM',arrive:'8:00 AM',depart:'5:00 PM',hours:9,highlights:['Maho Beach - planes land 50ft overhead','Orient Bay Beach Club - French Riviera vibes','Grand Case village - gourmet capital of the Caribbean','Pinel Island ferry - tiny paradise 2 min away']},
      '2026-03-28':{name:'San Juan',country:'Puerto Rico - Debark',flag:'PR2',arrive:'6:30 AM',depart:'Debark',hours:null,highlights:['Kasalta Bakery - mallorcas and cafe con leche (opens 6AM)','Last-minute Old San Juan shopping','Allow 90 minutes minimum to SJU airport','Pre-book Uber - very busy post-debark mornings']},
    };

    const dateStr = body.testDate || new Date().toISOString().split('T')[0];
    const port = PORTS[dateStr];
    if (!port) return {statusCode:200,headers,body:JSON.stringify({message:'No port today',date:dateStr})};

    const dayStart = new Date('2026-03-21T00:00:00Z');
    const dayNum = Math.floor((new Date(dateStr+'T12:00:00Z') - dayStart) / 86400000) + 1;

    // Get subscribers
    let subscribers;
    if (body.testEmail) {
      subscribers = [{email:body.testEmail, name:'Jacob'}];
    } else {
      const sbRes = await fetch(process.env.SUPABASE_URL+'/rest/v1/briefing_subscribers?active=eq.true&select=email,name', {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_KEY
        }
      });
      if (!sbRes.ok) throw new Error('Supabase: '+await sbRes.text());
      subscribers = await sbRes.json();
    }

    if (!subscribers.length) return {statusCode:200,headers,body:JSON.stringify({message:'No subscribers'})};

    const results = [];
    for (const sub of subscribers) {
      try {
        const firstName = sub.name ? sub.name.split(' ')[0] : 'there';
        const isAtSea = port.name === 'At Sea';
        const isDebark = port.depart === 'Debark';

        let prompt;
        if (isAtSea) {
          prompt = 'Write a warm morning message (under 100 words) for '+firstName+' on a sea day (Day '+dayNum+') aboard Valiant Lady by Virgin Voyages. Suggest how to enjoy it. Warm, personal, no bullet points.';
        } else if (isDebark) {
          prompt = 'Write a warm farewell message (under 100 words) for '+firstName+' - debark day in San Juan. Mention Kasalta Bakery breakfast and allow 90 min to SJU airport. Warm send-off. No bullet points.';
        } else {
          prompt = 'Write a morning port briefing (under 150 words) for '+firstName+' arriving in '+port.name+', '+port.country+' - Day '+dayNum+' on Valiant Lady by Virgin Voyages. Arriving '+port.arrive+', departing '+port.depart+', '+port.hours+' hours ashore. Top picks: '+port.highlights.join(', ')+'. Warm opening, one unmissable priority with a tip, suggested flow, one practical reminder. No bullet points, conversational prose.';
        }

        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST',
          headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
          body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:300,
            system:"You are Appetyt's luxury travel concierge for a Virgin Voyages Caribbean cruise. Write warm, elegant, specific morning briefings. Conversational prose only - no markdown, no lists.",
            messages:[{role:'user',content:prompt}]})
        });
        if (!aiRes.ok) throw new Error('AI error '+aiRes.status);
        const aiData = await aiRes.json();
        const briefing = aiData.content?.[0]?.text || 'Wishing you a wonderful day!';

        const subject = isDebark ? 'Safe Travels Home - Final Morning'
          : isAtSea ? 'Good Morning - A Day at Sea'
          : 'Good Morning - ' + port.name + ', ' + port.country;

        const html = '<html><body style="font-family:-apple-system,sans-serif;background:#090c12;padding:20px;max-width:480px;margin:0 auto">'
          +'<div style="background:#11151f;border-radius:16px;overflow:hidden">'
          +'<div style="background:linear-gradient(135deg,#1a0a0a,#0a0515);padding:22px">'
          +'<div style="font-size:10px;letter-spacing:.12em;color:rgba(200,169,110,.6);margin-bottom:5px">APPETYT TRAVEL</div>'
          +'<div style="font-size:22px;font-weight:600;font-style:italic;color:#fff">Day '+dayNum+' - '+port.name+'</div>'
          +'<div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:2px">'+port.country+' - Valiant Lady</div>'
          +(!isAtSea&&!isDebark?'<div style="display:flex;gap:8px;margin-top:12px">'
            +'<div style="flex:1;background:rgba(62,184,168,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#3eb8a8;margin-bottom:2px">ARRIVE</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.arrive+'</div></div>'
            +'<div style="flex:1;background:rgba(212,117,106,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#d4756a;margin-bottom:2px">DEPART</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.depart+'</div></div>'
            +'<div style="flex:1;background:rgba(200,169,110,.1);border-radius:8px;padding:8px;text-align:center"><div style="font-size:8px;color:#c8a96e;margin-bottom:2px">ASHORE</div><div style="font-size:13px;font-weight:600;color:#e8dfc8">'+port.hours+'h</div></div>'
            +'</div>':'')
          +'</div>'
          +'<div style="padding:18px">'
          +'<div style="font-size:14px;line-height:1.8;color:#9a8e72;margin-bottom:16px">'+briefing+'</div>'
          +'<a href="https://appetyt.app" style="display:block;background:linear-gradient(135deg,#e2c98a,#9a6e28);color:#0a0600;text-align:center;padding:11px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px">Open Port Guide in Appetyt</a>'
          +'</div></div></body></html>';

        const emailRes = await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
          body:JSON.stringify({from:'Appetyt Travel <travel@appetyt.app>',to:[sub.email],subject,html})
        });
        if (!emailRes.ok) throw new Error('Resend '+emailRes.status+': '+(await emailRes.text()).slice(0,100));
        results.push({email:sub.email,status:'sent',port:port.name});
      } catch(err) {
        results.push({email:sub.email,status:'failed',error:err.message});
      }
    }

    return {statusCode:200,headers,body:JSON.stringify({success:true,port:port.name,day:dayNum,results})};

  } catch(err) {
    return {statusCode:500,headers,body:JSON.stringify({error:err.message})};
  }
};
