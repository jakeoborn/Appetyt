exports.handler = async (event) => {
  const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};
  
  const diagnostics = {
    nodeVersion: process.version,
    env: {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
    },
    hasFetch: typeof fetch !== 'undefined',
    method: event.httpMethod,
  };

  // Test Anthropic API
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 50,
        messages: [{role:'user', content:'Say "test ok" and nothing else.'}]
      })
    });
    const data = await res.json();
    diagnostics.anthropicTest = res.ok ? 'OK: ' + data.content?.[0]?.text : 'FAIL: ' + JSON.stringify(data).slice(0,100);
  } catch(e) {
    diagnostics.anthropicTest = 'ERROR: ' + e.message;
  }

  return {statusCode: 200, headers, body: JSON.stringify(diagnostics, null, 2)};
};
