/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slatey: {
          950: '#080B14',
          900: '#0D1221',
          850: '#10131f',
          800: '#121829',
          700: '#18203A',
          600: '#1E2847',
          500: '#273356',
        },
        amber: {
          DEFAULT: '#F5A623',
          50: '#fff8e8',
          100: '#fdedc0',
          200: '#fbe08a',
          300: '#f8cf52',
          400: '#f6ba33',
          500: '#F5A623',
          600: '#d4880f',
          700: '#a96a0c',
          glow: 'rgba(245,166,35,0.28)',
        },
        teal: {
          DEFAULT: '#00C2A8',
          50: '#e6fff9',
          100: '#b3f5e6',
          300: '#33d9c4',
          400: '#00d4ba',
          500: '#00C2A8',
          600: '#009e88',
          700: '#007a68',
        },
        violetx: {
          DEFAULT: '#8B5CF6',
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
        },
        rosex: {
          500: '#F43F5E',
        },
        skyx: {
          400: '#38BDF8',
          500: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeVar: {
          '0%, 100%': { opacity: '0' },
          '15%, 50%': { opacity: '1' },
        },
        spark: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(2.4) rotate(180deg)', opacity: '0' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        fadeVar: 'fadeVar 6s ease-in-out infinite',
        spark: 'spark 700ms ease-out forwards',
        gridPulse: 'gridPulse 3s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
