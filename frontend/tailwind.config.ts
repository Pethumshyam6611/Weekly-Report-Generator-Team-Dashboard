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
          page: '#F8F7FB',
          panel: '#FFFFFF',
          subtle: '#F1EDFB'
        },
        ink: {
          DEFAULT: '#1A1A1F',
          muted: '#6B6B76',
          faint: '#8B8796'
        },
        line: '#E5E3EC',
        brand: {
          DEFAULT: '#5B3FA6',
          hover: '#4F3593',
          soft: '#F1EDFB',
          border: '#D9CEF3'
        },
        status: {
          submitted: '#18794E',
          submittedBg: '#EAF7F0',
          pending: '#9A6700',
          pendingBg: '#FFF5D6',
          late: '#B42318',
          lateBg: '#FDECEC',
          draft: '#5D5A66',
          draftBg: '#F1F0F4'
        }
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.04)'
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
