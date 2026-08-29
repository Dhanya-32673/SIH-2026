import React from 'react';
import { DemoScenario } from '../../types/health.types';
import { Sparkles, Flame, Wind, UserX, AlertOctagon, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoControlBarProps {
  currentScenario: DemoScenario;
  onSelectScenario: (scenario: DemoScenario) => void;
  isOpenDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  currentScenario,
  onSelectScenario,
  isOpenDrawer = false,
  onCloseDrawer,
}) => {
  const scenarios: Array<{
    id: DemoScenario;
    label: string;
    icon: any;
    color: string;
    border: string;
    bg: string;
    summary: string;
    details: string;
  }> = [
    {
      id: 'NORMAL',
      label: 'Normal Baseline',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      summary: 'HR 72-82, SpO2 98%, Temp 36.7°C, AQI 35 (Good)',
      details: 'Demonstrates baseline homeostasis in normal ambient conditions with low risk score (~12/100).',
    },
    {
      id: 'HEAT_STRESS',
      label: 'Heat Stress',
      icon: Flame,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      summary: 'Env 45°C, Temp 39.4°C, HR 132 BPM, High Humidity',
      details: 'Simulates heat wave exposure triggering hyperthermia, heat strain index spike, and explainable AI warning.',
    },
    {
      id: 'POLLUTION',
      label: 'Air Pollution Risk',
      icon: Wind,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      summary: 'AQI 380 (Hazardous), PM2.5 220, SpO2 91%',
      details: 'Simulates dense smog or industrial disaster event with severe particulate exposure and hypoxia risk.',
    },
    {
      id: 'FALL',
      label: 'Fall Detection',
      icon: UserX,
      color: 'text-orange-400',
      border: 'border-orange-500/40',
      bg: 'bg-orange-500/10',
      summary: '4.3g Impact Spike + Orientation Drop + Immobility',
      details: 'Triggers inertial shock spike, rapid orientation flip to lying down, and initiates 10s emergency countdown.',
    },
    {
      id: 'CRITICAL',
      label: 'Multi-Parameter Critical',
      icon: AlertOctagon,
      color: 'text-red-400',
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      summary: 'HR 154 BPM, SpO2 86%, Temp 40.3°C, AQI 395',
      details: 'Compounding multi-system failure triggering highest severity emergency alert and simulated SOS escalation.',
    },
  ];

  return (
    <>
      {/* 1. Sticky Quick-Switch Floating Bar (Always Accessible for Judges) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 border-r border-slate-800 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold font-mono text-slate-200">
              SIH DEMO CONTROLS:
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-around sm:justify-start overflow-x-auto scrollbar-none py-0.5">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              const isActive = currentScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? `${sc.border} ${sc.bg} text-white shadow-md scale-105`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${sc.color}`} />
                  <span className="hidden md:inline">{sc.label}</span>
                  <span className="md:hidden">{sc.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Full Demonstration Drawer / Modal for In-Depth Presentation */}
      <AnimatePresence>
        {isOpenDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl rounded-3xl glass-panel p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      SIH Live Demonstration Hub
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Select a physiological/disaster scenario to immediately test the system
                    </p>
                  </div>
                </div>

                {onCloseDrawer && (
                  <button
                    onClick={onCloseDrawer}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4 my-6">
                {scenarios.map((sc) => {
                  const Icon = sc.icon;
                  const isActive = currentScenario === sc.id;

                  return (
                    <motion.div
                      key={sc.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        onSelectScenario(sc.id);
                        if (onCloseDrawer) onCloseDrawer();
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isActive
                          ? `${sc.border} ${sc.bg} shadow-lg ring-1 ring-emerald-500/30`
                          : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sc.bg} border ${sc.border}`}>
                          <Icon className={`w-5 h-5 ${sc.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{sc.label}</h4>
                            {isActive && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                                ACTIVE SCENARIO
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{sc.details}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-1">
                            {sc.summary}
                          </p>
                        </div>
                      </div>

                      <button
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono shrink-0 ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {isActive ? 'Simulating...' : 'Launch Scenario'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>
                  <strong className="text-slate-200">How it works:</strong> Clicking a scenario sends a REST / Socket request to the backend simulator, which immediately alters the Brownian drift targets and broadcasts live 1 Hz telemetry to all connected views.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
