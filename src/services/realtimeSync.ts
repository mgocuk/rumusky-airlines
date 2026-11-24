// Real-time synchronization service using SSE (local Vite server), BroadcastChannel, and revision-checked polling (Vercel cloud & fallback)
export interface SyncAction {
  id: string;
  type: string;
  payload: any;
  originClientId: string;
  timestamp: string;
}

export interface NetworkInfo {
  ip: string;
  port: number;
  url: string;
  connectedClients: number;
  hasServerState: boolean;
  supportsSse?: boolean;
  storageConfigured?: boolean;
  storageMode?: string;
  revision?: number;
  timestamp: string;
}

// Generate or retrieve persistent client ID per browser session
function getClientId(): string {
  try {
    let id = sessionStorage.getItem('rumusky_client_id');
    if (!id) {
      id = `cli-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('rumusky_client_id', id);
    }
    return id;
  } catch (e) {
    return `cli-${Date.now().toString(36)}`;
  }
}

class RealtimeSyncManager {
  private clientId: string;
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners = new Set<(action: SyncAction) => void>();
  private processedActionIds = new Set<string>();
  private isConnected = false;
  private isStorageConfigured = true;
  private supportsSse = false;
  private connectedClientsCount = 1;
  private connectionListeners = new Set<(connected: boolean, count: number, storageConfigured: boolean) => void>();
  private stateSyncListeners = new Set<(state: Record<string, any>) => void>();
  private lastServerRevision: number | null = null;
  private hasOpenedOnce = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;
  private resilienceInitialized = false;

  constructor() {
    this.clientId = getClientId();
    this.initBroadcastChannel();
    void this.bootstrapTransport();
  }

  public getMyClientId(): string {
    return this.clientId;
  }

  public getConnectedClientsCount(): number {
    return this.connectedClientsCount;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getIsStorageConfigured(): boolean {
    return this.isStorageConfigured;
  }

  // Cross-tab broadcast within same browser
  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('rumusky_sync_channel');
        this.broadcastChannel.onmessage = (event) => {
          if (event && event.data && event.data.type) {
            this.handleIncomingAction(event.data);
          }
        };
      } catch (e) {
        console.warn('[Sync] BroadcastChannel not supported in this environment');
      }
    }
  }

  // Detect whether backend supports SSE (local Vite server) or polling (Vercel serverless)
  private async bootstrapTransport() {
    if (typeof window === 'undefined') return;

    const info = await this.fetchNetworkInfo();
    if (!info) {
      this.isConnected = false;
      this.isStorageConfigured = false;
      this.notifyConnectionState();
      return;
    }

    this.supportsSse = Boolean(info.supportsSse);
    this.isStorageConfigured = info.storageConfigured !== false;
    if (typeof info.connectedClients === 'number') {
      this.connectedClientsCount = Math.max(1, info.connectedClients);
    }

    if (this.supportsSse) {
      this.initEventSource();
      this.initResilienceSync(3000);
    } else if (this.isStorageConfigured) {
      this.isConnected = true;
      this.notifyConnectionState();
      this.initResilienceSync(2500);
    } else {
      this.isConnected = false;
      this.notifyConnectionState();
    }
  }

  // Cross-device and cross-browser SSE stream (local server)
  private initEventSource() {
    if (typeof window === 'undefined' || !('EventSource' in window) || this.eventSource) return;

    try {
      this.eventSource = new EventSource('/api/events');

      this.eventSource.onopen = () => {
        const isReconnect = this.hasOpenedOnce;
        this.hasOpenedOnce = true;
        this.isConnected = true;
        this.notifyConnectionState();

        if (isReconnect) {
          void this.syncFromServerIfChanged();
        }
      };

      this.eventSource.onmessage = (event) => {
        if (!event.data) return;
        try {
          const action: SyncAction = JSON.parse(event.data);
          if (action.type === 'CONNECTED' || action.type === 'CLIENTS_COUNT_UPDATED') {
            if (action.payload?.connectedClients !== undefined) {
              this.connectedClientsCount = Math.max(1, action.payload.connectedClients);
              this.notifyConnectionState();
            }
            if (
              action.type === 'CONNECTED' &&
              action.payload?.revision !== undefined &&
              this.lastServerRevision !== null &&
              action.payload.revision !== this.lastServerRevision
            ) {
              void this.syncFromServerIfChanged();
            }
            return;
          }
          this.handleIncomingAction(action);
        } catch (e) {
          // ignore heartbeat / ping
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.notifyConnectionState();
      };
    } catch (e) {
      console.warn('[Sync] Could not initialize EventSource:', e);
    }
  }

  // Polling & visibility/focus reconciliation so bookings from other devices always appear
  private initResilienceSync(intervalMs: number) {
    if (typeof window === 'undefined' || typeof document === 'undefined' || this.resilienceInitialized) return;
    this.resilienceInitialized = true;

    const triggerSync = () => {
      if (document.visibilityState === 'visible' && this.isStorageConfigured) {
        void this.syncFromServerIfChanged();
      }
    };

    document.addEventListener('visibilitychange', triggerSync);
    window.addEventListener('focus', triggerSync);
    window.addEventListener('online', triggerSync);

    this.pollTimer = setInterval(() => {
      if (document.visibilityState === 'visible' && this.isStorageConfigured) {
        void this.syncFromServerIfChanged();
      }
    }, intervalMs);
  }

  private notifyConnectionState() {
    for (const listener of this.connectionListeners) {
      try {
        listener(this.isConnected, this.connectedClientsCount, this.isStorageConfigured);
      } catch (e) {
        // ignore
      }
    }
  }

  public onConnectionChange(
    listener: (connected: boolean, count: number, storageConfigured: boolean) => void
  ): () => void {
    this.connectionListeners.add(listener);
    listener(this.isConnected, this.connectedClientsCount, this.isStorageConfigured);
    return () => this.connectionListeners.delete(listener);
  }

  public onStateRefresh(listener: (state: Record<string, any>) => void): () => void {
    this.stateSyncListeners.add(listener);
    return () => this.stateSyncListeners.delete(listener);
  }

  private handleIncomingAction(action: SyncAction) {
    if (!action || !action.id) return;

    if (action.originClientId === this.clientId) return;

    if (this.processedActionIds.has(action.id)) return;
    this.processedActionIds.add(action.id);
    if (this.processedActionIds.size > 200) {
      const oldest = Array.from(this.processedActionIds).slice(0, 50);
      oldest.forEach((id) => this.processedActionIds.delete(id));
    }

    for (const listener of this.listeners) {
      try {
        listener(action);
      } catch (err) {
        console.error('[Sync] Error in sync listener:', err);
      }
    }
  }

  public subscribe(listener: (action: SyncAction) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async dispatchAction(type: string, payload: any): Promise<void> {
    const action: SyncAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      originClientId: this.clientId,
      timestamp: new Date().toISOString()
    };

    this.processedActionIds.add(action.id);

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(action);
      } catch (e) {
        // ignore
      }
    }

    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
        keepalive: true
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (typeof data.storageConfigured === 'boolean') {
          this.isStorageConfigured = data.storageConfigured;
        }
        if (typeof data.revision === 'number') {
          this.lastServerRevision = data.revision;
        }
      }
    } catch (err) {
      console.warn('[Sync] Could not post action to /api/action:', err);
    }
  }

  public async syncFromServerIfChanged(): Promise<Record<string, any> | null> {
    if (this.isSyncing) return null;
    this.isSyncing = true;
    try {
      const params = new URLSearchParams();
      if (this.lastServerRevision !== null) {
        params.set('rev', String(this.lastServerRevision));
      }
      params.set('clientId', this.clientId);
      const res = await fetch(`/api/state?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        return null;
      }
      const data = await res.json();
      if (typeof data.storageConfigured === 'boolean') {
        const changedCfg = data.storageConfigured !== this.isStorageConfigured;
        this.isStorageConfigured = data.storageConfigured;
        if (!data.storageConfigured) {
          this.isConnected = false;
        } else if (!this.supportsSse) {
          this.isConnected = true;
        }
        if (changedCfg) this.notifyConnectionState();
      }
      if (typeof data.connectedClients === 'number') {
        const nextCount = Math.max(1, data.connectedClients);
        if (nextCount !== this.connectedClientsCount) {
          this.connectedClientsCount = nextCount;
          this.notifyConnectionState();
        }
      }
      if (typeof data.revision === 'number') {
        this.lastServerRevision = data.revision;
      }
      if (!data.success || data.unchanged || !data.state || Object.keys(data.state).length === 0) {
        return null;
      }
      for (const listener of this.stateSyncListeners) {
        try {
          listener(data.state);
        } catch (e) {
          // ignore
        }
      }
      return data.state;
    } catch (e) {
      return null;
    } finally {
      this.isSyncing = false;
    }
  }

  public async fetchServerState(): Promise<{ state: Record<string, any> | null; storageConfigured: boolean }> {
    try {
      const params = new URLSearchParams({ clientId: this.clientId });
      const res = await fetch(`/api/state?${params.toString()}`, { cache: 'no-store' });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        const configured = data.storageConfigured !== false;
        this.isStorageConfigured = configured;
        if (typeof data.revision === 'number') {
          this.lastServerRevision = data.revision;
        }
        if (typeof data.connectedClients === 'number') {
          this.connectedClientsCount = Math.max(1, data.connectedClients);
        }
        this.notifyConnectionState();
        return {
          state: data.state && Object.keys(data.state).length > 0 ? data.state : null,
          storageConfigured: configured
        };
      }
    } catch (e) {
      // offline or error
    }
    return { state: null, storageConfigured: false };
  }

  public async fetchNetworkInfo(): Promise<NetworkInfo | null> {
    try {
      const res = await fetch('/api/network-info', { cache: 'no-store' });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // offline
    }
    return null;
  }

  public async initializeServerStateIfEmpty(state: Record<string, any>): Promise<void> {
    if (!this.isStorageConfigured) return;
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `init-${Date.now()}`,
          type: 'INIT_STATE',
          payload: { state, force: false },
          originClientId: this.clientId,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (typeof data.revision === 'number') {
          this.lastServerRevision = data.revision;
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

export const realtimeSync = new RealtimeSyncManager();
