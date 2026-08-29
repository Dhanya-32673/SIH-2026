import React from 'react';
import { Activity, ShieldCheck, HeartHandshake, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">
              AI-Powered Personal Health Companion
            </p>
            <p className="text-[11px] text-slate-500">
              Smart India Hackathon (SIH 2026) Prototype — Team Sentinel Health
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy By Design (Zero PII)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edge AI Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
            <span>Disaster Resilience Engine</span>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500 font-mono">
          <span>v1.0.0-PROTOTYPE | 100% Simulation Mode</span>
        </div>
      </div>
    </footer>
  );
};
