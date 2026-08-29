import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { Heart, Activity, Thermometer, Zap, Shield, Waves, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthPage: React.FC = () => {
  const { telemetry, history } = useHealthData();

  if (!telemetry) return null;

  const ppgSamples = telemetry.health.ppgWaveform || [0.1, 0.4, 0.9, 0.7, 0.3, 0.15, 0.1];

  // SVG waveform string
  const ppgPath = ppgSamples
    .map((val, idx) => {
      const x = (idx / (ppgSamples.length - 1)) * 300;
      const y = 80 - val * 70;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            DEEP-DIVE PHYSIOLOGY
          </span>
          <span className="text-xs font-mono text-slate-400">
            PPG • Temp • Oxygenation • Inertia
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Detailed Health Telemetry & Vitals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Continuous biometric surveillance simulated from optical PPG and precision thermistor arrays.
        </p>
      </div>

      {/* Real-Time PPG Oscilloscope Canvas */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">
              Photoplethysmogram (PPG) Pulse Waveform
            </h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Sampling Rate: <strong className="text-emerald-400">12 Hz</strong></span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Heart Rate: <strong className="text-white">{telemetry.health.heartRate} BPM</strong>
            </span>
          </div>
        </div>

        {/* Oscilloscope View */}
        <div className="w-full h-40 bg-slate-950/90 rounded-2xl border border-slate-800/80 p-4 ecg-grid relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 300 90" className="w-full h-full">
            <path
              d={ppgPath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-500">
            OPTICAL MAX30102 SIMULATION MODEL
          </div>
        </div>
      </div>

      {/* Deep-Dive Parameter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Heart & Cardiovascular */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cardiovascular</h4>
              <p className="text-xs text-slate-400 font-mono">BPM & Rhythm Dynamics</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Heart Rate:</span>
              <strong className="text-white">{telemetry.health.heartRate} BPM</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated HRV:</span>
              <strong className="text-emerald-400">62 ms (Optimal)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trend Vector:</span>
              <strong className="text-slate-200">{telemetry.health.hrTrend}</strong>
            </div>
          </div>
        </div>

        {/* Oxygenation */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">SpO2 Oxygenation</h4>
              <p className="text-xs text-slate-400 font-mono">Pulse Oximetry Saturation</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Current SpO2:</span>
              <strong className="text-white">{telemetry.health.spo2}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hypoxia Risk Margin:</span>
              <strong className={telemetry.health.spo2 < 93 ? 'text-amber-400' : 'text-emerald-400'}>
                {telemetry.health.spo2 < 93 ? 'Narrow / At Risk' : 'Normal Reserve'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trend Vector:</span>
              <strong className="text-slate-200">{telemetry.health.spo2Trend}</strong>
            </div>
          </div>
        </div>

        {/* Thermal Regulation */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Thermoregulation</h4>
              <p className="text-xs text-slate-400 font-mono">Body Core Temperature</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Body Temperature:</span>
              <strong className="text-white">{telemetry.health.bodyTemperature}°C</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thermal Strain Status:</span>
              <strong className={telemetry.health.bodyTemperature >= 38.5 ? 'text-red-400' : 'text-emerald-400'}>
                {telemetry.health.bodyTemperature >= 38.5 ? 'Hyperthermic' : 'Normal Homeostasis'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Trend Vector:</span>
              <strong className="text-slate-200">{telemetry.health.tempTrend}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
