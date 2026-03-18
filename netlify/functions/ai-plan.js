// Appetyt AI Plan — Netlify Serverless Function
// Deploy alongside index.html. Set ANTHROPIC_API_KEY in Netlify environment variables.
// Users never see or need an API key.

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { siteName, country, category, question } = JSON.parse(event.body || '{}');

    if (!siteName || !question) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing siteName or question' }) };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Fast + cheap (~$0.001/request)
        max_tokens: 600,
        system: `You are Appetyt's AI travel planner. The user is planning a visit to ${siteName} in ${country} (${category}).
Give a concise, practical, specific travel guide answering their question.
Use **bold** for section headers. Include: best time to visit, 2-3 specific hotels by name, 2-3 restaurants by name, logistics, and one insider tip.
Under 350 words. Be specific — name real places. Start directly, no preamble.`,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI service unavailable' }) };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error' })
    };
  }
};
