import { applySyncAction, restoreFlightsCapacity } from '../../src/shared/syncReducer.js';

const KEYS = {
  META: 'rumusky:airlines:meta',
  BOOKINGS: 'rumusky:airlines:bookings',
  TICKETS: 'rumusky:airlines:tickets',
  REVISION: 'rumusky:airlines:revision',
  CLIENTS: 'rumusky:airlines:clients',
  FIREBASE_ROOT: 'rumusky_airlines_store'
};

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  if (url && token) {
    return { url: url.replace(/\/+$/, ''), token };
  }
  return null;
}

function getFirebaseConfig() {
  const url = process.env.FIREBASE_DATABASE_URL || '';
  const auth = process.env.FIREBASE_DATABASE_SECRET || '';
  if (url) {
    return { url: url.replace(/\/+$/, ''), auth };
  }
  return null;
}

export function getStorageMode() {
  if (getRedisConfig()) return 'upstash_redis';
  if (getFirebaseConfig()) return 'firebase_rtdb';
  return 'unconfigured';
}

export function isCloudStorageConfigured() {
  return getStorageMode() !== 'unconfigured';
}

async function redisPipeline(commands) {
  const cfg = getRedisConfig();
  if (!cfg) throw new Error('Redis is not configured');

  const res = await fetch(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis pipeline error (${res.status}): ${text}`);
  }

  return res.json();
}

function parseJsonSafe(raw, fallback) {
  if (!raw) return fallback;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function extractMeta(stateObj) {
  if (!stateObj || typeof stateObj !== 'object') return {};
  const { bookings: _b, tickets: _t, ...meta } = stateObj;
  return meta;
}

function sortByNewest(items, primaryField, fallbackField) {
  return [...items].sort((a, b) => {
    const da = a?.[primaryField] || a?.[fallbackField] || '';
    const db = b?.[primaryField] || b?.[fallbackField] || '';
    return String(db).localeCompare(String(da));
  });
}

async function trackAndCountClientsRedis(clientId) {
  const now = Date.now();
  const staleBefore = now - 25000;
  const cmds = [['ZREMRANGEBYSCORE', KEYS.CLIENTS, '-inf', String(staleBefore)]];
  if (clientId) {
    cmds.push(['ZADD', KEYS.CLIENTS, String(now), String(clientId)]);
  }
  cmds.push(['ZCARD', KEYS.CLIENTS]);
  const results = await redisPipeline(cmds);
  const cardRes = results[results.length - 1];
  return Math.max(1, Number(cardRes?.result || 1));
}

async function getRedisState({ clientRev, clientId }) {
  const preResults = await redisPipeline([
    ['GET', KEYS.REVISION],
    ['ZREMRANGEBYSCORE', KEYS.CLIENTS, '-inf', String(Date.now() - 25000)],
    ...(clientId ? [['ZADD', KEYS.CLIENTS, String(Date.now()), String(clientId)]] : []),
    ['ZCARD', KEYS.CLIENTS]
  ]);

  const revRaw = preResults[0]?.result;
  const revision = revRaw ? Number(revRaw) : 1;
  const connectedClients = Math.max(1, Number(preResults[preResults.length - 1]?.result || 1));

  if (clientRev && String(clientRev) === String(revision)) {
    return {
      success: true,
      unchanged: true,
      storageConfigured: true,
      supportsSse: false,
      revision,
      connectedClients
    };
  }

  const dataResults = await redisPipeline([
    ['GET', KEYS.META],
    ['HVALS', KEYS.BOOKINGS],
    ['HVALS', KEYS.TICKETS]
  ]);

  const meta = parseJsonSafe(dataResults[0]?.result, {});
  const rawBookings = Array.isArray(dataResults[1]?.result) ? dataResults[1].result : [];
  const rawTickets = Array.isArray(dataResults[2]?.result) ? dataResults[2].result : [];

  const bookings = sortByNewest(
    rawBookings.map((x) => parseJsonSafe(x, null)).filter(Boolean),
    'createdAt',
    'id'
  );
  const tickets = sortByNewest(
    rawTickets.map((x) => parseJsonSafe(x, null)).filter(Boolean),
    'issuedAt',
    'id'
  );

  const hasState = Object.keys(meta).length > 0 || bookings.length > 0 || tickets.length > 0;
  const state = hasState ? { ...meta, bookings, tickets } : {};

  return {
    success: true,
    unchanged: false,
    storageConfigured: true,
    supportsSse: false,
    revision,
    connectedClients,
    state
  };
}

async function applyRedisAction(action) {
  const { type, payload, originClientId } = action || {};
  const commands = [];

  if (type === 'BOOKING_CREATED') {
    const { booking, tickets, updatedFlight } = payload || {};
    const metaResults = await redisPipeline([
      ['GET', KEYS.META],
      ...(booking ? [['HEXISTS', KEYS.BOOKINGS, booking.id]] : [])
    ]);
    const meta = parseJsonSafe(metaResults[0]?.result, {});
    const isDuplicate = booking ? Boolean(metaResults[1]?.result) : false;

    if (booking) {
      commands.push(['HSET', KEYS.BOOKINGS, booking.id, JSON.stringify(booking)]);
    }
    if (Array.isArray(tickets)) {
      for (const t of tickets) {
        if (t?.id) {
          commands.push(['HSET', KEYS.TICKETS, t.id, JSON.stringify(t)]);
        }
      }
    }
    if (booking && !isDuplicate && Array.isArray(meta.flights)) {
      const paxCount = Array.isArray(booking.passengers) ? booking.passengers.length : 1;
      const isBusiness = booking.passengers?.[0]?.cabinClass === 'business';
      meta.flights = meta.flights.map((f) => {
        if (f.id !== booking.flightId) return f;
        if (isBusiness) {
          return { ...f, availableBusinessSeats: Math.max(0, (f.availableBusinessSeats ?? 0) - paxCount) };
        }
        return { ...f, availableEconomySeats: Math.max(0, (f.availableEconomySeats ?? 0) - paxCount) };
      });
      commands.push(['SET', KEYS.META, JSON.stringify(meta)]);
    } else if (updatedFlight && Array.isArray(meta.flights)) {
      meta.flights = meta.flights.map((f) => (f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f));
      commands.push(['SET', KEYS.META, JSON.stringify(meta)]);
    }
  } else if (type === 'BOOKING_CANCELLED') {
    const { bookingId, updatedFlight } = payload || {};
    const readRes = await redisPipeline([
      ['GET', KEYS.META],
      ...(bookingId ? [['HGET', KEYS.BOOKINGS, bookingId]] : [])
    ]);
    const meta = parseJsonSafe(readRes[0]?.result, {});
    const targetBooking = bookingId ? parseJsonSafe(readRes[1]?.result, null) : null;
    if (targetBooking) {
      targetBooking.status = 'cancelled';
      commands.push(['HSET', KEYS.BOOKINGS, bookingId, JSON.stringify(targetBooking)]);
    }
    if (updatedFlight && Array.isArray(meta.flights)) {
      meta.flights = meta.flights.map((f) => (f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f));
      commands.push(['SET', KEYS.META, JSON.stringify(meta)]);
    }
  } else if (type === 'BOOKINGS_CLEARED') {
    const readRes = await redisPipeline([['GET', KEYS.META]]);
    const meta = parseJsonSafe(readRes[0]?.result, {});
    if (Array.isArray(meta.flights)) {
      meta.flights = restoreFlightsCapacity(meta.flights, meta.aircrafts);
      commands.push(['SET', KEYS.META, JSON.stringify(meta)]);
    }
    commands.push(['DEL', KEYS.BOOKINGS, KEYS.TICKETS]);
  } else if (type === 'CHECKIN_COMPLETED') {
    const { ticketId, seatNumber } = payload || {};
    if (ticketId) {
      const readRes = await redisPipeline([['HGET', KEYS.TICKETS, ticketId]]);
      const targetTicket = parseJsonSafe(readRes[0]?.result, null);
      if (targetTicket) {
        targetTicket.status = 'checked_in';
        if (seatNumber) targetTicket.seatNumber = seatNumber;
        commands.push(['HSET', KEYS.TICKETS, ticketId, JSON.stringify(targetTicket)]);
      }
    }
  } else if (type === 'RESET_ALL_DATA') {
    commands.push(['DEL', KEYS.BOOKINGS, KEYS.TICKETS, KEYS.META]);
  } else if (type === 'INIT_STATE') {
    const readRes = await redisPipeline([['GET', KEYS.META]]);
    const existingMeta = parseJsonSafe(readRes[0]?.result, {});
    const hasExisting = Array.isArray(existingMeta.flights) && existingMeta.flights.length > 0;
    if (!hasExisting || payload?.force) {
      const incoming = payload?.state || {};
      const nextMeta = extractMeta(incoming);
      commands.push(['SET', KEYS.META, JSON.stringify(nextMeta)]);
      if (Array.isArray(incoming.bookings)) {
        for (const b of incoming.bookings) {
          if (b?.id) commands.push(['HSET', KEYS.BOOKINGS, b.id, JSON.stringify(b)]);
        }
      }
      if (Array.isArray(incoming.tickets)) {
        for (const t of incoming.tickets) {
          if (t?.id) commands.push(['HSET', KEYS.TICKETS, t.id, JSON.stringify(t)]);
        }
      }
    }
  } else {
    const readRes = await redisPipeline([['GET', KEYS.META]]);
    const existingMeta = parseJsonSafe(readRes[0]?.result, {});
    const { state: nextMeta, mutated } = applySyncAction(existingMeta, action);
    if (mutated) {
      commands.push(['SET', KEYS.META, JSON.stringify(extractMeta(nextMeta))]);
    }
  }

  let revision;
  if (commands.length > 0) {
    commands.push(['INCR', KEYS.REVISION]);
    const writeRes = await redisPipeline(commands);
    revision = Number(writeRes[writeRes.length - 1]?.result || 1);
  } else {
    const revRes = await redisPipeline([['GET', KEYS.REVISION]]);
    revision = Number(revRes[0]?.result || 1);
  }

  const connectedClients = await trackAndCountClientsRedis(originClientId);
  return { success: true, storageConfigured: true, revision, connectedClients };
}

function buildFirebaseUrl(pathSuffix) {
  const cfg = getFirebaseConfig();
  if (!cfg) throw new Error('Firebase RTDB is not configured');
  const authQuery = cfg.auth ? `?auth=${encodeURIComponent(cfg.auth)}` : '';
  return `${cfg.url}/${KEYS.FIREBASE_ROOT}${pathSuffix}.json${authQuery}`;
}

async function getFirebaseState({ clientRev }) {
  const revRes = await fetch(buildFirebaseUrl('/revision'));
  const revisionVal = revRes.ok ? await revRes.json() : 1;
  const revision = Number(revisionVal || 1);

  if (clientRev && String(clientRev) === String(revision)) {
    return {
      success: true,
      unchanged: true,
      storageConfigured: true,
      supportsSse: false,
      revision,
      connectedClients: 1
    };
  }

  const stateRes = await fetch(buildFirebaseUrl('/state'));
  const stateData = stateRes.ok ? await stateRes.json() : {};
  const state = stateData && typeof stateData === 'object' ? stateData : {};

  return {
    success: true,
    unchanged: false,
    storageConfigured: true,
    supportsSse: false,
    revision,
    connectedClients: 1,
    state
  };
}

async function applyFirebaseAction(action) {
  const stateRes = await fetch(buildFirebaseUrl(''));
  const current = (stateRes.ok ? await stateRes.json() : null) || {};
  const currentState = current.state && typeof current.state === 'object' ? current.state : {};
  const { state: nextState, mutated } = applySyncAction(currentState, action);
  let revision = Number(current.revision || 1);

  if (mutated) {
    revision += 1;
    await fetch(buildFirebaseUrl(''), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revision, state: nextState })
    });
  }

  return { success: true, storageConfigured: true, revision, connectedClients: 1 };
}

export async function readCloudState(params = {}) {
  const mode = getStorageMode();
  if (mode === 'upstash_redis') return getRedisState(params);
  if (mode === 'firebase_rtdb') return getFirebaseState(params);

  return {
    success: false,
    unchanged: false,
    storageConfigured: false,
    supportsSse: false,
    revision: 0,
    connectedClients: 1,
    state: {}
  };
}

export async function writeCloudAction(action) {
  const mode = getStorageMode();
  if (mode === 'upstash_redis') return applyRedisAction(action);
  if (mode === 'firebase_rtdb') return applyFirebaseAction(action);

  return {
    success: false,
    storageConfigured: false,
    revision: 0,
    connectedClients: 1
  };
}
