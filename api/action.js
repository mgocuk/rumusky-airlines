import { writeCloudAction } from './_lib/store.js';

function setApiHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.length > 0) {
    return JSON.parse(req.body);
  }
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  setApiHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
    return;
  }

  try {
    const action = await parseJsonBody(req);
    if (!action.id) {
      action.id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!action.timestamp) {
      action.timestamp = new Date().toISOString();
    }

    const result = await writeCloudAction(action);
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ...result,
        actionId: action.id
      })
    );
  } catch (err) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        success: false,
        error: err?.message || 'Invalid action request'
      })
    );
  }
}
