import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { SunMedium, Wind, Droplets, Flame, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { EnvironmentGrid } from '../components/dashboard/EnvironmentGrid';

export const EnvironmentPage: React.FC = () => {
  const { telemetry } = useHealthData();

  if (!telemetry) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            DISASTER & CLIMATE SENTINEL
          </span>
          <span className="text-xs font-mono text-slate-400">
            Heat Waves • AQI • Humidity • Extreme Hazards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Environmental Hazard & Disaster Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Continuous atmospheric telemetry identifying environmental health hazards in normal conditions and disaster scenarios.
        </p>
      </div>

      {/* Main Environmental Sensor Matrix */}
      <EnvironmentGrid environment={telemetry.environment} />

      {/* Detailed Hazard Assessment Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heat Wave & Thermal Stress Module */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                NOAA Apparent Heat Strain Assessment
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Thermodynamic Heat Index Calculation
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Ambient Temperature:</span>
              <strong className="text-white">{telemetry.environment.temperature}°C</strong>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Relative Humidity:</span>
              <strong className="text-white">{telemetry.environment.humidity}%</strong>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-t border-slate-800 pt-2">
              <span className="text-slate-300 font-bold">Apparent Heat Index:</span>
              <strong className="text-lg text-orange-400">{telemetry.environment.heatIndex}°C</strong>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
            {telemetry.environment.heatIndex >= 42 ? (
              <p className="text-orange-300 font-semibold">
                ⚠️ DANGER: Heat stroke highly likely with continued exposure. Seek immediate shade and air-cooling.
              </p>
            ) : telemetry.environment.heatIndex >= 35 ? (
              <p className="text-amber-300">
                ⚡ CAUTION: Fatigue and heat cramps possible with prolonged physical activity.
              </p>
            ) : (
              <p className="text-emerald-300">
                ✅ Optimal Thermal Environment: Ambient parameters are within safe human biological tolerance.
              </p>
            )}
          </div>
        </div>

        {/* Air Quality & Particulate Hazard Module */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Wind className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Particulate Matter & Toxic Air Index
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                PM2.5 Particle Inhalation Exposure
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">AQI Rating:</span>
              <strong className="text-white">{telemetry.environment.airQuality.aqi} AQI</strong>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Fine Particulate PM2.5:</span>
              <strong className="text-white">{telemetry.environment.airQuality.pm25} µg/m³</strong>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-t border-slate-800 pt-2">
              <span className="text-slate-300 font-bold">Exposure Classification:</span>
              <strong className="text-purple-400 uppercase">{telemetry.environment.airQuality.status}</strong>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
            {telemetry.environment.airQuality.aqi >= 300 ? (
              <p className="text-red-300 font-semibold">
                🚨 HAZARDOUS SMOG: Health warning of emergency conditions. N95 respirator mandatory.
              </p>
            ) : telemetry.environment.airQuality.aqi >= 150 ? (
              <p className="text-purple-300">
                ⚠️ UNHEALTHY: Sensitive individuals should avoid outdoor exertion and use air filtration.
              </p>
            ) : (
              <p className="text-emerald-300">
                ✅ GOOD: Air quality is considered satisfactory, and air pollution poses little or no risk.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
