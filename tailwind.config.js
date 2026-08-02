/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cohesive dark palette anchored on #B6FF3C acid lime.
        ink: {
          900: '#0A0A0A',  // page background
          800: '#111111',  // surface
          700: '#171717',  // raised surface
          600: '#1F1F1F',  // border
          500: '#2A2A2A',
          400: '#3A3A3A',
          300: '#6B6B6B',  // muted text
          200: '#A3A3A3',  // body text
          100: '#EDEDED',  // primary text
        },
        lime: {
          DEFAULT: '#B6FF3C',
          dim: '#8FCC2E',
          glow: 'rgba(182, 255, 60, 0.35)',
        },
      },
      fontFamily: {
        // System geometric sans; avoids a network font fetch and keeps the bundle small.
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lime: '0 0 0 1px rgba(182,255,60,0.35), 0 0 24px rgba(182,255,60,0.18)',
        'lime-soft': '0 0 0 1px rgba(182,255,60,0.18), 0 0 12px rgba(182,255,60,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'marquee': 'marquee 30s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
