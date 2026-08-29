import React from 'react';
import { IAlertItem } from '../../types/health.types';
import { formatTime } from '../../lib/utils';
import { Bell, AlertTriangle, AlertOctagon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertTimelineProps {
  alerts: IAlertItem[];
  onAcknowledge: (id: string) => void;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({ alerts, onAcknowledge }) => {
  const recentAlerts = alerts.slice(0, 6);

  return (
    <div className="rounded-3xl glass-panel p-6 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Alert Timeline</h3>
            <p className="text-xs text-slate-400 font-mono">
              Persisted Warning & Critical Events
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total: <strong className="text-slate-200">{alerts.length}</strong>
        </span>
      </div>

      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {recentAlerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No recent warning or critical incidents logged.
            </div>
          ) : (
            recentAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : isCritical
                        ? 'bg-red-500/10 border-red-500/30'
                        : isWarning
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-900/60 border-slate-800'
                  } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCritical ? (
                        <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          {alert.message}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            isCritical
                              ? 'bg-red-500 text-white'
                              : isWarning
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {formatTime(alert.timestamp)} • Type: {alert.type}
                      </p>
                    </div>
                  </div>

                  {!alert.acknowledged ? (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1 text-xs font-mono font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shrink-0 self-end sm:self-center"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
