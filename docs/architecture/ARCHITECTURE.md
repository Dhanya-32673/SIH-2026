# AI-Powered Personal Health Companion — System Architecture

## 1. High-Level System Architecture

```
                  ┌───────────────────────────────────────────────┐
                  │          CONTINUOUS SENSOR SOURCE             │
                  │   ┌───────────────────┐ ┌───────────────────┐ │
                  │   │ Sensor Simulator  │ │ ESP32 / MQTT Hub  │ │
                  │   │ (Brownian Physics)│ │ (Future Hardware) │ │
                  │   └─────────┬─────────┘ └─────────┬─────────┘ │
                  └─────────────┼─────────────────────┼───────────┘
                                └──────────┬──────────┘
                                           ▼
                  ┌───────────────────────────────────────────────┐
                  │          DATA NORMALIZATION LAYER             │
                  │       (Standardized Telemetry Schema)         │
                  └────────────────────────┬──────────────────────┘
                                           ▼
                  ┌───────────────────────────────────────────────┐
                  │          EXPLAINABLE AI RISK ENGINE           │
                  │  - Multi-Factor Biometric & Hazard Scoring    │
                  │  - Adaptive Weighting per Disaster Mode       │
                  │  - Natural Language Explainability Synthesis  │
                  └────────────────────────┬──────────────────────┘
                                           ▼
                  ┌───────────────────────────────────────────────┐
                  │       ALERTS & EMERGENCY STATE MACHINE        │
                  │  - Deduplicated Warning/Critical Events       │
                  │  - 10s Autonomous Escalation Countdown        │
                  └────────────────────────┬──────────────────────┘
                                           ▼
               ┌───────────────────────────┴───────────────────────────┐
               ▼                                                       ▼
┌───────────────────────────────┐                       ┌───────────────────────────────┐
│     MONGODB PERSISTENCE       │                       │    SOCKET.IO WEBSOCKET GATEWAY │
│ - Health Readings             │                       │ - /health Namespace           │
│ - Environmental Telemetry     │                       │ - 1 Hz Live Telemetry Stream  │
│ - Risk Assessments            │                       │ - Instant Scenario Control    │
│ - Incident Logs & Alerts      │                       │ - Emergency Broadcast Channel │
└───────────────────────────────┘                       └──────────────┬────────────────┘
                                                                       │
                                                                       ▼
                                                        ┌───────────────────────────────┐
                                                        │    REACT TYPESCRIPT FRONTEND  │
                                                        │ - 3D Interactive Bio-Core HUD │
                                                        │ - Real-Time Recharts Stream   │
                                                        │ - Explainable Risk Breakdown  │
                                                        │ - SIH Demo Launcher Drawer    │
                                                        │ - Privacy By Design Center    │
                                                        └───────────────────────────────┘
```

---

## 2. Core Modules Breakdown

### 2.1 Backend (NestJS + TypeScript)
- **`SensorSimulatorService`**: Simulates realistic physiological dynamics (Heart Rate, SpO2, Body Temp, Activity, IMU Acceleration, Inactivity timer) and atmospheric conditions (Ambient Temp, Relative Humidity, Barometric Pressure, AQI, PM2.5, NOAA Heat Index) at a consistent 1 Hz tick rate.
- **`RiskEngineService`**: Multi-stream mathematical analyzer that computes sub-risk vectors ($\text{Strain}_{\text{temp}}$, $\text{Workload}_{\text{hr}}$, $\text{Hypoxia}_{\text{spo2}}$, $\text{Hazard}_{\text{env}}$, $\text{Inertia}_{\text{fall}}$), applies operational mode weightings, and outputs human-readable explainable reasoning alongside clear mitigation recommendations.
- **`AlertsService`**: Stateful deduplication service that records significant risk transitions, persists incident records to MongoDB, and broadcasts instant alert events.
- **`EmergencyService`**: Manages the crisis state machine (`DETECTED` $\rightarrow$ `COUNTDOWN` $\rightarrow$ `SAFE` or `ESCALATED`), handles simulated emergency escalation, and formats mock GNSS beacon coordinates.
- **`HealthGateway`**: Socket.IO gateway on `/health` namespace streaming real-time JSON payloads to connected web dashboards.

### 2.2 Frontend (React + TypeScript + Vite + Tailwind + Framer Motion + Recharts)
- **Real-Time Data Layer**: `HealthDataContext` connects to WebSocket and REST fallbacks, maintaining a rolling 120-point buffer for real-time charting.
- **Interactive 3D Bio-Core**: High-performance Three.js / WebGL visualization with an orbiting pulse ring and particle cloud that dynamically shifts speed, illumination, and color between `NORMAL`, `WARNING`, and `CRITICAL` states.
- **Adaptive Disaster Modes**: Dynamic UI layout adjustment for 4 modes: Normal Monitoring, Heat Wave, Pollution, and Extreme Disaster.
- **SIH Live Demo Drawer**: 1-click trigger interface for testing all 5 simulated health and disaster scenarios in real time.
