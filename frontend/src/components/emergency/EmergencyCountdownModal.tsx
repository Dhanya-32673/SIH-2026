import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthData } from '../../context/HealthDataContext';
import {
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Heart,
  Thermometer,
  Activity,
  Wind,
  Radio,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EmergencyCountdownModal: React.FC = () => {
  const { emergency, telemetry, respondEmergency, clearEmergency } = useHealthData();
  const [minimized, setMinimized] = useState(false);

  // Active if emergency state exists and is not dismissed
  const isEmergencyActive =
    (emergency && emergency.state !== 'USER_CONFIRMED_SAFE') ||
    (telemetry?.risk.status === 'CRITICAL' && !emergency);

  if (!isEmergencyActive || minimized) return null;

  const countdown = emergency?.countdownRemaining ?? 10;
  const isEscalated = emergency?.state === 'ESCALATED' || countdown === 0;

  const handleSafe = async () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
    } catch (e) {}
    await respondEmergency('SAFE');
  };

  const handleNeedHelp = async () => {
    await respondEmergency('NEED_HELP');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.35)] overflow-hidden relative"
      >
        {/* Urgent pulsating top banner */}
        <div className="bg-gradient-to-r from-red-600 via-crimson to-red-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center animate-bounce">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase">
                {isEscalated ? '🚨 EMERGENCY DISPATCH ESCALATED (SIMULATED)' : '🚨 CRITICAL HEALTH RISK DETECTED'}
              </h2>
              <p className="text-xs text-red-100 font-mono">
                {telemetry?.risk.riskType.replace(/_/g, ' ') || 'SEVERE MULTI-PARAMETER RISK'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-red-100"
            title="Minimize modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {!isEscalated ? (
            <>
              {/* Countdown Dial Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950/70 border border-red-500/30">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    AUTOMATIC ESCALATION COUNTDOWN
                  </span>
                  <p className="text-xs text-slate-300">
                    If no response is registered, simulated distress beacon will broadcast.
                  </p>
                </div>

                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EF4444"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - countdown / 10)}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="absolute font-extrabold font-mono text-3xl text-red-400">
                    {countdown}s
                  </span>
                </div>
              </div>

              {/* Critical Parameters Snapshot */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                  AFFECTED PHYSIOLOGICAL PARAMETERS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">HR</span>
                      <strong className="text-white">{telemetry?.health.heartRate} BPM</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">SpO2</span>
                      <strong className="text-white">{telemetry?.health.spo2}%</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">TEMP</span>
                      <strong className="text-white">{telemetry?.health.bodyTemperature}°C</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">AQI</span>
                      <strong className="text-white">{telemetry?.environment.airQuality.aqi}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-xs text-red-200 space-y-1">
                <span className="font-bold font-mono text-red-400 block mb-1">
                  CRITICAL ASSESSMENT REASONS:
                </span>
                {telemetry?.risk.reasons.map((r, i) => (
                  <p key={i}>• {r}</p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleSafe}
                  className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>I'M SAFE (DISMISS)</span>
                </button>

                <button
                  onClick={handleNeedHelp}
                  className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>NEED IMMEDIATE HELP</span>
                </button>
              </div>
            </>
          ) : (
            /* Escalated State View */
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-red-500/15 border border-red-500/40 text-center space-y-2">
                <Radio className="w-8 h-8 text-red-400 mx-auto animate-pulse" />
                <h3 className="text-lg font-extrabold text-white">
                  EMERGENCY DISPATCH INITIATED (SIMULATION)
                </h3>
                <p className="text-xs text-red-200">
                  Simulated biometric distress packet transmitted to emergency contact network and local disaster response coordinator.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>SIMULATED GPS BEACON</span>
                  </div>
                  <p className="text-white font-bold">16.4419° N, 80.6222° E</p>
                  <p className="text-slate-500 text-[10px]">
                    SIH Hackathon Campus, AP, India (Accuracy: 4.8m)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <PhoneCall className="w-4 h-4 text-purple-400" />
                    <span>DESIGNATED ICE CONTACT</span>
                  </div>
                  <p className="text-white font-bold">Guardian / Field Medic (+91-98765-XXXXX)</p>
                  <p className="text-slate-500 text-[10px]">SMS & Mesh Telemetry Broadcasted</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={handleSafe}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  Confirm Safe & Clear Alert
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-center text-slate-500 font-mono">
            Notice: All emergency operations in this prototype are strictly simulated for SIH demonstration.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
