import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import {
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Heart,
  Activity,
  Thermometer,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const EmergencyPage: React.FC = () => {
  const { emergency, telemetry, respondEmergency } = useHealthData();

  const isEmergency = !!emergency && emergency.state !== 'USER_CONFIRMED_SAFE';
  const isEscalated = emergency?.state === 'ESCALATED';

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

  const handleSOS = async () => {
    await respondEmergency('NEED_HELP');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            CRISIS & DISASTER HUB
          </span>
          <span className="text-xs font-mono text-slate-400">
            Automated Escalation Protocol (Simulated)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Emergency Command Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Autonomous early-warning and distress escalation gateway for sudden physiological collapses, falls, and severe multi-stress events.
        </p>
      </div>

      {/* Main Status Hero */}
      <div
        className={`rounded-3xl glass-panel p-6 sm:p-8 border ${
          isEmergency
            ? 'border-red-500/80 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
            : 'border-emerald-500/30 bg-emerald-500/5'
        } space-y-6`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isEmergency ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {isEmergency ? (
                <AlertOctagon className="w-8 h-8" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                SENTINEL CRISIS STATUS
              </span>
              <h2 className="text-2xl font-black text-white">
                {isEscalated
                  ? 'EMERGENCY DISPATCH ESCALATED (SIMULATED)'
                  : isEmergency
                    ? `CRITICAL RISK DETECTED (${emergency?.countdownRemaining ?? 10}s COUNTDOWN)`
                    : 'NOMINAL MONITORING — NO ACTIVE CRISIS'}
              </h2>
              <p className="text-xs text-slate-300">
                {isEmergency
                  ? 'Continuous biometrics crossed emergency safety thresholds.'
                  : 'All biometric and environmental sensors are operating within nominal boundaries.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {isEmergency ? (
              <>
                <button
                  onClick={handleSafe}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Confirm Safe & Dismiss
                </button>
                <button
                  onClick={handleSOS}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
                >
                  Immediate SOS Dispatch
                </button>
              </>
            ) : (
              <button
                onClick={handleSOS}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-mono font-bold transition-all"
              >
                Simulate Manual SOS Trigger
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock GNSS Emergency Beacon */}
        <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simulated GNSS Emergency Beacon</h3>
              <p className="text-xs text-slate-400 font-mono">Dual-Frequency L1/L5 Satellite Fix</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Coordinates:</span>
              <strong className="text-white">16.4419° N, 80.6222° E</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location Label:</span>
              <strong className="text-emerald-400">SIH Hackathon Campus, AP</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Horizontal Precision:</span>
              <strong className="text-slate-300">4.8 meters</strong>
            </div>
          </div>
        </div>

        {/* ICE Emergency Contact Network */}
        <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">In Case of Emergency (ICE) Network</h3>
              <p className="text-xs text-slate-400 font-mono">Designated Guardians & Field Medics</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Contact:</span>
              <strong className="text-white">Guardian (+91-98765-XXXXX)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Disaster Response Node:</span>
              <strong className="text-purple-400">Disaster Ops Node #14</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transmission Channel:</span>
              <strong className="text-slate-300">LoRaWAN / Cellular Mesh</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
