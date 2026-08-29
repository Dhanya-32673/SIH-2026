import React from 'react';
import { motion } from 'framer-motion';
import { IRiskAssessment } from '../../types/health.types';
import { formatTime, getStatusColor } from '../../lib/utils';
import { ShieldCheck, AlertTriangle, AlertOctagon, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface HealthStatusCardProps {
  risk: IRiskAssessment;
  lastUpdated?: string;
  scenario: string;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({
  risk,
  lastUpdated,
  scenario,
}) => {
  const statusStyles = getStatusColor(risk.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border ${statusStyles.border} ${statusStyles.glow} transition-all duration-500`}
    >
      {/* Background status flare */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none ${
          risk.status === 'CRITICAL'
            ? 'bg-red-500'
            : risk.status === 'WARNING'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Overall Status Badge and Label */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              COMPREHENSIVE HEALTH STATUS
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Scenario: {scenario}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusStyles.bg} border ${statusStyles.border}`}
            >
              {risk.status === 'NORMAL' && (
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              )}
              {risk.status === 'WARNING' && (
                <AlertTriangle className="w-7 h-7 text-amber-400 animate-pulse" />
              )}
              {risk.status === 'CRITICAL' && (
                <AlertOctagon className="w-7 h-7 text-red-400 animate-bounce" />
              )}
            </div>

            <div>
              <motion.h2
                key={risk.status}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${statusStyles.text}`}
              >
                {risk.status === 'NORMAL' && 'HEALTHY & STABLE'}
                {risk.status === 'WARNING' && 'HEALTH RISK WARNING'}
                {risk.status === 'CRITICAL' && 'CRITICAL EMERGENCY RISK'}
              </motion.h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary Indication:{' '}
                <span className="font-semibold text-slate-200">
                  {risk.riskType === 'NONE'
                    ? 'Optimal Physiological Baseline'
                    : risk.riskType.replace(/_/g, ' ')}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Risk Score & Confidence Meter */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
          {/* Risk Score Pill */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl px-5 py-3 min-w-[130px]">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">
              AI RISK SCORE
            </span>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                key={risk.riskScore}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className={`text-3xl font-extrabold font-mono ${statusStyles.text}`}
              >
                {risk.riskScore}
              </motion.span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
          </div>

          {/* AI Confidence Meter */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl px-5 py-3 min-w-[130px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-[11px] font-mono text-slate-400">AI CONFIDENCE</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">
                {risk.confidence}%
              </span>
            </div>
          </div>

          {/* Live Sync Timestamp */}
          <div className="hidden xl:flex flex-col items-end justify-center text-right pl-2 font-mono text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>LIVE TELEMETRY</span>
            </div>
            <span>{formatTime(lastUpdated)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
