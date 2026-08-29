import React from 'react';
import { IRiskAssessment } from '../../types/health.types';
import { motion } from 'framer-motion';
import {
  Brain,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Flame,
  Activity,
  Wind,
  Shield,
  Layers,
} from 'lucide-react';

interface RiskAnalysisPanelProps {
  risk: IRiskAssessment;
}

export const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({ risk }) => {
  const factorList = [
    {
      key: 'temperatureRisk',
      label: 'Thermal Strain',
      value: risk.factors?.temperatureRisk ?? 10,
      icon: Flame,
      color: 'text-orange-400',
      bar: 'bg-orange-500',
    },
    {
      key: 'heartRateRisk',
      label: 'Cardiovascular Workload',
      value: risk.factors?.heartRateRisk ?? 5,
      icon: Activity,
      color: 'text-red-400',
      bar: 'bg-red-500',
    },
    {
      key: 'spo2Risk',
      label: 'Oxygen Saturation Risk',
      value: risk.factors?.spo2Risk ?? 5,
      icon: Activity,
      color: 'text-cyan-400',
      bar: 'bg-cyan-500',
    },
    {
      key: 'environmentRisk',
      label: 'Ambient Hazard Exposure',
      value: risk.factors?.environmentRisk ?? 10,
      icon: Wind,
      color: 'text-purple-400',
      bar: 'bg-purple-500',
    },
    {
      key: 'fallRisk',
      label: 'Fall / Impact Inertia',
      value: risk.factors?.fallRisk ?? 0,
      icon: Shield,
      color: 'text-amber-400',
      bar: 'bg-amber-500',
    },
  ];

  return (
    <div className="rounded-3xl glass-panel p-6 border border-slate-800/80 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Explainable AI Risk Engine
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Transparent Multi-Factor Risk Assessment
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
          Swappable TinyML Architecture
        </span>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/70">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Biometric & Environmental Risk Vector Breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {factorList.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${factor.color}`} />
                    <span className="text-slate-300">{factor.label}</span>
                  </div>
                  <span className="font-bold text-slate-200">{factor.value}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.value}%` }}
                    transition={{ duration: 0.5 }}
                    className={`${factor.bar} h-full rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explainability "WHY?" Panel */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Explainability Synthesis — Why was this score computed?</span>
        </div>

        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2">
          {risk.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Recommended Actions */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Recommended Mitigation Protocol</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {risk.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
