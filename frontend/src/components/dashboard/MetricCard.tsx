import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  trendText?: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  sparklineData?: number[];
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  trend = 'STABLE',
  trendText,
  status,
  icon: Icon,
  iconColor,
  iconBg,
  sparklineData = [],
  subtitle,
}) => {
  const statusBorder = {
    NORMAL: 'border-slate-800/80 hover:border-slate-700',
    WARNING: 'border-amber-500/40 bg-amber-500/[0.03]',
    CRITICAL: 'border-red-500/50 bg-red-500/[0.05] animate-pulse',
  }[status];

  const statusBadge = {
    NORMAL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30 font-bold',
  }[status];

  // SVG Sparkline path generator
  const generateSparklinePath = (data: number[], width = 100, height = 28) => {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data) || min + 1;
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl glass-card p-5 border ${statusBorder} flex flex-col justify-between transition-all`}
    >
      {/* Top row: Icon & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {title}
          </span>
        </div>

        <span
          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${statusBadge}`}
        >
          {status}
        </span>
      </div>

      {/* Middle row: Big Value + Unit */}
      <div className="flex items-baseline justify-between gap-2 my-1">
        <div className="flex items-baseline gap-1.5">
          <motion.span
            key={String(value)}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white"
          >
            {value}
          </motion.span>
          <span className="text-xs font-medium text-slate-400 font-mono">{unit}</span>
        </div>

        {/* Sparkline mini-graph */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="w-24 h-7">
            <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke={status === 'CRITICAL' ? '#EF4444' : status === 'WARNING' ? '#F59E0B' : '#10B981'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom row: Trend or Subtitle */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
        <div className="flex items-center gap-1 font-mono">
          {trend === 'UP' && (
            <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
          )}
          {trend === 'DOWN' && (
            <TrendingDown className="w-3 h-3 text-cyan-400 shrink-0" />
          )}
          {trend === 'STABLE' && (
            <Minus className="w-3 h-3 text-slate-500 shrink-0" />
          )}
          <span className="text-slate-400">
            {trendText || `${trend.toLowerCase()} trend`}
          </span>
        </div>

        {subtitle && <span className="text-[10px] text-slate-500">{subtitle}</span>}
      </div>
    </motion.div>
  );
};
