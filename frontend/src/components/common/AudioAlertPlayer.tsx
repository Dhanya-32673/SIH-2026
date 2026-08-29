import React, { useEffect, useRef } from 'react';
import { useHealthData } from '../../context/HealthDataContext';

export const AudioAlertPlayer: React.FC = () => {
  const { telemetry, audioAlertsEnabled, emergency } = useHealthData();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastAlertTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!audioAlertsEnabled) return;

    const status = telemetry?.risk.status;
    const isCritical = status === 'CRITICAL' || !!emergency;
    const isWarning = status === 'WARNING';

    const now = Date.now();
    const minInterval = isCritical ? 4000 : 8000;

    if ((isCritical || isWarning) && now - lastAlertTimeRef.current > minInterval) {
      lastAlertTimeRef.current = now;
      playBeep(isCritical ? 'critical' : 'warning');
    }
  }, [telemetry?.risk.status, emergency, audioAlertsEnabled]);

  const playBeep = (type: 'warning' | 'critical') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'critical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context might be blocked by browser autoplay policy until user gesture
    }
  };

  return null;
};
