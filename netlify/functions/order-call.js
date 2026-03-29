// Netlify serverless function: AI Phone Order via Bland AI
// POST /api/order-call
// Body: { restaurantName, phone, orderType, items, guestName, pickupTime, deliveryAddress, specialRequests }

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

  const { restaurantName, phone, orderType, items, guestName, pickupTime, deliveryAddress, specialRequests } = body;

  if (!restaurantName || !phone || !orderType || !items || !guestName) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Missing required fields: restaurantName, phone, orderType, items, guestName',
      }),
    };
  }

  const isDelivery = orderType === 'delivery';
  const itemsList = Array.isArray(items) ? items.join(', ') : items;
  const specialLine = specialRequests
    ? `The guest also has a special request: ${specialRequests}.`
    : '';
  const deliveryLine = isDelivery && deliveryAddress
    ? `This is a delivery order to the following address: ${deliveryAddress}.`
    : '';
  const pickupLine = pickupTime
    ? `The guest would like the order ready by ${pickupTime}.`
    : 'The guest would like the order as soon as possible.';

  const task = `You are a polite and professional assistant calling to place a ${isDelivery ? 'delivery' : 'pickup'} order on behalf of a guest.
You are calling ${restaurantName}.

Here are the order details:
- Guest name: ${guestName}
- Order type: ${isDelivery ? 'Delivery' : 'Pickup'}
- Items to order: ${itemsList}
${deliveryLine}
${pickupLine}
${specialLine}

Instructions:
1. Greet the restaurant warmly and say you would like to place a ${isDelivery ? 'delivery' : 'pickup'} order.
2. Give the guest name: ${guestName}.
3. Read through the items: ${itemsList}. If they ask about size or preparation, choose a standard or regular option.
4. ${isDelivery ? 'Provide the delivery address: ' + (deliveryAddress || 'ask the guest to confirm') + '.' : 'Confirm this is a pickup order.'}
5. ${pickupTime ? 'Request the order be ready by ' + pickupTime + '.' : 'Ask how long the order will take.'}
6. ${specialRequests ? 'Mention the special request: ' + specialRequests + '.' : ''}
7. Ask for the total.
8. Confirm all details back: items, ${isDelivery ? 'delivery address' : 'pickup'}, estimated time, and total.
9. Thank them and end the call politely.

If an item is unavailable, ask what they recommend as a substitute and accept a reasonable alternative. Always remain courteous and professional.`;

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
        first_sentence: `Hi, good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}! I'd like to place a ${isDelivery ? 'delivery' : 'pickup'} order, please.`,
        model: 'enhanced',
        max_duration: 7,
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
        message: `Calling ${restaurantName} to place ${isDelivery ? 'delivery' : 'pickup'} order for ${guestName}`,
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
