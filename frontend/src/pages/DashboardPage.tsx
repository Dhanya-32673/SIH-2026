import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { HealthStatusCard } from '../components/dashboard/HealthStatusCard';
import { MetricCard } from '../components/dashboard/MetricCard';
import { EnvironmentGrid } from '../components/dashboard/EnvironmentGrid';
import { RealtimeTelemetryChart } from '../components/dashboard/RealtimeTelemetryChart';
import { RiskAnalysisPanel } from '../components/dashboard/RiskAnalysisPanel';
import { AlertTimeline } from '../components/dashboard/AlertTimeline';
import { DisasterModeSelector } from '../components/dashboard/DisasterModeSelector';
import { DemoControlBar } from '../components/dashboard/DemoControlBar';
import { WearableVisualizer3D } from '../components/3d/WearableVisualizer3D';
import {
  Heart,
  Activity,
  Thermometer,
  Zap,
  Sparkles,
  Radio,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const {
    telemetry,
    history,
    alerts,
    activeScenario,
    disasterMode,
    setScenario,
    setDisasterMode,
    acknowledgeAlert,
  } = useHealthData();

  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);

  if (!telemetry) return null;

  // Extract sparkline arrays for metric cards
  const hrSparkline = history.slice(-20).map((h) => h.health.heartRate);
  const spo2Sparkline = history.slice(-20).map((h) => h.health.spo2);
  const tempSparkline = history.slice(-20).map((h) => h.health.bodyTemperature);

  // Status mapping
  const hrStatus: 'NORMAL' | 'WARNING' | 'CRITICAL' =
    telemetry.health.heartRate > 130 || telemetry.health.heartRate < 45
      ? 'CRITICAL'
      : telemetry.health.heartRate > 105
        ? 'WARNING'
        : 'NORMAL';

  const spo2Status: 'NORMAL' | 'WARNING' | 'CRITICAL' =
    telemetry.health.spo2 <= 88
      ? 'CRITICAL'
      : telemetry.health.spo2 <= 93.5
        ? 'WARNING'
        : 'NORMAL';

  const tempStatus: 'NORMAL' | 'WARNING' | 'CRITICAL' =
    telemetry.health.bodyTemperature >= 39.2
      ? 'CRITICAL'
      : telemetry.health.bodyTemperature >= 38.0
        ? 'WARNING'
        : 'NORMAL';

  const activityStatus: 'NORMAL' | 'WARNING' | 'CRITICAL' =
    telemetry.motion.fallDetected
      ? 'CRITICAL'
      : telemetry.health.activity === 'High' && telemetry.environment.temperature > 38
        ? 'WARNING'
        : 'NORMAL';

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* 1. Health Status Hero Card */}
      <HealthStatusCard
        risk={telemetry.risk}
        lastUpdated={telemetry.timestamp}
        scenario={activeScenario}
      />

      {/* 2. Top Level Physiological Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <MetricCard
          title="Heart Rate (PPG)"
          value={telemetry.health.heartRate}
          unit="BPM"
          trend={telemetry.health.hrTrend}
          trendText={`${telemetry.health.hrTrend.toLowerCase()} rhythm`}
          status={hrStatus}
          icon={Heart}
          iconColor="text-red-400"
          iconBg="bg-red-500/10"
          sparklineData={hrSparkline.length > 1 ? hrSparkline : [74, 76, 75, 76]}
          subtitle="Baseline: 65-85 BPM"
        />

        {/* SpO2 */}
        <MetricCard
          title="SpO2 Oxygen Saturation"
          value={telemetry.health.spo2}
          unit="%"
          trend={telemetry.health.spo2Trend}
          trendText={`${telemetry.health.spo2Trend.toLowerCase()} level`}
          status={spo2Status}
          icon={Activity}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          sparklineData={spo2Sparkline.length > 1 ? spo2Sparkline : [98, 98.2, 98.5]}
          subtitle="Target: ≥ 95%"
        />

        {/* Body Temperature */}
        <MetricCard
          title="Core Body Temp"
          value={telemetry.health.bodyTemperature}
          unit="°C"
          trend={telemetry.health.tempTrend}
          trendText={`${telemetry.health.tempTrend.toLowerCase()} thermal`}
          status={tempStatus}
          icon={Thermometer}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          sparklineData={tempSparkline.length > 1 ? tempSparkline : [36.7, 36.8, 36.7]}
          subtitle="Normal: 36.5 - 37.5°C"
        />

        {/* Activity & Inertial Motion */}
        <MetricCard
          title="Activity & Inertia"
          value={telemetry.motion.fallDetected ? 'FALL DETECTED' : telemetry.health.activity}
          unit={telemetry.motion.fallDetected ? '4.3g' : `${telemetry.motion.acceleration}g`}
          trend="STABLE"
          trendText={telemetry.motion.orientation}
          status={activityStatus}
          icon={Zap}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          sparklineData={[1.0, 1.05, 1.0, telemetry.motion.acceleration]}
          subtitle={telemetry.motion.fallDetected ? `Immobility: ${telemetry.motion.inactivityTimer}s` : 'Biometric IMU'}
        />
      </div>

      {/* 3. Environment & Hazard Surveillance Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            ENVIRONMENTAL SURVEILLANCE & DISASTER HAZARD GAUGES
          </span>
          <span className="text-xs font-mono text-slate-500">
            Ambient Sensor Matrix (BME680 Model)
          </span>
        </div>
        <EnvironmentGrid environment={telemetry.environment} />
      </div>

      {/* 4. Real-time Telemetry Graph & 3D Bio-Core Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RealtimeTelemetryChart history={history} />
        </div>

        {/* Mini 3D Bio-Core HUD */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-5 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300">
              3D WEARABLE BIO-CORE
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              SYNCHRONIZED
            </span>
          </div>

          <div className="h-56 w-full relative">
            <WearableVisualizer3D
              status={telemetry.risk.status}
              heartRate={telemetry.health.heartRate}
              riskScore={telemetry.risk.riskScore}
              className="w-full h-full"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Sensor Fusion:</span>
              <strong className="text-slate-200">PPG + Temp + IMU</strong>
            </div>
            <div className="flex justify-between">
              <span>Transmission Rate:</span>
              <strong className="text-emerald-400">1000 ms (1 Hz)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Explainable AI Risk Analysis Panel */}
      <RiskAnalysisPanel risk={telemetry.risk} />

      {/* 6. Disaster Adaptive Operational Modes */}
      <DisasterModeSelector
        currentMode={disasterMode}
        onSelectMode={setDisasterMode}
      />

      {/* 7. Alert Timeline */}
      <AlertTimeline alerts={alerts} onAcknowledge={acknowledgeAlert} />

      {/* 8. Demo Controls Bar for SIH Presentation */}
      <DemoControlBar
        currentScenario={activeScenario}
        onSelectScenario={setScenario}
        isOpenDrawer={isDemoDrawerOpen}
        onCloseDrawer={() => setIsDemoDrawerOpen(false)}
      />
    </div>
  );
};
