import { io, Socket } from 'socket.io-client';
import {
  DemoScenario,
  DisasterMode,
  IAlertItem,
  IEmergencyEvent,
  ITelemetryPayload,
} from '../types/health.types';

const rawWsUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';
const WS_BASE_URL = rawWsUrl.replace(/\/+$/, '');

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  public connect(
    onTelemetry: (payload: ITelemetryPayload) => void,
    onAlert?: (alert: IAlertItem) => void,
    onEmergency?: (emergency: IEmergencyEvent | null) => void,
    onStatusChange?: (connected: boolean) => void,
  ): Socket {
    if (this.socket) {
      return this.socket;
    }

    const token = localStorage.getItem('sih_health_token');

    this.socket = io(`${WS_BASE_URL}/health`, {
      transports: ['websocket', 'polling'],
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 8000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      if (onStatusChange) onStatusChange(true);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      if (onStatusChange) onStatusChange(false);
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
      if (onStatusChange) onStatusChange(false);
    });

    this.socket.on('telemetry', (data: ITelemetryPayload) => {
      if (onTelemetry) onTelemetry(data);
    });

    this.socket.on('alert', (alert: IAlertItem) => {
      if (onAlert) onAlert(alert);
    });

    this.socket.on('emergency', (emergency: IEmergencyEvent | null) => {
      if (onEmergency) onEmergency(emergency);
    });

    return this.socket;
  }

  public setScenario(scenario: DemoScenario) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('set_scenario', { scenario });
    }
  }

  public setDisasterMode(mode: DisasterMode) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('set_disaster_mode', { mode });
    }
  }

  public respondEmergency(action: 'SAFE' | 'NEED_HELP') {
    if (this.socket && this.socket.connected) {
      this.socket.emit('emergency_response', { action });
    }
  }

  public acknowledgeAlert(id: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('acknowledge_alert', { id });
    }
  }

  public getConnected(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketService = new SocketService();
