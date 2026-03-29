// Netlify serverless function: Check Bland AI call status
// GET /api/reserve-status?callId=xxx

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use GET.' }),
    };
  }

  const BLAND_API_KEY = process.env.BLAND_API_KEY;
  if (!BLAND_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Bland AI API key not configured.' }),
    };
  }

  const callId = event.queryStringParameters?.callId;
  if (!callId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required query parameter: callId' }),
    };
  }

  try {
    const response = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
      method: 'GET',
      headers: {
        'Authorization': BLAND_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Bland AI API error',
          details: data,
        }),
      };
    }

    // Analyze transcript to determine if reservation was confirmed
    const transcript = data.concatenated_transcript || data.transcript || '';
    const transcriptLower = transcript.toLowerCase();
    const confirmed =
      transcriptLower.includes('confirmed') ||
      transcriptLower.includes('reservation is set') ||
      transcriptLower.includes('booked') ||
      transcriptLower.includes('see you') ||
      transcriptLower.includes('we have you down') ||
      transcriptLower.includes("you're all set");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        callId: callId,
        status: data.status || 'unknown',
        completed: data.completed || false,
        duration: data.call_length || null,
        transcript: transcript,
        confirmed: confirmed,
        summary: data.summary || null,
        recordingUrl: data.recording_url || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to check call status',
        details: error.message,
      }),
    };
  }
};
