const KIT_API_BASE = 'https://api.kit.com/v4';

async function kitFetch(path, apiKey, options = {}) {
  const res = await fetch(`${KIT_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
      ...(options.headers || {})
    }
  });
  return res;
}

async function getOrCreateTagId(name, apiKey, cache) {
  if (cache.has(name)) return cache.get(name);

  const listRes = await kitFetch('/tags', apiKey);
  if (listRes.ok) {
    const data = await listRes.json();
    const found = (data.tags || []).find(t => t.name === name);
    if (found) {
      cache.set(name, found.id);
      return found.id;
    }
  }

  const createRes = await kitFetch('/tags', apiKey, {
    method: 'POST',
    body: JSON.stringify({ name })
  });
  if (!createRes.ok) {
    throw new Error(`Failed to create tag "${name}": ${createRes.status} ${await createRes.text()}`);
  }
  const created = await createRes.json();
  cache.set(name, created.tag.id);
  return created.tag.id;
}

async function tagSubscriber(tagId, email, apiKey, fields) {
  const res = await kitFetch(`/tags/${tagId}/subscribers`, apiKey, {
    method: 'POST',
    body: JSON.stringify({ email_address: email, fields })
  });
  if (!res.ok) {
    throw new Error(`Failed to tag subscriber with tag ${tagId}: ${res.status} ${await res.text()}`);
  }
}

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

  const { name, email, diagnostic = {} } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    console.error('KIT_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  const reveal = diagnostic.reveal || {};
  const trap = diagnostic.trap || {};
  const threads = diagnostic.threads || {};

  const fields = {
    first_name: name || '',
    profile_sentence: reveal.profile_sentence || '',
    leadership_trap: trap.name || '',
    budget_authority: (threads.budget && threads.budget.choiceText) || '',
    roadmap_influence: (threads.roadmap && threads.roadmap.choiceText) || '',
    executive_trust: (threads.trust && threads.trust.choiceText) || '',
    relationship_capital: (threads.relationship && threads.relationship.choiceText) || ''
  };

  try {
    const tagCache = new Map();
    const trackTagId = await getOrCreateTagId('track:design-leadership-diagnostic', apiKey, tagCache);
    const stageTagId = await getOrCreateTagId('stage:diagnostic-complete', apiKey, tagCache);

    await tagSubscriber(trackTagId, email, apiKey, fields);
    await tagSubscriber(stageTagId, email, apiKey, fields);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error('Kit subscribe error:', err.message);
    return { statusCode: 502, body: JSON.stringify({ error: 'Subscription failed' }) };
  }
};