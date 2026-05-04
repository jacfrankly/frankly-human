export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, workbook = {} } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error('BUTTONDOWN_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  // Build subscriber metadata from workbook
  const metadata = {
    source: 'why-workshop',
    values_top3: (workbook.values_top3 || []).join(', '),
    statement: workbook.statement_draft || '',
    next_move: workbook.next_move || ''
  };

  try {
    const res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        tags: ['ww-complete'],
        metadata,
        ...(name ? { notes: `First name: ${name}` } : {})
      })
    });

    if (res.ok || res.status === 201) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      };
    }

    // 409 = already subscribed — treat as success
    if (res.status === 409) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      };
    }

    const errText = await res.text();
    console.error('Buttondown error:', res.status, errText);
    return { statusCode: 502, body: JSON.stringify({ error: 'Subscription failed' }) };
  } catch (err) {
    console.error('Fetch error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Network error' }) };
  }
};
