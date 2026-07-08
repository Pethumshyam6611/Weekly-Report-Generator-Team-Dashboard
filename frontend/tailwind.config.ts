import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          page: 'rgb(var(--color-surface-page) / <alpha-value>)',
          panel: 'rgb(var(--color-surface-panel) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle) / <alpha-value>)'
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)'
        },
        line: 'rgb(var(--color-line) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--color-brand) / <alpha-value>)',
          hover: 'rgb(var(--color-brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--color-brand-soft) / <alpha-value>)',
          border: 'rgb(var(--color-brand-border) / <alpha-value>)'
        },
        status: {
          submitted: 'rgb(var(--color-status-submitted) / <alpha-value>)',
          submittedBg: 'rgb(var(--color-status-submitted-bg) / <alpha-value>)',
          pending: 'rgb(var(--color-status-pending) / <alpha-value>)',
          pendingBg: 'rgb(var(--color-status-pending-bg) / <alpha-value>)',
          late: 'rgb(var(--color-status-late) / <alpha-value>)',
          lateBg: 'rgb(var(--color-status-late-bg) / <alpha-value>)',
          draft: 'rgb(var(--color-status-draft) / <alpha-value>)',
          draftBg: 'rgb(var(--color-status-draft-bg) / <alpha-value>)'
        }
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)'
      },
      borderRadius: {
        panel: '8px'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
