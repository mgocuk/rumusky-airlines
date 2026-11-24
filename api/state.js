import { readCloudState } from './_lib/store.js';

function setApiHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');
}

export default async function handler(req, res) {
  setApiHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
    return;
  }

  try {
    const parsedUrl = new URL(req.url || '/api/state', 'http://localhost');
    const clientRev = parsedUrl.searchParams.get('rev');
    const clientId = parsedUrl.searchParams.get('clientId');
    const result = await readCloudState({ clientRev, clientId });
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        success: false,
        storageConfigured: true,
        error: err?.message || 'Failed to read cloud state'
      })
    );
  }
}
