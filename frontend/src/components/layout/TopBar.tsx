import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Activity, Radio, LogIn, Sparkles } from 'lucide-react';

interface TopBarProps {
  onOpenDemoDrawer?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenDemoDrawer }) => {
  const { isAuthenticated } = useAuth();
  const { isConnected, disasterMode } = useHealthData();
  const navigate = useNavigate();

  const disasterModeColors: Record<string, string> = {
    NORMAL: 'border-slate-700 text-slate-300 bg-slate-800/60',
    HEAT_WAVE: 'border-amber-500/50 text-amber-300 bg-amber-500/10',
    POLLUTION: 'border-purple-500/50 text-purple-300 bg-purple-500/10',
    DISASTER: 'border-red-500/50 text-red-300 bg-red-500/10 animate-pulse',
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#040711]/80 backdrop-blur-xl transition-all duration-300 ${
        isAuthenticated ? 'pl-0 md:pl-16' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Branding Logo (Only shown for guest users since logged in users have sidebar branding) */}
        {!isAuthenticated ? (
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-wider font-display text-white">
                  AI HEALTH COMPANION
                </span>
                <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  SIH'26
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>COMMAND CONSOLE MONITOR</span>
          </div>
        )}

        {/* Right Section: HUD Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Disaster Mode Apparent Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              disasterModeColors[disasterMode] || disasterModeColors.NORMAL
            }`}
          >
            <Radio className="w-3 h-3 shrink-0" />
            <span className="uppercase">{disasterMode.replace('_', ' ')}</span>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/80 border border-slate-800">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isConnected
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-slate-300">
              {isConnected ? 'LIVE SYNC' : 'RECONNECTING'}
            </span>
          </div>

          {/* Sign In link if not authenticated */}
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/10 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
