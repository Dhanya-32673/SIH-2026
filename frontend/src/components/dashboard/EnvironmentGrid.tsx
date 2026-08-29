import React from 'react';
import { IEnvironmentMetrics } from '../../types/health.types';
import { Thermometer, Droplets, Wind, Gauge, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnvironmentGridProps {
  environment: IEnvironmentMetrics;
}

export const EnvironmentGrid: React.FC<EnvironmentGridProps> = ({ environment }) => {
  const aqiStatus = environment.airQuality.status;

  const aqiColorMap = {
    GOOD: {
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      bar: 'bg-emerald-500',
    },
    MODERATE: {
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      bar: 'bg-amber-500',
    },
    POOR: {
      text: 'text-orange-400',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      bar: 'bg-orange-500',
    },
    HAZARDOUS: {
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
      bar: 'bg-red-500',
    },
  }[aqiStatus] || {
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bar: 'bg-emerald-500',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Ambient Temperature */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl glass-card p-4 border border-slate-800/80"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Ambient Temp</span>
          </div>
          {environment.temperature >= 40 ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
              EXTREME
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              NORMAL
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-extrabold font-mono text-white">
            {environment.temperature}
          </span>
          <span className="text-xs text-slate-400 font-mono">°C</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          Sensible Heat Level
        </p>
      </motion.div>

      {/* 2. Relative Humidity */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl glass-card p-4 border border-slate-800/80"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Humidity</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {environment.humidity > 70 ? 'HIGH MOISTURE' : 'OPTIMAL'}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-extrabold font-mono text-white">
            {environment.humidity}
          </span>
          <span className="text-xs text-slate-400 font-mono">% RH</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${environment.humidity}%` }}
          />
        </div>
      </motion.div>

      {/* 3. Air Quality Index (AQI) */}
      <motion.div
        whileHover={{ y: -2 }}
        className={`rounded-2xl glass-card p-4 border ${
          aqiStatus === 'HAZARDOUS' ? 'border-red-500/40 bg-red-500/[0.03]' : 'border-slate-800/80'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Wind className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Air Quality (AQI)</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${aqiColorMap.badge}`}>
            {aqiStatus}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-1.5 my-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold font-mono ${aqiColorMap.text}`}>
              {environment.airQuality.aqi}
            </span>
            <span className="text-xs text-slate-400 font-mono">AQI</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            PM2.5: <strong className="text-slate-200">{environment.airQuality.pm25}</strong> µg/m³
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`${aqiColorMap.bar} h-full rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, (environment.airQuality.aqi / 500) * 100)}%` }}
          />
        </div>
      </motion.div>

      {/* 4. Heat Index & Barometer */}
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-2xl glass-card p-4 border border-slate-800/80"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Heat Strain Index</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">NOAA Model</span>
        </div>
        <div className="flex items-baseline justify-between gap-1.5 my-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {environment.heatIndex}
            </span>
            <span className="text-xs text-slate-400 font-mono">°C Apparent</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>{environment.pressure} hPa</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          {environment.heatIndex >= 42
            ? '⚠️ Danger: Heat Stroke High Probability'
            : environment.heatIndex >= 35
              ? '⚡ Extreme Caution: Muscle Cramps Risk'
              : 'Safe Environmental Baseline'}
        </p>
      </motion.div>
    </div>
  );
};
