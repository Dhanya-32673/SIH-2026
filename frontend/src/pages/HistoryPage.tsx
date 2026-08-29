import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { formatTime, formatDate } from '../lib/utils';
import { History, Download, FileSpreadsheet, RefreshCw, BarChart2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(60);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiService.getHistoricalTelemetry(limit);
      if (res?.data) {
        setHistoryData(res.data);
      }
    } catch (e) {
      // quiet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [limit]);

  const exportCSV = () => {
    if (!historyData.length) return;
    const headers = [
      'Timestamp',
      'HeartRate_BPM',
      'SpO2_Percent',
      'BodyTemp_C',
      'EnvTemp_C',
      'Humidity_Percent',
      'AQI',
      'RiskScore',
      'Status',
    ];
    const rows = historyData.map((d) => [
      d.timestamp,
      d.heartRate,
      d.spo2,
      d.bodyTemperature,
      d.envTemperature,
      d.humidity,
      d.aqi,
      d.riskScore,
      d.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sih_health_companion_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Compute summary stats
  const hrVals = historyData.map((d) => d.heartRate).filter(Boolean);
  const avgHR = hrVals.length ? Math.round(hrVals.reduce((a, b) => a + b, 0) / hrVals.length) : '--';
  const minHR = hrVals.length ? Math.min(...hrVals) : '--';
  const maxHR = hrVals.length ? Math.max(...hrVals) : '--';

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              AUDIT & TELEMETRY LOG
            </span>
            <span className="text-xs font-mono text-slate-400">
              Ephemeral Sensor Buffer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Historical Vital & Risk Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono shadow-md shadow-emerald-500/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl glass-card p-5 border border-slate-800 space-y-1 font-mono">
          <span className="text-xs text-slate-400">Average Heart Rate:</span>
          <p className="text-2xl font-bold text-white">{avgHR} BPM</p>
        </div>
        <div className="rounded-2xl glass-card p-5 border border-slate-800 space-y-1 font-mono">
          <span className="text-xs text-slate-400">Heart Rate Range (Min - Max):</span>
          <p className="text-2xl font-bold text-cyan-400">{minHR} - {maxHR} BPM</p>
        </div>
        <div className="rounded-2xl glass-card p-5 border border-slate-800 space-y-1 font-mono">
          <span className="text-xs text-slate-400">Total Recorded Ticks:</span>
          <p className="text-2xl font-bold text-emerald-400">{historyData.length} records</p>
        </div>
      </div>

      {/* Telemetry Table */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Detailed Telemetry Log Records</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">View:</span>
            {[30, 60, 120].map((num) => (
              <button
                key={num}
                onClick={() => setLimit(num)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                  limit === num
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {num} pts
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Heart Rate</th>
                <th className="px-4 py-3">SpO2</th>
                <th className="px-4 py-3">Body Temp</th>
                <th className="px-4 py-3">Ambient Temp</th>
                <th className="px-4 py-3">Humidity</th>
                <th className="px-4 py-3">AQI</th>
                <th className="px-4 py-3">Risk Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {historyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{formatTime(row.timestamp)}</td>
                  <td className="px-4 py-3 font-bold text-white">{row.heartRate} BPM</td>
                  <td className="px-4 py-3 text-cyan-400">{row.spo2}%</td>
                  <td className="px-4 py-3 text-amber-400">{row.bodyTemperature}°C</td>
                  <td className="px-4 py-3 text-slate-300">{row.envTemperature}°C</td>
                  <td className="px-4 py-3 text-slate-400">{row.humidity}%</td>
                  <td className="px-4 py-3 text-purple-400">{row.aqi}</td>
                  <td className="px-4 py-3 font-bold">{row.riskScore}/100</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        row.status === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400'
                          : row.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
