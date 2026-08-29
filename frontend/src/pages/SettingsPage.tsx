import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { Settings, Volume2, VolumeX, Cpu, Radio, Shield, HardDrive, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { audioAlertsEnabled, setAudioAlertsEnabled, isConnected } = useHealthData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            SYSTEM PREFERENCES
          </span>
          <span className="text-xs font-mono text-slate-400">
            Audio • Sensors • Endpoints
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Application & Sensor Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure telemetry streams, audible alerts, and future hardware connectivity parameters.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio & Notification Preferences */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audible Alert Signals</h3>
              <p className="text-xs text-slate-400 font-mono">Web Audio API Synthesis</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white">Synthesize Beeps on Hazards</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Play subtle frequency alert tones on Warning and Critical events
              </p>
            </div>

            <button
              onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
              className={`p-3 rounded-xl border transition-all ${
                audioAlertsEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {audioAlertsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Connection & Edge Node Info */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backend Gateway Node</h3>
              <p className="text-xs text-slate-400 font-mono">Socket.IO Stream Channel</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">WebSocket Namespace:</span>
              <strong className="text-white">/health</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connection State:</span>
              <strong className={isConnected ? 'text-emerald-400' : 'text-amber-400'}>
                {isConnected ? '● ONLINE' : '○ CONNECTING'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sampling Cadence:</span>
              <strong className="text-slate-300">1000 ms (1 Hz)</strong>
            </div>
          </div>
        </div>

        {/* Future Hardware Integration Panel */}
        <div className="md:col-span-2 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Future Hardware & MQTT Broker Gateway</h3>
              <p className="text-xs text-slate-400 font-mono">ESP32 / MAX30102 / BME680 Drop-In Connector</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The data ingestion layer is designed around an abstracted <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">IDataNormalizer</code> interface. When physical sensors are connected in subsequent hackathon phases, the ESP32 can publish to an MQTT topic (<code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">sih/devices/&#123;id&#125;/telemetry</code>) which routes directly into the risk engine without altering frontend code.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">TARGET PROTOCOL:</span>
              <strong className="text-white">MQTT v5.0 / WebSockets</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">SECURITY LAYER:</span>
              <strong className="text-emerald-400">mTLS 1.3 Hardware Keys</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">INTEGRATION STATE:</span>
              <strong className="text-slate-300">Architecture Ready (Software Sim)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
