exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  const { messages, city, system } = JSON.parse(event.body || '{}');

  const defaultSystem = `You are the Dim Hour concierge — a knowledgeable local food guide for ${city || 'Dallas'}.
You know every great restaurant, which ones need reservations weeks ahead, where happy hour is, and what to order.
Be warm, confident, and specific — like a well-connected local friend.
Keep responses concise (under 150 words). Use line breaks for readability.
For booking requests: give the platform name (Resy/OpenTable/Tock) and direct URL when you know it.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: system || defaultSystem,
        messages: messages || []
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} — ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Try again in a moment.';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error('Concierge error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
