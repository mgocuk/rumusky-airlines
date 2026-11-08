// Real-time synchronization service using SSE (Server-Sent Events) and BroadcastChannel
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
  private connectedClientsCount = 1;
  private connectionListeners = new Set<(connected: boolean, count: number) => void>();

  constructor() {
    this.clientId = getClientId();
    this.initBroadcastChannel();
    this.initEventSource();
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

  // Cross-device and cross-browser SSE stream
  private initEventSource() {
    if (typeof window === 'undefined' || !('EventSource' in window)) return;

    try {
      this.eventSource = new EventSource('/api/events');

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.notifyConnectionState();
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

  private notifyConnectionState() {
    for (const listener of this.connectionListeners) {
      try {
        listener(this.isConnected, this.connectedClientsCount);
      } catch (e) {
        // ignore
      }
    }
  }

  public onConnectionChange(listener: (connected: boolean, count: number) => void): () => void {
    this.connectionListeners.add(listener);
    listener(this.isConnected, this.connectedClientsCount);
    return () => this.connectionListeners.delete(listener);
  }

  private handleIncomingAction(action: SyncAction) {
    if (!action || !action.id) return;

    // Ignore if sent by ourselves
    if (action.originClientId === this.clientId) return;

    // Deduplicate
    if (this.processedActionIds.has(action.id)) return;
    this.processedActionIds.add(action.id);
    if (this.processedActionIds.size > 200) {
      const oldest = Array.from(this.processedActionIds).slice(0, 50);
      oldest.forEach((id) => this.processedActionIds.delete(id));
    }

    // Notify all active React listeners
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

    // Mark as processed locally
    this.processedActionIds.add(action.id);

    // 1. Broadcast to local tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(action);
      } catch (e) {
        // ignore
      }
    }

    // 2. Dispatch to server over HTTP
    try {
      await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
    } catch (err) {
      console.warn('[Sync] Could not post action to /api/action:', err);
    }
  }

  public async fetchServerState(): Promise<Record<string, any> | null> {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        return data.state && Object.keys(data.state).length > 0 ? data.state : null;
      }
    } catch (e) {
      // offline or error
    }
    return null;
  }

  public async fetchNetworkInfo(): Promise<NetworkInfo | null> {
    try {
      const res = await fetch('/api/network-info');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // offline
    }
    return null;
  }

  public async initializeServerStateIfEmpty(state: Record<string, any>): Promise<void> {
    try {
      await fetch('/api/action', {
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
    } catch (e) {
      // ignore
    }
  }
}

export const realtimeSync = new RealtimeSyncManager();
