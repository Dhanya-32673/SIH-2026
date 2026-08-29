import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ITelemetryPayload } from '../../types/health.types';
import { Activity, Heart, Thermometer, Wind, Droplets, ShieldAlert } from 'lucide-react';

interface RealtimeTelemetryChartProps {
  history: ITelemetryPayload[];
}

type MetricKey = 'heartRate' | 'spo2' | 'bodyTemperature' | 'envTemp' | 'humidity' | 'aqi' | 'riskScore';

export const RealtimeTelemetryChart: React.FC<RealtimeTelemetryChartProps> = ({ history }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('heartRate');
  const [timeRange, setTimeRange] = useState<'60s' | '5m' | '30m'>('60s');

  const metricConfigs: Record<
    MetricKey,
    {
      label: string;
      unit: string;
      color: string;
      gradient: string;
      icon: any;
      min: number;
      max: number;
      getValue: (d: ITelemetryPayload) => number;
    }
  > = {
    heartRate: {
      label: 'Heart Rate',
      unit: 'BPM',
      color: '#EF4444',
      gradient: 'rgba(239, 68, 68, 0.3)',
      icon: Heart,
      min: 40,
      max: 180,
      getValue: (d) => d.health.heartRate,
    },
    spo2: {
      label: 'SpO2 Oxygen',
      unit: '%',
      color: '#06B6D4',
      gradient: 'rgba(6, 182, 212, 0.3)',
      icon: Activity,
      min: 75,
      max: 100,
      getValue: (d) => d.health.spo2,
    },
    bodyTemperature: {
      label: 'Body Temp',
      unit: '°C',
      color: '#F59E0B',
      gradient: 'rgba(245, 158, 11, 0.3)',
      icon: Thermometer,
      min: 34,
      max: 42,
      getValue: (d) => d.health.bodyTemperature,
    },
    envTemp: {
      label: 'Ambient Temp',
      unit: '°C',
      color: '#FB923C',
      gradient: 'rgba(251, 146, 60, 0.3)',
      icon: Thermometer,
      min: 15,
      max: 50,
      getValue: (d) => d.environment.temperature,
    },
    humidity: {
      label: 'Humidity',
      unit: '%',
      color: '#3B82F6',
      gradient: 'rgba(59, 130, 246, 0.3)',
      icon: Droplets,
      min: 10,
      max: 100,
      getValue: (d) => d.environment.humidity,
    },
    aqi: {
      label: 'Air Quality (AQI)',
      unit: 'AQI',
      color: '#A855F7',
      gradient: 'rgba(168, 85, 247, 0.3)',
      icon: Wind,
      min: 0,
      max: 500,
      getValue: (d) => d.environment.airQuality.aqi,
    },
    riskScore: {
      label: 'AI Risk Score',
      unit: '/100',
      color: '#10B981',
      gradient: 'rgba(16, 185, 129, 0.3)',
      icon: ShieldAlert,
      min: 0,
      max: 100,
      getValue: (d) => d.risk.riskScore,
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  // Filter history based on selected time window
  const pointLimit = timeRange === '60s' ? 60 : timeRange === '5m' ? 120 : 300;
  const filteredHistory = history.slice(-pointLimit);

  // Transform data for Recharts
  const chartData = filteredHistory.map((item, index) => {
    const d = new Date(item.timestamp);
    const timeStr = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    return {
      time: timeStr,
      value: currentConfig.getValue(item),
      scenario: item.scenario,
      status: item.risk.status,
    };
  });

  // If buffer is still young, provide default smooth curve
  if (chartData.length < 2) {
    for (let i = 10; i >= 0; i--) {
      chartData.unshift({
        time: `--:${i * 5}`,
        value: selectedMetric === 'heartRate' ? 75 : selectedMetric === 'spo2' ? 98 : 36.7,
        scenario: 'NORMAL',
        status: 'NORMAL',
      });
    }
  }

  const currentValue = chartData[chartData.length - 1]?.value ?? '--';

  return (
    <div className="rounded-3xl glass-panel p-6 border border-slate-800/80 space-y-5">
      {/* Header with Metric Selector & Range Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              REAL-TIME TELEMETRY STREAM
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              1 Hz LIVE SOCKET
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-xl font-extrabold text-white">
              {currentConfig.label}
            </h3>
            <span className="text-2xl font-mono font-bold" style={{ color: currentConfig.color }}>
              {currentValue} {currentConfig.unit}
            </span>
          </div>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-center">
          {(['60s', '5m', '30m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r === '60s' ? 'Last 60s' : r === '5m' ? 'Last 5m' : 'Last 30m'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(metricConfigs) as MetricKey[]).map((key) => {
          const cfg = metricConfigs[key];
          const Icon = cfg.icon;
          const isSelected = selectedMetric === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />

            <YAxis
              stroke="#64748b"
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs font-mono space-y-1">
                      <p className="text-slate-400">Timestamp: {label}</p>
                      <p className="text-sm font-bold text-white">
                        {currentConfig.label}:{' '}
                        <span style={{ color: currentConfig.color }}>
                          {payload[0].value} {currentConfig.unit}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Status: <span className="font-semibold text-slate-200">{dataPoint.status}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={currentConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${selectedMetric})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
