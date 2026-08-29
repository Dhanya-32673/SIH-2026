import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString?: string): string {
  if (!isoString) return '--:--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getStatusColor(status?: string) {
  switch (status) {
    case 'CRITICAL':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        badge: 'bg-red-500 text-white',
        dot: 'bg-red-500',
      };
    case 'WARNING':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        badge: 'bg-amber-500 text-slate-950',
        dot: 'bg-amber-400',
      };
    case 'NORMAL':
    default:
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
        badge: 'bg-emerald-500 text-slate-950',
        dot: 'bg-emerald-400',
      };
  }
}
