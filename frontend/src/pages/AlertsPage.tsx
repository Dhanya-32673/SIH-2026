import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { formatTime, formatDate } from '../lib/utils';
import { Bell, AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, Search, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert } = useHealthData();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'UNACKNOWLEDGED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'CRITICAL' && alert.severity !== 'CRITICAL') return false;
    if (filterSeverity === 'WARNING' && alert.severity !== 'WARNING') return false;
    if (filterSeverity === 'UNACKNOWLEDGED' && alert.acknowledged) return false;
    if (searchTerm) {
      const match =
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const exportAlertsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sih_health_companion_alerts_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              INCIDENT LOG
            </span>
            <span className="text-xs font-mono text-slate-400">
              MongoDB Persisted Event Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Alerts & Incident History
          </h1>
        </div>

        <button
          onClick={exportAlertsJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold self-start sm:self-auto transition-all"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Alert Log (JSON)</span>
        </button>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by message or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {(['ALL', 'UNACKNOWLEDGED', 'CRITICAL', 'WARNING'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterSeverity(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all border ${
                filterSeverity === filter
                  ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filteredAlerts.length === 0 ? (
            <div className="rounded-3xl glass-panel p-12 text-center text-xs font-mono text-slate-500 border border-slate-800 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-slate-300 font-bold text-sm">No alerts matching filter.</p>
              <p>System status is nominal or filtered events do not exist in active log.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-5 rounded-2xl glass-panel border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                      : isCritical
                        ? 'bg-red-500/10 border-red-500/30'
                        : isWarning
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-900/60 border-slate-800'
                  } flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400'
                          : isWarning
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isCritical ? (
                        <AlertOctagon className="w-5 h-5 animate-pulse" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{alert.message}</h3>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
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

                      {alert.reasons && alert.reasons.length > 0 && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.reasons[0]}
                        </p>
                      )}

                      <p className="text-[11px] font-mono text-slate-500">
                        {formatDate(alert.timestamp)} at {formatTime(alert.timestamp)} • Incident Type: {alert.type}
                      </p>
                    </div>
                  </div>

                  {!alert.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shrink-0 self-end md:self-center"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 shrink-0 self-end md:self-center">
                      <CheckCircle2 className="w-4 h-4" />
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
