// Appetyt Trip Extraction — Netlify Serverless Function
// Extracts trip details from booking confirmation images using Claude Vision.
// Set ANTHROPIC_API_KEY in Netlify environment variables.

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
    const { image, mediaType } = JSON.parse(event.body || '{}');

    if (!image) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing image data' }) };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
            { type: 'text', text: `Extract trip details from this booking confirmation. Return ONLY valid JSON:
{
  "tripType": "cruise|hotel|flight|airbnb|tour|general",
  "tripName": "suggested trip name",
  "destination": "city/country",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "confirmation": "confirmation number if visible",
  "details": [
    {"type": "flight|hotel|activity|cruise_port|transfer|other", "title": "name", "date": "YYYY-MM-DD", "time": "HH:MM AM/PM", "notes": "key info"}
  ],
  "cruisePorts": [
    {"name": "port, country", "date": "YYYY-MM-DD", "arrive": "time or Embark", "depart": "time or Debark", "flag": "flag emoji"}
  ]
}
Only include cruisePorts if this is a cruise itinerary. Include all bookings/legs in details array.` }
          ]
        }]
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
