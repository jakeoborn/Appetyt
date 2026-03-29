// Netlify serverless function: Generate .ics calendar file for reservation
// POST /api/generate-calendar
// Body: { restaurantName, address, date, time, partySize, confirmationId, notes }

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body.' }),
    };
  }

  const { restaurantName, address, date, time, partySize, confirmationId, notes } = body;

  if (!restaurantName || !date || !time) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Missing required fields: restaurantName, date, time',
      }),
    };
  }

  // Parse date and time into ICS format (YYYYMMDDTHHMMSS)
  // date expected as YYYY-MM-DD, time as HH:MM (24h) or H:MM AM/PM
  let hour, minute;
  const timeParts = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!timeParts) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid time format. Use HH:MM or H:MM AM/PM.' }),
    };
  }

  hour = parseInt(timeParts[1], 10);
  minute = parseInt(timeParts[2], 10);
  if (timeParts[3]) {
    const ampm = timeParts[3].toUpperCase();
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  }

  const dateParts = date.split('-');
  if (dateParts.length !== 3) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD.' }),
    };
  }

  const year = dateParts[0];
  const month = dateParts[1].padStart(2, '0');
  const day = dateParts[2].padStart(2, '0');
  const hourStr = String(hour).padStart(2, '0');
  const minuteStr = String(minute).padStart(2, '0');

  const dtStart = `${year}${month}${day}T${hourStr}${minuteStr}00`;

  // End time: 1.5 hours later
  let endHour = hour + 1;
  let endMinute = minute + 30;
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }
  // Handle day rollover
  let endDay = parseInt(day, 10);
  if (endHour >= 24) {
    endHour -= 24;
    endDay += 1;
  }
  const endHourStr = String(endHour).padStart(2, '0');
  const endMinuteStr = String(endMinute).padStart(2, '0');
  const endDayStr = String(endDay).padStart(2, '0');
  const dtEnd = `${year}${month}${endDayStr}T${endHourStr}${endMinuteStr}00`;

  // Build description
  const descParts = [`Party size: ${partySize || 'N/A'}`];
  if (confirmationId) descParts.push(`Confirmation: ${confirmationId}`);
  if (notes) descParts.push(`Notes: ${notes}`);
  descParts.push('Booked via Appetyt');
  const description = descParts.join('\\n');

  // Generate UID
  const uid = `appetyt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@appetyt.app`;
  const now = new Date();
  const dtStamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  // Build ICS content
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Appetyt//Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Dinner at ${restaurantName}`,
    address ? `LOCATION:${escapeICS(address)}` : '',
    `DESCRIPTION:${escapeICS(description)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Dinner at ${restaurantName} in 1 hour`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="reservation-${restaurantName.replace(/[^a-zA-Z0-9]/g, '-')}.ics"`,
    },
    body: ics,
  };
};

// Escape special characters for ICS format
function escapeICS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
