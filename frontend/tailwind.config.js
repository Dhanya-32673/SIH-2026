/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#040711',
        surface: {
          50: '#111827',
          100: '#1f2937',
          200: '#111827',
          300: '#0b0f19',
          400: '#030712',
        },
        health: {
          green: '#10B981',
          emerald: '#059669',
          amber: '#F97316',
          red: '#EF4444',
          crimson: '#B91C1C',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          blue: '#6366F1',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Space Grotesk',
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'Orbitron',
          'Space Grotesk',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-urgent': 'pulseUrgent 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-flow': 'waveFlow 4s linear infinite',
        'glow-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseUrgent: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.75, transform: 'scale(1.03)' },
        },
        waveFlow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
