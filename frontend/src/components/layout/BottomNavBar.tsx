import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Activity, Heart, CloudSun, Bell, AlertOctagon } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { telemetry, alerts } = useHealthData();

  if (!isAuthenticated) return null;

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  const navItems = [
    { label: 'Dash', path: '/dashboard', icon: Activity },
    { label: 'Health', path: '/health', icon: Heart },
    {
      label: 'SOS',
      path: '/emergency',
      icon: AlertOctagon,
      highlight: telemetry?.risk.status === 'CRITICAL',
    },
    { label: 'Env', path: '/environment', icon: CloudSun },
    {
      label: 'Alerts',
      path: '/alerts',
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-[#040711]/90 backdrop-blur-xl border-t border-slate-800/60 md:hidden flex justify-around items-center px-2 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 relative transition-all ${
                isActive ? 'text-emerald-400' : 'hover:text-slate-200'
              } ${item.highlight ? 'text-red-500 animate-pulse' : ''}`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5 shrink-0" />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
export default BottomNavBar;
