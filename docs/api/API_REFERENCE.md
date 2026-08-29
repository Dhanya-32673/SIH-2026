# AI Health Companion — API & WebSocket Reference

## Base URLs
- **REST API**: `http://localhost:4000`
- **WebSocket Gateway**: `ws://localhost:4000/health`

---

## 1. REST Endpoints

### Health Endpoints
- `GET /api/health/latest`
  - Returns the most recent physiological vitals (HR, SpO2, Temp, Activity, trends).
- `GET /api/health/history?limit=60`
  - Returns recent time series buffer of physiological readings.

### Environment Endpoints
- `GET /api/environment/latest`
  - Returns ambient temperature, humidity, AQI, PM2.5, pressure, NOAA heat index.
- `GET /api/environment/history?limit=60`
  - Returns recent atmospheric time series records.

### AI Risk Endpoints
- `GET /api/risk/current`
  - Returns calculated risk score (0-100), status, confidence, explainability reasons, recommended actions, and factor breakdown.

### Alert Endpoints
- `GET /api/alerts?limit=20`
  - Returns list of persisted warning and critical incident logs.
- `GET /api/alerts/recent`
  - Returns recent unread alerts.
- `POST /api/alerts/:id/acknowledge`
  - Marks an alert as acknowledged.

### Emergency Endpoints
- `GET /api/emergency/status`
  - Returns active emergency countdown and simulated GNSS location.
- `POST /api/emergency/respond`
  - Body: `{ "action": "SAFE" | "NEED_HELP" }`
  - Dismisses countdown or escalates simulated SOS dispatch.
- `POST /api/emergency/clear`
  - Resets emergency state.

### Demo Control Endpoints
- `GET /api/demo/current`
  - Returns active simulation scenario and disaster mode.
- `POST /api/demo/scenario`
  - Body: `{ "scenario": "NORMAL" | "HEAT_STRESS" | "POLLUTION" | "FALL" | "CRITICAL" }`
- `POST /api/demo/disaster-mode`
  - Body: `{ "mode": "NORMAL" | "HEAT_WAVE" | "POLLUTION" | "DISASTER" }`

### Telemetry History Endpoint
- `GET /api/history?limit=60`
  - Returns unified multi-stream historical points for chart rendering and CSV export.

---

## 2. WebSocket Gateway (`/health`)

### Outgoing Server Broadcasts (1 Hz)
- **Event `telemetry`**:
  ```json
  {
    "timestamp": "2026-08-29T14:35:00.000Z",
    "userId": "demo_user_anonymous",
    "scenario": "NORMAL",
    "disasterMode": "NORMAL",
    "health": {
      "heartRate": 76,
      "spo2": 98.4,
      "bodyTemperature": 36.7,
      "activity": "Normal",
      "hrTrend": "STABLE",
      "tempTrend": "STABLE",
      "spo2Trend": "STABLE"
    },
    "environment": {
      "temperature": 25.4,
      "humidity": 48,
      "pressure": 1013.2,
      "airQuality": {
        "aqi": 38,
        "pm25": 12.4,
        "status": "GOOD"
      },
      "heatIndex": 25.4
    },
    "motion": {
      "acceleration": 1.0,
      "orientation": "Standing",
      "fallDetected": false,
      "inactivityTimer": 0
    },
    "risk": {
      "status": "NORMAL",
      "riskType": "NONE",
      "riskScore": 12,
      "confidence": 94,
      "reasons": ["All monitored physiological parameters are within safe baseline ranges."],
      "recommendedActions": ["Maintain normal hydration and standard daily wellness activity."],
      "factors": { "temperatureRisk": 10, "heartRateRisk": 5, "spo2Risk": 5, "environmentRisk": 5, "activityRisk": 10, "fallRisk": 0 }
    }
  }
  ```
- **Event `alert`**: Emitted when a new warning or critical incident is logged.
- **Event `emergency`**: Emitted when countdown timer decrements or escalates.

### Incoming Client Events
- **`set_scenario`**: `{ "scenario": "HEAT_STRESS" }`
- **`set_disaster_mode`**: `{ "mode": "HEAT_WAVE" }`
- **`emergency_response`**: `{ "action": "SAFE" | "NEED_HELP" }`
- **`acknowledge_alert`**: `{ "id": "alert-..." }`
