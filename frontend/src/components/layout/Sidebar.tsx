import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import {
  Activity,
  Heart,
  CloudSun,
  Bell,
  AlertOctagon,
  History,
  Shield,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onOpenDemoDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemoDrawer }) => {
  const { isAuthenticated, logout } = useAuth();
  const { telemetry, alerts } = useHealthData();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  if (!isAuthenticated) return null;

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Activity },
    { label: 'Health', path: '/health', icon: Heart },
    { label: 'Environment', path: '/environment', icon: CloudSun },
    {
      label: 'Alerts',
      path: '/alerts',
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    {
      label: 'Emergency',
      path: '/emergency',
      icon: AlertOctagon,
      highlight: telemetry?.risk.status === 'CRITICAL',
    },
    { label: 'History', path: '/history', icon: History },
    { label: 'Privacy', path: '/privacy', icon: Shield },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 h-screen z-40 bg-[#040711]/95 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-between overflow-x-hidden hidden md:flex ${
        isHovered ? 'w-64 shadow-2xl shadow-emerald-950/20' : 'w-16'
      }`}
    >
      {/* Top: Branding Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/60 shrink-0 gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {isHovered && (
          <span className="font-extrabold text-xs tracking-wider text-white whitespace-nowrap animate-in fade-in duration-300">
            BIO-SENTINEL
          </span>
        )}
      </div>

      {/* Center: Scrollable Navigation List */}
      <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none px-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                } ${item.highlight ? 'text-red-400 animate-pulse' : ''}`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {isHovered ? (
                <span className="whitespace-nowrap animate-in slide-in-from-left-2 duration-200">
                  {item.label}
                </span>
              ) : (
                <div className="absolute left-16 bg-slate-950 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              )}

              {item.badge !== undefined && (
                <span
                  className={`absolute right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isHovered
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950 w-2 h-2 p-0 text-transparent top-2'
                  }`}
                >
                  {isHovered ? item.badge : ''}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Demo Button & Sign Out */}
      <div className="p-2.5 border-t border-slate-800/60 shrink-0 space-y-2">
        {onOpenDemoDrawer && isHovered && (
          <button
            onClick={onOpenDemoDrawer}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/10 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Demo</span>
          </button>
        )}

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`w-full flex items-center rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all ${
            isHovered ? 'px-4 py-2.5 gap-3 justify-start' : 'p-3 justify-center'
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {isHovered && <span className="whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
