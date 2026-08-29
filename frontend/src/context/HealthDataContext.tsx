import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  DemoScenario,
  DisasterMode,
  IAlertItem,
  IEmergencyEvent,
  ITelemetryPayload,
} from '../types/health.types';
import { socketService } from '../services/socket';
import { apiService } from '../services/api';

interface HealthContextType {
  telemetry: ITelemetryPayload | null;
  history: ITelemetryPayload[];
  isConnected: boolean;
  alerts: IAlertItem[];
  emergency: IEmergencyEvent | null;
  activeScenario: DemoScenario;
  disasterMode: DisasterMode;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
  setScenario: (scenario: DemoScenario) => Promise<void>;
  setDisasterMode: (mode: DisasterMode) => Promise<void>;
  respondEmergency: (action: 'SAFE' | 'NEED_HELP') => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  clearEmergency: () => Promise<void>;
}

const initialTelemetry: ITelemetryPayload = {
  timestamp: new Date().toISOString(),
  userId: 'demo_user_anonymous',
  scenario: 'NORMAL',
  disasterMode: 'NORMAL',
  health: {
    heartRate: 74,
    spo2: 98.4,
    bodyTemperature: 36.7,
    activity: 'Normal',
    hrTrend: 'STABLE',
    tempTrend: 'STABLE',
    spo2Trend: 'STABLE',
  },
  environment: {
    temperature: 25.2,
    humidity: 48,
    pressure: 1013.2,
    airQuality: {
      aqi: 36,
      pm25: 11.8,
      status: 'GOOD',
    },
    heatIndex: 25.2,
  },
  motion: {
    acceleration: 1.0,
    orientation: 'Standing',
    fallDetected: false,
    inactivityTimer: 0,
  },
  risk: {
    status: 'NORMAL',
    riskType: 'NONE',
    riskScore: 12,
    confidence: 94,
    reasons: ['All monitored physiological and environmental parameters are within safe baseline ranges.'],
    recommendedActions: ['Maintain normal hydration and standard daily wellness activity.'],
    factors: {
      temperatureRisk: 10,
      heartRateRisk: 5,
      spo2Risk: 5,
      environmentRisk: 5,
      activityRisk: 10,
      fallRisk: 0,
    },
    disclaimer: 'Prototype Risk Indicator — Strictly non-diagnostic health monitoring assistance.',
    evaluatedAt: new Date().toISOString(),
  },
  batteryLevel: 94,
  deviceStatus: 'ONLINE',
};

const HealthDataContext = createContext<HealthContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<ITelemetryPayload>(initialTelemetry);
  const [history, setHistory] = useState<ITelemetryPayload[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<IAlertItem[]>([]);
  const [emergency, setEmergency] = useState<IEmergencyEvent | null>(null);
  const [activeScenario, setActiveScenarioState] = useState<DemoScenario>('NORMAL');
  const [disasterMode, setDisasterModeState] = useState<DisasterMode>('NORMAL');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);

  // Load initial alerts from REST
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const alertRes = await apiService.getAlerts(20);
        if (alertRes?.data) {
          setAlerts(alertRes.data);
        }
      } catch (e) {
        // quiet fallback
      }
    };
    fetchInitialData();
  }, []);

  // Connect to real-time WebSocket
  useEffect(() => {
    const socket = socketService.connect(
      (newTelemetry) => {
        setTelemetry(newTelemetry);
        setActiveScenarioState(newTelemetry.scenario);
        setDisasterModeState(newTelemetry.disasterMode);
        setHistory((prev) => {
          const updated = [...prev, newTelemetry];
          return updated.slice(-120); // Keep last 120 points
        });
      },
      (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
      },
      (emerg) => {
        setEmergency(emerg);
      },
      (connected) => {
        setIsConnected(connected);
      },
    );

    return () => {
      // Don't disconnect on simple re-renders
    };
  }, []);

  const setScenario = useCallback(async (scenario: DemoScenario) => {
    setActiveScenarioState(scenario);
    // Send via socket and REST for maximum reliability
    socketService.setScenario(scenario);
    try {
      await apiService.setDemoScenario(scenario);
    } catch (e) {
      // socket fallback handles it
    }
  }, []);

  const setDisasterMode = useCallback(async (mode: DisasterMode) => {
    setDisasterModeState(mode);
    socketService.setDisasterMode(mode);
    try {
      await apiService.setDisasterMode(mode);
    } catch (e) {
      // socket fallback handles it
    }
  }, []);

  const respondEmergency = useCallback(async (action: 'SAFE' | 'NEED_HELP') => {
    socketService.respondEmergency(action);
    try {
      const res = await apiService.respondEmergency(action);
      if (res?.emergency) {
        setEmergency(res.emergency);
      }
    } catch (e) {
      // handled via socket event
    }
  }, []);

  const acknowledgeAlert = useCallback(async (id: string) => {
    socketService.acknowledgeAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
    try {
      await apiService.acknowledgeAlert(id);
    } catch (e) {
      // ok
    }
  }, []);

  const clearEmergency = useCallback(async () => {
    setEmergency(null);
    try {
      await apiService.clearEmergency();
    } catch (e) {
      // ok
    }
  }, []);

  return (
    <HealthDataContext.Provider
      value={{
        telemetry,
        history,
        isConnected,
        alerts,
        emergency,
        activeScenario,
        disasterMode,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        setScenario,
        setDisasterMode,
        respondEmergency,
        acknowledgeAlert,
        clearEmergency,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
