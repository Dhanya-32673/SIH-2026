import React from 'react';
import { DisasterMode } from '../../types/health.types';
import { Shield, SunMedium, Wind, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DisasterModeSelectorProps {
  currentMode: DisasterMode;
  onSelectMode: (mode: DisasterMode) => void;
}

export const DisasterModeSelector: React.FC<DisasterModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const modes: Array<{
    id: DisasterMode;
    label: string;
    description: string;
    icon: any;
    activeBorder: string;
    activeBg: string;
    iconColor: string;
  }> = [
    {
      id: 'NORMAL',
      label: 'Normal Monitoring',
      description: 'Standard baseline vital telemetry & daily wellness surveillance.',
      icon: Shield,
      activeBorder: 'border-emerald-500/50',
      activeBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'HEAT_WAVE',
      label: 'Heat Wave Mode',
      description: 'Prioritizes hyperthermia, heat index, dehydration & tachycardia.',
      icon: SunMedium,
      activeBorder: 'border-amber-500/50',
      activeBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      id: 'POLLUTION',
      label: 'Pollution Mode',
      description: 'Prioritizes particulate exposure, AQI & hypoxemic respiratory strain.',
      icon: Wind,
      activeBorder: 'border-purple-500/50',
      activeBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      id: 'DISASTER',
      label: 'Disaster Mode',
      description: 'Prioritizes fall detection, satellite beacon, and crisis escalation.',
      icon: AlertOctagon,
      activeBorder: 'border-red-500/50',
      activeBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
  ];

  return (
    <div className="rounded-3xl glass-panel p-6 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Disaster Adaptive Modes</h3>
          <p className="text-xs text-slate-400 font-mono">
            Dynamically shifts risk weightings and telemetry prioritization
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-300 uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          Active: {currentMode.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(mode.id)}
              className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between gap-2 ${
                isActive
                  ? `${mode.activeBorder} ${mode.activeBg} shadow-lg`
                  : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-slate-950/80' : 'bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${mode.iconColor}`} />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{mode.label}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
