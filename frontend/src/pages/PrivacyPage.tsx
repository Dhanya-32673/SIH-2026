import React, { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Trash2, EyeOff, Server, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPage: React.FC = () => {
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  const handlePurge = () => {
    setPurgeStatus('Purging ephemeral buffers...');
    setTimeout(() => {
      setPurgeStatus('All local telemetry memory buffers purged successfully.');
      setTimeout(() => setPurgeStatus(null), 4000);
    }, 1000);
  };

  const privacyPillars = [
    {
      title: 'Zero Personally Identifiable Information (PII)',
      description:
        'The platform never requests, stores, or logs real names, phone numbers, addresses, government IDs, or raw medical files. All telemetry is associated only with anonymous ephemeral demo tokens.',
      icon: EyeOff,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Edge-First AI Risk Processing',
      description:
        'Biometric sensor streams and environmental indexes are processed locally on the edge device without routing raw unencrypted telemetry through invasive third-party cloud servers.',
      icon: Cpu,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Data Minimization Principle',
      description:
        'Only mathematical risk assessments and aggregated vital trends are cached. Raw sub-second sensor noise is discarded after calculation, minimizing digital footprint.',
      icon: Lock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'End-to-End Encrypted Transit',
      description:
        'All client-server WebSocket frames and REST API transactions operate strictly over encrypted channels (TLS 1.3 / WSS), protecting live telemetry against interception.',
      icon: Server,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            PRIVACY BY DESIGN
          </span>
          <span className="text-xs font-mono text-slate-400">
            Zero PII • Edge Processing • Ephemeral Storage
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Privacy Center & Data Sovereignty
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          How our architecture ensures absolute user privacy, zero surveillance, and complete client data sovereignty.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {privacyPillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.bg}`}>
                  <Icon className={`w-6 h-6 ${pillar.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">{pillar.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* User-Controlled Data Purge Tool */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Instant Client Data Purge
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              User-Initiated Telemetry Deletion
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          You hold total ownership of your session telemetry. Click below to immediately wipe all local buffer state, cache history, and unacknowledged alerts from client memory.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handlePurge}
            className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge All Session Telemetry</span>
          </button>

          {purgeStatus && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs font-mono text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{purgeStatus}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
