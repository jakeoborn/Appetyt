// Netlify serverless function: AI Phone Reservation via Bland AI
// POST /api/reserve-call
// Body: { restaurantName, phone, partySize, date, time, guestName, specialRequests }

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
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

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body.' }),
    };
  }

  const { restaurantName, phone, partySize, date, time, guestName, specialRequests } = body;

  if (!restaurantName || !phone || !partySize || !date || !time || !guestName) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Missing required fields: restaurantName, phone, partySize, date, time, guestName',
      }),
    };
  }

  const specialLine = specialRequests
    ? `Also, the guest has a special request: ${specialRequests}.`
    : '';

  const task = `You are a polite and professional reservation assistant calling on behalf of a guest.
Your goal is to make a dinner reservation at ${restaurantName}.

Here are the reservation details:
- Guest name: ${guestName}
- Party size: ${partySize} people
- Date: ${date}
- Time: ${time}
${specialLine}

Instructions:
1. Greet the restaurant warmly and say you are calling to make a reservation.
2. Provide all the reservation details: party size of ${partySize}, for ${date} at ${time}, under the name ${guestName}.
3. ${specialRequests ? 'Mention the special request: ' + specialRequests + '.' : 'Ask if there is anything else they need to know.'}
4. Confirm all the reservation details back once they accept.
5. Thank them and end the call politely.

If the requested time is not available, ask what times are available closest to ${time} and accept a reasonable alternative. Always remain courteous and professional.`;

  try {
    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Authorization': BLAND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phone,
        task: task,
        voice: 'nat',
        reduce_latency: true,
        record: true,
        wait_for_greeting: true,
        first_sentence: `Hi, good evening! I'm calling to make a dinner reservation at ${restaurantName}, please.`,
        model: 'enhanced',
        max_duration: 5,
      }),
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        callId: data.call_id,
        status: data.status || 'queued',
        message: `Calling ${restaurantName} to reserve for ${partySize} on ${date} at ${time}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to initiate call',
        details: error.message,
      }),
    };
  }
};
