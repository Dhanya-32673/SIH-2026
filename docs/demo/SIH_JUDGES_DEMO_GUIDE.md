# SIH Judges Live Demonstration Script & Walkthrough

This guide provides a step-by-step walkthrough for presenting the **AI-Powered Personal Health Companion** to hackathon judges.

---

## ⏱️ Step-by-Step Live Demo Flow (3–5 Minutes)

### Step 1: System Baseline & Architecture Overview (45 seconds)
1. Open the landing page (`http://localhost:5173`).
2. Highlight the headline: *"Detect health risks before they become emergencies."*
3. Interact with the **3D Wearable Bio-Core** (rotates smoothly with mouse movement).
4. Click **"Open Dashboard"** or navigate to `/dashboard`.
5. Point out the live connection badge: **`● Backend Connected`** and **1 Hz Live WebSocket Telemetry**.
6. Show that baseline vitals are nominal:
   - **Heart Rate**: ~74 BPM
   - **SpO2**: ~98.4%
   - **Core Temp**: ~36.7°C
   - **Risk Score**: ~12/100 (🟢 **NORMAL**)

---

### Step 2: Heat Wave & Thermal Strain Simulation (45 seconds)
1. Click the sticky bottom demo pill: **🔥 Heat Stress** (or open Demo Mode drawer).
2. Watch the live values smoothly ramp over seconds (Brownian convergence):
   - Ambient Temp climbs to **44.5°C**
   - Humidity rises to **78%**
   - Core Body Temp climbs to **39.4°C**
   - Heart Rate accelerates to **132 BPM**
3. Notice the UI transitions to 🟠 **WARNING** or 🔴 **CRITICAL**.
4. Scroll to the **Explainable AI Risk Engine** panel:
   - Read the explainability reason: *"Critical core body hyperthermia detected (39.4°C) combined with elevated ambient heat index (47.2°C)."*
   - Read the mitigation advice: *"Move immediately to shaded/air-conditioned environment and initiate active body cooling."*

---

### Step 3: Air Pollution Hazard Simulation (30 seconds)
1. Click the demo button: **🌫️ Pollution**.
2. Telemetry shifts:
   - Air Quality index deteriorates to **AQI 380 (HAZARDOUS)**
   - PM2.5 spikes to **220 µg/m³**
   - Blood oxygen saturation drops to **91.5%**
3. Highlight that the risk engine prioritizes **Respiratory Hazard Exposure** and recommends N95 respiratory protection.

---

### Step 4: Fall Detection & 10-Second Emergency Countdown (45 seconds)
1. Click the demo button: **🧍 Fall**.
2. Biometric IMU simulates a sudden **4.3g impact spike**, followed by an orientation flip and immobility.
3. The **🚨 Critical Emergency Modal** immediately appears with a pulsating alert:
   - 10-second countdown dial starts decrementing.
   - Shows affected physiological and motion parameters.
4. Click **"I'M SAFE (DISMISS)"**:
   - Celebratory emerald feedback triggers, dismissing the emergency countdown and logging safe confirmation.

---

### Step 5: Critical Multi-Parameter Event & Autonomous Escalation (45 seconds)
1. Click the demo button: **🚨 Critical**.
2. Multiple vital failures trigger simultaneously (HR 154 BPM, SpO2 86%, Temp 40.3°C, AQI 395).
3. Let the countdown expire (or click **"NEED IMMEDIATE HELP"**):
   - The modal smoothly switches to **"EMERGENCY DISPATCH ESCALATED (SIMULATED)"**.
   - Displays simulated GNSS satellite coordinates (**16.4419° N, 80.6222° E** - SIH Campus) and simulated ICE guardian mesh dispatch.

---

### Step 6: Privacy Center & Data Sovereignty (30 seconds)
1. Navigate to `/privacy`.
2. Emphasize:
   - **Zero PII**: No names, phones, or personal identifiers required.
   - **Edge-First**: Risk engine computes locally without cloud data exposure.
   - **Instant Purge**: Click **"Purge All Session Telemetry"** to demonstrate complete client data control.
