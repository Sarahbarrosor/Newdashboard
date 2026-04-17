import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF2F7',
          100: '#F0C0E0',
          600: '#A06090',
          700: '#8C4F7E',
          800: '#703E64',
        },
        ink: {
          DEFAULT: '#15151A',
          soft: '#3E3E48',
          muted: '#9A9AA6',
        },
        surface: {
          DEFAULT: '#FCFCFD',
          card: '#FFFFFF',
          border: '#E8E8ED',
        },
        status: {
          success: '#0F8A5F',
          successBg: '#E4F5EC',
          warning: '#B87300',
          warningBg: '#FBF0DB',
          danger: '#C4314B',
          dangerBg: '#FBE6EA',
          info: '#2F6BCC',
          infoBg: '#E5EEFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(21,21,26,0.04)',
        sm: '0 1px 2px rgba(21,21,26,0.06), 0 1px 3px rgba(21,21,26,0.04)',
        md: '0 4px 12px rgba(21,21,26,0.06), 0 2px 4px rgba(21,21,26,0.04)',
        lg: '0 10px 24px rgba(21,21,26,0.08), 0 4px 8px rgba(21,21,26,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
