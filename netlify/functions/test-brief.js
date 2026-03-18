exports.handler = async (event) => {
  const headers = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};
  
  // Test 1: Basic response
  const body = event.body ? JSON.parse(event.body) : {};
  
  // Test 2: Anthropic API
  let aiResult = 'not tested';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:30,messages:[{role:'user',content:'Say hi'}]})
    });
    const d = await res.json();
    aiResult = res.ok ? 'OK: '+d.content?.[0]?.text : 'FAIL '+res.status+': '+JSON.stringify(d).slice(0,100);
  } catch(e) { aiResult = 'ERROR: '+e.message; }

  // Test 3: Resend API
  let resendResult = 'not tested';
  if (body.testEmail) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
        body: JSON.stringify({from:'onboarding@resend.dev',to:[body.testEmail],subject:'Appetyt Test',html:'<p>Test email from Appetyt morning brief function.</p>'})
      });
      const d = await res.json();
      resendResult = res.ok ? 'OK: id='+d.id : 'FAIL '+res.status+': '+JSON.stringify(d).slice(0,150);
    } catch(e) { resendResult = 'ERROR: '+e.message; }
  }

  return {statusCode:200,headers,body:JSON.stringify({node:process.version,ai:aiResult,resend:resendResult,body},null,2)};
};
