import { getStorageMode, isCloudStorageConfigured, readCloudState } from './_lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const storageConfigured = isCloudStorageConfigured();
  let connectedClients = 1;
  let hasServerState = false;
  let revision = 0;

  if (storageConfigured) {
    try {
      const snapshot = await readCloudState({});
      connectedClients = snapshot.connectedClients || 1;
      hasServerState = Boolean(snapshot.state && Object.keys(snapshot.state).length > 0);
      revision = snapshot.revision || 0;
    } catch {
      // ignore read failure in info probe
    }
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ip: String(host).split(':')[0],
      port: proto === 'https' ? 443 : 80,
      url: `${proto}://${host}`,
      connectedClients,
      hasServerState,
      supportsSse: false,
      storageConfigured,
      storageMode: getStorageMode(),
      revision,
      timestamp: new Date().toISOString()
    })
  );
}
