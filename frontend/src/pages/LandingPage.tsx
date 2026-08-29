import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WearableVisualizer3D } from '../components/3d/WearableVisualizer3D';
import { useHealthData } from '../context/HealthDataContext';
import {
  Activity,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  SunMedium,
  Wind,
  HeartHandshake,
  Cpu,
  Lock,
  Radio,
  Sliders,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { telemetry, activeScenario, setScenario } = useHealthData();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Premium Visual Design Grid and Floating Orbs */}
      <div className="grid-overlay absolute inset-0 opacity-[0.08] pointer-events-none" />
      <div className="glow-orb-primary absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none blur-[100px] opacity-75" />
      <div className="glow-orb-secondary absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full pointer-events-none blur-[100px] opacity-60" />

      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 PROTOTYPE • PRIVACY-FIRST HEALTH INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Detect health risks{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                before they become emergencies.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Real-time biometric intelligence with environmental hazard awareness, explainable AI risk scoring, privacy-first edge processing, and multi-disaster resilience.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <Activity className="w-4 h-4" />
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setScenario('HEAT_STRESS');
                  navigate('/dashboard');
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explore Live SIH Demo</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">1 Hz</div>
                <div className="text-xs text-slate-400">Continuous Telemetry</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-400">Zero PII</div>
                <div className="text-xs text-slate-400">Privacy by Design</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">4 Modes</div>
                <div className="text-xs text-slate-400">Disaster Adaptive</div>
              </div>
            </div>
          </motion.div>

          {/* Right 3D Visualizer Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="w-full max-w-md h-[380px] sm:h-[420px] rounded-3xl glass-panel p-2 border border-slate-700/80 relative shadow-2xl">
              <WearableVisualizer3D
                status={telemetry?.risk.status || 'NORMAL'}
                heartRate={telemetry?.health.heartRate || 74}
                riskScore={telemetry?.risk.riskScore || 12}
                className="w-full h-full"
              />
            </div>
            <p className="text-xs font-mono text-slate-500 mt-3 text-center">
              Interactive 3D Wearable Bio-Core (Rotates with Cursor & Telemetry)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built for Extreme Conditions & Real-World Disasters
          </h2>
          <p className="text-sm text-slate-400">
            A complete full-stack architecture that seamlessly scales from everyday fitness surveillance to extreme disaster early-warning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <SunMedium className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-base font-bold text-white">Heat Wave Sentinel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates apparent NOAA heat index and physiological core strain, warning before heat exhaustion becomes critical.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Wind className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">Pollution & Air Hazard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors fine particulate matter (PM2.5) and AQI alongside blood oxygen levels to preempt respiratory emergencies.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Explainable AI Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero black-box decisions. Natural-language reasons and multi-factor breakdown explain every calculated risk score.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Privacy By Design</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edge-first processing architecture, zero requirement for PII or identifiable medical data, and user-controlled history.
            </p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Deep Technical Specifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Wearable Sensor Fusion & Telemetry Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our hardware blueprints combine high-frequency physiological parameters with micro-atmospheric gas sensors to produce a robust telemetry array. In this prototype phase, all variables are generated via dynamic, continuous-drift physics engines:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 mt-0.5">1</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">MAX30102 PPG Rhythm Analysis</h4>
                  <p className="text-xs text-slate-400">Continuous blood oxygenation (SpO2) oximetry combined with cardiac pulse-wave metrics to detect hypoxemic conditions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 mt-0.5">2</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">MPU6050 6-Axis Inertial Motion</h4>
                  <p className="text-xs text-slate-400">Bi-directional accelerometer vector monitoring to catch sudden g-force spikes (&gt;3.8g impact) followed by orientation collapse and inactivity.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs font-mono font-bold text-orange-400 mt-0.5">3</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">BME680 Environmental Profiler</h4>
                  <p className="text-xs text-slate-400">Precision monitoring of ambient heat limits, apparent air pressure, relative humidity, and air particulate quality indices (AQI/PM2.5).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Spec Table */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800/80 pb-2">
                <tr>
                  <th className="py-2.5">Sensor Node</th>
                  <th className="py-2.5">Metric</th>
                  <th className="py-2.5">Normal Baseline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                <tr>
                  <td className="py-3 font-bold text-white">MAX30102</td>
                  <td className="py-3">Heart Rate / SpO2</td>
                  <td className="py-3 text-emerald-400">65-85 BPM / 95-100%</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">MAX30205</td>
                  <td className="py-3">Body Core Temp</td>
                  <td className="py-3 text-emerald-400">36.3°C - 37.2°C</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">BME680</td>
                  <td className="py-3">Apparent AQI / Temp</td>
                  <td className="py-3 text-emerald-400">0-50 AQI / 22-28°C</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">MPU6050</td>
                  <td className="py-3">Inertial Shock Gs</td>
                  <td className="py-3 text-emerald-400">~1.0g static vector</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NEW SECTION: LoRaWAN & RF Mesh Disaster Resilience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">Disaster Mesh Networking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When catastrophic events dismantle standard cellular networks, the companion node activates an automated **LoRaWAN / RF Mesh transceiver**. It routes encrypted biometric distress telemetry packets peer-to-peer to decentralized rescue gateways, bypassing standard internet requirements entirely.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Absolute Resilience in Crisis Situations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The AI Health Companion operates under a strict crisis survival model. In flood, cyclone, or extreme thermal events, the hardware changes telemetry protocols to save power and guarantees long-range data propagation up to 10 kilometers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">STANDBY POWER</span>
                <strong className="text-white">Up to 45 Days</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">MESH PROPAGATION</span>
                <strong className="text-white">Peer-to-Peer 10km</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SECURITY</span>
                <strong className="text-white">AES-128 Encryption</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
