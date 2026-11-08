import type { ViteDevServer, Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Type definitions for sync
export interface SyncAction {
  id: string;
  type: string;
  payload: any;
  originClientId: string;
  timestamp: string;
}

// Find local IPv4 address
export function getLocalIpAddress(): string {
  const nets = os.networkInterfaces();
  let wifiIp = '';
  let ethernetIp = '';
  let fallbackIp = '127.0.0.1';

  for (const name of Object.keys(nets)) {
    const netList = nets[name];
    if (!netList) continue;
    for (const net of netList) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
          wifiIp = net.address;
        } else if (lowerName.includes('ethernet') || lowerName.includes('eth')) {
          ethernetIp = net.address;
        } else {
          fallbackIp = net.address;
        }
      }
    }
  }

  return wifiIp || ethernetIp || fallbackIp;
}

export function createRealtimeSyncPlugin(): Plugin {
  const storeFilePath = path.resolve(process.cwd(), 'server', 'data', 'store.json');
  let memoryStore: Record<string, any> = {};
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
    const { type, payload } = action;

    switch (type) {
      case 'INIT_STATE':
        // Only if memoryStore is empty or requested
        if (Object.keys(memoryStore).length === 0 || payload.force) {
          memoryStore = { ...memoryStore, ...payload.state };
          saveStoreToFile();
        }
        break;

      case 'BOOKING_CREATED': {
        const { booking, tickets, updatedFlight } = payload;
        if (booking) {
          memoryStore.bookings = [booking, ...(memoryStore.bookings || []).filter((b: any) => b.id !== booking.id)];
        }
        if (tickets && Array.isArray(tickets)) {
          const newIds = new Set(tickets.map((t: any) => t.id));
          memoryStore.tickets = [...tickets, ...(memoryStore.tickets || []).filter((t: any) => !newIds.has(t.id))];
        }
        if (updatedFlight) {
          memoryStore.flights = (memoryStore.flights || []).map((f: any) =>
            f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f
          );
        }
        saveStoreToFile();
        break;
      }

      case 'BOOKING_CANCELLED': {
        const { bookingId, updatedFlight } = payload;
        if (bookingId) {
          memoryStore.bookings = (memoryStore.bookings || []).map((b: any) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          );
        }
        if (updatedFlight) {
          memoryStore.flights = (memoryStore.flights || []).map((f: any) =>
            f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f
          );
        }
        saveStoreToFile();
        break;
      }

      case 'CHECKIN_COMPLETED': {
        const { ticketId, seatNumber } = payload;
        if (ticketId) {
          memoryStore.tickets = (memoryStore.tickets || []).map((t: any) =>
            t.id === ticketId ? { ...t, status: 'checked_in', seatNumber: seatNumber || t.seatNumber } : t
          );
          saveStoreToFile();
        }
        break;
      }

      case 'SITE_CONTENT_UPDATED': {
        memoryStore.siteContent = {
          ...(memoryStore.siteContent || {}),
          ...payload
        };
        saveStoreToFile();
        break;
      }

      case 'FLIGHTS_UPDATED': {
        if (Array.isArray(payload.flights)) {
          memoryStore.flights = payload.flights;
          saveStoreToFile();
        }
        break;
      }

      case 'FLIGHT_ADDED': {
        if (payload.flight) {
          memoryStore.flights = [payload.flight, ...(memoryStore.flights || [])];
          saveStoreToFile();
        }
        break;
      }

      case 'FLIGHT_CANCELLED': {
        const { flightId } = payload;
        if (flightId) {
          memoryStore.flights = (memoryStore.flights || []).map((f: any) =>
            f.id === flightId ? { ...f, bookingStatus: 'closed', operationalStatus: 'Cancelled' } : f
          );
          saveStoreToFile();
        }
        break;
      }

      case 'AIRCRAFTS_UPDATED': {
        if (Array.isArray(payload.aircrafts)) {
          memoryStore.aircrafts = payload.aircrafts;
          saveStoreToFile();
        }
        break;
      }

      case 'AIRPORT_ADDED': {
        if (payload.airport) {
          memoryStore.airports = [...(memoryStore.airports || []), payload.airport];
          saveStoreToFile();
        }
        break;
      }

      case 'NEWS_UPDATED': {
        if (Array.isArray(payload.news)) {
          memoryStore.news = payload.news;
          saveStoreToFile();
        }
        break;
      }

      case 'INFO_PAGE_UPDATED': {
        if (payload.page) {
          memoryStore.infoPages = (memoryStore.infoPages || []).map((p: any) =>
            p.id === payload.page.id ? { ...p, ...payload.page } : p
          );
          saveStoreToFile();
        }
        break;
      }

      case 'ROLE_PERMISSIONS_UPDATED': {
        if (payload.rolePermissions) {
          memoryStore.rolePermissions = payload.rolePermissions;
          saveStoreToFile();
        }
        break;
      }

      case 'STAFF_USERS_UPDATED': {
        if (Array.isArray(payload.staffUsers)) {
          memoryStore.staffUsers = payload.staffUsers;
          saveStoreToFile();
        }
        break;
      }

      case 'RESET_ALL_DATA': {
        memoryStore = {};
        if (fs.existsSync(storeFilePath)) {
          fs.unlinkSync(storeFilePath);
        }
        break;
      }

      default:
        break;
    }
  };

  return {
    name: 'vite-plugin-rumusky-sync',
    configureServer(server: ViteDevServer) {
      // Periodic ping to keep SSE connections alive
      setInterval(() => {
        for (const client of sseClients) {
          try {
            client.write(': ping\n\n');
          } catch (e) {
            sseClients.delete(client);
          }
        }
      }, 15000);

      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // CORS headers for all /api requests
        if (url.startsWith('/api/')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }
        }

        // 1. GET /api/network-info
        if (url === '/api/network-info' && req.method === 'GET') {
          const ip = getLocalIpAddress();
          const port = server.config.server.port || 3000;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ip,
              port,
              url: `http://${ip}:${port}`,
              connectedClients: sseClients.size,
              hasServerState: Object.keys(memoryStore).length > 0,
              timestamp: new Date().toISOString()
            })
          );
          return;
        }

        // 2. GET /api/state
        if (url === '/api/state' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: true,
              state: memoryStore,
              connectedClients: sseClients.size
            })
          );
          return;
        }

        // 3. POST /api/action
        if (url === '/api/action' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const action: SyncAction = JSON.parse(body);
              if (!action.id) action.id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
              if (!action.timestamp) action.timestamp = new Date().toISOString();

              // Apply to server store
              applyActionToStore(action);

              // Broadcast to other SSE clients
              broadcastAction(action);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, actionId: action.id }));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
            }
          });
          return;
        }

        // 4. GET /api/events (Server-Sent Events)
        if (url === '/api/events' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });

          sseClients.add(res);

          // Send welcome event with client count
          res.write(
            `data: ${JSON.stringify({
              type: 'CONNECTED',
              payload: {
                connectedClients: sseClients.size,
                hasState: Object.keys(memoryStore).length > 0
              },
              originClientId: 'server',
              timestamp: new Date().toISOString()
            })}\n\n`
          );

          // Broadcast client count update
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
    }
  };
}
