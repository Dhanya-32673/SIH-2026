# AI-Powered Personal Health Companion
> **Smart India Hackathon (SIH 2026) Prototype**  
> *Privacy-Focused Edge AI Health Monitoring, Early-Warning, and Disaster Resilience Platform*

---

## 🌟 Executive Overview
The **AI-Powered Personal Health Companion** is an end-to-end full-stack prototype designed to provide continuous biometric surveillance, environmental hazard detection, and autonomous early-warning for extreme disaster conditions such as **heat waves, severe air pollution, flood emergencies, and sudden falls**.

For this phase, all sensors (PPG Heart Rate, SpO2, Core Body Temperature, IMU Motion, Ambient Temp, Relative Humidity, Barometric Pressure, and AQI/PM2.5) are generated through a realistic, non-random **Physics & Physiological Simulation Service** in the backend.

The system features:
- **1 Hz Real-Time Streaming**: Continuous WebSocket stream connecting the NestJS backend to a React dashboard.
- **Explainable AI Risk Engine**: Multi-factor mathematical scoring with natural language reasoning and actionable mitigation advice.
- **Interactive 3D Wearable Bio-Core**: High-performance Three.js / WebGL visualization dynamically reacting to physiological states.
- **4 Disaster-Adaptive Modes**: Normal Monitoring, Heat Wave, Pollution, and Extreme Disaster.
- **Autonomous Emergency Escalation**: 10-second countdown with *"I'm Safe"* dismissal and simulated SOS dispatch beacon.
- **Privacy by Design**: Zero PII required, edge processing architecture, and instant client data purge.
- **Drop-In Hardware Readiness**: Decoupled normalizer layer allowing seamless integration with ESP32/MQTT microcontrollers without rewriting the frontend.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, Socket.IO Client, Axios |
| **3D Visualization** | Three.js / WebGL, Spline Runtime compatibility, Procedural Bio-Pulse Orbit |
| **Backend** | NestJS 10, TypeScript, Socket.IO Gateway, Mongoose, class-validator, RxJS |
| **Database** | MongoDB / Mongoose (with Docker Compose & In-Memory Resilient Fallback) |
| **Architecture** | Edge-first telemetry pipeline, explainable AI rule engine, swappable TinyML interface |

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │      SIMULATED WEARABLE & ATMOSPHERE         │
                    │   (Continuous Brownian Physics - 1 Hz)       │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         NESTJS BACKEND ARCHITECTURE          │
                    │  ┌────────────────────────────────────────┐  │
                    │  │ SensorSimulatorService                 │  │
                    │  ├────────────────────────────────────────┤  │
                    │  │ Explainable RiskEngineService          │  │
                    │  ├────────────────────────────────────────┤  │
                    │  │ AlertsService & EmergencyService       │  │
                    │  ├────────────────────────────────────────┤  │
                    │  │ Socket.IO Gateway (/health)            │  │
                    │  ├────────────────────────────────────────┤  │
                    │  │ MongoDB / Mongoose Persistence Layer   │  │
                    │  └────────────────────────────────────────┘  │
                    └──────────────────────┬───────────────────────┘
                                           │ WebSocket (1 Hz) + REST
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         REACT TYPESCRIPT DASHBOARD           │
                    │  - Interactive 3D Wearable Bio-Core Scene    │
                    │  - Real-Time Recharts Telemetry Streams      │
                    │  - Explainable AI Reasoning Panel ("WHY?")   │
                    │  - 4 Adaptive Disaster Mode Selectors        │
                    │  - 10-Second Crisis Escalation Modal         │
                    │  - SIH 1-Click Demo Launcher Drawer          │
                    │  - Privacy By Design & Data Purge Hub        │
                    └──────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v25)
- **npm**: v9+
- *(Optional)* **Docker** (for local MongoDB container)

### 1. Installation
Install dependencies across the monorepo:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment Variables
Create `.env` in the root directory (or copy from `.env.example`):
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/sih_health_companion
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

### 3. Launching the Application
You can run both backend and frontend concurrently:
```bash
# From root directory:
npm run dev
```

Or run them in separate terminal windows:
```bash
# Terminal 1: Backend (NestJS)
cd backend
npm run start:dev

# Terminal 2: Frontend (Vite + React)
cd frontend
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:4000`
- **Backend WebSocket**: `ws://localhost:4000/health`

---

## 🧪 Running Automated Tests

Run backend unit tests for the Risk Engine, Sensor Simulator, and Scenarios:
```bash
cd backend
npm test
```

---

## 🎯 SIH Live Demonstration Scenarios

The frontend includes a **Sticky Demo Bar** and a **Demo Hub Modal** for hackathon judges:

| Scenario | Physiological & Environmental Profile | System Reaction |
| :--- | :--- | :--- |
| 🟢 **NORMAL** | HR 74 BPM, SpO2 98.5%, Temp 36.7°C, AQI 35 | Status: `NORMAL`, Risk: ~12/100, calm emerald 3D rotation |
| 🔥 **HEAT STRESS** | Env 44.5°C, Humidity 78%, Body Temp 39.4°C, HR 132 | Status: `CRITICAL`, Thermal strain alert, active cooling advice |
| 🌫️ **POLLUTION** | AQI 380 (Hazardous), PM2.5 220 µg/m³, SpO2 91.5% | Status: `WARNING`, Respiratory alert, N95 mask recommendation |
| 🧍 **FALL** | 4.3g impact shock, orientation drop, immobility | Status: `CRITICAL`, Triggers 10s emergency countdown modal |
| 🚨 **CRITICAL** | Multiple simultaneous vital failures (HR 154, SpO2 86%) | Full crisis modal, automated SOS dispatch escalation |

---

## 🔒 Privacy by Design
1. **Zero PII**: No names, emails, phone numbers, or government IDs stored.
2. **Edge Processing**: Risk assessments computed locally.
3. **Data Minimization**: Raw high-frequency sensor noise discarded; only aggregate trends persisted.
4. **User Sovereignty**: User can purge all telemetry buffers with 1 click in `/privacy`.

---

## 📚 Detailed Documentation
- [System Architecture](file:///Users/akhilbulusu/Documents/KLU/Hackthons/SIH-2026/PHASE-1/docs/architecture/ARCHITECTURE.md)
- [Future ESP32 & MQTT Hardware Integration](file:///Users/akhilbulusu/Documents/KLU/Hackthons/SIH-2026/PHASE-1/docs/architecture/FUTURE_HARDWARE_MQTT.md)
- [Future TinyML Integration Guide](file:///Users/akhilbulusu/Documents/KLU/Hackthons/SIH-2026/PHASE-1/docs/architecture/FUTURE_TINYML_INTEGRATION.md)
- [API & WebSocket Reference](file:///Users/akhilbulusu/Documents/KLU/Hackthons/SIH-2026/PHASE-1/docs/api/API_REFERENCE.md)
- [SIH Judges Live Demo Script](file:///Users/akhilbulusu/Documents/KLU/Hackthons/SIH-2026/PHASE-1/docs/demo/SIH_JUDGES_DEMO_GUIDE.md)

---

## ⚖️ Non-Diagnostic Medical Disclaimer
*This project is an engineering and AI research prototype developed for SIH 2026. All risk indicators and early-warning alerts are strictly non-diagnostic decision-support signals. The system does not contact real emergency services.*

# SIH-2026
