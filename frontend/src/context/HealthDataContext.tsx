import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  DemoScenario,
  DisasterMode,
  IAlertItem,
  IEmergencyEvent,
  ITelemetryPayload,
} from '../types/health.types';
import { socketService } from '../services/socket';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

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
  refreshData: () => Promise<void>;
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
  const { isAuthenticated } = useAuth();

  const [telemetry, setTelemetry] = useState<ITelemetryPayload>(initialTelemetry);
  const [history, setHistory] = useState<ITelemetryPayload[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<IAlertItem[]>([]);
  const [emergency, setEmergency] = useState<IEmergencyEvent | null>(null);
  const [activeScenario, setActiveScenarioState] = useState<DemoScenario>('NORMAL');
  const [disasterMode, setDisasterModeState] = useState<DisasterMode>('NORMAL');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);

  const isSocketConnectedRef = useRef(false);
  const restFailureCountRef = useRef(0);

  // Centralized REST data refresh function
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [alertRes, healthRes, envRes, riskRes, emergRes, demoRes] = await Promise.allSettled([
        apiService.getAlerts(30),
        apiService.getLatestHealth(),
        apiService.getLatestEnvironment(),
        apiService.getCurrentRisk(),
        apiService.getEmergencyStatus(),
        apiService.getDemoStatus(),
      ]);

      const isAnyRestSuccessful =
        alertRes.status === 'fulfilled' ||
        healthRes.status === 'fulfilled' ||
        envRes.status === 'fulfilled' ||
        riskRes.status === 'fulfilled' ||
        demoRes.status === 'fulfilled';

      if (isAnyRestSuccessful) {
        restFailureCountRef.current = 0;
        setIsConnected(true);
      } else {
        restFailureCountRef.current++;
        if (restFailureCountRef.current >= 3 && !isSocketConnectedRef.current) {
          setIsConnected(false);
        }
      }

      // Update Alerts from REST
      if (alertRes.status === 'fulfilled' && alertRes.value?.data) {
        setAlerts(alertRes.value.data);
      }

      // Update Emergency status
      if (emergRes.status === 'fulfilled' && emergRes.value?.data) {
        setEmergency(emergRes.value.data);
      } else if (emergRes.status === 'fulfilled' && emergRes.value?.active === false) {
        setEmergency(null);
      }

      // Update Scenario & Disaster Mode
      if (demoRes.status === 'fulfilled' && demoRes.value) {
        if (demoRes.value.scenario) setActiveScenarioState(demoRes.value.scenario);
        if (demoRes.value.disasterMode) setDisasterModeState(demoRes.value.disasterMode);
      }

      // If socket is NOT connected, compose telemetry from REST results to keep frontend lively
      if (!isSocketConnectedRef.current) {
        const latestHealth = healthRes.status === 'fulfilled' ? healthRes.value?.data : null;
        const latestEnv = envRes.status === 'fulfilled' ? envRes.value?.data : null;
        const latestRisk = riskRes.status === 'fulfilled' ? riskRes.value?.data : null;

        if (latestHealth || latestEnv || latestRisk) {
          setTelemetry((prev) => {
            const nextPayload: ITelemetryPayload = {
              ...prev,
              timestamp: new Date().toISOString(),
              health: latestHealth ? { ...prev.health, ...latestHealth } : prev.health,
              environment: latestEnv ? { ...prev.environment, ...latestEnv } : prev.environment,
              risk: latestRisk ? { ...prev.risk, ...latestRisk } : prev.risk,
            };

            setHistory((oldHist) => {
              const updated = [...oldHist, nextPayload];
              return updated.slice(-120);
            });

            return nextPayload;
          });
        }
      }
    } catch {
      restFailureCountRef.current++;
      if (restFailureCountRef.current >= 3 && !isSocketConnectedRef.current) {
        setIsConnected(false);
      }
    }
  }, [isAuthenticated]);

  // Authenticated initialization & lifecycle
  useEffect(() => {
    if (!isAuthenticated) {
      // Guest mode: provide active simulated telemetry and mark connection healthy
      socketService.disconnect();
      isSocketConnectedRef.current = false;
      setIsConnected(true);
      setEmergency(null);

      // Lightweight realistic vital variance for guest demo
      const guestInterval = setInterval(() => {
        setTelemetry((prev) => {
          const hrDelta = (Math.random() - 0.5) * 2;
          const newHr = Math.round(Math.max(65, Math.min(88, prev.health.heartRate + hrDelta)));
          const next: ITelemetryPayload = {
            ...prev,
            timestamp: new Date().toISOString(),
            health: {
              ...prev.health,
              heartRate: newHr,
              spo2: +(98 + Math.random() * 1.5).toFixed(1),
            },
          };
          setHistory((h) => [...h, next].slice(-120));
          return next;
        });
      }, 2000);

      return () => clearInterval(guestInterval);
    }

    // 1. Initial REST data load
    refreshData();

    // 2. Connect real-time WebSocket
    const socket = socketService.connect(
      (newTelemetry) => {
        setTelemetry(newTelemetry);
        setActiveScenarioState(newTelemetry.scenario);
        setDisasterModeState(newTelemetry.disasterMode);
        setHistory((prev) => {
          const updated = [...prev, newTelemetry];
          return updated.slice(-120);
        });
      },
      (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
      },
      (emerg) => {
        setEmergency(emerg);
      },
      (connected) => {
        isSocketConnectedRef.current = connected;
        if (connected) {
          setIsConnected(true);
        }
      },
    );

    // 3. Fallback polling interval: keeps data fresh if socket is delayed or in serverless REST mode
    const pollInterval = setInterval(() => {
      if (!isSocketConnectedRef.current) {
        refreshData();
      } else {
        apiService.getRecentAlerts(10).then((res) => {
          if (res?.data) {
            setAlerts((prev) => {
              const ids = new Set(res.data.map((a: any) => a.id));
              const combined = [...res.data, ...prev.filter((a) => !ids.has(a.id))];
              return combined.slice(0, 50);
            });
          }
        }).catch(() => {});
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isAuthenticated, refreshData]);

  const setScenario = useCallback(
    async (scenario: DemoScenario) => {
      setActiveScenarioState(scenario);
      socketService.setScenario(scenario);

      try {
        await apiService.setDemoScenario(scenario);
        // Immediately refresh state from backend
        setTimeout(refreshData, 200);
      } catch {
        // Socket fallback
      }
    },
    [refreshData],
  );

  const setDisasterMode = useCallback(
    async (mode: DisasterMode) => {
      setDisasterModeState(mode);
      socketService.setDisasterMode(mode);

      try {
        await apiService.setDisasterMode(mode);
        setTimeout(refreshData, 200);
      } catch {
        // Socket fallback
      }
    },
    [refreshData],
  );

  const respondEmergency = useCallback(
    async (action: 'SAFE' | 'NEED_HELP') => {
      socketService.respondEmergency(action);

      try {
        const res = await apiService.respondEmergency(action);
        if (res?.emergency) {
          setEmergency(res.emergency);
        } else if (action === 'SAFE') {
          setEmergency(null);
        }
      } catch {
        // Handled via socket
      }
    },
    [],
  );

  const acknowledgeAlert = useCallback(async (id: string) => {
    socketService.acknowledgeAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );

    try {
      await apiService.acknowledgeAlert(id);
    } catch {
      // Ok
    }
  }, []);

  const clearEmergency = useCallback(async () => {
    setEmergency(null);
    try {
      await apiService.clearEmergency();
    } catch {
      // Ok
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
        refreshData,
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
