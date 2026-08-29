# Future Hardware Integration Architecture (ESP32 & MQTT)

## 1. Overview
In the initial hackathon phase, all physiological and environmental sensors are realistically modeled via software simulation (`SensorSimulatorService`).

The backend was architected with a decoupled **Sensor Normalizer Layer** so that physical hardware (ESP32 microcontroller + physical I2C/SPI sensor modules) can be plugged in without requiring any frontend or risk engine rewrites.

---

## 2. Drop-In Hardware Architecture

```
                               ┌────────────────────────────────┐
                               │   ESP32 WEARABLE EMBEDDED NODE │
                               │  - MAX30102 (PPG / SpO2 / HR)  │
                               │  - MAX30205 (Core Body Temp)   │
                               │  - MPU6050  (6-DOF Accelerom.) │
                               │  - BME680   (Gas / AQI / Temp) │
                               └───────────────┬────────────────┘
                                               │
                                               │ MQTT over TLS 1.3 / Wi-Fi / LoRaWAN
                                               ▼
                               ┌────────────────────────────────┐
                               │      MQTT BROKER (EMQX/Mosq.)  │
                               │ Topic: sih/devices/{id}/stream │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   NESTJS MQTT INGESTION BRIDGE │
                               │    (Implements IDataNormalizer)│
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   EXPLAINABLE AI RISK ENGINE   │
                               │   (Identical analysis logic)   │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │       REACT DASHBOARD / UI     │
                               │   (Zero changes required)      │
                               └────────────────────────────────┘
```

---

## 3. Standardized Telemetry Schema
The hardware payload maps 1:1 with our current simulation interface:

```json
{
  "deviceId": "sih-wearable-node-01",
  "timestamp": 1772348900000,
  "health": {
    "heartRate": 82,
    "spo2": 98.2,
    "bodyTemperature": 36.8,
    "activity": "Normal"
  },
  "environment": {
    "temperature": 26.4,
    "humidity": 52.0,
    "pressure": 1012.8,
    "airQuality": {
      "aqi": 42,
      "pm25": 14.5,
      "status": "GOOD"
    }
  },
  "motion": {
    "accelX": 0.02,
    "accelY": 0.04,
    "accelZ": 0.98,
    "fallDetected": false
  }
}
```
