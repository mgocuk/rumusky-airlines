import type { ViteDevServer, PreviewServer, Plugin, Connect } from 'vite';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { applySyncAction } from '../shared/syncReducer.js';

// Type definitions for sync
export interface SyncAction {
  id: string;
  type: string;
  payload: any;
  originClientId: string;
  timestamp: string;
}

// Find local reachable LAN IPv4 address (excluding virtual adapters)
export function getLocalIpAddress(): string {
  const nets = os.networkInterfaces();
  let wifiIp = '';
  let ethernetIp = '';
  let fallbackIp = '';

  const virtualAdapterPattern =
    /vethernet|virtualbox|vbox|vmware|hyper-v|wsl|docker|loopback|tailscale|zerotier|hamachi|bluetooth|npcap/i;

  for (const name of Object.keys(nets)) {
    const netList = nets[name];
    if (!netList) continue;
    if (virtualAdapterPattern.test(name)) continue;

    for (const net of netList) {
      if (
        net.family === 'IPv4' &&
        !net.internal &&
        !net.address.startsWith('169.254') &&
        !net.address.startsWith('192.168.56.')
      ) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
          wifiIp = net.address;
        } else if (lowerName.includes('ethernet') || lowerName.includes('eth') || lowerName.includes('en0')) {
          ethernetIp = net.address;
        } else if (!fallbackIp) {
          fallbackIp = net.address;
        }
      }
    }
  }

  return wifiIp || ethernetIp || fallbackIp || '127.0.0.1';
}

export function createRealtimeSyncPlugin(): Plugin {
  const storeFilePath = path.resolve(process.cwd(), 'server', 'data', 'store.json');
  let memoryStore: Record<string, any> = {};
  let stateRevision = Date.now();
  const sseClients = new Set<any>();

  // Ensure server data directory exists
  try {
    const dir = path.dirname(storeFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(storeFilePath)) {
      const raw = fs.readFileSync(storeFilePath, 'utf-8');
      memoryStore = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[SyncServer] Could not initialize file store:', err);
  }

  const saveStoreToFile = () => {
    try {
      fs.writeFileSync(storeFilePath, JSON.stringify(memoryStore, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SyncServer] Error writing to store.json:', err);
    }
  };

  const broadcastAction = (action: SyncAction) => {
    const message = `data: ${JSON.stringify(action)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(message);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  };

  const applyActionToStore = (action: SyncAction) => {
    const { state: nextStore, mutated } = applySyncAction(memoryStore, action);
    if (mutated) {
      memoryStore = nextStore;
      saveStoreToFile();
      stateRevision += 1;
    }
  };

  const attachSyncMiddleware = (
    middlewares: Connect.Server,
    getPort: () => number,
    httpServer: any
  ) => {
    const pingTimer = setInterval(() => {
      for (const client of sseClients) {
        try {
          client.write(': ping\n\n');
        } catch (e) {
          sseClients.delete(client);
        }
      }
    }, 15000);

    httpServer?.on('close', () => {
      clearInterval(pingTimer);
    });

    middlewares.use((req, res, next) => {
      const rawUrl = req.url || '';
      const parsedUrl = new URL(rawUrl, 'http://localhost');
      const pathname = parsedUrl.pathname;

      if (pathname.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }
      }

      // 1. GET /api/network-info
      if (pathname === '/api/network-info' && req.method === 'GET') {
        const ip = getLocalIpAddress();
        const port = getPort();
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ip,
            port,
            url: `http://${ip}:${port}`,
            connectedClients: sseClients.size,
            hasServerState: Object.keys(memoryStore).length > 0,
            supportsSse: true,
            storageConfigured: true,
            revision: stateRevision,
            timestamp: new Date().toISOString()
          })
        );
        return;
      }

      // 2. GET /api/state
      if (pathname === '/api/state' && req.method === 'GET') {
        const clientRev = parsedUrl.searchParams.get('rev');
        res.setHeader('Content-Type', 'application/json');
        if (clientRev && clientRev === String(stateRevision)) {
          res.end(
            JSON.stringify({
              success: true,
              unchanged: true,
              supportsSse: true,
              storageConfigured: true,
              revision: stateRevision,
              connectedClients: sseClients.size
            })
          );
          return;
        }

        res.end(
          JSON.stringify({
            success: true,
            unchanged: false,
            supportsSse: true,
            storageConfigured: true,
            revision: stateRevision,
            state: memoryStore,
            connectedClients: sseClients.size
          })
        );
        return;
      }

      // 3. POST /api/action
      if (pathname === '/api/action' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const action: SyncAction = JSON.parse(body);
            if (!action.id) action.id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            if (!action.timestamp) action.timestamp = new Date().toISOString();

            applyActionToStore(action);
            broadcastAction(action);

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                actionId: action.id,
                revision: stateRevision
              })
            );
          } catch (err: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
          }
        });
        return;
      }

      // 4. GET /api/events (Server-Sent Events)
      if (pathname === '/api/events' && req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': '*'
        });

        sseClients.add(res);

        res.write(
          `data: ${JSON.stringify({
            type: 'CONNECTED',
            payload: {
              connectedClients: sseClients.size,
              hasState: Object.keys(memoryStore).length > 0,
              revision: stateRevision
            },
            originClientId: 'server',
            timestamp: new Date().toISOString()
          })}\n\n`
        );

        broadcastAction({
          id: `client-count-${Date.now()}`,
          type: 'CLIENTS_COUNT_UPDATED',
          payload: { connectedClients: sseClients.size },
          originClientId: 'server',
          timestamp: new Date().toISOString()
        });

        req.on('close', () => {
          sseClients.delete(res);
          broadcastAction({
            id: `client-count-${Date.now()}`,
            type: 'CLIENTS_COUNT_UPDATED',
            payload: { connectedClients: sseClients.size },
            originClientId: 'server',
            timestamp: new Date().toISOString()
          });
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'vite-plugin-rumusky-sync',
    configureServer(server: ViteDevServer) {
      attachSyncMiddleware(
        server.middlewares,
        () => server.config.server.port || 3000,
        server.httpServer
      );
    },
    configurePreviewServer(server: PreviewServer) {
      attachSyncMiddleware(
        server.middlewares,
        () => server.config.preview.port || server.config.server.port || 4173,
        server.httpServer
      );
    }
  };
}
