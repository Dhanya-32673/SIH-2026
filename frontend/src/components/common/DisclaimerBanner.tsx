import React, { useState } from 'react';
import { Info, X, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300 flex items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-emerald-400 font-semibold uppercase tracking-wider">SIH Prototype Notice:</strong>{' '}
          This system demonstrates continuous physiological & disaster risk simulation. All indicators and risk scores are strictly non-diagnostic assistive alerts and do not contact real emergency services.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white transition-colors p-1"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
